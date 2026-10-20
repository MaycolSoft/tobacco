import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/styles/layer-knot.css';

gsap.registerPlugin(ScrollTrigger);


/** A local, lazy scene; the vector poster also covers unavailable WebGL. */
export default function LayerKnot() {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const section = root.closest('#proceso');
    const lead = section.querySelector('.site-lead');
    const nav = section.querySelector('.site-chapter-nav');
    const boundary = section.querySelector('.site-process-chapters');
    const links = [...nav.querySelectorAll('a')];
    let api;
    let loading = false;
    let failed = false;
    let visible = false;
    let run = 0;
    const syncVisibility = () => api?.setVisible(visible && !document.hidden);
    const release = () => { run++; api?.dispose(); api = undefined; };
    const fail = () => { failed = true; release(); root.dataset.mode = 'static'; root.dataset.fallback = 'unavailable'; };
    const load = async () => {
      if (loading || api || failed || !animated || !visible) return;
      loading = true;
      const token = run;
      try {
        const { init } = await import('./LayerKnotRenderer.js');
        if (!active || token !== run || !animated) return;
        api = init(root, { onFailure: fail });
        api.resize(); api.setProgress(state.progress); api.setEmphasis(focused >= 0 ? focused : hovered);
        syncVisibility(); root.dataset.mode = 'webgl';
      } catch { if (active && token === run) fail(); }
      finally { loading = false; if (active && animated && visible && !api && !failed) load(); }
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 1081px)');
    const connection = navigator.connection;
    let active = true;
    let pending = 0;
    let context;
    let lastKey = '';
    let animated = false;
    let hovered = -1;
    let focused = -1;
    const state = { progress: 1 };
    const draw = () => {
      root.dataset.progress = state.progress.toFixed(4);
      api?.setProgress(state.progress);
    };
    const highlight = () => {
      const selected = focused >= 0 ? focused : hovered;
      root.dataset.emphasis = String(animated ? selected : -1);
      api?.setEmphasis(animated ? selected : -1);
    };
    const measure = () => {
      pending = 0;
      if (!active) return;
      const bounds = section.getBoundingClientRect();
      const text = lead.getBoundingClientRect();
      const bottom = boundary.getBoundingClientRect().top - 12;
      const rightmostPill = Math.max(...links.map(link => link.getBoundingClientRect().right));
      const left = Math.max(text.left, rightmostPill + 24);
      const top = text.bottom + 12;
      const width = Math.max(0, Math.min(300, bounds.right - left, (bottom - top) * 1.5));
      const visible = innerWidth > 860 && width >= 140;
      root.style.display = visible ? 'block' : 'none';
      root.style.left = `${left - bounds.left}px`;
      root.style.top = `${top - bounds.top}px`;
      root.style.width = `${width}px`;
      root.style.height = `${width / 1.5}px`;
      animated = visible && desktop.matches && !reduced.matches && !connection?.saveData;
      root.dataset.mode = visible ? api && animated ? 'webgl' : 'static' : 'hidden';
      const key = `${visible}:${animated}:${width.toFixed(2)}:${(top - bounds.top).toFixed(2)}:${(left - bounds.left).toFixed(2)}:${(top + scrollY).toFixed(2)}`;
      if (key === lastKey) return;
      lastKey = key;
      context?.revert();
      if (!animated) release();
      api?.resize();
      state.progress = animated ? 0 : 1;
      draw();
      highlight();
      if (animated) {
        context = gsap.context(() => {
          const position = () => root.getBoundingClientRect().top + scrollY;
          gsap.to(state, {
            progress: 1, ease: 'none', onUpdate: draw,
            scrollTrigger: {
              id: 'art-o2-alignment', trigger: root,
              start: () => position() - innerHeight * 0.75,
              end: () => position() + root.offsetHeight - innerHeight * 0.25,
              scrub: 0.6, invalidateOnRefresh: true,
              onRefresh(self) { root.dataset.start = String(self.start); root.dataset.end = String(self.end); state.progress = self.progress; draw(); },
            },
          });
        }, root);
      }
      ScrollTrigger.refresh();
      load();
    };
    const schedule = () => { if (active && !pending) pending = requestAnimationFrame(measure); };
    const handlers = links.map((link, i) => {
      const enter = () => { hovered = i; highlight(); };
      const leave = () => { hovered = -1; highlight(); };
      const focus = () => { focused = i; highlight(); };
      const blur = () => { focused = -1; highlight(); };
      link.addEventListener('pointerenter', enter); link.addEventListener('pointerleave', leave);
      link.addEventListener('focus', focus); link.addEventListener('blur', blur);
      return () => {
        link.removeEventListener('pointerenter', enter); link.removeEventListener('pointerleave', leave);
        link.removeEventListener('focus', focus); link.removeEventListener('blur', blur);
      };
    });
    const visibility = new IntersectionObserver(entries => {
      // One delivery may include an older exit and the current entry for this root.
      visible = entries.at(-1).isIntersecting;
      syncVisibility(); load();
    });
    visibility.observe(root);
    document.addEventListener('visibilitychange', syncVisibility);
    const observer = new ResizeObserver(schedule);
    [section, lead, nav, section.parentElement].forEach(element => observer.observe(element));
    reduced.addEventListener('change', schedule);
    desktop.addEventListener('change', schedule);
    connection?.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    document.fonts?.ready.then(schedule);
    measure();
    return () => {
      active = false;
      cancelAnimationFrame(pending);
      context?.revert(); release(); observer.disconnect(); visibility.disconnect(); handlers.forEach(remove => remove());
      document.removeEventListener('visibilitychange', syncVisibility);
      reduced.removeEventListener('change', schedule); desktop.removeEventListener('change', schedule);
      connection?.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule); window.removeEventListener('hashchange', schedule);
    };
  }, []);

  return <div ref={rootRef} className="layer-knot" aria-hidden="true" data-mode="hidden" data-progress="1" data-emphasis="-1">
    <svg className="layer-knot__poster" viewBox="-1.85 -1.24 3.7 2.48" focusable="false">
      <defs><linearGradient id="layer-knot-bronze" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e5c491" /><stop offset=".5" stopColor="#8f704e" /><stop offset="1" stopColor="#c7a479" /></linearGradient></defs>
      <circle r="1" fill="none" stroke="url(#layer-knot-bronze)" strokeWidth=".06" />
      <circle r=".8" fill="none" stroke="#5b5b47" strokeWidth=".12" />
      <circle r=".55" fill="none" stroke="#7b2f2b" strokeWidth=".28" />
    </svg>
  </div>;
}
