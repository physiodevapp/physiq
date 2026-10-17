// ============================================================
// PhysiQ-Assessment · lib/condiciones.js
// Guía de condiciones especiales (docs/condiciones-especiales.md): el estado
// de cada fila a partir del `state` y el HTML del diálogo. Puro: solo lee el
// estado que recibe, nunca lo cambia; el contenido está en data/condiciones.js.
// ============================================================

import { CONDICIONES, TEXTOS_CONDICIONES } from '../data/condiciones.js';
import { citasHTML } from './citas.js';
import { nombreRegion } from './region.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const SUBTIPO_HM = { hipermovil: 'hipermóvil', vascular: 'vascular', otro: 'otro' };
const TIPO_DS = { pots: 'POTS', ho: 'hipotensión ortostática' };

// Etiqueta de estado de una fila: { texto, marcada } o null (sin etiqueta).
// Tarlov y cascanueces solo dicen «Sí» con la pregunta marcada y lumbar
// elegida: el cribado guarda «NO» por defecto, así que nunca se inventa un
// «No» (decisión 4).
export function estadoCondicion(c, st) {
  const marcada = texto => ({ texto, marcada: true });
  const sin = texto => ({ texto, marcada: false });
  switch (c.id) {
    case 'posquirurgico':
      return st.mecanismo === 'Post-quirúrgico' ? marcada('Marcado') : sin('No marcado');
    case 'hipermovilidad': {
      const hm = st.hipermovilidad || {};
      if (hm.estado === 'diagnosticada') return marcada(`Diagnosticada${SUBTIPO_HM[hm.subtipo] ? ` (${SUBTIPO_HM[hm.subtipo]})` : ''}`);
      return hm.estado === 'sospecha' ? marcada('Sospecha') : sin('No consta');
    }
    case 'disautonomia': {
      const ds = st.disautonomia || {};
      if (ds.estado === 'diagnosticada') return marcada(`Diagnosticada${TIPO_DS[ds.tipo] ? ` (${TIPO_DS[ds.tipo]})` : ''}`);
      return ds.estado === 'sospecha' ? marcada('Sospecha') : sin('No consta');
    }
    case 'lupus': {
      const le = st.lupus || {};
      if (le.estado === 'diagnosticado') return marcada('Diagnosticado');
      return le.estado === 'sospecha' ? marcada('Sospecha') : sin('No consta');
    }
    default:
      if (c.destino?.pregunta && st.region === c.region && st.sistemicoAnswers?.[c.destino.pregunta] === 'SI') return marcada('Sí');
      return null;
  }
}

// Con otra región elegida, el botón de una fila de región no navega
// (decisión 3): la pregunta solo existe en el cribado de esa región.
export const destinoDisponible = (c, st) => !c.region || st.region === c.region;

const conRegion = (texto, region) => texto.replace('{region}', nombreRegion(region).toLowerCase());

function filaHTML(c, st) {
  const estado = estadoCondicion(c, st);
  const disponible = destinoDisponible(c, st);
  const etiqueta = estado ? `<span class="cond-estado${estado.marcada ? ' cond-estado-on' : ''}">${esc(estado.texto)}</span>` : '';
  const pistas = c.pistas.map(p => `<li>${esc(p.texto)}</li>`).join('');
  const boton = disponible
    ? `<button type="button" class="cond-ir" data-cond="${c.id}" onclick="irACondicion('${c.id}')">${esc(c.boton)}</button>`
    : `<button type="button" class="cond-ir" data-cond="${c.id}" disabled>${esc(conRegion(TEXTOS_CONDICIONES.sinRegion, c.region))}</button>`;
  const fuentes = c.fuentes.length ? `<div class="cond-fuentes">${citasHTML(c.fuentes.join(' · '))}</div>` : '';
  return `<section class="cond-fila" data-condicion="${c.id}">
    <div class="cond-cabecera"><h3 class="cond-nombre">${esc(c.nombre)}</h3>${etiqueta}</div>
    <p class="cond-que">${esc(c.que)}</p>
    <div class="cond-piensa">${esc(c.piensa)}</div>
    <ul class="cond-pistas">${pistas}</ul>
    <p class="cond-anade"><span class="cond-anade-et">Añade:</span> ${esc(c.anade)}</p>
    ${fuentes}
    <div class="cond-acciones">${boton}</div>
  </section>`;
}

export function condicionesHTML(st) {
  const T = TEXTOS_CONDICIONES;
  const transversales = CONDICIONES.filter(c => !c.region).map(c => filaHTML(c, st)).join('');
  const regiones = [...new Set(CONDICIONES.filter(c => c.region).map(c => c.region))];
  const deRegion = regiones.map(r => `<h3 class="cond-grupo">${esc(conRegion(T.grupoRegion, r))}</h3>`
    + CONDICIONES.filter(c => c.region === r).map(c => filaHTML(c, st)).join('')).join('');
  return `<p class="cond-intro">${esc(T.intro)}</p>
    <p class="cond-intro cond-intro-diag">${esc(T.diagnostico)}</p>
    ${transversales}${deRegion}
    <p class="cond-pie">${esc(T.pie)}</p>`;
}
