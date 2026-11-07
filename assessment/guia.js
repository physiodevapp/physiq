// Guía de consulta (guia.html): el porqué de cada elemento de los esquemas
// impresos (docs/esquemas), con la misma numeración, para abrirla desde el QR
// de cada hoja. Se pinta desde data/ con módulos puros (sin app.js ni state):
// nunca pide ni guarda datos del paciente. #<región>/<hoja>[/<elemento>]
import { SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES, DOSIS_DERIVAR } from './data.js';
import { TEXTO_PAUTA_COMPATIBLE } from './lib/posquirurgico.js';
import { citasHTML, citasEnTexto, registroReferencias, enlaceCita } from './lib/citas.js';
import { iaParrafoHTML, ctxCribado, ctxArbol, ctxTest, ctxIrritabilidad, ctxPauta, ctxPronostico, attrIA, atributosIA, initAmpliarIA } from './ampliar-ia.js';
import { initRazonPlegable } from './razon-plegable.js';
import { ITEMS_IRRITABILIDAD, CORTES_OTROS, TEXTOS_IRRITABILIDAD } from './data/irritabilidad.js';
import { nivelMatriz, NOMBRE_NIVEL, reglaIrritabilidad, bandaIrritabilidad } from './lib/irritabilidad.js';
import { lrEfectiva, pesoTest, anatomiaPanelHTML, citasTest, calcLRScore, etiquetaHipHTML, progresoTests, textoProgreso } from './lib/tests-4b.js';
import { resolveOptionTargets } from './lib/arbol.js';
import { cuestionariosEnTexto } from './lib/cuestionarios.js';
import { htmlPlan, initPlan } from './guia-plan.js';
import { htmlCuestionarios, despuesCuestionarios, htmlEjercicio, htmlPreguntar, htmlSintomasGuia } from './guia-extra.js';
import { refsPasoFormulario, textoRefs, preguntaPorRef } from './lib/formulario-numeros.js';
import FORM_COMUN from './formularios/comun.js';
import FORM_CERVICAL from './formularios/cervical.js';
import FORM_HOMBRO from './formularios/hombro.js';
import FORM_CODO from './formularios/codo.js';
import FORM_LUMBAR from './formularios/lumbar.js';
import FORM_CADERA from './formularios/cadera.js';
import FORM_RODILLA from './formularios/rodilla.js';
import FORM_TOBILLO from './formularios/tobillo_pie.js';
import { recomendacionesCondicion, bloquesFase2, lineasTecnica4b, lineasTest } from './lib/guia-condiciones.js';
import { numeroHipotesis, ORDEN_REGIONES, CONDICION_SISTEMA, condicionPregunta, soloDeSistema, preguntasDeRegion, sistemasCribado, etiquetaPaso, HOJAS_GUIA, HOJAS_TEJIDO, datosHojaTejido, definicionCuadernos, nombreHojaImpresa } from './lib/esquemas.js';
import { TIEMPOS_TEJIDO } from './data/tejidos.js';
import { condicionesHTML } from './lib/condiciones.js';
import { farmacosHTML, textoCima } from './lib/farmacos.js';
import { TEXTOS_FARMACOS } from './data/farmacos.js';
import { CUESTIONARIOS } from './data/cuestionarios.js';
import { tiemposTejidoHTML, infoBarraHTML } from './lib/tejidos.js';
import { alternarFicha, cerrarFicha } from './ficha.js';
import { compararVersiones, versionDe, conDetalle, resumenCambios, totalCambios, etiquetaElemento, recortar, textoElemento, diferenciaTexto, paginasReimprimir, hojasCambiadasDesde, hojasCambiadasEnCopia } from './lib/cambios-hojas.js';
import { nombreRegion, dolorInespecifico } from './lib/region.js';
import { textoVersion } from './lib/version.js';
import { htmlFase1, CALC_SISTEMA, initCalculadoras } from './guia-calc.js';
import { THEME_UI, getThemePref, aplicarTema, guardarTema, seguirSistema, aplicarLetra, cambiarLetra } from './lib/apariencia.js';

const REGIONES = ORDEN_REGIONES;   // anatómico, como los cuadernos (lib/esquemas.js)
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtLR = n => n >= 10 ? n.toFixed(0) : n.toFixed(n < 1 ? 2 : 1);   // como phase4b.js
let REF = null;
// Calculadora de la confirmación: { [hipótesis]: { [test]: 'pos'|'neg' } }. Solo en
// memoria: no se guarda en ningún sitio y se borra al recargar o con «Borrar».
const RESULTADOS = {};
// Calculadora de irritabilidad: { [clave de la matriz]: valor }. Igual: solo en memoria.
const IRRITABILIDAD = {};

// ── Piezas comunes del «Por qué» ────────────────────────────────────────────
const seccion = (etq, html) => html ? `<div class="razon-seccion"><div class="razon-etq">${etq}</div>${html}</div>` : '';
const parrafos = texto => (texto || '').split('\n\n').filter(Boolean).map(p => `<p>${citasEnTexto(p)}${iaParrafoHTML()}</p>`).join('');
function fisiologiaHTML(f) {
  if (!f) return '';
  return `<div class="razon-seccion razon-fisio"><div class="razon-etq">Fisiología, paso a paso</div>
    <ol class="razon-pasos">${f.pasos.map(p => `<li>${citasEnTexto(p)}</li>`).join('')}</ol>
    ${f.nota ? `<p class="razon-fisio-nota">${citasEnTexto(f.nota)}</p>` : ''}
    <div class="razon-ia-pie">${iaParrafoHTML()}</div>
    ${f.metafora ? `<p class="razon-metafora"><span aria-hidden="true">💡</span> ${f.metafora}</p>` : ''}</div>`;
}
function fuentesHTML(citas) {
  if (!citas?.length) return '';
  const li = citas.map(c => enlaceCita(c, REF)).map(c => typeof c === 'string' ? `<li>${c}</li>`
    : `<li>${c.texto} <a class="razon-enlace" href="${c.url}" target="_blank" rel="noopener noreferrer">Abrir ↗</a></li>`).join('');
  return `<div class="razon-seccion razon-fuentes"><div class="razon-etq">Fuentes</div><ul>${li}</ul></div>`;
}
// ── Bloques plegables (usuario, 2026-11): cada sistema del cribado y cada hipótesis
// de la confirmación. Su línea (el <summary>) dice qué hay dentro y, abierta, se queda
// fija bajo las pestañas; al final, «Replegar ▴». Los abiertos se recuerdan en memoria
// mientras no cambian la región ni la hoja, para que repintar (un enlace del resumen,
// «Borrar resultados») no los cierre. El aviso de urgencia de la región nunca se pliega.
const ABIERTOS = new Set();
let _rutaPlegables = '';
const plegable = ({ id, clase = '', cab, cuerpo }) =>
  `<details class="guia-bloque guia-plegable${clase}" id="${id}"${ABIERTOS.has(id) ? ' open' : ''}><summary class="guia-bloque-cab">${cab}</summary>`
  + `<div class="guia-bloque-cuerpo">${cuerpo}<button type="button" class="razon-replegar guia-replegar">Replegar ▴</button></div></details>`;
const PLEGAR_TODO = '<div class="guia-plegar-todo"><button type="button" class="guia-plegar-btn" data-plegar-todo>Desplegar todo</button></div>';
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const porQue = (ctx, cuerpo) => cuerpo.trim()
  ? `<details class="razon"><summary>ⓘ Por qué y más</summary><div class="razon-cuerpo" data-ia-ctx="${attrIA(ctx)}">${cuerpo}</div></details>` : '';

// ── Cribado (fase 2) ────────────────────────────────────────────────────────
function htmlCribado(region) {
  const sc = SYSTEMIC_SCREENING[region];
  const { siempre, especiales } = sistemasCribado(SYSTEMIC_SCREENING, region);
  const sistema = s => {
    const preguntas = preguntasDeRegion(s, region);
    const conds = preguntas.map(condicionPregunta);
    const comun = conds.length && conds.every(c => c && c === conds[0]) ? conds[0] : '';
    const solo = soloDeSistema(s);
    const idx = Object.fromEntries(preguntas.map((q, i) => [q.id, i + 1]));
    const c = s.criterioCompuesto;
    const crit = c ? `<div class="guia-crit"><b>${esc(c.etiqueta)}</b> — ${c.minPositivas} o más de las preguntas ${c.ids.map(id => idx[id]).join(', ')}${c.filtro?.edadMax ? ` · edad ≤ ${c.filtro.edadMax}` : ''}${c.filtro?.evolucion ? ` · evolución: ${esc(c.filtro.evolucion)}` : ''}${c.nota ? `<br>${esc(c.nota)}` : ''}</div>` : '';
    const nUrg = preguntas.filter(q => q.urgencia).length, nDer = preguntas.filter(q => q.derivacion).length;
    const cuenta = [plural(preguntas.length, 'pregunta', 'preguntas'),
      nUrg ? `<span class="guia-meta-urg">${plural(nUrg, 'urgencia', 'urgencias')}</span>` : '',
      nDer ? `<span class="guia-meta-der">${plural(nDer, 'derivación', 'derivaciones')}</span>` : ''].filter(Boolean).join(' · ');
    const cab = `<h3>${esc(s.icon || '')} ${esc(s.nombre)}</h3>
      ${solo ? `<div class="guia-cond">Solo con ${esc(CONDICION_SISTEMA[solo])}${comun ? ` · ${esc(comun)}` : ''}</div>` : ''}
      <div class="guia-bloque-meta guia-meta-linea">${cuenta}</div>`;
    return plegable({ id: `sis-${s.id}`, clase: solo ? ' especial' : '', cab, cuerpo: `
      ${preguntas.map((q, k) => {
        const r = q.razonamiento;
        const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`)
          + seccion('Cuánto pesa', `<p>${citasEnTexto(r.peso)}</p>`)
          + fisiologiaHTML(r.fisiologia) + seccion('En detalle', parrafos(r.detalle))
          + anatomiaPanelHTML(q) + fuentesHTML(r.citas || r.fuentes) : '';
        return `<div class="guia-item" id="q-${q.id}"><div class="guia-texto"><span class="guia-num">${k + 1}</span>${esc(q.text)}${q.urgencia ? '<span class="guia-chip urg">URGENCIA</span>' : q.derivacion ? '<span class="guia-chip der">DERIVACIÓN</span>' : ''}${conds[k] && !comun ? `<span class="guia-chip cuando">${esc(conds[k])}</span>` : ''}</div>
          ${q.urgencia ? `<div class="guia-nota guia-der">🚑 ${esc(q.urgencia)}</div>` : q.derivacion ? `<div class="guia-nota">🩺 ${esc(q.derivacion)}</div>` : ''}
          ${porQue(ctxCribado(region, q.text), cuerpo)}</div>`;
      }).join('')}${crit}${banderasHTML(s, region, idx)}${zonasImpactoHTML(s)}${CALC_SISTEMA[s.id]?.() || ''}${consultaCondicionHTML(s)}` });
  };
  const urg = sc.urgencia ? `<div class="guia-urg"><b>${esc(sc.urgencia.titulo)}</b>${sc.urgencia.lineas.map(l => `<div>· ${esc(l)}</div>`).join('')}</div>` : '';
  return `<h2>Cribado sistémico · ${nombreRegion(region)}</h2>${urg}
    ${PLEGAR_TODO}
    ${siempre.map(sistema).join('')}
    ${especiales.length ? `<h2>Condiciones especiales</h2><p class="guia-nota">Solo aparecen en la fase 2 si en la fase 1 está marcada su tarjeta (o el mecanismo «Post-quirúrgico»). La escala de Beighton, la sospecha del subtipo vascular, la prueba de bipedestación y la regla de la tensión en el embarazo tienen su calculadora en su bloque.</p>${especiales.map(sistema).join('')}` : ''}`;
}

// Banderas rojas y amarillas de un sistema (las de la app, fase 2): plegadas al final del bloque.
// Cada una con la pregunta que la recoge (si la hay), «fase 1» si también se pregunta allí,
// cuándo se ve (condición especial) y su propio «Por qué», si lo tiene.
const textoBandera = f => (typeof f === 'string' ? f : f.texto);
function banderasHTML(s, region, idx) {
  const enRegion = f => typeof f === 'string' || !f.regiones || f.regiones.includes(region);
  const rojas = (s.banderasRojas || []).filter(enRegion), amarillas = (s.banderasAmarillas || []).filter(enRegion);
  if (!rojas.length && !amarillas.length) return '';
  const item = f => {
    const o = typeof f === 'string' ? {} : f;
    const qs = [].concat(o.pregunta || []).filter(id => idx[id]);
    const cuando = typeof f === 'string' ? '' : condicionPregunta(f);
    const r = o.razonamiento;
    const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`) + seccion('Cuánto pesa', `<p>${citasEnTexto(r.peso || '')}</p>`)
      + fisiologiaHTML(r.fisiologia) + seccion('En detalle', parrafos(r.detalle)) + fuentesHTML(r.citas || r.fuentes) : '';
    return `<li>${textoBandera(f)}${o.fase1 ? ' <span class="guia-chip cuando">también en la fase 1</span>' : ''}${qs.length ? ` <span class="guia-bandera-q">→ ${qs.map(id => `<a href="#${region}/cribado/q-${id}">pregunta ${idx[id]}</a>`).join(', ')}</span>` : ''}${cuando ? ` <span class="guia-chip cuando">${esc(cuando)}</span>` : ''}
      ${porQue(ctxCribado(region, sinEtiquetas(textoBandera(f))), cuerpo)}</li>`;
  };
  return `<details class="guia-banderas"><summary>🚩 Banderas de este sistema${rojas.length ? ` · ${rojas.length} ${rojas.length === 1 ? 'roja' : 'rojas'}` : ''}${amarillas.length ? ` · ${amarillas.length} ${amarillas.length === 1 ? 'amarilla' : 'amarillas'}` : ''}</summary>
    ${rojas.length ? `<div class="guia-banderas-tit roja">Rojas</div><ul>${rojas.map(item).join('')}</ul>` : ''}
    ${amarillas.length ? `<div class="guia-banderas-tit amarilla">Amarillas</div><ul>${amarillas.map(item).join('')}</ul>` : ''}</details>`;
}
const sinEtiquetas = t => String(t).replace(/<[^>]+>/g, '');

// Condición especial en la consulta (lib/guia-condiciones.js): las preguntas que añade a la fase 2
// fuera del cribado y el recuadro de recomendaciones de la fase 5, con las mismas funciones que la
// app. El de la anafilaxia, abierto: es lo que se busca con prisa.
function consultaCondicionHTML(s) {
  const bloques = bloquesFase2(s);
  const rec = recomendacionesCondicion(s.id);
  const preguntas = bloques.map(b => `<div class="guia-banderas-tit">${esc(b.titulo)}</div>
    <ul>${b.preguntas.map(q => `<li>${esc(q.texto)}${q.diferencial ? ' <em>(no suma: orienta a otra causa)</em>' : ''}</li>`).join('')}</ul>
    ${b.fuentes.filter(Boolean).map(f => `<p class="guia-cc-nota">${citasEnTexto(f)}</p>`).join('')}`).join('');
  const linea = l => `<li>${l.si ? `<b>Si ${esc(l.si.join(' o '))}:</b> ` : ''}${citasEnTexto(l.texto)}${l.no.length ? ` <em>(no si ${esc(l.no.join(' o '))})</em>` : ''}</li>`;
  const recHTML = rec ? rec.map(e => `${rec.length > 1 ? `<div class="guia-banderas-tit">${esc(e.titulo)}</div>` : ''}<ul>${e.lineas.map(linea).join('')}</ul>`).join('') : '';
  return (preguntas ? `<details class="guia-banderas"><summary>📝 Preguntas que añade en la fase 2</summary>${preguntas}</details>` : '')
    + (recHTML ? `<details class="guia-banderas guia-cc-rec"${s.id === 'transversal_mastocitos' ? ' open' : ''}><summary>📋 Recomendaciones (recuadro de la fase 5)</summary>
      <p class="guia-cc-nota">Lo que la app pone en el recuadro de la fase 5 según lo marcado en la tarjeta.</p>${recHTML}</details>` : '');
}

// Líneas de técnica de las condiciones especiales en la confirmación (fase 4b)
function tecnicaCondicionesHTML() {
  return `<details class="guia-banderas guia-cc-tec"><summary>Condiciones especiales: técnica en la exploración</summary>
    <p class="guia-cc-nota">Con la condición marcada, la app pone estas líneas encima de los tests. Las de un test concreto (hipermovilidad, osteoporosis, Gaenslen en el posparto) van bajo ese test.</p>
    <ul>${lineasTecnica4b().map(l => `<li>${l.icono} ${citasEnTexto(l.texto)}</li>`).join('')}</ul></details>`;
}
function lineasTestHTML(t) {
  return lineasTest(t).map(l => `<div class="guia-cc-test">${l.icono} ${citasEnTexto(l.texto)}${l.porque ? `<details><summary>¿Por qué?</summary>${citasEnTexto(l.porque)}</details>` : ''}</div>`).join('');
}

// Zonas de dolor referido e impacto en el descanso y el ejercicio de un sistema (los mismos
// textos que su bloque de la fase 2 de la app), plegados al final del bloque, bajo las banderas
function zonasImpactoHTML(s) {
  const zonas = s.zonasDolor || [], desc = s.impactoDescanso || [], ejer = s.impactoEjercicio || [];
  const bloque = (titulo, html) => `<details class="guia-banderas"><summary>${titulo}</summary>${html}</details>`;
  return (zonas.length ? bloque(`📍 Zonas de dolor referido · ${zonas.length}`,
      `<ul>${zonas.map(z => `<li><b>${z.zona}</b> — ${z.desc}</li>`).join('')}</ul>`) : '')
    + (desc.length || ejer.length ? bloque('🌙 Impacto en el descanso y la tolerancia al ejercicio',
      (desc.length ? `<div class="guia-banderas-tit">Descanso y sueño</div><ul>${desc.map(i => `<li>${i}</li>`).join('')}</ul>` : '')
      + (ejer.length ? `<div class="guia-banderas-tit">Tolerancia al ejercicio</div><ul>${ejer.map(i => `<li>${i}</li>`).join('')}</ul>` : '')) : '');
}

// ── Árbol CIF (fase 4) ──────────────────────────────────────────────────────
// Formulario del paciente en papel: cada paso dice qué preguntas suyas mirar (G = general, R = región)
const FORMULARIOS = { cervical: FORM_CERVICAL, hombro: FORM_HOMBRO, codo: FORM_CODO, lumbar: FORM_LUMBAR, cadera: FORM_CADERA, rodilla: FORM_RODILLA, tobillo_pie: FORM_TOBILLO };
// «📝 Formulario: R1, R3»: cada referencia es un botón que abre la pregunta en la ficha flotante
// (la misma de las citas), para no tener que buscarla en el PDF del formulario
function refsFormularioHTML(region, stepId) {
  const refs = refsPasoFormulario(FORM_COMUN, FORMULARIOS[region], stepId);
  if (!refs.length) return '';
  const boton = r => `<button type="button" class="guia-fpref-btn" data-fpref="${r}" aria-label="Pregunta ${r} del formulario">${r}</button>`;
  const grupos = [refs.filter(r => r[0] === 'G'), refs.filter(r => r[0] === 'R')].filter(g => g.length);
  return `<div class="guia-fpref" data-region="${region}">📝 Formulario: ${grupos.map(g => g.map(boton).join(', ')).join(' · ')}</div>`;
}
function fichaPreguntaHTML(region, ref) {
  const p = preguntaPorRef(FORM_COMUN, FORMULARIOS[region], ref);
  if (!p) return '';
  const { item: it, seccion, hoja } = p;
  const lista = xs => `<ul class="guia-fp-ops">${xs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  let cuerpo = '';
  if (it.tipo === 'matriz') cuerpo = lista(it.filas.map(f => f.texto)) + `<p class="guia-fp-meta">En cada fila: ${esc(it.opciones.join(' · '))}</p>`;
  else if (it.tipo === 'escala') cuerpo = `<p class="guia-fp-meta">Escala de 0 a 10</p>`;
  else if (it.tipo === 'texto') cuerpo = `<p class="guia-fp-meta">Respuesta libre</p>`;
  else cuerpo = lista(it.opciones || []) + (it.tipo === 'multi' ? `<p class="guia-fp-meta">Puede marcar varias</p>` : '');
  const nombreHoja = hoja === 'general' ? 'Formulario general' : `Formulario de ${nombreRegion(region).toLowerCase()}`;
  return `<p class="guia-fp-kicker">${esc(ref)} · ${esc(nombreHoja)}${seccion ? ` · ${esc(seccion)}` : ''}</p><p class="guia-fp-texto">${esc(it.texto)}</p>${cuerpo}`;
}
// Enlaces a los PDF del formulario del paciente (general y de la región), con su versión
function enlacesFormulario(region) {
  const a = (clave, txt) => `<a href="${urlPDF(clave, HUELLAS?.[clave]?.huella)}" target="_blank" rel="noopener">${txt} ↗</a>`;
  return ` Formulario en PDF: ${a(`formulario-${region}`, nombreRegion(region))} · ${a('formulario-comun', 'General')}.`;
}
document.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('[data-fpref]') : null;
  if (!b) return;
  alternarFicha(b, fichaPreguntaHTML(b.closest('[data-region]')?.dataset.region, b.dataset.fpref), { id: 'fpFicha', clase: 'guia-fp-ficha' });
});
function htmlArbol(region) {
  const tree = CIF_TREES[region], steps = tree.steps;
  const lab = id => { const i = steps.findIndex(s => s.id === id); return etiquetaPaso(steps[i], i); };
  return `<h2>${esc(tree.title || `Árbol de decisión · ${nombreRegion(region)}`)}</h2>
    <p class="guia-nota">Cada respuesta puede sumar una hipótesis; se acumulan y se confirman con tests en la fase 4b. «📝 Formulario» = preguntas del formulario del paciente que tocan el paso (G = hoja general, R = hoja de la región); toca una para verla.${enlacesFormulario(region)}</p>
    <p class="guia-nota">En la hoja impresa, «Todas» sobre una flecha significa que cualquier respuesta de ese paso sigue al paso siguiente: las respuestas solo deciden qué hipótesis suman. Si la flecha lleva nombres de respuestas, solo esas siguen por ella.</p>
    ${steps.map((st, i) => {
      const r = st.razonamiento;
      const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`)
        + seccion('En detalle', parrafos(r.detalle)) + fuentesHTML(r.citas || r.fuentes) : '';
      const ops = st.options.map(o => {
        const [corto, ...resto] = o.label.split('—');
        const hips = o.hypothesis.map(h => HYPOTHESES[h]).filter(Boolean).map(h => `<span class="guia-hip">${esc(numeroHipotesis(h.num))} ${esc(h.name)}</span>`).join(', ');
        const t = resolveOptionTargets(tree, i, o)[0];
        const ruta = !t ? 'fin del árbol' : t.id !== steps[i + 1]?.id
          ? `<a class="guia-salto" href="#${region}/arbol/paso-${t.id}">sigue en el paso ${esc(lab(t.id))}</a>` : '';   // salto, enlazado (usuario, 2026-11)
        const res = [hips, o.derivacion ? `<span class="guia-der">Derivación médica: ${esc(o.derivacion)}</span>` : '', ruta].filter(Boolean).join(' · ');
        return `<li><b>${esc(corto.trim())}</b>${resto.length ? ` — ${esc(resto.join('—').trim())}` : ''}${res ? ` → ${res}` : ''}</li>`;
      }).join('');
      return `<section class="guia-bloque guia-item" id="paso-${st.id}"><h3><span class="guia-num">${esc(lab(st.id))}</span>${esc(st.question)}</h3>
        ${refsFormularioHTML(region, st.id)}
        <ul class="guia-ops">${ops}</ul>${porQue(ctxArbol(region, st.iaPregunta || st.question), cuerpo)}</section>`;
    }).join('')}
    <div class="guia-sinhip" id="sin-hipotesis"><b>Si el árbol termina sin ninguna hipótesis</b>
      <p>No hay un patrón dominante claro: puede ser una presentación atípica o un dolor musculoesquelético inespecífico. La app propone:</p>
      <ul><li>Trabajar con la hipótesis de trabajo «${esc(dolorInespecifico(region))}».</li>
        <li>Revisar los factores psicosociales (fase 1 y SINSS).</li>
        <li>Volver al árbol y reconsiderar las respuestas.</li>
        <li>Si el cuadro es crónico (más de 3 meses) y el riesgo psicosocial es alto, considerar también sensibilización central como hipótesis complementaria.</li></ul>
      <p>Es una regla de la app, sin fuente citada. La fase 4b no tiene tests que hacer en ese caso.</p></div>`;
}

// ── Pauta y pronóstico de una hipótesis (los de la fase 5, sin paciente) ─────
// Contenido fijo de data/: la pauta (todas sus situaciones, si se reparte en ramas), su fuente
// y el pronóstico. No es un plan de sesión: eso es la fase 6, que tiene en cuenta urgencias,
// condiciones especiales y red de seguridad que la guía no conoce. La derivación, siempre a la vista.
function pautaHipHTML(h, region) {
  if (h.dosis === DOSIS_DERIVAR) return `<div class="guia-urg"><b>🚑 Derivación</b>${esc(DOSIS_DERIVAR)}</div>`;
  const p = h.pronostico;
  const linea = (et, t) => t ? `<p data-ia-parrafo>${et ? `<b>${et}</b> ` : ''}${citasEnTexto(t)}${iaParrafoHTML()}</p>` : '';
  const pauta = h.dosisRamas?.length
    ? h.dosisRamas.map(r => linea('', r.texto)).join('') + linea('', h.dosisComun)   // cada rama empieza por su situación
    : h.dosis ? linea('', h.dosis) : '<p><em>Sin dosis de referencia: a criterio del clínico.</em></p>';
  return `<details class="razon guia-pauta"><summary>💊 Pauta y pronóstico</summary><div class="razon-cuerpo">
    <div class="razon-seccion" ${atributosIA(ctxPauta(region, h.name))}><div class="razon-etq">${h.dosisFuente ? 'Pauta de tratamiento' : 'Dosis día 1 (baja fricción)'}</div>${pauta}
      ${h.dosisFuente ? `<div class="razon-pie">${citasHTML(h.dosisFuente)}</div>` : ''}
      ${h.dosis ? `<p class="guia-nota">🏥 Tras una cirugía: ${esc(TEXTO_PAUTA_COMPATIBLE.charAt(0).toLowerCase() + TEXTO_PAUTA_COMPATIBLE.slice(1))}</p>` : ''}</div>
    ${p ? `<div class="razon-seccion" ${atributosIA(ctxPronostico(region, h.name))}><div class="razon-etq">Pronóstico y derivación</div>${linea('', p.horizonte)}${linea('Seguimiento:', p.seguimiento)}${linea('A tener en cuenta:', p.notas)}${linea('Reconsiderar o derivar si:', p.derivacion)}
      ${p.fuente ? `<div class="razon-pie">${citasHTML(p.fuente)}</div>` : ''}</div>` : ''}
  </div></details>`;
}

// ── Confirmación (fase 4b) ──────────────────────────────────────────────────
function htmlConfirmacion(region) {
  const hyps = Object.values(HYPOTHESES).filter(h => h.region === region);
  const lrTxt = t => {
    const lr = lrEfectiva(t);
    const f = (v, o, util) => v == null ? '—' : `<span class="${util && t.tipo !== 'pronostico' ? 'util' : ''}">${o === 'calculada' ? '≈' : ''}${fmtLR(v)}</span>`;
    return `LR+ ${f(lr.pos, lr.origenPos, lr.posUtil)} · LR− ${f(lr.neg, lr.origenNeg, lr.negUtil)}`;
  };
  return `<h2>Confirmación de hipótesis · ${nombreRegion(region)}</h2>
    <p class="guia-nota">LR en verde: multiplica la puntuación (LR+ ≥ 2 o LR− ≤ 0,5). «≈» = calculada de S y E.</p>
    <div id="guiaResumenCalc">${resumenCalcHTML(region)}</div>
    ${tecnicaCondicionesHTML()}
    ${PLEGAR_TODO}
    ${hyps.map(h => {
      const clusters = Object.entries(h.clusters || {}).map(([cid, c]) => {
        const n = h.tests.filter(t => t.cluster === cid).length, lr = lrEfectiva(c);
        const reglas = [lr.posUtil ? `≥${c.umbralPos} de ${n} positivos → LR+ ${fmtLR(lr.pos)}` : '', lr.negUtil && c.umbralNeg != null ? `${c.umbralNeg === 0 ? 'ninguno' : `≤${c.umbralNeg}`} de ${n} positivos (todos hechos) → LR− ${fmtLR(lr.neg)}` : ''].filter(Boolean).join(' · ');
        return `<div class="guia-crit">🧩 <b>${esc(c.nombre)}</b>: ${reglas || 'sin LR aplicable'}. Sus tests no puntúan por separado.${c.fuente ? ` ${citasHTML(c.fuente)}` : ''}</div>`;
      }).join('');
      const tests = h.tests.map((t, k) => {
        const r = t.razonamiento;
        const cuerpo = (r?.porque ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`) : '')
          + seccion('En detalle', parrafos(r?.detalle)) + anatomiaPanelHTML(t) + fuentesHTML(citasTest(t));
        return `<div class="guia-item" id="test-${h.id}-${k}"><div class="guia-texto">${esc(t.name)}</div>
          <div class="guia-lr">${t.cluster ? `en el clúster ${esc(h.clusters?.[t.cluster]?.nombre || '')}` : lrTxt(t)}</div>
          <div class="guia-peso">${pesoTest(h, t, k)}</div>
          ${t.criterio ? `<div class="guia-criterio" ${atributosIA(ctxTest(region, t.name, h.name))} data-ia-parrafo>${citasEnTexto(t.criterio)}${iaParrafoHTML()}</div>` : ''}
          ${lineasTestHTML(t)}
          ${botonesTest(h.id, k)}
          ${porQue(ctxTest(region, t.name, h.name), cuerpo)}</div>`;
      }).join('');
      const cab = `<h3><span class="guia-num">${esc(numeroHipotesis(h.num))}</span>${esc(h.name)}</h3>
        <div class="guia-bloque-meta">${h.dosis === DOSIS_DERIVAR ? '<span class="guia-meta-urg">🚑 Derivación</span>' : ''}<span class="guia-puntua" data-puntua="${h.id}">${puntuaHTML(h)}</span><span class="guia-progreso" data-progreso="${h.id}">${progresoHTML(h)}</span></div>`;
      return plegable({ id: `hip-${h.id}`, cab, cuerpo: `
        ${h.prom ? `<p class="guia-prom"><span class="guia-et">Cuestionario recomendado</span> ${esc(h.prom)}${cuestionariosEnTexto(h.prom, CUESTIONARIOS).map(id => ` <a class="guia-calc-link" href="#cuestionarios/${id}">Calcular ${esc(CUESTIONARIOS.find(d => d.id === id).nombre)} →</a>`).join('')}</p>` : ''}${clusters}${tests}${pautaHipHTML(h, region)}` });
    }).join('')}`;
}

// ── Calculadora (mismas reglas que la fase 4b: calcLRScore, lib/tests-4b.js) ──
const RES_BTN = [['pos', '✓ Positivo'], ['neg', '✗ Negativo'], ['nd', 'Sin datos']];
function botonesTest(hId, k) {
  const r = RESULTADOS[hId]?.[k] || 'nd';
  return `<div class="test-result-btns guia-calc" role="group" aria-label="Resultado">${RES_BTN.map(([v, t]) =>
    `<button type="button" class="test-result-btn ${v}${r === v ? ' selected' : ''}" data-hip="${hId}" data-test="${k}" data-res="${v}" aria-pressed="${r === v}">${t}</button>`).join('')}</div>`;
}
function puntuaHTML(h) {
  const res = RESULTADOS[h.id] || {};
  return Object.keys(res).length ? etiquetaHipHTML(calcLRScore(h, res).label) : '<span class="guia-sin">Sin evaluar</span>';
}
// «2 de 5 tests hechos», como la cabecera plegada de la 4b (progresoTests)
const progresoHTML = h => textoProgreso(progresoTests(h, RESULTADOS[h.id]));
function resumenCalcHTML(region) {
  const hechas = Object.values(HYPOTHESES).filter(h => h.region === region && Object.keys(RESULTADOS[h.id] || {}).length)
    .map(h => ({ h, p: calcLRScore(h, RESULTADOS[h.id]) })).sort((a, b) => b.p.totalLR - a.p.totalLR);
  if (!hechas.length) return '<p class="guia-nota">Marca el resultado de los tests que hagas y cada hipótesis se puntúa como en la fase 4b de la app. No se guarda nada: se borra al recargar.</p>';
  return `<div class="guia-resumen"><div class="guia-resumen-cab"><b>Puntuación</b><button type="button" class="guia-borrar" data-borrar>Borrar resultados</button></div>
    ${hechas.map(({ h, p }) => `<a href="#${region}/confirmacion/hip-${h.id}" class="guia-resumen-fila"><span>${esc(numeroHipotesis(h.num))} ${esc(h.name)}</span>${etiquetaHipHTML(p.label)}</a>`).join('')}
    <p class="guia-nota">No se guarda nada: se borra al recargar. Para la valoración completa, usa la app.</p></div>`;
}
function pintarCalc(region) {
  const r = document.getElementById('guiaResumenCalc');
  if (r) r.innerHTML = resumenCalcHTML(region);
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const b = t?.closest('.guia-calc .test-result-btn');
  if (b) {
    const { hip, test, res } = b.dataset;
    const actual = RESULTADOS[hip] || (RESULTADOS[hip] = {});
    if (res === 'nd' || actual[test] === res) delete actual[test]; else actual[test] = res;
    if (!Object.keys(actual).length) delete RESULTADOS[hip];
    b.parentElement.outerHTML = botonesTest(hip, Number(test));
    const p = document.querySelector(`[data-puntua="${hip}"]`);
    if (p) p.innerHTML = puntuaHTML(HYPOTHESES[hip]);
    const g = document.querySelector(`[data-progreso="${hip}"]`);
    if (g) g.textContent = progresoHTML(HYPOTHESES[hip]);
    pintarCalc(HYPOTHESES[hip].region);
    return;
  }
  if (t?.closest('[data-borrar]')) {
    Object.keys(RESULTADOS).forEach(k => delete RESULTADOS[k]);
    pintar();
  }
});

// ── Irritabilidad (fase 3): la matriz y la regla de la app (nivelMatriz, lib/irritabilidad.js) ──
function resultadoIrritabHTML(region) {
  const T = TEXTOS_IRRITABILIDAD, m = nivelMatriz(IRRITABILIDAD);
  if (!m.nivel) return `<div class="guia-irr-res"><span class="guia-irr-icono">⚪</span><span>${citasEnTexto(T.noRegistrada)}</span></div>`;
  const nivel = NOMBRE_NIVEL[m.nivel];
  const emoji = { baja: '🟢', moderada: '🟠', alta: '🔴' }[m.nivel];
  const textos = [m.nivel === 'baja' ? T.hastaLimite : T.hastaDolor, ...(m.nivel === 'alta' ? [T.alta] : [])];
  const falta = m.incompleta ? (m.sinCalma ? T.sinCalma : T.incompleta) : '';
  return `<div class="guia-irr-res guia-irr-${m.nivel}"><span class="guia-irr-icono">${emoji}</span>
    <span ${atributosIA(ctxIrritabilidad(region, nivel))}><strong>Irritabilidad ${nivel}</strong> — <span data-ia-parrafo>${citasEnTexto(textos.join(' '))}${iaParrafoHTML()}</span>
    ${falta ? `<br><em>${citasEnTexto(falta)}</em>` : ''}<br><span class="guia-irr-margen">${citasEnTexto(T.margen)}</span></span></div>`;
}
function filaIrritabHTML(it) {
  const v = IRRITABILIDAD[it.clave] || '';
  return `<div class="guia-item guia-irr-fila"><div class="guia-texto">${esc(it.nombre)}</div>
    ${it.ayuda ? `<div class="guia-criterio">${citasEnTexto(esc(it.ayuda))}</div>` : ''}
    <div class="option-group guia-irr-ops" role="group" aria-label="${esc(it.nombre)}">${it.opciones.map((o, i) =>
      `<button type="button" class="option-btn${v === o.valor ? ' selected' : ''}" data-irr="${it.clave}" data-valor="${esc(o.valor)}" aria-pressed="${v === o.valor}"><span class="guia-irr-n">${i}</span> ${esc(o.valor)}</button>`).join('')}</div></div>`;
}
function htmlIrritabilidad(region, { conTitulo = true } = {}) {
  return `${conTitulo ? '<h2>Irritabilidad (fase 3)</h2>' : ''}
    <p class="guia-nota">La misma matriz y la misma regla que la fase 3 de la app (y la fase 6). Marca lo que refiere el paciente; un segundo toque desmarca. No se guarda nada: se borra al recargar.</p>
    <div id="guiaIrrRes">${resultadoIrritabHTML(region)}</div>
    <button type="button" class="guia-irr-banda" id="guiaIrrBanda" hidden><span class="guia-vh">Ir al resumen: </span><span data-b="emoji" aria-hidden="true"></span> <strong data-b="nivel"></strong> <span class="guia-irr-banda-det" data-b="detalle"></span><span class="guia-irr-banda-dir" aria-hidden="true">↑ volver</span></button>
    <section class="guia-bloque">${ITEMS_IRRITABILIDAD.map(filaIrritabHTML).join('')}
      <div class="guia-irr-pie"><button type="button" class="guia-borrar" data-irr-borrar>Borrar respuestas</button></div></section>
    <details class="razon guia-irr-regla"><summary>ⓘ Cómo se calcula</summary><div class="razon-cuerpo">
      ${reglaIrritabilidad().map(p => `<p>${p}</p>`).join('')}
    </div></details>`;
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const b = t?.closest('[data-irr]');
  if (b) {
    const { irr, valor } = b.dataset;
    if (IRRITABILIDAD[irr] === valor) delete IRRITABILIDAD[irr]; else IRRITABILIDAD[irr] = valor;
    b.closest('.guia-irr-ops').querySelectorAll('[data-irr]').forEach(x => {
      const on = IRRITABILIDAD[irr] === x.dataset.valor;
      x.classList.toggle('selected', on); x.setAttribute('aria-pressed', on);
    });
    document.getElementById('guiaIrrRes').innerHTML = resultadoIrritabHTML(leerRuta().region);
    bandaIrr();
    return;
  }
  if (t?.closest('#guiaIrrBanda')) { document.getElementById('guiaIrrRes')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  if (t?.closest('[data-irr-borrar]')) {
    Object.keys(IRRITABILIDAD).forEach(k => delete IRRITABILIDAD[k]);
    pintar();
  }
});

// Banda de una línea bajo las pestañas con el nivel calculado y lo que falta, mientras
// se marca la matriz y el recuadro completo (encima) no se ve (usuario, 2026-11); el
// mismo texto que la banda de la fase 3 de la app (bandaIrritabilidad()).
function bandaIrr() {
  const banda = document.getElementById('guiaIrrBanda'), res = document.getElementById('guiaIrrRes');
  if (!banda || !res) return;
  const nav = document.querySelector('.guia-nav')?.getBoundingClientRect();
  const arriba = nav ? Math.max(0, nav.bottom) : 0;
  const filas = [...document.querySelectorAll('.guia-irr-fila')];
  const m = filas.length ? { top: filas[0].getBoundingClientRect().top, bottom: filas.at(-1).getBoundingClientRect().bottom } : null;
  const r = res.getBoundingClientRect();
  const ver = !!m && m.bottom > arriba + 60 && m.top < window.innerHeight - 48 && !(r.bottom > arriba + 8 && r.top < window.innerHeight);
  if (ver) {
    const b = bandaIrritabilidad(IRRITABILIDAD);
    for (const k of ['emoji', 'nivel', 'detalle']) { const el = banda.querySelector(`[data-b="${k}"]`); if (el.textContent !== b[k]) el.textContent = b[k]; }
    banda.style.top = `${arriba}px`;
  }
  banda.hidden = !ver;
}
window.addEventListener('scroll', () => requestAnimationFrame(bandaIrr), { passive: true });
window.addEventListener('resize', () => requestAnimationFrame(bandaIrr));

// ── Tiempos de recuperación de tejidos (#tejidos/<hoja>, el QR de sus dos hojas) ──
// La misma gráfica que el panel ⏱ de la app (lib/tejidos.js), con los grupos de esa hoja;
// tocar una barra abre su ficha (gravedad, qué mide, plazo y fuentes). Sin «Este paciente»
// ni «Hoy»: la guía no tiene datos del paciente. El filtro, solo en memoria.
let FILTRO_TEJ = 'todos';
const datosTejido = hoja => datosHojaTejido(TIEMPOS_TEJIDO, hoja);
function htmlTejidos(hoja) {
  return `<p class="guia-nota">Referencia general, no un plazo para un paciente: cada barra dice qué mide (vuelta al deporte, protección, programa…). Toca una barra para ver su nota y sus fuentes.</p>
    <div class="guia-tejidos tejidos-cuerpo">${tiemposTejidoHTML(datosTejido(hoja), { filtro: FILTRO_TEJ, REF })}</div>`;
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  if (!t?.closest('.guia-tejidos')) return;
  const barra = t.closest('.tej-barra[data-barra]');
  if (barra) { alternarFicha(barra, infoBarraHTML(datosTejido(leerRuta().hoja), barra.dataset.barra, REF), { id: 'tejInfo', clase: 'tej-info' }); return; }
  const b = t.closest('[data-filtro-tejido]');
  if (!b) return;
  FILTRO_TEJ = b.dataset.filtroTejido;
  cerrarFicha({ sinFoco: true });
  pintar({ sinScroll: true });
  document.querySelector(`.guia-tejidos .tej-filtro-btn[data-grupo="${b.dataset.grupo}"]`)?.focus({ preventScroll: true });
});

document.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('[data-filtro-hojas]') : null;
  if (!b) return;
  FILTRO_HOJAS = FILTRO_HOJAS === b.dataset.filtroHojas ? '' : b.dataset.filtroHojas;
  pintar({ sinScroll: true });
  document.querySelector(`[data-filtro-hojas="${b.dataset.filtroHojas}"]`)?.focus({ preventScroll: true });
});

// ── ¿Está al día la hoja impresa? ───────────────────────────────────────────
// El QR de cada hoja lleva su huella (?h=, docs/esquemas/hojas.mjs). Si no coincide con la
// actual (docs/esquemas/huellas.json, desplegado en la misma ruta con los PDF), la guía avisa y enlaza el PDF
// actual para reimprimirla. Solo en la hoja de la que vino el QR (historial/indice.json dice cuál
// es, aunque se haya recargado en otra pestaña con el ?h= aún en la dirección); sin ?h= o sin huellas, nada.
// Qué cambió desde el papel sale del historial de esa hoja (lib/cambios-hojas.js): en el aviso, una
// línea y «Ver cambios» plegado; en la página, una marca en cada elemento que cambió (usuario, 2026-11:
// en el móvil, sin más scroll ni ruido salvo que se quiera ver el detalle).
const HUELLA_PAPEL = new URLSearchParams(location.search).get('h') || '';
let HOJA_PAPEL = '', HUELLAS = null;
// Lo que cambió desde la versión del papel: { version (la del papel), d (compararVersiones) }; null
// si el papel está al día, o si su versión no tiene detalle (anterior al registro de cambios)
let CAMBIOS_PAPEL = null;
function claveHoja({ tejidos, suelta, region, hoja }) {
  if (suelta) return suelta;
  if (tejidos) return `tejidos-${hoja}`;
  return hoja === 'arbol' ? `arbol-a4-${region}` : hoja === 'irritabilidad' ? '' : `${hoja}-${region}`;
}
let CUADERNOS = null;
// Cada versión de cada cuaderno: { huella: { clave, fecha, hojas } } (docs/esquemas/cuadernos-historial.json)
let CUADERNOS_HIST = null;
// La «cuaderno v.» del QR de su portada (?c=): la guía abre ese cuaderno con lo que hay que reimprimir
const VERSION_CUADERNO = (new URLSearchParams(location.search).get('c') || '').toLowerCase();
async function cargarHuellas() {
  try {
    const r = await fetch('./docs/esquemas/huellas.json', { cache: 'no-store' });
    if (r.ok) HUELLAS = await r.json();
  } catch { /* sin red o sin archivo: sin aviso */ }
  try {
    const r = await fetch('./docs/esquemas/cuadernos.json', { cache: 'no-store' });
    if (r.ok) CUADERNOS = await r.json();
  } catch { /* sin cuadernos: la lista de hojas sigue */ }
  try {
    const r = await fetch('./docs/esquemas/cuadernos-historial.json', { cache: 'no-store' });
    if (r.ok) CUADERNOS_HIST = await r.json();
  } catch { /* sin historial: queda la fecha de impresión */ }
}
const HISTORIAL = {};
async function cargarHistorial(clave) {
  if (!HISTORIAL[clave]) {
    HISTORIAL[clave] = fetch(`./docs/esquemas/historial/${clave}.json`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : [])).catch(() => []);
  }
  return HISTORIAL[clave];
}
// De qué hoja es el papel y qué cambió desde entonces
async function identificarPapel() {
  let indice = {};
  try { const r = await fetch('./docs/esquemas/historial/indice.json', { cache: 'no-store' }); if (r.ok) indice = await r.json(); } catch { /* sin índice */ }
  const actual = HUELLAS && Object.keys(HUELLAS).find(k => HUELLAS[k].huella === HUELLA_PAPEL);
  HOJA_PAPEL = actual || indice[HUELLA_PAPEL] || claveHoja(leerRuta());
  if (!HUELLAS?.[HOJA_PAPEL] || HUELLAS[HOJA_PAPEL].huella === HUELLA_PAPEL) return;
  const hist = await cargarHistorial(HOJA_PAPEL);
  const version = versionDe(hist, HUELLA_PAPEL), ultima = versionDe(hist, HUELLAS[HOJA_PAPEL].huella);
  if (conDetalle(version) && conDetalle(ultima)) CAMBIOS_PAPEL = { version, d: compararVersiones(version, ultima) };
}
// Enlace a un PDF con su versión (?v=): una versión nueva es otra dirección, así el navegador
// (o el visor de PDF del móvil) no abre la copia que ya tenía en caché.
const urlPDF = (clave, v) => `./docs/esquemas/${clave}.pdf${v ? `?v=${encodeURIComponent(v)}` : ''}`;
const fechaCortaDe = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
// Botón que despliega un bloque oculto (la lista de cambios): una línea mientras está plegado
const botonVer = (id, texto, extra = '') => `<button type="button" class="guia-ver" aria-expanded="false" aria-controls="${id}"${extra}>${texto} <span aria-hidden="true">▾</span></button>`;
function avisoHojaHTML(clave) {
  if (!HUELLA_PAPEL || !HUELLAS || !clave || clave !== HOJA_PAPEL || !HUELLAS[clave]) return '';
  const actual = HUELLAS[clave].huella;
  if (actual === HUELLA_PAPEL) return `<div class="guia-papel ok" id="guiaPapel">✓ Tu hoja impresa está al día (v. ${esc(HUELLA_PAPEL)}).</div>`;
  const pdf = `<a class="guia-papel-pdf" href="${urlPDF(clave, actual)}" target="_blank" rel="noopener">PDF actual ↗</a>`;
  const d = CAMBIOS_PAPEL?.d;
  if (d?.soloFormato) {
    return `<div class="guia-papel ok" id="guiaPapel">✓ Tu hoja impresa sigue valiendo: desde que se imprimió (v. ${esc(HUELLA_PAPEL)}) solo cambió el formato, no el contenido.</div>`;
  }
  if (!d) {
    return `<div class="guia-papel" id="guiaPapel"><b>Tu hoja impresa es de una versión anterior</b>
      <p>Es anterior al registro de cambios (v. ${esc(HUELLA_PAPEL)}; la actual es v. ${esc(actual)}): no se puede detallar qué cambió. Manda lo que ves aquí.</p>
      <div class="guia-papel-acc">${pdf}</div></div>`;
  }
  const regional = !!leerRuta().region && !leerRuta().suelta && !leerRuta().tejidos;
  const consejo = d.numeracion ? 'Cambió la numeración: reimprímela.'
    : regional ? 'Sus números siguen valiendo; lo cambiado va marcado.' : 'Reimprímela cuando puedas.';
  return `<div class="guia-papel" id="guiaPapel"><b>Tu hoja impresa es de una versión anterior</b>
    <p><span class="guia-papel-res">${esc(resumenCambios(d))}</span> desde tu hoja del ${esc(fechaCortaDe(CAMBIOS_PAPEL.version.fecha))}. ${consejo}</p>
    <div class="guia-papel-acc">${botonVer('guiaPapelLista', `Ver cambios (${totalCambios(d)})`)}${pdf}</div>
    <div id="guiaPapelLista" class="guia-cambios" hidden>${listaCambiosHTML(d, leerRuta())}</div></div>`;
}

// La lista de cambios (aviso del papel y «Hojas para imprimir»): una línea por elemento, con
// enlace a él si sigue en la hoja; los otros textos, como frases quitadas y nuevas (las primeras)
const MAX_FRASES = 5;
// Lo que cambió dentro de un texto: unas palabras de contexto, lo quitado tachado y lo nuevo resaltado
function difHTML(antes, ahora) {
  const f = diferenciaTexto(antes, ahora);
  const r = t => esc(recortar(t, 120));
  return `${f.inicio ? '…' : ''}${esc(f.ctxAntes)} ${f.antes ? `<del>${r(f.antes)}</del> ` : ''}${f.ahora ? `<ins>${r(f.ahora)}</ins> ` : ''}${esc(f.ctxDespues)}${f.fin ? '…' : ''}`;
}
function listaCambiosHTML(d, ruta = {}) {
  // La etiqueta enlaza al elemento en su página (si sigue en la hoja); el texto, sin subrayar
  const etq = it => {
    const href = ruta.region && it.ancla ? `#${ruta.region}/${ruta.hoja}/${it.ancla}` : '';
    return href ? `<a href="${href}"><b>${esc(etiquetaElemento(it))}</b></a>` : `<b>${esc(etiquetaElemento(it))}</b>`;
  };
  const antes = it => (it.antesPos != null ? ` <span class="guia-cambio-antes">(antes ${esc(etiquetaElemento(it, it.antesPos))})</span>` : '');
  const fila = (tipo, et, it, cuerpo) => `<li><span class="guia-cambio-tipo ${tipo}">${et}</span> ${etq(it)}${antes(it)} · ${cuerpo}</li>`;
  const corto = it => esc(recortar(textoElemento(it), 80));
  const frases = (lista, tipo, et) => lista.slice(0, MAX_FRASES).map(f => `<li><span class="guia-cambio-tipo ${tipo}">${et}</span> «${esc(recortar(f, 140))}»</li>`).join('')
    + (lista.length > MAX_FRASES ? `<li class="guia-cambio-mas">y ${lista.length - MAX_FRASES} más</li>` : '');
  return `<ul>${[
    ...d.cambiados.map(it => fila('cambio', 'Cambió', it, difHTML(textoElemento({ ...it, texto: it.antesTexto }), textoElemento(it)))),
    ...d.nuevos.map(it => fila('nuevo', 'Nuevo', it, corto(it))),
    ...d.movidos.map(it => fila('numero', 'Nº', it, corto(it))),
    ...d.quitados.map(it => fila('quitado', 'Quitado', it, corto(it))),
  ].join('')}${d.otros ? frases(d.textos.quitadas, 'quitado', 'Quitado') + frases(d.textos.nuevas, 'nuevo', 'Nuevo') : ''}</ul>`;
}

// En la página de la hoja del papel: una marca en cada elemento que cambió (toque = qué decía tu
// hoja), y en la línea de cada sistema o hipótesis plegados, «Con cambios»
const MARCA_CAMBIO = { cambio: 'Cambió', nuevo: 'Nuevo', numero: 'Nº cambiado' };
function marcarCambios() {
  const d = CAMBIOS_PAPEL?.d, ruta = leerRuta();
  if (!d || !ruta.region || ruta.suelta || ruta.tejidos || claveHoja(ruta) !== HOJA_PAPEL) return;
  const items = [...d.cambiados.map(it => ['cambio', it]), ...d.nuevos.map(it => ['nuevo', it]), ...d.movidos.map(it => ['numero', it])];
  for (const [tipo, it] of items) {
    const el = it.ancla && document.getElementById(it.ancla);
    if (!el) continue;
    // Detrás del número, en la primera línea: se ve sin buscarla
    const donde = el.matches('details') ? el.querySelector(':scope > summary h3') : el.querySelector('.guia-texto, h3');
    if (!donde || donde.querySelector('.guia-cambio')) continue;
    const num = donde.querySelector('.guia-num');
    (num || donde).insertAdjacentHTML(num ? 'afterend' : 'afterbegin', `<button type="button" class="guia-cambio ${tipo}" data-cambio="${esc(it.clave)}" aria-label="${MARCA_CAMBIO[tipo]} desde tu hoja impresa: ver qué decía">${MARCA_CAMBIO[tipo]}</button> `);
    const bloque = el.closest('details.guia-plegable');
    const meta = bloque && bloque !== el && bloque.querySelector(':scope > summary .guia-bloque-meta');
    if (meta && !meta.querySelector('.guia-meta-cambio')) meta.insertAdjacentHTML('beforeend', `${meta.classList.contains('guia-meta-linea') ? ' · ' : ''}<span class="guia-meta-cambio">Con cambios</span>`);
  }
}
function fichaCambioHTML(clave) {
  const d = CAMBIOS_PAPEL.d;
  const it = [...d.cambiados, ...d.nuevos, ...d.movidos].find(x => x.clave === clave);
  if (!it) return '';
  const kicker = `<p class="guia-fp-kicker">Tu hoja impresa · v. ${esc(HUELLA_PAPEL)}</p>`;
  if (!it.antesTexto && it.antesPos == null) return `${kicker}<p class="guia-fp-texto">No está en tu hoja impresa: es nuevo.</p>`;
  const pos = it.antesPos != null ? `<p class="guia-fp-meta">En tu hoja era «${esc(etiquetaElemento(it, it.antesPos))}»; ahora, «${esc(etiquetaElemento(it))}».</p>` : '';
  return `${kicker}${it.antesTexto ? `<p class="guia-fp-meta">Lo que cambió (tachado, lo de tu hoja):</p><p class="guia-fp-texto guia-dif">${difHTML(textoElemento({ ...it, texto: it.antesTexto }), textoElemento(it))}</p>` : ''}${pos}`;
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const marca = t?.closest('[data-cambio]');
  if (marca && CAMBIOS_PAPEL) {
    e.preventDefault();   // dentro de la línea de un bloque, no lo pliega ni despliega
    alternarFicha(marca, fichaCambioHTML(marca.dataset.cambio), { id: 'cambioFicha', clase: 'guia-fp-ficha' });
    return;
  }
  const ver = t?.closest('.guia-ver');
  if (!ver) return;
  const caja = document.getElementById(ver.getAttribute('aria-controls'));
  if (!caja) return;
  const abrir = caja.hidden;
  caja.hidden = !abrir;
  ver.setAttribute('aria-expanded', String(abrir));
  if (abrir && ver.dataset.cargar) cargarCambiosHoja(ver.dataset.cargar, caja);
});
// La página de la guía de una hoja de región, por su clave (para enlazar sus elementos)
function rutaDeClave(clave) {
  const m = clave.match(/^(cribado|arbol-a4|confirmacion)-(.+)$/);
  return m ? { region: m[2], hoja: m[1] === 'arbol-a4' ? 'arbol' : m[1] } : {};
}
// «Hojas para imprimir»: qué cambió en el último cambio de una hoja (su versión anterior → la actual)
async function cargarCambiosHoja(clave, caja) {
  if (caja.dataset.cargado) return;
  caja.dataset.cargado = '1';
  caja.innerHTML = '<p class="guia-cambios-nota">Cargando…</p>';
  const hist = await cargarHistorial(clave);
  const i = hist.findIndex(v => v.huella === HUELLAS?.[clave]?.huella);
  const antes = i > 0 ? hist[i - 1] : null, ahora = hist[i];
  if (!conDetalle(antes) || !conDetalle(ahora)) {
    caja.innerHTML = '<p class="guia-cambios-nota">No se puede detallar: la versión anterior es de antes del registro de cambios.</p>';
    return;
  }
  const d = compararVersiones(antes, ahora);
  caja.innerHTML = d.soloFormato
    ? `<p class="guia-cambios-nota">Desde la v. ${esc(antes.huella)} solo cambió el formato: una hoja impresa antes sigue valiendo.</p>`
    : `<p class="guia-cambios-nota">Desde la v. ${esc(antes.huella)} (${esc(fechaCortaDe(antes.fecha))}): ${esc(resumenCambios(d))}.</p>${listaCambiosHTML(d, rutaDeClave(clave))}`;
}

// ── Hojas para imprimir (#hojas) ─────────────────────────────────────────────
// Para quien gestiona las copias en papel: cada hoja con su versión actual (la «v.» que
// lleva bajo el QR), la fecha de su último cambio de contenido y su PDF. Sale de
// huellas.json, así que se mantiene sola. Las que cambiaron hace poco, marcadas.
const DIAS_RECIENTE = 30;
// Hojas sin QR (no tienen página en la guía): solo se listan aquí, con su versión y su PDF
// Formulario del paciente en papel: la cara común y la de cada región (en el orden anatómico)
const PARA_PACIENTE = { 'ejercicio-paciente': 'El ejercicio: lo que dicen los estudios', 'formulario-comun': 'Formulario del paciente · General',
  ...Object.fromEntries(ORDEN_REGIONES.map(r => [`formulario-${r}`, `Formulario del paciente · ${nombreRegion(r)}`])) };
const NOMBRE_HOJA = { cribado: 'Cribado (fase 2)', 'arbol-a4': 'Árbol de decisión (fase 4)', confirmacion: 'Confirmación (fase 4b)' };
// Filtro por región (decisión del usuario, 2026-10): deja el cuaderno de esa región, sus tres
// hojas y las hojas generales. Sin botón «Todas»: un segundo toque en la región activa lo quita,
// como el filtro de tejidos. Solo en memoria.
let FILTRO_HOJAS = '';
function filtroHojasHTML() {
  return `<div class="guia-hojas-filtro" role="group" aria-label="Filtrar por región">${REGIONES.map(r =>
    `<button type="button" class="tej-filtro-btn${FILTRO_HOJAS === r ? ' activo' : ''}" data-filtro-hojas="${r}" aria-pressed="${FILTRO_HOJAS === r}">${esc(nombreRegion(r))}</button>`).join('')}</div>`;
}
const fechaLarga = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
// Copia impresa de cada cuaderno (solo en memoria, como los demás filtros): su fecha de impresión o,
// mejor, la «v.» de su portada (exacta: se compara la versión de cada hoja)
const FECHA_COPIA = {}, V_COPIA = {};
const hoyISO = () => { const f = new Date(); return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`; };
const esVersion = v => /^[0-9a-f]{8}$/.test(v);
// Lo que hay que sustituir de un cuaderno: con la «v.» de la portada, las hojas con otra versión;
// con la fecha de impresión, las que cambiaron ese día o después; sin nada, las que cambiaron hace
// poco (desde el último cambio de orden, si es reciente)
function cambiosCuadernoHTML(clave, { base = '', cambiadas: porDefecto = [] } = {}) {
  const d = CUADERNOS?.[clave];
  if (!d) return '';
  const v = V_COPIA[clave] || '', fecha = v ? '' : (FECHA_COPIA[clave] || '');
  let sel = null, intro = '';
  if (v) {
    if (!esVersion(v)) return '<p class="guia-cambios-nota">Escribe los 8 caracteres de «cuaderno v.», al final del texto de la portada.</p>';
    const copia = CUADERNOS_HIST?.[v];
    if (!copia) return `<p class="guia-cambios-paginas">No reconozco la v. ${esc(v)}. Comprueba que la has copiado bien (8 caracteres, al final del texto de la portada) o usa la fecha en que lo imprimiste.</p>`;
    if (copia.clave !== clave) return `<p class="guia-cambios-paginas">La v. ${esc(v)} es de otro cuaderno: ${esc(definicionCuadernos(REGIONES, nombreRegion).find(l => l.clave === copia.clave)?.titulo || copia.clave)}.</p>`;
    sel = hojasCambiadasEnCopia(d, copia);
    if (sel.entero) return `<p class="guia-cambios-paginas guia-hoja-movida">Tu copia (v. ${esc(v)}) tiene otra lista u orden de hojas: reimprime el cuaderno entero.</p>`;
    sel.claves.sort((a, b) => (HUELLAS[b]?.fecha || '').localeCompare(HUELLAS[a]?.fecha || ''));
    if (!sel.claves.length) return `<p class="guia-cambios-paginas">✓ Tu copia (v. ${esc(v)}) está al día: todas sus hojas tienen la versión actual.</p>`;
    intro = `En tu copia (v. ${esc(v)}) ${sel.claves.length === 1 ? 'hay una hoja con otra versión' : `hay ${sel.claves.length} hojas con otra versión`}: sustitúyelas, y la portada`;
  } else if (fecha) {
    sel = hojasCambiadasDesde(d, HUELLAS, fecha);
    if (sel.entero) return `<p class="guia-cambios-paginas guia-hoja-movida">Tu copia es de antes del ${esc(fechaLarga(d.ordenFecha))}, cuando cambió la lista u orden de hojas: reimprime el cuaderno entero.</p>`;
    if (!sel.claves.length) return `<p class="guia-cambios-paginas">✓ Ninguna hoja ha cambiado desde el ${esc(fechaLarga(fecha))}: tu copia está al día.</p>`;
    intro = `Desde el ${esc(fechaLarga(fecha))} (incluido, por si cambió después de imprimir) cambiaron ${sel.claves.length === 1 ? 'esta hoja' : `estas ${sel.claves.length} hojas`}: sustitúyelas, y la portada`;
  } else {
    if (!porDefecto.length) return `<p class="guia-cambios-nota">Ninguna hoja ha cambiado en los últimos ${DIAS_RECIENTE} días. Para una copia más antigua, escribe la v. de su portada o la fecha en que lo imprimiste.</p>`;
    intro = `${base ? `Si lo imprimiste después del ${esc(fechaLarga(base))}, basta` : 'Basta'} con sustituir las que cambiaron después de imprimirlo, y la portada`;
  }
  const cambiadas = sel ? sel.claves : porDefecto;
  const pags = cambiadas.length ? paginasReimprimir(d, cambiadas) : null;
  const rangosHTML = t => t.split(', ').map(r => `<span class="guia-rango">${esc(r)}</span>`).join(', ');
  return `<p class="guia-cambios-nota">${intro}${pags ? ` (págs. ${pags.rango(pags.portada)})` : ''}:</p>
        ${pags ? (pags.texto === `1-${d.paginas}` ? `<p class="guia-cambios-paginas">Han cambiado todas: imprime el cuaderno entero.</p>`
          : `<p class="guia-cambios-paginas">Del PDF actual, a doble cara, imprime las páginas <b>${rangosHTML(pags.texto)}</b> <button type="button" class="guia-copiar" data-copiar="${esc(pags.texto)}">Copiar</button></p>
            <p class="guia-cambios-nota">Son números del PDF actual: en tu copia impresa, busca cada hoja por su nombre.</p>`) : ''}
        <ul>${cambiadas.map(k => `<li><a href="${urlPDF(k, HUELLAS[k].huella)}" target="_blank" rel="noopener">${esc(nombreHojaImpresa(k, nombreRegion))} ↗</a> · ${esc(fechaCortaDe(HUELLAS[k].fecha))}${pags?.porHoja[k] ? ` · págs. ${pags.rango(pags.porHoja[k])}` : ''}</li>`).join('')}</ul>`;
}
// Abre el desplegable del cuaderno del QR y lo lleva a la vista
function abrirCuadernoPapel(clave) {
  const caja = document.getElementById(`cambiadas-${clave}`), ver = document.querySelector(`[aria-controls="cambiadas-${clave}"]`);
  if (!caja || !ver) return;
  caja.hidden = false;
  ver.setAttribute('aria-expanded', 'true');
  ver.closest('.guia-hoja')?.scrollIntoView({ block: 'start' });
}
function htmlHojas() {
  if (!HUELLAS) return '<p class="guia-vacio">No se ha podido cargar la lista de hojas. Prueba a recargar la página.</p>';
  const hoy = Date.now();
  // Cuadernos cuya lista u orden de hojas cambió hace poco: hay que reimprimirlos enteros. Que una
  // hoja ocupe más o menos papel no afecta a las demás (cada hoja numera sus páginas por sí misma).
  const recienteFecha = iso => !!iso && (hoy - new Date(`${iso}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE;
  const fila = (clave, nombre) => {
    const h = HUELLAS[clave];
    if (!h) return '';
    const reciente = (hoy - new Date(`${h.fecha}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE;
    // Las recientes, con «Qué cambió» plegado: el detalle se carga al abrirlo (historial de la hoja)
    return `<li class="guia-hoja${reciente ? ' reciente' : ''}"><div class="guia-hoja-txt"><b>${esc(nombre)}</b>
      <span class="guia-hoja-v">v. ${esc(h.huella)}</span> · <span>cambió el ${esc(fechaLarga(h.fecha))}</span>${reciente ? ` <span class="guia-hoja-nueva">Reciente</span> ${botonVer(`cambios-${clave}`, 'Qué cambió', ` data-cargar="${clave}"`)}` : ''}
</div>
      <a href="${urlPDF(clave, h.huella)}" target="_blank" rel="noopener" aria-label="Descargar ${esc(nombre)} en PDF">PDF ↗</a>${reciente ? `<div id="cambios-${clave}" class="guia-cambios" hidden></div>` : ''}</li>`;
  };
  const grupo = (titulo, filas) => `<section class="guia-bloque"><h3>${esc(titulo)}</h3><ul class="guia-hojas-lista">${filas.join('')}</ul></section>`;
  const recientes = Object.values(HUELLAS).filter(h => (hoy - new Date(`${h.fecha}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE).length;
  // Cuadernos de consulta a doble cara (completo y por región), arriba: es lo que se imprime de una vez
  const cuadernos = CUADERNOS ? definicionCuadernos(REGIONES, nombreRegion).filter(l => CUADERNOS[l.clave] && (!FILTRO_HOJAS || l.clave === `cuaderno-${FILTRO_HOJAS}`)).map(l => {
    const d = CUADERNOS[l.clave];
    const reciente = (hoy - new Date(`${d.fecha}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE;
    // Qué hojas suyas cambiaron hace poco (las que se sustituyen, con la portada), de la más nueva a la
    // más antigua; si el orden de hojas cambió hace poco, solo las posteriores (antes, se reimprime entero)
    const base = recienteFecha(d.ordenFecha) ? d.ordenFecha : '';
    const cambiadas = Object.keys(d.hojas || {}).filter(k => HUELLAS[k] && recienteFecha(HUELLAS[k].fecha) && HUELLAS[k].fecha > base)
      .sort((a, b) => HUELLAS[b].fecha.localeCompare(HUELLAS[a].fecha));
    const idCamb = `cambiadas-${l.clave}`;
    return `<li class="guia-hoja${reciente ? ' reciente' : ''}"><div class="guia-hoja-txt"><b>${esc(l.titulo)}</b>
      <span>${d.paginas} páginas (${d.paginas / 2} hojas de papel)</span> · <span class="guia-hoja-v">v. ${esc(d.huella)}</span> · <span>cambió el ${esc(fechaLarga(d.fecha))}</span>${d.ordenFecha ? ` · <span>orden de hojas desde el ${esc(fechaLarga(d.ordenFecha))}</span>` : ''}${reciente ? ' <span class="guia-hoja-nueva">Reciente</span>' : ''}
      ${recienteFecha(d.ordenFecha) && !(V_COPIA[l.clave] && CUADERNOS_HIST?.[V_COPIA[l.clave]]) ? `<span class="guia-hoja-movida">Si lo imprimiste antes del ${esc(fechaLarga(d.ordenFecha))}, reimprímelo entero.</span>` : ''}
      ${botonVer(idCamb, cambiadas.length ? `${base ? 'Cambiaron después' : 'Hojas que cambiaron'} (${cambiadas.length})` : '¿Qué reimprimir?')}</div>
      <a href="${urlPDF(l.clave, d.archivo || d.huella)}" target="_blank" rel="noopener" aria-label="Descargar ${esc(l.titulo)} en PDF">PDF ↗</a>
      <div id="${idCamb}" class="guia-cambios" hidden>
        <div class="guia-copia"><label>«cuaderno v.» de tu portada <input type="text" data-v-copia="${l.clave}" value="${esc(V_COPIA[l.clave] || '')}" maxlength="8" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(d.huella)}"></label>
          <label>o el día que lo imprimiste <input type="date" data-fecha-copia="${l.clave}" value="${esc(FECHA_COPIA[l.clave] || '')}" max="${hoyISO()}"></label></div>
        <div data-copia-res="${l.clave}" data-base="${base}" data-cambiadas="${cambiadas.join(',')}">${cambiosCuadernoHTML(l.clave, { base, cambiadas })}</div></div></li>`;
  }) : [];
  const desconocido = VERSION_CUADERNO && CUADERNOS_HIST && !CUADERNOS_HIST[VERSION_CUADERNO];
  return `${desconocido ? `<div class="guia-papel" id="guiaPapelCuaderno">No reconozco la versión de tu cuaderno (v. ${esc(VERSION_CUADERNO)}). Abre su cuaderno abajo y escribe la fecha en que lo imprimiste.</div>` : ''}<p class="guia-nota">Cada hoja impresa lleva su versión bajo el QR («v. …»). Si no coincide con la de esta lista, la hoja ha cambiado: descarga el PDF y reimprímela. «Reciente» = cambió en los últimos ${DIAS_RECIENTE} días (${recientes} de ${Object.keys(HUELLAS).length}).</p>
    ${filtroHojasHTML()}
    ${FILTRO_HOJAS ? `<p class="guia-nota guia-hojas-filtrado">${esc(nombreRegion(FILTRO_HOJAS))}: su cuaderno, sus tres hojas y las hojas generales. Toca otra vez la región para verlo todo.</p>` : ''}
    ${cuadernos.length ? `<section class="guia-bloque"><h3>Cuadernos de consulta para imprimir a doble cara</h3><p class="guia-nota">Todas las hojas de consulta en un PDF, o las de una región con las generales. Cada hoja empieza en su propio papel y numera sus páginas por sí misma («Cribado · Lumbar 1/2»): si una cambia, aunque ocupe más o menos papel, imprime solo esa hoja y la portada (lleva el índice con la versión de cada hoja) y sustitúyelas. Solo si cambia la lista u orden de hojas el cuaderno lo avisa en rojo y se reimprime entero. La hoja del paciente va aparte.</p><ul class="guia-hojas-lista">${cuadernos.join('')}</ul></section>` : ''}
    ${REGIONES.filter(r => !FILTRO_HOJAS || r === FILTRO_HOJAS).map(r => grupo(nombreRegion(r), Object.entries(NOMBRE_HOJA).map(([t, n]) => fila(`${t}-${r}`, n)))).join('')}
    ${grupo('Tiempos de recuperación de tejidos', Object.entries(HOJAS_TEJIDO).map(([k, h]) => fila(`tejidos-${k}`, h.titulo)))}
    ${grupo('Otras hojas', Object.entries(SUELTAS).map(([k, h]) => fila(k, h.titulo)))}
    ${grupo('Para dar al paciente', Object.entries(PARA_PACIENTE).map(([k, t]) => fila(k, t)))}`;
}

// ── Páginas sueltas (#<clave>): el QR de las hojas que no son de una región ──
// La clave es la de la hoja impresa (docs/esquemas/<clave>.pdf), para el aviso de papel viejo.
const SUELTAS = {
  condiciones: { titulo: 'Condiciones especiales', html: () => condicionesHTML({}, { guia: true }) },
  irritabilidad: { titulo: 'Irritabilidad (fase 3)', html: () => htmlIrritabilidad('', { conTitulo: false }) },
  farmacos: { titulo: 'Fármacos: qué vigilar', html: () => `<div id="farmCuerpo">${farmacosHTML()}</div>${htmlPreguntar('farmacos', { titulo: '¿Otro fármaco o duda? Pregunta a la IA', soloTipo: true })}` },
  sintomas: { titulo: 'Síntomas (fase 3)', html: htmlSintomasGuia },
  plan: { titulo: 'Plan de tratamiento (fase 6)', html: htmlPlan },
  ejercicio: { titulo: 'Efectos del ejercicio', html: htmlEjercicio },
  preguntar: { titulo: 'Preguntar a la IA', html: () => htmlPreguntar() },
  cuestionarios: { titulo: 'Calculadora de cuestionarios', html: htmlCuestionarios, despues: despuesCuestionarios },
  fase1: { titulo: 'Fase 1: inicio, cirugía, banderas rojas y riesgo psicosocial', html: htmlFase1 },
};

// «Ficha técnica (CIMA)»: como en la app, el enlace abre el buscador de CIMA y aquí se copia
// el nombre para pegarlo; un aviso breve dice dónde (o qué buscar, si no se pudo copiar).
function avisoGuia(texto) {
  let el = document.getElementById('guiaAviso');
  if (!el) { el = document.createElement('div'); el.id = 'guiaAviso'; el.className = 'guia-aviso'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = texto; el.hidden = false;
  clearTimeout(avisoGuia.t); avisoGuia.t = setTimeout(() => { el.hidden = true; }, 5000);
}
document.addEventListener('click', e => {
  const a = e.target instanceof Element ? e.target.closest('#farmCuerpo a[data-cima]') : null;
  if (!a) return;
  const n = a.dataset.cima;
  const fallo = () => avisoGuia(textoCima(TEXTOS_FARMACOS.cimaSinCopiar, n));
  try { navigator.clipboard.writeText(n).then(() => avisoGuia(textoCima(TEXTOS_FARMACOS.cimaCopiado, n)), fallo); } catch { fallo(); }
}, true);

// La copia impresa de un cuaderno («cuaderno v.» o fecha): repinta solo su lista (el desplegable
// sigue abierto); escribir una borra la otra, para que no haya dos respuestas
function repintarCopia(k) {
  const res = document.querySelector(`[data-copia-res="${k}"]`);
  if (res) res.innerHTML = cambiosCuadernoHTML(k, { base: res.dataset.base, cambiadas: res.dataset.cambiadas ? res.dataset.cambiadas.split(',') : [] });
}
document.addEventListener('change', e => {
  const inp = e.target instanceof Element ? e.target.closest('input[data-fecha-copia]') : null;
  if (!inp) return;
  const k = inp.dataset.fechaCopia;
  if (inp.value) FECHA_COPIA[k] = inp.value; else delete FECHA_COPIA[k];
  if (inp.value) { delete V_COPIA[k]; const v = document.querySelector(`input[data-v-copia="${k}"]`); if (v) v.value = ''; }
  repintarCopia(k);
});
document.addEventListener('input', e => {
  const inp = e.target instanceof Element ? e.target.closest('input[data-v-copia]') : null;
  if (!inp) return;
  const k = inp.dataset.vCopia, v = inp.value.trim().toLowerCase();
  if (v) V_COPIA[k] = v; else delete V_COPIA[k];
  if (v) { delete FECHA_COPIA[k]; const f = document.querySelector(`input[data-fecha-copia="${k}"]`); if (f) f.value = ''; }
  repintarCopia(k);
});

// «Copiar» de las páginas a reimprimir de un cuaderno (Hojas para imprimir)
document.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('button[data-copiar]') : null;
  if (!b) return;
  const t = b.dataset.copiar;
  const fallo = () => avisoGuia(`Escribe ${t} en «Páginas» al imprimir el PDF`);
  try { navigator.clipboard.writeText(t).then(() => avisoGuia(`Páginas copiadas: pégalas en «Páginas» al imprimir el PDF`), fallo); } catch { fallo(); }
});

const PINTAR = { cribado: htmlCribado, arbol: htmlArbol, confirmacion: htmlConfirmacion, irritabilidad: htmlIrritabilidad };

// ── Navegación ──────────────────────────────────────────────────────────────
function leerRuta() {
  const [r, h, el] = decodeURIComponent(location.hash.slice(1)).split('/');
  if (r === 'hojas') return { hojas: true, region: '', hoja: '', elemento: '' };
  if (SUELTAS[r]) return { suelta: r, region: '', hoja: '', elemento: h || '' };
  if (r === 'tejidos') return { tejidos: true, region: '', hoja: HOJAS_TEJIDO[h] ? h : 'blandos', elemento: '' };
  return { region: REGIONES.includes(r) ? r : 'lumbar', hoja: PINTAR[h] ? h : 'cribado', elemento: el || '' };
}

// El <select> de la región es el título: tan ancho como el nombre elegido, para que el ▾ vaya pegado
// La región del título y su menú: un enlace por región a la misma hoja (tejidos → cribado)
function pintarNombreRegion() {
  const { region, hoja, tejidos } = leerRuta();
  document.getElementById('guiaRegionNombre').textContent = nombreRegion(region);
  document.getElementById('guiaRegionMenu').innerHTML = REGIONES.map(r =>
    `<li><a href="#${r}/${tejidos ? 'cribado' : hoja}"${r === region ? ' aria-current="true"' : ''}>${esc(nombreRegion(r))}</a></li>`).join('');
}
function menuRegion(abrir) {
  const btn = document.getElementById('guiaRegion'), menu = document.getElementById('guiaRegionMenu');
  if (abrir === undefined) abrir = menu.hidden;
  menu.hidden = !abrir;
  btn.setAttribute('aria-expanded', String(abrir));
  if (abrir) (menu.querySelector('[aria-current]') || menu.querySelector('a'))?.focus();
}

function pintar({ sinScroll = false } = {}) {
  const { tejidos, hojas, suelta, region, hoja, elemento } = leerRuta();
  document.body.classList.toggle('guia-modo-tejidos', !!tejidos || !!hojas || !!suelta);
  document.body.classList.toggle('guia-modo-hojas', !!hojas || !!suelta);
  // ✨ de la cabecera en azul mientras se está en «Preguntar a la IA», como una pestaña activa
  const ia = document.getElementById('guiaIABtn');
  if (suelta === 'preguntar') ia?.setAttribute('aria-current', 'page'); else ia?.removeAttribute('aria-current');
  if (suelta) {
    const { titulo, html, despues } = SUELTAS[suelta];
    document.getElementById('guiaTitulo').textContent = titulo;
    document.getElementById('guiaHojas').innerHTML = '';
    document.getElementById('guiaContenido').innerHTML = avisoHojaHTML(suelta) + html(elemento);
    despues?.();
    document.title = `${titulo} · Guía de consulta`;
    if (!sinScroll) window.scrollTo(0, 0);
    return;
  }
  if (hojas) {
    document.getElementById('guiaTitulo').textContent = 'Hojas para imprimir';
    document.getElementById('guiaHojas').innerHTML = '';
    document.getElementById('guiaContenido').innerHTML = htmlHojas();
    document.title = 'Hojas para imprimir · Guía de consulta';
    if (!sinScroll) window.scrollTo(0, 0);
    return;
  }
  if (tejidos) {
    document.getElementById('guiaTitulo').textContent = 'Tiempos de recuperación';
    document.getElementById('guiaHojas').innerHTML = Object.entries(HOJAS_TEJIDO)
      .map(([k, h]) => `<a href="#tejidos/${k}"${k === hoja ? ' aria-current="page"' : ''}>${h.corto}</a>`).join('');
    document.getElementById('guiaContenido').innerHTML = avisoHojaHTML(claveHoja(leerRuta())) + htmlTejidos(hoja);
    // El eje de tiempo, fijo justo debajo de las pestañas
    document.documentElement.style.setProperty('--guia-nav-alto', `${document.querySelector('.guia-nav').offsetHeight}px`);
    document.title = `Tiempos de recuperación · ${HOJAS_TEJIDO[hoja].titulo} · Guía de consulta`;
    if (!sinScroll) window.scrollTo(0, 0);
    return;
  }
  pintarNombreRegion();
  if (_rutaPlegables !== `${region}/${hoja}`) { ABIERTOS.clear(); _rutaPlegables = `${region}/${hoja}`; }
  document.getElementById('guiaHojas').innerHTML = Object.entries(HOJAS_GUIA)
    .map(([k, n]) => `<a href="#${region}/${k}"${k === hoja ? ' aria-current="page"' : ''}>${n}</a>`).join('');
  document.getElementById('guiaContenido').innerHTML = avisoHojaHTML(claveHoja({ region, hoja })) + PINTAR[hoja](region);
  document.title = `${HOJAS_GUIA[hoja]} · ${nombreRegion(region)} · Guía de consulta`;
  marcarCambios();
  medirNav();
  actualizarPlegarTodo();
  const destino = elemento && document.getElementById(elemento);
  if (destino) {
    destino.classList.add('destacado');
    destino.querySelectorAll('details.razon').forEach(d => { d.open = true; });
    // Su sistema o hipótesis, abierto; y la línea fija de ese bloque no lo tapa
    const bloque = destino.closest('details.guia-plegable');
    if (bloque) { bloque.open = true; ABIERTOS.add(bloque.id); }
    const linea = bloque && bloque !== destino ? bloque.querySelector(':scope > summary').offsetHeight : 0;
    window.scrollTo(0, destino.getBoundingClientRect().top + window.scrollY - navAlto() - linea - 8);
  } else window.scrollTo(0, 0);
}

// Alto de las pestañas fijas, para la línea fija de los bloques plegables
const navAlto = () => document.querySelector('.guia-nav')?.offsetHeight || 0;
// Alto real, con decimales (offsetHeight redondea y podía dejar una rendija), y otra
// vez cuando cambia (la fuente web llega después, letra grande)
function medirNav() {
  const alto = document.querySelector('.guia-nav')?.getBoundingClientRect().height || 0;
  document.documentElement.style.setProperty('--guia-nav-alto', `${alto}px`);
}
function actualizarPlegarTodo() {
  const b = document.querySelector('[data-plegar-todo]');
  if (b) b.textContent = document.querySelector('details.guia-plegable:not([open])') ? 'Desplegar todo' : 'Plegar todo';
}
// Título fijo compacto (usuario, 2026-11): mientras la línea de un bloque abierto está
// pegada bajo las pestañas, .fija la reduce a una barra; el alto que pierde se devuelve
// con un hueco justo debajo, para que el contenido no salte. Un hueco aparte y no un
// margen de la línea: el sticky respeta su propio margen, y con él la línea empezaba a
// subir ~36 px antes del final del bloque
function quitarFija(d) {
  d.classList.remove('fija', 'al-final');
  d.querySelector(':scope > .guia-fija-hueco')?.remove();
}
function actualizarFijas() {
  const top = navAlto();
  document.querySelectorAll('details.guia-plegable').forEach(d => {
    const r = d.getBoundingClientRect();
    // Compacta hasta que el bloque sale entero por arriba: en el tramo final la línea
    // sigue pegada (la empuja el final del bloque) y volver a la alta se veía como una
    // doble raya con el recuento asomando bajo las pestañas (usuario, 2026-11)
    const fija = d.open && !_imprimiendo && r.top < top - 1 && r.bottom > top;
    // Al final: el final del bloque ya empuja la línea hacia arriba, «Replegar ▴» ha
    // pasado por debajo y solo queda el fondo de la tarjeta; sin borde (se desvanece), para que la
    // línea y ese fondo se lean como una sola pieza (usuario, 2026-11)
    const alFinal = fija && d.querySelector(':scope > summary').getBoundingClientRect().top < top - 0.5;
    if (alFinal !== d.classList.contains('al-final')) d.classList.toggle('al-final', alFinal);
    if (fija === d.classList.contains('fija')) return;
    if (!fija) { quitarFija(d); return; }
    const s = d.querySelector(':scope > summary');
    const alto = s.getBoundingClientRect().height;
    d.classList.add('fija');
    const hueco = document.createElement('div');
    hueco.className = 'guia-fija-hueco';
    hueco.setAttribute('aria-hidden', 'true');
    hueco.style.height = `${Math.max(0, alto - s.getBoundingClientRect().height)}px`;
    s.after(hueco);
  });
}
let _fijasPendiente = 0;
const programarFijas = () => { if (!_fijasPendiente) _fijasPendiente = requestAnimationFrame(() => { _fijasPendiente = 0; actualizarFijas(); }); };

function iniciarPlegables() {
  // `toggle` no burbujea: en captura. Al plegar un bloque con su línea por encima
  // de las pestañas (estaba fija), se vuelve a ella para no quedarse más abajo
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.classList.contains('guia-plegable')) return;
    if (d.open) ABIERTOS.add(d.id); else { ABIERTOS.delete(d.id); quitarFija(d); }
    actualizarPlegarTodo();
    programarFijas();
    if (d.open || _imprimiendo || performance.now() < _sinSaltoHasta) return;
    const y = d.getBoundingClientRect().top, top = navAlto();
    if (y < top) window.scrollTo({ top: window.scrollY + y - top - 8, behavior: 'instant' });
  }, true);
  document.addEventListener('click', e => {
    const t = e.target instanceof Element ? e.target : null;
    const rep = t?.closest('.guia-replegar');
    if (rep) {
      const d = rep.closest('details.guia-plegable');
      if (d) { d.open = false; d.querySelector(':scope > summary').focus({ preventScroll: true }); }
      return;
    }
    if (t?.closest('[data-plegar-todo]')) {
      const todos = [...document.querySelectorAll('details.guia-plegable')];
      const abrir = todos.some(d => !d.open);
      _sinSaltoHasta = performance.now() + 500;   // sin saltos de scroll al plegarlos todos
      todos.forEach(d => { d.open = abrir; if (abrir) ABIERTOS.add(d.id); else ABIERTOS.delete(d.id); });
      actualizarPlegarTodo();   // ya, sin esperar a los `toggle`, que llegan después
    }
  });
  window.addEventListener('resize', () => { medirNav(); programarFijas(); }, { passive: true });
  const nav = document.querySelector('.guia-nav');
  if (nav && typeof ResizeObserver === 'function') new ResizeObserver(() => { medirNav(); programarFijas(); }).observe(nav);
  window.addEventListener('scroll', programarFijas, { passive: true });
  // Al imprimir, todo desplegado; después, como estaba
  let antes = [];
  window.addEventListener('beforeprint', () => {
    _imprimiendo = true;
    document.querySelectorAll('details.guia-plegable.fija').forEach(quitarFija);
    antes = [...document.querySelectorAll('details.guia-plegable')].filter(d => !d.open);
    antes.forEach(d => { d.open = true; });
  });
  window.addEventListener('afterprint', () => {
    antes.forEach(d => { d.open = false; });
    antes = [];
    _imprimiendo = false;
    _sinSaltoHasta = performance.now() + 500;
  });
}
let _imprimiendo = false, _sinSaltoHasta = 0;

// Tema y tamaño de letra: los mismos botones y la misma preferencia que la app
// (lib/apariencia.js). Es lo único que la guía guarda, y no es nada del paciente.
function iniciarApariencia() {
  aplicarTema(); aplicarLetra(); seguirSistema(aplicarTema);
  document.getElementById('themeBtn').addEventListener('click', () => { guardarTema(THEME_UI[getThemePref()].next); aplicarTema(); });
  document.getElementById('letraBtn').addEventListener('click', () => { cambiarLetra(); });
}

// «Regiones ▾» del pie (usuario, 2026-11): el mismo menú que el título de una región, abierto
// hacia arriba, para llegar a cualquier región desde las páginas sueltas; cada una abre su cribado
function pieRegionesHTML() {
  return `<span class="guia-pie-regiones"><button type="button" class="guia-pie-reg-btn" id="guiaPieRegiones" aria-haspopup="true" aria-expanded="false" aria-controls="guiaPieMenu">Regiones ▾</button><ul class="guia-region-menu guia-pie-menu" id="guiaPieMenu" hidden>${REGIONES.map(r =>
    `<li><a href="#${r}/cribado">${esc(nombreRegion(r))}</a></li>`).join('')}</ul></span>`;
}
function menuPie(abrir) {
  const btn = document.getElementById('guiaPieRegiones'), menu = document.getElementById('guiaPieMenu');
  if (!btn || !menu) return;
  if (abrir === undefined) abrir = menu.hidden;
  menu.hidden = !abrir;
  btn.setAttribute('aria-expanded', String(abrir));
  if (abrir) menu.querySelector('a')?.focus();
}
function iniciarPieRegiones() {
  document.addEventListener('click', e => {
    const t = e.target instanceof Element ? e.target : null;
    if (t?.closest('#guiaPieRegiones')) { menuPie(); return; }
    const menu = document.getElementById('guiaPieMenu');
    if (!menu || menu.hidden) return;
    if (t?.closest('#guiaPieMenu a')) { menuPie(false); return; }
    if (!t?.closest('.guia-pie-regiones')) menuPie(false);
  });
  document.addEventListener('keydown', e => {
    const menu = document.getElementById('guiaPieMenu');
    if (!menu || menu.hidden) return;
    if (e.key === 'Escape') { e.stopPropagation(); menuPie(false); document.getElementById('guiaPieRegiones').focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const enlaces = [...menu.querySelectorAll('a')], i = enlaces.indexOf(document.activeElement);
      enlaces[(i + (e.key === 'ArrowDown' ? 1 : enlaces.length - 1)) % enlaces.length].focus();
      e.preventDefault();
    }
  }, true);
}

async function iniciar() {
  iniciarApariencia();
  const btn = document.getElementById('guiaRegion'), menu = document.getElementById('guiaRegionMenu');
  btn.addEventListener('click', () => menuRegion());
  // Elegir una región es seguir su enlace: el menú se cierra y vuelve el foco al título
  menu.addEventListener('click', e => { if (e.target.closest('a')) { menuRegion(false); btn.focus(); } });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.guia-region')) menuRegion(false); });
  document.addEventListener('keydown', e => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { e.stopPropagation(); menuRegion(false); btn.focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const enlaces = [...menu.querySelectorAll('a')], i = enlaces.indexOf(document.activeElement);
      enlaces[(i + (e.key === 'ArrowDown' ? 1 : enlaces.length - 1)) % enlaces.length].focus();
      e.preventDefault();
    }
  }, true);
  // Las fuentes se enlazan con el registro; si no carga, se pintan sin enlace
  try { REF = await registroReferencias(); } catch { REF = null; }
  if (HUELLA_PAPEL || VERSION_CUADERNO || leerRuta().hojas) await cargarHuellas();
  // El QR de la portada de un cuaderno: su versión ya escrita, para abrirlo con lo que hay que reimprimir
  const cuadernoPapel = VERSION_CUADERNO && CUADERNOS_HIST?.[VERSION_CUADERNO]?.clave;
  if (cuadernoPapel && CUADERNOS?.[cuadernoPapel]) V_COPIA[cuadernoPapel] = VERSION_CUADERNO;
  if (HUELLA_PAPEL) await identificarPapel();
  window.addEventListener('hashchange', async () => {
    cerrarFicha({ sinFoco: true });
    if (leerRuta().hojas && !HUELLAS) await cargarHuellas();
    pintar();
  });
  pintar();
  if (cuadernoPapel && leerRuta().hojas) abrirCuadernoPapel(cuadernoPapel);
  const v = textoVersion();
  document.getElementById('guiaPie').innerHTML = `Contenido generado desde los datos de la app (versión ${esc(v)}). Si tu hoja impresa es más antigua, puede haber diferencias: manda lo que dice esta página. ${pieRegionesHTML()} · <a href="./">Abrir la app →</a> · <a href="#tejidos/blandos">Tiempos de recuperación de tejidos</a> · <a href="#fase1">Fase 1</a> · <a href="#condiciones">Condiciones especiales</a> · <a href="#farmacos">Fármacos</a> · <a href="#irritabilidad">Irritabilidad</a> · <a href="#sintomas">Síntomas</a> · <a href="#plan">Plan de tratamiento</a> · <a href="#cuestionarios">Cuestionarios</a> · <a href="#ejercicio">Efectos del ejercicio</a> · <a href="#preguntar">Preguntar a la IA</a> · <a href="#hojas">Hojas para imprimir</a><br>«✨ IA» abre una búsqueda externa con el texto de la guía, nunca con datos del paciente; PhysiQ no revisa la respuesta.`;
  iniciarPieRegiones();
  initAmpliarIA();
  initRazonPlegable();
  iniciarPlegables();
  initCalculadoras(pintar);
  initPlan(pintar);
}
iniciar();
