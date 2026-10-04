// ============================================================
// PhysiQ-Assessment · data/lumbar.js
// Contenido clínico de la región LUMBAR: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.lumbar
export const screening = {
  label: 'Sacro, Sacroilíaca, Pelvis y Lumbar',
  // Recuadro de urgencia: literal de la tarjeta de consulta lumbar (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS HOY · CAUDA EQUINA',
    lineas: [
      'Urgencia quirúrgica: el tiempo hasta la cirugía pesa más que la duración de los síntomas.',
      'Dolor o debilidad bilateral grave en MMII · parestesia en silla de montar · retención o incontinencia urinaria · incontinencia fecal · menor tono anal.',
      'PREGUNTAR SIEMPRE. Signos más específicos que sensibles; RM de elección. En mayores con estenosis el inicio lento se solapa y pasa desapercibido.'
    ]
  },
  sistemas: [
    {
      id: 'l_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Antecedentes de cáncer de próstata, colon, o cualquier tipo',
        'Dolor nocturno intenso que despierta al paciente sin alivio postural',
        'Pérdida de peso inexplicada (>10% en 2-4 semanas)',
        'Fractura patológica ante trauma menor o fragilidad ósea'
      ],
      banderasAmarillas: ['Dolor lumbar persistente sin mejoría tras 1 mes de tratamiento conservador'],
      preguntas: [
        { id: 'l2', text: '¿Tiene antecedentes de cáncer de cualquier tipo?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Un cáncer previo puede volver como metástasis ósea, y la columna es una diana frecuente: mama, pulmón, próstata y riñón llegan a la lumbar por el plexo venoso paravertebral, de pared fina y sin válvulas. Por eso cuenta también la quimio o radioterapia previa aunque el paciente diga que no ha tenido «cáncer».',
            peso: 'Es la bandera roja de malignidad que más pesa. Con antecedente de cáncer, la probabilidad de un tumor vertebral sube al 7 % en atención primaria y al 33 % en urgencias; edad > 50 años, pérdida de peso y no mejorar en un mes quedan por debajo del 3 %. Aun así, un SÍ no diagnostica: obliga a explorar el resto. Y un NO no tranquiliza del todo: en torno al 25 % de las compresiones medulares metastásicas aparecen sin cáncer conocido.',
            detalle: 'Mecanismo: la columna torácica y la lumbosacra son las zonas que más metástasis reciben. En la lumbar suelen venir de mama, pulmón, próstata o riñón; los cánceres digestivos, el mieloma y los linfomas también llegan por el plexo venoso paravertebral. El mieloma múltiple es el tumor primario más frecuente de la columna y puede dar años de lumbalgia crónica antes del diagnóstico. Por eso Goodman pide preguntar por quimio o radioterapia previas a quien niega haber tenido cáncer.\n\nCon qué se confunde: casi la mitad de las lumbalgias de origen tumoral tienen un traumatismo previo identificable, así que un «me hice daño» no descarta nada. La radiografía no enseña la lesión lítica hasta que mide 1–2 cm y se ha perdido un 50 % del mineral óseo en esa zona: una radiografía normal tampoco la descarta. Orientan más el dolor constante e intenso que no cambia con la postura, que empeora de noche o con la carga; la debilidad sin dolor; y la percusión dolorosa de una apófisis espinosa.\n\nQué hacer con un SÍ: explorar las demás banderas rojas y el examen neurológico. Goodman indica derivar si al antecedente de cáncer se suman pérdida de peso inexplicada y falta de mejoría tras un mes de tratamiento conservador.\n\nQué tipo de cáncer (Finucane 2020): los que más metastatizan en el hueso son mama, próstata, pulmón, riñón y tiroides, y aproximadamente el 30 % de quienes tienen uno de ellos acaba teniendo metástasis, así que no todo antecedente de cáncer justifica pruebas. Preocupan más los tumores grandes, en estadio avanzado (3–4) o con afectación ganglionar. En el cáncer de mama, la mitad de las metástasis óseas aparecen en los 5 primeros años y la otra mitad 10 años o más después: un cáncer «antiguo» sigue contando.',
            fisiologia: {
              pasos: [
                'Las células tumorales se sueltan del cáncer primario y viajan sobre todo por la sangre. A la columna llegan por las venas: la mama y el pulmón drenan al plexo de Batson en la zona torácica, y la próstata, por el plexo pélvico, a la columna lumbosacra y la pelvis.',
                'La médula ósea, muy irrigada, es un «terreno» receptivo (hipótesis de la semilla y el terreno): receptores de la célula tumoral, como CXCR4 o RANKL, interactúan con las células del estroma de la médula y de la matriz ósea.',
                'Esa interacción libera factores de crecimiento, citoquinas (IL-6, IL-8) y factores que forman vasos (VEGF): el tumor crece y se activan los osteoclastos, que destruyen hueso. Unas metástasis son líticas (mama, pulmón, riñón), otras forman hueso (próstata) y otras son mixtas.',
                'Al romperse la arquitectura del hueso aparecen dolor sordo y profundo que empeora de noche, fracturas con cargas mínimas, compresión de raíces o de la médula e hipercalcemia (náuseas, estreñimiento, confusión).',
                'La radiografía simple tarda en verlo: la lesión lítica no aparece hasta que mide 1–2 cm y se ha perdido un 50 % del mineral óseo en esa zona. La RM la detecta antes (sensibilidad 95 %, especificidad 90 %).'
              ],
              metafora: 'Como semillas que llegan a un jardín muy regado: prenden en la médula ósea y, para hacerse sitio, ponen a trabajar a los demoledores del propio hueso, los osteoclastos, que lo van vaciando por dentro.'
            },
            fuentes: ['Goodman 2018', 'Downie 2013', 'Finucane 2020', 'Jayarangaiah 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Screening for oncologic causes of back pain», pp. 539–542.',
              { texto: 'Downie 2013 — Downie, Williams, Henschke et al., «Red flags to screen for malignancy and fracture in patients with low back pain: systematic review», BMJ 2013;347:f7095 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3898572/' },
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 4 (malignidad), pp. 34–36.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' }
            ]
          } },
        { id: 'l_on2', text: '¿El dolor nocturno lo despierta desde un sueño profundo y le resulta imposible encontrar una posición que lo alivie?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El tumor crece a costa del riego del tejido que lo rodea y le provoca isquemia: el dolor no depende de la carga ni de la postura, despierta de un sueño profundo y no deja volver a dormir. El dolor mecánico, en cambio, suele ceder al cambiar de posición.',
            peso: 'Poco específico: la mayoría de las personas con lumbalgia tienen dolor nocturno. Preocupa más quien no consigue volver a dormirse por la intensidad del dolor y tiene que levantarse, caminar o dormir en un sillón que quien se duerme de nuevo tras cambiar de postura. Pesa de verdad junto a un antecedente de cáncer, dolor óseo o síntomas generales.',
            detalle: 'Mecanismo: los tumores están muy vascularizados a costa del tejido huésped, que queda isquémico. El resultado es un dolor de reposo, sobre todo nocturno, que despierta al paciente y le impide volver a dormirse aunque cambie de postura. El dolor óseo nocturno es el más sospechoso, sobre todo con antecedente de cáncer.\n\nCon qué se confunde: quien nota más dolor al acostarse, sin haberse dormido todavía, puede estar simplemente sin distracciones por primera vez en el día. También despiertan de noche la úlcera duodenal (entre la medianoche y las 3, y comer la alivia), el dolor inflamatorio de las espondiloartropatías (segunda mitad de la noche, con rigidez matutina) y la osteomielitis vertebral, cuyo dolor es más intenso de noche.\n\nQué preguntar después (Goodman, cuadro 3.7): cómo es el patrón nocturno, si puede tumbarse sobre ese lado y cuánto tiempo, qué pasa al incorporarse, si la aspirina lo alivia de forma desproporcionada y si comer o beber cambia el dolor. El marco IFOMPT (Finucane 2020) propone preguntar qué tiene que hacer para volver a dormirse y si el dolor nocturno depende de la postura. La revisión Cochrane concluye que la sospecha de malignidad no debe basarse en una sola bandera roja.',
            fisiologia: {
              pasos: [
                'Para crecer, el tumor necesita riego: libera factores que forman vasos (VEGF) y se vasculariza a costa del tejido que lo rodea, que queda isquémico.',
                'En el hueso, además, el tumor activa a los osteoclastos, que destruyen hueso y deshacen su arquitectura.',
                'El dolor que resulta no depende de la carga ni de la postura: es sordo, profundo, de comienzo gradual y peor de noche, y no cede al cambiar de posición.',
                'Si el hueso debilitado se fractura, el dolor pasa a ser constante y, en la columna, empeora al sentarse o estar de pie.'
              ],
              nota: 'Ninguna de las fuentes leídas explica por qué el dolor tumoral es peor de noche que de día: lo describen como rasgo clínico.',
              metafora: 'Como un vecino que se engancha a tu red eléctrica: el tumor se lleva la sangre del tejido de alrededor, que se queda sin suministro y duele aunque no se mueva nada.'
            },
            fuentes: ['Goodman 2018', 'Finucane 2020', 'Henschke 2013', 'Jayarangaiah 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, «Night pain», p. 119; cap. 8, p. 307; cap. 14, pp. 534 y 562–563.',
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 4.2, «Night pain», p. 37.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Henschke 2013 — Henschke, Maher, Ostelo et al., «Red flags to screen for malignancy in patients with low-back pain», Cochrane Database Syst Rev 2013;(2):CD008686 (resumen y conclusiones de los autores).', url: 'https://doi.org/10.1002/14651858.CD008686.pub2' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Columna lumbo-sacra (30%)', desc: 'Segunda localización más frecuente de metástasis vertebrales' },
        { zona: 'Pelvis / Costillas', desc: 'Metástasis en esqueleto axial' },
        { zona: 'Glúteo / Ingle', desc: 'Compresión medular con irradiación radicular' }
      ],
      impactoDescanso: ['Dolor óseo nocturno tipo "taladro" no cede al acostarse — señal de alarma oncológica'],
      impactoEjercicio: ['Riesgo de fractura patológica con apoyo de peso — restricción de carga', 'Fatiga extrema sin relación con el nivel de actividad']
    },
    {
      id: 'l_urogenital', icon: '🫘', nombre: 'Urogenital / Renal',
      banderasRojas: [
        'Hematuria (sangre en orina)',
        'Prueba de percusión positiva en ángulo costovertebral',
        'Incontinencia intestinal/vesical o anestesia en silla de montar (síndrome de cauda equina)',
        'Masa testicular indolora'
      ],
      banderasAmarillas: [
        'Dolor lumbar constante que no varía con la postura corporal',
        'Fiebre y escalofríos acompañando el dolor lumbar',
        'Cambios en la orina (color, olor, cantidad)'
      ],
      preguntas: [
        { id: 'l4', text: '¿Ha notado cambios en la orina (color rojo, marrón, turbio) o fiebre/escalofríos junto con el dolor de espalda?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El riñón y las vías urinarias comparten inervación segmentaria con la zona lumbar, y su dolor se refiere al ángulo costovertebral y al flanco. La infección (pielonefritis, absceso perirrenal) suele dar además fiebre, escalofríos y cambios en la orina, que la exploración mecánica no explica.',
            peso: 'La combinación es lo que pesa: dolor lumbar más fiebre o escalofríos, o más orina con sangre, apunta a un origen renal y pide valoración médica. La puñopercusión renal, aunque se usa mucho, nunca se ha validado; en el cólico renal, la sangre en la orina y el dolor a la presión en la fosa lumbar orientan más.',
            detalle: 'Mecanismo: la pielonefritis aguda y el absceso perirrenal dan un dolor sordo y constante a un lado de la columna, en T12–L1, por distensión aguda de la cápsula renal, que puede irradiarse a la cresta ilíaca o a la ingle. El cólico por cálculo es intermitente, muy intenso, no cede con el reposo ni con los cambios de postura y suele acompañarse de náuseas, sudoración y sangre en la orina.\n\nCon qué se confunde: el dolor «seudorrenal» por una disfunción costovertebral o una radiculitis T10–T12 imita al renal, pero cambia con la postura (empeora al tumbarse sobre ese lado y al sentarse encorvado) y no trae fiebre ni síntomas urinarios. Una hernia discal torácica baja también puede imitar dolor renal.\n\nQué buscar con un SÍ: antecedentes de cálculos o de infecciones urinarias, traumatismo reciente, temperatura y el resto de síntomas urinarios (frecuencia, urgencia, escozor, nicturia).',
            fisiologia: {
              pasos: [
                'La infección o la obstrucción distienden de forma aguda la cápsula del riñón o la vía urinaria e inflaman el órgano.',
                'Esas señales viajan por fibras aferentes viscerales hasta el asta dorsal de los segmentos medulares que también reciben la piel y el músculo del flanco y la espalda (en torno a T9–L1).',
                'Varias neuronas sensitivas, viscerales y somáticas, convergen en la misma vía ascendente de la médula: el cerebro no distingue de dónde viene la señal y la atribuye a una zona del cuerpo (piel, músculo, hueso) en lugar de al órgano. Es el dolor referido.',
                'Por eso el dolor se nota en el ángulo costovertebral y el flanco, y en el cólico baja hacia la ingle siguiendo el uréter. Como las fibras viscerales y cutáneas convergen en las mismas neuronas, la piel de esa zona también puede doler.',
                'La fiebre, los escalofríos y los cambios en la orina vienen del propio órgano, no de la columna: por eso pesan tanto en la valoración.'
              ],
              metafora: 'Como una alarma con el cableado cruzado: salta en el riñón, pero el panel de la centralita marca «espalda».'
            },
            fuentes: ['Goodman 2018', 'Sanvictores 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Screening for renal and urologic causes of back pain», pp. 550–552.',
              { texto: 'Sanvictores 2023 — Sanvictores, Jozsa y Tadi, «Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560843/' }
            ]
          } },
        { id: 'l6', text: '¿Presenta incontinencia urinaria o intestinal, o pérdida de sensibilidad en la zona de "silla de montar"?', alerta: true, s1: true, urgencia: 'Sospecha de cauda equina: derivación a urgencias hoy (RM de elección).',
          razonamiento: {
            porque: 'Las raíces de la cola de caballo son las que gobiernan la vejiga, el recto y la sensibilidad del periné. Si un disco, un tumor, una fractura o una infección las comprime, aparecen anestesia en silla de montar y cambios en el control de la orina o las heces: es una urgencia neurológica.',
            peso: 'Ningún síntoma aislado confirma ni descarta el síndrome: en la revisión sistemática todos tienen cocientes de probabilidad bajos, y la RM es el patrón de referencia. Por eso un SÍ no espera a que el cuadro se complete: el marco IFOMPT pide un umbral bajo para la RM urgente y se deriva hoy a urgencias (ver el recuadro de urgencia de la región).',
            detalle: 'Mecanismo: el conducto es más estrecho en la unión lumbosacra y las raíces de la cola de caballo van muy juntas. La compresión por hernia discal, tumor, fractura, infección o inflamación produce lumbalgia, ciática uni o bilateral, anestesia en silla de montar, cambios de vejiga e intestino (dificultad para iniciar la micción, retención, incontinencia urinaria o fecal, estreñimiento), disfunción sexual, debilidad y pérdida de reflejos en las piernas. El tono anal puede alterarse tarde, y algunos pacientes tienen tono anal anormal sin anestesia en silla de montar.\n\nCuánto pesa cada síntoma: en la revisión de Fairbank 2011 (cuatro estudios de pacientes con sospecha, con RM como referencia) la prevalencia real fue del 14–48 %. La lumbalgia y la incontinencia fecal fueron sensibles pero poco específicas; la ciática bilateral y el tono anal disminuido, más específicos pero poco sensibles; los síntomas urinarios, variables. Ninguno tuvo un cociente de probabilidad capaz de confirmar o descartar el síndrome.\n\nQué hacer (Finucane 2020): ante sospecha, exploración neurológica completa con sensibilidad en silla de montar. La mayoría de las personas con retención urinaria no tendrán una compresión crítica, pero como ningún síntoma lo predice de forma fiable el umbral para la RM urgente debe ser bajo. Lo que cuenta es el cambio: preguntar si ya tenía problemas de vejiga o intestino, cuándo empezaron los cambios y si coinciden con un fármaco nuevo. Si aún no hay síndrome pero preocupa que aparezca, explicar al paciente qué vigilar y qué hacer (red de seguridad).\n\nContraste (StatPearls, Rider y Marra 2023): los síntomas aislados no son ni sensibles ni específicos; es el conjunto lo que debe levantar la sospecha. La anestesia perineal junto a la disfunción vesical marca el inicio típico y es cuando «empieza a correr el reloj». La retención urinaria indolora es el síntoma aislado más predictivo, pero suele indicar un síndrome tardío y a menudo irreversible: no hay que esperarla. La descompresión en las primeras 48 horas se asocia a mejor pronóstico; la RM es el patrón de referencia y, en urgencias, lo ideal es hacerla en la primera hora.',
            fisiologia: {
              pasos: [
                'La médula termina hacia L1; por debajo, las raíces lumbares y sacras bajan juntas por el canal formando la cola de caballo, que lleva la inervación motora y sensitiva de las piernas, la vejiga, el ano y el periné.',
                'Una hernia discal grande (la causa más frecuente), un absceso o un hematoma epidural, un tumor o una fractura ocupan el canal y comprimen esas raíces.',
                'Al comprimirse las fibras autonómicas que gobiernan la vejiga aparece retención o incontinencia; las fibras sensitivas sacras dan la anestesia en silla de montar, y las motoras, debilidad y pérdida de reflejos en las piernas.',
                'Cuanto más dura la compresión, mayor es el daño estructural y funcional permanente: por eso la descompresión precoz (idealmente antes de 48 horas) mejora el pronóstico.'
              ],
              metafora: 'Como un mazo de cables que pasa por un tubo estrecho: si algo aplasta el tubo, fallan a la vez las piernas, la vejiga y el periné, y cuanto más tiempo siga aplastado, más cables quedan dañados para siempre.'
            },
            fuentes: ['Goodman 2018', 'Fairbank 2011', 'Finucane 2020', 'Rider y Marra 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Neurogenic» y tabla «Cauda equina syndrome», pp. 536–537 y 552.',
              { texto: 'Fairbank 2011 — Fairbank, Hashimoto, Dailey, Patel y Dettori, «Does patient history and physical examination predict MRI proven cauda equina syndrome?», Evid Based Spine Care J 2011;2(4):27–33 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3506147/' },
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 2 (síndrome de cola de caballo), pp. 9–17.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Rider y Marra 2023 — Rider y Marra, «Cauda Equina and Conus Medullaris Syndromes», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537200/' }
            ]
          } },
        { id: 'l_u3a', text: '¿En las últimas 3–4 semanas ha notado ardor o dolor al orinar?', alerta: true,
          razonamiento: {
            porque: 'La infección de las vías urinarias bajas irrita la vejiga y la uretra y puede referir dolor a la zona lumbar, pélvica o sacra. Muchas veces el paciente solo consulta por la espalda y el escozor al orinar sale únicamente si se pregunta.',
            peso: 'Orienta a un origen urinario si acompaña a una lumbalgia sin causa mecánica clara, sobre todo con fiebre, sangre en la orina o dolor en el flanco. Solo, no localiza el origen del dolor de espalda; algunos pacientes con problemas urinarios no tienen ningún síntoma urinario.',
            detalle: 'Mecanismo: las vías urinarias bajas (vejiga y uretra) no tocan el diafragma, así que no refieren dolor al hombro, pero sí a la zona lumbar baja, la pelvis o el sacro. La intensidad depende de la gravedad de la infección. En el varón, la prostatitis da también escozor, frecuencia, nicturia y dolor lumbar, perineal o en la cara interna del muslo.\n\nQué preguntar junto a esta: frecuencia, urgencia, nicturia, sangre en la orina, fiebre, escalofríos, náuseas, dolor testicular y antecedentes de infecciones urinarias o cálculos. Lo que importa es el cambio respecto a lo habitual en ese paciente.',
            fisiologia: {
              pasos: [
                'Bacterias de la zona que rodea la uretra, muchas veces de origen intestinal, suben por la uretra hasta la vejiga; en la mujer lo facilitan la cercanía de la uretra al ano y su menor longitud.',
                'Los uropatógenos, como Escherichia coli, se adhieren al epitelio de la vejiga mediante adhesinas y lo invaden.',
                'Esa adherencia desencadena una respuesta inflamatoria: escozor al orinar, frecuencia, urgencia y molestia por encima del pubis.',
                'La vejiga y la uretra refieren el dolor a la zona lumbar baja, la pelvis o el sacro.',
                'Sin tratamiento, la infección puede subir hasta el riñón (pielonefritis): dolor en el flanco, dolor a la percusión del ángulo costovertebral, fiebre, escalofríos, náuseas y vómitos; en los casos graves, bacteriemia y sepsis.'
              ],
              metafora: 'Como una invasión que remonta un río: entra por la desembocadura (la uretra), se instala en el lago (la vejiga) y, si nadie la frena, sigue río arriba hasta el riñón.'
            },
            fuentes: ['Goodman 2018', 'Gill 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 550–552 y «Screening for male reproductive causes of back pain», pp. 561–562.',
              { texto: 'Gill 2025 — Gill, Leslie y Minter, «Acute Cystitis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459322/' }
            ]
          } },
        { id: 'l_u3b', text: '¿Desde hace poco se levanta a orinar más de una vez cada noche, sin que haya cambiado lo que bebe antes de acostarse?', alerta: true,
          razonamiento: {
            porque: 'Levantarse a orinar más de lo habitual sin beber más puede reflejar una infección, una obstrucción por la próstata u otro problema urinario. La clave es el cambio reciente, no la nicturia en sí.',
            peso: 'Poco específico solo: muchas mujeres tienen nicturia tras los partos, y Goodman recuerda que la mayoría de los hombres no se levantan de noche a orinar hasta después de los 65. Pesa como cambio nuevo junto a dolor lumbar, pélvico o sacro y otros síntomas urinarios.',
            detalle: 'Mecanismo: cualquier obstrucción, crecimiento o inflamación de la próstata afecta a la uretra y da dificultad para iniciar o mantener el chorro, frecuencia y nicturia; la infección urinaria da frecuencia, urgencia y nicturia. El cáncer de próstata puede no dar síntomas hasta que aparece la obstrucción urinaria o una ciática por metástasis en la pelvis, la columna lumbar o el fémur.\n\nCómo preguntar: muchos pacientes no se dan cuenta del cambio, y a menudo es la pareja quien confirma que se levanta de noche. Por eso la pregunta se ancla en «desde hace poco» y en que no ha cambiado lo que bebe.',
            fisiologia: {
              pasos: [
                'De noche se fabrica normalmente menos orina: durante el sueño sube la vasopresina (hormona antidiurética), que actúa en los túbulos colectores del riñón y hace que se reabsorba más agua.',
                'Si ese aumento nocturno se reduce o falta —tiende a desaparecer con la edad, y también lo alteran la insuficiencia cardíaca, la apnea del sueño o algunos fármacos—, se produce demasiada orina de noche (poliuria nocturna), la causa más frecuente de nicturia.',
                'Cuando la vejiga almacena mal (vejiga hiperactiva, infección urinaria, prostatitis o próstata aumentada), el paciente se levanta muchas veces y orina poca cantidad cada vez; en los jóvenes es la causa más frecuente.',
                'Cualquier obstrucción, crecimiento o inflamación de la próstata afecta a la uretra: dificultad para iniciar o mantener el chorro, frecuencia y nicturia.'
              ],
              nota: 'Beber mucho por la tarde, la cafeína y el alcohol también la aumentan: por eso la pregunta se ancla en un cambio reciente sin cambios en lo que se bebe.',
              metafora: 'Como un depósito que se llena de noche: o entra demasiada agua, porque el riñón no recibe la orden nocturna de ahorrar, o el depósito se ha vuelto pequeño o irritable y avisa antes de estar lleno.'
            },
            fuentes: ['Goodman 2018', 'Leslie 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, p. 552 y pp. 561–562.',
              { texto: 'Leslie 2024 — Leslie, Sajjad y Singh, «Nocturia», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK518987/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Lumbar posterior (flanco)', desc: 'Riñones → ángulo costovertebral' },
        { zona: 'Ingle / Genitales', desc: 'Uréter: flanco → abdomen inferior → ingle → testículos o labios mayores' },
        { zona: 'Suprapúbico / Sacro', desc: 'Próstata, vejiga' }
      ],
      impactoDescanso: ['Cólico renal: dolor constante que impide toda posición cómoda', 'Nicturia fragmenta el ciclo de sueño'],
      impactoEjercicio: ['Insuficiencia renal: anemia con fatiga extrema', 'Espasmo del psoas ilíaco altera biomecánica de la marcha']
    },
    {
      id: 'l_gi', icon: '🫃', nombre: 'Gastrointestinal',
      banderasRojas: [
        'Dolor sacro/lumbar que se alivia al pasar gases o defecar',
        'Heces negras alquitranadas, sangre en heces',
        'Dolor nocturno intenso entre medianoche y 3 am',
        'Pérdida de peso inexplicada o saciedad precoz'
      ],
      banderasAmarillas: [
        'Dolor de espalda y abdominal al mismo nivel (simultáneo o alterno)',
        'Uso crónico de AINEs',
        'Dolor modificado por ingesta o defecación'
      ],
      preguntas: [
        { id: 'l1', text: '¿El dolor lumbar, sacro o pélvico se alivia o cambia después de tener una evacuación intestinal o al expulsar gases?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El intestino grueso y el recto refieren dolor a la zona lumbar baja y al sacro. Si el dolor cede o cambia al expulsar gases o al defecar, la fuente probable es visceral (distensión del intestino), no la columna.',
            peso: 'Es una bandera roja de origen digestivo y un SÍ pide más preguntas sobre el intestino: hábito, sangre, dolor abdominal al mismo nivel, antecedentes de colitis, Crohn o colon irritable. Se valora con el resto del cuadro, no aislado.',
            detalle: 'Mecanismo: el dolor visceral se refiere a la piel y al músculo que comparten segmento medular con el órgano. El intestino delgado y el grueso pueden referir dolor a la zona lumbar o sacra cuando el estímulo es intenso. Si la distensión es la causa, el dolor se reduce al vaciar el intestino.\n\nQué buscar con un SÍ: dolor abdominal y lumbar al mismo nivel, a la vez o alternando (bandera roja por sí misma; en un caso del libro era un cáncer de colon avanzado); cambios en las heces o sangre; relación con las comidas; uso prolongado de antibióticos o AINE; dolor en otras articulaciones o erupciones cutáneas (artritis enteropática). Un 25 % de las personas con enfermedad digestiva tiene dolor de espalda o articular.\n\nCon qué se confunde: la coccigodinia también empeora al defecar o al expulsar gases, pero por presión local sobre el cóccix, no por distensión del intestino.',
            fisiologia: {
              pasos: [
                'La distensión o la inflamación del intestino activan sus fibras aferentes viscerales.',
                'Esas fibras llegan por la raíz dorsal al asta dorsal de la médula, donde hacen sinapsis con una segunda neurona.',
                'Varias neuronas sensitivas, viscerales y somáticas, convergen en la misma vía ascendente de la médula: el cerebro no distingue de dónde viene la señal y la atribuye a una zona del cuerpo (piel, músculo, hueso) en lugar de al órgano. Es el dolor referido.',
                'El intestino grueso y el recto refieren así el dolor a la zona lumbar baja y al sacro.',
                'Si el estímulo es la distensión, al expulsar gases o heces disminuye y el dolor «de espalda» cede: la columna no era el origen.'
              ],
              metafora: 'Como dos teléfonos que comparten la misma línea: la centralita (la médula) recibe la llamada pero no sabe desde cuál se hizo, y el cerebro la atribuye a la espalda.'
            },
            fuentes: ['Goodman 2018', 'Sanvictores 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 555–556; cap. 15, cuadro 15.1 (p. 581) y pp. 584–585.',
              { texto: 'Sanvictores 2023 — Sanvictores, Jozsa y Tadi, «Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560843/' }
            ]
          } },
        { id: 'l3', text: '¿El dolor está relacionado con su ciclo menstrual, tiene sangrado inusual o dolor que alterna con dolor abdominal?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Los órganos pélvicos comparten inervación con la zona lumbar y sacra. Un dolor que sigue al ciclo menstrual, que se acompaña de sangrado anormal o que alterna con dolor abdominal al mismo nivel apunta a un origen visceral (ginecológico o digestivo), no mecánico.',
            peso: 'Un SÍ no implica patología: el dolor lumbar con la regla puede ser habitual en esa mujer y muchos problemas del suelo pélvico los trata un fisioterapeuta especializado. Pesa más si es nuevo, si hay sangrado fuera de la regla o tras la menopausia, o si el dolor abdominal y el lumbar alternan al mismo nivel.',
            detalle: 'Mecanismo: la endometriosis (tejido endometrial fuera del útero) sangra con cada ciclo y da dolor lumbar, pélvico, de cadera o sacro que empeora justo antes de la regla y en sus primeros días. Los quistes de ovario y los miomas pueden dar un patrón cíclico parecido. El dolor de origen menstrual suele aparecer en la ovulación (días 10–14) y justo antes o durante la regla (días 23–28), y puede referirse al recto, al sacro o al cóccix.\n\nQué buscar con un SÍ: relación con el ciclo (pedir que lo anote si no lo sabe), sangrado entre reglas o tras la menopausia, reglas más largas o abundantes, dolor con las relaciones o al defecar u orinar durante la regla, flujo anormal, DIU, posibilidad de embarazo. Dolor abdominal y lumbar al mismo nivel, alternando, es una bandera roja que requiere derivación.\n\nUrgencia: dolor súbito e intenso en una mujer en edad fértil, sexualmente activa, puede ser un embarazo ectópico roto (urgencia médica).',
            fisiologia: {
              pasos: [
                'Los órganos del abdomen y de la pelvis tienen fibras aferentes viscerales; su actividad normal no llega a la consciencia, pero la que señala dolor sí.',
                'Esas fibras llegan al asta dorsal de la médula, donde varias neuronas sensitivas, viscerales y somáticas, convergen en la misma vía ascendente: el cerebro no distingue de dónde viene la señal y la atribuye a la piel, el músculo o el hueso. Es el dolor referido.',
                'Por eso un órgano del abdomen o de la pelvis puede doler en la zona lumbar o sacra. Si el dolor de espalda alterna con dolor abdominal al mismo nivel, o sigue al ciclo menstrual, el origen probable es una víscera y no la columna.',
                'Un ejemplo ginecológico es la endometriosis: implantes de tejido endometrial fuera del útero que dependen del estradiol y se llenan de sangre con cada ciclo; de ahí el dolor cíclico lumbar, pélvico o sacro.'
              ],
              metafora: 'Como varios teléfonos que comparten una sola línea: la centralita (la médula) recibe la llamada del intestino o del útero, pero no sabe desde cuál se hizo, y el cerebro la atribuye a la espalda.'
            },
            fuentes: ['Goodman 2018', 'Sanvictores 2023', 'Consoli y Carlson 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 555 y 557–561.',
              { texto: 'Sanvictores 2023 — Sanvictores, Jozsa y Tadi, «Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560843/' },
              { texto: 'Consoli y Carlson 2026 — Consoli y Carlson, «Endometriosis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK567777/' }
            ]
          } },
        { id: 'l_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces, o dolor que lo despierta entre la medianoche y las 3 am?', alerta: true,
          razonamiento: {
            porque: 'La sangre digerida en el tubo digestivo alto se oxida y vuelve las heces negras, pegajosas y malolientes (melena): suele venir de una úlcera, a menudo por AINE. La úlcera duodenal refiere dolor a la espalda y es típico que despierte entre la medianoche y las 3.',
            peso: 'La melena o la sangre en las heces siempre requieren valoración médica, aunque no expliquen el dolor de espalda. El dolor nocturno a esas horas, aislado, es menos específico; orienta a úlcera si se alivia al comer, y a algo más serio si es intenso y constante.',
            detalle: 'Mecanismo: la úlcera gástrica o duodenal puede dar dolor solo en la espalda (columna torácica media, T6–T10). La úlcera duodenal duele 2–3 horas después de comer y de noche, entre la medianoche y las 3; comer la alivia. El dolor nocturno del cáncer se distingue por ser intenso y constante, y por no aliviarse con nada. La causa más frecuente de dolor de espalda de origen gástrico o duodenal es el uso prolongado de AINE.\n\nCon qué se confunde: la sangre roja brillante suele venir del recto o el ano (hemorroides, fisuras), pero también puede ser un cáncer colorrectal: lo valora el médico. Las heces rojizas pueden deberse a la remolacha o a colorantes, y los preparados con bismuto ennegrecen las heces y la lengua.\n\nQué preguntar: uso de AINE o anticoagulantes, antecedentes de úlcera, Crohn, colitis o diverticulitis, relación del dolor con las comidas y alivio con antiácidos.',
            fisiologia: {
              pasos: [
                'Las prostaglandinas protegen la mucosa del estómago: mantienen la producción de moco y bicarbonato y el riego de la mucosa.',
                'Los AINE bloquean la enzima COX-1 y, con ella, la síntesis de prostaglandinas: bajan el moco, el bicarbonato y el riego. Helicobacter pylori, la otra gran causa, inflama la mucosa y también reduce el bicarbonato.',
                'Sin esa barrera, el ácido y la pepsina atacan las capas profundas y se forma una úlcera, sobre todo en el estómago y la primera parte del duodeno.',
                'La úlcera duodenal duele 2–3 horas después de comer (la gástrica, a los 15–30 minutos), y puede despertar de madrugada y referir el dolor solo a la espalda.',
                'La úlcera es la causa más frecuente de hemorragia digestiva alta. Esa sangre sale como melena: heces negras, pegajosas, alquitranadas y de olor característico. El hierro y el bismuto ennegrecen las heces sin que haya sangrado.'
              ],
              metafora: 'Como el barniz de una tabla de cortar: las prostaglandinas lo mantienen, el AINE lo va quitando y el ácido acaba abriendo surcos en la madera.'
            },
            fuentes: ['Goodman 2018', 'Malik 2023', 'Antunes 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 306–307; cap. 14, pp. 553–555.',
              { texto: 'Malik 2023 — Malik, Gnanapandithan y Singh, «Peptic Ulcer Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534792/' },
              { texto: 'Antunes 2024 — Antunes, Tian y Copelin, «Upper Gastrointestinal Bleeding», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470300/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Lumbar / Pelvis / Sacro', desc: 'Intestino grueso, colon, recto' },
        { zona: 'Columna torácica (T6-T10)', desc: 'Estómago, duodeno, páncreas, vesícula' },
        { zona: 'Cadera / Ingle', desc: 'Absceso del psoas (apendicitis, diverticulitis, Crohn)' }
      ],
      impactoDescanso: ['Dolor nocturno GI (12–3 am) con úlceras o cáncer interrumpe el sueño'],
      impactoEjercicio: ['Mala absorción de nutrientes compromete la recuperación muscular', 'Anemia ferropénica por sangrado oculto: fatiga y disnea']
    },
    {
      id: 'l_espondilo', icon: '🦴', nombre: 'Espondiloartropatías / Espondilogénicas / Ginecológico',
      banderasRojas: [
        'Rigidez matutina prolongada >30 min que mejora con actividad (espondiloartritis)',
        'Despertar por dolor en segunda mitad de la noche — patrón inflamatorio',
        'Síntomas oculares (uveítis) o cutáneos (psoriasis) asociados',
        'Fractura por insuficiencia: dolor lumbar súbito en paciente con osteoporosis o Paget',
        'Embarazo ectópico: dolor pélvico unilateral severo con sangrado (urgencia)',
        'Fractura sacra por estrés: mujer deportista con actividad vigorosa y repetitiva, dolor en nalga que reproduce la carrera, dieta pobre, alteraciones menstruales o fracturas de estrés previas. Signo de la nalga; la radiografía inicial suele ser normal: la confirman la gammagrafía o la RM (Goodman 2018, cap. 15)',
        'Espondilolistesis aguda: joven con lesiones repetidas en hiperextensión, ciática bilateral súbita durante el deporte, dolor en extensión'
      ],
      banderasAmarillas: [
        'Dolor sacroilíaco bilateral alterno',
        'Dolor relacionado con ciclo menstrual (endometriosis)',
        'Historia familiar de espondilitis anquilosante',
        'Antecedente de osteoporosis o uso prolongado de corticosteroides (riesgo de fractura por insuficiencia)',
        'Engrosamiento óseo palpable o deformidad (Paget)'
      ],
      preguntas: [
        { id: 'l5', text: '¿Tiene rigidez matutina prolongada (más de 30 minutos) que mejora con el movimiento?', alerta: true, s1: true,
          razonamiento: {
            porque: 'En las espondiloartropatías (espondilitis anquilosante, artritis psoriásica, reactiva o de la enfermedad inflamatoria intestinal) la inflamación de la sacroilíaca y la columna empeora con la inactividad: tras la noche aparece una rigidez larga que mejora al moverse. El dolor mecánico suele ir al revés: empeora con el movimiento.',
            peso: 'Solo cuenta dentro del criterio de dolor lumbar inflamatorio (menores de 45 años con dolor de más de 3 meses): 2 de 4 preguntas positivas dan sensibilidad del 70 % y especificidad del 81 %; con 3 de 4, la especificidad roza el 100 % y la sensibilidad baja al 33 %. Aislado, no diagnostica nada.',
            detalle: 'Mecanismo: la espondiloartropatía se caracteriza por dolor en la segunda parte de la noche y rigidez prolongada que mejora con la actividad, con limitación de la movilidad en todas las direcciones y dolor a la presión en la columna y las sacroilíacas. Suele acompañarse de otros signos sistémicos (fiebre, lesiones cutáneas, pérdida de apetito o de peso), y hay predisposición genética.\n\nQué buscar con un SÍ: dolor en otras articulaciones, psoriasis o erupciones, ojo rojo y doloroso (conjuntivitis), diarrea o enfermedad inflamatoria intestinal, síntomas urinarios o infección de transmisión sexual reciente (artritis reactiva), y antecedentes familiares.\n\nEl criterio (Goodman, cap. 14): a cualquier persona menor de 45 años con dolor lumbar, de cadera, de nalga o sacro de más de 3 meses, preguntarle por rigidez matutina de más de 30 minutos, dolor que la despierta en la segunda mitad de la noche, dolor que alterna de una nalga a otra y dolor que no se alivia con el reposo. La app lo evalúa sola con la edad de la fase 1 y la cronología, y lo muestra bajo las preguntas de este sistema.\n\nContraste (StatPearls, Lassiter 2024): el dolor lumbar inflamatorio es frecuente (en torno al 5–6 % de los adultos de EE. UU.) y bastante más que las espondiloartropatías (0,9–1,4 %), así que no es diagnóstico por sí mismo: sirve como criterio para derivar a reumatología. Lo caracterizan el inicio insidioso antes de los 40 años, más de 3 meses de evolución, la rigidez matutina que mejora con el ejercicio, el dolor que no mejora con el reposo, el dolor nocturno que mejora al levantarse y moverse, y el dolor de nalga que alterna de lado. El dolor mecánico, en cambio, suele empeorar con el movimiento y el ejercicio, y suele tener un inicio más agudo ligado a una lesión.',
            fisiologia: {
              pasos: [
                'Una respuesta inflamatoria sistémica, de origen conocido o no (en la artritis reactiva, una infección intestinal previa), lleva mediadores inflamatorios a las articulaciones del esqueleto axial, sobre todo a las sacroilíacas.',
                'Allí, citoquinas como la IL-17 y el TNF mantienen la inflamación en las entesis (donde tendones y ligamentos se anclan al hueso) y en las articulaciones; el gen HLA-B27 interviene en varios de esos pasos.',
                'La inflamación persistente erosiona el hueso y, a la vez, estimula la formación de hueso nuevo (sindesmofitos): con los años, la columna puede llegar a fusionarse.',
                'Clínicamente da el patrón inflamatorio: dolor de inicio insidioso que no mejora con el reposo, rigidez matutina y dolor nocturno que mejoran al levantarse y moverse.'
              ],
              nota: 'Por qué el movimiento alivia la rigidez no lo explica la fuente leída: es la seña clínica que distingue este dolor del mecánico, no un mecanismo demostrado aquí.',
              metafora: 'Como un fuego lento en las bisagras de la columna: el cuerpo intenta repararlas poniendo hueso nuevo, y con los años las bisagras pueden soldarse.'
            },
            fuentes: ['Goodman 2018', 'Lassiter 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 534–535; cap. 15, pp. 581–583.',
              { texto: 'Lassiter 2024 — Lassiter, Bhutta y Allam, «Inflammatory Back Pain and Spondyloarthropathies», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539753/' }
            ]
          } },
        { id: 'l5c', text: '¿El dolor cambia de un glúteo a otro, unas veces en un lado y otras en el otro?', alerta: false,
          razonamiento: {
            porque: 'Las espondiloartropatías inflaman las sacroilíacas (la sacroileítis está presente en toda espondilitis anquilosante), y un dolor que pasa de una nalga a otra es una de las cuatro preguntas del criterio de dolor lumbar inflamatorio.',
            peso: 'Solo cuenta dentro del criterio de dolor lumbar inflamatorio (menores de 45 años con dolor de más de 3 meses): 2 de 4 preguntas positivas dan sensibilidad del 70 % y especificidad del 81 %; con 3 de 4, la especificidad roza el 100 % y la sensibilidad baja al 33 %. Aislado, no diagnostica nada.',
            detalle: 'Mecanismo: la sacroileítis está presente en todas las personas con espondilitis anquilosante, y las enfermedades reumáticas erosivas no infecciosas (espondilitis anquilosante, artritis reactiva, psoriásica y la asociada a enfermedad inflamatoria intestinal) son la causa sistémica más frecuente de dolor sacro.\n\nEl criterio (Goodman, cap. 14): a cualquier persona menor de 45 años con dolor lumbar, de cadera, de nalga o sacro de más de 3 meses, preguntarle por rigidez matutina de más de 30 minutos, dolor que la despierta en la segunda mitad de la noche, dolor que alterna de una nalga a otra y dolor que no se alivia con el reposo. La app lo evalúa sola con la edad de la fase 1 y la cronología, y lo muestra bajo las preguntas de este sistema.\n\nContraste (StatPearls, Lassiter 2024): el dolor lumbar inflamatorio es frecuente (en torno al 5–6 % de los adultos de EE. UU.) y bastante más que las espondiloartropatías (0,9–1,4 %), así que no es diagnóstico por sí mismo: sirve como criterio para derivar a reumatología. Lo caracterizan el inicio insidioso antes de los 40 años, más de 3 meses de evolución, la rigidez matutina que mejora con el ejercicio, el dolor que no mejora con el reposo, el dolor nocturno que mejora al levantarse y moverse, y el dolor de nalga que alterna de lado. El dolor mecánico, en cambio, suele empeorar con el movimiento y el ejercicio, y suele tener un inicio más agudo ligado a una lesión.',
            fisiologia: {
              pasos: [
                'Una respuesta inflamatoria sistémica, de origen conocido o no (en la artritis reactiva, una infección intestinal previa), lleva mediadores inflamatorios a las articulaciones del esqueleto axial, sobre todo a las sacroilíacas.',
                'Allí, citoquinas como la IL-17 y el TNF mantienen la inflamación en las entesis (donde tendones y ligamentos se anclan al hueso) y en las articulaciones; el gen HLA-B27 interviene en varios de esos pasos.',
                'La inflamación persistente erosiona el hueso y, a la vez, estimula la formación de hueso nuevo (sindesmofitos): con los años, la columna puede llegar a fusionarse.',
                'Una de las señas del dolor inflamatorio es que el dolor de nalga alterna de un lado a otro.'
              ],
              nota: 'La fuente leída recoge la alternancia como rasgo clínico, pero no explica por qué cambia de lado.',
              metafora: 'Como un fuego lento en las bisagras de la columna: el cuerpo intenta repararlas poniendo hueso nuevo, y con los años las bisagras pueden soldarse.'
            },
            fuentes: ['Goodman 2018', 'Lassiter 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 534–535; cap. 15, pp. 581–583.',
              { texto: 'Lassiter 2024 — Lassiter, Bhutta y Allam, «Inflammatory Back Pain and Spondyloarthropathies», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539753/' }
            ]
          } },
        { id: 'l5d', text: '¿El dolor sigue igual o empeora cuando descansa, en lugar de aliviarse?', alerta: false,
          razonamiento: {
            porque: 'El dolor inflamatorio no mejora con el reposo, e incluso empeora con la inactividad; el dolor mecánico suele aliviarse al descansar. Que el reposo no alivie es una de las cuatro preguntas del criterio de dolor lumbar inflamatorio.',
            peso: 'Solo cuenta dentro del criterio de dolor lumbar inflamatorio (menores de 45 años con dolor de más de 3 meses): 2 de 4 preguntas positivas dan sensibilidad del 70 % y especificidad del 81 %; con 3 de 4, la especificidad roza el 100 % y la sensibilidad baja al 33 %. Aislado, no diagnostica nada. Fuera del criterio, el dolor que no cede con el reposo también aparece en la infección discal y en los tumores.',
            detalle: 'Mecanismo: en las espondiloartropatías la rigidez y el dolor empeoran tras la inmovilidad y mejoran con la actividad. Goodman formula la pregunta al revés («¿el reposo le alivia el dolor?»): para el criterio cuenta la respuesta NO, que en esta app es el SÍ de «sigue igual o empeora cuando descansa».\n\nCon qué se confunde: la infección del espacio discal da un dolor que empeora con la actividad y, a diferencia de la mayoría de las lumbalgias, no se alivia con el reposo; el dolor tumoral tampoco depende de la carga ni de la postura.\n\nEl criterio (Goodman, cap. 14): a cualquier persona menor de 45 años con dolor lumbar, de cadera, de nalga o sacro de más de 3 meses, preguntarle por rigidez matutina de más de 30 minutos, dolor que la despierta en la segunda mitad de la noche, dolor que alterna de una nalga a otra y dolor que no se alivia con el reposo. La app lo evalúa sola con la edad de la fase 1 y la cronología, y lo muestra bajo las preguntas de este sistema.\n\nContraste (StatPearls, Lassiter 2024): el dolor lumbar inflamatorio es frecuente (en torno al 5–6 % de los adultos de EE. UU.) y bastante más que las espondiloartropatías (0,9–1,4 %), así que no es diagnóstico por sí mismo: sirve como criterio para derivar a reumatología. Lo caracterizan el inicio insidioso antes de los 40 años, más de 3 meses de evolución, la rigidez matutina que mejora con el ejercicio, el dolor que no mejora con el reposo, el dolor nocturno que mejora al levantarse y moverse, y el dolor de nalga que alterna de lado. El dolor mecánico, en cambio, suele empeorar con el movimiento y el ejercicio, y suele tener un inicio más agudo ligado a una lesión.',
            fisiologia: {
              pasos: [
                'Una respuesta inflamatoria sistémica, de origen conocido o no (en la artritis reactiva, una infección intestinal previa), lleva mediadores inflamatorios a las articulaciones del esqueleto axial, sobre todo a las sacroilíacas.',
                'Allí, citoquinas como la IL-17 y el TNF mantienen la inflamación en las entesis (donde tendones y ligamentos se anclan al hueso) y en las articulaciones; el gen HLA-B27 interviene en varios de esos pasos.',
                'La inflamación persistente erosiona el hueso y, a la vez, estimula la formación de hueso nuevo (sindesmofitos): con los años, la columna puede llegar a fusionarse.',
                'Clínicamente, este dolor no mejora con el reposo y sí con el ejercicio; el dolor mecánico suele empeorar con el movimiento.'
              ],
              nota: 'Por qué el reposo no alivia y el movimiento sí no lo explica la fuente leída: es la seña clínica que distingue este dolor del mecánico.',
              metafora: 'Como un fuego lento en las bisagras de la columna: el cuerpo intenta repararlas poniendo hueso nuevo, y con los años las bisagras pueden soldarse.'
            },
            fuentes: ['Goodman 2018', 'Lassiter 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 534–535, 542 y 563.',
              { texto: 'Lassiter 2024 — Lassiter, Bhutta y Allam, «Inflammatory Back Pain and Spondyloarthropathies», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539753/' }
            ]
          } },
        { id: 'l_e2', text: '¿El dolor sacroilíaco lo despierta en la segunda mitad de la noche (entre las 2 y las 5 am)?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El dolor de las espondiloartropatías se concentra en la segunda mitad de la noche: tras horas de inmovilidad, la inflamación de la sacroilíaca despierta al paciente de madrugada y mejora al levantarse y moverse.',
            peso: 'Solo cuenta dentro del criterio de dolor lumbar inflamatorio (menores de 45 años con dolor de más de 3 meses): 2 de 4 preguntas positivas dan sensibilidad del 70 % y especificidad del 81 %; con 3 de 4, la especificidad roza el 100 % y la sensibilidad baja al 33 %. Aislado, no diagnostica nada. Otras causas de dolor nocturno (tumor, infección, úlcera) no siguen esta franja horaria ni mejoran al moverse.',
            detalle: 'Mecanismo: Goodman describe la espondiloartropatía por el dolor en la última parte de la noche, con rigidez prolongada que mejora con la actividad.\n\nCon qué se confunde: el dolor tumoral también es nocturno, pero no deja volver a dormir y no mejora con el movimiento; la úlcera duodenal despierta entre la medianoche y las 3 y se alivia al comer.\n\nEl criterio (Goodman, cap. 14): a cualquier persona menor de 45 años con dolor lumbar, de cadera, de nalga o sacro de más de 3 meses, preguntarle por rigidez matutina de más de 30 minutos, dolor que la despierta en la segunda mitad de la noche, dolor que alterna de una nalga a otra y dolor que no se alivia con el reposo. La app lo evalúa sola con la edad de la fase 1 y la cronología, y lo muestra bajo las preguntas de este sistema.\n\nContraste (StatPearls, Lassiter 2024): el dolor lumbar inflamatorio es frecuente (en torno al 5–6 % de los adultos de EE. UU.) y bastante más que las espondiloartropatías (0,9–1,4 %), así que no es diagnóstico por sí mismo: sirve como criterio para derivar a reumatología. Lo caracterizan el inicio insidioso antes de los 40 años, más de 3 meses de evolución, la rigidez matutina que mejora con el ejercicio, el dolor que no mejora con el reposo, el dolor nocturno que mejora al levantarse y moverse, y el dolor de nalga que alterna de lado. El dolor mecánico, en cambio, suele empeorar con el movimiento y el ejercicio, y suele tener un inicio más agudo ligado a una lesión.',
            fisiologia: {
              pasos: [
                'Una respuesta inflamatoria sistémica, de origen conocido o no (en la artritis reactiva, una infección intestinal previa), lleva mediadores inflamatorios a las articulaciones del esqueleto axial, sobre todo a las sacroilíacas.',
                'Allí, citoquinas como la IL-17 y el TNF mantienen la inflamación en las entesis (donde tendones y ligamentos se anclan al hueso) y en las articulaciones; el gen HLA-B27 interviene en varios de esos pasos.',
                'La inflamación persistente erosiona el hueso y, a la vez, estimula la formación de hueso nuevo (sindesmofitos): con los años, la columna puede llegar a fusionarse.',
                'Clínicamente da dolor nocturno que mejora al levantarse y moverse; Goodman lo sitúa en la segunda mitad de la noche.'
              ],
              nota: 'Por qué el dolor aparece de madrugada y cede al moverse no lo explica la fuente leída: es un rasgo clínico, no un mecanismo demostrado aquí.',
              metafora: 'Como un fuego lento en las bisagras de la columna: el cuerpo intenta repararlas poniendo hueso nuevo, y con los años las bisagras pueden soldarse.'
            },
            fuentes: ['Goodman 2018', 'Lassiter 2024'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 8, p. 307; cap. 14, pp. 534–535.',
              { texto: 'Lassiter 2024 — Lassiter, Bhutta y Allam, «Inflammatory Back Pain and Spondyloarthropathies», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539753/' }
            ]
          } },
        { id: 'l_e3', text: '¿El dolor pélvico está claramente relacionado con el ciclo menstrual, o tiene sangrado ginecológico inusual?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Los órganos pélvicos (útero, ovarios) refieren dolor a la pelvis, el sacro y la zona lumbar. Un dolor pélvico que sigue al ciclo menstrual, o que va con sangrado ginecológico anormal, apunta a una causa ginecológica como la endometriosis, los quistes de ovario o los miomas.',
            peso: 'Un dolor ligado a la regla puede ser habitual y benigno; pesa si es nuevo o va con sangrado anormal (entre reglas, reglas más abundantes o largas, tras la menopausia). Un dolor súbito e intenso con retraso de la regla o sangrado irregular puede ser un embarazo ectópico: urgencia.',
            detalle: 'Mecanismo: en la endometriosis, el tejido endometrial fuera del útero se llena de sangre en cada ciclo; el dolor es cíclico y suele aumentar justo antes de la regla y en sus primeros días. Los quistes de ovario y los miomas pueden dar un patrón parecido; la rotura o la hemorragia de un quiste da un dolor brusco y agudo.\n\nQué buscar con un SÍ: sangrado entre reglas o tras la menopausia, reglas irregulares o más abundantes, dolor con las relaciones o al defecar u orinar durante la regla, flujo anormal, DIU, infecciones de transmisión sexual, embarazos ectópicos, abortos o infertilidad previos.\n\nUrgencia: en una mujer en edad fértil, sexualmente activa, un dolor súbito, intenso y constante en la parte baja del abdomen, la pelvis o la espalda (a veces también en el hombro) puede ser un embarazo ectópico roto. Tomar constantes y pedir ayuda médica inmediata.',
            fisiologia: {
              pasos: [
                'La teoría más aceptada es la menstruación retrógrada: células endometriales vivas refluyen por las trompas y se implantan en el peritoneo. Como eso también ocurre en muchas mujeres sin la enfermedad, hacen falta otros factores, inmunitarios y hormonales.',
                'Los implantes dependen del estradiol, que estimula su proliferación, adhesión, fibrosis e inflamación, y la formación de vasos y nervios nuevos.',
                'Con cada ciclo el tejido responde como el endometrio y se llena de sangre que no puede salir: dolor cíclico pélvico, lumbar o sacro, que aumenta antes de la regla y en sus primeros días.',
                'Según dónde estén los implantes duele la regla, las relaciones, defecar u orinar; si la enfermedad profunda infiltra nervios, el dolor puede ser neuropático.'
              ],
              nota: 'La intensidad de los síntomas no se corresponde con la extensión de la enfermedad: poco tejido puede doler mucho, y al revés.',
              metafora: 'Como esquejes de una planta que arraigan fuera de su maceta: se siguen regando con cada ciclo, pero el agua no tiene por dónde salir, y la zona se inflama y cicatriza.'
            },
            fuentes: ['Goodman 2018', 'Consoli y Carlson 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 557–561; cap. 15, «The pelvis», pp. 585 y ss.',
              { texto: 'Consoli y Carlson 2026 — Consoli y Carlson, «Endometriosis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK567777/' }
            ]
          } },
        { id: 'l_e4', text: '¿Tiene diagnóstico de osteoporosis, o ha tenido una fractura reciente ante un golpe menor o sin trauma aparente?', alerta: true,
          razonamiento: {
            porque: 'Con osteoporosis el hueso se rompe ante una carga normal o un golpe mínimo (fractura por insuficiencia): una fractura vertebral por compresión o una fractura sacra pueden presentarse como lumbalgia, a veces sin traumatismo y solo con un «chasquido».',
            peso: 'El uso prolongado de corticoides es la bandera roja de fractura que más pesa (probabilidad posprueba del 33 %); la edad avanzada y el traumatismo la suben menos, y varias banderas juntas la suben mucho más. El marco IFOMPT da evidencia alta al antecedente de osteoporosis: una fractura osteoporótica previa multiplica por 5,4 el riesgo de fractura vertebral. Aun así, no se recomienda actuar por una sola bandera roja.',
            detalle: 'Mecanismo: la fractura por insuficiencia aparece cuando una carga normal actúa sobre un hueso con poca resistencia, casi siempre por osteoporosis posmenopáusica o por corticoides, y también tras radioterapia pélvica. Puede ser insidiosa o deberse a un traumatismo menor. La fractura vertebral por compresión da a menudo un dolor agudo sobre molestias crónicas; el paciente puede recordar un «chasquido» con poco dolor, y el dolor intenso puede tardar horas o un día en aparecer. Empeora sentado o de pie mucho rato y con la maniobra de Valsalva.\n\nCuánto pesa (Downie 2013): con corticoides prolongados la probabilidad de fractura es del 33 %, con edad avanzada o traumatismo grave alrededor del 10 %, y con varias banderas juntas (mujer, más de 70 años, traumatismo grave, corticoides prolongados: tres de ellas) llega al 90 %. Ningún estudio de esa revisión evaluó el antecedente de osteoporosis.\n\nFactores de riesgo (Finucane 2020, evidencia alta): osteoporosis conocida o fractura osteoporótica previa (5,4 veces más riesgo de fractura vertebral) y corticoides orales de más de 5–7,5 mg/día durante más de 3 meses. También pesan el alcohol, el déficit de vitamina D, la artritis reumatoide, la diabetes, el tabaco, la restricción dietética o los trastornos alimentarios y la malabsorción (Crohn). Hasta el 70 % de las fracturas vertebrales osteoporóticas no se diagnostican.\n\nQué buscar con un SÍ: percusión dolorosa sobre la vértebra, pérdida de altura, cifosis. La fractura sacra puede no verse en las radiografías iniciales: la confirma la gammagrafía o la RM.',
            fisiologia: {
              pasos: [
                'El hueso se renueva en ciclos: los osteoclastos reabsorben hueso viejo y los osteoblastos rellenan los huecos con colágeno y mineral; en el adulto sano, las dos fases se compensan.',
                'Sin estrógenos (tras la menopausia) aumenta el recambio y la reabsorción supera a la formación: los estrógenos frenan la IL-6, y su falta alarga la vida de los osteoclastos.',
                'Los corticoides mantenidos reducen la formación: favorecen la supervivencia de los osteoclastos, provocan la muerte de osteoblastos y aumentan la acción de RANKL frente a su freno natural, la osteoprotegerina.',
                'El resultado es un hueso con menos masa y peor estructura que se rompe con una carga normal o un golpe mínimo (fractura por insuficiencia): una vértebra que se aplasta o un sacro que se fisura.'
              ],
              metafora: 'Como una cuenta de la que se retira más de lo que se ingresa: con los años el saldo de hueso baja, y un gasto normal, como un pequeño golpe, la deja en números rojos.'
            },
            fuentes: ['Goodman 2018', 'Downie 2013', 'Finucane 2020', 'Rowe 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Spondylogenic», pp. 538–539; cap. 15, pp. 583–584.',
              { texto: 'Downie 2013 — Downie, Williams, Henschke et al., «Red flags to screen for malignancy and fracture in patients with low back pain: systematic review», BMJ 2013;347:f7095 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3898572/' },
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 3 (fractura vertebral), pp. 24–26.', url: 'https://doi.org/10.2519/jospt.2020.9971' },
              { texto: 'Rowe 2023 — Rowe, Koller y Sharma, «Physiology, Bone Remodeling», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de marzo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499863/' }
            ]
          } },
        { id: 'l_e5', text: '¿Ha notado deformidad ósea, engrosamiento de huesos o ha sido diagnosticado de enfermedad de Paget?', alerta: true,
          razonamiento: {
            porque: 'En la enfermedad de Paget el hueso se destruye y se forma de nuevo a un ritmo acelerado y desordenado: queda agrandado, deformado y débil. Afecta sobre todo a la pelvis, el fémur, la columna lumbar y el cráneo, y su síntoma más frecuente es el dolor óseo.',
            peso: 'Más del 75 % de las personas con Paget no tienen síntomas, y suele aparecer después de los 50 años. Un diagnóstico conocido explica parte del dolor, pero también aumenta el riesgo de fractura (es factor de riesgo de fractura sacra). Un aumento brusco del dolor óseo o de la hinchazón pide valoración médica: puede ser una complicación (fractura o, rara vez, sarcoma).',
            detalle: 'Mecanismo: el aumento de la resorción y del depósito óseo da huesos más grandes pero esponjosos y frágiles; puede notarse calor y enrojecimiento sobre el hueso afectado. Las enfermedades metabólicas óseas leves o moderadas pueden no dar signos visibles; las avanzadas dan fracturas y deformidad.\n\nCon qué se confunde: el dolor óseo por Paget en la pelvis o la columna puede parecer una lumbalgia mecánica; lo que lo distingue es el dolor óseo, la deformidad o el engrosamiento óseo, y el diagnóstico previo.\n\nQué buscar con un SÍ: dolor nuevo o distinto del habitual, sobre todo con carga (posible fractura).\n\nContraste (StatPearls, Anastasopoulou y Gillespie 2026): la columna y la pelvis son los huesos más afectados, y la columna lumbar, el sacro y el cráneo están implicados en la mayoría de los casos. El dolor empeora con la carga; puede haber deformidad, dolor a la palpación y calor local por la hipervascularización. Las fracturas incompletas son frecuentes y pueden aparecer con traumatismos leves; las fracturas vertebrales pueden comprimir la médula, y la cola de caballo figura entre sus complicaciones. Es igual de frecuente en hombres y mujeres y suele aparecer después de los 50 años.',
            fisiologia: {
              pasos: [
                'El hueso se renueva toda la vida en ciclos acoplados: los osteoclastos reabsorben hueso viejo y dejan huecos (las lagunas de Howship), y los osteoblastos los rellenan con colágeno y mineral nuevos.',
                'En el Paget, los osteoclastos se activan de forma anormal y reabsorben de manera desordenada.',
                'Los osteoblastos responden con fuerza pero de forma irregular y depositan hueso inmaduro (hueso reticular o «woven»), sin la organización del hueso normal.',
                'El hueso queda más grande, pero menos compacto, más débil y muy vascularizado: por eso puede notarse calor sobre él y duele con la carga.',
                'Esa arquitectura deficiente explica las fracturas patológicas, a veces con traumatismos leves.'
              ],
              metafora: 'Como una obra con demoledores acelerados y albañiles con prisa: el muro acaba más grueso, pero con piezas mal encajadas, y aguanta peor que el original.'
            },
            fuentes: ['Goodman 2018', 'Anastasopoulou y Gillespie 2026', 'Rowe 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, p. 538; cap. 15, cuadro 15.2 y «Paget’s disease», p. 583.',
              { texto: 'Anastasopoulou y Gillespie 2026 — Anastasopoulou y Gillespie, «Paget Bone Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430805/' },
              { texto: 'Rowe 2023 — Rowe, Koller y Sharma, «Physiology, Bone Remodeling», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de marzo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499863/' }
            ]
          } },
        { id: 'l_e6', text: '¿Hace deporte o actividad vigorosa y repetitiva (p. ej. correr) y el dolor de nalga aparece con ella, con dieta pobre, alteraciones menstruales o fracturas de estrés previas?', alerta: true,
          razonamiento: {
            porque: 'La carga repetida y submáxima del deporte (correr, sobre todo) puede producir una fractura de estrés del sacro. Si además falta energía (comer poco para lo que se entrena), se alteran las hormonas, aparecen trastornos menstruales y el hueso se debilita: el riesgo de fractura de estrés aumenta.',
            peso: 'Es una combinación, no un síntoma: el riesgo lo dan el deporte de impacto repetido y los factores que debilitan el hueso. Las que más riesgo tienen son las deportistas y quien ya ha tenido una fractura de estrés. La radiografía inicial es normal en dos de cada tres casos, así que una radiografía normal no la descarta; la confirman la gammagrafía o la RM.',
            detalle: 'Mecanismo: las fracturas de estrés del sacro aparecen en personas jóvenes y activas por cargas repetidas (militares, corredores, voleibol, hockey hierba), y con menos frecuencia en embarazadas o puérperas que entrenan. Dan dolor en la nalga, el sacro, la zona lumbar, la cadera o la ingle; puede haber dolor a la palpación y cojera, y los signos son inconstantes. Se confunden con un problema discal.\n\nLa baja disponibilidad de energía (Cabre 2022): cuando la ingesta no cubre el gasto del ejercicio se suprimen las hormonas reproductivas; la forma más grave es la amenorrea hipotalámica funcional. Se resiente la salud ósea y aumentan las lesiones: las lesiones óseas son 4,5 veces más frecuentes en deportistas con amenorrea hipotalámica (y en varones con testosterona baja). Las fracturas de estrés y las reglas irregulares o ausentes son de los signos más reconocibles, porque los trastornos de la conducta alimentaria se infradeclaran en los cuestionarios.\n\nQué hacer con un SÍ: lo confirma la gammagrafía o la RM; la radiografía sale normal al principio en dos de cada tres casos. Preguntar también por fracturas de estrés previas, dietas, pérdida de peso y reglas.\n\nContraste (StatPearls, May y Marappa-Ganeshan 2023): el factor de riesgo más frecuente es un aumento brusco de la actividad; entre los intrínsecos figuran el sexo femenino, los trastornos menstruales y hormonales, la baja densidad ósea y el déficit de vitamina D. El dolor empieza tras la actividad y dura cada vez más; si se sigue entrenando, aparece al despertar al día siguiente. Los cambios en la radiografía tardan 2–3 semanas en verse; la RM tiene una sensibilidad del 80–100 % y una especificidad del 100 %. La fractura de estrés del sacro se considera de bajo riesgo (suele curar con reposo relativo y vuelta progresiva).',
            fisiologia: {
              pasos: [
                'El hueso se adapta a la carga (ley de Wolff): los osteocitos detectan la tensión y coordinan a osteoclastos y osteoblastos para reforzarlo.',
                'Con cargas repetidas sin descanso suficiente, los osteoclastos reabsorben más deprisa de lo que los osteoblastos forman hueso nuevo (un ciclo completo de remodelado tarda 3–4 meses), y se acumulan microfracturas.',
                'Si la actividad sigue, las microfracturas acaban en una fractura de estrés; tras un aumento brusco del entrenamiento, los síntomas tardan unas 3 semanas en aparecer.',
                'Con poca energía disponible (comer poco para lo que se entrena) bajan los estrógenos —en el varón, la testosterona— y el hueso se debilita: el umbral de fractura baja.'
              ],
              metafora: 'Como una carretera con tráfico pesado: el equipo de mantenimiento tapa los baches, pero si el tráfico aumenta de golpe, se abren más deprisa de lo que se arreglan.'
            },
            fuentes: ['Goodman 2018', 'Cabre 2022', 'May y Marappa-Ganeshan 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, p. 539; cap. 15, cuadro 15.2 y «Fracture», pp. 583–584.',
              { texto: 'Cabre 2022 — Cabre, Moore, Smith-Ryan y Hackney, «Relative Energy Deficiency in Sport (RED-S): Scientific, Clinical, and Practical Implications for the Female Athlete», Dtsch Z Sportmed 2022;73(7):225–234 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9724109/' },
              { texto: 'May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554538/' }
            ]
          } },
        { id: 'l_e7', text: '¿Ha aparecido de golpe dolor en ambas piernas durante el deporte, tras lesiones repetidas en extensión de la espalda?', alerta: true,
          razonamiento: {
            porque: 'La hiperextensión lumbar repetida (gimnasia, lucha, fútbol americano) produce fracturas por fatiga del istmo vertebral (pars interarticularis) en adolescentes y adultos jóvenes. Si el defecto no cura, la vértebra se desliza hacia delante (espondilolistesis ístmica, sobre todo L5–S1) y puede comprimir las raíces nerviosas; por eso duele al extender la columna y puede irradiarse a las piernas.',
            peso: 'La espondilólisis puede no dar síntomas y las pruebas de provocación (la de la cigüeña) no son sensibles ni específicas: el SÍ no diagnostica. Lo que más pesa es el dolor en las dos piernas: el dolor radicular bilateral, sobre todo si empezó en una pierna y pasó a las dos, es un precursor de la cola de caballo y obliga a preguntar ya por vejiga, intestino y sensibilidad en silla de montar.',
            detalle: 'Mecanismo (StatPearls, Margetis y Gillis 2025): en la espondilolistesis ístmica el origen es un defecto del istmo. El subtipo A son fracturas por fatiga por hiperextensión repetida en deportistas jóvenes; el subtipo C, fracturas agudas traumáticas del istmo. El defecto desestabiliza los elementos posteriores y permite que el cuerpo vertebral se desplace hacia delante; el estrechamiento del foramen o del canal puede comprimir las raíces y dar radiculopatía, claudicación neurógena, dolor de nalga, entumecimiento o debilidad en las piernas y, rara vez, alteraciones de vejiga o intestino. En los casos graves puede llegar a una cola de caballo, que requiere cirugía inmediata.\n\nCómo se presenta (May y Marappa-Ganeshan 2023): la espondilólisis es una fractura de estrés singular que exige un índice de sospecha alto; en el deportista con lumbalgia, la extensión lumbar aumenta el dolor. La radiografía puede no ver los cambios iniciales; si es negativa y la sospecha persiste, la SPECT, la TC o la RM ayudan.\n\nCuánto preocupa el dolor en ambas piernas (Finucane 2020): el dolor radicular uni o bilateral, la pérdida de sensibilidad dermatómica o la debilidad miotómica son precursores de la cola de caballo, y el dolor que empieza en una pierna y pasa a las dos aumenta la probabilidad de una cola de caballo inminente. Ninguna fuente leída describe la «ciática bilateral súbita durante el deporte» como presentación típica de la espondilolistesis: la pregunta vale sobre todo como puerta a esas preguntas de urgencia.',
            fisiologia: {
              pasos: [
                'La hiperextensión repetida carga el istmo vertebral (pars interarticularis), el puente óseo entre las carillas articulares; en algunos jóvenes ese istmo es más fino y más vulnerable.',
                'El esfuerzo repetido produce una fractura por fatiga del istmo (espondilólisis); si no consolida, los elementos posteriores dejan de sujetar la vértebra.',
                'El cuerpo vertebral se desliza hacia delante (espondilolistesis ístmica, sobre todo en L5–S1); la atrofia del multífido, frecuente en esta forma, resta estabilidad.',
                'El deslizamiento estrecha el foramen y a veces el canal, y comprime raíces: dolor radicular, entumecimiento o debilidad en las piernas y, rara vez, alteraciones de vejiga o intestino.',
                'En los casos graves puede comprimir la cola de caballo, que requiere cirugía inmediata.'
              ],
              metafora: 'Como una estantería cuyo anclaje trasero se ha partido: el estante se va deslizando hacia delante y acaba pellizcando los cables que pasan por los huecos de al lado.'
            },
            fuentes: ['Margetis y Gillis 2025', 'May y Marappa-Ganeshan 2023', 'Finucane 2020'],
            citas: [
              { texto: 'Margetis y Gillis 2025 — Margetis y Gillis, «Spondylolisthesis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de marzo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430767/' },
              { texto: 'May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554538/' },
              { texto: 'Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 2 (síndrome de cola de caballo), pp. 9–11.', url: 'https://doi.org/10.2519/jospt.2020.9971' }
            ]
          } }
      ],
      // Criterio de dolor lumbar inflamatorio de Goodman (cap. 14): válido solo en <45 años
      // y >3 meses de evolución (proxy: state.cronologia === 'Crónico (>3 meses)'); con 2 de
      // las 4 preguntas positivas, Sn 70%/Sp 81%; con 3, Sp ≈100%. l5 y l_e2 ya alertan por sí
      // solas (banderas rojas independientes); l5c/l5d no tienen significado aislado en
      // Goodman — solo cuentan dentro de este criterio compuesto. Evaluado en app.js
      // (evaluarCriterioCompuesto), no cambia el `alerta` individual de cada pregunta.
      criterioCompuesto: {
        ids: ['l5', 'l_e2', 'l5c', 'l5d'],
        minPositivas: 2,
        filtro: { edadMax: 45, evolucion: 'Crónico (>3 meses)' },
        etiqueta: 'Patrón compatible con dolor lumbar inflamatorio: derivación preferente a reumatología.',
        nota: 'Criterio de Goodman (cap. 14): 2 de 4 → sensibilidad 70%, especificidad 81%; 3 de 4 → especificidad cercana al 100%. No es un diagnóstico.'
      },
      zonasDolor: [
        { zona: 'Sacroilíacas (bilateral/alterno)', desc: 'Espondilitis anquilosante, síndrome de Reiter, Crohn' },
        { zona: 'Columna lumbar difusa', desc: 'Fracturas por insuficiencia (osteoporosis), enfermedad de Paget' },
        { zona: 'Pelvis / Periné', desc: 'Endometriosis, EPI, embarazo ectópico' },
        { zona: 'Columna torácica', desc: 'Irradiación en espondiloartropatías avanzadas' }
      ],
      impactoDescanso: [
        'Rigidez matutina prolongada y despertar nocturno en segunda mitad — patrón inflamatorio clásico',
        'Insomnio crónico secundario al dolor pélvico en endometriosis/EPI',
        'Fractura por insuficiencia: dolor agudo que impide cualquier posición cómoda'
      ],
      impactoEjercicio: [
        'Limitación profunda para la carga de peso en fracturas por insuficiencia u osteoporosis',
        'Fatiga severa en espondiloartropatías activas',
        'Paget avanzado: deformidad ósea que altera la biomecánica y aumenta riesgo de fractura'
      ]
    },
    {
      // Tarjeta lumbar (guía de consulta), fila «Vascular»: la exploración
      // mecánica no reproduce los síntomas y la claudicación vascular cede al
      // PARARSE, no al sentarse ni al flexionar (a diferencia de la estenosis).
      id: 'l_vascular', icon: '🫀', nombre: 'Vascular',
      banderasRojas: [
        'Aneurisma aórtico: dolor en reposo o nocturno, masa abdominal pulsátil, antecedentes familiares cardiovasculares',
        'Claudicación vascular: dolor al caminar que cede al pararse (sin necesidad de sentarse), pie más frío, pulsos distales disminuidos',
        'Síndrome de Leriche (aortoilíaco): imita lumbalgia, con dolor en nalgas, caderas y muslos; disfunción eréctil'
      ],
      banderasAmarillas: [
        'Mayor con factores de riesgo cardiovascular (HTA, diabetes, colesterol, tabaco)'
      ],
      preguntas: [
        { id: 'l_v1', text: '¿El dolor de piernas al caminar se le pasa con solo pararse de pie, sin necesidad de sentarse ni inclinarse?', alerta: true, s1: true,
          razonamiento: {
            porque: 'En la claudicación vascular, las arterias estrechadas no aportan la sangre que piden los músculos al caminar: el dolor aparece con el esfuerzo y cede al parar, en 1–3 minutos, sin necesidad de sentarse ni de flexionar la columna. En la estenosis de canal (claudicación neurógena) lo que alivia es flexionar o sentarse.',
            peso: 'Es uno de los tres datos que Goodman usa para separar lo vascular de lo neurógeno, junto a la postura de la columna (que no influye en lo vascular) y los cambios tróficos de la piel. Muchas personas mayores tienen las dos cosas a la vez, así que un SÍ pide además explorar pulsos y piel.',
            detalle: 'Mecanismo: la aterosclerosis de la aorta o de las ilíacas da dolor en la espalda, las nalgas o las piernas con el ejercicio porque el músculo pide más sangre de la que llega; al parar, la demanda baja y el dolor cede en 1–3 minutos. Los movimientos de la columna no comprimen las arterias, así que la flexión no alivia ni la extensión empeora. En la claudicación neurógena, la flexión abre el conducto y alivia; el paciente se inclina hacia delante o se sienta, y el alivio tarda más.\n\nCon qué se confunde: la estenosis lumbar (claudicación neurógena) y la combinación de ambas, frecuente a partir de los 60–70 años. Goodman propone la prueba de la bicicleta (pedalear erguido y luego inclinado; sin cifras de precisión diagnóstica establecidas) y la prueba de inclinarse al caminar (stoop test) para orientar.\n\nQué buscar con un SÍ: pulsos distales, temperatura y color de los pies, factores de riesgo cardiovascular (tabaco, hipertensión, diabetes, colesterol, edad).',
            fisiologia: {
              pasos: [
                'La placa de ateroma estrecha poco a poco la arteria y la sangre se desvía por arterias más pequeñas paralelas (circulación colateral), que mantienen el riego en reposo pero nunca llevan tanto flujo como la arteria principal.',
                'Al caminar, los músculos de la pierna piden más sangre; llega un punto en que el flujo colateral está al máximo y no puede aumentar.',
                'Ese desajuste entre lo que llega y lo que se pide produce una isquemia muscular pasajera: dolor o calambre en la pantorrilla, el muslo o la nalga, según el nivel de la obstrucción.',
                'Al bajar el ritmo o parar, la demanda baja y la sangre «se pone al día»: el dolor cede sin necesidad de cambiar de postura.',
                'En la claudicación neurógena el mecanismo es otro: con la columna en extensión (de pie, caminando) los bordes de las láminas se solapan y el ligamento amarillo se pliega hacia dentro, y la raíz comprimida no recibe la sangre que pide al caminar. Por eso alivia sentarse o inclinarse hacia delante.'
              ],
              metafora: 'Como una carretera cortada con un desvío por caminos secundarios: basta para el tráfico de un domingo, pero en hora punta (caminar) se atasca; en cuanto baja el tráfico (parar), se despeja.'
            },
            fuentes: ['Goodman 2018', 'Zemaitis 2026', 'Munakomi 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, tablas 14.5 y 14.6, cuadro 14.4 y pp. 537–538 y 545–548.',
              { texto: 'Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/' },
              { texto: 'Munakomi 2023 — Munakomi, Foris y Varacallo, «Spinal Stenosis and Neurogenic Claudication», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430872/' }
            ]
          } },
        { id: 'l_v2', text: '¿Tiene dolor lumbar o abdominal en reposo o por la noche, o le han notado un bulto que late en el abdomen?', alerta: true,
          razonamiento: {
            porque: 'Un aneurisma de la aorta abdominal, casi siempre por debajo de las arterias renales, puede dar un dolor lumbar profundo y sordo que no cambia con la postura. A veces el paciente nota un latido en el abdomen o se palpa una masa pulsátil.',
            peso: 'Goodman pide derivación inmediata si hay estos signos en un hombre de 65–75 años que fuma o ha fumado; en el resto, un SÍ pide valoración médica. El dolor súbito e intenso, «desgarrador», con frío o falta de pulso en las piernas, puede ser una rotura inminente: urgencia vital.',
            detalle: 'Mecanismo: el aneurisma es una dilatación de una pared arterial debilitada, casi siempre por aterosclerosis. El dolor es profundo en la zona lumbar media y puede ser agudo e intenso en el abdomen, el tórax o cualquier zona de la espalda, sacro incluido. Puede haber masa abdominal pulsátil o un pulso aórtico ensanchado, soplos, y pulsos periféricos disminuidos. La obesidad o la distensión abdominal dificultan palparlo.\n\nFactores de riesgo: edad, sexo masculino, tabaco y antecedentes familiares; también claudicación intermitente previa. Las guías de la SVS recomiendan cribado con ecografía a todos los hombres y mujeres de 65 años o más que fuman o han fumado o tienen antecedentes familiares de aneurisma. En mujeres es menos frecuente, pero crece más rápido y se rompe más.\n\nRotura inminente o en curso: dolor brusco e intenso en el cuello o la espalda (nalga, cadera o flanco), que puede irradiarse al tórax, entre las escápulas o a los muslos; no se alivia al cambiar de postura; se describe como «desgarro»; piernas frías y sin pulso.',
            fisiologia: {
              pasos: [
                'La pared de la aorta pierde proteínas estructurales, elastina y colágeno, por una causa aún desconocida. Por debajo de las arterias renales la aorta tiene menos unidades laminares de colágeno, y por eso es donde más aneurismas aparecen.',
                'En la pared hay además un proceso inflamatorio crónico, también de causa no aclarada: la pared se debilita y se dilata de forma permanente, al menos un 150 % del diámetro de la arteria vecina.',
                'Por la ley de Laplace, la tensión de la pared crece con el radio: cuanto mayor es el aneurisma, más deprisa crece (0,2–0,3 cm al año entre 3 y 5 cm; 0,3–0,5 cm por encima de 5 cm) y más riesgo tiene de romperse. La hipertensión aumenta ese riesgo.',
                'La mayoría no da síntomas y se palpa como una masa que late y no duele; al crecer puede dar dolor abdominal, en el flanco o en la espalda. La rotura puede manifestarse de forma sutil o dramática.'
              ],
              metafora: 'Como un globo: cuanto más se infla, más tensa está la goma y más fácil es que siga inflándose, hasta que revienta.'
            },
            fuentes: ['Goodman 2018', 'Shaw 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Abdominal aortic aneurysm», pp. 543–545; cuadro 14.4, p. 538.',
              { texto: 'Shaw 2025 — Shaw, Loree y Oropallo, «Abdominal Aortic Aneurysm», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470237/' }
            ]
          } },
        { id: 'l_v3', text: '¿Nota un pie más frío que el otro, o le han dicho que tiene los pulsos de las piernas débiles?', alerta: true,
          razonamiento: {
            porque: 'Si una arteria de la pierna está obstruida, llega menos sangre al pie: queda más frío y pálido, los pulsos se debilitan o desaparecen, y la piel cambia (cambios tróficos). Esos signos no aparecen en el dolor de origen nervioso.',
            peso: 'Los pulsos distales se debilitan con la edad y la aterosclerosis, así que un pulso débil aislado en una persona mayor es frecuente. Pesa junto a dolor con el esfuerzo que cede al parar, o en mayores de 50 años con lumbalgia sin causa clara y tensión arterial alta.',
            detalle: 'Mecanismo: la obstrucción de la bifurcación aórtica da síntomas a menudo bilaterales (nalgas y piernas, debilidad, piernas frías y pálidas sin pulsos); la de la ilíaca, en la nalga, la cadera y el muslo de ese lado, con pulsos femoral o distales disminuidos e impotencia en el varón; las más distales, en la pantorrilla y el pie. La localización del síntoma la marca la localización de la obstrucción.\n\nCon qué se confunde: en la claudicación neurógena los pulsos no cambian y no hay cambios tróficos; puede haber déficits de fuerza sutiles.\n\nQué hacer con un SÍ: palpar pulsos (femoral, poplíteo, tibial posterior, pedio) y comparar la temperatura de ambos lados. Goodman recomienda cribar enfermedad vascular periférica a los mayores de 50 con lumbalgia de causa desconocida y tensión arterial alta.',
            fisiologia: {
              pasos: [
                'Cuando la arteria se estrecha, la circulación colateral mantiene parte del riego del pie, pero no todo: los pulsos distales se debilitan o desaparecen.',
                'Con menos sangre, la piel del pie queda más fría, pálida o amoratada, el relleno capilar se enlentece y pueden aparecer hormigueos.',
                'En fases avanzadas la sangre no basta ni en reposo: duele el antepié al elevar la pierna o al tumbarse, alivia dejarla colgando (la gravedad ayuda al riego), y aparecen heridas en los dedos que no curan.',
                'La disfunción eréctil puede ser una manifestación temprana de la aterosclerosis; la diabetes, el colesterol alto y el tabaco son factores de riesgo.'
              ],
              metafora: 'Como el último piso de un edificio con poca presión de agua: es el primero en quedarse sin ella, y por eso el pie se enfría y pierde el pulso antes que el resto de la pierna.'
            },
            fuentes: ['Goodman 2018', 'Zemaitis 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Screening for peripheral vascular causes of back pain», tablas 14.6 y 14.7, pp. 537 y 545–546.',
              { texto: 'Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/' }
            ]
          } }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.lumbar
export const tree = {
  title: 'Algoritmo CIF — Lumbar',
  steps: [
    {
      id: 'lu_step1',
      tag: 'Paso 1 — Evaluación de Dolor Irradiado (Rama Radicular)',
      question: '¿El dolor baja por la pierna (unilateral) y es peor que el dolor de espalda?',
      options: [
        { label: 'SÍ — SLR positivo <60°, Test de Slump positivo o déficits neurológicos dermatomales', value: 'si', next: 'lu_step1b', hypothesis: [] },
        { label: 'NO — Sin irradiación predominante a la pierna', value: 'no', next: 'lu_step2', hypothesis: [] }
      ]
    },
    {
      id: 'lu_step1b',
      tag: 'Paso 1b — Sub-decisión Radicular',
      question: '¿El dolor CENTRALIZA con movimientos repetidos (Método McKenzie/MDT)?',
      options: [
        { label: 'SÍ — El dolor centraliza (mejor pronóstico)', value: 'si', next: null, hypothesis: ['lu3'] },
        { label: 'NO — No centraliza o periferaliza', value: 'no', next: null, hypothesis: ['lu3'] }
      ]
    },
    {
      // Tarjeta lumbar (guía de consulta), nodo 3b: dolor radicular y
      // radiculopatía pueden coexistir — este paso solo añade, no excluye lu3.
      id: 'lu_step1c',
      tag: 'Paso 1c — Déficit Neurológico (Radiculopatía)',
      question: '¿Hay déficit de fuerza, sensibilidad o reflejos en la pierna (comparado con el lado sano)?',
      options: [
        { label: 'SÍ — Debilidad en un miotoma, reflejo disminuido o alteración sensitiva dermatomal', value: 'si', next: null, hypothesis: ['lu5'] },
        { label: 'NO — Exploración neurológica normal', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'lu_step2',
      tag: 'Paso 2 — Evaluación por Edad y Posición (Rama Estenosis)',
      question: '¿El paciente es mayor y el dolor mejora al sentarse o inclinarse hacia adelante?',
      options: [
        { label: 'SÍ — Dolor bilateral en glúteos/muslos, alivio con "signo del carrito de compras"', value: 'si', next: null, hypothesis: ['lu4'] },
        { label: 'NO — Sin este patrón', value: 'no', next: 'lu_step3', hypothesis: [] },
        { label: 'VASCULAR — Los síntomas al caminar ceden con solo pararse de pie, sin sentarse ni flexionar: sospecha de claudicación vascular → derivación médica', value: 'vascular', next: 'lu_step3', hypothesis: [] }
      ]
    },
    {
      id: 'lu_step3',
      tag: 'Paso 3 — Evaluación Mecánica y Cronología',
      question: '¿Cómo es el patrón de dolor lumbar predominante?',
      options: [
        { label: 'Agudo/Rigidez — Síntomas <16 días, sin dolor bajo la rodilla y restricción segmentaria hipomóvil', value: 'agudo', next: null, hypothesis: ['lu1'] },
        { label: 'Persistente/Inestabilidad — Dolor en rangos finales o posturas sostenidas con sensación de "fallo"', value: 'inestable', next: null, hypothesis: ['lu2'] },
        { label: 'Ninguno de los dos — Continuar con el patrón de dolor inespecífico', value: 'ninguno', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta lumbar (guía de consulta), nodo 4 + tabla orientativa
      // disco / faceta / SI. Revisar siempre cadera y factores contribuyentes.
      id: 'lu_step4',
      tag: 'Paso 4 — Dolor Inespecífico: Patrón Predominante',
      question: '¿Qué patrón encaja mejor? (Revisar siempre cadera y factores contribuyentes.)',
      options: [
        { label: 'DISCOGÉNICO — Dolor en línea media + preferencia direccional o centralización con movimientos repetidos; puede cambiar de lado', value: 'disco', next: null, hypothesis: ['lu6'] },
        { label: 'FACETARIO — Paramedial unilateral, dolor en extensión o extensión + rotación, sin pasar de la rodilla; los repetidos no alivian', value: 'faceta', next: null, hypothesis: ['lu7'] },
        { label: 'SACROILÍACA — Dolor en zona de Fortin sin dolor en Tuber, no centraliza', value: 'si', next: null, hypothesis: ['lu8'] },
        { label: 'MIOFASCIAL — Banda tensa palpable + punto hipersensible + el paciente reconoce el dolor provocado', value: 'miofascial', next: null, hypothesis: ['lu9'] },
        { label: 'NINGUNO — Sin patrón predominante', value: 'ninguno', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── LUMBAR ─────────────────────────────────────────────
  // LR: ver «Phase 4b scoring» en CLAUDE.md. `fuente` cita el estudio de cada
  // cifra; sin fuente no hay LR (el test cuenta como hallazgo clínico).
  // `pronostico`: texto literal de la tarjeta lumbar de la guía de consulta.
  lu1: {
    id: 'lu1', region: 'lumbar', num: '①',
    name: 'Disfunción Segmentaria Lumbosacra (Déficit de Movilidad)',
    prom: 'ODI (MCID: 8.5 pts) / RMDQ (MCID: 2.5–6.8 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Manipulación espinal tipo thrust (HVLA) en segmentos hipomóviles, 1-2 aplicaciones. Movilizaciones no-thrust grado I-II en rango medio. Ejercicios de inclinación pélvica en decúbito supino, 8-10 repeticiones cada 2 horas. Educación: mantener actividades habituales.',
    tests: [
      { name: 'Regla de Predicción Clínica de Flynn (4/5 criterios)', sn: null, sp: null, lr_pos: '24.4', lr_neg: null, tipo: 'pronostico', criterio: 'Criterios: síntomas <16 días, sin dolor distal a rodilla, FABQ trabajo <19 pts, ≥1 segmento hipomóvil, ≥1 cadera con >35° rotación interna. Predice la respuesta a la manipulación, no diagnostica la disfunción. Evidencia conflictiva para dolor crónico.', fuente: 'Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %)' },
      { name: 'Evaluación de hipomovilidad segmentaria lumbar (PAIVM)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilización posteroanterior sobre apófisis espinosas lumbares. Detecta segmentos hipomóviles.' }
    ]
  },
  lu2: {
    id: 'lu2', region: 'lumbar', num: '②',
    name: 'Inestabilidad Espinal Lumbar (Déficit de Coordinación)',
    prom: 'ODI (MCID: 8.5 pts) / RMDQ (MCID: 2.5–6.8 pts)',
    dosis: 'Activación de transverso abdominal en decúbito supino con retroversión pélvica suave. 5 repeticiones × 5 seg de contracción submáxima (30% CVM). Evitar posiciones de final de rango (flexión/extensión completa) durante las primeras 48 horas.',
    tests: [
      { name: 'Flexión lumbar ≥ 53° o ausencia de hipomovilidad en la exploración segmentaria', sn: null, sp: null, lr_pos: '4.3', lr_neg: null, criterio: 'Positivo si se cumple cualquiera de las dos. Predice inestabilidad radiológica en flexo-extensión (referencia radiográfica, no clínica).', fuente: 'Fritz 2005 (IC 95 % del LR+: 1,8–10,6)' },
      { name: 'Test de inestabilidad en prono', sn: '61%', sp: '57%', lr_pos: null, lr_neg: null, criterio: 'Prono con el tronco sobre la camilla y pies en el suelo: PA dolorosa que deja de doler al levantar los pies (activación de extensores).', fuente: 'Fritz 2005 (referencia: inestabilidad radiológica)' },
      { name: 'Evaluación de control motor en bipedestación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sensación de "fallo" en rangos medios, dificultad para mantener posición neutra bajo carga.', noData: true }
    ]
  },
  lu3: {
    id: 'lu3', region: 'lumbar', num: '③',
    name: 'Dolor Radicular Lumbar',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Ejercicios direccionales que centralicen o abolezcan el dolor (según preferencia direccional). 8-10 repeticiones cada 2 horas. Si extensión centraliza: press-up modificado al 50% ROM. Si flexión centraliza: rodillas al pecho. Evitar posiciones que periferalicen.',
    pronostico: {
      horizonte: 'Agudo hasta 3 semanas, subagudo hasta 3 meses. Mejora a los 6 meses en el 88 %, recuperación completa en el 65 %. Hernia reabsorbida en al menos dos tercios. Recurrencia 20 %.',
      derivacion: 'RM si sospecha de patología grave, dolor radicular persistente, déficit grave o progresivo, o más de 1 mes sin remisión con conservador.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Test de Elevación de Pierna Recta (SLR) ipsilateral', sn: '91%', sp: '26%', lr_pos: null, lr_neg: null, criterio: 'Positivo: reproduce el dolor de pierna (no solo lumbar) con elevación <60°. Útil sobre todo negativo, para descartar; un positivo aislado aporta poco.', fuente: 'Devillé 2000 (revisión sistemática; referencia: cirugía)' },
      { name: 'SLR Contralateral (Lasègue cruzado)', sn: '29%', sp: '88%', lr_pos: null, lr_neg: null, criterio: 'Positivo: dolor radicular ipsilateral al elevar la pierna contralateral. Útil sobre todo positivo.', fuente: 'Devillé 2000 (revisión sistemática; referencia: cirugía)' },
      { name: 'Test de Slump', sn: '84%', sp: '83%', lr_pos: null, lr_neg: null, criterio: 'Sedestación con flexión de tronco y cuello, extensión de rodilla y dorsiflexión. Positivo: reproduce el dolor de pierna y se alivia al extender el cuello. Más sensible que el SLR si se sospecha hernia discal.', fuente: 'Majlesi 2008 (estudio único; referencia: RM)' },
      { name: 'Criterios RAPIDH (5 criterios)', sn: '70.6%', sp: '90.4%', lr_pos: null, lr_neg: null, absorbe: [0], criterio: 'AUC 0.91. Criterios: distribución monoradicular, dolor unilateral en pierna, SLR+ <60°, debilidad motora unilateral, reflejo aquíleo asimétrico. Incluye el SLR: si se puntúa RAPIDH, el SLR no suma aparte.', fuente: 'Genevay 2017' }
    ]
  },
  lu4: {
    id: 'lu4', region: 'lumbar', num: '④',
    name: 'Estenosis Espinal / Claudicación Neurogénica',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 2.8 pts para "mucha mejoría")',
    dosis: 'Flexión lumbar en decúbito supino: rodillas al pecho bilateral, 5 repeticiones × 10 seg, ROM en zona de alivio sintomático. Marcha asistida con bastón o andador que permita flexión anterior de tronco, 2-3 min con descansos frecuentes en sedestación.',
    pronostico: {
      horizonte: 'Historia natural poco conocida. 15 % mejora solo; hasta 20 % controla los síntomas evitando la extensión. Conservador antes que cirugía.',
      derivacion: 'Progresión neurológica rápida o deterioro de la calidad de vida. La cirugía no garantiza recuperar los déficits.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    clusters: {
      cook: { nombre: 'Cluster de Cook (anamnesis y observación)', umbralPos: 4, lr_pos: '4.6', umbralNeg: 0, lr_neg: '0.19', fuente: 'Cook 2011 (n = 1448). 4 de 5: S 6 %, E 98 %; ninguno: S 96 %' }
    },
    tests: [
      { name: 'Síntomas bilaterales', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Dolor o síntomas en ambas piernas.' },
      { name: 'Dolor de pierna mayor que el dolor lumbar', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'El paciente refiere más dolor en la pierna que en la espalda.' },
      { name: 'Dolor al caminar o estar de pie', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Los síntomas aparecen o empeoran al caminar o permanecer de pie.' },
      { name: 'Alivio al sentarse', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Los síntomas ceden al sentarse (si ceden solo con pararse de pie, sospechar claudicación vascular).' },
      { name: 'Edad > 48 años', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'cook', criterio: 'Positivo si el paciente tiene más de 48 años.' },
      { name: 'Marcha con base amplia', sn: null, sp: null, lr_pos: '13', lr_neg: null, criterio: 'Observación de la marcha: aumento de la base de sustentación. Muy específica, poco sensible.', fuente: 'Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,9–95)' },
      { name: 'Romberg alterado', sn: null, sp: null, lr_pos: '4.2', lr_neg: null, criterio: 'Alteración del equilibrio en bipedestación con pies juntos y ojos cerrados.', fuente: 'Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,4–13)' },
      { name: 'Déficits sensoriales (L3-S1)', sn: '~50%', sp: '~80%', lr_pos: null, lr_neg: null, criterio: 'Distribuciones de pinchazo/vibración en L3-S1.' },
      // Al final (no en medio) para no desplazar los índices de state.testResults ya guardados.
      { name: 'Test de extensión lumbar de 30 s', sn: '51%', sp: '69%', lr_pos: null, lr_neg: null, criterio: 'De pie, extensión lumbar mantenida 30 s. Positivo: aparece o aumenta el dolor en el muslo (por debajo del pliegue glúteo), no solo el lumbar. No informativo por sí solo. Una versión modificada (hasta 60 s, más extensión + inclinación hacia el lado sintomático) da S 92 %, E 40 %, LR− 0,2, pero con IC 95 % hasta 1,36 en 30 pacientes: no sirve aún para descartar.', fuente: 'Katz 1995, datos citados en Dobbs 2016 (Manual Therapy; referencia: RM)' }
    ]
  },
  lu5: {
    id: 'lu5', region: 'lumbar', num: '⑤',
    name: 'Radiculopatía Lumbar (Déficit Neurológico)',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Ejercicio activo como base. Lumbalgia aguda con dolor irradiado: fuerza y resistencia del tronco y activación específica de su musculatura (B). Crónica: activación específica del tronco y control del movimiento (B). Terapia manual solo dentro de un programa con ejercicio (NICE): movilización articular con o sin thrust (B) y movilización neural junto a otros tratamientos, para mejorar a corto plazo (B). No usar tracción (D; NICE: no ofrecer). Información para el autocuidado y animar a mantener la actividad normal (NICE). Las guías hablan de lumbalgia con dolor en la pierna, no específicamente del déficit neurológico, y no fijan series, repeticiones ni semanas: el volumen queda a criterio del clínico.',
    dosisFuente: 'George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1, 1.2.6 y 1.2.7; actualizada en julio de 2026)',
    pronostico: {
      horizonte: 'RM de elección. EMG muy específica, poco sensible; útil si clínica e imagen no casan.',
      derivacion: 'Cirugía: déficit significativo en abductores de cadera, flexores plantares o dorsales del pie, o déficit que progresa pese al conservador.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Fuerza por miotomas L1–S2', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La debilidad es el signo más importante. Comparar siempre con el lado sano. Interpretar junto a reflejos y sensibilidad, nunca aislado.' },
      { name: 'Reflejos rotuliano (L3–L4) y aquíleo (L5–S1)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Especificidad 0,60–0,93 y sensibilidad hasta 0,67 según estudio, sin valor agrupado.', fuente: 'Tawa 2017 (revisión sistemática)' },
      { name: 'Sensibilidad (algodón, diapasón, pinchazo)', sn: '61%', sp: '63%', lr_pos: null, lr_neg: null, criterio: 'Algodón, diapasón sobre prominencia ósea y pinchazo, comparando con el lado sano.', fuente: 'Tawa 2017 (revisión sistemática; referencia: RM)' }
    ]
  },
  lu6: {
    id: 'lu6', region: 'lumbar', num: '⑥',
    name: 'Dolor Lumbar Discogénico',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Las guías no tienen una pauta específica para el origen discogénico: estas son sus recomendaciones para la lumbalgia en general. Aguda: movilización articular con o sin thrust (A); ejercicio con activación específica del tronco (C); método McKenzie (MDT) (C). Crónica: ejercicio (A) —fuerza y resistencia del tronco, multimodal, activación específica, aeróbico, acuático o general—; movilización articular con o sin thrust (A), siempre dentro de un programa con ejercicio (NICE); MDT (B); educación en neurociencia del dolor junto al ejercicio o la terapia manual (A). Sin series, repeticiones ni semanas fijadas: el volumen queda a criterio del clínico.',
    dosisFuente: 'George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)',
    pronostico: {
      horizonte: 'A 4 años: 13 % mejoró, 7,6 % alivio leve, 12,2 % empeoró, 67,2 % sin cambios. La preferencia direccional predice buen pronóstico.',
      derivacion: 'Componente neuropático o disfuncional → más cronicidad. Con dolor en pierna, diferenciar de dolor radicular.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    tests: [
      { name: 'Centralización con movimientos repetidos', sn: null, sp: null, lr_pos: '3.06', lr_neg: '0.66', criterio: 'Desaparecen los síntomas distales con movimientos repetidos al final del rango. Que no centralice no descarta el origen discal. La especificidad baja con discapacidad grave o malestar psicológico.', fuente: 'Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8' },
      { name: 'Preferencia direccional', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movimientos repetidos al final del rango o posturas mantenidas que alivian de forma duradera o aumentan la movilidad.' },
      { name: 'Observación: espalda plana o shift lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pérdida de lordosis o desviación lateral del tronco.' }
    ]
  },
  lu7: {
    id: 'lu7', region: 'lumbar', num: '⑦',
    name: 'Dolor Lumbar Facetario',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Las guías no tienen una pauta específica para el dolor facetario: estas son sus recomendaciones para la lumbalgia en general. Aguda: movilización articular con o sin thrust (A); masaje o movilización de partes blandas para aliviar el dolor a corto plazo (B); ejercicio con activación específica del tronco (C). Crónica: ejercicio (A) —fuerza y resistencia del tronco, multimodal, activación específica, aeróbico, acuático o general—; movilización articular con o sin thrust (A); movilización de partes blandas o masaje junto a otros tratamientos, a corto plazo (B); educación en neurociencia del dolor junto al ejercicio o la terapia manual (A). La terapia manual, siempre dentro de un programa con ejercicio (NICE). Sin series, repeticiones ni semanas fijadas: el volumen queda a criterio del clínico.',
    dosisFuente: 'George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)',
    pronostico: {
      horizonte: 'No se puede establecer pronóstico: la degeneración aumenta con la edad sin relación causal demostrada con el dolor. La radiología no es criterio diagnóstico; un bloqueo simple alivia definitivamente a menos del 10 %.',
      derivacion: 'NICE: considerar derivar para valorar denervación por radiofrecuencia si el tratamiento no quirúrgico no ha funcionado, se piensa que el dolor viene principalmente de estructuras inervadas por la rama medial y el dolor lumbar localizado es moderado o intenso (≥ 5/10) al derivar; la radiofrecuencia solo tras una respuesta positiva a un bloqueo diagnóstico de la rama medial. No ofrecer infiltraciones raquídeas para la lumbalgia.',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6) · NICE NG59 (rec. 1.3.1–1.3.3, derivación)'
    },
    tests: [
      { name: 'Dolor en extensión, inclinación o rotación hacia el lado del dolor', sn: null, sp: null, lr_pos: '1.29', lr_neg: null, criterio: 'Criterios clínicos tipo Revel. Ningún test clínico ha resultado informativo para el origen facetario: el único test informativo agrupado es la captación facetaria en SPECT (LR+ 2,80, LR− 0,44), una prueba de imagen, no de consulta.', fuente: 'Laslett 2006 (no replica a Revel; referencia: doble bloqueo); Han 2023 (eClinicalMedicine, revisión sistemática: Revel inconsistente, no agrupable)' },
      { name: 'PA unilateral dolorosa o con menos movilidad', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PA sobre la faceta o la transversa; espasmo ipsilateral.' },
      { name: 'Sin signos radiculares y sin alivio con repetidos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ausencia de signos radiculares; espalda en flexión, sin shift; los repetidos no suelen aliviar.' }
    ]
  },
  lu8: {
    id: 'lu8', region: 'lumbar', num: '⑧',
    name: 'Dolor de la Articulación Sacroilíaca',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Manipulación de la sacroilíaca (thrust de alta velocidad y baja amplitud), la intervención con más apoyo en la revisión, siempre junto a ejercicio (NICE: terapia manual solo dentro de un programa con ejercicio). Ejercicio de estabilización lumbopélvica, como en los estudios incluidos: activar y controlar el transverso del abdomen y el multífido, puentes, y abducción y rotación de cadera en decúbito lateral, integrados en las actividades diarias. Los programas duraron de un día a 4 semanas (hasta 8 semanas el de ejercicio). El vendaje neuromuscular no superó al placebo en el ensayo de más calidad. Evidencia de calidad baja o media y sin un volumen reproducible: series y repeticiones a criterio del clínico.',
    dosisFuente: 'Al-Subahi 2017, J Phys Ther Sci 29(9):1689–1694 (revisión sistemática, 9 estudios de 2004–2014 de calidad baja o media: manipulación, ejercicio y vendaje neuromuscular) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)',
    pronostico: {
      horizonte: 'PRPPP: >54 % en el último trimestre, 25 % posparto; la mayoría se recupera, 7–20 % persiste. Recaída del 85 % en el siguiente embarazo.',
      derivacion: 'Predicen persistencia: edad, carga de trabajo alta, lumbalgia previa, mala función muscular. Cribar depresión posparto (×3).',
      fuente: 'Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)'
    },
    clusters: {
      laslett: { nombre: 'Tests de provocación SI (3 de 5)', umbralPos: 3, umbralNeg: 2, sn: null, sp: null, lr_pos: '2.44', lr_neg: '0.31', fuente: 'Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios; LR+ IC 95 %: 1,50–3,98, LR− 0,21–0,47; referencia: bloqueo anestésico). Misma regla que la tarjeta lumbar: 3 de 5 positivos. Saueressig 2021 (JOSPT, metaanálisis, 5 estudios): LR+ 2,13, LR− 0,33, certeza muy baja (GRADE); descarta mejor de lo que confirma' }
    },
    tests: [
      { name: 'Distracción', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Supino: presión posterolateral sobre ambas EIAS. Positivo: reproduce el dolor conocido.' },
      { name: 'Thrust de muslo', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Supino, cadera a 90°: presión axial sobre el fémur. Positivo: reproduce el dolor conocido.' },
      { name: 'Compresión', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Decúbito lateral: presión vertical sobre la cresta ilíaca. Positivo: reproduce el dolor conocido.' },
      { name: 'Thrust sacro', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Prono: presión PA sobre el centro del sacro. Positivo: reproduce el dolor conocido.' },
      { name: 'No centraliza con movimientos repetidos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Descartar antes origen lumbar buscando preferencia direccional. No usar tests de disfunción de movimiento SI (baja fiabilidad y validez).' },
      // Añadidos al final (no en medio) para no desplazar los índices de
      // state.testResults de sesiones ya guardadas.
      { name: 'Gaenslen', sn: null, sp: null, lr_pos: null, lr_neg: null, cluster: 'laslett', criterio: 'Supino al borde de la camilla: una cadera en flexión máxima y la otra en extensión fuera de la camilla, con presión sobre ambas. Positivo: reproduce el dolor conocido.' },
      { name: 'Ausencia de dolor lumbar en la línea media', sn: null, sp: null, lr_pos: '2.41', lr_neg: null, criterio: 'Positivo si el paciente no refiere dolor en la línea media lumbar. Su LR− (0,35) tiene un IC 95 % que llega a 1,01: no se usa para descartar.', fuente: 'Han 2023 (eClinicalMedicine, revisión sistemática, 2 estudios; LR+ IC 95 %: 1,89–3,07)' }
    ]
  },
  lu9: {
    id: 'lu9', region: 'lumbar', num: '⑨',
    name: 'Síndrome de Dolor Miofascial Lumbar',
    prom: 'ODI (MCID: 8.5 pts) / NPRS (MCID: 1.5–3.2 pts)',
    dosis: 'Las guías no tienen una pauta específica para el dolor miofascial: estas son sus recomendaciones para la lumbalgia en general. Aguda: movilización articular con o sin thrust (A); masaje o movilización de partes blandas para aliviar el dolor a corto plazo (B); ejercicio con activación específica del tronco (C). Crónica: ejercicio (A) —fuerza y resistencia del tronco, multimodal, activación específica, aeróbico, acuático o general—; movilización articular con o sin thrust (A); movilización de partes blandas o masaje junto a otros tratamientos, a corto plazo (B); punción seca junto a otros tratamientos, a corto plazo (C); educación en neurociencia del dolor junto al ejercicio o la terapia manual (A). La terapia manual, masaje incluido, siempre dentro de un programa con ejercicio (NICE). Sin series, repeticiones ni semanas fijadas: el volumen queda a criterio del clínico.',
    dosisFuente: 'George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)',
    tests: [
      { name: 'Banda tensa palpable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio mínimo. Sin patrón de referencia diagnóstico; la palpación tiene fiabilidad baja.', fuente: 'Lucas 2009 (revisión sistemática de fiabilidad)' },
      { name: 'Punto hipersensible dentro de la banda', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio mínimo.' },
      { name: 'El paciente reconoce el dolor provocado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio mínimo, con o sin dolor referido. Hallazgo acompañante hasta descartar lo anterior.' }
    ]
  },
};
