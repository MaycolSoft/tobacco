import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  // Scroll al inicio cada vez que cambie la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Configuración de títulos según la ruta
  const pageConfig = {
    "/about": { title: "About Us", subtitle: "About" },
    "/service": { title: "Our Cigars", subtitle: "Cigars" },
    "/menu": { title: "Our Blends", subtitle: "Blends" },
    "/reservation": { title: "Reservation", subtitle: "Reservation" },
    "/testimonial": { title: "Testimonial", subtitle: "Testimonial" },
    "/contact": { title: "Contact Us", subtitle: "Contact" },
  };

  const currentConfig = pageConfig[pathname];

  return (
    <>
      <Navbar />

      {/* Solo mostramos el Header si la ruta existe en nuestra configuración (No se muestra en Home "/") */}
      {currentConfig && (
        <Header title={currentConfig.title} subtitle={currentConfig.subtitle} />
      )}

      <main>{children}</main>

      <Footer />

      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="fa fa-angle-double-up"></i>
      </a>
    </>
  );
};

export default MainLayout;