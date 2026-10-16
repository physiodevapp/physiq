// ============================================================
// PhysiQ-Assessment · lib/cuestionarios.js
// Calculadora de cuestionarios (📊 de la cabecera): funciones puras
// ============================================================
//
// El paciente rellena el cuestionario en papel; el fisio toca en la app el
// valor de cada ítem y la app suma, aplica las reglas del cuestionario
// (ítems invertidos, ponderados, subescalas) y da la interpretación publicada
// cuando la hay. Las definiciones están en data/cuestionarios.js; aquí, el
// motor y el HTML, sin DOM ni estado global: abrirCuestionarios() (app.js) le
// pasa las respuestas. Los ítems se muestran con una etiqueta corta, no con el
// texto literal: la hoja en papel es la del paciente. Diseño y fuentes:
// docs/cuestionarios.md.
//
// Respuestas de un cuestionario: { [n]: valor }, según el tipo del ítem:
//   escala   → número (min..max); con `invertir`, puntúa max + min − valor
//   opciones → índice de la opción elegida; puntúa opciones[i].v
//   sino     → 'si' | 'no'; «sí» puntúa `peso` (1 por defecto)
//   marcas   → [índices marcados]; puntúa marcas × `porMarca`, hasta `max`
//   numero   → número tecleado (min..max, con decimales si `paso` < 1), p. ej.
//              los mm o cm de una escala visual analógica (iHOT-12, ASES);
//              con `invertir`, max + min − valor
// Total 'mediaSubescalas': media de las subescalas (SPADI).
// Cualquier ítem con `na: true` admite «no aplicable» (NA); con `factor`, su
// puntuación se multiplica (PRTEE: función ÷ 2).

import { citasHTML } from './citas.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Coma decimal, sin decimales sobrantes
export function numeroTexto(x) {
  if (x == null || !Number.isFinite(x)) return '—';
  return (Math.round(x * 10) / 10).toString().replace('.', ',');
}

// Rango del ítem: el suyo o el del cuestionario
function rangoItem(def, item) {
  return { min: item.min ?? def.escala?.min ?? 0, max: item.max ?? def.escala?.max ?? 10 };
}

// «No aplicable» (ítems con `na: true`, p. ej. FAAM, HOS): cuenta como
// contestado, pero no entra en el cálculo.
export const NA = 'na';

// Puntuación de un ítem (ya multiplicada por su `factor`), NA, o null si no
// está contestado
export function valorItem(def, item, r) {
  if (item.na && r === NA) return NA;
  const tipo = item.tipo || 'escala';
  const f = item.factor ?? 1;
  if (tipo === 'escala' || tipo === 'numero') {
    if (typeof r !== 'number' || !Number.isFinite(r)) return null;
    const { min, max } = rangoItem(def, item);
    if (r < min || r > max) return null;
    return (item.invertir ? max + min - r : r) * f;
  }
  if (tipo === 'opciones') {
    const op = Number.isInteger(r) ? item.opciones[r] : undefined;
    return op ? op.v * f : null;
  }
  if (tipo === 'sino') {
    if (r === 'si') return item.peso ?? 1;
    if (r === 'no') return 0;
    return null;
  }
  if (tipo === 'marcas') {
    if (!Array.isArray(r) || !r.length) return null;
    return Math.min(r.length * (item.porMarca ?? 1), item.max ?? Infinity);
  }
  return null;
}

// Mínimo y máximo posibles de un ítem (con su `factor`)
function extremosItem(def, item) {
  const tipo = item.tipo || 'escala';
  const f = item.factor ?? 1;
  if (tipo === 'escala' || tipo === 'numero') { const { min, max } = rangoItem(def, item); return [min * f, max * f]; }
  if (tipo === 'opciones') { const v = item.opciones.map(o => o.v * f); return [Math.min(...v), Math.max(...v)]; }
  if (tipo === 'sino') return [0, item.peso ?? 1];
  if (tipo === 'marcas') return [item.porMarca ?? 1, item.max ?? (item.opciones.length * (item.porMarca ?? 1))];
  return [0, 0];
}

// Cómo se calcula una puntuación (total o subescala):
//   suma | media | porcentaje — (suma − mínimo) / (máximo − mínimo) × 100 de
//   los ítems contestados (los «no aplicable» no cuentan); con `invertir100`,
//   100 − eso (KOOS: 100 = sin problemas). Con todos los ítems «no aplicable», null.
function calcular(def, nums, valores, { calculo = 'suma', invertir100 = false } = {}) {
  const items = def.items.filter(it => nums.includes(it.n) && typeof valores[it.n] === 'number');
  if (!items.length) return null;
  const suma = items.reduce((a, it) => a + valores[it.n], 0);
  if (calculo === 'media') return suma / items.length;
  if (calculo === 'porcentaje') {
    const ext = items.map(it => extremosItem(def, it));
    const lo = ext.reduce((a, [x]) => a + x, 0), hi = ext.reduce((a, [, x]) => a + x, 0);
    const pct = hi > lo ? (suma - lo) / (hi - lo) * 100 : 0;
    return invertir100 ? 100 - pct : pct;
  }
  return suma;
}

// Rango [min, max] de una puntuación (total o subescala)
export function rangoPuntuacion(def, nums, calculo = 'suma') {
  if (calculo === 'porcentaje') return [0, 100];
  const items = def.items.filter(it => nums.includes(it.n));
  const ext = items.map(it => extremosItem(def, it));
  const min = ext.reduce((a, [lo]) => a + lo, 0), max = ext.reduce((a, [, hi]) => a + hi, 0);
  return calculo === 'media' ? [min / items.length, max / items.length] : [min, max];
}

// La primera regla que se cumple; una regla sin `si` es la de por defecto
function interpretar(reglas, puntuaciones) {
  for (const regla of reglas || []) {
    const cond = regla.si;
    if (!cond) return regla;
    const x = puntuaciones[cond.de || 'total'];
    if (x == null) continue;
    if (cond.min != null && x < cond.min) continue;
    if (cond.max != null && x > cond.max) continue;
    return regla;
  }
  return null;
}

// Opciones de cálculo del total y de una subescala
const calculoTotal = def => ({ calculo: def.total || 'suma', invertir100: !!def.totalInvertir100 });
const calculoSub = s => ({ calculo: s.calculo || 'suma', invertir100: !!s.invertir100 });

// → { contestados, faltan: [n], completo, total, subescalas: [{ id, nombre, valor, rango, calculo, formato }],
//     interpretacion: { etiqueta, nivel } | null, alertas: [texto] }
// La puntuación y la interpretación solo con todos los ítems contestados
// («no aplicable» cuenta como contestado): la app no aplica reglas para ítems
// en blanco. Las alertas, en cambio, salen en cuanto se contesta el ítem: son
// de seguridad (p. ej., ítem 9 del PHQ-9).
export function puntuar(def, respuestas = {}) {
  const valores = {};
  for (const it of def.items) {
    const v = valorItem(def, it, respuestas[it.n]);
    if (v != null) valores[it.n] = v;
  }
  const faltan = def.items.filter(it => valores[it.n] == null).map(it => it.n);
  const completo = faltan.length === 0;
  const todos = def.items.map(it => it.n);
  const subescalas = (def.subescalas || []).map(s => {
    const llenos = s.items.every(n => valores[n] != null);
    return {
      id: s.id, nombre: s.nombre, calculo: s.calculo || 'suma', formato: s.formato,
      valor: llenos ? calcular(def, s.items, valores, calculoSub(s)) : null,
      rango: rangoPuntuacion(def, s.items, s.calculo || 'suma'),
    };
  });
  // Total: como se declare, o la media de las subescalas (SPADI, según su validación española)
  const total = !completo || def.total === null ? null
    : def.total === 'mediaSubescalas'
      ? (subescalas.every(x => x.valor != null) ? subescalas.reduce((a, x) => a + x.valor, 0) / subescalas.length : null)
      : calcular(def, todos, valores, calculoTotal(def));
  const puntuaciones = { total };
  subescalas.forEach(s => { puntuaciones[s.id] = s.valor; });
  const regla = completo ? interpretar(def.interpretacion, puntuaciones) : null;
  const alertas = (def.alertas || [])
    .filter(a => { const v = valores[a.item]; return typeof v === 'number' && v >= (a.min ?? 1); })
    .map(a => a.texto);
  return {
    contestados: def.items.length - faltan.length, faltan, completo, total, subescalas,
    interpretacion: regla ? { etiqueta: regla.etiqueta, nivel: regla.nivel || 'medio' } : null,
    alertas,
  };
}

// «12/27» · «media 7,2 (0–10)» · «42/100» · «38 %» (formato 'pct')
function valorTexto(x, calculo, rango, formato) {
  if (calculo === 'media') return `media ${numeroTexto(x)} (${numeroTexto(rango[0])}–${numeroTexto(rango[1])})`;
  if (calculo === 'porcentaje') return formato === 'pct' ? `${numeroTexto(x)} %` : `${numeroTexto(x)}/100`;
  return `${numeroTexto(x)}/${numeroTexto(rango[1])}`;
}
export function totalTexto(def, p) {
  if (p.total == null) return null;
  const calculo = def.total === 'mediaSubescalas' ? 'porcentaje' : def.total || 'suma';
  return valorTexto(p.total, calculo, def.rango || rangoPuntuacion(def, def.items.map(it => it.n), calculo), def.formato);
}
function subescalaTexto(s) {
  if (s.valor == null) return null;
  return `${s.nombre}: ${valorTexto(s.valor, s.calculo, s.rango, s.formato)}`;
}

// Una línea para 📋 Notas y el payload: «PHQ-9: 12/27 — depresión moderada»
// (o «incompleto, 7 de 9 ítems»), con las subescalas y las alertas.
export function resumenCuestionario(def, respuestas) {
  const p = puntuar(def, respuestas);
  if (!p.contestados) return null;
  const partes = [];
  if (p.completo) {
    const t = totalTexto(def, p);
    if (t) partes.push(t);
    const subs = p.subescalas
      .filter(s => s.valor != null && !def.subescalasOcultas)
      .map(subescalaTexto);
    if (subs.length) partes.push(subs.join(', '));
  }
  return {
    id: def.id,
    n: def.nombre,
    v: p.completo ? partes.join(' · ') : `incompleto, ${p.contestados} de ${def.items.length} ítems`,
    ...(p.interpretacion ? { i: p.interpretacion.etiqueta } : {}),
    ...(p.alertas.length ? { a: p.alertas } : {}),
    ...(p.completo ? {} : { inc: true }),
  };
}

// Todos los cuestionarios empezados, en el orden de data/cuestionarios.js
export function resumenCuestionarios(defs, estado = {}) {
  return defs.map(def => estado[def.id] ? resumenCuestionario(def, estado[def.id].r || {}) : null).filter(Boolean);
}

// Texto de una línea del resumen (📋 Notas, prompt)
export function lineaCuestionario(c) {
  return `${c.n}: ${c.v}${c.i ? ` — ${c.i}` : ''}${c.a?.length ? ` · ⚠️ ${c.a.join(' · ')}` : ''}`;
}

// ── Enlaces «Calcular» ────────────────────────────────────────────────────
// Los cuestionarios de la calculadora que nombra un texto de la app (la
// recomendación psicosocial de la fase 1, el badge del PROM de las fases 4b y
// 5), en el orden en que aparecen. Por siglas, como palabra entera: «KOOS» no
// casa con «KOOS-12», ni «PHQ-2» con «PHQ-29».
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function cuestionariosEnTexto(texto, defs) {
  const t = String(texto || '');
  const hallados = [];
  for (const d of defs) {
    for (const s of d.siglas || [d.nombre]) {
      const m = new RegExp(`(?<![\\p{L}\\p{N}-])${escRe(s)}(?![\\p{L}\\p{N}-])`, 'u').exec(t);
      if (m) { hallados.push({ id: d.id, pos: m.index }); break; }
    }
  }
  return hallados.sort((a, b) => a.pos - b.pos).map(h => h.id);
}

// Un botón por cuestionario: «Calcular PHQ-9», o lo que lleva hecho
// («PHQ-9 · 3 de 9», «PHQ-9 · 12/27 ✓»). Abre la calculadora en ese
// cuestionario (data-cuest-abrir). '' si el texto no nombra ninguno.
export function enlacesCalcularHTML(ids, defs, estado = {}) {
  const botones = ids.map(id => defs.find(d => d.id === id)).filter(Boolean).map(def => {
    const p = puntuar(def, estado[def.id]?.r || {});
    const txt = !p.contestados ? `Calcular ${def.nombre}`
      : !p.completo ? `${def.nombre} · ${p.contestados} de ${def.items.length}`
        : `${def.nombre} · ${totalTexto(def, p) || 'completo'} ✓`;
    return `<button type="button" class="cuest-calc-btn${p.completo ? ' cuest-calc-hecho' : ''}" data-cuest-abrir="${esc(def.id)}">${esc(txt)}</button>`;
  });
  return botones.length ? `<span class="cuest-calc" data-cuest-ids="${esc(ids.join(' '))}">${botones.join('')}</span>` : '';
}

// ── HTML ──────────────────────────────────────────────────────────────────

function estadoTexto(def, respuestas) {
  const p = puntuar(def, respuestas || {});
  if (!p.contestados) return { texto: 'Sin empezar', nivel: '' };
  if (!p.completo) return { texto: `${p.contestados} de ${def.items.length} ítems`, nivel: p.alertas.length ? 'alto' : '' };
  const t = totalTexto(def, p);
  return {
    texto: [t, p.interpretacion?.etiqueta].filter(Boolean).join(' · ') || 'Completo',
    nivel: p.alertas.length ? 'alto' : (p.interpretacion?.nivel || ''),
  };
}

// Lista de cuestionarios por grupo, con el estado de cada uno. Con una
// región elegida, sus grupos regionales van primero; el resto, en su orden.
export function listaCuestionariosHTML(defs, grupos, estado = {}, { region = '' } = {}) {
  const deRegion = g => !!region && (g.regiones || []).includes(region);
  const orden = [...grupos.filter(deRegion), ...grupos.filter(g => !deRegion(g))];
  return orden.map(g => {
    const delGrupo = defs.filter(d => d.grupo === g.id);
    if (!delGrupo.length) return '';
    return `<section class="cuest-grupo"><h3 class="cuest-grupo-titulo">${esc(g.nombre)}</h3>${delGrupo.map(def => {
      const e = estadoTexto(def, estado[def.id]?.r);
      return `<button type="button" class="cuest-tarjeta" data-cuest="${esc(def.id)}">`
        + `<span class="cuest-tarjeta-nombre">${esc(def.nombre)}</span>`
        + `<span class="cuest-tarjeta-titulo">${esc(def.titulo)}</span>`
        + `<span class="cuest-tarjeta-estado${e.nivel ? ` cuest-nivel-${e.nivel}` : ''}">${esc(e.texto)}</span>`
        + '</button>';
    }).join('')}</section>`;
  }).join('') + '<p class="cuest-pie">Para puntuar la hoja que ha rellenado el paciente: los ítems aparecen con una etiqueta corta, en el mismo orden que en el papel.</p>';
}

// Caja del resultado (arriba del formulario, se repinta con cada toque)
export function resultadoCuestionarioHTML(def, respuestas = {}) {
  const p = puntuar(def, respuestas);
  const alertas = p.alertas.map(a => `<div class="cuest-alerta" role="alert">⚠️ ${esc(a)}</div>`).join('');
  if (!p.completo) {
    const faltan = p.faltan.length;
    return `<div class="cuest-res-linea"><span class="cuest-res-total">${p.contestados}/${def.items.length}</span>`
      + `<span class="cuest-res-falta">${faltan === def.items.length ? 'Toca el valor de cada ítem' : `Falta${faltan === 1 ? '' : 'n'} ${faltan} ítem${faltan === 1 ? '' : 's'}: ${p.faltan.join(', ')}`}</span></div>${alertas}`;
  }
  const subs = p.subescalas.filter(s => s.valor != null)
    .map(s => `<li>${esc(subescalaTexto(s))}</li>`).join('');
  const interp = p.interpretacion
    ? `<span class="cuest-res-interp cuest-nivel-${p.interpretacion.nivel}">${esc(p.interpretacion.etiqueta)}</span>`
    : `<span class="cuest-res-interp">${esc(def.sinInterpretacion || 'Sin punto de corte publicado')}</span>`;
  return `<div class="cuest-res-linea"><span class="cuest-res-total">${esc(totalTexto(def, p) || 'Completo')}</span>${interp}</div>`
    + (subs ? `<ul class="cuest-res-subs">${subs}</ul>` : '') + alertas;
}

function botonesItem(def, item, r) {
  const tipo = item.tipo || 'escala';
  const boton = (valor, texto, activo, extra = '') =>
    `<button type="button" class="cuest-op${activo ? ' selected' : ''}" data-valor="${esc(valor)}" aria-pressed="${activo}"${extra}>${texto}</button>`;
  const na = item.na ? boton(NA, 'N/A', r === NA, ' title="No aplicable"') : '';
  if (tipo === 'escala') {
    const { min, max } = rangoItem(def, item);
    const ops = [];
    for (let v = min; v <= max; v++) ops.push(boton(v, v, r === v));
    if (na) ops.push(na);
    const n = max - min + 1 + (na ? 1 : 0);
    // Larga (0–10): en móvil, dos filas que llenan el ancho, como la EVA de la
    // fase 3 (0–4 arriba, 5–10 abajo); el salto solo se ve por debajo de 520 px
    if (n > 7) ops.splice(Math.floor(n / 2), 0, '<span class="cuest-salto" aria-hidden="true"></span>');
    return `<div class="cuest-ops cuest-ops-escala${n > 7 ? ' cuest-ops-largo' : ''}" style="--cuest-n:${n}">${ops.join('')}</div>`;
  }
  if (tipo === 'numero') {
    const { min, max } = rangoItem(def, item);
    return `<div class="cuest-ops cuest-ops-numero"><input type="number" class="cuest-num" inputmode="decimal" min="${min}" max="${max}" step="${item.paso ?? 1}" value="${typeof r === 'number' ? r : ''}" aria-label="${esc(item.t)} (${min}–${max})"><span class="cuest-num-rango">${min}–${max}${item.unidad ? ` ${esc(item.unidad)}` : ''}</span>${na}</div>`;
  }
  if (tipo === 'opciones') {
    // Una sola respuesta: en móvil, una opción por fila (las ordenadas se leen de arriba abajo, como en el papel)
    return `<div class="cuest-ops cuest-ops-texto cuest-ops-lista">${item.opciones.map((o, i) => boton(i, esc(o.t), r === i)).join('')}${na}</div>`;
  }
  if (tipo === 'sino') {
    return `<div class="cuest-ops cuest-ops-sino">${boton('si', 'Sí', r === 'si')}${boton('no', 'No', r === 'no')}</div>`;
  }
  if (tipo === 'marcas') {
    const marcadas = Array.isArray(r) ? r : [];
    // Marcar varias: en móvil, dos columnas y, si son impares, la última a todo el ancho
    return `<div class="cuest-ops cuest-ops-texto cuest-ops-marcas">${item.opciones.map((t, i) => boton(i, esc(t), marcadas.includes(i))).join('')}</div>`;
  }
  return '';
}

export function itemCuestionarioHTML(def, item, r) {
  const tipo = item.tipo || 'escala';
  const { min, max } = rangoItem(def, item);
  const anclas = (tipo === 'escala' || tipo === 'numero') && item.anclas
    ? `<div class="cuest-anclas"><span>${min} ${esc(item.anclas[0])}</span><span>${max} ${esc(item.anclas[1])}</span></div>` : '';
  const nota = [
    item.invertir ? 'puntúa al revés' : '',
    tipo === 'marcas' ? `marca todas las que señale${item.porMarca ? `; ${item.porMarca} puntos cada una${item.max ? `, máximo ${item.max}` : ''}` : ''}` : '',
  ].filter(Boolean).join(' · ');
  return `<div class="cuest-item" data-item="${item.n}">`
    + `<div class="cuest-item-txt"><span class="cuest-item-n">${esc(item.etiquetaN ?? item.n)}</span>${esc(item.t)}${nota ? ` <span class="cuest-item-nota">(${esc(nota)})</span>` : ''}</div>`
    + botonesItem(def, item, r) + anclas + '</div>';
}

// Formulario de un cuestionario: volver, cabecera, resultado y los ítems
export function formularioCuestionarioHTML(def, respuestas = {}) {
  const secciones = [];
  let actual = null;
  for (const it of def.items) {
    if (it.seccion && it.seccion !== actual) { actual = it.seccion; secciones.push(`<h4 class="cuest-seccion">${esc(it.seccion)}</h4>`); }
    secciones.push(itemCuestionarioHTML(def, it, respuestas[it.n]));
  }
  const algo = Object.keys(respuestas).length > 0;
  return '<button type="button" class="cuest-volver" data-cuest-volver>← Cuestionarios</button>'
    + `<div class="cuest-cab"><div class="cuest-cab-nombre">${esc(def.nombre)}</div><div class="cuest-cab-titulo">${esc(def.titulo)}</div>`
    + (def.instrucciones ? `<p class="cuest-instr">${esc(def.instrucciones)}</p>` : '')
    + (def.leyenda ? `<p class="cuest-leyenda">${esc(def.leyenda)}</p>` : '') + '</div>'
    + `<div class="cuest-resultado" id="cuestResultado" aria-live="polite">${resultadoCuestionarioHTML(def, respuestas)}</div>`
    + `<div class="cuest-items">${secciones.join('')}</div>`
    + '<div class="cuest-fuente">'
    + (def.interpretacionTexto ? `<p>${esc(def.interpretacionTexto)}</p>` : '')
    + `<p><span class="cuest-fuente-et">Fuente</span> ${citasHTML(def.fuente)}</p>`
    + (def.nota ? `<p class="cuest-nota">${esc(def.nota)}</p>` : '') + '</div>'
    + `<button type="button" class="cuest-borrar" data-cuest-borrar${algo ? '' : ' disabled'}>Borrar respuestas</button>`;
}
