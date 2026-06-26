import "@styles/leaf-grid.css";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { key: 'TRIPA',  label: 'Tripa',  min: 2, max: 5, multi: true  },
  { key: 'CAPOTE', label: 'Capote', min: 1, max: 1, multi: false },
  { key: 'CAPA',   label: 'Capa',   min: 1, max: 1, multi: false },
];

export default function LeafGrid({ leaves = [], onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({ TRIPA: [], CAPOTE: [], CAPA: [] });

  const currentStep = STEPS[stepIndex];
  const currentSel = selections[currentStep.key];

  const stepLeaves = useMemo(
    () => leaves.filter(l => l.category === currentStep.key),
    [leaves, currentStep.key]
  );

  const isStepComplete =
    currentSel.length >= currentStep.min &&
    currentSel.length <= currentStep.max;

  const isLastStep = stepIndex === STEPS.length - 1;

  const handleCardClick = (leafId) => {
    const key = currentStep.key;
    setSelections(prev => {
      const cur = prev[key];
      if (currentStep.multi) {
        if (cur.includes(leafId)) return { ...prev, [key]: cur.filter(id => id !== leafId) };
        if (cur.length >= currentStep.max) return prev;
        return { ...prev, [key]: [...cur, leafId] };
      }
      return { ...prev, [key]: cur.includes(leafId) ? [] : [leafId] };
    });
  };

  const handleNext = () => {
    if (!isStepComplete) return;
    if (isLastStep) {
      onComplete?.(selections);
    } else {
      setStepIndex(i => i + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  };

  const handleStepClick = (i) => {
    if (i < stepIndex) {
      setStepIndex(i); // volver a un paso completado
    } else if (i === stepIndex + 1 && isStepComplete) {
      handleNext(); // avanzar al siguiente si la condición se cumple
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="ls-grid-section">

      {/* Step progress bar */}
      <div className="lg-step-bar">
        {STEPS.map((step, i) => {
          const isDone = i < stepIndex;
          const isActive = i === stepIndex;
          const isNext = i === stepIndex + 1 && isStepComplete;
          const isClickable = isDone || isNext;

          return (
            <React.Fragment key={step.key}>
              <div
                className={`lg-step-node ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isClickable ? 'clickable' : ''}`}
                onClick={() => handleStepClick(i)}
              >
                <div className="lg-step-bubble">
                  {isDone ? '✓' : i + 1}
                </div>
                <span className="lg-step-label">
                  {isNext ? `→ ${step.label}` : step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`lg-step-line ${isDone ? 'done' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Inline nav — sutil, bajo el step bar */}
      <div className="lg-inline-nav">
        {stepIndex > 0 ? (
          <button className="lg-inline-nav-btn" onClick={handleBack}>
            ← Volver a {STEPS[stepIndex - 1].label}
          </button>
        ) : <span />}

        <AnimatePresence>
          {isStepComplete && (
            <motion.button
              className="lg-inline-nav-btn lg-inline-nav-btn--next"
              onClick={handleNext}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {isLastStep ? 'Completar Mezcla →' : `Continuar a ${STEPS[stepIndex + 1]?.label} →`}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Step header */}
      <div className="ls-grid-header">
        <h2 className="ls-grid-title">{currentStep.label}</h2>
        {currentStep.multi ? (
          <span className="ls-grid-subtitle">
            Selecciona de {currentStep.min} a {currentStep.max} hojas
            <span className="lg-counter"> — {currentSel.length} / {currentStep.max}</span>
          </span>
        ) : (
          <span className="ls-grid-subtitle">Selecciona 1 hoja para continuar</span>
        )}
      </div>

      {/* Grid */}
      <motion.div
        key={currentStep.key}
        className="ls-grid-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout
      >
        <AnimatePresence mode="popLayout">
          {stepLeaves.map((leaf) => {
            const isSelected = currentSel.includes(leaf.id);
            const isLocked = !isSelected && currentSel.length >= currentStep.max;
            return (
              <motion.div
                key={leaf.id}
                className={`ls-grid-item ${isSelected ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                variants={itemVariants}
                layout
                whileHover={!isLocked ? { y: -6, transition: { duration: 0.2 } } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                onClick={() => !isLocked && handleCardClick(leaf.id)}
              >
                <div className="ls-card-frame">
                  <div className="ls-card-badge">{leaf.category}</div>

                  <div className="ls-image-wrapper">
                    <img
                      src={leaf.thumbImg || leaf.image}
                      alt={leaf.name}
                      className="ls-card-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="ls-card-content">
                    <div className="ls-card-meta">
                      <h3 className="ls-card-title">{leaf.name}</h3>
                      <span className="ls-card-origin">{leaf.origin}</span>
                    </div>
                    <p className="ls-card-desc">{leaf.description}</p>
                  </div>

                  {leaf.hasInmersive && (
                    <div className="ls-immersive-indicator">
                      <span className="ls-indicator-dot" />
                      <span className="ls-indicator-text">Inmersive Experience Available</span>
                    </div>
                  )}

                  <div className="ls-selection-overlay">
                    <div className="ls-selection-status">
                      <span className="ls-status-icon">✓</span>
                      <span className="ls-status-text">Selected</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>


    </section>
  );
}
