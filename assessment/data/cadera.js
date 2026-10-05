// ============================================================
// PhysiQ-Assessment · data/cadera.js
// Contenido clínico de la región CADERA: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.cadera
export const screening = {
  label: 'Cuadrante Inferior — Cadera, Ingle y Muslo',
  // Recuadro de urgencia: literal de la tarjeta de consulta cadera (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'DERIVACIÓN URGENTE · FRACTURA DE ESTRÉS DEL CUELLO FEMORAL',
    lineas: [
      'Puede completarse y comprometer la vascularización de la cabeza femoral. Dolor inguinal vago e insidioso que empeora con la actividad; a menudo el único hallazgo es dolor al final del rango, sobre todo en RI. Dolor profundo nocturno o en carga.',
      'Perfil: corredor de fondo, militar o deportista de alta intensidad; poca forma al empezar, cambio de superficie o calzado; mujer con tríada de la deportista; corticoides prolongados.',
      'Percusión rotuliano-púbica (estudiada en fractura de cadera o pelvis tras traumatismo, no en la de estrés; S 85 %, E 70 %, LR+ 2,9, LR− 0,2): supino, fonendoscopio sobre el tubérculo púbico homolateral y percusión de la rótula; positivo si el sonido llega disminuido en el lado doloroso. Talón: golpe con el borde cubital del puño; positivo si reproduce el dolor con la carga axial.',
      'Una radiografía negativa NO descarta, sobre todo en las primeras semanas. · Adenopatía inguinal sin foco séptico: considerar malignidad. · Sospecha de torsión testicular o de artritis séptica: urgencias hoy.'
    ]
  },
  sistemas: [
    {
      id: 'ca_cancer', icon: '🔬', nombre: 'Cáncer / Oncológico',
      banderasRojas: [
        'Dolor óseo intenso al cargar peso o fractura patológica ante trauma menor',
        'Dolor constante nocturno en cadera/muslo sin alivio postural',
        'Antecedentes de cáncer de próstata, testículo, colon o riñón',
        'Masa palpable en muslo o zona glútea',
        // Tarjeta cadera (guía de consulta), BANDERAS «Cáncer». Sin la «S 100 %» de la
        // combinación: ningún estudio ha evaluado combinaciones de banderas (Henschke 2013).
        'Factores de riesgo de malignidad: ≥50 años, sin mejoría en 1 mes, pérdida de peso inexplicada, cáncer previo (ninguna combinación está validada). Lo que más informa: cáncer previo, sospecha clínica, VSG elevada y hematocrito bajo',
        'Masas o ganglios que crecen o fluctúan; avulsión ósea en un adulto mayor (descartar metástasis)',
        'Adenopatía inguinal sin foco séptico en el miembro inferior: considerar malignidad',
        // Lluch 2020, cap. 4.1.3, p. 147 (tabla 2); Goodman 2018, cap. 16, pp. 614 y 631–632
        'Tumores óseos primarios (osteoma osteoide: dolor sordo nocturno en el joven que alivian la actividad y, de forma desproporcionada, la aspirina; condrosarcoma, tumor de células gigantes, Ewing) y masas de partes blandas'
      ],
      banderasAmarillas: [
        'Edad >50 años con dolor insidioso en cadera',
        'Pérdida de peso inexplicada',
        // Lluch 2020, cap. 4.1.3, p. 146
        'Antecedente familiar de cáncer'
      ],
      preguntas: [
        { id: 'c5', text: '¿Tiene antecedentes de cáncer de cualquier tipo (especialmente próstata, mama, pulmón, riñón)?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Un cáncer previo puede volver como metástasis ósea, y la pelvis y la parte alta del fémur están entre los sitios preferidos: son hueso con médula roja muy irrigada. La próstata llega a la pelvis por los linfáticos y el plexo venoso pélvico; mama, pulmón y riñón, por la sangre. Una metástasis en la cadera puede doler como un problema mecánico.',
            peso: 'Es la bandera de malignidad que más pesa: en la lumbalgia, el antecedente de cáncer es lo único que sube de forma clara la probabilidad de un tumor (revisión Cochrane), y Lluch lo pone el primero entre los datos que más informan también en la cadera. Aun así, una sola bandera no basta: un SÍ obliga a buscar el resto (dolor nocturno o en carga, pérdida de peso, falta de mejoría). Esas cifras son de la lumbalgia; no hay estudios propios de la cadera.',
            detalle: 'Mecanismo: las metástasis buscan la parte más irrigada del esqueleto, la médula roja del esqueleto axial y los extremos proximales de los huesos largos: columna, pelvis, costillas y fémur proximal. Goodman y Lluch destacan el cáncer de próstata en el hombre y el de mama o del aparato reproductor en la mujer, porque metastatizan en la pelvis; la recidiva que más llega a la cadera es la de mama, hueso y próstata, y la de colon puede referir dolor a la cadera o la ingle. De los tumores primarios, la próstata es el que más riesgo de metástasis ósea tiene (18–29 %).\n\nCon qué se confunde: el paciente suele atribuir el dolor a un golpe menor. La metástasis en el hueso rara vez alcanza la sinovial (salvo el mieloma y algún linfoma), así que la movilidad de la cadera puede ser normal. Goodman describe a un corredor de 46 años, operado de un cáncer de próstata, diagnosticado de bursitis trocantérea: tenía un patrón no capsular y el test del talón positivo, y la RM mostró una fractura del cuello femoral por metástasis.\n\nQué hacer con un SÍ: preguntar también por quimio o radioterapia previas a quien niega haber tenido cáncer, y buscar dolor óseo en carga (test del talón), dolor nocturno que no cede con la postura, pérdida de peso y ganglios inguinales o poplíteos aumentados.',
            fisiologia: {
              pasos: [
                'Las células tumorales se sueltan del cáncer primario y viajan por la sangre o la linfa; la próstata drena por el plexo venoso pélvico hacia la pelvis y la columna lumbosacra.',
                'Anidan donde hay más riego: la médula roja de la pelvis y del extremo proximal del fémur.',
                'Receptores de la célula tumoral, como CXCR4 o RANKL, interactúan con las células de la médula y de la matriz ósea: se liberan citoquinas (IL-6, IL-8) y factores que forman vasos (VEGF), el tumor crece y se activan los osteoclastos, que destruyen hueso.',
                'El hueso pierde su arquitectura: dolor sordo y profundo, peor de noche y al cargar peso, y riesgo de fractura con traumatismos mínimos, como una fractura del cuello femoral.'
              ],
              metafora: 'Como semillas que viajan con el agua y prenden donde la tierra está más regada: la médula de la pelvis y del fémur es ese terreno.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Henschke 2013', 'Jayarangaiah 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 472 y 487; cap. 16, pp. 611, 616, 629–632 y 641–642.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 146 y 148.',
              { texto: 'Henschke 2013 — Henschke, Maher, Ostelo et al., «Red flags to screen for malignancy in patients with low-back pain», Cochrane Database Syst Rev 2013;(2):CD008686 (resumen y conclusiones de los autores).', url: 'https://doi.org/10.1002/14651858.CD008686.pub2' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' }
            ]
          } },
        { id: 'ca_on2', text: '¿El dolor en cadera/muslo es constante, nocturno e intenso, sin posición que lo alivie?', alerta: true,
          razonamiento: {
            porque: 'El dolor de un tumor o una metástasis en el hueso no depende de la carga ni de la postura: el tumor destruye hueso, irrita el periostio y alcanza nervios sensitivos. Es un dolor profundo, constante y peor de noche, y ni dormir ni tumbarse lo alivian. El dolor mecánico, en cambio, suele ceder al cambiar de posición.',
            peso: 'Solo, es poco específico: en la cadera, la sinovitis que acompaña a casi todas las lesiones intraarticulares (labrum, condropatía, artrosis) también da dolor nocturno y en reposo. Preocupa el dolor constante e intenso que no cede con ninguna postura, y sobre todo si se suma a un antecedente de cáncer, pérdida de peso, fiebre o dolor al cargar. En un deportista, el dolor nocturno con dolor inguinal en carga hace pensar en una fractura de estrés del cuello femoral (ver el sistema óseo).',
            detalle: 'Mecanismo: el dolor óseo de una metástasis se debe al daño estructural, a la velocidad con que se reabsorbe el hueso, a la irritación del periostio y al atrapamiento de nervios. Es profundo, difícil de localizar, sordo o quemante con episodios punzantes; al principio va y viene y después es constante; empeora con la actividad, sobre todo en carga, y despierta por la noche. Goodman considera bandera roja el dolor nocturno que no cede con el reposo ni con el cambio de postura. Un dolor brusco e intenso sobre ese fondo hace pensar en una fractura patológica.\n\nCon qué se confunde: la sinovitis de las lesiones intraarticulares de cadera y la condropatía dan dolor en reposo y nocturno (Lluch), igual que algunas roturas labrales. El osteoma osteoide, un tumor benigno frecuente en el fémur proximal (20 % de los casos), sobre todo en varones menores de 25 años, da un dolor sordo crónico peor de noche que mejora con la actividad y, de forma desproporcionada, con la aspirina o los AINE. Lluch incluye el dolor nocturno y el que no se alivia con el reposo en cama entre las banderas rojas de la cadera.\n\nQué preguntar después: si consigue volver a dormirse al cambiar de postura o tiene que levantarse, si la aspirina lo alivia de forma llamativa, y si duele al cargar peso (test del talón).',
            fisiologia: {
              pasos: [
                'El tumor activa a los osteoclastos, que destruyen hueso: la arquitectura se rompe y el periostio, muy sensible, se irrita.',
                'Al crecer, el tumor invade y comprime el tejido vecino y le corta el riego; cuando alcanza los nervios sensitivos de la zona aparece el dolor.',
                'Ese dolor no depende de cómo se mueva la cadera: es profundo, mal localizado, intermitente al principio y después constante.',
                'Empeora de noche y con la carga, y ni dormir ni tumbarse lo alivian. Un dolor brusco e intenso hace pensar en una fractura sobre el hueso debilitado.'
              ],
              nota: 'Ninguna de las fuentes leídas explica por qué el dolor óseo tumoral es peor de noche: lo describen como rasgo clínico.',
              metafora: 'Como una gotera dentro de la pared: el daño sigue aunque nadie toque nada, y se nota más en el silencio de la noche.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Jayarangaiah 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475 y 487; cap. 16, pp. 626 y 631–632.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 146.',
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' }
            ]
          } },
        { id: 'ca_on3', text: '¿Ha notado pérdida de peso rápida e inexplicada, o ha descubierto algún bulto nuevo?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Perder peso sin buscarlo puede ser caquexia: el tumor y las células inmunes liberan citoquinas que deshacen músculo y grasa y aumentan el gasto de energía, aunque el paciente coma. Un bulto nuevo que crece puede ser un tumor de partes blandas o de hueso que el dolor de cadera estaba tapando.',
            peso: 'Una pérdida de peso inexplicada de más del 5 % en 6 meses es el criterio de caquexia (ASCO, en Daley 2025). Sola es poco específica, pero Lluch la cuenta entre las banderas de malignidad, junto a la edad de 50 años o más, el cáncer previo y la falta de mejoría en un mes. Un bulto que crece o cambia preocupa más que uno estable: Goodman y Lluch piden valorar las masas o ganglios que crecen o fluctúan.',
            detalle: 'Pérdida de peso: el criterio es más del 5 % del peso en 6 meses, o más del 2 % con un IMC por debajo de 20 o sarcopenia. La caquexia afecta al 50–80 % de los cánceres avanzados, antes en los digestivos (páncreas, estómago, esófago) que en mama, pulmón o riñón, y también aparece en la insuficiencia cardiaca o renal, la EPOC, las infecciones crónicas (tuberculosis, VIH) y las enfermedades autoinmunes avanzadas. Goodman da como señal de alarma «el 10 % del peso en 2 semanas»; prevalece el criterio más actual (Daley 2025), igual que en lumbar, cervical y hombro.\n\nBultos: Goodman pide documentar localización, tamaño, forma, consistencia, movilidad y dolor de cualquier bulto. Un tumor del tamaño de un guisante ya contiene miles de millones de células. Una masa ósea que crece puede ser el primer signo de un tumor; la de uno maligno de crecimiento rápido es más difusa y a menudo dolorosa, y la piel encima puede estar caliente. Goodman describe un sarcoma de partes blandas en la cara interna del muslo, casi sin dolor, con sensación de plenitud, que había crecido en 3 meses y llegó como «distensión inguinal». Lluch: la RM es la prueba de elección para caracterizar una masa, y la radiografía, una primera prueba barata.\n\nQué hacer con un SÍ: preguntar cuánto peso y en cuánto tiempo, si ha cambiado la dieta o la actividad, y por fiebre, sudores o cansancio; del bulto, desde cuándo está y si crece. Derivar al médico.',
            fisiologia: {
              pasos: [
                'El tumor y las células inmunes del paciente liberan citoquinas proinflamatorias (TNF-α, IL-6, IL-1β) y otros factores, como el inductor de proteólisis y el movilizador de lípidos.',
                'Estos mediadores degradan la proteína del músculo, frenan su síntesis y movilizan la grasa: se pierde masa muscular y tejido adiposo.',
                'A la vez sube el gasto de energía en reposo, con más actividad simpática, y el tumor consume mucha glucosa: el lactato que produce vuelve al hígado para fabricar glucosa otra vez, con un coste de energía para el paciente (efecto Warburg).',
                'El resultado es una pérdida de peso que no se corrige comiendo más, con debilidad y cansancio; por eso se mide como porcentaje del peso perdido en los últimos meses.'
              ],
              metafora: 'Como un motor al ralentí que gasta combustible sin moverse: el cuerpo quema sus reservas aunque reciba comida.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Daley 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475 y 487; cap. 16, p. 618.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 146 y 148.',
              { texto: 'Daley 2025 — Daley, Ali, Ohnuma y Adigun, «Anorexia and Cachexia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430977/' }
            ]
          } },
        { id: 'ca_on4', text: '¿Ha notado un ganglio o bulto en la ingle sin una herida, infección o rozadura en esa pierna que lo explique?', alerta: true,
          razonamiento: {
            porque: 'Los ganglios de la ingle filtran la linfa de los genitales, el periné, la región glútea, la pared abdominal baja, parte del canal anal y la pierna. Con una infección en ese territorio aumentan como respuesta; sin una causa visible, pueden estar aumentados por un linfoma o por células de un cáncer que han llegado por la linfa.',
            peso: 'La mayoría de los ganglios aumentados son benignos: en atención primaria, la probabilidad de malignidad es del 0,4 % por debajo de los 40 años y de un 4 % por encima. Pesan más la edad de más de 40, el cáncer previo, el tabaco o el alcohol, que dure más de 4 semanas, los síntomas generales y un ganglio duro, fijo o que crece. Lluch: sin foco séptico en la pierna hay que pensar en malignidad y puede hacer falta una derivación urgente; Goodman pide derivación inmediata si hay antecedente de cáncer.',
            detalle: 'Qué orienta: un ganglio blando y doloroso suele ser infeccioso o inflamatorio (Goodman: dolorosos y móviles, por una infección, una intolerancia alimentaria o una alergia); uno gomoso, un linfoma; uno duro como una piedra, un cáncer, más a menudo metastásico. El dolor no distingue de forma fiable. Goodman pide derivar el aumento indoloro y progresivo, el que persiste, el que aparece en más de una zona (ingle y hueco poplíteo) y cualquier ganglio sospechoso en alguien con cáncer previo.\n\nCausas en la ingle: infecciosas (infecciones de transmisión sexual, celulitis) y malignas (linfoma, carcinoma epidermoide de los genitales, melanoma). El linfoma de Hodgkin empieza a menudo en un lado del cuello o la ingle. En el cáncer de testículo, Goodman describe una masa inguinal dura e indolora junto a un escroto hinchado y duro.\n\nQué hacer con un SÍ: buscar un foco (herida, rozadura, infección del pie o de la piel, infección de transmisión sexual), preguntar por fiebre, pérdida de peso, sudores, sangrado o lesiones de la piel, y palpar también los poplíteos. Goodman aconseja explicar la exploración y que esté presente una tercera persona del mismo sexo. Sin factores de riesgo, el médico puede vigilarlo 3–4 semanas; con ellos, pide biopsia.',
            fisiologia: {
              pasos: [
                'El ganglio es un filtro: la linfa recorre sus senos y expone lo que trae a los linfocitos B y T y a los macrófagos.',
                'Ante un antígeno, como una infección del territorio que drena, los linfocitos que lo reconocen se multiplican y el ganglio aumenta de tamaño; suele ser blando y a veces doloroso.',
                'Las células de un tumor que invaden los vasos linfáticos viajan con la linfa y pueden quedar atrapadas en el primer ganglio que drena la zona, o saltárselo y llegar a otros más lejanos.',
                'Allí siguen creciendo: el ganglio se vuelve duro, fijo y a menudo indoloro, y aumenta sin que haya una infección que lo explique.'
              ],
              metafora: 'Como el filtro de un grifo: se hincha cuando retiene mucha suciedad de la zona, y preocupa cuando crece sin que haya nada sucio cerca.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Farmer y Matto 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 472 y 475; cap. 16, pp. 616, 629–630 y 639.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147–148.',
              { texto: 'Farmer y Matto 2026 — Farmer y Matto, «Lymphadenopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 9 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513250/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Pelvis / Cadera', desc: 'Metástasis óseas — cánceres de mama, próstata, pulmón' },
        { zona: 'Muslo / Glúteo', desc: 'Tumores de fémur proximal, sarcomas' },
        { zona: 'Ingle / Testículos', desc: 'Tumores prostáticos o testiculares irradiados' }
      ],
      impactoDescanso: [
        'Dolor óseo metastásico nocturno de tipo "taladro" no cede al acostarse',
        'Sudoraciones y fiebres fragmentan severamente el descanso'
      ],
      impactoEjercicio: [
        'Destrucción del tejido óseo aumenta riesgo de fractura patológica con apoyo de peso',
        'Fatiga oncológica extrema sin relación con el nivel de actividad',
        'Débilidad muscular proximal impide subir escaleras o levantarse de silla'
      ]
    },
    {
      id: 'ca_vascular', icon: '🩸', nombre: 'Vascular',
      banderasRojas: [
        'Claudicación: dolor que aparece a los 5-10 min de caminar y cede casi de inmediato al parar',
        'Calambres nocturnos en pantorrilla que interrumpen el sueño profundo',
        'Aneurisma aórtico: dolor desgarrador irradiado a glúteo o parte posterior del muslo',
        'Signos de TVP: edema, eritema, calor y dolor en pantorrilla',
        // Tarjeta cadera (guía de consulta), BANDERAS «Vascular»: sin pistas propias, regla del dolor atípico
        'Oclusión aortoilíaca (síndrome de Leriche), enfermedad vascular periférica, variz de la safena'
      ],
      banderasAmarillas: [
        'Claudicación que empeora repentinamente',
        'Dolor en reposo isquémico que se alivia al colgar la pierna fuera de la cama'
      ],
      preguntas: [
        { id: 'c2', text: '¿El dolor aparece tras 5-10 minutos de caminar y se alivia casi de inmediato al detenerse (claudicación vascular)?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Una arteria estrechada por aterosclerosis da bastante sangre en reposo, pero no el aumento que pide el músculo al caminar: tras unos minutos aparece el dolor isquémico, y al parar la demanda baja y el dolor cede casi enseguida. Si la estrechez está en la aorta o las ilíacas, duele en la nalga, la cadera o el muslo, y puede confundirse con un dolor articular.',
            peso: 'Orienta mucho a vascular un patrón constante (siempre a una distancia parecida, cede en 1–5 minutos de pie parado) en una persona mayor, fumadora, diabética o con cardiopatía. NICE pide valorar la enfermedad arterial periférica en quien tenga síntomas que la sugieran: pulsos femoral, poplíteo y del pie, e índice tobillo-brazo. Si la claudicación empeora de golpe o aparece dolor en reposo de forma brusca, puede ser una trombosis o una embolia: Goodman pide comunicarlo al médico de inmediato.',
            detalle: 'Dónde duele: por debajo de la estrechez. La oclusión aortoilíaca (síndrome de Leriche) da dolor en nalgas y muslos; la de la femoral superficial, la más frecuente (unos dos tercios), en la pantorrilla; la poplítea o más distal, en el pie. El dolor se describe como sordo y profundo, o como quemazón, calambre o pesadez, aunque no hay espasmo real.\n\nVascular o neurógena (Goodman, tabla 16.5): la claudicación vascular empeora cuesta arriba y cede en 1–5 minutos solo con quedarse de pie; la neurógena por estenosis de canal empeora con la extensión y cuesta abajo, mejora al sentarse o inclinarse hacia delante y puede durar horas. Los síntomas vasculares son constantes y reproducibles: quien un día no puede cruzar la casa y otro camina sin límite no tiene claudicación intermitente.\n\nSignos: pulsos débiles o ausentes, piel fría, pálida o moteada tras caminar, sin vello y con uñas que crecen mal; heridas en dedos o pies. Factores de riesgo: tabaco (el más fuerte de los modificables, multiplica por 4 el riesgo), diabetes, edad ≥65, hipertensión, colesterol, enfermedad renal crónica, obesidad, sedentarismo y antecedentes familiares. Goodman la describe más en hombres de más de 50; Zemaitis 2026, la fuente más actual, casi igual en hombres y mujeres de más de 40. NICE: unos 20 % de los claudicantes acaban en isquemia crítica.\n\nGoodman cuenta el caso de una mujer de 41 años, fumadora y con antecedentes familiares de cardiopatía, tratada como ciática: tenía una estenosis de la aorta distal.',
            fisiologia: {
              pasos: [
                'La placa de aterosclerosis crece dentro de la pared de la arteria; al principio la arteria se dilata para compensar, pero llega un punto en que la placa estrecha la luz.',
                'La sangre busca arterias pequeñas paralelas (colaterales), que mantienen el riego en reposo pero nunca llevan tanto flujo como la arteria principal.',
                'Al caminar, el músculo pide más sangre; cuando las colaterales llegan a su máximo, el aporte no alcanza la demanda y el músculo queda isquémico: dolor o calambre.',
                'Al pararse, la demanda baja y el aporte se pone al día: el dolor cede en pocos minutos, de pie y sin necesidad de sentarse.',
                'El dolor aparece por debajo del estrechamiento: aorta e ilíacas, en nalgas y muslos; femoral, en la pantorrilla.'
              ],
              metafora: 'Como una carretera con un carril cortado: de madrugada el tráfico pasa sin problema, pero en hora punta se forma el atasco, y se deshace en cuanto baja la demanda.'
            },
            fuentes: ['Goodman 2018', 'Zemaitis 2026', 'NICE CG147'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 228 y 254–255; cap. 15, p. 595; cap. 16, pp. 623 y 636–637.',
              { texto: 'Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/' },
              { texto: 'NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.1–1.3.2 y contexto.', url: 'https://www.nice.org.uk/guidance/cg147' }
            ]
          } },
        { id: 'ca_v2', text: '¿Nota hinchazón, enrojecimiento y calor en la pantorrilla o experimenta calambres nocturnos frecuentes?', alerta: true,
          razonamiento: {
            porque: 'Un coágulo en una vena profunda de la pierna (TVP) frena el retorno de la sangre: la pantorrilla se hincha, se enrojece, se calienta y duele. El riesgo es que se suelte y llegue al pulmón. Los calambres nocturnos, en cambio, tienen muchas causas, y solo algunas son vasculares.',
            peso: 'Hinchazón, calor y dolor en una sola pantorrilla piden valoración médica sin demora: NICE indica calcular la escala de Wells y, si la TVP es probable (2 puntos o más), una ecografía en las 4 horas siguientes. Hasta la mitad de las TVP no dan síntomas claros, y el signo de Homans no sirve para descartarla ni confirmarla. Los calambres nocturnos solos pesan poco: son frecuentes en mayores, deportistas y embarazadas, y suelen deberse a deshidratación, medicamentos o déficits nutricionales.',
            detalle: 'Quién: la escala de Wells de NICE suma un punto por cada uno de estos datos: cáncer activo; parálisis, paresia o yeso reciente en la pierna; encamamiento de 3 días o más o cirugía mayor en las 12 semanas previas; dolor a lo largo del sistema venoso profundo; toda la pierna hinchada; pantorrilla al menos 3 cm más gruesa que la otra; edema con fóvea solo en esa pierna; venas superficiales colaterales (no varices) y TVP previa. Resta 2 si otro diagnóstico es al menos igual de probable. Otros factores: embarazo y posparto, estrógenos orales, obesidad, edad, trombofilias, enfermedad inflamatoria intestinal y lupus. Goodman: un tercio de los mayores de 40 años operados de cirugía mayor o con un infarto desarrolla una TVP.\n\nCómo se presenta: dolor e hinchazón de un solo lado por debajo del trombo, enrojecimiento, calor, venas dilatadas y, a veces, febrícula. La hinchazón de las dos piernas por estar sentado orienta a otra causa. El signo de Homans aparece en menos de un tercio de las TVP confirmadas, y más de la mitad de quienes lo tienen positivo no tienen trombosis. A veces la primera manifestación es la embolia pulmonar.\n\nCalambres: Goodman cita como causas la deshidratación, la oclusión arterial por enfermedad vascular periférica, la claudicación neurógena por estenosis de canal, la neuropatía, los medicamentos, los trastornos metabólicos, los déficits de vitaminas o calcio y el síndrome compartimental. En deportistas suelen ir precedidos de fatiga o fasciculaciones, y una rotura o una fractura pueden imitarlos.',
            fisiologia: {
              pasos: [
                'Tres factores favorecen el coágulo (tríada de Virchow): la sangre estancada (inmovilidad, sin la bomba de la pantorrilla), la coagulación aumentada (cáncer, embarazo, estrógenos) y el daño de la pared de la vena (traumatismo, cirugía).',
                'El coágulo suele empezar donde la sangre circula más despacio, como los senos del sóleo detrás de las válvulas, y se adhiere al endotelio, que libera citoquinas y atrae leucocitos.',
                'Según el equilibrio entre coagulación y fibrinólisis, el trombo crece hacia arriba (poplítea, femoral, ilíaca).',
                'Al obstruir el retorno, la sangre se estanca por debajo: hinchazón de un solo lado, dolor, calor y enrojecimiento; cuanto más arriba llega, más síntomas.',
                'Si un fragmento se suelta, viaja por las venas hasta el pulmón: embolia pulmonar.'
              ],
              metafora: 'Como un tapón en un desagüe: el agua se acumula por detrás, y el riesgo es que se suelte y acabe en otra tubería.'
            },
            fuentes: ['Goodman 2018', 'Waheed 2023', 'NICE NG158'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 255–256; cap. 16, pp. 624 y 636.',
              { texto: 'Waheed 2023 — Waheed, Kudaravalli y Hotwagner, «Deep Venous Thrombosis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507708/' },
              { texto: 'NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.4 y tabla 1 (escala de Wells de dos niveles).', url: 'https://www.nice.org.uk/guidance/ng158' }
            ]
          } },
        { id: 'ca_v3', text: '¿Experimenta dolor isquémico en la pierna en reposo que mejora al colocarla colgando fuera de la cama?', alerta: true,
          razonamiento: {
            porque: 'Cuando la estrechez arterial es tan grave que la sangre no cubre ni el consumo en reposo, el pie y la pierna duelen tumbado o con la pierna en alto, porque la gravedad deja de ayudar al riego. Al colgar la pierna fuera de la cama o ponerse de pie, la gravedad empuja la sangre hacia abajo y el dolor mejora.',
            peso: 'Es el estadio más grave de la enfermedad arterial periférica: el dolor en reposo o las heridas que no curan definen la isquemia crónica que amenaza la extremidad, con alto riesgo de amputación y de muerte si no se trata pronto (Zemaitis). NICE pide que la valore un equipo vascular antes de decidir el tratamiento. Si el dolor de reposo aparece de forma brusca, o la claudicación empeora de golpe, puede ser una trombosis o una embolia: Goodman pide comunicarlo al médico de inmediato. No es un dolor de cadera: suele estar en el antepié, los dedos o el tobillo.',
            detalle: 'Dónde y cómo: dolor quemante en los dedos, el dorso del pie o el tobillo, que empeora al elevar la pierna o tumbarse y mejora colgando el pie fuera de la cama o en una silla; muchos acaban durmiendo sentados. Signos: piel fría y pálida, roja o cianótica al colgar, seca y brillante, sin vello, uñas que crecen mal, pulsos ausentes, relleno capilar lento y úlceras o gangrena en zonas de apoyo (dedos, talón).\n\nQuién: los mismos factores que la claudicación (tabaco, diabetes, edad, hipertensión, colesterol, enfermedad renal crónica). Unos 20 % de los claudicantes llegan a la isquemia crítica (NICE). En diabéticos, un índice tobillo-brazo normal o alto no descarta la enfermedad arterial, por la rigidez de las arterias (NICE).\n\nIsquemia aguda: si el dolor empieza de golpe (en menos de una hora), con palidez, ausencia de pulso, hormigueo, frialdad o parálisis, la causa suele ser un émbolo, a menudo de origen cardiaco (fibrilación auricular), o una trombosis sobre la placa.\n\nCon qué se confunde: el ardor y el dolor nocturno en piernas y pies son frecuentes en mayores, por neuropatía (diabetes, alcohol), medicamentos o síndrome de piernas inquietas (Goodman).',
            fisiologia: {
              pasos: [
                'La placa de aterosclerosis estrecha tanto la arteria que, aun con las colaterales, el flujo no cubre ni el consumo del pie en reposo.',
                'Tumbado o con la pierna en alto, la gravedad deja de empujar la sangre hacia el pie y la perfusión distal cae todavía más.',
                'Los tejidos más alejados, el antepié y los dedos, quedan isquémicos y duelen; por eso el dolor aparece de noche, en la cama.',
                'Al colgar la pierna o ponerse de pie, la gravedad mejora la perfusión y el dolor cede.',
                'Si la falta de riego continúa, la piel no cura: aparecen úlceras en los dedos y el pie y, al final, gangrena.'
              ],
              metafora: 'Como regar cuesta arriba con poca presión: el agua no llega al final de la manguera hasta que se baja el extremo.'
            },
            fuentes: ['Goodman 2018', 'Zemaitis 2026', 'NICE CG147'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 228 y 254–255; cap. 16, p. 624.',
              { texto: 'Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/' },
              { texto: 'NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.2–1.3.4 y 1.6.1, y contexto.', url: 'https://www.nice.org.uk/guidance/cg147' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Pantorrilla / Glúteo', desc: 'Claudicación vascular según nivel de oclusión' },
        { zona: 'Dorso del pie', desc: 'Claudicación distal' },
        { zona: 'Zona interescapular / Lumbar', desc: 'Aneurisma aórtico irradiado' }
      ],
      impactoDescanso: [
        'Calambres nocturnos en pantorrilla interrumpen el sueño profundo (isquemia)',
        'Dolor isquémico en reposo empeora al elevar las piernas en cama — el paciente duerme con la pierna colgando'
      ],
      impactoEjercicio: [
        'La distancia de marcha queda limitada por la claudicación',
        'Claudicación glútea puede confundirse con dolor de cadera de origen articular'
      ]
    },
    {
      id: 'ca_urogenital', icon: '🫘', nombre: 'Urogenital / Renal',
      banderasRojas: [
        'Hematuria (sangre en orina) de cualquier cantidad',
        'Masa testicular indolora y dura',
        'Fiebre con dolor en flanco y escalofríos (pielonefritis)',
        // Tarjeta cadera (guía de consulta), BANDERAS «Visceral, urogenital o ginecológico» y URGENCIA
        'Litiasis renal, uretritis; prostatitis, epididimitis, torsión testicular (urgencias hoy)',
        'Endometriosis, quiste ovárico, enfermedad inflamatoria pélvica; cáncer ginecológico, de próstata, testículo o vía urinaria',
        'Denominador común: dolor atípico, sin relación clara con la carga, nocturno o con síntomas no musculoesqueléticos'
      ],
      banderasAmarillas: [
        'Ardor o dificultad al orinar acompañando el dolor de ingle',
        'Dolor en ingle que no cambia con movimiento de cadera'
      ],
      preguntas: [
        { id: 'c3', text: '¿Ha notado sangre en la orina, ardor o dolor al orinar, o fiebre/escalofríos?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El riñón y el uréter mandan su dolor por los segmentos T10–L1, los mismos de la piel de la ingle, la cara interna del muslo y los genitales: un cálculo o una infección pueden doler en la ingle o el muslo como si fuera la cadera. El escozor al orinar, la sangre en la orina y la fiebre señalan la vía urinaria, no la articulación.',
            peso: 'Cualquier cantidad de sangre en la orina pide valoración médica: es el síntoma principal del cáncer de vías urinarias (Goodman), y con hematuria visible se encuentra un cáncer genitourinario en el 10–20 % (Leslie 2025). Fiebre con escalofríos y dolor de flanco hace pensar en una pielonefritis, que necesita tratamiento médico. Escozor y frecuencia sin fiebre suelen ser una cistitis: menos grave, pero también médica.',
            detalle: 'Dónde duele: el riñón, en la zona subcostal posterior y el ángulo costovertebral; el uréter, en la ingle y los genitales. Un cálculo que baja por el uréter da un dolor brusco, intenso, en oleadas, que empieza en el ángulo costovertebral y se irradia al abdomen inferior, el muslo, el testículo o el labio mayor; el paciente no encuentra postura, al contrario que con la irritación peritoneal, en la que se queda quieto. El dolor renal no cambia con la postura.\n\nCistitis o pielonefritis: la cistitis da frecuencia, urgencia, escozor, molestia suprapúbica, orina turbia y a veces sangre; con escozor y frecuencia sin flujo vaginal, la probabilidad de cistitis supera el 90 %. La pielonefritis suma fiebre (a menudo de más de 39 °C), dolor de flanco y náuseas o vómitos, con dolor a la puñopercusión; en ancianos puede presentarse como confusión. Goodman propone la percusión renal (Murphy): si reproduce el dolor, preguntar por fiebre, escalofríos y sudores.\n\nCon qué se confunde: la columna dorsal baja o lumbar alta y la sacroilíaca pueden referir dolor a la ingle y el muslo con el mismo patrón, pero sin síntomas urinarios ni generales. Hematuria visible: cáncer de riñón o vejiga, cálculos, infecciones, próstata o instrumentación; en la mitad de los casos no se encuentra la causa.\n\nQué hacer con un SÍ: preguntar desde cuándo, el color de la orina, fiebre y dolor de flanco; tomar la temperatura y derivar.',
            fisiologia: {
              pasos: [
                'Bacterias de la piel de alrededor de la uretra, a menudo de origen intestinal, suben por la uretra y se adhieren al revestimiento de la vejiga: la inflamación da escozor, frecuencia, urgencia y a veces sangre en la orina.',
                'Si la infección sigue subiendo hasta el riñón (pielonefritis), aparecen fiebre, escalofríos, dolor de flanco y náuseas.',
                'Las fibras de dolor del riñón y del uréter entran en la médula por T10–L1, donde convergen con las fibras de la piel: el dolor visceral se siente como dolor en esos dermatomas.',
                'Los testículos y los ovarios se forman junto a los riñones y bajan siguiendo el trayecto de los uréteres; por eso un cálculo que baja por el uréter duele en el flanco y se irradia a la ingle, el escroto o los labios.'
              ],
              metafora: 'Como dos cables que comparten regleta: la avería está en el riñón, pero la luz que se enciende es la de la ingle.'
            },
            fuentes: ['Goodman 2018', 'Gill 2025', 'Belyayeva 2024', 'Leslie 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 361–362, 364 y 367; cap. 16, pp. 621 y 633.',
              { texto: 'Gill 2025 — Gill, Leslie y Minter, «Acute Cystitis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459322/' },
              { texto: 'Belyayeva 2024 — Belyayeva, Leslie, Rout y Jeong, «Acute Pyelonephritis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519537/' },
              { texto: 'Leslie 2025 — Leslie, Hamawy y Saleem, «Gross and Microscopic Hematuria», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534213/' }
            ]
          } },
        { id: 'ca_u2', text: '(Hombres) ¿Ha notado dolor testicular, secreciones inusuales o dificultad al orinar?', alerta: true,
          razonamiento: {
            porque: 'La próstata y el epidídimo inflamados dan un dolor mal localizado que puede sentirse en el pubis, el periné, los testículos, la cara interna del muslo o la ingle, sin relación con el movimiento de la cadera. Las secreciones por el pene y la dificultad para orinar señalan una infección (a menudo de transmisión sexual en los jóvenes) o un problema de próstata.',
            peso: 'No hay cifras de precisión. Pesa más con fiebre y escalofríos (prostatitis bacteriana aguda) o con un testículo hinchado y doloroso. Un dolor testicular brusco e intenso es otra cosa: ver la pregunta siguiente (torsión, urgencias hoy). Goodman pide pensar en un cáncer de testículo ante un dolor de cadera o de ingle sin causa en un varón de 18–24 años; un bulto o un endurecimiento del testículo siempre se deriva.',
            detalle: 'Epididimitis: la causa más frecuente de dolor escrotal agudo en el adulto. En varones de 20–39 años suele deberse a una infección de transmisión sexual (clamidia y gonococo, la mitad de los casos); después de los 39, a bacterias intestinales por el reflujo de orina; antes de la madurez sexual, a la inflamación por traumatismos o deportes repetitivos (correr, saltar). Da dolor e hinchazón del escroto de inicio gradual, que a veces empieza en el flanco, con escozor, frecuencia, urgencia o secreción uretral, y puede haber ganglios inguinales dolorosos. Hay que descartar la torsión: la epididimitis empieza poco a poco y la torsión de golpe, pero la historia sola puede no bastar.\n\nProstatitis: el 25 % de las consultas genitourinarias de los varones; la bacteriana aguda es más frecuente por debajo de los 35 años. Da fiebre y escalofríos, dolor lumbar, en la cara interna del muslo y el periné, dolor testicular o del pene, frecuencia, urgencia, despertarse a orinar, escozor, chorro débil, sensación de vaciado incompleto y dolor al eyacular. Factores de riesgo: coito sin preservativo, obstrucción urinaria (cálculo, tumor, próstata grande), diabetes, inmunodepresión y sonda.\n\nCáncer de testículo: entre los 15 y los 35 años, con una media de 33. Bulto, aumento o endurecimiento del testículo, pesadez en el escroto o el abdomen bajo y dolor sordo en el abdomen bajo o la ingle; si se extiende a los ganglios retroperitoneales, dolor lumbar.\n\nQué hacer con un SÍ: explicar por qué se pregunta, preguntar por escozor, vaciado incompleto, frecuencia, dolor en testículos, pene o periné y dolor al eyacular, tomar la temperatura y derivar.',
            fisiologia: {
              pasos: [
                'En los jóvenes, bacterias de transmisión sexual, y en los mayores, bacterias intestinales de la orina, suben por la uretra.',
                'Pueden infectar la próstata o, por el reflujo o el estancamiento de la orina, llegar al epidídimo, el tubo enrollado detrás del testículo donde maduran los espermatozoides.',
                'La inflamación hincha la próstata, que puede dificultar el paso de la orina, o el epidídimo, que se vuelve doloroso y puede extenderse al testículo.',
                'Los nervios de la próstata no localizan bien el dolor: se siente en el pubis, el pene, los testículos, el periné o el recto, y también en la cara interna del muslo.'
              ],
              metafora: 'Como el humo de un cuarto interior: se huele en varias habitaciones, pero ninguna es la que arde.'
            },
            fuentes: ['Goodman 2018', 'Rupp y Leslie 2023', 'Davis y Silberman 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 361, 367–368 y 374–375; cap. 16, pp. 617, 633 y 640.',
              { texto: 'Rupp y Leslie 2023 — Rupp y Leslie, «Epididymitis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430814/' },
              { texto: 'Davis y Silberman 2023 — Davis y Silberman, «Acute Bacterial Prostatitis», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459257/' }
            ]
          } },
        { id: 'ca_u3', text: '(Hombres) ¿Ha empezado de golpe un dolor intenso en un testículo, con hinchazón, náuseas o vómitos?', alerta: true, urgencia: 'Sospecha de torsión testicular: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'En la torsión, el testículo gira sobre su cordón y estrangula sus propios vasos: primero se corta la salida de la sangre y después la entrada, y el testículo empieza a morir. El dolor puede empezar en la parte baja del abdomen o en la ingle y parecer entonces un problema de cadera.',
            peso: 'Es una urgencia urológica que depende del tiempo: la viabilidad del testículo cae mucho a partir de las 6 horas, se puede salvar si se opera antes de 8 horas y rara vez pasadas 24. Por eso se deriva a urgencias de inmediato, sin esperar a ver si cede. Es más frecuente en menores de 25 años, sobre todo en la adolescencia, pero puede darse a cualquier edad. Ni el reflejo cremastérico ni el alivio al elevar el testículo bastan para descartarla.',
            detalle: 'Por qué ocurre: en la mayoría hay una anomalía congénita, la inserción alta de la túnica vaginal, que deja el testículo colgando libre dentro de ella («en badajo de campana»); es bilateral en al menos 2 de cada 5. El giro puede ser espontáneo, con un esfuerzo o, menos veces, tras un golpe.\n\nCómo se presenta: dolor brusco en un lado del escroto, constante o intermitente, que no cambia con la postura, a menudo con náuseas o vómitos; puede acompañarse de dolor en el abdomen bajo y la ingle, o empezar solo por ahí. El testículo puede estar más alto, horizontal, hinchado y rojo. La ausencia del reflejo cremastérico no es tan sensible como se pensaba y el alivio al elevar el testículo (signo de Prehn) no es fiable.\n\nCon qué se confunde: epididimitis (inicio gradual, síntomas urinarios), orquitis, torsión de un apéndice testicular (dolor en un punto, «punto azul»), hernia inguinal, hidrocele, hematoma y tumor. Lluch y Goodman la incluyen entre las causas no musculoesqueléticas de dolor inguinal.\n\nQué hacer con un SÍ: no seguir explorando; derivar a urgencias hoy.',
            fisiologia: {
              pasos: [
                'Normalmente la túnica vaginal sujeta el testículo por detrás; si se inserta alta, el testículo queda libre dentro de ella y puede girar.',
                'Un movimiento brusco, un esfuerzo o, a veces, un golpe lo hace girar sobre el cordón espermático, casi siempre entre 90 y 180°.',
                'Primero se colapsan las venas: la sangre entra pero no sale, y el testículo se congestiona, se hincha, duele y enrojece.',
                'Si el giro aumenta, se corta también la arteria: isquemia y, en horas, necrosis.',
                'Por eso el tiempo cuenta: la viabilidad cae a partir de las 6 horas y es rara pasadas 24.'
              ],
              nota: 'Las fuentes leídas describen que el dolor puede empezar en el abdomen bajo o la ingle, pero no explican el mecanismo de ese dolor referido.',
              metafora: 'Como una manguera retorcida: primero deja de vaciarse y se hincha, y si se retuerce más, deja de entrar el agua.'
            },
            fuentes: ['Schick y Sternard 2023', 'Rupp y Leslie 2023', 'Goodman 2018', 'Lluch 2020'],
            citas: [
              { texto: 'Schick y Sternard 2023 — Schick y Sternard, «Testicular Torsion», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448199/' },
              { texto: 'Rupp y Leslie 2023 — Rupp y Leslie, «Epididymitis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430814/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, p. 617.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.'
            ]
          } },
        { id: 'ca_u4', text: '(Mujeres) ¿El dolor de ingle o pelvis se relaciona con la regla, con las relaciones sexuales, o tiene flujo o sangrado inusual?', alerta: true,
          razonamiento: {
            porque: 'Los órganos de la pelvis comparten inervación con la pelvis, la ingle y el muslo: la endometriosis, la enfermedad inflamatoria pélvica, un quiste de ovario o un embarazo ectópico pueden doler en la ingle o la cadera. Que el dolor siga el ciclo menstrual, aparezca con las relaciones o se acompañe de flujo o sangrado anormal no tiene explicación mecánica.',
            peso: 'No hay cifras de precisión. Preocupa sobre todo el dolor pélvico o inguinal tras una falta de regla o con un sangrado inesperado, más aún con mareo o dolor de hombro: puede ser un embarazo ectópico, que Goodman considera de atención médica inmediata. Un flujo anormal con fiebre o dolor en las relaciones hace pensar en una infección pélvica, que también pide derivación rápida para evitar que se extienda y proteger la fertilidad. El dolor que empeora antes de la regla y mejora al acabar orienta a endometriosis.',
            detalle: 'Endometriosis: afecta al 10 % de las mujeres en edad fértil y al 35–50 % de las que tienen dolor pélvico crónico o infertilidad; se diagnostica entre los 25 y los 45 años, aunque los síntomas empiezan a menudo en la adolescencia. Da dolor pélvico crónico y cíclico, regla dolorosa, dolor en las relaciones, al defecar o al orinar, e infertilidad; la intensidad no se corresponde con la extensión. El dolor empieza días o una semana antes de la regla y mejora al terminar; con los años dura todo el ciclo.\n\nEnfermedad inflamatoria pélvica: sobre todo entre los 15 y los 25 años; en el 85 % de los casos la causan bacterias de transmisión sexual (gonococo, clamidia) o de la vaginosis. Dolor abdominal bajo o pélvico, a menudo de los dos lados, flujo, dolor en las relaciones, sangrado anormal, escozor al orinar y fiebre; puede pasar casi inadvertida. Factores de riesgo: menos de 25 años, varias parejas, pareja con una infección, infecciones previas, uso irregular del preservativo y las 3 semanas siguientes a la colocación de un DIU. Tras una, el riesgo de embarazo ectópico se multiplica por 7.\n\nEmbarazo ectópico: alrededor del 1 % de los embarazos, casi siempre en la trompa. Manchado o sangrado y un calambre brusco, a menudo de un lado, en el abdomen bajo o la pelvis poco después de la primera falta. Si sangra poco a poco, dolor pélvico, lumbar o de hombro; si sangra deprisa, tensión baja y shock.\n\nBanderas del dolor pélvico (Goodman): difuso, sin un punto que señalar, que empeora al aumentar la presión abdominal (estar de pie, caminar, toser, las relaciones) y al final del día, y mejora al tumbarse.\n\nQué hacer con un SÍ: preguntar por la última regla y la posibilidad de embarazo, flujo, fiebre y dolor en las relaciones; derivar, de inmediato si puede ser un ectópico.',
            fisiologia: {
              pasos: [
                'Los órganos pélvicos duelen por varias vías: el dolor visceral viaja por nervios autónomos (T11–S3), el somático por los pudendos (S2–S3), y la irritación del peritoneo de las paredes de la pelvis da dolor segmentario y espasmo del psoas ilíaco.',
                'En la endometriosis, tejido parecido al del útero crece fuera de él; los estrógenos lo hacen proliferar e inflamarse, y forma vasos y nervios nuevos.',
                'Por eso su dolor sigue el ciclo: aumenta en los días previos a la regla y mejora al terminar.',
                'En la infección pélvica, las bacterias suben desde el cuello del útero y dejan cicatrices y adherencias en las trompas: dolor pélvico crónico, infertilidad y embarazos ectópicos.',
                'En un embarazo ectópico, el embrión crece en la trompa, que se distiende y puede romperse y sangrar dentro del abdomen.'
              ],
              metafora: 'Como el ruido de un piso vecino: se oye en la ingle, pero viene de la habitación de al lado.'
            },
            fuentes: ['Goodman 2018', 'Consoli y Carlson 2026', 'Jenkins y Vadakekut 2025'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 15, pp. 587–588 y 591–595; cap. 16, p. 617.',
              { texto: 'Consoli y Carlson 2026 — Consoli y Carlson, «Endometriosis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK567777/' },
              { texto: 'Jenkins y Vadakekut 2025 — Jenkins y Vadakekut, «Pelvic Inflammatory Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de junio de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499959/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Ingle / Testículos', desc: 'Cólico ureteral irradiado desde ángulo costovertebral' },
        { zona: 'Abdomen inferior', desc: 'Vejiga, uréter distal, próstata' },
        { zona: 'Hombro ipsilateral', desc: 'Por presión en diafragma (riñones)' }
      ],
      impactoDescanso: [
        'Cólico renal constante y severo — impide conciliar el sueño, el paciente no puede estar quieto',
        'Nicturia fragmenta el ciclo de sueño'
      ],
      impactoEjercicio: [
        'Insuficiencia renal crónica: anemia renal con fatiga extrema y letargo',
        'Espasmo del psoas ilíaco (adyacente al uréter inflamado) altera biomecánica de la marcha'
      ]
    },
    {
      id: 'ca_gi', icon: '🫃', nombre: 'Gastrointestinal',
      banderasRojas: [
        'Dolor en ingle/cadera que se alivia al pasar gases o defecar',
        'Signo del psoas positivo (sospecha de apendicitis o absceso)',
        'Fiebre y dolor abdominal simultáneo al dolor de cadera',
        // Tarjeta cadera (guía de consulta), BANDERAS «Hernia inguinal o femoral» y «Visceral»
        'Apendicitis, enfermedad de Crohn, diverticulitis; cáncer digestivo, linfoma',
        'Hernia inguinal (80 % varones: dolor, tumefacción y bulto con sensación de peso o arrastre) o femoral (unas 4 veces más en mujeres: nódulo lateral e inferior al tubérculo púbico). Palpar DE PIE el canal inguinal y, si no se nota, pedir que tosa',
        // Lluch 2020, cap. 4.1.3, p. 147 (tabla 2); Goodman 2018, cap. 16, pp. 617 y 639
        'Líquido en la cavidad peritoneal (ascitis por cirrosis, insuficiencia cardiaca, cáncer): abdomen distendido con dolor inguinal o lumbar; preguntar por enfermedad hepática o alcohol'
      ],
      banderasAmarillas: [
        'Distensión abdominal acompañando el dolor de cadera',
        'Uso crónico de AINEs'
      ],
      preguntas: [
        { id: 'c4', text: '¿El dolor en la ingle o cadera se acompaña de molestias, distensión abdominal o se alivia al defecar/pasar gases?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El intestino y el apéndice están pegados al psoas, que no tiene ninguna barrera que lo separe de la cavidad abdominal: una inflamación o una infección intestinal pueden irritarlo o formar un absceso, y el dolor se siente en la cadera, la ingle o el muslo. Que el dolor cambie con la función intestinal, y no con el movimiento de la cadera, apunta al intestino.',
            peso: 'No hay cifras para la pregunta. Goodman considera bandera roja que el dolor de cadera alterne con un dolor abdominal, o aparezca a la vez, y pide derivar. Pesan más la fiebre, los sudores nocturnos, la pérdida de apetito, el antecedente de Crohn, diverticulitis o apendicitis y una masa en la ingle. El test del psoas es específico pero poco sensible para la apendicitis (S 16 %, E 95 %, LR+ 2,38): positivo orienta, negativo no descarta.',
            detalle: 'Absceso del psoas: lo causan sobre todo infecciones intestinales vecinas (diverticulitis, Crohn, apendicitis, cáncer colorrectal), la enfermedad inflamatoria pélvica y la infección renal. Da fiebre en picos, sudores nocturnos, dolor abdominal, pérdida de apetito, dolor en el muslo medial, el triángulo femoral o la rodilla, cojera, cadera en flexión y rotación interna, dolor al extenderla y, a veces, una masa dolorosa en la ingle. Goodman propone cuatro pruebas: golpe en el talón, salto sobre una pierna, test del iliopsoas y palpación del iliopsoas, además del test del obturador. Son positivas si provocan dolor en el abdomen bajo; si lo que reproducen es dolor de espalda o del músculo, el origen es más bien musculoesquelético. El absceso se palpa lateral a la arteria femoral; la hernia femoral, medial.\n\nApendicitis: entre los 5 y los 45 años (media, 28). El dolor empieza difuso o alrededor del ombligo y se localiza en la fosa ilíaca derecha cuando se irrita el peritoneo, con pérdida de apetito, náuseas, vómitos o diarrea, y a veces frecuencia urinaria. En deportistas puede ser poco llamativa: Goodman describe a una bailarina y a una maratoniana con peritonitis de semanas que llegaron por dolor de cadera e ingle.\n\nCrohn: hasta el 25 % de los pacientes con enfermedad inflamatoria intestinal tiene dolor articular o lumbar, a veces precedido de lesiones de la piel.\n\nQué hacer con un SÍ: preguntar por náuseas, vómitos, diarrea o estreñimiento, sangre en las heces, fiebre y sudores, tomar la temperatura, hacer las pruebas del psoas y derivar.',
            fisiologia: {
              pasos: [
                'El intestino responde a la distensión y al estiramiento con dolor; la inflamación del apéndice da al principio un dolor vago alrededor del ombligo.',
                'Cuando la inflamación alcanza el peritoneo parietal, inervado por nervios somáticos, el dolor se localiza mejor (en la apendicitis, en la fosa ilíaca derecha).',
                'El psoas ilíaco está en contacto directo con el colon, el apéndice, el riñón y el uréter, sin barrera que lo separe: una infección vecina puede extenderse a su vaina y formar un absceso.',
                'El músculo irritado entra en espasmo: la cadera se queda en flexión, extenderla duele y el dolor se refiere a la ingle, el muslo medial o la rodilla.',
                'Por eso el dolor cambia con la digestión, los gases o la defecación, y suele acompañarse de fiebre, sudores o pérdida de apetito.'
              ],
              metafora: 'Como una casa sin pared medianera: el psoas no tiene muro con el intestino, y lo que pasa al lado le llega.'
            },
            fuentes: ['Goodman 2018', 'Lotfollahzadeh 2024', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 304 y 311–314; cap. 15, pp. 584 y 600–601; cap. 16, pp. 616 y 633–636.',
              { texto: 'Lotfollahzadeh 2024 — Lotfollahzadeh, Lopez y Deppen, «Appendicitis», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK493193/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.'
            ]
          } },
        { id: 'ca_gi2', text: '¿Ha notado heces negras/alquitranadas, sangre en las heces o dificultad para limpiarse?', alerta: true,
          razonamiento: {
            porque: 'Las heces negras y pegajosas (melena) son sangre digerida que viene de la parte alta del tubo digestivo; la sangre roja viene de cerca del recto o el ano. Un tumor o una inflamación del colon pueden referir dolor a la pelvis, el sacro o la cadera, y el sangrado puede ser la única pista de que el dolor no es mecánico.',
            peso: 'Cualquier sangrado digestivo debe valorarlo un médico (Goodman). La sangre roja tras defecar suele ser de hemorroides o fisuras, pero también puede ser un cáncer colorrectal, y solo el médico puede distinguirlo. La melena con dolor de cadera pide derivar y preguntar por AINE. No hay cifras de precisión para la pregunta.',
            detalle: 'Melena: aparece con grandes cantidades de sangre; es negra porque los ácidos digestivos oxidan los glóbulos rojos, huele mal, es muy pegajosa y cuesta limpiarse. Suele venir de varices esofágicas o de una úlcera de estómago o duodeno (preguntar por AINE). La sangre roja viene del colon distal, el recto o el ano: hemorroides, fisuras (también por coito anal) o cáncer colorrectal. Las heces rojizas pueden deberse a la remolacha o a colorantes, y el bismuto las oscurece.\n\nCómo preguntar (Goodman): explicar que son preguntas que parecen ajenas a la cadera pero importan; si ha notado sangre o cambios de color o consistencia en las heces, si le cuesta limpiarse después de defecar y si nota manchas en la ropa interior. Dejar la puerta abierta por si lo nota más adelante.\n\nPor qué importa en la cadera: la recidiva de un cáncer colorrectal puede referir dolor a la cadera o la ingle, y un dolor sacro intenso con antecedente de cáncer de recto o de ano pide derivación inmediata. El sangrado es una señal de alarma del cáncer, aunque a menudo tardía. En la hemofilia, el sangrado en la pared del intestino o en el psoas puede dar dolor de cadera o de ingle con melena. Lluch incluye el cáncer digestivo entre las causas no musculoesqueléticas de dolor en la cintura pélvica.',
            fisiologia: {
              pasos: [
                'Cuando sangra el estómago o el duodeno (una úlcera, unas varices), la sangre recorre todo el intestino.',
                'Por el camino, los ácidos digestivos oxidan la hemoglobina de los glóbulos rojos y la sangre se vuelve negra: heces negras, pegajosas, de olor fuerte, que cuesta limpiar.',
                'Si sangra el colon distal, el recto o el ano (hemorroides, fisuras, un cáncer colorrectal), la sangre no se digiere y sale roja.',
                'El colon y el recto refieren su dolor a la zona lumbar baja, el sacro y la pelvis, así que un tumor o una inflamación pueden doler allí.'
              ],
              metafora: 'Como el hierro que se oxida con el tiempo: la sangre que viaja mucho por el intestino se oscurece; la que sale de cerca del final llega roja.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 306–307; cap. 13, p. 475; cap. 15, pp. 584 y 602–603; cap. 16, pp. 630 y 638.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.'
            ]
          } },
        { id: 'ca_gi3', text: '¿Nota un bulto en la ingle, con sensación de peso o de que algo tira, que aumenta al toser o al hacer fuerza?', alerta: true,
          razonamiento: {
            porque: 'Una hernia es la salida de grasa o intestino por un punto débil de la pared abdominal, en el canal inguinal o en el femoral. Al toser o hacer fuerza sube la presión dentro del abdomen y empuja el contenido hacia fuera: el bulto aumenta y aparece la sensación de peso o de tirón. Puede doler en la ingle y confundirse con un problema de los aductores o de la cadera.',
            peso: 'La exploración de la ingle, de pie y con tos, es la prueba de referencia (S 74,5 %, E 96,3 %; HerniaSurge). La hernia inguinal es mucho más frecuente en hombres; la femoral, unas 4 veces más en mujeres, se nota como un nódulo bajo el ligamento inguinal y es la que más se estrangula (15–20 %). Un bulto doloroso, duro, que no se reduce, o con náuseas, vómitos o distensión, pide cirugía urgente. Una hernia palpable excluye el dolor inguinal «relacionado con el canal inguinal» de Doha.',
            detalle: 'Dónde: la inguinal, sobre el ligamento inguinal y junto al escroto; la femoral, como un nódulo lateral e inferior al tubérculo púbico, aunque una grande puede subir por encima del ligamento y confundirse. Cómo explorar: de pie, palpando el canal inguinal; si no se nota, pedir que tosa (Lluch); de pie y tumbado, con Valsalva (Patel).\n\nQuién: la inguinal, el 80 % en hombres (Lluch), entre 9 y 12 veces más que en mujeres (HerniaSurge), y aumenta con la edad; factores de riesgo: antecedente familiar, hernia en el otro lado, alteración del colágeno, prostatectomía e IMC bajo. La femoral, unas 4 veces más en mujeres y en multíparas; factores: edad, obesidad, tabaco, embarazo y enfermedades del tejido conectivo. Lluch da el 85 % de las femorales en mujeres; la fuente más actual (Patel 2025) dice unas 4 veces más.\n\nCómo se presenta: dolor, hinchazón y un bulto con sensación de peso o de tirón; suele empezar de forma insidiosa y crecer con el tiempo, a veces tras levantar un peso. El dolor puede ser sordo, de tirón o quemante; un tercio de las femorales no da síntomas. La inguinal duele en la ingle; la femoral puede referir dolor por la cara medial del muslo hasta la rodilla. El riesgo de que la hernia quede atrapada es mayor en mujeres y en las femorales.\n\nCon qué se confunde: la «hernia deportiva» o pubalgia no es una hernia verdadera; un absceso del psoas (lateral a la arteria femoral, blando y de bordes mal definidos), una adenopatía, un lipoma, un hidrocele o un aneurisma femoral.\n\nQué hacer con un SÍ: derivar al médico (Goodman); urgente si duele, está duro, no se reduce o hay síntomas digestivos.',
            fisiologia: {
              pasos: [
                'La pared abdominal tiene zonas donde la fascia y la aponeurosis no están cubiertas por músculo: el canal inguinal y el anillo femoral, medial a la vena femoral.',
                'Si esa zona se debilita o se ensancha, el peritoneo forma un saco que sale por el orificio.',
                'Al toser, hacer fuerza o levantar peso sube la presión dentro del abdomen y empuja grasa o intestino dentro del saco: el bulto aumenta y tira.',
                'Si el cuello del saco es estrecho, como en la hernia femoral, el contenido puede quedar atrapado y, si se comprimen sus vasos, estrangularse: dolor intenso, masa dura y, si es intestino, vómitos y distensión.'
              ],
              metafora: 'Como una cámara que asoma por un desgarro del neumático: cuanto más presión, más sale.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Patel 2025', 'HerniaSurge 2018'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147 y 152.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, p. 314; cap. 15, pp. 590 y 603; cap. 16, p. 619.',
              { texto: 'Patel 2025 — Patel, Azmat y Goethals, «Femoral Hernia», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de mayo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK535449/' },
              { texto: 'HerniaSurge 2018 — HerniaSurge Group, «International guidelines for groin hernia management», Hernia 2018;22(1):1–165 (texto completo en PMC).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Cadera / Ingle / Muslo', desc: 'Absceso del psoas (apendicitis, diverticulitis, Crohn)' },
        { zona: 'Lumbar / Pelvis / Sacro', desc: 'Intestino grueso, colon, recto' }
      ],
      impactoDescanso: [
        'Dolor nocturno GI (12–3 am) asociado a úlceras o cáncer interrumpe el sueño'
      ],
      impactoEjercicio: [
        'Mala absorción de nutrientes (Crohn, colitis) compromete recuperación muscular',
        'Anemia ferropénica por sangrado GI oculto: fatiga y disnea'
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), BANDERAS «Fractura de estrés»,
      // «Osteonecrosis», «Lesiones del desarrollo» y «Fractura por avulsión»,
      // más la URGENCIA de cuello femoral. Radiografía negativa NO descarta.
      id: 'ca_oseo', icon: '🦴', nombre: 'Óseo / Desarrollo',
      banderasRojas: [
        'Fractura de estrés del cuello femoral: dolor inguinal vago e insidioso que empeora con la actividad, dolor al final del rango (sobre todo en RI), dolor profundo nocturno o en carga → DERIVACIÓN URGENTE',
        'Fractura de estrés de rama púbica (corredores, mucho trabajo de aductores; el dolor NO aumenta con abducción pasiva ni aducción resistida) o de diáfisis femoral (dolor vago en muslo anterior en carga; fulcro S 88–93 %, E 13–75 %)',
        // Lluch 2020, cap. 4.1.3, p. 147 (tabla 2); Goodman 2018, cap. 15, p. 583
        'Fractura de estrés del acetábulo o del sacro (sacro: osteoporosis, embarazo o posparto, radioterapia pélvica, corticoides prolongados, deportistas y militares)',
        'Osteonecrosis de la cabeza femoral: corticoides o alcohol prolongados, traumatismo o fractura previos, lupus y otras conectivopatías, hiperlipidemia; dolor inguinal profundo en carga',
        'Lesiones del desarrollo: EFCF (9–16 años, durante el estirón), Perthes (4–10 años, más en varones), displasia, apofisitis púbica',
        'Fractura por avulsión en el adolescente con tracción brusca (EIAI, EIAS, pubis, tuberosidad isquiática, trocánteres); en un adulto mayor, descartar metástasis'
      ],
      banderasAmarillas: [
        'Perfil de fractura de estrés: corredor de fondo, militar o deportista de alta intensidad; poca forma al empezar, cambio de superficie o calzado; mujer con tríada de la deportista; corticoides prolongados',
        'Antecedente de EFCF, Perthes o displasia: hace más probable el dolor de cadera en el joven'
      ],
      preguntas: [
        { id: 'ca_os1', text: '¿Hace deporte de resistencia o de alta intensidad (o es militar), y el dolor de ingle empezó poco a poco, empeora al cargar peso o al hacer actividad y le duele también de noche?', alerta: true, s1: true, urgencia: 'Sospecha de fractura de estrés del cuello femoral: derivación urgente (una radiografía negativa no la descarta).',
          razonamiento: {
            porque: 'Una carga repetida que el hueso no tiene tiempo de reparar crea microfracturas. En el cuello del fémur, si se sigue cargando, la fisura puede completarse y desplazarse, y entonces corta el riego de la cabeza femoral. Por eso el dolor inguinal que empieza poco a poco, empeora con la carga y aparece también de noche en un deportista de resistencia o un militar es una urgencia.',
            peso: 'Lluch y Goodman piden derivación urgente. La fractura de estrés del cuello femoral es de alto riesgo: está en una zona de riego difícil y tensión máxima, tiende a no consolidar y, si se desplaza, puede necrosar la cabeza femoral (May y Marappa-Ganeshan). El dolor en carga es bandera roja en cualquier persona (Goodman). La radiografía no la ve al principio: en las fracturas de estrés, dos tercios son negativas al inicio y solo la mitad llegan a positivizarse. A menudo el único hallazgo es el dolor al final del rango, sobre todo en rotación interna.',
            detalle: 'Quién: corredores de fondo, velocistas, militares y deportistas de alta intensidad. La causa más frecuente es un aumento brusco del entrenamiento; también la poca forma al empezar, el cambio de superficie y el calzado inadecuado o gastado. Más en mujeres, sobre todo con la tríada de la deportista (déficit de energía con o sin trastorno alimentario, osteoporosis y amenorrea o menopausia); en hombres de resistencia con restricción calórica, la testosterona baja produce el mismo efecto. Otros factores: corticoides prolongados, radioterapia, trastornos metabólicos y una fractura de estrés previa. En mayores con osteoporosis, la fractura es de insuficiencia: hueso débil con cargas normales.\n\nCómo se presenta: dolor inguinal vago e insidioso que empeora con la actividad y mejora al principio con el reposo; con el tiempo, dolor profundo nocturno o en carga, a veces con derrame o hinchazón. Goodman añade debilidad, marcha de glúteo medio, dolor con el FABER, con la carga, el golpe en el talón o el salto, y con la aducción resistida con o sin rotación externa.\n\nOtras de la zona: la de la rama púbica inferior (corredores, mucho trabajo de aductores) duele en la ingle y la nalga, pero no aumenta con la abducción pasiva ni la aducción resistida; la de la diáfisis femoral da un dolor vago en el muslo anterior. Las pruebas clínicas (percusión rotuliano-púbica, talón, fulcro) están en el recuadro de urgencia.\n\nImagen: la radiografía tarda 2–3 semanas en mostrar cambios; la RM tiene una S del 80–100 % y una E del 100 %.',
            fisiologia: {
              pasos: [
                'El hueso se remodela con la carga (ley de Wolff): los osteocitos detectan la tensión y coordinan a los osteoclastos, que retiran hueso, y a los osteoblastos, que lo forman.',
                'Con una carga repetida y un aumento brusco del entrenamiento, los osteoclastos reabsorben más deprisa de lo que los osteoblastos forman: aparecen microfracturas, y los síntomas suelen empezar unas 3 semanas después del cambio.',
                'Si se sigue cargando, las microfracturas se unen en una fisura: el dolor aparece primero después de la actividad y luego dura cada vez más, hasta notarse por la mañana o de noche.',
                'La cabeza del fémur se nutre sobre todo de un anillo arterial que rodea el cuello (circunflejas medial y lateral), con pocas colaterales.',
                'Si la fisura del cuello se completa y se desplaza, puede romper ese riego: la cabeza se queda sin sangre y se necrosa.'
              ],
              metafora: 'Como doblar una y otra vez un clip: no se rompe a la primera, pero cada doblez lo debilita hasta que cede.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'May y Marappa-Ganeshan 2023', 'Barney 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 149.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 15, pp. 583–584; cap. 16, pp. 625–627 y 639–640.',
              { texto: 'May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554538/' },
              { texto: 'Barney 2023 — Barney, Piuzzi y Akhondi, «Femoral Head Avascular Necrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK546658/' }
            ]
          } },
        { id: 'ca_os2', text: '¿Toma o ha tomado corticoides durante mucho tiempo, bebe alcohol a diario, o tiene lupus u otra enfermedad del tejido conectivo?', alerta: true,
          razonamiento: {
            porque: 'Son los factores de riesgo de la osteonecrosis de la cabeza femoral: los corticoides y el alcohol hacen crecer las células grasas de la médula y suben la presión dentro del hueso, que se queda sin riego. La cabeza femoral tiene un riego frágil, con pocas colaterales, y por eso es donde más se produce.',
            peso: 'No hay cifras de precisión. Los corticoides crónicos y el alcohol suman más del 80 % de las osteonecrosis no traumáticas (Barney). Un SÍ pesa junto a un dolor inguinal profundo que empeora con la carga y varios tests de cadera positivos; una movilidad normal ayuda a descartarla (Lluch), aunque al principio puede conservarse (Goodman). La radiografía la ve tarde: la prueba de elección es la RM, que debe pedir el médico.',
            detalle: 'Factores de riesgo: traumatismo (la fractura del cuello femoral acaba en osteonecrosis en el 15–50 % y la luxación de cadera en el 10–25 %); corticoides prolongados; consumo crónico de alcohol; lupus y otras enfermedades autoinmunes, por los corticoides y también sin ellos; drepanocitosis; pancreatitis, enfermedad renal, coagulopatías, leucemia, diabetes, Cushing, gota e hiperlipidemia; inmunosupresores, fármacos para el VIH, trasplante y quimioterapia. A veces no hay causa. Es más frecuente en hombres (de 3 a 5 por cada mujer), con una edad media de 33–38 años al tratarse.\n\nCómo se presenta: al principio puede no doler. Después aparece un dolor de cadera leve durante semanas, que se va haciendo más intenso; puede notarse en la ingle o la cara anterointerna del muslo, empeora al caminar, subir escaleras y cargar peso, y a menudo persiste en reposo. Hay cojera, limitación de la rotación interna, la flexión y la abducción, dolor a la palpación, rigidez y a veces un chasquido al levantarse.\n\nAlgo más: en la osteonecrosis no traumática, la cadera del otro lado muestra alteraciones en la imagen en el 60 % de los casos aunque no duela (Lluch). El Perthes es la misma necrosis de la cabeza femoral en niños.\n\nQué hacer con un SÍ: preguntar dosis y tiempo de corticoides y cantidad de alcohol, y derivar para imagen si hay dolor inguinal en carga.',
            fisiologia: {
              pasos: [
                'La cabeza del fémur recibe la sangre sobre todo de las arterias circunflejas, que forman un anillo en el cuello; las colaterales son pocas.',
                'Los corticoides y el alcohol hacen crecer y multiplicarse las células grasas de la médula ósea, alteran los lípidos de la sangre y pueden producir pequeños émbolos de grasa.',
                'Dentro del hueso, que no puede expandirse, sube la presión y se ocluyen los vasos: el hueso bajo el cartílago se queda sin riego.',
                'Mueren los osteocitos y la médula; el hueso muerto no aguanta la carga y la superficie articular se hunde.',
                'Con la cabeza deformada llegan el dolor en carga, la cojera, la pérdida de rotación interna y, con el tiempo, la artrosis.'
              ],
              metafora: 'Como un huerto al final de una sola manguera: si algo la aprieta, no hay otra que lo riegue.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Barney 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, pp. 616 y 637–639.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 148–149.',
              { texto: 'Barney 2023 — Barney, Piuzzi y Akhondi, «Femoral Head Avascular Necrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK546658/' }
            ]
          } },
        { id: 'ca_os3', text: '(Menores de 18 años) ¿Cojea, o el dolor empezó durante el estirón o tras un tirón brusco al chutar, esprintar o saltar?', alerta: true,
          razonamiento: {
            porque: 'En el esqueleto que aún crece, la placa de crecimiento y las apófisis son los puntos más débiles: durante el estirón, la epífisis del fémur puede deslizarse (epifisiolisis), y un tirón muscular brusco puede arrancar el fragmento de hueso donde se inserta el tendón (avulsión). Un niño o adolescente que cojea con dolor de cadera, ingle, muslo o rodilla no debe tratarse como una contractura sin descartar estas lesiones.',
            peso: 'Goodman: el dolor de cadera o ingle en alguien que no ha terminado de crecer hace sospechar una lesión ortopédica y pide derivación. La epifisiolisis es la patología de cadera más frecuente en preadolescentes y adolescentes, a menudo con dolor solo en el muslo o la rodilla, y el retraso del diagnóstico aumenta las complicaciones: si es inestable (no puede apoyar), el 47 % acaba en necrosis de la cabeza femoral. Con fiebre, pensar en una artritis séptica (sistema inflamatorio). En la edad de crecimiento, la radiografía detecta la epifisiolisis, el Perthes, la displasia y las avulsiones (Lluch).',
            detalle: 'Epifisiolisis: entre los 9 y los 16 años, durante el estirón (edad media de 11,2 años en las niñas y 12 en los niños). La obesidad es el mayor factor de riesgo; también ser varón, el crecimiento rápido y la retroversión. Si aparece antes de los 10 años o con poco peso, hay que pensar en un problema hormonal (hipotiroidismo). Suele empezar sin traumatismo, aunque un golpe no la descarta; es bilateral en un 25 %. Duele en la cadera (52 %), el muslo (35 %), la rodilla (26 %, a través del obturador) o la ingle (14 %), y pasan de media 4–5 meses hasta el diagnóstico. La rotación interna está limitada y duele, la cadera rota hacia fuera al flexionarla (signo de Drehmann) y hay cojera. Goodman describe a un chico de 13 años con una abducción y rotación externa forzadas: la radiografía AP era normal y la lateral mostró el deslizamiento.\n\nPerthes: entre los 4 y los 10 años, de 3 a 5 veces más en niños; cojera poco o nada dolorosa que empeora con la actividad, dolor de cadera, ingle o solo de rodilla, sin fiebre, y limitación de la abducción y la rotación interna. Lluch da 4–8 años; la fuente más actual (Sabry y Li 2026), 4–10.\n\nAvulsiones: en adolescentes, con una tracción brusca al chutar, esprintar o saltar; espina ilíaca anteroinferior (recto femoral), anterosuperior (sartorio), pubis (aductores), tuberosidad isquiática (isquiotibiales), trocánter menor (psoas) y mayor (rotadores). En un adulto mayor, una avulsión obliga a descartar una metástasis. La apofisitis púbica se da hasta los 21 años en varones.\n\nQué hacer con un SÍ: preguntar por fiebre y si puede apoyar, explorar la rotación interna y derivar para radiografía de las dos caderas (AP y en posición de rana).',
            fisiologia: {
              pasos: [
                'En el adolescente, la placa de crecimiento del fémur proximal es la zona más débil: durante el estirón está más vertical, soporta más cizalla y el anillo que la rodea es más fino.',
                'Una carga alta, como el sobrepeso, o una placa debilitada por un problema hormonal, hacen que la epífisis se quede en el acetábulo mientras el cuello del fémur rota hacia fuera y se desliza hacia delante.',
                'El deslizamiento duele en la cadera, pero a menudo se siente en el muslo o la rodilla a través del nervio obturador; la rotación interna se limita y la cadera rota hacia fuera al flexionarla.',
                'Si el deslizamiento es inestable, casi la mitad de los casos acaba en necrosis de la cabeza femoral.',
                'En las apófisis, donde un tendón se inserta en un núcleo de hueso aún sin fusionar, una tracción brusca puede arrancar ese fragmento: avulsión.'
              ],
              metafora: 'Como una bola de helado sobre el cucurucho: si el cono se inclina y empuja de lado, la bola resbala.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Johns 2023', 'Sabry y Li 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, p. 617.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147 y 152; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 178.',
              { texto: 'Johns 2023 — Johns, Mabrouk y Tavarez, «Slipped Capital Femoral Epiphysis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538302/' },
              { texto: 'Sabry y Li 2026 — Sabry y Li, «Legg-Calve-Perthes Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de marzo de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513230/' }
            ]
          } },
        { id: 'ca_os4', text: '¿De niño o adolescente tuvo algún problema en las caderas (displasia, Perthes, epifisiolisis)?', alerta: false,
          razonamiento: {
            porque: 'Estas enfermedades de la infancia pueden dejar una cadera que no encaja bien: un acetábulo poco profundo (displasia) o una cabeza femoral aplanada o deformada (Perthes, epifisiolisis). Esa mala congruencia concentra la carga en el borde del acetábulo y favorece el pinzamiento y la artrosis precoz.',
            peso: 'No es una bandera roja: orienta hacia una causa intraarticular del dolor de cadera. Los deportistas jóvenes con antecedente de epifisiolisis, Perthes o displasia son más propensos a tener problemas de cadera (Lluch), y la displasia es la causa más frecuente de artrosis precoz en mujeres menores de 40 años (Nandhagopal 2024). Algunas displasias no se detectaron al nacer y se descubren en adultos jóvenes por dolor, debilidad o una marcha alterada.',
            detalle: 'Displasia: va de una inestabilidad leve a la luxación; se llama «del desarrollo» porque no siempre está presente o se detecta al nacer. Factores de riesgo: sexo femenino, presentación de nalgas, antecedente familiar y fajar al bebé con las piernas juntas y estiradas. Según la edad da inestabilidad en el lactante, marcha asimétrica en el niño, dolor en la adolescencia y artrosis en el adulto, y puede acelerar el desgaste de la rodilla. Un acetábulo poco profundo o vertical carga el borde. La movilidad aumentada de la cadera puede deberse a una displasia o a laxitud capsular (Lluch).\n\nPerthes: la forma final de la cabeza se decide durante la fase de reosificación; puede quedar grande, aplanada o no esférica, con pinzamiento y artrosis precoz.\n\nPor qué preguntarlo: la historia de la cadera debe incluir las enfermedades de la infancia («cadera que chasquea», epifisiolisis, displasia) y los antecedentes familiares de dolor y artrosis de cadera (Kemp 2017, en Lluch).\n\nQué hacer con un SÍ: anotarlo como antecedente; pesa en el árbol al valorar lo intraarticular.',
            fisiologia: {
              pasos: [
                'La cadera se forma por el contacto continuo entre la cabeza del fémur y el acetábulo; en el útero la cabeza crece más deprisa, y el acetábulo sigue creciendo hasta los 5 años.',
                'Si ese contacto falla, el acetábulo queda poco profundo o vertical y cubre mal la cabeza (displasia).',
                'En el Perthes, la cabeza pierde su riego, se reabsorbe y se reconstruye en 2–4 años; si no está bien contenida en el acetábulo mientras está blanda, se aplana o se agranda.',
                'Una cabeza que no es esférica, o un acetábulo que la cubre mal, concentran la carga en el borde: más tensión en un punto del cartílago, pinzamiento y desgaste precoz.'
              ],
              metafora: 'Como una bisagra mal ajustada: funciona, pero se gasta antes por donde roza.'
            },
            fuentes: ['Lluch 2020', 'Nandhagopal 2024', 'Sabry y Li 2026'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 131; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 152; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 158.',
              { texto: 'Nandhagopal 2024 — Nandhagopal, Tiwari, Tiwari y De Cicco, «Developmental Dysplasia of the Hip», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de mayo de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK563157/' },
              { texto: 'Sabry y Li 2026 — Sabry y Li, «Legg-Calve-Perthes Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de marzo de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513230/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), BANDERAS «Inflamatoria o infecciosa»
      // y URGENCIA («sospecha de artritis séptica: urgencias hoy»).
      id: 'ca_inflam', icon: '🔥', nombre: 'Inflamatoria / Infecciosa',
      banderasRojas: [
        'Artritis séptica, osteomielitis, absceso del psoas: fiebre, malestar general, tumefacción dolorosa → urgencias hoy si se sospecha artritis séptica',
        'AR y otras artropatías multiarticulares, espondilitis anquilosante'
      ],
      banderasAmarillas: [
        'VSG como prueba de bajo coste antes que la RM'
      ],
      preguntas: [
        { id: 'ca_in1', text: '¿Tiene fiebre o se encuentra mal en general, con la cadera muy dolorosa o hinchada, hasta el punto de no poder apoyar la pierna?', alerta: true, s1: true, urgencia: 'Sospecha de artritis séptica: derivación a urgencias hoy.',
          razonamiento: {
            porque: 'En la artritis séptica, bacterias que llegan por la sangre (o por una herida, una infiltración o una cirugía) invaden la sinovial y desencadenan una inflamación intensa que destruye el cartílago. En la cadera, además, el pus aumenta la presión dentro de la cápsula y puede cortar el riego de la cabeza femoral.',
            peso: 'Es una urgencia ortopédica: la mortalidad hospitalaria es del 7–15 % y un tercio queda con secuelas (Momodu y Savaliya); en los niños, la cadera es la articulación con más complicaciones (alrededor del 40 %). La fiebre solo aparece en el 40–60 %: su ausencia no la descarta. En el niño con la cadera dolorosa, los criterios de Kocher (fiebre de más de 38,5 °C, no apoyar, VSG de más de 40 y más de 12.000 leucocitos) estiman el riesgo: con 3 de 4, un 93 %. Ante la sospecha, urgencias hoy.',
            detalle: 'Quién: más en niños, sobre todo menores de 5 años (la cadera es la articulación más afectada en ellos), con el doble de varones. En adultos: más de 80 años, diabetes, artritis reumatoide, cirugía articular reciente, prótesis, infiltración previa, infecciones de la piel o úlceras, VIH, artrosis, actividad sexual (gonococo) y sepsis; también drepanocitosis, hemofilia e inmunodepresión. Goodman añade el cateterismo de la arteria femoral y pide derivar el dolor articular sin causa con un exantema o una infección en las 6 semanas previas (hepatitis, mononucleosis, infección urinaria, respiratoria, de transmisión sexual, estreptococo, dental), y el dolor articular nuevo tras una cirugía. El color azulado o el enrojecimiento con un dolor exquisito son signo de articulación séptica.\n\nCómo se presenta: dolor agudo en una articulación, fiebre, hinchazón y rechazo a moverla; el dolor aparece con el movimiento activo y el pasivo, y el paciente cojea o deja de apoyar. En el lactante, la cadera se coloca en flexión, abducción y rotación externa y duele al cambiar el pañal. La infección de la cadera puede doler solo en la rodilla. Con una prótesis, el dolor que no cede con el reposo y sigue de noche hace pensar en una infección.\n\nCon qué se confunde en el niño: sinovitis transitoria, osteomielitis, absceso del psoas, Perthes, epifisiolisis, fractura oculta y leucemia. Lluch incluye la artritis séptica, la osteomielitis y el absceso del psoas entre las banderas rojas musculoesqueléticas de la cintura pélvica.',
            fisiologia: {
              pasos: [
                'La sinovial está muy irrigada y no tiene una membrana basal que la limite: las bacterias que circulan por la sangre pueden sembrarse en ella; también llegan por una herida, una infiltración, una cirugía o desde una osteomielitis vecina.',
                'En el líquido sinovial desencadenan una inflamación intensa: citoquinas y enzimas que degradan el cartílago y frenan su reparación.',
                'El derrame y el pus aumentan la presión dentro de la cápsula, que en la cadera puede comprometer el riego de la cabeza femoral.',
                'La articulación duele con cualquier movimiento, activo o pasivo, y se deja de apoyar; la cadera busca la flexión, la abducción y la rotación externa, la postura en que la cápsula tiene más sitio y menos presión.'
              ],
              metafora: 'Como una olla a presión: la inflamación llena la cápsula y la presión daña lo que hay dentro.'
            },
            fuentes: ['Momodu y Savaliya 2023', 'Vijayan y Mabrouk 2026', 'Goodman 2018', 'Lluch 2020'],
            citas: [
              { texto: 'Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538176/' },
              { texto: 'Vijayan y Mabrouk 2026 — Vijayan y Mabrouk, «Septic Arthritis of the Pediatric Hip», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459284/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, p. 455; cap. 16, pp. 611, 614, 633 y 639.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.'
            ]
          } },
        { id: 'ca_in2', text: '¿Le duelen o se le hinchan otras articulaciones, o tiene diagnóstico de artritis reumatoide o espondilitis anquilosante?', alerta: true,
          razonamiento: {
            porque: 'La artritis reumatoide y la espondilitis anquilosante son enfermedades inflamatorias sistémicas que pueden afectar a la cadera: la artritis reumatoide inflama la sinovial de varias articulaciones, y la espondilitis inflama las entesis, la sacroilíaca y articulaciones grandes como la cadera. Que duelan o se hinchen otras articulaciones orienta a una causa inflamatoria y no mecánica.',
            peso: 'No hay cifras para la pregunta. En la artritis reumatoide, diagnosticar y tratar pronto cambia el pronóstico: Goodman propone derivar ante dolor al comprimir metacarpianos o metatarsianos, tres o más articulaciones hinchadas o más de una hora de rigidez matutina, porque a los 2 años el 70–90 % ya tiene erosiones. En la espondilitis, la pista es el dolor lumbar o de nalga inflamatorio por debajo de los 40 años. Con el diagnóstico ya conocido, pesa sobre todo como factor de riesgo de artritis séptica.',
            detalle: 'Artritis reumatoide: autoinmune y sistémica; empieza en las articulaciones pequeñas de manos y pies, de forma simétrica, y si no se trata pasa a las grandes, como la cadera y la rodilla. Rigidez tras la inactividad (sobre todo por la mañana), hinchazón, calor y enrojecimiento, pérdida de peso, febrícula; síntomas que duran más de 2 semanas. Más en mujeres (riesgo de por vida del 3,6 % frente al 1,7 %); un tercio empieza después de los 60. El tabaco es el factor ambiental más fuerte. Los corticoides que muchos toman suben el riesgo de osteonecrosis y de fracturas por insuficiencia: Goodman describe una fractura de las ramas púbicas en una mujer con artritis reumatoide tratada con prednisona.\n\nEspondilitis anquilosante: inflamación de las entesis; empieza antes de los 40 (el 80 % antes de los 30) y es más frecuente en hombres (HLA-B27). Dolor y rigidez lumbar de más de 3 meses, peor por la mañana durante más de una hora, que se nota en la pelvis, las nalgas y las caderas y se confunde con una ciática. Dolor inflamatorio: al menos 4 de 5 rasgos (inicio antes de los 40, comienzo insidioso, mejora con el ejercicio, no mejora con el reposo, dolor nocturno que mejora al levantarse). Afecta también a la sínfisis del pubis, el hombro y la cadera; se acompaña de enfermedad inflamatoria intestinal (hasta el 50 %), uveítis y psoriasis. La VSG y la PCR están altas en el 50–70 %: normales no la descartan.\n\nEn la cadera: Lluch cuenta las espondiloartropatías y la artritis reumatoide entre los factores que facilitan el síndrome de dolor trocantéreo, y entre las banderas rojas inflamatorias de la cintura pélvica.\n\nQué hacer con un SÍ: preguntar qué articulaciones, si es simétrico, cuánto dura la rigidez matutina, y por ojos, piel e intestino; derivar al médico.',
            fisiologia: {
              pasos: [
                'En la artritis reumatoide, el sistema inmune ataca la sinovial: se llena de linfocitos y macrófagos que producen citoquinas como el TNF, la IL-6 y la IL-1.',
                'Los sinoviocitos se vuelven invasivos y, con los neutrófilos del líquido articular, liberan enzimas que destruyen el cartílago y erosionan el hueso del borde de la articulación.',
                'La articulación se hincha, se calienta y se pone rígida, sobre todo por la mañana o tras estar quieto, y la enfermedad pasa de unas articulaciones a otras.',
                'En la espondilitis anquilosante, la inflamación se centra en las entesis, donde ligamentos, tendones y cápsulas se insertan en el hueso, con linfocitos T, macrófagos, TNF-α y TGF-β.',
                'Esa inflamación crónica acaba en fibrosis y osificación: dolor y rigidez que empeoran con el reposo y mejoran con el movimiento, en la sacroilíaca, la columna y articulaciones como la cadera.'
              ],
              metafora: 'Como un servicio de seguridad que se equivoca de objetivo y empieza a desmontar la propia casa por las juntas.'
            },
            fuentes: ['Goodman 2018', 'Chauhan 2023', 'Wenker y Quint 2023', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 439–440, 447–448 y 455; cap. 15, p. 582; cap. 16, pp. 627 y 636.',
              { texto: 'Chauhan 2023 — Chauhan, Jandu, Brent y Al-Dhahir, «Rheumatoid Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441999/' },
              { texto: 'Wenker y Quint 2023 — Wenker y Quint, «Ankylosing Spondylitis», StatPearls [Internet], NCBI Bookshelf, última actualización 20 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470173/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.'
            ]
          } },
        { id: 'ca_in3', text: '¿Le han operado de la cadera o la ingle (prótesis, artroscopia, hernia) o le han infiltrado la cadera, y el dolor es nuevo, no cede en reposo o ha tenido una infección reciente?', alerta: true,
          razonamiento: {
            porque: 'Una prótesis, una cirugía o una infiltración son una puerta para la infección: las bacterias pueden entrar durante el procedimiento o llegar más tarde por la sangre desde una infección en otro sitio. Un dolor nuevo que no cede en reposo y sigue de noche, o que aparece tras una infección reciente, puede ser la primera señal.',
            peso: 'No hay cifras para la pregunta. Lluch incluye la cirugía previa de cadera o ingle entre las banderas rojas del dolor de cadera e ingle. Para Goodman, una prótesis (sobre todo de cadera) con una infección reciente de cualquier tipo y un dolor nuevo de cadera, ingle o rodilla es sospechosa, y el dolor persistente que no cede en reposo y sigue de noche sugiere infección y pide derivación médica. La cirugía articular reciente, la prótesis y la infiltración previa son factores de riesgo de artritis séptica en el adulto (Momodu y Savaliya).',
            detalle: 'Infección de prótesis, según el tiempo desde la cirugía: precoz (en los 3 primeros meses), diferida (de 3 a 24 meses) o tardía (más de 24 meses), esta casi siempre por bacterias llegadas por la sangre desde otro foco; la mayoría tiene una fístula que supura (Momodu y Savaliya). Diferencial con el aflojamiento de un componente: dolor de «arranque» en la ingle o el muslo que cede tras 5–10 pasos y vuelve al caminar un rato; el dolor que no cede en reposo y sigue de noche orienta a infección. Ante un dolor articular sin causa clara, preguntar por infecciones de las últimas 6 semanas (urinaria, respiratoria, dental, de transmisión sexual, por estreptococo) y por exantema: si los hay, derivar (Goodman). Si además hay fiebre, malestar general o no puede apoyar, es la pregunta de artritis séptica: urgencias hoy.',
            fisiologia: {
              pasos: [
                'Una cirugía o una infiltración abre un camino directo para que las bacterias entren en la articulación; más tarde también pueden llegar por la sangre desde una infección en otro sitio.',
                'La sinovial está muy irrigada y no tiene una membrana basal que la limite, así que las bacterias que llegan se instalan con facilidad; algunas, como el estafilococo, tienen adhesinas que las pegan a las proteínas de la articulación.',
                'La inflamación libera citoquinas y proteasas que dañan la articulación; el dolor deja de depender de la postura y la carga: no cede en reposo y sigue de noche.',
                'En una prótesis, la infección puede dar la cara en los primeros meses o años después, y a menudo acaba abriendo una fístula que supura.'
              ],
              metafora: 'Como una puerta que se abrió para arreglar la casa: casi siempre se cierra bien, pero conviene vigilar quién pudo entrar.'
            },
            fuentes: ['Goodman 2018', 'Momodu y Savaliya 2023', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, pp. 611, 614 y 633.',
              { texto: 'Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538176/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 146.'
            ]
          } }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.cadera
export const tree = {
  title: 'Algoritmo CIF — Cadera',
  steps: [
    {
      id: 'ca_step1',
      // Lluch 2020, cap. 4.1.3, pp. 153–154; cap. 4.1.4, pp. 157–158; Goodman 2018, cap. 15, p. 582.
      tag: 'Paso 1 — Diferenciación Proximal (Clearing)',
      question: '¿El dolor podría ser referido desde la columna lumbar o la articulación sacroilíaca?',
      options: [
        { label: 'SÍ — SACROILÍACA: señala con el dedo el dolor junto a la EIPS (rara vez por encima de L5) y 3 o más de 5 tests de provocación positivos', value: 'si_asi', next: null, hypothesis: ['ca10'] },
        { label: 'SÍ — LUMBAR: el dolor cambia con movimientos repetidos de la espalda, o la elevación de la pierna recta o el slump reproducen su dolor', value: 'si_lumbar', next: null, hypothesis: [] },
        { label: 'NO — Origen coxofemoral: la cojera (unas 7 veces) y la rotación interna limitada (unas 14 veces) orientan más a la cadera que a la columna', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 4: lesión aguda. Palpar
      // primero; luego resistencia y estiramiento.
      id: 'ca_step1b',
      tag: 'Paso 1b — Lesión Aguda de Ingle',
      question: '¿Hay un evento desencadenante concreto y reciente (chut, sprint, cambio de dirección, estiramiento)?',
      options: [
        { label: 'SÍ — LESIÓN AGUDA: palpar primero; luego resistencia y estiramiento', value: 'si', next: null, hypothesis: ['ca11'] },
        { label: 'NO — Sin evento desencadenante concreto', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ca_step2',
      tag: 'Paso 2 — Perfil Articular y Edad',
      question: '¿El perfil es degenerativo (edad ≥45 años, rigidez matutina breve)?',
      options: [
        { label: 'SÍ — Edad ≥45 años, rigidez matutina <1 hora, rotación interna <24°', value: 'si', next: null, hypothesis: ['ca1'] },
        { label: 'NO — Paciente joven/activo con síntomas mecánicos', value: 'no', next: 'ca_step3', hypothesis: [] }
      ]
    },
    {
      id: 'ca_step3',
      // Lluch 2020, cap. 4.1.2, p. 137; cap. 4.1.4, pp. 162–163: flexión-RI y FADDIR
      // tienen S alta y E baja; sirven para descartar, no para confirmar.
      tag: 'Paso 3 — Intraarticular (Joven/Activo)',
      question: '¿Sospecha de origen intraarticular: dolor inguinal ligado al movimiento con FADDIR o flexión-RI positivos? Estos tests descartan; positivos no confirman.',
      options: [
        { label: 'SÍ — Compatible con pinzamiento femoroacetabular (SIFA), sin confirmar: seguir con Thomas', value: 'sifa', next: null, hypothesis: ['ca2'] },
        { label: 'SÍ, con chasquido doloroso, bloqueo o fallo — Posible desgarro labral', value: 'labrum', next: null, hypothesis: ['ca2', 'ca3'] },
        { label: 'NO — FADDIR y flexión-RI negativos: origen intraarticular improbable', value: 'no', next: 'ca_step4', hypothesis: [] }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 5b. Solo se llega si el paso 3
      // es positivo (su «NO» salta al paso 4: intraarticular improbable).
      // La tarjeta dice «identificar entidad» sin nombrarlas: aquí van las
      // fichas intraarticulares que aún no activa el paso 3.
      id: 'ca_step3b',
      tag: 'Paso 3b — Intraarticular Probable (Thomas)',
      question: '¿Thomas positivo con historia compatible (signo de la «C», síntomas mecánicos)? Identificar la entidad; pueden coexistir.',
      options: [
        { label: 'INESTABILIDAD / LIGAMENTO REDONDO — Movilidad aumentada, log roll positivo, al menos un episodio de fallo', value: 'inestabilidad', next: null, hypothesis: ['ca12'] },
        { label: 'CONDROPATÍA — Dolor en reposo y nocturno con síntomas mecánicos, rigidez; IMC >25', value: 'condropatia', next: null, hypothesis: ['ca13'] },
        { label: 'ARTROSIS — ≥50 años', value: 'artrosis', next: null, hypothesis: ['ca1'] },
        { label: 'FAIS / LABRUM — Thomas positivo sin rasgos de las anteriores (ya activados en el paso 3)', value: 'fais_labrum', next: null, hypothesis: [] },
        { label: 'NO CONCLUYENTE — Pueden coexistir: seguir', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ca_step4',
      tag: 'Paso 4 — Cuadrante Lateral',
      question: '¿El dolor se localiza en la CARA EXTERNA de la cadera (trocánter mayor)?',
      options: [
        { label: 'SÍ — Sensibilidad en trocánter mayor y dolor en apoyo monopodal <30s', value: 'tendino', next: null, hypothesis: ['ca4'] },
        { label: 'SÍ — Con marcha de Trendelenburg o debilidad medida en abductores', value: 'debilidad', next: null, hypothesis: ['ca5'] },
        { label: 'SÍ — Calidad deficiente en sentadilla monopodal o step-down', value: 'control', next: null, hypothesis: ['ca6'] },
        { label: 'NO — Sin dolor lateral', value: 'no', next: 'ca_step5', hypothesis: [] }
      ]
    },
    {
      id: 'ca_step5',
      tag: 'Paso 5 — Cuadrante Posterior',
      question: '¿El dolor se localiza en el GLÚTEO o zona isquiática?',
      options: [
        { label: 'Dolor profundo en glúteo que empeora al sentarse (ciática) — posible Síndrome Piriforme', value: 'piriforme', next: null, hypothesis: ['ca7'] },
        { label: 'Dolor que empeora con zancada larga al caminar — posible Pinzamiento Isquiofemoral', value: 'isquiof', next: null, hypothesis: ['ca8'] },
        { label: 'Sensibilidad sobre tuberosidad isquiática — posible Tendinopatía Proximal Isquiotibiales', value: 'isquiotib', next: null, hypothesis: ['ca9'] },
        { label: 'Sin localización clara posterior', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 6, INGLE: entidades de Doha
      // (tabla ORIENTATIVA de la tarjeta). Lo LATERAL (SDTM) ya está en el paso 4.
      id: 'ca_step6',
      tag: 'Paso 6 — Ingle (Entidades de Doha)',
      question: '¿Qué reproduce su dolor conocido en la INGLE? Palpar primero y con precisión: las estructuras se solapan.',
      options: [
        { label: 'ADUCTOR — Palpación dolorosa de aductores + squeeze doloroso', value: 'aductor', next: null, hypothesis: ['ca16'] },
        { label: 'PSOAS ILÍACO — Palpación dolorosa supra o infrainguinal', value: 'psoas', next: null, hypothesis: ['ca17'] },
        { label: 'INGUINAL — Palpación dolorosa del canal sin hernia palpable (de pie y con tos)', value: 'inguinal', next: null, hypothesis: ['ca18'] },
        { label: 'PÚBICO — Palpación dolorosa de la sínfisis y el hueso adyacente', value: 'pubico', next: null, hypothesis: ['ca19'] },
        { label: 'NINGUNO — Sin dolor inguinal o nada lo reproduce', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Tarjeta cadera (guía de consulta), nodo 6, NEUROPÁTICO y «nada encaja».
      id: 'ca_step7',
      tag: 'Paso 7 — Neuropático o Dolor Extenso',
      question: '¿Hay un patrón neuropático, o nada encaja y el dolor es extenso?',
      options: [
        { label: 'MERALGIA — Tinel bajo la EIAS, parestesias anterolaterales del muslo', value: 'meralgia', next: null, hypothesis: ['ca14'] },
        { label: 'OBTURADOR — Dolor en ingle y muslo medial con el ejercicio', value: 'obturador', next: null, hypothesis: ['ca14'] },
        { label: 'ILIOINGUINAL, ILIOHIPOGÁSTRICO O GENITOFEMORAL — Arch and twist de pie', value: 'ilioinguinal', next: null, hypothesis: ['ca14'] },
        { label: 'PUDENDO — Dolor perineal al sentarse o en bici, sin déficit sensitivo objetivo', value: 'pudendo', next: null, hypothesis: ['ca14'] },
        { label: 'SENSIBILIZACIÓN CENTRAL — Nada encaja o dolor extenso (revisar banderas rojas)', value: 'sc', next: null, hypothesis: ['ca15'] },
        { label: 'NINGUNO — Sin patrón neuropático ni dolor extenso', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── CADERA ─────────────────────────────────────────────
  ca1: {
    id: 'ca1', region: 'cadera', num: '①',
    name: 'Artrosis de Cadera',
    prom: 'HOOS (MCID: 10–13 puntos en subescalas)',
    dosis: 'Educación junto con ejercicio o terapia manual: modificar la actividad, hacer ejercicio, apoyar la pérdida de peso si hay sobrepeso y enseñar formas de descargar la articulación (B). Ejercicio individualizado de flexibilidad, fuerza y resistencia dirigido a los déficits de movilidad, fuerza y flexibilidad, de 1 a 5 veces por semana durante 6–12 semanas en la artrosis leve o moderada (A); NICE: ofrecer a todos ejercicio terapéutico adaptado (fuerza local y forma aeróbica general) y considerar sesiones supervisadas. Avisar de que al empezar el dolor puede aumentar y de que la constancia es lo que trae el beneficio. Entrenamiento funcional, de marcha y de equilibrio, con bastón u otra ayuda si hace falta (C). Con sobrepeso, colaborar con medicina o nutrición (C): cualquier pérdida ayuda, y un 10 % es mejor que un 5 %. Terapia manual (con o sin thrust, tejidos blandos), 1–3 veces por semana durante 6–12 semanas y siempre junto al ejercicio: la guía APTA la recomienda con grado A, pero NICE, más reciente, solo pide considerarla junto al ejercicio y nunca sola. Ortesis, no como primera opción (F). No ofrecer acupuntura, punción seca ni electroterapia (TENS, ultrasonidos, interferenciales, láser, onda corta, electroestimulación): NICE descarta el ultrasonido que la guía APTA de 2017 admitía (B).',
    dosisFuente: 'Cibulka 2017, J Orthop Sports Phys Ther 47(6):A1–A37 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · NICE NG226 (rec. 1.3.1–1.3.11; prevalece donde chocan, por ser más reciente)',
    pronostico: {
      horizonte: 'Radiografía: pinzamiento del espacio articular u osteofitos.',
      derivacion: 'Considerarla siempre en mayores de 50, también en deportistas. La sensibilización central se ha estudiado sobre todo aquí y hace los síntomas vagos.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 138; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164'
    },
    tests: [
      { name: 'Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hallazgo: la S 95 % / E 69 % que figuraba son de los criterios clínicos de artrosis de rodilla (Altman 1986), no de cadera. El criterio más parecido para cadera es el diagnóstico clínico de NICE (edad >45, dolor con la actividad, sin rigidez matutina o ≤30 min), que no aporta sensibilidad ni especificidad. Rigidez matutina <60 min ausente sí orienta en contra (LR− 0,22–0,65).', fuente: 'NICE NG226 (2022). Metcalfe 2019 (JAMA) para la rigidez matutina' },
      { name: 'Aducción de cadera disminuida', sn: '80%', sp: '81%', lr_pos: '4.2', lr_neg: '0.25', criterio: 'Pérdida de aducción pasiva comparada con el lado sano. Normal, es el hallazgo que más aleja la artrosis.', fuente: 'Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); LR+ IC 95 %: 3,0–6,0; LR− IC 0,11–0,54' },
      { name: 'Rotación Interna disminuida (<24°)', sn: '66%', sp: '79%', lr_pos: '3.2', lr_neg: '0.43', criterio: 'Rotación interna pasiva de cadera menor de 24° (o 15° menos que lado sano). El umbral es de la tarjeta: en los estudios, «disminuida» con goniómetro o frente al lado sano.', fuente: 'Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); LR+ IC 95 %: 1,7–6,0; LR− IC 0,31–0,60' },
      { name: 'Dolor posterior con sentadilla profunda', sn: '24%', sp: '96%', lr_pos: '6.1', lr_neg: '0.79', criterio: 'Alta especificidad. Dolor posterior al realizar una sentadilla profunda. Negativa no descarta.', fuente: 'Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); 72 pacientes, LR+ IC 95 %: 1,3–29' },
      { name: 'Debilidad de abductores', sn: '44%', sp: '90%', lr_pos: '4.5', lr_neg: '0.62', criterio: 'Debilidad de la abducción de cadera frente al lado sano. Alta especificidad; normal no descarta.', fuente: 'Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); LR+ IC 95 %: 2,4–8,4' },
      { name: 'Criterios clínicos ACR (árbol de clasificación)', sn: null, sp: null, lr_pos: null, lr_neg: null, absorbe: [0, 2], criterio: 'Dolor de cadera y, además: (1) RI ≥15°, dolor en la RI, rigidez matutina ≤60 min y edad >50 años; o bien (2) RI <15° y VSG ≤45 mm/h (sin VSG: flexión ≤115°). La tarjeta cita solo la rama (1). En la muestra en la que se crearon (201 pacientes con dolor de cadera, frente a artritis reumatoide, espondiloartropatía y otras causas) daban S 86 % · E 75 % (Altman 1991), pero no puntúa: en atención primaria, en pacientes de 50 años o más, los criterios clínicos no concuerdan con los criterios del ACR que incluyen radiografía (kappa ≤ 0,11; Bierma-Zeinstra 1999), y una revisión los da por poco fiables en ese ámbito (Reijman 2004). La rotación interna disminuida, que forma parte del árbol, sí tiene cifras de atención primaria y puntúa sola.', fuente: 'Altman 1991 (Arthritis Rheum 34:505–14, criterios ACR; n = 201 con dolor de cadera, controles con dolor de cadera de otra causa). En atención primaria: Bierma-Zeinstra 1999 (J Rheumatol 26:1129–33; n = 227 de 50 años o más, derivados a radiografía por su médico de cabecera) y Reijman 2004 (Ann Rheum Dis 63:226–32, revisión sistemática de definiciones de artrosis de cadera)' },
      { name: 'Apoyo monopodal (30 s)', sn: '55%', sp: '70%', lr_pos: '1.83', lr_neg: '0.82', criterio: 'De pie, levanta una pierna flexionando cadera y rodilla y se apoya solo en la afectada. Positivo: reproduce su dolor antes de 30 s, comparado con el otro lado. LR+ y LR− cercanas a 1: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 170' }
    ]
  },
  ca2: {
    id: 'ca2', region: 'cadera', num: '②',
    name: 'Síndrome de Pinzamiento Femoroacetabular (SIFA)',
    prom: 'iHOT-12 (MCID: 14–26 puntos)',
    dosis: 'Abordaje multimodal (B): modificar la actividad y fortalecer la musculatura propia de la cadera (psoas ilíaco, glúteo medio y mayor, rotadores internos y externos), el tronco (abdominales y paravertebrales) y el resto del miembro inferior, junto con terapia manual, corrección postural y del movimiento, estiramientos y equilibrio. Evitar los ejercicios que provoquen síntomas o que lleven a rangos que reproduzcan el pinzamiento. Educación para modificar los factores agravantes y manejar el dolor (C); entrenamiento del patrón de movimiento en las actividades que duelen (C); movilización articular si el dolor o la cápsula limitan la movilidad, y de tejidos blandos si lo hacen músculo y fascia (F); reeducación neuromuscular progresiva (F). La ortesis sola no se recomienda (D, evidencia contradictoria). Duración de al menos 3 meses; recomendar actividad física, incluido el deporte, y hablar de expectativas, decidir juntos y educar (consenso de Zúrich). En el ensayo FASHIoN, 6–10 contactos en 12–24 semanas; la artroscopia mejoró algo más a los 12 meses (6,8 puntos de iHOT-33). Ninguna fuente fija series ni repeticiones: el volumen queda a criterio del clínico.',
    dosisFuente: 'Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348)',
    pronostico: {
      horizonte: 'Radiografía AP de pelvis + axial. CAM: ángulo alfa >55°. PINCER: sobrecobertura, signo del cruce. Artro-RM para labrum y cartílago.',
      derivacion: 'CAM en asintomáticos: 54,8 % de deportistas y 23,1 % de población general. Sin dolor relacionado con el movimiento NO hay FAIS. CAM tiende a lesionar el cartílago; PINCER, el labrum.',
      fuente: 'Lluch 2020, cap. 4.1.1 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 125; cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 136; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 175–176'
    },
    tests: [
      { name: 'Test FADDIR (Flexión-Aducción-Rotación Interna)', sn: '80%', sp: '24%', lr_pos: null, lr_neg: null, criterio: 'Cadera a 90° de flexión, aducción completa y rotación interna máxima. Positivo: dolor conocido, bloqueo, chasquido o enganche. En pacientes derivados con sospecha de SIFA, S 80 %, E 24 % (LR− 0,83): no puntúa. Un negativo orienta algo en contra, pero no descarta. El valor agrupado de Reiman 2015 (S 99 %, E 5 %, LR− 0,14) sale de pacientes ya operados, con una probabilidad previa del 90 % y un IC del LR− que llega a 0,93.', fuente: 'Pålsson 2020 (Knee Surg Sports Traumatol Arthrosc; 69 caderas de 63 pacientes derivados a atención especializada, 35 con SIFA; referencia: síntomas + morfología cam/pincer + respuesta a infiltración intraarticular; S IC 95 %: 67–93 %, E IC 9–38 %). Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral, tabla 4: 4 estudios, n = 319, referencia: cirugía, probabilidad previa 90 %; LR− IC 95 %: 0,02–0,93; con artro-RM como referencia, 4 estudios, n = 188: LR− 0,45, IC 0,19–1,09)' },
      { name: 'Test FABER (Flexión-Abducción-Rotación Externa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino, en posición de 4: el tobillo sobre la rodilla contraria; se estabiliza la EIAS contraria y se baja la rodilla hasta el final del rango con ligera sobrepresión. Positivo: reproduce su dolor conocido o dolor en otra región. Ninguna revisión sistemática ha analizado su exactitud (la técnica varía entre estudios); un Delphi dio un 67 % de consenso sobre su utilidad clínica.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 162' },
      { name: 'Rotación Interna de cadera en posición neutra <24°', sn: '29%', sp: '94%', lr_pos: null, lr_neg: null, criterio: 'Alta especificidad para SIFA cuando es positivo. En el estudio no se midieron grados: prono, cadera en extensión, positivo = RI disminuida (con o sin dolor) según el examinador; el umbral de 24° es de la tarjeta. Fiabilidad moderada (kappa 0,43). Negativa no descarta (S 29 %).', fuente: 'Pålsson 2020 (Knee Surg Sports Traumatol Arthrosc; 69 caderas de 63 pacientes derivados a atención especializada, 35 con SIFA; referencia: síntomas + morfología cam/pincer + respuesta a infiltración intraarticular). S IC 95 %: 13–44 %; E IC 86–100 %' },
      { name: 'Dolor inguinal', sn: '96–100%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin dolor inguinal, FAIS y labrum son improbables.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137' },
      { name: 'Test de flexión-rotación interna', sn: null, sp: null, lr_pos: '1.28', lr_neg: null, criterio: 'Supino, cadera a 90° de flexión y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche. Metaanálisis: S 96 %, E 25 %, LR− 0,15, pero con IC 95 % hasta 1,99 (27 pacientes): la tarjeta lo usa para descartar, la evidencia aún no lo sostiene.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 2 estudios, n = 27)' },
      { name: 'Test de Thomas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. Su evidencia es para rotura labral, no para SIFA, y ni allí puntúa (ver la hipótesis de labrum): aquí cuenta como hallazgo.', fuente: 'McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)' },
    ]
  },
  ca3: {
    id: 'ca3', region: 'cadera', num: '③',
    name: 'Desgarro del Labrum Acetabular',
    prom: 'iHOT-12 (MCID: 9–26 pts) / HOOS (MCID: 10–13 pts)',
    dosis: 'El mismo abordaje multimodal que en el SIFA, que la guía recomienda en particular para el SIFA y las lesiones del labrum (B): modificar la actividad y fortalecer cadera (psoas ilíaco, glúteos, rotadores), tronco y miembro inferior, junto con terapia manual, corrección postural y del movimiento, estiramientos y equilibrio, evitando los ejercicios y rangos que provoquen síntomas. Educación sobre los factores agravantes y el dolor (C) y entrenamiento del patrón de movimiento (C). Al menos 3 meses (consenso de Zúrich). En adolescentes con rotura labral en la RM, el 73 % de los tratados solo con fisioterapia y modificación de la actividad alcanzó la mejoría mínima importante a los 3 años, igual que con infiltración o artroscopia (serie de casos). Ninguna fuente fija series ni repeticiones: el volumen queda a criterio del clínico.',
    dosisFuente: 'Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; serie de Murtha citada en ella) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Kemp 2020, Br J Sports Med 54:1382–1394 (revisión sistemática)',
    pronostico: {
      horizonte: 'Artro-RM (contraste necesario). Mayoría anterosuperiores. Diferenciar del surco sublabral, variante normal.',
      derivacion: 'Más de dos tercios de los asintomáticos tienen hallazgos sugestivos, más aún los deportistas. La sinovitis mantenida puede favorecer la condropatía.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 176–177'
    },
    tests: [
      { name: 'Test de Arlington', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Maniobra específica de provocación labral. Estudio: S 94 %, E 33 % (IC 95 % de la E: 16–56 %), VPP 95 %, VPN 26 %; con un 93 % de roturas solo hubo unos 17 controles, así que cuenta como hallazgo.', fuente: 'Adib 2023 (Am J Sports Med; retrospectivo, evaluado por el autor de los tests; referencia: artro-RM)' },
      { name: 'Test de Torsión/Twist', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Estudio: S 68 %, E 72 % (IC 95 % de la E: 49–88 %), VPP 97 %; con un 93 % de roturas solo hubo unos 17 controles, así que cuenta como hallazgo.', fuente: 'Adib 2023 (Am J Sports Med; retrospectivo, evaluado por el autor de los tests; referencia: artro-RM)' },
      { name: 'Combinación FADDIR + FABER + Elevación pierna recta resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Positivo: los tres provocan dolor. Estudio: S 94 %, E 100 %, pero con un área bajo la curva de 0,879 que no cuadra con esas cifras, en candidatos a artroscopia (casi todos con rotura) y sin el número de controles: cuenta como hallazgo.', fuente: 'Halliwell 2026 (Arthroscopy; retrospectivo, 224 pacientes con SIFA operados; referencia: artroscopia)' },
      { name: 'Chasquido doloroso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Chasquido en la cadera asociado al dolor inguinal. Sin él, la rotura es improbable. Estudio: S 100 % (IC 95 %: 48–100 %), E 85 % (IC 55–98 %), sin LR publicada; con S 100 % la LR− calculada sería 0 y anularía la hipótesis, y con solo 4 roturas el intervalo es muy amplio: cuenta como hallazgo.', fuente: 'Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)' },
      { name: 'Test de flexión-rotación interna', sn: null, sp: null, lr_pos: '1.28', lr_neg: null, criterio: 'Supino, cadera a 90° de flexión y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche. Metaanálisis: S 96 %, E 25 %, LR− 0,15, pero con IC 95 % hasta 1,99 (27 pacientes): la tarjeta lo usa para descartar, la evidencia aún no lo sostiene.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 2 estudios, n = 27)' },
      { name: 'FADDIR (valor agrupado)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión, aducción y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche (que reproduzca el chasquido cuenta como positivo). No puntúa: el valor agrupado (S 99 %, E 5 %, LR− 0,14) sale de pacientes ya operados, con una probabilidad previa del 90 % y un IC del LR− que llega a 0,93; con artro-RM como referencia el LR− es 0,45 y su IC cruza el 1. En otra serie, S 43 %, E 56 % (Adib 2023). Un negativo no descarta la rotura.', fuente: 'Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral, tabla 4: 4 estudios, n = 319, referencia: cirugía, probabilidad previa 90 %; LR− IC 95 %: 0,02–0,93; con artro-RM como referencia, 4 estudios, n = 188: LR− 0,45, IC 0,19–1,09). Adib 2023 (Am J Sports Med; retrospectivo; referencia: artro-RM)' },
      { name: 'Test de Thomas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si la sospecha persiste. Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. No puntúa: el S 89 % / E 92 % (LR+ 11,1) no lo publicó el estudio original; lo calcularon los autores del metaanálisis de Reiman 2015 a partir de una serie de 59 casos operados, con riesgo de sesgo alto. En Narvani 2003 no fue ni sensible ni específico (positivo en 1 de 4 roturas).', fuente: 'McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)' },
      { name: 'Longitud de paso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observar la longitud de paso.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 157' }
    ]
  },
  ca4: {
    id: 'ca4', region: 'cadera', num: '④',
    name: 'Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea)',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Educación sobre la carga del tendón más ejercicio, 14 sesiones individuales en 8 semanas (la primera de 60 min, las demás de 30). Educación: evitar posturas y movimientos que comprimen los tendones contra el trocánter (aducción mantenida; no estirar piriforme ni cintilla iliotibial, que la fuerzan) y progresar la carga poco a poco. En casa, 4–6 ejercicios diarios de 15–20 min. Semana 1: isométricos de abducción en supino y de pie (5–15 s), puente y sentadilla bilaterales (10 rep) y pasos laterales (10 por lado). Semana 2: se añaden puente y sentadilla cargando más una pierna (5 rep). Semanas 3–8: ejercicios a una pierna de algo duro a duro (5–10 rep, 2 series) y deslizamientos laterales con goma; en consulta, 2 veces por semana, abducción contra resistencia, lenta y pesada. Dolor: en el ejercicio funcional, que no aumente en el trocánter; en la fuerza lenta y pesada, hasta 5/10 si cede después y no empeora esa noche ni a la mañana siguiente. Éxito (mejoría moderada o mayor): 77 % a las 8 semanas, frente al 58 % con infiltración y el 29 % esperando; a las 52 semanas, 79 % frente a 58 % y 52 %.',
    dosisFuente: 'Mellor 2018, BMJ 361:k1662 (ensayo aleatorizado LEAP, n = 204, frente a infiltración de corticoide y a esperar) · Mellor 2016, BMC Musculoskelet Disord 17:196 (protocolo del ensayo, tabla 3: ejercicios y progresión)',
    pronostico: {
      horizonte: 'RM: tendinopatía y roturas del glúteo menor al medio, líquido en las bolsas. Atrofia grasa (grados I–III): factor pronóstico importante.',
      derivacion: 'Diferencial: cadera en resorte externa, labrum (dolor lateral en el 59 %), meralgia y neuropatía iliohipogástrica.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 134, 137 y 142; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 179'
    },
    tests: [
      { name: 'Palpación del trocánter mayor / tendón glúteo', sn: '84%', sp: '66%', lr_pos: '2.42', lr_neg: '0.25', criterio: 'Decúbito lateral, caderas a ~60° de flexión: dolor a la palpación de las inserciones del glúteo medio o menor en el trocánter mayor. Negativa orienta en contra; positiva confirma poco por sí sola. Hacer después la abducción resistida: con las dos negativas, la probabilidad baja del 59 % (media de los estudios) al 14 %; con las dos positivas, sube al 96 %.', fuente: 'Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 2 estudios, certeza baja; LR+ IC 95 %: 1,37–4,30; LR− IC 0,15–0,43). Solo Grimaldi 2017 (BJSM; n = 65, referencia: RM): S 80 %, E 47 %' },
      { name: 'Apoyo Monopodal <30 segundos (Single-Leg Stance)', sn: '38%', sp: '100%', lr_pos: null, lr_neg: '0.62', criterio: 'Positivo: reproduce el dolor lateral de cadera antes de 30 s de apoyo sobre la pierna afectada. Todos los positivos tenían tendinopatía en la RM (LR+ 12,2), pero con IC 95 % de 0,8 a 191,5 (15 pacientes sin tendinopatía): aún no puntúa. El valor agrupado (LR+ 87,8, IC 3,0–2587) depende de un estudio con controles sin dolor de cadera (Lequesne 2008); certeza muy baja. Negativo no descarta (S 38 %).', fuente: 'Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM). Agrupado: Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 2 estudios, certeza muy baja)' },
      { name: 'Test de Abducción Resistida de Cadera', sn: '59%', sp: '90%', lr_pos: '6.09', lr_neg: '0.45', criterio: 'Abducción isométrica resistida con la cadera abducida (≤45°); en la versión de Grimaldi, desde aducción completa, que carga más el tendón. Positivo: reproduce el dolor lateral. Tras la palpación: con las dos positivas, la probabilidad sube del 59 % (media de los estudios) al 96 %; con las dos negativas, baja al 14 %.', fuente: 'Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 5 estudios, certeza baja; LR+ IC 95 %: 3,19–11,61; LR− IC 0,33–0,63). Incluye un estudio con controles sin dolor de cadera (Lequesne 2008)' },
      { name: 'Marcha de Trendelenburg', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Signo visual de insuficiencia del glúteo medio. Caída pélvica contralateral al apoyo. Valor agrupado: S 35 %, E 99 %, LR+ 53 con IC 0,21–13 496, LR− 0,65; certeza muy baja: no puntúa.', fuente: 'Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 3 estudios, certeza muy baja)' },
      { name: 'Derotación externa resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino, cadera a 90° en RE; el paciente vuelve a neutro contra resistencia. Positivo: reproduce su dolor. Si es negativo, repetir en prono con la cadera en extensión. No puntúa: en pacientes con dolor lateral de cadera, S 44 %, E 93 %, LR+ 6,6 con IC 0,97–45 (Grimaldi 2017). Las cifras altas (S 88 %, E 97 %) son de un estudio con controles sin dolor de cadera (Lequesne 2008), que también sostiene el valor agrupado (LR+ 16,5, IC 2,95–92,7; certeza muy baja).', fuente: 'Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM; versión con aducción añadida), según Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3, tabla 2). Lequesne 2008 (Arthritis Rheum; n = 17 con SDTM refractario de 13 meses de media, frente a 38 caderas sin dolor; referencia: RM)' },
    ]
  },
  ca5: {
    id: 'ca5', region: 'cadera', num: '⑤',
    name: 'Debilidad de Abductores de Cadera',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: '',
    tests: [
      { name: 'Test de Trendelenburg', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Incapacidad de mantener pelvis nivelada al pararse sobre una pierna — pelvis cae hacia el lado de la pierna levantada.' },
      { name: 'Dinamometría manual (HHD) de abductores', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fiabilidad suficiente para medir fuerza abductora. Comparar con lado contralateral.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172' },
      { name: 'Test de paso lateral + marcha en tándem combinados', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ambos positivos → probabilidad de debilidad aumenta de 47% a 76%. Ambos negativos → reduce de 47% a 18%.' }
    ]
  },
  ca6: {
    id: 'ca6', region: 'cadera', num: '⑥',
    name: 'Disfunción de Control Neuromuscular de Cadera',
    prom: 'HOOS (MCID: 10–13 pts) / iHOT-12 (MCID: 14–26 pts)',
    dosis: '',
    tests: [
      { name: 'Test de Sentadilla Monopodal (Single-Leg Squat)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Evaluación de calidad de movimiento: aducción de cadera, valgo de rodilla, inclinación de tronco. Fiabilidad y validez discriminativa suficientes.' },
      { name: 'Test de Step-Down', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Evaluación de calidad de movimiento durante el descenso desde un escalón. Fiabilidad suficiente.' },
      { name: 'Marcha de Trendelenburg (observación)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Inclinación del tronco hacia el lado de apoyo o caída pélvica contralateral.' }
    ]
  },
  ca7: {
    id: 'ca7', region: 'cadera', num: '⑦',
    name: 'Síndrome Glúteo Profundo (Síndrome Piriforme)',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: '',
    tests: [
      { name: 'Test de estiramiento del piriforme en sedestación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en literatura. Flexión de cadera + rotación interna en sedestación produce dolor profundo en glúteo.', noData: true },
      { name: 'Dolor con sedestación prolongada (>20 min)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Especialmente al conducir. El dolor mejora al ponerse en pie.', noData: true }
    ]
  },
  ca8: {
    id: 'ca8', region: 'cadera', num: '⑧',
    name: 'Pinzamiento Isquiofemoral',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: '',
    tests: [
      { name: 'Test de marcha con zancada larga (Long-Stride Walking Test)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados/ausentes en literatura. Reproducción del dolor con pasos largos.', noData: true }
    ]
  },
  ca9: {
    id: 'ca9', region: 'cadera', num: '⑨',
    name: 'Tendinopatía Proximal de Isquiotibiales',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: 'Programa de fuerza individualizado, progresivo y por fases, que reintroduce poco a poco la compresión del tendón (flexión profunda de cadera, estar sentado). Educación: diagnóstico, plazos de recuperación, control del dolor, papel de la compresión (incluido estar sentado) y actividades de carga alta y baja. Seguir con la actividad, incluida la carrera, guiándose por el dolor: hasta 4/10 durante la actividad y sin aumento de más de 2/10 a las 12–24 h. En el ensayo, 6 sesiones en 12 semanas (semanas 0, 1, 2, 3, 6 y 12); la fisioterapia no superó a las ondas de choque y los dos grupos mejoraron. El artículo no detalla series ni repeticiones: el volumen queda a criterio del clínico.',
    dosisFuente: 'Rich 2025, Am J Sports Med 53:3396–3407 (ensayo aleatorizado, n = 100, fisioterapia frente a ondas de choque, los dos con la misma educación)',
    tests: [
      { name: 'Sensibilidad a la palpación sobre tuberosidad isquiática', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Datos de fiabilidad limitados. Dolor exquisito a la palpación directa sobre la tuberosidad isquiática.', noData: true },
      { name: 'Dolor con test de fuerza de isquiotibiales', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor con contracción resistida de isquiotibiales.', noData: true }
    ]
  },
  ca10: {
    id: 'ca10', region: 'cadera', num: '⑩',
    name: 'Dolor Articular Sacroilíaco',
    prom: 'HOOS (MCID: 10–13 puntos)',
    dosis: '',
    tests: [
      { name: 'Test de Compresión Pélvica', sn: '69%', sp: '69%', lr_pos: '2.20', lr_neg: '0.46', criterio: 'Decúbito lateral; presión hacia la camilla sobre la cresta ilíaca de arriba. Positivo: reproduce su dolor conocido. LR+ 2,20 (IC 95 % 1,18–4,09), LR− 0,46 (IC 0,20–0,87); muestra pequeña (48 pacientes, 16 con bloqueo positivo). Si el cluster de Laslett puntúa, este test deja de contar aparte.', fuente: 'Laslett 2005 (Man Ther 10:207–218, tabla 2 y fig. 5; referencia: bloqueo anestésico intraarticular)' },
      { name: 'Test de Patrick (FABER)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede provocar dolor sacroilíaco. Sensibilidad sobre ASI sin sensibilidad en L5.' },
      { name: 'Sin sensibilidad por encima de L5', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Criterio clave de diferenciación respecto al origen lumbar.' },
      { name: 'Cluster de Laslett: 3 o más de 5 tests de provocación positivos', sn: '91%', sp: '78%', lr_pos: null, lr_neg: null, absorbe: [0, 4], criterio: 'Distracción, compresión, thigh thrust, Gaenslen y sacral thrust; positivo si 3 o más reproducen su dolor. Si los síntomas no se centralizan con movimientos repetidos, la especificidad sube al 87 %; positivos con centralización (dolor discal) son falsos positivos. Lluch cita S 85–94 %, E 79 %: se usan las cifras de la revisión de Laslett de 2008 (su estudio de 2005, con 6 tests, daba S 94 %, E 78 %). Si puntúa, la compresión y el thigh thrust dejan de contar aparte. Regla alternativa del estudio de 2005, sin Gaenslen: 2 o más positivos de 4 (distracción, thigh thrust, compresión y sacral thrust) dan S 88 %, E 78 %, LR+ 4,0 (IC 2,13–8,08), LR− 0,16 (IC 0,04–0,47); orden propuesto: thigh thrust y distracción primero, y si los dos son positivos no hace falta seguir; con uno positivo, compresión y, si es negativa, sacral thrust. Con todos los tests negativos se descarta la sacroilíaca.', fuente: 'Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153' },
      { name: 'Thigh thrust', sn: '88%', sp: '69%', lr_pos: '2.80', lr_neg: '0.18', criterio: 'Supino, mano caudal bajo el sacro, cadera a 90° de flexión: carga longitudinal por el fémur hasta 30 s (si no duele, 3–5 empujes). Positivo: reproduce su dolor. El test más sensible de la batería. LR+ 2,80 (IC 95 % 1,66–4,98), LR− 0,18 (IC 0,05–0,55); muestra pequeña (48 pacientes, 16 con bloqueo positivo). Si el cluster de Laslett puntúa, este test deja de contar aparte.', fuente: 'Laslett 2005 (Man Ther 10:207–218, tabla 2; referencia: bloqueo anestésico intraarticular); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 153–154' },
      { name: 'Prueba del dedo (Fortin)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El paciente señala con la punta del dedo el dolor inferomedial a la EIPS, al menos 2 veces en el mismo punto. Si el dolor no está en esa zona, el dolor sacroilíaco es muy improbable.', fuente: 'Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153' }
    ]
  },
  // ─── Tarjeta de consulta cadera (guía de consulta) ─────────
  // Síndromes de la tarjeta sin hipótesis previa (ca11–ca15) y entidades de
  // Doha de su tabla orientativa (ca16–ca19). Sin dosis en la guía («son
  // tuyas»): dosis '' → la fase 5 dice «a criterio del clínico». Tests sin
  // cifras con fuente = hallazgos clínicos. `pronostico`: literal de la tarjeta.
  ca11: {
    id: 'ca11', region: 'cadera', num: '⑪',
    name: 'Lesión Aguda de Ingle',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: 'Lesión aguda de aductores en deportistas: rehabilitación activa por criterios. Nueve ejercicios de ingle 3 veces por semana en días alternos (balanceos de pierna en abducción-aducción y en flexión-extensión, círculos de cadera de pie; aducción y flexión de cadera, rotación de tronco y arco de tensión con goma; coordinación a una pierna y aducción de Copenhague) y, en paralelo, carrera, sprint y cambios de dirección progresivos. Pasa al entrenamiento controlado en el campo cuando no duelen la palpación, la aducción isométrica máxima con la cadera abducida, el estiramiento pasivo máximo, la aducción con goma a 10 RM ni 10 repeticiones de Copenhague, y el sprint y las pruebas de agilidad al 100 %. Plazos (mediana): RM grado 0–2, sin dolor a los 13 días y entrenamiento completo a los 18; grado 3, a los 55 y 78 días. Recaídas al año: 5 % si se alcanzó el criterio sin dolor, frente al 21 %. Series y cargas, en un apéndice no consultado. Cohorte sin grupo control, solo varones y solo aductor: para los flexores no hay pauta.',
    dosisFuente: 'Serner 2020, Orthop J Sports Med 8(1):2325967119897247 (cohorte prospectiva, n = 81 varones de 18 a 40 años, sin grupo control)',
    pronostico: {
      horizonte: 'Ecografía o RM. En los aductores la exploración localiza la lesión con exactitud >90 %; en los flexores (psoas ilíaco, recto femoral, sartorio), poco mejor que lanzar una moneda, y la imagen puede infradiagnosticar.',
      derivacion: 'Alrededor del 40 % de las lesiones de ingle en el fútbol. Las de aductores, sobre todo el aductor largo, son unos 2/3; siguen recto femoral, psoas ilíaco, sartorio y abdominales. El aductor largo y el recto femoral pueden llegar a la rotura tendinosa proximal o a la avulsión. Vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 168, 170 y 173'
    },
    tests: [
      { name: 'Palpación del grupo sospechoso (primero)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpar PRIMERO: si no duele, se descarta (exactitud >90 % en aductores y flexores). Aductores (unos 2/3 de las lesiones agudas de la ingle, sobre todo el aductor largo), recto femoral, ilíaco y psoas.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 168' },
      { name: 'Resistencia del grupo sospechoso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Después de palpar: squeeze a 0° o flexión resistida a 90°. Cuenta si reproduce su dolor en el mismo sitio.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 168' },
      { name: 'Estiramiento del grupo sospechoso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cuenta si reproduce su dolor en el mismo sitio.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 168' }
    ]
  },
  ca12: {
    id: 'ca12', region: 'cadera', num: '⑫',
    name: 'Ligamento Redondo e Inestabilidad',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: 'Precaución principal: evitar los ejercicios y actividades que provoquen síntomas o que carguen en exceso las estructuras capsuloligamentosas (al revés que en el SIFA, donde lo que se evita son los rangos de pinzamiento). No hay evidencia de tratamiento conservador específico: en la displasia, la guía pide basar el tratamiento en la exploración y los déficits funcionales. Por extrapolación del abordaje multimodal que la guía recomienda para el SIFA y el labrum (B): modificar la actividad, fortalecer cadera, tronco y miembro inferior, reeducación neuromuscular progresiva (F), entrenamiento del patrón de movimiento (C) y educación. Ninguna fuente fija series ni repeticiones: el volumen queda a criterio del clínico.',
    dosisFuente: 'Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; la precaución está en su descripción de la intervención multimodal)',
    pronostico: {
      horizonte: 'Artro-RM. Los test de confirmación se basan en estudios únicos.',
      derivacion: 'La inestabilidad puede conducir a degeneración condral.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 163; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 175'
    },
    tests: [
      { name: 'Log roll', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más RE en el lado afectado, o el borde lateral del pie toca la camilla → laxitud capsular anterior o retroversión.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 160' },
      { name: 'Movilidad aumentada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movilidad AUMENTADA en inestabilidad. Sin síntoma específico: descartar lo intraarticular con flexión-RI y FADDIR.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 162' },
      { name: 'Episodio de fallo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Al menos un episodio de fallo.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137' }
    ]
  },
  ca13: {
    id: 'ca13', region: 'cadera', num: '⑬',
    name: 'Condropatía de Cadera',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Difícil de ver: cartílago fino y profundo. La artro-TC lo muestra mejor. Delaminación asociada a FAIS.',
      derivacion: 'Posible estadio inicial de la artrosis precoz.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 175 y 177'
    },
    tests: [
      { name: 'Cribado intraarticular y Thomas positivos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión-RI, FADDIR y Thomas.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 162–163' },
      { name: 'Dolor en reposo y nocturno con síntomas mecánicos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en reposo y nocturno acompañado de síntomas mecánicos.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137' },
      { name: 'Rigidez', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rigidez de cadera.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 135' },
      { name: 'IMC >25', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Índice de masa corporal mayor de 25.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137' }
    ]
  },
  ca14: {
    id: 'ca14', region: 'cadera', num: '⑭',
    name: 'Neuropatías de Cadera e Ingle',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'EMG y conducción nerviosa: baja S y E en esta región. Alivio con bloqueo diagnóstico.',
      derivacion: 'Sospecha por patrón clínico, exploración neurológica y neurodinámicos. Considerar siempre atrapamientos lumbares.',
      fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172'
    },
    tests: [
      { name: 'Tinel del femorocutáneo (meralgia)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Meralgia (la más frecuente): Tinel 1 cm medial e inferior a la EIAS; parestesias anterolaterales del muslo.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172' },
      { name: 'Neurodinámico del femorocutáneo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce los síntomas anterolaterales del muslo.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172' },
      { name: 'Obturador: neurodinámico, sensibilidad del muslo medial y fuerza de aductores', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'A ser posible tras el deporte.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172' },
      { name: 'Arch and twist de pie', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ilioinguinal, iliohipogástrico y genitofemoral, cuyos neurodinámicos no están bien descritos. De pie, hiperextensión de tronco rotando hacia el lado contrario y hacia el del dolor. Positivo: reproduce el dolor al rotar al lado contrario y se alivia al rotar hacia el mismo lado.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172' },
      { name: 'Pudendo: dolor perineal al sentarse o en bici', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en el periné, sobre todo sentado o en bici (en mujeres, también en las relaciones sexuales), sin déficit sensitivo objetivo.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141' }
    ]
  },
  ca15: {
    id: 'ca15', region: 'cadera', num: '⑮',
    name: 'Sensibilización Central',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    tests: [
      { name: 'Dolor multifocal, referido y extenso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin criterios clínicos validados. Coexiste con la patología intraarticular y hace los síntomas vagos y cambiantes: NO excluye patología estructural.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 138' },
      { name: 'Dolor en las AVD', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en las actividades de la vida diaria.' },
      { name: 'Fatiga y mal sueño', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fatiga y mal sueño.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 138' },
      { name: 'Dificultades de memoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dificultades de memoria.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 138' },
      { name: 'Más comorbilidad; intolerancia al estrés, ansiedad o depresión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más comorbilidad; intolerancia al estrés, ansiedad o depresión.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 138' }
    ]
  },
  ca16: {
    id: 'ca16', region: 'cadera', num: '⑯',
    name: 'Dolor Inguinal Relacionado con el Aductor',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: 'Deportistas con dolor inguinal de larga evolución relacionado con el aductor. Entrenamiento activo 3 veces por semana (unos 90 min, en grupos de 2–4) durante 8–12 semanas, sin deporte mientras dure (bici si no duele; trote en llano pasadas las 6 primeras semanas si no provoca dolor); se termina cuando ni el tratamiento ni el trote duelen. Los días intermedios, el módulo I en casa. Módulo I (semanas 1–2): aducción isométrica en supino contra un balón entre los pies y entre las rodillas, 10 × 30 s cada una; abdominales rectos y oblicuos 5 × 10; abdominal con flexión de cadera y balón entre las rodillas («navaja») 5 × 10; plato de equilibrio 5 min; tabla de deslizamiento a una pierna, pies paralelos y a 90°, 5 × 1 min por pierna y posición. Módulo II (desde la 3.ª semana, dos vueltas por sesión): abducción y aducción en decúbito lateral 5 × 10; extensión lumbar en prono 5 × 10; abducción y aducción de pie a una pierna con peso o polea 5 × 10; abdominales 5 × 10; «esquí de fondo» a una pierna 5 × 10; desplazamiento lateral en tabla basculante 5 min; plato de equilibrio 5 min; patinaje en tabla de deslizamiento 5 × 1 min. Sin estirar los aductores. Resultado: 23 de 34 volvieron al deporte sin dolor frente a 4 con tratamiento pasivo (OR 12,7; IC 95 % 3,4–47,2).',
    dosisFuente: 'Hölmich 1999, Lancet 353:439–443 (ensayo aleatorizado, n = 68 varones de 18 a 50 años, frente a fisioterapia pasiva)',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177'
    },
    tests: [
      { name: 'Palpación dolorosa de aductores + squeeze doloroso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico (ambos).', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 139–140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' },
      { name: 'Estiramiento pasivo de aductores', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' }
    ]
  },
  ca17: {
    id: 'ca17', region: 'cadera', num: '⑰',
    name: 'Dolor Inguinal Relacionado con el Psoas Ilíaco',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: 'Sin cirugía previa (deportistas y casos idiopáticos): fisioterapia con estiramiento del psoas ilíaco, fortalecimiento de rotadores de cadera y musculatura pélvica, control motor y modificación de la actividad, con éxito del 77–100 % en series pequeñas. Tras una prótesis de cadera funciona bastante menos (16–50 %) y el resultado depende sobre todo de la posición del implante. Sin ensayos aleatorizados ni volumen definido: queda a criterio del clínico.',
    dosisFuente: 'Vandeputte 2026, J Clin Med 15(15):5912 (revisión sistemática; tratamiento conservador solo en series de casos y cohortes, calidad baja a moderada)',
    pronostico: {
      horizonte: 'Ecografía. La vaina sinovial del tendón del psoas comunica con la articulación en el 5 % de la población y puede inflamarse: líquido alrededor del tendón en ecografía o RM.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 145; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177'
    },
    tests: [
      { name: 'Palpación dolorosa supra o infrainguinal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 139–140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' },
      { name: 'Flexión resistida con cadera y rodilla a 90°', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 168' },
      { name: 'Flexión resistida o extensión pasiva en Thomas modificado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor. La extensión pasiva en Thomas modificado es a la vez el test de Thomas para patología intraarticular: interpretarlo junto con la palpación del psoas y la historia.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 168' }
    ]
  },
  ca18: {
    id: 'ca18', region: 'cadera', num: '⑱',
    name: 'Dolor Inguinal Relacionado con el Canal Inguinal',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía. Explorar de pie y con tos: una hernia palpable excluye este diagnóstico.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 145; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 173'
    },
    tests: [
      { name: 'Dolor en la región del canal + palpación dolorosa del canal, sin hernia palpable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico. Explorar de pie y con tos: una hernia palpable excluye este diagnóstico.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 139–140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' },
      { name: 'Sit-up recto u oblicuo resistido', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 168' },
      { name: 'Valsalva, tos o estornudo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 139; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' },
      { name: 'Flexión resistida en Thomas modificado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor.', fuente: 'Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 168' }
    ]
  },
  ca19: {
    id: 'ca19', region: 'cadera', num: '⑲',
    name: 'Dolor Inguinal Relacionado con el Pubis',
    prom: 'HAGOS (o HOS, iHOT)',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía o RM (planos axiales oblicuos para la inserción): edema óseo en la sínfisis, signo de la hendidura secundaria.',
      derivacion: 'AINE y reposo reducen el dolor, pero suele volver al retomar el deporte. La debilidad de cadera aumenta el riesgo: vuelta al deporte con déficit de fuerza <10–20 %.',
      fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177'
    },
    tests: [
      { name: 'Palpación dolorosa de la sínfisis y el hueso adyacente', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Necesario para el diagnóstico.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 139–140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' },
      { name: 'Resistencia abdominal y squeeze', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Más probable si reproduce el dolor. No hay test de resistencia específico.', fuente: 'Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164' }
    ]
  },
};
