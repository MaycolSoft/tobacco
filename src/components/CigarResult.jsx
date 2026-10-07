import { useTranslation } from 'react-i18next';
import { ArrowRight, PencilLine } from "lucide-react";
import { getLeafCategories, getProfileAxes, getBlendProfile } from "@/data/leafPresentation";
import { useBlendStore } from "@/store/useBlendStore";

// Paso 04: resume la composición y prepara la transición a la elaboración frame a frame.
export default function CigarResult({ leaves = [], onStart, onEdit }) {
  const { t } = useTranslation();
  const leafCategories = getLeafCategories(t);
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
        <span className="site-kicker">{t('craft:cigarResult.04YourCigar')}</span>
        <h2 id="craft-step-title">{t('craft:cigarResult.yourCompositionIsReady')}</h2>
        <p>{t('craft:result.count', { count: allLeaves.length })}</p>
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
          <h3>{t('craft:cigarResult.compositionProfile')}</h3>
          {getProfileAxes(t).map(({ key, label }) => (
            <div className="craft-meter" key={key}>
              <span>{label}</span>
              <span className={`craft-dots ${profile ? '' : 'is-pending'}`} role="img" aria-label={profile ? t('craft:cigarResult.outOf5', { value1: label, value2: profile[key] }) : t('craft:cigarResult.pending', { value1: label })}>
                {[1, 2, 3, 4, 5].map(value => <i key={value} className={profile && value <= profile[key] ? 'is-on' : ''} />)}
              </span>
            </div>
          ))}
          {!profile && <p className="craft-result__pending">{t('craft:cigarResult.profileInPreparationItWillBeCompleted')}</p>}
        </div>
      </div>

      <div className="craft-result__actions">
        <button type="button" className="site-button site-button--primary" onClick={onStart}>{t('craft:cigarResult.watchItTakeShape')} <ArrowRight size={17} /></button>
        <button type="button" className="site-button site-button--secondary" onClick={onEdit}><PencilLine size={16} aria-hidden="true" /> {t('craft:cigarResult.editMyBlend')}</button>
      </div>
    </section>
  );
}
