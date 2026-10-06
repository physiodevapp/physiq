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

import { state } from './state.js';
import { saveSession, showConfirmBanner, buildPhysiQPayload, nombreRegion, showToast } from './app.js';
import {
  ORCHESTRATOR_URL, TURNSTILE_SITEKEY, MAX_TOKENS_INFORME, MAX_AUDIO_BYTES,
  getWhisperPrompt, buildNarrativePrompt, huellaPayload, parseSSEBuffer, parseSSEBlock,
  informeTruncado, markdownAHtml, textoParaCompartir, extensionAudio, errorLegible,
} from './lib/informe-narrativo.js';
import { estadoLicencia, onLicencia, comprobarLicencia, probarClave, marcarSinLicencia, claveGuardada, detalleLicencia } from './lib/licencia-ia.js';
import {
  onGrabadora, audioActual, estadoGrabacion, fijarArchivo, quitarAudio, pausar, reanudar, parar, fmtTiempo, fmtMB,
} from './grabadora.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = id => document.getElementById(id);

// ── Estado del módulo (no persiste: lo persistente es state.informeIA) ───────
let _root = null;
let _mostrarClave = false;
let _claveMsg = '';
let _consentido = false;
let _audioConsentido = null;     // el consentimiento vale para un audio concreto
let _gen = null;                 // generación en curso: { texto, transcripcion, fase, ctrl }
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
      <div id="iaAudio"></div>
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
function pintarResultado() {
  const el = $('iaResultado');
  const inf = state.informeIA;
  if (!inf?.texto || _gen) { el.innerHTML = ''; return; }
  const fecha = inf.fecha ? new Date(inf.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
  el.innerHTML = `
    <div id="iaAvisoHuella"></div>
    <div class="ia-meta">Generado ${esc(fecha)} · ${inf.conAudio ? 'con audio de la sesión' : 'solo con los datos de la valoración'}</div>
    ${informeTruncado(inf.texto) ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El informe parece incompleto: la última sección no se ha generado. Puedes generarlo de nuevo.</div></div>' : ''}
    <div class="ia-informe">${markdownAHtml(inf.texto)}</div>
    ${inf.transcripcion && inf.conAudio ? `<details class="ia-transcripcion"><summary>Transcripción del audio</summary><div class="ia-transcripcion-texto">${esc(inf.transcripcion)}</div></details>` : ''}
    <div class="ia-acciones">
      <button class="phase5-copy-btn" onclick="iaCompartir()">📤 Compartir</button>
      <button class="phase5-copy-btn" onclick="iaCopiar()">Copiar</button>
      <button class="phase5-copy-btn ia-btn-descartar" onclick="iaDescartarInforme()">Descartar</button>
    </div>`;
  refrescarHuella();
}

function refrescarHuella() {
  const el = $('iaAvisoHuella');
  if (!el) return;
  const inf = state.informeIA;
  const cambio = inf?.huella && inf.huella !== huellaPayload(buildPhysiQPayload());
  el.innerHTML = cambio
    ? '<div class="alert alert-warning"><span class="alert-icon">✎</span><div>La valoración ha cambiado desde que se generó este informe. Genera uno nuevo si quieres que lo refleje.</div></div>'
    : '';
}
let _huellaTimer = null;
function _refrescarHuellaDiferido() {
  clearTimeout(_huellaTimer);
  _huellaTimer = setTimeout(refrescarHuella, 400);
}

function textoInforme() {
  return textoParaCompartir(state.informeIA?.texto || '', state.informeIA?.datos || buildPhysiQPayload(), nombreRegion);
}

function iaCompartir() {
  const text = textoInforme();
  if (navigator.share) {
    navigator.share({ title: 'Informe de fisioterapia — PhysiQ-Assessment', text }).catch(() => {});
  } else {
    iaCopiar();
  }
}

function iaCopiar() {
  navigator.clipboard.writeText(textoInforme())
    .then(() => showToast('✓ Informe narrativo copiado al portapapeles', 'success'))
    .catch(() => showToast('No se pudo copiar el informe.', 'warning'));
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
      ${g.sinSenal ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El micrófono no está dando señal.</div></div>' : ''}
      <div class="ia-acciones">
        <button class="phase5-copy-btn" onclick="iaPararGrabacion()">■ Parar y usar</button>
        ${g.fase === 'pausado'
          ? '<button class="phase5-copy-btn" onclick="iaReanudarGrabacion()">▶ Reanudar</button>'
          : '<button class="phase5-copy-btn" onclick="iaPausarGrabacion()">⏸ Pausa</button>'}
      </div>`;
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
      <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="iaQuitarAudio()">Quitar audio</button></div>`;
    return;
  }
  el.innerHTML = `
    <div class="ia-audio-vacio">Audio de la sesión <span class="ia-opcional">(opcional)</span></div>
    <div class="ia-audio-pista">Graba la consulta con el botón 🎙 de la cabecera, en cualquier fase, o adjunta un archivo.</div>
    <div class="ia-acciones">
      <button class="phase5-copy-btn" onclick="document.getElementById(\'iaArchivo\').click()">📎 Adjuntar audio</button>
      <input type="file" id="iaArchivo" accept="audio/*,.m4a,.mp3,.wav,.webm,.ogg,.mp4" hidden onchange="iaArchivo(this)">
    </div>`;
}

function actualizarCronoTarjeta() {
  const c = $('iaCrono');
  if (c) c.textContent = fmtTiempo(estadoGrabacion().duracionMs);
}

function iaPararGrabacion() { parar(); }
function iaPausarGrabacion() { pausar(); }
function iaReanudarGrabacion() { reanudar(); }

async function iaArchivo(input) {
  const file = input.files?.[0];
  input.value = '';
  if (file) await fijarArchivo(file);
}

function iaQuitarAudio() {
  showConfirmBanner('Quitar audio', 'Se borrará el audio de la sesión. El informe podrá generarse solo con los datos de la valoración.', 'Quitar', quitarAudio);
}

// ── Consentimiento y botón de generar ────────────────────────────────────────
function consentido() {
  return _consentido && _audioConsentido === audioActual();
}

function pintarConsent() {
  const el = $('iaConsent');
  if (!audioActual() || estadoGrabacion().fase !== 'parado') { el.innerHTML = ''; return; }
  el.innerHTML = `
    <label class="ia-consent">
      <input type="checkbox" ${consentido() ? 'checked' : ''} onchange="iaConsent(this.checked)">
      <span>El paciente ha sido informado y consiente el envío del audio de la sesión para su transcripción.</span>
    </label>`;
}

function iaConsent(v) { _consentido = !!v; _audioConsentido = audioActual(); pintarBoton(); }

function motivoBloqueo() {
  const audio = audioActual();
  if (estadoLicencia() !== 'real') return 'licencia';
  if (_gen) return 'generando';
  if (estadoGrabacion().fase !== 'parado') return 'Para la grabación antes de generar el informe.';
  if (audio && audio.blob.size > MAX_AUDIO_BYTES) return 'El audio supera los 25 MB.';
  if (audio && !consentido()) return 'Marca el consentimiento del paciente para enviar el audio.';
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
  pintarAudio();
  pintarConsent();
  pintarBoton();
  pintarError();
}

// ── Generación ───────────────────────────────────────────────────────────────
function pintarProgreso() {
  const el = $('iaProgreso');
  if (!_gen) { el.innerHTML = ''; return; }
  const fase = _gen.fase === 'transcribiendo' ? 'Transcribiendo el audio…' : 'Redactando el informe…';
  el.innerHTML = `
    <div class="ia-estado ia-progreso"><span class="ia-spinner"></span>${fase}</div>
    <div class="ia-informe ia-vista-previa" id="iaVistaPrevia">${markdownAHtml(_gen.texto)}</div>
    <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="iaCancelar()">Cancelar</button></div>`;
}

let _vistaPendiente = false;
function refrescarVistaPrevia() {
  if (_vistaPendiente) return;
  _vistaPendiente = true;
  requestAnimationFrame(() => {
    _vistaPendiente = false;
    const v = $('iaVistaPrevia');
    if (v && _gen) v.innerHTML = markdownAHtml(_gen.texto);
  });
}

class ModoDemo extends Error {}

async function iaGenerar() {
  if (motivoBloqueo()) { pintarBoton(); return; }
  saveSession();   // vuelca al estado lo último escrito (notas del plan, etc.)
  const datos = buildPhysiQPayload();
  const audio = audioActual();
  const conAudio = !!audio;
  const fd = new FormData();
  if (conAudio) {
    const ext = extensionAudio(audio.blob.type || audio.meta?.mime);
    const nombre = audio.meta?.origen === 'archivo' && audio.meta?.nombre ? audio.meta.nombre : `sesion.${ext}`;
    fd.append('file', audio.blob, nombre);
  }
  fd.append('whisperHint', getWhisperPrompt(datos.r));
  fd.append('prompt', buildNarrativePrompt(datos, { conAudio, nombreRegion }));
  fd.append('maxTokens', String(MAX_TOKENS_INFORME));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 300000);
  _error = null;
  _gen = { texto: '', transcripcion: '', fase: conAudio ? 'transcribiendo' : 'redactando', ctrl };
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
      huella: huellaPayload(datos),
      datos: { p: datos.p, d: datos.d, r: datos.r },
    };
    saveSession();
    // Con el informe guardado, el audio ya no hace falta en el dispositivo.
    if (conAudio && audioActual() === audio) quitarAudio();
    const det = $('iaGenerador');
    if (det) det.open = false;
    showToast('✓ Informe narrativo generado', 'success');
  } catch (err) {
    if (err instanceof ModoDemo) {
      marcarSinLicencia();
      showToast('Este navegador no tiene una licencia PhysiQ válida.', 'warning');
    } else if (err.name === 'AbortError') {
      if (!_gen?.cancelado) showToast('Tiempo de espera agotado. Inténtalo de nuevo.', 'warning');
    } else {
      _error = errorLegible(err.message);
      showToast('No se ha podido generar el informe.', 'warning');
    }
  } finally {
    clearTimeout(timer);
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
    if (ev.type === 'transcript') { _gen.transcripcion = ev.data.text ?? ''; _gen.fase = 'redactando'; pintarProgreso(); }
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

function iaCancelar() {
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
  iaPararGrabacion, iaPausarGrabacion, iaReanudarGrabacion, iaArchivo, iaQuitarAudio, iaConsent,
  iaGenerar, iaCancelar, iaCompartir, iaCopiar, iaDescartarInforme,
});
