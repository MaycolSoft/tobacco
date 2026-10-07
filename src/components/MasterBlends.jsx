import { useTranslation } from 'react-i18next';
import { ArrowRight } from "lucide-react";

// Mezclas del maestro: composiciones de referencia que se cargan como base editable.
// No se muestra nada hasta que existan composiciones definidas en src/data/masterBlends.js.
export default function MasterBlends({ blends = [], onUse }) {
  const { t } = useTranslation();
  if (!blends.length) return null;
  return (
    <section className="craft-masters" aria-labelledby="craft-masters-title">
      <div className="craft-masters__heading">
        <div><span className="site-kicker">{t('craft:masterBlends.optionalStartingPoint')}</span><h2 id="craft-masters-title">{t('craft:masterBlends.masterBlends')}</h2></div>
        <p>{t('craft:masterBlends.referenceCompositionsUseOneAsAStarting')}</p>
      </div>
      <ul className="craft-masters__list">
        {blends.map(blend => {
          const count = blend.leaves.TRIPA.length + 2;
          return (
            <li key={blend.id} className="craft-master">
              <span className="site-kicker">{blend.profile}</span>
              <h3>{blend.name}</h3>
              <p>{blend.description}</p>
              <dl>
                <div><dt>{t('craft:masterBlends.intensity')}</dt><dd className="craft-dots" role="img" aria-label={t('craft:masterBlends.outOf5', { value1: blend.intensity })}>{[1, 2, 3, 4, 5].map(value => <i key={value} className={value <= blend.intensity ? 'is-on' : ''} />)}</dd></div>
                <div><dt>{t('craft:masterBlends.leaves')}</dt><dd>{count}</dd></div>
              </dl>
              <button type="button" className="site-text-link" onClick={() => onUse(blend)}>{t('craft:masterBlends.useAsAStartingPoint')} <ArrowRight size={15} /></button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
