// worker/demo/fixtures.js — contenido precargado del modo demo.
//
// Todo lo que sirve el modo demo sale de este archivo. Es deliberadamente
// declarativo (datos, no lógica): la lógica vive en handlers.js, que es el
// único que sabe cómo trocearlo, paginarlo o convertirlo al formato de cada
// ruta. Así el contenido clínico se puede revisar y corregir sin leer código.
//
// ⚠ Paciente ficticio. El caso es clínicamente verosímil pero inventado: no
// procede de ninguna consulta real ni contiene datos de ninguna persona.
//
// Todas las piezas cuentan LA MISMA historia clínica (Nuria V., lumbalgia con
// irradiación L5 izquierda). Un demo en el que cada pantalla habla de un
// paciente distinto se nota de inmediato.

export const DEMO_CASE = {
  patient:      'Nuria V. (paciente demo)',
  age:          43,
  date:         '12/03/2025',
  region:       'lumbar',
  diagnosis:    'Lumbalgia mecánica con irradiación radicular L5 izquierda (3 semanas)',
};

// ── /transcribe ────────────────────────────────────────────────────────────
// Turnos de la consulta. `speaker` imita el diarizado de Deepgram:
// 0 = primera voz detectada (el motor pasivo la asume fisioterapeuta), 1 = paciente.
//
// Nota deliberada: el turno marcado con `flip: true` lleva el speaker "mal"
// a propósito — es una frase de la paciente atribuida al fisioterapeuta, que
// es exactamente el error que comete el diarizado tras una pausa larga. Deja
// algo real que corregir con copilotToggleLineSpeaker / copilotSwapAllSpeakers
// en la pestaña Transcripción, en lugar de un transcript artificialmente limpio.
export const DEMO_TRANSCRIPT = [
  { speaker: 0, text: 'Buenos días Nuria, cuéntame qué te trae por aquí.' },
  { speaker: 1, text: 'Pues llevo unas tres semanas con un dolor en la parte baja de la espalda que se me baja por la pierna izquierda.' },
  { speaker: 0, text: '¿Recuerdas cómo empezó? ¿Hubo algún gesto o alguna carga concreta?' },
  { speaker: 1, text: 'Sí, fue durante una mudanza. Cogí una caja pesada del suelo girando el cuerpo y noté un pinchazo fuerte en la zona lumbar.' },
  { speaker: 0, text: '¿Y el dolor de la pierna apareció ese mismo día o fue después?' },
  { speaker: 1, text: 'Al principio solo era la espalda. A los dos o tres días empezó a bajarme por detrás del muslo hasta la pierna, y ahora llega hasta el empeine del pie.' },
  { speaker: 0, text: '¿Notas hormigueo, acorchamiento o sensación de que la pierna te falla?' },
  { speaker: 1, text: 'Hormigueo sí, sobre todo en la parte de arriba del pie. Debilidad no diría, pero la pierna la noto más torpe al subir escaleras.' },
  { speaker: 0, text: 'Del cero al diez, siendo diez el peor dolor imaginable, ¿dónde lo pondrías ahora mismo?' },
  { speaker: 1, text: 'Ahora mismo sobre un seis. Por las mañanas es cuando peor está, un siete, y va aflojando a lo largo del día.' },
  { speaker: 0, text: '¿Qué posturas o actividades lo empeoran, y cuáles te alivian?' },
  { speaker: 1, text: 'Estar sentada mucho rato es lo peor, con veinte minutos ya tengo que levantarme. Agacharme a coger algo también. Caminando en cambio se me suaviza bastante.' },
  // ── Diarizado erróneo a propósito (ver nota arriba): esta frase es de la paciente.
  { speaker: 0, text: 'Trabajo en administración, así que me paso el día delante del ordenador y eso me está costando mucho.', flip: true },
  { speaker: 0, text: 'Te voy a hacer unas preguntas de cribado. ¿Has tenido fiebre, pérdida de peso sin explicación o dolor que te despierte por la noche de forma constante?' },
  { speaker: 1, text: 'No, nada de eso. Duermo mal alguna noche por la postura, pero no me despierta el dolor por sí solo.' },
  { speaker: 0, text: '¿Y algún problema para orinar, escapes, o sensación de acorchamiento en la zona de la entrepierna?' },
  { speaker: 1, text: 'No, para nada. Eso lo tengo bien.' },
  { speaker: 0, text: 'Perfecto, eso me tranquiliza. ¿Has tomado algo para el dolor?' },
  { speaker: 1, text: 'Ibuprofeno los primeros días y me quitaba un poco, pero llevo una semana sin tomar nada porque no quiero acostumbrarme.' },
  { speaker: 0, text: '¿Qué es lo que más te preocupa de todo esto?' },
  { speaker: 1, text: 'Me da miedo que sea una hernia y que se me quede así. Mi madre acabó operada de la espalda y no quiero pasar por lo mismo.' },
  { speaker: 0, text: 'Es una preocupación muy razonable y la vamos a abordar. Vamos a explorar la movilidad y a hacer unas pruebas neurológicas para ver qué raíz está implicada.' },
];

// Dictado (`diarize=false`): el cliente usa el mismo WebSocket para dictar al
// chat. Volcar ahí la transcripción de la consulta no tendría sentido, así que
// el demo dicta una pregunta plausible — que además tiene respuesta preparada
// en DEMO_CHAT, de modo que el recorrido micro → pregunta → respuesta se
// completa entero sin escribir nada.
export const DEMO_DICTATION = [
  '¿Qué banderas rojas debo descartar en este caso',
  'antes de empezar el tratamiento?',
];

// ── /suggest ───────────────────────────────────────────────────────────────
// Pool de tarjetas. El handler reparte de forma determinista y respeta el
// array `suggestions` que ya manda el cliente para no repetir — igual que el
// motor real, que devuelve `null` cuando la sugerencia sería redundante.
export const DEMO_SUGGESTIONS = [
  {
    type: 'redflag',
    text: 'Descarta síndrome de cauda equina antes de continuar: pregunta por retención o incontinencia urinaria, anestesia en silla de montar y déficit motor bilateral progresivo.',
  },
  {
    type: 'test',
    text: 'Con irradiación por debajo de la rodilla, añade SLR y test de Slump. El SLR cruzado (well leg raise) es poco sensible pero muy específico de hernia discal.',
  },
  {
    type: 'differential',
    text: 'El hormigueo en dorso del pie orienta a L5 más que a S1. Confirma con extensión del primer dedo, dorsiflexión de tobillo y reflejo aquíleo conservado.',
  },
  {
    type: 'followup',
    text: 'Pregunta por la rigidez matutina: si supera los 30 minutos y mejora con actividad, conviene descartar componente inflamatorio antes de asumir origen mecánico.',
  },
  {
    type: 'test',
    text: 'Completa el cribado neurológico por miotomas L4-S1 y reflejos rotuliano y aquíleo. Documenta la fuerza en escala 0-5 para poder comparar en la reevaluación.',
  },
  {
    type: 'followup',
    text: 'Ha verbalizado miedo a la cirugía por antecedente familiar. Explora expectativas y creencias con STarT Back: el componente psicosocial condiciona el pronóstico a 3 meses.',
  },
  {
    type: 'differential',
    text: 'La mejoría al caminar y el empeoramiento en sedestación prolongada encajan con patrón discogénico. La estenosis daría el patrón inverso: alivio en flexión y sentada.',
  },
  {
    type: 'test',
    text: 'Valora la preferencia direccional con movimientos repetidos en extensión: una centralización del dolor distal orienta el tratamiento y aporta pronóstico favorable.',
  },
];

// ── /chat ──────────────────────────────────────────────────────────────────
// Respuestas por intención. El handler puntúa la última pregunta del usuario
// contra `keywords` y sirve la mejor; si no hay señal suficiente cae en
// DEMO_CHAT_FALLBACK, que dice explícitamente que no ha entendido la pregunta
// en vez de fingir que sí. Las fuentes citadas existen de verdad en
// knowledge/ — el demo no inventa referencias, igual que el modo real.
export const DEMO_CHAT = [
  {
    intent: 'redflags',
    keywords: ['bandera', 'roja', 'red flag', 'grave', 'derivar', 'derivación', 'cauda', 'urgencia', 'alarma', 'descartar'],
    text: `En este caso el cribado de banderas rojas es tranquilizador, pero conviene dejarlo documentado por escrito:

**Descartado en la anamnesis**
- Sin fiebre, pérdida de peso ni dolor nocturno constante → aleja neoplasia e infección
- Sin clínica esfinteriana ni anestesia en silla de montar → aleja cauda equina
- Mecanismo de carga con flexo-rotación en mujer de 43 años sin osteoporosis conocida → fractura poco probable

**Pendiente de vigilar en la reevaluación**
- Progresión del déficit motor: la sensación de "pierna torpe" al subir escaleras merece cuantificarse con balance muscular 0-5 de dorsiflexores y extensor del primer dedo
- Aparición de déficit bilateral o cambio en el control de esfínteres → derivación urgente, sin esperar a la siguiente cita

La regla práctica es que la cauda equina se descarta en cada visita, no solo en la primera: es un cuadro que puede instaurarse durante el tratamiento.

*Fuente: Goodman & Snyder - Differential Diagnosis for Physical Therapists*`,
  },
  {
    intent: 'differential',
    keywords: ['diferencial', 'diagnóstico', 'diagnostico', 'qué puede ser', 'que puede ser', 'hipótesis', 'hipotesis', 'l5', 's1', 'raíz', 'raiz', 'radiculopatía', 'radiculopatia', 'hernia', 'estenosis'],
    text: `Con los datos de la consulta, el diferencial se ordena así:

**1. Radiculopatía L5 izquierda de origen discal — la más probable**
Encajan el mecanismo (flexo-rotación con carga), la progresión centrífuga del dolor en 2-3 días, la irradiación posterolateral hasta dorso del pie y las parestesias en ese mismo territorio. El empeoramiento en sedestación prolongada y la mejoría al caminar apuntan a componente discogénico.

**2. Dolor referido de origen facetario o sacroilíaco**
Menos probable: el dolor referido facetario rara vez sobrepasa la rodilla y no suele dar parestesias en un territorio dermatomérico definido. La regla de predicción facetaria pediría además alivio en descarga y dolor en extensión-rotación.

**3. Estenosis de canal lumbar**
Poco compatible con la edad y, sobre todo, con el patrón: la estenosis mejora en flexión y sedestación, justo lo contrario de lo que describe.

**Qué separaría 1 de 2 en la exploración**
Distribución dermatomérica de la hipoestesia, fuerza de extensor propio del primer dedo y dorsiflexores (L5) frente a flexores plantares y reflejo aquíleo (S1), y respuesta al SLR con sensibilización por dorsiflexión.

*Fuente: Magee - Orthopedic Physical Assessment (Lumbar Spine)*`,
  },
  {
    intent: 'tests',
    keywords: ['test', 'prueba', 'explorar', 'exploración', 'exploracion', 'valorar', 'slr', 'lasègue', 'lasegue', 'slump', 'maniobra', 'qué hago', 'que hago'],
    text: `Para esta sospecha, la batería mínima que aporta información de decisión:

**Tensión neural**
- **SLR / Lasègue**: sensible (~91%) pero poco específico. Positivo entre 30° y 70° con reproducción del dolor irradiado, no de la tirantez isquiotibial.
- **SLR cruzado (well leg raise de Fajersztajn)**: al revés — poco sensible, muy específico (~90%) de hernia discal. Si sale positivo, sube mucho la probabilidad post-test.
- **Slump test**: más sensible que el SLR, útil cuando el SLR es dudoso. Diferencia estructura neural de acortamiento muscular al retirar la flexión cervical.

**Cribado neurológico por nivel (L4-S1)**
- Miotomas: dorsiflexión de tobillo y extensión del primer dedo (L5), flexión plantar y marcha de puntillas (S1), extensión de rodilla (L4)
- Reflejos: rotuliano (L4) y aquíleo (S1). En una L5 pura ambos suelen estar conservados, y ese dato es diagnóstico
- Dermatomas: dorso del pie y cara lateral de la pierna (L5) frente a planta y borde externo (S1)

**Movimientos repetidos**
Buscar preferencia direccional: la centralización del dolor distal con extensiones repetidas orienta el tratamiento y es un buen marcador pronóstico.

Documenta la fuerza en escala 0-5 desde el primer día: sin línea base no puedes demostrar que el déficit no está progresando.

*Fuente: Magee - Orthopedic Physical Assessment (Lumbar Spine)*`,
  },
  {
    intent: 'treatment',
    keywords: ['tratamiento', 'tratar', 'plan', 'ejercicio', 'ejercicios', 'progresión', 'progresion', 'pauta', 'sesiones', 'qué le pongo', 'que le pongo', 'rehabilitación', 'rehabilitacion'],
    text: `Plan por fases, con criterios de paso en vez de plazos fijos:

**Fase 1 — Control del dolor y reactivación (semanas 0-2)**
- Educación en dolor y pronóstico: la mayoría de radiculopatías discales mejoran sin cirugía. Es la intervención de mayor rendimiento aquí, dado el miedo que ha verbalizado
- Preferencia direccional si la hay: series cortas y frecuentes en la dirección que centraliza
- Higiene postural en sedestación: pausas cada 20-30 minutos, que es justo su umbral de tolerancia actual
- Marcha diaria progresiva, aprovechando que es su postura antiálgica
*Criterio de paso: dolor distal centralizado y NRS ≤ 4 en reposo*

**Fase 2 — Control motor y tolerancia a la carga (semanas 2-6)**
- Ejercicio de estabilización lumbopélvica: la regla de Hicks predice buena respuesta
- Bisagra de cadera y patrón de levantamiento, reexponiendo el gesto que desencadenó el cuadro
- Deslizamientos neurales si persiste la mecanosensibilidad, siempre sin aumentar el dolor distal
*Criterio de paso: gesto de carga tolerado sin irradiación*

**Fase 3 — Reexposición y prevención (a partir de la semana 6)**
- Fuerza progresiva de tren inferior y cadena posterior
- Reintroducción del gesto de mudanza con carga creciente
- Plan de mantenimiento y plan de recaída por escrito

**Señales para reconsiderar el plan**
Déficit motor progresivo, dolor que no cede en 6-8 semanas, o aparición de banderas rojas → replantear y derivar.

*Fuente: Magee - Orthopedic Physical Assessment (Lumbar Spine)*`,
  },
  {
    intent: 'prognosis',
    keywords: ['pronóstico', 'pronostico', 'cuánto', 'cuanto', 'tiempo', 'tardará', 'tardara', 'recuperación', 'recuperacion', 'alta', 'mejorará', 'mejorara', 'psicosocial', 'amarilla', 'miedo'],
    text: `El pronóstico aquí lo marcan dos bloques, y uno de ellos no es estructural:

**Factores favorables**
- Cuadro agudo de 3 semanas, con mecanismo claro y sin recurrencias previas
- Sin déficit motor objetivable por ahora
- Tiene una postura antiálgica (caminar) que se puede usar como tratamiento
- Historia natural: la mayoría de radiculopatías discales mejoran de forma sustancial en 6-12 semanas sin cirugía

**Factores de riesgo de cronificación (banderas amarillas)**
- Miedo verbalizado a la cirugía por antecedente familiar materno
- Creencia de que "se le va a quedar así" — expectativa negativa de recuperación
- Trabajo sedentario que reproduce el síntoma a diario, sin adaptación por ahora

Ese segundo bloque predice el resultado a 3 meses mejor que cualquier hallazgo de la exploración. Conviene cuantificarlo con **STarT Back** en esta misma visita y, si sale riesgo medio-alto, incorporar el abordaje cognitivo desde la sesión uno en lugar de dejarlo para cuando el dolor no mejore.

La reevaluación de la creencia sobre su espalda es tan medible como el SLR: pregúntale al alta qué cree que puede volver a hacer.

*Fuente: Goodman & Snyder - Differential Diagnosis for Physical Therapists*`,
  },
];

export const DEMO_CHAT_FALLBACK = `Estás en **modo demo**, así que esta respuesta es un ejemplo precargado y no responde a tu pregunta concreta: no hay ninguna llamada a un modelo detrás.

El caso cargado es una **lumbalgia con irradiación radicular L5 izquierda de 3 semanas** (paciente ficticia). Sobre él sí hay respuestas de demostración preparadas si preguntas por:

- **Banderas rojas** y criterios de derivación
- **Diagnóstico diferencial** entre las hipótesis en juego
- **Tests y exploración** a realizar
- **Plan de tratamiento** por fases
- **Pronóstico** y factores psicosociales

En el modo real esta misma pregunta se embebe con OpenAI, recupera fragmentos de la base de conocimiento clínico en Supabase (pgvector) y se responde con Claude citando la fuente de cada recomendación.`;

// ── /notes (SOAP) ──────────────────────────────────────────────────────────
export const DEMO_SOAP = `S (Subjetivo): Mujer de 43 años, administrativa, que consulta por lumbalgia de 3 semanas de evolución con irradiación a miembro inferior izquierdo. Inicio agudo durante una mudanza al levantar una caja pesada desde el suelo con flexo-rotación de tronco, con dolor lumbar inmediato. A los 2-3 días el dolor progresa distalmente por cara posterior de muslo y cara lateral de pierna hasta dorso del pie, acompañado de parestesias en dorso del pie. Refiere torpeza subjetiva de la pierna al subir escaleras, sin pérdida de fuerza percibida. NRS 6/10 en el momento de la consulta, máximo 7/10 matutino con mejoría progresiva a lo largo del día. Agravantes: sedestación mantenida (tolerancia aproximada de 20 minutos) y flexión de tronco. Aliviantes: marcha. Tomó ibuprofeno los primeros días con alivio parcial; sin analgesia en la última semana por preferencia propia. Cribado de banderas rojas negativo: sin fiebre, sin pérdida de peso no intencionada, sin dolor nocturno constante, sin clínica esfinteriana ni anestesia en silla de montar. Expresa miedo a que el cuadro sea una hernia con evolución quirúrgica, con antecedente materno de cirugía de columna.

O (Objetivo): Pendiente de completar en esta sesión. Exploración planificada: valoración de movilidad lumbar activa y respuesta a movimientos repetidos (búsqueda de preferencia direccional); tests de tensión neural (SLR, SLR cruzado, Slump); cribado neurológico L4-S1 por miotomas (dorsiflexión de tobillo, extensión del primer dedo, flexión plantar, extensión de rodilla), dermatomas y reflejos rotuliano y aquíleo, con registro de fuerza en escala 0-5 como línea base.

A (Análisis): Cuadro compatible con radiculopatía L5 izquierda de probable origen discal, en fase aguda, sin déficit neurológico objetivado hasta el momento. El patrón de irradiación, la topografía de las parestesias y la relación con sedestación y flexión apoyan un origen discogénico frente a dolor referido facetario (que raramente sobrepasa la rodilla) o estenosis de canal (que presentaría el patrón postural inverso). Cribado de banderas rojas negativo en esta visita. Se identifican banderas amarillas relevantes —miedo-evitación, expectativa negativa de recuperación y exposición laboral diaria al factor agravante— que condicionan el pronóstico a 3 meses en mayor medida que los hallazgos estructurales.

P (Plan): 1) Completar exploración neurológica y de tensión neural en esta misma sesión, con registro basal de fuerza para monitorizar progresión. 2) Educación en dolor y pronóstico, abordando explícitamente el temor a la evolución quirúrgica y el antecedente familiar. 3) Pauta domiciliaria en la dirección de centralización si se identifica preferencia direccional, más marcha diaria progresiva. 4) Adaptación de la sedestación laboral con pausas cada 20-30 minutos, por debajo de su umbral actual de tolerancia. 5) Administrar STarT Back para estratificar riesgo psicosocial. 6) Reevaluación en 7-10 días; criterios de derivación urgente explicados a la paciente: déficit motor progresivo, afectación bilateral o clínica esfinteriana.`;
