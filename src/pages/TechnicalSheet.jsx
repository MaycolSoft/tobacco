import { useState } from 'react';
import { ArrowUpRight, Sparkles, MapPin, Leaf, Layers } from 'lucide-react';
import { leafCategories, getLeafOrigin } from '@/data/leafPresentation';
import '@styles/TechnicalSheet.css';

export default function TechnicalSheet({ leaf, onExplore }) {
  const category = leafCategories[leaf.category];
  const [imageState, setImageState] = useState('loading');
  return (
    <div className="ts-wrapper">
      <figure className="ts-image-side">
        <span className="ts-specimen-label">Colección de hojas / {category.label}</span>
        <img src={leaf.fullImg} alt={`Hoja completa de ${leaf.name}`} className={`ts-main-img ${imageState === 'loaded' ? 'is-loaded' : ''}`} onLoad={() => setImageState('loaded')} onError={() => setImageState('error')} />
        {imageState !== 'loaded' && <span className="ts-image-status" role="status">{imageState === 'error' ? 'No se pudo cargar la imagen de esta hoja.' : 'Preparando la hoja…'}</span>}
        <figcaption>{leaf.name}<span>{getLeafOrigin(leaf)}</span></figcaption>
      </figure>
      <div className="ts-info-side">
        <span className="ls-eyebrow">{category.label} · {getLeafOrigin(leaf)}</span>
        <h3 className="ts-title">{leaf.name}</h3>
        <p className="ts-description">{leaf.description}</p>
        <dl className="ts-facts">
          <div><dt><MapPin size={13} aria-hidden="true" />Origen</dt><dd>{getLeafOrigin(leaf)}</dd></div>
          <div><dt><Leaf size={13} aria-hidden="true" />Familia</dt><dd>{category.label}</dd></div>
          <div><dt><Layers size={13} aria-hidden="true" />En el cigarro</dt><dd>{category.position}</dd></div>
        </dl>
        <section className="ts-role">
          <span className="ls-eyebrow">El arte de combinar</span>
          <h4>{category.role}</h4>
          <p>{category.detail}</p>
          <div className="ts-layers" aria-label={`Posición en el cigarro: ${category.label}`}>
            {['CAPA', 'CAPOTE', 'TRIPA'].map(key => <span key={key} className={key === leaf.category ? 'active' : ''}><i aria-hidden="true" />{leafCategories[key].label}</span>)}
          </div>
        </section>
        {onExplore && <button className="ts-explore" onClick={onExplore}><Sparkles size={18} /><span>Explorar la hoja<small>Un recorrido visual en cuatro capítulos</small></span><ArrowUpRight size={21} /></button>}
      </div>
    </div>
  );
}
