import { visualProfiles } from './visualProfiles.js';
import { FONT_PAIRINGS } from '../components/control-center/controlCenterConfig.js';

export const THEME_TOKEN_LABELS = {
  '--ls-gold': 'Acento de marca',
  '--ls-bg': 'Fondo de página',
  '--ls-bg-card': 'Tarjetas',
  '--ls-bg-surface': 'Paneles y superficies',
  '--ls-text-primary': 'Títulos y texto principal',
  '--ls-text-secondary': 'Párrafos y descripciones',
  '--ls-text-dim': 'Etiquetas y texto auxiliar',
};
export const BUTTON_TOKEN_LABELS = {
  '--ls-btn-primary': 'Primario · relleno',
  '--ls-btn-secondary': 'Secundario · borde y texto',
  '--ls-btn-ghost': 'Enlaces · acento al pasar',
};
const keys = [...Object.keys(THEME_TOKEN_LABELS), ...Object.keys(BUTTON_TOKEN_LABELS), '--ls-video-bg'];
const isHex = value => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
const storageKey = 'ls-design-tokens';
const legacyDefaults = {
  '--ls-gold': '#8b5e3c', '--ls-bg': '#050505', '--ls-bg-card': '#111111', '--ls-bg-surface': '#1a1a1a',
  '--ls-text-primary': '#ffffff', '--ls-btn-primary': '#8b5e3c', '--ls-btn-secondary': '#8b5e3c', '--ls-btn-ghost': '#8b5e3c',
};

export function readBaseTokens() {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(keys.map(key => [key, style.getPropertyValue(key.replace('--ls-', '--ls-base-')).trim()]));
}

const validPairing = id => FONT_PAIRINGS.some(pair => pair.id === id);
const filterTokens = values => Object.fromEntries(keys.filter(key => isHex(values?.[key])).map(key => [key, values[key]]));
export const defaultAppearance = () => ({ version: 3, profileId: 'base', tokenOverrides: {}, fontPairingOverride: null });

export function readAppearance() {
  let record;
  try { record = JSON.parse(localStorage.getItem(storageKey)); } catch { /* Use defaults or the legacy font selection. */ }
  if (record?.version === 3) {
    return {
      ...defaultAppearance(),
      profileId: Object.hasOwn(visualProfiles, record.profileId) ? record.profileId : 'base',
      tokenOverrides: filterTokens(record.tokenOverrides),
      fontPairingOverride: validPairing(record.fontPairingOverride) ? record.fontPairingOverride : null,
    };
  }
  const saved = record?.version === 2 ? record.tokens : record;
  const tokenOverrides = filterTokens(saved);
  // Preserve the existing unversioned migration behavior. V2 values are all retained.
  if (record?.version !== 2) {
    keys.forEach(key => {
      if (tokenOverrides[key]?.toLowerCase() === legacyDefaults[key]) delete tokenOverrides[key];
    });
  }
  let fontPairingOverride = null;
  try {
    const savedFont = localStorage.getItem('ls-font-pairing');
    if (validPairing(savedFont)) fontPairingOverride = savedFont;
  } catch { /* Appearance remains usable when storage is unavailable. */ }
  return { ...defaultAppearance(), tokenOverrides, fontPairingOverride };
}

export function resolveAppearance(defaults, appearance) {
  const profile = visualProfiles[appearance.profileId] || visualProfiles.base;
  return {
    tokens: { ...defaults, ...profile.tokens, ...appearance.tokenOverrides },
    fontPairingId: appearance.fontPairingOverride || profile.fontPairingId,
  };
}

export function saveAppearance(appearance) {
  try { localStorage.setItem(storageKey, JSON.stringify(appearance)); } catch { /* Preview still works. */ }
}

// Choose the more readable of two ink colors for a customizable filled button.
export function foregroundFor(hex) {
  const luminance = color => {
    const channels = [1, 3, 5].map(offset => {
      const value = parseInt(color.slice(offset, offset + 2), 16) / 255;
      return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
    });
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const background = luminance(isHex(hex) ? hex : '#C7A479');
  const dark = '#16140F';
  const light = '#FFFDF8';
  const contrast = color => {
    const value = luminance(color);
    return (Math.max(background, value) + .05) / (Math.min(background, value) + .05);
  };
  return contrast(dark) >= contrast(light) ? dark : light;
}

export function applyTokens(tokens) {
  const root = document.documentElement;
  keys.forEach(key => { if (isHex(tokens[key])) root.style.setProperty(key, tokens[key]); });
  // These are derived in CSS, including when the accent or background changes.
  ['--ls-gold-muted', '--ls-gold-border', '--ls-glass-border', '--ls-gold-subtle'].forEach(key => root.style.removeProperty(key));
  root.style.setProperty('--ls-text-on-gold', foregroundFor(tokens['--ls-gold']));
  root.style.setProperty('--ls-text-on-primary', foregroundFor(tokens['--ls-btn-primary']));
}
