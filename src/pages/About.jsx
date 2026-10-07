import { useTranslation, Trans } from 'react-i18next';
import { useEffect } from 'react';
import { ArrowDown, ArrowRight, Eye, Hand, Layers3, Scale, ScanEye } from 'lucide-react';
import { Link, useLocation } from '@/i18n/navigation';
import { useLayoutStore } from '@/store/useLayoutStore';
import { useAuthStore } from '@store/authStore';
import { useLocalizedLeaves } from '@/i18n/useLocalizedLeaves';
import { getLeafCategories } from '@/data/leafPresentation';

// El oficio reúne el conocimiento del tabaquero y el proceso de elaboración.

export default function About() {
  const { t } = useTranslation();
  const leaves = useLocalizedLeaves();
const components = ['capa-habana', 'capote-criollo-98', 'tripa-olor-seco'].map(id => leaves.find(leaf => leaf.id === id));

  const leafCategories = getLeafCategories(t);
const principles = [
  { icon: Eye, title: t('pages:about.observe'), text: t('pages:about.readTheColorTextureAndStructureBefore') },
  { icon: Hand, title: t('pages:about.understand'), text: t('pages:about.recognizeWhatEachLeafCanContributeTo') },
  { icon: Scale, title: t('pages:about.balance'), text: t('pages:about.buildCharacterWhilePreservingHarmonyBetweenAroma') },
  { icon: Layers3, title: t('pages:about.craft'), text: t('pages:about.bringWrapperBinderAndFillerTogetherAnd') },
];
const chapters = [
  { id: 'seleccion', label: t('pages:about.selection') },
  { id: 'composicion', label: t('pages:about.composition') },
  { id: 'elaboracion', label: t('pages:about.crafting') },
];

  const showHeader = useLayoutStore(state => state.currentConfig.showHeader);
  const user = useAuthStore(state => state.user);
  const { hash } = useLocation();
  const Title = showHeader ? 'h2' : 'h1';

  // Permite llegar directamente a una sección mediante su ancla.
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="site-page">
      <section className="site-shell site-about-intro" aria-labelledby="about-title">
        <div className="site-about-intro__copy">
          <span className="site-kicker">{t('pages:about.rawMaterialKnowledgeTradition')}</span>
          <Title id="about-title">{showHeader ? t('pages:about.theLeafGuidesEveryGesture') : <Trans ns="pages" i18nKey="about.hero" components={{ line: <br />, emphasis: <em /> }} />}</Title>
          <p className="site-lead">{t('pages:about.observingTheLeafRecognizingItsCharacterAnd')}</p>
          <p>{t('pages:about.textureFlexibilityAndStructureGuideTheSelection')}</p>
          <a className="site-text-link" href="#proceso">{t('pages:about.discoverTheProcess')} <ArrowDown size={17} /></a>
        </div>
        <figure className="site-about-intro__image">
          <img src="/img/oficio-manos-editorial-v1.jpg" alt={t('pages:about.illustrationOfHandsExaminingTheTextureOf')} width="1122" height="1402" fetchPriority="high" />
          <figcaption>{t('pages:about.knowTheMaterialPracticeTheCraft')}</figcaption>
        </figure>
      </section>

      <section className="site-section site-section--surface" aria-labelledby="principles-title">
        <div className="site-shell">
          <div className="site-section-heading"><div><span className="site-kicker">{t('pages:about.principlesOfTheCraft')}</span><h2 id="principles-title">{t('pages:about.attentionKnowledgeAndBalance')}</h2></div><p>{t('pages:about.aWayOfWorkingWhereTechniqueAccompanies')}</p></div>
          <ol className="site-principles site-principles--flow">{principles.map(({ icon: Icon, title, text }, index) => <li key={title}><span>0{index + 1}</span><Icon size={24} strokeWidth={1.3} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </div>
      </section>

      <section id="proceso" className="site-section site-shell site-anchor" aria-labelledby="process-title">
        <div className="site-section-heading site-section-heading--wide">
          <div><span className="site-kicker">{t('pages:about.theProcessASequenceOfDecisions')}</span><h2 id="process-title">{t('pages:about.theFinalShapeBeginsWithSelection')}</h2></div>
          <p className="site-lead">{t('pages:about.getToKnowTheRawMaterialDiscover')}</p>
        </div>
        <nav className="site-chapter-nav" aria-label={t('pages:about.stagesOfTheProcess')}>
          {chapters.map(({ id, label }, index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}
        </nav>
        <div className="site-process-chapters">
          <article id="seleccion" className="site-process-chapter site-anchor">
            <div className="site-process-chapter__copy">
              <span className="site-kicker">{t('pages:about.01Selection')}</span><ScanEye size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3>{t('pages:about.learnToLook')}</h3><p>{t('pages:about.colorTextureAndIntegrityOfferAFirst')}</p>
              <Link className="site-text-link" to="/leaf-library">{t('pages:about.exploreTheCollection')} <ArrowRight size={16} /></Link>
            </div>
            <figure className="site-process-specimen"><img src={components[0].fullImg} alt={t('pages:about.wholeHabanaWrapperLeafFromTheCollection')} loading="lazy" /><figcaption>{t('pages:about.habanaWrapperCollectionImage')}</figcaption></figure>
          </article>
          <article id="composicion" className="site-process-chapter site-anchor">
            <div className="site-process-chapter__copy">
              <span className="site-kicker">{t('pages:about.02Composition')}</span><Layers3 size={24} strokeWidth={1.3} aria-hidden="true" />
              <h3>{t('pages:about.everyPartHasItsPlace')}</h3><p>{t('pages:about.theWrapperSurroundsTheBinderSupportsAnd')}</p>
              <div className="site-link-row">
                <Link className="site-text-link" to="/leaf-library?categoria=TRIPA">{t('pages:about.exploreFillerLeaves')} <ArrowRight size={16} /></Link>
                <Link className="site-text-link" to="/menu">{t('pages:about.exploreProfiles')} <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="site-process-parts">{components.map(leaf => <figure key={leaf.id}><img src={leaf.fullImg} alt={`${leafCategories[leaf.category].label}: ${leaf.name}`} loading="lazy" /><figcaption><strong>{leafCategories[leaf.category].label}</strong><span>{leafCategories[leaf.category].position}</span></figcaption></figure>)}</div>
          </article>
        </div>
      </section>

      <section id="elaboracion" className="site-process-feature site-anchor" aria-labelledby="craft-title">
        <div className="site-process-feature__image"><img src="/img/carousel-2.jpg" alt={t('pages:about.handsCraftingACigar')} loading="lazy" /></div>
        <div className="site-process-feature__copy"><Hand size={28} strokeWidth={1.3} aria-hidden="true" /><span className="site-kicker">{t('pages:about.03Crafting')}</span><h2 id="craft-title">{t('pages:about.fromKnowledgeToGesture')}</h2><p>{t('pages:about.atTheBlendingTableYouBringFiller')}</p><Link className="site-button site-button--primary" to={user ? '/craft-your-cigar' : '/login'}>{t('pages:about.createMyCigar')} <ArrowRight size={17} /></Link></div>
      </section>

      <section className="site-section site-shell site-quote"><span aria-hidden="true">“</span><blockquote>{t('pages:about.knowingTheLeafChangesHowYouUnderstand')}</blockquote><Link className="site-text-link" to="/leaf-library">{t('pages:about.exploreTheCollection')} <ArrowRight size={15} /></Link></section>
    </div>
  );
}
