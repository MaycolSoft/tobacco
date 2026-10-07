import { getSeo, getLocalizedSeoPaths, siteIdentity } from '../src/config/seoConfig.js';
import { supportedLanguages } from '../src/i18n/config.js';
import { localizePath } from '../src/i18n/routing.js';
import { translate } from '../src/i18n/translate.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function renderHead(path, siteUrl) {
  const seo = getSeo(path, siteUrl);
  const meta = (key, value, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escapeHtml(value)}" />`;
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta('description', seo.description), meta('robots', seo.robots),
    ...(seo.url ? [`<link rel="canonical" href="${escapeHtml(seo.url)}" />`, meta('og:url', seo.url, true)] : []),
    ...seo.alternates.map(alternate => `<link rel="alternate" hreflang="${alternate.language}" href="${escapeHtml(alternate.url)}" />`),
    meta('og:type', 'website', true), meta('og:site_name', siteIdentity.name, true),
    meta('og:title', seo.title, true), meta('og:description', seo.description, true),
    meta('og:locale', seo.ogLocale, true), ...seo.alternateLocales.map(locale => meta('og:locale:alternate', locale, true)),
    meta('og:image', seo.image, true), meta('og:image:alt', seo.imageAlt, true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', seo.title),
    meta('twitter:description', seo.description), meta('twitter:image', seo.image), meta('twitter:image:alt', seo.imageAlt),
    `<script id="site-structured-data" type="application/ld+json">${JSON.stringify(seo.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

function renderPage(html, path, siteUrl) {
  const seo = getSeo(path, siteUrl);
  return html
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n    ${renderHead(path, siteUrl)}\n    <!-- seo:end -->`)
    .replace(/<html lang="[^"]+">/, `<html lang="${seo.language}">`)
    .replace(/<link rel="manifest" href="[^"]+"\s*\/>/, `<link rel="manifest" href="${seo.manifest}" />`);
}

function renderManifest(language) {
  return JSON.stringify({
    name: siteIdentity.name, short_name: 'Tamboril', description: translate(language, 'seo:manifest.description'),
    lang: language, start_url: localizePath('/', language), scope: '/', display: 'browser',
    background_color: '#0F1110', theme_color: '#0F1110',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }, null, 2);
}

// Route-specific metadata shells; the React body remains client-rendered.
export default function seoPlugin(siteUrl) {
  return {
    name: 'tamboril-route-seo',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const language = request.url?.match(/^\/site\.(es|en|fr|zh-CN)\.webmanifest(?:\?.*)?$/)?.[1];
        if (!language) return next();
        response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
        response.end(renderManifest(language));
      });
    },
    transformIndexHtml: { order: 'post', handler: html => renderPage(html, '/', siteUrl) },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const entry = bundle['index.html'];
        if (!entry || entry.type !== 'asset') this.error('No se encontró index.html para generar los metadatos por ruta.');
        const html = String(entry.source);
        const paths = getLocalizedSeoPaths();
        for (const path of paths.filter(path => path !== '/')) {
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: renderPage(html, path, siteUrl) });
        }
        for (const language of supportedLanguages) {
          const path = localizePath('/404', language);
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: renderPage(html, path, siteUrl) });
          this.emitFile({ type: 'asset', fileName: `site.${language}.webmanifest`, source: renderManifest(language) });
        }
        const origin = new URL(getSeo('/', siteUrl).url).origin;
        const urls = paths.map(path => getSeo(path, siteUrl)).filter(page => page.index).map(page => {
          const alternates = page.alternates.map(alternate => `    <xhtml:link rel="alternate" hreflang="${alternate.language}" href="${escapeHtml(alternate.url)}" />`).join('\n');
          return `  <url><loc>${escapeHtml(page.url)}</loc>\n${alternates}\n  </url>`;
        });
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n` });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n` });
      },
    },
  };
}
