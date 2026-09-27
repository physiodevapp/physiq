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
        'Signos de TVP: edema asimétrico, calor, eritema y sensibilidad en pantorrilla',
        // Tarjeta rodilla (guía de consulta), BANDERAS «TVP · Wells con puntuación» y «Pseudotromboflebitis por quiste poplíteo»
        'TVP · Wells con puntuación: +1 cada uno: cáncer activo (tratamiento en 6 meses o paliativo) · parálisis, paresia o inmovilización con férula · encamamiento ≥3 días o cirugía mayor en 12 SEMANAS · dolor en el trayecto venoso profundo · hinchazón de toda la pierna · pantorrilla >3 cm más gruesa, medida 10 cm bajo la tuberosidad tibial · edema con fóvea solo en la pierna sintomática · venas colaterales no varicosas · TVP previa documentada. −2: hay un diagnóstico alternativo al menos tan probable como la TVP. 2 o más → TVP probable; 1 o menos → improbable. El capítulo lista el ítem que resta junto a los demás y sobreestima. Orienta la derivación, no la sustituye.',
        'Pseudotromboflebitis por quiste poplíteo: dolor o hinchazón en la pantorrilla y signo de Homans positivo en un quiste grande, disecado o roto. El quiste también puede causar síndrome compartimental y neuropatías por compresión. Clínicamente no se puede separar de una tromboflebitis real: derivar. La ecografía es la primera opción para diferenciar quiste de TVP.'
      ],
      banderasAmarillas: ['Dolor en reposo que mejora al colgar la pierna fuera de la cama'],
      preguntas: [
        { id: 'r_v1', text: '¿El dolor aparece tras caminar unos minutos y cede casi de inmediato al parar (claudicación)?', alerta: true },
        { id: 'r_v2', urgencia: 'Sospecha de TVP: derivar hoy a quien pueda excluirla (riesgo de embolia pulmonar).', text: '¿Tiene la pantorrilla hinchada, caliente y más rojiza que la otra (posible TVP)?', alerta: true },
        { id: 'r_v3', text: '¿Tiene un bulto detrás de la rodilla (quiste poplíteo) y además dolor o hinchazón en la pantorrilla? Clínicamente no se distingue de una tromboflebitis: derivar (ecografía).', alerta: true }
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
        'Inicio muy agudo con articulación bloqueada en posición de confort',
        // Tarjeta rodilla (guía de consulta), URGENCIA
        'Bursitis prerrotuliana séptica: la FIEBRE >37,7 °C solo se ha descrito en la séptica. Derivación el mismo día.'
      ],
      banderasAmarillas: ['Antecedente de infección reciente (urinaria, respiratoria, cutánea)'],
      preguntas: [
        { id: 'r1', urgencia: 'Sospecha de artritis séptica: urgencia hospitalaria hoy.', text: '¿Hay fiebre, enrojecimiento intenso y calor local junto con la tumefacción de la rodilla (artritis séptica)?', alerta: true },
        { id: 'r_i2', text: '¿Ha tenido alguna infección reciente (urinaria, respiratoria, cutánea) antes de que apareciera el dolor articular?', alerta: true },
        { id: 'r_i3', urgencia: 'Sospecha de bursitis prerrotuliana séptica: derivación el mismo día.', text: '¿Tiene hinchada, caliente y roja la bolsa de delante de la rótula, y fiebre de más de 37,7 °C?', alerta: true, s1: true }
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
        'Antecedentes de cáncer o edad <25 años (cánceres óseos primarios)',
        // Tarjeta rodilla (guía de consulta), BANDERAS «Tumor»
        'Tumor: el capítulo no da criterios clínicos propios: solo lo menciona como bandera roja que la radiografía ayuda a descartar al valorar una apofisitis tibial en el adolescente. Si se pide imagen en un adolescente con dolor en la tuberosidad tibial, la radiografía simple ayuda a descartar fractura aguda y tumor.'
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
    {
      // Tarjeta rodilla (guía de consulta): URGENCIA (aparato extensor,
      // neurovascular) y BANDERAS «Fractura de rótula o de meseta tibial»,
      // «Luxación de rodilla y traumatismo multiligamentoso», «Lesión del
      // nervio peroneo común» y «Lesión osteocondral inestable».
      id: 'ro_trauma', icon: '🦴', nombre: 'Traumático / Mecánico',
      banderasRojas: [
        'Fractura de rótula o de meseta tibial: mecanismo conocido: golpe directo, rótula contra el salpicadero, caída sobre la rodilla, o indirecto (saltar y caer mal). Meseta: alta energía en varones jóvenes, baja energía en mujeres mayores u osteoporóticas. Hinchazón inmediata, incapacidad para cargar, movilidad limitada, chasquido en el momento. Regla de Ottawa. Palpación de rótula, cabeza del peroné y meseta; posible escalón palpable; dolor con extensión resistida; marcha antiálgica con rodilla rígida.',
        'Rotura del aparato extensor: la regla de Ottawa NO lo detecta. NO puede elevar la pierna extendida ni mantener la rodilla extendida contra gravedad. Escalón palpable por encima de la rótula (cuádriceps) o por debajo (rotuliano); hemartrosis; rótula alta o baja. Reparación precoz (2 primeras semanas) → mejores resultados.',
        'Luxación de rodilla y traumatismo multiligamentoso: alta energía, golpe en la cara anteromedial, lesión de salpicadero o hiperextensión. Hasta el 95 % de las lesiones del LCP vistas en urgencias son combinadas; en hemartrosis agudas por lesión ligamentosa, un 9 % tiene lesión de la EPL. Hemartrosis aguda tras alta energía: valorar función neurovascular y derivar antes de forzar la exploración.',
        'Compromiso neurovascular tras traumatismo: cambios de temperatura, adormecimiento, parestesias o debilidad tras fractura de meseta o luxación → pulsos distales, cribado neurológico e índice tobillo-brazo.',
        'Lesión del nervio peroneo común: pie caído, tropezar con el pie, parestesias y debilidad en la cara lateral de la pierna y el dorso del pie, tras esguince o luxación de la tibioperonea proximal, fractura de tibia o peroné, lesión ligamentosa o cirugía de rodilla. Marcha en steppage; fuerza de eversión y de flexión dorsal de tobillo y dedos; sensibilidad; Tinel sobre la cabeza del peroné.',
        'Lesión osteocondral inestable: chasquidos, enganches o bloqueos muy dolorosos: el fragmento bloquea físicamente el movimiento. Derrame y pérdida de rango. Derrame + tope mecánico + rango limitado → imagen (radiografía de elección) y derivación.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'ro_t1', text: '¿Tras un golpe directo, una caída sobre la rodilla o un mal aterrizaje, se le hinchó enseguida y no puede cargar el peso sobre esa pierna? (Aplicar la regla de Ottawa en el árbol: radiografía si hay algún criterio.)', alerta: true },
        { id: 'ro_t2', urgencia: 'Sospecha de rotura del aparato extensor (Ottawa no lo detecta): derivación hoy; la reparación precoz da mejores resultados.', text: '¿Tras una caída o un frenazo con la rodilla doblada, notó un chasquido y ahora no puede levantar la pierna estirada ni mantener la rodilla estirada?', alerta: true, s1: true },
        { id: 'ro_t3', urgencia: 'Sospecha de luxación o lesión multiligamentosa: valorar función neurovascular y derivar hoy, antes de forzar la exploración.', text: '¿Fue un traumatismo de alta energía (accidente, golpe contra el salpicadero o en la parte delantera e interna de la rodilla, o la rodilla se le fue hacia atrás) con la rodilla muy hinchada de inmediato?', alerta: true, s1: true },
        { id: 'ro_t4', urgencia: 'Compromiso neurovascular tras traumatismo: pulsos distales, cribado neurológico e índice tobillo-brazo; derivación médica hoy.', text: '¿Desde el traumatismo nota el pie o la pierna más fríos o más calientes, dormidos, con hormigueo o con menos fuerza?', alerta: true, s1: true },
        { id: 'ro_t5', text: '¿Arrastra la punta del pie o tropieza con ella, o tiene hormigueo o menos fuerza por fuera de la pierna y en el dorso del pie (nervio peroneo común)?', alerta: true },
        { id: 'ro_t6', text: '¿La rodilla se le bloquea y no puede estirarla o doblarla, con mucho dolor, derrame y pérdida de movilidad (posible fragmento osteocondral inestable → imagen y derivación)?', alerta: true }
      ]
    },
    {
      // Tarjeta rodilla (guía de consulta), BANDERAS «Epifisiólisis femoral
      // proximal o Perthes» y árbol, nodo 5.
      id: 'ro_pediatrico', icon: '🧒', nombre: 'Niño o Adolescente',
      banderasRojas: [
        'Epifisiólisis femoral proximal o Perthes: niño o adolescente con dolor de rodilla SIN mecanismo conocido. El patrón de dolor es constante y obliga a derivar. Cribado de cadera PRIMERO: rango activo y pasivo de la cadera ipsilateral. Solo si es normal, la rodilla es la localización primaria.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'ro_p1', text: '¿Es un niño o adolescente con dolor de rodilla sin ningún golpe ni gesto que lo explique? (Explorar primero la cadera: epifisiólisis, Perthes.)', alerta: true }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.rodilla
// Tarjeta rodilla (guía de consulta), ARBOL: nodo 1 (urgencia) va en la fase 2;
// nodos 2 y 4 → ro_step1; 3 → ro_step1b; 5 → ro_step2b; 6 → ro_step2c;
// 7 → ro_step3 (lo que ya había) y ro_step4–ro_step7 (una zona por paso).
export const tree = {
  title: 'Algoritmo CIF — Rodilla',
  steps: [
    {
      id: 'ro_step1',
      tag: 'Paso 1 — Antecedente Traumático Agudo',
      question: '¿Hubo un evento lesivo reciente con inflamación inmediata? Rodilla aguda traumática: ¿qué mecanismo cuenta?',
      options: [
        { label: 'SÍ — Sensación de "pop", derrame articular rápido e inestabilidad (posible LCA)', value: 'lca', next: null, hypothesis: ['ro4'] },
        { label: 'SÍ — Trauma rotacional con síntomas de bloqueo o chasquidos (posible Menisco)', value: 'menisco', next: null, hypothesis: ['ro2'] },
        { label: 'SÍ — Valgo con el pie fijo → LCM (mirar LCA y menisco medial)', value: 'lcm', next: null, hypothesis: ['ro8'] },
        { label: 'SÍ — Golpe en tibia anterior con rodilla flexionada (salpicadero) → LCP y EPL', value: 'lcp', next: null, hypothesis: ['ro9'] },
        { label: 'SÍ — Golpe anteromedial o varo cerca de la extensión → LLE y EPL', value: 'lle', next: null, hypothesis: ['ro10'] },
        { label: 'SÍ — La rótula «se salió», aprensión al trasladarla lateralmente → INESTABILIDAD ROTULIANA', value: 'rotula', next: null, hypothesis: ['ro12'] },
        { label: 'SÍ — Golpe directo anterior, dolor con extensión resistida, escalón palpable → FRACTURA', value: 'fractura', next: null, hypothesis: ['ro11'] },
        { label: 'NO — Dolor de inicio insidioso o crónico', value: 'no', next: 'ro_step2', hypothesis: [] }
      ]
    },
    {
      // Nodo 3. Solo se llega por las ramas traumáticas de ro_step1 (su «NO»
      // salta a ro_step2).
      id: 'ro_step1b',
      tag: 'Paso 1b — Regla de Ottawa y Aparato Extensor',
      question: '¿Algún criterio de Ottawa (≥55 años · cabeza del peroné · rótula aislada · no flexiona 90° · no carga cuatro pasos)? Y en toda rodilla traumática con dolor anterior, elevación de la pierna extendida. Alternativa a Ottawa: Pittsburgh — contusión o caída MÁS (<12 o >50 años, o no da cuatro pasos ahora); S ≈99 % con E ≈60 %, pide menos radiografías.',
      options: [
        { label: 'OTTAWA POSITIVO — DERIVAR PARA RADIOGRAFÍA antes de seguir explorando', value: 'ottawa', next: null, hypothesis: ['ro11'] },
        { label: 'NO ELEVA LA PIERNA EXTENDIDA — Aparato extensor, que Ottawa no detecta: derivar hoy', value: 'extensor', next: null, hypothesis: [] },
        { label: 'NINGUNO — Ottawa negativo y eleva la pierna extendida', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ro_step2',
      tag: 'Paso 2 — Perfil Degenerativo',
      question: '¿El paciente es mayor de 45 años con rigidez matutina breve (<30 min)?',
      options: [
        { label: 'SÍ — Edad ≥45 años, dolor relacionado con actividad, rigidez <30 minutos', value: 'si', next: null, hypothesis: ['ro1'] },
        { label: 'NO — Perfil más joven o sin patrón degenerativo', value: 'no', next: 'ro_step2b', hypothesis: [] }
      ]
    },
    {
      // Nodo 5.
      id: 'ro_step2b',
      tag: 'Paso 2b — Menor sin Mecanismo: Cadera Primero',
      question: '¿Niño o adolescente con dolor de rodilla sin mecanismo conocido? → EXPLORAR PRIMERO LA CADERA (epifisiólisis, Perthes). Solo si el cribado es normal, seguir en la rodilla.',
      options: [
        { label: 'SÍ — Cribado de cadera alterado: derivar (epifisiólisis, Perthes)', value: 'cadera_alterada', next: null, hypothesis: [] },
        { label: 'SÍ — Cribado de cadera normal: seguir en la rodilla', value: 'cadera_normal', next: null, hypothesis: [] },
        { label: 'NO — Adulto, o hay mecanismo conocido', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 6. Sin hipótesis: el origen se valora en su propia región.
      id: 'ro_step2c',
      tag: 'Paso 2c — Referido de Cadera o Columna Lumbar',
      question: '¿Reproduce el dolor de rodilla la exploración de la cadera o de la columna lumbar?',
      options: [
        { label: 'CADERA (artrosis) — Tratar el origen: valorar en la región Cadera', value: 'cadera', next: null, hypothesis: [] },
        { label: 'COLUMNA LUMBAR (radiculopatía o pseudorradiculopatía) — Tratar el origen: valorar en la región Lumbar', value: 'lumbar', next: null, hypothesis: [] },
        { label: 'NO — Ninguna de las dos reproduce el dolor de rodilla', value: 'no', next: null, hypothesis: [] }
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
        { label: 'Medial/Distal — Dolor 2 cm distal a meseta tibial medial, empeora al subir escaleras', value: 'pata', next: null, hypothesis: ['ro7'] },
        { label: 'NINGUNA de estas — Seguir por zona', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, ANTERIOR (tendinopatía rotuliana y dolor FR ya están en ro_step3).
      id: 'ro_step4',
      tag: 'Paso 4 — Dolor Anterior Persistente',
      question: 'Dolor persistente o sin traumatismo, ANTERIOR: ¿qué lo explica?',
      options: [
        { label: 'HOFFA — Recurvatum, test de Hoffa', value: 'hoffa', next: null, hypothesis: ['ro13'] },
        { label: 'BURSITIS PRERROTULIANA — Superficial, arrodillarse', value: 'bursitis', next: null, hypothesis: ['ro14'] },
        { label: 'INESTABILIDAD ROTULIANA — Fallo, aprensión', value: 'rotula', next: null, hypothesis: ['ro12'] },
        { label: 'LESIÓN OSTEOCONDRAL — Bloqueo', value: 'osteocondral', next: null, hypothesis: ['ro16'] },
        { label: 'APOFISITIS POR TRACCIÓN — En menores', value: 'apofisitis', next: null, hypothesis: ['ro15'] },
        { label: 'NINGUNO — Sin dolor anterior o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, MEDIAL (bursitis anserina ya está en ro_step3).
      id: 'ro_step5',
      tag: 'Paso 5 — Dolor Medial Persistente',
      question: 'Dolor persistente o sin traumatismo, MEDIAL: ¿qué lo explica?',
      options: [
        { label: 'MENISCO MEDIAL', value: 'menisco', next: null, hypothesis: ['ro2'] },
        { label: 'ARTROSIS — Criterios ACR', value: 'artrosis', next: null, hypothesis: ['ro1'] },
        { label: 'PLICA MEDIAL', value: 'plica', next: null, hypothesis: ['ro17'] },
        { label: 'NINGUNO — Sin dolor medial o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, LATERAL (cintilla iliotibial ya está en ro_step3).
      id: 'ro_step6',
      tag: 'Paso 6 — Dolor Lateral Persistente',
      question: 'Dolor persistente o sin traumatismo, LATERAL: ¿qué lo explica?',
      options: [
        { label: 'TIBIOPERONEA PROXIMAL', value: 'tibioperonea', next: null, hypothesis: ['ro18'] },
        { label: 'MENISCO LATERAL', value: 'menisco', next: null, hypothesis: ['ro2'] },
        { label: 'NERVIO PERONEO COMÚN', value: 'peroneo', next: null, hypothesis: ['ro19'] },
        { label: 'NINGUNO — Sin dolor lateral o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, POSTERIOR.
      id: 'ro_step7',
      tag: 'Paso 7 — Dolor Posterior Persistente',
      question: 'Dolor persistente o sin traumatismo, POSTERIOR: ¿qué lo explica? Descartada siempre la TVP.',
      options: [
        { label: 'QUISTE POPLÍTEO — Signo de Foucher', value: 'quiste', next: null, hypothesis: ['ro20'] },
        { label: 'LCP CRÓNICO', value: 'lcp', next: null, hypothesis: ['ro9'] },
        { label: 'COLUMNA LUMBAR — Tratar el origen: valorar en la región Lumbar', value: 'lumbar', next: null, hypothesis: [] },
        { label: 'NINGUNO — Sin dolor posterior o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
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
    pronostico: {
      horizonte: 'Kellgren-Lawrence u OARSI. Hasta el 43 % de los mayores de 40 no tiene síntomas. Criterios clínicos + imagen → S 0,91 · E 0,86 · LR+ 6,5 · LR− 0,10.',
      derivacion: 'Los criterios del ACR identifican mejor la artrosis avanzada: con criterios negativos en un cuadro incipiente, no descartes. La debilidad del cuádriceps es el factor modificable más potente.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Criterio combinado: Edad ≥45 + dolor en actividad + rigidez <30 min', sn: '95%', sp: '69%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad — útil para descartar. Si los tres criterios presentes: alta probabilidad diagnóstica.' },
      { name: 'Crepitación articular', sn: '89%', sp: '60%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad pero poco específica. Crepitación al movimiento pasivo de la rodilla.' },
      { name: 'Agrandamiento óseo', sn: '55%', sp: '95%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Osteofitos palpables en los márgenes articulares.' },
      { name: 'Restricción de ROM', sn: '17%', sp: '96%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad cuando está presente.' },
      { name: 'Criterios clínicos del ACR', sn: '95%', sp: '69%', lr_pos: null, lr_neg: null, absorbe: [0, 1, 2], criterio: 'Dolor de rodilla la mayoría de los días del mes previo MÁS al menos 3 de — edad >50, rigidez <30 min, crepitación, dolor óseo a la palpación, aumento de tamaño óseo, sin calor palpable → S 0,95 · E 0,69 · LR+ 3,06 · LR− 0,07. El artículo no publica LR: se calculan de S/E. Son criterios de clasificación, estudiados frente a 107 pacientes con dolor de rodilla de otro origen (55 con artritis reumatoide). Si puntúa, el criterio combinado, la crepitación y el agrandamiento óseo no suman aparte.', fuente: 'Altman 1986 (Arthritis Rheum; criterios clínicos del ACR, 130 con artrosis frente a 107 controles)' },
      { name: 'Rango disminuido, hinchazón persistente, debilidad de cuádriceps', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rango disminuido, hinchazón persistente, debilidad de cuádriceps.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Subir o bajar un escalón, o levantarse de la silla → EVA. ② Sit-to-stand de 30 s con silla, brazos y apoyo fijos; o flexión en supino con goniómetro.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro2: {
    id: 'ro2', region: 'rodilla', num: '②',
    name: 'Lesión Meniscal',
    prom: 'KOOS (MCID: 7–36 pts según subescala)',
    dosis: 'Isométricos de cuádriceps en extensión completa: contracciones 6 seg, 2 series × 8 rep. Movilización activa en descarga (decúbito supino, flexo-extensión 0-60° si tolerado, 10 rep lentas). Evitar rotación tibial y carga en flexión profunda.',
    pronostico: {
      horizonte: 'RM o artroscopia. En roturas degenerativas, la meniscectomía parcial NO ha demostrado más beneficio que la fisioterapia.',
      derivacion: 'Tras lesión meniscal, el riesgo de artrosis es 7 veces mayor. Solo el 30 % periférico está vascularizado, y disminuye con la edad. Jóvenes: mejores candidatos a reparación.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de McMurray', sn: '61%', sp: '84%', lr_pos: null, lr_neg: null, criterio: 'Rotación tibial + extensión de rodilla desde posición de flexión completa. Positivo: chasquido o dolor en línea articular.' },
      { name: 'Sensibilidad a la palpación de la línea articular', sn: '83%', sp: '83%', lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación directa de la línea articular medial o lateral. Alta Sn y Sp.' },
      { name: 'Combinación de tests clínicos', sn: null, sp: null, lr_pos: '2.7', lr_neg: '0.4', criterio: 'La combinación de múltiples tests mejora la precisión diagnóstica respecto a cada test individual.' },
      { name: 'Combinación traumática: traumatismo + dolor medial o difuso + palpación de la interlínea medial', sn: '91%', sp: '90%', lr_pos: '8.9', lr_neg: '0.10', absorbe: [1], criterio: 'Historia de caída o pivote en el traumatismo inicial + dolor medial aislado o difuso + palpación dolorosa de la interlínea medial → S 0,91 · E 0,90 · LR+ 8,9 (IC 6,1–13,1) · LR− 0,10 (IC 0,03–0,28). Grupo derivado sin validación externa (validación interna por bootstrap: LR+ 7,0, LR− 0,19). Si puntúa, la palpación de la interlínea no suma aparte.', fuente: 'Décary 2018 (PM&R; n = 279, 35 roturas traumáticas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Combinación degenerativa: inicio progresivo + dolor medial aislado + uno de tres', sn: null, sp: null, lr_pos: '6.4', lr_neg: null, criterio: 'Inicio progresivo + dolor medial aislado + dolor al pivotar (leve a grave), o bien inicio progresivo + dolor medial aislado + sin valgo ni varo o flexión pasiva completa → S 0,58 · E 0,91 · LR+ 6,4 (IC 4,0–10,4). Sirve para confirmar, no para descartar: la LR− 0,10 del artículo es de otros grupos de reglas (de descarte), no de este. Grupo derivado sin validación externa (bootstrap: LR+ 5,6).', fuente: 'Décary 2018 (PM&R; n = 279, 45 roturas degenerativas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión máxima con sobrepresión o cuclilla parcial → EVA. ② Grados de flexión hasta la aparición del dolor, en supino con la cadera a 90°.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro3: {
    id: 'ro3', region: 'rodilla', num: '③',
    name: 'Dolor Patelofemoral (Síndrome)',
    prom: 'KOOS-PF / Kujala / VISA-P',
    dosis: 'Activación de glúteo medio en decúbito lateral: elevación isométrica 5 seg, 2 series × 8 rep. Isométricos de cuádriceps en extensión completa: 6 seg, 2 series × 10 rep. Mini-sentadillas 0-30° a velocidad lenta 3-1-3 seg, 2 series × 10 rep. Evitar flexión >60° el primer día. Considerar taping rotuliano (McConnell).',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la imagen solo sirve para descartar otras condiciones.',
      derivacion: 'Patogenia multifactorial. Se han descrito hiperalgesia generalizada y peor modulación del dolor: el modelo mecánico no lo explica todo.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor anterior durante sentadilla', sn: '91%', sp: '50%', lr_pos: null, lr_neg: null, criterio: 'Alta sensibilidad. Dolor retrorrotuliano o perirotuliano durante la sentadilla.' },
      { name: 'Cluster diagnóstico: edad + localización + escaleras + palpación facetas + ROM extensión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La combinación de los 5 criterios mejora significativamente la precisión diagnóstica.' },
      { name: 'Palpación alrededor de la FR, sobre todo de las facetas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La sentadilla es el test clínico propuesto; progresar la carga según irritabilidad: monopodal, step-down o más repeticiones. Palpación alrededor de la FR, sobre todo de las facetas.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Sentadilla bilateral o monopodal, o bajada de escalón, hasta donde tolere → EVA. ② Step-down desde escalón de altura fija: repeticiones en 30 s sin aumentar el dolor, o grados de flexión sin dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro4: {
    id: 'ro4', region: 'rodilla', num: '④',
    name: 'Lesión del Ligamento Cruzado Anterior (LCA)',
    prom: 'KOOS / IKDC (MCID: 12.2 pts)',
    dosis: 'Co-contracciones isométricas de cuádriceps e isquiotibiales en extensión completa: 6 seg, 2 series × 8 rep. Elevación de pierna recta con rodilla en extensión completa: 2 series × 10 rep. Movilización activa-asistida 0-90° en descarga. Evitar traslación anterior de tibia. Muletas según necesidad.',
    pronostico: {
      horizonte: 'RM o artroscopia como patrón de referencia. El tratamiento no quirúrgico obtiene buenos resultados, pero casi el 75 % opta por la reconstrucción.',
      derivacion: 'Riesgo alto de nueva lesión los dos primeros años tras la reconstrucción, y mayor en quienes vuelven al deporte con déficits.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Lachman', sn: '81–87%', sp: '85–97%', lr_pos: null, lr_neg: null, criterio: 'Primera elección. Rodilla en 30° de flexión, traslación anterior de tibia con estabilización distal del fémur. Positivo: traslación anterior aumentada o sin punto firme.' },
      { name: 'Test de Cajón Anterior', sn: '64–83%', sp: '85–87%', lr_pos: null, lr_neg: null, criterio: 'Rodilla a 90° de flexión. Traslación anterior de tibia. Menos sensible que Lachman pero útil.' },
      { name: 'Test de Pivot Shift', sn: '55–59%', sp: '94–97%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad. Roto-subluxación de la tibia con extensión + valgo + rotación interna. Mejor bajo anestesia.' },
      { name: 'Lever Sign Test', sn: '79–83%', sp: '91–92%', lr_pos: null, lr_neg: null, criterio: 'Puño debajo de la rodilla — si el LCA está roto, el talón no se eleva.' },
      { name: 'Confirmar: mecanismo de pivote + derrame inmediato + Lachman positivo', sn: null, sp: null, lr_pos: '17.5', lr_neg: null, absorbe: [0], criterio: 'Mecanismo de pivote + derrame inmediato tras el traumatismo + Lachman positivo → rotura COMPLETA: S 0,82 · E 0,95 · LR+ 17,5 (IC 9,8–31,5; bootstrap 12,4). No publica LR−: sirve para confirmar. Si puntúa, el Lachman no suma aparte.', fuente: 'Décary 2018 (PLoS One; n = 279, 22 roturas completas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Descartar: sin mecanismo de pivote ni chasquido + Lachman o pivot shift negativos (si se cumple, marcar «Negativo»)', sn: null, sp: null, lr_pos: null, lr_neg: '0.08', absorbe: [0, 2], criterio: 'Historia negativa de pivote o de chasquido en el traumatismo Y Lachman o pivot shift negativos → descarta rotura parcial o completa: S 0,93 · E 0,87 · LR− 0,08 (IC 0,03–0,24; bootstrap 0,11). No publica LR+: un resultado positivo es solo un hallazgo. Si puntúa, el Lachman y el pivot shift no suman aparte.', fuente: 'Décary 2018 (PLoS One; n = 279, 43 roturas parciales o completas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Apoyo monopodal o bajada de un escalón → EVA. Si predomina la inestabilidad, anotar episodios de fallo por semana. ② Déficit de extensión activa frente al lado sano, en supino con el talón sobre una toalla (grados).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro5: {
    id: 'ro5', region: 'rodilla', num: '⑤',
    name: 'Tendinopatía Rotuliana',
    prom: 'VISA-P / KOOS',
    dosis: 'Contracciones isométricas de cuádriceps a 60° de flexión: 5 series × 45 seg con descanso 2 min entre series, intensidad submáxima (sin dolor >3/10). Evitar ejercicios pliométricos y carga excéntrica en fase inicial.',
    pronostico: {
      horizonte: 'Ecografía o RM. La alteración del tendón en imagen NO se correlaciona de forma constante con el dolor ni con la pérdida de función.',
      derivacion: 'Si los síntomas aparecen antes y tardan más en irse, ser más prudente al progresar. VISA-P como cuestionario, aparte de los tres números.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor localizado en polo inferior de rótula + palpación del tendón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diagnóstico principalmente clínico. Dolor exquisito a la palpación del polo inferior rotuliano.' },
      { name: 'Dolor durante sentadilla en tabla inclinada (decline squat)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Test específico para tendinopatía rotuliana. Más sensible que sentadilla plana.' },
      { name: 'Ecografía (Sn 87%, Sp 82%) o RMN', sn: '87%', sp: '82%', lr_pos: null, lr_neg: null, criterio: 'Imagen confirmatoria si no hay respuesta al tratamiento. Engrosamientos y cambios de señal en el tendón.' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Sentadilla monopodal sobre plano inclinado (o el escalón que tolere) → EVA. ② Repeticiones de sentadilla monopodal, mismo plano y cadencia, hasta el umbral de dolor; o grados de flexión antes del dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro6: {
    id: 'ro6', region: 'rodilla', num: '⑥',
    name: 'Síndrome de la Banda Iliotibial',
    prom: 'KOOS / LEFS (MCID: 8.4–22.5 pts)',
    dosis: 'Activación de glúteo medio en decúbito lateral sin abducción completa: isométrica 5 seg, 2 series × 8 rep, ROM limitado a 15° de abducción. Estiramiento suave de BIT en decúbito lateral 20 seg, 3 rep. Evitar flexo-extensión repetitiva en rango 20-30°.',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la entrevista y la exploración completas suelen bastar. Las pruebas complementarias sirven para confirmar o descartar otras condiciones.',
      derivacion: 'La explicación clásica (fricción de la cintilla sobre el epicóndilo lateral) ha sido cuestionada: los estudios anatómicos apuntan a compresión contra el cuerpo graso muy inervado que hay debajo.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Ober', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Decúbito lateral, cadera en abducción-extensión, rodilla 90°. Positivo si la rodilla no alcanza la camilla o hay dolor.' },
      { name: 'Test de Compresión de Noble', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Compresión de la BIT sobre el cóndilo femoral lateral a 30° de flexión. Positivo si reproduce el dolor característico.' },
      { name: 'Palpación a lo largo de la cintilla', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor localizado a la palpación a lo largo de la cintilla, sobre todo cerca del epicóndilo lateral y sobre el tubérculo de Gerdy.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Step-down lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dificultad o Trendelenburg.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Step-down lateral, o la carrera o pedaleo reproducidos en consulta → EVA. ② Repeticiones de step-down lateral con altura fija hasta el umbral de dolor; o minutos de carrera hasta el dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro7: {
    id: 'ro7', region: 'rodilla', num: '⑦',
    name: 'Bursitis de la Pata de Ganso',
    prom: 'KOOS / EVA (MCID: 22.6 pts en escala 0-100)',
    dosis: 'Isométricos de isquiotibiales en decúbito prono con rodilla en extensión completa: 5 seg, 2 series × 8 rep (submáximos). Movilización activa 0-60° en decúbito supino, 10 rep lentas. Evitar flexión resistida y estiramiento agresivo de isquiotibiales mediales. Hielo local 10-15 min post-ejercicio.',
    tests: [
      { name: 'Dolor y tumefacción en cara medial de rodilla (inserción pata de ganso)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a 2 cm distal a la meseta tibial medial. Diagnóstico clínico. Datos de fiabilidad diagnóstica limitados/ausentes.', noData: true },
      { name: 'Ecografía o RMN confirmatoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Prevalencia del 20% en pacientes con artrosis sintomática de rodilla. Más común en mujeres y edad avanzada.', noData: true },
      { name: 'Flexión de rodilla en carga y palpación de la pata de ganso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor reproducido con la flexión de rodilla EN CARGA y con la palpación de la pata de ganso (cara medial superior de la tibia).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión de rodilla en carga (bajar un escalón) o palpación de la pata de ganso → EVA. ② Repeticiones de subida y bajada de un escalón de altura fija hasta el umbral de dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  // ─── Tarjeta de consulta rodilla (guía de consulta): SINDROMES sin hipótesis
  // (ro8–ro16) y entidades de la ORIENTATIVA (ro17–ro20). Sin dosis en la guía.
  ro8: {
    id: 'ro8', region: 'rodilla', num: '⑧',
    name: 'Lesión del Ligamento Colateral Medial (LCM)',
    prom: 'IKDC subjetivo',
    dosis: '',
    pronostico: {
      horizonte: 'RM como patrón de referencia.',
      derivacion: 'La lesión aislada se maneja sin cirugía, con vuelta a la actividad en 2–5 semanas.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Valgo forzado a 30° de flexión + mecanismo de la entrevista', sn: '56%', sp: '91%', lr_pos: '6.4', lr_neg: '0.5', criterio: 'Valgo forzado a 30° de flexión. Combinar el mecanismo de la entrevista (al menos uno de: traumatismo por fuerza externa sobre la pierna, traumatismo en rotación) con dolor Y laxitud en el test → S 0,56 · E 0,91 · LR+ 6,4 (IC 2,7–15,2) · LR− 0,5 (IC 0,3–0,8). Atención primaria, 18–65 años, dentro de las 5 semanas del traumatismo.', fuente: 'Kastelein 2008 (Am J Med; n = 134, 35 con lesión del LCM; referencia: RM)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Valgo forzado a 30°, o el gesto de apoyo o giro que reproduce el dolor → EVA. ② Arco de flexión activa indoloro, con goniómetro en supino con la cadera a 0°.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro9: {
    id: 'ro9', region: 'rodilla', num: '⑨',
    name: 'Lesión del Ligamento Cruzado Posterior (LCP)',
    prom: 'IKDC subjetivo',
    dosis: '',
    pronostico: {
      horizonte: 'RM de elección. En urgencias, el 95 % de las lesiones del LCP son combinadas.',
      derivacion: 'Las lesiones de LCP grado III se asocian a lesión de la EPL. Siempre que se sospeche LLE, explorar la EPL, y al revés.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Cajón posterior a 90° de flexión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Carga tibial posterior comparando con la rodilla sana. Grados: I <5 mm · II 5–10 mm · III >10 mm.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Signo del sag posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino, rodillas a 90° y pies apoyados; hundimiento de la tibia proximal visto de lado.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Arrodillarse o bajar un escalón → EVA. ② Grados de flexión activa tolerados sin dolor, en sedestación al borde de la camilla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro10: {
    id: 'ro10', region: 'rodilla', num: '⑩',
    name: 'Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL)',
    prom: 'IKDC subjetivo',
    dosis: '',
    pronostico: {
      horizonte: 'RM de elección. En urgencias, el 95 % de las lesiones del LCP son combinadas.',
      derivacion: 'Las lesiones de LCP grado III se asocian a lesión de la EPL. Siempre que se sospeche LLE, explorar la EPL, y al revés. NO usar el varo forzado como prueba de descarte: S 25 %, sin E publicada. Un test negativo no descarta la lesión de LLE/EPL.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Hinchazón y equimosis laterales; palpación dolorosa del ligamento', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y equimosis laterales en fase aguda; palpación dolorosa del ligamento.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Varo forzado a unos 30° de flexión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Laxitud y pérdida del tope firme; repetir a 0° para valorar el LCA. NO usar como prueba de descarte: S 25 %, sin E publicada; un test negativo no descarta la lesión de LLE/EPL.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Marcha con empuje en varo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observación de la marcha.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Varo forzado a 30° o el gesto en carga que provoca el fallo → EVA. ② Tiempo de apoyo monopodal tolerado sin dolor ni fallo, descalzo y sin apoyo de manos.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro11: {
    id: 'ro11', region: 'rodilla', num: '⑪',
    name: 'Fracturas (Rótula o Meseta Tibial)',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'Rótula: radiografía AP y lateral; TC en conminutas. Meseta: radiografía primero, TC para clasificar, RM si se sospecha lesión meniscal o ligamentosa.',
      derivacion: 'El dolor y el derrame limitan la exploración: no forzar. Ante déficit neurovascular, urgencia.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Regla de Ottawa antes de nada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En fase aguda no procede explorar más: derivar. Radiografía si hay ALGUNO de los cinco: ≥55 años · dolor a la palpación de la cabeza del peroné · dolor aislado a la palpación de la rótula · no flexiona hasta 90° · no carga cuatro pasos. S 98–100 %, E ≈50 %: sirve para descartar, no para confirmar.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Rótula: dolor localizado, escalón, dolor con extensión resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor localizado, posible escalón, dolor con extensión resistida, marcha con rodilla rígida.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Meseta: dolor exquisito sobre el foco y función neurovascular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchada y enrojecida, dolor exquisito sobre el foco, rango limitado, cojera marcada; valorar SIEMPRE la función neurovascular.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① No procede en fase aguda: derivar. Tras el alta traumatológica, el gesto que reproduce el dolor → EVA. ② Tras el alta: déficit de extensión activa frente al lado sano (grados), o tiempo de apoyo monopodal.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro12: {
    id: 'ro12', region: 'rodilla', num: '⑫',
    name: 'Inestabilidad Rotuliana',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'La entrevista y la exploración completas bastan para el diagnóstico. La imagen sirve para identificar factores predisponentes (ángulo Q aumentado, rótula alta, tróclea displásica) o para descartar fracturas y lesiones osteocondrales; el ligamento femororrotuliano medial se ve en RM.',
      derivacion: 'La displasia troclear dificulta la contención de la rótula; laxitud ligamentosa y desequilibrio de tejidos blandos alteran la línea de tracción. Con el ligamento femororrotuliano medial dañado, la cintilla iliotibial tiende a llevar la rótula hacia lateral en la flexión.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tests de estrés tibiofemoral normales', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si hay traumatismo, diferenciar de la inestabilidad tibiofemoral: los test de estrés tibiofemoral deben ser normales.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Movilidad rotuliana excesiva', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La movilidad rotuliana estará aumentada en al menos una dirección. Movilidad excesiva: el borde medial de la rótula llega al borde lateral del surco troclear.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Test de aprensión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aprensión al trasladar la rótula lateralmente.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto que provoca la aprensión o el fallo → EVA; si no hay dolor, episodios de fallo por semana. ② Fuerza de extensión frente al lado sano, en sedestación a 60° de flexión, siempre con la misma prueba.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro13: {
    id: 'ro13', region: 'rodilla', num: '⑬',
    name: 'Síndrome de la Grasa de Hoffa',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'RM: edema, sangrado y fibrosis en el cuerpo graso en fases iniciales; en casos avanzados, metaplasia osteocondral en radiografía o TC.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Observación: genu recurvatum', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Suelen estar de pie en hiperextensión (genu recurvatum).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Test de Hoffa', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rodilla pasiva entre 30 y 60°, presión firme sobre el cuerpo graso bajo la rótula, medial o lateral al tendón, y llevar pasivamente a extensión final. Positivo si reproduce el dolor familiar. Repetir al otro lado del tendón.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Contracción isométrica del cuádriceps en extensión completa, o el test de Hoffa → EVA. ② Grados de extensión pasiva tolerados sin dolor, en supino con el talón elevado sobre una toalla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro14: {
    id: 'ro14', region: 'rodilla', num: '⑭',
    name: 'Bursitis Pre e Infrarrotuliana',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'El diagnóstico clínico suele bastar. Ecografía o RM si hace falta diferenciar séptica de aséptica o descartar otras condiciones: líquido aumentado y engrosamiento de la bursa; la infiltración guiada por ecografía puede ser diagnóstica y terapéutica.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Fiebre >37,7 °C (séptica → urgencia)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PRIMERO diferenciar séptica de aséptica: la fiebre >37,7 °C solo se ha descrito en la séptica → urgencia (fase 2).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Hinchazón en la propia bursa y arrodillarse intolerable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aséptica: dolor localizado, hinchazón EN LA PROPIA BURSA (no difusa), dolor con flexión activa y pasiva, arrodillarse intolerable. Integridad articular normal.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Apoyar la rodilla en el suelo, o la flexión activa máxima → EVA. ② Grados de flexión activa hasta la aparición del dolor, en sedestación al borde de la camilla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro15: {
    id: 'ro15', region: 'rodilla', num: '⑮',
    name: 'Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson)',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'La exploración suele bastar; radiografía si hace falta, y ayuda a descartar fractura aguda y tumor.',
      derivacion: 'El Sinding-Larsen-Johansson es generalmente autolimitado. Entrenar en otras modalidades o en piscina reduce intensidad y duración.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Cadera primero', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PRIMERO la cadera (epifisiólisis, Perthes: paso 2b).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Palpación de la tuberosidad tibial o del polo inferior de la rótula', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tuberosidad tibial dolorosa y visiblemente aumentada (Osgood-Schlatter), o polo inferior de la rótula doloroso sin dolor a lo largo del tendón (Sinding-Larsen).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Sentadillas, escaleras, step-down, saltos y extensión resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentadillas, escaleras, step-down y saltos dolorosos. Extensión resistida dolorosa y débil.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Bajada de escalón o sentadilla monopodal → EVA. ② Fuerza de extensión resistida en sedestación a 60° frente al lado sano, o repeticiones de step-down con altura fija.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro16: {
    id: 'ro16', region: 'rodilla', num: '⑯',
    name: 'Lesión Osteocondral',
    prom: 'IKDC subjetivo',
    dosis: '',
    tests: [
      { name: 'Palpación de la zona afectada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Depende de la estabilidad. Dolor a la palpación de la articulación en la zona afectada.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Marcha antiálgica', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Marcha antiálgica con menos flexión en la respuesta de carga.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Signos de inestabilidad: derrame y bloqueo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si es inestable: derrame y signos mecánicos de bloqueo con rango disminuido → imagen (radiografía de elección) y derivación.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Cuclilla o el gesto de impacto que reproduce el dolor → EVA. ② Grados de flexión activa en supino hasta el dolor o el tope mecánico.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro17: {
    id: 'ro17', region: 'rodilla', num: '⑰',
    name: 'Plica Sinovial Medial',
    prom: 'KOOS-12',
    dosis: '',
    tests: [
      { name: 'Test de provocación de la plica rotuliana medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Es la mejor forma de diagnosticarlo en consulta. Técnica (test MPP): supino, rodilla extendida; presión con el pulgar sobre la porción inferomedial de la femororrotuliana y, manteniéndola, flexionar a 90°. Positivo: dolor en extensión que desaparece o disminuye mucho a 90°; comparar con el otro lado. Kim 2007 da S 89,5 % · E 88,7 % frente a artroscopia (la tarjeta redondea a S 0,90 · E 0,89 · LR+ 8,18 · LR− 0,11), pero no puntúa: toda la especificidad sale de los controles con dolor en la interlínea lateral. En el grupo con dolor anteromedial, las 13 rodillas sin plica patológica (7 pinzamientos de franjas sinoviales de la grasa de Hoffa, 5 sinovitis localizadas, 1 lesión de cartílago) dieron el test positivo: E 0 de 13 en el diagnóstico diferencial real. Además, nivel III, no consecutivos y test hecho por su autor sin cegamiento. Cuenta como hallazgo compatible.', fuente: 'Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El test de provocación de la plica, o la flexión repetida que reproduce el chasquido → EVA. ② Grados de flexión activa hasta el dolor o el enganche, en sedestación al borde de la camilla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro18: {
    id: 'ro18', region: 'rodilla', num: '⑱',
    name: 'Disfunción de la Articulación Tibioperonea Proximal',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía de rodilla en AP y lateral para valorar la patología articular. TC si la radiografía no aclara el diagnóstico.',
      derivacion: 'La articulación puede ser continua con la tibiofemoral: una presión elevada afecta a las dos. Entre sus causas, además de artrosis e inestabilidad, hay otras condiciones patológicas graves.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Presión directa sobre la cabeza del peroné y movilidad accesoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor lateral que aumenta con la presión directa sobre la cabeza del peroné o con la movilidad accesoria.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Movimiento de rodilla con isquiotibiales en tensión y movimiento de tobillo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movimiento de rodilla doloroso sobre todo con los isquiotibiales en tensión, y movimiento de tobillo doloroso.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Cabeza del peroné prominente, hipermovilidad o luxación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cabeza del peroné prominente; hipermovilidad o luxación franca.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Presión directa sobre la cabeza del peroné, o el gesto en carga que reproduce el dolor → EVA. ② Grados de flexión activa en prono hasta el dolor, y flexión dorsal de tobillo frente al lado sano.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro19: {
    id: 'ro19', region: 'rodilla', num: '⑲',
    name: 'Neuropatía del Nervio Peroneo Común',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'Conducción nerviosa y EMG confirman el diagnóstico y ayudan a establecer el pronóstico. Ecografía útil por lo superficial del nervio.',
      derivacion: 'Neurapraxia: pronóstico excelente. Axonotmesis: recuperación parcial o completa. Neurotmesis: mínima. A partir de 4 semanas de compresión aparecen inflamación y cicatriz que enlentecen más la conducción.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Marcha en steppage', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observación de la marcha.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Sensibilidad en la cara lateral inferior de la pierna y el dorso del pie', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sensibilidad alterada en la cara lateral inferior de la pierna y el dorso del pie.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Fuerza de eversión y de flexión dorsal de tobillo y dedos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Debilidad de eversión y de flexión dorsal de tobillo y dedos.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Tinel cerca de la cabeza del peroné', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel o dolor a la palpación cerca de la cabeza del peroné.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Si hay dolor, la posición o prueba que lo reproduce (cruzar las piernas, cuclillas, neurodinámica) → EVA. ② Fuerza de flexión dorsal frente al lado sano, misma posición; o repeticiones de elevación del antepié en bipedestación.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro20: {
    id: 'ro20', region: 'rodilla', num: '⑳',
    name: 'Quiste Poplíteo (Baker)',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'RM de referencia; ecografía como primera opción, sobre todo para diferenciarlo de una TVP. Se encuentra en el 38 % de las RM de rodillas sintomáticas.',
      derivacion: 'El 94 % en adultos se asocia a un trastorno intraarticular: no es un diagnóstico de exclusión. Ante duda con tromboflebitis, derivar.',
      fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)'
    },
    tests: [
      { name: 'Signos de patología meniscal o condral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La exploración suele mostrar signos de patología meniscal o condral. Descartada siempre la TVP.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Signo de Foucher', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si es palpable: firme en extensión completa y blando con la rodilla flexionada.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Extensión final de rodilla o flexión máxima → EVA. ② Grados de flexión activa en prono hasta el tope o el dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
};
