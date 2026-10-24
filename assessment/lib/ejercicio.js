// ============================================================
// PhysiQ-Assessment · lib/ejercicio.js
// Guía «Efectos del ejercicio» (docs/efectos-ejercicio.md): el HTML del
// diálogo a partir de data/ejercicio.js. Puro: no lee el estado del paciente
// ni guarda nada.
// ============================================================

import { NIVELES_EJERCICIO, APARTADOS_EJERCICIO, BLOQUES_EJERCICIO, TEXTOS_EJERCICIO, BLOQUE_POR_HIPOTESIS } from '../data/ejercicio.js';
import { citasHTML, citasEnTexto } from './citas.js';
import { iaParrafoHTML, attrIA, ctxEjercicio } from '../ampliar-ia.js';
import { CUESTIONARIOS } from '../data/cuestionarios.js';
import { puntuar } from './cuestionarios.js';
import { reglaVascular } from './hipermovilidad.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Texto de data/ con las citas de dentro de la frase como botones (lib/citas.js)
const txt = s => citasEnTexto(esc(s));

export const bloquesConContenido = () => BLOQUES_EJERCICIO.filter(b => b.apartados);
export const bloquesPendientes = () => BLOQUES_EJERCICIO.filter(b => !b.apartados);

// Qué incumple un bloque con contenido (lista vacía = correcto). Lo usan el
// test unitario y quien escriba un bloque: cada frase lleva un nivel que existe,
// y una frase para el paciente solo se apoya en 'evidencia' de nivel 'clinico'.
export function problemasBloque(b) {
  const p = [];
  const ap = b.apartados || {};
  for (const a of APARTADOS_EJERCICIO) {
    if (!Array.isArray(ap[a.id]) || !ap[a.id].length) p.push(`${b.id}.${a.id}: vacío`);
  }
  for (const id of ['que', 'evidencia', 'consulta']) {
    (ap[id] || []).forEach((f, i) => {
      if (!f || typeof f.t !== 'string' || f.t.length < 20) p.push(`${b.id}.${id}[${i}]: sin texto`);
      if (!NIVELES_EJERCICIO[f?.nivel]) p.push(`${b.id}.${id}[${i}]: nivel «${f?.nivel}» no existe`);
    });
  }
  (ap.paciente || []).forEach((f, i) => {
    if (!f || typeof f.t !== 'string' || f.t.length < 20) p.push(`${b.id}.paciente[${i}]: sin texto`);
    const apoya = f?.apoya;
    if (!Array.isArray(apoya) || !apoya.length) { p.push(`${b.id}.paciente[${i}]: no dice en qué afirmación se apoya`); return; }
    for (const k of apoya) {
      if (ap.evidencia?.[k]?.nivel !== 'clinico') p.push(`${b.id}.paciente[${i}]: se apoya en evidencia[${k}], que no es de nivel 'clinico'`);
    }
  });
  if (!Array.isArray(b.fuentes) || !b.fuentes.length) p.push(`${b.id}: sin fuentes`);
  return p;
}

// Bloque de la guía que enlaza el bloque «Educación» de la fase 6 (decisión 5
// de docs/efectos-ejercicio.md): irritabilidad alta → hipoalgesia (ejercicio a
// distancia, brotes); baja o moderada → carga y adaptación del tejido. Sin nivel
// se toma el mismo que usa el plan (alta, la opción prudente). Solo devuelve un
// bloque ya escrito: si no lo está, no hay enlace. Solo lectura: nunca cambia el plan.
export function bloqueEjercicioParaIrritabilidad(irritabilidad) {
  const id = irritabilidad === 'baja' || irritabilidad === 'moderada' ? 'mecanotransduccion' : 'hipoalgesia';
  return bloquesConContenido().find(b => b.id === id) || null;
}

// El otro bloque de los dos que enlaza la fase 6: la regla ordena, no esconde contenido
// (con irritabilidad alta la carga sigue importando, p. ej. en una tendinopatía).
export function bloqueEjercicioAlternativo(irritabilidad, principal = bloqueEjercicioParaIrritabilidad(irritabilidad)) {
  const id = principal?.id === 'mecanotransduccion' ? 'hipoalgesia' : 'mecanotransduccion';
  return bloquesConContenido().find(x => x.id === id) || null;
}

// Bloque principal del plan: el de sus hipótesis (BLOQUE_POR_HIPOTESIS) cuando
// todas las que están en la tabla apuntan al mismo bloque escrito; si no hay
// ninguna en la tabla o apuntan a bloques distintos, el de la irritabilidad.
// `hipotesis`: las elegidas del plan, [{ id, name }]; `cronologia`: la de la
// fase 1, para las entradas que solo valen en dolor crónico.
export function bloqueDeHipotesis(id, { cronologia = '' } = {}) {
  const e = BLOQUE_POR_HIPOTESIS[id];
  if (!e) return null;
  if (typeof e === 'string') return e;
  return !e.cronologia || e.cronologia === cronologia ? e.bloque : null;
}

export function bloqueEjercicioParaPlan(irritabilidad, hipotesis = [], { cronologia = '' } = {}) {
  const enTabla = hipotesis.filter(h => bloqueDeHipotesis(h.id, { cronologia }));
  const ids = [...new Set(enTabla.map(h => bloqueDeHipotesis(h.id, { cronologia })))];
  const b = ids.length === 1 ? bloquesConContenido().find(x => x.id === ids[0]) : null;
  if (b) return { bloque: b, hipotesis: enTabla.map(h => h.name) };
  return { bloque: bloqueEjercicioParaIrritabilidad(irritabilidad), hipotesis: [] };
}

// Cuestionarios de la calculadora que cuentan como «ánimo» para el enlace a
// «Efectos centrales»
export const CUESTIONARIOS_ANIMO = ['phq2', 'phq9', 'gad7'];

// Condiciones especiales que enlazan un bloque (docs/efectos-ejercicio.md,
// «Desde los recuadros de la fase 5» y «Enlace de la fase 6»): la única regla
// de estados, para el recuadro de la fase 5 y el bloque «Educación» de la fase
// 6. Una regla de lectura, no clínica: nunca cambia el plan. `enlaza` recibe
// { estado, subtipo, vs } (vs: regla de sospecha del subtipo vascular cumplida).
// - Lupus, solo diagnosticado: sus frases para el paciente solo valen en las
//   enfermedades reumáticas inflamatorias.
// - Disautonomía y osteoporosis, en los dos estados.
// - Hipermovilidad, en los dos estados, salvo con el subtipo vascular
//   diagnosticado o sospechado (regla cumplida): sus ensayos no lo incluyen y su
//   pauta es la de Byers 2017.
// `motivo` / `ayudaPlan`: la línea «También» de la fase 6. Osteoporosis no la
// tiene: «Carga y adaptación» ya sale siempre allí, principal o «También».
const CONDICION_EJERCICIO = {
  lupus: { id: 'antiinflamatorio', ayuda: 'enlaceCondicionLupus', motivo: 'reumatica', ayudaPlan: 'enlaceMotivoReumatica',
    enlaza: ({ estado }) => estado === 'diagnosticado' },
  disautonomia: { id: 'ortostatica', ayuda: 'enlaceCondicionDisautonomia', motivo: 'ortostatica', ayudaPlan: 'enlaceMotivoOrtostatica',
    enlaza: ({ estado }) => !!estado },
  hipermovilidad: { id: 'hipermovilidad', ayuda: 'enlaceCondicionHipermovilidad', motivo: 'hipermovilidad', ayudaPlan: 'enlaceMotivoHipermovilidad',
    enlaza: ({ estado, subtipo, vs }) => !!estado && !(estado === 'diagnosticada' && subtipo === 'vascular') && !vs },
  osteoporosis: { id: 'mecanotransduccion', ayuda: 'enlaceCondicionOsteoporosis',
    enlaza: ({ estado }) => !!estado },
  embarazo: { id: 'embarazo', ayuda: 'enlaceCondicionEmbarazo', motivo: 'embarazo', ayudaPlan: 'enlaceMotivoEmbarazo',
    enlaza: ({ estado }) => !!estado },
};

export function condicionEnlazaEjercicio(condicion, datos = {}) {
  const c = CONDICION_EJERCICIO[condicion];
  return !!c && c.enlaza(datos || {});
}

// La tarjeta de la fase 1 (state) en la forma que lee la regla; la fase 5 pasa
// los mismos datos desde su payload (es, st, vs).
export function datosCondicionEjercicio(condicion, tarjeta, respuestas = {}) {
  const datos = { estado: tarjeta?.estado || '', subtipo: tarjeta?.subtipo || '' };
  if (condicion === 'hipermovilidad') datos.vs = !!reglaVascular(tarjeta, respuestas)?.derivar;
  return datos;
}

// Qué bloques más enlaza la fase 6, además de los dos de la irritabilidad
// (docs/efectos-ejercicio.md, «Enlace de la fase 6»): «Efectos centrales» con
// riesgo psicosocial medio o alto, o un PHQ-2, PHQ-9 o GAD-7 completo con
// síntomas; y el bloque de cada condición especial con `motivo`, con la misma
// regla de estados que su recuadro de la fase 5 (CONDICION_EJERCICIO).
// `tarjetas`: { lupus, disautonomia, hipermovilidad, embarazo } de state; `respuestas`:
// state.sistemicoAnswers (regla vascular). Una regla de lectura, no clínica.
export function motivosEjercicio({ riesgoPsico, cuestionarios, tarjetas = {}, respuestas = {} } = {}) {
  const psico = riesgoPsico === 'Medio' || riesgoPsico === 'Alto';
  const cuest = CUESTIONARIOS.filter(d => CUESTIONARIOS_ANIMO.includes(d.id) && cuestionarios?.[d.id]).some(d => {
    const p = puntuar(d, cuestionarios[d.id].r || {});
    return p.completo && p.interpretacion && p.interpretacion.nivel !== 'ok';
  });
  const m = { animo: psico || cuest };
  for (const [k, c] of Object.entries(CONDICION_EJERCICIO)) {
    if (c.motivo) m[c.motivo] = condicionEnlazaEjercicio(k, datosCondicionEjercicio(k, tarjetas[k], respuestas));
  }
  return m;
}

const EXTRAS_EJERCICIO = [
  { motivo: 'animo', id: 'centrales', ayuda: 'enlaceMotivoAnimo' },
  ...Object.values(CONDICION_EJERCICIO).filter(c => c.motivo).map(c => ({ motivo: c.motivo, id: c.id, ayuda: c.ayudaPlan })),
];

// El enlace pintado en el bloque «Educación» de la fase 6 ('' si no hay bloque)
const listaY = xs => xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : xs[0];

export function enlaceEjercicioHTML(irritabilidad, motivos = {}) {
  const { bloque: b, hipotesis: porHip } = bloqueEjercicioParaPlan(irritabilidad, motivos.hipotesis || [], { cronologia: motivos.cronologia || '' });
  if (!b) return '';
  const T = TEXTOS_EJERCICIO;
  const ayuda = porHip.length
    ? T.enlaceEducacionAyudaHip.replace('{titulo}', b.titulo).replace('{hipotesis}', listaY(porHip.map(n => `«${n}»`)))
    : T.enlaceEducacionAyuda.replace('{titulo}', b.titulo);
  const otro = bloqueEjercicioAlternativo(irritabilidad, b);
  const otroHTML = otro
    ? `\n      <button type="button" class="plan-enlace plan-enlace-otro" data-bloque-alternativo="${esc(otro.id)}" onclick="abrirEjercicio({ bloque: '${esc(otro.id)}' })">${esc(T.enlaceEducacionOtro.replace('{titulo}', otro.titulo))}</button>` : '';
  const extrasHTML = EXTRAS_EJERCICIO.filter(x => motivos[x.motivo])
    .map(x => ({ x, bloque: bloquesConContenido().find(k => k.id === x.id) })).filter(e => e.bloque)
    .map(({ x, bloque }) => `\n      <button type="button" class="plan-enlace plan-enlace-otro" data-bloque-extra="${esc(bloque.id)}" onclick="abrirEjercicio({ bloque: '${esc(bloque.id)}' })">${esc(T.enlaceEducacionOtro.replace('{titulo}', bloque.titulo))}</button>
      <span class="plan-ayuda plan-ayuda-otro">${esc(T[x.ayuda])}</span>`).join('');
  return `<div class="plan-ejercicio" data-bloque-ejercicio="${esc(b.id)}"${porHip.length ? ' data-por-hipotesis' : ''}>
      <button type="button" class="plan-enlace" onclick="abrirEjercicio({ bloque: '${esc(b.id)}' })">${esc(T.enlaceEducacion)}</button>
      <span class="plan-ayuda">${esc(ayuda)}</span>${otroHTML}${extrasHTML}
    </div>`;
}

// Enlace de los recuadros de la fase 5: '' si la regla de CONDICION_EJERCICIO
// no enlaza en ese estado, si la condición no tiene bloque o si no está escrito.
// `datos`: { estado, subtipo, vs } del payload de la condición.
export function enlaceCondicionEjercicioHTML(condicion, datos = {}) {
  if (!condicionEnlazaEjercicio(condicion, datos)) return '';
  const c = CONDICION_EJERCICIO[condicion];
  const b = bloquesConContenido().find(k => k.id === c.id);
  if (!b) return '';
  const T = TEXTOS_EJERCICIO;
  return `<div class="cond-ejercicio" data-bloque-condicion="${esc(b.id)}">
          <button type="button" class="sint-recordatorio-ir" onclick="abrirEjercicio({ bloque: '${esc(b.id)}' })">${esc(T.enlaceCondicion.replace('{titulo}', b.titulo))}</button>
          <span class="cond-ejercicio-ayuda">${esc(T[c.ayuda])}</span>
        </div>`;
}

export function nivelHTML(nivel) {
  const n = NIVELES_EJERCICIO[nivel];
  return n ? ` <button type="button" class="ej-nivel ej-nivel-${nivel}" data-nivel="${nivel}" aria-expanded="false">${esc(n.corto)}</button>` : '';
}

// Contenido de la ficha que abre un chip de nivel
export function nivelFichaHTML(nivel) {
  const n = NIVELES_EJERCICIO[nivel];
  return n ? `<div class="ej-ficha"><strong>${esc(n.corto)}</strong><p>${esc(n.explicacion)}</p></div>` : '';
}

function apartadoHTML(a, items, { conNivel }) {
  const parrafos = items.map(f => `<p>${txt(f.t)}${conNivel ? nivelHTML(f.nivel) : ''}${iaParrafoHTML()}</p>`).join('');
  return `<section class="ej-apartado" data-apartado="${a.id}">
      <h4 class="ej-apartado-titulo">${esc(a.titulo)}</h4>
      ${parrafos}
    </section>`;
}

function bloqueHTML(b) {
  const ap = b.apartados;
  const cuerpo = APARTADOS_EJERCICIO.map(a => apartadoHTML(a, ap[a.id], { conNivel: a.id !== 'paciente' })).join('');
  const detalle = ap.detalle
    ? `<details class="ej-mas"><summary>Ampliar ▾</summary>${[].concat(ap.detalle).map(p => `<p>${txt(p)}${iaParrafoHTML()}</p>`).join('')}</details>`
    : '';
  const fuentes = `<div class="ej-fuentes"><span class="ej-fuentes-et">Fuentes</span> ${citasHTML(b.fuentes.join(' · '))}</div>`;
  return `<details class="ej-bloque" data-bloque="${b.id}">
    <summary><span class="ej-nombre">${esc(b.titulo)}</span><span class="ej-resumen">${esc(b.resumen)}</span></summary>
    <div class="ej-cuerpo" data-ia-ctx="${attrIA(ctxEjercicio(b.titulo))}">${cuerpo}${detalle}</div>
    ${fuentes}
  </details>`;
}

export function ejercicioHTML() {
  const T = TEXTOS_EJERCICIO;
  const pend = bloquesPendientes();
  const niveles = Object.entries(NIVELES_EJERCICIO)
    .map(([k, n]) => `<li><span class="ej-nivel ej-nivel-${k}">${esc(n.corto)}</span> ${esc(n.explicacion)}</li>`).join('');
  const pendientes = pend.length
    ? `<div class="ej-pendientes">
        <h3 class="ej-grupo">${esc(T.pendientesTitulo)}</h3>
        <ul class="ej-pendientes-lista">${pend.map(b => `<li><strong>${esc(b.titulo)}</strong>. ${esc(b.resumen)}.</li>`).join('')}</ul>
        <p class="ej-pendientes-nota">${esc(T.pendientesNota)}</p>
      </div>`
    : '';
  return `<p class="cond-intro">${esc(T.intro)}</p>
    <p class="cond-intro cond-intro-diag">${esc(T.limites)}</p>
    <details class="ej-niveles"><summary>${esc(T.nivelesTitulo)}</summary><ul>${niveles}</ul></details>
    ${bloquesConContenido().map(bloqueHTML).join('')}
    ${pendientes}
    <p class="cond-pie">${esc(T.pie)}</p>`;
}
