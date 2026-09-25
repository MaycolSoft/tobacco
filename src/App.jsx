
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Seo />
      <LayoutControlPanel />
      <MainLayout>
        <Routes>
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

          {/* Compatibilidad: El proceso se fusionó con El oficio y la guía vive dentro del configurador. */}
          <Route path="/service" element={<Navigate to="/about#proceso" replace />} />
          <Route path="/blend-guide" element={<Navigate to="/craft-your-cigar?guia=abierta" replace />} />


          <Route path="*" element={
            <section className="site-empty-state">
              <Compass size={34} strokeWidth={1.4} aria-hidden="true" />
              <span className="site-kicker">Error 404</span>
              <h1>Esta página no forma parte del recorrido.</h1>
              <p>Regresa al inicio para continuar explorando el universo de la hoja y el cigarro.</p>
              <Link className="site-button site-button--secondary" to="/"><ArrowLeft size={17} /> Volver al inicio</Link>
            </section>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
