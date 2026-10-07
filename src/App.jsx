import { useTranslation } from 'react-i18next';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate as RouterNavigate } from 'react-router-dom';
import { LanguageSync, Link } from '@/i18n/navigation';
import { localizePath, parseLocalePath } from '@/i18n/routing';
import { LocaleLocationContext } from '@/i18n/locationContext';
import { ArrowLeft, Compass } from 'lucide-react';
import ProtectedRoute from '@components/ProtectedRoute';
import Login from '@pages/Login';
import Seo from '@components/Seo';

// Layout
import MainLayout from '@components/layout/MainLayout';
import LayoutControlPanel from '@components/LayoutControlPanel';

// Páginas
import Home from '@/pages/Home';
import About from '@/pages/About';
import Menu from '@/pages/Menu';
import Reservation from '@/pages/Reservation';
import Testimonial from '@/pages/Testimonial';
import Contact from '@/pages/Contact';
import CraftYourCigar from '@/pages/CraftYourCigar';
import LeafLibrary from '@/pages/LeafLibrary';

function AppContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const { basePath } = parseLocalePath(location.pathname);
  if (/^\/es(?:\/|$)/.test(location.pathname)) {
    return <RouterNavigate to={localizePath(`${location.pathname}${location.search}${location.hash}`, 'es')} replace state={location.state} />;
  }
  return (
    <LocaleLocationContext.Provider value={location}>
      <LanguageSync />
      <Seo />
      <LayoutControlPanel />
      <MainLayout>
        <Routes location={{ ...location, pathname: basePath }}>
          {/* Ruta principal */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de información */}
          <Route path="/leaf-library" element={<LeafLibrary />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas de interacción */}
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/craft-your-cigar" element={<ProtectedRoute><CraftYourCigar /></ProtectedRoute>} />

          <Route path="*" element={
            <section className="site-empty-state">
              <Compass size={34} strokeWidth={1.4} aria-hidden="true" />
              <span className="site-kicker">{t('leaves:app.error404')}</span>
              <h1>{t('leaves:app.thisPageIsOutsideTheJourney')}</h1>
              <p>{t('leaves:app.returnHomeToKeepExploringTheWorld')}</p>
              <Link className="site-button site-button--secondary" to="/"><ArrowLeft size={17} /> {t('leaves:app.backToHome')}</Link>
            </section>
          } />
        </Routes>
      </MainLayout>
    </LocaleLocationContext.Provider>
  );
}

export default function App() {
  return <Router><AppContent /></Router>;
}
