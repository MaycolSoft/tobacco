import { leaves } from '../data/leaves.js';
import { languages, supportedLanguages } from '../i18n/config.js';
import { localizePath, parseLocalePath } from '../i18n/routing.js';
import { translate } from '../i18n/translate.js';
import { getLeafCategories } from '../data/leafPresentation.js';
import { localizeLeaf } from '../i18n/localizeLeaf.js';

export const siteIdentity = {
  url: 'https://tabacaleratamboril.com.do',
  name: 'Tabacalera Tamboril',
  image: '/img/carousel-1.jpg',
};

export const seoRoutes = {
  '/': { key: 'home', index: true },
  '/leaf-library': { key: 'library', index: true },
  '/about': { key: 'about', index: true },
  '/menu': { key: 'menu', index: true },
  '/contact': { key: 'contact', index: true },
  '/reservation': { key: 'reservation', index: false },
  '/testimonial': { key: 'testimonial', index: true },
  '/login': { key: 'login', index: false },
  '/craft-your-cigar': { key: 'craft', index: false },
};

export function normalizeSiteUrl(value = '') {
  if (!value.trim()) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.origin : '';
  } catch { return ''; }
}

export function getLocalizedSeoPaths() {
  return supportedLanguages.flatMap(language => Object.keys(seoRoutes).map(path => localizePath(path, language)));
}

export function getSeo(pathname, publicUrl = '', explicitLanguage) {
  const parsed = parseLocalePath(pathname);
  const language = languages[explicitLanguage] ? explicitLanguage : parsed.language;
  const basePath = parsed.basePath;
  const route = seoRoutes[basePath] || { key: 'notFound', index: false };
  const t = id => translate(language, id);
  const page = {
    title: t(`seo:${route.key}.title`),
    description: t(`seo:${route.key}.description`),
    label: t(`seo:${route.key}.label`),
    language,
    index: route.index,
  };
  const path = localizePath(basePath, language);
  const origin = normalizeSiteUrl(publicUrl || siteIdentity.url);
  const url = origin ? `${origin}${path}` : '';
  const homeUrl = origin ? `${origin}${localizePath('/', language)}` : '';
  const categories = getLeafCategories(t);
  const alternates = origin && seoRoutes[basePath]
    ? [...supportedLanguages.map(code => ({ language: code, url: `${origin}${localizePath(basePath, code)}` })), { language: 'x-default', url: `${origin}${basePath}` }]
    : [];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': origin ? `${origin}/#organization` : '#organization', name: siteIdentity.name, ...(origin ? { url: `${origin}/`, logo: `${origin}/img/logo.png` } : {}) },
      { '@type': 'WebSite', '@id': origin ? `${origin}/#website` : '#website', name: siteIdentity.name, ...(origin ? { url: `${origin}/` } : {}), inLanguage: supportedLanguages, publisher: { '@id': origin ? `${origin}/#organization` : '#organization' } },
      { '@type': basePath === '/leaf-library' ? 'CollectionPage' : 'WebPage', name: page.title, description: page.description, inLanguage: language, ...(url ? { '@id': `${url}#webpage`, url, isPartOf: { '@id': `${origin}/#website` } } : {}),
        ...(basePath === '/leaf-library' ? { mainEntity: {
          '@type': 'ItemList', name: t('seo:libraryList'), numberOfItems: leaves.length,
          itemListElement: leaves.map((leaf, index) => ({ '@type': 'ListItem', position: index + 1, item: {
            '@type': 'Thing', name: `${categories[leaf.category].label} · ${leaf.name}`, description: localizeLeaf(leaf, t).description,
            ...(origin ? { url: `${url}#${leaf.id}`, image: new URL(leaf.thumbImg, origin).href } : {}),
          } })),
        } } : {}),
      },
      ...(origin && seoRoutes[basePath] && basePath !== '/' ? [{ '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('seo:home.label'), item: homeUrl },
        { '@type': 'ListItem', position: 2, name: page.label, item: url },
      ] }] : []),
    ],
  };
  return { ...page, path, basePath, url, schema, alternates, ogLocale: languages[language].ogLocale,
    alternateLocales: supportedLanguages.filter(code => code !== language).map(code => languages[code].ogLocale),
    image: `${origin}${siteIdentity.image}`, imageAlt: t('seo:imageAlt'), manifest: `/site.${language}.webmanifest`,
    robots: page.index ? 'index, follow, max-image-preview:large' : 'noindex, follow' };
}
