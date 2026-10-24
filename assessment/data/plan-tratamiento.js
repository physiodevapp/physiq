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
// (decisiones 81–89). Tobillo y pie (L3), la quinta y última periférica
// (decisiones 90–98): con ella están las siete regiones.
export const REGIONES_PLAN = ['lumbar', 'cervical', 'hombro', 'codo', 'rodilla', 'cadera', 'tobillo_pie'];

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
  aIgual: 'Una sola propuesta: B es la que se ajusta a esta gravedad e irritabilidad, y ya es el escalón más suave. A sería uno menos y no lo hay.',
};

// Avisos de la parte superior de la fase.
export const AVISOS = {
  // Disautonomía / POTS (Fase P, docs/pots.md): con la tarjeta de la fase 1
  // activa, en todas las regiones (AVISOS_DISAUTONOMIA)
  disautonomia: 'Disautonomía: empezar el ejercicio semirreclinado, tumbado o en el agua (no muy caliente) y añadir lo vertical poco a poco (Raj 2020, rec. 14; en Fu 2010 y George 2016, hacia el final del 2.º mes); mejor dinámico que isométrico, no comer en la hora anterior y terminar con una vuelta a la calma suave (Hakim 2017, p. 172). Evitar estar mucho rato de pie quieto en la sesión (Raj 2020, p. 367). La mejoría puede tardar 4–6 semanas (Raj 2020, p. 368).',
  // Lupus (Fase P, docs/lupus.md): con la tarjeta en «Diagnosticado», en todas
  // las regiones (AVISOS_LUPUS); los otros tres según las filas de la tarjeta
  // Trastorno mastocitario o anafilaxia (Fase P, docs/mastocitaria.md): con la
  // tarjeta marcada, en todas las regiones (AVISOS_MASTOCITOS)
  mastocitos: 'Trastorno mastocitario o anafilaxia: que traiga su autoinyector a cada sesión (NICE NG258, 1.1.16); evitar lo que ya le ha provocado episodios, no una lista de todos los descritos (Brockow 2021). Si el calor o el frío se los han provocado, sin termoterapia ni crioterapia y con la sala templada (Muñoz 2024). No hace falta dejar el ejercicio: en la anafilaxia por ejercicio, las guías piden mantenerlo, acompañado y con el autoinyector a mano (Srisuwatchari 2023, tabla 2; extenderlo a la mastocitosis es una inferencia). Si un alimento con el ejercicio le ha dado episodios, no tomarlo en las horas de antes y después del ejercicio (Srisuwatchari 2023, tabla 2).',
  lupus: 'Lupus: intensidad moderada, con aeróbico y fuerza, individualizada y supervisada por un fisioterapeuta (Blaess 2024, recs. 9, 11 y 14); antes de empezar, su médico valora las contraindicaciones (Blaess 2024, rec. 10). Fotoprotección para prevenir brotes (Parodis 2024, rec. LES 2) y evitar el ejercicio al sol con un índice UV por encima de 3 (opinión de los autores de Frade 2023).',
  lupusBrote: 'Lupus en brote o peor sin valorar: que su reumatólogo revalore las contraindicaciones antes de seguir (Blaess 2024, rec. 4); en un brote articular, no cargar las articulaciones inflamadas (Blaess 2024, rec. 5).',
  // Osteoporosis o fragilidad ósea (Fase P, docs/osteoporosis.md): con la
  // tarjeta marcada, en todas las regiones (AVISOS_OSTEOPOROSIS); el impacto,
  // según las fracturas; `sinThrust*`, el tope de la decisión 6 y la 15
  osteoporosis: 'Osteoporosis: fuerza progresiva 2–3 días por semana, hasta el peso que levanta 8–12 veces, en 2 series y hasta 3, con movimientos lentos y controlados, sin flexión con carga; si el riesgo de fractura vertebral es alto, sin máquinas que obliguen a flexionar o girar el tronco (Brooke-Wavell 2022, recuadro 1; Giangregorio 2014). Equilibrio a diario, 15–20 min (Giangregorio 2014).',
  // Embarazo o posparto (Fase P, docs/embarazo-posparto.md): con la tarjeta
  // marcada, en cualquier región (AVISOS_EMBARAZO / AVISOS_POSPARTO).
  embarazo: 'Embarazo: actividad de intensidad moderada (puede hablar, no cantar), con aeróbico y fuerza; sin contacto ni riesgo de caída; si se marea, tiene náuseas o se encuentra mal boca arriba, ponerla de lado; parar si sangra, pierde líquido, tiene contracciones regulares y dolorosas, dolor de vientre o de pecho, o falta de aire o mareo que no ceden (Mottola 2018; ACOG 2020).',
  posparto: 'Posparto: vuelta gradual guiada por los síntomas, sin autorización médica de rutina; consultar antes con su médico con tensión de más de 140/90, dolor en el pecho, falta de aire en reposo, mareo o sangrado sin regla; el dolor lumbar o de cintura pélvica, la incontinencia y la diástasis no contraindican el ejercicio (Davenport 2025). Con síntomas de suelo pélvico, fisioterapia de suelo pélvico (NICE NG210, 1.6.14).',
  lactancia: 'Da el pecho: mejor dar el pecho o sacarse leche antes del ejercicio, por comodidad (Davenport 2025).',
  terapiaManualEmbarazo: 'Embarazo o posparto: la terapia manual, como complemento y nunca sola; como mucho, para probar el alivio en pocas sesiones (Hall 2016; Simonds 2022; Vleeming 2008, nivel D). Del thrust en el embarazo solo hay un ensayo piloto de 15 mujeres sin efectos adversos (Liddle y Pennick 2015): no basta para decir que sea seguro.',
  sacroiliacaEmbarazo: 'Sacroilíaca en el embarazo o el posparto: primero información (no es peligroso y probablemente mejorará) y ejercicio individualizado, o estabilización individualizada tras el parto (Vleeming 2008, nivel C); el cinturón, para probar el alivio por periodos cortos (Vleeming 2008, nivel D; NICE NG201, 1.4.15).',
  osteoporosisImpacto: 'Osteoporosis sin fractura vertebral: impacto moderado la mayoría de los días, unos 50 impactos por sesión, sin caer desde altura (Brooke-Wavell 2022, consenso).',
  osteoporosisImpactoLimitado: 'Osteoporosis con fractura vertebral o varias fracturas por fragilidad: impacto solo hasta caminar a paso ligero, por precaución (Brooke-Wavell 2022, consenso; Giangregorio 2014).',
  osteoporosisMoverse: 'Osteoporosis: enseñar a moverse con seguridad, sin prohibir: bisagra de cadera al agacharse y levantar; la torsión, suave y mejor girando con pasos; no levantar ni dejar cosas en el suelo (Brooke-Wavell 2022, recuadro 3; Giangregorio 2015). Cuidado al pasar de tumbado a sentado o al darse la vuelta: en un ensayo, ejercicios en prono y darse la vuelta de boca arriba a boca abajo rompieron una costilla y un cartílago costal (Gibbs 2019). Con lluvia o hielo, el ejercicio mejor dentro de casa (Giangregorio 2014).',
  sinThrustOsteoporosis: 'Osteoporosis: sin manipulación con thrust en la columna ni en las costillas; la movilización suave puede ser adecuada (Maitland 2005, cap. 9, p. 223; Puentedura 2015, tabla 1). Los escalones no proponen grado V; si la pauta de una hipótesis incluye manipulación, aquí no se aplica.',
  sinThrustLupus: 'Lupus con corticoides mantenidos: sin manipulación con thrust en la columna torácica (Puentedura 2015, tabla 1: corticoides a largo plazo, contraindicación absoluta). Si la pauta de una hipótesis incluye manipulación, aquí no se aplica.',
  // Anticoagulado o antiagregado (Fase P, docs/anticoagulado.md): `anticoagulado`
  // con la tarjeta marcada, en cualquier región; el tope «sin thrust» solo con
  // anticoagulante (decisión 4); punción seca y ondas de choque solo en las
  // hipótesis cuya pauta las recomienda (HIP_PUNCION_SECA, HIP_ONDAS_CHOQUE).
  anticoagulado: 'Anticoagulado o antiagregado: precaución con lo que tenga riesgo de golpe (lo recomiendan para el lupus: Blaess 2024, rec. 3); un esfuerzo mecánico pequeño puede dar un sangrado importante (Kim 2026, un caso). De la movilización, el masaje, la presión profunda y los estiramientos no hay ninguna norma con anticoagulantes, solo casos de sangrado (Tominaga 2023; Kwon 2024; Kim 2026). Antes de cada técnica, pregunta si desde la última sesión se ha dado un golpe o ha notado un hematoma o un dolor nuevos. No le digas que deje el fármaco ni que se salte una dosis (Steffel 2021).',
  sinThrustAnticoagulante: 'Anticoagulante: sin manipulación con thrust en la columna torácica (Puentedura 2015, tabla 1: contraindicación absoluta); en la cervical, otra tabla lo trata como precaución (Hutting 2018, opinión de los autores). Las dos son opinión de expertos y ninguna distingue fármacos ni da un INR. Los escalones no proponen grado V; si la pauta de una hipótesis incluye manipulación, aquí no se aplica.',
  anticoaguladoPuncion: 'Anticoagulado o antiagregado, y la pauta incluye punción seca: no existe ningún estudio con antitrombóticos; una revisión narrativa y un consenso que se apoya en ella dicen que no es una contraindicación absoluta (Muñoz 2022; Waterway 2026), y según otra revisión la guía suiza sí la trata así con la anticoagulación (Malfait 2024). Práctica de los autores de la primera: empezar por músculos superficiales viendo cómo sangra, evitar al principio los profundos que no se pueden comprimir y comprimir 10–15 s (Muñoz 2022). Sin INR límite.',
  anticoaguladoOndas: 'Anticoagulado o antiagregado, y la pauta incluye ondas de choque: sin consenso entre expertos sobre aplicarlas con anticoagulantes, y el hematoma es un efecto posible (Rhim 2025); se consideran un factor importante a valorar, sin datos con anticoagulados (Tenforde 2022).',
  lupusRaynaud: 'Lupus con Raynaud: al aire libre, guantes o ropa contra el frío; evitar tocar superficies frías y secar bien la piel durante y después del ejercicio (Blaess 2024, rec. 2). Por lo mismo, cuidado con el frío local en manos y pies (inferencia, sin fuente propia).',
  // Hipermovilidad, subtipo vascular diagnosticado (Fase P, docs/hipermovilidad.md):
  // en cualquier región, nunca con la sospecha; el mismo texto que el recuadro de
  // la fase 5 (HM.textos.vascular, data/comun.js). Sin tope ni red propios.
  hipermovilidadVascular: 'Ehlers-Danlos vascular (diagnosticado): evitar deportes de colisión, ejercicio isométrico y aceleraciones bruscas; intensidad que permita conversar, control de la respiración al levantar peso y cargas ligeras (Byers 2017, p. 42).',
  disautonomiaHM: 'Disautonomía con hipermovilidad: adaptar además el ejercicio a la hipermovilidad, la inestabilidad y las lesiones (Hakim 2017, p. 172).',
  orientativo: 'Nivel orientativo: el juicio de irritabilidad varía entre fisioterapeutas (acuerdo del 71 %, kappa 0,39–0,44; Barakatt 2009). Puedes cambiar la gravedad y la irritabilidad.',
  propuesta: 'Es una propuesta, no una prescripción: la decide y la firma el fisioterapeuta.',
  soloTerapiaManual: 'Los escalones se refieren a la terapia manual de la pauta. Para el ejercicio, la dosis es la de la pauta.',
  miedo: 'Bandera amarilla (miedo al movimiento o riesgo psicosocial alto): tenlo presente al educar y al progresar. No bloquea la propuesta C (Petersen 2021 incluye las banderas amarillas en la «naturaleza» del cuadro).',
  sinNRS: 'Sin NRS registrado: se toma la gravedad más alta, que es la opción prudente. Cámbiala si la conoces, o registra el NRS en la fase 3.',
  incompleta: 'Irritabilidad calculada con la matriz de la fase 3 incompleta (falta el tiempo en calmarse u otra fila): puede quedarse corta. Complétala o cámbiala aquí si la conoces.',
  sinIrritabilidad: 'Sin irritabilidad registrada en la fase 3: se toma la alta, que es la opción prudente. Cámbiala si la conoces, o completa la matriz en la fase 3.',
  estimada: 'Irritabilidad estimada (elegida directamente, sin la matriz).',
  breveSinTests: 'Hipótesis de trabajo, pendiente de confirmar: no tiene ningún test hecho.',
  dosHipotesis: 'Dos hipótesis: la intervención principal se reparte entre ambas y el tiempo de cada una baja.',
  vertigo: 'No usar ninguna técnica cervical que produzca mareo; probar antes con movimientos exploratorios (Maitland 2005, cap. 9, p. 224).',
  // Decisión 117: el plan con IA de Andrés (L5, ronda 1) abrió la primera sesión
  // con el slump; Maitland lo desaconseja como primera técnica
  neuralRadicular: 'Técnicas neurales (p. ej., el slump): rara vez son la primera técnica. Si se usan con vigor, dejar 2–3 días entre sesiones y reevaluar a las 24 h, porque las estructuras del canal tardan más en recuperarse de las agujetas (Maitland 2005, cap. 6, p. 149). En fase aguda o irritable, deslizadores antes que tensores, con el resto del cuerpo descargado y antes de provocar el síntoma; dosificar por tiempo o repeticiones, no por el dolor, y progresar primero en repeticiones; si no mejora en 2–3 sesiones, cambiar de técnica (Butler 2000, pp. 379–381, 387 y 391). Si es irritable, empezar lejos de la zona de síntomas, con oscilaciones lentas de gran amplitud (grado II) en series de unos 20–30 s, reevaluando y aumentando el número de series; mantener la posición solo si no es irritable, como mucho 10 s, y lo provocado debe ceder a los pocos segundos de soltar (Butler 1991, pp. 188–189 y 192–193).',
  manipulacionCervical: 'Sin manipulación forzada con signos de dos raíces cervicales o signos medulares; la movilización suave sí puede ser adecuada, y los cambios neurológicos no impiden movilizar con suavidad desde el principio (Maitland 2005, cap. 9, pp. 222–223).',
  sinTerapiaManualAguda: 'En la fase aguda (menos de 1 mes) la pauta de Kuijper 2009 es sin terapia manual: ahí los escalones no se aplican. La movilización o manipulación entra en la fase crónica (Blanpied 2017, B).',
  // Hombro (L3, decisiones 47 y 51–52)
  capsulitisPrecoz: 'Capsulitis con irritabilidad alta (fase precoz dolorosa): la guía admite movilización glenohumeral de baja intensidad en rangos sin dolor (Kelley 2013, C), pero un consenso posterior no considera eficaz la terapia manual en esa fase (93 % del panel) y sí la información y tranquilizar (100 %) (Salamh 2025). Con irritabilidad baja (fase rígida), el consenso sí la considera eficaz (85 %).',
  capsulitisEstadios: 'Capsulitis por estadio. 1, muy dolorosa: accesorios de grado I y II con el brazo bien apoyado en una posición neutra e indolora, reevaluando la respuesta de los síntomas más que el movimiento; si a las 2–3 sesiones los síntomas bajan, más amplitud y una pequeña molestia. 2, dolorosa y rígida: accesorios en posición neutra e indolora, y en la resistencia si lo que se queda antes no funciona; cuando la flexión llega a 100–120°, movimientos lentos hacia el cuadrante, primero de grado III− y después de grado IV a IV+, con un III− amplio para aliviar las molestias del tratamiento. 3, solo rigidez: grado IV+ fisiológicos y accesorios al límite, intercalando grado III; si el hombro está muy limitado, la movilización sirve poco (Hengeveld y Banks 2005, cap. 11, cuadro 11.9, pp. 342–343).',
  inestabilidad: 'Inestabilidad: en el hombro, movimientos accesorios o fisiológicos de grado II para estimular la propiocepción antes del entrenamiento de la estabilidad funcional; la rigidez se moviliza en la columna y en las articulaciones claviculares (Hengeveld y Banks 2005, cap. 11, cuadro 11.12, p. 347). La rotación lateral con presión fuerte, con mucho cuidado, por la palanca y la torsión sobre el húmero y la cápsula (p. 314).',
  artrosis: 'Artrosis glenohumeral: mejor solo con movimientos accesorios; el posteroanterior, con la mayor amplitud posible (grado II o III); tras una reagudización, grado I al principio, con el objetivo de llegar a III− o III+ en todo el recorrido sin dolor; los fisiológicos de grado II también pueden servir (Hengeveld y Banks 2005, cap. 11, cuadro 11.11, p. 345). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224). NICE solo considera la terapia manual en la artrosis de cadera o rodilla, y siempre junto al ejercicio (NICE NG226, rec. 1.3.6): en el hombro, si se usa, que sea dentro de un programa de ejercicio y sabiendo que la guía no la respalda.',
  protesis: 'Si la cirugía fue una prótesis: sobre todo accesorios cerca de la línea articular, sin palancas largas que muevan el hueso alrededor del implante; si el ejercicio activo ya cumple el objetivo, la movilización pasiva sobra (Hengeveld y Banks 2005, cap. 10, p. 269).',
  // Codo (L3, decisiones 66–69; cap. 12 de Peripheral)
  epicondilalgiaLateral: 'Epicondilalgia lateral: la base de la pauta es el ejercicio, con su propia dosis; la terapia manual es un complemento para aliviar pronto el dolor, y los escalones solo se refieren a ella (Hengeveld y Banks 2005, cap. 12, cuadro 12.6, p. 392, que cita a Vicenzino 2003). Si el movimiento pasivo del codo es completo e indoloro, la movilización pasiva no tiene sitio; con signos articulares, se tratan primero ellos solos, hasta ver cómo progresa, y después, si hace falta, también el componente tendinoso (p. 390). Las técnicas preferidas son la extensión-aducción de grado IV a IV+ y los accesorios al límite, sobre todo el anteroposterior y el posteroanterior de la cabeza del radio en pronación (cuadro 12.6, p. 392). El codo se sobretrata con facilidad (p. 393). Si no evoluciona, mirar también la columna cervical y torácica y el hombro (pp. 361 y 369).',
  epicondilalgiaMedial: 'Epicondilalgia medial: la pauta es de ejercicio excéntrico, con su propia dosis, y no incluye terapia manual; el cap. 12 de Peripheral no trae un perfil propio de la medial (solo la nombra entre los cuadros por sobrecarga; Hengeveld y Banks 2005, cap. 12, p. 390). Los escalones, solo si la exploración encuentra signos articulares en el codo.',
  rigidezCodo: 'Codo rígido y doloroso: primero, técnicas para el dolor hasta tener clara la irritabilidad; después, estirar en cualquier dirección mientras la progresión no empeore el patrón del dolor. Para estirar: fisiológicos de grado IV o IV− si el dolor es mínimo; accesorios de grado IV o IV− con la articulación sostenida al límite del recorrido fisiológico; intercalar los dos; y un grado II+ o III− en la mayor amplitud posible para aliviar las molestias del tratamiento. Un estiramiento juicioso y controlado (grados III y IV) es poco probable que cause una miositis osificante (Hengeveld y Banks 2005, cap. 12, pp. 390 y 393).',
  inestabilidadCodo: 'Inestabilidad del codo: la pauta es de fortalecimiento y control, y en la posterolateral evita la carga axial en extensión y supinación (Quzli 2025). El cap. 12 de Peripheral no trae un perfil de inestabilidad del codo; por la regla general de no usar técnicas firmes con ligamentos debilitados (Hengeveld y Banks 2005, cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido que tensen el ligamento insuficiente: el valgo (extensión-abducción) en la medial; la extensión con supinación en la posterolateral.',
  radiohumeral: 'Dolor radiohumeral intraarticular (plica): con patología intraarticular, de grado II− a III o III− (Hengeveld y Banks 2005, cap. 7, tabla 7.2, p. 176); si duele mucho, el movimiento longitudinal cefálico del radio cuando alivia el dolor (cap. 12, p. 389).',
  nervioCodo: 'Atrapamiento de un nervio en el codo: los escalones se refieren a la articulación. Para el nervio, movilizar las interfases que lo rodean y recuperar su deslizamiento y su tensión (Butler 2000, pp. 380 y 400); el anteroposterior y el longitudinal caudal de la cabeza del radio sirven como movilización de la interfase de un nervio radial mecanosensible (Hengeveld y Banks 2005, cap. 12, pp. 387–388). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).',
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
  sensibilizacionCentral: 'Sensibilización central: con hiperalgesia secundaria, los grados I y II solos no alivian el dolor y los III y IV pueden aumentar la sensibilización, y el tratamiento local tiene poco efecto duradero (Hengeveld y Banks 2005, cap. 10, recuadro 10.3, pp. 264–265). NICE no incluye la terapia manual entre lo que recomienda para el dolor crónico primario: pone primero el ejercicio supervisado en grupo (NICE NG193, rec. 1.2.1).',
  posqCadera: 'Tras una cirugía de cadera: el cap. 14 no trata la prótesis; el movimiento lateral sirve para recuperar el recorrido tras una fractura del fémur o de la región acetabular (Hengeveld y Banks 2005, cap. 14, p. 462). Su técnica principal, la flexión-aducción (F/Ad), con compresión o rotación medial añadidas, lleva la cadera a flexión y aducción (pp. 457–460): si el cirujano ha pautado precauciones de luxación, comprobar antes que las respeta. Siempre dentro del protocolo del cirujano.',
  // Tobillo y pie (L3, decisiones 91–95; cap. 16 de Peripheral)
  esguinceTobillo: 'Esguince lateral de tobillo: en la fase aguda, reposo, compresión (vendaje o tobillera) y elevación o muletas; contracciones y movimientos desde unos 3 días, al principio en los rangos libres de resistencia, y después movilización pasiva suave dentro de la resistencia, control muscular y sentido de posición articular (Hengeveld y Banks 2005, cap. 16, cuadro 16.4, pp. 564–565). Si es reciente, movimientos lentos y pequeños, en grupos de unos 5, solo hasta una molestia mínima, y reevaluar a las 24 h; el estiramiento suave, desde el 5.º–6.º día (cap. 8, p. 220). Movimientos accesorios en distintas posiciones del retropié; la flexión dorsal y plantar con compresión de la talocrural, solo si hay un trastorno intraarticular y no antes del comienzo de la remodelación tardía, hacia las 6–8 semanas (cuadro 16.4). La tibioperonea inferior suele afectarse en los traumatismos fuertes y se pasa por alto (p. 541). Si está implicado el nervio peroneo superficial, los síntomas pueden durar más y ser urentes (cuadro 16.4; p. 529).',
  sindesmosis: 'Lesión de la sindesmosis: la pauta no incluye terapia manual, y mientras duran la descarga y la bota (6 semanas, van Dijk 2016) los escalones no se aplican. La sindesmosis impide que la tibia y el peroné se separen con la carga, y en la flexión dorsal el peroné se desplaza hacia fuera (Hengeveld y Banks 2005, cap. 16, p. 527); la rotación lateral del astrágalo en la mortaja lleva el peroné hacia atrás (pp. 544–545): por la regla general de no usar técnicas firmes con ligamentos debilitados (cap. 8, pp. 224–225), sin técnicas firmes al final de la flexión dorsal ni de la rotación lateral del astrágalo mientras el ligamento cura.',
  aquiles: 'Tendinopatía del Aquiles: la base es la carga de su pauta, con su propia dosis, y es ejercicio (en casa o en consulta), no un número de sesiones; los escalones solo se refieren a la terapia manual. El cap. 16 trata los signos articulares del retropié (tibioperonea distal y tobillo), moviliza el arco del pie si se puede y la columna lumbar si está relacionada, y más adelante integra el tratamiento neurodinámico (nervios sural y tibial posterior) si lo está; la flexión dorsal y la eversión suelen provocar los síntomas. Cuidado con la rotura completa: prueba de Thompson (Hengeveld y Banks 2005, cap. 16, cuadro 16.5, pp. 565–566).',
  monitorizacionDolor: 'Porción media del Aquiles: su pauta pide la carga más alta que se tolere, sin fijar un criterio de dolor. Uno estudiado precisamente aquí: durante el ejercicio, dolor de hasta 5/10; después, hasta 5/10 pero desaparecido a la mañana siguiente; y el dolor y la rigidez, sin aumentar de semana en semana. En ese ensayo, seguir corriendo y saltando con este modelo no fue peor que el reposo activo; no prueba que sea mejor (Silbernagel 2007; no incluyó la insercional).',
  aquilesInsercional: 'Tendinopatía insercional: la pauta evita cargar el tendón en flexión dorsal, que lo comprime contra el calcáneo (Jonsson 2008; Pringels 2025). Por lo mismo, sin técnicas firmes al final de la flexión dorsal (inferencia de la pauta; la flexión dorsal suele provocar los síntomas, Hengeveld y Banks 2005, cap. 16, cuadro 16.5, p. 565).',
  tibialPosterior: 'Tendinopatía del tibial posterior: la base son las plantillas, el estiramiento y el ejercicio de su pauta, con su propia dosis y sin dolor en el tendón (Kulig 2009); los escalones solo se refieren a la terapia manual. La vaina se explora con resistencia en todo el recorrido y palpando: puede aumentar los síntomas y notarse crepitación (Hengeveld y Banks 2005, cap. 16, p. 535). La tenosinovitis del tibial posterior es una de las causas del síndrome del túnel del tarso: explorar también el nervio tibial posterior (p. 525).',
  inestabilidadTobillo: 'Inestabilidad crónica del tobillo: la terapia manual de la pauta (movilizaciones graduadas y movilización con movimiento, en carga y sin carga, para la flexión dorsal y el equilibrio dinámico) va junto al ejercicio (Martin 2021, A y B); la manipulación que también recoge la guía no está en los escalones, porque la app no propone grado V (Hengeveld y Banks 2005, cap. 8, p. 198). El cap. 16 incluye las inestabilidades recurrentes en el perfil del esguince, con la pérdida del control muscular y del sentido de posición articular como factores (cuadro 16.4, p. 564), y el equilibrio monopodal es una prueba esencial tras un traumatismo (p. 533).',
  talon: 'Dolor plantar del talón: la terapia manual articular de la pauta (sobre todo la flexión dorsal talocrural) y de tejidos blandos va con el estiramiento y el resto del núcleo (Koc 2023, A). En el caso clínico del cap. 16, un «espolón» resultó un componente neural (nervio tibial posterior mecanosensible, muy irritable): técnicas articulares locales, accesorios del calcáneo en flexión dorsal y eversión, siempre antes del dolor, y la movilización neurodinámica solo cuando el dolor dominaba menos (Hengeveld y Banks 2005, cap. 16, pp. 570–574). El nervio plantar puede dar síntomas con un espolón (p. 529).',
  nervioTobillo: 'Nervios del tobillo y el pie: los escalones se refieren a la articulación. El cap. 16 relaciona el nervio sural con la tendinopatía del Aquiles, el tibial posterior con el túnel del tarso y el nervio plantar con el dolor del talón (Hengeveld y Banks 2005, cap. 16, p. 529). Pruebas neurodinámicas: elevación de la pierna recta o slump con flexión plantar e inversión (peroneos superficial y profundo), con abducción del retropié y flexión dorsal (tibial posterior) o con aducción del retropié y flexión dorsal (sural) (p. 538, figura 16.11). En el túnel del tarso, la fuerza de los músculos de los nervios plantares y la sensibilidad de la planta (p. 538); puede deberse a una tenosinovitis del tibial posterior, un traumatismo, el sobreuso o un esguince del ligamento medial (p. 525). Con un nervio mecanosensible e irritable, primero técnicas articulares locales antes del dolor, y la movilización neurodinámica cuando el dolor domine menos (caso clínico 16.1, pp. 571–574). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).',
  morton: 'Neuroma de Morton o bursitis intermetatarsiana: los escalones se refieren a la articulación. El cap. 16 relaciona los nervios intermetatarsianos con el arco transverso aplanado (neuralgia de Morton) y los palpa en la planta entre las cabezas del 3.º y el 4.º y del 4.º y el 5.º metatarsianos (Hengeveld y Banks 2005, cap. 16, pp. 529 y 539); los movimientos intermetatarsianos sirven en la metatarsalgia por disfunción de esas articulaciones (p. 563), y en las deformidades del antepié, la movilización con automovilizaciones y la actividad de la musculatura intrínseca (p. 541). Si es una bursitis y no el nervio, la exploración del nervio de cada sesión sobra.',
  artrosisTobillo: 'Artrosis de tobillo o pie: el cap. 16 no trae un perfil de artrosis. Con un trastorno intraarticular, grado III con movimientos amplios hasta el límite (Hengeveld y Banks 2005, cap. 16, p. 541), y la compresión del retropié para los trastornos intraarticulares estables y menores (p. 547). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224). NICE, en cambio, solo considera la terapia manual en la artrosis de cadera o rodilla, y siempre junto al ejercicio (NICE NG226, rec. 1.3.6): en tobillo o pie, si se usa, que sea dentro de un programa de ejercicio y sabiendo que la guía no la respalda.',
  fracturaEstresMetatarsiano: 'Fractura de estrés de un metatarsiano: la pauta es dejar de correr, modificar la actividad guiándose por el dolor y volver con un programa graduado (Warden 2014). Ninguna fuente leída trata la terapia manual sobre una fractura de estrés que consolida: los escalones no se aplican en el foco. Las técnicas intermetatarsianas sirven sobre todo tras la fase de inmovilización, con el pie rígido (Hengeveld y Banks 2005, cap. 16, pp. 562–563).',
  apofisitisPie: 'Apofisitis del pie en crecimiento (Sever, Iselin): la pauta, por analogía con la de Osgood-Schlatter, es de carga progresiva y una escalera de actividad guiada por el dolor, sin terapia manual (Rathleff 2020). Ninguna fuente leída trata la movilización pasiva del pie con el esqueleto inmaduro (el cap. 16 de Peripheral no lo trata). Los escalones de terapia manual no se aplican.',
  posqTobillo: 'Tras una cirugía de tobillo o pie: el cap. 16 no trata la cirugía. Tras una inmovilización el pie puede quedar rígido (Hengeveld y Banks 2005, cap. 16, p. 528), y entonces sirven las técnicas intermetatarsianas (pp. 562–563); el sentido de posición articular puede disminuir tras un traumatismo, y el equilibrio monopodal es una prueba esencial (p. 533). Siempre dentro del protocolo del cirujano.',
  dosFamilias: 'Las dos hipótesis se tratan en zonas distintas (columna y articulación periférica): los escalones y las reglas del mes son los de la principal; la cantidad por sesión y la progresión, las de cada una.',
  // Varios síntomas (Fase N, docs/sintomas-multiples.md; decisión 35)
  dosificaOtro: 'Dosificado según el síntoma más irritable de la fase 3, no según P1 (a igualdad de irritabilidad, manda P1). La gravedad es la de su NRS.',
  independiente: 'Un síntoma va independiente de P1: puede ser un segundo problema que este plan no trata. Valóralo aparte.',
};

// Avisos por hipótesis, por id (nunca por el nombre): claves de AVISOS.
export const AVISOS_HIP = {
  ce13: ['vertigo'],                                         // mareo cervicogénico
  ce3: ['manipulacionCervical', 'neuralRadicular'],          // radiculopatía cervical
  ce12: ['manipulacionCervical', 'sinTerapiaManualAguda', 'neuralRadicular'], // dolor radicular cervical (su pauta aguda, data/cervical.js)
  lu3: ['neuralRadicular'], lu5: ['neuralRadicular'],        // lumbar radicular (decisión 117; Maitland 2005, cap. 6, p. 149)
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
  co8: ['nervioCodo'], co9: ['nervioCodo'], co13: ['nervioCodo'], // atrapamientos (Butler 2000, pp. 380 y 400; Hengeveld y Banks, pp. 387–388)
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
  // Tobillo y pie (decisiones 91–95; cap. 16 de Peripheral)
  tp1: ['esguinceTobillo'],                                  // cuadro 16.4 y cap. 8, p. 220
  tp2: ['sindesmosis'],                                      // p. 527 y cap. 8, pp. 224–225 (inferencia)
  tp8: ['aquiles', 'monitorizacionDolor'],                   // cuadro 16.5; Silbernagel 2007
  tp9: ['aquiles', 'aquilesInsercional'],                    // cuadro 16.5; su pauta
  tp10: ['aquiles'],                                         // cuadro 16.5 (peritendón); sin pauta
  tp12: ['nervioTobillo'], tp16: ['nervioTobillo'], tp28: ['nervioTobillo'], // pp. 529 y 538; caso 16.1
  tp14: ['tibialPosterior'],                                 // pp. 525 y 535
  tp21: ['inestabilidadTobillo'],                            // cuadro 16.4 y p. 533
  tp24: ['artrosisTobillo'],                                 // pp. 541 y 547; cap. 8, p. 224
  tp26: ['talon'],                                           // caso clínico 16.1
  tp33: ['fracturaEstresMetatarsiano'],                      // los escalones no se aplican en el foco
  tp34: ['morton'],                                          // pp. 529, 539, 541 y 563
  tp36: ['apofisitisPie'],                                   // esqueleto inmaduro
};

// Avisos con mecanismo Post-quirúrgico en una región periférica (decisión 47):
// condicional, porque la app no sabe si la cirugía fue una prótesis.
export const AVISOS_POSQ_PERIFERICA = ['protesis'];

// Disautonomía / POTS (docs/pots.md): avisos y red de seguridad con la tarjeta
// de la fase 1 activa, en cualquier región. La red: un síncope durante el
// ejercicio obliga a parar hasta la valoración médica (NICE CG109, 1.3.2.2).
export const AVISOS_DISAUTONOMIA = ['disautonomia'];
export const RED_DISAUTONOMIA = { cierre: 'cierreSincope', casa: 'alarmaSincope' };

// Lupus (docs/lupus.md, decisión 13 y cambio C16): con la tarjeta en
// «Diagnosticado», en cualquier región: la fiebre (infección), la TVP (la
// misma de rodilla) y el ictus, este también sin antifosfolípidos (en el lupus
// es el riesgo que menos recogen las escalas generales, Drosos 2022, p. 773).
// Avisos: `lupus` siempre; `lupusBrote` en brote o peor sin valorar;
// `lupusRaynaud` con Raynaud. El anticoagulante o antiagregante, en la tarjeta
// propia (AVISOS_ANTICOAGULADO).
export const AVISOS_LUPUS = ['lupus'];
export const RED_LUPUS = [
  { cierre: 'cierreFiebreLupus', casa: 'alarmaFiebreLupus' },
  { cierre: 'cierreTVP', casa: 'alarmaTVP' },
  { cierre: 'cierreIctusLupus', casa: 'alarmaIctusLupus' },
];

// Trastorno mastocitario o anafilaxia (docs/mastocitaria.md): con la tarjeta
// marcada, en cualquier región, el aviso `mastocitos` y la red de la anafilaxia.
export const AVISOS_MASTOCITOS = ['mastocitos'];
export const RED_MASTOCITOS = { cierre: 'cierreAnafilaxia', casa: 'alarmaAnafilaxia' };

// Osteoporosis o fragilidad ósea (docs/osteoporosis.md): con la tarjeta
// marcada, en cualquier región, los avisos de ejercicio y de moverse, el del
// impacto según las fracturas (con «Diagnosticada») y el del thrust; con
// «Diagnosticada», la red de la fractura vertebral nueva. El tope «sin thrust»
// también sale con el lupus con corticoides (decisión 15) y con anticoagulante
// (docs/anticoagulado.md, decisión 4; motivosSinThrust() en lib/osteoporosis.js).
export const AVISOS_OSTEOPOROSIS = ['osteoporosis', 'osteoporosisMoverse'];
export const RED_OSTEOPOROSIS = { cierre: 'cierreFracturaVertebral', casa: 'alarmaFracturaVertebral' };

// Embarazo o posparto (docs/embarazo-posparto.md): con la tarjeta marcada, en
// cualquier región, el aviso de su estado (con «Posparto» y lactancia, el de
// la lactancia), el de la terapia manual y, con la sacroilíaca elegida (lu8,
// ca10), el de Vleeming 2008; la red de su estado.
export const AVISOS_EMBARAZO = ['embarazo', 'terapiaManualEmbarazo'];
export const AVISOS_POSPARTO = ['posparto', 'terapiaManualEmbarazo'];
export const HIP_SACROILIACA = ['lu8', 'ca10'];
export const RED_EMBARAZO = { cierre: 'cierreEmbarazo', casa: 'alarmaEmbarazo' };
export const RED_POSPARTO = { cierre: 'cierrePosparto', casa: 'alarmaPosparto' };

// Anticoagulado o antiagregado (docs/anticoagulado.md): con la tarjeta marcada,
// en cualquier región, el aviso `anticoagulado` y la red del sangrado; los de
// punción seca y ondas de choque, solo con las hipótesis cuya pauta las
// recomienda (listas a mano: varias pautas solo las nombran para desaconsejarlas;
// una prueba unitaria las fija).
export const AVISOS_ANTICOAGULADO = ['anticoagulado'];
export const HIP_PUNCION_SECA = ['h6', 'ce1', 'ce7', 'ce14', 'lu9', 'co1', 'ca1', 'ca15', 'tp26'];
export const HIP_ONDAS_CHOQUE = ['h2', 'ca9', 'ca19', 'ro6'];
export const RED_ANTICOAGULADO = { cierre: 'cierreAnticoagulado', casa: 'alarmaAnticoagulado' };

// Avisos con mecanismo Post-quirúrgico propios de una región, después de los
// de las periféricas (decisión 78): lo que su capítulo de Peripheral dice de
// empezar a movilizar tras la cirugía.
export const AVISOS_POSQ_REGION = { rodilla: ['posqRodilla'], cadera: ['posqCadera'], tobillo_pie: ['posqTobillo'] };

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
  cierreFiebreLupus: 'Red de seguridad (lupus): explicar que la fiebre, los escalofríos o un malestar general nuevos piden ir hoy mismo al médico, y que con su tratamiento una infección puede dar poca fiebre; comprobar que lo ha entendido (Rao y Mikdashi 2023; Yasir 2023).',
  cierreAnafilaxia: 'Red de seguridad (trastorno mastocitario o anafilaxia): explicar que, si le salen ronchas, se le hincha la boca, le falta el aire, se marea o se desmaya, debe parar, ponerse el autoinyector y llamar al 112, tumbado y sin levantarse de golpe aunque mejore, y comprobar que lo ha entendido (RCUK 2021, apartados 4.4 y 5.1.1; NICE NG258, 1.1.14).',
  cierreIctusLupus: 'Red de seguridad (lupus): explicar que la debilidad o el adormecimiento de un lado, la dificultad para hablar o la pérdida de visión de golpe piden llamar al 112, aunque se pasen (Goodman 2018, cap. 12, p. 445; Drosos 2022, p. 773).',
  cierreFracturaVertebral: 'Red de seguridad (osteoporosis): explicar que un dolor de espalda fuerte que empieza de golpe tras un esfuerzo pequeño pide parar y que le vea el médico, y que si además nota debilidad u hormigueo en las piernas, o cambios al orinar, debe ir a urgencias (Gregson 2025; Finucane 2020, sección 3).',
  cierreEmbarazo: 'Red de seguridad (embarazo): explicar que el dolor de cabeza fuerte, la visión borrosa, el dolor fuerte bajo las costillas o la hinchazón brusca de la cara o las manos piden que la vea un profesional hoy; que si nota que el bebé se mueve menos llame a su maternidad a cualquier hora, y que si sangra, pierde líquido o tiene contracciones regulares y dolorosas, pare y llame (NICE NG133, 1.1.1; NICE NG201, 1.2.34; Mottola 2018, recuadro 2).',
  cierrePosparto: 'Red de seguridad (posparto): explicar que un sangrado brusco o muy abundante, la fiebre o los escalofríos, el flujo maloliente, la pierna hinchada y dolorosa, la falta de aire, el dolor en el pecho o un dolor de cabeza fuerte piden consulta médica sin demora, y comprobar que lo ha entendido (NICE NG194, 1.2.4).',
  cierreAnticoagulado: 'Red de seguridad (anticoagulado o antiagregado): explicar que un golpe en la cabeza, aunque se encuentre bien, pide ir a urgencias, y que un dolor de cabeza fuerte, vómitos, somnolencia o confusión en los días siguientes piden llamar al 112; que un dolor fuerte de cuello o espalda con debilidad u hormigueo, un dolor muy fuerte en la ingle, la cadera o la barriga con mareo, o un brazo o una pierna muy hinchados y tensos con un dolor desproporcionado piden urgencias; y que no deje ni se salte el fármaco sin hablarlo con su médico (NICE NG232, 1.2.4 y 1.10.9; Peng 2022; Lukies 2023; Brooker 2020; Steffel 2021).',
  cierreSincope: 'Red de seguridad (disautonomía): explicar que, si se desmaya mientras hace ejercicio, debe parar y no volver a hacer ejercicio hasta que le vea el médico, y comprobar que lo ha entendido (NICE CG109, 1.3.2.2 y 1.5.4.3; Brignole 2018, p. 1911).',
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
  // Tobillo y pie (decisión 96): fractura de estrés, infección y TVP, siempre;
  // rotura del Aquiles con tp8 y tp9 (RED_HIP, decisión 97)
  cierreFracturaEstresPie: 'Red de seguridad: explicar qué síntomas piden dejar la actividad que lo empeora e ir al médico (un dolor del pie o del tobillo que empieza poco a poco, va a más con la carga o la actividad, no mejora al calentar y molesta por la noche: posible fractura de estrés, que la radiografía tarda 2–3 semanas en mostrar) y comprobar que lo ha entendido (May y Marappa-Ganeshan 2023; Lluch 2020, como en el razonamiento de tp_o1).',
  cierreInfeccionTobillo: 'Red de seguridad: explicar qué síntomas exigen ir hoy mismo a urgencias (el tobillo o una articulación del pie hinchada, caliente y muy dolorosa, con fiebre o malestar general) y cuáles, hoy mismo al médico (lo mismo de golpe, aunque no haya fiebre), y comprobar que lo ha entendido (Momodu y Savaliya 2023; Goodman 2018, como en el razonamiento de tp_i1).',
  cierreRoturaAquiles: 'Red de seguridad: explicar qué síntomas piden dejar los ejercicios e ir al médico sin esperar a la próxima sesión (un golpe o una patada de repente detrás del tobillo o de la pantorrilla, a veces con un chasquido, y desde entonces cojear o no poder ponerse de puntillas) y comprobar que lo ha entendido (Lluch 2020; Shamrock 2023, como en el razonamiento de tp_t3; Hengeveld y Banks 2005, cap. 16, cuadro 16.5, p. 565).',
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
  // Hombro (decisión 123): el ensayo del programa estándar de h8 usó 2 sesiones por semana
  h8: {
    plan: 'B',
    nota: 'Discinesia escapular: el programa estándar de su pauta fueron 16 sesiones, 2 por semana durante 8 semanas (Kamonseki 2022), así que encaja con el plan B; con el plan A, el mes queda por debajo de lo estudiado.',
  },
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
  // Tobillo y pie (decisión 94)
  tp14: {
    plan: 'A',
    nota: 'Tendinopatía del tibial posterior: su pauta son 12 semanas de ejercicio en casa, dos veces al día, con una revisión semanal de 30 min durante 10 semanas (Kulig 2009), así que encaja con el plan A; el programa para casa es el que lleva la carga.',
  },
  tp21: {
    plan: 'B',
    nota: 'Inestabilidad crónica del tobillo: el protocolo concreto de su pauta son 12 sesiones supervisadas, 3 por semana durante 4 semanas (McKeon 2008): incluso el plan B queda por debajo de lo estudiado. La guía no fija una dosis (Martin 2021).',
  },
  tp36: {
    plan: 'A',
    nota: 'Apofisitis del pie en crecimiento: su pauta, por analogía con la de Osgood-Schlatter, usa 4 visitas en 12 semanas, con los padres, y el resto del trabajo es en casa (Rathleff 2020); el plan A ya queda por encima de esas visitas, y el programa para casa es el que lleva la carga.',
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
  'tp12', 'tp16', 'tp28', 'tp34', // tobillo y pie: sural, tibial posterior (túnel del tarso), nervios del talón, interdigital (Morton) (decisión 92)
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
  // Tobillo y pie (decisión 96): tres de siempre, la fractura de estrés (tp_o1:
  // la dispara la carga, y varias pautas progresan la carrera y los saltos), la
  // infección (tp_i1) y la TVP (tp_v2, pq_tep: varias pautas inmovilizan o
  // descargan; la misma que rodilla). No van al programa para casa el
  // compartimental tras un traumatismo (tp_t1), la neuropatía aguda (tp_n1),
  // hem_5 ni hem_6, ni las demás posquirúrgicas (pq_*: manda el cirujano).
  tobillo_pie: { siempre: [
    { cierre: 'cierreFracturaEstresPie', casa: 'alarmaFracturaEstresPie' },
    { cierre: 'cierreInfeccionTobillo', casa: 'alarmaInfeccionTobillo' },
    { cierre: 'cierreTVP', casa: 'alarmaTVP' },
  ] },
};

// Hipótesis de otra región cuya pauta trae terapia manual de la columna
// cervical, por id: añaden la red de seguridad arterial de cervical (decisión
// 50; el mismo motivo que la decisión 39).
// tp8 y tp9 (tendinopatías del Aquiles, decisión 97): su pauta carga el tendón,
// la tendinopatía es factor de riesgo de rotura (tp_t3) y la rotura puede pasar
// por un esguince, porque se camina «sorprendentemente bien».
export const RED_HIP = {
  h6: { cierre: 'cierreArterial', casa: 'alarmaArterial' },
  tp8: { cierre: 'cierreRoturaAquiles', casa: 'alarmaRoturaAquiles' },
  tp9: { cierre: 'cierreRoturaAquiles', casa: 'alarmaRoturaAquiles' },
};

// Programa para casa: lo único que ve el paciente. Lenguaje llano, sin
// puntuaciones ni fuentes en el texto; `fuente` solo para la revisión
// (docs/plan-tratamiento-frases.md). null = redacción propia.
export const TEXTOS_CASA = {
  titulo: { texto: 'PROGRAMA PARA CASA', tipo: 'etiqueta' },
  // Lupus (RED_LUPUS): la fiebre con su tratamiento y el ictus.
  alarmaFiebreLupus: { texto: 'Si tienes fiebre o escalofríos, o te encuentras mal de una forma nueva, ve hoy mismo al médico: con tu tratamiento, una infección puede dar poca fiebre.', fuente: 'Rao y Mikdashi 2023, «Proposed Steps» (la fiebre en el lupus es infecciosa mientras no se demuestre lo contrario); Yasir 2023, «Adverse Effects» (los corticoides pueden quitar la fiebre)' },
  // Trastorno mastocitario o anafilaxia (RED_MASTOCITOS).
  alarmaAnafilaxia: { texto: 'Si te salen ronchas, se te hincha la boca, te falta el aire, te mareas o te desmayas, para, ponte el autoinyector y llama al 112. Túmbate (siéntate si te cuesta respirar) y no te levantes de golpe aunque te encuentres mejor.', fuente: 'RCUK 2021, apartados 4.4 y 5.1.1; NICE NG258, recomendación 1.1.14 (docs/mastocitaria.md)' },
  alarmaIctusLupus: { texto: 'Si de golpe notas debilidad o adormecimiento de un lado del cuerpo, dificultad para hablar o pérdida de visión, llama al 112, aunque se te pase.', fuente: 'Goodman 2018, cap. 12, p. 445 (enfermedad cerebrovascular, frecuente en el lupus); Drosos 2022, p. 773; Rout 2024 (síndrome antifosfolípido), «Deterrence and Patient Education» (enseñar los síntomas del AIT)' },
  // Disautonomía (RED_DISAUTONOMIA): el síncope durante el ejercicio.
  // Osteoporosis (RED_OSTEOPOROSIS): la fractura vertebral nueva y la compresión.
  alarmaFracturaVertebral: { texto: 'Si te empieza de golpe un dolor de espalda fuerte tras un esfuerzo pequeño, para y que te vea el médico; si además notas debilidad u hormigueo en las piernas, o cambios al orinar, ve a urgencias.', fuente: 'Gregson 2025 (pensar en una fractura vertebral ante un dolor de espalda agudo; derivación urgente con déficit neurológico); Finucane 2020, sección 3 (docs/osteoporosis.md)' },
  // Osteoporosis: moverse con seguridad en casa (AVISOS osteoporosisMoverse)
  moverseOsteoporosis: { texto: 'Al agacharte o levantar algo, dobla las caderas y las rodillas con la espalda recta. Para girarte, da pasos en vez de torcer el tronco. Guarda lo que uses a la altura de la cintura, no en el suelo. Con lluvia o hielo, haz el ejercicio dentro de casa.', fuente: 'Brooke-Wavell 2022, recuadro 3; Giangregorio 2015; Giangregorio 2014 (docs/osteoporosis.md)' },
  // Embarazo o posparto (RED_EMBARAZO, RED_POSPARTO)
  alarmaEmbarazo: { texto: 'Si tienes un dolor de cabeza fuerte, ves borroso, te duele mucho bajo las costillas o se te hinchan de golpe la cara o las manos, que te vea hoy tu matrona o tu médico. Si notas que el bebé se mueve menos, llama a tu maternidad a cualquier hora. Si sangras, pierdes líquido por la vagina o tienes contracciones regulares y dolorosas, para y llama a tu maternidad.', fuente: 'NICE NG133, 1.1.1 (síntomas de preeclampsia); NICE NG201, 1.2.34 (movimientos fetales); Mottola 2018, recuadro 2 (motivos para parar y consultar) (docs/embarazo-posparto.md)' },
  alarmaPosparto: { texto: 'Si sangras de golpe o mucho, tienes fiebre o escalofríos, un flujo que huele mal, una pierna hinchada y dolorosa, te falta el aire, te duele el pecho o tienes un dolor de cabeza fuerte, pide que te vea un médico hoy.', fuente: 'NICE NG194, 1.2.4 (síntomas que piden consulta médica sin demora tras el parto) (docs/embarazo-posparto.md)' },
  // Anticoagulado o antiagregado (RED_ANTICOAGULADO): redacción propia sobre las
  // fuentes de las urgencias del sistema de la fase 2.
  alarmaAnticoagulado: { texto: 'Si te das un golpe en la cabeza, aunque te encuentres bien, ve hoy a urgencias; si en los días siguientes tienes un dolor de cabeza fuerte que va a más, vómitos, somnolencia o confusión, llama al 112. Si te empieza de golpe un dolor fuerte de cuello o espalda con debilidad, hormigueo o cambios al orinar, ve a urgencias ya. Un dolor muy fuerte en la ingle, la cadera o la barriga con mareo, o un brazo o una pierna muy hinchados, tensos y con un dolor desproporcionado, también. No dejes ni te saltes tu anticoagulante sin hablarlo antes con tu médico.', fuente: 'Redacción propia sobre NICE NG232, 1.2.4 y 1.10.9 (golpe en la cabeza); Peng 2022 (hematoma epidural espinal); Lukies 2023 (hematoma del psoas); Brooker 2020 (síndrome compartimental); Steffel 2021 (no saltarse dosis) (docs/anticoagulado.md)' },
  alarmaSincope: { texto: 'Si te desmayas mientras haces ejercicio, para y no vuelvas a hacer ejercicio hasta que te vea el médico.', fuente: 'NICE CG109, recomendaciones 1.3.2.2 y 1.5.4.3: con un síncope durante el ejercicio, no hacer ejercicio hasta la valoración; Brignole 2018, p. 1911 (docs/pots.md)' },
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
  // Tobillo y pie (RED_SEGURIDAD, decisión 96): síntomas del razonamiento de
  // tp_o1 (fractura de estrés; derivar, no urgencia) y de tp_i1 (artritis
  // infecciosa; la gota se le parece y también pide médico) y, por id, de tp_t3
  // (rotura del Aquiles, RED_HIP, decisión 97). La TVP usa alarmaTVP.
  alarmaFracturaEstresPie: { texto: 'Si un dolor del pie o del tobillo empieza poco a poco, va a más al apoyar o con la actividad, no mejora al calentar y te molesta también por la noche, deja la actividad que lo empeora (correr, saltar) y ve al médico.', fuente: 'May y Marappa-Ganeshan 2023 y Lluch 2020, como en el razonamiento de tp_o1: presentación típica de una fractura de estrés; algunas del pie son de alto riesgo (navicular, base del 5.º metatarsiano); la radiografía tarda 2–3 semanas en mostrarla; derivar para confirmarla con imagen' },
  alarmaInfeccionTobillo: { texto: 'Si el tobillo o una articulación del pie se te pone hinchada, caliente y muy dolorosa y tienes fiebre o te encuentras mal en general, ve hoy mismo a urgencias. Aunque no tengas fiebre, si se pone así de golpe, ve hoy mismo al médico.', fuente: 'Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Goodman 2018, como en el razonamiento de tp_i1 y el recuadro de urgencia de tobillo y pie: artritis infecciosa, urgencia hoy; la fiebre solo aparece en el 40–60 %, y la gota se le parece y solo el líquido articular las separa' },
  alarmaRoturaAquiles: { texto: 'Si de repente notas como un golpe o una patada detrás del tobillo o de la pantorrilla, a veces con un chasquido, y desde entonces cojeas o no puedes ponerte de puntillas sobre esa pierna, deja los ejercicios y ve al médico sin esperar a la próxima sesión.', fuente: 'Lluch 2020 y Shamrock 2023, como en el razonamiento de tp_t3 (la tendinopatía previa es factor de riesgo; camina sorprendentemente bien, y entre el 20 y el 25 % se toman al principio por un esguince; derivación preferente); Hengeveld y Banks 2005, cap. 16, cuadro 16.5, p. 565 (cuidado con la rotura completa, prueba de Thompson)' },
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
  'AVISOS.sinNRS': 'decision:27', 'AVISOS.incompleta': 'decision:101', 'AVISOS.sinIrritabilidad': 'decision:101', 'AVISOS.estimada': 'decision:12',
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
export const FUENTES_PLAN = ['Petersen 2021', 'Maitland 2005', 'Hengeveld y Banks 2005', 'Barakatt 2009', 'Zusman 1998', 'Finucane 2020', 'Margetis y Donnally 2025', 'Rushton 2023', 'Goodman 2018', 'Kuijper 2009', 'Blanpied 2017', 'Reid 2014', 'Kelley 2013', 'Salamh 2025', 'Quzli 2025', 'Wistow 2025', 'Lluch 2020', 'Momodu y Savaliya 2023', 'Pangia 2025', 'NICE NG226', 'Prill 2025', 'Willy 2019', 'Balcarek 2025', 'Rathleff 2020', 'Truong 2023', 'Waheed 2023', 'NICE NG158', 'Vyas 2024', 'NICE NG89', 'Koc 2025', 'Enseki 2023', 'Mellor 2018', 'Rich 2025', 'Serner 2020', 'Hölmich 1999', 'May y Marappa-Ganeshan 2023', 'van Dijk 2016', 'Silbernagel 2007', 'Jonsson 2008', 'Pringels 2025', 'Kulig 2009', 'Martin 2021', 'McKeon 2008', 'Koc 2023', 'Warden 2014', 'Shamrock 2023', 'Butler 2000', 'Butler 1991', 'NICE NG193', 'Kamonseki 2022', 'Raj 2020', 'Fu 2010', 'George 2016', 'Hakim 2017', 'NICE CG109', 'Brignole 2018', 'RCUK 2021', 'NICE NG258', 'Brockow 2021', 'Muñoz 2024', 'Srisuwatchari 2023'];
