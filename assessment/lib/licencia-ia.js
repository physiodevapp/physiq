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
async function consultarModo(clave) {
  const res = await fetch(ORCHESTRATOR_URL + '/validate', { headers: clave ? { 'X-License-Key': clave } : {} });
  const j = await res.json().catch(() => ({}));
  const modo = j.routes?.report || res.headers.get('X-PhysiQ-Mode') || 'demo';
  if (modo === 'real') return 'real';
  return j.demoOnly ? 'desactivado' : 'sin-licencia';
}

// Primera llamada: consulta. Las siguientes reutilizan la respuesta, salvo
// `forzar` (botón «Reintentar»).
export function comprobarLicencia(forzar = false) {
  if (_promesa && !forzar) return _promesa;
  fijar('comprobando');
  _promesa = consultarModo(claveGuardada())
    .catch(() => 'error-red')
    .then(estado => { fijar(estado); return estado; });
  return _promesa;
}

// Clave escrita en la tarjeta. Solo se guarda si el worker la da por buena:
// una clave mala no debe pisar la que el hub tenga guardada en este navegador.
// → 'real' | 'sin-licencia' | 'desactivado' (lanza si no hay red)
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
