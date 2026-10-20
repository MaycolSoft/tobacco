import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
test.use({ trace: 'off' });
const knot = page => page.locator('#proceso .layer-knot');
const captureErrors = page => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  return errors;
};
async function progress(page, p) {
  await page.evaluate(p => {
    const el = document.querySelector('.layer-knot'), y = el.getBoundingClientRect().top + scrollY;
    scrollTo(0, y - innerHeight * .75 + (el.offsetHeight + innerHeight * .5) * p);
  }, p);
  await expect.poll(async () => Number(await knot(page).getAttribute('data-progress'))).toBeCloseTo(p, 1);
}
test('O2 lazy rendering, stable layout and reversible visible scroll', async ({ page }, info) => {
  await page.setViewportSize({width:1440,height:900});
  const errors=captureErrors(page), requests=[];
  page.on('request', r => requests.push(r.url()));
  await page.goto('/about'); await page.evaluate(()=>document.fonts.ready);
  await expect(knot(page)).toHaveAttribute('aria-hidden','true');
  expect(requests.filter(url=>/LayerKnotRenderer/.test(url))).toEqual([]);
  const layout = await page.locator('#proceso').evaluate(section=>{
    const root=section.querySelector('.layer-knot');
    const read=()=>['.site-section-heading','.site-lead','.site-chapter-nav','.site-process-chapters'].map(s=>{
      const r=section.querySelector(s).getBoundingClientRect();return [r.x,r.y,r.width,r.height];
    });
    const before=read(), display=root.style.display;root.style.display='none';const after=read();root.style.display=display;
    return {before,after};
  });
  layout.before.flat().forEach((v,i)=>expect(Math.abs(v-layout.after.flat()[i])).toBeLessThanOrEqual(2));
  for (const p of [0,.5,1,.5,0]) {
    await progress(page,p); await expect(knot(page)).toHaveAttribute('data-mode','webgl');
    await expect(knot(page).locator('canvas')).toHaveCount(1);
    await page.screenshot({path:info.outputPath(`desktop-${p}.png`)});
  }
  const safe=await knot(page).evaluate(el=>{
    const r=el.getBoundingClientRect(),s=el.closest('section'),lead=s.querySelector('.site-lead').getBoundingClientRect();
    const pills=[...s.querySelectorAll('.site-chapter-nav a')].map(a=>a.getBoundingClientRect().right);
    return {left:r.left,minLeft:Math.max(lead.left,Math.max(...pills)+24),top:r.top,minTop:lead.bottom+12,bottom:r.bottom,maxBottom:s.querySelector('.site-process-chapters').getBoundingClientRect().top-12};
  });
  expect(safe.left).toBeGreaterThanOrEqual(safe.minLeft-.5);expect(safe.top).toBeGreaterThanOrEqual(safe.minTop-.5);expect(safe.bottom).toBeLessThanOrEqual(safe.maxBottom+.5);
  expect(errors).toEqual([]);
});
test('O2 pill focus has priority over hover and restores emphasis',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/about');await progress(page,.5);
  const links=page.locator('#proceso .site-chapter-nav a');
  await links.nth(0).focus();await expect(knot(page)).toHaveAttribute('data-emphasis','0');
  await links.nth(1).hover();await expect(knot(page)).toHaveAttribute('data-emphasis','0');
  await links.nth(0).evaluate(el=>el.blur());await expect(knot(page)).toHaveAttribute('data-emphasis','1');
  await page.mouse.move(0,0);await expect(knot(page)).toHaveAttribute('data-emphasis','-1');
  await links.nth(2).focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#elaboracion$/);
});
for(const width of [390,860,861,1080]) test(`O2 static responsive ${width}`,async({page},info)=>{
  await page.setViewportSize({width,height:900});const errors=captureErrors(page);await page.goto('/about');
  await page.locator('#proceso').scrollIntoViewIfNeeded();
  await expect(knot(page)).toHaveAttribute('data-mode',width<=860?'hidden':'static');
  await expect(knot(page).locator('canvas')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:info.outputPath(`responsive-${width}.png`)});expect(errors).toEqual([]);
});
test('O2 reduced motion, resize, context loss and saveData',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/about');await knot(page).scrollIntoViewIfNeeded();await expect(knot(page)).toHaveAttribute('data-mode','static');
  await expect(knot(page).locator('canvas')).toHaveCount(0);await expect(knot(page)).toHaveAttribute('data-progress','1.0000');
  await page.emulateMedia({reducedMotion:'no-preference'});await expect(knot(page)).toHaveAttribute('data-mode','webgl');
  await page.setViewportSize({width:1000,height:900});await expect(knot(page).locator('canvas')).toHaveCount(0);
  await page.setViewportSize({width:1440,height:900});await expect(knot(page)).toHaveAttribute('data-mode','webgl');
  await knot(page).locator('canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await expect(knot(page)).toHaveAttribute('data-mode','static');await expect(knot(page).locator('canvas')).toHaveCount(0);
  await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:Object.assign(new EventTarget(),{saveData:true})}));
  await page.reload();await knot(page).scrollIntoViewIfNeeded();await expect(knot(page)).toHaveAttribute('data-mode','static');await expect(knot(page).locator('canvas')).toHaveCount(0);
});
test('O2 repeated SPA mount/unmount and localized composition',async({page})=>{
  await page.setViewportSize({width:1440,height:900});const errors=captureErrors(page);await page.goto('/about');
  for(let i=0;i<10;i++) {
    await progress(page,.5);await expect(knot(page).locator('canvas')).toHaveCount(1);
    await page.locator('.site-nav a[href="/"]').first().click();await expect(page.locator('.layer-knot')).toHaveCount(0);
    await page.locator('.site-nav a[href="/about"]').first().click();await expect(knot(page)).toHaveCount(1);
  }
  for(const lang of ['en','fr','zh-CN']) {
    await page.goto(`/${lang}/about`);await progress(page,.5);await expect(knot(page)).toHaveAttribute('data-mode','webgl');
  }
  expect(errors).toEqual([]);
});

test('O2 scroll performance after warmup',async({page},info)=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/about');await progress(page,.5);await expect(knot(page)).toHaveAttribute('data-mode','webgl');
  const metrics=await page.evaluate(async()=>{
    const tasks=[],shifts=[],frames=[];
    const t=new PerformanceObserver(list=>tasks.push(...list.getEntries().map(e=>e.duration)));
    const s=new PerformanceObserver(list=>shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>({value:e.value,sources:e.sources?.map(s=>({node:s.node?.className,knot:!!s.node?.closest?.('.layer-knot'),previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))}))));
    t.observe({type:'longtask'});s.observe({type:'layout-shift'});
    const el=document.querySelector('.layer-knot'),y=el.getBoundingClientRect().top+scrollY,start=y-innerHeight*.75,length=el.offsetHeight+innerHeight*.5;
    let last=performance.now();
    for(let i=0;i<120;i++) {await new Promise(requestAnimationFrame);const now=performance.now();frames.push(now-last);last=now;scrollTo(0,start+length*(i<60?i/60:(120-i)/60));}
    await new Promise(resolve=>setTimeout(resolve,100));t.disconnect();s.disconnect();
    return {longTasks:tasks,cls:shifts.reduce((a,b)=>a+b.value,0),shifts,maxFrameMs:Math.max(...frames)};
  });
  await writeFile(info.outputPath('scroll-performance.json'),JSON.stringify(metrics,null,2));
  await info.attach('scroll-performance.json',{body:JSON.stringify(metrics,null,2),contentType:'application/json'});
  // Global shifts can include existing navbar transitions; preserve all sources and timings.
  expect(metrics.shifts.filter(shift=>shift.sources?.some(source=>source.knot))).toEqual([]);
});

test('O2 uses the latest visibility observation when exit and entry are batched', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver;
    window.__o2BatchedVisibility = false;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback, options) {
        super((entries, observer) => {
          const latest = entries.at(-1);
          if (latest?.target.classList.contains('layer-knot') && latest.isIntersecting) {
            window.__o2BatchedVisibility = true;
            // Native observers can queue an older exit and current entry together.
            callback([{ target: latest.target, isIntersecting: false }, ...entries], observer);
          } else callback(entries, observer);
        }, options);
      }
    };
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  await page.evaluate(() => document.fonts.ready);
  await progress(page, .5);
  await expect.poll(() => page.evaluate(() => window.__o2BatchedVisibility)).toBe(true);
  await expect(knot(page)).toHaveAttribute('data-mode', 'webgl');
  await expect(knot(page).locator('canvas')).toHaveCount(1);
});
