// Fase 6 «Plan de tratamiento»: contenido clínico de la parte sin IA.
// Diseño y las 24 decisiones: docs/plan-tratamiento.md (léelo antes de cambiar
// nada). La lógica vive en lib/plan-tratamiento.js; aquí solo los textos, cada
// uno con su fuente leída (claves de data/referencias.js en `fuentes`).
//
// Ninguna fuente da minutos, series ni cargas: todo lo que hay aquí es
// cualitativo. La dosis de la intervención es siempre la pauta citada de la
// hipótesis (decisión 7: sin pauta, «a criterio del fisio»).

// Regiones con la fase 6 activa. Piloto: lumbar (decisión L2); el resto entra
// en L3, región a región, con revisión clínica. Cervical (L3), con el mismo
// libro de Maitland que lumbar. Hombro (L3), la primera periférica, con
// Maitland's Peripheral Manipulation (Hengeveld y Banks 2005; decisiones 43–49).
// Codo (L3), la segunda periférica (decisiones 64–71). Rodilla (L3), la
// tercera periférica (decisiones 72–80). Cadera (L3), la cuarta periférica
// (decisiones 81–89).
export const REGIONES_PLAN = ['lumbar', 'cervical', 'hombro', 'codo', 'rodilla', 'cadera'];

// Familia de cada región para los escalones, la cantidad por sesión, la
// progresión y las reglas del mes (decisiones 43–46): columna = Maitland 2005
// (Vertebral); el resto de regiones del plan = Hengeveld y Banks 2005
// (Peripheral). Sin región se toma columna, como antes de L3.
export const REGIONES_COLUMNA_PLAN = ['lumbar', 'cervical'];

// Hipótesis de una región periférica cuya terapia manual va a la columna, por
// id: usan la familia columna (decisión 50). ca10, la sacroilíaca: el cap. 14
// de Peripheral la explora como un componente aparte de la cadera y no trae
// técnicas para ella (decisión 81).
export const FAMILIA_HIP = { h6: 'columna', ca10: 'columna' };

// Escalones de vigor y extensión de la terapia manual (decisiones 11 y 20).
// Petersen 2021 da la combinación gravedad × irritabilidad; Maitland 2005, las
// dos formas de aplicar la técnica («manda el dolor» / «manda la rigidez»).
// Para el ejercicio no aplican: ahí manda la pauta (decisión 14).
export const ESCALONES = {
  1: {
    nombre: 'Muy suave',
    modo: 'Manda el dolor',
    texto: 'Sin provocar dolor: posición cómoda y sin molestias, la mayor amplitud posible sin molestia, movimiento lento y suave (grados I y II). Corta al principio, hasta conocer la respuesta a las 48 h. Explorar solo hasta el límite activo.',
    citas: ['Maitland 2005, cap. 8, p. 203; cap. 9, p. 218', 'Petersen 2021, tabla 2 y apartado de irritabilidad'],
  },
  2: {
    nombre: 'Suave',
    modo: 'Manda el dolor',
    texto: 'Hasta donde empieza el dolor, sin sobrepasarlo (grado II); cuando el dolor baje, grado III. Con prudencia al acercarse al dolor, por el riesgo de que tarde en ceder.',
    citas: ['Maitland 2005, cap. 6, p. 101; cap. 9, p. 218', 'Petersen 2021, apartado de irritabilidad'],
  },
  3: {
    nombre: 'Moderada',
    modo: 'Molestia controlada',
    texto: 'Hasta una molestia controlada que no aumente mientras se aplica la técnica (grado III); si lo que se provoca cede enseguida, hasta el límite pasivo. Primero la misma técnica a la misma velocidad hacia la molestia; después, la posición hacia la dirección dolorosa.',
    citas: ['Maitland 2005, cap. 8, pp. 206–208', 'Petersen 2021, apartado de irritabilidad'],
  },
  4: {
    nombre: 'Firme',
    modo: 'Manda la rigidez',
    texto: 'Solo si domina la rigidez y las estructuras no están debilitadas por un traumatismo o una enfermedad: al final del recorrido, técnica firme (grado IV), amplitud sobre todo pequeña con alguna grande, intercalando movimientos activos. Respetar la molestia, sobre todo si se va sumando; un grado III suave alivia la que deje.',
    citas: ['Maitland 2005, cap. 8, p. 203; cap. 9, p. 218'],
  },
};

// Los mismos cuatro escalones en las regiones periféricas (decisión 43), con
// las citas de Peripheral; el 1 añade «un accesorio en posición indolora y
// apoyada antes que un fisiológico». Solo lo que recogen las notas de lectura
// (docs/plan-tratamiento.md, «Fuente de las regiones periféricas»).
export const ESCALONES_PERIFERICOS = {
  1: {
    nombre: 'Muy suave',
    modo: 'Manda el dolor',
    texto: 'Sin provocar dolor: un accesorio en posición indolora y apoyada antes que un fisiológico, con la mayor amplitud posible sin molestia y oscilaciones lentas y suaves (grados I y II). Mejor quedarse corto al principio, hasta conocer la irritabilidad. Explorar solo hasta el límite activo.',
    citas: ['Hengeveld y Banks 2005, cap. 7, p. 176; cap. 8, p. 192', 'Petersen 2021, tabla 2 y apartado de irritabilidad'],
  },
  2: {
    nombre: 'Suave',
    modo: 'Manda el dolor',
    texto: 'Hasta donde empieza el dolor, sin sobrepasarlo: con dolor a lo largo del recorrido, de grado II− a III+. Con prudencia al acercarse al dolor, por el riesgo de que tarde en ceder.',
    citas: ['Hengeveld y Banks 2005, cap. 6, p. 148; cap. 7, tabla 7.2, p. 176', 'Petersen 2021, apartado de irritabilidad'],
  },
  3: {
    nombre: 'Moderada',
    modo: 'Molestia controlada',
    texto: 'Entrar en una molestia controlada, de un 10–20 % de su intensidad máxima, que no aumente mientras se aplica la técnica (grado III); si lo que se provoca cede enseguida, hasta el límite pasivo.',
    citas: ['Hengeveld y Banks 2005, cap. 8, pp. 192–194', 'Petersen 2021, apartado de irritabilidad'],
  },
  4: {
    nombre: 'Firme',
    modo: 'Manda la rigidez',
    texto: 'Solo si domina la rigidez: al límite del recorrido, estiramiento oscilatorio de grado IV que progresa a IV+ y IV++, con ritmo «staccato», alternando fisiológicos y accesorios. Nunca técnicas firmes con ligamentos debilitados por una enfermedad (p. ej., artritis reumatoide), ni empujar a través de un espasmo.',
    citas: ['Hengeveld y Banks 2005, cap. 7, pp. 174–176; cap. 8, pp. 197, 203 y 224–225'],
  },
};

// Textos de A/B/C y de por qué no hay C.
export const TEXTO_NIVELES = {
  A: 'Un escalón por debajo de B',
  B: 'Ajustada a la gravedad y la irritabilidad',
  C: 'Un escalón por encima de B',
  sinC: {
    irritabilidad: 'Sin propuesta C: la irritabilidad no es baja (Petersen 2021; Maitland 2005, cap. 6, p. 117).',
    estabilidad: 'Sin propuesta C: los síntomas empeoran. Tratamiento suave y evaluación en cada sesión (Maitland 2005, cap. 6, pp. 101 y 107, que lo dice de los síntomas que varían mucho de un día a otro).',
  },
  aIgual: 'A coincide con B: ya es el escalón más suave.',
};

// Avisos de la parte superior de la fase.
export const AVISOS = {
  orientativo: 'Nivel orientativo: el juicio de irritabilidad varía entre fisioterapeutas (acuerdo del 71 %, kappa 0,39–0,44; Barakatt 2009). Puedes cambiar la gravedad y la irritabilidad.',
  propuesta: 'Es una propuesta, no una prescripción: la decide y la firma el fisioterapeuta.',
  soloTerapiaManual: 'Los escalones se refieren a la terapia manual de la pauta. Para el ejercicio, la dosis es la de la pauta.',
  miedo: 'Bandera amarilla (miedo al movimiento o riesgo psicosocial alto): tenlo presente al educar y al progresar. No bloquea la propuesta C (Petersen 2021 incluye las banderas amarillas en la «naturaleza» del cuadro).',
  sinNRS: 'Sin NRS registrado: se toma la gravedad más alta, que es la opción prudente. Cámbiala si la conoces, o registra el NRS en la fase 3.',
  difiereFase3: 'La fase 3 calcula la irritabilidad con toda la matriz, que incluye ítems de gravedad (dolor y discapacidad); aquí solo cuentan reposo, movimiento y tolerancia.',
  estimada: 'Irritabilidad estimada (elegida directamente, sin la matriz).',
  breveSinTests: 'Hipótesis de trabajo, pendiente de confirmar: no tiene ningún test hecho.',
  dosHipotesis: 'Dos hipótesis: la intervención principal se reparte entre ambas y el tiempo de cada una baja.',
  vertigo: 'No usar ninguna técnica cervical que produzca mareo; probar antes con movimientos exploratorios (Maitland 2005, cap. 9, p. 224).',
  manipulacionCervical: 'Sin manipulación forzada con signos de dos raíces cervicales o signos medulares; la movilización suave sí puede ser adecuada, y los cambios neurológicos no impiden movilizar con suavidad desde el principio (Maitland 2005, cap. 9, pp. 222–223).',
  sinTerapiaManualAguda: 'En la fase aguda (menos de 1 mes) la pauta de Kuijper 2009 es sin terapia manual: ahí los escalones no se aplican. La movilización o manipulación entra en la fase crónica (Blanpied 2017, B).',
  // Hombro (L3, decisiones 47 y 51–52)
  capsulitisPrecoz: 'Capsulitis con irritabilidad alta (fase precoz dolorosa): la guía admite movilización glenohumeral de baja intensidad en rangos sin dolor (Kelley 2013, C), pero un consenso posterior no considera eficaz la terapia manual en esa fase (93 % del panel) y sí la información y tranquilizar (100 %) (Salamh 2025). Con irritabilidad baja (fase rígida), el consenso sí la considera eficaz (85 %).',
  capsulitisEstadios: 'Capsulitis por estadio. 1, muy dolorosa: accesorios de grado I y II con el brazo bien apoyado en una posición neutra e indolora, reevaluando la respuesta de los síntomas más que el movimiento; si a las 2–3 sesiones los síntomas bajan, más amplitud y una pequeña molestia. 2, dolorosa y rígida: accesorios en posición neutra e indolora, y en la resistencia si lo que se queda antes no funciona; cuando la flexión llega a 100–120°, movimientos lentos hacia el cuadrante, primero de grado III− y después de grado IV a IV+, con un III− amplio para aliviar las molestias del tratamiento. 3, solo rigidez: grado IV+ fisiológicos y accesorios al límite, intercalando grado III; si el hombro está muy limitado, la movilización sirve poco (Hengeveld y Banks 2005, cap. 11, cuadro 11.9, pp. 342–343).',
  inestabilidad: 'Inestabilidad: en el hombro, movimientos accesorios o fisiológicos de grado II para estimular la propiocepción antes del entrenamiento de la estabilidad funcional; la rigidez se moviliza en la columna y en las articulaciones claviculares (Hengeveld y Banks 2005, cap. 11, cuadro 11.12, p. 347). La rotación lateral con presión fuerte, con mucho cuidado, por la palanca y la torsión sobre el húmero y la cápsula (p. 314).',
  artrosis: 'Artrosis glenohumeral: mejor solo con movimientos accesorios; el posteroanterior, con la mayor amplitud posible (grado II o III); tras una reagudización, grado I al principio, con el objetivo de llegar a III− o III+ en todo el recorrido sin dolor; los fisiológicos de grado II también pueden servir (Hengeveld y Banks 2005, cap. 11, cuadro 11.11, p. 345). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224).',
  protesis: 'Si la cirugía fue una prótesis: sobre todo accesorios cerca de la línea articular, sin palancas largas que muevan el hueso alrededor del implante; si el ejercicio activo ya cumple el objetivo, la movilización pasiva sobra (Hengeveld y Banks 2005, cap. 10, p. 269).',
  // Codo (L3, decisiones 66–69; cap. 12 de Peripheral)
  epicondilalgiaLateral: 'Epicondilalgia lateral: la base de la pauta es el ejercicio, con su propia dosis; la terapia manual es un complemento para aliviar pronto el dolor, y los escalones solo se refieren a ella (Hengeveld y Banks 2005, cap. 12, cuadro 12.6, p. 392, que cita a Vicenzino 2003). Si el movimiento pasivo del codo es completo e indoloro, la movilización pasiva no tiene sitio; con signos articulares, se tratan primero ellos solos, hasta ver cómo progresa, y después, si hace falta, también el componente tendinoso (p. 390). Las técnicas preferidas son la extensión-aducción de grado IV a IV+ y los accesorios al límite, sobre todo el anteroposterior y el posteroanterior de la cabeza del radio en pronación (cuadro 12.6, p. 392). El codo se sobretrata con facilidad (p. 393). Si no evoluciona, mirar también la columna cervical y torácica y el hombro (pp. 361 y 369).',
  epicondilalgiaMedial: 'Epicondilalgia medial: la pauta es de ejercicio excéntrico, con su propia dosis, y no incluye terapia manual; el cap. 12 de Peripheral no trae un perfil propio de la medial (solo la nombra entre los cuadros por sobrecarga; Hengeveld y Banks 2005, cap. 12, p. 390). Los escalones, solo si la exploración encuentra signos articulares en el codo.',
  rigidezCodo: 'Codo rígido y doloroso: primero, técnicas para el dolor hasta tener clara la irritabilidad; después, estirar en cualquier dirección mientras la progresión no empeore el patrón del dolor. Para estirar: fisiológicos de grado IV o IV− si el dolor es mínimo; accesorios de grado IV o IV− con la articulación sostenida al límite del recorrido fisiológico; intercalar los dos; y un grado II+ o III− en la mayor amplitud posible para aliviar las molestias del tratamiento. Un estiramiento juicioso y controlado (grados III y IV) es poco probable que cause una miositis osificante (Hengeveld y Banks 2005, cap. 12, pp. 390 y 393).',
  inestabilidadCodo: 'Inestabilidad del codo: la pauta es de fortalecimiento y control, y en la posterolateral evita la carga axial en extensión y supinación (Quzli 2025). El cap. 12 de Peripheral no trae un perfil de inestabilidad del codo; por la regla general de no usar técnicas firmes con ligamentos debilitados (Hengeveld y Banks 2005, cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido que tensen el ligamento insuficiente: el valgo (extensión-abducción) en la medial; la extensión con supinación en la posterolateral.',
  radiohumeral: 'Dolor radiohumeral intraarticular (plica): con patología intraarticular, de grado II− a III o III− (Hengeveld y Banks 2005, cap. 7, tabla 7.2, p. 176); si duele mucho, el movimiento longitudinal cefálico del radio cuando alivia el dolor (cap. 12, p. 389).',
  nervioCodo: 'Atrapamiento de un nervio en el codo: los escalones se refieren a la articulación. Para el nervio, movilizar las interfases que lo rodean y recuperar su deslizamiento y su tensión (Butler 2000, citado en Hengeveld y Banks 2005, cap. 12, p. 371); el anteroposterior y el longitudinal caudal de la cabeza del radio sirven como movilización de la interfase de un nervio radial mecanosensible (pp. 387–388). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).',
  esqueletoInmaduro: 'Codo en crecimiento (apofisitis o avulsión del epicóndilo medial, enfermedad de Panner u osteocondritis del capítulo): ninguna fuente leída trata la movilización pasiva del codo con el esqueleto inmaduro (el cap. 12 de Peripheral solo nombra la osteocondritis disecante; Hengeveld y Banks 2005, cap. 12, p. 390), y la pauta del lanzador joven es de descanso y ajuste de las cargas (Lluch 2020, cap. 3.2, p. 94). Los escalones de terapia manual no se aplican.',
  // Rodilla (L3, decisiones 74–78; cap. 15 de Peripheral)
  artrosisRodilla: 'Artrosis de rodilla: la terapia manual, solo junto al ejercicio (NICE NG226, rec. 1.3.6). Movimientos accesorios al final del recorrido y a lo largo de él, con amplitudes grandes, y progresar a la compresión si hace falta; si el problema es estable, también fisiológicos, sobre todo las combinaciones en extensión (Hengeveld y Banks 2005, cap. 15, cuadro 15.2, p. 517). En una reagudización, el anteroposterior y el posteroanterior de la tibia en grados I y II (pp. 507–508); la extensión en grado III, para el dolor y la rigidez a lo largo del recorrido (p. 500). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224).',
  menisco: 'Menisco: un bloqueo verdadero es un tope súbito a la extensión completa (suele faltar unos 30°) con la flexión completa conservada, y al final de la extensión se nota un tope elástico con espasmo; puede deberse a una rotura de menisco o a un cuerpo libre (Hengeveld y Banks 2005, cap. 15, p. 490). Si se sospecha una rotura de menisco, puede hacer falta consultar al médico antes de seguir con el tratamiento (p. 491). La terapia manual solo está en la pauta de la lesión degenerativa (Prill 2025, B); en la rotura traumática y tras la meniscectomía la pauta es de ejercicio, y los escalones se refieren a la terapia manual. La rotación de la tibia forma parte de la rehabilitación tras una meniscectomía (p. 504).',
  patelofemoral: 'Dolor patelofemoral: la base es el ejercicio de su pauta; la terapia manual, nunca aislada (Willy 2019, A), y los escalones solo se refieren a ella. Cuando el movimiento de la rótula duele, las primeras sesiones, extremadamente suaves: mejor quedarse corto y comprobarlo en la siguiente que descubrir que se hizo de más (Hengeveld y Banks 2005, cap. 15, p. 499). Con mucho dolor, accesorios suaves y amplios, antes del punto donde empieza; después, en otras posiciones de flexión y de flexión-abducción, y más adelante con compresión; puede hacer falta estirar el retináculo lateral (cuadro 15.3, p. 518). La primera vez que se usa la compresión de la rótula, no más de 20 s, y valorar al día siguiente (p. 510).',
  ligamentoRodilla: 'Lesión de un ligamento de la rodilla: si se sospecha una rotura completa, puede hacer falta consultar al médico antes de seguir con el tratamiento (Hengeveld y Banks 2005, cap. 15, p. 491). La rotación medial de la tibia corresponde a la restricción del cruzado anterior, y la lateral, a la del colateral medial y el cruzado posterior (p. 504); el colateral medial se explora con la abducción y el lateral con la aducción, a 30° y 0° de flexión (p. 497), y con un colateral roto el recorrido es excesivo y el tope, «blando» (p. 505). Por la regla general de no usar técnicas firmes con ligamentos debilitados (cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido en la dirección que tensa el ligamento lesionado. Los movimientos lateral y medial de la tibia ayudan a recuperarse de una lesión de un colateral (p. 509).',
  esguinceReciente: 'Esguince de un colateral. Si es reciente: movimientos lentos y pequeños, en grupos de unos 5, solo hasta una molestia mínima, y reevaluar a las 24 h; si duele más, más suave; si hay más recorrido y menos dolor, más profundo; el estiramiento suave, para la resistencia del tejido, desde el 5.º–6.º día. Si ya es una rigidez periarticular crónica: estiramientos más firmes, hasta un «pinchazo» momentáneo, pocos (4–6) y sin sostenerlos, y repetirlos en casa (Hengeveld y Banks 2005, cap. 8, p. 220).',
  cargaRodilla: 'Tendinopatía rotuliana o banda iliotibial: la base es la carga progresiva de su pauta, con su propia dosis, y los escalones solo se refieren a la terapia manual (en la banda iliotibial, la pauta la admite como complemento del fortalecimiento). Si a la vez hay signos articulares, el cap. 15 recomienda tratar primero esos, con las pruebas isométricas que provocan el dolor como parámetro de reevaluación (Hengeveld y Banks 2005, cap. 15, p. 494).',
  rotulaInestable: 'Rótula inestable: la base es el ejercicio de su pauta (Balcarek 2025), y los escalones se refieren a la terapia manual. Procurar que los movimientos pasivos sean indoloros y estirar el retináculo lateral (Hengeveld y Banks 2005, cap. 15, cuadro 15.4, p. 519). En la subluxación recurrente, el movimiento lateral de la rótula puede provocar dolor y la sensación de que se va a salir, y el paciente frena cualquier intento más contrayendo el cuádriceps (aprensión; p. 498).',
  apofisitis: 'Apofisitis del adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson): la pauta es de carga progresiva y una escalera de actividad guiada por el dolor, sin terapia manual (Rathleff 2020). Ninguna fuente leída trata la movilización pasiva de la rodilla con el esqueleto inmaduro (el cap. 15 de Peripheral solo nombra la hinchazón dolorosa de la tuberosidad tibial en el Osgood-Schlatter; Hengeveld y Banks 2005, cap. 15, p. 496). Los escalones de terapia manual no se aplican.',
  tibioperonea: 'Tibioperonea proximal: a menudo no es fácil saber si es la responsable; suele aclararse con técnicas más fuertes, con compresión, comparando con el otro lado, y si aparece un signo comparable, ese movimiento es el que se usa para tratar. Al principio, firme pero no vigoroso; los síntomas que se provoquen deben ir al ritmo del movimiento y ceder enseguida al parar. Cuando la responsable es ella, suele responder muy deprisa a movilizaciones de gran intensidad (Hengeveld y Banks 2005, cap. 15, p. 499).',
  nervioPeroneo: 'Neuropatía del peroneo común: los escalones se refieren a la articulación. El anteroposterior y el posteroanterior de la cabeza del peroné ayudan a recuperarse de un atrapamiento del nervio peroneo en la cabeza del peroné; el posteroanterior también puede hacerse en supino con la pierna en algo de elevación de la pierna recta (Hengeveld y Banks 2005, cap. 15, pp. 515–516). Para explorar el nervio, la elevación de la pierna recta con inversión del pie (cuadro 15.1, p. 492), y a la palpación puede doler junto a la cabeza del peroné (p. 497). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).',
  posqRodilla: 'Tras una cirugía de rodilla: el libro empieza a movilizar con el anteroposterior y el posteroanterior de la tibia en grados I y II tras una prótesis u otra intervención (Hengeveld y Banks 2005, cap. 15, pp. 507–508), y la rotación de la tibia forma parte de la rehabilitación tras una meniscectomía o una fractura de meseta tibial (p. 504). Siempre dentro del protocolo del cirujano.',
  // Cadera (L3, decisiones 82–87; cap. 14 de Peripheral)
  artrosisCadera: 'Artrosis de cadera: la terapia manual, siempre junto al ejercicio (NICE NG226, rec. 1.3.6), adaptando la técnica y la fuerza a la morfología de la cadera y a la irritabilidad (Koc 2025, F). Movimientos accesorios al final del recorrido y, si hay movilidad suficiente, en posiciones dentro del recorrido, sobre todo en flexión-aducción (F/Ad); amplitudes grandes alternadas con las de final de recorrido; los síntomas menores pueden responder a la compresión intermitente añadida (Hengeveld y Banks 2005, cap. 14, cuadro 14.3, p. 476). Para calmar una reagudización, la F/Ad de grado II o III (p. 469); el longitudinal caudal alivia mucho la cadera dolorosa y sirve en la artrosis que migra hacia arriba y en la tensión capsular (p. 464), y el lateral, en la que migra hacia dentro (p. 462). En la artrosis de tipo sistémico, la movilización puede aliviar, pero es esencial el manejo reumatológico (cuadro 14.3, p. 476). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224).',
  pinzamientoCadera: 'Pinzamiento femoroacetabular o labrum: la pauta evita los ejercicios y los rangos que reproducen el pinzamiento (Enseki 2023). La técnica principal del cap. 14, la flexión-aducción (F/Ad), con compresión o rotación medial añadidas, lleva justo a esa posición (Hengeveld y Banks 2005, cap. 14, pp. 457–460). En la rotura del labrum, el capítulo describe dolor y aprensión con la flexión, la aducción y la rotación interna (rotura anterosuperior) o con la hiperextensión, la abducción y la rotación externa (posteroinferior), y la provocación de los síntomas con la compresión axial; según el dolor, movimientos pasivos suaves con accesorios antes de la posición dolorosa (cuadro 14.5, p. 478). Sin técnicas firmes ni compresión en las posiciones que reproducen el pinzamiento.',
  inestabilidadCadera: 'Ligamento redondo e inestabilidad: la pauta evita los ejercicios y las actividades que provoquen síntomas o carguen en exceso las estructuras capsuloligamentosas (Enseki 2023). El cap. 14 de Peripheral no trae un perfil de inestabilidad de la cadera; por la regla general de no usar técnicas firmes con ligamentos debilitados (Hengeveld y Banks 2005, cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido que estiren la cápsula, como el movimiento lateral y el longitudinal caudal, que el capítulo usa para la tensión capsular (cap. 14, pp. 462 y 464).',
  tendinopatiaGlutea: 'Tendinopatía glútea: la base es la educación y el ejercicio de su pauta, con su propia dosis; la pauta no incluye terapia manual, y los escalones solo se refieren a ella (Mellor 2018). El cap. 14 la trata como «bursitis trocantérea» (Hengeveld y Banks 2005, cap. 14, cuadro 14.6, p. 479): cruzar las piernas y tumbarse sobre ese lado reproducen los síntomas, y pide tratar a la vez los signos lumbares y de la cadera que la acompañen. Su estiramiento del tensor de la fascia lata y de la cintilla iliotibial choca con la pauta, que lo evita porque comprime los tendones contra el trocánter: manda la pauta.',
  cargaCadera: 'Tendinopatía o lesión muscular: la base es la carga o el ejercicio de su pauta, con su propia dosis, y los escalones solo se refieren a la terapia manual. Si a la vez hay signos articulares, el cap. 14 recomienda tratar primero esos y usar como parámetro de reevaluación las pruebas isométricas que reproducen los síntomas (Hengeveld y Banks 2005, cap. 14, p. 454).',
  ingleAguda: 'Lesión aguda de ingle: la pauta es de ejercicio, sin agentes físicos ni punción seca, y los escalones solo se refieren a la terapia manual; el tratamiento manual de tejidos blandos no se hacía sobre la zona dolorosa, y fuera de ella, hasta 5 min si la tensión del aductor limitaba los ejercicios (Serner 2020).',
  ingleDeportiva: 'Dolor inguinal del deportista: el cap. 14 pide considerar como fuente, además de la cadera, la columna lumbar y la torácica, la sacroilíaca y el sistema neurodinámico, y en la zona, las tendinopatías del aductor largo, el psoas ilíaco, el recto femoral y el recto abdominal, la osteítis de pubis, las fracturas de estrés de la pelvis, la inestabilidad del pubis, el atrapamiento de los nervios ilioinguinal y obturador, la hernia inguinal y la patología genitourinaria. En la tendinitis, el movimiento pasivo de la cadera suele ser normal y lo preferido son las técnicas de tejidos blandos; en la fase aguda, reposo, frío y compresión unas 48 h, y después aumentar con suavidad el estiramiento y la contracción dentro de lo indoloro (Hengeveld y Banks 2005, cap. 14, cuadro 14.4, pp. 476–477).',
  gluteoProfundo: 'Síndrome glúteo profundo: los escalones se refieren a la articulación. El posteroanterior del trocánter mayor puede servir en el síndrome piriforme (Hengeveld y Banks 2005, cap. 14, p. 465); el nervio ciático se palpa a medio camino entre el trocánter mayor y la tuberosidad isquiática (p. 457) y se explora con la elevación de la pierna recta y el slump (cuadro 14.2, p. 451). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).',
  nervioCadera: 'Neuropatías de cadera e ingle: los escalones se refieren a la articulación. En la meralgia parestésica (nervio cutáneo femoral lateral), el slump en decúbito lateral con extensión y aducción de la cadera puede provocar los síntomas, y la palpación profunda justo por debajo de la espina ilíaca anterosuperior, reproducirlos; es esencial tratar a la vez los signos lumbares y de la cadera, la movilización neurodinámica respetando los síntomas, y aconsejar sobre la ropa ajustada y la pérdida de peso; según algunos autores, en muchos casos se resuelve sola en 2 años (Hengeveld y Banks 2005, cap. 14, cuadro 14.7, p. 480). Para los nervios obturador e ilioinguinal, variantes del slump en decúbito lateral y de las pruebas del nervio femoral (pp. 451 y 455; cuadro 14.4, p. 477). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).',
  sensibilizacionCentral: 'Sensibilización central: con hiperalgesia secundaria, los grados I y II solos no alivian el dolor y los III y IV pueden aumentar la sensibilización, y el tratamiento local tiene poco efecto duradero (Hengeveld y Banks 2005, cap. 10, recuadro 10.3, pp. 264–265).',
  posqCadera: 'Tras una cirugía de cadera: el cap. 14 no trata la prótesis; el movimiento lateral sirve para recuperar el recorrido tras una fractura del fémur o de la región acetabular (Hengeveld y Banks 2005, cap. 14, p. 462). Su técnica principal, la flexión-aducción (F/Ad), con compresión o rotación medial añadidas, lleva la cadera a flexión y aducción (pp. 457–460): si el cirujano ha pautado precauciones de luxación, comprobar antes que las respeta. Siempre dentro del protocolo del cirujano.',
  dosFamilias: 'Las dos hipótesis se tratan en zonas distintas (columna y articulación periférica): los escalones y las reglas del mes son los de la principal; la cantidad por sesión y la progresión, las de cada una.',
  // Varios síntomas (Fase N, docs/sintomas-multiples.md; decisión 35)
  dosificaOtro: 'Dosificado según el síntoma más irritable de la fase 3, no según P1 (a igualdad de irritabilidad, manda P1). La gravedad es la de su NRS.',
  independiente: 'Un síntoma va independiente de P1: puede ser un segundo problema que este plan no trata. Valóralo aparte.',
};

// Avisos por hipótesis, por id (nunca por el nombre): claves de AVISOS.
export const AVISOS_HIP = {
  ce13: ['vertigo'],                                         // mareo cervicogénico
  ce3: ['manipulacionCervical'],                             // radiculopatía cervical
  ce12: ['manipulacionCervical', 'sinTerapiaManualAguda'],   // dolor radicular cervical (su pauta aguda, data/cervical.js)
  h1: ['capsulitisPrecoz', 'capsulitisEstadios'],           // capsulitis adhesiva (su pauta; cap. 11, cuadro 11.9)
  h4: ['inestabilidad'],                                     // inestabilidad glenohumeral (cap. 11, cuadro 11.12)
  h10: ['artrosis'],                                         // artrosis glenohumeral (cap. 11, cuadro 11.11)
  // Codo (decisiones 66–69; cap. 12 de Peripheral)
  co1: ['epicondilalgiaLateral'],                            // cuadro 12.6 y p. 390
  co2: ['epicondilalgiaMedial'],                             // su pauta, sin terapia manual
  co3: ['rigidezCodo'],                                      // pp. 390 y 393
  co4: ['inestabilidadCodo'],                                // LCC (medial)
  co5: ['inestabilidadCodo'],                                // IRPL (posterolateral)
  co6: ['radiohumeral'],                                     // plica radiocapitelar
  co8: ['nervioCodo'], co9: ['nervioCodo'], co13: ['nervioCodo'], // atrapamientos (p. 371)
  co15: ['esqueletoInmaduro'], co16: ['esqueletoInmaduro'],  // esqueleto inmaduro
  // Rodilla (decisiones 74–78; cap. 15 de Peripheral)
  ro1: ['artrosisRodilla'],                                  // cuadro 15.2
  ro2: ['menisco'],                                          // pp. 490–491 y 504; sus ramas
  ro3: ['patelofemoral'],                                    // cuadro 15.3, pp. 499 y 510
  ro4: ['ligamentoRodilla'], ro9: ['ligamentoRodilla'],      // cruzados (intraarticulares)
  ro8: ['ligamentoRodilla', 'esguinceReciente'],             // colateral medial
  ro10: ['ligamentoRodilla', 'esguinceReciente'],            // colateral lateral y esquina posterolateral
  ro5: ['cargaRodilla'], ro6: ['cargaRodilla'],              // p. 494
  ro12: ['rotulaInestable'],                                 // cuadro 15.4 y p. 498
  ro15: ['apofisitis'],                                      // esqueleto inmaduro
  ro18: ['tibioperonea'],                                    // p. 499
  ro19: ['nervioPeroneo'],                                   // pp. 515–516
  // Cadera (decisiones 82–87; cap. 14 de Peripheral)
  ca1: ['artrosisCadera'],                                   // cuadro 14.3
  ca2: ['pinzamientoCadera'], ca3: ['pinzamientoCadera'],    // cuadro 14.5 y pp. 457–460
  ca4: ['tendinopatiaGlutea'],                               // cuadro 14.6 frente a su pauta
  ca7: ['gluteoProfundo'],                                   // pp. 451, 457 y 465
  ca9: ['cargaCadera'],                                      // p. 454
  ca11: ['ingleAguda', 'ingleDeportiva'],                    // su pauta; cuadro 14.4
  ca12: ['inestabilidadCadera'],                             // cap. 8, pp. 224–225 (inferencia)
  ca14: ['nervioCadera'],                                    // cuadro 14.7
  ca15: ['sensibilizacionCentral'],                          // cap. 10, recuadro 10.3
  ca16: ['cargaCadera', 'ingleDeportiva'], ca17: ['cargaCadera', 'ingleDeportiva'],
  ca18: ['ingleDeportiva'], ca19: ['ingleDeportiva'],        // sin pauta
};

// Avisos con mecanismo Post-quirúrgico en una región periférica (decisión 47):
// condicional, porque la app no sabe si la cirugía fue una prótesis.
export const AVISOS_POSQ_PERIFERICA = ['protesis'];

// Avisos con mecanismo Post-quirúrgico propios de una región, después de los
// de las periféricas (decisión 78): lo que su capítulo de Peripheral dice de
// empezar a movilizar tras la cirugía.
export const AVISOS_POSQ_REGION = { rodilla: ['posqRodilla'], cadera: ['posqCadera'] };

// Bloques de la sesión de 50 minutos: organización orientativa y editable, no
// evidencia (docs/plan-tratamiento.md, «Sesión de 50 minutos»). `duracion` en
// minutos; el fisio la cambia en la fase 6 y los rangos se recalculan
// (rangosBloques(), lib/plan-tratamiento.js).
export const MINUTOS_SESION = 50;
export const BLOQUES_SESION = [
  { id: 'reevaluacion', titulo: 'Reevaluación', duracion: 5 },
  { id: 'educacion', titulo: 'Educación', duracion: 7 },
  { id: 'intervencion', titulo: 'Intervención principal', duracion: 23 },
  { id: 'domiciliario', titulo: 'Programa domiciliario', duracion: 10 },
  { id: 'cierre', titulo: 'Cierre', duracion: 5 },
];

// Contenido fijo de cada bloque (decisiones 18 y 21).
export const TEXTOS_SESION = {
  reevaluacionBase: 'Signo comparable y la actividad que el paciente refiere como control (Maitland 2005, cap. 6, pp. 100–101 y 128).',
  reevaluacionSiguiente: 'Cómo reaccionó a la sesión anterior, en sus palabras y comparado con antes («D más 1», Maitland 2005, cap. 6, p. 156; cap. 9, tabla 9.3; Hengeveld y Banks 2005, cap. 9, p. 246).',
  reevaluacionRadicular: 'Exploración neurológica al empezar; si empeora, comunicarlo al médico (Maitland 2005, cap. 6, p. 136).',
  // Atrapamiento de un nervio periférico (HIP_NERVIO_PERIFERICO, decisión 65)
  reevaluacionNervio: 'Sensibilidad y fuerza en el territorio del nervio al empezar, sin empeorarlas con pruebas vigorosas (Hengeveld y Banks 2005, cap. 6, p. 158; cap. 12, cuadro 12.6, p. 392); si empeoran, comunicarlo al médico (Maitland 2005, cap. 6, p. 136).',
  educacionBase: 'Explicar la hipótesis y el plan, y lo que puede notar.',
  educacionPrimera: 'Avisar de un posible aumento temporal de los síntomas tras esta primera sesión (Maitland 2005, cap. 9, p. 219; Hengeveld y Banks 2005, cap. 9, p. 243).',
  primeraSesion: 'Primera sesión: menos tratamiento que en las siguientes, porque el primer estiramiento provoca más reacción (Maitland 2005, cap. 9, p. 219).',
  cantidad: 'Evaluar antes, durante y después de cada técnica; unas 3–4 movilizaciones de unos 30 s por articulación, la mitad si duele mucho (Maitland 2005, cap. 9, pp. 213, 216 y 219).',
  // Regiones periféricas (decisión 44)
  cantidadPeriferica: 'Evaluar antes, durante y después de cada técnica. Con dolor: técnicas de 30 s a 2 min, una o dos veces, lentas y suaves. Con rigidez: unos 2 min de estiramiento oscilatorio, alternando fisiológicos y accesorios al límite, 3–4 veces en la sesión inicial; de media, 4–5 min por articulación cada vez. Con dolor y rigidez, estirar 3 o más veces, 1–2 min cada una (Hengeveld y Banks 2005, cap. 5, pp. 97–102; cap. 7, p. 175; cap. 8, pp. 192, 197–198 y 201).',
  // Pautas con volumen propio (VOLUMEN_PAUTA): mandan sobre la cantidad genérica.
  cantidadReid: 'Mareo cervicogénico: el volumen es el de su pauta, que manda sobre la cantidad genérica: SNAG de Mulligan, 6 repeticiones (sin síntomas en la primera sesión); o movilización de Maitland de hasta 3 niveles cervicales altos, normalmente 3 aplicaciones de 30 s por nivel (Reid 2014).',
  domiciliario: 'Enseñar y comprobar lo que hará en casa.',
  cierre: 'Reevaluar el signo comparable y explicar qué vigilar hasta la próxima sesión: al levantarse, en el trabajo o la actividad, por la noche y tras los ejercicios (Maitland 2005, cap. 9, p. 213 y tabla 9.3, «Después»; Hengeveld y Banks 2005, cap. 9, p. 243).',
  cierreNeuro: 'Red de seguridad: explicar qué síntomas exigen ir a urgencias (adormecimiento entre las piernas o alrededor del ano, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Finucane 2020, sección 2, pp. 9–17).',
  cierreMedula: 'Red de seguridad: explicar qué síntomas exigen ir a urgencias (torpeza nueva en las manos, inestabilidad o piernas «pesadas» al caminar, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Margetis y Donnally 2025, anamnesis y exploración).',
  cierreCardiaco: 'Red de seguridad: explicar qué síntomas exigen llamar al 112 (dolor u opresión en el pecho, el hombro, el brazo, el cuello, la mandíbula o la espalda que no se pasa al parar en unos 20 minutos, o que viene con sudor frío, náuseas, vómitos o falta de aire) y comprobar que lo ha entendido (Goodman 2018, cap. 6, pp. 236 y 260, como en el razonamiento de h_c4).',
  cierreInfeccion: 'Red de seguridad: explicar qué síntomas exigen ir hoy mismo al médico o a urgencias (el codo se pone rojo, caliente e hinchado, aunque no haya fiebre) y comprobar que lo ha entendido (Momodu y Savaliya 2023; Pangia 2025, como en el razonamiento de co1).',
  // Rodilla (decisión 79): infección y TVP, siempre
  cierreInfeccionRodilla: 'Red de seguridad: explicar qué síntomas exigen ir hoy mismo al médico o a urgencias (la rodilla, o la zona de delante de la rótula, se pone roja, caliente e hinchada, aunque no haya fiebre) y comprobar que lo ha entendido (Momodu y Savaliya 2023; Truong 2023, como en el razonamiento de r1 y r_i3).',
  cierreTVP: 'Red de seguridad: explicar qué síntomas exigen ir hoy mismo al médico o a urgencias (la pantorrilla hinchada, caliente, más roja o dolorida que la otra) y cuáles, llamar al 112 (falta de aire de repente o dolor en el pecho al respirar), y comprobar que lo ha entendido (Waheed 2023; NICE NG158; Vyas 2024, como en el razonamiento de r_v2 y pq_tep).',
  // Cadera (decisión 88): fractura de estrés, infección y TVP, siempre
  cierreFracturaEstres: 'Red de seguridad: explicar qué síntomas exigen dejar la actividad que lo empeora e ir hoy mismo al médico (dolor de ingle o de cadera que va a más al apoyar el peso o con la actividad y aparece también de noche: posible fractura de estrés del cuello del fémur, que una radiografía negativa no descarta) y comprobar que lo ha entendido (Lluch 2020; Goodman 2018; May y Marappa-Ganeshan 2023, como en el razonamiento de ca_os1).',
  cierreInfeccionCadera: 'Red de seguridad: explicar qué síntomas exigen ir hoy mismo a urgencias (la cadera duele mucho, hasta no poder apoyar la pierna, con fiebre o malestar general) y, con una prótesis, cuáles piden ir al médico (un dolor nuevo que no cede en reposo y sigue de noche, sobre todo tras una infección), y comprobar que lo ha entendido (Momodu y Savaliya 2023; Goodman 2018, como en el razonamiento de ca_in1 y ca_in3).',
  cierreArterial: 'Red de seguridad: explicar qué síntomas exigen ir a urgencias (dolor de cabeza o de cuello de golpe y distinto a cualquier otro, visión doble, dificultad para hablar o tragar, inestabilidad al caminar o caídas súbitas) y comprobar que lo ha entendido; los de una disección pueden llegar días después (Rushton 2023, tablas 1–2 y 6, pp. 9–12).',
};

// Plan de un mes: A = 1 sesión/semana, B = 2 sesiones/semana.
export const PLANES_MES = {
  A: {
    nombre: 'Plan A · 1 sesión por semana',
    sesiones: 4,
    intermedia: 'Sesión 2 (semana 2)',
    final: 'Sesión 4',
    domiciliario: 'Alto: es la mayor parte de la carga del mes.',
    notas: [
      'Maitland evalúa la respuesta a las 24–48 h y pide sesiones lo bastante frecuentes para valorar el efecto; con una por semana la comparación es semanal (Maitland 2005, cap. 9, p. 219 y tabla 9.3). Pedir al paciente que anote cómo estuvo a las 24 h de cada sesión y, si las molestias aumentan, qué estaba haciendo y qué le ayudó (Hengeveld y Banks 2005, cap. 9, p. 247).',
    ],
  },
  B: {
    nombre: 'Plan B · 2 sesiones por semana',
    sesiones: 8,
    intermedia: 'Sesión 4 (semana 2)',
    final: 'Sesión 8',
    domiciliario: 'Medio.',
    notas: [
      'Con movilización neural vigorosa, dejar al menos 2–3 días entre sesiones y reevaluar a las 24 h (Maitland 2005, cap. 6, p. 149).',
    ],
  },
};

// Hipótesis cuya pauta trae su propio volumen de terapia manual, por id: clave
// de TEXTOS_SESION que sustituye a la cantidad genérica (decisión 41).
export const VOLUMEN_PAUTA = { ce13: 'cantidadReid' };

// Hipótesis cuya pauta fija la frecuencia, por id (decisión 42): plan del mes
// que se propone por defecto y nota que lo explica.
export const FRECUENCIA_PAUTA = {
  ce12: {
    plan: 'B',
    nota: 'Dolor radicular cervical agudo: su pauta fija 2 sesiones por semana durante 6 semanas (12 sesiones), así que encaja con el plan B; con el plan A, el mes queda por debajo de esa pauta (Kuijper 2009).',
  },
  // Codo (decisión 67): los ensayos de su pauta usaron 2 o más sesiones por semana
  co3: {
    plan: 'B',
    nota: 'Rigidez del codo: los ensayos de estiramientos de contracción-relajación de su pauta usaron de 2 a 7 sesiones por semana durante 3 a 6 semanas, y la intensidad óptima no se conoce (Wistow 2025); con el plan A, el mes queda por debajo de lo estudiado.',
  },
  // Rodilla (decisión 76): la pauta usa menos visitas que el plan A
  ro15: {
    plan: 'A',
    nota: 'Apofisitis del adolescente: su pauta usa 4 visitas en 12 semanas, con los padres, y el resto del trabajo es en casa (Rathleff 2020); el plan A ya queda por encima de esas visitas, y el programa para casa es el que lleva la carga.',
  },
  // Cadera (decisiones 83 y 85)
  ca1: {
    plan: 'A',
    nota: 'Artrosis de cadera: la guía da de 1 a 5 sesiones de ejercicio por semana durante 5–16 semanas (A), y la terapia manual, de 1 a 3 veces por semana durante 6–12 semanas, siempre junto al ejercicio (Koc 2025): los dos planes caben en esos márgenes, y el mes es el comienzo de un programa más largo.',
  },
  ca4: {
    plan: 'B',
    nota: 'Tendinopatía glútea: su pauta son 14 sesiones individuales en 8 semanas, casi 2 por semana, con la abducción contra resistencia en consulta 2 veces por semana (Mellor 2018), así que encaja con el plan B; con el plan A, el mes queda por debajo de esa pauta.',
  },
  ca9: {
    plan: 'A',
    nota: 'Tendinopatía proximal de isquiotibiales: su pauta usa 6 sesiones en 12 semanas (las semanas 0, 1, 2, 3, 6 y 12), así que el primer mes son 4, una por semana, como el plan A (Rich 2025).',
  },
  ca11: {
    plan: 'B',
    nota: 'Lesión aguda de ingle: su pauta se hizo con sesiones individuales supervisadas, ofrecidas 5 días por semana (los ejercicios de ingle, 3 de ellos); las lesiones de grado 0–2 en la RM necesitaron una mediana de 10 sesiones en unas 2–4 semanas, y las de grado 3, de 40 (Serner 2020): incluso el plan B queda por debajo de lo estudiado.',
  },
  ca16: {
    plan: 'B',
    nota: 'Dolor inguinal de larga evolución relacionado con el aductor: su pauta son 3 sesiones supervisadas por semana, de unos 90 min y en grupos de 2–4, durante 8–12 semanas, con el módulo I en casa los días intermedios (Hölmich 1999): incluso el plan B queda por debajo de esa pauta.',
  },
};

// Criterio de progresión genérico, cuando la pauta no trae el suyo (decisión 14).
export const PROGRESION_GENERICA = 'Si la pauta trae su propio criterio de progresión, ese manda. Si no: al principio lo mínimo que no provoque recaída; reintroducir lo que agravaba cuando baje la irritabilidad; progresar al ritmo de la curación y de los síntomas; reevaluar dentro de la sesión y entre sesiones (Petersen 2021; Zusman 1998).';

// Umbrales de progresión de la terapia manual en las regiones periféricas: se
// añaden a la genérica, no la sustituyen; para el ejercicio manda la pauta
// (decisión 45).
export const PROGRESION_PERIFERICA = 'Terapia manual en una articulación periférica: empezar con un accesorio en posición indolora y apoyada; pasar a movimientos fisiológicos cuando el recorrido activo supere el 60 % del normal (con dolor y rigidez, el 60 % del recorrido rígido disponible) y, hasta el 75 %, quedarse antes del punto donde empieza el dolor; después, entrar en una molestia controlada (un 10–20 % de su intensidad máxima), y movimientos fisiológicos amplios cuando el dolor solo aparezca en el último 40 % del recorrido. Si no está claro si domina el dolor o la rigidez, tratar primero el dolor; con dudas al pasar a fisiológicos, repetir unas sesiones más los accesorios, y si empeora, volver a ellos (Hengeveld y Banks 2005, cap. 8, pp. 192–196 y 200).';

// Reglas de seguir o cambiar (decisión 22).
export const REGLAS_MES = [
  'Si una técnica no cambia nada, repetirla más firme; si sigue sin cambio, descartarla. Si mejora, repetirla; si empeora, no repetirla (Maitland 2005, cap. 9, pp. 213–214).',
  'Si se espera una mejora lenta, no cambiar una técnica antes de usarla dos sesiones o más (Maitland 2005, cap. 9, pp. 214 y 216).',
  'Con una mejora del 75 % o más en una sesión, no subir la dosis: esperar 48 h o repetir igual o menos (Maitland 2005, cap. 9, p. 216).',
  'La movilización que funciona debería mostrar una mejora marcada en 4–5 días (Maitland 2005, cap. 9, p. 220).',
  'Sin cambio en 10–14 días, pausa y reevaluación a los 7–14 días; devolver al médico si los signos no siguen los patrones habituales o el paciente no mejora (Maitland 2005, cap. 9, pp. 219–220 y 223).',
];

// Reglas de seguir o cambiar en las regiones periféricas (decisión 46): las de
// Peripheral sustituyen a las de Vertebral sin equivalente (la del 75 % y la de
// 4–5 días); la pausa es común y se cita de los dos libros.
export const REGLAS_MES_PERIFERICAS = [
  'Si mejora o no cambia, repetir la misma técnica; si empeora, la misma con menos amplitud y más lejos del dolor (Hengeveld y Banks 2005, cap. 8, p. 192).',
  'No cambiar una técnica demasiado pronto: puede hacer falta repetirla hasta la 2.ª visita, y a veces aplicarla dos veces antes de juzgarla (Hengeveld y Banks 2005, cap. 8, pp. 191 y 206).',
  'Revisión retrospectiva cada 4 sesiones, y entre la 3.ª y la 4.ª sesión, un pronóstico explícito (Hengeveld y Banks 2005, cap. 5, p. 106; cap. 8, p. 233).',
  'Si se estanca, pausa de unas 2 semanas; si mejoró, 2–3 semanas más sin tratamiento o el alta; si sigue igual, 4–5 sesiones más y otra pausa (Hengeveld y Banks 2005, cap. 5, pp. 106–108; Maitland 2005, cap. 9, pp. 219–220). Devolver al médico si los signos no siguen los patrones habituales o el paciente no mejora (Maitland 2005, cap. 9, p. 223).',
];

export const REGLA_RADICULAR_SEVERA = 'Con dolor radicular severo, la mejoría puede tardar 7–10 días en notarse (Maitland 2005, cap. 9, p. 217).';

// Hipótesis con compromiso de la raíz o del tejido nervioso, por id (nunca por
// el nombre: renombrar una hipótesis no debe cambiar el plan). Un test exige
// que toda hipótesis de una región de REGIONES_PLAN cuyo nombre suene a
// neurológica («radicul», «estenosis», «neuro») esté en EXPLORACION_NEURO o en
// NEURO_DESCARTADAS con su motivo.
//  · EXPLORACION_NEURO: exploración neurológica al empezar cada sesión
//    (Maitland 2005, cap. 6, p. 136).
//  · RADICULARES: además, la regla de los 7–10 días, y solo con NRS registrado
//    de 8 o más (Maitland 2005, cap. 9, p. 217, que habla de dolor radicular
//    severo, no de la estenosis).
export const HIP_EXPLORACION_NEURO = [
  'lu3', 'lu4', 'lu5',   // lumbar: dolor radicular, estenosis, radiculopatía
  'ce3', 'ce12',         // cervical: radiculopatía, dolor radicular
];
export const HIP_RADICULARES = ['lu3', 'lu5', 'ce3', 'ce12'];
//  · NERVIO_PERIFERICO: atrapamiento de un nervio periférico, no de la raíz ni
//    de la médula (decisión 65): sensibilidad y fuerza en su territorio al
//    empezar cada sesión, sin red de seguridad neurológica ni regla de días
//    (la de 7–10 días es del dolor radicular severo; decisión 48).
export const HIP_NERVIO_PERIFERICO = [
  'co8', 'co9', 'co13',  // codo: cubital, radial / interóseo posterior, mediano / pronador
  'ro19',                // rodilla: peroneo común en la cabeza del peroné (decisión 73)
  'ca7', 'ca14',         // cadera: ciático en el espacio glúteo profundo; cutáneo femoral lateral, obturador, ilioinguinal… (decisión 82)
];
export const HIP_NEURO_DESCARTADAS = {
  ce2: 'Disfunción neuromuscular cervical: déficit de control motor (coordinación, propiocepción), no compromiso de la raíz ni de la médula.',
  ca6: 'Disfunción de control neuromuscular de cadera: déficit de control motor (activación, coordinación), no compromiso de un nervio ni de la raíz.',
};

// Red de seguridad de cada región (claves de TEXTOS_SESION para el cierre y de
// TEXTOS_CASA para el programa para casa). `neuro`: solo con una hipótesis de
// HIP_EXPLORACION_NEURO; `siempre`: con cualquier plan de la región. Cada
// texto, con los síntomas del razonamiento de una pregunta de la fase 2 ya
// revisada: lumbar, l6 (cola de caballo); cervical, cv3 (médula) y cv_ar1 y
// cv_ar2 (arterias cervicales: el plan incluye terapia manual cervical).
// Una región sin entrada no tiene red de seguridad propia en la fase 6.
export const RED_SEGURIDAD = {
  lumbar: { neuro: { cierre: 'cierreNeuro', casa: 'alarmaNeuro' } },
  cervical: {
    neuro: { cierre: 'cierreMedula', casa: 'alarmaMedula' },
    siempre: { cierre: 'cierreArterial', casa: 'alarmaArterial' },
  },
  // Hombro (decisión 53): cardiaca siempre, del razonamiento de h_c4. El
  // ectópico (h_g1) y la rotura de bazo (h_gi4) no van al programa para casa.
  hombro: { siempre: { cierre: 'cierreCardiaco', casa: 'alarmaCardiaca' } },
  // Codo (decisión 70): infección siempre, del razonamiento de co1. No van al
  // programa para casa el traumatismo (co_t1, co_t2: los dispara una caída
  // nueva, no el programa) ni las posquirúrgicas (pq_*: manda el cirujano).
  codo: { siempre: { cierre: 'cierreInfeccion', casa: 'alarmaInfeccion' } },
  // Rodilla (decisión 79): dos de siempre, infección (r1, r_i3) y TVP (r_v2,
  // con la embolia de pq_tep). `siempre` admite una lista. No van al programa
  // para casa la isquemia aguda (r_v4), el traumatismo (ro_t2–ro_t4) ni las
  // demás posquirúrgicas (pq_*: manda el cirujano).
  rodilla: { siempre: [
    { cierre: 'cierreInfeccionRodilla', casa: 'alarmaInfeccionRodilla' },
    { cierre: 'cierreTVP', casa: 'alarmaTVP' },
  ] },
  // Cadera (decisión 88): tres de siempre, la fractura de estrés del cuello
  // femoral (ca_os1 y el recuadro de urgencia: la dispara la carga, y el
  // programa para casa añade carga), la infección (ca_in1, ca_in3) y la TVP
  // (ca_v2, pq_tep; la misma que rodilla). No van al programa para casa el
  // aneurisma (ca_v4) ni la isquemia aguda (ca_v5), la torsión testicular
  // (ca_u3) ni el ectópico (ca_u5): episodios propios que el programa no
  // dispara; ni las demás posquirúrgicas (pq_*: manda el cirujano).
  cadera: { siempre: [
    { cierre: 'cierreFracturaEstres', casa: 'alarmaFracturaEstres' },
    { cierre: 'cierreInfeccionCadera', casa: 'alarmaInfeccionCadera' },
    { cierre: 'cierreTVP', casa: 'alarmaTVP' },
  ] },
};

// Hipótesis de otra región cuya pauta trae terapia manual de la columna
// cervical, por id: añaden la red de seguridad arterial de cervical (decisión
// 50; el mismo motivo que la decisión 39).
export const RED_HIP = { h6: { cierre: 'cierreArterial', casa: 'alarmaArterial' } };

// Programa para casa: lo único que ve el paciente. Lenguaje llano, sin
// puntuaciones ni fuentes en el texto; `fuente` solo para la revisión
// (docs/plan-tratamiento-frases.md). null = redacción propia.
export const TEXTOS_CASA = {
  titulo: { texto: 'PROGRAMA PARA CASA', tipo: 'etiqueta' },
  queHacer: { texto: 'Qué hacer:', tipo: 'etiqueta' },
  cuandoHacerlo: { texto: 'Cuándo hacerlo:', tipo: 'etiqueta' },
  cuandoParar: { texto: 'Cuándo parar:', tipo: 'etiqueta' },
  alDiaSiguiente: { texto: 'Al día siguiente:', tipo: 'etiqueta' },
  alDiaSiguienteDefecto: { texto: 'Fíjate en cómo estás a las 24 horas y anótalo para la próxima sesión.', fuente: 'Maitland 2005, cap. 9, p. 219 y tabla 9.3 (respuesta a las 24–48 h)' },
  primeraSesion: { texto: 'Después de esta primera sesión puedes notar un aumento temporal de las molestias.', fuente: 'Maitland 2005, cap. 9, p. 219; Hengeveld y Banks 2005, cap. 9, p. 243' },
  // Solo con el plan A (1 sesión por semana), decisión 62: el libro advierte que
  // anotar puede hacer que algunos pacientes se fijen demasiado en sus síntomas.
  anotarAumento: { texto: 'Si las molestias aumentan, apunta qué estabas haciendo y qué te ayudó.', fuente: 'Hengeveld y Banks 2005, cap. 9, p. 247 (registro escrito por el paciente)' },
  cirujano: { texto: 'Sigue siempre las indicaciones de tu cirujano.', fuente: 'decisión posquirúrgica: el protocolo del cirujano manda (docs/posquirurgico.md; principio 3 de docs/plan-tratamiento.md)' },
  empeora: { texto: 'Si empeoras claramente o notas algo nuevo, coméntalo con tu fisioterapeuta antes de la próxima sesión.', tipo: 'redaccion' },
  // Solo con hipótesis de HIP_EXPLORACION_NEURO: síntomas de la lista del
  // razonamiento de l6 (data/lumbar.js), en lenguaje llano.
  alarmaNeuro: { texto: 'Si notas adormecimiento entre las piernas o alrededor del ano, o cambios al orinar o al hacer de vientre, ve a urgencias hoy mismo.', fuente: 'Finucane 2020, sección 2 (síndrome de cola de caballo), pp. 9–17: explicar al paciente qué vigilar y qué hacer (red de seguridad)' },
  // Cervical (RED_SEGURIDAD): síntomas del razonamiento de cv3 y de cv_ar1 y
  // cv_ar2 (data/cervical.js), en lenguaje llano. El mareo solo no está: aislado
  // pesa poco (cv_ar2) y el paciente con ce13 ya lo tiene.
  alarmaMedula: { texto: 'Si notas torpeza nueva en las manos (al abrocharte o al escribir), inestabilidad o las piernas pesadas al caminar, o cambios al orinar o al hacer de vientre, ve a urgencias hoy mismo.', fuente: 'Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy»: anamnesis y exploración), como en el razonamiento de cv3: con signos nuevos o que van a más, la derivación es urgente' },
  // Hombro (RED_SEGURIDAD): síntomas del razonamiento de h_c4 (data/hombro.js).
  alarmaCardiaca: { texto: 'Si notas dolor u opresión en el pecho, el hombro, el brazo, el cuello, la mandíbula o la espalda que no se pasa al parar en unos 20 minutos, o que te viene con sudor frío, náuseas, vómitos o falta de aire, llama al 112.', fuente: 'Goodman 2018, cap. 6, pp. 236 y 260, como en el razonamiento de h_c4: un infarto puede doler solo en el hombro o el brazo; intervención médica inmediata si el dolor no cede en 20 minutos o viene con náuseas, vómitos o sudor' },
  // Codo (RED_SEGURIDAD): síntomas del razonamiento de co1 (data/codo.js), en
  // lenguaje llano; «aunque no tengas fiebre» porque falta en el 40–60 %.
  alarmaInfeccion: { texto: 'Si el codo se te pone rojo, caliente e hinchado, aunque no tengas fiebre, ve hoy mismo al médico o a urgencias.', fuente: 'Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Pangia 2025 (StatPearls, «Olecranon Bursitis»), como en el razonamiento de co1: la artritis séptica es una emergencia y la fiebre solo aparece en el 40–60 %; en la bursitis séptica del olécranon, enrojecimiento en el 83 %, calor en el 84 % y fiebre en el 38 %' },
  // Rodilla (RED_SEGURIDAD): síntomas del razonamiento de r1 y r_i3 (infección;
  // «aunque no tengas fiebre», que falta en el 40–60 %) y de r_v2 y pq_tep (TVP
  // y embolia; data/rodilla.js y data/comun.js), en lenguaje llano.
  alarmaInfeccionRodilla: { texto: 'Si la rodilla, o la zona de delante de la rótula, se te pone roja, caliente e hinchada, aunque no tengas fiebre, ve hoy mismo al médico o a urgencias.', fuente: 'Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Truong 2023 (StatPearls, «Septic Bursitis»), como en el razonamiento de r1 y r_i3: la rodilla es la articulación más afectada en el adulto, la artritis séptica es una urgencia y la fiebre solo aparece en el 40–60 %; en la bursitis séptica la fiebre puede faltar' },
  alarmaTVP: { texto: 'Si se te hincha la pantorrilla, o la notas caliente, más roja o dolorida que la otra, ve hoy mismo al médico o a urgencias. Si además te falta el aire de repente o te duele el pecho al respirar, llama al 112.', fuente: 'Waheed 2023 (StatPearls, «Deep Venous Thrombosis») y NICE NG158, como en el razonamiento de r_v2: valoración médica en el día; Vyas 2024 (StatPearls, «Acute Pulmonary Embolism»), como en el de pq_tep: con falta de aire o dolor al respirar, 112; NICE NG89 pide explicar al paciente estos síntomas al alta tras una prótesis de rodilla o de cadera (profilaxis de 14 días tras la de rodilla, 28 tras la de cadera y un mes tras una fractura de cadera, como en el razonamiento de pq_tvp)' },
  // Cadera (RED_SEGURIDAD, decisión 88): síntomas del razonamiento de ca_os1
  // (fractura de estrés del cuello femoral; si se sigue cargando puede
  // completarse) y de ca_in1 y ca_in3 (infección de la cadera o de la prótesis),
  // en lenguaje llano. La TVP usa alarmaTVP, la misma que rodilla.
  alarmaFracturaEstres: { texto: 'Si el dolor de la ingle o de la cadera va a más al apoyar el peso o con la actividad, y empieza a dolerte también de noche, deja la actividad que lo empeora (correr, saltar) y ve hoy mismo al médico.', fuente: 'Lluch 2020, Goodman 2018 y May y Marappa-Ganeshan 2023, como en el razonamiento de ca_os1 y el recuadro de urgencia de cadera: la fractura de estrés del cuello femoral es de alto riesgo y, si se sigue cargando, puede completarse y desplazarse; dolor que empeora con la carga y aparece de noche; derivación urgente, y una radiografía negativa no la descarta' },
  alarmaInfeccionCadera: { texto: 'Si la cadera te empieza a doler mucho, hasta el punto de no poder apoyar la pierna, y tienes fiebre o te encuentras mal en general, ve hoy mismo a urgencias. Si tienes una prótesis y aparece un dolor nuevo que no se calma en reposo y sigue de noche, sobre todo después de una infección, ve al médico.', fuente: 'Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Goodman 2018, como en el razonamiento de ca_in1 (artritis séptica: urgencias hoy; la fiebre solo aparece en el 40–60 %) y de ca_in3 (prótesis con una infección reciente y dolor nuevo, o dolor que no cede en reposo y sigue de noche: derivación médica)' },
  alarmaArterial: { texto: 'Si te empieza de golpe un dolor de cabeza o de cuello distinto a cualquiera que hayas tenido, o notas visión doble, dificultad para hablar o tragar, inestabilidad al caminar o caídas sin perder el conocimiento, ve a urgencias hoy mismo.', fuente: 'Rushton 2023 (marco IFOMPT cervical), tablas 1–2 y 6, pp. 9–12, como en el razonamiento de cv_ar1 y cv_ar2: disección arterial e insuficiencia vertebrobasilar; los síntomas neurológicos pueden llegar días después' },
};

// Cómo cuenta cada texto que no cita fuente en el propio texto, para el
// documento de revisión (tests/frases-plan.mjs). Sin entrada = redacción propia.
//  · app: describe cómo funciona la app, no afirma nada clínico.
//  · decision:N / principio:N: una decisión o un principio de docs/plan-tratamiento.md.
//  · organizacion: organización de la sesión (orientativa, editable), no evidencia.
export const TIPO_TEXTO = {
  'TEXTO_NIVELES.A': 'app', 'TEXTO_NIVELES.B': 'app', 'TEXTO_NIVELES.C': 'app', 'TEXTO_NIVELES.aIgual': 'app',
  'AVISOS.propuesta': 'principio:4',
  'AVISOS.soloTerapiaManual': 'decision:20',
  'AVISOS.sinNRS': 'decision:27', 'AVISOS.difiereFase3': 'decision:25', 'AVISOS.estimada': 'decision:12',
  'AVISOS.breveSinTests': 'app', 'AVISOS.dosHipotesis': 'decision:10',
  'AVISOS.dosificaOtro': 'decision:35', 'AVISOS.independiente': 'decision:35',
  'AVISOS.dosFamilias': 'decision:50',
  'TEXTOS_SESION.educacionBase': 'organizacion', 'TEXTOS_SESION.domiciliario': 'organizacion',
};

// Hoja de registro de cada sesión, común a todas las regiones (decisiones 24 y
// 60): la tabla 9.3 del libro vertebral con el detalle del periférico.
export const FUENTE_REGISTRO = 'Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246';
export const HOJA_REGISTRO = [
  'Refiere el paciente: lo primero, su opinión sobre la sesión anterior, en sus palabras y comparada con antes',
  'Signos: cambios en los signos marcados, también comparados con antes',
  'Plan: técnica elegida y por qué',
  'Tratamiento: posición del paciente y de la articulación, técnica (con su inclinación), nivel en la columna, grado, ritmo, duración (repeticiones o tiempo) y respuesta mientras se aplica',
  'Después: lo que refiere el paciente y los signos',
  'Indicaciones dadas: información, ejercicios y avisos',
  'Para la siguiente sesión: qué cambiar y por qué',
];

// Qué comparar en las reevaluaciones intermedia y final del mes (revisión
// retrospectiva; decisión 63).
export const FUENTE_RETROSPECTIVA = 'Hengeveld y Banks 2005, cap. 9, p. 246';
export const REEVALUACION_RETROSPECTIVA = [
  'Bienestar general, comparado con unas sesiones antes',
  'Síntomas y nivel de actividad, comparados',
  'Efecto de cada intervención hasta ahora (exploración y movimientos pasivos)',
  'Efecto de las indicaciones, recomendaciones y ejercicios',
  'Qué ha aprendido el paciente y qué le ha sido más útil',
  'Objetivos de la siguiente fase del tratamiento, acordados con el paciente',
];

// Fuentes de la fase (claves de data/referencias.js), para docs/referencias.md.
export const FUENTES_PLAN = ['Petersen 2021', 'Maitland 2005', 'Hengeveld y Banks 2005', 'Barakatt 2009', 'Zusman 1998', 'Finucane 2020', 'Margetis y Donnally 2025', 'Rushton 2023', 'Goodman 2018', 'Kuijper 2009', 'Blanpied 2017', 'Reid 2014', 'Kelley 2013', 'Salamh 2025', 'Quzli 2025', 'Wistow 2025', 'Lluch 2020', 'Momodu y Savaliya 2023', 'Pangia 2025', 'NICE NG226', 'Prill 2025', 'Willy 2019', 'Balcarek 2025', 'Rathleff 2020', 'Truong 2023', 'Waheed 2023', 'NICE NG158', 'Vyas 2024', 'NICE NG89', 'Koc 2025', 'Enseki 2023', 'Mellor 2018', 'Rich 2025', 'Serner 2020', 'Hölmich 1999', 'May y Marappa-Ganeshan 2023'];
