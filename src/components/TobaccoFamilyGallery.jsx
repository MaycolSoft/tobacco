import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useLocalizedLeaves } from '@/i18n/useLocalizedLeaves';
import { getLeafCategories, getLeafOrigin } from '@/data/leafPresentation';

export default function TobaccoFamilyGallery() {
  const { t } = useTranslation();
  const leaves = useLocalizedLeaves();

  const leafCategories = getLeafCategories(t);
  const [category, setCategory] = useState('TRIPA');
  const filtered = leaves.filter(leaf => leaf.category === category);
  return (
    <div className="tg-gallery">
      <p className="tg-section-copy">{t('guide:tobaccoFamilyGallery.exploreAvailableLeavesByTheirRoleIn')}</p>
      <div className="tg-gallery-tabs" aria-label={t('guide:tobaccoFamilyGallery.filterGuideLeaves')}>
        {['TRIPA', 'CAPOTE', 'CAPA'].map(key => <button key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{leafCategories[key].label}<span>{leaves.filter(leaf => leaf.category === key).length}</span></button>)}
      </div>
      <p className="tg-gallery-count" role="status">{t('guide:gallery.count', { count: filtered.length, category: leafCategories[category].label })}</p>
      <div className="tg-gallery-grid">
        {filtered.map(leaf => <article className="tg-leaf-card" key={leaf.id}>
          <div className="tg-leaf-image"><img src={leaf.thumbImg} alt={leaf.name} loading="lazy" /></div>
          <div className="tg-leaf-copy"><span className="tg-leaf-origin"><MapPin size={11} aria-hidden="true" />{getLeafOrigin(leaf, t)}</span><h3>{leaf.name}</h3><p>{leaf.description}</p></div>
        </article>)}
      </div>
    </div>
  );
}
