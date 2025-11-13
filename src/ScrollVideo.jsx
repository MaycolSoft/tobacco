import React, { useRef, useEffect, useState } from "react";
import "./ScrollVideo.css";
import myVideo from "./assets/video.mp4";

export default function ScrollVideo() {
  const videoRef = useRef(null);
  const [speed, setSpeed] = useState(0.3);
  const [scrollHeight, setScrollHeight] = useState(400);
  const [visible, setVisible] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [fadeSpeed, setFadeSpeed] = useState(3.5);
  const [customVideo, setCustomVideo] = useState(null);
  const [videoFit, setVideoFit] = useState("css"); 


  const [screenInfo, setScreenInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
    aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2),
  });





  useEffect(() => {
    const handleResize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
        aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ready = false;
    video.addEventListener("loadedmetadata", () => {
      ready = true;
      console.log("Video listo. Duración:", video.duration);
    });


    let targetTime = 0;
    let animationFrameId;

    const updateVideoTime = () => {
      try {
        if (!ready || !Number.isFinite(video.duration)) {
          animationFrameId = requestAnimationFrame(updateVideoTime);
          return;
        }

        const newTime = video.currentTime + (targetTime - video.currentTime) * speed;

        if (Number.isFinite(newTime)) {
          video.currentTime = newTime;
        }
      } catch (err) {
        console.error("Error en updateVideoTime:", err);
      }

      animationFrameId = requestAnimationFrame(updateVideoTime);
    };


    const handleScroll = () => {
      try {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? scrollTop / docHeight : 0;

        if (Number.isFinite(video.duration)) {
          targetTime = video.duration * percent;
        }

        setScrollPercent(percent);
      } catch (err) {
        console.error("Error en handleScroll:", err);
      }
    };


    window.addEventListener("scroll", handleScroll);
    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMeta = () => {
      console.log("Metadata cargada. Duración:", video.duration);
    };

    video.addEventListener("loadedmetadata", handleMeta);

    return () => {
      video.removeEventListener("loadedmetadata", handleMeta);
    };
  }, [customVideo]);



  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setCustomVideo(videoURL);
    }
  };






  // --- animación del overlay ---
  const overlayStyle = {
    opacity: Math.max(0, 1 - scrollPercent * fadeSpeed),
    transform: `translateY(${scrollPercent * -100}px)`,
    transition: "opacity 0.3s ease, transform 0.3s ease",
  };



  const recommendedHeight =
    screenInfo.orientation === "horizontal"
      ? Math.round((screenInfo.width / 16) * 9)
      : Math.round((screenInfo.width / 9) * 16);


  const dynamicVideoStyle = videoFit === "css"
    ? {}
    : {
        width: "100%",
        height: "100%",
        objectFit: videoFit,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      };


  return (
    <div className="scroll-video-container">
      {/* Video fijo */}
      <video
        ref={videoRef}
        src={customVideo || myVideo}
        preload="auto"
        muted
        playsInline
        style={dynamicVideoStyle}
      />



      {/* Overlay animado */}
      {showOverlay && (
        <div className="overlay-content" style={overlayStyle}>
          <h1 className="fade-text">El arte detrás del tabaco</h1>

          <p className="fade-subtext" style={{ lineHeight: "1.6em" }}>
            Cada hoja encierra una historia.  
            Desde el secado hasta el enrollado, este recorrido revela con detalle la
            preparación artesanal del tabaco: sus capas, texturas y carácter.

            <br /><br />

            <strong>📱 Información de la pantalla actual</strong><br />
            Orientación: <strong>{screenInfo.orientation}</strong><br />
            Resolución detectada:{" "}
            <strong>{screenInfo.width} × {screenInfo.height}px</strong><br />
            Relación de aspecto:{" "}
            <strong>{screenInfo.aspectRatio}:1</strong>

            <br /><br />

            <strong>🎞️ Recomendación automática de exportación</strong><br />
            Para esta pantalla ({screenInfo.orientation}):<br />
            <strong>
              {screenInfo.width} × {recommendedHeight}px
            </strong>{" "}
            ({screenInfo.orientation === "horizontal" ? "16:9" : "9:16"})
            <br /><br />

            Esta recomendación se ajusta dinámicamente según el tamaño y orientación
            del dispositivo del usuario, garantizando que el video se muestre sin
            distorsión, recortes o pérdida de calidad.
          </p>
        </div>
      )}




      {/* Barra de progreso */}
      {showProgress && (
        <div
          className="scroll-progress"
          style={{ width: `${scrollPercent * 100}%` }}
        ></div>
      )}

      {/* Panel de controles */}
      <div
        className={`control-panel ${visible ? "visible" : ""}`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <div className="panel-header">⚙️ Controles</div>

        <label>
          Velocidad Fade: {fadeSpeed.toFixed(1)}
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={fadeSpeed}
            onChange={(e) => setFadeSpeed(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Velocidad: {speed.toFixed(2)}
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Altura Scroll: {scrollHeight}vh
          <input
            type="range"
            min="100"
            max="3500"
            step="50"
            value={scrollHeight}
            onChange={(e) => setScrollHeight(parseInt(e.target.value))}
          />
        </label>

        <label className="checkbox-control">
          <input
            type="checkbox"
            checked={showProgress}
            onChange={(e) => setShowProgress(e.target.checked)}
          />
          Mostrar barra de progreso
        </label>

        <label className="checkbox-control">
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
          />
          Mostrar texto animado
        </label>

        <label className="file-upload-control">
          Subir video
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
          />
        </label>

        <label>
          Modo de visualización del video:
          <select value={videoFit} onChange={(e) => setVideoFit(e.target.value)}>
            <option value="css">Usar CSS original</option>
            <option value="contain">Ajustar sin recorte (contain)</option>
            <option value="cover">Llenar pantalla (cover)</option>
            <option value="fill">Deformar para llenar (fill)</option>
          </select>
        </label>

      </div>

      {/* Capa "fantasma" dinámica */}
      <div
        className="scroll-space"
        style={{ height: `${scrollHeight}vh` }}
      ></div>
    </div>
  );
}
