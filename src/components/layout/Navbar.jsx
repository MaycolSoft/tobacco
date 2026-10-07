import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from '@/i18n/navigation';
import { ArrowUpRight, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useLayoutStore } from '@/store/useLayoutStore';

// Cada entrada responde una pregunta distinta del recorrido; `match` agrupa rutas fusionadas.

const Navbar = () => {
  const { t } = useTranslation();
const primaryLinks = [
  { to: '/', label: t('navigation:navbar.home'), match: ['/'] },
  { to: '/leaf-library', label: t('navigation:navbar.theLeaves'), match: ['/leaf-library'] },
  { to: '/about', label: t('navigation:navbar.theCraft'), match: ['/about'] },
  { to: '/menu', label: t('navigation:navbar.blendProfiles'), match: ['/menu'] },
];
const experienceLinks = [
  { to: '/testimonial', label: t('navigation:navbar.sensoryExperience'), text: t('navigation:navbar.learnToObserveTheLeaf') },
  { to: '/reservation', label: t('navigation:navbar.guidedPresentation'), text: t('navigation:navbar.arrangeASession') },
];

  const { navbarSticky } = useLayoutStore(state => state.currentConfig);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [experiencesOpen, setExperiencesOpen] = useState(false);
  const experiencesRef = useRef(null);
  const inExperiences = experienceLinks.some(link => link.to === pathname);

  useEffect(() => { setOpen(false); setExperiencesOpen(false); }, [pathname]);

  useEffect(() => {
    if (!experiencesOpen) return;
    const onPointer = event => { if (!experiencesRef.current?.contains(event.target)) setExperiencesOpen(false); };
    const onKey = event => {
      if (event.key !== 'Escape') return;
      setExperiencesOpen(false);
      experiencesRef.current?.querySelector('button')?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey); };
  }, [experiencesOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`site-nav ${navbarSticky ? 'is-sticky' : ''}`}>
      <nav aria-label={t('navigation:navbar.mainNavigation')}>
        <Link to="/" className="site-brand" aria-label={t('navigation:navbar.tabacaleraTamborilHome')}>
          <img src="/img/logo.png" width="76" height="74" alt="" />
          <span><strong>Tabacalera</strong><small>{t('navigation:navbar.tamborilHouseOfTheLeaf')}</small></span>
        </Link>

        <button className="site-nav-toggle" type="button" aria-label={open ? t('navigation:navbar.closeMenu') : t('navigation:navbar.openMenu')} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          {open ? <X size={22} /> : <Menu size={23} />}
        </button>

        <div className={`site-nav-panel ${open ? 'is-open' : ''}`}>
          <div className="site-nav-links">
            {primaryLinks.map(({ to, label, match }) => {
              const active = match.includes(pathname);
              return <Link key={to} to={to} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>{label}</Link>;
            })}
            <div className={`site-nav-group ${experiencesOpen ? 'is-open' : ''}`} ref={experiencesRef}>
              <button type="button" className={inExperiences ? 'active' : ''} aria-expanded={experiencesOpen} aria-controls="site-nav-experiences" onClick={() => setExperiencesOpen(value => !value)}>{t('navigation:navbar.experiences')}<ChevronDown size={14} aria-hidden="true" />
              </button>
              <div className="site-nav-submenu" id="site-nav-experiences">
                {experienceLinks.map(({ to, label, text }) => (
                  <Link key={to} to={to} className={pathname === to ? 'active' : ''} aria-current={pathname === to ? 'page' : undefined}>
                    <strong>{label}</strong><small>{text}</small>
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact" className={pathname === '/contact' ? 'active' : ''} aria-current={pathname === '/contact' ? 'page' : undefined}>{t('navigation:navbar.contact')}</Link>
          </div>
          <div className="site-nav-actions">
            <LanguageSwitcher />
            {user && <button type="button" className="site-nav-session" onClick={handleLogout}><LogOut size={15} /> {t('navigation:navbar.signOut')}</button>}
            <Link to={user ? '/craft-your-cigar' : '/login'} className="site-nav-cta">{t('navigation:navbar.createMyCigar')}<ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
