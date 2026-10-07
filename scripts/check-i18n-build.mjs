import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getLocalizedSeoPaths, getSeo } from '../src/config/seoConfig.js';
import { supportedLanguages } from '../src/i18n/config.js';
import { localizePath } from '../src/i18n/routing.js';

const read = path => readFile(`dist/${path}`, 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paths = getLocalizedSeoPaths();
let siteUrl;
for (const path of paths) {
  const html = await read(path === '/' ? 'index.html' : `${path.slice(1)}.html`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
  siteUrl ??= new URL(canonical).origin;
  const seo = getSeo(path, siteUrl);
  assert.ok(html.includes(`<html lang="${seo.language}">`), path);
  assert.ok(html.includes(`<title>${escape(seo.title)}</title>`), path);
  assert.equal(canonical, seo.url);
  assert.ok(html.includes(`name="description" content="${escape(seo.description)}"`), path);
  assert.ok(html.includes(`name="robots" content="${seo.robots}"`), path);
  assert.ok(html.includes(`property="og:locale" content="${seo.ogLocale}"`), path);
  assert.ok(html.includes(`rel="manifest" href="${seo.manifest}"`), path);
  assert.equal((html.match(/hreflang=/g) || []).length, 5, path);
  for (const alternate of seo.alternates) assert.ok(html.includes(`hreflang="${alternate.language}" href="${escape(alternate.url)}"`), path);
  const schema = JSON.parse(html.match(/<script id="site-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(schema, seo.schema, path);
}
for (const language of supportedLanguages) {
  const manifest = JSON.parse(await read(`site.${language}.webmanifest`));
  assert.equal(manifest.lang, language);
  assert.equal(manifest.start_url, localizePath('/', language));
  const html = await read(`${localizePath('/404', language).slice(1)}.html`);
  assert.ok(html.includes(`<html lang="${language}">`));
  assert.ok(html.includes('name="robots" content="noindex, follow"'));
  assert.ok(!html.includes('hreflang='));
}
const sitemap = await read('sitemap.xml');
const indexed = paths.map(path => getSeo(path, siteUrl)).filter(page => page.index);
assert.equal((sitemap.match(/<loc>/g) || []).length, indexed.length);
for (const page of indexed) {
  assert.ok(sitemap.includes(`<loc>${escape(page.url)}</loc>`));
  for (const alternate of page.alternates) assert.ok(sitemap.includes(`hreflang="${alternate.language}" href="${escape(alternate.url)}"`));
}
assert.equal((sitemap.match(/<xhtml:link/g) || []).length, indexed.length * 5);
for (const url of sitemap.matchAll(/(?:<loc>|href=")([^<"]+)/g)) assert.ok(!/login|reservation|craft-your-cigar|\?|#/.test(url[1]));
console.log(`i18n build: ${paths.length} HTML pages, ${supportedLanguages.length} manifests, ${supportedLanguages.length} localized 404 files and ${indexed.length} sitemap URLs verified.`);
