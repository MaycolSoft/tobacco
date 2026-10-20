# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: i18n.spec.js >> navigation history, Chinese mobile and French layouts remain usable
- Location: tests/i18n.spec.js:153:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/zh-CN\/about$/
Received string:  "http://127.0.0.1:4173/zh-CN"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html dir="ltr" lang="zh-CN">…</html>
       - unexpected value "http://127.0.0.1:4173/zh-CN"

```

```yaml
- button "打开界面控制中心"
- banner:
  - navigation "主导航":
    - link "Tabacalera Tamboril，首页":
      - /url: /zh-CN
      - strong: Tabacalera
      - text: Tamboril · 烟叶之家
    - link "首页":
      - /url: /zh-CN
    - link "烟叶":
      - /url: /zh-CN/leaf-library
    - link "工艺":
      - /url: /zh-CN/about
    - link "调配特征":
      - /url: /zh-CN/menu
    - button "体验"
    - link "联系":
      - /url: /zh-CN/contact
    - text: 语言
    - combobox "语言":
      - option "Español"
      - option "English"
      - option "Français"
      - option "简体中文" [selected]
    - link "制作我的雪茄":
      - /url: /zh-CN/login
- main:
  - img "烟草手工制作过程"
  - text: Tamboril · 多米尼加共和国
  - heading "个性始于 烟叶。" [level=1]:
    - text: 个性始于
    - emphasis: 烟叶。
  - paragraph: 认识原料，理解调配，并直观地了解雪茄的制作过程。
  - link "探索烟叶":
    - /url: /zh-CN/leaf-library
  - link "了解工艺":
    - /url: /zh-CN/about
  - link "探索":
    - /url: "#recorrido"
  - text: 生动的展示
  - heading "从种植到雪茄， 保留每一步的故事。" [level=2]
  - paragraph: 每片烟叶的产地、质感与功能都影响调配。了解它们的差异，以及如何共同赋予雪茄结构与个性。
  - link "查看探索旅程":
    - /url: "#recorrido-pasos"
  - text: 您可以在这里做什么
  - heading "三个阶段，同一种原料。" [level=2]
  - paragraph: 21 片有记录的烟叶，供您探索差异、理解它们在雪茄中的作用，并创建自己的组合。
  - article:
    - text: "01"
    - heading "认识烟叶" [level=3]
    - paragraph: 产地、质感与功能：每个品种都有独特的贡献。
    - link "探索藏品":
      - /url: /zh-CN/leaf-library
  - article:
    - text: "02"
    - heading "理解调配" [level=3]
    - paragraph: 茄衣、茄套与茄芯共同构成完整的调配。
    - link "探索风味特征":
      - /url: /zh-CN/menu
  - article:
    - text: "03"
    - heading "观察工艺" [level=3]
    - paragraph: 精选烟叶在一步步的手工制作中成形。
    - link "了解制作过程":
      - /url: /zh-CN/about#proceso
  - figure "原料 · 比例 · 工艺":
    - img "手工雪茄的结构展示"
    - text: 原料 · 比例 · 工艺
  - text: 调配的艺术
  - heading "选择烟叶只是开始，理解它们同样重要。" [level=2]
  - paragraph: 茄衣展现外观，茄套支撑结构，茄芯构成调配的核心。烟叶库帮助您在调配之前了解每种功能。
  - link "了解组成方式":
    - /url: /zh-CN/about#composicion
  - text: 互动体验
  - heading "从挑选 到制作。" [level=2]
  - paragraph: 选择茄芯、茄套与茄衣，检查组合，再观察雪茄成形。
  - link "制作我的雪茄":
    - /url: /zh-CN/login
- contentinfo:
  - text: Tabacalera Tamboril
  - heading "烟叶讲述故事， 工艺赋予形态。" [level=2]
  - paragraph: 通过视觉体验认识原料、理解调配，并观察雪茄诞生。
  - navigation "探索":
    - text: 探索
    - link "烟叶":
      - /url: /zh-CN/leaf-library
    - link "工艺":
      - /url: /zh-CN/about
    - link "调配特征":
      - /url: /zh-CN/menu
  - navigation "体验":
    - text: 体验
    - link "感官体验":
      - /url: /zh-CN/testimonial
    - link "导览展示":
      - /url: /zh-CN/reservation
    - link "联系":
      - /url: /zh-CN/contact
  - text: © 2026 Tabacalera Tamboril 内容面向成年人。
  - link "TabacaleraTamboril.com.do":
    - /url: https://tabacaleratamboril.com.do
```

# Test source

```ts
  58  |   await expect(page.locator('.ls-card')).toHaveCount(1);
  59  |   await page.locator('#capa-pensilvania .ls-card-visual').click();
  60  |   await page.locator('.ls-experience-header .language-switcher select').selectOption('zh-CN');
  61  |   await expect(page).toHaveURL(/\/zh-CN\/leaf-library\?categoria=CAPA#capa-pensilvania$/);
  62  |   await expect(page.locator('.ls-origin-filter select')).toHaveValue('USA');
  63  |   await expect(page.locator('.ts-description')).toHaveText(translate('zh-CN', 'leaves:items.capa-pensilvania.description'));
  64  |   await expect(page.locator('.ts-title')).toHaveText('Pensilvania');
  65  |   await page.locator('.ls-view-switch button').nth(1).click();
  66  |   await page.locator('.th-chapters button').nth(2).click();
  67  |   await page.locator('.ls-experience-header .language-switcher select').selectOption('fr');
  68  |   await expect(page.locator('.th-chapters button').nth(2)).toHaveAttribute('aria-current', 'step');
  69  |   await expect(page.locator('.th-narrative p')).toHaveText(translate('fr', 'leaves:items.capa-pensilvania.description'));
  70  |   await page.locator('.ls-icon-button').click();
  71  |   await expect(page.locator('.ls-card')).toHaveCount(1);
  72  | });
  73  | 
  74  | test('composition step and selected leaf IDs survive switching through all languages', async ({ page }) => {
  75  |   await authenticate(page);
  76  |   await page.goto('/craft-your-cigar');
  77  |   await page.locator('.ls-grid-item').nth(0).click();
  78  |   await page.locator('.ls-grid-item').nth(1).click();
  79  |   const initial = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tamboril-blend')).state.selections);
  80  |   for (const language of ['en', 'fr', 'zh-CN', 'es']) {
  81  |     await selector(page).selectOption(language);
  82  |     await expect(page.locator('.ls-grid-item[aria-pressed="true"]')).toHaveCount(2);
  83  |     await expect(page.locator('.lg-step-node button[aria-current="step"]')).toContainText(translate(language, 'craft:steps.TRIPA'));
  84  |     expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('tamboril-blend')).state.selections)).toEqual(initial);
  85  |   }
  86  |   await page.locator('.lg-inline-nav-btn--next').click();
  87  |   await page.locator('.ls-grid-item').nth(0).click();
  88  |   await selector(page).selectOption('zh-CN');
  89  |   await expect(page.locator('.lg-step-node button[aria-current="step"]')).toContainText('茄套');
  90  |   await page.locator('.lg-inline-nav-btn--next').click();
  91  |   await page.locator('.ls-grid-item').nth(0).click();
  92  |   await page.locator('.lg-inline-nav-btn--next').click();
  93  |   await expect(page.locator('.craft-result')).toBeVisible();
  94  |   await expect(page.locator('.craft-result__parts dd')).toHaveCount(4);
  95  |   await expect(page.locator('.craft-result__intro h2')).toHaveText('您的组合已准备就绪。');
  96  | });
  97  | 
  98  | test('protected return retains query and hash, uses selected language and opens the guide', async ({ page }) => {
  99  |   await page.goto('/zh-CN/craft-your-cigar?guia=abierta&keep=yes#detalle');
  100 |   await expect(page).toHaveURL(/\/zh-CN\/login$/);
  101 |   await selector(page).selectOption('fr');
  102 |   await page.locator('#main-content form button[type="submit"]').click();
  103 |   await expect(page.locator('.tg-experience')).toBeVisible();
  104 |   await expect(page).toHaveURL(/\/fr\/craft-your-cigar\?keep=yes#detalle$/);
  105 |   await page.locator('.tg-header .language-switcher select').selectOption('zh-CN');
  106 |   await expect(page.locator('.tg-experience')).toBeVisible();
  107 |   await expect(page.locator('#tg-title')).toHaveText('调配的艺术。');
  108 |   await page.locator('.tg-icon-button').click();
  109 |   await expect(page.locator('.lg-step-bar')).toBeVisible();
  110 | });
  111 | 
  112 | test('login errors and open control panels update without remounting', async ({ page }) => {
  113 |   await page.goto('/login');
  114 |   await page.locator('input[type="password"]').fill('invalid');
  115 |   await page.locator('#main-content form button[type="submit"]').click();
  116 |   await selector(page).selectOption('zh-CN');
  117 |   await expect(page.locator('.site-form-error')).toContainText('请检查用户名与密码');
  118 |   await expect(page.locator('input[type="password"]')).toHaveValue('invalid');
  119 |   await page.locator('.cc-trigger').click();
  120 |   await page.locator('.cc-tabs button').nth(1).click();
  121 |   await page.locator('.cc-header .language-switcher select').selectOption('fr');
  122 |   await expect(page.locator('.cc-tabs button').nth(1)).toHaveAttribute('aria-selected', 'true');
  123 |   await expect(page.locator('.cc-title h2')).toHaveText('Centre de contrôle');
  124 |   await expect(page.locator('.cc-body')).toContainText('Profil visuel');
  125 | });
  126 | 
  127 | test('URL wins over stored preference and unknown localized paths show localized 404', async ({ page }) => {
  128 |   await page.addInitScript(() => localStorage.setItem('tamboril-language', 'zh-CN'));
  129 |   await page.goto('/about');
  130 |   await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  131 |   await page.goto('/es/about?origen=prueba#proceso');
  132 |   await expect(page).toHaveURL(/\/about\?origen=prueba#proceso$/);
  133 |   for (const language of supportedLanguages) {
  134 |     await page.goto(localizePath('/no-existe', language));
  135 |     await expect(page.locator('.site-empty-state h1')).toBeVisible();
  136 |     await expect(page.locator('html')).toHaveAttribute('lang', language);
  137 |     await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  138 |     await expect(page.locator('.site-empty-state a')).toHaveAttribute('href', localizePath('/', language));
  139 |   }
  140 |   await page.goto('/de/about');
  141 |   await expect(page.locator('.site-empty-state')).toBeVisible();
  142 | });
  143 | 
  144 | test('selector remains available with hidden navbar, sharing layout settings across languages', async ({ page }) => {
  145 |   await page.addInitScript(() => localStorage.setItem('tamborilero-layout-storage', JSON.stringify({ state: { pagesConfig: { '/about': { showNavbar: false, showFooter: true, showHeader: false, navbarSticky: false } } }, version: 0 })));
  146 |   await page.goto('/about');
  147 |   await expect(page.locator('.site-nav')).toHaveCount(0);
  148 |   await page.locator('.language-switcher--floating select').selectOption('zh-CN');
  149 |   await expect(page).toHaveURL(/\/zh-CN\/about$/);
  150 |   await expect(page.locator('.site-nav')).toHaveCount(0);
  151 | });
  152 | 
  153 | test('navigation history, Chinese mobile and French layouts remain usable', async ({ page }) => {
  154 |   await page.goto('/fr');
  155 |   await page.locator('.site-nav-links a[href="/fr/about"]').click();
  156 |   await expect(page).toHaveURL(/\/fr\/about$/);
  157 |   await selector(page).selectOption('zh-CN');
> 158 |   await expect(page).toHaveURL(/\/zh-CN\/about$/);
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  159 |   await page.goBack();
  160 |   await expect(page).toHaveURL(/\/fr$/);
  161 |   await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  162 |   await page.goForward();
  163 |   await expect(page).toHaveURL(/\/zh-CN\/about$/);
  164 |   await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  165 |   await page.setViewportSize({ width: 375, height: 812 });
  166 |   for (const language of ['fr', 'zh-CN']) {
  167 |     await page.goto(localizePath('/', language));
  168 |     await page.locator('.site-nav-toggle').click();
  169 |     await expect(selector(page)).toBeVisible();
  170 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
  171 |     await page.locator('.site-nav-toggle').click();
  172 |     await page.screenshot({ path: `test-results/home-${language}-mobile.png`, fullPage: true });
  173 |   }
  174 | });
  175 | 
```