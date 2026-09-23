// animationPerformance.js
// Fuente única de configuración para la carga de secuencias de frames (ScrollVideo).
// LayoutControlPanel puede sobrescribir estos valores (herramienta interna); si nunca se abre, se usan estos.

export const FRAME_CDN_BASE = "https://cdn.mbsoft.freeddns.org";

// FPS de los videos originales de los que salen las secuencias.
export const SOURCE_FPS = 60;

export const ANIMATION_PERF_DEFAULTS = {
  sourceMode: "optimized",      // "optimized" (_30fps) | "original" (60fps, solo depuración)
  concurrency: 6,               // descargas simultáneas máximas (red o IndexedDB)
  decodeConcurrency: 2,         // decodificaciones simultáneas máximas (separadas de las descargas)
  backgroundSlots: 2,           // descargas reservadas para precargar el resto de la secuencia (0 = sin precarga)
  prefetchAhead: 40,            // frames a precargar en la dirección del movimiento
  prefetchBehind: 15,           // ventana de seguridad en la dirección contraria
  decodedFrameLimit: 12,        // bitmaps decodificados en memoria como máximo
  cacheBudgetBytes: 750 * 1024 * 1024, // IndexedDB: ~470 frames de ~1.6 MB
  cacheTtlMs: 14 * 24 * 60 * 60 * 1000, // 14 días desde el último acceso
  maxDpr: 2,                    // tope de devicePixelRatio para el canvas
  retryCount: 2,                // reintentos por frame ante fallos transitorios
  retryBaseDelayMs: 300,        // backoff: 300 ms, 600 ms, ...
  failedFrameCooldownMs: 10000, // tiempo antes de volver a intentar un frame que falló
  stationaryDelayMs: 150,       // sin cambios de frame por este tiempo = quieto: refinar al frame exacto
  showLoaderStats: false,       // overlay de diagnóstico sobre la animación
};

// Límites para valores editables desde el panel interno.
export const ANIMATION_PERF_LIMITS = {
  concurrency: [1, 12],
  decodeConcurrency: [1, 6],
  backgroundSlots: [0, 6],
  prefetchAhead: [0, 120],
  prefetchBehind: [0, 60],
  decodedFrameLimit: [4, 60],
  cacheBudgetBytes: [256 * 1024 * 1024, 8 * 1024 * 1024 * 1024],
  maxDpr: [1, 3],
  retryCount: [0, 5],
};

export function normalizePerfConfig(config = {}) {
  const merged = { ...ANIMATION_PERF_DEFAULTS, ...config };
  for (const [key, [min, max]] of Object.entries(ANIMATION_PERF_LIMITS)) {
    const value = Number(merged[key]);
    merged[key] = Number.isFinite(value) ? Math.min(Math.max(value, min), max) : ANIMATION_PERF_DEFAULTS[key];
  }
  if (merged.sourceMode !== "original") merged.sourceMode = "optimized";
  merged.showLoaderStats = Boolean(merged.showLoaderStats);
  return merged;
}
