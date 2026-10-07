export const languages = {
  es: { name: 'Español', locale: 'es-DO', ogLocale: 'es_DO', prefix: '' },
  en: { name: 'English', locale: 'en-US', ogLocale: 'en_US', prefix: '/en' },
  fr: { name: 'Français', locale: 'fr-FR', ogLocale: 'fr_FR', prefix: '/fr' },
  'zh-CN': { name: '简体中文', locale: 'zh-CN', ogLocale: 'zh_CN', prefix: '/zh-CN' },
};
export const supportedLanguages = Object.keys(languages);
export const defaultLanguage = 'es';
export const languageStorageKey = 'tamboril-language';
