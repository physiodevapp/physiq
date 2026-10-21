// ============================================================
// Modo guía con grabadora externa (docs/modo-guia.md): textos.
// Solo datos. Lo pinta app.js; la lógica pura está en lib/modo-guia.js.
// ============================================================

// Campos de texto de la fase 1 y 3 que en modo guía no se teclean: en su lugar
// va la frase para decir en voz alta (decisión 4). `id` = el <textarea>; la
// respuesta sale solo del audio. `ancla`: además se sugiere decir el resultado
// en voz alta (decisión 5). Las frases las revisa el fisio (paso 3 del plan) y se dicen de «tú» al paciente (decisión del fisio, 2026-10).
// `ia`: grupo del informe con IA al que va la respuesta (los de GRUPOS_FORMULARIO
// de lib/informe-narrativo.js, más 'exploracion'); `iaTexto`: cómo se nombra en el
// prompt cuando la frase no es una pregunta al paciente.
export const VERBALES = {
  motivoConsulta: { frase: '¿Qué te trae por aquí? ¿Qué te pasa y desde cuándo?', ia: 'historia' },
  signoComparable: {
    frase: 'Dilo en voz alta cuando lo encuentres: el movimiento que reproduce sus síntomas.',
    ancla: 'Ej.: «Flexión de hombro a 100º con dolor 6 sobre 10»',
    ia: 'exploracion',
    iaTexto: 'Signo comparable: el movimiento que reproduce los síntomas (lo dice el fisioterapeuta durante la exploración)'
  },
  cirIntervencion: { frase: '¿Qué operación te hicieron y cuándo?', ia: 'historia', soloPosq: true },
  cirRestricciones: { frase: '¿Qué restricciones o protocolo te ha dado el cirujano?', ia: 'historia', soloPosq: true }
};

export const TEXTOS_GUIA = {
  // Decisión 13: el consentimiento se pide al empezar a grabar, para que quede en el audio
  consentimiento: 'Al empezar a grabar, informa al paciente y pídele su consentimiento: así queda en el audio.',
  // Tarjeta «🎙 Informe con IA» en modo guía
  informeConAudio: 'Registro con la app como guía: los textos libres (motivo, historia, antecedentes, signo comparable…) no se escribieron. El informe los toma del audio de la consulta.',
  informeSinAudio: 'Registro con la app como guía y sin audio: el informe solo tendrá lo que marcaste con botones. Lo que se preguntó de palabra no constará. Adjunta el audio de la grabadora con «📎 Adjuntar audio».',
  preguntado: 'Preguntado',
  anclaTest: 'Dilo en voz alta al marcarlo',
  cambioAGuia: 'Las respuestas «NO» que no marcaste a propósito se quedan sin responder: no se sabe si se preguntaron. Las respuestas «SÍ» se mantienen.',
  cambioATeclado: 'Las preguntas sin responder pasarán a «NO», como en el modo con teclado.'
};

// Decisión 6 (docs/modo-guia.md): contraste de la transcripción con las preguntas
// de urgencia. Si en la consulta aparece uno de estos patrones y la pregunta está
// en NO o sin responder, la revisión automática del informe lo señala (nunca
// marca nada). Patrones sobre el texto en minúsculas y sin acentos. Redactados
// desde la pregunta y su clínica, sin consultas reales en modo guía: afinar con
// ellas. Cada patrón apunta al dato rojo concreto, no al tema: en una consulta de
// fisioterapia se habla todo el rato de golpes, caídas, hinchazón y «no puedo
// mover…», y eso solo no es una urgencia (ni las luxaciones previas del hombro,
// que pregunta su formulario).
// Falsos positivos medidos con tests/fixtures/informes (todas las preguntas sin
// responder): con las 6 de lumbar, 2 de 25 transcripciones daban aviso, las dos
// «la pantorrilla está blanda, no está caliente»; por eso el hueco entre la parte
// del cuerpo y el adjetivo no puede contener una negación (HUECO).
const HUECO = n => `(?:(?!\\bno\\b|\\bni\\b|\\bsin\\b)[^.?!]){0,${n}}`;

// Compartidos entre regiones: la misma clínica con su pregunta en cada una
const TVP = [
  `(?:pantorrilla|gemelo|pierna)${HUECO(30)}(?:hinchad|inflamad|caliente)`,
  `(?:hinchad|inflamad)${HUECO(20)}(?:pantorrilla|gemelo)`,
  'trombosis|trombo\\b'
];
const ECTOPICO = [
  '(?:retraso|falta) de la regla',
  'no me (?:ha )?(?:bajado|venido) la regla',
  '(?:sangrado|manchado) vaginal',
  'sangro (?:fuera de la regla|sin tener la regla)'
];
const FIEBRE = ['fiebre', 'febricula', 'escalofrios', 'tiritona'];
const CARDIACO = [
  'dolor (?:en el|de) pecho',
  'opresion en el pecho',
  'me aprieta el pecho',
  'infarto|angina'
];
const ISQUEMIA = [
  `(?:pierna|pie)${HUECO(20)}(?:fri[ao]s?|palid[ao]s?|helad[ao]s?)`,
  'no (?:noto|siento) el pie',
  'sin pulso|no (?:hay|tiene|le noto|se nota) pulso'
];

const ESFINTERES = [
  'incontinencia',
  'se me escap\\w* (?:el |la )?(?:pis|orina|caca|heces)',
  'no (?:puedo|consigo|soy capaz de) (?:orinar|hacer pis|mear)',
  'me cuesta (?:orinar|hacer pis|mear)',
  'retencion de orina|retengo (?:la )?orina'
];
// Condiciones especiales (paso 6): la misma clínica en varias tarjetas
const BRAZO_HINCHADO = [`(?:brazo|antebrazo)${HUECO(30)}(?:hinchad|inflamad|caliente)`];
const AIRE = [
  // brusca: la falta de aire al subir escaleras (o en el embarazo) es habitual
  `(?:de (?:golpe|repente)|bruscamente)${HUECO(20)}(?:me (?:falta|faltaba|falto) el aire|me ahog(?:o|aba|ue)\\b)`,
  `(?:me (?:falta|faltaba|falto) el aire|me ahog(?:o|aba|ue)\\b)${HUECO(20)}de (?:golpe|repente)`,
  `(?:tosi|tose|toso|escupi\\w*)${HUECO(10)}sangre`,
  'me duele (?:el pecho )?al respirar',
  `dolor (?:en el|de) pecho${HUECO(20)}al respirar`,
  'embolia|tromboembolismo'
];
const ICTUS = [
  'ictus|derrame cerebral|trombosis cerebral|infarto cerebral',
  `(?:debilidad|flojera|dormid[oa]|acorchad[oa])${HUECO(20)}(?:medio cuerpo|un lado del cuerpo|la mitad del cuerpo)`,
  'se me (?:torcio|durmio|quedo dormida) (?:la cara|la boca|medio cuerpo)',
  'no me salian las palabras|no podia hablar|me costaba hablar',
  'perdi la vista|deje de ver|no veia (?:nada|de un ojo)'
];
const COMPARTIMENTAL = [
  'dolor desproporcionado',
  'sindrome compartimental',
  `(?:yeso|escayola|ferula|vendaje)${HUECO(30)}(?:me aprieta|aprieta mucho|me apretaba)`,
  `(?:pierna|brazo|antebrazo|muslo|gemelo|mano|pie)${HUECO(20)}(?:muy tens[ao]|durisim[ao]|como una piedra)`
];
const TRAS_OPERACION = `(?:desde|despues de|tras) (?:la operacion|la cirugia|que me operaron)`;
const NERVIO_NUEVO = `(?:hormigue\\w*|dormid[oa]s?|acorchad[oa]s?|quemazon|me quema|sin fuerza|perdido fuerza|perdiendo fuerza|debilidad)`;
const DESMAYO = '(?:me desmaye|me desmayo|desmayarme|perdi el conocimiento|me quede inconsciente)';

export const CONTRASTE_URGENCIAS = {
  // ── Lumbar (piloto, paso 4) y las de todas las regiones ──
  l6: {
    tema: 'síntomas de cauda equina (esfínteres o sensibilidad en silla de montar)',
    patrones: [
      ...ESFINTERES,
      'no (?:noto|siento) (?:cuando|las ganas de) (?:orino|orinar|hacer pis|ir al bano)',
      'silla de montar',
      `(?:dormid[oa]s?|acorchad[oa]s?|insensible|sin sensibilidad)${HUECO(40)}(?:entre las piernas|genitales|perine|zona genital|el ano|la zona del culo)`,
      `(?:entre las piernas|genitales|perine|zona genital|el ano)${HUECO(30)}(?:dormid|acorchad|insensib|sin sensibilidad)`
    ]
  },
  l_e8: { tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)', patrones: ECTOPICO },
  l_v4: { tema: 'una pierna o pantorrilla hinchada, caliente o dolorosa (posible TVP)', patrones: TVP },
  sx_sincope: {
    tema: 'un desmayo o pérdida de conocimiento',
    patrones: ['desmay\\w*', 'perd\\w* (?:el )?conocimiento', 'sincope', 'me quede inconsciente']
  },
  hem_5: {
    tema: 'un tratamiento contra el cáncer (quimioterapia o radioterapia)',
    patrones: ['quimio\\w*', 'radioterapia', 'tratamiento (?:oncologico|contra el cancer)']
  },
  hem_6: { tema: 'la hemofilia u otro trastorno de la coagulación', patrones: ['hemofili\\w*', 'von willebrand'] },

  // ── Cadera ──
  ca_v2: { tema: 'una pierna o pantorrilla hinchada, caliente o enrojecida (posible TVP)', patrones: TVP },
  ca_v4: {
    tema: 'un dolor súbito, intenso y desgarrador (posible aneurisma o disección)',
    patrones: ['desgarrador', 'como si me (?:desgarr|rasg)\\w*', 'aneurisma', 'diseccion (?:de|aortica)']
  },
  ca_v5: { tema: 'una pierna fría, pálida o sin pulso de repente (posible isquemia)', patrones: ISQUEMIA },
  ca_u3: {
    tema: 'un dolor de testículo con hinchazón (posible torsión)',
    patrones: [`testicul\\w*${HUECO(30)}(?:hinchad|inflamad)`, `(?:hinchad|inflamad)${HUECO(20)}testicul`, 'torsion testicular']
  },
  ca_u5: { tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)', patrones: ECTOPICO },
  ca_os1: {
    tema: 'una posible fractura de estrés',
    patrones: ['fractura (?:de|por) (?:estres|fatiga|sobrecarga)']
  },
  ca_in1: { tema: 'fiebre o malestar general (posible artritis séptica)', patrones: FIEBRE },

  // ── Cervical ──
  cv_c3: { tema: 'un dolor u opresión en el pecho (posible origen cardiaco)', patrones: CARDIACO },
  cv_ar1: {
    tema: 'signos de disección arterial o ictus (dolor de cabeza nuevo, párpado caído, torpeza)',
    patrones: [
      'parpado caido|se me cae el parpado',
      'pupila (?:mas )?(?:pequena|chica)|pupilas? (?:distintas?|diferentes?)',
      '(?:no puedo|me cuesta) mover (?:la cara|la lengua|los ojos)',
      'torpe(?:za)? al (?:andar|caminar)'
    ]
  },
  cv_ar2: {
    tema: 'signos de insuficiencia vertebrobasilar (visión doble, dificultad para hablar o tragar, caídas súbitas)',
    patrones: [
      'vision doble|veo doble|diplopia',
      '(?:me cuesta|dificultad para|no puedo) (?:hablar|tragar)',
      'disartria|disfagia',
      'me caigo (?:de repente|de golpe|sin perder)',
      `(?:hormigue\\w*|dormid[oa]|acorchad[oa])${HUECO(20)}(?:alrededor de la boca|los labios)`,
      'ronquera'
    ]
  },
  cv_ar3: {
    tema: 'un traumatismo cervical importante (sujetarse la cabeza, caída de cabeza)',
    patrones: ['me (?:tengo que )?sujet\\w* la cabeza|tengo que sujetar(?:me)? la cabeza', 'me aguanto la cabeza', 'caida de cabeza|me tire de cabeza|zambull\\w*']
  },
  cv_ar4: {
    tema: 'un dolor de cabeza nuevo, súbito o con fiebre',
    patrones: [
      'el peor dolor de cabeza|el peor de mi vida',
      `de (?:golpe|repente)${HUECO(15)}(?:un )?dolor de cabeza`,
      'dolor de cabeza (?:muy fuerte )?(?:de golpe|subito|repentino|como nunca|distinto)',
      'cefalea en trueno',
      'rigidez de nuca',
      ...FIEBRE
    ]
  },

  // ── Rodilla ──
  r_v2: { tema: 'una pierna o pantorrilla hinchada, caliente o enrojecida (posible TVP)', patrones: TVP },
  r_v4: { tema: 'una pierna fría, pálida o sin pulso de repente (posible isquemia)', patrones: ISQUEMIA },
  r1: { tema: 'fiebre con la rodilla hinchada (posible artritis séptica)', patrones: FIEBRE },
  r_i3: {
    tema: 'una bursitis prerrotuliana caliente y roja (posible infección)',
    patrones: [`(?:delante de la rotula|encima de la rotula|bolsa de la rotula)${HUECO(30)}(?:roj|caliente|hinchad)`, 'bursitis (?:infectada|septica)']
  },
  ro_t2: {
    tema: 'no poder levantar la pierna estirada tras el traumatismo (posible rotura del aparato extensor)',
    patrones: [
      'no (?:puedo|consigo|soy capaz de) levantar la pierna (?:estirada|recta)',
      'no (?:puedo|consigo) (?:mantener|tener) la rodilla (?:estirada|recta)'
    ]
  },
  ro_t3: {
    tema: 'un traumatismo de alta energía de la rodilla (posible luxación)',
    patrones: ['salpicadero', 'la rodilla se me (?:fue|doblo) hacia atras', 'luxacion de (?:la )?rodilla', 'se me salio la rodilla']
  },
  ro_t4: { tema: 'el pie o la pierna fríos, pálidos o sin pulso tras el traumatismo', patrones: ISQUEMIA },

  // ── Hombro ──
  h_c4: { tema: 'un dolor u opresión en el pecho (posible origen cardiaco)', patrones: CARDIACO },
  h_g1: { tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)', patrones: ECTOPICO },
  h_gi4: {
    tema: 'un golpe en el costado o el abdomen (posible lesión del bazo)',
    patrones: ['golpe (?:en|contra) el (?:costado|abdomen)', 'me golpee (?:el costado|las costillas|la tripa)', '(?:golpe (?:con|contra)|me di con|me golpee con) el volante', 'bazo']
  },
  h_t1: {
    tema: 'un hombro deformado tras una caída (posible fractura o luxación aguda)',
    patrones: ['hombro (?:deformado|hundido)', 'deformidad']
  },

  // ── Tobillo y pie ──
  tp_t1: { tema: 'el pie frío, pálido o sin pulso tras la lesión (posible síndrome compartimental o lesión vascular)', patrones: [...ISQUEMIA, 'dolor desproporcionado'] },
  tp_i1: { tema: 'fiebre con una articulación hinchada (posible artritis séptica)', patrones: FIEBRE },
  tp_v2: { tema: 'una pierna o pantorrilla hinchada, caliente o dolorosa (posible TVP)', patrones: TVP },
  tp_n1: {
    tema: 'debilidad en las dos piernas que va a más (posible Guillain-Barré)',
    patrones: [
      `(?:debilidad|flojera|pierdo fuerza|perdiendo fuerza)${HUECO(30)}(?:las dos piernas|ambas piernas)`,
      `(?:las dos piernas|ambas piernas)${HUECO(30)}(?:debiles|flojas|sin fuerza)`
    ]
  },

  // ── Codo ──
  co_t1: {
    tema: 'no poder estirar del todo el codo tras un golpe o una caída (prueba de extensión del codo)',
    patrones: ['no (?:puedo|consigo|soy capaz de) (?:estirar|extender) (?:del todo |bien )?el (?:codo|brazo)']
  },
  co_t2: {
    tema: 'un codo deformado, o la mano fría o pálida, tras un golpe',
    patrones: ['codo (?:deformado|hundido)', `mano${HUECO(20)}(?:fri[ao]|palid[ao]|helad[ao])`]
  },
  co1: { tema: 'fiebre con el codo caliente y rojo (posible artritis séptica)', patrones: FIEBRE },

  // ── Condiciones especiales (paso 6): solo cuentan con su tarjeta marcada,
  // porque respuestasUrgentes() lee los sistemas activos ──
  // Posquirúrgico
  pq_herida: {
    tema: 'una herida operada con signos de infección (roja, caliente, supura o se ha abierto) o fiebre',
    patrones: [
      `(?:herida|cicatriz|puntos)${HUECO(30)}(?:roja|caliente|supura|infectad|se (?:me )?(?:han? )?abiert[oa]s?)`,
      'supura|\\bpus\\b',
      `se (?:me )?(?:han? )?abiert[oa]s?${HUECO(15)}(?:la )?(?:herida|cicatriz|los puntos)`,
      ...FIEBRE
    ]
  },
  pq_tvp: { tema: 'una pierna o pantorrilla hinchada, caliente o dolorosa tras la operación (posible TVP)', patrones: TVP },
  pq_tvp_ms: { tema: 'una pierna o el brazo operado hinchados, calientes o dolorosos (posible TVP)', patrones: [...TVP, ...BRAZO_HINCHADO] },
  pq_tep: { tema: 'falta de aire brusca, dolor en el pecho al respirar o tos con sangre (posible TEP)', patrones: [...AIRE, DESMAYO] },
  pq_compart: { tema: 'un dolor desproporcionado que va a más con la zona muy tensa (posible síndrome compartimental)', patrones: COMPARTIMENTAL },
  pq_nervio: {
    tema: 'síntomas nerviosos nuevos desde la operación (quemazón, hormigueo, adormecimiento o pérdida de fuerza)',
    patrones: [`${TRAS_OPERACION}${HUECO(40)}${NERVIO_NUEVO}`, `${NERVIO_NUEVO}${HUECO(40)}${TRAS_OPERACION}`]
  },
  pq_nervio_col: {
    tema: 'síntomas neurológicos nuevos o que van a más desde la operación de columna (posible hematoma epidural)',
    patrones: [`${TRAS_OPERACION}${HUECO(40)}${NERVIO_NUEVO}`, `${NERVIO_NUEVO}${HUECO(40)}${TRAS_OPERACION}`, ...ESFINTERES]
  },
  // Hipermovilidad (Ehlers-Danlos vascular)
  hm_v_dolor: {
    tema: 'un dolor brusco e intenso que va a más (posible complicación arterial o de órgano en Ehlers-Danlos vascular)',
    patrones: [
      'dolor (?:desgarrador|brutal|como una punalada)',
      `de (?:repente|golpe)${HUECO(15)}(?:un )?dolor (?:muy )?(?:fuerte|intenso|horrible|brutal)`
    ]
  },
  hm_v_ojo: {
    tema: 'un zumbido en la sien con el ojo rojo o saltón (posible fístula carótido-cavernosa)',
    patrones: ['zumbido en la sien', `ojo${HUECO(15)}(?:salton|abultado|hacia fuera|se me sale)`]
  },
  hm_v_aire: { tema: 'falta de aire brusca o dolor en el pecho al respirar (posible neumotórax)', patrones: [...AIRE, 'neumotorax'] },
  // Disautonomía: síncope de alto riesgo
  ds_u_esfuerzo: {
    tema: 'un desmayo durante un esfuerzo',
    patrones: [
      `${DESMAYO}${HUECO(40)}(?:corriendo|haciendo (?:deporte|ejercicio|esfuerzo)|en el gimnasio|subiendo|entrenando|jugando)`,
      `(?:corriendo|haciendo (?:deporte|ejercicio)|entrenando|en el gimnasio)${HUECO(30)}${DESMAYO}`
    ]
  },
  ds_u_tumbado: {
    tema: 'un desmayo estando tumbado o tras notar el corazón muy rápido',
    patrones: [
      `${DESMAYO}${HUECO(30)}(?:tumbad|acostad|en la cama)`,
      `(?:tumbad[oa]|acostad[oa]|en la cama)${HUECO(30)}${DESMAYO}`,
      `(?:corazon|palpitaciones)${HUECO(40)}${DESMAYO}`
    ]
  },
  ds_u_corazon: {
    tema: 'un desmayo con síntomas o enfermedad del corazón',
    patrones: [...CARDIACO, 'tengo un soplo|soplo (?:en el corazon|cardiaco)', 'insuficiencia cardiaca', 'enfermedad del corazon']
  },
  ds_u_familia: {
    tema: 'una muerte súbita en la familia antes de los 40 años o una enfermedad del corazón hereditaria',
    patrones: ['muerte (?:subita|repentina)', 'murio de (?:repente|golpe)', 'muri\\w* (?:subita|repentina)mente', '(?:enfermedad del corazon|cardiopatia) (?:hereditaria|familiar)']
  },
  // Lupus
  les_u_fiebre: { tema: 'fiebre o malestar general nuevo con corticoides o inmunosupresores (posible infección)', patrones: FIEBRE },
  les_u_tvp: { tema: 'una pierna, pantorrilla o brazo hinchados, calientes o dolorosos (posible TVP)', patrones: [...TVP, ...BRAZO_HINCHADO] },
  les_u_tep_ictus: { tema: 'falta de aire brusca, dolor al respirar o síntomas de ictus aunque se pasaran', patrones: [...AIRE, ...ICTUS] },
  les_u_pecho: {
    tema: 'un dolor en el pecho que empeora al respirar hondo (posible pericarditis o pleuritis)',
    patrones: ['pericarditis|pleuritis|derrame pleural', `pecho${HUECO(40)}(?:respirar hondo|al respirar|me inclino|inclinarme)`, 'punzada en el pecho']
  },
  les_u_dedos: {
    tema: 'una úlcera en la yema de un dedo o un dedo que no recupera el color (isquemia digital)',
    patrones: [
      `(?:dedo|yema)${HUECO(30)}(?:ulcera|llaga|herida|negro|necros)`,
      `(?:ulcera|llaga)${HUECO(20)}(?:yema|dedo)`,
      'no (?:recupera|vuelve a tener|le vuelve) (?:el )?color'
    ]
  },
  les_u_neuro: {
    tema: 'convulsiones, confusión, debilidad en las piernas con cambios al orinar, un pie o una mano caídos, o pérdida de visión',
    patrones: [
      'convulsion|ataque epileptico|crisis epileptica',
      '(?:estaba|estoy|me note|me noto|me quede) (?:muy )?(?:confus[ao]|desorientad[ao])',
      '(?:pie|mano) caid[ao]',
      `(?:debilidad|flojera|perdiendo fuerza)${HUECO(30)}(?:las dos piernas|ambas piernas)`,
      'perdi la vista|deje de ver|no veia (?:nada|de un ojo)',
      ...ESFINTERES
    ]
  },
  // Osteoporosis
  op_u_medula: {
    tema: 'dolor de espalda nuevo con debilidad o torpeza en las piernas o cambios al orinar (posible compresión medular por fractura)',
    patrones: [
      `(?:debilidad|flojera|torpeza|perdiendo fuerza|hormigue\\w*)${HUECO(30)}(?:las (?:dos )?piernas|ambas piernas)`,
      `(?:las dos piernas|ambas piernas)${HUECO(20)}(?:acorchad|dormid|debiles|flojas|sin fuerza|torpes)`,
      ...ESFINTERES
    ]
  },
  // Embarazo o posparto
  em_u_preeclampsia: {
    tema: 'signos de preeclampsia (dolor de cabeza fuerte, visión borrosa o destellos, dolor bajo las costillas, hinchazón brusca)',
    patrones: [
      'veo (?:borroso|destellos|lucecitas|chispitas)|vision borrosa',
      `dolor de cabeza${HUECO(15)}(?:muy fuerte|horrible|que no se (?:me )?quita)`,
      `(?:cara|manos|pies)${HUECO(20)}(?:hinchad[oa]s? de (?:golpe|repente))`,
      'se me (?:ha )?hinchado de (?:golpe|repente)',
      'preeclampsia|tension (?:muy )?alta'
    ]
  },
  em_u_sangrado: { tema: 'un sangrado vaginal en el embarazo', patrones: ['(?:sangrado|manchado) vaginal', 'he (?:sangrado|manchado)', 'estoy (?:sangrando|manchando)'] },
  em_u_movimientos: {
    tema: 'que el bebé se mueve menos de lo habitual',
    patrones: [`(?:el bebe|la nina|el nino)${HUECO(15)}se mueve (?:menos|poco|muy poco)`, 'no (?:lo|la|le) noto mover', 'no noto (?:al bebe|que se mueva|los movimientos)', 'se mueve menos']
  },
  em_u_parto: {
    tema: 'contracciones regulares y dolorosas o pérdida de líquido',
    patrones: [`contracciones${HUECO(20)}(?:cada|regulares|dolorosas|seguidas)`, 'he roto (?:la )?(?:bolsa|aguas)|rompi (?:la )?(?:bolsa|aguas)', 'me sale (?:liquido|agua)']
  },
  em_u_sangrado_pp: {
    tema: 'un sangrado vaginal brusco o abundante tras el parto, coágulos o el vientre muy hinchado',
    patrones: [`sangr\\w*${HUECO(20)}(?:much[oa]|abundante|a chorro|de golpe)`, 'coagulos', 'empapo (?:la|las|una) compresa']
  },
  em_u_infeccion: {
    tema: 'fiebre, dolor de vientre, pelvis o periné, o flujo que huele mal tras el parto',
    patrones: [...FIEBRE, `flujo${HUECO(20)}(?:huele|olor)`, 'huele mal']
  },
  em_u_tev: {
    tema: 'una pierna hinchada y dolorosa, falta de aire nueva, dolor en el pecho o tos con sangre (posible TEV)',
    patrones: [...TVP, ...AIRE]
  },
  em_u_corazon: {
    tema: 'dolor en el pecho, palpitaciones o falta de aire en reposo o al tumbarse',
    patrones: [...CARDIACO, 'palpitaciones', `(?:me falta el aire|me ahogo)${HUECO(20)}(?:tumbad|acostad|en reposo|sin hacer nada)`]
  },
  em_u_perine: {
    tema: 'la herida del periné o de la cesárea abierta, roja o que supura',
    patrones: [
      `(?:herida|cicatriz|puntos|episiotomia|cesarea)${HUECO(30)}(?:roja|caliente|supura|infectad|se (?:me )?(?:han? )?abiert[oa]s?)`,
      'supura|\\bpus\\b',
      `se (?:me )?(?:han? )?abiert[oa]s?${HUECO(15)}(?:la )?(?:herida|cicatriz|los puntos)`
    ]
  },
  em_u_incontinencia: { tema: 'pérdida continua de orina o heces sin poder controlarla desde el parto', patrones: ESFINTERES },
  // Las dos `privada`: un tema genérico, nunca el texto de la pregunta
  em_u_psicosis: {
    tema: 'un posible problema de salud mental urgente tras el parto',
    patrones: ['(?:esta|la (?:veo|ve|vemos|noto|nota|notamos)) (?:muy )?(?:rara|confusa|desorientada|acelerada|euforica)', 'ideas (?:raras|extranas)', 'no duerme nada', 'oye voces|oigo voces']
  },
  em_u_autolesion: {
    tema: 'un posible problema de salud mental urgente tras el parto',
    patrones: ['hacerme dano', 'quitarme la vida|matarme|suicid\\w*', 'no quiero (?:seguir )?vivir', 'mejor (?:muerta|no estar)']
  },
  // Anticoagulado o antiagregado
  ac_u_cabeza: {
    tema: 'un golpe en la cabeza tomando anticoagulantes o antiagregantes',
    patrones: [
      `(?:golpe|golpee|me di|porrazo|choque)${HUECO(30)}(?:la cabeza|en la frente|en la nuca)`,
      `(?:la cabeza|la frente)${HUECO(20)}(?:contra|con el|con la)`
    ]
  },
  ac_u_cabeza_tardia: {
    tema: 'dolor de cabeza que va a más, vómitos, somnolencia o confusión tras un golpe en la cabeza',
    patrones: [
      `dolor de cabeza${HUECO(20)}(?:va a mas|cada vez (?:mas|peor)|muy fuerte)`,
      'vomit\\w*',
      'somnolient[oa]|mucho sueno',
      '(?:estaba|estoy|me note|me noto|me quede) (?:muy )?(?:confus[ao]|desorientad[ao])'
    ]
  },
  ac_u_espinal: {
    tema: 'un dolor brusco de cuello o espalda con síntomas neurológicos o cambios al orinar (posible hematoma epidural)',
    patrones: [
      `(?:debilidad|flojera|perdiendo fuerza|dormid[oa]s?|acorchad[oa]s?)${HUECO(30)}(?:las (?:dos )?piernas|los (?:dos )?brazos|ambas piernas)`,
      `(?:las dos piernas|los dos brazos|ambas piernas)${HUECO(20)}(?:acorchad|dormid|debiles|flojas|sin fuerza)`,
      ...ESFINTERES
    ]
  },
  ac_u_psoas: {
    tema: 'dolor fuerte en la ingle o el costado con el muslo débil o dormido, o con mareo y palidez (posible hematoma del psoas)',
    patrones: [`muslo${HUECO(20)}(?:dormid|acorchad|debil|sin fuerza|flojo)`, `(?:ingle|costado)${HUECO(40)}(?:mareo|palid|sudor frio)`, 'sudor frio']
  },
  ac_u_pared: {
    tema: 'un dolor fuerte y un bulto en la pared de la barriga tras toser, un esfuerzo o la heparina (posible hematoma de la vaina de los rectos)',
    patrones: [`(?:barriga|tripa|abdomen|vientre)${HUECO(30)}(?:bulto|morado|moraton|hematoma)`, `(?:bulto|moraton|hematoma)${HUECO(30)}(?:barriga|tripa|abdomen|vientre)`]
  },
  ac_u_compartimental: { tema: 'un miembro muy hinchado y tenso con un dolor desproporcionado (posible síndrome compartimental)', patrones: COMPARTIMENTAL }
};
