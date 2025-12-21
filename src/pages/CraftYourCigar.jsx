import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollVideo from '@components/ScrollVideo.jsx';
import LeafGrid from "@components/LeafGrid";
import TobaccoGuidePage from "@components/TobaccoGuidePage";
import BlendProfiles from "@components/BlendProfiles";
import MixingAnimation from "@components/MixingAnimation";
import FloatingPrepButton from "@components/FloatingPrepButton";

import { leaves } from "@/data/leaves";
import { blends } from "@/data/blends";

function CraftYourCigar() {
  const [isMixing, setIsMixing] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleSelect = (id) => {
    setSelectedLeaves((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // --- RENDERIZADO ---
  return (
    <div className="craft-container pt-1"> {/* Usa tu clase original aquí */}
      
      {/* 1. MODO VIDEO (Solo si showVideo es true, tapa todo) */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={immersiveOverlay}
          >
            <button 
              onClick={() => { setShowVideo(false); setIsMixing(false); }}
              style={backButtonStyle}
            >
              ✕ Volver a Mezclar
            </button>
            <ScrollVideo selectedLeaves={selectedLeaves} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MODO MIXING (Tapa todo mientras carga el video) */}
      {isMixing && !showVideo && (
        <div style={immersiveOverlay}>
          <MixingAnimation onFinish={() => setShowVideo(true)} />
        </div>
      )}

      {/* 3. TU SELECTOR ORIGINAL (Sin cambios de estilo) */}
      <header style={{ textAlign: "center", padding: "20px" }}>
        <h1>Tobacco Leaf Selector</h1>
        <p>Select real tobacco leaves to form a blend.</p>
        
        <button 
          onClick={() => setShowGuide(true)}
          className="your-original-button-class"
        >
          Show Tobacco Guide
        </button>
      </header>

      <BlendProfiles
        blends={blends}
        onSelectCombo={(combo) => setSelectedLeaves(combo)}
      />

      <LeafGrid
        leaves={leaves}
        selectedLeaves={selectedLeaves}
        onSelect={handleSelect}
      />

      <FloatingPrepButton
        visible={selectedLeaves.length > 0 && !isMixing && !showVideo}
        onClick={() => setIsMixing(true)}
      />

      {/* 4. GUÍA COMO MODAL (Para no descuadrar el catálogo) */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            style={guideModalStyle}
          >
            <button onClick={() => setShowGuide(false)} style={closeGuideBtn}>Cerrar Guía</button>
            <TobaccoGuidePage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- ESTILOS DE INMERSIÓN (No afectan al catálogo) ---
const immersiveOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 9999, // Por encima de TODO
  background: "#000",
};

const backButtonStyle = {
  position: "fixed",
  top: "20px",
  left: "20px",
  zIndex: 10000,
  padding: "10px 20px",
  borderRadius: "20px",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "1px solid #444",
  cursor: "pointer"
};

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

const closeGuideBtn = {
  position: "sticky",
  top: "10px",
  left: "10px",
  margin: "10px",
  zIndex: 2100
};

export default CraftYourCigar;