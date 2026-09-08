import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { prep } from './setup.mjs';
const W=792, BAND=198;
const b = await chromium.launch();

// ── Wiki · tiempos de cicatrización ────────────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:900}, deviceScaleFactor:2 });
  await prep(ctx);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/wiki/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2200);
  await p.locator('text=Tiempos de Tejido').first().click();
  await p.waitForTimeout(1600);
  const rows = await p.evaluate(()=>[...document.querySelectorAll('tr,.row,div')].filter(e=>/Rotura G\. II$|Esguince G\. II$/.test(e.textContent.trim())).map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent.trim().slice(0,20),y:Math.round(r.y),h:Math.round(r.height)};}));
  console.log('rows', JSON.stringify(rows.slice(0,4)));
  const y = rows.length ? Math.round(rows[0].y + rows[0].h/2 - BAND/2) : 300;
  await p.screenshot({ path:'banner/2-wiki-cicatrizacion.png', clip:{x:0,y:Math.max(0,y),width:W,height:BAND} });
  console.log('wiki band y', y);
  await ctx.close();
}

// ── Hub · rejilla de la suite ──────────────────────────────────────────────
{
  const ctx = await b.newContext({ viewport:{width:W,height:900}, deviceScaleFactor:2 });
  await prep(ctx);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8080/physiq/', {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2200);
  await p.click('#act-demo-btn').catch(()=>{});
  await p.waitForTimeout(4000);
  const cards = await p.evaluate(()=>[...document.querySelectorAll('.app-card')].map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent.trim().split('\n')[0], y:Math.round(r.y), h:Math.round(r.height)};}));
  console.log(JSON.stringify(cards));
  const row2 = cards[3];
  const y = Math.round(row2.y + row2.h/2 - BAND/2);
  await p.screenshot({ path:'banner/5-hub-suite.png', clip:{x:0,y:Math.max(0,y),width:W,height:BAND} });
  console.log('hub band y', y);
  await ctx.close();
}
await b.close();
