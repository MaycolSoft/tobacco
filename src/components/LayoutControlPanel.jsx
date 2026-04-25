import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Importante para la persistencia por ruta
import { useLayoutStore } from '@/store/useLayoutStore';
import { 
  Settings, Eye, Layout, CreditCard, 
  ChevronRight, Anchor, Type 
} from 'lucide-react';

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
          background: #0a0a0ae6;
          backdrop-filter: blur(15px);
          border: 1px solid #333;
          border-radius: 12px 0 0 12px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 99999;
          color: #eee;
          box-shadow: -10px 10px 40px rgba(0,0,0,0.8);
        }
        .cp-wrapper.is-open { right: 0; }
        .cp-trigger {
          position: absolute;
          left: -44px;
          top: 20px;
          width: 44px;
          height: 44px;
          background: #d4af37;
          border: none;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px 0 0 10px;
          cursor: pointer;
        }
        .cp-content { padding: 20px; }
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
        .text-muted { color: #555; }
        .spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LayoutControlPanel;