// ============================================================
// PhysiQ-Assessment · lib/tejidos.js
// Panel «Tiempos de recuperación» (⏱ de la cabecera): funciones puras
// ============================================================
//
// Pinta data/tejidos.js como un diagrama de barras sobre un eje de tiempo no
// lineal (las mismas columnas que la tabla del wiki), una sola estructura para
// escritorio y móvil (el CSS decide si el nombre va a la izquierda o encima).
// Con mecanismo Post-quirúrgico y semanas desde la cirugía, una línea «Hoy»
// marca dónde está el paciente. Sin DOM ni estado global: abrirTiemposTejido()
// (app.js) le pasa los datos y las semanas. Nada de esto va al payload, a los
// resúmenes ni al informe con IA. Diseño: docs/tiempos-tejido.md.

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Día → posición 0..1 en el eje. Cada columna ocupa lo mismo; dentro de la
// columna, lineal entre su primer y su último día. Fuera del eje, se pega a
// los extremos.
export function posicionDia(dias, columnas) {
  const n = columnas.length;
  if (!(dias > 0)) return 0;
  let ini = 0;
  for (let i = 0; i < n; i++) {
    const fin = columnas[i].hasta;
    if (dias <= fin) return (i + (dias - ini) / (fin - ini)) / n;
    ini = fin;
  }
  return 1;
}

// Semanas desde la cirugía → { pos, texto }, o null sin semanas.
export function marcaHoy(semanas, columnas) {
  if (semanas == null || !Number.isFinite(semanas) || semanas < 0) return null;
  const dias = semanas * 7;
  const fuera = dias > columnas[columnas.length - 1].hasta;
  const texto = semanas === 0
    ? 'Hoy · semana 0 tras la cirugía'
    : `Hoy · ${semanas} semana${semanas === 1 ? '' : 's'} tras la cirugía${fuera ? ' (fuera del eje)' : ''}`;
  return { pos: posicionDia(dias, columnas), texto };
}

// «días 0–5» · «semana 3 a 1 año»
function diasTexto(a, b) {
  const t = d => (d >= 365 ? `${Math.round(d / 365)} año${d >= 730 ? 's' : ''}` : d >= 21 ? `semana ${Math.round(d / 7)}` : `día ${d}`);
  return a < 21 && b < 21 ? `días ${a}–${b}` : `de ${t(a)} a ${t(b)}`;
}

const pct = x => `${(x * 100).toFixed(3)}%`;

function rangoTexto(fila, columnas) {
  const a = columnas[fila.desde].etiqueta, b = columnas[fila.hasta].etiqueta;
  return fila.desde === fila.hasta ? a : `de ${a} a ${b}`;
}

const lineaHoy = hoy => (hoy ? `<span class="tej-hoy" style="left:${pct(hoy.pos)}" aria-hidden="true"></span>` : '');

// HTML del cuerpo del panel. `semanas`: semanas desde la cirugía (o null);
// `posquirurgico`: si el mecanismo es Post-quirúrgico (para el texto de ayuda).
export function tiemposTejidoHTML(datos, { semanas = null, posquirurgico = false } = {}) {
  const { columnas, gravedades, grupos, fases, fasesNota, notas, fuente, fasesFuente } = datos;
  const n = columnas.length;
  const hoy = posquirurgico ? marcaHoy(semanas, columnas) : null;
  const pendienteChip = '<span class="tej-pendiente">pendiente de fuente</span>';

  const eje = `<div class="tej-fila tej-eje" aria-hidden="true"><div class="tej-nombre"></div>`
    + `<div class="tej-pista" style="--tej-n:${n}">${columnas.map(c => `<span class="tej-col" title="${esc(c.etiqueta)}">${esc(c.corta)}</span>`).join('')}`
    + `${hoy ? `<span class="tej-hoy-etq" style="left:${pct(hoy.pos)}">Hoy</span>` : ''}</div></div>`;

  const fasesPendientes = fases.some(f => !f.fuentes.length);
  const franja = `<div class="tej-fila tej-fases"><div class="tej-nombre">Fases de reparación${fasesPendientes ? ` ${pendienteChip}` : ''}</div>`
    + `<div class="tej-pista" style="--tej-n:${n}">`
    + fases.map(f => {
      const a = posicionDia(f.desdeDia, columnas), b = posicionDia(f.hastaDia, columnas);
      return `<span class="tej-fase tej-fase-${esc(f.id)}" style="left:${pct(a)};width:${pct(b - a)}" title="${esc(f.nombre)}: días ${f.desdeDia}–${f.hastaDia}">${esc(f.nombre)}</span>`;
    }).join('')
    + `${lineaHoy(hoy)}</div></div>`;

  const cuerpo = grupos.map(g => `<div class="tej-grupo">${esc(g.tejido)}</div>`
    + g.filas.map(f => {
      const rango = rangoTexto(f, columnas);
      return `<div class="tej-fila" data-tejido="${esc(f.id)}"><div class="tej-nombre">${esc(f.nombre)}${f.pendiente ? ` ${pendienteChip}` : ''}`
        + `${f.nota ? `<span class="tej-nota">${esc(f.nota)}</span>` : ''}</div>`
        + `<div class="tej-pista" style="--tej-n:${n}">`
        + `<span class="tej-barra tej-${esc(f.gravedad)}" style="grid-column:${f.desde + 1} / ${f.hasta + 2}" role="img" aria-label="${esc(`${f.nombre}: ${rango}`)}" title="${esc(rango)}"></span>`
        + `${lineaHoy(hoy)}</div></div>`;
    }).join('')).join('');

  const leyenda = `<div class="tej-leyenda">`
    + Object.entries(gravedades).map(([k, v]) => `<span class="tej-ley"><span class="tej-ley-muestra tej-${esc(k)}"></span>${esc(v)}</span>`).join('')
    + `</div><p class="tej-fases-texto">Fases de reparación (orientativas, se solapan): `
    + fases.map(f => `${esc(f.nombre.toLowerCase())}, ${diasTexto(f.desdeDia, f.hastaDia)}`).join(' · ') + '.'
    + `${fasesNota ? ` ${esc(fasesNota)}` : ''}</p>`;

  const ayudaHoy = hoy
    ? `<p class="tej-hoy-texto"><span class="tej-hoy-muestra"></span>${esc(hoy.texto)}. Semanas de la tarjeta «Cirugía» (fase 1).</p>`
    : posquirurgico
      ? '<p class="tej-ayuda">Con la fecha de la cirugía (o las semanas aproximadas) en la tarjeta «Cirugía», se marca dónde está el paciente.</p>'
      : '<p class="tej-ayuda">Con mecanismo Post-quirúrgico y la fecha de la cirugía, se marca dónde está el paciente.</p>';

  return `<div class="tej-diagrama">${eje}${franja}${cuerpo}</div>${leyenda}${ayudaHoy}`
    + `<ul class="tej-notas">${notas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
    + [fuente, fasesFuente].filter(Boolean).map(t => `<p class="tej-fuente">${esc(t)}</p>`).join('');
}
