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
import { clavePunto, claveComprobacion } from './revision-informe.js';

// `audio` del nombre de los ficheros: como en tests/fixtures/informes
const tipoAudio = inf => !inf.conAudio ? 'sin-audio' : inf.dictado ? 'dictado' : 'audio';

export function nombrePaquete(paciente, ahora = new Date()) {
  return `revision-informe-${slugPaciente(paciente)}-${fechaArchivo(ahora)}.zip`;
}

// Puntos y comprobaciones en el mismo formato que tools/revisar-informe.mjs
export function textoRevision(puntos = [], comprobaciones = [], revisados = []) {
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
