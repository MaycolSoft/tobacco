// Offline asset preparation with existing Playwright/Chromium; no extra packages.
// Usage: node scripts/prepare-leaf-ribbon-assets.mjs albedo.png mid.png rolled.png
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const [albedo, mid, rolled] = process.argv.slice(2);
const out = 'public/img/art/leaf-ribbon';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const sources = await Promise.all([albedo, mid, rolled].map(async path => `data:image/png;base64,${(await readFile(path)).toString('base64')}`));
  const outputs = await page.evaluate(async sources => {
    const images = await Promise.all(sources.map(src => new Promise((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = src; })));
    const canvas = (w,h) => { const c = document.createElement('canvas'); c.width=w; c.height=h; return c; };
    const original = canvas(images[0].width, images[0].height);
    const ctx = original.getContext('2d', { willReadFrequently: true }); ctx.drawImage(images[0],0,0);
    const pixels = ctx.getImageData(0,0,original.width,original.height);
    let minX=original.width,minY=original.height,maxX=0,maxY=0;
    for(let y=0;y<original.height;y++) for(let x=0;x<original.width;x++) if(pixels.data[(y*original.width+x)*4+3]>64) { minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y); }
    const c=canvas(2048,512), cc=c.getContext('2d',{willReadFrequently:true});
    cc.drawImage(original,minX,minY,maxX-minX+1,maxY-minY+1,4,4,2040,504);
    const data=cc.getImageData(0,0,2048,512), alpha=canvas(2048,512), ac=alpha.getContext('2d'), mask=ac.createImageData(2048,512);
    // Keep albedo alpha as well as the explicit aligned silhouette map.
    for(let i=0;i<data.data.length;i+=4) { mask.data[i]=mask.data[i+1]=mask.data[i+2]=data.data[i+3];mask.data[i+3]=255; }
    ac.putImageData(mask,0,0);
    const normal=canvas(1024,256), nc=normal.getContext('2d',{willReadFrequently:true});nc.drawImage(c,0,0,1024,256);
    const d=nc.getImageData(0,0,1024,256), n=nc.createImageData(1024,256);
    const height=(x,y)=> {const i=(Math.max(0,Math.min(255,y))*1024+Math.max(0,Math.min(1023,x)))*4;return d.data[i+3]<128 ? 0.4 : (d.data[i]*.2126+d.data[i+1]*.7152+d.data[i+2]*.0722)/255;};
    for(let y=0;y<256;y++) for(let x=0;x<1024;x++) { const i=(y*1024+x)*4;const dx=(height(x-1,y)-height(x+1,y))*2.2,dy=(height(x,y+1)-height(x,y-1))*2.2;const length=Math.hypot(dx,dy,1);n.data[i]=(dx/length*.5+.5)*255;n.data[i+1]=(dy/length*.5+.5)*255;n.data[i+2]=(1/length*.5+.5)*255;n.data[i+3]=255; }
    nc.putImageData(n,0,0);
    const poster=image=> {const p=canvas(840,420),pc=p.getContext('2d');const scale=Math.min(840/image.width,420/image.height);pc.drawImage(image,(840-image.width*scale)/2,(420-image.height*scale)/2,image.width*scale,image.height*scale);return p;};
    return [c,alpha,normal,poster(images[1]),poster(images[2])].map(c=>c.toDataURL('image/png').split(',')[1]);
  }, sources);
  for(const [i,name] of ['leaf-albedo','leaf-alpha','leaf-normal','leaf-poster-mid','leaf-poster-rolled'].entries()) {
    const path=`/tmp/tobacco-${name}.png`;
    await writeFile(path,Buffer.from(outputs[i],'base64'));
    execFileSync('cwebp',[...(name==='leaf-alpha'?['-lossless']:['-q',name==='leaf-normal'?'80':name==='leaf-albedo'?'65':'83']),path,'-o',`${out}/${name}.webp`],{stdio:'ignore'});
  }
} finally { await browser.close(); }
