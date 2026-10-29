// Fase 6 «Plan de tratamiento» (opcional), parte sin IA. app.js lo carga con
// import() al entrar en la fase. Arma la «entrada» desde el state, pide el plan
// a lib/plan-tratamiento.js y lo pinta. Diseño: docs/plan-tratamiento.md.
// Nunca toca buildPhysiQPayload(), 📋 Notas ni 📄 Informe (decisión 9).
import { state } from './state.js';
import { DOSIS_DERIVAR, ZONAS_SINTOMA, CIF_TREES } from './data.js';
import { REGIONES_PLAN, AVISOS, MINUTOS_SESION, TEXTO_NIVELES, TEXTOS_SESION } from './data/plan-tratamiento.js';
import {
  construirPlan, elegible, nivelEfectivo, hipotesisPorDefecto, frecuenciaPorDefecto, textoPlanSesion, textoPlanMes, textoDomiciliario, faltaEnCasa, textoPosq,
  NIVELES_GRAVEDAD, NIVELES_IRRITABILIDAD, NOMBRE_GRAVEDAD, NOMBRE_IRRITABILIDAD,
} from './lib/plan-tratamiento.js';
import { hipotesis, hipotesisActivas, esTratada } from './phase4b.js';
import { getDerivacionesArbol } from './phase4.js';
import { ramaPauta } from './lib/pauta.js';
import { conProtocolo, semanasCirugia, pautaHipPosq, TEXTO_PAUTA_COMPATIBLE } from './lib/posquirurgico.js';
import { regionConLado, dolorInespecifico } from './lib/region.js';
import { arbolCompleto } from './lib/arbol.js';
import { payloadSintomas, zonaConRedNeuro } from './lib/sintomas.js';
import { dsActiva } from './lib/disautonomia.js';
import { lesDiagnosticado } from './lib/lupus.js';
import { maActivo } from './lib/mastocitos.js';
import { opActivo, opDiagnosticada, impactoLimitado, opPayload, motivosSinThrust } from './lib/osteoporosis.js';
import { emActivo } from './lib/embarazo.js';
import { acActivo } from './lib/anticoagulado.js';
import { familiasPaciente, FAMILIA_AC } from './lib/farmacos-paciente.js';
import { hmActiva } from './lib/hipermovilidad.js';
import { citasHTML, citasEnTexto } from './lib/citas.js';
import { enlaceEjercicioHTML, motivosEjercicio } from './lib/ejercicio.js';
import { iaParrafoHTML, atributosIA, ctxPlan, ctxPauta } from './ampliar-ia.js';
import {
  saveSession, showConfirmBanner, getUrgenciasActivas, getCirugiaPayload, compartirTexto, cerrarMenuCompartir, partirPrimeraFrase,
} from './app.js';

const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Texto de data/ con sus citas entre paréntesis tocables (lib/citas.js); nunca en atributos ni en los <textarea>
const escC = t => citasEnTexto(esc(t));

let _contenedor = null;
let _ia = null;   // plan-ia.js («✨ Detallar con IA»), solo fuera del hub

// ─── Estado de la fase ───────────────────────────────────────────

// Sin hipótesis: no es lo mismo que falte el árbol que que haya terminado sin ninguna.
function sinHipotesisHTML() {
  const tree = CIF_TREES[state.region];
  if (tree && arbolCompleto(tree, state.treeAnswers)) {
    return `<div class="plan-ayuda" id="planSinHip">El árbol terminó sin hipótesis: no hay una pauta específica que planificar. Trabaja con ${dolorInespecifico(state.region)} (ver la fase 5) o vuelve al árbol para reconsiderar las respuestas. <button type="button" class="plan-enlace" onclick="goToPhase(4)">Ir al árbol →</button></div>`;
  }
  return '<div class="plan-ayuda" id="planSinHip">No hay hipótesis activas: completa el árbol de la fase 4. <button type="button" class="plan-enlace" onclick="goToPhase(4)">Ir al árbol →</button></div>';
}

function planVacio(idDefecto) {
  return {
    hipotesis: idDefecto ? [idDefecto] : [],
    nivel: 'B', frecuencia: frecuenciaPorDefecto(idDefecto), sesion: 'primera',
    gravedad: null, irritabilidad: null,
    notas: { sesion: '', mes: '', domiciliario: '', parar: '' },
    duraciones: {},
  };
}

// Hipótesis activas, ordenadas como en la fase 5 (la posquirúrgica primero,
// después por peso), con lo que necesita el plan.
function hipotesisEntrada() {
  const cq = getCirugiaPayload();
  return hipotesisActivas()
    .map(id => ({ id, hyp: hipotesis(id), score: state.hypothesisScores[id]?.totalLR || 1 }))
    .filter(x => x.hyp)
    .sort((a, b) => (b.hyp.posquirurgica ? 1 : 0) - (a.hyp.posquirurgica ? 1 : 0) || b.score - a.score)
    .map(({ id, hyp }) => {
      const derivar = hyp.dosis === DOSIS_DERIVAR;
      let pauta = '';
      if (hyp.posquirurgica) pauta = pautaHipPosq(cq);
      else if (!derivar) pauta = ramaPauta(hyp, state)?.texto || hyp.dosis || '';
      if (pauta && cq && !hyp.posquirurgica) pauta = `${TEXTO_PAUTA_COMPATIBLE} ${pauta}`;
      const res = state.testResults[id] || {};
      return {
        id, name: hyp.name, prom: hyp.prom || '', pauta,
        pautaFuente: !hyp.posquirurgica && pauta ? hyp.dosisFuente || '' : '',
        derivar, tratada: esTratada(id), posq: !!hyp.posquirurgica,
        pronostico: hyp.pronostico || null,
        sinTests: !Object.values(res).some(v => v === 'pos' || v === 'neg'),
      };
    });
}

function entrada(hs) {
  const pt = state.planTratamiento;
  const cq = getCirugiaPayload();
  // Varios síntomas (Fase N): el plan se dosifica según el más irritable
  const { z1, ss } = payloadSintomas(state, ZONAS_SINTOMA[state.region] || []);
  return {
    region: state.region, regionTexto: regionConLado(state.region, state.lado),
    paciente: state.patient || '', fecha: new Date().toLocaleDateString('es-ES'),
    modo: state.modo,
    posq: cq ? { conProtocolo: conProtocolo(state.cirugia), semanas: semanasCirugia(state.cirugia), restricciones: state.cirugia?.restricciones || '' } : null,
    urgencias: getUrgenciasActivas(), derivaciones: getDerivacionesArbol(),
    hipotesis: hs, elegidas: pt.hipotesis,
    severidad: state.severidad, irritabilidad: state.irritabilidad,
    irritabilidadNivel: state.irritabilidadNivel, irritabilidadDirecta: state.irritabilidadDirecta,
    zonaP1: z1?.z || '', secundarios: ss || [],
    // Zona perineal marcada (`redNeuro`): red de seguridad de cola de caballo
    redNeuroZona: zonaConRedNeuro(state, ZONAS_SINTOMA[state.region] || []),
    // Tarjetas de la fase 1 (Fase P, docs/pots.md): aviso y red de la disautonomía
    disautonomia: dsActiva(state.disautonomia), hipermovilidad: hmActiva(state.hipermovilidad),
    // Hipermovilidad «Diagnosticada · vascular» (docs/hipermovilidad.md): aviso de actividad
    hmVascular: state.hipermovilidad?.estado === 'diagnosticada' && state.hipermovilidad.subtipo === 'vascular',
    // Lupus diagnosticado (docs/lupus.md): avisos y red de seguridad
    lupus: lesDiagnosticado(state.lupus) ? { brote: ['brote', 'peor'].includes(state.lupus.actividad),
      raynaud: !!state.lupus.raynaud } : null,
    // Trastorno mastocitario o anafilaxia (docs/mastocitaria.md): aviso y red de seguridad
    mastocitos: maActivo(state.mastocitos),
    // Osteoporosis (docs/osteoporosis.md): avisos, red y tope sin thrust (este,
    // también con el lupus con corticoides, decisión 15, y con anticoagulante)
    osteoporosis: opActivo(state.osteoporosis) ? { diagnosticada: opDiagnosticada(state.osteoporosis),
      impactoLimitado: impactoLimitado(opPayload(state.osteoporosis, state.edadPaciente)) } : null,
    sinThrust: motivosSinThrust(state.osteoporosis, state.lupus, state.anticoagulado),
    // Embarazo o posparto (docs/embarazo-posparto.md): avisos y red de seguridad
    embarazo: emActivo(state.embarazo) ? { estado: state.embarazo.estado, lactancia: state.embarazo.lactancia === 'SI' } : null,
    // Anticoagulado o antiagregado (docs/anticoagulado.md): avisos y red de seguridad
    anticoagulado: acActivo(state.anticoagulado),
    // Fármacos que toma (docs/farmacos-paciente.md): un aviso por familia revisada;
    // los antitrombóticos salen de su tarjeta
    farmacos: familiasPaciente(state).map(x => x.id).filter(id => id !== FAMILIA_AC),
    estabilidad: state.estabilidad, riesgoPsico: state.riesgoPsico, psico_miedo: state.psico_miedo,
    signoComparable: state.signoComparable,
    sesion: pt.sesion, gravedadManual: pt.gravedad, irritabilidadManual: pt.irritabilidad,
    duraciones: pt.duraciones,
  };
}

// Deja state.planTratamiento coherente con la valoración actual: hipótesis que
// ya no están activas o no se pueden planificar se quitan; sin ninguna, la de
// por defecto.
function asegurarEstado(hs) {
  const idDef = hipotesisPorDefecto(hs);
  if (!state.planTratamiento) state.planTratamiento = planVacio(idDef);
  const pt = state.planTratamiento;
  pt.notas = { sesion: '', mes: '', domiciliario: '', parar: '', ...(pt.notas || {}) };
  pt.duraciones = { ...(pt.duraciones || {}) };
  const validas = new Set(hs.filter(h => elegible(h).ok).map(h => h.id));
  pt.hipotesis = (pt.hipotesis || []).filter(id => validas.has(id)).slice(0, 2);
  if (!pt.hipotesis.length && idDef) pt.hipotesis = [idDef];
}

function planActual() {
  const hs = hipotesisEntrada();
  asegurarEstado(hs);
  const e = entrada(hs);
  const plan = construirPlan(e);
  const pt = state.planTratamiento;
  // C sin propuesta, o A igual que B (no se ofrece): vale B
  pt.nivel = nivelEfectivo(plan.niveles, pt.nivel);
  return { hs, e, plan };
}

// ─── Pintado ─────────────────────────────────────────────────────
export function montarPlan(contenedor) {
  _contenedor = contenedor;
  pintar();
  // Capa de IA (decisión 106): solo standalone; en el hub ni se descarga
  if (!_ia && !document.body.classList.contains('in-hub')) {
    import('./plan-ia.js')
      .then(m => { _ia = m; m.montarPlanIA(document.getElementById('planIA')); })
      .catch(() => {});
  }
}

function opcion(grupo, valor, texto, seleccionado, { deshabilitado = false, titulo = '' } = {}) {
  return `<button type="button" class="option-btn${seleccionado ? ' selected' : ''}" ${deshabilitado ? 'disabled aria-disabled="true"' : ''} ${titulo ? `title="${esc(titulo)}"` : ''}
    onclick="planElegir('${grupo}','${valor}')">${texto}</button>`;
}

// «✨ IA» (ampliar-ia.js) en los textos de data/ que se leen para entenderlos,
// como en la fase 5. `ctx` null (la pauta de la hipótesis posquirúrgica, que
// lleva las restricciones del paciente): sin «✨ IA».
function pautaHTML(texto, fuente, ctx = null) {
  const { primera, resto } = partirPrimeraFrase(texto);
  const ia = ctx ? `${atributosIA(ctx)} data-ia-parrafo` : '';
  const enlace = ctx ? iaParrafoHTML() : '';
  const f = fuente ? `<div class="test-source ia-excluir" style="margin:4px 0 0;">${citasHTML(fuente)}</div>` : '';
  if (!resto) return `<div class="exercise-box" ${ia}>${escC(texto)}${enlace}</div>${f}`;
  return `<details class="pauta-det" ${ia}>
    <summary class="exercise-box"><span class="pauta-det-primera">${escC(primera)}</span><span class="pauta-det-mas">Ver pauta completa</span></summary>
    <div class="pauta-det-resto">${escC(resto)}${enlace}</div>${f}
  </details>`;
}

// `apartado` (título de data/): cada punto con su «✨ IA». Un punto puede ser
// { texto, sinIA } (una indicación de pantalla, no texto clínico) o
// { texto, paciente } (lo que sale de la valoración, en .ia-excluir).
const lista = (items, apartado = '') => `<ul class="plan-lista"${apartado ? ` ${atributosIA(ctxPlan(state.region, apartado))}` : ''}>${items.map(it => {
  const { texto, sinIA = false, paciente = '' } = typeof it === 'string' ? { texto: it } : it;
  if (!apartado || sinIA) return `<li>${escC(texto)}</li>`;
  return `<li data-ia-parrafo>${escC(texto)}${paciente ? ` <span class="ia-excluir">${esc(paciente)}</span>` : ''}${iaParrafoHTML()}</li>`;
}).join('')}</ul>`;

// La reevaluación lleva el signo comparable que escribió el fisioterapeuta
// (lib/plan-tratamiento.js): fuera de lo que se envía a la IA.
const conSignoAparte = t => t.startsWith(TEXTOS_SESION.reevaluacionBase) && t !== TEXTOS_SESION.reevaluacionBase
  ? { texto: TEXTOS_SESION.reevaluacionBase, paciente: t.slice(TEXTOS_SESION.reevaluacionBase.length).trim() }
  : t;

// Tras cada repintado, la tarjeta de la IA se muestra u oculta y revisa si su
// plan detallado sigue al día (plan-ia.js)
function pintar() {
  pintarPlan();
  _ia?.refrescarPlanIA();
}

function pintarPlan() {
  const c = _contenedor;
  if (!c) return;
  if (!REGIONES_PLAN.includes(state.region)) {
    // Con las siete regiones dentro (decisión 90), solo se llega aquí sin región
    c.innerHTML = `<div class="alert alert-info"><span class="alert-icon">ℹ️</span><div>
      <strong>Sin región.</strong> El plan de tratamiento depende de la región: elígela en la fase 2.</div></div>`;
    return;
  }
  const { hs, plan } = planActual();
  const pt = state.planTratamiento;

  if (plan.bloqueado) {
    c.innerHTML = plan.bloqueos.map(b => `<div class="alert alert-danger"><span class="alert-icon">${b.tipo === 'urgencia' ? '🚨' : '🩺'}</span><div>
      <strong>${esc(b.titulo)}.</strong> Sin plan de tratamiento hasta resolverlo.${b.lineas.map(l => `<div>· ${escC(l)}</div>`).join('')}</div></div>`).join('');
    return;
  }

  // Hipótesis a tratar (una por defecto, una segunda opcional)
  const hipHTML = hs.map(h => {
    const el = elegible(h);
    const sel = pt.hipotesis.includes(h.id);
    const orden = sel ? (pt.hipotesis[0] === h.id ? 'Principal' : 'Segunda') : '';
    return `<div class="plan-hip${el.ok ? '' : ' plan-hip-no'}">
      ${opcion('hipotesis', h.id, `${esc(h.name)}${orden ? ` <span class="plan-hip-orden">· ${orden}</span>` : ''}`, sel, { deshabilitado: !el.ok, titulo: el.motivo })}
      ${el.ok ? '' : `<div class="plan-hip-motivo">${escC(el.motivo)}</div>`}
    </div>`;
  }).join('');

  const nv = plan.niveles;
  const nivel = nivelEfectivo(nv, pt.nivel);
  const esc_ = plan.tablaEscalones[nv[nivel]];
  const s = plan.sesion;
  const mes = plan.mes[pt.frecuencia];

  c.innerHTML = `
  ${plan.avisos.map(a => `<div class="plan-aviso">${escC(a)}${a === AVISOS.sinNRS
    ? ' <button type="button" class="plan-enlace" onclick="goToPhase(3)">Registrar NRS en la fase 3 →</button>'
    : a === AVISOS.incompleta || a === AVISOS.sinIrritabilidad
      ? ' <button type="button" class="plan-enlace" onclick="goToPhase(3)">Completar la matriz en la fase 3 →</button>' : ''}</div>`).join('')}

  <div class="card">
    <div class="card-title">Hipótesis a tratar</div>
    <p class="plan-ayuda">Una por defecto; puedes añadir una segunda (toca otra). La primera elegida es la principal.</p>
    <div class="plan-hips">${hipHTML || sinHipotesisHTML()}</div>
  </div>

  <div class="card">
    <div class="card-title">Gravedad e irritabilidad</div>
    <p class="plan-ayuda">Calculadas de la fase 3 (gravedad: NRS con los cortes de SINSS; irritabilidad: la de la fase 3, con su misma regla: el tiempo en calmarse y, para subirla, dolor en reposo, movimiento y tolerancia). Puedes cambiarlas.</p>
    ${plan.dosifica.varios ? `<div class="plan-dosifica" id="planDosifica">Según <strong>${esc(plan.dosifica.nombre)}</strong>${plan.dosifica.porOtro ? ', el síntoma más irritable' : ' (principal)'}</div>` : ''}
    <div class="plan-campo"><div class="plan-campo-et">Gravedad${plan.gravedadNRS ? ` <span class="plan-calc">· calculada: ${NOMBRE_GRAVEDAD[plan.gravedadNRS]} (NRS ${plan.dosifica.nrs}/10)</span>` : ' <span class="plan-calc">· sin NRS</span>'}</div>
      <div class="option-group">${NIVELES_GRAVEDAD.map(g => opcion('gravedad', g, NOMBRE_GRAVEDAD[g], plan.gravedad === g)).join('')}</div></div>
    <div class="plan-campo"><div class="plan-campo-et">Irritabilidad${plan.irritabilidadCalculada ? ` <span class="plan-calc">· calculada: ${NOMBRE_IRRITABILIDAD[plan.irritabilidadCalculada]}${plan.irritabilidadEstimada ? ' (estimada)' : ''}</span>` : ' <span class="plan-calc">· sin registrar</span>'}</div>
      <div class="option-group">${NIVELES_IRRITABILIDAD.map(i => opcion('irritabilidad', i, NOMBRE_IRRITABILIDAD[i], plan.irritabilidad === i)).join('')}</div></div>
    <div class="plan-campo"><div class="plan-campo-et">Sesión</div>
      <div class="option-group">${opcion('sesion', 'primera', 'Primera de tratamiento', pt.sesion === 'primera')}${opcion('sesion', 'siguiente', 'Siguientes', pt.sesion === 'siguiente')}</div></div>
  </div>

  <div class="card" id="planSesion">
    <div class="card-title">Sesión de 50 minutos <span class="plan-chip">Minutos orientativos</span></div>
    ${plan.avisosHip.map(a => `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div ${atributosIA(ctxPlan(state.region, 'avisos para la sesión'))} data-ia-parrafo>${escC(a)}${iaParrafoHTML()}</div></div>`).join('')}
    <div class="option-group plan-niveles">
      ${['A', 'B', 'C'].map(k => {
        // A igual que B no se ofrece: elegirla no cambiaría nada
        const n = k === 'A' && nv.aIgual ? null : nv[k];
        const e = n ? plan.tablaEscalones[n] : null;
        return opcion('nivel', k, `<strong>${k}</strong> · ${e ? esc(e.nombre) : '—'}`, nivel === k, { deshabilitado: !n, titulo: n ? '' : k === 'A' ? TEXTO_NIVELES.aIgual : nv.sinC });
      }).join('')}
    </div>
    ${nv.sinC ? `<div class="plan-ayuda">${escC(nv.sinC)}</div>` : ''}
    ${nv.aIgual ? `<div class="plan-ayuda">${escC(TEXTO_NIVELES.aIgual)}</div>` : ''}
    <div class="plan-escalon">
      <div class="plan-escalon-tit">Nivel ${nivel} · ${esc(esc_.nombre)} <span class="plan-calc">(${esc(esc_.modo)})</span></div>
      <div ${atributosIA(ctxPlan(state.region, `terapia manual, ${esc_.nombre}`))} data-ia-parrafo>${escC(esc_.texto)}${iaParrafoHTML()}</div>
      <div class="test-source" style="margin:6px 0 0;">${citasHTML(esc_.citas)}</div>
      <div class="plan-ayuda" style="margin-top:6px;">${escC(AVISOS.soloTerapiaManual)}</div>
    </div>
    ${s.notaPrimera ? `<div class="plan-aviso">${escC(s.notaPrimera)}</div>` : ''}
    <div class="plan-bloques">
      ${s.bloques.map(b => `<div class="plan-bloque">
        <div class="plan-bloque-cab"><span class="plan-bloque-min">${b.minutos} min</span> ${esc(b.titulo)}
          <label class="plan-duracion"><input type="number" inputmode="numeric" min="0" max="${MINUTOS_SESION}" value="${b.duracion}" aria-label="Minutos de ${esc(b.titulo)}" onchange="planDuracion('${b.id}', this.value)"> min</label></div>
        ${b.id === 'reevaluacion' ? lista(s.reevaluacion.map(conSignoAparte), b.titulo) : ''}
        ${b.id === 'educacion' ? lista(s.educacion, b.titulo) + enlaceEjercicioHTML(plan.irritabilidad, { ...motivosEjercicio({ riesgoPsico: state.riesgoPsico, cuestionarios: state.cuestionarios, tarjetas: { lupus: state.lupus, disautonomia: state.disautonomia, hipermovilidad: state.hipermovilidad, embarazo: state.embarazo }, respuestas: state.sistemicoAnswers }), hipotesis: plan.hipotesis, cronologia: state.cronologia }) : ''}
        ${b.id === 'intervencion' ? s.intervencion.map(h => `<div class="plan-int-hip">${esc(h.name)}</div>${h.sinPauta
          ? '<div class="exercise-box"><em>Pauta a criterio del fisioterapeuta: no hay una pauta con fuente para esta hipótesis.</em></div>'
          : pautaHTML(h.pauta, h.pautaFuente, h.posq ? null : ctxPauta(state.region, h.name))}`).join('') + lista([{ texto: `Terapia manual: nivel ${nivel} (arriba).`, sinIA: true }, ...s.cantidad], b.titulo) : ''}
        ${b.id === 'domiciliario' ? lista([s.domiciliario], b.titulo) : ''}
        ${b.id === 'cierre' ? lista(s.cierre, b.titulo) : ''}
      </div>`).join('')}
    </div>
    <div class="plan-ayuda${s.cuadra ? '' : ' plan-ayuda-aviso'}" id="planTotalMin">${s.cuadra
      ? 'Minutos orientativos: organización de la sesión, no evidencia. Cambia la duración de cada bloque si lo necesitas.'
      : `Los bloques suman ${s.total} min, no ${MINUTOS_SESION}.`}</div>
    <label class="plan-campo-et" for="planNotasSesion">Tus notas para la sesión</label>
    <textarea class="plan-note-input" id="planNotasSesion" rows="3" oninput="planNota('sesion', this.value)">${esc(pt.notas.sesion)}</textarea>
  </div>

  <div class="card" id="planMes">
    <div class="card-title">Plan de un mes</div>
    <div class="option-group">${opcion('frecuencia', 'A', 'A · 1 sesión/semana', pt.frecuencia === 'A')}${opcion('frecuencia', 'B', 'B · 2 sesiones/semana', pt.frecuencia === 'B')}</div>
    <div class="summary-row"><span class="summary-label">Sesiones</span><span class="summary-value">${mes.sesiones}</span></div>
    <div class="summary-row"><span class="summary-label">Reevaluación intermedia</span><span class="summary-value">${escC(mes.intermedia)}</span></div>
    <div class="summary-row"><span class="summary-label">Reevaluación final</span><span class="summary-value">${escC(mes.final)}${plan.mes.prom.length ? `, con ${esc(plan.mes.prom.join(' / '))}` : ''}</span></div>
    <div class="summary-row"><span class="summary-label">Programa domiciliario</span><span class="summary-value">${escC(mes.domiciliario)}</span></div>
    <details class="plan-registro"><summary>Qué comparar en las reevaluaciones intermedia y final</summary>${lista(plan.mes.retrospectiva, 'qué comparar en las reevaluaciones intermedia y final')}
      <div class="test-source">${citasHTML(plan.mes.fuenteRetrospectiva)}</div></details>
    ${lista([...mes.notas, ...plan.mes.notasPauta], `plan de un mes, ${mes.nombre || 'frecuencia elegida'}`)}
    ${plan.mes.posq ? `<div class="nota-posq">🏥 ${plan.mes.posq.semanas != null ? `Semana ${plan.mes.posq.semanas} tras la cirugía. ` : ''}${escC(textoPosq(plan.mes.posq.conProtocolo))}</div>` : ''}
    <div class="plan-sub">Progresión</div>${lista(plan.mes.progresion, 'progresión')}
    <div class="plan-sub">Seguir o cambiar</div>${lista(plan.mes.reglas, 'seguir o cambiar el tratamiento')}
    ${plan.mes.pronostico.length ? `<div class="plan-sub">Pronóstico y cuándo reconsiderar</div>${lista(plan.mes.pronostico.flatMap(p => [
      p.horizonte ? `${p.name}: ${p.horizonte}` : '', p.seguimiento ? `Seguimiento: ${p.seguimiento}` : '', p.derivacion ? `Reconsiderar o derivar si: ${p.derivacion}` : '',
    ].filter(Boolean)), 'pronóstico y cuándo reconsiderar')}` : ''}
    <details class="plan-registro"><summary>Hoja de registro de cada sesión</summary>${lista(plan.registro, 'hoja de registro de cada sesión')}
      <div class="test-source">${citasHTML(plan.fuenteRegistro)}</div></details>
    <label class="plan-campo-et" for="planNotasMes">Tus notas para el mes</label>
    <textarea class="plan-note-input" id="planNotasMes" rows="3" oninput="planNota('mes', this.value)">${esc(pt.notas.mes)}</textarea>
  </div>

  <div class="card" id="planCasa">
    <div class="card-title">Programa para casa</div>
    <p class="plan-ayuda">Lo que hará el paciente en casa, con tus palabras: va tal cual en «📤 Compartir → Programa para casa», en lenguaje llano y sin puntuaciones ni fuentes. Las notas del plan de la fase 5 (cuándo parar, a las 24 h, anclaje) se añaden si están rellenas.</p>
    ${plan.alarmasCasa.length ? `<p class="plan-ayuda">El programa termina con cuándo ir a urgencias (red de seguridad${plan.alarmasCasa.length > 1 ? ', dos avisos' : ''}): explícalo en la sesión.</p>` : ''}
    <label class="plan-campo-et" for="planNotasCasa">Qué hacer</label>
    <textarea class="plan-note-input" id="planNotasCasa" rows="4" placeholder="Ej.: 10 repeticiones de … cada mañana" oninput="planNota('domiciliario', this.value)">${esc(pt.notas.domiciliario)}</textarea>
    <label class="plan-campo-et" for="planParar">Cuándo parar</label>
    <textarea class="plan-note-input" id="planParar" rows="2" placeholder="${esc(state.planNotes?.variableControl ? `Si lo dejas vacío: «${state.planNotes.variableControl}» (fase 5)` : 'Ej.: si el dolor de la pierna aumenta o aparece hormigueo')}" oninput="planNota('parar', this.value)">${esc(pt.notas.parar)}</textarea>
  </div>`;
}

// ─── Acciones (onclick / oninput) ───────────────────────────────
function planElegir(grupo, valor) {
  const pt = state.planTratamiento;
  if (!pt) return;
  if (grupo === 'hipotesis') {
    const i = pt.hipotesis.indexOf(valor);
    if (i >= 0) { if (pt.hipotesis.length > 1) pt.hipotesis.splice(i, 1); }
    else pt.hipotesis = [...pt.hipotesis, valor].slice(-2);
  } else {
    pt[grupo] = valor;   // gravedad, irritabilidad, sesion, nivel, frecuencia
  }
  saveSession();
  pintar();
}

function planDuracion(id, valor) {
  const pt = state.planTratamiento;
  if (!pt) return;
  if (valor === '' || valor == null) delete pt.duraciones[id];
  else pt.duraciones[id] = valor;
  saveSession();
  pintar();
}

function planNota(campo, valor) {
  if (!state.planTratamiento) return;
  state.planTratamiento.notas[campo] = valor;
  saveSession();
}

// ─── Compartir (menú de «📤 Compartir» de la fase 6, app.js) ─────
export function opcionesCompartir() {
  const ops = [
    { accion: 'compartirPlanSesion', nombre: 'Plan de sesión', sub: 'Sesión de 50 min con el nivel elegido, para ti' },
    { accion: 'compartirPlanMes', nombre: 'Plan del mes', sub: 'Plan A o B, reglas de seguir o cambiar y hoja de registro' },
  ];
  // Con el plan bloqueado (urgencia o derivación) no hay programa para casa:
  // esa conversación es en persona.
  if (REGIONES_PLAN.includes(state.region) && !planActual().plan.bloqueado) {
    ops.push({ accion: 'compartirDomiciliario', nombre: 'Programa para casa', sub: 'Para el paciente, en lenguaje llano' });
    // Plan detallado con IA (decisión 111): el del paciente, solo revisado
    const r = _ia?.estadoRevisionPlanIA();
    if (r) {
      const sin = r.pendientes ? `<span class="compartir-op-aviso${r.altosPendientes ? ' alto' : ''}">⚠ ${r.pendientes === r.total ? r.total : `${r.pendientes} de ${r.total}`} ${r.total === 1 ? 'punto' : 'puntos'} sin revisar</span>` : '';
      ops.push({ accion: 'compartirPlanIA', nombre: 'Plan detallado (IA)', sub: sin || 'Sesión, mes y casa con IA, para ti' });
      ops.push({ accion: 'compartirCasaIA', nombre: 'Programa para casa (IA)', sub: r.pendientes ? 'Para el paciente: antes, marca todos los puntos como revisados' : 'Para el paciente, revisado' });
    }
  }
  return ops;
}

function _compartir(doc, titulo, copiado) {
  cerrarMenuCompartir();
  const { e, plan } = planActual();
  const pt = state.planTratamiento;
  let texto;
  if (doc === 'sesion') texto = textoPlanSesion(plan, e, nivelEfectivo(plan.niveles, pt.nivel));
  else if (doc === 'mes') texto = textoPlanMes(plan, e, pt.frecuencia);
  else texto = textoDomiciliario(plan, e, { ejercicios: pt.notas.domiciliario, parar: pt.notas.parar, planNotes: state.planNotes, frecuencia: pt.frecuencia });
  const extra = doc === 'sesion' ? pt.notas.sesion : doc === 'mes' ? pt.notas.mes : '';
  if (!plan.bloqueado && extra?.trim()) texto += `\n\nNOTAS DEL FISIOTERAPEUTA\n${extra.trim()}`;
  compartirTexto(texto, { titulo, copiado });
}

function compartirPlanSesion() { _compartir('sesion', 'Plan de sesión — PhysiQ-Assessment', '✓ Plan de sesión copiado al portapapeles'); }
function compartirPlanMes() { _compartir('mes', 'Plan del mes — PhysiQ-Assessment', '✓ Plan del mes copiado al portapapeles'); }
// Sin «qué hacer» o sin «cuándo parar» (ni aquí ni en la fase 5), pide
// confirmación antes de darle al paciente un programa incompleto.
function compartirDomiciliario() {
  const ir = () => _compartir('casa', 'Programa para casa', '✓ Programa para casa copiado al portapapeles');
  const { plan } = planActual();
  if (plan.bloqueado) return;
  const falta = faltaEnCasa(state.planTratamiento.notas, state.planNotes);
  if (!falta.length) { ir(); return; }
  cerrarMenuCompartir();
  const lista = falta.map(f => `«${f[0].toUpperCase()}${f.slice(1)}»`).join(' y ');
  showConfirmBanner('Programa incompleto',
    `El programa para casa no dice ${falta.join(' ni ')}. Escríbelo en ${lista} o compártelo sin ${falta.length > 1 ? 'esas secciones' : 'esa sección'}.`,
    '<span class="btn-text-full">Compartir igualmente</span><span class="btn-text-short">Compartir</span>', ir, { borra: false });
}

// Para tests/unit/plan-tratamiento.mjs
export { planActual, hipotesisEntrada };

// Exposed for inline onclick/oninput attributes (HTML strings built above and
// the share menu in app.js) — they resolve only against the global scope.
Object.assign(window, { planElegir, planNota, planDuracion, compartirPlanSesion, compartirPlanMes, compartirDomiciliario });
