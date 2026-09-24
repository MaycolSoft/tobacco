import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readAppearance, saveAppearance, resolveAppearance, defaultAppearance, applyTokens } from './designTheme.js';
import { visualProfiles } from './visualProfiles.js';

let saved;
beforeEach(() => {
  saved = new Map();
  globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
});

test('v2 colors and legacy font migrate as overrides, without inferring a profile', () => {
  const tokens = { ...visualProfiles.executive.tokens };
  saved.set('ls-design-tokens', JSON.stringify({ version: 2, tokens }));
  saved.set('ls-font-pairing', 'havana');
  const result = readAppearance();
  assert.equal(result.profileId, 'base');
  assert.deepEqual(result.tokenOverrides, tokens);
  assert.equal(result.fontPairingOverride, 'havana');
  saveAppearance(result);
  assert.deepEqual(readAppearance(), result);
});

test('profile inheritance preserves independent buttons after an accent override', () => {
  const appearance = { ...defaultAppearance(), profileId: 'modernLuxury', tokenOverrides: { '--ls-gold': '#123456' } };
  const resolved = resolveAppearance({}, appearance);
  assert.equal(resolved.tokens['--ls-gold'], '#123456');
  assert.equal(resolved.tokens['--ls-btn-primary'], '#D2B36B');
  assert.equal(resolved.fontPairingId, 'reserve');
  saveAppearance(appearance);
  assert.deepEqual(readAppearance(), appearance);
  assert.deepEqual(JSON.parse(saved.get('ls-design-tokens')).tokenOverrides, { '--ls-gold': '#123456' });
});

test('v3 ignores stale font storage and sanitizes unsupported values', () => {
  saved.set('ls-font-pairing', 'havana');
  saved.set('ls-design-tokens', JSON.stringify({ version: 3, profileId: 'unknown', tokenOverrides: { '--ls-bg': '#123456', '--ls-gold': 'red', '--radius': '#123456' }, fontPairingOverride: 'unknown' }));
  assert.deepEqual(readAppearance(), { ...defaultAppearance(), tokenOverrides: { '--ls-bg': '#123456' } });
});

test('base inherits supplied CSS defaults without duplicating palette values', () => {
  const defaults = { '--ls-bg': '#010203' };
  assert.deepEqual(resolveAppearance(defaults, defaultAppearance()), { tokens: defaults, fontPairingId: 'legacy' });
  assert.deepEqual(visualProfiles.base.tokens, {});
  for (const profile of Object.values(visualProfiles).slice(1)) assert.equal(Object.keys(profile.tokens).length, 11);
});

test('malformed or blocked storage falls back safely', () => {
  saved.set('ls-design-tokens', '{');
  assert.deepEqual(readAppearance(), defaultAppearance());
  globalThis.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.deepEqual(readAppearance(), defaultAppearance());
  assert.doesNotThrow(() => saveAppearance(defaultAppearance()));
});

test('DOM application does not persist resolved colors and derives primary foreground independently', () => {
  const properties = new Map();
  globalThis.document = { documentElement: { style: { setProperty: (key, value) => properties.set(key, value), removeProperty: key => properties.delete(key) } } };
  applyTokens({ ...visualProfiles.executive.tokens, '--ls-gold': '#000000' });
  assert.equal(properties.get('--ls-text-on-gold'), '#FFFDF8');
  assert.equal(properties.get('--ls-text-on-primary'), '#16140F');
  assert.equal(saved.size, 0);
});
