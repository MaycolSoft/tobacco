import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useLayoutStore } from '@/store/useLayoutStore'; // Tu store de Zustand

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;
  
  // Suscripción al estado global
  const isVisualExperience = useLayoutStore((state) => state.isVisualExperience);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const pageConfig = {
    "/about": { title: "About Us", subtitle: "About" },
    "/service": { title: "Our Cigars", subtitle: "Cigars" },
    "/menu": { title: "Our Blends", subtitle: "Blends" },
    "/reservation": { title: "Reservation", subtitle: "Reservation" },
    "/testimonial": { title: "Testimonial", subtitle: "Testimonial" },
    "/contact": { title: "Contact Us", subtitle: "Contact" },
    "/craft-your-cigar": { title: "Craft Your Cigar", subtitle: "Craft Your Cigar" },
  };

  const currentConfig = pageConfig[pathname];

  // SI ES UNA EXPERIENCIA VISUAL: Renderizamos solo el children (el video)
  if (isVisualExperience) {
    return <main>{children}</main>;
  }

  // SI ES UNA PÁGINA NORMAL: Renderizamos todo el Layout
  return (
    <>
      <Navbar />

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