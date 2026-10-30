// Nivel de irritabilidad de la matriz de la fase 3 (decisiones 99–101 de
// docs/plan-tratamiento.md). Puro: lo usan la fase 3 (calcIrritabilidad,
// app.js) y la fase 6 (irritabilidadSINSS, lib/plan-tratamiento.js), así que
// las dos fases dan el mismo nivel.
//
// Regla (decisión 100, del usuario; ninguna fuente combina los ítems así):
//  · el tiempo en calmarse marca el suelo: minutos → baja, horas → moderada,
//    día siguiente → alta (Maitland 2005, cap. 6, p. 117; Petersen 2021);
//  · reposo + movimiento + tolerancia (0–2 cada uno) solo pueden subirlo, con
//    los cortes de la decisión 25: 0–1 baja, 2–4 moderada, 5–6 alta;
//  · nivel = el más alto de los dos. Se calcula con lo contestado; sin nada,
//    null («no registrada»). `incompleta` = falta alguna fila (puede quedarse
//    corto); `sinCalma` = falta justo el tiempo en calmarse.
// El dolor y la discapacidad de las sesiones antiguas (gravedad) no cuentan.
import { ITEMS_IRRITABILIDAD, CORTES_OTROS } from '../data/irritabilidad.js';

export const NIVELES = ['baja', 'moderada', 'alta'];
export const NOMBRE_NIVEL = { baja: 'Baja', moderada: 'Moderada', alta: 'Alta' };

const indice = (irr, clave) => {
  const item = ITEMS_IRRITABILIDAD.find(i => i.clave === clave);
  return item ? item.opciones.findIndex(o => o.valor === irr?.[clave]) : -1;
};

// Una matriz sin contestar, conservando el impacto en las actividades si se
// pasa (es gravedad: no es de P1 ni del P2 que pasa a ser principal).
export function matrizVacia(discapacidad = '') {
  return { ...Object.fromEntries(ITEMS_IRRITABILIDAD.map(i => [i.clave, ''])), discapacidad };
}

export function nivelMatriz(irr = {}) {
  const calma = indice(irr, 'calma');
  const otros = ['reposo', 'movimiento', 'tolerancia'].map(k => indice(irr, k)).filter(i => i >= 0);
  if (calma < 0 && !otros.length) return { nivel: null, incompleta: true, sinCalma: true };
  const suma = otros.reduce((a, b) => a + b, 0);
  const porOtros = !otros.length ? -1 : suma <= CORTES_OTROS.bajaHasta ? 0 : suma <= CORTES_OTROS.moderadaHasta ? 1 : 2;
  return {
    nivel: NIVELES[Math.max(calma, porOtros)],
    incompleta: calma < 0 || otros.length < 3,
    sinCalma: calma < 0,
  };
}

// La regla en tres frases (HTML con <b>), la misma en la guía de consulta (pestaña
// Irritabilidad) y en su hoja impresa (docs/esquemas/hojas.mjs).
export function reglaIrritabilidad() {
  const c = CORTES_OTROS;
  return [
    'El <b>tiempo en calmarse</b> marca el suelo: minutos → baja, horas → moderada, día siguiente → alta (Maitland 2005, cap. 6, p. 117; Petersen 2021).',
    `<b>Reposo + movimiento + tolerancia</b> (0–2 cada uno, el número de cada opción) solo pueden subirlo: 0–${c.bajaHasta} baja, ${c.bajaHasta + 1}–${c.moderadaHasta} moderada, ${c.moderadaHasta + 1}–6 alta (criterio propio de PhysiQ, inclinado a lo prudente; no hay cortes publicados).`,
    'El nivel es el más alto de los dos. Se calcula con lo contestado y avisa si falta alguna fila, porque quedarse corto es el error peligroso. El impacto en las actividades es gravedad y no cuenta aquí.',
  ];
}
