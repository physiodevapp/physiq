// ============================================================
// PhysiQ-Assessment · lib/citas.js
// Citas bibliográficas: una sola forma de mostrarlas en toda la app
// ============================================================
//
// Regla (decisión del usuario, 2026-10): en el texto que se lee de corrido
// (pie de un «¿Por qué?», fuente de un test, de una pauta, del pronóstico, del
// plan, de un cuestionario) cada cita va en su forma corta («George 2021»),
// como un botón; al tocarlo, una ficha flotante (ficha.js) da la cita entera y
// «Abrir ↗» con la `url` o el DOI del registro (data/referencias.js), o dice
// que no tiene enlace. Las secciones «Fuentes» del panel «Ampliar» y de la
// tarjeta de Tiempos de tejido siguen con la lista entera y enlazada: ahí leer
// las fuentes es el objetivo. Lo que se comparte (📋 Notas, 📄 Informe, plan,
// prompt de la IA) no pasa por aquí: sigue en texto plano.
//
// Las citas dentro de una frase («… (Maitland 2005, cap. 9, p. 213)») siguen
// como texto: se pasarán a este formato región por región.
//
// Funciones puras salvo registroReferencias(), que carga el registro con
// import() la primera vez (ni el arranque ni el hub lo descargan si no hace
// falta).

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let _registro = null;
export function registroReferencias() {
  if (!_registro) _registro = import('../data/referencias.js').then(m => m.REFERENCIAS).catch(() => ({}));
  return _registro;
}

// Clave del registro con la que empieza una cita («Hegedus 2012 (Br J…)» →
// 'Hegedus 2012'; «Lluch 2020, cap. 3.1 (Struyf)» → 'Lluch 2020'): la más
// larga, para no confundir 'Malik 2023' con 'Malik y Herron 2023'.
export function claveRegistro(cita, REF) {
  let mejor = null;
  for (const k of Object.keys(REF)) {
    if (cita.startsWith(k) && !/^[\p{L}\d]/u.test(cita.slice(k.length)) && (!mejor || k.length > mejor.length)) mejor = k;
  }
  return mejor;
}

// Enlace de una entrada del registro: su `url` o, sin ella, su DOI.
export function urlRegistro(r) {
  return r?.url || (r?.doi ? `https://doi.org/${r.doi}` : null);
}

// Una cita como { texto, url } si el registro le da enlace; si no, el texto.
export function enlaceCita(cita, REF) {
  if (typeof cita !== 'string') return cita;
  const url = urlRegistro(REF[claveRegistro(cita, REF)]);
  return url ? { texto: cita, url } : cita;
}

// Un trozo que empieza como una referencia: «Autor 2005», «Autor y Autor 2005»,
// o una guía NICE («NICE NG59», «NICE CG147»), que no lleva año en la clave.
const EMPIEZA_REFERENCIA = /^(\p{Lu}[^,(;:]*\b(19|20)\d{2}\b|NICE (NG|CG)\d+\b)/u;
export const esReferencia = c => EMPIEZA_REFERENCIA.test(String(c).trim());
// Dentro de una frase, además, la referencia tiene que acabar ahí o seguir con
// «, », « (» o «: » (capítulo, páginas…): «(Petersen 2021 incluye las banderas
// amarillas…)» es una frase, no una cita, y se queda como texto.
const CITA_SUELTA = /^(\p{Lu}[^,(;:]*\b(19|20)\d{2}|NICE (NG|CG)\d+)(?=$|, | \(|: )/u;

// Una fuente → sus citas. Separa por « · » (el separador de toda la app) y por
// «; » solo cuando lo que sigue empieza otra referencia («Maitland 2005, cap.
// 9; Hengeveld y Banks 2005, cap. 9»; no «cap. 8, p. 203; cap. 9, p. 218»),
// nunca dentro de paréntesis. Acepta también una lista ya partida.
export function partirCitas(fuente) {
  if (Array.isArray(fuente)) return fuente.flatMap(partirCitas);
  if (!fuente) return [];
  const s = String(fuente);
  const out = [];
  let prof = 0, actual = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '[') prof++;
    else if ((ch === ')' || ch === ']') && prof > 0) prof--;
    if (prof === 0 && s.startsWith(' · ', i)) { out.push(actual); actual = ''; i += 2; continue; }
    if (prof === 0 && s.startsWith('; ', i) && EMPIEZA_REFERENCIA.test(s.slice(i + 2))) { out.push(actual); actual = ''; i += 1; continue; }
    actual += ch;
  }
  out.push(actual);
  return out.map(c => c.trim()).filter(Boolean);
}

// Forma corta de una cita: hasta la primera «, », « (», «; » o «: »
// («George 2021, J Orthop…» → «George 2021»; «NICE NG59 (rec. 1.2.6)» →
// «NICE NG59»), y como mucho MAX_ETIQUETA caracteres.
export const MAX_ETIQUETA = 40;
export function etiquetaCita(cita) {
  const s = String(cita).trim();
  const corte = [', ', ' (', '; ', ': '].map(x => s.indexOf(x)).filter(i => i > 0);
  const corta = corte.length ? s.slice(0, Math.min(...corte)) : s;
  return corta.length > MAX_ETIQUETA ? `${corta.slice(0, MAX_ETIQUETA - 1).trimEnd()}…` : corta;
}

// Botón de una cita: se ve la forma corta; el resto de la cita va en un <span>
// oculto (.cita-resto), así el texto del botón sigue siendo la cita entera para
// quien lo lea con textContent (pruebas, «Ampliar con IA»), y al imprimir se ve.
// La cita entera va además en data-cita (la ficha la lee; al imprimir, si la forma
// corta no es el principio de la cita, se imprime data-cita).
function citaBotonHTML(c) {
  const corta = etiquetaCita(c);
  const prefijo = c.startsWith(corta);
  const resto = prefijo && c.length > corta.length ? `<span class="cita-resto">${esc(c.slice(corta.length))}</span>` : '';
  return `<button type="button" class="cita${prefijo ? '' : ' cita-abreviada'}" data-cita="${esc(c)}" aria-expanded="false"><span class="cita-corta">${esc(corta)}</span>${resto}</button>`;
}

// Botones de las citas de una fuente, separados por « · ».
export function citasHTML(fuente) {
  return partirCitas(fuente).map(citaBotonHTML).join('<span class="cita-sep" aria-hidden="true"> · </span>');
}

const desescapar = s => s.replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[e]));

// Citas dentro de una frase («… la mitad si duele mucho (Maitland 2005, cap. 9,
// pp. 213, 216 y 219).»): en cada paréntesis de primer nivel, cada cita que
// empieza como una referencia y sigue como una cita (CITA_SUELTA) pasa a botón; lo demás del
// paréntesis («acuerdo del 71 %, kappa 0,39–0,44; Barakatt 2009») y sus
// separadores se quedan como están. Recibe HTML ya escapado (o de confianza, de
// data/) y devuelve HTML; un paréntesis con etiquetas dentro no se toca. Solo
// cambia lo que se ve: los textos de data/ y lo que se comparte siguen enteros.
export function citasEnTexto(html) {
  if (html == null) return '';
  const s = String(html);
  if (!s.includes('(')) return s;
  let out = '', prof = 0, ini = -1, desde = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') { if (prof === 0) ini = i; prof++; }
    else if (s[i] === ')' && prof > 0 && --prof === 0) {
      const dentro = s.slice(ini + 1, i);
      if (/[<>]/.test(dentro)) continue;
      const nuevo = citasEnGrupo(dentro);
      if (nuevo === dentro) continue;
      // El botón es una caja en línea: sin pegarlos, «(» o «).» podrían quedarse
      // solos al principio o al final de una línea
      const punt = /[.,;:]/.test(s[i + 1] || '') ? s[i + 1] : '';
      out += s.slice(desde, ini) + pegarParentesis(nuevo, punt);
      desde = i + 1 + punt.length;
    }
  }
  return out + s.slice(desde);
}
function pegarParentesis(g, punt) {
  const FIN = '</button>';
  let ini = '(', fin = `)${punt}`, medio = g;
  if (medio.startsWith('<button')) {
    const e = medio.indexOf(FIN) + FIN.length;
    ini = `<span class="cita-pegada">(${medio.slice(0, e)}`;
    medio = medio.slice(e);
    if (!medio) return `${ini}${fin}</span>`;
    ini += '</span>';
  }
  if (medio.endsWith(FIN)) {
    const e = medio.lastIndexOf('<button');
    fin = `<span class="cita-pegada">${medio.slice(e)}${fin}</span>`;
    medio = medio.slice(0, e);
  }
  return ini + medio + fin;
}
function citasEnGrupo(g) {
  let out = '', pos = 0, cambia = false;
  for (const parte of partirCitas(g)) {
    const idx = g.indexOf(parte, pos);
    if (idx < 0) return g;
    out += g.slice(pos, idx);
    if (CITA_SUELTA.test(parte)) { out += citaBotonHTML(desescapar(parte)); cambia = true; } else out += parte;
    pos = idx + parte.length;
  }
  return cambia ? out + g.slice(pos) : g;
}

// Contenido de la ficha de una cita: el texto entero; del registro, el título
// y, si la cita no la lleva ya, la publicación; y «Abrir ↗» o, si el registro
// no le da url ni DOI, «Sin enlace». `REF` null = registro aún cargando: solo
// el texto (la ficha se repinta al llegar); {} = no cargó: «Sin enlace».
export function fichaCitaHTML(cita, REF = null) {
  const texto = `<div class="cita-ficha-texto">${esc(cita)}</div>`;
  if (!REF) return texto;
  const r = REF[claveRegistro(cita, REF)];
  const url = urlRegistro(r);
  const pub = r?.publicacion && !cita.includes(r.publicacion) ? r.publicacion : '';
  return texto
    + (r?.titulo ? `<div class="cita-ficha-titulo">${esc(r.titulo)}</div>` : '')
    + (pub ? `<div class="cita-ficha-pub">${esc(pub)}</div>` : '')
    + (url
      ? `<a class="cita-ficha-enlace" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Abrir ↗</a>`
      : '<div class="cita-ficha-sin">Sin enlace</div>');
}
