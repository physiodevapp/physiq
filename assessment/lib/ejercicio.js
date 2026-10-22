// ============================================================
// PhysiQ-Assessment · lib/ejercicio.js
// Guía «Efectos del ejercicio» (docs/efectos-ejercicio.md): el HTML del
// diálogo a partir de data/ejercicio.js. Puro: no lee el estado del paciente
// ni guarda nada.
// ============================================================

import { NIVELES_EJERCICIO, APARTADOS_EJERCICIO, BLOQUES_EJERCICIO, TEXTOS_EJERCICIO } from '../data/ejercicio.js';
import { citasHTML, citasEnTexto } from './citas.js';
import { iaParrafoHTML, attrIA, ctxEjercicio } from '../ampliar-ia.js';

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
