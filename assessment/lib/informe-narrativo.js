// ============================================================
// PhysiQ-Assessment · lib/informe-narrativo.js
// Informe narrativo con IA (solo standalone): funciones puras — prompt,
// contexto clínico, lectura del stream SSE y paso de markdown a texto/HTML.
// Sin DOM ni estado: las usa informe-ia.js y las prueba tests/unit.js.
// ============================================================
//
// ⚠ COPIA ADAPTADA, no compartida. El prompt narrativo, el bloque de datos de
// la valoración y las pistas de Whisper vienen de physiq-report (copiados el
// 2026-10-05):
//   · buildNarrativePrompt  ← physiq-report/app.js, buildPrompt(), rama narrativa
//   · contextoValoracion    ← physiq-report/lib/payload.js, buildClinicalContext()
//   · contextoROM           ← physiq-report/lib/payload.js, buildROMContext()
//   · WHISPER_PROMPTS       ← physiq-report/app.js, WHISPER_PROMPTS / getWhisperPrompt()
// Ningún test puede vigilar los dos repos a la vez: si cambia la estructura del
// informe narrativo en report, revisar este archivo a mano.
//
// Diferencias deliberadas con report (ver CLAUDE.md → «Informe narrativo»):
//   · Aquí no hay cabecera de documento: la identificación la añade
//     textoParaCompartir() en local, así que la regla «no repitas los datos
//     identificativos» se mantiene, pero ya no dice que estén «en la cabecera».
//   · Sin bloques de otras apps (force, jump, balance, cinemática, cuestionarios,
//     documentos adjuntos): no existen en assessment standalone. ROM sí, si la
//     sesión trae `rom` de physiq-motion.
//   · Longitud fija (PALABRAS_INFORME), sin selector.
//   · El audio es opcional: instrucción explícita para cuando no hay transcripción.
//   · El bloque de datos incluye lo que buildClinicalContext() de report no
//     lee del payload y no puede faltar en un informe: derivaciones (ur, dv),
//     formulario previo (fp), signos vitales y modo breve.

export const ORCHESTRATOR_URL = 'https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev';
export const TURNSTILE_SITEKEY = '0x4AAAAAADU3dzE5Tw_whVks';   // la misma de physiq-report
export const LICENSE_KEY_STORAGE = 'physiq-license-key';        // la guarda el hub; compartida por origen

// Mismo par tokens/palabras que el paso 3 del selector de report (5000 → 2000).
export const MAX_TOKENS_INFORME = 5000;
export const PALABRAS_INFORME = 2000;
// Límite de la API de transcripción de OpenAI.
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

const WHISPER_PROMPTS = {
  hombro:   'Fisioterapia. Hombro. Síndrome subacromial, capsulitis adhesiva, SLAP, rotura manguito rotador, inestabilidad glenohumeral, artropatía acromioclavicular, discinesia escapular, primera costilla. Supraespinoso, infraespinoso, subescapular, redondo menor, labrum glenoideo, bursa subdeltoidea. Test de Neer, Hawkins-Kennedy, lata vacía, lata llena, aprehensión anterior, recolocación, surprise test, external rotation lag sign, drop arm, arco doloroso, aducción cruzada, O\'Brien, Speed, Yergason. SPADI, DASH, ASES. ROM glenohumeral, elevación, rotación interna, rotación externa.',
  cadera:   'Fisioterapia. Cadera. Artrosis, pinzamiento femoroacetabular, SIFA, desgarro labrum acetabular, tendinopatía glútea, síndrome piriforme, síndrome glúteo profundo, tendinopatía proximal isquiotibiales, pinzamiento isquiofemoral, dolor sacroilíaco, debilidad abductores. Trocánter mayor, acetábulo, fosa isquiática, nervio ciático, glúteo medio. FADDIR, FABER, test de Arlington, test de torsión, Trendelenburg, apoyo monopodal, sentadilla monopodal, step-down, compresión pélvica. HOOS, iHOT-12, LEFS.',
  cervical: 'Fisioterapia. Columna cervical. Radiculopatía cervical, mielopatía espondilótica, cefalea cervicogénica, disfunción articular cervical, WAD, latigazo cervical, disfunción postural cérvico-torácica, disfunción primera costilla, costo-vertebral. Nervio occipital mayor, arteria vertebral, disco intervertebral, uncovertebral. Test de Spurling, CFRT, flexión-rotación cervical, CCFT, biofeedback, ULNT1, PAIVM C0-C3, CROM. NDI, cervicalgia, cervicobraquialgia.',
  lumbar:   'Fisioterapia. Columna lumbar. Disfunción segmentaria lumbosacra, inestabilidad espinal lumbar, dolor radicular lumbar, estenosis espinal, claudicación neurogénica. Disco intervertebral, protrusión discal, hernia discal, nervio ciático, raíz nerviosa L4 L5 S1, articulación facetaria, sacroilíaca. SLR, elevación pierna recta, Lasègue, Lasègue cruzado, test de Slump, PAIVM lumbar, Kemp. ODI, Oswestry, RMDQ, Roland-Morris, lumbalgia, lumbociática.',
  rodilla:  'Fisioterapia. Rodilla. Artrosis, síndrome patelofemoral, lesión meniscal, LCA, ligamento cruzado anterior, tendinopatía rotuliana, síndrome banda iliotibial, bursitis pata de ganso. Menisco medial, menisco lateral, cartílago articular, ligamento colateral medial, ligamento colateral lateral, LCP, rótula, tendón rotuliano. Test de Lachman, cajón anterior, pivot shift, McMurray, Thessaly, Ober, Noble, lever sign. KOOS, IKDC, LEFS.',
  codo:     'Fisioterapia. Codo. Epicondilalgia lateral, codo de tenista, epicondilalgia medial, codo de golfista, neuropatía cubital, túnel cubital, síndrome túnel radial, nervio interóseo posterior, rotura distal bíceps, capsulitis codo, inestabilidad rotatoria posterolateral IRPL, ligamento colateral cubital LCC, plica radiocapitelar. Test de Cozen, Thomsen, Tinel cubital, hook test, valgo dinámico, maniobra ordeño. DASH, QuickDASH, PRTEE. Epicóndilo, epitróclea.',
  default:  'Fisioterapia musculoesquelética. Hombro: subacromial, capsulitis, SLAP, manguito rotador, Neer, Hawkins-Kennedy. Cadera: femoroacetabular, labrum, tendinopatía glútea, FADDIR, FABER. Cervical: radiculopatía, mielopatía, WAD, Spurling, ULNT. Lumbar: estenosis espinal, claudicación, SLR, Lasègue, Slump. Rodilla: LCA, menisco, patelofemoral, Lachman, McMurray. Codo: epicondilalgia, túnel cubital, IRPL, Cozen, Tinel.'
};

// Report no tiene pista propia para tobillo y pie (cae en `default`); esta es
// la única pista que no viene de allí.
WHISPER_PROMPTS.tobillo_pie = 'Fisioterapia. Tobillo y pie. Esguince lateral de tobillo, inestabilidad crónica de tobillo, sindesmosis, tendinopatía aquílea, rotura del tendón de Aquiles, fascitis plantar, tendinopatía peronea, tibial posterior, metatarsalgia, neuroma de Morton, fractura de estrés. Ligamento peroneoastragalino anterior, calcaneoperoneo, astrágalo, calcáneo, quinto metatarsiano. Reglas de Ottawa, cajón anterior, inversión forzada, squeeze test, test de Thompson, Royal London, windlass, lunge test. FAAM, CAIT, VISA-A, FFI.';

export function getWhisperPrompt(region) {
  return WHISPER_PROMPTS[region] || WHISPER_PROMPTS.default;
}

// ── Bloque de datos de la valoración ──────────────────────────────────────────
// Parte común: idéntica a buildClinicalContext() de report. Lo añadido va al
// final del bloque y solo aparece cuando hay datos.
export function contextoValoracion(data, nombreRegion = r => r) {
  if (!data) return '';
  const hyps = (data.h || [])
    .map(h => `  · ${h.name} — ${h.sc || 'sin evaluar'}`)
    .join('\n');
  const brText = data.br?.length > 0
    ? data.br.map(s => `  ⚠️ ${s}`).join('\n')
    : '  Negativas';
  const sqText = data.sq?.length > 0
    ? '\nAlertas sistémicas positivas:\n' + data.sq.map(s => `  · ${s}`).join('\n')
    : '';

  const extra = [];
  if (data.ur?.length) extra.push(`DERIVACIÓN URGENTE indicada en el cribado (debe constar en el informe):\n${data.ur.map(s => `  · ${s}`).join('\n')}`);
  if (data.dv?.length) extra.push(`Derivación médica indicada por el árbol de decisión (debe constar en el informe):\n${data.dv.map(s => `  · ${s}`).join('\n')}`);
  const sv = signosVitalesTexto(data.sv, data.an);
  if (sv) extra.push(`Signos vitales y antropometría: ${sv}`);
  if (data.fp?.length) extra.push(`Formulario previo (lo refiere el paciente):\n${data.fp.map(x => `  · ${x.q} → ${x.a}`).join('\n')}`);
  if (data.md === 'breve') {
    extra.push('Tipo de valoración: inicial breve (consulta corta). Las hipótesis sin tests de confirmación son hipótesis de trabajo, no diagnósticos.'
      + (data.pe?.length ? `\nPendiente de completar:\n${data.pe.map(s => `  · ${s}`).join('\n')}` : ''));
  }

  return `## DATOS DE VALORACIÓN ESTRUCTURADA (PhysiQ-Assessment)
NOTA: estos datos proceden de una valoración clínica estructurada y son más fiables que la transcripción. Úsalos como fuente prioritaria cuando haya discrepancias.
Paciente: ${data.p || '—'} · Región: ${data.r ? nombreRegion(data.r) : '—'} · Fecha: ${data.d || '—'}
Motivo de consulta: ${data.mo || '—'}
Mecanismo: ${data.me || '—'} · Cronología: ${data.cr || '—'}
NRS: ${data.nr ?? '—'}/10
Irritabilidad: ${data.ir || '—'} · Naturaleza: ${data.na || '—'}
Riesgo psicosocial: ${data.rp || '—'}
Banderas rojas:
${brText}
Cribado sistémico: ${data.si ? '⚠️ Positivo' : 'Negativo'}${sqText}

Hipótesis diagnósticas (por peso diagnóstico):
${hyps || '  (sin hipótesis registradas)'}

Notas del plan terapéutico:
  · Variable de control: ${data.pn?.variableControl || '—'}
  · Ventana de recuperación: ${data.pn?.ventanaRecuperacion || '—'}
  · Anclaje de hábito: ${data.pn?.anclajeHabito || '—'}${extra.length ? '\n\n' + extra.join('\n\n') : ''}

---`;
}

function signosVitalesTexto(sv, an) {
  const partes = [];
  if (sv?.fc != null)   partes.push(`FC ${sv.fc} lpm`);
  if (sv?.fr != null)   partes.push(`FR ${sv.fr} rpm`);
  if (sv?.spo2 != null) partes.push(`SpO₂ ${sv.spo2}%`);
  if (sv?.tas != null || sv?.tad != null) partes.push(`TA ${sv?.tas ?? '—'}/${sv?.tad ?? '—'} mmHg`);
  if (an?.talla != null) partes.push(`talla ${an.talla} cm`);
  if (an?.peso != null)  partes.push(`peso ${an.peso} kg`);
  if (an?.imc != null)   partes.push(`IMC ${an.imc}`);
  return partes.join(' · ');
}

// Idéntica a buildROMContext() de report.
export function contextoROM(romPayload) {
  if (!romPayload) return '';
  const fecha = romPayload.fecha || '—';
  if (romPayload.regions) {
    const sections = Object.entries(romPayload.regions)
      .filter(([, r]) => r.rom && Object.keys(r.rom).length)
      .map(([, r]) => {
        const rows = Object.entries(r.rom)
          .map(([, m]) => `  · ${m.label}: ${m.value}° (ref ${m.ref}°)${m.deficit ? ' — déficit' : ''}`)
          .join('\n');
        return `${r.label}:\n${rows}`;
      });
    if (!sections.length) return '';
    return `## DATOS DE MOVILIDAD ARTICULAR (PhysiQ-Motion)
NOTA: valores medidos con inclinómetro digital; úsalos como referencia objetiva para la sección de ROM del informe.
Fecha: ${fecha}
${sections.join('\n\n')}

---`;
  }
  if (!romPayload.rom || !Object.keys(romPayload.rom).length) return '';
  const region = romPayload.region
    ? romPayload.region.charAt(0).toUpperCase() + romPayload.region.slice(1)
    : '—';
  const rows = Object.entries(romPayload.rom)
    .map(([, m]) => `  · ${m.label}: ${m.value}° (ref ${m.ref}°)${m.deficit ? ' — déficit' : ''}`)
    .join('\n');
  return `## DATOS DE MOVILIDAD ARTICULAR (PhysiQ-Motion)
NOTA: valores medidos con inclinómetro digital; úsalos como referencia objetiva para la sección de ROM del informe.
Región: ${region} · Fecha: ${fecha}
${rows}

---`;
}

// ── Prompt narrativo ──────────────────────────────────────────────────────────
// `{{TRANSCRIPT}}` lo sustituye el worker por la transcripción de Whisper, o
// por un aviso de «no disponible» cuando no se adjunta audio.
export function buildNarrativePrompt(data, { conAudio, nombreRegion } = {}) {
  const clinicalCtx = contextoValoracion(data, nombreRegion);
  const romCtx = contextoROM(data?.rom);
  const hasHypotheses = (data?.h || []).length > 0;
  const region = data?.r ? (nombreRegion ? nombreRegion(data.r) : data.r) : '—';

  return `Eres un fisioterapeuta clínico experto en documentación según el modelo CIF de la OMS y el marco APTA. Genera un informe clínico narrativo, formal e institucional en español, siguiendo la estructura exacta indicada.

PACIENTE: ${data?.p || '—'} | Fecha: ${data?.d || '—'} | Región valorada: ${region} | Diagnóstico médico: no aportado

${clinicalCtx ? clinicalCtx + '\n\n' : ''}${romCtx ? romCtx + '\n\n' : ''}TRANSCRIPCIÓN DE LA SESIÓN:
{{TRANSCRIPT}}

INSTRUCCIONES CRÍTICAS — LEE Y CUMPLE TODAS:

1. **NO GENERES NINGÚN TÍTULO NI SECCIÓN INICIAL DE IDENTIFICACIÓN**. Específicamente PROHIBIDO:
   - NO escribas "INFORME CLÍNICO DE FISIOTERAPIA" ni similar.
   - NO incluyas un bloque inicial con "Paciente:", "Fecha:", "Sesión número:", "Fisioterapeuta:" o cualquier ficha de identificación.
   - NO repitas el nombre del paciente ni la fecha al inicio.
   - El nombre del paciente, la fecha y los datos identificativos se añaden aparte, fuera de tu texto. Repetirlos es un error grave.
   - Tu respuesta DEBE empezar DIRECTAMENTE con "## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES" sin ningún texto previo.

2. Usa prosa clínica continua y formal, no listas escuetas. Tono de informe profesional para enviar al paciente o equipo médico.
3. NO uses ** para negrita ni símbolos markdown, salvo en tablas markdown estándar.
4. Tablas: cuando haya datos numéricos cuantificables (ROM, fuerza, escalas), genera tablas markdown estándar con sintaxis | columna | columna |. Si no hay datos suficientes, omite la tabla y describe en prosa.
5. Si una subsección no aplica o no hay datos, omítela limpiamente (no escribas "no evaluado" en cada subsección menor).
6. Usa la terminología CIF cuando proceda (códigos b, s, d, e si emergen del contexto).
7. ${conAudio
    ? 'La transcripción complementa los datos estructurados; si discrepan, prevalecen los datos estructurados.'
    : 'No hay transcripción de la sesión: redacta el informe exclusivamente con los datos de la valoración estructurada.'} No inventes mediciones, pruebas, escalas ni datos personales que no aparezcan en los datos recibidos.
8. Si los datos indican una derivación urgente o una derivación médica, hazla constar de forma explícita en CONCLUSIONES Y PLAN DE TRATAMIENTO.${hasHypotheses ? `
9. En la sección CONCLUSIONES Y PLAN DE TRATAMIENTO incluye la subsección "### Coherencia con hipótesis de valoración". Contrasta los hallazgos de la transcripción con las hipótesis recibidas e indica si los refuerzan, matizan o si existe alguna discrepancia relevante. No propongas hipótesis nuevas en esta subsección.
10. Si en la transcripción aparecen hallazgos clínicos explícitos (tests especiales, signos, síntomas objetivos) que sugieran condiciones no cubiertas por las hipótesis recibidas, inclúyelos en "### Hipótesis adicionales a valorar", citando el hallazgo exacto que justifica cada una. Limita el alcance a la región anatómica del contexto estructurado. Omite esta subsección si no hay evidencia explícita.` : ''}

ESTRUCTURA OBLIGATORIA — empieza DIRECTAMENTE con la primera sección, sin títulos previos:

## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES
[Párrafo introductorio sobre el enfoque biopsicosocial]

### Condición de Salud (Diagnóstico Médico)
[Diagnósticos preoperatorios, postoperatorios, por imagen si aplica, en formato narrativo o lista breve]

### Factores Personales
[Edad, sexo, profesión, comorbilidades, estilo de vida previo, medicación]

### Factores Ambientales
[Domicilio, apoyo familiar, accesibilidad, ayudas técnicas]

## HISTORIA CLÍNICA Y EVOLUCIÓN

### Presentación Inicial y Antecedentes
[Origen del cuadro, evolución cronológica]

### Intervención Quirúrgica
[Si aplica: fecha, técnica, hallazgos intraoperatorios]

### Tratamientos Adyuvantes
[Si aplica: radioterapia, hormonoterapia, infiltraciones, fisioterapia previa]

## EVALUACIÓN DE FUNCIONES Y ESTRUCTURAS CORPORALES

### Funciones Neuromusculoesqueléticas y Relacionadas con el Movimiento

#### Rango de Movimiento Activo (ROM)
[Describir y, si hay datos numéricos, generar TABLA markdown con columnas: Articulación | Movimiento | Rango (Izq/Dcha) | Asimetría]

#### Fuerza Muscular
[Describir y, si hay datos numéricos, generar TABLA markdown con columnas: Miotomas | Movimiento | Fuerza (Izq/Dcha) | Asimetría]

#### Función Cardiorrespiratoria
[Pruebas ortostáticas, HRV, capacidad aeróbica si aplica]

#### Control Motor
[Análisis de patrones motores, plataformas de fuerza, si aplica]

#### Equilibrio
[Estático, dinámico, oscilación, si aplica]

#### Estabilidad Articular
[Tests de inestabilidad, propiocepción, si aplica]

### Funciones Sensoriales y Dolor
[Evaluación EVA, dolor neuropático, hiperalgesia, escalas]

## ANÁLISIS DEL FUNCIONAMIENTO: LIMITACIONES EN LA ACTIVIDAD Y RESTRICCIONES EN LA PARTICIPACIÓN

### Limitación Funcional Global
[Visión integradora del impacto biopsicosocial]

### Limitaciones en las Actividades
[Pruebas de ejecución: 6MWT, TUG, SCT, Chair Stand, etc. + escalas autorreportadas: EFEI, WOMAC]

### Restricciones en la Participación
[EQ-5D-5L, ICL, impacto laboral y social]

## CONCLUSIONES Y PLAN DE TRATAMIENTO
[Síntesis clínica integradora con problema primario, hallazgos clave y enfoque terapéutico propuesto en prosa]${hasHypotheses ? `

### Coherencia con hipótesis de valoración
[Indica si los hallazgos de la sesión refuerzan, matizan o contradicen las hipótesis recibidas, sin proponer diagnósticos nuevos]

### Hipótesis adicionales a valorar
[Solo si la transcripción contiene hallazgos explícitos que lo justifiquen: lista cada hipótesis adicional citando el hallazgo exacto. Omite si no hay evidencia explícita]` : ''}

## SEGUIMIENTO FUNCIONAL
[Espacio para registrar reevaluaciones futuras. Si no procede en esta sesión, escribir: "Pendiente de reevaluaciones programadas."]

PRESUPUESTO DE EXTENSIÓN: el informe completo no debe superar las ${PALABRAS_INFORME} palabras en total. Ajusta la profundidad de cada sección para que el informe esté completo y bien cerrado dentro de ese límite. No trunces a mitad de sección.

RECORDATORIO FINAL: tu respuesta DEBE empezar literalmente con la cadena "## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES" como primer texto, sin nada antes.`;
}

// ── Huella de la valoración ───────────────────────────────────────────────────
// Para avisar de que la valoración cambió después de generar el informe. La
// fecha (`d`) se excluye: cambia sola al pasar la medianoche.
export function huellaPayload(data) {
  const { d, ...resto } = data || {};
  const s = JSON.stringify(resto);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// ── Stream SSE del worker ─────────────────────────────────────────────────────
// Eventos: transcript {text} · report_chunk {text} · done · error {message}.
// Devuelve los bloques completos ya interpretados y el resto sin cerrar.
export function parseSSEBuffer(buf) {
  const blocks = buf.split('\n\n');
  const resto = blocks.pop() ?? '';
  const eventos = [];
  for (const block of blocks) {
    const ev = parseSSEBlock(block);
    if (ev) eventos.push(ev);
  }
  return { eventos, resto };
}

export function parseSSEBlock(block) {
  let type = '', dataStr = '';
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) type = line.slice(6).trim();
    else if (line.startsWith('data:')) dataStr = line.slice(5).trim();
  }
  if (!type || !dataStr) return null;
  try { return { type, data: JSON.parse(dataStr) }; } catch { return null; }
}

// Misma comprobación que detectTruncation() de report (plantilla narrativa).
export function informeTruncado(texto) {
  const t = (texto || '').trimEnd();
  if (!t) return true;
  const hasLastSection = t.toUpperCase().includes('SEGUIMIENTO FUNCIONAL');
  const lastChar = t[t.length - 1];
  return !hasLastSection || !'.!?)»"\''.includes(lastChar);
}

// ── Markdown → texto plano (para compartir/copiar) ────────────────────────────
const esSeparadorTabla = l => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
const celdas = l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());

export function markdownATexto(md) {
  const out = [];
  for (const raw of (md || '').replace(/\r\n/g, '\n').split('\n')) {
    const l = raw.replace(/\*\*(.+?)\*\*/g, '$1');
    let m;
    if ((m = l.match(/^##\s+(.*)$/)))           { if (out.length && out[out.length - 1] !== '') out.push(''); out.push(m[1].trim().toUpperCase()); }
    else if ((m = l.match(/^#{3,6}\s+(.*)$/)))  { if (out.length && out[out.length - 1] !== '') out.push(''); out.push(m[1].trim()); }
    else if (esSeparadorTabla(l) && l.includes('-')) continue;
    else if (/^\s*\|.*\|\s*$/.test(l))          out.push(celdas(l).join(' | '));
    else                                        out.push(l.trimEnd());
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ── Markdown → HTML (vista en la tarjeta) ─────────────────────────────────────
const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function markdownAHtml(md) {
  const lineas = (md || '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let parrafo = [];
  const cerrarParrafo = () => {
    if (parrafo.length) html.push(`<p>${parrafo.map(escapeHtml).join('<br>')}</p>`);
    parrafo = [];
  };
  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i].replace(/\*\*(.+?)\*\*/g, '$1');
    let m;
    if ((m = l.match(/^(#{2,6})\s+(.*)$/))) {
      cerrarParrafo();
      const nivel = Math.min(m[1].length + 1, 6);   // ## → h3, ### → h4, #### → h5
      html.push(`<h${nivel}>${escapeHtml(m[2].trim())}</h${nivel}>`);
    } else if (/^\s*\|.*\|\s*$/.test(l)) {
      cerrarParrafo();
      const filas = [];
      while (i < lineas.length && /^\s*\|.*\|\s*$/.test(lineas[i])) { filas.push(lineas[i]); i++; }
      i--;
      const cuerpo = filas.filter(f => !esSeparadorTabla(f));
      const cab = filas.length > 1 && esSeparadorTabla(filas[1]) ? celdas(cuerpo.shift()) : null;
      html.push('<div class="ia-tabla"><table>'
        + (cab ? `<thead><tr>${cab.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>` : '')
        + `<tbody>${cuerpo.map(f => `<tr>${celdas(f).map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
        + '</table></div>');
    } else if (!l.trim()) {
      cerrarParrafo();
    } else {
      parrafo.push(l.trim());
    }
  }
  cerrarParrafo();
  return html.join('');
}

// ── Texto final para compartir ────────────────────────────────────────────────
// La identificación la pone assessment, no Claude (regla 1 del prompt).
export function textoParaCompartir(informe, data, nombreRegion = r => r) {
  return `INFORME DE FISIOTERAPIA${data?.p ? `\nPaciente: ${data.p}` : ''}
Fecha: ${data?.d || '—'}
Región valorada: ${data?.r ? nombreRegion(data.r) : '—'}

${markdownATexto(informe)}

—
Informe generado con PhysiQ-Assessment el ${data?.d || '—'} (redacción asistida por IA).`;
}

// Extensión para el archivo de audio según su tipo MIME (Whisper usa la
// extensión para reconocer el formato).
export function extensionAudio(mime) {
  const m = (mime || '').toLowerCase();
  if (m.includes('webm')) return 'webm';
  if (m.includes('ogg'))  return 'ogg';
  if (m.includes('mp4') || m.includes('m4a') || m.includes('aac')) return 'm4a';
  if (m.includes('mpeg') || m.includes('mp3')) return 'mp3';
  if (m.includes('wav'))  return 'wav';
  return 'webm';
}
