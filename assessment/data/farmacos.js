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
  // AINE (2026-10): cinco revisiones leídas enteras en PMC. Sin fuente leída
  // todavía para la presentación clínica de la úlcera (melena, dolor referido
  // a la espalda o al hombro) ni para el sueño: docs/farmacologia.md.
  {
    id: 'aine',
    nombre: 'AINE (antiinflamatorios no esteroideos)',
    ejemplos: 'Ibuprofeno, naproxeno, diclofenaco, dexketoprofeno, celecoxib, etoricoxib',
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
          'Riñón y tensión arterial: retienen sodio y agua, con edema a menudo sin síntomas, y pueden subir la tensión (Lucas 2019; Bindu 2020). La lesión renal es rara en personas sanas a dosis habituales; el riesgo se concentra en mayores, enfermedad renal, hepática o cardíaca, deshidratación y quien toma a la vez diuréticos o fármacos del sistema renina-angiotensina (Lucas 2019).',
        ],
        detalle: [
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
        texto: 'Las fuentes leídas no describen un efecto directo de los AINE sobre el sueño. Pendiente de una fuente que lo trate.',
      },
      consultar: {
        texto: [
          'Sangrado digestivo visible: parar toda actividad y buscar atención médica (Papantoniou 2023). El sangrado oculto con anemia necesita estudio (Papantoniou 2023).',
          'También edema, poca orina o proteinuria pocos días después de empezarlos (Lucas 2019); ictericia, náuseas y fiebre; subida de la tensión, sobre todo con enfermedad renal crónica; o broncoespasmo en una persona con asma (Bindu 2020).',
          'Las dudas sobre la dosis, la duración o la combinación con otros fármacos, al médico o al farmacéutico.',
        ],
      },
    },
    fuentes: ['Schug 2021', 'Bindu 2020', 'Lucas 2019', 'Papantoniou 2023', 'Pannone y Abbott 2024'],
  },
  // Corticoides (2026-10): seis revisiones o estudios leídos enteros en PMC y
  // la guía de Beuschlein 2024 por secciones. Sin fuente leída para que
  // enmascaren la fiebre, la fragilidad de la piel, el reposo o la carga tras
  // una infiltración ni el sangrado digestivo con AINE: docs/farmacologia.md.
  {
    id: 'corticoides',
    nombre: 'Corticoides',
    ejemplos: 'Prednisona, metilprednisolona, dexametasona; infiltraciones (triamcinolona, betametasona)',
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
          'Una infiltración en los 3 meses previos a una prótesis de rodilla, cadera u hombro aumenta el riesgo de infección de la prótesis (Grusky 2026).',
        ],
      },
      visceral: {
        texto: [
          'Osteonecrosis: el primer síntoma es un dolor óseo persistente que limita el movimiento y empeora al cargar y con la actividad. Afecta sobre todo a la cabeza femoral, y también a rodilla, hombro, tobillo o mano, a menudo en varias zonas a la vez (Kaneko 2021). El riesgo sube con dosis altas, por encima de 30 mg/día de prednisona o equivalente (Pofi 2023).',
          'Fractura vertebral: es la fractura más característica de la osteoporosis por glucocorticoides (Compston 2018). Hasta un 20 % de los pacientes tiene una fractura por fragilidad en el primer año de tratamiento, sobre todo en la columna, el fémur proximal y las costillas (Pofi 2023).',
          'Miopatía: debilidad proximal (hombros, muslos) de inicio insidioso y sin dolor, con análisis y electromiograma habitualmente normales. En una cohorte apareció tras una mediana de 97 días; se preguntaba por dificultad para subir escaleras, salir de la bañera, levantarse del váter o mantener los brazos por encima de la cabeza (He 2025).',
          'Al bajar la dosis, hasta la mitad de los pacientes tiene un síndrome de retirada con dolor muscular y articular, debilidad, cansancio y alteraciones del sueño y del ánimo, sobre todo por debajo de 15 mg/día de prednisona; también puede reaparecer la enfermedad de base (Beuschlein 2024).',
        ],
        detalle: [
          'Infección: el riesgo sube desde el inicio. Con más de 5 mg/día durante más de 6 meses se duplica el riesgo de infección grave, que baja en los 6 meses siguientes a dejarlos; además atenúan la respuesta de los neutrófilos a los estímulos inflamatorios (Pofi 2023). La artritis séptica tras una infiltración es rara (0,03–0,08 %) (Grusky 2026).',
          'Glucosa: una sola dosis puede subir mucho la glucosa, con o sin diabetes previa, y el mayor efecto suele darse entre la 2.ª y la 4.ª semana (Pofi 2023; Soura 2026). Las infiltraciones intraarticulares e intramusculares también se han asociado a hiperglucemia (Soura 2026).',
          'En el lupus, las lesiones de osteonecrosis se detectaron en los primeros 5 meses de dosis altas, y más de la mitad de los pacientes estaba ya en fase avanzada cuando aparecieron los síntomas (Kaneko 2021).',
        ],
      },
      ejercicio: {
        texto: [
          'Fractura: el riesgo sube a los 3–6 meses de empezar y depende de la dosis (Compston 2018), incluso desde 2,5 mg/día; es mayor en los primeros meses, baja alrededor de un 30 % a los 6 meses de dejarlos y se normaliza a los 12 (Pofi 2023). La fractura aparece con una densidad ósea más alta que sin corticoides (Compston 2018). Las fuentes leídas no dan normas para la terapia manual ni para la carga: tenlo en cuenta al elegir técnicas de alta velocidad o carga axial intensa.',
          'El ejercicio adaptado a cada paciente y la prevención de caídas forman parte del manejo de la osteoporosis por glucocorticoides, aunque con pocas pruebas (Compston 2018). Las caídas pasaron de 1,6 a 2,8 por 100 personas-año al empezar los corticoides orales (He 2025).',
          'Miopatía: el ejercicio puede atenuarla según los estudios que cita una cohorte, en la que los síntomas mejoraron tras una mediana de 107 días; recomienda cribar las caídas en mayores de 50 años (He 2025).',
          'Glucosa: la actividad física forma parte del consejo para mantener el control glucémico (Soura 2026). En un paciente con diabetes, ten presente la subida pasajera de la glucosa tras una infiltración (Grusky 2026; Soura 2026).',
        ],
        detalle: 'Las fuentes leídas no dan un protocolo de reposo ni de carga del tendón tras una infiltración: sigue la indicación de quien la puso.',
      },
      sueno: {
        texto: [
          'La exposición prolongada a dosis altas se asocia a alteraciones del sueño, del ánimo y cognitivas; psicosis, manía, depresión o ansiedad aparecen en un 3–60 % según los estudios (Pofi 2023). Tras una infiltración puede aparecer insomnio, en general pasajero (Grusky 2026), y al bajar la dosis, alteraciones del sueño dentro del síndrome de retirada (Beuschlein 2024).',
        ],
        detalle: 'Tomar más dosis por la tarde que por la mañana se asocia a más efectos adversos (Pofi 2023); las fuentes leídas no estudian su efecto concreto sobre el sueño.',
      },
      consultar: {
        texto: [
          'Urgente: con corticoides actuales o recientes, por cualquier vía (también infiltraciones, inhalados o tópicos), hipotensión, colapso o síntomas abdominales agudos pueden ser una crisis suprarrenal, que puede ocurrir si se saltan dosis o con una gastroenteritis (Beuschlein 2024).',
          'Tras infiltraciones, sobre todo en los 2 meses siguientes o con varias en poco tiempo, hay que estar atento a síntomas de insuficiencia suprarrenal (Beuschlein 2024).',
          'Pronto: dolor óseo persistente que empeora al cargar, sobre todo en la cadera o la rodilla (Kaneko 2021); debilidad proximal nueva (He 2025); síntomas de hiperglucemia (Soura 2026).',
          'Nunca aconsejes bajar ni dejar los corticoides: tras un uso prolongado se retiran de forma pautada (Beuschlein 2024). Las dudas, al médico que los prescribe.',
        ],
      },
    },
    fuentes: ['Pofi 2023', 'Compston 2018', 'Kaneko 2021', 'Grusky 2026', 'He 2025', 'Beuschlein 2024', 'Soura 2026'],
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
  // Sampaio-Cunha y Martins 2022; ver el registro). Sin fuente leída para los
  // signos clásicos de sobredosis (pupilas puntiformes, respiración lenta), los
  // efectos propios del tramadol (hiponatremia, hipoglucemia, convulsiones), la
  // retención urinaria, la curación de tejidos ni la terapia manual:
  // docs/farmacologia.md.
  {
    id: 'opioides',
    nombre: 'Opioides',
    ejemplos: 'Tramadol, tapentadol, codeína, morfina, oxicodona, fentanilo, buprenorfina',
    apartados: {
      dolor: {
        texto: [
          'En el dolor subagudo y crónico, frente a placebo, mejoran poco el dolor a corto plazo (0,79 puntos sobre 10), y la mejoría baja con el tiempo, de 1 punto a los 1–3 meses a unos 0,5 a los 3–6 meses; no hay ensayos con placebo más allá de 6 meses. Dos sociedades médicas estadounidenses desaconsejan los opioides, también el tramadol, para el dolor agudo por lesiones musculoesqueléticas (Dowell 2022).',
          'El ejercicio terapéutico reduce el dolor y mejora la función en la lumbalgia, la fibromialgia y la artrosis de cadera o rodilla, con beneficios que se mantienen 2–6 meses, y puede sumarse a la medicación (Dowell 2022).',
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
          'Al dejarlos o bajar la dosis, el síndrome de abstinencia da dolor muscular, náuseas, diarrea, sudor, insomnio y ansiedad; con los de acción corta empieza a las 8–12 h y cede en 3–5 días (Dufort y Samaan 2021). El dolor también puede empeorar durante la retirada (Dowell 2022).',
        ],
        detalle: [
          'Síndrome serotoninérgico: el tramadol inhibe la recaptación de serotonina y noradrenalina, y el tramadol y el fentanilo son los opioides que más aparecen en los casos publicados. Da alteración mental, agitación, mioclonías, hiperreflexia, sudor, escalofríos, temblor, diarrea, falta de coordinación o fiebre, y puede ser mortal (Blyzniuk 2026).',
          'Hueso: en un estudio, la mitad de los varones que tomaban morfina tenía osteopenia y un 21 % osteoporosis (De Vries 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, somnolencia y caídas: frente a placebo dan más mareo y somnolencia (Dowell 2022). En mayores producen sedación, falta de coordinación, mareo y caídas, con más fracturas de cadera y no vertebrales (Dufort y Samaan 2021). La guía de los CDC pide en mayores de 65 vigilar el deterioro cognitivo, valorar el riesgo de caídas y usar el ejercicio para prevenir el estreñimiento (Dowell 2022).',
          'Subir la dosis deprisa aumenta la sedación y la depresión respiratoria. En trabajos de riesgo (conducir, maquinaria pesada, alturas), la guía pide valorar si el paciente puede hacerlos (Dowell 2022).',
          'Mantener o aumentar la actividad física, junto con el agua y la fibra, ayuda a prevenir el estreñimiento; durante una retirada pautada, la guía pide aprovechar al máximo los tratamientos del dolor sin fármacos (Dowell 2022).',
        ],
        detalle: 'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
      },
      sueno: {
        texto: [
          'Pueden empeorar el sueño, y dormir mal baja el umbral del dolor y lleva a subir la dosis; en el dolor crónico también pueden mejorarlo al reducir el dolor (Langstengel y Yaggi 2022).',
          'Causan depresión respiratoria y apnea del sueño central según la dosis, y la mayoría de las muertes por opioides ocurren durante el sueño (Langstengel y Yaggi 2022). La apnea del sueño aumenta el riesgo de depresión respiratoria grave o sobredosis (Dowell 2022).',
        ],
        detalle: 'Tras una retirada pautada, algunos pacientes refieren insomnio, ansiedad, depresión y más dolor, sobre todo al principio (Dowell 2022).',
      },
      consultar: {
        texto: [
          'Urgente: confusión, sedación o habla arrastrada pueden anunciar una sobredosis, y la naloxona revierte la depresión respiratoria grave (Dowell 2022). Signos de síndrome serotoninérgico en quien toma tramadol con un antidepresivo (Blyzniuk 2026).',
          'Combinaciones que hay que comentar con quien prescribe: benzodiacepinas (casi cuadruplican el riesgo de muerte por sobredosis), gabapentina o pregabalina, relajantes musculares, otros sedantes y alcohol (Dowell 2022).',
          'Pronto: dolor abdominal nuevo o que empeora (Camilleri 2017); síntomas de abstinencia; dolor que aumenta pese a subir la dosis (Sampaio-Cunha y Martins 2022); cansancio, hipotensión al levantarse o problemas sexuales en tratamientos largos (De Vries 2020).',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: no deben retirarse de golpe, y una retirada rápida puede causar abstinencia, más dolor, malestar psicológico grave e ideas de suicidio; la retirada se planifica con quien los prescribe (Dowell 2022).',
        ],
      },
    },
    fuentes: ['Dowell 2022', 'Sampaio-Cunha y Martins 2022', 'Camilleri 2017', 'Dufort y Samaan 2021', 'De Vries 2020', 'Blyzniuk 2026', 'Langstengel y Yaggi 2022'],
  },
  // Gabapentinoides (2026-10): siete fuentes (cinco enteras en PMC, Carvalho 2022
  // leída en parte, y los capítulos de StatPearls de gabapentina y pregabalina,
  // PDF del usuario). Enke 2018 solo dio el resumen y no se cita. Sin fuente
  // leída para caídas y fracturas en mayores, inflamación y curación de los
  // tejidos, terapia manual, mioclonías ni sueño en pacientes con dolor
  // musculoesquelético: docs/farmacologia.md.
  {
    id: 'gabapentinoides',
    nombre: 'Gabapentinoides',
    ejemplos: 'Gabapentina, pregabalina',
    apartados: {
      dolor: {
        texto: [
          'En la ciática, la pregabalina no alivió más el dolor ni mejoró más la discapacidad que el placebo en seguimientos de hasta 52 semanas, y la gabapentina tampoco a las 8 semanas; una diferencia a los 3–4 meses no llegó a ser clínicamente relevante (menos de 2 puntos sobre 10). La revisión concluye que no hay evidencia que apoye su uso sistemático en la ciática ni en la lumbalgia (Giménez-Campos 2021). Un capítulo de StatPearls afirma que la pregabalina no debería prescribirse para el dolor musculoesquelético (Cross 2024).',
          'En el dolor neuropático sí superan al placebo: el número necesario a tratar es de 8 y 10 para la pregabalina (reducción del dolor de al menos 30 % y 50 %) y de 7 y 8 para la gabapentina (Meaadi 2023). Las indicaciones aprobadas de la gabapentina son la neuralgia posherpética y, como complemento, las crisis parciales (Yasaei 2024); las de la pregabalina, el dolor neuropático de la neuropatía diabética, la lesión medular y la neuralgia posherpética, y la fibromialgia (Cross 2024).',
        ],
        detalle: [
          'En la estenosis lumbar, a corto plazo no redujeron el dolor más que los AINE, el limaprost o la difenhidramina; a medio plazo parecieron algo más eficaces, sin ventaja en discapacidad (ODI) y con más efectos adversos. Son seis estudios con 392 pacientes y controles distintos entre sí (Martínez 2023).',
          'Una revisión narrativa que defiende el fármaco señala que no beneficia a todos los pacientes y que tiene sentido elegirlo según la fisiopatología y el perfil de síntomas (McAnally 2020).',
          'El efecto de la gabapentina suele notarse en la primera semana, aunque la mejoría importante puede tardar hasta un mes (Yasaei 2024). En el dolor tras una lesión medular, la pregabalina puede mejorar el dolor desde la primera semana y se pide probarla 4–6 semanas si se tolera (Cross 2024).',
          'Las fuentes leídas no tratan su efecto sobre la inflamación ni sobre la curación de los tejidos.',
        ],
      },
      visceral: {
        texto: [
          'Edema periférico y aumento de peso: con gabapentina, frente a placebo, el aumento de peso (RR 5,6) y el edema periférico (RR 3,1) estuvieron entre los efectos con mayor riesgo relativo, y con pregabalina el aumento de peso (RR 5,0) (Meaadi 2023). El aumento de peso de la pregabalina depende de la dosis y llega hasta el 14 % con 600 mg al día (Cross 2024). Se ha descrito una cascada de prescripción: tras empezar uno de los dos, aumenta el uso posterior de diuréticos de asa (Cross 2024).',
          'Dolor o debilidad muscular sin explicar: se han descrito casos de rabdomiólisis con la gabapentina (Yasaei 2024) y, en el registro de acontecimientos adversos de la FDA, con la pregabalina, por lo que se pide comunicar enseguida cualquier síntoma muscular sin explicar (Cross 2024).',
          'Entre las reacciones frecuentes de la gabapentina figuran náuseas, vómitos, diarrea, estreñimiento, boca seca, fatiga, visión doble, temblor y dolor de espalda (Yasaei 2024). En la ciática, el mareo y las náuseas o vómitos fueron más frecuentes con pregabalina que con placebo (Giménez-Campos 2021).',
          'Depresión e ideas de suicidio: ambos fármacos pueden provocarlas o empeorarlas, y se vigilan durante el tratamiento (Yasaei 2024). Los antiepilépticos como la pregabalina pueden aumentar el riesgo de pensamientos o conductas suicidas (Cross 2024).',
          'Reacciones de hipersensibilidad graves con la gabapentina: síndrome de Stevens-Johnson, angioedema, anafilaxia y DRESS (hipersensibilidad multiorgánica), esta última a veces mortal (Yasaei 2024).',
          'Retirada brusca: con la pregabalina, insomnio, náuseas, cefalea, ansiedad, nerviosismo, irritabilidad, sudoración y diarrea (Cross 2024); con la gabapentina, crisis de retirada (Yasaei 2024). Pueden dar dependencia física con dosis moderadas o altas y uso prolongado (McAnally 2020).',
        ],
        detalle: [
          'La pregabalina produjo euforia a dosis terapéuticas y la gabapentina no; ningún ensayo evaluó el abuso ni el trastorno por uso indebido (Meaadi 2023). Entre quienes tienen un trastorno por uso de sustancias, sobre todo de opioides, el uso indebido llega hasta el 20 % (McAnally 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, somnolencia y marcha: son las reacciones más frecuentes y las que más llevaron a abandonar la pregabalina; la mayoría fueron leves o moderadas, dependientes de la dosis y aparecieron en las 2 primeras semanas (Cross 2024). Con pregabalina fueron mucho más frecuentes que con placebo la incoordinación (RR 7,2), la marcha anormal (RR 6,7) y la ataxia (RR 6,0); con gabapentina, el mareo (RR 3,3) y la somnolencia (RR 2,9) (Meaadi 2023). Otra revisión añade sedación e inestabilidad de la marcha, y que una de cada tres personas notó mareo o somnolencia a dosis terapéuticas (Martínez 2023).',
          'Mayores y función renal: ambos fármacos se eliminan por vía renal y el aclaramiento baja en los mayores y con disfunción renal, con más riesgo de reacciones adversas (Yasaei 2024; Cross 2024). Las fuentes leídas no cuantifican caídas ni fracturas.',
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
          'La Academia Americana de Medicina del Sueño sugiere la gabapentina para el síndrome de piernas inquietas moderado o grave (Yasaei 2024). Las fuentes leídas no estudian su efecto sobre el sueño en el dolor musculoesquelético.',
        ],
      },
      consultar: {
        texto: [
          'Urgente: angioedema, anafilaxia, erupción grave (síndrome de Stevens-Johnson) o hipersensibilidad multiorgánica, que exigen valoración médica inmediata (Yasaei 2024). Confusión, agitación o disminución de la conciencia pueden ser signos de sobredosis, más con otros depresores del sistema nervioso (Cross 2024). Respiración lenta o dificultad para respirar con opioides (Yasaei 2024). Depresión nueva o que empeora, o ideas de suicidio (Cross 2024). Temblor, alteración mental o dificultad respiratoria en quien tiene enfermedad renal o está en diálisis (Yasaei 2024).',
          'Combinaciones que hay que comentar con quien prescribe: opioides (depresión respiratoria y sedación, a veces mortales; Yasaei 2024), benzodiacepinas y alcohol (efecto sinérgico; Cross 2024) y gabapentina con pregabalina a la vez, que está contraindicada (Yasaei 2024). Los criterios de Beers de 2019 recomiendan evitar la combinación con opioides por el riesgo de depresión respiratoria (Hahn 2022).',
          'Pronto: mareo, somnolencia o inestabilidad al caminar nuevos o que empeoran; en la estenosis lumbar, la mayoría de quienes los tuvieron abandonó el tratamiento (Martínez 2023). Dolor o debilidad muscular sin explicar, edema o aumento de peso nuevos (Cross 2024). Síntomas de retirada (Cross 2024).',
          'El uso indebido es más probable en personas con trastorno por uso de opioides o antecedentes de abuso de sustancias (McAnally 2020; Cross 2024): coméntalo con quien los prescribe.',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: la retirada brusca puede dar síntomas y crisis de retirada, y se hace de forma gradual con quien los prescribe (Yasaei 2024; Cross 2024). Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinados con opioides, un metaanálisis encontró más mareo (OR 3,26), disfunción cognitiva (OR 3,13) y depresión respiratoria (OR 1,71) en los estudios no aleatorizados, pero ninguna diferencia en depresión respiratoria en los ensayos aleatorizados; con más de 1 dosis diaria definida, la mortalidad ajustada fue mayor (OR 2,76). Los gabapentinoides reducen además la respuesta al CO2 del centro respiratorio bulbar (Hahn 2022).',
        ],
      },
    },
    fuentes: ['Giménez-Campos 2021', 'Meaadi 2023', 'Martínez 2023', 'McAnally 2020', 'Hahn 2022', 'Carvalho 2022', 'Yasaei 2024', 'Cross 2024'],
  },
  // Antidepresivos (2026-10): nueve fuentes enteras en PMC, siete capítulos de
  // StatPearls y dos revisiones Cochrane (PDF del usuario). Birkinshaw 2023 y
  // Moore 2015 solo dieron el resumen y no se citan. Sin fuente leída para el
  // efecto sobre la inflamación y la curación, si enmascaran signos, terapia
  // manual, ejercicio con calor ni conducción: docs/farmacologia.md.
  {
    id: 'antidepresivos',
    nombre: 'Antidepresivos (ISRS, IRSN, tricíclicos)',
    ejemplos: 'Sertralina, escitalopram, duloxetina, venlafaxina, amitriptilina',
    apartados: {
      dolor: {
        texto: [
          'Lumbalgia inespecífica: los IRSN (duloxetina) probablemente tienen un efecto pequeño en el dolor (5,25 puntos menos sobre 100) y trivial en la discapacidad (0,91 puntos menos sobre 24) a corto plazo; los tricíclicos probablemente apenas cambian el dolor, con un efecto pequeño en la discapacidad (1,76 puntos menos sobre 24), y para los ISRS la evidencia es insuficiente. No hay datos de más de 12 meses, y los resultados quizá no valgan para mayores ni para quien tiene otras enfermedades importantes, porque solían excluirse de los ensayos (Ferraro 2025).',
          'Fibromialgia: con duloxetina o milnaciprán, el 31 % logró al menos un 50 % de alivio frente al 21 % con placebo (NNT 11), una diferencia que la revisión no considera clínicamente relevante; sí lo es la del alivio de al menos un 30 % (NNT 10). De media, sus posibles daños superan a sus beneficios, aunque una minoría mejora mucho sin efectos relevantes (Welsch 2018). Los tricíclicos son de segunda línea en la fibromialgia (Moraczewski 2023).',
          'Mayores de 65 años: en la artrosis de rodilla, la duloxetina dio un efecto muy pequeño (9,1 puntos menos sobre 100) que puede no compensar sus riesgos, y los autores no la ven adecuada como tratamiento único (Narayan 2024).',
          'Las fuentes leídas no tratan su efecto sobre la inflamación ni sobre la curación de los tejidos, ni si enmascaran signos en la exploración.',
        ],
        detalle: [
          'Las guías de fibromialgia desaconsejan tratarla solo con fármacos y piden combinarlos con ejercicio aeróbico y terapias psicológicas; el ejercicio aeróbico sirve para la fatiga, en la que estos fármacos no ayudan (Welsch 2018).',
          'La duloxetina está aprobada para el dolor musculoesquelético crónico (lumbalgia crónica y dolor de la artrosis), la fibromialgia y el dolor neuropático diabético, con un máximo de 60 mg al día, y refuerza las vías descendentes que inhiben el dolor en la médula (Biswas 2026). La amitriptilina se usa fuera de indicación en el dolor crónico, empezando con 10–20 mg al día (Thour 2026).',
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
          'Hígado: la duloxetina se evita con consumo importante de alcohol o enfermedad hepática crónica (Biswas 2026).',
          'En los casos publicados de síndrome serotoninérgico, el tramadol, el fentanilo y la trazodona fueron los fármacos que más acompañaban al desencadenante; con prescripción habitual, el 36 % ingresó en la UCI y el 5 % murió (Blyzniuk 2026).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, ortostatismo y caídas: los tricíclicos se asociaron a mucha más hipotensión ortostática que el placebo (OR 6,30), y los ISRS no (Bhanu 2021). La amitriptilina da hipotensión ortostática, mareo y sedación (Thour 2026). La duloxetina puede dar hipotensión ortostática, caídas y síncope, sobre todo al empezar o al subir la dosis (Biswas 2026).',
          'Mayores: los criterios de Beers piden evitar la amitriptilina por sus efectos anticolinérgicos (Thour 2026), y la duloxetina si ya hubo caídas o fracturas, por la ataxia y la hipotensión ortostática (Biswas 2026). En los tricíclicos se pide vigilar las caídas y el deterioro cognitivo (Moraczewski 2023).',
          'Hueso: los tricíclicos aumentan el riesgo de fracturas (Thour 2026), y un metaanálisis asocia los ISRS a más fracturas de cadera, con más riesgo cuanto más largo es el uso (De Filippis 2022).',
          'Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.',
        ],
        detalle: [
          'La hipotensión ortostática es una bajada de al menos 20 mmHg de sistólica o 10 de diastólica en los 3 minutos siguientes a ponerse de pie, y afecta a entre el 30 y el 70 % de los mayores. Los datos de los tricíclicos son de dosis para la depresión; los autores creen que a dosis bajas también pueden perjudicar a los mayores y aconsejan medir la tensión al cambiar de postura (Bhanu 2021).',
          'Un estudio citado en una revisión encontró más caídas con la duloxetina (HR 1,6) y algo más con los tricíclicos (HR 1,2) (Narayan 2024).',
          'Calor: el síndrome serotoninérgico altera la regulación de la temperatura (Simon 2024) y la hiponatremia es más frecuente en verano (Filippatos 2017); las fuentes leídas no estudian el ejercicio con calor ni la conducción.',
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
    fuentes: ['Ferraro 2025', 'Welsch 2018', 'Narayan 2024', 'Moraczewski 2023', 'Biswas 2026', 'Thour 2026', 'Alam 2022', 'Nochaiwong 2022', 'Wang 2018', 'Singh y Saadabadi 2024', 'Zhang 2026', 'Filippatos 2017', 'Simon 2024', 'Blyzniuk 2026', 'Chu y Wadhwa 2023', 'Bhanu 2021', 'De Filippis 2022', 'Wichniak 2017', 'Waseem 2026', 'Horowitz 2023'],
  },
  // Benzodiacepinas y relajantes musculares (2026-10): nueve fuentes enteras
  // en PMC y siete capítulos de StatPearls (PDF del usuario). Sin fuente leída
  // para el efecto sobre la inflamación y la curación, si enmascaran signos,
  // terapia manual ni dosificación del ejercicio: docs/farmacologia.md.
  {
    id: 'sedantes',
    nombre: 'Benzodiacepinas y relajantes musculares',
    ejemplos: 'Diazepam, lorazepam, alprazolam, ciclobenzaprina, metocarbamol, tizanidina, baclofeno',
    apartados: {
      dolor: {
        texto: [
          'Lumbalgia inespecífica: los relajantes no benzodiacepínicos (ciclobenzaprina, metocarbamol, tizanidina y otros) redujeron el dolor 7,7 puntos sobre 100 en las 2 primeras semanas, con certeza muy baja y por debajo de los 10 puntos que los autores consideran clínicamente relevantes; el efecto desaparecía al dejar fuera los ensayos con alto riesgo de sesgo, y no hubo efecto a las 3–13 semanas ni en la discapacidad. Las benzodiacepinas (diazepam) no mejoraron el dolor; un único ensayo vio menos discapacidad a las 3–13 semanas. No hay ensayos a largo plazo (Cashin 2021).',
          'En la lumbalgia aguda, las guías ponen primero los tratamientos no farmacológicos, y por su evolución favorable los autores piden prudencia con los analgésicos (Wewege 2023). En el dolor crónico, el uso prolongado mostró beneficio sobre todo en espasmos, calambres dolorosos y dolor cervical; en lumbalgia y fibromialgia, en conjunto, no (Oldfield 2024).',
          'La ciclobenzaprina está aprobada como complemento del reposo y la fisioterapia en el espasmo muscular agudo, solo 2–3 semanas, y no sirve para la espasticidad (Khan y Kahwaji 2023); el metocarbamol tampoco (Sibrack 2024). La tizanidina y el baclofeno se indican para la espasticidad de origen neurológico; el uso del baclofeno en la lumbalgia es limitado (Ghanavatian y Derian 2023; Ghanavatian y Derian 2024).',
          'Las fuentes leídas no tratan su efecto sobre la inflamación ni sobre la curación de los tejidos, ni si enmascaran signos en la exploración.',
        ],
        detalle: [
          'En el metaanálisis en red de la lumbalgia aguda, los relajantes no benzodiacepínicos redujeron el dolor 14,3 puntos sobre 100 frente a placebo, con confianza muy baja (Wewege 2023).',
          'No hay pruebas de alta calidad de que el metocarbamol sea mejor que un AINE, y añadirlo al naproxeno no mejoró los resultados a la semana en un ensayo pequeño (Sibrack 2024). Tras la cirugía, el efecto analgésico de los relajantes musculares es inconstante (Farishta 2024).',
          'En la fibromialgia, el dolor volvió a subir una semana después de dejar la tizanidina en un estudio (Oldfield 2024).',
        ],
      },
      visceral: {
        texto: [
          'Respiración: con una benzodiacepina sola la depresión respiratoria es poco frecuente, pero el riesgo sube mucho con alcohol, opioides u otros sedantes (Kang 2023); la advertencia de la FDA dice que con opioides pueden causar sedación, depresión respiratoria grave, coma y muerte (Bounds y Patel 2024). En 2021, casi el 88 % de las muertes por sobredosis con benzodiacepinas en EE. UU. implicaban también opioides, y su sedación se suma a la de antihistamínicos, antipsicóticos y gabapentinoides (Brunner 2025). Los relajantes musculares junto con opioides también aumentan el riesgo de sobredosis (Oldfield 2024; Farishta 2024).',
          'Cognición: dan déficits de memoria, aprendizaje y atención y empeoran el delirium en mayores (Capiau 2023), además de amnesia anterógrada y alteración psicomotora; entre el 1 y el 20 % de quienes las toman tiene conductas agresivas (Edinoff 2021). Tras la cirugía, los relajantes musculares duplicaron el delirium en mayores (Farishta 2024).',
          'Tizanidina: hipotensión y bradicardia, a veces graves, y casos de daño hepático grave e insuficiencia hepática, por lo que se controla la función hepática; no se combina con ciprofloxacino ni fluvoxamina, por hipotensión importante y más alteración psicomotora (Ghanavatian y Derian 2023).',
          'Ciclobenzaprina: es de la familia de los tricíclicos y da somnolencia, boca seca, mareo, confusión, taquicardia y retención de orina; con otros serotoninérgicos, como la duloxetina, se han descrito casos de síndrome serotoninérgico (Khan y Kahwaji 2023).',
          'Baclofeno: se elimina por el riñón; con la función renal reducida se acumula, con riesgo de encefalopatía, y con un filtrado de 30 o menos se aconseja evitarlo (Ghanavatian y Derian 2024; Kershner 2026).',
        ],
        detalle: [
          'Los relajantes no benzodiacepínicos aumentaron los efectos adversos (RR 1,6), sobre todo mareo, somnolencia, cefalea y náuseas (Cashin 2021).',
          'Todos los relajantes musculares tienen efectos anticolinérgicos que favorecen la sedación, las caídas y la confusión en mayores. El metocarbamol puede cambiar el color de la orina, sin importancia clínica (Sibrack 2024).',
          'Las benzodiacepinas se asocian a hipotensión ortostática en mayores, por una caída de la tensión más acusada en los primeros 10 segundos al ponerse de pie (Capiau 2023; Brunner 2025).',
        ],
      },
      ejercicio: {
        texto: [
          'Caídas y fracturas: las benzodiacepinas aumentan las caídas (OR 1,39–1,57) y se asocian con fuerza a la fractura de cadera; los hipnóticos Z, como el zolpidem, también aumentan las fracturas (OR 1,63). El riesgo es mayor las primeras semanas tras empezar y con el uso prolongado, por sedación, hipotensión ortostática, mareo, debilidad muscular, ataxia y problemas visuales (Capiau 2023). En mayores con insomnio, multiplicaron por 2,6 los efectos psicomotores, como caídas y accidentes de tráfico (Brunner 2025).',
          'Equilibrio: el efecto depende de la dosis y es máximo en las primeras horas tras la toma; es mayor con dosis altas, con poco tiempo entre la toma y el despertar o con alcohol u otros sedantes, y la inestabilidad es más marcada en mayores (Capiau 2023).',
          'Relajantes musculares en mayores: los criterios de Beers piden evitarlos por caídas, fracturas y alteración cognitiva o psicomotora (Sibrack 2024). Con baclofeno hubo más caídas que con tizanidina (SHR 1,68) y parecidas a las de la ciclobenzaprina (Hwang 2024). El baclofeno da debilidad muscular, y su intoxicación, hipotonía (Ghanavatian y Derian 2024; Kershner 2026).',
          'Conducir: con baclofeno se pide no conducir ni manejar maquinaria por la sedación (Ghanavatian y Derian 2024), y las benzodiacepinas de acción larga se asocian a más accidentes de tráfico (Capiau 2023).',
          'Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.',
        ],
        detalle: [
          'En mayores hospitalizados, las dosis de más de 1 mg/día equivalente de diazepam se asociaron a caídas, y quienes tomaban diazepam, de acción larga, tenían más de tres veces más caídas en 90 días que quienes no tomaban benzodiacepinas (Capiau 2023). El aumento de caídas con lesión es significativo sobre todo por encima de los 80 años (Edinoff 2021).',
          'Con la tizanidina se miden la tensión y la frecuencia cardíaca antes de subir la dosis, por el riesgo de hipotensión grave (Ghanavatian y Derian 2023). El metocarbamol empieza a actuar a los 30 minutos y llega a su máximo a las 2 horas (Sibrack 2024).',
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
          'La ciclobenzaprina puede ayudar al insomnio asociado a la fibromialgia (Khan y Kahwaji 2023) y mejoró los trastornos del sueño en tres estudios (Oldfield 2024).',
        ],
      },
      consultar: {
        texto: [
          'Urgente: sedación extrema, habla arrastrada, ataxia, respiración lenta o superficial o no responder, sobre todo si ha tomado además alcohol u opioides (Bounds y Patel 2024; Kang 2023). Con baclofeno, confusión, depresión respiratoria, convulsiones o parálisis piden atención médica inmediata, igual que las ideas de autolesión o suicidio (Kershner 2026). Signos de síndrome serotoninérgico con ciclobenzaprina y otro serotoninérgico (Khan y Kahwaji 2023).',
          'Retirada: no se dejan de golpe. Con benzodiacepinas, una reducción rápida puede dar convulsiones y delirium potencialmente mortales (Brunner 2025); otros síntomas son irritabilidad, inquietud, sudoración, cefalea, calambres musculares y molestias digestivas (Capiau 2023), y también dolor o rigidez de cabeza y cuello, sensaciones extrañas en las extremidades, debilidad, hormigueos y contracciones musculares (Edinoff 2021). Los síntomas de retirada a menudo se atribuyen a la enfermedad de base o a otra (Brunner 2025). Con baclofeno oral, la retirada brusca puede dar convulsiones y alucinaciones (Ghanavatian y Derian 2024); con tizanidina, taquicardia, tensión alta de rebote y más espasticidad (Ghanavatian y Derian 2023).',
          'Pronto: mareo, inestabilidad, caídas o somnolencia de día nuevos, o confusión en un mayor (Capiau 2023); con tizanidina, mareo, pulso lento o tensión baja (Ghanavatian y Derian 2023); con baclofeno, somnolencia o confusión si tiene enfermedad renal, que aumenta el riesgo de intoxicación (Kershner 2026).',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: la retirada es gradual (Brunner 2025; Kershner 2026), con quien los prescribe. Las dudas, al médico o al farmacéutico.',
        ],
        detalle: [
          'Combinaciones que hay que comentar con quien prescribe: opioides, alcohol y otros sedantes con cualquiera de ellos (Bounds y Patel 2024; Ghanavatian y Derian 2024); tizanidina con ciprofloxacino o fluvoxamina (Ghanavatian y Derian 2023); ciclobenzaprina con otros serotoninérgicos (Khan y Kahwaji 2023). La guía de retirada recomienda ofrecer naloxona a quien toma a la vez benzodiacepinas y opioides (Brunner 2025).',
          'La dependencia física es una consecuencia esperable del uso continuado y no equivale a un trastorno por uso, que solo cumple el 1,5 %. El riesgo de síntomas de retirada es bajo con menos de 1 mes de uso y aparece con tomas de 4 o más días por semana durante 1–3 meses o más; con el alprazolam la dependencia llega antes. Algunos síntomas pueden durar meses o años (Brunner 2025).',
          'Al reducir la dosis se vigilan el mareo, la sedación, las caídas, la ansiedad, el insomnio y la agitación (Capiau 2023). La sobredosis de baclofeno puede dar un coma de hasta 7 días (Ghanavatian y Derian 2024).',
        ],
      },
    },
    fuentes: ['Cashin 2021', 'Wewege 2023', 'Oldfield 2024', 'Khan y Kahwaji 2023', 'Sibrack 2024', 'Ghanavatian y Derian 2023', 'Ghanavatian y Derian 2024', 'Farishta 2024', 'Kang 2023', 'Bounds y Patel 2024', 'Brunner 2025', 'Capiau 2023', 'Edinoff 2021', 'Kershner 2026', 'Hwang 2024', 'Kishi 2026'],
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
    apartados: {
      dolor: {
        texto: [
          'Síntomas musculares: dolor, rigidez, sensibilidad o calambres, en general simétricos y proximales, en grupos musculares grandes (muslos, glúteos, pantorrillas, espalda) y casi siempre sin subida de la CK. Suelen aparecer en las 4–6 primeras semanas, aunque pueden hacerlo tras años, y también al subir la dosis o al añadir un fármaco que interactúa (Stroes 2015).',
          'En los ensayos ciegos, el 27,1 % con estatina y el 26,6 % con placebo refirieron dolor o debilidad muscular; el exceso se concentró en el primer año (RR 1,07) y después desapareció. En ese primer año solo 1 de cada 15 quejas musculares se debía a la estatina: en más del 90 % de quienes las refieren, la causa es otra (CTT 2022). Influye el efecto nocebo: las expectativas negativas hacen que se refieran más efectos adversos de lo esperable (Mach 2018); en un ensayo, los síntomas fueron parecidos con comprimidos de estatina y de placebo, y mucho mayores que sin comprimido (Epelde 2026).',
          'Para distinguirlo de un dolor musculoesquelético: sugieren la estatina los síntomas que empiezan poco después de iniciarla o subir la dosis, mejoran al retirarla y vuelven al reintroducirla; sugieren otra causa los asimétricos, focales o que no cambian al retirarla. La artrosis, la polimialgia reumática, el hipotiroidismo, el déficit de vitamina D y el ejercicio intenso son causas frecuentes (Epelde 2026; Stroes 2015).',
          'Tendón: se han asociado a tendinopatía y rotura, sobre todo del Aquiles, el cuádriceps y el bíceps distal, más en el primer año, sin que la relación esté confirmada; en el manguito rotador, los estudios observacionales sugieren menos enfermedad y menos rerroturas tras la reparación (Yang y Qu 2018). Las fuentes leídas no tratan el hueso ni las fracturas, ni si enmascaran signos en la exploración.',
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
          'Mayores: por encima de 65 años la concentración de atorvastatina es mayor y el riesgo de miopatía también (McIver y Siddique 2025). Las fuentes leídas no tratan la terapia manual, las caídas ni las adaptaciones al entrenamiento.',
        ],
        detalle: [
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
          'Si la rabdomiólisis se detecta pronto, el daño renal suele tener buen pronóstico; en hospitalizados con lesión renal, la mortalidad es del 30–50 % (Rout 2025).',
        ],
      },
    },
    fuentes: ['Stroes 2015', 'CTT 2022', 'Mach 2018', 'Epelde 2026', 'Yang y Qu 2018', 'Sizar 2024', 'Rout 2025', 'McIver y Siddique 2025', 'Talreja y Cassagnol 2023', 'Mangone 2024', 'Broncel 2015'],
  },
  { id: 'fluoroquinolonas', nombre: 'Fluoroquinolonas', ejemplos: 'Ciprofloxacino, levofloxacino, moxifloxacino' },
  { id: 'betabloqueantes', nombre: 'Betabloqueantes', ejemplos: 'Bisoprolol, atenolol, metoprolol, propranolol' },
  { id: 'antihipertensivos', nombre: 'Diuréticos y otros antihipertensivos', ejemplos: 'Hidroclorotiazida, furosemida, enalapril, losartán, amlodipino' },
  { id: 'antidiabeticos', nombre: 'Insulina y antidiabéticos', ejemplos: 'Insulina, metformina, sulfonilureas, inhibidores de SGLT2' },
  { id: 'hueso', nombre: 'Fármacos que tocan el hueso', ejemplos: 'Alendronato, zoledronato, denosumab, inhibidores de la aromatasa' },
];

export const TEXTOS_FARMACOS = {
  intro: 'Qué vigilar en la valoración y el tratamiento cuando el paciente toma estos fármacos: cómo cambian el dolor y la inflamación, qué síntomas pueden confundirse con dolor musculoesquelético, qué precauciones pide el ejercicio y cómo afectan al sueño.',
  limites: 'No es una guía para cambiar la medicación: cualquier duda sobre dosis, suspensión o interacciones entre fármacos se consulta con el médico o el farmacéutico.',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Mientras tanto puedes preguntar a la IA con un guion para fisioterapeutas (sin datos del paciente; PhysiQ no revisa la respuesta).',
  preguntar: 'Preguntar a la IA sobre fármacos →',
  pie: 'Cada familia se escribe con fuentes leídas y revisadas antes de publicarse. Toca una cita para ver la referencia.',
};
