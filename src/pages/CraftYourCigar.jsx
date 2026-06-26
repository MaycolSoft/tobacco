import "@styles/CraftYourCigar.css";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollVideo from '@components/ScrollVideo.jsx';
import LeafGrid from "@components/LeafGrid";
import TobaccoGuidePage from "@components/TobaccoGuidePage";
import BlendProfiles from "@components/BlendProfiles";
import FloatingPrepButton from "@components/FloatingPrepButton";

import { leaves } from "@/data/leaves";
import { blends } from "@/data/blends";


const listVideos = [
  { "name": "2t_colorado_claro", "length": 748, "displayName": "Double Leaf Colorado Claro" },
  { "name": "2t_colorado_maduro", "length": 1502, "displayName": "Double Leaf Colorado Maduro" },
  { "name": "2t_colorado", "length": 1502, "displayName": "Double Leaf Colorado Edition" },
  { "name": "2t_maduro", "length": 1502, "displayName": "Double Leaf Aged Maduro" },
  { "name": "2t_oscuro", "length": 1502, "displayName": "Double Leaf Dark Oscuro" },
  { "name": "3t_colorado_claro", "length": 1502, "displayName": "Triple Leaf Heritage Claro" },
  { "name": "3t_colorado_maduro", "length": 1502, "displayName": "Triple Leaf Heritage Maduro" },
  { "name": "3t_colorado", "length": 1502, "displayName": "Triple Leaf Heritage Colorado" },
  { "name": "3t_maduro", "length": 1502, "displayName": "Triple Leaf Private Maduro" },
  { "name": "3t_oscuro", "length": 1502, "displayName": "Triple Leaf Private Oscuro" },
  { "name": "4t_colorado_claro", "length": 1502, "displayName": "Quad Blend Reserve Claro" },
  { "name": "4t_colorado_maduro", "length": 1502, "displayName": "Quad Blend Reserve Maduro" },
  { "name": "4t_colorado", "length": 1502, "displayName": "Quad Blend Reserve Colorado" },
  { "name": "4t_maduro", "length": 1502, "displayName": "Quad Blend Artisan Maduro" },
  { "name": "4t_oscuro", "length": 1502, "displayName": "Quad Blend Artisan Oscuro" },
  { "name": "5t_colorado_claro", "length": 1502, "displayName": "Master Selection 5T Claro" },
  { "name": "5t_colorado_maduro", "length": 1502, "displayName": "Master Selection 5T Maduro" },
  { "name": "5t_colorado", "length": 1502, "displayName": "Master Selection 5T Colorado" },
  { "name": "5t_maduro", "length": 1502, "displayName": "Grand Cru Maduro 5T" },
  { "name": "5t_oscuro", "length": 1502, "displayName": "Grand Cru Oscuro T5" }
];


const VideoSelectorPanel = ({ listVideos = [], onSelect, setIsOpen }) => {
  const formatName = (name) => {
    return name.replace("/", "").replaceAll("_", " ");
  };

  return (
    <>
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
              if (setIsOpen) setIsOpen(false);
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
    </>
  );
};

const ButtonFlotanteItem = ({ openName = "Open", closeName = "Close", onClick, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="craft-you-cigar-video-selector-group">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="craft-you-cigar-video-selector-panel"
          >
            {/* Pasa la función setIsOpen al hijo de forma segura si es un componente de React */}
            {React.isValidElement(children)
              ? React.cloneElement(children, { setIsOpen })
              : children}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`btn btn-pill ${isOpen ? "btn-primary" : "btn-secondary"}`}
        onClick={onClick ? onClick : () => setIsOpen((prev) => !prev)}
      >
        {isOpen ? `✕ ${closeName}` : `${openName}`}
      </motion.button>
    </div>
  );
};

const MultiButtonFlotanteContainer = ({ children }) => {
  return (
    <div className="craft-you-cigar-video-selector-container">
      {children}
    </div>
  );
};





function CraftYourCigar() {
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);




  return (
    <div className="craft-container">

      {showVideo && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="craft-immersive-overlay"
            id="video-root"
          >
            <button
              onClick={() => {
                setShowVideo(false);
              }}
              className="craft-back-btn btn btn-secondary btn-pill"
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

          <BlendProfiles blends={blends} onSelectCombo={setSelectedLeaves} />
          <LeafGrid
            leaves={leaves}
            onComplete={(sel) => setSelectedLeaves([...sel.TRIPA, ...sel.CAPOTE, ...sel.CAPA])}
          />

          <FloatingPrepButton
            visible={selectedLeaves.length > 0}
            onClick={() => {setVideoInfo(listVideos[1]); setShowVideo(true);} }
          />

          

          <MultiButtonFlotanteContainer>
            <ButtonFlotanteItem openName="Open Video Selector" closeName="Close Video Selector">
              <VideoSelectorPanel 
                listVideos={listVideos}
                onSelect={(videoSelected) => { setVideoInfo(videoSelected); setShowVideo(true); }} 
              />
            </ButtonFlotanteItem>

            <ButtonFlotanteItem openName="Open Guide" closeName="Close Guide" onClick={() => setShowGuide(true)}>
            </ButtonFlotanteItem>
          </MultiButtonFlotanteContainer>

          <AnimatePresence>
            {showGuide && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="craft-guide-modal">
                <button onClick={() => setShowGuide(false)} className="craft-back-btn btn btn-secondary btn-pill">Cerrar Guía</button>
                <TobaccoGuidePage />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

    </div>
  );
}



export default CraftYourCigar;