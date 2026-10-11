// ============================================================
// Formulario previo a la primera visita · CARA 2 · CODO
// guia-de-consulta no tiene formulario de codo (ni tarjeta): esta cara se
// diseñó en PhysiQ (2026-10, aprobada por el usuario) a partir de Lluch 2020,
// cap. 3.2 (Coombes y Bisset, pp. 81–103), leído entero en la sesión. Cada
// pregunta lleva encima la página del capítulo que la respalda.
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF codo (data/codo.js): se muestran como recordatorio en
// ese paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// No se repite lo que ya pregunta la cara 1 (inicio, evolución, dolor
// nocturno, actividades limitadas, tratamientos, enfermedades) ni la fase 2
// (deformidad o mano fría tras un traumatismo: co_t1/co_t2, con urgencia).
// Los anabolizantes (p. 84: preguntarlos ante sospecha de rotura del bíceps o
// del tríceps) se dejan fuera a propósito: es un dato delicado que llegaría al
// informe con IA; se pregunta en persona (decisión del usuario, 2026-10).
// ============================================================
const NS = 'No sabría decir';
const SNNS = ['Sí', 'No', NS];
const SNN = ['Sí', 'No', 'No sé'];
const MATRIZ_AYUDA = 'En cada línea, marque Sí o No. Si duda, marque «No sé».';

const MECANISMOS = [
  'Me caí apoyando la mano con el brazo estirado',
  'Me di un golpe directo en el codo',
  'Se me salió el codo de su sitio y me lo tuvieron que colocar',
  'Hice un esfuerzo brusco con el brazo (levantar, frenar o empujar algo pesado)',
  'Al lanzar con fuerza noté de golpe un dolor por dentro del codo',
  'Un tirón fuerte del brazo estirado (p. ej., al levantar a un niño pequeño de la mano)'
];
const LANZAR = 'Lanzar (béisbol, balonmano, jabalina, voleibol…)';

export default {
  id: 'codo',
  titulo: 'Sobre su codo en concreto',
  intro: 'Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».',
  secciones: [
    {
      titulo: 'Si empezó con una caída, un golpe o un esfuerzo',
      intro: 'Si en la hoja 1 contestó que NO hubo nada concreto que lo desencadenara, salte este apartado.',
      items: [
        // Caída sobre la mano: fracturas, luxaciones (p. 81, 93) e IRPL con el antebrazo en
        // supinación (p. 87). Golpe: «knock to the elbow» (p. 82), «direct blow» (p. 84).
        // Luxación previa → IRPL (p. 87). Contracción brusca → rotura del bíceps o del
        // tríceps (p. 83). Lanzamiento: LCC «acute on chronic» (p. 85). Tirón del brazo
        // extendido en menores de 5 años (p. 94).
        { id: 'que_paso', tipo: 'multi', ia: 'historia', informe: 'Cómo se lesionó', texto: '¿Qué pasó? (puede marcar varias)',
          opciones: [...MECANISMOS, 'Ninguna de estas', NS] },
        // «A sensation of a pop followed by local bruising» (p. 85).
        { id: 'chasquido', tipo: 'unica', ia: 'historia', informe: 'Chasquido al lesionarse', texto: 'En ese momento, ¿notó un chasquido o un tirón, y después le salió un moratón?',
          opciones: SNNS, mostrarSi: { id: 'que_paso', valores: MECANISMOS } },
        // «Duration of immobilisation and any prior therapy» (p. 90); rigidez tras una
        // inmovilización prolongada (pp. 82 y 89). Sin corte de semanas: el capítulo no lo da.
        { id: 'inmovilizado', tipo: 'unica', ia: 'historia', informe: 'Inmovilización tras la lesión', texto: 'Después de esa lesión, ¿le inmovilizaron el brazo (escayola, férula, cabestrillo)?',
          opciones: ['No', 'Sí', NS], detalle: { opcion: 'Sí', etiqueta: '¿Cuánto tiempo?' },
          mostrarSi: { id: 'que_paso', valores: MECANISMOS } }
      ]
    },
    {
      titulo: 'Dónde le duele',
      items: [
        // Tablas 1–4 del capítulo, una por zona (pp. 100–103); «dorsal forearm» (tabla 1).
        { id: 'zona', tipo: 'multi', ia: 'sintomas', texto: '¿Dónde le duele sobre todo? (puede marcar varias)',
          opciones: ['Por fuera del codo, del lado del pulgar', 'Por dentro, del lado del meñique', 'Por delante, en el pliegue del codo',
            'Por detrás, en la punta del codo', 'Por el dorso del antebrazo, más abajo del codo', 'En todo el codo, sin un punto concreto', NS] }
      ]
    },
    {
      titulo: 'Qué le provoca el dolor',
      items: [
        // Agarrar, levantar con el antebrazo en pronación, pomos, botes, dar la mano (p. 83;
        // tabla 2). Extensión terminal (p. 88; tabla 4). Final del recorrido en el codo
        // rígido (p. 90). Levantarse de una silla y la bolsa de la compra (p. 87). Apoyar el
        // codo comprime el cubital (p. 91).
        { id: 'provoca', tipo: 'matriz', ia: 'actividades', texto: '¿Le aparece o le aumenta el dolor al…?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'agarrar', texto: 'Agarrar o apretar algo con fuerza (dar la mano, abrir un bote)' },
            { id: 'levantar', texto: 'Levantar algo con la palma hacia abajo (una taza, una sartén)' },
            { id: 'girar', texto: 'Girar el pomo de una puerta, una llave o un destornillador' },
            { id: 'estirar', texto: 'Estirar el codo del todo' },
            { id: 'doblar', texto: 'Doblar el codo del todo' },
            { id: 'levantarse', texto: 'Apoyarse en las manos para levantarse de una silla' },
            { id: 'bolsa', texto: 'Llevar una bolsa de la compra colgando' },
            { id: 'apoyar_codo', texto: 'Apoyar el codo (en la mesa, el reposabrazos o el manillar de la bici)' }
          ] }
      ]
    },
    {
      titulo: 'Lo que nota en el codo',
      items: [
        // Rigidez, bloqueo, chasquido, inestabilidad (p. 82, 87, 88); parestesias del 5.º
        // dedo (tabla 2; p. 91) y del 1.º al 3.º (tabla 3); torpeza de la mano (p. 86, 91) y
        // debilidad de los dedos del interóseo posterior (tabla 1).
        { id: 'nota', tipo: 'matriz', ia: 'sintomas', texto: '¿Nota alguna de estas cosas?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'rigido', texto: 'No consigue estirar o doblar el codo del todo' },
            { id: 'hormigueo_menique', texto: 'Hormigueo o se le duerme el meñique', iaTexto: 'Parestesias en el 5.º dedo' },
            { id: 'hormigueo_pulgar', texto: 'Hormigueo en el pulgar, el índice o el corazón', iaTexto: 'Parestesias del 1.º al 3.º dedo' },
            { id: 'torpeza', texto: 'Torpeza o falta de fuerza en la mano, o le cuesta estirar los dedos' },
            { id: 'chasquido_codo', texto: 'Un chasquido o un enganchón, o que el codo se bloquea' },
            { id: 'falla', texto: 'Que el codo falla o da inseguridad, como si se fuera a salir', iaTexto: 'Sensación de fallo o inestabilidad del codo' }
          ] }
      ]
    },
    {
      titulo: 'Otras cosas que nos ayudan',
      items: [
        // Cuello u hombro e infiltraciones previas (p. 83); diabetes y neuropatías (p. 90);
        // artropatía inflamatoria (p. 90) y artritis reumatoide (p. 88).
        { id: 'antecedentes', tipo: 'matriz', ia: 'contexto', texto: '¿Tiene o ha tenido…?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'cuello_hombro', texto: 'Problemas de cuello o de hombro en ese mismo lado' },
            { id: 'infiltracion', texto: 'Infiltraciones en el codo' },
            { id: 'diabetes', texto: 'Diabetes o el azúcar alto' },
            { id: 'reuma', texto: 'Artritis reumatoide u otra enfermedad reumática' }
          ] }
      ]
    },
    {
      titulo: 'Trabajo, deporte y ejercicio',
      items: [
        // Movimientos repetidos, herramientas que vibran, actividades de fuerza (p. 82);
        // trabajo manual y tenis (tabla 1); golf, remo, esquí acuático (tabla 2; p. 84);
        // lanzadores (p. 85); culturistas, bici de montaña y gimnasia (p. 84).
        { id: 'actividades', tipo: 'multi', ia: 'contexto', texto: 'En el trabajo o en su tiempo libre, ¿hace a menudo alguna de estas cosas? (puede marcar varias)',
          opciones: ['Trabajo manual: agarrar, cargar o usar herramientas con fuerza', 'Usar herramientas que vibran', 'Deportes de raqueta', 'Golf',
            LANZAR, 'Pesas o culturismo', 'Bici de montaña o gimnasia', 'Remo o esquí acuático', 'Ninguna', NS] },
        { id: 'deporte', tipo: 'texto', ia: 'contexto', texto: '¿Qué deporte o ejercicio hace?',
          ayuda: 'Si NO hace deporte ni ejercicio de forma habitual, deje en blanco esta pregunta y la siguiente', lineas: 1,
          chips: ['Pádel', 'Tenis', 'Golf', 'Gimnasio', 'Balonmano', 'Escalada'] },
        // Cambios de material (raqueta, cordaje) o de trabajo manual (herramientas, horas)
        // (p. 83); aumento brusco de la actividad (p. 84); entrenamiento y material (pp. 85 y 94).
        { id: 'cambios', tipo: 'multi', ia: 'contexto', texto: 'En los últimos meses, ¿ha cambiado algo en su trabajo, su deporte o lo que hace con las manos? (puede marcar varias)',
          opciones: ['Más horas o más repeticiones', 'Más fuerza o más peso', 'Empecé o volví hace poco', 'He cambiado de herramienta, raqueta o material', 'No ha cambiado nada', NS] },
        // Fuerza, control, velocidad y precisión; en qué fase del lanzamiento duele: armado
        // o inicio de la aceleración → LCC y cubital; frenado → pinzamiento posteromedial
        // (p. 86, 91); fatiga o mal control al lanzar (tabla 2).
        { id: 'lanza', tipo: 'multi', ia: 'actividades', texto: 'Si lanza: desde que le duele… (puede marcar varias)',
          opciones: ['He perdido fuerza, control, velocidad o puntería', 'Me duele con el brazo atrás, justo antes de soltar',
            'Me duele al soltar o al frenar el brazo después', 'Se me cansa o se me duerme la mano al lanzar', 'Nada de esto', NS],
          mostrarSi: { id: 'actividades', valores: [LANZAR] } }
      ]
    }
  ],
  pistas: {
    co_step1: ['c:desencadenante', 'r:que_paso', 'r:chasquido'],
    co_step2: ['r:nota.rigido', 'r:inmovilizado', 'r:provoca.doblar', 'r:antecedentes.reuma'],
    co_step3: ['r:zona', 'r:nota.hormigueo_menique', 'r:nota.hormigueo_pulgar', 'r:nota.torpeza', 'r:provoca.apoyar_codo',
               'r:antecedentes.cuello_hombro', 'r:antecedentes.diabetes'],
    co_step4: ['r:zona', 'r:provoca.agarrar', 'r:provoca.levantar', 'r:provoca.girar', 'r:provoca.estirar',
               'r:antecedentes.infiltracion', 'r:actividades', 'r:cambios'],
    co_step5: ['r:nota.chasquido_codo', 'r:nota.falla', 'r:provoca.levantarse', 'r:provoca.bolsa', 'r:lanza']
  }
};
