// Fase 6 «Plan de tratamiento», parte sin IA: funciones puras. Reciben una
// «entrada» ya resuelta (plan.js la arma desde el state) y devuelven el plan y
// sus textos para compartir. Diseño: docs/plan-tratamiento.md. Contenido
// clínico y fuentes: data/plan-tratamiento.js.
import {
  ESCALONES, TEXTO_NIVELES, AVISOS, BLOQUES_SESION, TEXTOS_SESION, PLANES_MES,
  PROGRESION_GENERICA, REGLAS_MES, REGLA_RADICULAR_SEVERA, HOJA_REGISTRO,
  MINUTOS_SESION, HIP_EXPLORACION_NEURO, HIP_RADICULARES, TEXTOS_CASA,
} from '../data/plan-tratamiento.js';
import { TEXTO_SIN_PROTOCOLO, TEXTO_PAUTA_COMPATIBLE } from './posquirurgico.js';

// Mismos textos que la fase 5 (lib/posquirurgico.js), ya revisados.
export const textoPosq = conProtocolo => conProtocolo ? TEXTO_PAUTA_COMPATIBLE : `${TEXTO_SIN_PROTOCOLO}.`;

export const NIVELES_GRAVEDAD = ['minima', 'moderada', 'maxima'];
export const NIVELES_IRRITABILIDAD = ['baja', 'moderada', 'alta'];
export const NOMBRE_GRAVEDAD = { minima: 'Mínima', moderada: 'Moderada', maxima: 'Máxima' };
export const NOMBRE_IRRITABILIDAD = { baja: 'Baja', moderada: 'Moderada', alta: 'Alta' };

// Gravedad por el NRS con los cortes de SINSS: 0–3 mínima, 4–7 moderada,
// 8–10 máxima (Petersen 2021, tabla 2). Sin NRS → null.
export function gravedadSINSS(nrs) {
  if (nrs == null || nrs === '' || !Number.isFinite(Number(nrs))) return null;
  const n = Number(nrs);
  return n <= 3 ? 'minima' : n <= 7 ? 'moderada' : 'maxima';
}

// La matriz de la fase 3 mezcla gravedad (dolor, discapacidad) e irritabilidad
// (dolor en reposo, movimiento, tolerancia). La fase 6 usa solo los tres
// ítems de irritabilidad (decisión 12): suman 0–6, con cortes asimétricos
// hacia lo prudente (revisión clínica, 2026-10): 0–1 baja, 2–4 moderada,
// 5–6 alta. Quedarse corto es el error peligroso: con irritabilidad baja
// aparecen la propuesta C y los escalones firmes.
export const ITEMS_IRRITABILIDAD = {
  reposo: ['Ausente', 'Intermitente', 'Presente'],
  movimiento: ['Al final del rango con SP', 'Al final del rango', 'Antes del final del rango'],
  tolerancia: ['Alta', 'Moderada', 'Baja'],
};
const DESDE_NIVEL = { Baja: 'baja', Moderada: 'moderada', Alta: 'alta' };

export function irritabilidadSINSS({ irritabilidad, irritabilidadNivel, irritabilidadDirecta } = {}) {
  const porNivel = DESDE_NIVEL[irritabilidadNivel] || null;
  if (irritabilidadDirecta) return { nivel: porNivel, estimada: true, fase3: porNivel };
  let suma = 0;
  for (const [k, opciones] of Object.entries(ITEMS_IRRITABILIDAD)) {
    const i = opciones.indexOf(irritabilidad?.[k]);
    if (i < 0) return { nivel: porNivel, estimada: true, fase3: porNivel };
    suma += i;
  }
  return { nivel: suma <= 1 ? 'baja' : suma <= 4 ? 'moderada' : 'alta', estimada: false, fase3: porNivel };
}

// Varios síntomas (decisión 35; docs/sintomas-multiples.md, decisión 7): el
// plan se dosifica según el síntoma más irritable y, a igualdad, P1. Los
// secundarios (`ss` del payload) traen su NRS y una irritabilidad elegida
// directamente; «otra región» no cuenta (no se valora hoy), ni un secundario
// sin irritabilidad. P1 sin irritabilidad cuenta como alta, que es lo prudente
// (construirPlan la toma así), así que ningún secundario lo supera.
const RANGO_IRR = { baja: 0, moderada: 1, alta: 2 };
export function sintomaQueDosifica({ severidad = null, zonaP1 = '', secundarios = [] } = {}, irrP1 = null) {
  let elegido = { n: 1, z: zonaP1 || '', nrs: severidad ?? null, irr: irrP1 };
  for (const s of secundarios) {
    const irr = DESDE_NIVEL[s.ir];
    if (s.or || !irr) continue;
    if (RANGO_IRR[irr] > RANGO_IRR[elegido.irr || 'alta']) elegido = { n: s.n, z: s.z || '', nrs: s.nr ?? null, irr };
  }
  return elegido;
}

// Secundarios marcados «Independiente» de P1 (sin «otra región», que ya se
// dice pendiente de valorar en todas partes)
export const sintomasIndependientes = (secundarios = []) => secundarios.filter(s => !s.or && s.re === 'independiente');

// «P2 · Pierna por debajo de la rodilla»
export const nombreSintoma = s => `P${s.n}${s.z ? ` · ${s.z}` : ''}`;

// Escalón de B (1 muy suave … 3 moderada) por gravedad × irritabilidad
// (Petersen 2021). Revisión clínica, 2026-10:
//  · irritabilidad alta → 1 siempre, también con gravedad mínima (con
//    irritabilidad alta se va con cuidado aunque el dolor sea bajo);
//  · moderada → 2, o 1 con gravedad máxima;
//  · baja → 3. B nunca es 4: el escalón firme exige que domine la rigidez, un
//    dato que la app no recoge, así que solo aparece como C, elegido a
//    sabiendas.
// Sin gravedad se toma la máxima, que es lo prudente.
export function escalonB(gravedad, irritabilidad) {
  const g = gravedad || 'maxima';
  if (irritabilidad === 'alta') return 1;
  if (irritabilidad === 'moderada') return g === 'maxima' ? 1 : 2;
  return 3;
}

// A, B y C (decisiones 1, 11, 13, 17): A un escalón menos, C uno más y solo
// con irritabilidad baja y síntomas que no empeoran. El miedo al movimiento no
// bloquea C.
export function niveles({ gravedad, irritabilidad, estabilidad }) {
  const b = escalonB(gravedad, irritabilidad);
  const a = Math.max(1, b - 1);
  let c = null, sinC = null;
  if (irritabilidad !== 'baja') sinC = TEXTO_NIVELES.sinC.irritabilidad;
  else if (estabilidad === 'Empeora') sinC = TEXTO_NIVELES.sinC.estabilidad;
  else c = b + 1;
  return { A: a, B: b, C: c, sinC, aIgual: a === b };
}

// Bloqueos que impiden cualquier plan (decisión 5): urgencias de la fase 2 y
// derivaciones del árbol sin resolver.
export function bloqueosPlan({ urgencias = [], derivaciones = [] } = {}) {
  const b = [];
  if (urgencias.length) b.push({ tipo: 'urgencia', titulo: 'Derivación urgente pendiente', lineas: urgencias });
  if (derivaciones.length) b.push({ tipo: 'derivacion', titulo: 'Derivación médica pendiente', lineas: derivaciones });
  return b;
}

// Una hipótesis se puede planificar si no es de «Derivar» sin marcar como
// tratada, ni una regional ya tratada (con cirugía, la cubre la posquirúrgica).
export function elegible(h) {
  if (h.posq) return { ok: true };
  if (h.derivar && !h.tratada) return { ok: false, motivo: 'Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico.' };
  if (h.tratada) return { ok: false, motivo: 'Marcada como ya diagnosticada y tratada.' };
  return { ok: true };
}

// Hipótesis por defecto: la posquirúrgica si la hay; si no, la primera
// elegible (la entrada ya viene ordenada por peso, como en la fase 5).
export function hipotesisPorDefecto(hipotesis = []) {
  const posq = hipotesis.find(h => h.posq);
  if (posq) return posq.id;
  return hipotesis.find(h => elegible(h).ok)?.id || null;
}

// Por id, nunca por el nombre (data/plan-tratamiento.js).
export const pideExploracionNeuro = h => HIP_EXPLORACION_NEURO.includes(h?.id);
export const esRadicular = h => HIP_RADICULARES.includes(h?.id);

// Duraciones de los bloques (minutos, editables) → rangos «0–5», «5–12»…
// Una duración vacía o no válida vuelve a la de por defecto.
export function rangosBloques(duraciones = {}) {
  let t = 0;
  const bloques = BLOQUES_SESION.map(b => {
    const v = duraciones?.[b.id];
    const d = v === '' || v == null ? NaN : Number(v);
    const duracion = Number.isFinite(d) && d >= 0 && d <= MINUTOS_SESION ? Math.round(d) : b.duracion;
    const desde = t; t += duracion;
    return { ...b, duracion, minutos: `${desde}–${t}` };
  });
  return { bloques, total: t, cuadra: t === MINUTOS_SESION };
}

// Entrada (plan.js):
// { region, regionTexto, modo, posq: { conProtocolo, semanas, restricciones } | null,
//   urgencias, derivaciones, hipotesis: [{ id, name, prom, pauta, pautaFuente, derivar,
//   tratada, posq, pronostico, sinTests }], elegidas: [id, id?], severidad,
//   irritabilidad, irritabilidadNivel, irritabilidadDirecta, zonaP1, secundarios (`ss`
//   del payload: [{ n, z, nr, ir, re, or }]), estabilidad, riesgoPsico,
//   psico_miedo, signoComparable, sesion: 'primera'|'siguiente',
//   gravedadManual, irritabilidadManual }
export function construirPlan(e) {
  const bloqueos = bloqueosPlan(e);
  const irrP1 = irritabilidadSINSS(e);
  // El síntoma que dosifica: P1, o el secundario más irritable (decisión 35)
  const dosifica = sintomaQueDosifica(e, irrP1.nivel);
  const porOtro = dosifica.n !== 1;
  const irr = porOtro ? { nivel: dosifica.irr, estimada: true, fase3: null } : irrP1;
  const gravedadNRS = gravedadSINSS(dosifica.nrs);
  const gravedad = e.gravedadManual || gravedadNRS;
  const irritabilidad = e.irritabilidadManual || irr.nivel || 'alta';
  const avisos = [AVISOS.propuesta, AVISOS.orientativo];
  if (porOtro) avisos.push(AVISOS.dosificaOtro);
  if (!gravedad) avisos.push(AVISOS.sinNRS);
  if (!e.irritabilidadManual && irr.estimada) avisos.push(AVISOS.estimada);
  const difiereFase3 = !irr.estimada && irr.fase3 && irr.fase3 !== irr.nivel;
  if (e.psico_miedo === 'Sí' || e.riesgoPsico === 'Alto') avisos.push(AVISOS.miedo);

  const porId = Object.fromEntries((e.hipotesis || []).map(h => [h.id, h]));
  const elegidas = (e.elegidas || []).map(id => porId[id]).filter(h => h && elegible(h).ok);
  const nv = niveles({ gravedad, irritabilidad, estabilidad: e.estabilidad });
  const primera = (e.sesion || 'primera') === 'primera';
  const neuro = elegidas.some(pideExploracionNeuro);
  const radicular = elegidas.some(esRadicular);

  const avisosHip = [];
  if (e.modo === 'breve' && elegidas.some(h => !h.posq && h.sinTests)) avisosHip.push(AVISOS.breveSinTests);
  if (e.posq) avisosHip.push(textoPosq(e.posq.conProtocolo));
  if (elegidas.some(h => h.id === 'ce13')) avisosHip.push(AVISOS.vertigo);
  if (elegidas.length > 1) avisosHip.push(AVISOS.dosHipotesis);
  const independientes = sintomasIndependientes(e.secundarios);
  if (independientes.length) avisosHip.push(`${AVISOS.independiente} (${independientes.map(nombreSintoma).join('; ')})`);

  const intervencion = elegidas.map(h => ({
    id: h.id, name: h.name, posq: !!h.posq,
    pauta: h.pauta || '', pautaFuente: h.pautaFuente || '',
    sinPauta: !h.pauta,
  }));

  const reevaluacion = [TEXTOS_SESION.reevaluacionBase + (e.signoComparable ? ` Signo comparable registrado: «${e.signoComparable}».` : '')];
  if (!primera) reevaluacion.push(TEXTOS_SESION.reevaluacionSiguiente);
  if (neuro) reevaluacion.push(TEXTOS_SESION.reevaluacionRadicular);
  const educacion = [TEXTOS_SESION.educacionBase];
  if (primera) educacion.push(TEXTOS_SESION.educacionPrimera);

  const reglasMes = [...REGLAS_MES];
  // Solo con el NRS registrado de verdad (8–10), no con la máxima que se toma
  // por prudencia cuando falta ni con la elegida a mano.
  if (radicular && gravedadNRS === 'maxima') reglasMes.push(REGLA_RADICULAR_SEVERA);

  return {
    bloqueado: bloqueos.length > 0,
    bloqueos,
    avisos,
    avisosHip,
    dosifica: { ...dosifica, nombre: nombreSintoma(dosifica), porOtro, varios: (e.secundarios || []).some(s => !s.or) },
    gravedad, gravedadNRS, irritabilidad, irritabilidadCalculada: irr.nivel, irritabilidadEstimada: irr.estimada,
    irritabilidadFase3: difiereFase3 ? irr.fase3 : null,
    niveles: nv,
    escalones: { A: ESCALONES[nv.A], B: ESCALONES[nv.B], C: nv.C ? ESCALONES[nv.C] : null },
    primera,
    neuro,
    hipotesis: elegidas,
    sesion: {
      ...rangosBloques(e.duraciones),
      reevaluacion, educacion, intervencion,
      notaPrimera: primera ? TEXTOS_SESION.primeraSesion : '',
      cantidad: TEXTOS_SESION.cantidad,
      domiciliario: TEXTOS_SESION.domiciliario,
      cierre: neuro ? [TEXTOS_SESION.cierre, TEXTOS_SESION.cierreNeuro] : [TEXTOS_SESION.cierre],
    },
    mes: {
      A: PLANES_MES.A, B: PLANES_MES.B,
      prom: [...new Set(elegidas.map(h => h.prom).filter(Boolean))],
      progresion: PROGRESION_GENERICA,
      reglas: reglasMes,
      pronostico: elegidas.filter(h => h.pronostico).map(h => ({ name: h.name, ...h.pronostico })),
      posq: e.posq ? { ...e.posq } : null,
    },
    registro: HOJA_REGISTRO,
  };
}

// ─── Textos para compartir ───────────────────────────────────────
const linea = t => `- ${t}`;
const cab = (titulo, e) => [titulo, [e.paciente, e.regionTexto, e.fecha].filter(Boolean).join(' · '), ''];

function bloqueoTexto(plan) {
  return plan.bloqueos.flatMap(b => [`⚠ ${b.titulo}:`, ...b.lineas.map(linea)]).concat(['', 'Sin plan de tratamiento hasta resolverlo.']);
}

export function textoPlanSesion(plan, e, nivel = 'B') {
  const out = cab('PLAN DE SESIÓN (50 min) — propuesta', e);
  if (plan.bloqueado) return out.concat(bloqueoTexto(plan)).join('\n');
  const esc = plan.escalones[nivel] || plan.escalones.B;
  out.push(`Gravedad: ${NOMBRE_GRAVEDAD[plan.gravedad] || 'sin registrar'} · Irritabilidad: ${NOMBRE_IRRITABILIDAD[plan.irritabilidad]}${plan.dosifica.porOtro ? ` (según ${plan.dosifica.nombre}, el síntoma más irritable)` : ''}`);
  out.push(`Nivel ${nivel} · ${esc.nombre} (${esc.modo})`);
  out.push(...plan.avisosHip.map(a => `⚠ ${a}`));
  if (plan.sesion.notaPrimera) out.push(plan.sesion.notaPrimera);
  out.push('');
  const s = plan.sesion;
  const contenido = {
    reevaluacion: s.reevaluacion,
    educacion: s.educacion,
    intervencion: [
      ...s.intervencion.map(h => `${h.name}: ${h.sinPauta ? 'pauta a criterio del fisioterapeuta.' : h.pauta}${h.pautaFuente ? ` (${h.pautaFuente})` : ''}`),
      `Terapia manual, nivel ${nivel}: ${esc.texto}`,
      s.cantidad,
    ],
    domiciliario: [s.domiciliario],
    cierre: s.cierre,
  };
  for (const b of s.bloques) {
    out.push(`${b.titulo.toUpperCase()} (${b.minutos} min)`);
    out.push(...(contenido[b.id] || []).map(linea), '');
  }
  out.push(`Minutos orientativos: organización de la sesión, no evidencia.${s.cuadra ? '' : ` Los bloques suman ${s.total} min, no ${MINUTOS_SESION}.`}`);
  return out.join('\n');
}

export function textoPlanMes(plan, e, frecuencia = 'A') {
  const out = cab('PLAN DEL MES — propuesta', e);
  if (plan.bloqueado) return out.concat(bloqueoTexto(plan)).join('\n');
  const p = plan.mes[frecuencia] || plan.mes.A;
  out.push(p.nombre, '');
  out.push(linea(`Sesiones: ${p.sesiones}`));
  out.push(linea(`Reevaluación intermedia: ${p.intermedia}`));
  out.push(linea(`Reevaluación final: ${p.final}${plan.mes.prom.length ? `, con ${plan.mes.prom.join(' / ')}` : ''}`));
  out.push(linea(`Peso del programa domiciliario: ${p.domiciliario}`));
  out.push(...p.notas.map(linea));
  if (plan.mes.posq) out.push(linea(`Posquirúrgico${plan.mes.posq.semanas != null ? `, semana ${plan.mes.posq.semanas} tras la cirugía` : ''}: ${textoPosq(plan.mes.posq.conProtocolo)}`));
  out.push('', 'PROGRESIÓN', linea(plan.mes.progresion), '', 'SEGUIR O CAMBIAR', ...plan.mes.reglas.map(linea));
  if (plan.mes.pronostico.length) {
    out.push('', 'PRONÓSTICO Y CUÁNDO RECONSIDERAR');
    plan.mes.pronostico.forEach(pr => {
      if (pr.horizonte) out.push(linea(`${pr.name}: ${pr.horizonte}`));
      if (pr.derivacion) out.push(linea(`Reconsiderar o derivar si: ${pr.derivacion}`));
    });
  }
  out.push('', 'HOJA DE REGISTRO DE CADA SESIÓN', ...plan.registro.map(linea));
  return out.join('\n');
}

// Programa domiciliario para el paciente: lenguaje llano, sin escalones ni
// fuentes; todos sus textos fijos en TEXTOS_CASA. Lo que hará en casa y cuándo
// parar los escribe el fisio (notas.domiciliario, notas.parar; si «cuándo
// parar» está vacío, la variable de control de la fase 5). Lo que falte no
// sale, y plan.js pide confirmación antes de compartirlo así. Con el plan
// bloqueado no hay programa para casa: esa conversación es en persona.
export function cuandoParar(notas = {}, planNotes = {}) {
  return (notas.parar || '').trim() || (planNotes.variableControl || '').trim();
}

export function faltaEnCasa(notas = {}, planNotes = {}) {
  const falta = [];
  if (!(notas.domiciliario || '').trim()) falta.push('qué hacer');
  if (!cuandoParar(notas, planNotes)) falta.push('cuándo parar');
  return falta;
}

export function textoDomiciliario(plan, e, { ejercicios = '', parar = '', planNotes = {} } = {}) {
  if (plan.bloqueado) return '';
  const T = Object.fromEntries(Object.entries(TEXTOS_CASA).map(([k, v]) => [k, v.texto]));
  const out = [T.titulo, [e.paciente, e.fecha].filter(Boolean).join(' · '), ''];
  if (ejercicios.trim()) out.push(T.queHacer, ejercicios.trim(), '');
  if (planNotes.anclajeHabito) out.push(T.cuandoHacerlo, planNotes.anclajeHabito, '');
  const p = cuandoParar({ parar }, planNotes);
  if (p) out.push(T.cuandoParar, p, '');
  out.push(T.alDiaSiguiente, planNotes.ventanaRecuperacion || T.alDiaSiguienteDefecto, '');
  if (plan.primera) out.push(T.primeraSesion, '');
  if (plan.mes.posq) out.push(T.cirujano, '');
  out.push(T.empeora);
  if (plan.neuro) out.push('', T.alarmaNeuro);
  return out.join('\n');
}
