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
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387, 392 y 423.'
        ]
      } },
    { id: 'end_2', text: '¿Ha notado aumento anormal de sed, apetito o frecuencia urinaria (incluso despertándose por la noche)?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Con la glucosa alta en sangre el riñón no puede reabsorberla y arrastra agua (diuresis osmótica): se orina mucho, también de noche, y la pérdida de agua da sed intensa. En la diabetes tipo 1 aumenta además el apetito. La diabetes insípida y la insuficiencia suprarrenal también dan sed y poliuria.',
        peso: 'La tríada de sed, orina abundante y hambre es un signo clásico de diabetes no tratada o mal controlada y merece valoración médica si es nueva. Un solo síntoma aislado (levantarse a orinar, por ejemplo) tiene muchas otras causas.',
        detalle: 'Mecanismo: la hiperglucemia hace que la sangre sea hiperosmolar y «tire» del líquido intersticial, que se pierde por el riñón (diuresis osmótica); la persona orina mucho (poliuria) y, para compensar, bebe mucho (polidipsia). La glucosa sale por la orina. En la diabetes tipo 1 aumenta el apetito y, a la vez, se pierde peso.\n\nOtros signos de diabetes no tratada que suelen acompañar: fatiga y debilidad, visión borrosa, irritabilidad, infecciones de repetición (piel, encías, vejiga, vagina), hormigueo en manos y pies, y cortes o moratones que tardan en curar.\n\nCon qué se confunde: la nicturia de origen urinario o prostático. La hipercalcemia del hiperparatiroidismo también da poliuria y polidipsia.',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 399, 402 y 423.'
        ]
      } },
    { id: 'end_3', text: '¿Ha experimentado cambios recientes en su peso o tolerancia a la temperatura (mucho frío o calor cuando otros no)?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Las hormonas tiroideas regulan el metabolismo de todo el cuerpo. Su exceso (hipertiroidismo) acelera el metabolismo: pérdida de peso, calor, palpitaciones y temblor. Su falta (hipotiroidismo) lo frena: aumento de peso, frío, cansancio y somnolencia.',
        peso: 'Cada síntoma por separado es poco específico; lo que pesa es el conjunto (cambio de peso más intolerancia a la temperatura, cambios de piel, pelo o uñas, cansancio). Es motivo de valoración médica.',
        detalle: 'Mecanismo: el hipertiroidismo eleva el metabolismo general; además de pérdida de peso e intolerancia al calor da piel caliente y húmeda, uñas que se despegan, pelo que se rompe y cae, y periartritis crónica del hombro. El hipotiroidismo da intolerancia al frío, cansancio excesivo, somnolencia, cefalea y aumento de peso, con piel seca y pelo y uñas finos y quebradizos; en la mujer, reglas irregulares.\n\nPor qué importa para el ejercicio: la intolerancia al calor de la enfermedad de Graves limita la tolerancia al esfuerzo, y la taquicardia o las arritmias con el ejercicio deben comunicarse al médico.\n\nQué preguntar después: cambios en el cuello (bocio), dificultad para tragar o respirar, ronquera, cambios en la piel, el pelo o las uñas.',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 395–397 y 423.'
        ]
      } },
    { id: 'end_4', text: '¿Nota que sus heridas sanan muy lentamente o le aparecen moretones con excesiva facilidad?', alerta: true, s1: false,
      razonamiento: {
        porque: 'El exceso de cortisol (síndrome de Cushing, o corticoides tomados mucho tiempo) degrada las proteínas del tejido conjuntivo: los capilares se vuelven frágiles y aparecen moratones con golpes mínimos, y las heridas cicatrizan mal. En la diabetes, la peor circulación de la piel también retrasa la cicatrización.',
        peso: 'Orienta a un origen endocrino si va con otros signos (cara redonda, abdomen prominente con estrías, debilidad, diabetes, corticoides). Los moratones fáciles tienen también causas hematológicas y farmacológicas (anticoagulantes, aspirina, AINE): esta pregunta se cruza con la de sangrado del sistema hematológico.',
        detalle: 'Mecanismo: la producción excesiva de cortisol crea un estado catabólico: se liberan aminoácidos del músculo y del tejido elástico, y el resultado es mala cicatrización, debilidad muscular generalizada, abdomen prominente y osteoporosis. El cortisol también suprime la respuesta inflamatoria y puede enmascarar los primeros signos de una infección. En la diabetes no controlada, los cortes y moratones tardan en curar, y la menor circulación cutánea retrasa más la cicatrización.\n\nCon qué se confunde: los moratones por falta de plaquetas o por fármacos que alteran la coagulación (ver el sistema hematológico).\n\nQué buscar con un SÍ: uso de corticoides, diabetes conocida, signos de Cushing (cara de luna llena, joroba de búfalo, estrías, hipertensión) y fiebre sin explicación.',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 392, 402–403 y 423.'
        ]
      } },
    { id: 'end_5', text: '(Si tiene diabetes) ¿Suele tener episodios de bajadas de azúcar, o siente ardor, entumecimiento o pérdida de sensibilidad en manos y pies?', alerta: true, s1: false,
      razonamiento: {
        porque: 'En la persona con diabetes, el ejercicio consume glucosa y puede provocar una bajada (hipoglucemia), sobre todo si coincide con el pico de la insulina. Y la glucosa alta mantenida daña los nervios: la neuropatía diabética empieza como ardor, entumecimiento o pérdida de sensibilidad en los pies.',
        peso: 'No es una bandera roja de patología oculta, sino un dato de seguridad para la sesión: con hipoglucemias frecuentes hay que planificar el ejercicio (horario, glucosa a mano) y comunicar los episodios al médico; con neuropatía, tenerla en cuenta al explorar la sensibilidad y los reflejos.',
        detalle: 'Hipoglucemia: aparece durante o después del ejercicio cuando el músculo consume glucosa y la insulina circulante es alta. Los betabloqueantes pueden enmascarar sus síntomas, y puede ocurrir de noche, con solo pesadillas, sudoración o cefalea. Cualquier episodio, o sospecha, se trata enseguida con azúcar de absorción rápida y se comunica al médico.\n\nNeuropatía: es la complicación crónica más frecuente de la diabetes de larga evolución. La polineuropatía distal simétrica da ardor y entumecimiento en los pies y puede llegar a debilidad, atrofia y pie caído; el túnel carpiano también es frecuente. La afectación autonómica altera la frecuencia cardiaca, la tensión arterial, la sudoración y la vejiga.\n\nQué preguntar después (Goodman): tipo y horario de la insulina, si lleva azúcar encima y dónde, si ha tenido cetoacidosis, si se mide la glucosa y si la mantiene en rango.',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 404, 408–409 y 423.'
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
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213 y 218–221.'
        ]
      } },
    { id: 'hem_2', text: '¿Experimenta falta de aire, palpitaciones o dolor en el pecho con esfuerzos leves (subir escaleras) o en reposo?', alerta: true, s1: false,
      razonamiento: {
        porque: 'En la anemia la sangre transporta menos oxígeno: el corazón compensa latiendo más deprisa y aparecen falta de aire, palpitaciones y, en los casos graves, dolor torácico con esfuerzos mínimos o en reposo.',
        peso: 'Muchas personas tienen una anemia moderada o grave sin estos síntomas, así que un NO no la descarta. Un SÍ con dolor torácico, sobre todo en reposo, exige valoración médica. El ejercicio en la anemia se progresa con cautela y con visto bueno médico.',
        detalle: 'Mecanismo: la anemia reduce la capacidad de la sangre para llevar oxígeno; el gasto cardiaco en reposo suele ser normal, pero sube con el ejercicio más que en una persona sin anemia. Al agravarse, la tolerancia al esfuerzo cae hasta que aparecen disnea, taquicardia y palpitaciones en reposo. Puede bajar la tensión diastólica y subir el pulso en reposo. Una persona joven tolera una anemia que se instaura poco a poco y puede no notar nada hasta que la hemoglobina cae a la mitad; la anemia brusca da síntomas enseguida.\n\nCausas que ve el fisioterapeuta: pérdida crónica de sangre digestiva por AINE (anemia ferropénica), enfermedades crónicas o inflamatorias, anemia perniciosa (con síntomas neurológicos) y cáncer o quimioterapia.\n\nCómo preguntar: muchos pacientes no dicen que se ahogan porque han dejado de hacer lo que les ahoga (ya no suben escaleras, no terminan la compra de una vez). Preguntar qué han dejado de hacer por falta de energía o de aire. Mirar palidez de palmas, lechos ungueales y mucosas.',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213–215, 220 y 221.'
        ]
      } },
    { id: 'hem_3', text: '¿Padece infecciones recurrentes o fiebre baja frecuente (resfriados, gripe, infecciones respiratorias)?', alerta: true, s1: false,
      razonamiento: {
        porque: 'Los leucocitos defienden frente a la infección. Si bajan (leucopenia, típica tras quimioterapia o radioterapia, en infecciones graves o en enfermedades autoinmunes), aparecen infecciones de repetición y fiebre.',
        peso: 'Los catarros frecuentes son inespecíficos. Pesa en quien está inmunodeprimido (quimioterapia reciente, corticoides, inmunosupresores): ahí la fiebre, los escalofríos o los sudores piden derivación médica inmediata.',
        detalle: 'Mecanismo: la leucopenia aparece en el fallo de la médula ósea tras quimioterapia o radioterapia, en infecciones graves, en déficits nutricionales y en enfermedades autoinmunes. El punto más bajo (nadir) suele llegar 7–14 días después de la quimioterapia o la radioterapia: es cuando más riesgo hay de infecciones oportunistas.\n\nSignos de leucopenia: dolor de garganta, tos, fiebre alta, escalofríos y sudoración, úlceras en las mucosas, micción frecuente o dolorosa e infecciones persistentes.\n\nQué hacer con un SÍ: preguntar por tratamientos oncológicos o inmunosupresores y conocer el último recuento de leucocitos si lo hay. Extremar la higiene de manos en la consulta.',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213, 217–218 y 221.'
        ]
      } },
    { id: 'hem_4', text: '¿Ha notado heces negras/alquitranadas, sangre en orina, o ha tosido o vomitado sangre?', alerta: true, s1: false,
      razonamiento: {
        porque: 'La sangre en las heces, la orina, el vómito o la tos puede ser el primer signo de un trastorno de la coagulación (falta de plaquetas, hemofilia, anticoagulantes) o de un sangrado digestivo por AINE. Las heces negras y pegajosas (melena) indican sangre digerida, del tubo digestivo alto.',
        peso: 'Cualquiera de estos sangrados requiere valoración médica, y Goodman los señala como posibles indicadores críticos de un trastorno de la coagulación que puede ser grave. En una persona con hemofilia, toser sangre no es normal y se comunica al médico de inmediato.',
        detalle: 'Mecanismo: el uso crónico de corticoides o AINE causa gastritis y úlcera, con sangrado digestivo y anemia ferropénica. La trombocitopenia sangra por los vasos pequeños de la piel y las mucosas (nariz, útero, tubo digestivo, vías urinarias y respiratorias). En la hemofilia, el sangrado digestivo da dolor y distensión abdominal, melena y vómitos con sangre.\n\nCon qué se confunde: las heces rojizas pueden deberse a la remolacha o a colorantes, y el bismuto ennegrece las heces y la lengua; la sangre roja brillante suele ser rectal o anal (hemorroides, fisuras), pero también puede ser un cáncer colorrectal. Lo distingue el médico.\n\nQué preguntar: fármacos (AINE, aspirina, anticoagulantes, corticoides), quimioterapia o radioterapia previas, y otros sangrados (nariz, encías, reglas abundantes, moratones).',
        fuentes: ['Goodman 2018'],
        citas: [
          'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213, 219–221; cap. 8, p. 306.'
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
