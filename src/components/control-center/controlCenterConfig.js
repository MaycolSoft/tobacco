export const FONT_PAIRINGS = [
  {
    id: 'legacy',
    name: 'Legacy',
    desc: 'Lujo clásico',
    heading: { family: "'Playfair Display', serif", google: 'Playfair+Display:ital,wght@0,400;0,700;1,400' },
    body:    { family: "'Inter', sans-serif",        google: 'Inter:wght@300;400;600' },
  },
  {
    id: 'artesano',
    name: 'Artesano',
    desc: 'Bandas de puro',
    heading: { family: "'Cinzel', serif",            google: 'Cinzel:wght@400;600;700' },
    body:    { family: "'Raleway', sans-serif",       google: 'Raleway:wght@300;400;600' },
  },
  {
    id: 'havana',
    name: 'Havana',
    desc: 'Vintage colonial',
    heading: { family: "'Cormorant Garamond', serif", google: 'Cormorant+Garamond:ital,wght@0,300;0,600;1,300' },
    body:    { family: "'Lato', sans-serif",          google: 'Lato:wght@300;400;700' },
  },
  {
    id: 'reserve',
    name: 'Reserve',
    desc: 'Editorial moderno',
    heading: { family: "'DM Serif Display', serif",  google: 'DM+Serif+Display:ital@0;1' },
    body:    { family: "'DM Sans', sans-serif",       google: 'DM+Sans:wght@300;400;500' },
  },
];

export const FRAME_SOURCES = [
  { id: 'optimized', name: 'Optimized', desc: 'Por defecto' },
  { id: 'original', name: 'Original', desc: 'Solo depuración' },
];

const MB = 1024 * 1024;
const formatMb = (bytes) => (bytes === null || bytes === undefined ? '—' : `${Math.round(bytes / MB)} MB`);

// Controles numéricos de la sección Animation Performance (herramienta interna).
export const PERF_RANGES = [
  { key: 'concurrency', label: 'Loader concurrency', step: 1 },
  { key: 'decodeConcurrency', label: 'Decode concurrency', step: 1 },
  { key: 'backgroundSlots', label: 'Background preload slots', step: 1 },
  { key: 'prefetchAhead', label: 'Prefetch ahead', step: 5 },
  { key: 'prefetchBehind', label: 'Prefetch behind', step: 5 },
  { key: 'decodedFrameLimit', label: 'Decoded frame limit', step: 2 },
  { key: 'cacheBudgetBytes', label: 'Cache budget', step: 256 * MB, format: formatMb },
];

export const PERF_STATS = [
  ['profile', 'Source profile'],
  ['folder', 'Frame folder'],
  ['frameCount', 'Frame count'],
  ['requestedFrame', 'Requested frame'],
  ['renderedFrame', 'Rendered frame'],
  ['renderedSource', 'Rendered frame source'],
  ['frameLag', 'Frame lag'],
  ['maxLag', 'Max lag'],
  ['motion', 'Motion'],
  ['direction', 'Direction'],
  ['velocity', 'Scroll speed (f/s)'],
  ['stride', 'Stride'],
  ['lead', 'Lead (frames)'],
  ['lastStableTarget', 'Last stable target'],
  ['nearestAhead', 'Decoded nearest ahead'],
  ['nearestBehind', 'Decoded nearest behind'],
  ['decodedFrames', 'Decoded frames'],
  ['prefetchedBlobs', 'Blob-memory frames'],
  ['persistentCachedFrames', 'Persistent cached frames'],
  ['queueLength', 'Queued frames'],
  ['decodeQueueLength', 'Decode queue'],
  ['activeDownloads', 'Active downloads'],
  ['activeDownloadKinds', 'Critical / prefetch / bg'],
  ['activeCacheReads', 'Active cache reads'],
  ['activeDecodes', 'Active decodes'],
  ['backgroundPosition', 'Background preload position'],
  ['backgroundDownloads', 'Background downloads'],
  ['framesPerSecond', 'Delivered frames/s'],
  ['throughputMbps', 'Network Mbps'],
  ['avgLatencyMs', 'Avg load ms'],
  ['avgDecodeMs', 'Avg decode ms'],
  ['exactRenders', 'Exact renders'],
  ['fallbackRenders', 'Fallback renders'],
  ['persistentHits', 'Persistent cache hits'],
  ['memoryHits', 'Memory hits'],
  ['schedulerNetworkDownloads', 'Network downloads'],
  ['cancelledDownloads', 'Cancelled downloads'],
  ['failedFrames', 'Failed frames'],
  ['retries', 'Retries'],
  ['cacheWriteFailures', 'Cache write failures'],
  ['approxCachedBytes', 'Approx. cached', formatMb],
];
