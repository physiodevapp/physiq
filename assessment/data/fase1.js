// ============================================================
// PhysiQ-Assessment · data/fase1.js
// Banderas rojas y riesgo psicosocial de la fase 1: una sola fuente para la
// app (app.js; index.html lleva los mismos textos, y un test lo comprueba),
// la hoja impresa de la fase 1 (docs/esquemas/hojas.mjs) y su página en la
// guía de consulta (guia.js). Los textos son los de la app, sin cambios.
// ============================================================

// Banderas rojas generales (fase 1): las de cada sistema van en el cribado de la fase 2
export const BANDERAS_FASE1 = [
  { id: 'br1', texto: 'Sudor nocturno / Pérdida de peso inexplicada' },
  { id: 'br2', texto: 'Trauma mayor reciente' },
  { id: 'br3', texto: 'Déficit neurológico progresivo' },
  { id: 'br4', texto: 'Dolor no mecánico (no cambia con postura ni movimiento)' },
];

export const TEXTOS_FASE1 = {
  banderasAviso: 'Marque SI si el paciente presenta cualquiera de los siguientes signos. La presencia de una bandera roja no exige derivación inmediata excepto emergencias claras — interpretar en contexto clínico.',
  banderaAlerta: 'Bandera Roja Detectada. Se recomienda watchful waiting y/o derivación médica. Puede continuar la evaluación manteniendo monitorización estrecha.',
  psicoIntro: 'Estratifique según su valoración clínica inicial (Örebro)',
  psicoAlto: 'Riesgo alto detectado. Dedique 2 minutos a clarificar con preguntas abiertas y valore cuestionario unidimensional específico.',
  // Riesgo psicosocial: solo herramientas validadas en castellano de España (decisión del
  // usuario, 2026-10; docs/cuestionarios.md). El Örebro de 21 ítems sí (Cuesta-Vargas 2014).
  herramienta: 'Herramienta recomendada: <strong>Örebro (OMPSQ, 21 ítems)</strong> — validada en castellano de España para dolor musculoesquelético de cualquier región (Cuesta-Vargas 2014).',
  sugeridos: 'Cuestionarios unidimensionales sugeridos:',
};

export const NIVELES_PSICO = [
  { valor: 'Bajo', emoji: '🟢' },
  { valor: 'Medio', emoji: '🟠' },
  { valor: 'Alto', emoji: '🔴' },
];

// Con riesgo alto, tres preguntas (Sí / No / Dudoso); un «Sí» o «Dudoso» sugiere sus cuestionarios
export const RESPUESTAS_PSICO = ['Sí', 'No', 'Dudoso'];
export const PREGUNTAS_PSICO = [
  { id: 'psico_miedo', texto: '¿El paciente muestra miedo al movimiento o catastrofización?', cuestionarios: 'FABQ (Cuestionario de Creencias de Miedo-Evitación), TSK-11 (Escala de Kinesiofobia de Tampa), PCS (Escala de Catastrofización del Dolor)' },
  { id: 'psico_autoef', texto: '¿Hay signos de baja autoeficacia o desesperanza?', cuestionarios: 'CADC (Cuestionario de Autoeficacia en Dolor Crónico)' },
  { id: 'psico_emocional', texto: '¿Detecta componente emocional significativo (ansiedad, depresión)?', cuestionarios: 'PHQ-2 → PHQ-9 (Cuestionario de Salud del Paciente)' },
];
