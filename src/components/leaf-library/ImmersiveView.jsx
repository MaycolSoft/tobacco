import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';
import { getLeafChapters } from '@/data/leafPresentation';
import '@/styles/anatomia-hoja.css';

export default function ImmersiveView({ leaf, onComplete }) {
  const chapters = getLeafChapters(leaf);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [imageState, setImageState] = useState('loading');
  const [reducedMotion, setReducedMotion] = useState(false);
  const elapsed = useRef(0);
  const stageRef = useRef(null);
  const touchStart = useRef(null);
  const wheelGesture = useRef({ distance: 0, last: 0, locked: false });
  const chapter = chapters[step];

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false); };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!playing || imageState !== 'loaded') return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) elapsed.current += now - last;
      last = now;
      setProgress(Math.min(elapsed.current / 9000, 1));
      if (elapsed.current >= 9000) {
        elapsed.current = 0;
        if (step < chapters.length - 1) { setStep(value => value + 1); setProgress(0); }
        else { setPlaying(false); setFinished(true); setProgress(1); }
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, step, chapters.length, imageState]);

  const goTo = (index) => {
    setStep(index); setPlaying(false); setFinished(false); setProgress(0); elapsed.current = 0;
  };
  const togglePlay = () => {
    if (finished) { goTo(0); setPlaying(true); }
    else setPlaying(value => !value);
  };

  // Scroll drives the chapters only over the image on desktop; the page keeps its own scroll.
  useEffect(() => {
    const stage = stageRef.current;
    const onWheel = (event) => {
      if (event.ctrlKey || !window.matchMedia('(min-width: 801px) and (hover: hover)').matches) return;
      const direction = Math.sign(event.deltaY);
      const next = step + direction;
      const now = performance.now();
      const gesture = wheelGesture.current;
      const idle = now - gesture.last;
      gesture.last = now;
      if (idle > 180) { gesture.distance = 0; gesture.locked = false; }
      if (gesture.locked) { event.preventDefault(); return; }
      if (!direction || next < 0 || next >= chapters.length) return;
      event.preventDefault();
      gesture.distance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1);
      if (Math.abs(gesture.distance) < 65) return;
      gesture.locked = true;
      setStep(next); setPlaying(false); setFinished(false); setProgress(0); elapsed.current = 0;
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [step, chapters.length]);

  return (
    <section className="th-experience" aria-label={`Exploración de ${leaf.name}`}>
      <div ref={stageRef} className={`th-stage th-stage-${step} ${reducedMotion ? 'th-reduced' : ''}`}
        onTouchStart={event => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
        onTouchEnd={event => {
          if (!touchStart.current) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - touchStart.current.x;
          const dy = touch.clientY - touchStart.current.y;
          touchStart.current = null;
          const next = step + (dx < 0 ? 1 : -1);
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5 && next >= 0 && next < chapters.length) goTo(next);
        }} onTouchCancel={() => { touchStart.current = null; }}>
        <div className="th-scene-caption"><span>Estudio de la hoja</span><span>0{step + 1} / 04</span></div>
        <div className="th-leaf-frame">
          <img src={leaf.fullImg} alt={`Detalle de la hoja ${leaf.name}`} className={`th-leaf ${imageState === 'loaded' ? 'is-loaded' : ''}`} onLoad={() => setImageState('loaded')} onError={() => setImageState('error')} />
          {imageState === 'loading' && <span className="th-image-status" role="status">Preparando la hoja…</span>}
          {imageState === 'error' && <span className="th-image-status" role="status">No se pudo cargar la imagen de esta hoja.</span>}
          {imageState === 'loaded' && <span className="th-point" style={{ left: `${chapter.x}%`, top: `${chapter.y}%` }} aria-hidden="true"><span />0{step + 1}</span>}
        </div>
        <span className="th-image-name" aria-hidden="true">{leaf.name}</span>
      </div>
      <div className="th-story">
        <nav className="th-chapters" aria-label="Capítulos de la experiencia">
          {chapters.map((item, index) => <button key={item.label} className={step === index ? 'active' : ''} aria-current={step === index ? 'step' : undefined} onClick={() => goTo(index)}><span>0{index + 1}</span>{item.label}</button>)}
        </nav>
        <div className="th-narrative" key={step} aria-live="polite" aria-atomic="true">
          <span className="ls-eyebrow">Capítulo 0{step + 1} · {chapter.label}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.text}</p>
          <span className="th-detail">{chapter.detail}</span>
        </div>
        <div className="th-playback">
          <div className="th-progress" aria-hidden="true"><span style={{ width: `${finished ? 100 : (step + progress) / chapters.length * 100}%` }} /></div>
          <div className="th-controls">
            <button className="th-play" onClick={togglePlay} disabled={imageState !== 'loaded'}>
              {finished ? <RotateCcw size={17} /> : playing ? <Pause size={17} /> : <Play size={17} />}
              {finished ? 'Volver a explorar' : playing ? 'Pausar recorrido' : progress > 0 ? 'Continuar recorrido' : 'Reproducir recorrido'}
            </button>
            <div className="th-step-controls"><button disabled={step === 0} onClick={() => goTo(step - 1)} aria-label="Capítulo anterior"><ArrowLeft size={19} /></button><button disabled={step === chapters.length - 1} onClick={() => goTo(step + 1)} aria-label="Capítulo siguiente"><ArrowRight size={19} /></button></div>
          </div>
          <p className="th-play-hint">{finished ? 'Has llegado al final del recorrido.' : <>Explora a tu ritmo o activa la reproducción guiada.<span className="th-desktop-hint"> También puedes desplazar sobre la hoja para cambiar de capítulo.</span><span className="th-touch-hint"> Desliza la hoja hacia los lados para cambiar de capítulo.</span></>}</p>
          {finished && onComplete && <button className="th-finish" onClick={onComplete}>Volver a la ficha de la hoja <ArrowRight size={16} /></button>}
        </div>
      </div>
    </section>
  );
}
