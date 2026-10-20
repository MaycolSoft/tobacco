import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useAnimationControls, useInView, useReducedMotion } from 'framer-motion';
import '@/styles/blend-sculpture.css';

const leafOutline = 'M28 81 Q45 63 71 70 Q103 47 139 64 Q174 48 208 66 L268 76 L278 85 Q245 98 217 92 Q178 111 143 95 Q105 112 74 95 Q48 104 28 81Z';
const backRibbon = 'M42 89 C57 121 92 121 111 78 S151 32 175 76 S217 125 254 83';
const frontRibbon = 'M42 89 C57 49 88 43 111 78 S150 124 175 76 S222 43 254 83';

// Abstract selected-leaf composition. The photography is real inventory imagery,
// not the concept illustration; SVG is the handoff's lightweight fallback.
export default function BlendSculpture({ leaves, selections, stepIndex, highlighted, paused = false }) {
  const id = useId().replaceAll(':', '');
  const float = useAnimationControls();
  const root = useRef(null);
  const visible = useInView(root, { margin: '40px' });
  const reduced = useReducedMotion();
  const [floating, setFloating] = useState(false);
  const [saveData, setSaveData] = useState(() => Boolean(navigator.connection?.saveData));
  const [hidden, setHidden] = useState(() => document.hidden);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 860px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)');
    const resize = () => setCompact(media.matches);
    const visibility = () => setHidden(document.hidden);
    const connection = navigator.connection;
    const updateConnection = () => setSaveData(Boolean(connection?.saveData));
    connection?.addEventListener?.('change', updateConnection);
    media.addEventListener('change', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      connection?.removeEventListener?.('change', updateConnection);
      media.removeEventListener('change', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  const active = visible && !paused && !hidden && !reduced && !compact && !saveData;
  const duration = active ? 0.5 : 0;
  const selected = selections.TRIPA.map(key => leaves.find(leaf => leaf.id === key)).filter(Boolean);
  const binder = leaves.find(leaf => leaf.id === selections.CAPOTE[0]);
  const wrapper = leaves.find(leaf => leaf.id === selections.CAPA[0]);
  const signature = [...selections.TRIPA, ...selections.CAPOTE, ...selections.CAPA].join('|');
  useEffect(() => {
    let current = true;
    setFloating(active);
    float.start({ y: active ? [0, -3, 0, -3, 0] : 0, transition: { duration: active ? 4 : 0, ease: 'easeInOut' } }).then(() => { if (current) setFloating(false); });
    return () => { current = false; float.stop(); };
  }, [active, signature, float]);
  const alpha = leafId => highlighted && highlighted !== leafId ? 0.4 : 1;
  return (
    <div ref={root} className="blend-sculpture" aria-hidden="true" data-art="art-c1" data-running={active && floating} data-motion-eligible={active} data-leaf-count={selected.length}>
      <svg viewBox="0 0 300 150" focusable="false">
        <defs>
          <clipPath id={`${id}-leaf`}><path d={leafOutline} /></clipPath>
          <linearGradient id={`${id}-amber`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#7c4b22" /><stop offset=".4" stopColor="#e0aa55" /><stop offset=".65" stopColor="#a16b30" /><stop offset="1" stopColor="#684421" />
          </linearGradient>
          <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#e4b879" stopOpacity=".2" /><stop offset=".45" stopColor="#352313" stopOpacity="0" /><stop offset="1" stopColor="#1b100b" stopOpacity=".65" />
          </linearGradient>
          {wrapper && <pattern id={`${id}-wrapper`} width="80" height="80" patternUnits="userSpaceOnUse"><image href={wrapper.thumbImg} width="80" height="80" preserveAspectRatio="xMidYMid slice" /><rect width="80" height="80" fill="#684528" opacity=".3" /></pattern>}
        </defs>
        <ellipse className="blend-sculpture__shadow" cx="150" cy="127" rx="99" ry="7" />
        <Motion.g animate={float}><Motion.g animate={{ rotate: stepIndex * -5 }} transition={{ duration }} style={{ transformOrigin: '150px 80px' }}>
          <AnimatePresence initial={false}>
            {binder && <Motion.path key={`binder-back-${binder.id}`} d={backRibbon} fill="none" stroke={`url(#${id}-amber)`} strokeWidth="8" opacity=".38" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} transition={{ duration: active ? .7 : 0 }} />}
          </AnimatePresence>
          <AnimatePresence>
            {selected.map((leaf, index) => (
              <Motion.g key={leaf.id} data-leaf={leaf.id} initial={{ opacity: 0, x: -18, rotate: -12 }} animate={{ opacity: alpha(leaf.id), x: highlighted === leaf.id ? 5 : 0, rotate: 0, y: (index - (selected.length - 1) / 2) * 12 }} exit={{ opacity: 0, scaleY: .1, x: 10 }} transition={{ duration, delay: active ? index * .08 : 0 }} style={{ transformOrigin: '150px 80px' }}>
                <g clipPath={`url(#${id}-leaf)`}>
                  <image href={leaf.thumbImg} x="25" y="46" width="250" height="66" preserveAspectRatio="xMidYMid slice" />
                  <path d={leafOutline} fill={`url(#${id}-shade)`} />
                </g>
                <path d="M32 81 Q101 77 143 82 T273 83" fill="none" stroke="#c29a65" strokeWidth=".6" opacity=".55" />
              </Motion.g>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {binder && <Motion.path key={`binder-${binder.id}`} data-layer="CAPOTE" d={frontRibbon} fill="none" stroke={`url(#${id}-amber)`} strokeWidth="8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: alpha(binder.id) * .8 }} exit={{ opacity: 0 }} transition={{ duration: active ? .7 : 0 }} />}
            {wrapper && <Motion.path key={`wrapper-${wrapper.id}`} data-layer="CAPA" d="M60 108 C42 81 69 35 95 52 S123 118 149 110 S169 40 197 50 S216 109 245 96" fill="none" stroke={`url(#${id}-wrapper)`} strokeWidth="17" strokeLinecap="butt" initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: alpha(wrapper.id) }} exit={{ opacity: 0 }} transition={{ duration: active ? .7 : 0 }} />}
          </AnimatePresence>
        </Motion.g></Motion.g>
        {!selected.length && <path className="blend-sculpture__empty" d="M43 82 Q94 62 149 80 T258 80" />}
      </svg>
    </div>
  );
}
