import React, { useState, useEffect } from 'react';
import InmersiveView from '@pages/InmersiveView'; // Previously AnatomiaHoja
import TechnicalSheet from '@pages/TechnicalSheet'; // The modal version
import { useLayoutStore } from '@/store/useLayoutStore';
import '@styles/LeafSelector.css';

/**
 * LEAF_INVENTORY
 * Comprehensive list based on processed assets.
 * Optimized for MasterBlenderGrid mapping.
 */
const LEAF_INVENTORY = [
  // --- CAPAS (WRAPPERS) ---
  {
    id: 'capa-habana',
    category: 'CAPA',
    name: 'Habana',
    origin: 'Ecuador / Cuba',
    fullImg: '/assets/full/CAPA HABANA.png',
    thumbImg: '/assets/thumbs/thumb_CAPA HABANA.webp',
    description: 'Elegancia brillante, dulzor natural y notas especiadas.',
    hasInmersive: true
  },
  {
    id: 'capa-pensilvania',
    category: 'CAPA',
    name: 'Pensilvania',
    origin: 'USA',
    fullImg: '/assets/full/CAPA PENSILVANIA.png',
    thumbImg: '/assets/thumbs/thumb_CAPA PENSILVANIA.webp',
    description: 'Fuerza alta, cuerpo robusto y sabores oscuros a cacao.',
    hasInmersive: true
  },

  // --- CAPOTES (BINDERS) ---
  {
    id: 'capote-criollo-98',
    category: 'CAPOTE',
    name: 'Criollo 98',
    origin: 'Dominican Republic',
    fullImg: '/assets/full/CAPOTE CRIOLLO 98.png',
    thumbImg: '/assets/thumbs/thumb_CAPOTE CRIOLLO 98.webp',
    description: 'Excelente elasticidad y combustión uniforme.',
    hasInmersive: false
  },
  {
    id: 'capote-habano',
    category: 'CAPOTE',
    name: 'Habano',
    origin: 'Nicaragua',
    fullImg: '/assets/full/CAPOTE HABANO.png',
    thumbImg: '/assets/thumbs/thumb_CAPOTE HABANO.webp',
    description: 'Aporta estructura y un sutil toque de madera.',
    hasInmersive: false
  },
  {
    id: 'capote-indonesia',
    category: 'CAPOTE',
    name: 'Indonesia',
    origin: 'Indonesia',
    fullImg: '/assets/full/CAPOTE INDONESIA.png',
    thumbImg: '/assets/thumbs/thumb_CAPOTE INDONESIA.webp',
    description: 'Perfil neutro que permite resaltar la tripa.',
    hasInmersive: false
  },
  {
    id: 'capote-pensilvania',
    category: 'CAPOTE',
    name: 'Pensilvania',
    origin: 'USA',
    fullImg: '/assets/full/CAPOTE PENSILVANIA_.png',
    thumbImg: '/assets/thumbs/thumb_CAPOTE PENSILVANIA_.webp',
    description: 'Resistente y con carácter para ligas fuertes.',
    hasInmersive: false
  },
  {
    id: 'capote-sumatra-ecuador',
    category: 'CAPOTE',
    name: 'Sumatra Ecuador',
    origin: 'Ecuador',
    fullImg: '/assets/full/CAPOTE SUMATRA ECUADOR_.png',
    thumbImg: '/assets/thumbs/thumb_CAPOTE SUMATRA ECUADOR_.webp',
    description: 'Combustión lenta y ceniza blanca firme.',
    hasInmersive: false
  },

  // --- TRIPAS (FILLERS) ---
  {
    id: 'tripa-broad-leaf',
    category: 'TRIPA',
    name: 'Broad Leaf',
    origin: 'USA',
    fullImg: '/assets/full/TRIPA BROAD LEAF.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA BROAD LEAF.webp',
    description: 'Notas terrosas y dulzor de tabaco añejo.',
    hasInmersive: false
  },
  {
    id: 'tripa-corojo-ligero',
    category: 'TRIPA',
    name: 'Corojo Ligero',
    origin: 'Nicaragua',
    fullImg: '/assets/full/TRIPA COROJO LIGERO.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA COROJO LIGERO.webp',
    description: 'Fuerza intensa y pimienta blanca marcada.',
    hasInmersive: false
  },
  {
    id: 'tripa-hba-abano',
    category: 'TRIPA',
    name: 'HBA Abano',
    origin: 'Various',
    fullImg: '/assets/full/TRIPA HBA ABANO.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA HBA ABANO.webp',
    description: 'Cuerpo medio y humo denso aromático.',
    hasInmersive: false
  },
  {
    id: 'tripa-kentuky',
    category: 'TRIPA',
    name: 'Kentucky Fire Cured',
    origin: 'USA',
    fullImg: '/assets/full/TRIPA KENTUKY.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA KENTUKY.webp',
    description: 'Sabor ahumado único y potencia rústica.',
    hasInmersive: false
  },
  {
    id: 'tripa-ligero-criollo-98',
    category: 'TRIPA',
    name: 'Ligero Criollo 98',
    origin: 'Dominican Republic',
    fullImg: '/assets/full/TRIPA LIGERO CRIOLLO 98.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA LIGERO CRIOLLO 98.webp',
    description: 'Concentración máxima de nicotina y aceites.',
    hasInmersive: false
  },
  {
    id: 'tripa-ligero-cubano',
    category: 'TRIPA',
    name: 'Ligero Cubano',
    origin: 'Cuba',
    fullImg: '/assets/full/TRIPA LIGERO CUBANO.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA LIGERO CUBANO.webp',
    description: 'El alma del sabor cubano tradicional.',
    hasInmersive: false
  },
  {
    id: 'tripa-ligero-nicaragua',
    category: 'TRIPA',
    name: 'Ligero Nicaragua',
    origin: 'Nicaragua',
    fullImg: '/assets/full/TRIPA LIGERO NICARAGUA.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA LIGERO NICARAGUA.webp',
    description: 'Fortaleza volcánica con cuerpo pleno.',
    hasInmersive: false
  },
  {
    id: 'tripa-olor-ligero',
    category: 'TRIPA',
    name: 'Olor Ligero',
    origin: 'Dominican Republic',
    fullImg: '/assets/full/TRIPA OLOR LIGERO_.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA OLOR LIGERO_.webp',
    description: 'Estructura potente con gran perfil aromático.',
    hasInmersive: false
  },
  {
    id: 'tripa-olor-seco',
    category: 'TRIPA',
    name: 'Olor Seco',
    origin: 'Dominican Republic',
    fullImg: '/assets/full/TRIPA OLOR SECO.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA OLOR SECO.webp',
    description: 'Aroma refinado y combustión equilibrada.',
    hasInmersive: false
  },
  {
    id: 'tripa-pensilvania',
    category: 'TRIPA',
    name: 'Pensilvania Filler',
    origin: 'USA',
    fullImg: '/assets/full/TRIPA PENSILVANIA.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA PENSILVANIA.webp',
    description: 'Cuerpo pesado y notas de frutos secos.',
    hasInmersive: false
  },
  {
    id: 'tripa-seco-criollo-98',
    category: 'TRIPA',
    name: 'Seco Criollo 98',
    origin: 'Dominican Republic',
    fullImg: '/assets/full/TRIPA SECO CRIOLLO 98.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA SECO CRIOLLO 98.webp',
    description: 'Matices complejos con fortaleza moderada.',
    hasInmersive: false
  },
  {
    id: 'tripa-seco-cubano',
    category: 'TRIPA',
    name: 'Seco Cubano',
    origin: 'Cuba',
    fullImg: '/assets/full/TRIPA SECO CUBANO.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA SECO CUBANO.webp',
    description: 'Aroma primario elegante y combustión fácil.',
    hasInmersive: false
  },
  {
    id: 'tripa-seco-nicaragua',
    category: 'TRIPA',
    name: 'Seco Nicaragua',
    origin: 'Nicaragua',
    fullImg: '/assets/full/TRIPA SECO NICARAGUA.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA SECO NICARAGUA.webp',
    description: 'Equilibrio perfecto entre sabor y quema.',
    hasInmersive: false
  },
  {
    id: 'tripa-t-13-ligero',
    category: 'TRIPA',
    name: 'T 13 Ligero',
    origin: 'Hybrid',
    fullImg: '/assets/full/TRIPA T 13 LIGERO.png',
    thumbImg: '/assets/thumbs/thumb_TRIPA T 13 LIGERO.webp',
    description: 'Potencia experimental con gran retrogusto.',
    hasInmersive: false
  }
];



/**
 * LeafSelector Component
 * Manages the grid of tobacco leaves and handles the fullscreen overlay
 * for both inmersive and technical views.
 */

const LeafSelector = () => {
  const setVisualExperience = useLayoutStore((state) => state.setVisualExperience);
  const [activeView, setActiveView] = useState(null);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [filter, setFilter] = useState('ALL');


  useEffect(() => {
    setVisualExperience(true);
    return () => {
      setVisualExperience(false);
    };
  }, []);

  const handleOpenView = (leaf, viewType) => {
    setSelectedLeaf(leaf);
    setActiveView(viewType);

    if (viewType !== 'inmersive') {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseView = () => {
    setActiveView(null);
    setSelectedLeaf(null);
    document.body.style.overflow = '';
  };

  const filteredLeaves = filter === 'ALL'
    ? LEAF_INVENTORY
    : LEAF_INVENTORY.filter(leaf => leaf.category === filter);

    
  return (
    <section className="ls-container">
      <header className="ls-header">
        <h1 className="ls-title">Selección de Hojas</h1>

        {/* Category Filters */}
        <nav className="ls-filters">
          {['ALL', 'CAPA', 'CAPOTE', 'TRIPA'].map(cat => (
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
              <p>{leaf.description}</p>

              <div className="ls-card-actions">
                {leaf.hasInmersive && (
                  <button onClick={() => handleOpenView(leaf, 'inmersive')} className="ls-btn ls-btn-primary">
                    Anatomía
                  </button>
                )}
                <button onClick={() => handleOpenView(leaf, 'technical')} className="ls-btn ls-btn-outline">
                  Ficha Técnica
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {activeView && (
        <div className={`ls-overlay ${activeView === 'inmersive' ? 'is-inmersive' : ''}`}>
          <button className="ls-close-trigger" onClick={handleCloseView}>
            <span className="ls-close-icon">&times;</span>
            <span className="ls-close-label">VOLVER AL SELECTOR</span>
          </button>

          <main className="ls-overlay-viewport">
            {activeView === 'inmersive' ? (
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