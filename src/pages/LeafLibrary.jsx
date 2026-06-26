import React, { useState, useEffect, useMemo } from 'react';
import InmersiveView from '@pages/InmersiveView';
import TechnicalSheet from '@pages/TechnicalSheet';
import '@styles/LeafLibrary.css';
import { leaves } from '@/data/leaves';




/**
 * LeafSelector Component
 * Manages the grid of tobacco leaves and handles the fullscreen overlay
 * for both inmersive and technical views.
 */
const VIEW = {
  INMERSIVE: 'inmersive',
  TECHNICAL: 'technical',
};

const LeafSelector = () => {

  const [activeView, setActiveView] = useState(null);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [filter, setFilter] = useState('ALL');

  // ESC cerrar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleCloseView();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Scroll lock
  useEffect(() => {
    const shouldLock = activeView && activeView !== 'inmersive';

    document.body.classList.toggle('no-scroll', shouldLock);
  }, [activeView]);

  const handleOpenView = (leaf, viewType) => {
    setSelectedLeaf(leaf);
    setActiveView(viewType);
  };

  const handleCloseView = () => {
    setActiveView(null);
    setSelectedLeaf(null);
  };

  const filteredLeaves = useMemo(() => {
    if (filter === 'ALL') return leaves;
    return leaves.filter((leaf) => leaf.category === filter);
  }, [filter]);

  return (
    <section className="ls-container">
      <header className="ls-header">
        {/* <h1 className="ls-title">Selección de Hojas</h1> */}

        <nav className="ls-filters">
          {['ALL', 'CAPA', 'CAPOTE', 'TRIPA'].map((cat) => (
            <button
              key={cat}
              className={`ls-filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'ALL' ? 'TODAS' : cat}
            </button>
          ))}
        </nav>
      </header>

      <div className="ls-grid">
        {filteredLeaves.map((leaf) => (
          <article key={leaf.id} className="ls-card">
            <div className="ls-card-visual">
              <img src={leaf.thumbImg} alt={leaf.name} loading="lazy" />
              <span className="ls-badge">{leaf.category}</span>
            </div>

            <div className="ls-card-content">
              <div className="ls-card-header">
                <h3>{leaf.name}</h3>
                <span className="ls-origin">{leaf.origin}</span>
              </div>

              <p className="ls-desc">{leaf.description}</p>

              <div className="ls-card-actions">
                {leaf.hasInmersive && (
                  <button
                    onClick={() => handleOpenView(leaf, VIEW.INMERSIVE)}
                    className="ls-btn ls-btn-primary"
                  >
                    Inmersiva
                  </button>
                )}

                <button
                  onClick={() => handleOpenView(leaf, VIEW.TECHNICAL)}
                  className="ls-btn ls-btn-outline"
                >
                  Ficha Técnica
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeView && selectedLeaf && (
        <div className="ls-overlay">
          <button
            className="ls-close-trigger"
            onClick={handleCloseView}
            aria-label="Cerrar vista"
          >
            <span className="ls-close-icon">&times;</span>
            <span className="ls-close-label">VOLVER</span>
          </button>

          <main className="ls-overlay-viewport">
            {activeView === VIEW.INMERSIVE ? (
              <InmersiveView leaf={selectedLeaf} />
            ) : (
              <TechnicalSheet leaf={selectedLeaf} />
            )}
          </main>
        </div>
      )}
    </section>
  );
};

export default LeafSelector;