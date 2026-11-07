// Hoja general «Dermatomas, miotomas y reflejos» y su página de la guía (guia.html#neuro).
// Diseño y decisiones: docs/hojas-consulta-y-plantillas.md, parte B (aceptadas por el usuario, 2026-11).
//
// Todo está escrito con nuestras palabras a partir de fuentes leídas enteras en la sesión
// (2026-11). El folleto de la ISNCSCI (Rupp 2021) es © ASIA y prohíbe reproducirlo: de él
// solo se toman los datos (qué punto y qué músculo explora cada raíz, cómo se puntúa), nunca su
// tabla ni su figura; su hoja oficial se puede fotocopiar sin modificarla y la guía la nombra.
// Contenido de consulta: no diagnostica ni añade urgencias; los signos de neurona motora
// superior remiten a las preguntas de urgencia que la app ya tiene.

// Raíces con músculo clave (ISNCSCI): punto sensitivo clave, músculo clave y su posición para
// los grados 4–5, y los reflejos osteotendinosos cuyo arco incluye esa raíz.
export const RAICES_MIOTOMA = [
  { raiz: 'C5', punto: 'Cara radial de la fosa del codo, justo por encima del pliegue', musculo: 'Flexores del codo (bíceps, braquial)', posicion: 'Codo a 90°, brazo junto al cuerpo, antebrazo en supinación', reflejos: ['bicipital', 'braquiorradial'] },
  { raiz: 'C6', punto: 'Pulgar, cara dorsal de la falange proximal', musculo: 'Extensores de la muñeca (radiales largo y corto)', posicion: 'Muñeca en extensión completa', reflejos: ['bicipital', 'braquiorradial'] },
  { raiz: 'C7', punto: 'Dedo medio, cara dorsal de la falange proximal', musculo: 'Extensores del codo (tríceps)', posicion: 'Hombro en rotación neutra, en aducción y a 90° de flexión; codo a 45°', reflejos: ['tricipital'] },
  { raiz: 'C8', punto: 'Meñique, cara dorsal de la falange proximal', musculo: 'Flexor profundo del dedo medio', posicion: 'Falange distal en flexión completa, con las articulaciones proximales sujetas en extensión', reflejos: ['tricipital'] },
  { raiz: 'T1', punto: 'Cara cubital de la fosa del codo, justo por encima del epicóndilo medial', musculo: 'Abductor del meñique', posicion: 'Dedos en abducción completa', reflejos: [] },
  { raiz: 'L2', punto: 'Cara anteromedial del muslo, a medio camino entre el punto medio del ligamento inguinal y el cóndilo femoral medial', musculo: 'Flexores de la cadera (iliopsoas)', posicion: 'Cadera a 90° de flexión', reflejos: ['rotuliano'] },
  { raiz: 'L3', punto: 'Cóndilo femoral medial, por encima de la rodilla', musculo: 'Extensores de la rodilla (cuádriceps)', posicion: 'Rodilla a 15° de flexión', reflejos: ['rotuliano'] },
  { raiz: 'L4', punto: 'Maléolo medial', musculo: 'Flexores dorsales del tobillo (tibial anterior)', posicion: 'Tobillo en flexión dorsal completa', reflejos: ['rotuliano'] },
  { raiz: 'L5', punto: 'Dorso del pie, a la altura de la tercera articulación metatarsofalángica', musculo: 'Extensor largo del dedo gordo', posicion: 'Dedo gordo en extensión completa', reflejos: [] },
  { raiz: 'S1', punto: 'Cara lateral del talón (calcáneo)', musculo: 'Flexores plantares del tobillo (gemelos, sóleo)', posicion: 'Cadera neutra, rodilla en extensión completa, tobillo en flexión plantar completa', reflejos: ['aquileo'] },
];

// Raíces sin músculo clave: solo su punto sensitivo (la ISNCSCI no da músculo de C2–C4, T2–L1 ni S2–S4-5)
export const RAICES_SOLO_PUNTO = [
  { raiz: 'C2', punto: 'Al menos 1 cm lateral a la protuberancia occipital (o 3 cm detrás de la oreja)' },
  { raiz: 'C3', punto: 'Fosa supraclavicular, en la línea medioclavicular' },
  { raiz: 'C4', punto: 'Sobre la articulación acromioclavicular' },
  { raiz: 'T2', punto: 'Vértice de la axila' },
  { raiz: 'T3–T11', punto: 'Línea medioclavicular, en el espacio intercostal del mismo número (T4 a la altura del pezón, T6 de la apófisis xifoides, T10 del ombligo)' },
  { raiz: 'T12', punto: 'Punto medio del ligamento inguinal' },
  { raiz: 'L1', punto: 'A medio camino entre los puntos de T12 y L2' },
  { raiz: 'S2', punto: 'Punto medio de la fosa poplítea' },
  { raiz: 'S3', punto: 'Tuberosidad isquiática o pliegue infraglúteo' },
  { raiz: 'S4-5', punto: 'Alrededor del ano, a menos de 1 cm de la unión mucocutánea (un solo nivel)' },
];

// Reflejos osteotendinosos (Zimmerman y Hubbard 2023)
export const REFLEJOS = {
  bicipital: { nombre: 'Bicipital', niveles: 'C5–C6', nervio: 'musculocutáneo', golpe: 'sobre el tendón del bíceps, justo por delante del codo' },
  braquiorradial: { nombre: 'Braquiorradial', niveles: 'C5–C6', nervio: 'radial', golpe: 'en la cara radial del antebrazo, unos 10 cm por encima de la muñeca' },
  tricipital: { nombre: 'Tricipital', niveles: 'C7–C8, sobre todo C7', nervio: 'radial', golpe: 'sobre el tendón del tríceps, justo por detrás del codo' },
  rotuliano: { nombre: 'Rotuliano', niveles: 'L2–L4, sobre todo L4', nervio: 'femoral', golpe: 'sobre el tendón rotuliano, justo por debajo de la rótula' },
  aquileo: { nombre: 'Aquíleo', niveles: 'S1', nervio: 'tibial', golpe: 'sobre el tendón de Aquiles, por detrás del tobillo' },
};

export const TEXTOS_NEURO = {
  titulo: 'Dermatomas, miotomas y reflejos',
  sub: 'Dónde explorar cada raíz: su punto sensitivo clave, su músculo clave y los reflejos que la incluyen. Es para orientar la exploración: una raíz no se diagnostica con un solo hallazgo.',
  // Gradación (ISNCSCI)
  fuerza: [
    '0: no hay contracción.',
    '1: contracción que se ve o se palpa, sin movimiento.',
    '2: movimiento activo de todo el recorrido sin la gravedad.',
    '3: movimiento activo de todo el recorrido contra la gravedad.',
    '4: todo el recorrido contra una resistencia moderada, en la posición del músculo.',
    '5: todo el recorrido contra la resistencia completa que se esperaría en esa persona sin lesión.',
    'NT: no valorable (inmovilización, dolor que impide puntuar, amputación, contractura de más de la mitad del recorrido).',
  ],
  fuerzaNota: 'Las posiciones de la tabla son para distinguir 4 de 5. Explora en decúbito supino, de arriba abajo, cada lado por separado y en isométrico (Rupp 2021).',
  sensibilidad: [
    '0: ausente.',
    '1: alterada (menos o más que en la mejilla).',
    '2: normal, como en la mejilla.',
    'NT: no valorable.',
  ],
  sensibilidadNota: 'Compara siempre con la mejilla. Tacto ligero con una mota de algodón, en menos de 1 cm de piel y con los ojos cerrados; pinchazo con la punta y la parte roma de un imperdible, y si hay dudas, ocho aciertos de diez (Rupp 2021).',
  // Reflejos (Zimmerman y Hubbard 2023)
  escalaReflejos: [
    '0: ausente.',
    '1: menor de lo normal, o solo con refuerzo.',
    '2: en la mitad baja de lo normal.',
    '3: en la mitad alta de lo normal.',
    '4: aumentado; incluye el clono.',
  ],
  tecnicaReflejos: 'Con el músculo relajado y la articulación hacia los 90°, mira la contracción del músculo más que el movimiento, y compara enseguida con el otro lado. Si no sale, usa el refuerzo: apretar los dientes o la maniobra de Jendrassik, que es para el miembro inferior (Zimmerman y Hubbard 2023).',
  interpretacionReflejos: 'Lo que más pesa es la asimetría. Unos reflejos simétricos entre 1 y 3 se consideran normales sin otros signos, y un reflejo aislado más vivo o más débil, sin más hallazgos, no suele ser patológico; incluso ausente en los dos lados puede ser normal. Aumentado apunta a neurona motora superior y disminuido a neurona motora inferior (Zimmerman y Hubbard 2023).',
  nivelesReflejos: 'Los niveles del rotuliano y del aquíleo varían entre fuentes, e incluso dentro del mismo capítulo (Zimmerman y Hubbard 2023).',
  // Variabilidad (Lee 2008; Downs y Laporte 2011; Rupp 2021)
  variabilidad: [
    'Los mapas de dermatomas de los libros no coinciden entre sí y casi ninguno muestra que los dermatomas vecinos se solapan (Lee 2008; Downs y Laporte 2011).',
    'Casi toda la piel la inervan dos o más raíces, y en el miembro superior se espera más variación que en el resto; los dermatomas son mayores de lo que dibujan los libros (Lee 2008).',
    'Por eso la tabla da puntos y no bandas: explora el punto clave y compara con el otro lado (Rupp 2021).',
    'La mayoría de las raíces inervan más de un músculo y la mayoría de los músculos reciben más de una raíz: un músculo por raíz es una simplificación (Rupp 2021).',
  ],
  // Raíz o nervio periférico (Downs y Laporte 2011; Margetis y Hall 2026)
  raizNervio: [
    'Si la alteración sensitiva sigue el territorio de un nervio cutáneo, lo más probable es el nervio periférico; si sigue un dermatoma, la raíz o lo que hay por encima del plexo (Downs y Laporte 2011).',
    'La sensibilidad sola no da el diagnóstico, pero es una herramienta importante (Downs y Laporte 2011).',
    'La debilidad de neurona motora superior afecta a grupos de músculos; la de una lesión de neurona motora inferior puede paralizar músculos sueltos (Margetis y Hall 2026).',
  ],
  // Neurona motora superior (Margetis y Hall 2026; Assir y Das 2022)
  nmsTitulo: 'Signos de neurona motora superior: no son de una raíz',
  nms: [
    'Hoffmann: sujeta la base del dedo medio y golpea rápido su falange distal; es positivo si flexionan los dedos y el pulgar (Margetis y Hall 2026).',
    'Babinski: pasa un estímulo firme pero no doloroso por el borde externo de la planta, del talón a los dedos; es positivo si el dedo gordo se extiende y los demás se abren en abanico (Margetis y Hall 2026).',
    'Clono: estira rápido el músculo y mantén el estiramiento; son contracciones rítmicas, sobre todo en el tobillo y la rótula. La fuente no da un número de batidas en el adulto (Margetis y Hall 2026).',
    'Espasticidad: el tono aumenta con la velocidad del estiramiento; despacio no se nota (Margetis y Hall 2026).',
    'Con trofismo normal, hipertonía, hiperreflexia, clono o Babinski, piensa en neurona motora superior; con atrofia, fasciculaciones, hipotonía e hiporreflexia, en neurona motora inferior (Assir y Das 2022).',
  ],
  nmsDecision: 'Un Hoffmann aislado, sin síntomas ni otros hallazgos, no cambió el manejo ni justificó una prueba de imagen (Margetis y Hall 2026). Con síntomas o más signos, valoración médica: la exploración sola no basta para decidir (Assir y Das 2022). Si encajan con una mielopatía cervical o una cola de caballo, usa sus preguntas de urgencia del cribado.',
  // Límite de la ISNCSCI
  limite: 'La exploración de la ISNCSCI no incluye los reflejos: los de esta hoja vienen de otra fuente (Rupp 2021; Zimmerman y Hubbard 2023).',
  hojaOficial: 'La hoja oficial de exploración de ASIA (ISNCSCI, en español), con el dibujo de los puntos clave, se puede copiar libremente pero no modificar; en la página de ASIA, elige «Spanish».',
  derechos: 'Datos de la ISNCSCI (Rupp 2021, © ASIA) escritos con nuestras palabras; sin su tabla ni su figura.',
};

// Hoja oficial de ASIA (ISNCSCI): la página de ASIA con la hoja en cada idioma, no el PDF (decisión del
// usuario, 2026-11). La dirección del PDF lleva la fecha de subida (…/uploads/2024/04/…), así que una
// revisión nueva saldría en otra y el QR seguiría abriendo la antigua sin avisar. La página la da el
// buscador; el PDF en español (REV 04/19) lo dio el usuario y su pie dice «Este formulario puede ser
// copiado libremente pero no puede ser alterado sin permiso de la American Spinal Injury
// Association»: por eso el dibujo no se recorta para esta hoja. QR en la hoja impresa y enlace en la guía.
export const ASIA_HOJA = 'https://asia-spinalinjury.org/isncsci-worksheet-now-available-in-other-languages/';

// Fuentes de la hoja y de la guía (claves de data/referencias.js), para «Fuentes» y para el índice
export const FUENTES_NEURO = ['Rupp 2021', 'Lee 2008', 'Downs y Laporte 2011', 'Zimmerman y Hubbard 2023', 'Margetis y Hall 2026', 'Assir y Das 2022'];

// Kenhub: artículos comprobados (2026-11), con su versión en español. En la hoja impresa van como QR
// (las ilustraciones de dermatomas y miotomas, vistas con el móvil sobre el papel; decisión del
// usuario, 2026-11: el dibujo propio de puntos no aportaba precisión), y en la guía como enlaces.
export const KENHUB_NEURO = [
  { nombre: 'Dermatomas', es: 'https://www.kenhub.com/es/library/anatomia-es/dermatomas', en: 'https://www.kenhub.com/en/library/anatomy/dermatomes' },
  { nombre: 'Miotomas', es: 'https://www.kenhub.com/es/library/anatomia-es/miotomas', en: 'https://www.kenhub.com/en/library/anatomy/myotomes' },
];
