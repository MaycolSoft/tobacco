import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resources } from '../src/i18n/resources.js';
import { supportedLanguages } from '../src/i18n/config.js';
import { leaves } from '../src/data/leaves.js';
import { seoRoutes } from '../src/config/seoConfig.js';

const variables = value => [...new Set([...value.matchAll(/\{\{\s*([^},\s]+)[^}]*\}\}/g)].map(match => match[1]))].sort();
const tags = value => [...value.matchAll(/<\/?([a-zA-Z]+)\s*\/?\s*>/g)].map(match => match[1]).sort();
const base = resources.es;
let messages = 0;
for (const language of supportedLanguages) {
  assert.deepEqual(Object.keys(resources[language]).sort(), Object.keys(base).sort(), `${language}: namespaces`);
  for (const [namespace, catalog] of Object.entries(base)) {
    const translated = resources[language][namespace];
    assert.deepEqual(Object.keys(translated).sort(), Object.keys(catalog).sort(), `${language}/${namespace}: keys`);
    for (const [key, source] of Object.entries(catalog)) {
      const value = translated[key];
      assert.equal(typeof value, 'string', `${language}/${namespace}:${key}`);
      assert.ok(value.trim(), `${language}/${namespace}:${key}: empty translation`);
      assert.deepEqual(variables(value), variables(source), `${language}/${namespace}:${key}: placeholders`);
      assert.deepEqual(tags(value), tags(source), `${language}/${namespace}:${key}: markup`);
      if (language === 'es') messages++;
    }
  }
  for (const leaf of leaves) assert.ok(resources[language].leaves[`items.${leaf.id}.description`], `${language}: leaf ${leaf.id}`);
  for (const route of Object.values(seoRoutes)) {
    for (const field of ['title', 'description', 'label']) assert.ok(resources[language].seo[`${route.key}.${field}`], `${language}: SEO ${route.key}.${field}`);
  }
}

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name !== 'locales') await scan(file);
    } else if (/\.(?:js|jsx)$/.test(entry.name)) {
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(/(?:\bt\(|\b(?:key|labelKey|titleKey|subtitleKey|parentKey):\s*)\s*['"]([a-z]+:[^'"]+)['"]/g)) {
        const [namespace, key] = match[1].split(':');
        const catalog = base[namespace];
        assert.ok(catalog && (Object.hasOwn(catalog, key) || Object.hasOwn(catalog, `${key}_other`)), `${file}: missing ${match[1]}`);
      }
    }
  }
}
await scan('src');
console.log(`i18n: ${messages} keys × ${supportedLanguages.length} languages; placeholders, markup, static references, ${leaves.length} leaves and ${Object.keys(seoRoutes).length} routes verified.`);
