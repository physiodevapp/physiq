// ============================================================
// PhysiQ-Assessment · data/rodilla.js
// Contenido clínico de la región RODILLA: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.rodilla
export const screening = {
  label: 'Cuadrante Inferior — Rodilla',
  // Recuadro de urgencia: literal de la tarjeta de consulta rodilla (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS · TVP · ARTRITIS SÉPTICA · APARATO EXTENSOR · BURSA CON FIEBRE · NEUROVASCULAR',
    lineas: [
      'TVP: no identificarla puede llevar a embolia pulmonar, que ocurre en más de un tercio de los casos. Dolor intenso e inexplicado, calambre en el hueco poplíteo, calor o hinchazón. Derivar a quien pueda excluirla.',
      'ARTRITIS SÉPTICA: rodilla caliente, roja y con derrame a tensión. Dolor intenso en todo el arco, incluso en recorridos mínimos. Fiebre, malestar general, incapacidad para cargar. Factores: infiltración o cirugía articular reciente, prótesis, inmunodepresión, diabetes, AR, infección cutánea, drogas parenterales. Puede coexistir con artrosis o gota y despistar. Ningún signo aislado es bastante sensible para descartarla → URGENCIA HOSPITALARIA HOY.',
      'ROTURA DEL APARATO EXTENSOR: la regla de Ottawa NO lo detecta. Carga excéntrica brusca sobre la rodilla flexionada o caída, con chasquido y caída inmediata. NO puede elevar la pierna extendida ni mantener la rodilla extendida contra gravedad. Escalón palpable por encima de la rótula (cuádriceps) o por debajo (rotuliano); hemartrosis; rótula alta o baja. La elevación de la pierna extendida es prueba aparte y obligatoria en toda rodilla traumática con dolor anterior. Reparación precoz (2 primeras semanas) → mejores resultados.',
      'Bursitis prerrotuliana séptica: la FIEBRE >37,7 °C solo se ha descrito en la séptica. Derivación el mismo día. · Compromiso neurovascular tras traumatismo: cambios de temperatura, adormecimiento, parestesias o debilidad tras fractura de meseta o luxación → pulsos distales, cribado neurológico e índice tobillo-brazo.',
      'REGLA DE OTTAWA, antes de explorar cualquier rodilla con traumatismo agudo → radiografía si hay ALGUNO de los cinco, por separado: ≥55 años · dolor a la palpación de la cabeza del peroné · dolor aislado a la palpación de la rótula · no flexiona hasta 90° · no carga cuatro pasos, ni justo tras la lesión ni ahora, aunque sea cojeando. S 98–100 %, E ≈50 %: sirve para descartar, no para confirmar. Excluida si la lesión tiene más de 7 días.'
    ]
  },
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
        { id: 'r_v2', urgencia: 'Sospecha de TVP: derivar hoy a quien pueda excluirla (riesgo de embolia pulmonar).', text: '¿Tiene la pantorrilla hinchada, caliente y más rojiza que la otra (posible TVP)?', alerta: true }
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
        { id: 'r1', urgencia: 'Sospecha de artritis séptica: urgencia hospitalaria hoy.', text: '¿Hay fiebre, enrojecimiento intenso y calor local junto con la tumefacción de la rodilla (artritis séptica)?', alerta: true },
        { id: 'r_i2', text: '¿Ha tenido alguna infección reciente (urinaria, respiratoria, cutánea) antes de que apareciera el dolor articular?', alerta: true }
      ],
      zonasDolor: [{ zona: 'Rodilla / Articulación', desc: 'Artritis séptica — dolor intenso localizado con signos flogóticos' }],
      impactoDescanso: ['Dolor articular intenso constante impide el descanso'],
      impactoEjercicio: ['Contraindicación absoluta de carga hasta confirmación diagnóstica']
    },
    {
      id: 'ro_oncologico', icon: '🔬', nombre: 'Oncológico / Hematológico',
      banderasRojas: [
        'Dolor nocturno constante e intenso sin alivio postural',
        'Masa o bulto palpable en zona periarticular',
        'Antecedentes de cáncer o edad <25 años (cánceres óseos primarios)'
      ],
      banderasAmarillas: ['Edad entre 10-30 años con dolor óseo inexplicado'],
      preguntas: [
        { id: 'r2', text: '¿El dolor es constante, nocturno, intenso y no se alivia con ninguna posición ni reposo?', alerta: true },
        { id: 'r3', text: '¿Tiene antecedentes de cáncer o ha notado algún bulto en la zona de la rodilla o muslo?', alerta: true },
        { id: 'r4', text: '¿Ha tenido episodios de hinchazón articular después de un traumatismo menor?', alerta: false }
      ],
      zonasDolor: [{ zona: 'Rodilla / Fémur distal / Tibia proximal', desc: 'Osteosarcoma, metástasis' }],
      impactoDescanso: ['Dolor óseo nocturno que despierta — señal de alarma principal'],
      impactoEjercicio: ['Riesgo de fractura patológica — restricción de carga', 'Fatiga extrema asociada']
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.rodilla
export const tree = {
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
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
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
};
