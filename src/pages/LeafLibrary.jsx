import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from '@/i18n/navigation';
import { useLocation, useNavigate } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, X, Sparkles, Leaf, Layers, Library, MapPin } from 'lucide-react';
import ImmersiveView from '@components/leaf-library/ImmersiveView';
import TechnicalSheet from '@components/leaf-library/TechnicalSheet';
import { leaves as leafInventory } from '@/data/leaves';
import { useLocalizedLeaves } from '@/i18n/useLocalizedLeaves';
import { getLeafCategories, getLeafOrigin } from '@/data/leafPresentation';
import '@styles/leaf-library.css';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { useAuthStore } from '@store/authStore';
import { useBlendStore } from '@/store/useBlendStore';



export default function LeafLibrary() {
  const { t, i18n } = useTranslation();
  const leaves = useLocalizedLeaves();

  const leafCategories = getLeafCategories(t);
  const origins = [...new Set(leaves.map(leaf => leaf.origin))].sort((a, b) => getLeafOrigin({ origin: a }, t).localeCompare(getLeafOrigin({ origin: b }, t), i18n.resolvedLanguage));
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('categoria');
  const [filter, setFilter] = useState(leafCategories[requestedCategory] ? requestedCategory : 'ALL');
  const [origin, setOrigin] = useState('ALL');
  const user = useAuthStore(state => state.user);
  const addLeaf = useBlendStore(state => state.addLeaf);
  const [addError, setAddError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('detail');
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const detailTabRef = useRef(null);
  const immersiveTabRef = useRef(null);
  const groups = ['CAPA', 'CAPOTE', 'TRIPA']
    .filter(key => filter === 'ALL' || key === filter)
    .map(key => ({ key, ...leafCategories[key], leaves: leaves.filter(leaf => leaf.category === key && (origin === 'ALL' || leaf.origin === origin)) }))
    .filter(group => group.leaves.length);
  const filtered = groups.flatMap(group => group.leaves);
  const selected = leaves.find(leaf => leaf.id === selectedId);
  const selectedIndex = filtered.findIndex(leaf => leaf.id === selectedId);
  const isOpen = Boolean(selected);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (['ALL', 'CAPA', 'CAPOTE', 'TRIPA'].includes(requestedCategory)) setFilter(requestedCategory);
  }, [requestedCategory]);

  useEffect(() => {
    const target = leafInventory.find(leaf => `#${leaf.id}` === hash);
    if (!target) return;
    setFilter('ALL');
    setOrigin('ALL');
    const frame = requestAnimationFrame(() => document.getElementById(target.id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

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
    setAddError('');
    setSelectedId(leaf.id);
  };
  const changeLeaf = (direction) => {
    const next = filtered[selectedIndex + direction];
    if (next) { setAddError(''); setSelectedId(next.id); }
  };
  // Desde la biblioteca se puede sumar una hoja a la mezcla en curso y volver a la mesa.
  const addToBlend = leaf => {
    if (!addLeaf(leaf)) { setAddError({ key: 'pages:leafLibrary.yourFillerAlreadyHas5LeavesRemove' }); return; }
    setSelectedId(null);
    navigate('/craft-your-cigar');
  };
  const changeView = (nextView) => {
    setView(nextView);
    (nextView === 'detail' ? detailTabRef : immersiveTabRef).current?.focus({ preventScroll: true });
  };

  return (
    <section className="ls-container">
      <header className="ls-intro">
        <span className="ls-eyebrow">{t('pages:leafLibrary.rawMaterialLeafCollection')}</span>
        <h1><Trans ns="pages" i18nKey="home.hero" components={{ line: <br />, emphasis: <em /> }} /></h1>
        <p>{t('pages:leafLibrary.originsTexturesAndExpressionsThatBringEach')}</p>
        <span className="ls-collection-count">{t('leaves:varieties', { count: leaves.length })} <span aria-hidden="true">/</span> {t('pages:leafLibrary.3WaysToContributeCharacter')}</span>
      </header>
      <div className="ls-catalog-header">
        <nav className="ls-filters" aria-label={t('pages:leafLibrary.filterLeavesByFunction')}>
          {Object.entries(leafCategories).map(([key, category]) => (
            <button key={key} className={`ls-filter-btn ${filter === key ? 'active' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {key === 'ALL' ? <Library size={15} aria-hidden="true" /> : key === 'CAPA' ? <Leaf size={15} aria-hidden="true" /> : <Layers size={15} aria-hidden="true" />}
              {category.label}<span>{key === 'ALL' ? leaves.length : leaves.filter(leaf => leaf.category === key).length}</span>
            </button>
          ))}
        </nav>
        <label className="ls-origin-filter">
          <span>{t('pages:leafLibrary.origin')}</span>
          <select value={origin} onChange={event => setOrigin(event.target.value)}>
            <option value="ALL">{t('pages:leafLibrary.allOrigins')}</option>
            {origins.map(item => <option key={item} value={item}>{getLeafOrigin({ origin: item }, t)}</option>)}
          </select>
        </label>
      </div>
      <div className="ls-catalog-intro">
        <div className="ls-category-intro" aria-live="polite">
          <h2>{leafCategories[filter].title}</h2>
          <p>{leafCategories[filter].description}</p>
        </div>
      </div>
      {groups.map(group => (
        <section className="ls-collection-group" key={group.key} aria-labelledby={`group-${group.key}`}>
          {filter === 'ALL' && <header className="ls-group-heading">
            <div><span className="ls-eyebrow">{group.position} · {t('leaves:varieties', { count: group.leaves.length })}</span><h2 id={`group-${group.key}`}>{group.label} <span>{group.title}</span></h2></div>
            <p>{group.description}</p>
          </header>}
          {filter !== 'ALL' && <h2 className="sr-only" id={`group-${group.key}`}>{group.label}</h2>}
          <div className="ls-grid">
        {group.leaves.map(leaf => (
          <article key={leaf.id} id={leaf.id} className="ls-card">
            <button className="ls-card-visual" onClick={event => openLeaf(leaf, event)} aria-label={t('pages:leafLibrary.discover', { value1: leaf.name, value2: leafCategories[leaf.category].label })}>
              <img src={leaf.thumbImg} alt={leaf.name} loading="lazy" />
              <span className="ls-badge">{leafCategories[leaf.category].label}</span>
              <span className="ls-image-action" aria-hidden="true"><ArrowRight size={19} /></span>
            </button>
            <div className="ls-card-content">
              <span className="ls-origin"><MapPin size={12} aria-hidden="true" />{getLeafOrigin(leaf, t)}</span>
              <h3>{leaf.name}</h3>
              <p className="ls-desc">{leaf.description}</p>
              <button className="ls-discover" onClick={event => openLeaf(leaf, event)} aria-label={t('pages:leafLibrary.discoverTheLeaf', { value1: leaf.name })}>{t('pages:leafLibrary.discoverLeaf')}<ArrowRight size={16} /><span className="ls-card-number" aria-hidden="true">{String(filtered.indexOf(leaf) + 1).padStart(2, '0')}</span>
              </button>
            </div>
          </article>
        ))}
          </div>
        </section>
      ))}
      {!groups.length && (
        <div className="ls-empty" role="status">
          <p>{t('leaves:emptyOrigin', { category: leafCategories[filter].label, origin: getLeafOrigin({ origin }, t) })}</p>
          <button type="button" className="ls-discover" onClick={() => setOrigin('ALL')}>{t('pages:leafLibrary.viewAllOrigins')} <ArrowRight size={16} /></button>
        </div>
      )}
      <p className="ls-catalog-end">{t('pages:leafLibrary.eachLeafAnExpressionEachBlendA')}</p>
      {selected && createPortal(
        <div ref={overlayRef} className="ls-experience" role="dialog" aria-modal="true" aria-labelledby="ls-experience-title">
          <header className="ls-experience-header">
          <LanguageSwitcher />
            <button ref={closeRef} className="ls-return" onClick={() => setSelectedId(null)} aria-label={t('pages:leafLibrary.closePresentationAndReturnToTheLibrary')}><ArrowLeft size={18} /><span>{t('pages:leafLibrary.library')}</span></button>
            <div className="ls-experience-identity"><span>{leafCategories[selected.category].label}</span><h2 id="ls-experience-title">{selected.name}</h2></div>
            <button className="ls-icon-button" onClick={() => setSelectedId(null)} aria-label={t('pages:leafLibrary.closePresentation')}><X size={21} /></button>
          </header>
          <div className="ls-view-switch" aria-label={t('pages:leafLibrary.presentationMode')}>
            <button ref={detailTabRef} aria-pressed={view === 'detail'} onClick={() => changeView('detail')}>{t('pages:leafLibrary.theLeaf')}</button>
            <button ref={immersiveTabRef} aria-pressed={view === 'immersive'} onClick={() => changeView('immersive')}><Sparkles size={14} /> {t('pages:leafLibrary.immersiveJourney')}</button>
          </div>
          <div className="ls-experience-body" key={`${selected.id}-${view}`}>
            {view === 'immersive' ? <ImmersiveView leaf={selected} onComplete={() => changeView('detail')} /> : <TechnicalSheet leaf={selected} onExplore={() => changeView('immersive')} onAddToBlend={user ? () => addToBlend(selected) : undefined} addError={addError} />}
          </div>
          <footer className="ls-experience-footer">
            <button onClick={() => changeLeaf(-1)} disabled={selectedIndex <= 0}><ArrowLeft size={17} /><span>{t('pages:leafLibrary.previousLeaf')}</span></button>
            <span className="ls-page-count">{String(selectedIndex + 1).padStart(2, '0')} <span>/ {String(filtered.length).padStart(2, '0')}</span></span>
            <button onClick={() => changeLeaf(1)} disabled={selectedIndex >= filtered.length - 1}><span>{t('pages:leafLibrary.nextLeaf')}</span><ArrowRight size={17} /></button>
          </footer>
        </div>, document.body,
      )}
    </section>
  );
}
