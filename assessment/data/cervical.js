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
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
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
};
