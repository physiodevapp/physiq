// ============================================================
// PhysiQ-Assessment · lib/paquete-revision.js
// «⬇ Paquete de revisión» de la tarjeta del informe con IA: un .zip con todo
// lo que hace falta para revisar un informe generado (el informe, la
// transcripción, los puntos a revisar, la valoración exportada, el prompt que
// se envió y los datos de versión), con los mismos nombres que
// tests/fixtures/informes para que entre ahí casi sin renombrar.
// Pura: recibe los textos ya hechos y devuelve la lista de ficheros; el zip
// (lib/zip.js) y la descarga los hace informe-ia.js.
// ============================================================

import { slugPaciente, fechaArchivo, exportarValoracion } from './valoracion-json.js';
import { clavePunto as clavePuntoInf, claveComprobacion as claveComprobacionInf } from './revision-informe.js';
import { clavePuntoPlan, claveComprobacionPlan } from './revision-plan.js';

// `audio` del nombre de los ficheros: como en tests/fixtures/informes
const tipoAudio = inf => !inf.conAudio ? 'sin-audio' : inf.dictado ? 'dictado' : 'audio';

export function nombrePaquete(paciente, ahora = new Date()) {
  return `revision-informe-${slugPaciente(paciente)}-${fechaArchivo(ahora)}.zip`;
}

// Puntos y comprobaciones en el mismo formato que tools/revisar-informe.mjs.
// `claves`: las del plan detallado con IA (paquete del plan); por defecto, las del informe
export function textoRevision(puntos = [], comprobaciones = [], revisados = [], { clavePunto = clavePuntoInf, claveComprobacion = claveComprobacionInf } = {}) {
  const hechos = new Set(revisados || []);
  const marca = clave => hechos.has(clave) ? ' [revisado]' : '';
  const altos = puntos.filter(p => p.nivel === 'alto').length;
  const nRev = puntos.filter(p => hechos.has(clavePunto(p))).length;
  const lineas = [puntos.length
    ? `PUNTOS A REVISAR (comprobaciones automáticas): ${puntos.length}${altos ? `, ${altos} de nivel alto` : ''}; marcados como revisados: ${nRev}`
    : 'PUNTOS A REVISAR (comprobaciones automáticas): sin incidencias', ''];
  for (const p of puntos) {
    lineas.push(`[${p.nivel.toUpperCase()}] ${p.id}: ${p.mensaje}${marca(clavePunto(p))}`);
    if (p.cita) lineas.push(`   «${p.cita}»`);
    lineas.push('');
  }
  if (comprobaciones.length) {
    lineas.push('ANTES DE COMPARTIR, COMPRUEBA', ...comprobaciones.map(c => `- ${c}${marca(claveComprobacion(c))}`), '');
  }
  return lineas.join('\n');
}

// { inf: state.informeIA, informe: texto con cabecera y pie, state, puntos,
//   comprobaciones, nombrePlantilla, versionActual, cambiado, ahora }
// → { nombre: <.zip>, ficheros: [{ nombre, texto }] }
export function ficherosPaquete({ inf, informe, state, puntos = [], comprobaciones = [], nombrePlantilla = '', versionActual = 'dev', cambiado = false, ahora = new Date() }) {
  const slug = slugPaciente(state?.patient);
  const tipo = tipoAudio(inf);
  const plantilla = inf.plantilla || 'narrativo';
  const nValoracion = `valoracion-${slug}.json`;
  const nInforme = `${slug}-${tipo}-${plantilla === 'breve' ? 'ficha-breve' : 'informe'}.txt`;
  const conTranscripcion = inf.conAudio && !!inf.transcripcion;
  const nTranscripcion = `${slug}-${tipo}-transcripcion.txt`;
  // La valoración, igual que «⬇ Exportar» (se importa igual), pero con nombre
  // fijo para que los comandos de info.txt funcionen tal cual
  const valoracion = exportarValoracion(state, ahora);

  const fecha = inf.fecha ? new Date(inf.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  const palabras = (String(inf.texto || '').replace(/[#|*-]/g, ' ').match(/\S+/g) || []).length;
  const altos = puntos.filter(p => p.nivel === 'alto').length;
  const info = [
    'Paquete de revisión del informe con IA · PhysiQ-Assessment',
    '',
    `Informe generado: ${fecha}, con la versión ${inf.version || 'no registrada (informe anterior al paquete de revisión)'}`,
    `Paquete descargado: ${ahora.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}, con la versión ${versionActual}`,
    `Plantilla: ${nombrePlantilla || plantilla}`,
    `Audio: ${!inf.conAudio ? 'sin audio' : inf.dictado ? 'dictado del fisioterapeuta' : 'consulta (diálogo)'}`,
    `Palabras: ${palabras}`,
    `Revisión automática: ${puntos.length ? `${puntos.length} ${puntos.length === 1 ? 'punto' : 'puntos'}${altos ? ` (${altos} de nivel alto)` : ''}` : 'sin incidencias'}`,
    `Valoración: ${cambiado ? 'ha cambiado desde que se generó el informe (el .json es la de ahora; los puntos se calculan con ella)' : 'la misma con la que se generó el informe'}`,
    `Prompt: ${inf.prompt ? 'el exacto que se envió (prompt.txt)' : 'no guardado (informe anterior al paquete de revisión): reconstrúyelo con tools/prompt-desde-json.mjs'}`,
    '',
    'Para reproducirlo en el repositorio:',
    `  node tools/revisar-informe.mjs ${nValoracion} ${nInforme} ${plantilla}${conTranscripcion ? ` --transcripcion ${nTranscripcion}` : ''}`,
    `  node tools/prompt-desde-json.mjs ${nValoracion} ${plantilla}${inf.conAudio ? (inf.dictado ? ' --dictado' : ' --audio') : ''}`,
    '',
    'Contiene datos clínicos y el nombre del paciente.',
    '',
  ].join('\n');

  const ficheros = [
    { nombre: 'info.txt', texto: info },
    { nombre: nInforme, texto: informe.endsWith('\n') ? informe : informe + '\n' },
    ...(conTranscripcion ? [{ nombre: nTranscripcion, texto: inf.transcripcion.trim() + '\n' }] : []),
    { nombre: 'revision.txt', texto: textoRevision(puntos, comprobaciones, inf.revisados) },
    { nombre: nValoracion, texto: JSON.stringify(valoracion, null, 2) + '\n' },
    ...(inf.prompt ? [{ nombre: 'prompt.txt', texto: inf.prompt }] : []),
  ];
  return { nombre: nombrePaquete(state?.patient, ahora), ficheros };
}

// ── Paquete del plan detallado con IA (fase 6, plan-ia.js) ──────────────────
// Lo mismo para revisar un plan: el plan tal como se generó (markdown, el que
// irá a tests/fixtures/planes/), el programa para casa como lo recibe el
// paciente, los puntos de revisión del plan, la valoración y el prompt (que ya
// lleva la transcripción, si se usó).
export function nombrePaquetePlan(paciente, ahora = new Date()) {
  return `revision-plan-${slugPaciente(paciente)}-${fechaArchivo(ahora)}.zip`;
}

// { ia: state.planTratamiento.ia, casa: textoCasaIA(), state, puntos,
//   comprobaciones, versionActual, cambiado, ahora } → { nombre, ficheros }
export function ficherosPaquetePlan({ ia, casa = '', state, puntos = [], comprobaciones = [], versionActual = 'dev', cambiado = false, ahora = new Date() }) {
  const slug = slugPaciente(state?.patient);
  const fecha = ia.fecha ? new Date(ia.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  const palabras = (String(ia.texto || '').replace(/[#|*-]/g, ' ').match(/\S+/g) || []).length;
  const altos = puntos.filter(p => p.nivel === 'alto').length;
  const info = [
    'Paquete de revisión del plan detallado con IA · PhysiQ-Assessment',
    '',
    `Plan generado: ${fecha}, con la versión ${ia.version || 'no registrada'}`,
    `Paquete descargado: ${ahora.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}, con la versión ${versionActual}`,
    `Nivel: ${ia.nivel || '—'}${ia.escalon ? ` (${ia.escalon})` : ''} · ${ia.frecuenciaNombre || ia.frecuencia || '—'}`,
    `Transcripción del informe con IA: ${ia.conTranscripcion ? 'sí (va dentro de prompt.txt)' : 'no'}`,
    `Palabras: ${palabras}`,
    `Revisión automática: ${puntos.length ? `${puntos.length} ${puntos.length === 1 ? 'punto' : 'puntos'}${altos ? ` (${altos} de nivel alto)` : ''}` : 'sin incidencias'}`,
    `Valoración y plan: ${cambiado ? 'han cambiado desde que se detalló (el .json es el de ahora; los puntos se calculan con él)' : 'los mismos con los que se detalló'}`,
    `Prompt: ${ia.prompt ? 'el exacto que se envió (prompt.txt)' : 'no guardado'}`,
    '',
    'Contiene datos clínicos y el nombre del paciente.',
    '',
  ].join('\n');
  const fin = t => (t.endsWith('\n') ? t : t + '\n');
  const ficheros = [
    { nombre: 'info.txt', texto: info },
    { nombre: `${slug}-plan-ia.txt`, texto: fin(String(ia.texto || '')) },
    ...(casa ? [{ nombre: `${slug}-programa-casa-ia.txt`, texto: fin(casa) }] : []),
    { nombre: 'revision.txt', texto: textoRevision(puntos, comprobaciones, ia.revisados, { clavePunto: clavePuntoPlan, claveComprobacion: claveComprobacionPlan }) },
    { nombre: `valoracion-${slug}.json`, texto: JSON.stringify(exportarValoracion(state, ahora), null, 2) + '\n' },
    ...(ia.prompt ? [{ nombre: 'prompt.txt', texto: ia.prompt }] : []),
  ];
  return { nombre: nombrePaquetePlan(state?.patient, ahora), ficheros };
}
