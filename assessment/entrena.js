// Entrena (entrena.html): juego para memorizar los árboles de decisión (fase 4) y los tests
// de confirmación (fase 4b) de las 7 regiones, con la numeración de las hojas impresas.
// Lee data/ con módulos puros (lib/entrena.js): nunca pide ni guarda datos del paciente.
// Guarda en localStorage solo el progreso de cada región y sus preferencias
// (physiq-entrena-*), como la guía guarda el tema. Diseño y decisiones: docs/entrena.md.
import { CIF_TREES, HYPOTHESES } from './data.js';
import { ORDEN_REGIONES } from './lib/esquemas.js';
import { VERSION_SHA, textoVersion, esVersionNueva } from './lib/version.js';
import { datosRegion, columnasPasos, segundosLectura, mulberry32, semilla, codigoResultado as codigoRes, leerCodigo as leerCod } from './lib/entrena.js';
import { DESTINOS_IA, destinoIA, guardarDestinoIA, promptPregunta, TIPOS_PREGUNTA, TIPO_PREGUNTA_DEFECTO, MAX_TEXTO_IA, urlIA, NOTA_CUENTAS,
  iaParrafoHTML, attrIA, atributosIA, ctxArbol, ctxTest, initAmpliarIA } from './ampliar-ia.js';

const DATOS = Object.fromEntries(ORDEN_REGIONES.map(r => [r, datosRegion(r, CIF_TREES, HYPOTHESES)]));
const PREFS_CLAVE = 'physiq-entrena-prefs';
let PREFS = { region: 'codo', sonido: null };
try { Object.assign(PREFS, JSON.parse(localStorage.getItem(PREFS_CLAVE)) || {}); } catch (e) {}
if (!DATOS[PREFS.region]) PREFS.region = 'codo';
if (PREFS.sonido === null) { try { const v = JSON.parse(localStorage.getItem('physiq-entrena-codo-v1')); PREFS.sonido = v && v.sonido === false ? false : true; } catch (e) { PREFS.sonido = true; } }
const guardarPrefs = () => { try { localStorage.setItem(PREFS_CLAVE, JSON.stringify(PREFS)); } catch (e) {} };
let REG, PASOS, HIP, CLAVE, TARJETAS, OPS, PREGUNTABLES, TESTS, P;
const SEGUNDOS = 15;
const URL_GUIA = 'guia.html';

/* ---------- Azar con semilla (reto del día y duelo: mismas preguntas para todos) ---------- */
let RNG = Math.random;

/* ---------- Datos derivados ---------- */
const nombreCorto = id => HIP[id].name.split(' (')[0];
const nombreSub = id => { const m = HIP[id].name.match(/\((.*)\)/); return m ? m[1] : ''; };
const claveRes = o => (o.deriv ? 'D|' : '') + (o.h.length ? o.h.slice().sort().join('+') : (o.deriv ? '' : '0'));
const claveSel = arr => { const d = arr.includes('D'), h = arr.filter(x => x !== 'D' && x !== '0').sort(); return (d ? 'D|' : '') + (h.length ? h.join('+') : (d ? '' : '0')); };
const clase = o => o.deriv ? 'D' : o.h.length ? 'H' : '0';
const neutral = s => s.opts.find(o => !o.h.length && !o.deriv);
// Esencia de un paso: su título en la app y la primera frase de su «¿Por qué esta pregunta?».
const titPaso = s => s.tit || ('Paso ' + s.num);
const primeraFrase = t => { const m = t.match(/^(.+?\.)\s+(?=[A-ZÁÉÍÓÚÑ¿¡«(])/); return m ? m[1] : t; };
const hallazgo = o => (o.t === 'SÍ' || o.t === 'NO') && o.d ? o.d : o.t + (o.d ? ': ' + o.d : '');
const corta = (t, n) => t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
// Un paso es de desvío cuando sus respuestas llevan a pasos distintos (lumbar 1: SÍ → 1b, NO → 2).
const esRama = s => new Set(s.opts.map(o => o.next)).size > 1;
const numDe = id => id ? PASOS.find(x => x.id === id).num : null;
const destinoTxt = id => id ? 'sigue en el paso ' + numDe(id) : 'fin del árbol';
function usarRegion(r) {
  REG = { id: r, nombre: DATOS[r].nombre, min: DATOS[r].nombre.toLowerCase() };
  PASOS = DATOS[r].steps; HIP = DATOS[r].hyp; CLAVE = 'physiq-entrena-' + r + '-v1';
  TARJETAS = [];
  PASOS.forEach((s, si) => {
    TARJETAS.push({ clave: 'q:' + s.id, tipo: 'paso', s, si });
    s.opts.forEach((o, i) => TARJETAS.push({ clave: s.id + ':' + i, tipo: 'op', s, si, o, i }));
  });
  OPS = TARJETAS.filter(t => t.tipo === 'op');
  // Lo que entra en los modos rápidos: «NO → sin hipótesis» se deduce leyendo y no enseña nada; los desvíos sí.
  PREGUNTABLES = TARJETAS.filter(t => t.tipo === 'paso' || clase(t.o) !== '0' || esRama(t.s));
  TESTS = Object.entries(HIP).flatMap(([hid, h]) => h.tests.map((x, i) => ({ clave: 't:' + hid + ':' + i, tipo: 'test', hid, i, x })));
  P = cargar();
}
const tarjetaDe = o => OPS.find(t => t.o === o);
const pasoDe = o => PASOS.find(s => s.opts.includes(o));

/* ---------- Progreso guardado ---------- */
function base() {
  return { cajas: {}, partidas: 0, sinDerivSeguidas: 0, logros: {}, diarios: {}, duelos: {}, racha: { n: 0, ultimo: '', max: 0 },
    mejor: { flechas: 0, caso: 0, casoPct: 0, bateria: 0, dequien: 0, positivo: 0, pesa: 0, hoja: { 1: 0, 2: 0, 3: 0, 4: 0 }, hojaSeg: 0, desliza: 0, deslizaAciertos: 0, enpaso: 0, completa: 0, error: 0, parejas: 0, detective: 0, semaforo: 0, subita: 0, ordena: 0 } };
}
function cargar() {
  const b = base();
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE));
    if (!p || !p.cajas) return b;
    const mejor = Object.assign(b.mejor, p.mejor || {});
    if (typeof mejor.hoja === 'number') mejor.hoja = { 1: mejor.hoja, 2: 0, 3: 0, 4: 0 };
    const racha = Object.assign(b.racha, p.racha || {}); racha.max = Math.max(racha.max || 0, racha.n || 0);
    return Object.assign(b, p, { mejor, racha });
  } catch (e) { return b; }
}
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(P)); } catch (e) {} }
const hoyStr = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const ayerStr = () => { const a = new Date(); a.setDate(a.getDate() - 1); return hoyStr(a); };
function sumarRacha() {
  const hoy = hoyStr(); if (P.racha.ultimo === hoy) return;
  P.racha.n = P.racha.ultimo === ayerStr() ? P.racha.n + 1 : 1; P.racha.ultimo = hoy; P.racha.max = Math.max(P.racha.max, P.racha.n);
}
const rachaVigente = () => [hoyStr(), ayerStr()].includes(P.racha.ultimo) ? P.racha.n : 0;
const caja = k => P.cajas[k] || 0;
const acierto = k => { P.cajas[k] = Math.min(5, caja(k) + 1); };
const fallo = k => { P.cajas[k] = 0; };
const dominioPaso = s => { const ts = TARJETAS.filter(t => t.s === s); return ts.reduce((a, t) => a + caja(t.clave), 0) / (ts.length * 5); };
function medalla() {
  const min = Math.min(...TARJETAS.map(t => caja(t.clave)));
  if (min >= 5 && P.mejor.hoja[4] === 100) return { n: 'Oro', c: 'var(--oro)', sig: 'Árbol dominado' };
  if (min >= 3) return { n: 'Plata', c: 'var(--plata)', sig: 'Oro: todas las tarjetas a tope y la hoja fantasma nivel 4 perfecta' };
  if (min >= 1) return { n: 'Bronce', c: 'var(--bronce)', sig: 'Plata: acierta cada tarjeta tres veces seguidas' };
  return null;
}

/* ---------- Logros ---------- */
let U = null; // resumen de la última partida
const LOGROS = [
  { id: 'primera', t: 'Primera partida', d: 'Juega cualquier modo', ok: () => P.partidas >= 1 },
  { id: 'diario', t: 'Reto del día', d: 'Completa un reto diario', ok: () => Object.keys(P.diarios).length >= 1 },
  { id: 'racha3', t: 'Tres días seguidos', d: 'Racha de 3 retos del día', ok: () => P.racha.max >= 3 },
  { id: 'racha7', t: 'Una semana', d: 'Racha de 7 retos del día', ok: () => P.racha.max >= 7 },
  { id: 'intacto', t: 'Intacto', d: 'Termina Flechas sin perder una vida', ok: () => U && U.modo === 'flechas' && U.vidas === 3 && U.n === 15 },
  { id: 'deriv10', t: 'Siempre derivo', d: '10 partidas seguidas sin fallar una derivación', ok: () => P.sinDerivSeguidas >= 10 },
  { id: 'caso5', t: 'Recorrido perfecto', d: 'Todos los pasos de un caso', ok: () => P.mejor.casoPct >= 100 },
  { id: 'hoja2min', t: 'Hoja en 2 minutos', d: 'Una hoja fantasma perfecta en menos de 2 minutos', ok: () => U && U.modo === 'hoja' && U.pct === 100 && U.seg < 120 },
  { id: 'jefe', t: 'Jefe final', d: 'Hoja fantasma nivel 4 perfecta', ok: () => P.mejor.hoja[4] === 100 },
  { id: 'subita20', t: 'Sangre fría', d: '20 seguidas en Muerte súbita', ok: () => P.mejor.subita >= 20 },
  { id: 'dedo', t: 'Dedo rápido', d: '25 aciertos en una partida de Desliza', ok: () => P.mejor.deslizaAciertos >= 25 },
  { id: 'ojo', t: 'Ojo clínico', d: 'Encuentra todos los errores sin falsas alarmas', ok: () => P.mejor.error >= 1 },
  { id: 'memoria', t: 'Memoria de elefante', d: 'Parejas en 8 intentos o menos', ok: () => P.mejor.parejas > 0 && P.mejor.parejas <= 8 },
  { id: 'menu', t: 'Menú completo', d: 'Todos los pasos exactos en Completa el paso', ok: () => P.mejor.completa >= rondasCompleta() },
  { id: 'bateria', t: 'Batería completa', d: '5 de 5 en Batería', ok: () => P.mejor.bateria >= 5 },
  { id: 'balanza', t: 'Balanza fina', d: '¿Cuánto pesa? sin un fallo', ok: () => U && U.modo === 'pesa' && U.vidas === 3 && U.n === 12 },
  { id: 'dominado', t: 'Árbol dominado', d: 'Todas las respuestas del árbol al máximo', ok: () => OPS.every(t => caja(t.clave) >= 5) },
];
function cerrarPartida(resumen) {
  U = resumen;
  if (J && J.ayuda) {
    // Con ayuda: se deshacen los récords de esta partida y no hay logros; el repaso de las tarjetas sí cuenta.
    if (J.mejorAntes) P.mejor = J.mejorAntes;
    guardar();
    const t = document.querySelector('.tarjeta.salta');
    if (t) { t.querySelectorAll('p').forEach(p => { p.innerHTML = p.innerHTML.replace(/Nuevo récord\.?\s*/g, ''); }); t.insertAdjacentHTML('beforeend', '<p class="progreso">Partida con ayuda: no cuenta para récords ni logros.</p>'); }
    return;
  }
  P.sinDerivSeguidas = J && J.derivFallo ? 0 : P.sinDerivSeguidas + 1;
  const nuevos = LOGROS.filter(l => !P.logros[l.id] && l.ok());
  nuevos.forEach(l => { P.logros[l.id] = hoyStr(); });
  guardar();
  if (nuevos.length) { setTimeout(() => { SON.logro(); vibrar([20, 30, 20]); }, 450); avisar('Logro: ' + nuevos.map(l => l.t).join(' · ')); }
}
/* ---------- Sonido (Web Audio, sin archivos), vibración y confeti ---------- */
let AC = null;
function audio() {
  if (!PREFS.sonido) return null;
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; }
}
function tono(f, t0, dur, tipo = 'sine', vol = .16, f2) {
  const ac = audio(); if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain(), ini = ac.currentTime + t0;
  o.type = tipo; o.frequency.setValueAtTime(f, ini); if (f2) o.frequency.exponentialRampToValueAtTime(f2, ini + dur);
  g.gain.setValueAtTime(0.0001, ini); g.gain.exponentialRampToValueAtTime(vol, ini + .012); g.gain.exponentialRampToValueAtTime(0.0001, ini + dur);
  o.connect(g).connect(ac.destination); o.start(ini); o.stop(ini + dur + .03);
}
const SON = {
  acierto: (combo = 1) => { const b = 523.25 * Math.pow(2, Math.min(combo - 1, 9) / 12); tono(b, 0, .11); tono(b * 1.5, .07, .2); },
  fallo: () => tono(230, 0, .25, 'triangle', .18, 130),
  derivacion: () => { tono(210, 0, .2, 'square', .07, 160); tono(170, .22, .28, 'square', .07, 110); },
  tic: () => tono(1250, 0, .035, 'square', .035),
  carta: () => tono(520, 0, .05, 'sine', .06),
  pareja: () => { tono(784, 0, .1); tono(1175, .08, .22); },
  logro: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tono(f, i * .09, .24, 'triangle', .14)),
  record: () => [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tono(f, i * .1, i === 4 ? .5 : .22, 'sine', .15)),
  fin: () => [659.25, 523.25].forEach((f, i) => tono(f, i * .13, .22, 'sine', .11)),
};
const vibrar = patron => { try { if (PREFS.sonido && navigator.vibrate) navigator.vibrate(patron); } catch (e) {} };
const quieto = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function animar(el, clase) { if (!el || quieto()) return; el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase); }
function confeti() {
  if (quieto()) return;
  const cv = document.createElement('canvas'); cv.id = 'confeti'; document.body.appendChild(cv);
  const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement), colores = ['--q', '--hyp', '--ok', '--oro', '--der'].map(v => cs.getPropertyValue(v).trim());
  const ps = Array.from({ length: 90 }, () => ({ x: W / 2 + (Math.random() - .5) * 80, y: H * .35, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 4,
    r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, w: 6 + Math.random() * 5, h: 3 + Math.random() * 4, c: colores[Math.floor(Math.random() * colores.length)] }));
  const t0 = performance.now();
  (function paso(t) {
    const e = (t - t0) / 1000; ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .32; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - e / 1.6); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
    if (e < 1.6) requestAnimationFrame(paso); else cv.remove();
  })(t0);
}
function celebrar() { if (J && J.ayuda) { SON.fin(); return; } SON.record(); vibrar([30, 40, 30, 40, 60]); confeti(); animar(document.querySelector('.gran-num'), 'celebra'); }
const altavoz = on => on
  ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>'
  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>';
let toastT = null;
function avisar(txt, { trofeo = true } = {}) {
  const t = document.getElementById('toast'); t.innerHTML = (trofeo ? icono.trofeo : '') + `<span>${esc(txt)}</span>`; t.hidden = false; animar(t, 'entra');
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3500);
}

/* ---------- Utilidades ---------- */
const $app = document.getElementById('app');
const vista = html => { $app.innerHTML = html; if (!_pintandoInicio) { entrarPantalla(); quitarAvisoVersion(); } };
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const azar = a => a[Math.floor(RNG() * a.length)];
const barajar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(RNG() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function elegirPonderado(lista) {
  const pesos = lista.map(t => 6 - caja(t.clave)); let r = RNG() * pesos.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lista.length; i++) { r -= pesos[i]; if (r <= 0) return lista[i]; } return lista[lista.length - 1];
}
const ctxHip = id => `la hipótesis diagnóstica «${HIP[id].name}» (región ${REG.min})`;
const chipHip = id => `<span class="chip" data-ia-ctx="${attrIA(ctxHip(id))}"><span class="n ia-excluir">${HIP[id].n}</span>${esc(nombreCorto(id))}</span>`;
const chipNum = id => `<span class="chip"><span class="n">${HIP[id].n}</span></span>`;
function resultadoHTML(o, corto = false) {
  const partes = [];
  if (o.deriv) partes.push('<span class="chip-der ia-excluir">Derivación médica</span>');
  o.h.forEach(id => partes.push(corto ? chipNum(id) : chipHip(id)));
  if (!partes.length) partes.push('<span class="chip-sin ia-excluir">sin hipótesis</span>');
  return partes.join('');
}
function selHTML(arr) {
  const p = [];
  if (arr.includes('D')) p.push('<span class="chip-der ia-excluir">Derivación</span>');
  arr.filter(x => x !== 'D' && x !== '0').forEach(id => p.push(chipNum(id)));
  if (!p.length) p.push('<span class="chip-sin ia-excluir">sin hipótesis</span>');
  return p.join('');
}
// Los textos de los datos llevan su contexto para «Ampliar con IA» (seleccionar texto), también dentro de los juegos.
const ctxPasoAttr = s => s ? `data-ia-ctx="${attrIA(ctxArbol(REG.id, s.q))}"` : '';
const respuestaHTML = (o, sinDesc = false) => `<div class="respuesta-caja" ${ctxPasoAttr(pasoDe(o))}><b>${esc(o.t)}</b>${o.d && !sinDesc ? `<span>${esc(o.d)}</span>` : ''}</div>`;
const preguntaHTML = (s, num = s.num) => `<div class="pregunta-caja" ${ctxPasoAttr(s)}><span class="num-paso ia-excluir">${num}</span><p>${esc(s.q)}</p></div>`;
const testNombreHTML = t => `<p class="test-nombre" ${atributosIA(ctxTest(REG.id, t.x.n, HIP[t.hid].name))}>${esc(t.x.n)}</p>`;
const vidasHTML = (n, total = 3) => `<div class="vidas" aria-label="${n} ${n === 1 ? 'vida' : 'vidas'}">${Array.from({ length: total }, (_, i) => i).map(i => `<span class="${i < n ? '' : 'vacia'}">${icono.corazon}</span>`).join('')}</div>`;
function barra({ centro = '', derecha = '', reloj = false, salir = 'Salir' } = {}) {
  const ayuda = salir === 'Salir' && J && !['duelo', 'turnos'].includes(J.modo)
    ? `<button class="ayuda-btn ${J.ayuda ? 'usada' : ''}" data-acc="ayuda" aria-label="Ver qué busca cada paso${J.ayuda ? ' (ya usada en esta partida)' : ''}" title="Qué busca cada paso">${icono.libro}</button>` : '';
  return `<div class="barra-juego"><div class="izq"><button class="salir" data-acc="inicio">‹ ${salir}</button>${ayuda}</div><div class="centro">${centro}</div><div class="marcador">${derecha}</div>${reloj ? '<div class="reloj" id="reloj"><i></i></div>' : ''}</div>`;
}
function finHTML({ etq, grande, texto, extra = '', otra }) {
  return `${barra({ salir: 'Inicio' })}
    <section class="tarjeta salta"><p class="etq">${etq}</p><div class="gran-num">${grande}</div><p>${texto}</p></section>${extra}
    <div class="fila-btn"><button class="btn" data-acc="inicio">Inicio</button><button class="btn btn-pri" data-modo="${otra}">Otra partida</button></div>`;
}
const repasoHTML = items => items.length ? `<section class="tarjeta repaso"><p class="etq">Para repasar en la hoja</p><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></section>` : '';
const lineaOp = o => { const s = pasoDe(o); return `<span ${ctxPasoAttr(s)}><span class="ia-excluir">Paso ${s.num}, </span>«${esc(o.t)}» → ${esRama(s) ? destinoTxt(o.next) : resultadoHTML(o)}</span>`; };
const segTxt = s => s >= 60 ? Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0') + ' s' : s + ' s';
const icono = {
  llama: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5.3.2 1.6 1 2.8 2.2 3.3C11 8 11.4 5 12 2z"/></svg>',
  rayo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  caso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/></svg>',
  hoja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="7" height="5" rx="1"/><rect x="14" y="4" width="7" height="5" rx="1" stroke-dasharray="2 2"/><rect x="3" y="15" width="7" height="5" rx="1"/><rect x="14" y="15" width="7" height="5" rx="1" stroke-dasharray="2 2"/><path d="M10 6.5h4M10 17.5h4"/></svg>',
  desliza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M3 12h2M19 12h2M4 9l-2 3 2 3M20 9l2 3-2 3"/></svg>',
  lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5M9 9l4 4M13 9l-4 4"/></svg>',
  parejas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="9" height="13" rx="2"/><rect x="12" y="3" width="9" height="13" rx="2"/></svg>',
  inverso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>',
  semaforo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="7" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="17" r="1.6" fill="currentColor"/></svg>',
  subita: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.3-8.8-8.6C2 8.2 4 5 7.2 5c1.9 0 3.2 1 4.8 2.6C13.6 6 14.9 5 16.8 5 20 5 22 8.2 20.8 11.4 19 15.7 12 20 12 20z"/><path d="M12 9v6"/></svg>',
  ordena: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 6h11M10 12h11M10 18h11M4 5l1-1v4M3.5 14.5a1.2 1.2 0 1 1 2 1L4 17h2"/></svg>',
  duelo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20c0-3 2.2-5 5-5s5 2 5 5M12 20c0-3 2.2-5 5-5s5 2 5 5"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/></svg>',
  trofeo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6v4H9z"/></svg>',
  paso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10.5 8.5 12.5 7v10M10 17h5"/></svg>',
  completa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="5" rx="1.5"/><path d="m5 13 1.5 1.5L9 12M5 19l1.5 1.5L9 18M12 13.5h8M12 19.5h8"/></svg>',
  chispa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>',
  libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7M8 11h7"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" fill="var(--der)" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8.3 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.8 5 21 8.3 21.5 11.7 19.5 16.4 12 21 12 21z"/></svg>'
};

/* ---------- Partida y relojes ---------- */
let J = null, temporizador = null;
function pararReloj() { if (temporizador) { clearInterval(temporizador); temporizador = null; } }
function iniciar(modo, extra = {}) {
  pararReloj(); RNG = Math.random; window.scrollTo(0, 0);
  J = { modo, derivFallo: false, t0: Date.now(), ...extra, mejorAntes: JSON.parse(JSON.stringify(P.mejor)) };
  P.partidas++; guardar();
}
// Pausa mientras se consulta la ayuda: se guarda lo que queda y se reanuda igual.
function pausarReloj() { if (!temporizador || !RELOJ) return; RELOJ.quedan = Math.max(0, (RELOJ.fin - Date.now()) / 1000); pararReloj(); }
function reanudarReloj() { if (RELOJ && RELOJ.quedan != null) { const R = RELOJ; cuentaAtras(R.quedan, R.alFin, R.alTic, R.total); } }
// Cuenta atrás que se dibuja en #reloj; al llegar a 0 llama a alFin.
let RELOJ = null;
function cuentaAtras(segundos, alFin, alTic, total = segundos) {
  pararReloj(); const fin = Date.now() + segundos * 1000; let ultimoTic = null;
  RELOJ = { fin, alFin, alTic, total, quedan: null };
  temporizador = setInterval(() => {
    const quedan = Math.max(0, (fin - Date.now()) / 1000), r = document.getElementById('reloj');
    if (r) { r.querySelector('i').style.width = (quedan / total * 100) + '%'; r.classList.toggle('prisa', quedan < Math.min(4, total / 4)); }
    const ent = Math.ceil(quedan); if (ent <= 3 && ent > 0 && ent !== ultimoTic) { ultimoTic = ent; SON.tic(); }
    if (alTic) alTic(quedan);
    if (quedan <= 0) { pararReloj(); alFin(); }
  }, 100);
}

/* ---------- Inicio ---------- */
let confirmandoBorrar = false;
function modoHTML(m, ico, color, titulo, texto, rec, destacado = false) {
  // El récord va en la línea del título, para que la descripción tenga todo el ancho.
  return `<button class="modo ${destacado ? 'destacado' : ''}" data-modo="${m}"><span class="ico ${color}">${icono[ico]}</span><span><span class="modo-cab"><h3>${titulo}</h3>${rec ? `<span class="rec">${rec.replace('<br>', ' ')}</span>` : ''}</span><p>${texto}</p></span></button>`;
}
// Ficha compacta de un modo: icono, nombre y una línea con su récord o su estado.
function fichaHTML(m, ico, color, titulo, linea, ayuda, extra = {}) {
  const at = extra.acc ? `data-acc="${extra.acc}"` : `data-modo="${m}"`;
  return `<button class="ficha-modo ${extra.clase || ''}" ${at} title="${esc(ayuda)}"><span class="ico ${color}">${icono[ico]}</span><b>${titulo}</b><small>${linea}</small></button>`;
}
// Columnas para que las filas de pasos queden iguales y llenen el ancho: 5 → 5, 8 → 4+4, 13 → 7+6.
// Volver al inicio: con el botón «‹ Salir»/«‹ Inicio» se gasta la entrada del historial de la
// pantalla; con Atrás (o el gesto) ya se gastó.
function inicio({ desdeAtras = false } = {}) {
  if (_enPantalla && !desdeAtras) { _enPantalla = false; _ignorarPop++; history.back(); }
  _enPantalla = false;
  _pintandoInicio = true;
  try { pintarInicio(); } finally { _pintandoInicio = false; }
  mostrarAvisoVersion();
}
function pintarInicio() {
  pararReloj(); RNG = Math.random; J = null;
  if (REG.id !== PREFS.region) { guardar(); usarRegion(PREFS.region); }
  const M = MEZCLA(), hechoMix = M.diarios[hoyStr()], rachaMix = [hoyStr(), ayerStr()].includes(M.racha.ultimo) ? M.racha.n : 0;
  const m = medalla(), r = rachaVigente(), hecho = P.diarios[hoyStr()];
  const nLogros = LOGROS.filter(l => P.logros[l.id]).length;
  const dom4b = Math.round(TESTS.reduce((a, t) => a + caja(t.clave), 0) / (TESTS.length * 5) * 100);
  const puntuan = TESTS.filter(t => t.x.c !== 'hallazgo').length;
  const nivelMax = [1, 2, 3, 4].filter(n => n === 1 || P.mejor.hoja[n - 1] === 100).pop();
  const rec = (v, txt = 'récord') => v ? `${txt} ${v}` : 'sin jugar';
  const conPesa = Object.keys(DATOS).filter(k => Object.values(DATOS[k].hyp).flatMap(h => h.tests).filter(t => t.c !== 'hallazgo').length >= 8).map(k => DATOS[k].nombre.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' o $1');
  vista(`
    <header class="cab">
      <button class="titulo-region" data-acc="region" aria-haspopup="dialog" aria-label="Región: ${esc(REG.nombre)}. Cambiar de región"><span class="etq">Árbol y confirmación</span><span class="h1">${esc(REG.nombre)} <span class="flecha-abajo" aria-hidden="true">▾</span></span></button>
      <div class="cab-der"><button class="sonido-btn" data-acc="preguntar-ia" aria-label="Preguntar a la IA" title="Preguntar a la IA">${icono.chispa}</button><button class="sonido-btn" data-acc="sonido" aria-pressed="${PREFS.sonido}" aria-label="${PREFS.sonido ? 'Silenciar sonidos y vibración' : 'Activar sonidos y vibración'}">${altavoz(PREFS.sonido)}</button>
      <div class="racha" title="Días seguidos con el reto del día hecho">${icono.llama}<span>${r}</span></div></div>
    </header>
    ${avisoRacha()}
    <section class="mapa" aria-label="Dominio">
      <p class="medalla-linea">${m ? `<span class="disco" style="background:${m.c}">${m.n[0]}</span><span><b>${m.n}</b> · ${esc(m.sig)}</span>` : `<span><b>Sin medalla</b> · bronce al acertar cada respuesta una vez</span>`}</p>
      <div class="pasos" style="grid-template-columns:repeat(${columnasPasos(PASOS.length)},minmax(0,1fr))">${PASOS.map(s => { const d = Math.round(dominioPaso(s) * 100); return `<button class="paso-tile" data-esencia="${s.id}" aria-label="Paso ${s.num}, ${esc(titPaso(s))}: dominio ${d} %. Ver su esencia"><span class="num-paso">${s.num}</span><div class="barra"><i style="width:${d}%"></i></div><small>${d}%</small></button>`; }).join('')}</div>
      <p class="progreso">Toca un paso para ver qué busca.</p>
      <div class="barra-4b"><span class="etq">Tests 4b</span><div class="barra"><i style="width:${dom4b}%"></i></div><small>${dom4b}%</small></div>
      <div class="consulta"><span class="etq">${icono.libro}Hojas</span><button class="btn" data-hoja="arbol">Árbol</button><button class="btn" data-hoja="confirmacion">Confirmación</button></div>
    </section>
    <section class="grupo"><h2>Hoy</h2><div class="mosaico">
      ${fichaHTML('diario', 'calendario', 'i-q', 'Reto del día', hecho !== undefined ? `hecho · ${hecho}` : 'pendiente', '5 preguntas iguales todo el día. Mantiene la racha de esta región.', { clase: hecho === undefined ? 'destacado' : 'hecho' })}
      ${fichaHTML('diariomix', 'calendario', 'i-ok', 'Reto: todas', hechoMix !== undefined ? `hecho · ${hechoMix}` : 'pendiente', '7 preguntas de regiones al azar, iguales todo el día. Su propia racha.', { clase: hechoMix === undefined ? 'destacado' : 'hecho' })}
    </div></section>
    <section class="grupo"><h2>Árbol · rápidos</h2><div class="mosaico">
      ${fichaHTML('desliza', 'desliza', 'i-ok', 'Desliza', rec(P.mejor.desliza), 'Verdadero o falso en 60 segundos, con una mano.')}
      ${fichaHTML('flechas', 'rayo', 'i-q', 'Flechas', rec(P.mejor.flechas), '15 preguntas, 3 vidas. Saltarse una derivación cuesta dos.')}
      ${fichaHTML('enpaso', 'paso', 'i-der', '¿En qué paso?', rec(P.mejor.enpaso), 'Hipótesis, hallazgos y derivaciones: toca su paso en 60 s.')}
      ${fichaHTML('subita', 'subita', 'i-der', 'Muerte súbita', rec(P.mejor.subita), 'Una vida y cada vez menos tiempo.')}
      ${fichaHTML('mezcla', 'rayo', 'i-ok', 'Mezcla de regiones', `árbol y tests · ${rec(M.mejor)}`, 'Flechas con árboles y tests de las 7 regiones.')}
    </div></section>
    <section class="grupo"><h2>Árbol · para pensar</h2><div class="mosaico">
      ${fichaHTML('error', 'lupa', 'i-hyp', 'Encuentra el error', P.mejor.error ? `${P.mejor.error} perfectas` : 'sin jugar', 'La hoja con 1 a 3 errores escondidos.')}
      ${fichaHTML('completa', 'completa', 'i-q', 'Completa el paso', P.mejor.completa ? `mejor ${P.mejor.completa}/${rondasCompleta()}` : 'sin jugar', 'Solo ves el número del paso: marca sus respuestas.')}
      ${fichaHTML('caso', 'caso', 'i-ok', 'Caso', P.mejor.casoPct ? `mejor ${P.mejor.casoPct}%` : 'sin jugar', 'Hallazgos de un paciente: recorre el árbol paso a paso.')}
      ${fichaHTML('detective', 'inverso', 'i-hyp', 'Detective inverso', P.mejor.detective ? `racha ${P.mejor.detective}` : 'sin jugar', 'Ves cómo terminó el árbol: ¿qué encontraste?')}
      ${fichaHTML('ordena', 'ordena', 'i-q', 'Ordena el árbol', P.mejor.ordena ? `mejor ${P.mejor.ordena} s` : 'sin jugar', `Pon las ${PASOS.length} preguntas en su orden.`)}
      ${fichaHTML('hoja', 'hoja', 'i-hyp', 'Hoja fantasma', `nivel ${nivelMax}/4`, 'Rellena la hoja impresa. Cada nivel se abre con el anterior perfecto.')}
      ${fichaHTML('parejas', 'parejas', 'i-gris', 'Parejas', P.mejor.parejas ? `mejor ${P.mejor.parejas} intentos` : 'sin jugar', 'Une cada hallazgo con lo que abre en la hoja.')}
    </div></section>
    <section class="grupo"><h2>Confirmación (4b) · tests</h2><div class="mosaico">
      ${fichaHTML('dequien', 'lupa', 'i-hyp', '¿De quién es?', rec(P.mejor.dequien), 'Sale un test: elige su hipótesis entre las vecinas del árbol.')}
      ${fichaHTML('bateria', 'completa', 'i-hyp', 'Batería', P.mejor.bateria ? `mejor ${P.mejor.bateria}/5` : 'sin jugar', 'Marca los tests de cada hipótesis.')}
      ${fichaHTML('positivo', 'caso', 'i-hyp', 'Positivo si…', rec(P.mejor.positivo), 'Cómo se hace cada test y cuándo es positivo.')}
      ${puntuan >= 8 ? fichaHTML('pesa', 'paso', 'i-hyp', '¿Cuánto pesa?', rec(P.mejor.pesa), 'Confirma, descarta, cluster o solo hallazgo.')
        : fichaHTML('', 'candado', 'i-gris', '¿Cuánto pesa?', 'aquí no', `En ${REG.min} solo ${puntuan} de ${TESTS.length} tests puntúan: juégalo en ${conPesa}.`, { acc: 'pesa-no', clase: 'bloqueada' })}
    </div></section>
    <section class="grupo"><h2>Con un compañero</h2><div class="mosaico">
      ${fichaHTML('turnos', 'desliza', 'i-gris', 'Pasar el móvil', 'por turnos', 'Los dos en el mismo teléfono, la misma pregunta por turnos.')}
      ${fichaHTML('duelo', 'duelo', 'i-gris', 'Duelo', Object.keys(P.duelos).length ? `${Object.keys(P.duelos).length} retos` : 'con código', 'Cada uno en su móvil: mismas 10 preguntas y un código para comparar.')}
    </div></section>
    <details class="tarjeta logros-det"><summary><span class="etq">Logros</span><span class="trofeos" aria-hidden="true">${LOGROS.map(l => `<span class="${P.logros[l.id] ? 'si' : ''}">${icono.trofeo}</span>`).join('')}</span><span class="mono">${nLogros}/${LOGROS.length}</span></summary>
      <div class="logros">${LOGROS.map(l => `<div class="logro ${P.logros[l.id] ? 'si' : ''}">${icono.trofeo}<div><b>${esc(l.t)}</b><small>${esc(l.d)}</small></div></div>`).join('')}</div>
    </details>
    <footer class="pie">
      <p>Las preguntas salen de los mismos datos que la app, con la numeración de las hojas impresas. Cada región guarda su propio progreso, solo en este dispositivo. Mantén pulsada una ficha (o pasa el ratón) para ver de qué va.</p>
      <p><a class="enlace-ext" href="guia.html#${REG.id}/arbol">Guía de consulta</a> · <a class="enlace-ext" href="./">Abrir la app</a></p>
      <p class="pie-version">Versión ${esc(textoVersion())} <button class="enlace" data-acc="${_versionNueva ? 'version-actualizar' : 'version-comprobar'}">${_versionNueva ? 'Actualizar' : 'Comprobar'}</button></p>
      ${confirmandoBorrar ? `<div class="confirmar"><p>¿Borrar todo el progreso, la racha, los récords y los logros?</p><button class="btn btn-der" data-acc="borrar-si">Borrar</button><button class="btn" data-acc="borrar-no">Cancelar</button></div>`
        : `<button class="enlace" data-acc="borrar">Borrar progreso</button>`}
    </footer>`);
}
function menuRegion() {
  selector({ cab: '<div class="sel-cab"><p class="etq">Región</p><b>¿Qué árbol quieres entrenar?</b></div>',
    columnas: 2, // 7 regiones en dos columnas: cabe sin scroll también con letra grande (decisión del usuario, 2026-11)
    items: Object.keys(DATOS).map(k => ({ v: k, html: `<span>${esc(DATOS[k].nombre)}</span><small>${DATOS[k].steps.length} pasos</small>` })), valor: [REG.id],
    alListo: v => { if (v[0] !== REG.id) { guardar(); usarRegion(v[0]); PREFS.region = v[0]; guardarPrefs(); } }, alCerrar: () => { inicio(); const b = document.querySelector('.titulo-region'); if (b) b.focus(); } });
}

/* ---------- «Ampliar con IA»: ampliar-ia.js de la app, copiado al construir ---------- */


/* ---------- Aviso de racha: las que se pierden hoy si no se hace el reto ---------- */
function rachasEnPeligro() {
  const ayer = ayerStr(), out = [];
  for (const k of Object.keys(DATOS)) {
    let pr = null;
    if (k === REG.id) pr = P; else { try { pr = JSON.parse(localStorage.getItem('physiq-entrena-' + k + '-v1')); } catch (e) {} }
    if (pr && pr.racha && pr.racha.ultimo === ayer && pr.racha.n > 0) out.push({ k, n: pr.racha.n, nombre: DATOS[k].nombre });
  }
  const M = MEZCLA(); if (M.racha.ultimo === ayer && M.racha.n > 0) out.push({ k: 'mix', n: M.racha.n, nombre: 'Todas las regiones' });
  return out;
}
function avisoRacha() {
  const lista = rachasEnPeligro(); if (!lista.length) return '';
  const ahora = new Date(), fin = new Date(ahora); fin.setHours(24, 0, 0, 0);
  const h = Math.max(1, Math.ceil((fin - ahora) / 3600000));
  return `<section class="aviso-racha" role="status"><p class="tit">${icono.llama}<span>${lista.length === 1 ? 'Tu racha se pierde' : 'Tus rachas se pierden'} a medianoche (quedan ${h} h)</span></p>
    ${lista.map(x => `<div class="fila"><span><b>${x.n} ${x.n === 1 ? 'día' : 'días'}</b> · ${esc(x.nombre)}</span><button class="btn btn-der" data-racha="${x.k}">Hacer el reto</button></div>`).join('')}</section>`;
}

/* ---------- Preguntas rápidas: Flechas, Muerte súbita, Reto del día, Duelo ---------- */
// Tiempo por pregunta según lo que hay que leer: 12 s de base y 1 s más por cada 40 caracteres
// del enunciado y las opciones, hasta 30 s. Las preguntas de un duelo o un reto son las mismas,
// así que su tiempo también lo es.
const textoPlano = h => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
function segLectura(q) {
  const chars = textoPlano(enunciadoHTML(q)).length + q.opciones.map(o => textoPlano(o.html)).join(' ').length;
  return segundosLectura(chars);
}
const CONFIG = {
  flechas: { max: 15, vidas: 3, seg: (a, q) => segLectura(q), etq: 'Flechas' },
  subita: { max: Infinity, vidas: 1, seg: (a, q) => Math.max(4, segLectura(q) - a * .5), etq: 'Muerte súbita' },
  diario: { max: 5, vidas: Infinity, seg: (a, q) => segLectura(q), etq: 'Reto del día', semilla: true },
  duelo: { max: 10, vidas: Infinity, seg: (a, q) => segLectura(q), etq: 'Duelo', semilla: true },
};
function nuevaPregunta(uniforme) {
  const t = uniforme ? azar(PREGUNTABLES) : elegirPonderado(PREGUNTABLES);
  if (t.tipo === 'op' && esRama(t.s)) {
    const destinos = [...new Set([t.o.next, ...t.s.opts.map(o => o.next), ...barajar(PASOS.map(x => x.id))])].slice(0, 4);
    return { t, tipo: 'salto', opciones: barajar(destinos.map(d => ({ html: d ? numDe(d) : 'Fin', ok: d === t.o.next }))) };
  }
  if (t.tipo === 'op') {
    if (t.o.h.length && RNG() < .3) {
      const id = azar(t.o.h);
      return { t, tipo: 'donde', id, opciones: PASOS.map(s => ({ html: s.num, ok: s === t.s })) };
    }
    const vistos = new Map();
    t.s.opts.forEach(o => { if (clase(o) === '0') return; const k = claveRes(o); if (!vistos.has(k)) vistos.set(k, { html: resultadoHTML(o), ok: k === claveRes(t.o) }); });
    const ops = [...vistos.values()];
    if (ops.length < 4) {
      for (const x of barajar(OPS.filter(x => x.s !== t.s && x.o.h.length))) { if (ops.length >= 4) break; const k = claveRes(x.o); if (!vistos.has(k)) { vistos.set(k, 1); ops.push({ html: resultadoHTML(x.o), ok: false }); } }
    }
    return { t, tipo: 'resultado', opciones: barajar(ops), deriv: !!t.o.deriv };
  }
  const otras = barajar(PASOS.filter(s => s !== t.s));
  const previo = PASOS[t.si - 1];
  if (previo && !esRama(previo) && previo.opts[0].next === t.s.id && RNG() < .4) {
    return { t, tipo: 'orden', previo, opciones: barajar([t.s, ...otras.filter(s => s !== previo).slice(0, 3)].map(s => ({ html: esc(s.q), ok: s === t.s, texto: true }))) };
  }
  if (RNG() < .4) {
    const vistos = new Set([titPaso(t.s)]), ops = [t.s];
    for (const x of otras) { if (ops.length >= 4) break; if (!vistos.has(titPaso(x))) { vistos.add(titPaso(x)); ops.push(x); } }
    return { t, tipo: 'objetivo', opciones: barajar(ops.map(s => ({ html: esc(titPaso(s)), ok: s === t.s, texto: true }))) };
  }
  return { t, tipo: 'pregunta', opciones: barajar([t.s, ...otras.slice(0, 3)].map(s => ({ html: esc(s.q), ok: s === t.s, texto: true }))) };
}
function empezarRapido(modo, extra = {}) {
  const c = CONFIG[modo];
  iniciar(modo, { c, n: 0, vidas: c.vidas, puntos: 0, combo: 0, aciertos: 0, fallos: [], ...extra });
  if (c.semilla) { RNG = mulberry32(semilla(extra.semilla)); J.lista = Array.from({ length: c.max }, () => (c.gen || nuevaPregunta)(true)); RNG = Math.random; }
  siguienteRapida();
}
function opcionesHTML(q, attr, extra = () => '') {
  const rej = q.tipo === 'donde' || q.tipo === 'salto';
  return `<div class="opciones ${rej ? 'cuadricula' : q.tipo === 'pesa' ? 'dos-col' : ''}" ${rej ? `style="grid-template-columns:repeat(${Math.min(q.opciones.length, 6)},minmax(0,1fr))"` : ''}>${q.opciones.map((o, i) => `<button class="op ${o.texto ? 'texto' : ''}" data-${attr}="${i}">${o.html}${extra(i)}</button>`).join('')}</div>`;
}
function enunciadoHTML(q) {
  const s = q.t.s;
  if (q.tipo === 'resultado') return `<p class="contexto-paso"><b>Paso ${s.num}</b> · ${esc(corta(s.q, 64))}</p>${respuestaHTML(q.t.o)}<p class="enunciado">¿Qué abre esta respuesta en la hoja?</p>`;
  if (q.tipo === 'salto') return `<p class="contexto-paso"><b>Paso ${s.num}</b> · ${esc(corta(s.q, 64))}</p>${respuestaHTML(q.t.o)}<p class="enunciado">¿A qué paso vas con esta respuesta?</p>`;
  if (q.tipo === 'dequien') return `<p class="etq">Test de la fase 4b</p>${testNombreHTML(q.t)}<p class="enunciado">¿De qué hipótesis es?</p>`;
  if (q.tipo === 'positivo') return `<div>${chipHip(q.t.hid)}</div>${testNombreHTML(q.t)}<p class="enunciado">¿Cómo se hace y cuándo es positivo?</p>`;
  if (q.tipo === 'pesa') return `<div>${chipHip(q.t.hid)}</div>${testNombreHTML(q.t)}<p class="enunciado">¿Qué hace en la puntuación de la 4b?</p>`;
  if (q.tipo === 'donde') return `<div>${chipHip(q.id)}</div><p class="enunciado">¿En qué paso de la hoja se abre?</p>`;
  if (q.tipo === 'orden') return `<p class="etq">Después de</p>${preguntaHTML(q.previo)}<p class="enunciado">¿Qué pregunta viene justo después?</p>`;
  if (q.tipo === 'objetivo') return `<p class="enunciado">¿Qué busca el paso <span class="mono">${s.num}</span>?</p>`;
  return `<p class="enunciado">¿Qué pregunta el paso <span class="mono">${s.num}</span>?</p>`;
}
function explicacionHTML(q) {
  if (q.tipo === 'positivo') return explicacionBase(q) + anatomiaHTML(q.t.x);
  const at = q.t.hid ? atributosIA(ctxTest(REG.id, q.t.x.n, HIP[q.t.hid].name)) : ctxPasoAttr(q.t.s);
  return `<span ${at}>${explicacionBase(q)}</span>${q.t.x ? anatomiaHTML(q.t.x) : ''}`;
}
// «Anatomía» del test: los enlaces a Kenhub de la app (enlacesAnatomia, data/anatomia.js), en una
// pestaña nueva; el artículo en español si lo hay, si no el inglés marcado «EN». Nunca un iframe.
function anatomiaHTML(x) {
  if (!x?.an?.length) return '';
  return `<p class="anat ia-excluir"><span class="anat-etq">Anatomía</span> ${x.an.map(e => `<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" title="Abrir en Kenhub${e.ingles ? ' (sin versión en español)' : ''}${e.nota ? ' · ' + esc(e.nota) : ''}">${esc(e.nombre)}${e.ingles ? ' <span class="anat-en">EN</span>' : ''} ↗</a>`).join('<span class="anat-sep"> · </span>')}</p>`;
}
function explicacionBase(q) {
  const s = q.t.s, o = q.t.o;
  if (q.tipo === 'salto') return `<b class="ia-excluir">En la hoja:</b> paso ${s.num}, «${esc(o.t)}» → ${destinoTxt(o.next)}`;
  if (q.tipo === 'dequien') return `<b class="ia-excluir">En la hoja de confirmación:</b> «${esc(q.t.x.n)}» es de ${chipHip(q.t.hid)}`;
  if (q.tipo === 'positivo') return `<span ${atributosIA(ctxTest(REG.id, q.t.x.n, HIP[q.t.hid].name))}><b class="ia-excluir">${esc(q.t.x.n)}:</b> <span data-ia-parrafo>${esc(q.t.x.crit)}</span>${iaParrafoHTML()}</span>`;
  if (q.tipo === 'pesa') return pesoExplicacion(q.t);
  if (q.tipo === 'resultado' || q.tipo === 'donde') return `<b class="ia-excluir">En la hoja:</b> paso ${s.num} (${esc(titPaso(s))}), «${esc(o.t)}» → ${resultadoHTML(o)}`;
  if (q.tipo === 'objetivo') return `<b>Paso ${s.num}: ${esc(titPaso(s))}.</b> ${esc(primeraFrase(s.porque || ''))}`;
  return `<b class="ia-excluir">En la hoja:</b> el paso ${s.num} (${esc(titPaso(s))}) pregunta «${esc(s.q)}»`;
}
function centroRapido() {
  const c = J.c, vid = isFinite(c.vidas) ? vidasHTML(J.vidas, c.vidas) : '';
  const prog = isFinite(c.max) ? `${J.n}/${c.max}` : `${J.aciertos} seguidas`;
  return vid + `<span class="progreso">${prog}</span>`;
}
function siguienteRapida() {
  pararReloj();
  const c = J.c;
  if (J.vidas <= 0 || J.n >= c.max) return finRapido();
  J.q = J.lista ? J.lista[J.n] : (c.gen || nuevaPregunta)(false); if (J.q.region) enRegion(J.q.region); J.n++; J.resp = false; J.restante = J.segTotal = c.seg(J.aciertos, J.q);
  const q = J.q, seg = J.restante;
  vista(`${barra({ centro: centroRapido(), derecha: `${J.puntos}<small>${J.combo > 1 ? 'combo ×' + J.combo : 'puntos'}</small>`, reloj: true })}
    ${q.deriv && isFinite(c.vidas) && c.vidas > 1 ? '<p class="progreso">Respuesta con derivación: fallarla cuesta 2 vidas</p>' : ''}
    <div class="tarjeta salta">${q.region ? `<span class="chip-reg-mini">${esc(REG.nombre)}</span>` : ''}${enunciadoHTML(q)}</div>
    ${opcionesHTML(q, 'op')}
    <div class="puntos-flotan" id="flota" aria-live="polite"></div>
    <div id="explica"></div>`);
  cuentaAtras(seg, () => responderRapida(-1), quedan => { J.restante = quedan; });
}
function responderRapida(i) {
  if (J.resp) return; J.resp = true; pararReloj();
  const q = J.q, ok = i >= 0 && q.opciones[i].ok;
  (J.res = J.res || [])[J.n - 1] = ok;
  document.querySelectorAll('.op').forEach((b, j) => { b.disabled = true; if (q.opciones[j].ok) b.classList.add('ok'); else if (j === i) b.classList.add('mal'); else b.classList.add('atenuada'); });
  if (ok) {
    J.combo++; J.aciertos++; const p = 10 + Math.ceil(J.restante / (J.segTotal || 15) * 15) + (J.combo > 1 ? J.combo * 2 : 0); J.puntos += p; acierto(q.t.clave); guardar();
    const fl = document.getElementById('flota'); fl.innerHTML = `<span class="sube">+${p}${J.combo > 1 ? ' · combo ×' + J.combo : ''}</span>`;
    SON.acierto(J.combo); vibrar(15); animar(document.querySelectorAll('.op')[i], 'brilla');
    const mc = document.querySelector('.marcador'); if (mc) { mc.innerHTML = `${J.puntos}<small>${J.combo > 1 ? 'combo ×' + J.combo : 'puntos'}</small>`; animar(mc, 'sube'); }
    const partida = J; setTimeout(() => { if (J === partida) siguienteRapida(); }, 750);
  } else {
    const coste = q.deriv && isFinite(J.c.vidas) && J.c.vidas > 1 ? 2 : 1;
    if (isFinite(J.vidas)) J.vidas = Math.max(0, J.vidas - coste);
    if (q.deriv) J.derivFallo = true;
    J.combo = 0; fallo(q.t.clave); q.expl = (q.region ? `<b>${esc(REG.nombre)}.</b> ` : '') + explicacionHTML(q); J.fallos.push(q); guardar();
    const v = document.querySelector('.vidas'); if (v) { v.outerHTML = vidasHTML(J.vidas, J.c.vidas); const hs = document.querySelectorAll('.vidas > span');
      for (let k = J.vidas; k < Math.min(hs.length, J.vidas + coste); k++) animar(hs[k], 'pierde'); }
    q.deriv ? SON.derivacion() : SON.fallo(); vibrar(q.deriv ? [80, 60, 80] : 90);
    animar(document.querySelector('.tarjeta'), 'tiembla');
    const sigue = J.vidas > 0 && J.n < J.c.max;
    document.getElementById('explica').innerHTML = `<div class="aviso aviso-mal">
      <p class="tit">${i < 0 ? 'Se acabó el tiempo' : 'No es esa'}${coste > 1 ? ' · −2 vidas por saltarte una derivación' : ''}</p>
      <p>${explicacionHTML(q)}</p>
      ${q.t.s && q.t.s.porque ? `<p class="porque" data-ia-ctx="${attrIA(ctxArbol(REG.id, q.t.s.q))}"><span class="razon-etq">Por qué este paso: </span>${esc(primeraFrase(q.t.s.porque))}${iaParrafoHTML()}</p>` : ''}
      <button class="btn btn-pri" data-acc="siguiente">${sigue ? 'Siguiente' : 'Ver resultado'}</button></div>`;
    document.querySelector('[data-acc="siguiente"]').focus();
  }
}
function finRapido() {
  pararReloj();
  const modo = J.modo, vistos = new Set(), repaso = repasoHTML(J.fallos.filter(q => !vistos.has(q.t.clave) && vistos.add(q.t.clave)).map(q => (q.expl || explicacionHTML(q)) + verHojaHTML(q)));
  let texto = `${J.aciertos} aciertos de ${J.n}.`, grande = J.puntos, extra = '';
  if (modo === 'flechas') { const rec = J.puntos > P.mejor.flechas; J.celebra = rec && J.puntos > 0; if (rec) P.mejor.flechas = J.puntos; texto = (rec ? 'Nuevo récord. ' : `Récord: ${P.mejor.flechas}. `) + texto + (J.vidas <= 0 ? ' Sin vidas.' : ''); }
  if (modo === 'subita') { grande = J.aciertos; const rec = J.aciertos > P.mejor.subita; J.celebra = rec; if (rec) P.mejor.subita = J.aciertos; texto = `seguidas. ${rec ? 'Nuevo récord.' : 'Récord: ' + P.mejor.subita + '.'}`; }
  if (['dequien', 'positivo', 'pesa'].includes(modo)) { const rec = J.puntos > P.mejor[modo]; if (rec) P.mejor[modo] = J.puntos; J.celebra = rec && J.puntos > 0;
    texto = (rec ? 'Nuevo récord. ' : `Récord: ${P.mejor[modo]}. `) + texto + (J.vidas <= 0 ? ' Sin vidas.' : ''); }
  if (J.c.mezcla) enRegion(PREFS.region);
  if (modo === 'mezcla') { const M = MEZCLA(), rec = !J.ayuda && J.puntos > M.mejor; if (rec) M.mejor = J.puntos; J.celebra = rec && J.puntos > 0; guardarPrefs();
    texto = (rec ? 'Nuevo récord. ' : `Récord: ${M.mejor}. `) + texto + (J.vidas <= 0 ? ' Sin vidas.' : ''); }
  if (modo === 'diariomix') {
    const M = MEZCLA(), hoy = hoyStr();
    if (M.diarios[hoy] === undefined) { M.diarios[hoy] = J.puntos; if (M.racha.ultimo !== hoy) { M.racha.n = M.racha.ultimo === ayerStr() ? M.racha.n + 1 : 1; M.racha.ultimo = hoy; M.racha.max = Math.max(M.racha.max, M.racha.n); }
      J.celebra = true; texto += ` Racha de todas las regiones: ${M.racha.n} ${M.racha.n === 1 ? 'día' : 'días'}.`; }
    else texto += ` Ya lo habías hecho hoy (${M.diarios[hoy]} puntos): esta vez no cuenta.`;
    guardarPrefs();
  }
  if (modo === 'diario') {
    const hoy = hoyStr();
    if (P.diarios[hoy] === undefined) { P.diarios[hoy] = J.puntos; sumarRacha(); J.celebra = true; texto += ` Racha: ${P.racha.n} ${P.racha.n === 1 ? 'día' : 'días'}. Vuelve mañana.`; }
    else texto += ` Ya lo habías hecho hoy (${P.diarios[hoy]} puntos): esta vez no cuenta.`;
  }
  if (modo === 'duelo') {
    P.duelos[J.codigo] = Math.max(P.duelos[J.codigo] || 0, J.puntos);
    const bits = (J.res || []).reduce((a, ok, k) => a + (ok ? 2 ** k : 0), 0), cod = codigoResultado(J.codigo, bits, J.puntos);
    (P.duelosRes = P.duelosRes || {})[J.codigo] = { bits, puntos: J.puntos, cod };
    const msg = `Reto de ${REG.min} nº ${J.codigo} (PhysiQ): ${J.puntos} puntos, ${J.aciertos} de ${J.n}. Mi código: ${cod}. ¿Me superas?`;
    extra = `<section class="tarjeta"><p class="etq">Tu código de resultado</p><div class="codigo-grande">${cod}</div>
      <p>Tu compañero juega el reto nº <b class="mono">${J.codigo}</b> en ${esc(REG.min)} y, al acabar, escribe este código para ver quién ganó, pregunta a pregunta.</p>
      <textarea class="compartir" id="txtDuelo" rows="3" readonly>${esc(msg)}</textarea><button class="btn" data-acc="copiar">Copiar mensaje</button></section>
      ${compararHTML()}`;
  }
  vista(finHTML({ etq: CONFIG[modo].etq + (J.c.mezcla ? '' : ' · ' + REG.min), grande, texto, extra: extra + repaso, otra: modo === 'duelo' ? 'duelo' : modo }));
  if (J.celebra) celebrar(); else SON.fin();
  cerrarPartida({ modo, vidas: J.vidas, n: J.n, puntos: J.puntos });
}

/* ---------- Desliza ---------- */
function afirmacion() {
  const t = elegirPonderado(PREGUNTABLES), verdad = RNG() < .5;
  if (t.tipo === 'op' && esRama(t.s)) {
    const d = verdad ? t.o.next : azar(PASOS.map(x => x.id).filter(x => x !== t.o.next));
    return { t, verdad, html: `<p class="etq">Paso ${t.s.num}</p>${respuestaHTML(t.o)}<p class="flecha">en la hoja</p><p class="enunciado">${destinoTxt(d)}</p>`, bien: lineaOp(t.o) };
  }
  if (t.tipo === 'op') {
    let mostrado = t.o;
    if (!verdad) {
      const otros = OPS.filter(x => clase(x.o) !== '0' && claveRes(x.o) !== claveRes(t.o)), mismos = otros.filter(x => x.s === t.s);
      mostrado = (mismos.length && RNG() < .7 ? azar(mismos) : azar(otros)).o;
    }
    return { t, verdad, deriv: !!(t.o.deriv || mostrado.deriv), html: `<p class="etq">Paso ${t.s.num}</p>${respuestaHTML(t.o)}<p class="flecha">abre en la hoja</p><div>${resultadoHTML(mostrado)}</div>`, bien: lineaOp(t.o) };
  }
  if (RNG() < .5) {
    const otro = azar(PASOS.filter(x => x !== t.s && titPaso(x) !== titPaso(t.s)));
    const st = verdad || !otro ? t.s : otro;
    return { t, verdad: st === t.s, html: `<p class="enunciado">El paso <span class="mono">${t.s.num}</span> busca:</p><p>${esc(titPaso(st))}</p>`, bien: `El paso ${t.s.num} busca: ${esc(titPaso(t.s))}` };
  }
  const sq = verdad ? t.s : azar(PASOS.filter(x => x !== t.s));
  return { t, verdad, html: `<p class="enunciado">El paso <span class="mono">${t.s.num}</span> pregunta:</p><p>«${esc(sq.q)}»</p>`, bien: `El paso ${t.s.num} pregunta «${esc(t.s.q)}»` };
}
function empezarDesliza() {
  iniciar('desliza', { aciertos: 0, seguidas: 0, fallos: [], bloqueo: false, terminado: false });
  vista(`${barra({ centro: '<span class="progreso" id="dzCuenta">0 ✓ · 0 ✗</span>', derecha: '<span id="dzSeg">60</span><small>segundos</small>', reloj: true })}
    <p class="progreso">Desliza: ← falso · verdadero →</p>
    <div class="mesa" id="mesa"></div>
    <div class="fila-btn"><button class="btn btn-falso" data-dz="0">← Falso</button><button class="btn btn-verdad" data-dz="1">Verdadero →</button></div>
    <div class="feedback" id="dzFb" aria-live="polite"></div>`);
  cartaDesliza();
  cuentaAtras(60, finDesliza, q => { const e = document.getElementById('dzSeg'); if (e) e.textContent = Math.ceil(q); });
}
function cartaDesliza() {
  J.a = afirmacion(); J.bloqueo = false;
  const mesa = document.getElementById('mesa');
  mesa.innerHTML = `<div class="carta-swipe" tabindex="0" aria-label="Afirmación: usa las flechas izquierda o derecha">${J.a.html}<span class="sello sello-f">Falso</span><span class="sello sello-v">Verdadero</span></div>`;
  const el = mesa.firstElementChild;
  let x0 = null, dx = 0;
  el.addEventListener('pointerdown', e => { audio(); x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; });
  el.addEventListener('pointermove', e => { if (x0 === null) return; dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${dx / 25}deg)`; el.dataset.dir = dx > 40 ? 'v' : dx < -40 ? 'f' : ''; });
  const soltar = () => { if (x0 === null) return; x0 = null; el.style.transition = ''; if (Math.abs(dx) > 90) responderDesliza(dx > 0); else { el.style.transform = ''; el.dataset.dir = ''; } };
  el.addEventListener('pointerup', soltar); el.addEventListener('pointercancel', soltar);
}
function responderDesliza(dijo) {
  if (!J || J.modo !== 'desliza' || J.bloqueo || J.terminado) return; J.bloqueo = true;
  const a = J.a, ok = dijo === a.verdad, el = document.querySelector('.carta-swipe');
  if (ok) { J.aciertos++; J.seguidas++; acierto(a.t.clave); document.getElementById('dzFb').innerHTML = ''; SON.acierto(J.seguidas); vibrar(12); }
  else { J.seguidas = 0; J.fallos.push(a.bien); fallo(a.t.clave); if (a.deriv) J.derivFallo = true; SON.fallo(); vibrar(80); animar(document.querySelector('.mesa'), 'tiembla');
    document.getElementById('dzFb').innerHTML = `<b>Era ${a.verdad ? 'verdadero' : 'falso'}.</b> ${a.bien}`; }
  guardar();
  document.getElementById('dzCuenta').textContent = `${J.aciertos} ✓ · ${J.fallos.length} ✗`;
  if (el) { el.dataset.dir = dijo ? 'v' : 'f'; el.style.transform = `translateX(${dijo ? 120 : -120}%) rotate(${dijo ? 12 : -12}deg)`; el.style.opacity = '0'; }
  setTimeout(() => { if (J && J.modo === 'desliza' && !J.terminado) cartaDesliza(); }, 200);
}
function finDesliza() {
  J.terminado = true;
  const puntos = Math.max(0, J.aciertos * 10 - J.fallos.length * 5), rec = puntos > P.mejor.desliza;
  if (rec) P.mejor.desliza = puntos; P.mejor.deslizaAciertos = Math.max(P.mejor.deslizaAciertos, J.aciertos);
  const total = J.aciertos + J.fallos.length;
  setTimeout(() => rec && puntos > 0 ? celebrar() : SON.fin(), 50);
  vista(finHTML({ etq: 'Desliza · ' + REG.min, grande: puntos, texto: `${J.aciertos} aciertos y ${J.fallos.length} fallos${total ? ` (${Math.round(J.aciertos / total * 100)} %)` : ''}. ${rec ? 'Nuevo récord.' : 'Récord: ' + P.mejor.desliza + '.'}`,
    extra: repasoHTML([...new Set(J.fallos)]), otra: 'desliza' }));
  cerrarPartida({ modo: 'desliza', puntos });
}

/* ---------- ¿En qué paso? (estructura de la hoja: no se adivina leyendo) ---------- */
const pasosDeHip = id => PASOS.filter(x => x.opts.some(o => o.h.includes(id)));
function itemEnPaso() {
  const r = RNG(), derivs = OPS.filter(t => t.o.deriv), conHip = OPS.filter(t => t.o.h.length);
  if (derivs.length && r < .15) { const t = elegirPonderado(derivs); return { t, deriv: true, pasos: [t.s], html: `<span class="chip-der">Derivación médica</span><p class="h" ${ctxPasoAttr(t.s)}>${esc(hallazgo(t.o))}</p>` }; }
  const t = elegirPonderado(conHip);
  if (r < .7) { const id = azar(t.o.h); return { t, pasos: pasosDeHip(id), html: `<div>${chipHip(id)}</div>${nombreSub(id) ? `<p class="progreso">${esc(nombreSub(id))}</p>` : ''}` }; }
  return { t, pasos: [t.s], html: `<p class="h" ${ctxPasoAttr(t.s)}>${esc(hallazgo(t.o))}</p>` };
}
function empezarEnPaso() {
  iniciar('enpaso', { puntos: 0, aciertos: 0, seguidas: 0, fallos: [], terminado: false });
  vista(`${barra({ centro: '<span class="progreso" id="epCuenta">0 aciertos</span>', derecha: '<span id="epPuntos">0</span><small>puntos</small>', reloj: true })}
    <p class="etq">¿En qué paso de la hoja está?</p>
    <div class="tarjeta hallazgo-carta" id="epCarta"></div>
    <div class="opciones cuadricula" style="grid-template-columns:repeat(${Math.min(PASOS.length, 6)},minmax(0,1fr))">${PASOS.map(x => `<button class="op" data-ep="${x.num}">${x.num}</button>`).join('')}</div>
    <div class="feedback" id="epFb" aria-live="polite"></div>`);
  cartaEnPaso();
  cuentaAtras(60, finEnPaso);
}
function cartaEnPaso() { J.it = itemEnPaso(); document.getElementById('epCarta').innerHTML = J.it.html; }
function responderEnPaso(num) {
  if (!J || J.modo !== 'enpaso' || J.terminado) return;
  const it = J.it, ok = it.pasos.some(x => x.num === num), btn = document.querySelector(`[data-ep="${num}"]`);
  if (ok) { J.aciertos++; J.seguidas++; J.puntos += 10; acierto(it.t.clave); acierto('q:' + it.t.s.id); document.getElementById('epFb').innerHTML = ''; SON.acierto(J.seguidas); vibrar(12); animar(btn, 'brilla'); }
  else {
    const pen = it.deriv ? 15 : 5; J.puntos -= pen; J.seguidas = 0; fallo(it.t.clave); if (it.deriv) J.derivFallo = true;
    const linea = `<span ${ctxPasoAttr(it.pasos[0])}><span class="ia-excluir">Paso ${it.pasos.map(x => x.num).join(' y ')} </span>(${esc(titPaso(it.pasos[0]))}): «${esc(corta(it.pasos[0].q, 70))}»</span>`; J.fallos.push(linea);
    it.deriv ? SON.derivacion() : SON.fallo(); vibrar(it.deriv ? [80, 60, 80] : 80); animar(document.getElementById('epCarta'), 'tiembla');
    document.getElementById('epFb').innerHTML = `<b>−${pen}.</b> ${linea}`;
  }
  guardar();
  document.getElementById('epCuenta').textContent = `${J.aciertos} aciertos`;
  document.getElementById('epPuntos').textContent = J.puntos;
  cartaEnPaso();
}
function finEnPaso() {
  J.terminado = true;
  const puntos = Math.max(0, J.puntos), rec = puntos > P.mejor.enpaso; if (rec) P.mejor.enpaso = puntos;
  setTimeout(() => rec && puntos > 0 ? celebrar() : SON.fin(), 50);
  vista(finHTML({ etq: '¿En qué paso? · ' + REG.min, grande: puntos, texto: `${J.aciertos} aciertos y ${J.fallos.length} fallos. Fallar dónde está una derivación resta 15. ${rec ? 'Nuevo récord.' : 'Récord: ' + P.mejor.enpaso + '.'}`,
    extra: repasoHTML([...new Set(J.fallos)]), otra: 'enpaso' }));
  cerrarPartida({ modo: 'enpaso', puntos });
}

/* ---------- Completa el paso (solo el número: ¿qué respuestas tiene?) ---------- */
const queAbren = x => x.opts.filter(o => clase(o) !== '0');
const rondasCompleta = () => Math.min(6, PASOS.filter(x => queAbren(x).length).length);
function rondaCompleta(x) {
  const buenas = queAbren(x);
  const otras = barajar(OPS.filter(t => t.s !== x && clase(t.o) !== '0')).slice(0, Math.max(3, 8 - buenas.length)).map(t => t.o);
  return { s: x, buenas, opciones: barajar([...buenas, ...otras]), marcadas: new Set(), corregida: false };
}
function empezarCompleta() { iniciar('completa', { orden: barajar(PASOS.filter(x => queAbren(x).length)).slice(0, rondasCompleta()), ronda: 0, exactos: 0 }); J.r = rondaCompleta(J.orden[0]); pintarCompleta(); }
function pintarCompleta() {
  const r = J.r, x = r.s;
  vista(`${barra({ centro: `<span class="progreso">Ronda ${J.ronda + 1}/${J.orden.length}</span>`, derecha: `${J.exactos}<small>exactos</small>` })}
    <section class="tarjeta salta"><div class="pregunta-caja"><span class="num-paso">${x.num}</span><p ${r.corregida ? ctxPasoAttr(x) : ''}>${r.corregida ? `${esc(titPaso(x))}<br><span class="progreso">${esc(x.q)}</span>` : r.pista ? esc(titPaso(x)) : 'Paso ' + x.num}</p></div>
      ${!r.corregida && !r.pista ? '<button class="ver-hoja" data-acc="pista-completa">Pista: ¿qué busca este paso?</button>' : ''}
      <p class="enunciado">Marca las respuestas del paso ${x.num} que abren algo en la hoja.</p>
      <p class="progreso">No aparecen las que no abren nada. Las demás son de otros pasos.</p></section>
    <div class="opciones">${r.opciones.map((o, i) => {
      let est = '', nota = '';
      if (r.corregida) { const es = r.buenas.includes(o), m = r.marcadas.has(i);
        est = es && m ? 'ok' : !es && m ? 'mal' : es ? 'falta' : 'atenuada';
        nota = es ? `<span class="nota-est">→ ${resultadoHTML(o, true)}${m ? '' : ' · se te pasó'}</span>` : m ? `<span class="nota-est">Es del paso ${pasoDe(o).num}</span>` : ''; }
      return `<button class="op texto ${est}" data-cp="${i}" aria-pressed="${r.marcadas.has(i)}" ${r.corregida ? 'disabled' : ''}>${esc(hallazgo(o))}${nota}</button>`; }).join('')}</div>
    ${r.corregida
      ? `<div class="aviso ${r.ok ? 'aviso-ok' : 'aviso-mal'}"><p class="tit">${r.ok ? 'Exacto' : 'No del todo'}</p>${!r.ok && x.porque ? `<p class="porque" data-ia-ctx="${attrIA(ctxArbol(REG.id, x.q))}"><span class="razon-etq">Por qué este paso: </span>${esc(primeraFrase(x.porque))}${iaParrafoHTML()}</p>` : ''}</div>
         <button class="btn btn-pri" data-acc="sig-completa">${J.ronda + 1 < J.orden.length ? 'Siguiente ronda' : 'Ver resultado'}</button>`
      : `<button class="btn btn-pri" data-acc="corregir-completa" ${r.marcadas.size ? '' : 'disabled'}>Comprobar</button>`}`);
}
function corregirCompleta() {
  const r = J.r; r.corregida = true;
  const marcadas = [...r.marcadas].map(i => r.opciones[i]);
  r.ok = marcadas.length === r.buenas.length && r.buenas.every(o => marcadas.includes(o));
  r.buenas.forEach(o => { const t = tarjetaDe(o); if (marcadas.includes(o)) acierto(t.clave); else { fallo(t.clave); if (o.deriv) J.derivFallo = true; } });
  marcadas.filter(o => !r.buenas.includes(o)).forEach(o => fallo(tarjetaDe(o).clave));
  r.ok ? acierto('q:' + r.s.id) : fallo('q:' + r.s.id);
  if (r.ok) { J.exactos++; if (!r.pista) J.sinPista = (J.sinPista || 0) + 1; }
  guardar(); pintarCompleta();
  r.ok ? (SON.acierto(J.exactos), vibrar(15)) : (SON.fallo(), vibrar(80));
}
function siguienteCompleta() {
  J.ronda++;
  if (J.ronda < J.orden.length) { J.r = rondaCompleta(J.orden[J.ronda]); window.scrollTo(0, 0); return pintarCompleta(); }
  // El récord y el logro cuentan solo los pasos exactos sin pista.
  const sp = J.sinPista || 0, rec = sp > P.mejor.completa; if (rec) P.mejor.completa = sp;
  window.scrollTo(0, 0);
  vista(finHTML({ etq: 'Completa el paso · ' + REG.min, grande: `${J.exactos}/${J.orden.length}`, texto: `pasos exactos${J.exactos > sp ? `, ${J.exactos - sp} con pista` : ''}. ${rec ? 'Nuevo récord.' : 'Mejor sin pista: ' + P.mejor.completa + '/' + J.orden.length + '.'}`, otra: 'completa' }));
  J.exactos === J.orden.length ? celebrar() : SON.fin();
  cerrarPartida({ modo: 'completa', exactos: J.exactos });
}

/* ---------- Caso (sigue el camino: con desvíos, como lumbar 1b/1c, cambia) ---------- */
function nuevoCaso() {
  for (let intento = 0; intento < 30; intento++) {
    let presupuesto = RNG() < .7 ? 1 : 2, s = PASOS[0]; const camino = [];
    while (s && camino.length <= PASOS.length) {
      const abren = queAbren(s), neu = neutral(s);
      let o;
      if (esRama(s) || !neu) o = azar(s.opts);
      else if (presupuesto > 0 && abren.length && RNG() < .5) { o = azar(abren); presupuesto--; }
      else o = neu;
      camino.push({ s, o }); s = o.next ? PASOS.find(x => x.id === o.next) : null;
    }
    if (camino.some(x => clase(x.o) !== '0')) return { camino, hallazgos: barajar(camino.map(x => ({ txt: x.o.d || x.o.t, s: x.s }))), paso: 0, mias: [] };
  }
}
function opcionesCaso(s) {
  if (esRama(s)) return barajar([...new Set(s.opts.map(o => o.next))].map(n => ({ k: 'N:' + n, html: `<span class="chip-sin">${destinoTxt(n)}</span>` })));
  const vistos = new Map(); s.opts.forEach(o => { const k = claveRes(o); if (!vistos.has(k)) vistos.set(k, { k, html: resultadoHTML(o) }); });
  for (const x of barajar(OPS.filter(x => x.s !== s && clase(x.o) !== '0'))) { if (vistos.size >= 3) break; const k = claveRes(x.o); if (!vistos.has(k)) vistos.set(k, { k, html: resultadoHTML(x.o) }); }
  return barajar([...vistos.values()]);
}
const claveCaso = (s, o) => esRama(s) ? 'N:' + o.next : claveRes(o);
function empezarCaso() { iniciar('caso'); J.c = nuevoCaso(); pintarCaso(); }
function pintarCaso() {
  const c = J.c, s = c.camino[c.paso].s;
  J.opsCaso = opcionesCaso(s);
  vista(`${barra({ centro: `<span class="progreso">Paso ${c.paso + 1}/${c.camino.length}</span>`, derecha: `${c.mias.filter(m => m.ok).length}<small>aciertos</small>` })}
    <section class="tarjeta ficha"><p class="etq">Hallazgos del paciente</p><ul>${c.hallazgos.map(h => `<li ${ctxPasoAttr(h.s)}>${esc(h.txt)}</li>`).join('')}</ul></section>
    <section class="tarjeta salta">${preguntaHTML(s)}<p class="enunciado">${esRama(s) ? 'Con estos hallazgos, ¿por dónde sigues?' : 'Con estos hallazgos, ¿qué abre este paso?'}</p></section>
    <div class="opciones">${J.opsCaso.map((o, i) => `<button class="op" data-caso="${i}">${o.html}</button>`).join('')}</div>
    <div id="explica"></div>`);
}
function responderCaso(i) {
  const c = J.c, { s, o: buena } = c.camino[c.paso], elegida = J.opsCaso[i], kb = claveCaso(s, buena);
  const ok = elegida.k === kb, t = tarjetaDe(buena);
  c.mias.push({ ok, html: elegida.html }); ok ? acierto(t.clave) : fallo(t.clave);
  ok ? (SON.acierto(c.mias.filter(m => m.ok).length), vibrar(15)) : (buena.deriv ? SON.derivacion() : SON.fallo(), vibrar(80));
  if (!ok && buena.deriv) J.derivFallo = true; guardar();
  document.querySelectorAll('[data-caso]').forEach((b, j) => { b.disabled = true; if (J.opsCaso[j].k === kb) b.classList.add('ok'); else if (j === i) b.classList.add('mal'); else b.classList.add('atenuada'); });
  const ultimo = c.paso === c.camino.length - 1;
  animar(document.querySelectorAll('[data-caso]')[i], ok ? 'brilla' : 'tiembla');
  document.getElementById('explica').innerHTML = `<div class="aviso ${ok ? 'aviso-ok' : 'aviso-mal'}">
    <p class="tit">${ok ? 'Bien' : 'No es esa'}</p>
    <p>El hallazgo «${esc(buena.d || buena.t)}» es la respuesta «${esc(buena.t)}» del paso ${s.num}${esRama(s) ? ': ' + destinoTxt(buena.next) : ''}.</p>
    ${!ok && s.porque ? `<p class="porque" data-ia-ctx="${attrIA(ctxArbol(REG.id, s.q))}"><span class="razon-etq">Por qué este paso: </span>${esc(primeraFrase(s.porque))}${iaParrafoHTML()}</p>` : ''}
    <button class="btn btn-pri" data-acc="${ultimo ? 'fin-caso' : 'paso-caso'}">${ultimo ? 'Ver el recorrido' : 'Siguiente paso'}</button></div>`;
  document.querySelector('#explica .btn').focus();
}
function finCaso() {
  const c = J.c, N = c.camino.length, aciertos = c.mias.filter(m => m.ok).length, pct = Math.round(aciertos / N * 100);
  if (pct > P.mejor.casoPct) P.mejor.casoPct = pct;
  const hips = [...new Set(c.camino.flatMap(x => x.o.h))], deriv = c.camino.some(x => x.o.deriv);
  vista(finHTML({ etq: 'Caso · ' + REG.min, grande: `${aciertos}/${N}`, texto: 'pasos acertados', otra: 'caso', extra: `
    <section class="tarjeta"><p class="etq">Recorrido en la hoja</p><div class="camino">${c.camino.map(({ s, o }, i) => `
      <div class="camino-fila ${c.mias[i].ok ? 'ok' : 'mal'}"><span class="num-paso">${s.num}</span><div><p><b>${esc(o.t)}</b> → ${esRama(s) ? destinoTxt(o.next) : resultadoHTML(o)}</p>${c.mias[i].ok ? '' : `<p class="tuya">Elegiste: ${c.mias[i].html}</p>${verHojaHTML({ t: { s } })}`}</div></div>`).join('')}</div></section>
    ${deriv ? `<div class="aviso aviso-mal"><p class="tit">Derivación médica</p><p>Este paciente necesita valoración médica; el recorrido sigue.</p></div>` : ''}
    <section class="tarjeta"><p class="etq">A confirmar en la fase 4b</p><div>${hips.length ? hips.map(chipHip).join(' ') : `<span class="chip-sin">ninguna: ${DATOS[REG.id].inesp}</span>`}</div></section>` }));
  aciertos === N ? celebrar() : SON.fin();
  cerrarPartida({ modo: 'caso', aciertos });
}

/* ---------- Detective inverso ---------- */
function nuevoDetective() {
  const nPos = RNG() < .6 ? 1 : 2;
  const pos = barajar(PASOS.filter(x => queAbren(x).length)).slice(0, nPos).map(x => azar(queAbren(x)));
  const claves = new Set(pos.map(claveRes));
  const distr = barajar(OPS.filter(t => clase(t.o) !== '0' && !pos.includes(t.o) && !claves.has(claveRes(t.o)))).slice(0, 6 - nPos).map(t => t.o);
  return { pos, opciones: barajar([...pos, ...distr]), marcadas: new Set(), corregido: false };
}
function empezarDetective() { iniciar('detective', { seguidos: 0, casos: 0 }); J.d = nuevoDetective(); pintarDetective(); }
function pintarDetective() {
  const d = J.d, hips = [...new Set(d.pos.flatMap(o => o.h))], deriv = d.pos.some(o => o.deriv);
  vista(`${barra({ centro: `<span class="progreso">Caso ${J.casos + 1}</span>`, derecha: `${J.seguidos}<small>seguidos</small>` })}
    <section class="tarjeta salta"><p class="etq">El árbol terminó así</p><div>${deriv ? '<span class="chip-der">Derivación médica</span> ' : ''}${hips.map(chipHip).join(' ')}</div>
      <p class="enunciado">¿Qué hallazgos tenía el paciente? Marca todos.</p></section>
    <div class="opciones">${d.opciones.map((o, i) => {
      let est = '', nota = '';
      if (d.corregido) { const es = d.pos.includes(o), m = d.marcadas.has(i);
        est = es && m ? 'ok' : !es && m ? 'mal' : es ? 'falta' : 'atenuada';
        nota = es || m ? `<span class="nota-est">Paso ${pasoDe(o).num} → ${resultadoHTML(o, true)}${es && !m ? ' · se te pasó' : ''}</span>` : ''; }
      return `<button class="op texto ${est}" data-det="${i}" aria-pressed="${d.marcadas.has(i)}" ${d.corregido ? 'disabled' : ''}>${esc(hallazgo(o))}${nota}</button>`; }).join('')}</div>
    ${d.corregido
      ? `<div class="aviso ${d.ok ? 'aviso-ok' : 'aviso-mal'}"><p class="tit">${d.ok ? 'Exacto' : 'No del todo'}</p><p>${d.ok ? 'Llevas ' + J.seguidos + ' seguidos.' : 'En dorado, los que se te pasaron; en rojo, los que no eran.'}</p></div>
         <div class="fila-btn"><button class="btn" data-acc="fin-detective">Terminar</button><button class="btn btn-pri" data-acc="otro-detective">Otro caso</button></div>`
      : `<button class="btn btn-pri" data-acc="corregir-detective" ${d.marcadas.size ? '' : 'disabled'}>Comprobar</button>`}`);
}
function corregirDetective() {
  const d = J.d; d.corregido = true; J.casos++;
  const marcadas = [...d.marcadas].map(i => d.opciones[i]);
  d.ok = marcadas.length === d.pos.length && d.pos.every(o => marcadas.includes(o));
  d.pos.forEach(o => { const t = tarjetaDe(o); marcadas.includes(o) ? acierto(t.clave) : fallo(t.clave); if (!marcadas.includes(o) && o.deriv) J.derivFallo = true; });
  marcadas.filter(o => !d.pos.includes(o)).forEach(o => fallo(tarjetaDe(o).clave));
  J.seguidos = d.ok ? J.seguidos + 1 : 0; if (!J.ayuda && J.seguidos > P.mejor.detective) P.mejor.detective = J.seguidos;
  guardar(); pintarDetective();
  if (d.ok) { J.seguidos > 1 ? celebrar() : (SON.acierto(J.seguidos), vibrar(15)); } else { SON.fallo(); vibrar(80); }
}
function finDetective() {
  vista(finHTML({ etq: 'Detective inverso · ' + REG.min, grande: P.mejor.detective, texto: `es tu mejor racha de casos exactos. Has resuelto ${J.casos} ${J.casos === 1 ? 'caso' : 'casos'}.`, otra: 'detective' }));
  cerrarPartida({ modo: 'detective' });
}

/* ---------- Encuentra el error ---------- */
function empezarError() {
  iniciar('error');
  const hoja = PASOS.map(s => ({ s, q: s, ops: s.opts.map(o => ({ o, muestra: o })) }));
  const errores = new Set(), objetivo = 1 + Math.floor(RNG() * 3), derivOps = OPS.filter(t => t.o.deriv);
  let hechos = 0, intentos = 0;
  while (hechos < objetivo && intentos++ < 60) {
    if (RNG() < .25) {
      if (hoja.some(x => x.q !== x.s)) continue;
      const [a, b] = barajar(hoja).slice(0, 2); [a.q, b.q] = [b.q, a.q]; errores.add('q:' + a.s.id); errores.add('q:' + b.s.id); hechos++;
    } else {
      const t = derivOps.length && RNG() < .2 ? azar(derivOps) : azar(OPS), k = 'o:' + t.clave;
      if (errores.has(k)) continue;
      const fila = hoja[t.si];
      let falso;
      if (t.o.deriv) falso = neutral(t.s);
      else { const otros = OPS.filter(x => claveRes(x.o) !== claveRes(t.o)), mismos = otros.filter(x => x.s === t.s); falso = (mismos.length && RNG() < .5 ? azar(mismos) : azar(otros)).o; }
      fila.ops[t.i].muestra = falso; errores.add(k); hechos++;
    }
  }
  J.hoja = hoja; J.errores = errores; J.marcas = new Set(); J.corregida = false;
  pintarError();
}
function pintarError() {
  const N = J.errores.size, est = k => { if (!J.corregida) return ''; const e = J.errores.has(k), m = J.marcas.has(k); return e && m ? 'ok' : !e && m ? 'mal' : e ? 'falta' : ''; };
  let encontrados = 0, falsas = 0;
  if (J.corregida) J.marcas.forEach(k => J.errores.has(k) ? encontrados++ : falsas++);
  vista(`${barra({ centro: `<span class="progreso">${J.corregida ? `${encontrados} de ${N} encontrados` : `${N} ${N === 1 ? 'error' : 'errores'} escondidos`}</span>`, derecha: `${J.marcas.size}<small>marcadas</small>` })}
    <p class="etq">Toca las casillas que están mal: preguntas fuera de su paso o respuestas que abren otra cosa</p>
    ${J.hoja.map(f => { const kq = 'q:' + f.s.id, eq = est(kq);
      return `<section class="tarjeta hoja-paso">
        <button class="pregunta-caja marcable ${eq}" data-err="${kq}" aria-pressed="${J.marcas.has(kq)}" ${J.corregida ? 'disabled' : ''}><span class="num-paso">${f.s.num}</span><p ${ctxPasoAttr(f.q)}>${esc(f.q.q)}</p></button>
        ${eq === 'falta' || eq === 'ok' ? `<p class="correcta">Aquí va: «${esc(f.s.q)}»</p>` : ''}
        ${f.ops.map((x, i) => { const k = 'o:' + f.s.id + ':' + i, e = est(k);
          return `<div class="hoja-op">${respuestaHTML(x.o)}<span class="flecha">→</span>
            <button class="res-caja marcable ${e}" data-err="${k}" aria-pressed="${J.marcas.has(k)}" ${J.corregida ? 'disabled' : ''}>${resultadoHTML(x.muestra, true)}</button>
            ${e === 'falta' || e === 'ok' ? `<div class="correcta">Era: ${resultadoHTML(x.o)}</div>` : ''}${e === 'mal' ? '<div class="correcta">Esta estaba bien.</div>' : ''}</div>`; }).join('')}
      </section>`; }).join('')}
    ${J.corregida
      ? `<div class="aviso ${encontrados === N && !falsas ? 'aviso-ok' : 'aviso-mal'}"><p class="tit">${encontrados === N && !falsas ? 'Ojo clínico: todos y sin falsas alarmas' : `${encontrados} de ${N} encontrados${falsas ? `, ${falsas} ${falsas === 1 ? 'falsa alarma' : 'falsas alarmas'}` : ''}`}</p>
         <p>En verde, los que encontraste; en dorado discontinuo, los que se te pasaron; en rojo, los que estaban bien.</p></div>
         <div class="fila-btn"><button class="btn" data-acc="inicio">Inicio</button><button class="btn btn-pri" data-modo="error">Otra hoja</button></div>`
      : `<button class="btn btn-pri" data-acc="corregir-error" ${J.marcas.size ? '' : 'disabled'}>Comprobar</button>`}`);
}
function corregirError() {
  J.corregida = true;
  J.errores.forEach(k => {
    const t = TARJETAS.find(x => (k.startsWith('q:') ? x.clave === k : 'o:' + x.clave === k));
    if (!t) return;
    if (J.marcas.has(k)) acierto(t.clave); else { fallo(t.clave); if (t.o && t.o.deriv) J.derivFallo = true; }
  });
  let encontrados = 0, falsas = 0; J.marcas.forEach(k => J.errores.has(k) ? encontrados++ : falsas++);
  const perfecto = encontrados === J.errores.size && !falsas; if (perfecto) P.mejor.error++;
  guardar(); pintarError(); window.scrollTo({ top: document.body.scrollHeight, behavior: movimiento() });
  perfecto ? celebrar() : encontrados ? SON.fin() : SON.fallo();
  cerrarPartida({ modo: 'error', perfecto });
}
const movimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/* ---------- Ordena el árbol ---------- */
function empezarOrdena() { iniciar('ordena', { pool: barajar(PASOS), orden: [], corregida: false }); pintarOrdena(); }
function pintarOrdena() {
  const n = PASOS.length;
  vista(`${barra({ centro: `<span class="progreso">${J.orden.length}/${n} colocadas</span>` })}
    <p class="etq">Toca las preguntas en el orden de la hoja. Toca una colocada para devolverla.</p>
    <section class="slots">${Array.from({ length: n }, (_, i) => { const s = J.orden[i];
      const est = J.corregida ? (s === PASOS[i] ? 'ok' : 'mal') : '';
      return `<button class="slot ${s ? 'lleno' : 'vacio'} ${est}" data-slot="${i}" ${J.corregida || !s ? 'disabled' : ''}><span class="num-paso">${PASOS[i].num}</span><span>${s ? esc(s.q) : '—'}${est === 'mal' ? `<small>Aquí va (${esc(titPaso(PASOS[i]))}): «${esc(PASOS[i].q)}»</small>` : ''}</span></button>`; }).join('')}</section>
    ${J.corregida ? '' : `<div class="opciones">${J.pool.map((s, i) => `<button class="op texto" data-pool="${i}">${esc(s.q)}</button>`).join('')}</div>`}
    ${J.corregida
      ? `<div class="aviso ${J.ok ? 'aviso-ok' : 'aviso-mal'}"><p class="tit">${J.ok ? `Orden perfecto en ${J.seg} s` : 'Hay preguntas fuera de su sitio'}</p>${J.ok && P.mejor.ordena === J.seg ? '<p>Nuevo récord.</p>' : ''}</div>
         <div class="fila-btn"><button class="btn" data-acc="inicio">Inicio</button><button class="btn btn-pri" data-modo="ordena">Otra vez</button></div>`
      : `<button class="btn btn-pri" data-acc="corregir-ordena" ${J.orden.length < n ? 'disabled' : ''}>Comprobar</button>`}`);
}
function corregirOrdena() {
  J.corregida = true; J.seg = Math.round((Date.now() - J.t0) / 1000);
  J.ok = J.orden.every((s, i) => s === PASOS[i]);
  J.orden.forEach((s, i) => s === PASOS[i] ? acierto('q:' + PASOS[i].id) : fallo('q:' + PASOS[i].id));
  if (J.ok && (!P.mejor.ordena || J.seg < P.mejor.ordena)) P.mejor.ordena = J.seg;
  guardar(); pintarOrdena(); J.ok ? celebrar() : SON.fallo(); cerrarPartida({ modo: 'ordena', ok: J.ok });
}

/* ---------- Parejas ---------- */
function empezarParejas() {
  const vistos = new Set(), elegidas = [];
  for (const t of barajar(OPS.filter(t => clase(t.o) !== '0'))) { const k = claveRes(t.o); if (!vistos.has(k)) { vistos.add(k); elegidas.push(t); } if (elegidas.length === 6) break; }
  iniciar('parejas', { cartas: barajar(elegidas.flatMap((t, i) => [{ par: i, tipo: 'h', t }, { par: i, tipo: 'r', t }])), abiertas: [], hechas: new Set(), intentos: 0, bloqueo: false });
  pintarParejas();
}
function pintarParejas() {
  vista(`${barra({ centro: `<span class="progreso">${J.hechas.size}/6 parejas</span>`, derecha: `${J.intentos}<small>intentos</small>` })}
    <p class="etq">Une cada hallazgo con lo que abre en la hoja</p>
    <div class="parejas">${J.cartas.map((c, i) => { const vis = J.hechas.has(c.par) || J.abiertas.includes(i);
      const cont = !vis ? '' : c.tipo === 'h' ? `<span class="etq">Paso ${c.t.s.num}</span><span>${esc(corta(hallazgo(c.t.o), 90))}</span>` : `<span>${resultadoHTML(c.t.o)}</span>`;
      return `<button class="carta-par ${vis ? '' : 'boca-abajo'} ${J.hechas.has(c.par) ? 'hecha' : ''}" data-par="${i}" ${vis ? '' : 'aria-label="Carta boca abajo"'} ${J.hechas.has(c.par) ? 'disabled' : ''}>${cont}</button>`; }).join('')}</div>`);
}
function tocarCarta(i) {
  if (J.bloqueo || J.abiertas.includes(i) || J.hechas.has(J.cartas[i].par)) return;
  J.abiertas.push(i); if (J.abiertas.length === 1) SON.carta();
  if (J.abiertas.length === 2) {
    J.intentos++;
    const [a, b] = J.abiertas.map(k => J.cartas[k]);
    if (a.par === b.par) { J.hechas.add(a.par); J.recien = a.par; acierto(a.t.clave); J.abiertas = []; guardar(); SON.pareja(); vibrar(20); }
    else { J.bloqueo = true; setTimeout(() => { if (!J || J.modo !== 'parejas') return; J.abiertas = []; J.bloqueo = false; pintarParejas(); }, 1100); }
  }
  pintarParejas();
  if (J.recien !== undefined) { document.querySelectorAll('.carta-par').forEach((el, k) => { if (J.cartas[k].par === J.recien) animar(el, 'brilla'); }); J.recien = undefined; }
  else if (J.abiertas.length === 2) { SON.fallo(); document.querySelectorAll('.carta-par').forEach((el, k) => { if (J.abiertas.includes(k)) animar(el, 'tiembla'); }); }
  if (J.hechas.size === 6) setTimeout(finParejas, 500);
}
function finParejas() {
  if (!J || J.modo !== 'parejas') return;
  const seg = Math.round((Date.now() - J.t0) / 1000), rec = !P.mejor.parejas || J.intentos < P.mejor.parejas; if (rec) P.mejor.parejas = J.intentos;
  vista(finHTML({ etq: 'Parejas · ' + REG.min, grande: J.intentos, texto: `intentos para 6 parejas, en ${segTxt(seg)}. El mínimo es 6. ${rec ? 'Nuevo récord.' : 'Mejor: ' + P.mejor.parejas + '.'}`, otra: 'parejas' }));
  rec ? celebrar() : SON.fin();
  cerrarPartida({ modo: 'parejas', intentos: J.intentos });
}

/* ---------- Hoja fantasma (niveles 1 a 4) ---------- */
const NIVELES = {
  1: 'Faltan las hipótesis.',
  2: 'Faltan también las descripciones: solo queda el título de cada respuesta.',
  3: 'Faltan también las preguntas.',
  4: 'Árbol vacío: solo números y huecos. El jefe final.'
};
const abierto = n => n === 1 || P.mejor.hoja[n - 1] === 100;
function pintarNiveles() {
  pararReloj(); J = null; window.scrollTo(0, 0);
  vista(`${barra({ salir: 'Inicio' })}
    <section class="tarjeta"><p class="etq">Hoja fantasma · ${REG.min}</p><p>Cada nivel se abre al sacar el anterior al 100 %.</p></section>
    <section class="grupo">${[1, 2, 3, 4].map(n => `<button class="modo" data-nivel="${n}" ${abierto(n) ? '' : 'disabled'}>
      <span class="ico ${abierto(n) ? 'i-hyp' : 'i-gris'}">${abierto(n) ? `<b class="mono">${n}</b>` : icono.candado}</span>
      <span><h3>Nivel ${n}</h3><p>${NIVELES[n]}${abierto(n) ? '' : ` Se abre con el nivel ${n - 1} perfecto.`}</p></span><span class="rec">${P.mejor.hoja[n]} %</span></button>`).join('')}</section>`);
}
function empezarHoja(nivel) {
  iniciar('hoja', { nivel, huecos: {}, corregida: false, ordenQ: barajar(PASOS), ordenR: Object.fromEntries(PASOS.map(s => [s.id, barajar(s.opts.map((_, i) => i))])) });
  pintarHoja();
}
function clavesHoja() {
  const k = [];
  PASOS.forEach(s => { if (J.nivel >= 3) k.push('q:' + s.id); s.opts.forEach((_, i) => { if (J.nivel >= 4) k.push('r:' + s.id + ':' + i); k.push('h:' + s.id + ':' + i); }); });
  return k;
}
// Corrección: devuelve { q: {sid: bool}, filas: {sid:i -> { ok, opt }} }
function evaluarHoja() {
  const res = { q: {}, filas: {} };
  PASOS.forEach(s => {
    if (J.nivel >= 3) res.q[s.id] = J.huecos['q:' + s.id] === s.id;
    const elegidas = s.opts.map((_, i) => J.nivel >= 4 ? J.huecos['r:' + s.id + ':' + i] : String(i));
    s.opts.forEach((o, i) => {
      const c = elegidas[i], opt = c !== undefined ? s.opts[+c] : null;
      const unica = c !== undefined && elegidas.filter(x => x === c).length === 1;
      const h = J.huecos['h:' + s.id + ':' + i];
      res.filas[s.id + ':' + i] = { opt, unica, ok: !!opt && unica && !!h && claveSel(h) === claveRes(opt) };
    });
  });
  return res;
}
function pintarHoja() {
  const claves = clavesHoja(), llenos = claves.filter(k => J.huecos[k] !== undefined).length;
  const ev = J.corregida ? evaluarHoja() : null;
  const nv = J.nivel;
  vista(`${barra({ centro: `<span class="progreso">${J.corregida ? `${J.pct} %` : `${llenos}/${claves.length} huecos`}</span>`, derecha: `${nv}<small>nivel</small>` })}
    <p class="etq">Hoja fantasma · nivel ${nv} · ${NIVELES[nv]}</p>
    ${PASOS.map(s => {
      const kq = 'q:' + s.id, vq = J.huecos[kq];
      const cabeza = nv >= 3
        ? `<div class="pregunta-caja"><span class="num-paso">${s.num}</span><button class="hueco azul ${vq ? 'lleno' : ''} ${ev ? (ev.q[s.id] ? 'ok' : 'mal') : ''}" data-hueco="${kq}" ${J.corregida ? 'disabled' : ''} aria-label="Pregunta del paso ${s.num}">${vq ? esc(PASOS.find(x => x.id === vq).q) : '?'}</button></div>
           ${ev && !ev.q[s.id] ? `<p class="correcta">Era: «${esc(s.q)}»</p>` : ''}`
        : preguntaHTML(s);
      return `<section class="tarjeta hoja-paso">${cabeza}
        ${s.opts.map((o, i) => {
          const kr = 'r:' + s.id + ':' + i, kh = 'h:' + s.id + ':' + i, f = ev ? ev.filas[s.id + ':' + i] : null;
          const izq = nv >= 4
            ? `<button class="hueco gris ${J.huecos[kr] !== undefined ? 'lleno' : ''}" data-hueco="${kr}" ${J.corregida ? 'disabled' : ''} aria-label="Respuesta ${i + 1} del paso ${s.num}">${J.huecos[kr] !== undefined ? `<b>${esc(s.opts[+J.huecos[kr]].t)}</b>` : '?'}</button>`
            : respuestaHTML(o, nv >= 2).replace('</div>', esRama(s) ? `<span class="salto-txt">→ ${destinoTxt(o.next)}</span></div>` : '</div>');
          const vh = J.huecos[kh];
          let nota = '';
          if (f && !f.ok) nota = nv >= 4
            ? (!f.opt ? 'Falta la respuesta.' : !f.unica ? 'Esa respuesta está repetida en este paso.' : `«${esc(f.opt.t)}» abre: ${resultadoHTML(f.opt)}`)
            : `Era: ${resultadoHTML(o)}`;
          return `<div class="hoja-op">${izq}<span class="flecha">→</span>
            <button class="hueco ${vh ? 'lleno' : ''} ${f ? (f.ok ? 'ok' : 'mal') : ''}" data-hueco="${kh}" ${J.corregida ? 'disabled' : ''} aria-label="Lo que abre la respuesta ${i + 1} del paso ${s.num}">${vh ? selHTML(vh) : '?'}</button>
            ${nota ? `<div class="correcta">${nota}</div>` : ''}</div>`; }).join('')}
      </section>`; }).join('')}
    ${J.corregida
      ? `<section class="tarjeta"><div class="gran-num">${J.pct} %</div><p>${J.pct === 100 ? `Hoja perfecta en ${segTxt(J.seg)}.${nv < 4 ? ` Nivel ${nv + 1} abierto.` : ' Has vencido al jefe final.'}` : 'En rojo, lo que no coincide con la hoja.'}</p></section>
         <div class="fila-btn"><button class="btn" data-modo="hoja">Niveles</button><button class="btn btn-pri" data-nivel="${J.pct === 100 && nv < 4 ? nv + 1 : nv}">${J.pct === 100 && nv < 4 ? 'Nivel ' + (nv + 1) : 'Otra vez'}</button></div>`
      : `<button class="btn btn-pri" data-acc="corregir-hoja" ${llenos < claves.length ? 'disabled' : ''}>Corregir la hoja</button>`}`);
}
function corregirHoja() {
  const ev = evaluarHoja(); J.corregida = true; J.seg = Math.round((Date.now() - J.t0) / 1000);
  let ok = 0, total = 0;
  Object.entries(ev.q).forEach(([sid, b]) => { total++; if (b) { ok++; acierto('q:' + sid); } else fallo('q:' + sid); });
  PASOS.forEach(s => s.opts.forEach((o, i) => {
    const f = ev.filas[s.id + ':' + i]; total++;
    const t = tarjetaDe(J.nivel >= 4 ? (f.opt || o) : o);
    if (f.ok) { ok++; acierto(t.clave); } else { fallo(t.clave); if (t.o.deriv) J.derivFallo = true; }
  }));
  J.pct = Math.round(ok / total * 100);
  if (J.pct > P.mejor.hoja[J.nivel]) P.mejor.hoja[J.nivel] = J.pct;
  guardar(); pintarHoja(); window.scrollTo({ top: document.body.scrollHeight, behavior: movimiento() });
  J.pct === 100 ? celebrar() : J.pct >= 70 ? SON.fin() : SON.fallo();
  cerrarPartida({ modo: 'hoja', pct: J.pct, seg: J.seg, nivel: J.nivel });
}
function abrirHueco(k) {
  const [tipo, sid, i] = k.split(':'), s = PASOS.find(x => x.id === sid);
  const volver = () => { pintarHoja(); const b = document.querySelector(`[data-hueco="${k}"]`); if (b) b.focus(); };
  if (tipo === 'q') return selector({ cab: `<div class="sel-cab"><p class="etq">Paso ${s.num}</p><b>¿Qué pregunta va aquí?</b></div>`,
    items: J.ordenQ.map(x => ({ v: x.id, html: `<span>${esc(x.q)}</span>` })), valor: J.huecos[k] ? [J.huecos[k]] : [],
    alListo: v => { J.huecos[k] = v[0]; }, alCerrar: volver });
  if (tipo === 'r') return selector({ cab: `<div class="sel-cab"><p class="etq">Paso ${s.num} · respuesta ${+i + 1}</p><b>¿Qué respuesta va aquí?</b></div>`,
    items: J.ordenR[sid].map(j => ({ v: String(j), html: `<span><b>${esc(s.opts[j].t)}</b>${s.opts[j].d ? `<br><small>${esc(s.opts[j].d)}</small>` : ''}</span>` })), valor: J.huecos[k] !== undefined ? [J.huecos[k]] : [],
    alListo: v => { J.huecos[k] = v[0]; }, alCerrar: volver });
  const o = s.opts[+i], rk = J.huecos['r:' + sid + ':' + i], ref = J.nivel >= 4 ? (rk !== undefined ? s.opts[+rk] : null) : o;
  const cab = `<div class="sel-cab"><p class="etq">Paso ${s.num}</p>${ref ? `<b>${esc(ref.t)}</b>${ref.d && J.nivel < 2 ? `<span>${esc(ref.d)}</span>` : ''}` : `<b>Respuesta ${+i + 1}</b>`}<span>Marca todo lo que abre</span></div>`;
  selector({ cab, multi: true, exclusivo: '0', valor: J.huecos[k] || [],
    items: [{ v: '0', html: '<span class="chip-sin">Sin hipótesis</span>' }, { v: 'D', html: '<span class="chip-der">Derivación médica</span>' },
      ...Object.keys(HIP).sort((a, b) => HIP[a].n - HIP[b].n).map(id => ({ v: id, html: `<span class="n">${HIP[id].n}</span><span>${esc(nombreCorto(id))}<br><small>${esc(nombreSub(id))}</small></span>` }))],
    alListo: v => { J.huecos[k] = v; }, alCerrar: volver });
}
// Asa de las hojas inferiores: arrastrar hacia abajo desde arriba de la hoja (72 px) la cierra, como
// las hojas de la app (initSwipe, app.js): más de 80 px o un gesto rápido; si no, vuelve a su sitio.
// Cerrar así es como cerrar con su botón: gasta su entrada del historial. El touchmove no es pasivo:
// mientras se arrastra la hoja hacia abajo cancela el gesto del navegador, porque la hoja no tiene
// scroll propio y, con la página arriba del todo, Chrome lo tomaba como «tirar para recargar» y
// mandaba touchcancel: la hoja volvía a su sitio sin cerrarse (visto en Android, 2026-11).
const ASA = '<div class="asa" aria-hidden="true"></div>';
function deslizarParaCerrar(velo, cerrar) {
  const EASE = 'transform .3s cubic-bezier(.32,.72,0,1)';
  let hoja = null, y0 = 0, t0 = 0, delta = 0;
  velo.addEventListener('touchstart', e => {
    hoja = e.touches.length === 1 ? velo.querySelector('.hoja-sel') : null;
    if (!hoja || e.touches[0].clientY - hoja.getBoundingClientRect().top > 72) { hoja = null; return; }
    y0 = e.touches[0].clientY; t0 = Date.now(); delta = 0; hoja.style.transition = 'none';
  }, { passive: true });
  velo.addEventListener('touchmove', e => {
    if (!hoja) return;
    delta = Math.max(0, e.touches[0].clientY - y0); hoja.style.transform = delta ? `translateY(${delta}px)` : '';
    if (delta && e.cancelable) e.preventDefault();
  }, { passive: false });
  const soltar = cancelar => {
    if (!hoja) return; const h = hoja; hoja = null;
    h.style.transition = EASE;
    if (!cancelar && (delta > 80 || (delta > 20 && delta / Math.max(1, Date.now() - t0) > 0.3))) {
      h.style.transform = 'translateY(110%)'; setTimeout(() => cerrar(), 300);
    } else { h.style.transform = ''; setTimeout(() => { h.style.transition = ''; }, 310); }
  };
  velo.addEventListener('touchend', () => soltar(false), { passive: true });
  velo.addEventListener('touchcancel', () => soltar(true), { passive: true });
}
// Hoja inferior para elegir: una opción (se cierra al tocar) o varias (con «Listo»).
function selector({ cab, items, multi = false, exclusivo = null, valor = [], alListo, alCerrar, columnas = 1 }) {
  const sel = new Set(valor);
  const velo = document.createElement('div'); velo.className = 'velo';
  velo.innerHTML = `<div class="hoja-sel" role="dialog" aria-modal="true" aria-label="Elegir">${ASA}${cab}
    <div class="lista${columnas === 2 ? ' lista-2col' : ''}">${items.map(it => `<button class="sel-op" data-sel="${esc(it.v)}">${it.html}</button>`).join('')}</div>
    <div class="fila-btn"><button class="btn" data-sel-acc="cerrar">Cancelar</button>${multi ? '<button class="btn btn-pri" data-sel-acc="listo">Listo</button>' : ''}</div></div>`;
  const marcar = () => velo.querySelectorAll('[data-sel]').forEach(b => b.setAttribute('aria-pressed', String(sel.has(b.dataset.sel))));
  marcar();
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  const cerrar = (o = {}) => { if (!velo.isConnected) return; velo.remove(); soltarCapa(cerrar, o); document.removeEventListener('keydown', tecla); if (alCerrar) alCerrar(); };
  document.addEventListener('keydown', tecla);
  velo.addEventListener('click', e => {
    if (e.target === velo) return cerrar();
    const b = e.target.closest('[data-sel]'), a = e.target.closest('[data-sel-acc]');
    if (b) {
      const v = b.dataset.sel;
      if (!multi) { alListo([v]); return cerrar(); }
      if (v === exclusivo) { sel.clear(); sel.add(v); } else { sel.delete(exclusivo); sel.has(v) ? sel.delete(v) : sel.add(v); }
      marcar();
    }
    if (a) { if (a.dataset.selAcc === 'listo' && sel.size) alListo([...sel]); cerrar(); }
  });
  document.body.appendChild(velo); abrirCapa(cerrar); deslizarParaCerrar(velo, cerrar);
  (velo.querySelector('[aria-pressed="true"]') || velo.querySelector('.sel-op')).focus();
}

/* ---------- Fase 4b: tests de confirmación ---------- */
// Hipótesis vecinas: primero las que salen de la misma respuesta, luego del mismo paso, luego el resto.
function vecinas(hid) {
  const mismaOp = new Set(), mismoPaso = new Set();
  PASOS.forEach(s => s.opts.forEach(o => { if (o.h.includes(hid)) { o.h.forEach(x => mismaOp.add(x)); s.opts.forEach(oo => oo.h.forEach(x => mismoPaso.add(x))); } }));
  const todas = Object.keys(HIP).filter(x => x !== hid);
  return [...barajar(todas.filter(x => mismaOp.has(x))), ...barajar(todas.filter(x => !mismaOp.has(x) && mismoPaso.has(x))), ...barajar(todas.filter(x => !mismaOp.has(x) && !mismoPaso.has(x)))];
}
const CATS = { confirma: 'Confirma', descarta: 'Descarta', ambas: 'Confirma y descarta', cluster: 'Solo en su cluster', hallazgo: 'Solo hallazgo', pronostico: 'Regla pronóstica' };
function pesoExplicacion(t) {
  const x = t.x, h = HIP[t.hid], lr = [x.lp && 'LR+ ' + x.lp, x.ln && 'LR− ' + x.ln].filter(Boolean).join(' · ');
  const cl = x.cl && h.clusters[x.cl] ? h.clusters[x.cl] : null;
  return `<b>${esc(x.n)}</b> (${chipHip(t.hid)}): ${CATS[x.c]}. ${esc(x.p)}${lr ? ` <span class="mono">${lr}</span>.` : ''}${cl ? ` <b>${esc(cl.n)}:</b> LR+ ${esc(cl.lp)} con ${cl.up} o más positivos; LR− ${esc(cl.ln)} con ${cl.un} o menos, solo si se hicieron todos.` : ''}`;
}
function preguntaDeQuien(uniforme) {
  const t = uniforme ? azar(TESTS) : elegirPonderado(TESTS);
  return { t, tipo: 'dequien', opciones: barajar([t.hid, ...vecinas(t.hid).slice(0, 3)]).map(id => ({ html: chipHip(id), ok: id === t.hid })) };
}
function preguntaPositivo() {
  // Solo técnicas de exploración: fuera alias, pruebas de imagen y criterios que repiten el nombre (ver gen-datos).
  const pool = TESTS.filter(x => x.x.pz), t = elegirPonderado(pool);
  const cercanas = new Set([t.hid, ...vecinas(t.hid).slice(0, 3)]);
  const otras = barajar(pool.filter(x => x !== t && cercanas.has(x.hid))).concat(barajar(pool.filter(x => !cercanas.has(x.hid)))).slice(0, 2);
  return { t, tipo: 'positivo', opciones: barajar([t, ...otras].map(x => ({ html: `<span class="crit">${esc(corta(x.x.cj, 230))}</span>`, ok: x === t, texto: true }))) };
}
function preguntaPesa() {
  const puntua = TESTS.filter(x => x.x.c !== 'hallazgo'), t = elegirPonderado(RNG() < .65 && puntua.length ? puntua : TESTS);
  return { t, tipo: 'pesa', opciones: Object.entries(CATS).map(([k, v]) => ({ html: v, ok: k === t.x.c })) };
}
CONFIG.dequien = { max: 12, vidas: 3, seg: (a, q) => segLectura(q), etq: '¿De quién es este test?', gen: preguntaDeQuien };
CONFIG.positivo = { max: 10, vidas: 3, seg: (a, q) => segLectura(q), etq: 'Positivo si…', gen: preguntaPositivo };
CONFIG.pesa = { max: 12, vidas: 3, seg: (a, q) => segLectura(q), etq: '¿Cuánto pesa?', gen: preguntaPesa };

/* ---------- Mezcla de regiones ---------- */
const REGIONES = Object.keys(DATOS);
function enRegion(r) { if (REG.id !== r) { guardar(); usarRegion(r); } }
// Cada pregunta, de una región al azar: 70 % árbol, 30 % tests de la 4b. Los aciertos cuentan en el progreso de esa región.
function genMezcla(uniforme) {
  const r = azar(REGIONES); enRegion(r);
  const q = RNG() < .7 ? nuevaPregunta(uniforme) : preguntaDeQuien(uniforme);
  q.region = r; return q;
}
CONFIG.mezcla = { max: 15, vidas: 3, seg: (a, q) => segLectura(q), etq: 'Mezcla de regiones', gen: genMezcla, mezcla: true };
CONFIG.diariomix = { max: 7, vidas: Infinity, seg: (a, q) => segLectura(q), etq: 'Reto del día · todas', gen: genMezcla, mezcla: true, semilla: true };
const MEZCLA = () => (PREFS.mezcla = PREFS.mezcla || { mejor: 0, diarios: {}, racha: { n: 0, ultimo: '', max: 0 } });

// Batería: una hipótesis y unos 8 tests; marca los suyos.
function rondaBateria(hid) {
  const suyos = barajar(TESTS.filter(t => t.hid === hid)).slice(0, 5);
  const veci = vecinas(hid), otros = [];
  for (const v of veci) { for (const t of barajar(TESTS.filter(x => x.hid === v))) { if (otros.length >= 8 - suyos.length) break; otros.push(t); } if (otros.length >= 8 - suyos.length) break; }
  return { hid, suyos, opciones: barajar([...suyos, ...otros]), marcadas: new Set(), corregida: false };
}
function empezarBateria() {
  const hids = []; const pool = Object.keys(HIP);
  while (hids.length < 5 && hids.length < pool.length) {
    const t = elegirPonderado(TESTS.filter(x => !hids.includes(x.hid))); hids.push(t.hid);
  }
  iniciar('bateria', { orden: hids, ronda: 0, exactos: 0 }); J.r = rondaBateria(hids[0]); pintarBateria();
}
function pintarBateria() {
  const r = J.r;
  vista(`${barra({ centro: `<span class="progreso">Ronda ${J.ronda + 1}/${J.orden.length}</span>`, derecha: `${J.exactos}<small>exactos</small>` })}
    <section class="tarjeta salta"><div>${chipHip(r.hid)}</div>${nombreSub(r.hid) ? `<p class="progreso">${esc(nombreSub(r.hid))}</p>` : ''}
      <p class="enunciado">Marca sus tests en la hoja de confirmación.</p>
      <p class="progreso">Los demás son de hipótesis vecinas del árbol.</p></section>
    <div class="opciones">${r.opciones.map((t, i) => {
      let est = '', nota = '';
      if (r.corregida) { const es = r.suyos.includes(t), m = r.marcadas.has(i);
        est = es && m ? 'ok' : !es && m ? 'mal' : es ? 'falta' : 'atenuada';
        nota = !es && m ? `<span class="nota-est">Es de ${chipHip(t.hid)}</span>` : es && !m ? '<span class="nota-est">Se te pasó</span>' : ''; }
      return `<button class="op texto ${est}" data-bt="${i}" aria-pressed="${r.marcadas.has(i)}" ${r.corregida ? 'disabled' : ''}>${esc(t.x.n)}${nota}</button>`; }).join('')}</div>
    ${r.corregida
      ? `<div class="aviso ${r.ok ? 'aviso-ok' : 'aviso-mal'}"><p class="tit">${r.ok ? 'Exacto' : 'No del todo'}</p></div>
         <button class="btn btn-pri" data-acc="sig-bateria">${J.ronda + 1 < J.orden.length ? 'Siguiente hipótesis' : 'Ver resultado'}</button>`
      : `<button class="btn btn-pri" data-acc="corregir-bateria" ${r.marcadas.size ? '' : 'disabled'}>Comprobar</button>`}`);
}
function corregirBateria() {
  const r = J.r; r.corregida = true;
  const marcadas = [...r.marcadas].map(i => r.opciones[i]);
  r.ok = marcadas.length === r.suyos.length && r.suyos.every(t => marcadas.includes(t));
  r.suyos.forEach(t => marcadas.includes(t) ? acierto(t.clave) : fallo(t.clave));
  marcadas.filter(t => !r.suyos.includes(t)).forEach(t => fallo(t.clave));
  if (r.ok) J.exactos++;
  guardar(); pintarBateria();
  r.ok ? (SON.acierto(J.exactos), vibrar(15)) : (SON.fallo(), vibrar(80));
}
function siguienteBateria() {
  J.ronda++;
  if (J.ronda < J.orden.length) { J.r = rondaBateria(J.orden[J.ronda]); window.scrollTo(0, 0); return pintarBateria(); }
  const rec = J.exactos > P.mejor.bateria; if (rec) P.mejor.bateria = J.exactos;
  window.scrollTo(0, 0);
  vista(finHTML({ etq: 'Batería · ' + REG.min, grande: `${J.exactos}/${J.orden.length}`, texto: `hipótesis exactas. ${rec ? 'Nuevo récord.' : 'Mejor: ' + P.mejor.bateria + '.'}`, otra: 'bateria' }));
  J.exactos === J.orden.length ? celebrar() : SON.fin();
  cerrarPartida({ modo: 'bateria', exactos: J.exactos });
}

/* ---------- Duelo ---------- */
function pintarDuelo(prefijo = '') {
  pararReloj(); J = null; window.scrollTo(0, 0);
  const previos = Object.entries(P.duelos).slice(-5).reverse();
  vista(`${barra({ salir: 'Inicio' })}
    <section class="tarjeta"><p class="etq">Duelo · ${REG.min}</p>
      <p>Los dos jugáis las mismas 10 preguntas con el mismo número de reto. Al terminar, comparad la puntuación.</p>
      <button class="btn btn-pri" data-acc="duelo-nuevo">Crear un reto nuevo</button></section>
    <section class="tarjeta"><p class="etq">Tengo un número de reto</p>
      <div class="fila-campo"><input class="campo" id="codigo" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" autocomplete="off" aria-label="Número de reto de 4 cifras" value="${esc(prefijo)}">
      <button class="btn" data-acc="duelo-unirme">Jugar ese reto</button></div>
      <p class="progreso" id="codigoAviso"></p></section>
    ${compararHTML()}
    ${previos.length ? `<section class="tarjeta"><p class="etq">Tus últimos retos</p>${previos.map(([c, p]) => `<p><span class="mono">nº ${c}</span> · ${p} puntos</p>`).join('')}</section>` : ''}`);
}
// Código de resultado del duelo (lib/entrena.js): con el orden de regiones de los cuadernos.
const codigoResultado = (codigo, bits, puntos) => codigoRes(ORDEN_REGIONES, REG.id, codigo, bits, puntos);
const leerCodigo = txt => leerCod(ORDEN_REGIONES, txt);
const compararHTML = () => `<section class="tarjeta"><p class="etq">Comparar con tu compañero</p>
  <label class="campo-lbl" for="codigoRival">Su código de resultado</label>
  <div class="fila-campo"><input class="campo-txt campo-codigo" id="codigoRival" autocomplete="off" placeholder="XXX-XXX-XXX" maxlength="11" style="flex:1 1 10ch"><button class="btn" data-acc="comparar">Comparar</button></div>
  <div id="comparacion" aria-live="polite"></div></section>`;
function comparar() {
  const caja = document.getElementById('comparacion'), rival = leerCodigo(document.getElementById('codigoRival').value);
  if (!rival) { caja.innerHTML = '<p class="progreso">Ese código no es válido: revisa que esté bien copiado.</p>'; return; }
  if (rival.reg !== REG.id) { caja.innerHTML = `<p class="progreso">Ese código es de ${esc(DATOS[rival.reg].nombre.toLowerCase())}: cambia a esa región y vuelve a Duelo.</p>`; return; }
  const mio = (P.duelosRes || {})[rival.codigo];
  if (!mio) { caja.innerHTML = `<p class="progreso">Aún no has jugado el reto nº ${rival.codigo} de ${esc(REG.min)}. Juégalo y compara al acabar.</p>`; return; }
  const bit = (b, k) => Math.floor(b / 2 ** k) % 2 === 1, marca = ok => ok ? '<span class="si">✓</span>' : '<span class="no">✗</span>';
  const gana = mio.puntos === rival.puntos ? 'Empate' : mio.puntos > rival.puntos ? 'Ganas tú' : 'Gana tu compañero';
  caja.innerHTML = `<p class="test-nombre">${gana} · ${mio.puntos} a ${rival.puntos}</p>
    <table class="tabla-duelo"><thead><tr><th>Reto ${rival.codigo}</th><th>Tú</th><th>Compañero</th></tr></thead><tbody>
    ${Array.from({ length: CONFIG.duelo.max }, (_, k) => `<tr><td>Pregunta ${k + 1}</td><td>${marca(bit(mio.bits, k))}</td><td>${marca(bit(rival.bits, k))}</td></tr>`).join('')}</tbody></table>`;
  mio.puntos >= rival.puntos ? celebrar() : SON.fin();
}
function jugarDuelo(codigo) { empezarRapido('duelo', { semilla: 'duelo-' + REG.id + '-' + codigo, codigo }); }

/* ---------- Pasar el móvil: dos jugadores en el mismo teléfono, la misma pregunta por turnos ---------- */
const cfgTurnos = () => (PREFS.turnos = Object.assign({ a: 'Jugador 1', b: 'Jugador 2', n: 5, mix: false }, PREFS.turnos || {}));
function leerNombres() {
  const t = cfgTurnos(), a = document.getElementById('jA'), b = document.getElementById('jB');
  if (a) t.a = a.value.trim() || 'Jugador 1'; if (b) t.b = b.value.trim() || 'Jugador 2';
  guardarPrefs(); return t;
}
function pintarTurnosInicio() {
  pararReloj(); J = null; window.scrollTo(0, 0);
  if (REG.id !== PREFS.region) { guardar(); usarRegion(PREFS.region); }
  const t = cfgTurnos();
  vista(`${barra({ salir: 'Inicio' })}
    <section class="tarjeta"><p class="etq">Pasar el móvil</p>
      <p>Respondéis la misma pregunta por turnos, sin ver lo que marca el otro. Suma quien acierta, y más cuanto antes. No cuenta para el progreso de nadie.</p></section>
    <section class="tarjeta">
      <label class="campo-lbl" for="jA">Jugador 1</label><input class="campo-txt" id="jA" maxlength="20" autocomplete="off" value="${esc(t.a)}">
      <label class="campo-lbl" for="jB">Jugador 2</label><input class="campo-txt" id="jB" maxlength="20" autocomplete="off" value="${esc(t.b)}">
      <p class="campo-lbl">Preguntas</p>
      <div class="fila-btn" role="group" aria-label="Número de preguntas">${[5, 10].map(n => `<button class="btn ${t.n === n ? 'btn-pri' : ''}" data-tn="${n}" aria-pressed="${t.n === n}">${n}</button>`).join('')}</div>
      <button class="op texto" data-acc="t-mix" aria-pressed="${t.mix}">${t.mix ? 'Las 7 regiones mezcladas' : 'Solo ' + esc(REG.min) + ' (toca para mezclar las 7)'}</button>
    </section>
    <button class="btn btn-pri" data-acc="t-empezar">Empezar</button>`);
}
function empezarTurnos() {
  const t = leerNombres(); pararReloj(); RNG = Math.random; window.scrollTo(0, 0);
  J = { modo: 'turnos', nombres: [t.a, t.b], puntos: [0, 0], aciertos: [0, 0], ronda: 0, max: t.n, mix: t.mix };
  nuevaRondaTurnos();
}
const marcadorTurnos = () => `${J.puntos[0]}–${J.puntos[1]}<small>${esc(corta(J.nombres[0], 7))} · ${esc(corta(J.nombres[1], 7))}</small>`;
function nuevaRondaTurnos() {
  if (J.ronda >= J.max) return finTurnos();
  J.q = J.mix ? genMezcla(false) : (RNG() < .7 ? nuevaPregunta(false) : preguntaDeQuien(false));
  J.resp = [null, null]; J.orden = J.ronda % 2 ? [1, 0] : [0, 1]; J.paso = 0;
  pantallaPase();
}
function pantallaPase() {
  const quien = J.orden[J.paso]; window.scrollTo(0, 0);
  vista(`${barra({ centro: `<span class="progreso">Pregunta ${J.ronda + 1}/${J.max}</span>`, derecha: marcadorTurnos() })}
    <section class="tarjeta pase salta"><p class="etq">${J.paso ? 'Pasa el móvil' : 'Empieza'}</p>
      <p class="test-nombre">Turno de ${esc(J.nombres[quien])}</p>
      <p class="progreso">Que ${esc(J.nombres[1 - quien])} no mire la pantalla.</p>
      <button class="btn btn-pri" data-acc="t-listo">Soy ${esc(J.nombres[quien])}: ver la pregunta</button></section>`);
}
function preguntaTurno() {
  const quien = J.orden[J.paso], q = J.q;
  if (q.region) enRegion(q.region);
  J.respondido = false; J.restante = J.segTotal = segLectura(q);
  vista(`${barra({ centro: `<span class="progreso">${esc(corta(J.nombres[quien], 10))} · ${J.ronda + 1}/${J.max}</span>`, derecha: marcadorTurnos(), reloj: true })}
    <div class="tarjeta salta">${q.region ? `<span class="chip-reg-mini">${esc(REG.nombre)}</span>` : ''}${enunciadoHTML(q)}</div>
    ${opcionesHTML(q, 'tu')}`);
  cuentaAtras(J.segTotal, () => responderTurno(-1), qd => { J.restante = qd; });
}
function responderTurno(i) {
  if (!J || J.modo !== 'turnos' || J.respondido) return; J.respondido = true; pararReloj();
  const quien = J.orden[J.paso], ok = i >= 0 && J.q.opciones[i].ok;
  J.resp[quien] = { i, ok, pts: ok ? 10 + Math.ceil(J.restante / (J.segTotal || 15) * 15) : 0 };
  SON.carta(); vibrar(15);   // mismo sonido acierte o no: el otro no debe saberlo
  J.paso++;
  if (J.paso < 2) pantallaPase(); else revelarTurno();
}
function revelarTurno() {
  const q = J.q;
  J.resp.forEach((x, k) => { J.puntos[k] += x.pts; if (x.ok) J.aciertos[k]++; });
  const quien = i => J.resp.map((x, k) => x.i === i ? esc(J.nombres[k]) : null).filter(Boolean);
  window.scrollTo(0, 0);
  vista(`${barra({ centro: `<span class="progreso">Pregunta ${J.ronda + 1}/${J.max}</span>`, derecha: marcadorTurnos() })}
    <div class="tarjeta">${q.region ? `<span class="chip-reg-mini">${esc(REG.nombre)}</span>` : ''}${enunciadoHTML(q)}</div>
    ${opcionesHTML(q, 'visto', i => quien(i).length ? `<span class="quien">${quien(i).join(' · ')}</span>` : '')}
    <div class="aviso aviso-info">${J.resp.map((x, k) => `<p><b>${esc(J.nombres[k])}:</b> ${x.ok ? `<span class="si">✓</span> +${x.pts}` : x.i < 0 ? '<span class="no">✗</span> sin responder' : '<span class="no">✗</span>'}</p>`).join('')}
      <p class="porque">${explicacionHTML(q)}</p></div>
    <button class="btn btn-pri" data-acc="t-sig">${J.ronda + 1 < J.max ? 'Siguiente pregunta' : 'Ver quién gana'}</button>`);
  document.querySelectorAll('[data-visto]').forEach((b, k) => { b.disabled = true; if (q.opciones[k].ok) b.classList.add('ok'); else if (J.resp.some(x => x.i === k)) b.classList.add('mal'); else b.classList.add('atenuada'); });
  J.resp.some(x => x.ok) ? SON.acierto(1) : SON.fallo();
}
function finTurnos() {
  if (REG.id !== PREFS.region) { guardar(); usarRegion(PREFS.region); }
  const [a, b] = J.puntos, gana = a === b ? 'Empate' : `Gana ${J.nombres[a > b ? 0 : 1]}`;
  window.scrollTo(0, 0);
  vista(`${barra({ salir: 'Inicio' })}
    <section class="tarjeta salta"><p class="etq">Pasar el móvil</p><div class="gran-num">${a}–${b}</div><p class="test-nombre">${esc(gana)}</p>
      <p>${esc(J.nombres[0])}: ${J.aciertos[0]} de ${J.max} · ${esc(J.nombres[1])}: ${J.aciertos[1]} de ${J.max}</p></section>
    <div class="fila-btn"><button class="btn" data-acc="inicio">Inicio</button><button class="btn btn-pri" data-acc="t-empezar">Revancha</button></div>`);
  a === b ? SON.fin() : celebrar();
}

/* ---------- Hojas: la hoja impresa (imagen) y su contenido en texto, con buscador ---------- */
let HV = { tipo: 'arbol', modo: 'papel', q: '' };
const normal = t => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const archivoHoja = tipo => (tipo === 'arbol' ? 'arbol-a4-' : 'confirmacion-') + REG.id;
function pintarHojas(tipo = HV.tipo, ancla = null) {
  pararReloj(); J = null;
  HV.tipo = tipo; HV.modo = ancla ? 'texto' : (PREFS.hojaModo || 'papel');
  const esEsencia = tipo === 'esencia';
  const ruta = `${URL_GUIA}#${REG.id}/${tipo === 'esencia' ? 'arbol' : tipo}`;
  vista(`${barra({ salir: 'Inicio', centro: `<span class="progreso">${esc(REG.nombre)}</span>` })}
    <div class="pestanas" role="group" aria-label="Hoja">${[['esencia', 'Esencia'], ['arbol', 'Árbol'], ['confirmacion', 'Confirmación', '4b']].map(([k, t, c]) => `<button data-hv-tipo="${k}" aria-pressed="${k === tipo}" aria-label="${t}">${c ? `<span class="largo">${t}</span><span class="corto">${c}</span>` : t}</button>`).join('')}</div>
    ${esEsencia ? '' : `<div class="pestanas" role="group" aria-label="Formato">${[['papel', 'Papel'], ['texto', 'Texto']].map(([k, t]) => `<button data-hv-modo="${k}" aria-pressed="${k === HV.modo}">${t}</button>`).join('')}</div>`}
    <div id="hojaCuerpo"></div>
    <p class="pie">Porqués, fuentes y calculadora: <a class="enlace-ext" href="${ruta}" target="_blank" rel="noopener noreferrer">abrir en la guía ↗</a></p>`);
  pintarCuerpoHoja(ancla);
}
// El PDF actual de la hoja, con su versión en la URL (?v=, como la guía) para no abrir una copia vieja.
let HUELLAS = null;
const cargarHuellas = () => HUELLAS ? Promise.resolve() : fetch('./docs/esquemas/huellas.json', { cache: 'no-store' }).then(r => r.json()).then(j => { HUELLAS = j; }).catch(() => { HUELLAS = {}; });
const urlPDFHoja = base => `./docs/esquemas/${base}.pdf${HUELLAS?.[base]?.huella ? `?v=${encodeURIComponent(HUELLAS[base].huella)}` : ''}`;
function pintarCuerpoHoja(ancla) {
  const caja = document.getElementById('hojaCuerpo'), base = archivoHoja(HV.tipo);
  if (HV.tipo === 'esencia') {
    caja.innerHTML = `<section class="tarjeta"><p class="etq">El árbol en una línea</p><p class="cadena">${PASOS.map(s => `<span><b class="mono">${s.num}</b> ${esc(titPaso(s))}</span>`).join('<span class="flecha" aria-hidden="true">→</span>')}</p></section>
      ${PASOS.map(s => `<section class="tarjeta esencia" id="esencia-${s.id}" data-ia-ctx="${attrIA(ctxArbol(REG.id, s.q))}"><div class="esencia-cab"><span class="num-paso">${s.num}</span><b>${esc(titPaso(s))}</b></div>
        ${s.porque ? `<p>${esc(primeraFrase(s.porque))}${iaParrafoHTML()}</p>${s.porque.length > primeraFrase(s.porque).length + 2 ? `<details class="razon"><summary>Más</summary><p>${esc(s.porque.slice(primeraFrase(s.porque).length).trim())}${iaParrafoHTML()}</p></details>` : ''}` : ''}
        <button class="ver-hoja ia-excluir" data-ver="${REG.id}|arbol|paso-${s.id}">Ver el paso en la hoja →</button></section>`).join('')}`;
    if (ancla) { const el = document.getElementById(ancla); if (el) { el.scrollIntoView({ block: 'start', behavior: movimiento() }); el.classList.add('destacado-hoja'); } }
    return;
  }
  if (HV.modo === 'papel') {
    caja.innerHTML = `<p class="progreso">Toca la hoja para ampliarla. <a class="enlace-ext" href="${urlPDFHoja(base)}" target="_blank" rel="noopener noreferrer">Abrir el PDF ↗</a></p>
      <div class="papel"><button data-lupa="${base}" aria-label="Ampliar la hoja"><img src="docs/esquemas/${base}.png" alt="Hoja ${HV.tipo === 'arbol' ? 'Árbol de decisión' : 'Confirmación de hipótesis'} de ${esc(REG.min)}, como en el cuaderno impreso" loading="lazy"></button></div>`;
    cargarHuellas().then(() => { const a = caja.querySelector('.enlace-ext'); if (a) a.href = urlPDFHoja(base); });
    return;
  }
  caja.innerHTML = `<input class="buscar" id="buscarHoja" type="search" placeholder="${HV.tipo === 'arbol' ? 'Buscar en el árbol' : 'Buscar hipótesis o test'}" value="${esc(HV.q)}" aria-label="Buscar en la hoja" autocomplete="off">
    <p class="progreso" id="hojaCuenta"></p><div id="hojaLista" class="grupo"></div>`;
  pintarListaHoja();
  if (ancla) { const el = document.getElementById(ancla); if (el) { if (el.tagName === 'DETAILS') el.open = true; el.scrollIntoView({ block: 'start', behavior: movimiento() }); animar(el, 'destacado-hoja'); el.classList.add('destacado-hoja'); } }
}
function pasoHTML(s) {
  return `<section class="tarjeta hoja-paso" id="paso-${s.id}" data-ia-ctx="${attrIA(ctxArbol(REG.id, s.q))}">${preguntaHTML(s)}
    ${s.opts.map(o => `<div class="hoja-op">${respuestaHTML(o)}<span class="flecha">→</span><div class="res-caja">${esRama(s) ? `<span class="chip-sin">${destinoTxt(o.next)}</span>` : resultadoHTML(o, false)}</div>
      ${o.deriv ? `<div class="correcta deriv-caja"><b>Derivación médica.</b> ${esc(o.deriv)}</div>` : ''}</div>`).join('')}
    ${s.porque ? `<details class="razon"><summary>¿Por qué esta pregunta?</summary><p>${esc(s.porque)}${iaParrafoHTML()}</p></details>` : ''}</section>`;
}
function hipHTML(id) {
  const h = HIP[id], sale = [];
  PASOS.forEach(s => s.opts.forEach(o => { if (o.h.includes(id)) sale.push(`paso ${s.num} · «${esc(o.t)}»`); }));
  const cls = Object.values(h.clusters || {});
  return `<section class="tarjeta" id="hip-${id}"><div>${chipHip(id)}</div>${nombreSub(id) ? `<p class="progreso">${esc(nombreSub(id))}</p>` : ''}
    ${sale.length ? `<p class="sale-en">Sale en el ${sale.join(' y en el ')}</p>` : ''}
    ${cls.map(c => `<p class="sale-en"><b>${esc(c.n)}:</b> LR+ ${esc(c.lp)} con ${c.up} o más positivos; LR− ${esc(c.ln)} con ${c.un} o menos, solo si se hicieron todos.</p>`).join('')}
    <div>${h.tests.map((x, i) => `<details class="test-det" id="test-${id}-${i}" ${atributosIA(ctxTest(REG.id, x.n, h.name))}><summary><span>${esc(x.n)}</span><span class="cat ia-excluir ${x.c === 'hallazgo' || x.c === 'pronostico' ? '' : 'cat-puntua'}">${CATS[x.c]}</span>${x.lp || x.ln ? `<span class="mono progreso ia-excluir">${[x.lp && 'LR+ ' + x.lp, x.ln && 'LR− ' + x.ln].filter(Boolean).join(' · ')}</span>` : ''}</summary>
      <p>${esc(x.crit)}${iaParrafoHTML()}</p><p class="progreso ia-excluir">${esc(x.p)}</p>${anatomiaHTML(x)}</details>`).join('')}</div></section>`;
}
function pintarListaHoja() {
  const q = normal(HV.q.trim()), lista = document.getElementById('hojaLista'); if (!lista) return;
  let items;
  if (HV.tipo === 'arbol') {
    const pasan = PASOS.filter(s => !q || normal([s.num, s.q, ...s.opts.flatMap(o => [o.t, o.d, ...o.h.map(id => HIP[id].n + ' ' + HIP[id].name)])].join(' ')).includes(q));
    items = pasan.map(pasoHTML); document.getElementById('hojaCuenta').textContent = q ? `${pasan.length} ${pasan.length === 1 ? 'paso' : 'pasos'}` : '';
  } else {
    const ids = Object.keys(HIP).sort((a, b) => HIP[a].n - HIP[b].n);
    const pasan = ids.filter(id => !q || normal([HIP[id].n, HIP[id].name, ...HIP[id].tests.flatMap(x => [x.n, x.crit])].join(' ')).includes(q));
    items = pasan.map(hipHTML); document.getElementById('hojaCuenta').textContent = q ? `${pasan.length} ${pasan.length === 1 ? 'hipótesis' : 'hipótesis'}` : '';
  }
  lista.innerHTML = items.join('') || '<p class="progreso">Nada coincide con la búsqueda.</p>';
}
function abrirAyuda() {
  if (!J) return;
  pausarReloj(); J.ayuda = true;
  const b0 = document.querySelector('.ayuda-btn'); if (b0) b0.classList.add('usada');
  const velo = document.createElement('div'); velo.className = 'velo';
  velo.innerHTML = `<div class="hoja-sel" role="dialog" aria-modal="true" aria-label="Qué busca cada paso">${ASA}
    <div class="sel-cab"><p class="etq">${esc(REG.nombre)} · ayuda</p><b>Qué busca cada paso</b><span>El tiempo está parado. Esta partida ya no cuenta para récords ni logros.</span></div>
    <div class="lista">${PASOS.map(s => `<div class="esencia-fila"><span class="num-paso">${s.num}</span><div><b>${esc(titPaso(s))}</b>${s.porque ? `<p ${ctxPasoAttr(s)}>${esc(primeraFrase(s.porque))}</p>` : ''}</div></div>`).join('')}</div>
    <button class="btn btn-pri" data-x="cerrar">Volver al juego</button></div>`;
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  const cerrar = (o = {}) => { if (!velo.isConnected) return; velo.remove(); soltarCapa(cerrar, o); document.removeEventListener('keydown', tecla); reanudarReloj(); const b = document.querySelector('.ayuda-btn'); if (b) b.focus(); };
  velo.addEventListener('click', e => { if (e.target === velo || e.target.closest('[data-x]')) cerrar(); });
  document.addEventListener('keydown', tecla); document.body.appendChild(velo); abrirCapa(cerrar); deslizarParaCerrar(velo, cerrar); velo.querySelector('[data-x]').focus();
}
function verEsencia(id) {
  const s = PASOS.find(x => x.id === id); if (!s) return;
  const velo = document.createElement('div'); velo.className = 'velo';
  velo.innerHTML = `<div class="hoja-sel" role="dialog" aria-modal="true" aria-label="Paso ${s.num}">${ASA}
    <div class="esencia-cab"><span class="num-paso">${s.num}</span><b>${esc(titPaso(s))}</b></div>
    ${s.porque ? `<p class="porque" ${ctxPasoAttr(s)}>${esc(primeraFrase(s.porque))}</p>` : ''}
    <p class="progreso">Pregunta: «${esc(s.q)}»</p>
    <div class="fila-btn"><button class="btn" data-x="cerrar" style="flex:0 0 auto;padding-inline:16px">Cerrar</button><button class="btn btn-pri" data-x="esencia">Esencia del árbol</button></div></div>`;
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  const cerrar = (o = {}) => { if (!velo.isConnected) return; velo.remove(); soltarCapa(cerrar, o); document.removeEventListener('keydown', tecla); const b = document.querySelector(`[data-esencia="${id}"]`); if (b) b.focus(); };
  velo.addEventListener('click', e => {
    if (e.target === velo) return cerrar();
    const b = e.target.closest('[data-x]'); if (!b) return;
    cerrar(); if (b.dataset.x === 'esencia') { HV.q = ''; window.scrollTo(0, 0); pintarHojas('esencia', 'esencia-' + id); }
  });
  document.addEventListener('keydown', tecla); document.body.appendChild(velo); abrirCapa(cerrar); deslizarParaCerrar(velo, cerrar); velo.querySelector('[data-x="esencia"]').focus();
}
// «✨ Preguntar a la IA»: los tres modos de la app (promptPregunta) con la región como único contexto.
function preguntarIA() {
  let tipo = TIPO_PREGUNTA_DEFECTO, texto = '';
  const velo = document.createElement('div'); velo.className = 'velo';
  const pintar = () => {
    const d = destinoIA(), t = TIPOS_PREGUNTA[tipo], valido = texto.trim().length >= 3;
    velo.innerHTML = `<div class="hoja-sel pregunta-ia" role="dialog" aria-modal="true" aria-label="Preguntar a la IA">${ASA}
      <div class="sel-cab"><p class="etq">Preguntar a la IA · ${esc(REG.min)}</p><b>Una duda que no está en las hojas</b></div>
      <div class="selector-fila" role="group" aria-label="Tipo de pregunta">${Object.entries(TIPOS_PREGUNTA).map(([k, v]) => `<button data-tp="${k}" aria-pressed="${k === tipo}">${esc(v.corto || v.nombre)}</button>`).join('')}</div>
      <textarea id="preguntaTexto" maxlength="${MAX_TEXTO_IA}" placeholder="${esc(t.placeholder)}" aria-label="Tu pregunta">${esc(texto)}</textarea>
      ${t.guion ? `<p class="guion">${esc(t.guion)}</p>` : ''}
      <p class="aviso-datos">No escribas datos que identifiquen al paciente.</p>
      <div class="selector-fila" role="group" aria-label="IA">${Object.entries(DESTINOS_IA).map(([k, v]) => `<button data-ds="${k}" aria-pressed="${k === d}">${esc(v.nombre.replace(/ \(.*\)$/, ''))}</button>`).join('')}</div>
      <p class="guion">${esc(DESTINOS_IA[d].ventaja)}</p>
      <div class="fila-btn"><button class="btn" data-x="cerrar">Cerrar</button><a class="btn btn-pri btn-ir" target="_blank" rel="noopener noreferrer" aria-disabled="${!valido}" href="${valido ? urlIA(d, promptPregunta({ contexto: REG.min, pregunta: texto, tipo })) : '#'}">Preguntar ↗</a></div>
      <p class="guion">${esc(NOTA_CUENTAS)} Solo se envía tu pregunta y la región. Consulta externa: PhysiQ no revisa la respuesta.</p></div>`;
  };
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  const cerrar = (o = {}) => { if (!velo.isConnected) return; velo.remove(); soltarCapa(cerrar, o); document.removeEventListener('keydown', tecla); const b = document.querySelector('[data-acc="preguntar-ia"]'); if (b) b.focus(); };
  velo.addEventListener('click', e => {
    if (e.target === velo) return cerrar();
    const b = e.target.closest('[data-tp], [data-ds], [data-x], .btn-ir'); if (!b) return;
    if (b.dataset.tp) { tipo = b.dataset.tp; pintar(); return; }
    if (b.dataset.ds) { guardarDestinoIA(b.dataset.ds); pintar(); return; }
    if (b.dataset.x) return cerrar();
    if (b.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });
  velo.addEventListener('input', e => {
    if (e.target.id !== 'preguntaTexto') return;
    texto = e.target.value;
    const a = velo.querySelector('.btn-ir'), valido = texto.trim().length >= 3;
    a.setAttribute('aria-disabled', String(!valido)); a.href = valido ? urlIA(destinoIA(), promptPregunta({ contexto: REG.min, pregunta: texto, tipo })) : '#';
  });
  velo.addEventListener('keydown', e => { if (e.target.id === 'preguntaTexto' && e.key === 'Enter' && !e.shiftKey && texto.trim().length >= 3) { e.preventDefault(); velo.querySelector('.btn-ir').click(); } });
  pintar(); document.addEventListener('keydown', tecla); document.body.appendChild(velo); abrirCapa(cerrar); deslizarParaCerrar(velo, cerrar);
  const ta = velo.querySelector('textarea'); if (!matchMedia('(pointer: coarse)').matches) ta.focus(); else velo.querySelector('.hoja-sel').setAttribute('tabindex', '-1');
}
function abrirLupa(nombre) {
  const velo = document.createElement('div'); velo.className = 'lupa-velo'; velo.setAttribute('role', 'dialog'); velo.setAttribute('aria-label', 'Página ampliada');
  velo.innerHTML = `<img src="docs/esquemas/${nombre}.png" alt="Hoja ampliada"><button class="lupa-cerrar" aria-label="Cerrar">${icono.cerrar}</button><span class="lupa-nota">Desliza para moverte</span>`;
  const cerrar = (o = {}) => { if (!velo.isConnected) return; velo.remove(); soltarCapa(cerrar, o); document.removeEventListener('keydown', tecla); const b = document.querySelector(`[data-lupa="${nombre}"]`); if (b) b.focus(); };
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  velo.querySelector('.lupa-cerrar').addEventListener('click', cerrar); document.addEventListener('keydown', tecla);
  document.body.appendChild(velo); abrirCapa(cerrar); velo.querySelector('.lupa-cerrar').focus();
  setTimeout(() => { const n = velo.querySelector('.lupa-nota'); if (n) n.remove(); }, 2500);
}
// «Ver en la hoja» desde el repaso: región, hoja y elemento.
function verHojaHTML(q) {
  const reg = q.region || REG.id;
  const destino = q.t && q.t.hid ? `confirmacion|hip-${q.t.hid}` : q.t && q.t.s ? `arbol|paso-${q.t.s.id}` : '';
  return destino ? ` <button class="ver-hoja" data-ver="${reg}|${destino}">Ver en la hoja →</button>` : '';
}
function verHoja(valor) {
  const [reg, tipo, ancla] = valor.split('|');
  if (reg !== REG.id) { guardar(); usarRegion(reg); PREFS.region = reg; guardarPrefs(); }
  HV.q = ''; window.scrollTo(0, 0); pintarHojas(tipo, ancla);
}

/* ---------- Versión nueva: el mismo aviso que la app (app.js, comprobarVersion) ---------- */
// lib/version.js lleva 'dev' en el repo y el commit en el despliegue; version.json es la versión
// publicada, pedida sin caché. Si difieren, el inicio del juego (nunca una partida) avisa con
// «Actualizar». Se comprueba al abrir y al volver a la app, como mucho una vez por minuto.
let _versionNueva = null, _versionComprobada = 0, _versionCerrada = '';
const CLAVE_RECARGA = 'physiq-entrena-recarga';   // sessionStorage: versión por la que ya se recargó
const shaRecargado = () => { try { return sessionStorage.getItem(CLAVE_RECARGA) || ''; } catch (e) { return ''; } };
const anotarRecarga = sha => { try { sha ? sessionStorage.setItem(CLAVE_RECARGA, sha) : sessionStorage.removeItem(CLAVE_RECARGA); } catch (e) {} };
const versionPendiente = () => !!_versionNueva && shaRecargado() === _versionNueva.sha;
async function comprobarVersion({ manual = false } = {}) {
  if (VERSION_SHA === 'dev') { if (manual) avisar('Versión de desarrollo: no hay despliegue con el que comparar.', { trofeo: false }); return; }
  if (!manual && Date.now() - _versionComprobada < 60000) return;
  _versionComprobada = Date.now();
  let publicada;
  try { const r = await fetch('./version.json', { cache: 'no-store' }); if (!r.ok) throw new Error(String(r.status)); publicada = await r.json(); }
  catch (e) { if (manual) avisar('No se ha podido comprobar la versión (¿sin conexión?).', { trofeo: false }); return; }
  if (!esVersionNueva(publicada)) {
    _versionNueva = null; anotarRecarga(''); quitarAvisoVersion();
    if (manual) avisar(`Estás en la última versión (${textoVersion()})`, { trofeo: false });
    return;
  }
  _versionNueva = publicada;
  if (manual) _versionCerrada = '';
  mostrarAvisoVersion();
  const pie = document.querySelector('.pie-version .enlace'); if (pie) { pie.dataset.acc = 'version-actualizar'; pie.textContent = 'Actualizar'; }
}
function quitarAvisoVersion() { document.getElementById('versionAviso')?.remove(); }
function mostrarAvisoVersion() {
  if (!_versionNueva || _versionCerrada === _versionNueva.sha || J || document.getElementById('versionAviso')) return;
  const aviso = document.createElement('div');
  aviso.id = 'versionAviso'; aviso.className = 'version-aviso'; aviso.setAttribute('role', 'status');
  aviso.innerHTML = `<span class="version-aviso-texto">${versionPendiente() ? 'La versión nueva aún se está publicando: prueba en unos minutos' : '<span class="version-aviso-largo">Hay una versión nueva</span><span class="version-aviso-corto">Versión nueva</span>'}</span>
    <button type="button" class="version-aviso-btn" data-v="actualizar">Actualizar</button>
    <button type="button" class="version-aviso-cerrar" data-v="cerrar" aria-label="Cerrar aviso" title="Ahora no">${icono.cerrar}</button>`;
  aviso.addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    if (b.dataset.v === 'actualizar') return recargarVersionNueva();
    _versionCerrada = _versionNueva?.sha || ''; aviso.remove();
  });
  document.body.appendChild(aviso);
}
// Antes de recargar se vuelven a pedir los archivos propios que ha cargado la página (cache:
// 'reload'), para que la caché del navegador no sirva el código anterior; como mucho 4 s.
async function recargarVersionNueva() {
  guardar(); anotarRecarga(_versionNueva?.sha || '');
  const aviso = document.getElementById('versionAviso');
  if (aviso) { aviso.classList.add('version-aviso-actualizando'); aviso.setAttribute('aria-busy', 'true'); aviso.innerHTML = '<span class="version-aviso-giro" aria-hidden="true"></span><span class="version-aviso-texto">Actualizando…</span>'; }
  const urls = [...new Set(performance.getEntriesByType('resource').map(e => e.name))].filter(u => { try { const x = new URL(u); return x.origin === location.origin && /\.(js|css)$/.test(x.pathname); } catch (e) { return false; } });
  try { await navigator.serviceWorker?.getRegistration().then(r => r?.update()); } catch (e) {}
  await Promise.race([Promise.allSettled(urls.map(u => fetch(u, { cache: 'reload' }))), new Promise(r => setTimeout(r, 4000))]);
  location.reload();
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') comprobarVersion(); });

/* ---------- Atrás: botón del sistema, gesto de Android y deslizar desde el borde ---------- */
// Cada pantalla que no es el inicio añade una entrada al historial, y cada ventana (selector,
// ayuda, esencia de un paso, preguntar a la IA, hoja ampliada) otra encima. Atrás cierra la
// ventana abierta o vuelve al inicio; nunca sale de la app desde una pantalla de juego. Cerrar
// con su propio botón gasta su entrada, para que el historial no acumule entradas vacías.
const CAPAS = [];
let _enPantalla = false, _pintandoInicio = false, _ignorarPop = 0, _pushPendiente = false;
function empujar() { if (_ignorarPop > 0) _pushPendiente = true; else history.pushState({ entrena: true }, ''); }
function entrarPantalla() { if (_enPantalla) return; _enPantalla = true; empujar(); }
function abrirCapa(cerrar) { CAPAS.push(cerrar); empujar(); }
function soltarCapa(cerrar, { desdeAtras = false } = {}) {
  const i = CAPAS.lastIndexOf(cerrar); if (i < 0) return;
  CAPAS.splice(i, 1);
  if (!desdeAtras) { _ignorarPop++; history.back(); }
}
window.addEventListener('popstate', () => {
  if (_ignorarPop > 0) {
    _ignorarPop--;
    if (!_ignorarPop && _pushPendiente) { _pushPendiente = false; history.pushState({ entrena: true }, ''); }
    return;
  }
  const capa = CAPAS.pop();
  if (capa) { capa({ desdeAtras: true }); return; }
  if (_enPantalla) { window.scrollTo(0, 0); inicio({ desdeAtras: true }); }
});
// Deslizar desde el borde izquierdo hacia la derecha = Atrás. En Safari de iPhone no hace falta
// (ya tiene ese gesto y se duplicaría), pero sí en la app instalada en iPhone, que no tiene Atrás.
function initDeslizarAtras() {
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const instalada = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (ios && !instalada) return;
  const BORDE = 24, UMBRAL = 90;
  let ini = null, marca = null;
  const fin = ir => { if (marca) marca.remove(); marca = null; ini = null; if (ir) history.back(); };
  addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || (!_enPantalla && !CAPAS.length)) return;
    const t = e.touches[0];
    if (t.clientX > BORDE || e.target.closest?.('.carta-swipe, .lupa-velo, textarea, input')) return;
    ini = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (!ini) return;
    const t = e.touches[0], dx = t.clientX - ini.x, dy = t.clientY - ini.y;
    if (Math.abs(dy) > 40 && Math.abs(dy) > dx) return fin(false);
    if (!marca) { marca = document.createElement('div'); marca.className = 'atras-marca'; marca.setAttribute('aria-hidden', 'true'); marca.textContent = '‹'; document.body.appendChild(marca); }
    const k = Math.max(0, Math.min(1, dx / UMBRAL));
    marca.style.top = `${t.clientY}px`; marca.style.opacity = String(k);
    marca.style.transform = `translate(${Math.round(-44 + 64 * k)}px, -50%)`;
    marca.classList.toggle('lista', k >= 1);
  }, { passive: true });
  addEventListener('touchend', e => { if (ini) fin(e.changedTouches[0].clientX - ini.x >= UMBRAL); }, { passive: true });
  addEventListener('touchcancel', () => fin(false), { passive: true });
}

/* ---------- Eventos ---------- */
const MODOS = {
  diario: () => empezarRapido('diario', { semilla: 'diario-' + REG.id + '-' + hoyStr() }),
  flechas: () => empezarRapido('flechas'), subita: () => empezarRapido('subita'),
  desliza: empezarDesliza, enpaso: empezarEnPaso, completa: empezarCompleta,
  dequien: () => empezarRapido('dequien'), mezcla: () => empezarRapido('mezcla'), diariomix: () => empezarRapido('diariomix', { semilla: 'diariomix-' + hoyStr() }), positivo: () => empezarRapido('positivo'), pesa: () => empezarRapido('pesa'), bateria: empezarBateria, caso: empezarCaso, detective: empezarDetective,
  error: empezarError, ordena: empezarOrdena, parejas: empezarParejas, hoja: pintarNiveles, duelo: () => pintarDuelo(), turnos: pintarTurnosInicio
};
$app.addEventListener('click', e => {
  audio();
  const el = e.target.closest('button'); if (!el || el.disabled) return;
  const d = el.dataset;
  if (d.modo) return MODOS[d.modo]();
  if (d.nivel) return empezarHoja(+d.nivel);
  if (d.op) return responderRapida(+d.op);
  if (d.caso) return responderCaso(+d.caso);
  if (d.dz) return responderDesliza(d.dz === '1');
  if (d.esencia) return verEsencia(d.esencia);
  if (d.hoja) { HV.q = ''; window.scrollTo(0, 0); return pintarHojas(d.hoja); }
  if (d.hvTipo) { HV.q = ''; return pintarHojas(d.hvTipo); }
  if (d.hvModo) { PREFS.hojaModo = d.hvModo; guardarPrefs(); return pintarHojas(HV.tipo); }
  if (d.lupa) return abrirLupa(d.lupa);
  if (d.ver) return verHoja(d.ver);
  if (d.racha) { if (d.racha === 'mix') return MODOS.diariomix(); guardar(); usarRegion(d.racha); PREFS.region = d.racha; guardarPrefs(); return MODOS.diario(); }
  if (d.tn) { const t = leerNombres(); t.n = +d.tn; guardarPrefs(); return pintarTurnosInicio(); }
  if (d.tu) return responderTurno(+d.tu);
  if (d.reg) { usarRegion(d.reg); PREFS.region = d.reg; guardarPrefs(); return inicio(); }
  if (d.ep) return responderEnPaso(d.ep);
  if (d.bt) { SON.carta(); const i = +d.bt; J.r.marcadas.has(i) ? J.r.marcadas.delete(i) : J.r.marcadas.add(i); return pintarBateria(); }
  if (d.cp) { SON.carta(); const i = +d.cp; J.r.marcadas.has(i) ? J.r.marcadas.delete(i) : J.r.marcadas.add(i); return pintarCompleta(); }
  if (d.det) { const i = +d.det; J.d.marcadas.has(i) ? J.d.marcadas.delete(i) : J.d.marcadas.add(i); return pintarDetective(); }
  if (d.err) { SON.carta(); J.marcas.has(d.err) ? J.marcas.delete(d.err) : J.marcas.add(d.err); const y = window.scrollY; pintarError(); window.scrollTo(0, y); return; }
  if (d.pool) { SON.carta(); J.orden.push(J.pool.splice(+d.pool, 1)[0]); return pintarOrdena(); }
  if (d.slot) { const s = J.orden.splice(+d.slot, 1)[0]; J.pool.push(s); return pintarOrdena(); }
  if (d.par) return tocarCarta(+d.par);
  if (d.hueco) return abrirHueco(d.hueco);
  const acc = d.acc; if (!acc) return;
  if (acc === 'inicio') { window.scrollTo(0, 0); return inicio(); }
  if (acc === 'siguiente') return siguienteRapida();
  if (acc === 'paso-caso') { J.c.paso++; window.scrollTo(0, 0); return pintarCaso(); }
  if (acc === 'fin-caso') { window.scrollTo(0, 0); return finCaso(); }
  if (acc === 'corregir-detective') return corregirDetective();
  if (acc === 'otro-detective') { J.d = nuevoDetective(); window.scrollTo(0, 0); return pintarDetective(); }
  if (acc === 'fin-detective') return finDetective();
  if (acc === 'corregir-error') return corregirError();
  if (acc === 'corregir-completa') return corregirCompleta();
  if (acc === 'pista-completa') { J.r.pista = true; SON.carta(); return pintarCompleta(); }
  if (acc === 'corregir-bateria') return corregirBateria();
  if (acc === 'sig-bateria') return siguienteBateria();
  if (acc === 'sig-completa') return siguienteCompleta();
  if (acc === 'corregir-ordena') return corregirOrdena();
  if (acc === 'corregir-hoja') return corregirHoja();
  if (acc === 'duelo-nuevo') return jugarDuelo(String(1000 + Math.floor(Math.random() * 9000)));
  if (acc === 'duelo-unirme') { const v = document.getElementById('codigo').value.trim();
    if (/^\d{4}$/.test(v)) return jugarDuelo(v); document.getElementById('codigoAviso').textContent = 'El número de reto tiene 4 cifras.'; return; }
  if (acc === 'copiar') { const t = document.getElementById('txtDuelo');
    navigator.clipboard.writeText(t.value).then(() => avisar('Mensaje copiado'), () => { t.focus(); t.select(); avisar('Selecciona y copia el mensaje'); }).catch(() => {}); return; }
  if (acc === 'region') return menuRegion();
  if (acc === 'version-comprobar') return comprobarVersion({ manual: true });
  if (acc === 'version-actualizar') return recargarVersionNueva();
  if (acc === 'ayuda') return abrirAyuda();
  if (acc === 'preguntar-ia') return preguntarIA();
  if (acc === 'pesa-no') return avisar(el.title);
  if (acc === 'sonido') { PREFS.sonido = !PREFS.sonido; guardarPrefs(); if (PREFS.sonido) SON.acierto(1); return inicio(); }
  if (acc === 't-mix') { const t = leerNombres(); t.mix = !t.mix; guardarPrefs(); return pintarTurnosInicio(); }
  if (acc === 't-empezar') return empezarTurnos();
  if (acc === 't-listo') return preguntaTurno();
  if (acc === 't-sig') { J.ronda++; return nuevaRondaTurnos(); }
  if (acc === 'comparar') return comparar();
  if (acc === 'borrar') { confirmandoBorrar = true; return inicio(); }
  if (acc === 'borrar-no') { confirmandoBorrar = false; return inicio(); }
  if (acc === 'borrar-si') { P = base(); guardar(); confirmandoBorrar = false; return inicio(); }
});
$app.addEventListener('input', e => { if (e.target.id === 'buscarHoja') { HV.q = e.target.value; pintarListaHoja(); } });
document.addEventListener('keydown', e => {
  if (!J || document.querySelector('.velo')) return;
  if (J.modo === 'desliza' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); responderDesliza(e.key === 'ArrowRight'); }
});
const regHash = location.hash.slice(1);
if (DATOS[regHash]) { PREFS.region = regHash; guardarPrefs(); }
usarRegion(PREFS.region);
initAmpliarIA();
initDeslizarAtras();
const m = location.hash.match(/^#reto-(\d{4})$/);
if (m) pintarDuelo(m[1]); else inicio();
// Instalable (entrena.webmanifest): el mismo service worker que la app, que también la deja sin conexión
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
comprobarVersion();