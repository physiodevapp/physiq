// ============================================================
// PhysiQ-Assessment · lib/farmacos.js
// Guía de fármacos para el fisioterapeuta (docs/farmacologia.md, paso 2): el
// HTML del diálogo a partir de data/farmacos.js. Puro: no lee el estado del
// paciente (las familias del paso 3 llegan como argumento) ni guarda nada.
// ============================================================

import { APARTADOS_FARMACO, FAMILIAS_FARMACO, TEXTOS_FARMACOS } from '../data/farmacos.js';
import { TEXTOS_FARMACOS_PACIENTE } from '../data/farmacos-paciente.js';
import { citasHTML, citasEnTexto } from './citas.js';
import { iaParrafoHTML, attrIA, ctxFarmaco } from '../ampliar-ia.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Texto de data/ con las citas de dentro de la frase como botones (lib/citas.js)
const txt = s => citasEnTexto(esc(s));

// Ficha técnica en CIMA (AEMPS), como los enlaces de Kenhub: un enlace por
// principio activo de `cima` (data/farmacos.js), nunca un iframe ni el
// contenido de la ficha. CIMA no admite enlazar a una búsqueda (`?pa=` vuelve
// a la portada, comprobado por el usuario, 2026-10): el enlace abre su
// buscador, vacío, y la app copia el nombre para pegarlo (app.js, click en
// `[data-cima]`). En la URL no va nada, ni siquiera el nombre.
export const CIMA_BUSCADOR = 'https://cima.aemps.es/cima/publico/buscadoravanzado.html';
export const textoCima = (plantilla, nombre) => plantilla.replace('{n}', nombre);

function cimaHTML(f) {
  if (!f.cima?.length) return '';
  const T = TEXTOS_FARMACOS;
  const enlaces = f.cima.map(n => `<a class="anat-enlace farm-cima-enlace" href="${CIMA_BUSCADOR}" target="_blank" rel="noopener noreferrer" data-cima="${esc(n)}" title="${esc(textoCima(T.cimaTitulo, n))}">${esc(n)} ↗</a>`);
  return `<div class="test-anat farm-cima"><span class="test-anat-etq">${esc(T.cima)}</span> ${enlaces.join('<span class="test-anat-sep"> · </span>')}</div>`;
}

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

function familiaHTML(f, abierta = false) {
  const apartados = APARTADOS_FARMACO.map(a => apartadoHTML(a, f.apartados[a.id])).join('');
  const fuentes = `<div class="farm-fuentes"><span class="farm-fuentes-et">Fuentes</span> ${citasHTML(f.fuentes.join(' · '))}</div>`;
  return `<details class="farm-familia" data-familia="${f.id}"${abierta ? ' open' : ''}>
    <summary><span class="farm-nombre">${esc(f.nombre)}</span><span class="farm-ejemplos">${esc(f.ejemplos)}</span></summary>
    ${cimaHTML(f)}
    <div class="farm-cuerpo" data-ia-ctx="${attrIA(ctxFarmaco(f.nombre))}">${apartados}</div>
    ${fuentes}
  </details>`;
}

// Chip «Este paciente» (paso 3, docs/farmacos-paciente.md): `paciente` =
// [{ id, texto }] de las familias que toma, ya calculadas por quien llama
// (lib/farmacos-paciente.js); con `filtro: 'paciente'` solo esas, desplegadas.
// Un segundo toque (data-filtro-farmaco="todas") vuelve a todas. Sigue sin
// leer el estado.
export const FILTRO_PACIENTE_FARM = 'paciente';

export function farmacosHTML({ paciente = [], filtro = '' } = {}) {
  const T = TEXTOS_FARMACOS;
  const conPaciente = paciente.length > 0;
  const solo = conPaciente && filtro === FILTRO_PACIENTE_FARM;
  const ids = new Set(paciente.map(x => x.id));
  const pendientes = familiasPendientes();
  const pend = pendientes.length && !solo
    ? `<div class="farm-pendientes">
        <h3 class="farm-grupo">${esc(T.pendientesTitulo)}</h3>
        <p class="farm-pendientes-lista">${esc(pendientes.map(f => f.nombre).join(' · '))}</p>
        <p class="farm-pendientes-nota">${esc(T.pendientesNota)}</p>
        <button type="button" class="cond-ir farm-preguntar" onclick="farmacosPreguntarIA()">${esc(T.preguntar)}</button>
      </div>`
    : '';
  const chip = conPaciente
    ? `<div class="tej-filtro farm-filtro" role="group" aria-label="Filtrar familias"><button type="button" class="tej-filtro-btn tej-filtro-paciente${solo ? ' activo' : ''}" data-filtro-farmaco="${solo ? 'todas' : FILTRO_PACIENTE_FARM}" aria-pressed="${solo}"${solo ? ' title="Ver todas las familias"' : ''}>Este paciente</button></div>`
    : '';
  const linea = solo
    ? `<p class="tej-paciente farm-paciente">${esc(TEXTOS_FARMACOS_PACIENTE.guiaPaciente)} ${esc(paciente.map(x => x.texto).join(' · '))}. ${esc(TEXTOS_FARMACOS_PACIENTE.guiaVolver)}</p>`
    : '';
  const familias = familiasConContenido().filter(f => !solo || ids.has(f.id));
  return `<p class="cond-intro">${esc(T.intro)}</p>
    <p class="cond-intro cond-intro-diag">${esc(T.limites)}</p>
    <p class="cond-intro farm-cima-nota">${esc(T.cimaNota)}</p>
    ${chip}${linea}
    ${familias.map(f => familiaHTML(f, solo)).join('')}
    ${pend}
    <p class="cond-pie">${esc(T.pie)}</p>`;
}
