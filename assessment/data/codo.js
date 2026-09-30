// ============================================================
// PhysiQ-Assessment · data/codo.js
// Contenido clínico de la región CODO: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.codo
export const screening = {
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
        { id: 'co4a', text: '¿Se le ponen los dedos blancos o azules con el frío o con los nervios?', alerta: false },
        { id: 'co4a_uni', text: 'Si se le ponen los dedos blancos o azules con el frío, ¿le pasa solo en una mano?', alerta: true },
        { id: 'co4a_prog', text: 'Si se le ponen los dedos blancos o azules con el frío, ¿empezó hace menos de 2 años o ha ido a peor?', alerta: true },
        { id: 'co4b', text: '¿Tiene zonas del brazo o de la mano dormidas o con menos sensibilidad, aunque no le duelan?', alerta: false },
        { id: 'co3', text: '¿Tiene debilidad progresiva en el brazo o la mano que no se relaciona con el dolor local del codo?', alerta: true },
        { id: 'co_e2b', text: '¿Nota que los músculos se le cansan cada vez más mientras los usa y se recuperan al descansar, o que al final del día se le caen los párpados o ve doble?', alerta: true }
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
        { id: 'co_e2a', text: '¿Le cuesta más que antes subir escaleras o levantarse de una silla?', alerta: true }
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
};

// ── Fase 4 · CIF_TREES.codo
export const tree = {
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
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
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
      { name: 'Ecografía (si se dispone de informe)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ecografía convencional (no sonoelastografía): foco hipo o anecoico, tendón no visible, calcificación o irregularidad cortical. Cuenta como hallazgo: S 95,2 %, E 92 %, pero el patrón de referencia fue el propio diagnóstico clínico de un fisiatra y se comparó con 25 codos sin la patología, un diseño que infla la precisión y no mide si la ecografía añade algo al diagnóstico clínico.' , fuente: 'Park 2008 (Arch Phys Med Rehabil 89:738–742; prospectivo, un solo radiólogo)' }
    ]
  },
  co3: {
    id: 'co3', region: 'codo', num: '③',
    name: 'Capsulitis Adhesiva del Codo (Rigidez Post-traumática)',
    prom: 'Oxford Elbow Score (MCID: 8–20 pts) o QuickDASH (MCID: 10–16 pts)',
    dosis: 'Movilización activa-asistida en todas las direcciones (flexión, extensión, pronación, supinación) dentro del rango disponible sin dolor. 5 rep lentas × 2 series por dirección. Detener al primer punto de resistencia. Evitar estiramiento agresivo.',
    tests: [
      { name: 'Test de ROM activo en 4 direcciones', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Extensión completa, flexión, pronación y supinación comparadas con el lado sano. Sin cifras para capsulitis: la «S 99 %» que tenía es del test de extensión del codo para descartar fractura tras traumatismo (Appelboam 2008: no extender del todo el codo → radiografía; S 96,8 %), otra condición.' , fuente: 'Appelboam 2008 (BMJ 337:a2428), solo como aclaración: su cifra es para fractura, no para capsulitis' },
      { name: 'Limitación activa Y pasiva comparada con lado sano', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados para tests específicos de capsulitis de codo en literatura.', noData: true }
    ]
  },
  co4: {
    id: 'co4', region: 'codo', num: '④',
    name: 'Insuficiencia del Ligamento Colateral Cubital (LCC)',
    prom: 'QuickDASH (MCID: 10–16 puntos)',
    dosis: 'Isométrico de flexión de codo en posición neutra (sin valgo), contracción sostenida 5 seg, 10 rep × 1 serie. Evitar completamente el estrés en valgo. Mantener codo en posición protegida (flexión 70-90°).',
    tests: [
      { name: 'Ecografía dinámica con estrés en valgo', sn: '96%', sp: '81%', lr_pos: null, lr_neg: null, criterio: 'Delta de apertura articular >1.0 mm comparado con lado contralateral. Técnica de elección no invasiva.' , fuente: 'Roedl, recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática; 144 pacientes, referencia intraoperatoria, positivo con apertura ≥1,0 mm frente al lado sano; para rotura completa, umbral de 2,5 mm: S 95 %, E 89 %)' },
      { name: 'RM con artrograma', sn: '81%', sp: '91%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Gold standard para lesiones del LCC.' , fuente: 'Roedl, recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática; 144 pacientes, referencia intraoperatoria; la misma precisión que la ecografía convencional en esa cohorte; otros estudios de la revisión, S 81–100 %, E 91–100 %)' },
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
      { name: 'Dolor posterolateral en línea articular radiocapitelar a la palpación', sn: '83.3%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Presente en el 83.3% de los casos confirmados artroscópicamente.' , fuente: 'Park 2019 (Medicine 98:e15497): punto de máximo dolor en la línea radiocapitelar en 20 de 24' },
      { name: 'Test de plica radiocapitelar posterolateral', sn: '83.3%', sp: '87.5%', lr_pos: null, lr_neg: null, criterio: 'Pulgar en la cara posterolateral de la radiocapitelar y antebrazo en pronación; empezar con el codo extendido y flexionar manteniendo la presión. Positivo si el dolor a baja flexión desaparece claramente por encima de 90°. S 83,3 % (IC 95 % 62,6–95,3), E 87,5 %: 24 plicas confirmadas por artroscopia frente a 56 epicondilalgias laterales (el diferencial real). Estudio retrospectivo de los creadores del test. La RM identificó la plica en el 70,8 %.' , fuente: 'Park 2019 (Medicine 98:e15497; retrospectivo, n = 24 frente a 56)' }
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
