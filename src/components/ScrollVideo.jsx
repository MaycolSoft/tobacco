
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";
import { FrameScheduler, getFrameDiagnostics } from "@/lib/frameScheduler";
import { getFrameProfile } from "@/lib/frameProfile";
import { SOURCE_FPS } from "@/config/animationPerformance";
import { useAnimationPerfStore } from "@/store/useAnimationPerfStore";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const STEP_COUNT = 5;

// Genera los 5 índices equidistantes basados exactamente en el total de imágenes
const getStepFrames = (frameCount) =>
  Array.from({ length: STEP_COUNT }, (_, index) => Math.round(((frameCount - 1) / (STEP_COUNT - 1)) * index));

const getStepIndex = (steps, frame) => {
  for (let index = steps.length - 1; index >= 0; index--) {
    if (frame >= steps[index]) return index;
  }
  return 0;
};

const FloatingSteps = ({ steps, onStepClick, activeStep }) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={stepsContainerStyle}
    >      
      {steps.map((frame, index) => {
        const isThisStepActive = activeStep === index;

        return (
          <motion.button
            key={index}
            onClick={() => onStepClick(frame)}
            animate={{ scale: isThisStepActive ? 1.15 : 1 }}
            className={`sv-step-btn ${isThisStepActive ? 'sv-step-btn--active' : ''}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="sv-step-label">PASO</span>
            {index + 1}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// Dibuja un frame decodificado ({ source, width, height }) centrado en el canvas, en píxeles reales del backing store.
function drawContain(ctx, frame, canvas) {
  if (!frame?.width || !frame?.height) return;
  const cW = canvas.width;
  const cH = canvas.height;
  const iW = frame.width;
  const iH = frame.height;

  const iRatio = iW / iH;
  const cRatio = cW / cH;

  let w, h;
  if (iRatio < cRatio) {
    h = cH;
    w = (iW * cH) / iH;
  } else {
    w = cW;
    h = (iH * cW) / iW;
  }

  const x = (cW - w) / 2;
  const y = (cH - h) / 2;

  ctx.clearRect(0, 0, cW, cH);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(frame.source, x, y, w, h);
}

export default function ScrollVideo({ videoInfo={} }) {
  const canvasRef = useRef(null);
  const frameRef = useRef({ index: 0 });
  const schedulerRef = useRef(null);
  const lastDrawnRef = useRef(-1);
  const drawRafRef = useRef(null);
  const setSizeRef = useRef(null);
  const activeStepRef = useRef(null);
  const statsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoPlayTweenRef = useRef(null);

  // Configuración interna de rendimiento (defaults en config/animationPerformance.js)
  const perfConfig = useAnimationPerfStore(state => state.config);
  const perfConfigRef = useRef(perfConfig);

  // Perfil de frames: carpeta del CDN, cantidad y FPS reales (el usuario nunca lo ve)
  const profile = useMemo(
    () => getFrameProfile(videoInfo, perfConfig.sourceMode),
    [videoInfo, perfConfig.sourceMode]
  );
  const frameCount = profile.frameCount;
  const steps = useMemo(() => getStepFrames(frameCount), [frameCount]);

  // Estados de carga y UI
  const [activeStep, setActiveStep] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCanvas, setShowCanvas] = useState(false);

  // Control de velocidad de scroll
  const [scrollHeight, setScrollHeight] = useState(() =>
    parseInt(localStorage.getItem('sv-scroll-height') || '1200', 10)
  );
  const [showSpeedPanel, setShowSpeedPanel] = useState(false);

  const handleScrollHeightChange = (val) => {
    setScrollHeight(val);
    localStorage.setItem('sv-scroll-height', String(val));
  };

  // Dibuja el frame pedido por GSAP o, si aún no está listo, el decodificado más cercano.
  const drawCurrent = (force = false) => {
    const canvas = canvasRef.current;
    const scheduler = schedulerRef.current;
    if (!canvas || !scheduler) return;

    const drawable = scheduler.getDrawable(Math.round(frameRef.current.index));
    // Sin ningún frame decodificado: se conserva lo último dibujado.
    if (!drawable) return;
    if (!force && drawable.index === lastDrawnRef.current) return;

    drawContain(canvas.getContext("2d"), drawable.frame, canvas);
    lastDrawnRef.current = drawable.index;
    scheduler.noteRendered(drawable.index, drawable.exact);
  };

  const requestDraw = () => {
    if (drawRafRef.current) return;
    drawRafRef.current = requestAnimationFrame(() => {
      drawRafRef.current = null;
      drawCurrent();
    });
  };

  // ==========================================
  // 2. PLAY / PAUSE LOGIC FUNCTION
  // ==========================================
  const togglePlayPause = () => {
    const scroller = document.querySelector("#video-root");
    if (!scroller || !showCanvas) return;

    if (isPlaying) {
      if (autoPlayTweenRef.current) autoPlayTweenRef.current.kill();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);

      const currentScroll = scroller.scrollTop;
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;

      // 1. Validar si ya llegó al final para reiniciar
      if ((maxScroll - currentScroll) <= 1) {
        scroller.scrollTop = 0;
      }

      // 2. Obtener la proporción actual del scroll (0 a 1)
      const currentProgress = maxScroll > 0 ? (scroller.scrollTop / maxScroll) : 0;

      // 3. Calcular cuántos frames quedan por reproducir desde el punto actual
      const remainingFrames = frameCount * (1 - currentProgress);

      // 4. Duración real de la animación original según los FPS del perfil activo
      const dynamicDuration = remainingFrames / profile.fps;

      autoPlayTweenRef.current = gsap.to(scroller, {
        scrollTo: maxScroll,
        duration: dynamicDuration,
        ease: "none", // Estrictamente lineal para simular reproducción de video real
        overwrite: "auto",
        onComplete: () => setIsPlaying(false)
      });
    }
  };

  const goToStep = (frameTarget) => {
    if (!showCanvas) return;

    if (autoPlayTweenRef.current) autoPlayTweenRef.current.kill();
    setIsPlaying(false);

    const currentFrame = frameRef.current.index;
    // Distancia medida en frames del video original para que la duración no dependa del perfil
    const frameDistance = Math.abs(frameTarget - currentFrame) * (SOURCE_FPS / profile.fps);
    
    // Lógica de duración dinámica:
    // Mínimo 0.8s para que no sea brusco
    // Máximo 2.5s para que no sea aburrido
    // Proporción: 1.5s por cada 1000 frames de distancia
    const dynamicDuration = Math.min(Math.max(frameDistance / 1000 * 1.5, 0.8), 2.5);

    const progress = frameTarget / (frameCount - 1);
    const scroller = document.querySelector("#video-root");
    if (!scroller) return;

    const scrollTarget = (scroller.scrollHeight - scroller.clientHeight) * progress;

    // El destino y su vecindario pasan a ser la máxima prioridad (sin exigir los frames intermedios)
    schedulerRef.current?.setFocus(frameTarget);
    const clearFocus = () => schedulerRef.current?.clearFocus();

    gsap.to(scroller, {
      scrollTo: scrollTarget,
      duration: dynamicDuration,
      ease: "power2.inOut", // Aceleración y desaceleración suave
      overwrite: "auto",    // Evita conflictos si el usuario hace click en varios botones rápido
      onComplete: clearFocus,
      onInterrupt: clearFocus
    });
  };


  // EFECTO 1: Scheduler de frames, canvas (DPR) y resize
  useEffect(() => {
    const canvas = canvasRef.current;
    let loaderDone = false;

    frameRef.current.index = 0;
    lastDrawnRef.current = -1;
    activeStepRef.current = null;
    setActiveStep(null);
    setShowCanvas(false);
    setLoadingProgress(0);

    const scheduler = new FrameScheduler({
      profile,
      config: perfConfigRef.current,
      onFrameReady: () => requestDraw(),
    });
    schedulerRef.current = scheduler;

    // Overlay de carga: visible de inmediato mientras el scheduler ya descarga detrás.
    // Se oculta cuando el frame 1 está dibujable y hay un buffer inicial corto y consecutivo,
    // respetando un tiempo mínimo (sin parpadeo si todo viene de caché) y un tope (nunca queda trabado).
    const { loaderBufferFrames, loaderMinDisplayMs, loaderMaxWaitMs } = perfConfigRef.current;
    const bufferTarget = Math.min(loaderBufferFrames, Math.max(profile.frameCount, 1));
    const openedAt = performance.now();
    const loaderInterval = setInterval(() => {
      if (loaderDone) return;
      const ready = scheduler.readyFrom(0, bufferTarget);
      const firstFrameReady = scheduler.getDrawable(0)?.index === 0;
      setLoadingProgress(Math.round(((firstFrameReady ? ready : 0) / bufferTarget) * 100));

      const elapsed = performance.now() - openedAt;
      const bufferReady = firstFrameReady && ready >= bufferTarget;
      if ((bufferReady && elapsed >= loaderMinDisplayMs) || elapsed >= loaderMaxWaitMs) {
        loaderDone = true;
        clearInterval(loaderInterval);
        setLoadingProgress(100);
        setShowCanvas(true);
      }
    }, 100);

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, perfConfigRef.current.maxDpr);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      scheduler.setRenderSize(canvas.width, canvas.height);
      // Cambiar el tamaño limpia el canvas: redibujar el mejor frame disponible.
      drawCurrent(true);
    };
    setSizeRef.current = setSize;

    window.addEventListener("resize", setSize);
    // Inicia la carga: prioridad al frame 1 y su vecindario hacia adelante.
    setSize();

    return () => {
      clearInterval(loaderInterval);
      window.removeEventListener("resize", setSize);
      if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current);
      drawRafRef.current = null;
      setSizeRef.current = null;
      scheduler.dispose();
      if (schedulerRef.current === scheduler) schedulerRef.current = null;
    };
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cambios de configuración interna en caliente (LayoutControlPanel)
  useEffect(() => {
    const previous = perfConfigRef.current;
    perfConfigRef.current = perfConfig;
    schedulerRef.current?.updateConfig(perfConfig);
    if (previous.maxDpr !== perfConfig.maxDpr) setSizeRef.current?.();
  }, [perfConfig]);

  // EFECTO 2: Inicialización de GSAP (Solo cuando el canvas es visible)
  useEffect(() => {
    if (!showCanvas) return;

    let previousIndex = Math.round(frameRef.current.index);

    const anim = gsap.to(frameRef.current, {
      index: frameCount - 1,
      snap: "index",
      ease: "none",
      scrollTrigger: {
        trigger: ".scroll-container",
        scroller: "#video-root", // 🔥 Crucial: Escucha al overlay
        scrub: 0.6,
        start: "top top",
        end: "bottom bottom",
      },
      onUpdate: () => {
        const currentIndex = Math.round(frameRef.current.index);
        const direction = Math.sign(currentIndex - previousIndex);
        previousIndex = currentIndex;

        // 1. Priorizar el frame pedido y dibujar (o el más cercano ya decodificado)
        schedulerRef.current?.setTarget(currentIndex, direction);
        drawCurrent();

        // 2. React solo se entera cuando cambia el paso lógico (5 pasos), no en cada frame
        const stepIndex = getStepIndex(steps, currentIndex);
        if (stepIndex !== activeStepRef.current) {
          activeStepRef.current = stepIndex;
          setActiveStep(stepIndex);
        }
      }
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
      autoPlayTweenRef.current?.kill();
    };
  }, [showCanvas, frameCount, steps]);

  // Recalcular ScrollTrigger DESPUÉS de que React aplique el nuevo height al DOM
  useEffect(() => {
    if (!showCanvas) return;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [scrollHeight, showCanvas]);

  // Estadísticas de carga: se escriben directo en el DOM (sin renders de React)
  useEffect(() => {
    if (!perfConfig.showLoaderStats) return;
    const update = () => {
      if (!statsRef.current) return;
      const stats = getFrameDiagnostics();
      statsRef.current.textContent =
        `Req: ${stats.requestedFrame ?? 0} / ${frameCount} | Drawn: ${stats.renderedFrame ?? '—'} (lag ${stats.frameLag ?? '—'}) | ` +
        `Decoded: ${stats.decodedFrames ?? 0} | Queue: ${stats.queueLength ?? 0} | Active: ${stats.activeDownloads ?? 0}/${stats.activeDecodes ?? 0} | ` +
        `Stride: ${stats.stride ?? 1}`;
    };
    update();
    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [perfConfig.showLoaderStats, frameCount]);

  return (
    <div className="scroll-container"
      style={{
        height: `${scrollHeight}vh`,
        background: "var(--ls-video-bg)"
      }}
    >
      
      <AnimatePresence>
        {!showCanvas && (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={overlayStyle}
          >
            <div style={smokeStyle} />
            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ 
                  color: 'var(--ls-gold)', 
                  letterSpacing: '8px', // Bajamos de 12 a 8 para legibilidad
                  fontSize: '2.2rem', 
                  marginBottom: '15px',
                  fontWeight: '300', // Un peso más fino se ve más elegante
                  textTransform: 'uppercase',
                  textShadow: '0 0 20px var(--ls-gold-border)', // Brillo suave constante
                  background: 'linear-gradient(90deg, var(--ls-gold) 0%, var(--ls-text-primary) 50%, var(--ls-gold) 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 4s linear infinite', // Necesitas definir el keyframe shimmer en tu CSS
                }}
              >
                {videoInfo?.displayName ?? ''}
              </motion.h1>
              
              <motion.h2 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={titleStyle}
              >
                PREPARANDO MEZCLA
              </motion.h2>
              <div style={progressContainer}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  style={progressBar} 
                />
              </div>
              <div style={statusContainer}>
                <span>CALIDAD: PREMIUM</span>
                <span>{loadingProgress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {perfConfig.showLoaderStats && <div ref={statsRef} style={debugStyle} />}

      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: showCanvas ? 1 : 0,
          transition: "opacity 2s ease-in-out",
          pointerEvents: "none",
          background: "transparent",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
        }}
      />
       
      {showCanvas && (
        <div style={controlsColumnStyle}>
          <FloatingSteps
            steps={steps}
            onStepClick={goToStep}
            activeStep={activeStep}
          />
          <div style={{ width: 1, height: 20, background: 'var(--ls-border)', borderRadius: 1 }} />
          <button
            className="ls-controls-toggle"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <svg className="ls-controls-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="ls-controls-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {showCanvas && (
        <div style={speedControlStyle}>
          <button
            className="sv-gear-btn"
            onClick={() => setShowSpeedPanel(p => !p)}
            title="Velocidad de scroll"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.02 7.02 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4a.484.484 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.03.7 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.22 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>

          {showSpeedPanel && (
            <div className="sv-speed-panel">
              <div className="sv-speed-label">
                <span>VELOCIDAD</span>
                <span className="sv-speed-value">{scrollHeight}vh</span>
              </div>
              <input
                type="range"
                min={150}
                max={3000}
                step={100}
                value={scrollHeight}
                onChange={e => handleScrollHeightChange(Number(e.target.value))}
                className="sv-speed-slider"
              />
              <div className="sv-speed-hints">
                <span>Rápido</span>
                <span>Lento</span>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .ls-controls-toggle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--ls-glass);
          border: 1px solid var(--ls-btn-secondary);
          color: var(--ls-btn-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .ls-controls-toggle:hover {
          transform: scale(1.1);
          background: var(--ls-btn-primary);
          color: var(--ls-text-on-primary);
          box-shadow: 0 0 25px var(--ls-btn-primary);
        }
        .ls-controls-toggle:active { transform: scale(0.95); }
        .ls-controls-icon { display: block; transition: transform 0.2s ease; }
        .sv-step-btn {
          background: var(--ls-glass);
          border: 1px solid var(--ls-btn-secondary);
          color: var(--ls-btn-secondary);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          backdrop-filter: blur(5px);
          transition: border-color 0.3s ease, color 0.3s ease;
        }
        .sv-step-btn--active {
          background: var(--ls-btn-primary);
          color: var(--ls-text-on-primary);
          border-color: transparent;
          box-shadow: 0 0 20px var(--ls-btn-primary);
        }
        .sv-step-label {
          font-size: 7px;
          letter-spacing: 1px;
          margin-bottom: -2px;
          opacity: 0.8;
        }
        .sv-gear-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--ls-glass);
          border: 1px solid var(--ls-btn-secondary);
          color: var(--ls-btn-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }
        .sv-gear-btn:hover {
          background: var(--ls-btn-primary);
          color: var(--ls-text-on-primary);
          border-color: transparent;
        }
        .sv-speed-panel {
          position: absolute;
          bottom: 44px;
          left: 0;
          background: var(--ls-glass);
          border: 1px solid var(--ls-border);
          border-radius: 10px;
          padding: 14px 16px;
          width: 200px;
          backdrop-filter: blur(12px);
        }
        .sv-speed-label {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          letter-spacing: 1.5px;
          color: var(--ls-text-secondary);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .sv-speed-value {
          color: var(--ls-btn-secondary);
          font-weight: bold;
        }
        .sv-speed-slider {
          width: 100%;
          accent-color: var(--ls-btn-primary);
          cursor: pointer;
        }
        .sv-speed-hints {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          color: var(--ls-text-dim);
          margin-top: 6px;
          letter-spacing: 1px;
        }

      `}</style>
    </div>
  );
}

// --- ESTILOS ---
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'var(--ls-bg)', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center'
};

const smokeStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  background: 'radial-gradient(circle, var(--ls-gold-subtle) 0%, var(--ls-bg) 80%)',
  opacity: 0.6, filter: 'blur(40px)', pointerEvents: 'none'
};

const titleStyle = { color: 'var(--ls-gold)', letterSpacing: '8px', fontSize: '0.8rem', marginBottom: '20px' };

const progressContainer = {  height: '1px', background: 'var(--ls-gold-border)', position: 'relative' };

const progressBar = { height: '100%', background: 'var(--ls-gold)', boxShadow: '0 0 15px var(--ls-gold)' };

const statusContainer = { marginTop: '10px', display: 'flex', justifyContent: 'space-between',  color: 'var(--ls-text-secondary)', fontSize: '9px', fontWeight: 'bold' };

const debugStyle = { position: 'fixed', bottom: '20px', left: '20px', zIndex: 6000, background: 'var(--ls-glass)', color: 'var(--ls-gold)', padding: '8px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'monospace' };

const controlsColumnStyle = {
  position: 'fixed',
  right: '30px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
  zIndex: 7000,
};

const speedControlStyle = {
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  zIndex: 7000,
};

const stepsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
};
