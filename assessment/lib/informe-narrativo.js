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
//   · Revisión con informes reales (2026-10-06): sin «Diagnóstico médico: no
//     aportado» fijo (contradecía lo que el paciente contaba), regla de
//     discrepancias en vez de «prevalecen los datos estructurados», sin citar
//     las fuentes, reglas pronósticas nunca como apoyo diagnóstico, códigos
//     CIF limitados, derivación una vez al principio del plan, y topes de
//     tokens holgados (el límite real es el de palabras).
//   · Segunda revisión (hombro, narrativo sin audio): estructura del narrativo
//     adaptada a una valoración inicial (fuera cardiorrespiratoria, control
//     motor, equilibrio y los ejemplos de escalas que no se pasan; subsecciones
//     opcionales marcadas «[solo si…]»), sin códigos CIF en el narrativo, sin
//     la etiqueta de puntuación de las hipótesis (se colaba el «LR×»), bloques
//     de datos con nombres que no invitan a citarlos, notas del plan vacías
//     fuera, y «Derivar» se mantiene aunque los tests salgan negativos.
//   · Tercera revisión (hombro, con el JSON exportado): cada dato asignado a
//     una sola sección, respuestas «No sé» omitidas (no convertidas en
//     negaciones), etiquetas internas limpias (flechas, «(→ Rx)»), IMC
//     redondeado, el gesto testigo como medida de referencia (no test) y las
//     pruebas de una hipótesis «Derivar» como comprobaciones que no la descartan.

export const ORCHESTRATOR_URL = 'https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev';
export const TURNSTILE_SITEKEY = '0x4AAAAAADU3dzE5Tw_whVks';   // la misma de physiq-report
export const LICENSE_KEY_STORAGE = 'physiq-license-key';        // la guarda el hub; compartida por origen

// Palabras como en el paso 3 del selector de report (2000). El tope de tokens
// va holgado a propósito: solo evita que se corte (se paga lo generado); la
// extensión la marca la instrucción de palabras.
export const MAX_TOKENS_INFORME = 7000;
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

// Etiquetas de los datos clínicos escritas para la pantalla («A → B», «(→ Rx)»):
// en el prompt se leen como texto, así que las flechas pasan a palabras.
export function limpiarEtiqueta(texto) {
  const partes = String(texto ?? '').replace(/\s*\(→[^)]*\)/g, '').replace(/\s*\([①-⑳]\)/g, '').split(/\s*→\s*/);
  return partes.length > 1 ? `${partes[0]} — orienta a: ${partes.slice(1).join('; ')}` : partes[0];
}

// ── Bloque de datos de la valoración ──────────────────────────────────────────
// Parte común: la de buildClinicalContext() de report, salvo tres cambios
// deliberados — hipótesis sin su etiqueta de puntuación (el informe acababa
// citando «LR× 2,0» y «0/4 hallazgos»), notas del plan solo si tienen texto
// (un «—» acababa como «no se especificó…») y la derivación del árbol sin la
// palabra «árbol». Lo añadido va al final y solo aparece cuando hay datos.
export function contextoValoracion(data, nombreRegion = r => r, ampliado = null) {
  if (!data) return '';
  const hyps = (data.h || [])
    .map(h => `  · ${limpiarEtiqueta(h.name)}`)
    .join('\n');
  const brText = data.br?.length > 0
    ? data.br.map(s => `  ⚠️ ${s}`).join('\n')
    : '  Negativas';
  const sqText = data.sq?.length > 0
    ? '\nAlertas sistémicas positivas:\n' + data.sq.map(s => `  · ${s}`).join('\n')
    : '';

  const extra = [];
  if (data.ur?.length) extra.push(`DERIVACIÓN URGENTE indicada en el cribado (debe constar en el informe):\n${data.ur.map(s => `  · ${s}`).join('\n')}`);
  if (data.dv?.length) extra.push(`Derivación médica indicada en la exploración (debe constar en el informe):\n${data.dv.map(s => `  · ${s}`).join('\n')}`);
  const sv = signosVitalesTexto(data.sv, data.an);
  if (sv) extra.push(`Signos vitales y antropometría: ${sv}`);
  if (data.fp?.length) extra.push(`Lo que refiere el paciente antes de la consulta (pregunta → respuesta):\n${data.fp.map(x => `  · ${x.q} → ${x.a}`).join('\n')}`);
  const notas = [['Variable de control', data.pn?.variableControl], ['Ventana de recuperación', data.pn?.ventanaRecuperacion], ['Anclaje de hábito', data.pn?.anclajeHabito]]
    .filter(([, v]) => (v || '').trim());
  if (notas.length) extra.push(`Notas del plan terapéutico:\n${notas.map(([k, v]) => `  · ${k}: ${v.trim()}`).join('\n')}`);
  extra.push(...bloquesAmpliados(ampliado));
  if (data.md === 'breve') {
    extra.push('Tipo de valoración: inicial breve (consulta corta). Las hipótesis sin tests de confirmación son hipótesis de trabajo, no diagnósticos.'
      + (data.pe?.length ? `\nPendiente de completar:\n${data.pe.map(s => `  · ${s}`).join('\n')}` : ''));
  }

  return `## DATOS DE VALORACIÓN ESTRUCTURADA (PhysiQ-Assessment)
NOTA: estos datos proceden de una valoración clínica estructurada. Los resultados y clasificaciones del fisioterapeuta son la fuente prioritaria; para lo que refiere el paciente, sigue la regla de discrepancias de las instrucciones.
Paciente: ${data.p || '—'}${ampliado?.edad != null ? ` · Edad: ${ampliado.edad} años` : ''} · Región: ${data.r ? nombreRegion(data.r) : '—'} · Fecha: ${data.d || '—'}
Motivo de consulta: ${data.mo || '—'}
Mecanismo: ${data.me || '—'} · Cronología: ${data.cr || '—'}
NRS: ${data.nr ?? '—'}/10
Irritabilidad: ${data.ir || '—'} · Naturaleza: ${data.na || '—'}
Riesgo psicosocial: ${data.rp || '—'}
Banderas rojas:
${brText}
Cribado sistémico: ${data.si ? '⚠️ Positivo' : 'Negativo'}${sqText}

Hipótesis de trabajo del fisioterapeuta (de mayor a menor apoyo):
${hyps || '  (sin hipótesis registradas)'}${extra.length ? '\n\n' + extra.join('\n\n') : ''}

---`;
}

// ── Datos ampliados de las fases (informe-ia.js los reúne del estado) ────────
// No viajan en buildPhysiQPayload() — ese resumen es el contrato con
// physiq-report —, solo en este prompt. Forma:
//   { edad, signoComparable, estabilidad,
//     irritabilidad: { dolor, reposo, movimiento, discapacidad, tolerancia } | null,
//     psico: [{ q, a }], criterios: [{ etiqueta, positivas, total, nota }],
//     arbol: [{ pregunta, respuesta }],
//     tests: [{ hipotesis, items: [{ test, resultado, cluster?, pronostico? }] }],
//     pautas: [{ hipotesis, derivar, pauta, fuente, pronostico?, prom }] }
// Cada bloque solo aparece si tiene datos.
export function bloquesAmpliados(a) {
  if (!a) return [];
  const b = [];
  const fase3 = [];
  if (a.signoComparable) fase3.push(`Signo comparable (movimiento que reproduce los síntomas): ${a.signoComparable}`);
  if (a.estabilidad) fase3.push(`Evolución reciente del cuadro: ${a.estabilidad}`);
  if (a.irritabilidad) {
    const i = a.irritabilidad;
    fase3.push(`Detalle de la irritabilidad: nivel de dolor ${i.dolor || '—'}; dolor en reposo ${i.reposo || '—'}; dolor con movimiento ${i.movimiento || '—'}; discapacidad ${i.discapacidad || '—'}; tolerancia al estrés físico ${i.tolerancia || '—'}`);
  }
  if (fase3.length) b.push(fase3.join('\n'));
  if (a.psico?.length) b.push(`Cribado psicosocial detallado:\n${a.psico.map(x => `  · ${x.q} → ${x.a}`).join('\n')}`);
  if (a.criterios?.length) b.push(`Criterios compuestos del cribado que se cumplen (patrón compatible, no diagnóstico):\n${a.criterios.map(c => `  · ${c.etiqueta} (${c.positivas}/${c.total}): ${c.nota}`).join('\n')}`);
  if (a.arbol?.length) b.push(`Recorrido de la exploración (pregunta clínica → lo que encontró el fisioterapeuta):\n${a.arbol.map(x => `  · ${limpiarEtiqueta(x.pregunta)} → ${limpiarEtiqueta(x.respuesta)}`).join('\n')}`);
  if (a.tests?.length) {
    const item = t => t.referencia
      ? `    · ${limpiarEtiqueta(t.test)}: registrado como medida de referencia para el seguimiento (no es una prueba diagnóstica; no tiene resultado positivo ni negativo)`
      : `    · ${limpiarEtiqueta(t.test)}: ${t.resultado}${t.cluster ? ` (parte del cluster «${t.cluster}»)` : ''}${t.pronostico ? ' (regla pronóstica, no diagnóstica)' : ''}`;
    b.push(`Tests de confirmación realizados (solo estos; no hay otros):\n${a.tests.map(h => `  ${limpiarEtiqueta(h.hipotesis)}${h.derivar
      ? ' — comprobaciones de una hipótesis que se deriva: no son tests diagnósticos ni pruebas de imagen, y un resultado negativo no la descarta'
      : ''}:\n${h.items.map(item).join('\n')}`).join('\n')}`);
  }
  if (a.pautas?.length) {
    b.push(`Pauta recomendada por PhysiQ para cada hipótesis (basada en guías; no propongas dosis distintas):\n${a.pautas.map(p => [
      `  ${limpiarEtiqueta(p.hipotesis)}:`,
      p.derivar ? '    · Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico.' : p.pauta ? `    · Pauta: ${p.pauta}` : '    · Pauta: a criterio del fisioterapeuta (la guía no la fija).',
      p.fuente ? `    · Fuente: ${p.fuente}` : '',
      p.pronostico?.horizonte ? `    · Pronóstico: ${p.pronostico.horizonte}` : '',
      p.pronostico?.derivacion ? `    · Cuándo reconsiderar o derivar: ${p.pronostico.derivacion}` : '',
      p.prom ? `    · Escala recomendada para el seguimiento: ${p.prom}` : '',
    ].filter(Boolean).join('\n')).join('\n')}`);
  }
  return b;
}

function signosVitalesTexto(sv, an) {
  const partes = [];
  if (sv?.fc != null)   partes.push(`FC ${sv.fc} lpm`);
  if (sv?.fr != null)   partes.push(`FR ${sv.fr} rpm`);
  if (sv?.spo2 != null) partes.push(`SpO₂ ${sv.spo2}%`);
  if (sv?.tas != null || sv?.tad != null) partes.push(`TA ${sv?.tas ?? '—'}/${sv?.tad ?? '—'} mmHg`);
  if (an?.talla != null) partes.push(`talla ${an.talla} cm`);
  if (an?.peso != null)  partes.push(`peso ${an.peso} kg`);
  if (an?.imc != null)   partes.push(`IMC ${Number(an.imc).toFixed(1)}`);
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
export function buildNarrativePrompt(data, { conAudio, nombreRegion, ampliado } = {}) {
  const clinicalCtx = contextoValoracion(data, nombreRegion, ampliado);
  const romCtx = contextoROM(data?.rom);
  const hasHypotheses = (data?.h || []).length > 0;
  const region = data?.r ? (nombreRegion ? nombreRegion(data.r) : data.r) : '—';

  return `Eres un fisioterapeuta clínico experto en documentación según el modelo CIF de la OMS y el marco APTA. Genera un informe clínico narrativo, formal e institucional en español, siguiendo la estructura exacta indicada.

PACIENTE: ${data?.p || '—'} | Fecha: ${data?.d || '—'} | Región valorada: ${region}

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
5. Las subsecciones marcadas «[solo si…]» se omiten por completo, título incluido, cuando no hay datos para ellas. No escribas subsecciones para decir que algo no se hizo.
6. Usa la terminología CIF en la prosa (funciones, estructuras, actividades, participación, factores contextuales), sin códigos alfanuméricos.
7. ${conAudio
    ? 'La transcripción complementa los datos estructurados.'
    : 'No hay transcripción de la sesión: redacta el informe exclusivamente con los datos de la valoración estructurada.'} No inventes mediciones, pruebas, escalas ni datos personales que no aparezcan en los datos recibidos.
8. ${reglaDerivacion('CONCLUSIONES Y PLAN DE TRATAMIENTO', false)}
${REGLAS_COMUNES}${hasHypotheses ? `
9. En la sección CONCLUSIONES Y PLAN DE TRATAMIENTO incluye la subsección "### Coherencia con hipótesis de valoración". En dos o tres frases, contrasta los hallazgos (tests realizados, recorrido de la exploración y, si la hay, la transcripción) con las hipótesis recibidas e indica si los refuerzan, matizan o si existe alguna discrepancia relevante, sin volver a enumerar los tests uno a uno. Si las comprobaciones de una hipótesis que se deriva salieron negativas, di que la exploración no la apoya pero no la descarta (por eso se deriva); no digas que los hallazgos la refuerzan. No propongas hipótesis nuevas en esta subsección.
10. Si en la transcripción aparecen hallazgos clínicos explícitos (tests especiales, signos, síntomas objetivos) que sugieran condiciones no cubiertas por las hipótesis recibidas, inclúyelos en "### Hipótesis adicionales a valorar", citando el hallazgo exacto que justifica cada una. Limita el alcance a la región anatómica del contexto estructurado. Omite esta subsección si no hay evidencia explícita.` : ''}

ESTRUCTURA OBLIGATORIA — empieza DIRECTAMENTE con la primera sección, sin títulos previos:

## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES
[Dos o tres frases que sitúen el caso (quién, qué región, desde cuándo). No expliques qué es la CIF ni el modelo biopsicosocial]

### Condición de Salud (Diagnóstico Médico)
[Solo si los datos o la consulta mencionan un diagnóstico médico, una cirugía o una prueba de imagen: recógelo como antecedente. Si no consta ninguno, omite esta subsección sin comentarlo]

### Factores Personales
[Edad, sexo, actividad física y laboral, comorbilidades, medicación, signos vitales y antropometría si constan, y el riesgo psicosocial]

### Factores Ambientales
[Solo si hay datos de domicilio, apoyo familiar, trabajo o ayudas técnicas]

## HISTORIA CLÍNICA Y EVOLUCIÓN

### Presentación Inicial y Antecedentes
[Mecanismo, inicio, evolución cronológica y episodios previos. La intensidad y la irritabilidad van en Dolor]

### Intervención Quirúrgica
[Solo si la hubo y hay detalles que no estén ya en Condición de Salud: fecha, técnica, evolución posquirúrgica]

### Tratamientos Previos
[Solo si los hay: qué ha probado y con qué resultado]

### Cribado de Seguridad
[Banderas rojas y cribado sistémico, en una o dos frases]

## EVALUACIÓN DE FUNCIONES Y ESTRUCTURAS CORPORALES

### Dolor
[Intensidad, irritabilidad, naturaleza y signo comparable. Las actividades que provocan el dolor van en Limitaciones en las Actividades]

### Movilidad
[Hallazgos de movilidad activa y pasiva; si hay datos numéricos, TABLA markdown con columnas: Articulación | Movimiento | Rango (Izq/Dcha) | Asimetría]

### Fuerza Muscular
[Solo si se exploró o el paciente refiere debilidad; si hay datos numéricos, TABLA markdown con columnas: Grupo muscular | Movimiento | Fuerza (Izq/Dcha) | Asimetría]

### Pruebas Clínicas
[Solo si se realizaron: los hallazgos del recorrido de la exploración y los tests, cada uno una vez, agrupados por la hipótesis que exploran. Lo que se descarta de otra región (p. ej. la columna cervical) se dice aquí y solo aquí]

## ANÁLISIS DEL FUNCIONAMIENTO: LIMITACIONES EN LA ACTIVIDAD Y RESTRICCIONES EN LA PARTICIPACIÓN

### Limitaciones en las Actividades
[Las actividades que refiere dolorosas o limitadas, agrupadas, sin enumerarlas una a una]

### Restricciones en la Participación
[Solo si refiere afectación del trabajo, el ocio, el deporte o la vida social: describe lo que refiere, sin suponer cómo podría afectarle]

## CONCLUSIONES Y PLAN DE TRATAMIENTO
[Si hay derivación, empieza por ella. Después, síntesis clínica con el problema principal y el enfoque terapéutico, en prosa, sin volver a enumerar los tests y sin el criterio de reevaluación (va en Seguimiento)]${hasHypotheses ? `

### Coherencia con hipótesis de valoración
[Dos o tres frases: si los hallazgos refuerzan, matizan o contradicen las hipótesis recibidas, sin repetir los tests ni proponer diagnósticos nuevos]

### Hipótesis adicionales a valorar
[Solo si la transcripción contiene hallazgos explícitos que lo justifiquen: lista cada hipótesis adicional citando el hallazgo exacto. Omite si no hay evidencia explícita]` : ''}

## SEGUIMIENTO FUNCIONAL
[Escala recomendada para medir la evolución y cuándo reevaluar o reconsiderar la derivación por falta de mejoría (aquí y solo aquí), sin repetir el plan. Si no hay datos para ello, escribir: "Pendiente de reevaluaciones programadas."]

PRESUPUESTO DE EXTENSIÓN: el informe completo no debe superar las ${PALABRAS_INFORME} palabras en total. Ajusta la profundidad de cada sección para que el informe esté completo y bien cerrado dentro de ese límite. No trunces a mitad de sección.

RECORDATORIO FINAL: tu respuesta DEBE empezar literalmente con la cadena "## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES" como primer texto, sin nada antes.`;
}

// Reglas que comparten las dos plantillas (narrativa y ficha breve).
const REGLAS_COMUNES = `- Tests: describe solo los tests realizados con su resultado; no menciones tests no realizados uno a uno.
- Reglas pronósticas (marcadas «regla pronóstica, no diagnóstica», p. ej. la regla de Flynn): predicen la respuesta a un tratamiento. Preséntalas así y nunca las uses para reforzar ni descartar una hipótesis diagnóstica.
- Lo que no se exploró o no se midió en esta valoración (goniometría, fuerza, escalas…) dilo UNA sola vez, en una frase, donde se describe la exploración; no lo repitas en cada sección o subsección.
- Discrepancias: los resultados y clasificaciones del fisioterapeuta (tests, NRS, irritabilidad, banderas, hipótesis) prevalecen sobre lo que se diga en la conversación. Si lo que refiere el paciente cambia entre lo que contestó antes de la consulta y lo que cuenta en ella, recoge las dos versiones UNA vez en una frase neutra (p. ej. «niega inicialmente dolor nocturno, aunque en consulta refiere que le dificulta conciliar el sueño»). No elijas tú una de las dos, no las escribas en lugares distintos como si no chocaran, y no interpretes ni justifiques la discrepancia.
- No menciones de dónde sale cada dato: nada de «transcripción», «grabación», «formulario», «cuestionario», «PhysiQ», «datos estructurados», «datos recibidos», «razonamiento clínico», «árbol de decisión» ni «regla de decisión». Escribe «refiere», «en consulta», «en la exploración».
- Hipótesis: no cites cocientes de probabilidad (LR), pesos, puntuaciones ni recuentos de criterios o hallazgos; describe qué tests apoyan o no cada hipótesis.
- Lo que refiere el paciente antes de la consulta: resúmelo en prosa, con los negativos relevantes en una frase. No lo transcribas pregunta por pregunta y no escribas «contestó».
- Respuestas «No sé» o «No sabría decir»: omítelas; nunca las conviertas en una negación («no refiere…», «niega…»).
- No afirmes negativos que no estén en los datos: si un síntoma no aparece (p. ej. el dolor nocturno), no lo menciones.
- Cada dato aparece una sola vez, en la sección que le corresponde; no remitas a otras secciones («como se indicó…»).
- No crees secciones ni subsecciones que no estén en la estructura.
- Plan: si los datos incluyen una pauta recomendada por PhysiQ, basa el plan en ella sin proponer dosis, series ni volúmenes distintos; si dice «Derivar», el plan es la derivación.
- Seguimiento: para medir la evolución, usa la escala recomendada de cada hipótesis cuando la haya.`;

// Derivaciones: una sola vez, al principio de la sección del plan. Con una
// derivación no urgente el informe no decide si se espera a la valoración
// médica: esa decisión es del fisioterapeuta.
function reglaDerivacion(seccion, conSeguimiento = true) {
  return `Derivaciones: si los datos indican una derivación urgente o una derivación médica, hazla constar de forma explícita UNA sola vez, al principio de ${seccion}, con su motivo (en los hallazgos puedes describir el signo que la motiva, sin repetir la derivación). Si es urgente o la pauta de la hipótesis dice «Derivar», el plan es la derivación. Una hipótesis cuya pauta dice «Derivar» (fractura, luxación, rotura…) se deriva aunque sus tests clínicos hayan salido negativos, porque no la descartan: nómbrala como sospecha pendiente de confirmar por el médico, salvo que el fisioterapeuta indique otra cosa en consulta o en las notas del plan. Si es una derivación médica no urgente, presenta igualmente el plan de fisioterapia propuesto y no decidas por tu cuenta si se espera a la valoración médica o se trata en paralelo, salvo que el fisioterapeuta lo indique en consulta o en las notas del plan. Orden de ${seccion}: derivación (si la hay) y después plan y pauta${conSeguimiento ? ', y al final el seguimiento' : ''}.`;
}

// ── Ficha breve ───────────────────────────────────────────────────────────────
// Adaptada de la plantilla «brief» de physiq-report (buildPrompt(), rama
// brief): tres secciones en prosa, ~550 palabras. Mismas diferencias que la
// narrativa (identificación aparte, sin audio, datos ampliados, reglas comunes).
export const PALABRAS_FICHA = 550;
export const MAX_TOKENS_FICHA = 2500;   // holgado: ver MAX_TOKENS_INFORME

export function buildFichaBrevePrompt(data, { conAudio, nombreRegion, ampliado } = {}) {
  const clinicalCtx = contextoValoracion(data, nombreRegion, ampliado);
  const romCtx = contextoROM(data?.rom);
  const hasHypotheses = (data?.h || []).length > 0;
  const region = data?.r ? (nombreRegion ? nombreRegion(data.r) : data.r) : '—';

  return `Eres un fisioterapeuta clínico experto en documentación CIF-APTA.
Genera un informe clínico breve en español a partir de los datos de la valoración${conAudio ? ' y de la transcripción de la sesión' : ''}. El informe debe estar escrito en prosa clínica continua, sin listas de ítems, y no superar las ${PALABRAS_FICHA} palabras en total.

PACIENTE: ${data?.p || '—'} | Fecha: ${data?.d || '—'} | Región valorada: ${region}

${clinicalCtx ? clinicalCtx + '\n\n' : ''}${romCtx ? romCtx + '\n\n' : ''}TRANSCRIPCIÓN:
{{TRANSCRIPT}}

INSTRUCCIONES:
1. No escribas título ni ficha de identificación (paciente, fecha…): se añaden aparte. Empieza directamente con "## PRESENTACIÓN CLÍNICA".
2. Usa EXACTAMENTE estas tres secciones con prefijo ##:
   ## PRESENTACIÓN CLÍNICA
   ## HALLAZGOS Y CODIFICACIÓN CIF
   ## OBJETIVOS Y PLAN
3. Escribe en prosa continua dentro de cada sección, sin viñetas ni listas.
4. En ## HALLAZGOS Y CODIFICACIÓN CIF incluye los códigos CIF alfanuméricos relevantes entre paréntesis inline, integrados en la prosa: como máximo unos 6 y solo los que correspondan sin duda al hallazgo descrito; es mejor omitir un código que poner uno dudoso. Ejemplo: "Se constata limitación del rango de flexión de hombro (b7101) con dolor asociado al movimiento activo (b28016)."
5. ${conAudio
    ? 'La transcripción complementa los datos estructurados.'
    : 'No hay transcripción de la sesión: redacta el informe exclusivamente con los datos de la valoración estructurada.'} No inventes mediciones, pruebas, escalas ni datos personales que no aparezcan en los datos recibidos; no escribas "No evaluado".
6. ${reglaDerivacion('## OBJETIVOS Y PLAN')}
${REGLAS_COMUNES}
7. Límite estricto: ${PALABRAS_FICHA} palabras totales entre las tres secciones.${hasHypotheses ? '\n8. En ## HALLAZGOS Y CODIFICACIÓN CIF añade una frase de contraste con las hipótesis de valoración recibidas: indica si los hallazgos las refuerzan, matizan o contradicen, citando el hallazgo que lo justifica. Si las comprobaciones de una hipótesis que se deriva salieron negativas, di que no la apoyan pero no la descartan.' : ''}`;
}

// Plantillas disponibles: lo que necesita la tarjeta para generar y validar.
export const PLANTILLAS = {
  narrativo: { nombre: 'Narrativo', palabras: PALABRAS_INFORME, maxTokens: MAX_TOKENS_INFORME, ultima: 'SEGUIMIENTO FUNCIONAL', prompt: (d, o) => buildNarrativePrompt(d, o) },
  breve:     { nombre: 'Ficha breve', palabras: PALABRAS_FICHA, maxTokens: MAX_TOKENS_FICHA, ultima: 'OBJETIVOS Y PLAN', prompt: (d, o) => buildFichaBrevePrompt(d, o) },
};

// Por defecto, la que encaja con el tipo de consulta.
export const plantillaPorDefecto = modo => (modo === 'breve' ? 'breve' : 'narrativo');

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
export function informeTruncado(texto, plantilla = 'narrativo') {
  const t = (texto || '').trimEnd();
  if (!t) return true;
  const ultima = plantilla === 'breve' ? 'OBJETIVOS Y PLAN' : 'SEGUIMIENTO FUNCIONAL';
  const hasLastSection = t.toUpperCase().includes(ultima);
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
  return `INFORME DE FISIOTERAPIA${data?.p ? `\nPaciente: ${data.p}` : ''}${data?.ed != null ? `\nEdad: ${data.ed} años` : ''}
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

// ── Errores de los servicios, en español ─────────────────────────────────────
// El worker reenvía el mensaje de la API con el servicio delante: «Whisper: …»
// (transcripción, OpenAI) o «Claude: …» / «Claude (docs): …» (redacción,
// Anthropic). No se traduce error a error: se reconocen las pocas familias que
// aparecen por palabras clave estables y el resto cae en un mensaje genérico
// por servicio. El original se conserva siempre, para diagnosticar.
// Un mensaje sin servicio delante es nuestro (ya en español) y pasa tal cual.
// → { texto, original, servicio: 'whisper'|'claude'|null, sinAudio }
const FAMILIAS_ERROR = [
  { re: /billing|quota|not active|credit balance|insufficient|payment|plan and billing/i,
    texto: s => `La cuenta de ${s} que usa PhysiQ no tiene saldo o no está activa. Avisa al administrador de PhysiQ.` },
  { re: /api[ _-]?key|x-api-key|authentication|unauthori[sz]ed|\b401\b|permission/i,
    texto: s => `La clave de ${s} que usa PhysiQ no es válida. Avisa al administrador de PhysiQ.` },
  { re: /rate limit|too many requests|overloaded|\b429\b|\b529\b/i,
    texto: s => `${s} está saturado ahora mismo. Inténtalo de nuevo en unos minutos.` },
  { re: /file|format|too short|too large|content size|decode|unsupported|corrupt/i, soloWhisper: true,
    texto: () => 'El audio no se ha podido procesar: formato no admitido, demasiado corto o demasiado grande.' },
  { re: /\b50[0234]\b|server error|bad gateway|unavailable|timed? ?out|timeout/i,
    texto: s => `${s} no responde ahora mismo. Inténtalo más tarde.` },
];

export function errorLegible(mensaje) {
  const original = String(mensaje || '').trim();
  const m = original.match(/^(Whisper|Claude(?: \(docs\))?):\s*([\s\S]*)$/);
  if (!m) return { texto: original || 'No se ha podido generar el informe.', original: '', servicio: null, sinAudio: false };
  const servicio = m[1] === 'Whisper' ? 'whisper' : 'claude';
  const detalle = m[2];
  const nombre = servicio === 'whisper' ? 'OpenAI (transcripción)' : 'Anthropic (redacción)';
  const familia = FAMILIAS_ERROR.find(f => f.re.test(detalle) && (!f.soloWhisper || servicio === 'whisper'));
  const texto = familia
    ? familia.texto(nombre)
    : servicio === 'whisper' ? 'No se ha podido transcribir el audio (OpenAI).' : 'No se ha podido redactar el informe (Anthropic).';
  return { texto, original, servicio, sinAudio: servicio === 'whisper' };
}
