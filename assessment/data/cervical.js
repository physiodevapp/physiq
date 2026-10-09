// ============================================================
// PhysiQ-Assessment · data/cervical.js
// Contenido clínico de la región CERVICAL: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_POSQUIRURGICO, SIS_ENDOCRINO, SIS_HEMATOLOGICO, DOSIS_DERIVAR } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.cervical
export const screening = {
  label: 'Cabeza, Cuello y Espalda',
  // Recuadro de urgencia: literal de la tarjeta de consulta cervical (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS HOY · disfunción arterial · lesión tras traumatismo · cefalea con signos de alarma',
    lineas: [
      'Disección arterial (<55 a): cefalea o dolor cervical súbito, DESCONOCIDO PARA EL PACIENTE, moderado o grave y a menudo progresivo. Alteración del equilibrio o la marcha, Horner, déficit de pares craneales. Puede imitar una cefalea cervicogénica.',
      'Insuficiencia vertebrobasilar (suele ser >65 a, posible en jóvenes) · 5 D y 3 N: mareo o inestabilidad, diplopía o pérdida de campo visual, disartria o disfasia, disfagia o ronquera, caídas súbitas sin pérdida de conciencia; nistagmo espontáneo, náuseas o vómitos, entumecimiento peribucal.',
      'Fractura, subluxación o luxación: traumatismo importante en persona mayor o mecanismo peligroso (flexión con compresión en deporte de colisión). Se sujeta la cabeza, espasmo defensivo, movilidad muy limitada, posibles signos neurológicos. Incluye la inestabilidad cervical alta traumática.',
      'Cefalea con signos de alarma: cambio súbito de calidad, intensidad o frecuencia; síntomas neurológicos nuevos; inicio súbito y grave; fiebre u otros síntomas sistémicos.'
    ]
  },
  sistemas: [
    SIS_POSQUIRURGICO,   // solo con mecanismo Post-quirúrgico (docs/posquirurgico.md)
    {
      id: 'cv_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Antecedentes de cáncer o tratamiento oncológico',
        'Edad >50 años con inicio insidioso',
        'Dolor nocturno constante e intenso que despierta al paciente',
        'Fracaso del tratamiento conservador tras 1 mes sin mejoría',
        'Pérdida de peso inexplicada (>5 % del peso en 6 meses)',
        'Ganglios linfáticos duros, fijos e indoloros',
        // Tarjeta cervical (guía de consulta), BANDERAS «Tumor vertebral»
        'Tumor vertebral (benigno, maligno o metástasis): dolor cervical incesante que no cambia con postura, movimiento ni reposo; dolor nocturno frecuente; rigidez y pérdida de movilidad posibles; debilidad o entumecimiento si comprime médula o raíces. Malestar general: febrícula, sudor nocturno, cansancio, inapetencia'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv4', text: '¿Alguna vez ha tenido cáncer de algún tipo, o ha recibido quimioterapia, terapia hormonal o radioterapia?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Un cáncer previo puede volver como metástasis ósea, y la columna es la diana más frecuente del esqueleto; la cervical recibe en torno al 10 % de las metástasis vertebrales. Por eso cuentan también la quimio, la radio o la hormonoterapia previas aunque el paciente diga que no ha tenido «cáncer».',
            peso: 'Es la bandera roja de malignidad que más pesa, aunque las cifras vienen de la lumbalgia: en el cuello no hay estudios de precisión y las guías la recomiendan por razonamiento, sin datos propios. Un SÍ no diagnostica: obliga a explorar el resto (dolor que no cambia con la postura, dolor nocturno, pérdida de peso, signos neurológicos). Y un NO no tranquiliza del todo: en torno al 25 % de las compresiones medulares metastásicas aparecen sin cáncer conocido.',
            detalle: 'Mecanismo: las células tumorales llegan al hueso sobre todo por la sangre, y la columna es la localización más frecuente. Se reparten según el volumen de hueso: unas 7 de cada 10 en la torácica, 2 en la lumbar y 1 en la cervical. Goodman insiste en que un antecedente de cáncer, aunque sea antiguo, es una bandera roja ante un dolor de cabeza o de nuca de comienzo insidioso, y en que los cánceres de cabeza y cuello recidivan con frecuencia en los 3 primeros años.\n\nCuánto pesa (datos de la lumbalgia): en la columna lumbar, el antecedente de cáncer es la bandera roja más informativa (LR+ agrupado de 23,7; edad > 50 años, pérdida de peso inexplicada o no mejorar en un mes rondan un LR+ de 3). Según StatPearls, es la única bandera roja bien validada de compresión medular metastásica. En el cuello, la revisión de guías de Feller (2024) encuentra que todas las que hablan de cáncer recomiendan preguntar por él, pero sin datos de precisión propios.\n\nQué tipo de cáncer (Finucane 2020): los que más metastatizan en el hueso son mama, próstata, pulmón, riñón y tiroides; aproximadamente el 30 % de quienes tienen uno de ellos acaba teniendo metástasis. En el cáncer de mama, la mitad aparece en los 5 primeros años y la otra mitad 10 años o más después: un cáncer «antiguo» sigue contando.\n\nQué hacer con un SÍ: completar las demás banderas rojas y la exploración neurológica (fuerza, sensibilidad, reflejos, marcha), y palpar los ganglios del cuello y supraclaviculares: los duros, fijos e indoloros son sospechosos. Goodman indica derivar si al antecedente de cáncer se suman pérdida de peso inexplicada y falta de mejoría tras un mes de tratamiento conservador.',
            fisiologia: {
              pasos: [
                'Las células tumorales se sueltan del cáncer primario y viajan sobre todo por la sangre, en especial por las venas: la mama y el pulmón drenan al plexo de Batson en la zona torácica, y la próstata, por el plexo pélvico, a la columna lumbosacra y la pelvis.',
                'La médula ósea es un «terreno» receptivo (hipótesis de la semilla y el terreno): receptores de la célula tumoral, como CXCR4 o RANKL, interactúan con las células del estroma de la médula y de la matriz ósea.',
                'Esa interacción libera factores de crecimiento, citoquinas (IL-6, IL-8) y factores que forman vasos (VEGF): el tumor crece y se activan los osteoclastos, que destruyen hueso.',
                'Al romperse la arquitectura del hueso aparecen dolor sordo y profundo que empeora de noche, fracturas con cargas mínimas y, si la vértebra colapsa o el tumor invade el canal, compresión de raíces o de la médula.',
                'La compresión medular empieza casi siempre con dolor; la debilidad es el segundo síntoma y los problemas de vejiga e intestino llegan tarde. Por eso se busca antes de que aparezcan.'
              ],
              metafora: 'Como semillas que llegan a un jardín muy regado: prenden en la médula ósea y, para hacerse sitio, ponen a trabajar a los demoledores del propio hueso, los osteoclastos, que lo van vaciando por dentro.'
            },
            fuentes: ['Goodman 2018', 'Finucane 2020', 'Feller 2024', 'Jayarangaiah 2023', 'Singleton y Hefner 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 463–464 y 475; cap. 14, pp. 529 y 540–542.',
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 4 (malignidad), pp. 34–36.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartados «Red flags» y «Level of evidence».', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11618059/' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' },
              { texto: 'Singleton y Hefner 2023 — Singleton y Hefner, «Spinal Cord Compression», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de febrero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557604/' }
            ]
          } },
        { id: 'cv1', text: '¿El dolor lo despierta por la noche desde un sueño profundo y le resulta imposible encontrar una posición que lo alivie?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El tumor crece a costa del riego del tejido que lo rodea y le provoca isquemia: el dolor no depende de la carga ni de la postura, despierta de un sueño profundo y no deja volver a dormir. El dolor mecánico, en cambio, suele ceder al cambiar de posición.',
            peso: 'Poco específico por sí solo: mucha gente con dolor de cuello o espalda tiene dolor nocturno. Preocupa quien no consigue volver a dormirse por la intensidad del dolor y tiene que levantarse, caminar o dormir en un sillón, más que quien se duerme de nuevo tras cambiar de postura. Pesa de verdad junto a un antecedente de cáncer, síntomas generales o signos neurológicos.',
            detalle: 'Mecanismo: los tumores están muy vascularizados a costa del tejido huésped, que queda isquémico. El resultado es un dolor de reposo, sobre todo nocturno, constante e intenso (a menudo 7 o más sobre 10), que no se alivia al cambiar de postura. El dolor óseo nocturno es el más sospechoso, sobre todo con antecedente de cáncer.\n\nCon qué se confunde: quien nota más dolor al acostarse, sin haberse dormido todavía, puede estar simplemente sin distracciones por primera vez en el día. También despiertan de noche la úlcera duodenal (entre la medianoche y las 3, y comer la alivia), la infección vertebral (el dolor es más intenso de noche y no cede con el reposo) y el dolor inflamatorio. No todas las personas con cáncer tienen dolor nocturno.\n\nQué preguntar después: cómo es el patrón nocturno, qué tiene que hacer para volver a dormirse, si el dolor depende de la postura, qué pasa al incorporarse (si mejora sentado, pensar en una causa cardiopulmonar), si la aspirina lo alivia de forma desproporcionada y si comer cambia el dolor. El marco IFOMPT (Finucane 2020) clasifica como de alta sospecha a quien tiene que levantarse, caminar o dormir sentado con poco alivio.',
            fisiologia: {
              pasos: [
                'Para crecer, el tumor necesita riego: libera factores que forman vasos (VEGF) y se vasculariza a costa del tejido que lo rodea, que queda isquémico.',
                'En el hueso, además, el tumor activa a los osteoclastos, que destruyen hueso y deshacen su arquitectura.',
                'El dolor que resulta no depende de la carga ni de la postura: es sordo, profundo, de comienzo gradual y peor de noche, y no cede al cambiar de posición.',
                'Si el tumor llega al canal y comprime la médula, el dolor es constante, empeora de noche y con la tos o el estornudo, y puede despertar sin dejar volver a dormir.'
              ],
              nota: 'Ninguna de las fuentes leídas explica por qué el dolor tumoral es peor de noche que de día: lo describen como rasgo clínico.',
              metafora: 'Como un vecino que se engancha a tu red eléctrica: el tumor se lleva la sangre del tejido de alrededor, que se queda sin suministro y duele aunque no se mueva nada.'
            },
            fuentes: ['Goodman 2018', 'Finucane 2020', 'Jayarangaiah 2023', 'Singleton y Hefner 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, «Night pain», p. 119; cap. 8, p. 307; cap. 13, pp. 476 y 483; cap. 14, pp. 525 y 562.',
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 4.2, «Night pain», p. 37.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' },
              { texto: 'Singleton y Hefner 2023 — Singleton y Hefner, «Spinal Cord Compression», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de febrero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557604/' }
            ]
          } },
        { id: 'cv5', text: '¿Ha notado pérdida de peso reciente, rápida y sin proponérselo?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Un tumor, una infección crónica u otra enfermedad inflamatoria liberan citoquinas que aceleran el gasto de energía, destruyen músculo y grasa y quitan el apetito (caquexia). Por eso se adelgaza sin hacer dieta: es una señal de enfermedad general, no del cuello.',
            peso: 'Cuenta la pérdida de más del 5 % del peso en 6 meses sin causa que la explique; el marco IFOMPT considera de alta sospecha un 5–10 % en 3–6 meses. Aislada pesa poco (en la lumbalgia, LR+ en torno a 3) y tiene otras causas (dieta, ejercicio, medicación, hipertiroidismo, diabetes): pesa con antecedente de cáncer, dolor nocturno o fiebre.',
            detalle: 'Mecanismo: en la caquexia, el tumor y las células inmunitarias del propio paciente producen citoquinas proinflamatorias (TNF-α, IL-6, IL-1β) que aumentan el gasto de energía en reposo, degradan las proteínas del músculo, movilizan la grasa e inflaman el hipotálamo, que es el que regula el apetito. Las células tumorales, además, consumen mucha glucosa. El resultado es una pérdida de peso que no se corrige comiendo más. Es más frecuente en los cánceres digestivos, de páncreas y de pulmón, pero también aparece en la insuficiencia cardiaca, la EPOC, la insuficiencia renal y las infecciones crónicas (tuberculosis, VIH).\n\nCuánto: el criterio actual de caquexia es perder más del 5 % del peso en 6 meses (más del 2 % si ya hay poca masa muscular o un IMC < 20). Goodman, en su edición de 2018, daba como signo de alarma precoz del cáncer un 10 % en 2 semanas; prevalece el criterio más reciente.\n\nCuánto pesa (datos de la lumbalgia): LR+ de 2,7 para cáncer, y una probabilidad posprueba por debajo del 3 % cuando aparece sola. Las guías de dolor de cuello que hablan de cáncer la incluyen todas como bandera roja, pero sin datos propios (Feller 2024).\n\nQué preguntar con un SÍ: cuánto peso y en cuánto tiempo, si sabe por qué (cambios de dieta, ejercicio, medicación), si se llena enseguida al comer, y si hay sudores nocturnos, fiebre o cansancio desproporcionado.',
            fisiologia: {
              pasos: [
                'El tumor y las células inmunitarias del paciente liberan citoquinas proinflamatorias: TNF-α, IL-6 e IL-1β.',
                'Esas citoquinas aumentan el gasto de energía en reposo y activan en el músculo un factor de transcripción (NF-κB) que acelera la degradación de proteínas sin aumentar su síntesis; la grasa también se moviliza.',
                'Las células tumorales consumen grandes cantidades de glucosa y producen lactato, que el hígado vuelve a convertir en glucosa con un coste de energía para el paciente.',
                'Las citoquinas inflaman el hipotálamo, que regula el apetito: la persona come menos y se sacia antes.',
                'Resultado: se pierde músculo y grasa aunque se coma lo mismo o más, con cansancio y menos fuerza.'
              ],
              metafora: 'Como una casa con una estufa que nadie apaga: el tumor quema la leña de reserva (músculo y grasa) aunque se siga trayendo comida, y encima quita las ganas de traerla.'
            },
            fuentes: ['Goodman 2018', 'Finucane 2020', 'Feller 2024', 'Daley 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, p. 475; cap. 14, pp. 523, 527 y 540–542.',
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 4.2, «Unexplained weight loss», p. 39.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartado «Agreement in red flags recommendations».', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11618059/' },
              { texto: 'Daley 2025 — Daley, Ali, Ohnuma y Adigun, «Anorexia and Cachexia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430977/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Columna cervical (10%)', desc: 'Metástasis — menos frecuente que torácica o lumbar' },
        { zona: 'Columna torácica (60%)', desc: 'Localización más frecuente de metástasis vertebrales' },
        { zona: 'Extremidades (radicular)', desc: 'Compresión medular → parestesias, debilidad distal' }
      ],
      impactoDescanso: [
        'Dolor nocturno que despierta al paciente, no cede, tipo "taladro" — alerta oncológica principal',
        'Sudoraciones masivas y fiebres fragmentan el descanso'
      ],
      impactoEjercicio: [
        'Fatiga extrema sin relación con el nivel de actividad, no se alivia con descanso',
        'Anemia post-quimio: disnea, taquicardia y mareos con mínimo esfuerzo'
      ]
    },
    {
      id: 'cv_cardio', icon: '❤️', nombre: 'Cardiovascular',
      banderasRojas: [
        'Dolor de cuello/mandíbula acompañado de sudores, náuseas u opresión torácica',
        'Síncope repentino sin mareo previo',
        'Angina no aliviada por reposo (>20 min)',
        // Tarjeta cervical (guía de consulta), BANDERAS «Cardiaco»
        'Cardiaco: dolor cervical, habitualmente anterior. No se relaciona con movimientos ni posturas del cuello'
      ],
      banderasAmarillas: [
        'Dolor de espalda que empeora con esfuerzo físico de piernas'
      ],
      preguntas: [
        { id: 'cv2', text: '¿Tiene síntomas como sudores, náuseas, o dolor en el pecho/mandíbula al mismo tiempo que el dolor de cuello/espalda?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El corazón refiere su dolor a la piel y al músculo de los segmentos medulares que comparten su inervación: por eso un infarto o una angina pueden doler en el cuello, la mandíbula, el hombro o la espalda. El sudor, las náuseas o la opresión en el pecho a la vez delatan el origen cardiaco.',
            peso: 'Es una bandera roja seria: dolor de cuello o mandíbula con sudor frío, náuseas u opresión torácica no es mecánico mientras no se demuestre lo contrario. Si está pasando ahora y dura 10 minutos o más, o no cede con reposo, es una urgencia médica. En mujeres, mayores y diabéticos el cuadro puede ser atípico: solo cansancio, falta de aire o dolor epigástrico.',
            detalle: 'Mecanismo: el dolor cardiaco no se siente en el corazón sino en las zonas que comparten segmento medular con él. La isquemia libera adenosina, bradicinina y lactato, que estimulan los nociceptores del corazón; esas señales viajan por aferentes simpáticos a los segmentos C7–T4 y se perciben como dolor retroesternal que puede irradiar al brazo, al cuello o a la mandíbula. El dolor en la mandíbula llega por conexiones entre las astas posteriores de la médula cervical y el núcleo espinal del trigémino. A veces el infarto solo duele en la mandíbula, la parte alta del cuello o la espalda, sin dolor en el pecho.\n\nEn el cuello (Lluch 2020): el dolor de origen cardiaco suele ser anterior y no se relaciona con los movimientos ni las posturas del cuello.\n\nCómo se presenta: presión o pesadez retroesternal, a menudo en banda, de 10 minutos o más, que irradia a la mandíbula, el cuello, un hombro o el brazo izquierdo, con falta de aire, sudor, náuseas o mareo. En las mujeres pueden dominar el cansancio y la debilidad intensos y episódicos, a veces con síntomas previos hasta un mes antes del infarto.\n\nCon qué se confunde: el dolor pleurítico, el que se reproduce al palpar y los pinchazos de segundos no son típicos de isquemia, aunque no la descartan. El dolor de cuello mecánico cambia con los movimientos del cuello; el cardiaco, no.\n\nQué hacer con un SÍ: tomar constantes (tensión, frecuencia, saturación), preguntar por factores de riesgo (tabaco, hipertensión, diabetes, colesterol, antecedentes familiares) y, si el cuadro está activo, no seguir con la sesión y derivar de forma urgente.',
            fisiologia: {
              pasos: [
                'Una placa de ateroma estrecha una arteria coronaria o se rompe y forma un trombo: el músculo del corazón recibe menos oxígeno del que necesita (isquemia).',
                'La isquemia libera adenosina, bradicinina y lactato, que activan los nociceptores del corazón (fibras C).',
                'Esas señales viajan por fibras aferentes que acompañan a los nervios simpáticos y entran en la médula por los segmentos C7–T4.',
                'En el asta dorsal convergen en la misma vía ascendente que las fibras de la piel y el músculo de esos segmentos: el cerebro no distingue el origen y atribuye el dolor al pecho, el brazo, el cuello o la mandíbula. Es el dolor referido.',
                'La isquemia activa además el sistema nervioso autónomo: de ahí el sudor, las náuseas y la palidez que acompañan al dolor.'
              ],
              metafora: 'Como un detector de humo conectado a la centralita equivocada: la alarma salta en el corazón, pero la señal llega por la misma línea que el cuello o la mandíbula y el cerebro cree que el incendio está ahí.'
            },
            fuentes: ['Goodman 2018', 'Gillen 2026', 'Jain 2026', 'Sanvictores 2023', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 92; cap. 6, pp. 226 y 233–236; cap. 14, pp. 542–543.',
              { texto: 'Gillen 2026 — Gillen, Shams y Goyal, «Stable Angina», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK559016/' },
              { texto: 'Jain 2026 — Jain, Singh, Shah y Grossman, «Acute Coronary Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de julio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459157/' },
              { texto: 'Sanvictores 2023 — Sanvictores, Jozsa y Tadi, «Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560843/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 383.'
            ]
          } },
        { id: 'cv_c2', text: '¿El dolor de espalda o cuello empeora al subir escaleras o hacer esfuerzo físico general (no al mover el cuello)?', alerta: true,
          razonamiento: {
            porque: 'Si el dolor aparece con el esfuerzo general (subir escaleras, caminar deprisa, trabajar con los brazos en alto) y no con los movimientos del cuello, la carga no está en el cuello sino en el corazón: es el patrón de la angina, que se refiere al cuello y la mandíbula.',
            peso: 'Un SÍ pide descartar una angina: tomar constantes, preguntar por factores de riesgo cardiovascular y derivar al médico si el patrón se confirma. Pesa más si es reciente o va a más, si se acompaña de falta de aire, sudor o náuseas desproporcionados al esfuerzo, y en mayores o con factores de riesgo. Un dolor de cuello con movilidad y fuerza normales ya es, según Goodman, una señal de precaución.',
            detalle: 'Mecanismo: una placa de ateroma fija limita cuánto puede aumentar el flujo coronario. En reposo basta; con el esfuerzo, el corazón pide más oxígeno (sube la frecuencia, la tensión y la contractilidad) y la arteria estrecha no puede dárselo: aparece una isquemia transitoria, con dolor referido que cede al parar. Por eso el patrón típico es dolor con el esfuerzo que se alivia con el reposo o la nitroglicerina en 2–5 minutos. Goodman describe un desfase de 3 a 5 minutos entre el aumento de actividad y el inicio del dolor, y señala que trabajar con los brazos por encima de la cabeza exige más oxígeno al corazón que hacer el mismo trabajo con las piernas.\n\nEquivalentes de la angina: falta de aire, náuseas o cansancio desproporcionados al esfuerzo, a veces sin dolor. La angina puede doler solo en el cuello o la mandíbula (sobre todo en mujeres posmenopáusicas) y confundirse con un problema de la articulación temporomandibular: el dolor que viene y va con la actividad o el estrés orienta a angina; el constante, peor al despertar, a bruxismo.\n\nOtras causas del mismo patrón: anemia grave, taquiarritmias, hipertensión o estenosis aórtica pueden provocar isquemia de esfuerzo con coronarias normales.\n\nCómo diferenciarlo: la postura y los movimientos de la columna no cambian el dolor cardiaco. Si el dolor de cuello aparece al subir escaleras con el cuello quieto y desaparece al pararse, la fuente probable no es el cuello.',
            fisiologia: {
              pasos: [
                'Una placa de ateroma estrecha la arteria coronaria: en reposo el flujo basta, pero no puede aumentar lo suficiente cuando el corazón trabaja más.',
                'Con el esfuerzo suben la frecuencia cardiaca, la tensión y la contractilidad, y con ellas la demanda de oxígeno del músculo del corazón.',
                'Cuando la demanda supera al aporte aparece una isquemia transitoria, que libera adenosina, bradicinina y lactato y activa los nociceptores cardiacos.',
                'La señal entra en la médula por los segmentos C7–T4 y se refiere al pecho, el brazo, el cuello o la mandíbula.',
                'Al parar baja la demanda, se recupera el equilibrio y el dolor cede en pocos minutos: por eso depende del esfuerzo y no del movimiento del cuello.'
              ],
              metafora: 'Como una tubería estrecha que basta para un grifo pero no para la ducha a tope: mientras el corazón pide poco no pasa nada; cuando pide más, falta agua y salta la alarma.'
            },
            fuentes: ['Goodman 2018', 'Gillen 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226 y 234–236; cap. 14, pp. 537, 543 y 567.',
              { texto: 'Gillen 2026 — Gillen, Shams y Goyal, «Stable Angina», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK559016/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'IAM / Angina', desc: 'Retroesternal → zona interescapular, mandíbula, brazo izquierdo' },
        { zona: 'Aneurisma aórtico', desc: 'Zona interescapular desgarradora → abdomen, flanco izquierdo' }
      ],
      impactoDescanso: [
        'Disnea paroxística nocturna — despierta con sensación de asfixia',
        'Angina nocturna interrumpe el sueño'
      ],
      impactoEjercicio: [
        'Isquemia miocárdica limita el ejercicio severamente',
        'Fatiga profunda e inesperada con esfuerzo leve indica gasto cardíaco inadecuado'
      ]
    },
    {
      id: 'cv_pulmonar', icon: '🫁', nombre: 'Pulmonar',
      banderasRojas: [
        'Dolor de cuello/hombro que empeora al toser, respirar profundamente o reír',
        'Hemoptisis, tos persistente, disnea en reposo',
        'Fiebre y sudores nocturnos (neumonía, tuberculosis)'
      ],
      banderasAmarillas: [
        'Tabaquismo prolongado',
        'Antecedente de cáncer con potencial de metástasis pulmonar'
      ],
      preguntas: [
        { id: 'cv_p1', text: '¿El dolor de cuello o espalda empeora al toser, reír, estornudar o respirar profundo?', alerta: true,
          razonamiento: {
            porque: 'Si el dolor aumenta con la tos, la risa, el estornudo o la respiración profunda, algo que se mueve o se presuriza al respirar está irritado. Puede ser la pleura (que refiere dolor al cuello y al hombro por el nervio frénico), pero también la duramadre, el disco, los músculos o las costillas.',
            peso: 'Poco específico por sí solo: el dolor de origen pleural, intercostal, muscular, costal o dural aumenta igual con la tos o la inspiración profunda; lo único que esto descarta es un origen cardiaco. Pesa si se acompaña de falta de aire, tos persistente, fiebre, sangre al toser o malestar general, si el paciente se alivia tumbado sobre el lado que duele, o si hay antecedente de cáncer.',
            detalle: 'Mecanismo pleural: la pleura visceral, que cubre el pulmón, no tiene receptores de dolor; la parietal sí. Una enfermedad del pulmón puede no doler hasta que llega a la pleura parietal. La parte central del diafragma está inervada por el nervio frénico (C3–C5), así que su irritación refiere dolor al cuello, al trapecio superior y al hombro del mismo lado. El dolor pleural es agudo, localizado y empeora con cualquier movimiento respiratorio; muchas personas se alivian tumbadas sobre el lado afectado o apretándolo (autoferulización), algo raro en un problema musculoesquelético.\n\nCausas pulmonares: pleuritis por virus, neumonía, embolia pulmonar (la causa grave más frecuente de dolor pleurítico), neumotórax o un tumor que invade la pleura. La irritación de la tráquea y los bronquios grandes también refiere dolor al cuello. El tumor de Pancoast, en el vértice del pulmón, puede invadir el plexo braquial (dolor C8–T1) y dar síndrome de Horner.\n\nOtras causas del mismo patrón: el dolor de origen dural y la compresión medular por un tumor empeoran con las maniobras de Valsalva (toser, estornudar); una tos fuerte y repetida puede desgarrar un intercostal, que se palpa.\n\nQué hacer con un SÍ: tomar constantes (frecuencia respiratoria, saturación, temperatura), auscultar si se sabe hacer y preguntar por tos, falta de aire, fiebre, tabaco, infecciones respiratorias recientes y antecedente de cáncer.',
            fisiologia: {
              pasos: [
                'Dos hojas de pleura recubren el pulmón y la pared del tórax; entre ellas, unos mililitros de líquido las dejan deslizarse al respirar.',
                'La pleura visceral (la del pulmón) no tiene receptores de dolor; la parietal, sí: la inervan los nervios intercostales en la periferia y el frénico en la parte central del diafragma.',
                'Si la pleura se inflama (por una infección, una embolia o un tumor), los mediadores inflamatorios activan esos receptores y las hojas rozan entre sí.',
                'Cada inspiración, tos o estornudo estira la pleura inflamada: el dolor es agudo y sigue al ritmo de la respiración.',
                'Como el frénico entra en la médula por C3–C5, la irritación del diafragma central se refiere al cuello y al hombro del mismo lado.'
              ],
              metafora: 'Como dos cristales que deberían deslizarse con una capa de agua: si se ensucian, cada respiración los hace rozar y chirría donde llega el cable que los vigila, en el cuello y el hombro.'
            },
            fuentes: ['Goodman 2018', 'Hunter 2024', 'Singleton y Hefner 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 92; cap. 7, pp. 272–275; cap. 13, p. 483; cap. 14, pp. 548–550.',
              { texto: 'Hunter 2024 — Hunter, Goldin y Regunath, «Pleurisy», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de noviembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK558958/' },
              { texto: 'Singleton y Hefner 2023 — Singleton y Hefner, «Spinal Cord Compression», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de febrero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557604/' }
            ]
          } },
        { id: 'cv_p2', text: '¿Siente falta de aire en reposo o al acostarse?', alerta: true,
          razonamiento: {
            porque: 'Faltar el aire en reposo, o al tumbarse (ortopnea), indica que el corazón o los pulmones no dan abasto ni sin esfuerzo. La insuficiencia cardiaca es la causa típica de la ortopnea: al tumbarse vuelve más sangre al tórax y el líquido se acumula en el pulmón. Junto a un dolor de cuello u hombro, apunta a un origen cardiopulmonar.',
            peso: 'Siempre merece valoración médica: quien no puede subir un piso sin quedarse muy fatigado, o se despierta por la noche o se ahoga al tumbarse, debe verlo el médico. Es urgente si respira a más de 30 por minuto, tiene más de 120 latidos por minuto, saturación por debajo del 90 %, no puede terminar las frases o tiene los labios morados.',
            detalle: 'Mecanismo cardiaco: cuando el ventrículo izquierdo bombea mal, la sangre se remansa en las venas y capilares del pulmón y el líquido pasa al intersticio y a los alvéolos. El pulmón se vuelve rígido, cuesta más respirar y se activan los receptores J y las fibras C del pulmón, que mandan por el vago la señal de falta de aire. De día, la gravedad desplaza el exceso de líquido a las piernas; al tumbarse, esa sangre vuelve al tórax y la congestión aumenta: es la ortopnea (se mide por el número de almohadas que necesita) y la disnea paroxística nocturna, que despierta al paciente.\n\nMecanismo pulmonar: en decúbito, además, el contenido abdominal empuja el diafragma hacia arriba, aumenta el trabajo respiratorio y reduce la capacidad vital. La disnea suele indicar una enfermedad pulmonar extensa más que focal; la embolia pulmonar es la excepción.\n\nOtras causas: anemia (menos oxígeno transportado), asma, EPOC, neumonía, derrame pleural, obesidad, desacondicionamiento o ansiedad. La disnea que se alivia con una postura (inclinado hacia delante, apoyado en los brazos) o respirando con los labios fruncidos es más probablemente pulmonar que cardiaca.\n\nCuidado al preguntar: quien niega tener falta de aire puede haber reducido su actividad para no tenerla. Preguntar por lo que ha dejado de hacer.',
            fisiologia: {
              pasos: [
                'Cuando el ventrículo izquierdo bombea mal, la presión sube en las venas y los capilares del pulmón.',
                'El líquido sale de los capilares al intersticio y a los alvéolos: el pulmón se congestiona, se vuelve más rígido y cuesta más respirar.',
                'La congestión activa los receptores J y las fibras C del pulmón, que mandan por el nervio vago al tronco del encéfalo una señal de respiración rápida y superficial y de «hambre de aire».',
                'Al tumbarse, la sangre que la gravedad retenía en las piernas vuelve al tórax y el contenido abdominal empuja el diafragma: la congestión y el trabajo respiratorio aumentan y aparece la ortopnea.',
                'Al incorporarse, el líquido vuelve a bajar y la respiración mejora: por eso estas personas duermen con varias almohadas o sentadas.'
              ],
              metafora: 'Como una esponja en un fregadero que desagua mal: de pie el agua se queda abajo, pero al tumbarse la esponja (el pulmón) se empapa y cuesta más exprimirla para respirar.'
            },
            fuentes: ['Goodman 2018', 'Suha 2025', 'Shams 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226–227; cap. 7, pp. 272–274; cap. 14, pp. 549–550.',
              { texto: 'Suha 2025 — Suha, Modi y Sharma, «Dyspnea», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499965/' },
              { texto: 'Shams 2025 — Shams, Malik y Chhabra, «Heart Failure (Congestive Heart Failure)», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430873/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Cuello / Trapecio', desc: 'Irradiación de patología pleural' },
        { zona: 'Hombro ipsilateral', desc: 'Irritación del nervio frénico' }
      ],
      impactoDescanso: ['Tos nocturna y sudores fragmentan el descanso'],
      impactoEjercicio: ['Disnea de esfuerzo restringe drásticamente la tolerancia al ejercicio']
    },
    {
      id: 'cv_renal', icon: '🫘', nombre: 'Renal / Urológico',
      banderasRojas: [
        'Prueba de percusión de Murphy positiva (ángulo costovertebral)',
        'Cambio en control de esfínteres junto con dolor cervical (compresión medular)',
        'Hematuria'
      ],
      banderasAmarillas: [
        'Dolor que no cambia con postura corporal',
        'Fiebre y escalofríos acompañando el dolor de espalda',
        'Cambios en el color u olor de la orina'
      ],
      preguntas: [
        { id: 'cv3', text: '¿Ha notado algún cambio en su control de esfínteres (vejiga o intestino)?', alerta: true, s1: true,
          razonamiento: {
            porque: 'La médula cervical lleva las órdenes del cerebro a la vejiga y al intestino. Si un disco, la artrosis, un tumor o un absceso la comprimen, el control de esfínteres falla. Un cambio en ese control que aparece junto al dolor de cuello apunta a la médula, no a la raíz ni al músculo.',
            peso: 'Es una bandera roja: dolor cervical que aparece a la vez que una incontinencia o una retención pide exploración neurológica y valoración médica. Si es nuevo o va a más, o hay otros signos nuevos (torpeza de manos, marcha inestable), la derivación es urgente. Un NO no descarta una mielopatía: los problemas de vejiga son tardíos y solo los tiene una de cada tres personas con mielopatía.',
            detalle: 'Mecanismo: la mielopatía cervical degenerativa estrecha el canal (disco, osteofitos, ligamento amarillo engrosado) y comprime la médula y sus vasos. La compresión y la isquemia dañan las vías largas: la corticoespinal (fuerza y control voluntario), la espinocerebelosa (propiocepción) y las que bajan a los centros de la micción. Una lesión de la médula por encima del sacro produce un detrusor hiperactivo y, a menudo, una disinergia: la vejiga se contrae mientras el esfínter se cierra. De ahí la urgencia y la incontinencia, o la retención con incontinencia por rebosamiento en los casos graves.\n\nCómo se presenta la mielopatía: parestesias y entumecimiento de las manos (en más del 80 %), marcha inestable o piernas «pesadas» (72 %, a veces antes que las manos), torpeza para abotonarse o escribir, signo de Lhermitte (descarga eléctrica al flexionar el cuello). El dolor de cuello u hombro aparece en la mitad. La urgencia o la retención urinarias afectan al 38 % y el intestino al 23 %, y llegan tarde.\n\nOtras causas del mismo cuadro: compresión medular metastásica (los problemas de esfínteres son un hallazgo tardío), absceso epidural, hematoma epidural (con anticoagulantes o tras una punción), inestabilidad atloaxoidea en la artritis reumatoide.\n\nQué hacer con un SÍ: exploración neurológica que incluya pruebas centrales (Hoffmann, Babinski, reflejos, marcha en tándem). Si ya hay un diagnóstico de hernia cervical, avisar igualmente al médico si la incontinencia es nueva desde su valoración. Goodman contraindica la manipulación cervical en este contexto.',
            fisiologia: {
              pasos: [
                'Los centros de la micción del tronco del encéfalo coordinan la vejiga con su esfínter a través de vías que bajan por la médula cervical y torácica hasta los segmentos sacros (S2–S4).',
                'La artrosis, un disco, un tumor o un absceso estrechan el canal cervical y comprimen la médula y sus vasos: el tejido nervioso sufre por la presión y por falta de riego.',
                'Se dañan las vías largas: la que lleva el control voluntario (corticoespinal) y la que informa de la posición (espinocerebelosa). Por eso la mielopatía da torpeza de manos y marcha inestable.',
                'Al cortarse la conexión entre el tronco del encéfalo y el sacro, la vejiga se contrae de forma refleja y el esfínter se cierra a la vez (disinergia): urgencia, incontinencia o dificultad para vaciar.',
                'Los esfínteres suelen fallar tarde: cuando aparecen, la compresión ya es importante.'
              ],
              metafora: 'Como un cable de mando pinzado entre el cuadro de control y la máquina: las órdenes llegan a destiempo o no llegan, y la vejiga y su esfínter dejan de ir coordinados.'
            },
            fuentes: ['Goodman 2018', 'Feller 2024', 'Margetis y Donnally 2025', 'Leslie 2023', 'Singleton y Hefner 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 372–373 y 376; cap. 13, p. 483; cap. 14, pp. 531, 542 y 568.',
              { texto: 'Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartado «Implication for practice».', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11618059/' },
              { texto: 'Margetis y Donnally 2025 — Margetis y Donnally, «Cervical Myelopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482312/' },
              { texto: 'Leslie 2023 — Leslie, Tadi y Tayyeb, «Neurogenic Bladder and Neurogenic Lower Urinary Tract Dysfunction», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560617/' },
              { texto: 'Singleton y Hefner 2023 — Singleton y Hefner, «Spinal Cord Compression», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de febrero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557604/' }
            ]
          } },
        { id: 'cv_r2', text: '¿Ha notado cambios en la orina (color, olor, cantidad) o dificultad para orinar?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El riñón y la vejiga no refieren dolor al cuello, así que esta pregunta no busca un dolor referido. La dificultad para orinar puede ser un signo de compresión de la médula cervical; la orina turbia, maloliente o con escozor, de una infección urinaria, que puede llegar por la sangre a la columna.',
            peso: 'Aislado pesa poco: los cambios de la orina tienen muchas causas, la mayoría benignas. Pesa si la dificultad para orinar es nueva y coincide con el dolor cervical, torpeza de manos o marcha inestable (pensar en mielopatía), o si una infección urinaria reciente se acompaña de fiebre y un dolor de cuello continuo que no cede con el reposo (pensar en infección vertebral).',
            detalle: 'Por qué no es dolor referido: el dolor renal se refiere al ángulo costovertebral y al flanco (segmentos T9–L1), y la vejiga y la uretra no tocan el diafragma, así que no refieren dolor al hombro. Un dolor cervical con síntomas urinarios no se explica por la vía visceral.\n\nPrimera pista, la médula: una lesión de la médula por encima del sacro da a la vez síntomas de llenado (urgencia, frecuencia) y de vaciado (chorro débil, dificultad para empezar, sensación de vaciado incompleto), con más orina residual tras orinar. En la mielopatía cervical grave, Goodman describe retención seguida de incontinencia por rebosamiento.\n\nSegunda pista, la infección: la osteomielitis vertebral y la discitis pueden aparecer tras una bacteriemia por infección urinaria, con o sin sonda o cistoscopia. El absceso epidural llega por la sangre en casi la mitad de los casos, a menudo desde la piel o las vías urinarias y respiratorias. El marco IFOMPT incluye la infección reciente, urinaria incluida, entre los factores de riesgo de infección vertebral.\n\nQué preguntar con un SÍ: desde cuándo, si hay escozor, fiebre o sangre en la orina, si cuesta empezar o el chorro es débil, y si hay torpeza de manos o cambios en la marcha.',
            fisiologia: {
              pasos: [
                'Orinar exige coordinar dos músculos: el detrusor, que contrae la vejiga, y el esfínter de la uretra, que debe relajarse a la vez. Lo coordinan los centros de la micción del tronco del encéfalo, a través de la médula.',
                'Si la médula cervical se comprime, esa coordinación se rompe: el detrusor se contrae de forma refleja y el esfínter no se relaja o se cierra (disinergia).',
                'Resultado: cuesta empezar a orinar, el chorro es débil, queda orina en la vejiga y aparecen urgencia o escapes.',
                'Por otra vía, una infección urinaria puede pasar a la sangre: las bacterias llegan a los cuerpos vertebrales, muy irrigados, también a través del plexo venoso de Batson, y pueden formar una osteomielitis o un absceso epidural.'
              ],
              metafora: 'Como un portero que abre la puerta cuando no toca y la cierra cuando toca: si se corta la línea con el cuadro de mando, el paso de la orina se descoordina.'
            },
            fuentes: ['Goodman 2018', 'Finucane 2020', 'Leslie 2023', 'Hall 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 372–373; cap. 14, pp. 531, 550 y 562–563.',
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 5.1, «Recent pre-existing infection», p. 46.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Leslie 2023 — Leslie, Tadi y Tayyeb, «Neurogenic Bladder and Neurogenic Lower Urinary Tract Dysfunction», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560617/' },
              { texto: 'Hall 2025 — Hall, Munakomi y Mesfin, «Spinal Epidural Abscess», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441890/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Ángulo costovertebral', desc: 'Riñones → flanco → ingle ipsilateral' },
        { zona: 'Zona suprapúbica', desc: 'Vejiga, uretra' }
      ],
      impactoDescanso: ['Dolor renal constante, sin alivio postural — impide el sueño'],
      impactoEjercicio: ['Insuficiencia renal crónica: anemia con fatiga extrema y letargo']
    },
    {
      id: 'cv_gi', icon: '🫃', nombre: 'Gastrointestinal',
      banderasRojas: [
        'Dolor de espalda que empeora o mejora al comer o tras una evacuación',
        'Dolor nocturno entre la medianoche y las 3 am que cede con antiácidos (úlcera duodenal)',
        'Heces negras/alquitranadas o vómito en posos de café (sangrado GI)'
      ],
      banderasAmarillas: [
        'Dolor de espalda y abdominal al mismo nivel de forma simultánea o alterna',
        'Uso crónico de AINEs (riesgo de úlcera péptica)',
        'Saciedad precoz o intolerancia a comidas grasas'
      ],
      preguntas: [
        { id: 'cv_gi1', text: '¿El dolor de espalda empeora o mejora al comer, o cambia tras una evacuación intestinal?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Las vísceras digestivas refieren dolor a la zona de la columna con la que comparten segmento medular: el esófago, a la parte anterior del cuello y a la torácica media; el estómago y el duodeno, a la torácica media. Si el dolor cambia al comer o al evacuar, la fuente probable es el tubo digestivo, no la columna.',
            peso: 'Es una bandera roja de origen digestivo: un dolor de cuello o espalda que cambia de cualquier manera al comer pide más preguntas sobre el aparato digestivo y, si se confirma, valoración médica. No hay cifras de precisión; se valora con el resto del cuadro (ardor, dificultad para tragar, saciedad precoz, uso de AINE, sangre en las heces).',
            detalle: 'Mecanismo: el esófago comparte inervación autónoma y somática a través del vago y el frénico, y puede referir dolor a la parte anterior del cuello o a la columna torácica media. Al revés, una lesión de disco torácica puede imitar un dolor esofágico. El dolor esofágico suele ser urente (ardor) o relacionarse con tragar: dificultad para tragar (disfagia) o dolor al tragar (odinofagia).\n\nQué orienta: dolor de cuello que se alivia con antiácidos, de pie, bebiendo o sin comer, o que empeora al comer, al agacharse o tumbado; dolor de garganta. Si el cambio aparece en los 30 minutos siguientes a comer, apunta al tubo digestivo alto (esófago, estómago, duodeno); si aparece 2–4 horas después, al bajo. La saciedad precoz (llenarse con un par de bocados) es otra bandera roja digestiva.\n\nCon qué se confunde: una lesión discal cervical también puede dar dolor anterior de cuello, pero no da melenas ni síntomas con las comidas. La ansiedad da sensación de nudo en la garganta, y un osteofito anterior o una protrusión de disco hacia el esófago, de dificultad para tragar. Algunos fármacos (antidepresivos, antihipertensivos, medicación del asma) dificultan tragar. Quien se provoca el vómito tras atracones puede tener dolor anterior de cuello sin relacionarlo con su forma de comer.\n\nQué preguntar con un SÍ: relación con las comidas y su horario, ardor, dificultad o dolor al tragar, uso prolongado de AINE, sangre en las heces o heces negras, cambios del ritmo intestinal.',
            fisiologia: {
              pasos: [
                'La distensión, la inflamación o la acidez del esófago o del estómago activan sus fibras aferentes viscerales.',
                'Esas fibras llegan por la raíz dorsal al asta dorsal de la médula, donde hacen sinapsis con una segunda neurona.',
                'Varias neuronas sensitivas, viscerales y somáticas, convergen en la misma vía ascendente: el cerebro no distingue de dónde viene la señal y la atribuye a una zona del cuerpo (piel, músculo, hueso) en lugar de al órgano. Es el dolor referido.',
                'El esófago refiere así el dolor a la parte anterior del cuello y a la torácica media; el estómago y el duodeno, a la torácica media.',
                'Como el estímulo depende de lo que pasa por el tubo digestivo, el dolor cambia al comer, al tragar o al evacuar: la columna no era el origen.'
              ],
              metafora: 'Como dos teléfonos que comparten la misma línea: la centralita (la médula) recibe la llamada pero no sabe desde cuál se hizo, y el cerebro la atribuye al cuello o a la espalda.'
            },
            fuentes: ['Goodman 2018', 'Sanvictores 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 90; cap. 8, pp. 304 y 307; cap. 14, pp. 532 y 552–553.',
              { texto: 'Sanvictores 2023 — Sanvictores, Jozsa y Tadi, «Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560843/' }
            ]
          } },
        { id: 'cv_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces, o dolor nocturno entre medianoche y las 3 am que cede con antiácidos?', alerta: true,
          razonamiento: {
            porque: 'La sangre digerida en el tubo digestivo alto se oxida y vuelve las heces negras, pegajosas y malolientes (melena): suele venir de una úlcera, a menudo por AINE. La úlcera duodenal refiere dolor a la espalda y es típico que despierte entre la medianoche y las 3 y se alivie con antiácidos o comiendo.',
            peso: 'La melena o la sangre en las heces siempre requieren valoración médica, aunque no expliquen el dolor. El dolor nocturno a esas horas, aislado, es menos específico: orienta a úlcera si se alivia al comer o con antiácidos, y a algo más serio si es intenso y constante y no cede con nada.',
            detalle: 'Mecanismo: la úlcera gástrica o duodenal puede dar dolor solo en la espalda (columna torácica media, T6–T10). La úlcera duodenal duele 2–3 horas después de comer y de noche, entre la medianoche y las 3, cuando el estómago está vacío; comer o tomar antiácidos la alivia. La gástrica duele a los 15–30 minutos de comer. El dolor nocturno del cáncer se distingue por ser intenso y constante, y por no aliviarse con nada. La causa más frecuente de dolor de espalda de origen gástrico o duodenal es el uso prolongado de AINE.\n\nCon qué se confunde: la sangre roja brillante suele venir del recto o el ano (hemorroides, fisuras), pero también puede ser un cáncer colorrectal: lo valora el médico. Las heces rojizas pueden deberse a la remolacha o a colorantes, y el hierro, el bismuto, el regaliz y algunos alimentos ennegrecen las heces sin que haya sangrado.\n\nQué preguntar: uso de AINE, corticoides o anticoagulantes, antecedentes de úlcera, relación del dolor con las comidas y alivio con antiácidos. Goodman propone pedir a quien tiene dolor nocturno de hombro, cuello o espalda que coma algo y observar si el dolor cambia. Síntomas de alarma que piden derivación rápida: pérdida de peso, dificultad progresiva para tragar, sangrado visible, vómitos repetidos y anemia.',
            fisiologia: {
              pasos: [
                'Las prostaglandinas protegen la mucosa del estómago: mantienen la producción de moco y bicarbonato y el riego de la mucosa.',
                'Los AINE bloquean la enzima COX-1 y, con ella, la síntesis de prostaglandinas: bajan el moco, el bicarbonato y el riego. Helicobacter pylori, la otra gran causa, inflama la mucosa y también reduce el bicarbonato.',
                'Sin esa barrera, el ácido ataca las capas profundas y se forma una úlcera, sobre todo en el estómago y la primera parte del duodeno.',
                'La úlcera duodenal duele con el estómago vacío (2–3 horas después de comer y de madrugada), porque la comida amortigua el ácido; puede referir el dolor solo a la espalda.',
                'La úlcera es la causa más frecuente de hemorragia digestiva alta. Esa sangre sale como melena: heces negras, pegajosas, alquitranadas y de olor característico.'
              ],
              metafora: 'Como el barniz de una tabla de cortar: las prostaglandinas lo mantienen, el AINE lo va quitando y el ácido acaba abriendo surcos en la madera.'
            },
            fuentes: ['Goodman 2018', 'Malik 2023', 'Antunes 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 306–307 y 316; cap. 14, pp. 532 y 553.',
              { texto: 'Malik 2023 — Malik, Gnanapandithan y Singh, «Peptic Ulcer Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534792/' },
              { texto: 'Antunes 2024 — Antunes, Tian y Copelin, «Upper Gastrointestinal Bleeding», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470300/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Columna torácica media (T6-T10)', desc: 'Estómago, duodeno, páncreas, vesícula biliar' },
        { zona: 'Región esternal / Cuello anterior', desc: 'Esófago, ERGE' },
        { zona: 'Escápula derecha', desc: 'Vesícula biliar, hígado' }
      ],
      impactoDescanso: [
        'Dolor nocturno de úlcera duodenal (12–3 am) interrumpe el sueño',
        'Reflujo gastroesofágico nocturno fragmenta el descanso y provoca tos'
      ],
      impactoEjercicio: [
        'Anemia ferropénica por sangrado GI oculto: fatiga y disnea con el esfuerzo',
        'Mala absorción de nutrientes compromete la recuperación muscular post-sesión'
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), URGENCIA (urgencias hoy) y
      // BANDERAS «Otras cefaleas secundarias».
      id: 'cv_arterial', icon: '🧠', nombre: 'Arterial / Traumatismo / Cefalea de alarma',
      banderasRojas: [
        'Disección arterial (<55 a): cefalea o dolor cervical súbito, desconocido para el paciente, moderado o grave y a menudo progresivo; alteración del equilibrio o la marcha, Horner, déficit de pares craneales. Puede imitar una cefalea cervicogénica → urgencias hoy',
        'Insuficiencia vertebrobasilar (suele ser >65 a, posible en jóvenes) · 5 D y 3 N: mareo o inestabilidad, diplopía o pérdida de campo visual, disartria o disfasia, disfagia o ronquera, caídas súbitas sin pérdida de conciencia; nistagmo espontáneo, náuseas o vómitos, entumecimiento peribucal → urgencias hoy',
        'Fractura, subluxación o luxación (incluye la inestabilidad cervical alta traumática): traumatismo importante en persona mayor o mecanismo peligroso → urgencias hoy',
        'Cefalea con signos de alarma: cambio súbito de calidad, intensidad o frecuencia; síntomas neurológicos nuevos; inicio súbito y grave; fiebre u otros síntomas sistémicos → urgencias hoy',
        'Otras cefaleas secundarias: pseudotumor cerebri; arteritis temporal; sospecha de tumor, aneurisma, hemorragia, ictus o meningitis. Pseudotumor: examen ocular, TC o RM, punción lumbar. Arteria temporal: palpación, analítica, biopsia. Resto: RM y analítica'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv_ar1', text: '¿Le empezó de golpe un dolor de cabeza o de cuello distinto a cualquiera que haya tenido antes, con desequilibrio o torpeza al caminar, un párpado caído o una pupila más pequeña, o dificultad para mover la cara, la lengua o los ojos?', alerta: true, s1: true, urgencia: 'Sospecha de disección arterial: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'En la disección, la pared de una arteria del cuello (vertebral o carótida) se desgarra por dentro: la sangre se mete entre sus capas, la estrecha y puede soltar trombos al cerebro. El desgarro duele en el cuello o la cabeza, y la falta de riego da desequilibrio, déficit de pares craneales o un síndrome de Horner (párpado caído y pupila pequeña).',
            peso: 'Un SÍ es una derivación urgente hoy, sin explorar movimientos provocadores del cuello. La disección es rara (la vertebral, entre 0,75 y 2,9 casos por 100 000 personas), pero el marco IFOMPT pide una alta sospecha ante un dolor agudo de cuello o cabeza «distinto a cualquier otro». Los síntomas neurológicos pueden llegar días después, y no tener factores de riesgo no la descarta.',
            detalle: 'Mecanismo: un desgarro de la íntima deja pasar sangre a la pared de la arteria y forma un hematoma (una falsa luz). La arteria se estrecha o se ocluye, o el hematoma se convierte en un nido de trombos que se sueltan hacia el cerebro: la mayoría de los síntomas neurológicos son embólicos. Puede ser espontánea (enfermedades del tejido conectivo, displasia fibromuscular, migraña) o seguir a un traumatismo, incluso menor: un golpe, un latigazo, la tos o el vómito, una manipulación cervical.\n\nDisección vertebral: dolor agudo e intenso, unilateral, de nuca o cabeza en la región occipitocervical. Alrededor del 70 % acaba con algún déficit neurológico de circulación posterior: mareo, ataxia, dificultad para tragar o hablar, visión doble, vértigo. En el marco IFOMPT, la cefalea aparece en el 81 % de las disecciones y el dolor de cuello en el 57–80 %; la inestabilidad o ataxia, en el 67 % de las vertebrales.\n\nDisección carotídea: dolor de cabeza, cara, ojo o cuello del mismo lado; Horner si el hematoma comprime las fibras simpáticas que rodean la carótida. En el marco IFOMPT, la ptosis aparece en el 60–80 % de las carotídeas. Es una causa frecuente de ictus por debajo de los 40 años.\n\nPerfil (Lluch 2020, tabla 1): menores de 55 años; dolor de cabeza o de cuello de comienzo agudo y brusco, desconocido para el paciente, moderado o intenso y a menudo progresivo; buscar alteración del equilibrio o la marcha, Horner y déficit de pares craneales. La disección espontánea puede imitar una cefalea cervicogénica con dolor de cuello.\n\nFactores de riesgo (marco IFOMPT): un traumatismo reciente aparece en el 40–64 % de las disecciones; las anomalías vasculares, el tabaco, la migraña y una infección reciente, en menos.\n\nQué hacer: no tratar; derivar a urgencias hoy. Si se explora, que sea sin provocar: tensión arterial, pares craneales y marcha. Una exploración normal no descarta la disección.',
            fisiologia: {
              pasos: [
                'La pared arterial tiene tres capas: íntima (dentro), media y adventicia. Un desgarro de la íntima deja pasar sangre entre las capas.',
                'Se forma un hematoma en la pared (falsa luz) que estrecha o cierra la luz verdadera de la arteria.',
                'El desgarro y el hematoma estiran la pared, que duele en el cuello o la cabeza, del mismo lado y a menudo de forma brusca.',
                'En la zona dañada se forman trombos que se sueltan hacia el cerebro, o el flujo cae: aparece isquemia del tronco del encéfalo o del cerebelo (desequilibrio, mareo, visión doble, dificultad para hablar o tragar).',
                'En la carótida, el hematoma comprime las fibras simpáticas que suben pegadas a ella hacia el ojo: sin ellas, el párpado cae un poco y la pupila se cierra (síndrome de Horner).'
              ],
              metafora: 'Como una manguera cuyo forro interior se despega: el agua se mete entre el forro y la goma, la manguera se estrecha por dentro y del despegado salen trozos que atascan los aspersores.'
            },
            fuentes: ['Rushton 2023', 'Tavakoli 2025', 'Goodfriend 2022', 'Khan y Bollu 2023', 'Goodman 2018', 'Lluch 2020'],
            citas: [
              { texto: 'Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), tablas 1–2, 4, 6 y 7, pp. 9–12; «Differentiation during the patient examination», p. 16; riesgo, p. 17.', url: 'https://doi.org/10.2519/jospt.2022.11147' },
              { texto: 'Tavakoli 2025 — Tavakoli, Britt y Agarwal, «Vertebral Artery Dissection», StatPearls [Internet], NCBI Bookshelf, última actualización 6 de abril de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441827/' },
              { texto: 'Goodfriend 2022 — Goodfriend, Tadi y Koury, «Carotid Artery Dissection», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de diciembre de 2022.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430835/' },
              { texto: 'Khan y Bollu 2023 — Khan y Bollu, «Horner Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500000/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 522 y 532.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 383; cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), p. 410.'
            ]
          } },
        { id: 'cv_ar2', text: '¿Tiene mareo o inestabilidad junto con visión doble o pérdida de parte de la vista, dificultad para hablar o tragar, ronquera, caídas súbitas sin perder el conocimiento, náuseas o vómitos, o adormecimiento alrededor de la boca?', alerta: true, s1: true, urgencia: 'Sospecha de insuficiencia vertebrobasilar: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'Las arterias vertebrales y la basilar riegan el tronco del encéfalo, el cerebelo y el oído interno. Si les llega poca sangre (por ateroma, un émbolo o una disección), fallan a la vez el equilibrio, la vista, el habla y la deglución: las «5 D y 3 N». Es la combinación lo que delata el origen vascular.',
            peso: 'Un SÍ es una derivación urgente hoy. El mareo aislado pesa poco (el 80–90 % de los vértigos que llegan a urgencias son de origen periférico, del oído interno) y por sí solo no diagnostica una insuficiencia vertebrobasilar; acompañado de signos de tronco del encéfalo (visión doble, dificultad para hablar o tragar, caídas súbitas, entumecimiento de la boca), la indica con fuerza. En el mareo de origen cervical, la visión doble verdadera casi nunca aparece.',
            detalle: 'Mecanismo: la mayoría de los casos se deben a ateroma, por bajo flujo o por émbolos. Para que el bajo flujo dé síntomas tiene que fallar el riego de las dos vertebrales o de la basilar, porque la carótida aporta poco a esa zona. Lo empeoran los antihipertensivos, las arritmias o un robo de la subclavia. Otras causas: émbolos cardiacos (fibrilación auricular), disección vertebral, hipercoagulabilidad, o la hipertrofia de las articulaciones uncovertebrales que estrecha el agujero transverso.\n\nCómo se presenta: el síntoma más frecuente es el mareo o el vértigo; el presíncope aparece en un 60 %. Otros: caídas súbitas con flojera de rodillas sin pérdida de conocimiento, visión doble o pérdida de visión (por ejemplo, con la extensión del cuello en la peluquería), hormigueos, disartria, dificultad para tragar, ronquera, ataxia, náuseas y vómitos. Que se reproduzcan con cambios de postura de la cabeza o con la extensión tiene valor diagnóstico. Goodman describe que la persona gira todo el cuerpo en lugar de la cabeza, y que la extensión, rotación e inclinación combinadas provocan mareo, alteración visual y nistagmo.\n\nPerfil: suele afectar a mayores de 65 años, aunque puede darse en jóvenes (Lluch 2020); la disección arterial, en cambio, es propia de adultos jóvenes y de mediana edad. Es más frecuente con factores de riesgo cardiovascular (tabaco, hipertensión, diabetes, colesterol, enfermedad coronaria o arterial periférica), pero es posible en jóvenes, sobre todo por disección. Hasta el 5 % de los mayores de 60 años que consultan por mareo la tienen.\n\nMareo de origen cervical (Lluch 2020): se describe como aturdimiento o sensación de inestabilidad, ligado al dolor de cuello, la cefalea o los movimientos y actividades del cuello; rara vez es un vértigo verdadero de giro, y la visión doble verdadera, como la de la insuficiencia vertebrobasilar, casi nunca aparece.\n\nCon qué se confunde: vértigo posicional paroxístico benigno, neuritis vestibular, laberintitis y radiculopatía cervical alta. El médico los separa con la exploración HINTS+.\n\nQué hacer: no tratar ni explorar con posiciones provocadoras (las pruebas posicionales de la arteria vertebral no se recomiendan); derivar a urgencias hoy.',
            fisiologia: {
              pasos: [
                'Las dos arterias vertebrales suben por los agujeros transversos de las vértebras cervicales y se unen dentro del cráneo en la arteria basilar, que riega el tronco del encéfalo, el cerebelo y el oído interno.',
                'Una placa de ateroma estrecha esas arterias, o un émbolo (del corazón, del arco aórtico o de una disección) las tapona.',
                'Si fallan las dos vertebrales o la basilar, la carótida apenas puede compensar a través del polígono de Willis: el tronco del encéfalo y el cerebelo se quedan sin riego.',
                'Cada zona sin riego da su síntoma: mareo y nistagmo (núcleos vestibulares), ataxia (cerebelo), visión doble (pares que mueven los ojos), dificultad para hablar o tragar y ronquera (pares bajos), entumecimiento de la cara o la boca (trigémino), caídas súbitas (vías motoras).',
                'Como el riego depende del flujo, los síntomas pueden ser transitorios y aparecer con ciertas posiciones de la cabeza, al bajar la tensión o con una arritmia.'
              ],
              metafora: 'Como un barrio que se abastece de dos tuberías que se juntan en una: si fallan las dos a la vez, se apagan a la vez la luz del equilibrio, la de la vista y la del habla.'
            },
            fuentes: ['Rushton 2023', 'Benjamin y Lui 2025', 'Goodman 2018', 'Lluch 2020'],
            citas: [
              { texto: 'Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), tablas 2, 5 y 6, pp. 11–12; «Planning the physical examination», p. 14.', url: 'https://doi.org/10.2519/jospt.2022.11147' },
              { texto: 'Benjamin y Lui 2025 — Benjamin y Lui, «Vertebrobasilar Insufficiency», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482259/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 227; cap. 14, pp. 530 y 532.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), pp. 370–371 y tabla 1, p. 383.'
            ]
          } },
        { id: 'cv_ar3', notaPosquirurgica: true, text: '¿El dolor empezó tras un traumatismo importante (sobre todo si es mayor) o un golpe peligroso, como una flexión con compresión en un deporte de colisión, y necesita sujetarse la cabeza o apenas puede mover el cuello?', alerta: true, s1: true, urgencia: 'Sospecha de fractura, subluxación, luxación o inestabilidad cervical alta traumática: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'Un traumatismo importante, o uno menor en una persona mayor, puede romper una vértebra o los ligamentos que mantienen unida la columna cervical alta. Sujetarse la cabeza con las manos, el espasmo muscular de defensa y la movilidad muy limitada son la forma de proteger una columna que puede ser inestable; el marco IFOMPT incluye sujetarse la cabeza entre las conductas que sugieren inestabilidad cervical alta.',
            peso: 'Un SÍ es una derivación urgente hoy, sin explorar la movilidad. Es la única bandera roja cervical con evidencia sólida (nivel 1): las reglas de decisión que combinan el mecanismo de la lesión, la edad y la exploración (la regla canadiense de la columna cervical) tienen una sensibilidad cercana al 100 % para fractura. En los mayores de 65 años, esa regla ya pide imagen por la edad, y una caída desde la propia altura basta.',
            detalle: 'Mecanismo: las fracturas cervicales se producen por hiperflexión, hiperextensión, rotación, carga axial o inclinación lateral. La C1 suele romperse por carga axial; la C2, por combinaciones de compresión, hiperflexión e hiperextensión; la columna subaxial (C3–C7), en accidentes de alta energía. Las causas más frecuentes son las caídas, seguidas de los accidentes de tráfico, la bicicleta y el buceo. La rotura de los ligamentos transverso, alares o apical produce una inestabilidad atloaxoidea traumática, a menudo asociada a un traumatismo craneal.\n\nMecanismo peligroso: en los deportes de colisión, la flexión con compresión del cuello se asocia a fracturas en cuña del cuerpo vertebral y, si es catastrófica, a luxación y lesión medular (Lluch 2020).\n\nPersona mayor: la artrosis rigidiza la columna cervical baja y hace que C1–C2 sea el segmento más móvil; por eso la lesión más frecuente en los mayores es en C2, seguida de C1, y la mayoría se deben a caídas de baja energía. La prevalencia de fractura cervical en mayores de 65 años es del 2,6–4,7 %, y al menos la mitad se debe a caídas desde la propia altura. La espondilitis anquilosante, la artritis reumatoide, la estenosis de canal y las metástasis aumentan el riesgo. La persona puede no recordar el golpe o no darle importancia.\n\nSignos (Lluch 2020, tabla 1): traumatismo importante en una persona mayor o mecanismo peligroso; el paciente se sujeta la cabeza con las manos, hay espasmo muscular de defensa, el movimiento está muy limitado y puede haber signos neurológicos. El marco IFOMPT incluye entre las señales que hay que observar desde la entrevista la conducta que sugiere inestabilidad cervical alta (ansiedad, sujetarse la cabeza o el cuello). También el dolor localizado, la deformidad, la alteración de la conciencia o los síntomas neurológicos.\n\nQué hacer: no movilizar ni explorar la movilidad. Derivar a urgencias hoy; el médico decide la imagen (la TC detecta el 98 % de las lesiones óseas frente al 52 % de la radiografía).',
            fisiologia: {
              pasos: [
                'La columna cervical es la más móvil de la columna: sus vértebras y discos se mantienen unidos por un complejo de ligamentos (longitudinales, amarillo, nucal y, arriba, el transverso, los alares y el apical).',
                'Una fuerza brusca en flexión, extensión, rotación o compresión axial rompe hueso o ligamentos; si fallan a la vez la columna anterior y la posterior en el mismo nivel, la lesión es inestable.',
                'En la persona mayor, la artrosis rigidiza la cervical baja y hace que C1–C2 sea el segmento más móvil: por eso una simple caída rompe con más frecuencia la C2 o la C1, y un hueso osteoporótico lo hace más fácil.',
                'Los músculos del cuello se contraen en espasmo de defensa, el movimiento queda muy limitado y la persona se sujeta la cabeza con las manos: es una protección frente a la inestabilidad.',
                'Si la vértebra rota o desplazada invade el canal, comprime la médula o las raíces: debilidad, hormigueos o alteración de los esfínteres.'
              ],
              metafora: 'Como una torre de bloques sujeta con gomas: si un golpe rompe un bloque o una goma, la torre aún se tiene en pie, pero cualquier movimiento puede hacerla ceder; por eso el cuerpo la agarra fuerte.'
            },
            fuentes: ['Feller 2024', 'Rushton 2023', 'McMordie 2023', 'Jeanmonod y Varacallo 2023', 'Lacy 2023', 'Goodman 2018', 'Lluch 2020'],
            citas: [
              { texto: 'Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartados «Level of evidence» y «Discussion».', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11618059/' },
              { texto: 'Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), «Importance of observation throughout history», p. 13.', url: 'https://doi.org/10.2519/jospt.2022.11147' },
              { texto: 'McMordie 2023 — McMordie, Viswanathan y Gillis, «Cervical Spine Fractures Overview», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448129/' },
              { texto: 'Jeanmonod y Varacallo 2023 — Jeanmonod y Varacallo, «Geriatric Cervical Spine Injury», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470375/' },
              { texto: 'Lacy 2023 — Lacy, Bajaj y Gillis, «Atlantoaxial Instability», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519563/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 523–524.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), p. 369 y tabla 1, p. 384.'
            ]
          } },
        { id: 'cv_ar4', text: '¿Su dolor de cabeza ha cambiado de golpe de forma, intensidad o frecuencia, empezó de forma súbita y muy fuerte, o viene con síntomas neurológicos nuevos, fiebre u otros síntomas generales?', alerta: true, s1: true, urgencia: 'Cefalea con signos de alarma: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'Un dolor de cabeza que llega a su máximo de golpe (en menos de un minuto) o que cambia bruscamente de carácter puede ser una hemorragia, una disección o una vasoconstricción de las arterias cerebrales. Los síntomas neurológicos nuevos o la fiebre apuntan a una lesión, una infección o una arteritis, no a una cefalea primaria.',
            peso: 'Un SÍ es una derivación urgente hoy. Las causas graves son una minoría de las cefaleas (1–5 %), pero en la cefalea en trueno se encuentra una hemorragia subaracnoidea en el 11–25 % de los casos, y la cefalea en trueno es el síntoma de inicio en el 20 % de las disecciones arteriales cervicales. Lo que la define es lo rápido que llega al máximo, no lo intensa que es.',
            detalle: 'Cefalea en trueno: dolor intenso de comienzo brusco que llega al máximo en menos de un minuto y dura al menos 5 minutos. Las dos causas secundarias más frecuentes son la hemorragia subaracnoidea y el síndrome de vasoconstricción cerebral reversible; otras: hemorragia intracerebral, hematoma subdural, disección arterial cervical, ictus isquémico, trombosis venosa cerebral, hipotensión intracraneal espontánea, crisis hipertensiva, infección intracraneal y tumor. Se considera una urgencia médica aunque luego no se encuentre causa.\n\nHemorragia subaracnoidea: suele deberse a la rotura de un aneurisma intracraneal, que se forma en bifurcaciones arteriales sometidas a estrés hemodinámico. Se describe como «el peor dolor de cabeza de mi vida», con náuseas, vómitos, rigidez de nuca y fotofobia; la sangre que baja por el espacio subaracnoideo irrita las raíces y da dolor y rigidez de cuello. Algunos pacientes tienen días o semanas antes una cefalea centinela.\n\nOtras señales de alarma (Goodman, cuadro 14.3): cefalea que despierta o está presente al despertar (hipertensión, tumor); cefalea nueva (menos de 6 meses); cefalea nueva con síntomas neurológicos (confusión, mareo, alteración de la marcha); cefalea nueva con fiebre, escalofríos, sudores o rigidez de nuca (infección, arteritis); cefalea brusca e intensa con síntomas pseudogripales, dolor de mandíbula al masticar y alteraciones visuales (arteritis de la temporal, que puede dejar ciego si no se trata); sin antecedentes de migraña.\n\nQué pruebas pide el médico (Lluch 2020): si hay signos de alarma, o cualquier duda, resonancia con estudio vascular para descartar tumor, aneurisma, hemorragia o ictus; la analítica ayuda a distinguir una cefalea por inflamación o infección (meningitis); el pseudotumor cerebri se descarta con examen ocular, TC o RM y punción lumbar, y la arteritis de la temporal con palpación, analítica y, si hay duda, biopsia.\n\nTumor cerebral: la cefalea es bioccipital o bifrontal, intermitente, peor al despertar, y aumenta con todo lo que sube la presión intracraneal (toser, hacer fuerza al defecar, agacharse).\n\nQué hacer: derivar a urgencias hoy; tomar la tensión arterial.',
            fisiologia: {
              pasos: [
                'El cerebro no tiene receptores de dolor: duelen los vasos, las meninges, los pares craneales y los senos.',
                'En las bifurcaciones de las arterias del cerebro, el estrés del flujo inflama la pared, degrada su matriz y debilita la capa muscular: se forma un aneurisma.',
                'Si el aneurisma se rompe, la sangre sale de golpe al espacio subaracnoideo y estira e irrita las meninges: el dolor llega a su máximo en segundos.',
                'La sangre baja por el espacio subaracnoideo e irrita las raíces del cuello: rigidez de nuca. Después, las arterias se contraen (vasoespasmo) y el cerebro puede quedarse sin riego.',
                'En el síndrome de vasoconstricción reversible, el sistema nervioso simpático altera el tono de las arterias cerebrales, que se contraen: también da dolor en trueno.'
              ],
              metafora: 'Como un globo de agua que revienta dentro de una caja forrada de terciopelo muy sensible: el dolor no crece poco a poco, llega de golpe y el agua empapa el forro hasta el cuello.'
            },
            fuentes: ['Goodman 2018', 'Sekhon 2023', 'Ziu 2023', 'Rushton 2023', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, p. 482; cap. 14, pp. 528–531.',
              { texto: 'Sekhon 2023 — Sekhon, Sharma y Cascella, «Thunderclap Headache», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560629/' },
              { texto: 'Ziu 2023 — Ziu, Khan Suheb y Mesfin, «Subarachnoid Hemorrhage», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441958/' },
              { texto: 'Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), tabla 1, p. 9.', url: 'https://doi.org/10.2519/jospt.2022.11147' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), «Serious pathology presenting with headache», p. 410.'
            ]
          } }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), BANDERAS «Mielopatía cervical»,
      // «Inestabilidad cervical alta no traumática», «Distonía cervical» y
      // «Fijación rotatoria atloaxoidea».
      id: 'cv_neuro', icon: '⚡', nombre: 'Médula / Estructural',
      banderasRojas: [
        'Mielopatía cervical: espondilosis avanzada que estrecha el canal y comprime la médula; más probable de mediana edad en adelante. También con tumores avanzados o malformación congénita (Klippel-Feil). Falla la conducción de la médula, no la de la raíz: exploración neurológica que incluya pruebas centrales (Babinski, dedo-nariz). La RM muestra la compresión',
        'Inestabilidad cervical alta no traumática: erosión del ligamento transverso en AR; ausencia congénita de ligamentos; síndrome de Down; Klippel-Feil (cuello corto, asimetría facial, cefalea crónica). La queja principal puede ser una cefalea con rasgos de cervicogénica',
        'Distonía cervical: contracciones involuntarias con postura y movimientos anómalos de la cabeza; puede doler. Observación de la postura y del movimiento',
        'Fijación rotatoria atloaxoidea: más frecuente en niños. Tortícolis con rotación muy limitada. Puede aparecer tras amigdalitis o adenoamigdalectomía (síndrome de Grisel). Requiere derivación médica'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv_n1', text: '¿Tiene artritis reumatoide, síndrome de Down o síndrome de Klippel-Feil (cuello corto)?', alerta: true,
          razonamiento: {
            porque: 'Las tres enfermedades pueden aflojar la unión entre la primera y la segunda vértebra cervicales (C1–C2): la artritis reumatoide erosiona el ligamento transverso, el síndrome de Down da laxitud de ligamentos y el Klippel-Feil fusiona vértebras y puede asociar estenosis de canal e inestabilidad. Una C1–C2 inestable puede comprimir la médula o las arterias vertebrales.',
            peso: 'Un SÍ no significa inestabilidad: la mayoría son asintomáticas (en el Down, hasta un 30 % tiene inestabilidad en la radiografía, pero solo un 1 % da síntomas). Lo que cambia es la exploración: buscar signos de inestabilidad o de mielopatía y evitar las técnicas de manipulación cervical alta. Con signos neurológicos o sensación de que la cabeza «se cae» hacia delante, valoración médica.',
            detalle: 'Anatomía: la C1 (atlas) es un anillo sin cuerpo vertebral; la apófisis odontoides de la C2 se apoya en su arco anterior y la sujeta el ligamento transverso, el más fuerte de la columna cervical, ayudado por los alares y el apical. Es la articulación más móvil de la columna y por ella pasan estructuras nerviosas y vasculares críticas.\n\nArtritis reumatoide: es la enfermedad inflamatoria que más afecta a la unión craneovertebral. La sinovitis crónica estira y afloja el ligamento transverso, forma tejido de granulación y erosiona el hueso: subluxación atloaxoidea. Se describe en el 25–80 % de las personas con AR (los fármacos modificadores de la enfermedad podrían reducirla), con más riesgo en las de más edad. Puede dar dolor profundo occipital, retroorbitario o temporal (raíz C2), sensación de que la cabeza se cae hacia delante al flexionar o un chasquido al extender. La odontoides puede subir hacia el agujero magno y comprimir la médula.\n\nSíndrome de Down: laxitud de ligamentos y anomalías óseas. Klippel-Feil: fusión congénita de dos o más vértebras cervicales (tríada clásica de cuello corto, implantación baja del pelo y movilidad limitada, presente en menos de la mitad). Predispone a estenosis de canal, inestabilidad y déficits neurológicos tras traumatismos leves, y puede dar cefaleas crónicas.\n\nCefalea como queja principal (Lluch 2020): la inestabilidad cervical alta puede presentarse con rasgos de cefalea cervicogénica; los ligamentos alares o el transverso pueden romperse tras un traumatismo, faltar de nacimiento o erosionarse en las artritis seropositivas como la AR, y en esos casos la queja principal puede ser el dolor de cabeza. En el Klippel-Feil puede haber además asimetría facial y cefaleas crónicas, y en el síndrome de Down, inestabilidad craneocervical.\n\nCómo se presenta la inestabilidad: dolor de cuello, movilidad limitada, signos piramidales y mielopatía, parálisis de pares craneales bajos y, en casos graves, disección vertebral, tetraplejia o insuficiencia respiratoria.\n\nQué hacer con un SÍ: exploración neurológica que incluya pruebas centrales, y precaución con las técnicas cervicales altas: Goodman la pide expresamente en la artritis reumatoide y en el uso prolongado de corticoides.',
            fisiologia: {
              pasos: [
                'La odontoides de C2 encaja detrás del arco anterior de C1 y la mantiene en su sitio el ligamento transverso, ayudado por los alares y el apical.',
                'En la artritis reumatoide, la sinovial inflamada de las articulaciones de C1–C2 produce citoquinas y activa a los osteoclastos (vía RANKL): el ligamento se estira y afloja, y el hueso se erosiona.',
                'En el síndrome de Down, los ligamentos son laxos de nacimiento y hay anomalías óseas; en el Klippel-Feil, la fusión congénita de vértebras puede acompañarse de estenosis de canal e inestabilidad.',
                'C1 puede deslizarse hacia delante sobre C2, o la odontoides subir hacia el agujero magno: el canal se estrecha.',
                'La médula o las arterias vertebrales se comprimen: mielopatía (torpeza, marcha inestable, esfínteres), pares craneales bajos o, en casos graves, tetraplejia.'
              ],
              metafora: 'Como un pivote sujeto con un cinturón: si el cinturón se da de sí o se deshilacha, el pivote baila y puede pellizcar los cables que pasan justo por detrás.'
            },
            fuentes: ['Lacy 2023', 'Menger 2024', 'Chauhan 2023', 'Goodman 2018', 'Lluch 2020'],
            citas: [
              { texto: 'Lacy 2023 — Lacy, Bajaj y Gillis, «Atlantoaxial Instability», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519563/' },
              { texto: 'Menger 2024 — Menger, Rayi y Notarianni, «Klippel Feil Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de mayo de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK493157/' },
              { texto: 'Chauhan 2023 — Chauhan, Jandu, Brent y Al-Dhahir, «Rheumatoid Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441999/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 440 y 448; cap. 14, pp. 522, 531–532.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 384; cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), pp. 410–411.'
            ]
          } },
        { id: 'cv_n2', text: '¿Nota contracciones que no controla y que le giran o inclinan la cabeza, o le dejan la cabeza en una postura anómala?', alerta: true,
          razonamiento: {
            porque: 'En la distonía cervical, el cerebro manda contraer a la vez músculos que deberían alternarse (agonistas y antagonistas): la cabeza se gira, se inclina o se queda en una postura anómala sin que la persona lo controle. No es un problema del músculo ni de la columna, sino del control motor del sistema nervioso.',
            peso: 'No es una urgencia ni suele indicar una enfermedad grave, pero no es una tortícolis mecánica y necesita diagnóstico médico (neurología). Pesa más si es reciente y coincide con un fármaco nuevo (antipsicóticos, metoclopramida y otros), un traumatismo craneal o síntomas neurológicos nuevos: puede ser una distonía secundaria a otra enfermedad.',
            detalle: 'Qué es: la distonía es una contracción involuntaria y mantenida de músculos agonistas y antagonistas que produce posturas anómalas, giros o movimientos repetitivos, a veces con temblor. La distonía cervical es la distonía focal más frecuente del adulto; suele empezar entre los 30 y los 50 años y es el doble de frecuente en mujeres. El músculo más afectado es el esternocleidomastoideo; también el esplenio, el trapecio, los escalenos y el platisma. La forma más frecuente tiene un componente de rotación.\n\nRasgos que la distinguen: empeora con la fatiga, el estrés y las emociones; se alivia con la relajación y desaparece durante el sueño. Tiene un rasgo casi único, el truco sensitivo (gesto antagonista): apoyar una mano en la barbilla o en la cara reduce las contracciones. El temblor de la cabeza puede atenuarse en una posición concreta. Puede doler por hipertrofia del esternocleidomastoideo. Al principio se confunde a menudo con una manía o con un trastorno psicológico.\n\nPrimaria o secundaria: la primaria no tiene lesión estructural y tiene una base genética. La secundaria aparece tras un ictus, un tumor, una infección, una lesión por falta de oxígeno, una encefalitis, una enfermedad neurodegenerativa (Wilson) o tóxicos y fármacos: antipsicóticos, metoclopramida, antiepilépticos, agonistas dopaminérgicos, anfetaminas, cocaína, antihistamínicos, litio, anticonceptivos orales. Entre el 10 y el 20 % de las tortícolis son postraumáticas; la distonía postraumática aparece en días o, en su forma tardía, a los 3–12 meses.\n\nQué preguntar con un SÍ: desde cuándo, si es constante o intermitente, si hay truco sensitivo, fármacos nuevos, traumatismo previo, y otros síntomas neurológicos (alteración de la marcha, del equilibrio, de la vista, cefalea).',
            fisiologia: {
              pasos: [
                'Los ganglios basales y sus circuitos con la corteza, el tronco del encéfalo y el cerebelo seleccionan qué músculos se contraen y cuáles se relajan en cada movimiento.',
                'En la distonía falla ese control, aunque la resonancia sea normal: se pierde inhibición y la integración entre lo que se siente y lo que se manda hacer está alterada.',
                'El resultado es la contracción simultánea de músculos agonistas y antagonistas, con descargas prolongadas que se extienden a músculos vecinos (se ve en la electromiografía).',
                'En el cuello, el esternocleidomastoideo y los demás músculos contraídos giran o inclinan la cabeza y la mantienen en una postura anómala; con el tiempo se hipertrofian y pueden doler.',
                'Un estímulo táctil o propioceptivo (apoyar la mano en la barbilla o en la cara) reduce la contracción: es el gesto antagonista, un rasgo casi exclusivo de la distonía.'
              ],
              metafora: 'Como un director de orquesta que da la entrada a la vez a los violines y a los que deberían callar: los músculos tiran en direcciones opuestas y la cabeza se queda girada.'
            },
            fuentes: ['Pana y Saggu 2023', 'Cunha 2023'],
            citas: [
              { texto: 'Pana y Saggu 2023 — Pana y Saggu, «Dystonia», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de septiembre de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448144/' },
              { texto: 'Cunha 2023 — Cunha, Tadi y Bragg, «Torticollis», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539857/' }
            ]
          } },
        { id: 'cv_n3', text: '(Menores de 18 años) ¿Tiene tortícolis con el giro de la cabeza muy limitado, que apareció tras una amigdalitis o una operación de amígdalas o vegetaciones?', alerta: true,
          razonamiento: {
            porque: 'Tras una amigdalitis, una faringitis o una operación de amígdalas o vegetaciones, la infección puede llegar por venas de la faringe a la articulación C1–C2. La inflamación afloja los ligamentos y la C1 rota y se bloquea sobre la C2 (síndrome de Grisel): tortícolis dolorosa con el giro muy limitado.',
            peso: 'Es raro, pero un SÍ requiere derivación médica: no es una tortícolis muscular ni debe movilizarse. Casi el 70 % de los casos son menores de 12 años y el 90 %, menores de 21. Diagnosticarlo pronto importa: pasadas 2 semanas de evolución ya no suele bastar el collarín y hacen falta tracción o inmovilización con halo. La evidencia es de casos clínicos y revisiones.',
            detalle: 'Qué es: el síndrome de Grisel es una subluxación atloaxoidea rotatoria no traumática. Aparece días después de una infección de cabeza o cuello (sobre todo de vías respiratorias altas) o de una intervención otorrinolaringológica (amigdalectomía, adenoidectomía, mastoidectomía). En una revisión de 96 casos, el 48 % tenía una infección reciente, sobre todo de vías altas, y el 40 % estaba en el postoperatorio de cabeza y cuello. Es más frecuente en niños por la laxitud de sus ligamentos y cápsulas, la horizontalidad de sus articulaciones y su musculatura pequeña; el síndrome de Down y el de Marfan aumentan el riesgo.\n\nQué dice la guía (Lluch 2020, tabla 1): la fijación rotatoria atloaxoidea es más frecuente en niños, da tortícolis con la rotación muy limitada y puede aparecer por laxitud de ligamentos e inflamación tras una infección (amigdalitis) o una cirugía de cabeza o cuello (adenoamigdalectomía); requiere derivación médica.\n\nCómo se presenta: tortícolis con dolor de nuca días después de la infección o la cirugía, con dolor de garganta. La cabeza queda girada y algo flexionada, con la barbilla hacia el lado contrario (postura «en petirrojo»), espasmo del esternocleidomastoideo del lado de la rotación, e imposibilidad de girar la cabeza más allá de la línea media hacia el otro lado; el dolor aumenta al intentarlo. La exploración neurológica suele ser normal, pero las formas con desplazamiento anterior o posterior de C1 pueden comprimir la médula.\n\nCuándo importa el tiempo: los casos agudos (menos de 2 semanas desde el inicio) suelen resolverse con reposo, analgésicos, relajantes musculares y collarín; los de más de 2 semanas necesitan tracción (con mentonera o esquelética) e inmovilización con halo.\n\nCon qué se confunde: tortícolis por espasmo muscular, abscesos periamigdalino o retrofaríngeo, tumores de fosa posterior, malformación de Chiari, siringomielia, fracturas de C1–C2 y la tortícolis congénita del lactante. El diagnóstico lo confirma una TC.\n\nQué hacer con un SÍ: no movilizar ni manipular; derivación médica pronta.',
            fisiologia: {
              pasos: [
                'Las venas de la parte posterosuperior de la faringe comunican, a través de las venas faringovertebrales, con el plexo venoso que rodea la odontoides y con los senos venosos epidurales suboccipitales.',
                'Tras una infección o una cirugía de la faringe, ese camino lleva el exudado inflamatorio a la articulación C1–C2.',
                'La inflamación edematiza las cápsulas articulares y afloja los ligamentos transverso y alares: la articulación se vuelve hipermóvil en rotación.',
                'Un giro de la cabeza basta para que las carillas articulares de C1 se desplacen y se bloqueen sobre las de C2 en rotación.',
                'Los músculos del cuello se contraen para proteger la articulación: la cabeza queda girada y el intento de corregirla duele.'
              ],
              nota: 'Las fuentes leídas reconocen que el mecanismo no está demostrado: la vía venosa faringovertebral es la teoría más aceptada, pero hay otras (espasmo muscular por la infección, linfadenitis cervical).',
              metafora: 'Como una bisagra a la que se le aflojan los tornillos con la humedad: un giro brusco la saca de su sitio y se queda atascada torcida.'
            },
            fuentes: ['Barcelos 2014', 'Budha 2025', 'Cunha 2023', 'Lluch 2020'],
            citas: [
              { texto: 'Barcelos 2014 — Barcelos, Patriota y Netto, «Nontraumatic atlantoaxial rotatory subluxation: Grisel syndrome. Case report and literature review», Global Spine J 2014;4(3):179–186 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4111947/' },
              { texto: 'Budha 2025 — Budha, Paudel, Luitel, Joshi, Upreti y Ghimire, «Torticollis in a child with Grisel syndrome: a case report and review of the literature», Int J Surg Case Rep 2025;127:110817 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11786686/' },
              { texto: 'Cunha 2023 — Cunha, Tadi y Bragg, «Torticollis», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539857/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 384.'
            ]
          } }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), BANDERAS «Infección» y
      // «Artritis inflamatoria».
      id: 'cv_inflam', icon: '🔥', nombre: 'Inflamatoria / Infecciosa',
      banderasRojas: [
        'Infección (discitis, osteomielitis, absceso epidural): dolor incesante y nocturno que no alivia con reposo, postura ni movimiento; cuello rígido con pérdida de movilidad; signos neurológicos si está avanzada. Malestar general: febrícula, sudor nocturno, cansancio, inapetencia. Analítica si se sospecha (decisión médica)',
        'Artritis inflamatoria (AR, EA): dolor y rigidez prolongada, sobre todo por la mañana. AR: visible en articulaciones periféricas. EA: empieza en lo lumbopélvico'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'cv_in1', text: '¿Tiene febrícula, sudores por la noche o se encuentra mal en general, con un dolor de cuello continuo que no se alivia con el reposo ni cambiando de postura?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Una infección de la columna (discitis, osteomielitis vertebral, absceso epidural) da un dolor que no cede con el reposo ni cambiando de postura y que empeora de noche; la infección se nota además en el estado general: febrícula, sudores, malestar.',
            peso: 'Un SÍ pide valoración médica pronta, y urgente si hay signos neurológicos. La infección vertebral es rara (0,2–2,4 casos por 100 000 al año; la cervical, un 11 % de las discitis), pero que no haya fiebre no la descarta: solo la tiene el 35–60 % de las osteomielitis vertebrales, y la tríada de dolor, fiebre y déficit neurológico aparece en el 8–15 % de los abscesos epidurales. Pesan los factores de riesgo: diabetes, inmunosupresión, drogas por vía intravenosa, infección o intervención reciente.',
            detalle: 'Mecanismo: las bacterias llegan a la columna sobre todo por la sangre, desde la piel, las vías urinarias o las respiratorias, y prenden en el cuerpo vertebral por su rico riego (solo un 5 % afecta a la parte posterior). También puede llegar por el plexo venoso de Batson, por contigüidad (desde el espacio retrofaríngeo en el cuello) o directamente tras una cirugía o una infiltración. Staphylococcus aureus causa casi dos tercios de los casos. La infección se extiende al disco, a los tejidos paravertebrales y al espacio epidural; el absceso daña la médula por compresión, por isquemia y por tromboflebitis séptica, a veces con déficits bruscos.\n\nCómo se presenta: dolor que aumenta a lo largo de 1–3 semanas, peor de noche, que no se alivia con el reposo ni la postura, con espasmo muscular y rigidez. A diferencia del tumor, que va y viene, la infección progresa de forma lineal. La fiebre, cuando la hay, suele ser febrícula en el adulto. Que no duela al palpar la columna no la descarta: la sensibilidad de la palpación dolorosa puede bajar al 20 %.\n\nFactores de riesgo (Finucane 2020; Hall 2024): diabetes, VIH, corticoides prolongados, alcohol, malnutrición, cáncer, drogas por vía intravenosa, cirugía de columna, infiltraciones, infección reciente (urinaria incluida), edad avanzada; tuberculosis en zonas endémicas o con contacto.\n\nCon qué se confunde: el tumor vertebral da un cuadro parecido (dolor constante, peor de noche, con malestar general), aunque el dolor tumoral tiende a ir y venir y el infeccioso a progresar. La analítica la decide el médico.\n\nQué hacer con un SÍ: tomar la temperatura, preguntar por factores de riesgo, explorar la neurología y derivar.',
            fisiologia: {
              pasos: [
                'Las bacterias pasan a la sangre desde una infección de la piel, la orina o las vías respiratorias, o entran directamente tras una cirugía o una infiltración.',
                'El cuerpo vertebral, muy irrigado, es donde más prenden; también llegan por el plexo venoso de Batson o, en el cuello, desde el espacio retrofaríngeo.',
                'La infección inflama y destruye el hueso y el disco y se extiende a los tejidos de alrededor y al espacio epidural, donde puede formar un absceso.',
                'El dolor aumenta en 1–3 semanas, es más intenso de noche, no cede con el reposo ni cambiando de postura, y los músculos paravertebrales se contraen.',
                'Las citoquinas de la infección producen fiebre, sudores y malestar; si el absceso comprime la médula o trombosa sus vasos, aparecen déficits neurológicos, a veces de golpe.'
              ],
              metafora: 'Como un fuego en el interior de una viga: no hace falta moverla para que se esté quemando, y el humo (la fiebre y el malestar) avisa en toda la casa.'
            },
            fuentes: ['Goodman 2018', 'Finucane 2020', 'Hall 2024', 'Hall 2025', 'Singleton y Hefner 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 522, 531 y 562–563.',
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 5 (infección), pp. 43–48.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Hall 2024 — Hall, Graeber y Cecava, «Vertebral Osteomyelitis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de noviembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK532256/' },
              { texto: 'Hall 2025 — Hall, Munakomi y Mesfin, «Spinal Epidural Abscess», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441890/' },
              { texto: 'Singleton y Hefner 2023 — Singleton y Hefner, «Spinal Cord Compression», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de febrero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557604/' }
            ]
          } },
        { id: 'cv_in2', text: '¿Tiene el cuello rígido mucho rato, sobre todo por la mañana, o le duelen o se le hinchan otras articulaciones?', alerta: true,
          razonamiento: {
            porque: 'En las artritis inflamatorias, la inflamación de la sinovial o de las entesis empeora con el reposo: por la mañana o tras estar quieto, las articulaciones están rígidas mucho rato y mejoran al moverse. La artritis reumatoide afecta a la columna solo en el cuello, donde hay articulaciones sinoviales; la espondilitis anquilosante empieza en la zona lumbopélvica.',
            peso: 'Un SÍ orienta a una enfermedad inflamatoria que necesita diagnóstico médico (reumatología) si no está diagnosticada; las guías de dolor de cuello apenas la tratan y sin datos de precisión. Pesa más si la rigidez dura más de una hora, mejora con el movimiento y hay articulaciones hinchadas. Con una artritis reumatoide o una espondilitis conocidas, cambia la exploración: buscar inestabilidad C1–C2 y extremar la precaución ante un traumatismo.',
            detalle: 'Rigidez inflamatoria: en la artritis reumatoide y la polimialgia reumática, la rigidez matutina dura más de una hora, mejora con la actividad y reaparece al sentarse y volver a empezar (fenómeno de gelificación). Los síntomas de una artritis inflamatoria son la aparición espontánea de una o más articulaciones hinchadas y la rigidez matutina. En el dolor inflamatorio de espalda, el dolor nocturno mejora al levantarse y moverse, y el ejercicio alivia más que el reposo.\n\nArtritis reumatoide: empieza en las articulaciones pequeñas de manos y pies, de forma simétrica, con dolor, hinchazón y rigidez matutina. En la columna, solo afecta al cuello, por sus articulaciones sinoviales; la lumbar no. La afectación cervical empieza con rigidez en todo el arco de movimiento; la inflamación de los ligamentos de C1–C2 puede producir una subluxación atloaxoidea y compresión medular (ver la pregunta de AR, Down y Klippel-Feil).\n\nEspondilitis anquilosante: dolor y rigidez lumbopélvicos de más de 3 meses en menores de 40 años, peor por la mañana. La subluxación atloaxoidea puede dar un dolor intenso de cuello u occipital. La osteoporosis hace que las fracturas vertebrales sean el doble de frecuentes que en la población general, la mayoría en el cuello, y la lesión medular, 11 veces más frecuente: un traumatismo menor del cuello en una persona con EA pide valoración médica.\n\nQué preguntar con un SÍ: cuánto dura la rigidez, si mejora al moverse, qué articulaciones se hinchan, si hay psoriasis o enfermedad inflamatoria intestinal, y si ya tiene diagnóstico y tratamiento.',
            fisiologia: {
              pasos: [
                'En la artritis reumatoide, el sistema inmunitario produce autoanticuerpos y la sinovial se llena de células inflamatorias que liberan citoquinas (TNF, IL-6).',
                'La sinovial inflamada se engrosa y se vuelve invasiva: las citoquinas activan a los osteoclastos (vía RANKL) y a las enzimas que destruyen cartílago, y aparecen las erosiones.',
                'En la espondilitis anquilosante, la inflamación se concentra en las entesis (donde ligamentos y tendones se insertan en el hueso) y en las articulaciones del esqueleto axial, con erosión y después formación de hueso nuevo.',
                'Clínicamente, la rigidez aparece tras el reposo (por la mañana o tras estar sentado) y mejora con la actividad y el ejercicio, al revés que el dolor mecánico.',
                'En el cuello, la artritis reumatoide afecta sobre todo a C1–C2, donde puede aflojar el ligamento transverso.'
              ],
              nota: 'Ninguna de las fuentes leídas explica por qué la rigidez inflamatoria empeora con el reposo y mejora con el movimiento: la describen como rasgo clínico.',
              metafora: 'Como una bisagra oxidada por la humedad: tras una noche quieta cuesta abrirla, y con cada movimiento se va soltando.'
            },
            fuentes: ['Goodman 2018', 'Feller 2024', 'Chauhan 2023', 'Lassiter 2024', 'Lacy 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 429, 438, 440 y 447–448; cap. 14, pp. 522 y 531.',
              { texto: 'Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartados «Red flags» e «Implication for future research».', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11618059/' },
              { texto: 'Chauhan 2023 — Chauhan, Jandu, Brent y Al-Dhahir, «Rheumatoid Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441999/' },
              { texto: 'Lassiter 2024 — Lassiter, Bhutta y Allam, «Inflammatory Back Pain and Spondyloarthropathies», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539753/' },
              { texto: 'Lacy 2023 — Lacy, Bajaj y Gillis, «Atlantoaxial Instability», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519563/' }
            ]
          } }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.cervical
export const tree = {
  title: 'Algoritmo CIF — Cervical',
  steps: [
    {
      id: 'ce_step1',
      tag: 'Paso 1 — Cribado de Médula y Seguridad',
      question: '¿Existen signos de compromiso medular (mielopatía)?',
      options: [
        { label: 'SÍ — Alteración de marcha, hiperreflexia, signo de Hoffmann o Clonus positivos', value: 'si', next: null, hypothesis: ['ce8'] },
        { label: 'NO — Sin signos de mielopatía', value: 'no', next: 'ce_step2', hypothesis: [] }
      ]
    },
    {
      id: 'ce_step2',
      tag: 'Paso 2 — Antecedente Traumático',
      question: '¿Hubo un mecanismo de aceleración-desaceleración reciente (latigazo cervical)?',
      options: [
        { label: 'SÍ — ROM cervical significativamente reducido y síntomas de hiperalerta', value: 'si', next: null, hypothesis: ['ce5'] },
        { label: 'NO — Sin mecanismo traumático', value: 'no', next: 'ce_step3', hypothesis: [] }
      ]
    },
    {
      id: 'ce_step3',
      tag: 'Paso 3 — Dolor Irradiado a Miembro Superior',
      question: '¿El dolor baja por el brazo y es peor que el del cuello?',
      options: [
        // Sin hipótesis: el paso 3b (tarjeta, nodo 3b) separa dolor radicular de radiculopatía
        { label: 'SÍ — Test de Spurling positivo, ULNT1 positivo o alivio con abducción del hombro', value: 'si', next: null, hypothesis: [] },
        { label: 'NO — Sin irradiación predominante al brazo', value: 'no', next: 'ce_step4', hypothesis: [] }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), nodo 3b. Solo se llega con el SÍ
      // del paso 3 (su NO salta al paso 4).
      id: 'ce_step3b',
      tag: 'Paso 3b — Radicular o Radiculopatía',
      question: '¿Rasgos neuropáticos, déficit de conducción o ninguno? Pueden coexistir; si el inicio fue traumático, el paso 2 ya añade el latigazo.',
      options: [
        { label: 'DOLOR RADICULAR — Quemazón o descargas + ULNT1 positivo con diferenciación estructural', value: 'radicular', next: null, hypothesis: ['ce12'] },
        { label: 'RADICULOPATÍA — Déficit de sensibilidad, fuerza o reflejos', value: 'radiculopatia', next: null, hypothesis: ['ce3'] },
        { label: 'AMBOS — Dolor radicular y déficit de conducción', value: 'ambos', next: null, hypothesis: ['ce12', 'ce3'] },
        { label: 'AURA MIGRAÑOSA — Síntomas que preceden a la cefalea y duran hasta 60 min: no radicular', value: 'aura', next: null, hypothesis: [] },
        { label: 'FALLA LA MÉDULA — Derivar (mielopatía)', value: 'medula', next: null, hypothesis: ['ce8'] }
      ]
    },
    {
      id: 'ce_step4',
      tag: 'Paso 4 — Localización y Cefalea',
      question: '¿El síntoma principal es cefalea unilateral o dolor en base del cuello/hombro?',
      options: [
        { label: 'Cefalea unilateral — Test de Flexión-Rotación Cervical <30° y síntomas C1-C2', value: 'cefalea', next: null, hypothesis: ['ce4'] },
        // Tarjeta cervical, nodo 5b: cefalea primaria (la tabla orientativa va en ce4)
        { label: 'Cefalea primaria — Criterios de migraña o tensional (el cuello puede contribuir)', value: 'primaria', next: null, hypothesis: [] },
        { label: 'Dolor en hombro/escápula — Restricción de movilidad de 1ª costilla', value: '1costilla', next: null, hypothesis: ['ce10'] },
        { label: 'Dolor local/inespecífico — Sin cefalea ni irradiación dominante', value: 'no', next: 'ce_step4b', hypothesis: [] }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), nodo 5b, segunda línea: mareo.
      id: 'ce_step4b',
      tag: 'Paso 4b — Mareo',
      question: '¿Hay mareo o inestabilidad como queja principal o acompañante? Descartar antes lo vascular (5 D y 3 N, disección).',
      options: [
        { label: 'MAREO CERVICOGÉNICO — Aturdimiento o inestabilidad ligados al cuello + error de reposición >4–5°', value: 'cervicogenico', next: null, hypothesis: ['ce13'] },
        { label: 'VESTIBULAR — Vértigo rotatorio; tras golpe en cabeza o cuello, pensar también en conmoción', value: 'vestibular', next: null, hypothesis: [] },
        { label: 'NO — Sin mareo', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ce_step5',
      tag: 'Paso 5 — Dominio Mecánico Predominante',
      question: '¿Cuál es la función más alterada en este paciente?',
      options: [
        { label: 'Déficit de Movilidad — ROM activo reducido y PAIVMs C0-C3 hipomóviles', value: 'movilidad', next: null, hypothesis: ['ce1'] },
        { label: 'Déficit de Coordinación — CCFT alterado o test de reposicionamiento alterado', value: 'coordinacion', next: null, hypothesis: ['ce2'] },
        { label: 'Déficit de Fuerza — Reducción de fuerza de flexión o extensión cervical', value: 'fuerza', next: null, hypothesis: ['ce6'] },
        { label: 'Déficit de Resistencia — Fatiga muscular en actividades funcionales', value: 'resistencia', next: null, hypothesis: ['ce11'] },
        { label: 'Déficit Postural — Lordosis reducida o cabeza adelantada evidente', value: 'postural', next: null, hypothesis: ['ce9'] },
        { label: 'Dolor crónico inespecífico sin patrón dominante claro', value: 'inespecifico', next: null, hypothesis: ['ce7'] }
      ]
    },
    {
      // Tarjeta cervical (guía de consulta), nodo 6: las tres ubicaciones son
      // la misma ficha (Idiopático). En todos: tarea provocadora, postura,
      // control motor y región torácica.
      id: 'ce_step6',
      tag: 'Paso 6 — Idiopático: Dónde Está la Disfunción',
      question: '¿Dónde está la disfunción? En todos: tarea provocadora, postura, control motor y región torácica.',
      options: [
        { label: 'CRANEOCERVICAL (C1–2) — Dolor en los primeros grados de rotación, restricción precoz, FRT <30° o 10° de asimetría', value: 'craneocervical', next: null, hypothesis: ['ce14'] },
        { label: 'FACETA CERVICAL — Extensión-rotación positiva + disfunción segmentaria palpable y dolorosa', value: 'faceta', next: null, hypothesis: ['ce14'] },
        { label: 'CERVICAL BAJA Y CERVICOTORÁCICA — Giro libre al inicio pero excursión final limitada', value: 'baja', next: null, hypothesis: ['ce14'] },
        { label: 'NINGUNO — No es idiopático o no se localiza', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── CERVICAL ────────────────────────────────────────────
  // LR: ver «Phase 4b scoring» en CLAUDE.md. `fuente` cita el estudio de cada
  // cifra; sin fuente no hay LR (el test cuenta como hallazgo clínico).
  // `pronostico`: texto literal de la tarjeta cervical de la guía de consulta.
  ce1: {
    id: 'ce1', region: 'cervical', num: '①',
    name: 'Disfunción Articular Cervical',
    prom: 'NDI — Neck Disability Index (MCID: 7.5–18 puntos)',
    dosis: 'Se trata como dolor de cuello con déficit de movilidad (categoría de la guía), según la fase. Aguda: manipulación torácica, ejercicios de movilidad cervical y fortalecimiento escapulotorácico y de miembro superior, que además favorecen la adherencia (B); puede añadirse manipulación o movilización cervical (C). Subaguda: ejercicios de resistencia de cuello y cintura escapular (B); manipulación torácica y manipulación o movilización cervical (C). Crónica: abordaje multimodal con manipulación torácica y manipulación o movilización cervical, ejercicio mixto cervical y escapulotorácico (neuromuscular, estiramientos, fuerza, resistencia, aeróbico y componente cognitivo-afectivo) y punción seca, láser o tracción mecánica intermitente (B); educación que promueva una vida activa (C). En la subaguda y la crónica la terapia manual pierde peso y la manipulación no supera a la movilización. La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    tests: [
      { name: 'PAIVM (Movilidad Intervertebral Pasiva Accesoria) C0-C3', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilización segmentaria posteroanterior. Positivo si hipomóvil y reproduce síntomas. La fiabilidad entre examinadores de la movilidad pasiva intervertebral cervical es pobre o regular (revisión de 7 artículos). Cuenta como hallazgo: las cifras que tenía (κ 0,53–0,72, S 59–65 %, E 78–87 %, LR+ 2,9–4,9, LR− 0,43–0,49) son del PAIVM C0–C3 para la cefalea cervicogénica (Blanpied 2017, p. A19), no para el déficit de movilidad, que no tiene patrón de referencia; y la evidencia publicada del PAIVM en el dolor cervical es para dolor facetario confirmado con bloqueo de rama medial (S 90 %, E 73 %).', fuente: 'Williams 2025 (J Man Manip Ther, revisión de revisiones sistemáticas): evidencia del PAIVM frente a bloqueo facetario · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)' },
      { name: 'ROM Cervical Activo con CROM', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Limitación de la movilidad cervical que reproduce el dolor al final del recorrido activo y pasivo: hallazgo esperado en el dolor de cuello con déficit de movilidad. Una revisión de 46 estudios de fiabilidad y 21 de validez encontró fiabilidad y validez «buenas» para el CROM, el inclinómetro simple y el goniómetro Spin-T, pero 32 de los 46 estudios eran en personas sin dolor. Sin S ni E; no puntúa.', fuente: 'Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19) · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' }
    ]
  },
  ce2: {
    id: 'ce2', region: 'cervical', num: '②',
    name: 'Disfunción Neuromuscular Cervical',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Ejercicio neuromuscular (coordinación, propiocepción, entrenamiento postural, coordinación ojo-cabeza-cuello) dentro del abordaje multimodal de la fase crónica (B). El fortalecimiento isométrico de los flexores profundos redujo dolor y discapacidad a corto plazo, pero el entrenamiento con biofeedback de presión no fue mejor que el fortalecimiento de los flexores con pesas. Para dosificar el entrenamiento craneocervical (Lluch 2020): test de flexión craneocervical en supino con biofeedback de presión inflado a 20 mmHg y cinco escalones de 2 mmHg (22–30), sin activar en exceso el esternocleidomastoideo ni los escalenos y sin retraer la cabeza; la resistencia se mide con apoyos repetidos de 5–10 s en cada nivel y el entrenamiento empieza en el nivel inferior al del fallo. Ni la guía ni el libro fijan series ni semanas.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Lluch 2020, cap. 5.3 (Jull y Falla), p. 378 (test de flexión craneocervical para dosificar)',
    tests: [
      { name: 'Test de Flexión Craneocervical (CCFT) con biofeedback de presión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino, rodillas flexionadas, cabeza y cuello en neutro; biofeedback de presión inflado a 20 mmHg bajo la región cervical alta. El paciente hace flexión craneocervical para subir la presión en cinco escalones de 2 mmHg (22–30). Se anota hasta qué escalón la hace con el gesto correcto, sin activar en exceso el esternocleidomastoideo ni los escalenos y sin sustituirla por una retracción. Tiene fiabilidad inter- e intraterapeuta y validez de contenido establecidas. Un CCFT positivo es hallazgo esperado en el dolor de cuello con alteración de la coordinación del movimiento. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), pp. 377–378 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' },
      { name: 'Test de Reposicionamiento Cabeza-Neutro', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Con los ojos cerrados, el paciente vuelve a la posición de partida tras una rotación o una extensión activas; se mide el error con un láser en una diana, al menos 3 veces por movimiento, y se promedia. Un error mayor de 4–5° indica déficit del sentido de posición cervical. Una revisión de alta calidad encontró que quienes tienen dolor de cuello crónico idiopático lo hacen peor que las personas sin dolor, pero no hay estudios de precisión diagnóstica del test. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), pp. 379–380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)' }
    ]
  },
  ce3: {
    id: 'ce3', region: 'cervical', num: '③',
    name: 'Radiculopatía Cervical',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Aguda: ejercicios de movilización y estabilización, láser y collarín a corto plazo (C); el collarín, solo poco tiempo, en la fase aguda y si no alivian otros tratamientos. Crónica: tracción cervical mecánica intermitente (la continua no ha mostrado beneficio) combinada con estiramientos y fortalecimiento más movilización o manipulación cervical y torácica (B); educación para seguir con la actividad laboral y el ejercicio (B). Vigilar la irritabilidad y ajustar la terapia manual y el ejercicio. Para la fase aguda hay una pauta con volumen de un ensayo (Kuijper 2009) en «Dolor radicular cervical». La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    pronostico: {
      horizonte: 'RM: compresión de raíz o médula. EMG y conducción nerviosa localizan el daño y apoyan el diagnóstico clínico.',
      derivacion: 'Ante cualquier duda de afectación medular → derivar. El aura migrañosa puede presentarse como pérdida de fuerza en el brazo antes de la cefalea, hasta 60 min. Derivar si los síntomas no mejoran o empeoran (Blanpied 2017).',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Spurling (Compresión Foraminal)', sn: '38–98%', sp: '84–100%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad para CONFIRMAR diagnóstico. Extensión + inclinación lateral ipsilateral + compresión axial. Positivo: reproduce dolor radicular en el brazo.', fuente: 'Rango de 5 estudios; la técnica y la interpretación varían y no hay valor agrupado. E con certeza baja, S y LR con certeza muy baja (Thoomes 2026, BMC Musculoskelet Disord, actualización de la revisión de 2018)' },
      { name: 'Upper Limb Neurodynamic Test (ULNT) 1', sn: '70%', sp: '71%', lr_pos: '2.45', lr_neg: '0.42', criterio: 'Sesgo mediano. Positivo si reproduce los síntomas del paciente y estos cambian con la diferenciación estructural (inclinación cervical contralateral o ipsilateral, o movimiento distal): es el criterio de los 3 estudios agrupados. LR agrupadas de 3 estudios (clínica más RM como referencia): LR+ 2,45 (IC 95 % 1,79–3,36), LR− 0,42 (0,30–0,59); certeza muy baja (GRADE). Por separado: LR+ 3,32, 2,46 y 1,95. Con solo 3 estudios el modelo se interpretó como de efecto fijo, y los autores avisan de que las cifras valen para esas poblaciones (atención especializada). Otra revisión que suma estudios con electromiograma o conducción nerviosa como referencia y con cualquier reproducción de síntomas como positivo, sin diferenciación estructural, da LR+ 1,51 y LR− 0,53 (5 estudios); en esa misma revisión, los ULNT con diferenciación estructural dan LR+ 2,71 y LR− 0,50. Combinación de 4 ULNT (1 positivo): S 97 %, E 51 %, LR+ 1,99, LR− 0,06 (0,02–0,25).', fuente: 'Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; metaanálisis bivariado interpretado como de efecto fijo, tablas 3 y 4) · Albert-Lucena 2025 (Musculoskelet Sci Pract 77:103317; metaanálisis bivariante, tabla 5, y metarregresión, apartado 3.6.4) · Sleijser-Koehorst 2021 (Physiotherapy 111:74–82, tabla 4)' },
      { name: 'Shoulder Abduction Relief Test', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El paciente coloca la mano ipsilateral sobre la cabeza — si alivia el dolor radicular, positivo. Cuenta como hallazgo (decisión del usuario, 2026-10). El agrupado de 2 estudios da S 49 %, E 76 %, LR+ 2,08 (IC 95 % 1,32–3,27) y LR− 0,66, certeza muy baja, pero solo pasa de 2 por el estudio antiguo: este no publica tabla 2×2, analiza lados y no pacientes (la prueba se hizo en 22 de 31 pacientes enviados a mielografía; 14 lados de cada lado) y tiene riesgo de sesgo alto. El estudio de riesgo bajo (134 pacientes consecutivos, clínica más RM) da por sí solo S 50 %, E 75 %, LR+ 1,88 (1,22–2,91) y LR− 0,64. Una variante pasiva (el examinador mantiene la mano sobre la cabeza 5 s) dio LR+ 2,05 y LR− 0,36 en un solo estudio de 85 pacientes. Un negativo no descarta. S y E solo aquí, para que no se recalcule la LR.', fuente: 'Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; tablas 3 y 4) · Sleijser-Koehorst 2021 (Physiotherapy 111:74–82, tabla 4) · Viikari-Juntura 1989 (Spine 14:253–257, tablas 1–3) · Grondin 2026 (Braz J Phys Ther 30:101581, tabla 2)' },
      { name: 'Reflejos tendinosos (bíceps C6, tríceps C7)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Parte de la exploración neurológica (sensibilidad, fuerza y reflejos), indicada cuando se sospecha radiculopatía con conducción comprometida. Puede haber déficit sensitivo, de fuerza o de reflejos ligado a la raíz afectada. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' },
      { name: 'Exploración neurológica: sensibilidad, fuerza y reflejos del miembro superior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Siempre que se sospeche conducción comprometida. Sensibilidad a vibración y temperatura: buscar hipoestesia. Comparar con el lado sano. Si falla la médula (no la raíz) → derivar.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Fuerza del grupo débil con dinamómetro de mano (② medida objetiva)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fuerza del grupo muscular débil con dinamómetro de mano, en la misma posición y frente al lado sano.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Combinación de 4 ULNT (ULNT1 y ULNT2a mediano, ULNT2b radial, ULNT3 cubital)', sn: '97%', sp: '51%', lr_pos: '1.99', lr_neg: '0.06', absorbe: [1], criterio: 'Positivo si al menos uno de los cuatro reproduce los síntomas. Sirve sobre todo para descartar: los cuatro negativos dan LR− 0,06 (IC 95 % 0,02–0,25); uno positivo da LR+ 1,99 (1,57–2,52), que no puntúa. Contiene el ULNT1: si esta combinación aporta su LR, la del ULNT1 suelto deja de contar. 2 estudios, certeza muy baja (GRADE); por separado, LR− 0,04 (51 pacientes) y 0,08 (85 pacientes). En los dos, cada ULNT se da por positivo si reproduce los síntomas y estos cambian con la diferenciación estructural.', fuente: 'Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; metaanálisis de Apelby-Albrecht 2013 y de la cohorte de Grondin, tablas 3 y 4) · Apelby-Albrecht 2013 (J Manipulative Physiol Ther 36:626–632, tablas 4 y 5) · Grondin 2026 (Braz J Phys Ther 30:101581, tabla 2; misma cohorte de 85 pacientes)' }
    ]
  },
  ce4: {
    id: 'ce4', region: 'cervical', num: '④',
    name: 'Cefalea Cervicogénica',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Según la fase (dolor de cuello con cefalea). Aguda: instrucción supervisada en ejercicios de movilidad activa (B); autoSNAG C1–2 (C). Subaguda: manipulación y movilización cervical (B); autoSNAG C1–2 (C). Crónica: manipulación o movilización cervical o cervicotorácica combinada con estiramiento, fortalecimiento y resistencia de cuello y cintura escapular (B); el fortalecimiento cervicoescapular con entrenamiento de flexión craneocervical con biofeedback mejoró dolor y función a largo plazo, y los autores de la guía señalan, como opinión, que el entrenamiento craneocervical puede ser especialmente útil. Con algún signo de disfunción temporomandibular, la terapia manual y el ejercicio dirigidos a la ATM mejoraron más que los centrados solo en la región craneocervical. Aplicar antes el cribado vascular del marco IFOMPT. Para dosificar el entrenamiento craneocervical (Lluch 2020): test de flexión craneocervical en supino con biofeedback de presión inflado a 20 mmHg y cinco escalones de 2 mmHg (22–30), sin activar en exceso el esternocleidomastoideo ni los escalenos y sin retraer la cabeza; la resistencia se mide con apoyos repetidos de 5–10 s en cada nivel y el entrenamiento empieza en el nivel inferior al del fallo. La guía no fija series ni semanas (la manipulación 3–4 veces por semana, 12–18 sesiones, superó a una vez por semana a corto plazo, pero no a medio).',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Lluch 2020, cap. 5.3 (Jull y Falla), p. 378 (test de flexión craneocervical para dosificar)',
    pronostico: {
      horizonte: 'La remisión de la cefalea tras tratar el cuello es un buen apoyo diagnóstico. La imagen no confirma ni descarta: solo sirve para descartar patología grave.',
      derivacion: 'Si no cambia al tratar el cuello → revisar ATM y otras formas de cefalea. El 30 % con cervicogénica cumple también criterios de migraña.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Test de Flexión-Rotación Cervical (CFRT)', sn: null, sp: null, lr_pos: '5.0', lr_neg: null, criterio: 'Punto de corte: ≤30° de rotación con cuello en flexión máxima (valor normal >42°). ICC 0.95-0.97 para fiabilidad test-retest. Evidencia de certeza moderada. El test con mayor fiabilidad y precisión diagnóstica según revisión sistemática, y su limitación se correlaciona con el índice de cefalea. Precaución: el patrón de referencia de casi todos los estudios es la exploración manual (fiabilidad pobre, κ 0,28), así que las LR probablemente están sobrestimadas; el rango baja con la edad (explica el 27,9 % de la varianza), con dolor durante la cefalea y a ojo (mejor con goniómetro o CROM); también sale positivo en migraña, más en la crónica. Que reproduzca su cefalea podría mejorar la precisión (solo un estudio lo usó). Solo puntúa positivo: el metaanálisis da S 83 %, E 83 % y LR− 0,2, pero el FRT explora C1–C2 (el metaanálisis lo valida para cervicogénica con origen en C1–C2) y una cervicogénica de C2–C3 o C3–C4 confirmada por bloqueo puede darlo normal, así que un FRT negativo no la descarta (S y E van solo aquí para que no se recalcule la LR−). El metaanálisis considera positivo <45° a cualquier lado; en sus estudios, la rotación media era de 24,5° en el lado sintomático de la cervicogénica frente a 39,1° en otras cefaleas y lados asintomáticos.', fuente: 'Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010, el grupo que propuso el test; modelo bivariante y HSROC; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)' },
      { name: 'PAIVM C0-C3 (segmento C1-C2 más sintomático)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilidad pasiva intervertebral de C0 a C3; el segmento sintomático más frecuente es C1–C2. Una revisión de calidad aceptable (Rubio-Ochoa, citada por la guía) da para la cefalea cervicogénica κ 0,53–0,72, S 59–65 %, E 78–87 %, LR+ 2,9–4,9 y LR− 0,43–0,49. Hallazgo esperado: la cefalea se reproduce al provocar los segmentos cervicales altos implicados. No puntúa (decisión del usuario): el FRT ya aporta la LR de la hipótesis con un metaanálisis más reciente (Demont 2022), el patrón de referencia de estos estudios es la propia exploración manual, de fiabilidad pobre, y la guía califica de pobre a regular la fiabilidad entre examinadores de la movilidad pasiva intervertebral cervical.', fuente: 'Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19) · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' },
      { name: 'Cluster: ROM cervical + PAIVM + CCFT', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Patrón de disfunción articular dolorosa palpable en C0–C4 + menos extensión cervical + más actividad del ECM en el CCFT (EMG). En la validación cruzada identificó 17 de 18 cervicogénicas (S 94,4 %) y ninguna falsa entre 112 sin cervicogénica (E 100 %). El artículo lo resume como «S 100 %, E 94 %», con las etiquetas cambiadas respecto a su propia tabla. Cuenta como hallazgo: con E 100 % la LR+ sería infinita; es una función discriminante (pesos continuos, no «tres positivos»), en una sola muestra, que incluye controles sin cefalea, con el tipo de cefalea clasificado por cuestionario (no por bloqueo) y con el CCFT medido por EMG; los autores piden validarlo. Frente a bloqueos anestésicos controlados de C2–C3 y C3–C4 (30 pacientes con cefalea y dolor de cuello), el modelo con menos extensión, disfunción articular dolorosa en C2–C4, peor CCFT y FRT sin limitación fue el que mejor predijo la respuesta al bloqueo, pero sin S ni E.', fuente: 'Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST). Validación frente a bloqueos: Getsoian 2020 (BMJ Open, tabla 2)' },
      { name: 'Examen manual cervical alto', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Buscar reproducción y resolución de la cefalea. ① Gesto testigo: postura o movimiento cervical que desencadena la cefalea, o presión manual mantenida en el segmento alto que la reproduce → EVA de la cefalea. ② Grados del FRT hacia el lado limitado, en supino con flexión cervical completa.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Rasgos de cervicogénica frente a migraña y tensional (tabla orientativa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cervicogénica: al menos 1 por semana de media, duración variable; unilateral sin cambio de lado, no pulsátil, empieza en el cuello, la desencadenan movimientos o posturas cervicales; dolor o rigidez cervical. Migraña: al menos 5 crisis de 4 a 72 h; 2 de 4: moderada o grave, unilateral, pulsátil, empeora con la actividad habitual; foto y fonofobia, o náuseas o vómitos; pródromos, aura (subgrupo) 5–60 min. Tensional: 30 min a 7 días; 2 de 4: bilateral, opresiva no pulsátil, leve o moderada, no empeora con la actividad; como mucho uno entre fotofobia, fonofobia o náusea leve. No sobreestimes el cuello: el dolor de cuello acompañante no confirma nada (lo refiere hasta el 70 % de quienes tienen cefalea frecuente); en cervicogénica persistente, el 44,1 % tenía signos claros de ATM. Descartar abuso de medicación: analgésicos no más de 10–15 días al mes.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, bloque 4, tabla orientativa)' }
    ]
  },
  ce5: {
    id: 'ce5', region: 'cervical', num: '⑤',
    name: 'Trastornos Asociados a Latigazo Cervical (WAD)',
    prom: 'NDI (MCID: 7.5–18 pts) / EVA dolor (MCID: 2.5 pts)',
    dosis: 'Aguda: educar para volver cuanto antes a las actividades previas que no provoquen síntomas, usar el collarín lo mínimo y hacer ejercicios de postura y movilidad, y tranquilizar: la recuperación se espera en los primeros 2–3 meses (B). Si se prevé una recuperación moderada o lenta con déficits persistentes: movilización manual más ejercicio de fuerza, resistencia, flexibilidad, postura, coordinación, aeróbico y funcional (B). Con riesgo bajo de cronificar: una sola sesión de consejo, ejercicio y educación, un programa completo de ejercicio o TENS (C); el ejercicio supervisado (al menos una sesión y un seguimiento) es preferible al no supervisado, y no se recomiendan programas intensivos en la fase aguda ni en la subaguda. Vigilar la evolución para detectar el retraso y ofrecer rehabilitación más intensiva y educación en dolor (F). Crónica: educación (tranquilizar, animar, pronóstico, manejo del dolor) y movilización con un programa progresivo e individualizado de ejercicio submáximo de fuerza, resistencia, flexibilidad y coordinación con principios cognitivo-conductuales; TENS (C). La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    pronostico: {
      horizonte: 'Peor recuperación con síntomas de estrés postraumático, sobre todo de hiperactivación. Baja expectativa de recuperación: factor pronóstico independiente de más discapacidad (OR 4,2). El mecanismo del accidente no predice el daño estructural.',
      derivacion: 'No prejuzgar: un factor de riesgo no condena a un paciente concreto; el miedo suele ceder al bajar el dolor. Mareo tras golpe en cabeza o cuello: pensar también en vestibular, conmoción y disección.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'ROM Cervical Activo (reducción significativa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En el latigazo cervical, los síntomas y signos suelen ser más frecuentes y en general más graves en todos los parámetros físicos que en el dolor de cuello idiopático. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 382' },
      { name: 'Factores de riesgo de evolución persistente (WAD agudo o subagudo)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Con confianza alta o moderada, en las primeras 6 semanas: dolor intenso (escala 0–10: 6 o más), discapacidad alta (NDI: más del 30 %), catastrofismo (Pain Catastrophizing Scale: 20 o más), estrés postraumático alto (IES-R: 33 o más) e hiperalgesia al frío. La guía cita una regla de predicción del pronóstico derivada y validada, sin detallarla. Pronóstico, no diagnóstico: no puntúa.', fuente: 'Blanpied 2017 (J Orthop Sports Phys Ther 47(7), pp. A13–A14, tabla 6)' },
      { name: 'Síntomas de hiperalerta / PTSD', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Los síntomas significativos de estrés postraumático, sobre todo los de hiperalerta, predicen peor recuperación funcional a medio y largo plazo en el latigazo cervical. Para el pronóstico, la guía propone la IES-R (33 o más) y aclara que se usa para predecir la cronicidad, no para diagnosticar un trastorno de estrés postraumático. En la IES-R, muchos pacientes responden las preguntas de sueño pensando en el dolor. Pronóstico, no diagnóstico: no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), pp. 372–373 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), pp. A13–A14, tabla 6)' },
      { name: 'Hielo sobre la nuca (hiperalgesia al frío)', sn: null, sp: null, lr_pos: '8.44', lr_neg: null, tipo: 'pronostico', criterio: 'Prono, bolsa con dos cubitos 10 s sobre la nuca a cada lado; el paciente puntúa el dolor de 0 a 10. >5/10 → hiperalgesia al frío (S 42 %, E 95 %, LR+ 8,44, IC 95 % 6,3–11,3; LR− 0,61). Un dolor ≤1/10 la hace improbable (>1: LR− 0,18). La LR es para detectar hiperalgesia al frío, no para diagnosticar el latigazo: no entra en la puntuación. La hiperalgesia al frío temprana predice peor evolución. Fractura e inestabilidad ya descartadas; dosificar la exploración.', fuente: 'Maxwell y Sterling 2013 (Man Ther 18:172–174; 62 con latigazo crónico, grado II–III, 124 lados del cuello; referencia: umbral de dolor al frío ≥13 °C con termotest; orden de los tests no aleatorizado). Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Reposición articular (si hay mareo o inestabilidad)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Error medio de reposición con láser. Síntomas en brazo → ULNT1 y neurológico.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Rotación cervical activa sentado (② medida objetiva)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Misma silla y apoyo (grados). ① Gesto testigo: movimiento activo más doloroso o limitado (p. ej. rotación hacia el peor lado) → EVA.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce6: {
    id: 'ce6', region: 'cervical', num: '⑥',
    name: 'Debilidad Muscular Cérvico-Escapular',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Fortalecimiento escapulotorácico y de miembro superior desde la fase aguda (B, dentro de la pauta del déficit de movilidad). En la crónica, estiramiento y fortalecimiento cervical y escapulotorácico combinados dentro del abordaje multimodal (B), que mejoraron dolor y función a medio y largo plazo; el fortalecimiento isométrico de los flexores profundos del cuello redujo dolor y discapacidad a corto plazo. La guía no fija cargas, series ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    tests: [
      { name: 'Fuerza de Flexión Cervical (dinamometría)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fuerza de los flexores del cuello con dinamómetro de mano; sin él, una indicación general con contracciones antigravitatorias repetidas, por ejemplo levantar la cabeza de la camilla en supino. Déficits de fuerza y resistencia de la musculatura del cuello: hallazgo esperado en la alteración de la coordinación del movimiento y en la cefalea cervicogénica. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' },
      { name: 'Fuerza de Extensión Cervical (dinamometría)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fuerza de los extensores del cuello con dinamómetro de mano, o extensión antigravitatoria manteniendo la posición craneocervical neutra, o un Biering-Sorensen modificado. Déficits de fuerza de la musculatura cervicoescapulotorácica: posibles en el dolor de cuello subagudo o crónico con déficit de movilidad. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' }
    ]
  },
  ce7: {
    id: 'ce7', region: 'cervical', num: '⑦',
    name: 'Dolor Mecánico Cervical Inespecífico Crónico',
    prom: 'NDI (MCID: 7.5–18 pts) / PSFS',
    dosis: 'Fase crónica (dolor de cuello con déficit de movilidad): abordaje multimodal con manipulación torácica y manipulación o movilización cervical, ejercicio mixto cervical y escapulotorácico (neuromuscular, estiramientos, fuerza, resistencia, aeróbico y componente cognitivo-afectivo) y punción seca, láser o tracción mecánica intermitente (B); ejercicios de resistencia de cuello, cintura escapular y tronco, y educación que promueva una vida activa y atienda lo cognitivo y emocional (C). Los programas supervisados de fuerza y estiramiento de cuello y tren superior mejoraron más que un programa individual en casa. Integrar estrategias de adherencia al ejercicio en casa. La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    tests: [
      { name: 'ROM Cervical Activo (reducción en todas las direcciones)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Explorar los tres planos (flexión-extensión, rotación axial, inclinación lateral) en las tres regiones (craneocervical, cervical, cervicotorácica): recorrido, patrón de restricción, dolor durante el movimiento y calidad. Limitación con dolor al final del recorrido: hallazgo esperado en el déficit de movilidad. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 375 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)' },
      { name: 'Test de reposicionamiento cabeza-neutro', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Un error mayor de 4–5° al volver a la posición de partida con los ojos cerrados indica déficit del sentido de posición cervical. Quienes tienen dolor de cuello crónico idiopático lo hacen peor que las personas sin dolor, pero no hay estudios de precisión diagnóstica del test. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), pp. 379–380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)' }
    ]
  },
  ce8: {
    id: 'ce8', region: 'cervical', num: '⑧',
    name: 'Mielopatía Espondilótica Cervical',
    prom: 'NDI (MCID: 10.5–17.5 pts según severidad) / mJOA',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Signo de Hoffmann', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mano relajada; se percute hacia abajo la falange distal del dedo medio. Positivo: flexión involuntaria del pulgar o del índice, que sugiere afectación de la vía corticoespinal. Un estudio citado encontró que 3 de 5 hallazgos (Hoffmann, reflejo supinador invertido, Babinski, alteración de la marcha y más de 45 años) elevan la probabilidad postest de mielopatía por encima del 90 %. La guía advierte que las pruebas clínicas de mielopatía tienen sensibilidad baja: no sirven para descartarla; la resonancia ayuda al diagnóstico. Sin S ni E; no puntúa.', fuente: 'Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración) · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A15)' },
      { name: 'Clonus de tobillo/muñeca', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Contracciones rítmicas involuntarias al mantener la dorsiflexión pasiva del pie. El clonus, el Babinski y el reflejo supinador invertido tienen especificidad alta; ningún signo aislado basta, cuenta el conjunto. Sin S ni E; no puntúa.', fuente: 'Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración)' },
      { name: 'Evaluación de marcha (alteración)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Buscar alteración del equilibrio o espasticidad; observar la marcha en tándem: muchos pacientes no mantienen la base estrecha antes de que aparezca la debilidad. Los primeros síntomas pueden ser sutiles (torpeza de manos o leve alteración del equilibrio) y, en mayores de 45 años, deben hacer pensar en una resonancia cervical aunque la fuerza sea normal. Sin S ni E; no puntúa.', fuente: 'Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración)' },
      { name: 'Hiperreflexia (ROT aumentados)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reflejos bicipital, tricipital, braquiorradial, rotuliano y aquíleo. La hiperreflexia generalizada y el signo de Trömner son los más sensibles. Ningún signo aislado basta. Sin S ni E; no puntúa.', fuente: 'Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración)' }
    ]
  },
  ce9: {
    id: 'ce9', region: 'cervical', num: '⑨',
    name: 'Disfunción Postural Cérvico-Torácica',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'La guía no tiene una categoría postural: se trata como dolor de cuello con déficit de movilidad. El ejercicio postural aparece dentro de programas mixtos (en la crónica, B, junto con fuerza, resistencia, estiramientos y aeróbico); el ejercicio postural, de estabilización y de movilidad específico del cuello no superó al ejercicio general, y el ejercicio postural e isométrico añadido a una almohada cervical mejoró dolor y función a corto plazo. La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    tests: [
      { name: 'Evaluación postural de cabeza adelantada (Forward Head Posture)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observar de pie y sentado: algunas desviaciones, como la cabeza adelantada, solo se ven sentado. Las desviaciones de la postura ideal son muy frecuentes en personas sin dolor, así que su relevancia se comprueba cambiando la postura y viendo si cambian los síntomas o la movilidad. Con la espalda hundida al sentarse, la cabeza adelantada aumenta la actividad de los extensores del cuello. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), pp. 374–375' },
      { name: 'Evaluación de cifosis torácica', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Se anota la posición de las regiones lumbar y torácica y cómo se endereza el paciente desde la sedestación relajada. La posición escapular se analiza sabiendo que varía mucho en personas sin dolor; si se sospecha que influye, colocar pasivamente la escápula en una orientación más neutra y ver el cambio inmediato en el dolor o en la movilidad del cuello. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 375' }
    ]
  },
  ce10: {
    id: 'ce10', region: 'cervical', num: '⑩',
    name: 'Disfunción de 1ª Costilla (Articulación Costo-Vertebral Superior)',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: '',
    tests: [
      { name: 'Palpación de 1ª costilla (sensibilidad y restricción)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpación dolorosa de la 1.ª costilla y movimientos accesorios (caudal, anteroposterior, posteroanterior) dolorosos y restringidos. En un Delphi de 12 expertos en terapia manual hubo consenso en que estos hallazgos ayudan a identificar su disfunción; es opinión de expertos y los autores piden estudiar su fiabilidad y validez. Sin S ni E; no puntúa.', fuente: 'Mastromarchi 2021 (J Man Manip Ther 29(3):181–188, Delphi, tabla 2)', noData: true },
      { name: 'Restricción de rotación cervical ipsilateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rotación cervical activa hacia el lado afectado dolorosa y restringida. En un Delphi de 12 expertos en terapia manual hubo consenso en este hallazgo, pero también en la rotación contralateral dolorosa y restringida, y no en que todos los movimientos cervicales lo estén; es opinión de expertos, sin fiabilidad ni validez estudiadas. Sin S ni E; no puntúa.', fuente: 'Mastromarchi 2021 (J Man Manip Ther 29(3):181–188, Delphi, tabla 2)', noData: true }
    ]
  },
  ce11: {
    id: 'ce11', region: 'cervical', num: '⑪',
    name: 'Fatiga Muscular Cérvico-Escapular',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Ejercicios de resistencia de cuello y cintura escapular: B en la fase subaguda; C en la crónica, junto con resistencia del tronco y educación para una vida activa. Resistencia y fortalecimiento dieron resultados parecidos entre sí. Única cifra de la guía, como evidencia y no como recomendación: un programa en casa de resistencia de flexores del cuello 3 veces por semana durante un año, más fortalecimiento y estiramiento del miembro superior, mejoró más que el ejercicio aeróbico; en otra tabla, la misma guía da esa comparación, con el mismo estudio, como sin beneficio frente a aeróbico más estiramientos. La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    tests: [
      { name: 'Test de resistencia de flexores cervicales profundos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En supino, flexión craneocervical combinada con flexión cervical para levantar la cabeza de la camilla, mantenida como prueba cronometrada; sirve para medir la resistencia y seguir su mejora con el entrenamiento. La guía recomienda incluir los tests de resistencia de los flexores del cuello para identificar la alteración de la coordinación del movimiento (B). Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A20)' },
      { name: 'Evaluación de fatiga en actividades funcionales prolongadas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pedir al paciente que muestre la actividad o la postura que le provoca el dolor y observar el control del movimiento y la carga sobre el cuello; probar a modificar la postura y ver el efecto inmediato en el dolor. La cabeza adelantada con espalda hundida aumenta la actividad de los extensores, y la cabeza flexionada con dispositivos de mano aumenta su demanda mecánica, lo que puede llevar a fatiga, isquemia y dolor. Sin S ni E; no puntúa.', fuente: 'Lluch 2020, cap. 5.3 (Jull y Falla), pp. 374–375' }
    ]
  },
  // Síndromes de la tarjeta cervical sin hipótesis previa. Sin dosis en la
  // guía («Dosis y progresión no están en la guía: son tuyas»): dosis ''.
  ce12: {
    id: 'ce12', region: 'cervical', num: '⑫',
    name: 'Dolor Radicular Cervical',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Fase aguda (menos de 1 mes, dolor de brazo por debajo del codo): fisioterapia 2 veces por semana durante 6 semanas (12 sesiones), sin terapia manual, con ejercicio graduado para fortalecer la musculatura cervical superficial y profunda, orientado a movilizar y estabilizar, más ejercicios en casa a diario. Alternativa de eficacia casi igual: collarín semirrígido de día 3 semanas, retirándolo en las 3 siguientes, con reposo. Ambas redujeron el dolor de brazo unos 12 mm (EVA 0–100) más que esperar, a las 6 semanas; a los 6 meses ya no había diferencias con esperar (la mayoría tenía poco o ningún dolor). La guía limita el collarín a poco tiempo, en fase aguda y solo si no alivian otros tratamientos. Agudo, guía (C): ejercicios de movilización y estabilización, láser y collarín a corto plazo. Crónico, guía (B): tracción cervical mecánica intermitente (la continua no ha mostrado beneficio) combinada con estiramientos y fortalecimiento más movilización o manipulación cervical y torácica; educación para seguir con la actividad laboral y el ejercicio (B). Vigilar la irritabilidad y ajustar la terapia manual y el ejercicio.',
    dosisFuente: 'Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)',
    pronostico: {
      horizonte: 'RM para compromiso de raíz, solo si la exploración lo indica: los cambios son frecuentes en asintomáticos.',
      derivacion: 'Con más dolor y discapacidad aparece sensibilización central: exploración mínima. La espondilosis que avanza puede comprimir la médula.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'ULNT1 (sesgo mediano) con diferenciación estructural', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Positivo si reproduce los síntomas y estos cambian con la diferenciación estructural. Es el más estudiado (el capítulo no da cifras; las agrupadas del ULNT1 son para radiculopatía y puntúan allí). Si hay adormecimiento o debilidad, pasar a la radiculopatía.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Movilidad cervical que dispara el dolor de brazo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Qué movimiento dispara el dolor de brazo y cuánto se tolera. ① Gesto testigo: movimiento cervical que dispara el dolor de brazo (p. ej. extensión), o ULNT1 hasta una posición fija → EVA del brazo.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Grados de extensión de codo en el ULNT1 (② medida objetiva)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Grados de extensión de codo en el ULNT1 en que aparecen los síntomas, con hombro, muñeca y cuello en posición fija.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Rasgos neuropáticos (quemazón o descargas)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Que el dolor llegue al hombro o al brazo no lo convierte en radicular: C4–5 se refiere a cuello y hombro, y C5–6 a C7–T1 a cuello, hombro y brazo. Separan los rasgos neuropáticos y la diferenciación estructural del ULNT1.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce13: {
    id: 'ce13', region: 'cervical', num: '⑬',
    name: 'Mareo Cervicogénico',
    prom: 'NDI (MCID: 7.5–18 puntos)',
    dosis: 'Mareo cervicogénico crónico (3 meses o más, con inestabilidad y dolor o rigidez cervical; excluidos vértigo, migraña, insuficiencia vertebrobasilar y otras causas de mareo). 2–6 sesiones en 6 semanas, según la respuesta. Opción 1, SNAG de Mulligan: sentado, el paciente mueve la cabeza hacia la dirección que le marea mientras el fisio desliza hacia anterior C2 (flexión o extensión, por la apófisis espinosa) o C1 (rotación, por la apófisis transversa); 6 repeticiones, sin síntomas en la primera sesión y con sobrepresión suave en las siguientes. Tras la 2.ª sesión, autoSNAG en casa con los dedos o una cinta, 6 repeticiones una vez al día. Opción 2, movilización de Maitland de hasta 3 niveles cervicales altos rígidos o dolorosos, normalmente 3 aplicaciones de 30 s por nivel (grado a criterio), más movilidad activa en casa tras la 2.ª sesión (flexión, extensión, rotación e inclinación, 3 veces cada una, una vez al día). Las dos redujeron la intensidad del mareo frente a placebo al terminar y a las 12 semanas, y su frecuencia a las 12 semanas, sin diferencias entre ellas.',
    dosisFuente: 'Reid 2014, Phys Ther 94(4):466–476 (ensayo aleatorizado doble ciego frente a placebo, n = 86)',
    pronostico: {
      horizonte: 'Identificar la fuente del mareo es clave para que el manejo funcione.',
      derivacion: 'Vértigo rotatorio → vestibular. Golpe en cabeza o cuello → conmoción. Visión doble verdadera en mayores → IVB; súbito en jóvenes → disección. Los dos últimos, urgencias.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Descartar lo vascular (5 D y 3 N, disección)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Primero descartar lo vascular. Si hay signos vasculares → urgencias hoy (fase 2).', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Sentido de posición articular (error de reposición)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ojos cerrados, rotación a cada lado y extensión, y volver a la posición natural. Error >4–5° = déficit. Con láser en cinta de cabeza y diana, al menos 3 intentos por movimiento y hacer la media.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Movimiento o postura que desencadena el mareo (① gesto testigo)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movimiento o postura cervical que desencadena el mareo → EVA del mareo. ② Error medio de reposición en grados por movimiento (rotación derecha, izquierda, extensión), sentado a la misma distancia de la diana.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
  ce14: {
    id: 'ce14', region: 'cervical', num: '⑭',
    name: 'Dolor Cervical Idiopático',
    prom: 'NDI (MCID: 7.5–18 puntos) / PSFS',
    dosis: 'Se trata como dolor de cuello con déficit de movilidad (categoría de la guía), según la fase. Aguda: manipulación torácica, ejercicios de movilidad cervical y fortalecimiento escapulotorácico y de miembro superior, que además favorecen la adherencia (B); puede añadirse manipulación o movilización cervical (C). Subaguda: ejercicios de resistencia de cuello y cintura escapular (B); manipulación torácica y manipulación o movilización cervical (C). Crónica: abordaje multimodal con manipulación torácica y manipulación o movilización cervical, ejercicio mixto cervical y escapulotorácico (neuromuscular, estiramientos, fuerza, resistencia, aeróbico y componente cognitivo-afectivo) y punción seca, láser o tracción mecánica intermitente (B); educación que promueva una vida activa (C). En la subaguda y la crónica la terapia manual pierde peso y la manipulación no supera a la movilización. La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.',
    dosisFuente: 'Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)',
    pronostico: {
      horizonte: 'Recurrente: tras un episodio, el 50–85 % vuelve a tener dolor en meses o pocos años. Radiografía solo con indicación concreta de la exploración: hay dolor sin cambios y cambios sin dolor.',
      derivacion: 'Dolor constante y sordo → componente inflamatorio. Dolor que no cambia con postura, movimiento ni reposo → banderas rojas. Espondilosis avanzada: posible radiculopatía o mielopatía.',
      fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)'
    },
    tests: [
      { name: 'Tarea provocadora (① gesto testigo)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Que muestre la actividad que le duele; modificar la postura y ver el efecto inmediato. Tarea o postura provocadora que el paciente demuestra (rotación al lado del dolor, mirar al techo, postura de ordenador un tiempo fijo) → EVA.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Movilidad activa en los tres planos y las tres regiones', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Extensión: la cabeza debe pasar por detrás del plano de los hombros. Rotación: giro libre en los primeros 30° = craneocervical sin gran alteración; restricción precoz → problema craneocervical. ② Rotación cervical activa hacia el lado limitado, sentado con la espalda apoyada (inclinómetro).', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Test de flexión-rotación (FRT) si es craneocervical', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'FRT <30° o 10° de asimetría → craneocervical (C1–2). ② Si es craneocervical: grados del FRT en supino. Su evidencia diagnóstica es para cefalea cervicogénica: aquí cuenta como hallazgo.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Extensión-rotación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Positiva + disfunción segmentaria palpable y dolorosa → faceta cervical.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' },
      { name: 'Examen manual segmentario', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Disfunción segmentaria palpable y dolorosa. La palpación va la última.', fuente: 'Tarjeta de consulta cervical (guía clínica cervical, ap. 5)' }
    ]
  },
};
