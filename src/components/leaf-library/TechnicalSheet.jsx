import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, MapPin, Leaf, Layers, Plus } from 'lucide-react';
import { leafCategories, getLeafOrigin, getLeafProfile } from '@/data/leafPresentation';
import { leaves } from '@/data/leaves';
import '@styles/technical-sheet.css';

export default function TechnicalSheet({ leaf, onExplore, onAddToBlend, addError }) {
  const category = leafCategories[leaf.category];
  const [imageState, setImageState] = useState('loading');
  const profile = getLeafProfile(leaf);
  const pairs = (leaf.pairsWith || []).map(id => leaves.find(item => item.id === id)).filter(Boolean);
  // Familia, intensidad y aportes aún no existen en el inventario: se muestran solo cuando estén documentados.
  const pending = [!leaf.family && 'familia', !profile && 'intensidad', !leaf.contributes?.length && 'aportes'].filter(Boolean);
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
          <div><dt><Layers size={13} aria-hidden="true" />Función</dt><dd>{category.label}</dd></div>
          <div><dt><MapPin size={13} aria-hidden="true" />Origen</dt><dd>{getLeafOrigin(leaf)}</dd></div>
          {leaf.family && <div><dt><Leaf size={13} aria-hidden="true" />Familia</dt><dd>{leaf.family}</dd></div>}
          {profile && <div><dt>Intensidad</dt><dd className="ts-dots" role="img" aria-label={`${profile.fortaleza} de 5`}>{[1, 2, 3, 4, 5].map(value => <i key={value} className={value <= profile.fortaleza ? 'is-on' : ''} />)}</dd></div>}
          {leaf.contributes?.length > 0 && <div><dt>Aporta</dt><dd>{leaf.contributes.join(' · ')}</dd></div>}
        </dl>
        {pending.length > 0 && <p className="ts-pending">Datos en documentación: {pending.join(', ')}.</p>}
        {pairs.length > 0 && <p className="ts-pairs"><span className="ls-eyebrow">Combina bien con</span>{pairs.map(item => item.name).join(' · ')}</p>}
        <section className="ts-role">
          <span className="ls-eyebrow">El arte de combinar</span>
          <h4>{category.role}</h4>
          <p>{category.detail}</p>
          <div className="ts-layers" aria-label={`Posición en el cigarro: ${category.label}`}>
            {['CAPA', 'CAPOTE', 'TRIPA'].map(key => <span key={key} className={key === leaf.category ? 'active' : ''}><i aria-hidden="true" />{leafCategories[key].label}</span>)}
          </div>
          <Link className="ts-link" to="/about#composicion">Ver cómo funciona en una mezcla <ArrowRight size={15} /></Link>
        </section>
        {onAddToBlend && (
          <div className="ts-add">
            <button type="button" className="ts-add-button" onClick={onAddToBlend}><Plus size={17} aria-hidden="true" /> Añadir a mi mezcla <ArrowRight size={17} /></button>
            {addError && <p className="ts-add-error" role="alert">{addError}</p>}
          </div>
        )}
        {onExplore && <button className="ts-explore" onClick={onExplore}><Sparkles size={18} /><span>Explorar la hoja<small>Un recorrido visual en cuatro capítulos</small></span><ArrowUpRight size={21} /></button>}
      </div>
    </div>
  );
}
