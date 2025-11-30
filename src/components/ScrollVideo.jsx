// import React, { useRef, useEffect, useState } from "react";
// import "@styles/ScrollVideo.css";
// // import myVideo from "@/assets/video.mp4";
// import myVideo from "@/assets/colorado_claro4k120fps.mp4";

// export default function ScrollVideo() {
//   const videoRef = useRef(null);

//   const [scrubbingEnabled, setScrubbingEnabled] = useState(true);
//   const [panelOpen, setPanelOpen] = useState(false);
//   const [speed, setSpeed] = useState(0.3);
//   const [scrollHeight, setScrollHeight] = useState(400);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showProgress, setShowProgress] = useState(true);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [scrollPercent, setScrollPercent] = useState(0);
//   const [fadeSpeed, setFadeSpeed] = useState(3.5);
//   const [customVideo, setCustomVideo] = useState(null);
//   const [videoFit, setVideoFit] = useState("css");

//   const [screenInfo, setScreenInfo] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//     orientation: window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
//     aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2),
//   });

//   // === 1. Detección de pantalla ===
//   useEffect(() => {
//     const handleResize = () => {
//       setScreenInfo({
//         width: window.innerWidth,
//         height: window.innerHeight,
//         orientation: window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
//         aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2),
//       });
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // === 2. Logging de video ===
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const events = [
//       // "canplay",
//       // "canplaythrough",
//       // "loadeddata",
//       // "error",
//       // "stalled",
//       // "abort",
//       // "suspend",
//       // "waiting",
//       // "emptied",
//       // "loadstart",
//     ];

//     const log = (e) => {
//       console.log(`🎥 Evento de video: ${e.type}`, {
//         currentTime: v.currentTime,
//         readyState: v.readyState,
//         networkState: v.networkState,
//         duration: v.duration,
//       });
//     };

//     events.forEach(ev => v.addEventListener(ev, log));

//     v.onerror = () => console.error("❌ VIDEO ERROR:", v.error);

//     setTimeout(() => {
//       try {
//         v.currentTime = 1;
//         console.log("✔ Scrubbing OK en este móvil");
//       } catch (e) {
//         console.error("❌ Safari bloqueó currentTime:", e);
//       }
//     }, 2000);

//     return () => {
//       events.forEach(ev => v.removeEventListener(ev, log));
//     };
//   }, []);

//   // === Autoplay en móvil (solo para desbloquear), pero pausado ===
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const unlock = async () => {
//       try {
//         await v.play();   // iOS requiere esto para permitir scrubbing
//         v.pause();        // PERO lo pausamos inmediatamente
//         v.currentTime = 0;  
//         console.log("Video desbloqueado en móvil pero pausado correctamente");
//       } catch (err) {
//         console.warn("No se pudo desbloquear el video:", err);
//       }
//     };

//     unlock();
//   }, []);



//   // === 4. Scroll → scrubbing ===
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     let ready = false;

//     video.addEventListener("loadedmetadata", () => {
//       ready = true;
//     });

//     let targetTime = 0;
//     let animationFrameId;

//     const updateVideoTime = () => {
//       try {
//         if (!scrubbingEnabled || !ready || !Number.isFinite(video.duration)) {
//           animationFrameId = requestAnimationFrame(updateVideoTime);
//           return;
//         }

//         const newTime =
//           video.currentTime + (targetTime - video.currentTime) * speed;

//         if (Number.isFinite(newTime)) {
//           video.currentTime = newTime;
//         }
//       } catch (err) {
//         console.error("Error en updateVideoTime:", err);
//       }

//       animationFrameId = requestAnimationFrame(updateVideoTime);
//     };

//     const handleScroll = () => {
//       if (!scrubbingEnabled) return;

//       const scrollTop = window.scrollY;
//       const docHeight =
//         document.body.scrollHeight - window.innerHeight;

//       const percent = docHeight > 0 ? scrollTop / docHeight : 0;

//       if (Number.isFinite(video.duration)) {
//         targetTime = video.duration * percent;
//       }

//       setScrollPercent(percent);
//     };

//     window.addEventListener("scroll", handleScroll);
//     animationFrameId = requestAnimationFrame(updateVideoTime);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, [speed, scrubbingEnabled]);



//   useEffect(() => {
//   // === 5. Cambio de video ===
//     const video = videoRef.current;
//     if (!video) return;

//     const handleMeta = () => {
//       console.log("Metadata cargada. Duración:", video.duration);
//     };

//     video.addEventListener("loadedmetadata", handleMeta);

//     return () => video.removeEventListener("loadedmetadata", handleMeta);
//   }, [customVideo]);


//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setCustomVideo(url);
//     }
//   };


//   const togglePlay = async () => {
//     const v = videoRef.current;
//     if (!v) return;

//     if (isPlaying) {
//       v.pause();
//       setIsPlaying(false);
//     } else {
//       try {
//         await v.play();
//         setIsPlaying(true);
//       } catch (err) {
//         console.error("No se puede reproducir:", err);
//       }
//     }
//   };


//   // === Overlay scroll ===
//   const overlayStyle = {
//     opacity: Math.max(0, 1 - scrollPercent * fadeSpeed),
//     transform: `translateY(${scrollPercent * -100}px)`,
//     transition: "opacity 0.3s ease, transform 0.3s ease",
//   };

//   const recommendedHeight =
//     screenInfo.orientation === "horizontal"
//       ? Math.round((screenInfo.width / 16) * 9)
//       : Math.round((screenInfo.width / 9) * 16);

//   const dynamicVideoStyle =
//     videoFit === "css"
//       ? {}
//       : {
//           width: "100%",
//           height: "100%",
//           objectFit: videoFit,
//           position: "fixed",
//           top: 0,
//           left: 0,
//           zIndex: -1,
//         };

//   return (
//     <div className="scroll-video-container">
      
//       {/* === VIDEO === */}
//       <video
//         ref={videoRef}
//         src={customVideo || myVideo}
//         preload="auto"
//         muted
//         playsInline
//         style={dynamicVideoStyle}
//       />

//       {/* === OVERLAY === */}
//       {showOverlay && (
//         <div className="overlay-content" style={overlayStyle}>
//           <h1 className="fade-text">El arte detrás del tabaco</h1>

//           <p className="fade-subtext" style={{ lineHeight: "1.6em" }}>
//             Cada hoja encierra una historia.  
//             Desde el secado hasta el enrollado, este recorrido revela con detalle
//             la preparación artesanal del tabaco.

//             <br /><br />

//             <strong>📱 Información de pantalla</strong><br />
//             Orientación: <strong>{screenInfo.orientation}</strong><br />
//             Resolución: <strong>{screenInfo.width} × {screenInfo.height}</strong><br />
//             Aspect ratio: <strong>{screenInfo.aspectRatio}</strong>

//             <br /><br />

//             <strong>🎞️ Recomendación de exportación</strong><br />
//             <strong>{screenInfo.width} × {recommendedHeight}px</strong>
//           </p>
//         </div>
//       )}

//       {/* === PROGRESS BAR === */}
//       {showProgress && (
//         <div
//           className="scroll-progress"
//           style={{ width: `${scrollPercent * 100}%` }}
//         ></div>
//       )}

      
//       {/* === BOTÓN FLOTANTE PARA ABRIR === */}
//       <button
//         className="control-toggle-btn"
//         onClick={() => setPanelOpen((s) => !s)}
//       >
//         {panelOpen ? "✖" : "⚙️"}
//       </button>

//       {/* === PANEL DE CONTROLES === */}
//       <div className={`control-panel ${panelOpen ? "open" : ""}`}>
//         <div className="panel-header">⚙️ Controles</div>

//         <label>
//           Velocidad Fade: {fadeSpeed.toFixed(1)}
//           <input
//             type="range"
//             min="1"
//             max="6"
//             step="0.5"
//             value={fadeSpeed}
//             onChange={(e) => setFadeSpeed(parseFloat(e.target.value))}
//           />
//         </label>

//         <label>
//           Velocidad: {speed.toFixed(2)}
//           <input
//             type="range"
//             min="0.05"
//             max="0.8"
//             step="0.05"
//             value={speed}
//             onChange={(e) => setSpeed(parseFloat(e.target.value))}
//           />
//         </label>

//         <label>
//           Altura Scroll: {scrollHeight}vh
//           <input
//             type="range"
//             min="100"
//             max="3500"
//             step="50"
//             value={scrollHeight}
//             onChange={(e) => setScrollHeight(parseInt(e.target.value))}
//           />
//         </label>

//         <label className="checkbox-control">
//           <input
//             type="checkbox"
//             checked={showProgress}
//             onChange={(e) => setShowProgress(e.target.checked)}
//           />
//           Mostrar barra de progreso
//         </label>

//         <label className="checkbox-control">
//           <input
//             type="checkbox"
//             checked={showOverlay}
//             onChange={(e) => setShowOverlay(e.target.checked)}
//           />
//           Mostrar texto animado
//         </label>

//         <label className="file-upload-control">
//           Subir video
//           <input type="file" accept="video/*" onChange={handleVideoUpload} />
//         </label>

//         <label>
//           Modo de video:
//           <select
//             value={videoFit}
//             onChange={(e) => setVideoFit(e.target.value)}
//           >
//             <option value="css">CSS por defecto</option>
//             <option value="contain">Contain</option>
//             <option value="cover">Cover</option>
//             <option value="fill">Fill</option>
//           </select>
//         </label>

//         <button
//           className="play-toggle-btn"
//           onClick={() => setScrubbingEnabled(s => !s)}
//         >
//           {scrubbingEnabled ? "⏸" : "▶️"}
//         </button>

//       </div>


//       {/* === SCROLL SPACE === */}
//       <div
//         className="scroll-space"
//         style={{ height: `${scrollHeight}vh` }}
//       ></div>
//     </div>
//   );
// }



import CanvasScrollVideo from "./CanvasScrollVideo";

export default function DemoPage() {
  return <CanvasScrollVideo />;
}

