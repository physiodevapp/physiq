// ============================================================
// PhysiQ-Assessment · lib/valoracion-json.js
// Exportar / importar una valoración completa como archivo .json (panel de
// sesión). Pensado para repetir pruebas con los mismos datos — p. ej.
// regenerar el informe narrativo tras cambiar el prompt —, no como copia de
// seguridad clínica. Funciones puras: sin DOM ni estado; las usa app.js y las
// prueba tests/unit.js.
//
// El archivo lleva el estado entero (fases 1–5, formulario previo, árbol,
// tests, notas del plan, modo), nombre del paciente incluido. No lleva el
// informe con IA ya generado (se trata de poder regenerarlo) ni el audio.
// Importar = guardar ese estado como sesión y recargar: la restauración la
// hace el mismo código que al abrir la app (readSession → _restoreSessionDOM).
// ============================================================

export const APP_ID = 'physiq-assessment';
export const TIPO = 'valoracion';
export const VERSION = 1;

const FASES = [1, 2, 3, 4, '4b', 5];

// → objeto listo para JSON.stringify
export function exportarValoracion(state, ahora = new Date()) {
  const { informeIA, ...resto } = state || {};
  return {
    app: APP_ID,
    tipo: TIPO,
    version: VERSION,
    exportado: ahora.toISOString(),
    assessmentState: JSON.parse(JSON.stringify(resto)),
  };
}

// Nombre del paciente para un nombre de archivo: sin acentos ni símbolos
export function slugPaciente(paciente) {
  return String(paciente || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'sin-nombre';
}

export const fechaArchivo = ahora => `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;

// valoracion-<paciente>-<AAAA-MM-DD>.json
export function nombreArchivo(paciente, ahora = new Date()) {
  return `valoracion-${slugPaciente(paciente)}-${fechaArchivo(ahora)}.json`;
}

// Hay algo que exportar: la restauración solo se dispara pasada la fase 1.
export const hayValoracion = state => (state?.maxVisitedIdx || 0) > 0;

// Texto del archivo → { ok: true, assessmentState, paciente, exportado } | { ok: false, error }
export function leerImportacion(texto, regionesValidas = []) {
  let obj;
  try { obj = JSON.parse(texto); } catch { return { ok: false, error: 'El archivo no es un JSON válido.' }; }
  if (!obj || typeof obj !== 'object' || obj.app !== APP_ID || obj.tipo !== TIPO)
    return { ok: false, error: 'El archivo no es una valoración exportada de PhysiQ-Assessment.' };
  if (typeof obj.version !== 'number' || obj.version > VERSION)
    return { ok: false, error: 'El archivo es de una versión más nueva de la app. Actualízala e inténtalo de nuevo.' };
  const s = obj.assessmentState;
  if (!s || typeof s !== 'object' || Array.isArray(s))
    return { ok: false, error: 'El archivo no contiene los datos de la valoración.' };
  if (!(Number.isInteger(s.maxVisitedIdx) && s.maxVisitedIdx > 0 && s.maxVisitedIdx < FASES.length))
    return { ok: false, error: 'La valoración del archivo no pasó de la fase 1: no hay nada que restaurar.' };
  if (!FASES.includes(s.currentPhase))
    return { ok: false, error: 'La fase guardada en el archivo no es válida.' };
  if (s.region && regionesValidas.length && !regionesValidas.includes(s.region))
    return { ok: false, error: `La región del archivo («${s.region}») no existe en esta versión de la app.` };
  const { informeIA, ...assessmentState } = s;
  return { ok: true, assessmentState, paciente: String(s.patient || ''), exportado: obj.exportado || '' };
}
