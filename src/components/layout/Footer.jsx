import { useTranslation, Trans } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';


const Footer = () => {
  const { t } = useTranslation();
const columns = [
  { title: t('navigation:footer.explore'), links: [['/leaf-library', t('navigation:footer.theLeaves')], ['/about', t('navigation:footer.theCraft')], ['/menu', t('navigation:footer.blendProfiles')]] },
  { title: t('navigation:footer.experiences'), links: [['/testimonial', t('navigation:footer.sensoryExperience')], ['/reservation', t('navigation:footer.guidedPresentation')], ['/contact', t('navigation:footer.contact')]] },
];

  return (
  <footer className="site-footer">
    <div className="site-shell site-footer__grid">
      <div className="site-footer__statement">
        <span className="site-kicker">Tabacalera Tamboril</span>
        <h2><Trans ns="navigation" i18nKey="footer.story" components={{ line: <br /> }} /></h2>
        <p>{t('navigation:footer.aVisualExperienceToDiscoverTheRaw')}</p>
      </div>
      {columns.map(({ title, links }) => (
        <nav className="site-footer__column" key={title} aria-label={title}>
          <span>{title}</span>
          {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      ))}
    </div>
    <div className="site-shell site-footer__base">
      <span>© {new Date().getFullYear()} Tabacalera Tamboril</span>
      <span>{t('navigation:footer.contentIntendedForAdults')}</span>
      <a href="https://tabacaleratamboril.com.do">TabacaleraTamboril.com.do <ArrowUpRight size={13} /></a>
    </div>
  </footer>
  );
};

export default Footer;
