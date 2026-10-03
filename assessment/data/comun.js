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
