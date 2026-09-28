// ============================================================
// PhysiQ-Assessment · data/tobillo_pie.js
// Contenido clínico de la región TOBILLO Y PIE: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
//
// Región nueva (no existía en PhysiQ): todo sale de la tarjeta de consulta
// tobillo y pie (guía de consulta, data/tarjeta_tobillo_pie.js), con el texto
// clínico literal. Solo puntúan los tests con fuente verificada en el
// artículo original: Thompson y hueco palpable (tp3, Maffulli 1998 / Reiman
// 2014), Ottawa (tp5, Bachmann 2003, solo LR−) y el signo de Molloy (tp20,
// test añadido). El resto son hallazgos, con la cifra verificada y el motivo
// en su criterio. La tarjeta no da dosis («Dosis y progresión no están en la
// guía»): dosis '' en todas.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.tobillo_pie
// Árbol, nodo 1 (cinco P, monoartritis con fiebre, debilidad simétrica con
// arreflexia) → preguntas con `urgencia` (tp_t1, tp_i1, tp_n1).
export const screening = {
  label: 'Cuadrante Inferior — Tobillo y Pie',
  // Recuadro de urgencia: literal de la tarjeta de consulta tobillo y pie (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS · COMPARTIMENTAL Y NEUROVASCULAR · ARTRITIS INFECCIOSA · ROTURA DEL AQUILES · OTTAWA',
    lineas: [
      'SÍNDROME COMPARTIMENTAL Y COMPROMISO NEUROVASCULAR tras lesión grave del mediopié (Lisfranc): el flujo puede caer tras luxarse el 2.º MT → cirugía urgente. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.',
      'ARTRITIS INFECCIOSA: monoartritis aguda con MALESTAR SISTÉMICO Y FIEBRE ALTA → URGENCIA HOY. En la gota, en cambio, está sistémicamente bien.',
      'ROTURA AGUDA DEL AQUILES: golpe o patada detrás de la pierna en un gesto explosivo, a veces chasquido; camina sorprendentemente bien, con cojera. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente.',
      'REGLAS DE OTTAWA, antes de explorar cualquier traumatismo agudo. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Muy sensible, moderadamente específica (sin cifras en el capítulo). Excluidas embarazadas y personas que no pueden seguir la prueba (p. ej., traumatismo craneal). ≈10 % de las inversiones acaban en fractura.'
    ]
  },
  sistemas: [
    {
      // Tarjeta tobillo y pie (guía de consulta): URGENCIA (compartimental y neurovascular,
      // rotura del Aquiles, Ottawa) y BANDERAS «Lisfranc», «Fractura de calcáneo»,
      // «Fracturas del 5.º MT» y «Rotura del tibial posterior o del FHL».
      id: 'tp_trauma', icon: '🦴', nombre: 'Traumático / Mecánico',
      banderasRojas: [
        'SÍNDROME COMPARTIMENTAL Y COMPROMISO NEUROVASCULAR tras lesión grave del mediopié (Lisfranc): el flujo puede caer tras luxarse el 2.º MT → cirugía urgente. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.',
        'ROTURA AGUDA DEL AQUILES: golpe o patada detrás de la pierna en un gesto explosivo, a veces chasquido; camina sorprendentemente bien, con cojera. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente.',
        'Lisfranc: Caída hacia delante sobre el pie en punta (fallar un escalón), pie fijo con sacudida, aplastamiento. Dolor inmediato, no carga. Casi el 20 % pasa desapercibido. En consulta: Equimosis plantar: patognomónica (tarda 24–48 h). 1.º y 2.º MT en direcciones opuestas → dolor. Cinco P.',
        'Fractura de calcáneo: Caída desde altura sobre el talón; a menudo con alcohol, no recuerda el mecanismo. No quiere apoyar. En consulta: Talón doloroso, hinchado, con equimosis. La radiografía es poco sensible: TC.',
        'Fracturas del 5.º MT: Inversión con flexión plantar. Jones: dolor lateral previo de bajo grado. En consulta: Dolor en la base del 5.º MT. Jones: riesgo de pseudoartrosis sin fijación.',
        'Rotura del tibial posterior o del FHL: Tendinopatía que progresa o eversión forzada (TP). Impulso o aterrizaje forzado; artritis reumatoide (FHL). En consulta: TP: arco aplanado, «demasiados dedos», no inicia la ETM. FHL: no flexiona la interfalángica del primer dedo.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_t1', urgencia: 'Sospecha de síndrome compartimental o compromiso neurovascular tras lesión del mediopié: cirugía urgente, derivación hoy.', text: '¿Tras una lesión grave del mediopié, tiene el pie pálido o frío, dormido u hormigueante, sin pulso, o un dolor desproporcionado (cinco P)?', alerta: true, s1: true },
        { id: 'tp_t2', text: '¿Tras el traumatismo no pudo dar cuatro pasos apoyando el pie, ni justo tras la lesión ni ahora en consulta? (Aplicar las reglas de Ottawa en el árbol: radiografía si hay algún criterio.)', alerta: true },
        { id: 'tp_t3', text: '¿Notó un golpe o una patada detrás de la pierna en un gesto explosivo, a veces con chasquido, y desde entonces cojea? (Thompson en el árbol: derivación preferente.)', alerta: true },
        { id: 'tp_t4', text: '¿Se cayó hacia delante sobre el pie en punta (fallar un escalón) o desde altura sobre el talón, y no puede apoyar? (Lisfranc o calcáneo: derivación preferente.)', alerta: true },
        { id: 'tp_t5', text: '¿Se le ha aplanado el arco del pie, o no puede doblar la punta del dedo gordo, tras un impulso, un aterrizaje forzado o una tendinopatía que va a más (rotura del tibial posterior o del FHL)?', alerta: true }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Fractura de estrés de alto riesgo o múltiple».
      id: 'tp_oseo', icon: '🦴', nombre: 'Fractura de Estrés',
      banderasRojas: [
        'Fractura de estrés de alto riesgo o múltiple: Insidiosa tras un cambio de carga, sin efecto de calentamiento, dolor nocturno. Más de dos en huesos distintos → densidad ósea, RED-S, endocrino, nutricional. En consulta: Punto N doloroso > lado sano: navicular hasta que se demuestre lo contrario. Calcáneo: compresión medial y lateral a la vez.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_o1', text: '¿El dolor apareció poco a poco tras un cambio de carga (más entrenamiento, otro calzado, otra superficie), no mejora al calentar y le molesta por la noche?', alerta: true },
        { id: 'tp_o2', text: '¿Ha tenido más de dos fracturas de estrés en huesos distintos? (Derivar: densidad ósea, RED-S, endocrino, nutricional.)', alerta: true }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta): URGENCIA (artritis infecciosa) y
      // BANDERAS «Artritis inflamatoria».
      id: 'tp_infecciosa', icon: '🦠', nombre: 'Infecciosa / Inflamatoria',
      banderasRojas: [
        'ARTRITIS INFECCIOSA: monoartritis aguda con MALESTAR SISTÉMICO Y FIEBRE ALTA → URGENCIA HOY. En la gota, en cambio, está sistémicamente bien.',
        'Artritis inflamatoria: Rigidez matutina de más de 60 min que mejora con la actividad (reumatoide, espondiloartropatía, psoriásica, reactiva). En consulta: Tumefacción caliente, a menudo simétrica; dactilitis y uñas en la psoriásica.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_i1', urgencia: 'Sospecha de artritis infecciosa: urgencia hoy.', text: '¿Tiene una articulación del tobillo o del pie hinchada y muy dolorosa, con fiebre alta y malestar general?', alerta: true, s1: true },
        { id: 'tp_i2', text: '¿Tiene rigidez por la mañana de más de 60 minutos que mejora al moverse, o hinchazón caliente en varias articulaciones, algún dedo hinchado entero o cambios en las uñas?', alerta: true }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Osteoma osteoide y otros
      // tumores» y «Malignidad o infección».
      id: 'tp_oncologico', icon: '🔬', nombre: 'Oncológico / Sistémico',
      banderasRojas: [
        'Osteoma osteoide y otros tumores: Segunda década. Dolor sordo peor de noche, sin relación con la actividad; alivio en <20 min con AINE. Sin alivio → otras causas (osteosarcoma: masa blanda). En consulta: Dolor puntual y tumefacción. ≈25 % no se ve en radiografía.',
        'Malignidad o infección: Síntomas sistémicos, pérdida de peso, sudores nocturnos; dolor nocturno que despierta. En consulta: Cribado general de la ficha. No reproducir el dolor conocido también obliga a pensarlo.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_c1', text: '¿Tiene fiebre, sudores nocturnos o ha perdido peso sin explicación, o el dolor le despierta por la noche?', alerta: true },
        { id: 'tp_c2', text: '(Niño o joven) ¿Tiene un dolor sordo que empeora por la noche, sin relación con la actividad, y que se le alivia en menos de 20 minutos con un antiinflamatorio? (Osteoma osteoide: derivar.)', alerta: true }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Claudicación vascular o
      // neurógena» y «TVP tras inmovilización · Wells».
      id: 'tp_vascular', icon: '🩸', nombre: 'Vascular',
      banderasRojas: [
        'Claudicación vascular o neurógena: Dolor o calambre a una distancia o duración de esfuerzo reproducible. En consulta: Pulsos distales y exploración neurológica.',
        'TVP tras inmovilización · Wells: +1 cada uno: cáncer activo · parálisis, paresia o inmovilización con férula · encamamiento ≥3 días o cirugía mayor en 12 semanas · dolor en el trayecto venoso profundo · hinchazón de toda la pierna · pantorrilla >3 cm más gruesa (10 cm bajo la tuberosidad tibial) · edema con fóvea solo en esa pierna · venas colaterales no varicosas · TVP previa. −2: diagnóstico alternativo al menos tan probable. En consulta: El capítulo no la menciona. ≥2 → probable; ≤1 → improbable. Orienta la derivación, no la sustituye.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_v1', text: '¿Le aparece dolor o calambre siempre tras la misma distancia o el mismo tiempo de esfuerzo?', alerta: true },
        { id: 'tp_v2', text: '¿Tras una inmovilización, una férula, estar encamado o una cirugía reciente, tiene la pantorrilla o toda la pierna hinchada, caliente o dolorosa? (Posible TVP: calcular Wells; ≥2 → probable.)', alerta: true }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Neuropatía sistémica» y «SDRC»;
      // árbol, nodo 1 (debilidad simétrica progresiva con arreflexia → urgencia).
      id: 'tp_neuro', icon: '🧠', nombre: 'Neurológico',
      banderasRojas: [
        'Neuropatía sistémica: Dolor neuropático simétrico (diabetes), pie caído (mononeuritis múltiple), debilidad simétrica progresiva en 2–4 semanas con arreflexia (desmielinizante aguda → mismo día). En consulta: Reflejo aquíleo, vibración, pinchazo, temperatura.',
        'SDRC: Signos autonómicos tras una lesión: rubor, hinchazón más allá de la fase aguda, hiperestesia, hiperalgesia. En consulta: Temperatura, color, sudoración y sensibilidad frente al lado sano.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_n1', urgencia: 'Debilidad simétrica progresiva con arreflexia (sospecha de neuropatía desmielinizante aguda): derivación médica el mismo día.', text: '¿Tiene debilidad en las dos piernas que va a más desde hace 2–4 semanas? (Explorar reflejos: con arreflexia, derivación el mismo día.)', alerta: true, s1: true },
        { id: 'tp_n2', text: '¿Tiene ardor, hormigueo o pérdida de sensibilidad en los dos pies (p. ej., con diabetes), o se le cae el pie al caminar?', alerta: true },
        { id: 'tp_n3', text: 'Desde una lesión, ¿tiene el pie enrojecido, con cambios de temperatura o sudoración, hinchado más allá de la fase aguda, o le duele al mínimo roce?', alerta: true }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.tobillo_pie
// Tarjeta tobillo y pie (guía de consulta), ARBOL: nodo 1 (urgencia) va en la fase 2;
// 2 → tp_step1; 3 → tp_step2; 4 → tp_step3; 5 → tp_step4; 6 → tp_step5;
// 7 → tp_step6–tp_step9 y 8 → tp_step10–tp_step13 (una zona por paso, como rodilla).
export const tree = {
  title: 'Algoritmo CIF — Tobillo y Pie',
  steps: [
    {
      // Nodo 2. El «NO» salta a tp_step4 (las ramas traumáticas pasan por tp_step2 y tp_step3).
      id: 'tp_step1',
      tag: 'Paso 1 — ¿Traumatismo Agudo?',
      question: '¿Traumatismo agudo?',
      options: [
        { label: 'SÍ — Traumatismo agudo: Ottawa primero, después por mecanismo', value: 'si', next: null, hypothesis: [] },
        { label: 'NO — Sin traumatismo: por edad y localización', value: 'no', next: 'tp_step4', hypothesis: [] }
      ]
    },
    {
      // Nodo 3. Derivación antes de seguir explorando.
      id: 'tp_step2',
      tag: 'Paso 2 — Ottawa, Thompson, Lisfranc y Calcáneo',
      question: '¿Algún criterio de Ottawa de tobillo o de pie, Thompson positivo, o mecanismo de Lisfranc o de caída sobre el talón? → DERIVAR para radiografía (Ottawa) o derivación preferente (Aquiles, Lisfranc, calcáneo) antes de seguir explorando.',
      options: [
        { label: 'OTTAWA POSITIVO — Derivar para radiografía antes de seguir explorando', value: 'ottawa', next: null, hypothesis: ['tp5'] },
        { label: 'THOMPSON POSITIVO — Rotura del Aquiles: derivación preferente', value: 'thompson', next: null, hypothesis: ['tp3'] },
        { label: 'MECANISMO DE LISFRANC — Caída sobre el pie en punta: derivación preferente', value: 'lisfranc', next: null, hypothesis: ['tp4'] },
        { label: 'CAÍDA SOBRE EL TALÓN — Fractura de calcáneo: derivación preferente', value: 'calcaneo', next: null, hypothesis: ['tp5'] },
        { label: 'NINGUNO — Ottawa negativo, Thompson negativo, sin mecanismo de Lisfranc ni de calcáneo', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 4.
      id: 'tp_step3',
      tag: 'Paso 3 — Mecanismo del Tobillo Agudo',
      question: 'Tobillo agudo traumático, ¿qué mecanismo cuenta?',
      options: [
        { label: 'ESGUINCE LATERAL — Inversión del retropié o flexión plantar con aducción (LPAA y LPC; dolor en la base del 5.º MT → Ottawa)', value: 'esguince', next: null, hypothesis: ['tp1'] },
        { label: 'SINDESMOSIS — Rotación externa del pie con flexión dorsal forzada, contacto', value: 'sindesmosis', next: null, hypothesis: ['tp2'] },
        { label: 'CALCANEOCUBOIDEA — Inversión en plantígrado en terreno irregular', value: 'calcaneocuboidea', next: null, hypothesis: ['tp29'] },
        { label: 'LUXACIÓN DEL TIBIAL POSTERIOR — Flexión dorsal e inversión con contracción forzada, chasquido medial', value: 'luxacion_tp', next: null, hypothesis: ['tp6'] },
        { label: 'NINGUNO — Ningún mecanismo de estos', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 5. Sever, Iselin, Köhler, Freiberg y apofisitis del tibial posterior no tienen
      // ficha propia en la tarjeta: una sola hipótesis (tp36). El osteoma osteoide es bandera
      // roja (fase 2, tp_oncologico): derivar, sin hipótesis.
      id: 'tp_step4',
      tag: 'Paso 4 — Niño o Adolescente',
      question: '¿Niño o adolescente con dolor bien localizado o sin mecanismo claro?',
      options: [
        { label: 'SEVER — Inserción del Aquiles (8–12 años)', value: 'sever', next: null, hypothesis: ['tp36'] },
        { label: 'ISELIN — Base del 5.º MT (8–13 años)', value: 'iselin', next: null, hypothesis: ['tp36'] },
        { label: 'APOFISITIS DEL TIBIAL POSTERIOR o KÖHLER — Navicular (menores de 10, cojera)', value: 'navicular', next: null, hypothesis: ['tp36'] },
        { label: 'FREIBERG — Cabeza del 2.º–4.º MT (14–18 años)', value: 'freiberg', next: null, hypothesis: ['tp36'] },
        { label: 'OSTEOCONDRITIS DISECANTE — Esguince que no se resuelve, bloqueo', value: 'ocd', next: null, hypothesis: ['tp25'] },
        { label: 'OSTEOMA OSTEOIDE — Dolor nocturno con alivio rápido por AINE: derivar', value: 'osteoma', next: null, hypothesis: [] },
        { label: 'NO — Adulto, o hay mecanismo claro', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 6. Sin hipótesis: el referido lumbar se valora en su propia región (como en rodilla).
      id: 'tp_step5',
      tag: 'Paso 5 — ¿La Exploración Local Reproduce el Dolor?',
      question: '¿La exploración local no reproduce el dolor conocido? → COLUMNA LUMBAR u origen proximal: slump con flexión plantar e inversión. Si persiste la duda, replantear (malignidad).',
      options: [
        { label: 'COLUMNA LUMBAR u origen proximal — El slump con flexión plantar e inversión reproduce: valorar en la región Lumbar', value: 'lumbar', next: null, hypothesis: [] },
        { label: 'NO REPRODUCE NADA — Persiste la duda: replantear (malignidad)', value: 'replantear', next: null, hypothesis: [] },
        { label: 'NO — La exploración local sí reproduce el dolor conocido', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, POSTERIOR.
      id: 'tp_step6',
      tag: 'Paso 6 — Tobillo sin Traumatismo: Posterior',
      question: 'Dolor sin traumatismo en el tobillo, POSTERIOR: ¿qué lo explica?',
      options: [
        { label: 'PINZAMIENTO POSTERIOR — Flexión plantar máxima', value: 'pinz_post', next: null, hypothesis: ['tp7'] },
        { label: 'AQUILES PORCIÓN MEDIA — Pinza, 2–6 cm', value: 'aquiles_media', next: null, hypothesis: ['tp8'] },
        { label: 'AQUILES INSERCIONAL — Un dedo, flexión dorsal', value: 'aquiles_ins', next: null, hypothesis: ['tp9'] },
        { label: 'VAINA DEL AQUILES — Crepitación, rango amplio', value: 'vaina', next: null, hypothesis: ['tp10'] },
        { label: 'PLANTAR DELGADO — Medial y proximal', value: 'plantar', next: null, hypothesis: ['tp11'] },
        { label: 'NERVIO SURAL — Lateral, neuropático', value: 'sural', next: null, hypothesis: ['tp12'] },
        { label: 'BURSA SUPERFICIAL — Roce del zapato', value: 'bursa', next: null, hypothesis: ['tp13'] },
        { label: 'NINGUNO — Sin dolor posterior o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, MEDIAL.
      id: 'tp_step7',
      tag: 'Paso 7 — Tobillo sin Traumatismo: Medial',
      question: 'Dolor sin traumatismo en el tobillo, MEDIAL: ¿qué lo explica?',
      options: [
        { label: 'TIBIAL POSTERIOR — Retromaleolar, ETM sin varo del retropié', value: 'tp', next: null, hypothesis: ['tp14'] },
        { label: 'FHL — Transición de flexión dorsal a plantar', value: 'fhl', next: null, hypothesis: ['tp15'] },
        { label: 'TÚNEL DEL TARSO — Tinel', value: 'tunel', next: null, hypothesis: ['tp16'] },
        { label: 'FRACTURA DE ESTRÉS — Maléolo medial', value: 'estres', next: null, hypothesis: ['tp17'] },
        { label: 'NINGUNO — Sin dolor medial o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, LATERAL. «Referido» sin hipótesis: remite a la región Lumbar (nodo 6).
      id: 'tp_step8',
      tag: 'Paso 8 — Tobillo sin Traumatismo: Lateral',
      question: 'Dolor sin traumatismo en el tobillo, LATERAL: ¿qué lo explica?',
      options: [
        { label: 'SENO DEL TARSO', value: 'seno', next: null, hypothesis: ['tp18'] },
        { label: 'PERONEOS', value: 'peroneos', next: null, hypothesis: ['tp19'] },
        { label: 'ESTRÉS DEL ASTRÁGALO', value: 'estres', next: null, hypothesis: ['tp17'] },
        { label: 'REFERIDO — Valorar en la región Lumbar', value: 'referido', next: null, hypothesis: [] },
        { label: 'NINGUNO — Sin dolor lateral o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, ANTERIOR.
      id: 'tp_step9',
      tag: 'Paso 9 — Tobillo sin Traumatismo: Anterior',
      question: 'Dolor sin traumatismo en el tobillo, ANTERIOR: ¿qué lo explica?',
      options: [
        { label: 'PINZAMIENTO ANTERIOR — KTW', value: 'pinz_ant', next: null, hypothesis: ['tp20'] },
        { label: 'NINGUNO — Sin dolor anterior o no lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, TALÓN PLANTAR.
      id: 'tp_step10',
      tag: 'Paso 10 — Pie: Talón Plantar',
      question: 'Dolor en el pie, TALÓN PLANTAR: ¿qué lo explica?',
      options: [
        { label: 'DOLOR PLANTAR CRÓNICO — Tuberosidad medial', value: 'plantar', next: null, hypothesis: ['tp26'] },
        { label: 'ALMOHADILLA GRASA — Posterolateral', value: 'almohadilla', next: null, hypothesis: ['tp27'] },
        { label: 'ATRAPAMIENTO NERVIOSO — Tinel', value: 'atrapamiento', next: null, hypothesis: ['tp28'] },
        { label: 'ESTRÉS DEL CALCÁNEO', value: 'estres', next: null, hypothesis: ['tp17'] },
        { label: 'NINGUNO — Sin dolor en el talón plantar o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, MEDIOPIÉ.
      id: 'tp_step11',
      tag: 'Paso 11 — Pie: Mediopié',
      question: 'Dolor en el pie, MEDIOPIÉ: ¿qué lo explica?',
      options: [
        { label: 'CALCANEOCUBOIDEA', value: 'calcaneocuboidea', next: null, hypothesis: ['tp29'] },
        { label: 'NAVICULAR (punto N), CUBOIDES O CUÑAS — Fractura de estrés', value: 'estres', next: null, hypothesis: ['tp30'] },
        { label: 'LISFRANC', value: 'lisfranc', next: null, hypothesis: ['tp4'] },
        { label: 'COALICIÓN', value: 'coalicion', next: null, hypothesis: ['tp23'] },
        { label: 'NINGUNO — Sin dolor en el mediopié o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, ANTEPIÉ.
      id: 'tp_step12',
      tag: 'Paso 12 — Pie: Antepié',
      question: 'Dolor en el pie, ANTEPIÉ: ¿qué lo explica?',
      options: [
        { label: '1.ª MTF', value: 'mtf', next: null, hypothesis: ['tp31'] },
        { label: 'BASE DEL 2.º MT', value: 'base2', next: null, hypothesis: ['tp32'] },
        { label: 'CUELLO DE MT — Fractura de marcha', value: 'cuello', next: null, hypothesis: ['tp33'] },
        { label: '5.º MT — Fractura', value: 'mt5', next: null, hypothesis: ['tp5'] },
        { label: 'MORTON — O bursitis intermetatarsiana', value: 'morton', next: null, hypothesis: ['tp34'] },
        { label: 'GOTA — Derivar para confirmar (con fiebre y malestar → artritis infecciosa: urgencia)', value: 'gota', next: null, hypothesis: ['tp35'] },
        { label: 'NINGUNO — Sin dolor en el antepié o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, «No →» (dolor vago del tobillo o que no se resuelve tras un esguince).
      id: 'tp_step13',
      tag: 'Paso 13 — Dolor Vago del Tobillo',
      question: 'DOLOR VAGO DEL TOBILLO o que no se resuelve tras un esguince: ¿qué lo explica?',
      options: [
        { label: 'INESTABILIDAD CRÓNICA', value: 'inestabilidad', next: null, hypothesis: ['tp21'] },
        { label: 'SINDESMOSIS', value: 'sindesmosis', next: null, hypothesis: ['tp2'] },
        { label: 'SINOVITIS POSTRAUMÁTICA', value: 'sinovitis', next: null, hypothesis: ['tp22'] },
        { label: 'COALICIÓN TARSIANA', value: 'coalicion', next: null, hypothesis: ['tp23'] },
        { label: 'ARTROSIS', value: 'artrosis', next: null, hypothesis: ['tp24'] },
        { label: 'OSTEOCONDRITIS DISECANTE', value: 'ocd', next: null, hypothesis: ['tp25'] },
        { label: 'NINGUNO — Sin dolor vago o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
// tp1–tp20: filas de SINDROMES (Referido lumbar sin hipótesis: remite a la región Lumbar).
// tp21–tp35: filas de ORIENTATIVA. tp36: patrones pediátricos del nodo 5 (fila «Pediátricos»
// del pronóstico). Test final de cada una: ① gesto testigo y ② medida objetiva de la tarjeta.
export const hypotheses = {
  // ─── TOBILLO Y PIE ─────────────────────────────────────────
  tp1: {
    id: 'tp1', region: 'tobillo_pie', num: '①',
    name: 'Esguince Lateral Agudo (LPAA y LPC)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Ottawa decide la radiografía. Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo.',
      derivacion: 'Una proporción alta evoluciona a inestabilidad crónica. Si no se recupera: coalición, osteocondritis disecante, sinovitis, pinzamiento posterior secundario, peroneos.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Reglas de Ottawa (si no carga)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si no carga: Ottawa antes de nada.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'LPAA: palpar y estirar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Priorizar LPAA (palpar y estirar: flexión plantar con inversión y rotación interna). Reproducir el dolor conocido indica lesión de ese ligamento.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'LPC: palpar y estirar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'LPC (palpar y estirar: inversión del retropié con el tobillo en flexión dorsal). Reproducir el dolor conocido indica lesión de ese ligamento.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Cajón anterior (a los 4–6 días)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo. No puntúa: van Dijk 1996 (160 inversiones; referencia: cirugía o artrografía) da para la exploración diferida completa (día 5: hinchazón, hematoma, palpación y cajón) S 96 %, E 84 %, pero para el cajón solo el texto (S 86 %, E 74 %) no cuadra con su propia tabla, y lo que valida es rotura frente a ligamentos intactos, no esguince frente a otros diagnósticos.', fuente: 'Tarjeta de consulta tobillo y pie (ap. 5); van Dijk 1996 (J Bone Joint Surg Br 78-B(6))' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Estiramiento pasivo del LPAA o apoyo monopodal → EVA. ② Tiempo de apoyo monopodal descalzo sin dolor; cuando tolere carga, KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp2: {
    id: 'tp2', region: 'tobillo_pie', num: '②',
    name: 'Lesión de la Sindesmosis',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Si LTPAI y squeeze son positivos, hace falta imagen: la RM tiene una precisión de hasta el 95 %.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación del LTPAI', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).', fuente: 'Tarjeta de consulta tobillo y pie (ap. 5); Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)' },
      { name: 'Squeeze test', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: Sman 2015 (RM de referencia) da S 26 %, E 88 %, LR+ 2,15 (IC 0,86–5,39); agrupado en Netterström-Wedin 2021 (4 estudios, 428 participantes), S 32 %, E 85 %, LR+ 3,16 (IC 0,95–10,49), LR− 0,77. Los dos intervalos de la LR+ cruzan el 1.', fuente: 'Tarjeta de consulta tobillo y pie (ap. 5); Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Squeeze test o flexión dorsal en carga → EVA. ② KTW en cm frente al lado sano, cuando tolere la carga.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp3: {
    id: 'tp3', region: 'tobillo_pie', num: '③',
    name: 'Rotura del Aquiles',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.',
      derivacion: 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Thompson (Simmonds)', sn: '96%', sp: '93%', lr_pos: '13.71', lr_neg: '0.04', criterio: 'Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente. Maffulli 1998: 133 roturas confirmadas en cirugía y 28 controles con lesión posterior sin rotura (26 negativos; 2 dudosos contados como falsos positivos). LR de Reiman 2014 con esos datos: LR+ 13,71 (IC 95 % 3,54–51,24), LR− 0,04 (0,02–0,10). Límite: la especificidad sale de solo 28 controles.', fuente: 'Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)' },
      { name: 'Hueco palpable', sn: '73%', sp: '89%', lr_pos: '6.64', lr_neg: '0.30', criterio: 'Hueco palpable, que se pierde con el tiempo. Maffulli 1998 (paciente despierto): S 73 %, E 89 %; LR de Reiman 2014: LR+ 6,64 (IC 95 % 2,32–19,91), LR− 0,30 (0,23–0,40). Es otro test que Thompson, pero en el mismo paciente: si los dos son positivos, el peso conjunto puede estar algo sobrestimado.', fuente: 'Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede: derivar. Tras el alta, el gesto que reproduce → EVA y ETM a tempo fijo frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp4: {
    id: 'tp4', region: 'tobillo_pie', num: '④',
    name: 'Lesión de Lisfranc',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.',
      derivacion: 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Neurovascular y cinco P', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Neurovascular y cinco P. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Equimosis plantar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Equimosis plantar patognomónica (falta en esguinces aislados, tarda 24–48 h).', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Dolor en todo el ancho del mediopié', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en todo el ancho del mediopié.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: '1.º y 2.º MT en direcciones opuestas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '1.º y 2.º MT en direcciones opuestas → dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede en fase aguda: derivar. Tras el alta, despegue o ETM → EVA; ETM a tempo fijo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp5: {
    id: 'tp5', region: 'tobillo_pie', num: '⑤',
    name: 'Fracturas del Pie (5.º MT, Calcáneo)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.',
      derivacion: 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Reglas de Ottawa de tobillo y de pie', sn: null, sp: null, lr_pos: null, lr_neg: '0.21', criterio: 'TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).', fuente: 'Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)' },
      { name: '5.º MT: dolor en la base', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '5.º MT: dolor en la base en todos los tipos; en la espiral, a lo largo del hueso.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Calcáneo: talón doloroso con equimosis', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Calcáneo: talón doloroso, hinchado, con equimosis.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede en fase aguda: derivar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp6: {
    id: 'tp6', region: 'tobillo_pie', num: '⑥',
    name: 'Luxación del Tibial Posterior',
    prom: 'FAAM o LEFS',
    dosis: '',
    tests: [
      { name: 'Hinchazón y equimosis perimaleolar medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y equimosis perimaleolar medial.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Resalte con la flexión dorsal y plantar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Se subluxa hacia delante con la flexión dorsal y se recoloca con la plantar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión dorsal y plantar activa que provoca el resalte → EVA. ② Sin medida propia: derivar para confirmar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp7: {
    id: 'tp7', region: 'tobillo_pie', num: '⑦',
    name: 'Pinzamiento Posterior del Tobillo',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía en flexión plantar en carga y RM; ningún hallazgo se correlaciona con los síntomas. La infiltración con anestésico confirma.',
      derivacion: 'Responde bien a conservador, técnica y retorno graduado. Si no responde a la infiltración o la recuperación se complica → replantear el diagnóstico.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de pinzamiento posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido con la flexión plantar pasiva o el test de pinzamiento posterior (flexión plantar comprimiendo el calcáneo contra la tibia): confirma.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Hinchazón y dolor por detrás del astrágalo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón a ambos lados del Aquiles; dolor por detrás del astrágalo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Test de pinzamiento posterior o media punta en carga → EVA. ② ETM a tempo fijo hasta dolor o pérdida de técnica, frente al lado sano; o KTW en cm.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp8: {
    id: 'tp8', region: 'tobillo_pie', num: '⑧',
    name: 'Tendinopatía del Aquiles, Porción Media',
    prom: 'VISA-A',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Batería progresiva de carga', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Aquiles: la palpación no ayuda al diagnóstico. No puntúa: la única cifra de estos gestos es de Hutchison 2013 (estudio piloto, 10 tendinopatías; en Reiman 2014): ETM monopodal S 22 %, E 93 %, LR+ 3,14; salto S 43 %, E 87 %, LR+ 3,31, sin intervalo de confianza publicado.', fuente: 'Tarjeta de consulta tobillo y pie (ap. 5); Reiman 2014 (J Athl Train 49:820–9)' },
      { name: 'Descarga en el salto', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Vigilar la descarga: aterrizar con el talón; saltar con el talón elevado aumenta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Primer escalón de la batería que reproduce → EVA. ② Repeticiones de ETM monopodal a tempo fijo en el suelo, hasta dolor o fatiga, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp9: {
    id: 'tp9', region: 'tobillo_pie', num: '⑨',
    name: 'Tendinopatía Insercional del Aquiles',
    prom: 'VISA-A',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor con carga y flexión dorsal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor con carga y flexión dorsal, menos en flexión plantar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Salto con el talón elevado frente a aterrizaje', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Menos dolor al saltar con el talón elevado, más al aterrizar con el talón abajo y la rodilla flexionada.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'ETM monopodal sobre plano inclinado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'ETM monopodal sobre plano inclinado como provocación.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① ETM monopodal desde flexión dorsal en el borde de un step → EVA. ② Repeticiones de ETM monopodal a tempo fijo en suelo plano, hasta dolor o fatiga.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp10: {
    id: 'tp10', region: 'tobillo_pie', num: '⑩',
    name: 'Afectación de la Vaina del Aquiles',
    prom: 'VISA-A',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Crepitación en flexión plantar y dorsal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Crepitación en la flexión plantar y dorsal; dolor más difuso.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'ETM en rango amplio', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Duelen las ETM (rango amplio); el salto puede doler menos.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión plantar y dorsal activas repetidas en prono sobre la camilla → EVA. ② Repeticiones de ETM monopodal en todo el rango, a tempo fijo, hasta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp11: {
    id: 'tp11', region: 'tobillo_pie', num: '⑪',
    name: 'Tendinopatía del Plantar Delgado',
    prom: 'VISA-A',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'ETM sobre un step en todo el rango', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor con la ETM desde flexión dorsal completa hasta flexión plantar completa sobre un step.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Marcha descalzo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor medial del Aquiles caminando descalzo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① ETM monopodal sobre un step desde flexión dorsal completa → EVA. ② Repeticiones de ETM monopodal a tempo fijo en suelo plano, hasta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp12: {
    id: 'tp12', region: 'tobillo_pie', num: '⑫',
    name: 'Neuropatía del Nervio Sural',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.',
      derivacion: 'Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tinel a lo largo del sural', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel a lo largo del sural.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Palpación en prono con flexión dorsal pasiva', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpación en prono con flexión dorsal pasiva: una diferencia entre lados, con el perfil clínico, hace sospechar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Prueba neurodinámica con sesgo del sural → EVA. ② Grados de flexión dorsal (o de la articulación de la prueba) hasta los síntomas, misma posición.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp13: {
    id: 'tp13', region: 'tobillo_pie', num: '⑬',
    name: 'Bursitis Calcánea Superficial',
    prom: 'FAAM o LEFS',
    dosis: '',
    tests: [
      { name: 'Dolor superficial e hinchazón a la presión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor superficial e hinchazón en el talón posterior que aumentan con la presión.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Presión sobre la bursa o contrafuerte del zapato → EVA. ② Sin medida de capacidad: no depende de la carga. Basta ①.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp14: {
    id: 'tp14', region: 'tobillo_pie', num: '⑭',
    name: 'Tendinopatía del Tibial Posterior',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía (tendón frente a peritendón); RM para complicaciones. La imagen no se correlaciona necesariamente con los síntomas.',
      derivacion: 'Puede progresar a rotura y pie plano adquirido: no hace ETM + «demasiados dedos» → derivar.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor retromaleolar medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor por detrás y por debajo del maléolo medial.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Inversión resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido y debilidad relativa en la inversión resistida.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'ETM: el retropié va a varo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'ETM: el retropié no va a varo; en fases avanzadas no inicia.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: '«Demasiados dedos»', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '«Demasiados dedos».', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① ETM monopodal (inicio del despegue) o inversión resistida → EVA. ② Repeticiones de ETM monopodal a tempo fijo con el retropié a varo, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp15: {
    id: 'tp15', region: 'tobillo_pie', num: '⑮',
    name: 'Tendinopatía del Flexor Largo del Primer Dedo (FHL)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía dinámica de elección; sus hallazgos son frecuentes sin síntomas.',
      derivacion: 'Crónico: tenosinovitis estenosante. No flexiona la interfalángica → rotura: derivar.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Flexoextensión del primer dedo en flexión plantar completa', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión dorsal y plantar activas del primer dedo con el tobillo en flexión plantar completa: reproduce.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Crepitación e hinchazón en la vaina', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Crepitación e hinchazón en la vaina, posteromedial.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexoextensión activa del primer dedo con el tobillo en flexión plantar completa → EVA. ② Repeticiones de ETM monopodal a tempo fijo hasta el dolor, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp16: {
    id: 'tp16', region: 'tobillo_pie', num: '⑯',
    name: 'Síndrome del Túnel del Tarso',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.',
      derivacion: 'Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tinel a lo largo del túnel', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel a lo largo del túnel.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Hinchazón en el túnel o la subastragalina posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón en el túnel o en la subastragalina posterior, proximal al sustentaculum tali.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Explorar el FHL', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Explorar el FHL, que puede ser la fuente.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Tinel o la posición que reproduce → EVA. ② Grados de flexión dorsal con eversión hasta los síntomas, misma posición.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp17: {
    id: 'tp17', region: 'tobillo_pie', num: '⑰',
    name: 'Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.',
      derivacion: '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor óseo a la palpación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor óseo a la palpación; puede haber derrame.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Calcáneo: compresión medial y lateral a la vez', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Calcáneo: compresión medial y lateral a la vez.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Astrágalo: hinchazón en el seno del tarso o posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Astrágalo: hinchazón en el seno del tarso o posterior.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Carga monopodal o marcha → EVA. Sin saltos ni series. ② Minutos de marcha en cinta sin dolor, a velocidad e inclinación fijas.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp18: {
    id: 'tp18', region: 'tobillo_pie', num: '⑱',
    name: 'Síndrome del Seno del Tarso',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.',
      derivacion: 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación del seno del tarso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido a la palpación del seno del tarso', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Estrés en inversión de la subastragalina o KTW con pronación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'a menudo también con el estrés en inversión de la subastragalina o el KTW con pronación excesiva.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Palpación del seno del tarso o KTW con pronación → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp19: {
    id: 'tp19', region: 'tobillo_pie', num: '⑲',
    name: 'Tendinopatía de los Peroneos',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico sobre todo clínico; RM o ecografía si hace falta.',
      derivacion: 'Tras esguince grave o fractura, una rotura aguda puede pasar desapercibida porque la función se conserva: con sospecha alta, imagen.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor retromaleolar lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor localizado sobre los tendones por detrás del maléolo lateral.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Subluxación de los peroneos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Posible subluxación por encima y por delante del maléolo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Crepitación e hinchazón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Crepitación e hinchazón si hay peritendón.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Eversión resistida o el gesto en carga que reproduce → EVA. ② Repeticiones de ETM monopodal a tempo fijo, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp20: {
    id: 'tp20', region: 'tobillo_pie', num: '⑳',
    name: 'Pinzamiento Anterior del Tobillo',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.',
      derivacion: 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'KTW', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El KTW reproduce el dolor y muestra limitación.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Palpación anterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y palpación dolorosa y engrosada: interlínea anterior, astragaloescafoidea, seno del tarso, LTPAI, LPAA.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Zancada o KTW en carga → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      // Test añadido (no está en la tarjeta), al final de tests[] para no desplazar resultados guardados.
      { name: 'Signo de pinzamiento de Molloy', sn: '94.8%', sp: '88%', lr_pos: null, lr_neg: null, criterio: 'Pulgar sobre la gotera anterolateral con el pie en flexión plantar y, sin soltar, llevar a flexión dorsal completa. Positivo si la maniobra combinada provoca dolor o aumenta el que daba la presión sola. Molloy 2003, 73 pacientes con artroscopia: 37 verdaderos positivos, 4 falsos positivos (adherencias, artrosis), 2 falsos negativos, 30 verdaderos negativos → S 94,8 %, E 88 % (LR calculadas). Límites: todos ya iban a artroscopia (sin inestabilidad mecánica), el mismo cirujano exploraba y decidía operar, y valida el pinzamiento sinovial anterolateral, no el óseo.', fuente: 'Molloy 2003 (J Bone Joint Surg Br 85-B(3))' }
    ]
  },
  tp21: {
    id: 'tp21', region: 'tobillo_pie', num: '㉑',
    name: 'Inestabilidad Crónica del Tobillo',
    prom: 'CAIT o IdFAI',
    dosis: '',
    pronostico: {
      horizonte: 'CAIT menos de 24, o IdFAI más de 11: indican inestabilidad crónica (cuestionarios aparte de los tres números).',
      derivacion: 'Valorar deficiencias mecánicas y sensoriomotoras: guían el tratamiento.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Hinchazón articular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón articular.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Cajón anterior: signo del surco', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Laxitud tibioastragalina (signo del surco en el cajón anterior → rotura completa del LPAA probable)', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Laxitud subastragalina', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'subastragalina (inversión excesiva del retropié frente al lado sano).', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto que provoca aprensión o fallo → EVA; si no hay dolor, fallos por semana. ② Tiempo de apoyo monopodal descalzo, ojos abiertos, sin manos, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp22: {
    id: 'tp22', region: 'tobillo_pie', num: '㉒',
    name: 'Sinovitis Postraumática',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.',
      derivacion: 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Hinchazón y dolor a la palpación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y dolor a la palpación.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Laxitud del LPAA y del LPC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede haber laxitud del LPAA y del LPC.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto en carga que reproduce (zancada, apoyo monopodal) → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp23: {
    id: 'tp23', region: 'tobillo_pie', num: '㉓',
    name: 'Coalición Tarsiana',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Coalición: radiografía oblicua a 45°; la TC es poco sensible a las no óseas. Osteocondritis: hasta un tercio de las radiografías son normales al principio → RM.',
      derivacion: 'La coalición suele ser asintomática hasta una lesión (12,7 % en disección, relevancia incierta).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Movilidad subastragalina y mediotarsiana', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Restricción de la movilidad subastragalina, a menudo también mediotarsiana.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Inversión y eversión del retropié, o el gesto en carga que reproduce → EVA. ② Grados de inversión y eversión del retropié frente al lado sano, misma posición.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp24: {
    id: 'tp24', region: 'tobillo_pie', num: '㉔',
    name: 'Artrosis de Tobillo o Pie',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: más de 45 años, dolor con el uso, rigidez de menos de 30 min. La radiografía no se correlaciona de forma fiable.',
      derivacion: 'En jóvenes o con rasgos inflamatorios, progresión rápida o síntomas constitucionales → más pruebas; VSG y PCR deben ser normales.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Perfil clínico', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diagnóstico clínico: más de 45 años, dolor con el uso, rigidez de menos de 30 min.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Palpación de la interlínea', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la interlínea; según la evolución, rango limitado, derrame, deformidad, debilidad; tumefacción ósea periarticular.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Bajar un escalón o zancada → EVA. ② KTW en cm, o grados de flexión dorsal de la 1.ª MTF si es la afectada.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp25: {
    id: 'tp25', region: 'tobillo_pie', num: '㉕',
    name: 'Osteocondritis Disecante del Astrágalo',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Coalición: radiografía oblicua a 45°; la TC es poco sensible a las no óseas. Osteocondritis: hasta un tercio de las radiografías son normales al principio → RM.',
      derivacion: 'La coalición suele ser asintomática hasta una lesión (12,7 % en disección, relevancia incierta).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación de la cúpula astragalina en flexión plantar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la cara anterior de la cúpula astragalina con el pie en flexión plantar completa.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Hinchazón, derrame, crepitación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón, derrame, crepitación.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto de impacto o carga que reproduce → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp26: {
    id: 'tp26', region: 'tobillo_pie', num: '㉖',
    name: 'Dolor Plantar Crónico del Talón',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Imagen innecesaria si la clínica encaja; ecografía para la fasciopatía. El espolón no se relaciona con el dolor.',
      derivacion: 'Atrapamiento nervioso coexistente en el 20–52 %: valorar el componente neural si no mejora.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación de la tuberosidad medial del calcáneo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido a la palpación de la inserción de la fascia en la tuberosidad medial del calcáneo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Primeros pasos tras estar sentado, o palpación de la tuberosidad → EVA. ② Minutos de marcha en cinta sin aumento del dolor, velocidad fija; o ETM a tempo fijo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp27: {
    id: 'tp27', region: 'tobillo_pie', num: '㉗',
    name: 'Síndrome de la Almohadilla Grasa del Talón',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Imagen innecesaria si la clínica encaja; ecografía para la fasciopatía. El espolón no se relaciona con el dolor.',
      derivacion: 'Atrapamiento nervioso coexistente en el 20–52 %: valorar el componente neural si no mejora.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación posterolateral del talón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la región posterolateral del talón.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Apoyo del talón en la marcha o palpación posterolateral → EVA. ② Minutos de marcha en cinta sin dolor, velocidad fija.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp28: {
    id: 'tp28', region: 'tobillo_pie', num: '㉘',
    name: 'Atrapamiento Nervioso del Talón',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.',
      derivacion: 'Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tinel en el calcáneo medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel justo proximal al origen de la fascia en la tuberosidad medial, o a lo largo del calcáneo medial.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Tinel o la carga que reproduce → EVA. ② Minutos de marcha en cinta hasta los síntomas, velocidad fija.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp29: {
    id: 'tp29', region: 'tobillo_pie', num: '㉙',
    name: 'Lesión Calcaneocuboidea y Cubometatarsiana',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.',
      derivacion: '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Aguda: palpación calcaneocuboidea', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aguda: dolor en calcaneocuboidea dorsal, ligamento bifurcado, apófisis anterior del calcáneo o ligamentos cubometatarsianos.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gradual: interlíneas del cuboides', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Gradual: dolor en las interlíneas del cuboides hacia las bases del 4.º–5.º MT.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Carga del antepié e inicio de la ETM', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Caminar, cargar el antepié y el inicio de la ETM dan dolor agudo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Inicio de la ETM, o presión plantar sobre el cuboides → EVA. ② Repeticiones de ETM monopodal a tempo fijo hasta el dolor, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp30: {
    id: 'tp30', region: 'tobillo_pie', num: '㉚',
    name: 'Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.',
      derivacion: '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Punto N', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Punto N doloroso frente al lado sano: navicular hasta que se demuestre lo contrario.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Dolor puntual sobre cuboides o cuñas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor puntual sobre cuboides o cuñas.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Marcha o carga monopodal → EVA. Sin saltos. ② Minutos de marcha en cinta sin dolor, velocidad e inclinación fijas.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp31: {
    id: 'tp31', region: 'tobillo_pie', num: '㉛',
    name: 'Lesión de la 1.ª Metatarsofalángica',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.',
      derivacion: '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Equimosis e hinchazón en la interlínea', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dirigida por la historia. Equimosis tras esguince o fractura; hinchazón en la interlínea.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Rango de la 1.ª MTF frente al lado sano', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rango frente al lado sano (flexión dorsal normal ≈60°; danza y gimnasia hasta 90°).', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Dolor sobre los sesamoideos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor sobre los sesamoideos.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión dorsal de la 1.ª MTF en carga (media punta, despegue) → EVA. ② Grados de flexión dorsal pasiva de la 1.ª MTF con goniómetro, primer radio estabilizado, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp32: {
    id: 'tp32', region: 'tobillo_pie', num: '㉜',
    name: 'Dolor en la Base del 2.º Metatarsiano',
    prom: 'FAAM o LEFS',
    dosis: '',
    tests: [
      { name: 'Palpación de la base del 2.º MT y de Lisfranc', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la base del 2.º MT y de la articulación de Lisfranc. Mediotarsiana posiblemente rígida.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Estrés frente a sinovitis', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Estrés o fractura de estrés de la base del 2.º MT: dolor nocturno, sin efecto de calentamiento. Sinovitis: sin dolor nocturno, con efecto de calentamiento.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Media punta, o palpación de la base del 2.º MT → EVA. ② Repeticiones de ETM monopodal a tempo fijo hasta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp33: {
    id: 'tp33', region: 'tobillo_pie', num: '㉝',
    name: 'Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.',
      derivacion: '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor puntual sobre el cuello', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor puntual sobre el cuello.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Carga axial del MT', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La carga axial del MT provoca dolor en la lesión ósea, menos en la de partes blandas.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Marcha o carga del antepié → EVA. ② Minutos de marcha en cinta sin dolor, velocidad fija.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp34: {
    id: 'tp34', region: 'tobillo_pie', num: '㉞',
    name: 'Neuroma de Morton o Bursitis Intermetatarsiana',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.',
      derivacion: '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Palpación del espacio con compresión de los metatarsianos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos. No puntúa: la compresión pulgar-índice del espacio (Mahadevan 2015) tiene S 96 %, pero su especificidad sale de un solo pie sin Morton; el chasquido de Mulder da LR+ 2,19 (IC 0,45–10,60; Dando, en Pitcher 2024).', fuente: 'Tarjeta de consulta tobillo y pie (ap. 5); Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))' },
      { name: 'Diferencial del antepié', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Morton frente a metatarsalgia (callosidad, colapso del arco), Freiberg (14–18 años, cabeza del MT) y estrés de MT (dolor más dorsal).', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Palpación del espacio con compresión transversal → EVA. ② Minutos de marcha en cinta hasta los síntomas, mismo calzado y velocidad.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp35: {
    id: 'tp35', region: 'tobillo_pie', num: '㉟',
    name: 'Gota',
    prom: 'FAAM o LEFS',
    dosis: '',
    tests: [
      { name: 'Articulación roja, hinchada y muy dolorosa', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Articulación roja, hinchada, muy dolorosa al tacto y al movimiento; puede parecer una dactilitis.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Sistémicamente bien', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sistémicamente bien; tofos en la gota de larga evolución. En la gota, en cambio, está sistémicamente bien.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede en la crisis: derivar para confirmar. Con fiebre y malestar → artritis infecciosa: urgencia.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp36: {
    id: 'tp36', region: 'tobillo_pie', num: '㊱',
    name: 'Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Apofisitis: imagen rara vez necesaria. Köhler y Freiberg: radiografía característica (mirar el otro pie en Köhler).',
      derivacion: 'Las apofisitis suelen resolverse en 6–12 meses, a veces hasta 2 años. Osteoma osteoide sin alivio por AINE → otras causas.',
      fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Sever: inserción del Aquiles (8–12 años)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Inserción del Aquiles (8–12 años) → SEVER', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Iselin: base del 5.º MT (8–13 años)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'base del 5.º MT (8–13) → ISELIN', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Navicular: apofisitis del tibial posterior o Köhler', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'navicular → APOFISITIS DEL TIBIAL POSTERIOR o KÖHLER (menores de 10, cojera)', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      { name: 'Freiberg: cabeza del 2.º–4.º MT (14–18 años)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'cabeza del 2.º–4.º MT (14–18) → FREIBERG', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  }
};
