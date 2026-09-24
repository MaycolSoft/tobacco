import "@styles/craft-your-cigar.css";
import React, { useCallback, useState } from "react";
import { BookOpen, Film, X } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { AnimatePresence, motion } from "framer-motion";
import ScrollVideo from '@components/ScrollVideo.jsx';
import LeafGrid from "@components/LeafGrid";
import TobaccoGuidePage from "@components/TobaccoGuidePage";
import BlendProfiles from "@components/BlendProfiles";
import FloatingPrepButton from "@components/FloatingPrepButton";

import { leaves } from "@/data/leaves";
import { blends } from "@/data/blends";
import { getFrameProfile } from "@/lib/frameProfile";
import { useAnimationPerfStore } from "@/store/useAnimationPerfStore";


const listVideos = [
  { "name": "2t_colorado_claro", "length": 1486, "displayName": "Double Leaf Colorado Claro" },
  { "name": "2t_colorado_maduro", "length": 1485, "displayName": "Double Leaf Colorado Maduro" },
  { "name": "2t_colorado", "length": 1485, "displayName": "Double Leaf Colorado Edition" },
  { "name": "2t_maduro", "length": 1485, "displayName": "Double Leaf Aged Maduro" },
  { "name": "2t_oscuro", "length": 1485, "displayName": "Double Leaf Dark Oscuro" },
  { "name": "3t_colorado_claro", "length": 1486, "displayName": "Triple Leaf Heritage Claro" },
  { "name": "3t_colorado_maduro", "length": 1501, "displayName": "Triple Leaf Heritage Maduro" },
  { "name": "3t_colorado", "length": 1485, "displayName": "Triple Leaf Heritage Colorado" },
  { "name": "3t_maduro", "length": 1485, "displayName": "Triple Leaf Private Maduro" },
  { "name": "3t_oscuro", "length": 1485, "displayName": "Triple Leaf Private Oscuro" },
  { "name": "4t_colorado_claro", "length": 1486, "displayName": "Quad Blend Reserve Claro" },
  { "name": "4t_colorado_maduro", "length": 1501, "displayName": "Quad Blend Reserve Maduro" },
  { "name": "4t_colorado", "length": 1485, "displayName": "Quad Blend Reserve Colorado" },
  { "name": "4t_maduro", "length": 1485, "displayName": "Quad Blend Artisan Maduro" },
  { "name": "4t_oscuro", "length": 1485, "displayName": "Quad Blend Artisan Oscuro" },
  { "name": "5t_colorado_claro", "length": 1486, "displayName": "Master Selection 5T Claro" },
  { "name": "5t_colorado_maduro", "length": 1501, "displayName": "Master Selection 5T Maduro" },
  { "name": "5t_colorado", "length": 1485, "displayName": "Master Selection 5T Colorado" },
  { "name": "5t_maduro", "length": 1485, "displayName": "Grand Cru Maduro 5T" },
  { "name": "5t_oscuro", "length": 1485, "displayName": "Grand Cru Oscuro T5" }
];


const VideoSelectorPanel = ({ listVideos = [], onSelect, setIsOpen }) => {
  const sourceMode = useAnimationPerfStore(state => state.config.sourceMode);
  const frameVariants = useAnimationPerfStore(state => state.config.frameVariants);
  const formatName = (name) => {
    return name.replace("/", "").replaceAll("_", " ");
  };

  return (
    <>
      <div className="craft-you-cigar-video-selector-header">
        <span className="craft-you-cigar-video-selector-title">Recorridos disponibles</span>
        <span className="craft-you-cigar-video-selector-count">
          {listVideos.length} secuencias
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
              {getFrameProfile(video, sourceMode, frameVariants[video.name]).frameCount} frames
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );
};

const ButtonFlotanteItem = ({ openName = "Abrir", closeName = "Cerrar", onClick, Icon, children }) => {
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
        aria-haspopup={onClick ? 'dialog' : undefined}
        aria-expanded={onClick ? undefined : isOpen}
        onClick={onClick ? onClick : () => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X size={17} aria-hidden="true" /> : Icon && <Icon size={17} aria-hidden="true" />}
        {isOpen ? closeName : openName}
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
  const closeGuide = useCallback(() => setShowGuide(false), []);
  useBodyScrollLock(showVideo);




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
            <ButtonFlotanteItem openName="Ver recorridos" closeName="Cerrar recorridos" Icon={Film}>
              <VideoSelectorPanel 
                listVideos={listVideos}
                onSelect={(videoSelected) => { setVideoInfo(videoSelected); setShowVideo(true); }} 
              />
            </ButtonFlotanteItem>

            <ButtonFlotanteItem openName="Guía de la mezcla" Icon={BookOpen} onClick={() => setShowGuide(true)}>
            </ButtonFlotanteItem>
          </MultiButtonFlotanteContainer>

          {showGuide && <TobaccoGuidePage onClose={closeGuide} />}
        </>
      )}

    </div>
  );
}



export default CraftYourCigar;
