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
//     redondeado, el gesto testigo como medida de referencia (no test; desde la
//     sexta revisión no va: sin valor solo producía una frase vacía) y las
//     pruebas de una hipótesis «Derivar» como comprobaciones que no la descartan.
//   · Paciente posquirúrgico (docs/posquirurgico.md): bloque «Cirugía» (payload
//     `cq`), plan supeditado al protocolo del cirujano, y las hipótesis
//     «Derivar» marcadas «ya diagnosticada y tratada» (`dt`) no se derivan.
//     La hipótesis posquirúrgica genérica (`pq: true` en `h[]`) es la condición
//     de salud, con el protocolo del cirujano como pauta, y con Post-quirúrgico
//     cualquier hipótesis puede ir marcada «tratada con la cirugía» (`dt`).
//   · Cuarta revisión (hombro posquirúrgico): edad, sexo y lado solo si constan
//     (inventó «43 años», «varón», «hombro derecho»), ni nombre ni fecha en el
//     texto, una derivación que el fisioterapeuta descarta no se menciona, «No
//     sé» ni como «desconoce», síntomas fuera de Limitaciones, un cribado
//     negativo no «descarta», y Coherencia sin nombrar los tests.
//   · Quinta revisión (hombro posquirúrgico, con y sin edad/lado/motivo): sin
//     fisiopatología ni especulación que no estén en los datos, ejemplos
//     negativos en Limitaciones, las subsecciones opcionales sin «no se dispone
//     de información», y el criterio de reevaluación de la pauta solo en
//     Seguimiento aunque venga dentro del texto de la pauta.
//   · Sexta revisión (hombro posquirúrgico con la tarjeta Cirugía): el
//     formulario previo llega agrupado por la sección del informe en la que va
//     cada respuesta (grupo `ia` del esquema) y sin «No sé» (la regla sola no
//     bastaba: seguía en Limitaciones y negando lo que no sabía), un protocolo
//     verbal no se pone en duda, ni secuelas ni «fases», ni frases de «no se
//     dispone de…», y el gesto testigo fuera (no lleva valor).
//   · Séptima revisión (el mismo caso): indicaciones de Movilidad y Pruebas
//     Clínicas reescritas (invitaban a «no se dispone de mediciones» y a
//     «descartar»), ni secuelas ni evolución esperable en ninguna forma, y las
//     filas del formulario con `iaTexto` llegan con su nombre clínico (tradujo
//     «dedos doblados hacia la palma» como «dedos en resorte»).
//   · Octava revisión (ficha breve, rodilla en modo breve): en la ficha, ni
//     nombre ni fecha en el texto; fuera la regla «lo no explorado dilo una
//     vez» (invitaba a «no se realizó goniometría…»); en modo breve, decir una
//     vez que es breve y qué queda pendiente (dijo «cribado negativo» con un
//     cribado solo por embudo); códigos CIF solo b y d (puso e1101,
//     «medicamentos», al aumento del entrenamiento); reparto de palabras por
//     sección (dio ~740 de 550); y sexo, nuevo campo opcional de la fase 1
//     (deducía «sentada», «la paciente» del nombre).
//   · Novena revisión (la misma ficha): códigos CIF de una lista cerrada
//     (CODIGOS_CIF; puso d4103 «sentarse» a las cuclillas) y PALABRAS_FICHA
//     de 550 a 700 (con 550 salían ~700 igualmente, sin relleno).
//   · Décima revisión (hombro posquirúrgico con audio, Pedro): discrepancias
//     también cuando se dicen con otras palabras (escribió «niega parestesias»
//     y «describe parestesias» en frases distintas), una clasificación que
//     prevalece no borra lo referido (omitió el miedo a que se mueva el clavo),
//     cada indicación a quien la dio (atribuyó al cirujano el consejo de la bici
//     del fisio), la cirugía y su protocolo una sola vez y fuera de Factores
//     Ambientales, el pronóstico tampoco para interpretar los tests, y sin
//     coordinación con el cirujano inventada en el seguimiento.
//   · Undécima revisión (Pedro, 2.ª grabación): copió los ejemplos del prompt
//     como contenido (inventó «despertares ocasionales al girarse en la cama»,
//     el ejemplo de Lucía), así que los ejemplos son de otra región y una regla
//     dice que solo muestran la forma; Condición de Salud con cirugía solo con
//     el diagnóstico (movió Intervención Quirúrgica y Cribado de Seguridad a la
//     primera sección y repitió fecha y técnica), orden de la estructura, la
//     restricción del cirujano no se repite en el plan, sin «practica… de forma
//     habitual» deducido, y el bloque «Recorrido de la exploración» pasa a
//     «Hallazgos de la exploración» (lo citaba: «el recorrido de la exploración
//     confirmó…»), con los de movilidad solo en Movilidad.
//   · Duodécima revisión (Andrea, lumbar, sin sexo registrado): dedujo el
//     género del nombre («sentada», «la paciente»; «sentada» era justo el
//     ejemplo negativo del prompt), así que el bloque de datos dice «Sexo: no
//     consta» y la regla ya no lleva ejemplos con género; un test con «o»
//     («dolorosa o con menos movilidad») se leyó como «y»; reconcilió dos picos
//     de dolor cambiando la fecha; negativos en Limitaciones; el signo
//     comparable repetido en Movilidad (ahora «[solo si…]»), y un diferencial
//     no pedido («más que neurógeno»).
//   · Decimotercera revisión (Carmen, tobillo posquirúrgico sin protocolo,
//     modo breve, ficha breve con audio): desarrolló «KTW» como un test que no
//     existe (regla de siglas; el test se llama ahora «KTW (rodilla a la
//     pared)»), dijo «pendiente de confirmar con el cirujano» cuatro veces (la
//     lista de pendientes de modo breve ya no lo trae cuando hay cirugía), llamó
//     «variable de control» a la ventana de recuperación (las notas del plan
//     van con etiquetas neutras), «en la conversación», un síntoma atribuido a
//     un mecanismo, lo pendiente repetido fuera de su frase, y el cribado por
//     embudo ya no sale como «Negativo».
//   · Decimocuarta revisión (Javier, cervical, derivación urgente, riesgo
//     psicosocial alto): con la derivación urgente escribió un plan entero
//     «una vez descartado…» con mmHg y segundos (con `ur` ya no van las
//     pautas, solo la escala), nombró «hemorragia subaracnoidea» y «patología
//     intracraneal», repitió la derivación en cribado, coherencia y
//     seguimiento, clasificó mal el IMC («normopeso» con 25,2) y escribió
//     «ansiedad», que venía de la etiqueta del ítem psicosocial (las respuestas
//     detalladas van ahora sin etiquetas diagnósticas).
//   · Decimoquinta revisión (Daniel, cadera, dolor inguinal del psoas, con
//     audio): leyó «supra o infrainguinal» como las dos (los tests con «o»
//     positivos llevan ahora en los datos «positivo si se cumple al menos una»),
//     usó el pronóstico como plan («ecografía para descartar bursitis o
//     comunicación de la vaina», vuelta al deporte con déficit de fuerza
//     <10–20 %; pronóstico y «Cuándo reconsiderar» van marcados como contexto
//     para el fisioterapeuta y la imagen se recoge solo como la indicó él),
//     convirtió «hace tres semanas» en «tres semanas después del inicio»,
//     inventó una derivación y volvió a llenar Limitaciones de «no refiere
//     limitación al…» (las matrices de actividades llegan ya sin los «No»).

import { ladoTexto } from './region.js';

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

// Región con el lado afectado si se indicó (payload `la`): «Hombro (derecho)».
export function regionTexto(data, nombreRegion = r => r) {
  if (!data?.r) return '—';
  const n = nombreRegion ? nombreRegion(data.r) : data.r;
  return data.la ? `${n} (${ladoTexto(data.r, data.la)})` : n;
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
    .map(h => `  · ${limpiarEtiqueta(h.name)}${h.pq
      ? ' (la cirugía es la condición de salud, no una hipótesis por confirmar)'
      : h.dt ? ' (diagnóstico ya confirmado y tratado por el médico: es un antecedente)' : ''}`)
    .join('\n');
  const brText = data.br?.length > 0
    ? data.br.map(s => `  ⚠️ ${s}`).join('\n')
    : '  Negativas';
  const sqText = data.sq?.length > 0
    ? '\nAlertas sistémicas positivas:\n' + data.sq.map(s => `  · ${s}`).join('\n')
    : '';

  const extra = [];
  if (data.cq) extra.push(bloqueCirugia(data.cq));
  if (data.ur?.length) extra.push(`DERIVACIÓN URGENTE indicada en el cribado (debe constar en el informe):\n${data.ur.map(s => `  · ${s}`).join('\n')}`);
  if (data.dv?.length) extra.push(`Derivación médica indicada en la exploración (debe constar en el informe):\n${data.dv.map(s => `  · ${s}`).join('\n')}`);
  const sv = signosVitalesTexto(data.sv, data.an);
  if (sv) extra.push(`Signos vitales y antropometría: ${sv}`);
  // Con datos ampliados, el formulario va agrupado por sección y sin «No sé»
  // (bloqueFormulario); sin ellos, el `fp` del payload tal cual.
  if (ampliado?.formulario) {
    const f = bloqueFormulario(ampliado.formulario);
    if (f) extra.push(f);
  } else if (data.fp?.length) extra.push(`Lo que refiere el paciente antes de la consulta (pregunta → respuesta):\n${data.fp.map(x => `  · ${x.q} → ${x.a}`).join('\n')}`);
  // Etiquetas neutras, no los nombres de los campos: con «Ventana de
  // recuperación: …» el informe escribió «la variable de control…»
  const notas = [['Para dosificar la carga', data.pn?.variableControl], ['Recuperación entre sesiones', data.pn?.ventanaRecuperacion], ['Cuándo hacer los ejercicios', data.pn?.anclajeHabito]]
    .filter(([, v]) => (v || '').trim());
  if (notas.length) extra.push(`Indicaciones del fisioterapeuta para el plan:\n${notas.map(([k, v]) => `  · ${k}: ${v.trim()}`).join('\n')}`);
  extra.push(...bloquesAmpliados(ampliado, { urgente: !!data.ur?.length }));
  if (data.md === 'breve') {
    // Con cirugía, «restricciones pendientes de confirmar con el cirujano» ya
    // tiene su sitio (al principio del plan, regla del paciente operado): en la
    // lista salía otra vez y el informe lo dijo cuatro veces
    const pe = (data.pe || []).filter(s => !(data.cq && /cirujano/i.test(s)));
    extra.push('Tipo de valoración: inicial breve (consulta corta). Las hipótesis sin tests de confirmación son hipótesis de trabajo, no diagnósticos.'
      + ' Dilo UNA vez en el informe, en una frase, junto con lo que queda pendiente de completar en la próxima sesión (la lista de abajo, en lenguaje clínico); lo pendiente se dice solo en esa frase, sin repetirlo en otras secciones («no se realizaron tests…»); no presentes como completo lo que está pendiente (p. ej., si el cribado sistémico fue abreviado, no escribas que el cribado sistémico fue negativo sin más).'
      + (pe.length ? `\nPendiente de completar:\n${pe.map(s => `  · ${s}`).join('\n')}` : ''));
  }
  // 8: el cribado solo por embudo no es un «Negativo» sin más
  const embudo = data.md === 'breve' && (data.pe || []).some(s => /embudo/i.test(s));

  return `## DATOS DE VALORACIÓN ESTRUCTURADA (PhysiQ-Assessment)
NOTA: estos datos proceden de una valoración clínica estructurada. Los resultados y clasificaciones del fisioterapeuta son la fuente prioritaria; para lo que refiere el paciente, sigue la regla de discrepancias de las instrucciones.
Paciente: ${data.p || '—'}${ampliado?.edad != null ? ` · Edad: ${ampliado.edad} años` : ''}${ampliado?.sexo ? ` · Sexo: ${ampliado.sexo.toLowerCase()}` : ampliado ? ` · Sexo: no consta (no lo deduzcas del nombre; redacta sin marcar el género)` : ''} · Región: ${regionTexto(data, nombreRegion)} · Fecha: ${data.d || '—'}
Motivo de consulta: ${data.mo || '—'}
Mecanismo: ${data.me || '—'} · Cronología: ${data.cr || '—'}
NRS: ${data.nr ?? '—'}/10
Irritabilidad: ${data.ir || '—'} · Naturaleza: ${data.na || '—'}
Riesgo psicosocial: ${data.rp || '—'}
Banderas rojas:
${brText}
Cribado sistémico: ${data.si ? '⚠️ Positivo' : embudo ? 'sin hallazgos en el embudo (cribado abreviado)' : 'Negativo'}${sqText}

Hipótesis de trabajo del fisioterapeuta (de mayor a menor apoyo):
${hyps || '  (sin hipótesis registradas)'}${extra.length ? '\n\n' + extra.join('\n\n') : ''}

---`;
}

// ── Lo que refiere el paciente antes de la consulta, por grupos ─────────────
// Cada pregunta del formulario lleva en su esquema el grupo `ia` y cada grupo
// dice a qué sección del informe va: sin esto, los síntomas que refiere o
// niega (fuerza, crujidos, hormigueo…) acababan en «Limitaciones» aunque el
// prompt lo prohibiera con ejemplos. Las respuestas «No sé» ya no llegan.
export const GRUPOS_FORMULARIO = [
  ['historia', 'Inicio, evolución y tratamientos previos (van en Presentación Inicial y Antecedentes, o en Tratamientos Previos)'],
  ['sintomas', 'Síntomas que refiere o niega y cómo se comporta el dolor (van en Dolor, o en Fuerza Muscular si es debilidad)'],
  ['actividades', 'Actividades y posturas que le provocan o aumentan el dolor, o que le cuestan (van en Limitaciones en las Actividades)'],
  ['contexto', 'Salud general, trabajo, deporte y ejercicio (van en Factores Personales, o en Restricciones en la Participación si refiere que le afecta)'],
];
export function bloqueFormulario(items) {
  if (!items?.length) return '';
  const grupos = GRUPOS_FORMULARIO
    .map(([g, titulo]) => [titulo, items.filter(x => x.g === g)])
    .filter(([, xs]) => xs.length)
    .map(([titulo, xs]) => `  ${titulo}:\n${xs.map(x => `    · ${x.q} → ${x.a}`).join('\n')}`);
  return `Lo que refiere el paciente antes de la consulta, agrupado por la sección del informe en la que va cada cosa (pregunta → respuesta):\n${grupos.join('\n')}`;
}

// ── Datos ampliados de las fases (informe-ia.js los reúne del estado) ────────
// No viajan en buildPhysiQPayload() — ese resumen es el contrato con
// physiq-report —, solo en este prompt. Forma:
//   { edad, signoComparable, estabilidad,
//     irritabilidad: { dolor, reposo, movimiento, discapacidad, tolerancia } | null,
//     psico: [{ q, a }], criterios: [{ etiqueta, positivas, total, nota }],
//     arbol: [{ pregunta, respuesta, tratada? }],   tratada: lo que orienta ya está diagnosticado y tratado
//     tests: [{ hipotesis, items: [{ test, resultado, cluster?, pronostico? }] }],
//     formulario: [{ g, q, a }] (g = grupo de GRUPOS_FORMULARIO),
//     pautas: [{ hipotesis, derivar, tratada?, operada?, posquirurgica?, pauta, fuente, pronostico?, prom }] }
// Cada bloque solo aparece si tiene datos.
// urgente: hay una derivación urgente (payload `ur`): el plan es la derivación,
// así que las pautas no van (con ellas escribió un plan con mmHg y segundos
// «una vez descartado…»); solo la escala para el seguimiento.
export function bloquesAmpliados(a, { urgente = false } = {}) {
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
  if (a.arbol?.length) b.push(`Hallazgos de la exploración (pregunta clínica → lo que encontró el fisioterapeuta):\n${a.arbol.map(x => `  · ${limpiarEtiqueta(x.pregunta)} → ${limpiarEtiqueta(x.respuesta)}${x.tratada ? ' (ya diagnosticada y tratada: es un antecedente)' : ''}`).join('\n')}`);
  if (a.tests?.length) {
    // Un test con alternativas en el nombre («dolorosa o con menos movilidad»,
    // «supra o infrainguinal») es positivo con una sola: la regla del prompt
    // no bastó (Andrea: «dolor y restricción»; Daniel: «tanto supra como infrainguinal»)
    const conAlternativas = t => t.resultado === 'positivo' && / o /i.test(limpiarEtiqueta(t.test));
    const item = t => `    · ${limpiarEtiqueta(t.test)}: ${t.resultado}${conAlternativas(t) ? ' (positivo si se cumple al menos una de las alternativas: descríbelo con las mismas palabras, sin afirmar las dos)' : ''}${t.cluster ? ` (parte del cluster «${t.cluster}»)` : ''}${t.pronostico ? ' (regla pronóstica, no diagnóstica)' : ''}`;
    b.push(`Tests de confirmación realizados (solo estos; no hay otros):\n${a.tests.map(h => `  ${limpiarEtiqueta(h.hipotesis)}${h.derivar
      ? ' — comprobaciones de una hipótesis que se deriva: no son tests diagnósticos ni pruebas de imagen, y un resultado negativo no la descarta'
      : ''}:\n${h.items.map(item).join('\n')}`).join('\n')}`);
  }
  if (a.pautas?.length && urgente) {
    const proms = a.pautas.filter(p => p.prom).map(p => `  · ${limpiarEtiqueta(p.hipotesis)}: ${p.prom}`);
    b.push('Plan: derivación urgente. La pauta de fisioterapia se decidirá después de la valoración médica: no propongas tratamiento, técnicas ni dosis, tampoco condicionados («una vez descartado…»).'
      + (proms.length ? `\nEscala recomendada para el seguimiento:\n${proms.join('\n')}` : ''));
  } else if (a.pautas?.length) {
    b.push(`Pauta recomendada por PhysiQ para cada hipótesis (basada en guías; no propongas dosis distintas):\n${a.pautas.map(p => [
      `  ${limpiarEtiqueta(p.hipotesis)}:`,
      p.posquirurgica ? `    · Pauta: ${p.pauta}`
      : p.tratada ? (p.operada
        ? '    · Diagnóstico ya confirmado e intervenido: el plan sigue el protocolo del cirujano.'
        : '    · Diagnóstico ya confirmado y tratado por el médico.')
      : p.derivar ? '    · Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico.' : p.pauta ? `    · Pauta: ${p.pauta}` : '    · Pauta: a criterio del fisioterapeuta (la guía no la fija).',
      p.fuente ? `    · Fuente: ${p.fuente}` : '',
      // Marcados como contexto: sin la marca, el informe convirtió el
      // pronóstico en plan («ecografía para descartar bursitis o comunicación
      // de la vaina», «vuelta al deporte con déficit de fuerza <10–20 %»)
      p.pronostico?.horizonte ? `    · Pronóstico (contexto para el fisioterapeuta: no es plan ni explicación al paciente): ${p.pronostico.horizonte}` : '',
      p.pronostico?.derivacion ? `    · Cuándo reconsiderar o derivar (contexto para el fisioterapeuta: no es plan ni explicación al paciente): ${p.pronostico.derivacion}` : '',
      p.prom ? `    · Escala recomendada para el seguimiento: ${p.prom}` : '',
    ].filter(Boolean).join('\n')).join('\n')}`);
  }
  return b;
}

// Paciente posquirúrgico (payload `cq`, lib/posquirurgico.js): el plan se
// supedita al protocolo del cirujano (regla en REGLAS_COMUNES).
function bloqueCirugia(cq) {
  const fecha = cq.fe ? `${cq.fe}${cq.se != null ? ` (${cq.se} semanas)` : ''}` : cq.se != null ? `hace unas ${cq.se} semanas` : '';
  const conProt = cq.pr === 'Escrito' || cq.pr === 'Verbal';
  return [
    'Cirugía (paciente posquirúrgico):',
    `  · Intervención: ${cq.iv || 'sin detallar'}`,
    fecha ? `  · Fecha: ${fecha}` : '',
    `  · Protocolo del cirujano: ${conProt ? cq.pr.toLowerCase() : 'no hay o no se ha indicado; restricciones pendientes de confirmar con el cirujano'}`,
    cq.re ? `  · Restricciones: ${cq.re}` : '',
    cq.co?.length ? `  · Complicaciones: ${cq.co.join(', ')}` : '',
  ].filter(Boolean).join('\n');
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
  const region = regionTexto(data, nombreRegion);

  return `Eres un fisioterapeuta clínico experto en documentación según el modelo CIF de la OMS y el marco APTA. Genera un informe clínico narrativo, formal e institucional en español, siguiendo la estructura exacta indicada.

PACIENTE: ${data?.p || '—'} | Fecha: ${data?.d || '—'} | Región valorada: ${region}

${clinicalCtx ? clinicalCtx + '\n\n' : ''}${romCtx ? romCtx + '\n\n' : ''}TRANSCRIPCIÓN DE LA SESIÓN:
{{TRANSCRIPT}}

INSTRUCCIONES CRÍTICAS — LEE Y CUMPLE TODAS:

1. **NO GENERES NINGÚN TÍTULO NI SECCIÓN INICIAL DE IDENTIFICACIÓN**. Específicamente PROHIBIDO:
   - NO escribas "INFORME CLÍNICO DE FISIOTERAPIA" ni similar.
   - NO incluyas un bloque inicial con "Paciente:", "Fecha:", "Sesión número:", "Fisioterapeuta:" o cualquier ficha de identificación.
   - NO escribas el nombre del paciente ni la fecha en ningún punto del texto, tampoco en la primera frase.
   - El nombre del paciente, la fecha y los datos identificativos se añaden aparte, fuera de tu texto. Repetirlos es un error grave.
   - Tu respuesta DEBE empezar DIRECTAMENTE con "## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES" sin ningún texto previo.

2. Usa prosa clínica continua y formal, no listas escuetas. Tono de informe profesional para enviar al paciente o equipo médico.
3. NO uses ** para negrita ni símbolos markdown, salvo en tablas markdown estándar.
4. Tablas: cuando haya datos numéricos cuantificables (ROM, fuerza, escalas), genera tablas markdown estándar con sintaxis | columna | columna |. Si no hay datos suficientes, omite la tabla y describe en prosa.
5. Las subsecciones marcadas «[solo si…]» se omiten por completo, título incluido, cuando no hay datos para ellas. No escribas subsecciones ni frases para decir que algo no se hizo, no se midió o «no se dispone de…» (p. ej. «no se dispone de mediciones goniométricas»): lo que no consta, simplemente no se menciona.
6. Usa la terminología CIF en la prosa (funciones, estructuras, actividades, participación, factores contextuales), sin códigos alfanuméricos.
7. ${conAudio
    ? 'La transcripción complementa los datos estructurados.'
    : 'No hay transcripción de la sesión: redacta el informe exclusivamente con los datos de la valoración estructurada.'} No inventes mediciones, pruebas, escalas ni datos personales que no aparezcan en los datos recibidos.
8. ${reglaDerivacion('CONCLUSIONES Y PLAN DE TRATAMIENTO', false)}
${REGLAS_COMUNES}${hasHypotheses ? `
9. En la sección CONCLUSIONES Y PLAN DE TRATAMIENTO incluye la subsección "### Coherencia con hipótesis de valoración". En dos o tres frases, contrasta los hallazgos (tests realizados, hallazgos de la exploración y, si la hay, la transcripción) con las hipótesis recibidas e indica si los refuerzan, matizan o si existe alguna discrepancia relevante, sin nombrar los tests (ya están en Pruebas Clínicas). Si las comprobaciones de una hipótesis que se deriva salieron negativas, di que la exploración no la apoya pero no la descarta (por eso se deriva); no digas que los hallazgos la refuerzan. No propongas hipótesis nuevas en esta subsección.
10. Si en la transcripción aparecen hallazgos clínicos explícitos (tests especiales, signos, síntomas objetivos) que sugieran condiciones no cubiertas por las hipótesis recibidas, inclúyelos en "### Hipótesis adicionales a valorar", citando el hallazgo exacto que justifica cada una. Limita el alcance a la región anatómica del contexto estructurado. Omite esta subsección si no hay evidencia explícita.` : ''}

ESTRUCTURA OBLIGATORIA — empieza DIRECTAMENTE con la primera sección, sin títulos previos. Cada subsección va dentro de su sección y en este orden (p. ej. Intervención Quirúrgica y Cribado de Seguridad van dentro de HISTORIA CLÍNICA Y EVOLUCIÓN); omitir una no cambia el sitio de las demás:

## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES
[Dos o tres frases que sitúen el caso (qué región y desde cuándo), sin detalles de la cirugía si la hay, sin edad ni sexo, que van solo en Factores Personales (p. ej. «Consulta por dolor anterior en la rodilla izquierda de unos dos meses de evolución…»). No expliques qué es la CIF ni el modelo biopsicosocial]

### Condición de Salud (Diagnóstico Médico)
[Solo si los datos o la consulta mencionan un diagnóstico médico, una cirugía o una prueba de imagen: recógelo como antecedente. Con cirugía, solo el diagnóstico que motivó la intervención (p. ej. «fractura de tobillo intervenida quirúrgicamente»), sin fecha, técnica ni protocolo. Si no consta ninguno, omite esta subsección sin comentarlo]

### Factores Personales
[Edad y sexo solo si constan en los datos; actividad física y laboral, comorbilidades, medicación, signos vitales y antropometría si constan, y el riesgo psicosocial]

### Factores Ambientales
[Solo si hay datos de domicilio, apoyo familiar, trabajo o ayudas técnicas; la cirugía y las restricciones del cirujano no van aquí]

## HISTORIA CLÍNICA Y EVOLUCIÓN

### Presentación Inicial y Antecedentes
[Mecanismo, inicio, evolución cronológica y episodios previos. La intensidad y la irritabilidad van en Dolor]

### Intervención Quirúrgica
[Solo si hay cirugía: fecha, protocolo del cirujano con sus restricciones tal como constan, complicaciones y evolución posquirúrgica, sin repetir lo dicho en Condición de Salud]

### Tratamientos Previos
[Solo si los hay: qué ha probado y con qué resultado]

### Cribado de Seguridad
[Banderas rojas y cribado sistémico, en una o dos frases: un resultado negativo «no muestra hallazgos que sugieran…», nunca «descarta»]

## EVALUACIÓN DE FUNCIONES Y ESTRUCTURAS CORPORALES

### Dolor
[Intensidad, irritabilidad, naturaleza y signo comparable. Las actividades que provocan el dolor van en Limitaciones en las Actividades]

### Movilidad
[Solo si hay hallazgos de movilidad distintos del signo comparable (que va en Dolor): movilidad activa y pasiva; si hay mediciones, TABLA markdown con columnas: Articulación | Movimiento | Rango (Izq/Dcha) | Asimetría. Si no las hay, describe los hallazgos sin mencionar que faltan mediciones]

### Fuerza Muscular
[Solo si se exploró o el paciente refiere debilidad; si hay datos numéricos, TABLA markdown con columnas: Grupo muscular | Movimiento | Fuerza (Izq/Dcha) | Asimetría]

### Pruebas Clínicas
[Solo si se realizaron: los hallazgos de la exploración y los tests, cada uno una vez, agrupados por la hipótesis que exploran; los hallazgos de movilidad van solo en Movilidad, no se repiten aquí. Si la exploración de otra región (p. ej. la columna cervical) no reproduce los síntomas, dilo aquí y solo aquí, como «no muestra hallazgos que sugieran…», sin nombrar estructuras ni síndromes que no estén en los datos]

## ANÁLISIS DEL FUNCIONAMIENTO: LIMITACIONES EN LA ACTIVIDAD Y RESTRICCIONES EN LA PARTICIPACIÓN

### Limitaciones en las Actividades
[Solo las actividades que refiere dolorosas o limitadas, agrupadas en una o dos frases; lo que no le empeora no se enumera aquí (si es relevante, va en Dolor, en una frase). Si aquí aparece fuerza, crujidos, bloqueos, enganches, hormigueo, «brazo muerto», inestabilidad, luxaciones o el cuello, está mal: los síntomas que refiere o niega van en Dolor, en una frase, y lo cervical en Pruebas Clínicas]

### Restricciones en la Participación
[Solo si refiere afectación del trabajo, el ocio, el deporte o la vida social: describe lo que refiere, sin suponer cómo podría afectarle]

## CONCLUSIONES Y PLAN DE TRATAMIENTO
[Si hay derivación, empieza por ella. Después, síntesis clínica con el problema principal y el enfoque terapéutico, en prosa, sin volver a enumerar los tests. El criterio de reevaluación o derivación por falta de mejoría (p. ej. «si no mejora en 12 semanas») va en Seguimiento, aunque venga dentro del texto de la pauta]${hasHypotheses ? `

### Coherencia con hipótesis de valoración
[Dos o tres frases: si los hallazgos refuerzan, matizan o contradicen las hipótesis recibidas, sin nombrar los tests ni proponer diagnósticos nuevos]

### Hipótesis adicionales a valorar
[Solo si la transcripción contiene hallazgos explícitos que lo justifiquen: lista cada hipótesis adicional citando el hallazgo exacto. Omite si no hay evidencia explícita]` : ''}

## SEGUIMIENTO FUNCIONAL
[Escala recomendada para medir la evolución y cuándo reevaluar o reconsiderar la derivación por falta de mejoría (aquí y solo aquí), sin repetir el plan. Si no hay datos para ello, escribir: "Pendiente de reevaluaciones programadas."]

PRESUPUESTO DE EXTENSIÓN: el informe completo no debe superar las ${PALABRAS_INFORME} palabras en total. Ajusta la profundidad de cada sección para que el informe esté completo y bien cerrado dentro de ese límite. No trunces a mitad de sección.

RECORDATORIO FINAL: tu respuesta DEBE empezar literalmente con la cadena "## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES" como primer texto, sin nada antes.`;
}

// Reglas que comparten las dos plantillas (narrativa y ficha breve).
const REGLAS_COMUNES = `- Los ejemplos («p. ej.») de estas instrucciones solo muestran la forma de escribir: nunca copies su contenido ni añadas un síntoma, un dato o una frase que no conste en los datos o en la consulta.
- Siglas: escríbelas tal como vienen en los datos; no desarrolles una sigla que los datos no desarrollan (desarrolló «KTW» como un test inexistente).
- Tests: describe solo los tests realizados con su resultado; no menciones tests no realizados uno a uno. Si el nombre de un test da alternativas («dolorosa o con menos movilidad»), descríbelo con esas mismas palabras: no afirmes las dos.
- Reglas pronósticas (marcadas «regla pronóstica, no diagnóstica», p. ej. la regla de Flynn): predicen la respuesta a un tratamiento. Preséntalas así y nunca las uses para reforzar ni descartar una hipótesis diagnóstica.
- Lo que no consta (mediciones, fuerza, escalas, pruebas no realizadas…) no se menciona: no escribas que no se hizo, no se midió o no se dispone de ello.
- Discrepancias: los resultados y clasificaciones del fisioterapeuta (tests, NRS, irritabilidad, banderas, hipótesis) prevalecen sobre lo que se diga en la conversación. Si lo que refiere el paciente cambia entre lo que contestó antes de la consulta y lo que cuenta en ella, recoge las dos versiones UNA vez, en una sola frase neutra y en la sección que le corresponde (un síntoma, en Dolor), sin decir de dónde sale cada una (p. ej. «refiere que el dolor no baja a la pierna, aunque también describe alguna punzada en la nalga al agacharse»). También es una discrepancia cuando lo cuenta con otras palabras (p. ej. «rigidez por la mañana: No» frente a «al levantarme me cuesta arrancar»: «no refiere rigidez matutina, aunque al levantarse le cuesta arrancar los primeros minutos»). No elijas tú una de las dos, no las escribas en lugares distintos como si no chocaran, no cambies fechas ni circunstancias para que encajen como si fueran dos episodios distintos, y no interpretes ni justifiques la discrepancia.
- Lo que solo consta en una de las dos (antes de la consulta o en ella) no es una discrepancia: recógelo tal cual. No escribas que algo «no se menciona», «no se confirma» o «no se recoge» en la consulta, ni lo pongas en condicional («provocaría»).
- Que prevalezca una clasificación del fisioterapeuta (p. ej. riesgo psicosocial bajo) no borra lo que refiere el paciente: mantén la clasificación tal cual y recoge lo referido UNA vez, como algo que refiere (p. ej. «refiere cierto temor a que el tobillo vuelva a fallar al bajar escaleras»), sin reclasificar ni interpretar.
- Atribuye cada indicación a quien la dio: lo que indica el fisioterapeuta en la consulta es una indicación del plan, no del cirujano ni del médico, y viceversa. No escribas que algo «ya se le había indicado» si no consta, ni presentes un consejo (p. ej. «puede hacer bicicleta estática») como algo que el paciente ya hace.
- Si en la consulta el paciente habla de otra zona u otro lado (p. ej. molestias en la otra rodilla), menciónalo UNA vez como algo que refiere el paciente («refiere también…»), en la sección que le corresponde y nunca en Pruebas Clínicas, sin cambiar la región ni el lado valorados. No le añadas plan, seguimiento, prevención ni medidas que no consten en los datos o en la consulta.
- No menciones de dónde sale cada dato: nada de «transcripción», «grabación», «formulario», «cuestionario», «PhysiQ», «datos estructurados», «datos recibidos», «razonamiento clínico», «recorrido de la exploración», «en la conversación», «en consulta», «árbol de decisión», «regla de decisión», «notas del plan» ni el nombre de sus campos («variable de control», «ventana de recuperación», «anclaje de hábito»); usa su contenido sin decir de dónde viene. Escribe «refiere» o «en la exploración»; tampoco contrapongas «inicialmente» y «en consulta».
- Hipótesis: no cites cocientes de probabilidad (LR), pesos, puntuaciones ni recuentos de criterios o hallazgos; describe qué tests apoyan o no cada hipótesis.
- Lo que refiere el paciente antes de la consulta: resúmelo en prosa, con los negativos relevantes en una frase. No lo transcribas pregunta por pregunta y no escribas «contestó».
- Respuestas «No sé» o «No sabría decir»: no las menciones de ninguna forma; ni como negación («no refiere…», «niega…») ni como desconocimiento («desconoce si…»).
- Datos personales: edad, sexo y lado afectado (derecho, izquierdo) solo si constan en los datos; nunca los deduzcas del nombre ni de otro dato. Si consta el sexo, concuerda el género con él; si no consta, redacta sin marcar el género, ni en los sustantivos ni en los adjetivos (p. ej. «refiere dolor al permanecer en sedestación», «la persona atendida» o simplemente «refiere…»).
- Un cribado, una bandera roja o un test negativos «no muestran hallazgos que sugieran…»; no escribas que «descartan» nada.
- Los tests y la exploración «apoyan» una hipótesis o «son compatibles» con ella; no escribas que la «confirman» ni que establecen el diagnóstico.
- El pronóstico y «Cuándo reconsiderar o derivar» son contexto para el fisioterapeuta: no los conviertas en acciones del plan, criterios de vuelta a la actividad ni explicaciones al paciente («se informa a la paciente de…») que no consten, y no los uses para interpretar los hallazgos o los tests (p. ej. «la lesión aislada es infrecuente» no va junto a los resultados de los tests). En Seguimiento, como mucho, el criterio de no mejoría que figure en ellos o en la pauta.
- Pruebas de imagen y derivaciones: recógelas solo como las indicó el fisioterapeuta, sin añadir qué se busca con ellas («para descartar…») ni derivaciones o pruebas que nadie indicó.
- Tiempos: «hace X» se refiere al día de la consulta; no lo conviertas en «X después del inicio» ni en otra fecha (con «me miró hace tres semanas» escribió «tres semanas después del inicio»).
- No deduzcas la frecuencia ni la regularidad de una actividad («practica… de forma habitual», «regular») cuando solo consta cuál es, ni desde cuándo la dejó.
- No afirmes negativos que no estén en los datos: si un síntoma no aparece (p. ej. el dolor nocturno), no lo menciones.
- No atribuyas un síntoma a un mecanismo o a un proceso que no conste (p. ej. «la rigidez matutina sugiere un componente degenerativo»): descríbelo tal como lo refiere.
- Las cifras (IMC, tensión arterial, frecuencia cardíaca…) se dan tal cual, sin clasificarlas («normopeso», «hipertensión»…) si los datos no lo hacen.
- No añadas diagnósticos diferenciales que no estén en los datos: nombra la sospecha que consta (p. ej. «sospecha de claudicación vascular») sin contraponerla a otras («más que neurógena»).
- No añadas causas, mecanismos, secuelas ni fases de curación o de recuperación que no estén en los datos (p. ej. inmovilización, adherencias capsulares, consolidación ósea, «fase de consolidación», reparación tisular, desuso); tampoco atribuyas los hallazgos a secuelas ni a la evolución esperable de la lesión o de la cirugía, ni especules sobre cómo podría afectarle una actividad que no refiere limitada. Describe lo encontrado; la interpretación se limita a relacionar hallazgos que sí constan.
- Cada recomendación del plan aparece una sola vez.
- Cada dato aparece una sola vez, en la sección que le corresponde; no remitas a otras secciones («como se indicó…»).
- No crees secciones ni subsecciones que no estén en la estructura, ni cambies ninguna de sección o de orden.
- Plan: si los datos incluyen una pauta recomendada por PhysiQ, basa el plan en ella sin proponer dosis, series ni volúmenes distintos; si dice «Derivar», el plan es la derivación.
- Seguimiento: para medir la evolución, usa la escala recomendada de cada hipótesis cuando la haya. No añadas coordinación, comunicación ni reevaluaciones con otros profesionales (cirujano, médico, equipo quirúrgico) que no consten.
- Paciente operado (si los datos incluyen «Cirugía»): el plan se supedita al protocolo y a las restricciones del cirujano; no propongas nada que las contradiga, y las pautas de PhysiQ solo valen si son compatibles con ellas. Si no hay protocolo, di UNA vez, al principio del plan, que las restricciones están pendientes de confirmar con el cirujano, y no lo repitas en ninguna otra parte (ni en la presentación, ni en lo pendiente, ni en los objetivos). Si hay protocolo (escrito o verbal), sigue sus restricciones tal como constan: no pidas confirmarlo con el cirujano ni lo matices porque sea verbal. La intervención (técnica y fecha) y el protocolo con sus restricciones se describen UNA sola vez; en el plan basta con una frase que lo supedite al protocolo del cirujano, sin volver a enunciar las restricciones. La cirugía y sus restricciones no son factores ambientales.
- Hipótesis con diagnóstico ya confirmado y tratado: preséntala como antecedente (en Condición de Salud), no como sospecha ni como hipótesis de trabajo. No la derives y no escribas que «no se deriva» o que «no procede derivar»: simplemente no hables de derivación por ella.`;

// Derivaciones: una sola vez, al principio de la sección del plan. Con una
// derivación no urgente el informe no decide si se espera a la valoración
// médica: esa decisión es del fisioterapeuta.
function reglaDerivacion(seccion, conSeguimiento = true) {
  return `Derivaciones: si los datos indican una derivación urgente o una derivación médica, hazla constar de forma explícita UNA sola vez, al principio de ${seccion}, con su motivo (en los hallazgos puedes describir el signo que la motiva, sin repetir la derivación). Si es urgente o la pauta de la hipótesis dice «Derivar», el plan es la derivación. Con una derivación urgente no escribas ningún plan de tratamiento, técnica ni dosis, tampoco para después («una vez descartado…»); como mucho, que la valoración de fisioterapia se retomará tras la valoración médica, si el fisioterapeuta lo indicó. No repitas la derivación en el cribado (describe solo el signo), en la coherencia ni en el seguimiento. No nombres los diagnósticos que el médico deberá descartar ni ningún diagnóstico que no esté en los datos. Una hipótesis cuya pauta dice «Derivar» (fractura, luxación, rotura…) y no está marcada como ya diagnosticada y tratada se deriva aunque sus tests clínicos hayan salido negativos, porque no la descartan: nómbrala como sospecha pendiente de confirmar por el médico, salvo que el fisioterapeuta indique otra cosa en consulta o en las notas del plan; si indica que no procede (p. ej. la lesión ya está diagnosticada y tratada), no menciones esa derivación en ningún punto del informe. Si es una derivación médica no urgente, presenta igualmente el plan de fisioterapia propuesto y no decidas por tu cuenta si se espera a la valoración médica o se trata en paralelo, salvo que el fisioterapeuta lo indique en consulta o en las notas del plan. Orden de ${seccion}: derivación (si la hay) y después plan y pauta${conSeguimiento ? ', y al final el seguimiento' : ''}.`;
}

// ── Ficha breve ───────────────────────────────────────────────────────────────
// Adaptada de la plantilla «brief» de physiq-report (buildPrompt(), rama
// brief): tres secciones en prosa, ~550 palabras. Mismas diferencias que la
// narrativa (identificación aparte, sin audio, datos ampliados, reglas comunes).
export const PALABRAS_FICHA = 700;      // con 550 daba ~700 siempre: es lo que cabe con una pauta de guía larga

// Códigos CIF que la ficha puede usar (OMS, CIF 2001): lista cerrada para
// fisioterapia musculoesquelética, porque con «solo los que correspondan sin
// duda» seguía equivocándose (e1101 «medicamentos» por el entrenamiento,
// d4103 «sentarse» por las cuclillas). Todos comprobados contra el buscador
// de la OMS (apps.who.int/classifications/icfbrowser, 2026-10). Revisar con
// el clínico al cambiarla.
export const CODIGOS_CIF = [
  ['b134', 'funciones del sueño'],
  ['b2401', 'mareo'],
  ['b265', 'funciones táctiles'],
  ['b28010', 'dolor en cabeza y cuello'],
  ['b28013', 'dolor de espalda'],
  ['b28014', 'dolor en miembro superior'],
  ['b28015', 'dolor en miembro inferior'],
  ['b28016', 'dolor en articulaciones'],
  ['b7100', 'movilidad de una sola articulación'],
  ['b7101', 'movilidad de varias articulaciones'],
  ['b7150', 'estabilidad de una sola articulación'],
  ['b7300', 'fuerza de músculos aislados y grupos musculares'],
  ['b7301', 'fuerza de los músculos de una extremidad'],
  ['b740', 'resistencia muscular'],
  ['b770', 'funciones relacionadas con el patrón de la marcha'],
  ['b7800', 'sensación de rigidez muscular'],
  ['d4101', 'ponerse en cuclillas'],
  ['d4102', 'ponerse de rodillas'],
  ['d4103', 'sentarse'],
  ['d4104', 'ponerse de pie'],
  ['d4105', 'inclinarse'],
  ['d4151', 'permanecer en cuclillas'],
  ['d4153', 'permanecer sentado'],
  ['d4154', 'permanecer de pie'],
  ['d4300', 'levantar objetos'],
  ['d440', 'uso fino de la mano'],
  ['d4452', 'alcanzar'],
  ['d4454', 'lanzar'],
  ['d4500', 'andar distancias cortas'],
  ['d4501', 'andar distancias largas'],
  ['d4502', 'andar sobre diferentes superficies'],
  ['d4551', 'trepar (incluye subir y bajar escaleras)'],
  ['d4552', 'correr'],
  ['d4553', 'saltar'],
  ['d4554', 'nadar'],
  ['d4751', 'conducir vehículos con motor'],
  ['d510', 'lavarse'],
  ['d5202', 'cuidado del pelo'],
  ['d540', 'vestirse'],
  ['d640', 'realizar los quehaceres de la casa'],
  ['d850', 'trabajo remunerado'],
  ['d9201', 'deportes'],
];
export const MAX_TOKENS_FICHA = 2500;   // holgado: ver MAX_TOKENS_INFORME

export function buildFichaBrevePrompt(data, { conAudio, nombreRegion, ampliado } = {}) {
  const clinicalCtx = contextoValoracion(data, nombreRegion, ampliado);
  const romCtx = contextoROM(data?.rom);
  const hasHypotheses = (data?.h || []).length > 0;
  const region = regionTexto(data, nombreRegion);

  return `Eres un fisioterapeuta clínico experto en documentación CIF-APTA.
Genera un informe clínico breve en español a partir de los datos de la valoración${conAudio ? ' y de la transcripción de la sesión' : ''}. El informe debe estar escrito en prosa clínica continua, sin listas de ítems, y no superar las ${PALABRAS_FICHA} palabras en total.

PACIENTE: ${data?.p || '—'} | Fecha: ${data?.d || '—'} | Región valorada: ${region}

${clinicalCtx ? clinicalCtx + '\n\n' : ''}${romCtx ? romCtx + '\n\n' : ''}TRANSCRIPCIÓN:
{{TRANSCRIPT}}

INSTRUCCIONES:
1. No escribas título ni ficha de identificación (paciente, fecha…): se añaden aparte. Tampoco escribas el nombre del paciente ni la fecha en ningún punto del texto, ni en la primera frase. Empieza directamente con "## PRESENTACIÓN CLÍNICA".
2. Usa EXACTAMENTE estas tres secciones con prefijo ##:
   ## PRESENTACIÓN CLÍNICA
   ## HALLAZGOS Y CODIFICACIÓN CIF
   ## OBJETIVOS Y PLAN
3. Escribe en prosa continua dentro de cada sección, sin viñetas ni listas.
4. En ## HALLAZGOS Y CODIFICACIÓN CIF incluye los códigos CIF alfanuméricos relevantes entre paréntesis inline, integrados en la prosa: como máximo unos 6, elegidos SOLO de esta lista y solo si el término corresponde exactamente al hallazgo descrito; si ningún código de la lista encaja, no pongas código: ${CODIGOS_CIF.map(([c, t]) => `${c} ${t}`).join('; ')}. Ejemplo: "Se constata limitación del rango de flexión de hombro (b7101) con dolor asociado al movimiento activo (b28016)."
5. ${conAudio
    ? 'La transcripción complementa los datos estructurados.'
    : 'No hay transcripción de la sesión: redacta el informe exclusivamente con los datos de la valoración estructurada.'} No inventes mediciones, pruebas, escalas ni datos personales que no aparezcan en los datos recibidos; no escribas "No evaluado".
6. ${reglaDerivacion('## OBJETIVOS Y PLAN')}
${REGLAS_COMUNES}
7. Límite estricto: ${PALABRAS_FICHA} palabras totales entre las tres secciones, repartidas más o menos así: PRESENTACIÓN CLÍNICA ${Math.round(PALABRAS_FICHA * 0.33)}, HALLAZGOS Y CODIFICACIÓN CIF ${Math.round(PALABRAS_FICHA * 0.37)}, OBJETIVOS Y PLAN ${Math.round(PALABRAS_FICHA * 0.30)}. En la presentación, solo lo que define el problema (inicio, evolución, síntomas y negativos relevantes, actividades que lo provocan); no repases todas las respuestas.${hasHypotheses ? '\n8. En ## HALLAZGOS Y CODIFICACIÓN CIF añade una frase de contraste con las hipótesis de valoración recibidas: indica si los hallazgos las refuerzan, matizan o contradicen, citando el hallazgo que lo justifica. Si las comprobaciones de una hipótesis que se deriva salieron negativas, di que no la apoyan pero no la descartan.' : ''}`;
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
  // Fuera lo que cambia solo con el paso de los días: la fecha y las semanas
  // desde la cirugía (cq.se), que se calculan al vuelo.
  const { d, cq, ...resto } = data || {};
  if (cq) resto.cq = (({ se, ...x }) => x)(cq);
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
  return `INFORME DE FISIOTERAPIA${data?.p ? `\nPaciente: ${data.p}` : ''}${data?.ed != null ? `\nEdad: ${data.ed} años` : ''}${data?.sx ? `\nSexo: ${data.sx}` : ''}
Fecha: ${data?.d || '—'}
Región valorada: ${regionTexto(data, nombreRegion)}

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

// ── Conexión cortada durante la generación ───────────────────────────────────
// La generación es una petición en streaming de 1–3 minutos. En el móvil, si la
// pantalla se apaga, se bloquea o se cambia de app, el navegador suspende la
// página y corta sus conexiones: fetch() o la lectura del stream fallan con un
// TypeError de red («Load failed» en iOS, «Failed to fetch» / «network error»
// en Chrome). No es un error del servidor ni de las APIs, así que no pasa por
// errorLegible(): se dice qué ha pasado y que basta con volver a generar.
// → { texto, original, servicio: null, sinAudio: false } | null (no es un corte)
export const TEXTO_CONEXION_SEGUNDO_PLANO = 'Se ha cortado la conexión porque la pantalla se apagó, el móvil se bloqueó o se salió de la app mientras se generaba. Vuelve a pulsar «Generar informe» y mantén la pantalla encendida hasta que termine.';
export const TEXTO_CONEXION_PERDIDA = 'Se ha perdido la conexión con el servidor mientras se generaba. Comprueba la conexión y vuelve a pulsar «Generar informe».';
const RE_RED = /load failed|failed to fetch|network ?error|networkerror|network connection was lost|connection (was )?(reset|closed|aborted)|err_|internet connection appears to be offline/i;

export function errorConexion(err, { seOculto = false } = {}) {
  const mensaje = String(err?.message || '');
  // Los fallos de red de fetch son TypeError con uno de estos textos; un
  // TypeError de otro tipo es un fallo de código, y un mensaje de la API que
  // hable de «connection» llega como Error: ninguno de los dos es un corte.
  if (err?.name !== 'TypeError' || !RE_RED.test(mensaje)) return null;
  return { texto: seOculto ? TEXTO_CONEXION_SEGUNDO_PLANO : TEXTO_CONEXION_PERDIDA, original: mensaje, servicio: null, sinAudio: false };
}

// ── Transcripción sin voz ─────────────────────────────────────────────────────
// Con un audio en silencio (micrófono equivocado, pausado, muy bajo) Whisper no
// devuelve un texto vacío: «alucina» frases de los subtítulos con que se
// entrenó («Subtítulos realizados por la comunidad de Amara.org», repetida).
// Visto en una prueba real (2026-10): el informe salió marcado «con audio»
// sin nada del audio. Se detecta al llegar la transcripción, antes de redactar.
const RELLENO_WHISPER = [
  /subt[ií]tul(?:os|ado)[^.!?\n]*amara\.org/gi,
  /\bamara\.org\b/gi,
  /¡?\s*suscr[ií]bete[^.!?\n]*[.!]?/gi,
  /(?:muchas )?gracias por ver(?: el v[ií]deo)?[.!]?/gi,
  /thank(?:s| you) for watching[.!]?/gi,
  /subt[ií]tulos (?:en espa[ñn]ol|por [^.!?\n]*)[.!]?/gi,
];
export function transcripcionSinVoz(texto) {
  const t = String(texto || '').trim();
  if (!t) return true;
  const resto = RELLENO_WHISPER.reduce((acc, re) => acc.replace(re, ' '), t).replace(/[\s.,;:!?¡¿«»"'-]+/g, ' ').trim();
  if (resto.split(' ').filter(Boolean).length < 4) return true;     // solo relleno, o casi nada
  // Una misma frase repetida que ocupa casi todo el texto: otra forma de alucinar
  const frases = t.split(/(?<=[.!?])\s+/).map(f => f.trim().toLowerCase()).filter(Boolean);
  if (frases.length >= 3) {
    const cuenta = {};
    for (const f of frases) cuenta[f] = (cuenta[f] || 0) + 1;
    if (Math.max(...Object.values(cuenta)) / frases.length >= 0.8) return true;
  }
  return false;
}
export const TEXTO_SIN_VOZ = 'No se ha entendido ninguna voz en el audio: la transcripción ha salido vacía o con texto de relleno, lo típico de una grabación en silencio. Revisa el micrófono (en Chrome, el icono de la barra de direcciones o Configuración › Privacidad › Micrófono) y vuelve a grabar, o genera el informe sin audio.';

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
