import { test, expect } from '@playwright/test';

test.use({ trace: 'off' });
const rings = page => page.locator('.ls-experience .specimen-ring');
const back = page => rings(page).filter({ has: page.locator('g') }).first();
const watch = page => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
};
async function open(page, id = 'capa-habana') {
  await page.locator(`#${id} .ls-card-visual`).click();
  await expect(page.locator('.ls-experience')).toBeVisible();
  await expect(page.locator('.ts-main-img')).toHaveJSProperty('complete', true);
  await expect.poll(() => page.locator('.ts-main-img').evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
  await expect(rings(page)).toHaveCount(2);
}
async function activeArcs(page) {
  return back(page).locator('.specimen-ring__arc').evaluateAll(arcs => arcs.filter(arc => getComputedStyle(arc).display !== 'none').length);
}
async function pose(page) {
  return back(page).locator('.specimen-ring__pose').evaluate(element => getComputedStyle(element).transform);
}

test('specimen categories, same-category next, stable layout and decorative semantics', async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = watch(page);
  await page.goto('/leaf-library');
  for (const [category, id, count] of [['CAPA', 'capa-habana', 1], ['CAPOTE', 'capote-criollo-98', 2], ['TRIPA', 'tripa-criollo-98', 3]]) {
    // Use the actual inventory rather than assume the TRIPA specimen name.
    const card = category === 'TRIPA' ? page.locator('.ls-collection-group').filter({ has: page.locator('#group-TRIPA') }).locator('.ls-card').first() : page.locator(`#${id}`);
    await card.locator('.ls-card-visual').click();
    await expect(rings(page)).toHaveCount(2);
    await expect(back(page)).toHaveAttribute('data-category', category);
    expect(await activeArcs(page)).toBe(count);
    for (const ring of await rings(page).all()) {
      await expect(ring).toHaveAttribute('aria-hidden', 'true');
      await expect(ring).toHaveAttribute('focusable', 'false');
      await expect(ring).toHaveCSS('pointer-events', 'none');
    }
    const dimensions = await page.locator('.ts-wrapper').evaluate(wrapper => {
      const before = wrapper.getBoundingClientRect();
      const decorative = wrapper.querySelectorAll('.specimen-ring');
      decorative.forEach(ring => { ring.style.display = 'none'; });
      const after = wrapper.getBoundingClientRect();
      decorative.forEach(ring => { ring.style.display = ''; });
      return { width: Math.abs(before.width - after.width), height: Math.abs(before.height - after.height) };
    });
    expect(dimensions.width).toBeLessThanOrEqual(2);
    expect(dimensions.height).toBeLessThanOrEqual(2);
    if (category === 'CAPA') {
      const initialTitle = await page.locator('#ls-experience-title').textContent();
      await page.locator('.ls-experience-footer button').last().click();
      await expect(page.locator('#ls-experience-title')).not.toHaveText(initialTitle);
      await expect(back(page)).toHaveAttribute('data-category', 'CAPA');
      expect(await activeArcs(page)).toBe(1);
    }
    await page.waitForTimeout(750);
    await page.screenshot({ path: info.outputPath(`sheet-${category}.png`) });
    await page.locator('.ls-icon-button').click();
    await expect(rings(page)).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('chapter poses reverse with controls and wheel, then modal closes and reopens cleanly', async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = watch(page);
  await page.goto('/leaf-library');
  await open(page);
  await page.locator('.ls-view-switch button').nth(1).click();
  await page.waitForTimeout(750);
  const initial = await pose(page);
  for (const chapter of [1, 2, 3, 2, 1, 0]) {
    await page.locator('.th-chapters button').nth(chapter).click();
    await expect(back(page)).toHaveAttribute('data-chapter', String(chapter));
    await expect(page.locator('.th-chapters button').nth(chapter)).toHaveAttribute('aria-current', 'step');
    await page.waitForTimeout(750);
    if (chapter === 3) {
      expect(await pose(page)).not.toBe(initial);
      await page.screenshot({ path: info.outputPath('immersive-chapter-3.png') });
    }
  }
  expect(await pose(page)).toBe(initial);
  await page.locator('.th-stage').hover();
  await page.mouse.wheel(0, 120);
  await expect(back(page)).toHaveAttribute('data-chapter', '1');
  await page.waitForTimeout(250);
  await page.mouse.wheel(0, -120);
  await expect(back(page)).toHaveAttribute('data-chapter', '0');
  // Unmount while its short GSAP transition is still active.
  await page.locator('.th-chapters button').nth(3).click();
  await page.locator('.ls-icon-button').click();
  await expect(rings(page)).toHaveCount(0);
  await open(page);
  await expect(back(page)).toHaveAttribute('data-chapter', '0');
  await page.keyboard.press('Escape');
  await expect(page.locator('.ls-experience')).toHaveCount(0);
  await expect(page.locator('#capa-habana .ls-card-visual')).toBeFocused();
  await page.locator('.site-nav a[href="/about"]').first().click();
  await expect(page).toHaveURL(/\/about$/);
  await page.waitForTimeout(750);
  expect(errors).toEqual([]);
});

for (const mode of ['mobile', 'reduced', 'save-data']) test(`static ring fallback: ${mode}`, async ({ page }, info) => {
  await page.setViewportSize({ width: mode === 'mobile' ? 390 : 1440, height: 844 });
  if (mode === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
  if (mode === 'save-data') await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: Object.assign(new EventTarget(), { saveData: true }) }));
  await page.addInitScript(() => {
    window.__specimenWebGL = 0;
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (/webgl/.test(type)) window.__specimenWebGL++;
      return original.call(this, type, ...args);
    };
  });
  const errors = watch(page);
  await page.goto('/leaf-library');
  await open(page, 'capote-criollo-98');
  expect(await activeArcs(page)).toBe(mode === 'mobile' ? 1 : 2);
  await page.locator('.ls-view-switch button').nth(1).click();
  await page.locator('.th-chapters button').nth(3).click();
  await expect(back(page)).toHaveAttribute('data-chapter', '3');
  const first = await pose(page);
  await page.waitForTimeout(200);
  expect(await pose(page)).toBe(first);
  expect(await page.evaluate(() => window.__specimenWebGL)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  await page.screenshot({ path: info.outputPath(`${mode}.png`) });
  await page.locator('.ls-icon-button').click();
  await expect(rings(page)).toHaveCount(0);
  expect(errors).toEqual([]);
});
