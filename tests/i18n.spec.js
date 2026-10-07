import { test, expect } from '@playwright/test';
import { translate } from '../src/i18n/translate.js';
import { localizePath } from '../src/i18n/routing.js';
import { supportedLanguages } from '../src/i18n/config.js';
import { seoRoutes } from '../src/config/seoConfig.js';

const selector = page => page.locator('.site-nav-actions .language-switcher select');
const authenticate = async page => page.addInitScript(() => {
  localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { username: 'admin', role: 'admin' }, token: 'fake-jwt-token-sequence', expiry: Date.now() + 86400000 }, version: 0 }));
});

test('all 36 localized entry URLs render their view and matching SEO', async ({ page }) => {
  await authenticate(page);
  for (const language of supportedLanguages) {
    for (const [base, route] of Object.entries(seoRoutes)) {
      await page.goto(localizePath(base, language), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await expect(page.locator('#main-content')).toBeVisible();
      await expect(page.locator('.error-boundary-container')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://tabacaleratamboril.com.do${localizePath(base, language)}`);
      await expect(page).toHaveTitle(translate(language, `seo:${route.key}.title`));
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(5);
      if (base === '/leaf-library') await expect(page.locator('.ls-card')).toHaveCount(21);
      if (base === '/craft-your-cigar') await expect(page.locator('.lg-step-bar')).toBeVisible();
      if (base === '/reservation' || base === '/contact') await expect(page.locator('input[name="name"]')).toBeVisible();
      const internal = await page.locator('#main-content a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      if (language !== 'es') expect(internal.every(href => href === `/${language}` || href.startsWith(`/${language}/`) || href.startsWith(`/${language}?`))).toBeTruthy();
    }
  }
});

test('language changes preserve form fields and functional option values', async ({ page }) => {
  await page.goto('/reservation');
  await page.locator('input[name="name"]').fill('María');
  await page.locator('input[name="email"]').fill('maria@example.com');
  await page.locator('input[name="date"]').fill('2026-11-12');
  await page.locator('select[name="attendees"]').selectOption('6-12');
  await page.locator('select[name="focus"]').selectOption('blend');
  for (const language of ['en', 'fr', 'zh-CN', 'es']) {
    await selector(page).selectOption(language);
    await expect(page).toHaveURL(new RegExp(`${localizePath('/reservation', language)}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('input[name="name"]')).toHaveValue('María');
    await expect(page.locator('input[name="date"]')).toHaveValue('2026-11-12');
    await expect(page.locator('select[name="attendees"]')).toHaveValue('6-12');
    await expect(page.locator('select[name="focus"]')).toHaveValue('blend');
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(5);
    await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveCount(3);
  }
  await page.locator('#main-content form button[type="submit"]').click();
  await expect(page.locator('.site-form-status')).toContainText('aún no envía formularios');
});

test('origin filter, open leaf sheet and immersive chapter survive language changes', async ({ page }) => {
  await page.goto('/leaf-library?categoria=CAPA#capa-pensilvania');
  await page.locator('.ls-filters button').nth(1).click();
  await page.locator('.ls-origin-filter select').selectOption('USA');
  await expect(page.locator('.ls-card')).toHaveCount(1);
  await page.locator('#capa-pensilvania .ls-card-visual').click();
  await page.locator('.ls-experience-header .language-switcher select').selectOption('zh-CN');
  await expect(page).toHaveURL(/\/zh-CN\/leaf-library\?categoria=CAPA#capa-pensilvania$/);
  await expect(page.locator('.ls-origin-filter select')).toHaveValue('USA');
  await expect(page.locator('.ts-description')).toHaveText(translate('zh-CN', 'leaves:items.capa-pensilvania.description'));
  await expect(page.locator('.ts-title')).toHaveText('Pensilvania');
  await page.locator('.ls-view-switch button').nth(1).click();
  await page.locator('.th-chapters button').nth(2).click();
  await page.locator('.ls-experience-header .language-switcher select').selectOption('fr');
  await expect(page.locator('.th-chapters button').nth(2)).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('.th-narrative p')).toHaveText(translate('fr', 'leaves:items.capa-pensilvania.description'));
  await page.locator('.ls-icon-button').click();
  await expect(page.locator('.ls-card')).toHaveCount(1);
});

test('composition step and selected leaf IDs survive switching through all languages', async ({ page }) => {
  await authenticate(page);
  await page.goto('/craft-your-cigar');
  await page.locator('.ls-grid-item').nth(0).click();
  await page.locator('.ls-grid-item').nth(1).click();
  const initial = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tamboril-blend')).state.selections);
  for (const language of ['en', 'fr', 'zh-CN', 'es']) {
    await selector(page).selectOption(language);
    await expect(page.locator('.ls-grid-item[aria-pressed="true"]')).toHaveCount(2);
    await expect(page.locator('.lg-step-node button[aria-current="step"]')).toContainText(translate(language, 'craft:steps.TRIPA'));
    expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('tamboril-blend')).state.selections)).toEqual(initial);
  }
  await page.locator('.lg-inline-nav-btn--next').click();
  await page.locator('.ls-grid-item').nth(0).click();
  await selector(page).selectOption('zh-CN');
  await expect(page.locator('.lg-step-node button[aria-current="step"]')).toContainText('茄套');
  await page.locator('.lg-inline-nav-btn--next').click();
  await page.locator('.ls-grid-item').nth(0).click();
  await page.locator('.lg-inline-nav-btn--next').click();
  await expect(page.locator('.craft-result')).toBeVisible();
  await expect(page.locator('.craft-result__parts dd')).toHaveCount(4);
  await expect(page.locator('.craft-result__intro h2')).toHaveText('您的组合已准备就绪。');
});

test('protected return retains query and hash, uses selected language and opens the guide', async ({ page }) => {
  await page.goto('/zh-CN/craft-your-cigar?guia=abierta&keep=yes#detalle');
  await expect(page).toHaveURL(/\/zh-CN\/login$/);
  await selector(page).selectOption('fr');
  await page.locator('#main-content form button[type="submit"]').click();
  await expect(page.locator('.tg-experience')).toBeVisible();
  await expect(page).toHaveURL(/\/fr\/craft-your-cigar\?keep=yes#detalle$/);
  await page.locator('.tg-header .language-switcher select').selectOption('zh-CN');
  await expect(page.locator('.tg-experience')).toBeVisible();
  await expect(page.locator('#tg-title')).toHaveText('调配的艺术。');
  await page.locator('.tg-icon-button').click();
  await expect(page.locator('.lg-step-bar')).toBeVisible();
});

test('login errors and open control panels update without remounting', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[type="password"]').fill('invalid');
  await page.locator('#main-content form button[type="submit"]').click();
  await selector(page).selectOption('zh-CN');
  await expect(page.locator('.site-form-error')).toContainText('请检查用户名与密码');
  await expect(page.locator('input[type="password"]')).toHaveValue('invalid');
  await page.locator('.cc-trigger').click();
  await page.locator('.cc-tabs button').nth(1).click();
  await page.locator('.cc-header .language-switcher select').selectOption('fr');
  await expect(page.locator('.cc-tabs button').nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.cc-title h2')).toHaveText('Centre de contrôle');
  await expect(page.locator('.cc-body')).toContainText('Profil visuel');
});

test('URL wins over stored preference and unknown localized paths show localized 404', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tamboril-language', 'zh-CN'));
  await page.goto('/about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.goto('/es/about?origen=prueba#proceso');
  await expect(page).toHaveURL(/\/about\?origen=prueba#proceso$/);
  for (const language of supportedLanguages) {
    await page.goto(localizePath('/no-existe', language));
    await expect(page.locator('.site-empty-state h1')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('.site-empty-state a')).toHaveAttribute('href', localizePath('/', language));
  }
  await page.goto('/de/about');
  await expect(page.locator('.site-empty-state')).toBeVisible();
});

test('selector remains available with hidden navbar, sharing layout settings across languages', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tamborilero-layout-storage', JSON.stringify({ state: { pagesConfig: { '/about': { showNavbar: false, showFooter: true, showHeader: false, navbarSticky: false } } }, version: 0 })));
  await page.goto('/about');
  await expect(page.locator('.site-nav')).toHaveCount(0);
  await page.locator('.language-switcher--floating select').selectOption('zh-CN');
  await expect(page).toHaveURL(/\/zh-CN\/about$/);
  await expect(page.locator('.site-nav')).toHaveCount(0);
});

test('navigation history, Chinese mobile and French layouts remain usable', async ({ page }) => {
  await page.goto('/fr');
  await page.locator('.site-nav-links a[href="/fr/about"]').click();
  await expect(page).toHaveURL(/\/fr\/about$/);
  await selector(page).selectOption('zh-CN');
  await expect(page).toHaveURL(/\/zh-CN\/about$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.goForward();
  await expect(page).toHaveURL(/\/zh-CN\/about$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.setViewportSize({ width: 375, height: 812 });
  for (const language of ['fr', 'zh-CN']) {
    await page.goto(localizePath('/', language));
    await page.locator('.site-nav-toggle').click();
    await expect(selector(page)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    await page.locator('.site-nav-toggle').click();
    await page.screenshot({ path: `test-results/home-${language}-mobile.png`, fullPage: true });
  }
});
