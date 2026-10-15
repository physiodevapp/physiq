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
export const REGIONES_PLAN = ['lumbar', 'cervical', 'hombro'];

// Familia de cada región para los escalones, la cantidad por sesión, la
// progresión y las reglas del mes (decisiones 43–46): columna = Maitland 2005
// (Vertebral); el resto de regiones del plan = Hengeveld y Banks 2005
// (Peripheral). Sin región se toma columna, como antes de L3.
export const REGIONES_COLUMNA_PLAN = ['lumbar', 'cervical'];

// Hipótesis de una región periférica cuya terapia manual va a la columna, por
// id: usan la familia columna (decisión 50).
export const FAMILIA_HIP = { h6: 'columna' };

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
};

// Avisos con mecanismo Post-quirúrgico en una región periférica (decisión 47):
// condicional, porque la app no sabe si la cirugía fue una prótesis.
export const AVISOS_POSQ_PERIFERICA = ['protesis'];

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
  reevaluacionSiguiente: 'Cómo reaccionó a la sesión anterior, en sus palabras y comparado con antes («D más 1», Maitland 2005, cap. 6, p. 156; cap. 9, tabla 9.3).',
  reevaluacionRadicular: 'Exploración neurológica al empezar; si empeora, comunicarlo al médico (Maitland 2005, cap. 6, p. 136).',
  educacionBase: 'Explicar la hipótesis y el plan, y lo que puede notar.',
  educacionPrimera: 'Avisar de un posible aumento temporal de los síntomas tras esta primera sesión (Maitland 2005, cap. 9, p. 219).',
  primeraSesion: 'Primera sesión: menos tratamiento que en las siguientes, porque el primer estiramiento provoca más reacción (Maitland 2005, cap. 9, p. 219).',
  cantidad: 'Evaluar antes, durante y después de cada técnica; unas 3–4 movilizaciones de unos 30 s por articulación, la mitad si duele mucho (Maitland 2005, cap. 9, pp. 213, 216 y 219).',
  // Regiones periféricas (decisión 44)
  cantidadPeriferica: 'Evaluar antes, durante y después de cada técnica. Con dolor: técnicas de 30 s a 2 min, una o dos veces, lentas y suaves. Con rigidez: unos 2 min de estiramiento oscilatorio, alternando fisiológicos y accesorios al límite, 3–4 veces en la sesión inicial; de media, 4–5 min por articulación cada vez. Con dolor y rigidez, estirar 3 o más veces, 1–2 min cada una (Hengeveld y Banks 2005, cap. 5, pp. 97–102; cap. 7, p. 175; cap. 8, pp. 192, 197–198 y 201).',
  // Pautas con volumen propio (VOLUMEN_PAUTA): mandan sobre la cantidad genérica.
  cantidadReid: 'Mareo cervicogénico: el volumen es el de su pauta, que manda sobre la cantidad genérica: SNAG de Mulligan, 6 repeticiones (sin síntomas en la primera sesión); o movilización de Maitland de hasta 3 niveles cervicales altos, normalmente 3 aplicaciones de 30 s por nivel (Reid 2014).',
  domiciliario: 'Enseñar y comprobar lo que hará en casa.',
  cierre: 'Reevaluar el signo comparable y explicar qué vigilar hasta la próxima sesión (Maitland 2005, cap. 9, p. 213 y tabla 9.3, «Después»).',
  cierreNeuro: 'Red de seguridad: explicar qué síntomas exigen ir a urgencias (adormecimiento entre las piernas o alrededor del ano, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Finucane 2020, sección 2, pp. 9–17).',
  cierreMedula: 'Red de seguridad: explicar qué síntomas exigen ir a urgencias (torpeza nueva en las manos, inestabilidad o piernas «pesadas» al caminar, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Margetis y Donnally 2025, anamnesis y exploración).',
  cierreCardiaco: 'Red de seguridad: explicar qué síntomas exigen llamar al 112 (dolor u opresión en el pecho, el hombro, el brazo, el cuello, la mandíbula o la espalda que no se pasa al parar en unos 20 minutos, o que viene con sudor frío, náuseas, vómitos o falta de aire) y comprobar que lo ha entendido (Goodman 2018, cap. 6, pp. 236 y 260, como en el razonamiento de h_c4).',
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
      'Maitland evalúa la respuesta a las 24–48 h y pide sesiones lo bastante frecuentes para valorar el efecto; con una por semana la comparación es semanal (Maitland 2005, cap. 9, p. 219 y tabla 9.3). Pedir al paciente que anote cómo estuvo a las 24 h de cada sesión.',
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
export const HIP_NEURO_DESCARTADAS = {
  ce2: 'Disfunción neuromuscular cervical: déficit de control motor (coordinación, propiocepción), no compromiso de la raíz ni de la médula.',
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
  primeraSesion: { texto: 'Después de esta primera sesión puedes notar un aumento temporal de las molestias.', fuente: 'Maitland 2005, cap. 9, p. 219' },
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

// Hoja de registro de cada sesión (decisión 24; Maitland 2005, cap. 9, tabla 9.3, p. 226).
export const HOJA_REGISTRO = [
  'Refiere el paciente: cambios desde la sesión anterior, en sus palabras y comparados con antes',
  'Signos: cambios en los signos marcados',
  'Plan: técnica elegida y por qué',
  'Tratamiento: técnica, grado, nivel, repeticiones y efecto mientras se aplica',
  'Después: lo que refiere el paciente y los signos',
  'Para la siguiente sesión: qué cambiar y por qué',
];

// Fuentes de la fase (claves de data/referencias.js), para docs/referencias.md.
export const FUENTES_PLAN = ['Petersen 2021', 'Maitland 2005', 'Hengeveld y Banks 2005', 'Barakatt 2009', 'Zusman 1998', 'Finucane 2020', 'Margetis y Donnally 2025', 'Rushton 2023', 'Goodman 2018', 'Kuijper 2009', 'Blanpied 2017', 'Reid 2014', 'Kelley 2013', 'Salamh 2025'];
