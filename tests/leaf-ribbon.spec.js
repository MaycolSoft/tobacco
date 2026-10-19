import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
// GPU screenshot tracing changes the performance being measured; explicit screenshots remain below.
test.use({ trace: 'off' });
const root = page => page.locator('#recorrido .leaf-ribbon');
async function settle(page) { await page.waitForTimeout(850); }
async function scrollProgress(page, p) {
  await page.evaluate(p => {
    const section = document.querySelector('#recorrido');
    const top = section.getBoundingClientRect().top + scrollY;
    const start = top - innerHeight * .7;
    const end = top + section.offsetHeight - innerHeight * .4;
    scrollTo(0, start + (end - start) * p);
  }, p);
  await settle(page);
}
const watchErrors = page => {
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('console', msg=> { if (/GPU stall due to ReadPixels/.test(msg.text())) return; if(msg.type()==='error' || (msg.type()==='warning' && /webgl|three|shader/i.test(msg.text()))) errors.push(msg.text()); });
  return errors;
};
test('desktop lazy, stable layout, reversible scrub and clean navigation', async ({ page }, testInfo) => {
  await page.setViewportSize({ width:1440, height:900 });
  const errors=watchErrors(page), requests=[];
  page.on('request', request=>requests.push(request.url()));
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await expect(root(page)).toHaveAttribute('aria-hidden','true');
  expect(await root(page).getAttribute('tabindex')).toBeNull();
  expect(requests.filter(url=>/leafRibbonRenderer|leaf-(albedo|alpha|normal)/.test(url))).toEqual([]);
  const height = await page.locator('#recorrido').evaluate(el=>el.offsetHeight);
  const without = await root(page).evaluate(el=>{ el.style.display='none';const h=el.closest('section').offsetHeight;el.style.display='';return h; });
  expect(Math.abs(height-without)).toBeLessThanOrEqual(2);
  for (const p of [0,.5,1,.5,0]) {
    await scrollProgress(page,p);
    await expect(root(page)).toHaveAttribute('data-mode','webgl');
    expect(Math.abs(Number(await root(page).getAttribute('data-progress'))-p)).toBeLessThan(.04);
    await page.screenshot({path:testInfo.outputPath(`desktop-${p}.png`)});
  }
  await scrollProgress(page,.5);
  const shape=await root(page).boundingBox();
  for(const selector of ['.site-lead','.site-text-link']) {
    const text=await page.locator(`#recorrido ${selector}`).boundingBox();
    expect(shape.y).toBeGreaterThanOrEqual(text.y+text.height);
  }
  await page.locator('.site-nav a[href="/about"]').first().click();
  await expect(page.locator('.leaf-ribbon')).toHaveCount(0);
  await page.goBack();
  await scrollProgress(page,.5);
  await expect(root(page)).toHaveAttribute('data-mode','webgl');
  expect(errors).toEqual([]);
});
for(const width of [390,860,861,1080]) test(`poster only at ${width}px`, async ({page},testInfo)=>{
  await page.setViewportSize({width,height:844});
  const errors=watchErrors(page),requests=[];
  page.on('request', r=>requests.push(r.url()));
  await page.goto('/');await root(page).scrollIntoViewIfNeeded();await settle(page);
  await expect(root(page).locator('canvas')).toHaveCount(0);
  await expect(root(page)).toHaveAttribute('data-mode','poster');
  expect(await root(page).locator('img').evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect(requests.filter(url=>/leafRibbonRenderer|leaf-(albedo|alpha|normal)/.test(url))).toEqual([]);
  await page.screenshot({path:testInfo.outputPath(`poster-${width}.png`)});
  expect(errors).toEqual([]);
});
test('reduced motion, resize, saveData and context loss fall back', async ({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');await root(page).scrollIntoViewIfNeeded();
  await expect(root(page)).toHaveAttribute('data-progress','1');
  expect(await root(page).locator('img').evaluate(img=>img.currentSrc)).toContain('leaf-poster-rolled.webp');
  await expect(root(page).locator('canvas')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(root(page)).toHaveAttribute('data-mode','webgl');
  await page.evaluate(()=>{ Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange')); });
  await expect(root(page)).toHaveAttribute('data-running','false');
  await page.evaluate(()=>{ Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange')); });
  await expect(root(page)).toHaveAttribute('data-running','true');
  await page.setViewportSize({width:1000,height:900});
  await expect(root(page).locator('canvas')).toHaveCount(0);
  await page.setViewportSize({width:1440,height:900});
  await expect(root(page)).toHaveAttribute('data-mode','webgl');
  await root(page).locator('canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await expect(root(page)).toHaveAttribute('data-mode','poster');
  await expect(root(page).locator('canvas')).toHaveCount(0);
  await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:Object.assign(new EventTarget(),{saveData:true})}));
  await page.reload();await root(page).scrollIntoViewIfNeeded();await settle(page);
  await expect(root(page).locator('canvas')).toHaveCount(0);
});
for(const lang of ['en','fr','zh-CN']) test(`localized composition ${lang}`,async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto(`/${lang}`);
  await scrollProgress(page,.5);await expect(root(page)).toHaveAttribute('data-mode','webgl');
  const leaf=await root(page).boundingBox(),link=await page.locator('#recorrido .site-text-link').boundingBox();
  expect(leaf.y).toBeGreaterThanOrEqual(link.y+link.height);
});
test('scroll restores from hash/reload and pauses offscreen',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#recorrido-pasos');
  await page.locator('#recorrido').scrollIntoViewIfNeeded();
  await expect(root(page)).toHaveAttribute('data-mode','webgl');
  await scrollProgress(page,.5);
  await expect(root(page)).toHaveAttribute('data-running','true');
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
  await expect(root(page)).toHaveAttribute('data-running','false');
  await scrollProgress(page,.5);
  await expect(root(page)).toHaveAttribute('data-running','true');
  // MainLayout intentionally resets scroll on load. Simulate the browser restoring it later.
  await page.reload();
  await scrollProgress(page,.5);
  await expect(root(page)).toHaveAttribute('data-mode','webgl');
  expect(Number(await root(page).getAttribute('data-progress'))).toBeCloseTo(.5,1);
});
test('failed texture keeps visible poster and removes canvas',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.route('**/leaf-normal.webp', route=>route.abort());
  await page.goto('/');await scrollProgress(page,.5);
  await expect(root(page)).toHaveAttribute('data-fallback','unavailable');
  await expect(root(page).locator('canvas')).toHaveCount(0);
  await expect(root(page).locator('picture')).toBeVisible();
});
test.describe('performance without screenshot tracing overhead',()=>{
  test('scroll performance and zero ribbon layout shift after load',async({page},testInfo)=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  await scrollProgress(page,.5);await expect(root(page)).toHaveAttribute('data-mode','webgl');
  const metrics = await page.evaluate(async()=>{
    const tasks=[],shifts=[],frames=[];
    const taskObserver=new PerformanceObserver(list=>tasks.push(...list.getEntries().map(e=>({duration:e.duration,startTime:e.startTime}))));
    const shiftObserver=new PerformanceObserver(list=>shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value)));
    taskObserver.observe({type:'longtask'});shiftObserver.observe({type:'layout-shift'});
    const section=document.querySelector('#recorrido'),top=section.getBoundingClientRect().top+scrollY;
    const start=top-innerHeight*.7,end=top+section.offsetHeight-innerHeight*.4;
    let last=performance.now();
    for(let i=0;i<120;i++) {
      await new Promise(requestAnimationFrame);
      const now=performance.now();frames.push(now-last);last=now;
      const p=i<60?i/60:(120-i)/60;scrollTo(0,start+(end-start)*p);
    }
    await new Promise(resolve=>setTimeout(resolve,100));
    taskObserver.disconnect();shiftObserver.disconnect();
    return {longTasks:tasks,cls:shifts.reduce((a,b)=>a+b,0),maxFrameMs:Math.max(...frames),frames:frames.length};
  });
  await writeFile(testInfo.outputPath('scroll-performance.json'),JSON.stringify(metrics,null,2));
  await testInfo.attach('scroll-performance.json',{body:JSON.stringify(metrics,null,2),contentType:'application/json'});
  expect(metrics.cls).toBe(0);
  expect(metrics.longTasks.filter(task=>task.duration>50)).toEqual([]);
});

});
