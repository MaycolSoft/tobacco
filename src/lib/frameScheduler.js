// frameScheduler.js
// Decide qué frames descargar y decodificar según el frame que pide GSAP.
//
// Pipeline en dos etapas con límites propios:
//   descarga (config.concurrency)  → blob comprimido (memoria + IndexedDB)
//   decodificación (config.decodeConcurrency) → ImageBitmap listo para el canvas
//
// Tres niveles de prioridad para las descargas:
//   critical   → el frame pedido (o el punto al que llegará el scroll) y sus vecinos inmediatos
//   prefetch   → el resto de la ventana cercana, en la dirección del movimiento
//   background → el resto de la secuencia, de forma progresiva, con los slots libres
//
// Una descarga que ya empezó NO se cancela por el scroll: termina y queda en caché.
// Solo se aborta al cerrar/desmontar o cambiar de video/fuente (dispose()).
//
// Antes de ir al CDN: memoria decodificada → blob en memoria → IndexedDB → descarga en curso → CDN.
// El render nunca espera el frame exacto: dibuja el decodificado más cercano (ver getDrawable).
// Los índices son 0-based (como frameRef.index); los archivos son 1-based (frame_0001.webp).

import {
  getOrDownloadFrame, getCachedFrameKeys, decodeFrame, cacheDiagnostics, configureFrameCache,
} from "@/lib/frameCache";

const isAbort = (error) => error?.name === "AbortError";

const THROUGHPUT_WINDOW_MS = 3000;
const MAX_STRIDE = 8;
// Frames ya pasados (detrás del último render) solo sirven si el usuario vuelve: prioridad mínima.
const PASSED_PENALTY = 10000;
// Los huecos entre frames salteados van después de todos los frames del stride.
const GAP_PENALTY = 1000;
// Puntaje máximo de una descarga "critical" (el frame pedido y ±2 vecinos).
const CRITICAL_SCORE = 5;
const DEFAULT_FRAME_BYTES = 1.6 * 1024 * 1024;

let activeScheduler = null;

// Diagnóstico para herramientas internas; se lee por polling, no dispara renders.
export function getFrameDiagnostics() {
  return { ...cacheDiagnostics, ...(activeScheduler?.stats() ?? {}) };
}

// Búsqueda binaria: primera posición con valor >= target.
function lowerBound(sorted, target) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export class FrameScheduler {
  constructor({ profile, config, onFrameReady }) {
    this.profile = profile;
    this.frameCount = profile.frameCount;
    this.config = config;
    this.onFrameReady = onFrameReady;

    this.decoded = new Map();      // index -> { frame, generation }            estado "decoded"
    this.decodedSorted = [];       // índices decodificados ordenados (búsqueda del más cercano)
    this.blobs = new Map();        // index -> Blob comprimido en memoria         estado "cached" (memoria)
    this.cached = new Set();       // índices guardados en IndexedDB              estado "cached"
    this.failedAt = new Map();     // index -> timestamp del último fallo         estado "failed"

    this.downloadQueue = new Set();                                            // estado "queued"
    this.downloads = new Map();    // index -> { controller, kind }              estado "downloading"
    this.decodeQueue = new Set();
    this.decodes = new Map();      // index -> Promise (dedup de decodificación)  estado "decoding"
    this.decodeSet = new Set();    // los decodedFrameLimit frames más útiles ahora mismo

    // Seguimiento de objetivo vs. lo dibujado (pueden diferir bajo presión de red)
    this.requestedFrame = 0;
    this.lastRenderedFrame = -1;
    this.lastDirection = 1;
    this.lastStableTarget = 0;
    this.focus = null;             // destino de un salto (FloatingSteps)
    this.moving = false;
    this.velocity = 0;             // frames/s pedidos por el scroll (media móvil)
    this.lastTargetAt = 0;
    this.stationaryTimer = null;
    this.backgroundPosition = null; // último frame enviado a precarga en segundo plano

    // Rendimiento medido
    this.completions = [];         // [timestamp, bytesDeRed] de entregas recientes
    this.avgLatencyMs = 500;
    this.avgDecodeMs = 0;
    this.avgFrameBytes = DEFAULT_FRAME_BYTES;
    this.stride = 1;
    this.lead = 0;

    this.renderSize = null;
    this.sourceSize = null;
    this.decodeSize = null;
    this.generation = 0;
    this.disposed = false;

    this.frameSource = new Map();  // index -> "network" | "indexeddb" (origen del blob)
    this.warmBlobs = new Set();    // blobs que ya estaban en memoria antes de necesitarse (memory hit al decodificar)
    this.counters = {
      exactRenders: 0, fallbackRenders: 0, maxLag: 0,
      cancelledDownloads: 0,       // cancelaciones por scroll (debe quedar en 0)
      abortedOnClose: 0,           // cancelaciones al cerrar / cambiar de video
      memoryHits: 0,               // decodificados desde un blob que ya estaba en memoria
      persistentHits: 0,           // leídos de IndexedDB (sin red)
      networkDownloads: 0,
      backgroundDownloads: 0,
    };

    configureFrameCache({ budgetBytes: config.cacheBudgetBytes, ttlMs: config.cacheTtlMs });
    activeScheduler = this;

    // Qué frames de esta secuencia ya están en IndexedDB (solo claves): la precarga los salta.
    const prefix = `${profile.folder}:frame:`;
    getCachedFrameKeys(prefix).then((keys) => {
      if (this.disposed) return;
      keys.forEach((key) => {
        const frame = Number(key.slice(prefix.length));
        if (frame >= 1 && frame <= this.frameCount) this.cached.add(frame - 1);
      });
      this.refresh();
    });
  }

  clamp(index) {
    return Math.min(Math.max(Math.round(index), 0), Math.max(this.frameCount - 1, 0));
  }

  get center() {
    return this.focus ?? this.requestedFrame;
  }

  get refining() {
    return this.focus !== null || !this.moving;
  }

  // ---------- Estados ----------

  frameState(index) {
    if (this.decoded.has(index)) return "decoded";
    if (this.decodes.has(index)) return "decoding";
    if (this.downloads.has(index)) return "downloading";
    if (this.blobs.has(index) || this.cached.has(index)) return "cached";
    if (this.downloadQueue.has(index)) return "queued";
    if (this.failedAt.has(index)) return "failed";
    return "idle";
  }

  // ---------- Objetivo ----------

  setTarget(index, direction = 0) {
    if (this.disposed || this.frameCount === 0) return;
    const next = this.clamp(index);
    if (direction) this.lastDirection = direction > 0 ? 1 : -1;
    if (next === this.requestedFrame) return;

    const now = performance.now();
    const dt = (now - this.lastTargetAt) / 1000;
    const instant = dt > 0 && dt < 0.5 ? Math.abs(next - this.requestedFrame) / dt : 0;
    this.velocity = this.moving ? this.velocity * 0.7 + instant * 0.3 : instant;
    this.lastTargetAt = now;
    this.requestedFrame = next;
    this.moving = true;

    // El salto terminó cuando el frame pedido llega a la zona del destino.
    if (this.focus !== null && Math.abs(next - this.focus) <= this.config.prefetchBehind) this.focus = null;

    // Si el scroll se detiene, refinar al frame exacto.
    clearTimeout(this.stationaryTimer);
    this.stationaryTimer = setTimeout(() => {
      this.moving = false;
      this.velocity = 0;
      this.lastStableTarget = this.requestedFrame;
      this.refresh();
    }, this.config.stationaryDelayMs);

    this.refresh();
  }

  // Prioriza un destino lejano (FloatingSteps) sin exigir los frames intermedios.
  setFocus(index) {
    if (this.disposed || this.frameCount === 0) return;
    const next = this.clamp(index);
    if (next !== this.requestedFrame) this.lastDirection = next > this.requestedFrame ? 1 : -1;
    this.focus = next;
    this.refresh();
  }

  clearFocus() {
    if (this.focus === null) return;
    this.focus = null;
    this.refresh();
  }

  // ---------- Tamaño de decodificación ----------

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

  // ---------- Prioridad ----------

  // Frames por segundo que se están entregando (últimos 3 s, red o IndexedDB).
  deliveryRate(now = performance.now()) {
    while (this.completions.length && now - this.completions[0][0] > THROUGHPUT_WINDOW_MS) this.completions.shift();
    return (this.completions.length * 1000) / THROUGHPUT_WINDOW_MS;
  }

  // Salteo y anticipación según velocidad de scroll vs. velocidad de entrega.
  updateMotion() {
    if (this.refining) {
      this.stride = 1;
      this.lead = 0;
      return;
    }
    const rate = this.deliveryRate() || this.config.concurrency / Math.max(this.avgLatencyMs / 1000, 0.05);
    this.stride = this.velocity > rate ? Math.min(MAX_STRIDE, Math.ceil(this.velocity / Math.max(rate, 0.5))) : 1;
    // Dónde estará el usuario cuando termine una descarga iniciada ahora.
    this.lead = Math.min(this.config.prefetchAhead, Math.round((this.velocity * this.avgLatencyMs) / 1000));
  }

  // Ventana cercana (critical + prefetch): más frames en la dirección del movimiento.
  networkBounds() {
    const { prefetchAhead: ahead, prefetchBehind: behind } = this.config;
    const c = this.center;
    const forward = ahead + this.lead;
    return this.lastDirection >= 0
      ? [this.clamp(c - behind), this.clamp(c + forward)]
      : [this.clamp(c - forward), this.clamp(c + behind)];
  }

  // Prioridad de descarga. Menor = antes.
  score(index) {
    const dir = this.lastDirection;
    const delta = (index - this.center) * dir;

    if (this.refining) {
      // Quieto o en un salto: exacto y vecinos (N, N+1, N-1, ...).
      return delta >= 0 ? delta * 2 : -delta * 2 + 1;
    }

    if (delta >= 0) {
      // Cerca del punto donde estará el usuario al llegar la descarga.
      let score = Math.abs(delta - this.lead);
      if (this.stride > 1 && delta % this.stride !== 0) score += GAP_PENALTY;
      return score;
    }

    // Detrás del frame pedido: útil si todavía está por delante de lo dibujado (hace avanzar la imagen).
    const passed = this.lastRenderedFrame >= 0 && (index - this.lastRenderedFrame) * dir <= 0;
    return passed ? PASSED_PENALTY - delta : this.lead - delta * 2;
  }

  // Prioridad para decodificar/conservar en memoria: lo más cercano al frame pedido,
  // que es justamente lo que getDrawable va a dibujar. En empate, la dirección del scroll.
  decodeScore(index) {
    const delta = (index - this.requestedFrame) * this.lastDirection;
    return Math.abs(delta) + (delta < 0 ? 0.5 : 0);
  }

  needsDecode(index) {
    const entry = this.decoded.get(index);
    return !entry || entry.generation !== this.generation;
  }

  recentlyFailed(index) {
    const at = this.failedAt.get(index);
    if (at === undefined) return false;
    if (Date.now() - at < this.config.failedFrameCooldownMs) return true;
    this.failedAt.delete(index);
    return false;
  }

  // ¿Hay que traer el blob (desde IndexedDB o CDN) para este frame?
  needsBlob(index, wantDecode) {
    if (this.blobs.has(index) || this.downloads.has(index)) return false;
    // Lo que ya está en IndexedDB solo se lee si se va a decodificar.
    return wantDecode || !this.cached.has(index);
  }

  refresh() {
    if (this.disposed || this.frameCount === 0) return;
    this.updateMotion();
    const [lo, hi] = this.networkBounds();

    // 1. Qué conviene tener decodificado: entre lo disponible (blob) o en camino (descargando),
    //    los decodedFrameLimit más cercanos al frame pedido. Incluye lo que quedó entre el último
    //    render y el pedido: si una descarga termina ahí, se decodifica porque hace avanzar la imagen.
    const candidates = [];
    const consider = (index) => {
      if (!this.recentlyFailed(index)) candidates.push([this.decodeScore(index), index]);
    };
    for (const index of this.blobs.keys()) consider(index);
    for (const index of this.downloads.keys()) if (!this.blobs.has(index)) consider(index);
    // El frame pedido y sus vecinos siempre son candidatos (aunque haya que leerlos de IndexedDB).
    for (let offset = -2; offset <= 2; offset++) {
      const index = this.clamp(this.center + offset);
      if (!this.blobs.has(index) && !this.downloads.has(index)) consider(index);
    }
    candidates.sort((a, b) => a[0] - b[0]);
    this.decodeSet = new Set();
    for (const [, index] of candidates) {
      if (this.decodeSet.size >= this.config.decodedFrameLimit) break;
      this.decodeSet.add(index);
    }

    // 2. La cola (trabajo NO iniciado) sí se reprioriza: fuera lo que salió de la ventana.
    //    Las descargas en curso nunca se tocan aquí.
    for (const index of this.downloadQueue) {
      if (index < lo || index > hi || !this.needsBlob(index, this.decodeSet.has(index))) this.downloadQueue.delete(index);
    }
    for (const index of this.decodeQueue) {
      if (!this.decodeSet.has(index) || !this.blobs.has(index)) this.decodeQueue.delete(index);
    }

    // 3. Decodificar lo elegido que ya está en memoria (memory hit, sin IO).
    for (const index of this.decodeSet) {
      if (this.needsDecode(index) && this.blobs.has(index) && !this.decodes.has(index)) this.decodeQueue.add(index);
    }

    // 4. Encolar la ventana cercana (critical + prefetch).
    for (let index = lo; index <= hi; index++) {
      if (this.recentlyFailed(index) || this.downloadQueue.has(index)) continue;
      const wantDecode = this.decodeSet.has(index) && this.needsDecode(index);
      if ((wantDecode || !this.decoded.has(index)) && this.needsBlob(index, wantDecode)) this.downloadQueue.add(index);
    }
    for (const index of this.decodeSet) {
      if (this.needsDecode(index) && this.needsBlob(index, true) && !this.recentlyFailed(index)) this.downloadQueue.add(index);
    }

    this.pump();
  }

  peekBest(queue) {
    let best = -1;
    let bestScore = Infinity;
    for (const index of queue) {
      const score = this.score(index);
      if (score < bestScore) {
        bestScore = score;
        best = index;
      }
    }
    return [best, bestScore];
  }

  // Precarga en segundo plano: el próximo frame sin descargar, avanzando desde el final de la
  // ventana cercana en la dirección del scroll y dando la vuelta a toda la secuencia.
  // Se detiene al llenar el presupuesto de caché (si no, el LRU borraría lo recién precargado).
  nextBackgroundFrame() {
    if (this.config.backgroundSlots <= 0 || this.refiningJump()) return -1;
    const budgetFrames = Math.floor((this.config.cacheBudgetBytes * 0.9) / this.avgFrameBytes);
    if (this.cached.size >= budgetFrames) return -1;

    const [lo, hi] = this.networkBounds();
    const dir = this.lastDirection;
    const start = dir >= 0 ? hi + 1 : lo - 1;
    for (let step = 0; step < this.frameCount; step++) {
      const index = (((start + dir * step) % this.frameCount) + this.frameCount) % this.frameCount;
      if (
        !this.cached.has(index) && !this.blobs.has(index) && !this.downloads.has(index) &&
        !this.downloadQueue.has(index) && !this.recentlyFailed(index)
      ) {
        return index;
      }
    }
    return -1;
  }

  // Durante un salto (FloatingSteps) toda la red va al destino.
  refiningJump() {
    return this.focus !== null;
  }

  pump() {
    while (!this.disposed && this.decodes.size < this.config.decodeConcurrency && this.decodeQueue.size > 0) {
      let best = -1;
      let bestScore = Infinity;
      for (const index of this.decodeQueue) {
        const score = this.decodeScore(index);
        if (score < bestScore) {
          bestScore = score;
          best = index;
        }
      }
      this.decodeQueue.delete(best);
      this.decode(best);
    }

    const { concurrency } = this.config;
    const reserve = Math.min(this.config.backgroundSlots, concurrency - 1);
    let background = -2; // -2 = aún no calculado
    const backgroundActive = () => [...this.downloads.values()].filter((d) => d.kind === "background").length;

    while (!this.disposed && this.downloads.size < concurrency) {
      const [best, bestScore] = this.peekBest(this.downloadQueue);
      if (background === -2) background = this.nextBackgroundFrame();
      const foregroundActive = this.downloads.size - backgroundActive();

      // Critical siempre entra. Prefetch deja libres los slots reservados para background (si hay background pendiente).
      const foregroundAllowed = best >= 0 && (
        bestScore <= CRITICAL_SCORE || background < 0 || foregroundActive < concurrency - reserve
      );
      if (foregroundAllowed) {
        this.downloadQueue.delete(best);
        this.download(best, bestScore <= CRITICAL_SCORE ? "critical" : "prefetch");
      } else if (background >= 0 && (backgroundActive() < reserve || best < 0)) {
        this.download(background, "background");
        this.backgroundPosition = background;
        background = -2;
      } else {
        break;
      }
    }
  }

  // ---------- Etapa 1: descarga (IndexedDB → en curso → CDN, deduplicado en frameCache) ----------

  async download(index, kind) {
    const controller = new AbortController();
    const entry = { controller, kind };
    this.downloads.set(index, entry);
    const frameNumber = index + 1;
    const startedAt = performance.now();

    try {
      const { blob, fromCache } = await getOrDownloadFrame({
        key: this.profile.cacheKey(frameNumber),
        url: this.profile.frameUrl(frameNumber),
        videoName: this.profile.folder,
        frame: frameNumber,
        signal: controller.signal,
        retryCount: this.config.retryCount,
        retryBaseDelayMs: this.config.retryBaseDelayMs,
      });
      if (this.disposed) return;

      const now = performance.now();
      this.completions.push([now, fromCache ? 0 : blob.size]);
      this.avgLatencyMs = this.avgLatencyMs * 0.8 + (now - startedAt) * 0.2;
      if (fromCache) {
        this.counters.persistentHits++;
      } else {
        this.counters.networkDownloads++;
        if (kind === "background") this.counters.backgroundDownloads++;
        this.avgFrameBytes = this.avgFrameBytes * 0.9 + blob.size * 0.1;
      }
      this.frameSource.set(index, fromCache ? "indexeddb" : "network");
      // frameCache ya lo guardó en IndexedDB (si la escritura falla, el blob sigue en memoria).
      this.cached.add(index);
      this.failedAt.delete(index);

      // La precarga lejana no ocupa memoria: queda solo en IndexedDB.
      const [lo, hi] = this.networkBounds();
      if (kind !== "background" || (index >= lo && index <= hi) || this.decodeSet.has(index)) {
        this.rememberBlob(index, blob);
        if (!this.decodeSet.has(index)) this.warmBlobs.add(index);
      }
    } catch (error) {
      if (!isAbort(error) && !this.disposed) {
        this.failedAt.set(index, Date.now());
        console.warn(`FrameScheduler: frame ${frameNumber} no disponible`, error);
      }
    } finally {
      if (this.downloads.get(index) === entry) this.downloads.delete(index);
      if (!this.disposed) this.refresh();
    }
  }

  // Blobs comprimidos (~1.5 MB c/u) acotados al tamaño de la ventana cercana.
  // Un blob que sale de memoria sigue en IndexedDB.
  rememberBlob(index, blob) {
    this.blobs.set(index, blob);
    const limit = this.config.prefetchAhead + this.config.prefetchBehind + this.config.decodedFrameLimit;
    while (this.blobs.size > limit) {
      let worst = -1;
      let worstScore = -Infinity;
      for (const key of this.blobs.keys()) {
        if (this.decodes.has(key)) continue;
        const score = this.decodeScore(key);
        if (score > worstScore) {
          worstScore = score;
          worst = key;
        }
      }
      if (worst < 0) break;
      this.blobs.delete(worst);
      this.warmBlobs.delete(worst);
    }
  }

  // ---------- Etapa 2: decodificación (deduplicada por frame) ----------

  decode(index) {
    if (this.decodes.has(index)) return this.decodes.get(index);
    const promise = this.runDecode(index).finally(() => {
      this.decodes.delete(index);
      if (!this.disposed) this.refresh();
    });
    this.decodes.set(index, promise);
    return promise;
  }

  async runDecode(index) {
    const blob = this.blobs.get(index);
    if (!blob) return;
    if (this.warmBlobs.delete(index)) this.counters.memoryHits++;
    const startedAt = performance.now();

    try {
      let generation = this.generation;
      let frame = await decodeFrame(blob, this.decodeSize);

      if (!this.sourceSize) {
        // El primer frame revela el tamaño original; desde ahí se decodifica ya escalado.
        this.sourceSize = { width: frame.width, height: frame.height };
        this.updateDecodeSize();
      }
      // Si el tamaño objetivo cambió durante la decodificación (primer frame, resize),
      // se re-escala desde el mismo blob en vez de volver a descargarlo.
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

      const elapsed = performance.now() - startedAt;
      this.avgDecodeMs = this.avgDecodeMs ? this.avgDecodeMs * 0.8 + elapsed * 0.2 : elapsed;
      this.storeDecoded(index, frame, generation);
      this.onFrameReady?.(index);
    } catch (error) {
      if (!this.disposed) {
        this.failedAt.set(index, Date.now());
        this.blobs.delete(index);
        console.warn(`FrameScheduler: no se pudo decodificar el frame ${index + 1}`, error);
      }
    }
  }

  storeDecoded(index, frame, generation) {
    const previous = this.decoded.get(index);
    if (previous) previous.frame.close();
    else this.decodedSorted.splice(lowerBound(this.decodedSorted, index), 0, index);
    this.decoded.set(index, { frame, generation });
    this.evictDecoded();
  }

  removeDecoded(index) {
    const entry = this.decoded.get(index);
    if (!entry) return;
    entry.frame.close();
    this.decoded.delete(index);
    // Si se vuelve a necesitar, se re-decodifica desde memoria sin IO.
    if (this.blobs.has(index)) this.warmBlobs.add(index);
    const position = lowerBound(this.decodedSorted, index);
    if (this.decodedSorted[position] === index) this.decodedSorted.splice(position, 1);
  }

  // Memoria acotada. Nunca se libera el frame dibujado ni el pedido; del resto,
  // el más lejano del frame pedido (el blob sigue en memoria/IndexedDB para volver a decodificarlo).
  evictDecoded() {
    while (this.decoded.size > this.config.decodedFrameLimit) {
      let worst = -1;
      let worstScore = -Infinity;
      for (const index of this.decoded.keys()) {
        if (index === this.lastRenderedFrame || index === this.requestedFrame) continue;
        const score = this.decodeScore(index);
        if (score > worstScore) {
          worstScore = score;
          worst = index;
        }
      }
      if (worst < 0) break;
      this.removeDecoded(worst);
    }
  }

  // ---------- Render ----------

  // Frames decodificados más cercanos al pedido, sin radio máximo (búsqueda binaria).
  nearestDecoded(requested) {
    const sorted = this.decodedSorted;
    if (sorted.length === 0) return { ahead: -1, behind: -1 };
    const position = lowerBound(sorted, requested);
    const up = position < sorted.length ? sorted[position] : -1;
    const down = sorted[position] === requested ? requested : position > 0 ? sorted[position - 1] : -1;
    return this.lastDirection >= 0 ? { ahead: up, behind: down } : { ahead: down, behind: up };
  }

  // El frame pedido o, si no está, el decodificado más cercano; en empate, el de la dirección del scroll.
  getDrawable(index) {
    const requested = this.clamp(index);
    const exact = this.decoded.get(requested);
    if (exact) return { index: requested, frame: exact.frame, exact: true };

    const { ahead, behind } = this.nearestDecoded(requested);
    if (ahead < 0 && behind < 0) return null;
    let chosen;
    if (ahead < 0) chosen = behind;
    else if (behind < 0) chosen = ahead;
    else chosen = Math.abs(ahead - requested) <= Math.abs(behind - requested) ? ahead : behind;
    return { index: chosen, frame: this.decoded.get(chosen).frame, exact: false };
  }

  noteRendered(index, exact) {
    this.lastRenderedFrame = index;
    if (exact) this.counters.exactRenders++;
    else this.counters.fallbackRenders++;
    this.counters.maxLag = Math.max(this.counters.maxLag, Math.abs(this.requestedFrame - index));
  }

  // ---------- Diagnóstico / ciclo de vida ----------

  stats() {
    const now = performance.now();
    const rate = this.deliveryRate(now);
    const bytes = this.completions.reduce((sum, [, size]) => sum + size, 0);
    const { ahead, behind } = this.nearestDecoded(this.requestedFrame);
    const oneBased = (index) => (index >= 0 ? index + 1 : null);
    const kinds = { critical: 0, prefetch: 0, background: 0 };
    for (const { kind } of this.downloads.values()) kinds[kind]++;
    return {
      profile: this.profile.mode,
      frameCount: this.frameCount,
      currentFrame: this.requestedFrame + 1,
      requestedFrame: this.requestedFrame + 1,
      renderedFrame: oneBased(this.lastRenderedFrame),
      renderedSource: this.frameSource.get(this.lastRenderedFrame) ?? null,
      lastStableTarget: this.lastStableTarget + 1,
      frameLag: this.lastRenderedFrame >= 0 ? Math.abs(this.requestedFrame - this.lastRenderedFrame) : null,
      maxLag: this.counters.maxLag,
      direction: this.lastDirection > 0 ? "forward" : "reverse",
      motion: this.focus !== null ? "jump" : this.moving ? "moving" : "stationary",
      velocity: Math.round(this.velocity),
      stride: this.stride,
      lead: this.lead,
      nearestAhead: oneBased(ahead),
      nearestBehind: oneBased(behind),
      decodedFrames: this.decoded.size,
      prefetchedBlobs: this.blobs.size,
      persistentCachedFrames: this.cached.size,
      queueLength: this.downloadQueue.size,
      decodeQueueLength: this.decodeQueue.size,
      activeDownloads: this.downloads.size,
      activeDownloadKinds: `${kinds.critical}/${kinds.prefetch}/${kinds.background}`,
      activeDecodes: this.decodes.size,
      backgroundPosition: oneBased(this.backgroundPosition ?? -1),
      backgroundDownloads: this.counters.backgroundDownloads,
      framesPerSecond: Math.round(rate * 10) / 10,
      throughputMbps: Math.round(((bytes * 8) / (THROUGHPUT_WINDOW_MS / 1000) / 1e6) * 10) / 10,
      avgLatencyMs: Math.round(this.avgLatencyMs),
      avgDecodeMs: Math.round(this.avgDecodeMs),
      exactRenders: this.counters.exactRenders,
      fallbackRenders: this.counters.fallbackRenders,
      memoryHits: this.counters.memoryHits,
      persistentHits: this.counters.persistentHits,
      schedulerNetworkDownloads: this.counters.networkDownloads,
      cancelledDownloads: this.counters.cancelledDownloads,
      failedFrames: this.failedAt.size,
    };
  }

  dispose() {
    this.disposed = true;
    clearTimeout(this.stationaryTimer);
    // Único lugar donde se abortan descargas en curso: cierre, desmontaje o cambio de video/fuente.
    for (const { controller } of this.downloads.values()) {
      controller.abort();
      this.counters.abortedOnClose++;
    }
    this.downloads.clear();
    this.downloadQueue.clear();
    this.decodeQueue.clear();
    for (const { frame } of this.decoded.values()) frame.close();
    this.decoded.clear();
    this.decodedSorted = [];
    this.blobs.clear();
    if (activeScheduler === this) activeScheduler = null;
  }
}
