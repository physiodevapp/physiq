// La hoja «Dermatomas, miotomas y reflejos» fuera de Node: la página de la guía (guia.html#neuro)
// y la silueta por delante y por detrás (siluetaPuntosSVG, para el body chart de la parte C). Contenido de data/neuro.js; diseño en docs/hojas-consulta-y-plantillas.md.
// Puro: no lee el estado ni guarda nada.
import { RAICES_MIOTOMA, RAICES_SOLO_PUNTO, REFLEJOS, TEXTOS_NEURO, FUENTES_NEURO, KENHUB_NEURO, ASIA_HOJA } from '../data/neuro.js';
import { SILUETAS } from '../data/siluetas.js';
import { SILUETAS_HOJA } from '../data/siluetas-hojas.js';
import { citasHTML, citasEnTexto } from './citas.js';
import { atributosIA, iaParrafoHTML } from '../ampliar-ia.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// La silueta de una vista, con sus puntos: frente (data/siluetas-hojas.js) o espalda (la de la
// fase 2, data/siluetas.js, con la cabeza de data/siluetas-hojas.js). `puntos`: { etiqueta:
// [x, y, xEtiqueta, yEtiqueta] }; sin puntos, la silueta sola (el body chart para fotocopiar).
export function siluetaPuntosSVG(vista, puntos = {}, { sexo = 'hombre', ancho = 300 } = {}) {
  const S = SILUETAS_HOJA[sexo];
  const caja = vista === 'frente' ? S.frente.caja : SILUETAS[sexo].caja;
  const contorno = vista === 'frente' ? S.frente.contorno : SILUETAS[sexo].contorno;
  const cab = vista === 'frente' ? S.frente : S.espalda;
  const alto = Math.round(ancho * caja[3] / caja[2]);
  const trazo = d => `<path d="${d}" fill="none" stroke="#334155" stroke-width="2.2" vector-effect="non-scaling-stroke"/>`;
  const pelo = d => `<path d="${d}" fill="#e5e7eb" stroke="#334155" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
  // Etiquetas a ~8,5 px impresos, sea cual sea la escala de la vista
  const fs = Math.round(8.5 * caja[2] / ancho), r = Math.round(fs / 4);
  const dots = Object.entries(puntos).map(([k, [x, y, lx = x + fs / 2, ly = y]]) => {
    const izq = lx < x;
    const lejos = Math.hypot(lx - x, ly - y) > fs;
    return `${lejos ? `<line x1="${x}" y1="${y}" x2="${izq ? lx + fs / 4 : lx - fs / 4}" y2="${ly - fs / 3}" stroke="#94a3b8" stroke-width="1" vector-effect="non-scaling-stroke"/>` : ''}<circle cx="${x}" cy="${y}" r="${r}" fill="#dc2626"/><text x="${lx}" y="${ly}" text-anchor="${izq ? 'end' : 'start'}" font-size="${fs}" font-weight="700" fill="#1e3a8a" font-family="Helvetica, Arial, sans-serif">${esc(k)}</text>`;
  }).join('');
  return `<svg class="sil" xmlns="http://www.w3.org/2000/svg" viewBox="${caja.join(' ')}" width="${ancho}" height="${alto}" overflow="visible" style="overflow:visible" role="img" aria-label="Silueta ${vista === 'frente' ? 'por delante' : 'por detrás'}">${(cab.pelo || []).map(pelo).join('')}${(cab.cabeza || []).map(trazo).join('')}${trazo(contorno)}${dots}</svg>`;
}

// Contexto de «✨ IA» de la página: el tema, nunca datos del paciente
export const CTX_NEURO = 'la exploración neurológica de dermatomas, miotomas y reflejos en fisioterapia musculoesquelética';

// La página de la guía: lo mismo que la hoja, con citas tocables, «✨ IA» y los enlaces a Kenhub
export function neuroGuiaHTML() {
  const T = TEXTOS_NEURO;
  const p = t => `<p data-ia-parrafo>${citasEnTexto(esc(t))}${iaParrafoHTML()}</p>`;
  const lista = arr => `<ul class="guia-cc-lista">${arr.map(t => `<li data-ia-parrafo>${citasEnTexto(esc(t))}${iaParrafoHTML()}</li>`).join('')}</ul>`;
  const raices = RAICES_MIOTOMA.map(r => `<tr><th>${r.raiz}</th><td>${esc(r.punto)}</td><td><b>${esc(r.musculo)}</b><div class="guia-neuro-pos">${esc(r.posicion)}</div></td><td>${r.reflejos.map(k => esc(REFLEJOS[k].nombre)).join(', ') || '—'}</td></tr>`).join('');
  const puntos = RAICES_SOLO_PUNTO.map(r => `<tr><th>${r.raiz}</th><td>${esc(r.punto)}</td></tr>`).join('');
  const reflejos = Object.values(REFLEJOS).map(r => `<tr><th>${esc(r.nombre)}</th><td>${esc(r.niveles)}</td><td>${esc(r.nervio)}</td><td>${esc(r.golpe)}</td></tr>`).join('');
  const kenhub = KENHUB_NEURO.map(k => `<a href="${k.es}" target="_blank" rel="noopener noreferrer">${esc(k.nombre)} ↗</a>`).join(' · ');
  return `<div ${atributosIA(CTX_NEURO)}>
    <p class="guia-nota">${esc(T.sub)}</p>
    <p class="guia-nota">Dibujo de los puntos clave: <a href="${ASIA_HOJA}" target="_blank" rel="noopener noreferrer">la hoja oficial de ASIA ↗</a> (gratuita, sin cuenta). ${esc(T.hojaOficial)} Y las ilustraciones de Kenhub (se ven sin cuenta, aunque puede pedir registrarse, gratis; con cuenta, también sus tablas): ${kenhub}</p>
    <section class="guia-bloque"><h3>Raíz, punto sensitivo, músculo y reflejo</h3>
      <div class="guia-neuro-tabla"><table><thead><tr><th>Raíz</th><th>Punto sensitivo clave</th><th>Músculo clave · posición para el grado 4–5</th><th>Reflejo</th></tr></thead><tbody>${raices}</tbody></table></div>
      <h4>Raíces sin músculo clave</h4>
      <div class="guia-neuro-tabla"><table><tbody>${puntos}</tbody></table></div></section>
    <section class="guia-bloque"><h3>Cómo se puntúa</h3>
      <h4>Fuerza</h4>${lista(T.fuerza)}${p(T.fuerzaNota)}
      <h4>Sensibilidad</h4>${lista(T.sensibilidad)}${p(T.sensibilidadNota)}</section>
    <section class="guia-bloque"><h3>Reflejos osteotendinosos</h3>
      <div class="guia-neuro-tabla"><table><thead><tr><th>Reflejo</th><th>Raíces</th><th>Nervio</th><th>Dónde golpear</th></tr></thead><tbody>${reflejos}</tbody></table></div>
      <h4>Escala</h4>${lista(T.escalaReflejos)}${p(T.nivelesReflejos)}${p(T.tecnicaReflejos)}${p(T.interpretacionReflejos)}</section>
    <section class="guia-bloque guia-neuro-nms"><h3>${esc(T.nmsTitulo)}</h3>${lista(T.nms)}${p(T.nmsDecision)}</section>
    <section class="guia-bloque"><h3>Por qué puntos y no bandas</h3>${lista(T.variabilidad)}</section>
    <section class="guia-bloque"><h3>Raíz o nervio periférico</h3>${lista(T.raizNervio)}</section>
    <section class="guia-bloque"><h3>Más</h3>
      <p class="guia-nota">${esc(T.limite)} ${esc(T.hojaOficial)}</p>
      <p class="guia-nota">${esc(T.derechos)}</p>
      <p class="guia-nota">Fuentes: ${citasHTML(FUENTES_NEURO.join(' · '))}</p></section>
  </div>`;
}
