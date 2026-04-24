
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

const Navbar = () => {
  const location = useLocation();

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Enviamos al usuario a la home tras salir
  };

  // Función para determinar si el enlace está activo
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="container-fluid p-0 nav-bar">
      <nav className="navbar navbar-expand-lg bg-none navbar-dark py-3">
        {/* Logo - Redirige al Home */}
        <Link to="/" className="navbar-brand px-lg-4 m-0">
          <h1 className="m-0 display-4 text-uppercase text-white">
            <img src="/img/logo.png" width="134" height="130" alt="Logo" />
          </h1>
        </Link>

        <button 
          type="button" 
          className="navbar-toggler" 
          data-toggle="collapse" 
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
          <div className="navbar-nav ml-auto p-4">
            {/* Enlaces Principales */}
            <Link to="/" className={`nav-item nav-link ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/about" className={`nav-item nav-link ${isActive('/about')}`}>
              About
            </Link>
            <Link to="/anatomia-hoja" className={`nav-item nav-link ${isActive('/anatomia-hoja')}`}>
              Anatomía de la Hoja
            </Link>
            <Link to="/service" className={`nav-item nav-link ${isActive('/service')}`}>
              Cigars
            </Link>
            <Link to="/menu" className={`nav-item nav-link ${isActive('/menu')}`}>
              Blends
            </Link>

            {/* Menú Desplegable (Dropdown) */}
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                Pages
              </a>
              <div className="dropdown-menu text-capitalize">
                <Link to="/reservation" className="dropdown-item">Reservation</Link>
                <Link to="/testimonial" className="dropdown-item">Testimonial</Link>
              </div>
            </div>

            <Link to="/contact" className={`nav-item nav-link ${isActive('/contact')}`}>
              Contact
            </Link>

            {user ? (
              <>
                <Link to="/craft-your-cigar" className={`nav-item nav-link ${isActive('/craft-your-cigar')}`}>Craft Your Cigar</Link>
                <button onClick={handleLogout} className="nav-item nav-link btn btn-link" style={{ cursor: 'pointer' }}>
                  Salir ({user.username})
                </button>
              </>
            ) : (
              <Link to="/login" className={`nav-item nav-link ${isActive('/login')}`}>Entrar</Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;