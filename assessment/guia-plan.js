// Plan de tratamiento (fase 6) en la guía de consulta (guia.html#plan): la misma función de la
// app (construirPlan, lib/plan-tratamiento.js) con un formulario corto en lugar de la valoración
// entera, y su resultado con los mismos textos que comparte la app (textoPlanSesion, textoPlanMes).
// Solo en memoria. Lo que la app lee de la valoración y aquí no se pide (síntomas secundarios,
// semanas, fármacos, el detalle de cada tarjeta) lo dice la página.
import { HYPOTHESES, CIF_TREES, DOSIS_DERIVAR } from './data.js';
import { HIP_POSQUIRURGICA } from './data/comun.js';
import { REGIONES_PLAN } from './data/plan-tratamiento.js';
import { construirPlan, elegible, nivelEfectivo, frecuenciaPorDefecto, textoPlanSesion, textoPlanMes } from './lib/plan-tratamiento.js';
import { pautaHipPosq, TEXTO_PAUTA_COMPATIBLE, NOMBRE_HIP_POSQ } from './lib/posquirurgico.js';
import { nombreRegion } from './lib/region.js';
import { ORDEN_REGIONES, numeroHipotesis } from './lib/esquemas.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Lo que se marca, en memoria
const P = { region: '', hip: [], irr: '', nrs: null, estabilidad: '', psico: false, sesion: 'primera', nivel: 'B', frecuencia: 'A', bloqueo: false, c: {} };
export const vaciarPlan = () => Object.assign(P, { region: '', hip: [], irr: '', nrs: null, estabilidad: '', psico: false, sesion: 'primera', nivel: 'B', frecuencia: 'A', bloqueo: false, c: {} });

// Condiciones (las tarjetas de la fase 1), reducidas a lo que lee el plan
const CONDICIONES = [
  ['posq', 'Posquirúrgico'], ['posqSinProtocolo', 'Sin protocolo del cirujano', 'posq'],
  ['hm', 'Hipermovilidad'], ['hmVascular', 'Subtipo vascular diagnosticado', 'hm'],
  ['ds', 'Disautonomía / POTS'],
  ['les', 'Lupus diagnosticado'], ['lesBrote', 'En brote o peor', 'les'], ['lesRaynaud', 'Raynaud', 'les'], ['lesCorticoides', 'Con corticoides', 'les'],
  ['ma', 'Trastorno mastocitario o anafilaxia'],
  ['op', 'Osteoporosis diagnosticada'], ['opSospecha', 'Sospecha de osteoporosis'], ['opImpacto', 'Fractura vertebral o varias por fragilidad', 'op'],
  ['emb', 'Embarazada'], ['pp', 'Posparto'], ['lact', 'Da el pecho', 'pp'],
  ['acAnti', 'Toma anticoagulante'], ['acAgreg', 'Solo antiagregante'],
];

// Las hipótesis de la región como las prepara la app (plan.js, hipotesisEntrada), sin el árbol:
// la pauta entera (sin rama por situación) y sin tests hechos
function hipotesisRegion(region) {
  const hs = Object.values(HYPOTHESES).filter(h => h.region === region).map(h => {
    const derivar = h.dosis === DOSIS_DERIVAR;
    let pauta = derivar ? '' : h.dosis || '';
    if (pauta && P.c.posq) pauta = `${TEXTO_PAUTA_COMPATIBLE} ${pauta}`;
    return { id: h.id, num: h.num, name: h.name, prom: h.prom || '', pauta, pautaFuente: pauta ? h.dosisFuente || '' : '', derivar, tratada: false, posq: false, pronostico: h.pronostico || null, sinTests: true };
  });
  if (P.c.posq) {
    const cq = { pr: P.c.posqSinProtocolo ? 'No hay' : 'Escrito', re: '' };
    hs.unshift({ id: HIP_POSQUIRURGICA.id, num: '', name: NOMBRE_HIP_POSQ, prom: HIP_POSQUIRURGICA.promPorRegion?.[region] || '', pauta: pautaHipPosq(cq), pautaFuente: '', derivar: false, tratada: false, posq: true, pronostico: null, sinTests: true });
  }
  return hs;
}

function entrada(hs) {
  const c = P.c;
  return {
    region: P.region, regionTexto: nombreRegion(P.region), paciente: '', fecha: new Date().toLocaleDateString('es-ES'), modo: 'completo',
    posq: c.posq ? { conProtocolo: !c.posqSinProtocolo, semanas: null, restricciones: '' } : null,
    urgencias: P.bloqueo ? ['Hay una urgencia o una derivación médica pendiente (cribado o árbol)'] : [], derivaciones: [],
    hipotesis: hs, elegidas: P.hip,
    severidad: P.nrs, irritabilidad: {}, irritabilidadNivel: null, irritabilidadDirecta: false,
    zonaP1: '', secundarios: [], redNeuroZona: false,
    disautonomia: !!c.ds, hipermovilidad: !!c.hm, hmVascular: !!(c.hm && c.hmVascular),
    lupus: c.les ? { brote: !!c.lesBrote, raynaud: !!c.lesRaynaud } : null,
    mastocitos: !!c.ma,
    osteoporosis: c.op || c.opSospecha ? { diagnosticada: !!c.op, impactoLimitado: !!(c.op && c.opImpacto) } : null,
    sinThrust: [c.op || c.opSospecha ? 'osteoporosis' : '', c.les && c.lesCorticoides ? 'corticoides' : '', c.acAnti ? 'anticoagulante' : ''].filter(Boolean),
    embarazo: c.emb ? { estado: 'embarazada', lactancia: false } : c.pp ? { estado: 'posparto', lactancia: !!c.lact } : null,
    anticoagulado: !!(c.acAnti || c.acAgreg),
    farmacos: [],
    estabilidad: P.estabilidad, riesgoPsico: P.psico ? 'Alto' : '', psico_miedo: '',
    signoComparable: '', sesion: P.sesion, gravedadManual: '', irritabilidadManual: P.irr, duraciones: {},
  };
}

const boton = (grupo, valor, texto, on, extra = '') =>
  `<button type="button" class="option-btn${on ? ' selected' : ''}" data-plan="${grupo}" data-valor="${esc(valor)}" aria-pressed="${!!on}"${extra}>${texto}</button>`;
const fila = (titulo, html, nota = '') => `<div class="guia-plan-fila"><div class="guia-plan-et">${esc(titulo)}</div><div class="option-group guia-plan-ops">${html}</div>${nota ? `<p class="guia-nota">${nota}</p>` : ''}</div>`;

export function htmlPlan() {
  const regiones = ORDEN_REGIONES.filter(r => REGIONES_PLAN.includes(r) && CIF_TREES[r]);
  const intro = `<p class="guia-nota">La misma propuesta que la fase 6 de la app (contenido fijo con su fuente, elegido por reglas), con un formulario corto en lugar de la valoración entera. No se guarda nada: se borra al recargar. No tiene en cuenta los síntomas secundarios, las semanas de embarazo o de cirugía, los fármacos ni el detalle de cada tarjeta, que la app sí lee; el texto para el paciente y «Detallar con IA» siguen en la app.</p>`;
  let html = intro + fila('Región', regiones.map(r => boton('region', r, esc(nombreRegion(r)), P.region === r)).join(''));
  if (!P.region) return html;
  const hs = hipotesisRegion(P.region);
  P.hip = P.hip.filter(id => hs.some(h => h.id === id && elegible(h).ok));
  html += fila('Hipótesis (hasta 2)', hs.map(h => {
    const ok = elegible(h).ok;
    return boton('hip', h.id, `${h.num ? `${esc(numeroHipotesis(h.num))} ` : ''}${esc(h.name)}${ok ? '' : ' · derivar'}`, P.hip.includes(h.id), ok ? '' : ' disabled title="Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico"');
  }).join(''));
  html += fila('Irritabilidad', [['baja', 'Baja'], ['moderada', 'Moderada'], ['alta', 'Alta']].map(([v, t]) => boton('irr', v, t, P.irr === v)).join(''), 'La de la matriz (hoja de irritabilidad). Sin marcar, la app la toma como alta.');
  html += fila('NRS (gravedad)', Array.from({ length: 11 }, (_, n) => boton('nrs', n, n, P.nrs === n)).join(''));
  html += fila('Estabilidad', ['Mejora', 'Estable', 'Empeora'].map(v => boton('estabilidad', v, v, P.estabilidad === v)).join(''));
  html += fila('Riesgo psicosocial', boton('psico', 'alto', 'Alto', P.psico));
  html += fila('Condiciones especiales', CONDICIONES.filter(([, , padre]) => !padre || P.c[padre]).map(([k, t]) => boton('c', k, esc(t), P.c[k])).join(''));
  html += fila('Urgencia o derivación pendiente', boton('bloqueo', 'si', 'Sí, hay una', P.bloqueo), 'Con una urgencia del cribado o una derivación del árbol sin resolver, no hay plan.');
  html += fila('Sesión', [['primera', 'Primera'], ['siguiente', 'Siguientes']].map(([v, t]) => boton('sesion', v, t, P.sesion === v)).join(''));
  if (!P.hip.length) return `${html}<p class="guia-nota guia-plan-falta">Elige al menos una hipótesis.</p>`;
  const e = entrada(hs);
  const plan = construirPlan(e);
  const nv = plan.niveles;
  const nivel = nivelEfectivo(nv, P.nivel);
  html += fila('Nivel', ['A', 'B', 'C'].filter(n => nv?.[n] && !(n === 'A' && nv.aIgual)).map(n => boton('nivel', n, `Nivel ${n}`, nivel === n)).join(''), nv?.sinC ? esc(nv.sinC) : '');
  html += fila('Frecuencia del mes', [['A', 'A · 1 sesión/semana'], ['B', 'B · 2 sesiones/semana']].map(([v, t]) => boton('frecuencia', v, t, P.frecuencia === v)).join(''));
  return `${html}<section class="guia-bloque"><h3>Plan de la sesión</h3><pre class="guia-plan-txt">${esc(textoPlanSesion(plan, e, nivel))}</pre></section>
    ${plan.bloqueado ? '' : `<section class="guia-bloque"><h3>Plan del mes</h3><pre class="guia-plan-txt">${esc(textoPlanMes(plan, e, P.frecuencia))}</pre></section>`}
    <button type="button" class="btn btn-secondary guia-plan-borrar" data-plan-borrar>Borrar</button>`;
}

// Un toque marca; un segundo toque desmarca (como la app). Repinta toda la página.
export function initPlan(repintar) {
  document.addEventListener('click', ev => {
    const t = ev.target instanceof Element ? ev.target : null;
    if (t?.closest('[data-plan-borrar]')) { vaciarPlan(); repintar({ sinScroll: true }); return; }
    const b = t?.closest('[data-plan]');
    if (!b || b.disabled) return;
    const { plan: g, valor: v } = b.dataset;
    if (g === 'region') { if (P.region !== v) { P.region = v; P.hip = []; } else P.region = ''; }
    else if (g === 'hip') { P.hip = P.hip.includes(v) ? P.hip.filter(x => x !== v) : [...P.hip, v].slice(-2); if (P.hip.length) P.frecuencia = frecuenciaPorDefecto(P.hip[0]); }
    else if (g === 'irr' || g === 'estabilidad' || g === 'sesion' || g === 'nivel' || g === 'frecuencia') P[g] = P[g] === v && g !== 'sesion' && g !== 'nivel' && g !== 'frecuencia' ? '' : v;
    else if (g === 'nrs') P.nrs = P.nrs === Number(v) ? null : Number(v);
    else if (g === 'psico') P.psico = !P.psico;
    else if (g === 'bloqueo') P.bloqueo = !P.bloqueo;
    else if (g === 'c') {
      P.c[v] = !P.c[v];
      // Excluyentes: embarazada / posparto; anticoagulante / solo antiagregante; osteoporosis diagnosticada / sospecha
      const par = { emb: 'pp', pp: 'emb', acAnti: 'acAgreg', acAgreg: 'acAnti', op: 'opSospecha', opSospecha: 'op' }[v];
      if (P.c[v] && par) P.c[par] = false;
      for (const [k, , padre] of CONDICIONES) if (padre && !P.c[padre]) P.c[k] = false;
    } else return;
    repintar({ sinScroll: true });
  });
}
