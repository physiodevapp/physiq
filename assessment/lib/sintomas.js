// ============================================================
// PhysiQ-Assessment · lib/sintomas.js
// Varios síntomas (P1–P4) de la fase 3: forma de cada síntoma, payload
// (`z1`, `ss`) y textos para la fase 5, 📋 Notas, 📄 Informe y el prompt del
// informe con IA. Diseño y decisiones: docs/sintomas-multiples.md. Puro.
//
// P1 (`state.sintomaPrincipal`) solo guarda dónde y cómo es el dolor: su
// intensidad e irritabilidad siguen en `state.severidad` / `irritabilidad*`,
// así que `nr` / `ir` del payload no cambian. P2–P4 (`state.sintomasSecundarios`)
// llevan además su propio NRS, irritabilidad directa y relación con P1.
// ============================================================

export const MAX_SECUNDARIOS = 3;   // P2–P4

// Misma forma para P1 y los secundarios: al hacer principal un secundario se
// intercambian los objetos y no se pierde nada (lo que P1 no muestra —nrs,
// irritabilidad, relacion, otraRegion— o lo que no muestra un secundario
// —profundidad— se guarda igual). `descripcion` es «Descripción» en P1 y
// «Nota» en los secundarios.
export function sintomaVacio() {
  return { zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' };
}

// Sesiones guardadas antes de esta función, o con campos que faltan
export function normalizarSintomas(st) {
  st.sintomaPrincipal = { ...sintomaVacio(), ...(st.sintomaPrincipal || {}) };
  st.sintomasSecundarios = (Array.isArray(st.sintomasSecundarios) ? st.sintomasSecundarios : [])
    .slice(0, MAX_SECUNDARIOS).map(s => ({ ...sintomaVacio(), ...s }));
}

export const PATRONES = ['Constante', 'Intermitente'];
export const PROFUNDIDADES = ['Superficial', 'Profunda'];
export const NIVELES_IRRITABILIDAD = ['Baja', 'Moderada', 'Alta'];

// Relación de un secundario con P1 (decisión 4)
export const RELACIONES = {
  juntos:        { boton: 'Van juntos',            texto: 'aparece y desaparece con P1',  paciente: 'que aparece y desaparece con el dolor principal' },
  empeora:       { boton: 'Si P1 empeora',         texto: 'solo cuando empeora P1',       paciente: 'que aparece cuando empeora el dolor principal' },
  independiente: { boton: 'Independiente',         texto: 'independiente de P1',          paciente: 'que va por separado del dolor principal' },
  nosabe:        { boton: 'No lo sabe',            texto: 'relación con P1 no conocida',  paciente: '' },
};

export const TEXTO_OTRA_REGION = 'otra región, no valorada hoy';

// Chips de la descripción de P1
export const CHIPS_DESCRIPCION = ['Quemazón', 'Punzante', 'Sordo', 'Hormigueo', 'Adormecimiento', 'Calambre', 'Opresivo'];

// Nombres de las zonas marcadas, más la zona libre (o la otra región)
export function nombreZonas(s, zonas = []) {
  if (!s) return '';
  if (s.otraRegion) return (s.zonaLibre || '').trim();
  const nombres = (s.zonas || []).map(id => zonas.find(z => z.id === id)?.nombre).filter(Boolean);
  const libre = (s.zonaLibre || '').trim();
  if (libre) nombres.push(libre);
  return nombres.map((n, i) => i ? n.charAt(0).toLowerCase() + n.slice(1) : n).join(', ');
}

export function tieneDatos(s) {
  return !!s && !!(s.zonas?.length || (s.zonaLibre || '').trim() || s.otraRegion || s.lado || s.profundidad
    || s.patron || (s.descripcion || '').trim() || s.nrs != null || s.irritabilidad || s.relacion);
}

// Payload: `z1` = P1 (sin datos, no va) · `ss` = secundarios con datos, numerados.
// El lado de P1 vacío es el de la región (`la`), que ya va en el payload.
export function payloadSintomas(st, zonas = []) {
  const p1 = st.sintomaPrincipal, out = {};
  if (tieneDatos(p1)) {
    out.z1 = compactar({ z: nombreZonas(p1, zonas), la: p1.lado, pr: p1.profundidad, pa: p1.patron, de: (p1.descripcion || '').trim() });
  }
  out.ss = (st.sintomasSecundarios || []).filter(tieneDatos).map((s, i) => compactar({
    n: i + 2, z: nombreZonas(s, zonas), la: s.lado, nr: s.nrs ?? null, ir: s.irritabilidad,
    pa: s.patron, re: s.relacion, de: (s.descripcion || '').trim(), ...(s.otraRegion ? { or: true } : {}),
  }, ['n', 'nr']));
  return out;
}

function compactar(o, siempre = []) {
  return Object.fromEntries(Object.entries(o).filter(([k, v]) => siempre.includes(k) || (v !== '' && v != null && v !== false)));
}

const minus = s => String(s || '').toLowerCase();

// Una línea por síntoma, compacta (fase 5, 📋 Notas). P1 sin NRS: ese va aparte.
export function lineaP1(z1) {
  if (!z1) return '';
  return [z1.z || 'zona sin indicar', z1.la && `lado ${minus(z1.la)}`, minus(z1.pr), minus(z1.pa), z1.de && `«${z1.de}»`].filter(Boolean).join(' · ');
}
export function lineaSecundario(s) {
  const zona = s.or ? `${s.z || 'sin indicar'} (${TEXTO_OTRA_REGION})` : (s.z || 'zona sin indicar');
  return [zona, s.la && `lado ${minus(s.la)}`, s.nr != null ? `NRS ${s.nr}/10` : 'NRS no registrado',
    s.ir && `irritabilidad ${minus(s.ir)}`, minus(s.pa), s.re && RELACIONES[s.re]?.texto, s.de && `«${s.de}»`].filter(Boolean).join(' · ');
}

// 📋 Notas: «SÍNTOMAS: P1 … | P2 …» (nada si solo hay P1 sin datos)
export function lineaNotasSintomas(d) {
  const partes = [];
  if (d.z1) partes.push(`P1 ${lineaP1(d.z1)}`);
  (d.ss || []).forEach(s => partes.push(`P${s.n} ${lineaSecundario(s)}`));
  return partes.length ? `SÍNTOMAS: ${partes.join(' | ')}` : '';
}

// 📄 Informe (paciente / médico): lenguaje llano, sin «P1», «NRS» ni irritabilidad
export function lineasInformeSintomas(d) {
  const out = [];
  if (d.z1?.z) out.push(`Localización del dolor principal: ${minus(d.z1.z)}${d.z1.la ? ` (lado ${minus(d.z1.la)})` : ''}${d.z1.pa ? `, ${minus(d.z1.pa)}` : ''}`);
  for (const s of d.ss || []) {
    if (s.or) { out.push(`Refiere también dolor: ${minus(s.z) || 'otra región'}${s.la ? ` (lado ${minus(s.la)})` : ''}, pendiente de valorar`); continue; }
    const rel = s.re && RELACIONES[s.re]?.paciente;
    out.push(`Refiere además dolor: ${minus(s.z) || 'otra zona'}${s.la ? ` (lado ${minus(s.la)})` : ''}${s.nr != null ? `, de intensidad ${s.nr}/10` : ''}${rel ? `, ${rel}` : ''}`);
  }
  return out;
}

// Prompt del informe con IA: bloque numerado y la regla para no mezclarlos.
// No va en lib/reglas-informe.js (compartido con physiq-report, que aún no
// recibe estos campos).
export function bloqueSintomasIA(d) {
  if (!d.z1 && !d.ss?.length) return '';
  const lineas = [];
  lineas.push(`  · P1 (principal; el NRS y la irritabilidad de arriba son los suyos): ${d.z1 ? lineaP1(d.z1) : 'zona sin indicar'}`);
  (d.ss || []).forEach(s => lineas.push(`  · P${s.n}: ${lineaSecundario(s)}`));
  return `Síntomas que refiere el paciente (mapa corporal):\n${lineas.join('\n')}\n`
    + 'Describe cada síntoma con sus propios datos: no atribuyas a uno la intensidad, la irritabilidad ni el comportamiento de otro.'
    + ((d.ss || []).some(s => s.or) ? ` Lo marcado como «${TEXTO_OTRA_REGION}» no se exploró: menciónalo solo como pendiente de valorar, sin hipótesis ni plan.` : '');
}

// Pistas para un paso del árbol (decisión 8): los síntomas con alguna zona
// ligada a ese paso (`pasos` en la zona), en el formato del recuadro «📝» —
// { q, a }, ver lib/pistas.js. Recuerdan; nunca contestan el paso. Otra región
// no lleva pistas: no se valora hoy.
export function pistasSintomasPaso(st, zonas = [], stepId) {
  const ligadas = new Set(zonas.filter(z => z.pasos?.includes(stepId)).map(z => z.id));
  if (!ligadas.size) return [];
  const toca = s => !s.otraRegion && (s.zonas || []).some(id => ligadas.has(id));
  const { z1, ss } = payloadSintomas(st, zonas);
  const out = [];
  if (st.sintomaPrincipal && toca(st.sintomaPrincipal)) {
    out.push({ q: 'Síntoma P1 (principal):', a: [lineaP1(z1), st.severidad != null && `NRS ${st.severidad}/10`].filter(Boolean).join(' · ') });
  }
  // `ss` son los secundarios con datos, en el mismo orden
  (st.sintomasSecundarios || []).filter(tieneDatos).forEach((s, k) => {
    if (toca(s)) out.push({ q: `Síntoma P${ss[k].n}:`, a: lineaSecundario(ss[k]) });
  });
  return out;
}
