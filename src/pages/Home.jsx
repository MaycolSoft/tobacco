import { useTranslation, Trans } from 'react-i18next';
import { ArrowDown, ArrowRight, Hand, Layers3, Leaf } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { Link } from '@/i18n/navigation';
import { useLocalizedLeaves } from '@/i18n/useLocalizedLeaves';


export default function Home() {
  const { t } = useTranslation();
  const leaves = useLocalizedLeaves();

const journey = [
  { number: '01', icon: Leaf, title: t('pages:home.discoverTheLeaf'), text: t('pages:home.originTextureAndFunctionEachVarietyContributes'), to: '/leaf-library', cta: t('pages:home.exploreTheCollection') },
  { number: '02', icon: Layers3, title: t('pages:home.understandTheBlend'), text: t('pages:home.wrapperBinderAndFillerComeTogetherIn'), to: '/menu', cta: t('pages:home.exploreProfiles') },
  { number: '03', icon: Hand, title: t('pages:home.observeTheCraft'), text: t('pages:home.theSelectionTakesShapeThroughAHandmade'), to: '/about#proceso', cta: t('pages:home.discoverTheProcess') },
];

  const user = useAuthStore(state => state.user);
  return (
    <div className="site-page site-home">
      <section className="site-hero">
        <img src="/img/carousel-1.jpg" alt={t('pages:home.handcraftedTobaccoProcess')} />
        <div className="site-hero__shade" />
        <div className="site-shell site-hero__content">
          <span className="site-kicker">{t('pages:home.tamborilDominicanRepublic')}</span>
          <h1><Trans ns="pages" i18nKey="home.hero" components={{ line: <br />, emphasis: <em /> }} /></h1>
          <p>{t('pages:home.discoverTheRawMaterialUnderstandHowA')}</p>
          <div className="site-actions">
            <Link className="site-button site-button--primary" to="/leaf-library">{t('pages:home.exploreTheLeaves')} <ArrowRight size={17} /></Link>
            <Link className="site-button site-button--ghost" to="/about">{t('pages:home.discoverTheCraft')} <ArrowRight size={17} /></Link>
          </div>
        </div>
        <a className="site-hero__scroll" href="#recorrido"><ArrowDown size={16} /> {t('pages:home.discover')}</a>
      </section>

      <section id="recorrido" className="site-section site-shell site-intro-grid">
        <div><span className="site-kicker">{t('pages:home.aLivingPresentation')}</span><h2><Trans ns="pages" i18nKey="home.story" components={{ line: <br /> }} /></h2></div>
        <div><p className="site-lead">{t('pages:home.theOriginTextureAndFunctionOfEach')}</p><a className="site-text-link" href="#recorrido-pasos">{t('pages:home.viewTheJourney')} <ArrowDown size={15} /></a></div>
      </section>

      <section className="site-section site-section--surface" id="recorrido-pasos">
        <div className="site-shell">
          <div className="site-section-heading"><div><span className="site-kicker">{t('pages:home.whatYouCanDoHere')}</span><h2>{t('pages:home.threeMomentsOneRawMaterial')}</h2></div><p>{t('pages:home.inventory', { count: leaves.length })}</p></div>
          <div className="site-journey-grid">
            {journey.map(({ number, icon: Icon, title, text, to, cta }) => <article key={number} className="site-journey-card"><span>{number}</span><Icon size={25} strokeWidth={1.3} aria-hidden="true" /><h3>{title}</h3><p>{text}</p><Link className="site-text-link" to={to}>{cta} <ArrowRight size={15} /></Link></article>)}
          </div>
        </div>
      </section>

      <section className="site-feature site-shell">
        <figure className="site-feature__image"><img src="/img/about.png" alt={t('pages:home.visualCompositionOfAHandmadeCigar')} /><figcaption>{t('pages:home.materialProportionCraft')}</figcaption></figure>
        <div className="site-feature__copy"><span className="site-kicker">{t('pages:home.theArtOfBlending')}</span><h2>{t('pages:home.choosingLeavesIsOnlyTheBeginningUnderstanding')}</h2><p>{t('pages:home.theWrapperPresentsTheBinderSupportsAnd')}</p><Link className="site-button site-button--secondary" to="/about#composicion">{t('pages:home.seeHowItIsComposed')} <ArrowRight size={17} /></Link></div>
      </section>

      <section className="site-cta"><div className="site-shell"><span className="site-kicker">{t('pages:home.interactiveExperience')}</span><h2><Trans ns="pages" i18nKey="home.creation" components={{ line: <br /> }} /></h2><p>{t('pages:home.chooseFillerBinderAndWrapperReviewYour')}</p><Link className="site-button site-button--primary" to={user ? '/craft-your-cigar' : '/login'}>{t('pages:home.createMyCigar')} <ArrowRight size={17} /></Link></div></section>
    </div>
  );
}
