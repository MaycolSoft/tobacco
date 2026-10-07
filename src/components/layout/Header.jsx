import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link, useLocation } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

const headerImages = {
  '/about': '/img/carousel-2.jpg',
  '/menu': '/img/mezclas-mesa-editorial-v1.jpg',
  '/testimonial': '/assets/full/CAPA HABANA.png',
};

const Header = ({ title, subtitle, Icon, parent, variant = 'editorial' }) => {
  const { t } = useTranslation();
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
      <nav className="site-breadcrumb" aria-label={t('navigation:header.breadcrumbs')}>
        <Link to="/">{t('navigation:header.home')}</Link><ChevronRight size={13} aria-hidden="true" />{parent && <><span>{parent}</span><ChevronRight size={13} aria-hidden="true" /></>}<span aria-current="page">{title}</span>
      </nav>
    </div>
  </header>
  );
};

export default Header;
