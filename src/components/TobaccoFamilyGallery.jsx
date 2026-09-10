import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { leaves } from '@/data/leaves';
import { leafCategories, getLeafOrigin } from '@/data/leafPresentation';

export default function TobaccoFamilyGallery() {
  const [category, setCategory] = useState('TRIPA');
  const filtered = leaves.filter(leaf => leaf.category === category);
  return (
    <div className="tg-gallery">
      <p className="tg-section-copy">Explora las hojas disponibles según el lugar que ocupan en tu mezcla.</p>
      <div className="tg-gallery-tabs" aria-label="Filtrar hojas de la guía">
        {['TRIPA', 'CAPOTE', 'CAPA'].map(key => <button key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{leafCategories[key].label}<span>{leaves.filter(leaf => leaf.category === key).length}</span></button>)}
      </div>
      <p className="tg-gallery-count" role="status">{filtered.length} hojas de {leafCategories[category].label.toLowerCase()} en la colección</p>
      <div className="tg-gallery-grid">
        {filtered.map(leaf => <article className="tg-leaf-card" key={leaf.id}>
          <div className="tg-leaf-image"><img src={leaf.thumbImg} alt={leaf.name} loading="lazy" /></div>
          <div className="tg-leaf-copy"><span className="tg-leaf-origin"><MapPin size={11} aria-hidden="true" />{getLeafOrigin(leaf)}</span><h3>{leaf.name}</h3><p>{leaf.description}</p></div>
        </article>)}
      </div>
    </div>
  );
}
