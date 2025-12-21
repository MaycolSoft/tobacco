import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollVideo from '@components/ScrollVideo.jsx';
import LeafGrid from "@components/LeafGrid";
import TobaccoGuidePage from "@components/TobaccoGuidePage";
import BlendProfiles from "@components/BlendProfiles";
import MixingAnimation from "@components/MixingAnimation";
import FloatingPrepButton from "@components/FloatingPrepButton";
import { useLayoutStore } from '@/store/useLayoutStore';

import { leaves } from "@/data/leaves";
import { blends } from "@/data/blends";

function CraftYourCigar() {
  const setVisualExperience = useLayoutStore((state) => state.setVisualExperience);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
      
      <AnimatePresence>
        {showVideo && (
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
            <ScrollVideo selectedLeaves={selectedLeaves} />
          </motion.div>
        )}
      </AnimatePresence>

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
            onClick={() => setShowVideo(true)}
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