import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importante para la persistencia por ruta
import { useLayoutStore } from '@/store/useLayoutStore';
import { useAnimationPerfStore } from '@/store/useAnimationPerfStore';
import { ANIMATION_PERF_LIMITS } from '@/config/animationPerformance';
import { clearFrameCache, enforceCacheBudget } from '@/lib/frameCache';
import { getFrameDiagnostics } from '@/lib/frameScheduler';
import { THEME_TOKEN_LABELS, BUTTON_TOKEN_LABELS, readBaseTokens, readSavedTokens, applyTokens, foregroundFor } from '@/config/designTheme';
import {
  Settings, Eye, Layout, CreditCard,
  ChevronRight, Anchor, Type, Palette, RotateCcw, Square, Gauge
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

const TOKEN_LABELS = THEME_TOKEN_LABELS;
const THEME_TOKEN_KEYS = Object.keys(TOKEN_LABELS);
const BTN_TOKEN_LABELS = BUTTON_TOKEN_LABELS;
const BTN_TOKEN_KEYS = Object.keys(BTN_TOKEN_LABELS);

const MB = 1024 * 1024;
const formatMb = (bytes) => (bytes === null || bytes === undefined ? '—' : `${Math.round(bytes / MB)} MB`);

// Controles numéricos de la sección Animation Performance (herramienta interna).
const PERF_RANGES = [
  { key: 'concurrency', label: 'Loader concurrency', step: 1 },
  { key: 'decodeConcurrency', label: 'Decode concurrency', step: 1 },
  { key: 'backgroundSlots', label: 'Background preload slots', step: 1 },
  { key: 'prefetchAhead', label: 'Prefetch ahead', step: 5 },
  { key: 'prefetchBehind', label: 'Prefetch behind', step: 5 },
  { key: 'decodedFrameLimit', label: 'Decoded frame limit', step: 2 },
  { key: 'cacheBudgetBytes', label: 'Cache budget', step: 256 * MB, format: formatMb },
];

const PERF_STATS = [
  ['profile', 'Source profile'],
  ['frameCount', 'Frame count'],
  ['requestedFrame', 'Requested frame'],
  ['renderedFrame', 'Rendered frame'],
  ['renderedSource', 'Rendered frame source'],
  ['frameLag', 'Frame lag'],
  ['maxLag', 'Max lag'],
  ['motion', 'Motion'],
  ['direction', 'Direction'],
  ['velocity', 'Scroll speed (f/s)'],
  ['stride', 'Stride'],
  ['lead', 'Lead (frames)'],
  ['lastStableTarget', 'Last stable target'],
  ['nearestAhead', 'Decoded nearest ahead'],
  ['nearestBehind', 'Decoded nearest behind'],
  ['decodedFrames', 'Decoded frames'],
  ['prefetchedBlobs', 'Blob-memory frames'],
  ['persistentCachedFrames', 'Persistent cached frames'],
  ['queueLength', 'Queued frames'],
  ['decodeQueueLength', 'Decode queue'],
  ['activeDownloads', 'Active downloads'],
  ['activeDownloadKinds', 'Critical / prefetch / bg'],
  ['activeCacheReads', 'Active cache reads'],
  ['activeDecodes', 'Active decodes'],
  ['backgroundPosition', 'Background preload position'],
  ['backgroundDownloads', 'Background downloads'],
  ['framesPerSecond', 'Delivered frames/s'],
  ['throughputMbps', 'Network Mbps'],
  ['avgLatencyMs', 'Avg load ms'],
  ['avgDecodeMs', 'Avg decode ms'],
  ['exactRenders', 'Exact renders'],
  ['fallbackRenders', 'Fallback renders'],
  ['persistentHits', 'Persistent cache hits'],
  ['memoryHits', 'Memory hits'],
  ['schedulerNetworkDownloads', 'Network downloads'],
  ['cancelledDownloads', 'Cancelled downloads'],
  ['failedFrames', 'Failed frames'],
  ['retries', 'Retries'],
  ['cacheWriteFailures', 'Cache write failures'],
  ['approxCachedBytes', 'Approx. cached', formatMb],
];

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

  const [defaultTokens] = useState(readBaseTokens);
  const [tokens, setTokens] = useState(() => readSavedTokens(defaultTokens));

  useEffect(() => { applyTokens(tokens); }, [tokens]);

  const handleTokenChange = (prop, value) => {
    setTokens(prev => {
      const updated = { ...prev, [prop]: value };
      if (prop === '--ls-gold') {
        BTN_TOKEN_KEYS.forEach(key => {
          if (prev[key].toLowerCase() === prev['--ls-gold'].toLowerCase()) updated[key] = value;
        });
      }
      return updated;
    });
  };

  const resetTokens = () => setTokens({ ...defaultTokens });

  // Animation Performance: ajustes internos de ScrollVideo (persisten vía zustand, como el layout)
  const { config: perfConfig, updateConfig: updatePerfConfig, resetConfig: resetPerfConfig } = useAnimationPerfStore();
  const [perfStats, setPerfStats] = useState(null);
  const [cacheStatus, setCacheStatus] = useState('');

  // Las estadísticas solo se consultan mientras el panel está abierto
  useEffect(() => {
    if (!isOpen) return;
    enforceCacheBudget(); // calcula el tamaño aproximado de la caché
    const update = () => setPerfStats(getFrameDiagnostics());
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClearFrameCache = async () => {
    setCacheStatus('Limpiando…');
    try {
      await clearFrameCache();
      setCacheStatus('Caché de animación eliminada.');
    } catch (error) {
      setCacheStatus(`No se pudo limpiar: ${error.message}`);
    }
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
      <button className="cp-trigger" aria-label="Abrir o cerrar el UI Kit" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
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
            <button className="cp-reset-btn" onClick={resetTokens} title="Restaurar paleta Tabaco editorial" aria-label="Restaurar paleta Tabaco editorial">
              <RotateCcw size={11} />
            </button>
          </div>

          <p className="cp-theme-note">Base: Tabaco editorial. Los colores se comparten entre la biblioteca y el configurador.</p>
          <button className="cp-base-button" onClick={resetTokens}>Aplicar paleta base</button>
          {THEME_TOKEN_KEYS.map((prop) => (
            <div key={prop} className="cp-color-row">
              <span className="cp-color-label">{TOKEN_LABELS[prop]}</span>
              <code className="cp-color-value">{tokens[prop]}</code>
              <input
                type="color"
                className="cp-color-input"
                aria-label={TOKEN_LABELS[prop] || BTN_TOKEN_LABELS[prop]}
                title={tokens[prop]}
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
            <span className="cp-btn-preview cp-btn-preview--primary" style={{ background: tokens['--ls-btn-primary'], color: foregroundFor(tokens['--ls-btn-primary']) }}>
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
              <code className="cp-color-value">{tokens[prop]}</code>
              <input
                type="color"
                className="cp-color-input"
                aria-label={TOKEN_LABELS[prop] || BTN_TOKEN_LABELS[prop]}
                title={tokens[prop]}
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

        <div className="cp-section">
          <p className="cp-label">Escena del video</p>
          <label className="cp-color-row">
            <span className="cp-color-label">Fondo de los fotogramas</span>
            <input type="color" className="cp-color-input" value={tokens['--ls-video-bg']} title={tokens['--ls-video-bg']} onChange={event => handleTokenChange('--ls-video-bg', event.target.value)} />
          </label>
          <p className="cp-theme-note">El tono original se conserva para integrar las imágenes del video.</p>
        </div>

        <div className="cp-section cp-perf-panel">
          <div className="cp-label-row">
            <Gauge size={12} />
            <p className="cp-label">Animation Performance</p>
            <button className="cp-reset-btn" onClick={resetPerfConfig} title="Restaurar valores por defecto" aria-label="Restaurar valores por defecto de rendimiento">
              <RotateCcw size={11} />
            </button>
          </div>

          <p className="cp-theme-note">Herramienta interna para pruebas. Los visitantes siempre usan la fuente optimizada.</p>

          <p className="cp-label">Frame source</p>
          <div className="cp-pairing-grid cp-perf-grid">
            {[
              { id: 'optimized', name: 'Optimized', desc: 'Por defecto' },
              { id: 'original', name: 'Original', desc: 'Solo depuración' },
            ].map((source) => (
              <button
                key={source.id}
                className={`cp-pairing-card ${perfConfig.sourceMode === source.id ? 'active' : ''}`}
                onClick={() => updatePerfConfig({ sourceMode: source.id })}
              >
                <span className="cp-pairing-name">{source.name}</span>
                <span className="cp-pairing-desc">{source.desc}</span>
              </button>
            ))}
          </div>

          {PERF_RANGES.map(({ key, label, step, format }) => (
            <label key={key} className="cp-color-row">
              <span className="cp-color-label">{label}</span>
              <code className="cp-color-value">{format ? format(perfConfig[key]) : perfConfig[key]}</code>
              <input
                type="range"
                className="cp-perf-range"
                min={ANIMATION_PERF_LIMITS[key][0]}
                max={ANIMATION_PERF_LIMITS[key][1]}
                step={step}
                value={perfConfig[key]}
                onChange={(event) => updatePerfConfig({ [key]: Number(event.target.value) })}
              />
            </label>
          ))}

          <div className="cp-toggle-item" onClick={() => updatePerfConfig({ showLoaderStats: !perfConfig.showLoaderStats })}>
            <div className="d-flex align-items-center gap-2">
              <Eye size={16} />
              <span className={!perfConfig.showLoaderStats ? 'text-muted' : ''}>Show loader stats</span>
            </div>
            <div className={`cp-switch ${perfConfig.showLoaderStats ? 'active' : ''}`}></div>
          </div>

          <button className="cp-base-button cp-perf-clear" onClick={handleClearFrameCache}>Clear animation cache</button>
          {cacheStatus && <p className="cp-theme-note">{cacheStatus}</p>}

          {perfStats && (
            <div className="cp-sub-card">
              {PERF_STATS.map(([key, label, format]) => (
                <div key={key} className="cp-color-row">
                  <span className="cp-color-label">{label}</span>
                  <code className="cp-color-value">{format ? format(perfStats[key]) : (perfStats[key] ?? '—')}</code>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cp-footer-info">
          <p className="cp-label">Page Data</p>
          <div className="cp-badge-status">
            {headerData?.title || 'No Title Set'}
          </div>
        </div>
      </div>

      <style>{`
        .cp-color-value { font-size: 9px; color: #b8bbaf; background: none; margin-left: auto; margin-right: 7px; }
        .cp-color-row { gap: 5px; flex-wrap: wrap; }
        .cp-color-label { max-width: 135px; }
        .cp-theme-note { color: #b8bbaf; font-size: 11px; line-height: 1.6; margin: 10px 0; }
        .cp-base-button { width: 100%; min-height: 38px; background: #c7a479; color: #171a16; border: 0; border-radius: 5px; font-size: 11px; cursor: pointer; margin-bottom: 12px; }
        .cp-wrapper button:focus-visible, .cp-wrapper input:focus-visible { outline: 2px solid #c7a479; outline-offset: 3px; }
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
          background: #c7a479;
          border: none;
          color: #171a16;
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
          color: #c7a479;
          text-transform: uppercase;
        }
        .cp-section { margin-bottom: 24px; }
        .cp-label {
          font-size: 0.55rem;
          text-transform: uppercase;
          color: #aeb5ab;
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
        .cp-switch.active { background: #c7a479; }
        .cp-switch.active::after { left: 17px; }
        .cp-badge-status {
          font-size: 0.65rem;
          color: #c7a479;
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
          color: #aeb5ab;
          border-radius: 4px;
          padding: 2px 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: 0.2s;
        }
        .cp-reset-btn:hover { border-color: #c7a479; color: #c7a479; }
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
        .cp-color-input:hover { border-color: #c7a479; }
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
          border-color: #c7a479;
          background: rgba(212, 175, 55, 0.06);
        }
        .cp-pairing-name {
          font-size: 0.85rem;
          color: #eee;
          display: block;
        }
        .cp-pairing-card.active .cp-pairing-name { color: #c7a479; }
        .cp-pairing-desc {
          font-size: 0.58rem;
          color: #aeb5ab;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
        }
        .cp-perf-panel {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 12px;
        }
        .cp-perf-panel .cp-sub-card { background: #0c0c0c; margin-top: 12px; }
        .cp-perf-grid { margin: 8px 0 10px; }
        .cp-perf-range { width: 100%; accent-color: #c7a479; cursor: pointer; }
        .cp-perf-clear { margin: 12px 0 0; }
        .cp-wrapper .text-muted { color: #aeb5ab !important; }
        .spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LayoutControlPanel;
