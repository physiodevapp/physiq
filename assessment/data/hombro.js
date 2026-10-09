// ============================================================
// PhysiQ-Assessment · data/hombro.js
// Contenido clínico de la región HOMBRO: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_POSQUIRURGICO, SIS_ENDOCRINO, SIS_HEMATOLOGICO, DOSIS_DERIVAR } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.hombro
export const screening = {
  label: 'Hombro y Cuadrante Superior',
  sistemas: [
    SIS_POSQUIRURGICO,   // solo con mecanismo Post-quirúrgico (docs/posquirurgico.md)
    {
      id: 'h_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Historia personal de cáncer o tratamiento oncológico (quimio, radioterapia)',
        'Pérdida de peso inexplicada (>5 % del peso en 6 meses)',
        'Dolor nocturno constante que despierta al paciente sin alivio con cambio de postura',
        'Ganglios linfáticos duros, fijos e indoloros en axila o cuello',
        'Tumor de Pancoast: dolor irradiado a escápula, cuello, axila o cara medial del brazo',
        'Tumor (Lluch 2020, cap. 3.1 (Struyf), pp. 54 y 61; Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 75–76): antecedente de cáncer, pérdida de peso inexplicada, dolor sin relación con el movimiento o implacable, dolor nocturno o en reposo con síntomas sistémicos, masa o deformidad inexplicada. Raros en clavícula distal y acromion; pensar en ellos si hay dolor nocturno + síntomas sistémicos.'
      ],
      banderasAmarillas: [
        'Edad >50 años con dolor insidioso sin causa mecánica clara',
        'Debilidad muscular proximal idiopática'
      ],
      preguntas: [
        { id: 'h3', text: '¿Tiene antecedentes de cáncer de cualquier tipo, o ha recibido quimioterapia, radioterapia o terapia hormonal?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Un cáncer previo puede volver o extenderse al hueso, a los ganglios o al plexo braquial, y el hombro es un destino frecuente: el cáncer de mama y el de pulmón son los que más metastatizan en él. Los tratamientos cuentan también: la quimioterapia, la radioterapia y la terapia hormonal pueden favorecer tumores nuevos, y la radioterapia de la axila deja secuelas propias en el hombro.',
            peso: 'Es una bandera roja aunque el cáncer sea antiguo o el dolor tenga una causa aparente; en el hombro no hay cifras de precisión. Un SÍ no diagnostica: obliga a buscar el resto (dolor nocturno constante, pérdida de peso, ganglios duros y fijos, debilidad o atrofia sin el patrón de un nervio, calor local en la escápula). Una neoplasia puede presentarse igual que un hombro congelado, y con antecedente de cáncer unos ganglios sospechosos piden atención médica inmediata.',
            detalle: 'Mecanismo: las células tumorales viajan por la linfa o por la sangre. El cáncer de mama llega por los linfáticos y por el plexo venoso vertebral al hueso del hombro, las costillas y la columna, y también al plexo braquial; el remodelado continuo del hueso lo hace un terreno favorable. El tumor de Pancoast, en el vértice del pulmón, invade el plexo braquial (C8–T1). Los depósitos en la cabeza del húmero y la glenoides afectan a la articulación y a los músculos que la rodean.\n\nCómo se presenta (Goodman): dolor que va a más, peor de noche, que no cede con nada; atrofia mayor de lo que cabría esperar y que no sigue el patrón de un nervio ni de un músculo; calor local en la escápula, que puede preceder en 1–2 semanas a un bulto palpable; limitación marcada con tope vacío, o espasmo del pectoral mayor con movilidad pasiva completa y escápula móvil. La radioterapia de la axila predice problemas de hombro, que pueden aparecer enseguida o años después.\n\nHombro congelado (Lluch 2020): una neoplasia puede imitarlo, con dolor y rigidez activa y pasiva; suelen añadirse antecedente de cáncer, pérdida de peso reciente, fiebre o dolor que no cede. En quienes se sospecha un hombro congelado, la radiografía encuentra un tumor u otra patología grave en el 0,3–0,8 %: es raro, y por eso pesa tanto el antecedente.\n\nQué hacer con un SÍ: preguntar qué cáncer, cuándo y qué tratamiento recibió; palpar los ganglios axilares y supraclaviculares (los duros, fijos e indoloros son sospechosos) y hacer una exploración neurológica breve. Con ganglios sospechosos, derivar de inmediato.',
            fisiologia: {
              pasos: [
                'Las células de un tumor se desprenden y viajan por los vasos linfáticos o por la sangre.',
                'El hueso se remodela sin parar y eso lo hace buen terreno para que prendan: el cáncer de mama y el de pulmón son los que más llegan al hombro.',
                'El tumor crece en la cabeza del húmero o en la glenoides y afecta a la articulación y a los músculos de alrededor, o invade el plexo braquial.',
                'Para crecer se lleva el riego a costa del tejido sano, que queda isquémico: aparece un dolor profundo, peor de noche, que no depende de la postura.',
                'Por eso duele y limita como un problema mecánico, pero no mejora con el tratamiento.'
              ],
              metafora: 'Como semillas que el viento lleva lejos y que prenden mejor en la tierra que se remueve: el hueso, que se renueva sin parar, es tierra fértil.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 13, pp. 464 y 472–475; cap. 18, pp. 685 y 700–705.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1.1 (Powell y Lewis), pp. 73 y 75–76.'
            ]
          } },
        { id: 'h4', text: '¿El dolor nocturno lo despierta desde un sueño profundo y le es imposible encontrar una posición que lo alivie para volver a dormir?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El dolor de un tumor en el hueso no depende de la carga: el tumor se lleva el riego del tejido sano, que queda isquémico y duele en reposo, sobre todo de noche. Por eso la clave no es que duela de noche, sino que despierte del sueño profundo y que ninguna postura lo alivie.',
            peso: 'Aislado pesa poco en el hombro: el dolor nocturno es típico del hombro congelado en sus primeras fases y forma parte del cluster de rotura del manguito. No todos los cánceres dan dolor nocturno ni todo dolor nocturno es cáncer. Pesa si es constante e intenso (7 o más sobre 10), va a más y no cede con nada, o si se suma a un antecedente de cáncer, pérdida de peso o síntomas generales.',
            detalle: 'Mecanismo: el tejido tumoral está muy vascularizado a costa del órgano que lo aloja; el tejido sano vecino queda isquémico y duele en reposo, sobre todo de noche. Al principio puede ser leve e intermitente y, con el tiempo, más intenso y constante. Goodman considera el dolor óseo nocturno el síntoma más sospechoso, sobre todo con antecedente de cáncer; en el tumor de Pancoast el dolor óseo empeora de noche y causa inquietud.\n\nCon qué se confunde: muchos problemas mecánicos del hombro duelen de noche. Quien no puede tumbarse sobre el hombro, o se despierta al girarse sobre él, suele tener un problema mecánico agudo; quien aguanta de 30 minutos a una hora sobre ese lado está más bien en fase subaguda. El hombro congelado tiene un dolor nocturno marcado en sus fases iniciales (Lluch 2020), y en la rotura del manguito el dolor nocturno forma cluster con la edad > 65 años y la debilidad en rotación externa. Algunas personas notan más el dolor al acostarse solo porque es el primer momento del día sin distracciones. Los tumores de la clavícula distal y el acromion son raros: Lluch indica pensar en ellos con dolor nocturno o en reposo y síntomas generales.\n\nOtras causas que despiertan: la úlcera duodenal (entre la medianoche y las 3, y se alivia al comer), la angina nocturna o la falta de aire al tumbarse.\n\nQué preguntar con un SÍ: si le despierta al girarse sobre ese lado o sin moverse; qué hace para volver a dormirse y si lo consigue; si al despertar tiene sudores, fiebre, tos, palpitaciones o falta de aire; si el dolor va a más con las semanas.',
            fisiologia: {
              pasos: [
                'Un tumor necesita mucho riego y lo consigue formando vasos nuevos, a costa del tejido sano que lo rodea.',
                'El tejido vecino recibe menos sangre y oxígeno de los que necesita: queda isquémico.',
                'La isquemia activa los receptores del dolor sin necesidad de carga ni de movimiento.',
                'Como no depende de la carga, el dolor aparece en reposo y de noche, despierta del sueño y cambiar de postura no lo alivia.'
              ],
              nota: 'Goodman describe que el dolor tumoral es sobre todo nocturno, pero no explica por qué se nota más de noche que de día.',
              metafora: 'Como un inquilino que acapara la calefacción del edificio: los vecinos pasan frío aunque nadie se mueva.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 6, p. 234; cap. 8, p. 307; cap. 13, p. 476; cap. 18, pp. 690, 703 y 707.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), pp. 61 y 66; cap. 3.1.1 (Powell y Lewis), pp. 70–71.'
            ]
          } },
        { id: 'h6', text: '¿Ha notado pérdida de peso reciente, rápida y sin proponérselo?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Perder peso sin proponérselo es un síntoma general. En el cáncer, las sustancias inflamatorias del tumor y de las propias defensas aceleran el gasto de energía y la destrucción de músculo y grasa, y quitan el apetito (caquexia); lo mismo ocurre en las infecciones crónicas, la insuficiencia cardiaca, renal o respiratoria y otras enfermedades. Junto a un dolor de hombro, sugiere que la causa puede no estar en el hombro.',
            peso: 'Cuenta la pérdida de más del 5 % del peso en 6 meses sin causa que la explique (criterio actual de caquexia). Aislada pesa poco y tiene muchas causas; en el hombro no hay cifras de precisión. Lluch la incluye entre las banderas rojas de tumor. Pesa con antecedente de cáncer, dolor nocturno constante, fiebre o sudores, o tos con sangre.',
            detalle: 'Por qué preocupa: Goodman la incluye entre los signos de alarma complementarios del cáncer, junto al dolor nocturno, las infecciones frecuentes y la debilidad muscular proximal. En el hombro aparece en el tumor de Pancoast (con fiebre, ronquera, dolor de garganta y tos con sangre) y, junto al dolor de flanco, la fiebre y la sangre en la orina, en la patología renal. En la tabla de diagnóstico diferencial de Lluch, la neoplasia que imita un hombro congelado se distingue por el antecedente de cáncer, la pérdida de peso reciente, la fiebre y el dolor que no cede.\n\nMecanismo (caquexia): no es un simple ayuno. El tumor y las células inmunitarias producen citocinas (TNF-α, IL-6, IL-1β) que aumentan el gasto de energía en reposo, degradan las proteínas del músculo, movilizan la grasa e inflaman el hipotálamo, que regula el apetito. Las células tumorales consumen además mucha glucosa. Por eso la pérdida de peso sigue aunque se coma lo suficiente, y el soporte nutricional por sí solo no la corrige. Es más frecuente en los cánceres digestivos, de páncreas y de pulmón que en los de mama; aparece también en la insuficiencia cardiaca y renal, la EPOC, la tuberculosis y el VIH.\n\nCuánto: el criterio actual de caquexia es perder más del 5 % del peso en 6 meses (más del 2 % si ya hay poca masa muscular o un IMC < 20). Goodman, en su edición de 2018, ponía como ejemplo de pérdida rápida un 10 % en 2 semanas; prevalece el criterio más reciente. Otras causas: la neumonía o la tuberculosis (con fiebre, sudores y tos) y la hepatitis en su fase previa a la ictericia.\n\nQué preguntar con un SÍ: cuántos kilos y en cuánto tiempo, si tiene explicación (dieta, ejercicio, estrés), si come menos o se llena enseguida, y si hay sudores nocturnos, fiebre, tos o cansancio desproporcionado. En la exploración, la caquexia se ve como músculos de los miembros consumidos y relieves óseos marcados (hombros, clavículas, costillas) con poca fuerza de prensión.',
            fisiologia: {
              pasos: [
                'El tumor y las células inmunitarias del propio paciente liberan citocinas inflamatorias (TNF-α, IL-6, IL-1β).',
                'Esas citocinas aumentan el gasto de energía en reposo y activan la degradación de las proteínas del músculo, mientras frenan su síntesis.',
                'Además inflaman el hipotálamo, que regula el apetito: la persona come menos y se sacia antes.',
                'Las células tumorales consumen mucha glucosa y obligan a gastar las reservas de grasa y proteína.',
                'El resultado es una pérdida de músculo y grasa que no se corrige comiendo más.'
              ],
              metafora: 'Como una casa con la calefacción averiada al máximo: por mucha leña que se traiga, se consume antes de llenar el almacén.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Daley 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 9, p. 343; cap. 13, pp. 475–476; cap. 18, pp. 685, 698 y 703.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), pp. 75–76.',
              { texto: 'Daley 2025 — Daley, Ali, Ohnuma y Adigun, «Anorexia and Cachexia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430977/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Cintura escapular / Axila', desc: 'Tumor de Pancoast apical, cáncer de mama, linfomas' },
        { zona: 'Cara medial del brazo', desc: 'Distribución del nervio cubital (C8, T1, T2) — Pancoast' },
        { zona: 'Columna torácica', desc: 'Metástasis vertebrales T4-T10; cánceres de mama, próstata, pulmón' }
      ],
      impactoDescanso: [
        'Dolor óseo nocturno de tipo "taladro" que no cede al acostarse ni cambiar postura',
        'Sudoraciones masivas y fiebres fragmentan el descanso severamente'
      ],
      impactoEjercicio: [
        'Fatiga oncológica extrema independiente del nivel de actividad, sin alivio con reposo',
        'Debilidad muscular proximal (neuromiopatía carcinomatosa) — dificultad para elevar el brazo',
        'Anemia secundaria a quimio/radio: taquicardia, disnea y mareos al esfuerzo mínimo',
        'Ejercicio vigoroso contraindicado si plaquetas <50.000/mm³ o hemoglobina <10 g/dL'
      ]
    },
    {
      id: 'h_cardio', icon: '❤️', nombre: 'Cardiovascular',
      banderasRojas: [
        'Dolor de hombro que aumenta con esfuerzo físico NO relacionado con el brazo (subir escaleras)',
        'Dolor acompañado de sudores, náuseas, opresión en mandíbula o pecho',
        'Angina no aliviada por reposo o nitroglicerina (>20 min)',
        'Síncope repentino sin mareo previo'
      ],
      banderasAmarillas: [
        'Dolor que cambia al acostarse o con falta de aire en reposo',
        'Uso de betabloqueantes o inhibidores de la ECA'
      ],
      preguntas: [
        { id: 'h1', text: '¿El dolor de hombro aumenta con el esfuerzo físico general (subir escaleras, caminar) aunque no mueva los brazos?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El corazón comparte segmentos medulares con el hombro y el brazo, así que una isquemia cardiaca puede doler solo en el hombro. La clave es qué lo desencadena: si duele al subir escaleras o caminar sin mover los brazos, lo que lo provoca es la demanda de oxígeno del corazón, no la carga del hombro.',
            peso: 'Es una bandera roja cardiaca: Goodman la da como una de las pistas de origen visceral aunque el hombro también duela al moverlo. Pesa más si aparece a los 3–5 minutos de empezar el esfuerzo y cede en pocos minutos de reposo, si se acompaña de sudor, náuseas, falta de aire o presión en el pecho, y en mayores de 50 años, mujeres posmenopáusicas o personas con antecedentes cardiacos o factores de riesgo. Si está pasando ahora y no cede con reposo, es una urgencia.',
            detalle: 'Mecanismo: la angina aparece cuando el trabajo del corazón supera el oxígeno que le llega, casi siempre por placas de ateroma en las coronarias. Los metabolitos de la isquemia se acumulan en el músculo cardiaco y disparan el dolor. El corazón está inervado por los segmentos C3 a T4, de modo que el dolor se refiere a la mandíbula, el cuello, el trapecio, el hombro o el brazo, sobre todo el izquierdo y por su cara cubital, por las conexiones entre los plexos cardiaco y braquial.\n\nEl esfuerzo que no mueve el brazo: subir un piso o pedalear en una bicicleta estática aumenta la demanda del corazón sin cargar el hombro. Goodman describe que el dolor de hombro de origen cardiaco empieza a los 3–5 minutos del esfuerzo y cede con el reposo en 2–5 minutos (hasta 15), mientras que una lesión muscular necesita más de una hora de reposo. Trabajar con los brazos por encima de la cabeza también aumenta la demanda del corazón: debilidad o falta de aire en esa postura pueden ser isquemia.\n\nQuién: mayores de 50 años, mujeres posmenopáusicas, antecedente familiar de primer grado, hipertensión, diabetes, colesterol alto, o antecedente de angina, infarto, stent o bypass. Las personas más jóvenes pueden tener síntomas atípicos, como dolor de hombro sin dolor torácico; en las mujeres pueden predominar el cansancio intenso, la falta de aire o la debilidad.\n\nCon qué se confunde: un mismo hombro puede tener a la vez un problema mecánico y uno cardiaco. El dolor del infarto no se modifica con la postura, la respiración ni el movimiento, y el de origen cardiaco no se reproduce al palpar ni con los test resistidos.\n\nQué hacer con un SÍ: tomar constantes, preguntar por factores de riesgo y por síntomas acompañantes; si toma nitroglicerina, preguntar si le alivia el hombro. Derivar al médico si el patrón se confirma; si el dolor está presente y no cede con reposo, a urgencias.',
            fisiologia: {
              pasos: [
                'Unas coronarias estrechadas por placas de ateroma llevan sangre suficiente en reposo, pero no cuando el corazón tiene que trabajar más.',
                'Al subir escaleras o caminar, el corazón late más fuerte y más rápido y necesita más oxígeno del que le llega.',
                'En el músculo cardiaco sin oxígeno suficiente se acumulan metabolitos que estimulan sus terminaciones nerviosas.',
                'Esas señales entran en la médula por los mismos segmentos (C3 a T4) que recogen la sensibilidad del cuello, el hombro y el brazo, y el cerebro las sitúa allí.',
                'Al parar, la demanda baja y el dolor cede en pocos minutos: por eso duele con el esfuerzo general y no con el movimiento del brazo.'
              ],
              metafora: 'Como una tubería estrecha que basta para un grifo pero no para dos: en cuanto se pide más, falta presión, y la queja llega por la línea que comparte con el hombro.'
            },
            fuentes: ['Goodman 2018'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92 y 120; cap. 6, pp. 226 y 233–236; cap. 18, pp. 685, 690 y 693–694.'
            ]
          } },
        { id: 'h2', text: '¿El dolor se acompaña de sudores repentinos, náuseas o sensación opresiva en mandíbula/pecho?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El sudor repentino, las náuseas y la opresión en la mandíbula o el pecho acompañan con frecuencia al dolor cardiaco. Si aparecen a la vez que el dolor de hombro, apuntan a que el origen está en el corazón y no en la articulación.',
            peso: 'Es una bandera roja seria: Goodman pide tratar como visceral un dolor de hombro con sudor coincidente, aunque el hombro duela al moverlo. Si está pasando ahora, dura 30 minutos o más o no cede con reposo, es una urgencia médica. En las mujeres el cuadro puede ser atípico: cansancio intenso, falta de aire, debilidad o náuseas, a veces semanas antes.',
            detalle: 'Por qué acompañan al dolor: en el infarto y la angina, la isquemia del corazón se acompaña de náuseas, vómitos, sudor, falta de aire, cansancio, palidez o síncope; Goodman los da como banderas rojas que delatan el origen sistémico de un síntoma musculoesquelético. El dolor llega a la mandíbula por las conexiones entre las astas posteriores de la médula cervical y el núcleo espinal del trigémino, y al brazo, por su cara cubital, por las conexiones entre los plexos cardiaco y braquial.\n\nCómo se presenta el infarto: dolor torácico intenso y opresivo de 30 minutos o más que no cede con el reposo ni con la nitroglicerina, con sudor profuso, palidez y a veces náuseas o vómitos. Puede doler solo en la mandíbula, la parte alta del cuello, la espalda o el brazo, sin dolor en el pecho, y puede ser silente en fumadores y diabéticos. En las mujeres, el 71 % refería cansancio inusual el mes previo, y durante el infarto predominaban la falta de aire, la debilidad, el cansancio, el sudor frío y el mareo.\n\nCon qué se confunde: las náuseas pueden hacer pensar en una indigestión, y la angina se confunde con el ardor de estómago, la hernia de hiato o la enfermedad de la vesícula; la diferencia la establece el médico. Un sudor frío justo antes o durante el episodio de dolor de hombro es una de las pistas de Goodman para sospechar un origen vascular.\n\nQué hacer con un SÍ: si los síntomas están presentes, no seguir con la sesión: tomar constantes y activar la urgencia. Si fueron episodios pasados, preguntar cuándo y con qué aparecen, y derivar al médico.',
            fisiologia: {
              pasos: [
                'Cuando una coronaria se obstruye, una zona del corazón se queda sin oxígeno.',
                'Los metabolitos de la isquemia estimulan las fibras nerviosas del corazón, que entran en la médula por los segmentos C3 a T4.',
                'La médula cervical conecta con el núcleo del trigémino y el plexo cardiaco con el braquial: el dolor se siente en la mandíbula, el pecho, el hombro o el brazo.',
                'A la vez, la isquemia se acompaña de sudor, náuseas, falta de aire o mareo, que no tienen nada que ver con el hombro.',
                'Por eso un dolor de hombro que llega con esos síntomas apunta al corazón.'
              ],
              nota: 'Las fuentes leídas describen el sudor y las náuseas como acompañantes del infarto, pero no explican su mecanismo.',
              metafora: 'Como una alarma que, además de sonar, enciende luces en otras habitaciones: el sudor y las náuseas son esas luces.'
            },
            fuentes: ['Goodman 2018'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226 y 233–236; cap. 18, pp. 692–693, 704 y 707–708.'
            ]
          } },
        { id: 'h_c3', text: '¿El dolor cambia o empeora al acostarse, o siente falta de aire en reposo?', alerta: true,
          razonamiento: {
            porque: 'Al tumbarse vuelve más sangre de las piernas al tórax y el contenido del abdomen empuja el diafragma hacia arriba. Un corazón o un pulmón que no dan abasto no toleran ese cambio: aparece falta de aire (ortopnea) y el dolor referido al hombro puede empeorar. La falta de aire en reposo indica lo mismo, sin necesidad de esfuerzo.',
            peso: 'Goodman lo considera una bandera amarilla de origen cardiopulmonar, siempre que el brazo esté bien colocado (boca arriba el hombro queda algo en extensión y puede doler por sí mismo). Quien se ahoga al tumbarse o se despierta por la noche sin aire debe verlo el médico, y también quien, con una enfermedad cardiaca conocida, nota que la falta de aire va a más.',
            detalle: 'Mecanismo cardiaco: si el ventrículo izquierdo no vacía bien, la sangre se estanca en los pulmones y el líquido pasa a sus tejidos. De pie, la gravedad deja parte del líquido en las piernas; tumbado, vuelve al tórax y aumenta la congestión. La ortopnea (falta de aire al tumbarse que mejora al incorporarse) y la disnea paroxística nocturna (despertarse ahogado) son típicas de la insuficiencia cardiaca; la gravedad de la ortopnea se mide por las almohadas que hacen falta para respirar.\n\nMecanismo pulmonar: tumbado, el contenido del abdomen empuja el diafragma hacia arriba y aumenta el trabajo de respirar. Goodman describe que el aumento del retorno venoso y la presión sobre el diafragma pueden bastar para reproducir el dolor referido al hombro en quien tiene el sistema cardiopulmonar comprometido. El dolor de hombro que empeora boca arriba puede indicar afectación del mediastino o de la pleura.\n\nCon qué se confunde: boca arriba el hombro queda en ligera extensión y un problema mecánico puede doler por eso; para valorar el efecto de tumbarse hay que dejar el brazo en posición neutra (una toalla bajo el codo, una almohada sobre el abdomen para apoyar los antebrazos). La pericarditis también cambia con la postura: mejora al inclinarse hacia delante o sentarse erguido.\n\nQué hacer con un SÍ: preguntar cuántas almohadas necesita y si se despierta sin aire, si se le hinchan los tobillos o ha ganado peso en pocos días, tomar constantes (frecuencia respiratoria y cardiaca, saturación) y derivar al médico.',
            fisiologia: {
              pasos: [
                'Si el ventrículo izquierdo no bombea bien, la sangre se acumula en los vasos del pulmón.',
                'De pie, la gravedad retiene parte del líquido en las piernas; al tumbarse, esa sangre vuelve al tórax.',
                'El líquido pasa a los tejidos del pulmón, que se vuelven rígidos y cuesta más hincharlos: aparece la falta de aire.',
                'Tumbado, además, el abdomen empuja el diafragma hacia arriba, presiona la base de los pulmones y aumenta el trabajo de respirar.',
                'Al incorporarse, la sangre vuelve a las piernas, el diafragma baja y se respira mejor: por eso estas personas duermen con varias almohadas.'
              ],
              metafora: 'Como un desagüe justo: de pie el agua se reparte, pero tumbado le llega toda de golpe y se encharca.'
            },
            fuentes: ['Goodman 2018'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226–227 y 239; cap. 7, pp. 272–273; cap. 18, pp. 693, 696 y 705–709.'
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'IAM / Angina', desc: 'Retroesternal → cuello, mandíbula, escápulas, hombro izquierdo (distribución n. cubital)' },
        { zona: 'Pericarditis', desc: 'Esternón → cuello, trapecio superior, área supraclavicular izquierda' }
      ],
      impactoDescanso: [
        'Angina nocturna (a menudo desencadenada por sueños) interrumpe el descanso',
        'Ortopnea: obliga a dormir sentado o con muchas almohadas'
      ],
      impactoEjercicio: [
        'Isquemia miocárdica limita el ejercicio; empeora en frío y con brazos sobre la cabeza',
        'Betabloqueantes impiden subida normal de FC: dosificar por esfuerzo percibido',
        'Hipotensión ortostática tras el ejercicio — monitorizar al incorporarse'
      ]
    },
    {
      id: 'h_pulmonar', icon: '🫁', nombre: 'Pulmonar',
      banderasRojas: [
        'Dolor de hombro que empeora al toser, reír o respirar profundamente',
        'Dolor que mejora al aguantar la respiración o acostarse sobre el lado afectado (autosplinting)',
        'Hemoptisis (esputo con sangre), tos persistente',
        'Disnea inexplicada en reposo o mínimo esfuerzo'
      ],
      banderasAmarillas: [
        'Historia de tabaquismo (paquetes-año)',
        'Exposición a factores ambientales/ocupacionales tóxicos',
        'Antecedentes de cáncer que puede metastatizar a pulmón'
      ],
      preguntas: [
        { id: 'h5', text: '¿El dolor de hombro o espalda empeora al toser, reír, estornudar o tomar una respiración profunda?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Si el dolor aumenta al toser, reír, estornudar o respirar hondo, algo que se mueve con la respiración está irritado. La pleura que cubre el diafragma está inervada por el nervio frénico (C3–C5), que comparte segmentos con el hombro: su irritación se nota en el trapecio superior y el hombro del mismo lado.',
            peso: 'Por sí solo es poco específico: un desgarro intercostal o una lesión costal también duelen al respirar. Pesa si se acompaña de tos persistente, falta de aire, fiebre o esputo con sangre, si se alivia tumbado sobre el lado que duele (autoferulización, lo contrario de un problema mecánico) o si hay antecedente de cáncer o una neumonía o gripe recientes. Goodman lo cuenta entre las pistas de origen visceral aunque el hombro duela al moverlo.',
            detalle: 'Mecanismo pleural: la pleura visceral, que cubre el pulmón, no tiene receptores de dolor; la parietal, sí. Una enfermedad del pulmón puede avanzar sin dolor hasta que llega a la pleura parietal; entonces da un dolor agudo y localizado que empeora con cualquier movimiento respiratorio. La parte central de la pleura diafragmática la inerva el frénico, y su irritación refiere dolor al trapecio superior y al hombro del mismo lado; la periférica, a los bordes costales y la zona lumbar. La irritación del diafragma no suele doler en la cara anterior del hombro, sino en la zona supraescapular, el trapecio superior y la parte posterior.\n\nCausas: pleuritis, neumonía (la pleuritis diafragmática secundaria a una neumonía es frecuente), infarto pulmonar, neumotórax y tumores que invaden la pleura. El tumor de Pancoast, en el vértice del pulmón, da en cambio dolor por invasión del plexo braquial (C8–T1).\n\nCon qué se confunde: una tos fuerte y repetida puede lesionar un intercostal; en la pleuritis, cambiar la postura del tronco (inclinación o rotación) no reproduce el dolor, al contrario que en una lesión intercostal. La pericarditis también empeora al respirar hondo, pero mejora al inclinarse hacia delante. El dolor del infarto, en cambio, no cambia con la respiración.\n\nQué hacer con un SÍ: pedir una respiración profunda y ver si reproduce el dolor, comprobar si se alivia tumbado sobre ese lado, tomar constantes (frecuencia respiratoria, temperatura) y preguntar por tos, esputo, falta de aire, fiebre e infecciones respiratorias recientes.',
            fisiologia: {
              pasos: [
                'Dos hojas de pleura recubren el pulmón y la pared del tórax y se deslizan entre sí al respirar.',
                'La pleura del pulmón no tiene receptores de dolor; la de la pared sí, y en la parte central del diafragma la inerva el nervio frénico.',
                'El frénico nace de las raíces C3 a C5, las mismas que dan la sensibilidad del cuello y el hombro.',
                'Cuando la pleura se inflama, cada inspiración, tos o carcajada la estira y la hace rozar: el dolor sigue el ritmo de la respiración.',
                'El cerebro no distingue si la señal que llega por C3–C5 viene del diafragma o del hombro, y la sitúa en el trapecio superior y el hombro del mismo lado.'
              ],
              metafora: 'Como un timbre que suena en la habitación equivocada porque comparte cable con otra: llama el diafragma y suena el hombro.'
            },
            fuentes: ['Goodman 2018', 'Oliver y Ashurst 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92–95; cap. 7, pp. 274–275; cap. 18, pp. 689, 692–693, 696, 704–705 y 707–709.',
              { texto: 'Oliver y Ashurst 2023 — Oliver y Ashurst, «Anatomy, Thorax, Phrenic Nerves», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513325/' }
            ]
          } },
        { id: 'h_p2', text: '¿Siente falta de aire en reposo, al acostarse, o con mínimo esfuerzo?', alerta: true,
          razonamiento: {
            porque: 'La falta de aire indica que el corazón o los pulmones no cubren las necesidades de oxígeno. Si aparece en reposo, al tumbarse o con un esfuerzo mínimo, la reserva es muy pequeña. Junto a un dolor de hombro apunta a un origen cardiopulmonar: un pulmón o una pleura que refieren dolor al hombro, o un corazón que falla.',
            peso: 'Siempre merece valoración médica: Goodman indica que quien no puede subir un piso sin quedarse muy fatigado, se despierta ahogado o se ahoga al tumbarse debe verlo un médico. Cuidado con el NO: muchas personas reducen su actividad para no ahogarse y niegan la falta de aire; hay que preguntar qué han dejado de hacer.',
            detalle: 'Por qué: la falta de aire suele indicar hipoxemia y aparece con más trabajo respiratorio, fatiga de los músculos respiratorios o menor reserva. En la insuficiencia cardiaca, el líquido estancado en el pulmón lo vuelve rígido y estimula los receptores de estiramiento: primero con el esfuerzo y después en reposo; la ortopnea es una fase más avanzada. En el enfisema, la falta de aire de esfuerzo progresa hasta el reposo.\n\nCuidado (Goodman): el paciente puede decir que no le falta el aire porque ha reducido la actividad para evitarlo; hay que preguntar por cambios funcionales. La falta de aire que mejora con la respiración con los labios fruncidos o apoyándose en los brazos es más probablemente pulmonar que cardiaca. Las mujeres pueden notar falta de aire hasta un mes antes de un infarto.\n\nEn el hombro: la neumonía, la pleuritis, el neumotórax y el tumor de Pancoast refieren dolor al hombro del mismo lado; un dolor de hombro con falta de aire, respiración rápida o pitos pide pensar en el pulmón. En las personas mayores, una neumonía puede presentarse solo con dolor de hombro y confusión.\n\nQué hacer con un SÍ: tomar la frecuencia respiratoria, la cardiaca y la saturación, preguntar por tos, fiebre, tobillos hinchados, tabaco y antecedentes cardiacos o pulmonares, y derivar al médico.',
            fisiologia: {
              pasos: [
                'Respirar es llevar aire a los alvéolos para que el oxígeno pase a la sangre y salga el dióxido de carbono.',
                'Si el corazón no bombea bien, el líquido se acumula en el pulmón; si el pulmón está enfermo, hay menos superficie útil o las vías se obstruyen.',
                'Los pulmones rígidos o con menos superficie obligan a respirar con más fuerza, y los músculos respiratorios se fatigan.',
                'Los receptores de estiramiento del pulmón y de la pared del tórax, y la falta de oxígeno, se perciben como falta de aire: primero con el esfuerzo y luego en reposo.'
              ],
              metafora: 'Como subir una cuesta en una bicicleta sin cambios: cuanto menos margen queda, antes se nota el esfuerzo, hasta que cuesta incluso en llano.'
            },
            fuentes: ['Goodman 2018'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226–227, 233 y 239; cap. 7, pp. 272–275 y 279; cap. 18, pp. 689, 693 y 704–705.'
            ]
          } },
        { id: 'h_p3', text: '¿Ha notado sangre o mucosidad de color inusual (verde/oxidado) al toser, o tiene tos persistente de reciente aparición?', alerta: true,
          razonamiento: {
            porque: 'La tos persistente, el esputo verde, amarillo u oxidado y la sangre al toser son signos del propio pulmón: infección, inflamación o tumor. Si coinciden con un dolor de hombro, el pulmón o la pleura pueden estar refiriendo el dolor por el nervio frénico o, desde el vértice, invadiendo el plexo braquial.',
            peso: 'La sangre al toser siempre indica una enfermedad (infección, inflamación, absceso, tumor o infarto pulmonar) y pide valoración médica. El esputo amarillo o verde orienta a infección, y el oxidado puede ser una neumonía. Pesa más con fiebre, falta de aire, tabaco, antecedente de cáncer o pérdida de peso. Una tos aislada sin esputo es poco específica.',
            detalle: 'Qué indica el esputo (Goodman): una tos productiva con esputo amarillo o verde (purulento) puede indicar infección; el esputo transparente o blanco es inespecífico e indica irritación de la vía aérea; el oxidado puede ser una neumonía. Una tos seca persistente puede deberse a un tumor, a congestión o a vías aéreas hiperreactivas. En la insuficiencia cardiaca la tos puede dar mucho esputo espumoso teñido de sangre.\n\nNeumonía: fiebre, escalofríos, tos con esputo purulento, falta de aire, dolor pleurítico y pérdida de peso; en personas con alcoholismo o inmunodeprimidas puede no haber fiebre y predominar la debilidad, el decaimiento o la confusión. A menudo sigue a una gripe. En las personas mayores puede aparecer como dolor de hombro con confusión, cuando el pulmón afectado presiona el diafragma.\n\nTumor de Pancoast: los tumores del vértice no dan síntomas mientras están dentro del pulmón; al extenderse invaden el plexo braquial (C8–T1), con dolor agudo en el hombro, la axila y la escápula y atrofia de la mano. La tos, la sangre al toser y la falta de aire son tardías; puede haber ronquera, fiebre, pérdida de peso y un síndrome de Horner.\n\nTuberculosis: tos, fiebre y sudores; es más probable en personas sin hogar, presos, sanitarios, inmunodeprimidos, mayores de 65 años, inmigrantes de zonas endémicas, usuarios de drogas por vía parenteral y personas malnutridas.\n\nQué hacer con un SÍ: preguntar desde cuándo tose, si es tos de fumador, el color del esputo, si hay sangre, fiebre o falta de aire, y si la tos provoca el dolor de hombro; tomar constantes y derivar al médico.',
            fisiologia: {
              pasos: [
                'Los gérmenes que viven en la garganta llegan al pulmón con pequeñas aspiraciones; si superan las defensas, inflaman el pulmón.',
                'La tos intenta expulsar lo que se acumula en las vías y los alvéolos: el esputo amarillo o verde sugiere infección.',
                'Si la inflamación llega a la pleura que cubre el diafragma, irrita las fibras del frénico (C3–C5).',
                'El dolor se refiere al hombro del mismo lado y empeora con la tos y la respiración profunda.',
                'Un tumor del vértice, en cambio, puede no doler en el pulmón y hacerlo al invadir el plexo braquial: en el hombro, la axila y el brazo.'
              ],
              metafora: 'La tos y el esputo son el pulmón hablando en voz alta; el dolor de hombro, el mismo problema hablando por el cable del frénico.'
            },
            fuentes: ['Goodman 2018', 'Regunath y Oba 2024', 'Oliver y Ashurst 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 227; cap. 7, pp. 272, 274–275, 282 y 285–286; cap. 18, pp. 685, 693, 703 y 707–709.',
              { texto: 'Regunath y Oba 2024 — Regunath y Oba, «Community-Acquired Pneumonia», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de enero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430749/' },
              { texto: 'Oliver y Ashurst 2023 — Oliver y Ashurst, «Anatomy, Thorax, Phrenic Nerves», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513325/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Hombro ipsilateral', desc: 'Irritación del nervio frénico — pleura parietal o diafragma' },
        { zona: 'Cara medial del brazo', desc: 'Tumor de Pancoast (C8, T1, T2) — simula compromiso neurológico' },
        { zona: 'Escápula / Trapecio', desc: 'Irradiación de patología pleural o pulmonar' }
      ],
      impactoDescanso: [
        'Ortopnea (incapacidad para respirar acostado) obliga a dormir sentado',
        'Autosplinting: paciente adopta decúbito sobre lado afectado para limitar expansión torácica',
        'Tos nocturna persistente y sudores (tuberculosis, cáncer) fragmentan el descanso'
      ],
      impactoEjercicio: [
        'Disnea de esfuerzo e hipoxia restringen drásticamente la tolerancia al ejercicio',
        'Ejercicio puede desencadenar broncoespasmo (asma), dolor pleural o hemoptisis',
        'En EPOC con retención de CO2: exceso de O2 suplementario puede deprimir el impulso respiratorio'
      ]
    },
    {
      id: 'h_renal', icon: '🫘', nombre: 'Renal / Urológico',
      banderasRojas: [
        'Prueba de percusión de Murphy positiva (ángulo costovertebral)',
        'Hematuria (sangre en orina)',
        'Fiebre y escalofríos acompañando el dolor (pielonefritis)'
      ],
      banderasAmarillas: [
        'Dolor de hombro que no cambia con ninguna postura ni movimiento del brazo',
        'Cambios en el color, olor o cantidad de orina',
        'Antecedentes de cálculos renales'
      ],
      preguntas: [
        { id: 'h_r1', text: '¿Ha notado cambios en la orina (color rojo, marrón, turbio, olor fuerte) o tiene fiebre/escalofríos junto con el dolor?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El riñón está detrás del abdomen y toca el diafragma: si se inflama (pielonefritis), se obstruye o sangra, su cápsula se distiende y puede referir dolor al hombro del mismo lado. Los cambios en la orina y la fiebre con escalofríos son las señales que delatan ese origen.',
            peso: 'Goodman indica comunicar al médico cualquier dolor de hombro con fiebre o con cambios de color, olor o cantidad de la orina. La sangre en la orina siempre requiere valoración médica: es el síntoma principal de los tumores de las vías urinarias. Cuando la sangre se ve a simple vista, se encuentra un cáncer urológico en el 10–20 % (cuando solo se ve al microscopio, en torno al 3 %). La pielonefritis da típicamente fiebre, dolor de flanco y náuseas o vómitos.',
            detalle: 'Mecanismo: los riñones están en el retroperitoneo, a la altura de T11–L3, y tocan el diafragma. La distensión de la cápsula, la pelvis renal o el sistema colector (por edema inflamatorio, un quiste o un tumor que sangra) da un dolor sordo y constante en el ángulo costovertebral y el flanco (T10–L1). Si la lesión presiona el diafragma, el dolor se refiere al hombro del mismo lado, y a veces es el único síntoma.\n\nPielonefritis: infección del riñón, casi siempre por ascenso desde la vejiga; Escherichia coli es la causa más frecuente. Da fiebre (a menudo alta), dolor de flanco y náuseas o vómitos, a veces con escozor al orinar, urgencia y sangre en la orina; en las personas mayores puede manifestarse solo con confusión. Goodman recoge la fiebre con escalofríos y el dolor del hombro del mismo lado entre los síntomas de la infección urinaria alta. La percusión del ángulo costovertebral (puñopercusión de Murphy) se usa mucho, pero su valor diagnóstico nunca se ha validado.\n\nColor de la orina: la sangre la vuelve roja o rosada, o marrón como el té cuando el hemo se oxida. También la tiñen algunos alimentos (remolacha, moras), fármacos y los pigmentos biliares; la orina oscura «como té o cola» con heces claras orienta al hígado (ver la pregunta del sistema digestivo).\n\nQuién: la infección urinaria es más frecuente en mujeres; los cálculos, la diabetes, las sondas y la inmunosupresión aumentan el riesgo. La sangre en la orina pesa más con la edad, el tabaco o la exposición a productos químicos.\n\nQué hacer con un SÍ: tomar la temperatura, preguntar por escozor, frecuencia, sangre, dolor de flanco o de ingle, cálculos e infecciones urinarias previas, y derivar al médico.',
            fisiologia: {
              pasos: [
                'Las bacterias del periné suben por la uretra hasta la vejiga y, si superan las defensas, por el uréter hasta el riñón.',
                'El riñón infectado se inflama: llegan neutrófilos y se liberan sustancias inflamatorias, y aparecen la fiebre y los escalofríos.',
                'El edema distiende la cápsula que envuelve el riñón, y esa distensión da un dolor sordo y constante en el flanco.',
                'El riñón toca el diafragma: si la inflamación lo presiona, la señal viaja por el frénico (C3–C5) y el dolor se nota en el hombro del mismo lado.',
                'La orina cambia: puede llevar sangre, pus o bacterias, y volverse turbia, rojiza o de olor fuerte.'
              ],
              metafora: 'Como un globo que se hincha dentro de una caja apoyada contra el techo: aprieta su envoltorio y empuja hacia arriba, hasta el hombro.'
            },
            fuentes: ['Goodman 2018', 'Belyayeva 2024', 'Leslie 2025', 'Oliver y Ashurst 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 361–364; cap. 18, pp. 689, 697–698 y 705.',
              { texto: 'Belyayeva 2024 — Belyayeva, Leslie, Rout y Jeong, «Acute Pyelonephritis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519537/' },
              { texto: 'Leslie 2025 — Leslie, Hamawy y Saleem, «Gross and Microscopic Hematuria», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534213/' },
              { texto: 'Oliver y Ashurst 2023 — Oliver y Ashurst, «Anatomy, Thorax, Phrenic Nerves», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513325/' }
            ]
          } },
        { id: 'h_r2', text: '¿El dolor de hombro es constante y no cambia al mover el brazo ni al cambiar de postura?', alerta: true,
          razonamiento: {
            porque: 'Un problema del hombro cambia con el movimiento y la postura. El dolor que llega de una víscera (riñón, vesícula, corazón) no depende de cómo se mueva el brazo: si el hombro duele igual haga lo que haga, el origen puede estar en otro sitio.',
            peso: 'Goodman pide mirar más de cerca un dolor de hombro que no se modifica con el movimiento ni con las pruebas de provocación, sobre todo si es constante (aunque sea sordo) y hay síntomas generales; Lluch incluye el dolor sin relación con el movimiento entre las banderas rojas de tumor. No hay cifras de precisión. Pesa más con fiebre, cambios en la orina, antecedente de cáncer o una exploración sin hallazgos.',
            detalle: 'Por qué no cambia: el dolor renal se debe a la distensión de la cápsula o del sistema colector, que no varía con la postura ni con los movimientos del hombro o la columna. Lo mismo ocurre con el dolor visceral en general: en la mayoría de los casos de dolor de hombro referido desde una víscera, la movilidad del hombro está conservada y no hay dolor local a la palpación. El dolor del infarto tampoco cambia con la postura, la respiración ni el movimiento.\n\nCuidado (Goodman): un dolor visceral prolongado puede acabar alterando la forma de mover el hombro y crear un dolor mecánico secundario, y una persona puede tener a la vez un problema mecánico y otro visceral; por eso, que el hombro duela al moverlo no basta para descartar un origen visceral.\n\nCuándo preocupa: dolor constante con fiebre, cambios en la orina, dolor de flanco, abdominal o pélvico, o antecedente de cáncer, aunque haya una causa traumática aparente.\n\nQué hacer con un SÍ: comprobar en la exploración si algún movimiento, posición o palpación lo modifica; si nada lo cambia, preguntar por síntomas de otros sistemas (orina, digestivos, cardiacos, respiratorios) y derivar al médico.',
            fisiologia: {
              pasos: [
                'Un problema del hombro duele cuando se carga o se estira el tejido lesionado, y por eso cambia con el movimiento y la postura.',
                'Una víscera duele por otras razones: la distensión de su cápsula, la inflamación o la isquemia.',
                'Esa señal entra en la médula por segmentos que comparte con el hombro, y el cerebro la sitúa en el hombro.',
                'Como el estímulo nace en la víscera, mover el brazo ni lo aumenta ni lo alivia: el dolor es constante.'
              ],
              metafora: 'Como una radio que suena en una habitación aunque nadie toque los botones de esa habitación: la música viene de otro sitio.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92–93; cap. 10, pp. 362–363; cap. 18, pp. 693, 697–699 y 705.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54.'
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Hombro ipsilateral', desc: 'Riñones: presión sobre diafragma irradia por nervio frénico' },
        { zona: 'Ángulo costovertebral', desc: 'Región posterior subcostal — dolor renal primario' },
        { zona: 'Flanco → ingle', desc: 'Cólico ureteral irradiado' }
      ],
      impactoDescanso: [
        'Dolor renal constante sin alivio postural — impide conciliar el sueño',
        'Nicturia fragmenta el ciclo de sueño'
      ],
      impactoEjercicio: [
        'Insuficiencia renal crónica: anemia con fatiga extrema y letargo',
        'Infecciones sistémicas: fiebre y malestar limitan la tolerancia a la carga'
      ]
    },
    {
      id: 'h_gine', icon: '🌸', nombre: 'Ginecológico',
      banderasRojas: [
        'Embarazo ectópico: dolor pélvico unilateral severo con sangrado y hombro ipsilateral (signo de Kehr)',
        'Dolor de hombro izquierdo de aparición súbita con hipotensión (rotura de trompa)',
        'Sangrado vaginal inusual acompañando el dolor de hombro'
      ],
      banderasAmarillas: [
        'Dolor de hombro relacionado temporalmente con el ciclo menstrual',
        'Antecedentes de enfermedad inflamatoria pélvica (EPI)'
      ],
      preguntas: [
        { id: 'h_g1', text: '¿El dolor de hombro apareció de forma súbita y se acompaña de dolor pélvico, sangrado vaginal inusual o mareos intensos?', alerta: true, s1: true, urgencia: 'Sospecha de embarazo ectópico roto: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'En un embarazo ectópico roto, la sangre que se acumula en el abdomen irrita el diafragma y el dolor se refiere a la punta del hombro por el nervio frénico. Por eso un dolor de hombro de inicio súbito con dolor pélvico, sangrado vaginal o mareo, en una mujer en edad fértil, puede ser una hemorragia interna.',
            peso: 'Es una urgencia: el embarazo ectópico es potencialmente mortal y Goodman pide derivación médica inmediata. NICE recoge el dolor en la punta del hombro y el mareo o el desmayo entre los síntomas del ectópico, y advierte de que la presentación atípica es frecuente. El dolor de hombro puede ser el único síntoma. Pesa en una mujer sexualmente activa en edad fértil con un retraso de la regla o un sangrado inesperado, aunque use anticonceptivos.',
            detalle: 'Qué es: el embrión se implanta fuera de la cavidad del útero, casi siempre en la trompa (en torno al 97 %). Supone el 1–2 % de los embarazos y el 2,7 % de las muertes relacionadas con el embarazo. Al crecer en un espacio que no está preparado, la trompa se distiende y puede romperse.\n\nCómo se presenta: dolor abdominal o pélvico, a menudo de un lado y cólico al principio, con sangrado vaginal y retraso de la regla. Si se rompe, el dolor se generaliza y pueden aparecer mareo, desmayo, náuseas, dolor de hombro, síntomas urinarios o presión en el recto; con una hemorragia rápida, tensión baja y shock. La paciente puede no relacionar el dolor de hombro con el pélvico, o atribuir este a la regla o a gases.\n\nFactores de riesgo: ectópico previo (el riesgo es del 10 % tras uno y de más del 25 % tras dos), daño de las trompas por infecciones (gonorrea, clamidia) o por cirugía, enfermedad inflamatoria pélvica, endometriosis, reproducción asistida, tabaco, edad > 35 años y embarazo con un DIU (más de la mitad de los embarazos con DIU son ectópicos). Goodman insiste en no descartarlo porque use anticonceptivos.\n\nEl mismo mecanismo: cualquier sangre en el abdomen irrita el diafragma; la rotura del bazo da dolor en el hombro izquierdo (signo de Kehr) y, tras una laparoscopia, el gas que queda en el abdomen puede doler en el hombro.\n\nQué hacer con un SÍ: preguntar por la fecha de la última regla, los sangrados y la posibilidad de embarazo, y tomar tensión y pulso. Ante la sospecha, derivación médica inmediata; si hay mareo, desmayo, tensión baja o dolor intenso, a urgencias.',
            fisiologia: {
              pasos: [
                'El embrión se implanta en la trompa, que no puede crecer como el útero.',
                'Al aumentar de tamaño distiende la trompa, que acaba rompiéndose y sangra dentro del abdomen.',
                'La sangre libre se extiende por el peritoneo y llega a la cara inferior del diafragma, que irrita.',
                'El diafragma lo inerva el frénico, que nace de C3–C5, los mismos segmentos que el hombro.',
                'El dolor se siente en la punta del hombro; si la pérdida de sangre es rápida, aparecen mareo, desmayo y tensión baja.'
              ],
              metafora: 'Como una fuga en el sótano cuyo aviso suena en el ático: el sangrado está en la pelvis, pero el dolor llega al hombro.'
            },
            fuentes: ['Goodman 2018', 'Vadakekut y Gnugnoli 2025', 'NICE NG126', 'Oliver y Ashurst 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92–93; cap. 15, p. 591; cap. 18, pp. 689, 692, 703–705 y 708.',
              { texto: 'Vadakekut y Gnugnoli 2025 — Vadakekut y Gnugnoli, «Ectopic Pregnancy», StatPearls [Internet], NCBI Bookshelf, última actualización 27 de marzo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539860/' },
              { texto: 'NICE NG126 — NICE, «Ectopic pregnancy and miscarriage: diagnosis and initial management» (2019, actualizada el 17 de junio de 2026), recomendaciones 1.4.1–1.4.5.', url: 'https://www.nice.org.uk/guidance/ng126' },
              { texto: 'Oliver y Ashurst 2023 — Oliver y Ashurst, «Anatomy, Thorax, Phrenic Nerves», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513325/' }
            ]
          } },
        { id: 'h_g2', text: '¿El dolor de hombro tiene alguna relación con su ciclo menstrual o ha tenido alguna infección pélvica reciente?', alerta: true,
          razonamiento: {
            porque: 'La endometriosis puede implantar tejido parecido al del útero en el diafragma, y su dolor sigue el ciclo menstrual; al irritar el diafragma, se refiere al hombro. Una infección pélvica puede subir hasta la cápsula del hígado (síndrome de Fitz-Hugh-Curtis) y doler en el hipocondrio derecho y el hombro derecho.',
            peso: 'Es poco frecuente, pero un dolor de hombro que sigue el ciclo menstrual no tiene explicación mecánica y pide valoración médica. La endometriosis y la enfermedad inflamatoria pélvica, además, aumentan el riesgo de embarazo ectópico: si hay retraso de la regla o un sangrado inesperado, ver la pregunta anterior. No hay cifras de precisión.',
            detalle: 'Endometriosis: tejido parecido al endometrio fuera del útero, en la cavidad pélvica (ovarios, peritoneo, intestino) y también en el diafragma. Es propia de la edad reproductiva y aparece en hasta el 50 % de las mujeres con infertilidad. El dolor sigue el ciclo: empieza unos días antes de la regla y mejora al terminar; con el tiempo dura todo el ciclo. Goodman recoge que se ha descrito en el hombro derecho, y que podría darse en cualquiera de los dos según dónde estén los quistes, por quistes o cicatrices que irritan el diafragma, un plexo nervioso o el propio hombro.\n\nEnfermedad inflamatoria pélvica (EIP): infección que sube desde el cuello del útero, en la mayoría de los casos de transmisión sexual (gonococo, clamidia). Da dolor abdominal bajo o pélvico, a menudo de los dos lados, flujo, dolor en las relaciones y sangrado anormal, aunque puede pasar casi inadvertida. Si la inflamación llega a la cápsula del hígado (perihepatitis o síndrome de Fitz-Hugh-Curtis), aparece un dolor pleurítico en el hipocondrio derecho que se irradia al hombro derecho y empeora con el movimiento y la respiración, a veces con fiebre.\n\nQuién: mujeres en edad fértil; para la EIP, menores de 25 años, varias parejas sexuales, pareja con una infección de transmisión sexual, infecciones previas, uso irregular del preservativo y las 3 semanas siguientes a la colocación de un DIU.\n\nQué hacer con un SÍ: preguntar si el dolor de hombro aparece o empeora con la regla, por dolor pélvico, flujo, fiebre, escozor al orinar o dolor en las relaciones, y por la última regla; derivar al médico.',
            fisiologia: {
              pasos: [
                'En la endometriosis, tejido parecido al del útero crece fuera de él, en la pelvis y a veces en el diafragma.',
                'El dolor que produce sigue el ciclo: empieza unos días antes de la regla y mejora al terminar.',
                'Si el tejido está en el diafragma, o un quiste lo presiona, irrita las fibras del frénico (C3–C5) y el dolor se refiere al hombro.',
                'En la infección pélvica, los gérmenes pueden subir por las trompas hasta la cavidad abdominal e inflamar la cápsula del hígado y la superficie vecina del diafragma.',
                'Por eso el dolor de hombro aparece con la regla, o con dolor en el hipocondrio derecho que empeora al respirar, sin relación con el movimiento del brazo.'
              ],
              nota: 'Las fuentes leídas describen el patrón cíclico del dolor de la endometriosis, pero no explican su mecanismo.',
              metafora: 'Como una alarma programada con el calendario: suena cada mes cerca de la regla, aunque nadie toque el hombro.'
            },
            fuentes: ['Goodman 2018', 'Jenkins y Vadakekut 2025', 'Basit 2023', 'Oliver y Ashurst 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 15, pp. 587 y 592–595; cap. 18, pp. 689, 703–705 y 708.',
              { texto: 'Jenkins y Vadakekut 2025 — Jenkins y Vadakekut, «Pelvic Inflammatory Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de junio de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499959/' },
              { texto: 'Basit 2023 — Basit, Pop, Malik y Sharma, «Fitz-Hugh-Curtis Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499950/' },
              { texto: 'Oliver y Ashurst 2023 — Oliver y Ashurst, «Anatomy, Thorax, Phrenic Nerves», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513325/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Hombro izquierdo', desc: 'Embarazo ectópico roto — sangre intraabdominal irrita el diafragma (Signo de Kehr)' },
        { zona: 'Pelvis / Fosa ilíaca', desc: 'Dolor primario pélvico de origen ginecológico' }
      ],
      impactoDescanso: [
        'Dolor agudo pélvico e irradiado impide el descanso — cuadro de urgencia'
      ],
      impactoEjercicio: [
        'Embarazo ectópico: contraindicación absoluta de cualquier actividad — urgencia médica'
      ]
    },
    {
      id: 'h_gi', icon: '🫃', nombre: 'GI / Hepático',
      banderasRojas: [
        'Dolor de hombro derecho que no responde a terapia mecánica alguna',
        'Ictericia (piel/ojos amarillentos) u orina oscura con heces claras',
        'Rotura esplénica (signo de Kehr): dolor en hombro izquierdo por sangre intraabdominal'
      ],
      banderasAmarillas: [
        'Dolor relacionado con la ingesta de comidas grasas',
        'Saciedad precoz, distensión o sensación de hinchazón postprandial',
        'Uso de estatinas, AINEs crónicos o alcohol'
      ],
      preguntas: [
        { id: 'h_gi1', text: '¿El dolor de hombro aumenta o aparece 1-2 horas después de comer, especialmente comidas grasas?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Un dolor de hombro que cambia con las comidas no tiene explicación mecánica. Tras una comida grasa, la vesícula se contrae para soltar la bilis; si un cálculo obstruye su salida, se distiende y se inflama, y su dolor se refiere al hombro derecho y entre las escápulas. Las úlceras también duelen en relación con las comidas.',
            peso: 'Goodman indica que el dolor de hombro de origen mecánico no mejora ni empeora al comer: si lo hace, hay que buscar un problema digestivo, aunque el paciente no relacione ambas cosas. No hay cifras de precisión. Pesa más con náuseas, vómitos, saciedad precoz, intolerancia a las grasas, fiebre o ictericia, o con antecedente de cálculos o úlcera.',
            detalle: 'Vesícula: tras comer, sobre todo grasas, la colecistocinina contrae la vesícula para vaciar la bilis en el duodeno. Si un cálculo bloquea el conducto cístico aparece un cólico biliar; si la obstrucción persiste (más de 6 horas), la vesícula se distiende, se inflama y puede infectarse (colecistitis aguda). El dolor está en el hipocondrio derecho o el epigastrio y se irradia a la espalda (entre las escápulas, a la derecha de la línea media) y al hombro derecho, a menudo con náuseas, vómitos y fiebre. Aunque se describe como un cólico, con frecuencia es constante. Goodman distingue el dolor que empeora nada más comer (inflamación de la vesícula) del dolor con náuseas 1–3 horas después (cálculos).\n\nPor qué el hombro derecho: la mayoría de las fibras de la vía biliar llegan a la médula por los nervios esplácnicos derechos y conectan con fibras del frénico que inervan el diafragma; el frénico inerva además la cápsula del hígado y la vesícula.\n\nÚlcera: la gástrica suele doler a los 30–90 minutos de comer y la duodenal a las 2–4 horas (entre comidas); la duodenal mejora al comer o con antiácidos. Para el hombro, Goodman da tiempos algo distintos (empeora de 30 minutos a 2 horas después de comer, o de 1 a 3 horas): lo que cuenta es que el dolor cambie con la comida.\n\nQuién: mujeres, obesidad, embarazo, en torno a los 40 años, pérdidas de peso rápidas, diabetes, estatinas y antecedentes familiares de cálculos.\n\nQué hacer con un SÍ: preguntar por náuseas, vómitos, saciedad precoz, eructos, intolerancia a las grasas, el color de la orina y las heces, fiebre y antecedentes de cálculos o úlcera; derivar al médico.',
            fisiologia: {
              pasos: [
                'Cuando la grasa llega al duodeno, se libera colecistocinina, que hace contraerse a la vesícula para soltar la bilis.',
                'Si un cálculo tapa el conducto cístico, la vesícula se contrae contra un obstáculo: duele en oleadas (cólico biliar).',
                'Si la obstrucción persiste, la presión dentro de la vesícula sube, su pared se queda sin riego y se inflama (colecistitis).',
                'Las fibras del dolor de la vía biliar entran sobre todo por el lado derecho y conectan con las del frénico, que inerva el diafragma, la cápsula del hígado y la vesícula.',
                'El dolor se refiere al hombro derecho y entre las escápulas, y aparece después de comer, cuando la vesícula trabaja.'
              ],
              metafora: 'Como apretar un tubo de pasta con el tapón puesto: cada comida grasa es un apretón, y la queja llega hasta el hombro derecho.'
            },
            fuentes: ['Goodman 2018', 'Jones 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 92; cap. 8, p. 307; cap. 9, pp. 337, 339, 341 y 349–351; cap. 18, pp. 689, 698–699 y 705–709.',
              { texto: 'Jones 2025 — Jones, Santos y Patel, «Acute Cholecystitis», StatPearls [Internet], NCBI Bookshelf, última actualización 6 de julio de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459171/' }
            ]
          } },
        { id: 'h_gi2', text: '¿Ha notado cambios en el color de la orina (más oscura, como té o cola) o en las heces (muy claras, como arcilla)?', alerta: true,
          razonamiento: {
            porque: 'La bilirrubina es lo que da color a las heces. Si el hígado no la excreta o la bilis no llega al intestino (por una obstrucción de la vía biliar o una enfermedad hepática), las heces se aclaran como la arcilla, y la bilirrubina conjugada pasa a la orina, que se oscurece como el té o la cola. El hígado y la vía biliar refieren dolor al hombro derecho.',
            peso: 'Es una señal de enfermedad del hígado o de la vía biliar y siempre pide valoración médica, aunque no explique el dolor de hombro. Puede adelantarse a la ictericia: en la hepatitis, la orina se oscurece y las heces se aclaran de 1 a 14 días antes de que la piel se ponga amarilla. Pesa más con ictericia, picor, fiebre, dolor en el hipocondrio derecho o factores de riesgo (alcohol, fármacos tóxicos para el hígado, hepatitis).',
            detalle: 'Mecanismo: la bilirrubina sale de la degradación de la hemoglobina. En la sangre viaja unida a la albúmina y no se filtra por el riñón. El hígado la conjuga, la vuelve soluble en agua y la excreta con la bilis; en el colon, las bacterias la transforman en los pigmentos que dan a las heces su color. Si la bilis no llega al intestino, las heces se aclaran, y la bilirrubina conjugada acumulada pasa a la orina, que se oscurece. Una orina oscura indica enfermedad del hígado o de la vía biliar; la ictericia por bilirrubina no conjugada (por ejemplo, por destrucción de glóbulos rojos) no oscurece la orina.\n\nCausas: obstrucción de la vía biliar (cálculo en el colédoco, estrecheces, tumor de páncreas o de la vía biliar), hepatitis viral o alcohólica, fármacos (anticonceptivos, antibióticos y otros), embarazo, sepsis. La fiebre sugiere una colangitis; el dolor en el epigastrio o el hipocondrio derecho antes de la ictericia, un cálculo; un comienzo lento con adelgazamiento, un tumor.\n\nOtros signos (Goodman): color amarillo en el blanco de los ojos (con 2–3 mg/dL de bilirrubina) y después en la piel, picor (peor de noche), hematomas, arañas vasculares, palmas enrojecidas, uñas blancas de Terry y temblor aleteante de las manos (asterixis); un túnel carpiano bilateral puede deberse a la enfermedad del hígado.\n\nCon qué se confunde: la sangre en la orina también la oscurece (marrón) y algunos alimentos y fármacos la tiñen; el bismuto oscurece las heces.\n\nQué hacer con un SÍ: mirar el blanco de los ojos y la piel, preguntar por picor, fiebre, alcohol, medicación y hepatitis, y derivar al médico.',
            fisiologia: {
              pasos: [
                'Al romperse los glóbulos rojos viejos, la hemoglobina se transforma en bilirrubina, que viaja por la sangre unida a la albúmina.',
                'El hígado la capta, la conjuga para hacerla soluble en agua y la excreta en la bilis hacia el intestino.',
                'En el colon, las bacterias la convierten en los pigmentos que dan a las heces su color marrón.',
                'Si la bilis no sale (por un cálculo, una estrechez o un tumor) o el hígado no la excreta, las heces pierden ese color y se aclaran.',
                'La bilirrubina conjugada que se acumula en la sangre, como es soluble, se filtra por el riñón y oscurece la orina.'
              ],
              metafora: 'Como un tinte que debería ir por la tubería de la cocina y, si se atasca, sale por la del baño: las heces se quedan sin color y la orina se tiñe.'
            },
            fuentes: ['Goodman 2018', 'Kalakonda 2022', 'Grant y John 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, p. 306; cap. 9, pp. 337 y 339–343; cap. 18, pp. 699 y 704.',
              { texto: 'Kalakonda 2022 — Kalakonda, Jenkins y John, «Physiology, Bilirubin», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de septiembre de 2022.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470290/' },
              { texto: 'Grant y John 2025 — Grant y John, «Cholestatic Jaundice», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482279/' }
            ]
          } },
        { id: 'h_gi3', text: 'Si toma antiinflamatorios (AINEs), ¿el dolor de hombro aumenta en las horas siguientes en vez de mejorar?', alerta: true,
          razonamiento: {
            porque: 'Un AINE debería aliviar un dolor mecánico en su pico de efecto, a las 2–4 horas. Si el dolor de hombro aumenta en vez de bajar, puede ser una úlcera que sangra: los AINE dañan la mucosa del estómago, y el sangrado de las úlceras de su cara posterior se refiere a la espalda y al hombro derecho.',
            peso: 'Goodman lo considera una bandera amarilla de sangrado digestivo, y el uso crónico de AINE (más de 6 meses), la causa más frecuente de dolor de hombro provocado por un medicamento, sobre todo en mayores de 65 años. Quien toma AINE y tiene dolor de hombro o de espalda con síntomas de úlcera debe verlo el médico. Las heces negras y el vómito en posos de café siempre requieren valoración médica.',
            detalle: 'Mecanismo: los AINE clásicos bloquean las dos ciclooxigenasas: la COX-2, que media la inflamación, y la COX-1, que favorece el buen funcionamiento del tubo digestivo y la coagulación. Pueden dañar todo el tubo digestivo, sobre todo el estómago y el duodeno: erosiones, úlceras, sangrado y perforación. Un 25 % de quienes los toman de forma crónica desarrolla úlceras, y las causadas por AINE suelen estar en la cara posterior del estómago; el sangrado retroperitoneal puede referir dolor a la espalda (T6–T10) o al hombro derecho y el trapecio superior.\n\nEl dato que se pregunta: el pico de efecto de un AINE suele llegar a las 2–4 horas; en un problema musculoesquelético el dolor debería bajar entonces. Si sube, Goodman lo interpreta como un posible sangrado digestivo. Si el paciente no lo sabe, se le puede pedir que se fije en los próximos días.\n\nQuién (riesgo de lesión gástrica por AINE): mayores de 65 años, antecedente de úlcera o enfermedad digestiva, tabaco, alcohol, corticoides orales, anticoagulantes (también la aspirina a dosis bajas) y antiácidos que enmascaran los síntomas. Muchas personas no tienen síntomas hasta que el daño está avanzado.\n\nSignos de sangrado: heces negras, pegajosas y malolientes (melena), vómito en posos de café o sangre roja; también náuseas, falta de apetito o saciedad precoz.\n\nQué hacer con un SÍ: preguntar qué AINE toma, cuánto y desde cuándo, si combina varios o con aspirina, corticoides o anticoagulantes, si ha tenido úlcera y si ha notado heces negras; tomar constantes y derivar al médico.',
            fisiologia: {
              pasos: [
                'El estómago depende de la COX-1 para mantener su mucosa en buen estado.',
                'Los AINE clásicos bloquean la COX-2, lo que alivia la inflamación, pero también la COX-1: la mucosa pierde esa protección.',
                'La mucosa se erosiona y puede formarse una úlcera, a menudo en la cara posterior del estómago, que puede sangrar.',
                'La sangre que sale hacia atrás irrita los tejidos y el diafragma, y el dolor se refiere a la espalda o al hombro derecho.',
                'Por eso el dolor sube cuando el AINE está en su pico de efecto, justo cuando un dolor mecánico debería bajar.'
              ],
              nota: 'Goodman explica que la COX-1 favorece el buen funcionamiento del tubo digestivo, pero no detalla cómo protege la mucosa.',
              metafora: 'Como quitarse el paraguas para no mojarse de otra cosa: el AINE apaga la inflamación, pero deja la mucosa del estómago al descubierto.'
            },
            fuentes: ['Goodman 2018'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 95; cap. 8, pp. 306 y 315–317; cap. 18, pp. 698 y 705–709.'
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Hombro derecho', desc: 'Colecistitis, vesícula biliar, hígado (n. frénico → diafragma)' },
        { zona: 'Hombro izquierdo', desc: 'Rotura esplénica / bazo — Signo de Kehr' },
        { zona: 'Zona interescapular', desc: 'Columna T4-T8 o T7-T10, hacia derecha de la línea media (hepático/biliar)' }
      ],
      impactoDescanso: [
        'Dolor sordo y constante en reposo (tumores hepáticos/distensión de cápsula) interrumpe el sueño',
        'Prurito persistente por acumulación de toxinas o ictericia colestásica dificulta el descanso'
      ],
      impactoEjercicio: [
        'Ejercicio intenso contraindicado con ictericia o enfermedad hepática activa',
        'En casos severos (estatinas), esfuerzo puede desencadenar rabdomiólisis',
        'Flujo sanguíneo hepático disminuye con ejercicio moderado — ajustar cargas'
      ]
    },
    // Tarjeta hombro (guía de consulta), BANDERAS: las tres filas que no
    // cubría ningún sistema; las respalda el capítulo de Lluch 2020 (cap. 3.1,
    // p. 54, y 3.1.1, p. 76). Sin `urgencia`: la tarjeta no tiene URGENCIA. Lluch
    // pide «derivación inmediata» ante cualquiera de ellas, que el razonamiento
    // de cada pregunta ya dice; no es la alerta roja de urgencias hoy. La única
    // pregunta de hombro con `urgencia` es h_g1 (ectópico; decisión del usuario,
    // 2026-10: Goodman pide derivación inmediata y NICE NG126, urgencias si hay
    // inestabilidad).
    {
      id: 'h_trauma', icon: '🦴', nombre: 'Traumático (Fractura o Luxación)',
      banderasRojas: [
        'Fractura o luxación no reducida (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75): traumatismo previo (caída sobre el hombro o el codo), pérdida aguda de movilidad, deformidad, osteoporosis. Ayuda en consulta: test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'h_t1', notaPosquirurgica: true, urgencia: 'Sospecha de fractura o luxación sin reducir tras una caída: no forzar la movilidad, explorar el nervio axilar (sensibilidad de la cara externa del brazo y contracción del deltoides) y derivar hoy para radiografía.', text: '¿Tras una caída sobre el hombro o el codo, perdió de golpe movilidad del brazo o nota el hombro deformado? (Tener en cuenta la osteoporosis.)', alerta: true, s1: true,
          razonamiento: {
            porque: 'Una caída sobre el hombro, el codo o el brazo extendido puede luxar la articulación o fracturar el húmero o la clavícula. La pérdida brusca de movilidad y la deformidad son sus señales, y con osteoporosis basta una caída de poca energía para romper el húmero.',
            peso: 'Es una bandera roja: ante la sospecha de una fractura o una luxación sin reducir, Lluch indica derivación inmediata y radiografía. En consulta ayudan el test de aprensión ósea y la percusión olécranon-manubrio, con buen valor para la luxación anterior y las fracturas de clavícula y húmero. Un dolor desproporcionado a la lesión, o que no se resuelve con el tratamiento tras un traumatismo, también pide atención médica inmediata (Goodman).',
            detalle: 'Luxación anterior: la mitad de las luxaciones de las articulaciones son del hombro, y el 95–97 % de ellas, anteriores. El mecanismo típico es una caída sobre el brazo extendido o con el brazo en elevación y rotación externa. Es más frecuente entre los 15 y los 30 años y en hombres. La cabeza del húmero se palpa adelantada. El nervio axilar se lesiona en torno al 42 % de las luxaciones agudas (se comprueba con la sensibilidad de la cara externa del brazo y la contracción del deltoides), y la arteria axilar también puede dañarse. Una luxación bloqueada, a cualquier edad, se presenta como un hombro congelado, con rigidez activa y pasiva; la radiografía simple la detecta.\n\nFractura del húmero proximal: un 5–6 % de las fracturas del adulto, sobre todo en mayores de 65 años tras una caída desde su propia altura sobre el brazo extendido, y el doble en mujeres. En una persona con osteoporosis es una fractura por fragilidad. Da dolor y crepitación en el foco, y un hematoma que puede extenderse por el tórax, el brazo y el antebrazo; si se pierde el contorno del deltoides, puede haber además una luxación. En los jóvenes suele deberse a traumatismos de alta energía, como los de tráfico. Una fractura no desplazada del troquíter puede necesitar resonancia.\n\nCuidado (Goodman): las personas mayores tienden a atribuir el dolor a «haberse pasado»; en los mayores de 65 años con dolor de hombro hay que hacer el cribado aunque haya una causa aparente. Considerar también un traumatismo que no se cuenta o una agresión.\n\nQué hacer con un SÍ: inspeccionar la deformidad y el hematoma, palpar la clavícula y las articulaciones acromioclavicular y esternoclavicular, comprobar el nervio axilar, el pulso y la sensibilidad de la mano, y derivar para radiografía.',
            fisiologia: {
              pasos: [
                'El hombro es muy móvil a costa de su estabilidad: la cabeza del húmero se apoya en una glenoides poco profunda, sujeta por el rodete, los ligamentos y el manguito.',
                'En una caída con el brazo en elevación y rotación externa, la cabeza del húmero empuja contra la parte anteroinferior de la glenoides.',
                'Puede salirse hacia delante (luxación), arrancando el rodete (lesión de Bankart) o hundiendo la parte posterior de la cabeza (lesión de Hill-Sachs).',
                'Con osteoporosis, una caída de poca energía sobre el brazo extendido basta para romper el húmero proximal, sobre todo por el cuello quirúrgico, su zona más débil.',
                'En los dos casos la articulación pierde de golpe su movimiento y el hombro puede verse deformado.'
              ],
              metafora: 'Como una pelota sobre un platillo poco hondo: el platillo da libertad, pero un empujón en la dirección justa la hace caer.'
            },
            fuentes: ['Lluch 2020', 'Pak y Kim 2023', 'Pencle y Varacallo 2023', 'Goodman 2018'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), pp. 75–76.',
              { texto: 'Pak y Kim 2023 — Pak y Kim, «Anterior Glenohumeral Joint Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557862/' },
              { texto: 'Pencle y Varacallo 2023 — Pencle y Varacallo, «Proximal Humerus Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470346/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 688, 704 y 707.'
            ]
          } }
      ]
    },
    {
      id: 'h_infeccion', icon: '🌡️', nombre: 'Infección / Sistémico',
      banderasRojas: [
        'Infección o sistémico (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 76): fiebre, sensación de estar enfermo, cambios en la piel (aspecto, erupciones, sudoración), hematomas inexplicados, dolor en otras partes del cuerpo. Preguntar siempre por el estado general reciente.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'h_i1', text: '¿Ha tenido fiebre o se ha sentido enfermo últimamente, o ha notado cambios en la piel (aspecto, erupciones, sudoración), hematomas sin motivo o dolor en otras partes del cuerpo?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Son las preguntas de Lluch para descubrir un proceso sistémico que se presenta como dolor de hombro: una infección (artritis séptica, osteomielitis), una enfermedad reumática o una enfermedad general. Un hombro mecánico no da fiebre, malestar general, cambios en la piel ni dolor en otras partes del cuerpo.',
            peso: 'Lluch indica derivar de inmediato si se sospecha cualquiera de estas banderas. Que no haya fiebre no descarta una infección: en la artritis séptica solo la tiene el 40–60 %, y en mayores o inmunodeprimidos suele ser febrícula. Pesa más con diabetes, inmunosupresión o corticoides, drogas por vía parenteral, una cirugía o infiltración reciente, una prótesis o una infección reciente en otra parte del cuerpo.',
            detalle: 'Infección (artritis séptica y osteomielitis): la sinovial, muy vascularizada y sin una membrana basal que la limite, se infecta sobre todo por la sangre desde otra infección; también por una herida, una infiltración o una cirugía, o por contigüidad desde una osteomielitis (el hombro y la cadera son vulnerables a esa vía). Staphylococcus aureus es la causa más frecuente en el adulto. Da dolor agudo, hinchazón, calor y rechazo a mover la articulación; la más afectada es la rodilla, seguida de la cadera, el hombro y el tobillo. Es una urgencia ortopédica porque destruye el cartílago. La artritis séptica acromioclavicular puede empezar de forma insidiosa; suele haber dolor local a la palpación y puede no haber síntomas generales. Según Goodman, la forma más fiable de reconocer una infección es que haya a la vez síntomas locales y generales, y una infección tras una cirugía puede tardar semanas o meses en dar la cara, sobre todo con corticoides o inmunosupresión.\n\nFactores de riesgo: edad > 80 años, diabetes, artritis reumatoide o daño previo de la articulación, cirugía o infiltración reciente, prótesis, infecciones o úlceras de la piel, VIH, drogas por vía parenteral e inmunosupresión.\n\nPiel, hematomas y dolor en otras partes: una erupción, febrícula y ganglios con dolor articular pueden indicar una artritis infecciosa; en un adulto joven sexualmente activo, lesiones en la piel con fiebre y artritis hacen pensar en el gonococo. El dolor en otras articulaciones con cansancio, malestar o fiebre orienta a una enfermedad reumática (artritis reumatoide, polimialgia reumática). Los hematomas sin causa aparecen, por ejemplo, en la enfermedad del hígado; el sistema hematológico tiene sus propias preguntas.\n\nQué hacer con un SÍ: tomar la temperatura, explorar calor, hinchazón y dolor local, preguntar por infecciones recientes, cirugías, infiltraciones y factores de riesgo, y derivar.',
            fisiologia: {
              pasos: [
                'La sinovial, la membrana que tapiza la articulación, está muy vascularizada y no tiene una membrana basal que la aísle de la sangre.',
                'Las bacterias de una infección en otra parte del cuerpo, o las que entran por una herida, una infiltración o una cirugía, llegan a ella y se adhieren a sus proteínas.',
                'El sistema inmunitario responde con citocinas y enzimas que, además de combatir la infección, destruyen el cartílago.',
                'La articulación se hincha, se calienta y duele, y el paciente se niega a moverla; la inflamación general puede dar fiebre y malestar, aunque no siempre.'
              ],
              metafora: 'Como una casa con muchas ventanas abiertas a la calle: si hay ladrones en el barrio es de las primeras en ser asaltada, y la pelea rompe los muebles.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Momodu y Savaliya 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), p. 76.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 9, p. 341; cap. 18, pp. 699–700, 704 y 707.',
              { texto: 'Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538176/' }
            ]
          } }
      ]
    },
    {
      id: 'h_neuro', icon: '🧠', nombre: 'Neurológico',
      banderasRojas: [
        'Lesión neurológica (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 76): déficit motor o sensitivo significativo, atrofia. Exploración neurológica breve: sensibilidad, fuerza y reflejos.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'h_n1', text: '¿Ha perdido fuerza o sensibilidad de forma importante en el brazo o la mano, o nota algún músculo del hombro o del brazo más delgado que el del otro lado?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Una pérdida importante de fuerza o de sensibilidad, o un músculo más delgado que el del otro lado, indica que un nervio o una raíz no funcionan: no es un problema del tendón ni de la articulación. Puede deberse a la columna cervical, a una inflamación del plexo braquial (amiotrofia neurálgica), a un tumor que lo invade o a una lesión traumática.',
            peso: 'Lluch indica derivar de inmediato si hay una lesión neurológica con déficit motor o sensitivo importante. Según Goodman, la debilidad indolora de comienzo insidioso es probablemente neurológica, y la dolorosa puede deberse a una radiculopatía cervical, un problema crónico del manguito, un tumor o una artrosis, y requiere un diagnóstico médico. En el hombro congelado la exploración neurológica es normal.',
            detalle: 'Amiotrofia neurálgica (Parsonage-Turner): inflamación aguda, sobre todo del tronco superior del plexo braquial, más frecuente entre los 20 y los 60 años y probablemente infradiagnosticada (en torno a 1 caso por 1000 personas al año). Empieza con un dolor brusco e intenso en la cintura escapular (7 o más sobre 10), a menudo de noche, que dura unas 4 semanas; días o semanas después aparece la debilidad con atrofia en parches, que aumenta cuando el dolor cede. Más de la mitad ha tenido antes una infección, una vacuna, una cirugía, un embarazo o un esfuerzo intenso. Se confunde con la tendinopatía del manguito y con la radiculopatía cervical.\n\nTumor: el de Pancoast invade el plexo braquial (C8–T1), con dolor neurítico en la axila, el hombro y la escápula y atrofia de los músculos del brazo. En el cáncer, la atrofia puede seguir un patrón extraño que no corresponde a un nervio ni a un músculo, y las metástasis en los ganglios pueden afectar al plexo braquial.\n\nNervio supraescapular: si está paralizado, los test del supraespinoso y el infraespinoso salen positivos con el manguito intacto; distinguirlo exige más que los signos clínicos y la atrofia (Lluch 2020).\n\nTraumatismo: el nervio axilar se lesiona en el 42 % de las luxaciones anteriores agudas y es el nervio más afectado en las fracturas del húmero proximal.\n\nQué hacer con un SÍ: exploración neurológica breve (sensibilidad, fuerza por miotomas, reflejos), comparar el volumen muscular de los dos lados, explorar el cuello (Spurling) y derivar.',
            fisiologia: {
              pasos: [
                'Una infección, una vacuna, una cirugía o un esfuerzo intenso activan el sistema inmunitario.',
                'En personas predispuestas, esa respuesta inflama los nervios del plexo braquial, sobre todo su tronco superior; la gran movilidad del hombro podría desgastar la barrera que separa los nervios de la sangre.',
                'El nervio inflamado da un dolor brusco e intenso en el hombro.',
                'Las fibras motoras dañadas dejan de llegar a sus músculos, que se debilitan y se atrofian en días o semanas.',
                'Por eso aparecen debilidad y atrofia con un patrón que no es el de una lesión del tendón.'
              ],
              nota: 'El mecanismo exacto de la amiotrofia neurálgica no está establecido; Kim y Chang lo atribuyen a una combinación de factores inmunológicos, mecánicos y genéticos.',
              metafora: 'Como un cable cuyo aislante se inflama: primero chispea (el dolor) y después deja de llevar la corriente (la debilidad).'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Kim y Chang 2021', 'Pak y Kim 2023', 'Pencle y Varacallo 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), pp. 54 y 66–67; cap. 3.1.1 (Powell y Lewis), pp. 73 y 76.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 700–703 y 706.',
              { texto: 'Kim y Chang 2021 — Kim y Chang, «Neuralgic amyotrophy: an underrecognized entity», J Int Med Res 49(4):3000605211006542 (revisión narrativa).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8033465/' },
              { texto: 'Pak y Kim 2023 — Pak y Kim, «Anterior Glenohumeral Joint Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557862/' },
              { texto: 'Pencle y Varacallo 2023 — Pencle y Varacallo, «Proximal Humerus Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470346/' }
            ]
          } }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.hombro
export const tree = {
  title: 'Algoritmo CIF — Hombro',
  steps: [
    {
      id: 'h_step1',
      tag: 'Paso 1 — Cribado Proximal (Clearing)',
      question: '¿El dolor se reproduce con movimientos cervicales, compresión axial o palpación de la primera costilla?',
      options: [
        { label: 'SÍ — Reproducción con movimientos cervicales (test de Spurling o similar)', value: 'cervical', next: null, hypothesis: ['h6'] },
        { label: 'SÍ — Restricción de movilidad en 1ª costilla y dolor en zona de transición', value: '1costilla', next: null, hypothesis: ['h9'] },
        { label: 'NO — No se reproduce con cervical ni 1ª costilla', value: 'no', next: 'h_step2', hypothesis: [] }
      ]
    },
    {
      id: 'h_step2',
      tag: 'Paso 2 — Movilidad Global (PROM)',
      question: '¿Existe una restricción GLOBAL de la movilidad pasiva, especialmente en rotación externa?',
      options: [
        // Bisagra de la tarjeta (nodo 2): el SÍ ya no activa h1 por sí solo,
        // lo reparte h_step2b entre congelado, artrosis GH y luxación/fractura.
        { label: 'SÍ — Restricción global de la movilidad pasiva, con pérdida marcada de rotación externa', value: 'si', next: null, hypothesis: [] },
        { label: 'NO — Movilidad pasiva mayormente preservada', value: 'no', next: 'h_step3', hypothesis: [] }
      ]
    },
    {
      // Tarjeta hombro, nodo 2b. Solo se llega por el SÍ de h_step2 (el NO
      // salta a h_step3); de aquí se sigue a h_step3 como antes.
      id: 'h_step2b',
      tag: 'Paso 2b — Rigidez activa = pasiva',
      question: 'La movilidad pasiva GH (sobre todo la RE) está limitada igual que la activa. ¿Hubo traumatismo previo?',
      options: [
        { label: 'SÍ — Traumatismo previo → luxación bloqueada o fractura → Rx', value: 'trauma', next: null, hypothesis: ['h11'] },
        { label: 'NO — Mayor edad + crepitación → artrosis GH (Rx)', value: 'artrosis', next: null, hypothesis: ['h10'] },
        { label: 'NO — Resto → hombro congelado', value: 'congelado', next: null, hypothesis: ['h1'] }
      ]
    },
    {
      id: 'h_step3',
      tag: 'Paso 3 — Localización y Mecanismo',
      question: '¿El dolor está localizado en la parte superior (AC) o hubo un evento traumático con sensación de inestabilidad?',
      options: [
        { label: 'Dolor en articulación acromioclavicular (parte superior)', value: 'ac', next: null, hypothesis: ['h7'] },
        { label: 'Evento traumático / "Pop" con sensación de inestabilidad anterior', value: 'trauma_ant', next: null, hypothesis: ['h4'] },
        { label: 'Evento traumático / dolor profundo, síntomas de labrum (chasquidos)', value: 'trauma_lab', next: null, hypothesis: ['h5'] },
        { label: 'Episodio concreto o aprensión (inestabilidad anterior o posterior, también sin «pop» traumático)', value: 'inestab', next: null, hypothesis: ['h4'] },
        { label: 'Ninguno de los anteriores', value: 'no', next: 'h_step4', hypothesis: [] }
      ]
    },
    {
      id: 'h_step4',
      tag: 'Paso 4 — Integridad del Manguito Rotador',
      question: '¿Hay dolor durante la elevación y/o déficits de fuerza?',
      options: [
        { label: 'Dolor al elevar el brazo o con los test resistidos, sin debilidad marcada ni signos de retraso', value: 'dolor_fuerza', next: null, hypothesis: ['h2'] },
        { label: 'Debilidad evidente — caída del brazo (drop arm) o signos de retraso (lag signs)', value: 'debilidad', next: null, hypothesis: ['h3'] },
        { label: 'Sin dolor claro ni debilidad en elevación', value: 'no', next: 'h_step5', hypothesis: [] }
      ]
    },
    {
      id: 'h_step5',
      tag: 'Paso 5 — Control Motor Escapular',
      question: '¿Se observa asimetría o "winging" escapular durante el movimiento activo?',
      options: [
        { label: 'SÍ — Asimetría visual en la elevación o test de asistencia escapular positivo', value: 'si', next: null, hypothesis: ['h8'] },
        { label: 'NO — Sin alteración escapular evidente', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── HOMBRO ─────────────────────────────────────────────
  h1: {
    id: 'h1', region: 'hombro', num: '①',
    name: 'Capsulitis Adhesiva',
    prom: 'SPADI (MCID: 14.9–25.4 puntos)',
    dosis: 'Por fases, ajustando la intensidad a la irritabilidad del tejido. Siempre: educar sobre la evolución natural, adaptar la actividad para mover sin dolor y ajustar la intensidad del estiramiento a la irritabilidad (B); estiramientos (B). Irritabilidad alta (dolor ≥7/10, dolor nocturno o en reposo constante, dolor antes del final del rango, activa claramente menor que pasiva): ejercicios de movilidad pasiva y activo-asistida sin dolor. La guía añade movilización glenohumeral de baja intensidad en rangos sin dolor (C); un consenso de expertos posterior (2025) no considera eficaz la terapia manual en la fase precoz dolorosa (93 %) y sí la información y tranquilizar (100 %) y la infiltración de corticoide (79 %). Irritabilidad moderada: movilización de intensidad moderada y estiramientos suaves a moderados hacia la resistencia del tejido, sin dolor ni inflamación después, e integrar la movilidad ganada en gestos de alcance. Irritabilidad baja (fase rígida): movilización al final del rango, de amplitud y duración altas, y estiramientos de duración progresiva; aquí el consenso sí considera eficaz la terapia manual (85 %). La infiltración intraarticular de corticoide junto con ejercicios de movilidad y estiramiento alivia más a corto plazo (4–6 semanas) que el ejercicio solo (A; la indica el médico). La guía admite añadir al ejercicio onda corta, ultrasonido o electroestimulación (C); el consenso no considera eficaces el masaje, la inmovilización, el frío, la electroestimulación ni el ultrasonido (tampoco el calor en la fase precoz). Ninguna fuente fija series, repeticiones ni frecuencia, y estirar más allá del dolor puede empeorar el resultado.',
    dosisFuente: 'Kelley 2013, J Orthop Sports Phys Ther 43(5):A1–A31 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Salamh 2025, J Man Manip Ther 33(4):309–320 (consenso Delphi de 14 expertos; % = acuerdo del panel; es opinión de expertos, no evidencia de eficacia)',
    pronostico: {
      horizonte: 'Se suele decir que se resuelve en 2–3 años, pero un 41 % sigue con síntomas a los 4 años y la mitad a los 7. No hay evidencia de que avance por estadios hasta curarse sin tratamiento. Rx normal salvo osteopenia o calcificación; RM no necesaria.',
      derivacion: 'Ejercicio en grupo supervisado: mejores resultados que el individual y que el ejercicio en casa. Derivar a psicología si los factores psicosociales superan tu competencia. Baja autoeficacia predice peor evolución. Contralateral en el 6–34 %. Más frecuente con diabetes (hasta un 30 %) y quizá con hipotiroidismo y Dupuytren.',
      fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 69–73'
    },
    tests: [
      { name: 'Abducción pasiva glenohumeral <80°', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Abducción pasiva glenohumeral limitada, junto a una rotación externa limitada igual en activo que en pasivo. Hallazgo: el «VPP 83–100 %» que figuraba aquí no tenía fuente y se ha quitado; lo que más discrimina es la restricción igual activa y pasiva con radiografía normal (criterio de Bunker).', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 73' },
      { name: 'Test de Rotación Externa (brazo neutro al lado, codo 90°)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Positivo si la RE pasiva con el brazo al lado pierde más del 50 % respecto al lado sano o queda por debajo de 30°: es el criterio que se ha usado en los estudios para definir la capsulitis, junto a una pérdida de movilidad mayor del 25 % en al menos 2 planos (Kelley 2013, p. A9). La pérdida de movilidad pasiva en varios planos, sobre todo de RE con el brazo al lado y en distintos grados de abducción, es un hallazgo significativo para orientar el tratamiento (Kelley 2013, E). El consenso de 2025 asocia al hombro congelado una RE pasiva más limitada que las demás direcciones (100 %) y cada vez más limitada al aumentar la abducción (100 %). Lluch 2020: la RE está reducida de forma constante en neutro y a 90° de abducción, aunque la RI suele ser la más afectada cerca de 90°. Sin S ni E; no puntúa.', fuente: 'Kelley 2013 (J Orthop Sports Phys Ther 43(5):A1–A31, pp. A9 y A26) · Salamh 2025 (J Man Manip Ther 33(4):309–320, tabla 2) · Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 72', noData: true },
      { name: 'Restricción equivalente activa y pasiva (criterio de Bunker)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Restricción equivalente de movilidad activa y pasiva: es el dato que más discrimina. La RE se considera la más afectada, pero la RI suele estar muy limitada con el brazo cerca de 90° de abducción. Criterio de Bunker: restricción igual de RE activa y pasiva + Rx esencialmente normal. No usar en hombro congelado: test específicos de MR, labrum o AC — casi siempre salen positivos al tensar una cápsula sensibilizada.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 72–73' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Final del rango de RE pasiva → EVA (más útil cuando dolor > rigidez). ② RE pasiva en grados a 0° de abducción y RI a 90° de abducción (más útil cuando rigidez > dolor).', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Test del dolor en la coracoides', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la apófisis coracoides: se ha descrito como un hallazgo muy presente en el hombro congelado, pero hace falta más investigación sobre su valor. Sin S ni E en el capítulo; no puntúa.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 73' },
      { name: 'Identificadores clínicos de fase precoz (Walmsley)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ocho identificadores de consenso para el congelado precoz (dolor nocturno marcado, dolor con movimientos rápidos, no poder tumbarse sobre ese hombro, dolor fácil con el movimiento, inicio después de los 35 años, pérdida global de movilidad activa y pasiva, dolor al final del rango en todas las direcciones, pérdida global de movilidad pasiva glenohumeral). En el estudio de seguimiento ninguno resultó válido para detectarlo: no usar para confirmar.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 71' }
    ]
  },
  h2: {
    id: 'h2', region: 'hombro', num: '②',
    name: 'Síndrome de Pinzamiento Subacromial (Impingement)',
    prom: 'QuickDASH (MCID: 8.0–15.9 puntos)',
    dosis: 'Educación individualizada y centrada en el paciente sobre su problema, las opciones para manejar el dolor, la modificación de la actividad y el automanejo (C). Tratamiento inicial: programa de ejercicio activo, de control motor o de fuerza con cargas variadas (A); la carga alta no ha demostrado ser mejor que la baja, y el ejercicio supervisado no supera al de casa. Puede añadirse terapia manual vertebral o del miembro superior (partes blandas, movilización o manipulación) para aliviar el dolor a corto plazo (B) y vendaje como complemento del ejercicio (D). No usar ultrasonido terapéutico (B; C en la tendinopatía calcificada, donde pueden usarse ondas de choque o láser, C). Adaptaciones ergonómicas si el dolor es laboral (C). La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico.',
    dosisFuente: 'Desmeules 2025, J Orthop Sports Phys Ther 55(4):235–274 (guía de práctica clínica; incluye el síndrome de dolor subacromial dentro de la tendinopatía del manguito; letra = grado de la recomendación, tal como la da la guía)',
    pronostico: {
      horizonte: 'Una rotura completa del supraespinoso en ecografía aumenta la probabilidad, pero la imagen no mejora la capacidad de descartarlo.',
      derivacion: 'Dolor en reposo: puede indicar bursitis o proceso inflamatorio que tolere mal el movimiento vigoroso → dosificar. La idea de «espacio subacromial estrecho» es controvertida. Si no mejora en un máximo de 12 semanas de tratamiento conservador adecuado, puede pedirse imagen y derivar al médico especialista si el dolor o la discapacidad siguen siendo intensos (Desmeules 2025, grado F).',
      fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 53–54'
    },
    tests: [
      { name: 'Arco doloroso', sn: '53%', sp: '76%', lr_pos: '2.25', lr_neg: '0.62', criterio: 'Dolor durante la elevación activa entre 60° y 120°. Metaanálisis de 4 estudios (n = 756): LR+ 2,25 (IC 1,24–4,08), LR− 0,62 (IC 0,37–1,03), modelo bivariante. Sirve algo para confirmar; un negativo es solo un hallazgo. Un metaanálisis posterior (Zhao 2024, 6 estudios, bivariante) da LR+ 1,57 (1,07–2,31), LR− 0,63, pero su tabla 2×2 de Park 2005 suma 718 pacientes de un estudio de 552: se mantiene la cifra de Hegedus.', fuente: 'Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3 y fig. 3)' },
      { name: 'Test de Hawkins-Kennedy', sn: '80%', sp: '56%', lr_pos: '1.84', lr_neg: '0.35', criterio: 'Flexión de hombro a 90°, rotación interna forzada. Positivo si reproduce dolor subacromial. Metaanálisis de 7 estudios (n = 944): LR+ 1,84 (IC 1,49–2,26), LR− 0,35 (IC 0,27–0,46), modelo bivariante. Sirve para descartar; un positivo es solo un hallazgo. Zhao 2024 (8 estudios, bivariante, con los errores de extracción del arco doloroso) da LR+ 1,64 (1,22–2,19), LR− 0,53 (0,39–0,71).', fuente: 'Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3)' },
      { name: 'Test de Neer', sn: '72%', sp: '60%', lr_pos: '1.79', lr_neg: '0.47', criterio: 'Elevación pasiva en el plano escapular con rotación interna. Combinar test para el SAPS apenas mejora la precisión (Lluch 2020, cap. 3.1, p. 54). Metaanálisis de 7 estudios (n = 946): LR+ 1,79 (IC 1,24–2,58), LR− 0,47 (IC 0,39–0,56), modelo bivariante. Sirve para descartar; un positivo es solo un hallazgo. Zhao 2024 (7 estudios, bivariante) da LR+ 1,54 (1,09–2,18), LR− 0,47 (0,41–0,54).', fuente: 'Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3)' },
      { name: 'Test de Resistencia a Rotación Externa', sn: '63%', sp: '75%', lr_pos: '2.6', lr_neg: '0.49', criterio: 'Contracción isométrica de rotación externa contra resistencia, codo a 90°. Positivo si reproduce dolor. LR+ 2,6 (IC 95 % 1,8–3,6), LR− 0,49 (0,33–0,72) para patología del manguito, un solo estudio (203 pacientes, ecografía); con el arco doloroso, el hallazgo más útil según la revisión. Para el pinzamiento con artroscopia como referencia, un estudio de bajo riesgo de sesgo recogido por Hegedus 2012 da LR+ 4,39 y LR− 0,50.', fuente: 'Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, patología del manguito) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 1)' },
      { name: 'Regla clínica de SAPS', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Descartar primero capsulitis (RE pasiva), origen cervical y dolor postraumático. Dolor o debilidad al elevar el brazo; el dolor debe reproducirse de forma consistente con los test resistidos. Regla clínica: SAPS probable si no hay pérdida de RE pasiva y hay dolor anterior, lesión por sobreesfuerzo y ausencia de síntomas en RE final en abducción.', fuente: 'Lluch 2020, cap. 3.1 (Struyf), p. 54' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Elevación en el plano de la escápula o RE resistida que reproduce el dolor → EVA. ② Fuerza isométrica en RE con dinamómetro si se dispone (brazo junto al cuerpo, codo a 90°) o grados de elevación activa hasta el dolor.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h3: {
    id: 'h3', region: 'hombro', num: '③',
    name: 'Rotura del Manguito Rotador',
    prom: 'SPADI (MCID: 14.9–25.4 pts) o ASES (MCID: 9–26.9 pts)',
    dosis: 'Rotura parcial: la misma pauta que la tendinopatía del manguito, que la guía incluye: educación (C), programa de ejercicio activo de control motor o de fuerza como tratamiento inicial (A), terapia manual para el dolor a corto plazo (B) y sin ultrasonido terapéutico (B); imagen y derivación al especialista si no mejora en un máximo de 12 semanas (F). Rotura completa: la guía la excluye y no se ha leído ninguna fuente con pauta, así que queda a criterio del clínico; si es consecuencia de una luxación anterior, el consenso ESSKA-ESA la considera indicación de reparación quirúrgica (B). Ninguna fuente fija series, repeticiones ni semanas.',
    dosisFuente: 'Desmeules 2025, J Orthop Sports Phys Ther 55(4):235–274 (guía de práctica clínica; incluye la rotura parcial y excluye la completa; letra = grado de la recomendación, tal como la da la guía) · Alentorn-Geli 2026, Knee Surg Sports Traumatol Arthrosc 34:3040–3051 (consenso formal de la ESSKA-ESA, parte 2: tratamiento y vuelta al deporte; letra = grado de la recomendación, tal como la da el consenso; ninguna llega a A)',
    pronostico: {
      horizonte: 'RM como referencia: rotura completa S 90 %, E 100 %; parcial S 100 %, E 87 %. No se observa curación espontánea y el tamaño puede aumentar en unos 2 años, también en asintomáticas.',
      derivacion: 'Alrededor del 40 % de la población tiene roturas asintomáticas: la rotura no explica por sí sola el dolor. La degeneración crece desde los 50–55 años mientras el dolor no traumático baja a partir de los 60–65.',
      fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 66–67'
    },
    tests: [
      { name: 'Test de Lata Vacía (Empty Can)', sn: '71%', sp: '49%', lr_pos: '1.3', lr_neg: '0.64', criterio: 'Resistencia a abducción con el brazo a 90° en el plano escapular y rotación interna (pulgar hacia abajo). Positivo: dolor o debilidad. Agrupado de 3 estudios para patología del manguito: LR+ 1,3 (0,97–1,6), LR− 0,64 (0,33–1,3); no sirve ni para confirmar ni para descartar.', fuente: 'Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, univariante de efectos aleatorios)' },
      { name: 'Test de Lata Llena (Full Can)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Resistencia a abducción con el brazo a 90° y rotación externa (pulgar hacia arriba). Positivo: dolor o debilidad. Cuenta como hallazgo en esta hipótesis: S 75 %, E 68 %, LR+ 2,4 (1,5–3,8), LR− 0,37 (0,23–0,60), un solo estudio y para patología del manguito en general, no para rotura; para rotura están los signos de retraso y los clusters de Park y Litaker.', fuente: 'Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, patología del manguito)' },
      { name: 'External Rotation Lag Sign', sn: '47%', sp: '94%', lr_pos: '7.2', lr_neg: '0.57', criterio: 'Imposibilidad de mantener la rotación externa pasivamente colocada. Para rotura completa: LR+ 7,2 (IC 95 % 1,7–31), LR− 0,57 (0,35–0,92), un solo estudio (37 pacientes, ecografía); un negativo no descarta. En otro estudio de bajo riesgo de sesgo recogido por Hegedus 2012 da LR+ 28 para la rotura completa del supraespinoso. Si el nervio supraescapular está paralizado, los test del supraespinoso y del infraespinoso salen positivos con el manguito intacto; distinguirlo exige más que la clínica y la atrofia (Lluch 2020, cap. 3.1, pp. 66–67).', fuente: 'Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, rotura completa)' },
      { name: 'Internal Rotation Lag Sign', sn: null, sp: null, lr_pos: '5.6', lr_neg: null, criterio: 'Mano en la espalda, codo a 90°: imposibilidad de mantenerla separada de la espalda. Explora el subescapular. Para rotura completa: S 97 %, E 83 %, LR+ 5,6 (IC 95 % 2,6–12), LR− 0,04 (0,0–0,58), un solo estudio (37 pacientes, ecografía). Solo puntúa positivo: la LR− tan baja no se reproduce en otros estudios recogidos por Hegedus 2012 (LR− 0,64 para la rotura del subescapular, con bajo riesgo de sesgo; 0,79 para la rotura completa del supraespinoso), y Zhao 2024, que agrupa 4 estudios mezclando las dos roturas, da LR− 0,77. Un negativo es solo un hallazgo. S y E solo aquí, para que no se recalcule la LR−.', fuente: 'Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, rotura completa) · Hegedus 2012 (Br J Sports Med 46:964–978, tablas 1 y 2) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 2 y fig. 2)' },
      { name: 'Drop Arm Test', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El brazo abducido a 90° no puede mantenerse — cae. Cuenta como hallazgo: S 24 %, E 93 %, LR+ 3,3 con IC 95 % 1,0–11 (incluye el 1), LR− 0,82, y para patología del manguito en general, no para rotura (un solo estudio). Dentro del cluster A de Park sí aporta.', fuente: 'Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, patología del manguito)' },
      { name: 'Inspección', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Brazo en cabestrillo, escápula en rotación inferior o inclinación anterior, cabeza humeral anteriorizada.', fuente: 'Lluch 2020, cap. 3.1 (Struyf), p. 66' },
      { name: 'Cluster A, confirmar: arco doloroso + drop arm + debilidad en RE, los tres positivos', sn: null, sp: null, lr_pos: '15.57', lr_neg: null, absorbe: [2, 4, 8], criterio: 'Rotura COMPLETA si los tres son positivos: 50 de 153 roturas completas frente a 4 de 195 controles (348 operados con los tres test hechos) → LR+ 15,57 (con dos de tres, LR+ 3,57). La combinación sale de una regresión logística en la misma muestra, sin grupo de validación (en Litaker, la LR bajó de 9,84 a 5,0 al validarla), y Hermans 2013 clasifica el estudio como de nivel IV. Arco doloroso: dolor o enganche entre 60° y 120° de elevación activa en el plano de la escápula, al subir o al bajar. Drop arm: al bajar el brazo desde la elevación completa, cae de golpe o duele mucho. Debilidad en RE (infraespinoso): codo a 90° junto al cuerpo, rotación neutra; positivo si cede por debilidad o dolor, o si hay signo de retraso en RE. Población quirúrgica (controles: otras cirugías de hombro, incluida la bursitis y la rotura parcial). Si puntúa, el drop arm, el signo de retraso en RE y el cluster B no suman aparte.', fuente: 'Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)' },
      { name: 'Cluster A, descartar: arco doloroso, drop arm y debilidad en RE, los tres negativos (si se cumple, marcar «Negativo»)', sn: null, sp: null, lr_pos: null, lr_neg: '0.16', absorbe: [4], criterio: 'Los tres negativos: 14 de 153 roturas completas frente a 114 de 195 controles → LR− 0,16 para rotura completa. Misma técnica que el cluster A de confirmar. Un positivo aquí es solo un hallazgo.', fuente: 'Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)' },
      { name: 'Cluster B: debilidad en RE + edad ≥65 (puntuación de Litaker ≥4)', sn: null, sp: null, lr_pos: '5.0', lr_neg: null, criterio: 'Puntuación: debilidad en RE 2 puntos + edad ≥65 años 2 + dolor nocturno 1; positivo con ≥4, así que basta con debilidad en RE y edad ≥65 (el dolor nocturno no hace falta). Debilidad en RE: brazos junto al cuerpo, codos a 90°, pulgares arriba y 20° de rotación interna; resistir el empuje hacia dentro. Dolor nocturno: se duerme, pero el dolor le despierta. LR+ 9,8 en el grupo de derivación (43 de 131 frente a 2 de 60); en el de validación baja a 5,0 (52 de 146 frente a 5 de 70, calculada de la tabla 4): se usa esta, como dice la tarjeta. Lluch 2020 (cap. 3.1, p. 66) da LR 9,84 con los tres positivos: es la cifra del grupo de derivación. Rotura parcial o completa por artrografía, en una consulta de cirugía de hombro. No publica LR−.', fuente: 'Litaker 2000 (J Am Geriatr Soc; n = 448 derivados a artrografía, 67 % con rotura; tabla 4, grupo de validación)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Elevación activa o arco doloroso → EVA. ② Fuerza isométrica en RE con dinamómetro si se dispone (brazo junto al cuerpo, codo a 90°) o grados de elevación activa.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Signo de Hornblower', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Un signo positivo puede indicar degeneración del redondo menor (por ejemplo, infiltración grasa). El capítulo no da S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 3.1 (Struyf), p. 66' }
    ]
  },
  h4: {
    id: 'h4', region: 'hombro', num: '④',
    name: 'Inestabilidad Glenohumeral (Anterior o Posterior)',
    prom: 'DASH (MCID: 10.8 pts) o QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Inestabilidad anterior traumática (el consenso no trata la posterior ni la multidireccional, que quedan a criterio del clínico). Primer episodio: cabestrillo para el dolor, preferiblemente en rotación interna; movilizar pronto, dentro de la primera semana, puede dar resultados parecidos a 3 semanas de cabestrillo (C). En mayores, inmovilizar para el dolor hasta descartar lesiones asociadas (C). Rehabilitación siempre, se opere o no (D): tras la inmovilización, movilidad pasiva controlada por el dolor que progresa a activo-asistida y, cuando el dolor lo permita, fuerza periescapular y del manguito, habiendo descartado antes lesiones asociadas. Recidiva: en general se recomienda cirugía, y en deportes de contacto o colisión la rehabilitación difícilmente basta; como preparación, ejercicios pasivos y activo-asistidos en cuanto se toleren y después propiocepción y fuerza del manguito, el deltoides y los periescapulares (C); cabestrillo solo 1–2 semanas para el dolor (C). Vuelta al deporte sin cirugía cuando haya rango completo sin dolor, hombro estable con aprensión negativa y fuerza y resistencia suficientes, por lo general a las 6–16 semanas (C). El consenso no fija series ni repeticiones.',
    dosisFuente: 'Alentorn-Geli 2026, Knee Surg Sports Traumatol Arthrosc 34:3040–3051 (consenso formal de la ESSKA-ESA, parte 2: tratamiento y vuelta al deporte; letra = grado de la recomendación, tal como la da el consenso; ninguna llega a A)',
    pronostico: {
      horizonte: 'Diagnóstico sobre todo clínico; la Rx simple puede identificar Bankart y Hill-Sachs. A las 3–4 semanas del episodio agudo hay poco dolor y recuperan movilidad y fuerza.',
      derivacion: 'La MDI se confunde con inestabilidad unidireccional, SAPS, patología discal cervical, plexitis braquial y desfiladero torácico. Tener presente Ehlers-Danlos o Marfan.',
      fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 58–59'
    },
    tests: [
      { name: 'Test de Aprehensión', sn: '65.6%', sp: '95.4%', lr_pos: '17.21', lr_neg: '0.39', criterio: 'Criterio: APREHENSIÓN (no solo dolor). Brazo a 90° abducción + rotación externa progresiva. El paciente siente que el hombro "se va a salir". Metaanálisis de 2 estudios (n = 409; modelo univariante de efectos aleatorios): LR+ 17,21 (IC 10,02–29,55), LR− 0,39 (IC 0,22–0,68).', fuente: 'Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis DerSimonian-Laird, tabla 3)' },
      { name: 'Test de Recolocación (Jobe)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tras el test de aprehensión, se aplica fuerza posterior en la cabeza humeral. Positivo si desaparece la aprehensión. Metaanálisis de 3 estudios (n = 509; modelo univariante de efectos aleatorios), con heterogeneidad significativa: S 64,6 %, E 90,2 %, LR+ 5,48 (IC 0,56–53,8), LR− 0,55 (IC 0,24–1,27). Los dos intervalos incluyen el 1: no puntúa (S y E solo aquí, para que no se recalcule la LR).', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Test de Liberación/Release/Surprise', sn: null, sp: null, lr_pos: null, lr_neg: '0.25', criterio: 'Se retira la fuerza de recolocación súbitamente — reaparece la aprehensión. Metaanálisis de 2 estudios (n = 128; modelo univariante de efectos aleatorios): S 81,8 %, E 86,1 %, LR+ 5,42 (IC 0,96–30,52), LR− 0,25 (IC 0,08–0,78). Solo puntúa negativo: el IC de la LR+ incluye el 1. Es el test de los tres que mejor descarta.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Anterior: aprensión, recolocación y sorpresa en conjunto', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aprensión, recolocación y sorpresa (S y E >72 %). Interpretar la aprensión, no el dolor. Cada test ya puntúa por separado arriba; esta fila no multiplica.', fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 58–59' },
      { name: 'Posterior: Jerk, Kim y signo de pinzamiento posterior agrupados', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'No usar un test aislado; agrupar Jerk, Kim y signo de pinzamiento posterior junto con la historia.', fuente: 'Lluch 2020, cap. 3.1 (Struyf), p. 59' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Aprensión de 0 a 10 en abducción + RE; en posterior, la posición provocadora. ② Fuerza isométrica de RE y RI con dinamómetro si se dispone, siempre en la misma posición.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Inestabilidad multidireccional: surco + tests en una dirección', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diagnóstico clínico propuesto: signo del surco positivo (inestabilidad inferior) y, al menos en una dirección (anterior o posterior), 2 de 3 tests positivos: cajón anterior y posterior a 10–30° de abducción, cajón anterior y posterior a 80–120° de abducción, y aprensión anterior y posterior. Los síntomas suelen aparecer en el rango medio del movimiento; puede haber atrofia generalizada y discinesia, y síntomas neurológicos pasajeros. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 58–59' }
    ]
  },
  h5: {
    id: 'h5', region: 'hombro', num: '⑤',
    name: 'Lesión Labral Superior (SLAP)',
    prom: 'DASH (MCID: 10.8 pts) o QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: '',
    pronostico: {
      horizonte: 'La artro-RM es más precisa que la RM sin contraste.',
      derivacion: 'El SLAP aislado es raro y es frecuente en asintomáticos: tratarlo solo tiene sentido si explica los síntomas. Suele acompañar a rotura del MR, inestabilidad, rotura del bíceps o bursitis.',
      fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 63–64'
    },
    tests: [
      { name: 'Test de O\'Brien (Active Compression)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión a 90°, aducción horizontal 10°, rotación interna (pulgar abajo) — resistencia. Luego igual con rotación externa. Positivo: dolor que desaparece o disminuye en supinación. Lluch 2020 (cap. 3.1, p. 63): ningún hallazgo físico es específico; sirve para sostener la hipótesis, no para confirmarla. Metaanálisis de 6 estudios (n = 782), sin el estudio original de O’Brien, que distorsionaba el resultado: S 0,67, E 0,37, LR+ 1,06 (IC 0,90–1,25), LR− 0,89 (IC 0,67–1,20). No puntúa: antes multiplicaba por el extremo bajo de «3–50», sin fuente.', fuente: 'Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)' },
      { name: 'Biceps Load Test II', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En supino, brazo elevado a 120° y en rotación externa máxima, codo a 90° y antebrazo en supinación; el paciente flexiona el codo contra resistencia. Positivo si esa flexión resistida provoca dolor. La LR+ alta es del estudio de sus creadores (S 89,7 %, E 96,9 %, n = 127, 15–52 años, excluidos luxación y hombro rígido); en los dos estudios independientes recogidos por Hegedus 2012, S 30–55 % y E 53–78 %, y la revisión concluye que hay «menos optimismo». Cuenta como hallazgo: la LR+ 26 solo se sostiene en el estudio de sus creadores.', fuente: 'Kim 2001 (Arthroscopy 17:160–164) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 2)' },
      { name: 'Test de Resistencia a Rotación Interna', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Resistencia a rotación interna en abducción. Cuenta como hallazgo: el estudio original no es de SLAP. En pacientes con signo de pinzamiento positivo distingue patología intraarticular en general (cualquier lesión dentro de la articulación) del pinzamiento subacromial (S 88 %, E 96 %, n = 115, un solo autor). Aplicar esa LR a SLAP mide otra condición.', fuente: 'Zaslav 2001 (J Shoulder Elbow Surg 10:23–27)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Gesto por encima de la cabeza que reproduce el síntoma mecánico → EVA. ② Fuerza isométrica de RE y RI con dinamómetro si se dispone, siempre en la misma posición.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' }
    ]
  },
  h6: {
    id: 'h6', region: 'hombro', num: '⑥',
    name: 'Disfunción Cervical con Dolor Referido a Hombro',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: 'Se trata como dolor de cuello con déficit de movilidad (la categoría de la guía que incluye el dolor referido a la cintura escapular o al miembro superior), según la fase. Aguda: manipulación torácica, ejercicios de movilidad cervical y fortalecimiento escapulotorácico y de miembro superior, que además favorecen la adherencia (B); puede añadirse manipulación o movilización cervical (C). Subaguda: ejercicios de resistencia de cuello y cintura escapular (B); manipulación torácica y manipulación o movilización cervical (C). Crónica: abordaje multimodal con manipulación torácica y manipulación o movilización cervical, ejercicio mixto cervical y escapulotorácico (neuromuscular, estiramientos, fuerza, resistencia, aeróbico y componente cognitivo-afectivo) y punción seca, láser o tracción mecánica o manual intermitente (B); ejercicio de resistencia de cuello, cintura escapular y tronco, y educación que promueva una vida activa y aborde los factores cognitivos y afectivos (C). La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    tests: [
      { name: 'Test de Spurling (Compresión Foraminal)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor de hombro con extensión + inclinación lateral ipsilateral + compresión axial. En el dolor de hombro cervicogénico el dolor se reproduce con las pruebas de la columna cervical y la movilidad pasiva glenohumeral no está limitada, lo que lo distingue del hombro congelado (Lluch 2020, tabla 2). El Spurling se ha estudiado para la radiculopatía cervical (S 0,50, E 0,86–0,93; revisión de Rubinstein recogida por Blanpied 2017), no para el dolor referido al hombro: aquí no puntúa.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)', noData: true },
      { name: 'Movilidad Glenohumeral Pasiva (PROM)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PROM glenohumeral preservado: diferencia el origen cervical del capsular primario. En la tabla de diagnóstico diferencial de Lluch 2020, el dolor de hombro cervicogénico no restringe la movilidad pasiva glenohumeral, mientras que el hombro congelado y la luxación bloqueada restringen la activa y la pasiva. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75', noData: true }
    ]
  },
  h7: {
    id: 'h7', region: 'hombro', num: '⑦',
    name: 'Artropatía Acromioclavicular',
    prom: 'SPADI o QuickDASH (MCID: 14.9–25.4 / 8.0–15.9 pts)',
    dosis: '',
    pronostico: {
      horizonte: 'Rx y RM muestran patología AC, pero muchos cambios aparecen en personas sin síntomas.',
      derivacion: 'La infiltración ecoguiada tiene efecto diagnóstico y terapéutico: decisión médica.',
      fuente: 'Lluch 2020, cap. 3.1 (Struyf), p. 61 · Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75'
    },
    tests: [
      { name: 'Test de Aducción Cruzada (Cross-body Adduction)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Brazo a 90° de flexión, aducción horizontal pasiva cruzando el cuerpo. Positivo si duele en la parte superior del hombro, cerca de la AC. Cuenta como hallazgo. En un estudio retrospectivo de casos y controles da S 77 % (27 de 35) y E 79 % (410 de 518), de las que saldrían LR+ 3,7 y LR− 0,29; pero los casos se definieron por dolor a la palpación de la AC e infiltración positiva, y los controles eran otras cirugías de hombro. En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 64 %, E 26 %, LR+ 0,86, LR− 1,39: no discrimina. La revisión de Krill 2018 deja fuera el primero por ser de nivel III. Lluch 2020 (cap. 3.1, p. 61) dice «S >67 %». S y E solo aquí, para que no se recalcule la LR.', fuente: 'Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tabla 3)' },

      { name: 'Palpación directa de la articulación AC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce dolor localizado en la articulación AC. S 96 % (27 de 28), E 10 % (1 de 10): si no duele, hace poco probable el cuadro; si duele, no lo confirma (LR+ 1,07). La LR− calculada (0,36) descansa en un solo control sin dolor a la palpación, así que no puntúa: S y E van solo aquí. Población: pacientes que ya señalan el dolor en la zona AC (prevalencia 74 %); referencia: alivio ≥50 % con infiltración de la AC guiada por imagen.', fuente: 'Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tabla I)' },
      { name: 'Paxinos + gammagrafía ósea combinados', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Los test AC por separado son débiles: Paxinos + gammagrafía ósea, los dos positivos, dan LR+ 55; los dos negativos, LR− 0,03 (17 de 28 con dolor AC tenían los dos positivos y ninguno de 9 sin él; ninguno de 28 los dos negativos). LR calculadas sumando 0,1 a cada casilla, con 9 controles. La gammagrafía no se hace en consulta: es un hallazgo, no puntúa.', fuente: 'Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)' },
      { name: 'Movilidad pasiva sin restricción; posible escalón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilidad pasiva sin restricción; posible escalón.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75' },
      { name: 'Compresión activa (O’Brien) para la AC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 14 %, E 92 %, LR+ 1,73 (0,53–5,15). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 (Walton 2004 y Cadogan 2013; deja fuera a Chronopoulos 2004 por ser de nivel III) da S 11 %, E 96 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que la revisión no respalda.', fuente: 'Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3) · Walton 2004 (J Bone Joint Surg Am) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tablas 3 y 4)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Aducción horizontal → EVA. ② Grados de aducción horizontal hasta la aparición del dolor, en la misma posición.', fuente: 'Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)' },
      { name: 'Test de Paxinos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentado, brazo junto al cuerpo. Pulgar bajo la cara posterolateral del acromion empujando hacia arriba y delante; índice y medio sobre la mitad de la clavícula empujando hacia abajo. Positivo si aparece o aumenta el dolor en la AC. S 79 %, E 50 % (LR+ 1,58). Hallazgo: la LR− calculada (0,42) sale de 10 controles.', fuente: 'Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)' }
    ]
  },
  h8: {
    id: 'h8', region: 'hombro', num: '⑧',
    name: 'Discinesia Escapular',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: '',
    tests: [
      { name: 'Observación visual de asimetría escapular (winging, tilting)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Asimetría visual en la elevación del brazo: ángulo inferior, borde medial o espina escapular prominentes. Las medidas de la movilidad escapular son poco fiables y de validez limitada, y no deben usarse para medir objetivamente la movilidad escapular dinámica (Desmeules 2025, recomendación 6, A). La discinesia se asocia al SAPS, pero no se ha demostrado que cause el dolor (Lluch 2020). Sin S ni E; no puntúa.', fuente: 'Desmeules 2025 (J Orthop Sports Phys Ther 55(4):235–274, recomendación 6) · Lluch 2020, cap. 3.1 (Struyf), pp. 53–54', noData: true },
      { name: 'Test de Asistencia Escapular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mejoría de síntomas o ROM cuando el examinador estabiliza manualmente la escápula durante la elevación. La discinesia es frecuentemente secundaria a otras patologías. No se ha demostrado que cause el dolor: el dolor de hombro también es muy frecuente sin discinesia, y su valor para predecir dolor futuro es escaso (en deportistas, un 43 % más de riesgo en un metaanálisis; en otros estudios, ninguno).', fuente: 'Lluch 2020, cap. 3.1 (Struyf), pp. 53–54' }
    ]
  },
  h9: {
    id: 'h9', region: 'hombro', num: '⑨',
    name: 'Disfunción de Primera Costilla (Zona Cervicotorácica)',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: '',
    tests: [
      { name: 'Palpación posteroanterior de 1ª costilla', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Restricción de movilidad de primera costilla a la palpación posteroanterior. En un Delphi de 12 expertos en terapia manual hubo consenso en que el movimiento accesorio posteroanterior doloroso y restringido de la 1.ª costilla, y su palpación dolorosa, ayudan a identificar su disfunción; es opinión de expertos y los autores piden estudiar su fiabilidad y validez. Sin S ni E; no puntúa.', fuente: 'Mastromarchi 2021 (J Man Manip Ther 29(3):181–188, Delphi, tabla 2)', noData: true },
      { name: 'Test de elevación del brazo post-movilización', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mejoría de la elevación del brazo tras movilización de la primera costilla. En un Delphi de 12 expertos en terapia manual hubo consenso en que la mejoría tras movilizar la 1.ª costilla apoya su disfunción (el consenso habla de mejoría en general, no de la elevación del brazo en concreto); es opinión de expertos, sin fiabilidad ni validez estudiadas. Sin S ni E; no puntúa.', fuente: 'Mastromarchi 2021 (J Man Manip Ther 29(3):181–188, Delphi, tabla 2)', noData: true }
    ]
  },  // Tarjeta hombro, nodo 2b: las dos ramas de rigidez activa = pasiva que no
  // son el congelado. Sin fila de PRONOSTICO en la tarjeta → sin `pronostico`;
  // sin dosis en la guía → `dosis: ''`.
  h10: {
    id: 'h10', region: 'hombro', num: '⑩',
    name: 'Artrosis Glenohumeral',
    prom: 'SPADI (MCID: 14.9–25.4 puntos)',
    dosis: '',
    tests: [
      { name: 'Mayor edad + crepitación con rigidez activa = pasiva', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mayor edad, dolor progresivo más largo y a menudo menos intenso, crepitación, posible atrofia. Rx simple la muestra.', fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75' }
    ]
  },
  h11: {
    id: 'h11', region: 'hombro', num: '⑪',
    name: 'Luxación Bloqueada o Fractura (→ Rx)',
    prom: 'QuickDASH (MCID: 8.0–15.9 pts)',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Luxación bloqueada: traumatismo previo, cualquier edad, rigidez activa y pasiva similar al congelado; imagen: Rx simple. Fractura: traumatismo previo, osteoporosis; imagen: Rx, y RM si es una fractura no desplazada del troquíter.',
      derivacion: 'Traumatismo previo + rigidez activa y pasiva → luxación bloqueada o fractura → Rx. No explorar más hasta tenerla.',
      fuente: 'Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75; Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)'
    },
    tests: [
      { name: 'Test de aprensión ósea y percusión olécranon-manubrio', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Solo con la Rx ya hecha: con traumatismo previo y rigidez activa y pasiva, no explorar más hasta tenerla. Test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).', fuente: 'Lluch 2020, cap. 3.1 (Struyf), p. 54' }
    ]
  },
};
