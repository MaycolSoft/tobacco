import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Layers, Leaf, X } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { getLeafCategories } from '@/data/leafPresentation';
import TobaccoFamiliesInfo from './TobaccoFamiliesInfo';
import TobaccoFamilyGallery from './TobaccoFamilyGallery';
import '@styles/tobacco-guide-page.css';


export default function TobaccoGuidePage({ onClose }) {
  const { t } = useTranslation();
  const leafCategories = getLeafCategories(t);
const sections = [
  { id: 'guide-composition', label: t('guide:tobaccoGuidePage.howItIsComposed'), Icon: Layers },
  { id: 'guide-families', label: t('guide:tobaccoGuidePage.howTheyExpressThemselves'), Icon: BookOpen },
  { id: 'guide-collection', label: t('guide:tobaccoGuidePage.exploreTheLeaves'), Icon: Leaf },
];
const recipe = {
  TRIPA: { number: '01', amount: t('guide:tobaccoGuidePage.from2To5Leaves'), copy: t('guide:tobaccoGuidePage.beginWithTheInteriorInTheConfigurator') },
  CAPOTE: { number: '02', amount: t('guide:tobaccoGuidePage.oneLeaf'), copy: t('guide:tobaccoGuidePage.continueWithTheBinderOneLeafThat') },
  CAPA: { number: '03', amount: t('guide:tobaccoGuidePage.oneLeaf'), copy: t('guide:tobaccoGuidePage.finishWithTheWrapperThisOuterLeaf') },
};

  const [part, setPart] = useState('TRIPA');
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  useBodyScrollLock(true);

  useEffect(() => {
    const trigger = document.activeElement;
    const siblings = [...document.body.children].filter(element => element !== dialogRef.current && element instanceof HTMLElement);
    const inertStates = siblings.map(element => element.inert);
    siblings.forEach(element => { element.inert = true; });
    closeRef.current?.focus({ preventScroll: true });
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose?.(); }
      if (event.key !== 'Tab') return;
      const elements = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter(element => element.getClientRects().length);
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      siblings.forEach((element, index) => { element.inert = inertStates[index]; });
      document.removeEventListener('keydown', onKey);
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [onClose]);

  const jumpTo = (event, id) => {
    event.preventDefault();
    const viewport = scrollRef.current;
    const target = viewport.querySelector('#' + id);
    if (!target) return;
    const top = viewport.scrollTop + target.getBoundingClientRect().top - viewport.getBoundingClientRect().top - 24;
    viewport.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    setActiveSection(id);
  };
  const updateSection = () => {
    const viewport = scrollRef.current;
    const top = viewport.getBoundingClientRect().top + 140;
    const current = sections.filter(section => viewport.querySelector('#' + section.id).getBoundingClientRect().top <= top).at(-1);
    setActiveSection(current?.id || sections[0].id);
  };
  const category = leafCategories[part];

  return createPortal(
    <div className="tg-experience" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tg-title">
      <header className="tg-header">
          <LanguageSwitcher />
        <button ref={closeRef} className="tg-return" onClick={onClose}><ArrowLeft size={18} /><span>{t('guide:tobaccoGuidePage.backToMyBlend')}</span></button>
        <span className="tg-brand">{t('guide:tobaccoGuidePage.blendingGuide')} <span>{t('guide:tobaccoGuidePage.blendingTable')}</span></span>
        <button className="tg-icon-button" aria-label={t('guide:tobaccoGuidePage.closeGuide')} onClick={onClose}><X size={21} /></button>
      </header>
      <nav className="tg-nav" aria-label={t('guide:tobaccoGuidePage.guideSections')}>
        {sections.map(({ id, label, Icon }, index) => <a href={'#' + id} key={id} onClick={event => jumpTo(event, id)} aria-current={activeSection === id ? 'location' : undefined}><Icon size={15} aria-hidden="true" /><span>{label}</span><small>0{index + 1}</small></a>)}
      </nav>
      <div className="tg-scroll" ref={scrollRef} onScroll={updateSection} tabIndex={0} role="region" aria-label={t('guide:tobaccoGuidePage.guideContent')}>
        <div className="tg-content">
          <header className="tg-intro">
            <span className="tg-eyebrow">{t('guide:tobaccoGuidePage.fromLeafToCigar')}</span>
            <h1 id="tg-title"><Trans ns="guide" i18nKey="composition.title" components={{ emphasis: <em /> }} /></h1>
            <p>{t('guide:tobaccoGuidePage.discoverWhatEachLeafContributesExploreDifferent')}</p>
          </header>
          <section id="guide-composition" className="tg-section" aria-labelledby="tg-composition-title">
            <div className="tg-section-heading"><span className="tg-section-number">01</span><div><span className="tg-eyebrow">{t('guide:tobaccoGuidePage.howItIsComposed')}</span><h2 id="tg-composition-title">{t('guide:tobaccoGuidePage.fromTheInsideOut')}</h2></div></div>
            <div className="tg-composition">
              <div className="tg-anatomy">
                <span className="tg-eyebrow">{t('guide:tobaccoGuidePage.crossSectionIllustrativeDiagram')}</span>
                <div className="tg-cross-section">
                  {['CAPA', 'CAPOTE', 'TRIPA'].map(key => <button key={key} className={`tg-ring tg-ring-${key.toLowerCase()} ${part === key ? 'is-active' : ''}`} aria-pressed={part === key} aria-label={t('guide:tobaccoGuidePage.explore', { value1: leafCategories[key].label })} onClick={() => setPart(key)}><span>{leafCategories[key].label}</span></button>)}
                </div>
                <p>{t('guide:tobaccoGuidePage.tapALayerToDiscoverItsFunction')}</p>
              </div>
              <div className="tg-part">
                <div className="tg-part-tabs" aria-label={t('guide:tobaccoGuidePage.partsOfTheCigar')}>
                  {Object.keys(recipe).map(key => <button key={key} aria-pressed={part === key} onClick={() => setPart(key)}>{recipe[key].number} <span>{leafCategories[key].label}</span></button>)}
                </div>
                <div className="tg-part-story" aria-live="polite" aria-atomic="true">
                  <span className="tg-eyebrow">{category.position} · {recipe[part].amount}</span>
                  <h3>{category.role}</h3><p>{category.description}</p>
                  <div className="tg-practice"><Layers size={18} aria-hidden="true" /><div><h4>{t('guide:tobaccoGuidePage.inYourBlend')}</h4><p>{recipe[part].copy}</p></div></div>
                </div>
              </div>
            </div>
          </section>
          <section id="guide-families" className="tg-section" aria-labelledby="tg-families-title">
            <div className="tg-section-heading"><span className="tg-section-number">02</span><div><span className="tg-eyebrow">{t('guide:tobaccoGuidePage.howTheyExpressThemselves')}</span><h2 id="tg-families-title">{t('guide:tobaccoGuidePage.differentExpressions')}</h2></div></div>
            <TobaccoFamiliesInfo />
          </section>
          <section id="guide-collection" className="tg-section" aria-labelledby="tg-collection-title">
            <div className="tg-section-heading"><span className="tg-section-number">03</span><div><span className="tg-eyebrow">{t('guide:tobaccoGuidePage.exploreTheLeaves')}</span><h2 id="tg-collection-title">{t('guide:tobaccoGuidePage.nowDiscoverTheLeaves')}</h2></div></div>
            <TobaccoFamilyGallery />
            <Link className="tg-library-link" to="/leaf-library">{t('guide:tobaccoGuidePage.exploreTheFullCollection')} <ArrowRight size={17} /></Link>
          </section>
          <p className="tg-end-note">{t('guide:tobaccoGuidePage.eachLeafContributesAPartTheBlend')}</p>
        </div>
      </div>
      <footer className="tg-footer"><span>{t('guide:tobaccoGuidePage.yourBlendIsPreservedWhenYouClose')}</span><button onClick={onClose}>{t('guide:tobaccoGuidePage.continueMyBlend')} <ArrowRight size={17} /></button></footer>
    </div>, document.body,
  );
}
