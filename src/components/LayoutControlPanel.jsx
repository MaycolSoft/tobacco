import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importante para la persistencia por ruta
import { useLayoutStore } from '@/store/useLayoutStore';
import {
  Settings, Eye, Layout, CreditCard,
  ChevronRight, Anchor, Type, Palette, RotateCcw, Square
} from 'lucide-react';

const FONT_PAIRINGS = [
  {
    id: 'legacy',
    name: 'Legacy',
    desc: 'Lujo clásico',
    heading: { family: "'Playfair Display', serif", google: 'Playfair+Display:ital,wght@0,400;0,700;1,400' },
    body:    { family: "'Inter', sans-serif",        google: 'Inter:wght@300;400;600' },
  },
  {
    id: 'artesano',
    name: 'Artesano',
    desc: 'Bandas de puro',
    heading: { family: "'Cinzel', serif",            google: 'Cinzel:wght@400;600;700' },
    body:    { family: "'Raleway', sans-serif",       google: 'Raleway:wght@300;400;600' },
  },
  {
    id: 'havana',
    name: 'Havana',
    desc: 'Vintage colonial',
    heading: { family: "'Cormorant Garamond', serif", google: 'Cormorant+Garamond:ital,wght@0,300;0,600;1,300' },
    body:    { family: "'Lato', sans-serif",          google: 'Lato:wght@300;400;700' },
  },
  {
    id: 'reserve',
    name: 'Reserve',
    desc: 'Editorial moderno',
    heading: { family: "'DM Serif Display', serif",  google: 'DM+Serif+Display:ital@0;1' },
    body:    { family: "'DM Sans', sans-serif",       google: 'DM+Sans:wght@300;400;500' },
  },
];

const loadGoogleFont = (googleParam) => {
  const id = `gf-${googleParam.replace(/[^a-z0-9]/gi, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
  document.head.appendChild(link);
};

const DEFAULT_TOKENS = {
  '--ls-gold':         '#8B5E3C',
  '--ls-bg':           '#050505',
  '--ls-bg-card':      '#111111',
  '--ls-bg-surface':   '#1a1a1a',
  '--ls-text-primary': '#ffffff',
  '--ls-btn-primary':   '#8B5E3C',
  '--ls-btn-secondary': '#8B5E3C',
  '--ls-btn-ghost':     '#8B5E3C',
};

const TOKEN_LABELS = {
  '--ls-gold':         'Acento bronce',
  '--ls-bg':           'Fondo página',
  '--ls-bg-card':      'Fondo tarjetas',
  '--ls-bg-surface':   'Superficies',
  '--ls-text-primary': 'Texto principal',
};

const THEME_TOKEN_KEYS = ['--ls-gold', '--ls-bg', '--ls-bg-card', '--ls-bg-surface', '--ls-text-primary'];

const BTN_TOKEN_LABELS = {
  '--ls-btn-primary':   'Primario (fill)',
  '--ls-btn-secondary': 'Secundario (borde)',
  '--ls-btn-ghost':     'Ghost (hover)',
};

const BTN_TOKEN_KEYS = ['--ls-btn-primary', '--ls-btn-secondary', '--ls-btn-ghost'];

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const applyTokens = (tokens) => {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
  // Derivar tokens rgba desde el gold actual
  const { r, g, b } = hexToRgb(tokens['--ls-gold']);
  root.style.setProperty('--ls-gold-border',  `rgba(${r}, ${g}, ${b}, 0.15)`);
  root.style.setProperty('--ls-glass-border',  `rgba(${r}, ${g}, ${b}, 0.15)`);
  root.style.setProperty('--ls-gold-subtle',   `rgba(${r}, ${g}, ${b}, 0.05)`);
};

const LayoutControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation(); // Obtenemos la ruta actual

  // Extraemos la config activa y las funciones que ahora requieren el path
  const {
    currentConfig,
    toggleNavbar,
    toggleFooter,
    toggleHeader,
    toggleNavbarSticky
  } = useLayoutStore();

  // Desestructuramos para facilitar el uso en el JSX
  const { showNavbar, showFooter, showHeader, navbarSticky, headerData } = currentConfig;

  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem('ls-design-tokens');
      return saved ? JSON.parse(saved) : DEFAULT_TOKENS;
    } catch {
      return DEFAULT_TOKENS;
    }
  });

  useEffect(() => {
    applyTokens(tokens);
    localStorage.setItem('ls-design-tokens', JSON.stringify(tokens));
  }, [tokens]);

  const handleTokenChange = (prop, value) => {
    setTokens((prev) => ({ ...prev, [prop]: value }));
  };

  const resetTokens = () => {
    setTokens(DEFAULT_TOKENS);
    localStorage.removeItem('ls-design-tokens');
  };

  const [activePairing, setActivePairing] = useState(
    () => localStorage.getItem('ls-font-pairing') || 'legacy'
  );

  const applyPairing = (pairing) => {
    loadGoogleFont(pairing.heading.google);
    loadGoogleFont(pairing.body.google);
    document.documentElement.style.setProperty('--ls-font-heading', pairing.heading.family);
    document.documentElement.style.setProperty('--ls-font-body', pairing.body.family);
    setActivePairing(pairing.id);
    localStorage.setItem('ls-font-pairing', pairing.id);
  };

  // Restaurar pairing guardado al montar
  useEffect(() => {
    const saved = FONT_PAIRINGS.find(p => p.id === activePairing);
    if (saved) applyPairing(saved);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`cp-wrapper ${isOpen ? 'is-open' : ''}`}>
      <button className="cp-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronRight size={20} /> : <Settings size={20} className="spin-slow" />}
      </button>

      <div className="cp-content">
        <header className="cp-header">
          <Layout size={18} className="text-gold" />
          <span>UI Control Center</span>
        </header>

        <div className="cp-section">
          <p className="cp-label">Global Layout ({pathname})</p>
          
          {/* Pasamos pathname a cada toggle para que se guarde específicamente para esta página */}
          <div className="cp-toggle-item" onClick={() => toggleNavbar(pathname)}>
            <div className="d-flex align-items-center gap-2">
              <Eye size={16} />
              <span className={!showNavbar ? 'text-muted' : ''}>Navbar</span>
            </div>
            <div className={`cp-switch ${showNavbar ? 'active' : ''}`}></div>
          </div>

          <div className="cp-toggle-item" onClick={() => toggleFooter(pathname)}>
            <div className="d-flex align-items-center gap-2">
              <CreditCard size={16} />
              <span className={!showFooter ? 'text-muted' : ''}>Footer</span>
            </div>
            <div className={`cp-switch ${showFooter ? 'active' : ''}`}></div>
          </div>

          <div className="cp-toggle-item" onClick={() => toggleHeader(pathname)}>
            <div className="d-flex align-items-center gap-2">
              <Type size={16} />
              <span className={!showHeader ? 'text-muted' : ''}>Show Header</span>
            </div>
            <div className={`cp-switch ${showHeader ? 'active' : ''}`}></div>
          </div>
        </div>


        <div className="cp-section">
          <p className="cp-label">Navbar Settings</p>
          

          <div className={`cp-sub-card ${!showNavbar ? 'disabled' : ''}`}>
             <div className="cp-toggle-item" onClick={() => toggleNavbarSticky(pathname)}>
                <div className="d-flex align-items-center gap-2">
                  <Anchor size={16} />
                  <span>Sticky Mode</span>
                </div>
                <div className={`cp-switch ${navbarSticky ? 'active' : ''}`}></div>
              </div>
          </div>
        </div>

        <div className="cp-section">
          <div className="cp-label-row">
            <Palette size={12} />
            <p className="cp-label">Tema</p>
            <button className="cp-reset-btn" onClick={resetTokens} title="Restaurar defaults">
              <RotateCcw size={11} />
            </button>
          </div>

          {THEME_TOKEN_KEYS.map((prop) => (
            <div key={prop} className="cp-color-row">
              <span className="cp-color-label">{TOKEN_LABELS[prop]}</span>
              <input
                type="color"
                className="cp-color-input"
                value={tokens[prop]}
                onChange={(e) => handleTokenChange(prop, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="cp-section">
          <div className="cp-label-row">
            <Square size={12} />
            <p className="cp-label">Botones</p>
          </div>

          <div className="cp-btn-preview-row">
            <span className="cp-btn-preview cp-btn-preview--primary" style={{ background: tokens['--ls-btn-primary'], color: '#fff' }}>
              Primary
            </span>
            <span className="cp-btn-preview cp-btn-preview--secondary" style={{ borderColor: tokens['--ls-btn-secondary'], color: tokens['--ls-btn-secondary'] }}>
              Secondary
            </span>
            <span className="cp-btn-preview cp-btn-preview--ghost" style={{ color: tokens['--ls-btn-ghost'] }}>
              Ghost →
            </span>
          </div>

          {BTN_TOKEN_KEYS.map((prop) => (
            <div key={prop} className="cp-color-row">
              <span className="cp-color-label">{BTN_TOKEN_LABELS[prop]}</span>
              <input
                type="color"
                className="cp-color-input"
                value={tokens[prop]}
                onChange={(e) => handleTokenChange(prop, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="cp-section">
          <div className="cp-label-row">
            <Type size={12} />
            <p className="cp-label">Tipografía</p>
          </div>
          <div className="cp-pairing-grid">
            {FONT_PAIRINGS.map((pair) => (
              <button
                key={pair.id}
                className={`cp-pairing-card ${activePairing === pair.id ? 'active' : ''}`}
                onClick={() => applyPairing(pair)}
              >
                <span
                  className="cp-pairing-name"
                  style={{ fontFamily: pair.heading.family }}
                >
                  {pair.name}
                </span>
                <span className="cp-pairing-desc">{pair.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="cp-footer-info">
          <p className="cp-label">Page Data</p>
          <div className="cp-badge-status">
            {headerData?.title || 'No Title Set'}
          </div>
        </div>
      </div>

      <style>{`
        .cp-wrapper {
          position: fixed;
          right: -260px;
          top: 15%;
          width: 260px;
          max-height: 80vh;
          background: #0a0a0ae6;
          backdrop-filter: blur(15px);
          border: 1px solid #333;
          border-radius: 12px 0 0 12px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 99999;
          color: #eee;
          box-shadow: -10px 10px 40px rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
        }
        .cp-wrapper.is-open { right: 0; }
        .cp-trigger {
          position: absolute;
          left: -44px;
          top: 20px;
          width: 44px;
          height: 44px;
          background: #8b5e3c;
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px 0 0 10px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .cp-content {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }
        .cp-content::-webkit-scrollbar { width: 3px; }
        .cp-content::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .cp-content::-webkit-scrollbar-thumb:hover { background: #8b5e3c; }
        /* Landscape mobile — menos altura disponible */
        @media (max-height: 500px) {
          .cp-wrapper { top: 4%; max-height: 92vh; }
        }
        /* Pantallas muy pequeñas — panel más angosto */
        @media (max-width: 380px) {
          .cp-wrapper { width: 230px; right: -230px; }
          .cp-wrapper.is-open { right: 0; }
        }
        .cp-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 0.8rem;
          margin-bottom: 20px;
          color: #d4af37;
          text-transform: uppercase;
        }
        .cp-section { margin-bottom: 24px; }
        .cp-label {
          font-size: 0.55rem;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 0px;
          font-weight: 800;
          letter-spacing: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cp-sub-card {
          background: #151515;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #222;
          transition: 0.3s;
        }
        .cp-sub-card.disabled { opacity: 0.3; filter: grayscale(1); pointer-events: none; }
        .cp-toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .cp-switch {
          width: 30px;
          height: 15px;
          background: #333;
          border-radius: 10px;
          position: relative;
          transition: 0.3s;
        }
        .cp-switch::after {
          content: '';
          position: absolute;
          width: 11px;
          height: 11px;
          background: #fff;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: 0.3s;
        }
        .cp-switch.active { background: #d4af37; }
        .cp-switch.active::after { left: 17px; }
        .cp-badge-status {
          font-size: 0.65rem;
          color: #d4af37;
          background: rgba(212, 175, 55, 0.05);
          padding: 6px;
          border-radius: 6px;
          border: 1px dashed rgba(212, 175, 55, 0.3);
          text-align: center;
        }
        .cp-label-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .cp-label-row .cp-label { margin-bottom: 0; flex: 1; }
        .cp-reset-btn {
          background: none;
          border: 1px solid #333;
          color: #666;
          border-radius: 4px;
          padding: 2px 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: 0.2s;
        }
        .cp-reset-btn:hover { border-color: #d4af37; color: #d4af37; }
        .cp-color-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid #1a1a1a;
        }
        .cp-color-row:last-child { border-bottom: none; }
        .cp-color-label {
          font-size: 0.7rem;
          color: #aaa;
        }
        .cp-color-input {
          width: 28px;
          height: 22px;
          border: 1px solid #333;
          border-radius: 4px;
          background: none;
          cursor: pointer;
          padding: 1px;
        }
        .cp-color-input:hover { border-color: #8b5e3c; }
        .cp-btn-preview-row {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .cp-btn-preview {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid transparent;
          font-family: sans-serif;
        }
        .cp-btn-preview--primary {
          /* color y background vienen del inline style */
        }
        .cp-btn-preview--secondary {
          background: transparent;
          border-style: solid;
          border-width: 1px;
          /* borderColor y color vienen del inline style */
        }
        .cp-btn-preview--ghost {
          background: transparent;
          border-color: transparent;
          /* color viene del inline style */
        }
        .cp-pairing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .cp-pairing-card {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 10px 8px;
          cursor: pointer;
          text-align: left;
          transition: 0.2s;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .cp-pairing-card:hover { border-color: #444; }
        .cp-pairing-card.active {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.06);
        }
        .cp-pairing-name {
          font-size: 0.85rem;
          color: #eee;
          display: block;
        }
        .cp-pairing-card.active .cp-pairing-name { color: #d4af37; }
        .cp-pairing-desc {
          font-size: 0.58rem;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
        }
        .text-muted { color: #555; }
        .spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LayoutControlPanel;