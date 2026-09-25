import { ArrowRight, BookOpen, Check, Plus, X } from "lucide-react";
import { BLEND_STEPS, isBlendComplete, isStepComplete, useBlendStore } from "@/store/useBlendStore";

// Resumen persistente: qué se eligió, qué falta y cómo continuar sin recordar pasos anteriores.
export default function BlendSummary({ leaves = [], onOpenGuide }) {
  const { selections, stepIndex, setStep, toggleLeaf, loadedBlend, clearLoadedBlend } = useBlendStore();
  const complete = isBlendComplete(selections);
  const missing = BLEND_STEPS.filter(step => !isStepComplete(step, selections)).map(step => step.label.toLowerCase());
  const canReach = index => BLEND_STEPS.slice(0, index).every(step => isStepComplete(step, selections));
  const nameOf = id => leaves.find(leaf => leaf.id === id)?.name ?? id;

  return (
    <aside className="craft-summary" aria-labelledby="craft-summary-title">
      <header className="craft-summary__header">
        <span className="site-kicker">Composición en curso</span>
        <h2 id="craft-summary-title">Tu mezcla</h2>
      </header>

      {loadedBlend && (
        <p className="craft-summary__notice" role="status">
          <span>Se ha cargado “{loadedBlend}”. Puedes modificar cualquier hoja de la composición.</span>
          <button type="button" onClick={clearLoadedBlend} aria-label="Cerrar aviso"><X size={14} /></button>
        </p>
      )}

      {BLEND_STEPS.map((step, index) => {
        const ids = selections[step.key];
        const isCurrent = stepIndex === index;
        const action = step.multi ? (ids.length < step.max ? 'Añadir hoja' : null) : (ids.length ? 'Cambiar hoja' : 'Elegir hoja');
        return (
          <section key={step.key} className={`craft-summary__group ${isCurrent ? 'is-current' : ''}`} aria-label={step.label}>
            <div className="craft-summary__head">
              <h3>{step.label}</h3>
              <span aria-label={step.multi ? `De ${step.min} a ${step.max} hojas` : 'Una hoja'}>{step.multi ? `${step.min}–${step.max}` : '1'}</span>
            </div>
            {ids.length ? (
              <ul>
                {ids.map(id => (
                  <li key={id}>
                    <Check size={14} aria-hidden="true" /><span>{nameOf(id)}</span>
                    <button type="button" onClick={() => toggleLeaf(step.key, id)} aria-label={`Quitar ${nameOf(id)} de tu mezcla`}><X size={14} /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="craft-summary__empty">Sin seleccionar</p>}
            {action && !isCurrent && canReach(index) && (
              <button type="button" className="craft-summary__add" onClick={() => setStep(index)}><Plus size={14} aria-hidden="true" /> {action}</button>
            )}
          </section>
        );
      })}

      <footer className="craft-summary__footer">
        {complete ? (
          <>
            <p>Tu composición está completa.</p>
            <button type="button" className="site-button site-button--primary" onClick={() => setStep(BLEND_STEPS.length)}>Ver tu cigarro <ArrowRight size={16} /></button>
          </>
        ) : <p>Falta completar: {missing.join(', ')}.</p>}
        <button type="button" className="craft-summary__guide" onClick={onOpenGuide}><BookOpen size={15} aria-hidden="true" /> Guía de la mezcla</button>
      </footer>
    </aside>
  );
}
