import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import FrameVariantsModal from '@/components/FrameVariantsModal';
import UIControlCenterModal from '@/components/control-center/UIControlCenterModal';
import { FONT_PAIRINGS } from '@/components/control-center/controlCenterConfig';
import { readBaseTokens, readAppearance, resolveAppearance, saveAppearance, defaultAppearance, applyTokens } from '@/config/designTheme';
import '@/styles/ui-control-center.css';

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
  const [appearance, setAppearance] = useState(readAppearance);
  const { tokens, fontPairingId: activePairing } = resolveAppearance(defaultTokens, appearance);

  useEffect(() => { applyTokens(tokens); }, [tokens]);
  useEffect(() => { saveAppearance(appearance); }, [appearance]);
  useEffect(() => {
    const pairing = FONT_PAIRINGS.find(pair => pair.id === activePairing);
    loadGoogleFont(pairing.heading.google);
    loadGoogleFont(pairing.body.google);
    document.documentElement.style.setProperty('--ls-font-heading', pairing.heading.family);
    document.documentElement.style.setProperty('--ls-font-body', pairing.body.family);
  }, [activePairing]);

  const handleTokenChange = (prop, value) => setAppearance(prev => ({
    ...prev, tokenOverrides: { ...prev.tokenOverrides, [prop]: value },
  }));
  const resetToken = prop => setAppearance(prev => {
    const tokenOverrides = { ...prev.tokenOverrides };
    delete tokenOverrides[prop];
    return { ...prev, tokenOverrides };
  });
  const selectProfile = profileId => setAppearance({ ...defaultAppearance(), profileId });
  const resetProfile = () => setAppearance(prev => ({ ...defaultAppearance(), profileId: prev.profileId }));
  const applyPairing = pairing => setAppearance(prev => ({ ...prev, fontPairingOverride: pairing.id }));
  const resetPairing = () => setAppearance(prev => ({ ...prev, fontPairingOverride: null }));

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
        theme={{ tokens, defaultTokens, appearance, onTokenChange: handleTokenChange, onResetToken: resetToken,
          onSelectProfile: selectProfile, onResetProfile: resetProfile, activePairing, onApplyPairing: applyPairing, onResetPairing: resetPairing }}
      />

      <FrameVariantsModal open={variantsOpen} onClose={() => setVariantsOpen(false)} />
    </>
  );
};

export default LayoutControlPanel;
