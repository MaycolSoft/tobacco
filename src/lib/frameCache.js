// frameCache.js
// Capa persistente: blobs WebP codificados en IndexedDB, con una sola conexión compartida,
// presupuesto de tamaño con desalojo LRU por lotes, deduplicación de descargas y reintentos.
// La memoria decodificada (bitmaps para el canvas) NO vive aquí: ver frameScheduler.js.

import { ANIMATION_PERF_DEFAULTS } from "@/config/animationPerformance";

const DB_NAME = "scroll-video-cache";
// v2: blobs y metadatos en stores separados, para actualizar/desalojar sin reescribir blobs.
const DB_VERSION = 2;
const BLOB_STORE = "frames";
const META_STORE = "frameMeta";

const TOUCH_FLUSH_DELAY_MS = 2000;
const EVICTION_DELAY_MS = 3000;
// Sin un escaneo previo no conocemos el total: se escanea tras escribir este volumen.
const UNKNOWN_TOTAL_SCAN_BYTES = 64 * 1024 * 1024;

export const FRAME_TTL_MS = ANIMATION_PERF_DEFAULTS.cacheTtlMs;

// Contadores compartidos con el diagnóstico interno.
export const cacheDiagnostics = {
  cacheHits: 0,
  networkDownloads: 0,
  retries: 0,
  failedDownloads: 0,
  cacheWriteFailures: 0,
  approxCachedBytes: null, // null hasta el primer escaneo
};

let dbPromise = null;
let cacheBudgetBytes = ANIMATION_PERF_DEFAULTS.cacheBudgetBytes;
let cacheTtlMs = FRAME_TTL_MS;
let bytesWrittenSinceScan = 0;
let evictionTimer = null;
let evictionRunning = null;
const touchedKeys = new Set();
let touchTimer = null;

export function configureFrameCache({ budgetBytes, ttlMs } = {}) {
  if (Number.isFinite(budgetBytes)) cacheBudgetBytes = budgetBytes;
  if (Number.isFinite(ttlMs)) cacheTtlMs = ttlMs;
  if (cacheDiagnostics.approxCachedBytes !== null && cacheDiagnostics.approxCachedBytes > cacheBudgetBytes) {
    scheduleEviction();
  }
}

// Una sola conexión por pestaña. Si IndexedDB no está disponible, resuelve null y
// la animación sigue funcionando solo con red.
function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);

    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (error) {
      console.warn("frameCache: IndexedDB no disponible", error);
      return resolve(null);
    }

    request.onupgradeneeded = () => {
      const db = request.result;
      // v1 guardaba blob + metadatos juntos; es caché descartable, se recrea.
      if (db.objectStoreNames.contains(BLOB_STORE)) db.deleteObjectStore(BLOB_STORE);
      if (db.objectStoreNames.contains(META_STORE)) db.deleteObjectStore(META_STORE);
      db.createObjectStore(BLOB_STORE, { keyPath: "key" });
      const meta = db.createObjectStore(META_STORE, { keyPath: "key" });
      meta.createIndex("lastAccessedAt", "lastAccessedAt");
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      db.onclose = () => {
        dbPromise = null;
      };
      resolve(db);
    };

    request.onerror = () => {
      console.warn("frameCache: no se pudo abrir IndexedDB", request.error);
      resolve(null);
    };
    request.onblocked = () => console.warn("frameCache: apertura de IndexedDB bloqueada por otra pestaña");
  });

  return dbPromise;
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new DOMException("Transacción abortada", "AbortError"));
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedFrame(key) {
  const db = await openDB();
  if (!db) return null;

  try {
    const tx = db.transaction([META_STORE, BLOB_STORE], "readonly");
    const [meta, record] = await Promise.all([
      requestResult(tx.objectStore(META_STORE).get(key)),
      requestResult(tx.objectStore(BLOB_STORE).get(key)),
    ]);

    if (!meta || !record?.blob) return null;
    if (meta.expiresAt && meta.expiresAt < Date.now()) {
      scheduleEviction(); // el escaneo por lotes elimina los vencidos
      return null;
    }

    touchKey(key);
    return record.blob;
  } catch (error) {
    console.warn("frameCache: lectura fallida, se usa la red", error);
    return null;
  }
}

export async function saveCachedFrame({ key, blob, videoName, frame }) {
  const db = await openDB();
  if (!db) return false;

  const now = Date.now();
  const tx = db.transaction([META_STORE, BLOB_STORE], "readwrite");
  tx.objectStore(BLOB_STORE).put({ key, blob });
  tx.objectStore(META_STORE).put({
    key,
    videoName,
    frame,
    size: blob.size,
    createdAt: now,
    lastAccessedAt: now,
    expiresAt: now + cacheTtlMs,
  });
  await txDone(tx);

  bytesWrittenSinceScan += blob.size;
  if (cacheDiagnostics.approxCachedBytes !== null) cacheDiagnostics.approxCachedBytes += blob.size;
  maybeScheduleEviction();
  return true;
}

// Actualiza lastAccessedAt/expiresAt de los hits en lote (solo metadatos, sin tocar blobs).
function touchKey(key) {
  touchedKeys.add(key);
  if (touchTimer) return;
  touchTimer = setTimeout(flushTouches, TOUCH_FLUSH_DELAY_MS);
}

async function flushTouches() {
  touchTimer = null;
  const keys = [...touchedKeys];
  touchedKeys.clear();
  const db = await openDB();
  if (!db || keys.length === 0) return;

  try {
    const now = Date.now();
    const tx = db.transaction(META_STORE, "readwrite");
    const store = tx.objectStore(META_STORE);
    keys.forEach((key) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const meta = request.result;
        if (meta) store.put({ ...meta, lastAccessedAt: now, expiresAt: now + cacheTtlMs });
      };
    });
    await txDone(tx);
  } catch (error) {
    console.warn("frameCache: no se pudo actualizar el acceso", error);
  }
}

function maybeScheduleEviction() {
  const total = cacheDiagnostics.approxCachedBytes;
  if (total === null ? bytesWrittenSinceScan >= UNKNOWN_TOTAL_SCAN_BYTES : total > cacheBudgetBytes) {
    scheduleEviction();
  }
}

export function scheduleEviction(delay = EVICTION_DELAY_MS) {
  if (evictionTimer) return;
  evictionTimer = setTimeout(() => {
    evictionTimer = null;
    enforceCacheBudget();
  }, delay);
}

// Un solo recorrido del índice lastAccessedAt (del más reciente al más viejo):
// conserva hasta llenar el presupuesto y borra el resto y los vencidos.
export function enforceCacheBudget() {
  if (evictionRunning) return evictionRunning;

  evictionRunning = (async () => {
    const db = await openDB();
    if (!db) return;

    const now = Date.now();
    let kept = 0;
    const tx = db.transaction([META_STORE, BLOB_STORE], "readwrite");
    const blobs = tx.objectStore(BLOB_STORE);
    const cursorRequest = tx.objectStore(META_STORE).index("lastAccessedAt").openCursor(null, "prev");

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) return;
      const meta = cursor.value;
      const expired = meta.expiresAt && meta.expiresAt < now;
      if (!expired && kept + meta.size <= cacheBudgetBytes) {
        kept += meta.size;
      } else {
        cursor.delete();
        blobs.delete(meta.key);
      }
      cursor.continue();
    };

    await txDone(tx);
    cacheDiagnostics.approxCachedBytes = kept;
    bytesWrittenSinceScan = 0;
  })()
    .catch((error) => console.warn("frameCache: desalojo fallido", error))
    .finally(() => {
      evictionRunning = null;
    });

  return evictionRunning;
}

export async function clearFrameCache() {
  const db = await openDB();
  if (!db) throw new Error("IndexedDB no está disponible en este navegador");

  const tx = db.transaction([META_STORE, BLOB_STORE], "readwrite");
  tx.objectStore(META_STORE).clear();
  tx.objectStore(BLOB_STORE).clear();
  await txDone(tx);
  touchedKeys.clear();
  cacheDiagnostics.approxCachedBytes = 0;
  bytesWrittenSinceScan = 0;
}

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason ?? new DOMException("Abortado", "AbortError"));
      },
      { once: true }
    );
  });

const isAbort = (error) => error?.name === "AbortError";

async function fetchWithRetry(url, { signal, retryCount, retryBaseDelayMs, frame }) {
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    try {
      const response = await fetch(url, { signal });
      status = response.status;
      if (response.ok) return await response.blob();
    } catch (error) {
      // Error de red (o corte leyendo el cuerpo): transitorio salvo que sea un abort.
      if (isAbort(error) || signal?.aborted || attempt >= retryCount) throw error;
      status = 0;
    }

    if (status) {
      // 404/403 y similares no son transitorios: no se reintentan.
      const transient = status >= 500 || status === 429 || status === 408;
      if (!transient || attempt >= retryCount) {
        throw new Error(`No se pudo descargar el frame ${frame} (HTTP ${status})`);
      }
    }
    cacheDiagnostics.retries++;
    await sleep(retryBaseDelayMs * 2 ** attempt, signal);
  }
}

async function readOrDownload({ key, url, videoName, frame, signal, retryCount, retryBaseDelayMs }) {
  const cachedBlob = await getCachedFrame(key);
  if (cachedBlob) {
    cacheDiagnostics.cacheHits++;
    return { blob: cachedBlob, fromCache: true };
  }
  if (signal?.aborted) throw signal.reason ?? new DOMException("Abortado", "AbortError");

  let blob;
  try {
    blob = await fetchWithRetry(url, { signal, retryCount, retryBaseDelayMs, frame });
  } catch (error) {
    if (!isAbort(error)) cacheDiagnostics.failedDownloads++;
    throw error;
  }
  cacheDiagnostics.networkDownloads++;

  // La escritura en caché es independiente: si falla (cuota, modo privado), el frame se usa igual.
  saveCachedFrame({ key, blob, videoName, frame }).catch((error) => {
    cacheDiagnostics.cacheWriteFailures++;
    if (error?.name === "QuotaExceededError") enforceCacheBudget();
    else console.warn("frameCache: no se pudo guardar el frame", frame, error);
  });

  return { blob, fromCache: false };
}

// Deduplicación entre llamadas (y entre montajes del componente): una sola lectura/descarga
// por clave. La descarga compartida se aborta solo cuando todos los interesados abortan.
const inflight = new Map();

export function getOrDownloadFrame({
  key,
  url,
  videoName,
  frame,
  signal,
  retryCount = ANIMATION_PERF_DEFAULTS.retryCount,
  retryBaseDelayMs = ANIMATION_PERF_DEFAULTS.retryBaseDelayMs,
}) {
  if (signal?.aborted) return Promise.reject(signal.reason ?? new DOMException("Abortado", "AbortError"));

  let entry = inflight.get(key);
  if (!entry) {
    const controller = new AbortController();
    entry = { controller, refs: 0 };
    entry.promise = readOrDownload({
      key, url, videoName, frame, retryCount, retryBaseDelayMs, signal: controller.signal,
    }).finally(() => {
      if (inflight.get(key) === entry) inflight.delete(key);
    });
    inflight.set(key, entry);
  }
  entry.refs++;

  return new Promise((resolve, reject) => {
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      signal?.removeEventListener("abort", onAbort);
      entry.refs--;
      if (entry.refs === 0 && inflight.get(key) === entry) {
        inflight.delete(key);
        entry.controller.abort();
      }
    };
    const onAbort = () => {
      release();
      reject(signal.reason ?? new DOMException("Abortado", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    entry.promise.then(
      (value) => {
        if (released) return;
        release();
        resolve(value);
      },
      (error) => {
        if (released) return;
        release();
        reject(error);
      }
    );
  });
}

export function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo convertir el Blob en imagen"));
    };

    img.src = objectUrl;
  });
}

let bitmapResizeSupported = typeof createImageBitmap === "function";

// Decodifica para el canvas. Prefiere ImageBitmap (decodificación fuera del hilo principal y
// liberable con close()); si se pide tamaño, el bitmap se genera ya escalado para ahorrar memoria.
// Devuelve { source, width, height, close }.
export async function decodeFrame(blob, size) {
  if (typeof createImageBitmap === "function") {
    try {
      const options = bitmapResizeSupported && size
        ? { resizeWidth: size.width, resizeHeight: size.height, resizeQuality: "high" }
        : undefined;
      const bitmap = await createImageBitmap(blob, options);
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch (error) {
      if (size && bitmapResizeSupported) {
        // Algunos navegadores no aceptan las opciones de redimensionado: reintentar sin ellas.
        bitmapResizeSupported = false;
        return decodeFrame(blob, size);
      }
      console.warn("frameCache: createImageBitmap falló, se usa <img>", error);
    }
  }

  const img = await blobToImage(blob);
  if (img.decode) await img.decode().catch(() => {});
  return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
}
