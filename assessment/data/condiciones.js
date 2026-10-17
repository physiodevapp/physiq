// ============================================================
// PhysiQ-Assessment · data/condiciones.js
// Guía de condiciones especiales (cabecera, docs/condiciones-especiales.md):
// cuándo pensar en cada condición que la app solo activa si el clínico la
// marca, y a dónde ir para marcarla. Nada clínico nuevo: cada pista resume una
// pregunta que la app ya tiene (`de`: sus ids) con las fuentes que esa
// pregunta cita; «que» es redacción propia, sin cifras ni criterios
// (decisión 8). Nunca marca nada, ni va al payload, los resúmenes o el prompt.
// ============================================================

export const TEXTOS_CONDICIONES = {
  titulo: 'Condiciones especiales',
  intro: 'Situaciones que cambian el cribado y el plan. Si una encaja, márcala y la app añade lo que necesita.',
  diagnostico: 'Si el paciente ya tiene el diagnóstico, márcala siempre.',
  grupoLumbar: 'Solo en lumbar',
  sinLumbar: 'Elige lumbar en la fase 2',
  pie: 'Esta lista orienta: no diagnostica ni marca nada por ti.',
};

// Orden de la decisión 2: transversales de la más frecuente a la menos, y
// aparte las de lumbar (decisión 3: siempre visibles, para que se conozcan).
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
    destino: { tarjeta: 'cardLupus' },
    boton: 'Ir a la tarjeta →',
    fuentes: ['Aringer 2019'],
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
];
