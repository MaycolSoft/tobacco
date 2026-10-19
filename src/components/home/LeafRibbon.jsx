import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/styles/leaf-ribbon.css';

gsap.registerPlugin(ScrollTrigger);
const assets = '/img/art/leaf-ribbon/';

export default function LeafRibbon() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const section = root.closest('#recorrido');
    const connection = navigator.connection;
    const media = gsap.matchMedia();
    const configure = () => {
      media.revert();
      media.add({ desktop: '(min-width: 1081px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
        const { desktop, reduced } = context.conditions;
        root.dataset.mode = 'poster';
        root.dataset.progress = reduced ? '1' : '0.5';
        if (!desktop || reduced || connection?.saveData) return;
        let active = true;
        let api;
        let animation;
        let loading = false;
        let visible = false;
        let ticking = false;
        const abort = new AbortController();
        const state = { roll: 0, idle: 0 };
        const frame = () => {
          api?.setIdle(state.idle);
          api?.render();
        };
        const syncVisibility = () => {
          const running = active && visible && !document.hidden && !!api;
          if (running === ticking) return;
          ticking = running;
          root.dataset.running = String(running);
          if (running) { animation?.resume(); gsap.ticker.add(frame); }
          else { animation?.pause(); gsap.ticker.remove(frame); }
        };
        const release = () => {
          animation?.kill();
          gsap.ticker.remove(frame);
          ticking = false;
          root.dataset.running = 'false';
          api?.dispose();
          api = undefined;
          root.dataset.mode = 'poster';
        };
        const fail = () => {
          abort.abort();
          release();
          root.dataset.fallback = 'unavailable';
        };
        const scroll = gsap.context(() => {
          gsap.to(state, {
            roll: 1, ease: 'none',
            onUpdate() {
              root.dataset.progress = state.roll.toFixed(4);
              api?.setProgress(state.roll);
            },
            scrollTrigger: {
              id: 'art-h1-roll', trigger: section, start: 'top 70%', end: 'bottom 40%',
              scrub: 0.6, invalidateOnRefresh: true,
              onRefresh(self) {
                state.roll = self.progress;
                root.dataset.progress = self.progress.toFixed(4);
                api?.setProgress(self.progress);
              },
            },
          });
        }, root);
        const lazy = new IntersectionObserver(async entries => {
          if (!entries.some(entry => entry.isIntersecting) || loading) return;
          loading = true;
          lazy.disconnect();
          try {
            const { init } = await import('./leafRibbonRenderer.js');
            if (!active) return;
            api = await init(root, { signal: abort.signal, onFailure: fail });
            if (!active || abort.signal.aborted) { release(); return; }
            api.setProgress(state.roll);
            api.render();
            root.dataset.mode = 'webgl';
            animation = gsap.to(state, { idle: 1, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
            syncVisibility();
          } catch { if (active) fail(); }
        }, { rootMargin: '200px 0px' });
        lazy.observe(root);
        const visibility = new IntersectionObserver(entries => {
          visible = entries[0].isIntersecting;
          syncVisibility();
        });
        visibility.observe(root);
        document.addEventListener('visibilitychange', syncVisibility);
        const refresh = () => { if (active) ScrollTrigger.refresh(); };
        const sizes = new ResizeObserver(refresh);
        sizes.observe(section);
        document.fonts?.ready.then(refresh);
        return () => {
          active = false;
          abort.abort();
          lazy.disconnect(); visibility.disconnect(); sizes.disconnect();
          document.removeEventListener('visibilitychange', syncVisibility);
          scroll.revert();
          release();
        };
      });
    };
    configure();
    connection?.addEventListener('change', configure);
    return () => { connection?.removeEventListener('change', configure); media.revert(); };
  }, []);

  return <div ref={rootRef} className="leaf-ribbon" aria-hidden="true" data-mode="poster" data-progress="0.5">
    <picture className="leaf-ribbon__poster">
      <source media="(prefers-reduced-motion: reduce)" srcSet={`${assets}leaf-poster-rolled.webp`} />
      <img src={`${assets}leaf-poster-mid.webp`} width="840" height="420" alt="" loading="lazy" decoding="async" />
    </picture>
  </div>;
}
