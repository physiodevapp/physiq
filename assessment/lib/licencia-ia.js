// ============================================================
// PhysiQ-Assessment · lib/licencia-ia.js
// Licencia del informe narrativo con IA (solo standalone)
// ============================================================
//
// Una sola comprobación por carga, compartida por la grabadora de la cabecera
// (grabadora.js) y la tarjeta de la fase 5 (informe-ia.js). El modo lo decide
// el worker con GET /validate, nunca este cliente: aquí solo se guarda lo que
// contestó y se avisa a quien escuche.
//
// Estados: 'comprobando' | 'real' | 'sin-licencia' | 'desactivado' | 'error-red'.
// `body.ia-licencia` refleja 'real' para el CSS (el botón 🎙 de la cabecera).

import { ORCHESTRATOR_URL, LICENSE_KEY_STORAGE } from './informe-narrativo.js';

let _estado = 'comprobando';
let _promesa = null;
const _oyentes = new Set();

export const estadoLicencia = () => _estado;

export function onLicencia(fn) {
  _oyentes.add(fn);
  return () => _oyentes.delete(fn);
}

function fijar(estado) {
  _estado = estado;
  document.body.classList.toggle('ia-licencia', estado === 'real');
  _oyentes.forEach(fn => { try { fn(estado); } catch {} });
}

export function claveGuardada() {
  try { return localStorage.getItem(LICENSE_KEY_STORAGE) || ''; } catch { return ''; }
}

// GET /validate → { routes: { report: 'real'|'demo' }, demoOnly }. Lo que
// importa es la ruta de informes; si el email está en demo, da igual aquí.
// Si no hay respuesta legible lanza un Error con `motivo` (ver diagnosticar()).
const TIMEOUT_MS = 10000;

async function consultarModo(clave) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(ORCHESTRATOR_URL + '/validate', {
      headers: clave ? { 'X-License-Key': clave } : {},
      signal: ctrl.signal,
    });
  } catch (e) {
    throw await diagnosticar(e);
  } finally {
    clearTimeout(timer);
  }
  // Una respuesta de error (429 por el límite, 5xx) no dice nada de la
  // licencia: antes se leía como «sin licencia», que confundía.
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.motivo = res.status === 429
      ? 'Demasiadas comprobaciones seguidas; espera un minuto y reintenta.'
      : `El servidor de PhysiQ respondió con un error (${res.status}).`;
    throw err;
  }
  const j = await res.json().catch(() => ({}));
  const modo = j.routes?.report || res.headers.get('X-PhysiQ-Mode') || 'demo';
  if (modo === 'real') return 'real';
  return j.demoOnly ? 'desactivado' : 'sin-licencia';
}

// fetch() rechaza igual sin red, con un bloqueador o si el worker falla sin
// cabeceras CORS (p. ej. un 500 sin capturar): el navegador no deja leer la
// diferencia. Una segunda petición en modo no-cors sí la distingue: si llega
// al servidor (respuesta opaca), el problema es la respuesta del servidor, no
// la conexión. No lleva la clave: solo comprueba que el worker es alcanzable.
async function diagnosticar(e) {
  const err = new Error(e?.message || 'fetch falló');
  if (e?.name === 'AbortError') {
    err.motivo = 'El servidor de PhysiQ no respondió a tiempo.';
    return err;
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    err.motivo = 'Este dispositivo no tiene conexión.';
    return err;
  }
  try {
    await fetch(ORCHESTRATOR_URL + '/validate', { mode: 'no-cors' });
    err.motivo = 'El servidor de PhysiQ responde, pero con un error al comprobar la clave. Avisa al administrador de PhysiQ.';
  } catch {
    err.motivo = 'No se puede conectar con el servidor de PhysiQ. Puede bloquearlo un bloqueador de anuncios, un filtro de la red o la falta de conexión.';
  }
  return err;
}

let _detalle = '';
// Motivo legible del último 'error-red', para mostrarlo en la tarjeta.
export const detalleLicencia = () => _detalle;

const espera = ms => new Promise(r => setTimeout(r, ms));

// Primera llamada: consulta. Las siguientes reutilizan la respuesta, salvo
// `forzar` (botón «Reintentar»). Un fallo de red se reintenta una vez solo
// antes de mostrar el aviso: un corte de un segundo al abrir la app no
// merece un mensaje de error.
export function comprobarLicencia(forzar = false) {
  if (_promesa && !forzar) return _promesa;
  fijar('comprobando');
  _promesa = (async () => {
    const clave = claveGuardada();
    try {
      return await consultarModo(clave);
    } catch {
      await espera(1500);
      try {
        return await consultarModo(clave);
      } catch (e) {
        _detalle = e.motivo || 'Error desconocido.';
        return 'error-red';
      }
    }
  })().then(estado => { fijar(estado); return estado; });
  return _promesa;
}

// Clave escrita en la tarjeta. Solo se guarda si el worker la da por buena:
// una clave mala no debe pisar la que el hub tenga guardada en este navegador.
// → 'real' | 'sin-licencia' | 'desactivado' (lanza con `motivo` si no hay respuesta)
export async function probarClave(clave) {
  const estado = await consultarModo(clave);
  if (estado === 'real') {
    try { localStorage.setItem(LICENSE_KEY_STORAGE, clave); } catch {}
    _promesa = Promise.resolve('real');
    fijar('real');
  }
  return estado;
}

// Una respuesta de generación llegó en modo demo (licencia revocada, kill
// switch…): a partir de aquí, como si /validate hubiera dicho que no.
export function marcarSinLicencia() {
  _promesa = Promise.resolve('sin-licencia');
  fijar('sin-licencia');
}
