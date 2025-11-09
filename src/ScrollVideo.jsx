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


  

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ready = false;
    video.addEventListener("loadedmetadata", () => {
      ready = true;
    });

    let targetTime = 0;
    let animationFrameId;

    const updateVideoTime = () => {
      if (!ready || !Number.isFinite(video.duration)) {
        animationFrameId = requestAnimationFrame(updateVideoTime);
        return;
      }

      const newTime = video.currentTime + (targetTime - video.currentTime) * speed;
      if (Number.isFinite(newTime)) video.currentTime = newTime;

      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      targetTime = video.duration * scrollPercent;
    };

    window.addEventListener("scroll", handleScroll);
    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);








  // --- animación del overlay ---
  const overlayStyle = {
    opacity: Math.max(0, 1 - scrollPercent * fadeSpeed),
    transform: `translateY(${scrollPercent * -100}px)`,
    transition: "opacity 0.3s ease, transform 0.3s ease",
  };



  return (
    <div className="scroll-video-container">
      {/* Video fijo */}
      <video ref={videoRef} src={myVideo} preload="auto" muted playsInline />

      {/* Overlay animado */}
      {showOverlay && (
        <div className="overlay-content" style={overlayStyle}>
          <h1 className="fade-text">El arte detrás del tabaco</h1>
          <p className="fade-subtext">
            Cada hoja cuenta una historia.  
            Desde el secado hasta el enrollado, este video revela capa a capa  
            el proceso de preparación, textura y carácter que dan vida al tabaco artesanal.
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
      </div>

      {/* Capa "fantasma" dinámica */}
      <div
        className="scroll-space"
        style={{ height: `${scrollHeight}vh` }}
      ></div>
    </div>
  );
}
