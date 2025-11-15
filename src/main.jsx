
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createRoot } from 'react-dom/client'
import CentralLogViewer from '@components/CentralLogViewer.jsx'
import ScrollVideo from '@components/ScrollVideo.jsx'
import ErrorBoundary from "@components/ErrorBoundary";
import LeafGrid from "@components/LeafGrid";
import BlendResult from "@components/BlendResult";
import TobaccoGuidePage from "@components/TobaccoGuidePage";

import { leaves } from "@/data/leaves";
import { blends } from "@/data/blends";

function App() {
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showVide, setShowVideo] = useState(false);

  const handleSelect = (id) => {
    setSelectedLeaves((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const findBlend = () => {
    const sorted = [...selectedLeaves].sort((a, b) => a - b);
    return blends.find(
      (b) => JSON.stringify(sorted) === JSON.stringify(b.combination)
    );
  };

  const blend = findBlend();

  return (
    <div>
      <header style={{ textAlign: "center", padding: "20px" }}>
        <h1>Tobacco Leaf Selector</h1>
        <p>Select real tobacco leaves to form a blend. Then open the guide to learn more.</p>

        <button
          onClick={() => setShowGuide((prev) => !prev)}
          style={{
            marginTop: "10px",
            padding: "8px 18px",
            borderRadius: "999px",
            border: "1px solid #444",
            background: showGuide ? "#7a2c2c" : "#1a1a1a",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {showGuide ? "Hide Tobacco Guide" : "Show Tobacco Guide"}
        </button>

        <button
          onClick={() => setShowVideo((prev) => !prev)}
          style={{
            marginTop: "10px",
            padding: "8px 18px",
            borderRadius: "999px",
            border: "1px solid #444",
            background: showGuide ? "#7a2c2c" : "#1a1a1a",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {showVide ? "Hide Scroll Video" : "Show Scroll Video"}
        </button>
      </header>

      {showVide && <ScrollVideo />}

      {/* Selector principal */}
      <LeafGrid
        leaves={leaves}
        selectedLeaves={selectedLeaves}
        onSelect={handleSelect}
      />
      <BlendResult blend={blend} />

      {/* Guía, con animación */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TobaccoGuidePage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




createRoot(document.getElementById('root')).render(
  <>
    <ErrorBoundary
      onError={(error, info) => {
        // Aquí podrías enviar el error a Sentry/LogRocket/etc.
        console.error("ErrorBoundary atrapó:", error, info);
      }}
      onReset={() => {
        // Limpia estado global, cache, etc, si quieres
        window.location.reload();
      }}
    >
      <App />
      <CentralLogViewer /> 
    </ErrorBoundary>
  </>
)
