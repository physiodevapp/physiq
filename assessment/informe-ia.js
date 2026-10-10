// ============================================================
// PhysiQ-Assessment · informe-ia.js
// Informe narrativo con IA — solo standalone (fuera del hub)
// ============================================================
//
// Tarjeta al final de la fase 5 (#informeIA): con el audio de la sesión
// (grabado desde la cabecera, grabadora.js, o adjuntado aquí) y los datos de
// la valoración, genera con el orquestador de physiq-report (Whisper + Claude)
// un informe narrativo CIF como el de PhysiQ-Report, y lo comparte o copia.
// app.js lo carga con import() dinámico solo cuando la app NO está en el hub:
// dentro del hub ni se descarga. Las piezas puras (prompt, SSE, markdown)
// están en lib/informe-narrativo.js; la licencia, en lib/licencia-ia.js.
//
// El modo lo decide el worker (/validate), nunca este cliente: sin licencia
// válida la tarjeta queda desactivada, y si una respuesta llega en modo demo
// se descarta — el informe de ejemplo del worker es de un paciente ficticio y
// no puede mezclarse con una valoración real.

import { ramaPauta } from './lib/pauta.js';
import { state } from './state.js';
import { CIF_TREES, HYPOTHESES, SYSTEMIC_SCREENING, DOSIS_DERIVAR } from './data.js';
import { saveSession, showConfirmBanner, buildPhysiQPayload, nombreRegion, showToast, resumenFormularioIA, compartirTexto, registrarValoracionCompleta } from './app.js';
import { esTratada, hipotesis, hipotesisActivas } from './phase4b.js';
import { esPosquirurgico, cirugiaPayload, pautaHipPosq } from './lib/posquirurgico.js';
import { revisarInforme, comprobacionesManuales, clavePunto, claveComprobacion, resumenRevisados } from './lib/revision-informe.js';
import { VERSION_SHA } from './lib/version.js';
import {
  ORCHESTRATOR_URL, TURNSTILE_SITEKEY, MAX_AUDIO_BYTES, PLANTILLAS, plantillaPorDefecto, MODOS_AUDIO,
  getWhisperPrompt, huellaPayload, parseSSEBuffer, parseSSEBlock,
  informeTruncado, markdownAHtml, textoParaCompartir, extensionAudio, errorLegible, errorConexion,
  transcripcionSinVoz, TEXTO_SIN_VOZ, textoOpcionIA,
} from './lib/informe-narrativo.js';
import { estadoLicencia, onLicencia, comprobarLicencia, probarClave, marcarSinLicencia, claveGuardada, detalleLicencia } from './lib/licencia-ia.js';
import {
  onGrabadora, audioActual, estadoGrabacion, idAudio, cerrarGrabacion, fijarArchivo, quitarAudio, fmtTiempo, fmtMB,
} from './grabadora.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = id => document.getElementById(id);

// ── Estado del módulo (no persiste: lo persistente es state.informeIA) ───────
let _root = null;
let _mostrarClave = false;
let _claveMsg = '';
let _consentido = false;
let _audioConsentido = null;     // el consentimiento vale para un audio concreto (idAudio())
let _cerrando = false;           // «Generar» está cerrando la grabación en curso
let _gen = null;                 // generación en curso: { texto, transcripcion, fase, ctrl }
let _plantilla = null;           // 'narrativo' | 'breve' elegida a mano; null = la del tipo de consulta
let _modoAudio = 'dialogo';      // 'dialogo' | 'dictado': quién habla en el audio; dura lo que la página
let _resultadoAbierto = false;   // el informe generado se muestra plegado hasta que se abre
let _vivoAbierto = false;        // «Ver mientras se escribe», mientras dura una generación
let _error = null;               // último fallo al generar: errorLegible() — se muestra hasta el siguiente intento
let _turnstileToken = null;
let _turnstileWidget = null;
let _turnstileFallo = false;
let _turnstileCargando = false;

// ── Montaje ──────────────────────────────────────────────────────────────────
// Se llama en cada buildResults(): la primera vez pinta la tarjeta y se suscribe
// a la licencia y a la grabadora; las siguientes solo refrescan.
export function montarInformeIA(root) {
  if (!root) return;
  if (_root !== root || !root.firstChild) {
    const primera = !_root;
    _root = root;
    root.innerHTML = esqueleto();
    if (state.informeIA?.texto) $('iaGenerador').open = false;
    if (primera) {
      $('phase5')?.addEventListener('input', _refrescarHuellaDiferido);
      onLicencia(() => { if (estadoLicencia() === 'real') cargarTurnstile(); pintar(); });
      onGrabadora(tipo => {
        if (tipo === 'tick') { actualizarCronoTarjeta(); return; }
        if (!_gen) pintarGenerador();
      });
    }
  }
  comprobarLicencia().then(e => { if (e === 'real') cargarTurnstile(); });
  pintar();
}

function esqueleto() {
  return `
  <div class="card ia-card">
    <div class="card-title ia-titulo">🎙 Informe narrativo <span class="ia-etiqueta">IA</span></div>
    <p class="ia-intro">Informe clínico narrativo (modelo CIF), como el de PhysiQ-Report, redactado a partir de los datos de esta valoración y, si lo añades, del audio de la sesión.</p>
    <div id="iaLicencia"></div>
    <div id="iaResultado"></div>
    <details id="iaGenerador" class="ia-generador" open>
      <summary id="iaGenSummary">Generar un informe nuevo</summary>
      <div id="iaPlantilla" class="ia-plantilla"></div>
      <div id="iaAudio"></div>
      <div id="iaModoAudio" class="ia-plantilla"></div>
      <div id="iaConsent"></div>
      <div class="alert alert-info ia-privacidad"><span class="alert-icon">🔒</span><div>Al generar, los datos de esta valoración y el audio (si lo hay) se envían a OpenAI (transcripción) y a Anthropic (redacción) a través del servidor de PhysiQ. Revisa el informe antes de compartirlo.</div></div>
      <div id="iaTurnstile" class="ia-turnstile"></div>
      <div id="iaTurnstileMsg"></div>
      <div id="iaError"></div>
      <button class="btn btn-primary ia-btn-generar" id="iaGenerar" onclick="iaGenerar()" disabled>Generar informe</button>
    </details>
    <div id="iaProgreso"></div>
  </div>`;
}

function pintar() {
  if (!_root || !$('iaLicencia')) return;
  pintarLicencia();
  pintarResultado();
  pintarGenerador();
  pintarProgreso();
}

// El fallo se queda a la vista (un toast desaparece en segundos) hasta el
// siguiente intento, con el texto original de la API debajo para diagnosticar.
function pintarError() {
  const el = $('iaError');
  if (!el) return;
  if (!_error) { el.innerHTML = ''; return; }
  const sinAudio = _error.sinAudio && audioActual()
    ? '<div class="ia-error-salida">Puedes quitar el audio y generar el informe solo con los datos de la valoración; el audio se conserva para reintentarlo después.</div>'
    : '';
  el.innerHTML = `<div class="alert alert-warning ia-error"><span class="alert-icon">⚠️</span><div>
    <strong>No se ha podido generar el informe.</strong> ${esc(_error.texto)}
    ${sinAudio}
    ${_error.original ? `<div class="ia-error-original">${esc(_error.original)}</div>` : ''}
  </div></div>`;
}

// ── Licencia ─────────────────────────────────────────────────────────────────
function pintarLicencia() {
  const el = $('iaLicencia');
  const lic = estadoLicencia();
  if (lic === 'real') { el.innerHTML = ''; return; }
  if (lic === 'comprobando') {
    el.innerHTML = '<div class="ia-estado">Comprobando la licencia…</div>';
    return;
  }
  if (lic === 'error-red') {
    el.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido comprobar la licencia.
      ${detalleLicencia() ? `<div class="ia-licencia-motivo">${esc(detalleLicencia())}</div>` : ''}
      <div class="ia-acciones"><button class="phase5-copy-btn" onclick="iaReintentarLicencia()">Reintentar</button></div></div></div>`;
    return;
  }
  if (lic === 'desactivado') {
    el.innerHTML = '<div class="alert alert-warning"><span class="alert-icon">⏸</span><div>La generación de informes está desactivada temporalmente en el servidor de PhysiQ.</div></div>';
    return;
  }
  el.innerHTML = `<div class="alert alert-info ia-licencia"><span class="alert-icon">🔑</span><div>
    <strong>Disponible con licencia PhysiQ.</strong>
    ${_mostrarClave ? `
      <div class="ia-clave">
        <input class="form-input" id="iaClaveInput" type="password" autocomplete="off" placeholder="Clave de licencia" onkeydown="if(event.key==='Enter')iaGuardarClave()">
        <button class="phase5-copy-btn" id="iaClaveBtn" onclick="iaGuardarClave()">Guardar</button>
      </div>
      ${_claveMsg ? `<div class="ia-clave-msg">${esc(_claveMsg)}</div>` : ''}`
    : `<div class="ia-acciones"><button class="phase5-copy-btn" onclick="iaMostrarClave()">Introducir clave</button></div>`}
  </div></div>`;
  if (_mostrarClave) setTimeout(() => $('iaClaveInput')?.focus(), 0);
}

function iaMostrarClave() { _mostrarClave = true; _claveMsg = ''; pintarLicencia(); }

async function iaGuardarClave() {
  const clave = ($('iaClaveInput')?.value || '').trim();
  if (!clave) return;
  const btn = $('iaClaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Comprobando…'; }
  try {
    const modo = await probarClave(clave);   // solo la guarda si el worker la da por buena
    if (modo === 'real') {
      _mostrarClave = false; _claveMsg = '';
      showToast('✓ Licencia guardada', 'success');
      return;   // onLicencia repinta y carga Turnstile
    }
    _claveMsg = modo === 'desactivado' ? 'El servidor tiene la generación desactivada; inténtalo más tarde.' : 'Clave no válida.';
  } catch (e) {
    _claveMsg = `No se ha podido comprobar la clave. ${e?.motivo || ''}`.trim();
  }
  pintarLicencia();
}

function iaReintentarLicencia() { comprobarLicencia(true); }

// ── Turnstile ────────────────────────────────────────────────────────────────
// El worker lo exige en modo real. Se carga solo aquí, y solo con licencia.
function cargarTurnstile() {
  if (_turnstileWidget != null || _turnstileCargando) { pintarGenerador(); return; }
  _turnstileCargando = true;
  window.__iaTurnstileOnload = renderTurnstile;
  if (window.turnstile) { renderTurnstile(); return; }
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__iaTurnstileOnload';
  s.async = true;
  s.onerror = () => { _turnstileFallo = true; pintarGenerador(); };
  document.head.appendChild(s);
  // Un bloqueador puede impedir que llegue a pintarse: sin este aviso solo se
  // vería un botón desactivado sin explicación.
  setTimeout(() => { if (_turnstileWidget == null) { _turnstileFallo = true; pintarGenerador(); } }, 10000);
}

function renderTurnstile() {
  const box = $('iaTurnstile');
  if (!box || !window.turnstile || _turnstileWidget != null) return;
  try {
    _turnstileWidget = window.turnstile.render(box, {
      sitekey: TURNSTILE_SITEKEY,
      appearance: 'always',
      callback: t => { _turnstileToken = t; _turnstileFallo = false; pintarGenerador(); },
      'expired-callback': () => { _turnstileToken = null; pintarGenerador(); },
      'error-callback': () => { _turnstileToken = null; pintarGenerador(); },
    });
  } catch {
    _turnstileFallo = true;
  }
  pintarGenerador();
}

function consumirToken() {
  const t = _turnstileToken;
  _turnstileToken = null;
  if (window.turnstile && _turnstileWidget != null) { try { window.turnstile.reset(_turnstileWidget); } catch {} }
  return t;
}

// ── Resultado ────────────────────────────────────────────────────────────────
// Plegado: a la vista quedan la fecha, los avisos y las acciones (compartir
// es lo habitual); el texto completo, al desplegar, sin scroll interno.
function pintarResultado() {
  const el = $('iaResultado');
  const inf = state.informeIA;
  if (!inf?.texto || _gen) { el.innerHTML = ''; return; }
  const fecha = inf.fecha ? new Date(inf.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
  const plantilla = PLANTILLAS[inf.plantilla] || PLANTILLAS.narrativo;
  el.innerHTML = `
    <div id="iaAvisoHuella"></div>
    <div id="iaRevision"></div>
    <div id="iaComprobar"></div>
    ${informeTruncado(inf.texto, inf.plantilla) ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El informe parece incompleto: la última sección no se ha generado. Puedes generarlo de nuevo.</div></div>' : ''}
    <details class="ia-resultado-det" id="iaResultadoDet"${_resultadoAbierto ? ' open' : ''}>
      <summary>
        <span class="ia-resultado-titulo">📄 ${esc(plantilla.nombre)}</span>
        <span class="ia-meta">${esc(fecha)} · ${inf.conAudio ? (inf.dictado ? 'con dictado' : 'con audio') : 'sin audio'} · ${contarPalabras(inf.texto)} palabras</span>
      </summary>
      <div class="ia-informe">${markdownAHtml(inf.texto)}</div>
      ${inf.transcripcion && inf.conAudio ? `<details class="ia-transcripcion"><summary>${inf.dictado ? 'Transcripción del dictado' : 'Transcripción del audio'}</summary><div class="ia-transcripcion-texto">${esc(inf.transcripcion)}</div></details>` : ''}
    </details>
    <div class="ia-acciones">
      <button class="phase5-copy-btn ia-btn-descartar" onclick="iaDescartarInforme()">Descartar</button>
    </div>
    ${BOTON_PAQUETE}`;
  $('iaResultadoDet').addEventListener('toggle', e => { _resultadoAbierto = e.target.open; });
  refrescarHuella();
}

// Revisión automática (lib/revision-informe.js): compara el texto con los
// datos actuales de la valoración y lista «puntos a revisar». Sin red ni IA;
// se recalcula con la huella, así que sigue los cambios de la valoración.
function puntosRevision(inf) {
  return revisarInforme(inf.texto, {
    datos: buildPhysiQPayload(), ampliado: construirAmpliado(), plantilla: inf.plantilla || 'narrativo',
    transcripcion: inf.conAudio ? inf.transcripcion : '', nombreRegion,
  });
}

// Herramienta de soporte, no parte del flujo revisar → leer → compartir: al
// final, en su propia línea y con aspecto de enlace, para que no se tome por
// otra forma de compartir con el paciente. Siempre con el texto completo.
const BOTON_PAQUETE = `<div class="ia-rev-paquete"><button type="button" class="ia-rev-paquete-btn" onclick="iaPaqueteRevision()"
    title="Descarga un .zip con el informe, la transcripción, los puntos a revisar y la valoración, para revisar el informe. Contiene datos clínicos y el nombre del paciente.">⬇ Paquete de revisión</button></div>`;

// Lo pintado ahora, para marcar «Revisado» por índice sin repintar la caja
// (que perdería si estaba abierta o cerrada)
let _revPuntos = [];
let _revAbierta = null;    // abierta/cerrada a mano; null = por defecto (abierta con un alto sin revisar)
let _revComprob = [];
const _revisados = () => new Set(state.informeIA?.revisados || []);

function casillaRevisado(tipo, i, hecho) {
  return `<input type="checkbox" class="ia-rev-check"${hecho ? ' checked' : ''} onchange="iaMarcarRevisado(this.checked,'${tipo}',${i})" aria-label="Revisado">`;
}

function pintarRevision() {
  const el = $('iaRevision');
  const inf = state.informeIA;
  if (!el || !inf?.texto) return;
  pintarComprobaciones();
  let puntos;
  try { puntos = puntosRevision(inf); }
  catch { el.innerHTML = ''; _revPuntos = []; return; }   // una regla rota nunca tumba la tarjeta
  _revPuntos = puntos;
  if (!puntos.length) {
    el.innerHTML = '<div class="ia-revision ia-revision-ok">✓ Sin incidencias en las comprobaciones automáticas. Revisa el informe antes de compartirlo.</div>';
    return;
  }
  const hechos = _revisados();
  const { altosPendientes } = resumenRevisados(puntos, [], inf.revisados);
  const abierta = _revAbierta ?? altosPendientes > 0;
  el.innerHTML = `<details class="ia-revision"${abierta ? ' open' : ''}>
      <summary></summary>
      <ul>${puntos.map((p, i) => {
        const hecho = hechos.has(clavePunto(p));
        return `<li class="ia-rev-${p.nivel}${hecho ? ' ia-rev-hecho' : ''}"><label class="ia-rev-item">${casillaRevisado('p', i, hecho)}<span>${esc(p.mensaje)}${p.cita ? `<span class="ia-rev-cita">«${esc(p.cita)}»</span>` : ''}</span></label></li>`;
      }).join('')}</ul>
      <div class="ia-rev-nota">Comprobaciones automáticas del texto frente a la valoración: pueden señalar algo correcto. No cambian el informe. Marca cada una como revisada cuando la hayas mirado.</div>
    </details>`;
  el.querySelector('details.ia-revision').addEventListener('toggle', e => { _revAbierta = e.target.open; });
  cabeceraRevision();
}

// «⚠ 3 puntos a revisar» → «⚠ 1 de 3 sin revisar» → «✓ 3 puntos revisados».
// Rojo mientras quede uno alto sin revisar; un punto marcado nunca se oculta.
function cabeceraRevision() {
  const det = $('iaRevision')?.querySelector('details.ia-revision');
  if (!det) return;
  const r = resumenRevisados(_revPuntos, [], state.informeIA?.revisados);
  const n = r.puntos;
  det.querySelector('summary').textContent = !r.puntosPendientes
    ? `✓ ${n} ${n === 1 ? 'punto revisado' : 'puntos revisados'}`
    : r.puntosPendientes === n
      ? `⚠ ${n} ${n === 1 ? 'punto' : 'puntos'} a revisar en el informe`
      : `⚠ ${r.puntosPendientes} de ${n} sin revisar`;
  det.classList.toggle('ia-revision-alta', r.altosPendientes > 0);
  det.classList.toggle('ia-revision-hecha', !r.puntosPendientes);
}

function cabeceraComprobaciones() {
  const box = $('iaComprobar')?.querySelector('.ia-comprobar');
  if (!box) return;
  const r = resumenRevisados([], _revComprob, state.informeIA?.revisados);
  box.querySelector('.ia-comprobar-cuenta').textContent = r.comprobacionesPendientes
    ? `${r.comprobaciones - r.comprobacionesPendientes} de ${r.comprobaciones}` : '✓ todo comprobado';
  box.classList.toggle('ia-comprobar-hecha', !r.comprobacionesPendientes);
}

// Marca o desmarca un punto («p») o una comprobación («c»). Se guarda con la
// sesión, dentro del informe: uno nuevo empieza sin marcas.
function iaMarcarRevisado(marcado, tipo, i) {
  const inf = state.informeIA;
  const clave = tipo === 'p' ? (_revPuntos[i] && clavePunto(_revPuntos[i])) : (_revComprob[i] != null && claveComprobacion(_revComprob[i]));
  if (!inf || !clave) return;
  const hechos = _revisados();
  if (marcado) hechos.add(clave); else hechos.delete(clave);
  inf.revisados = [...hechos];
  saveSession();
  const li = $(tipo === 'p' ? 'iaRevision' : 'iaComprobar')?.querySelectorAll('li')[i];
  li?.classList.toggle('ia-rev-hecho', marcado);
  if (tipo === 'p') cabeceraRevision(); else cabeceraComprobaciones();
}

// «⬇ Paquete de revisión»: .zip con el informe, la transcripción, los puntos,
// la valoración y el prompt (lib/paquete-revision.js). Módulos cargados al usarlo.
async function iaPaqueteRevision() {
  const inf = state.informeIA;
  if (!inf?.texto) return;
  saveSession();
  try {
    const [{ crearZip }, { ficherosPaquete }] = await Promise.all([import('./lib/zip.js'), import('./lib/paquete-revision.js')]);
    let puntos = [], comprobaciones = [];
    try { puntos = puntosRevision(inf); } catch { /* sin puntos: el resto del paquete sigue valiendo */ }
    try { comprobaciones = comprobacionesManuales({ ampliado: construirAmpliado(), formularioYAudio: !!inf.conAudio && !!buildPhysiQPayload().fp?.length }); } catch { /* ídem */ }
    const ahora = new Date();
    const { nombre, ficheros } = ficherosPaquete({
      inf, informe: textoInforme(), state, puntos, comprobaciones,
      nombrePlantilla: (PLANTILLAS[inf.plantilla] || PLANTILLAS.narrativo).nombre,
      versionActual: VERSION_SHA, cambiado: !!inf.huella && inf.huella !== huellaActual(), ahora,
    });
    const archivo = new File([crearZip(ficheros, ahora)], nombre, { type: 'application/zip' });
    // En el móvil, la hoja de compartir permite mandarlo o guardarlo en Archivos
    if (window.matchMedia?.('(pointer: coarse)').matches && navigator.canShare?.({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], title: nombre }); return; }
      catch (e) { if (e?.name === 'AbortError') return; }
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

// Lo que el clínico mira a ojo antes de compartir (comprobacionesManuales):
// siempre visible, aparte de los puntos automáticos; cada una se marca igual.
function pintarComprobaciones() {
  const el = $('iaComprobar');
  if (!el) return;
  let items;
  try {
    const inf = state.informeIA;
    items = comprobacionesManuales({ ampliado: construirAmpliado(), formularioYAudio: !!inf?.conAudio && !!buildPhysiQPayload().fp?.length });
  } catch { el.innerHTML = ''; _revComprob = []; return; }
  _revComprob = items;
  const hechos = _revisados();
  el.innerHTML = `<div class="ia-comprobar"><div class="ia-comprobar-titulo">☑ Antes de compartir, comprueba: <span class="ia-comprobar-cuenta"></span></div>
      <ul>${items.map((t, i) => {
        const hecho = hechos.has(claveComprobacion(t));
        return `<li class="${hecho ? 'ia-rev-hecho' : ''}"><label class="ia-rev-item">${casillaRevisado('c', i, hecho)}<span>${esc(t)}</span></label></li>`;
      }).join('')}</ul></div>`;
  cabeceraComprobaciones();
}

const contarPalabras = t => (String(t || '').replace(/[#|*-]/g, ' ').match(/\S+/g) || []).length;

function refrescarHuella() {
  const el = $('iaAvisoHuella');
  if (!el) return;
  const inf = state.informeIA;
  const cambio = inf?.huella && inf.huella !== huellaActual();
  el.innerHTML = cambio
    ? '<div class="alert alert-warning"><span class="alert-icon">✎</span><div>La valoración ha cambiado desde que se generó este informe. Genera uno nuevo si quieres que lo refleje.</div></div>'
    : '';
  pintarRevision();
}
let _huellaTimer = null;
function _refrescarHuellaDiferido(e) {
  // Las casillas «Revisado» y demás controles de la tarjeta no son datos de la
  // valoración: repintar por ellas cerraba la caja de puntos al marcar uno
  if (e?.target?.closest?.('#informeIA')) return;
  clearTimeout(_huellaTimer);
  _huellaTimer = setTimeout(refrescarHuella, 400);
}

// ── Datos ampliados de las cinco fases (ver bloquesAmpliados) ───────────────
// Lo que el resumen compartido con physiq-report no lleva y el informe sí
// necesita: edad, fase 3 en detalle, psicosocial, criterios compuestos,
// recorrido del árbol, tests de la 4b con su resultado y la pauta de la fase 5.
// Sin las etiquetas diagnósticas del ítem de la fase 1: con «(ansiedad,
// depresión)» el informe convirtió un «sí» en «ansiedad»
const PSICO = [
  ['psico_miedo', 'Miedo al movimiento'],
  ['psico_autoef', 'Baja autoeficacia'],
  ['psico_emocional', 'Componente emocional'],
];
const RESULTADO = { pos: 'positivo', neg: 'negativo' };

export function construirAmpliado() {
  const tree = CIF_TREES[state.region];
  const arbol = (tree?.steps || [])
    .filter(st => state.treeAnswers?.[st.id] != null)
    .map(st => {
      const op = st.options.find(o => o.value === state.treeAnswers[st.id]);
      // Si lo que la respuesta «orienta a» ya está diagnosticado y tratado, que
      // el prompt lo sepa (si no, lo lee como una sospecha abierta)
      // Lo mismo con una derivación del árbol marcada «Ya diagnosticada y
      // tratada» (opción `resoluble`, p. ej. codo co_step1): sin esto el prompt
      // recibía «Sospecha de fractura o luxación: derivación médica» y la pedía
      const resuelta = !!(op?.resoluble && state.derivacionResuelta?.[st.id]);
      const tratada = resuelta || (op?.hypothesis || []).some(h => esTratada(h));
      // `iaPregunta` y textoOpcionIA() (lib/informe-narrativo.js): al prompt va
      // la conclusión de la opción, no su detalle (pistas, criterios, umbrales);
      // el NINGUNO de un paso de zona no va
      const respuesta = resuelta ? op.label.split(' — ')[0] : op ? textoOpcionIA(op) : state.treeAnswers[st.id];
      if (respuesta == null) return null;
      return { pregunta: st.iaPregunta || st.question, respuesta, ...(tratada ? { tratada: true } : {}) };
    })
    .filter(Boolean);

  const tests = [];
  const pautas = [];
  for (const id of hipotesisActivas()) {
    const h = hipotesis(id);
    if (!h) continue;
    // Posquirúrgica genérica (`pq1`): la cirugía es la condición de salud; sin
    // tests, y la pauta es el protocolo del cirujano
    if (h.posquirurgica) {
      pautas.push({ hipotesis: h.name, derivar: false, posquirurgica: true, pauta: pautaHipPosq(cirugiaPayload(state.mecanismo, state.cirugia)), fuente: '', prom: h.prom || '' });
      continue;
    }
    // «Ya diagnosticada y tratada»: ni derivación ni tests (no aplican)
    if (esTratada(id)) {
      pautas.push({ hipotesis: h.name, derivar: false, tratada: true, operada: esPosquirurgico(state.mecanismo), pauta: '', fuente: '', prom: h.prom || '' });
      continue;
    }
    const res = state.testResults?.[id] || {};
    // El «Gesto testigo (①) y medida objetiva (②)» no es una prueba y no
    // guarda ningún valor: solo daba una frase vacía («se registraron gestos
    // testigo…»). No va al prompt.
    const items = (h.tests || []).map((t, idx) => !RESULTADO[res[idx]] || /^Gesto testigo/.test(t.name) ? null : {
      test: t.name, resultado: RESULTADO[res[idx]],
      ...(t.cluster && h.clusters?.[t.cluster] ? { cluster: h.clusters[t.cluster].nombre } : {}),
      ...(t.tipo === 'pronostico' ? { pronostico: true } : {}),
    }).filter(Boolean);
    if (items.length) tests.push({ hipotesis: h.name, ...(h.dosis === DOSIS_DERIVAR ? { derivar: true } : {}), items });
    pautas.push({
      hipotesis: h.name,
      derivar: h.dosis === DOSIS_DERIVAR,
      // Con ramas (lib/pauta.js), solo la de este caso: con la pauta entera de ro2
      // copió la rama degenerativa en una rotura traumática
      pauta: h.dosis === DOSIS_DERIVAR ? '' : (ramaPauta(h, state)?.texto || h.dosis || ''),
      fuente: h.dosisFuente || '',
      ...(h.pronostico ? { pronostico: h.pronostico } : {}),
      prom: h.prom || '',
    });
  }

  const criterios = [];
  for (const sis of SYSTEMIC_SCREENING[state.region]?.sistemas || []) {
    const c = sis.criterioCompuesto;
    if (!c) continue;
    const edad = state.edadPaciente;
    const positivas = c.ids.filter(q => state.sistemicoAnswers?.[q] === 'SI').length;
    // Misma regla que evaluarCriterioCompuesto() en app.js
    if (edad != null && !isNaN(edad) && edad < c.filtro.edadMax && state.cronologia === c.filtro.evolucion && positivas >= c.minPositivas) {
      criterios.push({ etiqueta: c.etiqueta, positivas, total: c.ids.length, nota: c.nota });
    }
  }

  return {
    edad: state.edadPaciente ?? null,
    sexo: state.sexo || '',
    signoComparable: (state.signoComparable || '').trim(),
    estabilidad: state.estabilidad || '',
    // Con el nivel elegido directamente (modo breve) la matriz no se rellenó
    irritabilidad: state.irritabilidadDirecta ? null : (state.irritabilidad || null),
    psico: state.riesgoPsico === 'Alto' ? PSICO.filter(([k]) => state[k]).map(([k, q]) => ({ q, a: state[k] })) : [],
    criterios, arbol, tests, pautas,
    // Formulario previo agrupado por sección del informe y sin «No sé»
    // (sustituye en el prompt al `fp` del payload)
    formulario: resumenFormularioIA(),
  };
}

// Huella de todo lo que entra en el prompt: el resumen y los datos ampliados.
const huellaActual = () => huellaPayload({ ...buildPhysiQPayload(), _ampliado: construirAmpliado() });

function textoInforme() {
  return textoParaCompartir(state.informeIA?.texto || '', state.informeIA?.datos || buildPhysiQPayload(), nombreRegion);
}

// Compartir y copiar en una sola acción (compartirTexto, app.js): hoja de
// compartir en táctil, copiar con ratón. Desde el menú de «📤 Compartir» de la
// barra inferior de la fase 5 (compartirInformeIA).
function iaCompartir() {
  registrarValoracionCompleta();
  compartirTexto(textoInforme(), { titulo: 'Informe de fisioterapia — PhysiQ-Assessment', copiado: '✓ Informe narrativo copiado al portapapeles' });
}
export function compartirInformeIA() { if (state.informeIA?.texto) iaCompartir(); }

// Para el menú de «📤 Compartir»: puntos y comprobaciones, y cuántos quedan
// sin marcar como revisados (resumenRevisados)
export function estadoRevisionIA() {
  const inf = state.informeIA;
  const vacio = resumenRevisados();
  if (!inf?.texto) return vacio;
  let puntos = [], comprobaciones = [];
  try { puntos = puntosRevision(inf); } catch { /* sin puntos */ }
  try { comprobaciones = comprobacionesManuales({ ampliado: construirAmpliado(), formularioYAudio: !!inf.conAudio && !!buildPhysiQPayload().fp?.length }); } catch { /* sin comprobaciones */ }
  return resumenRevisados(puntos, comprobaciones, inf.revisados);
}

function iaDescartarInforme() {
  showConfirmBanner('Descartar informe narrativo', 'Se borrará el informe generado. Para tener otro habrá que generarlo de nuevo.', 'Descartar', () => {
    state.informeIA = null;
    saveSession();
    pintar();
  });
}

// ── Audio de la sesión ───────────────────────────────────────────────────────
// Se graba desde la cabecera (grabadora.js); aquí se ve, se adjunta o se quita.
// Una grabación en curso no se para aquí: «Generar informe» la cierra y la usa.
function pintarAudio() {
  const el = $('iaAudio');
  const g = estadoGrabacion();
  if (g.fase !== 'parado') {
    el.innerHTML = `
      <div class="ia-grabando${g.fase === 'pausado' ? ' pausado' : ''}">
        <span class="ia-punto"></span>
        <span>${g.fase === 'pausado' ? 'Grabación en pausa' : 'Grabación en curso'}</span>
        <span class="ia-crono" id="iaCrono">${fmtTiempo(g.duracionMs)}</span>
      </div>
      ${g.sinSenal ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El micrófono no está dando señal.</div></div>'
        : g.silencio ? '<div class="alert alert-warning ia-aviso-silencio"><span class="alert-icon">⚠️</span><div>No se oye nada en la grabación. Revisa que el navegador use el micrófono correcto y que no esté silenciado; si no, el informe saldrá sin lo hablado.</div></div>' : ''}
      <div class="ia-audio-pista">Al generar el informe, la grabación se cierra y se usa. Para pausarla o reanudarla, toca la píldora de la cabecera.</div>`;
    return;
  }
  const audio = audioActual();
  if (audio) {
    const m = audio.meta || {};
    const grande = audio.blob.size > MAX_AUDIO_BYTES;
    const etiqueta = m.origen === 'archivo'
      ? `📎 ${esc(m.nombre || 'Audio adjunto')}`
      : `🎧 Grabación${m.duracionMs ? ` de ${fmtTiempo(m.duracionMs)}` : ''}`;
    el.innerHTML = `
      <div class="ia-audio-info">${etiqueta} · ${fmtMB(audio.blob.size)}${audio.recuperado ? ' <span class="ia-recuperado">(recuperado)</span>' : ''}</div>
      <audio class="ia-reproductor" controls preload="metadata" src="${audio.url}"></audio>
      ${grande ? `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El audio supera los 25 MB que admite la transcripción. Usa un archivo más corto o comprimido.</div></div>` : ''}
      <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="iaQuitarAudio()">Descartar audio</button></div>`;
    return;
  }
  el.innerHTML = `
    <div class="ia-audio-vacio">Audio de la sesión <span class="ia-opcional">(opcional)</span></div>
    <div class="ia-audio-pista">Graba la consulta con el botón 🎙 de la cabecera, en cualquier fase, o adjunta un archivo. También puedes dictarla tú al terminar.</div>
    <div class="ia-acciones">
      <button class="phase5-copy-btn" onclick="document.getElementById(\'iaArchivo\').click()">📎 Adjuntar audio</button>
      <input type="file" id="iaArchivo" accept="audio/*,.m4a,.mp3,.wav,.webm,.ogg,.mp4" hidden onchange="iaArchivo(this)">
    </div>`;
}

function actualizarCronoTarjeta() {
  const c = $('iaCrono');
  if (c) c.textContent = fmtTiempo(estadoGrabacion().duracionMs);
}

async function iaArchivo(input) {
  const file = input.files?.[0];
  input.value = '';
  if (file) await fijarArchivo(file);
}

function iaQuitarAudio() {
  showConfirmBanner('Descartar audio', 'Se borrará el audio de la sesión. El informe podrá generarse solo con los datos de la valoración.', 'Descartar', quitarAudio);
}

// Diálogo de la consulta o dictado del fisio: solo cambia cómo lee el prompt
// la transcripción (y la pista de Whisper). Se elige con un audio a la vista.
function pintarModoAudio() {
  const el = $('iaModoAudio');
  if (!el) return;
  if (idAudio() === null) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="ia-plantilla-label">Qué hay en el audio</div>
    <div class="option-group ia-plantilla-opciones">
      ${Object.entries(MODOS_AUDIO).map(([k, m]) => `<button type="button" class="option-btn${k === _modoAudio ? ' selected' : ''}" onclick="iaModoAudio('${k}')"><span class="ia-op-full">${esc(m.nombre)}</span><span class="ia-op-corto"><span class="ia-op-nombre">${esc(m.corto)}</span><span class="ia-op-sub">${esc(m.sub)}</span></span></button>`).join('')}
    </div>
    ${_modoAudio === 'dictado' ? `<ul class="ia-consejos-dictado">
      <li>Di también lo que no has hecho («la palpación por debajo no la he hecho»).</li>
      <li>Presenta tus indicaciones como tuyas («mis indicaciones como fisio son…») y lo del paciente con «refiere».</li>
      <li>Da cada cifra con su momento («hoy un 4 sobre 10; tras el partido del domingo, un 7»).</li>
    </ul>` : ''}`;
}

function iaModoAudio(k) {
  if (!MODOS_AUDIO[k]) return;
  _modoAudio = k;
  pintarModoAudio();
}

// ── Consentimiento y botón de generar ────────────────────────────────────────
function consentido() {
  return _consentido && _audioConsentido === idAudio();
}

function pintarConsent() {
  const el = $('iaConsent');
  if (idAudio() === null) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <label class="ia-consent">
      <input type="checkbox" ${consentido() ? 'checked' : ''} onchange="iaConsent(this.checked)">
      <span>El paciente ha sido informado y consiente el envío del audio de la sesión para su transcripción.</span>
    </label>`;
}

function iaConsent(v) { _consentido = !!v; _audioConsentido = idAudio(); pintarBoton(); }

function motivoBloqueo() {
  const audio = audioActual();
  if (estadoLicencia() !== 'real') return 'licencia';
  if (_gen || _cerrando) return 'generando';
  if (audio && audio.blob.size > MAX_AUDIO_BYTES) return 'El audio supera los 25 MB.';
  if (idAudio() !== null && !consentido()) return 'Marca el consentimiento del paciente para enviar el audio.';
  if (!_turnstileToken) return _turnstileFallo ? 'turnstile' : 'Completa la verificación de seguridad.';
  return '';
}

function pintarBoton() {
  const btn = $('iaGenerar');
  if (!btn) return;
  const motivo = motivoBloqueo();
  btn.disabled = !!motivo;
  btn.title = motivo && motivo.length > 12 ? motivo : '';
  btn.textContent = state.informeIA?.texto ? 'Generar de nuevo' : 'Generar informe';
  const msg = $('iaTurnstileMsg');
  if (msg) {
    msg.innerHTML = motivo === 'turnstile'
      ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido cargar la verificación de seguridad. Desactiva el bloqueador de anuncios para esta página o revisa la conexión.</div></div>'
      : '';
  }
}

function pintarGenerador() {
  const det = $('iaGenerador');
  if (!det) return;
  const activo = estadoLicencia() === 'real' && !_gen;
  det.hidden = !activo;
  // Con un informe ya generado, generar otro queda plegado: es una acción de pago.
  // Se pliega al montar con un informe ya guardado y al terminar de generar
  // (iaGenerar); a partir de ahí lo abre o cierra quien lo usa.
  const hayInforme = !!state.informeIA?.texto;
  det.classList.toggle('con-resultado', hayInforme);
  if (!hayInforme || audioActual() || estadoGrabacion().fase !== 'parado') det.open = true;
  if (!activo) return;
  pintarPlantilla();
  pintarAudio();
  pintarModoAudio();
  pintarConsent();
  pintarBoton();
  pintarError();
}

// Narrativo o ficha breve; por defecto, la que encaja con el tipo de consulta
// (ficha en modo breve). La elección a mano dura lo que la página.
const plantillaActual = () => _plantilla || plantillaPorDefecto(state.modo);

function pintarPlantilla() {
  const el = $('iaPlantilla');
  if (!el) return;
  const actual = plantillaActual();
  el.innerHTML = `
    <div class="ia-plantilla-label">Tipo de informe</div>
    <div class="option-group ia-plantilla-opciones">
      ${Object.entries(PLANTILLAS).map(([k, p]) => `<button type="button" class="option-btn${k === actual ? ' selected' : ''}" onclick="iaPlantilla('${k}')"><span class="ia-op-nombre">${esc(p.nombre)}</span> <span class="ia-plantilla-palabras ia-op-sub">~${p.palabras} palabras</span></button>`).join('')}
    </div>`;
}

function iaPlantilla(k) {
  if (!PLANTILLAS[k]) return;
  _plantilla = k;
  pintarPlantilla();
}

// ── Generación ───────────────────────────────────────────────────────────────
// Durante la generación, una línea de progreso (palabras y sección en curso);
// el texto, en un desplegable cerrado y sin scroll interno, para no meter una
// caja con scroll dentro de la página en el móvil.
function pintarProgreso() {
  const el = $('iaProgreso');
  if (!_gen) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="ia-estado ia-progreso"><span class="ia-spinner"></span><span id="iaProgresoTexto">${textoProgreso()}</span></div>
    <details class="ia-vivo" id="iaVivo"${_vivoAbierto ? ' open' : ''}><summary>Ver mientras se escribe</summary>
      <div class="ia-informe" id="iaVistaPrevia">${markdownAHtml(_gen.texto)}</div>
    </details>
    <div class="ia-nota-pantalla">Mantén la pantalla encendida y la app abierta hasta que termine: si el móvil se bloquea o cambias de app, la generación se corta.</div>
    <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="iaCancelar()">Cancelar</button></div>`;
  $('iaVivo').addEventListener('toggle', e => {
    _vivoAbierto = e.target.open;
    if (_vivoAbierto) refrescarVistaPrevia();
  });
}

function textoProgreso() {
  if (!_gen) return '';
  if (_gen.fase === 'transcribiendo') return 'Transcribiendo el audio…';
  const n = contarPalabras(_gen.texto);
  if (!n) return 'Redactando el informe…';
  const secciones = _gen.texto.match(/^##\s+(.+)$/gm);
  const actual = secciones ? secciones[secciones.length - 1].replace(/^##\s+/, '').trim() : '';
  const bonito = actual ? actual.charAt(0) + actual.slice(1).toLowerCase() : '';
  return `Redactando… · ${n} palabras${bonito ? ` · ${esc(bonito)}` : ''}`;
}

let _vistaPendiente = false;
function refrescarVistaPrevia() {
  if (_vistaPendiente) return;
  _vistaPendiente = true;
  requestAnimationFrame(() => {
    _vistaPendiente = false;
    if (!_gen) return;
    const t = $('iaProgresoTexto');
    if (t) t.innerHTML = textoProgreso();
    const v = $('iaVistaPrevia');
    // Solo se repinta el texto si el desplegable está abierto
    if (v && v.closest('details')?.open) v.innerHTML = markdownAHtml(_gen.texto);
  });
}

class ModoDemo extends Error {}
// Whisper devolvió una transcripción sin voz (silencio o texto de relleno
// como «Subtítulos realizados por la comunidad de Amara.org»): se corta antes
// de redactar, para no gastar un informe que ignoraría el audio.
class SinVoz extends Error {}

// Pantalla encendida mientras se genera (como al grabar, grabadora.js): el
// bloqueo automático de la pantalla suspende la página y corta el stream. El
// navegador suelta el wake lock al ocultar la página; al volver se pide otra
// vez, y se apunta que hubo un paso por segundo plano para explicar el fallo.
let _wakeLockGen = null;
function pedirWakeLockGen() {
  navigator.wakeLock?.request('screen').then(l => {
    if (_gen) _wakeLockGen = l; else l.release().catch(() => {});
  }).catch(() => {});
}
function soltarWakeLockGen() {
  _wakeLockGen?.release?.().catch(() => {});
  _wakeLockGen = null;
}
document.addEventListener('visibilitychange', () => {
  if (!_gen) return;
  if (document.visibilityState === 'hidden') _gen.oculto = true;
  else pedirWakeLockGen();
});

async function iaGenerar() {
  if (motivoBloqueo()) { pintarBoton(); return; }
  // Generar es el final de la consulta: la grabación en curso se cierra aquí.
  if (estadoGrabacion().fase !== 'parado') {
    _cerrando = true;
    pintarBoton();
    try { await cerrarGrabacion(); } finally { _cerrando = false; }
    if (audioActual()?.blob.size > MAX_AUDIO_BYTES) { pintar(); return; }
  }
  saveSession();   // vuelca al estado lo último escrito (notas del plan, etc.)
  const datos = buildPhysiQPayload();
  const ampliado = construirAmpliado();
  const plantilla = plantillaActual();
  const audio = audioActual();
  const conAudio = !!audio;
  const fd = new FormData();
  if (conAudio) {
    const ext = extensionAudio(audio.blob.type || audio.meta?.mime);
    const nombre = audio.meta?.origen === 'archivo' && audio.meta?.nombre ? audio.meta.nombre : `sesion.${ext}`;
    fd.append('file', audio.blob, nombre);
  }
  const dictado = conAudio && _modoAudio === 'dictado';
  fd.append('whisperHint', getWhisperPrompt(datos.r, { dictado }));
  const prompt = PLANTILLAS[plantilla].prompt(datos, { conAudio, nombreRegion, ampliado, dictado });
  fd.append('prompt', prompt);
  fd.append('maxTokens', String(PLANTILLAS[plantilla].maxTokens));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 300000);
  _error = null;
  _gen = { texto: '', transcripcion: '', fase: conAudio ? 'transcribiendo' : 'redactando', ctrl, oculto: false, conAudio };
  _vivoAbierto = false;
  pedirWakeLockGen();
  pintar();

  const token = consumirToken();
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
      if (res.status === 429) throw new Error(e.error?.message || 'Has alcanzado el límite de informes. Inténtalo más tarde.');
      if (res.status === 403) throw new Error('La verificación de seguridad ha fallado. Vuelve a completarla y genera de nuevo.');
      throw new Error(e.error?.message || `Error del servidor (${res.status})`);
    }
    await leerStream(res);
    if (!_gen.texto.trim()) throw new Error('El servidor no ha devuelto ningún informe.');

    state.informeIA = {
      texto: _gen.texto,
      transcripcion: conAudio ? _gen.transcripcion : '',
      fecha: new Date().toISOString(),
      conAudio,
      ...(dictado ? { dictado: true } : {}),
      plantilla,
      prompt,                 // el exacto que se envió, para el paquete de revisión
      version: VERSION_SHA,
      huella: huellaPayload({ ...datos, _ampliado: ampliado }),
      datos: { p: datos.p, d: datos.d, r: datos.r, la: datos.la, ed: ampliado.edad, sx: ampliado.sexo },
    };
    saveSession();
    // Con el informe guardado, el audio ya no hace falta en el dispositivo.
    if (conAudio && audioActual() === audio) quitarAudio();
    const det = $('iaGenerador');
    if (det) det.open = false;
    _resultadoAbierto = false;
    _revAbierta = null;   // informe nuevo: la caja de puntos vuelve a su apertura por defecto
    showToast('✓ Informe narrativo generado', 'success');
  } catch (err) {
    if (err instanceof SinVoz) {
      // Se conserva el audio: se puede escuchar, quitar o reintentar.
      _error = { texto: TEXTO_SIN_VOZ, original: '', sinAudio: true };
      showToast('El audio no contiene voz reconocible.', 'warning');
    } else if (err instanceof ModoDemo) {
      marcarSinLicencia();
      showToast('Este navegador no tiene una licencia PhysiQ válida.', 'warning');
    } else if (err.name === 'AbortError') {
      if (!_gen?.cancelado) showToast('Tiempo de espera agotado. Inténtalo de nuevo.', 'warning');
    } else {
      // El audio no se toca: solo se borra con el informe ya guardado.
      _error = errorConexion(err, { seOculto: !!_gen?.oculto || document.visibilityState === 'hidden' }) || errorLegible(err.message);
      showToast('No se ha podido generar el informe.', 'warning');
    }
  } finally {
    clearTimeout(timer);
    soltarWakeLockGen();
    _cerrarDlgCancelar?.();   // la generación ya acabó: no queda nada que cancelar
    _cerrarDlgCancelar = null;
    ctrl.abort();   // suelta el stream si se salió antes de leerlo entero (p. ej. modo demo)
    _gen = null;
    pintar();
  }
}

async function leerStream(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const procesar = ev => {
    if (ev.type === 'transcript') {
      _gen.transcripcion = ev.data.text ?? '';
      if (_gen.conAudio && transcripcionSinVoz(_gen.transcripcion)) throw new SinVoz();
      _gen.fase = 'redactando'; refrescarVistaPrevia();
    }
    else if (ev.type === 'report_chunk') { _gen.texto += ev.data.text ?? ''; refrescarVistaPrevia(); }
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

// «Cancelar» pide confirmación: lo escrito se pierde y repetir es esperar
// otra vez (y probablemente volver a pagar las APIs), y en el móvil el botón
// queda bajo el texto que se va escribiendo. Mientras el diálogo está abierto
// la generación sigue; si acaba (bien o con error), el diálogo se cierra solo.
let _cerrarDlgCancelar = null;
function iaCancelar() {
  if (!_gen) return;
  _cerrarDlgCancelar = showConfirmBanner('Cancelar la generación',
    'Se perderá lo que lleva escrito el informe. El audio se conserva y podrás volver a generarlo.',
    // «Sí, cancelar» se queda en «Cancelar» por debajo de 480 px, para que el
    // botón no ocupe dos líneas
    '<span class="btn-text-full">Sí, cancelar</span><span class="btn-text-short">Cancelar</span>',
    cancelarGeneracion, { cancelLabel: 'Seguir' });
}

function cancelarGeneracion() {
  _cerrarDlgCancelar = null;
  if (!_gen) return;
  _gen.cancelado = true;
  _gen.ctrl.abort();
}

// ── Reinicio ─────────────────────────────────────────────────────────────────
// Desde _softResetApp(): cancela la generación en curso y repinta.
// state.informeIA lo limpia app.js; el audio es de grabadora.js, que solo se
// descarta en un reinicio confirmado en este dispositivo (ver app.js).
export function resetInformeIA() {
  if (_gen) { _gen.cancelado = true; _gen.ctrl.abort(); }
  _consentido = false;
  _error = null;
  pintar();
}

// Exposed for inline onclick/onchange attributes in the HTML strings above.
Object.assign(window, {
  iaMostrarClave, iaGuardarClave, iaReintentarLicencia,
  iaArchivo, iaQuitarAudio, iaConsent,
  iaGenerar, iaCancelar, iaDescartarInforme, iaPlantilla, iaModoAudio, iaPaqueteRevision, iaMarcarRevisado,
});
