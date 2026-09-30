// ============================================================
// PhysiQ-Assessment · data/hombro.js
// Contenido clínico de la región HOMBRO: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO, DOSIS_DERIVAR } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.hombro
export const screening = {
  label: 'Hombro y Cuadrante Superior',
  sistemas: [
    {
      id: 'h_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Historia personal de cáncer o tratamiento oncológico (quimio, radioterapia)',
        'Dolor nocturno constante que despierta al paciente sin alivio con cambio de postura',
        'Ganglios linfáticos duros, fijos e indoloros en axila o cuello',
        'Tumor de Pancoast: dolor irradiado a escápula, cuello, axila o cara medial del brazo',
        'Tumor (tarjeta de consulta): antecedente de cáncer, pérdida de peso inexplicada, dolor sin relación con el movimiento o implacable, dolor nocturno o en reposo con síntomas sistémicos, masa o deformidad inexplicada. Raros en clavícula distal y acromion; pensar en ellos si hay dolor nocturno + síntomas sistémicos.'
      ],
      banderasAmarillas: [
        'Edad >50 años con dolor insidioso sin causa mecánica clara',
        'Debilidad muscular proximal idiopática'
      ],
      preguntas: [
        { id: 'h3', text: '¿Tiene antecedentes de cáncer de cualquier tipo, o ha recibido quimioterapia, radioterapia o terapia hormonal?', alerta: true, s1: true },
        { id: 'h4', text: '¿El dolor nocturno lo despierta desde un sueño profundo y le es imposible encontrar una posición que lo alivie para volver a dormir?', alerta: true, s1: true },
        { id: 'h6', text: '¿Ha notado pérdida de peso reciente, rápida y sin proponérselo (ej. 5–7 kg en pocas semanas)?', alerta: true, s1: true }
      ],
      zonasDolor: [
        { zona: 'Cintura escapular / Axila', desc: 'Tumor de Pancoast apical, cáncer de mama, linfomas' },
        { zona: 'Cara medial del brazo', desc: 'Distribución del nervio cubital (C8, T1, T2) — Pancoast' },
        { zona: 'Columna torácica', desc: 'Metástasis vertebrales T4-T10; cánceres de mama, próstata, pulmón' }
      ],
      impactoDescanso: [
        'Dolor óseo nocturno de tipo "taladro" que no cede al acostarse ni cambiar postura',
        'Sudoraciones masivas y fiebres fragmentan el descanso severamente'
      ],
      impactoEjercicio: [
        'Fatiga oncológica extrema independiente del nivel de actividad, sin alivio con reposo',
        'Debilidad muscular proximal (neuromiopatía carcinomatosa) — dificultad para elevar el brazo',
        'Anemia secundaria a quimio/radio: taquicardia, disnea y mareos al esfuerzo mínimo',
        'Ejercicio vigoroso contraindicado si plaquetas <50.000/mm³ o hemoglobina <10 g/dL'
      ]
    },
    {
      id: 'h_cardio', icon: '❤️', nombre: 'Cardiovascular',
      banderasRojas: [
        'Dolor de hombro que aumenta con esfuerzo físico NO relacionado con el brazo (subir escaleras)',
        'Dolor acompañado de sudores, náuseas, opresión en mandíbula o pecho',
        'Angina no aliviada por reposo o nitroglicerina (>20 min)',
        'Síncope repentino sin mareo previo'
      ],
      banderasAmarillas: [
        'Dolor que cambia al acostarse o con falta de aire en reposo',
        'Uso de betabloqueantes o inhibidores de la ECA'
      ],
      preguntas: [
        { id: 'h1', text: '¿El dolor de hombro aumenta con el esfuerzo físico general (subir escaleras, caminar) aunque no mueva los brazos?', alerta: true, s1: true },
        { id: 'h2', text: '¿El dolor se acompaña de sudores repentinos, náuseas o sensación opresiva en mandíbula/pecho?', alerta: true, s1: true },
        { id: 'h_c3', text: '¿El dolor cambia o empeora al acostarse, o siente falta de aire en reposo?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'IAM / Angina', desc: 'Retroesternal → cuello, mandíbula, escápulas, hombro izquierdo (distribución n. cubital)' },
        { zona: 'Pericarditis', desc: 'Esternón → cuello, trapecio superior, área supraclavicular izquierda' }
      ],
      impactoDescanso: [
        'Angina nocturna (a menudo desencadenada por sueños) interrumpe el descanso',
        'Ortopnea: obliga a dormir sentado o con muchas almohadas'
      ],
      impactoEjercicio: [
        'Isquemia miocárdica limita el ejercicio; empeora en frío y con brazos sobre la cabeza',
        'Betabloqueantes impiden subida normal de FC: dosificar por esfuerzo percibido',
        'Hipotensión ortostática tras el ejercicio — monitorizar al incorporarse'
      ]
    },
    {
      id: 'h_pulmonar', icon: '🫁', nombre: 'Pulmonar',
      banderasRojas: [
        'Dolor de hombro que empeora al toser, reír o respirar profundamente',
        'Dolor que mejora al aguantar la respiración o acostarse sobre el lado afectado (autosplinting)',
        'Hemoptisis (esputo con sangre), tos persistente',
        'Disnea inexplicada en reposo o mínimo esfuerzo'
      ],
      banderasAmarillas: [
        'Historia de tabaquismo (paquetes-año)',
        'Exposición a factores ambientales/ocupacionales tóxicos',
        'Antecedentes de cáncer que puede metastatizar a pulmón'
      ],
      preguntas: [
        { id: 'h5', text: '¿El dolor de hombro o espalda empeora al toser, reír, estornudar o tomar una respiración profunda?', alerta: true, s1: true },
        { id: 'h_p2', text: '¿Siente falta de aire en reposo, al acostarse, o con mínimo esfuerzo?', alerta: true },
        { id: 'h_p3', text: '¿Ha notado sangre o mucosidad de color inusual (verde/oxidado) al toser, o tiene tos persistente de reciente aparición?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'Hombro ipsilateral', desc: 'Irritación del nervio frénico — pleura parietal o diafragma' },
        { zona: 'Cara medial del brazo', desc: 'Tumor de Pancoast (C8, T1, T2) — simula compromiso neurológico' },
        { zona: 'Escápula / Trapecio', desc: 'Irradiación de patología pleural o pulmonar' }
      ],
      impactoDescanso: [
        'Ortopnea (incapacidad para respirar acostado) obliga a dormir sentado',
        'Autosplinting: paciente adopta decúbito sobre lado afectado para limitar expansión torácica',
        'Tos nocturna persistente y sudores (tuberculosis, cáncer) fragmentan el descanso'
      ],
      impactoEjercicio: [
        'Disnea de esfuerzo e hipoxia restringen drásticamente la tolerancia al ejercicio',
        'Ejercicio puede desencadenar broncoespasmo (asma), dolor pleural o hemoptisis',
        'En EPOC con retención de CO2: exceso de O2 suplementario puede deprimir el impulso respiratorio'
      ]
    },
    {
      id: 'h_renal', icon: '🫘', nombre: 'Renal / Urológico',
      banderasRojas: [
        'Prueba de percusión de Murphy positiva (ángulo costovertebral)',
        'Hematuria (sangre en orina)',
        'Fiebre y escalofríos acompañando el dolor (pielonefritis)'
      ],
      banderasAmarillas: [
        'Dolor de hombro que no cambia con ninguna postura ni movimiento del brazo',
        'Cambios en el color, olor o cantidad de orina',
        'Antecedentes de cálculos renales'
      ],
      preguntas: [
        { id: 'h_r1', text: '¿Ha notado cambios en la orina (color rojo, marrón, turbio, olor fuerte) o tiene fiebre/escalofríos junto con el dolor?', alerta: true, s1: true },
        { id: 'h_r2', text: '¿El dolor de hombro es constante y no cambia al mover el brazo ni al cambiar de postura?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'Hombro ipsilateral', desc: 'Riñones: presión sobre diafragma irradia por nervio frénico' },
        { zona: 'Ángulo costovertebral', desc: 'Región posterior subcostal — dolor renal primario' },
        { zona: 'Flanco → ingle', desc: 'Cólico ureteral irradiado' }
      ],
      impactoDescanso: [
        'Dolor renal constante sin alivio postural — impide conciliar el sueño',
        'Nicturia fragmenta el ciclo de sueño'
      ],
      impactoEjercicio: [
        'Insuficiencia renal crónica: anemia con fatiga extrema y letargo',
        'Infecciones sistémicas: fiebre y malestar limitan la tolerancia a la carga'
      ]
    },
    {
      id: 'h_gine', icon: '🌸', nombre: 'Ginecológico',
      banderasRojas: [
        'Embarazo ectópico: dolor pélvico unilateral severo con sangrado y hombro ipsilateral (signo de Kehr)',
        'Dolor de hombro izquierdo de aparición súbita con hipotensión (rotura de trompa)',
        'Sangrado vaginal inusual acompañando el dolor de hombro'
      ],
      banderasAmarillas: [
        'Dolor de hombro relacionado temporalmente con el ciclo menstrual',
        'Antecedentes de enfermedad inflamatoria pélvica (EPI)'
      ],
      preguntas: [
        { id: 'h_g1', text: '¿El dolor de hombro apareció de forma súbita y se acompaña de dolor pélvico, sangrado vaginal inusual o mareos intensos?', alerta: true, s1: true },
        { id: 'h_g2', text: '¿El dolor de hombro tiene alguna relación con su ciclo menstrual o ha tenido alguna infección pélvica reciente?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'Hombro izquierdo', desc: 'Embarazo ectópico roto — sangre intraabdominal irrita el diafragma (Signo de Kehr)' },
        { zona: 'Pelvis / Fosa ilíaca', desc: 'Dolor primario pélvico de origen ginecológico' }
      ],
      impactoDescanso: [
        'Dolor agudo pélvico e irradiado impide el descanso — cuadro de urgencia'
      ],
      impactoEjercicio: [
        'Embarazo ectópico: contraindicación absoluta de cualquier actividad — urgencia médica'
      ]
    },
    {
      id: 'h_gi', icon: '🫃', nombre: 'GI / Hepático',
      banderasRojas: [
        'Dolor de hombro derecho que no responde a terapia mecánica alguna',
        'Ictericia (piel/ojos amarillentos) u orina oscura con heces claras',
        'Rotura esplénica (signo de Kehr): dolor en hombro izquierdo por sangre intraabdominal'
      ],
      banderasAmarillas: [
        'Dolor relacionado con la ingesta de comidas grasas',
        'Saciedad precoz, distensión o sensación de hinchazón postprandial',
        'Uso de estatinas, AINEs crónicos o alcohol'
      ],
      preguntas: [
        { id: 'h_gi1', text: '¿El dolor de hombro aumenta o aparece 1-2 horas después de comer, especialmente comidas grasas?', alerta: true, s1: true },
        { id: 'h_gi2', text: '¿Ha notado cambios en el color de la orina (más oscura, como té o cola) o en las heces (muy claras, como arcilla)?', alerta: true },
        { id: 'h_gi3', text: 'Si toma antiinflamatorios (AINEs), ¿el dolor de hombro aumenta en las horas siguientes en vez de mejorar?', alerta: true }
      ],
      zonasDolor: [
        { zona: 'Hombro derecho', desc: 'Colecistitis, vesícula biliar, hígado (n. frénico → diafragma)' },
        { zona: 'Hombro izquierdo', desc: 'Rotura esplénica / bazo — Signo de Kehr' },
        { zona: 'Zona interescapular', desc: 'Columna T4-T8 o T7-T10, hacia derecha de la línea media (hepático/biliar)' }
      ],
      impactoDescanso: [
        'Dolor sordo y constante en reposo (tumores hepáticos/distensión de cápsula) interrumpe el sueño',
        'Prurito persistente por acumulación de toxinas o ictericia colestásica dificulta el descanso'
      ],
      impactoEjercicio: [
        'Ejercicio intenso contraindicado con ictericia o enfermedad hepática activa',
        'En casos severos (estatinas), esfuerzo puede desencadenar rabdomiólisis',
        'Flujo sanguíneo hepático disminuye con ejercicio moderado — ajustar cargas'
      ]
    },
    // Tarjeta hombro (guía de consulta), BANDERAS: las tres filas que no
    // cubría ningún sistema. Sin `urgencia`: la tarjeta no tiene URGENCIA
    // (en hombro las banderas van a derivación médica, no a urgencias hoy).
    {
      id: 'h_trauma', icon: '🦴', nombre: 'Traumático (Fractura o Luxación)',
      banderasRojas: [
        'Fractura o luxación no reducida: traumatismo previo (caída sobre el hombro o el codo), pérdida aguda de movilidad, deformidad, osteoporosis. Ayuda en consulta: test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'h_t1', text: '¿Tras una caída sobre el hombro o el codo, perdió de golpe movilidad del brazo o nota el hombro deformado? (Tener en cuenta la osteoporosis.)', alerta: true, s1: true }
      ]
    },
    {
      id: 'h_infeccion', icon: '🌡️', nombre: 'Infección / Sistémico',
      banderasRojas: [
        'Infección o sistémico: fiebre, sensación de estar enfermo, cambios en la piel (aspecto, erupciones, sudoración), hematomas inexplicados, dolor en otras partes del cuerpo. Preguntar siempre por el estado general reciente.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'h_i1', text: '¿Ha tenido fiebre o se ha sentido enfermo últimamente, o ha notado cambios en la piel (aspecto, erupciones, sudoración), hematomas sin motivo o dolor en otras partes del cuerpo?', alerta: true, s1: true }
      ]
    },
    {
      id: 'h_neuro', icon: '🧠', nombre: 'Neurológico',
      banderasRojas: [
        'Lesión neurológica: déficit motor o sensitivo significativo, atrofia. Exploración neurológica breve: sensibilidad, fuerza y reflejos.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'h_n1', text: '¿Ha perdido fuerza o sensibilidad de forma importante en el brazo o la mano, o nota algún músculo del hombro o del brazo más delgado que el del otro lado?', alerta: true, s1: true }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.hombro
export const tree = {
  title: 'Algoritmo CIF — Hombro',
  steps: [
    {
      id: 'h_step1',
      tag: 'Paso 1 — Cribado Proximal (Clearing)',
      question: '¿El dolor se reproduce con movimientos cervicales, compresión axial o palpación de la primera costilla?',
      options: [
        { label: 'SÍ — Reproducción con movimientos cervicales (test de Spurling o similar)', value: 'cervical', next: null, hypothesis: ['h6'] },
        { label: 'SÍ — Restricción de movilidad en 1ª costilla y dolor en zona de transición', value: '1costilla', next: null, hypothesis: ['h9'] },
        { label: 'NO — No se reproduce con cervical ni 1ª costilla', value: 'no', next: 'h_step2', hypothesis: [] }
      ]
    },
    {
      id: 'h_step2',
      tag: 'Paso 2 — Movilidad Global (PROM)',
      question: '¿Existe una restricción GLOBAL de la movilidad pasiva, especialmente en rotación externa?',
      options: [
        // Bisagra de la tarjeta (nodo 2): el SÍ ya no activa h1 por sí solo,
        // lo reparte h_step2b entre congelado, artrosis GH y luxación/fractura.
        { label: 'SÍ — Abducción pasiva <80° y pérdida severa de rotación externa', value: 'si', next: null, hypothesis: [] },
        { label: 'NO — Movilidad pasiva mayormente preservada', value: 'no', next: 'h_step3', hypothesis: [] }
      ]
    },
    {
      // Tarjeta hombro, nodo 2b. Solo se llega por el SÍ de h_step2 (el NO
      // salta a h_step3); de aquí se sigue a h_step3 como antes.
      id: 'h_step2b',
      tag: 'Paso 2b — Rigidez activa = pasiva',
      question: 'La movilidad pasiva GH (sobre todo la RE) está limitada igual que la activa. ¿Hubo traumatismo previo?',
      options: [
        { label: 'SÍ — Traumatismo previo → luxación bloqueada o fractura → Rx', value: 'trauma', next: null, hypothesis: ['h11'] },
        { label: 'NO — Mayor edad + crepitación → artrosis GH (Rx)', value: 'artrosis', next: null, hypothesis: ['h10'] },
        { label: 'NO — Resto → hombro congelado', value: 'congelado', next: null, hypothesis: ['h1'] }
      ]
    },
    {
      id: 'h_step3',
      tag: 'Paso 3 — Localización y Mecanismo',
      question: '¿El dolor está localizado en la parte superior (AC) o hubo un evento traumático con sensación de inestabilidad?',
      options: [
        { label: 'Dolor en articulación acromioclavicular (parte superior)', value: 'ac', next: null, hypothesis: ['h7'] },
        { label: 'Evento traumático / "Pop" con sensación de inestabilidad anterior', value: 'trauma_ant', next: null, hypothesis: ['h4'] },
        { label: 'Evento traumático / dolor profundo, síntomas de labrum (chasquidos)', value: 'trauma_lab', next: null, hypothesis: ['h5'] },
        { label: 'Episodio concreto o aprensión (inestabilidad anterior o posterior, también sin «pop» traumático)', value: 'inestab', next: null, hypothesis: ['h4'] },
        { label: 'Ninguno de los anteriores', value: 'no', next: 'h_step4', hypothesis: [] }
      ]
    },
    {
      id: 'h_step4',
      tag: 'Paso 4 — Integridad del Manguito Rotador',
      question: '¿Hay dolor durante la elevación y/o déficits de fuerza?',
      options: [
        { label: 'Dolor con fuerza preservada — Arco doloroso presente, tests de Hawkins/Neer positivos, sin debilidad marcada', value: 'dolor_fuerza', next: null, hypothesis: ['h2'] },
        { label: 'Dolor CON debilidad evidente — Posible caída del brazo o lag signs', value: 'debilidad', next: null, hypothesis: ['h3'] },
        { label: 'Sin dolor claro ni debilidad en elevación', value: 'no', next: 'h_step5', hypothesis: [] }
      ]
    },
    {
      id: 'h_step5',
      tag: 'Paso 5 — Control Motor Escapular',
      question: '¿Se observa asimetría o "winging" escapular durante el movimiento activo?',
      options: [
        { label: 'SÍ — Asimetría visual en la elevación o test de asistencia escapular positivo', value: 'si', next: null, hypothesis: ['h8'] },
        { label: 'NO — Sin alteración escapular evidente', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── HOMBRO ─────────────────────────────────────────────
  h1: {
    id: 'h1', region: 'hombro', num: '①',
    name: 'Capsulitis Adhesiva',
    prom: 'SPADI (MCID: 14.9–25.4 puntos)',
    dosis: 'Movilizaciones pasivas grado I-II de Maitland en rotación externa, limitadas al 50% del rango disponible sin dolor (≈10-15° desde posición neutra). Evitar estiramiento capsular agresivo. 3 series × 10 repeticiones, 2 veces al día.',
    pronostico: {
      horizonte: 'Se suele decir que se resuelve en 2–3 años, pero un 41 % sigue con síntomas a los 4 años y la mitad a los 7. No hay evidencia de que avance por estadios hasta curarse sin tratamiento. Rx normal salvo osteopenia o calcificación; RM no necesaria.',
      derivacion: 'Ejercicio en grupo supervisado: mejores resultados que el individual y que el ejercicio en casa. Derivar a psicología si los factores psicosociales superan tu competencia. Baja autoeficacia predice peor evolución. Contralateral en el 6–34 %.',
      fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)'
    },
    tests: [
      { name: 'Abducción pasiva glenohumeral <80°', sn: '83-100% VPP (para capsulitis confirmada por volumen capsular <12 mL)', sp: null, lr_pos: null, lr_neg: null, criterio: 'Abducción pasiva glenohumeral menor de 80° confirma capsulitis con alta probabilidad post-test.' },
      { name: 'Test de Rotación Externa (brazo neutro al lado, codo 90°)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en la literatura actual. Positivo cuando reproduce dolor.', noData: true },
      { name: 'Restricción equivalente activa y pasiva (criterio de Bunker)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Restricción equivalente de movilidad activa y pasiva: es el dato que más discrimina. La RE se considera la más afectada, pero la RI suele estar muy limitada con el brazo cerca de 90° de abducción. Criterio de Bunker: restricción igual de RE activa y pasiva + Rx esencialmente normal. No usar en hombro congelado: test específicos de MR, labrum o AC — casi siempre salen positivos al tensar una cápsula sensibilizada.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Final del rango de RE pasiva → EVA (más útil cuando dolor > rigidez). ② RE pasiva en grados a 0° de abducción y RI a 90° de abducción (más útil cuando rigidez > dolor).', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h2: {
    id: 'h2', region: 'hombro', num: '②',
    name: 'Síndrome de Pinzamiento Subacromial (Impingement)',
    prom: 'QuickDASH (MCID: 8.0–15.9 puntos)',
    dosis: 'Ejercicios de rotación externa isométrica submáxima (20% CVM) con brazo en aducción y rotación neutra, evitando elevación >60°. 3 series × 10 segundos de contracción, descanso 30 segundos.',
    pronostico: {
      horizonte: 'Una rotura completa del supraespinoso en ecografía aumenta la probabilidad, pero la imagen no mejora la capacidad de descartarlo.',
      derivacion: 'Dolor en reposo: puede indicar bursitis o proceso inflamatorio que tolere mal el movimiento vigoroso → dosificar. La idea de «espacio subacromial estrecho» es controvertida.',
      fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)'
    },
    tests: [
      { name: 'Arco doloroso', sn: '53%', sp: '76%', lr_pos: '2.25', lr_neg: '0.62', criterio: 'Dolor durante la elevación activa entre 60° y 120°. Metaanálisis de 4 estudios (n = 756): LR+ 2,25 (IC 1,24–4,08), LR− 0,62 (IC 0,37–1,03). Sirve algo para confirmar; un negativo es solo un hallazgo.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Test de Hawkins-Kennedy', sn: '80%', sp: '56%', lr_pos: '1.84', lr_neg: '0.35', criterio: 'Flexión de hombro a 90°, rotación interna forzada. Positivo si reproduce dolor subacromial. Metaanálisis de 7 estudios (n = 944): LR+ 1,84 (IC 1,49–2,26), LR− 0,35 (IC 0,27–0,46). Sirve para descartar; un positivo es solo un hallazgo.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Test de Neer', sn: '72%', sp: '60%', lr_pos: '1.79', lr_neg: '0.47', criterio: 'Elevación pasiva en el plano escapular con rotación interna. Parte del cluster diagnóstico (≥3/5 tests positivos: AUC 0.79). Metaanálisis de 7 estudios (n = 946): LR+ 1,79 (IC 1,24–2,58), LR− 0,47 (IC 0,39–0,56). Sirve para descartar; un positivo es solo un hallazgo.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Test de Resistencia a Rotación Externa', sn: '63%', sp: '75%', lr_pos: '2.6', lr_neg: '0.49', criterio: 'Contracción isométrica de rotación externa contra resistencia. Positivo si reproduce dolor.' },
      { name: 'Regla clínica de SAPS', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Descartar primero capsulitis (RE pasiva), origen cervical y dolor postraumático. Dolor o debilidad al elevar el brazo; el dolor debe reproducirse de forma consistente con los test resistidos. Regla clínica: SAPS probable si no hay pérdida de RE pasiva y hay dolor anterior, lesión por sobreesfuerzo y ausencia de síntomas en RE final en abducción.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Elevación en el plano de la escápula o RE resistida que reproduce el dolor → EVA. ② Fuerza isométrica en RE con dinamómetro si se dispone (brazo junto al cuerpo, codo a 90°) o grados de elevación activa hasta el dolor.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h3: {
    id: 'h3', region: 'hombro', num: '③',
    name: 'Rotura del Manguito Rotador',
    prom: 'SPADI (MCID: 14.9–25.4 pts) o ASES (MCID: 9–26.9 pts)',
    dosis: 'Isométricos de rotación externa en posición neutra (brazo al lado, codo 90°) al 15% CVM, sin elevación del brazo. 3 series × 8 repeticiones × 6 segundos, descanso 60 segundos entre series.',
    pronostico: {
      horizonte: 'RM como referencia: rotura completa S 90 %, E 100 %; parcial S 100 %, E 87 %. No se observa curación espontánea y el tamaño puede aumentar en unos 2 años, también en asintomáticas.',
      derivacion: 'Alrededor del 40 % de la población tiene roturas asintomáticas: la rotura no explica por sí sola el dolor. La degeneración crece desde los 50–55 años mientras el dolor no traumático baja a partir de los 60–65.',
      fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Lata Vacía (Empty Can)', sn: '71%', sp: '49%', lr_pos: '1.3', lr_neg: null, criterio: 'Resistencia a abducción con el brazo a 90° en el plano escapular y rotación interna (pulgar hacia abajo). Positivo: dolor o debilidad.' },
      { name: 'Test de Lata Llena (Full Can)', sn: '75%', sp: '68%', lr_pos: '2.4', lr_neg: null, criterio: 'Resistencia a abducción con el brazo a 90° y rotación externa (pulgar hacia arriba). Positivo: dolor o debilidad.' },
      { name: 'External Rotation Lag Sign', sn: '47%', sp: '94%', lr_pos: '7.2', lr_neg: null, criterio: 'Alta especificidad para roturas completas. Imposibilidad de mantener la rotación externa pasivamente colocada.' },
      { name: 'Internal Rotation Lag Sign', sn: '97%', sp: '83%', lr_pos: '5.6', lr_neg: null, criterio: 'Alta sensibilidad para roturas completas. Imposibilidad de mantener la rotación interna contra gravedad.' },
      { name: 'Drop Arm Test', sn: '24%', sp: '93%', lr_pos: '3.3', lr_neg: null, criterio: 'El brazo abducido a 90° no puede mantenerse — cae. Alta especificidad para rotura masiva.' },
      { name: 'Inspección', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Brazo en cabestrillo, escápula en rotación inferior o inclinación anterior, cabeza humeral anteriorizada.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Cluster A, confirmar: arco doloroso + drop arm + debilidad en RE, los tres positivos', sn: null, sp: null, lr_pos: '15.57', lr_neg: null, absorbe: [2, 4, 8], criterio: 'Rotura COMPLETA si los tres son positivos: 50 de 153 roturas completas frente a 4 de 195 controles → LR+ 15,57 (con dos de tres, LR+ 3,57). Arco doloroso: dolor o enganche entre 60° y 120° de elevación activa en el plano de la escápula, al subir o al bajar. Drop arm: al bajar el brazo desde la elevación completa, cae de golpe o duele mucho. Debilidad en RE (infraespinoso): codo a 90° junto al cuerpo, rotación neutra; positivo si cede por debilidad o dolor, o si hay signo de retraso en RE. Población quirúrgica (controles: otras cirugías de hombro, incluida la bursitis y la rotura parcial). Si puntúa, el drop arm, el signo de retraso en RE y el cluster B no suman aparte.', fuente: 'Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)' },
      { name: 'Cluster A, descartar: arco doloroso, drop arm y debilidad en RE, los tres negativos (si se cumple, marcar «Negativo»)', sn: null, sp: null, lr_pos: null, lr_neg: '0.16', absorbe: [4], criterio: 'Los tres negativos: 14 de 153 roturas completas frente a 114 de 195 controles → LR− 0,16 para rotura completa. Misma técnica que el cluster A de confirmar. Un positivo aquí es solo un hallazgo.', fuente: 'Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)' },
      { name: 'Cluster B: debilidad en RE + edad ≥65 (puntuación de Litaker ≥4)', sn: null, sp: null, lr_pos: '5.0', lr_neg: null, criterio: 'Puntuación: debilidad en RE 2 puntos + edad ≥65 años 2 + dolor nocturno 1; positivo con ≥4, así que basta con debilidad en RE y edad ≥65 (el dolor nocturno no hace falta). Debilidad en RE: brazos junto al cuerpo, codos a 90°, pulgares arriba y 20° de rotación interna; resistir el empuje hacia dentro. Dolor nocturno: se duerme, pero el dolor le despierta. LR+ 9,8 en el grupo de derivación (43 de 131 frente a 2 de 60); en el de validación baja a 5,0 (52 de 146 frente a 5 de 70, calculada de la tabla 4): se usa esta, como dice la tarjeta. Rotura parcial o completa por artrografía, en una consulta de cirugía de hombro. No publica LR−.', fuente: 'Litaker 2000 (J Am Geriatr Soc; n = 448 derivados a artrografía, 67 % con rotura; tabla 4, grupo de validación)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Elevación activa o arco doloroso → EVA. ② Fuerza isométrica en RE con dinamómetro si se dispone (brazo junto al cuerpo, codo a 90°) o grados de elevación activa.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h4: {
    id: 'h4', region: 'hombro', num: '④',
    name: 'Inestabilidad Glenohumeral (Anterior o Posterior)',
    prom: 'DASH (MCID: 10.8 pts) o QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Isométricos de rotadores externos en posición de seguridad (brazo en aducción, rotación neutra). Contracción al 20% CVM, sin movimiento glenohumeral. 3 series × 10 segundos, descanso 45 segundos.',
    pronostico: {
      horizonte: 'Diagnóstico sobre todo clínico; la Rx simple puede identificar Bankart y Hill-Sachs. A las 3–4 semanas del episodio agudo hay poco dolor y recuperan movilidad y fuerza.',
      derivacion: 'La MDI se confunde con inestabilidad unidireccional, SAPS, patología discal cervical, plexitis braquial y desfiladero torácico. Tener presente Ehlers-Danlos o Marfan.',
      fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Aprehensión', sn: '65.6%', sp: '95.4%', lr_pos: '17.21', lr_neg: '0.39', criterio: 'Criterio: APREHENSIÓN (no solo dolor). Brazo a 90° abducción + rotación externa progresiva. El paciente siente que el hombro "se va a salir". Metaanálisis de 2 estudios (n = 409): LR+ 17,21 (IC 10,02–29,55), LR− 0,39 (IC 0,22–0,68).', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Test de Recolocación (Jobe)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tras el test de aprehensión, se aplica fuerza posterior en la cabeza humeral. Positivo si desaparece la aprehensión. Metaanálisis de 3 estudios (n = 509), con heterogeneidad significativa: S 64,6 %, E 90,2 %, LR+ 5,48 (IC 0,56–53,8), LR− 0,55 (IC 0,24–1,27). Los dos intervalos incluyen el 1: no puntúa (S y E solo aquí, para que no se recalcule la LR).', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Test de Liberación/Release/Surprise', sn: null, sp: null, lr_pos: null, lr_neg: '0.25', criterio: 'Se retira la fuerza de recolocación súbitamente — reaparece la aprehensión. Metaanálisis de 2 estudios (n = 128): S 81,8 %, E 86,1 %, LR+ 5,42 (IC 0,96–30,52), LR− 0,25 (IC 0,08–0,78). Solo puntúa negativo: el IC de la LR+ incluye el 1. Es el test de los tres que mejor descarta.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Anterior: aprensión, recolocación y sorpresa en conjunto', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aprensión, recolocación y sorpresa (S y E >72 %). Interpretar la aprensión, no el dolor. Cada test ya puntúa por separado arriba; esta fila no multiplica.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Posterior: Jerk, Kim y signo de pinzamiento posterior agrupados', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'No usar un test aislado; agrupar Jerk, Kim y signo de pinzamiento posterior junto con la historia.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Aprensión de 0 a 10 en abducción + RE; en posterior, la posición provocadora. ② Fuerza isométrica de RE y RI con dinamómetro si se dispone, siempre en la misma posición.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h5: {
    id: 'h5', region: 'hombro', num: '⑤',
    name: 'Lesión Labral Superior (SLAP)',
    prom: 'DASH (MCID: 10.8 pts) o QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Estabilización escapular en cadena cerrada (apoyo de manos en pared, protracción escapular controlada) sin carga axial sobre complejo bicipital-labral. ROM limitado a 0-30° de flexión glenohumeral. 3 series × 8 repeticiones lentas.',
    pronostico: {
      horizonte: 'La artro-RM es más precisa que la RM sin contraste.',
      derivacion: 'El SLAP aislado es raro y es frecuente en asintomáticos: tratarlo solo tiene sentido si explica los síntomas. Suele acompañar a rotura del MR, inestabilidad, rotura del bíceps o bursitis.',
      fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de O\'Brien (Active Compression)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión a 90°, aducción horizontal 10°, rotación interna (pulgar abajo) — resistencia. Luego igual con rotación externa. Positivo: dolor que desaparece o disminuye en supinación. Tarjeta de consulta: ningún hallazgo físico es específico; sirve para sostener la hipótesis, no para confirmarla. Metaanálisis de 6 estudios (n = 782), sin el estudio original de O’Brien, que distorsionaba el resultado: S 0,67, E 0,37, LR+ 1,06 (IC 0,90–1,25), LR− 0,89 (IC 0,67–1,20). No puntúa: antes multiplicaba por el extremo bajo de «3–50», sin fuente.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Biceps Load Test II', sn: null, sp: null, lr_pos: '26', lr_neg: null, criterio: 'Alta LR+ pero evaluado principalmente por diseñadores del test. Flexión de codo a 120°, resistencia a supinación con hombro a 90° abd.' },
      { name: 'Test de Resistencia a Rotación Interna', sn: null, sp: null, lr_pos: '25', lr_neg: null, criterio: 'Alta variabilidad entre estudios. Resistencia a rotación interna en abducción.' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Gesto por encima de la cabeza que reproduce el síntoma mecánico → EVA. ② Fuerza isométrica de RE y RI con dinamómetro si se dispone, siempre en la misma posición.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h6: {
    id: 'h6', region: 'hombro', num: '⑥',
    name: 'Disfunción Cervical con Dolor Referido a Hombro',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Movilizaciones cervicales grado I-II en dirección de menor resistencia (típicamente rotación contralateral al lado sintomático), limitadas al 30% del rango disponible. Retracción cervical suave en posición neutra, 10 repeticiones × 3 series.',
    tests: [
      { name: 'Test de Spurling (Compresión Foraminal)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor de hombro con extensión + inclinación lateral ipsilateral + compresión axial. Distingue de patología capsular primaria por la preservación del PROM glenohumeral.', noData: true },
      { name: 'Movilidad Glenohumeral Pasiva (PROM)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PROM glenohumeral preservado diferencia el origen cervical del capsular primario. Datos de fiabilidad limitados para tests específicos de screening cervical en dolor de hombro.', noData: true }
    ]
  },
  h7: {
    id: 'h7', region: 'hombro', num: '⑦',
    name: 'Artropatía Acromioclavicular',
    prom: 'SPADI o QuickDASH (MCID: 14.9–25.4 / 8.0–15.9 pts)',
    dosis: 'Movilizaciones escapulares pasivas (elevación-depresión, protracción-retracción) sin carga en articulación AC. Evitar aducción horizontal forzada. Rango limitado al 50% sin dolor. 3 series × 10 repeticiones, 2 veces al día.',
    pronostico: {
      horizonte: 'Rx y RM muestran patología AC, pero muchos cambios aparecen en personas sin síntomas.',
      derivacion: 'La infiltración ecoguiada tiene efecto diagnóstico y terapéutico: decisión médica.',
      fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Aducción Cruzada (Cross-body Adduction)', sn: '77%', sp: '79%', lr_pos: null, lr_neg: null, criterio: 'Brazo a 90° de flexión, aducción horizontal pasiva cruzando el cuerpo. Positivo si duele en la parte superior del hombro, cerca de la AC. S 77 % (27 de 35), E 79 % (410 de 518); la tarjeta dice «S >67 %». Estudio de casos y controles: los casos se definieron por dolor localizado, dolor a la palpación de la AC y alivio con infiltración, y los controles eran otras cirugías de hombro.', fuente: 'Chronopoulos 2004 (Am J Sports Med; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos)' },
      { name: 'Palpación directa de la articulación AC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce dolor localizado en la articulación AC. S 96 % (27 de 28), E 10 % (1 de 10): si no duele, hace poco probable el cuadro; si duele, no lo confirma (LR+ 1,07). La LR− calculada (0,36) descansa en un solo control sin dolor a la palpación, así que no puntúa: S y E van solo aquí. Población: pacientes que ya señalan el dolor en la zona AC (prevalencia 74 %); referencia: alivio ≥50 % con infiltración de la AC guiada por imagen.', fuente: 'Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tabla I)' },
      { name: 'Paxinos + gammagrafía ósea combinados', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Los test AC por separado son débiles: Paxinos + gammagrafía ósea, los dos positivos, dan LR+ 55; los dos negativos, LR− 0,03 (17 de 28 con dolor AC tenían los dos positivos y ninguno de 9 sin él; ninguno de 28 los dos negativos). LR calculadas sumando 0,1 a cada casilla, con 9 controles. La gammagrafía no se hace en consulta: es un hallazgo, no puntúa.', fuente: 'Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)' },
      { name: 'Movilidad pasiva sin restricción; posible escalón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilidad pasiva sin restricción; posible escalón.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Compresión activa (O’Brien) para la AC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6).', fuente: 'Chronopoulos 2004 (Am J Sports Med) y Walton 2004 (J Bone Joint Surg Am)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Aducción horizontal → EVA. ② Grados de aducción horizontal hasta la aparición del dolor, en la misma posición.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Test de Paxinos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentado, brazo junto al cuerpo. Pulgar bajo la cara posterolateral del acromion empujando hacia arriba y delante; índice y medio sobre la mitad de la clavícula empujando hacia abajo. Positivo si aparece o aumenta el dolor en la AC. S 79 %, E 50 % (LR+ 1,58). Hallazgo: la LR− calculada (0,42) sale de 10 controles.', fuente: 'Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)' }
    ]
  },
  h8: {
    id: 'h8', region: 'hombro', num: '⑧',
    name: 'Discinesia Escapular',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Activación del serrato anterior en apoyo de manos (posición cuadrúpeda modificada o contra pared), protracción escapular controlada sin elevación glenohumeral. ROM: 0-20° de protracción. 3 series × 6 repeticiones lentas (4 seg por fase).',
    tests: [
      { name: 'Observación visual de asimetría escapular (winging, tilting)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Asimetría visual en la elevación del brazo: ángulo inferior, borde medial o espina escapular prominentes. Datos de fiabilidad limitados.', noData: true },
      { name: 'Test de Asistencia Escapular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mejoría de síntomas o ROM cuando el examinador estabiliza manualmente la escápula durante la elevación. La discinesia es frecuentemente secundaria a otras patologías.', noData: true }
    ]
  },
  h9: {
    id: 'h9', region: 'hombro', num: '⑨',
    name: 'Disfunción de Primera Costilla (Zona Cervicotorácica)',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Movilizaciones respiratorias suaves: inspiración profunda controlada en sedestación con columna cervical en ligera flexión (facilita descenso de 1ª costilla). 3 series × 5 respiraciones profundas, evitando hiperventilación.',
    tests: [
      { name: 'Palpación posteroanterior de 1ª costilla', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Restricción de movilidad de primera costilla a la palpación posteroanterior. Datos de fiabilidad limitados/ausentes en literatura actual.', noData: true },
      { name: 'Test de elevación del brazo post-movilización', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mejoría de la elevación del brazo tras movilización de la primera costilla. Datos de fiabilidad limitados.', noData: true }
    ]
  },  // Tarjeta hombro, nodo 2b: las dos ramas de rigidez activa = pasiva que no
  // son el congelado. Sin fila de PRONOSTICO en la tarjeta → sin `pronostico`;
  // sin dosis en la guía → `dosis: ''`.
  h10: {
    id: 'h10', region: 'hombro', num: '⑩',
    name: 'Artrosis Glenohumeral',
    prom: 'SPADI (MCID: 14.9–25.4 puntos)',
    dosis: '',
    tests: [
      { name: 'Mayor edad + crepitación con rigidez activa = pasiva', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mayor edad, dolor progresivo más largo y a menudo menos intenso, crepitación, posible atrofia. Rx simple la muestra.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h11: {
    id: 'h11', region: 'hombro', num: '⑪',
    name: 'Luxación Bloqueada o Fractura (→ Rx)',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Rx antes de nada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Traumatismo previo + rigidez activa y pasiva → luxación bloqueada o fractura → Rx. No explorar más hasta tenerla.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Luxación bloqueada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Traumatismo previo, cualquier edad, rigidez activa y pasiva similar al congelado. Imagen: Rx simple.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Fractura', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Traumatismo previo, osteoporosis. Imagen: Rx; RM si fractura no desplazada del troquíter.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Test de aprensión ósea y percusión olécranon-manubrio', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
};
