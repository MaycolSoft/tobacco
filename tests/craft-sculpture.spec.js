import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const evidence = 'docs/3d-exploration/implementation/validation/art-c1';
const art = page => page.locator('[data-art="art-c1"]');
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { username: 'admin', role: 'admin' }, token: 'fake-jwt-token-sequence', expiry: Date.now() + 86400000 }, version: 0 })));
});
async function open(page) { await page.goto('/craft-your-cigar'); await expect(art(page)).toBeVisible(); }
async function tripa(page, count = 2) { for (let i = 0; i < count; i++) await page.locator('.ls-grid-item').nth(i).click(); await expect(art(page)).toHaveAttribute('data-leaf-count', String(count)); }
async function finish(page) {
  await page.locator('.lg-inline-nav-btn--next').click();
  await page.locator('.ls-grid-item').first().click();
  await expect(page.locator('[data-layer="CAPOTE"]')).toHaveCount(1);
  await page.locator('.lg-inline-nav-btn--next').click();
  await page.locator('.ls-grid-item').first().click();
  await expect(page.locator('[data-layer="CAPA"]')).toHaveCount(1);
}
test('ART-C1 selected leaves, ribbons, focus priority, guide and result lifecycle', async ({ page }) => {
  const errors = []; const three = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (/three|leafRibbonRenderer/.test(request.url())) three.push(request.url()); });
  await open(page); await expect(art(page)).toHaveAttribute('data-leaf-count', '0');
  await tripa(page, 5); await expect(page.locator('[data-leaf]')).toHaveCount(5);
  await page.locator('.craft-summary__group').first().locator('li button').last().click();
  await expect(art(page)).toHaveAttribute('data-leaf-count', '4');
  await finish(page);
  const rows = page.locator('.craft-summary__group').first().locator('li');
  const ids = await page.locator('[data-leaf]').evaluateAll(nodes => nodes.map(node => node.dataset.leaf));
  await rows.first().locator('button').focus(); await rows.nth(1).hover();
  await expect(page.locator(`[data-leaf="${ids[0]}"]`)).toHaveAttribute('opacity', '1');
  await expect(page.locator(`[data-leaf="${ids[1]}"]`)).toHaveAttribute('opacity', '0.4');
  await page.locator('.craft-summary__guide').click();
  await expect(page.locator('.tg-experience')).toBeVisible();
  await expect(art(page)).toHaveAttribute('data-running', 'false');
  await page.locator('.tg-icon-button').click(); await expect(page.locator('.tg-experience')).toHaveCount(0);
  await art(page).scrollIntoViewIfNeeded();
  await page.locator('.craft-summary__footer .site-button--primary').click();
  await expect(page.locator('.craft-result')).toBeVisible(); await expect(art(page)).toHaveCount(0);
  expect(errors).toEqual([]); expect(three).toEqual([]);
});
test('ART-C1 complete composition evidence and language preservation', async ({ page }) => {
  fs.mkdirSync(evidence, { recursive: true });
  await open(page); await tripa(page); await finish(page);
  for (const language of ['en', 'fr', 'zh-CN', 'es']) {
    await page.locator('.site-nav-actions .language-switcher select').selectOption(language);
    await expect(art(page)).toHaveAttribute('data-leaf-count', '2');
    await expect(page.locator('[data-layer="CAPA"]')).toHaveCount(1);
  }
  await art(page).scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
  await page.screenshot({ path: `${evidence}/complete-desktop.png`, fullPage: true });
  await art(page).screenshot({ path: `${evidence}/complete-object.png` });
  expect(await page.locator('.craft-summary').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
});
for (const mode of ['mobile', 'reduced', 'save-data']) test(`ART-C1 ${mode} is static and usable`, async ({ page }) => {
  if (mode === 'mobile') await page.setViewportSize({ width: 390, height: 844 });
  if (mode === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
  if (mode === 'save-data') await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {}, removeEventListener() {} }, configurable: true }));
  await open(page); await tripa(page); await finish(page);
  await art(page).scrollIntoViewIfNeeded();
  await expect(art(page)).toHaveAttribute('data-motion-eligible', 'false');
  await expect(art(page)).toHaveAttribute('data-running', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  if (mode === 'mobile') { fs.mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: `${evidence}/complete-mobile.png`, fullPage: true }); }
});
