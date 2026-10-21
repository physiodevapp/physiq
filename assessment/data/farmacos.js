// ============================================================
// PhysiQ-Assessment · data/farmacos.js
// Contenido de la guía de fármacos de la cabecera (docs/farmacologia.md,
// paso 2). Una fila por familia, no por fármaco suelto. Solo lleva
// `apartados` una familia escrita con fuentes leídas en la sesión y revisada
// por el usuario; las demás se listan como pendientes.
//
// Límites (docs/farmacologia.md): nunca proponer cambiar, suspender ni ajustar
// la medicación; sin interacciones entre fármacos; el tono es «vigila y
// consulta».
//
// Esquema de una familia con contenido:
//   { id, nombre, ejemplos,
//     cima: ['<principio activo>', …]   // enlaces «Ficha técnica (CIMA)»: solo
//       // principios activos que nombra `ejemplos`, nunca grupos («heparinas»)
//     apartados: { dolor, visceral, ejercicio, sueno, consultar }
//       // cada uno: { texto: string | string[], detalle?: string | string[] }
//       // las citas dentro de la frase («(Schug 2021)») se pintan como botones
//     fuentes: ['<clave de data/referencias.js>', …] }
// Nunca entra en el payload, los resúmenes ni el prompt del informe con IA.
// ============================================================

export const APARTADOS_FARMACO = [
  { id: 'dolor', titulo: 'Dolor, inflamación y curación' },
  { id: 'visceral', titulo: 'Síntomas viscerales o secundarios' },
  { id: 'ejercicio', titulo: 'Ejercicio' },
  { id: 'sueno', titulo: 'Sueño' },
  { id: 'consultar', titulo: 'Cuándo consultar con el médico o el farmacéutico' },
];

export const FAMILIAS_FARMACO = [
  // AINE (2026-10): cinco revisiones leídas enteras en PMC. Huecos cerrados
  // (2026-10) con Malik 2023, Saad y Mathew 2025, Antunes 2024 (StatPearls) y
  // Goodman 2018, cap. 8, PDF del usuario, para la presentación de la úlcera,
  // y con Engert 2024 e Iacovides 2009 (PMC) para el sueño: docs/farmacologia.md.
  {
    id: 'aine',
    nombre: 'AINE (antiinflamatorios no esteroideos)',
    ejemplos: 'Ibuprofeno, naproxeno, diclofenaco, dexketoprofeno, celecoxib, etoricoxib',
    cima: ['ibuprofeno', 'naproxeno', 'diclofenaco', 'dexketoprofeno', 'celecoxib', 'etoricoxib'],
    apartados: {
      dolor: {
        texto: [
          'Alivian el dolor y, junto con el paracetamol, reducen la necesidad de opioides tras la cirugía (Schug 2021). Las fuentes leídas no estudian cuánto enmascaran la exploración; solo un caso describe que pudieron enmascarar los síntomas de una pericarditis en un corredor (Pannone y Abbott 2024). Anota si tomó una dosis antes de la sesión.',
          'Hueso: en humanos no hay pruebas sólidas de que retrasen la consolidación. Un metaanálisis asocia su uso con retraso o falta de consolidación (OR 2,07), pero con estudios de baja calidad y sin asociación con dosis bajas o tomas de menos de 2 semanas (Schug 2021).',
          'Tendón y ligamento: los datos en humanos son insuficientes y probablemente no perjudican, salvo quizá el celecoxib tras reparar el manguito rotador, con más roturas de nuevo en un ensayo de 180 pacientes (Schug 2021). En músculo y cartílago no hay estudios en humanos (Schug 2021).',
        ],
        detalle: [
          'En un ensayo pequeño (15 personas), los AINE atenuaron el aumento de síntesis de colágeno que produce el ejercicio en el tendón rotuliano (Pannone y Abbott 2024).',
          'Los coxibs (celecoxib, etoricoxib) protegen más las suturas intestinales, pero podrían ser peores para el hueso y las partes blandas; el propio autor lo considera especulativo por la calidad de los datos (Schug 2021).',
        ],
      },
      visceral: {
        texto: [
          'Estómago e intestino: la lesión de la mucosa es su principal limitación en el uso crónico. La gravedad depende sobre todo de la dosis y la duración, y el riesgo sube si ya hubo una complicación digestiva (Bindu 2020). Aumentan el riesgo de sangrado y perforación en el intestino en una medida similar a la del estómago (Papantoniou 2023). La lesión intestinal se manifiesta como anemia ferropénica, indigestión o dolor abdominal y, en lo grave, sangrado oculto o perforación (Bindu 2020).',
          'Úlcera: dolor en la boca del estómago que empieza a los 15–30 min de comer en la úlcera gástrica y a las 2–3 h en la duodenal, que además suele doler de noche y mejora al comer (Malik 2023). La úlcera por AINE asienta sobre todo en la pared posterior del estómago, y por eso puede dar dolor de espalda o de hombro, casi siempre el derecho; el dolor de espalda puede ser el primer y único síntoma (Goodman 2018). Quien toma AINE puede no tener síntomas hasta que la lesión está avanzada (Goodman 2018), y la úlcera, el sangrado o la perforación pueden ocurrir a cualquier edad, aunque son más frecuentes en mayores (Saad y Mathew 2025).',
          'Sangrado: vómito con sangre roja o en «posos de café», heces negras, pegajosas y de olor característico (melena), y síntomas de la pérdida de sangre como mareo al levantarse, síncope, cansancio, debilidad, palpitaciones o falta de aire con el esfuerzo. El hierro, el bismuto y el regaliz también ponen las heces negras sin que haya sangrado. Un abdomen doloroso a la palpación con defensa o rebote sugiere perforación (Antunes 2024).',
          'Si un dolor de espalda, cuello u hombro aumenta, disminuye o desaparece al comer, pide más cribado y derivación médica (Goodman 2018).',
          'Riñón y tensión arterial: retienen sodio y agua, con edema a menudo sin síntomas, y pueden subir la tensión (Lucas 2019; Bindu 2020). La lesión renal es rara en personas sanas a dosis habituales; el riesgo se concentra en mayores, enfermedad renal, hepática o cardíaca, deshidratación y quien toma a la vez diuréticos o fármacos del sistema renina-angiotensina (Lucas 2019).',
        ],
        detalle: [
          'Por qué el hombro y la espalda: si la úlcera se perfora, el jugo gástrico irrita el diafragma y el dolor se refiere al hombro, normalmente el derecho aunque el estómago esté a la izquierda; los nervios del estómago y del intestino delgado entran en la médula entre T6 y T9, y su dolor se percibe en la mitad de la espalda y la zona de la escápula. En la úlcera duodenal, un dolor fijo en la línea media de la espalda entre T6 y T10 que irradia al hipocondrio derecho puede indicar perforación de la pared posterior (Goodman 2018).',
          'Las fuentes no coinciden en los plazos tras comer: 15–30 min en la úlcera gástrica y 2–3 h en la duodenal (Malik 2023), frente a 30–90 min y 2–4 h (Goodman 2018).',
          'Los síntomas digestivos por fármacos pueden aparecer con retraso, hasta 6–8 semanas después de tomarlos, y la úlcera por AINE es uno de los casos más frecuentes (Goodman 2018).',
          'Qué aumenta el riesgo de complicación digestiva, sin contar otros fármacos: más de 65 años, úlcera o enfermedad digestiva previa, tabaco y alcohol (Goodman 2018). Los antiácidos y otros fármacos que bajan el ácido pueden enmascarar los síntomas de alarma, y la persona no nota que el daño sigue (Goodman 2018).',
          'Los coxibs dan menos úlcera porque la COX-2 no está en la mucosa del estómago (Malik 2023), pero no quitan el riesgo: quien toma un coxib también puede tener molestias o complicaciones digestivas, más con los mismos factores de riesgo (Goodman 2018).',
          'Corazón: su uso se asocia a peor salud cardiovascular, aunque se duda del riesgo coronario con dosis bajas durante pocos días. Las personas mayores tienen más riesgo de base de complicaciones cardiovasculares, digestivas, renales y hepáticas (Bindu 2020).',
          'Hígado: la lesión clínica es rara (1–10 casos por 100 000 prescripciones), más con diclofenaco y sulindaco; se presenta como hepatitis aguda con ictericia, náuseas y fiebre (Bindu 2020).',
          'Respiratorio: alrededor del 7 % de las personas con asma tiene broncoespasmo con la aspirina u otros AINE (Bindu 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Deshidratación y calor: el efecto de los AINE sobre el riñón empeora con deshidratación, poca perfusión renal o daño renal previo (Lucas 2019), y la deshidratación y el ejercicio intenso con calor reducen además el riego intestinal (Papantoniou 2023). Vigila la hidratación en sesiones largas o con calor.',
          'Resistencia: en maratón y ultrafondo las pruebas de daño son limitadas. Un ensayo con ibuprofeno 400 mg en una carrera por etapas vio más lesión renal aguda (22 de 42 frente a 16 de 47 con placebo), sin diferencia significativa, y la revisión aconseja precaución al tomarlos de forma preventiva, sin beneficio en el rendimiento (Pannone y Abbott 2024). Se desaconseja su uso habitual en deportistas, sobre todo antes de competir (Papantoniou 2023).',
          'Tensión arterial: pueden subir la tensión y restar efecto a los diuréticos, en torno a un 20 % (Lucas 2019; Bindu 2020).',
        ],
      },
      sueno: {
        texto: [
          'En adultos sanos, la aspirina a dosis baja (81 mg/día) durante 2–3 semanas no cambió el sueño medido con actigrafía y empeoró solo un poco la calidad que refieren; los estudios previos que recoge ese ensayo, con dosis altas durante pocos días, describen menos sueño profundo y más despertares (Engert 2024). En un ensayo pequeño (10 mujeres con dismenorrea), el diclofenaco mejoró el sueño al aliviar el dolor (Iacovides 2009). Las fuentes leídas no estudian el ibuprofeno ni otros AINE en personas sin dolor.',
          'Un dolor que despierta de noche y mejora al comer puede ser de una úlcera duodenal (Malik 2023).',
        ],
      },
      consultar: {
        texto: [
          'Sangrado digestivo visible: parar toda actividad y buscar atención médica (Papantoniou 2023), por urgencias (Antunes 2024). El sangrado oculto con anemia necesita estudio (Papantoniou 2023). La pérdida de peso sin querer, la dificultad para tragar que va a más, los vómitos repetidos o la anemia por falta de hierro también piden valoración médica pronta (Malik 2023).',
          'Dolor de espalda o de hombro en quien toma AINE, sobre todo con síntomas de úlcera: que lo valore un médico (Goodman 2018).',
          'También edema, poca orina o proteinuria pocos días después de empezarlos (Lucas 2019); ictericia, náuseas y fiebre; subida de la tensión, sobre todo con enfermedad renal crónica; o broncoespasmo en una persona con asma (Bindu 2020).',
          'Las dudas sobre la dosis, la duración o la combinación con otros fármacos, al médico o al farmacéutico.',
        ],
      },
    },
    fuentes: ['Schug 2021', 'Bindu 2020', 'Lucas 2019', 'Papantoniou 2023', 'Pannone y Abbott 2024', 'Malik 2023', 'Saad y Mathew 2025', 'Antunes 2024', 'Goodman 2018', 'Engert 2024', 'Iacovides 2009'],
  },
  // Corticoides (2026-10): seis revisiones o estudios leídos enteros en PMC y
  // la guía de Beuschlein 2024 por secciones. Huecos cerrados (2026-10) con
  // Yasir 2023 y Hodgens y Sharman 2023 (StatPearls), Benzon 2026 (guía ASRA) y
  // Humphrey 2023 (guía ACR), PDF del usuario, y siete fuentes de PMC: fiebre e
  // infección, piel, carga tras una infiltración y ejercicio en la osteoporosis
  // por glucocorticoides. El sangrado digestivo con AINE queda fuera (es una
  // interacción): docs/farmacologia.md.
  // La terapia manual cita Puentedura 2015 (tabla 1), leído entero para la
  // osteoporosis (docs/osteoporosis.md); corregido en el paso 3 de la
  // farmacología (docs/farmacos-paciente.md, decisión 6).
  {
    id: 'corticoides',
    nombre: 'Corticoides',
    ejemplos: 'Prednisona, metilprednisolona, dexametasona; infiltraciones (triamcinolona, betametasona)',
    cima: ['prednisona', 'metilprednisolona', 'dexametasona', 'triamcinolona', 'betametasona'],
    apartados: {
      dolor: {
        texto: [
          'Los efectos adversos dependen de la dosis y la duración, sobre todo con dosis altas, más de 2 semanas o más dosis por la tarde que por la mañana, aunque algunos estudios los describen tras una sola dosis o un ciclo corto (Pofi 2023). Cualquier vía puede tener efectos en todo el cuerpo, también la infiltración intraarticular (Pofi 2023).',
          'Infiltraciones: alivian el dolor durante semanas o meses, con el mayor efecto en las 2 primeras semanas, y en las 24–72 h siguientes puede haber dolor e hinchazón en el punto de la inyección. En las tendinopatías se asocian a peores resultados a largo plazo, sobre todo en la epicondilalgia lateral; la rotura del tendón tras la inyección parece poco frecuente (0,1–10 % según los estudios) (Grusky 2026).',
          'Hueso: la osteoporosis por glucocorticoides se debe sobre todo a una menor formación de hueso (Compston 2018).',
        ],
        detalle: [
          'Cartílago: en un ensayo, la triamcinolona intraarticular repetida en la rodilla redujo más el volumen de cartílago que el suero salino, y con dolor de cadera o rodilla sin artrosis previa cada infiltración se asoció a más riesgo de prótesis a los 5 años; otro estudio, con concentraciones fisiológicas, no encontró toxicidad sobre los condrocitos (Grusky 2026).',
          'Tras infiltraciones intraarticulares se han descrito fractura subcondral por insuficiencia (0,3 %), necrosis avascular (0,6–20,4 %) y destrucción rápida de la cadera (3–7 %). En el manguito rotador operado, una infiltración previa fue el factor de riesgo más constante de volver a operar (Grusky 2026).',
          'Una infiltración en los 3 meses previos a una prótesis de rodilla, cadera u hombro aumenta el riesgo de infección de la prótesis (Grusky 2026), sobre todo en el mes previo (Benzon 2026).',
          'Número de infiltraciones: la norma de no poner más de 3–4 al año en la misma articulación no se basa en investigación (Uson 2021). La guía de la ASRA no encuentra límites anuales definidos, sugiere separarlas al menos 2–3 semanas y hasta 3 meses, y en mujeres posmenopáusicas un tope por dosis acumulada (Benzon 2026).',
          'Rotura: se han descrito roturas de tendón entre 3 días y 5 meses después de infiltrar, sobre todo de la porción larga del bíceps, y una de la cintilla iliotibial tras tres infiltraciones; la guía pide prudencia al repetirlas en esos dos sitios. En la epicondilalgia, las revisiones no encontraron roturas, pero sí más recaídas que con fisioterapia sola (Benzon 2026).',
        ],
      },
      visceral: {
        texto: [
          'Osteonecrosis: el primer síntoma es un dolor óseo persistente que limita el movimiento y empeora al cargar y con la actividad. Afecta sobre todo a la cabeza femoral, y también a rodilla, hombro, tobillo o mano, a menudo en varias zonas a la vez (Kaneko 2021). El riesgo sube con dosis altas, por encima de 30 mg/día de prednisona o equivalente (Pofi 2023).',
          'Fractura vertebral: es la fractura más característica de la osteoporosis por glucocorticoides (Compston 2018). Hasta un 20 % de los pacientes tiene una fractura por fragilidad en el primer año de tratamiento, sobre todo en la columna, el fémur proximal y las costillas (Pofi 2023).',
          'Miopatía: debilidad proximal (hombros, muslos) de inicio insidioso y sin dolor, con análisis y electromiograma habitualmente normales. En una cohorte apareció tras una mediana de 97 días; se preguntaba por dificultad para subir escaleras, salir de la bañera, levantarse del váter o mantener los brazos por encima de la cabeza (He 2025).',
          'Infección: quien toma corticoides puede no dar los signos y síntomas habituales de una infección, porque frenan la respuesta inflamatoria y la fiebre, y eso retrasa reconocerla (Yasir 2023; Liu 2013). En una serie de 10 artritis sépticas tras infiltrar la rodilla, no todas con corticoide, todos tenían dolor e hinchazón, pero solo dos tenían fiebre (Benzon 2026): la falta de fiebre no la descarta.',
          'Piel: piel fina y frágil, hematomas (púrpura, sobre todo en el dorso de manos y antebrazos) y peor cicatrización, incluso con dosis bajas, y más cuanto mayor es la dosis y la duración (Yasir 2023; Liu 2013). La piel fina y la púrpura suelen mejorar al retirarlos; las estrías no (Hodgens y Sharman 2023).',
          'Al bajar la dosis, hasta la mitad de los pacientes tiene un síndrome de retirada con dolor muscular y articular, debilidad, cansancio y alteraciones del sueño y del ánimo, sobre todo por debajo de 15 mg/día de prednisona; también puede reaparecer la enfermedad de base (Beuschlein 2024).',
        ],
        detalle: [
          'Las fuentes no coinciden en la dosis a partir de la que sube la infección: por debajo de 10 mg/día de prednisona el riesgo sería mínimo o nulo (Yasir 2023; Liu 2013), pero los estudios observacionales lo ven aumentado ya con 5 mg/día o menos (Youssef 2016). Las fuentes leídas no describen en qué cuadros concretos (peritonitis, herida, artritis séptica) cursa sin fiebre ni dolor.',
          'Infiltración: alrededor del 4 % tiene pérdida de color de la piel en la epicondilalgia, y tras infiltrar puede haber atrofia de la grasa o de la piel en la zona (Benzon 2026). En personas mayores, los adhesivos y la manipulación del paciente son causas de desgarro de la piel (Guan 2026). Las fuentes leídas no dan normas para la terapia manual ni los vendajes en quien toma corticoides.',
          'Infección: el riesgo sube desde el inicio. Con más de 5 mg/día durante más de 6 meses se duplica el riesgo de infección grave, que baja en los 6 meses siguientes a dejarlos; además atenúan la respuesta de los neutrófilos a los estímulos inflamatorios (Pofi 2023). La artritis séptica tras una infiltración es rara (0,03–0,08 %) (Grusky 2026).',
          'Glucosa: una sola dosis puede subir mucho la glucosa, con o sin diabetes previa, y el mayor efecto suele darse entre la 2.ª y la 4.ª semana (Pofi 2023; Soura 2026). Las infiltraciones intraarticulares e intramusculares también se han asociado a hiperglucemia (Soura 2026).',
          'Osteonecrosis: Yasir 2023 la sitúa sobre todo con más de 20 mg/día de prednisona durante mucho tiempo, y Pofi 2023 por encima de 30 mg/día; también puede darse tras infiltraciones (Hodgens y Sharman 2023).',
          'En el lupus, las lesiones de osteonecrosis se detectaron en los primeros 5 meses de dosis altas, y más de la mitad de los pacientes estaba ya en fase avanzada cuando aparecieron los síntomas (Kaneko 2021).',
        ],
      },
      ejercicio: {
        texto: [
          'Fractura: el riesgo sube a los 3–6 meses de empezar y depende de la dosis (Compston 2018), incluso desde 2,5 mg/día; es mayor en los primeros meses, baja alrededor de un 30 % a los 6 meses de dejarlos y se normaliza a los 12 (Pofi 2023). La fractura aparece con una densidad ósea más alta que sin corticoides (Compston 2018).',
          'Terapia manual: una revisión de casos de efectos adversos del thrust torácico pone la medicación con corticoides a largo plazo, sin definir la dosis ni la duración, entre las contraindicaciones absolutas del thrust en la columna torácica; su tabla sale de un trabajo de una escuela de osteopatía, no de una guía (Puentedura 2015). En el plan de tratamiento, la app quita el thrust con la tarjeta «Osteoporosis o fragilidad ósea» y cuando la tarjeta «Lupus (LES)» registra corticoides o dosis altas previas. Las fuentes leídas no dan normas para la carga ni para el resto de la terapia manual: tenlo en cuenta al elegir carga axial intensa.',
          'El ejercicio adaptado a cada paciente y la prevención de caídas forman parte del manejo de la osteoporosis por glucocorticoides, aunque con pocas pruebas (Compston 2018). Las caídas pasaron de 1,6 a 2,8 por 100 personas-año al empezar los corticoides orales (He 2025).',
          'Miopatía: el ejercicio puede atenuarla según los estudios que cita una cohorte, en la que los síntomas mejoraron tras una mediana de 107 días; recomienda cribar las caídas en mayores de 50 años (He 2025).',
          'Glucosa: la actividad física forma parte del consejo para mantener el control glucémico (Soura 2026). En un paciente con diabetes, ten presente la subida pasajera de la glucosa tras una infiltración (Grusky 2026; Soura 2026), que puede tardar hasta 2 días en llegar a su máximo (Benzon 2026).',
          'Osteoporosis por glucocorticoides: la guía del ACR anima a todos los que los toman a hacer ejercicio con carga o de fuerza de forma regular, con recomendación condicional y certeza baja (Humphrey 2023). El consenso belga recomienda el ejercicio regular con más razón en quien los toma, centrado en el equilibrio, el impacto y la fuerza adaptados a cada paciente (Laurent 2022). Un metaanálisis de 3 ensayos vio mejor densidad ósea en la columna, no en la cadera (Kast 2023), y hay pocos datos sobre el ejercicio o la prevención de caídas en esta osteoporosis (Shrestha 2026).',
        ],
        detalle: [
          'Tras una infiltración, ninguna guía leída da una norma de reposo con grado. La de la ASRA recoge que la mayoría de los reumatólogos limita la carga 1–2 días; una revisión Cochrane apoya con evidencia de baja calidad el reposo de la rodilla, pero no el de la muñeca, donde 48 h de férula aumentaron las recaídas (Benzon 2026). EULAR pide no sobrecargar la articulación 24 h, sin inmovilizarla (Uson 2021). En un ensayo de tendinopatía del Aquiles, el ejercicio empezó a los pocos días y se evitó correr y saltar 3 meses, sin roturas (Johannsen 2022). Para los tendones y las partes blandas no hay protocolo: sigue la indicación de quien la puso.',
          'Las fuentes no coinciden en el impacto: el consenso belga lo propone (Laurent 2022), y la tarjeta «Osteoporosis o fragilidad ósea» lo limita tras una fractura vertebral o varias por fragilidad. Con esa tarjeta marcada, manda la tarjeta.',
        ],
      },
      sueno: {
        texto: [
          'La exposición prolongada a dosis altas se asocia a alteraciones del sueño, del ánimo y cognitivas; psicosis, manía, depresión o ansiedad aparecen en un 3–60 % según los estudios (Pofi 2023). Tras una infiltración puede aparecer insomnio, en general pasajero (Grusky 2026), y al bajar la dosis, alteraciones del sueño dentro del síndrome de retirada (Beuschlein 2024).',
        ],
        detalle: 'Tomar más dosis por la tarde que por la mañana se asocia a más efectos adversos (Pofi 2023), y repartir la dosis del día altera más el sueño, porque interfiere con el ritmo diario del cortisol; la acatisia (inquietud motora) es un efecto frecuente (Yasir 2023).',
      },
      consultar: {
        texto: [
          'Urgente: con corticoides actuales o recientes, por cualquier vía (también infiltraciones, inhalados o tópicos), hipotensión, colapso o síntomas abdominales agudos pueden ser una crisis suprarrenal, que puede ocurrir si se saltan dosis o con una gastroenteritis (Beuschlein 2024).',
          'Tras infiltraciones, sobre todo en los 2 meses siguientes o con varias en poco tiempo, hay que estar atento a síntomas de insuficiencia suprarrenal (Beuschlein 2024).',
          'Urgente: dolor, calor o hinchazón de una articulación en las semanas siguientes a infiltrarla, aunque no haya fiebre (Benzon 2026).',
          'Pronto: dolor óseo persistente que empeora al cargar, sobre todo en la cadera o la rodilla (Kaneko 2021); debilidad proximal nueva (He 2025); síntomas de hiperglucemia (Soura 2026).',
          'Nunca aconsejes bajar ni dejar los corticoides: tras un uso prolongado se retiran de forma pautada (Beuschlein 2024). Las dudas, al médico que los prescribe.',
        ],
      },
    },
    fuentes: ['Pofi 2023', 'Compston 2018', 'Kaneko 2021', 'Grusky 2026', 'He 2025', 'Beuschlein 2024', 'Soura 2026', 'Puentedura 2015', 'Yasir 2023', 'Hodgens y Sharman 2023', 'Liu 2013', 'Youssef 2016', 'Guan 2026', 'Benzon 2026', 'Uson 2021', 'Johannsen 2022', 'Humphrey 2023', 'Laurent 2022', 'Kast 2023', 'Shrestha 2026'],
  },
  // Anticoagulantes y antiagregantes (2026-10): ocho fuentes leídas enteras en
  // PMC, más Steffel 2021 (guía EHRA) y Antunes 2024 (StatPearls), PDF del
  // usuario. Ampliada con las fuentes de la condición especial «Paciente
  // anticoagulado o antiagregado» (docs/anticoagulado.md): hemartros, síndrome
  // compartimental, psoas, vaina de los rectos, golpe en la cabeza, técnicas
  // manuales, deporte, caídas y TVP. Sigue sin fuente leída el sueño:
  // docs/farmacologia.md.
  {
    id: 'antitromboticos',
    nombre: 'Anticoagulantes y antiagregantes',
    ejemplos: 'Acenocumarol, warfarina, apixabán, rivaroxabán, edoxabán, dabigatrán, heparinas; ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor',
    cima: ['acenocumarol', 'warfarina', 'apixabán', 'rivaroxabán', 'edoxabán', 'dabigatrán', 'ácido acetilsalicílico', 'clopidogrel', 'prasugrel', 'ticagrelor'],
    apartados: {
      dolor: {
        texto: [
          'Hematomas musculares espontáneos: aparecen en un 0,5–1,5 % de quienes toman anticoagulantes orales, sobre todo antivitamina K, con dolor muscular brusco, hinchazón y equimosis. Los sitios más frecuentes son el psoas, la vaina de los rectos y los músculos del muslo (vasto intermedio, aductores, sartorio) (Mameli 2025).',
          'Los favorecen la edad, un INR por encima de 3, tomar a la vez un antiagregante, la insuficiencia renal, una cirugía o un traumatismo recientes y el cáncer activo, y pueden bastar esfuerzos mínimos como una contracción muscular. Los benignos suelen resolverse en 2–6 semanas (Mameli 2025).',
          'Las fuentes leídas no dan datos sobre los tiempos de curación de los tejidos con estos fármacos.',
        ],
        detalle: 'Con warfarina, la actividad física regular se asoció a necesitar más dosis y a menos hemorragias (Muñoz 2022).',
      },
      visceral: {
        texto: [
          'Hematoma epidural espinal: raro pero urgente. Se presenta con dolor de cuello o espalda y déficit neurológico (debilidad de un lado o de ambos, alteración de la sensibilidad, de la vejiga o del intestino); dos de cada tres fueron cervicales o cervicotorácicos, y con debilidad de un lado puede parecer un ictus (Ghosh 2026).',
          'Los hematomas retroperitoneales y del iliopsoas tienen peor pronóstico. Una masa nueva no debe atribuirse sin más al anticoagulante: si no se resuelve en 2–3 semanas, mide más de 5 cm, es profunda o el dolor persiste o empeora, hay que estudiarla, porque puede haber un tumor debajo (Mameli 2025).',
          'Hematoma del psoas o retroperitoneal: da un cuadro variado (dolor abdominal, de cadera, de costado o lumbar, caída de la tensión y afectación del plexo lumbar) y por eso se diagnostica tarde (Lukies 2023); el muslo débil o adormecido por afectación del nervio femoral puede ser lo que lo delate, y solo un tercio de los sangrados abdominales tiene los síntomas clásicos (Sahu 2020).',
          'Hematoma de la vaina de los rectos: dolor brusco en la pared del abdomen con un bulto doloroso; lo favorecen la anticoagulación, la tos, la hipertensión, la edad y una cirugía abdominal previa (Liao 2021), y un caso con apixabán empezó tras una tos intensa (Hideyama 2023).',
          'Síndrome compartimental: un sangrado dentro de un compartimento cerrado da dolor desproporcionado, el compartimento tenso y dolor al estiramiento pasivo (Brooker 2020); el dolor al estiramiento pasivo es el signo precoz más sensible, y la parálisis, la palidez y la falta de pulso llegan tarde (Nemunaitis 2022).',
          'Sangrado digestivo alto: vómito con sangre roja o en «posos de café», heces negras y pegajosas (melena) o sangre roja por el ano si es rápido, y síntomas de la pérdida de sangre como mareo al levantarse, síncope, cansancio o debilidad. Un abdomen doloroso a la palpación con defensa o rebote sugiere perforación. El hierro, el bismuto y el regaliz también ponen las heces negras (Antunes 2024).',
          'Digestivo: el tubo digestivo es el lugar más frecuente de sangrado grave con anticoagulantes orales, alrededor del 40 %; la aspirina y otros AINE lesionan directamente la mucosa, los anticoagulantes no (Kurlander 2022). Los antidepresivos ISRS o IRSN aumentan el riesgo de sangrado grave y digestivo en quien toma anticoagulantes o antiagregantes (OR 1,3–1,5, certeza baja) (Nochaiwong 2022).',
        ],
        detalle: [
          'Con anticoagulantes, el síndrome compartimental ha aparecido tras un traumatismo de baja energía (Brooker 2020) y sin traumatismo (Nemunaitis 2022). El psoas sangró por la anticoagulación en 56 de 77 casos de una serie de UCI, con casos graves: el 44 % llegó en shock (Llitjos 2016).',
          'Hemartros: aparece en un 0–1,5 % de quienes toman anticoagulantes orales; no hay consenso sobre cómo manejarlo, y se aspira si el diagnóstico no está claro, para descartar una infección o una artritis por cristales (Dalrymple 2022).',
          'Con heparina en inyección, los moratones en el punto de inyección son frecuentes (Amaniyan 2020); un dolor brusco con bulto en la pared del abdomen no lo es (Liao 2021).',
          'Con ISRS o IRSN, el riesgo de sangrado grave fue algo mayor con los anticoagulantes directos (OR 1,72) que con los antivitamina K (OR 1,28). Los autores piden vigilar más a quien ya sangró o tiene úlcera, enfermedad hepática o renal o toma además AINE (Nochaiwong 2022).',
          'Tomar a la vez otro anticoagulante, antiagregantes (aspirina, clopidogrel, prasugrel, ticagrelor) o AINE aumenta el riesgo de sangrado con los anticoagulantes directos; los corticoides sistémicos figuran entre los factores que también lo aumentan (Steffel 2021). La aspirina con clopidogrel u otro antiagregante parecido multiplica por 2–3 la hemorragia digestiva alta, y en mayores de 75 años con antiagregantes y anticoagulantes llega hasta un 17 % al año (Antunes 2024).',
        ],
      },
      ejercicio: {
        texto: [
          'Punción seca: tomar antitrombóticos no es una contraindicación absoluta, no hay pruebas para aplazarla de forma sistemática y la medicación no debe suspenderse antes. Empieza por músculos superficiales observando cómo sangra, evita al principio los profundos que no se pueden comprimir y comprime unos 10–15 s en vez de unos 5 (Muñoz 2022).',
          'Acupuntura: complicaciones en un 0,003 % con una localización y una profundidad adecuadas; los sangrados graves se debieron a una punción demasiado profunda, y las agujas más gruesas sangran más (Muñoz 2022).',
          'Caídas: caerse no es una contraindicación para anticoagular, pero hay que reducir el riesgo de caídas y revisar los factores de sangrado modificables, sobre todo tomar a la vez antiagregantes; la guía aconseja ofrecer a todos estos pacientes una valoración y un programa de prevención de caídas (Steffel 2021).',
          'Golpes en la cabeza: tras un traumatismo craneal leve, los antiagregantes se asociaron a hemorragia intracraneal (OR 1,54). Los anticoagulantes no fueron significativos en ese metaanálisis; una posible explicación es que a estos pacientes se les hace siempre un TAC, y las guías piden cautela con todos los fármacos que afectan a la coagulación (Yang 2024). NICE pide derivar a urgencias a quien se golpea la cabeza y toma un anticoagulante o un antiagregante, salvo la aspirina sola, aunque no tenga otros síntomas (NICE NG232, 1.2.4); el sangrado tardío es raro, pero puede aparecer días después (Chenoweth 2018).',
          'Terapia manual: la única tabla específica de la columna torácica pone el thrust como contraindicación absoluta con tratamiento anticoagulante (Puentedura 2015), y otra, de la terapia manual cervical, como precaución (Hutting 2018); las dos son opinión de expertos y ninguna distingue fármacos ni da un INR. Un estudio de cohorte asoció la anticoagulación crónica a más lesión cerebral o medular tras la manipulación, sin probar la causa (Whedon 2015). Del masaje, la presión profunda y los estiramientos no hay normas: solo casos de sangrado tras un masajeador, un percutor o una sesión de estiramientos (Tominaga 2023; Kwon 2024; Kim 2026).',
          'Deporte de competición: con aspirina sola, sin límite; con doble antiagregación o anticoagulación plena, en los deportes de colisión o de impacto a alta velocidad los riesgos no compensan o se decide con el médico (Kim 2025). Fuera de la competición, las revisiones coinciden: actividades con poco riesgo de golpe, sí, y deportes de colisión, a decidir con el médico (Minardi 2024; Bavishi 2026).',
          'Embolia pulmonar: el ejercicio con el paciente anticoagulado es seguro, factible y mejora la capacidad de ejercicio y la calidad de vida, aunque faltan ensayos grandes (Xiang 2025). Tras una TVP, caminar pronto no aumentó la embolia en los estudios, con reservas sobre su calidad (Liu 2015).',
        ],
        detalle: [
          'Riesgo alto de caídas: caídas previas, debilidad de las piernas, mal equilibrio, deterioro cognitivo, hipotensión ortostática, psicofármacos, artritis grave o mareo; la guía propone también una puntuación con pruebas como la bipedestación en tándem, el paso alternante o levantarse de la silla (tabla 14) (Steffel 2021).',
          'La guía EHRA clasifica la inyección intramuscular, como una vacuna, entre las intervenciones de riesgo mínimo, con aguja fina y compresión firme 2–5 min; los cambios de la toma del anticoagulante los decide quien lo prescribe (Steffel 2021). No trata la punción seca.',
          'El riesgo de caídas no es por sí solo motivo para no anticoagular, porque las caídas rara vez causan un sangrado mayor (NICE NG196, 1.6.8); el riesgo absoluto de hemorragia intracraneal por una caída es bajo frente al de ictus, y lo indicado es entrenar fuerza, equilibrio y marcha y revisar la medicación con su médico (Mitchell 2023).',
          'Un consenso de expertos sobre instrumentos de tejidos blandos trata la anticoagulación como precaución (Cheatham 2025). En uno de los casos de sangrado, grave, se usó un percutor sobre el punto de inyección de la heparina (Kwon 2024).',
          'Kim 2025 da su regla solo para deportistas de competición y no dice qué anticoagulantes cuentan como plenos.',
        ],
      },
      sueno: {
        texto: 'Las fuentes leídas no describen efectos de los anticoagulantes ni de los antiagregantes sobre el sueño. En la embolia pulmonar, el ejercicio se asoció a mejor calidad del sueño (Xiang 2025).',
      },
      consultar: {
        texto: [
          'Urgente: dolor de cuello o espalda con debilidad, alteración de la sensibilidad o de la vejiga o el intestino (Ghosh 2026). Sangrado digestivo visible (vómito con sangre, melena), por urgencias (Antunes 2024). Golpe en la cabeza con anticoagulante o con un antiagregante que no sea la aspirina sola, a urgencias aunque se encuentre bien (NICE NG232, 1.2.4); se han descrito hemorragias intracraneales tardías tras caídas con anticoagulantes directos (Steffel 2021). Dolor fuerte de ingle, cadera o costado con el muslo débil o mareo (Lukies 2023), o una extremidad tensa con dolor desproporcionado (Brooker 2020).',
          'Pronto: hinchazón, dolor o un hematoma que no se resuelve, o una masa que sigue a las 2–3 semanas (Mameli 2025), o una articulación hinchada tras un golpe pequeño o sin golpe (Dalrymple 2022).',
          'Los sangrados menores (encías, nariz, pequeños hematomas) se comentan con quien lo prescribe; la guía pide no saltarse ninguna dosis sin consultarlo antes (Steffel 2021).',
          'Nunca aconsejes dejar ni saltarse el anticoagulante: no tomarlo bien se asocia a más ictus y muerte, más aún con los anticoagulantes directos por su vida media corta (Salmasi 2020), y tampoco hay que suspenderlo antes de la punción seca (Muñoz 2022). Las dudas, al médico que lo prescribe.',
          'Si el paciente toma alguno, marca la tarjeta «Paciente anticoagulado o antiagregado» en la fase 1: añade las preguntas de sangrado de la fase 2, una línea de técnica en la 4b, un recuadro en la fase 5 y los avisos y la red de seguridad del plan.',
        ],
      },
    },
    fuentes: ['Mameli 2025', 'Ghosh 2026', 'Antunes 2024', 'Kurlander 2022', 'Nochaiwong 2022', 'Muñoz 2022', 'Steffel 2021', 'Yang 2024', 'Xiang 2025', 'Salmasi 2020',
      'Lukies 2023', 'Sahu 2020', 'Llitjos 2016', 'Liao 2021', 'Hideyama 2023', 'Amaniyan 2020', 'Brooker 2020', 'Nemunaitis 2022', 'Dalrymple 2022',
      'NICE NG232', 'Chenoweth 2018', 'Puentedura 2015', 'Hutting 2018', 'Whedon 2015', 'Tominaga 2023', 'Kwon 2024', 'Kim 2026', 'Cheatham 2025',
      'Kim 2025', 'Minardi 2024', 'Bavishi 2026', 'Liu 2015', 'NICE NG196', 'Mitchell 2023'],
  },
  // Opioides (2026-10): seis fuentes en PMC, dos leídas en parte (Dowell 2022,
  // Sampaio-Cunha y Martins 2022; ver el registro). Huecos cerrados (2026-10)
  // con Regina 2025, Dhesi 2024, Leslie y Rout 2024, Leslie y Rawla 2023
  // (StatPearls) y el ensayo OPAL (Jones 2023), PDF del usuario, y Roulet 2021,
  // Lee 2023 y Xia 2025 en PMC: sobredosis, tramadol y retención urinaria. Sin
  // fuente leída para la curación de tejidos ni la terapia manual:
  // docs/farmacologia.md.
  {
    id: 'opioides',
    nombre: 'Opioides',
    ejemplos: 'Tramadol, tapentadol, codeína, morfina, oxicodona, fentanilo, buprenorfina',
    cima: ['tramadol', 'tapentadol', 'codeína', 'morfina', 'oxicodona', 'fentanilo', 'buprenorfina'],
    apartados: {
      dolor: {
        texto: [
          'En el dolor subagudo y crónico, frente a placebo, mejoran poco el dolor a corto plazo (0,79 puntos sobre 10), y la mejoría baja con el tiempo, de 1 punto a los 1–3 meses a unos 0,5 a los 3–6 meses; no hay ensayos con placebo más allá de 6 meses. Dos sociedades médicas estadounidenses desaconsejan los opioides, también el tramadol, para el dolor agudo por lesiones musculoesqueléticas (Dowell 2022).',
          'El ejercicio terapéutico reduce el dolor y mejora la función en la lumbalgia, la fibromialgia y la artrosis de cadera o rodilla, con beneficios que se mantienen 2–6 meses, y puede sumarse a la medicación (Dowell 2022).',
          'En la lumbalgia y la cervicalgia agudas, un opioide (oxicodona con naloxona, hasta 6 semanas) no alivió el dolor más que el placebo a las 6 semanas, y al año el riesgo de mal uso fue el doble (20 % frente a 10 %). Los autores concluyen que no deben recomendarse y que el manejo inicial es tranquilizar, aconsejar mantenerse activo y, si hace falta, analgésicos simples (Jones 2023).',
          'Hiperalgesia inducida por opioides: más sensibilidad al dolor por la propia exposición. Se distingue de la tolerancia porque el dolor mejora al bajar la dosis y empeora al subirla, y si no se piensa en ella se siguen subiendo dosis (Sampaio-Cunha y Martins 2022).',
        ],
        detalle: [
          'Parecen mejorar más la satisfacción con la atención que la intensidad del dolor, lo que la revisión relaciona con un efecto de enmascarar el dolor (Sampaio-Cunha y Martins 2022). Las fuentes leídas no dicen cuándo conviene valorar respecto a la toma.',
          'Frente a no tomarlos, se asocian a más trastorno por uso de opioides, sobredosis, muerte, fracturas, caídas e infarto (Dowell 2022).',
          'Las fuentes leídas no tratan su efecto sobre la curación de los tejidos.',
        ],
      },
      visceral: {
        texto: [
          'Estreñimiento, náuseas y dolor abdominal: frenan el tubo digestivo y producen náuseas, vómitos, dificultad para evacuar y dolor abdominal con espasmos o cólicos. El estreñimiento puede aparecer con dosis bajas y en cualquier momento, y no se reduce con el tiempo; en el dolor crónico no oncológico lo tiene un 41 %, náuseas un 32 % y somnolencia un 29 % (Camilleri 2017).',
          'Síndrome del intestino narcótico: dolor abdominal diario durante más de 3 meses con más de 100 mg/día de morfina o equivalente, que no mejora o empeora al subir la dosis. Ante síntomas digestivos hay que pensar siempre si pueden deberse al opioide (Camilleri 2017). En mayores, el estreñimiento puede llegar a impactación fecal y perforación (Dufort y Samaan 2021).',
          'Hormonas: hipogonadismo en un 63 % (casi todos varones) e insuficiencia suprarrenal en un 15 %, con cansancio, malestar, molestias abdominales, falta de apetito o hipotensión ortostática; revierten al reducir o retirar el opioide (De Vries 2020).',
          'Tramadol: sus efectos más frecuentes (náuseas, mareo, picor, estreñimiento, vómitos, somnolencia y dolor de cabeza) aparecen sobre todo al empezarlo, y también puede dar hipotensión al levantarse y síncope (Dhesi 2024). Las convulsiones están entre sus efectos neurológicos graves más frecuentes, con más riesgo en quien ya las ha tenido (Roulet 2021). Es el opioide con más casos notificados de hipoglucemia (Roulet 2021). En un estudio en pacientes ingresados, el 8,4 % tuvo hiponatremia en los 10 días siguientes a empezar tramadol con paracetamol, frente al 4,2 % con paracetamol solo, casi siempre leve y entre los días 2 y 9 (Lee 2023).',
          'Retención urinaria: los opioides están entre los fármacos que la causan (Leslie y Rout 2024; Leslie y Rawla 2023). La aguda es no poder orinar de repente, con urgencia intensa, el bajo vientre hinchado y dolor sobre el pubis; es más frecuente en varones de 60–80 años, y en mayores puede no dar síntomas (Leslie y Rout 2024; Leslie y Rawla 2023). Con dolor lumbar, ciática, debilidad de las piernas, anestesia en silla de montar o alteración intestinal, hay que pensar en un síndrome de cola de caballo (Leslie y Rout 2024).',
          'Al dejarlos o bajar la dosis, el síndrome de abstinencia da dolor muscular, náuseas, diarrea, sudor, insomnio y ansiedad; con los de acción corta empieza a las 8–12 h y cede en 3–5 días (Dufort y Samaan 2021). El dolor también puede empeorar durante la retirada (Dowell 2022).',
        ],
        detalle: [
          'Síndrome serotoninérgico: el tramadol inhibe la recaptación de serotonina y noradrenalina, y el tramadol y el fentanilo son los opioides que más aparecen en los casos publicados. Da alteración mental, agitación, mioclonías, hiperreflexia, sudor, escalofríos, temblor, diarrea, falta de coordinación o fiebre, y puede ser mortal (Blyzniuk 2026).',
          'La hiponatremia se asocia a más caídas y fracturas en el hospital (Lee 2023). Las dos bases de farmacovigilancia que recoge una revisión no coinciden en si la hipoglucemia es más frecuente con diabetes; la revisión aconseja avisar a quien tiene diabetes, sobre todo a las mujeres (Roulet 2021).',
          'Tras operar una fractura de cadera en mayores, la retención urinaria va del 11 al 51 %, y los estudios no coinciden en si los opioides la favorecen (Xia 2025). Las fuentes leídas no dan cuántas retenciones causa el opioide en quien lo toma en casa.',
          'Hueso: en un estudio, la mitad de los varones que tomaban morfina tenía osteopenia y un 21 % osteoporosis (De Vries 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, somnolencia y caídas: frente a placebo dan más mareo y somnolencia (Dowell 2022). En mayores producen sedación, falta de coordinación, mareo y caídas, con más fracturas de cadera y no vertebrales (Dufort y Samaan 2021). La guía de los CDC pide en mayores de 65 vigilar el deterioro cognitivo, valorar el riesgo de caídas y usar el ejercicio para prevenir el estreñimiento (Dowell 2022).',
          'Subir la dosis deprisa aumenta la sedación y la depresión respiratoria. En trabajos de riesgo (conducir, maquinaria pesada, alturas), la guía pide valorar si el paciente puede hacerlos (Dowell 2022). Con el tramadol, el riesgo de depresión respiratoria es mayor al empezar o al subir la dosis, en las 24–72 h siguientes (Dhesi 2024).',
          'Mantener o aumentar la actividad física, junto con el agua y la fibra, ayuda a prevenir el estreñimiento; durante una retirada pautada, la guía pide aprovechar al máximo los tratamientos del dolor sin fármacos (Dowell 2022).',
        ],
        detalle: 'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
      },
      sueno: {
        texto: [
          'Pueden empeorar el sueño, y dormir mal baja el umbral del dolor y lleva a subir la dosis; en el dolor crónico también pueden mejorarlo al reducir el dolor (Langstengel y Yaggi 2022).',
          'Causan depresión respiratoria y apnea del sueño central según la dosis, y la mayoría de las muertes por opioides ocurren durante el sueño (Langstengel y Yaggi 2022). La apnea del sueño aumenta el riesgo de depresión respiratoria grave o sobredosis (Dowell 2022).',
        ],
        detalle: 'Con el tramadol, como con otros opioides, el riesgo de apnea central del sueño depende de la dosis (Dhesi 2024). Tras una retirada pautada, algunos pacientes refieren insomnio, ansiedad, depresión y más dolor, sobre todo al principio (Dowell 2022).',
      },
      consultar: {
        texto: [
          'Urgente: la tríada de la sobredosis es pupilas puntiformes, respiración lenta o superficial (hasta 4–6 respiraciones por minuto) y bajo nivel de consciencia, aunque las pupilas pequeñas pueden faltar. Llama a emergencias: la naloxona busca recuperar la respiración, no despertar del todo, y su efecto puede durar menos que el del opioide, así que la sobredosis puede volver aunque la persona despierte (Regina 2025). Confusión, sedación o habla arrastrada pueden anunciar una sobredosis, y la naloxona revierte la depresión respiratoria grave (Dowell 2022). Signos de síndrome serotoninérgico en quien toma tramadol con un antidepresivo (Blyzniuk 2026).',
          'Urgente también: no poder orinar con dolor sobre el pubis, sobre todo con dolor lumbar, ciática, anestesia en silla de montar o alteración intestinal (Leslie y Rout 2024).',
          'Combinaciones que hay que comentar con quien prescribe: benzodiacepinas (casi cuadruplican el riesgo de muerte por sobredosis), gabapentina o pregabalina, relajantes musculares, otros sedantes y alcohol (Dowell 2022).',
          'Pronto: dolor abdominal nuevo o que empeora (Camilleri 2017); síntomas de abstinencia; dolor que aumenta pese a subir la dosis (Sampaio-Cunha y Martins 2022); cansancio, hipotensión al levantarse o problemas sexuales en tratamientos largos (De Vries 2020).',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: no deben retirarse de golpe, y una retirada rápida puede causar abstinencia, más dolor, malestar psicológico grave e ideas de suicidio; la retirada se planifica con quien los prescribe (Dowell 2022).',
        ],
        detalle: 'La misma fuente da dos duraciones del efecto de la naloxona: 90–180 minutos en un apartado y alrededor de 1 hora en otro (Regina 2025). En la sobredosis de tramadol, de acción larga, suelen hacer falta dosis repetidas (Regina 2025; Dhesi 2024).',
      },
    },
    fuentes: ['Dowell 2022', 'Sampaio-Cunha y Martins 2022', 'Camilleri 2017', 'Dufort y Samaan 2021', 'De Vries 2020', 'Blyzniuk 2026', 'Langstengel y Yaggi 2022', 'Jones 2023', 'Regina 2025', 'Dhesi 2024', 'Roulet 2021', 'Lee 2023', 'Leslie y Rout 2024', 'Leslie y Rawla 2023', 'Xia 2025'],
  },
  // Gabapentinoides (2026-10): siete fuentes (cinco enteras en PMC, Carvalho 2022
  // leída en parte, y los capítulos de StatPearls de gabapentina y pregabalina,
  // PDF del usuario). Huecos cerrados (2026-10) con Enke 2018, Yuen 2026 y
  // Akin 2022 (PDF del usuario) y Leung 2024, Scott 2024, Moon 2026, Rissardo
  // 2023 y 2025 y Pathak 2025 (PMC): caídas y fracturas, mioclonías, lumbalgia,
  // hueso y sueño en la fibromialgia. Sin fuente leída para la curación de los
  // tejidos ni la terapia manual: docs/farmacologia.md.
  {
    id: 'gabapentinoides',
    nombre: 'Gabapentinoides',
    ejemplos: 'Gabapentina, pregabalina',
    cima: ['gabapentina', 'pregabalina'],
    apartados: {
      dolor: {
        texto: [
          'En la ciática, la pregabalina no alivió más el dolor ni mejoró más la discapacidad que el placebo en seguimientos de hasta 52 semanas, y la gabapentina tampoco a las 8 semanas; una diferencia a los 3–4 meses no llegó a ser clínicamente relevante (menos de 2 puntos sobre 10). La revisión concluye que no hay evidencia que apoye su uso sistemático en la ciática ni en la lumbalgia (Giménez-Campos 2021). Un capítulo de StatPearls afirma que la pregabalina no debería prescribirse para el dolor musculoesquelético (Cross 2024).',
          'En la lumbalgia crónica, un metaanálisis de 9 ensayos no encontró efecto sobre el dolor a corto plazo (diferencia de 0,0 puntos sobre 10) ni sobre la discapacidad, y tampoco en el dolor radicular lumbar en ningún plazo, con evidencia de calidad moderada o alta; sí aumentaron los efectos adversos (RR 1,4), sobre todo la somnolencia, el mareo y las náuseas (Enke 2018).',
          'En el dolor neuropático sí superan al placebo: el número necesario a tratar es de 8 y 10 para la pregabalina (reducción del dolor de al menos 30 % y 50 %) y de 7 y 8 para la gabapentina (Meaadi 2023). Las indicaciones aprobadas de la gabapentina son la neuralgia posherpética y, como complemento, las crisis parciales (Yasaei 2024); las de la pregabalina, el dolor neuropático de la neuropatía diabética, la lesión medular y la neuralgia posherpética, y la fibromialgia (Cross 2024).',
        ],
        detalle: [
          'En la estenosis lumbar, a corto plazo no redujeron el dolor más que los AINE, el limaprost o la difenhidramina; a medio plazo parecieron algo más eficaces, sin ventaja en discapacidad (ODI) y con más efectos adversos. Son seis estudios con 392 pacientes y controles distintos entre sí (Martínez 2023).',
          'Una revisión narrativa que defiende el fármaco señala que no beneficia a todos los pacientes y que tiene sentido elegirlo según la fisiopatología y el perfil de síntomas (McAnally 2020).',
          'El efecto de la gabapentina suele notarse en la primera semana, aunque la mejoría importante puede tardar hasta un mes (Yasaei 2024). En el dolor tras una lesión medular, la pregabalina puede mejorar el dolor desde la primera semana y se pide probarla 4–6 semanas si se tolera (Cross 2024).',
          'Hueso: en un estudio transversal con 40 adultos de 18 a 50 años que tomaban pregabalina desde hacía al menos 6 meses, la densidad ósea lumbar y del cuello del fémur y los marcadores óseos no fueron distintos de los de 40 controles; no incluye a mayores ni a mujeres posmenopáusicas (Akin 2022).',
          'Las fuentes leídas no tratan su efecto sobre la inflamación ni sobre la curación de los tejidos en humanos.',
        ],
      },
      visceral: {
        texto: [
          'Edema periférico y aumento de peso: con gabapentina, frente a placebo, el aumento de peso (RR 5,6) y el edema periférico (RR 3,1) estuvieron entre los efectos con mayor riesgo relativo, y con pregabalina el aumento de peso (RR 5,0) (Meaadi 2023). El aumento de peso de la pregabalina depende de la dosis y llega hasta el 14 % con 600 mg al día (Cross 2024). Se ha descrito una cascada de prescripción: tras empezar uno de los dos, aumenta el uso posterior de diuréticos de asa (Cross 2024).',
          'Dolor o debilidad muscular sin explicar: se han descrito casos de rabdomiólisis con la gabapentina (Yasaei 2024) y, en el registro de acontecimientos adversos de la FDA, con la pregabalina, por lo que se pide comunicar enseguida cualquier síntoma muscular sin explicar (Cross 2024).',
          'Entre las reacciones frecuentes de la gabapentina figuran náuseas, vómitos, diarrea, estreñimiento, boca seca, fatiga, visión doble, temblor y dolor de espalda (Yasaei 2024). En la ciática, el mareo y las náuseas o vómitos fueron más frecuentes con pregabalina que con placebo (Giménez-Campos 2021).',
          'Mioclonías: sacudidas musculares bruscas, sobre todo en manos y pies, que con la gabapentina aparecieron con una mediana de 1 semana; la mayoría se recuperó por completo al retirarla. Pasan desapercibidas si no se pregunta por ellas y pueden dar caídas sin explicación. El riesgo es mayor con dosis altas o con la función renal alterada, aunque también se han visto en personas sanas (Rissardo 2023). También puede aparecer asterixis, una pérdida breve del tono muscular (Rissardo 2025).',
          'Depresión e ideas de suicidio: ambos fármacos pueden provocarlas o empeorarlas, y se vigilan durante el tratamiento (Yasaei 2024). Los antiepilépticos como la pregabalina pueden aumentar el riesgo de pensamientos o conductas suicidas (Cross 2024).',
          'Reacciones de hipersensibilidad graves con la gabapentina: síndrome de Stevens-Johnson, angioedema, anafilaxia y DRESS (hipersensibilidad multiorgánica), esta última a veces mortal (Yasaei 2024).',
          'Retirada brusca: con la pregabalina, insomnio, náuseas, cefalea, ansiedad, nerviosismo, irritabilidad, sudoración y diarrea (Cross 2024); con la gabapentina, crisis de retirada (Yasaei 2024). Pueden dar dependencia física con dosis moderadas o altas y uso prolongado (McAnally 2020).',
        ],
        detalle: [
          'La misma revisión da una mediana de 1 semana hasta la mioclonía en los resultados y describe el caso típico a las 4 semanas; con la pregabalina no encuentra factores de riesgo claros (Rissardo 2023). La edad avanzada, la epilepsia, la función renal alterada y tomar muchos fármacos también aumentan el riesgo (Rissardo 2025).',
          'La pregabalina produjo euforia a dosis terapéuticas y la gabapentina no; ningún ensayo evaluó el abuso ni el trastorno por uso indebido (Meaadi 2023). Entre quienes tienen un trastorno por uso de sustancias, sobre todo de opioides, el uso indebido llega hasta el 20 % (McAnally 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, somnolencia y marcha: son las reacciones más frecuentes y las que más llevaron a abandonar la pregabalina; la mayoría fueron leves o moderadas, dependientes de la dosis y aparecieron en las 2 primeras semanas (Cross 2024). Con pregabalina fueron mucho más frecuentes que con placebo la incoordinación (RR 7,2), la marcha anormal (RR 6,7) y la ataxia (RR 6,0); con gabapentina, el mareo (RR 3,3) y la somnolencia (RR 2,9) (Meaadi 2023). Otra revisión añade sedación e inestabilidad de la marcha, y que una de cada tres personas notó mareo o somnolencia a dosis terapéuticas (Martínez 2023).',
          'Mayores y función renal: ambos fármacos se eliminan por vía renal y el aclaramiento baja en los mayores y con disfunción renal, con más riesgo de reacciones adversas (Yasaei 2024; Cross 2024).',
          'Caídas y fracturas: en mayores, la fractura de cadera fue un 30 % más probable en los 60 días siguientes a dispensarlos, y más en personas frágiles o con enfermedad renal crónica (Leung 2024). En pacientes ingresados, las caídas fueron más frecuentes con ellos (OR 1,88) (Moon 2026).',
          'Las fuentes no coinciden en si la causa es el fármaco: en personas con artritis inflamatoria, el riesgo de fractura subió un 36 %, sin relación con la dosis, y siguió alto años después de empezar (Scott 2024); en un estudio de dos países con mayores de 60 años, el riesgo fue más alto en los 90 días antes de empezar que en los primeros 60 días de tratamiento y volvió a lo normal después, y los autores lo atribuyen sobre todo al motivo por el que se recetan, sin descartar el mareo y la somnolencia del principio (Yuen 2026). Ese estudio pide valorar el riesgo de caídas y fracturas al empezarlos y vigilar de cerca las primeras semanas (Yuen 2026).',
          'Conducir: se pide cautela hasta saber cuánto afecta la gabapentina (Yasaei 2024); otro capítulo aconseja no conducir mientras se toma la pregabalina (Cross 2024).',
        ],
        detalle: [
          'Más de la mitad de los efectos adversos de los ensayos (12 de 18) eran de cognición o coordinación: mareo, somnolencia, ataxia, amnesia, marcha anormal, incoordinación, astenia, confusión, euforia, pensamiento anormal, ambliopía y visión borrosa (Meaadi 2023). La pregabalina también da dificultad de concentración y visión borrosa (Cross 2024).',
          'En la estenosis lumbar, los autores plantean que combinar el fármaco con fisioterapia y ejercicio terapéutico individualizados puede dar los mejores resultados antes de plantear la cirugía, y piden describir mejor esos programas; la distancia de marcha no aumentó en los estudios que la midieron, salvo en uno que añadió pregabalina a un AINE (Martínez 2023).',
          'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
        ],
      },
      sueno: {
        texto: [
          'Favorecen el sueño de ondas lentas, a diferencia de la mayoría de los fármacos para el insomnio y de otros anticonvulsivos, que lo reducen (McAnally 2020).',
          'Gabapentina: en casi todos los estudios, más sueño de ondas lentas y menos fase N1, con efecto variable en el REM, y un sueño más largo y profundo. Pregabalina: en el único ensayo en adultos sanos aumentó el tiempo total de sueño y su eficiencia, redujo la latencia y los despertares, aumentó el sueño de ondas lentas y redujo el REM; la revisión no incluye estudios en pacientes con dolor para la pregabalina (Carvalho 2022).',
          'La somnolencia es uno de sus efectos adversos más frecuentes (Meaadi 2023), y la retirada brusca da inquietud e insomnio (McAnally 2020).',
        ],
        detalle: [
          'La pregabalina se usa fuera de indicación para el insomnio, con controversia sobre su eficacia (Cross 2024). La guía EULAR de fibromialgia, citada en ese capítulo, la considera más adecuada cuando coinciden dolor intenso y trastorno del sueño (Cross 2024).',
          'La Academia Americana de Medicina del Sueño sugiere la gabapentina para el síndrome de piernas inquietas moderado o grave (Yasaei 2024). En la fibromialgia, un metaanálisis de 8 estudios vio que la pregabalina mejora algo la calidad del sueño (diferencia estandarizada −0,35), y concluye que los fármacos no deberían ser la primera opción para dormir mejor en la fibromialgia (Pathak 2025). Las fuentes leídas no estudian su efecto sobre el sueño en otros dolores musculoesqueléticos.',
        ],
      },
      consultar: {
        texto: [
          'Urgente: angioedema, anafilaxia, erupción grave (síndrome de Stevens-Johnson) o hipersensibilidad multiorgánica, que exigen valoración médica inmediata (Yasaei 2024). Confusión, agitación o disminución de la conciencia pueden ser signos de sobredosis, más con otros depresores del sistema nervioso (Cross 2024). Respiración lenta o dificultad para respirar con opioides (Yasaei 2024). Depresión nueva o que empeora, o ideas de suicidio (Cross 2024). Temblor, alteración mental o dificultad respiratoria en quien tiene enfermedad renal o está en diálisis (Yasaei 2024).',
          'Combinaciones que hay que comentar con quien prescribe: opioides (depresión respiratoria y sedación, a veces mortales; Yasaei 2024), benzodiacepinas y alcohol (efecto sinérgico; Cross 2024) y gabapentina con pregabalina a la vez, que está contraindicada (Yasaei 2024). Los criterios de Beers de 2019 recomiendan evitar la combinación con opioides por el riesgo de depresión respiratoria (Hahn 2022).',
          'Pronto: mareo, somnolencia o inestabilidad al caminar nuevos o que empeoran; en la estenosis lumbar, la mayoría de quienes los tuvieron abandonó el tratamiento (Martínez 2023). Dolor o debilidad muscular sin explicar, edema o aumento de peso nuevos (Cross 2024). Síntomas de retirada (Cross 2024). Sacudidas musculares bruscas nuevas o caídas sin explicación (Rissardo 2023).',
          'El uso indebido es más probable en personas con trastorno por uso de opioides o antecedentes de abuso de sustancias (McAnally 2020; Cross 2024): coméntalo con quien los prescribe.',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: la retirada brusca puede dar síntomas y crisis de retirada, y se hace de forma gradual con quien los prescribe (Yasaei 2024; Cross 2024). Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinados con opioides, un metaanálisis encontró más mareo (OR 3,26), disfunción cognitiva (OR 3,13) y depresión respiratoria (OR 1,71) en los estudios no aleatorizados, pero ninguna diferencia en depresión respiratoria en los ensayos aleatorizados; con más de 1 dosis diaria definida, la mortalidad ajustada fue mayor (OR 2,76). Los gabapentinoides reducen además la respuesta al CO2 del centro respiratorio bulbar (Hahn 2022).',
        ],
      },
    },
    fuentes: ['Giménez-Campos 2021', 'Meaadi 2023', 'Martínez 2023', 'McAnally 2020', 'Hahn 2022', 'Carvalho 2022', 'Yasaei 2024', 'Cross 2024', 'Enke 2018', 'Akin 2022', 'Rissardo 2023', 'Rissardo 2025', 'Leung 2024', 'Moon 2026', 'Scott 2024', 'Yuen 2026', 'Pathak 2025'],
  },
  // Antidepresivos (2026-10): nueve fuentes enteras en PMC, siete capítulos de
  // StatPearls y dos revisiones Cochrane (PDF del usuario). Huecos cerrados
  // (2026-10) con diez fuentes de PMC (Ferreira 2023, Birkinshaw 2023, Moore
  // 2019 y otras): comparación entre dolores, amitriptilina en la fibromialgia,
  // caídas y ortostatismo con IRSN, calor, conducción, hueso y sangrado
  // quirúrgico. Sin fuente leída para la inflamación y la curación de partes
  // blandas, si enmascaran signos ni la terapia manual: docs/farmacologia.md.
  {
    id: 'antidepresivos',
    nombre: 'Antidepresivos (ISRS, IRSN, tricíclicos)',
    ejemplos: 'Sertralina, escitalopram, duloxetina, venlafaxina, amitriptilina',
    cima: ['sertralina', 'escitalopram', 'duloxetina', 'venlafaxina', 'amitriptilina'],
    apartados: {
      dolor: {
        texto: [
          'Lumbalgia inespecífica: los IRSN (duloxetina) probablemente tienen un efecto pequeño en el dolor (5,25 puntos menos sobre 100) y trivial en la discapacidad (0,91 puntos menos sobre 24) a corto plazo; los tricíclicos probablemente apenas cambian el dolor, con un efecto pequeño en la discapacidad (1,76 puntos menos sobre 24), y para los ISRS la evidencia es insuficiente. No hay datos de más de 12 meses, y los resultados quizá no valgan para mayores ni para quien tiene otras enfermedades importantes, porque solían excluirse de los ensayos (Ferraro 2025).',
          'Fibromialgia: con duloxetina o milnaciprán, el 31 % logró al menos un 50 % de alivio frente al 21 % con placebo (NNT 11), una diferencia que la revisión no considera clínicamente relevante; sí lo es la del alivio de al menos un 30 % (NNT 10). De media, sus posibles daños superan a sus beneficios, aunque una minoría mejora mucho sin efectos relevantes (Welsch 2018). Los tricíclicos son de segunda línea en la fibromialgia (Moraczewski 2023).',
          'Mayores de 65 años: en la artrosis de rodilla, la duloxetina dio un efecto muy pequeño (9,1 puntos menos sobre 100) que puede no compensar sus riesgos, y los autores no la ven adecuada como tratamiento único (Narayan 2024).',
          'Comparando entre dolores, una revisión de revisiones da evidencia de certeza moderada a los IRSN en la lumbalgia crónica, el dolor posoperatorio, la fibromialgia y el dolor neuropático, aunque el alivio frente al placebo fue menor de 10 puntos sobre 100; los ISRS no fueron eficaces en la lumbalgia ni en la fibromialgia, y los tricíclicos sí en el dolor neuropático y la cefalea tensional crónica, con certeza baja (Ferreira 2023).',
          'Las fuentes leídas no tratan su efecto sobre la inflamación ni sobre la curación del tendón o de las partes blandas, ni si enmascaran signos en la exploración.',
        ],
        detalle: [
          'Las guías de fibromialgia desaconsejan tratarla solo con fármacos y piden combinarlos con ejercicio aeróbico y terapias psicológicas; el ejercicio aeróbico sirve para la fatiga, en la que estos fármacos no ayudan (Welsch 2018).',
          'La duloxetina está aprobada para el dolor musculoesquelético crónico (lumbalgia crónica y dolor de la artrosis), la fibromialgia y el dolor neuropático diabético, con un máximo de 60 mg al día, y refuerza las vías descendentes que inhiben el dolor en la médula (Biswas 2026). La amitriptilina se usa fuera de indicación en el dolor crónico, empezando con 10–20 mg al día (Thour 2026).',
          'En un metaanálisis en red de 176 ensayos en dolor crónico, solo la duloxetina tuvo evidencia de certeza moderada: alivio de al menos un 50 % en el 44 % frente al 29 % con placebo; para la amitriptilina, la venlafaxina y otros no hubo evidencia de calidad alta, y la certeza sobre los daños fue muy baja para todos (Birkinshaw 2023).',
          'Amitriptilina en la fibromialgia: con 25–50 mg al día, el 36 % logró al menos un 50 % de alivio frente al 11 % con placebo, pero con evidencia de muy baja calidad que probablemente sobrestima el efecto; tuvo efectos adversos el 77 % frente al 47 %, sobre todo boca seca y somnolencia, que suelen ceder en 2–3 semanas (Moore 2019).',
          'Hueso: en una cohorte retrospectiva, quien tomaba ISRS tuvo algo más de seudoartrosis tras fijar con placa una fractura de húmero (7,1 % frente a 4,7 %), sin diferencias en fémur, tibia, clavícula ni en el húmero con clavo; los autores lo atribuyen probablemente a factores de confusión y no al fármaco (Ponna 2026).',
          'Plazos: los antidepresivos suelen empezar a hacer efecto en 2–4 semanas (Thour 2026). En la lumbalgia, los efectos se vieron con tratamientos de al menos 7 semanas, en personas con síntomas de 3 meses o más (Ferraro 2025).',
          'Ciática y dolor de pierna de origen vertebral: la evidencia viene de ensayos únicos y pequeños; el efecto de los IRSN es muy incierto y el de los tricíclicos quizá grande (un ensayo de 60 personas) (Ferraro 2025).',
        ],
      },
      visceral: {
        texto: [
          'Sangrado: aumentan su riesgo, sobre todo junto con AINE, antiagregantes o anticoagulantes (Biswas 2026; Singh y Saadabadi 2024). Con un ISRS además de un AINE, la hemorragia digestiva alta fue más probable que con el AINE solo (OR 1,75) (Alam 2022); con un anticoagulante, el sangrado grave (OR 1,39) (Nochaiwong 2022). Los ISRS se asocian a más sangrado que los tricíclicos (Wang 2018). Señales de hemorragia digestiva: vómitos con sangre o en posos de café, heces negras o sangre en las heces (Alam 2022).',
          'Hiponatremia (sodio bajo en sangre): en mayores que toman antidepresivos la tuvo alrededor del 8 %, más con IRSN (10 %) e ISRS (10 %) que con tricíclicos (3,5 %), y el riesgo es mayor en las 2–4 primeras semanas (Zhang 2026). También sube con diuréticos tiazídicos (Biswas 2026). La crónica da cansancio, problemas cognitivos, alteraciones de la marcha, caídas y fracturas; la aguda, náuseas, vómitos, cefalea, estupor o convulsiones (Filippatos 2017).',
          'Síndrome serotoninérgico: suele aparecer en las 6–24 horas siguientes a empezar o subir un fármaco serotoninérgico o añadir otro, con alteración mental (agitación), inestabilidad autonómica (taquicardia, tensión alta, sudoración, pupilas dilatadas, diarrea) y signos neuromusculares, más visibles en las piernas: hiperreflexia, clonus, temblor y rigidez (Simon 2024). Pueden desencadenarlo, entre otros, el tramadol, la metadona, el fentanilo, los triptanes y otros antidepresivos (Thour 2026; Biswas 2026). Con una dosis estable y bien tolerada es poco probable que aparezca de forma espontánea (Simon 2024).',
          'Tricíclicos (amitriptilina): boca seca, estreñimiento, visión borrosa, retención de orina, taquicardia, confusión y delirio; la amitriptilina es más sedante y anticolinérgica que otros tricíclicos (Thour 2026). Los ISRS apenas dan estos efectos (Chu y Wadhwa 2023).',
          'Corazón y tensión: la amitriptilina puede dar arritmias y prolongar el QT (Thour 2026), y con los tricíclicos la frecuencia cardíaca en reposo es más alta (Wang 2018). La venlafaxina y la duloxetina pueden subir la tensión arterial y la frecuencia cardíaca, que se vigilan durante el tratamiento (Singh y Saadabadi 2024; Biswas 2026).',
        ],
        detalle: [
          'Náuseas: el efecto más frecuente de la duloxetina, alrededor del 18 % (Biswas 2026); en la fibromialgia, el 32 % con IRSN frente al 14 % con placebo (Welsch 2018). La duloxetina y la venlafaxina también dan temblor (Biswas 2026; Singh y Saadabadi 2024).',
          'Sudoración excesiva en alrededor del 10 % con ISRS, y en proporción parecida con venlafaxina y tricíclicos. Los que actúan sobre la serotonina o la noradrenalina dan disfunción sexual. Los ISRS e IRSN se asociaron a pérdida de peso que desaparece pasados 4 meses; la amitriptilina hace ganar peso (Wang 2018).',
          'En la cirugía de artrodesis lumbar, quien tomaba ISRS perdió de media un 34 % más de sangre y necesitó más transfusiones; con IRSN no se vio (Schadler 2017).',
          'Hígado: la duloxetina se evita con consumo importante de alcohol o enfermedad hepática crónica (Biswas 2026).',
          'En los casos publicados de síndrome serotoninérgico, el tramadol, el fentanilo y la trazodona fueron los fármacos que más acompañaban al desencadenante; con prescripción habitual, el 36 % ingresó en la UCI y el 5 % murió (Blyzniuk 2026).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, ortostatismo y caídas: los tricíclicos se asociaron a mucha más hipotensión ortostática que el placebo (OR 6,30), y los ISRS no (Bhanu 2021). La amitriptilina da hipotensión ortostática, mareo y sedación (Thour 2026). La duloxetina puede dar hipotensión ortostática, caídas y síncope, sobre todo al empezar o al subir la dosis (Biswas 2026).',
          'Con venlafaxina, uno de cada cinco mayores sin hipotensión ortostática al empezar la tuvo durante el tratamiento, y quienes la tuvieron se cayeron más (Wathra 2020). En mayores de 60 años, la hipotensión al ponerse de pie fue más frecuente en los 28 primeros días tras empezar un antidepresivo (ISRS, IRR 4,22; duloxetina, venlafaxina o mirtazapina, 2,17; tricíclicos, 2,12), y con duloxetina, venlafaxina o mirtazapina no siguió elevada después (Bhanu 2025).',
          'Mayores: los criterios de Beers piden evitar la amitriptilina por sus efectos anticolinérgicos (Thour 2026), y la duloxetina si ya hubo caídas o fracturas, por la ataxia y la hipotensión ortostática (Biswas 2026). En los tricíclicos se pide vigilar las caídas y el deterioro cognitivo (Moraczewski 2023).',
          'Hueso: los tricíclicos aumentan el riesgo de fracturas (Thour 2026), y un metaanálisis asocia los ISRS a más fracturas de cadera, con más riesgo cuanto más largo es el uso (De Filippis 2022).',
          'Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.',
        ],
        detalle: [
          'La hipotensión ortostática es una bajada de al menos 20 mmHg de sistólica o 10 de diastólica en los 3 minutos siguientes a ponerse de pie, y afecta a entre el 30 y el 70 % de los mayores. Los datos de los tricíclicos son de dosis para la depresión; los autores creen que a dosis bajas también pueden perjudicar a los mayores y aconsejan medir la tensión al cambiar de postura (Bhanu 2021).',
          'Las fuentes no coinciden en las caídas: en mayores con depresión, tratarla con duloxetina o venlafaxina se asoció a menos caídas con lesión que no tratarla, lo que los autores relacionan con la propia depresión (Wang 2024). En los ensayos, con una edad media de 57 años, los ISRS no dieron más hipotensión ortostática (Bhanu 2021), y un estudio en mayores de 60 años lo explica por la edad (Bhanu 2025).',
          'Un estudio citado en una revisión encontró más caídas con la duloxetina (HR 1,6) y algo más con los tricíclicos (HR 1,2) (Narayan 2024).',
          'Calor: el síndrome serotoninérgico altera la regulación de la temperatura (Simon 2024) y la hiponatremia es más frecuente en verano (Filippatos 2017). En un metaanálisis, los antidepresivos estudiados (citalopram, paroxetina, bupropión, reboxetina) no cambiaron la temperatura central, sin datos de sudoración ni de la amitriptilina (Hospers 2024).',
          'Conducir: tomar antidepresivos se asoció a más accidentes de tráfico (OR 1,40), menos que la propia depresión (OR 1,90), y más en los 3–4 primeros meses de tratamiento (Hill 2017).',
          'Con la venlafaxina, el alcohol y otros sedantes aumentan la sedación (Singh y Saadabadi 2024).',
        ],
      },
      sueno: {
        texto: [
          'ISRS e IRSN pueden empeorar el sueño: en los ensayos, insomnio en el 17 % con ISRS frente al 9 % con placebo, y en el 13 % con IRSN frente al 7 %; también dan somnolencia de día (16 % y 10 %, frente a 8 % y 5 %). Retrasan y reducen el sueño REM (Wichniak 2017).',
          'Los tricíclicos sedantes acortan el tiempo en dormirse y mejoran la eficiencia del sueño (Wichniak 2017); como la amitriptilina da sedación, se toma preferiblemente al acostarse (Thour 2026).',
          'Estos efectos son más fuertes las primeras semanas, aunque en algunos persisten y empeoran el insomnio o dan somnolencia de día (Wichniak 2017). En la fibromialgia, duloxetina y milnaciprán no mejoraron los problemas de sueño más que el placebo (Welsch 2018).',
        ],
        detalle: [
          'ISRS, IRSN y tricíclicos pueden provocar o empeorar el bruxismo del sueño, y los ISRS y la venlafaxina, el síndrome de piernas inquietas (Wichniak 2017). La venlafaxina puede dar sueños anormales (Singh y Saadabadi 2024).',
        ],
      },
      consultar: {
        texto: [
          'Urgente: signos de síndrome serotoninérgico, sobre todo en las horas siguientes a empezar o subir un fármaco o añadir tramadol u otro serotoninérgico: agitación o confusión, sudoración, temblor, clonus, hiperreflexia, rigidez o fiebre (Simon 2024). Signos de sobredosis de tricíclicos: confusión o somnolencia, convulsiones, pulso rápido, tensión baja, boca seca y retención de orina; suelen aparecer en 2 horas y pueden empeorar muy deprisa (Waseem 2026). Ideas de suicidio o empeoramiento del ánimo, sobre todo en jóvenes de hasta 24–25 años (cada fuente da un límite) y en los primeros 1–2 meses o al cambiar la dosis (Thour 2026; Chu y Wadhwa 2023). Signos de hemorragia digestiva (Alam 2022).',
          'Pronto: mareo, inestabilidad o caídas nuevas, sobre todo al empezar o subir la dosis (Biswas 2026); cansancio, confusión o alteraciones de la marcha en un mayor, que pueden ser hiponatremia (Filippatos 2017; Zhang 2026); tensión alta en la consulta con venlafaxina o duloxetina (Singh y Saadabadi 2024; Biswas 2026); hematomas o sangrados poco habituales (Biswas 2026); picor, dolor en el hipocondrio derecho, orina oscura o ictericia con duloxetina, que piden valoración médica (Biswas 2026).',
          'Retirada: quizá la mitad de quienes los dejan nota síntomas, a veces graves y duraderos, como mareo, cefalea, sensaciones de descarga eléctrica que dificultan caminar y conducir, ataxia y caídas; el riesgo es mayor con duloxetina, venlafaxina y paroxetina, y pueden confundirse con otras enfermedades o con una recaída (Horowitz 2023). Tras dejar la duloxetina de golpe aparecen en cerca del 45 % (Biswas 2026).',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: se retiran de forma gradual (Thour 2026; Biswas 2026), con quien los prescribe. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: tramadol, metadona, fentanilo, meperidina y triptanes, por el síndrome serotoninérgico (Thour 2026; Biswas 2026), y AINE, antiagregantes o anticoagulantes, por el sangrado (Biswas 2026; Nochaiwong 2022).',
          'En la sobredosis de tricíclicos, quien no tiene síntomas a las 6 horas es poco probable que haya tomado una cantidad importante, y las arritmias causan la mayoría de las muertes (Waseem 2026). En sobredosis, los tricíclicos son mucho más mortales que los ISRS (Wang 2018).',
          'Tras 8 semanas de venlafaxina, el 14 % tuvo mareo al dejarla, y el 29 % tras 24 semanas. Haber tenido síntomas al olvidar dosis o en un intento anterior de dejarlos anticipa que volverán (Horowitz 2023).',
        ],
      },
    },
    fuentes: ['Ferraro 2025', 'Welsch 2018', 'Narayan 2024', 'Moraczewski 2023', 'Biswas 2026', 'Thour 2026', 'Alam 2022', 'Nochaiwong 2022', 'Wang 2018', 'Singh y Saadabadi 2024', 'Zhang 2026', 'Filippatos 2017', 'Simon 2024', 'Blyzniuk 2026', 'Chu y Wadhwa 2023', 'Bhanu 2021', 'De Filippis 2022', 'Wichniak 2017', 'Waseem 2026', 'Horowitz 2023', 'Ferreira 2023', 'Birkinshaw 2023', 'Moore 2019', 'Ponna 2026', 'Schadler 2017', 'Wathra 2020', 'Bhanu 2025', 'Wang 2024', 'Hospers 2024', 'Hill 2017'],
  },
  // Benzodiacepinas y relajantes musculares (2026-10): nueve fuentes enteras
  // en PMC y siete capítulos de StatPearls (PDF del usuario). Huecos cerrados
  // (2026-10) con Chou 2017, Holgado 2022, Iqbal 2026, Hansen 2015 y la nota de
  // la EMA (PDF del usuario) y Beers 2023, Messineo 2024, Bianconi 2024, Devi
  // 2026, Levati 2026, Van der Sluiszen 2019 y Suárez-Lledó 2018 (PMC):
  // lumbalgia y ciática, tiocolchicósido, ejercicio, conducción, apnea y
  // retirada del baclofeno y la tizanidina. Sin fuente leída para la
  // inflamación y la curación, si enmascaran signos ni la terapia manual:
  // docs/farmacologia.md.
  {
    id: 'sedantes',
    nombre: 'Benzodiacepinas y relajantes musculares',
    ejemplos: 'Diazepam, lorazepam, alprazolam, ciclobenzaprina, metocarbamol, tizanidina, baclofeno, tiocolchicósido',
    cima: ['diazepam', 'lorazepam', 'alprazolam', 'ciclobenzaprina', 'metocarbamol', 'tizanidina', 'baclofeno', 'tiocolchicósido'],
    apartados: {
      dolor: {
        texto: [
          'Lumbalgia inespecífica: los relajantes no benzodiacepínicos (ciclobenzaprina, metocarbamol, tizanidina y otros) redujeron el dolor 7,7 puntos sobre 100 en las 2 primeras semanas, con certeza muy baja y por debajo de los 10 puntos que los autores consideran clínicamente relevantes; el efecto desaparecía al dejar fuera los ensayos con alto riesgo de sesgo, y no hubo efecto a las 3–13 semanas ni en la discapacidad. Las benzodiacepinas (diazepam) no mejoraron el dolor; un único ensayo vio menos discapacidad a las 3–13 semanas. No hay ensayos a largo plazo (Cashin 2021).',
          'En la lumbalgia aguda, una revisión para la guía del ACP vio que los relajantes musculares alivian el dolor a corto plazo (2–7 días), con evidencia moderada, pero dan más sedación (RR 2,04); en la crónica la evidencia es insuficiente. En las benzodiacepinas la evidencia es insuficiente en la lumbalgia, y en la ciática aguda el diazepam no mejoró la función y dio menos alivio del dolor que el placebo a la semana, con certeza baja (Chou 2017).',
          'Tiocolchicósido: en la lumbalgia aguda, el efecto fue muy pequeño (menos de 1 punto sobre 10 a los 5–7 días), por debajo de lo que el paciente nota y con evidencia de muy baja certeza; en gel no superó al placebo (Bianconi 2024). Por boca o inyectado, la EMA lo restringió en 2013 a un complemento de corta duración para las contracturas dolorosas de origen vertebral desde los 16 años, con un máximo de 8 mg cada 12 h durante 7 días por boca o 4 mg cada 12 h durante 5 días inyectado, y no para problemas crónicos (EMA 2014).',
          'En la lumbalgia aguda, las guías ponen primero los tratamientos no farmacológicos, y por su evolución favorable los autores piden prudencia con los analgésicos (Wewege 2023). En el dolor crónico, el uso prolongado mostró beneficio sobre todo en espasmos, calambres dolorosos y dolor cervical; en lumbalgia y fibromialgia, en conjunto, no (Oldfield 2024).',
          'La ciclobenzaprina está aprobada como complemento del reposo y la fisioterapia en el espasmo muscular agudo, solo 2–3 semanas, y no sirve para la espasticidad (Khan y Kahwaji 2023); el metocarbamol tampoco (Sibrack 2024). La tizanidina y el baclofeno se indican para la espasticidad de origen neurológico; el uso del baclofeno en la lumbalgia es limitado (Ghanavatian y Derian 2023; Ghanavatian y Derian 2024).',
          'Las fuentes leídas no tratan su efecto sobre la inflamación ni sobre la curación de los tejidos, ni si enmascaran signos en la exploración.',
        ],
        detalle: [
          'En el metaanálisis en red de la lumbalgia aguda, los relajantes no benzodiacepínicos redujeron el dolor 14,3 puntos sobre 100 frente a placebo, con confianza muy baja (Wewege 2023).',
          'No hay pruebas de alta calidad de que el metocarbamol sea mejor que un AINE, y añadirlo al naproxeno no mejoró los resultados a la semana en un ensayo pequeño (Sibrack 2024). Tras la cirugía, el efecto analgésico de los relajantes musculares es inconstante (Farishta 2024).',
          'Las fuentes no coinciden en la certeza del alivio de los relajantes en la lumbalgia aguda: moderada según Chou 2017 y muy baja según una revisión posterior, en la que el efecto desaparecía al dejar fuera los ensayos con alto riesgo de sesgo (Cashin 2021).',
          'En la fibromialgia, el dolor volvió a subir una semana después de dejar la tizanidina en un estudio (Oldfield 2024).',
        ],
      },
      visceral: {
        texto: [
          'Respiración: con una benzodiacepina sola la depresión respiratoria es poco frecuente, pero el riesgo sube mucho con alcohol, opioides u otros sedantes (Kang 2023); la advertencia de la FDA dice que con opioides pueden causar sedación, depresión respiratoria grave, coma y muerte (Bounds y Patel 2024). En 2021, casi el 88 % de las muertes por sobredosis con benzodiacepinas en EE. UU. implicaban también opioides, y su sedación se suma a la de antihistamínicos, antipsicóticos y gabapentinoides (Brunner 2025). Los relajantes musculares junto con opioides también aumentan el riesgo de sobredosis (Oldfield 2024; Farishta 2024).',
          'Cognición: dan déficits de memoria, aprendizaje y atención y empeoran el delirium en mayores (Capiau 2023), además de amnesia anterógrada y alteración psicomotora; entre el 1 y el 20 % de quienes las toman tiene conductas agresivas (Edinoff 2021). Tras la cirugía, los relajantes musculares duplicaron el delirium en mayores (Farishta 2024).',
          'Tizanidina: hipotensión y bradicardia, a veces graves, y casos de daño hepático grave e insuficiencia hepática, por lo que se controla la función hepática; no se combina con ciprofloxacino ni fluvoxamina, por hipotensión importante y más alteración psicomotora (Ghanavatian y Derian 2023).',
          'Ciclobenzaprina: es de la familia de los tricíclicos y da somnolencia, boca seca, mareo, confusión, taquicardia y retención de orina; con otros serotoninérgicos, como la duloxetina, se han descrito casos de síndrome serotoninérgico (Khan y Kahwaji 2023).',
          'Tiocolchicósido: un metabolito puede alterar el número de cromosomas de las células que se dividen, lo que puede dañar al feto y reducir la fertilidad masculina; por eso está contraindicado en el embarazo, la lactancia y en mujeres que puedan quedarse embarazadas sin anticoncepción (EMA 2014). También puede dar convulsiones, diarrea, molestias de estómago y reacciones alérgicas, y está contraindicado si ha tenido convulsiones (Devi 2026).',
          'Baclofeno: se elimina por el riñón; con la función renal reducida se acumula, con riesgo de encefalopatía, y con un filtrado de 30 o menos se aconseja evitarlo (Ghanavatian y Derian 2024; Kershner 2026).',
        ],
        detalle: [
          'Los relajantes no benzodiacepínicos aumentaron los efectos adversos (RR 1,6), sobre todo mareo, somnolencia, cefalea y náuseas (Cashin 2021).',
          'Todos los relajantes musculares tienen efectos anticolinérgicos que favorecen la sedación, las caídas y la confusión en mayores. El metocarbamol puede cambiar el color de la orina, sin importancia clínica (Sibrack 2024).',
          'Intoxicación por baclofeno: sobre todo depresión del sistema nervioso, convulsiones y depresión respiratoria, más con 300 mg o más; también bradicardia, hipotensión e hipotonía. Con la función renal alterada o en mayores puede aparecer con dosis habituales (Iqbal 2026).',
          'Las benzodiacepinas se asocian a hipotensión ortostática en mayores, por una caída de la tensión más acusada en los primeros 10 segundos al ponerse de pie (Capiau 2023; Brunner 2025).',
        ],
      },
      ejercicio: {
        texto: [
          'Caídas y fracturas: las benzodiacepinas aumentan las caídas (OR 1,39–1,57) y se asocian con fuerza a la fractura de cadera; los hipnóticos Z, como el zolpidem, también aumentan las fracturas (OR 1,63). El riesgo es mayor las primeras semanas tras empezar y con el uso prolongado, por sedación, hipotensión ortostática, mareo, debilidad muscular, ataxia y problemas visuales (Capiau 2023). En mayores con insomnio, multiplicaron por 2,6 los efectos psicomotores, como caídas y accidentes de tráfico (Brunner 2025).',
          'Equilibrio: el efecto depende de la dosis y es máximo en las primeras horas tras la toma; es mayor con dosis altas, con poco tiempo entre la toma y el despertar o con alcohol u otros sedantes, y la inestabilidad es más marcada en mayores (Capiau 2023).',
          'Rendimiento: en adultos sanos y activos, las benzodiacepinas no cambiaron la fuerza ni la resistencia, y una dosis de lorazepam solo bajó la potencia máxima de un esfuerzo anaeróbico breve; son 10 estudios pequeños, con las pruebas hechas entre 3 y 16 h después de la toma y sin medir el equilibrio (Holgado 2022). En un análisis secundario de un ensayo con mayores con peor función física, el programa de actividad física protegió de la pérdida de movilidad a quienes no tomaban benzodiacepinas, pero no a quienes las tomaban; en el conjunto de participantes la diferencia no fue significativa (Levati 2026).',
          'Relajantes musculares en mayores: los criterios de Beers piden evitarlos por caídas, fracturas y alteración cognitiva o psicomotora (Sibrack 2024). Con baclofeno hubo más caídas que con tizanidina (SHR 1,68) y parecidas a las de la ciclobenzaprina (Hwang 2024). El baclofeno da debilidad muscular, y su intoxicación, hipotonía (Ghanavatian y Derian 2024; Kershner 2026).',
          'Conducir: con baclofeno se pide no conducir ni manejar maquinaria por la sedación (Ghanavatian y Derian 2024), y las benzodiacepinas de acción larga se asocian a más accidentes de tráfico (Capiau 2023). Al empezar un hipnótico, el riesgo de accidente subió (zolpidem, HR 2,20; trazodona, 1,91; temazepam, 1,27, no significativo), comparable a una alcoholemia de 0,06–0,11 %, y seguía alto tras un año (Hansen 2015). En una prueba en carretera, quienes tomaban hipnóticos se desviaron más del carril, salvo quienes los tomaban desde hacía 3 años o más, y con ansiolíticos la diferencia no fue significativa (Van der Sluiszen 2019).',
          'Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.',
        ],
        detalle: [
          'En mayores hospitalizados, las dosis de más de 1 mg/día equivalente de diazepam se asociaron a caídas, y quienes tomaban diazepam, de acción larga, tenían más de tres veces más caídas en 90 días que quienes no tomaban benzodiacepinas (Capiau 2023). El aumento de caídas con lesión es significativo sobre todo por encima de los 80 años (Edinoff 2021).',
          'Con la tizanidina se miden la tensión y la frecuencia cardíaca antes de subir la dosis, por el riesgo de hipotensión grave (Ghanavatian y Derian 2023). El metocarbamol empieza a actuar a los 30 minutos y llega a su máximo a las 2 horas (Sibrack 2024).',
          'Los criterios de Beers 2023 piden evitar en mayores las benzodiacepinas, los hipnóticos Z y los relajantes como la ciclobenzaprina y el metocarbamol (evidencia moderada, recomendación fuerte); el baclofeno y la tizanidina no entran en ese criterio, aunque también tienen efectos adversos importantes, y el baclofeno se evita con un filtrado renal por debajo de 60 (AGS 2023).',
          'Durante una retirada pautada de benzodiacepinas, la guía aconseja actividad física adaptada a la capacidad (Brunner 2025).',
        ],
      },
      sueno: {
        texto: [
          'Las benzodiacepinas mejoran poco el sueño (se duerme antes, más tiempo y con menos despertares), pero el efecto se pierde en días o semanas mientras los riesgos siguen; se aconseja no pasar de 4 semanas (Brunner 2025).',
          'Las de acción larga dan resaca al día siguiente, confusión, mareo y torpeza motora, y la inercia al despertar puede aumentar el riesgo de caídas (Capiau 2023).',
          'En el insomnio crónico, el tratamiento inicial recomendado es la terapia cognitivo-conductual (Capiau 2023; Bounds y Patel 2024).',
          'Apnea del sueño: en un metaanálisis en red, las benzodiacepinas bajaron la saturación media durante el sueño, aunque no empeoraron el índice de apneas; los autores piden mucha cautela en quien tiene apnea (Kishi 2026). Tras la cirugía, los relajantes musculares también piden cautela con apnea del sueño (Farishta 2024).',
        ],
        detalle: [
          'Al reducir la dosis puede empeorar el insomnio, y por eso la reducción es gradual (Capiau 2023). Quien tomaba dosis altas puede dormir menos al bajarlas sin que sea insomnio: puede ser el fin de una sedación excesiva (Brunner 2025).',
          'Otro metaanálisis no encontró que los hipnóticos empeoraran la apnea ni la saturación mínima, aunque solo dos estudios eran de benzodiacepinas y todos de corta duración (Messineo 2024).',
          'La ciclobenzaprina puede ayudar al insomnio asociado a la fibromialgia (Khan y Kahwaji 2023) y mejoró los trastornos del sueño en tres estudios (Oldfield 2024).',
        ],
      },
      consultar: {
        texto: [
          'Urgente: sedación extrema, habla arrastrada, ataxia, respiración lenta o superficial o no responder, sobre todo si ha tomado además alcohol u opioides (Bounds y Patel 2024; Kang 2023). Con baclofeno, confusión, depresión respiratoria, convulsiones o parálisis piden atención médica inmediata, igual que las ideas de autolesión o suicidio (Kershner 2026). Signos de síndrome serotoninérgico con ciclobenzaprina y otro serotoninérgico (Khan y Kahwaji 2023). Con baclofeno por boca, alucinaciones, confusión, fiebre o más espasticidad en los días siguientes a dejarlo o quedarse sin él (Iqbal 2026).',
          'Retirada: no se dejan de golpe. Con benzodiacepinas, una reducción rápida puede dar convulsiones y delirium potencialmente mortales (Brunner 2025); otros síntomas son irritabilidad, inquietud, sudoración, cefalea, calambres musculares y molestias digestivas (Capiau 2023), y también dolor o rigidez de cabeza y cuello, sensaciones extrañas en las extremidades, debilidad, hormigueos y contracciones musculares (Edinoff 2021). Los síntomas de retirada a menudo se atribuyen a la enfermedad de base o a otra (Brunner 2025). Con baclofeno oral, la retirada brusca puede dar convulsiones y alucinaciones (Ghanavatian y Derian 2024); con tizanidina, taquicardia, tensión alta de rebote y más espasticidad (Ghanavatian y Derian 2023).',
          'Pronto: mareo, inestabilidad, caídas o somnolencia de día nuevos, o confusión en un mayor (Capiau 2023); con tizanidina, mareo, pulso lento o tensión baja (Ghanavatian y Derian 2023); con baclofeno, somnolencia o confusión si tiene enfermedad renal, que aumenta el riesgo de intoxicación (Kershner 2026).',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: la retirada es gradual (Brunner 2025; Kershner 2026), con quien los prescribe. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: opioides, alcohol y otros sedantes con cualquiera de ellos (Bounds y Patel 2024; Ghanavatian y Derian 2024); tizanidina con ciprofloxacino o fluvoxamina (Ghanavatian y Derian 2023); ciclobenzaprina con otros serotoninérgicos (Khan y Kahwaji 2023). La guía de retirada recomienda ofrecer naloxona a quien toma a la vez benzodiacepinas y opioides (Brunner 2025).',
          'La dependencia física es una consecuencia esperable del uso continuado y no equivale a un trastorno por uso, que solo cumple el 1,5 %. El riesgo de síntomas de retirada es bajo con menos de 1 mes de uso y aparece con tomas de 4 o más días por semana durante 1–3 meses o más; con el alprazolam la dependencia llega antes. Algunos síntomas pueden durar meses o años (Brunner 2025).',
          'Retirada del baclofeno por boca: suele aparecer 1–4 días tras dejarlo de golpe (entre 12 h y 7 días), sobre todo con alucinaciones, confusión, agitación, más espasticidad, rigidez y fiebre; casi siempre fue sin querer, por ejemplo al quedarse sin el fármaco (Iqbal 2026). La de la tizanidina da tensión alta, taquicardia, más tono muscular y ansiedad, y en un caso empezó 12 h después de la última dosis (Suárez-Lledó 2018).',
          'Al reducir la dosis se vigilan el mareo, la sedación, las caídas, la ansiedad, el insomnio y la agitación (Capiau 2023). La sobredosis de baclofeno puede dar un coma de hasta 7 días (Ghanavatian y Derian 2024).',
        ],
      },
    },
    fuentes: ['Cashin 2021', 'Wewege 2023', 'Oldfield 2024', 'Khan y Kahwaji 2023', 'Sibrack 2024', 'Ghanavatian y Derian 2023', 'Ghanavatian y Derian 2024', 'Farishta 2024', 'Kang 2023', 'Bounds y Patel 2024', 'Brunner 2025', 'Capiau 2023', 'Edinoff 2021', 'Kershner 2026', 'Hwang 2024', 'Kishi 2026', 'Chou 2017', 'Bianconi 2024', 'EMA 2014', 'Devi 2026', 'Iqbal 2026', 'Holgado 2022', 'Levati 2026', 'Hansen 2015', 'Van der Sluiszen 2019', 'AGS 2023', 'Messineo 2024', 'Suárez-Lledó 2018'],
  },
  // Estatinas (2026-10): siete fuentes enteras en PMC y cuatro capítulos de
  // StatPearls (PDF del usuario). Vaezi 2025 se leyó y no se cita (cifras de
  // pacientes contradictorias). Sin fuente leída para hueso y fracturas,
  // enmascaramiento de signos, adaptaciones al entrenamiento, caídas ni
  // terapia manual: docs/farmacologia.md.
  {
    id: 'estatinas',
    nombre: 'Estatinas',
    ejemplos: 'Atorvastatina, simvastatina, rosuvastatina',
    cima: ['atorvastatina', 'simvastatina', 'rosuvastatina'],
    apartados: {
      dolor: {
        texto: [
          'Síntomas musculares: dolor, rigidez, sensibilidad o calambres, en general simétricos y proximales, en grupos musculares grandes (muslos, glúteos, pantorrillas, espalda) y casi siempre sin subida de la CK. Suelen aparecer en las 4–6 primeras semanas, aunque pueden hacerlo tras años, y también al subir la dosis o al añadir un fármaco que interactúa (Stroes 2015).',
          'En los ensayos ciegos, el 27,1 % con estatina y el 26,6 % con placebo refirieron dolor o debilidad muscular; el exceso se concentró en el primer año (RR 1,07) y después desapareció. En ese primer año solo 1 de cada 15 quejas musculares se debía a la estatina: en más del 90 % de quienes las refieren, la causa es otra (CTT 2022). Influye el efecto nocebo: las expectativas negativas hacen que se refieran más efectos adversos de lo esperable (Mach 2018); en un ensayo, los síntomas fueron parecidos con comprimidos de estatina y de placebo, y mucho mayores que sin comprimido (Epelde 2026).',
          'Para distinguirlo de un dolor musculoesquelético: sugieren la estatina los síntomas que empiezan poco después de iniciarla o subir la dosis, mejoran al retirarla y vuelven al reintroducirla; sugieren otra causa los asimétricos, focales o que no cambian al retirarla. La artrosis, la polimialgia reumática, el hipotiroidismo, el déficit de vitamina D y el ejercicio intenso son causas frecuentes (Epelde 2026; Stroes 2015).',
          'Tendón: se han asociado a tendinopatía y rotura, sobre todo del Aquiles, el cuádriceps y el bíceps distal, más en el primer año, sin que la relación esté confirmada; en el manguito rotador, los estudios observacionales sugieren menos enfermedad y menos rerroturas tras la reparación (Yang y Qu 2018). Una revisión sistemática de 4 estudios no encontró relación entre las estatinas y la rotura tendinosa en el conjunto de los pacientes, salvo más roturas con atorvastatina en un subgrupo, y los autores concluyen que la evidencia de causalidad es escasa (Teichtahl 2016).',
          'Las fuentes no coinciden en la tendinopatía: en una cohorte coreana fue más frecuente con estatinas (HR 1,4), sobre todo al principio del tratamiento (Kwak 2023); un estudio genético no encontró que causaran tendinopatía del Aquiles (Zhou 2025).',
          'Hueso: en un metaanálisis de ensayos aleatorizados, las estatinas aumentaron un poco la densidad ósea sin cambiar el riesgo de fractura (Wang 2016). Las fuentes leídas no tratan si enmascaran signos en la exploración.',
        ],
        detalle: [
          'Sus efectos antiinflamatorios descritos se refieren a la pared de los vasos y la placa de ateroma (Sizar 2024); las fuentes leídas no los relacionan con el dolor musculoesquelético ni con la curación de los tejidos.',
          'Cuando se midió en los ensayos, la CK era menor de 3 veces el límite superior en el 96,7 % de las quejas musculares. El exceso de síntomas es algo mayor con pautas intensivas (RR 1,08) y, con dosis bajas o moderadas, en mujeres (CTT 2022).',
          'Factores de riesgo de síntomas musculares: más de 80 años, ser mujer, poco peso, infección aguda, hipotiroidismo sin tratar, enfermedad renal o hepática, diabetes, déficit de vitamina D, dolor muscular, articular o tendinoso previo sin explicar, mucha actividad física, alcohol en exceso y mucho zumo de pomelo o arándano (Stroes 2015).',
          'Decir al paciente que su dolor no es real es un error; explicarle que puede ser real pero no deberse a la estatina es exacto y terapéutico (Epelde 2026).',
        ],
      },
      visceral: {
        texto: [
          'Rabdomiólisis: rara, alrededor de 1 caso por 100 000 personas al año (Stroes 2015). Es una destrucción muscular con dolor intenso, debilidad y orina oscura que puede dañar el riñón (Sizar 2024); la tríada completa aparece en menos de la mitad de los casos, y el dolor muscular, el síntoma más frecuente, en alrededor del 50 % (Rout 2025).',
          'Miopatía necrotizante inmunomediada: rara, con debilidad proximal y simétrica y CK alta que persisten o empeoran meses después de retirar la estatina (Sizar 2024; Epelde 2026).',
          'Hígado y glucosa: las transaminasas suben levemente en el 0,5–2 %, sobre todo en los 3 primeros meses; la diabetes de nueva aparición aumenta en alrededor de 1 caso por 1000 pacientes al año, más con prediabetes o síndrome metabólico. No afectan a la cognición ni a la función renal (Mach 2018).',
          'Neuropatía periférica: el riesgo descrito es bajo, alrededor de 12 casos por 100 000 personas al año, con entumecimiento, hormigueo, dolor o temblor en manos o pies e inestabilidad al caminar, y no hay pruebas concluyentes de que la cause la estatina (Attardo 2022). En los ensayos ciegos, las estatinas no se asociaron a la neuropatía periférica ni a la mayoría de los efectos de sus prospectos (CTT 2026).',
          'Otros efectos frecuentes: molestias digestivas, dolor articular y en las extremidades (McIver y Siddique 2025), cefalea y estreñimiento (Talreja y Cassagnol 2023).',
        ],
        detalle: [
          'La CK sube en las 2–12 horas siguientes a una lesión muscular, llega al máximo en 1–5 días y baja a partir de los 3–5 días si no hay más lesión. La ALT y la AST también salen del músculo, así que pueden subir sin daño hepático (Rout 2025).',
          'Con la simvastatina se ha descrito síndrome compartimental en las piernas (Talreja y Cassagnol 2023).',
          'La miopatía necrotizante se debe a anticuerpos contra la HMG-CoA reductasa y necesita tratamiento inmunosupresor (Sizar 2024).',
        ],
      },
      ejercicio: {
        texto: [
          'Los síntomas musculares parecen más frecuentes en personas físicamente activas (Stroes 2015). En ensayos con ejercicio, los tuvieron el 9 % con estatina y el 4 % con placebo, sin diferencias en el consumo máximo de oxígeno ni en la CK tras el ejercicio, que subía algo con y sin estatina; los resultados valen para personas con bajo riesgo de síntomas (Mangone 2024).',
          'Al empezar un programa de ejercicio, las molestias pueden deberse al propio ejercicio y no a la estatina, y llevar a dejarla por error; ese pequeño aumento de riesgo no es motivo para abandonar el ejercicio ni la estatina sin valoración médica (Mangone 2024). Desaconsejar el ejercicio por tomar estatina puede aumentar el riesgo cardiovascular: el ejercicio moderado no debe desaconsejarse, mientras que el esfuerzo intenso y no habitual puede subir la CK e interactuar con la estatina (Epelde 2026).',
          'Rabdomiólisis por esfuerzo: el ejercicio extenuante, sobre todo sin entrenamiento, levantar mucho peso o hacerlo con mucho calor, y la deshidratación pueden causarla, igual que la inmovilización prolongada (Rout 2025). La guía de la NLA, citada en un capítulo, cuenta evitar el ejercicio extenuante entre los factores modificables de intolerancia (Sizar 2024).',
          'Mayores: por encima de 65 años la concentración de atorvastatina es mayor y el riesgo de miopatía también (McIver y Siddique 2025). Las fuentes leídas no tratan la terapia manual ni las caídas.',
          'Entrenamiento: una revisión sistemática no encontró pruebas consistentes de que las estatinas frenen la mejora con el entrenamiento, aunque solo dos estudios lo midieron (Noyes 2017). En uno, con simvastatina, el consumo máximo de oxígeno subió un 10 % con el ejercicio solo y un 1,5 % con la estatina (Noyes 2017); en otro, en mayores, la mejora del consumo pico tras 12 semanas de caminar en cinta fue parecida con y sin estatina (Slade 2021).',
          'Corredores: en una carrera de 15 km, quienes tomaban estatinas no tuvieron más lesiones musculares, tendinosas ni ligamentosas que el resto (Bakker 2017). Tras un maratón, la CK salió más alta en quienes las tomaban (Noyes 2017).',
        ],
        detalle: [
          'En mayores de más de 55 años, la actividad física bajó con atorvastatina en un ensayo, aunque en el conjunto no hubo diferencias con el placebo; la revisión que lo recoge señala que es el grupo más vulnerable a los efectos musculares (Noyes 2017).',
          'Varios estudios pequeños sugieren alteraciones de la función mitocondrial durante el ejercicio con estatinas, con una recuperación más lenta tras el esfuerzo incluso sin síntomas (Stroes 2015).',
          'Tras una rabdomiólisis, muchas personas necesitan rehabilitación o fisioterapia para recuperar la masa muscular y la función; puede llevar meses, y algunas tienen dolor residual durante años (Rout 2025).',
          'Las personas con rasgo falciforme tienen más riesgo de rabdomiólisis, y se piden precauciones en el deporte y el esfuerzo físico (Rout 2025).',
          'El panel de la EAS no recomienda la coenzima Q10 ni la vitamina D para prevenir los síntomas musculares (Stroes 2015); un capítulo de StatPearls cita, en cambio, un metaanálisis en que la coenzima Q10 los redujo (Sizar 2024).',
        ],
      },
      sueno: {
        texto: [
          'En un metaanálisis de ensayos con polisomnografía, las estatinas no empeoraron la duración ni la eficiencia del sueño, y redujeron algo el tiempo despierto y los despertares; los ensayos eran pocos, pequeños, de 1992–1994 y sin atorvastatina ni rosuvastatina. Los datos de farmacovigilancia que cita asocian alteraciones del sueño a la simvastatina, la rosuvastatina y la lovastatina (Broncel 2015).',
          'El insomnio figura entre los efectos frecuentes de la atorvastatina (McIver y Siddique 2025) y entre los que estudios observacionales atribuyen a las estatinas (Stroes 2015).',
          'La simvastatina y la pravastatina se toman por la noche, por eficacia; la atorvastatina y la rosuvastatina, a cualquier hora pero siempre a la misma (Sizar 2024). Las fuentes leídas no tratan los calambres nocturnos.',
        ],
        detalle: [
          'El insomnio puede deberse a la enfermedad de base más que al fármaco (Broncel 2015).',
        ],
      },
      consultar: {
        texto: [
          'Urgente: debilidad objetiva, orina oscura, malestar general o síntomas que empeoran tras retirar la estatina, que piden descartar una rabdomiólisis o una miopatía necrotizante (Epelde 2026), y dolor muscular intenso con debilidad (Stroes 2015), más aún tras un esfuerzo intenso, una de sus causas (Rout 2025).',
          'Pronto: dolor o debilidad muscular nuevos sin explicación (McIver y Siddique 2025); cansancio inhabitual, pérdida de apetito, dolor abdominal, orina oscura o piel amarilla, que pueden ser lesión hepática (Mach 2018).',
          'Ante molestias musculares leves, lo más probable es que no se deban a la estatina, y se mantiene mientras se buscan otras causas (CTT 2022). Si aparecen síntomas, el paciente debe consultar a quien la prescribe en lugar de dejarla, y la mayoría tolera después una pauta modificada (Epelde 2026).',
          'Nunca aconsejes dejarla ni bajar la dosis por tu cuenta: la pausa, el cambio de dosis o de estatina los decide quien la prescribe (McIver y Siddique 2025; Epelde 2026). Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: la simvastatina y la atorvastatina con claritromicina, eritromicina, antifúngicos azólicos, diltiazem, verapamilo o amiodarona, y cualquier estatina con gemfibrozilo, ciclosporina, colchicina o zumo de pomelo aumentan el riesgo muscular (Sizar 2024; Talreja y Cassagnol 2023; McIver y Siddique 2025).',
          'La CK no se mide de rutina (Stroes 2015). Con síntomas, una CK de más de 4 veces el límite superior indica lesión relevante, y por encima de 10 veces o si persiste pide una valoración urgente (Epelde 2026).',
          'En ensayos n de 1 con atorvastatina, los síntomas musculares (dolor, debilidad, sensibilidad, rigidez o calambres) no fueron distintos con la estatina y con el placebo, y dos de cada tres participantes decidieron seguir o volver a tomarla (Herrett 2021).',
          'Si la rabdomiólisis se detecta pronto, el daño renal suele tener buen pronóstico; en hospitalizados con lesión renal, la mortalidad es del 30–50 % (Rout 2025).',
        ],
      },
    },
    fuentes: ['Stroes 2015', 'CTT 2022', 'Mach 2018', 'Epelde 2026', 'Yang y Qu 2018', 'Sizar 2024', 'Rout 2025', 'McIver y Siddique 2025', 'Talreja y Cassagnol 2023', 'Mangone 2024', 'Broncel 2015', 'Teichtahl 2016', 'Kwak 2023', 'Zhou 2025', 'Wang 2016', 'Noyes 2017', 'Slade 2021', 'Bakker 2017', 'Attardo 2022', 'CTT 2026', 'Herrett 2021'],
  },
  // Fluoroquinolonas (2026-10): ocho fuentes en PMC (Michalak 2017 y Kuula
  // 2019 se leyeron y no se citan) y siete PDF del usuario (StatPearls de los
  // tres fármacos y de la disección de aorta, Lewis y Cook 2014, EMA 2018,
  // AEMPS 2023). Sin fuente leída para el enmascaramiento de signos, la
  // terapia manual, la carga del tendón sin síntomas ni los signos de la
  // hipoglucemia: docs/farmacologia.md.
  {
    id: 'fluoroquinolonas',
    nombre: 'Fluoroquinolonas',
    ejemplos: 'Ciprofloxacino, levofloxacino, moxifloxacino',
    cima: ['ciprofloxacino', 'levofloxacino', 'moxifloxacino'],
    apartados: {
      dolor: {
        texto: [
          'Tendón: aumentan de 2 a 4 veces el riesgo de tendinopatía aguda y de rotura (Baggio y Ananda-Rajah 2021). En un metaanálisis, la incidencia fue del 0,96 % con fluoroquinolonas frente al 0,15 % sin ellas, y del 0,17 % tanto con levofloxacino como con ciprofloxacino (Sangiorgio 2024). El Aquiles es el más afectado, en torno al 90 % de los casos, pero se han descrito también el rotuliano, el recto femoral, el aductor largo, el tríceps braquial, los flexores de los dedos, el supraespinoso, el subescapular y los tendones de la cadera (Lewis y Cook 2014; Barberán 2023).',
          'Cuándo: puede empezar en las primeras horas o los 2 primeros días de tratamiento y hasta varios meses después de terminarlo (EMA 2018). En 98 casos publicados, la mediana fue de 6 días, el 85 % empezó en el primer mes y entre el 41 % y el 50 % lo hizo con el antibiótico ya terminado, hasta 6 meses después (Lewis y Cook 2014). En las notificaciones a la FDA, la mediana fue de 3 días con ciprofloxacino y de 16,5 días con moxifloxacino (Shu 2022).',
          'Cómo se presenta: dolor de comienzo brusco, a veces con hinchazón y signos de inflamación; la mitad de las roturas se han descrito sin dolor previo (Lewis y Cook 2014). Según una revisión, la tendinitis es bilateral en la mitad de los casos (Rusu 2023).',
          'Más riesgo con más de 60 años, insuficiencia renal, trasplante de órgano y corticoides a la vez (EMA 2018; Sangiorgio 2024). Con corticoides, el riesgo de rotura llega a ser 14 veces mayor según una revisión (Baggio y Ananda-Rajah 2021), y en un estudio de casos y controles el del Aquiles fue 46 veces mayor que sin ninguno de los dos fármacos (Lewis y Cook 2014). La actividad física intensa también se suma (Lewis y Cook 2014).',
          'Al valorar una tendinopatía, pregunta específicamente por las fluoroquinolonas (Lewis y Cook 2014). Las fuentes leídas no tratan si enmascaran signos en la exploración.',
        ],
        detalle: [
          'Las agencias describen efectos muy raros pero de larga duración (meses o años), incapacitantes y quizá irreversibles en tendones, músculos, articulaciones y nervios: dolor e hinchazón de las articulaciones, dolor o debilidad muscular y dificultad para caminar (EMA 2018; AEMPS 2023).',
          'Cada día más de tratamiento aumenta alrededor de un 6 % el riesgo de rotura, y tomarlas en los 90 días siguientes a una cirugía del tendón se asoció al doble de roturas (Duman 2025).',
          'Recuperación: el 90 % se trata sin cirugía, con una mediana de un mes, y hasta un 10 % queda con secuelas (dificultad para caminar, menos movilidad, dolor) (Baggio y Ananda-Rajah 2021); la tendinitis tarda de unas semanas a dos meses (Rusu 2023). Puede recuperarse más despacio que otras tendinopatías (Lewis y Cook 2014).',
          'Mecanismo propuesto: aumentan las metaloproteinasas que degradan el colágeno y reducen la síntesis de colágeno de los tenocitos (Lewis y Cook 2014; Baggio y Ananda-Rajah 2021).',
          'No hay acuerdo sobre cuál es más dañino para el tendón: dos revisiones señalan el levofloxacino (Duman 2025; Rusu 2023), el metaanálisis da la misma incidencia con levofloxacino y con ciprofloxacino (Sangiorgio 2024), y una revisión anterior lo citaba como el menos dañino (Lewis y Cook 2014).',
          'Articulaciones y músculos: en las notificaciones a la base mundial de la OMS, el dolor articular fue el efecto musculoesquelético más notificado (16 % de esas notificaciones) y el dolor muscular el 7 %; la mayoría empezó entre el día 1 y el 7, y en el 65 % de las que daban el dato duró más de 30 días (Huruba 2021). Son proporciones de notificaciones, no de los tratados.',
          'No hay acuerdo sobre la discapacidad de larga duración: las agencias la atribuyen a las fluoroquinolonas (EMA 2018), y un análisis de notificaciones financiado por un fabricante no encontró más que con otros antibióticos (Wilcox 2020).',
          'Puede no parecer una tendinopatía: se ha descrito una mujer con roturas repetidas en la unión miotendinosa de la pantorrilla, sin afectar al Aquiles, que empezaron unos 5 meses después de tomarlas y siguieron con brotes más de un año pese a la fisioterapia (Moseley 2025).',
          'En niños y adolescentes se limitan por el riesgo de artropatía visto en animales jóvenes (Duman 2025; Humma y Patel 2024).',
        ],
      },
      visceral: {
        texto: [
          'Aorta: se asocian a más disección (OR 2,38) y aneurisma de aorta (OR 1,98), sin que la relación esté probada como causal (Wee 2021); el riesgo es mayor en los 2 meses siguientes y en mayores (Humma y Patel 2024), y otra revisión considera las pruebas contradictorias (Baggio y Ananda-Rajah 2021). Más riesgo con aneurisma previo o en la familia, Marfan, Ehlers-Danlos u otras enfermedades del tejido conectivo, insuficiencia de una válvula cardíaca, tensión alta o edad avanzada (Baggio y Ananda-Rajah 2021; Rusu 2023; Podder 2024).',
          'La disección se presenta típicamente como un dolor brusco, muy intenso y desgarrador, en el pecho o en la espalda, que puede desplazarse; el dolor torácico con dolor abdominal, desmayo o síntomas neurológicos debe hacer pensar en ella, y hay presentaciones leves: solo se diagnostica a la primera entre el 15 % y el 43 % (Levy 2024). Por eso, ante un dolor brusco y muy intenso en la espalda o el pecho en quien toma o ha tomado en los 2 últimos meses una fluoroquinolona, piensa en la aorta antes que en un origen mecánico. Un aneurisma abdominal suele no dar síntomas, pero si crece puede dar dolor abdominal, en el flanco o en la espalda, y a la palpación suele notarse una masa que late y no duele (Shaw 2025).',
          'Nervios: neuropatía periférica sensitiva o sensitivo-motora, con dolor, quemazón, hormigueo, pinchazos, entumecimiento o debilidad, sobre todo en piernas y brazos; puede aparecer pronto y ser irreversible (EMA 2018; Humma y Patel 2024). El riesgo aumenta hasta 1,5 veces, con un aumento absoluto pequeño, del 0,04 % al año en mayores de 60 (Baggio y Ananda-Rajah 2021). En un estudio de casos y controles el riesgo creció un 3 % por cada día de tratamiento y duró hasta 180 días después (Morales 2019). En las notificaciones a la FDA, el 80 % empezó en la primera semana, con una mediana de 1 día; lo más descrito fueron las parestesias y los signos motores fueron raros (Shamim 2026).',
          'Sistema nervioso central y ánimo: en el 1–4,4 %, desde confusión, irritabilidad, mareo, cefalea e insomnio hasta convulsiones, psicosis o depresión con ideas de suicidio, más con levofloxacino y moxifloxacino (Barberán 2023; Wierzbiński 2023). En 73 casos publicados empezaron entre 10 minutos y 3 semanas tras la primera toma, y en 52 se resolvieron en 72 horas tras interrumpir el antibiótico (Wierzbiński 2023).',
          'Glucosa y corazón: hipoglucemia e hiperglucemia, más con moxifloxacino y en diabéticos con antidiabéticos o insulina; la hipoglucemia del levofloxacino puede ser grave (Baggio y Ananda-Rajah 2021; Rusu 2023; Podder 2024). En las notificaciones a la FDA la hipoglucemia empezó con una mediana de 2 días, el 75 % en la primera semana, también en personas sin diabetes (Li y Zhang 2025). Alargan el QT, con riesgo de arritmias, el doble con moxifloxacino que con los otros dos (Baggio y Ananda-Rajah 2021).',
          'Empeoran la miastenia gravis y se evitan en ella (Thai 2023; Humma y Patel 2024). Náuseas, vómitos o diarrea en hasta el 20 %, y diarrea por Clostridioides difficile (Baggio y Ananda-Rajah 2021; Barberán 2023).',
        ],
        detalle: [
          'Disección de aorta: sin tratamiento, la mortalidad se acerca al 50 % en 48 horas. Alrededor del 10 % no refiere dolor, sobre todo con Marfan. Una diferencia de tensión entre los brazos de más de 20 mm Hg o la falta de un pulso son signos de alarma, pero su ausencia no la descarta (Levy 2024).',
          'No hay acuerdo sobre la aorta: un metaanálisis halla más riesgo en los 30 días siguientes (RR 3,40), que deja de ser significativo al año (Wu 2026), y un estudio de cohortes en el Reino Unido no lo encontró tras ajustar por la infección que motivó el antibiótico (Brown 2023).',
          'Riesgo absoluto de la aorta: haría falta tratar a unas 7246 personas para un caso más de disección o de rotura de aneurisma, y a 483 en poblaciones de alto riesgo como los varones mayores (Wee 2021).',
          'Otros efectos de larga duración que describen las agencias: cansancio intenso, problemas de memoria y cambios en la vista, el oído, el gusto y el olfato (EMA 2018; AEMPS 2023). También fotosensibilidad y lesión hepática (Rusu 2023; Podder 2024).',
        ],
      },
      ejercicio: {
        texto: [
          'Ante dolor o hinchazón de un tendón, durante el tratamiento o después, la EMA pide reposo de la zona y contacto inmediato con el médico (EMA 2018); otras revisiones piden reducir la carga del tendón y no ejercitar la zona afectada (Rusu 2023), con analgesia y fisioterapia (Baggio y Ananda-Rajah 2021).',
          'Rehabilitación: puede responder mal a los programas excéntricos habituales, al menos al principio. Se propone en dos fases: primero soporte y protección, para que el tendón se recupere de la lesión química, y después carga progresiva (Lewis y Cook 2014). Una revisión cita proteger el tendón el primer mes (alza de talón, ortesis, muletas) y reducir la carga del Aquiles de 6 semanas a 6 meses (Rusu 2023).',
          'Deportistas: se recomienda evitarlas si hay otra opción, no combinarlas con corticoides orales o inyectados y vigilar de cerca al deportista después de tomarlas (Lewis y Cook 2014). Las fuentes leídas no dan normas de carga ni de vuelta al deporte en quien las toma sin síntomas, ni tratan la terapia manual.',
        ],
        detalle: [
          'La vigilancia del deportista dura 1 mes en la tabla de recomendaciones que recoge esa revisión y al menos 6 meses en su texto (Lewis y Cook 2014).',
          'No hay recomendaciones de consenso para rehabilitar esta tendinopatía (Anziano 2024). En un caso publicado, una mujer de 77 años mejoró en 8 semanas con modificación de la actividad y ejercicios graduados, con banda elástica desde la tercera semana (Anziano 2024).',
          'La carga intensa del tendón puede sumarse al efecto del fármaco: varios casos publicados eran deportistas o personas muy activas (Lewis y Cook 2014).',
          'Con un aneurisma conocido o tras una disección se desaconsejan el esfuerzo intenso, levantar mucho peso y la maniobra de Valsalva (Levy 2024); es una norma para esas personas, no para todas las que toman fluoroquinolonas.',
        ],
      },
      sueno: {
        texto: [
          'El insomnio figura entre sus efectos sobre el sistema nervioso central (Barberán 2023), y apareció en 14 de 73 casos publicados de esos efectos (Wierzbiński 2023). Las agencias incluyen los trastornos del sueño entre los efectos de larga duración (EMA 2018; AEMPS 2023).',
          'En las notificaciones psiquiátricas a la FDA, el insomnio predominó con el levofloxacino y la ansiedad con el ciprofloxacino y el moxifloxacino (Rusu 2026). Las fuentes leídas no dan su frecuencia en el conjunto de los tratados ni cuánto dura.',
        ],
        detalle: [
          'El aviso de la FDA de 2016 sobre el sistema nervioso central incluye la psicosis, la ansiedad, el insomnio y la depresión (Wierzbiński 2023).',
        ],
      },
      consultar: {
        texto: [
          'Urgente: dolor brusco y muy intenso en el pecho, la espalda o el abdomen, a menudo desgarrador, sobre todo con desmayo, síntomas de ictus o debilidad de un miembro, que puede ser una disección de aorta (Levy 2024); hinchazón de labios, cara o garganta (Humma y Patel 2024); convulsiones (Thai 2023); ideas de suicidio (Wierzbiński 2023).',
          'Sin esperar, con su médico: el primer signo de lesión de un tendón (dolor o hinchazón); dolor, hormigueo, entumecimiento, quemazón o debilidad en brazos o piernas; dificultad para caminar, cansancio intenso, ánimo deprimido, confusión o alucinaciones (Wierzbiński 2023), problemas de memoria o de sueño, o cambios en la vista, el oído, el gusto o el olfato. En esos casos la EMA y la AEMPS piden al paciente que deje de tomarlo y contacte de inmediato con su médico, que decide si sigue o cambia de antibiótico (EMA 2018; AEMPS 2023).',
          'Pronto: palpitaciones, cambios en el ritmo intestinal, fiebre, retortijones, pérdida de apetito, náuseas o vómitos, orina oscura o piel amarilla, y en diabéticos la glucosa descontrolada (Podder 2024).',
          'Tu papel es reconocer estos signos y que contacte ese mismo día con su médico; no decidas tú sobre el antibiótico: si sigue o se cambia lo decide su médico (EMA 2018). Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: corticoides a la vez, por el tendón (EMA 2018; Lewis y Cook 2014); tizanidina con ciprofloxacino (Thai 2023); otros fármacos que alargan el QT y warfarina, por sangrado (Humma y Patel 2024; Podder 2024); antidiabéticos o insulina (Podder 2024); AINE, por más efectos sobre el sistema nervioso central y convulsiones (Wierzbiński 2023; Podder 2024).',
          'Terminar el tratamiento no garantiza el tendón: puede doler o romperse muchos meses después (Lewis y Cook 2014).',
          'Quien ya tuvo un efecto adverso grave con una quinolona no debe volver a tomarla, y no se usan para infecciones leves o que se curan solas, como faringitis, amigdalitis o bronquitis aguda (EMA 2018; AEMPS 2023). Las sospechas de reacción adversa se notifican en NotificaRAM (AEMPS 2023).',
        ],
      },
    },
    fuentes: ['Baggio y Ananda-Rajah 2021', 'Sangiorgio 2024', 'Wee 2021', 'Barberán 2023', 'Wierzbiński 2023', 'Rusu 2023', 'Duman 2025', 'Lewis y Cook 2014', 'EMA 2018', 'AEMPS 2023', 'Thai 2023', 'Humma y Patel 2024', 'Podder 2024', 'Levy 2024', 'Shu 2022', 'Huruba 2021', 'Wilcox 2020', 'Moseley 2025', 'Morales 2019', 'Shamim 2026', 'Shaw 2025', 'Wu 2026', 'Brown 2023', 'Li y Zhang 2025', 'Anziano 2024', 'Rusu 2026'],
  },
  // Betabloqueantes (2026-10): ocho fuentes en PMC (Joshi 2026 se leyó y no
  // se cita) y siete PDF del usuario (StatPearls de la familia, propranolol,
  // metoprolol, atenolol y bisoprolol; Hansen 2022, Ham 2017). Sin fuente
  // leída para el dolor, la inflamación y la curación, la terapia manual, el
  // calor y el enmascaramiento de la taquicardia del dolor, la fiebre o un
  // sangrado: docs/farmacologia.md.
  {
    id: 'betabloqueantes',
    nombre: 'Betabloqueantes',
    ejemplos: 'Bisoprolol, atenolol, metoprolol, propranolol',
    cima: ['bisoprolol', 'atenolol', 'metoprolol', 'propranolol'],
    apartados: {
      dolor: {
        texto: [
          'Las fuentes leídas no tratan su efecto sobre el dolor, la inflamación ni la curación de los tejidos, ni describen dolores musculares o articulares.',
          'No todos los que los toman son cardíacos: el propranolol es de primera elección para prevenir la migraña y se usa en el temblor esencial (Awosika y Patel 2026), y el metoprolol y el atenolol también se usan para la migraña (Morris 2024; Rehman 2024). Pregunta para qué lo toma.',
          'Enmascaran signos: frenan la taquicardia de la hipoglucemia (Farzam y Jan 2023; Bazroon y Alrashidi 2023), y con el propranolol también el rubor, el sudor y el mareo (Awosika y Patel 2026), y pueden ocultar los síntomas de la tirotoxicosis (Rehman 2024). En un diabético, la hipoglucemia puede llegar sin sus avisos habituales (Bazroon y Alrashidi 2023).',
          'Las fuentes leídas no estudian si ocultan la taquicardia del dolor, la fiebre, la deshidratación o un sangrado.',
        ],
        detalle: [
          'Las parestesias figuran entre sus efectos frecuentes (Awosika y Patel 2026; Rehman 2024): tenlas en cuenta antes de atribuir un hormigueo a un nervio.',
          'Pueden empeorar la psoriasis y la miastenia gravis (caída del párpado, visión doble, debilidad muscular) (Bazroon y Alrashidi 2023).',
        ],
      },
      visceral: {
        texto: [
          'Lo más frecuente: bradicardia, hipotensión, cansancio, mareo, náuseas y estreñimiento (Farzam y Jan 2023). En un metaanálisis, el mareo fue más frecuente que con placebo (RR 1,72; IC 95 % 1,39–2,14), y más aún con propranolol (Ez Eddin 2025).',
          'Frío en manos y pies, por la vasoconstricción periférica (Awosika y Patel 2026; Morris 2024; Rehman 2024). Pueden empeorar el fenómeno de Raynaud (Farzam y Jan 2023), menos los cardioselectivos que los no selectivos (Bazroon y Alrashidi 2023), y la enfermedad arterial periférica grave contraindica el atenolol (Rehman 2024). Las fuentes leídas no tratan la claudicación.',
          'Respiración: el propranolol, no selectivo, puede provocar broncoespasmo y empeorar el asma o la EPOC, y está contraindicado en el asma (Awosika y Patel 2026; Marko y Pawliczak 2025). Los cardioselectivos (bisoprolol, atenolol, metoprolol) también reducen la función pulmonar en el asma, aunque menos (Marko y Pawliczak 2025), y el atenolol bloquea los receptores β2 a dosis altas (Rehman 2024). Un ahogo nuevo puede ser broncoespasmo o de origen cardíaco (Awosika y Patel 2026).',
          'Ánimo: cansancio, letargo y síntomas depresivos (Carnovale 2023), y raras veces alucinaciones o delirium, sobre todo con propranolol (Ez Eddin 2025). Su relación con la depresión está discutida (Carnovale 2023; Bazroon y Alrashidi 2023).',
          'Corazón: en quien ya tiene una enfermedad cardíaca pueden empeorar la insuficiencia cardíaca, con hinchazón de piernas o tobillos, aumento de peso, ahogo o tos, y dar un bloqueo cardíaco, con desmayo, dolor en el pecho o palpitaciones (Morris 2024).',
        ],
        detalle: [
          'Caídas: en mayores de 55 años, los no selectivos, como el propranolol, se asociaron a más caídas (HR 1,22; IC 95 % 1,01–1,48) y los selectivos no (HR 0,92; 0,83–1,01). Ese estudio miró el uso mantenido, no el comienzo, cuando otros estudios vieron más caídas por hipotensión (Ham 2017). El atenolol da síncope con frecuencia e hipotensión postural raras veces (Rehman 2024), y los mayores son más sensibles a la bradicardia, la hipotensión y el cansancio (Awosika y Patel 2026).',
          'En la EPOC con enfermedad cardiovascular, un metaanálisis halló menos mortalidad (OR 0,50) y menos exacerbaciones (OR 0,76) con betabloqueantes, aunque los no selectivos aumentan los ingresos y reducen el FEV1 (Dos Santos 2024).',
          'El timolol en colirio también puede reducir el FEV1 (Marko y Pawliczak 2025): pregunta también por las gotas para el glaucoma.',
          'Otros: aumento de peso y disfunción sexual (Farzam y Jan 2023).',
        ],
      },
      ejercicio: {
        texto: [
          'La frecuencia cardíaca no sirve para dosificar el ejercicio: la bajan en todo el rango de intensidades, la frecuencia máxima ya no se puede estimar y las zonas de frecuencia dejan de corresponder al esfuerzo real; un cambio de dosis o de cumplimiento la vuelve a cambiar (Mitchell 2025). Con 100 mg de metoprolol, la frecuencia fue unos 40 latidos por minuto más baja al mismo esfuerzo percibido (Mitchell 2025).',
          'Usa el esfuerzo percibido (escala de Borg de 6 a 20): en un ensayo, su relación con el consumo de oxígeno se mantuvo con el fármaco (Mitchell 2025), y una guía europea recoge que sirve cuando la frecuencia cardíaca no se puede usar. Como referencia, 12–13 es intensidad moderada y 14–16 alta (Hansen 2022).',
          'Las fuentes no coinciden en cuánto fiarse del Borg: la guía europea lo quiere solo como complemento de un método objetivo, como la prueba de esfuerzo, y advierte que los betabloqueantes pueden dificultar su interpretación (Hansen 2022); el ensayo que lo apoya es de 13 jóvenes sanos con una sola dosis (Mitchell 2025). Si su cardiólogo le ha dado una intensidad a partir de una prueba de esfuerzo, esa manda.',
          'Espera menos capacidad de ejercicio y más cansancio (Bazroon y Alrashidi 2023; Morris 2024): al mismo Borg, la carga fue algo menor con el fármaco (Mitchell 2025). Sube primero la duración y después la intensidad, un 5–10 % por semana (Hansen 2022).',
          'Por el mareo y la hipotensión (Ez Eddin 2025; Farzam y Jan 2023), cuida los cambios de postura y el final de la sesión. Las fuentes leídas no tratan la terapia manual, el ejercicio con calor ni la sudoración en el esfuerzo.',
        ],
        detalle: [
          'Escala de Borg: 6 sin esfuerzo, 9 muy ligero, 11 ligero, 13 algo duro, 15 duro, 17 muy duro, 19 extremadamente duro y 20 esfuerzo máximo. Una escala de 0 a 10 puede ser más fácil de entender para el paciente (Hansen 2022).',
          'Si cambia la dosis, la guía europea fija de nuevo la frecuencia objetivo con la carga de las últimas sesiones y la frecuencia que provoca tras 5 minutos o más de ejercicio (Hansen 2022). La frecuencia y la tensión se miden en reposo, durante el ejercicio y antes y después de la toma (Morris 2024).',
          'El atenolol actúa en 1 hora, alcanza su máximo a las 2–4 horas y dura al menos 24 (Rehman 2024).',
          'Fuerza en rehabilitación cardíaca: 30–70 % de 1RM en el tren superior y 40–80 % en el inferior, 12–15 repeticiones y 2–3 series, soltando el aire al contraer para evitar la maniobra de Valsalva; solo se progresa sin arritmias, síncopes ni mareos (Hansen 2022).',
          'En la insuficiencia cardíaca con fracción de eyección conservada se han asociado a menos capacidad de ejercicio (Dar y Jacob 2024).',
        ],
      },
      sueno: {
        texto: [
          'Insomnio, cambios del sueño y pesadillas, más con los que atraviesan la barrera hematoencefálica; bajan la melatonina (Farzam y Jan 2023; Ez Eddin 2025). El propranolol da sueños vívidos y alteraciones del sueño (Awosika y Patel 2026), y el metoprolol, pesadillas (Morris 2024).',
          'En un metaanálisis, frente a placebo el insomnio aumentó poco y sin significación (RR 1,12; IC 95 % 0,99–1,26), igual que las pesadillas; empezar propranolol se asoció a más insomnio en 30 días que el bisoprolol (OR 3,22) o el atenolol (OR 2,17) (Ez Eddin 2025).',
          'Estos efectos a menudo se resuelven con el ajuste o la subida lenta de la dosis (Awosika y Patel 2026), que decide su médico. Pregunta por el sueño si empezó o cambió de dosis hace poco.',
        ],
        detalle: [
          'No hay acuerdo sobre cuál afecta más al sistema nervioso: los capítulos lo atribuyen a los lipófilos, como el propranolol y el metoprolol (Awosika y Patel 2026; Morris 2024), y dicen que el atenolol, poco liposoluble, daría menos, aunque cuenta la confusión y los trastornos del sueño entre sus efectos frecuentes (Rehman 2024). En el líquido cefalorraquídeo, en cambio, el bisoprolol llega al 55 % y el propranolol al 5 % (Carnovale 2023), y la lipofilia del bisoprolol es baja para un capítulo (Bazroon y Alrashidi 2023) y media para otra fuente (Ham 2017).',
        ],
      },
      consultar: {
        texto: [
          'Urgente: desmayo, dolor en el pecho o palpitaciones, que pueden ser un bloqueo cardíaco; hinchazón de cara, labios, lengua o garganta, dificultad para respirar o habones (Morris 2024). En una anafilaxia, la adrenalina puede funcionar peor con ellos (Awosika y Patel 2026; Bazroon y Alrashidi 2023).',
          'Pronto, con su médico: mareo o caídas nuevas (Ham 2017; Ez Eddin 2025); hinchazón de tobillos, aumento de peso o ahogo nuevos (Morris 2024); un ahogo con pitidos (Awosika y Patel 2026); frío o cambios de color en los dedos (Farzam y Jan 2023); pesadillas, insomnio o ánimo bajo que no ceden (Ez Eddin 2025), y en un diabético, hipoglucemias sin aviso (Bazroon y Alrashidi 2023).',
          'No se dejan de golpe: la interrupción brusca puede provocar angina, infarto, arritmias ventriculares, taquicardia y tensión alta (Awosika y Patel 2026; Morris 2024; Bazroon y Alrashidi 2023), o una tormenta tiroidea (Rehman 2024). Se hace de forma gradual, en 1 o 2 semanas según dos capítulos, y con quien los prescribe (Awosika y Patel 2026; Morris 2024); mientras dura con el atenolol, se vigila de cerca y se limita la actividad física (Rehman 2024).',
          'Si dice que lo ha dejado de golpe o que se salta dosis, que lo hable pronto con su médico. Nunca aconsejes dejarlo ni bajar la dosis por tu cuenta. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: verapamilo o diltiazem (bradicardia, hipotensión, bloqueo) y donepezilo o rivastigmina (bradicardia, caídas, síncope) (Bazroon y Alrashidi 2023; Rehman 2024); la clonidina, que dejada de golpe da tensión alta de rebote (Awosika y Patel 2026; Morris 2024; Rehman 2024); los AINE, que pueden restar efecto al propranolol sobre la tensión (Awosika y Patel 2026).',
          'Incluso dejarlos de forma planificada tras un infarto no cambió la mortalidad (HR 1,11; IC 95 % 0,96–1,28), pero se asoció a más eventos cardiovasculares mayores (HR 1,12; 1,01–1,24) (Thompson 2026).',
          'Una sobredosis da bradicardia intensa, hipotensión con mareo o desmayo, ahogo con pitidos, confusión o convulsiones (Awosika y Patel 2026; Morris 2024).',
          'El aviso en recuadro sobre la interrupción brusca se quitó del propranolol en 2021, aunque la advertencia sigue (Awosika y Patel 2026); los capítulos del metoprolol y del atenolol aún lo describen (Morris 2024; Rehman 2024).',
        ],
      },
    },
    fuentes: ['Mitchell 2025', 'Hansen 2022', 'Ez Eddin 2025', 'Ham 2017', 'Marko y Pawliczak 2025', 'Dos Santos 2024', 'Carnovale 2023', 'Thompson 2026', 'Dar y Jacob 2024', 'Farzam y Jan 2023', 'Awosika y Patel 2026', 'Morris 2024', 'Rehman 2024', 'Bazroon y Alrashidi 2023'],
  },
  // Diuréticos y otros antihipertensivos (2026-10): catorce fuentes en PMC
  // (Hunter y Bailey 2019 se leyó y no se cita) y PDF del usuario: las guías
  // ESC 2024 y ESH 2023, Hanssen 2022 y dieciséis capítulos de StatPearls
  // (los cinco grupos, cinco fármacos y seis cuadros). Sin fuente leída para
  // el dolor, la inflamación y la curación, el enmascaramiento de signos, la
  // terapia manual, el golpe de calor por esfuerzo, cómo distinguir el edema
  // del amlodipino de una trombosis y el insomnio: docs/farmacologia.md.
  {
    id: 'antihipertensivos',
    nombre: 'Diuréticos y otros antihipertensivos',
    ejemplos: 'Hidroclorotiazida, furosemida, enalapril, losartán, amlodipino',
    cima: ['hidroclorotiazida', 'furosemida', 'enalapril', 'losartán', 'amlodipino'],
    apartados: {
      dolor: {
        texto: [
          'Las fuentes leídas no tratan su efecto sobre el dolor, la inflamación ni la curación de los tejidos, ni si enmascaran signos en la exploración.',
          'Sí dan síntomas que se confunden con un problema musculoesquelético: calambres, debilidad y caídas por falta de sodio, potasio o magnesio con los diuréticos; ataques de gota con los diuréticos; dolor abdominal por angioedema intestinal con los IECA, e hinchazón de piernas con el amlodipino. Están en «Síntomas viscerales o secundarios».',
          'Grupos: tiazidas (hidroclorotiazida, clortalidona, indapamida), diuréticos de asa (furosemida, torasemida), IECA (enalapril, ramipril), ARA II (losartán, valsartán) y antagonistas del calcio, que se dividen en dihidropiridínicos (amlodipino, nifedipino) y no dihidropiridínicos (verapamilo, diltiazem) (Patel y Preuss 2025; Huxel 2023; Herman 2023; Patel y Launico 2025; McKeever 2024).',
          'No todos los que los toman son hipertensos: los antagonistas del calcio se usan también para prevenir la migraña y en el fenómeno de Raynaud (McKeever 2024), igual que los ARA II en el Raynaud (Patel y Launico 2025). Pregunta para qué lo toma.',
          'Si mides la tensión, hazlo con el brazo apoyado y sin ejercicio en los 30 minutos previos (McEvoy 2024). Con dolor agudo puede subir y volver a la normalidad al aliviarse (McEvoy 2024; Mancia 2023).',
        ],
        detalle: [
          'Las tiazidas se asociaron a menos fracturas que el placebo u otros antihipertensivos, aunque no a menos fracturas de cadera (Patel y Preuss 2025). Los de asa hacen perder calcio y magnesio por la orina (Huxel 2023); las fuentes leídas no dicen qué supone para el hueso.',
          'Los diuréticos podrían ocultar los síntomas de una insuficiencia cardíaca leve, y el edema de tobillos de los antagonistas del calcio puede confundirse con ella (Mancia 2023).',
        ],
      },
      visceral: {
        texto: [
          'Tiazidas e hiponatremia (falta de sodio): es su efecto típico; en un estudio la tenía el 14 % de los tratados, y a partir de los 70 años el riesgo se multiplicaba por cuatro (Liamis 2016). Suele aparecer en las 2–3 primeras semanas (Patel y Preuss 2025), pero también tras años si se suma otra causa (Liamis 2016). Con los de asa es rara (Liamis 2016).',
          'La hiponatremia leve ya da cansancio, debilidad, fallos de atención y de memoria, alteraciones de la marcha, caídas y fracturas, y la moderada, además, calambres (Rout y Afzal 2026). Hay que vigilar la inestabilidad, las caídas frecuentes y la falta de atención poco después de empezar la tiazida (Liamis 2016).',
          'Hipopotasemia (falta de potasio), con tiazidas y diuréticos de asa (Patel y Preuss 2025; Huxel 2023): debilidad muscular, cansancio, calambres, palpitaciones y estreñimiento. La debilidad empieza por las piernas y sube, y no suele dar síntomas hasta que el potasio baja bastante, salvo si baja de golpe (Castro y Sharma 2025).',
          'Hipomagnesemia (falta de magnesio), también con los dos tipos de diurético: cansancio, debilidad, temblor, espasmos y calambres musculares y tetania (Gragossian 2023).',
          'Gota: las tiazidas y los diuréticos de asa suben el ácido úrico y pueden desencadenar un ataque (Menon y Rednam 2026; Mancia 2023); con la hidroclorotiazida el ácido úrico sube en las primeras semanas, y más a más dosis (Weber 2026). Un ataque es una monoartritis brusca, con dolor intenso, rojez e hinchazón que llegan al máximo en 12–24 horas. Casi siempre es en la pierna, la mitad de las primeras veces en la primera articulación metatarsofalángica, y también en el tobillo, la rodilla, el tarso, los tendones y las bolsas, sobre todo de noche o de madrugada (Menon y Rednam 2026).',
          'Antagonistas del calcio dihidropiridínicos (amlodipino, nifedipino): hinchazón de las piernas que depende de la dosis (Liang 2022; Bulsara 2024), en el 10,8 % con 10 mg de amlodipino (Bulsara 2024), y que puede aparecer a las 2–3 semanas de empezar (McKeever 2024). Se debe a la dilatación de las arteriolas y no a un exceso de líquido, por eso los diuréticos apenas la mejoran (Weber 2026), y tomarla por un problema nuevo lleva a tratarla con otro fármaco (Bulsara 2024). Tenla en cuenta antes de atribuir una hinchazón de tobillo a una lesión. Las fuentes leídas no dicen cómo distinguirla de una trombosis.',
          'IECA (enalapril, ramipril): tos seca, más en mujeres y en no fumadores, que suele empezar en el primer mes y se va de 1 a 4 semanas después de dejarlo (Hu 2023). Con los ARA II es mucho menos frecuente (Hu 2023; Patel y Launico 2025).',
          'Angioedema: hinchazón de labios, lengua, cara o garganta sin habones, más frecuente en personas de origen africano (Memon y Tiwari 2023; Lacuesta 2024). Suele aparecer en la primera semana, pero hasta un tercio de los casos llega meses o años después, y puede repetirse hasta un mes después de dejar el IECA (Lacuesta 2024). El intestinal da dolor abdominal, náuseas, vómitos o diarrea, que imitan otros cuadros, entre 12 horas y 10 años después de empezar (Suenghataiphorn 2025). Con los ARA II es más raro, pero también ocurre (Mulla 2024).',
          'Piel: la hidroclorotiazida aumenta la sensibilidad a la luz (Weber 2026), y la furosemida y los demás de asa también pueden darla (Huxel 2023).',
        ],
        detalle: [
          'Fuentes que no coinciden. En la frecuencia de la tos con los IECA: entre el 3,9 % y el 35 % (Hu 2023), del 1 al 10 % (Herman 2023) o del 5 al 10 %, más en mujeres y en personas de origen asiático (Mancia 2023). En el cáncer de piel con la hidroclorotiazida: un metaanálisis de estudios observacionales halló un pequeño aumento del no melanoma, sobre todo el espinocelular con dosis acumuladas altas y fuera de Asia (Shao 2022), pero uno de 33 ensayos con datos de cada paciente no halló relación (Mancia 2023). La indicación es seguir el fármaco y protegerse del sol (Weber 2026).',
          'La clortalidona da más hiponatremia que la hidroclorotiazida (Liamis 2016) y más hipopotasemia (McEvoy 2024), y las mujeres tienen más hiponatremia e hipopotasemia con los diuréticos (Mancia 2023). Los de asa bajan además el calcio (Huxel 2023).',
          'En un metaanálisis de cohortes, tomar un diurético multiplicó por 2,4 el riesgo de gota (Evans 2018); en los ensayos el resultado no fue concluyente (Albasri 2021). La gota puede parecer una celulitis y, con fiebre, una artritis séptica, que además puede coexistir con ella (Menon y Rednam 2026). La hipomagnesemia puede dar condrocalcinosis (Gragossian 2023).',
          'Las tiazidas y los de asa pueden subir la glucosa (Patel y Preuss 2025; Huxel 2023), y las tiazidas pueden dar una pancreatitis aguda (Patel y Preuss 2025). Los de asa pueden dañar el oído (acúfenos, vértigo, sordera), más a dosis altas o con enfermedad renal (Huxel 2023; Khan 2023).',
          'IECA y ARA II pueden subir el potasio, más con enfermedad renal, diabetes, suplementos de potasio o diuréticos ahorradores de potasio (Herman 2023; Mulla 2024), y a menudo sin síntomas (Faruqi 2024).',
          'Verapamilo y diltiazem dan estreñimiento, mareo, cansancio e hipotensión ortostática (McKeever 2024), y menos edema que los dihidropiridínicos: 3,1 % frente a 12,3 % (Liang 2022). El amlodipino da también rubor, dolor de cabeza, palpitaciones y crecimiento de las encías (Bulsara 2024). El losartán cuenta el dolor de espalda y la debilidad entre sus efectos (Mulla 2024).',
        ],
      },
      ejercicio: {
        texto: [
          'En la hipertensión, la guía europea recomienda al menos 150 minutos semanales de aeróbico moderado (30 minutos o más, 5–7 días) o 75 de vigoroso en 3 días, más fuerza dinámica o isométrica de intensidad baja o moderada 2–3 veces por semana (McEvoy 2024). Fuerza dinámica: 2–3 series de 10–15 repeticiones al 40–60 % de 1RM. Isométrica: 3 series de 1–2 minutos, como prensión de la mano, plancha o sentadilla en la pared (McEvoy 2024). El aeróbico moderado es al 40–60 % de la frecuencia cardíaca de reserva (Mancia 2023).',
          'Con la tensión en reposo por encima de 200/110 mmHg, el ejercicio intenso tiene una contraindicación relativa (McEvoy 2024). Una sesión de aeróbico baja la tensión durante las horas siguientes, y por eso conviene hacer ejercicio a diario (McEvoy 2024; Mancia 2023).',
          'Caídas: en mayores con salud compleja, el riesgo de caer subió un 35–50 % en los 30 días siguientes a empezar un antihipertensivo, y otros estudios lo vieron también al añadir otro o al subir la dosis (Jödicke 2023). Los ensayos no hallaron más caídas, pero sí más hipotensión y síncope (Albasri 2021), y excluyen a los más frágiles (McEvoy 2024). En esas semanas, cuida los cambios de postura y el equilibrio.',
          'Hipotensión ortostática: una caída de 20 mmHg de la sistólica o de 10 de la diastólica al ponerse de pie, medida al minuto y a los 3 minutos tras 5 minutos sentado o tumbado (McEvoy 2024). Los diuréticos la provocan más; los IECA, los ARA II y los dihidropiridínicos, menos, y sobre todo en las 2 primeras semanas tras empezar o subir la dosis (McEvoy 2024). Empeora al levantarse, tras el ejercicio y con calor (Ringer 2025).',
          'Para prevenirla: levantarse por fases (tumbado, sentado, de pie), beber lo suficiente, y cruzar las piernas o tensar los músculos de piernas y caderas al ponerse de pie (Ringer 2025; McEvoy 2024). Si hay riesgo de caer, ejercicio supervisado, como la bicicleta reclinada o la natación (Ringer 2025).',
          'Calor: en mayores, los diuréticos de asa, los IECA y los ARA II se asociaron a más ingresos por golpe de calor o deshidratación, también sin ola de calor (Layton 2020). Si en verano la tensión baja y da mareo o cansancio, que lo hable con su médico: la guía contempla ajustar el tratamiento en ese caso, sobre todo el diurético, y esa decisión es suya (Mancia 2023). Las fuentes leídas no estudian el golpe de calor por esfuerzo en deportistas, y el estudio del calor no incluyó las tiazidas ni los antagonistas del calcio (Layton 2020).',
          'Verapamilo y diltiazem frenan la frecuencia cardíaca (Mancia 2023) y bajan la frecuencia máxima, mientras que los dihidropiridínicos pueden acelerarla (Schweiger 2021). Las fuentes leídas no dan normas para dosificar el ejercicio por frecuencia con ellos, ni tratan la terapia manual.',
        ],
        detalle: [
          'El aeróbico es la primera opción en la hipertensión, y la fuerza dinámica o isométrica de intensidad baja o moderada, la segunda; en pacientes no blancos, la fuerza dinámica es de primera elección. Bajó más la tensión con ejercicio supervisado. El documento no da frecuencia, intensidad ni progresión (Hanssen 2022).',
          'Las fuentes no coinciden en la fuerza isométrica: la guía europea de 2024 la incluye en su recomendación, aunque dice que sus resultados son irregulares (McEvoy 2024); la de 2023 recomienda en su recuadro solo la dinámica, aunque cuenta que la isométrica también baja la tensión (Mancia 2023), y el documento europeo sobre ejercicio la pone al mismo nivel que la dinámica (Hanssen 2022).',
          'La subida de tensión del ejercicio no impide hacerlo con regularidad, salvo con valores muy altos (hipertensión de grado 3). En el pico de una prueba en bicicleta, más de 220 mmHg en hombres o de 200 en mujeres pide valoración (Mancia 2023).',
          'En mayores, se prefieren las actividades en grupo, como el baile, el taichí o caminar (Mancia 2023), y la hipotensión ortostática se busca de forma sistemática a partir de los 65 años, aunque no haya síntomas (Mancia 2023).',
          'Deportistas: los diuréticos están prohibidos por la Agencia Mundial Antidopaje salvo autorización de uso terapéutico (Schweiger 2021). Los IECA y los ARA II no cambian el consumo máximo de oxígeno, y con los antagonistas del calcio no cambiaron en un estudio (Schweiger 2021). En esfuerzos muy largos, como un maratón, beber mucha agua y perder sal con el sudor puede dar hiponatremia (Rout y Afzal 2026); las fuentes leídas no lo relacionan con los diuréticos.',
        ],
      },
      sueno: {
        texto: [
          'Nicturia: se suele indicar tomar los diuréticos por la mañana para evitarla (Weber 2026; Patel y Preuss 2025), y no se toman al acostarse (Mancia 2023). En un estudio, quien pasó el diurético de la mañana a la noche se levantó a orinar una vez más por semana, y el 15,6 % lo vivió como una carga importante (Garrison 2023). La nicturia altera el sueño y aumenta el riesgo de caídas por la noche (Garrison 2023).',
          'Para el resto, tomarlos por la mañana o por la noche da el mismo resultado; mejor a la hora más cómoda, para no olvidarlos (McEvoy 2024; Mancia 2023).',
          'La hipotensión ortostática puede ser peor al levantarse de la cama (Ringer 2025): si se levanta de noche a orinar, que lo haga despacio. Un ataque de gota suele empezar de noche o de madrugada y despertar (Menon y Rednam 2026).',
          'Las fuentes leídas no tratan el insomnio con estos fármacos.',
        ],
      },
      consultar: {
        texto: [
          'Urgente: hinchazón de labios, lengua, cara o garganta, ronquera, cambio de voz o dificultad para respirar (Memon y Tiwari 2023), que puede ser mortal si afecta a la vía aérea, aunque lleve años con el IECA (Lacuesta 2024). Confusión, somnolencia, convulsiones o debilidad intensa, que pueden ser una hiponatremia grave (Rout y Afzal 2026; Liamis 2016). Debilidad muscular intensa con palpitaciones (Castro y Sharma 2025). Un desmayo (Albasri 2021).',
          'Pronto, con su médico: mareo, inestabilidad o caídas nuevas, más en las primeras semanas o tras subir la dosis (Jödicke 2023; Liamis 2016); calambres, debilidad o cansancio nuevos (Castro y Sharma 2025; Rout y Afzal 2026); una tos seca que no cede (Hu 2023); hinchazón de las piernas (Bulsara 2024); dolor abdominal sin explicación con un IECA (Suenghataiphorn 2025), y acúfenos o pérdida de oído con un diurético de asa (Huxel 2023).',
          'Una articulación caliente, roja e hinchada de golpe necesita valoración médica: puede ser gota, pero también séptica (Menon y Rednam 2026).',
          'Con vómitos, diarrea o algo que impida beber, que lo consulte: la deshidratación aumenta el riesgo de lesión renal con estos fármacos (Calvo 2025; Liamis 2016).',
          'No se dejan de golpe: la tensión vuelve a subir, puede haber dolor de cabeza, dolor articular, palpitaciones o hinchazón, y aumenta el riesgo cardiovascular; con los antagonistas del calcio, angina, y con los diuréticos, retención de líquidos (Mancia 2023). Si dice que lo ha dejado o que se salta dosis, que lo hable pronto con su médico. Nunca aconsejes dejarlos ni bajar la dosis por tu cuenta. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: un AINE con un diurético y un IECA o un ARA II duplica el riesgo de lesión renal aguda, sobre todo en los 30 primeros días (Calvo 2025); los AINE además suben la tensión (Mancia 2023) y restan efecto a los IECA y a los ARA II (Faruqi 2024; Mulla 2024). El amlodipino con dosis altas de estatinas puede dar miopatía (Bulsara 2024), y el verapamilo o el diltiazem no se combinan con un betabloqueante (McEvoy 2024).',
          'Los IECA y los ARA II no se usan en el embarazo (Mancia 2023; Herman 2023): si la paciente está o puede estar embarazada, que lo hable pronto con su médico.',
          'La falta de adherencia es frecuente, uno de cada tres o cuatro pacientes (Mancia 2023), y se asocia a más eventos cardiovasculares (McEvoy 2024).',
        ],
      },
    },
    fuentes: ['McEvoy 2024', 'Mancia 2023', 'Hanssen 2022', 'Albasri 2021', 'Jödicke 2023', 'Liamis 2016', 'Liang 2022', 'Hu 2023', 'Lacuesta 2024', 'Suenghataiphorn 2025', 'Evans 2018', 'Shao 2022', 'Layton 2020', 'Garrison 2023', 'Schweiger 2021', 'Calvo 2025', 'Patel y Preuss 2025', 'Huxel 2023', 'Herman 2023', 'Patel y Launico 2025', 'McKeever 2024', 'Weber 2026', 'Khan 2023', 'Faruqi 2024', 'Mulla 2024', 'Bulsara 2024', 'Castro y Sharma 2025', 'Gragossian 2023', 'Rout y Afzal 2026', 'Memon y Tiwari 2023', 'Menon y Rednam 2026', 'Ringer 2025'],
  },
  // Insulina y antidiabéticos (2026-10): trece fuentes enteras en PMC y PDF
  // del usuario: once capítulos de StatPearls (los siete grupos, la
  // hipoglucemia, la cetoacidosis euglucémica, Fournier y el pie diabético),
  // ADA 2025 (cap. 6), Colberg 2016, Riddell 2017, Bus 2024 (IWGDF) y Men 2017.
  // Sin fuente leída para el efecto sobre el dolor y la inflamación, el
  // enmascaramiento de signos, la terapia manual y el calor o el masaje sobre
  // la zona de inyección, el penfigoide de las gliptinas, cómo es el dolor de
  // la pancreatitis, los síntomas de la hipoglucemia nocturna y el sueño fuera
  // de ella: docs/farmacologia.md.
  {
    id: 'antidiabeticos',
    nombre: 'Insulina y antidiabéticos',
    ejemplos: 'Insulina, metformina, sulfonilureas, gliflozinas (SGLT2), agonistas de GLP-1, gliptinas (DPP-4), pioglitazona',
    cima: ['metformina', 'pioglitazona'],
    apartados: {
      dolor: {
        texto: [
          'Grupos: insulina; metformina; sulfonilureas (glibenclamida, glimepirida, glipizida, gliclazida); inhibidores de SGLT2 o gliflozinas (empagliflozina, dapagliflozina, canagliflozina); agonistas de GLP-1 (semaglutida, liraglutida); inhibidores de DPP-4 o gliptinas (sitagliptina, linagliptina, vildagliptina, saxagliptina), y pioglitazona (Costello 2023; Padda 2025; Collins y Costello 2024; Kasina y Baradhi 2023). Lo que hay que vigilar cambia mucho de un grupo a otro.',
          'Las fuentes leídas no tratan su efecto sobre el dolor ni sobre la inflamación, ni si enmascaran signos en la exploración. Sí dan síntomas que se confunden con un problema musculoesquelético o neurológico: los de este apartado y los de «Síntomas viscerales o secundarios».',
          'Metformina y vitamina B12: su uso prolongado baja la B12, y se vigila más en quien tiene anemia o neuropatía periférica (Corcoran y Jacobs 2023). El déficit de B12 se asocia a una neuropatía con parestesias, pérdida de sensibilidad, hiporreflexia, ataxia y debilidad, sobre todo en las piernas, como la neuropatía diabética, y es más probable con más de 1500 mg al día o tras 4–5 años de tratamiento (Alvarez 2025). Tenlo en cuenta antes de atribuir unas parestesias o una debilidad en las piernas a una raíz nerviosa. Una neuropatía asimétrica o focal, que avanza deprisa o con debilidad franca, hace pensar en otra causa (Alvarez 2025).',
          'Gliptinas y artralgias: la artralgia está entre sus efectos frecuentes (Kasina y Baradhi 2023). En 2015 la FDA avisó de que pueden causar artralgias graves, tras 33 casos notificados; en la revisión de casos que recoge un metaanálisis, el dolor empezaba tras iniciar el fármaco, solía resolverse al dejarlo y en algunos volvía al reintroducirlo (Men 2017). Las fuentes leídas no dicen cuánto tarda en aparecer ni qué articulaciones afecta.',
          'Pioglitazona y hueso: aumenta el riesgo de fractura, sobre todo en mujeres (Can y Correa 2023). Las fracturas aparecen a partir del primer año, suelen ser periféricas y dependen de la dosis y del tiempo; en un ensayo, en mujeres fueron el 5,1 % frente al 2,5 % con placebo, y no aumentaron en hombres (Lebovitz 2019).',
          'Agonistas de GLP-1 y músculo: entre el 20 % y el 30 % del peso que se pierde es masa magra, y la edad avanzada y la prefragilidad aumentan el riesgo de sarcopenia; se aconseja vigilar la función (fuerza de prensión, levantarse de la silla, velocidad de la marcha) y mantener el entrenamiento de fuerza y la proteína (Tobaiqy y Alqutub 2026).',
        ],
        detalle: [
          'Fuentes que no coinciden en las gliptinas: en un metaanálisis de 67 ensayos el riesgo de artralgia subió poco (RR 1,13; IC 95 % 1,04–1,22) y el de artralgia grave no lo hizo de forma significativa (RR 1,44; 0,83–2,51) (Men 2017); una cohorte no halló diferencia en los problemas musculoesqueléticos frente a otros antidiabéticos (HR 1,01; 0,97–1,05) (Park 2021). Las fuentes leídas enteras no tratan el penfigoide ampolloso (ampollas en la piel) con las gliptinas.',
          'La relación de la metformina con la neuropatía no es unánime: con metformina el déficit de B12 fue más frecuente (23 % frente a 17 %), pero algún estudio no halla relación con la neuropatía (Alvarez 2025).',
          'Gliflozinas: la canagliflozina se ha asociado a fracturas desde las 12 semanas de empezar, quizá por mareo y caídas al bajar el volumen de sangre o por cambios del metabolismo del hueso, aunque otro estudio no lo confirmó (Padda 2025); para el grupo en conjunto, los datos tranquilizan (Tentolouris 2019).',
          'Con los GLP-1 no se ha visto un aumento constante de fracturas, aunque sí algo de pérdida de densidad ósea cuando se pierde más peso (Tobaiqy y Alqutub 2026). En otro ensayo de la pioglitazona, el 80 % de las fracturas fueron por una caída (Lebovitz 2019).',
          'Insulina: el dolor y la lipodistrofia en el lugar de inyección son sus efectos adversos más frecuentes (Thota y Akbar 2023), y la lipodistrofia hace la glucosa más imprevisible, con hipoglucemias inesperadas (Riddell 2017).',
          'La diabetes predispone a la capsulitis adhesiva del hombro, al síndrome del túnel carpiano, a las fracturas de los metatarsianos y al pie de Charcot, y la hiperglucemia acelera la pérdida de movilidad articular (Colberg 2016).',
          'Curación: un mal control de la glucosa empeora la curación de las heridas (Srinivas-Shankar 2026), y la hiperglucemia mantenida se asocia a pérdida de masa muscular en jóvenes con diabetes tipo 1 (Adolfsson 2022). Las fuentes leídas no dan un efecto propio de cada fármaco sobre la curación de tendones, músculos o heridas.',
          'Pie diabético: la úlcera neuropática no duele, tiene bordes netos y callo alrededor; la isquémica duele, con piel pálida y pies fríos (Srinivas-Shankar 2026). Con las gliflozinas se han visto amputaciones de la pierna, más con la canagliflozina (Tentolouris 2019; Padda 2025); los factores de riesgo son la arteriopatía periférica, la neuropatía y una úlcera o amputación previa, y con una úlcera o infección activa en la pierna la indicación es no tomarlas, lo que decide su médico (Padda 2025).',
        ],
      },
      visceral: {
        texto: [
          'Hipoglucemia: la dan sobre todo la insulina y las sulfonilureas (también las meglitinidas); con los demás grupos es rara, salvo combinados con ellas (ADA 2025; Nakhleh y Shehadeh 2021; Kasina y Baradhi 2023). Da temblor, irritabilidad, confusión, taquicardia, sudor y hambre (ADA 2025), y también parestesias, dolor de cabeza, mareo y visión borrosa (Nakhleh y Shehadeh 2021). En la sesión puede parecer un problema neurológico o vestibular.',
          'Niveles: por debajo de 70 mg/dL (3,9 mmol/L) ya es importante aunque no dé síntomas; por debajo de 54 mg/dL (3,0 mmol/L) pide actuar de inmediato, y es grave cuando la persona necesita ayuda de otro, sea cual sea la cifra (ADA 2025).',
          'Hipoglucemia inadvertida: quien lleva muchos años con diabetes o ha tenido hipoglucemias repetidas puede no notarlas, y su primer signo puede ser la confusión (ADA 2025). La favorecen las hipoglucemias previas, el ejercicio y el sueño (Nakhleh y Shehadeh 2021). La ADA propone preguntar: «¿Nota siempre cuándo tiene el azúcar bajo?» (ADA 2025).',
          'Más riesgo de hipoglucemia: hipoglucemias recientes de nivel 2 o 3, insulina intensiva, enfermedad renal avanzada, deterioro cognitivo o demencia y 75 años o más (ADA 2025). Entre las sulfonilureas, la glibenclamida da más que la glipizida, la glimepirida o la gliclazida (Costello 2023; Sklepinski 2026), y en los mayores puede dar hipoglucemias prolongadas (Costello 2023).',
          'Gliflozinas y cetoacidosis con glucosa normal: puede aparecer con la glucosa por debajo de 250 mg/dL, y por eso se diagnostica tarde (Plewa 2023; Confederat 2026). Da náuseas, vómitos, dolor abdominal, cansancio, malestar y falta de aire (Plewa 2023). La desencadenan el ayuno o la dieta cetogénica, el alcohol, la deshidratación, una cirugía, un traumatismo, una infección o una enfermedad aguda (Plewa 2023; Confederat 2026), y suele aparecer en los 2 primeros meses del fármaco (Confederat 2026).',
          'Gliflozinas y volumen: por su efecto diurético pueden dar una ligera pérdida de volumen, tensión baja, hipotensión ortostática y mareo, más con diuréticos (Tentolouris 2019) y en los mayores (Padda 2025).',
          'Gliflozinas e infecciones: dan infecciones genitales por hongos, más en mujeres y en quien ya las ha tenido, por lo general leves (Padda 2025). Rara vez, gangrena de Fournier, una infección grave del periné: empieza con picor, dolor a la presión, hinchazón y enrojecimiento del periné, el escroto o los labios, con un dolor desproporcionado para lo que se ve, y puede seguir fiebre y malestar (Leslie y Foreman 2025). En los casos con gliflozinas apareció de media a los 9 meses del fármaco (Azmi 2025). Su relación con las gliflozinas está discutida (Leslie y Foreman 2025; Tentolouris 2019).',
          'Agonistas de GLP-1: náuseas, vómitos, diarrea y estreñimiento son lo más frecuente, sobre todo al empezar y al subir la dosis, y suelen ser pasajeros (Tobaiqy y Alqutub 2026); los vómitos y la diarrea pueden deshidratar y dañar el riñón (Collins y Costello 2024). Los problemas de vesícula y vías biliares aparecen en el 1–3 % de los tratados, y la pancreatitis, rara, puede ser grave (Tobaiqy y Alqutub 2026; Collins y Costello 2024). Las fuentes leídas no describen cómo es el dolor de la pancreatitis ni si irradia a la espalda.',
          'Metformina: diarrea, náuseas y vómitos, en hasta el 30 %; se toma con la comida para evitarlos (Corcoran y Jacobs 2023). Las fuentes leídas no dicen cuándo aparecen ni si mejoran con el tiempo.',
          'Pioglitazona: edema en las piernas (3–5 % sola, 15–16 % con insulina) y aumento de peso (Lebovitz 2019), e insuficiencia cardíaca, sobre todo en quien ya tiene enfermedad cardiovascular (Lebovitz 2019). Las señales son ahogo, aumento rápido de peso o edema tras empezar o cambiar la dosis (Can y Correa 2023).',
        ],
        detalle: [
          'Fournier avanza deprisa: hasta el 75 % de los casos se diagnostica mal al principio, cada retraso aumenta la mortalidad y esta ronda el 40 % (Leslie y Foreman 2025).',
          'El déficit de B12 de la metformina puede dar anemia, con debilidad, palpitaciones, cansancio, ahogo y, en casos graves, síncope (Alvarez 2025). La acidosis láctica es rara (1 de cada 30.000) y da malestar y dificultad para respirar; la favorecen la enfermedad renal o hepática, la edad, la cirugía y el alcohol (Corcoran y Jacobs 2023).',
          'Gliptinas: infecciones respiratorias altas, nasofaringitis, cefalea e infección urinaria; raras veces pancreatitis, sin relación causal demostrada, y la saxagliptina se asoció a más ingresos por insuficiencia cardíaca (Kasina y Baradhi 2023).',
          'Pioglitazona: altera la función del hígado, y unas náuseas, vómitos, dolor abdominal, cansancio u orina oscura sin explicación piden consulta médica inmediata; la orina roja o las ganas frecuentes de orinar se comunican por la posible relación con el cáncer de vejiga, que está discutida (Can y Correa 2023).',
          'Insulina: hace ganar peso y puede bajar el potasio, sobre todo con diuréticos, vómitos o diarrea (Thota y Akbar 2023).',
          'Antes de una cirugía, su médico deja de dar las gliflozinas unos días (la empagliflozina, al menos 3) por el riesgo de cetoacidosis (Padda 2025), y tras la cirugía del pie las retoma cuando la herida ha curado (Srinivas-Shankar 2026).',
        ],
      },
      ejercicio: {
        texto: [
          'El ejercicio es parte del tratamiento: al menos 150 minutos semanales de actividad moderada o vigorosa en 3 días o más, sin pasar más de 2 días seguidos sin actividad, y fuerza 2–3 días no consecutivos; en mayores, también flexibilidad y equilibrio 2–3 veces por semana. Mejor supervisado, e interrumpiendo el tiempo sentado cada 30 minutos con actividad ligera (Colberg 2016).',
          'Riesgo de hipoglucemia con el ejercicio: lo tiene quien usa insulina o sulfonilureas. Con metformina, gliptinas, GLP-1, gliflozinas o pioglitazona solos no hace falta tomar hidratos por el ejercicio; combinados con insulina o sulfonilureas, sí hay riesgo (Kanaley 2022; Colberg 2016). Con insulina o sulfonilureas, que traiga hidratos de absorción rápida y su medidor de glucosa, y glucagón si tiende a hipoglucemias graves (Kanaley 2022; Riddell 2017).',
          'Glucemia antes de empezar: el objetivo es 90–250 mg/dL (5,0–13,9 mmol/L) (Colberg 2016). Por debajo de 90 mg/dL, hidratos antes de empezar (Colberg 2016; Riddell 2017). Por encima de 250 mg/dL hay que mirar las cetonas: con cetonas moderadas o altas no se hace ejercicio; sin ellas, ejercicio ligero o moderado si se encuentra bien e hidratado, y el intenso cuando baje de 250 (Colberg 2016; Kanaley 2022). Una hipoglucemia grave en las 24 horas previas contraindica el ejercicio (Riddell 2017).',
          'Durante: en la diabetes tipo 1, la hipoglucemia aparece en la mayoría dentro de los 45 minutos de ejercicio aeróbico (Riddell 2017). Después: aparece sobre todo 6–15 horas más tarde, aunque el riesgo dura hasta 48 horas (Colberg 2016), y el ejercicio largo e intenso lo aumenta con insulina o sulfonilureas (Kanaley 2022).',
          'Lugar de inyección: la insulina se pone en una zona que no vaya a trabajar, porque el ejercicio acelera su absorción, y el calor ambiente también (Adolfsson 2022). Las fuentes leídas no tratan el masaje, el calor local ni la terapia manual sobre una zona recién inyectada.',
          'Gliflozinas: el ejercicio, solo si se encuentra bien, aunque la glucosa no esté muy alta, por la cetoacidosis con glucosa normal (Kanaley 2022); por la pérdida de volumen y el mareo (Tentolouris 2019), cuida la hidratación y los cambios de postura.',
          'Complicaciones: con neuropatía autonómica, usa el esfuerzo percibido en lugar de la frecuencia cardíaca, evita los cambios bruscos de postura y el calor (Colberg 2016). Con retinopatía proliferativa inestable o grave, evita el ejercicio vigoroso, aguantar la respiración con esfuerzo (pesas, isométricos), la cabeza abajo y los saltos (Colberg 2016; Kanaley 2022). Con una úlcera sin curar, nada de carga sobre ese pie (Colberg 2016; Bus 2024).',
          'Las fuentes leídas no tratan la terapia manual con estos fármacos.',
        ],
        detalle: [
          'Pie: caminar a ritmo moderado no parece aumentar las úlceras con neuropatía; revisa los pies a diario, con calzado adecuado y los pies secos (Colberg 2016). En el riesgo bajo o moderado, la guía del pie sugiere un programa de ejercicio de pie y tobillo de 8–12 semanas, mejor supervisado por un fisioterapeuta, que no aumentó las úlceras, y subir hasta 1000 pasos más al día, un 10 % por semana como máximo, con buen calzado (Bus 2024).',
          'Fuentes que no coinciden. Con neuropatía o deformidad del pie, una guía prefiere más actividad sin carga (Colberg 2016) y la del pie anima a caminar más de forma gradual (Bus 2024). Por debajo de 90 mg/dL antes del ejercicio, 15–30 g de hidratos y empezar (Colberg 2016), o 10–20 g y esperar a que pase de 90 (Riddell 2017). En la diabetes tipo 1, las cetonas se miran desde 270 mg/dL y el ejercicio se contraindica con 1,5 mmol/L o más (Riddell 2017).',
          'El ejercicio breve e intenso (sprints, pesas) puede subir la glucosa durante horas, y el aeróbico la baja (Riddell 2017). Hacer la fuerza antes que el aeróbico da menos hipoglucemias (Colberg 2016).',
          'La insulina rápida empieza a actuar a los 5–15 minutos y dura 3–5 horas; la fuente da su máximo a los 30 minutos (Thota y Akbar 2023), y otra, a los 60–100 (Adolfsson 2022).',
          'El alcohol antes y durante el ejercicio aumenta el riesgo de hipoglucemia, también la nocturna (Adolfsson 2022). Con neuropatía autonómica, complicaciones cardiovasculares o en mayores, evita el ejercicio al aire libre con mucho calor o humedad (Colberg 2016).',
          'La metformina podría reducir la ganancia de masa muscular con las pesas en adultos sanos; hace falta más investigación (Kanaley 2022).',
        ],
      },
      sueno: {
        texto: [
          'Hipoglucemia nocturna: tras el ejercicio de la tarde o largo e intenso, quien usa insulina tiene más riesgo por la noche, entre 6 y 15 horas después (Moser 2020) o con frecuencia a las 7–11 horas (Adolfsson 2022), y el sueño reduce la respuesta del cuerpo a la hipoglucemia (Nakhleh y Shehadeh 2021). Hacer el ejercicio temprano puede reducirla (Adolfsson 2022).',
          'Quien tiene más riesgo de hipoglucemia nocturna grave, como quien las repite o duerme solo, puede necesitar un control a las 2–3 de la madrugada o un sensor con alarma (Riddell 2017). Una merienda antes de dormir puede prevenirla cuando hace falta (ADA 2025), aunque protege unas 8 horas y no más (Riddell 2017).',
          'Con insulina antes de dormir, algunos se despiertan con la glucosa alta por una hipoglucemia de la noche (efecto Somogyi) (Thota y Akbar 2023).',
          'Las fuentes leídas no describen los síntomas de la hipoglucemia nocturna ni tratan el sueño con los demás grupos; las gliflozinas aumentan la cantidad de orina (Padda 2025), pero las fuentes no hablan de levantarse de noche a orinar.',
        ],
      },
      consultar: {
        texto: [
          'Hipoglucemia en la sesión: para el ejercicio y que se mida la glucosa (Moser 2020; Costello 2023). Con 70 mg/dL (3,9 mmol/L) o menos, 15 g de hidratos de absorción rápida, mejor glucosa (tabletas, zumo, refresco), sin grasa ni proteína; volver a medir a los 15 minutos y repetir si sigue baja, la regla «15-15»; cuando se recupere, que coma algo, porque con insulina o sulfonilureas puede repetirse (ADA 2025; Costello 2023). Si bajó de 54 mg/dL, no se reanuda el ejercicio (Moser 2020).',
          'Urgente: si está desorientado o inconsciente, llama a emergencias (Mathew y Thoppil 2022). Si no puede tragar, el glucagón lo puede poner cualquiera que sepa dónde está y cómo se usa, sin ser sanitario, y nunca se le da insulina (ADA 2025).',
          'Urgente también: con una gliflozina, náuseas, vómitos, dolor abdominal, cansancio o falta de aire aunque la glucosa sea normal (Plewa 2023; Confederat 2026); dolor, hinchazón o enrojecimiento del periné, los genitales o la ingle, más con fiebre o malestar (Leslie y Foreman 2025); con un GLP-1, un dolor abdominal intenso o que no cede (Tobaiqy y Alqutub 2026); cetonas en sangre de 3,0 mmol/L o más (Riddell 2017).',
          'Pronto, con su médico: una hipoglucemia de nivel 2 o 3, o que se repiten (ADA 2025); mareo o caídas en un mayor con insulina o sulfonilurea (Rangraze 2026); parestesias, debilidad o inestabilidad en las piernas con metformina, para que valore la B12 (Corcoran y Jacobs 2023; Alvarez 2025); un dolor articular nuevo tras empezar una gliptina (Men 2017); edema, aumento rápido de peso o ahogo con pioglitazona (Can y Correa 2023); una herida o infección en el pie con una gliflozina (Padda 2025).',
          'Pie: una lesión preulcerosa o una úlcera pide contactar enseguida con un profesional formado (Bus 2024); con isquemia o infección moderada o grave, la consulta es urgente (Srinivas-Shankar 2026). Un pie rojo, caliente e hinchado, con neuropatía y a menudo sin úlcera, puede ser un pie de Charcot (Srinivas-Shankar 2026); las fuentes leídas no dicen con qué urgencia derivarlo.',
          'No se dejan de golpe: quien usa insulina intensiva no deja la basal aunque no coma, y si no tolera líquidos la atención es inmediata (ADA 2025); con una gliflozina, bajar la insulina más de un 20 % favorece la cetoacidosis (Confederat 2026). Si dice que se salta dosis o que lo ha dejado, que lo hable pronto con su médico. Nunca aconsejes dejarlos ni cambiar la dosis por tu cuenta. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: los betabloqueantes no selectivos pueden ocultar los síntomas de la hipoglucemia (Padda 2025; Colberg 2016); las fluoroquinolonas y otros antibióticos pueden aumentar mucho el efecto de las sulfonilureas y dar hipoglucemia (ADA 2025); la pioglitazona con insulina aumenta el edema y la insuficiencia cardíaca, y con pregabalina, el edema (Can y Correa 2023).',
          'Una hipoglucemia grave puede causar caídas, accidentes de tráfico y otras lesiones, y el deterioro cognitivo y la hipoglucemia se refuerzan mutuamente (ADA 2025). Con glucagón: se receta a todo el que usa insulina o tiene alto riesgo, y la familia y quien le atiende deben saber dónde está y cómo se pone (ADA 2025).',
        ],
      },
    },
    fuentes: ['ADA 2025', 'Colberg 2016', 'Kanaley 2022', 'Riddell 2017', 'Moser 2020', 'Adolfsson 2022', 'Nakhleh y Shehadeh 2021', 'Sklepinski 2026', 'Rangraze 2026', 'Alvarez 2025', 'Tentolouris 2019', 'Confederat 2026', 'Azmi 2025', 'Tobaiqy y Alqutub 2026', 'Lebovitz 2019', 'Men 2017', 'Park 2021', 'Bus 2024', 'Thota y Akbar 2023', 'Corcoran y Jacobs 2023', 'Costello 2023', 'Padda 2025', 'Collins y Costello 2024', 'Kasina y Baradhi 2023', 'Can y Correa 2023', 'Plewa 2023', 'Mathew y Thoppil 2022', 'Leslie y Foreman 2025', 'Srinivas-Shankar 2026'],
  },
  // Fármacos que tocan el hueso (2026-10): Gregson 2025 y Kanis 2019,
  // releídas; Adler 2016, Black 2020, Anastasilakis 2021, Gehrke 2023,
  // Zeng 2024, Wang 2025, Jin 2021, Hyder 2021, Tenti 2020, Lu 2020,
  // Shin 2022 y Hadji 2025, enteras en PMC; PDF del usuario: Irwin 2015
  // (HOPE), Tsourdi 2021 (ECTS), Shane 2014 (ASBMR), Ruggiero 2022 (AAOMS) y
  // los StatPearls de toxicidad de los bifosfonatos, hipocalcemia, esofagitis
  // por fármacos, denosumab, zoledronato, inhibidores de la aromatasa y
  // osteonecrosis de mandíbula. El ejercicio, la carga y la terapia manual de
  // la osteoporosis están en su tarjeta (docs/osteoporosis.md), no aquí. Sin
  // fuente leída para distinguir la fractura atípica de una tendinopatía o un
  // dolor de cadera, la evolución del dolor intenso de los bifosfonatos, el
  // momento de la sesión respecto a la toma, la terapia manual y el sueño
  // fuera de los sofocos: docs/farmacologia.md.
  {
    id: 'hueso',
    nombre: 'Fármacos que tocan el hueso',
    ejemplos: 'Alendronato, risedronato, ibandronato, zoledronato, denosumab; inhibidores de la aromatasa (anastrozol, letrozol, exemestano)',
    cima: ['alendronato', 'risedronato', 'ibandronato', 'zoledronato', 'denosumab', 'anastrozol', 'letrozol', 'exemestano'],
    apartados: {
      dolor: {
        texto: [
          'Grupos: bifosfonatos orales (alendronato, risedronato, ibandronato), bifosfonatos intravenosos (zoledronato) y denosumab, que frenan la pérdida de hueso en la osteoporosis (Gregson 2025), e inhibidores de la aromatasa (anastrozol, letrozol, exemestano), que se toman 5–10 años tras un cáncer de mama y hacen perder hueso (Fong y Patel 2026). Lo que hay que vigilar cambia mucho de un grupo a otro. Si tiene osteoporosis, marca la tarjeta «Osteoporosis o fragilidad ósea» de la fase 1: el ejercicio, la carga y la terapia manual están allí.',
          'Fractura atípica de fémur (bifosfonatos y denosumab): es rara; se rompe la diáfisis del fémur con un traumatismo mínimo o sin él, y a menudo en los dos lados (Gregson 2025; Shane 2014). Alrededor del 70 % tuvo antes un dolor sordo en la ingle o el muslo (Shane 2014), durante días, semanas o meses (Gregson 2025). El riesgo sube con los años de tratamiento, sobre todo a partir de 3 (mediana de 7) (Shane 2014), y baja deprisa al dejarlo (Black 2020). Tienen más riesgo las personas de origen asiático, con el fémur arqueado o que toman corticoides (Gregson 2025).',
          'Cómo distinguirla: las fuentes leídas no la comparan con una tendinopatía ni con un dolor de cadera o lumbar referido. Lo que la sugiere es un dolor sordo de muslo o ingle sin causa clara, en uno o los dos lados, en quien lleva años con el fármaco (Shane 2014). La fractura de estrés por ejercicio suele empezar en la cara interna del tercio proximal del fémur; la atípica, en la cara externa, entre el trocánter menor y los cóndilos (Shane 2014). Ante ese dolor, imagen del fémur antes de cargar: ver «Cuándo consultar».',
          'Bifosfonatos y dolor: el dolor musculoesquelético es un efecto frecuente del alendronato y el risedronato (Gregson 2025). Rara vez es intenso, y puede aparecer en cualquier momento del tratamiento, oral o intravenoso (Gehrke 2023); con el zoledronato, desde días hasta años después (Greear 2024). Las fuentes leídas no dicen si se resuelve al dejarlo ni cuánto tarda.',
          'Consolidación: en un metaanálisis, empezar un bifosfonato en torno a la cirugía de una fractura por fragilidad no retrasó la consolidación (Zeng 2024). La fractura atípica, en cambio, consolida mal (Gregson 2025).',
          'Inhibidores de la aromatasa y articulaciones: dolor articular simétrico y rigidez, sobre todo en manos, muñecas y rodillas, a veces en la zona lumbar, caderas, hombros y pies, con rigidez matinal, mialgias y menos fuerza de prensión (Tenti 2020; Hyder 2021). Lo tiene casi la mitad (20–74 %, 46 % en conjunto) (Hyder 2021). Suele empezar en los 2–3 primeros meses, con una mediana de unas 6 semanas, y llega a su máximo hacia el sexto mes (Tenti 2020; Hyder 2021). Es la causa más frecuente de abandono del tratamiento (Fong y Patel 2026).',
          'Túnel carpiano y dedo en resorte: en una cohorte, con inhibidores de la aromatasa el túnel carpiano apareció en el 1,3 % (0,4 % sin hormonoterapia) y la tenosinovitis (dedo en resorte, De Quervain) en el 2,3 % (0,5 %); más de la mitad, en el primer año; el túnel carpiano fue casi siempre en las dos manos, a menudo grave, y se operó el 41 % (Shin 2022). Tenlos en cuenta antes de atribuir unas parestesias de la mano o un dedo en resorte solo a la sobrecarga.',
          'Inhibidores de la aromatasa y hueso: la pérdida de densidad es 2–4 veces mayor que la de la menopausia (Hadji 2025) y se ve ya en los 6 primeros meses (Fong y Patel 2026); aumentan las fracturas, sobre todo las vertebrales (riesgo relativo 1,84) (Hadji 2025).',
        ],
        detalle: [
          'Criterios propuestos para el dolor articular de los inhibidores de la aromatasa: empezó o empeoró con el fármaco, mejora en 2 semanas al dejarlo y vuelve al retomarlo; además, dolor simétrico, en manos o muñecas, túnel carpiano, menos fuerza de prensión, rigidez matinal o mejoría con el uso o el ejercicio (Hyder 2021). Lo favorecen llevar menos de 5 años de menopausia, la terapia hormonal previa, la quimioterapia con taxanos, la obesidad y el dolor articular o la artrosis previos (Tenti 2020). No hay estudios que comparen los tres fármacos (Hyder 2021).',
          'Fractura atípica, cifras: entre 3,2 y 50 casos por 100.000 personas-año con bifosfonatos (Gregson 2025; Shane 2014), en torno a 100 o más con el uso prolongado (Shane 2014); en una cohorte, de 1,74 por 10.000 pacientes-año en conjunto a 13,10 con 8 años o más (Black 2020). Con el denosumab también se ha descrito, y no se sabe si es por el fármaco o por la propia osteoporosis (Hildebrand 2024).',
          'En la radiografía, la atípica es transversal, empieza en la cortical externa y tiene un engrosamiento local de la cortical («pico»); para el diagnóstico hacen falta al menos 4 de sus 5 rasgos principales, y entre los secundarios están el dolor de muslo o ingle previo y la fractura de los dos lados (Shane 2014).',
          'Denosumab: dolor de espalda (15 %), artralgias (11 %), dolor en las extremidades (11 %) y mialgias (4 %) en su capítulo de StatPearls, que no separa las dosis de la osteoporosis de las del cáncer (Hildebrand 2024).',
        ],
      },
      visceral: {
        texto: [
          'Reacción de fase aguda (zoledronato y otros bifosfonatos intravenosos): fiebre, dolor muscular y articular, dolor óseo, escalofríos y cansancio, que empiezan a las 24–72 horas de la infusión y ceden en 48–72 horas (Alaranji y Reilly 2025; Greear 2024). Es sobre todo tras la primera dosis: del 30 % baja a menos del 7 % en las siguientes (Alaranji y Reilly 2025), y el paracetamol la alivia (Gregson 2025). Si hay fiebre, hay que descartar una infección (Alaranji y Reilly 2025). Pregunta cuándo fue la última infusión antes de atribuir unas mialgias o un dolor óseo de esos días a un problema mecánico.',
          'Hipocalcemia (denosumab y zoledronato): hormigueo alrededor de la boca o en manos y pies, calambres, espasmos y tetania; en los casos graves, convulsiones, espasmo de la laringe y arritmias (Anastasopoulou y Goyal 2026). Con el zoledronato aparece en los días siguientes (Greear 2024); con el denosumab es grave en menos del 1–3 % y más probable con enfermedad renal (Hildebrand 2024). La favorecen la falta de vitamina D, la enfermedad renal y el hipoparatiroidismo (Greear 2024). La guía británica pide que quien toma denosumab comunique estos síntomas (Gregson 2025).',
          'Bifosfonatos orales y esófago: pueden dar esofagitis (Kanis 2019), sobre todo tomados con poca agua o tumbado (Sharma 2026). Da dolor detrás del esternón o ardor, dolor o dificultad al tragar, de comienzo brusco, desde horas hasta 10 días después de la toma (Sharma 2026). Ese dolor torácico entra en el diagnóstico diferencial del dolor cardíaco (Sharma 2026).',
          'Cómo se toman: en ayunas, con un vaso de agua del grifo, sentado o de pie, y sin tumbarse en los 30 minutos siguientes (alendronato, risedronato) o en 1 hora (ibandronato oral) (Gregson 2025). Si la sesión es esa mañana, no le pidas que se tumbe en ese tiempo.',
          'Osteonecrosis de mandíbula (bifosfonatos y denosumab): hueso expuesto en la boca durante más de 8 semanas (Ruggiero 2022). Antes de que se vea puede dar dolor de muelas sin causa dental, un dolor sordo de la mandíbula que puede irradiar a la articulación temporomandibular, dolor sinusal, cambios de sensibilidad, dientes que se mueven o hinchazón, y los trastornos de la articulación temporomandibular están entre lo que se confunde con ella (Ruggiero 2022). Con las dosis de la osteoporosis es rara (por debajo del 0,05 % con bifosfonatos, 0,04–0,3 % con denosumab), y con las del cáncer es mucho más frecuente (por debajo del 5 %) (Ruggiero 2022). La favorecen las extracciones, la enfermedad dental, la mala higiene de la boca, el tabaco, el cáncer y los corticoides (Gregson 2025).',
          'Osteonecrosis del conducto auditivo externo: muy rara; dolor de oído, supuración, pérdida de audición o infecciones de oído que no curan, a veces en los dos oídos (Gregson 2025; Wang 2025).',
          'Inhibidores de la aromatasa: sofocos, sudores nocturnos y cansancio, y ansiedad o depresión leve en alrededor del 37 % (Tenti 2020); también tensión alta, colesterol alto y trombosis o problemas cardiovasculares (Fong y Patel 2026).',
        ],
        detalle: [
          'Zoledronato y ojo: dolor, enrojecimiento o visión borrosa por una uveítis, de media a los 3 días de la infusión (Jin 2021); se valora en oftalmología (Greear 2024). Zoledronato y corazón: en su ensayo principal aumentó la fibrilación auricular sintomática (Gregson 2025).',
          'Denosumab: infecciones de la piel, sobre todo celulitis, y eccema (Gregson 2025).',
          'La osteonecrosis de mandíbula puede no doler: un tercio de los casos no duele (Alaranji y Reilly 2025), y el adormecimiento del labio inferior se ha descrito como síntoma precoz (Nischal y Gupta 2023).',
          'Fuentes que no coinciden en la frecuencia de la osteonecrosis de mandíbula con dosis de osteoporosis: del orden de 1 por 100.000 pacientes-año (Kanis 2019), de 1 por 10.000 a 1 por 100.000 años de tratamiento (Adler 2016), 10–100 por 100.000 personas-año (Gregson 2025), o en porcentaje acumulado (Ruggiero 2022). Fuentes que no coinciden en la reacción de fase aguda: el 10–30 % tras la primera infusión (Gehrke 2023) o el 30 % (Alaranji y Reilly 2025), y cede en 48 horas (Alaranji y Reilly 2025) o en 72 (Greear 2024).',
          'Esofagitis: los síntomas suelen mejorar en 1–2 semanas, pero pueden durar semanas o meses; con vómito de sangre, heces negras, dolor abdominal o síntomas que siguen a la semana, la indicación es una endoscopia (Sharma 2026).',
        ],
      },
      ejercicio: {
        texto: [
          'Con bifosfonatos o denosumab por osteoporosis, el ejercicio, la carga y la terapia manual siguen las normas de la osteoporosis: tarjeta «Osteoporosis o fragilidad ósea» de la fase 1 y su recuadro en la fase 5. Las fuentes leídas no dan normas propias para quien toma estos fármacos.',
          'Lo que sí cambia la carga: con una fractura atípica diagnosticada se restringe la carga (Gregson 2025), y con un engrosamiento de la cortical o una fractura incompleta sin dolor, carga limitada y sin actividad vigorosa hasta que la imagen se normalice (Shane 2014). Por eso, un dolor de muslo o ingle sin explicación pide imagen del fémur antes de seguir con impacto o carga de esa pierna (Gregson 2025).',
          'Tras una infusión de zoledronato, los 3 primeros días pueden traer fiebre y dolor muscular (Alaranji y Reilly 2025): si la sesión cae en esos días, tenlo en cuenta al dosificar y al interpretar los síntomas.',
          'Inhibidores de la aromatasa: en un ensayo con 121 mujeres inactivas con dolor articular, fuerza supervisada 2 días por semana (6 ejercicios, 3 series de 8–12 repeticiones, subiendo el peso tras dos sesiones haciendo 12 repeticiones en cada serie) y 150 minutos semanales de aeróbico, del 50 % al 60–80 % de la frecuencia cardíaca máxima en el primer mes, durante 12 meses, bajaron el peor dolor 1,6 puntos (29 %), frente a una subida del 3 % con los cuidados habituales, sin efectos adversos (Irwin 2015). El beneficio más claro llegó a los 12 meses (Irwin 2015).',
          'Fuentes que no coinciden: un metaanálisis halla menos dolor y rigidez con el ejercicio (Lu 2020), y una revisión Cochrane, según otra revisión, no halla pruebas claras (Tenti 2020). Los estudios no dieron efectos adversos importantes (Lu 2020), y las recomendaciones que recoge otra revisión proponen aeróbico y fuerza unos 30 minutos 3 veces por semana (Tenti 2020).',
          'Hueso con inhibidores de la aromatasa: ejercicio, calcio y vitamina D para todas, sea cual sea su riesgo de fractura (Hadji 2025), con ejercicio en carga (Fong y Patel 2026). Las fuentes leídas no dan una dosis propia para el hueso ni tratan la terapia manual en estas pacientes; si tiene osteoporosis, sigue la tarjeta.',
        ],
        detalle: [
          'El metaanálisis reunió 9 estudios con 743 participantes, siempre con aeróbico y en 5 también fuerza, de 6 semanas a 12 meses, al menos 120 minutos por semana y al 60–80 % de la frecuencia cardíaca máxima; en un estudio hubo dolor articular y muscular por sobrecarga que cedió en 1–2 semanas (Lu 2020). Cuenta como estudios distintos varios artículos del mismo ensayo, lo que puede inflar el efecto.',
          'En el ensayo, el índice WOMAC de las piernas bajó un 37 % y el DASH del brazo un 33 %, no hubo relación entre dosis y efecto, y los resultados valen sobre todo para mujeres inactivas que siguen con el fármaco pese al dolor (Irwin 2015).',
        ],
      },
      sueno: {
        texto: [
          'Inhibidores de la aromatasa: los sofocos y los sudores nocturnos alteran el sueño (Tenti 2020), y el insomnio está entre sus efectos frecuentes (Fong y Patel 2026). Las fuentes leídas no tratan el sueño como resultado propio.',
          'Bifosfonatos y denosumab: las fuentes leídas no tratan el sueño. Tomar un comprimido justo antes de acostarse favorece la esofagitis (Sharma 2026).',
        ],
      },
      consultar: {
        texto: [
          'Pronto, con imagen del fémur: un dolor de muslo, ingle o cadera sin explicación con bifosfonato o denosumab. La guía británica pide imagen del fémur (radiografía del fémur entero, gammagrafía o resonancia) y, si hay fractura atípica, también del otro (Gregson 2025). Hasta entonces, sin impacto ni carga de esa pierna. Con la tarjeta de osteoporosis marcada, la pregunta está en el cribado de la fase 2.',
          'Urgente: convulsiones, espasmo de la garganta con dificultad para respirar, palpitaciones o desmayo con hormigueos o espasmos, con denosumab o zoledronato (Anastasopoulou y Goyal 2026); vómito con sangre o heces negras con un bifosfonato oral (Sharma 2026); hinchazón de cara, labios o garganta con un inhibidor de la aromatasa (Fong y Patel 2026).',
          'Pronto, con su médico: hormigueos alrededor de la boca o en manos y pies, calambres o espasmos con denosumab o zoledronato (Gregson 2025; Anastasopoulou y Goyal 2026); dolor detrás del esternón o al tragar con un bifosfonato oral (Sharma 2026); ojo rojo y doloroso o visión borrosa tras el zoledronato, en oftalmología (Greear 2024); fiebre tras la infusión, para descartar una infección (Alaranji y Reilly 2025); dolor de oído, supuración o infecciones de oído que no curan (Gregson 2025). Al dentista: dolor de muelas o de mandíbula, dientes que se mueven, hinchazón o hueso a la vista en la boca (Gregson 2025; Ruggiero 2022).',
          'Denosumab, no se deja ni se retrasa: si no se pone a tiempo su efecto se pierde (Hildebrand 2024), y al dejarlo aumentan las fracturas vertebrales, a menudo varias a la vez (Gregson 2025; Tsourdi 2021). Aparecen sobre todo entre 6 y 18 meses tras la última inyección (mediana de 10–11) (Anastasilakis 2021; Tsourdi 2021), y 4 meses de retraso ya aumentan el riesgo (Anastasilakis 2021). Si se le ha pasado la inyección o la ha dejado, que lo hable pronto con su médico: dejarlo exige pasar a otro fármaco, y eso lo decide él (Gregson 2025; Tsourdi 2021). Un dolor de espalda brusco en quien ha dejado el denosumab hace pensar en una fractura vertebral.',
          'Bifosfonatos, pausas pautadas: como se quedan en el hueso, su médico puede pautar una pausa tras 3–5 años si el riesgo es bajo (Adler 2016; Alaranji y Reilly 2025); no es lo mismo que dejar el denosumab (Tsourdi 2021). La guía británica no apoya las pausas sistemáticas, sino revisar el tratamiento (Gregson 2025).',
          'Inhibidores de la aromatasa: abandonarlos se asocia a más recaídas del cáncer (Hyder 2021). Si dice que lo ha dejado o que se lo salta por el dolor, que lo hable con su oncólogo. Nunca aconsejes dejar ninguno de estos fármacos ni cambiar la dosis por tu cuenta. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Fuentes que no coinciden en la urgencia del dolor de muslo: la guía británica pide imagen, con recomendación fuerte y sin plazo (Gregson 2025); una revisión la pide urgente y de los dos fémures (Gehrke 2023). Y en el momento de las fracturas tras dejar el denosumab: 3–6 meses después de la dosis que tocaba (Gregson 2025), o 6–18 meses tras la última (Anastasilakis 2021). Al dejarlo, el riesgo anual de fractura vertebral fue parecido al del placebo; lo que aumentó fue la proporción de fracturas múltiples (60,7 % frente a 38,7 %) (Tsourdi 2021).',
          'Combinaciones que hay que comentar con quien prescribe: los corticoides aumentan el riesgo de fractura atípica y de osteonecrosis de mandíbula (Gregson 2025); con un inhibidor de la aromatasa, dejar el denosumab podría agravar el rebote (Anastasilakis 2021).',
        ],
      },
    },
    fuentes: ['Gregson 2025', 'Kanis 2019', 'Shane 2014', 'Black 2020', 'Adler 2016', 'Tsourdi 2021', 'Anastasilakis 2021', 'Ruggiero 2022', 'Gehrke 2023', 'Zeng 2024', 'Wang 2025', 'Jin 2021', 'Alaranji y Reilly 2025', 'Anastasopoulou y Goyal 2026', 'Sharma 2026', 'Hildebrand 2024', 'Greear 2024', 'Nischal y Gupta 2023', 'Fong y Patel 2026', 'Hyder 2021', 'Tenti 2020', 'Shin 2022', 'Hadji 2025', 'Irwin 2015', 'Lu 2020'],
  },
];

export const TEXTOS_FARMACOS = {
  intro: 'Qué vigilar en la valoración y el tratamiento cuando el paciente toma estos fármacos: cómo cambian el dolor y la inflamación, qué síntomas pueden confundirse con dolor musculoesquelético, qué precauciones pide el ejercicio y cómo afectan al sueño.',
  limites: 'No es una guía para cambiar la medicación: cualquier duda sobre dosis, suspensión o interacciones entre fármacos se consulta con el médico o el farmacéutico.',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Mientras tanto puedes preguntar a la IA con un guion para fisioterapeutas (sin datos del paciente; PhysiQ no revisa la respuesta).',
  preguntar: 'Preguntar a la IA sobre fármacos →',
  cima: 'Ficha técnica (CIMA)',
  cimaTitulo: 'Abre el buscador de CIMA (AEMPS) en otra pestaña y copia «{n}»',
  cimaNota: 'Ficha técnica: al tocar un principio activo se abre el buscador de CIMA (AEMPS) y el nombre queda copiado. Pégalo en «Escribe el nombre del principio activo» y pulsa Buscar.',
  cimaCopiado: '«{n}» copiado: pégalo en «Escribe el nombre del principio activo» y pulsa Buscar.',
  cimaSinCopiar: 'Busca «{n}» en CIMA, en «Escribe el nombre del principio activo».',
  pie: 'Cada familia se escribe con fuentes leídas y revisadas antes de publicarse. Toca una cita para ver la referencia.',
};
