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
// Qué mide la barra (`mide`, clave de `medidas`): el relleno (liso, rayado, contorno) y,
// si la medida lleva `marca`, una etiqueta tras el nombre.
function filaHTML(f, { columnas, hoy, pendienteChip, medidas = {}, gravedad = f.gravedad, clase = '' }) {
  const n = columnas.length;
  // Fila sin barra (sin `desde`): solo el nombre y su nota, con la pista vacía para que
  // las rayas de las columnas sigan alineadas; sus subtipos llevan las barras.
  if (!tieneBarra(f)) {
    return `<div class="tej-fila tej-sin-barra${clase}" data-tejido="${esc(f.id)}"><div class="tej-nombre">${esc(f.nombre)}`
      + `${f.nota ? `<span class="tej-nota">${esc(f.nota)}</span>` : ''}</div>`
      + `<div class="tej-pista" style="--tej-n:${n}"></div></div>`;
  }
  const rango = rangoTexto(f, columnas);
  const m = medidas[f.mide] || {};
  const marca = m.marca ? ` <span class="tej-marca" data-mide="${esc(f.mide)}">${esc(m.marca)}</span>` : '';
  const que = m.etiqueta ? ` (${m.etiqueta.toLowerCase()})` : '';
  // La barra es un botón: tocarla abre la tarjeta de infoBarraHTML() (qué gravedad, qué mide
  // y qué plazo), para no tener que bajar hasta la leyenda (decisión del usuario, 2026-10).
  return `<div class="tej-fila${clase}" data-tejido="${esc(f.id)}"><div class="tej-nombre">${esc(f.nombre)}${marca}${f.pendiente ? ` ${pendienteChip}` : ''}`
    + `${f.nota ? `<span class="tej-nota">${esc(f.nota)}</span>` : ''}</div>`
    + `<div class="tej-pista" style="--tej-n:${n}">`
    + `<button type="button" class="tej-barra tej-${esc(gravedad)}${m.relleno ? ` tej-relleno-${esc(m.relleno)}` : ''}" data-mide="${esc(f.mide || '')}" data-barra="${esc(f.id)}" style="grid-column:${f.desde + 1} / ${f.hasta + 2}" aria-expanded="false" aria-controls="tejInfo" aria-label="${esc(`${f.nombre}: ${rango}${que}`)}"></button>`
    + `${lineaHoy(hoy)}</div></div>`;
}

// Una fila puede no llevar barra (sin `desde`/`hasta`): las filas madre cuyo plazo general
// no tiene fuente (decisión del usuario, 2026-10); la barra la llevan sus subtipos.
export const tieneBarra = f => Number.isInteger(f.desde) && Number.isInteger(f.hasta);

// Fila o subtipo por id → { fila, madre, gravedad } (el subtipo sin `gravedad` toma la de
// su fila madre), o null.
export function buscarFila(datos, id) {
  for (const g of datos.grupos) {
    for (const f of g.filas) {
      if (f.id === id) return { fila: f, madre: null, gravedad: f.gravedad };
      const st = (f.subtipos || []).find(x => x.id === id);
      if (st) return { fila: st, madre: f, gravedad: st.gravedad || f.gravedad };
    }
  }
  return null;
}

// Fuentes de una barra o de la nota de un grupo: un <li> por clave del registro
// (data/referencias.js), enlazada a su `url` o, sin ella, a su DOI. `REF` es el registro
// ya cargado (app.js lo carga con import() al abrir el panel); sin él, o si la clave no
// tiene enlace, solo el texto.
export function fuentesTejidoHTML(claves, REF = null) {
  return claves.map(k => {
    const r = REF?.[k];
    const url = r?.url || (r?.doi ? `https://doi.org/${r.doi}` : null);
    return url
      ? `<li><a class="tej-fuente-enlace" href="${esc(url)}" target="_blank" rel="noopener noreferrer"${r.titulo ? ` title="${esc(r.titulo)}"` : ''}>${esc(k)} ↗</a></li>`
      : `<li>${esc(k)}</li>`;
  }).join('');
}

// Tarjeta que se abre al tocar una barra: la leyenda de esa barra sola, sin tener que
// bajar hasta el final ni descifrar color y relleno. La muestra de «Mide» va en el color
// de la gravedad de la barra, como en el diagrama. Al final, las fuentes de esa barra con
// su enlace (solo aquí, a demanda: debajo de cada fila llenarían el diagrama; decisión del
// usuario, 2026-10). '' si el id no existe.
export function infoBarraHTML(datos, id, REF = null) {
  const r = buscarFila(datos, id);
  if (!r || !tieneBarra(r.fila)) return '';
  const { fila: f, madre, gravedad } = r;
  const m = (datos.medidas || {})[f.mide] || {};
  const rango = rangoTexto(f, datos.columnas);
  const plazo = rango.charAt(0).toUpperCase() + rango.slice(1);
  return (madre ? `<div class="tej-info-madre">${esc(madre.nombre)}</div>` : '')
    + `<div class="tej-info-nombre">${esc(f.nombre)}</div>`
    + '<dl class="tej-info-datos">'
    + `<div><dt>Gravedad</dt><dd><span class="tej-ley-muestra tej-${esc(gravedad)}" aria-hidden="true"></span>${esc(datos.gravedades[gravedad] || gravedad)}</dd></div>`
    + (m.etiqueta ? `<div><dt>Mide</dt><dd><span class="tej-ley-muestra tej-${esc(gravedad)}${m.relleno ? ` tej-relleno-${esc(m.relleno)}` : ''}" aria-hidden="true"></span>${esc(m.etiqueta)}</dd></div>` : '')
    + `<div><dt>Plazo</dt><dd>${esc(plazo)}</dd></div>`
    + (f.fuentes?.length ? `<div class="tej-info-fuentes"><dt>Fuentes</dt><dd><ul class="tej-fuentes-lista">${fuentesTejidoHTML(f.fuentes, REF)}</ul></dd></div>` : '')
    + '</dl>';
}

// Grupos que se ven con un filtro: 'todos' (o uno que no existe) = todos.
export function gruposVisibles(grupos, filtro) {
  return grupos.some(g => g.id === filtro) ? grupos.filter(g => g.id === filtro) : grupos;
}

// Filtro «Este paciente» (Fase J): las filas y subtipos de las hipótesis activas, según
// `datos.porHipotesis` y el contexto. Una entrada objeto solo vale si encaja con todas sus
// condiciones: `posq` (boolean, mecanismo Post-quirúrgico o no), `mecanismo` y `cronologia`
// (el texto de la fase 1). `soloFila: true` enseña la fila sin sus subtipos (si ninguna otra
// entrada la pide entera). → { ids, hipotesis, sinFilas, soloFila } (ids sin repetir, en el
// orden de las hipótesis; hipotesis = las que aportan alguna fila; sinFilas = las demás).
export const FILTRO_PACIENTE = 'paciente';
export function encajaEntrada(e, { posquirurgico = false, mecanismo = '', cronologia = '' } = {}) {
  if (typeof e === 'string') return true;
  if (e.posq !== undefined && e.posq !== posquirurgico) return false;
  if (e.mecanismo !== undefined && e.mecanismo !== mecanismo) return false;
  if (e.cronologia !== undefined && e.cronologia !== cronologia) return false;
  return true;
}
export function filasPaciente(datos, hipIds = [], contexto = {}) {
  const ids = [], hipotesis = [], sinFilas = [], enteras = new Set(), soloFila = new Set();
  for (const h of hipIds) {
    const propias = (datos.porHipotesis?.[h] || [])
      .filter(e => encajaEntrada(e, contexto))
      .filter(e => buscarFila(datos, typeof e === 'string' ? e : e.id));
    if (!propias.length) { sinFilas.push(h); continue; }
    hipotesis.push(h);
    for (const e of propias) {
      const id = typeof e === 'string' ? e : e.id;
      if (!ids.includes(id)) ids.push(id);
      (e.soloFila ? soloFila : enteras).add(id);
    }
  }
  return { ids, hipotesis, sinFilas, soloFila: [...soloFila].filter(id => !enteras.has(id)) };
}

// Los grupos recortados a las filas del paciente: una fila entra si es suya (con todos
// sus subtipos, o sin ninguno si está en `soloFila`) o si lo es alguno de sus subtipos
// (solo esos). Grupos sin ninguna, fuera.
function gruposPaciente(grupos, ids, soloFila = []) {
  return grupos.map(g => ({
    ...g,
    filas: g.filas.flatMap(f => {
      if (ids.includes(f.id)) return [soloFila.includes(f.id) ? { ...f, subtipos: [] } : f];
      const st = (f.subtipos || []).filter(x => ids.includes(x.id));
      return st.length ? [{ ...f, subtipos: st }] : [];
    }),
  })).filter(g => g.filas.length);
}

// `posquirurgico`: si el mecanismo es Post-quirúrgico (para el texto de ayuda);
// `filtro`: id de un grupo de tejido, o 'todos'. Las pastillas del filtro y los
// títulos de grupo llevan `data-filtro-tejido` (el filtro que ponen al tocarlos:
// el suyo, o 'todos' si ya era el activo); abrirTiemposTejido() (app.js)
// vuelve a pintar con el filtro elegido. `REF`: el registro de referencias, si ya
// está cargado (enlaces de las fuentes de las notas de grupo).
// `paciente`: { ids, nombres, sinPlazo, soloFila } de filasPaciente() (nombres y sinPlazo =
// nombres de las hipótesis con y sin filas), o null: con ids, una primera pastilla «Este
// paciente» (FILTRO_PACIENTE) que muestra solo esas filas, con los subtipos desplegados, y
// una línea que dice de qué hipótesis salen; las que no tienen fila se nombran aparte, y si
// ninguna la tiene, una línea lo dice (para que no parezca que el filtro ha fallado).
export function tiemposTejidoHTML(datos, { semanas = null, posquirurgico = false, filtro = 'todos', REF = null, paciente = null } = {}) {
  const { columnas, gravedades, medidas = {}, grupos, fases, fasesNota, notas, fuente, fasesFuente } = datos;
  const n = columnas.length;
  const hoy = posquirurgico ? marcaHoy(semanas, columnas) : null;
  const pendienteChip = '<span class="tej-pendiente">pendiente de fuente</span>';
  const conPaciente = paciente?.ids?.length > 0;
  const activo = (conPaciente && filtro === FILTRO_PACIENTE) || grupos.some(g => g.id === filtro) ? filtro : 'todos';
  const soloPaciente = activo === FILTRO_PACIENTE;
  const claseFase = f => `tej-fase-${esc(f.id)}${f.tejido ? ' tej-fase-parcial' : ''}`;

  // Sin pastilla «Todos»: volver a tocar la activa la desmarca y se ven todos
  // (la misma regla que el resto de grupos de opciones de la app). Una sola fila
  // que se desliza en horizontal si no caben (decisión del usuario, 2026-10).
  const pastilla = (id, texto, clase = '') =>
    `<button type="button" class="tej-filtro-btn${clase}${id === activo ? ' activo' : ''}" data-grupo="${esc(id)}" data-filtro-tejido="${esc(id === activo ? 'todos' : id)}" aria-pressed="${id === activo}"${id === activo ? ` title="Ver todos los tejidos"` : ''}>${esc(texto)}</button>`;
  const filtroHTML = `<div class="tej-filtro" role="group" aria-label="Filtrar por tejido">`
    + (conPaciente ? pastilla(FILTRO_PACIENTE, 'Este paciente', ' tej-filtro-paciente') : '')
    + grupos.map(g => pastilla(g.id, g.tejido)).join('')
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

  const ctx = { columnas, hoy, pendienteChip, medidas };
  const sinPlazo = paciente?.sinPlazo || [];
  const lineaPaciente = soloPaciente
    ? `<p class="tej-paciente">Según ${paciente.nombres.length === 1 ? 'la hipótesis activa' : 'las hipótesis activas'}: ${paciente.nombres.map(esc).join(' · ')}.`
      + (sinPlazo.length ? ` Sin plazo propio en este panel: ${sinPlazo.map(esc).join(' · ')}.` : '')
      + ' Vuelve a tocar «Este paciente» para ver todos los tejidos.</p>'
    : !conPaciente && sinPlazo.length
      ? `<p class="tej-paciente">${sinPlazo.length === 1 ? 'La hipótesis activa no tiene' : 'Las hipótesis activas no tienen'} plazo propio en este panel: ${sinPlazo.map(esc).join(' · ')}.</p>`
      : '';
  const visibles = soloPaciente ? gruposPaciente(grupos, paciente.ids, paciente.soloFila) : gruposVisibles(grupos, activo);
  const cuerpo = visibles.map(g => `<div class="tej-bloque" data-grupo="${esc(g.id)}">`
    // El título del grupo también filtra (o vuelve a «Todos» si ya es el filtrado)
    + `<button type="button" class="tej-grupo" data-grupo="${esc(g.id)}" data-filtro-tejido="${esc(activo === g.id ? 'todos' : g.id)}" title="${esc(activo === g.id ? 'Ver todos los tejidos' : `Ver solo ${g.tejido.toLowerCase()}`)}">${esc(g.tejido)}</button>`
    // Lo que no cabe en una barra (p. ej. la axonotmesis, que depende de la distancia)
    + (g.nota ? `<p class="tej-grupo-nota">${esc(g.nota)}</p>` : '')
    // Sus fuentes, plegadas como las de una barra (a demanda); `data-claves` deja que
    // app.js ponga los enlaces si el registro llega después de pintar
    + (g.nota && g.notaFuentes?.length
      ? `<details class="tej-grupo-fuentes"><summary>Fuentes (${g.notaFuentes.length})</summary>`
        + `<ul class="tej-fuentes-lista" data-claves="${esc(g.notaFuentes.join('|'))}">${fuentesTejidoHTML(g.notaFuentes, REF)}</ul></details>`
      : '')
    + g.filas.map(f => filaHTML(f, ctx)
      + (f.subtipos?.length
        ? `<details class="tej-subtipos"${soloPaciente ? ' open' : ''}><summary>Ver ${f.subtipos.length} ${f.subtipos.length === 1 ? 'subtipo' : 'subtipos'}</summary>`
          + f.subtipos.map(st => filaHTML(st, { ...ctx, gravedad: st.gravedad || f.gravedad, clase: ' tej-subfila' })).join('')
          + '</details>'
        : '')).join('')
    + '</div>').join('');

  const leyenda = `<div class="tej-leyenda"><span class="tej-ley-titulo">Color = gravedad:</span>`
    + Object.entries(gravedades).map(([k, v]) => `<span class="tej-ley"><span class="tej-ley-muestra tej-${esc(k)}"></span>${esc(v)}</span>`).join('')
    + `</div>`
    // Qué mide la barra: una muestra por relleno, en color neutro, y el título dice que en el
    // diagrama va en el color de la gravedad (la muestra gris confundía, 2026-10). Cada medida
    // tiene su relleno; `marca` (etiqueta tras el nombre) queda solo si una medida no lo tuviera.
    + (Object.keys(medidas).length
      ? `<div class="tej-leyenda tej-leyenda-mide"><span class="tej-ley-titulo">Relleno = qué mide la barra (en el color de su gravedad):</span>`
        + Object.entries(medidas).filter(([, m]) => !m.marca).map(([k, m]) => `<span class="tej-ley"><span class="tej-ley-muestra tej-ley-mide tej-relleno-${esc(m.relleno)}" data-mide="${esc(k)}"></span>${esc(m.etiqueta)}</span>`).join('')
        + Object.entries(medidas).filter(([, m]) => m.marca).map(([k, m]) => `<span class="tej-ley"><span class="tej-marca" data-mide="${esc(k)}">${esc(m.marca)}</span>${esc(m.etiqueta)}</span>`).join('')
        + '</div>'
      : '')
    + `<p class="tej-fases-texto">Las fases de reparación son orientativas y se solapan.${fasesNota ? ` ${esc(fasesNota)}` : ''}</p>`;

  const ayudaHoy = hoy
    ? `<p class="tej-hoy-texto"><span class="tej-hoy-muestra"></span>${esc(hoy.texto)}. Semanas de la tarjeta «Cirugía» (fase 1).</p>`
    : posquirurgico
      ? '<p class="tej-ayuda">Con la fecha de la cirugía (o las semanas aproximadas) en la tarjeta «Cirugía», se marca dónde está el paciente.</p>'
      : '<p class="tej-ayuda">Con mecanismo Post-quirúrgico y la fecha de la cirugía, se marca dónde está el paciente.</p>';

  return `${filtroHTML}${lineaPaciente}<div class="tej-diagrama">${eje}${franja}${cuerpo}</div>${leyenda}${ayudaHoy}`
    + `<ul class="tej-notas">${notas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
    + [fuente, fasesFuente].filter(Boolean).map(t => `<p class="tej-fuente">${esc(t)}</p>`).join('');
}
