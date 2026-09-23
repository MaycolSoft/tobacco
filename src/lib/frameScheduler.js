// frameScheduler.js
// Decide qué frames descargar/decodificar según el frame que pide GSAP.
// - Concurrencia acotada (config.concurrency) con prioridad dinámica por distancia y dirección.
// - Ventana de red (prefetchAhead/Behind): los frames se descargan a la caché persistente.
// - Ventana de decodificación (decodedFrameLimit): solo los más cercanos se decodifican y
//   quedan en memoria; al salir se liberan con close().
// Los índices son 0-based (como frameRef.index); los archivos son 1-based (frame_0001.webp).

import { getOrDownloadFrame, decodeFrame, cacheDiagnostics, configureFrameCache } from "@/lib/frameCache";

const isAbort = (error) => error?.name === "AbortError";

let activeScheduler = null;

// Diagnóstico para herramientas internas; se lee por polling, no dispara renders.
export function getFrameDiagnostics() {
  return { ...cacheDiagnostics, ...(activeScheduler?.stats() ?? {}) };
}

export class FrameScheduler {
  constructor({ profile, config, onFrameReady }) {
    this.profile = profile;
    this.frameCount = profile.frameCount;
    this.config = config;
    this.onFrameReady = onFrameReady;

    this.decoded = new Map();   // index -> { frame, generation }
    this.tasks = new Map();     // index -> { controller | null } (en cola o en curso)
    this.queue = new Set();     // índices en cola, aún sin empezar
    this.fetched = new Set();   // índices ya descargados en esta sesión (caché persistente)
    this.blobs = new Map();     // index -> Blob codificado precargado y aún sin decodificar
    this.failedAt = new Map();  // index -> timestamp del último fallo
    this.active = 0;

    this.target = 0;
    this.direction = 1;
    this.focus = null;          // destino de un salto (FloatingSteps)

    this.renderSize = null;
    this.sourceSize = null;
    this.decodeSize = null;
    this.generation = 0;
    this.disposed = false;

    configureFrameCache({ budgetBytes: config.cacheBudgetBytes, ttlMs: config.cacheTtlMs });
    activeScheduler = this;
  }

  clamp(index) {
    return Math.min(Math.max(Math.round(index), 0), Math.max(this.frameCount - 1, 0));
  }

  get center() {
    return this.focus ?? this.target;
  }

  // Ventana de red: más frames en la dirección del movimiento.
  networkBounds() {
    const { prefetchAhead: ahead, prefetchBehind: behind } = this.config;
    const c = this.center;
    return this.direction >= 0
      ? [this.clamp(c - behind), this.clamp(c + ahead)]
      : [this.clamp(c - ahead), this.clamp(c + behind)];
  }

  // Ventana de decodificación: decodedFrameLimit frames repartidos en la misma proporción.
  decodeBounds() {
    const { prefetchAhead: ahead, prefetchBehind: behind, decodedFrameLimit: limit } = this.config;
    const span = Math.max(limit - 1, 0);
    const forward = ahead + behind > 0 ? Math.round((span * ahead) / (ahead + behind)) : span;
    const backward = span - forward;
    const c = this.center;
    return this.direction >= 0
      ? [this.clamp(c - backward), this.clamp(c + forward)]
      : [this.clamp(c - forward), this.clamp(c + backward)];
  }

  inDecodeWindow(index) {
    const [lo, hi] = this.decodeBounds();
    return index >= lo && index <= hi;
  }

  // Menor = más prioritario. El frame pedido es 0; hacia atrás cuesta más que hacia adelante.
  score(index) {
    const { prefetchAhead: ahead, prefetchBehind: behind } = this.config;
    const delta = (index - this.center) * (this.direction >= 0 ? 1 : -1);
    if (delta >= 0) return delta;
    return -delta * Math.max(1, (ahead + 1) / (behind + 1));
  }

  needsDecode(index) {
    const entry = this.decoded.get(index);
    return !entry || entry.generation !== this.generation;
  }

  needsWork(index) {
    if (this.inDecodeWindow(index)) return this.needsDecode(index);
    return !this.fetched.has(index) && !this.blobs.has(index);
  }

  recentlyFailed(index) {
    const at = this.failedAt.get(index);
    if (at === undefined) return false;
    if (Date.now() - at < this.config.failedFrameCooldownMs) return true;
    this.failedAt.delete(index);
    return false;
  }

  setTarget(index, direction = 0) {
    if (this.disposed || this.frameCount === 0) return;
    const next = this.clamp(index);
    if (direction) this.direction = direction > 0 ? 1 : -1;
    if (next === this.target) return;
    this.target = next;
    // El salto terminó cuando el frame visible llega a la zona del destino.
    if (this.focus !== null && Math.abs(next - this.focus) <= this.config.prefetchBehind) this.focus = null;
    this.refresh();
  }

  // Prioriza un destino lejano (FloatingSteps) sin exigir los frames intermedios.
  setFocus(index) {
    if (this.disposed || this.frameCount === 0) return;
    const next = this.clamp(index);
    if (next !== this.target) this.direction = next > this.target ? 1 : -1;
    this.focus = next;
    this.refresh();
  }

  clearFocus() {
    if (this.focus === null) return;
    this.focus = null;
    this.refresh();
  }

  setRenderSize(width, height) {
    this.renderSize = { width, height };
    this.updateDecodeSize();
    this.refresh();
  }

  // Los bitmaps se decodifican ya escalados al tamaño en que se dibujan (nunca más grandes que el original).
  updateDecodeSize() {
    if (!this.renderSize || !this.sourceSize) return;
    const scale = Math.min(
      this.renderSize.width / this.sourceSize.width,
      this.renderSize.height / this.sourceSize.height,
      1
    );
    const next = {
      width: Math.max(1, Math.round(this.sourceSize.width * scale)),
      height: Math.max(1, Math.round(this.sourceSize.height * scale)),
    };
    const current = this.decodeSize;
    if (current && Math.abs(current.width - next.width) <= 2 && Math.abs(current.height - next.height) <= 2) return;
    this.decodeSize = next;
    // Los bitmaps existentes siguen sirviendo como respaldo hasta que se re-decodifiquen.
    this.generation++;
  }

  updateConfig(config) {
    this.config = config;
    configureFrameCache({ budgetBytes: config.cacheBudgetBytes, ttlMs: config.cacheTtlMs });
    this.evictDecoded();
    this.refresh();
  }

  refresh() {
    if (this.disposed || this.frameCount === 0) return;
    const [lo, hi] = this.networkBounds();
    const margin = this.config.prefetchAhead + this.config.prefetchBehind;

    // Lo que ya no está en la ventana: fuera de la cola; las descargas muy lejanas se abortan.
    for (const index of this.queue) {
      if (index < lo || index > hi) {
        this.queue.delete(index);
        this.tasks.delete(index);
      }
    }
    for (const [index, task] of this.tasks) {
      if (task.controller && (index < lo - margin || index > hi + margin)) task.controller.abort();
    }

    for (let index = lo; index <= hi; index++) {
      if (!this.tasks.has(index) && this.needsWork(index) && !this.recentlyFailed(index)) {
        this.tasks.set(index, { controller: null });
        this.queue.add(index);
      }
    }

    this.pump();
  }

  pump() {
    while (!this.disposed && this.active < this.config.concurrency && this.queue.size > 0) {
      let best = -1;
      let bestScore = Infinity;
      for (const index of this.queue) {
        const score = this.score(index);
        if (score < bestScore) {
          bestScore = score;
          best = index;
        }
      }
      this.queue.delete(best);
      this.load(best);
    }
  }

  async load(index) {
    const task = this.tasks.get(index) ?? { controller: null };
    task.controller = new AbortController();
    this.tasks.set(index, task);
    this.active++;

    const frameNumber = index + 1;
    try {
      // Si se precargó hace poco, se decodifica desde memoria sin volver a IndexedDB/red.
      const { blob } = this.blobs.get(index) ? { blob: this.blobs.get(index) } : await getOrDownloadFrame({
        key: this.profile.cacheKey(frameNumber),
        url: this.profile.frameUrl(frameNumber),
        videoName: this.profile.folder,
        frame: frameNumber,
        signal: task.controller.signal,
        retryCount: this.config.retryCount,
        retryBaseDelayMs: this.config.retryBaseDelayMs,
      });
      this.fetched.add(index);
      this.failedAt.delete(index);

      // Se decide al terminar la descarga: el usuario pudo haberse movido mientras tanto.
      if (this.disposed || !this.needsDecode(index)) return;
      if (!this.inDecodeWindow(index)) {
        this.rememberBlob(index, blob);
        return;
      }
      this.blobs.delete(index);

      let generation = this.generation;
      let frame = await decodeFrame(blob, this.decodeSize);

      if (!this.sourceSize) {
        // El primer frame revela el tamaño original; desde ahí se decodifica ya escalado.
        this.sourceSize = { width: frame.width, height: frame.height };
        this.updateDecodeSize();
      }
      // Si el tamaño objetivo cambió durante la decodificación (primer frame, resize),
      // se re-escala desde el blob que ya está en memoria en vez de volver a descargarlo.
      const size = this.decodeSize;
      if (!this.disposed && size && generation !== this.generation && (size.width !== frame.width || size.height !== frame.height)) {
        const stale = frame;
        generation = this.generation;
        frame = await decodeFrame(blob, size);
        stale.close();
      }

      if (this.disposed) {
        frame.close();
        return;
      }

      this.storeDecoded(index, frame, generation);
      this.onFrameReady?.(index);
    } catch (error) {
      if (!isAbort(error) && !this.disposed) {
        this.failedAt.set(index, Date.now());
        console.warn(`FrameScheduler: frame ${frameNumber} no disponible`, error);
      }
    } finally {
      this.active--;
      if (this.tasks.get(index) === task) this.tasks.delete(index);
      if (!this.disposed) this.refresh();
    }
  }

  storeDecoded(index, frame, generation) {
    const previous = this.decoded.get(index);
    if (previous) previous.frame.close();
    this.decoded.set(index, { frame, generation });
    this.evictDecoded();
  }

  // Blobs precargados (comprimidos, ~1.5 MB c/u): como máximo lo que cabe en la ventana de red.
  // Evita depender de la escritura en IndexedDB (que puede fallar o no haber terminado).
  rememberBlob(index, blob) {
    this.blobs.set(index, blob);
    const limit = this.config.prefetchAhead + this.config.prefetchBehind + 1;
    while (this.blobs.size > limit) {
      let worst = -1;
      let worstScore = -1;
      for (const key of this.blobs.keys()) {
        const score = this.score(key);
        if (score > worstScore) {
          worstScore = score;
          worst = key;
        }
      }
      this.blobs.delete(worst);
    }
  }

  // Memoria acotada: se libera el frame decodificado más lejano del punto de interés.
  evictDecoded() {
    while (this.decoded.size > this.config.decodedFrameLimit) {
      let worst = -1;
      let worstScore = -1;
      for (const index of this.decoded.keys()) {
        const score = this.score(index);
        if (score > worstScore) {
          worstScore = score;
          worst = index;
        }
      }
      this.decoded.get(worst).frame.close();
      this.decoded.delete(worst);
    }
  }

  // Frame pedido o, si no está listo, el decodificado más cercano (búsqueda acotada, sin recorrer todo).
  // En empate prefiere el que queda detrás en la dirección del movimiento (ya visto).
  getDrawable(index) {
    const requested = this.clamp(index);
    const radius = this.config.fallbackRadius;
    const back = this.direction >= 0 ? -1 : 1;
    for (let distance = 0; distance <= radius; distance++) {
      const behind = this.decoded.get(requested + back * distance);
      if (behind) return { index: requested + back * distance, frame: behind.frame };
      const ahead = this.decoded.get(requested - back * distance);
      if (ahead) return { index: requested - back * distance, frame: ahead.frame };
    }
    return null;
  }

  stats() {
    return {
      profile: this.profile.mode,
      currentFrame: this.target + 1,
      frameCount: this.frameCount,
      decodedFrames: this.decoded.size,
      prefetchedBlobs: this.blobs.size,
      queueLength: this.queue.size,
      activeDownloads: this.active,
      failedFrames: this.failedAt.size,
    };
  }

  dispose() {
    this.disposed = true;
    for (const task of this.tasks.values()) task.controller?.abort();
    this.tasks.clear();
    this.queue.clear();
    for (const { frame } of this.decoded.values()) frame.close();
    this.decoded.clear();
    this.blobs.clear();
    if (activeScheduler === this) activeScheduler = null;
  }
}
