import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import '@/styles/specimen-ring.css';

const POSES = [-25, -41, -13, -30];

/** Two SVG halves straddle the actual photograph; no bitmap/concept texture. */
export default function SpecimenRing({ category, specimenKey, chapter = 0, side = 'back' }) {
  const root = useRef(null);
  const gradient = `specimen-${useId().replace(/:/g, '')}`;
  const count = category === 'TRIPA' ? 3 : category === 'CAPOTE' ? 2 : 1;

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
      if (navigator.connection?.saveData) return;
      const context = gsap.context(() => {
        gsap.fromTo(root.current.querySelector('.specimen-ring__pose'),
          { rotation: POSES[chapter] - 7, scaleY: 0.94 },
          { rotation: POSES[chapter], scaleY: 1, duration: 0.65, ease: 'power2.out', transformOrigin: '50% 50%' });
      }, root);
      return () => context.revert();
    });
    const connection = navigator.connection;
    const stopForDataSaver = () => {
      if (!connection?.saveData) return;
      const pose = root.current?.querySelector('.specimen-ring__pose');
      if (pose) {
        gsap.killTweensOf(pose);
        gsap.set(pose, { rotation: POSES[chapter], scaleY: 1 });
      }
    };
    connection?.addEventListener('change', stopForDataSaver);
    return () => {
      connection?.removeEventListener('change', stopForDataSaver);
      media.revert();
    };
  }, [chapter, category, specimenKey]);

  return (
    <svg ref={root} className={`specimen-ring specimen-ring--${side}`} viewBox="0 0 480 480" aria-hidden="true" focusable="false" data-category={category} data-chapter={chapter}>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6F907F" stopOpacity=".65" />
          <stop offset=".26" stopColor="#C7A479" />
          <stop offset=".48" stopColor="#F1DEB7" />
          <stop offset=".62" stopColor="#7B5126" stopOpacity=".65" />
          <stop offset=".86" stopColor="#C7A479" />
          <stop offset="1" stopColor="#6F907F" stopOpacity=".65" />
        </linearGradient>
      </defs>
      <g className="specimen-ring__pose" style={{ transform: `rotate(${POSES[chapter]}deg)`, transformOrigin: '240px 240px' }}>
        {[0, 1, 2].map(index => {
          const rx = 212 - index * 18;
          const ry = 110 + index * 22;
          const path = side === 'back'
            ? `M ${240 - rx} 240 A ${rx} ${ry} 0 0 1 ${240 + rx} 240`
            : `M ${240 + rx} 240 A ${rx} ${ry} 0 0 1 ${240 - rx} 240`;
          return <g key={index} className={`specimen-ring__arc ${index === 0 ? 'specimen-ring__arc--main' : 'specimen-ring__arc--secondary'}`} style={{ display: index < count ? undefined : 'none' }}>
            <path d={path} fill="none" stroke="#543B25" strokeWidth={index === 0 ? 5 : 2.5} />
            <path d={path} fill="none" stroke={`url(#${gradient})`} strokeWidth={index === 0 ? 3.2 : 1.2} />
            {index === 0 && <path d={path} fill="none" stroke="#F6E8C8" strokeOpacity=".45" strokeWidth=".65" transform="translate(0 -1)" />}
          </g>;
        })}
      </g>
    </svg>
  );
}
