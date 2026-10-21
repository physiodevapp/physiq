// ============================================================
// PhysiQ-Assessment · data/farmacos-paciente.js
// Paso 3 de la farmacología (docs/farmacos-paciente.md): lo que la tarjeta
// «Fármacos que toma» de la fase 1 y los avisos de la fase 6 añaden a cada
// familia de la guía (data/farmacos.js). Va en un fichero propio para no
// chocar con las ramas que escriben familias en data/farmacos.js (decisión 19).
//
// Una entrada por familia, opcional: una familia con contenido y sin entrada
// tiene chip con su `nombre` y no da aviso; ninguna prueba falla por eso.
//   corto:  etiqueta del chip y de 📋 Notas
//   rotulo: comienzo del aviso de la fase 6 (redacción propia)
//   plan:   frases del aviso, copiadas LITERALES de los apartados de la familia
//           en data/farmacos.js, con su cita (una prueba lo exige). Un aviso
//           por familia revisada, escrito con ella o después (decisión 12).
// Los anticoagulantes y antiagregantes no tienen chip ni aviso aquí: salen de
// su tarjeta (docs/anticoagulado.md).
// Nunca propone cambiar, suspender ni ajustar la medicación; sin interacciones.
// ============================================================

export const FAMILIAS_PACIENTE = {
  aine: {
    corto: 'AINE',
    rotulo: 'Toma AINE',
    plan: [
      'Deshidratación y calor: el efecto de los AINE sobre el riñón empeora con deshidratación, poca perfusión renal o daño renal previo (Lucas 2019), y la deshidratación y el ejercicio intenso con calor reducen además el riego intestinal (Papantoniou 2023). Vigila la hidratación en sesiones largas o con calor.',
      'Anota si tomó una dosis antes de la sesión.',
    ],
  },
  corticoides: {
    corto: 'Corticoides',
    rotulo: 'Toma corticoides',
    plan: [
      'Fractura: el riesgo sube a los 3–6 meses de empezar y depende de la dosis (Compston 2018), incluso desde 2,5 mg/día; es mayor en los primeros meses, baja alrededor de un 30 % a los 6 meses de dejarlos y se normaliza a los 12 (Pofi 2023).',
      'Infección: quien toma corticoides puede no dar los signos y síntomas habituales de una infección, porque frenan la respuesta inflamatoria y la fiebre, y eso retrasa reconocerla (Yasir 2023; Liu 2013).',
      'Miopatía: el ejercicio puede atenuarla según los estudios que cita una cohorte, en la que los síntomas mejoraron tras una mediana de 107 días; recomienda cribar las caídas en mayores de 50 años (He 2025).',
      'Terapia manual: una revisión de casos de efectos adversos del thrust torácico pone la medicación con corticoides a largo plazo, sin definir la dosis ni la duración, entre las contraindicaciones absolutas del thrust en la columna torácica; su tabla sale de un trabajo de una escuela de osteopatía, no de una guía (Puentedura 2015). En el plan de tratamiento, la app quita el thrust con la tarjeta «Osteoporosis o fragilidad ósea» y cuando la tarjeta «Lupus (LES)» registra corticoides o dosis altas previas. Las fuentes leídas no dan normas para la carga ni para el resto de la terapia manual: tenlo en cuenta al elegir carga axial intensa.',
    ],
  },
  opioides: {
    corto: 'Opioides',
    rotulo: 'Toma opioides',
    plan: [
      'Mareo, somnolencia y caídas: frente a placebo dan más mareo y somnolencia (Dowell 2022). En mayores producen sedación, falta de coordinación, mareo y caídas, con más fracturas de cadera y no vertebrales (Dufort y Samaan 2021).',
      'El ejercicio terapéutico reduce el dolor y mejora la función en la lumbalgia, la fibromialgia y la artrosis de cadera o rodilla, con beneficios que se mantienen 2–6 meses, y puede sumarse a la medicación (Dowell 2022).',
      'Con el tramadol, el riesgo de depresión respiratoria es mayor al empezar o al subir la dosis, en las 24–72 h siguientes (Dhesi 2024).',
      'Mantener o aumentar la actividad física, junto con el agua y la fibra, ayuda a prevenir el estreñimiento; durante una retirada pautada, la guía pide aprovechar al máximo los tratamientos del dolor sin fármacos (Dowell 2022).',
      'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
    ],
  },
  gabapentinoides: {
    corto: 'Gabapentinoides',
    rotulo: 'Toma gabapentinoides',
    plan: [
      'Mareo, somnolencia y marcha: son las reacciones más frecuentes y las que más llevaron a abandonar la pregabalina; la mayoría fueron leves o moderadas, dependientes de la dosis y aparecieron en las 2 primeras semanas (Cross 2024).',
      'Mayores y función renal: ambos fármacos se eliminan por vía renal y el aclaramiento baja en los mayores y con disfunción renal, con más riesgo de reacciones adversas (Yasaei 2024; Cross 2024).',
      'Caídas y fracturas: en mayores, la fractura de cadera fue un 30 % más probable en los 60 días siguientes a dispensarlos, y más en personas frágiles o con enfermedad renal crónica (Leung 2024). En pacientes ingresados, las caídas fueron más frecuentes con ellos (OR 1,88) (Moon 2026).',
      'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
    ],
  },
  antidepresivos: {
    corto: 'Antidepresivos',
    rotulo: 'Toma antidepresivos',
    plan: [
      'Mareo, ortostatismo y caídas: los tricíclicos se asociaron a mucha más hipotensión ortostática que el placebo (OR 6,30), y los ISRS no (Bhanu 2021). La amitriptilina da hipotensión ortostática, mareo y sedación (Thour 2026). La duloxetina puede dar hipotensión ortostática, caídas y síncope, sobre todo al empezar o al subir la dosis (Biswas 2026).',
      'Con venlafaxina, uno de cada cinco mayores sin hipotensión ortostática al empezar la tuvo durante el tratamiento, y quienes la tuvieron se cayeron más (Wathra 2020). En mayores de 60 años, la hipotensión al ponerse de pie fue más frecuente en los 28 primeros días tras empezar un antidepresivo (ISRS, IRR 4,22; duloxetina, venlafaxina o mirtazapina, 2,17; tricíclicos, 2,12), y con duloxetina, venlafaxina o mirtazapina no siguió elevada después (Bhanu 2025).',
      'Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.',
    ],
  },
  sedantes: {
    corto: 'Benzodiacepinas o relajantes',
    rotulo: 'Toma benzodiacepinas o relajantes musculares',
    plan: [
      'Caídas y fracturas: las benzodiacepinas aumentan las caídas (OR 1,39–1,57) y se asocian con fuerza a la fractura de cadera; los hipnóticos Z, como el zolpidem, también aumentan las fracturas (OR 1,63). El riesgo es mayor las primeras semanas tras empezar y con el uso prolongado, por sedación, hipotensión ortostática, mareo, debilidad muscular, ataxia y problemas visuales (Capiau 2023).',
      'Equilibrio: el efecto depende de la dosis y es máximo en las primeras horas tras la toma; es mayor con dosis altas, con poco tiempo entre la toma y el despertar o con alcohol u otros sedantes, y la inestabilidad es más marcada en mayores (Capiau 2023).',
      'Rendimiento: en adultos sanos y activos, las benzodiacepinas no cambiaron la fuerza ni la resistencia, y una dosis de lorazepam solo bajó la potencia máxima de un esfuerzo anaeróbico breve; son 10 estudios pequeños, con las pruebas hechas entre 3 y 16 h después de la toma y sin medir el equilibrio (Holgado 2022). En un análisis secundario de un ensayo con mayores con peor función física, el programa de actividad física protegió de la pérdida de movilidad a quienes no tomaban benzodiacepinas, pero no a quienes las tomaban; en el conjunto de participantes la diferencia no fue significativa (Levati 2026).',
      'Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.',
    ],
  },
  estatinas: {
    corto: 'Estatinas',
    rotulo: 'Toma estatinas',
    plan: [
      'Al empezar un programa de ejercicio, las molestias pueden deberse al propio ejercicio y no a la estatina, y llevar a dejarla por error; ese pequeño aumento de riesgo no es motivo para abandonar el ejercicio ni la estatina sin valoración médica (Mangone 2024). Desaconsejar el ejercicio por tomar estatina puede aumentar el riesgo cardiovascular: el ejercicio moderado no debe desaconsejarse, mientras que el esfuerzo intenso y no habitual puede subir la CK e interactuar con la estatina (Epelde 2026).',
      'Rabdomiólisis por esfuerzo: el ejercicio extenuante, sobre todo sin entrenamiento, levantar mucho peso o hacerlo con mucho calor, y la deshidratación pueden causarla, igual que la inmovilización prolongada (Rout 2025).',
      'Mayores: por encima de 65 años la concentración de atorvastatina es mayor y el riesgo de miopatía también (McIver y Siddique 2025). Las fuentes leídas no tratan la terapia manual ni las caídas.',
      'Entrenamiento: una revisión sistemática no encontró pruebas consistentes de que las estatinas frenen la mejora con el entrenamiento, aunque solo dos estudios lo midieron (Noyes 2017). En uno, con simvastatina, el consumo máximo de oxígeno subió un 10 % con el ejercicio solo y un 1,5 % con la estatina (Noyes 2017); en otro, en mayores, la mejora del consumo pico tras 12 semanas de caminar en cinta fue parecida con y sin estatina (Slade 2021).',
    ],
  },
  // Solo lo que cambia la sesión: el tendón (cuándo, qué hacer ante el dolor,
  // cómo rehabilitarlo). Se dejan en la guía la aorta, los nervios, el ánimo,
  // el sueño, «cuándo consultar» y el deportista («evitarlas si hay otra
  // opción» se leería como consejo sobre el antibiótico).
  fluoroquinolonas: {
    corto: 'Fluoroquinolonas',
    rotulo: 'Toma o ha tomado fluoroquinolonas',
    plan: [
      'Cuándo: puede empezar en las primeras horas o los 2 primeros días de tratamiento y hasta varios meses después de terminarlo (EMA 2018).',
      'Ante dolor o hinchazón de un tendón, durante el tratamiento o después, la EMA pide reposo de la zona y contacto inmediato con el médico (EMA 2018); otras revisiones piden reducir la carga del tendón y no ejercitar la zona afectada (Rusu 2023), con analgesia y fisioterapia (Baggio y Ananda-Rajah 2021).',
      'Rehabilitación: puede responder mal a los programas excéntricos habituales, al menos al principio. Se propone en dos fases: primero soporte y protección, para que el tendón se recupere de la lesión química, y después carga progresiva (Lewis y Cook 2014). Una revisión cita proteger el tendón el primer mes (alza de talón, ortesis, muletas) y reducir la carga del Aquiles de 6 semanas a 6 meses (Rusu 2023).',
    ],
  },
  betabloqueantes: {
    corto: 'Betabloqueantes',
    rotulo: 'Toma betabloqueantes',
    plan: [
      'La frecuencia cardíaca no sirve para dosificar el ejercicio: la bajan en todo el rango de intensidades, la frecuencia máxima ya no se puede estimar y las zonas de frecuencia dejan de corresponder al esfuerzo real; un cambio de dosis o de cumplimiento la vuelve a cambiar (Mitchell 2025). Con 100 mg de metoprolol, la frecuencia fue unos 40 latidos por minuto más baja al mismo esfuerzo percibido (Mitchell 2025).',
      'Usa el esfuerzo percibido (escala de Borg de 6 a 20): en un ensayo, su relación con el consumo de oxígeno se mantuvo con el fármaco (Mitchell 2025), y una guía europea recoge que sirve cuando la frecuencia cardíaca no se puede usar. Como referencia, 12–13 es intensidad moderada y 14–16 alta (Hansen 2022).',
      'Las fuentes no coinciden en cuánto fiarse del Borg: la guía europea lo quiere solo como complemento de un método objetivo, como la prueba de esfuerzo, y advierte que los betabloqueantes pueden dificultar su interpretación (Hansen 2022); el ensayo que lo apoya es de 13 jóvenes sanos con una sola dosis (Mitchell 2025). Si su cardiólogo le ha dado una intensidad a partir de una prueba de esfuerzo, esa manda.',
      'Por el mareo y la hipotensión (Ez Eddin 2025; Farzam y Jan 2023), cuida los cambios de postura y el final de la sesión. Las fuentes leídas no tratan la terapia manual.',
      'Calor: en un metaanálisis, los betabloqueantes no cambiaron la temperatura central ni el sudor en el ejercicio con calor; con los no selectivos, como el propranolol, subió algo más (0,11 °C). Casi todos los estudios eran de hombres jóvenes y sanos (Hospers 2024). Ante un golpe de calor clásico se revisa la medicación, en especial los betabloqueantes (Morris y Patel 2023).',
      'Caídas: en mayores de 55 años, los no selectivos, como el propranolol, se asociaron a más caídas (HR 1,22; IC 95 % 1,01–1,48) y los selectivos no (HR 0,92; 0,83–1,01). Ese estudio miró el uso mantenido, no el comienzo, cuando otros estudios vieron más caídas por hipotensión (Ham 2017).',
    ],
  },
  antihipertensivos: {
    corto: 'Antihipertensivos',
    rotulo: 'Toma diuréticos u otros antihipertensivos',
    plan: [
      'Caídas: en mayores con salud compleja, el riesgo de caer subió un 35–50 % en los 30 días siguientes a empezar un antihipertensivo, y otros estudios lo vieron también al añadir otro o al subir la dosis (Jödicke 2023). Los ensayos no hallaron más caídas, pero sí más hipotensión y síncope (Albasri 2021), y excluyen a los más frágiles (McEvoy 2024). En esas semanas, cuida los cambios de postura y el equilibrio.',
      'Hipotensión ortostática: una caída de 20 mmHg de la sistólica o de 10 de la diastólica al ponerse de pie, medida al minuto y a los 3 minutos tras 5 minutos sentado o tumbado (McEvoy 2024). Los diuréticos la provocan más; los IECA, los ARA II y los dihidropiridínicos, menos, y sobre todo en las 2 primeras semanas tras empezar o subir la dosis (McEvoy 2024). Empeora al levantarse, tras el ejercicio y con calor (Ringer 2025).',
      'Para prevenirla: levantarse por fases (tumbado, sentado, de pie), beber lo suficiente, y cruzar las piernas o tensar los músculos de piernas y caderas al ponerse de pie (Ringer 2025; McEvoy 2024). Si hay riesgo de caer, ejercicio supervisado, como la bicicleta reclinada o la natación (Ringer 2025).',
      'Calor: en mayores, los diuréticos de asa, los IECA y los ARA II se asociaron a más ingresos por golpe de calor o deshidratación, también sin ola de calor (Layton 2020).',
    ],
  },
  antidiabeticos: {
    corto: 'Antidiabéticos',
    rotulo: 'Toma insulina u otros antidiabéticos',
    plan: [
      'Riesgo de hipoglucemia con el ejercicio: lo tiene quien usa insulina o sulfonilureas. Con metformina, gliptinas, GLP-1, gliflozinas o pioglitazona solos no hace falta tomar hidratos por el ejercicio; combinados con insulina o sulfonilureas, sí hay riesgo (Kanaley 2022; Colberg 2016). Con insulina o sulfonilureas, que traiga hidratos de absorción rápida y su medidor de glucosa, y glucagón si tiende a hipoglucemias graves (Kanaley 2022; Riddell 2017).',
      'Glucemia antes de empezar: el objetivo es 90–250 mg/dL (5,0–13,9 mmol/L) (Colberg 2016). Por debajo de 90 mg/dL, hidratos antes de empezar (Colberg 2016; Riddell 2017). Por encima de 250 mg/dL hay que mirar las cetonas: con cetonas moderadas o altas no se hace ejercicio; sin ellas, ejercicio ligero o moderado si se encuentra bien e hidratado, y el intenso cuando baje de 250 (Colberg 2016; Kanaley 2022). Una hipoglucemia grave en las 24 horas previas contraindica el ejercicio (Riddell 2017).',
      'Durante: en la diabetes tipo 1, la hipoglucemia aparece en la mayoría dentro de los 45 minutos de ejercicio aeróbico (Riddell 2017). Después: aparece sobre todo 6–15 horas más tarde, aunque el riesgo dura hasta 48 horas (Colberg 2016), y el ejercicio largo e intenso lo aumenta con insulina o sulfonilureas (Kanaley 2022).',
      'Lugar de inyección: la insulina se pone en una zona que no vaya a trabajar, porque el ejercicio acelera su absorción, y el calor ambiente también (Adolfsson 2022). Frotar o masajear con fuerza la zona acelera la absorción, igual que el calor de una sauna, una ducha o un baño caliente poco después de inyectarse (Bahendeka 2019); calentar la zona a 40 °C adelantó el efecto de la insulina rápida (Gradel 2018; Pitt 2020). Por eso, evita el masaje y el calor local sobre una zona recién inyectada. Las fuentes leídas no tratan otras técnicas de terapia manual.',
      'Gliflozinas: el ejercicio, solo si se encuentra bien, aunque la glucosa no esté muy alta, por la cetoacidosis con glucosa normal (Kanaley 2022); por la pérdida de volumen y el mareo (Tentolouris 2019), cuida la hidratación y los cambios de postura.',
      'Hipoglucemia en la sesión: para el ejercicio y que se mida la glucosa (Moser 2020; Costello 2023). Con 70 mg/dL (3,9 mmol/L) o menos, 15 g de hidratos de absorción rápida, mejor glucosa (tabletas, zumo, refresco), sin grasa ni proteína; volver a medir a los 15 minutos y repetir si sigue baja, la regla «15-15»; cuando se recupere, que coma algo, porque con insulina o sulfonilureas puede repetirse (ADA 2025; Costello 2023). Si bajó de 54 mg/dL, no se reanuda el ejercicio (Moser 2020).',
    ],
  },
  // Sin repetir los avisos de la osteoporosis de la fase 6 (fuerza, impacto,
  // moverse con seguridad, sin thrust, red de la fractura vertebral): solo lo
  // propio del fármaco. Con la tarjeta de osteoporosis y un bifosfonato o
  // denosumab, sale solo (derivadasDeTarjetas()).
  hueso: {
    corto: 'Fármacos del hueso',
    rotulo: 'Toma fármacos que tocan el hueso',
    plan: [
      'Pronto, con imagen del fémur: un dolor de muslo, ingle o cadera sin explicación con bifosfonato o denosumab. La guía británica pide imagen del fémur (radiografía del fémur entero, gammagrafía o resonancia) y, si hay fractura atípica, también del otro (Gregson 2025). Hasta entonces, sin impacto ni carga de esa pierna.',
      'Tras una infusión de zoledronato, los 3 primeros días pueden traer fiebre y dolor muscular (Alaranji y Reilly 2025): si la sesión cae en esos días, tenlo en cuenta al dosificar y al interpretar los síntomas.',
      'Inhibidores de la aromatasa: en un ensayo con 121 mujeres inactivas con dolor articular, fuerza supervisada 2 días por semana (6 ejercicios, 3 series de 8–12 repeticiones, subiendo el peso tras dos sesiones haciendo 12 repeticiones en cada serie) y 150 minutos semanales de aeróbico, del 50 % al 60–80 % de la frecuencia cardíaca máxima en el primer mes, durante 12 meses, bajaron el peor dolor 1,6 puntos (29 %), frente a una subida del 3 % con los cuidados habituales, sin efectos adversos (Irwin 2015). El beneficio más claro llegó a los 12 meses (Irwin 2015).',
    ],
  },
};

// Textos de la tarjeta, la guía y la fase 5 (redacción propia, decisión 18)
export const TEXTOS_FARMACOS_PACIENTE = {
  nota: 'Marca las familias que toma ahora; los corticoides, también si le han puesto una infiltración hace poco. Sirve para la guía de fármacos y para los avisos del plan; no cambia el cribado. No le digas que deje ni cambie ninguna medicación: las dudas, a quien la prescribe.',
  pendientes: 'Aún sin guía revisada:',
  pendientesIA: 'Si tienes dudas, «✨ Preguntar a la IA» en modo «Fármacos».',
  lineaComun: 'No le digas que deje ni cambie la medicación: las dudas, a quien la prescribe.',
  guiaPaciente: 'Familias que toma según la fase 1:',
  guiaVolver: 'Vuelve a tocar «Este paciente» para ver todas las familias.',
  verGuia: 'Ver sus fármacos en la guía →',
  verGuiaFase5: 'Ver en la guía (este paciente) →',
};
