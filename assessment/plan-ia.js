// ============================================================
// PhysiQ-Assessment · plan-ia.js
// «✨ Detallar con IA» de la fase 6 — solo standalone (fuera del hub)
// ============================================================
//
// Tarjeta al final de la fase 6 (#planIA): detalla con IA el plan que la fase
// ya construye (Fase L, L4; decisiones 106–115 de docs/plan-tratamiento.md).
// plan.js la carga con import() solo fuera del hub: dentro ni se descarga.
// Misma licencia (lib/licencia-ia.js), Turnstile (lib/turnstile.js), worker,
// streaming y errores legibles que «🎙 Informe con IA» (informe-ia.js). Las
// piezas puras están en lib/plan-ia.js (prompt, vista, textos) y
// lib/revision-plan.js (revisión automática).
//
// Nunca cambia el esqueleto (nivel, bloques, minutos, avisos, bloqueos) y
// nunca va al payload, a 📋 Notas, al 📄 Informe ni al .json exportado.

import { state } from './state.js';
import { saveSession, showConfirmBanner, showToast, buildPhysiQPayload, nombreRegion, compartirTexto, cerrarMenuCompartir } from './app.js';
import { planActual } from './plan.js';
import { construirAmpliado, transcripcionInforme } from './informe-ia.js';
import { REGIONES_PLAN } from './data/plan-tratamiento.js';
import {
  textoPlanSesion, textoPlanMes, textoDomiciliario, cuandoParar, nivelEfectivo, elegible, sintomasIndependientes, nombreSintoma,
} from './lib/plan-tratamiento.js';
import { promptPlan, huellaPlan, planTruncado, planIAHtml, textoPlanIA, textoCasaIA, MAX_TOKENS_PLAN, ETIQUETA_SUGERENCIA } from './lib/plan-ia.js';
import { revisarPlan, comprobacionesPlan, clavePuntoPlan, claveComprobacionPlan, resumenRevisadosPlan } from './lib/revision-plan.js';
import { ORCHESTRATOR_URL, parseSSEBuffer, parseSSEBlock, errorLegible, errorConexion } from './lib/informe-narrativo.js';
import { estadoLicencia, onLicencia, comprobarLicencia, marcarSinLicencia, claveGuardada, detalleLicencia } from './lib/licencia-ia.js';
import { crearTurnstile } from './lib/turnstile.js';
import { VERSION_SHA } from './lib/version.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = id => document.getElementById(id);

let _root = null;
let _gen = null;            // { texto, ctrl, oculto, cancelado, pt }
let _error = null;
let _resAbierto = false;
let _revAbierta = null;
let _revPuntos = [];
let _revComprob = [];
let _cerrarDlgCancelar = null;
const _turnstile = crearTurnstile({ caja: () => $('piaTurnstile'), alCambiar: () => pintarBoton() });

// ── Lo que entra en el prompt y en la revisión ───────────────────────────────
// null cuando no hay plan que detallar: sin región con plan, plan bloqueado
// (urgencia o derivación) o sin hipótesis elegida (decisión 106).
function contexto() {
  if (!REGIONES_PLAN.includes(state.region)) return null;
  const { hs, e, plan } = planActual();
  if (plan.bloqueado || !plan.hipotesis.length) return null;
  const pt = state.planTratamiento;
  const nivel = nivelEfectivo(plan.niveles, pt.nivel);
  const elegidas = new Set(plan.hipotesis.map(h => h.id));
  const ec = plan.escalones[nivel];
  const datos = buildPhysiQPayload();
  const ampliado = construirAmpliado();
  const transcripcion = transcripcionInforme();
  const casaOpc = { ejercicios: pt.notas.domiciliario, parar: pt.notas.parar, planNotes: state.planNotes, frecuencia: pt.frecuencia };
  const entrada = {
    datos, ampliado, nombreRegion, nivel,
    escalon: { n: plan.niveles[nivel], nombre: ec.nombre, modo: ec.modo, texto: ec.texto },
    frecuencia: { clave: pt.frecuencia, nombre: plan.mes[pt.frecuencia].nombre },
    sinC: !plan.niveles.C,
    primera: plan.primera,
    elegidas: plan.hipotesis.map(h => h.name),
    noElegidas: hs.filter(h => !elegidas.has(h.id) && elegible(h).ok && !h.posq).map(h => h.name),
    derivar: hs.filter(h => h.derivar && !h.tratada).map(h => h.name),
    independientes: sintomasIndependientes(e.secundarios).map(nombreSintoma),
    alarmas: plan.alarmasCasa,
    parar: cuandoParar(pt.notas, state.planNotes),
    sesion: textoPlanSesion(plan, e, nivel),
    mes: textoPlanMes(plan, e, pt.frecuencia),
    casa: textoDomiciliario(plan, e, casaOpc),
    transcripcion,
  };
  const elecciones = {
    h: pt.hipotesis, n: nivel, f: pt.frecuencia, s: pt.sesion, g: plan.gravedad, i: plan.irritabilidad,
    du: pt.duraciones, casa: pt.notas.domiciliario || '', parar: pt.notas.parar || '',
  };
  return {
    e, plan, entrada,
    huella: huellaPlan({ datos, ampliado, elecciones, transcripcion: transcripcion?.texto || '' }),
    esqueleto: [entrada.sesion, entrada.mes, entrada.casa].join('\n'),
  };
}

// ── Montaje ──────────────────────────────────────────────────────────────────
export function montarPlanIA(root) {
  if (!root) return;
  if (_root !== root || !root.firstChild) {
    const primera = !_root;
    _root = root;
    root.innerHTML = esqueleto();
    // Con un plan ya detallado, detallar otro queda plegado: es una acción de pago
    if (state.planTratamiento?.ia?.texto) $('piaGenerador').open = false;
    if (primera) onLicencia(() => { if (estadoLicencia() === 'real') _turnstile.cargar(); pintar(); });
  }
  comprobarLicencia().then(e => { if (e === 'real') _turnstile.cargar(); });
  refrescarPlanIA();
}

// plan.js la llama después de cada repintado de la fase
export function refrescarPlanIA() {
  if (!_root) return;
  let ctx = null;
  try { ctx = contexto(); } catch { ctx = null; }
  // Durante una generación la tarjeta sigue a la vista (para cancelarla)
  _root.hidden = !ctx && !_gen;
  if (_root.hidden) return;
  pintar(ctx);
}

function esqueleto() {
  return `
  <div class="card ia-card pia-card">
    <div class="card-title ia-titulo">✨ Detallar con IA</div>
    <p class="ia-intro">Rellena este plan con ejercicios y técnicas concretos para la sesión, la progresión del mes y un programa para casa en lenguaje del paciente. No cambia el nivel, los bloques, los minutos ni los avisos. Es una propuesta: revísala antes de usarla.</p>
    <div id="piaLicencia"></div>
    <div id="piaResultado"></div>
    <details id="piaGenerador" class="ia-generador" open>
      <summary>Detallar el plan</summary>
      <div id="piaQue" class="pia-que"></div>
      <div class="alert alert-info ia-privacidad"><span class="alert-icon">🔒</span><div>Al detallar, los datos de esta valoración, el plan y la transcripción de la consulta (si generaste el informe con IA con audio) se envían a Anthropic a través del servidor de PhysiQ. El audio no se vuelve a enviar.</div></div>
      <div id="piaTurnstile" class="ia-turnstile"></div>
      <div id="piaTurnstileMsg"></div>
      <div id="piaError"></div>
      <button class="btn btn-primary ia-btn-generar" id="piaGenerar" onclick="piaGenerar()" disabled>Detallar con IA</button>
    </details>
    <div id="piaProgreso"></div>
  </div>`;
}

function pintar(ctx) {
  if (!_root || !$('piaLicencia')) return;
  if (ctx === undefined) { try { ctx = contexto(); } catch { ctx = null; } }
  pintarLicencia();
  pintarResultado(ctx);
  pintarGenerador(ctx);
  pintarProgreso();
}

// La clave se introduce en «🎙 Informe con IA» (fase 5): es la misma licencia.
function pintarLicencia() {
  const el = $('piaLicencia');
  const lic = estadoLicencia();
  if (lic === 'real') { el.innerHTML = ''; return; }
  if (lic === 'comprobando') { el.innerHTML = '<div class="ia-estado">Comprobando la licencia…</div>'; return; }
  if (lic === 'error-red') {
    el.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido comprobar la licencia.
      ${detalleLicencia() ? `<div class="ia-licencia-motivo">${esc(detalleLicencia())}</div>` : ''}
      <div class="ia-acciones"><button class="phase5-copy-btn" onclick="piaReintentarLicencia()">Reintentar</button></div></div></div>`;
    return;
  }
  if (lic === 'desactivado') {
    el.innerHTML = '<div class="alert alert-warning"><span class="alert-icon">⏸</span><div>La generación con IA está desactivada temporalmente en el servidor de PhysiQ.</div></div>';
    return;
  }
  el.innerHTML = '<div class="alert alert-info ia-licencia"><span class="alert-icon">🔑</span><div><strong>Disponible con licencia PhysiQ.</strong> Introduce la clave en «🎙 Informe con IA», al final de la fase 5: vale para las dos.</div></div>';
}
function piaReintentarLicencia() { comprobarLicencia(true); }

// ── Generador ────────────────────────────────────────────────────────────────
function pintarGenerador(ctx) {
  const det = $('piaGenerador');
  if (!det) return;
  det.hidden = estadoLicencia() !== 'real' || !!_gen || !ctx;
  if (det.hidden) return;
  const hay = !!state.planTratamiento?.ia?.texto;
  det.classList.toggle('con-resultado', hay);
  det.querySelector('summary').textContent = hay ? 'Detallar de nuevo' : 'Detallar el plan';
  if (!hay) det.open = true;
  const en = ctx.entrada;
  const t = en.transcripcion;
  $('piaQue').innerHTML = `<div class="pia-que-linea">Se detallará: <strong>Nivel ${esc(en.nivel)} · ${esc(en.escalon.nombre)}</strong> · ${esc(en.frecuencia.nombre)} · ${esc(en.elegidas.join(' + '))}</div>
    <div class="pia-que-linea">${t
      ? `Con la ${t.dictado ? 'transcripción del dictado' : 'transcripción de la consulta'} del informe con IA, solo para preferencias y contexto.${t.desactualizada ? ' <span class="pia-aviso-t">La valoración cambió después de generar ese informe: si algo choca, mandan los datos.</span>' : ''}`
      : 'Sin transcripción: para usar lo hablado en la consulta, genera antes el informe con IA con audio en la fase 5.'}</div>`;
  pintarBoton();
  pintarError();
}

function motivoBloqueo() {
  if (estadoLicencia() !== 'real') return 'licencia';
  if (_gen) return 'generando';
  if (!_turnstile.token()) return _turnstile.fallo() ? 'turnstile' : 'Completa la verificación de seguridad.';
  return '';
}

function pintarBoton() {
  const btn = $('piaGenerar');
  if (!btn) return;
  const motivo = motivoBloqueo();
  btn.disabled = !!motivo;
  btn.title = motivo && motivo.length > 12 ? motivo : '';
  btn.textContent = state.planTratamiento?.ia?.texto ? 'Detallar de nuevo' : 'Detallar con IA';
  const msg = $('piaTurnstileMsg');
  if (msg) msg.innerHTML = motivo === 'turnstile'
    ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido cargar la verificación de seguridad. Desactiva el bloqueador de anuncios para esta página o revisa la conexión.</div></div>'
    : '';
}

function pintarError() {
  const el = $('piaError');
  if (!el) return;
  el.innerHTML = _error ? `<div class="alert alert-warning ia-error"><span class="alert-icon">⚠️</span><div>
    <strong>No se ha podido detallar el plan.</strong> ${esc(_error.texto)}
    ${_error.original ? `<div class="ia-error-original">${esc(_error.original)}</div>` : ''}</div></div>` : '';
}

// ── Resultado ────────────────────────────────────────────────────────────────
const contarPalabras = t => (String(t || '').replace(/[#*-]/g, ' ').match(/\S+/g) || []).length;

function pintarResultado(ctx) {
  const el = $('piaResultado');
  const ia = state.planTratamiento?.ia;
  if (!ia?.texto || _gen) { el.innerHTML = ''; _revPuntos = []; _revComprob = []; return; }
  const fecha = ia.fecha ? new Date(ia.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
  const cambio = ctx && ia.huella && ia.huella !== ctx.huella;
  el.innerHTML = `
    ${cambio ? '<div class="alert alert-warning"><span class="alert-icon">✎</span><div>El plan o la valoración han cambiado desde que se detalló (nivel, frecuencia, hipótesis, notas para casa…). Detállalo de nuevo si quieres que lo refleje.</div></div>' : ''}
    <div id="piaRevision"></div>
    <div id="piaComprobar"></div>
    ${planTruncado(ia.texto) ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El plan parece incompleto: falta alguna sección o se cortó. Puedes detallarlo de nuevo.</div></div>' : ''}
    <details class="ia-resultado-det" id="piaResultadoDet"${_resAbierto ? ' open' : ''}>
      <summary>
        <span class="ia-resultado-titulo">✨ Plan detallado</span>
        <span class="ia-meta">${esc(fecha)} · Nivel ${esc(ia.nivel || '')} · ${esc(ia.frecuenciaNombre || '')} · ${contarPalabras(ia.texto)} palabras</span>
      </summary>
      <div class="pia-leyenda"><span class="pia-sug-et">${ETIQUETA_SUGERENCIA}</span> marca lo que propone la IA (ejercicios, series, repeticiones, tiempos) sin una fuente detrás.</div>
      <div class="ia-informe pia-plan">${planIAHtml(ia.texto)}</div>
    </details>
    <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="piaDescartar()">Descartar</button></div>
    <div class="ia-rev-nota pia-compartir-nota">Para compartirlo: «📤 Compartir» de abajo → «Plan detallado (IA)» o «Programa para casa (IA)»; este último, con todos los puntos revisados.</div>
    <div class="ia-rev-paquete"><button type="button" class="ia-rev-paquete-btn" onclick="piaPaqueteRevision()"
      title="Descarga un .zip con el plan detallado, el programa para casa, los puntos a revisar, la valoración y el prompt, para revisar el plan. Contiene datos clínicos y el nombre del paciente.">⬇ Paquete de revisión</button></div>`;
  $('piaResultadoDet').addEventListener('toggle', ev => { _resAbierto = ev.target.open; });
  pintarRevision(ctx);
}

function puntosDe(ctx, ia) {
  if (!ctx || !ia?.texto) return { puntos: [], comprobaciones: [] };
  let puntos = [], comprobaciones = [];
  const en = ctx.entrada;
  try {
    puntos = revisarPlan(ia.texto, {
      esqueleto: ctx.esqueleto, escalon: en.escalon.n, alarmas: en.alarmas,
      noElegidas: en.noElegidas, derivar: en.derivar, independientes: en.independientes,
    });
  } catch { /* una regla rota nunca tumba la tarjeta */ }
  try { comprobaciones = comprobacionesPlan({ posq: !!ctx.plan.mes.posq, transcripcion: !!ia.conTranscripcion }); } catch { /* ídem */ }
  return { puntos, comprobaciones };
}

const _revisados = () => new Set(state.planTratamiento?.ia?.revisados || []);
const casilla = (tipo, i, hecho) => `<input type="checkbox" class="ia-rev-check"${hecho ? ' checked' : ''} onchange="piaMarcarRevisado(this.checked,'${tipo}',${i})" aria-label="Revisado">`;

function pintarRevision(ctx) {
  const ia = state.planTratamiento?.ia;
  const { puntos, comprobaciones } = puntosDe(ctx, ia);
  _revPuntos = puntos; _revComprob = comprobaciones;
  const hechos = _revisados();
  const rev = $('piaRevision');
  if (rev) {
    if (!puntos.length) {
      rev.innerHTML = '<div class="ia-revision ia-revision-ok">✓ Sin incidencias en las comprobaciones automáticas. Revisa el plan antes de usarlo.</div>';
    } else {
      const abierta = _revAbierta ?? resumenRevisadosPlan(puntos, [], ia.revisados).altosPendientes > 0;
      rev.innerHTML = `<details class="ia-revision"${abierta ? ' open' : ''}><summary></summary>
        <ul>${puntos.map((p, i) => {
          const hecho = hechos.has(clavePuntoPlan(p));
          return `<li class="ia-rev-${p.nivel}${hecho ? ' ia-rev-hecho' : ''}"><label class="ia-rev-item">${casilla('p', i, hecho)}<span>${esc(p.mensaje)}${p.cita ? `<span class="ia-rev-cita">«${esc(p.cita)}»</span>` : ''}</span></label></li>`;
        }).join('')}</ul>
        <div class="ia-rev-nota">Comprobaciones automáticas del plan frente al esquema de PhysiQ: pueden señalar algo correcto. No cambian el plan. Marca cada una como revisada cuando la hayas mirado.</div>
      </details>`;
      rev.querySelector('details').addEventListener('toggle', ev => { _revAbierta = ev.target.open; });
    }
  }
  const com = $('piaComprobar');
  if (com) com.innerHTML = `<div class="ia-comprobar"><div class="ia-comprobar-titulo">☑ Antes de usarlo o compartirlo, comprueba: <span class="ia-comprobar-cuenta"></span></div>
      <ul>${comprobaciones.map((t, i) => {
        const hecho = hechos.has(claveComprobacionPlan(t));
        return `<li class="${hecho ? 'ia-rev-hecho' : ''}"><label class="ia-rev-item">${casilla('c', i, hecho)}<span>${esc(t)}</span></label></li>`;
      }).join('')}</ul></div>`;
  cabeceras();
}

function cabeceras() {
  const ia = state.planTratamiento?.ia;
  const r = resumenRevisadosPlan(_revPuntos, _revComprob, ia?.revisados);
  const det = $('piaRevision')?.querySelector('details.ia-revision');
  if (det) {
    const n = r.puntos;
    det.querySelector('summary').textContent = !r.puntosPendientes
      ? `✓ ${n} ${n === 1 ? 'punto revisado' : 'puntos revisados'}`
      : r.puntosPendientes === n ? `⚠ ${n} ${n === 1 ? 'punto' : 'puntos'} a revisar en el plan` : `⚠ ${r.puntosPendientes} de ${n} sin revisar`;
    det.classList.toggle('ia-revision-alta', r.altosPendientes > 0);
    det.classList.toggle('ia-revision-hecha', !r.puntosPendientes);
  }
  const box = $('piaComprobar')?.querySelector('.ia-comprobar');
  if (box) {
    box.querySelector('.ia-comprobar-cuenta').textContent = r.comprobacionesPendientes ? `${r.comprobaciones - r.comprobacionesPendientes} de ${r.comprobaciones}` : '✓ todo comprobado';
    box.classList.toggle('ia-comprobar-hecha', !r.comprobacionesPendientes);
  }
}

function piaMarcarRevisado(marcado, tipo, i) {
  const ia = state.planTratamiento?.ia;
  const clave = tipo === 'p' ? (_revPuntos[i] && clavePuntoPlan(_revPuntos[i])) : (_revComprob[i] != null && claveComprobacionPlan(_revComprob[i]));
  if (!ia || !clave) return;
  const hechos = _revisados();
  if (marcado) hechos.add(clave); else hechos.delete(clave);
  ia.revisados = [...hechos];
  saveSession();
  $(tipo === 'p' ? 'piaRevision' : 'piaComprobar')?.querySelectorAll('li')[i]?.classList.toggle('ia-rev-hecho', marcado);
  cabeceras();
}

// «⬇ Paquete de revisión»: como el del informe con IA (lib/paquete-revision.js
// y lib/zip.js, cargados al usarlo): el plan tal como se generó, el programa
// para casa como lo recibe el paciente, los puntos, la valoración y el prompt.
async function piaPaqueteRevision() {
  const ia = state.planTratamiento?.ia;
  if (!ia?.texto) return;
  saveSession();
  try {
    const [{ crearZip }, { ficherosPaquetePlan }] = await Promise.all([import('./lib/zip.js'), import('./lib/paquete-revision.js')]);
    let ctx = null;
    try { ctx = contexto(); } catch { /* sin contexto: el resto del paquete sigue valiendo */ }
    const { puntos, comprobaciones } = puntosDe(ctx, ia);
    const { e, plan } = planActual();
    const ahora = new Date();
    const { nombre, ficheros } = ficherosPaquetePlan({
      ia, state, puntos, comprobaciones,
      casa: plan.bloqueado ? '' : textoCasaIA(ia.texto, { paciente: e.paciente, fecha: e.fecha, alarmas: plan.alarmasCasa }),
      versionActual: VERSION_SHA, cambiado: !!(ctx && ia.huella && ia.huella !== ctx.huella), ahora,
    });
    const archivo = new File([crearZip(ficheros, ahora)], nombre, { type: 'application/zip' });
    // En el móvil, la hoja de compartir permite mandarlo o guardarlo en Archivos
    if (window.matchMedia?.('(pointer: coarse)').matches && navigator.canShare?.({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], title: nombre }); return; }
      catch (err) { if (err?.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(archivo);
    const a = Object.assign(document.createElement('a'), { href: url, download: nombre });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`✓ Paquete de revisión descargado: ${nombre}`, 'success');
  } catch {
    showToast('No se ha podido preparar el paquete de revisión.', 'warning');
  }
}

function piaDescartar() {
  showConfirmBanner('Descartar plan detallado', 'Se borrará el plan detallado con IA. El plan de la fase 6 no cambia.', 'Descartar', () => {
    if (state.planTratamiento) state.planTratamiento.ia = null;
    saveSession();
    refrescarPlanIA();
  });
}

// ── Generación ───────────────────────────────────────────────────────────────
function pintarProgreso() {
  const el = $('piaProgreso');
  if (!el) return;
  if (!_gen) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="ia-estado ia-progreso"><span class="ia-spinner"></span><span id="piaProgresoTexto">${textoProgreso()}</span></div>
    <div class="ia-nota-pantalla">Mantén la pantalla encendida y la app abierta hasta que termine: si el móvil se bloquea o cambias de app, la generación se corta.</div>
    <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="piaCancelar()">Cancelar</button></div>`;
}

function textoProgreso() {
  const n = contarPalabras(_gen?.texto);
  if (!n) return 'Detallando el plan…';
  const s = _gen.texto.match(/^##\s+(?!#)(.+)$/gm);
  const actual = s ? s[s.length - 1].replace(/^##\s+/, '').trim() : '';
  return `Detallando… · ${n} palabras${actual ? ` · ${esc(actual.charAt(0) + actual.slice(1).toLowerCase())}` : ''}`;
}

let _progresoPendiente = false;
function refrescarProgreso() {
  if (_progresoPendiente) return;
  _progresoPendiente = true;
  requestAnimationFrame(() => {
    _progresoPendiente = false;
    const t = $('piaProgresoTexto');
    if (t && _gen) t.innerHTML = textoProgreso();
  });
}

let _wakeLock = null;
function pedirWakeLock() {
  navigator.wakeLock?.request('screen').then(l => { if (_gen) _wakeLock = l; else l.release().catch(() => {}); }).catch(() => {});
}
function soltarWakeLock() { _wakeLock?.release?.().catch(() => {}); _wakeLock = null; }
document.addEventListener('visibilitychange', () => {
  if (!_gen) return;
  if (document.visibilityState === 'hidden') _gen.oculto = true;
  else pedirWakeLock();
});

class ModoDemo extends Error {}

async function piaGenerar() {
  if (motivoBloqueo()) { pintarBoton(); return; }
  saveSession();   // vuelca lo último escrito (notas del plan, etc.)
  let ctx;
  try { ctx = contexto(); } catch { ctx = null; }
  if (!ctx) { refrescarPlanIA(); return; }
  const prompt = promptPlan(ctx.entrada);
  const fd = new FormData();
  fd.append('prompt', prompt);
  fd.append('maxTokens', String(MAX_TOKENS_PLAN));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 300000);
  _error = null;
  // pt: si la valoración se reinicia mientras se genera, el resultado se tira
  _gen = { texto: '', ctrl, oculto: false, pt: state.planTratamiento };
  pedirWakeLock();
  pintar(ctx);

  const token = _turnstile.consumir();
  const clave = claveGuardada();
  try {
    const res = await fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: { 'cf-turnstile-response': token || '', ...(clave ? { 'X-License-Key': clave } : {}) },
      body: fd,
      signal: ctrl.signal,
    });
    if (res.headers.get('X-PhysiQ-Mode') === 'demo' || res.status === 401) throw new ModoDemo();
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error(e.error?.message || 'Has alcanzado el límite diario de generaciones con IA. Inténtalo más tarde.');
      if (res.status === 403) throw new Error('La verificación de seguridad ha fallado. Vuelve a completarla y detalla de nuevo.');
      throw new Error(e.error?.message || `Error del servidor (${res.status})`);
    }
    await leerStream(res);
    if (!_gen.texto.trim()) throw new Error('El servidor no ha devuelto ningún plan.');
    if (state.planTratamiento !== _gen.pt || !state.planTratamiento) return;   // reiniciada mientras tanto

    const en = ctx.entrada;
    state.planTratamiento.ia = {
      texto: _gen.texto,
      fecha: new Date().toISOString(),
      nivel: en.nivel,
      escalon: en.escalon.nombre,
      frecuencia: en.frecuencia.clave,
      frecuenciaNombre: en.frecuencia.nombre,
      conTranscripcion: !!en.transcripcion,
      prompt,                  // el exacto que se envió, para revisarlo
      version: VERSION_SHA,
      huella: ctx.huella,
      revisados: [],
    };
    saveSession();
    const det = $('piaGenerador');
    if (det) det.open = false;
    _resAbierto = false;
    _revAbierta = null;
    showToast('✓ Plan detallado con IA', 'success');
  } catch (err) {
    if (err instanceof ModoDemo) {
      marcarSinLicencia();
      showToast('Este navegador no tiene una licencia PhysiQ válida.', 'warning');
    } else if (err.name === 'AbortError') {
      if (!_gen?.cancelado) showToast('Tiempo de espera agotado. Inténtalo de nuevo.', 'warning');
    } else {
      _error = errorConexion(err, { seOculto: !!_gen?.oculto || document.visibilityState === 'hidden' }) || errorLegible(err.message);
      showToast('No se ha podido detallar el plan.', 'warning');
    }
  } finally {
    clearTimeout(timer);
    soltarWakeLock();
    _cerrarDlgCancelar?.();
    _cerrarDlgCancelar = null;
    ctrl.abort();
    _gen = null;
    refrescarPlanIA();
  }
}

async function leerStream(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  // Sin audio, el evento `transcript` solo trae «(No disponible…)»: se ignora
  const procesar = ev => {
    if (ev.type === 'report_chunk') { _gen.texto += ev.data.text ?? ''; refrescarProgreso(); }
    else if (ev.type === 'error') throw new Error(ev.data.message || 'Error desconocido');
    else if (ev.type === 'done') return true;
    return false;
  };
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      const ev = buf.trim() ? parseSSEBlock(buf) : null;
      if (ev) procesar(ev);
      return;
    }
    buf += decoder.decode(value, { stream: true });
    const { eventos, resto } = parseSSEBuffer(buf);
    buf = resto;
    for (const ev of eventos) if (procesar(ev)) { reader.cancel().catch(() => {}); return; }
  }
}

function piaCancelar() {
  if (!_gen) return;
  _cerrarDlgCancelar = showConfirmBanner('Cancelar la generación',
    'Se perderá lo que lleva escrito el plan detallado. Podrás volver a generarlo.',
    '<span class="btn-text-full">Sí, cancelar</span><span class="btn-text-short">Cancelar</span>',
    () => { _cerrarDlgCancelar = null; if (_gen) { _gen.cancelado = true; _gen.ctrl.abort(); } }, { cancelLabel: 'Seguir' });
}

// ── Compartir (menú «📤 Compartir» de la fase 6, plan.js) ────────────────────
// Puntos y comprobaciones sin marcar del plan detallado actual.
export function estadoRevisionPlanIA() {
  const ia = state.planTratamiento?.ia;
  if (!ia?.texto) return null;
  let ctx = null;
  try { ctx = contexto(); } catch { /* sin contexto */ }
  const { puntos, comprobaciones } = puntosDe(ctx, ia);
  return resumenRevisadosPlan(puntos, comprobaciones, ia.revisados);
}

function datosCompartir() {
  const { e, plan } = planActual();
  return { e, plan, ia: state.planTratamiento?.ia };
}

function compartirPlanIA() {
  cerrarMenuCompartir();
  const { e, ia } = datosCompartir();
  if (!ia?.texto) return;
  compartirTexto(textoPlanIA(ia.texto, {
    paciente: e.paciente, regionTexto: e.regionTexto, fecha: e.fecha, nivel: ia.nivel, escalon: ia.escalon, frecuencia: ia.frecuenciaNombre,
  }), { titulo: 'Plan de tratamiento detallado — PhysiQ-Assessment', copiado: '✓ Plan detallado copiado al portapapeles' });
}

// Para el paciente: solo con todos los puntos y comprobaciones revisados
// (decisión 8); si falta alguno, se abre la tarjeta en vez de compartir.
function compartirCasaIA() {
  cerrarMenuCompartir();
  const { e, plan, ia } = datosCompartir();
  if (!ia?.texto || plan.bloqueado) return;
  const r = estadoRevisionPlanIA();
  if (r?.pendientes) {
    showToast(r.pendientes === 1
      ? 'Antes de dárselo al paciente, marca como revisado el punto que falta del plan detallado.'
      : `Antes de dárselo al paciente, marca como revisados los ${r.pendientes} puntos que faltan del plan detallado.`, 'warning');
    _revAbierta = true;
    refrescarPlanIA();
    $('piaRevision')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  compartirTexto(textoCasaIA(ia.texto, { paciente: e.paciente, fecha: e.fecha, alarmas: plan.alarmasCasa }),
    { titulo: 'Programa para casa', copiado: '✓ Programa para casa (IA) copiado al portapapeles' });
}

// Para tests/unit/plan-ia.mjs
export { contexto as contextoPlanIA };

// Exposed for inline onclick/onchange attributes in the HTML strings above and
// in the share menu (app.js).
Object.assign(window, { piaGenerar, piaCancelar, piaDescartar, piaPaqueteRevision, piaMarcarRevisado, piaReintentarLicencia, compartirPlanIA, compartirCasaIA });
