import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supportedLanguages } from './config.js';
import { parseLocalePath } from './routing.js';
import { resources } from './resources.js';

i18n.use(initReactI18next).init({
  resources,
  lng: typeof window === 'undefined' ? 'es' : parseLocalePath(window.location.pathname).language,
  supportedLngs: supportedLanguages,
  fallbackLng: 'es',
  load: 'currentOnly',
  defaultNS: 'common',
  keySeparator: false,
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export default i18n;
