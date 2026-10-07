import { useTranslation } from 'react-i18next';
import { ArrowRight, Feather, Gauge, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@store/authStore';
import { useLocalizedLeaves } from '@/i18n/useLocalizedLeaves';
import { getLeafCategories } from '@/data/leafPresentation';

// Cada perfil enlaza con hojas de la colección cuyo texto ya describe ese aporte.

export default function MenuPage() {
  const { t } = useTranslation();
  const leaves = useLocalizedLeaves();

  const leafCategories = getLeafCategories(t);
const profiles = [
  { icon: Feather, leafId: 'tripa-olor-seco', title: t('pages:menu.aroma'), note: t('pages:menu.theNuancesOfTheLeaf'), text: t('pages:menu.startByRecognizingTheNotesDescribedFor'), link: { to: '/leaf-library#tripa-olor-seco', label: t('pages:menu.viewAnAromaticLeaf') } },
  { icon: Sparkles, leafId: 'capote-criollo-98', title: t('pages:menu.structure'), note: t('pages:menu.theFunctionOfEachPart'), text: t('pages:menu.observeHowTheBinderSupportsTheWhole'), link: { to: '/leaf-library?categoria=CAPOTE', label: t('pages:menu.viewBinderLeaves') } },
  { icon: Gauge, leafId: 'tripa-corojo-ligero', title: t('pages:menu.strength'), note: t('pages:menu.presenceInTheBlend'), text: t('pages:menu.compareIntenseLeavesWithMilderOnesTo'), link: { to: '/leaf-library#tripa-corojo-ligero', label: t('pages:menu.viewAStrongLeaf') } },
];

  const user = useAuthStore(state => state.user);
  return (
    <div className="site-page">
      <section className="site-section site-shell">
        <div className="site-section-heading">
          <div><span className="site-kicker">{t('pages:menu.understandCharacter')}</span><h2>{t('pages:menu.aBlendBeginsWithKnowingItsLeaves')}</h2></div>
          <p>{t('pages:menu.aProfileIsNotARecipeIt')}</p>
        </div>
        <div className="site-profile-grid site-profile-grid--specimens">
          {profiles.map(({ icon: Icon, leafId, title, note, text, link }, index) => {
            const leaf = leaves.find(item => item.id === leafId);
            return (
              <article key={title} className="site-profile-card">
                <figure><img src={leaf.fullImg} alt={t('pages:menu.leaf', { value1: leaf.name, value2: leafCategories[leaf.category].label })} loading="lazy" /><span>0{index + 1}</span></figure>
                <div>
                  <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
                  <span className="site-kicker">{note}</span><h3>{title}</h3><p>{text}</p>
                  <div className="site-leaf-reference">
                    <span className="site-kicker">{t('pages:menu.referenceLeaf')} {leafCategories[leaf.category].label}</span>
                    <h4>{leaf.name}</h4><p>{leaf.description}</p>
                  </div>
                  <Link className="site-text-link" to={link.to}>{link.label} <ArrowRight size={16} /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="site-inline-cta site-shell">
        <div><span className="site-kicker">{t('pages:menu.fromLeafToComposition')}</span><h2>{t('pages:menu.findYourBalance')}</h2></div>
        <p>{t('pages:menu.atTheBlendingTableChooseFillerBinder')}</p>
        <Link className="site-button site-button--primary" to={user ? '/craft-your-cigar' : '/login'}>{t('pages:menu.createMyCigar')} <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}
