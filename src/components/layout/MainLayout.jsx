import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteConfig } from '@/config/routesConfig';
import { useLayoutStore } from '@/store/useLayoutStore';
import Header from '@/components/layout/Header';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';


const MainLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { currentConfig, loadPageConfig } = useLayoutStore();

  useEffect(() => {
    // Al cambiar de ruta, cargamos su config guardada o la default
    const defaultConfig = getRouteConfig(pathname);
    loadPageConfig(pathname, defaultConfig);
    window.scrollTo(0, 0);
  }, [pathname]);

  const { showNavbar, showFooter, showHeader, headerData, headerSticky } = currentConfig;

  return (
    <div className="app-layout-wrapper">
      {showNavbar && <Navbar isSticky={!showHeader} />}
      
      {showHeader && (
        <Header 
          title={headerData?.title || ""} 
          subtitle={headerData?.subtitle || ""} 
          Icon={headerData?.icon} 
          isSticky={headerSticky}
        />
      )}

      <main className={`main-content ${!showHeader && showNavbar ? 'no-header-padding' : ''}`}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;