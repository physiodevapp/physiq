// ============================================================
// PhysiQ-Assessment · data/cervical.js
// Contenido clínico de la región CERVICAL: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.cervical
export const screening = {
  label: 'Cabeza, Cuello y Espalda',
  // Recuadro de urgencia: literal de la tarjeta de consulta cervical (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS HOY · disfunción arterial · lesión tras traumatismo · cefalea con signos de alarma',
    lineas: [
      'Disección arterial (<55 a): cefalea o dolor cervical súbito, DESCONOCIDO PARA EL PACIENTE, moderado o grave y a menudo progresivo. Alteración del equilibrio o la marcha, Horner, déficit de pares craneales. Puede imitar una cefalea cervicogénica.',
      'Insuficiencia vertebrobasilar (suele ser >65 a, posible en jóvenes) · 5 D y 3 N: mareo o inestabilidad, diplopía o pérdida de campo visual, disartria o disfasia, disfagia o ronquera, caídas súbitas sin pérdida de conciencia; nistagmo espontáneo, náuseas o vómitos, entumecimiento peribucal.',
      'Fractura, subluxación o luxación: traumatismo importante en persona mayor o mecanismo peligroso (flexión con compresión en deporte de colisión). Se sujeta la cabeza, espasmo defensivo, movilidad muy limitada, posibles signos neurológicos. Incluye la inestabilidad cervical alta traumática.',
      'Cefalea con signos de alarma: cambio súbito de calidad, intensidad o frecuencia; síntomas neurológicos nuevos; inicio súbito y grave; fiebre u otros síntomas sistémicos.'
    ]
  },
  sistemas: [
    {
      id: 'cv_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Antecedentes de cáncer o tratamiento oncológico',
        'Edad >50 años con inicio insidioso',
        'Dolor nocturno constante e intenso que despierta al paciente',
        'Fracaso del tratamiento conservador tras 1 mes sin mejoría',
        'Pérdida de peso inexplicada (>10% en 2-4 semanas)',
        'Ganglios linfáticos duros, fijos e indoloros',
        // Tarjeta cervical (guía de consulta), BANDERAS «Tumor vertebral»
        'Tumor vertebral (benigno, maligno o metástasis): dolor cervical incesante que no cambia con postura, movimiento ni reposo; dolor nocturno frecuente; rigidez y pérdida de movilidad posibles; debilidad o entumecimiento si comprime médula o raíces. Malestar general: febrícula, sudor nocturno, cansancio, inapetencia'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv4', text: '¿Alguna vez ha tenido cáncer de algún tipo, o ha recibido quimioterapia, terapia hormonal o radioterapia?', alerta: true, s1: true },
        { id: 'cv1', text: '¿El dolor lo despierta por la noche desde un sueño profundo y le resulta imposible encontrar una posición que lo alivie?', alerta: true, s1: true },
        { id: 'cv5', text: '¿Ha notado pérdida de peso reciente, rápida y sin proponérselo?', alerta: true, s1: true }
      ],
      zonasDolor: [
        { zona: 'Columna cervical (10%)', desc: 'Metástasis — menos frecuente que torácica o lumbar' },
        { zona: 'Columna torácica (60%)', desc: 'Localización más frecuente de metástasis vertebrales' },
        { zona: 'Extremidades (radicular)', desc: 'Compresión medular → parestesias, debilidad distal' }
      ],
      impactoDescanso: [
        'Dolor nocturno que despierta al paciente, no cede, tipo "taladro" — alerta oncológica principal',
        'Sudoraciones masivas y fiebres fragmentan el descanso'
      ],
      impactoEjercicio: [
        'Fatiga extrema sin relación con el nivel de actividad, no se alivia con descanso',
        'Anemia post-quimio: disnea, taquicardia y mareos con mínimo esfuerzo'
      ]
    },
    {
      id: 'cv_cardio', icon: '❤️', nombre: 'Cardiovascular',
      banderasRojas: [
        'Dolor de cuello/mandíbula acompañado de sudores, náuseas u opresión torácica',
        'Síncope repentino sin mareo previo',
        'Angina no aliviada por reposo (>20 min)',
        // Tarjeta cervical (guía de consulta), BANDERAS «Cardiaco»
        'Cardiaco: dolor cervical, habitualmente anterior. No se relaciona con movimientos ni posturas del cuello'
      ],
      banderasAmarillas: [
        'Dolor de espalda que empeora con esfuerzo físico de piernas'
      ],
      preguntas: [
        { id: 'cv2', text: '¿Tiene síntomas como sudores, náuseas, o dolor en el pecho/mandíbula al mismo tiempo que el dolor de cuello/espalda?', alerta: true, s1: true },
        { id: 'cv_c2', text: '¿El dolor de espalda o cuello empeora al subir escaleras o hacer esfuerzo físico general (no al mover el cuello)?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'IAM / Angina', desc: 'Retroesternal → zona interescapular, mandíbula, brazo izquierdo' },
        { zona: 'Aneurisma aórtico', desc: 'Zona interescapular desgarradora → abdomen, flanco izquierdo' }
      ],
      impactoDescanso: [
        'Disnea paroxística nocturna — despierta con sensación de asfixia',
        'Angina nocturna interrumpe el sueño'
      ],
      impactoEjercicio: [
        'Isquemia miocárdica limita el ejercicio severamente',
        'Fatiga profunda e inesperada con esfuerzo leve indica gasto cardíaco inadecuado'
      ]
    },
    {
      id: 'cv_pulmonar', icon: '🫁', nombre: 'Pulmonar',
      banderasRojas: [
        'Dolor de cuello/hombro que empeora al toser, respirar profundamente o reír',
        'Hemoptisis, tos persistente, disnea en reposo',
        'Fiebre y sudores nocturnos (neumonía, tuberculosis)'
      ],
      banderasAmarillas: [
        'Tabaquismo prolongado',
        'Antecedente de cáncer con potencial de metástasis pulmonar'
      ],
      preguntas: [
        { id: 'cv_p1', text: '¿El dolor de cuello o espalda empeora al toser, reír, estornudar o respirar profundo?', alerta: true },
        { id: 'cv_p2', text: '¿Siente falta de aire en reposo o al acostarse?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'Cuello / Trapecio', desc: 'Irradiación de patología pleural' },
        { zona: 'Hombro ipsilateral', desc: 'Irritación del nervio frénico' }
      ],
      impactoDescanso: ['Tos nocturna y sudores fragmentan el descanso'],
      impactoEjercicio: ['Disnea de esfuerzo restringe drásticamente la tolerancia al ejercicio']
    },
    {
      id: 'cv_renal', icon: '🫘', nombre: 'Renal / Urológico',
      banderasRojas: [
        'Prueba de percusión de Murphy positiva (ángulo costovertebral)',
        'Cambio en control de esfínteres junto con dolor cervical (compresión medular)',
        'Hematuria'
      ],
      banderasAmarillas: [
        'Dolor que no cambia con postura corporal',
        'Fiebre y escalofríos acompañando el dolor de espalda',
        'Cambios en el color u olor de la orina'
      ],
      preguntas: [
        { id: 'cv3', text: '¿Ha notado algún cambio en su control de esfínteres (vejiga o intestino)?', alerta: true, s1: true },
        { id: 'cv_r2', text: '¿Ha notado cambios en la orina (color, olor, cantidad) o dificultad para orinar?', alerta: true, s1: true }
      ],
      zonasDolor: [
        { zona: 'Ángulo costovertebral', desc: 'Riñones → flanco → ingle ipsilateral' },
        { zona: 'Zona suprapúbica', desc: 'Vejiga, uretra' }
      ],
      impactoDescanso: ['Dolor renal constante, sin alivio postural — impide el sueño'],
      impactoEjercicio: ['Insuficiencia renal crónica: anemia con fatiga extrema y letargo']
    },
    {
      id: 'cv_gi', icon: '🫃', nombre: 'Gastrointestinal',
      banderasRojas: [
        'Dolor de espalda que empeora o mejora al comer o tras una evacuación',
        'Dolor nocturno entre la medianoche y las 3 am que cede con antiácidos (úlcera duodenal)',
        'Heces negras/alquitranadas o vómito en posos de café (sangrado GI)'
      ],
      banderasAmarillas: [
        'Dolor de espalda y abdominal al mismo nivel de forma simultánea o alterna',
        'Uso crónico de AINEs (riesgo de úlcera péptica)',
        'Saciedad precoz o intolerancia a comidas grasas'
      ],
      preguntas: [
        { id: 'cv_gi1', text: '¿El dolor de espalda empeora o mejora al comer, o cambia tras una evacuación intestinal?', alerta: true, s1: true },
        { id: 'cv_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces, o dolor nocturno entre medianoche y las 3 am que cede con antiácidos?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'Columna torácica media (T6-T10)', desc: 'Estómago, duodeno, páncreas, vesícula biliar' },
        { zona: 'Región esternal / Cuello anterior', desc: 'Esófago, ERGE' },
        { zona: 'Escápula derecha', desc: 'Vesícula biliar, hígado' }
      ],
      impactoDescanso: [
        'Dolor nocturno de úlcera duodenal (12–3 am) interrumpe el sueño',
        'Reflujo gastroesofágico nocturno fragmenta el descanso y provoca tos'
      ],
      impactoEjercicio: [
        'Anemia ferropénica por sangrado GI oculto: fatiga y disnea con el esfuerzo',
        'Mala absorción de nutrientes compromete la recuperación muscular post-sesión'
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), URGENCIA (urgencias hoy) y
      // BANDERAS «Otras cefaleas secundarias».
      id: 'cv_arterial', icon: '🧠', nombre: 'Arterial / Traumatismo / Cefalea de alarma',
      banderasRojas: [
        'Disección arterial (<55 a): cefalea o dolor cervical súbito, desconocido para el paciente, moderado o grave y a menudo progresivo; alteración del equilibrio o la marcha, Horner, déficit de pares craneales. Puede imitar una cefalea cervicogénica → urgencias hoy',
        'Insuficiencia vertebrobasilar (suele ser >65 a, posible en jóvenes) · 5 D y 3 N: mareo o inestabilidad, diplopía o pérdida de campo visual, disartria o disfasia, disfagia o ronquera, caídas súbitas sin pérdida de conciencia; nistagmo espontáneo, náuseas o vómitos, entumecimiento peribucal → urgencias hoy',
        'Fractura, subluxación o luxación (incluye la inestabilidad cervical alta traumática): traumatismo importante en persona mayor o mecanismo peligroso → urgencias hoy',
        'Cefalea con signos de alarma: cambio súbito de calidad, intensidad o frecuencia; síntomas neurológicos nuevos; inicio súbito y grave; fiebre u otros síntomas sistémicos → urgencias hoy',
        'Otras cefaleas secundarias: pseudotumor cerebri; arteritis temporal; sospecha de tumor, aneurisma, hemorragia, ictus o meningitis. Pseudotumor: examen ocular, TC o RM, punción lumbar. Arteria temporal: palpación, analítica, biopsia. Resto: RM y analítica'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv_ar1', text: '¿Le empezó de golpe un dolor de cabeza o de cuello distinto a cualquiera que haya tenido antes, con desequilibrio o torpeza al caminar, un párpado caído o una pupila más pequeña, o dificultad para mover la cara, la lengua o los ojos?', alerta: true, s1: true, urgencia: 'Sospecha de disección arterial: derivación a urgencias hoy.' },
        { id: 'cv_ar2', text: '¿Tiene mareo o inestabilidad junto con visión doble o pérdida de parte de la vista, dificultad para hablar o tragar, ronquera, caídas súbitas sin perder el conocimiento, náuseas o vómitos, o adormecimiento alrededor de la boca?', alerta: true, s1: true, urgencia: 'Sospecha de insuficiencia vertebrobasilar: derivación a urgencias hoy.' },
        { id: 'cv_ar3', text: '¿El dolor empezó tras un traumatismo importante (sobre todo si es mayor) o un golpe peligroso, como una flexión con compresión en un deporte de colisión, y necesita sujetarse la cabeza o apenas puede mover el cuello?', alerta: true, s1: true, urgencia: 'Sospecha de fractura, subluxación, luxación o inestabilidad cervical alta traumática: derivación a urgencias hoy.' },
        { id: 'cv_ar4', text: '¿Su dolor de cabeza ha cambiado de golpe de forma, intensidad o frecuencia, empezó de forma súbita y muy fuerte, o viene con síntomas neurológicos nuevos, fiebre u otros síntomas generales?', alerta: true, s1: true, urgencia: 'Cefalea con signos de alarma: derivación a urgencias hoy.' }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), BANDERAS «Mielopatía cervical»,
      // «Inestabilidad cervical alta no traumática», «Distonía cervical» y
      // «Fijación rotatoria atloaxoidea».
      id: 'cv_neuro', icon: '⚡', nombre: 'Médula / Estructural',
      banderasRojas: [
        'Mielopatía cervical: espondilosis avanzada que estrecha el canal y comprime la médula; más probable de mediana edad en adelante. También con tumores avanzados o malformación congénita (Klippel-Feil). Falla la conducción de la médula, no la de la raíz: exploración neurológica que incluya pruebas centrales (Babinski, dedo-nariz). La RM muestra la compresión',
        'Inestabilidad cervical alta no traumática: erosión del ligamento transverso en AR; ausencia congénita de ligamentos; síndrome de Down; Klippel-Feil (cuello corto, asimetría facial, cefalea crónica). La queja principal puede ser una cefalea con rasgos de cervicogénica',
        'Distonía cervical: contracciones involuntarias con postura y movimientos anómalos de la cabeza; puede doler. Observación de la postura y del movimiento',
        'Fijación rotatoria atloaxoidea: más frecuente en niños. Tortícolis con rotación muy limitada. Puede aparecer tras amigdalitis o adenoamigdalectomía (síndrome de Grisel). Requiere derivación médica'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv_n1', text: '¿Tiene artritis reumatoide, síndrome de Down o síndrome de Klippel-Feil (cuello corto)?', alerta: true },
        { id: 'cv_n2', text: '¿Nota contracciones que no controla y que le giran o inclinan la cabeza, o le dejan la cabeza en una postura anómala?', alerta: true },
        { id: 'cv_n3', text: '(Menores de 18 años) ¿Tiene tortícolis con el giro de la cabeza muy limitado, que apareció tras una amigdalitis o una operación de amígdalas o vegetaciones?', alerta: true }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), BANDERAS «Infección» y
      // «Artritis inflamatoria».
      id: 'cv_inflam', icon: '🔥', nombre: 'Inflamatoria / Infecciosa',
      banderasRojas: [
        'Infección (discitis, osteomielitis, absceso epidural): dolor incesante y nocturno que no alivia con reposo, postura ni movimiento; cuello rígido con pérdida de movilidad; signos neurológicos si está avanzada. Malestar general: febrícula, sudor nocturno, cansancio, inapetencia. Analítica si se sospecha (decisión médica)',
        'Artritis inflamatoria (AR, EA): dolor y rigidez prolongada, sobre todo por la mañana. AR: visible en articulaciones periféricas. EA: empieza en lo lumbopélvico'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv_in1', text: '¿Tiene febrícula, sudores por la noche o se encuentra mal en general, con un dolor de cuello continuo que no se alivia con el reposo ni cambiando de postura?', alerta: true, s1: true },
        { id: 'cv_in2', text: '¿Tiene el cuello rígido mucho rato, sobre todo por la mañana, o le duelen o se le hinchan otras articulaciones?', alerta: true }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.cervical
export const tree = {
  title: 'Algoritmo CIF — Cervical',
  steps: [
    {
      id: 'ce_step1',
      tag: 'Paso 1 — Cribado de Médula y Seguridad',
      question: '¿Existen signos de compromiso medular (mielopatía)?',
      options: [
        { label: 'SÍ — Alteración de marcha, hiperreflexia, signo de Hoffmann o Clonus positivos', value: 'si', next: null, hypothesis: ['ce8'] },
        { label: 'NO — Sin signos de mielopatía', value: 'no', next: 'ce_step2', hypothesis: [] }
      ]
    },
    {
      id: 'ce_step2',
      tag: 'Paso 2 — Antecedente Traumático',
      question: '¿Hubo un mecanismo de aceleración-desaceleración reciente (latigazo cervical)?',
      options: [
        { label: 'SÍ — ROM cervical significativamente reducido y síntomas de hiperalerta', value: 'si', next: null, hypothesis: ['ce5'] },
        { label: 'NO — Sin mecanismo traumático', value: 'no', next: 'ce_step3', hypothesis: [] }
      ]
    },
    {
      id: 'ce_step3',
      tag: 'Paso 3 — Dolor Irradiado a Miembro Superior',
      question: '¿El dolor baja por el brazo y es peor que el del cuello?',
      options: [
        // Sin hipótesis: el paso 3b (tarjeta, nodo 3b) separa dolor radicular de radiculopatía
        { label: 'SÍ — Test de Spurling positivo, ULNT1 positivo o alivio con abducción del hombro', value: 'si', next: null, hypothesis: [] },
        { label: 'NO — Sin irradiación predominante al brazo', value: 'no', next: 'ce_step4', hypothesis: [] }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), nodo 3b. Solo se llega con el SÍ
      // del paso 3 (su NO salta al paso 4).
      id: 'ce_step3b',
      tag: 'Paso 3b — Radicular o Radiculopatía',
      question: '¿Rasgos neuropáticos, déficit de conducción o ninguno? Pueden coexistir; si el inicio fue traumático, el paso 2 ya añade el latigazo.',
      options: [
        { label: 'DOLOR RADICULAR — Quemazón o descargas + ULNT1 positivo con diferenciación estructural', value: 'radicular', next: null, hypothesis: ['ce12'] },
        { label: 'RADICULOPATÍA — Déficit de sensibilidad, fuerza o reflejos', value: 'radiculopatia', next: null, hypothesis: ['ce3'] },
        { label: 'AMBOS — Dolor radicular y déficit de conducción', value: 'ambos', next: null, hypothesis: ['ce12', 'ce3'] },
        { label: 'AURA MIGRAÑOSA — Síntomas que preceden a la cefalea y duran hasta 60 min: no radicular', value: 'aura', next: null, hypothesis: [] },
        { label: 'FALLA LA MÉDULA — Derivar (mielopatía)', value: 'medula', next: null, hypothesis: ['ce8'] }
      ]
    },
    {
      id: 'ce_step4',
      tag: 'Paso 4 — Localización y Cefalea',
      question: '¿El síntoma principal es cefalea unilateral o dolor en base del cuello/hombro?',
      options: [
        { label: 'Cefalea unilateral — Test de Flexión-Rotación Cervical <30° y síntomas C1-C2', value: 'cefalea', next: null, hypothesis: ['ce4'] },
        // Tarjeta cervical, nodo 5b: cefalea primaria (la tabla orientativa va en ce4)
        { label: 'Cefalea primaria — Criterios de migraña o tensional (el cuello puede contribuir)', value: 'primaria', next: null, hypothesis: [] },
        { label: 'Dolor en hombro/escápula — Restricción de movilidad de 1ª costilla', value: '1costilla', next: null, hypothesis: ['ce10'] },
        { label: 'Dolor local/inespecífico — Sin cefalea ni irradiación dominante', value: 'no', next: 'ce_step4b', hypothesis: [] }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), nodo 5b, segunda línea: mareo.
      id: 'ce_step4b',
      tag: 'Paso 4b — Mareo',
      question: '¿Hay mareo o inestabilidad como queja principal o acompañante? Descartar antes lo vascular (5 D y 3 N, disección).',
      options: [
        { label: 'MAREO CERVICOGÉNICO — Aturdimiento o inestabilidad ligados al cuello + error de reposición >4–5°', value: 'cervicogenico', next: null, hypothesis: ['ce13'] },
        { label: 'VESTIBULAR — Vértigo rotatorio; tras golpe en cabeza o cuello, pensar también en conmoción', value: 'vestibular', next: null, hypothesis: [] },
        { label: 'NO — Sin mareo', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ce_step5',
      tag: 'Paso 5 — Dominio Mecánico Predominante',
      question: '¿Cuál es la función más alterada en este paciente?',
      options: [
        { label: 'Déficit de Movilidad — ROM activo reducido y PAIVMs C0-C3 hipomóviles', value: 'movilidad', next: null, hypothesis: ['ce1'] },
        { label: 'Déficit de Coordinación — CCFT alterado o test de reposicionamiento alterado', value: 'coordinacion', next: null, hypothesis: ['ce2'] },
        { label: 'Déficit de Fuerza — Reducción de fuerza de flexión o extensión cervical', value: 'fuerza', next: null, hypothesis: ['ce6'] },
        { label: 'Déficit de Resistencia — Fatiga muscular en actividades funcionales', value: 'resistencia', next: null, hypothesis: ['ce11'] },
        { label: 'Déficit Postural — Lordosis reducida o cabeza adelantada evidente', value: 'postural', next: null, hypothesis: ['ce9'] },
        { label: 'Dolor crónico inespecífico sin patrón dominante claro', value: 'inespecifico', next: null, hypothesis: ['ce7'] }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), nodo 6: las tres ubicaciones son
      // la misma ficha (Idiopático). En todos: tarea provocadora, postura,
      // control motor y región torácica.
      id: 'ce_step6',
      tag: 'Paso 6 — Idiopático: Dónde Está la Disfunción',
      question: '¿Dónde está la disfunción? En todos: tarea provocadora, postura, control motor y región torácica.',
      options: [
        { label: 'CRANEOCERVICAL (C1–2) — Dolor en los primeros grados de rotación, restricción precoz, FRT <30° o 10° de asimetría', value: 'craneocervical', next: null, hypothesis: ['ce14'] },
        { label: 'FACETA CERVICAL — Extensión-rotación positiva + disfunción segmentaria palpable y dolorosa', value: 'faceta', next: null, hypothesis: ['ce14'] },
        { label: 'CERVICAL BAJA Y CERVICOTORÁCICA — Giro libre al inicio pero excursión final limitada', value: 'baja', next: null, hypothesis: ['ce14'] },
        { label: 'NINGUNO — No es idiopático o no se localiza', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── CERVICAL ────────────────────────────────────────────
  // LR: ver «Phase 4b scoring» en CLAUDE.md. `fuente` cita el estudio de cada
  // cifra; sin fuente no hay LR (el test cuenta como hallazgo clínico).
  // `pronostico`: texto literal de la tarjeta cervical de la guía de consulta.
  ce1: {
    id: 'ce1', region: 'cervical', num: '①',
    name: 'Disfunción Articular Cervical',
    prom: 'NDI — Neck Disability Index (MCID: 7.5–18 puntos)',
    dosis: 'Ejercicios de ROM cervical activo sin supervisión, movimientos suaves en todos los planos. 5-10 repeticiones por dirección, 3-4 veces al día. Límite: ROM sin dolor (0-3/10 VAS).',
    tests: [
      { name: 'PAIVM (Movilidad Intervertebral Pasiva Accesoria) C0-C3', sn: '59–65%', sp: '78–87%', lr_pos: '2.9–4.9', lr_neg: '0.43–0.49', criterio: 'Kappa 0.53-0.72. Movilización segmentaria posteroanterior. Positivo si hipomóvil y reproduce síntomas.' },
      { name: 'ROM Cervical Activo con CROM', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dispositivo CROM con fiabilidad y validez "buena". Reducción de -7° a -89° comparado con controles según dirección.' }
    ]
  },
  ce2: {
    id: 'ce2', region: 'cervical', num: '②',
    name: 'Disfunción Neuromuscular Cervical',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Activación de flexores cervicales profundos con biofeedback de presión (20-22 mmHg). Sostener 5-10 seg sin compensación de musculatura superficial. 5 repeticiones, 1-2 series, en decúbito supino.',
    tests: [
      { name: 'Test de Flexión Craneocervical (CCFT) con biofeedback de presión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Alteración a 20-22 mmHg con compensación de musculatura superficial (escaleno, trapecio). Aumento de EMG del trapecio superior (6.18%) y escaleno anterior (2.87%).' },
      { name: 'Test de Reposicionamiento Cabeza-Neutro', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Alterado en dolor cervical crónico idiopático. Evalúa la propiocepción cervical.' }
    ]
  },
  ce3: {
    id: 'ce3', region: 'cervical', num: '③',
    name: 'Radiculopatía Cervical',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Ejercicios de estiramiento cervical suave y estabilización en posición neutra. Evitar compresión foraminal (extensión + rotación ipsilateral). Tracción cervical manual suave si tolera. 3-5 repeticiones de estiramiento suave, 10-15 seg.',
    pronostico: {
      horizonte: 'RM: compresión de raíz o médula. EMG y conducción nerviosa localizan el daño y apoyan el diagnóstico clínico.',
      derivacion: 'Ante cualquier duda de afectación medular → derivar. El aura migrañosa puede presentarse como pérdida de fuerza en el brazo antes de la cefalea, hasta 60 min.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Spurling (Compresión Foraminal)', sn: '38–98%', sp: '84–100%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad para CONFIRMAR diagnóstico. Extensión + inclinación lateral ipsilateral + compresión axial. Positivo: reproduce dolor radicular en el brazo.', fuente: 'Rango de estudios individuales: la técnica y la interpretación varían entre estudios y no hay valor agrupado (Thoomes 2018, Spine J; actualización de 2026, BMC Musculoskelet Disord)' },
      { name: 'Upper Limb Neurodynamic Test (ULNT) 1', sn: '70%', sp: '71%', lr_pos: null, lr_neg: null, criterio: 'Evidencia de baja certeza. Combinación de 4 ULNTs: Sn 97%, Sp 51%.', fuente: 'Thoomes 2018 (Spine J, revisión sistemática; referencia: EMG, imagen o cirugía). Actualización de 2026 (BMC Musculoskelet Disord): mismas cifras agrupadas, certeza baja' },
      { name: 'Shoulder Abduction Relief Test', sn: '49%', sp: '76%', lr_pos: null, lr_neg: null, criterio: 'El paciente coloca la mano ipsilateral sobre la cabeza — si alivia el dolor radicular, positivo.', fuente: 'Thoomes 2018 (Spine J, revisión sistemática; referencia: EMG, imagen o cirugía). Actualización de 2026 (BMC Musculoskelet Disord): mismas cifras agrupadas, certeza baja' },
      { name: 'Reflejos tendinosos (bíceps C6, tríceps C7)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Alta especificidad cuando están reducidos o ausentes. Confirman nivel radicular comprometido.' },
      { name: 'Exploración neurológica: sensibilidad, fuerza y reflejos del miembro superior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Siempre que se sospeche conducción comprometida. Sensibilidad a vibración y temperatura: buscar hipoestesia. Comparar con el lado sano. Si falla la médula (no la raíz) → derivar.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Fuerza del grupo débil con dinamómetro de mano (② medida objetiva)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fuerza del grupo muscular débil con dinamómetro de mano, en la misma posición y frente al lado sano.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce4: {
    id: 'ce4', region: 'cervical', num: '④',
    name: 'Cefalea Cervicogénica',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Entrenamiento de flexores craneocervicales (20-22 mmHg), sostener 5-10 seg. Intensidad submáxima (30-40% CVM). 5-8 repeticiones, 1-2 series. Corrección postural suave. Evitar provocar cefalea durante el ejercicio.',
    pronostico: {
      horizonte: 'La remisión de la cefalea tras tratar el cuello es un buen apoyo diagnóstico. La imagen no confirma ni descarta: solo sirve para descartar patología grave.',
      derivacion: 'Si no cambia al tratar el cuello → revisar ATM y otras formas de cefalea. El 30 % con cervicogénica cumple también criterios de migraña.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Flexión-Rotación Cervical (CFRT)', sn: null, sp: null, lr_pos: '5.0', lr_neg: null, criterio: 'Punto de corte: ≤30° de rotación con cuello en flexión máxima (valor normal >42°). ICC 0.95-0.97 para fiabilidad test-retest. Evidencia de certeza moderada. El test con mayor fiabilidad y precisión diagnóstica según revisión sistemática, y su limitación se correlaciona con el índice de cefalea. Precaución: el patrón de referencia de casi todos los estudios es la exploración manual (fiabilidad pobre, κ 0,28), así que las LR probablemente están sobrestimadas; el rango baja con la edad (explica el 27,9 % de la varianza), con dolor durante la cefalea y a ojo (mejor con goniómetro o CROM); también sale positivo en migraña, más en la crónica. Que reproduzca su cefalea podría mejorar la precisión (solo un estudio lo usó). Solo puntúa positivo: el metaanálisis da S 83 %, E 83 % y LR− 0,2, pero el FRT explora C1–C2 (el metaanálisis lo valida para cervicogénica con origen en C1–C2) y una cervicogénica de C2–C3 o C3–C4 confirmada por bloqueo puede darlo normal, así que un FRT negativo no la descarta (S y E van solo aquí para que no se recalcule la LR−). El metaanálisis considera positivo <45° a cualquier lado; en sus estudios, la rotación media era de 24,5° en el lado sintomático de la cervicogénica frente a 39,1° en otras cefaleas y lados asintomáticos.', fuente: 'Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)' },
      { name: 'PAIVM C0-C3 (segmento C1-C2 más sintomático)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Kappa 0.53-0.72. Hipersensibilidad a la palpación en C1-C2.' },
      { name: 'Cluster: ROM cervical + PAIVM + CCFT', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Patrón de disfunción articular dolorosa palpable en C0–C4 + menos extensión cervical + más actividad del ECM en el CCFT (EMG). En la validación cruzada identificó 17 de 18 cervicogénicas (S 94,4 %) y ninguna falsa entre 112 sin cervicogénica (E 100 %). El artículo lo resume como «S 100 %, E 94 %», con las etiquetas cambiadas respecto a su propia tabla. Cuenta como hallazgo: con E 100 % la LR+ sería infinita; es una función discriminante (pesos continuos, no «tres positivos»), en una sola muestra, que incluye controles sin cefalea, con el tipo de cefalea clasificado por cuestionario (no por bloqueo) y con el CCFT medido por EMG; los autores piden validarlo.', fuente: 'Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST)' },
      { name: 'Examen manual cervical alto', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Buscar reproducción y resolución de la cefalea. ① Gesto testigo: postura o movimiento cervical que desencadena la cefalea, o presión manual mantenida en el segmento alto que la reproduce → EVA de la cefalea. ② Grados del FRT hacia el lado limitado, en supino con flexión cervical completa.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Rasgos de cervicogénica frente a migraña y tensional (tabla orientativa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cervicogénica: al menos 1 por semana de media, duración variable; unilateral sin cambio de lado, no pulsátil, empieza en el cuello, la desencadenan movimientos o posturas cervicales; dolor o rigidez cervical. Migraña: al menos 5 crisis de 4 a 72 h; 2 de 4: moderada o grave, unilateral, pulsátil, empeora con la actividad habitual; foto y fonofobia, o náuseas o vómitos; pródromos, aura (subgrupo) 5–60 min. Tensional: 30 min a 7 días; 2 de 4: bilateral, opresiva no pulsátil, leve o moderada, no empeora con la actividad; como mucho uno entre fotofobia, fonofobia o náusea leve. No sobreestimes el cuello: el dolor de cuello acompañante no confirma nada (lo refiere hasta el 70 % de quienes tienen cefalea frecuente); en cervicogénica persistente, el 44,1 % tenía signos claros de ATM. Descartar abuso de medicación: analgésicos no más de 10–15 días al mes.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, bloque 4, tabla orientativa)' }
    ]
  },
  ce5: {
    id: 'ce5', region: 'cervical', num: '⑤',
    name: 'Trastornos Asociados a Latigazo Cervical (WAD)',
    prom: 'NDI (MCID: 7.5–18 pts) / EVA dolor (MCID: 2.5 pts)',
    dosis: 'Ejercicios de ROM cervical activo suave en todos los planos. ROM sin dolor (0-3/10 VAS), evitando movimientos balísticos o de alta velocidad. 5-10 repeticiones por dirección, 2-3 veces al día. Educación sobre pronóstico favorable.',
    pronostico: {
      horizonte: 'Peor recuperación con síntomas de estrés postraumático, sobre todo de hiperactivación. Baja expectativa de recuperación: factor pronóstico independiente de más discapacidad (OR 4,2). El mecanismo del accidente no predice el daño estructural.',
      derivacion: 'No prejuzgar: un factor de riesgo no condena a un paciente concreto; el miedo suele ceder al bajar el dolor. Mareo tras golpe en cabeza o cuello: pensar también en vestibular, conmoción y disección.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'ROM Cervical Activo (reducción significativa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diferencias de -7° a -90° respecto a dolor cervical no traumático según dirección de movimiento.' },
      { name: 'Risk Assessment Score para WAD agudo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'AUC 0.90 para predecir incapacidad laboral a 1 año. Incluye ROM reducido, dolor intenso y múltiples quejas no dolorosas.' },
      { name: 'Síntomas de hiperalerta / PTSD', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Factor predictivo de discapacidad moderada/severa crónica junto con NDI inicial elevado y edad mayor.' },
      { name: 'Hielo sobre la nuca (hiperalgesia al frío)', sn: null, sp: null, lr_pos: '8.44', lr_neg: null, tipo: 'pronostico', criterio: 'Prono, bolsa con dos cubitos 10 s sobre la nuca a cada lado; el paciente puntúa el dolor de 0 a 10. >5/10 → hiperalgesia al frío (S 42 %, E 95 %, LR+ 8,44, IC 95 % 6,3–11,3; LR− 0,61). Un dolor ≤1/10 la hace improbable (>1: LR− 0,18). La LR es para detectar hiperalgesia al frío, no para diagnosticar el latigazo: no entra en la puntuación. La hiperalgesia al frío temprana predice peor evolución. Fractura e inestabilidad ya descartadas; dosificar la exploración.', fuente: 'Maxwell y Sterling 2013 (Man Ther 18:172–174; 62 con latigazo crónico, grado II–III, 124 lados del cuello; referencia: umbral de dolor al frío ≥13 °C con termotest; orden de los tests no aleatorizado). Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Reposición articular (si hay mareo o inestabilidad)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Error medio de reposición con láser. Síntomas en brazo → ULNT1 y neurológico.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Rotación cervical activa sentado (② medida objetiva)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Misma silla y apoyo (grados). ① Gesto testigo: movimiento activo más doloroso o limitado (p. ej. rotación hacia el peor lado) → EVA.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce6: {
    id: 'ce6', region: 'cervical', num: '⑥',
    name: 'Debilidad Muscular Cérvico-Escapular',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Fortalecimiento isométrico cérvico-escapular de baja carga. Contracciones isométricas al 20-30% CVM, 5-10 seg. 5-8 repeticiones, 1-2 series. En decúbito supino o sedestación con soporte.',
    tests: [
      { name: 'Fuerza de Flexión Cervical (dinamometría)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reducción de -23.81 N en cefalea cervicogénica vs migraña. Medición con dinamómetro isométrico.' },
      { name: 'Fuerza de Extensión Cervical (dinamometría)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reducción de -11.13 N vs controles (-33.70 N a -55.78 N en cefalea cervicogénica).' }
    ]
  },
  ce7: {
    id: 'ce7', region: 'cervical', num: '⑦',
    name: 'Dolor Mecánico Cervical Inespecífico Crónico',
    prom: 'NDI (MCID: 7.5–18 pts) / PSFS',
    dosis: 'Programa combinado de fortalecimiento y estiramiento cérvico-escapular de baja intensidad. 5-8 repeticiones de fortalecimiento al 20-30% CVM, 2-3 estiramientos de 15-20 seg. ROM activo en todos los planos.',
    tests: [
      { name: 'ROM Cervical Activo (reducción en todas las direcciones)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reducción en todas las direcciones comparado con controles asintomáticos. Medición con CROM.' },
      { name: 'Test de reposicionamiento cabeza-neutro', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Alteraciones propioceptivas. Categorías CIF más frecuentes: b134 Funciones del sueño (27.2%) y b710 Movilidad articular (26.2%).' }
    ]
  },
  ce8: {
    id: 'ce8', region: 'cervical', num: '⑧',
    name: 'Mielopatía Espondilótica Cervical',
    prom: 'NDI (MCID: 10.5–17.5 pts según severidad) / mJOA',
    dosis: '⚠️ CONSULTA CON ESPECIALISTA antes de iniciar ejercicios. Si autorizado: ejercicios isométricos cervicales suaves en posición neutra. Evitar flexión cervical extrema. Intensidad mínima: 10-20% CVM. 3-5 repeticiones, 1 serie.',
    tests: [
      { name: 'Signo de Hoffmann', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Percusión del dedo medio — flexión refleja de pulgar e índice. Positivo indica compromiso de motoneurona superior.' },
      { name: 'Clonus de tobillo/muñeca', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Contracciones rítmicas involuntarias al mantener la dorsiflexión pasiva del pie. Indica hiperreflexia.' },
      { name: 'Evaluación de marcha (alteración)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Marcha atáxica o espástica. Signo temprano de mielopatía.' },
      { name: 'Hiperreflexia (ROT aumentados)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reflejos osteotendinosos exaltados en MMII. Signo de compromiso medular.' }
    ]
  },
  ce9: {
    id: 'ce9', region: 'cervical', num: '⑨',
    name: 'Disfunción Postural Cérvico-Torácica',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Retracción cervical suave (chin tucks) en posición neutra. Sostener posición corregida 5-10 seg. 5-10 repeticiones, 3-4 veces al día. Educación sobre ergonomía y pausas posturales.',
    tests: [
      { name: 'Evaluación postural de cabeza adelantada (Forward Head Posture)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reducción del ángulo de lordosis cervical (-0.89° en migraña vs controles). Medición fotografía lateral.' },
      { name: 'Evaluación de cifosis torácica', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Curvatura torácica aumentada asociada a protracción y elevación escapular.' }
    ]
  },
  ce10: {
    id: 'ce10', region: 'cervical', num: '⑩',
    name: 'Disfunción de 1ª Costilla (Articulación Costo-Vertebral Superior)',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Ejercicios respiratorios diafragmáticos suaves. 5-8 respiraciones profundas, 3-4 series al día. Estiramiento suave de escalenos (inclinación lateral contralateral + rotación ipsilateral leve).',
    tests: [
      { name: 'Palpación de 1ª costilla (sensibilidad y restricción)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en literatura. Sensibilidad aumentada y restricción de movilidad a la palpación.', noData: true },
      { name: 'Restricción de rotación cervical ipsilateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La rotación cervical ipsilateral suele estar limitada cuando hay disfunción de 1ª costilla.', noData: true }
    ]
  },
  ce11: {
    id: 'ce11', region: 'cervical', num: '⑪',
    name: 'Fatiga Muscular Cérvico-Escapular',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Ejercicios de resistencia de baja intensidad para musculatura cervico-escapular. Contracciones isométricas al 20-30% CVM, 10-15 seg. 3-5 repeticiones, 1-2 series. Resistencia escapular (retracción, depresión) con banda elástica mínima.',
    tests: [
      { name: 'Test de resistencia de flexores cervicales profundos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tiempo de sostén reducido comparado con normas. Evalúa resistencia de la musculatura profunda.' },
      { name: 'Evaluación de fatiga en actividades funcionales prolongadas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aumento del dolor o deterioro de la postura con actividades sostenidas (trabajo de escritorio, conducción).' }
    ]
  },
  // Síndromes de la tarjeta cervical sin hipótesis previa. Sin dosis en la
  // guía («Dosis y progresión no están en la guía: son tuyas»): dosis ''.
  ce12: {
    id: 'ce12', region: 'cervical', num: '⑫',
    name: 'Dolor Radicular Cervical',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Fase aguda (menos de 1 mes, dolor de brazo por debajo del codo): fisioterapia 2 veces por semana durante 6 semanas (12 sesiones), sin terapia manual, con ejercicio graduado para fortalecer la musculatura cervical superficial y profunda, orientado a movilizar y estabilizar, más ejercicios en casa a diario. Alternativa de eficacia casi igual: collarín semirrígido de día 3 semanas, retirándolo en las 3 siguientes, con reposo. Ambas redujeron el dolor de brazo unos 12 mm (EVA 0–100) más que esperar, a las 6 semanas. La guía limita el collarín a poco tiempo, en fase aguda y solo si no alivian otros tratamientos. Agudo, guía (C): ejercicios de movilización y estabilización, láser y collarín a corto plazo. Crónico, guía (B): tracción cervical mecánica intermitente (la continua no ha mostrado beneficio) combinada con estiramientos y fortalecimiento más movilización o manipulación cervical y torácica; educación para seguir con la actividad laboral y el ejercicio (B). Vigilar la irritabilidad y ajustar la terapia manual y el ejercicio.',
    dosisFuente: 'Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)',
    pronostico: {
      horizonte: 'RM para compromiso de raíz, solo si la exploración lo indica: los cambios son frecuentes en asintomáticos.',
      derivacion: 'Con más dolor y discapacidad aparece sensibilización central: exploración mínima. La espondilosis que avanza puede comprimir la médula.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'ULNT1 (sesgo mediano) con diferenciación estructural', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Positivo si reproduce los síntomas y estos cambian con la diferenciación estructural. Es el más estudiado (el capítulo no da cifras; las agrupadas del ULNT1 son para radiculopatía y puntúan allí). Si hay adormecimiento o debilidad, pasar a la radiculopatía.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Movilidad cervical que dispara el dolor de brazo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Qué movimiento dispara el dolor de brazo y cuánto se tolera. ① Gesto testigo: movimiento cervical que dispara el dolor de brazo (p. ej. extensión), o ULNT1 hasta una posición fija → EVA del brazo.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Grados de extensión de codo en el ULNT1 (② medida objetiva)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Grados de extensión de codo en el ULNT1 en que aparecen los síntomas, con hombro, muñeca y cuello en posición fija.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Rasgos neuropáticos (quemazón o descargas)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Que el dolor llegue al hombro o al brazo no lo convierte en radicular: C4–5 se refiere a cuello y hombro, y C5–6 a C7–T1 a cuello, hombro y brazo. Separan los rasgos neuropáticos y la diferenciación estructural del ULNT1.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce13: {
    id: 'ce13', region: 'cervical', num: '⑬',
    name: 'Mareo Cervicogénico',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: '',
    pronostico: {
      horizonte: 'Identificar la fuente del mareo es clave para que el manejo funcione.',
      derivacion: 'Vértigo rotatorio → vestibular. Golpe en cabeza o cuello → conmoción. Visión doble verdadera en mayores → IVB; súbito en jóvenes → disección. Los dos últimos, urgencias.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Descartar lo vascular (5 D y 3 N, disección)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Primero descartar lo vascular. Si hay signos vasculares → urgencias hoy (fase 2).', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Sentido de posición articular (error de reposición)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ojos cerrados, rotación a cada lado y extensión, y volver a la posición natural. Error >4–5° = déficit. Con láser en cinta de cabeza y diana, al menos 3 intentos por movimiento y hacer la media.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Movimiento o postura que desencadena el mareo (① gesto testigo)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movimiento o postura cervical que desencadena el mareo → EVA del mareo. ② Error medio de reposición en grados por movimiento (rotación derecha, izquierda, extensión), sentado a la misma distancia de la diana.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce14: {
    id: 'ce14', region: 'cervical', num: '⑭',
    name: 'Dolor Cervical Idiopático',
    prom: 'NDI (MCID: 7.5–18 puntos) / PSFS',
    dosis: '',
    pronostico: {
      horizonte: 'Recurrente: tras un episodio, el 50–85 % vuelve a tener dolor en meses o pocos años. Radiografía solo con indicación concreta de la exploración: hay dolor sin cambios y cambios sin dolor.',
      derivacion: 'Dolor constante y sordo → componente inflamatorio. Dolor que no cambia con postura, movimiento ni reposo → banderas rojas. Espondilosis avanzada: posible radiculopatía o mielopatía.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tarea provocadora (① gesto testigo)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Que muestre la actividad que le duele; modificar la postura y ver el efecto inmediato. Tarea o postura provocadora que el paciente demuestra (rotación al lado del dolor, mirar al techo, postura de ordenador un tiempo fijo) → EVA.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Movilidad activa en los tres planos y las tres regiones', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Extensión: la cabeza debe pasar por detrás del plano de los hombros. Rotación: giro libre en los primeros 30° = craneocervical sin gran alteración; restricción precoz → problema craneocervical. ② Rotación cervical activa hacia el lado limitado, sentado con la espalda apoyada (inclinómetro).', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Test de flexión-rotación (FRT) si es craneocervical', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'FRT <30° o 10° de asimetría → craneocervical (C1–2). ② Si es craneocervical: grados del FRT en supino. Su evidencia diagnóstica es para cefalea cervicogénica: aquí cuenta como hallazgo.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Extensión-rotación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Positiva + disfunción segmentaria palpable y dolorosa → faceta cervical.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Examen manual segmentario', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Disfunción segmentaria palpable y dolorosa. La palpación va la última.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
};
