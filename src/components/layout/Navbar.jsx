import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useLayoutStore } from '@/store/useLayoutStore';

const primaryLinks = [
  ['/', 'Inicio'],
  ['/about', 'El oficio'],
  ['/leaf-library', 'Las hojas'],
  ['/service', 'El proceso'],
  ['/menu', 'Las mezclas'],
];

const Navbar = () => {
  const { navbarSticky } = useLayoutStore(state => state.currentConfig);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

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
            {primaryLinks.map(([to, label]) => (
              <Link key={to} to={to} className={pathname === to ? 'active' : ''}>{label}</Link>
            ))}
            <Link to="/contact" className={pathname === '/contact' ? 'active' : ''}>Contacto</Link>
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
