import { SOURCE_FPS } from '../config/animationPerformance.js';

export const isFinishedJob = (job) => job?.status === 'completed' || job?.status === 'failed';
export const canDeleteVariant = (variant) => variant.managed === true && variant.kind === 'generated';

export function getVariantSource(variant, items) {
  let current = variant;
  const seen = new Set();
  while (current?.metadata?.source && !seen.has(current.name)) {
    seen.add(current.name);
    const source = current.metadata.source;
    const parent = items.find(item => item.name === source);
    if (!parent) return source;
    current = parent;
  }
  if (current?.kind === 'legacy') {
    const base = current.name.replace(/_\d+(?:\.\d+)?fps(?:_\d+p)?$/, '');
    if (items.some(item => item.kind === 'master' && item.name === base)) return base;
  }
  return current?.name ?? variant.name;
}

export function getVariantFps(variant) {
  const metadata = variant.metadata;
  const fps = Number(metadata?.target_fps ?? (variant.kind === 'master' ? metadata?.source_fps ?? SOURCE_FPS : 0));
  if (fps > 0 && Number.isFinite(fps)) return fps;
  if (variant.kind === 'legacy') return Number(variant.name.match(/_(\d+(?:\.\d+)?)fps(?:_\d+p)?$/)?.[1]) || null;
  return null;
}

export function getVariantProfile(variant) {
  const fps = getVariantFps(variant);
  const count = Number(variant.frame_count);
  const status = variant.metadata?.status;
  if (!fps || !Number.isSafeInteger(count) || count <= 0 ||
      (status && !['ready', 'completed'].includes(status)) ||
      (variant.kind === 'generated' && !status)) return null;
  return { folder: variant.name, frameCount: count, fps };
}

export function groupFrameVariants(items) {
  const groups = new Map();
  for (const variant of items) {
    const source = getVariantSource(variant, items);
    if (!groups.has(source)) groups.set(source, []);
    groups.get(source).push(variant);
  }
  const order = { master: 0, legacy: 1, generated: 2 };
  return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([source, variants]) => ({
    source,
    variants: variants.sort((a, b) => (order[a.kind] ?? 3) - (order[b.kind] ?? 3) || a.name.localeCompare(b.name)),
  }));
}

export function formatResolution({ width, height }) {
  const short = Math.min(width, height);
  if (width >= 3840 || short >= 2160) return '4K';
  return `${short}p`;
}

// Animations available on the CDN, in API order. Local entries only provide display names,
// and are used as-is when the API is unavailable or returns no masters.
export function getAnimationCatalog(items, fallback = []) {
  const known = new Map(fallback.map(video => [video.name, video]));
  const masters = items.filter(item => item.kind === 'master' && Number.isSafeInteger(item.frame_count) && item.frame_count > 0);
  if (!masters.length) return fallback;
  return masters.map(master => ({ name: master.name, length: master.frame_count, displayName: known.get(master.name)?.displayName }));
}

// Describes the frame profile an animation will load. `type` is 'default' without a selection,
// the variant kind when it is listed, 'unavailable' when the saved folder is no longer listed,
// or 'selected' when the list could not be loaded.
export function describeFrameProfile(profile, items, hasSelection) {
  const item = items.find(variant => variant.name === profile.folder);
  const { width, height } = item?.metadata ?? {};
  const type = !hasSelection ? 'default' : item ? item.kind : items.length ? 'unavailable' : 'selected';
  return { fps: profile.fps, frames: profile.frameCount, resolution: width && height ? formatResolution({ width, height }) : null, type };
}
