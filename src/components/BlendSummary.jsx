import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Check, Plus, X } from "lucide-react";
import { BLEND_STEPS, isBlendComplete, isStepComplete, useBlendStore } from "@/store/useBlendStore";

// Resumen persistente: qué se eligió, qué falta y cómo continuar sin recordar pasos anteriores.
export default function BlendSummary({ leaves = [], onOpenGuide }) {
  const { t } = useTranslation();
  const { selections, stepIndex, setStep, toggleLeaf, loadedBlend, clearLoadedBlend } = useBlendStore();
  const complete = isBlendComplete(selections);
  const missing = BLEND_STEPS.filter(step => !isStepComplete(step, selections)).map(step => t(step.labelKey));
  const canReach = index => BLEND_STEPS.slice(0, index).every(step => isStepComplete(step, selections));
  const nameOf = id => leaves.find(leaf => leaf.id === id)?.name ?? id;

  return (
    <aside className="craft-summary" aria-labelledby="craft-summary-title">
      <header className="craft-summary__header">
        <span className="site-kicker">{t('craft:blendSummary.compositionInProgress')}</span>
        <h2 id="craft-summary-title">{t('craft:blendSummary.yourBlend')}</h2>
      </header>

      {loadedBlend && (
        <p className="craft-summary__notice" role="status">
          <span>{t('craft:loadedBlend', { name: t(`craft:blends.${loadedBlend.id}.name`, { defaultValue: loadedBlend.name }) })}</span>
          <button type="button" onClick={clearLoadedBlend} aria-label={t('craft:blendSummary.closeNotice')}><X size={14} /></button>
        </p>
      )}

      {BLEND_STEPS.map((step, index) => {
        const ids = selections[step.key];
        const isCurrent = stepIndex === index;
        const action = step.multi ? (ids.length < step.max ? t('craft:blendSummary.addLeaf') : null) : (ids.length ? t('craft:blendSummary.changeLeaf') : t('craft:blendSummary.chooseLeaf'));
        return (
          <section key={step.key} className={`craft-summary__group ${isCurrent ? 'is-current' : ''}`} aria-label={t(step.labelKey)}>
            <div className="craft-summary__head">
              <h3>{t(step.labelKey)}</h3>
              <span aria-label={step.multi ? t('craft:blendSummary.fromToLeaves', { value1: step.min, value2: step.max }) : t('craft:blendSummary.oneLeaf')}>{step.multi ? `${step.min}–${step.max}` : '1'}</span>
            </div>
            {ids.length ? (
              <ul>
                {ids.map(id => (
                  <li key={id}>
                    <Check size={14} aria-hidden="true" /><span>{nameOf(id)}</span>
                    <button type="button" onClick={() => toggleLeaf(step.key, id)} aria-label={t('craft:blendSummary.removeFromYourBlend', { value1: nameOf(id) })}><X size={14} /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="craft-summary__empty">{t('craft:blendSummary.notSelected')}</p>}
            {action && !isCurrent && canReach(index) && (
              <button type="button" className="craft-summary__add" onClick={() => setStep(index)}><Plus size={14} aria-hidden="true" /> {action}</button>
            )}
          </section>
        );
      })}

      <footer className="craft-summary__footer">
        {complete ? (
          <>
            <p>{t('craft:blendSummary.yourCompositionIsComplete')}</p>
            <button type="button" className="site-button site-button--primary" onClick={() => setStep(BLEND_STEPS.length)}>{t('craft:blendSummary.viewYourCigar')} <ArrowRight size={16} /></button>
          </>
        ) : <p>{t('craft:missingParts', { parts: missing.join(', ') })}</p>}
        <button type="button" className="craft-summary__guide" onClick={onOpenGuide}><BookOpen size={15} aria-hidden="true" /> {t('craft:blendSummary.blendingGuide')}</button>
      </footer>
    </aside>
  );
}
