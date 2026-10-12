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

// Rango corto para la leyenda de fases: «días 0–5» · «día 5–sem. 3» · «sem. 3–1 año» · «1–2 años»
export function rangoFase(a, b) {
  const t = d => (d >= 365 ? `${Math.round(d / 365)}` : d >= 21 ? `sem. ${Math.round(d / 7)}` : `día ${d}`);
  const fin = d => (d >= 365 ? `${Math.round(d / 365)} año${d >= 730 ? 's' : ''}` : t(d));
  return a < 21 && b < 21 ? `días ${a}–${b}` : `${t(a)}–${fin(b)}`;
}

const pct = x => `${(x * 100).toFixed(3)}%`;

function rangoTexto(fila, columnas) {
  const a = columnas[fila.desde].etiqueta, b = columnas[fila.hasta].etiqueta;
  return fila.desde === fila.hasta ? a : `de ${a} a ${b}`;
}

const lineaHoy = hoy => (hoy ? `<span class="tej-hoy" style="left:${pct(hoy.pos)}" aria-hidden="true"></span>` : '');

// Una fila (o un subtipo) del diagrama: nombre, nota, «pendiente de fuente» y la
// barra en su columna. `gravedad` por defecto: la de la fila madre.
function filaHTML(f, { columnas, hoy, pendienteChip, gravedad = f.gravedad, clase = '' }) {
  const n = columnas.length;
  const rango = rangoTexto(f, columnas);
  return `<div class="tej-fila${clase}" data-tejido="${esc(f.id)}"><div class="tej-nombre">${esc(f.nombre)}${f.pendiente ? ` ${pendienteChip}` : ''}`
    + `${f.nota ? `<span class="tej-nota">${esc(f.nota)}</span>` : ''}</div>`
    + `<div class="tej-pista" style="--tej-n:${n}">`
    + `<span class="tej-barra tej-${esc(gravedad)}" style="grid-column:${f.desde + 1} / ${f.hasta + 2}" role="img" aria-label="${esc(`${f.nombre}: ${rango}`)}" title="${esc(rango)}"></span>`
    + `${lineaHoy(hoy)}</div></div>`;
}

// Grupos que se ven con un filtro: 'todos' (o uno que no existe) = todos.
export function gruposVisibles(grupos, filtro) {
  return grupos.some(g => g.id === filtro) ? grupos.filter(g => g.id === filtro) : grupos;
}

// HTML del cuerpo del panel. `semanas`: semanas desde la cirugía (o null);
// `posquirurgico`: si el mecanismo es Post-quirúrgico (para el texto de ayuda);
// `filtro`: id de un grupo de tejido, o 'todos'. Las pastillas del filtro y los
// títulos de grupo llevan `data-filtro-tejido` (el filtro que ponen al tocarlos:
// el suyo, o 'todos' si ya era el activo); abrirTiemposTejido() (app.js)
// vuelve a pintar con el filtro elegido.
export function tiemposTejidoHTML(datos, { semanas = null, posquirurgico = false, filtro = 'todos' } = {}) {
  const { columnas, gravedades, grupos, fases, fasesNota, notas, fuente, fasesFuente } = datos;
  const n = columnas.length;
  const hoy = posquirurgico ? marcaHoy(semanas, columnas) : null;
  const pendienteChip = '<span class="tej-pendiente">pendiente de fuente</span>';
  const activo = grupos.some(g => g.id === filtro) ? filtro : 'todos';
  const claseFase = f => `tej-fase-${esc(f.id)}${f.tejido ? ' tej-fase-parcial' : ''}`;

  // Sin pastilla «Todos»: volver a tocar la activa la desmarca y se ven todos
  // (la misma regla que el resto de grupos de opciones de la app). Una sola fila
  // que se desliza en horizontal si no caben (decisión del usuario, 2026-10).
  const filtroHTML = `<div class="tej-filtro" role="group" aria-label="Filtrar por tejido">`
    + grupos.map(g =>
      `<button type="button" class="tej-filtro-btn${g.id === activo ? ' activo' : ''}" data-grupo="${esc(g.id)}" data-filtro-tejido="${esc(g.id === activo ? 'todos' : g.id)}" aria-pressed="${g.id === activo}"${g.id === activo ? ` title="Ver todos los tejidos"` : ''}>${esc(g.tejido)}</button>`).join('')
    + '</div>';

  const eje = `<div class="tej-fila tej-eje" aria-hidden="true"><div class="tej-nombre"></div>`
    + `<div class="tej-pista" style="--tej-n:${n}">${columnas.map(c => `<span class="tej-col" title="${esc(c.etiqueta)}">${esc(c.corta)}</span>`).join('')}`
    + `${hoy ? `<span class="tej-hoy-etq" style="left:${pct(hoy.pos)}">Hoy</span>` : ''}`
    // Tira con los colores de las fases de reparación bajo las etiquetas: el eje es
    // sticky, así que al hacer scroll se sigue viendo qué fase cae en cada columna.
    + fases.map(f => {
      const a = posicionDia(f.desdeDia, columnas), b = posicionDia(f.hastaDia, columnas);
      return `<span class="tej-eje-fase ${claseFase(f)}" style="left:${pct(a)};width:${pct(b - a)}"></span>`;
    }).join('')
    + '</div></div>';

  // Leyenda de las fases (antes una franja con el nombre dentro de cada tramo, que
  // en móvil se cortaba: «Inflama…»). La posición la da la tira del eje fijo; aquí
  // va qué es cada color, con su nombre entero y su rango, en líneas que se ajustan.
  const fasesPendientes = fases.some(f => !f.fuentes.length);
  const franja = `<div class="tej-fases"><div class="tej-fases-titulo">Fases de reparación${fasesPendientes ? ` ${pendienteChip}` : ''}</div>`
    + '<ul class="tej-fases-leyenda">'
    + fases.map(f => `<li class="tej-fase-ley ${claseFase(f)}"><span class="tej-fase-muestra" aria-hidden="true"></span>`
      + `<span class="tej-fase-nombre">${esc(f.nombre)}</span><span class="tej-fase-rango">${rangoFase(f.desdeDia, f.hastaDia)}</span></li>`).join('')
    + '</ul></div>';

  const ctx = { columnas, hoy, pendienteChip };
  const cuerpo = gruposVisibles(grupos, activo).map(g => `<div class="tej-bloque" data-grupo="${esc(g.id)}">`
    // El título del grupo también filtra (o vuelve a «Todos» si ya es el filtrado)
    + `<button type="button" class="tej-grupo" data-grupo="${esc(g.id)}" data-filtro-tejido="${esc(activo === g.id ? 'todos' : g.id)}" title="${esc(activo === g.id ? 'Ver todos los tejidos' : `Ver solo ${g.tejido.toLowerCase()}`)}">${esc(g.tejido)}</button>`
    + g.filas.map(f => filaHTML(f, ctx)
      + (f.subtipos?.length
        ? `<details class="tej-subtipos"><summary>${f.subtipos.length} ${f.subtipos.length === 1 ? 'subtipo' : 'subtipos'} de ${esc(f.nombre.toLowerCase())}</summary>`
          + f.subtipos.map(st => filaHTML(st, { ...ctx, gravedad: st.gravedad || f.gravedad, clase: ' tej-subfila' })).join('')
          + '</details>'
        : '')).join('')
    + '</div>').join('');

  const leyenda = `<div class="tej-leyenda">`
    + Object.entries(gravedades).map(([k, v]) => `<span class="tej-ley"><span class="tej-ley-muestra tej-${esc(k)}"></span>${esc(v)}</span>`).join('')
    + `</div><p class="tej-fases-texto">Las fases de reparación son orientativas y se solapan.${fasesNota ? ` ${esc(fasesNota)}` : ''}</p>`;

  const ayudaHoy = hoy
    ? `<p class="tej-hoy-texto"><span class="tej-hoy-muestra"></span>${esc(hoy.texto)}. Semanas de la tarjeta «Cirugía» (fase 1).</p>`
    : posquirurgico
      ? '<p class="tej-ayuda">Con la fecha de la cirugía (o las semanas aproximadas) en la tarjeta «Cirugía», se marca dónde está el paciente.</p>'
      : '<p class="tej-ayuda">Con mecanismo Post-quirúrgico y la fecha de la cirugía, se marca dónde está el paciente.</p>';

  return `${filtroHTML}<div class="tej-diagrama">${eje}${franja}${cuerpo}</div>${leyenda}${ayudaHoy}`
    + `<ul class="tej-notas">${notas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
    + [fuente, fasesFuente].filter(Boolean).map(t => `<p class="tej-fuente">${esc(t)}</p>`).join('');
}
