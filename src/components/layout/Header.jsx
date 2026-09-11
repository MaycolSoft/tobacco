import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const headerImages = {
  '/about': '/img/carousel-2.jpg',
  '/service': '/img/service-2.jpg',
  '/menu': '/assets/full/CAPOTE CRIOLLO 98.png',
  '/testimonial': '/assets/full/CAPA HABANA.png',
};

const Header = ({ title, subtitle, Icon, variant = 'editorial' }) => {
  const { pathname } = useLocation();
  const image = headerImages[pathname];
  return (
  <header className={`site-page-header site-page-header--${variant} ${image ? 'has-editorial-image' : 'is-plain'}`}>
    {image && <img className="site-page-header__image" src={image} alt="" />}
    <div className="site-page-header__glow" aria-hidden="true" />
    <div className="site-shell site-page-header__content">
      <div className="site-page-header__icon">{Icon && <Icon size={27} strokeWidth={1.35} aria-hidden="true" />}</div>
      <span className="site-kicker">{subtitle}</span>
      <h1>{title}</h1>
      <nav className="site-breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link><ChevronRight size={13} aria-hidden="true" /><span>{title}</span>
      </nav>
    </div>
  </header>
  );
};

export default Header;
