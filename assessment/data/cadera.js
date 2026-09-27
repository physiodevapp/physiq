// ============================================================
// PhysiQ-Assessment · data/cadera.js
// Contenido clínico de la región CADERA: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.cadera
export const screening = {
  label: 'Cuadrante Inferior — Cadera, Ingle y Muslo',
  // Recuadro de urgencia: literal de la tarjeta de consulta cadera (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'DERIVACIÓN URGENTE · FRACTURA DE ESTRÉS DEL CUELLO FEMORAL',
    lineas: [
      'Puede completarse y comprometer la vascularización de la cabeza femoral. Dolor inguinal vago e insidioso que empeora con la actividad; a menudo el único hallazgo es dolor al final del rango, sobre todo en RI. Dolor profundo nocturno o en carga.',
      'Perfil: corredor de fondo, militar o deportista de alta intensidad; poca forma al empezar, cambio de superficie o calzado; mujer con tríada de la deportista; corticoides prolongados.',
      'Percusión rotuliano-púbica (estudiada en fractura de cadera o pelvis tras traumatismo, no en la de estrés; S 85 %, E 70 %, LR+ 2,9, LR− 0,2): supino, fonendoscopio sobre el tubérculo púbico homolateral y percusión de la rótula; positivo si el sonido llega disminuido en el lado doloroso. Talón: golpe con el borde cubital del puño; positivo si reproduce el dolor con la carga axial.',
      'Una radiografía negativa NO descarta, sobre todo en las primeras semanas. · Adenopatía inguinal sin foco séptico: considerar malignidad. · Sospecha de torsión testicular o de artritis séptica: urgencias hoy.'
    ]
  },
  sistemas: [
    {
      id: 'ca_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Dolor óseo intenso al cargar peso o fractura patológica ante trauma menor',
        'Dolor constante nocturno en cadera/muslo sin alivio postural',
        'Antecedentes de cáncer de próstata, testículo, colon o riñón',
        'Masa palpable en muslo o zona glútea',
        // Tarjeta cadera (guía de consulta), BANDERAS «Cáncer»
        '≥50 años + sin mejoría en 1 mes + pérdida de peso + cáncer previo: S 100 % para malignidad. Lo que más informa: cáncer previo, sospecha clínica, VSG elevada y hematocrito bajo',
        'Masas o ganglios que crecen o fluctúan; avulsión ósea en un adulto mayor (descartar metástasis)',
        'Adenopatía inguinal sin foco séptico en el miembro inferior: considerar malignidad'
      ],
      banderasAmarillas: [
        'Edad >50 años con dolor insidioso en cadera',
        'Pérdida de peso inexplicada'
      ],
      preguntas: [
        { id: 'c5', text: '¿Tiene antecedentes de cáncer de cualquier tipo (especialmente próstata, mama, pulmón, riñón)?', alerta: true, s1: true },
        { id: 'ca_on2', text: '¿El dolor en cadera/muslo es constante, nocturno e intenso, sin posición que lo alivie?', alerta: true },
        { id: 'ca_on3', text: '¿Ha notado pérdida de peso rápida e inexplicada, o ha descubierto algún bulto nuevo?', alerta: true, s1: true },
        { id: 'ca_on4', text: '¿Ha notado un ganglio o bulto en la ingle sin una herida, infección o rozadura en esa pierna que lo explique?', alerta: true }
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
        'Signos de TVP: edema, eritema, calor y dolor en pantorrilla',
        // Tarjeta cadera (guía de consulta), BANDERAS «Vascular»: sin pistas propias, regla del dolor atípico
        'Oclusión aortoilíaca (síndrome de Leriche), enfermedad vascular periférica, variz de la safena'
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
        'Fiebre con dolor en flanco y escalofríos (pielonefritis)',
        // Tarjeta cadera (guía de consulta), BANDERAS «Visceral, urogenital o ginecológico» y URGENCIA
        'Litiasis renal, uretritis; prostatitis, epididimitis, torsión testicular (urgencias hoy)',
        'Endometriosis, quiste ovárico, enfermedad inflamatoria pélvica; cáncer ginecológico, de próstata, testículo o vía urinaria',
        'Denominador común: dolor atípico, sin relación clara con la carga, nocturno o con síntomas no musculoesqueléticos'
      ],
      banderasAmarillas: [
        'Ardor o dificultad al orinar acompañando el dolor de ingle',
        'Dolor en ingle que no cambia con movimiento de cadera'
      ],
      preguntas: [
        { id: 'c3', text: '¿Ha notado sangre en la orina, ardor o dolor al orinar, o fiebre/escalofríos?', alerta: true, s1: true },
        { id: 'ca_u2', text: '(Hombres) ¿Ha notado dolor testicular, secreciones inusuales o dificultad al orinar?', alerta: true },
        { id: 'ca_u3', text: '(Hombres) ¿Ha empezado de golpe un dolor intenso en un testículo, con hinchazón, náuseas o vómitos?', alerta: true, urgencia: 'Sospecha de torsión testicular: derivación a urgencias hoy.' },
        { id: 'ca_u4', text: '(Mujeres) ¿El dolor de ingle o pelvis se relaciona con la regla, con las relaciones sexuales, o tiene flujo o sangrado inusual?', alerta: true }
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
        'Fiebre y dolor abdominal simultáneo al dolor de cadera',
        // Tarjeta cadera (guía de consulta), BANDERAS «Hernia inguinal o femoral» y «Visceral»
        'Apendicitis, enfermedad de Crohn, diverticulitis; cáncer digestivo, linfoma',
        'Hernia inguinal (80 % varones: dolor, tumefacción y bulto con sensación de peso o arrastre) o femoral (85 % mujeres: nódulo lateral e inferior al tubérculo púbico). Palpar DE PIE el canal inguinal y, si no se nota, pedir que tosa'
      ],
      banderasAmarillas: [
        'Distensión abdominal acompañando el dolor de cadera',
        'Uso crónico de AINEs'
      ],
      preguntas: [
        { id: 'c4', text: '¿El dolor en la ingle o cadera se acompaña de molestias, distensión abdominal o se alivia al defecar/pasar gases?', alerta: true, s1: true },
        { id: 'ca_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces o dificultad para limpiarse?', alerta: true },
        { id: 'ca_gi3', text: '¿Nota un bulto en la ingle, con sensación de peso o de que algo tira, que aumenta al toser o al hacer fuerza?', alerta: true }
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
    {
      // Tarjeta cadera (guía de consulta), BANDERAS «Fractura de estrés»,
      // «Osteonecrosis», «Lesiones del desarrollo» y «Fractura por avulsión»,
      // más la URGENCIA de cuello femoral. Radiografía negativa NO descarta.
      id: 'ca_oseo', icon: '🦴', nombre: 'Óseo / Desarrollo',
      banderasRojas: [
        'Fractura de estrés del cuello femoral: dolor inguinal vago e insidioso que empeora con la actividad, dolor al final del rango (sobre todo en RI), dolor profundo nocturno o en carga → DERIVACIÓN URGENTE',
        'Fractura de estrés de rama púbica (corredores, mucho trabajo de aductores; el dolor NO aumenta con abducción pasiva ni aducción resistida) o de diáfisis femoral (dolor vago en muslo anterior en carga; fulcro S 88–93 %, E 13–75 %)',
        'Osteonecrosis de la cabeza femoral: corticoides o alcohol prolongados, traumatismo o fractura previos, lupus y otras conectivopatías, hiperlipidemia; dolor inguinal profundo en carga',
        'Lesiones del desarrollo: EFCF (9–16 años, durante el estirón), Perthes (4–8 años, más en varones), displasia, apofisitis púbica',
        'Fractura por avulsión en el adolescente con tracción brusca (EIAI, EIAS, pubis, tuberosidad isquiática, trocánteres); en un adulto mayor, descartar metástasis'
      ],
      banderasAmarillas: [
        'Perfil de fractura de estrés: corredor de fondo, militar o deportista de alta intensidad; poca forma al empezar, cambio de superficie o calzado; mujer con tríada de la deportista; corticoides prolongados',
        'Antecedente de EFCF, Perthes o displasia: hace más probable el dolor de cadera en el joven'
      ],
      preguntas: [
        { id: 'ca_os1', text: '¿Hace deporte de resistencia o de alta intensidad (o es militar), y el dolor de ingle empezó poco a poco, empeora al cargar peso o al hacer actividad y le duele también de noche?', alerta: true, s1: true, urgencia: 'Sospecha de fractura de estrés del cuello femoral: derivación urgente (una radiografía negativa no la descarta).' },
        { id: 'ca_os2', text: '¿Toma o ha tomado corticoides durante mucho tiempo, bebe alcohol a diario, o tiene lupus u otra enfermedad del tejido conectivo?', alerta: true },
        { id: 'ca_os3', text: '(Menores de 18 años) ¿Cojea, o el dolor empezó durante el estirón o tras un tirón brusco al chutar, esprintar o saltar?', alerta: true },
        { id: 'ca_os4', text: '¿De niño o adolescente tuvo algún problema en las caderas (displasia, Perthes, epifisiolisis)?', alerta: false }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), BANDERAS «Inflamatoria o infecciosa»
      // y URGENCIA («sospecha de artritis séptica: urgencias hoy»).
      id: 'ca_inflam', icon: '🔥', nombre: 'Inflamatoria / Infecciosa',
      banderasRojas: [
        'Artritis séptica, osteomielitis, absceso del psoas: fiebre, malestar general, tumefacción dolorosa → urgencias hoy si se sospecha artritis séptica',
        'AR y otras artropatías multiarticulares, espondilitis anquilosante'
      ],
      banderasAmarillas: [
        'VSG como prueba de bajo coste antes que la RM'
      ],
      preguntas: [
        { id: 'ca_in1', text: '¿Tiene fiebre o se encuentra mal en general, con la cadera muy dolorosa o hinchada, hasta el punto de no poder apoyar la pierna?', alerta: true, s1: true, urgencia: 'Sospecha de artritis séptica: derivación a urgencias hoy.' },
        { id: 'ca_in2', text: '¿Le duelen o se le hinchan otras articulaciones, o tiene diagnóstico de artritis reumatoide o espondilitis anquilosante?', alerta: true }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.cadera
export const tree = {
  title: 'Algoritmo CIF — Cadera',
  steps: [
    {
      id: 'ca_step1',
      tag: 'Paso 1 — Diferenciación Proximal (Clearing)',
      question: '¿El dolor podría ser referido desde la columna lumbar o la articulación sacroilíaca?',
      options: [
        { label: 'SÍ — Sensibilidad sobre la ASI (sin sensibilidad en L5) y test de compresión pélvica positivo', value: 'si_asi', next: null, hypothesis: ['ca10'] },
        { label: 'SÍ — Dolor que cambia con movimientos repetidos de la espalda o déficit neurológico dermatomal', value: 'si_lumbar', next: null, hypothesis: [] },
        { label: 'NO — Origen puramente coxofemoral', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 4: lesión aguda. Palpar
      // primero; luego resistencia y estiramiento.
      id: 'ca_step1b',
      tag: 'Paso 1b — Lesión Aguda de Ingle',
      question: '¿Hay un evento desencadenante concreto y reciente (chut, sprint, cambio de dirección, estiramiento)?',
      options: [
        { label: 'SÍ — LESIÓN AGUDA: palpar primero; luego resistencia y estiramiento', value: 'si', next: null, hypothesis: ['ca11'] },
        { label: 'NO — Sin evento desencadenante concreto', value: 'no', next: null, hypothesis: [] }
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
      // Tarjeta cadera (guía de consulta), nodo 5b. Solo se llega si el paso 3
      // es positivo (su «Negativos» salta al paso 4: intraarticular improbable).
      // La tarjeta dice «identificar entidad» sin nombrarlas: aquí van las
      // fichas intraarticulares que aún no activa el paso 3.
      id: 'ca_step3b',
      tag: 'Paso 3b — Intraarticular Probable (Thomas)',
      question: '¿Thomas positivo con historia compatible (signo de la «C», síntomas mecánicos)? Identificar la entidad; pueden coexistir.',
      options: [
        { label: 'INESTABILIDAD / LIGAMENTO REDONDO — Movilidad aumentada, log roll positivo, al menos un episodio de fallo', value: 'inestabilidad', next: null, hypothesis: ['ca12'] },
        { label: 'CONDROPATÍA — Dolor en reposo y nocturno con síntomas mecánicos, rigidez; IMC >25', value: 'condropatia', next: null, hypothesis: ['ca13'] },
        { label: 'ARTROSIS — ≥50 años', value: 'artrosis', next: null, hypothesis: ['ca1'] },
        { label: 'FAIS / LABRUM — Thomas positivo sin rasgos de las anteriores (ya activados en el paso 3)', value: 'fais_labrum', next: null, hypothesis: [] },
        { label: 'NO CONCLUYENTE — Pueden coexistir: seguir', value: 'no', next: null, hypothesis: [] }
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
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 6, INGLE: entidades de Doha
      // (tabla ORIENTATIVA de la tarjeta). Lo LATERAL (SDTM) ya está en el paso 4.
      id: 'ca_step6',
      tag: 'Paso 6 — Ingle (Entidades de Doha)',
      question: '¿Qué reproduce su dolor conocido en la INGLE? Palpar primero y con precisión: las estructuras se solapan.',
      options: [
        { label: 'ADUCTOR — Palpación dolorosa de aductores + squeeze doloroso', value: 'aductor', next: null, hypothesis: ['ca16'] },
        { label: 'PSOAS ILÍACO — Palpación dolorosa supra o infrainguinal', value: 'psoas', next: null, hypothesis: ['ca17'] },
        { label: 'INGUINAL — Palpación dolorosa del canal sin hernia palpable (de pie y con tos)', value: 'inguinal', next: null, hypothesis: ['ca18'] },
        { label: 'PÚBICO — Palpación dolorosa de la sínfisis y el hueso adyacente', value: 'pubico', next: null, hypothesis: ['ca19'] },
        { label: 'NINGUNO — Sin dolor inguinal o nada lo reproduce', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 6, NEUROPÁTICO y «nada encaja».
      id: 'ca_step7',
      tag: 'Paso 7 — Neuropático o Dolor Extenso',
      question: '¿Hay un patrón neuropático, o nada encaja y el dolor es extenso?',
      options: [
        { label: 'MERALGIA — Tinel bajo la EIAS, parestesias anterolaterales del muslo', value: 'meralgia', next: null, hypothesis: ['ca14'] },
        { label: 'OBTURADOR — Dolor en ingle y muslo medial con el ejercicio', value: 'obturador', next: null, hypothesis: ['ca14'] },
        { label: 'ILIOINGUINAL, ILIOHIPOGÁSTRICO O GENITOFEMORAL — Arch and twist de pie', value: 'ilioinguinal', next: null, hypothesis: ['ca14'] },
        { label: 'SENSIBILIZACIÓN CENTRAL — Nada encaja o dolor extenso (revisar banderas rojas)', value: 'sc', next: null, hypothesis: ['ca15'] },
        { label: 'NINGUNO — Sin patrón neuropático ni dolor extenso', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── CADERA ─────────────────────────────────────────────
  ca1: {
    id: 'ca1', region: 'cadera', num: '①',
    name: 'Artrosis de Cadera',
    prom: 'HOOS (MCID: 10–13 puntos en subescalas)',
    dosis: 'Ejercicios de cadena cinética abierta sin carga (elevaciones de pierna en decúbito supino). 1-2 series de 8-10 repeticiones al 30-40% CVM, ROM limitado a 0-60° de flexión de cadera. Ejercicio aeróbico de bajo impacto 5-10 min al 40-50% FC reserva.',
    pronostico: {
      horizonte: 'Radiografía: pinzamiento del espacio articular u osteofitos.',
      derivacion: 'Considerarla siempre en mayores de 50, también en deportistas. La sensibilización central se ha estudiado sobre todo aquí y hace los síntomas vagos.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h', sn: '95%', sp: '69%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad — útil para descartar si negativo.' },
      { name: 'Aducción de cadera disminuida', sn: '80%', sp: '81%', lr_pos: '4.2', lr_neg: '0.25', criterio: 'Pérdida de aducción pasiva comparada con el lado sano.' },
      { name: 'Rotación Interna disminuida (<24°)', sn: '66%', sp: '79%', lr_pos: '3.2', lr_neg: null, criterio: 'Rotación interna pasiva de cadera menor de 24° (o 15° menos que lado sano).' },
      { name: 'Dolor posterior con sentadilla profunda', sn: '24%', sp: '96%', lr_pos: '6.1', lr_neg: null, criterio: 'Alta especificidad. Dolor posterior al realizar una sentadilla profunda.' },
      { name: 'Debilidad de abductores', sn: '44%', sp: '90%', lr_pos: '4.5', lr_neg: null, criterio: 'Medida por dinamometría. Alta especificidad.' },
      { name: 'Criterios clínicos ACR (árbol de clasificación)', sn: '86%', sp: '75%', lr_pos: null, lr_neg: null, absorbe: [0, 2], criterio: 'Dolor de cadera y, además: (1) RI ≥15°, dolor en la RI, rigidez matutina ≤60 min y edad >50 años; o bien (2) RI <15° y VSG ≤45 mm/h (sin VSG: flexión ≤115°). La tarjeta cita solo la rama (1); la S/E es del árbol completo. Validación cruzada: S 83 %, E 68 %. Incluye la RI: si se puntúan los criterios ACR, el criterio combinado y la RI disminuida no suman aparte.', fuente: 'Altman 1991 (Arthritis Rheum, criterios ACR; n = 201 con dolor de cadera, controles con dolor de cadera de otra causa)' }
    ]
  },
  ca2: {
    id: 'ca2', region: 'cadera', num: '②',
    name: 'Síndrome de Pinzamiento Femoroacetabular (SIFA)',
    prom: 'iHOT-12 (MCID: 14–26 puntos)',
    dosis: 'Fortalecimiento isométrico de abductores y rotadores externos en posición neutra (0° flexión), 3-5 contracciones de 5 seg al 20-30% CVM. Evitar ROM terminal de flexión >90° y rotación interna combinada con flexión. Movilizaciones articulares grado I-II.',
    pronostico: {
      horizonte: 'Radiografía AP de pelvis + axial. CAM: ángulo alfa >55°. PINCER: sobrecobertura, signo del cruce. Artro-RM para labrum y cartílago.',
      derivacion: 'CAM en asintomáticos: 54,8 % de deportistas y 23,1 % de población general. Sin dolor relacionado con el movimiento NO hay FAIS. CAM tiende a lesionar el cartílago; PINCER, el labrum.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test FADDIR (Flexión-Aducción-Rotación Interna)', sn: '99%', sp: '5%', lr_pos: '1.04', lr_neg: '0.14', criterio: 'Alta sensibilidad — útil para DESCARTAR SIFA. Cadera a 90° de flexión, aducción completa y rotación interna máxima. Positivo: dolor conocido, bloqueo, chasquido o enganche.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 4 estudios, n = 319, referencia: cirugía; LR− IC 95 %: 0,02–0,93). Con artro-RM como referencia, LR− 0,45 (IC hasta 1,09). Estudios de baja calidad con pacientes de alta probabilidad previa. Antes: S 80 %, E 25–26 % sin fuente' },
      { name: 'Test FABER (Flexión-Abducción-Rotación Externa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Kappa >0.6 para fiabilidad inter-evaluador. Positivo si reproduce dolor en ingle o ASI. Útil para screening.' },
      { name: 'Rotación Interna de cadera en posición neutra <24°', sn: '29%', sp: '94%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad para SIFA cuando es positivo.' },
      { name: 'Dolor inguinal', sn: '96–100%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin dolor inguinal, FAIS y labrum son improbables.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' },
      { name: 'Test de flexión-rotación interna', sn: null, sp: null, lr_pos: '1.28', lr_neg: null, criterio: 'Supino, cadera a 90° de flexión y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche. Metaanálisis: S 96 %, E 25 %, LR− 0,15, pero con IC 95 % hasta 1,99 (27 pacientes): la tarjeta lo usa para descartar, la evidencia aún no lo sostiene.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 2 estudios, n = 27)' },
      { name: 'Test de Thomas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. Su evidencia (S 89 %, E 92 %) es para rotura labral, no para FAIS: aquí cuenta como hallazgo y puntúa en la hipótesis de labrum.', fuente: 'McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)' }
    ]
  },
  ca3: {
    id: 'ca3', region: 'cadera', num: '③',
    name: 'Desgarro del Labrum Acetabular',
    prom: 'iHOT-12 (MCID: 9–26 pts) / HOOS (MCID: 10–13 pts)',
    dosis: 'Activación isométrica de glúteo medio en decúbito lateral con cadera en posición neutra. 3 series × 8 contracciones de 5 seg al 25% CVM. ROM limitado a 0-70° de flexión, evitando rotación interna combinada con flexión y aducción.',
    pronostico: {
      horizonte: 'Artro-RM (contraste necesario). Mayoría anterosuperiores. Diferenciar del surco sublabral, variante normal.',
      derivacion: 'Más de dos tercios de los asintomáticos tienen hallazgos sugestivos, más aún los deportistas. La sinovitis mantenida puede favorecer la condropatía.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Arlington', sn: '94%', sp: '33%', lr_pos: null, lr_neg: null, criterio: 'VPP 95%, VPN 26%. Alta sensibilidad — bueno para descartar. Maniobra específica de provocación labral.' },
      { name: 'Test de Torsión/Twist', sn: '68%', sp: '72%', lr_pos: null, lr_neg: null, criterio: 'VPP 97% para desgarro labral cuando positivo.' },
      { name: 'Combinación FADDIR + FABER + Elevación pierna recta resistida', sn: '94%', sp: '100%', lr_pos: null, lr_neg: null, criterio: 'Los tres positivos simultáneamente tienen alta precisión diagnóstica.' },
      { name: 'Apoyo Monopodal <30 segundos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede indicar patología intraarticular cuando el dolor aparece antes de los 30 segundos.' },
      { name: 'Chasquido doloroso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Chasquido en la cadera asociado al dolor inguinal. Sin él, la rotura es improbable. Estudio: S 100 % (IC 95 %: 48–100 %), E 85 % (IC 55–98 %), sin LR publicada; con S 100 % la LR− calculada sería 0 y anularía la hipótesis, y con solo 4 roturas el intervalo es muy amplio: cuenta como hallazgo.', fuente: 'Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)' },
      { name: 'Test de flexión-rotación interna', sn: null, sp: null, lr_pos: '1.28', lr_neg: null, criterio: 'Supino, cadera a 90° de flexión y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche. Metaanálisis: S 96 %, E 25 %, LR− 0,15, pero con IC 95 % hasta 1,99 (27 pacientes): la tarjeta lo usa para descartar, la evidencia aún no lo sostiene.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 2 estudios, n = 27)' },
      { name: 'FADDIR (valor agrupado)', sn: '99%', sp: '5%', lr_pos: '1.04', lr_neg: '0.14', criterio: 'Flexión, aducción y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche (que reproduzca el chasquido cuenta como positivo). Solo descarta.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 4 estudios, n = 319, referencia: cirugía; LR− IC 95 %: 0,02–0,93). Con artro-RM como referencia, LR− 0,45 (IC hasta 1,09). Estudios de baja calidad con pacientes de alta probabilidad previa' },
      { name: 'Test de Thomas', sn: null, sp: null, lr_pos: '11.1', lr_neg: null, criterio: 'Si la sospecha persiste. Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. Evidencia contradictoria: en McCarthy y Busconi, S 89 %, E 92 % (LR− 0,12); en Narvani 2003 solo fue positivo en 1 de 4 roturas (S 25 %). Por eso puntúa el LR+ pero un Thomas negativo no descarta.', fuente: 'McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)' },
      { name: 'Longitud de paso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observar la longitud de paso.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' }
    ]
  },
  ca4: {
    id: 'ca4', region: 'cadera', num: '④',
    name: 'Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea)',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Ejercicios isométricos de abducción de cadera en decúbito lateral con cadera en 0° de flexión/extensión. 3 series × 6 contracciones de 6 seg al 20-30% CVM. Evitar cruzar la línea media las primeras 2-3 semanas. Educación: evitar sedestación con piernas cruzadas.',
    pronostico: {
      horizonte: 'RM: tendinopatía y roturas del glúteo menor al medio, líquido en las bolsas. Atrofia grasa (grados I–III): factor pronóstico importante.',
      derivacion: 'Diferencial: cadera en resorte externa, labrum (dolor lateral en el 59 %), meralgia y neuropatía iliohipogástrica.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación del trocánter mayor / tendón glúteo', sn: '80%', sp: '46.7%', lr_pos: '1.5', lr_neg: '0.43', criterio: 'Alta sensibilidad — útil para descartar si negativo. Decúbito lateral, caderas a ~60° de flexión: dolor a la palpación de las inserciones del glúteo medio o menor en el trocánter mayor. Positiva confirma poco (E 47 %).', fuente: 'Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM); LR− IC 95 %: 0,20–0,93' },
      { name: 'Apoyo Monopodal <30 segundos (Single-Leg Stance)', sn: '38%', sp: '100%', lr_pos: null, lr_neg: '0.62', criterio: 'Positivo: reproduce el dolor lateral de cadera antes de 30 s de apoyo sobre la pierna afectada. Todos los positivos tenían tendinopatía en la RM (LR+ 12,2), pero con IC 95 % de 0,8 a 191,5 (15 pacientes sin tendinopatía): aún no puntúa. Negativo no descarta (S 38 %).', fuente: 'Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM). Lequesne 2008: S 100 %, E 97,3 %, frente a caderas sin dolor' },
      { name: 'Test de Abducción Resistida de Cadera', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Secuencia diagnóstica: palpación + abducción resistida positivos → probabilidad post-test del 96%.' },
      { name: 'Marcha de Trendelenburg', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Signo visual de insuficiencia del glúteo medio. Caída pélvica contralateral al apoyo.' },
      { name: 'Derotación externa resistida', sn: '88%', sp: '97.3%', lr_pos: null, lr_neg: null, criterio: 'Supino, cadera a 90° en RE; el paciente vuelve a neutro contra resistencia. Positivo: reproduce su dolor. Si es negativo, repetir en prono con la cadera en extensión (así la S sube al 94 %).', fuente: 'Lequesne 2008 (Arthritis Rheum; estudio único, n = 17 con SDTM refractario de 13 meses de media; referencia: RM). La E se midió en 38 caderas sin dolor, lo que probablemente la sobrestima' }
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
  // ─── Tarjeta de consulta cadera (guía de consulta) ─────────
  // Síndromes de la tarjeta sin hipótesis previa (ca11–ca15) y entidades de
  // Doha de su tabla orientativa (ca16–ca19). Sin dosis en la guía («son
  // tuyas»): dosis '' → la fase 5 dice «a criterio del clínico». Tests sin
  // cifras con fuente = hallazgos clínicos. `pronostico`: literal de la tarjeta.
  ca11: {
    id: 'ca11', region: 'cadera', num: '⑪',
    name: 'Lesión Aguda de Ingle',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación del grupo sospechoso (primero)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpar PRIMERO: si no duele, se descarta (exactitud >90 % en aductores y flexores). Aductores (el largo en unos 2/3), recto femoral, ilíaco y psoas.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' },
      { name: 'Resistencia del grupo sospechoso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Después de palpar: squeeze a 0° o flexión resistida a 90°. Cuenta si reproduce su dolor en el mismo sitio.' },
      { name: 'Estiramiento del grupo sospechoso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cuenta si reproduce su dolor en el mismo sitio.' }
    ]
  },
  ca12: {
    id: 'ca12', region: 'cadera', num: '⑫',
    name: 'Ligamento Redondo e Inestabilidad',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Artro-RM. Los test de confirmación se basan en estudios únicos.',
      derivacion: 'La inestabilidad puede conducir a degeneración condral.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Log roll', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más RE en el lado afectado, o el borde lateral del pie toca la camilla → laxitud capsular anterior o retroversión.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' },
      { name: 'Movilidad aumentada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilidad AUMENTADA en inestabilidad. Sin síntoma específico: descartar lo intraarticular con flexión-RI y FADDIR.' },
      { name: 'Episodio de fallo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Al menos un episodio de fallo.' }
    ]
  },
  ca13: {
    id: 'ca13', region: 'cadera', num: '⑬',
    name: 'Condropatía de Cadera',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Difícil de ver: cartílago fino y profundo. La artro-TC lo muestra mejor. Delaminación asociada a FAIS.',
      derivacion: 'Posible estadio inicial de la artrosis precoz.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Cribado intraarticular y Thomas positivos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión-RI, FADDIR y Thomas.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' },
      { name: 'Dolor en reposo y nocturno con síntomas mecánicos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en reposo y nocturno acompañado de síntomas mecánicos.' },
      { name: 'Rigidez', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rigidez de cadera.' },
      { name: 'IMC >25', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Índice de masa corporal mayor de 25.' }
    ]
  },
  ca14: {
    id: 'ca14', region: 'cadera', num: '⑭',
    name: 'Neuropatías de Cadera e Ingle',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'EMG y conducción nerviosa: baja S y E en esta región. Alivio con bloqueo diagnóstico.',
      derivacion: 'Sospecha por patrón clínico, exploración neurológica y neurodinámicos. Considerar siempre atrapamientos lumbares.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tinel del femorocutáneo (meralgia)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Meralgia (la más frecuente): Tinel 1 cm medial e inferior a la EIAS; parestesias anterolaterales del muslo.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' },
      { name: 'Neurodinámico del femorocutáneo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce los síntomas anterolaterales del muslo.' },
      { name: 'Obturador: neurodinámico, sensibilidad del muslo medial y fuerza de aductores', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'A ser posible tras el deporte.' },
      { name: 'Arch and twist de pie', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ilioinguinal, iliohipogástrico y genitofemoral.' }
    ]
  },
  ca15: {
    id: 'ca15', region: 'cadera', num: '⑮',
    name: 'Sensibilización Central',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    tests: [
      { name: 'Dolor multifocal, referido y extenso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin criterios clínicos validados. Coexiste con la patología intraarticular y hace los síntomas vagos y cambiantes: NO excluye patología estructural.', fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)' },
      { name: 'Dolor en las AVD', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en las actividades de la vida diaria.' },
      { name: 'Fatiga y mal sueño', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fatiga y mal sueño.' },
      { name: 'Dificultades de memoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dificultades de memoria.' },
      { name: 'Más comorbilidad; intolerancia al estrés, ansiedad o depresión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más comorbilidad; intolerancia al estrés, ansiedad o depresión.' }
    ]
  },
  ca16: {
    id: 'ca16', region: 'cadera', num: '⑯',
    name: 'Dolor Inguinal Relacionado con el Aductor',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación dolorosa de aductores + squeeze doloroso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico (ambos).', fuente: 'Tarjeta de consulta cadera (entidades de Doha)' },
      { name: 'Estiramiento pasivo de aductores', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.' }
    ]
  },
  ca17: {
    id: 'ca17', region: 'cadera', num: '⑰',
    name: 'Dolor Inguinal Relacionado con el Psoas Ilíaco',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación dolorosa supra o infrainguinal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico.', fuente: 'Tarjeta de consulta cadera (entidades de Doha)' },
      { name: 'Flexión resistida con cadera y rodilla a 90°', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.' },
      { name: 'Flexión resistida o extensión pasiva en Thomas modificado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor. La extensión pasiva en Thomas modificado es a la vez el test de Thomas para patología intraarticular: interpretarlo junto con la palpación del psoas y la historia.' }
    ]
  },
  ca18: {
    id: 'ca18', region: 'cadera', num: '⑱',
    name: 'Dolor Inguinal Relacionado con el Canal Inguinal',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor en la región del canal + palpación dolorosa del canal, sin hernia palpable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico. Explorar de pie y con tos: una hernia palpable excluye este diagnóstico.', fuente: 'Tarjeta de consulta cadera (entidades de Doha)' },
      { name: 'Sit-up recto u oblicuo resistido', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.' },
      { name: 'Valsalva, tos o estornudo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.' },
      { name: 'Flexión resistida en Thomas modificado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.' }
    ]
  },
  ca19: {
    id: 'ca19', region: 'cadera', num: '⑲',
    name: 'Dolor Inguinal Relacionado con el Pubis',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación dolorosa de la sínfisis y el hueso adyacente', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico.', fuente: 'Tarjeta de consulta cadera (entidades de Doha)' },
      { name: 'Resistencia abdominal y squeeze', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor. No hay test de resistencia específico.' }
    ]
  },
};
