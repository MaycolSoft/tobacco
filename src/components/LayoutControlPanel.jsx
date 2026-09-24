import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import FrameVariantsModal from '@/components/FrameVariantsModal';
import UIControlCenterModal from '@/components/control-center/UIControlCenterModal';
import { FONT_PAIRINGS } from '@/components/control-center/controlCenterConfig';
import { BUTTON_TOKEN_LABELS, readBaseTokens, readSavedTokens, applyTokens } from '@/config/designTheme';
import '@/styles/ui-control-center.css';

const BTN_TOKEN_KEYS = Object.keys(BUTTON_TOKEN_LABELS);

const loadGoogleFont = (googleParam) => {
  const id = `gf-${googleParam.replace(/[^a-z0-9]/gi, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
  document.head.appendChild(link);
};

// Always mounted in App: it restores the saved theme tokens and font pairing on load,
// independently of whether the Control Center modal is open.
const LayoutControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [variantsOpen, setVariantsOpen] = useState(false);

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
    <>
      <button type="button" className="cc-trigger" aria-label="Open UI Control Center" aria-haspopup="dialog" aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}>
        <Settings size={18} />
      </button>

      <UIControlCenterModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenVariants={() => setVariantsOpen(true)}
        theme={{ tokens, onTokenChange: handleTokenChange, onResetTokens: resetTokens, activePairing, onApplyPairing: applyPairing }}
      />

      <FrameVariantsModal open={variantsOpen} onClose={() => setVariantsOpen(false)} />
    </>
  );
};

export default LayoutControlPanel;
