import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { prep } from './setup.mjs';
import fs from 'fs';

const W = 792, BAND = 198;   // × DSF 2  →  1584 × 396
const sway = fs.readFileSync('sway.js','utf8');
const ble  = fs.readFileSync('ble.js','utf8');
const b = await chromium.launch();

async function band(p, sel, out, dy=0){
  const box = await p.locator(sel).first().boundingBox();
  if (!box) throw new Error('no box for '+sel);
  let y = Math.round(box.y + box.height/2 - BAND/2 + dy);
  const maxY = await p.evaluate(()=>Math.max(document.documentElement.clientHeight, window.innerHeight)) - BAND;
  y = Math.max(0, Math.min(y, maxY));
  await p.screenshot({ path:`banner/${out}.png`, clip:{ x:0, y, width:W, height:BAND } });
  console.log(out, '→ y=',y, 'elem', Math.round(box.y), Math.round(box.height));
}

// ── 1 · Fuerza · curva en vivo ──────────────────────────────────────────────
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
  await p.screenshot({path:'shots/f-live-full.png'});
  await band(p, '.live-chart-card', '1-fuerza-curva');
  await band(p, '.live-metrics-grid', '1b-fuerza-metricas', 60);
  await ctx.close();
}

// ── 2/3 · Equilibrio · estabilograma + score ────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:900}, deviceScaleFactor:2 });
  await prep(ctx); await ctx.addInitScript(sway);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/balance/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2000);
  await p.evaluate(()=>{ window.__swayLevel=1.0; _openSetup('ft-eo'); });
  await p.waitForTimeout(500);
  await p.evaluate(()=>startTest());
  await p.waitForTimeout(35500);
  await p.waitForTimeout(1500);
  await p.screenshot({path:'shots/b-res-full.png'});
  await band(p, '#stabilityCircle', '2-equilibrio-score', 30);
  const sb = await p.$('#view-results .results-scroll-body');
  await sb.evaluate(e=>e.scrollTop = e.scrollHeight); await p.waitForTimeout(1200);
  await p.screenshot({path:'shots/b-cop-full.png'});
  const cb = await p.locator('#copChart').boundingBox();
  console.log('copChart box', cb);
  await band(p, '#copChart', '3-equilibrio-estabilograma');
  await ctx.close();
}

// ── 4 · ROM rodilla ─────────────────────────────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:900}, deviceScaleFactor:2 });
  await prep(ctx);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/motion/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2200);
  await p.evaluate(()=>{
    const set=(r,m,s,mo,v)=>{ if(state.measurements[r]?.[m]?.[s]) state.measurements[r][m][s][mo]=v; };
    set('rodilla','flexion','izquierda','activa',132); set('rodilla','flexion','izquierda','pasiva',138);
    set('rodilla','flexion','derecha','activa',118);   set('rodilla','flexion','derecha','pasiva',126);
    set('rodilla','pkb','izquierda','activa',136);     set('rodilla','pkb','izquierda','pasiva',142);
    set('rodilla','pkb','derecha','activa',121);       set('rodilla','pkb','derecha','pasiva',128);
    set('rodilla','extension','izquierda','activa',0); set('rodilla','extension','izquierda','pasiva',-2);
    set('rodilla','extension','derecha','activa',6);   set('rodilla','extension','derecha','pasiva',4);
    renderRegionGrid(); selectRegion('rodilla');
  });
  await p.waitForTimeout(900);
  await p.screenshot({path:'shots/m-knee-full.png'});
  await band(p, '#movementGrid .movement-card', '4-rom-rodilla');
  await ctx.close();
}

// ── 5 · Hub · suite completa ────────────────────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:900}, deviceScaleFactor:2 });
  await prep(ctx);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2200);
  await p.click('#act-demo-btn').catch(()=>{});
  await p.waitForTimeout(4000);
  await p.screenshot({path:'shots/h-full.png'});
  await ctx.close();
}
await b.close();
