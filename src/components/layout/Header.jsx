import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header Component
 * @param {string} title - Título principal de la página
 * @param {string} subtitle - Texto para el breadcrumb
 * @param {React.Component} Icon - Componente de icono de Lucide (opcional)
 */
const Header = ({ title, subtitle, Icon }) => {
  return (
    <div className="container-fluid page-header mb-5 position-relative overlay-bottom">
      <div
        className="d-flex flex-column align-items-center justify-content-center pt-0 pt-lg-5"
        style={{ minHeight: "400px" }}
      >
        {/* Renderizado del Icono si existe */}
        {Icon && (
          <div className="mb-3 text-primary">
            <Icon size={48} strokeWidth={1.5} color="#d4af37" />
          </div>
        )}

        <h1 className="display-4 mb-3 mt-0 text-white text-uppercase text-center">
          {title}
        </h1>

        <div className="d-inline-flex mb-lg-5">
          <p className="m-0 text-white">
            <Link className="text-white" to="/">
              Home
            </Link>
          </p>
          <p className="m-0 text-white px-2">/</p>
          <p className="m-0 text-white" style={{ color: "#d4af37" }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;