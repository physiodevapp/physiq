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

// Un trozo que empieza como una referencia: «Autor 2005», «Autor y Autor 2005».
const EMPIEZA_REFERENCIA = /^\p{Lu}[^,(;:]*\b(19|20)\d{2}\b/u;

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

// Botones de las citas de una fuente, separados por « · ». La cita entera va en
// data-cita (la ficha la lee; al imprimir se imprime ella, no la forma corta).
export function citasHTML(fuente) {
  return partirCitas(fuente).map(c =>
    `<button type="button" class="cita" data-cita="${esc(c)}" aria-expanded="false"><span class="cita-corta">${esc(etiquetaCita(c))}</span></button>`,
  ).join('<span class="cita-sep" aria-hidden="true"> · </span>');
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
