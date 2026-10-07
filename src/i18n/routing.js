import { defaultLanguage, languages, supportedLanguages } from './config.js';

export function parseLocalePath(pathname = '/') {
  const segment = pathname.split('/')[1];
  const language = supportedLanguages.includes(segment) ? segment : defaultLanguage;
  const basePath = supportedLanguages.includes(segment)
    ? pathname.slice(segment.length + 1) || '/'
    : pathname;
  return { language, basePath: basePath === '/' ? '/' : basePath.replace(/\/+$/, '') };
}

export function localizePath(target, language = defaultLanguage) {
  if (typeof target === 'object' && target !== null) {
    return { ...target, pathname: localizePath(target.pathname || '/', language) };
  }
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//') || /^\/(?:assets|img|lib|css|js)(?:\/|$)/.test(target)) return target;
  const match = target.match(/^([^?#]*)(.*)$/);
  const { basePath } = parseLocalePath(match[1]);
  const prefix = (languages[language] || languages[defaultLanguage]).prefix;
  return `${prefix}${basePath === '/' && prefix ? '' : basePath}${match[2]}`;
}
