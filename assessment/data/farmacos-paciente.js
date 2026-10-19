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
      'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
    ],
  },
  antidepresivos: {
    corto: 'Antidepresivos',
    rotulo: 'Toma antidepresivos',
    plan: [
      'Mareo, ortostatismo y caídas: los tricíclicos se asociaron a mucha más hipotensión ortostática que el placebo (OR 6,30), y los ISRS no (Bhanu 2021). La amitriptilina da hipotensión ortostática, mareo y sedación (Thour 2026). La duloxetina puede dar hipotensión ortostática, caídas y síncope, sobre todo al empezar o al subir la dosis (Biswas 2026).',
      'Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.',
    ],
  },
  sedantes: {
    corto: 'Benzodiacepinas o relajantes',
    rotulo: 'Toma benzodiacepinas o relajantes musculares',
    plan: [
      'Caídas y fracturas: las benzodiacepinas aumentan las caídas (OR 1,39–1,57) y se asocian con fuerza a la fractura de cadera; los hipnóticos Z, como el zolpidem, también aumentan las fracturas (OR 1,63). El riesgo es mayor las primeras semanas tras empezar y con el uso prolongado, por sedación, hipotensión ortostática, mareo, debilidad muscular, ataxia y problemas visuales (Capiau 2023).',
      'Equilibrio: el efecto depende de la dosis y es máximo en las primeras horas tras la toma; es mayor con dosis altas, con poco tiempo entre la toma y el despertar o con alcohol u otros sedantes, y la inestabilidad es más marcada en mayores (Capiau 2023).',
      'Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.',
    ],
  },
  estatinas: {
    corto: 'Estatinas',
    rotulo: 'Toma estatinas',
    plan: [
      'Al empezar un programa de ejercicio, las molestias pueden deberse al propio ejercicio y no a la estatina, y llevar a dejarla por error; ese pequeño aumento de riesgo no es motivo para abandonar el ejercicio ni la estatina sin valoración médica (Mangone 2024). Desaconsejar el ejercicio por tomar estatina puede aumentar el riesgo cardiovascular: el ejercicio moderado no debe desaconsejarse, mientras que el esfuerzo intenso y no habitual puede subir la CK e interactuar con la estatina (Epelde 2026).',
      'Rabdomiólisis por esfuerzo: el ejercicio extenuante, sobre todo sin entrenamiento, levantar mucho peso o hacerlo con mucho calor, y la deshidratación pueden causarla, igual que la inmovilización prolongada (Rout 2025).',
      'Mayores: por encima de 65 años la concentración de atorvastatina es mayor y el riesgo de miopatía también (McIver y Siddique 2025). Las fuentes leídas no tratan la terapia manual, las caídas ni las adaptaciones al entrenamiento.',
    ],
  },
  betabloqueantes: {
    corto: 'Betabloqueantes',
    rotulo: 'Toma betabloqueantes',
    plan: [
      'La frecuencia cardíaca no sirve para dosificar el ejercicio: la bajan en todo el rango de intensidades, la frecuencia máxima ya no se puede estimar y las zonas de frecuencia dejan de corresponder al esfuerzo real; un cambio de dosis o de cumplimiento la vuelve a cambiar (Mitchell 2025). Con 100 mg de metoprolol, la frecuencia fue unos 40 latidos por minuto más baja al mismo esfuerzo percibido (Mitchell 2025).',
      'Usa el esfuerzo percibido (escala de Borg de 6 a 20): en un ensayo, su relación con el consumo de oxígeno se mantuvo con el fármaco (Mitchell 2025), y una guía europea recoge que sirve cuando la frecuencia cardíaca no se puede usar. Como referencia, 12–13 es intensidad moderada y 14–16 alta (Hansen 2022).',
      'Las fuentes no coinciden en cuánto fiarse del Borg: la guía europea lo quiere solo como complemento de un método objetivo, como la prueba de esfuerzo, y advierte que los betabloqueantes pueden dificultar su interpretación (Hansen 2022); el ensayo que lo apoya es de 13 jóvenes sanos con una sola dosis (Mitchell 2025). Si su cardiólogo le ha dado una intensidad a partir de una prueba de esfuerzo, esa manda.',
      'Por el mareo y la hipotensión (Ez Eddin 2025; Farzam y Jan 2023), cuida los cambios de postura y el final de la sesión. Las fuentes leídas no tratan la terapia manual, el ejercicio con calor ni la sudoración en el esfuerzo.',
      'Caídas: en mayores de 55 años, los no selectivos, como el propranolol, se asociaron a más caídas (HR 1,22; IC 95 % 1,01–1,48) y los selectivos no (HR 0,92; 0,83–1,01). Ese estudio miró el uso mantenido, no el comienzo, cuando otros estudios vieron más caídas por hipotensión (Ham 2017).',
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
