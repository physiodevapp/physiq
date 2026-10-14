// Fase 6 «Plan de tratamiento»: contenido clínico de la parte sin IA.
// Diseño y las 24 decisiones: docs/plan-tratamiento.md (léelo antes de cambiar
// nada). La lógica vive en lib/plan-tratamiento.js; aquí solo los textos, cada
// uno con su fuente leída (claves de data/referencias.js en `fuentes`).
//
// Ninguna fuente da minutos, series ni cargas: todo lo que hay aquí es
// cualitativo. La dosis de la intervención es siempre la pauta citada de la
// hipótesis (decisión 7: sin pauta, «a criterio del fisio»).

// Regiones con la fase 6 activa. Piloto: lumbar (decisión L2); el resto entra
// en L3, región a región, con revisión clínica.
export const REGIONES_PLAN = ['lumbar'];

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
};

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
  domiciliario: 'Enseñar y comprobar lo que hará en casa.',
  cierre: 'Reevaluar el signo comparable y explicar qué vigilar hasta la próxima sesión (Maitland 2005, cap. 9, p. 213 y tabla 9.3, «Después»).',
  cierreNeuro: 'Red de seguridad: explicar qué síntomas exigen ir a urgencias (adormecimiento entre las piernas o alrededor del ano, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Finucane 2020, sección 2, pp. 9–17).',
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

// Criterio de progresión genérico, cuando la pauta no trae el suyo (decisión 14).
export const PROGRESION_GENERICA = 'Si la pauta trae su propio criterio de progresión, ese manda. Si no: al principio lo mínimo que no provoque recaída; reintroducir lo que agravaba cuando baje la irritabilidad; progresar al ritmo de la curación y de los síntomas; reevaluar dentro de la sesión y entre sesiones (Petersen 2021; Zusman 1998).';

// Reglas de seguir o cambiar (decisión 22).
export const REGLAS_MES = [
  'Si una técnica no cambia nada, repetirla más firme; si sigue sin cambio, descartarla. Si mejora, repetirla; si empeora, no repetirla (Maitland 2005, cap. 9, pp. 213–214).',
  'Si se espera una mejora lenta, no cambiar una técnica antes de usarla dos sesiones o más (Maitland 2005, cap. 9, pp. 214 y 216).',
  'Con una mejora del 75 % o más en una sesión, no subir la dosis: esperar 48 h o repetir igual o menos (Maitland 2005, cap. 9, p. 216).',
  'La movilización que funciona debería mostrar una mejora marcada en 4–5 días (Maitland 2005, cap. 9, p. 220).',
  'Sin cambio en 10–14 días, pausa y reevaluación a los 7–14 días; devolver al médico si los signos no siguen los patrones habituales o el paciente no mejora (Maitland 2005, cap. 9, pp. 219–220 y 223).',
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
export const HIP_EXPLORACION_NEURO = ['lu3', 'lu4', 'lu5'];   // dolor radicular, estenosis, radiculopatía
export const HIP_RADICULARES = ['lu3', 'lu5'];
export const HIP_NEURO_DESCARTADAS = {};

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
export const FUENTES_PLAN = ['Petersen 2021', 'Maitland 2005', 'Barakatt 2009', 'Zusman 1998', 'Finucane 2020'];
