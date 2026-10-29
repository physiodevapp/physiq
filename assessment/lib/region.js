// ============================================================
// PhysiQ-Assessment · lib/region.js
// Nombre de la región y lado afectado con su concordancia: «Rodilla
// (izquierda)», «Hombro (izquierdo)». Lo usan app.js (fase 5), lib/resumenes.js
// (📋 Notas, 📄 Informe) y lib/informe-narrativo.js (prompt y cabecera del
// informe con IA). Puro.
// ============================================================

// Regiones de género femenino: cadera, rodilla y la columna (cervical, lumbar).
const FEMENINAS = ['cadera', 'rodilla', 'cervical', 'lumbar'];

// 'Derecho' | 'Izquierdo' | 'Bilateral' | 'Central' → en minúscula y concordado
export function ladoTexto(region, lado) {
  const l = String(lado || '').toLowerCase();
  return FEMENINAS.includes(region) ? l.replace(/^(derech|izquierd)o$/, '$1a') : l;
}

// Region key → display name: 'tobillo_pie' → 'Tobillo y pie', 'lumbar' → 'Lumbar'.
export function nombreRegion(r) {
  const n = r.replace(/_/g, ' y ');
  return n.charAt(0).toUpperCase() + n.slice(1);
}

// Región con el lado afectado, si se indicó: 'Hombro (derecho)'.
export function regionConLado(r, lado) {
  if (!r) return '—';
  return lado ? `${nombreRegion(r)} (${ladoTexto(r, lado)})` : nombreRegion(r);
}

// Hipótesis de trabajo cuando el árbol termina sin ninguna: «dolor lumbar
// inespecífico», «dolor de tobillo y pie inespecífico». La columna toma el
// adjetivo; el resto, «de <región>». Lo usan la 4b, la fase 5, la guía y los esquemas.
const ADJETIVO = { lumbar: 'lumbar', cervical: 'cervical' };
export function dolorInespecifico(r) {
  if (!r) return 'dolor inespecífico de la región';
  return `dolor ${ADJETIVO[r] || `de ${nombreRegion(r).toLowerCase()}`} inespecífico`;
}
