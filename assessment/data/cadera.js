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
      'Percusión rotuliano-púbica (S 95 %, E 86 %, LR+ 6,11, LR− 0,07): supino, fonendoscopio sobre el tubérculo púbico homolateral y percusión de la rótula; positivo si el sonido llega disminuido en el lado doloroso. Talón: golpe con el borde cubital del puño; positivo si reproduce el dolor con la carga axial.',
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
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
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
      { name: 'Test de Torsión/Twist', sn: '68%', sp: '72%', lr_pos: null, lr_neg: null, criterio: 'VPP 97% para desgarro labral cuando positivo.' },
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
};
