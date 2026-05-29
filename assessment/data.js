// ============================================================
// PhysiQ-Assessment · DATA.js
// Datos clínicos extraídos del documento-guía Fisio_4MVP
// ============================================================

// ── SISTEMAS TRANSVERSALES (aplicados a todas las regiones) ──
const SIS_ENDOCRINO = {
  id: 'transversal_endocrino', icon: '⚗️', nombre: 'Endocrino / Metabólico',
  banderasRojas: [
    'Síndrome del túnel carpiano bilateral (alerta endocrina/metabólica)',
    'Signos de tormenta tiroidea: taquicardia, hipertermia, agitación',
    'Confusión, letargo o sudoración profusa sin ejercicio en diabéticos (riesgo hipoglucemia/cetoacidosis)',
    'Signos de depleción de potasio por diuréticos: arritmias, calambres',
    'Aparición de xantomas eruptivos en tendones extensores',
    'Nódulos palpables supraclaviculares o fiebre inexplicable en pacientes con corticosteroides'
  ],
  banderasAmarillas: [
    'Debilidad muscular proximal, mialgias y fatiga sistémica inexplicada',
    'Periartritis o tendinitis calcificante bilateral de hombro',
    'Cambios inexplicables en cabello, uñas, piel o tolerancia a la temperatura',
    'Polidipsia y poliuria (sed y orina excesivas)'
  ],
  preguntas: [
    { id: 'end_1', text: '¿Siente fatiga inusual o debilidad muscular, especialmente al subir escaleras o levantarse de una silla?', alerta: true, s1: false },
    { id: 'end_2', text: '¿Ha notado aumento anormal de sed, apetito o frecuencia urinaria (incluso despertándose por la noche)?', alerta: true, s1: false },
    { id: 'end_3', text: '¿Ha experimentado cambios recientes en su peso o tolerancia a la temperatura (mucho frío o calor cuando otros no)?', alerta: true, s1: false },
    { id: 'end_4', text: '¿Nota que sus heridas sanan muy lentamente o le aparecen moretones con excesiva facilidad?', alerta: false, s1: false },
    { id: 'end_5', text: '(Si tiene diabetes) ¿Suele tener episodios de bajadas de azúcar, o siente ardor, entumecimiento o pérdida de sensibilidad en manos y pies?', alerta: true, s1: false }
  ],
  zonasDolor: [
    { zona: 'Manos / Muñecas bilateral', desc: 'Túnel carpiano bilateral, tenosinovitis de flexores — alerta tiroidea/metabólica' },
    { zona: 'Hombros (bilateral)', desc: 'Periartritis, tendinitis calcificante, capsulitis adhesiva' },
    { zona: 'Músculos proximales', desc: 'Cintura pélvica, muslos, cintura escapular — mialgias y debilidad profunda' },
    { zona: 'Columna torácica y lumbar', desc: 'Fracturas por compresión (osteoporosis), Paget, acromegalia (síndrome DISH)' },
    { zona: 'Rodillas', desc: 'Ataques agudos de pseudogota (condrocalcinosis)' }
  ],
  impactoDescanso: [
    'Túnel carpiano bilateral: parestesias y dolor nocturno que interrumpen el sueño repetidamente',
    'Nicturia diabética (insulina insípida o mellitus): fragmenta gravemente el descanso',
    'Dolor óseo metabólico (Paget, osteomalacia): profundo, taladrante, empeora por la noche'
  ],
  impactoEjercicio: [
    'Miopatía endocrina (Cushing, hipertiroidismo, acromegalia): reduce drásticamente la capacidad funcional',
    'Enfermedad de Graves: intolerancia al calor contraindica ejercicio vigoroso o terapia acuática (riesgo arritmias)',
    'Diabetes mellitus: el ejercicio modifica captación de glucosa — sin monitorización puede causar hipoglucemia grave o cetoacidosis',
    'Diuréticos: depleción de potasio eleva riesgo de arritmias cardíacas inducidas por ejercicio'
  ]
};

const SIS_HEMATOLOGICO = {
  id: 'transversal_hematologico', icon: '🩸', nombre: 'Hematológico',
  banderasRojas: [
    'Sangrado espontáneo, petequias o equimosis sin traumatismo (trombocitopenia)',
    'Heces negras/alquitranadas indicativas de trombocitopenia o sangrado GI',
    'Episodios nuevos de dolor muscular o articular en pacientes con hemofilia',
    'Hemoptisis (toser sangre) en pacientes con hemofilia',
    'Fiebre alta, escalofríos y sudores por infecciones en pacientes con leucopenia'
  ],
  banderasAmarillas: [
    'Palidez en pliegues palmares, mucosas o lechos ungueales',
    'Uñas cóncavas o quebradizas (coiloniquia — alerta de anemia ferropénica)',
    'Disnea rápida, dolor de pecho, debilidad y fatiga con palpitaciones',
    'Uso crónico de AINEs (predispone a sangrado GI y anemia)'
  ],
  preguntas: [
    { id: 'hem_1', text: '¿Sangra o se le forman moretones fácilmente después de un traumatismo menor, cirugía o procedimiento dental?', alerta: true, s1: false },
    { id: 'hem_2', text: '¿Experimenta falta de aire, palpitaciones o dolor en el pecho con esfuerzos leves (subir escaleras) o en reposo?', alerta: true, s1: false },
    { id: 'hem_3', text: '¿Padece infecciones recurrentes o fiebre baja frecuente (resfriados, gripe, infecciones respiratorias)?', alerta: true, s1: false },
    { id: 'hem_4', text: '¿Ha notado heces negras/alquitranadas, sangre en orina, o ha tosido o vomitado sangre?', alerta: true, s1: false }
  ],
  zonasDolor: [
    { zona: 'Articulaciones (rodilla, codo, tobillo, cadera, hombro)', desc: 'Hemartrosis en hemofilia — dolor articular agudo' },
    { zona: 'Abdomen inferior / Ingle / Muslo', desc: 'Hemorragia retroperitoneal en músculo iliopsoas (puede imitar apendicitis)' },
    { zona: 'Hombro / Cadera', desc: 'Episodios isquémicos en anemia falciforme — dolor óseo y perióstico' },
    { zona: 'Pecho / Mandíbula', desc: 'Dolor torácico por falta de oxigenación miocárdica en anemia severa' }
  ],
  impactoDescanso: [
    'Policitemia: prurito intolerable al estar en cama o con calor ("signo del baño caliente") — interrumpe severamente el descanso',
    'Anemia severa: taquicardia nocturna y disnea de reposo fragmentan el sueño'
  ],
  impactoEjercicio: [
    'Anemia: disminuye transporte de oxígeno — tolerancia al ejercicio muy reducida, taquicardia, fatiga extrema y disnea. Dosificar con extrema precaución',
    'Trombocitopenia: ejercicio con Valsalva (esfuerzo/pujo) CONTRAINDICADO — riesgo de hemorragia en ojos o cerebro',
    'Hemofilia: hemorragias musculares causan dolor y espasmo protector que acorta el músculo y limita el movimiento articular',
    'Ejercicio vigoroso contraindicado si plaquetas <50.000/mm³ o hemoglobina <10 g/dL'
  ]
};

const SYSTEMIC_SCREENING = {
  hombro: {
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
          { id: 'h_gi3', text: '¿Aumenta el dolor de hombro de 2 a 4 horas tras tomar antiinflamatorios (AINEs)?', alerta: false }
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
  },

  cadera: {
    label: 'Cuadrante Inferior — Cadera, Ingle y Muslo',
    sistemas: [
      {
        id: 'ca_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
        banderasRojas: [
          'Dolor óseo intenso al cargar peso o fractura patológica ante trauma menor',
          'Dolor constante nocturno en cadera/muslo sin alivio postural',
          'Antecedentes de cáncer de próstata, testículo, colon o riñón',
          'Masa palpable en muslo o zona glútea'
        ],
        banderasAmarillas: [
          'Edad >50 años con dolor insidioso en cadera',
          'Pérdida de peso inexplicada'
        ],
        preguntas: [
          { id: 'c5', text: '¿Tiene antecedentes de cáncer de cualquier tipo (especialmente próstata, mama, pulmón, riñón)?', alerta: true, s1: true },
          { id: 'ca_on2', text: '¿El dolor en cadera/muslo es constante, nocturno e intenso, sin posición que lo alivie?', alerta: true },
          { id: 'ca_on3', text: '¿Ha notado pérdida de peso rápida e inexplicada, o ha descubierto algún bulto nuevo?', alerta: true, s1: true }
        ],
        zonasDolor: [
          { zona: 'Pelvis / Cadera', desc: 'Metástasis óseas — cánceres de mama, próstata, pulmón' },
          { zona: 'Muslo / Glúteo', desc: 'Tumores de fémur proximal, sarcomas' },
          { zona: 'Ingle / Testículos', desc: 'Tumores prostáticos o testiculares irradiados' }
        ],
        impactoDescanso: [
          'Dolor óseo metastásico nocturno de tipo "taladro" no cede al acostarse',
          'Sudoraciones y fiebres fragmentan severamente el descanso'
        ],
        impactoEjercicio: [
          'Destrucción del tejido óseo aumenta riesgo de fractura patológica con apoyo de peso',
          'Fatiga oncológica extrema sin relación con el nivel de actividad',
          'Débilidad muscular proximal impide subir escaleras o levantarse de silla'
        ]
      },
      {
        id: 'ca_vascular', icon: '🩸', nombre: 'Vascular',
        banderasRojas: [
          'Claudicación: dolor que aparece a los 5-10 min de caminar y cede casi de inmediato al parar',
          'Calambres nocturnos en pantorrilla que interrumpen el sueño profundo',
          'Aneurisma aórtico: dolor desgarrador irradiado a glúteo o parte posterior del muslo',
          'Signos de TVP: edema, eritema, calor y dolor en pantorrilla'
        ],
        banderasAmarillas: [
          'Claudicación que empeora repentinamente',
          'Dolor en reposo isquémico que se alivia al colgar la pierna fuera de la cama'
        ],
        preguntas: [
          { id: 'c2', text: '¿El dolor aparece tras 5-10 minutos de caminar y se alivia casi de inmediato al detenerse (claudicación vascular)?', alerta: true, s1: true },
          { id: 'ca_v2', text: '¿Nota hinchazón, enrojecimiento y calor en la pantorrilla o experimenta calambres nocturnos frecuentes?', alerta: true },
          { id: 'ca_v3', text: '¿Experimenta dolor isquémico en la pierna en reposo que mejora al colocarla colgando fuera de la cama?', alerta: true }
        ],
        zonasDolor: [
          { zona: 'Pantorrilla / Glúteo', desc: 'Claudicación vascular según nivel de oclusión' },
          { zona: 'Dorso del pie', desc: 'Claudicación distal' },
          { zona: 'Zona interescapular / Lumbar', desc: 'Aneurisma aórtico irradiado' }
        ],
        impactoDescanso: [
          'Calambres nocturnos en pantorrilla interrumpen el sueño profundo (isquemia)',
          'Dolor isquémico en reposo empeora al elevar las piernas en cama — el paciente duerme con la pierna colgando'
        ],
        impactoEjercicio: [
          'La distancia de marcha queda limitada por la claudicación',
          'Claudicación glútea puede confundirse con dolor de cadera de origen articular'
        ]
      },
      {
        id: 'ca_urogenital', icon: '🫘', nombre: 'Urogenital / Renal',
        banderasRojas: [
          'Hematuria (sangre en orina) de cualquier cantidad',
          'Masa testicular indolora y dura',
          'Fiebre con dolor en flanco y escalofríos (pielonefritis)'
        ],
        banderasAmarillas: [
          'Ardor o dificultad al orinar acompañando el dolor de ingle',
          'Dolor en ingle que no cambia con movimiento de cadera'
        ],
        preguntas: [
          { id: 'c3', text: '¿Ha notado sangre en la orina, ardor o dolor al orinar, o fiebre/escalofríos?', alerta: true, s1: true },
          { id: 'ca_u2', text: '(Hombres) ¿Ha notado dolor testicular, secreciones inusuales o dificultad al orinar?', alerta: true }
        ],
        zonasDolor: [
          { zona: 'Ingle / Testículos', desc: 'Cólico ureteral irradiado desde ángulo costovertebral' },
          { zona: 'Abdomen inferior', desc: 'Vejiga, uréter distal, próstata' },
          { zona: 'Hombro ipsilateral', desc: 'Por presión en diafragma (riñones)' }
        ],
        impactoDescanso: [
          'Cólico renal constante y severo — impide conciliar el sueño, el paciente no puede estar quieto',
          'Nicturia fragmenta el ciclo de sueño'
        ],
        impactoEjercicio: [
          'Insuficiencia renal crónica: anemia renal con fatiga extrema y letargo',
          'Espasmo del psoas ilíaco (adyacente al uréter inflamado) altera biomecánica de la marcha'
        ]
      },
      {
        id: 'ca_gi', icon: '🫃', nombre: 'Gastrointestinal',
        banderasRojas: [
          'Dolor en ingle/cadera que se alivia al pasar gases o defecar',
          'Signo del psoas positivo (sospecha de apendicitis o absceso)',
          'Fiebre y dolor abdominal simultáneo al dolor de cadera'
        ],
        banderasAmarillas: [
          'Distensión abdominal acompañando el dolor de cadera',
          'Uso crónico de AINEs'
        ],
        preguntas: [
          { id: 'c4', text: '¿El dolor en la ingle o cadera se acompaña de molestias, distensión abdominal o se alivia al defecar/pasar gases?', alerta: true, s1: true },
          { id: 'ca_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces o dificultad para limpiarse?', alerta: true }
        ],
        zonasDolor: [
          { zona: 'Cadera / Ingle / Muslo', desc: 'Absceso del psoas (apendicitis, diverticulitis, Crohn)' },
          { zona: 'Lumbar / Pelvis / Sacro', desc: 'Intestino grueso, colon, recto' }
        ],
        impactoDescanso: [
          'Dolor nocturno GI (12–3 am) asociado a úlceras o cáncer interrumpe el sueño'
        ],
        impactoEjercicio: [
          'Mala absorción de nutrientes (Crohn, colitis) compromete recuperación muscular',
          'Anemia ferropénica por sangrado GI oculto: fatiga y disnea'
        ]
      },
      SIS_ENDOCRINO,
      SIS_HEMATOLOGICO
    ]
  },

  cervical: {
    label: 'Cabeza, Cuello y Espalda',
    sistemas: [
      {
        id: 'cv_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
        banderasRojas: [
          'Antecedentes de cáncer o tratamiento oncológico',
          'Edad >50 años con inicio insidioso',
          'Dolor nocturno constante e intenso que despierta al paciente',
          'Fracaso del tratamiento conservador tras 1 mes sin mejoría',
          'Pérdida de peso inexplicada (>10% en 2-4 semanas)',
          'Ganglios linfáticos duros, fijos e indoloros'
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
          'Angina no aliviada por reposo (>20 min)'
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
      SIS_ENDOCRINO,
      SIS_HEMATOLOGICO
    ]
  },

  lumbar: {
    label: 'Sacro, Sacroilíaca, Pelvis y Lumbar',
    sistemas: [
      {
        id: 'l_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
        banderasRojas: [
          'Antecedentes de cáncer de próstata, colon, o cualquier tipo',
          'Dolor nocturno intenso que despierta al paciente sin alivio postural',
          'Pérdida de peso inexplicada (>10% en 2-4 semanas)',
          'Fractura patológica ante trauma menor o fragilidad ósea'
        ],
        banderasAmarillas: ['Dolor lumbar persistente sin mejoría tras 1 mes de tratamiento conservador'],
        preguntas: [
          { id: 'l2', text: '¿Tiene antecedentes de cáncer de cualquier tipo?', alerta: true, s1: true },
          { id: 'l_on2', text: '¿El dolor nocturno lo despierta desde un sueño profundo y le resulta imposible encontrar una posición que lo alivie?', alerta: true, s1: true }
        ],
        zonasDolor: [
          { zona: 'Columna lumbo-sacra (30%)', desc: 'Segunda localización más frecuente de metástasis vertebrales' },
          { zona: 'Pelvis / Costillas', desc: 'Metástasis en esqueleto axial' },
          { zona: 'Glúteo / Ingle', desc: 'Compresión medular con irradiación radicular' }
        ],
        impactoDescanso: ['Dolor óseo nocturno tipo "taladro" no cede al acostarse — señal de alarma oncológica'],
        impactoEjercicio: ['Riesgo de fractura patológica con apoyo de peso — restricción de carga', 'Fatiga extrema sin relación con el nivel de actividad']
      },
      {
        id: 'l_urogenital', icon: '🫘', nombre: 'Urogenital / Renal',
        banderasRojas: [
          'Hematuria (sangre en orina)',
          'Prueba de percusión positiva en ángulo costovertebral',
          'Incontinencia intestinal/vesical o anestesia en silla de montar (síndrome de cauda equina)',
          'Masa testicular indolora'
        ],
        banderasAmarillas: [
          'Dolor lumbar constante que no varía con la postura corporal',
          'Fiebre y escalofríos acompañando el dolor lumbar',
          'Cambios en la orina (color, olor, cantidad)'
        ],
        preguntas: [
          { id: 'l4', text: '¿Ha notado cambios en la orina (color rojo, marrón, turbio) o fiebre/escalofríos junto con el dolor de espalda?', alerta: true, s1: true },
          { id: 'l6', text: '¿Presenta incontinencia urinaria o intestinal, o pérdida de sensibilidad en la zona de "silla de montar"?', alerta: true, s1: true },
          { id: 'l_u3', text: '¿Se levanta durante la noche para orinar más de una vez, o tiene dolor/ardor al orinar?', alerta: false }
        ],
        zonasDolor: [
          { zona: 'Lumbar posterior (flanco)', desc: 'Riñones → ángulo costovertebral' },
          { zona: 'Ingle / Genitales', desc: 'Uréter: flanco → abdomen inferior → ingle → testículos o labios mayores' },
          { zona: 'Suprapúbico / Sacro', desc: 'Próstata, vejiga' }
        ],
        impactoDescanso: ['Cólico renal: dolor constante que impide toda posición cómoda', 'Nicturia fragmenta el ciclo de sueño'],
        impactoEjercicio: ['Insuficiencia renal: anemia con fatiga extrema', 'Espasmo del psoas ilíaco altera biomecánica de la marcha']
      },
      {
        id: 'l_gi', icon: '🫃', nombre: 'Gastrointestinal',
        banderasRojas: [
          'Dolor sacro/lumbar que se alivia al pasar gases o defecar',
          'Heces negras alquitranadas, sangre en heces',
          'Dolor nocturno intenso entre medianoche y 3 am',
          'Pérdida de peso inexplicada o saciedad precoz'
        ],
        banderasAmarillas: [
          'Dolor de espalda y abdominal al mismo nivel (simultáneo o alterno)',
          'Uso crónico de AINEs',
          'Dolor modificado por ingesta o defecación'
        ],
        preguntas: [
          { id: 'l1', text: '¿El dolor lumbar, sacro o pélvico se alivia o cambia después de tener una evacuación intestinal o al expulsar gases?', alerta: true, s1: true },
          { id: 'l3', text: '¿El dolor está relacionado con su ciclo menstrual, tiene sangrado inusual o dolor que alterna con dolor abdominal?', alerta: true, s1: true },
          { id: 'l_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces, o dolor que lo despierta entre la medianoche y las 3 am?', alerta: true }
        ],
        zonasDolor: [
          { zona: 'Lumbar / Pelvis / Sacro', desc: 'Intestino grueso, colon, recto' },
          { zona: 'Columna torácica (T6-T10)', desc: 'Estómago, duodeno, páncreas, vesícula' },
          { zona: 'Cadera / Ingle', desc: 'Absceso del psoas (apendicitis, diverticulitis, Crohn)' }
        ],
        impactoDescanso: ['Dolor nocturno GI (12–3 am) con úlceras o cáncer interrumpe el sueño'],
        impactoEjercicio: ['Mala absorción de nutrientes compromete la recuperación muscular', 'Anemia ferropénica por sangrado oculto: fatiga y disnea']
      },
      {
        id: 'l_espondilo', icon: '🦴', nombre: 'Espondiloartropatías / Espondilogénicas / Ginecológico',
        banderasRojas: [
          'Rigidez matutina prolongada >30 min que mejora con actividad (espondiloartritis)',
          'Despertar por dolor en segunda mitad de la noche — patrón inflamatorio',
          'Síntomas oculares (uveítis) o cutáneos (psoriasis) asociados',
          'Fractura por insuficiencia: dolor lumbar súbito en paciente con osteoporosis o Paget',
          'Embarazo ectópico: dolor pélvico unilateral severo con sangrado (urgencia)'
        ],
        banderasAmarillas: [
          'Dolor sacroilíaco bilateral alterno',
          'Dolor relacionado con ciclo menstrual (endometriosis)',
          'Historia familiar de espondilitis anquilosante',
          'Antecedente de osteoporosis o uso prolongado de corticosteroides (riesgo de fractura por insuficiencia)',
          'Engrosamiento óseo palpable o deformidad (Paget)'
        ],
        preguntas: [
          { id: 'l5', text: '¿Tiene rigidez matutina prolongada (más de 30 minutos) que mejora con el movimiento y el calor?', alerta: false, s1: true },
          { id: 'l_e2', text: '¿El dolor sacroilíaco lo despierta en la segunda mitad de la noche (entre las 2 y las 5 am)?', alerta: true, s1: true },
          { id: 'l_e3', text: '¿El dolor pélvico está claramente relacionado con el ciclo menstrual, o tiene sangrado ginecológico inusual?', alerta: true, s1: true },
          { id: 'l_e4', text: '¿Tiene diagnóstico de osteoporosis, o ha tenido una fractura reciente ante un golpe menor o sin trauma aparente?', alerta: true },
          { id: 'l_e5', text: '¿Ha notado deformidad ósea, engrosamiento de huesos o ha sido diagnosticado de enfermedad de Paget?', alerta: true }
        ],
        zonasDolor: [
          { zona: 'Sacroilíacas (bilateral/alterno)', desc: 'Espondilitis anquilosante, síndrome de Reiter, Crohn' },
          { zona: 'Columna lumbar difusa', desc: 'Fracturas por insuficiencia (osteoporosis), enfermedad de Paget' },
          { zona: 'Pelvis / Periné', desc: 'Endometriosis, EPI, embarazo ectópico' },
          { zona: 'Columna torácica', desc: 'Irradiación en espondiloartropatías avanzadas' }
        ],
        impactoDescanso: [
          'Rigidez matutina prolongada y despertar nocturno en segunda mitad — patrón inflamatorio clásico',
          'Insomnio crónico secundario al dolor pélvico en endometriosis/EPI',
          'Fractura por insuficiencia: dolor agudo que impide cualquier posición cómoda'
        ],
        impactoEjercicio: [
          'Limitación profunda para la carga de peso en fracturas por insuficiencia u osteoporosis',
          'Fatiga severa en espondiloartropatías activas',
          'Paget avanzado: deformidad ósea que altera la biomecánica y aumenta riesgo de fractura'
        ]
      },
      SIS_ENDOCRINO,
      SIS_HEMATOLOGICO
    ]
  },

  rodilla: {
    label: 'Cuadrante Inferior — Rodilla',
    sistemas: [
      {
        id: 'ro_vascular', icon: '🩸', nombre: 'Vascular',
        banderasRojas: [
          'Claudicación: dolor que aparece al caminar y cede al detenerse',
          'Calambres nocturnos en pantorrilla que interrumpen el sueño',
          'Signos de TVP: edema asimétrico, calor, eritema y sensibilidad en pantorrilla'
        ],
        banderasAmarillas: ['Dolor en reposo que mejora al colgar la pierna fuera de la cama'],
        preguntas: [
          { id: 'r_v1', text: '¿El dolor aparece tras caminar unos minutos y cede casi de inmediato al parar (claudicación)?', alerta: true },
          { id: 'r_v2', text: '¿Tiene la pantorrilla hinchada, caliente y más rojiza que la otra (posible TVP)?', alerta: true }
        ],
        zonasDolor: [
          { zona: 'Pantorrilla / Rodilla', desc: 'Claudicación distal o TVP' }
        ],
        impactoDescanso: ['Calambres nocturnos isquémicos interrumpen el sueño profundo'],
        impactoEjercicio: ['Distancia de marcha limitada por claudicación']
      },
      {
        id: 'ro_infecciosa', icon: '🦠', nombre: 'Infecciosa / Inflamatoria',
        banderasRojas: [
          'Fiebre, enrojecimiento intenso, calor y tumefacción articular (artritis séptica)',
          'Artritis séptica: urgencia médica — derivar de inmediato',
          'Inicio muy agudo con articulación bloqueada en posición de confort'
        ],
        banderasAmarillas: ['Antecedente de infección reciente (urinaria, respiratoria, cutánea)'],
        preguntas: [
          { id: 'r1', text: '¿Hay fiebre, enrojecimiento intenso y calor local junto con la tumefacción de la rodilla (artritis séptica)?', alerta: true },
          { id: 'r_i2', text: '¿Ha tenido alguna infección reciente (urinaria, respiratoria, cutánea) antes de que apareciera el dolor articular?', alerta: false }
        ],
        zonasDolor: [{ zona: 'Rodilla / Articulación', desc: 'Artritis séptica — dolor intenso localizado con signos flogóticos' }],
        impactoDescanso: ['Dolor articular intenso constante impide el descanso'],
        impactoEjercicio: ['Contraindicación absoluta de carga hasta confirmación diagnóstica']
      },
      {
        id: 'ro_oncologico', icon: '🔬', nombre: 'Oncológico',
        banderasRojas: [
          'Dolor nocturno constante e intenso sin alivio postural',
          'Masa o bulto palpable en zona periarticular',
          'Antecedentes de cáncer o edad <25 años (cánceres óseos primarios)'
        ],
        banderasAmarillas: ['Edad entre 10-30 años con dolor óseo inexplicado'],
        preguntas: [
          { id: 'r2', text: '¿El dolor es constante, nocturno, intenso y no se alivia con ninguna posición ni reposo?', alerta: true },
          { id: 'r3', text: '¿Tiene antecedentes de cáncer o ha notado algún bulto en la zona de la rodilla o muslo?', alerta: true },
          { id: 'r4', text: '¿Ha tenido episodios de hinchazón articular rápida después de un traumatismo menor?', alerta: false }
        ],
        zonasDolor: [{ zona: 'Rodilla / Fémur distal / Tibia proximal', desc: 'Osteosarcoma, metástasis' }],
        impactoDescanso: ['Dolor óseo nocturno que despierta — señal de alarma principal'],
        impactoEjercicio: ['Riesgo de fractura patológica — restricción de carga', 'Fatiga extrema asociada']
      },
      SIS_ENDOCRINO,
      SIS_HEMATOLOGICO
    ]
  },

  codo: {
    label: 'Codo y Antebrazo',
    sistemas: [
      {
        id: 'co_vascular', icon: '🩸', nombre: 'Vascular / Neurológica',
        banderasRojas: [
          'Cambios de color en mano/dedos (palidez, cianosis) con el frío (fenómeno de Raynaud)',
          'Debilidad progresiva en brazo/mano no relacionada con dolor local',
          'Síntomas vasculares en un codo postoperatorio'
        ],
        banderasAmarillas: ['Parestesias en 4º y 5º dedo sin dolor localizado en codo'],
        preguntas: [
          { id: 'co4', text: '¿Ha notado cambios de color en la mano o dedos (palidez, azulado) con el frío, o adormecimiento sin dolor?', alerta: false },
          { id: 'co3', text: '¿Tiene debilidad progresiva en el brazo o la mano que no se relaciona con el dolor local del codo?', alerta: true }
        ],
        zonasDolor: [{ zona: 'Mano / Dedos 4º-5º', desc: 'Neuropatía cubital o compresión vascular' }],
        impactoDescanso: ['Parestesias nocturnas en mano interrumpen el sueño (síndrome del túnel cubital)'],
        impactoEjercicio: ['Debilidad progresiva limita agarre y función del miembro superior']
      },
      {
        id: 'co_infecciosa', icon: '🦠', nombre: 'Infecciosa / Inflamatoria',
        banderasRojas: [
          'Fiebre, enrojecimiento intenso, calor marcado y tumefacción articular (artritis séptica)',
          'Inicio muy agudo con impotencia funcional severa'
        ],
        banderasAmarillas: ['Infección reciente en otra localización'],
        preguntas: [
          { id: 'co1', text: '¿Hay fiebre, enrojecimiento intenso y calor local en la articulación del codo?', alerta: true },
          { id: 'co2', text: '¿El dolor es constante, nocturno, intenso y no cede con ninguna posición ni reposo?', alerta: true }
        ],
        zonasDolor: [{ zona: 'Codo / Articulación', desc: 'Artritis séptica — signos flogóticos locales intensos' }],
        impactoDescanso: ['Dolor constante intenso impide el descanso'],
        impactoEjercicio: ['Contraindicación de carga hasta diagnóstico confirmado']
      },
      {
        id: 'co_endocrino', icon: '⚗️', nombre: 'Endocrino / Metabólico',
        banderasRojas: [
          'Síndrome del túnel carpiano BILATERAL (alerta endocrina/metabólica)',
          'Debilidad muscular proximal y fatiga sistémica inexplicada',
          'Xantomas en tendones extensores'
        ],
        banderasAmarillas: [
          'Tendinitis calcificante bilateral del hombro junto con síntomas en codo',
          'Cambios en el cabello, uñas, piel o tolerancia térmica'
        ],
        preguntas: [
          { id: 'co_e1', text: '¿Tiene síndrome del túnel carpiano en ambas manos a la vez, o síntomas similares también en el codo contralateral?', alerta: true },
          { id: 'co_e2', text: '¿Nota fatiga muscular proximal inusual (dificultad para subir escaleras, levantarse de una silla) además del dolor en el codo?', alerta: false }
        ],
        zonasDolor: [
          { zona: 'Muñecas / Manos bilateral', desc: 'Síndrome del túnel carpiano bilateral — alerta tiroidea/metabólica' },
          { zona: 'Hombros / Codo', desc: 'Tendinitis calcificante, periartritis en hipotiroidismo, acromegalia' }
        ],
        impactoDescanso: ['Parestesias nocturnas bilaterales por túnel carpiano interrumpen el sueño repetidamente'],
        impactoEjercicio: ['Miopatía endocrina reduce drásticamente la capacidad funcional', 'En hipertiroidismo: intolerancia al calor contraindica ejercicio vigoroso']
      },
      SIS_HEMATOLOGICO
    ]
  }
};

// ============================================================
// CIF TREES — Algoritmos de decisión por región
// ============================================================

const CIF_TREES = {

  hombro: {
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
  },

  cadera: {
    title: 'Algoritmo CIF — Cadera',
    steps: [
      {
        id: 'ca_step1',
        tag: 'Paso 1 — Diferenciación Proximal (Clearing)',
        question: '¿El dolor podría ser referido desde la columna lumbar o la articulación sacroilíaca?',
        options: [
          { label: 'SÍ — Sensibilidad sobre la ASI (sin sensibilidad en L5) y test de compresión pélvica positivo', value: 'si_asi', next: null, hypothesis: ['ca10'] },
          { label: 'SÍ — Dolor que cambia con movimientos repetidos de la espalda o déficit neurológico dermatomal', value: 'si_lumbar', next: null, hypothesis: [] },
          { label: 'NO — Origen puramente coxofemoral', value: 'no', next: 'ca_step2', hypothesis: [] }
        ]
      },
      {
        id: 'ca_step2',
        tag: 'Paso 2 — Perfil Articular y Edad',
        question: '¿El perfil es degenerativo (edad ≥45 años, rigidez matutina breve)?',
        options: [
          { label: 'SÍ — Edad ≥45 años, rigidez matutina <1 hora, rotación interna <24°', value: 'si', next: null, hypothesis: ['ca1'] },
          { label: 'NO — Paciente joven/activo con síntomas mecánicos', value: 'no', next: 'ca_step3', hypothesis: [] }
        ]
      },
      {
        id: 'ca_step3',
        tag: 'Paso 3 — Intraarticular (Joven/Activo)',
        question: '¿El test FADDIR y FABER son positivos? ¿Hay chasquidos o síntomas mecánicos?',
        options: [
          { label: 'FADDIR+/FABER+ — Síntomas compatibles con pinzamiento femoroacetabular (SIFA)', value: 'sifa', next: null, hypothesis: ['ca2'] },
          { label: 'FADDIR+/FABER+ con chasquidos/bloqueos — Posible desgarro labral', value: 'labrum', next: null, hypothesis: ['ca2', 'ca3'] },
          { label: 'Negativos — Sin patrón intraarticular claro', value: 'no', next: 'ca_step4', hypothesis: [] }
        ]
      },
      {
        id: 'ca_step4',
        tag: 'Paso 4 — Cuadrante Lateral',
        question: '¿El dolor se localiza en la CARA EXTERNA de la cadera (trocánter mayor)?',
        options: [
          { label: 'SÍ — Sensibilidad en trocánter mayor y dolor en apoyo monopodal <30s', value: 'tendino', next: null, hypothesis: ['ca4'] },
          { label: 'SÍ — Con marcha de Trendelenburg o debilidad medida en abductores', value: 'debilidad', next: null, hypothesis: ['ca5'] },
          { label: 'SÍ — Calidad deficiente en sentadilla monopodal o step-down', value: 'control', next: null, hypothesis: ['ca6'] },
          { label: 'NO — Sin dolor lateral', value: 'no', next: 'ca_step5', hypothesis: [] }
        ]
      },
      {
        id: 'ca_step5',
        tag: 'Paso 5 — Cuadrante Posterior',
        question: '¿El dolor se localiza en el GLÚTEO o zona isquiática?',
        options: [
          { label: 'Dolor profundo en glúteo que empeora al sentarse (ciática) — posible Síndrome Piriforme', value: 'piriforme', next: null, hypothesis: ['ca7'] },
          { label: 'Dolor que empeora con zancada larga al caminar — posible Pinzamiento Isquiofemoral', value: 'isquiof', next: null, hypothesis: ['ca8'] },
          { label: 'Sensibilidad sobre tuberosidad isquiática — posible Tendinopatía Proximal Isquiotibiales', value: 'isquiotib', next: null, hypothesis: ['ca9'] },
          { label: 'Sin localización clara posterior', value: 'no', next: null, hypothesis: [] }
        ]
      }
    ]
  },

  cervical: {
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
          { label: 'SÍ — Test de Spurling positivo, ULNT1 positivo o alivio con abducción del hombro', value: 'si', next: null, hypothesis: ['ce3'] },
          { label: 'NO — Sin irradiación predominante al brazo', value: 'no', next: 'ce_step4', hypothesis: [] }
        ]
      },
      {
        id: 'ce_step4',
        tag: 'Paso 4 — Localización y Cefalea',
        question: '¿El síntoma principal es cefalea unilateral o dolor en base del cuello/hombro?',
        options: [
          { label: 'Cefalea unilateral — Test de Flexión-Rotación Cervical <30° y síntomas C1-C2', value: 'cefalea', next: null, hypothesis: ['ce4'] },
          { label: 'Dolor en hombro/escápula — Restricción de movilidad de 1ª costilla', value: '1costilla', next: null, hypothesis: ['ce10'] },
          { label: 'Dolor local/inespecífico — Sin cefalea ni irradiación dominante', value: 'no', next: 'ce_step5', hypothesis: [] }
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
      }
    ]
  },

  lumbar: {
    title: 'Algoritmo CIF — Lumbar',
    steps: [
      {
        id: 'lu_step1',
        tag: 'Paso 1 — Evaluación de Dolor Irradiado (Rama Radicular)',
        question: '¿El dolor baja por la pierna (unilateral) y es peor que el dolor de espalda?',
        options: [
          { label: 'SÍ — SLR positivo <60°, Test de Slump positivo o déficits neurológicos dermatomales', value: 'si', next: 'lu_step1b', hypothesis: [] },
          { label: 'NO — Sin irradiación predominante a la pierna', value: 'no', next: 'lu_step2', hypothesis: [] }
        ]
      },
      {
        id: 'lu_step1b',
        tag: 'Paso 1b — Sub-decisión Radicular',
        question: '¿El dolor CENTRALIZA con movimientos repetidos (Método McKenzie/MDT)?',
        options: [
          { label: 'SÍ — El dolor centraliza (mejor pronóstico)', value: 'si', next: null, hypothesis: ['lu3'] },
          { label: 'NO — No centraliza o periferaliza', value: 'no', next: null, hypothesis: ['lu3'] }
        ]
      },
      {
        id: 'lu_step2',
        tag: 'Paso 2 — Evaluación por Edad y Posición (Rama Estenosis)',
        question: '¿El paciente es mayor y el dolor mejora al sentarse o inclinarse hacia adelante?',
        options: [
          { label: 'SÍ — Dolor bilateral en glúteos/muslos, alivio con "signo del carrito de compras"', value: 'si', next: null, hypothesis: ['lu4'] },
          { label: 'NO — Sin este patrón', value: 'no', next: 'lu_step3', hypothesis: [] }
        ]
      },
      {
        id: 'lu_step3',
        tag: 'Paso 3 — Evaluación Mecánica y Cronología',
        question: '¿Cómo es el patrón de dolor lumbar predominante?',
        options: [
          { label: 'Agudo/Rigidez — Síntomas <16 días, sin dolor bajo la rodilla y restricción segmentaria hipomóvil', value: 'agudo', next: null, hypothesis: ['lu1'] },
          { label: 'Persistente/Inestabilidad — Dolor en rangos finales o posturas sostenidas con sensación de "fallo"', value: 'inestable', next: null, hypothesis: ['lu2'] }
        ]
      }
    ]
  },

  rodilla: {
    title: 'Algoritmo CIF — Rodilla',
    steps: [
      {
        id: 'ro_step1',
        tag: 'Paso 1 — Antecedente Traumático Agudo',
        question: '¿Hubo un evento lesivo reciente con inflamación inmediata?',
        options: [
          { label: 'SÍ — Sensación de "pop", derrame articular rápido e inestabilidad (posible LCA)', value: 'lca', next: null, hypothesis: ['ro4'] },
          { label: 'SÍ — Trauma rotacional con síntomas de bloqueo o chasquidos (posible Menisco)', value: 'menisco', next: null, hypothesis: ['ro2'] },
          { label: 'NO — Dolor de inicio insidioso o crónico', value: 'no', next: 'ro_step2', hypothesis: [] }
        ]
      },
      {
        id: 'ro_step2',
        tag: 'Paso 2 — Perfil Degenerativo',
        question: '¿El paciente es mayor de 45 años con rigidez matutina breve (<30 min)?',
        options: [
          { label: 'SÍ — Edad ≥45 años, dolor relacionado con actividad, rigidez <30 minutos', value: 'si', next: null, hypothesis: ['ro1'] },
          { label: 'NO — Perfil más joven o sin patrón degenerativo', value: 'no', next: 'ro_step3', hypothesis: [] }
        ]
      },
      {
        id: 'ro_step3',
        tag: 'Paso 3 — Localización Específica del Dolor',
        question: '¿En qué zona se concentra el dolor de rodilla?',
        options: [
          { label: 'Anterior/Retrorrotuliano — Dolor al cargar en flexión (escaleras, sentadilla) en <40 años', value: 'pf', next: null, hypothesis: ['ro3'] },
          { label: 'Anterior/Polo inferior rótula — Dolor exacto en polo inferior, vinculado a saltos o frenadas', value: 'tend', next: null, hypothesis: ['ro5'] },
          { label: 'Lateral — Dolor en cóndilo femoral lateral que empeora al correr', value: 'it', next: null, hypothesis: ['ro6'] },
          { label: 'Medial/Distal — Dolor 2 cm distal a meseta tibial medial, empeora al subir escaleras', value: 'pata', next: null, hypothesis: ['ro7'] }
        ]
      }
    ]
  },

  codo: {
    title: 'Algoritmo CIF — Codo',
    steps: [
      {
        id: 'co_step1',
        tag: 'Paso 1 — Trauma e Integridad Muscular',
        question: '¿Hubo un evento traumático o hay deformidad muscular característica?',
        options: [
          { label: 'SÍ — Deformidad del contorno muscular ("signo de Popeye") y debilidad en flexión/supinación', value: 'biceps', next: null, hypothesis: ['co7'] },
          { label: 'NO — Sin traumatismo significativo ni deformidad', value: 'no', next: 'co_step2', hypothesis: [] }
        ]
      },
      {
        id: 'co_step2',
        tag: 'Paso 2 — Movilidad Global',
        question: '¿Existe una restricción GLOBAL y dolorosa de todos los movimientos del codo (flexión, extensión, pronación, supinación)?',
        options: [
          { label: 'SÍ — Limitación activa y pasiva en todos los planos', value: 'si', next: null, hypothesis: ['co3'] },
          { label: 'NO — Movilidad mayormente preservada', value: 'no', next: 'co_step3', hypothesis: [] }
        ]
      },
      {
        id: 'co_step3',
        tag: 'Paso 3 — Evaluación Neuromuscular y Sensitiva',
        question: '¿Presenta parestesias, debilidad intrínseca de la mano o dolor quemante en el antebrazo?',
        options: [
          { label: 'SÍ — Zona medial: parestesias en 4º y 5º dedo, Tinel positivo en surco epitrócleo-olecraniano', value: 'cubital', next: null, hypothesis: ['co8'] },
          { label: 'SÍ — Zona dorsal/lateral: dolor en antebrazo proximal que aumenta con extensión del 3er dedo', value: 'radial', next: null, hypothesis: ['co9'] },
          { label: 'NO — Sin síntomas neurales', value: 'no', next: 'co_step4', hypothesis: [] }
        ]
      },
      {
        id: 'co_step4',
        tag: 'Paso 4 — Carga y Función Muscular (Epicondilalgias)',
        question: '¿El dolor es puntual al cargar peso o realizar agarres? ¿Dónde se localiza?',
        options: [
          { label: 'Epicóndilo lateral — Dolor con extensión resistida de muñeca (Test de Cozen) y dolor en cara lateral', value: 'lateral', next: null, hypothesis: ['co1'] },
          { label: 'Epicóndilo medial — Dolor con flexión resistida de muñeca y pronación, dolor en cara medial', value: 'medial', next: null, hypothesis: ['co2'] },
          { label: 'Sin localización epicondílea clara', value: 'no', next: 'co_step5', hypothesis: [] }
        ]
      },
      {
        id: 'co_step5',
        tag: 'Paso 5 — Estabilidad y Síntomas Mecánicos',
        question: '¿Siente que el codo "falla" o tiene bloqueos?',
        options: [
          { label: 'Inestabilidad medial — Dolor al estrés en valgo en deportistas de lanzamiento', value: 'lcc', next: null, hypothesis: ['co4'] },
          { label: 'Inestabilidad posterolateral — Sensación de fallo con carga en supinación/extensión', value: 'irpl', next: null, hypothesis: ['co5'] },
          { label: 'Bloqueo/Chasquido — Dolor posterolateral en extensión terminal', value: 'plica', next: null, hypothesis: ['co6'] },
          { label: 'Sin inestabilidad ni bloqueos', value: 'no', next: null, hypothesis: [] }
        ]
      }
    ]
  }
};

// ============================================================
// HYPOTHESES — Cuadros clínicos con tests y datos diagnósticos
// ============================================================

const HYPOTHESES = {

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

  // ─── CADERA ─────────────────────────────────────────────
  ca1: {
    id: 'ca1', region: 'cadera', num: '①',
    name: 'Artrosis de Cadera',
    prom: 'HOOS (MCID: 10–13 puntos en subescalas)',
    dosis: 'Ejercicios de cadena cinética abierta sin carga (elevaciones de pierna en decúbito supino). 1-2 series de 8-10 repeticiones al 30-40% CVM, ROM limitado a 0-60° de flexión de cadera. Ejercicio aeróbico de bajo impacto 5-10 min al 40-50% FC reserva.',
    tests: [
      { name: 'Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h', sn: '95%', sp: '69%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad — útil para descartar si negativo.' },
      { name: 'Aducción de cadera disminuida', sn: '80%', sp: '81%', lr_pos: '4.2', lr_neg: '0.25', criterio: 'Pérdida de aducción pasiva comparada con el lado sano.' },
      { name: 'Rotación Interna disminuida (<24°)', sn: '66%', sp: '79%', lr_pos: '3.2', lr_neg: null, criterio: 'Rotación interna pasiva de cadera menor de 24° (o 15° menos que lado sano).' },
      { name: 'Dolor posterior con sentadilla profunda', sn: '24%', sp: '96%', lr_pos: '6.1', lr_neg: null, criterio: 'Alta especificidad. Dolor posterior al realizar una sentadilla profunda.' },
      { name: 'Debilidad de abductores', sn: '44%', sp: '90%', lr_pos: '4.5', lr_neg: null, criterio: 'Medida por dinamometría. Alta especificidad.' }
    ]
  },
  ca2: {
    id: 'ca2', region: 'cadera', num: '②',
    name: 'Síndrome de Pinzamiento Femoroacetabular (SIFA)',
    prom: 'iHOT-12 (MCID: 14–26 puntos)',
    dosis: 'Fortalecimiento isométrico de abductores y rotadores externos en posición neutra (0° flexión), 3-5 contracciones de 5 seg al 20-30% CVM. Evitar ROM terminal de flexión >90° y rotación interna combinada con flexión. Movilizaciones articulares grado I-II.',
    tests: [
      { name: 'Test FADDIR (Flexión-Aducción-Rotación Interna)', sn: '80%', sp: '25–26%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad — útil para DESCARTAR SIFA. Cadera a 90° de flexión, aducción completa y rotación interna máxima. Positivo: dolor en ingle.' },
      { name: 'Test FABER (Flexión-Abducción-Rotación Externa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Kappa >0.6 para fiabilidad inter-evaluador. Positivo si reproduce dolor en ingle o ASI. Útil para screening.' },
      { name: 'Rotación Interna de cadera en posición neutra <24°', sn: '29%', sp: '94%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad para SIFA cuando es positivo.' }
    ]
  },
  ca3: {
    id: 'ca3', region: 'cadera', num: '③',
    name: 'Desgarro del Labrum Acetabular',
    prom: 'iHOT-12 (MCID: 9–26 pts) / HOOS (MCID: 10–13 pts)',
    dosis: 'Activación isométrica de glúteo medio en decúbito lateral con cadera en posición neutra. 3 series × 8 contracciones de 5 seg al 25% CVM. ROM limitado a 0-70° de flexión, evitando rotación interna combinada con flexión y aducción.',
    tests: [
      { name: 'Test de Arlington', sn: '94%', sp: '33%', lr_pos: null, lr_neg: null, criterio: 'VPP 95%, VPN 26%. Alta sensibilidad — bueno para descartar. Maniobra específica de provocación labral.' },
      { name: 'Test de Torsión/Twist', sn: '68%', sp: '72%', lr_pos: null, lr_neg: '97% VPP', criterio: 'VPP 97% para desgarro labral cuando positivo.' },
      { name: 'Combinación FADDIR + FABER + Elevación pierna recta resistida', sn: '94%', sp: '100%', lr_pos: null, lr_neg: null, criterio: 'Los tres positivos simultáneamente tienen alta precisión diagnóstica.' },
      { name: 'Apoyo Monopodal <30 segundos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede indicar patología intraarticular cuando el dolor aparece antes de los 30 segundos.' }
    ]
  },
  ca4: {
    id: 'ca4', region: 'cadera', num: '④',
    name: 'Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea)',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Ejercicios isométricos de abducción de cadera en decúbito lateral con cadera en 0° de flexión/extensión. 3 series × 6 contracciones de 6 seg al 20-30% CVM. Evitar cruzar la línea media las primeras 2-3 semanas. Educación: evitar sedestación con piernas cruzadas.',
    tests: [
      { name: 'Palpación del trocánter mayor / tendón glúteo', sn: '80%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad — útil para descartar si negativo. Dolor a la palpación directa.' },
      { name: 'Apoyo Monopodal <30 segundos (Single-Leg Stance)', sn: null, sp: '100%', lr_pos: '12', lr_neg: null, criterio: 'Alta especificidad: probabilidad post-test 98% si positivo. Dolor aparece antes de los 30 segundos.' },
      { name: 'Test de Abducción Resistida de Cadera', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Secuencia diagnóstica: palpación + abducción resistida positivos → probabilidad post-test del 96%.' },
      { name: 'Marcha de Trendelenburg', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Signo visual de insuficiencia del glúteo medio. Caída pélvica contralateral al apoyo.' }
    ]
  },
  ca5: {
    id: 'ca5', region: 'cadera', num: '⑤',
    name: 'Debilidad de Abductores de Cadera',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Activación isométrica de glúteo medio en decúbito lateral con retroalimentación táctil. 2-3 series × 8 contracciones de 5-6 seg al 25-30% CVM. Mini-sentadillas bipodales con profundidad limitada a 30-40° de flexión de rodilla, 2 series × 8-10 repeticiones.',
    tests: [
      { name: 'Test de Trendelenburg', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Incapacidad de mantener pelvis nivelada al pararse sobre una pierna — pelvis cae hacia el lado de la pierna levantada.' },
      { name: 'Dinamometría manual (HHD) de abductores', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fiabilidad suficiente para medir fuerza abductora. Comparar con lado contralateral.' },
      { name: 'Test de paso lateral + marcha en tándem combinados', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ambos positivos → probabilidad de debilidad aumenta de 47% a 76%. Ambos negativos → reduce de 47% a 18%.' }
    ]
  },
  ca6: {
    id: 'ca6', region: 'cadera', num: '⑥',
    name: 'Disfunción de Control Neuromuscular de Cadera',
    prom: 'HOOS (MCID: 10–13 pts) / iHOT-12 (MCID: 14–26 pts)',
    dosis: 'Transferencias de peso en bipedestación con retroalimentación visual (espejo). 2 series × 10 repeticiones lentas y controladas. Mini-sentadillas bipodales a 30-40° de flexión de rodilla enfocándose en alineación de rodilla, cadera y tronco. Apoyo monopodal inicial 10-15 seg.',
    tests: [
      { name: 'Test de Sentadilla Monopodal (Single-Leg Squat)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Evaluación de calidad de movimiento: aducción de cadera, valgo de rodilla, inclinación de tronco. Fiabilidad y validez discriminativa suficientes.' },
      { name: 'Test de Step-Down', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Evaluación de calidad de movimiento durante el descenso desde un escalón. Fiabilidad suficiente.' },
      { name: 'Marcha de Trendelenburg (observación)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Inclinación del tronco hacia el lado de apoyo o caída pélvica contralateral.' }
    ]
  },
  ca7: {
    id: 'ca7', region: 'cadera', num: '⑦',
    name: 'Síndrome Glúteo Profundo (Síndrome Piriforme)',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Estiramientos suaves de piriforme en decúbito supino (posición FABER modificada) manteniendo 15-20 seg, 3 repeticiones, evitando síntomas radiculares. Educación: evitar sedestación prolongada, usar cojín para aliviar presión.',
    tests: [
      { name: 'Test de estiramiento del piriforme en sedestación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en literatura. Flexión de cadera + rotación interna en sedestación produce dolor profundo en glúteo.', noData: true },
      { name: 'Dolor con sedestación prolongada (>20 min)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Especialmente al conducir. El dolor mejora al ponerse en pie.', noData: true }
    ]
  },
  ca8: {
    id: 'ca8', region: 'cadera', num: '⑧',
    name: 'Pinzamiento Isquiofemoral',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Modificación de actividades: evitar zancadas largas y movimientos de extensión-rotación externa combinados. Fortalecimiento isométrico de flexores de cadera en posición neutra, 2-3 series × 6 contracciones de 5 seg al 20-25% CVM.',
    tests: [
      { name: 'Test de marcha con zancada larga (Long-Stride Walking Test)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en literatura. Reproducción del dolor con pasos largos.', noData: true }
    ]
  },
  ca9: {
    id: 'ca9', region: 'cadera', num: '⑨',
    name: 'Tendinopatía Proximal de Isquiotibiales',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Ejercicios isométricos de isquiotibiales en flexión de rodilla 30-40° (posición acortada para reducir tensión tendinosa). 3 series × 6 contracciones de 6 seg al 20-30% CVM. Evitar estiramiento agresivo de isquiotibiales en fase aguda.',
    tests: [
      { name: 'Sensibilidad a la palpación sobre tuberosidad isquiática', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados. Dolor exquisito a la palpación directa sobre la tuberosidad isquiática.', noData: true },
      { name: 'Dolor con test de fuerza de isquiotibiales', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor con contracción resistida de isquiotibiales.', noData: true }
    ]
  },
  ca10: {
    id: 'ca10', region: 'cadera', num: '⑩',
    name: 'Dolor Articular Sacroilíaco',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Ejercicios de estabilización lumbopélvica de bajo nivel: activación de transverso abdominal y multífidos en decúbito supino. 3 series × 8 contracciones de 5-6 seg al 20-30% CVM. Movilizaciones ASI grado I-II.',
    tests: [
      { name: 'Test de Compresión Pélvica', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados. Compresión sobre ambas crestas ilíacas en decúbito lateral. Positivo si reproduce dolor sacroilíaco.', noData: true },
      { name: 'Test de Patrick (FABER)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede provocar dolor sacroilíaco. Sensibilidad sobre ASI sin sensibilidad en L5.' },
      { name: 'Sin sensibilidad por encima de L5', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio clave de diferenciación respecto al origen lumbar.' }
    ]
  },

  // ─── CERVICAL ────────────────────────────────────────────
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
    tests: [
      { name: 'Test de Spurling (Compresión Foraminal)', sn: '38–98%', sp: '84–100%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad para CONFIRMAR diagnóstico. Extensión + inclinación lateral ipsilateral + compresión axial. Positivo: reproduce dolor radicular en el brazo.' },
      { name: 'Upper Limb Neurodynamic Test (ULNT) 1', sn: '70%', sp: '71%', lr_pos: null, lr_neg: null, criterio: 'Evidencia de baja certeza. Combinación de 4 ULNTs: Sn 97%, Sp 51%.' },
      { name: 'Shoulder Abduction Relief Test', sn: '49%', sp: '76%', lr_pos: null, lr_neg: null, criterio: 'El paciente coloca la mano ipsilateral sobre la cabeza — si alivia el dolor radicular, positivo.' },
      { name: 'Reflejos tendinosos (bíceps C6, tríceps C7)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Alta especificidad cuando están reducidos o ausentes. Confirman nivel radicular comprometido.' }
    ]
  },
  ce4: {
    id: 'ce4', region: 'cervical', num: '④',
    name: 'Cefalea Cervicogénica',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Entrenamiento de flexores craneocervicales (20-22 mmHg), sostener 5-10 seg. Intensidad submáxima (30-40% CVM). 5-8 repeticiones, 1-2 series. Corrección postural suave. Evitar provocar cefalea durante el ejercicio.',
    tests: [
      { name: 'Test de Flexión-Rotación Cervical (CFRT)', sn: '83%', sp: '82–83%', lr_pos: '5.0', lr_neg: '0.2', criterio: 'Punto de corte: <30° de rotación con cuello en flexión máxima (valor normal >42°). ICC 0.95-0.97 para fiabilidad test-retest. Evidencia de certeza moderada.' },
      { name: 'PAIVM C0-C3 (segmento C1-C2 más sintomático)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Kappa 0.53-0.72. Hipersensibilidad a la palpación en C1-C2.' },
      { name: 'Cluster: ROM cervical + PAIVM + CCFT', sn: '94%', sp: '100%', lr_pos: null, lr_neg: null, criterio: 'Los tres positivos simultáneamente tienen muy alta precisión diagnóstica para cefalea cervicogénica.' }
    ]
  },
  ce5: {
    id: 'ce5', region: 'cervical', num: '⑤',
    name: 'Trastornos Asociados a Latigazo Cervical (WAD)',
    prom: 'NDI (MCID: 7.5–18 pts) / EVA dolor (MCID: 2.5 pts)',
    dosis: 'Ejercicios de ROM cervical activo suave en todos los planos. ROM sin dolor (0-3/10 VAS), evitando movimientos balísticos o de alta velocidad. 5-10 repeticiones por dirección, 2-3 veces al día. Educación sobre pronóstico favorable.',
    tests: [
      { name: 'ROM Cervical Activo (reducción significativa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diferencias de -7° a -90° respecto a dolor cervical no traumático según dirección de movimiento.' },
      { name: 'Risk Assessment Score para WAD agudo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'AUC 0.90 para predecir incapacidad laboral a 1 año. Incluye ROM reducido, dolor intenso y múltiples quejas no dolorosas.' },
      { name: 'Síntomas de hiperalerta / PTSD', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Factor predictivo de discapacidad moderada/severa crónica junto con NDI inicial elevado y edad mayor.' }
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

  // ─── LUMBAR ─────────────────────────────────────────────
  lu1: {
    id: 'lu1', region: 'lumbar', num: '①',
    name: 'Disfunción Segmentaria Lumbosacra (Déficit de Movilidad)',
    prom: 'ODI (MCID: 8.5 pts) / RMDQ (MCID: 2.5–6.8 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Manipulación espinal tipo thrust (HVLA) en segmentos hipomóviles, 1-2 aplicaciones. Movilizaciones no-thrust grado I-II en rango medio. Ejercicios de inclinación pélvica en decúbito supino, 8-10 repeticiones cada 2 horas. Educación: mantener actividades habituales.',
    tests: [
      { name: 'Regla de Predicción Clínica de Flynn (4/5 criterios)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterios: síntomas <16 días, sin dolor distal a rodilla, FABQ trabajo <19 pts, ≥1 segmento hipomóvil, ≥1 cadera con >35° rotación interna. Evidencia conflictiva para dolor crónico.' },
      { name: 'Evaluación de hipomoviliidad segmentaria lumbar (PAIVM)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilización posteroanterior sobre apófisis espinosas lumbares. Detecta segmentos hipomóviles.' }
    ]
  },
  lu2: {
    id: 'lu2', region: 'lumbar', num: '②',
    name: 'Inestabilidad Espinal Lumbar (Déficit de Coordinación)',
    prom: 'ODI (MCID: 8.5 pts) / RMDQ (MCID: 2.5–6.8 pts)',
    dosis: 'Activación de transverso abdominal en decúbito supino con retroversión pélvica suave. 5 repeticiones × 5 seg de contracción submáxima (30% CVM). Evitar posiciones de final de rango (flexión/extensión completa) durante las primeras 48 horas.',
    tests: [
      { name: 'Evaluación de hipermobilidad segmentaria lumbar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad diagnóstica específica limitados en literatura. Exceso de movimiento en evaluación segmentaria.', noData: true },
      { name: 'Evaluación de control motor en bipedestación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sensación de "fallo" en rangos medios, dificultad para mantener posición neutra bajo carga.', noData: true }
    ]
  },
  lu3: {
    id: 'lu3', region: 'lumbar', num: '③',
    name: 'Dolor Radicular Lumbar',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Ejercicios direccionales que centralicen o abolezcan el dolor (según preferencia direccional). 8-10 repeticiones cada 2 horas. Si extensión centraliza: press-up modificado al 50% ROM. Si flexión centraliza: rodillas al pecho. Evitar posiciones que periferalicen.',
    tests: [
      { name: 'Test de Elevación de Pierna Recta (SLR) ipsilateral', sn: '92%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad para hernia discal. Positivo: dolor radicular (no solo dorsal) con elevación <60°.' },
      { name: 'SLR Contralateral (Lasègue cruzado)', sn: null, sp: '90%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Positivo: dolor radicular ipsilateral al elevar la pierna contralateral.' },
      { name: 'Test de Slump', sn: '78%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Sn 100% para compresión radicular subarticular pero Sp baja (0.36-0.38). Útil para descartar.' },
      { name: 'Criterios RAPIDH (5 criterios)', sn: '70.6%', sp: '90.4%', lr_pos: null, lr_neg: null, criterio: 'AUC 0.91. Criterios: distribución monoradicular, dolor unilateral en pierna, SLR+ <60°, debilidad motora unilateral, reflejo aquiliano asimétrico.' }
    ]
  },
  lu4: {
    id: 'lu4', region: 'lumbar', num: '④',
    name: 'Estenosis Espinal / Claudicación Neurogénica',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 2.8 pts para "mucha mejoría")',
    dosis: 'Flexión lumbar en decúbito supino: rodillas al pecho bilateral, 5 repeticiones × 10 seg, ROM en zona de alivio sintomático. Marcha asistida con bastón o andador que permita flexión anterior de tronco, 2-3 min con descansos frecuentes en sedestación.',
    tests: [
      { name: 'Ausencia de dolor lumbar en sedestación', sn: '52–70%', sp: '55–83%', lr_pos: null, lr_neg: null, criterio: 'El paciente está cómodo sentado pero tiene dolor al ponerse de pie y caminar.' },
      { name: 'Alivio al inclinarse hacia adelante ("signo del carrito")', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El paciente busca posición de flexión de tronco para aliviar síntomas al caminar.' },
      { name: 'Romberg positivo y marcha de base amplia', sn: '~40%', sp: '>90%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Alteración del equilibrio asociada a estenosis.' },
      { name: 'Déficits sensoriales (L3-S1)', sn: '~50%', sp: '~80%', lr_pos: null, lr_neg: null, criterio: 'Distribuciones de pinchazo/vibración en L3-S1.' }
    ]
  },

  // ─── RODILLA ─────────────────────────────────────────────
  ro1: {
    id: 'ro1', region: 'rodilla', num: '①',
    name: 'Artrosis de Rodilla',
    prom: 'KOOS (MCID: 7–9 pts distribución / 12–36 pts anchor según subescala)',
    dosis: 'Ejercicio aeróbico de bajo impacto (caminata plana o cicloergómetro) 10-15 min a intensidad leve-moderada (RPE 3-4/10). Isométricos de cuádriceps: contracciones 5 seg, 2 series × 10 rep, sin carga adicional. ROM activo-asistido en decúbito supino 10 rep en rango libre de dolor.',
    tests: [
      { name: 'Criterio combinado: Edad ≥45 + dolor en actividad + rigidez <30 min', sn: '95%', sp: '69%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad — útil para descartar. Si los tres criterios presentes: alta probabilidad diagnóstica.' },
      { name: 'Crepitación articular', sn: '89%', sp: '60%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad pero poco específica. Crepitación al movimiento pasivo de la rodilla.' },
      { name: 'Agrandamiento óseo', sn: '55%', sp: '95%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Osteofitos palpables en los márgenes articulares.' },
      { name: 'Restricción de ROM', sn: '17%', sp: '96%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad cuando está presente.' }
    ]
  },
  ro2: {
    id: 'ro2', region: 'rodilla', num: '②',
    name: 'Lesión Meniscal',
    prom: 'KOOS (MCID: 7–36 pts según subescala)',
    dosis: 'Isométricos de cuádriceps en extensión completa: contracciones 6 seg, 2 series × 8 rep. Movilización activa en descarga (decúbito supino, flexo-extensión 0-60° si tolerado, 10 rep lentas). Evitar rotación tibial y carga en flexión profunda.',
    tests: [
      { name: 'Test de McMurray', sn: '61%', sp: '84%', lr_pos: null, lr_neg: null, criterio: 'Rotación tibial + extensión de rodilla desde posición de flexión completa. Positivo: chasquido o dolor en línea articular.' },
      { name: 'Sensibilidad a la palpación de la línea articular', sn: '83%', sp: '83%', lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación directa de la línea articular medial o lateral. Alta Sn y Sp.' },
      { name: 'Combinación de tests clínicos', sn: null, sp: null, lr_pos: '2.7', lr_neg: '0.4', criterio: 'La combinación de múltiples tests mejora la precisión diagnóstica respecto a cada test individual.' }
    ]
  },
  ro3: {
    id: 'ro3', region: 'rodilla', num: '③',
    name: 'Dolor Patelofemoral (Síndrome)',
    prom: 'KOOS-PF / Kujala / VISA-P',
    dosis: 'Activación de glúteo medio en decúbito lateral: elevación isométrica 5 seg, 2 series × 8 rep. Isométricos de cuádriceps en extensión completa: 6 seg, 2 series × 10 rep. Mini-sentadillas 0-30° a velocidad lenta 3-1-3 seg, 2 series × 10 rep. Evitar flexión >60° el primer día. Considerar taping rotuliano (McConnell).',
    tests: [
      { name: 'Dolor anterior durante sentadilla', sn: '91%', sp: '50%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad. Dolor retrorrotuliano o perirotuliano durante la sentadilla.' },
      { name: 'Cluster diagnóstico: edad + localización + escaleras + palpación facetas + ROM extensión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La combinación de los 5 criterios mejora significativamente la precisión diagnóstica.' }
    ]
  },
  ro4: {
    id: 'ro4', region: 'rodilla', num: '④',
    name: 'Lesión del Ligamento Cruzado Anterior (LCA)',
    prom: 'KOOS / IKDC (MCID: 12.2 pts)',
    dosis: 'Co-contracciones isométricas de cuádriceps e isquiotibiales en extensión completa: 6 seg, 2 series × 8 rep. Elevación de pierna recta con rodilla en extensión completa: 2 series × 10 rep. Movilización activa-asistida 0-90° en descarga. Evitar traslación anterior de tibia. Muletas según necesidad.',
    tests: [
      { name: 'Test de Lachman', sn: '81–87%', sp: '85–97%', lr_pos: null, lr_neg: null, criterio: 'Primera elección. Rodilla en 30° de flexión, traslación anterior de tibia con estabilización distal del fémur. Positivo: traslación anterior aumentada o sin punto firme.' },
      { name: 'Test de Cajón Anterior', sn: '64–83%', sp: '85–87%', lr_pos: null, lr_neg: null, criterio: 'Rodilla a 90° de flexión. Traslación anterior de tibia. Menos sensible que Lachman pero útil.' },
      { name: 'Test de Pivot Shift', sn: '55–59%', sp: '94–97%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Roto-subluxación de la tibia con extensión + valgo + rotación interna. Mejor bajo anestesia.' },
      { name: 'Lever Sign Test', sn: '79–83%', sp: '91–92%', lr_pos: null, lr_neg: null, criterio: 'Puño debajo de la rodilla — si el LCA está roto, el talón no se eleva.' }
    ]
  },
  ro5: {
    id: 'ro5', region: 'rodilla', num: '⑤',
    name: 'Tendinopatía Rotuliana',
    prom: 'VISA-P / KOOS',
    dosis: 'Contracciones isométricas de cuádriceps a 60° de flexión: 5 series × 45 seg con descanso 2 min entre series, intensidad submáxima (sin dolor >3/10). Evitar ejercicios pliométricos y carga excéntrica en fase inicial.',
    tests: [
      { name: 'Dolor localizado en polo inferior de rótula + palpación del tendón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diagnóstico principalmente clínico. Dolor exquisito a la palpación del polo inferior rotuliano.' },
      { name: 'Dolor durante sentadilla en tabla inclinada (decline squat)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Test específico para tendinopatía rotuliana. Más sensible que sentadilla plana.' },
      { name: 'Ecografía (Sn 87%, Sp 82%) o RMN', sn: '87%', sp: '82%', lr_pos: null, lr_neg: null, criterio: 'Imagen confirmatoria si no hay respuesta al tratamiento. Engrosamientos y cambios de señal en el tendón.' }
    ]
  },
  ro6: {
    id: 'ro6', region: 'rodilla', num: '⑥',
    name: 'Síndrome de la Banda Iliotibial',
    prom: 'KOOS / LEFS (MCID: 8.4–22.5 pts)',
    dosis: 'Activación de glúteo medio en decúbito lateral sin abducción completa: isométrica 5 seg, 2 series × 8 rep, ROM limitado a 15° de abducción. Estiramiento suave de BIT en decúbito lateral 20 seg, 3 rep. Evitar flexo-extensión repetitiva en rango 20-30°.',
    tests: [
      { name: 'Test de Ober', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Decúbito lateral, cadera en abducción-extensión, rodilla 90°. Positivo si la rodilla no alcanza la camilla o hay dolor.' },
      { name: 'Test de Compresión de Noble', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Compresión de la BIT sobre el cóndilo femoral lateral a 30° de flexión. Positivo si reproduce el dolor característico.' }
    ]
  },
  ro7: {
    id: 'ro7', region: 'rodilla', num: '⑦',
    name: 'Bursitis de la Pata de Ganso',
    prom: 'KOOS / EVA (MCID: 22.6 pts en escala 0-100)',
    dosis: 'Isométricos de isquiotibiales en decúbito prono con rodilla en extensión completa: 5 seg, 2 series × 8 rep (submáximos). Movilización activa 0-60° en decúbito supino, 10 rep lentas. Evitar flexión resistida y estiramiento agresivo de isquiotibiales mediales. Hielo local 10-15 min post-ejercicio.',
    tests: [
      { name: 'Dolor y tumefacción en cara medial de rodilla (inserción pata de ganso)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a 2 cm distal a la meseta tibial medial. Diagnóstico clínico. Datos de fiabilidad diagnóstica limitados/ausentes.', noData: true },
      { name: 'Ecografía o RMN confirmatoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Prevalencia del 20% en pacientes con artrosis sintomática de rodilla. Más común en mujeres y edad avanzada.', noData: true }
    ]
  },

  // ─── CODO ─────────────────────────────────────────────
  co1: {
    id: 'co1', region: 'codo', num: '①',
    name: 'Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista)',
    prom: 'PRTEE (MCID: 20 pts) o QuickDASH (MCID: 10–16 pts)',
    dosis: 'Isométrico de extensión de muñeca con codo 90° en supinación. Contracción sostenida 5-10 seg sin dolor, 10 rep × 1 serie. Estiramiento suave de extensores con antebrazo pronado y codo extendido.',
    tests: [
      { name: 'Test de Cozen (extensión resistida de muñeca)', sn: '91%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor en epicóndilo lateral con extensión resistida de muñeca.' },
      { name: 'Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)', sn: '78–83%', sp: '80–90%', lr_pos: null, lr_neg: null, criterio: 'Diferencia de fuerza de prensión entre codo flexionado y extendido.' },
      { name: 'Test de Thomsen (extensión resistida de muñeca)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Variante del Test de Cozen. Extensión resistida con el codo en extensión completa.' }
    ]
  },
  co2: {
    id: 'co2', region: 'codo', num: '②',
    name: 'Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista)',
    prom: 'PRTEE (MCID: 20 pts) o QuickDASH (MCID: 10–16 pts)',
    dosis: 'Isométrico de flexión de muñeca con codo 90°, contracción sostenida 5-10 seg sin dolor, 10 rep × 1 serie. Estiramiento suave de flexores con codo extendido y muñeca en extensión pasiva.',
    tests: [
      { name: 'Dolor a la palpación del epicóndilo medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor reproducible a la palpación directa del epicóndilo medial o tendón común flexor-pronador.' },
      { name: 'Dolor con flexión resistida de antebrazo y pronación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor con resistencia a la flexión de muñeca y/o pronación del antebrazo.' },
      { name: 'Sonoelastografía confirmatoria', sn: '95.2%', sp: '92%', lr_pos: null, lr_neg: null, criterio: 'Alta precisión diagnóstica por imagen. Datos de fiabilidad limitados para tests clínicos específicos.' }
    ]
  },
  co3: {
    id: 'co3', region: 'codo', num: '③',
    name: 'Capsulitis Adhesiva del Codo (Rigidez Post-traumática)',
    prom: 'Oxford Elbow Score (MCID: 8–20 pts) o QuickDASH (MCID: 10–16 pts)',
    dosis: 'Movilización activa-asistida en todas las direcciones (flexión, extensión, pronación, supinación) dentro del rango disponible sin dolor. 5 rep lentas × 2 series por dirección. Detener al primer punto de resistencia. Evitar estiramiento agresivo.',
    tests: [
      { name: 'Test de ROM activo en 4 direcciones', sn: '99%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Para lesiones radiográficas. Extensión completa, flexión a 90°, pronación y supinación completas.' },
      { name: 'Limitación activa Y pasiva comparada con lado sano', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados para tests específicos de capsulitis de codo en literatura.', noData: true }
    ]
  },
  co4: {
    id: 'co4', region: 'codo', num: '④',
    name: 'Insuficiencia del Ligamento Colateral Cubital (LCC)',
    prom: 'QuickDASH (MCID: 10–16 puntos)',
    dosis: 'Isométrico de flexión de codo en posición neutra (sin valgo), contracción sostenida 5 seg, 10 rep × 1 serie. Evitar completamente el estrés en valgo. Mantener codo en posición protegida (flexión 70-90°).',
    tests: [
      { name: 'Ecografía dinámica con estrés en valgo', sn: '96%', sp: '81%', lr_pos: null, lr_neg: null, criterio: 'Delta de apertura articular >1.0 mm comparado con lado contralateral. Técnica de elección no invasiva.' },
      { name: 'RM con artrograma', sn: '81%', sp: '91%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Gold standard para lesiones del LCC.' },
      { name: 'Test de valgo dinámico (maniobra de ordeño, test de valgo móvil de Mayo)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más confiable que el valgo estático. Reproducción del dolor medial con estrés en valgo dinámico.' }
    ]
  },
  co5: {
    id: 'co5', region: 'codo', num: '⑤',
    name: 'Inestabilidad Rotatoria Posterolateral (IRPL)',
    prom: 'QuickDASH (MCID: 10–16 puntos)',
    dosis: 'Isométrico de extensión de codo en posición neutra (sin rotación), 5 seg, 10 rep × 1 serie. Evitar rotación externa y supinación forzada. Mantener antebrazo en pronación leve.',
    tests: [
      { name: 'Test de cajón posterolateral / Test de pivote lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad diagnóstica limitados/ausentes en literatura para tests clínicos específicos.', noData: true },
      { name: 'Dolor lateral con palpación del ligamento colateral radial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sensibilidad a la palpación del complejo ligamentario lateral.', noData: true }
    ]
  },
  co6: {
    id: 'co6', region: 'codo', num: '⑥',
    name: 'Pinzamiento Posterolateral por Plica Radiocapitelar',
    prom: 'DASH (MCID: 10–11 pts) o Mayo Elbow Performance Score',
    dosis: 'Movilización activa de flexo-extensión de codo evitando rango terminal de extensión. 10 rep lentas × 2 series, deteniendo 10-15° antes de extensión completa. Evitar movimientos rotatorios combinados que reproduzcan el pinzamiento.',
    tests: [
      { name: 'Dolor posterolateral en línea articular radiocapitelar a la palpación', sn: '83.3%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Presente en el 83.3% de los casos confirmados artroscópicamente.' },
      { name: 'Test de plica radiocapitelar posterolateral', sn: '83.3%', sp: '87.5%', lr_pos: null, lr_neg: null, criterio: 'Precisión del 86.3%. RM identifica plica patológica en 70.8% de casos.' }
    ]
  },
  co7: {
    id: 'co7', region: 'codo', num: '⑦',
    name: 'Rotura Distal del Bíceps',
    prom: 'QuickDASH (MCID: 10–16 puntos)',
    dosis: 'Isométrico de flexión de codo a 90° con antebrazo en posición neutra (NO en supinación). Contracción submáxima (20-30% esfuerzo), 5 seg, 5 rep × 1 serie. Evitar supinación activa y cargas excéntricas. Posición protegida con soporte gravitacional.',
    tests: [
      { name: 'Test del Gancho (Hook Test)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Alta precisión diagnóstica. Con el codo en 90° de flexión activa y antebrazo supinado, se intenta "enganchar" el tendón del bíceps con el dedo índice. Imposible si hay rotura.' },
      { name: 'Deformidad visible del contorno del bíceps + equimosis fosa antecubital', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Signo visual directo de rotura. Equimosis en la fosa antecubital las primeras 24-48 horas.' }
    ]
  },
  co8: {
    id: 'co8', region: 'codo', num: '⑧',
    name: 'Neuropatía Cubital (Síndrome del Túnel Cubital)',
    prom: 'QuickDASH (MCID: 10–16 puntos)',
    dosis: 'Deslizamiento neural suave del nervio cubital: codo en extensión parcial (30-40°), muñeca neutra, movimiento lento de flexión cervical contralateral. 5 rep × 1 serie, sin provocar parestesias. Evitar flexión completa de codo.',
    tests: [
      { name: 'Test de Tinel en túnel cubital', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Recomendado en literatura. Percusión sobre el nervio cubital en el surco epitrócleo-olecraniano. Positivo: parestesias en 4º y 5º dedo.' },
      { name: 'Evaluación de subluxación del nervio cubital', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Con flexo-extensión de codo — el nervio cubital puede subluxarse sobre el epicóndilo medial.' },
      { name: 'Electrodiagnóstico (velocidad de conducción nerviosa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Gold standard para confirmar neuropatía y determinar nivel y severidad de la lesión.' }
    ]
  },
  co9: {
    id: 'co9', region: 'codo', num: '⑨',
    name: 'Síndrome del Túnel Radial (Compresión Nervio Interóseo Posterior)',
    prom: 'QuickDASH (MCID: 10–16 puntos)',
    dosis: 'Deslizamiento neural del nervio radial: codo en extensión, antebrazo en pronación, muñeca en flexión palmar suave. 5 rep lentas × 1 serie, sin provocar dolor. Evitar estiramiento agresivo y posiciones de compresión neural.',
    tests: [
      { name: 'Dolor en antebrazo proximal (NO en epicóndilo lateral)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Localización más distal que la epicondilalgia lateral. Puede coexistir con ella.' },
      { name: 'Dolor con extensión resistida del 3er dedo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad diagnóstica limitados/ausentes en literatura. Provoca dolor en zona del nervio interóseo posterior.' }
    ]
  }
};


const NRS_LABELS = ['Sin dolor','Dolor muy leve','Dolor leve','Dolor leve-moderado','Dolor moderado','Dolor moderado','Dolor moderado-intenso','Dolor intenso','Dolor intenso','Dolor muy intenso','Dolor máximo'];
const NRS_CLASSES = ['nrs-0','nrs-1','nrs-2','nrs-3','nrs-4','nrs-5','nrs-6','nrs-7','nrs-8','nrs-9','nrs-10'];

const PHASE_DEFS = [
  { n: 1,    label: 'Triage y Cabecera',       short: 'Fase 1' },
  { n: 2,    label: 'Cribado Sistémico',        short: 'Fase 2' },
  { n: 3,    label: 'SINSS',                    short: 'Fase 3' },
  { n: 4,    label: 'Algoritmo CIF',            short: 'Fase 4' },
  { n: '4b', label: 'Confirmación de Hipótesis',short: 'Fase 4b' },
  { n: 5,    label: 'Resultados',               short: 'Fase 5' },
];
const PHASE_NAV_IDS = { 1:'nav1', 2:'nav2', 3:'nav3', 4:'nav4', '4b':'nav4b', 5:'nav5' };
