// ============================================================
// PhysiQ-Assessment · lib/resumenes.js
// Los dos resúmenes de texto de la fase 5, a partir del payload
// (buildPhysiQPayload, app.js): 📋 Notas (textoNotas) y 📄 Informe para el
// paciente / su médico (textoInformePaciente). Mismos datos, distinto lector:
// ver CLAUDE.md, «Two different summaries». Puro: sin DOM ni estado.
// ============================================================

import { regionConLado } from './region.js';
import { cqConProtocolo, fechaSemanasTexto, TEXTO_SIN_PROTOCOLO } from './posquirurgico.js';
import { lineaNotasSintomas, lineasInformeSintomas } from './sintomas.js';

// Línea fija de transparencia del modo breve: fase 5, 📋 Notas y 📄 Informe.
// Nunca se omite en breve (docs/modo-breve.md, decisión 3).
export const TEXTO_VALORACION_BREVE = 'Valoración inicial breve: cribado sistémico por sistemas y confirmación diagnóstica no exhaustivos; se completa en próximas sesiones.';

// 📋 Notas: una línea con todo lo de la tarjeta «Cirugía».
function _lineaCirugiaNotas(cq) {
  const partes = [cq.iv || 'intervención sin detallar', fechaSemanasTexto(cq),
    cq.pr ? `Protocolo: ${cq.pr.toLowerCase()}` : '', cq.re ? `Restricciones: ${cq.re}` : '',
    cq.co.length ? `Complicaciones: ${cq.co.join(', ')}` : ''].filter(Boolean);
  if (!cqConProtocolo(cq)) partes.push(TEXTO_SIN_PROTOCOLO);
  return `🏥 CIRUGÍA: ${partes.join(' · ')}`;
}

export function textoNotas(d) {
  const hyps = (d.h || []).map(h => `  · ${h.name} — ${h.sc}`).join('\n');
  const breve = d.md === 'breve'
    ? `\n⏱ ${TEXTO_VALORACION_BREVE}${d.pe?.length ? `\nPendiente:\n${d.pe.map(x => `  · ${x}`).join('\n')}` : ''}`
    : '';
  return `VALORACIÓN PhysiQ-Assessment${d.p ? `\nPaciente: ${d.p}` : ''}${breve}
Región: ${regionConLado(d.r, d.la)} · NRS: ${d.nr != null ? `${d.nr}/10` : 'no registrado'} · Irritabilidad: ${d.ir}${lineaNotasSintomas(d) ? `\n${lineaNotasSintomas(d)}` : ''}${d.cq ? `\n${_lineaCirugiaNotas(d.cq)}` : ''}
Cribado sistémico: ${d.si ? 'POSITIVO ⚠️' : 'Negativo'}${d.ur?.length ? `\n🚨 DERIVACIÓN URGENTE: ${d.ur.join(' · ')}` : ''}${d.dv?.length ? `\n🩺 DERIVACIÓN MÉDICA (árbol CIF): ${d.dv.join(' · ')}` : ''}
Hipótesis:
${hyps}${d.fp?.length ? `\nFormulario previo:\n${d.fp.map(x => `  · ${x.q} → ${x.a}`).join('\n')}` : ''}
Variable control: ${d.pn?.variableControl || '—'}
Ventana recuperación: ${d.pn?.ventanaRecuperacion || '—'}
Anclaje hábito: ${d.pn?.anclajeHabito || '—'}`;
}

// Same underlying data as textoNotas(), but reworded for a
// different audience: the patient and their GP, not the clinician's own
// shorthand (no NRS/LR jargon, no scoring labels or emoji) — meant to be
// pasted straight into a letterhead template and handed over as-is.
export function textoInformePaciente(d, fpInf = { historia: [], antecedentes: [] }) {
  const region = regionConLado(d.r, d.la);

  const hyps = [...d.h].sort((a, b) => (b.pq ? 1 : 0) - (a.pq ? 1 : 0) || (b.lr ?? 1) - (a.lr ?? 1));
  const breve = d.md === 'breve';
  const sinConfirmar = breve && hyps.some(h => !h.pq && !h.dt && !Object.values(h.tr || {}).some(r => r === 'pos' || r === 'neg'));
  const impresion = hyps.length
    ? hyps.map(h => `  · ${h.name}${h.dt ? (d.cq ? ' (intervenida quirúrgicamente)' : ' (diagnosticada y tratada)') : ''}`).join('\n')
    : '  · Pendiente de completar la valoración diagnóstica.';

  const seguridad = d.br.length
    ? `Se han detectado los siguientes signos que recomendamos comentar con su médico de cabecera:\n${d.br.map(b => `  · ${b}`).join('\n')}`
    : 'No se han detectado signos de alarma (banderas rojas) en el cribado realizado.';
  const sistemico = d.sq.length
    ? `\n\nAdemás, durante el cribado el paciente refirió:\n${d.sq.map(s => `  · ${s}`).join('\n')}`
    : '';
  const derivacion = d.dv?.length
    ? `\n\nSe recomienda valoración médica:\n${d.dv.map(m => `  · ${m}`).join('\n')}`
    : '';

  // Paciente posquirúrgico: antecedente y plan supeditado al protocolo
  const cq = d.cq;
  const antecedenteQx = cq
    ? `\n\nANTECEDENTE QUIRÚRGICO\n  · Intervención: ${cq.iv || '—'}${fechaSemanasTexto(cq) ? `\n  · Fecha: ${fechaSemanasTexto(cq)}` : ''}${cq.co.length ? `\n  · Complicaciones: ${cq.co.join(', ')}` : ''}`
    : '';
  const planQx = !cq ? ''
    : cqConProtocolo(cq)
      ? `\n  · El tratamiento sigue el protocolo y las restricciones indicadas por el cirujano${cq.re ? `: ${cq.re}` : '.'}`
      : `\n  · ${TEXTO_SIN_PROTOCOLO}.${cq.re ? ` Restricciones referidas: ${cq.re}` : ''}`;

  // `fpInf`: solo lo marcado con `informe` en formularios/*.js (informeFormularioPrevio,
  // formulario.js) — nunca el formulario entero
  const bloqueFp = (titulo, lista) => lista.length
    ? `\n\n${titulo}\n${lista.map(x => `  · ${x.q}: ${x.a}`).join('\n')}`
    : '';

  return `INFORME DE FISIOTERAPIA${d.p ? `\nPaciente: ${d.p}` : ''}
Fecha: ${d.d}
Región valorada: ${region}${breve ? `\n\n${TEXTO_VALORACION_BREVE}` : ''}

MOTIVO DE CONSULTA
${d.mo || '—'}
Mecanismo de inicio: ${d.me || '—'} · Evolución: ${d.cr || '—'}${antecedenteQx}${bloqueFp('SEGÚN REFIERE EL PACIENTE', fpInf.historia)}${bloqueFp('ANTECEDENTES REFERIDOS POR EL PACIENTE', fpInf.antecedentes)}

VALORACIÓN
${lineasInformeSintomas(d).map(l => `${l}\n`).join('')}${d.nr != null ? `Intensidad del dolor referida: ${d.nr}/10\n` : ''}Irritabilidad del cuadro: ${d.ir || '—'}
Naturaleza del dolor: ${d.na || '—'}
Riesgo psicosocial: ${d.rp || '—'}

CRIBADO DE SEGURIDAD
${seguridad}${sistemico}${derivacion}

IMPRESIÓN CLÍNICA${sinConfirmar ? ' (hipótesis de trabajo, pendiente de confirmar)' : ''}
${impresion}

PLAN DE TRATAMIENTO Y RECOMENDACIONES${planQx}
  · Señal para detener el ejercicio: ${d.pn?.variableControl || '—'}
  · Evolución esperada a las 24h: ${d.pn?.ventanaRecuperacion || '—'}
  · Cómo incorporarlo a la rutina: ${d.pn?.anclajeHabito || '—'}

—
Informe generado con PhysiQ-Assessment el ${d.d}.`;
}
