// frameProfile.js
// Resuelve qué carpeta del CDN, cuántos frames y a qué FPS se reproduce una secuencia.
// Usa una variante seleccionada para ese master o el perfil histórico como fallback.

import { FRAME_CDN_BASE, SOURCE_FPS, normalizeFrameVariants } from "../config/animationPerformance.js";

// `step`: cada cuántos frames del original se conserva uno.
// Las variantes administradas por el CDN proporcionan folder, frameCount y fps explícitos.
const SOURCE_PROFILES = {
  optimized: { suffix: "_30fps", step: 2 },
  original: { suffix: "", step: 1 },
};

export function getFrameProfile(videoInfo, mode = "optimized", selectedVariant = null) {
  const source = SOURCE_PROFILES[mode] ?? SOURCE_PROFILES.optimized;
  const name = videoInfo?.name ?? "";
  const sourceFrameCount = Number(videoInfo?.length) || 0;
  const selection = normalizeFrameVariants({ [name]: selectedVariant })[name];
  const folder = selection?.folder ?? `${name}${source.suffix}`;
  const pad = (frame) => String(frame).padStart(4, "0");

  return {
    mode: selection ? "variant" : SOURCE_PROFILES[mode] ? mode : "optimized",
    folder,
    frameCount: selection?.frameCount ?? Math.ceil(sourceFrameCount / source.step),
    fps: selection?.fps ?? SOURCE_FPS / source.step,
    optimized: selection ? selection.fps < SOURCE_FPS : source.step > 1,
    // `frame` es 1-based, igual que los archivos frame_0001.webp.
    frameUrl: (frame) => `${FRAME_CDN_BASE}/${folder}/frame_${pad(frame)}.webp`,
    cacheKey: (frame) => `${folder}:frame:${pad(frame)}`,
  };
}
