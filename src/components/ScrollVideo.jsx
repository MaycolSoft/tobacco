
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";
import { getOrDownloadFrame, blobToImage } from "@/data/frameCache";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);


const FloatingSteps = ({ frameCount, onStepClick, currentFrame }) => {
  // Genera dinámicamente un arreglo con los 5 índices equidistantes basados exactamente en el total de imágenes
  const steps = Array.from({ length: 5 }, (_, index) => {
    return Math.round(((frameCount - 1) / 4) * index);
  });

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={stepsContainerStyle}
    >      
      {steps.map((frame, index) => {
        const nextStepFrame = steps[index + 1] || 999999;
        const isThisStepActive = currentFrame >= frame && currentFrame < nextStepFrame;

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

export default function ScrollVideo({ videoInfo={} }) {
  const canvasRef = useRef(null);
  const frameRef = useRef({ index: 0 });
  const imagesRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoPlayTweenRef = useRef(null);

  // Estados de carga y UI
  const [activeStep, setActiveStep] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [totalDownloaded, setTotalDownloaded] = useState(0);

  // Control de velocidad de scroll
  const [scrollHeight, setScrollHeight] = useState(() =>
    parseInt(localStorage.getItem('sv-scroll-height') || '1200', 10)
  );
  const [showSpeedPanel, setShowSpeedPanel] = useState(false);

  const handleScrollHeightChange = (val) => {
    setScrollHeight(val);
    localStorage.setItem('sv-scroll-height', String(val));
  };

  const CDN = `https://cdn.mbsoft.freeddns.org/${videoInfo.name}`;
  const frameCount = videoInfo.length;
  const criticalBatch = 300;   

  const imgPath = (i) => `${CDN}/frame_${String(i).padStart(4, "0")}.webp`;

  function drawContain(ctx, img, canvas) {
    if (!img || !img.complete) return;
    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.width;
    const iH = img.height;

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
    ctx.drawImage(img, x, y, w, h);
  }

  // ==========================================
  // 2. PLAY / PAUSE LOGIC FUNCTION
  // ==========================================
  // Place this function inside your ScrollVideo component:
  const togglePlayPause = () => {
    const scroller = document.querySelector("#video-root");
    if (!scroller || !showCanvas) return;

    if (isPlaying) {
      if (autoPlayTweenRef.current) autoPlayTweenRef.current.kill();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);

      const currentScroll = scroller.scrollTop;
      const maxScroll = scroller.scrollHeight - window.innerHeight;

      // 1. Validar si ya llegó al final para reiniciar
      if ((maxScroll - currentScroll) <= 1) {
        scroller.scrollTop = 0;
      }

      // 2. Definir la tasa de refresco (60 FPS)
      const TARGET_FPS = 120;

      // 3. Obtener la proporción actual del scroll (0 a 1)
      const currentProgress = maxScroll > 0 ? (scroller.scrollTop / maxScroll) : 0;

      // 4. Calcular cuántos frames quedan por reproducir desde el punto actual
      const remainingFrames = frameCount * (1 - currentProgress);

      // 5. El tiempo exacto en segundos para mantener velocidad lineal uniforme de 60fps
      const dynamicDuration = remainingFrames / TARGET_FPS;

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
    const frameDistance = Math.abs(frameTarget - currentFrame);
    
    // Lógica de duración dinámica:
    // Mínimo 0.8s para que no sea brusco
    // Máximo 2.5s para que no sea aburrido
    // Proporción: 1.5s por cada 1000 frames de distancia
    const dynamicDuration = Math.min(Math.max(frameDistance / 1000 * 1.5, 0.8), 2.5);

    const progress = frameTarget / (frameCount - 1);
    const scroller = document.querySelector("#video-root");
    if (!scroller) return;

    const scrollTarget = (scroller.scrollHeight - window.innerHeight) * progress;

    gsap.to(scroller, {
      scrollTo: scrollTarget,
      duration: dynamicDuration,
      ease: "power2.inOut", // Aceleración y desaceleración suave
      overwrite: "auto"     // Evita conflictos si el usuario hace click en varios botones rápido
    });
  };


  // EFECTO 1: Manejo de Carga de Imágenes y Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let cancelled = false;
    let loadedCount = 0;

    const criticalTarget = Math.min(criticalBatch, frameCount);

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const currentImage = imagesRef.current[frameRef.current.index];

      if (currentImage) {
        drawContain(ctx, currentImage, canvas);
      }
    };

    window.addEventListener("resize", setSize);
    setSize();

    async function loadFrame(frameNumber) {
      const url = imgPath(frameNumber);
      const key = `${videoInfo.name}:frame:${String(frameNumber).padStart(4, "0")}`;

      const { blob, fromCache } = await getOrDownloadFrame({
        key,
        url,
        videoName: videoInfo.name,
        frame: frameNumber,
      });

      const img = await blobToImage(blob);

      if (cancelled) return;

      imagesRef.current[frameNumber - 1] = img;

      loadedCount++;

      setTotalDownloaded(loadedCount);

      if (loadedCount <= criticalTarget) {
        const progress = Math.round((loadedCount / criticalTarget) * 100);
        setLoadingProgress(progress);
      }

      if (loadedCount === criticalTarget) {
        setIsReady(true);

        setTimeout(() => {
          if (!cancelled) {
            setShowCanvas(true);
          }
        }, 800);
      }

      return fromCache;
    }

    async function preloadFrames() {
      try {
        // Primero carga los frames críticos.
        for (let i = 1; i <= criticalTarget; i++) {
          await loadFrame(i);
        }

        // Luego carga el resto en segundo plano.
        for (let i = criticalTarget + 1; i <= frameCount; i++) {
          if (cancelled) break;
          loadFrame(i).catch(console.error);
        }
      } catch (error) {
        console.error("Error cargando frames:", error);
      }
    }

    preloadFrames();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", setSize);
    };
  }, [frameCount, videoInfo.name]);

  // EFECTO 2: Inicialización de GSAP (Solo cuando el canvas es visible)
  useEffect(() => {
    if (!showCanvas) return;

    // Pequeño delay para asegurar que el DOM de #video-root esté listo
    const ctx = canvasRef.current.getContext("2d");
    
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

        // 1. Dibujar el frame (Siempre usando el entero más cercano)
        const img = imagesRef.current[currentIndex];
        if (img && img.complete) {
          drawContain(ctx, img, canvasRef.current);
        }

        // 2. Actualizar el estado de la UI (Solo si el número entero cambió)
        // Usamos una función de actualización para comparar con el valor real previo
        setActiveStep(prev => {
          if (prev !== currentIndex) return currentIndex;
          return prev;
        });
      }
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [showCanvas]);

  // Recalcular ScrollTrigger DESPUÉS de que React aplique el nuevo height al DOM
  useEffect(() => {
    if (!showCanvas) return;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [scrollHeight, showCanvas]);

  return (
    <div className="scroll-container"
      style={{
        height: `${scrollHeight}vh`,
        background: "#D6C8B9"
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
                  color: '#d4af37', 
                  letterSpacing: '8px', // Bajamos de 12 a 8 para legibilidad
                  fontSize: '2.2rem', 
                  marginBottom: '15px',
                  fontWeight: '300', // Un peso más fino se ve más elegante
                  textTransform: 'uppercase',
                  textShadow: '0 0 20px rgba(212, 175, 55, 0.3)', // Brillo suave constante
                  background: 'linear-gradient(90deg, #d4af37 0%, #fff 50%, #d4af37 100%)',
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

      <div style={debugStyle}>
        Assets: {totalDownloaded} / {frameCount} | Actual Frame: {activeStep}
      </div>

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
            frameCount={frameCount}
            onStepClick={goToStep}
            currentFrame={activeStep}
          />
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', borderRadius: 1 }} />
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
          background: rgba(5, 5, 5, 0.75);
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
          color: var(--ls-text-on-gold);
          box-shadow: 0 0 25px var(--ls-btn-primary);
        }
        .ls-controls-toggle:active { transform: scale(0.95); }
        .ls-controls-icon { display: block; transition: transform 0.2s ease; }
        .sv-step-btn {
          background: rgba(0, 0, 0, 0.6);
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
          color: var(--ls-text-on-gold);
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
          background: rgba(5,5,5,0.75);
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
          color: var(--ls-text-on-gold);
          border-color: transparent;
        }
        .sv-speed-panel {
          position: absolute;
          bottom: 44px;
          left: 0;
          background: rgba(8,8,8,0.88);
          border: 1px solid rgba(255,255,255,0.1);
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
          color: rgba(255,255,255,0.5);
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
          color: rgba(255,255,255,0.3);
          margin-top: 6px;
          letter-spacing: 1px;
        }

        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Para Firefox y IE/Edge antiguo */
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `}</style>
    </div>
  );
}

// --- ESTILOS ---
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  background: '#000', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center'
};

const smokeStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  background: 'radial-gradient(circle, rgba(40,40,40,0.3) 0%, rgba(0,0,0,1) 80%)',
  opacity: 0.6, filter: 'blur(40px)', pointerEvents: 'none'
};

const titleStyle = { color: '#d4af37', letterSpacing: '8px', fontSize: '0.8rem', marginBottom: '20px' };

const progressContainer = {  height: '1px', background: 'rgba(212, 175, 55, 0.2)', position: 'relative' };

const progressBar = { height: '100%', background: '#d4af37', boxShadow: '0 0 15px #d4af37' };

const statusContainer = { marginTop: '10px', display: 'flex', justifyContent: 'space-between',  color: '#444', fontSize: '9px', fontWeight: 'bold' };

const debugStyle = { position: 'fixed', bottom: '20px', left: '20px', zIndex: 6000, background: 'rgba(0,0,0,0.7)', color: '#d4af37', padding: '8px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'monospace' };

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


