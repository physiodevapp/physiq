// ============================================================
// PhysiQ-Assessment · data/hombro.js
// Contenido clínico de la región HOMBRO: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

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
        'Tumor de Pancoast: dolor irradiado a escápula, cuello, axila o cara medial del brazo'
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
        { label: 'SÍ — Abducción pasiva <80° y pérdida severa de rotación externa', value: 'si', next: null, hypothesis: ['h1'] },
        { label: 'NO — Movilidad pasiva mayormente preservada', value: 'no', next: 'h_step3', hypothesis: [] }
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
    tests: [
      { name: 'Abducción pasiva glenohumeral <80°', sn: '83-100% VPP (para capsulitis confirmada por volumen capsular <12 mL)', sp: null, lr_pos: null, lr_neg: null, criterio: 'Abducción pasiva glenohumeral menor de 80° confirma capsulitis con alta probabilidad post-test.' },
      { name: 'Test de Rotación Externa (brazo neutro al lado, codo 90°)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en la literatura actual. Positivo cuando reproduce dolor.', noData: true }
    ]
  },
  h2: {
    id: 'h2', region: 'hombro', num: '②',
    name: 'Síndrome de Pinzamiento Subacromial (Impingement)',
    prom: 'QuickDASH (MCID: 8.0–15.9 puntos)',
    dosis: 'Ejercicios de rotación externa isométrica submáxima (20% CVM) con brazo en aducción y rotación neutra, evitando elevación >60°. 3 series × 10 segundos de contracción, descanso 30 segundos.',
    tests: [
      { name: 'Arco doloroso', sn: '71%', sp: '81%', lr_pos: '3.7', lr_neg: '0.36', criterio: 'Dolor durante la elevación activa entre 60° y 120°.' },
      { name: 'Test de Hawkins-Kennedy', sn: '76%', sp: '48%', lr_pos: '1.5', lr_neg: null, criterio: 'Flexión de hombro a 90°, rotación interna forzada. Positivo si reproduce dolor subacromial.' },
      { name: 'Test de Neer', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Elevación pasiva en el plano escapular con rotación interna. Parte del cluster diagnóstico (≥3/5 tests positivos: AUC 0.79).', noData: false },
      { name: 'Test de Resistencia a Rotación Externa', sn: '63%', sp: '75%', lr_pos: '2.6', lr_neg: '0.49', criterio: 'Contracción isométrica de rotación externa contra resistencia. Positivo si reproduce dolor.' }
    ]
  },
  h3: {
    id: 'h3', region: 'hombro', num: '③',
    name: 'Rotura del Manguito Rotador',
    prom: 'SPADI (MCID: 14.9–25.4 pts) o ASES (MCID: 9–26.9 pts)',
    dosis: 'Isométricos de rotación externa en posición neutra (brazo al lado, codo 90°) al 15% CVM, sin elevación del brazo. 3 series × 8 repeticiones × 6 segundos, descanso 60 segundos entre series.',
    tests: [
      { name: 'Test de Lata Vacía (Empty Can)', sn: '71%', sp: '49%', lr_pos: '1.3', lr_neg: null, criterio: 'Resistencia a abducción con el brazo a 90° en el plano escapular y rotación interna (pulgar hacia abajo). Positivo: dolor o debilidad.' },
      { name: 'Test de Lata Llena (Full Can)', sn: '75%', sp: '68%', lr_pos: '2.4', lr_neg: null, criterio: 'Resistencia a abducción con el brazo a 90° y rotación externa (pulgar hacia arriba). Positivo: dolor o debilidad.' },
      { name: 'External Rotation Lag Sign', sn: '47%', sp: '94%', lr_pos: '7.2', lr_neg: null, criterio: 'Alta especificidad para roturas completas. Imposibilidad de mantener la rotación externa pasivamente colocada.' },
      { name: 'Internal Rotation Lag Sign', sn: '97%', sp: '83%', lr_pos: '5.6', lr_neg: null, criterio: 'Alta sensibilidad para roturas completas. Imposibilidad de mantener la rotación interna contra gravedad.' },
      { name: 'Drop Arm Test', sn: '24%', sp: '93%', lr_pos: '3.3', lr_neg: null, criterio: 'El brazo abducido a 90° no puede mantenerse — cae. Alta especificidad para rotura masiva.' }
    ]
  },
  h4: {
    id: 'h4', region: 'hombro', num: '④',
    name: 'Inestabilidad Anterior Traumática',
    prom: 'DASH (MCID: 10.8 pts) o QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Isométricos de rotadores externos en posición de seguridad (brazo en aducción, rotación neutra). Contracción al 20% CVM, sin movimiento glenohumeral. 3 series × 10 segundos, descanso 45 segundos.',
    tests: [
      { name: 'Test de Aprehensión', sn: '72%', sp: '96%', lr_pos: '20.2', lr_neg: null, criterio: 'Criterio: APREHENSIÓN (no solo dolor). Brazo a 90° abducción + rotación externa progresiva. El paciente siente que el hombro "se va a salir".' },
      { name: 'Test de Recolocación (Jobe)', sn: '81%', sp: '92%', lr_pos: '10.4', lr_neg: null, criterio: 'Tras el test de aprehensión, se aplica fuerza posterior en la cabeza humeral. Positivo si desaparece la aprehensión.' },
      { name: 'Test de Liberación/Release/Surprise', sn: null, sp: null, lr_pos: '8.3', lr_neg: null, criterio: 'Mejor sensibilidad y especificidad para inestabilidad anterior. Se retira la fuerza de recolocación súbitamente — reaparece la aprehensión.' }
    ]
  },
  h5: {
    id: 'h5', region: 'hombro', num: '⑤',
    name: 'Lesión Labral Superior (SLAP)',
    prom: 'DASH (MCID: 10.8 pts) o QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Estabilización escapular en cadena cerrada (apoyo de manos en pared, protracción escapular controlada) sin carga axial sobre complejo bicipital-labral. ROM limitado a 0-30° de flexión glenohumeral. 3 series × 8 repeticiones lentas.',
    tests: [
      { name: 'Test de O\'Brien (Active Compression)', sn: null, sp: null, lr_pos: '3–50 (alta variabilidad)', lr_neg: null, criterio: 'Flexión a 90°, aducción horizontal 10°, rotación interna (pulgar abajo) — resistencia. Luego igual con rotación externa. Positivo: dolor que desaparece o disminuye en supinación.' },
      { name: 'Biceps Load Test II', sn: null, sp: null, lr_pos: '26', lr_neg: null, criterio: 'Alta LR+ pero evaluado principalmente por diseñadores del test. Flexión de codo a 120°, resistencia a supinación con hombro a 90° abd.' },
      { name: 'Test de Resistencia a Rotación Interna', sn: null, sp: null, lr_pos: '25', lr_neg: null, criterio: 'Alta variabilidad entre estudios. Resistencia a rotación interna en abducción.' }
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
    tests: [
      { name: 'Test de Aducción Cruzada (Cross-body Adduction)', sn: '77%', sp: '79%', lr_pos: null, lr_neg: null, criterio: 'Aducción horizontal pasiva del brazo cruzando el pecho. Positivo si reproduce dolor localizado en articulación AC.' },
      { name: 'Palpación directa de la articulación AC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce dolor localizado en la articulación AC. Datos de fiabilidad diagnóstica específicos limitados en literatura.', noData: true }
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
  },
};
