// ============================================================
// PhysiQ-Assessment · data/lumbar.js
// Contenido clínico de la región LUMBAR: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.lumbar
export const screening = {
  label: 'Sacro, Sacroilíaca, Pelvis y Lumbar',
  // Recuadro de urgencia: literal de la tarjeta de consulta lumbar (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS HOY · CAUDA EQUINA',
    lineas: [
      'Urgencia quirúrgica: el tiempo hasta la cirugía pesa más que la duración de los síntomas.',
      'Dolor o debilidad bilateral grave en MMII · parestesia en silla de montar · retención o incontinencia urinaria · incontinencia fecal · menor tono anal.',
      'PREGUNTAR SIEMPRE. Signos más específicos que sensibles; RM de elección. En mayores con estenosis el inicio lento se solapa y pasa desapercibido.'
    ]
  },
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
        { id: 'l6', text: '¿Presenta incontinencia urinaria o intestinal, o pérdida de sensibilidad en la zona de "silla de montar"?', alerta: true, s1: true, urgencia: 'Sospecha de cauda equina: derivación a urgencias hoy (RM de elección).' },
        { id: 'l_u3a', text: '¿En las últimas 3–4 semanas ha notado ardor o dolor al orinar?', alerta: true },
        { id: 'l_u3b', text: '¿Desde hace poco se levanta a orinar más de una vez cada noche, sin que haya cambiado lo que bebe antes de acostarse?', alerta: true }
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
        'Embarazo ectópico: dolor pélvico unilateral severo con sangrado (urgencia)',
        'Fractura sacra por estrés: mujer deportista con actividad vigorosa y repetitiva, dolor en nalga que reproduce la carrera, dieta pobre, alteraciones menstruales o fracturas de estrés previas. Signo de la nalga; puede no verse en RM',
        'Espondilolistesis aguda: joven con lesiones repetidas en hiperextensión, ciática bilateral súbita durante el deporte, dolor en extensión'
      ],
      banderasAmarillas: [
        'Dolor sacroilíaco bilateral alterno',
        'Dolor relacionado con ciclo menstrual (endometriosis)',
        'Historia familiar de espondilitis anquilosante',
        'Antecedente de osteoporosis o uso prolongado de corticosteroides (riesgo de fractura por insuficiencia)',
        'Engrosamiento óseo palpable o deformidad (Paget)'
      ],
      preguntas: [
        { id: 'l5', text: '¿Tiene rigidez matutina prolongada (más de 30 minutos) que mejora con el movimiento?', alerta: true, s1: true },
        { id: 'l5c', text: '¿El dolor cambia de un glúteo a otro, unas veces en un lado y otras en el otro?', alerta: false },
        { id: 'l5d', text: '¿El dolor sigue igual o empeora cuando descansa, en lugar de aliviarse?', alerta: false },
        { id: 'l_e2', text: '¿El dolor sacroilíaco lo despierta en la segunda mitad de la noche (entre las 2 y las 5 am)?', alerta: true, s1: true },
        { id: 'l_e3', text: '¿El dolor pélvico está claramente relacionado con el ciclo menstrual, o tiene sangrado ginecológico inusual?', alerta: true, s1: true },
        { id: 'l_e4', text: '¿Tiene diagnóstico de osteoporosis, o ha tenido una fractura reciente ante un golpe menor o sin trauma aparente?', alerta: true },
        { id: 'l_e5', text: '¿Ha notado deformidad ósea, engrosamiento de huesos o ha sido diagnosticado de enfermedad de Paget?', alerta: true },
        { id: 'l_e6', text: '¿Hace deporte o actividad vigorosa y repetitiva (p. ej. correr) y el dolor de nalga aparece con ella, con dieta pobre, alteraciones menstruales o fracturas de estrés previas?', alerta: true },
        { id: 'l_e7', text: '¿Ha aparecido de golpe dolor en ambas piernas durante el deporte, tras lesiones repetidas en extensión de la espalda?', alerta: true }
      ],
      // Criterio de dolor lumbar inflamatorio de Goodman (cap. 14): válido solo en <45 años
      // y >3 meses de evolución (proxy: state.cronologia === 'Crónico (>3 meses)'); con 2 de
      // las 4 preguntas positivas, Sn 70%/Sp 81%; con 3, Sp ≈100%. l5 y l_e2 ya alertan por sí
      // solas (banderas rojas independientes); l5c/l5d no tienen significado aislado en
      // Goodman — solo cuentan dentro de este criterio compuesto. Evaluado en app.js
      // (evaluarCriterioCompuesto), no cambia el `alerta` individual de cada pregunta.
      criterioCompuesto: {
        ids: ['l5', 'l_e2', 'l5c', 'l5d'],
        minPositivas: 2,
        filtro: { edadMax: 45, evolucion: 'Crónico (>3 meses)' },
        etiqueta: 'Patrón compatible con dolor lumbar inflamatorio: derivación preferente a reumatología.',
        nota: 'Criterio de Goodman (cap. 14): 2 de 4 → sensibilidad 70%, especificidad 81%; 3 de 4 → especificidad cercana al 100%. No es un diagnóstico.'
      },
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
    {
      // Tarjeta lumbar (guía de consulta), fila «Vascular»: la exploración
      // mecánica no reproduce los síntomas y la claudicación vascular cede al
      // PARARSE, no al sentarse ni al flexionar (a diferencia de la estenosis).
      id: 'l_vascular', icon: '🫀', nombre: 'Vascular',
      banderasRojas: [
        'Aneurisma aórtico: dolor en reposo o nocturno, masa abdominal pulsátil, antecedentes familiares cardiovasculares',
        'Claudicación vascular: dolor al caminar que cede al pararse (sin necesidad de sentarse), pie más frío, pulsos distales disminuidos',
        'Síndrome de Leriche (aortoilíaco): imita lumbalgia, con dolor en nalgas, caderas y muslos; disfunción eréctil'
      ],
      banderasAmarillas: [
        'Mayor con factores de riesgo cardiovascular (HTA, diabetes, colesterol, tabaco)'
      ],
      preguntas: [
        { id: 'l_v1', text: '¿El dolor de piernas al caminar se le pasa con solo pararse de pie, sin necesidad de sentarse ni inclinarse?', alerta: true, s1: true },
        { id: 'l_v2', text: '¿Tiene dolor lumbar o abdominal en reposo o por la noche, o le han notado un bulto que late en el abdomen?', alerta: true },
        { id: 'l_v3', text: '¿Nota un pie más frío que el otro, o le han dicho que tiene los pulsos de las piernas débiles?', alerta: true }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.lumbar
export const tree = {
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
      // Tarjeta lumbar (guía de consulta), nodo 3b: dolor radicular y
      // radiculopatía pueden coexistir — este paso solo añade, no excluye lu3.
      id: 'lu_step1c',
      tag: 'Paso 1c — Déficit Neurológico (Radiculopatía)',
      question: '¿Hay déficit de fuerza, sensibilidad o reflejos en la pierna (comparado con el lado sano)?',
      options: [
        { label: 'SÍ — Debilidad en un miotoma, reflejo disminuido o alteración sensitiva dermatomal', value: 'si', next: null, hypothesis: ['lu5'] },
        { label: 'NO — Exploración neurológica normal', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'lu_step2',
      tag: 'Paso 2 — Evaluación por Edad y Posición (Rama Estenosis)',
      question: '¿El paciente es mayor y el dolor mejora al sentarse o inclinarse hacia adelante?',
      options: [
        { label: 'SÍ — Dolor bilateral en glúteos/muslos, alivio con "signo del carrito de compras"', value: 'si', next: null, hypothesis: ['lu4'] },
        { label: 'NO — Sin este patrón', value: 'no', next: 'lu_step3', hypothesis: [] },
        { label: 'VASCULAR — Los síntomas al caminar ceden con solo pararse de pie, sin sentarse ni flexionar: sospecha de claudicación vascular → derivación médica', value: 'vascular', next: 'lu_step3', hypothesis: [] }
      ]
    },
    {
      id: 'lu_step3',
      tag: 'Paso 3 — Evaluación Mecánica y Cronología',
      question: '¿Cómo es el patrón de dolor lumbar predominante?',
      options: [
        { label: 'Agudo/Rigidez — Síntomas <16 días, sin dolor bajo la rodilla y restricción segmentaria hipomóvil', value: 'agudo', next: null, hypothesis: ['lu1'] },
        { label: 'Persistente/Inestabilidad — Dolor en rangos finales o posturas sostenidas con sensación de "fallo"', value: 'inestable', next: null, hypothesis: ['lu2'] },
        { label: 'Ninguno de los dos — Continuar con el patrón de dolor inespecífico', value: 'ninguno', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta lumbar (guía de consulta), nodo 4 + tabla orientativa
      // disco / faceta / SI. Revisar siempre cadera y factores contribuyentes.
      id: 'lu_step4',
      tag: 'Paso 4 — Dolor Inespecífico: Patrón Predominante',
      question: '¿Qué patrón encaja mejor? (Revisar siempre cadera y factores contribuyentes.)',
      options: [
        { label: 'DISCOGÉNICO — Dolor en línea media + preferencia direccional o centralización con movimientos repetidos; puede cambiar de lado', value: 'disco', next: null, hypothesis: ['lu6'] },
        { label: 'FACETARIO — Paramedial unilateral, dolor en extensión o extensión + rotación, sin pasar de la rodilla; los repetidos no alivian', value: 'faceta', next: null, hypothesis: ['lu7'] },
        { label: 'SACROILÍACA — Dolor en zona de Fortin sin dolor en Tuber, no centraliza', value: 'si', next: null, hypothesis: ['lu8'] },
        { label: 'MIOFASCIAL — Banda tensa palpable + punto hipersensible + el paciente reconoce el dolor provocado', value: 'miofascial', next: null, hypothesis: ['lu9'] },
        { label: 'NINGUNO — Sin patrón predominante', value: 'ninguno', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── LUMBAR ─────────────────────────────────────────────
  // LR: ver «Phase 4b scoring» en CLAUDE.md. `fuente` cita el estudio de cada
  // cifra; sin fuente no hay LR (el test cuenta como hallazgo clínico).
  // `pronostico`: texto literal de la tarjeta lumbar de la guía de consulta.
  lu1: {
    id: 'lu1', region: 'lumbar', num: '①',
    name: 'Disfunción Segmentaria Lumbosacra (Déficit de Movilidad)',
    prom: 'ODI (MCID: 8.5 pts) / RMDQ (MCID: 2.5–6.8 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Manipulación espinal tipo thrust (HVLA) en segmentos hipomóviles, 1-2 aplicaciones. Movilizaciones no-thrust grado I-II en rango medio. Ejercicios de inclinación pélvica en decúbito supino, 8-10 repeticiones cada 2 horas. Educación: mantener actividades habituales.',
    tests: [
      { name: 'Regla de Predicción Clínica de Flynn (4/5 criterios)', sn: null, sp: null, lr_pos: '24.4', lr_neg: null, tipo: 'pronostico', criterio: 'Criterios: síntomas <16 días, sin dolor distal a rodilla, FABQ trabajo <19 pts, ≥1 segmento hipomóvil, ≥1 cadera con >35° rotación interna. Predice la respuesta a la manipulación, no diagnostica la disfunción. Evidencia conflictiva para dolor crónico.', fuente: 'Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %)' },
      { name: 'Evaluación de hipomovilidad segmentaria lumbar (PAIVM)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilización posteroanterior sobre apófisis espinosas lumbares. Detecta segmentos hipomóviles.' }
    ]
  },
  lu2: {
    id: 'lu2', region: 'lumbar', num: '②',
    name: 'Inestabilidad Espinal Lumbar (Déficit de Coordinación)',
    prom: 'ODI (MCID: 8.5 pts) / RMDQ (MCID: 2.5–6.8 pts)',
    dosis: 'Activación de transverso abdominal en decúbito supino con retroversión pélvica suave. 5 repeticiones × 5 seg de contracción submáxima (30% CVM). Evitar posiciones de final de rango (flexión/extensión completa) durante las primeras 48 horas.',
    tests: [
      { name: 'Flexión lumbar ≥ 53° o ausencia de hipomovilidad en la exploración segmentaria', sn: null, sp: null, lr_pos: '4.3', lr_neg: null, criterio: 'Positivo si se cumple cualquiera de las dos. Predice inestabilidad radiológica en flexo-extensión (referencia radiográfica, no clínica).', fuente: 'Fritz 2005 (IC 95 % del LR+: 1,8–10,6)' },
      { name: 'Test de inestabilidad en prono', sn: '61%', sp: '57%', lr_pos: null, lr_neg: null, criterio: 'Prono con el tronco sobre la camilla y pies en el suelo: PA dolorosa que deja de doler al levantar los pies (activación de extensores).', fuente: 'Fritz 2005 (referencia: inestabilidad radiológica)' },
      { name: 'Evaluación de control motor en bipedestación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sensación de "fallo" en rangos medios, dificultad para mantener posición neutra bajo carga.', noData: true }
    ]
  },
  lu3: {
    id: 'lu3', region: 'lumbar', num: '③',
    name: 'Dolor Radicular Lumbar',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Ejercicios direccionales que centralicen o abolezcan el dolor (según preferencia direccional). 8-10 repeticiones cada 2 horas. Si extensión centraliza: press-up modificado al 50% ROM. Si flexión centraliza: rodillas al pecho. Evitar posiciones que periferalicen.',
    pronostico: {
      horizonte: 'Agudo hasta 3 semanas, subagudo hasta 3 meses. Mejora a los 6 meses en el 88 %, recuperación completa en el 65 %. Hernia reabsorbida en al menos dos tercios. Recurrencia 20 %.',
      derivacion: 'RM si sospecha de patología grave, dolor radicular persistente, déficit grave o progresivo, o más de 1 mes sin remisión con conservador.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Test de Elevación de Pierna Recta (SLR) ipsilateral', sn: '91%', sp: '26%', lr_pos: null, lr_neg: null, criterio: 'Positivo: reproduce el dolor de pierna (no solo lumbar) con elevación <60°. Útil sobre todo negativo, para descartar; un positivo aislado aporta poco.', fuente: 'Devillé 2000 (revisión sistemática; referencia: cirugía)' },
      { name: 'SLR Contralateral (Lasègue cruzado)', sn: '29%', sp: '88%', lr_pos: null, lr_neg: null, criterio: 'Positivo: dolor radicular ipsilateral al elevar la pierna contralateral. Útil sobre todo positivo.', fuente: 'Devillé 2000 (revisión sistemática; referencia: cirugía)' },
      { name: 'Test de Slump', sn: '84%', sp: '83%', lr_pos: null, lr_neg: null, criterio: 'Sedestación con flexión de tronco y cuello, extensión de rodilla y dorsiflexión. Positivo: reproduce el dolor de pierna y se alivia al extender el cuello. Más sensible que el SLR si se sospecha hernia discal.', fuente: 'Majlesi 2008 (estudio único; referencia: RM)' },
      { name: 'Criterios RAPIDH (5 criterios)', sn: '70.6%', sp: '90.4%', lr_pos: null, lr_neg: null, absorbe: [0], criterio: 'AUC 0.91. Criterios: distribución monoradicular, dolor unilateral en pierna, SLR+ <60°, debilidad motora unilateral, reflejo aquíleo asimétrico. Incluye el SLR: si se puntúa RAPIDH, el SLR no suma aparte.', fuente: 'Genevay 2017' }
    ]
  },
  lu4: {
    id: 'lu4', region: 'lumbar', num: '④',
    name: 'Estenosis Espinal / Claudicación Neurogénica',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 2.8 pts para "mucha mejoría")',
    dosis: 'Flexión lumbar en decúbito supino: rodillas al pecho bilateral, 5 repeticiones × 10 seg, ROM en zona de alivio sintomático. Marcha asistida con bastón o andador que permita flexión anterior de tronco, 2-3 min con descansos frecuentes en sedestación.',
    pronostico: {
      horizonte: 'Historia natural poco conocida. 15 % mejora solo; hasta 20 % controla los síntomas evitando la extensión. Conservador antes que cirugía.',
      derivacion: 'Progresión neurológica rápida o deterioro de la calidad de vida. La cirugía no garantiza recuperar los déficits.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    clusters: {
      cook: { nombre: 'Cluster de Cook (anamnesis y observación)', umbralPos: 4, lr_pos: '4.6', umbralNeg: 0, lr_neg: '0.19', fuente: 'Cook 2011 (n = 1448). 4 de 5: S 6 %, E 98 %; ninguno: S 96 %' }
    },
    tests: [
      { name: 'Síntomas bilaterales', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Dolor o síntomas en ambas piernas.' },
      { name: 'Dolor de pierna mayor que el dolor lumbar', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'El paciente refiere más dolor en la pierna que en la espalda.' },
      { name: 'Dolor al caminar o estar de pie', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Los síntomas aparecen o empeoran al caminar o permanecer de pie.' },
      { name: 'Alivio al sentarse', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Los síntomas ceden al sentarse (si ceden solo con pararse de pie, sospechar claudicación vascular).' },
      { name: 'Edad > 48 años', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Positivo si el paciente tiene más de 48 años.' },
      { name: 'Marcha con base amplia', sn: null, sp: null, lr_pos: '13', lr_neg: null, criterio: 'Observación de la marcha: aumento de la base de sustentación. Muy específica, poco sensible.', fuente: 'Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,9–95)' },
      { name: 'Romberg alterado', sn: null, sp: null, lr_pos: '4.2', lr_neg: null, criterio: 'Alteración del equilibrio en bipedestación con pies juntos y ojos cerrados.', fuente: 'Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,4–13)' },
      { name: 'Déficits sensoriales (L3-S1)', sn: '~50%', sp: '~80%', lr_pos: null, lr_neg: null, criterio: 'Distribuciones de pinchazo/vibración en L3-S1.' },
      // Al final (no en medio) para no desplazar los índices de state.testResults ya guardados.
      { name: 'Test de extensión lumbar de 30 s', sn: '51%', sp: '69%', lr_pos: null, lr_neg: null, criterio: 'De pie, extensión lumbar mantenida 30 s. Positivo: aparece o aumenta el dolor en el muslo (por debajo del pliegue glúteo), no solo el lumbar. No informativo por sí solo. Una versión modificada (hasta 60 s, más extensión + inclinación hacia el lado sintomático) da S 92 %, E 40 %, LR− 0,2, pero con IC 95 % hasta 1,36 en 30 pacientes: no sirve aún para descartar.', fuente: 'Katz 1995, datos citados en Dobbs 2016 (Manual Therapy; referencia: RM)' }
    ]
  },
  lu5: {
    id: 'lu5', region: 'lumbar', num: '⑤',
    name: 'Radiculopatía Lumbar (Déficit Neurológico)',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: '',
    pronostico: {
      horizonte: 'RM de elección. EMG muy específica, poco sensible; útil si clínica e imagen no casan.',
      derivacion: 'Cirugía: déficit significativo en abductores de cadera, flexores plantares o dorsales del pie, o déficit que progresa pese al conservador.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Fuerza por miotomas L1–S2', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La debilidad es el signo más importante. Comparar siempre con el lado sano. Interpretar junto a reflejos y sensibilidad, nunca aislado.' },
      { name: 'Reflejos rotuliano (L3–L4) y aquíleo (L5–S1)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Especificidad 0,60–0,93 y sensibilidad hasta 0,67 según estudio, sin valor agrupado.', fuente: 'Tawa 2017 (revisión sistemática)' },
      { name: 'Sensibilidad (algodón, diapasón, pinchazo)', sn: '61%', sp: '63%', lr_pos: null, lr_neg: null, criterio: 'Algodón, diapasón sobre prominencia ósea y pinchazo, comparando con el lado sano.', fuente: 'Tawa 2017 (revisión sistemática; referencia: RM)' }
    ]
  },
  lu6: {
    id: 'lu6', region: 'lumbar', num: '⑥',
    name: 'Dolor Lumbar Discogénico',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: '',
    pronostico: {
      horizonte: 'A 4 años: 13 % mejoró, 7,6 % alivio leve, 12,2 % empeoró, 67,2 % sin cambios. La preferencia direccional predice buen pronóstico.',
      derivacion: 'Componente neuropático o disfuncional → más cronicidad. Con dolor en pierna, diferenciar de dolor radicular.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Centralización con movimientos repetidos', sn: null, sp: null, lr_pos: '3.06', lr_neg: '0.66', criterio: 'Desaparecen los síntomas distales con movimientos repetidos al final del rango. Que no centralice no descarta el origen discal. La especificidad baja con discapacidad grave o malestar psicológico.', fuente: 'Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8' },
      { name: 'Preferencia direccional', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movimientos repetidos al final del rango o posturas mantenidas que alivian de forma duradera o aumentan la movilidad.' },
      { name: 'Observación: espalda plana o shift lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pérdida de lordosis o desviación lateral del tronco.' }
    ]
  },
  lu7: {
    id: 'lu7', region: 'lumbar', num: '⑦',
    name: 'Dolor Lumbar Facetario',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: '',
    pronostico: {
      horizonte: 'No se puede establecer pronóstico: la degeneración aumenta con la edad sin relación causal demostrada con el dolor. La radiología no es criterio diagnóstico; un bloqueo simple alivia definitivamente a menos del 10 %.',
      derivacion: '',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Dolor en extensión, inclinación o rotación hacia el lado del dolor', sn: null, sp: null, lr_pos: '1.29', lr_neg: null, criterio: 'Criterios clínicos tipo Revel. Ningún test clínico ha resultado informativo para el origen facetario: el único test informativo agrupado es la captación facetaria en SPECT (LR+ 2,80, LR− 0,44), una prueba de imagen, no de consulta.', fuente: 'Laslett 2006 (no replica a Revel; referencia: doble bloqueo); Han 2023 (eClinicalMedicine, revisión sistemática: Revel inconsistente, no agrupable)' },
      { name: 'PA unilateral dolorosa o con menos movilidad', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PA sobre la faceta o la transversa; espasmo ipsilateral.' },
      { name: 'Sin signos radiculares y sin alivio con repetidos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ausencia de signos radiculares; espalda en flexión, sin shift; los repetidos no suelen aliviar.' }
    ]
  },
  lu8: {
    id: 'lu8', region: 'lumbar', num: '⑧',
    name: 'Dolor de la Articulación Sacroilíaca',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: '',
    pronostico: {
      horizonte: 'PRPPP: >54 % en el último trimestre, 25 % posparto; la mayoría se recupera, 7–20 % persiste. Recaída del 85 % en el siguiente embarazo.',
      derivacion: 'Predicen persistencia: edad, carga de trabajo alta, lumbalgia previa, mala función muscular. Cribar depresión posparto (×3).',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    clusters: {
      laslett: { nombre: 'Tests de provocación SI (3 de 5)', umbralPos: 3, umbralNeg: 2, sn: null, sp: null, lr_pos: '2.44', lr_neg: '0.31', fuente: 'Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios; LR+ IC 95 %: 1,50–3,98, LR− 0,21–0,47; referencia: bloqueo anestésico). Misma regla que la tarjeta lumbar: 3 de 5 positivos. Saueressig 2021 (JOSPT, metaanálisis, 5 estudios): LR+ 2,13, LR− 0,33, certeza muy baja (GRADE); descarta mejor de lo que confirma' }
    },
    tests: [
      { name: 'Distracción', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Supino: presión posterolateral sobre ambas EIAS. Positivo: reproduce el dolor conocido.' },
      { name: 'Thrust de muslo', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Supino, cadera a 90°: presión axial sobre el fémur. Positivo: reproduce el dolor conocido.' },
      { name: 'Compresión', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Decúbito lateral: presión vertical sobre la cresta ilíaca. Positivo: reproduce el dolor conocido.' },
      { name: 'Thrust sacro', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Prono: presión PA sobre el centro del sacro. Positivo: reproduce el dolor conocido.' },
      { name: 'No centraliza con movimientos repetidos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Descartar antes origen lumbar buscando preferencia direccional. No usar tests de disfunción de movimiento SI (baja fiabilidad y validez).' },
      // Añadidos al final (no en medio) para no desplazar los índices de
      // state.testResults de sesiones ya guardadas.
      { name: 'Gaenslen', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Supino al borde de la camilla: una cadera en flexión máxima y la otra en extensión fuera de la camilla, con presión sobre ambas. Positivo: reproduce el dolor conocido.' },
      { name: 'Ausencia de dolor lumbar en la línea media', sn: null, sp: null, lr_pos: '2.41', lr_neg: null, criterio: 'Positivo si el paciente no refiere dolor en la línea media lumbar. Su LR− (0,35) tiene un IC 95 % que llega a 1,01: no se usa para descartar.', fuente: 'Han 2023 (eClinicalMedicine, revisión sistemática, 2 estudios; LR+ IC 95 %: 1,89–3,07)' }
    ]
  },
  lu9: {
    id: 'lu9', region: 'lumbar', num: '⑨',
    name: 'Síndrome de Dolor Miofascial Lumbar',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: '',
    tests: [
      { name: 'Banda tensa palpable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio mínimo. Sin patrón de referencia diagnóstico; la palpación tiene fiabilidad baja.', fuente: 'Lucas 2009 (revisión sistemática de fiabilidad)' },
      { name: 'Punto hipersensible dentro de la banda', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio mínimo.' },
      { name: 'El paciente reconoce el dolor provocado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio mínimo, con o sin dolor referido. Hallazgo acompañante hasta descartar lo anterior.' }
    ]
  },
};
