import React from 'react';
import '@styles/TechnicalSheet.css';

/**
 * TechnicalSheet: Vista analítica para hojas y mezclas.
 * Enfocada en métricas de sabor, fortaleza y combustión.
 */
const TechnicalSheet = ({ leaf }) => {
  // Datos simulados (En un entorno real, estos vendrían del objeto leaf)
  const stats = [
    { label: 'Fortaleza', value: '85%' },
    { label: 'Combustión', value: '92%' },
    { label: 'Aroma', value: '78%' },
    { label: 'Aceites', value: '60%' },
  ];

  return (
    <div className="ts-wrapper">
      <div className="ts-container">

        {/* Visual Side */}
        <div className="ts-image-side">
          <img src={leaf.fullImg} alt={leaf.name} className="ts-main-img" />
        </div>

        {/* Info Side */}
        <div className="ts-info-side">
          <header className="ts-header">
            <span className="ts-category">{leaf.category}</span>
            <h2 className="ts-title">{leaf.name}</h2>
            <p className="ts-origin-tag">Origen: <span>{leaf.origin}</span></p>
          </header>

          <div className="ts-description">
            <p>{leaf.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="ts-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="ts-stat-item">
                <span className="ts-stat-label">{stat.label}</span>
                <div className="ts-progress-bar">
                  <div className="ts-progress-fill" style={{ width: stat.value }}></div>
                </div>
                <span className="ts-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="ts-pairing">
            <h4>Maridaje Recomendado</h4>
            <div className="ts-pairing-tags">
              <span>Café Espresso</span>
              <span>Ron Añejo</span>
              <span>Chocolate Amargo</span>
            </div>
          </div>

          <button className="ts-select-btn btn btn-primary" onClick={() => alert('Hoja seleccionada para el blend')}>
            SELECCIONAR PARA MI PURO
          </button>
        </div>

      </div>
    </div>
  );
};

export default TechnicalSheet;