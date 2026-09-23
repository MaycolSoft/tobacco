// frameProfile.js
// Resuelve qué carpeta del CDN, cuántos frames y a qué FPS se reproduce una secuencia.
// Es el único lugar que conoce el sufijo `_30fps` y la relación 2:1 con el original.

import { FRAME_CDN_BASE, SOURCE_FPS } from "@/config/animationPerformance";

// `step`: cada cuántos frames del original se conserva uno.
// Para agregar resoluciones (1080/1440/...) en el futuro basta con sumar perfiles aquí.
const SOURCE_PROFILES = {
  optimized: { suffix: "_30fps", step: 2 },
  original: { suffix: "", step: 1 },
};

export function getFrameProfile(videoInfo, mode = "optimized") {
  const source = SOURCE_PROFILES[mode] ?? SOURCE_PROFILES.optimized;
  const name = videoInfo?.name ?? "";
  const sourceFrameCount = Number(videoInfo?.length) || 0;
  const folder = `${name}${source.suffix}`;
  const pad = (frame) => String(frame).padStart(4, "0");

  return {
    mode: SOURCE_PROFILES[mode] ? mode : "optimized",
    folder,
    frameCount: Math.ceil(sourceFrameCount / source.step),
    fps: SOURCE_FPS / source.step,
    optimized: source.step > 1,
    // `frame` es 1-based, igual que los archivos frame_0001.webp.
    frameUrl: (frame) => `${FRAME_CDN_BASE}/${folder}/frame_${pad(frame)}.webp`,
    cacheKey: (frame) => `${folder}:frame:${pad(frame)}`,
  };
}
