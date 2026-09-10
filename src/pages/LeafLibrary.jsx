import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X, Sparkles, Leaf, Layers, Library, MapPin } from 'lucide-react';
import InmersiveView from '@pages/InmersiveView';
import TechnicalSheet from '@pages/TechnicalSheet';
import { leaves } from '@/data/leaves';
import { leafCategories, getLeafOrigin } from '@/data/leafPresentation';
import '@styles/LeafLibrary.css';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

export default function LeafLibrary() {
  const [filter, setFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('detail');
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const detailTabRef = useRef(null);
  const immersiveTabRef = useRef(null);
  const filtered = leaves.filter(leaf => filter === 'ALL' || leaf.category === filter);
  const selected = leaves.find(leaf => leaf.id === selectedId);
  const selectedIndex = filtered.findIndex(leaf => leaf.id === selectedId);
  const isOpen = Boolean(selected);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const background = [...document.body.children].filter(element => element !== overlayRef.current && element instanceof HTMLElement);
    const previousInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedId(null);
      if (event.key !== 'Tab') return;
      const elements = [...overlayRef.current.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter(element => element.getClientRects().length);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    const trigger = triggerRef.current;
    return () => {
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const openLeaf = (leaf, event) => {
    triggerRef.current = event.currentTarget;
    setView('detail');
    setSelectedId(leaf.id);
  };
  const changeLeaf = (direction) => {
    const next = filtered[selectedIndex + direction];
    if (next) setSelectedId(next.id);
  };
  const changeView = (nextView) => {
    setView(nextView);
    (nextView === 'detail' ? detailTabRef : immersiveTabRef).current?.focus({ preventScroll: true });
  };

  return (
    <section className="ls-container">
      <header className="ls-intro">
        <span className="ls-eyebrow">Materia prima · Colección de hojas</span>
        <h1>El carácter comienza<br />en <em>la hoja.</em></h1>
        <p>Orígenes, texturas y expresiones que dan vida a cada cigarro. Descubre nuestra biblioteca, hoja por hoja.</p>
        <span className="ls-collection-count">{leaves.length} variedades <span aria-hidden="true">/</span> 3 formas de aportar carácter</span>
      </header>
      <div className="ls-catalog-header">
        <nav className="ls-filters" aria-label="Filtrar hojas por función">
          {Object.entries(leafCategories).map(([key, category]) => (
            <button key={key} className={`ls-filter-btn ${filter === key ? 'active' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {key === 'ALL' ? <Library size={15} aria-hidden="true" /> : key === 'CAPA' ? <Leaf size={15} aria-hidden="true" /> : <Layers size={15} aria-hidden="true" />}
              {category.label}<span>{key === 'ALL' ? leaves.length : leaves.filter(leaf => leaf.category === key).length}</span>
            </button>
          ))}
        </nav>
        <div className="ls-category-intro" aria-live="polite">
          <h2>{leafCategories[filter].title}</h2>
          <p>{leafCategories[filter].description}</p>
        </div>
      </div>
      <div className="ls-grid">
        {filtered.map((leaf, index) => (
          <article key={leaf.id} id={leaf.id} className="ls-card">
            <button className="ls-card-visual" onClick={event => openLeaf(leaf, event)} aria-label={`Descubrir ${leaf.name}, ${leafCategories[leaf.category].label}`}>
              <img src={leaf.thumbImg} alt={leaf.name} loading="lazy" />
              <span className="ls-badge">{leafCategories[leaf.category].label}</span>
              <span className="ls-image-action" aria-hidden="true"><ArrowRight size={19} /></span>
            </button>
            <div className="ls-card-content">
              <span className="ls-origin"><MapPin size={12} aria-hidden="true" />{getLeafOrigin(leaf)}</span>
              <h3>{leaf.name}</h3>
              <p className="ls-desc">{leaf.description}</p>
              <button className="ls-discover" onClick={event => openLeaf(leaf, event)} aria-label={`Descubrir la hoja ${leaf.name}`}>
                Descubrir hoja <ArrowRight size={16} /><span className="ls-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="ls-catalog-end">Cada hoja, una expresión. Cada mezcla, una historia.</p>
      {selected && createPortal(
        <div ref={overlayRef} className="ls-experience" role="dialog" aria-modal="true" aria-labelledby="ls-experience-title">
          <header className="ls-experience-header">
            <button ref={closeRef} className="ls-return" onClick={() => setSelectedId(null)} aria-label="Cerrar presentación y volver a la biblioteca"><ArrowLeft size={18} /><span>Biblioteca</span></button>
            <div className="ls-experience-identity"><span>{leafCategories[selected.category].label}</span><h2 id="ls-experience-title">{selected.name}</h2></div>
            <button className="ls-icon-button" onClick={() => setSelectedId(null)} aria-label="Cerrar presentación"><X size={21} /></button>
          </header>
          <div className="ls-view-switch" aria-label="Modo de presentación">
            <button ref={detailTabRef} aria-pressed={view === 'detail'} onClick={() => changeView('detail')}>La hoja</button>
            <button ref={immersiveTabRef} aria-pressed={view === 'immersive'} onClick={() => changeView('immersive')}><Sparkles size={14} /> Recorrido inmersivo</button>
          </div>
          <div className="ls-experience-body" key={`${selected.id}-${view}`}>
            {view === 'immersive' ? <InmersiveView leaf={selected} onComplete={() => changeView('detail')} /> : <TechnicalSheet leaf={selected} onExplore={() => changeView('immersive')} />}
          </div>
          <footer className="ls-experience-footer">
            <button onClick={() => changeLeaf(-1)} disabled={selectedIndex <= 0}><ArrowLeft size={17} /><span>Hoja anterior</span></button>
            <span className="ls-page-count">{String(selectedIndex + 1).padStart(2, '0')} <span>/ {String(filtered.length).padStart(2, '0')}</span></span>
            <button onClick={() => changeLeaf(1)} disabled={selectedIndex >= filtered.length - 1}><span>Siguiente hoja</span><ArrowRight size={17} /></button>
          </footer>
        </div>, document.body,
      )}
    </section>
  );
}
