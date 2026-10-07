import { useTranslation } from 'react-i18next';
import { ArrowRight, Eye, Hand, Leaf, Wind } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// Cada sentido enlaza con hojas reales para que la lectura no quede aislada.

export default function Testimonial() {
  const { t } = useTranslation();
const senses = [
  { icon: Eye, index: '01', title: t('pages:testimonial.appearance'), text: t('pages:testimonial.colorUniformityAndTextureOfferTheFirst'), link: { to: '/leaf-library?categoria=CAPA', label: t('pages:testimonial.observeWrapperLeaves') } },
  { icon: Hand, index: '02', title: t('pages:testimonial.touch'), text: t('pages:testimonial.flexibilityBodyAndSurfaceHelpExplainHow'), link: { to: '/leaf-library?categoria=CAPOTE', label: t('pages:testimonial.discoverBinders') } },
  { icon: Leaf, index: '03', title: t('pages:testimonial.aroma'), text: t('pages:testimonial.coldAromaRevealsFamiliesOfNuancesBefore'), link: { to: '/leaf-library#tripa-olor-seco', label: t('pages:testimonial.exploreAnAromaticLeaf') } },
  { icon: Wind, index: '04', title: t('pages:testimonial.evolution'), text: t('pages:testimonial.theBlendExpressesItselfInStagesObserving'), link: { to: '/menu', label: t('pages:testimonial.exploreProfiles') } },
];

  return (
    <div className="site-page">
      <section className="site-section site-shell">
        <div className="site-section-heading site-section-heading--wide"><div><span className="site-kicker">{t('pages:testimonial.lookBeforeInterpreting')}</span><h2>{t('pages:testimonial.anExperienceRevealedLayerByLayer')}</h2></div><p className="site-lead">{t('pages:testimonial.knowingTobaccoAlsoMeansLearningToPause')}</p></div>
        <div className="site-senses">{senses.map(({ icon: Icon, index, title, text, link }) => <article key={title}><span>{index}</span><Icon size={26} strokeWidth={1.25} aria-hidden="true" /><h3>{title}</h3><p>{text}</p><Link className="site-text-link" to={link.to}>{link.label} <ArrowRight size={15} /></Link></article>)}</div>
      </section>
      <section className="site-sensory-quote">
        <div className="site-shell">
          <span className="site-kicker">{t('pages:testimonial.mindfulObservation')}</span>
          <blockquote>{t('pages:testimonial.theExperienceBeginsWithAttentionNotA')}</blockquote>
          <p>{t('pages:testimonial.theInterfaceSupportsThatPacePreciseInformation')}</p>
          <Link className="site-text-link" to="/reservation">{t('pages:testimonial.experienceItInAGuidedPresentation')} <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
