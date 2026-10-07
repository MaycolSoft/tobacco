import { renderMessage } from '@/i18n/messages';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight, ArrowUpRight, Sparkles, MapPin, Leaf, Layers, Plus } from 'lucide-react';
import { getLeafCategories, getLeafOrigin, getLeafProfile } from '@/data/leafPresentation';
import { useLocalizedLeaves } from '@/i18n/useLocalizedLeaves';
import '@styles/technical-sheet.css';

export default function TechnicalSheet({ leaf, onExplore, onAddToBlend, addError }) {
  const { t } = useTranslation();
  const leaves = useLocalizedLeaves();

  const leafCategories = getLeafCategories(t);
  const category = leafCategories[leaf.category];
  const [imageState, setImageState] = useState('loading');
  const profile = getLeafProfile(leaf);
  const pairs = (leaf.pairsWith || []).map(id => leaves.find(item => item.id === id)).filter(Boolean);
  // Familia, intensidad y aportes aún no existen en el inventario: se muestran solo cuando estén documentados.
  const pending = [!leaf.family && t('leaves:pending.family'), !profile && t('leaves:pending.intensity'), !leaf.contributes?.length && t('leaves:pending.contributions')].filter(Boolean);
  return (
    <div className="ts-wrapper">
      <figure className="ts-image-side">
        <span className="ts-specimen-label">{t('leaves:technicalSheet.leafCollection')} {category.label}</span>
        <img src={leaf.fullImg} alt={t('leaves:technicalSheet.wholeLeaf', { value1: leaf.name })} className={`ts-main-img ${imageState === 'loaded' ? 'is-loaded' : ''}`} onLoad={() => setImageState('loaded')} onError={() => setImageState('error')} />
        {imageState !== 'loaded' && <span className="ts-image-status" role="status">{imageState === 'error' ? t('leaves:technicalSheet.couldNotLoadThisLeafSImage') : t('leaves:technicalSheet.preparingTheLeaf')}</span>}
        <figcaption>{leaf.name}<span>{getLeafOrigin(leaf, t)}</span></figcaption>
      </figure>
      <div className="ts-info-side">
        <span className="ls-eyebrow">{category.label} · {getLeafOrigin(leaf, t)}</span>
        <h3 className="ts-title">{leaf.name}</h3>
        <p className="ts-description">{leaf.description}</p>
        <dl className="ts-facts">
          <div><dt><Layers size={13} aria-hidden="true" />{t('leaves:technicalSheet.function')}</dt><dd>{category.label}</dd></div>
          <div><dt><MapPin size={13} aria-hidden="true" />{t('leaves:technicalSheet.origin')}</dt><dd>{getLeafOrigin(leaf, t)}</dd></div>
          {leaf.family && <div><dt><Leaf size={13} aria-hidden="true" />{t('leaves:technicalSheet.family')}</dt><dd>{leaf.family}</dd></div>}
          {profile && <div><dt>{t('leaves:technicalSheet.intensity')}</dt><dd className="ts-dots" role="img" aria-label={t('leaves:technicalSheet.outOf5', { value1: profile.fortaleza })}>{[1, 2, 3, 4, 5].map(value => <i key={value} className={value <= profile.fortaleza ? 'is-on' : ''} />)}</dd></div>}
          {leaf.contributes?.length > 0 && <div><dt>{t('leaves:technicalSheet.contributes')}</dt><dd>{leaf.contributes.join(' · ')}</dd></div>}
        </dl>
        {pending.length > 0 && <p className="ts-pending">{t('leaves:pending.list', { fields: pending.join(', ') })}</p>}
        {pairs.length > 0 && <p className="ts-pairs"><span className="ls-eyebrow">{t('leaves:technicalSheet.pairsWellWith')}</span>{pairs.map(item => item.name).join(' · ')}</p>}
        <section className="ts-role">
          <span className="ls-eyebrow">{t('leaves:technicalSheet.theArtOfBlending')}</span>
          <h4>{category.role}</h4>
          <p>{category.detail}</p>
          <div className="ts-layers" aria-label={t('leaves:technicalSheet.positionInTheCigar', { value1: category.label })}>
            {['CAPA', 'CAPOTE', 'TRIPA'].map(key => <span key={key} className={key === leaf.category ? 'active' : ''}><i aria-hidden="true" />{leafCategories[key].label}</span>)}
          </div>
          <Link className="ts-link" to="/about#composicion">{t('leaves:technicalSheet.seeHowItWorksInABlend')} <ArrowRight size={15} /></Link>
        </section>
        {onAddToBlend && (
          <div className="ts-add">
            <button type="button" className="ts-add-button" onClick={onAddToBlend}><Plus size={17} aria-hidden="true" /> {t('leaves:technicalSheet.addToMyBlend')} <ArrowRight size={17} /></button>
            {addError && <p className="ts-add-error" role="alert">{renderMessage(addError, t)}</p>}
          </div>
        )}
        {onExplore && <button className="ts-explore" onClick={onExplore}><Sparkles size={18} /><span>{t('leaves:technicalSheet.exploreTheLeaf')}<small>{t('leaves:technicalSheet.aVisualJourneyInFourChapters')}</small></span><ArrowUpRight size={21} /></button>}
      </div>
    </div>
  );
}
