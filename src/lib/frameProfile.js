// frameProfile.js
// Resuelve qué carpeta del CDN, cuántos frames y a qué FPS se reproduce una secuencia.
// Usa la variante seleccionada para ese master o, si no hay, la carpeta `_30fps` por defecto.

import { FRAME_CDN_BASE, SOURCE_FPS, normalizeFrameVariants } from "../config/animationPerformance.js";

// Perfil por defecto: la carpeta `{master}_30fps` conserva uno de cada `step` frames del original.
// Las variantes administradas por el CDN proporcionan folder, frameCount y fps explícitos.
const DEFAULT_PROFILE = { suffix: "_30fps", step: 2 };

export function getFrameProfile(videoInfo, selectedVariant = null) {
  const source = DEFAULT_PROFILE;
  const name = videoInfo?.name ?? "";
  const sourceFrameCount = Number(videoInfo?.length) || 0;
  const selection = normalizeFrameVariants({ [name]: selectedVariant })[name];
  const folder = selection?.folder ?? `${name}${source.suffix}`;
  const pad = (frame) => String(frame).padStart(4, "0");

  return {
    mode: selection ? "variant" : "default",
    folder,
    frameCount: selection?.frameCount ?? Math.ceil(sourceFrameCount / source.step),
    fps: selection?.fps ?? SOURCE_FPS / source.step,
    // `frame` es 1-based, igual que los archivos frame_0001.webp.
    frameUrl: (frame) => `${FRAME_CDN_BASE}/${folder}/frame_${pad(frame)}.webp`,
    cacheKey: (frame) => `${folder}:frame:${pad(frame)}`,
  };
}
