import { useLayoutEffect } from 'react';
import { Link as RouterLink, Navigate as RouterNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { languageStorageKey } from './config.js';
import { localizePath, parseLocalePath } from './routing.js';
import { useLocaleLocation } from './navigationHooks.js';

export function Link({ to, ...props }) {
  const { pathname } = useLocaleLocation();
  return <RouterLink to={localizePath(to, parseLocalePath(pathname).language)} {...props} />;
}

export function Navigate({ to, ...props }) {
  const { pathname } = useLocaleLocation();
  return <RouterNavigate to={localizePath(to, parseLocalePath(pathname).language)} {...props} />;
}

export function LanguageSync() {
  const { pathname } = useRouterLocation();
  const { i18n } = useTranslation();
  const { language } = parseLocalePath(pathname);
  useLayoutEffect(() => {
    if (i18n.resolvedLanguage !== language) i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
    try { localStorage.setItem(languageStorageKey, language); } catch { /* URL remains authoritative. */ }
  }, [language, i18n]);
  return null;
}
