import "@styles/craft-your-cigar.css";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, Film, X } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { AnimatePresence, motion } from "framer-motion";
import ScrollVideo from '@components/ScrollVideo.jsx';
import LeafGrid from "@components/LeafGrid";
import BlendSummary from "@components/BlendSummary";
import MasterBlends from "@components/MasterBlends";
import TobaccoGuidePage from "@components/TobaccoGuidePage";

import { leaves } from "@/data/leaves";
import { masterBlends } from "@/data/masterBlends";
import { BLEND_STEPS, useBlendStore } from "@/store/useBlendStore";
import { getFrameProfile } from "@/lib/frameProfile";
import { describeFrameProfile, getAnimationCatalog } from "@/lib/frameVariants";
import { listFrameVariants } from "@/lib/frameVariantsApi";
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


const PROFILE_TYPE_LABELS = {
  default: 'Por defecto',
  master: 'Master',
  legacy: 'Legacy',
  generated: 'Generada',
  selected: 'Seleccionada',
  unavailable: 'No disponible',
};

// Lista las animaciones reales del CDN (GET /variants) y el perfil de frames que cargará cada una.
const VideoSelectorPanel = ({ listVideos = [], onSelect, setIsOpen }) => {
  const frameVariants = useAnimationPerfStore(state => state.config.frameVariants);
  const [variants, setVariants] = useState({ items: [], status: 'loading' });
  const formatName = (name) => {
    return name.replace("/", "").replaceAll("_", " ");
  };

  useEffect(() => {
    const controller = new AbortController();
    listFrameVariants(controller.signal)
      .then(items => setVariants({ items, status: 'ready' }))
      .catch(error => { if (error.name !== 'AbortError') setVariants({ items: [], status: 'error' }); });
    return () => controller.abort();
  }, []);

  const videos = variants.status === 'ready' ? getAnimationCatalog(variants.items, listVideos) : listVideos;

  return (
    <>
      <div className="craft-you-cigar-video-selector-header">
        <span className="craft-you-cigar-video-selector-title">Recorridos disponibles</span>
        <span className="craft-you-cigar-video-selector-count">
          {variants.status === 'loading' ? 'Cargando…' : `${videos.length} secuencias`}
        </span>
      </div>

      {variants.status === 'error' && (
        <p className="craft-you-cigar-video-selector-notice" role="status">No se pudo consultar el CDN. Se muestra la lista local.</p>
      )}

      <div className="craft-you-cigar-video-selector-scroll-container" aria-busy={variants.status === 'loading'}>
        {variants.status !== 'loading' && videos.map((video) => {
          const selection = frameVariants[video.name];
          const profile = describeFrameProfile(getFrameProfile(video, selection), variants.items, Boolean(selection));
          return (
            <motion.button
              key={video.name}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="craft-you-cigar-video-selector-item-button"
              onClick={() => {
                onSelect(video);
                if (setIsOpen) setIsOpen(false);
              }}
            >
              <span className="craft-you-cigar-video-selector-item-name">
                {selection && <span className="craft-you-cigar-video-selector-item-dot" aria-label="Variante seleccionada" />}
                {video.displayName || formatName(video.name)}
              </span>
              <span className="craft-you-cigar-video-selector-item-meta">
                <span>{[`${profile.fps} fps`, profile.resolution, `${profile.frames} frames`].filter(Boolean).join(' · ')}</span>
                <span className={`craft-you-cigar-video-selector-item-tag is-${profile.type}`}>{PROFILE_TYPE_LABELS[profile.type]}</span>
              </span>
            </motion.button>
          );
        })}
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





// Recorrido: mesa de composición → Tripa → Capote → Capa → Tu cigarro → elaboración frame a frame.
function CraftYourCigar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showGuide, setShowGuide] = useState(() => searchParams.get('guia') === 'abierta');
  const [showVideo, setShowVideo] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const stepIndex = useBlendStore(state => state.stepIndex);
  const loadBlend = useBlendStore(state => state.loadBlend);
  const isResult = stepIndex === BLEND_STEPS.length;
  useBodyScrollLock(showVideo);

  // /blend-guide redirige aquí con ?guia=abierta; el parámetro se limpia tras abrir la guía.
  useEffect(() => {
    if (searchParams.has('guia')) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const openGuide = () => setShowGuide(true);
  const closeGuide = useCallback(() => setShowGuide(false), []);
  const startCrafting = () => { setVideoInfo(listVideos[1]); setShowVideo(true); };

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
              ✕ Volver a mi cigarro
            </button>
            <ScrollVideo videoInfo={videoInfo} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Contenido principal oculto si el video está activo para evitar doble scroll */}
      {!showVideo && (
        <>
          <header className="craft-intro">
            <div>
              <span className="site-kicker">Mesa de composición</span>
              <h1>{isResult ? 'Tu cigarro.' : 'Compón tu mezcla.'}</h1>
              <p>{isResult ? 'Todas las partes están elegidas. Revisa la composición y continúa a su elaboración.' : 'Elige la tripa, el capote y la capa. Cuando tu cigarro esté completo, podrás ver cómo cobra forma.'}</p>
            </div>
            <button type="button" className="craft-guide-button" onClick={openGuide} aria-haspopup="dialog">
              <BookOpen size={17} aria-hidden="true" /> Guía de la mezcla
            </button>
          </header>

          {!isResult && <MasterBlends blends={masterBlends} onUse={loadBlend} />}

          <div className={`craft-workspace ${isResult ? 'is-result' : ''}`}>
            <LeafGrid leaves={leaves} onStartCrafting={startCrafting} />
            {!isResult && <BlendSummary leaves={leaves} onOpenGuide={openGuide} />}
          </div>

          <MultiButtonFlotanteContainer>
            <ButtonFlotanteItem openName="Ver recorridos" closeName="Cerrar recorridos" Icon={Film}>
              <VideoSelectorPanel 
                listVideos={listVideos}
                onSelect={(videoSelected) => { setVideoInfo(videoSelected); setShowVideo(true); }} 
              />
            </ButtonFlotanteItem>
          </MultiButtonFlotanteContainer>
        </>
      )}

      {showGuide && <TobaccoGuidePage onClose={closeGuide} />}
    </div>
  );
}



export default CraftYourCigar;
