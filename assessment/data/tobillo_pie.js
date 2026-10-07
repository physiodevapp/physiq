// ============================================================
// PhysiQ-Assessment · data/tobillo_pie.js
// Contenido clínico de la región TOBILLO Y PIE: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
//
// Región nueva (no existía en PhysiQ): todo sale de la tarjeta de consulta
// tobillo y pie (guía de consulta, data/tarjeta_tobillo_pie.js), con el texto
// clínico literal. Solo puntúan los tests con fuente verificada en el
// artículo original: Thompson y hueco palpable (tp3, Maffulli 1998 / Reiman
// 2014), Ottawa (tp5, Bachmann 2003, solo LR−) y el signo de Molloy (tp20,
// test añadido). El resto son hallazgos, con la cifra verificada y el motivo
// en su criterio. La tarjeta no da dosis («Dosis y progresión no están en la
// guía»): dosis '' en todas.
// ============================================================
import { SIS_POSQUIRURGICO, SIS_ENDOCRINO, SIS_HEMATOLOGICO, DOSIS_DERIVAR } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.tobillo_pie
// Árbol, nodo 1 (cinco P, monoartritis con fiebre, debilidad simétrica con
// arreflexia) → preguntas con `urgencia` (tp_t1, tp_i1, tp_n1).
export const screening = {
  label: 'Cuadrante Inferior — Tobillo y Pie',
  // Recuadro de urgencia: literal de la tarjeta de consulta tobillo y pie (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS · COMPARTIMENTAL Y NEUROVASCULAR · ARTRITIS INFECCIOSA · ROTURA DEL AQUILES · OTTAWA',
    lineas: [
      'SÍNDROME COMPARTIMENTAL Y COMPROMISO NEUROVASCULAR tras lesión grave del mediopié (Lisfranc): el flujo puede caer tras luxarse el 2.º MT → cirugía urgente. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.',
      'ARTRITIS INFECCIOSA: monoartritis aguda con MALESTAR SISTÉMICO Y FIEBRE ALTA → URGENCIA HOY. En la gota suele estar sistémicamente bien, aunque un brote agudo puede dar fiebre y leucocitosis: solo el análisis del líquido articular las separa.',
      'ROTURA AGUDA DEL AQUILES: golpe o patada detrás de la pierna en un gesto explosivo, a veces chasquido; camina sorprendentemente bien, con cojera. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente.',
      'REGLAS DE OTTAWA, antes de explorar cualquier traumatismo agudo. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Muy sensible, moderadamente específica: S 98,5 % en niños de más de 6 años (Lluch, p. 257); en adultos, una regla negativa descarta fractura (LR− 0,08, Bachmann 2003). Excluidas embarazadas y personas que no pueden seguir la prueba (p. ej., traumatismo craneal). ≈10 % de las inversiones acaban en fractura.'
    ]
  },
  sistemas: [
    SIS_POSQUIRURGICO,   // solo con mecanismo Post-quirúrgico (docs/posquirurgico.md)
    {
      // Tarjeta tobillo y pie (guía de consulta): URGENCIA (compartimental y neurovascular,
      // rotura del Aquiles, Ottawa) y BANDERAS «Lisfranc», «Fractura de calcáneo»,
      // «Fracturas del 5.º MT» y «Rotura del tibial posterior o del FHL».
      id: 'tp_trauma', icon: '🦴', nombre: 'Traumático / Mecánico',
      banderasRojas: [
        'SÍNDROME COMPARTIMENTAL Y COMPROMISO NEUROVASCULAR tras lesión grave del mediopié (Lisfranc): el flujo puede caer tras luxarse el 2.º MT → cirugía urgente. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.',
        'ROTURA AGUDA DEL AQUILES: golpe o patada detrás de la pierna en un gesto explosivo, a veces chasquido; camina sorprendentemente bien, con cojera. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente.',
        'Lisfranc: Caída hacia delante sobre el pie en punta (fallar un escalón), pie fijo con sacudida, aplastamiento. Dolor inmediato, no carga. Casi el 20 % pasa desapercibido. En consulta: Equimosis plantar: patognomónica (tarda 24–48 h). 1.º y 2.º MT en direcciones opuestas → dolor. Cinco P.',
        'Fractura de calcáneo: Caída desde altura sobre el talón; a menudo con alcohol, no recuerda el mecanismo. No quiere apoyar. En consulta: Talón doloroso, hinchado, con equimosis. La radiografía es poco sensible: TC.',
        'Fracturas del 5.º MT: Inversión con flexión plantar. Jones: dolor lateral previo de bajo grado. En consulta: Dolor en la base del 5.º MT. Jones: riesgo de pseudoartrosis sin fijación.',
        'Rotura del tibial posterior o del FHL: Tendinopatía que progresa o eversión forzada (TP). Impulso o aterrizaje forzado; artritis reumatoide (FHL). En consulta: TP: arco aplanado, «demasiados dedos», no inicia la ETM. FHL: no flexiona la interfalángica del primer dedo.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_t1', notaPosquirurgica: true, urgencia: 'Sospecha de síndrome compartimental o compromiso neurovascular tras lesión del mediopié: cirugía urgente, derivación hoy.', text: '¿Tras una lesión grave del mediopié, tiene el pie pálido o frío, dormido u hormigueante, sin pulso, o un dolor desproporcionado (cinco P)?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Los músculos del pie y de la pierna están encerrados en compartimentos de fascia que casi no se estiran. Tras una lesión grave (una fractura-luxación de Lisfranc, un aplastamiento), la hinchazón o el sangrado suben la presión dentro del compartimento: primero se frena la salida de la sangre venosa y, si la presión supera a la arterial, también la entrada, y nervios y músculos se quedan sin oxígeno. Además, al luxarse el 2.º metatarsiano puede caer el flujo arterial del pie. De ahí el dolor desproporcionado, el hormigueo, la palidez y la frialdad.',
            peso: 'Es una urgencia quirúrgica: con la fasciotomía en las primeras 6 horas la función se recupera casi por completo; a las 12 horas, solo dos tercios quedan con función normal, y en los casos muy tardíos puede acabar en amputación (Torlincasi). No hay que esperar a ver las cinco P: salvo el hormigueo, que puede ser precoz, son signos tardíos, y el pulso puede seguir palpándose con la extremidad muy comprometida. Los primeros datos son un compartimento tenso, «como de madera», y un dolor desproporcionado que al principio aparece sobre todo al estirar los músculos de forma pasiva (Torlincasi; en el pie, al mover pasivamente los dedos, Stern). Con este cuadro tras una lesión del mediopié, derivación urgente hoy (Lluch).',
            detalle: 'Cuándo pensarlo (Lluch, Stern): lesiones graves del mediopié por alta energía (tráfico, aplastamiento, caídas desde altura) o una caída hacia delante sobre el pie en punta con fractura-luxación tarsometatarsiana. Lluch pide valorar el compromiso neurovascular en la lesión grave de Lisfranc, porque el flujo puede reducirse tras la luxación del 2.º metatarsiano, y el síndrome compartimental, que requiere cirugía urgente. Stern pide documentar los pulsos pedio y tibial posterior y la sensibilidad de los nervios del pie y, en las lesiones de alta energía, buscar dolor creciente, tumefacción tensa, dolor al mover pasivamente los dedos y compromiso neurovascular.\n\nCuándo aparece (Torlincasi): a las pocas horas del traumatismo, pero puede hacerlo hasta 48 horas después; el 75 % se asocia a fracturas, sobre todo de tibia, y también a aplastamientos, lesiones vasculares, vendajes o yesos apretados y trastornos de la coagulación. Es más frecuente en varones jóvenes. Como progresa rápido, la exploración debe repetirse.\n\nLas cinco P: Lluch, para el síndrome compartimental, enumera palidez, dolor desproporcionado, parestesias, ausencia de pulso y frialdad; Torlincasi, dolor, ausencia de pulso, parestesias, parálisis y palidez, y advierte que, salvo las parestesias, son tardías. Goodman describe las mismas P (con frialdad y parálisis) en la oclusión arterial aguda, que también aparece de golpe en una sola extremidad y se comunica al médico de inmediato.\n\nCon qué se confunde (Torlincasi): TVP, celulitis, gangrena gaseosa, rabdomiólisis y lesiones vasculares periféricas. El diagnóstico es clínico; la presión intracompartimental (más de 30 mmHg) ayuda si hay dudas, pero una lectura normal no lo descarta.',
            fisiologia: {
              pasos: [
                'La fascia que envuelve cada compartimento muscular es una lámina fina e inelástica que no puede expandirse rápido.',
                'Tras la lesión, la hinchazón o el sangrado aumentan el volumen dentro del compartimento, y la presión sube (lo normal es menos de 10 mmHg).',
                'Al subir la presión se frena primero la salida venosa: aumentan la presión de las venas y de los capilares y la sangre se estanca.',
                'Si la presión del compartimento supera a la arterial, también cae la entrada de sangre: músculos y nervios se quedan sin oxígeno (isquemia).',
                'Los nervios isquémicos dan hormigueo y pérdida de sensibilidad, y el músculo isquémico, un dolor intenso que aumenta al estirarlo.',
                'Si la isquemia se mantiene, la necrosis se vuelve irreversible: por eso el tiempo hasta la fasciotomía decide el pronóstico.'
              ],
              nota: 'Pasos de Torlincasi; la caída del flujo tras la luxación del 2.º metatarsiano la señala Lluch, sin detallar el mecanismo.',
              metafora: 'Como una bolsa cerrada que se va llenando: cuando la presión dentro supera a la de la sangre que entra, los tejidos se quedan sin riego.'
            },
            fuentes: ['Lluch 2020', 'Torlincasi 2023', 'Stern 2026', 'Goodman 2018'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272.',
              { texto: 'Torlincasi 2023 — Torlincasi, Lopez y Waseem, «Acute Compartment Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448124/' },
              { texto: 'Stern 2026 — Stern, Bergman y Singh, «Lisfranc Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448147/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 6, p. 254.'
            ]
          } },
        { id: 'tp_t2', text: '¿Tras el traumatismo no pudo dar cuatro pasos apoyando el pie, ni justo tras la lesión ni ahora en consulta? (Aplicar las reglas de Ottawa en el árbol: radiografía si hay algún criterio.)', alerta: true,
          razonamiento: {
            porque: 'No poder dar cuatro pasos apoyando, justo tras la lesión y otra vez en la consulta, es uno de los criterios de las reglas de Ottawa porque señala una lesión más grave que un esguince simple: una fractura del tobillo o del mediopié (maléolos, base del 5.º metatarsiano, navicular). Los demás criterios son el dolor óseo en el borde posterior o la punta de los maléolos, en la base del 5.º metatarsiano o en el navicular.',
            peso: 'Las reglas de Ottawa se aplican antes de explorar cualquier traumatismo agudo: con dolor en la zona maleolar o en el mediopié y algún criterio, se pide radiografía (Lluch); NICE recomienda usarlas a partir de los 5 años. Son muy sensibles y poco específicas: un resultado negativo descarta la fractura con mucha seguridad (LR− 0,08 para el tobillo y para el mediopié, y 0,07 en niños; Bachmann 2003) y ahorra entre un 30 y un 40 % de radiografías, pero uno positivo no la confirma: menos del 15 % de los esguinces que se radiografían tienen fractura. Alrededor del 10 % de las lesiones por inversión acaban en fractura (Lluch). Un SÍ no es urgencia: deriva para radiografía antes de seguir explorando. En la fase 4b, la regla de Ottawa (tp37 para el tobillo, tp5 para el pie) solo puntúa cuando es negativa, como en rodilla.',
            detalle: 'Las reglas (Lluch; Bergman; Hermena y Slane): radiografía de tobillo si hay dolor en la zona maleolar y además dolor óseo en los 6 cm distales del borde posterior de la tibia o en la punta del maléolo medial, o lo mismo en el peroné o el maléolo lateral, o incapacidad para cargar cuatro pasos tanto justo después de la lesión como en la consulta. Radiografía de pie si hay dolor en el mediopié y además dolor óseo en la base del 5.º metatarsiano o en el navicular, o la misma incapacidad para cargar. Quedan fuera las embarazadas y quien no puede seguir la prueba (traumatismo craneal, intoxicación). En niños de más de 6 años, Lluch cita una sensibilidad del 98,5 % (refs. 21 y 22 del capítulo).\n\nQué buscar además (Bergman; Hermena y Slane): palpar el peroné hasta la rodilla (la fractura de Maisonneuve, en el peroné proximal, acompaña a una rotura de la sindesmosis) y el mediopié (Lisfranc). Una gran inestabilidad, deformidad o compromiso neurovascular hace pensar en una fractura-luxación más que en un esguince; un pie pálido y frío es un compromiso vascular crítico. Tras una lesión de alta energía, pensar en un síndrome compartimental de la pierna.\n\nBase del 5.º metatarsiano (Smidt y Massey; Lluch): la avulsión de la tuberosidad, por inversión con el pie en flexión plantar, es la más frecuente y suele consolidar en 6–8 semanas; la de Jones, en la unión entre metáfisis y diáfisis, cae en una zona de riego precario y no consolida en el 15–30 %. Duele al palpar la base y a la eversión contra resistencia.\n\nNICE (NG38, recomendación 1.2.2): usar las reglas de Ottawa de tobillo y pie para decidir la radiografía a partir de los 5 años. Las LR son del resumen de la revisión sistemática de Bachmann 2003 (27 estudios, 15 581 pacientes).',
            fisiologia: {
              pasos: [
                'La inversión forzada carga el complejo ligamentoso lateral: el ligamento peroneoastragalino anterior, el más débil, es el primero en romperse, y en las lesiones más graves le siguen el peroneocalcáneo y, rara vez, el posterior (Bergman).',
                'Tibia, peroné, astrágalo y sus ligamentos forman un anillo; si la fuerza lo rompe, lo hace por dos sitios, de hueso o de ligamento (Hermena y Slane).',
                'Una fractura o una rotura ligamentosa completa dejan la articulación inestable; en el esguince de grado III, el paciente no suele poder cargar al principio (Bergman).',
                'Por eso no poder apoyar ni justo tras la lesión ni en la consulta indica una lesión más grave que un esguince leve, que suele permitir cargar con poco dolor (Bergman), y es criterio de Ottawa.'
              ],
              nota: 'Las fuentes leídas asocian la incapacidad para cargar a una lesión más grave, pero no explican qué parte del dolor al apoyar viene del hueso y cuál de la inestabilidad.',
              metafora: 'Como un aro: si se rompe por un lado, cede también por otro y deja de soportar el peso.'
            },
            fuentes: ['Lluch 2020', 'Bachmann 2003', 'NICE NG38', 'Bergman 2025', 'Hermena y Slane 2025', 'Smidt y Massey 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 254–257.',
              { texto: 'Bachmann 2003 — Bachmann, Kolb, Koller, Steurer y ter Riet, «Accuracy of Ottawa ankle rules to exclude fractures of the ankle and mid-foot: systematic review», BMJ 326(7386):417 (2003); resumen leído en PubMed.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC149439/' },
              { texto: 'NICE NG38 — NICE, «Fractures (non-complex): assessment and management» (2016), recomendación 1.2.2.', url: 'https://www.nice.org.uk/guidance/ng38' },
              { texto: 'Bergman 2025 — Bergman, Li y Shuman, «Acute Ankle Sprain», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459212/' },
              { texto: 'Hermena y Slane 2025 — Hermena y Slane, «Ankle Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK542324/' },
              { texto: 'Smidt y Massey 2023 — Smidt y Massey, «5th Metatarsal Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 29 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK544369/' }
            ]
          } },
        { id: 'tp_t3', text: '¿Notó un golpe o una patada detrás de la pierna en un gesto explosivo, a veces con chasquido, y desde entonces cojea? (Thompson en el árbol: derivación preferente.)', alerta: true,
          razonamiento: {
            porque: 'La rotura aguda del tendón de Aquiles suele ocurrir en un gesto explosivo, como un cambio brusco de dirección, en el que el tobillo se fuerza hacia la flexión dorsal mientras la pantorrilla se contrae: la carga de tracción supera la resistencia del tendón. El paciente siente un golpe o una patada detrás de la pierna, a veces con un chasquido audible, y el dolor puede no ser lo principal. Camina sorprendentemente bien, cojeando, porque los flexores largos de los dedos y el plantar delgado compensan.',
            peso: 'Con este relato, la prueba de Thompson (comprimir la pantorrilla con el paciente en prono y el pie fuera de la camilla) es la prueba clínica más precisa: si el tobillo no se mueve, S 96 % y E 93 % (Lluch, ref. 11 del capítulo); normalmente no hace falta imagen para el diagnóstico. Importa no confundirla con un esguince: entre el 20 y el 25 % se diagnostican al principio como esguince de tobillo (Shamrock). Con un Thompson positivo, derivación preferente.',
            detalle: 'Quién (Lluch, Shamrock): clásicamente el varón de mediana edad que hace deporte de forma esporádica («guerrero de fin de semana»: fútbol, raqueta, baloncesto), entre la tercera y la quinta década. Factores de riesgo (Shamrock): tendinopatía previa del Aquiles, fluoroquinolonas, corticoides (infiltraciones o tratamientos largos), artritis inflamatorias, diabetes, hiperparatiroidismo, insuficiencia renal crónica y gota. Alrededor del 10 % notó molestias en los días previos.\n\nExploración (Lluch, Shamrock): no puede ponerse de puntillas sobre esa pierna o la flexión plantar es muy débil; puede palparse el hueco, que se pierde con el tiempo, y verse un hematoma; Thompson comparado con el otro lado. La ecografía o la RM se reservan para los casos dudosos o para decidir entre cirugía y tratamiento conservador.\n\nCon qué se confunde (Lluch): las tendinopatías del Aquiles, mucho más frecuentes, duelen de forma localizada y ligada a la carga, empeoran el día siguiente al esfuerzo y no empiezan con un golpe súbito; el dolor nocturno es raro en ellas y sugiere otro diagnóstico.',
            fisiologia: {
              pasos: [
                'El Aquiles es el tendón más fuerte del cuerpo: fibras densas y paralelas de colágeno tipo I que giran unos 90° en su descenso (Shamrock).',
                'Con la edad, la tendinopatía o enfermedades como la diabetes y la insuficiencia renal, esas fibras se desorganizan y el tendón resiste peor (Shamrock).',
                'Se rompe cuando recibe de golpe una carga de tracción excesiva, como al forzar el tobillo hacia arriba mientras la pantorrilla se contrae (Shamrock, Lluch).',
                'Suele romperse entre 2 y 6 cm por encima del calcáneo, donde las fibras giran y el riego es menor (Shamrock).',
                'Roto el tendón, el tríceps sural ya no tira del calcáneo: al comprimir la pantorrilla el pie no se mueve, que es lo que detecta la prueba de Thompson (Lluch).'
              ],
              metafora: 'Como una cuerda que se rompe por su parte más gastada: al tirar de un extremo, ya no mueve lo que hay al otro lado.'
            },
            fuentes: ['Lluch 2020', 'Shamrock 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 241–245.',
              { texto: 'Shamrock 2023 — Shamrock, Dreyer y Varacallo, «Achilles Tendon Rupture», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430844/' }
            ]
          } },
        { id: 'tp_t4', text: '¿Se cayó hacia delante sobre el pie en punta (fallar un escalón) o desde altura sobre el talón, y no puede apoyar? (Lisfranc o calcáneo: derivación preferente.)', alerta: true,
          razonamiento: {
            porque: 'Los dos mecanismos cargan el pie de golpe a lo largo de su eje. En la lesión de Lisfranc, el pie en flexión plantar recibe una carga axial con torsión (al fallar un escalón y caer hacia delante, o con el pie sujeto y una sacudida) y se rompen los ligamentos que unen la base del 2.º metatarsiano a las cuñas; como entre el 1.º y el 2.º metatarsiano no hay ligamento transverso, los radios se separan. En la caída desde altura sobre el talón, el astrágalo se clava como una cuña en el calcáneo y lo fractura. En los dos casos el dolor es inmediato y cuesta o es imposible apoyar.',
            peso: 'Son lesiones poco frecuentes pero con muchas secuelas si se pasan por alto. Casi el 20 % de las de Lisfranc no se diagnostica en la primera valoración (Lluch; Stern), y la radiografía tiene una sensibilidad de alrededor del 84 % (Stern); mal tratadas dejan inestabilidad, deformidad y artrosis del mediopié. La equimosis plantar es patognomónica de una lesión de Lisfranc importante, aunque puede tardar 24–48 horas en aparecer (Lluch). En la fractura de calcáneo la radiografía es poco sensible y la prueba de elección es la TC (Lluch). Derivación preferente; si además hay dolor desproporcionado, palidez, frialdad u hormigueo, manda la pregunta del síndrome compartimental.',
            detalle: 'Lisfranc (Lluch, Stern): la articulación tarsometatarsiana une las bases de los cinco metatarsianos con las tres cuñas y el cuboides; la base del 2.º metatarsiano, encajada entre las cuñas, es la piedra angular. Mecanismo indirecto (el más frecuente: caer hacia delante sobre un pie en flexión plantar al fallar un escalón; también hípica o windsurf, con el pie sujeto) o directo (aplastamiento, tráfico). Las de alta energía, alrededor del 20 %, dan fracturas-luxaciones y compromiso neurovascular; las de baja energía, en el deporte, suelen ser ligamentosas y con radiografía inicial normal; hay que sospecharla si el dolor del mediopié dura más de 5 días con hinchazón (Stern). Exploración: dolor a la palpación a lo ancho del mediopié, sobre todo entre la cuña medial y la base del 2.º; dolor al mover el 1.º y el 2.º metatarsiano en direcciones opuestas, en la prueba de pronación-abducción y al comprimir las tarsometatarsianas; equimosis plantar. Radiografía en carga de los dos pies; si es normal y la sospecha sigue, TC o RM.\n\nCalcáneo (Lluch; Seaman y Bergman): lesión de alta energía por caída desde altura sobre el talón; a menudo con alcohol, y el paciente puede no recordar el mecanismo. Dolor intenso en el talón, peor al cargar, puede negarse a apoyar; talón doloroso, hinchado y con equimosis; una equimosis plantar que cruza la planta es muy sugestiva. Es la fractura más frecuente del tarso (alrededor del 60 %), sobre todo en varones de 30 a 50 años; por el mecanismo se asocia a fracturas por compresión lumbares, de pelvis, de la otra pierna y del otro calcáneo (bilateral en el 5–10 %), que hay que buscar. En la fractura «en lengüeta», el Aquiles tira hacia arriba del fragmento posterior y tensa la piel del talón: es una urgencia ortopédica por riesgo de necrosis cutánea.',
            fisiologia: {
              pasos: [
                'El pie en flexión plantar recibe una carga axial o una torsión que supera la resistencia de los ligamentos tarsometatarsianos (Stern).',
                'El ligamento de Lisfranc, de la cuña medial a la base del 2.º metatarsiano, es el principal estabilizador del mediopié; como no hay ligamento entre el 1.º y el 2.º metatarsiano, al romperse estos se separan (Stern, Lluch).',
                'El desplazamiento de la base del 2.º arrastra a los metatarsianos 3.º a 5.º y el arco se hunde; la inflamación de la lesión da dolor y edema (Lluch, Stern).',
                'En la caída sobre el talón, la fuerza pasa del astrágalo al calcáneo, que se rompe por compresión y a menudo afecta a la articulación subastragalina (Seaman y Bergman).',
                'En los dos casos el dolor es inmediato y apoyar duele mucho o no es posible (Lluch).'
              ],
              nota: 'Las fuentes leídas no explican por qué duele tanto al apoyar más allá de la propia lesión ósea y ligamentosa.',
              metafora: 'Como un arco de piedra al que se le cae la clave: el resto se separa y deja de aguantar el peso.'
            },
            fuentes: ['Lluch 2020', 'Stern 2026', 'Seaman y Bergman 2026'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 268 y 272–273.',
              { texto: 'Stern 2026 — Stern, Bergman y Singh, «Lisfranc Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448147/' },
              { texto: 'Seaman y Bergman 2026 — Seaman y Bergman, «Calcaneus Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de agosto de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430861/' }
            ]
          } },
        { id: 'tp_t5', text: '¿Se le ha aplanado el arco del pie, o no puede doblar la punta del dedo gordo, tras un impulso, un aterrizaje forzado o una tendinopatía que va a más (rotura del tibial posterior o del FHL)?', alerta: true,
          razonamiento: {
            porque: 'El tibial posterior sostiene el arco longitudinal interno del pie e invierte el retropié. Cuando una tendinopatía crónica lo va alargando, o una eversión forzada lo rompe de golpe, el arco se hunde, el talón se va hacia fuera y desde atrás se ven «demasiados dedos». El flexor largo del primer dedo (FHL) dobla la falange distal del dedo gordo; si se rompe, por un despegue forzado o un aterrizaje resistido, o en una artritis reumatoide con sinovitis, el paciente ya no puede doblar la punta de ese dedo.',
            peso: 'Las dos roturas son infrecuentes (Lluch), pero cambian el manejo. La del tibial posterior lleva a un pie plano adquirido con mucho dolor y pérdida de función, y la mayoría no puede hacer una elevación de talón a una pierna; la del FHL se reconoce porque falta la flexión activa de la interfalángica del dedo gordo, y se confirma con imagen (Lluch). El pie plano por sí solo no es una bandera: el 20–37 % de la población tiene algún grado y suele ser asintomático (Moore y Tafti); lo que importa es que sea nuevo o vaya a más, o que no pueda elevar el talón. Derivación para confirmarlo con imagen.',
            detalle: 'Tibial posterior (Lluch): la tendinopatía es propia de personas mayores, sedentarias y con trastornos metabólicos asociados a la obesidad; el tendón roza y se comprime contra el maléolo interno, y es una de las pocas tendinopatías que progresan, alargándose hasta romperse. Exploración: dolor por detrás y por debajo del maléolo interno, debilidad a la inversión contra resistencia, crepitación; en la elevación de talón a una pierna el calcáneo no se va a varo como debería y, en fases avanzadas, no puede iniciarla; arco aplanado y «demasiados dedos»; puede palparse la ausencia del tendón. La rotura aguda tras una eversión forzada puede estar demasiado hinchada para explorarla.\n\nPie plano adquirido (Moore y Tafti): la causa más frecuente es la disfunción del tibial posterior, antes descrita sobre todo en mujeres de más de 55 años con diabetes y obesidad. Otras: traumatismos del mediopié y del retropié (navicular, calcáneo, Lisfranc), lesiones del ligamento en hamaca o de la fascia plantar, artropatía de Charcot por neuropatía, artritis reumatoide o seronegativas mal controladas y laxitud ligamentosa. Explorar en carga y en descarga, mirar desde atrás, palpar el tibial posterior y pedir elevación de talón a una y a dos piernas e inversión contra resistencia.\n\nFlexor largo del primer dedo (Lluch): la rotura es relativamente rara, por traumatismo o por una enfermedad sistémica con sinovitis importante, como la artritis reumatoide; puede haber tendinopatía previa, y el paciente cuenta un despegue forzado o un aterrizaje resistido con dolor interno súbito; hematoma, hinchazón y dolor a lo largo del tendón. La tenosinovitis del FHL, más frecuente en bailarines, duele pero conserva la flexión.',
            fisiologia: {
              pasos: [
                'El arco longitudinal interno lo sostienen el ligamento en hamaca, el deltoideo, el tendón del tibial posterior, la aponeurosis plantar y los flexores del primer dedo (Moore y Tafti).',
                'El tendón del tibial posterior pasa por detrás del maléolo interno, donde sufre fricción y compresión además de las cargas de cada paso (Lluch).',
                'Esa carga mantenida produce una tendinopatía que lo va alargando poco a poco; también puede romperse de golpe con una eversión forzada (Lluch).',
                'Sin un tendón que lo sujete, el arco se hunde y el talón se va hacia fuera: desde atrás se ven «demasiados dedos» (Lluch, Moore y Tafti).',
                'Al subir el talón, el calcáneo ya no se va a varo como en un tobillo normal, y en fases avanzadas no puede iniciarse la elevación a una pierna (Lluch).'
              ],
              nota: 'En la rotura del FHL la cadena es más corta: el tendón se inserta en la base de la falange distal del dedo gordo y, roto, esa falange no se flexiona (Lluch).',
              metafora: 'Como un tirante que cede: el arco que sujetaba va bajando poco a poco.'
            },
            fuentes: ['Lluch 2020', 'Moore y Tafti 2026'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247–251.',
              { texto: 'Moore y Tafti 2026 — Moore y Tafti, «Pes Planus», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430802/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Fractura de estrés de alto riesgo o múltiple».
      id: 'tp_oseo', icon: '🦴', nombre: 'Fractura de Estrés',
      banderasRojas: [
        'Fractura de estrés de alto riesgo o múltiple: Insidiosa tras un cambio de carga, sin efecto de calentamiento, dolor nocturno. Más de dos en huesos distintos → densidad ósea, RED-S, endocrino, nutricional. En consulta: Punto N doloroso > lado sano: navicular hasta que se demuestre lo contrario. Calcáneo: compresión medial y lateral a la vez.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_o1', text: '¿El dolor apareció poco a poco tras un cambio de carga (más entrenamiento, otro calzado, otra superficie), no mejora al calentar y le molesta por la noche?', alerta: true,
          razonamiento: {
            porque: 'El hueso se renueva sin parar: los osteoclastos retiran el hueso viejo o dañado y los osteoblastos ponen hueso nuevo, adaptándolo a la carga. Si la carga sube de golpe (más entrenamiento, otro calzado, otra superficie), la resorción va más rápida que la formación y se acumulan microfracturas; si la actividad sigue, acaba en fractura. Por eso el dolor empieza poco a poco, unas semanas después del cambio, no mejora al calentar sino que empeora con la actividad, y puede doler de noche.',
            peso: 'Es la presentación típica de una fractura de estrés (May y Marappa-Ganeshan; Lluch). Que no caliente y que moleste de noche orienta a lesión ósea más que a sinovitis, que sí mejora al calentar y no da dolor nocturno (Lluch). Algunas son de alto riesgo, con más pseudoartrosis y más cirugía (May y Marappa-Ganeshan): en el pie, sobre todo el navicular, de riego precario (Gheewala), y la base del 5.º metatarsiano (fractura de Jones; Lluch). Un dolor en el «punto N» del navicular mayor que en el otro pie es una fractura de estrés hasta que se demuestre lo contrario (Lluch). La radiografía tarda 2–3 semanas en mostrarla y la RM es la prueba de elección (May y Marappa-Ganeshan). Derivar para confirmarla con imagen.',
            detalle: 'Factores (May y Marappa-Ganeshan): el más frecuente es un aumento brusco de la actividad; también mala forma física, sexo femenino, trastornos hormonales o menstruales, baja densidad ósea, poca masa muscular, superficies irregulares, calzado gastado, falta de vitamina D y calcio y tabaco. Corren más riesgo las mujeres deportistas y quien ya tuvo una. En corredores, las más frecuentes son tibia (23,6 %), navicular (17,6 %) y metatarsianos (16,2 %). Pasan unas 3 semanas entre el cambio y los síntomas: primero duele después de la actividad, cada vez durante más tiempo, y si sigue entrenando, al levantarse al día siguiente.\n\nDónde en el pie y el tobillo (Lluch): navicular (dolor mal localizado del mediopié que puede irradiar por el arco interno o el dorso; «punto N», la parte dorsal proximal del navicular); calcáneo (talalgia al cargar y al apoyar el talón; dolor al comprimir a la vez las caras interna y externa); maléolo interno (rara, en corredores, dolor anterointerno); astrágalo (atletas y gimnastas; hinchazón en el seno del tarso); cuello de los metatarsianos, sobre todo el 2.º (la «fractura de marcha» de corredores y militares; duele al cargar el metatarsiano a lo largo de su eje); base del 2.º en bailarinas; cuboides y cuñas, de diagnóstico notoriamente tardío. La radiografía estándar no suele mostrar la fractura de estrés aguda; puede repetirse a los 10–14 días (Agrawal y Tiwari).\n\nGoodman: la percusión vertical del talón con el paciente tumbado que reproduce el dolor hace sospechar una fractura o una reacción de estrés; en el deportista, la sentadilla completa y el salto a una pierna sirven de cribado. May y Marappa-Ganeshan advierten que el salto y la prueba del fulcro se usan mucho pero están poco estudiados.\n\nEspectro (Lluch): reacción de estrés (normalmente menos de 2 semanas de síntomas, visible en RM pero no en radiografía ni TC), fractura no complicada y fractura complicada (la que no se resuelve con reposo relativo y vuelta gradual); volver al deporte tras una no complicada lleva unos 3–4 meses.',
            fisiologia: {
              pasos: [
                'El hueso se remodela continuamente: los osteoclastos reabsorben el hueso viejo o dañado y los osteoblastos depositan hueso nuevo (Rowe).',
                'Los osteocitos, las células más abundantes del hueso, detectan la carga mecánica y coordinan a unos y otros; según la ley de Wolff, más carga hace el hueso más fuerte (Rowe).',
                'Si la carga repetida aumenta de golpe, estimula la resorción más deprisa de lo que los osteoblastos pueden formar hueso; un ciclo completo de remodelado tarda 3–4 meses (May y Marappa-Ganeshan).',
                'Mientras tanto el hueso es más débil y aparecen microfracturas; si la actividad continúa, la fractura se completa (May y Marappa-Ganeshan).',
                'Por eso el dolor aparece semanas después del cambio, empeora con la actividad en lugar de calentar y puede notarse de noche (May y Marappa-Ganeshan, Lluch).'
              ],
              metafora: 'Como una obra en la que se derriba más deprisa de lo que se construye: durante un tiempo la estructura queda más débil.'
            },
            fuentes: ['Lluch 2020', 'May y Marappa-Ganeshan 2023', 'Rowe 2023', 'Gheewala 2023', 'Agrawal y Tiwari 2023', 'Goodman 2018'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 235, 247, 252–253 y 278–280.',
              { texto: 'May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554538/' },
              { texto: 'Rowe 2023 — Rowe, Koller y Sharma, «Physiology, Bone Remodeling», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de marzo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499863/' },
              { texto: 'Gheewala 2023 — Gheewala, Arain y Rosenbaum, «Tarsal Navicular Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK542221/' },
              { texto: 'Agrawal y Tiwari 2023 — Agrawal y Tiwari, «Metatarsal Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK574512/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 119–120; cap. 13, pp. 487–488.'
            ]
          } },
        { id: 'tp_o2', text: '¿Ha tenido más de dos fracturas de estrés en huesos distintos? (Derivar: densidad ósea, RED-S, endocrino, nutricional.)', alerta: true,
          razonamiento: {
            porque: 'Una fractura de estrés suele explicarse por la carga; varias en huesos distintos sugieren que el problema está en el hueso. Con poca energía disponible (comer menos de lo que se gasta, a propósito o no), el hipotálamo frena el eje hormonal: en las mujeres bajan los estrógenos y se altera la menstruación, y en los varones baja la testosterona. Sin esas hormonas, la resorción del hueso supera a la formación, baja la densidad ósea y el hueso se rompe con cargas que antes toleraba.',
            peso: 'Lluch lo incluye en sus banderas rojas: más de dos fracturas de estrés en huesos distintos obligan a investigar la densidad mineral ósea y el déficit energético relativo, y también causas endocrinas y nutricionales, sin olvidar la carga de entrenamiento y la biomecánica. Raj aconseja una densitometría en deportistas con fracturas de estrés múltiples. No es una urgencia, pero sí una derivación para estudio: el problema de fondo no se resuelve tratando cada fractura por separado.',
            detalle: 'Tríada de la mujer deportista (Raj): baja disponibilidad energética (con o sin trastorno de la conducta alimentaria), trastorno menstrual y densidad ósea baja. Más riesgo en los deportes de resistencia (atletismo, natación, remo) y en los de juicio estético (gimnasia, patinaje); los trastornos alimentarios clínicos afectan al 16–47 % de las deportistas de élite. Las fracturas de estrés son más frecuentes en las deportistas con amenorrea, y la densidad ósea es menor cuantos más ciclos se han perdido desde la primera regla. Preguntar por la alimentación, la menstruación, la tiroides, la diabetes, los fármacos (anticonceptivos, laxantes) y el estado de ánimo.\n\nDéficit energético relativo (May y Marappa-Ganeshan): el nombre actual del sobreentrenamiento con restricción calórica; también ocurre en varones de deportes de resistencia, con testosterona baja. Otro factor es la falta de vitamina D: en reclutas militares, quienes se fracturaban tenían menos vitamina D, y suplementarla pudo prevenir parte de las fracturas.\n\nFracturas por insuficiencia (Agrawal y Tiwari): en un hueso debilitado (osteoporosis, posmenopausia), una carga normal basta para romperlo; entre los factores de las fracturas de estrés de los metatarsianos están la anorexia nerviosa, la amenorrea y el déficit prolongado de estrógenos.',
            fisiologia: {
              pasos: [
                'La energía disponible es la que entra con la comida menos la que gasta el ejercicio; si es baja durante mucho tiempo, el organismo ahorra (Raj).',
                'El hipotálamo reduce las señales a los ovarios: bajan los estrógenos y la menstruación se vuelve irregular o desaparece (Raj); en los varones baja la testosterona (May y Marappa-Ganeshan).',
                'Los estrógenos actúan sobre los osteoblastos y frenan a los osteoclastos; sin ellos, la resorción supera a la formación y se pierde masa ósea (Raj, Rowe).',
                'Con menos densidad, el hueso es más frágil y repara peor el microdaño de cada entrenamiento (Raj, Rowe).',
                'Por eso aparecen varias fracturas de estrés, en huesos distintos, con cargas que antes se toleraban (Lluch).'
              ],
              metafora: 'Como una casa que se repara con un presupuesto cada vez más corto: las grietas aparecen en varias paredes a la vez.'
            },
            fuentes: ['Lluch 2020', 'Raj 2023', 'May y Marappa-Ganeshan 2023', 'Rowe 2023', 'Agrawal y Tiwari 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 235, 252 y 287.',
              { texto: 'Raj 2023 — Raj, Creech y Rogol, «Female Athlete Triad», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430787/' },
              { texto: 'May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554538/' },
              { texto: 'Rowe 2023 — Rowe, Koller y Sharma, «Physiology, Bone Remodeling», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de marzo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499863/' },
              { texto: 'Agrawal y Tiwari 2023 — Agrawal y Tiwari, «Metatarsal Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK574512/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta): URGENCIA (artritis infecciosa) y
      // BANDERAS «Artritis inflamatoria».
      id: 'tp_infecciosa', icon: '🦠', nombre: 'Infecciosa / Inflamatoria',
      banderasRojas: [
        'ARTRITIS INFECCIOSA: monoartritis aguda con MALESTAR SISTÉMICO Y FIEBRE ALTA → URGENCIA HOY. En la gota suele estar sistémicamente bien, aunque un brote agudo puede dar fiebre y leucocitosis: solo el análisis del líquido articular las separa.',
        'Artritis inflamatoria: Rigidez matutina de más de 60 min que mejora con la actividad (reumatoide, espondiloartropatía, psoriásica, reactiva). En consulta: Tumefacción caliente, a menudo simétrica; dactilitis y uñas en la psoriásica.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_i1', urgencia: 'Sospecha de artritis infecciosa: urgencia hoy.', text: '¿Tiene una articulación del tobillo o del pie hinchada y muy dolorosa, con fiebre alta y malestar general?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Las bacterias llegan a la articulación por la sangre (lo más frecuente), por una punción, infiltración o cirugía, por una herida o desde una infección vecina. La sinovial se inflama, y las citocinas y proteasas de esa inflamación destruyen el cartílago en poco tiempo, incluso después de eliminar el germen. De ahí la articulación hinchada, caliente y muy dolorosa, con fiebre y malestar, y la urgencia: cuanto antes se trate, más articulación se salva.',
            peso: 'Es una urgencia ortopédica: aun con antibióticos, la mortalidad hospitalaria es del 7–15 % y un tercio queda con secuelas (Momodu y Savaliya); Goodman pide derivación médica inmediata porque la destrucción articular puede ser rápida. El tobillo es de las articulaciones más afectadas, tras rodilla, cadera y hombro. La fiebre solo aparece en el 40–60 % y suele ser baja en mayores e inmunodeprimidos, así que su ausencia no la descarta. Lluch la distingue de la gota porque quien tiene gota está sistémicamente bien, pero la gota aguda también puede dar fiebre y leucocitos altos (Menon y Rednam): solo el análisis del líquido articular las separa. Con este cuadro, urgencia hoy.',
            detalle: 'Quién (Momodu y Savaliya; Goodman): más de 80 años, diabetes, artritis reumatoide o daño articular previo (gota, artrosis, fractura), cirugía articular reciente, prótesis, infiltración previa, infecciones de la piel y úlceras, inmunodepresión, drogas por vía parenteral y, en jóvenes sexualmente activos, gonococo (la causa más frecuente de monoartritis aguda no traumática a esa edad). Una herida punzante se asocia a Pseudomonas.\n\nCómo se presenta: monoartritis aguda con dolor, hinchazón y rechazo a moverla o a cargar; fiebre, escalofríos y malestar (Momodu y Savaliya; Goodman). Goodman: puede haber tenosinovitis de las vainas extensoras del tobillo y lesiones cutáneas del gonococo, a veces sobre el propio tobillo; un tono azulado oscuro o un eritema franco con dolor exquisito son signo de articulación séptica.\n\nCon qué se confunde (Momodu y Savaliya; Lluch): gota y seudogota, artrosis, lesión intraarticular, artritis reactiva y otras artritis inflamatorias. Lluch: en la artritis infecciosa, monoartritis aguda con mal estado general y fiebre alta, y líquido articular con leucocitosis intensa de predominio polimorfonuclear; en la gota, inicio agudo en una persona sistémicamente bien. Menon y Rednam: la gota aguda puede acompañarse de fiebre y leucocitosis, lo que la hace difícil de distinguir de la artritis séptica; la prueba de referencia son los cristales de urato en el líquido sinovial.\n\nDiagnóstico (médico): artrocentesis; más de 50.000 leucocitos con un 90 % de neutrófilos sugiere origen bacteriano; la VSG y la PCR apoyan sin confirmar (Momodu y Savaliya).',
            fisiologia: {
              pasos: [
                'Las bacterias llegan a la articulación por la sangre desde otra infección, por inoculación directa (cirugía, infiltración, herida punzante) o desde un hueso o una piel infectados (Momodu y Savaliya, Goodman).',
                'La sinovial está muy vascularizada y no tiene membrana basal que haga de barrera, así que las bacterias la colonizan con facilidad; las adhesinas del estafilococo las fijan a las proteínas de la articulación (Momodu y Savaliya).',
                'La sinovial responde con una inflamación intensa, con citocinas como el TNF y la IL-1: hinchazón, calor, rojez y dolor con cualquier movimiento (Goodman).',
                'Las citocinas, las proteasas y las toxinas bacterianas destruyen el cartílago, y el daño sigue aunque se elimine el germen (Goodman, Momodu y Savaliya).',
                'Sin tratamiento, la infección puede pasar al hueso (osteomielitis) o dejar dolor crónico (Momodu y Savaliya).'
              ],
              metafora: 'Como un fuego en una habitación cerrada: lo que importa es apagarlo pronto para salvar lo que hay dentro.'
            },
            fuentes: ['Goodman 2018', 'Momodu y Savaliya 2023', 'Lluch 2020', 'Menon y Rednam 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 12, pp. 449 y 455.',
              { texto: 'Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538176/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 280–282.',
              { texto: 'Menon y Rednam 2026 — Menon, Rednam, Gujarathi y Maher, «Gout», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de abril de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK546606/' }
            ]
          } },
        { id: 'tp_i2', text: '¿Tiene rigidez por la mañana de más de 60 minutos que mejora al moverse, o hinchazón caliente en varias articulaciones, algún dedo hinchado entero o cambios en las uñas?', alerta: true,
          razonamiento: {
            porque: 'En las artritis inflamatorias el problema no es mecánico sino inmunitario. En la reumatoide, la sinovial se llena de células inflamatorias y erosiona hueso y cartílago; en la psoriásica y en la reactiva, la inflamación se centra en las entesis, donde tendones y ligamentos se insertan en el hueso. Tras la inactividad (el sueño, estar mucho sentado) las articulaciones inflamadas amanecen rígidas y mejoran al moverse, al revés que en la artrosis. Pueden afectarse varias articulaciones, un dedo entero (dactilitis) y las uñas.',
            peso: 'Lluch pide pensar en una causa reumatológica (espondiloartropatía, artritis reactiva) si tarda más de 60 minutos en entrar en calor por la mañana; la artrosis da menos rigidez, que cede en menos de una hora (menos de 30 minutos en los criterios que cita), y sus marcadores de inflamación son normales. No es una urgencia, pero sí una derivación temprana: el 70–90 % de las artritis reumatoides tiene erosiones en la radiografía a los 2 años, y tratarla pronto cambia el pronóstico (Goodman). Goodman propone derivar ante dolor a la compresión de metacarpianos y metatarsianos, tres o más articulaciones hinchadas o más de una hora de rigidez matutina. Si es una sola articulación muy dolorosa con fiebre y malestar, manda la pregunta anterior.',
            detalle: 'Reumatoide (Chauhan; Goodman; Lluch): autoinmune y sistémica; empieza en las pequeñas articulaciones de manos y pies, de forma simétrica, y progresa. El dolor del antepié puede ser la primera y única queja; con el tiempo, subluxación de las cabezas de los metatarsianos y dedos en martillo o desviados. Sinovial engrosada y «pastosa» al palpar, a menudo sin calor ni rojez; nódulos, también en el Aquiles. Más en mujeres; el tabaco es el principal factor ambiental. Factor reumatoide y anti-CCP positivos en la mayoría (Lluch).\n\nPsoriásica (Deeb y Maher; Goodman; Lluch): afecta al 19,7 % de los adultos con psoriasis, suele empezar entre los 30 y los 40 años y por igual en ambos sexos; la piel precede a la artritis en el 68 %, pero en el 17 % la artritis va primero. Oligoartritis asimétrica, interfalángicas distales de manos y pies, entesitis (Aquiles, fascia plantar), dactilitis («dedo en salchicha») y cambios en las uñas (piqueteado, onicólisis, hemorragias en astilla), presentes en el 80–90 %. Seronegativa.\n\nReactiva (Jogu; Goodman): 1–6 semanas después de una infección intestinal o urogenital; oligoartritis asimétrica de grandes articulaciones de la pierna (rodillas, tobillos, pies), entesitis en la inserción del Aquiles y en la fascia plantar (talalgia), dactilitis, conjuntivitis, uretritis y lesiones de piel y uñas. Goodman da 1–4 semanas; los dos son textos narrativos, así que se sigue a Jogu, más reciente.\n\nPreguntas útiles (Goodman): ¿cuánto tarda por la mañana en encontrarse lo mejor posible?, ¿tiene síntomas en otras partes del cuerpo (piel, uñas, ojos, intestino, orina)?, ¿ha tenido infecciones o tomado antibióticos en las últimas 6 semanas?',
            fisiologia: {
              pasos: [
                'En una persona predispuesta (genes como HLA-DRB1 en la reumatoide o HLA-B27 en la reactiva), un desencadenante (el tabaco, una infección, un traumatismo) activa el sistema inmune contra estructuras propias (Chauhan, Jogu, Deeb y Maher).',
                'En la reumatoide, la sinovial se llena de linfocitos y macrófagos; sus células se vuelven invasivas y liberan TNF e IL-6 (Chauhan).',
                'Esas células producen RANKL, que activa a los osteoclastos y erosiona el hueso, y los neutrófilos del líquido articular liberan enzimas que destruyen el cartílago (Chauhan).',
                'En la psoriásica y en la reactiva la diana principal son las entesis: la IL-23 y la IL-17 inflaman la inserción de tendones y ligamentos, y por eso duelen el talón, el Aquiles o un dedo entero (Deeb y Maher, Jogu).',
                'La inactividad (el sueño, estar mucho sentado) va seguida de rigidez, y la actividad la reduce: de ahí la rigidez matutina larga que mejora al moverse (Goodman).'
              ],
              nota: 'Las fuentes leídas describen la rigidez tras la inactividad, pero no explican su mecanismo.',
              metafora: 'Como una alarma mal configurada que salta contra la propia casa: la defensa ataca a las articulaciones que debería proteger.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Chauhan 2023', 'Deeb y Maher 2026', 'Jogu 2026'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 264, 282 y 287.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 113–117; cap. 12, pp. 438–441, 449–450 y 455–456.',
              { texto: 'Chauhan 2023 — Chauhan, Jandu, Brent y Al-Dhahir, «Rheumatoid Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441999/' },
              { texto: 'Deeb y Maher 2026 — Deeb y Maher, «Psoriatic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de abril de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK547710/' },
              { texto: 'Jogu 2026 — Jogu, Swamy y Maher, «Reactive Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de mayo de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499831/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Osteoma osteoide y otros
      // tumores» y «Malignidad o infección».
      id: 'tp_oncologico', icon: '🔬', nombre: 'Oncológico / Sistémico',
      banderasRojas: [
        'Osteoma osteoide y otros tumores: Segunda década. Dolor sordo peor de noche, sin relación con la actividad; alivio en <20 min con AINE. Sin alivio → otras causas (osteosarcoma: masa blanda). En consulta: Dolor puntual y tumefacción. ≈25 % no se ve en radiografía.',
        'Malignidad o infección: Síntomas sistémicos, pérdida de peso, sudores nocturnos; dolor nocturno que despierta. En consulta: Cribado general de la ficha. No reproducir el dolor conocido también obliga a pensarlo, igual que un dolor conocido que no mejora con una infiltración diagnóstica.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_c1', text: '¿Tiene fiebre, sudores nocturnos o ha perdido peso sin explicación, o el dolor le despierta por la noche?', alerta: true,
          razonamiento: {
            porque: 'Son síntomas que no vienen de la mecánica del pie sino del organismo entero. En el cáncer y en las infecciones, las citocinas inflamatorias (TNF-α, IL-6, IL-1β) dan fiebre, quitan el apetito y degradan músculo y grasa: de ahí la pérdida de peso. Un tumor que crece en el hueso lo destruye, estira el periostio y deja isquémico el tejido de alrededor, y por eso duele en reposo y despierta por la noche.',
            peso: 'Lluch los incluye en sus banderas rojas: los síntomas sistémicos, la pérdida de peso o los sudores nocturnos hacen pensar en malignidad o infección, y el dolor nocturno o que despierta, en una lesión ósea o en causas más graves. Por separado pesan poco: el dolor nocturno es una bandera roja clásica de cáncer, pero no todo dolor nocturno es cáncer ni todo cáncer lo da (Goodman). Pesan más juntos, si el dolor es constante e intenso, con antecedente de cáncer, con una masa que crece o con dolor al cargar (Goodman, Jayarangaiah), y si la exploración no reproduce el dolor conocido o una infiltración diagnóstica no lo alivia (Lluch). La pérdida de peso que cuenta es la involuntaria de más del 5 % en 6 meses (Daley). Con varios a la vez, derivar.',
            detalle: 'Banderas rojas del capítulo (Lluch, p. 287): dolor nocturno o que despierta (lesión ósea o causas más graves); síntomas sistémicos, pérdida de peso y sudores nocturnos (malignidad o infección); no reproducir el dolor conocido con la exploración (una causa más proximal o a distancia, o malignidad); dolor conocido que no mejora con una infiltración diagnóstica de anestésico local (lo mismo). Ya en la introducción, Lluch insiste en que no reproducir el dolor conocido obliga a replantear el diagnóstico.\n\nTumores óseos: los primarios son raros, y los benignos superan a los malignos 7 a 1 (Goodman). El osteosarcoma, el tumor óseo maligno primario más frecuente, aparece sobre todo antes de los 25 años, con dolor primero al hacer actividad y luego en reposo (Greenwood); el sarcoma de Ewing puede asentar en los metatarsianos (Goodman). Las metástasis afectan sobre todo a la columna, la pelvis y los extremos proximales del fémur y el húmero (Goodman, Jayarangaiah); dan un dolor sordo, progresivo y peor de noche, que el paciente atribuye a menudo a un golpe sin importancia (Jayarangaiah).\n\nPérdida de peso: Goodman da como signo de alarma una pérdida rápida del 10 % en 2 semanas; Daley define la caquexia como una pérdida involuntaria de más del 5 % en 6 meses. Los dos son textos narrativos, así que se sigue a Daley, más reciente, como en las demás regiones.\n\nDolor nocturno (Goodman): preguntar cómo es por la noche, si puede tumbarse sobre ese lado, qué otros síntomas aparecen al despertar (sudores, tos, ganas de orinar) y si la aspirina lo alivia de forma desproporcionada (orienta a osteoma osteoide; ver la pregunta siguiente). El dolor articular de origen sistémico suele ser constante, profundo y presente con todos los movimientos.',
            fisiologia: {
              pasos: [
                'En el cáncer, el tumor y las células inmunes del propio paciente liberan citocinas inflamatorias como el TNF-α, la IL-6 y la IL-1β (Daley).',
                'Esas citocinas inflaman el hipotálamo, que reduce el apetito, y elevan el gasto de energía en reposo, con fiebre y más frecuencia cardiaca (Daley).',
                'Además degradan la proteína del músculo e impiden fabricarla: el cuerpo pierde músculo y grasa aunque coma, y baja de peso (Daley).',
                'Si hay metástasis en el hueso, las células tumorales activan a los osteoclastos, que lo destruyen (osteólisis) (Jayarangaiah).',
                'El tumor estira el periostio y deja isquémico el tejido de alrededor; ese dolor no depende del movimiento y despierta por la noche (Goodman).'
              ],
              metafora: 'Como un gasto que el cuerpo no ha decidido: la inflamación consume reservas aunque se coma y se descanse.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Daley 2025', 'Jayarangaiah 2023', 'Greenwood 2024'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 235 y 287.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 113–114 y 119; cap. 13, pp. 475–476, 487 y 495–496.',
              { texto: 'Daley 2025 — Daley, Ali, Ohnuma y Adigun, «Anorexia and Cachexia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430977/' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' },
              { texto: 'Greenwood 2024 — Greenwood, Arora y Shaikh, «Osteosarcoma (Osteogenic Sarcoma)», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK563177/' }
            ]
          } },
        { id: 'tp_c2', text: '(Niño o joven) ¿Tiene un dolor sordo que empeora por la noche, sin relación con la actividad, y que se le alivia en menos de 20 minutos con un antiinflamatorio? (Osteoma osteoide: derivar.)', alerta: true,
          razonamiento: {
            porque: 'El osteoma osteoide es un tumor óseo benigno con un nido central de hueso muy vascularizado que fabrica prostaglandinas en cantidades enormes (de 100 a 1.000 veces lo normal). Las prostaglandinas aumentan el flujo de sangre y estimulan las fibras nerviosas que rodean el nido. Por eso duele sin relación con la actividad, peor de noche, y los antiinflamatorios, que frenan la producción de prostaglandinas, lo calman en poco tiempo.',
            peso: 'Lluch lo describe así: tumor benigno de la segunda década, con dolor sordo que empeora de noche y no se relaciona con la actividad, y que se alivia con un antiinflamatorio en menos de 20 minutos; ese alivio rápido es característico. Es benigno, ni agresivo ni se maligniza (Dookie y Joseph), pero hay que derivarlo para confirmarlo: alrededor del 25 % no se ve en la radiografía por su localización y hace falta TC o RM (Lluch); la TC es la prueba de elección (Dookie y Joseph). Si el antiinflamatorio no lo alivia, hay que pensar en otras causas (Lluch), como el osteoblastoma, el quiste óseo aneurismático, una infección o un osteosarcoma.',
            detalle: 'Quién y dónde (Dookie y Joseph; Lluch): el 10 % de los tumores óseos benignos; de 5 a 25 años, tres veces más en varones. Es más frecuente en fémur y tibia; el pie supone el 2–10 %, sobre todo el astrágalo, y hay casos en el cuboides, la cúpula del astrágalo y el calcáneo. El nido mide menos de 2 cm (los mayores son osteoblastomas). Goodman da 7–25 años, 2–3 varones por cada mujer y un nido menor de 1 cm, y Lluch, menor de 1,5 cm; los tres son textos narrativos, así que se sigue a Dookie y Joseph, el más reciente.\n\nCómo se presenta (Dookie y Joseph; Lluch; Goodman): dolor localizado e intermitente, peor de noche; dolor a la palpación e hinchazón; a veces calor y sudoración local, deformidad, atrofia muscular y cojera; cerca de una articulación, sinovitis y derrame. En la tabla del talón plantar del capítulo: dolor nocturno, sin relación con la actividad, alivio rápido con antiinflamatorios, dolor puntual y una lucencia de menos de 1,5 cm con bordes escleróticos en la radiografía.\n\nCon qué se confunde (Lluch, tabla 10): fractura de estrés (dolor con la actividad que cede con el reposo), infección (rasgos sistémicos, dolor sin relación con la actividad), osteoblastoma y quiste óseo aneurismático (responden peor a los antiinflamatorios) y osteosarcoma (dolor localizado que puede ir y venir durante meses y masa blanda dolorosa; necesita biopsia). El osteosarcoma aparece sobre todo antes de los 25 años, y su dolor pasa de la actividad al reposo (Greenwood).',
            fisiologia: {
              pasos: [
                'El tumor forma un nido central de hueso inmaduro muy vascularizado, rodeado de hueso esclerótico (Dookie y Joseph).',
                'Las células del nido producen prostaglandinas en niveles de 100 a 1.000 veces los del hueso normal (Dookie y Joseph).',
                'Las prostaglandinas aumentan el flujo de sangre local y cambian la presión vascular, lo que estimula las fibras nerviosas del nido y de la esclerosis que lo rodea (Dookie y Joseph, Goodman).',
                'Ese dolor no depende de la carga mecánica: aparece en reposo y de noche (Dookie y Joseph, Lluch).',
                'La aspirina y los antiinflamatorios inhiben las prostaglandinas, y por eso el dolor cede en poco tiempo (Goodman, Lluch).'
              ],
              metafora: 'Como un pequeño foco que emite una señal química constante: si se corta la señal, el dolor se apaga.'
            },
            fuentes: ['Lluch 2020', 'Dookie y Joseph 2023', 'Goodman 2018', 'Greenwood 2024'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265 y 285–286.',
              { texto: 'Dookie y Joseph 2023 — Dookie y Joseph, «Osteoid Osteoma», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537279/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 125; cap. 13, pp. 487 y 498.',
              { texto: 'Greenwood 2024 — Greenwood, Arora y Shaikh, «Osteosarcoma (Osteogenic Sarcoma)», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK563177/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Claudicación vascular o
      // neurógena» y «TVP tras inmovilización · Wells».
      id: 'tp_vascular', icon: '🩸', nombre: 'Vascular',
      banderasRojas: [
        'Claudicación vascular o neurógena: Dolor o calambre a una distancia o duración de esfuerzo reproducible. En consulta: Pulsos distales y exploración neurológica.',
        'TVP tras inmovilización · Wells: +1 cada uno: cáncer activo · parálisis, paresia o inmovilización con férula · encamamiento ≥3 días o cirugía mayor en 12 semanas · dolor en el trayecto venoso profundo · hinchazón de toda la pierna · pantorrilla >3 cm más gruesa (10 cm bajo la tuberosidad tibial) · edema con fóvea solo en esa pierna · venas colaterales no varicosas · TVP previa. −2: diagnóstico alternativo al menos tan probable. En consulta: El capítulo no la menciona. ≥2 → probable; ≤1 → improbable. Orienta la derivación, no la sustituye.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_v1', text: '¿Le aparece dolor o calambre siempre tras la misma distancia o el mismo tiempo de esfuerzo?', alerta: true,
          razonamiento: {
            porque: 'Si una arteria de la pierna está estrechada, el riego basta en reposo pero no cuando el músculo trabaja. Al caminar, la demanda supera el flujo máximo que llega por la arteria y sus colaterales, el músculo queda isquémico y se acumulan los productos del metabolismo sin oxígeno: aparece dolor o calambre siempre tras la misma distancia o el mismo tiempo. Al parar, el aporte vuelve a cubrir el consumo y el dolor cede. La estenosis del canal lumbar puede dar un cuadro parecido por isquemia de las raíces nerviosas.',
            peso: 'Lluch lo incluye en sus banderas rojas: un dolor o calambre tras una distancia de esfuerzo reproducible obliga a pensar en una claudicación vascular o neurógena. La vascular cede en pocos minutos al pararse de pie, con pulsos débiles y piel fría, pálida y sin vello, en mayores, fumadores y diabéticos (Goodman, Zemaitis); la neurógena empeora al estar de pie o al bajar cuestas y mejora al sentarse o inclinarse hacia delante (Munakomi). Si la distancia cambia mucho de un día a otro, no es claudicación (Goodman). Ante la sospecha, NICE pide preguntar por la claudicación, mirar los pies, palpar los pulsos y medir el índice tobillo-brazo, que en la diabetes puede salir normal aunque haya enfermedad. No es urgente, salvo un dolor isquémico brusco en reposo o un empeoramiento súbito, que Goodman pide comunicar al médico de inmediato.',
            detalle: 'Dónde duele (Goodman, Zemaitis): por debajo de la estenosis. La oclusión aortoilíaca da dolor en glúteos y muslos; la de la femoral superficial, la más frecuente (dos tercios), en la pantorrilla; la de la poplítea o las más distales, en el pie. Tras el ejercicio el pie puede quedar frío, pálido o moteado y adormecido.\n\nEnfermedad avanzada (Zemaitis, Goodman): dolor isquémico en reposo en el antepié o los dedos al elevar las piernas o al tumbarse, que alivia al dejar el pie colgando; úlceras o gangrena en los dedos, el talón o el pie. El primer signo puede ser la pérdida de vello en los dedos (Goodman). El dolor en reposo o las heridas indican una isquemia crónica que amenaza la extremidad.\n\nQuién (Zemaitis; Goodman): más de 200 millones de personas en el mundo y hasta el 20 % de los mayores de 70; casi por igual en hombres y mujeres de más de 40 (Goodman la describía sobre todo en varones de más de 50; se sigue a Zemaitis, más reciente). El tabaco multiplica el riesgo por 4; también la diabetes, la hipertensión, el colesterol alto y la edad.\n\nCon qué se confunde (Goodman): ciática y claudicación neurógena (a menudo bilateral, mejora con el reposo o flexionando la columna), síndrome compartimental anterior, gota y neuropatía periférica. NICE (CG147) recomienda evaluar la enfermedad arterial en quien tenga síntomas, diabetes, heridas que no curan en piernas o pies o dolor de pierna sin explicar.',
            fisiologia: {
              pasos: [
                'La aterosclerosis acumula lípidos y células inflamatorias en la pared de las arterias de la pierna; al principio la arteria se dilata para compensar, pero después la placa estrecha la luz (Zemaitis).',
                'La sangre se desvía por arterias colaterales más pequeñas, que mantienen el riego en reposo pero nunca llevan tanto flujo como la principal (Zemaitis).',
                'Al caminar, el músculo necesita más oxígeno; llega un momento en que el flujo colateral está al máximo y no basta: el músculo queda isquémico (Zemaitis).',
                'Los productos del metabolismo sin oxígeno se acumulan hasta superar el umbral de los receptores; por eso pasa un intervalo fijo entre empezar a andar y el dolor (Goodman).',
                'Al frenar o parar baja la demanda, el aporte la alcanza y el dolor desaparece en poco tiempo (Zemaitis).'
              ],
              metafora: 'Como una tubería estrecha: alcanza para un grifo abierto, pero no para todos a la vez.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Zemaitis 2026', 'Munakomi 2023', 'NICE CG147'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 287.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 120; cap. 6, pp. 228, 254–255 y 262.',
              { texto: 'Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/' },
              { texto: 'Munakomi 2023 — Munakomi, Foris y Varacallo, «Spinal Stenosis and Neurogenic Claudication», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430872/' },
              { texto: 'NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.1–1.3.4.', url: 'https://www.nice.org.uk/guidance/cg147' }
            ]
          } },
        { id: 'tp_v2', urgencia: 'Posible TVP: derivar hoy (NICE NG158: con Wells ≥2, ecografía en 4 horas; con 1 o menos, dímero D en 4 horas; riesgo de embolia pulmonar).', text: '¿Tras una inmovilización, una férula, estar encamado o una cirugía reciente, tiene la pantorrilla o toda la pierna hinchada, caliente o dolorosa? (Posible TVP: calcular Wells; ≥2 → probable.)', alerta: true,
          razonamiento: {
            porque: 'Tras una inmovilización, una férula, el encamamiento o una cirugía, la sangre de las venas de la pierna se estanca porque deja de funcionar la bomba de la pantorrilla, y la cirugía o el traumatismo dañan la pared venosa y aumentan la coagulabilidad: es la tríada de Virchow. Se forma un coágulo, casi siempre empezando en las venas de la pantorrilla, que dificulta el retorno y da hinchazón, calor y dolor en esa pierna. El riesgo es que se suelte y llegue al pulmón.',
            peso: 'Pesa mucho por lo que está en juego: la embolia pulmonar puede ser la primera manifestación (Goodman). Pero la clínica sola engaña: hasta la mitad de las TVP no da signos específicos, y ningún signo, solo o combinado, basta para confirmarla o descartarla (Waheed); el signo de Homans es poco sensible y poco específico (Goodman). Por eso NICE pide calcular la escala de Wells de dos niveles: con 2 puntos o más la TVP es probable y hay que hacer una ecografía, con el resultado en 4 horas si es posible; con 1 o menos, un dímero D. Toda fractura de tobillo debería tener valorado su riesgo de TVP (Hermena y Slane). Con sospecha, derivar sin demora a quien pueda confirmarla o descartarla.',
            detalle: 'Escala de Wells de dos niveles (NICE NG158, tabla 1): 1 punto por cada uno de estos: cáncer activo (en tratamiento, en los últimos 6 meses o paliativo); parálisis, paresia o inmovilización reciente con yeso de la pierna; encamamiento de 3 días o más o cirugía mayor con anestesia general o regional en las 12 semanas previas; dolor localizado a lo largo del sistema venoso profundo; toda la pierna hinchada; pantorrilla al menos 3 cm más gruesa que la otra; edema con fóvea solo en la pierna sintomática; venas superficiales colaterales no varicosas; TVP previa documentada. Se restan 2 si otro diagnóstico es al menos igual de probable. Con 2 o más, probable; con 1 o menos, improbable. Goodman la recoge para pacientes ambulatorios y mide la pantorrilla 10 cm por debajo de la tuberosidad tibial.\n\nFactores de riesgo (Waheed; Goodman): inmovilidad (encamamiento, anestesia general, vuelos largos), lesión de la pierna con movilidad limitada más de 72 horas, cirugía, traumatismos y fracturas, cáncer, embarazo y posparto, estrógenos, obesidad, edad, TVP previa y trastornos de la coagulación. Alrededor de un tercio de los mayores de 40 años con cirugía mayor o infarto desarrolla una TVP (Goodman).\n\nCómo se presenta (Waheed; Goodman): dolor (en la mitad) e hinchazón (en el 70 %) de una pierna, calor, enrojecimiento o cambio de color, venas superficiales marcadas y, a veces, febrícula. Con qué se confunde: celulitis, tromboflebitis superficial, linfedema, hinchazón posoperatoria y distensión de la pantorrilla (Waheed; Goodman).',
            fisiologia: {
              pasos: [
                'La sangre de las venas profundas de la pierna sube gracias a la bomba muscular de la pantorrilla; con la pierna inmovilizada, esa bomba se detiene y la sangre se estanca (Goodman).',
                'La cirugía o el traumatismo dañan la pared venosa, y otros factores (cáncer, estrógenos, embarazo) aumentan la coagulabilidad: estasis, lesión de la pared e hipercoagulabilidad forman la tríada de Virchow (Waheed, Goodman).',
                'El coágulo suele empezar en zonas de flujo lento, como los senos venosos del sóleo o detrás de las válvulas; al contacto con el endotelio se liberan citocinas y se adhieren leucocitos, y crece si la coagulación gana a la fibrinólisis (Waheed).',
                'El coágulo dificulta el retorno venoso: la pierna se hincha por debajo, se calienta y duele (Goodman).',
                'Si un fragmento se suelta, viaja por las venas hasta el pulmón: es la embolia pulmonar (Goodman).'
              ],
              metafora: 'Como el agua estancada en una tubería: si deja de correr, empieza a formar depósitos que pueden soltarse.'
            },
            fuentes: ['NICE NG158', 'Goodman 2018', 'Waheed 2023', 'Hermena y Slane 2025'],
            citas: [
              { texto: 'NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.8 y tabla 1 (escala de Wells de dos niveles).', url: 'https://www.nice.org.uk/guidance/ng158' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 255–257.',
              { texto: 'Waheed 2023 — Waheed, Kudaravalli y Hotwagner, «Deep Venous Thrombosis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507708/' },
              { texto: 'Hermena y Slane 2025 — Hermena y Slane, «Ankle Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK542324/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta tobillo y pie (guía de consulta), BANDERAS «Neuropatía sistémica» y «SDRC»;
      // árbol, nodo 1 (debilidad simétrica progresiva con arreflexia → urgencia).
      id: 'tp_neuro', icon: '🧠', nombre: 'Neurológico',
      banderasRojas: [
        'Neuropatía sistémica: Dolor neuropático simétrico (diabetes), pie caído (mononeuritis múltiple), debilidad simétrica que progresa en días o pocas semanas con arreflexia (desmielinizante aguda → mismo día). En consulta: Reflejo aquíleo, vibración, pinchazo, temperatura.',
        'SDRC: Signos autonómicos tras una lesión: rubor, hinchazón más allá de la fase aguda, hiperestesia, hiperalgesia. En consulta: Temperatura, color, sudoración y sensibilidad frente al lado sano.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'tp_n1', urgencia: 'Debilidad simétrica progresiva con arreflexia (sospecha de neuropatía desmielinizante aguda): derivación médica el mismo día.', text: '¿Tiene debilidad en las dos piernas que va a más en días o pocas semanas? (Explorar reflejos: con arreflexia, derivación el mismo día.)', alerta: true, s1: true,
          razonamiento: {
            porque: 'Una debilidad que empieza en las dos piernas y va a más en días o semanas, con los reflejos abolidos, hace pensar en un síndrome de Guillain-Barré. Tras una infección, el sistema inmune fabrica anticuerpos contra el germen que, por parecido, atacan también la mielina o el axón de los nervios periféricos y de sus raíces. Sin mielina, el impulso nervioso se enlentece o se bloquea: debilidad simétrica, reflejos ausentes y hormigueo en pies y manos.',
            peso: 'Es una urgencia neuromuscular potencialmente mortal: la debilidad puede subir hasta los músculos respiratorios, y la afectación autonómica puede dar arritmias; la mortalidad es del 3–7 %, y de alrededor del 20 % si necesita ventilación (Bhatti). Lluch lo describe en su tabla de neuropatías: debilidad muscular simétrica y progresiva con reflejos ausentes o disminuidos en 2–4 semanas, que puede empezar con dolor en las extremidades y la espalda. Bhatti añade que suele llegar a su peor momento en menos de 2 semanas, y Goodman, que la debilidad progresa rápido, en 3–7 días. Goodman pide derivar los síntomas neurológicos progresivos que aparecen 1–3 semanas después de una infección o una vacuna. Con debilidad progresiva y arreflexia, derivación médica el mismo día.',
            detalle: 'Antecedente (Bhatti; Goodman): en alrededor del 70 % hay una infección previa (Campylobacter jejuni, citomegalovirus, virus de Epstein-Barr, Mycoplasma, hepatitis E, Zika), unos 10 días antes; también vacunas como la de la gripe, cirugías o traumatismos. 1,1–1,8 casos por 100.000 personas y año, algo más en varones (Bhatti); Goodman da 0,6–2,4, y se sigue a Bhatti, más reciente.\n\nCómo se presenta (Bhatti; Goodman; Lluch): lumbalgia por inflamación de las raíces y hormigueo distal al principio; debilidad simétrica, proximal y distal, que suele empezar en las piernas y subir a los brazos y la cara; reflejos abolidos o disminuidos desde pronto (en la variante axonal motora pueden conservarse); pérdida sensitiva leve; disfunción autonómica en unos dos tercios (taquicardia, presión arterial inestable, sudoración anormal, retención de orina). Puede presentarse como un pie caído (Nori y Stretanski). Riesgo de necesitar ventilación: progresión rápida, afectación bulbar, debilidad del cuello o de los flexores de la cadera, o no poder contar hasta 15 en una sola espiración (Bhatti).\n\nTiempo (Bhatti; Lluch): si el empeoramiento sigue más de 4 semanas, o llega al máximo en menos de 24 horas, hay que pensar en otro diagnóstico; una progresión de más de 8 semanas o 3 recaídas orientan a la polineuropatía desmielinizante inflamatoria crónica, que Lluch describe con debilidad simétrica proximal y distal y curso lento o recidivante.\n\nPronóstico (Bhatti): más de la mitad se recupera del todo en un año y el 77 % camina solo a los 6 meses, aunque las secuelas (debilidad, dolor neuropático, fatiga) son frecuentes.',
            fisiologia: {
              pasos: [
                'La mielina, que en los nervios periféricos fabrican las células de Schwann, aísla el axón: el impulso salta de un nódulo de Ranvier al siguiente y así viaja muy rápido (Ashley y Lui).',
                'Tras una infección como la de Campylobacter, cuyas moléculas se parecen a los gangliósidos del nervio, el sistema inmune fabrica anticuerpos que reconocen también al nervio (mimetismo molecular) (Bhatti).',
                'Linfocitos y citocinas abren la barrera entre la sangre y el nervio, sobre todo en las raíces y en las terminaciones distales, donde es más débil, y entran macrófagos y anticuerpos (Bhatti).',
                'Los macrófagos y el complemento dañan las células de Schwann y el axón: se pierde mielina y la conducción se enlentece o se bloquea (Bhatti).',
                'Sin conducción, los músculos se debilitan de forma simétrica, empezando por las piernas, y desaparecen los reflejos; si llega a los nervios de los músculos respiratorios, falla la respiración (Bhatti).'
              ],
              metafora: 'Como un cable eléctrico al que se le va pelando el aislante: la señal llega débil o no llega.'
            },
            fuentes: ['Lluch 2020', 'Bhatti 2026', 'Goodman 2018', 'Ashley y Lui 2023', 'Nori y Stretanski 2025'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 283.',
              { texto: 'Bhatti 2026 — Bhatti, Maheshwary y Sun, «Guillain-Barre Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK532254/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 453–456.',
              { texto: 'Ashley y Lui 2023 — Ashley y Lui, «Physiology, Nerve», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK551652/' },
              { texto: 'Nori y Stretanski 2025 — Nori y Stretanski, «Foot Drop», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554393/' }
            ]
          } },
        { id: 'tp_n2', text: '¿Tiene ardor, hormigueo o pérdida de sensibilidad en los dos pies (p. ej., con diabetes), o se le cae el pie al caminar?', alerta: true,
          razonamiento: {
            porque: 'Un ardor u hormigueo en los dos pies sugiere una polineuropatía: en la diabetes, la glucosa alta mantenida daña los nervios empezando por sus fibras más distales, así que los síntomas aparecen primero en los pies, «en calcetín». Un pie que se cae al caminar indica que fallan los músculos que lo levantan: puede ser una compresión del nervio peroneo junto al peroné, una radiculopatía L5 o una mononeuritis múltiple por vasculitis, en la que se dañan nervios sueltos y el pie caído es la manifestación más frecuente.',
            peso: 'Lluch los incluye entre las causas neuropáticas de dolor de pie: la polineuropatía diabética da dolor neuropático simétrico, a menudo nocturno, con el reflejo aquíleo, la vibración, el pinchazo y la temperatura abolidos o disminuidos; la mononeuritis múltiple, déficits asimétricos y parcheados con pie caído, en el contexto de vasculitis o conectivopatías. No es una urgencia, salvo que la debilidad vaya a más en las dos piernas (pregunta anterior). En la diabetes importa por el pie: la neuropatía quita la sensibilidad protectora y abre la puerta a úlceras y a la artropatía de Charcot (Bodman); NICE pide derivar en un día laborable un pie diabético caliente, hinchado o con cambio de color sin explicación, e inmediatamente una úlcera con fiebre o con isquemia. Un pie caído nuevo se deriva para estudio.',
            detalle: 'Polineuropatía diabética (Bodman): la diabetes es la causa más frecuente de neuropatía periférica (otras: alcohol, falta de vitamina B12, quimioterapia, VIH, hipotiroidismo, artritis reumatoide, lupus, cáncer, enfermedades hereditarias). La tiene el 10–20 % al diagnóstico de la diabetes, el 26 % a los 5 años y el 41 % a los 10, y la acaba teniendo el 50–66 %. Ardor, adormecimiento u hormigueo en los pies, peor de noche, en «calcetín y guante» en el 80 %; la mitad puede ser asimétrica. Al principio se pierden el tacto ligero y el reflejo aquíleo; la sensibilidad protectora (monofilamento de 10 g), más tarde, a veces después de la primera úlcera. Piel seca y agrietada (afectación autonómica) y dedos en martillo (motora). Los estudios de conducción solo se piden si es atípica: inicio rápido, gran debilidad o sensibilidad asimétrica.\n\nPie diabético (NICE NG19; Bodman): explorar los dos pies buscando neuropatía (monofilamento de 10 g), isquemia, úlceras, callos, infección, deformidad, gangrena y artropatía de Charcot. Sospechar un Charcot agudo ante rubor, calor, hinchazón o deformidad con la piel intacta, sobre todo con neuropatía, aunque no duela; una fractura de pie o tobillo en una persona con diabetes puede evolucionar a Charcot. La diabetes es la causa más frecuente de Charcot, que llega al 29 % en quienes tienen neuropatía (Bodman). A los 5 años, quien tiene una úlcera de pie diabético tiene 2,5 veces más riesgo de morir.\n\nPie caído (Nori y Stretanski; Lezak): debilidad de la flexión dorsal que hace tropezar o caminar en estepaje. Causas: compresión del peroneo común en la cabeza del peroné (la mononeuropatía más frecuente de la pierna: cruzar las piernas, cuclillas, yesos apretados, encamamiento, pérdida de peso, masas), radiculopatía L5, lesión del ciático, mononeuritis múltiple (dolorosa y asimétrica; artritis reumatoide, hepatitis, VIH, vasculitis), Guillain-Barré, ictus (con hipertonía e hiperreflexia), ELA (pie caído indoloro) y Charcot-Marie-Tooth. Las personas con diabetes son más susceptibles a las compresiones. Goodman incluye la mononeuritis múltiple y la neuropatía sensitiva distal entre las manifestaciones de la artritis reumatoide.',
            fisiologia: {
              pasos: [
                'La glucosa alta mantenida provoca resistencia a la insulina, estrés oxidativo en mitocondrias y retículo endoplásmico y acumulación de especies reactivas de oxígeno (Bodman).',
                'Se suman los productos de glicación avanzada, la inflamación (macrófagos dentro del nervio que liberan citocinas) y un riego del nervio deficiente por disfunción del endotelio (Bodman).',
                'El daño empieza en las fibras sensitivas y autonómicas distales y avanza hacia arriba (Bodman).',
                'Por eso los síntomas empiezan en los dos pies, «en calcetín» (ardor, hormigueo y pérdida de sensibilidad), y más tarde se pierde la sensibilidad protectora (Bodman).',
                'En la mononeuritis múltiple el mecanismo es otro: la vasculitis de las pequeñas arterias del nervio daña el axón de nervios sueltos, y si cae el peroneo, el pie se cae (Nori y Stretanski).'
              ],
              metafora: 'Como una ristra de luces que empieza a apagarse por el final: lo más alejado es lo primero que falla.'
            },
            fuentes: ['Lluch 2020', 'Bodman 2024', 'NICE NG19', 'Nori y Stretanski 2025', 'Lezak 2024', 'Goodman 2018'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 283.',
              { texto: 'Bodman 2024 — Bodman, Dreyer y Varacallo, «Diabetic Peripheral Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK442009/' },
              { texto: 'NICE NG19 — NICE, «Diabetic foot problems: prevention and management» (2015, actualizada el 11 de octubre de 2019), recomendaciones 1.3.4, 1.3.6, 1.4.1–1.4.2 y 1.7.1–1.7.3.', url: 'https://www.nice.org.uk/guidance/ng19' },
              { texto: 'Nori y Stretanski 2025 — Nori y Stretanski, «Foot Drop», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554393/' },
              { texto: 'Lezak 2024 — Lezak, Massel y Varacallo, «Peroneal Nerve Injury», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK549859/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, p. 440.'
            ]
          } },
        { id: 'tp_n3', text: 'Desde una lesión, ¿tiene el pie enrojecido, con cambios de temperatura o sudoración, hinchado más allá de la fase aguda, o le duele al mínimo roce?', alerta: true,
          razonamiento: {
            porque: 'Tras una lesión, a veces el dolor no sigue el curso de la curación: el sistema nervioso se sensibiliza y el sistema autónomo se desregula. Los neuropéptidos que liberan los nervios del tejido lesionado (como la sustancia P) dilatan los vasos y hacen salir líquido; los nociceptores bajan su umbral, la médula amplifica las señales y las fibras del dolor se vuelven sensibles a la actividad simpática. El resultado es un pie enrojecido, con cambios de temperatura y de sudoración, hinchado más allá de la fase aguda y que duele al mínimo roce.',
            peso: 'Lluch pide considerar un síndrome de dolor regional complejo en las lesiones de tobillo y pie cuando hay dolor con disfunción autonómica (rubor, hinchazón más allá de la fase aguda e hiperestesia o hiperalgesia), y advierte que es difícil de tratar, más aún porque su diagnóstico suele retrasarse. El diagnóstico es clínico, con los criterios de Budapest (sensibilidad 0,99, especificidad 0,68): dolor desproporcionado con síntomas y signos en varias categorías (sensitiva, vasomotora, sudomotora o edema, y motora o trófica) y sin una explicación mejor (Guthmiller). No es una urgencia, pero sí motivo para derivar sin esperar, después de pensar en lo que se le parece: TVP, celulitis, insuficiencia vascular, vasculitis o neuropatía (Guthmiller).',
            detalle: 'Cuándo aparece (Guthmiller): tras un traumatismo, una fractura (el desencadenante más frecuente, 44–46 %), una cirugía, un esguince o una contusión, o tras una inmovilización prolongada; también sin lesión clara. En un estudio multicéntrico, el 48,5 % de quienes se habían fracturado el tobillo, la muñeca, el escafoides o el 5.º metatarsiano cumplía los criterios de la IASP y seguía con síntomas al año; el riesgo era mayor con artritis reumatoide, fracturas intraarticulares de tobillo y luxaciones. Tras una cirugía de pie o tobillo, el 4,36 %. Suele empezar en las 8 semanas siguientes. Es 3–4 veces más frecuente en mujeres. Tipo 1, sin lesión nerviosa; tipo 2, con una lesión nerviosa conocida.\n\nCriterios de Budapest (Guthmiller): dolor continuo desproporcionado al desencadenante; al menos un síntoma en 3 de 4 categorías y al menos un signo en 2 o más: sensitiva (hiperalgesia al pinchazo, alodinia al tacto o a la presión), vasomotora (asimetría de temperatura o de color), sudomotora o edema (edema, cambios o asimetría de sudoración) y motora o trófica (menos movilidad, debilidad, temblor, distonía, cambios en vello, piel o uñas); y ningún diagnóstico que lo explique mejor. Es un diagnóstico de exclusión: la termografía o la gammagrafía ayudan a descartar otras causas, pero no son necesarias.',
            fisiologia: {
              pasos: [
                'Tras la lesión, los nervios del tejido liberan neuropéptidos (el péptido relacionado con el gen de la calcitonina, la bradicinina, la sustancia P) y suben citocinas como el TNF-α y la IL-6 (Guthmiller).',
                'Eso produce una inflamación neurógena: los vasos se dilatan y sale líquido a los tejidos, con calor, rubor e hinchazón (Guthmiller).',
                'El TNF-α baja el umbral de los nociceptores (sensibilización periférica), y el bombardeo continuo de señales hace más excitables las neuronas de la médula (sensibilización central): un roce duele (alodinia) y un estímulo doloroso duele más (hiperalgesia) (Guthmiller).',
                'Las fibras del dolor expresan más receptores simpáticos, así que la actividad simpática aumenta el dolor y altera el color, la temperatura y la sudoración (Guthmiller).',
                'Por eso el pie cambia de color y temperatura, suda distinto y sigue hinchado más allá de la fase aguda (Guthmiller, Lluch).'
              ],
              nota: 'Ningún mecanismo único lo explica: Guthmiller lo considera multifactorial (inflamatorio, inmunitario, de sensibilización y autonómico).',
              metafora: 'Como una alarma que se queda encendida después del incidente y salta con cualquier roce.'
            },
            fuentes: ['Lluch 2020', 'Guthmiller 2025'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 287.',
              { texto: 'Guthmiller 2025 — Guthmiller, Dua, Dey y Varacallo, «Complex Regional Pain Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de mayo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430719/' }
            ]
          } }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.tobillo_pie
// Tarjeta tobillo y pie (guía de consulta), ARBOL: nodo 1 (urgencia) va en la fase 2;
// 2 → tp_step1; 3 → tp_step2; 4 → tp_step3; 5 → tp_step4; 6 → tp_step5;
// 7 → tp_step6–tp_step9 y 8 → tp_step10–tp_step13 (una zona por paso, como rodilla).
export const tree = {
  title: 'Algoritmo CIF — Tobillo y Pie',
  steps: [
    {
      // Nodo 2. El «NO» salta a tp_step4 (las ramas traumáticas pasan por tp_step2 y tp_step3).
      id: 'tp_step1',
      tag: 'Paso 1 — ¿Traumatismo Agudo?',
      question: '¿Traumatismo agudo?',
      options: [
        { label: 'SÍ — Traumatismo agudo: Ottawa primero, después por mecanismo', value: 'si', next: null, hypothesis: [] },
        { label: 'NO — Sin traumatismo: por edad y localización', value: 'no', next: 'tp_step4', hypothesis: [] }
      ]
    },
    {
      // Nodo 3. Derivación antes de seguir explorando.
      id: 'tp_step2',
      tag: 'Paso 2 — Ottawa, Thompson, Lisfranc y Calcáneo',
      question: '¿Algún criterio de Ottawa de tobillo o de pie, Thompson positivo, o mecanismo de Lisfranc o de caída sobre el talón? → DERIVAR para radiografía (Ottawa) o derivación preferente (Aquiles, Lisfranc, calcáneo) antes de seguir explorando.',
      options: [
        { label: 'OTTAWA DE TOBILLO POSITIVO — Zona maleolar: posible fractura de tobillo; derivar para radiografía antes de seguir explorando', value: 'ottawa_tobillo', next: null, hypothesis: ['tp37'] },
        { label: 'OTTAWA DE PIE POSITIVO — Mediopié (base del 5.º MT, navicular): derivar para radiografía antes de seguir explorando', value: 'ottawa', next: null, hypothesis: ['tp5'] },
        { label: 'THOMPSON POSITIVO — Rotura del Aquiles: derivación preferente', value: 'thompson', next: null, hypothesis: ['tp3'] },
        { label: 'MECANISMO DE LISFRANC — Caída sobre el pie en punta: derivación preferente', value: 'lisfranc', next: null, hypothesis: ['tp4'] },
        { label: 'CAÍDA SOBRE EL TALÓN — Fractura de calcáneo: derivación preferente', value: 'calcaneo', next: null, hypothesis: ['tp5'] },
        { label: 'NINGUNO — Ottawa negativo, Thompson negativo, sin mecanismo de Lisfranc ni de calcáneo', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 4.
      id: 'tp_step3',
      tag: 'Paso 3 — Mecanismo del Tobillo Agudo',
      question: 'Tobillo agudo traumático, ¿qué mecanismo cuenta?',
      options: [
        { label: 'ESGUINCE LATERAL — Inversión del retropié o flexión plantar con aducción (LPAA y LPC; dolor en la base del 5.º MT → Ottawa)', value: 'esguince', next: null, hypothesis: ['tp1'] },
        { label: 'SINDESMOSIS — Rotación externa del pie con flexión dorsal forzada, contacto', value: 'sindesmosis', next: null, hypothesis: ['tp2'] },
        { label: 'CALCANEOCUBOIDEA — Inversión en plantígrado en terreno irregular', value: 'calcaneocuboidea', next: null, hypothesis: ['tp29'] },
        { label: 'LUXACIÓN DEL TIBIAL POSTERIOR — Flexión dorsal e inversión con contracción forzada, chasquido medial', value: 'luxacion_tp', next: null, hypothesis: ['tp6'] },
        { label: 'NINGUNO — Ningún mecanismo de estos', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 5. Sever, Iselin, Köhler, Freiberg y apofisitis del tibial posterior no tienen
      // ficha propia en la tarjeta: una sola hipótesis (tp36). El osteoma osteoide es bandera
      // roja (fase 2, tp_oncologico): derivar, sin hipótesis.
      id: 'tp_step4',
      tag: 'Paso 4 — Niño o Adolescente',
      question: '¿Niño o adolescente con dolor bien localizado o sin mecanismo claro?',
      options: [
        { label: 'SEVER — Inserción del Aquiles (8–12 años)', value: 'sever', next: null, hypothesis: ['tp36'] },
        { label: 'ISELIN — Base del 5.º MT (8–13 años)', value: 'iselin', next: null, hypothesis: ['tp36'] },
        { label: 'APOFISITIS DEL TIBIAL POSTERIOR o KÖHLER — Navicular (menores de 10, cojera)', value: 'navicular', next: null, hypothesis: ['tp36'] },
        { label: 'FREIBERG — Cabeza del 2.º–4.º MT (14–18 años)', value: 'freiberg', next: null, hypothesis: ['tp36'] },
        { label: 'OSTEOCONDRITIS DISECANTE — Esguince que no se resuelve, bloqueo', value: 'ocd', next: null, hypothesis: ['tp25'] },
        { label: 'OSTEOMA OSTEOIDE — Dolor nocturno con alivio rápido por AINE: derivar', value: 'osteoma', next: null, hypothesis: [] },
        { label: 'NO — Adulto, o hay mecanismo claro', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 6. Sin hipótesis: el referido lumbar se valora en su propia región (como en rodilla).
      id: 'tp_step5',
      tag: 'Paso 5 — ¿La Exploración Local Reproduce el Dolor?',
      question: '¿La exploración local no reproduce el dolor conocido? → COLUMNA LUMBAR u origen proximal: slump con flexión plantar e inversión. Si persiste la duda, replantear (malignidad).',
      options: [
        { label: 'COLUMNA LUMBAR u origen proximal — El slump con flexión plantar e inversión reproduce: valorar en la región Lumbar', value: 'lumbar', next: null, hypothesis: [] },
        { label: 'NO REPRODUCE NADA — Persiste la duda: replantear (malignidad)', value: 'replantear', next: null, hypothesis: [] },
        { label: 'NO — La exploración local sí reproduce el dolor conocido', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, POSTERIOR.
      id: 'tp_step6',
      tag: 'Paso 6 — Tobillo sin Traumatismo: Posterior',
      question: 'Dolor sin traumatismo en el tobillo, POSTERIOR: ¿qué lo explica?',
      options: [
        { label: 'PINZAMIENTO POSTERIOR — Flexión plantar máxima', value: 'pinz_post', next: null, hypothesis: ['tp7'] },
        { label: 'AQUILES PORCIÓN MEDIA — Pinza, 2–6 cm', value: 'aquiles_media', next: null, hypothesis: ['tp8'] },
        { label: 'AQUILES INSERCIONAL — Un dedo, flexión dorsal', value: 'aquiles_ins', next: null, hypothesis: ['tp9'] },
        { label: 'VAINA DEL AQUILES — Crepitación, rango amplio', value: 'vaina', next: null, hypothesis: ['tp10'] },
        { label: 'PLANTAR DELGADO — Medial y proximal', value: 'plantar', next: null, hypothesis: ['tp11'] },
        { label: 'NERVIO SURAL — Lateral, neuropático', value: 'sural', next: null, hypothesis: ['tp12'] },
        { label: 'BURSA SUPERFICIAL — Roce del zapato', value: 'bursa', next: null, hypothesis: ['tp13'] },
        { label: 'NINGUNO — Sin dolor posterior o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, MEDIAL.
      id: 'tp_step7',
      tag: 'Paso 7 — Tobillo sin Traumatismo: Medial',
      question: 'Dolor sin traumatismo en el tobillo, MEDIAL: ¿qué lo explica?',
      options: [
        { label: 'TIBIAL POSTERIOR — Retromaleolar, ETM sin varo del retropié', value: 'tp', next: null, hypothesis: ['tp14'] },
        { label: 'FHL — Transición de flexión dorsal a plantar', value: 'fhl', next: null, hypothesis: ['tp15'] },
        { label: 'TÚNEL DEL TARSO — Tinel', value: 'tunel', next: null, hypothesis: ['tp16'] },
        { label: 'FRACTURA DE ESTRÉS — Maléolo medial', value: 'estres', next: null, hypothesis: ['tp17'] },
        { label: 'NINGUNO — Sin dolor medial o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, LATERAL. «Referido» sin hipótesis: remite a la región Lumbar (nodo 6).
      id: 'tp_step8',
      tag: 'Paso 8 — Tobillo sin Traumatismo: Lateral',
      question: 'Dolor sin traumatismo en el tobillo, LATERAL: ¿qué lo explica?',
      options: [
        { label: 'SENO DEL TARSO', value: 'seno', next: null, hypothesis: ['tp18'] },
        { label: 'PERONEOS', value: 'peroneos', next: null, hypothesis: ['tp19'] },
        { label: 'ESTRÉS DEL ASTRÁGALO', value: 'estres', next: null, hypothesis: ['tp17'] },
        { label: 'REFERIDO — Valorar en la región Lumbar', value: 'referido', next: null, hypothesis: [] },
        { label: 'NINGUNO — Sin dolor lateral o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, ANTERIOR.
      id: 'tp_step9',
      tag: 'Paso 9 — Tobillo sin Traumatismo: Anterior',
      question: 'Dolor sin traumatismo en el tobillo, ANTERIOR: ¿qué lo explica?',
      options: [
        { label: 'PINZAMIENTO ANTERIOR — KTW', value: 'pinz_ant', next: null, hypothesis: ['tp20'] },
        { label: 'NINGUNO — Sin dolor anterior o no lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, TALÓN PLANTAR.
      id: 'tp_step10',
      tag: 'Paso 10 — Pie: Talón Plantar',
      question: 'Dolor en el pie, TALÓN PLANTAR: ¿qué lo explica?',
      options: [
        { label: 'DOLOR PLANTAR CRÓNICO — Tuberosidad medial', value: 'plantar', next: null, hypothesis: ['tp26'] },
        { label: 'ALMOHADILLA GRASA — Posterolateral', value: 'almohadilla', next: null, hypothesis: ['tp27'] },
        { label: 'ATRAPAMIENTO NERVIOSO — Tinel', value: 'atrapamiento', next: null, hypothesis: ['tp28'] },
        { label: 'ESTRÉS DEL CALCÁNEO', value: 'estres', next: null, hypothesis: ['tp17'] },
        { label: 'NINGUNO — Sin dolor en el talón plantar o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, MEDIOPIÉ.
      id: 'tp_step11',
      tag: 'Paso 11 — Pie: Mediopié',
      question: 'Dolor en el pie, MEDIOPIÉ: ¿qué lo explica?',
      options: [
        { label: 'CALCANEOCUBOIDEA', value: 'calcaneocuboidea', next: null, hypothesis: ['tp29'] },
        { label: 'NAVICULAR (punto N), CUBOIDES O CUÑAS — Fractura de estrés', value: 'estres', next: null, hypothesis: ['tp30'] },
        { label: 'LISFRANC', value: 'lisfranc', next: null, hypothesis: ['tp4'] },
        { label: 'COALICIÓN', value: 'coalicion', next: null, hypothesis: ['tp23'] },
        { label: 'NINGUNO — Sin dolor en el mediopié o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, ANTEPIÉ.
      id: 'tp_step12',
      tag: 'Paso 12 — Pie: Antepié',
      question: 'Dolor en el pie, ANTEPIÉ: ¿qué lo explica?',
      options: [
        { label: '1.ª MTF', value: 'mtf', next: null, hypothesis: ['tp31'] },
        { label: 'BASE DEL 2.º MT', value: 'base2', next: null, hypothesis: ['tp32'] },
        { label: 'CUELLO DE MT — Fractura de marcha', value: 'cuello', next: null, hypothesis: ['tp33'] },
        { label: '5.º MT — Fractura', value: 'mt5', next: null, hypothesis: ['tp5'] },
        { label: 'MORTON — O bursitis intermetatarsiana', value: 'morton', next: null, hypothesis: ['tp34'] },
        { label: 'GOTA — Derivar para confirmar (con fiebre y malestar → artritis infecciosa: urgencia)', value: 'gota', next: null, hypothesis: ['tp35'] },
        { label: 'NINGUNO — Sin dolor en el antepié o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 8, «No →» (dolor vago del tobillo o que no se resuelve tras un esguince).
      id: 'tp_step13',
      tag: 'Paso 13 — Dolor Vago del Tobillo',
      question: 'DOLOR VAGO DEL TOBILLO o que no se resuelve tras un esguince: ¿qué lo explica?',
      options: [
        { label: 'INESTABILIDAD CRÓNICA', value: 'inestabilidad', next: null, hypothesis: ['tp21'] },
        { label: 'SINDESMOSIS', value: 'sindesmosis', next: null, hypothesis: ['tp2'] },
        { label: 'SINOVITIS POSTRAUMÁTICA', value: 'sinovitis', next: null, hypothesis: ['tp22'] },
        { label: 'COALICIÓN TARSIANA', value: 'coalicion', next: null, hypothesis: ['tp23'] },
        { label: 'ARTROSIS', value: 'artrosis', next: null, hypothesis: ['tp24'] },
        { label: 'OSTEOCONDRITIS DISECANTE', value: 'ocd', next: null, hypothesis: ['tp25'] },
        { label: 'NINGUNO — Sin dolor vago o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
// tp1–tp20: filas de SINDROMES (Referido lumbar sin hipótesis: remite a la región Lumbar).
// tp21–tp35: filas de ORIENTATIVA. tp36: patrones pediátricos del nodo 5 (fila «Pediátricos»
// del pronóstico). Test final de cada una: ① gesto testigo y ② medida objetiva de la tarjeta.
export const hypotheses = {
  // ─── TOBILLO Y PIE ─────────────────────────────────────────
  tp1: {
    id: 'tp1', region: 'tobillo_pie', num: '①',
    name: 'Esguince Lateral Agudo (LPAA y LPC)',
    prom: 'FAAM o LEFS',
    dosis: 'Carga progresiva del miembro afectado con soporte externo (tobillera o vendaje) elegido según gravedad, fase de curación, dolor y preferencia del paciente (A). En los esguinces más graves, inmovilización (de tobillera semirrígida a yeso por debajo de la rodilla) como máximo 10 días (A). Programa estructurado de ejercicio terapéutico, en clínica y en casa: movilidad activa protegida, estiramientos, entrenamiento neuromuscular, reeducación postural y equilibrio (A). Terapia manual sin dolor junto al ejercicio: drenaje linfático, movilización de tejidos blandos y articular, deslizamiento anteroposterior del astrágalo (A). No usar ultrasonido (A). Para prevenir la recidiva: tobillera profiláctica y ejercicio propioceptivo y de equilibrio (A). La guía no fija series ni semanas: los programas estudiados son demasiado diversos para recomendar modalidad o volumen.',
    dosisFuente: 'Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación)',
    pronostico: {
      horizonte: 'Ottawa decide la radiografía. Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo.',
      derivacion: 'Una proporción alta evoluciona a inestabilidad crónica. Si no se recupera: coalición, osteocondritis disecante, sinovitis, pinzamiento posterior secundario, peroneos.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 238, 254–258, 260, 263 y 285'
    },
    tests: [
      { name: 'Reglas de Ottawa (si no carga)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si no carga: Ottawa antes de nada.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 255–256' },
      { name: 'LPAA: palpar y estirar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Priorizar LPAA (palpar y estirar: flexión plantar con inversión y rotación interna). Reproducir el dolor conocido indica lesión de ese ligamento.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255' },
      { name: 'LPC: palpar y estirar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'LPC (palpar y estirar: inversión del retropié con el tobillo en flexión dorsal). Reproducir el dolor conocido indica lesión de ese ligamento.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255' },
      { name: 'Cajón anterior (a los 4–6 días)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo. No puntúa: van Dijk 1996 (160 inversiones; referencia: cirugía o artrografía) da para la exploración diferida completa (día 5: hinchazón, hematoma, palpación y cajón) S 96 %, E 84 %, pero para el cajón solo el texto (S 86 %, E 74 %) no cuadra con su propia tabla, y lo que valida es rotura frente a ligamentos intactos, no esguince frente a otros diagnósticos.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255; van Dijk 1996 (J Bone Joint Surg Br 78-B(6))' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Estiramiento pasivo del LPAA o apoyo monopodal → EVA. ② Tiempo de apoyo monopodal descalzo sin dolor; cuando tolere carga, KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp2: {
    id: 'tp2', region: 'tobillo_pie', num: '②',
    name: 'Lesión de la Sindesmosis',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Si LTPAI y squeeze son positivos, hace falta imagen: la RM tiene una precisión de hasta el 95 %.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 263'
    },
    tests: [
      { name: 'Palpación del LTPAI', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 262; Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)' },
      { name: 'Squeeze test', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: Sman 2015 (RM de referencia) da S 26 %, E 88 %, LR+ 2,15 (IC 0,86–5,39); agrupado en Netterström-Wedin 2021 (4 estudios, 428 participantes), S 32 %, E 85 %, LR+ 3,16 (IC 0,95–10,49), LR− 0,77. Los dos intervalos de la LR+ cruzan el 1.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 262; Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Squeeze test o flexión dorsal en carga → EVA. ② KTW en cm frente al lado sano, cuando tolere la carga.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp3: {
    id: 'tp3', region: 'tobillo_pie', num: '③',
    name: 'Rotura del Aquiles',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.',
      derivacion: 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 245, 268, 273 y 280'
    },
    tests: [
      { name: 'Thompson (Simmonds)', sn: '96%', sp: '93%', lr_pos: '13.71', lr_neg: '0.04', criterio: 'Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente. Maffulli 1998: 133 roturas confirmadas en cirugía y 28 controles con lesión posterior sin rotura (26 negativos; 2 dudosos contados como falsos positivos). LR de Reiman 2014 con esos datos: LR+ 13,71 (IC 95 % 3,54–51,24), LR− 0,04 (0,02–0,10). Límite: la especificidad sale de solo 28 controles.', fuente: 'Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)' },
      { name: 'Hueco palpable', sn: '73%', sp: '89%', lr_pos: '6.64', lr_neg: '0.30', criterio: 'Hueco palpable, que se pierde con el tiempo. Maffulli 1998 (paciente despierto): S 73 %, E 89 %; LR de Reiman 2014: LR+ 6,64 (IC 95 % 2,32–19,91), LR− 0,30 (0,23–0,40). Es otro test que Thompson, pero en el mismo paciente: si los dos son positivos, el peso conjunto puede estar algo sobrestimado.', fuente: 'Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede: derivar. Tras el alta, el gesto que reproduce → EVA y ETM a tempo fijo frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp4: {
    id: 'tp4', region: 'tobillo_pie', num: '④',
    name: 'Lesión de Lisfranc',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.',
      derivacion: 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 245, 268, 273 y 280'
    },
    tests: [
      { name: 'Neurovascular y cinco P', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Neurovascular y cinco P. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272' },
      { name: 'Equimosis plantar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Equimosis plantar patognomónica (falta en esguinces aislados, tarda 24–48 h).', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272' },
      { name: 'Dolor en todo el ancho del mediopié', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en todo el ancho del mediopié.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272' },
      { name: '1.º y 2.º MT en direcciones opuestas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '1.º y 2.º MT en direcciones opuestas → dolor.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede en fase aguda: derivar. Tras el alta, despegue o ETM → EVA; ETM a tempo fijo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp5: {
    id: 'tp5', region: 'tobillo_pie', num: '⑤',
    name: 'Fracturas del Pie (5.º MT, Calcáneo)',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.',
      derivacion: 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 245, 268, 273 y 280'
    },
    tests: [
      { name: 'Reglas de Ottawa de tobillo y de pie', sn: null, sp: null, lr_pos: null, lr_neg: '0.21', criterio: 'TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).', fuente: 'Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)' },
      { name: '5.º MT: dolor en la base', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '5.º MT: dolor en la base en todos los tipos; en la espiral, a lo largo del hueso.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 280' },
      { name: 'Calcáneo: talón doloroso con equimosis', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Calcáneo: talón doloroso, hinchado, con equimosis.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 268' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede en fase aguda: derivar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp6: {
    id: 'tp6', region: 'tobillo_pie', num: '⑥',
    name: 'Luxación del Tibial Posterior',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Hinchazón y equimosis perimaleolar medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y equimosis perimaleolar medial.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 249' },
      { name: 'Resalte con la flexión dorsal y plantar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Se subluxa hacia delante con la flexión dorsal y se recoloca con la plantar.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 249' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión dorsal y plantar activa que provoca el resalte → EVA. ② Sin medida propia: derivar para confirmar.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp7: {
    id: 'tp7', region: 'tobillo_pie', num: '⑦',
    name: 'Pinzamiento Posterior del Tobillo',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía en flexión plantar en carga y RM; ningún hallazgo se correlaciona con los síntomas. La infiltración con anestésico confirma.',
      derivacion: 'Responde bien a conservador, técnica y retorno graduado. Si no responde a la infiltración o la recuperación se complica → replantear el diagnóstico.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 240–241'
    },
    tests: [
      { name: 'Test de pinzamiento posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido con la flexión plantar pasiva o el test de pinzamiento posterior (flexión plantar comprimiendo el calcáneo contra la tibia): confirma.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 239–240' },
      { name: 'Hinchazón y dolor por detrás del astrágalo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón a ambos lados del Aquiles; dolor por detrás del astrágalo.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 239' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Test de pinzamiento posterior o media punta en carga → EVA. ② ETM a tempo fijo hasta dolor o pérdida de técnica, frente al lado sano; o KTW en cm.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp8: {
    id: 'tp8', region: 'tobillo_pie', num: '⑧',
    name: 'Tendinopatía del Aquiles, Porción Media',
    prom: 'VISA-A',
    dosis: 'Ejercicio de carga del tendón (excéntrico, concéntrico, isométrico, isotónico o pliométrico), con la carga más alta que se tolere, como primera línea si no se presume fragilidad estructural del tendón (A); al menos 3 veces por semana a la intensidad más alta tolerada (E). Educación (enfoque de ciencia del dolor o patoanatómico) junto al ejercicio, presencial o por telesalud (B). No indicar reposo completo: seguir con las actividades dentro de la tolerancia al dolor (B). No usar láser de baja intensidad ni ultrasonido solo (C). El tipo de carga, la frecuencia (de 1 al día a 3 por semana), el número de sesiones y la duración (6 semanas a 6 meses) no parecen cambiar el resultado; mejoría esperable de 18–21 puntos en el VISA-A a las 12 semanas.',
    dosisFuente: 'Chimenti 2024, J Orthop Sports Phys Ther 54(12):CPG1–CPG32 (guía de práctica clínica APTA; letra = grado de la recomendación)',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 242 y 244'
    },
    tests: [
      { name: 'Batería progresiva de carga', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Aquiles: la palpación no ayuda al diagnóstico. No puntúa: la única cifra de estos gestos es de Hutchison 2013 (estudio piloto, 10 tendinopatías; en Reiman 2014): ETM monopodal S 22 %, E 93 %, LR+ 3,14; salto S 43 %, E 87 %, LR+ 3,31, sin intervalo de confianza publicado.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 243; Reiman 2014 (J Athl Train 49:820–9)' },
      { name: 'Descarga en el salto', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Vigilar las estrategias de descarga: suele aterrizar con el pie plano; pedirle que salte con el talón elevado aumenta el dolor.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 243' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Primer escalón de la batería que reproduce → EVA. ② Repeticiones de ETM monopodal a tempo fijo en el suelo, hasta dolor o fatiga, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp9: {
    id: 'tp9', region: 'tobillo_pie', num: '⑨',
    name: 'Tendinopatía Insercional del Aquiles',
    prom: 'VISA-A',
    dosis: 'Excéntrico de gemelo sin dorsiflexión: de pie y con la rodilla extendida, subir de puntillas con la pierna sana, pasar todo el peso a la afectada y bajar despacio el talón solo hasta el nivel del suelo, nunca por debajo (sin carga en dorsiflexión). 3 × 15, dos veces al día, 7 días por semana, 12 semanas. Se admite dolor durante el ejercicio; si deja de doler, añadir peso en una mochila. Si es bilateral, subir con una prensa de piernas, de pie sobre un cajón, para evitar la fase concéntrica. Avisar de que las 2 primeras semanas pueden doler más el gemelo y la inserción. Desde la 6.ª semana, vuelta lenta a la actividad previa. Resultado: 67 % satisfechos y de vuelta a su actividad (seguimiento medio de 4 meses), con el dolor en carga de 70 a 21 (EVA 0–100).',
    dosisFuente: 'Jonsson 2008, Br J Sports Med 42:746–749 (estudio piloto sin grupo control, n = 27, 34 tendones, diagnóstico con ecografía)',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 242 y 244'
    },
    tests: [
      { name: 'Dolor con carga y flexión dorsal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor con carga y flexión dorsal, menos en flexión plantar.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 242' },
      { name: 'Salto con el talón elevado frente a aterrizaje', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Menos dolor al saltar con el talón elevado, más al aterrizar con el talón abajo y la rodilla flexionada.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 243' },
      { name: 'ETM monopodal sobre plano inclinado', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'ETM monopodal sobre plano inclinado como provocación.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 243' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① ETM monopodal desde flexión dorsal en el borde de un step → EVA. ② Repeticiones de ETM monopodal a tempo fijo en suelo plano, hasta dolor o fatiga.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp10: {
    id: 'tp10', region: 'tobillo_pie', num: '⑩',
    name: 'Afectación de la Vaina del Aquiles',
    prom: 'VISA-A',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 242 y 244'
    },
    tests: [
      { name: 'Crepitación en flexión plantar y dorsal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Crepitación en la flexión plantar y dorsal; dolor más difuso.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 243' },
      { name: 'ETM en rango amplio', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Duelen las ETM (rango amplio); el salto puede doler menos.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 243' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión plantar y dorsal activas repetidas en prono sobre la camilla → EVA. ② Repeticiones de ETM monopodal en todo el rango, a tempo fijo, hasta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp11: {
    id: 'tp11', region: 'tobillo_pie', num: '⑪',
    name: 'Tendinopatía del Plantar Delgado',
    prom: 'VISA-A',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.',
      derivacion: 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 242 y 244'
    },
    tests: [
      { name: 'ETM sobre un step en todo el rango', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor con la ETM desde flexión dorsal completa hasta flexión plantar completa sobre un step.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 237' },
      { name: 'Marcha descalzo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor medial del Aquiles caminando descalzo.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 244' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① ETM monopodal sobre un step desde flexión dorsal completa → EVA. ② Repeticiones de ETM monopodal a tempo fijo en suelo plano, hasta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp12: {
    id: 'tp12', region: 'tobillo_pie', num: '⑫',
    name: 'Neuropatía del Nervio Sural',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Sural: diagnóstico clínico; la neurodinámica reproduce el dolor y la carga del tendón rara vez lo aumenta; una provocación del dolor aleatoria obliga a pensar en otro diagnóstico. Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.',
      derivacion: 'Sural: puede ir solo o con dolor del Aquiles o de su vaina, y un tendón hinchado lo irrita. Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 243–244, 251–252 y 268'
    },
    tests: [
      { name: 'Tinel a lo largo del sural', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel a lo largo del sural.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 237' },
      { name: 'Palpación en prono con flexión dorsal pasiva', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpación en prono con flexión dorsal pasiva: una diferencia entre lados, con el perfil clínico, hace sospechar.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 244' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Prueba neurodinámica con sesgo del sural → EVA. ② Grados de flexión dorsal (o de la articulación de la prueba) hasta los síntomas, misma posición.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp13: {
    id: 'tp13', region: 'tobillo_pie', num: '⑬',
    name: 'Bursitis Calcánea Superficial',
    prom: 'FAAM o LEFS',
    dosis: '',
    tests: [
      { name: 'Dolor superficial e hinchazón a la presión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor superficial e hinchazón en el talón posterior que aumentan con la presión.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 246' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Presión sobre la bursa o contrafuerte del zapato → EVA. ② Sin medida de capacidad: no depende de la carga. Basta ①.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp14: {
    id: 'tp14', region: 'tobillo_pie', num: '⑭',
    name: 'Tendinopatía del Tibial Posterior',
    prom: 'FAAM o LEFS',
    dosis: 'Estadios I–II. Plantillas a medida durante el 90 % de las horas de vigilia y estiramiento de gemelo (rodilla extendida) y sóleo (rodilla algo flexionada) sobre una cuña, 3 × 30 s cada uno, 2 veces al día. Además, ejercicio resistido del tibial posterior con plantillas y calzado puestos: aducción horizontal del pie con flexión plantar, excéntrico (el que más mejoró) o concéntrico, 5 s por repetición, 3 × 15 dos veces al día, con 1–2 min de descanso entre series; empezar con 0,9 kg y subir de 0,9 kg en 0,9 kg cuando las 45 repeticiones salgan con facilidad, buen control y mínimos o ningún síntoma. 12 semanas, con una revisión semanal de 30 min. Los tres grupos mejoraron; el excéntrico redujo más el dolor y la discapacidad (FFI; diferencias entre grupos P = 0,036–0,048). El estudio usó un aparato de resistencia constante específico: con otra resistencia (p. ej., goma elástica) la pauta no está comprobada.',
    dosisFuente: 'Kulig 2009, Phys Ther 89(1):26–37 (ensayo aleatorizado, n = 36: plantillas + estiramiento, con o sin ejercicio concéntrico o excéntrico)',
    pronostico: {
      horizonte: 'Ecografía (tendón frente a peritendón); RM para complicaciones. La imagen no se correlaciona necesariamente con los síntomas.',
      derivacion: 'Puede progresar a rotura y pie plano adquirido: no hace ETM + «demasiados dedos» → derivar.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 248–249; Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Dolor retromaleolar medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor por detrás y por debajo del maléolo medial.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 248' },
      { name: 'Inversión resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido y debilidad relativa en la inversión resistida.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 248' },
      { name: 'ETM: el retropié no va a varo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'ETM: el retropié no va a varo; en fases avanzadas no inicia.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 248' },
      { name: '«Demasiados dedos»', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '«Demasiados dedos».', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 249' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① ETM monopodal (inicio del despegue) o inversión resistida → EVA. ② Repeticiones de ETM monopodal a tempo fijo con el retropié a varo, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp15: {
    id: 'tp15', region: 'tobillo_pie', num: '⑮',
    name: 'Tendinopatía del Flexor Largo del Primer Dedo (FHL)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Ecografía dinámica de elección; sus hallazgos son frecuentes sin síntomas.',
      derivacion: 'Crónico: tenosinovitis estenosante. No flexiona la interfalángica → rotura: derivar.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 250–251; Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)'
    },
    tests: [
      { name: 'Flexoextensión del primer dedo en flexión plantar completa', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión dorsal y plantar activas del primer dedo con el tobillo en flexión plantar completa: reproduce.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 250' },
      { name: 'Crepitación e hinchazón en la vaina', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Crepitación e hinchazón en la vaina, posteromedial.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 250' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexoextensión activa del primer dedo con el tobillo en flexión plantar completa → EVA. ② Repeticiones de ETM monopodal a tempo fijo hasta el dolor, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp16: {
    id: 'tp16', region: 'tobillo_pie', num: '⑯',
    name: 'Síndrome del Túnel del Tarso',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Sural: diagnóstico clínico; la neurodinámica reproduce el dolor y la carga del tendón rara vez lo aumenta; una provocación del dolor aleatoria obliga a pensar en otro diagnóstico. Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.',
      derivacion: 'Sural: puede ir solo o con dolor del Aquiles o de su vaina, y un tendón hinchado lo irrita. Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 243–244, 251–252 y 268'
    },
    tests: [
      { name: 'Tinel a lo largo del túnel', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel a lo largo del túnel.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 252' },
      { name: 'Hinchazón en el túnel o la subastragalina posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón en el túnel o en la subastragalina posterior, proximal al sustentaculum tali.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 252' },
      { name: 'Explorar el FHL', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Explorar el FHL, que puede ser la fuente.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 252' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Tinel o la posición que reproduce → EVA. ② Grados de flexión dorsal con eversión hasta los síntomas, misma posición.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp17: {
    id: 'tp17', region: 'tobillo_pie', num: '⑰',
    name: 'Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo)',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.',
      derivacion: '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 252–253'
    },
    tests: [
      { name: 'Dolor óseo a la palpación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor óseo a la palpación; puede haber derrame.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 253' },
      { name: 'Calcáneo: compresión medial y lateral a la vez', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Calcáneo: compresión medial y lateral a la vez.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 253' },
      { name: 'Astrágalo: hinchazón en el seno del tarso o posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Astrágalo: hinchazón en el seno del tarso o posterior.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 253' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Carga monopodal o marcha → EVA. Sin saltos ni series. ② Minutos de marcha en cinta sin dolor, a velocidad e inclinación fijas.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp18: {
    id: 'tp18', region: 'tobillo_pie', num: '⑱',
    name: 'Síndrome del Seno del Tarso',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.',
      derivacion: 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 257–259 y 263'
    },
    tests: [
      { name: 'Palpación del seno del tarso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido a la palpación del seno del tarso', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 257' },
      { name: 'Estrés en inversión de la subastragalina o KTW con pronación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'a menudo también con el estrés en inversión de la subastragalina o el KTW con pronación excesiva.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 257' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Palpación del seno del tarso o KTW con pronación → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp19: {
    id: 'tp19', region: 'tobillo_pie', num: '⑲',
    name: 'Tendinopatía de los Peroneos',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico sobre todo clínico; RM o ecografía si hace falta.',
      derivacion: 'Tras esguince grave o fractura, una rotura aguda puede pasar desapercibida porque la función se conserva: con sospecha alta, imagen.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 258'
    },
    tests: [
      { name: 'Dolor retromaleolar lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor localizado sobre los tendones por detrás del maléolo lateral.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 258' },
      { name: 'Subluxación de los peroneos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Posible subluxación por encima y por delante del maléolo.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 254 y 258' },
      { name: 'Crepitación e hinchazón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Crepitación e hinchazón si hay peritendón.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 258' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Eversión resistida o el gesto en carga que reproduce → EVA. ② Repeticiones de ETM monopodal a tempo fijo, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp20: {
    id: 'tp20', region: 'tobillo_pie', num: '⑳',
    name: 'Pinzamiento Anterior del Tobillo',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.',
      derivacion: 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 257–259 y 263'
    },
    tests: [
      { name: 'KTW', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El KTW reproduce el dolor y muestra limitación.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 259' },
      { name: 'Palpación anterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y palpación dolorosa y engrosada: interlínea anterior, astragaloescafoidea, seno del tarso, LTPAI, LPAA.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 259' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Zancada o KTW en carga → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' },
      // Test añadido (no está en la tarjeta), al final de tests[] para no desplazar resultados guardados.
      { name: 'Signo de pinzamiento de Molloy', sn: '94.8%', sp: '88%', lr_pos: null, lr_neg: null, criterio: 'Pulgar sobre la gotera anterolateral con el pie en flexión plantar y, sin soltar, llevar a flexión dorsal completa. Positivo si la maniobra combinada provoca dolor o aumenta el que daba la presión sola. Molloy 2003, 73 pacientes con artroscopia: 37 verdaderos positivos, 4 falsos positivos (adherencias, artrosis), 2 falsos negativos, 30 verdaderos negativos → S 94,8 %, E 88 % (LR calculadas). Límites: todos ya iban a artroscopia (sin inestabilidad mecánica), el mismo cirujano exploraba y decidía operar, y valida el pinzamiento sinovial anterolateral, no el óseo.', fuente: 'Molloy 2003 (J Bone Joint Surg Br 85-B(3))' }
    ]
  },
  tp21: {
    id: 'tp21', region: 'tobillo_pie', num: '㉑',
    name: 'Inestabilidad Crónica del Tobillo',
    prom: 'CAIT o IdFAI',
    dosis: 'Ejercicio propioceptivo y neuromuscular para la estabilidad postural dinámica y la estabilidad percibida (A). Terapia manual —movilizaciones graduadas, manipulación y movilización con movimiento en carga y sin carga— para la dorsiflexión en carga y el equilibrio dinámico a corto plazo (A); se puede combinar con el ejercicio (B). Tobillera o vendaje nunca como tratamiento único (B). La guía no fija dosis. Orientativo (metaanálisis de 26 ensayos, análisis de subgrupos exploratorio, certeza de muy baja a moderada): terapia manual 1–2 veces por semana durante 4 semanas o menos para el CAIT; entrenamiento multimodal 1–2 veces por semana durante 5–8 semanas para el FAAM. Protocolo concreto con ensayo (McKeon 2008, adultos jóvenes): 12 sesiones supervisadas de unos 20 min, 3 por semana durante 4 semanas: saltos a estabilización monopodal en 4 direcciones (10 por dirección), salto con alcance (5), saltos no anticipados siguiendo una secuencia, y equilibrio monopodal con ojos abiertos y cerrados. 7 niveles por tarea (saltos de 46, 69 y 91 cm, primero con ayuda de los brazos y luego con las manos en la cadera; al final, desde una plataforma de 15 cm); se sube de nivel tras 10 repeticiones sin error (5 en el salto con alcance). Mejoró la función autorreferida (FADI) y el equilibrio frente a no entrenar.',
    dosisFuente: 'Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)',
    pronostico: {
      horizonte: 'CAIT menos de 24, o IdFAI más de 11: indican inestabilidad crónica (cuestionarios aparte de los tres números).',
      derivacion: 'Valorar deficiencias mecánicas y sensoriomotoras: guían el tratamiento.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 261'
    },
    tests: [
      { name: 'Hinchazón articular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón articular.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 260' },
      { name: 'Cajón anterior: signo del surco', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Laxitud tibioastragalina (signo del surco en el cajón anterior → rotura completa del LPAA probable)', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 261' },
      { name: 'Laxitud subastragalina', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'subastragalina (inversión excesiva del retropié frente al lado sano).', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 261' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto que provoca aprensión o fallo → EVA; si no hay dolor, fallos por semana. ② Tiempo de apoyo monopodal descalzo, ojos abiertos, sin manos, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp22: {
    id: 'tp22', region: 'tobillo_pie', num: '㉒',
    name: 'Sinovitis Postraumática',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.',
      derivacion: 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 257–259 y 263'
    },
    tests: [
      { name: 'Hinchazón y dolor a la palpación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y dolor a la palpación.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 260' },
      { name: 'Laxitud del LPAA y del LPC', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede haber laxitud del LPAA y del LPC.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 260' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto en carga que reproduce (zancada, apoyo monopodal) → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp23: {
    id: 'tp23', region: 'tobillo_pie', num: '㉓',
    name: 'Coalición Tarsiana',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Coalición: radiografía oblicua a 45°; la TC es poco sensible a las no óseas. Osteocondritis: hasta un tercio de las radiografías son normales al principio → RM.',
      derivacion: 'La coalición suele ser asintomática hasta una lesión (12,7 % en disección, relevancia incierta).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 263 y 285'
    },
    tests: [
      { name: 'Movilidad subastragalina y mediotarsiana', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Restricción de la movilidad subastragalina, a menudo también mediotarsiana.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 263' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Inversión y eversión del retropié, o el gesto en carga que reproduce → EVA. ② Grados de inversión y eversión del retropié frente al lado sano, misma posición.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp24: {
    id: 'tp24', region: 'tobillo_pie', num: '㉔',
    name: 'Artrosis de Tobillo o Pie',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Diagnóstico clínico: más de 45 años, dolor con el uso, rigidez de menos de 30 min. La radiografía no se correlaciona de forma fiable.',
      derivacion: 'En jóvenes o con rasgos inflamatorios, progresión rápida o síntomas constitucionales → más pruebas; VSG y PCR deben ser normales.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 264'
    },
    tests: [
      { name: 'Perfil clínico', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diagnóstico clínico: más de 45 años, dolor con el uso, rigidez de menos de 30 min.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 264' },
      { name: 'Palpación de la interlínea', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la interlínea; según la evolución, rango limitado, derrame, deformidad, debilidad; tumefacción ósea periarticular.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 260 y 264' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Bajar un escalón o zancada → EVA. ② KTW en cm, o grados de flexión dorsal de la 1.ª MTF si es la afectada.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp25: {
    id: 'tp25', region: 'tobillo_pie', num: '㉕',
    name: 'Osteocondritis Disecante del Astrágalo',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Coalición: radiografía oblicua a 45°; la TC es poco sensible a las no óseas. Osteocondritis: hasta un tercio de las radiografías son normales al principio → RM.',
      derivacion: 'La coalición suele ser asintomática hasta una lesión (12,7 % en disección, relevancia incierta).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 263 y 285'
    },
    tests: [
      { name: 'Palpación de la cúpula astragalina en flexión plantar', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la cara anterior de la cúpula astragalina con el pie en flexión plantar completa.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 285' },
      { name: 'Hinchazón, derrame, crepitación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón, derrame, crepitación.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 285' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto de impacto o carga que reproduce → EVA. ② KTW en cm frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp26: {
    id: 'tp26', region: 'tobillo_pie', num: '㉖',
    name: 'Dolor Plantar Crónico del Talón',
    prom: 'FAAM o LEFS',
    dosis: 'Núcleo (A): estiramiento específico de la fascia plantar y del gastrocnemio-sóleo; terapia manual articular (sobre todo la dorsiflexión talocrural) y de tejidos blandos (fascia plantar, gastrocnemio y sóleo); vendaje rígido o elástico con otros tratamientos, efecto a corto plazo (1 a 6 semanas); férula nocturna durante 1–3 meses si hay dolor constante en los primeros pasos de la mañana. Además: ejercicio de fuerza de la musculatura del pie y el tobillo (B); punción seca de puntos gatillo en gastrocnemio, sóleo y musculatura plantar, 1–6 sesiones (B); láser de baja intensidad en 2–3 puntos, mínimo 2 J/punto a 904 nm o 4 J/punto a 780–860 nm (B); plantillas solo combinadas con otros tratamientos, nunca solas (C). No usar ultrasonido para potenciar el estiramiento (A). La dosis del estiramiento no está establecida (estudios de 10 s a 60 min, de 4 días a 8 semanas).',
    dosisFuente: 'Koc 2023, J Orthop Sports Phys Ther 53(12):CPG1–CPG39 (guía de práctica clínica APTA; letra = grado de la recomendación)',
    pronostico: {
      horizonte: 'Imagen innecesaria si la clínica encaja; ecografía para la fasciopatía. El espolón no se relaciona con el dolor.',
      derivacion: 'Atrapamiento nervioso coexistente en el 20–52 %: valorar el componente neural si no mejora.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 266–267'
    },
    tests: [
      { name: 'Palpación de la tuberosidad medial del calcáneo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor conocido a la palpación de la inserción de la fascia en la tuberosidad medial del calcáneo.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265–266' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Primeros pasos tras estar sentado, o palpación de la tuberosidad → EVA. ② Minutos de marcha en cinta sin aumento del dolor, velocidad fija; o ETM a tempo fijo.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp27: {
    id: 'tp27', region: 'tobillo_pie', num: '㉗',
    name: 'Síndrome de la Almohadilla Grasa del Talón',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Imagen innecesaria si la clínica encaja; ecografía para la fasciopatía. El espolón no se relaciona con el dolor.',
      derivacion: 'Atrapamiento nervioso coexistente en el 20–52 %: valorar el componente neural si no mejora.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 266–267'
    },
    tests: [
      { name: 'Palpación posterolateral del talón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la región posterolateral del talón.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265–266' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Apoyo del talón en la marcha o palpación posterolateral → EVA. ② Minutos de marcha en cinta sin dolor, velocidad fija.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp28: {
    id: 'tp28', region: 'tobillo_pie', num: '㉘',
    name: 'Atrapamiento Nervioso del Talón',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Sural: diagnóstico clínico; la neurodinámica reproduce el dolor y la carga del tendón rara vez lo aumenta; una provocación del dolor aleatoria obliga a pensar en otro diagnóstico. Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.',
      derivacion: 'Sural: puede ir solo o con dolor del Aquiles o de su vaina, y un tendón hinchado lo irrita. Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 243–244, 251–252 y 268'
    },
    tests: [
      { name: 'Tinel sobre el nervio calcáneo medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel justo proximal al origen de la fascia en la tuberosidad medial, o a lo largo del nervio calcáneo medial.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265 y 267' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Tinel o la carga que reproduce → EVA. ② Minutos de marcha en cinta hasta los síntomas, velocidad fija.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp29: {
    id: 'tp29', region: 'tobillo_pie', num: '㉙',
    name: 'Lesión Calcaneocuboidea y Cubometatarsiana',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.',
      derivacion: '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 271, 276–278 y 281'
    },
    tests: [
      { name: 'Aguda: palpación calcaneocuboidea', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aguda: dolor en calcaneocuboidea dorsal, ligamento bifurcado, apófisis anterior del calcáneo o ligamentos cubometatarsianos.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 270' },
      { name: 'Gradual: interlíneas del cuboides', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Gradual: dolor en las interlíneas del cuboides hacia las bases del 4.º–5.º MT.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 270' },
      { name: 'Carga del antepié e inicio de la ETM', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Caminar, cargar el antepié y el inicio de la ETM dan dolor agudo.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 270' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Inicio de la ETM, o presión plantar sobre el cuboides → EVA. ② Repeticiones de ETM monopodal a tempo fijo hasta el dolor, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp30: {
    id: 'tp30', region: 'tobillo_pie', num: '㉚',
    name: 'Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas)',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.',
      derivacion: '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 252–253 y 271–272'
    },
    tests: [
      { name: 'Punto N', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Punto N doloroso frente al lado sano: navicular hasta que se demuestre lo contrario.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 253' },
      { name: 'Dolor puntual sobre cuboides o cuñas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor puntual sobre cuboides o cuñas.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Marcha o carga monopodal → EVA. Sin saltos. ② Minutos de marcha en cinta sin dolor, velocidad e inclinación fijas.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp31: {
    id: 'tp31', region: 'tobillo_pie', num: '㉛',
    name: 'Lesión de la 1.ª Metatarsofalángica',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.',
      derivacion: '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 271, 276–278 y 281'
    },
    tests: [
      { name: 'Equimosis e hinchazón en la interlínea', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dirigida por la historia. Equimosis tras esguince o fractura; hinchazón en la interlínea.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 276' },
      { name: 'Rango de la 1.ª MTF frente al lado sano', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rango frente al lado sano (flexión dorsal normal ≈60°; danza y gimnasia hasta 90°).', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 277' },
      { name: 'Dolor sobre los sesamoideos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor sobre los sesamoideos.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 277' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión dorsal de la 1.ª MTF en carga (media punta, despegue) → EVA. ② Grados de flexión dorsal pasiva de la 1.ª MTF con goniómetro, primer radio estabilizado, frente al lado sano.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp32: {
    id: 'tp32', region: 'tobillo_pie', num: '㉜',
    name: 'Dolor en la Base del 2.º Metatarsiano',
    prom: 'FAAM o LEFS',
    dosis: '',
    tests: [
      { name: 'Palpación de la base del 2.º MT y de Lisfranc', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la base del 2.º MT y de la articulación de Lisfranc. Mediotarsiana posiblemente rígida.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 278' },
      { name: 'Estrés frente a sinovitis', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Estrés o fractura de estrés de la base del 2.º MT: dolor nocturno, sin efecto de calentamiento. Sinovitis: sin dolor nocturno, con efecto de calentamiento.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 278–279' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Media punta, o palpación de la base del 2.º MT → EVA. ② Repeticiones de ETM monopodal a tempo fijo hasta el dolor.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp33: {
    id: 'tp33', region: 'tobillo_pie', num: '㉝',
    name: 'Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.',
      derivacion: '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 252 y 279'
    },
    tests: [
      { name: 'Dolor puntual sobre el cuello', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor puntual sobre el cuello.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 279' },
      { name: 'Carga axial del MT', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La carga axial del MT provoca dolor en la lesión ósea, menos en la de partes blandas.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 279' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Marcha o carga del antepié → EVA. ② Minutos de marcha en cinta sin dolor, velocidad fija.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp34: {
    id: 'tp34', region: 'tobillo_pie', num: '㉞',
    name: 'Neuroma de Morton o Bursitis Intermetatarsiana',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.',
      derivacion: '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 271, 276–278 y 281'
    },
    tests: [
      { name: 'Palpación del espacio con compresión de los metatarsianos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos. No puntúa: la compresión pulgar-índice del espacio (Mahadevan 2015) tiene S 96 %, pero su especificidad sale de un solo pie sin Morton; el chasquido de Mulder da LR+ 2,19 (IC 0,45–10,60; Dando, en Pitcher 2024).', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))' },
      { name: 'Diferencial del antepié', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Morton frente a metatarsalgia (callosidad, colapso del arco), Freiberg (14–18 años, cabeza del MT) y estrés de MT (dolor más dorsal).', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 281' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Palpación del espacio con compresión transversal → EVA. ② Minutos de marcha en cinta hasta los síntomas, mismo calzado y velocidad.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp35: {
    id: 'tp35', region: 'tobillo_pie', num: '㉟',
    name: 'Gota',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Articulación roja, hinchada y muy dolorosa', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Articulación roja, hinchada, muy dolorosa al tacto y al movimiento; puede parecer una dactilitis.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 281' },
      { name: 'Suele estar sistémicamente bien', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Suele estar sistémicamente bien, aunque un brote agudo puede dar fiebre y leucocitosis y confundirse con una artritis séptica: solo el líquido articular las separa. Tofos en la gota de larga evolución.', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Menon y Rednam 2026 (StatPearls, «Gout»)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① y ② No procede en la crisis: derivar para confirmar. Con fiebre y malestar → artritis infecciosa: urgencia.', fuente: 'Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)' }
    ]
  },
  tp36: {
    id: 'tp36', region: 'tobillo_pie', num: '㊱',
    name: 'Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg)',
    prom: 'FAAM o LEFS',
    dosis: '',
    pronostico: {
      horizonte: 'Apofisitis: imagen rara vez necesaria. Köhler y Freiberg: radiografía característica (mirar el otro pie en Köhler).',
      derivacion: 'Las apofisitis suelen resolverse en 6–12 meses, a veces hasta 2 años. Osteoma osteoide sin alivio por AINE → otras causas.',
      fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 284–287'
    },
    tests: [
      { name: 'Sever: inserción del Aquiles (8–12 años)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Inserción del Aquiles (8–12 años) → SEVER', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 286' },
      { name: 'Iselin: base del 5.º MT (8–13 años)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'base del 5.º MT (8–13) → ISELIN', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 286' },
      { name: 'Navicular: apofisitis del tibial posterior o Köhler', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'navicular → APOFISITIS DEL TIBIAL POSTERIOR o KÖHLER (menores de 10, cojera)', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 284 y 286' },
      { name: 'Freiberg: cabeza del 2.º–4.º MT (14–18 años)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'cabeza del 2.º–4.º MT (14–18) → FREIBERG', fuente: 'Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 284' }
    ]
  },
  tp37: {
    id: 'tp37', region: 'tobillo_pie', num: '㊲',
    name: 'Fractura de Tobillo (Maleolar)',
    prom: 'FAAM o LEFS',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Radiografía si la regla de Ottawa de tobillo es positiva. El 70 % son unimaleolares; van desde una torsión banal en personas frágiles hasta traumatismos de alta energía en jóvenes.',
      derivacion: 'Valorar el riesgo de TVP en toda fractura de tobillo. Alta energía → vigilar síndrome compartimental de la pierna. Con diabetes o neuropatía, una fractura de tobillo puede evolucionar a pie de Charcot.',
      fuente: 'Hermena y Slane 2025 (StatPearls, «Ankle Fracture»); NICE NG19, rec. 1.7.1'
    },
    tests: [
      { name: 'Regla de Ottawa de tobillo', sn: null, sp: null, lr_pos: null, lr_neg: '0.08', criterio: 'Radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. Solo descarta: aplicando solo la regla del tobillo, Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 (IC 95 % 0,03–0,18). El positivo es un hallazgo: la regla es muy sensible y poco específica. Excluidas embarazadas y personas que no pueden seguir la prueba.', fuente: 'Bachmann 2003 (BMJ 326:417); Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 256–257' },
      { name: 'No carga cuatro pasos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'No poder cargar cuatro pasos, justo tras la lesión y en consulta, indica una lesión más grave.', fuente: 'Hermena y Slane 2025 (StatPearls, «Ankle Fracture»); Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255' },
      { name: 'Palpar el peroné hasta la rodilla', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en el peroné proximal: posible fractura de Maisonneuve.', fuente: 'Bergman 2025 (StatPearls, «Acute Ankle Sprain»)' },
      { name: 'Estado neurovascular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pulsos pedio y tibial posterior. Un pie pálido y frío indica un compromiso vascular crítico.', fuente: 'Hermena y Slane 2025 (StatPearls, «Ankle Fracture»)' }
    ]
  }
};
