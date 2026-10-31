// ============================================================
// PhysiQ-Assessment · data/condiciones.js
// Guía de condiciones especiales (cabecera, docs/condiciones-especiales.md):
// cuándo pensar en cada condición que la app solo activa si el clínico la
// marca, y a dónde ir para marcarla. Nada clínico nuevo: cada pista resume una
// pregunta que la app ya tiene (`de`: sus ids) con las fuentes que esa
// pregunta cita; «que» es redacción propia, sin cifras ni criterios
// (decisión 8). Nunca marca nada (solo elige la región de una fila de región,
// decisión 9), ni va al payload, los resúmenes o el prompt.
// ============================================================

export const TEXTOS_CONDICIONES = {
  titulo: 'Condiciones especiales',
  // soloApp: lo que la condición añade y no está en las hojas impresas ni en la guía (guia.html):
  // la hoja de condiciones y la página de la guía lo dicen aparte, para no prometer en papel lo que no está.
  intro: 'Situaciones que cambian el cribado y el plan. Si una encaja, márcala y la app añade lo que necesita.',
  diagnostico: 'Si el paciente ya tiene el diagnóstico, márcala siempre.',
  // Apartado y botón de las filas de una región ({region}: su nombre en minúscula)
  grupoRegion: 'Solo en {region}',
  // Sin región elegida, el botón la elige y lleva a la pregunta; con otra
  // región, la cambia tras confirmar (borra el cribado y, si ya se pasó de la
  // fase 2, las fases 3 a 4b, como el cambio desde la fase 2)
  sinRegion: 'Elegir {region} e ir a la pregunta →',
  otraRegion: 'Cambiar a {region} e ir →',
  avisoTitulo: 'Cambiar región de valoración',
  avisoTexto: 'Ahora valoras {actual}. Esta pregunta solo está en el cribado de {region}: al cambiar se borran las respuestas del cribado sistémico.',
  avisoFases: ' También se perderá el progreso de las fases SINSS, Árbol de decisión y Confirmación de Hipótesis.',
  pie: 'Esta lista orienta: no diagnostica ni marca nada por ti.',
};

// Orden de la decisión 2: transversales de la más frecuente a la menos, y
// aparte las de cada región, en su orden (decisión 3: siempre visibles, para
// que se conozcan).
// destino: { tarjeta: id de la fase 1 } o { pregunta: id del cribado }.
export const CONDICIONES = [
  {
    id: 'posquirurgico',
    nombre: 'Paciente posquirúrgico',
    que: 'Le han operado de la zona que consulta.',
    piensa: 'Piensa en ello si:',
    pistas: [
      { texto: 'el problema empezó o sigue tras una operación de esta zona.', de: [] },
    ],
    anade: 'la tarjeta «Cirugía» con el protocolo del cirujano, preguntas de complicaciones en la fase 2 (herida, trombosis, embolia…), la hipótesis «Postoperatorio» y el plan supeditado al protocolo.',
    soloApp: 'el plan supeditado al protocolo (fase 6).',
    destino: { tarjeta: 'cardMecanismo' },
    boton: 'Ir a Mecanismo de inicio →',
    fuentes: [],
  },
  {
    id: 'hipermovilidad',
    nombre: 'Hipermovilidad / Ehlers-Danlos',
    que: 'Articulaciones mucho más flexibles de lo normal; a veces, una enfermedad del tejido conectivo.',
    piensa: 'Piensa en ella si:',
    pistas: [
      { texto: 'se considera una persona «de goma» o muy flexible;', de: ['cq5'] },
      { texto: 'se le salió el hombro o la rótula más de una vez de niño o adolescente;', de: ['cq4'] },
      { texto: 'llega con las palmas al suelo sin doblar las rodillas, o con el pulgar al antebrazo.', de: ['cq1', 'cq2'] },
    ],
    anade: 'su cribado en la fase 2 (cuestionario, escala de Beighton, sospecha del subtipo vascular), un aviso en los tests de laxitud y consideraciones para el plan.',
    soloApp: 'los avisos del plan (fase 6).',
    destino: { tarjeta: 'cardHipermovilidad' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['Malfait 2017'],
  },
  {
    id: 'disautonomia',
    nombre: 'Disautonomía / POTS',
    que: 'El cuerpo no se adapta bien a estar de pie: el corazón se acelera o baja la tensión.',
    piensa: 'Piensa en ella si:',
    pistas: [
      { texto: 'desde hace 3 meses o más, estar de pie le da mareo, palpitaciones o cansancio que se pasan al tumbarse;', de: ['io1'] },
      { texto: 'le empeora con el calor, después de comer o al levantarse de golpe.', de: ['io2'] },
    ],
    anade: 'las preguntas del desmayo de alto riesgo y la prueba de bipedestación en la fase 2, y consideraciones para el ejercicio y el plan.',
    soloApp: 'los avisos y la red de seguridad del plan (fase 6).',
    destino: { tarjeta: 'cardDisautonomia' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['Vernino 2021', 'Raj 2020', 'Sheldon 2015', 'Hakim 2017', 'Fedorowski 2019'],
  },
  {
    id: 'lupus',
    nombre: 'Lupus (LES)',
    que: 'Enfermedad autoinmune que puede dar dolor en varias articulaciones, problemas de piel y fiebre.',
    piensa: 'Piensa en él si:',
    pistas: [
      { texto: 'tiene dolor e hinchazón, o rigidez por la mañana de 30 minutos o más, en 2 o más articulaciones, sobre todo de las manos;', de: ['lr1'] },
      { texto: 'le sale una erupción en la cara que empeora con el sol;', de: ['lr2'] },
      { texto: 'tiene llagas en la boca que vuelven, se le cae el pelo o tiene fiebre sin infección.', de: ['lr3', 'lr5'] },
    ],
    anade: 'con «Diagnosticado», sus urgencias y derivaciones en la fase 2 y consideraciones para el ejercicio y el plan; con «Sospecha», los rasgos que justifican una valoración médica.',
    soloApp: 'los avisos y la red de seguridad del plan (fase 6).',
    destino: { tarjeta: 'cardLupus' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['Aringer 2019'],
  },
  {
    id: 'mastocitos',
    nombre: 'Trastorno mastocitario o anafilaxia',
    que: 'Los mastocitos liberan sustancias que pueden dar reacciones alérgicas graves (anafilaxia), a veces sin causa clara. Incluye la mastocitosis y el síndrome de activación mastocitaria.',
    piensa: 'Márcala si:',
    pistas: [
      { texto: 'un médico le ha diagnosticado una mastocitosis o un trastorno o síndrome de activación mastocitaria;', de: ['ma_d_episodios'] },
      { texto: 'ha tenido una anafilaxia (una reacción brusca con falta de aire, mareo o desmayo, con o sin ronchas), también con el ejercicio.', de: ['ma_d_episodios'] },
    ],
    anade: 'qué hacer ante una anafilaxia en la sesión, sus desencadenantes, una derivación si tiene episodios nuevos sin valorar y la red de seguridad del plan. Los síntomas crónicos (cansancio, dolor) no bastan para marcarla.',
    soloApp: 'el aviso y la red de seguridad del plan (fase 6).',
    destino: { tarjeta: 'cardMastocitos' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['Valent 2022', 'Cardona 2020', 'Lee y Picard 2025'],
  },
  {
    id: 'osteoporosis',
    nombre: 'Osteoporosis o fragilidad ósea',
    que: 'Hueso con menos masa y peor estructura, que se rompe con un golpe pequeño o sin golpe.',
    piensa: 'Piensa en ella si:',
    pistas: [
      { texto: 'tiene 50 años o más y se rompió algo con una caída desde su altura o menos;', de: ['of1'] },
      { texto: 'toma corticoides por boca desde hace 3 meses o más;', de: ['of2'] },
      { texto: 'está embarazada o dando el pecho y tiene un dolor de espalda nuevo, intenso y que no se pasa.', de: ['l_e4'] },
    ],
    anade: 'su urgencia y sus derivaciones en la fase 2, las caídas, una línea en los tests que cargan el hueso, y el ejercicio, el tope sin thrust y la red de seguridad del plan; con «Sospecha», los factores que piden valorar el riesgo de fractura.',
    soloApp: 'los avisos, el tope sin thrust y la red de seguridad del plan (fase 6).',
    destino: { tarjeta: 'cardOsteoporosis' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['Gregson 2025', 'Kanis 2019', 'Hadji 2026'],
  },
  {
    id: 'embarazo',
    nombre: 'Embarazo o posparto',
    que: 'El embarazo y el primer año tras el parto cambian las banderas rojas, la posición en la camilla y el ejercicio.',
    piensa: 'Márcala si:',
    pistas: [
      { texto: 'está embarazada (las preguntas dependen de las semanas);', de: ['em_u_preeclampsia', 'em_u_parto'] },
      { texto: 'ha dado a luz en el último año, con cualquier tipo de parto.', de: ['em_u_sangrado_pp', 'em_u_infeccion'] },
    ],
    anade: 'sus urgencias y derivaciones en la fase 2 según las semanas, la regla de la tensión, el ánimo y el suelo pélvico, una línea sobre estar boca arriba en la 4b, y el ejercicio, la terapia manual y la red de seguridad del plan.',
    soloApp: 'los avisos y la red de seguridad del plan (fase 6).',
    destino: { tarjeta: 'cardEmbarazo' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['NICE NG201', 'NICE NG194', 'Mottola 2018'],
  },
  {
    id: 'anticoagulado',
    nombre: 'Paciente anticoagulado o antiagregado',
    que: 'Quien toma fármacos para que la sangre no coagule o las plaquetas no se peguen: sangra con más facilidad, y un golpe o una técnica pueden dar un hematoma que no se ve.',
    piensa: 'Márcala si:',
    pistas: [
      { texto: 'toma acenocumarol, warfarina, apixabán, rivaroxabán, edoxabán, dabigatrán o heparina;', de: ['ac_u_cabeza', 'ac_u_psoas'] },
      { texto: 'toma aspirina, clopidogrel, prasugrel o ticagrelor;', de: ['ac_u_cabeza_tardia', 'ac_u_espinal'] },
      { texto: 'le han puesto inyecciones de heparina tras una operación o una trombosis.', de: ['ac_u_pared'] },
    ],
    anade: 'la pregunta del golpe en la cabeza y las de los hematomas en la fase 2, una línea de técnica en la 4b, un recuadro en la fase 5, y los avisos, el tope sin thrust (solo con anticoagulante) y la red de seguridad del plan.',
    soloApp: 'los avisos, el tope sin thrust y la red de seguridad del plan (fase 6).',
    destino: { tarjeta: 'cardAnticoagulado' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['NICE NG232', 'Peng 2022', 'Muñoz 2022'],
  },
  {
    id: 'tarlov',
    region: 'lumbar',
    nombre: 'Quiste de Tarlov',
    que: 'Quiste de una raíz nerviosa del sacro; a menudo no da síntomas.',
    piensa: 'Piensa en él si:',
    pistas: [
      { texto: 'desde hace meses le duele el sacro, el cóccix o el periné, peor sentado y mejor tumbado,', de: ['l_u5'] },
      { texto: 'con molestias de orina, de heces o sexuales que ya tenía.', de: ['l_u5'] },
    ],
    anade: 'una derivación médica preferente, no urgente. Si algo de vejiga, intestino o silla de montar es nuevo o empeora, no es esto: es la pregunta de la cola de caballo, urgente.',
    destino: { pregunta: 'l_u5' },
    boton: 'Ir a la pregunta →',
    fuentes: ['Paredes Mogica 2023', 'Hulens 2018', 'Klepinowski 2021'],
  },
  {
    id: 'cascanueces',
    region: 'lumbar',
    nombre: 'Síndrome del cascanueces',
    que: 'Una vena del riñón izquierdo queda pinzada entre dos arterias.',
    piensa: 'Piensa en él si:',
    pistas: [
      { texto: 'desde hace meses tiene un dolor sordo en el costado o la zona lumbar izquierda, peor de pie y mejor tumbado,', de: ['l_u6'] },
      { texto: 'y le han encontrado sangre en la orina, o tiene varices en el escroto izquierdo, o (en mujeres) dolor de pelvis que empeora de pie.', de: ['l_u6'] },
    ],
    anade: 'una derivación médica preferente, no urgente, para descartar otras causas.',
    destino: { pregunta: 'l_u6' },
    boton: 'Ir a la pregunta →',
    fuentes: ['Penfold 2024', 'Mačionienė 2026'],
  },
  {
    id: 'congestionPelvica',
    region: 'cadera',
    nombre: 'Síndrome de congestión pélvica',
    que: 'Venas de la pelvis dilatadas que se llenan al estar de pie; el dolor puede notarse en la ingle o la cadera.',
    piensa: 'Piensa en él si:',
    pistas: [
      { texto: 'en una mujer, desde hace meses, hay un dolor sordo o de peso en la pelvis, la ingle o la cadera, peor de pie o al final del día y mejor tumbada,', de: ['ca_u6'] },
      { texto: 'y varices en la vulva, el periné, el muslo o la nalga, o un dolor que dura horas después de las relaciones sexuales.', de: ['ca_u6'] },
    ],
    anade: 'una derivación médica preferente, no urgente, para descartar otras causas. Un dolor pélvico nuevo con retraso de la regla no es esto: es la pregunta del embarazo ectópico, urgente.',
    destino: { pregunta: 'ca_u6' },
    boton: 'Ir a la pregunta →',
    fuentes: ['Bałabuszek 2022', 'Champaneria 2016', 'Dos Santos 2016'],
  },
];
