import { useCallback, useContext, useMemo } from 'react';
import { useLocation as useRouterLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { LocaleLocationContext } from './locationContext.js';
import { localizePath, parseLocalePath } from './routing.js';

export function useLocaleLocation() {
  const scopedLocation = useRouterLocation();
  const actualLocation = useContext(LocaleLocationContext);
  return actualLocation || scopedLocation;
}

// Keep route identity stable between language versions so pages retain local state.
export function useLocation() {
  const location = useLocaleLocation();
  return { ...location, pathname: parseLocalePath(location.pathname).basePath };
}

export function useNavigate() {
  const navigate = useRouterNavigate();
  const { pathname } = useLocaleLocation();
  const { language } = parseLocalePath(pathname);
  return useCallback((to, options) => navigate(typeof to === 'number' ? to : localizePath(to, language), options), [navigate, language]);
}

// Native useSearchParams would resolve relative navigation against the base route.
export function useSearchParams() {
  const location = useLocaleLocation();
  const navigate = useRouterNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const setParams = useCallback((next, options) => {
    const value = typeof next === 'function' ? next(new URLSearchParams(location.search)) : next;
    const search = new URLSearchParams(value).toString();
    navigate(`${location.pathname}${search ? `?${search}` : ''}${location.hash}`, options);
  }, [location.pathname, location.search, location.hash, navigate]);
  return [params, setParams];
}

