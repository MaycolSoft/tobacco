import "@styles/CraftYourCigar.css";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollVideo from '@components/ScrollVideo.jsx';
import LeafGrid from "@components/LeafGrid";
import TobaccoGuidePage from "@components/TobaccoGuidePage";
import BlendProfiles from "@components/BlendProfiles";
// import MixingAnimation from "@components/MixingAnimation";
import FloatingPrepButton from "@components/FloatingPrepButton";
import { useLayoutStore } from '@/store/useLayoutStore';

import { leaves } from "@/data/leaves";
import { blends } from "@/data/blends";


const listVideos = [
  { "name": "2T_COLORADO/", "length": 546, "displayName": "Double Leaf Colorado Edition" },
  { "name": "2T_COLORADO_CLARO/", "length": 546, "displayName": "Double Leaf Colorado Claro" },
  { "name": "2T_COLORADO_MADURO/", "length": 546, "displayName": "Double Leaf Colorado Maduro" },
  { "name": "2T_MADURO/", "length": 546, "displayName": "Double Leaf Aged Maduro" },
  { "name": "2T_OSCURO/", "length": 546, "displayName": "Double Leaf Dark Oscuro" },
  { "name": "3T_COLORADO/", "length": 546, "displayName": "Triple Leaf Heritage Colorado" },
  { "name": "3T_COLORADO_CLARO/", "length": 546, "displayName": "Triple Leaf Heritage Claro" },
  { "name": "3T_COLORADO_MADURO/", "length": 546, "displayName": "Triple Leaf Heritage Maduro" },
  { "name": "3T_MADURO/", "length": 546, "displayName": "Triple Leaf Private Maduro" },
  { "name": "3T_OSCURO/", "length": 546, "displayName": "Triple Leaf Private Oscuro" },
  { "name": "4T_COLORADO/", "length": 550, "displayName": "Quad Blend Reserve Colorado" },
  { "name": "4T_COLORADO_CLARO-/", "length": 546, "displayName": "Quad Blend Reserve Claro" },
  { "name": "4T_COLORADO_MADURO/", "length": 550, "displayName": "Quad Blend Reserve Maduro" },
  { "name": "4T_MADURO/", "length": 550, "displayName": "Quad Blend Artisan Maduro" },
  { "name": "4T_OSCURO/", "length": 550, "displayName": "Quad Blend Artisan Oscuro" },
  { "name": "5T_COLORADO/", "length": 550, "displayName": "Master Selection 5T Colorado" },
  { "name": "5T_COLORADO_CLARO-/", "length": 546, "displayName": "Master Selection 5T Claro" },
  { "name": "5T_COLORADO_MADURO/", "length": 550, "displayName": "Master Selection 5T Maduro" },
  { "name": "5T_MADURO/", "length": 546, "displayName": "Grand Cru Maduro 5T" },
  { "name": "T5_OSCURO/", "length": 550, "displayName": "Grand Cru Oscuro T5" },
  { "name": "COLORADO_CLARO_4K_120FPS/", "length": 851, "displayName": "Cinematic Colorado Claro 4K" },
  { "name": "COLORADO CLARO 4K 120FPS/", "length": 1701, "displayName": "Extended Cut Colorado 4K" }
];


const VideoSelectorPanel = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to clean folder names for display
  const formatName = (name) => {
    return name.replace("/", "").replaceAll("_", " ");
  };

  return (
    <div className="craft-you-cigar-video-selector-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="craft-you-cigar-video-selector-panel"
          >
            <div className="craft-you-cigar-video-selector-header">
              <span className="craft-you-cigar-video-selector-title">Available Sequences</span>
              <span className="craft-you-cigar-video-selector-count">
                {listVideos.length} Folders
              </span>
            </div>

            <div className="craft-you-cigar-video-selector-scroll-container">
              {listVideos.map((video, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="craft-you-cigar-video-selector-item-button"
                  onClick={() => {
                    onSelect(video);
                    setIsOpen(false); // Optional: close on selection
                  }}
                >
                  <div className="craft-you-cigar-video-selector-item-name">
                    {formatName(video.name)}
                  </div>
                  <div className="craft-you-cigar-video-selector-item-length">
                    {video.length} frames
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`craft-you-cigar-video-selector-toggle-btn ${
          isOpen ? "is-active" : "is-closed"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕ Close List" : "List Videos"}
      </motion.button>
    </div>
  );
};





function CraftYourCigar() {
  const setVisualExperience = useLayoutStore((state) => state.setVisualExperience);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const handleSelect = (id) => {
    setSelectedLeaves((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setVisualExperience(true);
    return () => {
      setVisualExperience(false);
    };
  }, []);


  return (
    <div className="craft-container pt-1">
      
      {showVideo && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={immersiveOverlay}
            id="video-root" // ID para que GSAP sepa donde está el scroll
          >
            <button 
              onClick={() => { 
                setShowVideo(false);
                setVisualExperience(false); // Muestra Navbar/Footer
              }}
              style={backButtonStyle}
            >
              ✕ Volver a Mezclar
            </button>
            <ScrollVideo videoInfo={videoInfo} selectedLeaves={selectedLeaves} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Contenido principal oculto si el video está activo para evitar doble scroll */}
      {!showVideo && (
        <>
          <header style={{ textAlign: "center", padding: "20px" }}>
            <h1>Tobacco Leaf Selector</h1>
            <p>Select real tobacco leaves to form a blend.</p>
            <button onClick={() => setShowGuide(true)}>Show Tobacco Guide</button>
          </header>

          <BlendProfiles blends={blends} onSelectCombo={setSelectedLeaves} />
          <LeafGrid leaves={leaves} selectedLeaves={selectedLeaves} onSelect={handleSelect} />

          <FloatingPrepButton
            visible={selectedLeaves.length > 0}
            onClick={() => {setVideoInfo(listVideos[1]); setShowVideo(true);} }
          />

          {/* EL NUEVO COMPONENTE FLOTANTE */}
          <VideoSelectorPanel 
            onSelect={(videoSelected)=>{ setVideoInfo(videoSelected); setShowVideo(true);}}
          />

          <AnimatePresence>
            {showGuide && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} style={guideModalStyle}>
                <button onClick={() => setShowGuide(false)} style={backButtonStyle} >Cerrar Guía</button>
                <TobaccoGuidePage />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

    </div>
  );
}



const guideModalStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "90vh",
  background: "#1a1a1a",
  zIndex: 2000,
  borderTop: "2px solid #d4af37",
  overflowY: "auto"
};

const immersiveOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 9999,
  background: '#000',
  overflowY: 'auto', // 🔥 CRÍTICO: Permite el scroll dentro del overlay
  overflowX: 'hidden',
};

const backButtonStyle = {
  position: "fixed", 
  top: "20px",
  left: "20px",
  zIndex: 10000,
  padding: "10px 20px",
  borderRadius: "20px",
  background: "rgba(0,0,0,0.7)",
  color: "#d4af37",
  border: "1px solid #d4af37",
  cursor: "pointer",
  backdropFilter: "blur(5px)"
};

export default CraftYourCigar;