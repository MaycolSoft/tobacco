import "@styles/leaf-grid.css";
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import CigarResult from "@components/CigarResult";
import { leafCategories, getLeafOrigin } from "@/data/leafPresentation";
import { BLEND_STEPS, RESULT_STEP, getStepMessage, isBlendComplete, isStepComplete, useBlendStore } from "@/store/useBlendStore";

const ALL_STEPS = [...BLEND_STEPS, RESULT_STEP];

export default function LeafGrid({ leaves = [], onStartCrafting }) {
  const { selections, stepIndex, setStep, toggleLeaf } = useBlendStore();
  const isResult = stepIndex === BLEND_STEPS.length;
  const currentStep = ALL_STEPS[stepIndex];
  const currentSel = isResult ? [] : selections[currentStep.key];
  const stepComplete = !isResult && isStepComplete(currentStep, selections);
  const blendComplete = isBlendComplete(selections);

  const stepLeaves = useMemo(
    () => leaves.filter(l => l.category === currentStep.key),
    [leaves, currentStep.key]
  );

  // Un paso es accesible cuando todos los anteriores están completos.
  const canReach = index => ALL_STEPS.slice(0, index).every(step => step === RESULT_STEP || isStepComplete(step, selections));
  const nextStep = ALL_STEPS[stepIndex + 1];
  const goTo = index => { if (canReach(index)) setStep(index); };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="ls-grid-section" aria-labelledby="craft-step-title">

      {/* Pasos de la composición */}
      <ol className="lg-step-bar" aria-label="Pasos de la composición">
        {ALL_STEPS.map((step, i) => {
          const isActive = i === stepIndex;
          const isDone = !isActive && step !== RESULT_STEP && isStepComplete(step, selections);
          const isClickable = !isActive && canReach(i);
          return (
            <React.Fragment key={step.key}>
              <li className={`lg-step-node ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}>
                <button type="button" onClick={() => goTo(i)} disabled={!isClickable && !isActive} aria-current={isActive ? 'step' : undefined}>
                  <span className="lg-step-bubble" aria-hidden="true">{isDone && !isActive ? <Check size={15} /> : step.number}</span>
                  <span className="lg-step-label">{step.label}</span>
                </button>
              </li>
              {i < ALL_STEPS.length - 1 && <li className={`lg-step-line ${i < stepIndex ? 'done' : ''}`} aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </ol>

      {isResult ? (
        <CigarResult leaves={leaves} onStart={onStartCrafting} onEdit={() => setStep(0)} />
      ) : (
        <>
          {/* Encabezado del paso con mensaje contextual */}
          <div className="ls-grid-header">
            <span className="site-kicker">{currentStep.number} · {leafCategories[currentStep.key].position}</span>
            <h2 className="ls-grid-title" id="craft-step-title">{currentStep.label}</h2>
            <p className="ls-grid-role">{leafCategories[currentStep.key].description}</p>
            <p className={`ls-grid-subtitle ${stepComplete ? 'is-ready' : ''}`} role="status" aria-live="polite">{getStepMessage(currentStep, currentSel.length)}</p>
          </div>

          <div className="lg-inline-nav">
            {stepIndex > 0 ? (
              <button type="button" className="lg-inline-nav-btn" onClick={() => setStep(stepIndex - 1)}>
                <ArrowLeft size={14} aria-hidden="true" /> Volver a {BLEND_STEPS[stepIndex - 1].label}
              </button>
            ) : <span />}
            <button type="button" className="lg-inline-nav-btn lg-inline-nav-btn--next" onClick={() => goTo(stepIndex + 1)} disabled={!stepComplete || (nextStep === RESULT_STEP && !blendComplete)}>
              {nextStep === RESULT_STEP ? 'Ver tu cigarro' : `Continuar a ${nextStep.label}`} <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

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
                const isLocked = !isSelected && currentStep.multi && currentSel.length >= currentStep.max;
                return (
                  <motion.button
                    type="button"
                    key={leaf.id}
                    className={`ls-grid-item ${isSelected ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                    variants={itemVariants}
                    layout
                    whileHover={!isLocked ? { y: -6, transition: { duration: 0.2 } } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    onClick={() => toggleLeaf(currentStep.key, leaf.id)}
                    aria-pressed={isSelected}
                    disabled={isLocked}
                    aria-label={`${isSelected ? 'Quitar' : 'Añadir'} ${leaf.name} ${isSelected ? 'de' : 'a'} tu mezcla`}
                  >
                    <span className="ls-card-frame">
                      <span className="ls-card-badge">{leafCategories[leaf.category].label}</span>

                      <span className="ls-image-wrapper">
                        <img
                          src={leaf.thumbImg || leaf.image}
                          alt=""
                          className="ls-card-img"
                          loading="lazy"
                        />
                      </span>

                      <span className="lg-card-content">
                        <span className="ls-card-meta">
                          <span className="ls-card-title">{leaf.name}</span>
                          <span className="ls-card-origin">{getLeafOrigin(leaf)}</span>
                        </span>
                        <span className="ls-card-desc">{leaf.description}</span>
                      </span>

                      {leaf.hasInmersive && (
                        <span className="ls-immersive-indicator">
                          <span className="ls-indicator-dot" />
                          <span className="ls-indicator-text">Recorrido inmersivo en la biblioteca</span>
                        </span>
                      )}

                      <span className="ls-selection-overlay" aria-hidden="true">
                        <span className="ls-selection-status">
                          <span className="ls-status-icon"><Check size={22} /></span>
                          <span className="ls-status-text">En tu mezcla</span>
                        </span>
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </section>
  );
}
