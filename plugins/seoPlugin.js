import { getSeo, seoRoutes, siteIdentity } from '../src/config/seoConfig.js';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function renderHead(path, siteUrl) {
  const seo = getSeo(path, siteUrl);
  const meta = (key, value, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escapeHtml(value)}" />`;
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta('description', seo.description), meta('robots', seo.robots),
    ...(seo.url ? [`<link rel="canonical" href="${escapeHtml(seo.url)}" />`, meta('og:url', seo.url, true)] : []),
    meta('og:type', 'website', true), meta('og:site_name', siteIdentity.name, true),
    meta('og:title', seo.title, true), meta('og:description', seo.description, true),
    meta('og:locale', seo.language === 'es' ? 'es_DO' : 'en_US', true),
    meta('og:image', seo.image, true), meta('og:image:alt', siteIdentity.imageAlt, true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', seo.title),
    meta('twitter:description', seo.description), meta('twitter:image', seo.image), meta('twitter:image:alt', siteIdentity.imageAlt),
    `<script id="site-structured-data" type="application/ld+json">${JSON.stringify(seo.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

function renderPage(html, path, siteUrl) {
  return html
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n    ${renderHead(path, siteUrl)}\n    <!-- seo:end -->`)
    .replace(/<html lang="[^"]+">/, `<html lang="${getSeo(path, siteUrl).language}">`);
}

// Keep metadata in initial HTML for crawlers that do not execute JavaScript.
// This emits route-specific HTML shells, not a server-rendered copy of the React UI.
export default function seoPlugin(siteUrl) {
  return {
    name: 'tamboril-route-seo',
    enforce: 'post',
    transformIndexHtml: { order: 'post', handler: (html) => renderPage(html, '/', siteUrl) },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const entry = bundle['index.html'];
        if (!entry || entry.type !== 'asset') this.error('No se encontró index.html para generar los metadatos por ruta.');
        const html = String(entry.source);
        for (const path of Object.keys(seoRoutes).filter(path => path !== '/')) {
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: renderPage(html, path, siteUrl) });
        }
        this.emitFile({ type: 'asset', fileName: '404.html', source: renderPage(html, '/404', siteUrl) });
        const origin = new URL(getSeo('/', siteUrl).url).origin;
        const urls = Object.entries(seoRoutes).filter(([, page]) => page.index).map(([path]) => `  <url><loc>${escapeHtml(`${origin}${path}`)}</loc></url>`);
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n` });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n` });
      },
    },
  };
}
