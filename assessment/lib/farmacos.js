// ============================================================
// PhysiQ-Assessment · lib/farmacos.js
// Guía de fármacos para el fisioterapeuta (docs/farmacologia.md, paso 2): el
// HTML del diálogo a partir de data/farmacos.js. Puro: no lee el estado del
// paciente (eso será el paso 3) ni guarda nada.
// ============================================================

import { APARTADOS_FARMACO, FAMILIAS_FARMACO, TEXTOS_FARMACOS } from '../data/farmacos.js';
import { citasHTML, citasEnTexto } from './citas.js';
import { iaParrafoHTML, attrIA, ctxFarmaco } from '../ampliar-ia.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Texto de data/ con las citas de dentro de la frase como botones (lib/citas.js)
const txt = s => citasEnTexto(esc(s));

export const familiasConContenido = () => FAMILIAS_FARMACO.filter(f => f.apartados);
export const familiasPendientes = () => FAMILIAS_FARMACO.filter(f => !f.apartados);

function apartadoHTML(a, contenido) {
  const parrafos = [].concat(contenido.texto).map(p => `<p>${txt(p)}${iaParrafoHTML()}</p>`).join('');
  const detalle = contenido.detalle
    ? `<details class="farm-mas"><summary>Ampliar ▾</summary>${[].concat(contenido.detalle).map(p => `<p>${txt(p)}${iaParrafoHTML()}</p>`).join('')}</details>`
    : '';
  return `<section class="farm-apartado" data-apartado="${a.id}">
      <h4 class="farm-apartado-titulo">${esc(a.titulo)}</h4>
      ${parrafos}${detalle}
    </section>`;
}

function familiaHTML(f) {
  const apartados = APARTADOS_FARMACO.map(a => apartadoHTML(a, f.apartados[a.id])).join('');
  const fuentes = `<div class="farm-fuentes"><span class="farm-fuentes-et">Fuentes</span> ${citasHTML(f.fuentes.join(' · '))}</div>`;
  return `<details class="farm-familia" data-familia="${f.id}">
    <summary><span class="farm-nombre">${esc(f.nombre)}</span><span class="farm-ejemplos">${esc(f.ejemplos)}</span></summary>
    <div class="farm-cuerpo" data-ia-ctx="${attrIA(ctxFarmaco(f.nombre))}">${apartados}</div>
    ${fuentes}
  </details>`;
}

export function farmacosHTML() {
  const T = TEXTOS_FARMACOS;
  const pendientes = familiasPendientes();
  const pend = pendientes.length
    ? `<div class="farm-pendientes">
        <h3 class="farm-grupo">${esc(T.pendientesTitulo)}</h3>
        <p class="farm-pendientes-lista">${esc(pendientes.map(f => f.nombre).join(' · '))}</p>
        <p class="farm-pendientes-nota">${esc(T.pendientesNota)}</p>
        <button type="button" class="cond-ir farm-preguntar" onclick="farmacosPreguntarIA()">${esc(T.preguntar)}</button>
      </div>`
    : '';
  return `<p class="cond-intro">${esc(T.intro)}</p>
    <p class="cond-intro cond-intro-diag">${esc(T.limites)}</p>
    ${familiasConContenido().map(familiaHTML).join('')}
    ${pend}
    <p class="cond-pie">${esc(T.pie)}</p>`;
}
