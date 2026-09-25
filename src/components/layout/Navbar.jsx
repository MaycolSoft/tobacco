import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useLayoutStore } from '@/store/useLayoutStore';

// Cada entrada responde una pregunta distinta del recorrido; `match` agrupa rutas fusionadas.
const primaryLinks = [
  { to: '/', label: 'Inicio', match: ['/'] },
  { to: '/leaf-library', label: 'Las hojas', match: ['/leaf-library'] },
  { to: '/about', label: 'El oficio', match: ['/about'] },
  { to: '/menu', label: 'Perfiles de mezcla', match: ['/menu'] },
];
const experienceLinks = [
  { to: '/testimonial', label: 'Experiencia sensorial', text: 'Aprender a observar la hoja' },
  { to: '/reservation', label: 'Presentación guiada', text: 'Coordinar una sesión' },
];

const Navbar = () => {
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
      <nav aria-label="Navegación principal">
        <Link to="/" className="site-brand" aria-label="Tabacalera Tamboril, inicio">
          <img src="/img/logo.png" width="76" height="74" alt="" />
          <span><strong>Tabacalera</strong><small>Tamboril · Casa de la hoja</small></span>
        </Link>

        <button className="site-nav-toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          {open ? <X size={22} /> : <Menu size={23} />}
        </button>

        <div className={`site-nav-panel ${open ? 'is-open' : ''}`}>
          <div className="site-nav-links">
            {primaryLinks.map(({ to, label, match }) => {
              const active = match.includes(pathname);
              return <Link key={to} to={to} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>{label}</Link>;
            })}
            <div className={`site-nav-group ${experiencesOpen ? 'is-open' : ''}`} ref={experiencesRef}>
              <button type="button" className={inExperiences ? 'active' : ''} aria-expanded={experiencesOpen} aria-controls="site-nav-experiences" onClick={() => setExperiencesOpen(value => !value)}>
                Experiencias <ChevronDown size={14} aria-hidden="true" />
              </button>
              <div className="site-nav-submenu" id="site-nav-experiences">
                {experienceLinks.map(({ to, label, text }) => (
                  <Link key={to} to={to} className={pathname === to ? 'active' : ''} aria-current={pathname === to ? 'page' : undefined}>
                    <strong>{label}</strong><small>{text}</small>
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact" className={pathname === '/contact' ? 'active' : ''} aria-current={pathname === '/contact' ? 'page' : undefined}>Contacto</Link>
          </div>
          <div className="site-nav-actions">
            {user && <button type="button" className="site-nav-session" onClick={handleLogout}><LogOut size={15} /> Salir</button>}
            <Link to={user ? '/craft-your-cigar' : '/login'} className="site-nav-cta">
              Crear mi cigarro <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
