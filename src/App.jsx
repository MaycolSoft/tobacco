
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@components/ProtectedRoute';
import Login from '@pages/Login';

// Layout
import MainLayout from '@components/layout/MainLayout';

// Páginas
import Home from '@/pages/Home';
import About from '@/pages/About';
import Service from '@/pages/Service';
import Menu from '@/pages/Menu';
import Reservation from '@/pages/Reservation';
import Testimonial from '@/pages/Testimonial';
import Contact from '@/pages/Contact';
import CraftYourCigar from '@/pages/CraftYourCigar';
import LeafLibrary from '@/pages/LeafLibrary';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de información */}
          <Route path="/leaf-library" element={<LeafLibrary />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas de interacción */}
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/craft-your-cigar" element={<ProtectedRoute><CraftYourCigar /></ProtectedRoute>} />


          {/* Ruta para manejar errores 404 - Opcional */}
          <Route path="*" element={
            <div className="container py-5 text-center">
              <h1 className="display-1">404</h1>
              <h2>Page Not Found</h2>
            </div>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
