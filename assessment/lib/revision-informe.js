// ============================================================
// PhysiQ-Assessment · lib/revision-informe.js
// Revisión automática del informe narrativo con IA: compara el texto
// generado con los datos de la valoración y devuelve «puntos a revisar» para
// el fisioterapeuta. Funciones puras: sin DOM, sin red, sin IA. Las usa la
// tarjeta (informe-ia.js, al generar o restaurar un informe) y la herramienta
// tools/revisar-informe.mjs (el mismo código, desde la terminal).
//
// Solo señala; nunca corrige ni bloquea. Cada regla busca un fallo concreto
// visto en las revisiones del prompt (ver la cabecera de
// lib/informe-narrativo.js): son comprobaciones de texto, así que pueden dar
// algún falso positivo — por eso son «puntos a revisar», no una nota.
// ============================================================
import { CODIGOS_CIF, PLANTILLAS, contextoValoracion, limpiarEtiqueta } from './informe-narrativo.js';

// nivel: 'alto' = seguridad o un dato que contradice la valoración;
//        'medio' = una regla del informe que no se ha cumplido.
const punto = (id, nivel, mensaje, cita = '') => ({ id, nivel, mensaje, ...(cita ? { cita } : {}) });

const sinAcentos = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Frase del informe que contiene la posición i (para citarla)
export function fraseEn(texto, i) {
  if (i < 0) return '';
  const ini = Math.max(texto.lastIndexOf('.', i), texto.lastIndexOf('\n', i)) + 1;
  const finPunto = texto.indexOf('.', i);
  const finLinea = texto.indexOf('\n', i);
  const fin = [finPunto >= 0 ? finPunto + 1 : texto.length, finLinea >= 0 ? finLinea : texto.length].reduce((a, b) => Math.min(a, b));
  const f = texto.slice(ini, fin).replace(/^[#\s]+/, '').trim();
  return f.length > 220 ? f.slice(0, 217) + '…' : f;
}

const primera = (texto, re) => {
  const m = re.exec(texto);
  return m ? { m, cita: fraseEn(texto, m.index) } : null;
};

// Intensidades «N/10», «N sobre 10» o «A-B/10» de un texto, normalizadas a
// «N» o «A-B». Un rango (la irritabilidad «Media (4-6/10)») solo valida el
// mismo rango, no cada uno de sus extremos como intensidad suelta.
const RE_SOBRE10 = /(\d{1,2})\s*(?:[-–]\s*(\d{1,2})\s*)?(?:\/|sobre)\s*10\b/g;
const notaDe = m => (m[2] ? `${Number(m[1])}-${Number(m[2])}` : String(Number(m[1])));
const notasSobre10 = t => [...String(t || '').matchAll(RE_SOBRE10)].map(notaDe);
// En la transcripción se dice «un ocho de diez» (Whisper: «un 8 de 10»): también
// valen «de 10» y los números en letra.
const NUMEROS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
const RE_HABLADO = new RegExp(`\\b(\\d{1,2}|${NUMEROS.join('|')})\\s+(?:de|sobre)\\s+(?:10|diez)\\b`, 'gi');
const notasHabladas = t => [...sinAcentos(String(t || '')).matchAll(RE_HABLADO)]
  .map(m => (/^\d/.test(m[1]) ? String(Number(m[1])) : String(NUMEROS.indexOf(m[1].toLowerCase()))));
// …y la respuesta suelta a la pregunta: «¿Cuánto te duele de 0 a 10? Ahora un
// 4. El domingo… llegó a un 7» (Daniel: el 7 salía como intensidad inventada).
// Solo «un/una N» en los ~250 caracteres que siguen a la pregunta.
const RE_PREGUNTA_10 = /\b(?:0|cero) a (?:10|diez)\b/g;
const RE_UN_N = new RegExp(`\\b(?:un|una)\\s+(\\d{1,2}|${NUMEROS.join('|')})\\b`, 'gi');
const notasTrasPregunta = t => {
  const n = sinAcentos(String(t || ''));
  const out = [];
  for (const p of n.matchAll(RE_PREGUNTA_10)) {
    for (const m of n.slice(p.index + p[0].length, p.index + p[0].length + 250).matchAll(RE_UN_N)) {
      const v = /^\d/.test(m[1]) ? Number(m[1]) : NUMEROS.indexOf(m[1].toLowerCase());
      if (v >= 0 && v <= 10) out.push(String(v));
    }
  }
  return out;
};

// Síntomas que el paciente puede negar antes de la consulta y describir en ella
// (regla «discrepancia-separada»): grupos de sinónimos, sobre texto sin acentos.
const SINTOMAS = [
  ['Hormigueo', /hormigue|parestesi|adormec|acorchad|entumec|piel dormida|se (?:le|me) duerme|mano dormida/],
  ['Dolor nocturno', /noche|nocturn|despiert|despertar/],
  ['Sedestación', /sedestaci|\bsentad[oa]s?\b/],
];
const NEGACION = /\b(niega|no refiere|no presenta|no describe|no nota|no manifiesta|no aparece|no le|no hay|sin)\b/;
const frases = t => t.split(/(?<=[.!?])\s+|\n+/).map(f => f.replace(/^[#\s]+/, '').trim()).filter(Boolean);
// Síntomas que el modelo puede sacar de un ejemplo del prompt: [nombre, raíz
// en el texto sin acentos]. Solo cuenta si la raíz no aparece en los datos ni
// en la transcripción (Lucía sí dijo «¿te despierta por la noche?»).
const INVENTABLES = [
  ['despertares nocturnos', /despert|despiert/],
];
// Títulos de la plantilla narrativa, en orden, sacados del propio prompt (así
// no hay una segunda lista que mantener)
let _titulos = null;
const titulosNarrativo = () => (_titulos ??= PLANTILLAS.narrativo
  .prompt({ p: '', r: '', d: '', h: [{ name: 'H' }], br: [], sq: [], pn: {} }, { conAudio: false, nombreRegion: r => r, ampliado: null })
  .split('ESTRUCTURA OBLIGATORIA')[1].split('\n')
  .filter(l => /^#{2,3} /.test(l)).map(l => l.replace(/^#+\s*/, '').trim()));
const RE_DIAGNOSTICOS = /\b(hemorragi\w*|aneurism\w*|intracraneal\w*|ictus|meningitis|tumor\w*|neoplasi\w*|neoplasic\w*|cancer\w*|metasta\w*|diseccion\w*|trombosis|infarto)\b/g;
// Palabras de «para descartar X» que no nombran nada concreto
const GENERICAS_DESCARTAR = new Set(['patologia', 'patologias', 'causas', 'origen', 'lesiones', 'afectacion', 'condiciones', 'condicion', 'alteracion', 'alteraciones', 'compromiso', 'presencia', 'posible', 'posibles', 'estructural', 'estructurales', 'procesos', 'proceso', 'problemas', 'subyacente', 'persistente', 'relevante', 'relevantes', 'grave', 'graves', 'otras', 'otros']);
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Regla «fuentes»: nombrar de dónde sale un dato
const RE_FUENTES = /\b(transcripci[oó]n|grabaci[oó]n|dictado|formulario|recorrido de la exploraci[oó]n|conversaci[oó]n cl[ií]nica|en la conversaci[oó]n|no se (?:menciona|confirma|recoge|refiere) en (?:la )?(?:consulta|conversaci[oó]n)|en (?:la )?consulta (?:refiere|menciona|comenta|describe|indica|afirma)|inicialmente referid[oa]|PhysiQ|datos estructurados|datos recibidos|[aá]rbol de decisi[oó]n|notas del plan|variable de control|ventana de recuperaci[oó]n|anclaje de h[aá]bito)\b/gi;
// Regla «atribucion»: hallazgos atribuidos a la evolución de la cirugía o la lesión
const RE_ATRIBUCION = /evoluci[oó]n (?:esperable|natural|habitual|previsible)|esperable (?:en|tras|para) (?:el|la|un|una)\b|propi[oa]s? del (?:per[ií]odo|postoperatorio|proceso)|(?:compatible|coherente)s? con el (?:contexto|per[ií]odo|escenario|momento) (?:posquir|postquir|postoperat)/i;
// Regla «frecuencia»: actividades (raíz sobre texto sin acentos) y las
// expresiones de frecuencia que el modelo añade a una actividad nombrada.
const ACTIVIDADES = [
  ['la carrera', /\bcorr(?:e|er|o|iendo|edor\w*)\b|\bcarrera|\brunning\b|\bfooting\b/],
  ['el ciclismo', /\bbici\w*|\bciclis\w*/],
  ['el gimnasio', /\bgimnasio|\bpesas\b|\bmusculacion/],
  ['la natación', /\bnad(?:a|ar|o)\b|\bnatacion|\bpiscina/],
  ['caminar', /\bcamin(?:a|ar|o|atas?)\b|\bsenderis\w*|\bpase(?:a|ar|o|os)\b/],
  ['el deporte de raqueta', /\bpadel\b|\btenis\b/],
  ['el fútbol', /\bfutbol\w*/],
];
const RE_FRECUENCIA = /\b(?:con regularidad|regularmente|habitualmente|de (?:forma|manera|modo) (?:regular|habitual)|(?:actividad|practica|ejercicio|deporte|entrenamiento)\w*(?: (?:fisica|deportiva|fisico))? (?:regular|habitual)(?:es)?)\b/;
// En los datos o en la consulta: una frecuencia dicha para la actividad
const RE_FRECUENCIA_FUENTE = /a menudo|habitual|regular|frecuen|todos los dias|cada (?:dia|semana|manana|tarde|fin de semana|lunes|martes|miercoles|jueves|viernes|sabado|domingo)|\d+ (?:veces|dias) (?:a|por|en) la semana|veces (?:a|por) (?:la )?semana|los (?:lunes|martes|miercoles|jueves|viernes|sabados|domingos)|siempre/;
export function frecuenciaInferida(texto, fuente) {
  // Por líneas y frases, sin cortar en «?»: la pregunta va con su respuesta
  // («¿hace a menudo…? → Correr»; «¿Sales en bici? Sí, cada domingo.»)
  const lineasFuente = sinAcentos(fuente).split(/\n|(?<=[.!])\s+/);
  for (const f of frases(texto)) {
    const fn = sinAcentos(f);
    if (!RE_FRECUENCIA.test(fn)) continue;
    for (const [actividad, re] of ACTIVIDADES) {
      if (!re.test(fn)) continue;
      if (lineasFuente.some(l => re.test(l) && RE_FRECUENCIA_FUENTE.test(l))) continue;
      return { actividad, cita: f.length > 220 ? f.slice(0, 217) + '…' : f };
    }
  }
  return null;
}

// Palabras distintivas del nombre de una hipótesis (para ver si se nombra)
const VACIAS = new Set(['sindrome', 'lesion', 'dolor', 'tendinopatia', 'rotura', 'del', 'de', 'la', 'las', 'los', 'con', 'por', 'y', 'o', 'en', 'test']);
const clavesHipotesis = nombre => sinAcentos(limpiarEtiqueta(nombre)).replace(/[()]/g, ' ')
  .split(/[^a-z0-9ñ]+/).filter(w => w.length >= 4 && !VACIAS.has(w));

// texto: el informe (markdown). datos: buildPhysiQPayload(). ampliado:
// construirAmpliado(). plantilla: 'narrativo' | 'breve'. transcripcion: la del
// audio, si la hubo (lo que el paciente dijo en consulta también es fuente).
// → [{ id, nivel, mensaje, cita? }], primero los de nivel alto.
export function revisarInforme(texto, { datos = {}, ampliado = null, plantilla = 'narrativo', transcripcion = '', nombreRegion = r => r } = {}) {
  const t = String(texto || '');
  const tn = sinAcentos(t);
  const fuente = contextoValoracion(datos, nombreRegion, ampliado) + '\n' + (transcripcion || '');
  const fuenteN = sinAcentos(fuente);
  const out = [];
  let r;

  // ── Seguridad: derivaciones que deben constar ──
  if (datos.ur?.length && !/deriv|urgenc|112/.test(tn))
    out.push(punto('derivacion-urgente', 'alto', 'Hay una derivación urgente en la valoración y el informe no la menciona.'));
  if (datos.dv?.length && !/deriv|valoracion medica/.test(tn))
    out.push(punto('derivacion-medica', 'alto', 'La valoración pide una derivación médica y el informe no la menciona.'));
  const derivar = (ampliado?.pautas || []).filter(p => p.derivar && !p.tratada);
  if (derivar.length && !/deriv/.test(tn))
    out.push(punto('derivar-hipotesis', 'alto', `La pauta de ${derivar.map(p => `«${limpiarEtiqueta(p.hipotesis)}»`).join(', ')} es derivar y el informe no habla de derivación.`));

  // ── Datos personales que contradicen la valoración o no constan ──
  const la = datos.la || '';
  const lados = { Derecho: 'izquierd', Izquierdo: 'derech' };
  if (lados[la] && (r = primera(t, new RegExp(lados[la] === 'izquierd' ? 'izquierd[oa]s?' : 'derech[oa]s?', 'i')))) {
    // Si el paciente habló del otro lado en la consulta, mencionarlo puede ser
    // correcto: se avisa igual, pero como algo a comprobar, no como contradicción.
    if (new RegExp(lados[la]).test(sinAcentos(transcripcion)))
      out.push(punto('lado-otro', 'medio', 'En la consulta se habla del otro lado: comprueba que el informe no cambie el lado afectado ni le añada plan.', r.cita));
    else out.push(punto('lado', 'alto', `El lado registrado es ${la.toLowerCase()} y el informe habla del otro lado.`, r.cita));
  }
  else if (!la && (r = primera(t, /\b(derech|izquierd)[oa]s?\b/i)) && !/derech|izquierd/.test(sinAcentos(transcripcion)))
    out.push(punto('lado-no-consta', 'medio', 'El informe indica un lado que no consta en la valoración.', r.cita));

  const edad = ampliado?.edad;
  for (const m of t.matchAll(/\b(?:de|con)\s+(\d{1,3})\s+años\b/gi)) {
    const n = Number(m[1]);
    if (n < 10 || n > 110) continue;
    if (edad == null) {
      if (!new RegExp(`\\b${n}\\s+años`).test(transcripcion)) out.push(punto('edad-no-consta', 'medio', 'El informe da una edad que no consta en la valoración.', fraseEn(t, m.index)));
    } else if (n !== Number(edad)) {
      out.push(punto('edad', 'alto', `La edad registrada es ${edad} años y el informe dice ${n}.`, fraseEn(t, m.index)));
    }
    break;
  }

  const sexo = ampliado?.sexo || '';
  const reMujer = /\b(mujer|paciente femenina|sexo femenino)\b/i, reHombre = /\b(var[oó]n|hombre|paciente masculino|sexo masculino)\b/i;
  if (sexo === 'Mujer' && (r = primera(t, reHombre))) out.push(punto('sexo', 'alto', 'El sexo registrado es mujer y el informe dice otra cosa.', r.cita));
  else if (sexo === 'Hombre' && (r = primera(t, reMujer))) out.push(punto('sexo', 'alto', 'El sexo registrado es hombre y el informe dice otra cosa.', r.cita));
  else if (!sexo && (r = primera(t, new RegExp(`${reMujer.source}|${reHombre.source}`, 'i'))) && !/mujer|hombre|varon/.test(sinAcentos(transcripcion)))
    out.push(punto('sexo-no-consta', 'medio', 'El informe indica el sexo y no consta en la valoración.', r.cita));
  // Sin sexo registrado, el género tampoco se marca (dedujo «sentada», «la
  // paciente» del nombre). Lista corta y segura: «operado» o «intervenida»
  // pueden ser de un familiar o de la fractura.
  if (!sexo && (r = primera(t, /\b(?:la|el|al|del) paciente\b|\b(?:sentad|tumbad|acostad|quiet|cansad|preocupad)[oa]s?\b/i)))
    out.push(punto('genero', 'medio', 'El sexo no consta y el informe marca el género; redacta sin marcarlo.', r.cita));

  // Intensidades «N/10» que no aparecen en ningún dato
  const validas = new Set([...notasSobre10(fuente), ...notasHabladas(transcripcion), ...notasTrasPregunta(transcripcion)]);
  for (const m of t.matchAll(RE_SOBRE10)) {
    if (!validas.has(notaDe(m))) {
      out.push(punto('nrs', 'alto', `El informe da una intensidad (${m[0].trim()}) que no figura en la valoración${datos.nr != null ? ` (NRS ${datos.nr}/10)` : ''}.`, fraseEn(t, m.index)));
      break;
    }
  }

  // «No sé» del formulario convertido en negación: en el `fp` del payload la
  // respuesta llega como «Fila: No sé» o «No sabría decir»; si su palabra
  // clave sale en el informe en una frase negativa («no refiere…tiroides»),
  // se ha convertido en un negativo que el paciente no dijo.
  for (const { q, a } of datos.fp || []) {
    const partes = String(a).includes(' · ') || /:\s/.test(String(a))
      ? String(a).split(' · ').map(x => x.split(/:\s(?=[^:]*$)/)).filter(([, v]) => /^(No sé|No sabría decir)$/.test((v || '').trim())).map(([k]) => k)
      : /^(No sé|No sabría decir)$/.test(String(a).trim()) ? [q] : [];
    for (const etiqueta of partes) {
      const clave = sinAcentos(etiqueta).split(/[^a-z0-9ñ]+/).filter(w => w.length >= 6 && !VACIAS.has(w)).sort((x, y) => y.length - x.length)[0];
      if (!clave) continue;
      const i = tn.indexOf(clave);
      if (i < 0) continue;
      const frase = fraseEn(t, i);
      if (/\b(no|niega|sin|ni)\b/i.test(frase)) {
        out.push(punto('no-se', 'medio', `El paciente respondió «No sé» sobre «${etiqueta.trim()}» y el informe lo da como negativo.`, frase));
        break;
      }
    }
  }

  // ── Identificación: la añade la app fuera del texto ──
  const nombre = String(datos.p || '').trim();
  if (nombre && (r = primera(t, new RegExp(nombre.split(/\s+/).filter(w => w.length >= 3).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') || '(?!)'))))
    out.push(punto('nombre', 'medio', 'El nombre del paciente aparece en el texto (ya va en la cabecera).', r.cita));
  if (datos.d && t.includes(datos.d)) out.push(punto('fecha', 'medio', 'La fecha aparece en el texto (ya va en la cabecera).', fraseEn(t, t.indexOf(datos.d))));

  // ── Reglas de redacción ──
  if ((r = primera(t, /\bLR\s*[+−-]?|cociente(s)? de probabilidad|likelihood|\d+\s*\/\s*\d+\s+hallazgos|peso (alto|bajo|moderado)\b|puntuaci[oó]n del test/i)))
    out.push(punto('jerga', 'medio', 'Usa jerga de puntuación (LR, pesos, recuentos) que no va en el informe.', r.cita));
  // «para descartar X» con una X que no consta en ningún sitio (Daniel: «ecografía
  // para descartar bursitis…»; la bursitis no estaba en los datos). Se miran las
  // palabras de contenido hasta « o », la coma o el punto; los diagnósticos
  // graves ya los cubre la regla «diagnostico».
  const frasesInventadas = new Set();
  for (const m of tn.matchAll(/\bpara descartar\s+([^.,;]{3,120})/g)) {
    const objeto = m[1].split(/\s+o\s+|\s+u\s+/)[0];
    const nuevas = objeto.split(/[^a-z0-9ñ]+/)
      .filter(w => w.length >= 6 && !GENERICAS_DESCARTAR.has(w) && !new RegExp(RE_DIAGNOSTICOS.source).test(w))
      .filter(w => !fuenteN.includes(w.slice(0, 6)));
    if (nuevas.length) {
      const frase = fraseEn(t, m.index);
      frasesInventadas.add(frase);
      out.push(punto('descartar-inventado', 'medio', `Dice que algo se busca «descartar» (${nuevas.join(', ')}) y no consta en la valoración ni en la consulta.`, frase));
      break;
    }
  }
  for (const m of t.matchAll(/\bdescart(?:a|an|ar|ado|ada|ados|adas|ando|e|en)\b/gi)) {
    if (frasesInventadas.has(fraseEn(t, m.index))) continue;   // ya lo dice «descartar-inventado»
    const antes = t.slice(Math.max(0, m.index - 12), m.index).toLowerCase();
    if (/\bno (la|lo|las|los|se)?\s*$/.test(antes)) continue;     // «no la descarta» es correcto
    if (/deriv|valoraci[oó]n m[eé]dica|urgencias/i.test(t.slice(t.lastIndexOf('.', m.index) + 1, m.index))) continue;   // «se deriva / requiere valoración médica… para descartar» es correcto
    out.push(punto('descarta', 'medio', 'Dice que algo se «descarta»: un resultado negativo «no muestra hallazgos que sugieran…».', fraseEn(t, m.index)));
    break;
  }
  // «confirma la hipótesis»: los tests apoyan, no confirman. No cuentan «pendiente
  // de confirmar» (modo breve) ni «confirmar con el cirujano» (posquirúrgico).
  for (const m of t.matchAll(/\bconfirm(?:a|an|ado|ada|ados|adas|ar|aría|arían)\b/gi)) {
    const antes = t.slice(Math.max(0, m.index - 30), m.index).toLowerCase();
    const frase = fraseEn(t, m.index);
    if (/pendientes? de\s*$|por\s*$|sin\s*$|\bno (?:se |la |lo )?\s*$/.test(antes) || /cirujano/i.test(frase)) continue;
    // Lo confirmado es la hipótesis o el diagnóstico (antes o justo después), no un síntoma
    const cerca = t.slice(Math.max(0, m.index - 60), m.index + 70);
    if (!/hip[oó]tesis|diagn[oó]stic|s[ií]ndrome|patolog[ií]a|lesi[oó]n|tendinopat|rotura/i.test(cerca)) continue;
    out.push(punto('confirma', 'medio', 'Dice que la exploración o los tests «confirman»: apoyan o son compatibles con una hipótesis.', frase));
    break;
  }
  // La edad una sola vez (en Factores Personales)
  if (ampliado?.edad != null) {
    const veces = [...t.matchAll(new RegExp(`\\b${Number(ampliado.edad)}\\s+años\\b`, 'g'))];
    if (veces.length > 1) out.push(punto('repetido', 'medio', `La edad (${ampliado.edad} años) aparece ${veces.length} veces; va una sola vez, en Factores Personales.`, fraseEn(t, veces[1].index)));
  }
  // El criterio de reconsiderar o derivar por falta de mejoría, solo en Seguimiento
  const iSeg = t.search(/SEGUIMIENTO FUNCIONAL/i);
  if (plantilla === 'narrativo' && iSeg > 0) {
    // «en caso de ausencia de mejoría», «si no mejora» (no «la ausencia de mejoría con
    // movimientos repetidos», un hallazgo: Andrea) (Daniel, dictado: «En caso de ausencia de mejoría… se solicitará valoración ecográfica»)
    const m = /reconsider|(?:si|cuando)\b[^.]{0,60}\bno (?:se )?(?:observa|objetiva|produce|hay|alcanza)?\s*(?:una )?mejor[ií]a|(?:en caso de|ante(?: la)?|si hay)\s+(?:una\s+)?(?:ausencia|falta) de mejor[ií]a|\b(?:si|en caso de)\s+no\s+(?:mejora|mejorar|mejorase)\b/i.exec(t.slice(0, iSeg));
    if (m) out.push(punto('seguimiento-fuera', 'medio', 'El criterio de reconsiderar o derivar si no mejora aparece fuera de Seguimiento.', fraseEn(t, m.index)));
  }
  // Lo que no le empeora no va en Limitaciones (Andrea: «Niega dolor al toser…»;
  // Daniel: «No refiere limitación al ponerse los zapatos…»)
  const iLim = tn.search(/limitaciones en (?:las )?actividades/);
  if (plantilla === 'narrativo' && iLim >= 0) {
    const finLim = tn.slice(iLim + 10).search(/restricciones en (?:la )?participacion|conclusiones y plan|\n#{1,3} /);
    const lim = t.slice(iLim, finLim >= 0 ? iLim + 10 + finLim : undefined);
    const m = /\b(?:no refiere (?:limitaci[oó]n|dificultad|dolor|aumento|molestias?)|niega (?:dolor|limitaci[oó]n|dificultad|molestias?)|no (?:le )?(?:provoca|aumenta|empeora)n?|sin (?:dolor|dificultad|limitaci[oó]n) (?:al|para))\b/i.exec(lim);
    if (m) out.push(punto('limitaciones-negativas', 'medio', 'Limitaciones enumera lo que no le empeora; ahí solo van las actividades que le cuestan.', fraseEn(t, iLim + m.index)));
  }
  if ((r = primera(t, /no se dispone de|no se realiz[oó]|no se realizaron|no se (?:midi[oó]|evalu[oó]|explor[oó])|no evaluad[oa]|\bdesconoce\b|no sabr[ií]a decir|\bno sé\b|no se refieren? tratamientos|no constan? tratamientos|sin tratamientos previos/i)))
    out.push(punto('relleno', 'medio', 'Menciona algo que no se hizo o que el paciente no sabía; lo que no consta no se menciona.', r.cita));
  // En modo breve, «el formulario previo» dentro de la frase de lo pendiente
  // es un pendiente, no una fuente: se sigue buscando
  r = null;
  for (const m of t.matchAll(RE_FUENTES)) {
    if (datos.md === 'breve' && /formulario/i.test(m[0]) && /pendiente/i.test(t.slice(t.lastIndexOf('.', m.index) + 1, m.index))) continue;
    r = { m, cita: fraseEn(t, m.index) };
    break;
  }
  if (r)
    out.push(punto('fuentes', 'medio', 'Nombra de dónde sale un dato (formulario, transcripción, PhysiQ…).', r.cita));
  // «el cuestionario inicial» sí; «el cuestionario QuickDASH» (una escala con nombre) no
  else if ((r = primera(t, /\bcuestionario\b(?!\s+(?:de\s+|del\s+)?[A-ZÁÉÍÓÚ])/)))
    out.push(punto('fuentes', 'medio', 'Nombra de dónde sale un dato (formulario, transcripción, PhysiQ…).', r.cita));
  if ((r = primera(t, /\bsecuela|fase de (consolidaci[oó]n|reparaci[oó]n|cicatrizaci[oó]n|remodelaci[oó]n|inflamaci[oó]n|proliferaci[oó]n)/i)) && !/secuela|fase de/.test(fuenteN))
    out.push(punto('fisiopatologia', 'medio', 'Atribuye los hallazgos a secuelas o fases de curación que no están en los datos.', r.cita));
  // Hallazgos atribuidos a la evolución de la cirugía o de la lesión (Pedro:
  // «coherente con la evolución esperable en el período posquirúrgico»). No
  // cuenta el «contexto traumático»: eso sí puede venir del recorrido.
  if ((r = primera(t, RE_ATRIBUCION)))
    out.push(punto('atribucion', 'medio', 'Atribuye los hallazgos a la evolución esperable de la cirugía o de la lesión; describe lo encontrado.', r.cita));
  // Frecuencia inferida: solo consta que hace una actividad y el informe dice
  // que la hace «con regularidad» o «de forma habitual» (Pedro: «Practica
  // ciclismo de manera habitual», cuando echa de menos la bici; Javier: «Acude
  // al gimnasio con regularidad», por unas pesas un sábado). Vale si los datos
  // o la consulta dan una frecuencia para esa misma actividad (Lucía: «¿hace a
  // menudo…? → Correr»).
  if ((r = frecuenciaInferida(t, fuente))) out.push(punto('frecuencia', 'medio', `Dice que ${r.actividad} es algo que hace con regularidad o de forma habitual, y no consta con qué frecuencia; describe solo lo que refiere.`, r.cita));
  // Una discrepancia escrita en dos frases como si no chocaran (Pedro: «Niega…
  // parestesias» y «Describe episodios de parestesia»; Lucía: «No refiere dolor
  // en sedestación» y «la sedestación… aumentaría el dolor»). Las dos versiones
  // en la misma frase («no le despierta…, aunque también describe
  // despertares») es lo correcto y no cuenta.
  for (const [nombre, re] of SINTOMAS) {
    let neg = null, afi = null;
    for (const f of frases(t)) {
      const fn = sinAcentos(f);
      const m = re.exec(fn);
      if (!m) continue;
      const c = /\b(aunque|pero|si bien|sin embargo)\b/.exec(fn.slice(m.index));
      if (c && re.test(fn.slice(m.index + c.index))) continue;
      if (NEGACION.test(fn.slice(0, m.index))) neg ??= f; else afi ??= f;
    }
    if (neg && afi) {
      out.push(punto('discrepancia-separada', 'medio', `${nombre}: lo niega en una frase y lo describe en otra. Si las dos versiones son del paciente, van juntas en una sola frase neutra.`, neg.length > 220 ? neg.slice(0, 217) + '…' : neg));
      break;
    }
  }
  // «Pendiente de confirmar con el cirujano», una sola vez (lo dijo cuatro)
  const confirmaCir = [...t.matchAll(/confirm\w*[^.]{0,40}cirujano/gi)];
  if (confirmaCir.length >= 3)
    out.push(punto('repetido', 'medio', `Lo pendiente de confirmar con el cirujano aparece ${confirmaCir.length} veces; va una sola vez, al principio del plan.`, fraseEn(t, confirmaCir[1].index)));
  // La fecha de la cirugía, una sola vez
  const fe = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(datos.cq?.fe || '');
  if (fe) {
    const dia = Number(fe[1]), mes = Number(fe[2]);
    const reFe = new RegExp(`\\b0?${dia}(?:\\s+de\\s+${MESES[mes - 1]}|\\/0?${mes}\\/)`, 'gi');
    const veces = [...t.matchAll(reFe)];
    if (veces.length > 1) out.push(punto('repetido', 'medio', `La fecha de la cirugía aparece ${veces.length} veces; va una sola vez.`, fraseEn(t, veces[1].index)));
  }

  // Síntomas que no constan en ningún sitio: el modelo copió el ejemplo de
  // discrepancias del prompt («despertares ocasionales al girarse en la cama»)
  // en un paciente que no habló de la noche más que para el dolor al tumbarse.
  for (const [nombre, re] of INVENTABLES) {
    if ((r = primera(tn, re)) && !re.test(fuenteN)) {
      out.push(punto('inventado', 'alto', `Habla de ${nombre} y no consta en la valoración ni en la consulta (¿copiado de un ejemplo?).`, fraseEn(t, r.m.index)));
      break;
    }
  }
  // Secciones y subsecciones en el orden de la plantilla (movió Intervención
  // Quirúrgica y Cribado de Seguridad a la primera sección)
  if (plantilla === 'narrativo') {
    const lineas = t.split('\n').map(l => sinAcentos(l.replace(/^#+\s*/, '').trim()));
    let prev = -1;
    const fuera = [];
    for (const h of titulosNarrativo()) {
      const i = lineas.indexOf(sinAcentos(h));
      if (i < 0) continue;
      if (i < prev) fuera.push(`«${h}»`); else prev = i;
    }
    if (fuera.length)
      out.push(punto('estructura', 'medio', `Fuera del orden de la plantilla: ${fuera.join(', ')}. Cada subsección va dentro de su sección.`));
  }

  // Con derivación urgente, el plan es la derivación: nada de tratamiento en
  // CONCLUSIONES Y PLAN (escribió un plan con mmHg y segundos «una vez descartado…»)
  if (datos.ur?.length) {
    const ini = tn.search(/conclusiones y plan|objetivos y plan/);
    const fin = tn.search(/coherencia con hipotesis|seguimiento funcional/);
    const plan = ini >= 0 ? t.slice(ini, fin > ini ? fin : undefined) : '';
    const m = /\b(manipulaci[oó]n|movilizaci[oó]n|biofeedback|mmHg|series|repeticiones|ejercicio terap[eé]utico|programa de ejercicio|terapia manual)/i.exec(plan);
    if (m) out.push(punto('plan-urgente', 'alto', 'Hay una derivación urgente y el plan propone tratamiento; el plan es la derivación.', fraseEn(t, ini + m.index)));
  }
  // Diagnósticos graves que no están ni en los datos ni en la consulta
  // («hemorragia subaracnoidea», «patología intracraneal»)
  const dx = [...tn.matchAll(RE_DIAGNOSTICOS)].filter(m => !fuenteN.includes(m[1].slice(0, 7)));
  if (dx.length) {
    const nombres = [...new Set(dx.map(m => t.slice(m.index, m.index + m[1].length).toLowerCase()))];
    out.push(punto('diagnostico', 'medio', `Nombra diagnósticos que no están en los datos: ${nombres.map(n => `«${n}»`).join(', ')}.`, fraseEn(t, dx[0].index)));
  }
  // El IMC clasificado, y mal («normopeso» con 25,2)
  const imc = Number(datos.an?.imc);
  if (imc && (r = primera(tn, /\b(normopeso|peso normal|sobrepeso|obesidad)\b/))) {
    const cat = imc < 18.5 ? 'bajo' : imc < 25 ? 'normo' : imc < 30 ? 'sobre' : 'obes';
    const dice = /sobrepeso/.test(r.m[1]) ? 'sobre' : /obesidad/.test(r.m[1]) ? 'obes' : 'normo';
    if (cat !== dice) out.push(punto('imc', 'medio', `Clasifica el IMC (${imc.toFixed(1).replace('.', ',')}) como «${r.m[1]}», que no le corresponde; las cifras van sin clasificar.`, fraseEn(t, r.m.index)));
  }

  // Constantes clasificadas («signos vitales dentro de parámetros habituales» con
  // solo una FC de 58, Daniel): las cifras van tal cual, sin clasificar
  if ((r = primera(tn, /\b(?:dentro de (?:los )?(?:parametros|limites|rangos?|valores) (?:normales|habituales|de normalidad|fisiologicos)|(?:signos vitales|constantes(?: vitales)?) (?:normales|estables|sin alteraciones)|normotens\w*|normocardic\w*|eupneic\w*)/)))
    out.push(punto('constantes', 'medio', 'Clasifica las constantes («dentro de parámetros habituales», «normotenso»…); las cifras van sin clasificar.', fraseEn(t, r.m.index)));
  // Prueba de imagen con un motivo que nadie dio («ecografía… para valorar la
  // presencia de líquido…», Daniel, dictado; el motivo venía del pronóstico).
  // Cuenta si la transcripción o los datos no ligan la imagen a ese motivo.
  for (const m of tn.matchAll(/\b(ecograf\w*|resonancia|radiograf\w*|\brx\b|\brm\b|tac|prueba de imagen|estudio de imagen)\b[^.]{0,120}?\bpara (descartar|valorar|estudiar|evaluar|objetivar|confirmar|comprobar|detectar|identificar|buscar)\b/g)) {
    const frase = fraseEn(t, m.index);
    if (frasesInventadas.has(frase)) continue;   // ya lo dice «descartar-inventado»
    const fuenteImagen = sinAcentos(`${transcripcion || ''}`).toLowerCase();
    const raiz = m[1].slice(0, 5);
    // El fisio lo dio: «ecografía para ver…» en la consulta o el dictado
    if (new RegExp(`${raiz}\\w*[^.]{0,80}\\bpara\\b`).test(fuenteImagen)) continue;
    out.push(punto('imagen-motivo', 'medio', 'Añade para qué es la prueba de imagen; recógela solo como la indicó el fisioterapeuta.', frase));
    break;
  }

  // ── Códigos CIF ──
  const codigos = [...t.matchAll(/\b([bdes]\d{3,5})\b/g)];
  if (plantilla === 'breve') {
    const validos = new Set(CODIGOS_CIF.map(([c]) => c));
    const malos = [...new Set(codigos.map(m => m[1]).filter(c => !validos.has(c)))];
    if (malos.length) out.push(punto('cif', 'medio', `Códigos CIF fuera de la lista permitida: ${malos.join(', ')}.`, fraseEn(t, codigos.find(m => malos.includes(m[1])).index)));
  } else if (codigos.length) {
    out.push(punto('cif', 'medio', 'El informe narrativo no lleva códigos CIF.', fraseEn(t, codigos[0].index)));
  }

  // ── Contenido que debería estar ──
  const sinNombrar = (datos.h || []).filter(h => !h.dt && !h.pq).filter(h => {
    const claves = clavesHipotesis(h.name);
    return claves.length && !claves.some(w => tn.includes(w));
  });
  if (sinNombrar.length)
    out.push(punto('hipotesis', 'medio', `No se nombra la hipótesis ${sinNombrar.map(h => `«${limpiarEtiqueta(h.name)}»`).join(', ')}.`));
  if (datos.md === 'breve' && !/breve|pendiente/.test(tn))
    out.push(punto('breve', 'medio', 'Es una valoración breve y el informe no lo dice ni indica lo pendiente.'));

  const limite = PLANTILLAS[plantilla]?.palabras;
  const palabras = (t.replace(/[#|*-]/g, ' ').match(/\S+/g) || []).length;
  if (limite && palabras > limite * 1.3)
    out.push(punto('longitud', 'medio', `Tiene unas ${palabras} palabras; el objetivo es ${limite}.`));

  return out.sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === 'alto' ? -1 : 1));
}

// «Antes de compartir, comprueba»: los fallos graves que ninguna regla de
// texto ve y que el verificador con IA (capa 3, aparcada) sí detectaba en
// todas las pasadas. Lista fija para el clínico, sin red ni coste; el punto
// de los tests con «o» solo sale si se hizo alguno, y los nombra.
// `formularioYAudio`: hay formulario previo y el informe se hizo con audio; lo
// que el paciente dice en uno y otro puede diferir y el informe tiende a dar
// solo una versión (Daniel, dos veces: el chasquido doloroso en el formulario).
export function comprobacionesManuales({ ampliado = null, formularioYAudio = false } = {}) {
  const conO = [...new Set((ampliado?.tests || []).flatMap(g => g.items || [])
    .map(i => i.test).filter(n => / o /i.test(n || '')))];
  return [
    'Cada indicación del plan se atribuye a quien la dio (fisioterapeuta, cirujano, médico), y un consejo no aparece como algo que el paciente ya hace.',
    ...(conO.length ? [`Los tests con alternativas en el nombre se describen con esas mismas palabras, sin afirmar las dos: ${conO.map(n => `«${n}»`).join(', ')}.`] : []),
    'No hay plan, seguimiento ni prevención para otra zona o el otro lado que nadie indicó.',
    ...(formularioYAudio ? ['Si lo que el paciente dijo en consulta difiere del formulario previo (un síntoma, una cifra de dolor), el informe da las dos versiones.'] : []),
  ];
}

// Texto compartido/copiado → texto del informe: fuera la cabecera local
// (textoParaCompartir) y el pie «redacción asistida por IA».
export function quitarCabeceraYPie(texto) {
  return String(texto || '').split('\n')
    .filter(l => !/^\s*(INFORME DE FISIOTERAPIA|Paciente:|Edad:|Sexo:|Fecha:|Región valorada:|—\s*$|Informe generado con PhysiQ)/.test(l))
    .join('\n').trim();
}

// Para la herramienta y los tests: notas «N/10» de un texto
export { notasSobre10 };

// Patrones de algunas reglas, para que la medición de la capa 3
// (lib/verificacion-informe.js) reconozca un punto que la capa 1 ya cubre
// aunque cite otra frase. Sin la bandera g (se usan con .test).
const sinG = re => new RegExp(re.source, re.flags.replace('g', ''));
export const PATRONES_CAPA1 = {
  atribucion: RE_ATRIBUCION,
  fuentes: sinG(RE_FUENTES),
  diagnostico: sinG(RE_DIAGNOSTICOS),   // sobre texto sin acentos
  frecuencia: RE_FRECUENCIA,            // sobre texto sin acentos
  sintomas: SINTOMAS,                   // [nombre, patrón] sobre texto sin acentos
  negacion: NEGACION,                   // sobre texto sin acentos
};
export { sinAcentos };
