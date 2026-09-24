import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePerfConfig, FRAME_CDN_BASE } from '../config/animationPerformance.js';
import { getFrameProfile } from './frameProfile.js';
import { groupFrameVariants, getVariantProfile, canDeleteVariant, getAnimationCatalog, describeFrameProfile } from './frameVariants.js';
import { listFrameVariants, createFrameVariant, deleteFrameVariant } from './frameVariantsApi.js';

const master = { name: '2t_colorado_maduro', kind: 'master', managed: false, frame_count: 1485, metadata: null };
const legacy = { name: `${master.name}_30fps`, kind: 'legacy', managed: false, frame_count: 743, metadata: null };
const generated = { name: `${master.name}_30fps_1080p`, kind: 'generated', managed: true, frame_count: 743,
  metadata: { source: master.name, target_fps: 30, source_fps: 60, width: 1920, height: 1080, status: 'ready' } };

test('legacy settings keep their values, drop sourceMode and gain an empty selection map', () => {
  const config = normalizePerfConfig({ sourceMode: 'original', concurrency: 9 });
  assert.equal(config.concurrency, 9);
  assert.equal('sourceMode' in config, false);
  assert.deepEqual(config.frameVariants, {});
});

test('variants group by master, including legacy and nested sources', () => {
  const nested = { ...generated, name: 'nested', metadata: { ...generated.metadata, source: generated.name } };
  const groups = groupFrameVariants([generated, legacy, master, nested]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].source, master.name);
  assert.equal(groups[0].variants[0].kind, 'master');
});

test('selected profile uses API frame count and FPS, and namespaces its cache', () => {
  const selection = getVariantProfile({ ...generated, frame_count: 619, metadata: { ...generated.metadata, target_fps: 25 } });
  const profile = getFrameProfile({ name: master.name, length: 1485 }, selection);
  assert.equal(profile.frameCount, 619);
  assert.equal(profile.fps, 25);
  assert.equal(profile.frameUrl(1), `${FRAME_CDN_BASE}/${generated.name}/frame_0001.webp`);
  assert.equal(profile.cacheKey(1), `${generated.name}:frame:0001`);
  assert.equal(getFrameProfile({ name: 'other', length: 1501 }).frameCount, 751);
  assert.equal(getFrameProfile({ name: 'other', length: 1501 }).folder, 'other_30fps');
});

test('invalid saved profiles fall back and unfinished or unknown generated profiles cannot be selected', () => {
  assert.deepEqual(normalizePerfConfig({ frameVariants: { bad: { folder: '../bad', frameCount: 12, fps: 30 } } }).frameVariants, {});
  assert.equal(getVariantProfile({ ...generated, metadata: { ...generated.metadata, status: 'processing' } }), null);
  assert.equal(getVariantProfile({ ...generated, metadata: null }), null);
  assert.equal(getVariantProfile({ ...generated, frame_count: 0 }), null);
  assert.equal(getVariantProfile(master).fps, 60);
  assert.equal(getVariantProfile(legacy).fps, 30);
  assert.equal(getFrameProfile({ name: master.name, length: 1485 }, { folder: 'bad', frameCount: 0, fps: 0 }).folder, legacy.name);
});

test('API uses the shared base and refuses deletion of unmanaged or non-generated variants', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    if (options.method === 'DELETE') return new Response(null, { status: 204 });
    return Response.json(options.method === 'POST' ? { id: 'job-1', status: 'queued' } : { items: [master, generated] });
  });
  assert.equal((await listFrameVariants()).length, 2);
  const body = { source: master.name, source_fps: 60, target_fps: 30, width: 1920, height: 1080, quality: 82, workers: 4 };
  assert.equal((await createFrameVariant(body)).id, 'job-1');
  assert.deepEqual(JSON.parse(calls[1].options.body), body);
  assert.equal(calls[0].url, `${FRAME_CDN_BASE}/api-variants/variants`);
  await assert.rejects(deleteFrameVariant(master));
  await assert.rejects(deleteFrameVariant(legacy));
  assert.equal(calls.length, 2);
  assert.equal(canDeleteVariant({ ...generated, managed: false }), false);
  await deleteFrameVariant(generated);
  assert.equal(calls.at(-1).options.method, 'DELETE');
});

test('API surfaces server errors and malformed responses', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ detail: 'Variant already exists' }, { status: 409 }));
  await assert.rejects(createFrameVariant({}), /Variant already exists/);
  globalThis.fetch.mock.mockImplementation(async () => Response.json({ unexpected: true }));
  await assert.rejects(listFrameVariants(), /variants list/);
  await assert.rejects(createFrameVariant({}), /valid job/);
});

test('animation catalog follows API masters and keeps local display names', () => {
  const other = { ...master, name: 'new_master', frame_count: 900 };
  const fallback = [{ name: master.name, length: 1, displayName: 'Colorado Maduro' }];
  assert.deepEqual(getAnimationCatalog([legacy, other, generated, master], fallback), [
    { name: 'new_master', length: 900, displayName: undefined },
    { name: master.name, length: 1485, displayName: 'Colorado Maduro' },
  ]);
  assert.equal(getAnimationCatalog([], fallback), fallback);
});

test('profile description reports default, selected kind, resolution and missing folders', () => {
  const video = { name: master.name, length: 1485 };
  const items = [master, legacy, generated];
  assert.deepEqual(describeFrameProfile(getFrameProfile(video), items, false), { fps: 30, frames: 743, resolution: null, type: 'default' });
  const selected = getVariantProfile(generated);
  assert.deepEqual(describeFrameProfile(getFrameProfile(video, selected), items, true), { fps: 30, frames: 743, resolution: '1080p', type: 'generated' });
  assert.equal(describeFrameProfile(getFrameProfile(video, selected), [master], true).type, 'unavailable');
  assert.equal(describeFrameProfile(getFrameProfile(video, selected), [], true).type, 'selected');
});
