// ============================================================
// PhysiQ-Assessment · data/comun.js
// Sistemas transversales del cribado (fase 2), compartidos por varias
// regiones: cada data/<region>.js los importa y los añade a su `sistemas`.
// ============================================================

// ── DOSIS DE LAS HIPÓTESIS DE DERIVACIÓN ──
// Fracturas, roturas, luxaciones, gota…: lo primero no es fisioterapia sino el
// diagnóstico médico. Texto fijo decidido por el usuario (2026-09); la fase 5
// lo reconoce (hyp.dosis === DOSIS_DERIVAR) y titula «Derivación».
export const DOSIS_DERIVAR = 'Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico';

// ── SISTEMAS TRANSVERSALES (aplicados a todas las regiones) ──

// Cita de Goodman en el razonamiento propio de las banderas (Fase M); cada una añade sus páginas.
const GOODMAN_BANDERAS = 'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), ';

// Razonamientos de banderas que también lleva el sistema endocrino propio de codo (data/codo.js)
export const RAZON_XANTOMAS = {
  porque: 'Cuando los lípidos de la sangre están muy altos, salen de los vasos y se depositan en la piel o en los tendones, donde los macrófagos los engullen y forman nódulos amarillentos. En la diabetes mal controlada indican que la glucosa y los lípidos no están controlados (Goodman).',
  peso: 'Es un signo de exploración: pide derivar al médico para estudiar y controlar los lípidos (Goodman, Bell). Bell distingue dos tipos. Los eruptivos son pápulas rojo-amarillentas de 1 a 5 mm en las caras de extensión de brazos y piernas, nalgas y manos, a veces con picor o dolor; indican triglicéridos muy altos (a menudo por encima de 3000–4000 mg/dL), con riesgo de pancreatitis. Los tendinosos son nódulos firmes en el Aquiles o en los tendones extensores de manos, rodillas o codos, con la piel normal; indican hipercolesterolemia, a menudo familiar, y aterosclerosis.',
  detalle: 'Qué sube los triglicéridos (Bell): diabetes, obesidad, alcohol, estrógenos orales, tiacidas, retinoides y algunos antipsicóticos. Los eruptivos desaparecen en semanas al tratar los lípidos; los tendinosos tardan años o no desaparecen.\n\nLas placas amarillas en los párpados (xantelasma) son otro signo de lípidos altos (Goodman). El ejercicio sigue siendo clave en el tratamiento.',
  fuentes: ['Goodman 2018', 'Bell y Saleh 2026'],
  citas: [
    GOODMAN_BANDERAS + 'cap. 11, pp. 402–403 y 421–422.',
    { texto: 'Bell y Saleh 2026 — Bell y Saleh, «Xanthoma», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK562241/' }
  ]
};
export const RAZON_CALCIFICANTE = {
  porque: 'La periartritis (inflamación de tendones, ligamentos y cápsula) y la tendinitis calcificante aparecen sobre todo en el hombro de personas con enfermedad endocrina: del tiroides (hipertiroidismo) y del metabolismo de los estrógenos, y también en los trastornos de las paratiroides.',
  peso: 'Por sí sola no es grave, pero bilateral orienta a una causa sistémica (para Goodman, todo síntoma bilateral es una bandera roja): buscar otros signos endocrinos. Con causa endocrina suele empezar a una edad más joven, durar más y acabar más a menudo en cirugía; la periartritis crónica mejora al tratar el hipertiroidismo.',
  detalle: 'En el hipertiroidismo, la restricción dolorosa del hombro puede ser uni o bilateral y avanzar a una capsulitis adhesiva (hombro congelado); también se ha descrito tendinitis calcificante aguda de la muñeca. La calcificación se ve en la radiografía. (StatPearls no tiene un capítulo vigente sobre la tendinitis calcificante.)',
  fuentes: ['Goodman 2018'],
  citas: [
    GOODMAN_BANDERAS + 'cap. 11, pp. 388, 395, 399 y 422.'
  ]
};
// Isquemia aguda de la pierna: pregunta urgente de cadera (ca_v5) y de rodilla (r_v4)
export const RAZON_ISQUEMIA_AGUDA = {
  porque: 'Si un trombo o un émbolo tapa de golpe una arteria de la pierna, el músculo y los nervios se quedan sin riego. A diferencia de la claudicación crónica, que aparece al caminar y cede al parar, el dolor de la oclusión aguda empieza de repente, en menos de una hora, y puede afectar a toda la pierna por debajo de la obstrucción (Goodman).',
  peso: 'Goodman pide comunicar de inmediato al médico el empeoramiento brusco de una claudicación, porque puede ser una tromboembolia. Los signos de la oclusión aguda son las «6 P»: dolor, palidez, ausencia de pulso, hormigueo, frialdad y, en los casos graves, parálisis. Con un SÍ, urgencias hoy, sin esperar.',
  detalle: 'Quién tiene más riesgo (Goodman, tabla 6.7): cirugía vascular o un procedimiento arterial previos, aneurisma abdominal, traumatismo con lesión arterial y fibrilación auricular crónica.\n\nQué mirar: la pierna fría y pálida, la falta de pulso pedio o poplíteo comparando con el otro lado, y la sensibilidad y la fuerza del pie.\n\nLa claudicación estable, que aparece siempre a una distancia parecida y cede al parar, no es urgente y se pregunta aparte.',
  fuentes: ['Goodman 2018'],
  citas: [
    'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 254 y 260; cap. 16, p. 636.'
  ]
};
export const SIS_ENDOCRINO = {
  id: 'transversal_endocrino', icon: '⚗️', nombre: 'Endocrino / Metabólico',
  banderasRojas: [
    { texto: 'Síndrome del túnel carpiano bilateral (alerta endocrina/metabólica)',
      razonamiento: {
        porque: 'Las enfermedades sistémicas afectan a las dos muñecas a la vez: en el mixedema o la acromegalia se engrosa el ligamento transverso del carpo, la retención de líquidos (embarazo, insuficiencia renal o cardiaca) aumenta el contenido del túnel, y la diabetes, el hipotiroidismo, la amiloidosis o la artritis inflamatoria lesionan o comprimen el nervio mediano.',
        peso: 'Para Goodman, todo síntoma bilateral es una bandera roja. Pero el túnel carpiano bilateral también es frecuente sin causa sistémica (suele empezar por la mano dominante; Sevy), así que lo que pesa es lo que lo acompaña: buscar otros signos endocrinos o metabólicos (debilidad proximal, cansancio, cambios de peso, de piel o de pelo, sed y orina excesivas) y, si los hay o no hay una causa conocida, derivar al médico.',
        detalle: 'Síntomas: hormigueo, adormecimiento o dolor en el pulgar, el índice, el medio y la mitad radial del anular, peor de noche y que alivia sacudiendo la mano; puede irradiar al antebrazo. Si el adormecimiento llega al meñique, al dorso de la mano o al cuello, pensar en otro diagnóstico (Sevy).\n\nCausas sistémicas (Goodman, tabla 11.2; Sevy): diabetes, hipo e hipertiroidismo, acromegalia, menopausia, embarazo, obesidad, insuficiencia renal o cardiaca, artritis reumatoide, gota y amiloidosis, algunos fármacos (anticonceptivos orales) y la quimioterapia. El secundario a una diabetes tiene peor pronóstico (Sevy). Puede acompañarse de un túnel tarsiano en los dos pies (Goodman).',
        fuentes: ['Goodman 2018', 'Sevy 2023'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 11, pp. 387–389 y 422.',
          { texto: 'Sevy 2023 — Sevy, Sina y Varacallo, «Carpal Tunnel Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 29 de octubre de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448179/' }
        ]
      } },
    { texto: 'Signos de tormenta tiroidea: taquicardia, hipertermia, agitación',
      razonamiento: {
        porque: 'Es la forma extrema del hipertiroidismo: un desencadenante (cirugía, traumatismo, infección, dejar de golpe la medicación antitiroidea, estrés intenso o incluso el ejercicio) dispara los efectos de la hormona tiroidea y el gasto de oxígeno. Da fiebre alta con sudor, taquicardia que puede llevar a insuficiencia cardiaca y arritmias, agitación, delirio o coma, y náuseas, vómitos, diarrea o dolor abdominal.',
        peso: 'Es rara, pero es una urgencia vital: muere entre el 8 % y el 25 % aun con tratamiento (Pokhrel). El diagnóstico es clínico y no se esperan los análisis. Ante la sospecha, llamar a emergencias. Vigilar sobre todo a quien tiene un hipertiroidismo conocido, o sus signos, tras una operación, un traumatismo o una infección (Goodman).',
        detalle: 'Qué se ve (Pokhrel): fiebre de 40–41 °C con sudor, pulso por encima de 140, a veces fibrilación auricular, edemas o falta de aire por insuficiencia cardiaca, agitación, ansiedad, delirio o psicosis, temblor, piel caliente y húmeda, bocio o exoftalmos. La afectación neurológica empeora el pronóstico.\n\nCon qué se confunde (Pokhrel): sepsis o infección, golpe de calor, consumo de cocaína, feocromocitoma, síndrome neuroléptico maligno y psicosis.\n\nNo se pregunta: se reconoce por lo que se ve en la consulta. Goodman la incluye entre lo que pide atención médica inmediata; Pokhrel recomienda que quien tiene hipertiroidismo conozca los signos y vaya a urgencias sin demora.',
        fuentes: ['Goodman 2018', 'Pokhrel 2022'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 11, pp. 395–396 y 421.',
          { texto: 'Pokhrel 2022 — Pokhrel, Aiman y Bhusal, «Thyroid Storm», StatPearls [Internet], NCBI Bookshelf, última actualización 6 de octubre de 2022.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448095/' }
        ]
      } },
    { texto: 'Confusión, letargo o sudoración profusa sin ejercicio en diabéticos (riesgo hipoglucemia/cetoacidosis)',
      razonamiento: {
        porque: 'En la persona con diabetes pueden ser una hipoglucemia, de inicio brusco (insulina o antidiabéticos como las sulfonilureas, con poca comida o más actividad), o una hiperglucemia grave, de inicio gradual: la cetoacidosis o el estado hiperosmolar, cuando falta insulina o aumentan las necesidades por una infección, un traumatismo, una cirugía, estrés o fármacos como los corticoides. El cerebro depende de la glucosa de la sangre: sin ella aparecen confusión y cansancio, y en los casos graves convulsiones y coma.',
        peso: 'Pide actuar en el momento. Goodman pide atención médica inmediata y medir la glucosa con un pinchazo en el dedo si se puede. Si está consciente y no se sabe si la glucosa está alta o baja, darle azúcar: es lo más seguro (Goodman). Si está desorientado o pierde el conocimiento, llamar a emergencias (Mathew). Toda hipoglucemia, o sospecha, se comunica al médico.',
        detalle: 'Hipoglucemia (Mathew): glucosa por debajo de 70 mg/dL, aunque los síntomas suelen aparecer por debajo de 50–55, y en el diabético mal controlado pueden aparecer con cifras más altas. Avisos del sistema nervioso autónomo: temblor, palpitaciones, ansiedad, hambre, sudor y hormigueos; por falta de glucosa en el cerebro: cambios de conducta, confusión, cansancio, convulsiones y coma. Es tres veces más frecuente en la diabetes tipo 1. Trampas (Goodman): los betabloqueantes ocultan los avisos, y de noche puede dar solo pesadillas, sudor o cefalea.\n\nCetoacidosis (Lizzo): glucosa por encima de 250 mg/dL con acidosis y cuerpos cetónicos. Sed y orina abundante, boca seca y deshidratación, náuseas, vómitos y dolor abdominal, respiración profunda y rápida (Kussmaul), aliento afrutado, taquicardia y, en los casos graves, confusión y somnolencia. Con los inhibidores de SGLT2 puede darse con la glucosa casi normal.\n\nEn la consulta: con el paciente consciente, hidratos de absorción rápida (Mathew: un zumo de fruta; Goodman: 10–15 g suelen bastar, por ejemplo media taza de zumo o dos sobres de azúcar). Tenerlos siempre a mano.',
        fuentes: ['Goodman 2018', 'Mathew y Thoppil 2022', 'Lizzo 2025'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 11, pp. 407–409 y 421–423.',
          { texto: 'Mathew y Thoppil 2022 — Mathew y Thoppil, «Hypoglycemia», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de diciembre de 2022.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534841/' },
          { texto: 'Lizzo 2025 — Lizzo, Goyal y Kaur, «Adult Diabetic Ketoacidosis», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560723/' }
        ]
      } },
    { texto: 'Signos de depleción de potasio por diuréticos: arritmias, calambres',
      razonamiento: {
        porque: 'Muchos diuréticos (los que no ahorran potasio, como las tiacidas o los diuréticos de asa) hacen perder por la orina sodio, agua y potasio. El potasio mantiene el potencial de membrana de nervios y músculos: si falta, aparecen debilidad, calambres, cansancio, palpitaciones y estreñimiento, y el corazón se vuelve propenso a las arritmias.',
        peso: 'La leve (3,0–3,5 mmol/L) a menudo no da síntomas; suelen aparecer por debajo de 3,0, y la debilidad importante, por debajo de 2,5, aunque antes si la bajada es brusca (Castro). La grave puede causar arritmias mortales o parálisis de los músculos respiratorios. El riesgo de arritmia es mayor en el mayor, con enfermedad cardiaca o con digoxina. Con estos síntomas en quien toma diuréticos, consultar al médico antes de hacer ejercicio (Goodman).',
        detalle: 'Cómo se presenta (Castro): debilidad ascendente, primero en las piernas y después en el tronco y los brazos; calambres, palpitaciones, estreñimiento, distensión abdominal, náuseas y vómitos. Los reflejos pueden estar disminuidos con los diuréticos.\n\nOtras causas de pérdida de potasio: vómitos, diarrea, laxantes, sudor excesivo, corticoides crónicos y la insulina.\n\nQué hacer con la sospecha (Goodman): tomar el pulso buscando arritmias, preguntar por náuseas y vómitos, y buscar los signos de deshidratación (labios y piel secos, mareo al ponerse de pie, debilidad), que en quien toma diuréticos también se comunican al médico.',
        fuentes: ['Goodman 2018', 'Castro y Sharma 2025'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 11, pp. 390, 410–411 y 421–423.',
          { texto: 'Castro y Sharma 2025 — Castro y Sharma, «Hypokalemia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482465/' }
        ]
      } },
    { texto: 'Xantomas: pápulas amarillentas en las caras de extensión (eruptivos) o nódulos en los tendones extensores o el Aquiles (tendinosos)',
      razonamiento: RAZON_XANTOMAS },
    { texto: 'Nódulos palpables supraclaviculares o fiebre inexplicable en pacientes con corticosteroides',
      razonamiento: {
        porque: 'Junta dos avisos distintos. El ganglio supraclavicular drena el mediastino, los pulmones y el esófago (Farmer), y un nódulo en la parte baja del cuello, sobre los escalenos, puede ser la primera manifestación de un cáncer de tiroides (Goodman). Los corticoides frenan la inflamación y la inmunidad: aumentan el riesgo de infección y pueden ocultar sus primeros signos, así que una fiebre sin explicación puede ser la única pista (Goodman, Hodgens).',
        peso: 'Los dos piden valoración médica, aunque Goodman no los incluye entre lo que pide atención inmediata. El ganglio: la probabilidad de cáncer es baja en atención primaria (0,4 % por debajo de 40 años, alrededor del 4 % por encima), pero sube con más de 40 años, un cáncer previo, alcohol o tabaco, más de 4 semanas de evolución o síntomas generales (Farmer); también con ronquera nueva, tos con sangre o tensión alta (Goodman). La fiebre sin otros síntomas en quien toma corticoides se deriva siempre (Goodman).',
        detalle: 'Ganglio (Farmer): duro como una piedra orienta a cáncer, más a menudo a una metástasis; gomoso, a linfoma; blando, a infección o inflamación. El dolor no distingue lo benigno de lo maligno. Si dura menos de 2 semanas, o más de un año sin cambios, suele ser benigno.\n\nCorticoides (Hodgens): el riesgo de infección sube con 10 mg al día o más, con la edad, con otras enfermedades y con los fármacos modificadores de la enfermedad; son frecuentes las infecciones por hongos y virus. Tomados mucho tiempo dan un síndrome de Cushing y frenan la glándula suprarrenal, incluso inhalados o en crema, así que no se retiran de golpe.',
        fuentes: ['Goodman 2018', 'Farmer y Matto 2026', 'Hodgens y Sharman 2023'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 11, pp. 392, 398–399 y 421–423.',
          { texto: 'Farmer y Matto 2026 — Farmer y Matto, «Lymphadenopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 9 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513250/' },
          { texto: 'Hodgens y Sharman 2023 — Hodgens y Sharman, «Corticosteroids», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554612/' }
        ]
      } }
  ],
  banderasAmarillas: [
    { texto: 'Debilidad muscular proximal, mialgias y fatiga sistémica inexplicada', pregunta: 'end_1' },
    { texto: 'Periartritis o tendinitis calcificante bilateral de hombro',
      razonamiento: RAZON_CALCIFICANTE },
    { texto: 'Cambios inexplicables en cabello, uñas, piel o tolerancia a la temperatura', pregunta: 'end_3' },
    { texto: 'Polidipsia y poliuria (sed y orina excesivas)', pregunta: 'end_2' }
  ],
  preguntas: [
    { id: 'end_1', text: '¿Siente fatiga inusual o debilidad muscular, especialmente al subir escaleras o levantarse de una silla?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Muchas alteraciones hormonales (tiroides, paratiroides, exceso de cortisol, diabetes, falta de vitamina D) afectan al músculo y dan una miopatía que debilita sobre todo los músculos proximales, de forma simétrica: cuesta subir escaleras o levantarse de una silla.',
        peso: 'La fatiga sola es muy inespecífica. Pesa la debilidad proximal adquirida y simétrica sin explicación mecánica: Goodman pide investigar siempre una causa endocrina, porque muchas de estas debilidades se recuperan del todo con el tratamiento específico.',
        detalle: 'Mecanismo: la debilidad, las mialgias, los calambres y la fatiga pueden ser manifestaciones tempranas de enfermedad del tiroides o del paratiroides, acromegalia, diabetes, síndrome de Cushing, déficit de vitamina D y osteomalacia. En el exceso de cortisol, el catabolismo de las proteínas desgasta el músculo; de ahí la dificultad para subir escaleras o levantarse de una silla.\n\nCon qué se confunde: la falta de forma, el dolor que inhibe la fuerza o una lesión neurológica. Lo que orienta a lo endocrino es que la debilidad sea proximal, simétrica y adquirida, y que se acompañe de otros signos sistémicos (cambios de peso, de piel o pelo, de temperatura, sed).\n\nQué preguntar después (Goodman): si ha perdido fuerza recientemente, si tiene calambres o fasciculaciones (y si toma antiácidos con magnesio a diario), qué actividades le cansan demasiado y si tiene diagnóstico de diabetes, tiroides o Cushing.',
        fisiologia: {
          pasos: [
            'El exceso de cortisol activa la degradación de proteínas del músculo esquelético (sistema ubiquitina-proteasoma, con atrogina-1 y MuRF1) y frena su síntesis (inhibe mTOR y la señal de IGF-1).',
            'Los aminoácidos liberados van al hígado para fabricar glucosa; el músculo pierde masa y sus fibras se atrofian.',
            'La pérdida afecta sobre todo a los músculos proximales y de forma simétrica: cuesta subir escaleras o levantarse de una silla.',
            'Otras alteraciones endocrinas (tiroides, paratiroides, diabetes, falta de vitamina D) dan una miopatía parecida, y muchas se recuperan del todo al tratar la causa.'
          ],
          metafora: 'Como una fábrica que desmonta su maquinaria para conseguir piezas y no la repone: el cortisol desmonta proteínas del músculo para hacer glucosa, y el músculo se va quedando sin motor.'
        },
        fuentes: ['Goodman 2018', 'Kaur 2025'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387, 392 y 423.',
          { texto: 'Kaur 2025 — Kaur, Gandhi y Sharma, «Physiology, Cortisol», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538239/' }
        ]
      } },
    { id: 'end_2', text: '¿Ha notado aumento anormal de sed, apetito o frecuencia urinaria (incluso despertándose por la noche)?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Con la glucosa alta en sangre el riñón no puede reabsorberla y arrastra agua (diuresis osmótica): se orina mucho, también de noche, y la pérdida de agua da sed intensa. En la diabetes tipo 1 aumenta además el apetito. La diabetes insípida y la insuficiencia suprarrenal también dan sed y poliuria.',
        peso: 'La tríada de sed, orina abundante y hambre es un signo clásico de diabetes no tratada o mal controlada y merece valoración médica si es nueva. Un solo síntoma aislado (levantarse a orinar, por ejemplo) tiene muchas otras causas.',
        detalle: 'Mecanismo: la hiperglucemia hace que la sangre sea hiperosmolar y «tire» del líquido intersticial, que se pierde por el riñón (diuresis osmótica); la persona orina mucho (poliuria) y, para compensar, bebe mucho (polidipsia). La glucosa sale por la orina. En la diabetes tipo 1 aumenta el apetito y, a la vez, se pierde peso.\n\nOtros signos de diabetes no tratada que suelen acompañar: fatiga y debilidad, visión borrosa, irritabilidad, infecciones de repetición (piel, encías, vejiga, vagina), hormigueo en manos y pies, y cortes o moratones que tardan en curar.\n\nCon qué se confunde: la nicturia de origen urinario o prostático. La hipercalcemia del hiperparatiroidismo también da poliuria y polidipsia.',
        fisiologia: {
          pasos: [
            'En el riñón, la glucosa que se filtra se recupera en los túbulos gracias a transportadores que la meten en la célula junto con sodio (SGLT).',
            'Con la glucosa en sangre muy alta, el riñón no consigue reabsorberla toda y una parte sale por la orina (glucosuria).',
            'La glucosa que queda dentro del túbulo retiene agua por presión osmótica (el mismo mecanismo con el que actúa un diurético como el manitol): es la diuresis osmótica, y se orina mucho, también de noche.',
            'Perder tanta agua deshidrata y la sangre queda más concentrada (sube la osmolalidad).',
            'El hipotálamo detecta la sangre concentrada y libera hormona antidiurética para ahorrar agua; aun así, la pérdida por la orina da una sed intensa y la persona bebe mucho (polidipsia).'
          ],
          metafora: 'Como la sal en un salero húmedo, que atrae el agua: la glucosa que el riñón no recupera se lleva agua con ella hacia la orina. Por eso se orina mucho y después hay sed.'
        },
        fuentes: ['Goodman 2018', 'Hantzidiamantis 2024', 'Chen 2023'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 399, 402 y 423.',
          { texto: 'Hantzidiamantis 2024 — Hantzidiamantis, Awosika y Lappin, «Physiology, Glucose», StatPearls [Internet], NCBI Bookshelf (2024).', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545201/' },
          { texto: 'Chen 2023 — Chen, Sabir y Al Khalili, «Physiology, Osmoregulation and Excretion», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK541108/' }
        ]
      } },
    { id: 'end_3', text: '¿Ha experimentado cambios recientes en su peso o tolerancia a la temperatura (mucho frío o calor cuando otros no)?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Las hormonas tiroideas regulan el metabolismo de todo el cuerpo. Su exceso (hipertiroidismo) acelera el metabolismo: pérdida de peso, calor, palpitaciones y temblor. Su falta (hipotiroidismo) lo frena: aumento de peso, frío, cansancio y somnolencia.',
        peso: 'Cada síntoma por separado es poco específico; lo que pesa es el conjunto (cambio de peso más intolerancia a la temperatura, cambios de piel, pelo o uñas, cansancio). Es motivo de valoración médica.',
        detalle: 'Mecanismo: el hipertiroidismo eleva el metabolismo general; además de pérdida de peso e intolerancia al calor da piel caliente y húmeda, uñas que se despegan, pelo que se rompe y cae, y periartritis crónica del hombro. El hipotiroidismo da intolerancia al frío, cansancio excesivo, somnolencia, cefalea y aumento de peso, con piel seca y pelo y uñas finos y quebradizos; en la mujer, reglas irregulares.\n\nPor qué importa para el ejercicio: la intolerancia al calor de la enfermedad de Graves limita la tolerancia al esfuerzo, y la taquicardia o las arritmias con el ejercicio deben comunicarse al médico.\n\nQué preguntar después: cambios en el cuello (bocio), dificultad para tragar o respirar, ronquera, cambios en la piel, el pelo o las uñas.',
        fisiologia: {
          pasos: [
            'La hormona tiroidea entra en las células, se une a su receptor en el núcleo y activa los genes que aumentan el metabolismo y la producción de calor.',
            'Aumenta la síntesis de la bomba Na+/K+-ATPasa en muchos tejidos: suben el consumo de oxígeno, la frecuencia respiratoria y la temperatura corporal.',
            'Además potencia a las catecolaminas: aumenta los receptores beta del corazón, que late más rápido y con más fuerza.',
            'Con exceso (hipertiroidismo) hay pérdida de peso, intolerancia al calor, diarrea, temblor fino y debilidad muscular; con defecto (hipotiroidismo), bradicardia, intolerancia al frío, estreñimiento, cansancio y aumento de peso.'
          ],
          metafora: 'Como el termostato de una caldera: si está muy alto, el cuerpo quema combustible de más y pasa calor; si está muy bajo, todo funciona al ralentí y se pasa frío.'
        },
        fuentes: ['Goodman 2018', 'Shahid 2023'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 395–397 y 423.',
          { texto: 'Shahid 2023 — Shahid, Ashraf y Sharma, «Physiology, Thyroid Hormone», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500006/' }
        ]
      } },
    { id: 'end_4', text: '¿Nota que sus heridas sanan muy lentamente o le aparecen moretones con excesiva facilidad?', alerta: true, s1: false,
      razonamiento: {
        porque: 'El exceso de cortisol (síndrome de Cushing, o corticoides tomados mucho tiempo) degrada las proteínas del tejido conjuntivo: los capilares se vuelven frágiles y aparecen moratones con golpes mínimos, y las heridas cicatrizan mal. En la diabetes, la peor circulación de la piel también retrasa la cicatrización.',
        peso: 'Orienta a un origen endocrino si va con otros signos (cara redonda, abdomen prominente con estrías, debilidad, diabetes, corticoides). Los moratones fáciles tienen también causas hematológicas y farmacológicas (anticoagulantes, aspirina, AINE): esta pregunta se cruza con la de sangrado del sistema hematológico.',
        detalle: 'Mecanismo: la producción excesiva de cortisol crea un estado catabólico: se liberan aminoácidos del músculo y del tejido elástico, y el resultado es mala cicatrización, debilidad muscular generalizada, abdomen prominente y osteoporosis. El cortisol también suprime la respuesta inflamatoria y puede enmascarar los primeros signos de una infección. En la diabetes no controlada, los cortes y moratones tardan en curar, y la menor circulación cutánea retrasa más la cicatrización.\n\nCon qué se confunde: los moratones por falta de plaquetas o por fármacos que alteran la coagulación (ver el sistema hematológico).\n\nQué buscar con un SÍ: uso de corticoides, diabetes conocida, signos de Cushing (cara de luna llena, joroba de búfalo, estrías, hipertensión) y fiebre sin explicación.',
        fisiologia: {
          pasos: [
            'El cortisol actúa a través del receptor de glucocorticoides de las células de la piel: fibroblastos de la dermis y queratinocitos.',
            'Frena su división y reduce la fabricación de colágeno tipo I y III; también suprime la señal del factor de crecimiento TGF-β y la captación de aminoácidos.',
            'La dermis se adelgaza y el tejido conjuntivo pierde resistencia; los capilares se vuelven frágiles.',
            'Resultado: moratones con golpes mínimos, heridas que cierran mal y estrías en las zonas de la piel que soportan tensión.',
            'En el músculo, el mismo exceso de cortisol degrada proteínas (sistema ubiquitina-proteasoma) y frena su síntesis: de ahí la debilidad proximal del síndrome de Cushing.'
          ],
          metafora: 'Como una obra a la que recortan el presupuesto de vigas: el cortisol frena la fabricación de colágeno, el armazón de la piel y del tejido que sostiene los capilares, y con cualquier golpe la estructura cede.'
        },
        fuentes: ['Goodman 2018', 'Kaur 2025'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 392, 402–403 y 423.',
          { texto: 'Kaur 2025 — Kaur, Gandhi y Sharma, «Physiology, Cortisol», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538239/' }
        ]
      } },
    { id: 'end_5', text: '(Si tiene diabetes) ¿Suele tener episodios de bajadas de azúcar, o siente ardor, entumecimiento o pérdida de sensibilidad en manos y pies?', alerta: true, s1: false,
      razonamiento: {
        porque: 'En la persona con diabetes, el ejercicio consume glucosa y puede provocar una bajada (hipoglucemia), sobre todo si coincide con el pico de la insulina. Y la glucosa alta mantenida daña los nervios: la neuropatía diabética empieza como ardor, entumecimiento o pérdida de sensibilidad en los pies.',
        peso: 'No es una bandera roja de patología oculta, sino un dato de seguridad para la sesión: con hipoglucemias frecuentes hay que planificar el ejercicio (horario, glucosa a mano) y comunicar los episodios al médico; con neuropatía, tenerla en cuenta al explorar la sensibilidad y los reflejos.',
        detalle: 'Hipoglucemia: aparece durante o después del ejercicio cuando el músculo consume glucosa y la insulina circulante es alta. Los betabloqueantes pueden enmascarar sus síntomas, y puede ocurrir de noche, con solo pesadillas, sudoración o cefalea. Cualquier episodio, o sospecha, se trata enseguida con azúcar de absorción rápida y se comunica al médico.\n\nNeuropatía: es la complicación crónica más frecuente de la diabetes de larga evolución. La polineuropatía distal simétrica da ardor y entumecimiento en los pies y puede llegar a debilidad, atrofia y pie caído; el túnel carpiano también es frecuente. La afectación autonómica altera la frecuencia cardiaca, la tensión arterial, la sudoración y la vejiga.\n\nQué preguntar después (Goodman): tipo y horario de la insulina, si lleva azúcar encima y dónde, si ha tenido cetoacidosis, si se mide la glucosa y si la mantiene en rango.',
        fisiologia: {
          pasos: [
            'La glucosa alta mantenida daña los nervios periféricos: es osmóticamente activa, genera estrés oxidativo y se une a proteínas (glicación) alterando su estructura y su función.',
            'Goodman añade la acumulación de sorbitol en la célula nerviosa y la menor irrigación del nervio. El resultado es una polineuropatía que empieza por los pies: ardor, entumecimiento y pérdida de sensibilidad.',
            'En el otro extremo, la insulina y los fármacos que bajan la glucosa pueden provocar una hipoglucemia, sobre todo con ayuno o ejercicio, porque el músculo que trabaja consume glucosa.',
            'La bajada activa el sistema nervioso autónomo (temblor, ansiedad, palpitaciones, sudoración, hambre) y, si sigue, falta glucosa en el cerebro: cansancio, cambios de conducta y, en los casos graves, convulsiones o coma.'
          ],
          metafora: 'La glucosa es el combustible: si sobra durante años, va dañando los cables finos de los pies; si falta de golpe, el órgano que más depende de ella, el cerebro, empieza a fallar.'
        },
        fuentes: ['Goodman 2018', 'Hantzidiamantis 2024'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 404, 408–409 y 423.',
          { texto: 'Hantzidiamantis 2024 — Hantzidiamantis, Awosika y Lappin, «Physiology, Glucose», StatPearls [Internet], NCBI Bookshelf (2024).', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545201/' }
        ]
      } }
  ],
  zonasDolor: [
    { zona: 'Manos / Muñecas bilateral', desc: 'Túnel carpiano bilateral, tenosinovitis de flexores — alerta tiroidea/metabólica' },
    { zona: 'Hombros (bilateral)', desc: 'Periartritis, tendinitis calcificante, capsulitis adhesiva' },
    { zona: 'Músculos proximales', desc: 'Cintura pélvica, muslos, cintura escapular — mialgias y debilidad profunda' },
    { zona: 'Columna torácica y lumbar', desc: 'Fracturas por compresión (osteoporosis), Paget, acromegalia (síndrome DISH)' },
    { zona: 'Rodillas', desc: 'Ataques agudos de pseudogota (condrocalcinosis)' }
  ],
  impactoDescanso: [
    'Túnel carpiano bilateral: parestesias y dolor nocturno que interrumpen el sueño repetidamente',
    'Nicturia diabética (insulina insípida o mellitus): fragmenta gravemente el descanso',
    'Dolor óseo metabólico (Paget, osteomalacia): profundo, taladrante, empeora por la noche'
  ],
  impactoEjercicio: [
    'Miopatía endocrina (Cushing, hipertiroidismo, acromegalia): reduce drásticamente la capacidad funcional',
    'Enfermedad de Graves: intolerancia al calor contraindica ejercicio vigoroso o terapia acuática (riesgo arritmias)',
    'Diabetes mellitus: el ejercicio modifica captación de glucosa — sin monitorización puede causar hipoglucemia grave o cetoacidosis',
    'Diuréticos: depleción de potasio eleva riesgo de arritmias cardíacas inducidas por ejercicio'
  ]
};

export const SIS_HEMATOLOGICO = {
  id: 'transversal_hematologico', icon: '🩸', nombre: 'Hematológico',
  banderasRojas: [
    { texto: 'Sangrado espontáneo, petequias o equimosis sin traumatismo (trombocitopenia)', pregunta: 'hem_1' },
    { texto: 'Heces negras/alquitranadas indicativas de trombocitopenia o sangrado GI', pregunta: 'hem_4' },
    { texto: 'Episodios nuevos de dolor muscular o articular en pacientes con hemofilia', pregunta: 'hem_6' },
    { texto: 'Hemoptisis (toser sangre) en pacientes con hemofilia', pregunta: 'hem_4' },
    { texto: 'Fiebre alta, escalofríos y sudores por infecciones en pacientes con leucopenia', pregunta: ['hem_3', 'hem_5'] }
  ],
  banderasAmarillas: [
    { texto: 'Palidez en pliegues palmares, mucosas o lechos ungueales',
      razonamiento: {
        porque: 'La anemia baja la capacidad de la sangre para llevar oxígeno, y el cuerpo reparte la que hay hacia los órganos más sensibles a su falta (cerebro, corazón, músculo), a costa de las manos y los riñones: por eso palidecen las palmas, los lechos ungueales, las mucosas y la conjuntiva (Goodman).',
        peso: 'La palidez de la conjuntiva multiplica por 4,5 la probabilidad de una anemia importante (hemoglobina de 9 g/dL o menos), y la de los pliegues palmares es muy específica (Regalla). Sugiere anemia, pero no dice su causa; en fisioterapia las más habituales son la pérdida de sangre digestiva por AINE, las enfermedades crónicas o inflamatorias y el cáncer o su tratamiento (Goodman). Pesa más con cansancio, falta de aire, palpitaciones o mareo con poco esfuerzo: que el médico la confirme y busque la causa.',
        detalle: 'Cómo mirarla (Goodman): con las manos a la altura del corazón y calientes, porque el frío las palidece. Buscar palmas pálidas con pliegues de color normal; en la anemia grave también palidecen los pliegues. En la piel oscura, la palidez es la falta del tono rojizo: amarillenta en la morena, grisácea en la negra.\n\nLa anemia lenta se tolera bien y muchos no notan síntomas hasta que la hemoglobina baja de 7 g/dL; en la ferropénica, la palidez es un signo tardío (Regalla, Hanif). En el hombre y en la mujer posmenopáusica, una anemia ferropénica obliga a estudiar el tubo digestivo (Regalla).\n\nCon anemia conocida, el médico aprueba antes el ejercicio, que se dosifica por el esfuerzo percibido vigilando pulso y tensión (Goodman).',
        fuentes: ['Goodman 2018', 'Regalla y Killeen 2026', 'Hanif 2026'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 5, pp. 213–215 y 220–221.',
          { texto: 'Regalla y Killeen 2026 — Regalla y Killeen, «Anemia», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de julio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499994/' },
          { texto: 'Hanif 2026 — Hanif, Rout y Anwer, «Iron Deficiency and Microcytic Hypochromic Anemia», StatPearls [Internet], NCBI Bookshelf, última actualización 21 de febrero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560876/' }
        ]
      } },
    { texto: 'Uñas cóncavas o quebradizas (coiloniquia — alerta de anemia ferropénica)',
      razonamiento: {
        porque: 'La falta de hierro mantenida altera el crecimiento de la uña: se vuelve quebradiza y cóncava, en cuchara, en lugar de convexa (Goodman, tabla 5.1; Hanif). En fisioterapia, la causa más habitual de la falta de hierro es la pérdida crónica de sangre digestiva por AINE (Goodman).',
        peso: 'Sugiere una falta de hierro de larga evolución (Goodman; Regalla), no una urgencia. Lo que importa es su causa: en el hombre y en la mujer posmenopáusica una anemia ferropénica obliga a estudiar el tubo digestivo (Regalla). Con coiloniquia, preguntar por AINE, heces negras, reglas abundantes y cansancio, y que el médico la confirme.',
        detalle: 'Otros signos de falta de hierro (Hanif): cansancio, debilidad, falta de aire con el esfuerzo, cefalea, caída del pelo, boca seca, lengua lisa y dolorosa, grietas en las comisuras, piernas inquietas (hasta el 40 % de quienes las tienen tienen falta de hierro) y el antojo de comer hielo o cosas que no son comida. Pueden aparecer antes de que haya anemia; la palidez llega tarde.',
        fuentes: ['Goodman 2018', 'Hanif 2026', 'Regalla y Killeen 2026'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 5, pp. 214 y 220–221.',
          { texto: 'Hanif 2026 — Hanif, Rout y Anwer, «Iron Deficiency and Microcytic Hypochromic Anemia», StatPearls [Internet], NCBI Bookshelf, última actualización 21 de febrero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560876/' },
          { texto: 'Regalla y Killeen 2026 — Regalla y Killeen, «Anemia», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de julio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499994/' }
        ]
      } },
    { texto: 'Disnea rápida, dolor de pecho, debilidad y fatiga con palpitaciones', pregunta: 'hem_2' },
    { texto: 'Uso crónico de AINEs (predispone a sangrado GI y anemia)',
      razonamiento: {
        porque: 'Los AINE inhiben la ciclooxigenasa (COX-1): bajan las prostaglandinas que protegen el estómago (menos moco, menos bicarbonato, menos riego de la mucosa) y frenan las plaquetas (Saad, Malik). Son la segunda causa de úlcera péptica, tras Helicobacter pylori (Malik); la úlcera puede sangrar, y un sangrado lento y mantenido acaba en anemia por falta de hierro (Goodman).',
        peso: 'Por sí solo no es una bandera de enfermedad, pero da más peso a otros hallazgos: con AINE crónicos, las heces negras, los signos de anemia (cansancio, palidez, falta de aire con poco esfuerzo) o un dolor nuevo de espalda o de hombro hacen más probable una úlcera que sangra, y piden valoración médica (Goodman). La lesión puede no dar síntomas hasta que está avanzada (Goodman), y la úlcera, el sangrado o la perforación pueden ocurrir a cualquier edad, aunque más en el mayor (Saad).',
        detalle: 'Qué aumenta el riesgo (Goodman, recuadro 8.3; Antunes): más de 65 años, úlcera previa, tabaco y alcohol, corticoides orales, anticoagulantes o antiagregantes (también la aspirina a dosis baja), antidepresivos ISRS, y antiácidos, que ocultan los síntomas. Los inhibidores de la COX-2 reducen el riesgo, pero no lo quitan.\n\nHeces negras (Antunes): la melena es negra, pegajosa y de olor característico; el hierro y el bismuto también ennegrecen las heces sin que haya sangrado. Un sangrado importante da mareo al levantarse o síncope.\n\nPor qué la espalda o el hombro: la úlcera por AINE suele estar en la pared posterior del estómago (Goodman). Otros efectos: suben la tensión y empeoran la insuficiencia cardiaca (Saad). Preguntar si combina varios AINE, con o sin receta.',
        fuentes: ['Goodman 2018', 'Saad y Mathew 2025', 'Malik 2023', 'Antunes 2024'],
        citas: [
          GOODMAN_BANDERAS + 'cap. 5, pp. 213 y 220; cap. 8, pp. 306 y 314–317.',
          { texto: 'Saad y Mathew 2025 — Saad y Mathew, «Nonsteroidal Anti-Inflammatory Drugs Toxicity», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de septiembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK526006/' },
          { texto: 'Malik 2023 — Malik, Gnanapandithan y Singh, «Peptic Ulcer Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534792/' },
          { texto: 'Antunes 2024 — Antunes, Tian y Copelin, «Upper Gastrointestinal Bleeding», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470300/' }
        ]
      } }
  ],
  preguntas: [
    { id: 'hem_1', text: '¿Sangra o se le forman moretones fácilmente después de un traumatismo menor, cirugía o procedimiento dental?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Las plaquetas y los factores de coagulación cierran las pequeñas roturas de los vasos. Si faltan plaquetas (trombocitopenia) o un fármaco altera su función, cualquier traumatismo menor, una cirugía o un dentista producen sangrado prolongado o moratones extensos.',
        peso: 'La causa más frecuente es farmacológica (aspirina, otros AINE, anticoagulantes): preguntar siempre qué toma. Si empezó en la infancia sugiere un defecto congénito; si es reciente, adquirido. Los moratones intensos, el sangrado espontáneo o las petequias sin diagnóstico previo piden derivación inmediata.',
        detalle: 'Mecanismo: la trombocitopenia (menos de 150.000 plaquetas/mm³) aparece por fallo de la médula (radioterapia, leucemia, metástasis), por quimioterapia o por fármacos (AINE, metotrexato, warfarina). Da sangrado tras traumatismos menores, sangrado espontáneo, petequias (sobre todo en las piernas), moratones, sangrado de nariz o encías, reglas abundantes y heces negras. Las petequias múltiples y los hematomas suelen indicar plaquetas muy por debajo de 100.000/mm³. En la hemofilia el sangrado no es más rápido, sino más largo.\n\nPor qué importa para el tratamiento: con trombocitopenia, el ejercicio con esfuerzo o pujo (Valsalva) puede provocar una hemorragia en los ojos o el cerebro; el manguito de tensión se usa con cuidado, y la compresión mecánica o la movilización de partes blandas están contraindicadas sin permiso médico.',
        fisiologia: {
          pasos: [
            'Cuando un vaso se rompe, queda expuesto el colágeno de su pared; las plaquetas se adhieren a él directamente o a través del factor de von Willebrand (receptores GPIb y GPVI).',
            'Las plaquetas adheridas se activan, liberan sus gránulos (entre ellos ADP) y fabrican tromboxano A2 con la enzima COX-1: estas señales reclutan más plaquetas y forman el tapón.',
            'A la vez, la cascada de la coagulación genera trombina, que convierte el fibrinógeno en fibrina insoluble y refuerza el tapón.',
            'Si faltan plaquetas (menos de 150.000/μL), si un fármaco bloquea su función —la aspirina inhibe la COX-1 de forma irreversible; el clopidogrel bloquea la activación por ADP— o si falla otro componente (hemofilia, enfermedad de von Willebrand), el tapón se forma mal: moratones fáciles, petequias y sangrado prolongado.'
          ],
          metafora: 'Como tapar una vía de agua: las plaquetas son los sacos terreros que se apilan en la grieta y la fibrina, la red que los sujeta. Sin sacos, o con una red que no se teje, el agua sigue saliendo.'
        },
        fuentes: ['Goodman 2018', 'LaPelusa y Dave 2023', 'Denault y Launico 2026'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213 y 218–221.',
          { texto: 'LaPelusa y Dave 2023 — LaPelusa y Dave, «Physiology, Hemostasis», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545263/' },
          { texto: 'Denault y Launico 2026 — Denault y Launico, «Physiology, Platelet», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470328/' }
        ]
      } },
    { id: 'hem_2', text: '¿Experimenta falta de aire, palpitaciones o dolor en el pecho con esfuerzos leves (subir escaleras) o en reposo?', alerta: true, s1: false,
      razonamiento: {
        porque: 'En la anemia la sangre transporta menos oxígeno: el corazón compensa latiendo más deprisa y aparecen falta de aire, palpitaciones y, en los casos graves, dolor torácico con esfuerzos mínimos o en reposo.',
        peso: 'Muchas personas tienen una anemia moderada o grave sin estos síntomas, así que un NO no la descarta. Un SÍ con dolor torácico, sobre todo en reposo, exige valoración médica. El ejercicio en la anemia se progresa con cautela y con visto bueno médico.',
        detalle: 'Mecanismo: la anemia reduce la capacidad de la sangre para llevar oxígeno; el gasto cardiaco en reposo suele ser normal, pero sube con el ejercicio más que en una persona sin anemia. Al agravarse, la tolerancia al esfuerzo cae hasta que aparecen disnea, taquicardia y palpitaciones en reposo. Puede bajar la tensión diastólica y subir el pulso en reposo. Una persona joven tolera una anemia que se instaura poco a poco y puede no notar nada hasta que la hemoglobina cae a la mitad; la anemia brusca da síntomas enseguida.\n\nCausas que ve el fisioterapeuta: pérdida crónica de sangre digestiva por AINE (anemia ferropénica), enfermedades crónicas o inflamatorias, anemia perniciosa (con síntomas neurológicos) y cáncer o quimioterapia.\n\nCómo preguntar: muchos pacientes no dicen que se ahogan porque han dejado de hacer lo que les ahoga (ya no suben escaleras, no terminan la compra de una vez). Preguntar qué han dejado de hacer por falta de energía o de aire. Mirar palidez de palmas, lechos ungueales y mucosas.',
        fisiologia: {
          pasos: [
            'Casi todo el oxígeno de la sangre (en torno al 98 %) viaja unido a la hemoglobina; solo una pequeña parte va disuelta en el plasma.',
            'Por eso el contenido de oxígeno de la sangre depende sobre todo de cuánta hemoglobina hay: con anemia, cada litro de sangre lleva menos oxígeno.',
            'El oxígeno que llega a los tejidos cada minuto es el gasto cardiaco multiplicado por ese contenido: si el contenido baja, solo subiendo el gasto se mantiene el aporte.',
            'El gasto cardiaco es la frecuencia cardiaca por el volumen de cada latido: el corazón compensa latiendo más deprisa (taquicardia, palpitaciones), y con el ejercicio tiene que subir más que en alguien sin anemia.',
            'Cuanto más grave es la anemia, menos margen queda: aparecen falta de aire y palpitaciones con esfuerzos leves y, al final, en reposo.'
          ],
          metafora: 'Menos camiones de reparto (hemoglobina) para el mismo pedido de oxígeno: para entregar lo mismo, el corazón tiene que hacer más viajes por minuto. Con muy pocos camiones, ni a máxima velocidad llega.'
        },
        fuentes: ['Goodman 2018', 'Rhodes 2022', 'King y Lowery 2023'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213–215, 220 y 221.',
          { texto: 'Rhodes 2022 — Rhodes, Denault y Varacallo, «Physiology, Oxygen Transport», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de noviembre de 2022.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538336/' },
          { texto: 'King y Lowery 2023 — King y Lowery, «Physiology, Cardiac Output», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470455/' }
        ]
      } },
    { id: 'hem_3', text: '¿Padece infecciones recurrentes o fiebre baja frecuente (resfriados, gripe, infecciones respiratorias)?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Los leucocitos defienden frente a la infección. Si bajan (leucopenia, típica tras quimioterapia o radioterapia, en infecciones graves o en enfermedades autoinmunes), aparecen infecciones de repetición y fiebre.',
        peso: 'Los catarros frecuentes son inespecíficos. Pesa en quien está inmunodeprimido (quimioterapia reciente, corticoides, inmunosupresores): ahí la fiebre, los escalofríos o los sudores piden derivación médica inmediata.',
        detalle: 'Mecanismo: la leucopenia aparece en el fallo de la médula ósea tras quimioterapia o radioterapia, en infecciones graves, en déficits nutricionales y en enfermedades autoinmunes. El punto más bajo (nadir) suele llegar 7–14 días después de la quimioterapia o la radioterapia: es cuando más riesgo hay de infecciones oportunistas.\n\nSignos de leucopenia: dolor de garganta, tos, fiebre alta, escalofríos y sudoración, úlceras en las mucosas, micción frecuente o dolorosa e infecciones persistentes.\n\nQué hacer con un SÍ: preguntar por tratamientos oncológicos o inmunosupresores y conocer el último recuento de leucocitos si lo hay. Extremar la higiene de manos en la consulta.',
        fisiologia: {
          pasos: [
            'Los neutrófilos, los leucocitos más abundantes, salen de los vasos a los tejidos para ingerir, matar y digerir bacterias y hongos.',
            'Solo el 3–5 % circula por la sangre; el resto espera en reserva hasta que una infección lo activa. Si la médula tiene buenas reservas, el riesgo de infección es menor aunque el recuento esté bajo.',
            'El recuento baja si la médula fabrica menos (fallo medular, neoplasias de la sangre, quimioterapia) o si los neutrófilos se destruyen o se consumen (enfermedades autoinmunes, infecciones, algunos fármacos, incluso antibióticos).',
            'Por debajo de 1,5 × 10⁹/L hay neutropenia, grave por debajo de 0,5; su consecuencia son las infecciones de repetición.',
            'Tras la quimioterapia o la radioterapia el punto más bajo (nadir) llega a los 7–14 días: es el momento de más riesgo.'
          ],
          metafora: 'Como una guarnición con pocos soldados de guardia y el grueso en el cuartel: si el cuartel se vacía porque la médula no fabrica, cualquier intruso entra sin resistencia.'
        },
        fuentes: ['Goodman 2018', 'Rout 2024'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213, 217–218 y 221.',
          { texto: 'Rout 2024 — Rout, Reynolds y Zito, «Neutropenia», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de junio de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507702/' }
        ]
      } },
    { id: 'hem_5', text: '¿Está recibiendo tratamiento contra el cáncer (quimioterapia o radioterapia) y se encuentra mal o tiene fiebre?', alerta: true, s1: false,
      urgencia: 'Posible sepsis neutropénica: a urgencias hoy, sin demora, o al teléfono de 24 horas de su servicio de oncología.',
      razonamiento: {
        porque: 'Los tratamientos contra el cáncer, sobre todo la quimioterapia y también la radioterapia, pueden frenar la capacidad de la médula ósea para responder a una infección: bajan los neutrófilos y una infección puede acabar en una sepsis. Como la quimioterapia suele darse de forma ambulatoria, la mayoría de los episodios empiezan fuera del hospital.',
        peso: 'Es una urgencia médica: la sepsis neutropénica puede ser mortal (entre el 2 % y el 21 % de los adultos en los estudios que recoge NICE). NICE pide sospecharla en todo paciente con tratamiento contra el cáncer que se encuentra mal, no solo cuando tiene fiebre, y derivarlo de inmediato al hospital, donde el antibiótico se empieza enseguida, antes de conocer la causa.',
        detalle: 'Cómo se confirma (NICE): neutrófilos de 0,5 × 10⁹/L o menos, con fiebre de más de 38 °C u otros signos o síntomas de sepsis. El recuento se hace en el hospital, así que en la consulta no se puede descartar: ante la sospecha, se deriva.\n\nNICE pide que quien recibe tratamiento contra el cáncer sepa, por escrito y de palabra, cómo y cuándo llamar al teléfono de 24 horas de oncología y cuándo ir a urgencias: con un SÍ, preguntar si tiene ese teléfono.\n\nPor qué no esperar (Punnapuzha): la defensa frente a la infección está tan baja que el dolor y la sensibilidad en una zona pueden ser el único signo de infección, y el antibiótico precoz reduce la mortalidad; es una urgencia oncológica, y una fiebre nueva en quien recibe quimioterapia pide actuar con urgencia. Tienen más riesgo los mayores, quienes tienen otras enfermedades y según el tipo de cáncer y de quimioterapia.\n\nLa guía habla solo de los tratamientos contra el cáncer (quimioterapia y radioterapia, entre otros). Las infecciones de repetición o la fiebre baja sin este tratamiento se preguntan aparte, sin urgencia.',
        fuentes: ['NICE CG151', 'Punnapuzha 2023'],
        citas: [
          { texto: 'NICE CG151 — NICE, «Neutropenic sepsis: prevention and management in people with cancer» (2012, actualizada en septiembre de 2024), introducción, recomendaciones 1.1.1.1, 1.3.1.1–1.3.1.2, 1.4.1.1 y 1.4.4.1, y «Terms used in this guideline».', url: 'https://www.nice.org.uk/guidance/cg151' },
          { texto: 'Punnapuzha 2023 — Punnapuzha, Edemobi y Elmoheen, «Febrile Neutropenia», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de marzo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK541102/' }
        ]
      } },
    { id: 'hem_6', text: '(Si tiene hemofilia u otro trastorno hereditario de la coagulación) ¿Tiene un dolor nuevo en una articulación o un músculo, con hormigueo o tirantez, hinchazón, calor o dificultad para moverla?', alerta: true, s1: false,
      urgencia: 'Posible sangrado articular o muscular en la hemofilia: tratarlo hoy con su factor según su pauta y avisar a su unidad de hemofilia; a urgencias si hay hormigueo, adormecimiento o pérdida de fuerza, o dolor en la ingle o el abdomen.',
      razonamiento: {
        porque: 'En la hemofilia falta la función del factor VIII (hemofilia A) o IX (B): se sangra durante más tiempo. El sangrado dentro de la articulación (hemartros) es su manifestación típica, sobre todo en rodillas, tobillos y codos; en la grave (menos del 1 % de factor) aparece sin traumatismo, en la moderada tras golpes menores y en la leve tras traumatismos importantes o cirugía (Awidi). El segundo sitio es el músculo.',
        peso: 'Con un SÍ, el sangrado se trata hoy, sin esperar. La guía de la WFH pide tratar con el factor de inmediato, en cuanto el paciente sospecha el sangrado y antes de que aparezcan la hinchazón, la pérdida de movilidad y el dolor; muchos lo notan antes como un «aura» de hormigueo y tirantez en la articulación. El dolor suele llegar antes que cualquier otro signo (Goodman). Un sangrado en un músculo profundo (psoasilíaco, compartimentos posteriores de la pierna, flexores del antebrazo) puede comprimir nervios y vasos: pide manejo inmediato, y un síndrome compartimental confirmado se opera en las 12 horas siguientes (WFH). Nunca aplicar calor sobre una zona que sangra o puede sangrar (Goodman).',
        detalle: 'Hemartros agudo: hormigueo, rigidez en la postura de alivio, menos movilidad, dolor, hinchazón y calor (Goodman); tras un traumatismo, la hinchazón aparece en pocas horas, y en quien tiene la sensibilidad alterada el dolor puede ser mínimo (Killeen). Hemorragia muscular: dolor que va a más, espasmo protector y músculo en posición acortada; puede comprimir un nervio (femoral, cubital o mediano) (Goodman).\n\nSangrado en el psoas o el ilíaco (Goodman): dolor en el abdomen bajo o la ingle (a la derecha puede parecer una apendicitis), pérdida de sensibilidad en la cara anterior del muslo y cadera en flexión. Flexionar el tronco duele mucho si sangra el psoas y poco si sangra la cadera; rotar la cadera con suavidad, al revés.\n\nLos hemartros repetidos acaban en artropatía hemofílica (sinovitis, destrucción del cartílago, deformidad, atrofia), la principal causa de discapacidad (Awidi, Killeen). Los anticoagulantes y las enfermedades del hígado o el riñón también pueden causar hemartros (Killeen).\n\nMedidas de apoyo (WFH), junto al factor y nunca en su lugar: reposo (cabestrillo en el brazo), hielo sin contacto directo con la piel durante 15–20 minutos, compresión y elevación si se tolera; sin cargar peso en la cadera, la rodilla o el tobillo hasta recuperar la movilidad y la función previas, y después movilización suave y progresiva. Para el dolor, paracetamol o inhibidores de la COX-2, no otros AINE. La WFH pide que en urgencias se les valore de inmediato, sin esperas.\n\nSe pregunta aparte de los moratones o el sangrado fácil, que no piden urgencias por sí solos.',
        fuentes: ['WFH 2020', 'Goodman 2018', 'Awidi y Babiker 2026', 'Killeen y Cardenas 2025'],
        citas: [
          { texto: 'WFH 2020 — Srivastava, Santagostino, Dougall et al., «WFH Guidelines for the Management of Hemophilia, 3rd edition», Haemophilia 2020;26(supl. 6):1–158, principios 5 y 6 (p. 13), cap. 7.1–7.2 (hemorragia articular, pp. 86–89) y cap. 10.4 (hemorragia muscular y síndrome compartimental, pp. 129–130).', url: 'https://doi.org/10.1111/hae.14046' },
          GOODMAN_BANDERAS + 'cap. 5, pp. 218–221.',
          { texto: 'Awidi y Babiker 2026 — Awidi y Babiker, «Hemophilia A», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470265/' },
          { texto: 'Killeen y Cardenas 2025 — Killeen y Cardenas, «Hemarthrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK525999/' }
        ]
      } },
    { id: 'hem_4', text: '¿Ha notado heces negras/alquitranadas, sangre en orina, o ha tosido o vomitado sangre?', alerta: true, s1: false,
      razonamiento: {
        porque: 'La sangre en las heces, la orina, el vómito o la tos puede ser el primer signo de un trastorno de la coagulación (falta de plaquetas, hemofilia, anticoagulantes) o de un sangrado digestivo por AINE. Las heces negras y pegajosas (melena) indican sangre digerida, del tubo digestivo alto.',
        peso: 'Cualquiera de estos sangrados requiere valoración médica, y Goodman los señala como posibles indicadores críticos de un trastorno de la coagulación que puede ser grave. En una persona con hemofilia, toser sangre no es normal y se comunica al médico de inmediato.',
        detalle: 'Mecanismo: el uso crónico de corticoides o AINE causa gastritis y úlcera, con sangrado digestivo y anemia ferropénica. La trombocitopenia sangra por los vasos pequeños de la piel y las mucosas (nariz, útero, tubo digestivo, vías urinarias y respiratorias). En la hemofilia, el sangrado digestivo da dolor y distensión abdominal, melena y vómitos con sangre.\n\nCon qué se confunde: las heces rojizas pueden deberse a la remolacha o a colorantes, y el bismuto ennegrece las heces y la lengua; la sangre roja brillante suele ser rectal o anal (hemorroides, fisuras), pero también puede ser un cáncer colorrectal. Lo distingue el médico.\n\nQué preguntar: fármacos (AINE, aspirina, anticoagulantes, corticoides), quimioterapia o radioterapia previas, y otros sangrados (nariz, encías, reglas abundantes, moratones).',
        fisiologia: {
          pasos: [
            'Si falla cualquier componente de la hemostasia (falta de plaquetas, hemofilia, enfermedad de von Willebrand, fármacos antiplaquetarios), el sangrado no se controla.',
            'Con pocas plaquetas sangran sobre todo los vasos pequeños de la piel y las mucosas: nariz, tubo digestivo, vías urinarias y respiratorias.',
            'En el estómago y el duodeno, los AINE y los corticoides pueden causar además una úlcera, la causa más frecuente de hemorragia digestiva alta; combinar antiplaquetarios y anticoagulantes es lo que más aumenta el riesgo de que sangre.',
            'La sangre del tubo digestivo alto sale como melena (heces negras, pegajosas, de olor característico) o como vómito con sangre o en «posos de café»; la sangre roja por el recto suele venir del tubo digestivo bajo, aunque una hemorragia alta muy rápida también puede darla.',
            'Si se pierde mucha sangre aparecen síntomas generales: mareo al incorporarse, síncope, cansancio y debilidad.'
          ],
          metafora: 'Cuando falla el sistema de taponado, las primeras fugas aparecen en las tuberías más finas y expuestas: las mucosas del intestino, la vejiga o los bronquios.'
        },
        fuentes: ['Goodman 2018', 'LaPelusa y Dave 2023', 'Antunes 2024'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213, 219–221; cap. 8, p. 306.',
          { texto: 'LaPelusa y Dave 2023 — LaPelusa y Dave, «Physiology, Hemostasis», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545263/' },
          { texto: 'Antunes 2024 — Antunes, Tian y Copelin, «Upper Gastrointestinal Bleeding», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470300/' }
        ]
      } }
  ],
  zonasDolor: [
    { zona: 'Articulaciones (rodilla, codo, tobillo, cadera, hombro)', desc: 'Hemartrosis en hemofilia — dolor articular agudo' },
    { zona: 'Abdomen inferior / Ingle / Muslo', desc: 'Hemorragia retroperitoneal en músculo iliopsoas (puede imitar apendicitis)' },
    { zona: 'Hombro / Cadera', desc: 'Episodios isquémicos en anemia falciforme — dolor óseo y perióstico' },
    { zona: 'Pecho / Mandíbula', desc: 'Dolor torácico por falta de oxigenación miocárdica en anemia severa' }
  ],
  impactoDescanso: [
    'Policitemia: prurito intolerable al estar en cama o con calor ("signo del baño caliente") — interrumpe severamente el descanso',
    'Anemia severa: taquicardia nocturna y disnea de reposo fragmentan el sueño'
  ],
  impactoEjercicio: [
    'Anemia: disminuye transporte de oxígeno — tolerancia al ejercicio muy reducida, taquicardia, fatiga extrema y disnea. Dosificar con extrema precaución',
    'Trombocitopenia: ejercicio con Valsalva (esfuerzo/pujo) CONTRAINDICADO — riesgo de hemorragia en ojos o cerebro',
    'Hemofilia: hemorragias musculares causan dolor y espasmo protector que acorta el músculo y limita el movimiento articular',
    'Ejercicio vigoroso contraindicado si plaquetas <50.000/mm³ o hemoglobina <10 g/dL'
  ]
};

// ── SISTEMA POSQUIRÚRGICO (docs/posquirurgico.md, decisión 2) ──
// Va en las 7 regiones (el mismo objeto, como los transversales), pero la app
// solo lo pinta con mecanismo Post-quirúrgico (`soloPosquirurgico`) y, dentro
// de él, solo las preguntas de esa región (`regiones`; sin `regiones`, todas).
// Fuentes leídas en la sesión (2026-10): Zabaglo 2024 y NICE NG125 (herida),
// NICE NG158 y NG89 y Vyas 2024 (TVP y embolia), Guthmiller 2025 y Goebel 2018
// (SDRC; guía del Royal College of Physicians, que también respalda la
// pregunta del nervio) y Torlincasi 2023 (síndrome compartimental).
const PQ_MIEMBROS = ['hombro', 'codo', 'cadera', 'rodilla', 'tobillo_pie'];
const PQ_CITA = {
  zabaglo: { texto: 'Zabaglo 2024 — Zabaglo, Leslie y Sharman, «Postoperative Wound Infections», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de marzo de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560533/' },
  ng125: { texto: 'NICE NG125 — NICE, «Surgical site infections: prevention and treatment» (2019, actualizada el 19 de agosto de 2020), recomendaciones 1.1.3 y 1.4.9, «Terms used in this guideline» y «Context».', url: 'https://www.nice.org.uk/guidance/ng125' },
  ng158: { texto: 'NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.8 y 1.1.15–1.1.18, tablas 1 y 2 (escalas de Wells de dos niveles).', url: 'https://www.nice.org.uk/guidance/ng158' },
  ng89: { texto: 'NICE NG89 — NICE, «Venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism» (2018, actualizada el 13 de agosto de 2019), recomendaciones 1.2.4, 1.11.1–1.11.16 y 1.12.1–1.12.3.', url: 'https://www.nice.org.uk/guidance/ng89' },
  lim: { texto: 'Lim 2024 — Lim, Roh, Kim y Nam, «Is the May-Thurner syndrome a major risk factor for deep vein thrombosis in total hip arthroplasty?», Clin Orthop Surg 2024;16(1):34–40.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10825252/' },
  vyas: { texto: 'Vyas 2024 — Vyas, Sankari y Goyal, «Acute Pulmonary Embolism», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560551/' },
  guthmiller: { texto: 'Guthmiller 2025 — Guthmiller, Dua, Dey y Varacallo, «Complex Regional Pain Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de mayo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430719/' },
  torlincasi: { texto: 'Torlincasi 2023 — Torlincasi, Lopez y Waseem, «Acute Compartment Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448124/' },
  goebel: { texto: 'Goebel 2018 — Goebel, Barker, Turner-Stokes et al., «Complex regional pain syndrome in adults: UK guidelines for diagnosis, referral and management in primary and secondary care», 2.ª ed. (Royal College of Physicians, 2018), pp. 1–3 (introducción y tabla 1), 6–12 (atención primaria y fisioterapia), 13–16 (práctica quirúrgica), 45–46 (apéndice 4) y 51–54 (apéndice 7).', url: 'https://www.rcp.ac.uk/media/4uijppdz/complex-regional-pain-syndrome-in-adults-second-edition_0.pdf' },
};

const PQ_RAZON_TVP = {
  porque: 'La operación junta los tres factores de la tríada de Virchow: lesiona la pared de las venas, deja la pierna quieta (la sangre se estanca) y aumenta la coagulabilidad. Se forma un coágulo en una vena profunda de la pierna, que dificulta el retorno de la sangre y da hinchazón, calor y dolor. El riesgo es que se suelte y llegue al pulmón.',
  peso: 'Pesa mucho por lo que está en juego: casi todas las embolias pulmonares nacen de una TVP de la pierna, y sin tratar muere el 30 % de quienes la sufren, frente al 8 % con tratamiento a tiempo (Vyas). La cirugía mayor con anestesia general o regional en las 12 semanas previas suma un punto en la escala de Wells, y NICE NG158 pide calcularla ante una pierna hinchada o dolorosa: con 2 puntos o más la TVP es probable y hay que hacer una ecografía, con el resultado en 4 horas si es posible; con 1 o menos, un dímero D. El riesgo depende de la operación: NICE NG89 pauta profilaxis durante semanas tras una prótesis de cadera o de rodilla, una fractura de cadera o una cirugía de columna, y la considera tras la del pie o el tobillo con inmovilización, mientras que tras la del miembro superior con anestesia local o regional no suele hacer falta. La embolia rara vez nace de una TVP del brazo, y entonces casi siempre tras un catéter venoso (Vyas). Con sospecha, derivar hoy a quien pueda confirmarla o descartarla.',
  detalle: 'Escala de Wells de dos niveles para la TVP (NICE NG158, tabla 1): un punto por cada uno de estos: cáncer activo (en tratamiento, en los últimos 6 meses o paliativo); parálisis, paresia o inmovilización reciente con yeso de la pierna; encamamiento de 3 días o más o cirugía mayor con anestesia general o regional en las 12 semanas previas; dolor localizado a lo largo del sistema venoso profundo; toda la pierna hinchada; pantorrilla al menos 3 cm más gruesa que la otra; edema con fóvea solo en la pierna sintomática; venas superficiales colaterales no varicosas; TVP previa documentada. Se restan 2 si otro diagnóstico es al menos igual de probable. Con 2 o más, probable; con 1 o menos, improbable.\n\nProfilaxis tras la cirugía ortopédica (NICE NG89): prótesis de cadera, 28 días de heparina de bajo peso molecular, o 10 días seguidos de 28 de aspirina; prótesis de rodilla, 14 días; fractura por fragilidad de pelvis, cadera o fémur proximal, un mes; cirugía de columna programada, 30 días o hasta que se mueva o reciba el alta; pie y tobillo, considerarla si hay inmovilización, más de 90 minutos de anestesia o riesgo alto; miembro superior, solo con más de 90 minutos de anestesia general o si la operación dificulta moverse. Al alta, NICE pide explicar al paciente los síntomas de la TVP y de la embolia pulmonar y que pida ayuda si los nota.\n\nFactores que se suman (Vyas): fractura de la pierna, prótesis de cadera o de rodilla, encamamiento de más de 3 días, TVP o embolia previas, cáncer, obesidad, embarazo y posparto, anticonceptivos orales o terapia hormonal, tabaco e infección.',
  fisiologia: {
    pasos: [
      'La cirugía lesiona la pared de las venas, la inmovilidad hace que la sangre se estanque y la coagulabilidad aumenta: es la tríada de Virchow (Vyas).',
      'Se forma un coágulo en una vena profunda, casi siempre de la pierna (Vyas).',
      'El coágulo dificulta el retorno de la sangre: la pierna se hincha, se calienta y duele (NICE NG158, tabla 1).',
      'Si un trozo se suelta, viaja por las venas hasta las arterias del pulmón: es la embolia pulmonar (Vyas).'
    ],
    metafora: 'Como el agua estancada en una tubería: si deja de correr, empieza a formar depósitos que pueden soltarse.'
  },
  fuentes: ['NICE NG158', 'NICE NG89', 'Vyas 2024'],
  citas: [PQ_CITA.ng158, PQ_CITA.ng89, PQ_CITA.vyas]
};
// pq_tvp (piernas) añade la TVP de la otra pierna tras una prótesis de cadera
// (May-Thurner, docs/may-thurner.md); pq_tvp_ms (hombro, codo) se queda sin él.
const PQ_RAZON_TVP_PIERNA = {
  ...PQ_RAZON_TVP,
  detalle: PQ_RAZON_TVP.detalle + '\n\nLa otra pierna: tras una prótesis de cadera, la TVP puede aparecer en la pierna izquierda aunque se haya operado la derecha, por una compresión de la vena ilíaca común izquierda (síndrome de May-Thurner): en una serie de 5 TVP tras prótesis de cadera, 4 tenían esa compresión y todas fueron en la izquierda, dos de ellas tras operar la derecha, entre los 24 y los 54 días (Lim 2024, serie pequeña). Por eso la pregunta dice «una pierna», no «la operada».',
  fuentes: [...PQ_RAZON_TVP.fuentes, 'Lim 2024'],
  citas: [...PQ_RAZON_TVP.citas, PQ_CITA.lim]
};
const PQ_URGENCIA_TVP = 'Posible TVP: derivar hoy (NICE NG158: con Wells ≥2, ecografía en 4 horas; con 1 o menos, dímero D en 4 horas; riesgo de embolia pulmonar).';

export const SIS_POSQUIRURGICO = {
  id: 'transversal_posquirurgico', icon: '🏥', nombre: 'Posquirúrgico', soloPosquirurgico: true,
  banderasRojas: [
    { texto: 'Herida más roja, caliente, hinchada o dolorosa, que supura o se abre, o fiebre y malestar tras la operación (infección)', pregunta: 'pq_herida' },
    { texto: 'En las 48–72 horas siguientes, dolor desproporcionado con piel oscura, ampollas, crepitación o signos de sepsis (infección necrotizante: urgencia quirúrgica)', pregunta: 'pq_herida' },
    { texto: 'Pierna hinchada, caliente o dolorosa (TVP)', pregunta: ['pq_tvp', 'pq_tvp_ms'] },
    { texto: 'Falta de aire brusca, dolor en el pecho al respirar, tos con sangre o síncope (embolia pulmonar)', pregunta: 'pq_tep' },
    { texto: 'Dolor desproporcionado que va a más, sobre todo al estirar los dedos, con el compartimento tenso, en las horas siguientes a la lesión, la operación o un yeso o vendaje (síndrome compartimental)', regiones: ['codo', 'rodilla', 'tobillo_pie'], pregunta: 'pq_compart' },
    { texto: 'Dolor quemante, hormigueo, adormecimiento o debilidad nuevos en el territorio de un nervio (posible lesión nerviosa)', regiones: PQ_MIEMBROS, pregunta: 'pq_nervio' },
    { texto: 'Tras una cirugía de columna, déficit neurológico nuevo o que va a más en brazos o piernas, torpeza al caminar o cambios en la vejiga o el intestino (hematoma epidural, lesión de raíz o médula)', regiones: ['lumbar', 'cervical'], pregunta: 'pq_nervio_col' }
  ],
  banderasAmarillas: [
    { texto: 'Dolor continuo y desproporcionado con cambios de color, temperatura, sudoración o hinchazón, o dolor al roce (SDRC)', regiones: PQ_MIEMBROS, pregunta: 'pq_sdrc' },
    { texto: 'Yeso o vendaje que aprieta, o dolor desproporcionado mientras se lleva o al retirarlo (aviso precoz de SDRC)', regiones: PQ_MIEMBROS, pregunta: ['pq_sdrc', 'pq_compart'] }
  ],
  preguntas: [
    { id: 'pq_herida', urgencia: 'Posible infección de la herida quirúrgica: que la valore hoy el cirujano o urgencias.', text: '¿Desde la operación, la herida está más roja, caliente, hinchada o dolorosa, supura o se ha abierto, o ha tenido fiebre, escalofríos o malestar general?', alerta: true,
      razonamiento: {
        porque: 'Durante la operación, bacterias de la propia piel del paciente (en la cirugía ortopédica, sobre todo estafilococos) contaminan la herida. Si su número y su virulencia superan las defensas, la herida se infecta: puede quedarse en la piel, llegar a los planos profundos o al implante. Da enrojecimiento, calor, hinchazón y dolor en la herida, supuración, que se abra o tarde en cerrar, y en las infecciones profundas, fiebre y malestar.',
        peso: 'Es la infección más frecuente del paciente quirúrgico: la sufre al menos el 5 % de los operados (NICE). Suele dar síntomas entre 3 y 7 días después, pero se considera infección de la herida hasta 30 días después, y hasta 90 tras una prótesis de cadera o de rodilla, una fusión vertebral o una reducción abierta de una fractura (Zabaglo). El diagnóstico es clínico. La superficial no suele dar fiebre; la profunda, más a menudo; y en los obesos la profunda es difícil de reconocer solo con la exploración (Zabaglo). Una infección necrotizante aparece en las primeras 48–72 horas con dolor desproporcionado para la operación, piel oscura o roja, crepitación, ampollas o necrosis y signos de sepsis: es una urgencia quirúrgica (Zabaglo). Sin tratar puede llegar a osteomielitis, bacteriemia y sepsis, y con un implante puede obligar a retirarlo (Zabaglo). Ante la sospecha, que la valore hoy el cirujano o urgencias.',
        detalle: 'Tipos (criterios de los CDC que recoge Zabaglo): superficial, solo piel y tejido subcutáneo (más de la mitad): supuración, cultivo positivo, diagnóstico del cirujano, o herida abierta por el cirujano con al menos hinchazón, enrojecimiento, dolor o calor; profunda, en músculo y fascias: supuración, dehiscencia, reapertura con cultivo positivo y fiebre o dolor, o absceso en la imagen; de órgano o espacio, más allá de la fascia, incluido el implante: supuración por un drenaje, cultivo o absceso. Un absceso de un punto de sutura o una celulitis localizada no cuentan como infección de la herida.\n\nQuién tiene más riesgo (Zabaglo): edad avanzada, desnutrición, obesidad, corticoides, diabetes mal controlada, inmunodepresión, tabaco, traumatismo, cirugía de una extremidad, ingreso largo antes de operar e infecciones en otro sitio; y por la operación, hematoma o seroma, drenajes, material extraño, hipotermia, cirugía larga y una infección previa.\n\nCon qué se confunde (Zabaglo): una celulitis en otra zona, una alergia a un fármaco, o infecciones solo relacionadas con la operación, como la urinaria, la neumonía o la embolia pulmonar. NICE define la infección de la herida por los signos locales (calor, enrojecimiento, dolor, hinchazón) y, en las graves, por fiebre o leucocitos altos; puede impedir que cierre, separando los bordes, o formar un absceso profundo. Ante una celulitis de la herida, NICE pide antibiótico, y recomienda explicar al paciente cómo reconocer la infección y a quién avisar.',
        fisiologia: {
          pasos: [
            'Durante la operación entran en la herida bacterias de la piel, las mucosas o una víscera próxima del propio paciente; tras la cirugía ortopédica, sobre todo estafilococos (Zabaglo).',
            'La infección depende de cuántas bacterias contaminan la herida y de su virulencia; el hematoma, el seroma, los drenajes, el material extraño y una cirugía larga la favorecen (Zabaglo).',
            'La inflamación de la herida da calor, enrojecimiento, dolor e hinchazón; si progresa, impide que cierre y separa los bordes, o forma un absceso profundo (NICE NG125).',
            'Si llega a la sangre, aparecen fiebre y malestar, y puede extenderse al hueso (osteomielitis) o dar una sepsis (Zabaglo).'
          ]
        },
        fuentes: ['Zabaglo 2024', 'NICE NG125'],
        citas: [PQ_CITA.zabaglo, PQ_CITA.ng125]
      } },
    { id: 'pq_tvp', regiones: ['cadera', 'rodilla', 'tobillo_pie', 'lumbar', 'cervical'], urgencia: PQ_URGENCIA_TVP, text: '¿Desde la operación tiene una pantorrilla o una pierna hinchada, caliente o dolorosa? (Posible TVP: calcular Wells; ≥2 → probable.)', alerta: true,
      razonamiento: PQ_RAZON_TVP_PIERNA },
    { id: 'pq_tvp_ms', regiones: ['hombro', 'codo'], urgencia: PQ_URGENCIA_TVP, text: '¿Desde la operación tiene una pantorrilla, una pierna o el brazo operado hinchados, calientes o dolorosos? (En la pierna, posible TVP: calcular Wells; ≥2 → probable.)', alerta: true,
      razonamiento: PQ_RAZON_TVP },
    { id: 'pq_tep', urgencia: 'Posible embolia pulmonar: llamar al 112.', text: '¿Le falta el aire de repente, le duele el pecho al respirar, ha tosido sangre o se ha mareado o desmayado?', alerta: true,
      razonamiento: {
        porque: 'Un trozo del coágulo de una TVP, casi siempre de la pierna, viaja por las venas y tapona arterias del pulmón. La sangre deja de llegar a una parte del pulmón que sigue respirando: falta el aire. Si el émbolo es pequeño y periférico, el pulmón se infarta e irrita la pleura (dolor al respirar); si es grande, el ventrículo derecho no puede vaciarse, cae la tensión y aparecen mareo, síncope o shock.',
        peso: 'Es una urgencia vital: sin tratar muere el 30 %, y con tratamiento a tiempo, el 8 % (Vyas). Los síntomas son poco específicos (falta de aire, dolor pleurítico, tos, tos con sangre, mareo o síncope) y a veces leves, así que en un operado reciente hay que pensar en ella (Vyas). La cirugía o la inmovilización de más de 3 días en las 4 semanas previas suman 1,5 puntos en la escala de Wells de la embolia; los signos de TVP, 3; una frecuencia cardiaca de más de 100, 1,5; y la tos con sangre, 1 (NICE NG158): con más de 4 es probable y NICE pide un angio-TC de inmediato. Los criterios PERC, que sirven para no estudiar una sospecha baja, exigen no haber tenido una cirugía o un traumatismo con ingreso en las 4 semanas previas, así que no permiten descartarla en un operado reciente (Vyas). Ante la sospecha, llamar al 112.',
        detalle: 'Escala de Wells de dos niveles para la embolia (NICE NG158, tabla 2): signos y síntomas de TVP (al menos hinchazón de la pierna y dolor al palpar las venas profundas), 3; otro diagnóstico menos probable que la embolia, 3; frecuencia cardiaca de más de 100, 1,5; inmovilización de más de 3 días o cirugía en las 4 semanas previas, 1,5; TVP o embolia previas, 1,5; tos con sangre, 1; cáncer (en tratamiento, en los últimos 6 meses o paliativo), 1. Más de 4 puntos, probable; 4 o menos, improbable.\n\nEn la exploración (Vyas): taquipnea y taquicardia, frecuentes pero poco específicas, y signos de TVP en la pierna. Con un émbolo grande, ingurgitación yugular, cianosis y shock; la embolia causa el 8 % de las paradas cardiacas súbitas. La disnea puede ser el único síntoma en quien ya tiene una enfermedad cardiaca o pulmonar.\n\nQuién tiene más riesgo (Vyas): los mismos factores que la TVP, entre ellos la cirugía ortopédica reciente, la prótesis de cadera o de rodilla, la fractura de la pierna y el encamamiento de más de 3 días.',
        fisiologia: {
          pasos: [
            'Un trozo del coágulo de una TVP, casi siempre de la pierna, se suelta y viaja por las venas hasta las arterias del pulmón (Vyas).',
            'La zona del pulmón que queda sin riego sigue ventilando, pero sin sangre que oxigenar: baja el oxígeno y falta el aire (Vyas).',
            'Si el émbolo es pequeño y periférico, tapona una arteria periférica: el pulmón se infarta, sangra dentro de los alvéolos e irrita la pleura, que duele al respirar (Vyas).',
            'Si es grande, sube la presión en la arteria pulmonar y el ventrículo derecho se dilata y no se vacía; el izquierdo se llena menos, cae el gasto cardiaco y aparecen hipotensión, síncope o shock (Vyas).'
          ]
        },
        fuentes: ['Vyas 2024', 'NICE NG158'],
        citas: [PQ_CITA.vyas, PQ_CITA.ng158]
      } },
    { id: 'pq_compart', regiones: ['codo', 'rodilla', 'tobillo_pie'], urgencia: 'Posible síndrome compartimental: a urgencias sin demora (la fasciotomía, idealmente en las primeras 6 horas).', text: '¿Desde la operación, o desde que le pusieron un yeso, una férula o un vendaje, tiene un dolor intenso y desproporcionado que va a más, sobre todo al estirar los dedos, con la zona muy tensa, hormigueo o adormecimiento?', alerta: true,
      razonamiento: {
        porque: 'Los músculos de los miembros están en compartimentos cerrados por fascias que no ceden. Si el contenido aumenta (sangrado o edema tras una fractura o una operación) o algo aprieta desde fuera (un yeso, una férula o un vendaje circular), sube la presión dentro: primero se frena la salida de la sangre venosa y después la entrada arterial, y el músculo y el nervio se quedan sin oxígeno. Da un dolor desproporcionado que aumenta al estirar los músculos del compartimento, la zona tensa «como madera» y hormigueo; si sigue, el tejido se necrosa.',
        peso: 'Es una urgencia quirúrgica, y el tiempo lo decide todo: con la fasciotomía en las primeras 6 horas la función del miembro se recupera casi del todo; a las 12 horas, solo dos tercios quedan con función normal, y en los casos muy tardíos puede acabar en amputación (Torlincasi). Suele aparecer en pocas horas, hasta 48 horas después de la causa: la lesión, la operación o un yeso o vendaje apretado. El primer signo objetivo es el compartimento tenso, y el dolor, al principio, puede aparecer solo al estirarlo pasivamente. De las «cinco P» (dolor, ausencia de pulso, parestesias, parálisis, palidez), todas salvo las parestesias son tardías, y un pulso palpable no lo descarta. Los signos clínicos tienen una sensibilidad y una especificidad limitadas, así que la exploración se repite (Torlincasi). Ante la sospecha, a urgencias sin demora.',
        detalle: 'Quién y cuándo (Torlincasi): el 75 % se asocia a fracturas; la de la diáfisis de la tibia es la causa más frecuente (lo sufre el 1–10 % de esas fracturas), seguida de la del radio distal. También tras lesiones de partes blandas, aplastamiento, lesiones vasculares, quemaduras, reperfusión, trastornos de la coagulación, infecciones, yesos o férulas mal colocados, vendajes circulares apretados, actividad deportiva intensa y una mala postura durante la cirugía. En niños, las fracturas supracondíleas del húmero y las del antebrazo. Más frecuente en varones menores de 35 años. Sin fractura, el riesgo de diagnosticarlo tarde y de complicaciones es mayor. Una fractura abierta no lo evita: la herida de la piel no descomprime los compartimentos.\n\nDónde: el compartimento anterior de la pierna es el más frecuente; también el antebrazo, el muslo, el glúteo, el hombro, la mano y el pie (Torlincasi).\n\nQué explorar (Torlincasi): la piel (lesiones, hinchazón, color), la tensión, la temperatura y el dolor a la palpación del compartimento, los pulsos, la sensibilidad y la discriminación de dos puntos y la fuerza, siempre en el territorio de ese compartimento, y repetirlo, porque progresa rápido. La presión normal de un compartimento es menor de 10 mmHg; con 30 o más, o con una diferencia de 30 o menos entre la presión diastólica y la del compartimento, está indicada la fasciotomía; una sola medida normal no lo descarta. Mientras se consulta con cirugía, se retiran los yesos, vendajes o apósitos que compriman y el miembro se mantiene a la altura del corazón, sin elevarlo.\n\nCon qué se confunde (Torlincasi): TVP, celulitis, gangrena gaseosa, rabdomiólisis y lesiones vasculares periféricas. Secuelas si llega tarde: contracturas (Volkmann), lesión nerviosa con adormecimiento o debilidad, rabdomiólisis, insuficiencia renal, infección y, en algunos casos, la muerte.',
        fisiologia: {
          pasos: [
            'La fascia que rodea cada compartimento muscular es fina e inextensible: no deja que el contenido se expanda deprisa (Torlincasi).',
            'Si aumenta el líquido dentro (sangrado, edema) o algo restringe el espacio desde fuera (yeso, vendaje), sube la presión del compartimento (Torlincasi).',
            'Primero cae la salida venosa y sube la presión en los capilares venosos; si la presión del compartimento supera la arterial, cae también la entrada de sangre (Torlincasi).',
            'Músculo y nervio se quedan sin oxígeno: dolor desproporcionado, que aumenta al estirarlos, y hormigueo (Torlincasi).',
            'Si la isquemia se prolonga, la necrosis es irreversible (Torlincasi).'
          ]
        },
        fuentes: ['Torlincasi 2023'],
        citas: [PQ_CITA.torlincasi]
      } },
    { id: 'pq_sdrc', regiones: PQ_MIEMBROS, text: '¿Tiene un dolor continuo y desproporcionado para la operación, con cambios de color, temperatura, sudoración o hinchazón en la zona, o le duele incluso el roce de la ropa?', alerta: true,
      razonamiento: {
        porque: 'Tras una fractura o una operación de un miembro, la lesión libera sustancias inflamatorias en los nervios del tejido, y el sistema nervioso se sensibiliza, primero en la periferia y después en la médula y el cerebro; además se altera el control autonómico de los vasos y del sudor. El resultado es un síndrome de dolor regional complejo: dolor desproporcionado que dura más que la curación, dolor al roce, cambios de color, temperatura, sudor e hinchazón, rigidez y cambios en la piel, el pelo o las uñas.',
        peso: 'No es una urgencia, pero sí hay que reconocerlo pronto: tratado pronto tiene mejor pronóstico (Guthmiller; Goebel). Tras una fractura o una operación de un miembro, un SDRC pasajero es frecuente (1–25 %), mejora en la mayoría y es raro que dure más de unos meses (menos de 1 de cada 1.500); en la mayoría empieza en el mes siguiente a la lesión o la inmovilización (Goebel). Se diagnostica con los criterios de Budapest (sensibilidad 0,99, especificidad 0,68; Guthmiller), y es un diagnóstico de exclusión: en el operado hay que descartar antes una infección, una fijación defectuosa, inestabilidad, artrosis o una lesión o atrapamiento de un nervio (Goebel). El fisioterapeuta puede sospecharlo, pero debe confirmarlo un médico, y la fisioterapia empieza en cuanto se sospecha; derivar a una unidad de dolor si es moderado o grave, hay distonía, no mejora en 4 semanas o empeora (Goebel). Un yeso o un vendaje que aprieta, o un dolor desproporcionado mientras se lleva o al retirarlo, pueden ser el primer aviso (Goebel).',
        detalle: 'Criterios de Budapest (Goebel, tabla 1; Guthmiller): A) dolor continuo desproporcionado para la lesión; B) al menos un signo en dos o más categorías; C) al menos un síntoma referido en tres o más categorías; D) ningún otro diagnóstico lo explica mejor. Categorías: sensitiva (alodinia al tacto, a la temperatura o a la presión profunda, o hiperalgesia al pinchazo), vasomotora (asimetría de temperatura, de más de 1 °C si se mide, o de color), sudomotora y edema (edema, cambios o asimetría del sudor) y motora y trófica (menos movilidad, debilidad, temblor, distonía, cambios en el pelo, las uñas o la piel).\n\nUna pista (Goebel, apéndice 4): la pérdida de movilidad del SDRC no se debe al dolor, a un nervio ni a la articulación. Ayuda preguntar: «si le quitara el dolor con una varita mágica, ¿podría mover los dedos?»; muchos contestan que no. Las sensaciones de que el miembro no es propio son frecuentes tras una lesión incluso sin SDRC, y no indican un problema psicológico (Goebel).\n\nCon qué se confunde (Goebel, recuadro 1; Guthmiller): infección del hueso, la articulación o las partes blandas, fijación defectuosa, inestabilidad, síndrome compartimental, lesión o atrapamiento de un nervio, insuficiencia arterial, TVP u obstrucción linfática, Raynaud y eritromelalgia. A diferencia de una lesión nerviosa, el dolor del SDRC es regional: no sigue el territorio de un nervio ni un dermatoma (Guthmiller).\n\nQué hacer en fisioterapia (Goebel): educación, desensibilización, movimiento suave, actividad funcional y carga precoz; una férula solo breve; evitar la inmovilización prolongada y la movilización que dispare mucho el dolor. Guthmiller recoge que la fisioterapia multimodal, el ejercicio aeróbico, la imaginería motora graduada, la terapia en espejo y el TENS pueden reducir el dolor o la discapacidad, aunque la evidencia es incierta y casi siempre a corto plazo.',
        fisiologia: {
          pasos: [
            'La fractura o la operación liberan en el tejido citocinas inflamatorias (TNF-α, interleucinas) y neuropéptidos de los nervios (sustancia P, CGRP, bradicinina), que dilatan los vasos y sacan líquido al tejido: calor, enrojecimiento e hinchazón (Guthmiller).',
            'Esas sustancias bajan el umbral de los nociceptores: sensibilización periférica e hiperalgesia (Guthmiller).',
            'La entrada continua de dolor excita las neuronas del asta posterior de la médula (receptores NMDA): sensibilización central, alodinia (Guthmiller).',
            'Los nociceptores expresan más receptores simpáticos, y la alteración autonómica cambia el calibre de los vasos y el sudor: cambios de color, temperatura y sudoración (Guthmiller).',
            'La representación del miembro en la corteza somatosensorial se reduce; cuanto más cambia, más dolor e hiperalgesia (Guthmiller).'
          ],
          nota: 'No hay un mecanismo principal demostrado: se considera multifactorial (Guthmiller).'
        },
        fuentes: ['Guthmiller 2025', 'Goebel 2018'],
        citas: [PQ_CITA.guthmiller, PQ_CITA.goebel]
      } },
    { id: 'pq_nervio', regiones: PQ_MIEMBROS, urgencia: 'Posible lesión de un nervio por la operación o la lesión: que la revise el cirujano con urgencia (Goebel 2018).', text: '¿Desde la operación nota un dolor quemante, hormigueo, adormecimiento o pérdida de fuerza nuevos en la zona de un nervio (por ejemplo, en la mano o el pie del lado operado)?', alerta: true,
      razonamiento: {
        porque: 'La operación o la propia lesión pueden dañar un nervio periférico: por compresión, por la cicatriz que lo atrapa, por un neuroma o, durante la cirugía, por un punto de sutura. El nervio dañado da un dolor quemante, hormigueo, adormecimiento o debilidad en su territorio, el de la piel y los músculos que inerva.',
        peso: 'La guía del Royal College of Physicians pide que el cirujano revise con urgencia un dolor quemante en el territorio de un nervio tras una operación ortopédica, por la posibilidad de que la cirugía o la lesión lo hayan dañado; algunas de esas lesiones pueden operarse (Goebel). Tras una fractura o una operación con yeso, la hoja de información que propone la misma guía pide volver a urgencias de inmediato si aparecen hormigueo o adormecimiento, no se pueden mover los dedos, cambia el color (azulado o morado), aumenta la hinchazón o aumenta el dolor (Goebel). Lo que lo distingue de un SDRC es el reparto: el dolor del nervio sigue su territorio, el del SDRC es regional (Guthmiller). Fuente única, de consenso de expertos.',
        detalle: 'Qué dice la guía (Goebel, práctica quirúrgica, p. 13): en el contexto quirúrgico, las causas de dolor persistente del miembro que hay que descartar antes de pensar en un SDRC son la infección, la fijación defectuosa, la inestabilidad, la artrosis y el dolor neuropático por atrapamiento o lesión de un nervio; un dolor «escaldante» en el territorio de un nervio periférico debe revisarlo el cirujano con urgencia. Cuando un SDRC se acompaña de la lesión de un nervio mayor (tipo 2), la causa de esa lesión, si no está clara, debe estudiarla un neurólogo; en ocasiones se puede operar (compresión por cicatriz, neuroma o lesión durante la cirugía, por ejemplo por un punto) (Goebel, pp. 6 y 16).\n\nLa hoja para el paciente tras una fractura o una operación (Goebel, apéndice 7) pide volver a urgencias de inmediato con hinchazón que aumenta, hormigueo o adormecimiento, incapacidad para mover los dedos, color azulado o morado o dolor que aumenta, y revisar el yeso si aprieta, duele más o se mueve.',
        fuentes: ['Goebel 2018', 'Guthmiller 2025'],
        citas: [PQ_CITA.goebel, PQ_CITA.guthmiller]
      } },
    // Variante de pq_nervio para la columna (decisión del usuario, 2026-10, Fase M):
    // tras cirugía de columna, el déficit nuevo es radicular o medular, no de un nervio periférico.
    { id: 'pq_nervio_col', regiones: ['lumbar', 'cervical'], urgencia: 'Posible hematoma epidural o lesión neurológica tras la cirugía de columna: urgencias o el cirujano, hoy.', text: '¿Desde la operación de columna nota en los brazos o las piernas un dolor, hormigueo, adormecimiento o pérdida de fuerza nuevos o que van a más, torpeza al caminar, o cambios al orinar o al hacer de vientre?', alerta: true,
      razonamiento: {
        porque: 'Tras una operación de columna, un sangrado dentro del canal vertebral (hematoma epidural), una fuga de líquido cefalorraquídeo, una lesión de los vasos que irrigan la médula o la manipulación de las raíces durante la cirugía pueden dañar las raíces o la médula (Finucane, con la información del NHS sobre la descompresión lumbar). El resultado es un déficit nuevo: alteración de la sensibilidad, debilidad de las piernas, parálisis o alteración del intestino (Wang).',
        peso: 'Es una urgencia. El hematoma epidural sintomático es raro (0,1–0,4 % de las cirugías de columna según Wang; unas 9 de cada 10 000 cirugías cervicales en la serie de Schroeder), pero si se reconoce pronto y se evacua muchos pacientes se recuperan por completo, y el retraso puede dejar una lesión irreversible (Schroeder). No hace falta seguir ingresado para que aparezca: aunque suele dar la cara en las primeras 24 horas, casi un tercio de los hematomas tras cirugía lumbar posterior aparecieron después del tercer día y hasta las dos semanas (Wang), y en la serie cervical los síntomas aparecieron de media a los 4,7 días (Schroeder).',
        detalle: 'Qué hacer con un SÍ: explorar dermatomas, miotomas y reflejos, y preguntar por la vejiga, el intestino y la sensibilidad en silla de montar, como ante una sospecha de cola de caballo (Finucane); comparar con la exploración de antes de la operación si se conoce, y derivar el mismo día. Un déficit que ya existía antes de operarse y no ha cambiado no es esto.\n\nCifras: Finucane estima la cola de caballo tras la cirugía en un 0,08–0,2 % y recoge que el 23 % de las reclamaciones por cirugía de columna en Inglaterra tienen que ver con ella. En la serie cervical de Schroeder (16 582 cirugías), todos los pacientes con hematoma empezaron con un déficit neurológico; 9 de 15 se recuperaron por completo tras la evacuación.\n\nFactores de riesgo del hematoma (Wang): más de 60 años, índice de masa corporal alto, cirugía previa de columna, alteraciones de la coagulación, antiinflamatorios, sangrado durante la operación de más de 1 litro y cirugía de varios niveles; en el tardío, la tensión arterial alta tras la operación y una cirugía previa en el mismo nivel.',
        fuentes: ['Finucane 2020', 'Wang 2020', 'Schroeder 2017'],
        citas: [
          { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 2 (cola de caballo), pp. 9 y 13.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
          { texto: 'Wang 2020 — Wang, Wang, Zeng, Zhong, Chen y Li, «Delayed Onset Postoperative Spinal Epidural Hematoma after Lumbar Spinal Surgery: Incidence, Risk Factors, and Clinical Outcomes», Biomed Res Int 2020;2020:8827962 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7775149/' },
          { texto: 'Schroeder 2017 — Schroeder, Hilibrand, Arnold et al., «Epidural Hematoma Following Cervical Spine Surgery», Global Spine J 2017;7(1 Suppl):120S–126S (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5400190/' }
        ]
      } }
  ]
};

// Hipótesis posquirúrgica genérica (docs/posquirurgico.md, «Propuesta:
// hipótesis posquirúrgica genérica»). No es de ninguna región ni sale de
// ningún árbol, así que no está en HYPOTHESES: phase4b.js la pone la primera
// con mecanismo Post-quirúrgico. Sin tests ni dosis propia (manda el protocolo
// del cirujano). El PROM es el que la región ya usa en sus hipótesis (unit
// test), sin fuentes nuevas.
export const HIP_POSQUIRURGICA = {
  id: 'pq1',
  posquirurgica: true,
  tests: [],
  promPorRegion: {
    hombro: 'DASH (MCID: 10.8 pts)',
    cadera: 'iHOT-12 o LEFS',
    cervical: 'NDI (MCID: 7.5–18 puntos)',
    lumbar: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    rodilla: 'KOOS',
    codo: 'DASH',
    tobillo_pie: 'FAAM o LEFS',
  },
};

// ─── Condición especial: hipermovilidad / Ehlers-Danlos (Fase P) ─────────────
// docs/hipermovilidad.md. Sistema común a las 7 regiones que solo se ve con la
// tarjeta «Hipermovilidad» de la fase 1 en Diagnosticada o Sospecha
// (`soloHipermovilidad`, sistemasActivos() en app.js). Cada pregunta lleva
// `hm`: 'urgencia' (con el subtipo vascular diagnosticado o con Sospecha) o
// 'sospecha' (con Sospecha, o Diagnosticada con subtipo otro o no lo sabe);
// `hmPeso` es el peso de la regla de sospecha del subtipo vascular (lib/hipermovilidad.js).
// El cuestionario y la escala de Beighton no son preguntas de cribado (un «sí»
// no es una bandera): van en `hipermovilidad` y se guardan en state.hipermovilidad.
const HM_CITA = {
  malfait: 'Malfait 2017 — Malfait, Francomano, Byers et al., «The 2017 international classification of the Ehlers-Danlos syndromes», Am J Med Genet C Semin Med Genet 2017;175(1):8–26',
  byers: 'Byers 2017 — Byers, Belmont, Black et al., «Diagnosis, natural history, and management in vascular Ehlers-Danlos syndrome», Am J Med Genet C Semin Med Genet 2017;175(1):40–47',
};
export const SIS_HIPERMOVILIDAD = {
  id: 'transversal_hipermovilidad', icon: '🧬', nombre: 'Hipermovilidad', soloHipermovilidad: true,
  banderasRojas: [
    { texto: 'Dolor brusco e intenso que va a más en el abdomen, el flanco, la espalda, el pecho o un miembro (disección o rotura arterial, rotura de colon)', hm: 'urgencia', pregunta: 'hm_v_dolor' },
    { texto: 'Zumbido brusco en la sien con el ojo rojo, dolorido o más saltón (fístula carótido-cavernosa)', hm: 'urgencia', pregunta: 'hm_v_ojo' },
    { texto: 'Falta de aire brusca (neumotórax espontáneo)', hm: 'urgencia', pregunta: 'hm_v_aire' },
  ],
  banderasAmarillas: [],
  preguntas: [
    { id: 'hm_v_dolor', hm: 'urgencia', urgencia: 'Posible disección o rotura arterial, o rotura de colon: urgencias hoy.', alerta: true,
      text: '¿Ha tenido de forma brusca un dolor intenso, que va a más, en el abdomen, el flanco, la espalda, el pecho o un brazo o una pierna?',
      razonamiento: {
        porque: 'En el SED vascular, una variante de COL3A1 altera el colágeno de tipo III, proteína principal de la pared de los vasos y de las vísceras huecas: por eso las arterias y el colon se disecan o se rompen (Byers 2017, p. 40). La disección duele por el desgarro de la pared, por su distensión o por la isquemia del órgano o del miembro distal (Byers 2017, p. 43). La rotura del colon da un dolor en crescendo rápido, sin alivio, casi siempre en la fosa iliaca izquierda (Byers 2017, p. 44).',
        peso: 'La disección o rotura arterial es la causa principal de muerte en el SED vascular, con una mediana de vida de unos 51 años (Byers 2017, p. 41). Las arterias que más dan síntomas son las iliacas y femorales, las mesentéricas y el tronco celiaco, las renales, la aorta y las de los miembros (p. 43); también hay disección coronaria con infarto (p. 44). La rotura de colon llega a afectar al 25–30 % (p. 42). Ante el cuadro, urgencias hoy.',
        fuentes: ['Byers 2017'],
        citas: [`${HM_CITA.byers}, pp. 40–44.`]
      } },
    { id: 'hm_v_ojo', hm: 'urgencia', urgencia: 'Posible fístula carótido-cavernosa: urgencia médica, hoy.', alerta: true,
      text: '¿Ha notado de repente un zumbido en la sien, con el ojo rojo, dolorido o más saltón?',
      razonamiento: {
        porque: 'En la fístula carótido-cavernosa la sangre arterial vuelve por las venas que rodean el ojo. El paciente puede notar un zumbido brusco en la sien, y después el ojo se inyecta, duele alrededor y se hace más saltón, con pérdida lenta de agudeza visual (Byers 2017, p. 45).',
        peso: 'Es una urgencia médica; el único tratamiento es cerrar la fístula, casi siempre por cateterismo (Byers 2017, p. 45). Un ojo algo saltón forma parte de la cara característica del SED vascular y por sí solo no es este cuadro (p. 45).',
        fuentes: ['Byers 2017'],
        citas: [`${HM_CITA.byers}, p. 45.`]
      } },
    { id: 'hm_v_aire', hm: 'urgencia', urgencia: 'Posible neumotórax: urgencias hoy.', alerta: true,
      text: '¿Le ha faltado el aire de forma brusca, o le duele el pecho al respirar?',
      razonamiento: {
        porque: 'El neumotórax espontáneo aparece en el 12 % de las personas con SED vascular, a menudo como primera manifestación; la causa probable es la rotura de pequeñas ampollas del pulmón (Byers 2017, p. 44).',
        peso: 'Recurre con frecuencia y puede necesitar desde una aspiración con aguja hasta un drenaje torácico (Byers 2017, p. 42): ante la sospecha, urgencias hoy.',
        fuentes: ['Byers 2017'],
        citas: [`${HM_CITA.byers}, pp. 42 y 44.`]
      } },
    { id: 'hm_s_familia', hm: 'sospecha', hmPeso: 'mayor',
      text: '¿Algún familiar de primer grado con SED vascular, o con una rotura o disección arterial antes de los 40 años?',
      razonamiento: {
        porque: 'El SED vascular se hereda de forma autosómica dominante (Byers 2017, p. 40). Alrededor de la mitad de los casos no tienen antecedentes familiares, y entonces el diagnóstico suele llegar tras una complicación grave (p. 41).',
        peso: 'Un antecedente familiar de la enfermedad, o de rotura o disección arterial antes de los 40 años, debe llevar a estudiar el subtipo vascular (Malfait 2017, p. 16). Por eso un SÍ basta para la derivación preferente a genética.',
        fuentes: ['Malfait 2017', 'Byers 2017'],
        citas: [`${HM_CITA.malfait}, p. 16.`, `${HM_CITA.byers}, pp. 40–41.`]
      } },
    { id: 'hm_s_rotura', hm: 'sospecha', hmPeso: 'mayor',
      text: '¿Ha tenido una rotura arterial o una rotura de intestino sin causa conocida?',
      razonamiento: {
        porque: 'La rotura arterial a edad joven y la perforación espontánea del sigma sin enfermedad diverticular son criterios mayores del SED vascular (Malfait 2017, p. 16). Sin antecedentes familiares, el diagnóstico no suele plantearse hasta después de una rotura (Byers 2017, p. 41).',
        peso: 'Una rotura arterial antes de los 40 años o una rotura de sigma sin causa deben llevar a estudiar el subtipo vascular (Malfait 2017, p. 16). Un SÍ basta para la derivación preferente a genética.',
        fuentes: ['Malfait 2017', 'Byers 2017'],
        citas: [`${HM_CITA.malfait}, p. 16.`, `${HM_CITA.byers}, p. 41.`]
      } },
    { id: 'hm_s_neumo', hm: 'sospecha', hmPeso: 'menor',
      text: '¿Ha tenido algún neumotórax espontáneo?',
      razonamiento: {
        porque: 'El neumotórax espontáneo es un criterio menor del SED vascular (Malfait 2017, p. 16); aparece en el 12 % de los afectados, a menudo como primera manifestación (Byers 2017, p. 44).',
        peso: 'Malfait lo cuenta para estudiar el subtipo vascular solo junto con otros rasgos compatibles (p. 16): por sí solo es un hallazgo, sin derivación.',
        fuentes: ['Malfait 2017', 'Byers 2017'],
        citas: [`${HM_CITA.malfait}, p. 16.`, `${HM_CITA.byers}, p. 44.`]
      } },
    { id: 'hm_s_piel', hm: 'sospecha', hmPeso: 'menor',
      text: '¿Le salen hematomas sin golpes, en sitios poco habituales (mejillas, espalda), o tiene la piel fina y translúcida, con las venas muy visibles?',
      razonamiento: {
        porque: 'Los hematomas sin un traumatismo identificado o en sitios poco habituales, como las mejillas o la espalda, y la piel fina y translúcida con las venas más visibles son criterios menores del SED vascular (Malfait 2017, p. 16). En la infancia, los hematomas fáciles son la forma de presentación más común (Byers 2017, p. 41).',
        peso: 'La piel fina suele ser un hallazgo sutil; son más frecuentes los hematomas sin traumatismo, que aumentan con la aspirina o los antiinflamatorios (Byers 2017, p. 45). Cuenta como criterio menor: deriva junto con otro rasgo (Malfait 2017, p. 16).',
        fuentes: ['Malfait 2017', 'Byers 2017'],
        citas: [`${HM_CITA.malfait}, p. 16.`, `${HM_CITA.byers}, pp. 41 y 45.`]
      } },
    { id: 'hm_s_varices', hm: 'sospecha', hmPeso: 'menor',
      text: '¿Tuvo varices antes de los 30 años (y, si es mujer, sin haber estado embarazada)?',
      razonamiento: {
        porque: 'Las varices de comienzo precoz, antes de los 30 años y, en una mujer, sin embarazos, son un criterio menor del SED vascular (Malfait 2017, p. 16). La insuficiencia venosa superficial es más frecuente que en la población general (37 % frente a 17–23 %) y casi la mitad la nota antes de los 20 años (Byers 2017, p. 45).',
        peso: 'Cuenta como criterio menor: deriva junto con otro rasgo (Malfait 2017, p. 16).',
        fuentes: ['Malfait 2017', 'Byers 2017'],
        citas: [`${HM_CITA.malfait}, p. 16.`, `${HM_CITA.byers}, p. 45.`]
      } },
  ],
  // Cuestionario, escala de Beighton y textos de la condición. Las citas de
  // los textos cuentan en docs/referencias.md como menciones del cribado.
  hipermovilidad: {
    cuestionario: [
      { id: 'cq1', texto: '¿Puede ahora (o pudo alguna vez) apoyar las palmas de las manos en el suelo sin doblar las rodillas?' },
      { id: 'cq2', texto: '¿Puede ahora (o pudo alguna vez) doblar el pulgar hasta tocar el antebrazo?' },
      { id: 'cq3', texto: 'De niño o niña, ¿entretenía a sus amigos contorsionando el cuerpo en posturas raras, o podía abrirse de piernas del todo (spagat)?' },
      { id: 'cq4', texto: 'De niño o adolescente, ¿se le salió el hombro o la rótula más de una vez?' },
      { id: 'cq5', texto: '¿Se considera una persona hiperlaxa, «de goma», o con las articulaciones muy flexibles?' },
    ],
    cuestionarioFuente: 'Malfait 2017, tabla III, p. 17 (adaptado del cuestionario de Hakim y Grahame; traducción propia, no validada). Dos o más «sí» sugieren hipermovilidad: sensibilidad del 80–85 % y especificidad del 80–90 %.',
    beighton: [
      { id: 'menique', texto: 'Meñique: la MCF se hiperextiende más de 90° con la palma y el antebrazo apoyados y el codo a 90°', lados: true },
      { id: 'pulgar', texto: 'Pulgar: se lleva pasivamente hasta tocar el antebrazo, con el brazo al frente y la mano en pronación', lados: true },
      { id: 'codo', texto: 'Codo: se extiende más de 10°, con el brazo en cruz y la mano en supinación', lados: true },
      { id: 'rodilla', texto: 'Rodilla: de pie, con las rodillas bloqueadas en recurvatum, se extiende más de 10°', lados: true },
      { id: 'tronco', texto: 'Tronco: con las rodillas extendidas y los pies juntos, apoya las palmas planas en el suelo delante de los pies', lados: false },
    ],
    beightonFuente: 'Malfait 2017, fig. 2, p. 15: cada articulación con goniómetro y cada lado por separado; máximo 9 puntos.',
    // Cortes para la hipermovilidad generalizada en el SEDh (Malfait 2017,
    // p. 17): ≥6 en niños prepúberes y adolescentes, ≥5 hasta los 50, ≥4 por
    // encima. La pubertad no se deduce de la edad: hasta los 17, el de 6.
    cortes: [
      { edadMax: 17, corte: 6, grupo: 'niños y adolescentes' },
      { edadMax: 50, corte: 5, grupo: 'hasta los 50 años' },
      { edadMax: null, corte: 4, grupo: 'por encima de los 50 años' },
    ],
    cortesFuente: 'Malfait 2017, p. 17: con 1 punto menos que el corte de su edad y el cuestionario positivo también hay hipermovilidad generalizada.',
    notaLimitacion: 'Una limitación adquirida (cirugía, artrodesis lumbar…) puntúa negativa si hoy no se puede hacer, aunque antes sí se pudiera (Malfait 2017, p. 18).',
    textos: {
      laxitud: 'Hipermovilidad: compara siempre con el lado sano y anota si la laxitud es simétrica. Cuenta como positivo una laxitud asimétrica o que reproduzca su síntoma.',
      ejercicio: 'Ejercicio graduado; vigila la carga para asegurar la recuperación (Engelbert 2017, p. 165). El dolor empeora con la actividad y puede aparecer en las 24 h siguientes (observado en niños; Engelbert 2017, p. 160).',
      sistemicos: 'Si hay disautonomía o síntomas digestivos o urinarios importantes, derivar al especialista (Engelbert 2017, p. 165).',
      vascular: 'Subtipo vascular: evitar deportes de colisión, ejercicio isométrico y aceleraciones bruscas; intensidad que permita conversar, control de la respiración al levantar peso y cargas ligeras (Byers 2017, p. 42).',
      derivarHAG: 'Hipermovilidad articular generalizada: valorar derivación a reumatología o genética. No es un diagnóstico de SED hipermóvil, que exige además otros criterios (Malfait 2017, p. 17).',
      sinHAG: 'Sin hipermovilidad articular generalizada según la escala de Beighton.',
      derivarVascular: 'Rasgos que hacen sospechar el subtipo vascular: derivación preferente a genética (Malfait 2017, p. 16).',
      hallazgoVascular: 'Un rasgo menor del subtipo vascular: por sí solo es un hallazgo; deriva junto con otro (Malfait 2017, p. 16).',
    },
  },
};

// ─── Condición especial: POTS / disautonomía (Fase P) ─────────────────────────
// docs/pots.md. Sistema común a las 7 regiones que solo se ve con la tarjeta
// «Disautonomía / POTS» de la fase 1 en Diagnosticada o Sospecha
// (`soloDisautonomia`, sistemasActivos() en app.js). Las cuatro preguntas del
// síncope de alto riesgo (`urgencia`) se ven con los dos estados; la de la
// taquicardia paroxística lleva `derivacion` (no urgente). El patrón de
// sospecha y la prueba de bipedestación activa no son preguntas de cribado
// (un «sí» no es una bandera): van en `disautonomia` y se guardan en
// state.disautonomia (lib/disautonomia.js).
const DS_CITA = {
  brignole: 'Brignole 2018 — Brignole, Moya, de Lange et al., «2018 ESC Guidelines for the diagnosis and management of syncope», Eur Heart J 2018;39(21):1883–1948',
  nice: 'NICE CG109 — NICE, «Transient loss of consciousness (\'blackouts\') in over 16s», guía clínica CG109 (2010, actualizada en 2023), capítulo «Recommendations»',
  sheldon: 'Sheldon 2015 — Sheldon, Grubb, Olshansky et al., «2015 Heart Rhythm Society expert consensus statement on the diagnosis and treatment of postural tachycardia syndrome, inappropriate sinus tachycardia, and vasovagal syncope», Heart Rhythm 2015;12(6):e41–e63',
  raj22: 'Raj 2022 — Raj, Fedorowski y Sheldon, «Diagnosis and management of postural orthostatic tachycardia syndrome», CMAJ 2022;194(10):E378–E385',
};
// Pregunta de síncope de alto riesgo para el sistema vascular o cardiovascular
// de cada región (decisión 9 de docs/pots.md): sin ella, a quien no tiene
// marcada la tarjeta «Disautonomía / POTS» nadie le preguntaba por el síncope
// de esfuerzo. La misma instancia en las 7 regiones; no sustituye a las 4
// preguntas detalladas del sistema de disautonomía, que siguen saliendo con la
// tarjeta (las dos conviven: ocultar una con la tarjeta haría desaparecer de
// `ur` un SÍ ya marcado).
export const PREGUNTA_SINCOPE = { id: 'sx_sincope', urgencia: 'Síncope con rasgos de alto riesgo: valoración médica urgente (en 24 h) y sin ejercicio hasta entonces.', alerta: true,
  text: 'Si se ha desmayado alguna vez: ¿fue mientras hacía un esfuerzo, estando tumbado, justo después de notar de golpe el corazón muy rápido, o con dolor en el pecho o falta de aire nuevos? ¿O algún familiar suyo murió de forma súbita antes de los 40 años?',
  razonamiento: {
    porque: 'La mayoría de los desmayos son reflejos (vasovagales) o por una bajada de tensión al ponerse de pie, y avisan antes con mareo, calor, sudor o náuseas. Los que no encajan con eso orientan al corazón: durante el esfuerzo el corazón tiene que aumentar su gasto y una arritmia o una obstrucción se lo impiden; tumbado, la gravedad no explica el desmayo; y una muerte súbita joven en la familia es a menudo la primera pista de una cardiopatía hereditaria (Brignole 2018, tablas 5 y 6).',
    peso: 'Son rasgos de alto riesgo en la guía europea: no se da el alta desde urgencias y se pide una valoración temprana (Brignole 2018, tabla 6). NICE pide derivar con urgencia, con revisión en 24 h, el síncope durante el esfuerzo, con antecedente familiar de muerte súbita antes de los 40 años o una cardiopatía hereditaria, con falta de aire nueva, con un soplo o con insuficiencia cardiaca, y no hacer ejercicio hasta la valoración si fue durante el esfuerzo (NICE CG109, 1.1.4.2 y 1.3.2.2).',
    detalle: 'Durante o después: el síncope durante el ejercicio es probablemente cardiaco; el que llega justo al pararlo, casi siempre reflejo (Brignole 2018, p. 1911). En jóvenes lo más frecuente sigue siendo el vasovagal, pero el síncope de esfuerzo debe estudiarse por miocardiopatía o arritmia (Sheldon 2015, sección 4).\n\nAntecedente familiar: NICE lo da como motivo de derivación urgente con cualquier síncope (1.1.4.2); la guía europea lo considera de alto riesgo solo con cardiopatía estructural o un ECG alterado (tabla 6). Como el fisioterapeuta no puede comprobar ninguna de las dos cosas, PhysiQ sigue a NICE.\n\nSi el paciente tiene un POTS u otra disautonomía, o se sospecha, márcalo en la tarjeta «Disautonomía / POTS» de la fase 1: un POTS conocido no explica un síncope con estos rasgos (que exista una enfermedad no quiere decir que el síncope venga de ella; Brignole 2018, p. 1925).\n\nMientras espera la valoración: explicarle qué hacer si se repite, que evite el esfuerzo y que no conduzca (NICE CG109, 1.5.4.3).',
    fuentes: ['Brignole 2018', 'NICE CG109', 'Sheldon 2015'],
    citas: ['Brignole 2018 — Brignole, Moya, de Lange et al., «2018 ESC Guidelines for the diagnosis and management of syncope», Eur Heart J 2018;39(21):1883–1948, tablas 5 y 6 (pp. 1895–1898), p. 1911 y p. 1925.',
      'NICE CG109 — NICE, «Transient loss of consciousness (\'blackouts\') in over 16s», guía clínica CG109 (2010, actualizada en 2023), capítulo «Recommendations», recomendaciones 1.1.4.2, 1.3.2.2 y 1.5.4.3.',
      'Sheldon 2015 — Sheldon, Grubb, Olshansky et al., «2015 Heart Rhythm Society expert consensus statement on the diagnosis and treatment of postural tachycardia syndrome, inappropriate sinus tachycardia, and vasovagal syncope», Heart Rhythm 2015;12(6):e41–e63, sección 4.']
  } };

export const SIS_DISAUTONOMIA = {
  id: 'transversal_disautonomia', icon: '🫀', nombre: 'Disautonomía', soloDisautonomia: true,
  banderasRojas: [
    { texto: 'Síncope durante el esfuerzo (no al pararlo)', pregunta: 'ds_u_esfuerzo' },
    { texto: 'Síncope tumbado, o justo después de palpitaciones bruscas', pregunta: 'ds_u_tumbado' },
    { texto: 'Síncope con dolor torácico o falta de aire nuevos, soplo o enfermedad del corazón', pregunta: 'ds_u_corazon' },
    { texto: 'Síncope con antecedente familiar de muerte súbita antes de los 40 o cardiopatía hereditaria', pregunta: 'ds_u_familia' },
  ],
  banderasAmarillas: [
    { texto: 'Taquicardia que empieza y acaba de golpe y no depende de la postura', pregunta: 'ds_d_paroxistica' },
  ],
  preguntas: [
    { id: 'ds_u_esfuerzo', urgencia: 'Síncope durante el esfuerzo: valoración médica urgente (en 24 h) y sin ejercicio hasta entonces.', alerta: true,
      text: '¿Se ha desmayado alguna vez mientras hacía un esfuerzo (no justo al pararlo)?',
      razonamiento: {
        porque: 'Durante el ejercicio el corazón tiene que aumentar su gasto. Si una arritmia o una obstrucción a la salida del corazón se lo impiden, la tensión cae y el cerebro se queda sin riego. Por eso el síncope durante el esfuerzo orienta a una causa cardiaca, mientras que el que llega justo al pararlo es casi siempre reflejo (Brignole 2018, p. 1911; NICE CG109, 1.3.2.1).',
        peso: 'Es un rasgo de alto riesgo mayor en la guía europea (Brignole 2018, tabla 6), y NICE pide derivarlo con urgencia para una valoración cardiovascular en 24 h, con prueba de esfuerzo en 7 días y sin hacer ejercicio hasta entonces (NICE CG109, 1.1.4.2 y 1.3.2.2). Un POTS conocido no lo explica: que exista una enfermedad no quiere decir que el síncope venga de ella (Brignole 2018, p. 1925).',
        detalle: 'Durante o después: el síncope durante el ejercicio es probablemente cardiaco; el que aparece justo después, casi siempre reflejo, por la vasodilatación que queda al parar (Brignole 2018, p. 1911). En jóvenes lo más frecuente sigue siendo el vasovagal, pero el síncope de esfuerzo debe estudiarse por miocardiopatía o arritmia (Sheldon 2015, sección 4).\n\nEn el POTS: del 30 al 50 % de los pacientes se desmaya alguna vez, casi siempre de pie y con aviso; el POTS y el síncope vasovagal pueden coexistir (Sheldon 2015). Esta pregunta busca el que no encaja con eso.\n\nMientras espera la valoración: explicarle qué hacer si se repite, que evite el esfuerzo y que no conduzca (NICE CG109, 1.5.4.3).',
        fuentes: ['Brignole 2018', 'NICE CG109', 'Sheldon 2015'],
        citas: [`${DS_CITA.brignole}, tabla 6 (pp. 1897–1898), p. 1911 y p. 1925.`, `${DS_CITA.nice}, recomendaciones 1.1.4.2, 1.3.2.1, 1.3.2.2 y 1.5.4.3.`, `${DS_CITA.sheldon}, secciones 1 y 4.`]
      } },
    { id: 'ds_u_tumbado', urgencia: 'Síncope tumbado o tras palpitaciones bruscas: valoración médica urgente (en 24 h).', alerta: true,
      text: '¿Se ha desmayado estando tumbado, o justo después de notar de golpe el corazón muy rápido?',
      razonamiento: {
        porque: 'Tumbado, la gravedad no vacía el cerebro de sangre, así que ni el reflejo vasovagal ni la hipotensión ortostática, que necesitan estar de pie, lo explican. Un síncope tumbado, o el que sigue enseguida a unas palpitaciones bruscas, orienta a una arritmia (Brignole 2018, tablas 5 y 6).',
        peso: 'Los dos son rasgos de alto riesgo mayores en la guía europea: no se da el alta desde urgencias y se pide una valoración temprana e intensiva (Brignole 2018, tabla 6 y fig. 6). En el POTS la frecuencia sube poco a poco al ponerse de pie, no de golpe (Raj 2022).',
        fuentes: ['Brignole 2018', 'Raj 2022'],
        citas: [`${DS_CITA.brignole}, tablas 5 y 6 (pp. 1895–1898) y fig. 6 (p. 1899).`, `${DS_CITA.raj22}, «What other disorders can cause orthostatic intolerance?».`]
      } },
    { id: 'ds_u_corazon', urgencia: 'Síncope con síntomas o enfermedad del corazón: valoración médica urgente (en 24 h).', alerta: true,
      text: 'Si se ha desmayado: ¿tenía a la vez dolor en el pecho o falta de aire nuevos, o le han dicho que tiene un soplo, insuficiencia cardiaca u otra enfermedad del corazón?',
      razonamiento: {
        porque: 'Un dolor torácico o una falta de aire nuevos junto al síncope pueden ser una isquemia, una embolia de pulmón o una disección de aorta; con una enfermedad del corazón (insuficiencia cardiaca, valvulopatía, infarto previo) el síncope puede ser arrítmico (Brignole 2018, tabla 6 y p. 1925).',
        peso: 'Todos son rasgos de alto riesgo mayores (Brignole 2018, tabla 6), y NICE pide la valoración cardiovascular en 24 h ante un síncope con insuficiencia cardiaca, falta de aire nueva o sin explicación, o un soplo (NICE CG109, 1.1.4.2). Con una cardiopatía o una arritmia hereditaria, haber tenido un síncope multiplica por dos a cuatro el riesgo de muerte (Brignole 2018, p. 1925).',
        fuentes: ['Brignole 2018', 'NICE CG109'],
        citas: [`${DS_CITA.brignole}, tabla 6 (pp. 1897–1898) y p. 1925.`, `${DS_CITA.nice}, recomendación 1.1.4.2.`]
      } },
    { id: 'ds_u_familia', urgencia: 'Síncope con antecedente familiar de muerte súbita o cardiopatía hereditaria: valoración cardiológica en 24 h.', alerta: true,
      text: 'Si se ha desmayado: ¿algún familiar murió de forma súbita antes de los 40 años, o tiene una enfermedad del corazón hereditaria?',
      razonamiento: {
        porque: 'Las cardiopatías hereditarias (miocardiopatía hipertrófica, QT largo, síndrome de Brugada, miocardiopatía arritmogénica) pueden dar síncopes arrítmicos en jóvenes con un corazón que parece normal, y una muerte súbita joven en la familia es a menudo la primera pista (Brignole 2018, tabla 5).',
        peso: 'NICE pide la valoración cardiovascular en 24 h ante un síncope con antecedente familiar de muerte súbita antes de los 40 años o una cardiopatía hereditaria (NICE CG109, 1.1.4.2). La guía europea lo cuenta como rasgo menor, de alto riesgo solo con cardiopatía estructural o un ECG alterado (Brignole 2018, tabla 6); como el fisioterapeuta no puede comprobar ninguna de las dos cosas, PhysiQ sigue a NICE.',
        fuentes: ['NICE CG109', 'Brignole 2018'],
        citas: [`${DS_CITA.nice}, recomendación 1.1.4.2.`, `${DS_CITA.brignole}, tablas 5 y 6 (pp. 1895–1898).`]
      } },
    { id: 'ds_d_paroxistica', derivacion: 'Taquicardia de inicio y fin bruscos que no depende de la postura: valoración médica (descartar una taquicardia paroxística).', alerta: true,
      text: '¿Le dan episodios en que el corazón se le dispara de golpe y se le para también de golpe, aunque esté sentado o tumbado, sin llegar a desmayarse?',
      razonamiento: {
        porque: 'En el POTS la taquicardia es sinusal: sube poco a poco al ponerse de pie y baja al tumbarse. Una taquicardia que empieza y acaba de golpe, que no depende de la postura o que se corta con un Valsalva hace pensar en una taquicardia paroxística supraventricular (Raj 2022).',
        peso: 'Sin desmayo no es una urgencia, pero sí una derivación: el diagnóstico necesita un ECG durante el episodio o un registro ambulatorio. Si las palpitaciones bruscas acaban en desmayo, es la pregunta del síncope tras palpitaciones, un rasgo de alto riesgo (Brignole 2018, tabla 6).',
        fuentes: ['Raj 2022', 'Brignole 2018'],
        citas: [`${DS_CITA.raj22}, «What other disorders can cause orthostatic intolerance?».`, `${DS_CITA.brignole}, tabla 6 (pp. 1897–1898).`]
      } },
  ],
  // Patrón de sospecha, prueba de bipedestación activa y textos de la
  // condición. Las citas de estos textos cuentan en docs/referencias.md como
  // menciones del cribado.
  disautonomia: {
    sospecha: [
      { id: 'io1', texto: 'Desde hace 3 meses o más, ¿estar de pie le da con frecuencia mareo o aturdimiento, palpitaciones, temblor, debilidad, visión borrosa o cansancio, y se le pasa al tumbarse?' },
      { id: 'io2', texto: '¿Le empeora con el calor, después de comer, con el alcohol, al hacer fuerza o al levantarse de golpe?' },
      { id: 'io3', texto: '¿Toma algún fármaco que acelere el corazón (estimulantes, algunos antidepresivos), ha estado mucho tiempo en cama o ha perdido sangre o líquidos hace poco?', diferencial: true },
    ],
    sospechaFuente: 'El POTS exige síntomas de pie de 3 meses o más que mejoran al tumbarse (Vernino 2021; Raj 2020, §3.2; Raj 2022, recuadro 2). Agravantes: el calor, la deshidratación, el alcohol y el ejercicio (Sheldon 2015), las comidas y el Valsalva (Hakim 2017, p. 171), levantarse de golpe (Fedorowski 2019, tabla 5).',
    diferencialFuente: 'Un «sí» en la última no suma: la taquicardia al ponerse de pie por fármacos, reposo en cama o pérdida de volumen es una «taquicardia postural de otra causa» y excluye el POTS (Raj 2020, tabla 5). La anemia, el tiroides y el sangrado ya los pregunta el cribado de la región.',
    hipermovilidad: 'En las consultas de POTS, entre el 20 y el 30 % cumple los criterios del SED hipermóvil o del trastorno del espectro de la hipermovilidad, con evidencia débil (Vernino 2021; Raj 2022), y no se conoce un mecanismo que los una (Miller 2020). La exploración del POTS incluye valorar la hipermovilidad (Raj 2022): si refiere ser muy flexible, mira la tarjeta «Hipermovilidad».',
    prueba: {
      minutos: [1, 3, 5, 8, 10],
      preparacion: [
        { id: 'reposo', texto: 'Tumbado al menos 5 min antes de la primera medida' },
        { id: 'sala', texto: 'Habitación tranquila y templada (20–24 °C)' },
        { id: 'vejiga', texto: 'Ha vaciado la vejiga' },
      ],
      fuente: 'Tumbado al menos 5 min y de pie hasta 10 min; la taquicardia tiene que mantenerse en 2 medidas seguidas después del primer minuto (Raj 2020, rec. 4). Minutos de medida: Raj 2022. Preparación: Hakim 2017, p. 171. Si la FC tumbado es menor de 60, la referencia es 60 (Raj 2020, p. 363).',
      seguridad: 'Quédate a su lado durante la prueba. Si aparece un mareo fuerte o un presíncope, siéntalo o túmbalo y para: las medidas que falten no cuentan.',
      pesa: 'Cuánto pesa: con el corte de 30 lpm, la bipedestación de 10 min tuvo una sensibilidad del 87 % y una especificidad del 67 %; uno de cada tres sanos superó el corte (Plash 2013). Por eso el diagnóstico exige además los síntomas y descartar otras causas.',
    },
    textos: {
      compatible: 'Compatible con taquicardia ortostática. El POTS lo diagnostica el médico: exige síntomas de 3 meses o más y descartar otras causas. Derivación preferente a su médico de atención primaria (Raj 2020, recs. 1 y 30).',
      sinSintomas: 'Sin síntomas durante la prueba: la taquicardia al ponerse de pie sin síntomas no es un POTS (Raj 2020, §3.7).',
      ho: 'Caída de la tensión al ponerse de pie: hipotensión ortostática, no un POTS. Valoración médica, con revisión de los fármacos (Brignole 2018, p. 1902; NICE CG109, 1.5.4.2).',
      noCorte: 'No llega al corte. No descarta una disautonomía: con una sospecha alta, repetir otro día, mejor por la mañana (Sivakoti 2026, enunciado 10; Raj 2022).',
      ultima: 'Solo la última medida supera el corte: repite la medida 1 min después (Raj 2020, p. 361).',
      reposoAlta: 'FC tumbado por encima de 100: coméntalo con su médico (taquicardia sinusal inapropiada u otra causa; Raj 2020, §3.8).',
      tasBaja: 'TAS tumbado por debajo de 90: si se ha desmayado, es un rasgo de alto riesgo (Brignole 2018, tabla 6).',
      menor12: 'Por debajo de los 12 años el POTS no está definido (Vernino 2021, §11): la prueba no se interpreta.',
      ejercicio: 'Ejercicio regular, al principio semirreclinado (remo, bicicleta reclinada, natación) y lo vertical poco a poco; al menos 4 días por semana, sesiones de al menos 30 min (Raj 2020, rec. 14). La mejoría puede tardar 4–6 semanas y al principio puede encontrarse peor (Raj 2020; Vernino 2021).',
      adaptaciones: 'Mejor ejercicio dinámico que isométrico (el isométrico provoca maniobras de Valsalva que bajan la tensión), no comer en la hora anterior y terminar con una vuelta a la calma suave (Hakim 2017, p. 172).',
      seguridad: 'Un desmayo durante el esfuerzo, tumbado, tras palpitaciones bruscas o con síntomas del corazón no lo explica la disautonomía: valoración médica urgente (Brignole 2018, tabla 6; NICE CG109, 1.1.4.2).',
      derivar: 'Aumento de la FC al ponerse de pie sin hipotensión ortostática: derivación preferente a su médico de atención primaria para confirmar el diagnóstico y descartar otras causas (Raj 2020, rec. 30).',
      medico: 'El agua, la sal, las prendas de compresión y los fármacos los indica el médico (Raj 2020, recs. 11–13; Brignole 2018, p. 1921).',
      tolerancia: 'Disautonomía: separa lo que limita estar de pie (mareo, palpitaciones) de lo que limita la carga del tejido; la matriz mide lo segundo. La debilidad, el dolor muscular y la intolerancia al esfuerzo forman parte del cuadro (Fedorowski 2019, tabla 2).',
      tecnica4b: 'Disautonomía: haz en decúbito o sentado lo que la técnica permita, evita mantener una contracción isométrica o un Valsalva prolongado y, si aparece mareo de pie, vuelve a tumbarlo antes de seguir (Hakim 2017, pp. 171–172).',
      mareoCervical: 'Disautonomía: el mareo al ponerse de pie que mejora al tumbarse orienta a intolerancia ortostática, no a mareo cervicogénico (Raj 2022, recuadro 2).',
    },
  },
};

// ─── Condición especial: lupus eritematoso sistémico (Fase P) ─────────────────
// docs/lupus.md. Sistema común a las 7 regiones que solo se ve con la tarjeta
// «Lupus (LES)» de la fase 1 activa (`soloLupus`, sistemasActivos() en app.js).
// Cada pregunta lleva `les: 'diagnosticado'`: las urgencias y las derivaciones
// son para quien ya tiene el diagnóstico (decisión 5); con «Sospecha» el
// sistema solo muestra los rasgos que justifican una valoración médica, que no
// son preguntas de cribado (un «sí» no es una bandera): van en `lupus.rasgos` y
// se guardan en state.lupus (lib/lupus.js). Las del cribado regional (artritis
// séptica, TVP, síncope) siguen saliendo igual con la tarjeta o sin ella.
const LES_CITA = {
  aringer: 'Aringer 2019 — Aringer, Costenbader, Daikh et al., «2019 European League Against Rheumatism/American College of Rheumatology classification criteria for systemic lupus erythematosus», Arthritis Rheumatol 2019;71(9):1400–1412',
  rao: 'Rao y Mikdashi 2023 — Rao y Mikdashi, «A framework to overcome challenges in the management of infections in patients with systemic lupus erythematosus», Open Access Rheumatol 2023;15:125–137',
  tektonidou: 'Tektonidou 2019 — Tektonidou, Andreoli, Limper et al., «EULAR recommendations for the management of antiphospholipid syndrome in adults», Ann Rheum Dis 2019;78(10):1296–1304',
  pisetsky: 'Pisetsky 2021 — Pisetsky, Eudy, Clowse y Rogers, «The categorization of pain in systemic lupus erythematosus», Rheum Dis Clin North Am 2021;47(2):215–228',
  kaneko: 'Kaneko 2021 — Kaneko, Chen, Kaufman et al., «Glucocorticoid-induced osteonecrosis in systemic lupus erythematosus patients», Clin Transl Med 2021;11(10):e526',
  thanou: 'Thanou 2021 — Thanou, Jupe, Purushothaman, Niewold y Munroe, «Clinical disease activity and flare in SLE: current concepts and novel biomarkers», J Autoimmun 2021;119:102615',
  ruperto: 'Ruperto 2011 — Ruperto, Hanrahan, Alarcón et al., «International consensus for a definition of disease flare in lupus», Lupus 2011;20(5):453–462',
  fanouriakis: 'Fanouriakis 2024 — Fanouriakis, Kostopoulou, Andersen et al., «EULAR recommendations for the management of systemic lupus erythematosus: 2023 update», Ann Rheum Dis 2024;83(1):15–29',
  sammaritano: 'Sammaritano 2025 — Sammaritano, Askanase, Bermas et al., «2025 American College of Rheumatology (ACR) Guideline for the Treatment of Systemic Lupus Erythematosus», Arthritis Rheumatol (2026), versión en línea',
  gordon: 'Gordon 2018 — Gordon, Amissah-Arthur, Gayed et al., «The British Society for Rheumatology guideline for the management of systemic lupus erythematosus in adults», Rheumatology 2018;57(1):e1–e45',
  goodman: GOODMAN_BANDERAS + 'cap. 12 «Screening for Immunologic Disease» (Auyeung y Hickman)',
  nice: 'NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing», guía NG158 (2020, actualizada en 2023), recomendaciones 1.1.1–1.1.4',
};
const LES_SP = {
  bowers: { texto: 'Bowers y Blum 2026 — Bowers y Blum, «Systemic Lupus Erythematosus», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026', url: 'https://www.ncbi.nlm.nih.gov/books/NBK535405/' },
  rout: { texto: 'Rout 2024 (síndrome antifosfolípido) — Rout, Goyal y Singhal, «Antiphospholipid Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 6 de mayo de 2024', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430980/' },
  yasir: { texto: 'Yasir 2023 — Yasir, Goyal y Sonthalia, «Corticosteroid Adverse Effects», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023', url: 'https://www.ncbi.nlm.nih.gov/books/NBK531462/' },
  matthews: { texto: 'Matthews 2023 — Matthews, Davis, Fish y Stitson, «Avascular Necrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de agosto de 2023', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537007/' },
  barney: { texto: 'Barney 2023 — Barney, Piuzzi y Akhondi, «Femoral Head Avascular Necrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023', url: 'https://www.ncbi.nlm.nih.gov/books/NBK546658/' },
  deeb: { texto: 'Deeb y Maher 2026 (Raynaud) — Deeb y Maher, «Raynaud Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499833/' },
  waheed: { texto: 'Waheed 2023 — Waheed, Kudaravalli y Hotwagner, «Deep Venous Thrombosis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2023', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507708/' },
  saliba: { texto: 'Saliba 2026 — Saliba, Blum, Goyal y Chauhan, «Drug-Induced Lupus Erythematosus», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de enero de 2026', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441889/' },
};
// Una cita de StatPearls con su localización: { texto, url } del registro.
const spCita = (c, donde) => ({ texto: `${c.texto}, ${donde}.`, url: c.url });

export const SIS_LUPUS = {
  id: 'transversal_lupus', icon: '🦋', nombre: 'Lupus', soloLupus: true,
  banderasRojas: [
    { texto: 'Fiebre, escalofríos o malestar general nuevos (infección; con corticoides o inmunosupresores puede no haber fiebre)', les: 'diagnosticado', pregunta: 'les_u_fiebre' },
    { texto: 'Pierna o brazo hinchados, calientes y dolorosos de forma nueva (TVP)', les: 'diagnosticado', pregunta: 'les_u_tvp' },
    { texto: 'Falta de aire brusca o dolor torácico al respirar; debilidad, adormecimiento de un lado, habla o visión alterados de golpe (embolia pulmonar, ictus o AIT)', les: 'diagnosticado', pregunta: 'les_u_tep_ictus' },
    { texto: 'Dolor torácico punzante que empeora al inspirar y mejora inclinado hacia delante (pericarditis o pleuritis)', les: 'diagnosticado', pregunta: 'les_u_pecho' },
    { texto: 'Úlcera en la yema de un dedo, o dedo blanco o morado que no recupera el color (isquemia digital)', les: 'diagnosticado', pregunta: 'les_u_dedos' },
    { texto: 'Convulsión, confusión, mielitis, pie o mano caídos de golpe o pérdida de visión (afectación neurológica u ocular)', les: 'diagnosticado', pregunta: 'les_u_neuro' },
  ],
  banderasAmarillas: [
    { texto: 'Dolor profundo en carga de cadera, rodilla, hombro o tobillo con corticoides (osteonecrosis)', les: 'diagnosticado', pregunta: 'les_d_osteonecrosis' },
    { texto: 'Debilidad proximal nueva (miositis o miopatía por fármacos)', les: 'diagnosticado', pregunta: 'les_d_debilidad' },
    { texto: 'Articulaciones hinchadas, erupción, llagas en la boca o caída de pelo nuevas (brote)', les: 'diagnosticado', pregunta: 'les_d_brote' },
    { texto: 'Edemas o hipertensión nuevos, o proteínas o sangre en la orina (riñón)', les: 'diagnosticado', pregunta: 'les_d_rinon' },
  ],
  preguntas: [
    { id: 'les_u_fiebre', les: 'diagnosticado', urgencia: 'Fiebre o malestar general en el lupus: posible infección; valoración médica hoy.', alerta: true,
      text: '¿Tiene fiebre o escalofríos, o se encuentra mal en general de una forma nueva? (Con corticoides o inmunosupresores puede haber una infección sin fiebre.)',
      razonamiento: {
        porque: 'En el lupus el sistema inmune funciona mal y además se frena con los fármacos (corticoides, inmunosupresores, biológicos), así que las infecciones son más frecuentes y más graves; las más habituales son respiratorias, urinarias y de piel y partes blandas, y Staphylococcus aureus y Salmonella pueden dar artritis séptica u osteomielitis (Rao y Mikdashi 2023). Los corticoides frenan la liberación de citocinas y con ella la fiebre y la inflamación, así que la infección puede dar pocos signos (Yasir 2023).',
        peso: 'Las infecciones causan entre el 20 y el 55 % de las muertes en el lupus y son la primera causa en el primer año tras el diagnóstico (Rao y Mikdashi 2023). «La fiebre en el LES es infecciosa mientras no se demuestre lo contrario» (Rao y Mikdashi 2023), y los criterios de clasificación piden sospechar primero la infección ante cualquier fiebre (Aringer 2019). Un lupus conocido no explica la fiebre: también puede ser un brote o una trombosis (Bowers y Blum 2026).',
        detalle: 'Dosis: el riesgo de infección aumenta con la dosis de corticoides; por encima de 20 mg/día de prednisona es unas 10 veces mayor (Rao y Mikdashi 2023). La guía EULAR de infecciones da umbrales con duración para cada infección (por ejemplo, más de 15–30 mg/día durante más de 2–4 semanas para la profilaxis de la neumonía por Pneumocystis) y reconoce que no se sabe la dosis mínima (Fragoulis 2023, rec. 8, p. 747). La hidroxicloroquina no es inmunosupresora a estos efectos (Fragoulis 2023, p. 743).\n\nUna articulación roja, caliente e hinchada, con o sin fiebre, sigue siendo la urgencia de artritis séptica del cribado de la región.',
        fuentes: ['Rao y Mikdashi 2023', 'Yasir 2023', 'Aringer 2019', 'Bowers y Blum 2026', 'Fragoulis 2023'],
        citas: [`${LES_CITA.rao}, «The Burden of Infections in SLE», «Bacterial Infections», «Impact of Immune Therapy» y «Proposed Steps».`,
          spCita(LES_SP.yasir, '«Adverse Effects» (infecciones)'),
          `${LES_CITA.aringer}, discusión.`,
          spCita(LES_SP.bowers, '«Constitutional Symptoms»'),
          'Fragoulis 2023 — Fragoulis, Nikiphorou, Dey et al., «2022 EULAR recommendations for screening and prophylaxis of chronic and opportunistic infections in adults with autoimmune inflammatory rheumatic diseases», Ann Rheum Dis 2023;82(6):742–753, pp. 743 y 747.']
      } },
    { id: 'les_u_tvp', les: 'diagnosticado', urgencia: 'Posible TVP en un paciente con lupus: derivar hoy (riesgo de embolia pulmonar).', alerta: true,
      text: '¿Tiene una pantorrilla o una pierna (o un brazo) hinchada, caliente o dolorosa de forma nueva? (Posible TVP: calcular Wells; ≥2 → probable.)',
      razonamiento: {
        porque: 'Los anticuerpos antifosfolípido favorecen los coágulos en venas y arterias; la trombosis venosa más frecuente es la TVP de las piernas, que puede acabar en embolia pulmonar, y también hay trombosis en el brazo (Rout, síndrome antifosfolípido). Más del 10 % de los pacientes con lupus tiene alguna trombosis (Bowers y Blum 2026).',
        peso: 'El lupus suma riesgo de trombosis por sí mismo, aunque los anticuerpos no se conozcan (Tektonidou 2019, principio 1), y muchos pacientes no saben si los tienen: por eso la pregunta sale con cualquier respuesta de la tarjeta. Con signos de TVP, NICE calcula la escala de Wells y, con 2 puntos o más, pide una ecografía en 4 horas (NICE NG158); ningún signo aislado la confirma ni la descarta (Waheed).',
        detalle: 'La inmovilización prolongada, la cirugía y la hospitalización son situaciones de alto riesgo en las que se usa heparina preventiva (Tektonidou 2019, principio 2). Fuera del posquirúrgico, cuatro regiones (cervical, lumbar, hombro y codo) no tienen otra pregunta de TVP.',
        fuentes: ['Tektonidou 2019', 'NICE NG158', 'Waheed 2023', 'Rout 2024 (síndrome antifosfolípido)', 'Bowers y Blum 2026'],
        citas: [`${LES_CITA.tektonidou}, principios generales 1 y 2.`, `${LES_CITA.nice}.`, spCita(LES_SP.waheed, '«History and Physical»'),
          spCita(LES_SP.rout, '«Introduction» y «Vascular Thrombosis»'), spCita(LES_SP.bowers, '«Hematologic and Reticuloendothelial»')]
      } },
    { id: 'les_u_tep_ictus', les: 'diagnosticado', urgencia: 'Posible embolia pulmonar, ictus o accidente isquémico transitorio: llamar al 112.', alerta: true,
      text: '¿Le ha faltado el aire de repente o le duele el pecho al respirar? ¿O ha tenido de golpe debilidad o adormecimiento de un lado, dificultad para hablar o pérdida de visión, aunque se le haya pasado?',
      razonamiento: {
        porque: 'Con anticuerpos antifosfolípido, la trombosis venosa más frecuente es la de las piernas, que puede llegar al pulmón (embolia pulmonar), y la arterial más frecuente es la del cerebro: accidente isquémico transitorio o ictus (Rout, síndrome antifosfolípido). En el lupus, además, la aterosclerosis se acelera (Bowers y Blum 2026).',
        peso: 'Un AIT o un ictus en una persona joven sin otros factores de riesgo debe hacer pensar en un síndrome antifosfolípido, y hay que enseñar al paciente los síntomas del AIT (Rout, síndrome antifosfolípido). La enfermedad cerebrovascular es de las manifestaciones neuropsiquiátricas más frecuentes del lupus (Goodman 2018, cap. 12, p. 445), y el ictus es el riesgo que menos recogen las escalas cardiovasculares generales en el lupus (Drosos 2022, p. 773). Un AIT que ya ha pasado también es una urgencia.',
        fuentes: ['Rout 2024 (síndrome antifosfolípido)', 'Bowers y Blum 2026', 'Goodman 2018', 'Drosos 2022'],
        citas: [spCita(LES_SP.rout, '«Introduction», «Vascular Thrombosis» y «Deterrence and Patient Education»'), spCita(LES_SP.bowers, '«Complications»'),
          `${LES_CITA.goodman}, p. 445.`,
          'Drosos 2022 — Drosos, Vedder, Houben et al., «EULAR recommendations for cardiovascular risk management in rheumatic and musculoskeletal diseases, including systemic lupus erythematosus and antiphospholipid syndrome», Ann Rheum Dis 2022;81(6):768–779, p. 773.']
      } },
    { id: 'les_u_pecho', les: 'diagnosticado', urgencia: 'Posible pericarditis o pleuritis: valoración médica hoy (descartar infección o embolia).', alerta: true,
      text: '¿Tiene un dolor en el pecho punzante que empeora al respirar hondo y mejora inclinándose hacia delante?',
      razonamiento: {
        porque: 'La inflamación de la pleura o del pericardio (serositis) es frecuente en el lupus: da un dolor torácico punzante que empeora al inspirar y, el del pericardio, mejora al inclinarse hacia delante (Aringer 2019, tabla 1; Bowers y Blum 2026).',
        peso: 'Las guías tratan la serositis como enfermedad moderada, no como urgencia (Fanouriakis 2024, fig. 1; Sammaritano 2025, p. 20), y la pleuritis leve como actividad leve (Gordon 2018, tabla 7). La app es más prudente a propósito: la serositis exige un diagnóstico pronto que descarte la infección (Pisetsky 2021), y el fisioterapeuta no puede distinguirla de una embolia pulmonar o una infección con el mismo dolor.',
        fuentes: ['Aringer 2019', 'Bowers y Blum 2026', 'Pisetsky 2021', 'Fanouriakis 2024', 'Sammaritano 2025', 'Gordon 2018'],
        citas: [`${LES_CITA.aringer}, tabla 1 (pericarditis aguda).`, spCita(LES_SP.bowers, '«Pulmonary» y «Cardiovascular»'), `${LES_CITA.pisetsky}, «Serositis».`,
          `${LES_CITA.fanouriakis}, fig. 1 (p. 22).`, `${LES_CITA.sammaritano}, p. 20.`, `${LES_CITA.gordon}, tabla 7 (p. e13).`]
      } },
    { id: 'les_u_dedos', les: 'diagnosticado', urgencia: 'Posible isquemia digital: atención médica hoy, para evitar la gangrena.', alerta: true,
      text: '¿Tiene en algún dedo de la mano o del pie una herida o úlcera en la yema, o un dedo que se queda blanco o morado y no recupera el color?',
      razonamiento: {
        porque: 'En el lupus el Raynaud es secundario y tiene más riesgo de isquemia: en los ataques graves aparecen úlceras en las yemas de los dedos, y en los casos graves gangrena o pérdida del dedo (Deeb y Maher). Con anticuerpos antifosfolípido también hay isquemia digital y gangrena por trombosis (Rout, síndrome antifosfolípido).',
        peso: 'Con úlceras, el paciente debe buscar atención médica cuanto antes para evitar la gangrena, y la isquemia digital grave se trata en el hospital (Deeb y Maher). Un Raynaud que se recupera con el calor no es esta urgencia: es la pregunta del cribado de codo y la fila de la tarjeta.',
        fuentes: ['Deeb y Maher 2026 (Raynaud)', 'Rout 2024 (síndrome antifosfolípido)'],
        citas: [spCita(LES_SP.deeb, '«Complications», «Treatment of Severe Digital Ischemia» y «Enhancing Healthcare Team Outcomes»'), spCita(LES_SP.rout, '«History and Physical» y «Catastrophic APS»')]
      } },
    { id: 'les_u_neuro', les: 'diagnosticado', urgencia: 'Posible afectación neurológica u ocular del lupus: urgencias hoy.', alerta: true,
      text: '¿Ha tenido una convulsión o confusión nueva; debilidad u hormigueo en las dos piernas que va a más, con cambios al orinar; de golpe, el pie o la mano caídos; o pérdida de visión?',
      razonamiento: {
        porque: 'El lupus puede afectar al sistema nervioso: convulsiones, estado confusional agudo, mielitis transversa (debilidad y hormigueo en las piernas con cambios al orinar), mononeuritis múltiple (un pie o una mano caídos de golpe por un nervio inflamado) y neuritis óptica (Bowers y Blum 2026; Sammaritano 2025).',
        peso: 'Son manifestaciones graves, que amenazan un órgano: la mielopatía, la confusión aguda y la neuritis óptica son brote grave (Gordon 2018, tabla 7), y la ACR trata la neuritis óptica, el estado confusional agudo y la mononeuritis múltiple con dosis altas o pulsos de corticoides e inmunosupresores (Sammaritano 2025). Ante somnolencia, cambios cognitivos u otros signos neurológicos se pide un estudio urgente (Bowers y Blum 2026). Goodman pide preguntar por problemas de visión recientes (Goodman 2018, cap. 12, p. 457).',
        fuentes: ['Bowers y Blum 2026', 'Sammaritano 2025', 'Gordon 2018', 'Goodman 2018'],
        citas: [spCita(LES_SP.bowers, '«Neuropsychiatric Manifestations» y «Evaluation»'), `${LES_CITA.sammaritano}, pp. 6 y 18.`, `${LES_CITA.gordon}, tabla 7 (p. e13).`, `${LES_CITA.goodman}, p. 457.`]
      } },
    { id: 'les_d_osteonecrosis', les: 'diagnosticado', derivacion: 'Posible osteonecrosis (corticoides o lupus): valoración médica; la radiografía puede ser normal al principio y la prueba es la RM.', alerta: true,
      text: '¿Tiene un dolor profundo y persistente en la ingle, la rodilla, el hombro o el tobillo, que empeora al cargar o al andar y no se explica por un golpe?',
      razonamiento: {
        porque: 'Los corticoides a dosis altas pueden matar el hueso bajo el cartílago (osteonecrosis), sobre todo en la cabeza del fémur; en el lupus aparece también en la rodilla, el hombro y el tobillo, y a veces en varios sitios a la vez (Kaneko 2021; Matthews 2023). Puede ocurrir incluso sin corticoides (Barney 2023).',
        peso: 'El primer síntoma es un dolor óseo persistente que limita el movimiento y empeora con la carga y la actividad (Kaneko 2021). Al principio la exploración suele ser normal y la radiografía también, así que la prueba es la RM (Matthews 2023). El riesgo crece con las dosis altas (más de 20 mg/día mantenidos, Yasir 2023; más de 40 mg/día, Kaneko 2021), y las lesiones pueden aparecer en los 5 primeros meses de dosis altas (Kaneko 2021). Los pulsos de metilprednisolona en vena no se han relacionado con la osteonecrosis (Fanouriakis 2024, p. 18).',
        detalle: 'En la cadera, el dolor suele ir a la ingle o al muslo, empeora al andar y subir escaleras y puede seguir en reposo (Barney 2023). No conviene infiltrar con corticoides una cadera con osteonecrosis (Barney 2023). En la cadera ya hay una pregunta parecida (ca_os2); esta cubre también las otras articulaciones.',
        fuentes: ['Kaneko 2021', 'Matthews 2023', 'Barney 2023', 'Yasir 2023', 'Fanouriakis 2024'],
        citas: [`${LES_CITA.kaneko}, «Risk factors for the development of ON in patients with SLE», «Pain» y «Musculoskeletal manifestations of SLE».`, spCita(LES_SP.matthews, '«History and Physical» y «Evaluation»'),
          spCita(LES_SP.barney, '«Etiology», «History and Physical» y «Treatment / Management»'), spCita(LES_SP.yasir, '«Adverse Effects» (musculoesqueléticos)'), `${LES_CITA.fanouriakis}, p. 18.`]
      } },
    { id: 'les_d_debilidad', les: 'diagnosticado', derivacion: 'Debilidad proximal nueva: valoración médica preferente, antes de la próxima sesión (miositis del lupus o miopatía por fármacos).', alerta: true,
      text: '¿Le cuesta cada vez más levantarse de una silla, subir escaleras o levantar los brazos por encima de la cabeza?',
      razonamiento: {
        porque: 'Quien tiene problemas para levantar los brazos por encima de la cabeza, subir escaleras o levantarse de una silla baja puede tener una enfermedad del músculo (Goodman 2018, cap. 12, p. 429). En el lupus puede ser una miositis, en menos del 10 % (Bowers y Blum 2026), o una miopatía por corticoides, indolora y sobre todo de la cintura de la cadera (Yasir 2023).',
        peso: 'La miositis es un brote grave (Gordon 2018, tabla 7), por eso la derivación es preferente. Otras causas que hay que separar: la miopatía por estatinas o por hidroxicloroquina, el hipotiroidismo, presente en el 7 % (Gordon 2018, pp. e14 y e17), y la retirada de los corticoides, que puede imitar síntomas del lupus (Sammaritano 2025, p. 11).',
        fuentes: ['Goodman 2018', 'Bowers y Blum 2026', 'Yasir 2023', 'Gordon 2018', 'Sammaritano 2025'],
        citas: [`${LES_CITA.goodman}, p. 429.`, spCita(LES_SP.bowers, '«Musculoskeletal Manifestations»'), spCita(LES_SP.yasir, '«Adverse Effects» (miopatía)'),
          `${LES_CITA.gordon}, tabla 7 (p. e13) y pp. e14 y e17.`, `${LES_CITA.sammaritano}, p. 11 y tabla 4.`]
      } },
    { id: 'les_d_brote', les: 'diagnosticado', derivacion: 'Posibles signos de brote: avisar a su reumatólogo antes de la próxima sesión.', alerta: true,
      text: 'Desde la última vez que le vio su reumatólogo, ¿tiene articulaciones hinchadas nuevas, una erupción, llagas en la boca o más caída de pelo?',
      razonamiento: {
        porque: 'Un brote es un aumento medible de la actividad, con signos o síntomas nuevos o peores, que el clínico considera significativo y que suele llevar a cambiar o aumentar el tratamiento (Ruperto 2011). La mayoría son leves o moderados, con artritis, erupción, úlceras de mucosas o fiebre (Thanou 2021, tabla 2).',
        peso: 'Los brotes moderados tienen que reconocerse a tiempo para tratarlos (Ruperto 2011): por eso se avisa al reumatólogo, sin urgencia. Lo juzga el clínico: un empeoramiento que nota el paciente no es por sí mismo un brote, porque la infección, los fármacos y la fibromialgia lo imitan (Thanou 2021), y la retirada de los corticoides también (Sammaritano 2025, p. 11). Con fiebre, la pregunta es la de la infección.',
        detalle: 'Lo que desencadena un brote: el sol, una infección reciente, los cambios hormonales o un cambio o retirada del tratamiento (Gordon 2018, p. e11).',
        fuentes: ['Ruperto 2011', 'Thanou 2021', 'Sammaritano 2025', 'Gordon 2018'],
        citas: [`${LES_CITA.ruperto}, definición final y enunciados Q5 y Q9 (pp. 456–457).`, `${LES_CITA.thanou}, «Definition, prevalence, and burden of clinical disease flare in SLE» y tabla 2.`,
          `${LES_CITA.sammaritano}, p. 11.`, `${LES_CITA.gordon}, p. e11.`]
      } },
    { id: 'les_d_rinon', les: 'diagnosticado', derivacion: 'Posible afectación del riñón: valoración médica pronto, sin esperar a la próxima revisión.', alerta: true,
      text: '¿Se le hinchan las piernas o los tobillos de forma nueva, le han dicho que tiene la tensión alta desde hace poco, o en un análisis que tiene proteínas o sangre en la orina?',
      razonamiento: {
        porque: 'La nefritis lúpica afecta a cerca de la mitad de los pacientes con lupus; la hipertensión nueva, la sangre o las proteínas en la orina y los edemas de las piernas deben hacer sospecharla (Bowers y Blum 2026).',
        peso: 'El riñón puede no dar síntomas, así que un «no» no la descarta (Gordon 2018, p. e8). La EULAR insiste en vigilar la afectación renal nueva, porque retrasar su diagnóstico empeora mucho el pronóstico (Fanouriakis 2024, p. 18). Goodman pide derivación inmediata ante un análisis de orina con proteínas, sangre o cilindros cuando se sospecha un lupus (Goodman 2018, cap. 12, p. 441); en quien ya tiene el diagnóstico y está en seguimiento, la app la deja como derivación sin esperar a la revisión.',
        fuentes: ['Bowers y Blum 2026', 'Gordon 2018', 'Fanouriakis 2024', 'Goodman 2018'],
        citas: [spCita(LES_SP.bowers, '«Renal»'), `${LES_CITA.gordon}, p. e8.`, `${LES_CITA.fanouriakis}, p. 18.`, `${LES_CITA.goodman}, p. 441.`]
      } },
  ],
  // Rasgos de la sospecha, textos y fuentes de la condición. Las citas de estos
  // textos cuentan en docs/referencias.md como menciones del cribado.
  lupus: {
    rasgos: [
      { id: 'lr1', texto: '¿Tiene dolor e hinchazón, o dolor con rigidez por la mañana de 30 minutos o más, en 2 o más articulaciones (sobre todo manos, muñecas o rodillas)?' },
      { id: 'lr2', texto: '¿Le sale una erupción en la cara (mejillas y nariz) o en zonas expuestas, que empeora con el sol?' },
      { id: 'lr3', texto: '¿Tiene llagas en la boca o la nariz que vuelven, o se le cae el pelo más de lo normal?' },
      { id: 'lr4', texto: '¿Ha tenido dolor en el pecho al respirar hondo sin causa conocida?' },
      { id: 'lr5', texto: '¿Ha tenido fiebre de más de 38,3 °C sin una infección que la explique?' },
      { id: 'lr6', texto: '¿Empezó todo esto semanas o meses después de un fármaco nuevo (por ejemplo, para el acné, la tensión o un biológico)?', diferencial: true },
    ],
    rasgosFuente: 'Rasgos de los criterios de clasificación EULAR/ACR de 2019: afectación articular (6 puntos: sinovitis en 2 o más articulaciones, o dolor en 2 o más con rigidez matutina de 30 min o más), lupus cutáneo, úlceras orales, alopecia, serositis y fiebre de más de 38,3 °C (Aringer 2019, tabla 1). Son de clasificación, no de diagnóstico: exigen anticuerpos antinucleares y analítica, y cada rasgo cuenta solo si nada lo explica mejor (Aringer 2019, discusión). La fatiga y la artralgia sin rigidez no son criterio: eran menos frecuentes en el lupus precoz que en sus imitadores (Aringer 2019). El diagnóstico es médico y se retrasa una mediana de 2 años (Fanouriakis 2024, p. 18).',
    diferencialFuente: 'Un «sí» en la última no suma: orienta a un lupus inducido por fármacos (anti-TNF, minociclina, hidralazina…), que suele mejorar al retirarlo (Saliba 2026).',
    textos: {
      derivar: 'Rasgos que pueden corresponder a una enfermedad inflamatoria sistémica: derivación preferente a su médico de atención primaria. El diagnóstico es médico y necesita analítica (Aringer 2019).',
      farmaco: 'Si empezó tras un fármaco nuevo, comentarlo con quien lo recetó (Saliba 2026).',
      sinRasgos: 'Sin rasgos de la lista: la sospecha queda en tu juicio clínico.',
      naturaleza: 'Lupus: la artritis da hinchazón y rigidez por la mañana de 30 min o más, sobre todo en manos, muñecas y rodillas, y duele y limita igual en activo que en pasivo (Goodman 2018, cap. 12, p. 456). El dolor generalizado a la palpación sin tumefacción orienta a fibromialgia, que acompaña al lupus en el 20–30 %; el diagnóstico es médico (Goodman 2018, cap. 12, p. 444). La fatiga aparece también con el lupus inactivo, así que sola no mide la actividad; si es nueva o empeora, que la valore su reumatólogo (Dures 2024, rec. 4).',
      brote3: 'Lupus en brote o peor sin valorar: los ensayos de ejercicio solo incluyeron lupus estable (Frade 2023); que su reumatólogo revalore las contraindicaciones antes de seguir (Blaess 2024, rec. 4).',
      tecnica4b: 'Lupus: con corticoides, el hueso es más frágil y la piel más fina; antes de ejercicios resistidos o movilizaciones, ten en cuenta la densidad ósea (Yasir 2023; Goodman 2018, cap. 12, p. 445). Un dolor profundo en carga de cadera, rodilla, hombro o tobillo puede ser una osteonecrosis aunque la exploración y la radiografía sean normales (Matthews 2023).',
      ejercicio: 'Con el lupus inactivo o leve, llegar poco a poco a 150–300 min por semana de intensidad moderada (esfuerzo 5–6 sobre 10) y fuerza al menos 2 días (Blaess 2024, rec. 9). Sesiones con aeróbico y fuerza, 3–5 por semana (Blaess 2024, rec. 14); fuerza en 1–3 series de 8–12 repeticiones con 1–3 min de descanso (Blaess 2024, rec. 15); aeróbico de 20–30 min hasta 50, en tramos de 4 semanas (Blaess 2024, rec. 12); con calentamiento y vuelta a la calma (Blaess 2024, rec. 13). Supervisado por un fisioterapeuta (Blaess 2024, rec. 11). Puede reducir algo la fatiga, y la actividad del lupus probablemente no cambia (Frade 2023).',
      antesEmpezar: 'Antes de empezar, su médico valora si hay contraindicaciones; antes de ejercicio vigoroso, puede hacer falta un ECG o una prueba de esfuerzo (Blaess 2024, rec. 10).',
      especialista: 'Con osteonecrosis o artropatía de Jaccoud, que lo valore un especialista antes de empezar (Blaess 2024, rec. 1).',
      sol: 'Fotoprotección para prevenir brotes (Parodis 2024, rec. LES 2): protector solar de amplio espectro UVA y UVB, ropa que cubra, sombrero y gafas de sol, y evitar las horas de más sol (Gordon 2018, p. e16; Blaess 2024, rec. 2). Evitar el ejercicio al sol con un índice UV por encima de 3 (opinión de los autores de Frade 2023).',
      raynaud: 'Raynaud: al aire libre, guantes o ropa contra el frío; evitar tocar superficies frías y secar bien la piel durante y después del ejercicio (Blaess 2024, rec. 2). Por lo mismo, cuidado con el frío local en manos y pies (inferencia, sin fuente propia).',
      fiebre: 'Fiebre o malestar general nuevos: valoración médica hoy; con corticoides puede no haber fiebre (Rao y Mikdashi 2023; Yasir 2023).',
      brote: 'En brote, que su reumatólogo revalore las contraindicaciones antes de seguir (Blaess 2024, rec. 4); en un brote articular, no cargar las articulaciones inflamadas (Blaess 2024, rec. 5).',
      antifosfolipidos: 'Antifosfolípidos: la actividad física se recomienda también con anticoagulantes (Tektonidou 2019, principios generales). No sugerir suspender el anticoagulante: retirarlo desencadena el síndrome antifosfolípido catastrófico (Tektonidou 2019, rec. 12).',
      osteonecrosis: 'Riesgo de osteonecrosis: un dolor profundo en carga de cadera, rodilla, hombro o tobillo → valoración médica (Kaneko 2021; Matthews 2023).',
      tabaco: 'Si fuma, dejarlo (Parodis 2024, rec. común 3): el tabaco aumenta la actividad del lupus (Bowers y Blum 2026) y el riesgo cardiovascular (Drosos 2022, principio C).',
      medico: 'Los corticoides, los inmunosupresores y el anticoagulante los ajusta su reumatólogo (Drosos 2022, principio B).',
      hipermovilidad: 'Con lupus, el diagnóstico de SED hipermóvil exige los rasgos A y B, y el dolor crónico y la inestabilidad no cuentan (Malfait 2017, p. 19).',
    },
  },
};

// ─── Trastorno mastocitario o anafilaxia (Fase P, docs/mastocitaria.md) ───
// Capa transversal reducida: solo «Diagnosticado» (decisión 2), sin «Sospecha»
// ni regla automática con la hipermovilidad o el POTS (decisión 5). Lo que
// cambia la sesión es el riesgo de anafilaxia (Valent 2022, el paraguas de la
// CIE-10-MC). La fase 2 solo añade una derivación no urgente por episodios
// nuevos sin valorar (decisión 7); la anafilaxia es un suceso de la sesión y se
// trata en el recuadro de la fase 5 y la red de seguridad de la fase 6.
const MA_CITA = {
  valent: 'Valent 2022 — Valent, Hartmann, Bonadonna et al., «Global classification of mast cell activation disorders: an ICD-10-CM-adjusted proposal of the ECNM-AIM Consortium», J Allergy Clin Immunol Pract 2022;10(8):1941–1950',
  nice: 'NICE NG258 — NICE, «Anaphylaxis: assessment and referral after emergency treatment», guía NG258, 2026',
  rcuk: 'RCUK 2021 — Resuscitation Council UK, «Emergency treatment of anaphylaxis: guidelines for healthcare providers», mayo de 2021',
  cardona: 'Cardona 2020 — Cardona, Ansotegui, Ebisawa et al., «World Allergy Organization anaphylaxis guidance 2020», World Allergy Organ J 2020;13(10):100472',
  lee: 'Lee y Picard 2025 — Lee y Picard, «Diagnosis and management of mast cell activation syndrome (MCAS) in Canada: a practical approach», Allergy Asthma Clin Immunol 2025;21:49',
};

export const SIS_MASTOCITOS = {
  id: 'transversal_mastocitos', icon: '💉', nombre: 'Trastorno mastocitario o anafilaxia', soloMastocitos: true,
  banderasRojas: [],
  banderasAmarillas: [
    { texto: 'Episodios bruscos nuevos o más graves (ronchas, hinchazón, falta de aire, mareo o desmayo) que su médico aún no conoce', pregunta: 'ma_d_episodios' },
  ],
  preguntas: [
    { id: 'ma_d_episodios', derivacion: 'Episodios nuevos o más graves sin valorar: que los valore su alergólogo o su médico, sin esperar a la próxima revisión.',
      text: 'Desde su última revisión médica, ¿ha tenido episodios bruscos con ronchas, hinchazón, falta de aire, mareo o desmayo que su médico aún no conoce?',
      razonamiento: {
        porque: 'Tras una anafilaxia, las guías piden que la valore un servicio especializado de alergia para buscar la causa, reducir el riesgo de otra y preparar al paciente para manejarla (NICE NG258, 1.1.12; RCUK 2021, 8.7; Cardona 2020). En los trastornos mastocitarios, el diagnóstico y la variante se deciden con la triptasa medida durante el episodio y la basal, que solo puede pedir el médico (Valent 2022, tabla I).',
        peso: 'No es una urgencia: si el episodio está ocurriendo ahora, es una anafilaxia y se trata en el momento (112 y su autoinyector). Esta pregunta busca los episodios pasados que nadie ha valorado: tras una anafilaxia, el riesgo de otra se ha estimado en 1 de cada 12 al año (RCUK 2021, 2.2). Un síntoma aislado de un solo órgano (solo ronchas, solo cansancio, solo dolor de cabeza) no basta para hablar de activación mastocitaria (Lee y Picard 2025, tabla 1).',
        fuentes: ['NICE NG258', 'RCUK 2021', 'Cardona 2020', 'Valent 2022', 'Lee y Picard 2025'],
        citas: [`${MA_CITA.nice}, recomendación 1.1.12.`, `${MA_CITA.rcuk}, apartados 2.2 y 8.7.`, `${MA_CITA.cardona}, resumen.`,
          `${MA_CITA.valent}, tabla I.`, `${MA_CITA.lee}, tabla 1.`]
      } },
  ],
  // Tipos, desencadenantes y textos de la condición. Las citas de estos textos
  // cuentan en docs/referencias.md como menciones del cribado.
  mastocitos: {
    // Diagnóstico concreto dentro del paraguas (decisiones 3 y 16). La
    // α-triptasemia hereditaria sola no tiene opción propia (decisión 12).
    tipos: {
      mastocitosis: 'Mastocitosis',
      sama: 'Síndrome de activación mastocitaria',
      otro: 'Otro trastorno mastocitario',
      soloAnafilaxia: 'Ninguno: solo ha tenido anafilaxia',
      ns: 'No lo sabe',
    },
    // Lo que ya le ha provocado episodios (decisión 8; docs/mastocitaria.md,
    // «Los desencadenantes que pone la sesión»).
    desencadenantes: [
      { id: 'ejercicio', texto: 'Ejercicio o esfuerzo' },
      { id: 'calor', texto: 'Calor' },
      { id: 'frio', texto: 'Frío' },
      { id: 'roce', texto: 'Roce o presión en la piel' },
      { id: 'vibracion', texto: 'Vibración' },
      { id: 'estres', texto: 'Estrés' },
      { id: 'aine', texto: 'Algún antiinflamatorio (AINE)' },
      { id: 'alimento', texto: 'Un alimento con el ejercicio' },
      { id: 'picaduras', texto: 'Picaduras' },
    ],
    textos: {
      nota: 'Márcala si un médico le ha diagnosticado un trastorno mastocitario o si ha tenido una anafilaxia. Pregunta qué le dijeron exactamente: «MCAD» puede significar cosas distintas según quién lo diagnostique. Los síntomas crónicos (cansancio, dolor, niebla mental) no bastan para sospecharlo (Lee y Picard 2025, tabla 1).',
      queHacer: 'Si en la sesión aparecen ronchas, hinchazón, falta de aire, mareo o un desmayo: para, quédate con él y llama al 112; que se ponga su autoinyector en la cara externa del muslo (si no puede, ayúdale a ponérselo si la normativa de tu país lo permite) y, si no mejora, a los 5 minutos el segundo. Tumbado (sentado si le cuesta respirar; de lado si pierde el conocimiento y respira) y sin levantarlo de golpe aunque mejore. Puede no haber ronchas (RCUK 2021, apartados 3.1, 4.4 y 5.1.1; Muraro 2022, recuadro 3; NICE NG258, 1.1.14).',
      desmayo: 'Un desmayo vasovagal mejora enseguida al tumbarlo, con el pulso lento. Si no se recupera rápido tumbado, o tiene el pulso rápido, ronchas o le cuesta respirar, trátalo como una anafilaxia (RCUK 2021, tabla 3).',
      despues: 'Tras una anafilaxia, aunque se recupere, lo tiene que ver un médico: puede repetirse en las horas siguientes sin nueva exposición (NICE NG258; RCUK 2021, 8.2).',
      riesgoAlto: 'Tiene más riesgo de anafilaxia que la población general (Valent 2022, tabla II): que lleve su autoinyector siempre y lo traiga a cada sesión (NICE NG258, 1.1.16).',
      mastocitosis: 'En la mastocitosis, la anafilaxia suele empezar con calor brusco, palpitaciones, mareo y desmayo, a menudo sin ronchas (Gülen 2023; González-de-Olano 2017).',
      sinAutoinyector: 'Tras una anafilaxia, las guías indican llevar autoinyector (salvo si fue por un fármaco fácil de evitar), y también con una mastocitosis sistémica y cualquier reacción previa: que su médico lo valore (RCUK 2021, 8.6; Muraro 2022, recuadro 4).',
      desencadenantes: 'Evita en la sesión lo que ya le ha provocado episodios; no hace falta evitar una lista de todos los descritos (Brockow 2021).',
      protocolo: 'Ten un protocolo escrito de anafilaxia y ensáyalo con regularidad (Cardona 2020, fig. 4).',
      tecnica4b: 'Trastorno mastocitario: el roce, la presión mantenida, el calor, el frío y la vibración pueden desencadenar síntomas; haz las maniobras con suavidad y evita lo que ya le ha provocado episodios (Brockow 2021; Muñoz 2024).',
      // Forma 1 (decisión 1): solo texto en la hipermovilidad y el POTS, sin regla.
      asociacion: 'Se ha descrito que algunas personas con hipermovilidad o POTS tienen también un síndrome de activación mastocitaria, pero la asociación no se ha demostrado en pacientes que cumplan con claridad los criterios de consenso (Lee y Picard 2025), y en 587 pacientes con esas etiquetas solo se confirmó en 1 (Valdez 2026). Un síndrome de activación mastocitaria se presenta como episodios bruscos y graves en dos o más sistemas a la vez, no como cansancio o dolor crónicos (Valent 2022, tabla I). Si los ha tenido, mira la tarjeta «Trastorno mastocitario o anafilaxia».',
    },
  },
};

// ─── Osteoporosis o fragilidad ósea (Fase P, docs/osteoporosis.md) ──────────
// Tarjeta con «Diagnosticada» y «Sospecha» (decisión 2). Sin regla automática
// con otras tarjetas (decisión 9). Cada pregunta lleva `op` cuando no sale
// siempre: 'sinFractura' (no consta ya una fractura vertebral) o
// 'antirresortivo' (con bifosfonato o denosumab). Los factores de la sospecha
// y las caídas no son preguntas de cribado (un «sí» no es una bandera): van en
// `osteoporosis` y se guardan en state.osteoporosis (lib/osteoporosis.js).
const OP_CITA = {
  gregson: 'Gregson 2025 — Gregson, Armstrong, Avgerinou et al., «The 2024 UK clinical guideline for the prevention and treatment of osteoporosis», Arch Osteoporos 2025;20(1):119',
  kanis: 'Kanis 2019 — Kanis, Cooper, Rizzoli y Reginster (ESCEO e IOF), «European guidance for the diagnosis and management of osteoporosis in postmenopausal women», Osteoporos Int 2019;30(1):3–44',
  laurent: 'Laurent 2022 — Laurent, Goemaere, Verroken et al., «Prevention and treatment of glucocorticoid-induced osteoporosis in adults: consensus recommendations from the Belgian Bone Club», Front Endocrinol 2022;13:908727',
  finucane: 'Finucane 2020 — Finucane, Downie, Mercer et al., «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, 2020',
  downie: 'Downie 2013 — Downie, Williams, Henschke et al., «Red flags to screen for malignancy and fracture in patients with low back pain: systematic review», BMJ 2013;347:f7095',
  maitland: 'Maitland 2005 — Maitland; Hengeveld, Banks y English (eds.), «Maitland’s Vertebral Manipulation», 7.ª ed., Elsevier Butterworth-Heinemann, 2005',
  giangregorio15: 'Giangregorio 2015 — Giangregorio, McGill, Wark et al., «Too Fit To Fracture: outcomes of a Delphi consensus process on physical activity and exercise recommendations for adults with osteoporosis with or without vertebral fractures», Osteoporos Int 2015;26(3):891–910',
};

export const SIS_OSTEOPOROSIS = {
  id: 'transversal_osteoporosis', icon: '🦴', nombre: 'Osteoporosis', soloOsteoporosis: true,
  banderasRojas: [
    { texto: 'Dolor de espalda nuevo con debilidad, hormigueo o torpeza en las piernas, o cambios al orinar o al hacer de vientre (compresión de la médula o las raíces por una fractura vertebral)', pregunta: 'op_u_medula' },
  ],
  banderasAmarillas: [
    { texto: 'Dolor de espalda brusco, sobre todo dorsal, tras un esfuerzo pequeño (posible fractura vertebral nueva)', pregunta: 'op_d_fractura' },
    { texto: 'Pérdida de 4 cm o más de altura, o espalda cada vez más curvada (posible fractura vertebral sin diagnosticar)', op: 'sinFractura', pregunta: 'op_d_talla' },
    { texto: 'Dolor de muslo, ingle o cadera sin explicación con bifosfonato o denosumab (posible fractura atípica de fémur)', op: 'antirresortivo', pregunta: 'op_d_femur' },
  ],
  preguntas: [
    { id: 'op_u_medula', urgencia: 'Posible compresión de la médula o de las raíces por una fractura vertebral: urgencias hoy.', alerta: true,
      text: '¿Tiene un dolor de espalda nuevo con debilidad, hormigueo o torpeza en las piernas que va a más, o cambios al orinar o al hacer de vientre?',
      razonamiento: {
        porque: 'Una vértebra que se aplasta puede empujar hueso hacia el canal y comprimir la médula o las raíces, sobre todo si el fragmento se desplaza hacia atrás; por eso, con una fractura vertebral, hay que vigilar los síntomas de compresión medular (Laurent 2022).',
        peso: 'Si una fractura vertebral se acompaña de un déficit neurológico, o de signos de que va a aparecer, la guía británica pide derivar con urgencia a cirugía de columna (Gregson 2025). La mayoría de las fracturas vertebrales no dan síntomas neurológicos, pero hay que preguntarlos y explorarlos (Finucane 2020, sección 3).',
        detalle: 'En lumbar, la pregunta de la cola de caballo (l6) pregunta algo parecido desde otro motivo; las dos se mantienen.',
        fuentes: ['Gregson 2025', 'Laurent 2022', 'Finucane 2020'],
        citas: [`${OP_CITA.gregson}, «Management of symptomatic osteoporotic vertebral fractures».`, `${OP_CITA.laurent}, apartado 3.2.`, `${OP_CITA.finucane}, sección 3 (fractura), tabla 3.2.`]
      } },
    { id: 'op_d_fractura', derivacion: 'Posible fractura vertebral nueva: valoración médica pronto (radiografía). Hasta entonces, sin terapia manual ni ejercicios con carga sobre esa zona.', alerta: true,
      text: '¿Le empezó de golpe un dolor de espalda, sobre todo en la zona dorsal, tras un esfuerzo pequeño (levantar algo agachado, toser, estornudar, resbalar), y no se le ha ido?',
      razonamiento: {
        porque: 'En el hueso osteoporótico, una carga normal basta para aplastar una vértebra: la persona suele notar un dolor brusco en la zona toracolumbar tras resbalar, tropezar, levantar algo desde la flexión o toser (Finucane 2020, sección 3). La mayoría de las fracturas vertebrales son torácicas (Finucane 2020, sección 3).',
        peso: 'La guía británica pide pensar siempre en una fractura vertebral ante un dolor de espalda de comienzo agudo, sobre todo torácico, en mayores de 50 con factores de riesgo de osteoporosis (Gregson 2025, recomendación fuerte). La mayoría pasan sin diagnosticar (Gregson 2025; Kanis 2019). Una bandera sola informa poco y no conviene actuar por ella (Downie 2013; Finucane 2020); por eso la pregunta junta el dolor con la osteoporosis conocida o sospechada. Ante la sospecha, la primera prueba es la radiografía (Finucane 2020, tabla 3.4).',
        detalle: 'Hasta que la valore el médico: en la fractura vertebral, la terapia manual está contraindicada (Downie 2013, introducción), y sin manipulación forzada con osteoporosis (Maitland 2005, cap. 9, p. 223).\n\nAl estudiar a quien parecía tener una osteoporosis primaria aparecen a veces otras causas, entre ellas una mastocitosis sistémica (Kanis 2019, «Diagnostic work up»).',
        fuentes: ['Gregson 2025', 'Finucane 2020', 'Downie 2013', 'Kanis 2019', 'Maitland 2005'],
        citas: [`${OP_CITA.gregson}, «Models of care for fracture prevention» (recomendación) y «Vertebral fracture assessment».`, `${OP_CITA.finucane}, sección 3 (fractura), tablas 3.1–3.4.`,
          `${OP_CITA.downie}, introducción y discusión.`, `${OP_CITA.kanis}, «Vertebral fracture assessment» y «Diagnostic work up».`, `${OP_CITA.maitland}, cap. 9, p. 223.`]
      } },
    { id: 'op_d_talla', op: 'sinFractura', derivacion: 'Posible fractura vertebral sin diagnosticar: que su médico valore buscarla (radiografía o DXA lateral de la columna).', alerta: true,
      text: '¿Ha perdido 4 cm o más de altura respecto a cuando era joven (o 2 cm desde la última vez que se la midieron), o se le ha curvado más la espalda?',
      razonamiento: {
        porque: 'Cada vértebra que se aplasta resta altura y curva la espalda hacia delante; muchas fracturas vertebrales no dan dolor y solo se notan así (Gregson 2025).',
        peso: 'La guía británica indica buscar fracturas vertebrales con una pérdida de 4 cm o más, una cifosis torácica o corticoides orales prolongados (Gregson 2025, recomendación fuerte); la europea, igual (Kanis 2019). El consenso belga añade 2 cm desde una medida anterior (Laurent 2022). Una fractura vertebral, aunque no duela, dobla el riesgo de otra fractura (Gregson 2025).',
        detalle: 'Los umbrales no coinciden entre fuentes: 4 cm frente a la talla de joven (Gregson 2025; Kanis 2019), 2 cm desde una medida anterior (Laurent 2022) y, en un consenso Delphi, 6 cm recordados o 2 cm medidos (Giangregorio 2015). La app usa los dos primeros, que son compatibles.',
        fuentes: ['Gregson 2025', 'Kanis 2019', 'Laurent 2022', 'Giangregorio 2015'],
        citas: [`${OP_CITA.gregson}, «Screening and case finding» y recomendaciones de «Fracture risk assessment and case finding».`, `${OP_CITA.kanis}, «Vertebral fracture assessment».`,
          `${OP_CITA.laurent}, apartado 3.7.`, `${OP_CITA.giangregorio15}, recuadro 2.`]
      } },
    { id: 'op_d_femur', op: 'antirresortivo', derivacion: 'Con bifosfonato o denosumab, puede anunciar una fractura atípica de fémur: valoración médica pronto (imagen del fémur); sin impacto ni carga de esa pierna hasta entonces.', alerta: true,
      text: '¿Tiene un dolor de muslo, ingle o cadera sin explicación?',
      razonamiento: {
        porque: 'Con los fármacos que frenan la reabsorción del hueso (bifosfonatos, denosumab) puede aparecer, rara vez, una fractura atípica del fémur, a menudo en los dos lados; antes de romperse da un dolor en el muslo, la ingle o la cadera durante días, semanas o meses (Gregson 2025).',
        peso: 'La guía británica pide avisar al paciente de que comunique cualquier dolor de muslo, ingle o cadera sin explicación y, si aparece, hacer una prueba de imagen del fémur (recomendación fuerte), restringiendo la carga (Gregson 2025).',
        fuentes: ['Gregson 2025'],
        citas: [`${OP_CITA.gregson}, «Rare adverse effects», recomendación 12.`]
      } },
  ],
  // Filas de la tarjeta, factores de la sospecha, caídas y textos. Las citas de
  // estos textos cuentan en docs/referencias.md como menciones del cribado.
  osteoporosis: {
    causas: { edad: 'Posmenopáusica o por la edad', corticoides: 'Por corticoides', plo: 'Asociada al embarazo o la lactancia', otra: 'Otra causa', ns: 'No lo sabe' },
    vertebrales: { 0: 'Ninguna conocida', 1: '1', 2: '2 o más', ns: 'No lo sabe' },
    tratamientos: { no: 'Ninguno', antirresortivo: 'Bifosfonato o denosumab', otro: 'Otro (teriparatida…)', ns: 'No lo sabe' },
    corticoides: { no: 'No', b: 'Menos de 7,5 mg/día', a: '7,5 mg/día o más', ns: 'No lo sabe' },
    // Sospecha (decisión 3): factores de las tablas de las guías que, a partir
    // de los 50 años, piden valorar el riesgo de fractura. La selección es propia.
    factores: [
      { id: 'of1', texto: '¿Se ha roto algún hueso desde los 50 años con un golpe pequeño o sin golpe (una caída desde su altura o menos)?' },
      { id: 'of2', texto: '¿Toma corticoides por boca desde hace 3 meses o más?' },
      { id: 'of3', texto: '¿Su padre o su madre se rompió la cadera?' },
      { id: 'of4', texto: '¿Tuvo la menopausia antes de los 45 años?' },
      { id: 'of5', texto: '¿Tiene artritis reumatoide, lupus u otra enfermedad inflamatoria?' },
      { id: 'of6', texto: '¿Se ha caído dos veces o más en el último año?' },
    ],
    factoresFuente: 'Factores de riesgo de fractura de las guías: fractura por fragilidad previa, corticoides orales, fractura de cadera en un progenitor, menopausia precoz, artritis reumatoide y otras enfermedades inflamatorias (con el lupus) y caídas repetidas (Gregson 2025, «Fracture risk assessment tools» y tablas 1 y 3; Kanis 2019, tabla 4). La lista es una selección: la app no calcula el FRAX, que pide el médico (Gregson 2025).',
    // Caídas (decisión 8): las preguntas comunes de NICE NG249 y la guía mundial.
    caidas: {
      n: { 0: 'No', 1: '1 vez', 2: '2 o más' },
      casillas: [
        { id: 'lesion', texto: 'Se lesionó y necesitó tratamiento médico' },
        { id: 'suelo', texto: 'No pudo levantarse solo' },
        { id: 'conciencia', texto: 'Perdió el conocimiento' },
        { id: 'fragilidad', texto: 'Vive con fragilidad' },
      ],
      fuente: 'Preguntas de NICE NG249 (1.1.2–1.1.6), sin puntuar: la guía pide no usar herramientas que predigan el riesgo de caídas (NICE NG249, 1.1.1).',
      sincope: 'Perdió el conocimiento: contesta también la pregunta del síncope de la región.',
    },
    textos: {
      nota: 'Márcala si le han diagnosticado una osteoporosis o se ha roto un hueso con un golpe pequeño o sin golpe (una caída desde su altura o menos; Gregson 2025). «Sospecha»: 50 años o más con algún factor de riesgo de fractura.',
      // Sospecha (fase 2)
      sospechaDerivar: 'Que su médico valore el riesgo de fractura (FRAX y, si procede, densitometría) (Gregson 2025).',
      sospechaJoven: 'Fractura por fragilidad antes de los 50: valoración médica para buscar la causa (Gregson 2025, introducción).',
      sospechaSinFactores: 'Sin factores de la lista: la sospecha queda en tu juicio clínico.',
      sospechaSinEdad: 'Anota la edad en la fase 1 para interpretar la sospecha: la regla de las guías es a partir de los 50 años.',
      // Caídas (fase 2 y fase 5)
      caidasAlto: 'Riesgo alto de caídas: valoración integral de caídas (NICE NG249, 1.1.3; Montero-Odasso 2022).',
      caidasUna: 'Una caída, sin lesión, sin quedarse en el suelo, sin pérdida de conocimiento y sin fragilidad: valora la marcha y el equilibrio; si están alterados, programa de ejercicio de caídas y revisión de los riesgos del hogar (NICE NG249, 1.1.4–1.1.5). La velocidad de marcha por debajo de 0,8 m/s indica más riesgo (Montero-Odasso 2022).',
      caidasNo: 'Sin caídas: equilibrio a diario, 15–20 min (unas 2 h por semana; Giangregorio 2014).',
      caidasDosis: 'Ejercicio de caídas: equilibrio exigente y ejercicio funcional (levantarse de la silla, pasos), 3 o más sesiones por semana, progresado al menos 12 semanas (Montero-Odasso 2022), unas 3 h por semana durante al menos 4 meses (Brooke-Wavell 2022; Gregson 2025). El equilibrio y el ejercicio funcional reducen las caídas; caminar solo no ha demostrado reducirlas (Sherrington 2019).',
      // Fase 4b
      tecnica4b: 'Osteoporosis: este test carga el hueso, y no hay ningún signo que avise de que un hueso osteoporótico va a ceder (Maitland 2005, cap. 9, p. 223). Con una fractura vertebral reciente o sospechada en la zona, no lo hagas hasta que la valore el médico; si no, con fuerza progresiva y sin empujes bruscos.',
      tecnica4bCostilla: 'La presión sobre las costillas puede romper una costilla osteoporótica: con mucho cuidado (Maitland 2005, cap. 9, p. 223).',
      tecnica4bPorque: 'Un empuje posteroanterior fuerte en la columna torácica puede llegar a la carga con la que se rompe una vértebra torácica en el laboratorio, con datos de cadáver (Puentedura 2015). Son cifras de manipulación con thrust, no de estos tests: por eso la línea pide fuerza progresiva y no da un límite.',
      // Fase 5
      fuerza: 'Fuerza progresiva 2–3 días por semana, hasta el peso que levanta 8–12 veces, en 2 series y hasta 3, empezando suave con buena técnica y movimientos lentos y controlados; todos los grupos musculares, también la espalda, sin flexión con carga (Brooke-Wavell 2022, recuadro 1; Giangregorio 2014). Si el riesgo de fractura vertebral es alto, sin máquinas que obliguen a flexionar o girar el tronco (Giangregorio 2014).',
      impactoSin: 'Impacto moderado la mayoría de los días: unos 50 impactos por sesión (pisotones, trote, saltos bajos), sin caer desde altura (Brooke-Wavell 2022, consenso).',
      impactoCon: 'Con fractura vertebral o varias fracturas por fragilidad: impacto solo hasta caminar a paso ligero, 150 min por semana, por precaución, sin pruebas de que más sea peligroso; consulta con el fisioterapeuta al empezar (Brooke-Wavell 2022, consenso; Giangregorio 2014).',
      equilibrio: 'Equilibrio a diario, 15–20 min (unas 2 h por semana; Giangregorio 2014).',
      reciente: 'Tras una fractura vertebral dolorosa: extensores de espalda a diario, suaves, 3–5 repeticiones mantenidas 3–5 s; con dolor, empieza tumbado boca arriba (Brooke-Wavell 2022, recuadro 3; Gregson 2025). El ejercicio mejora algo la movilidad (certeza moderada); si mejora el dolor no se sabe (certeza muy baja), y los estudios se hicieron meses después de la fractura, no en la fase aguda (Gibbs 2019).',
      moverse: 'Espalda recta al agacharse y levantar (bisagra de cadera); modifica la flexión mantenida, repetida o al final del recorrido, sobre todo con carga; la torsión, suave y controlada, mejor girando con pasos; cuidado al pasar de tumbado a sentado o al darse la vuelta, y con peso en las manos; no levantar ni dejar cosas en el suelo, sino guardarlas a la altura de la cintura. Enseña cómo, no prohíbas (Brooke-Wavell 2022, recuadro 3; Giangregorio 2014; Giangregorio 2015).',
      tecnica: 'Sin manipulación forzada; la movilización suave puede ser adecuada (Maitland 2005, cap. 9, p. 223; Puentedura 2015, tabla 1).',
      seguridad: 'Un dolor de espalda brusco tras un esfuerzo pequeño puede ser una fractura vertebral nueva: valoración médica; con debilidad u hormigueo en las piernas, urgencias (Gregson 2025).',
      antirresortivo: 'Con bifosfonato o denosumab: si aparece un dolor de muslo, ingle o cadera sin explicación, imagen del fémur antes de cargar (Gregson 2025).',
      corticoides: 'Corticoides de 7,5 mg/día o más durante 3 meses o más sin tratamiento para el hueso: que su médico valore la protección ósea (Gregson 2025).',
      plo: 'Osteoporosis del embarazo o la lactancia: que se movilice pronto y sin reposo en cama; actividad en carga y de fuerza razonable, sin excesos, y sin cargar objetos pesados (Kovacs y Ralston 2015). Con las fracturas consolidadas, a los 3–6 meses, más carga y fuerza (Scioscia 2023). Fisioterapia cuando el dolor lo permita (Hadji 2026; Hardcastle 2022). Al coger y cargar al bebé, la misma bisagra de cadera (extrapolado de Brooke-Wavell 2022). Si las fracturas la limitan mucho, que tenga ayuda para cuidar del bebé (Hardcastle 2022). La lactancia, los fármacos y otro embarazo los decide con su médico.',
      ploRecurrencia: 'Tras una osteoporosis del embarazo o la lactancia pueden aparecer nuevas fracturas, más si hubo varias al principio; si hay más riesgo en otro embarazo no está claro: que lo hable con su médico (Hadji 2026; Anagnostis 2024; Kovacs y Ralston 2015; Hardcastle 2022).',
      // Panel de tiempos de tejido, «Este paciente» (decisión 10)
      tejidosNombre: 'fractura vertebral',
      tejidosPLO: 'El plazo es el de la fractura osteoporótica de la persona mayor; en la osteoporosis del embarazo o la lactancia el dolor puede durar mucho más: en una serie, más de 3 años en el 59 % (Gak 2024).',
      medico: 'Los fármacos, el calcio, la vitamina D y el corsé los indica el médico.',
      // Lupus (decisión 9): recordatorio en su recuadro de la fase 5, sin regla.
      lupus: 'Con corticoides mantenidos, pregunta por la osteoporosis y las fracturas por fragilidad; si las tiene, marca también la tarjeta «Osteoporosis o fragilidad ósea» (Gregson 2025; Laurent 2022).',
    },
  },
};

// ─── Embarazo y posparto (Fase P, docs/embarazo-posparto.md) ──────────────
// Sistema transversal de las 7 regiones, solo con la tarjeta «Embarazo o
// posparto» marcada (`soloEmbarazo`). Cada pregunta y bandera lleva `em`: los
// estados en que sale y, en semanas, desde o hasta cuándo (de gestación con
// «Embarazada», desde el parto con «Posparto»; lib/embarazo.js,
// elementoEMVisible). `privada`: su texto no va a `sq` (📄 Informe ni prompt);
// solo su urgencia (decisión 11). Fuentes leídas enteras en la sesión.
const EM_CITA = {
  ng133: 'NICE NG133 — National Institute for Health and Care Excellence, «Hypertension in pregnancy: diagnosis and management», NICE guideline NG133, 2019 (actualizada 2023)',
  ng201: 'NICE NG201 — National Institute for Health and Care Excellence, «Antenatal care», NICE guideline NG201, 2021',
  ng194: 'NICE NG194 — National Institute for Health and Care Excellence, «Postnatal care», NICE guideline NG194, 2021 (actualizada 2026)',
  ng255: 'NICE NG255 — National Institute for Health and Care Excellence, «Suspected sepsis in pregnant or recently pregnant people: recognition, diagnosis and early management», NICE guideline NG255, 2025',
  cg192: 'NICE CG192 — National Institute for Health and Care Excellence, «Antenatal and postnatal mental health: clinical management and service guidance», NICE guideline CG192, 2014 (actualizada 2020)',
  ng192: 'NICE NG192 — National Institute for Health and Care Excellence, «Caesarean birth», NICE guideline NG192, 2021',
  rcog: 'RCOG 2015 — Thomson y Greer, «Thromboembolic Disease in Pregnancy and the Puerperium: Acute Management», RCOG Green-top Guideline No. 37b, abril de 2015',
  hameed: 'Hameed 2023 — Hameed, Haddock, Wolfe et al., «Alliance for Innovation on Maternal Health: Consensus Bundle on Cardiac Conditions in Obstetric Care», Obstet Gynecol 2023;141(2):253–263',
  sambola: 'Sambola 2024 — Sambola, Halvorsen, Adlam et al., «Management of cardiac emergencies in women: a clinical consensus statement of the ESC», Eur Heart J Open 2024;4(2):oeae011',
  mottola: 'Mottola 2018 — Mottola, Davenport, Ruchat et al., «2019 Canadian guideline for physical activity throughout pregnancy», Br J Sports Med 2018;52(21):1339–1346',
  simonds: 'Simonds 2022 — Simonds, Abraham y Spitznagle, «Clinical Practice Guidelines for Pelvic Girdle Pain in the Postpartum Population», J Womens Health Phys Ther 2022;46(1):E1–E38',
  clinton: 'Clinton 2017 — Clinton, Newell, Downey y Ferreira, «Pelvic Girdle Pain in the Antepartum Population: Physical Therapy Clinical Practice Guidelines Linked to the ICF», J Womens Health Phys Ther 2017;41(2):102–125',
  hadji: 'Hadji 2026 — Hadji, Athanasiadis, Brandi et al., «Pregnancy- and lactation-associated osteoporosis: a position statement of the IAPM, IOF, ECTS, ESCEO, IMS, and EMAS», Int J Gynaecol Obstet 2026',
  scioscia: 'Scioscia 2023 — Scioscia y Zanchetta, «Recent insights into pregnancy and lactation-associated osteoporosis (PLO)», Int J Womens Health 2023;15:1227–1238',
  deering: 'Deering 2024 — Deering, Donnelly, Brockwell et al., «Clinical and exercise professional opinion on designing a postpartum return-to-running training programme: an international Delphi study and consensus statement», Br J Sports Med 2024;58:183–195',
};

export const SIS_EMBARAZO = {
  id: 'transversal_embarazo', icon: '🤰', nombre: 'Embarazo y posparto', soloEmbarazo: true,
  banderasRojas: [
    { texto: 'Cefalea intensa o que no se pasa, visión borrosa o destellos, dolor fuerte bajo las costillas, vómitos o hinchazón brusca de cara, manos o pies (preeclampsia)', em: { embarazo: { desde: 20 }, posparto: {} }, pregunta: 'em_u_preeclampsia' },
    { texto: 'Sangrado vaginal sin explicación en el embarazo', em: { embarazo: { desde: 13 } }, pregunta: 'em_u_sangrado' },
    { texto: 'Menos movimientos del bebé', em: { embarazo: { desde: 24 } }, pregunta: 'em_u_movimientos' },
    { texto: 'Contracciones regulares y dolorosas o pérdida de líquido por la vagina', em: { embarazo: {} }, pregunta: 'em_u_parto' },
    { texto: 'Fiebre, escalofríos o encontrarse muy mal en el embarazo (infección)', em: { embarazo: {} }, pregunta: 'em_u_infeccion_emb' },
    { texto: 'Sangrado brusco, muy abundante o que va a más tras el parto, o abdomen muy hinchado', em: { posparto: {} }, pregunta: 'em_u_sangrado_pp' },
    { texto: 'Fiebre, escalofríos, dolor de vientre, pelvis o periné, o flujo maloliente tras el parto (infección)', em: { posparto: { hasta: 8 } }, pregunta: 'em_u_infeccion' },
    { texto: 'Pierna dolorosa e hinchada, falta de aire nueva, dolor en el pecho o tos con sangre (trombosis o embolia)', em: { embarazo: {}, posparto: {} }, pregunta: 'em_u_tev' },
    { texto: 'Dolor en el pecho, palpitaciones o falta de aire en reposo o al tumbarse (problema cardiaco del embarazo o el posparto)', em: { embarazo: {}, posparto: {} }, pregunta: 'em_u_corazon' },
    { texto: 'Herida del periné o de la cesárea que se abre o se infecta', em: { posparto: {} }, pregunta: 'em_u_perine' },
    { texto: 'Pérdida continua de orina o heces tras el parto', em: { posparto: {} }, pregunta: 'em_u_incontinencia' },
    { texto: 'Cambios bruscos de conducta tras el parto: confusión, ideas extrañas, euforia o agitación (psicosis posparto)', em: { posparto: {} }, pregunta: 'em_u_psicosis' },
    { texto: 'Ideas de hacerse daño', em: { embarazo: {}, posparto: {} }, pregunta: 'em_u_autolesion' },
  ],
  banderasAmarillas: [
    { texto: 'Dolor de espalda intenso y persistente en el embarazo o la lactancia, o pérdida de altura (posible osteoporosis del embarazo)', em: { embarazo: {}, posparto: {}, sinPLO: true }, pregunta: 'em_d_plo' },
    { texto: 'Dolor intenso o brusco en la pelvis, la nalga o la zona lumbar en las 2 semanas tras el parto, con cojera o sin poder apoyar (posible fractura de estrés)', em: { posparto: { hasta: 2 } }, pregunta: 'em_d_fractura' },
    { texto: 'Pecho rojo e hinchado más de 24 horas (posible mastitis)', em: { posparto: {} }, pregunta: 'em_d_mama' },
  ],
  preguntas: [
    { id: 'em_u_preeclampsia', em: { embarazo: { desde: 20 }, posparto: {} }, alerta: true,
      urgencia: 'Posibles síntomas de preeclampsia: que la vea un profesional sanitario ya, hoy.',
      text: '¿Tiene dolor de cabeza fuerte o que no se le pasa, ve borroso o destellos, dolor fuerte justo debajo de las costillas, vómitos, o se le han hinchado de golpe la cara, las manos o los pies?',
      razonamiento: {
        porque: 'Son los síntomas de la preeclampsia, la hipertensión del embarazo que daña otros órganos; se define a partir de la semana 20 y también aparece tras el parto (NICE NG133; NICE NG194, 1.2.4).',
        peso: 'En el embarazo, NICE pide que, con estos síntomas, la vea un profesional sanitario «immediately» (NICE NG133, 1.1.1). Tras el parto, el dolor de cabeza intenso o que no se pasa pide consejo médico sin demora, porque puede ser una preeclampsia (NICE NG194, 1.2.4); a quien ya tuvo preeclampsia hay que preguntarle por la cefalea intensa y el dolor epigástrico cada vez que se le toma la tensión (NICE NG133, 1.5.15). Si tiene la tensión tomada, el umbral de la fase 1 decide el plazo (NICE NG201, 1.2.26–1.2.27).',
        fuentes: ['NICE NG133', 'NICE NG194', 'NICE NG201'],
        citas: [`${EM_CITA.ng133}, 1.1.1, 1.5.15 y «Terms used in this guideline».`, `${EM_CITA.ng194}, 1.2.4.`, `${EM_CITA.ng201}, 1.2.26–1.2.27.`]
      } },
    { id: 'em_u_sangrado', em: { embarazo: { desde: 13 } }, alerta: true,
      urgencia: 'Sangrado vaginal sin explicación en el embarazo: valoración hospitalaria hoy.',
      text: '¿Ha tenido un sangrado vaginal que no le han explicado?',
      razonamiento: {
        porque: 'Después de la semana 13, un sangrado sin explicar puede venir de la placenta (desprendimiento) o anunciar un parto prematuro (NICE NG201, 1.4.18).',
        peso: 'NICE pide derivarla al hospital para revisarla (NICE NG201, 1.4.17); el plazo «hoy» es redacción de la app. Antes de la semana 13, el dolor con sangrado ya lo pregunta la pregunta del embarazo ectópico de la región.',
        fuentes: ['NICE NG201'],
        citas: [`${EM_CITA.ng201}, 1.4.17–1.4.18.`]
      } },
    { id: 'em_u_movimientos', em: { embarazo: { desde: 24 } }, alerta: true,
      urgencia: 'Menos movimientos del bebé: que llame a su maternidad ahora, a cualquier hora.',
      text: '¿Nota que el bebé se mueve menos de lo habitual?',
      razonamiento: {
        porque: 'Que el bebé se mueva menos puede ser la primera señal de que algo va mal en el embarazo.',
        peso: 'NICE pide que contacte con su maternidad a cualquier hora del día o de la noche si nota menos movimientos después de la semana 24 (NICE NG201, 1.2.34).',
        fuentes: ['NICE NG201'],
        citas: [`${EM_CITA.ng201}, 1.2.34.`]
      } },
    { id: 'em_u_parto', em: { embarazo: {} }, alerta: true,
      urgencia: 'Posible parto prematuro o rotura de la bolsa: que llame a su maternidad ahora.',
      text: '¿Tiene contracciones regulares y dolorosas, o le sale líquido por la vagina?',
      razonamiento: {
        porque: 'Las contracciones regulares y dolorosas pueden ser un parto que empieza antes de tiempo, y la pérdida persistente de líquido, la rotura de la bolsa.',
        peso: 'La guía canadiense las pone entre los motivos para parar la actividad y consultar «immediately» (Mottola 2018, recuadros 1 y 2); la redacción de la urgencia es de la app.',
        fuentes: ['Mottola 2018'],
        citas: [`${EM_CITA.mottola}, recuadros 1 y 2.`]
      } },
    { id: 'em_u_infeccion_emb', em: { embarazo: {} }, alerta: true,
      urgencia: 'Posible infección en el embarazo: consulta médica hoy; si está confusa, respira muy rápido, le falta el aire o se encuentra muy mal, urgencias (112).',
      text: '¿Tiene fiebre o escalofríos, o se encuentra muy mal?',
      razonamiento: {
        porque: 'La embarazada está en el grupo de alto riesgo de sepsis (NICE NG255, 1.2.1), y la sepsis puede dar solo un malestar general, sin fiebre (1.1.2).',
        peso: 'Con criterios de alto riesgo (alteración mental nueva, frecuencia respiratoria de 25 o más, tensión sistólica de 90 o menos, pulso de más de 130…), NICE pide atención urgente, normalmente en ambulancia (NICE NG255, 1.6.1 y tabla 1). En el embarazo el pulso basal es 10–15 lpm más alto (1.4.4). «Hoy» y el 112 son redacción de la app.',
        fuentes: ['NICE NG255'],
        citas: [`${EM_CITA.ng255}, 1.1.2, 1.2.1, 1.4.4, 1.6.1 y tabla 1.`]
      } },
    { id: 'em_u_sangrado_pp', em: { posparto: {} }, alerta: true,
      urgencia: 'Posible hemorragia o restos tras el parto: consulta médica sin demora, hoy.',
      text: '¿Tiene un sangrado vaginal brusco o muy abundante, que va a más, o expulsa coágulos o restos? ¿O se le ha hinchado mucho el vientre?',
      razonamiento: {
        porque: 'Tras el parto, un sangrado que aumenta o con restos puede ser placenta retenida o una infección del útero (NICE NG194, 1.2.4).',
        peso: 'NICE pide consulta médica «without delay» (NICE NG194, 1.2.4 y 1.2.13). La guía de fisioterapia del posparto añade el sangrado intenso y el abdomen muy hinchado entre los signos que piden derivación médica inmediata (Simonds 2022, p. E10).',
        fuentes: ['NICE NG194', 'Simonds 2022'],
        citas: [`${EM_CITA.ng194}, 1.2.4 y 1.2.13.`, `${EM_CITA.simonds}, p. E10.`]
      } },
    { id: 'em_u_infeccion', em: { posparto: { hasta: 8 } }, alerta: true,
      urgencia: 'Posible infección tras el parto: consulta médica sin demora, hoy; si está muy mal, confusa, respira muy rápido o le falta el aire, urgencias (112).',
      text: '¿Tiene fiebre o escalofríos, o dolor de vientre, pelvis o periné, o un flujo que huele mal?',
      razonamiento: {
        porque: 'Son los síntomas de una infección tras el parto (NICE NG194, 1.2.4). En las 6 semanas tras el parto, el aborto o la interrupción, la mujer está en el grupo de alto riesgo de sepsis (NICE NG255, 1.2.1). La pregunta sale las 8 primeras semanas tras el parto, las que cubre la guía del posparto (NICE NG194).',
        peso: 'Consulta médica «without delay» (NICE NG194, 1.2.4); con criterios de alto riesgo (alteración mental nueva, frecuencia respiratoria de 25 o más, tensión sistólica de 90 o menos, pulso de más de 130…), urgencias en ambulancia (NICE NG255, 1.6.1 y tabla 1). La sepsis puede no dar fiebre (NICE NG255, 1.1.2), y en el embarazo el pulso basal es 10–15 lpm más alto (1.4.4).',
        fuentes: ['NICE NG194', 'NICE NG255'],
        citas: [`${EM_CITA.ng194}, 1.2.4.`, `${EM_CITA.ng255}, 1.1.2, 1.2.1, 1.4.4, 1.6.1 y tabla 1.`]
      } },
    { id: 'em_u_tev', em: { embarazo: {}, posparto: {} }, alerta: true,
      urgencia: 'Posible trombosis o embolia: valoración médica urgente hoy (en el embarazo, el médico empieza el tratamiento antes de confirmarla). Si se desmaya o le falta mucho el aire, 112.',
      text: '¿Tiene dolor e hinchazón nuevos en una pierna, sobre todo en una sola; o dolor de espalda o de nalga con toda la pierna hinchada; o le falta el aire de forma nueva, le duele el pecho o ha tosido sangre?',
      razonamiento: {
        porque: 'En el embarazo y el puerperio, la trombosis da dolor e hinchazón de la pierna, normalmente de un lado, y a veces dolor bajo del vientre; la de la vena iliaca, dolor de espalda o de nalga con toda la pierna hinchada; la embolia, falta de aire, dolor en el pecho, tos con sangre o colapso (RCOG 2015, §2 y §4.1). El puerperio es el momento de más riesgo (RCOG 2015).',
        peso: 'Ante la sospecha, pruebas sin demora y heparina desde el principio, hasta descartarla (RCOG 2015, §6.1, grado B); el colapso es una emergencia (§6.4). En el embarazo no hay escala de probabilidad validada y el dímero D no sirve para descartarla (RCOG 2015, §4.3 y §4.4): ante la sospecha, derivar. Tras el parto, NICE da los mismos síntomas (NICE NG194, 1.2.4; NICE NG192, 1.7.7). «Hoy» y el 112 son redacción de la app.',
        detalle: 'Con una trombosis ya diagnosticada y tratada, la guía recomienda moverse con medias de compresión (RCOG 2015, §7.1, grado B). Si se pincha heparina, trátala como a una persona anticoagulada.\n\nEl dolor en el pecho y la falta de aire también salen en la pregunta del corazón: márcalas las dos si hace falta; las dos son urgentes.',
        fuentes: ['RCOG 2015', 'NICE NG194', 'NICE NG192'],
        citas: [`${EM_CITA.rcog}, §2, §4.1, §4.3, §4.4, §6.1, §6.4 y §7.1.`, `${EM_CITA.ng194}, 1.2.4.`, `${EM_CITA.ng192}, 1.7.7.`]
      } },
    { id: 'em_u_corazon', em: { embarazo: {}, posparto: {} }, alerta: true,
      urgencia: 'Posible problema cardiaco del embarazo o el posparto: valoración médica urgente hoy.',
      text: '¿Tiene dolor en el pecho, palpitaciones, o le falta el aire en reposo o al tumbarse?',
      razonamiento: {
        porque: 'Con estos síntomas en el embarazo o hasta 12 meses tras el parto hay que pensar en una miocardiopatía periparto u otra enfermedad cardiaca (Hameed 2023, elemento 2). La miocardiopatía periparto aparece al final del embarazo o hasta 6 meses tras el parto y pide ingreso urgente (Sambola 2024).',
        peso: 'Son signos de un evento cardiaco inminente la falta de aire en reposo, no poder estar tumbada, el pulso en reposo de 120 o más, la sistólica de 160 o más, 30 respiraciones por minuto o más y la saturación de 94 % o menos (Hameed 2023, recuadro 3). Tras el parto, el dolor torácico pide consulta médica sin demora (NICE NG194, 1.2.4).',
        fuentes: ['Hameed 2023', 'Sambola 2024', 'NICE NG194'],
        citas: [`${EM_CITA.hameed}, elementos 2 y 10, recuadro 3.`, `${EM_CITA.sambola}, «Peripartum cardiomyopathy».`, `${EM_CITA.ng194}, 1.2.4.`]
      } },
    { id: 'em_u_perine', em: { posparto: {} }, alerta: true,
      urgencia: 'Herida abierta o infectada tras el parto: a su maternidad hoy.',
      text: '¿Se le ha abierto la herida del periné o la de la cesárea, o tiene más dolor, rojez o supuración en ella?',
      razonamiento: {
        porque: 'La herida del periné o de la cesárea puede infectarse o abrirse en las primeras semanas (NICE NG192, 1.7.4).',
        peso: 'Con la herida del periné abierta, NICE pide derivar con urgencia para que la vean el mismo día (NICE NG194, 1.2.20); en la cesárea, el dolor creciente, la rojez, la supuración o la separación piden revisión (NICE NG192, 1.7.4).',
        fuentes: ['NICE NG194', 'NICE NG192'],
        citas: [`${EM_CITA.ng194}, 1.2.15 y 1.2.20.`, `${EM_CITA.ng192}, 1.7.4.`]
      } },
    { id: 'em_u_incontinencia', em: { posparto: {} }, alerta: true,
      urgencia: 'Pérdida continua de orina o heces tras el parto: valoración médica sin demora, hoy.',
      text: '¿Desde el parto se le escapa la orina o las heces de forma continua, sin poder controlarlo nada?',
      razonamiento: {
        porque: 'Una pérdida continua, no unos escapes con el esfuerzo, puede deberse a una fístula obstétrica u otra complicación grave del parto, que a veces se parece a un problema musculoesquelético (Simonds 2022, p. E10).',
        peso: 'La guía de fisioterapia del posparto pide derivación médica inmediata con la pérdida continua de heces u orina, la fiebre, el sangrado intenso o el abdomen muy hinchado (Simonds 2022, p. E10). Los escapes con el esfuerzo van en el bloque de suelo pélvico, no aquí.',
        fuentes: ['Simonds 2022'],
        citas: [`${EM_CITA.simonds}, p. E10.`]
      } },
    { id: 'em_u_psicosis', em: { posparto: {} }, alerta: true, privada: true,
      urgencia: 'Posible psicosis posparto: valoración por salud mental urgente (en 4 horas).',
      text: '(Si hace falta, al acompañante) ¿Ha notado cambios bruscos desde el parto: confusión, ideas extrañas, euforia o mucha agitación?',
      razonamiento: {
        porque: 'La psicosis posparto empieza de forma brusca, casi siempre en las primeras semanas, y puede agravarse muy deprisa (NICE CG192, «Terms used»).',
        peso: 'Con un inicio brusco de síntomas de psicosis, NICE pide valoración inmediata por salud mental, en las 4 horas siguientes a la derivación (NICE CG192, 1.5.12). La respuesta no va al informe ni al prompt; solo la derivación.',
        fuentes: ['NICE CG192'],
        citas: [`${EM_CITA.cg192}, 1.5.11–1.5.12 y «Terms used».`]
      } },
    { id: 'em_u_autolesion', em: { embarazo: {}, posparto: {} }, alerta: true, privada: true,
      urgencia: 'Riesgo para su seguridad: valoración urgente hoy (urgencias) y aviso a su médico.',
      text: '¿Ha pensado en hacerse daño o en quitarse la vida?',
      razonamiento: {
        porque: 'En el embarazo y el primer año tras el parto, NICE pide valorar el riesgo de autolesión y suicidio y avisar a su médico (NICE CG192, 1.6.3 y 1.6.5).',
        peso: 'La guía de fisioterapia del posparto pide derivar a urgencias ante cualquier idea de suicidio (Simonds 2022, p. E11). Con el riesgo, ayuda según su nivel, avisar a su médico y decirle a ella y a su familia que pidan ayuda si empeora (NICE CG192, 1.6.5). La respuesta no va al informe ni al prompt; solo la derivación.',
        fuentes: ['Simonds 2022', 'NICE CG192'],
        citas: [`${EM_CITA.simonds}, p. E11.`, `${EM_CITA.cg192}, 1.6.3 y 1.6.5.`]
      } },
    { id: 'em_d_plo', em: { embarazo: {}, posparto: {}, sinPLO: true }, alerta: true,
      derivacion: 'Posible fractura vertebral por osteoporosis del embarazo o la lactancia: valoración médica especializada pronto. Hasta entonces, sin terapia manual ni carga en la espalda.',
      text: '¿Tiene un dolor de espalda intenso y que no se le pasa, dorsal o lumbar, en el embarazo o desde el parto, o ha perdido 3 cm o más de altura?',
      razonamiento: {
        porque: 'La osteoporosis del embarazo o la lactancia da fracturas vertebrales, sobre todo dorsales y lumbares, al final del embarazo o en los primeros meses de lactancia, y se diagnostica tarde porque el dolor se atribuye al embarazo (Hadji 2026; Scioscia 2023).',
        peso: 'La declaración de posición pide derivar el dolor de espalda intenso y persistente del embarazo o la lactancia, y la pérdida de talla de 3 cm o más (Hadji 2026, secciones 4.3 y 5).',
        detalle: 'La osteoporosis transitoria de cadera es otra entidad: ante un dolor de cadera con alteración de la marcha en el embarazo hay que pensar también en ella (Hadji 2026), y la guía de fisioterapia del embarazo pone la fractura de cuello de fémur por osteoporosis transitoria entre las banderas rojas (Clinton 2017, p. 111).\n\nCon la tarjeta «Osteoporosis o fragilidad ósea» marcada con la causa del embarazo o la lactancia, esta pregunta no sale.',
        fuentes: ['Hadji 2026', 'Scioscia 2023', 'Clinton 2017'],
        citas: [`${EM_CITA.hadji}, secciones 4.3 y 5.`, `${EM_CITA.scioscia}.`, `${EM_CITA.clinton}, p. 111.`]
      } },
    { id: 'em_d_fractura', em: { posparto: { hasta: 2 } }, alerta: true,
      derivacion: 'Posible fractura de estrés de la pelvis tras el parto: derivar para pruebas de imagen.',
      text: '¿Desde el parto tiene un dolor intenso o que empezó de golpe en la sacroilíaca, la nalga, la zona lumbar o el pubis, le cuesta apoyar o cojea, o se le alivia tumbada?',
      razonamiento: {
        porque: 'En las 2 semanas tras el parto, un dolor de cintura pélvica intenso puede ser una fractura de estrés del sacro o de la pelvis, no un dolor mecánico (Simonds 2022, pp. E4–E5).',
        peso: 'La guía de fisioterapia del posparto pide palpar el hueso doloroso y derivar a imagen con cualquiera de estos datos en las 2 semanas tras el parto: dolor intenso, apoyo difícil o imposible, cojera, dolor brusco en sacroilíaca, nalga, zona lumbar o pubis, o dolor que alivia tumbada (Simonds 2022, grado A). Pregunta también si da el pecho y si se pinchó heparina en el embarazo, que se asocian a menos densidad ósea (Simonds 2022, evidencia débil).',
        detalle: 'En deportistas de élite que dan el pecho se han descrito fracturas de estrés (en torno al 3 %), el 43 % de ellas del sacro, algunas con ejercicio sin impacto (Deering 2024, citando otros estudios).',
        fuentes: ['Simonds 2022', 'Deering 2024'],
        citas: [`${EM_CITA.simonds}, pp. E4–E5.`, `${EM_CITA.deering}, p. 186.`]
      } },
    { id: 'em_d_mama', em: { posparto: {} }, alerta: true,
      derivacion: 'Posible mastitis: consulta médica.',
      text: '¿Tiene un pecho rojo e hinchado desde hace más de 24 horas, aunque se lo haya tratado?',
      razonamiento: {
        porque: 'Un pecho rojo e hinchado que empeora más de 24 horas pese a cuidarlo puede ser una mastitis (NICE NG194, 1.2.4).',
        peso: 'NICE lo pone en la lista de síntomas que piden consejo médico sin demora tras el parto (NICE NG194, 1.2.4).',
        fuentes: ['NICE NG194'],
        citas: [`${EM_CITA.ng194}, 1.2.4.`]
      } },
  ],
  // Tarjeta, bloques de la fase 2 y textos. Las citas cuentan en
  // docs/referencias.md como menciones del cribado.
  embarazo: {
    estados: { embarazada: 'Embarazada', posparto: 'Posparto (hasta 12 meses)' },
    familiar: { SI: 'Sí', NO: 'No', NS: 'No lo sabe' },
    partos: { vaginal: 'Vaginal', instrumental: 'Vaginal instrumental (fórceps o ventosa)', cesarea: 'Cesárea', ns: 'No lo sabe' },
    casillas: [
      { id: 'esfinter', texto: 'Lesión del esfínter anal' },
      { id: 'occipitoposterior', texto: 'Bebé boca arriba en el expulsivo (occipitoposterior)' },
    ],
    lactancia: { SI: 'Sí', NO: 'No' },
    // Bloque de ánimo (decisión 11): las dos preguntas de depresión de NICE
    // CG192 (1.5.4). Las respuestas viven en la tarjeta, nunca en el informe.
    animo: [
      { id: 'w1', texto: 'En el último mes, ¿se ha sentido a menudo decaída, deprimida o sin esperanza?' },
      { id: 'w2', texto: 'En el último mes, ¿ha tenido a menudo poco interés o poco placer en hacer las cosas?' },
    ],
    // Bloque de suelo pélvico (decisión 12): síntomas que preguntar (NICE NG210, 1.5.1), sin puntuar.
    suelo: [
      { id: 'sp1', texto: '¿Se le escapa la orina (al toser, reír, saltar o sin poder llegar al baño)?' },
      { id: 'sp2', texto: '¿Se le escapan los gases o las heces?' },
      { id: 'sp3', texto: '¿Nota un bulto o un peso en la vagina?' },
    ],
    textos: {
      nota: 'Márcala si está embarazada o ha dado a luz en el último año. Las preguntas de la fase 2 dependen de las semanas.',
      hombre: 'Con sexo «Hombre» no aplica.',
      formulario: 'En el formulario previo dice que está embarazada o que ha dado a luz en el último año: marca la tarjeta.',
      semanasSin: 'Anota las semanas: deciden qué preguntas salen en la fase 2.',
      // Regla de la tensión arterial (decisión 5)
      taGrave: 'Tensión de 160/110 o más en el embarazo: valoración el mismo día (NICE NG201, 1.2.27).',
      taCronica: 'Antes de la semana 20, una tensión de 140/90 o más se trata como hipertensión crónica (NICE NG201, 1.2.25); sin controlar, contraindica el ejercicio (Mottola 2018, tabla 2). Que lo sepa su médico o su equipo obstétrico.',
      taAlta: 'Primera tensión de 140/90 o más desde la semana 20: valoración especializada en 24 h, si no la tiene ya en seguimiento (NICE NG201, 1.2.26).',
      // Fase 2: ánimo
      animoSi: 'Con un «sí»: el PHQ-9 de la calculadora o que la vea su médico de cabecera (NICE CG192, 1.5.5).',
      animoAnsiedad: 'Para la ansiedad, el GAD-7 de la calculadora o su médico de cabecera (NICE CG192, 1.5.4 y 1.5.6).',
      animoFuente: 'Preguntas de NICE CG192 (1.5.4), para cualquier profesional que la vea con regularidad en el embarazo y el primer año tras el parto (1.5.8). Las respuestas no van al informe.',
      // Fase 2: suelo pélvico
      sueloCon: 'Fisioterapia de suelo pélvico: programa supervisado de al menos 3 meses (NICE NG210, 1.6.14).',
      sueloHeces: 'Con escapes de heces, también valoración médica (NICE NG123, 1.3.20).',
      sueloRiesgo: 'Sin síntomas, pero con riesgo (familiar de primer grado con disfunción desde la semana 20, parto instrumental, occipitoposterior o lesión del esfínter anal): puede beneficiarse de un programa supervisado de 3 meses (NICE NG210, 1.3.12).',
      sueloDiario: 'Suelo pélvico a diario, con la técnica aprendida (Mottola 2018; NICE NG210, 1.3.11).',
      // W2 (Woodley 2020): solo en el bloque de la fase 2; nunca al payload, al informe ni al prompt
      sueloEvidencia: 'En el embarazo, entrenar el suelo pélvico de forma estructurada desde el principio, sin escapes, probablemente los previene al final del embarazo y los reduce algo tras el parto; como tratamiento de los escapes en el embarazo o el posparto, el efecto aún es incierto (Woodley 2020, Cochrane).',
      sueloFuente: 'Síntomas que preguntar tras el parto (NICE NG210, 1.5.1 y 1.5.3), sin puntuar.',
      // Fase 4b
      supino: 'Embarazada de 20 semanas o más: no la dejes mucho rato boca arriba y, si se marea, tiene náuseas o se encuentra mal, ponla de lado (Mottola 2018; ACOG 2020).',
      gaensMenos4: 'Posparto de menos de 4 semanas: no hagas el Gaenslen (Simonds 2022).',
      gaensMas4: 'Posparto: no hagas el Gaenslen si le duele la sínfisis del pubis (Simonds 2022).',
      // Fase 5: embarazo
      dosisEmb: 'Activa durante todo el embarazo si no hay contraindicación: al menos 150 min por semana de intensidad moderada (puede hablar, no cantar), repartidos en 3 días o más, con aeróbico y fuerza; si no llega, empezar poco a poco (Mottola 2018, recomendaciones fuertes; Bull 2020).',
      precaucionesEmb: 'Sin buceo, deportes de contacto, riesgo de caída ni bicicleta en movimiento; sin calor excesivo y bien hidratada; la intensidad alta, solo supervisada; si la maniobra de Valsalva le marea, sin aguantar la respiración (Mottola 2018, opinión de expertos).',
      supinoEmb: 'Boca arriba: si se marea, tiene náuseas o se encuentra mal, cambiar de posición (Mottola 2018, recomendación débil); desde la semana 20 puede bajar el retorno venoso (ACOG 2020).',
      pararEmb: 'Parar el ejercicio y consultar si aparece: sangrado vaginal, pérdida de líquido, contracciones regulares y dolorosas, dolor de vientre, dolor en el pecho, falta de aire que no cede en reposo, mareo que no cede, dolor de cabeza, debilidad que afecta al equilibrio, o dolor o hinchazón de pantorrilla (Mottola 2018, recuadro 2; ACOG 2020, recuadro 3).',
      contraindicaciones: 'Con una contraindicación absoluta (rotura de la bolsa, parto prematuro, sangrado persistente sin explicar, placenta previa después de la semana 28, preeclampsia, cuello del útero incompetente, crecimiento fetal restringido, embarazo de trillizos o más, diabetes tipo 1, hipertensión o tiroides sin controlar, u otra enfermedad cardiovascular, respiratoria o sistémica grave), solo las actividades de la vida diaria; con una relativa, que hable con su obstetra o matrona antes de un ejercicio moderado o intenso (Mottola 2018, tabla 2).',
      diastasisEmb: 'Con diástasis en el embarazo, la guía canadiense aconseja consejo de fisioterapia y evitar los abdominales tipo curl (Mottola 2018, opinión de expertos).',
      // Fase 5: posparto
      vueltaPp: 'Volver a la actividad de forma gradual, guiada por los síntomas (Bull 2020); no hace falta una autorización médica de rutina y la vuelta puede empezar antes de las 6 semanas (Davenport 2025). Tras la cesárea, cuando se sienta recuperada (NICE NG192, 1.7.8). La misma dosis que en el embarazo: 150 min por semana, con fuerza (Bull 2020).',
      relativasPp: 'Durante el primer año, que consulte con su médico antes del ejercicio moderado o intenso si tiene: tensión de más de 140/90, dolor en el pecho, falta de aire en reposo, mareo o pérdida de conocimiento, síntomas neurológicos, dolor o hinchazón de pantorrilla, sangrado vaginal sin regla, dolor abdominal intenso, anemia o cansancio excesivo, fiebre, o síntomas de la cesárea que empeoran con el ejercicio; casi siempre podrá seguir activa, adaptando (Davenport 2025).',
      noContraPp: 'No son contraindicaciones: el dolor lumbar, el de cintura pélvica (sin consenso entre los encuestados; lo decidieron los autores), la incontinencia, el prolapso leve o moderado y la diástasis (Davenport 2025).',
      lactanciaPp: 'Si da el pecho, mejor dar el pecho o sacarse leche antes del ejercicio, por comodidad (Davenport 2025).',
      correrPp: 'Volver a correr: no antes de 3 semanas y con las heridas del parto, también la cesárea, completamente curadas; el momento es individual, sin plazo fijo de 6 o 12 semanas. Antes, caminar 30 min y tareas de impacto sin síntomas. Con síntomas leves de suelo pélvico puede correr adaptando; con síntomas graves, valoración especializada primero. Si aparecen escapes, peso o presión vaginal al correr, parar y caminar (Christopher 2024; Deering 2024, consenso Delphi).',
      diastasisPp: 'Diástasis: no hay un corte de consenso; la leve no se asocia a dolor lumbopélvico (Sperstad 2016); se resuelve sola en buena parte durante el primer año (Gluppe 2021); el ejercicio abdominal la reduce poco (Beamish 2025), y no hay que prohibir el curl ni el suelo pélvico (Gluppe 2021).',
      // Fase 5: dolor lumbopélvico
      pelvicaEjercicio: 'Dolor lumbar o de cintura pélvica: ejercicio o cinturón lumbopélvico no rígido (NICE NG201, 1.4.15). En el embarazo, el ejercicio de 8–12 semanas reduce el dolor lumbar y pélvico, pero en el dolor solo pélvico no mejora más que la atención habitual (Liddle y Pennick 2015).',
      pelvicaPosparto: 'En el posparto, ejercicio individualizado con enfoque biopsicosocial y cribado del miedo-evitación (Davenport 2025); el tratamiento, antes de los 3 meses (Simonds 2022). Predicen que persista: dolor intenso, muchas pruebas de provocación positivas, dolor lumbopélvico previo, discapacidad alta, neuroticismo y miedo-evitación (Burani 2023).',
      terapiaManual: 'La terapia manual no tiene base para ser el tratamiento principal ni para usarse sola (Hall 2016; Simonds 2022): como mucho, para probar el alivio en pocas sesiones (Vleeming 2008, nivel D). Del thrust en el embarazo hay un solo ensayo piloto, con 15 mujeres en decúbito lateral y sin efectos adversos, recogido en la revisión Cochrane (Liddle y Pennick 2015), y la guía de fisioterapia lo deja a criterio del clínico (Clinton 2017, grado C): no basta para decir que sea seguro.',
      thrustPp: 'En el posparto, el thrust no está indicado con articulaciones simétricas (Simonds 2022).',
      // Línea de la sacroilíaca (T8): tarjeta de lu8 y ca10 en la fase 5
      sacroiliaca: 'Embarazo o posparto: primero información (el dolor no es peligroso y probablemente mejorará) y ejercicio individualizado en el embarazo, o estabilización individualizada en el posparto (Vleeming 2008, nivel C); el cinturón, para probar el alivio por periodos cortos (Vleeming 2008, nivel D; NICE NG201, 1.4.15).',
    },
  },
};

// ─── Paciente anticoagulado o antiagregado (Fase P, docs/anticoagulado.md) ───
// Tarjeta con un solo estado, «Toma», y los fármacos en chips (decisión 2). Cada
// pregunta y bandera lleva `ac`, el grupo con el que sale (lib/anticoagulado.js,
// elementoACVisible): 'anticoagulante' (antivitamina K, directo, heparina o «no
// lo sabe»), 'cabeza' (lo anterior o un antiagregante que no sea la aspirina
// sola: NICE NG232, 1.2.4) o 'todos'. Ninguna regla automática con otras
// tarjetas (decisión 19). «Hoy», «ya», «ahora» y el 112 son redacción de la app:
// las fuentes hablan de manejo hospitalario. Fuentes leídas enteras en la sesión.
const AC_CITA = {
  ng232: 'NICE NG232 — National Institute for Health and Care Excellence, «Head injury: assessment and early management», NICE guideline NG232, 2023 (cambios menores hasta 2025)',
  chenoweth: 'Chenoweth 2018 — Chenoweth, Gaona, Faul, Holmes y Nishijima, «Incidence of Delayed Intracranial Hemorrhage in Older Patients After Blunt Head Trauma», JAMA Surg 2018;153(6):570–575',
  colombo: 'Colombo 2021 — Colombo, Bonzi, Fiorelli et al., «Incidence of delayed bleeding in patients on antiplatelet therapy after mild traumatic brain injury: a systematic review and meta-analysis», Scand J Trauma Resusc Emerg Med 2021;29(1):123',
  wiegele: 'Wiegele 2019 — Wiegele, Schöchl, Haushofer et al., «Diagnostic and therapeutic approach in adult patients with traumatic brain injury receiving oral anticoagulant therapy: an Austrian interdisciplinary consensus statement», Crit Care 2019;23:62',
  capsoni: 'Capsoni 2025 — Capsoni, Carpani, Tarantino et al., «Incidence and risk factors for delayed intracranial hemorrhage after mild brain injury in anticoagulated patients: a multicenter retrospective study», Scand J Trauma Resusc Emerg Med 2025;33',
  peng: 'Peng 2022 — Peng, Yan, Liu et al., «Prognostic Factors and Treatments Efficacy in Spontaneous Spinal Epidural Hematoma: A Multicenter Retrospective Study», Neurology 2022;99(8):e843–e850',
  albrecht: 'Albrecht 2024 — Albrecht, Boeckh-Behrens, Schwarting et al., «Spontaneous spinal hematomas: A case series», Acta Neurochir (Wien) 2024;166(1):353',
  ghosh: 'Ghosh 2026 — Ghosh, Shine y Sundaralingam, «Spontaneous Spinal Epidural Haematoma Associated With Direct Oral Anticoagulants: A Descriptive Systematic Review», Cureus 2026;18(7):e112438',
  cooper: 'Cooper 2019 — Cooper, Battaglia y Reiter, «Spinal epidural hematoma in a patient on chronic anticoagulation therapy performing self-neck manipulation: a case report», Chiropr Man Therap 2019;27:41',
  lukies: 'Lukies 2023 — Lukies, Gipson, Tan et al., «Spontaneous Retroperitoneal Haemorrhage: Efficacy of Conservative Management and Embolisation», Cardiovasc Intervent Radiol 2023;46(4):488–495',
  sahu: 'Sahu 2020 — Sahu, Mishra et al., «Femoral Neuropathy: A Rare Presentation of Retroperitoneal Hematoma with Review of Literature», Indian J Hematol Blood Transfus 2020;36(1):174–177',
  llitjos: 'Llitjos 2016 — Llitjos, Daviaud, Grimaldi et al., «Ilio-psoas hematoma in the intensive care unit: a multicentric study», Ann Intensive Care 2016;6(1):8',
  mameli: 'Mameli 2025 — Mameli, Marongiu, Podda, Pisanu y Barcellona, «Spontaneous Muscle Bleeding During Oral Anticoagulation Therapy: When Should We Suspect an Underlying Tumor?», Hematol Rep 2025;17(5):44',
  munoz: 'Muñoz 2022 — Muñoz, Dommerholt, Pérez-Palomares, Herrero y Calvo, «Dry Needling and Antithrombotic Drugs», Pain Res Manag 2022:1363477',
  liao: 'Liao 2021 — Liao y Puckett, «A Proposed Algorithm on the Modern Management of Rectus Sheath Hematoma: A Literature Review», Cureus 2021;13(11):e20008',
  hideyama: 'Hideyama 2023 — Hideyama, Watanabe, Ido et al., «Non-traumatic Rectus Sheath Hematoma During Direct Oral Anticoagulation», Cureus 2023;15(9):e45876',
  yale: 'Yale 2020 — Yale, Tekiner y Yale, «Fothergill and Carnett signs and rectus sheath hematoma», J Rural Med 2020;15(3):130–131',
  amaniyan: 'Amaniyan 2020 — Amaniyan, Ghobadi, Vaismoradi et al., «Cold Application on Bruising at the Subcutaneous Heparin Injection Site: A Systematic Review and Meta-Analysis», SAGE Open Nurs 2020;6:2377960820901370',
  brooker: 'Brooker 2020 — Brooker, Brown, Thornton et al., «Emergency fasciotomy in an anticoagulated patient with low energy posterior thigh injury», BMJ Case Rep 2020;13(9)',
  nemunaitis: 'Nemunaitis 2022 — Nemunaitis, Den Haese, Buseck et al., «A Case of Recurrent Compartment Syndrome with Concomitant Use of Eliquis», Case Rep Orthop 2022:1863538',
  ogrodnik: 'Ogrodnik 2021 — Ogrodnik, Oliver, Cani et al., «Clinical Case of Acute Non-Traumatic Hand Compartment Syndrome and Systematic Review for the Upper Extremity», Hand (N Y) 2021;16(3):285–291',
  kim26: 'Kim 2026 — Kim, Na, Kim, Choi, Hwang y Kim, «Acute Forearm Compartment Syndrome Following Physical Therapy in a Patient Receiving Anticoagulation Therapy: A Case Report», J Clin Med 2026;15(13):5052',
  dalrymple: 'Dalrymple 2022 — Dalrymple, Davies, Biggs et al., «Management of Haemarthrosis in Patients On Oral Anticoagulants», Geriatr Orthop Surg Rehabil 2022;13:21514593221076966',
  vastani: 'Vastani 2023 — Vastani, Mirza, Khoja et al., «Prognostic factors and surgical outcomes of spontaneous spinal epidural haematoma: a systematic review and meta-analysis», Neurosurg Rev 2023;46:21',
  kumar: 'Kumar 2024 — Kumar, Palmisciano, Dhawan, Boakye, Drazin y Sharma, «Spontaneous Spinal Hematoma in Patients Using Antiplatelets and Anticoagulants: A Systematic Review», World Neurosurg 2024',
  schulman: 'Schulman 2005 — Schulman y Kearon, «Definition of major bleeding in clinical investigations of antihemostatic medicinal products in non-surgical patients», J Thromb Haemost 2005;3:692–694',
  kaatz: 'Kaatz 2015 — Kaatz, Ahmad, Spyropoulos y Schulman, «Definition of clinically relevant non-major bleeding in studies of anticoagulants in atrial fibrillation and venous thromboembolic disease in non-surgical patients», J Thromb Haemost 2015;13:2119–2126',
  bahit: 'Bahit 2017 — Bahit, Lopes, Wojdyla et al., «Non-major bleeding with apixaban versus warfarin in patients with atrial fibrillation», Heart 2017;103(8):623–628',
};

export const SIS_ANTICOAGULADO = {
  id: 'transversal_anticoagulado', icon: '🩸', nombre: 'Anticoagulado o antiagregado', soloAnticoagulado: true,
  banderasRojas: [
    { texto: 'Golpe en la cabeza, aunque parezca leve, con anticoagulante o antiagregante', ac: 'cabeza', pregunta: 'ac_u_cabeza' },
    { texto: 'Dolor de cabeza fuerte o que va a más, vómitos, somnolencia, confusión o síntomas neurológicos nuevos tras un golpe en la cabeza', ac: 'todos', pregunta: 'ac_u_cabeza_tardia' },
    { texto: 'Dolor brusco de cuello o espalda con debilidad, hormigueo o cambios al orinar o al hacer de vientre (hematoma epidural espinal)', ac: 'todos', pregunta: 'ac_u_espinal' },
    { texto: 'Dolor de ingle, cadera, costado o zona lumbar baja con el muslo débil o adormecido, o con mareo y palidez (hematoma del psoas o retroperitoneal)', ac: 'anticoagulante', pregunta: 'ac_u_psoas' },
    { texto: 'Dolor brusco en la pared del abdomen con un bulto (hematoma de la vaina de los rectos)', ac: 'anticoagulante', pregunta: 'ac_u_pared' },
    { texto: 'Extremidad muy hinchada y tensa con dolor desproporcionado, peor al estirar pasivamente (síndrome compartimental)', ac: 'todos', pregunta: 'ac_u_compartimental' },
  ],
  banderasAmarillas: [
    { texto: 'Hematoma grande o que va a más, bulto muscular nuevo o articulación hinchada tras un golpe pequeño o sin golpe', ac: 'todos', pregunta: 'ac_d_hematoma' },
  ],
  preguntas: [
    { id: 'ac_u_cabeza', ac: 'cabeza', alerta: true,
      urgencia: 'Golpe en la cabeza con anticoagulante o antiagregante: que lo valore un servicio de urgencias hoy, aunque se encuentre bien; el sangrado puede aparecer días después.',
      text: '¿Se ha dado un golpe en la cabeza en los últimos días, aunque pareciera leve?',
      razonamiento: {
        porque: 'NICE pide a los servicios de la comunidad que deriven a urgencias a quien se ha golpeado la cabeza y toma un anticoagulante o un antiagregante (salvo la aspirina sola), aunque no tenga otros síntomas (NICE NG232, 1.2.4); allí se valora hacer un TAC en las 8 horas siguientes al golpe (NICE NG232, 1.5.13).',
        peso: 'La hemorragia que aparece tarde es rara y casi siempre sin consecuencias, pero existe y puede tardar días: en una cohorte de mayores de 55 años, dos de las tres aparecieron a los 3 y a los 5 días del primer TAC (Chenoweth 2018). «Hoy» es redacción de la app: la guía dice derivar a urgencias, sin plazo.',
        detalle: 'Con la aspirina sola, NICE no lo pone como factor de riesgo: su comité vio poco riesgo y admite el alta sin TAC tras decidirlo con la persona (NICE NG232, justificación). Por eso esta pregunta no sale con la aspirina sola. Con la doble antiagregación, el sangrado tardío fue más frecuente que con la aspirina sola (Colombo 2021).\n\nNICE no ingresa a nadie solo por estar anticoagulado si el TAC es normal; un consenso austriaco pide 24 horas de observación (Wiegele 2019). Para el fisioterapeuta no cambia nada: los dos mandan a urgencias.\n\nAl alta, NICE pide que un adulto le acompañe las primeras 24 horas y que sepa que algunas personas parecen recuperarse rápido y luego tienen complicaciones (NICE NG232, 1.10.9).',
        fuentes: ['NICE NG232', 'Chenoweth 2018', 'Colombo 2021', 'Wiegele 2019'],
        citas: [`${AC_CITA.ng232}, recomendaciones 1.2.4, 1.5.13 y 1.10.9, y justificación.`, `${AC_CITA.chenoweth}, resultados.`,
          `${AC_CITA.colombo}, resultados.`, `${AC_CITA.wiegele}, recomendaciones.`]
      } },
    { id: 'ac_u_cabeza_tardia', ac: 'todos', alerta: true,
      urgencia: 'Posible sangrado intracraneal tardío: urgencias ya; 112 si está muy adormilado, confuso o con debilidad.',
      text: 'Desde un golpe en la cabeza (de hace días o semanas), ¿tiene un dolor de cabeza fuerte o que va a más, vómitos repetidos, somnolencia, confusión o cambios de conducta, o debilidad, dificultad para hablar o cambios de visión nuevos?',
      razonamiento: {
        porque: 'Son los signos de que una hemorragia intracraneal está creciendo: dolor de cabeza intenso o que aumenta, vómitos persistentes, agitación o conducta anormal, y síntomas neurológicos nuevos (NICE NG232, 1.9.13). El comité de NICE nombra el dolor de cabeza intenso, la somnolencia y los vómitos como los primeros signos de un sangrado tardío (NICE NG232, justificación de 1.10.6).',
        peso: 'Puede aparecer días o semanas después del golpe, así que ningún protocolo de observación es del todo eficaz (Wiegele 2019). En anticoagulados, los vómitos tras el golpe y los síntomas nuevos durante la observación se asociaron a la hemorragia tardía (Capsoni 2025). «Ya» y el 112 son redacción de la app.',
        fuentes: ['NICE NG232', 'Wiegele 2019', 'Capsoni 2025'],
        citas: [`${AC_CITA.ng232}, recomendación 1.9.13 y justificación de 1.10.6.`, `${AC_CITA.wiegele}, discusión.`, `${AC_CITA.capsoni}, resultados.`]
      } },
    { id: 'ac_u_espinal', ac: 'todos', alerta: true,
      urgencia: 'Posible hematoma epidural espinal: urgencias ya (112); cuanto antes se descomprime, mejor.',
      text: '¿Le ha empezado de golpe un dolor fuerte de cuello o de espalda con debilidad, hormigueo o adormecimiento en brazos o piernas, o cambios al orinar o al hacer de vientre? (Puede empezar por la debilidad, sin dolor fuerte.)',
      razonamiento: {
        porque: 'Un sangrado en el canal vertebral comprime la médula o las raíces: suele empezar con un dolor brusco e intenso de cuello o espalda y luego aparecen debilidad, alteración de la sensibilidad o de la vejiga y el intestino (Peng 2022; Albrecht 2024). Los anticoagulantes son un factor de riesgo, aunque no el único: los tomaban 21 de 105 pacientes en una serie (Peng 2022) y 11 de 20 en otra (Albrecht 2024); con anticoagulantes directos, dos de cada tres fueron cervicales o cervicotorácicos (Ghosh 2026). Los antiagregantes, según el análisis de casos operados, no lo son (Vastani 2023), aunque los tomaba el 27 % en una revisión de pacientes con antitrombóticos (Kumar 2024): por eso la pregunta sale con cualquiera de ellos.',
        peso: 'En el 21 % el déficit grave llegó sin dolor importante (Peng 2022), el 19 % no tenía dolor de espalda al empezar (Vastani 2023), y puede haber un intervalo sin dolor de minutos a días antes del déficit (Albrecht 2024). La mayoría de los autores considera mejor operar en las primeras 12 horas (Peng 2022), y el único análisis que lo mide, con casos publicados, asocia operar antes de 12 horas a mejor resultado, sin comparar otros plazos (Vastani 2023): por eso la app dice «cuanto antes», sin horas. Con debilidad de un lado puede parecer un ictus (Ghosh 2026).',
        detalle: 'Hay casos publicados tras manipular la columna cervical en pacientes anticoagulados, como el de un paciente con warfarina muy por encima del rango (INR 7,84) que se giraba el cuello él mismo (Cooper 2019); ninguno demuestra que la técnica fuera la causa, y también hay casos sin anticoagulante.\n\nSe cruza con la pregunta de la cola de caballo de lumbar, la de compresión medular de la tarjeta de osteoporosis y la del hematoma tras una cirugía de columna: si encaja con varias, márcalas todas.',
        fuentes: ['Peng 2022', 'Albrecht 2024', 'Ghosh 2026', 'Cooper 2019', 'Vastani 2023', 'Kumar 2024'],
        citas: [`${AC_CITA.vastani}, resultados y discusión.`, `${AC_CITA.kumar}, resultados.`, `${AC_CITA.peng}, resultados y discusión.`, `${AC_CITA.albrecht}, resultados y discusión.`, `${AC_CITA.ghosh}, resultados.`, `${AC_CITA.cooper}, caso.`]
      } },
    { id: 'ac_u_psoas', ac: 'anticoagulante', alerta: true,
      urgencia: 'Posible hematoma profundo (del psoas o retroperitoneal): urgencias hoy; con mareo, palidez o tensión baja, 112.',
      text: '¿Le ha empezado un dolor fuerte en la ingle, la cadera, el costado o la zona lumbar baja, con el muslo débil o adormecido, o con mareo, palidez o sudor frío? (Con un golpe pequeño o sin golpe.)',
      razonamiento: {
        porque: 'Un sangrado en el psoas o detrás del peritoneo da un cuadro variado (dolor abdominal, de cadera, de costado o lumbar, caída de la tensión y afectación del plexo lumbar), y por eso se diagnostica tarde (Lukies 2023). La afectación del nervio femoral (muslo débil o adormecido) puede ser lo que lo delate (Sahu 2020). La anticoagulación es uno de sus factores de riesgo, y la causa en 56 de 77 casos de una serie de UCI (Llitjos 2016), y el psoas es uno de los músculos que más sangran con ella (Mameli 2025).',
        peso: 'Solo un tercio de los sangrados abdominales tiene los síntomas clásicos (Sahu 2020). En una serie de UCI, con casos graves, el 44 % llegó en shock y el 25 % con síntomas por compresión (Llitjos 2016). El manejo es hospitalario (Lukies 2023). «Hoy» y el 112 son redacción de la app.',
        detalle: 'En el anticoagulado con un dolor nuevo de ingle o cadera, conviene una exploración neurológica completa (Sahu 2020).\n\nPunción seca: el psoas es uno de los músculos en los que la revisión de punción seca con antitrombóticos recomienda la ecografía Doppler (Muñoz 2022).',
        fuentes: ['Lukies 2023', 'Sahu 2020', 'Llitjos 2016', 'Mameli 2025', 'Muñoz 2022'],
        citas: [`${AC_CITA.lukies}, introducción y discusión.`, `${AC_CITA.sahu}, caso y discusión.`, `${AC_CITA.llitjos}, resultados.`, `${AC_CITA.mameli}, discusión.`, `${AC_CITA.munoz}, apartado 10.`]
      } },
    { id: 'ac_u_pared', ac: 'anticoagulante', alerta: true,
      urgencia: 'Posible hematoma de la vaina de los rectos: valoración médica hoy; con mareo o dolor que va a más, urgencias.',
      text: '¿Le ha salido de golpe, tras toser, un esfuerzo o una inyección de heparina, un dolor fuerte en la pared de la barriga con un bulto, que empeora al moverse o al tensar el abdomen?',
      razonamiento: {
        porque: 'Un sangrado dentro de la vaina del recto da un dolor brusco en la pared del abdomen con un bulto doloroso; lo favorecen la anticoagulación, la tos, la hipertensión, la edad y una cirugía abdominal previa (Liao 2021). Un caso con apixabán empezó tras una tos intensa (Hideyama 2023). El bulto que sigue palpándose fijo al tensar el abdomen (signo de Fothergill) orienta a la pared y no al interior del abdomen (Yale 2020).',
        peso: 'Casi siempre se maneja en el hospital sin cirugía (entre el 56 y el 83 %), y lo que más pesa para necesitar algo más es la inestabilidad de la tensión, no el tamaño (Liao 2021). Los moratones en el punto de inyección de la heparina son frecuentes (Amaniyan 2020) y no son esto: lo que alarma es el dolor brusco con bulto. «Hoy» es redacción de la app.',
        fuentes: ['Liao 2021', 'Hideyama 2023', 'Yale 2020', 'Amaniyan 2020'],
        citas: [`${AC_CITA.liao}, revisión.`, `${AC_CITA.hideyama}, caso.`, `${AC_CITA.yale}.`, `${AC_CITA.amaniyan}, introducción.`]
      } },
    { id: 'ac_u_compartimental', ac: 'todos', alerta: true,
      urgencia: 'Posible síndrome compartimental por sangrado: urgencias ahora; no hay que esperar a que falten el pulso o el movimiento.',
      text: '¿Tiene un brazo, un antebrazo, una mano, un muslo o una pierna muy hinchados y tensos, con un dolor desproporcionado que va a más y que empeora al estirarle pasivamente los dedos de la mano o del pie? (Tras un golpe pequeño, un esfuerzo o sin causa.)',
      razonamiento: {
        porque: 'Un sangrado dentro de un compartimento muscular cerrado sube la presión hasta cortar el riego: dolor desproporcionado, compartimento tenso y dolor al estiramiento pasivo (Brooker 2020). El dolor al estiramiento pasivo es el signo precoz más sensible; la parálisis, la palidez y la falta de pulso llegan tarde, cuando ya hay daño (Nemunaitis 2022).',
        peso: 'Es una urgencia quirúrgica. Con anticoagulantes ha aparecido tras un traumatismo de baja energía (Brooker 2020), sin traumatismo (Nemunaitis 2022; Ogrodnik 2021) y tras una sesión de fisioterapia con estiramientos y movilización, sin que se pudiera demostrar la causa (Kim 2026). «Ahora» es redacción de la app.',
        detalle: 'Se cruza con la pregunta del síndrome compartimental tras una operación o un yeso del paciente posquirúrgico: si encaja con las dos, márcalas.',
        fuentes: ['Brooker 2020', 'Nemunaitis 2022', 'Ogrodnik 2021', 'Kim 2026'],
        citas: [`${AC_CITA.brooker}, discusión.`, `${AC_CITA.nemunaitis}, discusión.`, `${AC_CITA.ogrodnik}, resultados.`, `${AC_CITA.kim26}, caso y discusión.`]
      } },
    { id: 'ac_d_hematoma', ac: 'todos',
      derivacion: 'Valoración médica pronto: un hematoma que no se resuelve en 2–3 semanas, de más de 5 cm o profundo, o con dolor que persiste, hay que estudiarlo; una articulación hinchada con anticoagulante puede ser un hemartros, y ante la duda se aspira para descartar una infección. Si hay fiebre, calor y rojez, ya hay otra pregunta urgente.',
      text: '¿Tiene un hematoma grande o que va a más, un bulto nuevo en un músculo, o una articulación hinchada tras un golpe pequeño o sin golpe?',
      razonamiento: {
        porque: 'Con anticoagulantes orales aparecen hematomas musculares espontáneos, sobre todo en el psoas, la vaina de los rectos y el muslo; los benignos se resuelven en 2–6 semanas, y una masa que no lo hace en 2–3 semanas, mide más de 5 cm, es profunda o duele cada vez más hay que estudiarla, porque puede haber un tumor debajo (Mameli 2025). El hemartros con anticoagulantes orales aparece en un 0–1,5 % (Dalrymple 2022).',
        peso: 'No hay consenso sobre cómo manejar el hemartros con anticoagulantes; se aspira si el diagnóstico no está claro, para descartar una infección o una artritis por cristales (Dalrymple 2022). Un sangrado que no es mayor no es siempre menor: en un ensayo con apixabán y warfarina, el sangrado clínicamente relevante no mayor se asoció después a más sangrado mayor y a más muertes (Bahit 2017). En los ensayos, un sangrado articular con síntomas cuenta como sangrado mayor (Schulman 2005), y uno que lleva a una valoración médica en persona, como clínicamente relevante (Kaatz 2015): que la valoración no se demore. Que lo valore su médico; nunca le digas que deje el fármaco.',
        fuentes: ['Mameli 2025', 'Dalrymple 2022', 'Bahit 2017', 'Schulman 2005', 'Kaatz 2015'],
        citas: [`${AC_CITA.mameli}, discusión.`, `${AC_CITA.dalrymple}, introducción y discusión.`, `${AC_CITA.bahit}, resultados.`, `${AC_CITA.schulman}, p. 693.`, `${AC_CITA.kaatz}, p. 2124.`]
      } },
  ],
  // Tarjeta y textos. Las citas cuentan en docs/referencias.md como menciones del cribado.
  anticoagulado: {
    // Qué toma (chips multiselección; decisión 2). Grupos derivados en lib/anticoagulado.js.
    tipos: [
      { id: 'vk', texto: 'Antivitamina K (acenocumarol, warfarina)' },
      { id: 'do', texto: 'Anticoagulante directo (apixabán, rivaroxabán, edoxabán, dabigatrán)' },
      { id: 'hp', texto: 'Heparina (en inyección)' },
      { id: 'as', texto: 'Aspirina' },
      { id: 'oa', texto: 'Otro antiagregante (clopidogrel, prasugrel, ticagrelor…)' },
      { id: 'ns', texto: 'No lo sabe' },
    ],
    textos: {
      nota: 'Márcala si toma anticoagulantes o antiagregantes, también si es solo por una operación o por una trombosis reciente. No le digas que lo deje ni que se salte una dosis: las dudas, a quien se lo receta.',
      lupus: 'El anticoagulante o el antiagregante se marcan en la tarjeta «Paciente anticoagulado o antiagregado».',
      // Fase 4b (decisión 11): la última frase es redacción propia, apoyada en Brooker 2020.
      tecnica4b: 'Anticoagulado o antiagregado: precaución con lo que tenga riesgo de golpe (lo recomiendan para el lupus: Blaess 2024, rec. 3); un esfuerzo mecánico pequeño puede dar un sangrado importante (Kim 2026, un caso). Si durante la exploración aparece un dolor desproporcionado, una hinchazón tensa o un hematoma que crece, para y deriva.',
      // Fase 5
      medico: 'No sugieras dejar el anticoagulante ni saltarse una dosis: no tomarlo bien se asocia a más ictus y muerte (Salmasi 2020), y la guía EHRA pide no saltarse ninguna sin consultarlo antes (Steffel 2021). Las dudas, al médico que lo receta.',
      cabeza: 'Golpe en la cabeza con anticoagulante o con un antiagregante que no sea la aspirina sola: a urgencias, aunque se encuentre bien (NICE NG232, 1.2.4); que un adulto le acompañe las primeras 24 horas y sepa que puede empeorar después de parecer recuperado (NICE NG232, 1.10.9). El sangrado tardío es raro, pero puede aparecer días después (Chenoweth 2018).',
      cabezaAspirina: 'Con la aspirina sola, el golpe en la cabeza no es por sí solo motivo de derivar (NICE NG232, 1.2.4); los síntomas tras el golpe sí lo son.',
      thrust: 'Thrust: la única tabla específica de la columna torácica lo pone como contraindicación absoluta con tratamiento anticoagulante (Puentedura 2015, tabla 1), y otra, de la terapia manual cervical, como precaución (Hutting 2018, opinión de los autores); las dos son opinión de expertos, y ninguna distingue fármacos ni da un INR. Un estudio de cohorte asoció la anticoagulación crónica a más lesión cerebral o medular tras la manipulación, sin probar la causa (Whedon 2015).',
      antiagregante: 'Con antiagregante solo, ninguna fuente de manipulación lo trata como contraindicación; precaución con lo que tenga riesgo de golpe (lo recomiendan para el lupus: Blaess 2024, rec. 3).',
      tejidosBlandos: 'De la movilización, el masaje, la presión profunda y los estiramientos no hay ninguna norma con anticoagulantes: solo casos de sangrado tras un masajeador, un percutor o una sesión de estiramientos (Tominaga 2023; Kwon 2024; Kim 2026), un consenso de expertos sobre instrumentos de tejidos blandos que los trata como precaución (Cheatham 2025) y otro, en mayores, que pide informar del riesgo de moratón o sangrado antes de las técnicas de partes blandas (Hawk 2017). En uno de esos casos, grave, se usó un percutor sobre el punto de inyección de la heparina (Kwon 2024).',
      puncion: 'Punción seca: no existe ningún estudio con antitrombóticos. La APTA la pone entre las precauciones, no entre las contraindicaciones: con anticoagulantes, con precaución, y puede haber que evitar los músculos profundos que no se pueden comprimir, como el psoas o el pterigoideo lateral (APTA 2013). Una revisión narrativa y un consenso de expertos que se apoya en ella dicen que no es una contraindicación absoluta (Muñoz 2022; Waterway 2026); según otra revisión, la guía suiza sí la trata así con la anticoagulación (Malfait 2024). Práctica de los autores de la primera: empezar por músculos superficiales viendo cómo sangra, evitar al principio los profundos que no se pueden comprimir y comprimir 10–15 s (Muñoz 2022). Por analogía con los bloqueos nerviosos, los superficiales se hacen sin suspender el fármaco y los profundos no compresibles, como el del psoas, con el mismo cuidado que los de la columna (Kopp 2025, que no habla de punción seca). Sin INR límite: el único consenso con una cifra es de la inyección de toxina botulínica en la pierna profunda, con INR de 3,5 o menos (Boulias 2018), no de la punción seca.',
      ondas: 'Ondas de choque: sin consenso entre expertos sobre aplicarlas con anticoagulantes, y el hematoma es un efecto posible (Rhim 2025); se consideran un factor importante a valorar, sin datos con anticoagulados (Tenforde 2022).',
      ejercicio: 'Ejercicio: ninguna fuente da intensidad ni carga con anticoagulantes. Tras una embolia pulmonar, el ejercicio es seguro y factible (Xiang 2025); tras una TVP, caminar pronto no aumentó la embolia en los estudios (Liu 2015, con reservas de calidad). En la fibrilación auricular, la guía europea recomienda un programa de ejercicio adaptado para mejorar la forma física y reducir las recaídas, sin dar dosis (van Gelder 2024, I B).',
      trasTVP: 'Si toma el anticoagulante por una trombosis venosa profunda reciente de la pierna: casi siempre se trata en casa (Kakkos 2021, I A); compresión de 30–40 mmHg desde las primeras 24 horas para el dolor y la hinchazón (Kakkos 2021, I A), y medias por debajo de la rodilla para reducir el síndrome postrombótico (Kakkos 2021, IIa A), que suele empezar en los 3 primeros meses; los estudios de las medias para prevenirlo se contradicen, y en la trombosis de la pantorrilla solo son para los síntomas (Cosmi 2022, consenso de expertos). Sin compresión con enfermedad arterial grave de la pierna o insuficiencia cardiaca grave (Kakkos 2021). La guía no da pautas de ejercicio. Empezar un programa de ejercicio en los 3 primeros meses, siempre con el anticoagulante, no dio problemas de seguridad en 4 ensayos pequeños (250 personas, solo uno tras una TVP), sin beneficio claro frente al control (Steiner 2026). En el síndrome postrombótico ya establecido, un solo ensayo de 39 personas vio algo más de calidad de vida con 6 meses de ejercicio supervisado, sin cambio en la gravedad y sin efectos adversos; certeza muy baja (Jasionowska 2022).',
      deporte: 'Deporte: con anticoagulante oral por fibrilación auricular, la guía europea no recomienda los deportes de contacto directo o con riesgo de traumatismo, de competición o no (Pelliccia 2020, clase III); con doble antiagregación, evitar los de colisión, sobre todo si además toma anticoagulante (Pelliccia 2020). Para la competición, con aspirina sola no hay límite y, con doble antiagregación o anticoagulación plena, en los de colisión o impacto a alta velocidad los riesgos no compensan o se decide con el médico (Kim 2025). Ninguna de las dos habla de la heparina ni de la anticoagulación por una trombosis. Las actividades con poco riesgo de golpe, sí (Minardi 2024; Bavishi 2026).',
      caidas: 'Caídas: el anticoagulante no se retira solo por el riesgo de caídas, que rara vez causan un sangrado mayor (NICE NG196, 1.6.8); el riesgo absoluto de hemorragia intracraneal por una caída es bajo frente al de ictus (Mitchell 2023). Entrenar fuerza, equilibrio y marcha, y revisar la medicación con su médico (Mitchell 2023). No hay datos de que el ejercicio de equilibrio reduzca el sangrado por caídas. En la fibrilación auricular, los factores de riesgo de sangrado casi nunca son motivo para retirar el anticoagulante, porque el riesgo de ictus suele pesar más (van Gelder 2024).',
      banderas: 'Banderas de sangrado (fase 2): dolor brusco de cuello o espalda con debilidad, dolor de ingle o costado con el muslo débil o mareo, dolor brusco con bulto en la pared del abdomen, una extremidad tensa con dolor desproporcionado, y un hematoma que no se resuelve.',
      heparina: 'Con heparina en inyección, los moratones en el punto de inyección son frecuentes (Amaniyan 2020); un dolor brusco con bulto en la pared del abdomen no lo es (Liao 2021).',
      otrosFarmacos: 'Los AINE, los antidepresivos ISRS o IRSN y otros antiagregantes aumentan el riesgo de sangrado con estos fármacos (NICE NG196, 1.2.3; Nochaiwong 2022), y también el exceso de alcohol (van Gelder 2024): coméntalo con quien los receta.',
    },
  },
};
