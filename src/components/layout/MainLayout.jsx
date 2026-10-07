import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import React, { useEffect } from 'react';
import { useLocation } from '@/i18n/navigation';
import { getRouteConfig } from '@/config/routesConfig';
import { useLayoutStore } from '@/store/useLayoutStore';
import Header from '@/components/layout/Header';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';


const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { currentConfig, loadPageConfig } = useLayoutStore();

  useEffect(() => {
    // Al cambiar de ruta, cargamos su config guardada o la default
    const defaultConfig = getRouteConfig(pathname);
    loadPageConfig(pathname, defaultConfig);
    window.scrollTo(0, 0);
  }, [pathname, loadPageConfig]);

  const { showNavbar, showFooter, showHeader, headerData, headerVariant } = currentConfig;
  const { parentKey } = getRouteConfig(pathname);

  return (
    <div className="app-layout-wrapper" data-route={pathname} data-header={showHeader ? 'visible' : 'hidden'}>
      {showNavbar ? <Navbar /> : <LanguageSwitcher floating />}
      
      {showHeader && (
        <Header 
          title={headerData?.titleKey ? t(headerData.titleKey) : ""}
          subtitle={headerData?.subtitleKey ? t(headerData.subtitleKey) : ""}
          Icon={headerData?.icon} 
          parent={parentKey ? t(parentKey) : undefined}
          variant={headerVariant}
        />
      )}

      <main id="main-content" className={`main-content ${!showHeader && showNavbar ? 'no-header-padding' : ''}`}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
