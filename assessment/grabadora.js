// ============================================================
// PhysiQ-Assessment · grabadora.js
// Grabación de la sesión desde la cabecera — solo standalone (fuera del hub)
// ============================================================
//
// La consulta ocurre en las fases 1–4b, así que la grabación se controla desde
// la cabecera (#grabBtn) en cualquier fase, no desde la tarjeta de la fase 5:
//   · parado, sin audio  → icono 🎙: un toque empieza a grabar
//   · grabando / pausa   → píldora «● 12:34» / «⏸ 12:34»; el toque abre el menú
//                          (pausa/reanudar, parar, descartar)
//   · parado, con audio  → icono con punto verde; el menú lleva al informe
// En el hub el grabador es el del propio hub: app.js ni importa este módulo.
//
// Este módulo es el dueño del audio de la sesión — grabado aquí o adjuntado en
// la tarjeta (informe-ia.js, que lo lee con audioActual()) — y de su copia en
// IDB (lib/audio-store.js), de la que se recupera al recargar.
//
// El botón solo aparece con licencia (body.ia-licencia, lib/licencia-ia.js),
// o mientras haya una grabación en marcha aunque la licencia caiga a mitad.

import { state } from './state.js';
import { showConfirmBanner, showToast } from './app.js';
import { MAX_AUDIO_BYTES } from './lib/informe-narrativo.js';
import { guardarTrozo, actualizarMeta, leerAudio, borrarAudio } from './lib/audio-store.js';
import { comprobarLicencia } from './lib/licencia-ia.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = id => document.getElementById(id);

// Avisos por tamaño, no por tiempo: iOS puede ignorar audioBitsPerSecond y
// grabar a más del doble, así que 90 minutos no siempre caben en 25 MB.
const AVISO_BYTES = 20 * 1024 * 1024;
const TOPE_BYTES = MAX_AUDIO_BYTES - 1024 * 1024;   // margen para el último trozo

let _grab = null;      // grabación en curso
let _audio = null;     // { blob, meta, url, recuperado? } — grabado o adjunto
let _corte = false;    // la última grabación la cortó el sistema (aviso pendiente)
let _menuAbierto = false;
const _oyentes = new Set();

// ── API para informe-ia.js y app.js ──────────────────────────────────────────
// tipo: 'estado' (cambió la grabación o el audio) | 'tick' (solo el cronómetro)
export function onGrabadora(fn) {
  _oyentes.add(fn);
  return () => _oyentes.delete(fn);
}
function avisar(tipo = 'estado') {
  if (tipo === 'estado') pintarCabecera();
  else actualizarCrono();
  _oyentes.forEach(fn => { try { fn(tipo); } catch {} });
}

export const audioActual = () => _audio;
export const grabando = () => !!_grab;
export const hayAudio = () => !!_grab || !!_audio;

export function estadoGrabacion() {
  if (!_grab) return { fase: 'parado' };
  return { fase: _grab.pausado ? 'pausado' : 'grabando', duracionMs: duracion(), bytes: _grab.bytes, sinSenal: _grab.sinSenal };
}

export async function fijarArchivo(file) {
  await borrarAudio();
  quitarLocal();
  const meta = { origen: 'archivo', nombre: file.name, mime: file.type || '', fecha: new Date().toISOString() };
  _audio = { blob: file, meta: { ...meta, chunks: 1 }, url: URL.createObjectURL(file) };
  if (file.size <= MAX_AUDIO_BYTES) guardarTrozo(0, file, meta);
  avisar();
}

// Sin confirmación: quien llama ya la pidió (o el informe ya se generó).
export function quitarAudio() {
  quitarLocal();
  borrarAudio();
  avisar();
}

// Reiniciar valoración / borrar sesión en ESTE dispositivo (app.js, tras su
// propia confirmación, que ya avisa del audio).
export function descartarTodo() {
  if (_grab) { _grab.descartar = true; try { _grab.rec.stop(); } catch {} }
  quitarAudio();
}

// ── Arranque (app.js, al cargar, solo fuera del hub) ─────────────────────────
export function iniciarGrabadora() {
  comprobarLicencia();
  leerAudio().then(a => {
    if (a && !_audio && !_grab) { _audio = { ...a, url: URL.createObjectURL(a.blob), recuperado: true }; avisar(); }
  });
  document.addEventListener('click', e => {
    // Un botón del menú que se repintó durante su propio clic ya no está en el
    // documento: no es un clic «fuera», aunque closest() ya no lo encuentre.
    if (!_menuAbierto || !e.target.isConnected) return;
    if (!e.target.closest('#grabMenu, #grabBtn')) cerrarMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && _menuAbierto) cerrarMenu(); });
  window.addEventListener('resize', () => { if (_menuAbierto) cerrarMenu(); });
  document.addEventListener('visibilitychange', () => {
    // El navegador suelta el wake lock al ocultar la página; al volver, se pide otra vez.
    if (document.visibilityState === 'visible' && _grab && !_grab.pausado) pedirWakeLock();
  });
  // Lo grabado se recupera al volver, pero así no se corta sin querer.
  window.addEventListener('beforeunload', e => {
    if (!_grab) return;
    e.preventDefault();
    e.returnValue = '';
  });
  pintarCabecera();
}

// ── Grabación ────────────────────────────────────────────────────────────────
const puedeGrabar = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

function duracion() {
  if (!_grab) return 0;
  return _grab.acumulado + (_grab.pausado ? 0 : Date.now() - _grab.desde);
}

let _wakeLock = null;
function pedirWakeLock() {
  navigator.wakeLock?.request('screen').then(l => { _wakeLock = l; }).catch(() => {});
}
function soltarWakeLock() {
  _wakeLock?.release?.().catch(() => {});
  _wakeLock = null;
}

export async function grabar() {
  if (_grab) return;
  if (!puedeGrabar()) { showToast('Este navegador no permite grabar audio.', 'warning'); return; }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  } catch {
    showToast('No se ha podido acceder al micrófono. Revisa los permisos del navegador.', 'warning');
    return;
  }
  const tipos = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];
  const mime = tipos.find(t => window.MediaRecorder.isTypeSupported?.(t)) || '';
  let rec;
  try {
    rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 32000 });
  } catch {
    stream.getTracks().forEach(t => t.stop());
    showToast('Este navegador no permite grabar audio.', 'warning');
    return;
  }
  await borrarAudio();
  quitarLocal();
  _corte = false;
  const g = { rec, stream, partes: [], n: 0, bytes: 0, desde: Date.now(), acumulado: 0, pausado: false,
    descartar: false, cortada: false, sinSenal: false, avisado: false, mime: rec.mimeType || mime, timer: null };
  const meta = () => ({ origen: 'grabacion', mime: g.mime, duracionMs: duracion(), fecha: new Date().toISOString() });

  rec.ondataavailable = e => {
    if (!e.data?.size || g.descartar) return;
    g.partes.push(e.data);
    g.bytes += e.data.size;
    guardarTrozo(g.n++, e.data, meta());
    if (!g.avisado && g.bytes >= AVISO_BYTES) {
      g.avisado = true;
      showToast('La grabación se acerca al límite de 25 MB de la transcripción: quedan pocos minutos.', 'warning');
    }
    if (g.bytes >= TOPE_BYTES && rec.state !== 'inactive') {
      showToast('Grabación parada al llegar al límite de 25 MB. Lo grabado se ha guardado.', 'warning');
      parar();
    }
  };
  rec.onstop = () => {
    clearInterval(g.timer);
    g.stream.getTracks().forEach(t => t.stop());
    soltarWakeLock();
    _grab = null;
    document.body.classList.remove('grab-activa');
    if (g.descartar || !g.partes.length) {
      borrarAudio();
    } else {
      const m = { ...meta(), duracionMs: g.acumulado, chunks: g.n };
      actualizarMeta(m);
      const blob = new Blob(g.partes, { type: g.mime });
      _audio = { blob, meta: m, url: URL.createObjectURL(blob) };
      if (g.cortada) {
        _corte = true;
        showToast('La grabación se ha cortado (el sistema dejó de dar audio). Lo grabado se ha guardado.', 'warning');
      }
    }
    avisar();
  };

  // Llamada entrante, otra app que toma el micrófono, bloqueo en iOS…: sin esto
  // la grabación seguiría «en marcha» pero muda, sin que nadie lo notara.
  const pista = stream.getAudioTracks()[0];
  pista?.addEventListener('ended', () => {
    if (!_grab || _grab !== g) return;
    g.cortada = true;
    parar();
  });
  pista?.addEventListener('mute', () => { g.sinSenal = true; avisar(); });
  pista?.addEventListener('unmute', () => { g.sinSenal = false; avisar(); });

  // Trozos de 10 s: si la página se cierra, se pierde como mucho lo último.
  rec.start(10000);
  g.timer = setInterval(() => avisar('tick'), 500);
  _grab = g;
  document.body.classList.add('grab-activa');
  pedirWakeLock();
  avisar();
}

export function pausar() {
  if (!_grab || _grab.pausado) return;
  _grab.rec.pause();
  _grab.acumulado += Date.now() - _grab.desde;
  _grab.pausado = true;
  soltarWakeLock();
  avisar();
}

export function reanudar() {
  if (!_grab || !_grab.pausado) return;
  _grab.rec.resume();
  _grab.desde = Date.now();
  _grab.pausado = false;
  pedirWakeLock();
  avisar();
}

export function parar() {
  if (!_grab) return;
  if (!_grab.pausado) { _grab.acumulado += Date.now() - _grab.desde; _grab.pausado = true; }
  try { _grab.rec.stop(); } catch {}
}

function quitarLocal() {
  if (_audio?.url) URL.revokeObjectURL(_audio.url);
  _audio = null;
  _corte = false;
}

// ── Cabecera: botón y menú ───────────────────────────────────────────────────
export const fmtTiempo = ms => {
  const s = Math.floor((ms || 0) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
export const fmtMB = b => `${(b / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;

const ICONO_MIC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="22"/></svg>';

function pintarCabecera() {
  const btn = $('grabBtn');
  if (!btn) return;
  btn.classList.remove('recording', 'paused', 'recorded', 'grab-aviso', 'grab-pildora');
  if (_grab) {
    btn.classList.add('grab-pildora', _grab.pausado ? 'paused' : 'recording');
    if (_grab.sinSenal) btn.classList.add('grab-aviso');
    // Pausa con dos barras de CSS, no con «⏸»: Android lo pinta como emoji
    // ancho y de color, y descuadraba la píldora en la cabecera.
    const icono = _grab.sinSenal ? '⚠' : _grab.pausado ? '<span class="grab-pausa"></span>' : '<span class="btn-record-dot"></span>';
    btn.innerHTML = `${icono}<span class="grab-crono" id="grabCrono">${fmtTiempo(duracion())}</span>`;
    btn.title = _grab.sinSenal ? 'El micrófono no está dando señal' : _grab.pausado ? 'Grabación en pausa' : 'Grabando la sesión';
  } else {
    btn.innerHTML = ICONO_MIC + (_audio ? '<span class="grab-punto"></span>' : '');
    if (_audio) btn.classList.add(_corte ? 'grab-aviso' : 'recorded');
    btn.title = _audio ? 'Audio de la sesión grabado' : 'Grabar la sesión';
  }
  btn.setAttribute('aria-label', btn.title);
  if (_menuAbierto) pintarMenu();
}

function actualizarCrono() {
  const c = $('grabCrono');
  if (c) c.textContent = fmtTiempo(duracion());
  const m = $('grabMenuCrono');
  if (m && _grab) m.textContent = datoGrab();
}

// El tamaño llega con cada trozo de 10 s: antes del primero no se muestra.
const datoGrab = () => fmtTiempo(duracion()) + (_grab?.bytes ? ` · ${fmtMB(_grab.bytes)}` : '');

function grabBtnClick() {
  // Sin nada grabado, un toque basta para empezar: es lo que se busca al pulsarlo.
  if (!_grab && !_audio) { grabar(); return; }
  _menuAbierto ? cerrarMenu() : abrirMenu();
}

function abrirMenu() {
  _menuAbierto = true;
  pintarMenu();
  const m = $('grabMenu');
  const r = $('grabBtn').getBoundingClientRect();
  m.style.top = `${Math.round(r.bottom + 8)}px`;
  m.style.right = `${Math.max(16, Math.round(innerWidth - r.right))}px`;
  m.hidden = false;
}

function cerrarMenu() {
  _menuAbierto = false;
  const m = $('grabMenu');
  if (m) m.hidden = true;
  if (_corte && !_grab) { _corte = false; pintarCabecera(); }   // aviso visto
}

function pintarMenu() {
  const m = $('grabMenu');
  if (!m) return;
  if (_grab) {
    const linea = _grab.sinSenal ? '⚠ Sin señal del micrófono' : _grab.pausado ? '⏸ En pausa' : '● Grabando la sesión';
    m.innerHTML = `
      <div class="grab-menu-titulo${_grab.sinSenal ? ' aviso' : ''}">${linea}</div>
      <div class="grab-menu-dato" id="grabMenuCrono">${datoGrab()}</div>
      <div class="grab-menu-acciones">
        ${_grab.pausado
          ? '<button class="phase5-copy-btn" onclick="grabReanudar()">▶ Reanudar</button>'
          : '<button class="phase5-copy-btn" onclick="grabPausar()">⏸ Pausa</button>'}
        <button class="phase5-copy-btn" onclick="grabParar()">■ Parar</button>
        <button class="phase5-copy-btn ia-btn-descartar" onclick="grabDescartar()">Descartar</button>
      </div>`;
    return;
  }
  if (!_audio) { cerrarMenu(); return; }
  const meta = _audio.meta || {};
  const etiqueta = meta.origen === 'archivo'
    ? `📎 ${esc(meta.nombre || 'Audio adjunto')}`
    : `🎧 Audio de la sesión${meta.duracionMs ? ` · ${fmtTiempo(meta.duracionMs)}` : ''}`;
  const enFase5 = state.currentPhase === 5;
  const fase5Visitada = state.maxVisitedIdx >= 5;
  m.innerHTML = `
    <div class="grab-menu-titulo">${etiqueta}</div>
    <div class="grab-menu-dato">${fmtMB(_audio.blob.size)}${_audio.recuperado ? ' · recuperado' : ''}</div>
    ${_corte ? '<div class="grab-menu-aviso">⚠ La grabación se cortó porque el sistema dejó de dar audio (llamada, bloqueo de pantalla u otra app). Se ha guardado lo grabado hasta ese momento.</div>' : ''}
    <div class="grab-menu-nota">${enFase5 ? 'Está en la tarjeta «Informe narrativo», al final de esta fase.' : 'Se usará en el informe narrativo de la fase 5.'}</div>
    <div class="grab-menu-acciones">
      ${fase5Visitada ? '<button class="phase5-copy-btn" onclick="grabIrAlInforme()">Ir al informe →</button>' : ''}
      <button class="phase5-copy-btn" onclick="grabDeNuevo()">● Grabar de nuevo</button>
      <button class="phase5-copy-btn ia-btn-descartar" onclick="grabQuitar()">Quitar</button>
    </div>`;
}

function grabPausar() { pausar(); }
function grabReanudar() { reanudar(); }
function grabParar() { cerrarMenu(); parar(); }

function grabDescartar() {
  cerrarMenu();
  showConfirmBanner('Descartar grabación', 'Se borrará el audio grabado hasta ahora.', 'Descartar', () => {
    if (!_grab) return;
    _grab.descartar = true;
    try { _grab.rec.stop(); } catch {}
  });
}

function grabDeNuevo() {
  cerrarMenu();
  showConfirmBanner('Grabar de nuevo', 'Se borrará el audio actual de la sesión y empezará una grabación nueva.', 'Grabar', () => grabar());
}

function grabQuitar() {
  cerrarMenu();
  showConfirmBanner('Quitar audio', 'Se borrará el audio de la sesión. El informe narrativo podrá generarse solo con los datos de la valoración.', 'Quitar', quitarAudio);
}

function grabIrAlInforme() {
  cerrarMenu();
  if (state.currentPhase !== 5) { window.buildResults?.(); window.goToPhase?.(5); }
  setTimeout(() => $('informeIA')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

// Exposed for inline onclick attributes (index.html's #grabBtn and the menu HTML above).
Object.assign(window, {
  grabBtnClick, grabPausar, grabReanudar, grabParar, grabDescartar, grabDeNuevo, grabQuitar, grabIrAlInforme,
});
