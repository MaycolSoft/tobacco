import { ArrowRight, PencilLine } from "lucide-react";
import { leafCategories, PROFILE_AXES, getBlendProfile } from "@/data/leafPresentation";
import { useBlendStore } from "@/store/useBlendStore";

// Paso 04: resume la composición y prepara la transición a la elaboración frame a frame.
export default function CigarResult({ leaves = [], onStart, onEdit }) {
  const selections = useBlendStore(state => state.selections);
  const parts = ['CAPA', 'CAPOTE', 'TRIPA'].map(key => ({
    key,
    leaves: selections[key].map(id => leaves.find(leaf => leaf.id === id)).filter(Boolean),
  }));
  const allLeaves = parts.flatMap(part => part.leaves);
  const profile = getBlendProfile(allLeaves);

  return (
    <section className="craft-result" aria-labelledby="craft-step-title">
      <header className="craft-result__intro">
        <span className="site-kicker">04 · Tu cigarro</span>
        <h2 id="craft-step-title">Tu composición está lista.</h2>
        <p>{allLeaves.length} hojas reunidas de fuera hacia dentro. Revisa lo que aporta cada una antes de ver cómo cobra forma.</p>
      </header>

      <div className="craft-result__grid">
        <dl className="craft-result__parts">
          {parts.map(({ key, leaves: partLeaves }) => (
            <div key={key}>
              <dt>{leafCategories[key].label}<small>{leafCategories[key].role}</small></dt>
              {partLeaves.map(leaf => <dd key={leaf.id}><strong>{leaf.name}</strong><span>{leaf.description}</span></dd>)}
            </div>
          ))}
        </dl>

        <div className="craft-result__profile">
          <h3>Perfil de la composición</h3>
          {PROFILE_AXES.map(({ key, label }) => (
            <div className="craft-meter" key={key}>
              <span>{label}</span>
              <span className={`craft-dots ${profile ? '' : 'is-pending'}`} role="img" aria-label={profile ? `${label}: ${profile[key]} de 5` : `${label}: pendiente`}>
                {[1, 2, 3, 4, 5].map(value => <i key={value} className={profile && value <= profile[key] ? 'is-on' : ''} />)}
              </span>
            </div>
          ))}
          {!profile && <p className="craft-result__pending">Perfil en preparación: se completará cuando cada hoja tenga documentados sus valores de fortaleza, aroma y cuerpo.</p>}
        </div>
      </div>

      <div className="craft-result__actions">
        <button type="button" className="site-button site-button--primary" onClick={onStart}>Ver cómo cobra forma <ArrowRight size={17} /></button>
        <button type="button" className="site-button site-button--secondary" onClick={onEdit}><PencilLine size={16} aria-hidden="true" /> Modificar mi mezcla</button>
      </div>
    </section>
  );
}
