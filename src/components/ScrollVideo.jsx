
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const FloatingSteps = ({ steps, onStepClick, currentFrame }) => {
  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={stepsContainerStyle}
    >
      {steps.map((frame, index) => {
        // Lógica: Si el frame actual está entre este paso y el siguiente, está activo
        const nextStepFrame = steps[index + 1] || 999999; 
        const isThisStepActive = currentFrame >= frame && currentFrame < nextStepFrame;

        return (
          <motion.button 
            key={index} 
            onClick={() => onStepClick(frame)}
            // Framer motion para animar suavemente el cambio de estado
            animate={{
              backgroundColor: isThisStepActive ? '#d4af37' : 'rgba(0, 0, 0, 0.6)',
              color: isThisStepActive ? '#000' : '#d4af37',
              scale: isThisStepActive ? 1.15 : 1,
            }}
            style={{
              ...stepButtonStyle,
              boxShadow: isThisStepActive ? '0 0 20px #d4af37' : '0 0 10px rgba(0,0,0,0.2)',
              border: isThisStepActive ? '1px solid #fff' : '1px solid #d4af37',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span style={{
              ...stepLabelStyle,
              color: isThisStepActive ? '#000' : '#d4af37'
            }}>PASO</span>
            {index + 1}
          </motion.button>
        );
      })}
    </motion.div>
  );
};


export default function ScrollVideo({ videoInfo={} }) {
  const canvasRef = useRef(null);
  const frameRef = useRef({ index: 0 });
  const imagesRef = useRef([]);
  
  // Estados de carga y UI
  const [activeStep, setActiveStep] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [totalDownloaded, setTotalDownloaded] = useState(0);


  const CDN = videoInfo?.name == null ? "https://cdn.mbsoft.freeddns.org" : `https://cdn.mbsoft.freeddns.org/${videoInfo.name}`;
  const frameCount = videoInfo?.length == null ? 1701 : videoInfo.length;
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



  const goToStep = (frameTarget) => {
    if (!showCanvas) return;

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
    let loadedCount = 0;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imagesRef.current[frameRef.current.index]) {
        drawContain(ctx, imagesRef.current[frameRef.current.index], canvas);
      }
    };

    window.addEventListener("resize", setSize);
    setSize();

    // Precarga de imágenes
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = imgPath(i + 1);
      img.onload = () => {
        loadedCount++;
        setTotalDownloaded(loadedCount);
        if (loadedCount <= criticalBatch) {
          const progress = Math.round((loadedCount / criticalBatch) * 100);
          setLoadingProgress(progress);
          if (loadedCount === criticalBatch) {
            setTimeout(() => {
              setIsReady(true);
              setTimeout(() => setShowCanvas(true), 800);
            }, 1000);
          }
        }
      };
      imagesRef.current[i] = img;
    }

    return () => window.removeEventListener("resize", setSize);
  }, []);

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
  }, [showCanvas]); // Se dispara cuando termina el loading

  return (
    <div className="scroll-container" style={{ height: "1200vh", background: "#000" }}>
      
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
          background: "black",
          pointerEvents: "none"
        }}
      />

      {showCanvas && videoInfo?.steps && (
        <FloatingSteps 
          steps={videoInfo.steps} 
          onStepClick={goToStep}
          currentFrame={activeStep}
        />
      )}
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

const stepsContainerStyle = {
  position: 'fixed',
  right: '30px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  zIndex: 7000
};

const stepButtonStyle = {
  background: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid #d4af37',
  color: '#d4af37',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(5px)',
  boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
};

const stepLabelStyle = {
  fontSize: '7px',
  letterSpacing: '1px',
  marginBottom: '-2px',
  opacity: 0.8
};

