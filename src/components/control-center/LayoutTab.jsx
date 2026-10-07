import { useTranslation } from 'react-i18next';
import { useLocation } from '@/i18n/navigation';
import { Anchor, CreditCard, Eye, FileText, Layout, Navigation, Type } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { Section, ToggleRow } from './controls';

export default function LayoutTab() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { currentConfig, toggleNavbar, toggleFooter, toggleHeader, toggleNavbarSticky } = useLayoutStore();
  const { showNavbar, showFooter, showHeader, navbarSticky, headerData } = currentConfig;

  return (
    <div className="cc-grid cc-grid-2">
      {/* Cada toggle recibe pathname para guardarse específicamente para esta página */}
      <Section title={t('controls:layoutTab.globalLayout')} icon={Layout} action={<code className="cc-route">{pathname}</code>}>
        <ToggleRow icon={Eye} label={t('controls:layoutTab.navbar')} checked={showNavbar} onToggle={() => toggleNavbar(pathname)} />
        <ToggleRow icon={CreditCard} label={t('controls:layoutTab.footer')} checked={showFooter} onToggle={() => toggleFooter(pathname)} />
        <ToggleRow icon={Type} label={t('controls:layoutTab.showHeader')} checked={showHeader} onToggle={() => toggleHeader(pathname)} />
      </Section>

      <div className="cc-stack">
        <Section title={t('controls:layoutTab.navbarSettings')} icon={Navigation}>
          <ToggleRow icon={Anchor} label={t('controls:layoutTab.stickyMode')} checked={navbarSticky} disabled={!showNavbar} onToggle={() => toggleNavbarSticky(pathname)} />
          {!showNavbar && <p className="cc-note">{t('controls:layoutTab.enableTheNavbarToChangeStickyMode')}</p>}
        </Section>

        <Section title={t('controls:layoutTab.pageData')} icon={FileText}>
          <div className="cc-data-row"><span>{t('controls:layoutTab.headerTitle')}</span><strong>{(headerData?.titleKey ? t(headerData.titleKey) : '') || t('controls:layoutTab.noTitleSet')}</strong></div>
        </Section>
      </div>
    </div>
  );
}
