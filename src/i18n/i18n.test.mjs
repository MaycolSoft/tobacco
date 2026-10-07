import test from 'node:test';
import assert from 'node:assert/strict';
import { createInstance } from 'i18next';
import { resources } from './resources.js';
import { languages, supportedLanguages } from './config.js';
import { localizePath, parseLocalePath } from './routing.js';
import { translate } from './translate.js';
import { localizeLeaf } from './localizeLeaf.js';
import { renderMessage, errorMessage } from './messages.js';
import { getSeo, getLocalizedSeoPaths, seoRoutes } from '../config/seoConfig.js';
import { getLeafCategories, getLeafOrigin, getLeafChapters } from '../data/leafPresentation.js';
import { leaves } from '../data/leaves.js';
import { BLEND_STEPS, getStepMessage, isBlendComplete } from '../store/useBlendStore.js';

const instance = createInstance();
await instance.init({ resources, fallbackLng: 'es', supportedLngs: supportedLanguages, load: 'currentOnly', keySeparator: false, interpolation: { escapeValue: false } });

test('localized paths preserve query/hash, stable base identity and external targets', () => {
  for (const language of supportedLanguages) {
    const path = localizePath('/leaf-library?categoria=CAPA#capa-habana', language);
    assert.equal(localizePath(path, language), path);
    assert.equal(parseLocalePath(path.split('?')[0]).basePath, '/leaf-library');
    assert.equal(parseLocalePath(localizePath('/', language)).language, language);
  }
  assert.equal(localizePath('/fr/about#proceso', 'zh-CN'), '/zh-CN/about#proceso');
  assert.equal(localizePath('/es/about', 'es'), '/about');
  assert.equal(localizePath('/en/', 'en'), '/en');
  assert.equal(localizePath('/about', 'unknown'), '/about');
  assert.deepEqual(parseLocalePath('/de/about'), { language: 'es', basePath: '/de/about' });
  for (const target of ['https://example.com/a', '//cdn.example.com/a', '#proceso', '?guia=abierta', '/assets/full/leaf.png', '/img/logo.png']) assert.equal(localizePath(target, 'fr'), target);
  assert.deepEqual(localizePath({ pathname: '/en/about', search: '?x=1', hash: '#proceso' }, 'fr'), { pathname: '/fr/about', search: '?x=1', hash: '#proceso' });
});

test('all four languages render selection messages and plural counts without changing blend rules', () => {
  for (const language of supportedLanguages) {
    const t = instance.getFixedT(language);
    for (const step of BLEND_STEPS) {
      for (const count of step.multi ? [0, 1, 2, 5] : [0, 1]) {
        const value = getStepMessage(step, count, t);
        assert.ok(value.trim().length > 0);
        assert.ok(!value.includes('craft:') && !value.includes('{{'), `${language} ${step.key} ${count}`);
        if (step.multi && count) assert.ok(value.includes(String(count)));
      }
    }
    assert.ok(t('leaves:varieties', { count: 1 }).includes('1'));
    assert.ok(t('leaves:varieties', { count: 21 }).includes('21'));
  }
  assert.equal(instance.getFixedT('en')('leaves:varieties', { count: 1 }), '1 variety');
  assert.equal(instance.getFixedT('en')('leaves:varieties', { count: 2 }), '2 varieties');
  assert.equal(instance.getFixedT('zh-CN')('leaves:varieties', { count: 2 }), '2 个品种');
  assert.equal(isBlendComplete({ TRIPA: ['a'], CAPOTE: ['b'], CAPA: ['c'] }), false);
  assert.equal(isBlendComplete({ TRIPA: ['a', 'd'], CAPOTE: ['b'], CAPA: ['c'] }), true);
});

test('all leaf descriptions, origins, categories and chapters localize without mutating the inventory', () => {
  const snapshot = JSON.stringify(leaves);
  for (const language of supportedLanguages) {
    const t = instance.getFixedT(language);
    const categories = getLeafCategories(t);
    for (const leaf of leaves) {
      const localized = localizeLeaf(leaf, t);
      assert.equal(localized.id, leaf.id);
      assert.equal(localized.category, leaf.category);
      assert.equal(localized.fullImg, leaf.fullImg);
      assert.equal(localized.origin, leaf.origin);
      assert.ok(localized.description && !localized.description.includes('items.'));
      assert.ok(!getLeafOrigin(leaf, t).includes('origins.'));
      assert.ok(!categories[leaf.category].label.includes('categories.'));
      const chapters = getLeafChapters(localized, t);
      assert.equal(chapters.length, 4);
      assert.equal(chapters[2].text, localized.description);
    }
  }
  assert.equal(JSON.stringify(leaves), snapshot);
  assert.equal(getLeafOrigin({ origin: 'USA' }, instance.getFixedT('zh-CN')), '美国');
});

test('SEO is consistent for 36 URLs, reciprocal alternates, noindex routes and Chinese metadata', () => {
  assert.equal(getLocalizedSeoPaths().length, 36);
  for (const language of supportedLanguages) {
    for (const [basePath, route] of Object.entries(seoRoutes)) {
      const path = localizePath(basePath, language);
      const page = getSeo(path);
      assert.equal(page.language, language);
      assert.equal(page.index, route.index);
      assert.equal(page.basePath, basePath);
      assert.equal(new URL(page.url).pathname, path);
      assert.equal(page.ogLocale, languages[language].ogLocale);
      assert.equal(page.title, translate(language, `seo:${route.key}.title`));
      assert.equal(page.alternates.length, 5);
      for (const alternate of page.alternates.filter(item => item.language !== 'x-default')) {
        const other = getSeo(new URL(alternate.url).pathname);
        assert.ok(other.alternates.some(item => item.url === page.url && item.language === language));
      }
      const webPage = page.schema['@graph'].find(item => ['WebPage', 'CollectionPage'].includes(item['@type']));
      assert.equal(webPage.inLanguage, language);
      if (basePath === '/leaf-library') {
        assert.equal(webPage.mainEntity.numberOfItems, leaves.length);
        assert.equal(webPage.mainEntity.itemListElement[0].item.description, localizeLeaf(leaves[0], instance.getFixedT(language)).description);
      }
    }
    const missing = getSeo(localizePath('/missing', language));
    assert.equal(missing.index, false);
    assert.deepEqual(missing.alternates, []);
  }
});

test('stored notices and errors resolve in the selected language, keeping server details', () => {
  const message = { key: 'craft:removeLeaf', values: { name: 'Habana' } };
  assert.equal(renderMessage(message, instance.getFixedT('en')), 'Remove Habana from your blend');
  assert.equal(renderMessage(message, instance.getFixedT('zh-CN')), '从调配中移除 Habana');
  const error = Object.assign(new Error('technical'), { code: 'controls:api.request', values: { status: 503 }, detail: 'upstream unavailable' });
  const rendered = renderMessage(errorMessage(error), instance.getFixedT('fr'));
  assert.ok(rendered.includes('503') && rendered.includes('upstream unavailable'));
  assert.equal(renderMessage(null, instance.getFixedT('en')), '');
});
