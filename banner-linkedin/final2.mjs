import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { prep } from './setup.mjs';
import fs from 'fs';
const W=792, BAND=198;
const sway=fs.readFileSync('sway.js','utf8'), ble=fs.readFileSync('ble.js','utf8');
const b = await chromium.launch();

// ── Fuerza: variante métricas + curva ───────────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:660}, deviceScaleFactor:2 });
  await prep(ctx); await ctx.addInitScript(ble);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/force/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);
  await p.evaluate(()=>bleConnect()); await p.waitForTimeout(1200);
  await p.evaluate(()=>document.getElementById('dialog-ble')?.close());
  await p.evaluate(()=>{ window.__t0=null; window.__peak=32;
    window.__kgAt = t => { if (window.__t0===null) return 0.05*Math.random();
      const x=t-window.__t0; if(x<0) return 0.05*Math.random();
      const r=Math.min(1,x/0.9), P=window.__peak;
      return r*(P + 0.035*P*Math.sin(2*Math.PI*0.25*x) + 0.015*P*Math.sin(2*Math.PI*0.95*x)) + (Math.random()-0.5)*0.35; }; });
  await p.evaluate(()=>document.querySelector('[data-test="live"]').click()); await p.waitForTimeout(500);
  await p.evaluate(()=>{ const c=document.getElementById('live-zone-check'); c.checked=true; c.dispatchEvent(new Event('change',{bubbles:true})); });
  await p.waitForTimeout(300);
  await p.evaluate(()=>{ const mn=document.getElementById('live-min-input'), mx=document.getElementById('live-max-input');
    mn.value='28'; mn.dispatchEvent(new Event('input',{bubbles:true}));
    mx.value='36'; mx.dispatchEvent(new Event('input',{bubbles:true})); });
  await p.evaluate(()=>document.getElementById('btn-start-live').click());
  await p.waitForTimeout(1400);
  await p.evaluate(()=>{ window.__t0 = window.__bleT(); });
  await p.waitForTimeout(9500);
  await p.screenshot({ path:'banner/1-fuerza-curva.png', clip:{x:0,y:250,width:W,height:BAND} });
  await p.screenshot({ path:'banner/alt-fuerza-solo-curva.png', clip:{x:0,y:358,width:W,height:BAND} });
  await ctx.close();
}

// ── Equilibrio: anillo bien encuadrado ──────────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:900}, deviceScaleFactor:2 });
  await prep(ctx); await ctx.addInitScript(sway);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/balance/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);
  await p.evaluate(()=>{ window.__swayLevel=1.0; _openSetup('ft-eo'); });
  await p.waitForTimeout(500);
  await p.evaluate(()=>startTest());
  await p.waitForTimeout(36000);
  await p.waitForTimeout(1500);
  const box = await p.locator('#stabilityCircle').boundingBox();
  console.log('ring', box);
  await p.screenshot({ path:'banner/4-equilibrio-score.png', clip:{x:0,y:Math.round(box.y-18),width:W,height:BAND} });
  await ctx.close();
}

// ── Hub: dos filas de la rejilla, capturadas anchas y reescaladas ───────────
{
  const WW=1188, HH=297;
  const ctx = await b.newContext({ viewport:{width:WW,height:900}, deviceScaleFactor:2 });
  await prep(ctx);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2200);
  await p.click('#act-demo-btn').catch(()=>{});
  await p.waitForTimeout(4000);
  await p.screenshot({path:'shots/h-full-1188.png'});
  const cards = await p.locator('.launch-card, .sat-card, a[href], .card').all();
  const boxes = await p.evaluate(()=>[...document.querySelectorAll('#satGrid > *, .hub-grid > *, main > * > *')].slice(0,12).map(e=>({c:e.className, y:Math.round(e.getBoundingClientRect().y), h:Math.round(e.getBoundingClientRect().height)})));
  console.log(JSON.stringify(boxes));
  await ctx.close();
}
await b.close();
