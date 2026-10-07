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
export const SIS_ENDOCRINO = {
  id: 'transversal_endocrino', icon: '⚗️', nombre: 'Endocrino / Metabólico',
  banderasRojas: [
    'Síndrome del túnel carpiano bilateral (alerta endocrina/metabólica)',
    'Signos de tormenta tiroidea: taquicardia, hipertermia, agitación',
    'Confusión, letargo o sudoración profusa sin ejercicio en diabéticos (riesgo hipoglucemia/cetoacidosis)',
    'Signos de depleción de potasio por diuréticos: arritmias, calambres',
    'Aparición de xantomas eruptivos en tendones extensores',
    'Nódulos palpables supraclaviculares o fiebre inexplicable en pacientes con corticosteroides'
  ],
  banderasAmarillas: [
    'Debilidad muscular proximal, mialgias y fatiga sistémica inexplicada',
    'Periartritis o tendinitis calcificante bilateral de hombro',
    'Cambios inexplicables en cabello, uñas, piel o tolerancia a la temperatura',
    'Polidipsia y poliuria (sed y orina excesivas)'
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
    'Sangrado espontáneo, petequias o equimosis sin traumatismo (trombocitopenia)',
    'Heces negras/alquitranadas indicativas de trombocitopenia o sangrado GI',
    'Episodios nuevos de dolor muscular o articular en pacientes con hemofilia',
    'Hemoptisis (toser sangre) en pacientes con hemofilia',
    'Fiebre alta, escalofríos y sudores por infecciones en pacientes con leucopenia'
  ],
  banderasAmarillas: [
    'Palidez en pliegues palmares, mucosas o lechos ungueales',
    'Uñas cóncavas o quebradizas (coiloniquia — alerta de anemia ferropénica)',
    'Disnea rápida, dolor de pecho, debilidad y fatiga con palpitaciones',
    'Uso crónico de AINEs (predispone a sangrado GI y anemia)'
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
const PQ_URGENCIA_TVP = 'Posible TVP: derivar hoy (NICE NG158: con Wells ≥2, ecografía en 4 horas; con 1 o menos, dímero D en 4 horas; riesgo de embolia pulmonar).';

export const SIS_POSQUIRURGICO = {
  id: 'transversal_posquirurgico', icon: '🏥', nombre: 'Posquirúrgico', soloPosquirurgico: true,
  banderasRojas: [
    'Herida más roja, caliente, hinchada o dolorosa, que supura o se abre, o fiebre y malestar tras la operación (infección)',
    'En las 48–72 horas siguientes, dolor desproporcionado con piel oscura, ampollas, crepitación o signos de sepsis (infección necrotizante: urgencia quirúrgica)',
    'Pierna hinchada, caliente o dolorosa (TVP)',
    'Falta de aire brusca, dolor en el pecho al respirar, tos con sangre o síncope (embolia pulmonar)',
    'Dolor desproporcionado que va a más, sobre todo al estirar los dedos, con el compartimento tenso, en las horas siguientes a la lesión, la operación o un yeso o vendaje (síndrome compartimental)',
    'Dolor quemante, hormigueo, adormecimiento o debilidad nuevos en el territorio de un nervio (posible lesión nerviosa)'
  ],
  banderasAmarillas: [
    'Dolor continuo y desproporcionado con cambios de color, temperatura, sudoración o hinchazón, o dolor al roce (SDRC)',
    'Yeso o vendaje que aprieta, o dolor desproporcionado mientras se lleva o al retirarlo (aviso precoz de SDRC)'
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
      razonamiento: PQ_RAZON_TVP },
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
      } }
  ]
};
