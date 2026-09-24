import { createElement, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Gauge, LayoutTemplate, Palette, Video, X } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import LayoutTab from './LayoutTab';
import ThemeTypographyTab from './ThemeTypographyTab';
import VideoTab from './VideoTab';
import PerformanceTab from './PerformanceTab';

const TABS = [
  { id: 'layout', label: 'Layout', icon: LayoutTemplate },
  { id: 'theme', label: 'Theme & Typography', icon: Palette },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'performance', label: 'Performance', icon: Gauge },
];

export default function UIControlCenterModal({ open, onClose, theme, onOpenVariants }) {
  const dialogRef = useRef(null);
  const tabRefs = useRef({});
  const baseId = useId();
  const [activeTab, setActiveTab] = useState('layout');
  useBodyScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onTabKeyDown = (event) => {
    const index = TABS.findIndex(tab => tab.id === activeTab);
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const tab = TABS[(next + TABS.length) % TABS.length];
    setActiveTab(tab.id);
    tabRefs.current[tab.id]?.focus();
  };

  return createPortal(
    <dialog ref={dialogRef} className="cc-dialog" aria-labelledby={`${baseId}-title`} aria-describedby={`${baseId}-desc`}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      {open && <div className="cc-shell">
        <header className="cc-header">
          <div className="cc-title">
            <h2 id={`${baseId}-title`}>UI Control Center</h2>
            <p id={`${baseId}-desc`}>Configure layout, appearance and animation tools.</p>
          </div>
          <button type="button" className="cc-icon-btn cc-close" onClick={onClose} aria-label="Close UI Control Center"><X size={18} /></button>
        </header>

        <div className="cc-tabs" role="tablist" aria-label="Control Center sections" onKeyDown={onTabKeyDown}>
          {TABS.map(({ id, label, icon }) => (
            <button key={id} type="button" role="tab" id={`${baseId}-tab-${id}`} aria-controls={`${baseId}-panel`}
              aria-selected={activeTab === id} tabIndex={activeTab === id ? 0 : -1}
              ref={element => { tabRefs.current[id] = element; }} onClick={() => setActiveTab(id)}>
              {createElement(icon, { size: 14, 'aria-hidden': true })} {label}
            </button>
          ))}
        </div>

        <div className="cc-body" role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${activeTab}`} tabIndex={0}>
          {activeTab === 'layout' && <LayoutTab />}
          {activeTab === 'theme' && <ThemeTypographyTab {...theme} />}
          {activeTab === 'video' && <VideoTab {...theme} onOpenVariants={onOpenVariants} />}
          {activeTab === 'performance' && <PerformanceTab />}
        </div>
      </div>}
    </dialog>, document.body
  );
}
