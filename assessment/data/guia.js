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
// marca nada). Patrones sobre el texto en minúsculas y sin acentos. Piloto: las
// 6 urgencias de lumbar (sx_sincope, hem_5 y hem_6 son de todas las regiones).
// Redactados desde la pregunta y su clínica, sin consultas reales en modo guía:
// afinar con ellas (falsos positivos medidos con tests/fixtures/informes: con las
// 6 sin responder, 2 de 25 transcripciones daban aviso, las dos «la pantorrilla
// está blanda, no está caliente»; por eso el hueco entre la parte del cuerpo y
// el adjetivo no puede contener una negación, HUECO).
const HUECO = n => `(?:(?!\\bno\\b|\\bni\\b|\\bsin\\b)[^.?!]){0,${n}}`;
export const CONTRASTE_URGENCIAS = {
  l6: {
    tema: 'síntomas de cauda equina (esfínteres o sensibilidad en silla de montar)',
    patrones: [
      'incontinencia',
      'se me escap\\w* (?:el |la )?(?:pis|orina|caca|heces)',
      'no (?:puedo|consigo|soy capaz de) (?:orinar|hacer pis|mear)',
      'me cuesta (?:orinar|hacer pis|mear)',
      'retencion de orina|retengo (?:la )?orina',
      'no (?:noto|siento) (?:cuando|las ganas de) (?:orino|orinar|hacer pis|ir al bano)',
      'silla de montar',
      `(?:dormid[oa]s?|acorchad[oa]s?|insensible|sin sensibilidad)${HUECO(40)}(?:entre las piernas|genitales|perine|zona genital|el ano|la zona del culo)`,
      `(?:entre las piernas|genitales|perine|zona genital|el ano)${HUECO(30)}(?:dormid|acorchad|insensib|sin sensibilidad)`
    ]
  },
  l_e8: {
    tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)',
    patrones: [
      '(?:retraso|falta) de la regla',
      'no me (?:ha )?(?:bajado|venido) la regla',
      '(?:sangrado|manchado) vaginal',
      'sangro (?:fuera de la regla|sin tener la regla)'
    ]
  },
  l_v4: {
    tema: 'una pierna o pantorrilla hinchada, caliente o dolorosa (posible TVP)',
    patrones: [
      `(?:pantorrilla|gemelo|pierna)${HUECO(30)}(?:hinchad|inflamad|caliente)`,
      `(?:hinchad|inflamad)${HUECO(20)}(?:pantorrilla|gemelo)`,
      'trombosis|trombo\\b'
    ]
  },
  sx_sincope: {
    tema: 'un desmayo o pérdida de conocimiento',
    patrones: [
      'desmay\\w*',
      'perd\\w* (?:el )?conocimiento',
      'sincope',
      'me quede inconsciente'
    ]
  },
  hem_5: {
    tema: 'un tratamiento contra el cáncer (quimioterapia o radioterapia)',
    patrones: ['quimio\\w*', 'radioterapia', 'tratamiento (?:oncologico|contra el cancer)']
  },
  hem_6: {
    tema: 'la hemofilia u otro trastorno de la coagulación',
    patrones: ['hemofili\\w*', 'von willebrand']
  }
};
