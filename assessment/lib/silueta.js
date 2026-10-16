// ============================================================
// PhysiQ-Assessment · lib/silueta.js
// Silueta de la fase 2 (vista posterior): un toque en una zona elige la región
// y el lado. Los datos (trazados y zonas) están en data/siluetas.js; app.js
// pinta (`_pintarSilueta()`) y responde a los toques (`tocarZonaSilueta()`).
// Puro.
// ============================================================

import { regionConLado } from './region.js';

// Figura que se dibuja: la del sexo (el mismo dato en las fases 1 y 2; sin
// sexo indicado, la masculina).
export function figuraSilueta(sexo) {
  return sexo === 'Mujer' ? 'mujer' : 'hombre';
}

// Estado de una zona con la región y el lado elegidos:
// 'on'     → es la región y el lado (o la zona sin lado de la columna; con
//            «Bilateral», las dos zonas de la región)
// 'region' → es la región, pero el lado no se ha indicado
// 'off'    → el resto
export function estadoZona(zona, region, lado) {
  if (!region || zona.region !== region) return 'off';
  if (!zona.lado) return 'on';
  if (lado === zona.lado || lado === 'Bilateral') return 'on';
  return lado ? 'off' : 'region';
}

// Lado que queda al tocar una zona: el de la zona; en la columna (zona sin
// lado), el que ya hubiera si es la misma región, y ninguno si es otra.
export function ladoAlTocar(zona, region, lado) {
  if (zona.lado) return zona.lado;
  return zona.region === region ? (lado || '') : '';
}

// Texto bajo el título: lo elegido, o qué hacer
export function textoElegida(region, lado) {
  if (!region) return { principal: 'Toca la zona en la silueta', sub: 'Un toque elige la región y el lado' };
  // Con lado, `sub` vacío: su línea queda reservada (CSS) para que la figura
  // no suba bajo el dedo al elegir el lado.
  return { principal: regionConLado(region, lado), sub: lado ? '' : 'Lado sin indicar (opcional)' };
}

// Texto junto a los botones de sexo: sin sexo, que falta (la figura es la
// masculina por defecto); con sexo, nada. La fila tiene alto fijo, así que
// aparecer o no nunca mueve la figura.
export function notaSexo(sexo) {
  return sexo ? '' : 'Sin indicar';
}

const pct = n => `${Math.round(n * 1000) / 10}%`;

// HTML de la figura con sus zonas, sin nada seleccionado (app.js marca las
// zonas después, para no repintar el dibujo en cada toque). Las zonas se
// colocan en % del dibujo, así que siguen en su sitio a cualquier anchura.
export function siluetaHTML(fig, figura) {
  const [x0, y0, w, h] = fig.caja;
  const pos = (x, y) => `left:${pct((x - x0) / w)};top:${pct((y - y0) / h)}`;
  const zonas = fig.zonas.map(z => {
    const nombre = regionConLado(z.region, z.lado);
    return `<button type="button" class="sil-zona" data-region="${z.region}" data-lado="${z.lado}" style="${pos(z.x, z.y)}" aria-label="${nombre}" title="${nombre}" aria-pressed="false" onclick="tocarZonaSilueta('${z.region}', '${z.lado}')"><span class="sil-punto"></span></button>`;
  }).join('');
  const sin = fig.sinRegion.map(s =>
    `<span class="sil-sin-region" style="${pos(s.x, s.y)}" title="${s.nombre}: sin región en PhysiQ" aria-hidden="true"></span>`).join('');
  const trazos = fig.pelo.map(d => `<path class="sil-pelo" d="${d}"/>`).join('')
    + fig.partes.map(d => `<path class="sil-parte" d="${d}"/>`).join('');
  // Sexo: el mismo dato que en la fase 1 (`state.sexo`), con sus mismas reglas
  // (un segundo toque lo quita); app.js marca el elegido.
  const sexo = ['Mujer', 'Hombre'].map(s =>
    `<button type="button" class="option-btn" data-sexo="${s}" aria-pressed="false" onclick="elegirSexoSilueta('${s}')">${s}</button>`).join('');
  return `<div class="sil-elegida" aria-live="polite"><span class="sil-elegida-texto"></span><span class="sil-elegida-sub"></span></div>
    <div class="sil-sexo-fila">
      <span class="sil-sexo-etq" id="silSexoEtq">Sexo</span>
      <div class="option-group sil-sexo" role="group" aria-labelledby="silSexoEtq">${sexo}</div>
      <span class="sil-nota"></span>
    </div>
    <div class="sil-lienzo" data-figura="${figura}" style="aspect-ratio:${w} / ${h}">
      <svg viewBox="${fig.caja.join(' ')}" aria-hidden="true" focusable="false"><path class="sil-contorno" d="${fig.contorno}"/>${trazos}</svg>
      <span class="sil-lado sil-lado-izq" aria-hidden="true">IZQ</span><span class="sil-lado sil-lado-der" aria-hidden="true">DER</span>
      ${sin}${zonas}
    </div>
    <p class="sil-pie">Vista posterior: el lado del paciente es el mismo que el tuyo. En gris punteado, zonas sin región en PhysiQ. El sexo es el mismo de la fase 1.
      <span class="sil-credito">Ilustración: react-native-body-highlighter (licencia MIT)</span></p>`;
}
