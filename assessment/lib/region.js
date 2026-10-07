// ============================================================
// PhysiQ-Assessment · lib/region.js
// Lado afectado con la concordancia de la región: «Rodilla (izquierda)»,
// «Hombro (izquierdo)». Lo usan app.js (fase 5, 📋 Notas, 📄 Informe) y
// lib/informe-narrativo.js (prompt y cabecera del informe con IA). Puro.
// ============================================================

// Regiones de género femenino: cadera, rodilla y la columna (cervical, lumbar).
const FEMENINAS = ['cadera', 'rodilla', 'cervical', 'lumbar'];

// 'Derecho' | 'Izquierdo' | 'Bilateral' | 'Central' → en minúscula y concordado
export function ladoTexto(region, lado) {
  const l = String(lado || '').toLowerCase();
  return FEMENINAS.includes(region) ? l.replace(/^(derech|izquierd)o$/, '$1a') : l;
}
