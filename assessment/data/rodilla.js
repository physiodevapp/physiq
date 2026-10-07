// ============================================================
// PhysiQ-Assessment · data/rodilla.js
// Contenido clínico de la región RODILLA: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_POSQUIRURGICO, SIS_ENDOCRINO, SIS_HEMATOLOGICO, DOSIS_DERIVAR } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.rodilla
export const screening = {
  label: 'Cuadrante Inferior — Rodilla',
  // Recuadro de urgencia: literal de la tarjeta de consulta rodilla (guía de consulta, URGENCIA)
  urgencia: {
    titulo: 'URGENCIAS · TVP · ARTRITIS SÉPTICA · APARATO EXTENSOR · BURSA CON FIEBRE · NEUROVASCULAR',
    lineas: [
      'TVP: no identificarla puede llevar a embolia pulmonar, que ocurre en más de un tercio de los casos. Dolor intenso e inexplicado, calambre en el hueco poplíteo, calor o hinchazón. Derivar a quien pueda excluirla.',
      'ARTRITIS SÉPTICA: rodilla caliente, roja y con derrame a tensión. Dolor intenso en todo el arco, incluso en recorridos mínimos. Fiebre, malestar general, incapacidad para cargar. Factores: infiltración o cirugía articular reciente, prótesis, inmunodepresión, diabetes, AR, infección cutánea, drogas parenterales. Puede coexistir con artrosis o gota y despistar. Ningún signo aislado es bastante sensible para descartarla → URGENCIA HOSPITALARIA HOY.',
      'ROTURA DEL APARATO EXTENSOR: la regla de Ottawa NO lo detecta. Carga excéntrica brusca sobre la rodilla flexionada o caída, con chasquido y caída inmediata. NO puede elevar la pierna extendida ni mantener la rodilla extendida contra gravedad. Escalón palpable por encima de la rótula (cuádriceps) o por debajo (rotuliano); hemartrosis; rótula alta o baja. La elevación de la pierna extendida es prueba aparte y obligatoria en toda rodilla traumática con dolor anterior. Reparación precoz (2 primeras semanas) → mejores resultados.',
      'Bursitis prerrotuliana séptica: la FIEBRE >37,7 °C solo se ha descrito en la séptica. Derivación el mismo día. · Compromiso neurovascular tras traumatismo: cambios de temperatura, adormecimiento, parestesias o debilidad tras fractura de meseta o luxación → pulsos distales, cribado neurológico e índice tobillo-brazo.',
      'REGLA DE OTTAWA, antes de explorar cualquier rodilla con traumatismo agudo → radiografía si hay ALGUNO de los cinco, por separado: ≥55 años · dolor a la palpación de la cabeza del peroné · dolor aislado a la palpación de la rótula · no flexiona hasta 90° · no carga cuatro pasos, ni justo tras la lesión ni ahora, aunque sea cojeando. S 98–100 %, E ≈50 %: sirve para descartar, no para confirmar. Excluida si la lesión tiene más de 7 días.'
    ]
  },
  sistemas: [
    SIS_POSQUIRURGICO,   // solo con mecanismo Post-quirúrgico (docs/posquirurgico.md)
    {
      id: 'ro_vascular', icon: '🩸', nombre: 'Vascular',
      banderasRojas: [
        'Claudicación: dolor que aparece al caminar y cede al detenerse',
        'Calambres nocturnos en pantorrilla que interrumpen el sueño',
        'Signos de TVP: edema asimétrico, calor, eritema y sensibilidad en pantorrilla',
        // Tarjeta rodilla (guía de consulta), BANDERAS «TVP · Wells con puntuación» y «Pseudotromboflebitis por quiste poplíteo»
        'TVP · Wells con puntuación: +1 cada uno: cáncer activo (tratamiento en 6 meses o paliativo) · parálisis, paresia o inmovilización con férula · encamamiento ≥3 días o cirugía mayor en 12 SEMANAS · dolor en el trayecto venoso profundo · hinchazón de toda la pierna · pantorrilla >3 cm más gruesa, medida 10 cm bajo la tuberosidad tibial · edema con fóvea solo en la pierna sintomática · venas colaterales no varicosas · TVP previa documentada. −2: hay un diagnóstico alternativo al menos tan probable como la TVP. 2 o más → TVP probable; 1 o menos → improbable. El capítulo lista el ítem que resta junto a los demás y sobreestima. Orienta la derivación, no la sustituye.',
        'Pseudotromboflebitis por quiste poplíteo: dolor o hinchazón en la pantorrilla y signo de Homans positivo en un quiste grande, disecado o roto. El quiste también puede causar síndrome compartimental y neuropatías por compresión. Clínicamente no se puede separar de una tromboflebitis real: derivar. La ecografía es la primera opción para diferenciar quiste de TVP.'
      ],
      banderasAmarillas: ['Dolor en reposo que mejora al colgar la pierna fuera de la cama'],
      preguntas: [
        { id: 'r_v1', text: '¿El dolor aparece tras caminar unos minutos y cede casi de inmediato al parar (claudicación)?', alerta: true,
          razonamiento: {
            porque: 'Si una arteria de la pierna está estrechada, el riego basta en reposo pero no cuando el músculo trabaja: tras caminar unos minutos aparece dolor o calambre en la pantorrilla, y al parar el aporte vuelve a cubrir el consumo y el dolor cede. En la rodilla interesa porque la oclusión más frecuente, la de la arteria femoral superficial, da dolor en la pantorrilla que a veces sube al hueco poplíteo.',
            peso: 'Es el síntoma típico de la enfermedad arterial periférica: aparece tras una distancia o un esfuerzo fijos, de forma reproducible, y cede en pocos minutos de pie quieto o sentado (Goodman, Zemaitis). Ante la sospecha, NICE pide preguntar por la claudicación, mirar piernas y pies, palpar los pulsos femoral, poplíteo y del pie y medir el índice tobillo-brazo. No es una urgencia, salvo que el dolor aparezca de golpe en reposo o la claudicación empeore bruscamente, que Goodman pide comunicar al médico de inmediato. En un deportista joven sin factores de riesgo, el mismo cuadro puede ser un atrapamiento de la arteria poplítea.',
            detalle: 'Quién: tabaco (el factor modificable más importante; multiplica por cuatro el riesgo), diabetes, 65 años o más, hipertensión, colesterol, enfermedad renal crónica, obesidad, sedentarismo y antecedentes familiares de enfermedad vascular (Zemaitis). Afecta casi por igual a hombres y mujeres de más de 40 años, y a hasta un 20 % de los mayores de 70.\n\nDónde duele: depende del nivel de la estenosis. La aortoilíaca da dolor en nalgas y muslos; la femoropoplítea, la más frecuente, en la pantorrilla (Zemaitis). Goodman: la oclusión de la femoral superficial entre la ingle y la rodilla está en dos tercios de los casos; el pulso femoral es normal y los de la rodilla y el pie faltan. La claudicación es constante y reproducible: quien un día no puede cruzar la casa y al siguiente camina sin límite no tiene claudicación vascular.\n\nSignos: pulsos débiles o ausentes, relleno capilar lento, piel fría y pálida, pérdida de vello, uñas que crecen mal (Zemaitis, Goodman). Índice tobillo-brazo de 0,90 o menos = enfermedad arterial (0,70–0,90 leve; 0,50–0,70 moderada; menos de 0,50 grave); en diabéticos, un índice normal o alto no la descarta (NICE). Solo un 1–3 % de los claudicantes al año progresa a isquemia crítica (Zemaitis).\n\nCon qué se confunde: la claudicación neurógena por estenosis de canal duele y quema en espalda, nalgas y piernas, alivia al sentarse o inclinarse hacia delante, empeora cuesta abajo y tiene pulsos normales (Goodman, tabla 16.5). En el joven: síndrome compartimental crónico de esfuerzo, síndrome de estrés tibial, fracturas de estrés y atrapamientos nerviosos (Davis y Shaw).\n\nAtrapamiento de la arteria poplítea (Davis y Shaw): anomalía del desarrollo en la que el gemelo interno, una banda fibrosa o el poplíteo comprimen la arteria; 85 % varones, cerca del 60 % deportistas jóvenes en la tercera década, sin factores de riesgo; bilateral en un 30 %. Claudicación de pie y pantorrilla tras el ejercicio, a veces con hormigueo, palidez o frialdad; los pulsos del pie disminuyen o desaparecen con la flexión plantar activa o la dorsal pasiva. Sin tratamiento puede acabar en estenosis o trombosis de la poplítea y embolias distales.',
            fisiologia: {
              pasos: [
                'La placa de aterosclerosis crece en la pared de la arteria; al principio la arteria se dilata para conservar el calibre, hasta que ya no puede y la luz se estrecha.',
                'La sangre se desvía por arterias colaterales más pequeñas, que mantienen el riego en reposo pero nunca llevan tanto caudal como la arteria principal.',
                'Al caminar, los músculos de la pantorrilla necesitan más sangre; llega un punto en que las colaterales ya dan todo lo que pueden.',
                'El desajuste entre aporte y demanda deja el músculo en isquemia transitoria: se acumulan productos del metabolismo sin oxígeno, y por eso el dolor llega con unos minutos de retraso respecto al inicio de la marcha.',
                'Al parar, la demanda baja, el aporte se pone al día y el dolor cede en pocos minutos.'
              ],
              metafora: 'Como una carretera con un carril cortado: con poco tráfico se circula bien, pero en hora punta se forma el atasco, que se deshace en cuanto baja el tráfico.'
            },
            fuentes: ['Goodman 2018', 'Zemaitis 2026', 'NICE CG147', 'Davis y Shaw 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 120; cap. 6, pp. 228 y 254–255; cap. 16, pp. 623 y 636.',
              { texto: 'Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/' },
              { texto: 'NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.1–1.3.4.', url: 'https://www.nice.org.uk/guidance/cg147' },
              { texto: 'Davis y Shaw 2023 — Davis y Shaw, «Popliteal Artery Entrapment Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK441965/' }
            ]
          } },
        { id: 'r_v2', urgencia: 'Sospecha de TVP: derivar hoy a quien pueda excluirla (riesgo de embolia pulmonar).', text: '¿Tiene la pantorrilla hinchada, caliente y más rojiza que la otra (posible TVP)?', alerta: true,
          razonamiento: {
            porque: 'Un coágulo en una vena profunda de la pierna frena el retorno de la sangre: por debajo, la pantorrilla se hincha, se calienta, se enrojece y duele. Lo grave no es la pierna: si un fragmento se suelta, viaja por las venas hasta el pulmón (embolia pulmonar). Por eso se deriva hoy, a quien pueda descartarla con una ecografía.',
            peso: 'Hinchazón, calor y dolor en una sola pantorrilla piden valoración médica en el día: NICE calcula la escala de Wells y, con 2 puntos o más, pide una ecografía de las venas proximales con resultado en 4 horas. Ningún signo aislado la confirma ni la descarta: hasta la mitad de las TVP no dan síntomas claros, la especificidad del dolor de pantorrilla va del 3 al 87 % según el estudio (Waheed) y el signo de Homans no sirve (Goodman). Un quiste de Baker roto o disecado puede imitarla (siguiente pregunta), y la diferencia la da la ecografía.',
            detalle: 'Escala de Wells de NICE (un punto cada uno): cáncer activo (tratamiento en curso, en los 6 meses previos o paliativo); parálisis, paresia o inmovilización reciente con yeso en la pierna; encamamiento de 3 días o más o cirugía mayor en las 12 semanas previas; dolor localizado a lo largo del sistema venoso profundo; toda la pierna hinchada; pantorrilla al menos 3 cm más gruesa que la otra; edema con fóvea solo en esa pierna; venas superficiales colaterales (no varices); TVP previa documentada. Resta 2 si otro diagnóstico es al menos igual de probable. 2 o más: probable; 1 o menos: improbable. Lluch reproduce una versión anterior (cirugía en las 4 semanas previas; ref. 127 del capítulo); aquí se sigue la de NICE: una guía clínica pesa más que un libro, y además es más reciente.\n\nQuién: inmovilidad (encamamiento, anestesia, cirugía, vuelos largos), traumatismo, TVP previa, cáncer, embarazo y posparto, estrógenos orales, obesidad, más de 60 años, enfermedad inflamatoria intestinal y lupus (Waheed). Un tercio de los mayores de 40 años operados de cirugía mayor o con un infarto desarrolla una TVP (Goodman); tras una artroplastia puede aparecer en más del 35 %, casi siempre sin síntomas (Lluch).\n\nCómo se presenta: dolor (50 %), hinchazón (70 %), enrojecimiento, calor, venas dilatadas, a veces febrícula (Waheed, Goodman). Lluch: dolor intenso e inexplicado, sensación de calambre en el hueco poplíteo y, a veces, calor o hinchazón. Cerca del 40 % de las TVP son distales (venas de la pantorrilla) y un 16 % poplíteas. El signo de Homans está en menos de un tercio de las TVP confirmadas, y más de la mitad de quienes lo tienen positivo no tienen trombosis (Goodman). A veces la primera manifestación es la embolia pulmonar.\n\nCon qué se confunde: celulitis, quiste de Baker roto, traumatismo, tromboflebitis superficial (cordón rojo, duro y caliente a lo largo de una vena superficial), edema por insuficiencia cardiaca, cirrosis o síndrome nefrótico, y obstrucción linfática (Waheed, Goodman).',
            fisiologia: {
              pasos: [
                'Tres factores favorecen el coágulo (tríada de Virchow): el daño de la pared de la vena (traumatismo, cirugía), el flujo alterado (inmovilidad) y la coagulación aumentada (cáncer, embarazo, estrógenos).',
                'El coágulo suele empezar donde la sangre circula más despacio, como los senos del sóleo detrás de las válvulas venosas, y se adhiere al endotelio, que libera citocinas y atrae leucocitos.',
                'Según el equilibrio entre coagulación y fibrinólisis, el trombo crece hacia arriba (poplítea, femoral, ilíaca).',
                'Al obstruir el retorno, la sangre se estanca por debajo: hinchazón de un solo lado, dolor, calor y enrojecimiento; cuanto más arriba llega, más síntomas.',
                'Si un fragmento se suelta, viaja por las venas hasta el pulmón: embolia pulmonar.'
              ],
              metafora: 'Como un tapón en un desagüe: el agua se acumula por detrás, y el riesgo es que se suelte y acabe en otra tubería.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Waheed 2023', 'NICE NG158'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 255–257; cap. 16, pp. 622 y 636.',
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 224–225.',
              { texto: 'Waheed 2023 — Waheed, Kudaravalli y Hotwagner, «Deep Venous Thrombosis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507708/' },
              { texto: 'NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.4 y tabla 1 (escala de Wells de dos niveles).', url: 'https://www.nice.org.uk/guidance/ng158' }
            ]
          } },
        { id: 'r_v3', text: '¿Tiene un bulto detrás de la rodilla (quiste poplíteo) y además dolor o hinchazón en la pantorrilla? Clínicamente no se distingue de una tromboflebitis: derivar (ecografía).', alerta: true,
          razonamiento: {
            porque: 'El quiste de Baker es líquido articular acumulado en la bolsa que hay entre el gemelo interno y el semimembranoso, casi siempre por un problema dentro de la rodilla (menisco, artrosis). Si crece mucho, se diseca hacia la pantorrilla o se rompe, el líquido inflama la pantorrilla y da hinchazón, calor, dolor y Homans positivo: la pseudotromboflebitis, que la exploración no separa de una trombosis.',
            peso: 'Lluch: la pseudotromboflebitis no se distingue clínicamente de una tromboflebitis real, y la ecografía es la primera prueba para separar el quiste de una TVP. Por eso un bulto detrás de la rodilla con la pantorrilla hinchada o dolorosa se deriva para ecografía, igual que una sospecha de TVP. Un quiste grande también puede comprimir venas, nervios y arterias o causar un síndrome compartimental. El quiste sin síntomas en la pantorrilla pesa poco: es frecuente (hasta en el 38 % de las RM de rodillas con síntomas) y benigno, y se trata su causa.',
            detalle: 'Quién: adultos de 35 a 70 años con artrosis, artritis reumatoide o rotura meniscal degenerativa (Leib); en adultos, el 94 % se asocia a un trastorno dentro de la rodilla, así que no es un diagnóstico de exclusión (Lluch). En niños aparece sobre todo entre los 4 y los 7 años, como problema primario.\n\nCómo se presenta: plenitud, tirantez o dolor en la cara posterointerna de la rodilla; en una serie, hinchazón en el 76 % y dolor posterior en el 32 % (Lluch). Duele al estirar del todo la rodilla y, si es grande, puede bloquear la flexión. Signo de Foucher: el quiste está duro con la rodilla estirada y se ablanda o desaparece al flexionarla (Lluch, Leib). Al romperse: dolor agudo en rodilla y pantorrilla, hinchazón o rojez de la pantorrilla y sensación de agua que corre por ella (Leib).\n\nComplicaciones (Leib): edema por compresión venosa, tromboflebitis (rara), atrapamiento del nervio tibial posterior (adormecimiento plantar), oclusión de la arteria poplítea y síndrome compartimental anterior (pie caído, edema anterolateral) o posterior.\n\nCon qué se confunde (Leib): TVP, aneurisma de la arteria poplítea, quistes ganglionares, masas sólidas (sarcoma, linfoma), absceso, hematoma, lipoma y adenopatías. Un bulto que no cambia con el movimiento de la rodilla, o lateral, pide imagen.',
            fisiologia: {
              pasos: [
                'Entre la articulación y la bolsa del gemelo interno y el semimembranoso hay una comunicación, más frecuente con la edad.',
                'Funciona como una válvula de un solo sentido: en flexión parcial la presión dentro de la rodilla es negativa y en extensión positiva, y el líquido pasa a la bolsa pero no vuelve.',
                'Cuando un menisco roto o la artrosis aumentan el líquido articular, la bolsa se llena y forma el quiste, que se nota más con la rodilla estirada.',
                'Si el quiste se diseca hacia la pantorrilla o se rompe por exceso de presión, el líquido sinovial sale a los tejidos y los inflama.',
                'Esa inflamación da hinchazón, calor, dolor y Homans positivo en la pantorrilla, igual que una trombosis.'
              ],
              metafora: 'Como un globo de agua unido a un grifo con válvula: se va llenando, y si revienta, empapa lo que tiene debajo.'
            },
            fuentes: ['Lluch 2020', 'Leib 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 223–225.',
              { texto: 'Leib 2023 — Leib, Roshan, Foris y Varacallo, «Baker’s Cyst», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430774/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Pantorrilla / Rodilla', desc: 'Claudicación distal o TVP' }
      ],
      impactoDescanso: ['Calambres nocturnos isquémicos interrumpen el sueño profundo'],
      impactoEjercicio: ['Distancia de marcha limitada por claudicación']
    },
    {
      id: 'ro_infecciosa', icon: '🦠', nombre: 'Infecciosa / Inflamatoria',
      banderasRojas: [
        'Fiebre, enrojecimiento intenso, calor y tumefacción articular (artritis séptica)',
        'Artritis séptica: urgencia médica — derivar de inmediato',
        'Inicio muy agudo con articulación bloqueada en posición de confort',
        // Tarjeta rodilla (guía de consulta), URGENCIA
        'Bursitis prerrotuliana séptica: la FIEBRE >37,7 °C solo se ha descrito en la séptica. Derivación el mismo día.'
      ],
      banderasAmarillas: ['Antecedente de infección reciente (urinaria, respiratoria, cutánea)'],
      preguntas: [
        { id: 'r1', urgencia: 'Sospecha de artritis séptica: urgencia hospitalaria hoy.', text: '¿Hay fiebre, enrojecimiento intenso y calor local junto con la tumefacción de la rodilla (artritis séptica)?', alerta: true,
          razonamiento: {
            porque: 'Las bacterias llegan a la rodilla por la sangre (lo más frecuente), por una punción, infiltración o cirugía, o desde una infección vecina. La sinovial se inflama, y las citocinas y proteasas de esa inflamación destruyen el cartílago en poco tiempo, incluso después de eliminar el germen. De ahí la rodilla caliente, roja, hinchada y muy dolorosa, y la urgencia: cuanto antes se trate, más articulación se salva.',
            peso: 'Es una urgencia ortopédica: aun con antibióticos, la mortalidad hospitalaria es del 7–15 % y un tercio queda con secuelas (Momodu). La rodilla es la articulación más afectada en el adulto. Ningún signo aislado basta para descartarla: la fiebre solo aparece en el 40–60 % (Momodu) y suele ser baja en mayores e inmunodeprimidos (Goodman), y la analítica orienta pero no confirma; el diagnóstico lo da el análisis del líquido articular. Con este cuadro, derivación hospitalaria hoy.',
            detalle: 'Quién (Momodu, Goodman): más de 80 años, diabetes, artritis reumatoide, artrosis o daño articular previo, cirugía articular reciente, prótesis, infiltración intraarticular previa, infecciones de la piel y úlceras, VIH e inmunodepresión, drogas por vía parenteral y, en jóvenes sexualmente activos, gonococo. Goodman: sospecharla ante un dolor e inflamación articulares persistentes en el curso de una enfermedad de origen incierto o de una infección conocida (neumonía, sepsis, infección urinaria). La infección de una prótesis puede aparecer años después del implante, y una prótesis con infección reciente y dolor nuevo de rodilla es sospechosa.\n\nCómo se presenta: dolor agudo en una sola articulación, hinchazón con derrame, calor, rechazo a moverla o a cargar, fiebre, escalofríos y malestar (Momodu, Goodman). Un tono azulado oscuro o un eritema franco con dolor exquisito es signo de articulación séptica (Goodman). El estafilococo dorado es el germen más frecuente.\n\nDiagnóstico (médico): artrocentesis; más de 50.000 leucocitos con un 90 % de neutrófilos sugiere origen bacteriano; VSG y PCR elevadas apoyan sin confirmar; una radiografía normal no la descarta (Momodu).\n\nCon qué se confunde: gota y seudogota, artrosis, lesión intraarticular (fractura, menisco), artritis reactiva y otras artritis inflamatorias, endocarditis, hemartros por trastornos de la coagulación o anticoagulantes (Momodu).',
            fisiologia: {
              pasos: [
                'Las bacterias llegan a la rodilla por la sangre desde otra infección, por inoculación directa (cirugía, artroscopia, infiltración, herida) o por extensión desde un hueso o una piel infectados.',
                'La sinovial está muy vascularizada y no tiene membrana basal que haga de barrera, así que las bacterias la colonizan con facilidad; las adhesinas del estafilococo las fijan a las proteínas de la articulación.',
                'La sinovial responde liberando citocinas (TNF, IL-1) y la articulación se llena de líquido inflamatorio: hinchazón, calor, rojez y dolor intenso con cualquier movimiento.',
                'Esas citocinas, las proteasas y las toxinas bacterianas degradan el cartílago, y el daño sigue aunque se elimine el germen.',
                'Sin tratamiento, la infección puede pasar al hueso (osteomielitis) o a la sangre (sepsis).'
              ],
              metafora: 'Como un fuego en una habitación cerrada: lo que importa es apagarlo pronto para salvar lo que hay dentro.'
            },
            fuentes: ['Goodman 2018', 'Momodu y Savaliya 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 12, pp. 449 y 455; cap. 16, pp. 611 y 641.',
              { texto: 'Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538176/' }
            ]
          } },
        { id: 'r_i2', text: '¿Ha tenido alguna infección reciente (urinaria, respiratoria, cutánea) antes de que apareciera el dolor articular?', alerta: true,
          razonamiento: {
            porque: 'Una infección reciente puede llegar a la rodilla de dos maneras. Por la sangre, sembrando bacterias en la articulación (artritis séptica, o gonocócica en jóvenes sexualmente activos). O sin infectarla: tras una gastroenteritis o una infección urogenital, el sistema inmune reacciona contra restos de las bacterias que quedan en la sinovial y la inflama (artritis reactiva), sobre todo en rodillas y tobillos.',
            peso: 'Goodman pide derivar todo dolor articular sin causa clara con una infección o un sarpullido en las 6 semanas previas. La artritis reactiva aparece entre 1 y 6 semanas después de la infección (Jogu), suele afectar de forma asimétrica a una o pocas articulaciones grandes de la pierna y puede acompañarse de conjuntivitis, molestias al orinar o dolor en el talón; no es una urgencia, pero el médico tiene que descartar la séptica analizando el líquido. Si además hay fiebre, rodilla roja y caliente y mal estado general, manda la pregunta anterior.',
            detalle: 'Artritis reactiva (Jogu): inflamación estéril tras una infección intestinal (Salmonella, Shigella, Campylobacter, Yersinia, Clostridioides difficile) o urogenital (Chlamydia trachomatis, la causa más frecuente). Riesgo tras una enteritis del 1–8 % (hasta el 13 % con Yersinia) y tras una clamidia del 3–8 %. Sobre todo entre 18 y 40 años; el HLA-B27 aumenta la susceptibilidad; la de origen sexual es más frecuente en hombres (hasta 9 a 1). Oligoartritis o monoartritis asimétrica aguda en rodillas, tobillos y pies; entesitis (Aquiles, fascia plantar, también el tendón rotuliano); dedos en salchicha; conjuntivitis o uveítis, uretritis, lesiones de piel y úlceras orales. La mayoría se recupera en 6–12 meses, pero cerca de un 30 % queda con artritis crónica o recurrente.\n\nArtritis gonocócica (Vijayan y Maher): el 0,5–3 % de las gonorreas se disemina, sobre todo en menores de 40 y en mujeres; a menudo sin síntomas genitales. Dos formas: artritis-dermatitis (60 %: dolor articular migratorio, tenosinovitis y pequeñas pústulas indoloras, 1–4 semanas tras la infección) y artritis purulenta (40 %: monoartritis aguda, sobre todo de rodilla).\n\nSiembra por la sangre: infecciones de piel (celulitis), urinarias, respiratorias, dentales o estreptocócicas pueden llegar a la articulación (Goodman). Preguntas útiles (Goodman): en las últimas 6 semanas, ¿ha tenido alguna infección (garganta, orina, catarro, gastroenteritis), ha tomado antibióticos, ha tenido sarpullidos o lesiones en la piel o los genitales?\n\nGoodman da para la reactiva «1 a 4 semanas» (caps. 3 y 16) y «2 a 4 semanas» (cap. 12); las dos son textos narrativos, así que se sigue a Jogu, más reciente (1 a 6 semanas).',
            fisiologia: {
              pasos: [
                'Una infección intestinal o urogenital (Salmonella, Shigella, Campylobacter, Yersinia, Chlamydia) afecta a la mucosa.',
                'Restos de esas bacterias (antígenos o ácidos nucleicos) llegan a la sinovial y se quedan allí sin poder cultivarse.',
                'En personas predispuestas, como las que tienen HLA-B27, el sistema inmune los reconoce y monta una respuesta de linfocitos T con TNF-α, IL-17 e IL-23.',
                'Esa inflamación estéril hincha y calienta la rodilla o el tobillo, y alcanza también las entesis (talón, tendón rotuliano).',
                'Por eso la articulación no está infectada y los cultivos salen negativos, aunque el origen sea una infección.'
              ],
              nota: 'Estos pasos explican la artritis reactiva; la séptica por siembra desde la sangre sigue el mecanismo de la pregunta anterior.',
              metafora: 'Como una alarma que sigue sonando cuando el intruso ya se ha ido: la infección pasó, pero la respuesta sigue en la articulación.'
            },
            fuentes: ['Goodman 2018', 'Jogu 2026', 'Vijayan y Maher 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 12, pp. 448–449 y 455–456; cap. 16, pp. 633 y 636.',
              { texto: 'Jogu 2026 — Jogu, Swamy y Maher, «Reactive Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de mayo de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499831/' },
              { texto: 'Vijayan y Maher 2026 — Vijayan y Maher, «Gonococcal Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 21 de febrero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470439/' }
            ]
          } },
        { id: 'r_i3', urgencia: 'Sospecha de bursitis prerrotuliana séptica: derivación el mismo día.', text: '¿Tiene hinchada, caliente y roja la bolsa de delante de la rótula, y fiebre de más de 37,7 °C?', alerta: true, s1: true,
          razonamiento: {
            porque: 'La bursa prerrotuliana está bajo la piel, delante de la rótula, y se inflama con golpes o al arrodillarse mucho. Como es tan superficial, las bacterias entran por pequeñas heridas o desde una celulitis vecina; por la sangre es raro, porque la bursa tiene poco riego. Infectada, se hincha, se calienta y enrojece, y la fiebre indica que la infección ya da síntomas generales.',
            peso: 'Lluch: la fiebre de más de 37,7 °C solo se ha descrito en la bursitis séptica, así que con ella se deriva el mismo día. Su ausencia no la descarta: la fiebre puede faltar en la séptica, y el calor, la rojez y la hinchazón aparecen en las dos (Truong). Hasta un tercio de las bursitis prerrotulianas que llegan a consulta son sépticas (Rishor-Olney). El diagnóstico lo da la aspiración y el cultivo del líquido. A diferencia de la artritis séptica, el movimiento de la rodilla suele estar conservado, porque la infección está fuera de la articulación.',
            detalle: 'Quién: sobre todo hombres de 40 a 60 años (Rishor-Olney); oficios que obligan a arrodillarse (fontaneros, carpinteros, techadores, jardinería, limpieza) y luchadores; inmunodepresión (diabetes, corticoides, hemodiálisis), alcoholismo, gota, artritis reumatoide, bursitis previa e infiltración de corticoides (Truong, Lluch). El estafilococo dorado causa el 80–90 % de las sépticas (Truong).\n\nCómo se presenta: dolor y sensibilidad sobre la bursa, hinchazón en la propia bursa (no difusa), calor, rojez, y a veces heridas o celulitis encima; la fiebre es más probable en la séptica (Truong, Lluch). Una diferencia de 2,2 °C de temperatura en la piel frente al otro lado se asoció a bursitis séptica (Rishor-Olney). La rodilla mueve bien y las pruebas de estabilidad son normales; al explorar, evitar comprimir la bursa (Lluch).\n\nPruebas (médico): en el líquido aspirado, más de 2.000 leucocitos/mm3 tuvo una sensibilidad del 94 % y una especificidad del 79 % para la séptica; predominio de neutrófilos y glucosa baja la apoyan; el Gram es poco sensible y el cultivo es el patrón de referencia; PCR y VSG suelen subir (Rishor-Olney, Truong).\n\nCon qué se confunde: celulitis, gota y seudogota, artritis séptica (en esta el movimiento está limitado), lesiones de partes blandas y otras bursitis (Truong, Rishor-Olney).\n\nLluch sitúa la bursitis prerrotuliana sobre todo en hombres de 30 a 40 años; las dos son textos narrativos, así que se sigue a Rishor-Olney, más reciente.',
            fisiologia: {
              pasos: [
                'La bursa es un saco con revestimiento sinovial que reduce el roce entre la piel y la rótula; al arrodillarse se comprime y roza.',
                'Un traumatismo, una herida pequeña o una celulitis vecina dejan entrar bacterias, casi siempre estafilococo dorado.',
                'La inflamación aumenta el riego y la llegada de leucocitos, y la sinovial de la bursa produce más líquido: la bursa se hincha y sube su presión.',
                'Esa presión y la inflamación dan dolor, calor y rojez delante de la rótula, sobre todo al arrodillarse o al flexionar.',
                'Sin tratamiento, la infección puede extenderse: rotura de la bursa, osteomielitis o problemas de cicatrización.'
              ],
              nota: 'Las fuentes leídas no explican por qué la fiebre aparece solo en la bursitis séptica; Lluch lo da como dato clínico (ref. 27 del capítulo).',
              metafora: 'Como un cojín bajo la piel: el roce lo rellena de líquido, y si entra suciedad por un rasguño, se infecta.'
            },
            fuentes: ['Lluch 2020', 'Rishor-Olney 2024', 'Truong 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 203–205.',
              { texto: 'Rishor-Olney 2024 — Rishor-Olney, Taqi y Pozun, «Prepatellar Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de enero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557508/' },
              { texto: 'Truong 2023 — Truong, Mabrouk y Ashurst, «Septic Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470331/' }
            ]
          } }
      ],
      zonasDolor: [{ zona: 'Rodilla / Articulación', desc: 'Artritis séptica — dolor intenso localizado con signos flogóticos' }],
      impactoDescanso: ['Dolor articular intenso constante impide el descanso'],
      impactoEjercicio: ['Contraindicación absoluta de carga hasta confirmación diagnóstica']
    },
    {
      id: 'ro_oncologico', icon: '🔬', nombre: 'Oncológico / Hematológico',
      banderasRojas: [
        'Dolor nocturno constante e intenso sin alivio postural',
        'Masa o bulto palpable en zona periarticular',
        'Antecedentes de cáncer o edad <25 años (cánceres óseos primarios)',
        // Tarjeta rodilla (guía de consulta), BANDERAS «Tumor»
        'Tumor: el capítulo no da criterios clínicos propios: solo lo menciona como bandera roja que la radiografía ayuda a descartar al valorar una apofisitis tibial en el adolescente. Si se pide imagen en un adolescente con dolor en la tuberosidad tibial, la radiografía simple ayuda a descartar fractura aguda y tumor.'
      ],
      banderasAmarillas: ['Edad entre 10-30 años con dolor óseo inexplicado'],
      preguntas: [
        { id: 'r2', text: '¿El dolor es constante, nocturno, intenso y no se alivia con ninguna posición ni reposo?', alerta: true,
          razonamiento: {
            porque: 'El dolor mecánico cambia con la carga y la postura; el que no cede con nada, ni en reposo ni al cambiar de posición, y despierta por la noche, sugiere una causa que no depende de la mecánica: un tumor que crece dentro del hueso estira el periostio, muy inervado, y deja isquémico el tejido de alrededor. En la rodilla importan sobre todo los tumores óseos primarios del joven, como el osteosarcoma alrededor de la rodilla, y las metástasis en el adulto con antecedente de cáncer.',
            peso: 'Por sí solo pesa poco: el dolor nocturno es una bandera roja clásica de cáncer, pero no todo dolor nocturno es cáncer ni todo cáncer lo da (Goodman). Pesa más si es constante e intenso (7/10 o más), progresivo, con antecedente de cáncer, en un niño o un joven, con pérdida de peso, fiebre, un bulto, dolor al cargar o una prueba de percusión del talón positiva. Si alivia de forma desproporcionada con aspirina o antiinflamatorios, orienta a osteoma osteoide, benigno. Si además no mejora con el tratamiento, o mejora y vuelve a empeorar, derivar.',
            detalle: 'Osteosarcoma (Greenwood): el tumor óseo maligno primario más frecuente; el 75 % antes de los 25 años (media, 20), con un segundo pico en mayores de 65 secundario a Paget o radioterapia; algo más en varones. Nace cerca de las fisis de más crecimiento (fémur distal, tibia proximal, húmero proximal) y es más frecuente en el estirón. El primer síntoma es dolor óseo, al principio con la actividad y luego en reposo; puede haber un traumatismo previo que despiste y semanas o meses de síntomas. Después: bulto doloroso, menos movilidad de la rodilla con derrame, dolor al cargar y, en un 10 %, fractura patológica. La piel de encima puede estar caliente (Goodman).\n\nSarcoma de Ewing (Durer): segundo tumor óseo maligno del adolescente; mediana de 15 años, pico entre 10 y 15 (un 30 % antes de los 10 y otro 30 % después de los 20); varones 3 a 1. Diáfisis de huesos largos, pelvis y fémur. Más de la mitad tiene un dolor intermitente que empeora de noche; la fiebre y la pérdida de peso suelen indicar metástasis. Goodman da 5–16 años y un ligero predominio en chicos; los dos son textos narrativos, así que se sigue a Durer, más reciente.\n\nOsteoma osteoide (Dookie y Joseph): benigno, el 10 % de los tumores óseos benignos; de 5 a 25 años, tres veces más en varones; frecuente en fémur y tibia. Dolor localizado e intermitente que empeora de noche y se alivia con aspirina o antiinflamatorios; cerca de una articulación puede dar derrame y sinovitis. Goodman: puede presentarse como dolor de cadera, muslo o rodilla.\n\nMetástasis (Jayarangaiah): sobre todo de mama, pulmón, próstata, riñón y tiroides; dolor sordo y profundo, de inicio gradual, peor de noche; banderas: dolor nocturno, pérdida de peso, dolor al cargar y una masa que crece; a menudo el paciente lo atribuye a un golpe sin importancia. Goodman describe una mujer de 44 años con dolor de rodilla aislado sin dolor nocturno que en una semana pasó a dolor constante que no la dejaba dormir: era una metástasis de un cáncer de endometrio. Linfoma, leucemia y mieloma también pueden dar dolor de rodilla (Goodman).',
            fisiologia: {
              pasos: [
                'Un tumor que crece dentro del hueso destruye trabéculas y acelera la resorción ósea.',
                'Al expandir la cortical estira el periostio, una membrana muy inervada: de ahí el dolor profundo, implacable y mal localizado.',
                'El tumor está muy vascularizado a costa del tejido de alrededor, que queda isquémico; esa isquemia duele aunque la pierna esté quieta.',
                'Por eso el dolor no cede con el reposo ni al cambiar de postura, y despierta por la noche.',
                'Al debilitar el hueso, una carga normal puede romperlo: la fractura patológica es a veces el primer signo.'
              ],
              nota: 'En el osteoma osteoide el mecanismo es otro: el nido produce prostaglandinas en exceso (de 100 a 1.000 veces lo normal), que estimulan las fibras nerviosas que lo rodean; por eso la aspirina y los antiinflamatorios lo calman (Dookie y Joseph, Goodman).',
              metafora: 'Como algo que crece dentro de una caja cerrada: empuja las paredes desde dentro, y eso se nota tanto quieto como en movimiento.'
            },
            fuentes: ['Goodman 2018', 'Greenwood 2024', 'Durer 2024', 'Dookie y Joseph 2023', 'Jayarangaiah 2023'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 13, pp. 476, 487–488 y 496; cap. 16, pp. 624 y 631–632.',
              { texto: 'Greenwood 2024 — Greenwood, Arora y Shaikh, «Osteosarcoma (Osteogenic Sarcoma)», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK563177/' },
              { texto: 'Durer 2024 — Durer, Gasalberti y Shaikh, «Ewing Sarcoma», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de enero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK559183/' },
              { texto: 'Dookie y Joseph 2023 — Dookie y Joseph, «Osteoid Osteoma», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537279/' },
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' }
            ]
          } },
        { id: 'r3', text: '¿Tiene antecedentes de cáncer o ha notado algún bulto en la zona de la rodilla o muslo?', alerta: true,
          razonamiento: {
            porque: 'Un cáncer previo puede volver como metástasis en el hueso (mama, pulmón, próstata, riñón, tiroides), con dolor de rodilla o de muslo como primer síntoma. Y un bulto que aparece en la rodilla o el muslo puede ser un tumor de partes blandas o de hueso: los sarcomas de partes blandas crecen sin dolor en tejidos que ceden, así que el bulto suele notarse antes que el dolor.',
            peso: 'Un antecedente de cáncer convierte en bandera roja cualquier dolor óseo nuevo, sobre todo si es nocturno, al cargar o no mejora con el tratamiento (Goodman, Jayarangaiah). Un bulto pesa según cómo es: más de 5 cm, profundo a la fascia, que crece o reaparece tras quitarlo, o fijo al músculo o al hueso, pide imagen antes de nada (Menon y Cassaro); que no duela no tranquiliza. No hay signos clínicos fiables para distinguir un bulto benigno de uno maligno, así que todo bulto que persiste o crece se comunica al médico (Goodman). Un quiste de Baker típico, detrás de la rodilla y que se ablanda al flexionarla, es otra cosa.',
            detalle: 'Metástasis (Jayarangaiah): el hueso es el tercer lugar de metástasis tras pulmón e hígado; tras la columna, el fémur es el hueso más afectado. La próstata tiene el mayor riesgo de metástasis óseas (18–29 %), seguida de pulmón, riñón y mama. Dolor progresivo, a menudo atribuido a un golpe banal, y fractura patológica. Goodman: en consulta es mucho más probable una recidiva que un cáncer primario; con antecedente de cáncer, unos ganglios indoloros que crecen en la ingle o el hueco poplíteo piden derivación inmediata.\n\nSarcomas de partes blandas (Menon y Cassaro): alrededor del 1 % de los cánceres del adulto; más en extremidades que en el retroperitoneo, y dentro de la extremidad en la parte proximal (el muslo, un 44 %). Masa indolora que crece poco a poco; el dolor llega tarde, por compresión de un nervio, distensión o invasión. Factores: neurofibromatosis tipo 1, Li-Fraumeni, radioterapia previa y linfedema crónico. Pueden imitarlos un hematoma, un lipoma, un quiste o un absceso. Goodman sitúa la mayoría de los sarcomas de partes blandas del adulto en la pierna, a la altura de la rodilla o por debajo; los dos son textos narrativos, así que se sigue a Menon y Cassaro, más recientes.\n\nTumores óseos: el osteosarcoma del joven da un bulto doloroso, a menudo caliente, alrededor de la rodilla (Greenwood, Goodman). Goodman: un traumatismo previo con síntomas que persisten o empeoran pese a descargar es típico de los tumores óseos o de partes blandas; dolor nocturno, hinchazón o calor localizados, bloqueo o una masa palpable aumentan la sospecha.\n\nLluch: el capítulo de rodilla solo menciona el tumor como algo que la radiografía ayuda a descartar en el adolescente con dolor en la tuberosidad tibial.',
            fisiologia: {
              pasos: [
                'Las células de un cáncer primario pasan a la sangre y anidan en hueso con buen riego, como el fémur, donde interactúan con las células de la médula.',
                'Liberan factores de crecimiento y citocinas que activan los osteoclastos: el hueso se reabsorbe y se debilita.',
                'Los sarcomas de partes blandas, en cambio, nacen en músculo, grasa, vasos o nervios y al principio desplazan los tejidos en vez de invadirlos, formando una pseudocápsula.',
                'Como el músculo y la grasa ceden, el tumor puede crecer mucho sin doler: el primer signo suele ser un bulto.',
                'El dolor llega después, cuando el tumor comprime un nervio, estira la cápsula o invade estructuras vecinas.'
              ],
              metafora: 'Como algo que crece en tierra blanda: puede hacerse grande sin que se note, hasta que empuja algo duro.'
            },
            fuentes: ['Goodman 2018', 'Jayarangaiah 2023', 'Menon y Cassaro 2026', 'Greenwood 2024', 'Lluch 2020'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475, 487 y 495–496; cap. 16, pp. 624, 630 y 639.',
              { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' },
              { texto: 'Menon y Cassaro 2026 — Menon y Cassaro, «Sarcoma Overview», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519533/' },
              { texto: 'Greenwood 2024 — Greenwood, Arora y Shaikh, «Osteosarcoma (Osteogenic Sarcoma)», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK563177/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 200.'
            ]
          } },
        { id: 'r4', text: '¿Ha tenido episodios de hinchazón articular después de un traumatismo menor?', alerta: false,
          razonamiento: {
            porque: 'Que la rodilla se llene de sangre tras un golpe pequeño, o sin golpe, sugiere que la sangre no coagula bien: hemofilia u otros déficits de factores de la coagulación, enfermedad hepática o renal avanzada, falta de vitamina K o anticoagulantes. La rodilla es la articulación que más sangra en la hemofilia.',
            peso: 'Lo habitual es que un hemartros siga a un traumatismo claro (en la rodilla, sobre todo roturas del LCA); cuando aparece de forma espontánea o tras un traumatismo mínimo hay que sospechar un trastorno de la coagulación (Killeen y Cardenas). Preguntar por antecedentes familiares, sangrado prolongado tras cirugías, extracciones o heridas, hematomas fáciles y anticoagulantes. Un sangrado espontáneo de cualquier tipo, sobre todo con antecedente de hemofilia, y unos hematomas extensos con petequias sin diagnóstico se derivan al médico (Goodman). Con hemofilia conocida, el sangrado se trata pronto con el factor que falta.',
            detalle: 'Causas (Killeen y Cardenas): traumáticas (las más frecuentes), no traumáticas (hemofilia y otros déficits hereditarios; adquiridas: enfermedad hepática o renal avanzada, déficit de vitamina K, coagulación intravascular diseminada, anticoagulantes) y posoperatorias (sobre todo tras prótesis de rodilla); más raras: sinovitis villonodular, tumores, artritis séptica. Tras un traumatismo de rodilla: LCA en el 70 %, luxación de rótula en el 10–15 %, menisco en el 10 % y fractura osteocondral en el 2–5 %. Un hemartros con grasa (lipohemartros) indica una fractura intraarticular.\n\nHemofilia A (Awidi y Babiker): déficit de factor VIII de herencia ligada al X, que afecta sobre todo a varones; 1 de cada 4.000–5.000 nacidos varones; un tercio por una mutación nueva, sin antecedentes familiares; la mitad es grave (factor por debajo del 1 %). La grave da hemartros espontáneos; la leve sangra tras traumatismos o cirugía y puede no diagnosticarse hasta la adolescencia. En la hemofilia grave, el 75–90 % tiene hemartros, el primero hacia los 2–3 años, y la rodilla es la articulación más afectada; en niños mayores y adultos, rigidez u hormigueo preceden al dolor y la hinchazón (Killeen y Cardenas).\n\nCómo se presenta (Goodman): hormigueo, rigidez en la posición más cómoda, menos movilidad, dolor, hinchazón, sensibilidad y calor; desde un episodio leve que cede en 1–3 días hasta una articulación muy hinchada y dolorosa durante semanas. Los hemartros repetidos llevan a la artropatía hemofílica: pérdida de movilidad, atrofia y contracturas. El músculo es el segundo lugar de sangrado (iliopsoas, gemelo). Una trombocitopenia sin diagnosticar (hematomas graves, hinchazón articular, petequias) pide derivación inmediata.\n\nCon qué se confunde: artritis séptica (rodilla caliente, fiebre) y otras monoartritis inflamatorias.',
            fisiologia: {
              pasos: [
                'Para frenar un sangrado, el factor VIII se une al factor IX activado y juntos generan trombina, que convierte el fibrinógeno en fibrina y estabiliza el coágulo.',
                'Sin factor VIII (hemofilia A) o con anticoagulantes, el coágulo se forma tarde y es inestable: se sangra durante más tiempo, no más deprisa.',
                'Un microtraumatismo de la rodilla que normalmente no tendría consecuencias basta para que sangre dentro de la articulación, o el sangrado aparece sin golpe.',
                'La sangre llena la articulación en pocas horas: hinchazón, calor, dolor y rodilla rígida en la posición más cómoda.',
                'El hierro de la sangre se deposita en la sinovial, la inflama y la llena de vasos frágiles que vuelven a sangrar; con los episodios repetidos se destruye el cartílago (artropatía hemofílica).'
              ],
              metafora: 'Como un parche que no termina de pegar: una herida pequeña sigue goteando hasta llenar el recipiente.'
            },
            fuentes: ['Goodman 2018', 'Killeen y Cardenas 2025', 'Awidi y Babiker 2026'],
            citas: [
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 218–221; cap. 16, pp. 612 y 638.',
              { texto: 'Killeen y Cardenas 2025 — Killeen y Cardenas, «Hemarthrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK525999/' },
              { texto: 'Awidi y Babiker 2026 — Awidi y Babiker, «Hemophilia A», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470265/' }
            ]
          } }
      ],
      zonasDolor: [{ zona: 'Rodilla / Fémur distal / Tibia proximal', desc: 'Osteosarcoma, metástasis' }],
      impactoDescanso: ['Dolor óseo nocturno que despierta — señal de alarma principal'],
      impactoEjercicio: ['Riesgo de fractura patológica — restricción de carga', 'Fatiga extrema asociada']
    },
    {
      // Tarjeta rodilla (guía de consulta): URGENCIA (aparato extensor,
      // neurovascular) y BANDERAS «Fractura de rótula o de meseta tibial»,
      // «Luxación de rodilla y traumatismo multiligamentoso», «Lesión del
      // nervio peroneo común» y «Lesión osteocondral inestable».
      // La bandera del peroneo suma las causas sin traumatismo del capítulo de
      // rodilla de Lluch 2020 (cap. 4.2, p. 217), decisión del usuario (2026-10).
      id: 'ro_trauma', icon: '🦴', nombre: 'Traumático / Mecánico',
      banderasRojas: [
        'Fractura de rótula o de meseta tibial: mecanismo conocido: golpe directo, rótula contra el salpicadero, caída sobre la rodilla, o indirecto (saltar y caer mal). Meseta: alta energía en varones jóvenes, baja energía en mujeres mayores u osteoporóticas. Hinchazón inmediata, incapacidad para cargar, movilidad limitada, chasquido en el momento. Regla de Ottawa. Palpación de rótula, cabeza del peroné y meseta; posible escalón palpable; dolor con extensión resistida; marcha antiálgica con rodilla rígida.',
        'Rotura del aparato extensor: la regla de Ottawa NO lo detecta. NO puede elevar la pierna extendida ni mantener la rodilla extendida contra gravedad. Escalón palpable por encima de la rótula (cuádriceps) o por debajo (rotuliano); hemartrosis; rótula alta o baja. Reparación precoz (2 primeras semanas) → mejores resultados.',
        'Luxación de rodilla y traumatismo multiligamentoso: alta energía, golpe en la cara anteromedial, lesión de salpicadero o hiperextensión. Hasta el 95 % de las lesiones del LCP vistas en urgencias son combinadas; en hemartrosis agudas por lesión ligamentosa, un 9 % tiene lesión de la EPL. Hemartrosis aguda tras alta energía: valorar función neurovascular y derivar antes de forzar la exploración.',
        'Compromiso neurovascular tras traumatismo: cambios de temperatura, adormecimiento, parestesias o debilidad tras fractura de meseta o luxación → pulsos distales, cribado neurológico e índice tobillo-brazo.',
        'Lesión del nervio peroneo común: pie caído, tropezar con el pie, parestesias y debilidad en la cara lateral de la pierna y el dorso del pie, tras esguince o luxación de la tibioperonea proximal, fractura de tibia o peroné, lesión ligamentosa o cirugía de rodilla. Más frecuente aún sin traumatismo: cruzar las piernas, cuclillas prolongadas, pérdida de peso importante reciente o una masa que lo comprime. Marcha en steppage; fuerza de eversión y de flexión dorsal de tobillo y dedos; sensibilidad; Tinel sobre la cabeza del peroné.',
        'Lesión osteocondral inestable: chasquidos, enganches o bloqueos muy dolorosos: el fragmento bloquea físicamente el movimiento. Derrame y pérdida de rango. Derrame + tope mecánico + rango limitado → imagen (radiografía de elección) y derivación.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'ro_t1', text: '¿Tras un golpe directo, una caída sobre la rodilla o un mal aterrizaje, se le hinchó enseguida y no puede cargar el peso sobre esa pierna? (Aplicar la regla de Ottawa en el árbol: radiografía si hay algún criterio.)', alerta: true,
          razonamiento: {
            porque: 'Un golpe directo, una caída sobre la rodilla o un aterrizaje con el cuádriceps contraído pueden romper la rótula o la meseta tibial. La hinchazón inmediata es sangre dentro de la articulación (hemartros), y no poder cargar sugiere una lesión estructural importante, a menudo una fractura. Por eso aquí se aplica la regla de Ottawa antes de explorar.',
            peso: 'La regla de Ottawa (en el árbol) decide si hace falta una radiografía: 55 años o más, dolor aislado a la palpación de la rótula o de la cabeza del peroné, no flexionar a 90° o no poder cargar cuatro pasos. En la revisión sistemática más reciente (18 estudios, 6.702 adultos) tuvo una sensibilidad del 98 % y una especificidad del 43 % (LR− 0,12): sin ningún criterio, una fractura es muy improbable; con alguno, radiografía antes de seguir, aunque la mayoría no tendrá fractura (Kazemi; dos revisiones anteriores dan cifras parecidas: Bachmann, Sims). Lluch, con el estudio que creó la regla, da una sensibilidad de 1,0; aquí se sigue la revisión sistemática, que pesa más. El hemartros también aparece en roturas de ligamentos (sobre todo del LCA) y en luxaciones de rótula (Killeen y Cardenas), y la elevación de la pierna extendida se explora siempre para no pasar por alto una rotura del aparato extensor (siguiente pregunta).',
            detalle: 'Fractura de rótula (Lluch, Mabrouk y Pilson): alrededor del 1 % de las lesiones del esqueleto, más en hombres. Mecanismo directo (golpe, caída sobre la rodilla, rodilla contra el salpicadero, que puede asociar una fractura de acetábulo) o indirecto: una contracción excéntrica del cuádriceps que supera la resistencia del hueso, que es la causa más frecuente según Mabrouk y Pilson (Lluch da como más frecuente el golpe directo; los dos son textos narrativos, así que se sigue a Mabrouk y Pilson, más recientes). También tras una prótesis de rodilla. Dolor local que aumenta al mover el aparato extensor, hinchazón, defecto palpable, dolor con la extensión resistida y marcha con la rodilla rígida (Lluch). La elevación de la pierna extendida es obligada para valorar el aparato extensor (Mabrouk y Pilson).\n\nFractura de meseta tibial (Lluch, Malik y Herron): el 1 % de las fracturas, 10,3 por 100.000 al año; distribución bimodal: varones de menos de 50 años por alta energía (caída desde altura, accidente de tráfico) y mujeres de más de 70 por caídas con hueso osteoporótico. La meseta interna soporta el 60 % de la carga. Dolor anterior difuso, hinchazón inmediata, imposibilidad de caminar y, a veces, un chasquido; puede haber cambios de temperatura, adormecimiento, hormigueo o debilidad por afectación neurovascular, y riesgo de síndrome compartimental (pregunta sobre compromiso neurovascular).\n\nHemartros (Killeen y Cardenas): tras un traumatismo de rodilla se debe al LCA en el 70 %, a una luxación de rótula en el 10–15 %, al menisco en el 10 % y a fracturas osteocondrales en el 2–5 %. La sangre con grasa (lipohemartros) indica una fractura que llega a la articulación, por orden de probabilidad de meseta tibial, avulsión de la espina tibial o cóndilo femoral.',
            fisiologia: {
              pasos: [
                'La rótula hace de polea del aparato extensor: con la rodilla flexionada, el cuádriceps y el tendón rotuliano la someten a tensión y a flexión.',
                'Una contracción brusca del cuádriceps o un golpe directo superan la resistencia del hueso y lo rompen; en la meseta, una fuerza en varo o valgo con carga axial hunde la superficie articular.',
                'El trazo llega a la articulación: sangran el hueso y los tejidos, y la rodilla se llena de sangre en pocas horas, a veces con grasa de la médula.',
                'La distensión de la cápsula y el foco de fractura duelen al cargar y al mover: por eso no puede apoyar ni flexionar.',
                'Si los fragmentos de la rótula se separan, se corta el aparato extensor y la rodilla no se puede estirar contra la gravedad.'
              ],
              metafora: 'Como la polea de una grúa que se agrieta: el cable sigue tirando, pero la carga ya no sube.'
            },
            fuentes: ['Lluch 2020', 'Kazemi 2023', 'Bachmann 2004', 'Sims 2020', 'Mabrouk y Pilson 2026', 'Malik y Herron 2023', 'Killeen y Cardenas 2025'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 196–198 y 205–206.',
              { texto: 'Kazemi 2023 — Kazemi, Khorram, Fayyazishishavan y cols., «Diagnostic Accuracy of Ottawa Knee Rule for Diagnosis of Fracture in Patients with Knee Trauma; a Systematic Review and Meta-analysis», Arch Acad Emerg Med 2023;11(1):e30.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10197917/' },
              { texto: 'Bachmann 2004 — Bachmann, Haberzeth, Steurer y ter Riet, «The accuracy of the Ottawa knee rule to rule out knee fractures: a systematic review», Ann Intern Med 2004;140(2):121–4.', url: 'https://doi.org/10.7326/0003-4819-140-5-200403020-00013' },
              { texto: 'Sims 2020 — Sims, Chau y Davies, «Diagnostic accuracy of the Ottawa Knee Rule in adult acute knee injuries: a systematic review and meta-analysis», Eur Radiol 2020;30(8):4438–46.', url: 'https://doi.org/10.1007/s00330-020-06804-x' },
              { texto: 'Mabrouk y Pilson 2026 — Mabrouk y Pilson, «Patellar Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513330/' },
              { texto: 'Malik y Herron 2023 — Malik, Herron, Mabrouk y Rosenberg, «Tibial Plateau Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470593/' },
              { texto: 'Killeen y Cardenas 2025 — Killeen y Cardenas, «Hemarthrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de noviembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK525999/' }
            ]
          } },
        { id: 'ro_t2', notaPosquirurgica: true, urgencia: 'Sospecha de rotura del aparato extensor (Ottawa no lo detecta): derivación hoy; la reparación precoz da mejores resultados.', text: '¿Tras una caída o un frenazo con la rodilla doblada, notó un chasquido y ahora no puede levantar la pierna estirada ni mantener la rodilla estirada?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El aparato extensor (cuádriceps, su tendón, la rótula y el tendón rotuliano) es el que estira la rodilla. Si se rompe uno de sus eslabones al frenar o caer con la rodilla doblada, el músculo sigue contrayéndose pero su fuerza ya no llega a la tibia: la persona nota un chasquido y no puede levantar la pierna estirada ni mantener la rodilla estirada.',
            peso: 'No poder elevar la pierna extendida tras un traumatismo es el dato clave: la tríada típica de la rotura del tendón del cuádriceps es dolor agudo, imposibilidad de elevar la pierna estirada y un hueco palpable encima de la rótula (Pope); en la del rotuliano, el hueco está debajo y la rótula queda más alta que la del otro lado (Mabrouk y Siwiec). Las roturas completas se operan, y cuanto antes mejor: en el cuádriceps se aconseja reparar en las 48–72 horas, y pasadas 2 semanas el tendón puede retraerse hasta 5 cm (Pope); en el rotuliano, el retraso diagnóstico empeora el resultado (Mabrouk y Siwiec). Derivación hoy.',
            detalle: 'Tendón del cuádriceps (Pope): más frecuente que el rotuliano (1,37 frente a 0,68 casos por 100.000); sobre todo a partir de los 40 años, varones 8 a 1. Factores: diabetes, hiperparatiroidismo, gota, enfermedad renal crónica (sobre todo en diálisis), obesidad, artritis reumatoide, lupus, corticoides, anabolizantes y fluoroquinolonas, infiltraciones intraarticulares, y tras una prótesis de rodilla. Mecanismo: carga excéntrica violenta (caer de un salto, cambiar de dirección, intentar no caerse). Rotura completa: sin extensión activa; parcial: extensión débil.\n\nTendón rotuliano (Mabrouk y Siwiec): más en menores de 40 y en el deporte; factores: tendinopatía previa, corticoides (también infiltrados), fluoroquinolonas, lupus, artritis reumatoide, diabetes e insuficiencia renal. La tensión sobre el tendón es máxima con más de 60° de flexión; lo más frecuente es que se desinserte del polo inferior de la rótula. Dolor brusco bajo la rótula, chasquido, fallo, hemartros grande. Si los retináculos siguen intactos puede elevar la pierna con un déficit de extensión, lo que despista. A partir de unas 6 semanas se considera crónica.\n\nLa rótula también forma parte del aparato extensor: sus fracturas son más del doble de frecuentes que las roturas de tendón (Mabrouk y Siwiec), y en ellas el dolor con la extensión resistida y el defecto palpable orientan (Lluch).',
            fisiologia: {
              pasos: [
                'Para estirar la rodilla, el cuádriceps tira del tendón del cuádriceps, la rótula y el tendón rotuliano, que se inserta en la tibia: una cadena de eslabones en serie.',
                'Al frenar, aterrizar o bajar un escalón con la rodilla flexionada, el músculo se contrae mientras se alarga (contracción excéntrica) y la tensión en la cadena es máxima.',
                'Si un tendón está debilitado (degeneración, enfermedad renal, diabetes, corticoides) o la fuerza es muy grande, el eslabón más débil se rompe: chasquido y dolor.',
                'Con la cadena cortada, la fuerza del cuádriceps no llega a la tibia: no puede levantar la pierna estirada ni mantener la rodilla extendida.',
                'Con los días, el músculo retrae el cabo roto, el hueco crece y la reparación se vuelve más difícil.'
              ],
              metafora: 'Como una cadena con un eslabón roto: el motor sigue tirando, pero ya no mueve nada.'
            },
            fuentes: ['Pope 2023', 'Mabrouk y Siwiec 2026', 'Lluch 2020'],
            citas: [
              { texto: 'Pope 2023 — Pope, El Bitar, Mabrouk y Plexousakis, «Quadriceps Tendon Rupture», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482389/' },
              { texto: 'Mabrouk y Siwiec 2026 — Mabrouk y Siwiec, «Patellar Tendon Rupture», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513275/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 196–197.'
            ]
          } },
        { id: 'ro_t3', notaPosquirurgica: true, urgencia: 'Sospecha de luxación o lesión multiligamentosa: valorar función neurovascular y derivar hoy, antes de forzar la exploración.', text: '¿Fue un traumatismo de alta energía (accidente, golpe contra el salpicadero o en la parte delantera e interna de la rodilla, o la rodilla se le fue hacia atrás) con la rodilla muy hinchada de inmediato?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Para que la tibia se salga del fémur hace falta mucha energía (accidente, deporte a alta velocidad, golpe de salpicadero, hiperextensión), y se rompen varios ligamentos a la vez. La arteria poplítea cruza el hueco poplíteo fija por arriba y por abajo, así que al desplazarse la tibia se estira o se rompe; el nervio peroneo, que rodea la cabeza del peroné, también sufre.',
            peso: 'Casi la mitad de las luxaciones de rodilla se reducen solas antes de llegar al médico o pasan desapercibidas (Mohseni), así que una rodilla de aspecto normal tras un traumatismo de alta energía con hinchazón inmediata no la descarta. Las lesiones vasculares aparecen en el 5–15 % de las luxaciones (hasta el 40 % en algunas series) y las del nervio peroneo en el 10–40 %; un pulso del pie palpable no excluye una lesión de la poplítea, porque las colaterales pueden mantenerlo, y una isquemia de más de 6 horas se ha asociado a tasas de amputación de hasta el 86 % (Mohseni). Por eso: pulsos, sensibilidad y fuerza del pie e índice tobillo-brazo antes de forzar la exploración, y derivación hoy.',
            detalle: 'Mecanismos (Mohseni): la anterior, por hiperextensión, es la más frecuente (30–50 %), lesiona más el nervio peroneo y suele romper el LCP; la posterior, por carga axial sobre la rodilla flexionada como en el salpicadero (30–40 %), es la que más lesiona la arteria, a menudo con rotura completa de la poplítea; lateral (13 %) y medial (3 %). Varones 4 a 1; con obesidad, la rodilla puede luxarse con muy poca energía.\n\nSignos de una luxación ya reducida (Mohseni): abrasiones, equimosis, derrame, e hiperextensión de más de 30° al levantar el talón. Signos duros de lesión vascular: pulsos ausentes o débiles, pierna pálida o fría, hormigueo o parálisis, que piden cirugía vascular urgente. Índice tobillo-brazo: de 0,9 o más, vigilancia seriada; por debajo de 0,9, eco-doppler o angio-TC (Mohseni, McClary y Massey). El índice solo tiene una sensibilidad del 49,5 %, que llega al 100 % combinado con la exploración (McClary y Massey).\n\nLluch: hasta el 95 % de las lesiones del LCP vistas en urgencias son combinadas, y el LCP aparece en hasta el 38 % de los hemartros traumáticos agudos; el 9 % de los hemartros agudos por lesión ligamentosa tiene lesión de la esquina posterolateral, cuyo mecanismo incluye el salpicadero, el golpe en la cara anterointerna, la luxación, la hiperextensión y el varo, y que puede lesionar el nervio peroneo (hormigueo y debilidad del pie). Complicaciones de la luxación (Mohseni): síndrome compartimental, TVP, rigidez (hasta un 38 %) e inestabilidad.',
            fisiologia: {
              pasos: [
                'Una fuerza grande (hiperextensión, golpe en la tibia con la rodilla flexionada, varo o valgo) rompe varios ligamentos y la tibia pierde el contacto con el fémur.',
                'La arteria poplítea cruza el hueco poplíteo fija por arriba y por abajo; cuando la tibia se desplaza, la arteria se estira, se desgarra su capa interna o se rompe.',
                'Una lesión de la capa interna puede trombosarse horas después, aunque el pulso fuera normal al principio.',
                'Si el flujo se corta, la pierna queda sin riego: frialdad, palidez, pulso débil, hormigueo y, al final, parálisis; las colaterales pueden mantener un pulso que engaña.',
                'El nervio peroneo, superficial junto a la cabeza del peroné, se estira con el desplazamiento: pie caído y hormigueo en el dorso del pie.'
              ],
              metafora: 'Como una manguera sujeta en dos puntos: si se mueve lo que hay entre ellos, la manguera se tensa y puede doblarse o rajarse.'
            },
            fuentes: ['Mohseni 2024', 'McClary y Massey 2023', 'Lluch 2020'],
            citas: [
              { texto: 'Mohseni 2024 — Mohseni, Mabrouk y Simon, «Knee Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 27 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470595/' },
              { texto: 'McClary y Massey 2023 — McClary y Massey, «Ankle Brachial Index», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK544226/' },
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 219 y 221–222.'
            ]
          } },
        { id: 'ro_t4', notaPosquirurgica: true, urgencia: 'Compromiso neurovascular tras traumatismo: pulsos distales, cribado neurológico e índice tobillo-brazo; derivación médica hoy.', text: '¿Desde el traumatismo nota el pie o la pierna más fríos o más calientes, dormidos, con hormigueo o con menos fuerza?', alerta: true, s1: true,
          razonamiento: {
            porque: 'Tras una fractura de meseta tibial o una luxación, pueden quedar comprometidos la arteria poplítea, los nervios o los compartimentos musculares de la pierna. Los cambios de temperatura del pie indican que el riego ha cambiado; el adormecimiento, el hormigueo o la debilidad, que sufren los nervios, por estiramiento directo o por falta de riego. Lluch lo describe en la fractura de meseta: cambios de temperatura, adormecimiento, parestesias o debilidad por afectación neurovascular.',
            peso: 'Es una urgencia: Lluch pide valorar pulsos, hacer un cribado neurológico y medir el índice tobillo-brazo, y ante una diferencia de pulsos entre las piernas el umbral para medirlo debe ser bajo (Malik y Herron). Un pie sin pulso es una urgencia ortopédica. Hay que pensar también en el síndrome compartimental: aparece en horas, a veces hasta 48 horas después; el 75 % se asocia a fracturas, sobre todo de tibia; el primer signo objetivo es un compartimento tenso, duro como la madera, con un dolor desproporcionado que aumenta al estirar los músculos de forma pasiva, y el pulso suele conservarse hasta muy tarde (Torlincasi). Derivación hoy.',
            detalle: 'Lesiones vasculares (Mohseni, Malik y Herron): de la poplítea en el 5–15 % de las luxaciones y en las fracturas-luxación de meseta (tipo IV de Schatzker). Signos: pulsos ausentes o débiles, pierna fría o pálida, hormigueo y parálisis. Un índice tobillo-brazo por debajo de 0,9 pide estudio vascular (McClary y Massey). Goodman: la oclusión arterial aguda se reconoce por dolor, palidez, ausencia de pulso, parestesias, frialdad y parálisis.\n\nLesiones nerviosas: el nervio peroneo se lesiona en el 1–2 % de las fracturas de tibia y peroné (Lezak), en alrededor del 1 % de las de meseta (Lluch) y en el 10–40 % de las luxaciones (Mohseni).\n\nSíndrome compartimental agudo (Torlincasi): la presión normal en un compartimento es de menos de 10 mmHg, y a partir de 30 mmHg hay síndrome compartimental; 7,3 casos por 100.000 en varones y 0,7 en mujeres, más en varones de menos de 35 años; la hemofilia y otros trastornos de la coagulación aumentan el riesgo. Dolor quemante o profundo, desproporcionado, que aumenta al estirar; hormigueo pronto. De las «cinco P» (dolor, ausencia de pulso, parestesias, parálisis, palidez), salvo las parestesias, todas son tardías. Exploraciones repetidas, porque puede progresar rápido. Un quiste de Baker roto también puede causarlo (Leib, Lluch).',
            fisiologia: {
              pasos: [
                'Tras la fractura o la luxación, la arteria puede lesionarse directamente, o el sangrado y el edema llenan un compartimento cerrado por una fascia que no cede.',
                'Al subir la presión dentro del compartimento, primero se frena la salida de sangre por las venas y sube la presión en los capilares.',
                'Si la presión supera la de las arterias, también se frena la entrada: músculos y nervios se quedan sin oxígeno.',
                'Los nervios lo notan pronto: hormigueo, adormecimiento y luego debilidad; el músculo sin riego duele mucho, sobre todo al estirarlo.',
                'Si la falta de riego dura horas, músculo y nervio se necrosan de forma irreversible.'
              ],
              metafora: 'Como un globo que se infla dentro de una caja: si sigue creciendo, acaba aplastando los tubos que pasan por dentro.'
            },
            fuentes: ['Lluch 2020', 'Malik y Herron 2023', 'Mohseni 2024', 'Torlincasi 2023', 'McClary y Massey 2023', 'Lezak 2024', 'Goodman 2018', 'Leib 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 198, 217 y 223.',
              { texto: 'Malik y Herron 2023 — Malik, Herron, Mabrouk y Rosenberg, «Tibial Plateau Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470593/' },
              { texto: 'Mohseni 2024 — Mohseni, Mabrouk y Simon, «Knee Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 27 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470595/' },
              { texto: 'Torlincasi 2023 — Torlincasi, Lopez y Waseem, «Acute Compartment Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448124/' },
              { texto: 'McClary y Massey 2023 — McClary y Massey, «Ankle Brachial Index», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK544226/' },
              { texto: 'Lezak 2024 — Lezak, Massel y Varacallo, «Peroneal Nerve Injury», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK549859/' },
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 6, p. 254.',
              { texto: 'Leib 2023 — Leib, Roshan, Foris y Varacallo, «Baker’s Cyst», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430774/' }
            ]
          } },
        { id: 'ro_t5', text: '¿Arrastra la punta del pie o tropieza con ella, o tiene hormigueo o menos fuerza por fuera de la pierna y en el dorso del pie (nervio peroneo común)?', alerta: true,
          razonamiento: {
            porque: 'El nervio peroneo común rodea el cuello del peroné justo bajo la piel, en la cara externa de la rodilla, y por eso se lesiona con facilidad: por golpes, fracturas, luxaciones, cirugía de la rodilla o compresión mantenida. Mueve los músculos que levantan el pie y los dedos y los que giran el pie hacia fuera, y da la sensibilidad de la cara externa de la pierna y del dorso del pie: si falla, el pie cae y la punta tropieza.',
            peso: 'No es una urgencia por sí sola, pero un pie caído nuevo se deriva para estudio (conducción nerviosa y electromiografía, que confirman el diagnóstico y orientan el pronóstico; Lluch), sobre todo tras un traumatismo; si apareció tras una luxación o una fractura de meseta, manda la pregunta anterior. Lluch subraya que la lesión es más frecuente sin traumatismo: cruzar las piernas, pasar mucho tiempo en cuclillas, una pérdida de peso importante reciente (menos grasa que proteja el nervio) o una masa que lo comprima. El pie caído también puede venir de más arriba: la radiculopatía L5 es su causa más frecuente, y la debilidad de la abducción de la cadera orienta a ella; la del ciático suma debilidad de la flexión plantar y de la inversión del pie (Nori y Stretanski).',
            detalle: 'Causas (Lezak): es la neuropatía focal más frecuente de la pierna y la tercera del cuerpo. Traumáticas: luxación de rodilla (16–40 %), fracturas de peroné proximal o de tibia, incluida la meseta (1–2 %), golpes directos y heridas. Compresión externa: yesos, férulas o vendajes apretados, cruzar las piernas, encamamiento prolongado, posturas durante la anestesia, y oficios o deportes con mucho arrodillarse y cuclillas. Otras: gangliones intraneurales, tumores del nervio, cirugía de cadera, rodilla (prótesis, sutura del menisco externo) o tobillo, diabetes, polineuropatía inflamatoria y delgadez extrema. Nori y Stretanski: alrededor del 10 % de quienes pasan más de 4 semanas en la UCI desarrolla una paresia peronea; también lo comprimen una pérdida de peso o una metástasis en la cabeza del peroné.\n\nCómo se presenta (Lezak, Lluch): debilidad de la flexión dorsal del tobillo y los dedos que hace tropezar con la punta o caminar en estepaje (levantando más la rodilla); puede ser aguda o instaurarse en días o semanas. Adormecimiento u hormigueo en la cara externa de la pierna, el dorso del pie y el primer espacio interdigital; el dolor no siempre está. Exploración (Lluch): marcha en estepaje, sensibilidad, fuerza de eversión y de flexión dorsal de tobillo y dedos, Tinel junto a la cabeza del peroné y prueba neurodinámica con sesgo peroneo positiva.\n\nPronóstico (Lluch): según Seddon, la neurapraxia (lesión de la mielina) se recupera muy bien; la axonotmesis, de forma parcial o completa; la neurotmesis, mínimamente. Si la compresión dura 4 semanas o más aparecen inflamación y cicatriz que enlentecen aún más la conducción. Radiografía de rodilla y tobillo si se sospecha fractura, masa o artritis; ecografía y RM para gangliones.',
            fisiologia: {
              pasos: [
                'El nervio peroneo común sale del ciático por encima del hueco poplíteo, rodea el cuello del peroné muy superficial y se divide en una rama profunda (músculos que levantan el pie y los dedos) y otra superficial (músculos que giran el pie hacia fuera y piel del dorso del pie).',
                'En el cuello del peroné solo lo cubren piel y grasa: un golpe, una fractura, un estiramiento o una presión mantenida lo dañan.',
                'La compresión deja el nervio con poco riego y con edema dentro, y la conducción se bloquea; si dura 4 semanas o más, aparecen inflamación y cicatriz que la enlentecen todavía más.',
                'Sin señal, el tibial anterior y los extensores no levantan el pie: la punta cae y tropieza, y se compensa levantando más la rodilla.',
                'La parte sensitiva falla a la vez: hormigueo o adormecimiento en la cara externa de la pierna y el dorso del pie.'
              ],
              metafora: 'Como un cable que pasa por el canto de una mesa: un golpe o una presión en esa esquina cortan la señal.'
            },
            fuentes: ['Lluch 2020', 'Lezak 2024', 'Nori y Stretanski 2025'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 217–218 y 220.',
              { texto: 'Lezak 2024 — Lezak, Massel y Varacallo, «Peroneal Nerve Injury», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK549859/' },
              { texto: 'Nori y Stretanski 2025 — Nori y Stretanski, «Foot Drop», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554393/' }
            ]
          } },
        { id: 'ro_t6', text: '¿La rodilla se le bloquea y no puede estirarla o doblarla, con mucho dolor, derrame y pérdida de movilidad (posible fragmento osteocondral inestable → imagen y derivación)?', alerta: true,
          razonamiento: {
            porque: 'En la osteocondritis disecante se pierde el riego de un fragmento de hueso bajo el cartílago, casi siempre en el cóndilo femoral interno de un adolescente activo. Mientras el fragmento está estable, duele con la carga y el impacto; si se despega, queda suelto dentro de la rodilla y puede encajarse entre las superficies: bloqueo con mucho dolor, derrame y pérdida de movilidad.',
            peso: 'Lluch: en una lesión inestable es probable encontrar derrame, signos mecánicos de bloqueo y rango limitado, y la radiografía es la primera prueba de imagen. El bloqueo o el enganche indican una enfermedad avanzada o un cuerpo libre de buen tamaño (Mohr). También bloquean las roturas de menisco, así que la pregunta no da el diagnóstico, pero un bloqueo verdadero con derrame y pérdida de movilidad pide valoración e imagen. En el joven, un dolor de rodilla vago con la actividad puede ser una osteocondritis todavía estable: el signo de Wilson ayuda si es positivo, pero negativo no la descarta (Mohr).',
            detalle: 'Quién (Mohr): sobre todo de 12 a 19 años, con una incidencia 3,3 veces mayor que entre los 20 y los 45; varones 2 a 4 veces más; la obesidad aumenta el riesgo. El 75 % está en la rodilla: el 64 % en el cóndilo femoral interno y el 32 % en el externo; bilateral en el 7–25 %. La causa más aceptada es el microtraumatismo repetido, con isquemia y predisposición genética. Lluch: 9,5 por 100.000 entre los 6 y los 19 años.\n\nCómo se presenta (Mohr, Lluch): dolor de rodilla vago y mal localizado que empeora con la actividad (el 80 % al cargar), a veces rigidez y derrame; en la lesión inestable, dolor agudo con ciertos movimientos, enganches, chasquidos o bloqueo. Los adultos presentan más derrame, rango limitado o síntomas mecánicos. Exploración: rodilla en varo (cóndilo interno) o en valgo (externo), atrofia del cuádriceps, a veces un cuerpo libre palpable, dolor a la palpación de los cóndilos con la rodilla flexionada y marcha antiálgica con el pie en rotación externa y menos flexión en la respuesta a la carga.\n\nSigno de Wilson (Mohr): sentado, extensión activa de la rodilla desde 90° con la tibia en rotación interna; si duele hacia los 30° y el dolor cede al rotar la tibia hacia fuera, orienta a una lesión de la cara externa del cóndilo interno.',
            fisiologia: {
              pasos: [
                'Microtraumatismos repetidos, o un golpe, interrumpen los vasos de la epífisis que riegan el hueso bajo el cartílago.',
                'El hueso subcondral sin riego se necrosa, y el cartílago de encima se reblandece, se fisura y se erosiona.',
                'Con la carga axial repetida, sobre todo en varo o valgo, el fragmento pierde mineral y se va separando del hueso sano; mientras sigue fijo, duele con la carga y el impacto.',
                'Cuando se despega, queda un fragmento libre que puede encajarse entre el fémur y la tibia: bloqueo brusco, muy doloroso, y derrame.',
                'La superficie articular queda irregular y, con el tiempo, favorece la artrosis.'
              ],
              metafora: 'Como una baldosa que se despega del suelo: mientras sigue en su sitio solo cruje, pero suelta puede atascar la puerta.'
            },
            fuentes: ['Lluch 2020', 'Mohr 2024'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 198–199 y 205.',
              { texto: 'Mohr 2024 — Mohr, Mabrouk y Baldea, «Osteochondritis Dissecans of the Knee», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de enero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538194/' }
            ]
          } }
      ]
    },
    {
      // Tarjeta rodilla (guía de consulta), BANDERAS «Epifisiólisis femoral
      // proximal o Perthes» y árbol, nodo 5; «patrón de dolor» según Lluch 2020,
      // cap. 4.2, p. 201 («consistent pain pattern»; antes «es constante»).
      id: 'ro_pediatrico', icon: '🧒', nombre: 'Niño o Adolescente',
      banderasRojas: [
        'Epifisiólisis femoral proximal o Perthes: niño o adolescente con dolor de rodilla SIN mecanismo conocido. Por su patrón de dolor y porque obliga a derivar, cribado de cadera PRIMERO: rango activo y pasivo de la cadera ipsilateral. Solo si es normal, la rodilla es la localización primaria.'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'ro_p1', text: '¿Es un niño o adolescente con dolor de rodilla sin ningún golpe ni gesto que lo explique? (Explorar primero la cadera: epifisiólisis, Perthes.)', alerta: true,
          razonamiento: {
            porque: 'En el niño y el adolescente, un problema de cadera (epifisiólisis, Perthes) se nota a menudo solo en la rodilla. El nervio obturador da ramas a la cadera y a la rodilla, y el sistema nervioso no siempre distingue de dónde viene el dolor; por eso Lluch pide explorar primero la cadera ante todo dolor de rodilla sin causa en un menor.',
            peso: 'Lluch: en todo niño o adolescente con dolor de rodilla sin mecanismo conocido hay que explorar primero la cadera, con su rango activo y pasivo, por su patrón de dolor y porque requieren derivación; solo si la cadera es normal, lo más probable es que el origen esté en la rodilla. La epifisiólisis da dolor de rodilla en el 26 % de los casos y suele tardar 4–5 meses en diagnosticarse (Johns); el Perthes da cojera y a veces solo dolor de rodilla, lo que desvía la valoración (Sabry y Li). Una rotación interna de la cadera limitada o dolorosa, la cojera o el signo de Drehmann piden derivación para una radiografía de cadera. Con fiebre o mal estado general, hay que pensar en una artritis séptica o una osteomielitis.',
            detalle: 'Epifisiólisis (Johns): 10,8 casos por 100.000; la obesidad es el mayor factor de riesgo, junto con el sexo masculino y el crecimiento rápido; edad media de 11,2 años en chicas y 12 en chicos; más en la cadera izquierda, bilateral en un 25 %; se asocia a hipotiroidismo y otros trastornos endocrinos y renales (por debajo de los 10 años, o con poco peso, estudio endocrino). Dolor en cadera (52 %), muslo (35 %), rodilla (26 %) o ingle (14 %); el dolor de rodilla se debe a la activación del nervio obturador. Un traumatismo previo no la descarta. Exploración: rotación interna limitada y dolorosa, pérdida de flexión y abducción, signo de Drehmann (la cadera se va a rotación externa al flexionarla a 90°), marcha antiálgica o de Trendelenburg, o incapacidad para cargar. Goodman describe una epifisiólisis en un chico de 13 años que solo se vio en la radiografía lateral.\n\nPerthes (Sabry y Li): de 3 a 12 años, con un pico entre los 5 y los 7; varones 3 a 5 veces más; bilateral en el 10–24 %. Cojera poco dolorosa que empeora con la actividad; dolor de cadera, ingle, muslo o rodilla, a veces solo de rodilla; sin fiebre. Limitación de la abducción y de la rotación interna, y dolor al final de esos movimientos.\n\nLluch: el patrón de dolor de cadera y la necesidad de derivar obligan a explorarla primero; la tabla 2 incluye la historia de artrosis o displasia de cadera y la sospecha de epifisiólisis, y el hallazgo clave es reproducir el dolor de rodilla al mover la cadera. Goodman: el dolor de cadera puede presentarse como dolor de rodilla o de tobillo, también en el adulto.',
            fisiologia: {
              pasos: [
                'El nervio obturador, del plexo lumbar, da ramas articulares a la cadera y a la rodilla, y sensibilidad a la cara interna del muslo hasta justo por encima de la rodilla.',
                'Cuando la cadera sufre (la epífisis se desliza o se necrosa), las señales de dolor llegan a la médula por fibras que convergen en las mismas neuronas que reciben las de otras zonas.',
                'Por esa convergencia, el sistema nervioso central no distingue bien el origen y sitúa el dolor en la rodilla o el muslo.',
                'Por eso la rodilla duele sin lesión en ella y su exploración es normal, mientras que mover la cadera, sobre todo la rotación interna, reproduce el dolor.'
              ],
              nota: 'Las fuentes leídas atribuyen el dolor de rodilla de la epifisiólisis al nervio obturador (Johns) y explican la convergencia como base del dolor referido en general (Goodman); no detallan qué neuronas comparten la cadera y la rodilla.',
              metafora: 'Como dos timbres conectados al mismo cable: suena el de la rodilla aunque hayan llamado a la puerta de la cadera.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Johns 2023', 'Sabry y Li 2026', 'Koh y Markovich 2023'],
            citas: [
              'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 191, 201 y 213–214.',
              'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 118; cap. 16, pp. 612, 615, 617 y 622.',
              { texto: 'Johns 2023 — Johns, Mabrouk y Tavarez, «Slipped Capital Femoral Epiphysis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538302/' },
              { texto: 'Sabry y Li 2026 — Sabry y Li, «Legg-Calve-Perthes Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de marzo de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK513230/' },
              { texto: 'Koh y Markovich 2023 — Koh y Markovich, «Anatomy, Abdomen and Pelvis, Obturator Nerve», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK551640/' }
            ]
          } }
      ]
    },
    SIS_ENDOCRINO,
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.rodilla
// Tarjeta rodilla (guía de consulta), ARBOL: nodo 1 (urgencia) va en la fase 2;
// nodos 2 y 4 → ro_step1; 3 → ro_step1b; 5 → ro_step2b; 6 → ro_step2c;
// 7 → ro_step3 (lo que ya había) y ro_step4–ro_step7 (una zona por paso).
export const tree = {
  title: 'Algoritmo CIF — Rodilla',
  steps: [
    {
      id: 'ro_step1',
      tag: 'Paso 1 — Antecedente Traumático Agudo',
      question: '¿Hubo un evento lesivo reciente con inflamación inmediata? Rodilla aguda traumática: ¿qué mecanismo cuenta?',
      options: [
        { label: 'SÍ — Sensación de "pop", derrame articular rápido e inestabilidad (posible LCA)', value: 'lca', next: null, hypothesis: ['ro4'] },
        { label: 'SÍ — Trauma rotacional con síntomas de bloqueo o chasquidos (posible Menisco)', value: 'menisco', next: null, hypothesis: ['ro2'] },
        { label: 'SÍ — Valgo con el pie fijo → LCM (mirar LCA y menisco medial)', value: 'lcm', next: null, hypothesis: ['ro8'] },
        { label: 'SÍ — Golpe en tibia anterior con rodilla flexionada (salpicadero) → LCP y EPL', value: 'lcp', next: null, hypothesis: ['ro9'] },
        { label: 'SÍ — Golpe anteromedial o varo cerca de la extensión → LLE y EPL', value: 'lle', next: null, hypothesis: ['ro10'] },
        { label: 'SÍ — La rótula «se salió», aprensión al trasladarla lateralmente → INESTABILIDAD ROTULIANA', value: 'rotula', next: null, hypothesis: ['ro12'] },
        { label: 'SÍ — Golpe directo anterior, dolor con extensión resistida, escalón palpable → FRACTURA', value: 'fractura', next: null, hypothesis: ['ro11'] },
        { label: 'NO — Dolor de inicio insidioso o crónico', value: 'no', next: 'ro_step2', hypothesis: [] }
      ]
    },
    {
      // Nodo 3. Solo se llega por las ramas traumáticas de ro_step1 (su «NO»
      // salta a ro_step2).
      id: 'ro_step1b',
      tag: 'Paso 1b — Regla de Ottawa y Aparato Extensor',
      question: '¿Algún criterio de Ottawa (≥55 años · cabeza del peroné · rótula aislada · no flexiona 90° · no carga cuatro pasos)? Y en toda rodilla traumática con dolor anterior, elevación de la pierna extendida. Alternativa a Ottawa: Pittsburgh — contusión o caída MÁS (<12 o >50 años, o no puede caminar); S ≈99 % con E ≈60 %, pide menos radiografías (Seaberg y Jackson 1994; Seaberg 1998).',
      options: [
        { label: 'OTTAWA POSITIVO — DERIVAR PARA RADIOGRAFÍA antes de seguir explorando', value: 'ottawa', next: null, hypothesis: ['ro11'] },
        { label: 'NO ELEVA LA PIERNA EXTENDIDA — Aparato extensor, que Ottawa no detecta: derivar hoy', value: 'extensor', next: null, hypothesis: [] },
        { label: 'NINGUNO — Ottawa negativo y eleva la pierna extendida', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ro_step2',
      tag: 'Paso 2 — Perfil Degenerativo',
      question: '¿El paciente es mayor de 45 años con rigidez matutina breve (<30 min)?',
      options: [
        { label: 'SÍ — Edad ≥45 años, dolor relacionado con actividad, rigidez <30 minutos', value: 'si', next: null, hypothesis: ['ro1'] },
        { label: 'NO — Perfil más joven o sin patrón degenerativo', value: 'no', next: 'ro_step2b', hypothesis: [] }
      ]
    },
    {
      // Nodo 5.
      id: 'ro_step2b',
      tag: 'Paso 2b — Menor sin Mecanismo: Cadera Primero',
      question: '¿Niño o adolescente con dolor de rodilla sin mecanismo conocido? → EXPLORAR PRIMERO LA CADERA (epifisiólisis, Perthes). Solo si el cribado es normal, seguir en la rodilla.',
      options: [
        { label: 'SÍ — Cribado de cadera alterado: derivar (epifisiólisis, Perthes)', value: 'cadera_alterada', next: null, hypothesis: [] },
        { label: 'SÍ — Cribado de cadera normal: seguir en la rodilla', value: 'cadera_normal', next: null, hypothesis: [] },
        { label: 'NO — Adulto, o hay mecanismo conocido', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 6. Sin hipótesis: el origen se valora en su propia región.
      id: 'ro_step2c',
      tag: 'Paso 2c — Referido de Cadera o Columna Lumbar',
      question: '¿Reproduce el dolor de rodilla la exploración de la cadera o de la columna lumbar?',
      options: [
        { label: 'CADERA (artrosis) — Tratar el origen: valorar en la región Cadera', value: 'cadera', next: null, hypothesis: [] },
        { label: 'COLUMNA LUMBAR (radiculopatía o pseudorradiculopatía) — Tratar el origen: valorar en la región Lumbar', value: 'lumbar', next: null, hypothesis: [] },
        { label: 'NO — Ninguna de las dos reproduce el dolor de rodilla', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      id: 'ro_step3',
      tag: 'Paso 3 — Localización Específica del Dolor',
      question: '¿En qué zona se concentra el dolor de rodilla?',
      options: [
        { label: 'Anterior/Retrorrotuliano — Dolor al cargar en flexión (escaleras, sentadilla) en <40 años', value: 'pf', next: null, hypothesis: ['ro3'] },
        { label: 'Anterior/Polo inferior rótula — Dolor exacto en polo inferior, vinculado a saltos o frenadas', value: 'tend', next: null, hypothesis: ['ro5'] },
        { label: 'Lateral — Dolor en cóndilo femoral lateral que empeora al correr', value: 'it', next: null, hypothesis: ['ro6'] },
        { label: 'Medial/Distal — Dolor 2 cm distal a meseta tibial medial, empeora al subir escaleras', value: 'pata', next: null, hypothesis: ['ro7'] },
        { label: 'NINGUNA de estas — Seguir por zona', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, ANTERIOR (tendinopatía rotuliana y dolor FR ya están en ro_step3).
      id: 'ro_step4',
      tag: 'Paso 4 — Dolor Anterior Persistente',
      question: 'Dolor persistente o sin traumatismo, ANTERIOR: ¿qué lo explica?',
      options: [
        { label: 'HOFFA — Recurvatum, test de Hoffa', value: 'hoffa', next: null, hypothesis: ['ro13'] },
        { label: 'BURSITIS PRERROTULIANA — Superficial, arrodillarse', value: 'bursitis', next: null, hypothesis: ['ro14'] },
        { label: 'INESTABILIDAD ROTULIANA — Fallo, aprensión', value: 'rotula', next: null, hypothesis: ['ro12'] },
        { label: 'LESIÓN OSTEOCONDRAL — Bloqueo', value: 'osteocondral', next: null, hypothesis: ['ro16'] },
        { label: 'APOFISITIS POR TRACCIÓN — En menores', value: 'apofisitis', next: null, hypothesis: ['ro15'] },
        { label: 'NINGUNO — Sin dolor anterior o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, MEDIAL (bursitis anserina ya está en ro_step3).
      id: 'ro_step5',
      tag: 'Paso 5 — Dolor Medial Persistente',
      question: 'Dolor persistente o sin traumatismo, MEDIAL: ¿qué lo explica?',
      options: [
        { label: 'MENISCO MEDIAL', value: 'menisco', next: null, hypothesis: ['ro2'] },
        { label: 'ARTROSIS — Criterios ACR', value: 'artrosis', next: null, hypothesis: ['ro1'] },
        { label: 'PLICA MEDIAL', value: 'plica', next: null, hypothesis: ['ro17'] },
        { label: 'NINGUNO — Sin dolor medial o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, LATERAL (cintilla iliotibial ya está en ro_step3).
      id: 'ro_step6',
      tag: 'Paso 6 — Dolor Lateral Persistente',
      question: 'Dolor persistente o sin traumatismo, LATERAL: ¿qué lo explica?',
      options: [
        { label: 'TIBIOPERONEA PROXIMAL', value: 'tibioperonea', next: null, hypothesis: ['ro18'] },
        { label: 'MENISCO LATERAL', value: 'menisco', next: null, hypothesis: ['ro2'] },
        { label: 'NERVIO PERONEO COMÚN', value: 'peroneo', next: null, hypothesis: ['ro19'] },
        { label: 'NINGUNO — Sin dolor lateral o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    },
    {
      // Nodo 7, POSTERIOR.
      id: 'ro_step7',
      tag: 'Paso 7 — Dolor Posterior Persistente',
      question: 'Dolor persistente o sin traumatismo, POSTERIOR: ¿qué lo explica? Descartada siempre la TVP.',
      options: [
        { label: 'QUISTE POPLÍTEO — Signo de Foucher', value: 'quiste', next: null, hypothesis: ['ro20'] },
        { label: 'LCP CRÓNICO', value: 'lcp', next: null, hypothesis: ['ro9'] },
        { label: 'COLUMNA LUMBAR — Tratar el origen: valorar en la región Lumbar', value: 'lumbar', next: null, hypothesis: [] },
        { label: 'NINGUNO — Sin dolor posterior o nada de esto lo explica', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── RODILLA ─────────────────────────────────────────────
  ro1: {
    id: 'ro1', region: 'rodilla', num: '①',
    name: 'Artrosis de Rodilla',
    prom: 'KOOS (MCID: 7–9 pts distribución / 12–36 pts anchor según subescala)',
    dosis: 'Ejercicio terapéutico adaptado a la persona (por ejemplo, fortalecimiento local y forma física aeróbica general), para todos: recomendación firme (rec. 1.3.1). Valorar sesiones supervisadas (1.3.2) y combinarlo con educación o cambio de conducta en un paquete estructurado (1.3.4). Avisar de que el dolor puede aumentar al empezar y de que es la constancia a largo plazo la que reduce el dolor y mejora la función (1.3.3). Con sobrepeso, cualquier pérdida de peso ayuda, y el 10 % más que el 5 % (1.3.5). Terapia manual solo junto al ejercicio (1.3.6). No ofrecer acupuntura ni punción seca (1.3.8), ni TENS, ultrasonido, interferenciales, láser, onda corta pulsada o electroestimulación neuromuscular (1.3.9). Valorar ayudas para la marcha, como un bastón (1.3.10); plantillas, ortesis o vendajes solo si hay inestabilidad o carga anómala y el ejercicio solo no basta (1.3.11). La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico.',
    dosisFuente: 'NICE NG226 (2022; recomendaciones 1.3.1–1.3.11, leídas en nice.org.uk en 2026-10; NICE marca la fuerza con el verbo: «offer» = recomendación firme, «consider» = más débil, «do not offer» = no hacer)',
    pronostico: {
      horizonte: 'Kellgren-Lawrence u OARSI. La imagen sola engaña: en adultos de 40 años o más sin síntomas ni lesiones, la RM muestra defectos de cartílago en el 43 % y roturas de menisco en el 19 %. Criterios clínicos + imagen → S 0,91 · E 0,86 · LR+ 6,5 · LR− 0,10.',
      derivacion: 'Los criterios del ACR identifican mejor la artrosis avanzada: con criterios negativos en un cuadro incipiente, no descartes. La debilidad del cuádriceps es el factor modificable más potente.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 210–211; Culvenor 2019 (Br J Sports Med 53:1268–78; revisión sistemática con metaanálisis, 63 estudios, 5397 rodillas sin síntomas ni lesiones)'
    },
    tests: [
      { name: 'Criterio combinado: Edad ≥45 + dolor en actividad + rigidez <30 min', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hallazgo: es el diagnóstico clínico de NICE (edad ≥45, dolor con la actividad, sin rigidez matutina o ≤30 min), que no aporta sensibilidad ni especificidad. La S 95 % / E 69 % que figuraba es la que se daba a los criterios clínicos del ACR, que ya están en esta hipótesis.', fuente: 'NICE NG226 (2022)' },
      { name: 'Crepitación articular', sn: '89%', sp: '60%', lr_pos: '2.23', lr_neg: null, criterio: 'Alta sensibilidad pero poco específica. Crepitación al movimiento pasivo de la rodilla. Fiabilidad entre examinadores baja (kappa 0,23).', fuente: 'Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 4 estudios, 2 de casos y controles, n = 942; LR+ IC 95 %: 1,90–2,63)' },
      { name: 'Agrandamiento óseo', sn: '55%', sp: '95%', lr_pos: '11.81', lr_neg: null, criterio: 'Alta especificidad. Osteofitos palpables en los márgenes articulares.', fuente: 'Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 3 estudios, 1 de casos y controles, n = 3108; LR+ IC 95 %: 4,94–28,22)' },
      { name: 'Restricción de ROM', sn: '17%', sp: '96%', lr_pos: '4.4', lr_neg: null, criterio: 'Alta especificidad cuando está presente; normal no descarta.', fuente: 'Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 6 estudios, n = 3661; sin IC publicado)' },
      { name: 'Criterios clínicos del ACR', sn: '41%', sp: '75%', lr_pos: '1.6', lr_neg: '0.8', absorbe: [0, 1, 2], criterio: 'Dolor de rodilla la mayoría de los días del mes previo MÁS al menos 3 de — edad >50, rigidez <30 min, crepitación, dolor óseo a la palpación, aumento de tamaño óseo, sin calor palpable. Son criterios de clasificación: la S 95 % / E 69 % que figuraba sale de la muestra en la que se crearon (pacientes de reumatología, frente a artritis reumatoide y otras causas; Altman 1986). En población de 50 años o más con dolor de rodilla caen a S 41 % · E 75 % (LR+ 1,6 · LR− 0,8): casi no cambian la probabilidad. Reflejan sobre todo la artrosis avanzada: si no se cumplen, no la descartes. No puntúa, así que el criterio combinado, la crepitación y el agrandamiento óseo cuentan por separado.', fuente: 'Peat 2006 (Ann Rheum Dis 65:1363–7; transversal en población general, 788 personas de 50 años o más con dolor de rodilla; formato en árbol de los criterios; referencia: síntomas casi diarios + artrosis radiográfica; tabla 3: S IC 95 %: 35–47 %, E IC 95 %: 71–78 %)' },
      { name: 'Rango disminuido, hinchazón persistente, debilidad de cuádriceps', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rango disminuido, hinchazón persistente, debilidad de cuádriceps.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 211' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Subir o bajar un escalón, o levantarse de la silla → EVA. ② Sit-to-stand de 30 s con silla, brazos y apoyo fijos; o flexión en supino con goniómetro.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro2: {
    id: 'ro2', region: 'rodilla', num: '②',
    name: 'Lesión Meniscal',
    prom: 'KOOS (MCID: 7–36 pts según subescala)',
    dosis: 'Ejercicios de movilidad progresivos y supervisados, fuerza progresiva de rodilla y cadera y entrenamiento neuromuscular (B). Tras una meniscectomía parcial, ejercicio supervisado en consulta más un programa en casa cuya progresión supervisa el fisioterapeuta, con la educación necesaria (B), y electroestimulación neuromuscular para la fuerza del cuádriceps (B). La guía se centra en el posoperatorio y deja el tratamiento sin cirugía para su próxima revisión. No fija series, repeticiones ni semanas: el volumen queda a criterio del clínico.',
    dosisFuente: 'Logerstedt 2018, J Orthop Sports Phys Ther 48(2):A1–A50 (guía de práctica clínica APTA, lesiones de menisco y de cartílago articular; letra = grado de la recomendación, tal como la da la guía)',
    pronostico: {
      horizonte: 'RM o artroscopia. En roturas degenerativas, la meniscectomía parcial NO ha demostrado más beneficio que la fisioterapia.',
      derivacion: 'Tras una meniscectomía parcial por rotura degenerativa, el riesgo de artrosis radiográfica con síntomas a los 16 años es 7 veces el de controles emparejados (por rotura traumática, 2,7, sin significación). Solo el 30 % periférico está vascularizado, y disminuye con la edad. Jóvenes: mejores candidatos a reparación.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209–210; Englund 2003 (Arthritis Rheum 48:2178–87; 155 meniscectomías frente a 68 controles, 16 años; RR 7,0, IC 95 %: 2,1–23,5)'
    },
    tests: [
      { name: 'Test de McMurray', sn: '61%', sp: '84%', lr_pos: null, lr_neg: null, criterio: 'Rotación tibial + extensión de rodilla desde posición de flexión completa. Positivo: chasquido o dolor en línea articular. S IC 95 %: 45–74 %; E IC 69–92 %. En contra: Solomon 2001 (JAMA) da LR+ 1,3 (IC 0,9–1,7) y LR− 0,8.', fuente: 'Smith 2015 (Evid Based Med 20:88–97; metaanálisis, 9 estudios, n = 1234, calidad metodológica en general baja; referencia: artroscopia o RM)' },
      { name: 'Sensibilidad a la palpación de la línea articular', sn: '83%', sp: '83%', lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación directa de la línea articular medial o lateral. S IC 95 %: 73–90 %; E IC 61–94 %. En contra: Solomon 2001 (JAMA) da LR+ 0,9 y LR− 1,1.', fuente: 'Smith 2015 (Evid Based Med 20:88–97; metaanálisis, 9 estudios, n = 1234, calidad metodológica en general baja; referencia: artroscopia o RM)' },
      { name: 'Combinación de tests clínicos', sn: null, sp: null, lr_pos: '2.7', lr_neg: '0.4', criterio: 'Valoración global del examinador (historia + exploración) para rotura meniscal: rinde mejor que cada maniobra suelta (McMurray LR+ 1,3; línea articular 0,9 en la misma revisión).', fuente: 'Solomon 2001 (JAMA 286:1610–20, Rational Clinical Examination); LR+ IC 95 %: 1,4–5,1; LR− IC 0,2–0,7' },
      { name: 'Combinación traumática: traumatismo + dolor medial o difuso + palpación de la interlínea medial', sn: '91%', sp: '90%', lr_pos: '8.9', lr_neg: '0.10', absorbe: [1], criterio: 'Historia de caída o pivote en el traumatismo inicial + dolor medial aislado o difuso + palpación dolorosa de la interlínea medial → S 0,91 · E 0,90 · LR+ 8,9 (IC 6,1–13,1) · LR− 0,10 (IC 0,03–0,28). Grupo derivado sin validación externa (validación interna por bootstrap: LR+ 7,0, LR− 0,19). Si puntúa, la palpación de la interlínea no suma aparte.', fuente: 'Décary 2018 (PM&R; n = 279, 35 roturas traumáticas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Combinación degenerativa: inicio progresivo + dolor medial aislado + uno de tres', sn: null, sp: null, lr_pos: '6.4', lr_neg: null, criterio: 'Inicio progresivo + dolor medial aislado + dolor al pivotar (leve a grave), o bien inicio progresivo + dolor medial aislado + sin valgo ni varo o flexión pasiva completa → S 0,58 · E 0,91 · LR+ 6,4 (IC 4,0–10,4). Sirve para confirmar, no para descartar: la LR− 0,10 del artículo es de otros grupos de reglas (de descarte), no de este. Grupo derivado sin validación externa (bootstrap: LR+ 5,6).', fuente: 'Décary 2018 (PM&R; n = 279, 45 roturas degenerativas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Test de Thessaly', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'El capítulo lo cita entre las pruebas de rotura meniscal, junto con la palpación de la interlínea y el McMurray, sin describir la técnica ni dar cifras: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209 y 220' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión máxima con sobrepresión o cuclilla parcial → EVA. ② Grados de flexión hasta la aparición del dolor, en supino con la cadera a 90°.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro3: {
    id: 'ro3', region: 'rodilla', num: '③',
    name: 'Dolor Patelofemoral (Síndrome)',
    prom: 'KOOS-PF / Kujala / VISA-P',
    dosis: 'Ejercicio centrado en el cuádriceps y/o la cadera durante al menos 6 a 12 semanas, mejor con supervisión de fisioterapia al menos en parte, en un programa estructurado cuyo volumen e intensidad se ajustan al dolor (certeza baja); prioridad a la educación. Reevaluar dolor (EVA) y función (Kujala) a las 6 y a las 12 semanas. Vendaje, rodillera u ortesis plantar solo como añadido al ejercicio si a las 6–12 semanas no hay un cambio clínicamente relevante (certeza muy baja), informando al paciente de la falta de pruebas. Sin infiltraciones y con prudencia con los analgésicos. Si a las 12 semanas no mejora, reconsiderar el diagnóstico. La guía JOSPT de 2019 coincide en lo esencial: ejercicio combinado de cadera (musculatura posterolateral) y rodilla, en carga o sin carga, empezando si acaso por la cadera (A), y combinar intervenciones con el ejercicio como eje (A). Añade que no se usen punción seca ni terapia manual aislada (A), ni agentes físicos como ultrasonido, crioterapia, electroestimulación o láser (B), ni biofeedback (B); la reeducación de la carrera es opcional (C) y la educación sobre la carga, recomendable (F). Discrepan en los añadidos: la JOSPT admite vendaje rotuliano con el ejercicio a corto plazo (4 semanas, B) y ortesis plantares prefabricadas hasta 6 semanas si hay más pronación de lo normal (A), y desaconseja rodilleras y cintas (B); la holandesa, más reciente, los deja para cuando el ejercicio no basta tras 6–12 semanas, y es la que se sigue. Ninguna fija series ni repeticiones (la JOSPT dice que la dosis óptima no se conoce): el volumen queda a criterio del clínico.',
    dosisFuente: 'Ophey 2025, Knee Surg Sports Traumatol Arthrosc 33:457–469 (guía multidisciplinar holandesa, módulos 1–3; certeza GRADE como la da la guía) · Willy 2019, J Orthop Sports Phys Ther 49(9):CPG1–CPG95 (guía de práctica clínica APTA, resumen de recomendaciones, pp. CPG2–CPG3; letra = grado de la recomendación)',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la imagen solo sirve para descartar otras condiciones.',
      derivacion: 'Patogenia multifactorial. Se han descrito hiperalgesia generalizada y peor modulación del dolor: el modelo mecánico no lo explica todo.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 194–195'
    },
    tests: [
      { name: 'Dolor anterior durante sentadilla', sn: '91%', sp: '50%', lr_pos: '1.8', lr_neg: '0.2', criterio: 'Alta sensibilidad: sin dolor en sentadilla, el dolor femoropatelar es poco probable. Dolor retrorrotuliano o perirotuliano durante la sentadilla. Positiva confirma poco.', fuente: 'Nunes 2013 (Phys Ther Sport 14:54–9; revisión sistemática con metaanálisis, 5 estudios, 2 de buena calidad)' },
      { name: 'Confirmar: grupos de Décary (edad, localización del dolor, escaleras, faceta medial, extensión pasiva)', sn: null, sp: null, lr_pos: '8.70', lr_neg: null, criterio: 'Positivo si se cumple uno de los dos grupos. Grupo 1: menos de 40 años Y (dolor anterior aislado O dolor a la palpación de la faceta rotuliana medial). Grupo 2: de 40 a 58 años Y dolor anterior aislado o difuso Y dificultad leve o moderada para bajar escaleras Y dolor a la palpación de la faceta medial Y extensión pasiva completa (comparada a ojo con el lado sano). → S 0,64 · E 0,93 · LR+ 8,70 (IC 95 %: 5,20–14,58; bootstrap 14,28). No publica LR−: sirve para confirmar. Grupos derivados sin validación externa, que los autores piden antes del uso clínico.', fuente: 'Décary 2018 (Arch Phys Med Rehabil 99:607–614; n = 279 consultas por la rodilla, 75 con dolor femoropatelar; referencia: diagnóstico compuesto de médico experto con radiografía y, si hacía falta, RM; tabla 3)' },
      { name: 'Descartar: grupos de Décary (si se cumple alguno, marcar «Negativo»)', sn: null, sp: null, lr_pos: null, lr_neg: '0.12', criterio: 'Se cumple si hay uno de los tres grupos. Grupo 1: menos de 58 años Y dolor medial, lateral o posterior aislado Y sin dolor a la palpación de las facetas medial ni lateral. Grupo 2: menos de 58 años Y dolor difuso o lateral Y dolor a la palpación de la faceta medial o lateral Y extensión pasiva restringida. Grupo 3: 58 años o más. → descarta el dolor femoropatelar: S 0,92 · E 0,65 · LR− 0,12 (IC 95 %: 0,06–0,27; bootstrap 0,05). No publica LR+: un resultado positivo es solo un hallazgo. Grupos derivados sin validación externa.', fuente: 'Décary 2018 (Arch Phys Med Rehabil 99:607–614; n = 279 consultas por la rodilla, 75 con dolor femoropatelar; referencia: diagnóstico compuesto de médico experto con radiografía y, si hacía falta, RM; tabla 4)' },
      { name: 'Palpación alrededor de la FR, sobre todo de las facetas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La sentadilla es el test clínico propuesto; progresar la carga según irritabilidad: monopodal, step-down o más repeticiones. Palpación alrededor de la FR, sobre todo de las facetas.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 194' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Sentadilla bilateral o monopodal, o bajada de escalón, hasta donde tolere → EVA. ② Step-down desde escalón de altura fija: repeticiones en 30 s sin aumentar el dolor, o grados de flexión sin dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro4: {
    id: 'ro4', region: 'rodilla', num: '④',
    name: 'Lesión del Ligamento Cruzado Anterior (LCA)',
    prom: 'KOOS / IKDC (MCID: 12.2 pts)',
    dosis: 'En la lesión ligamentosa de rodilla, reeducación neuromuscular junto con el fortalecimiento (A); con insuficiencia del LCA puede usarse una ortesis funcional (C). Las demás recomendaciones son tras la reconstrucción: movilización inmediata, dentro de la primera semana (B); carga precoz según tolerancia (C); crioterapia en el posoperatorio inmediato (B); ejercicio supervisado en consulta más un programa en casa (B); ejercicios concéntricos y excéntricos, en carga y sin carga, desde las 4–6 semanas, 2 o 3 veces por semana durante 6 a 10 meses (A), y electroestimulación neuromuscular 6 a 8 semanas junto al fortalecimiento (A). Fuera del posoperatorio, la guía no fija volumen: queda a criterio del clínico.',
    dosisFuente: 'Logerstedt 2017, J Orthop Sports Phys Ther 47(11):A1–A47 (guía de práctica clínica APTA, esguince de ligamentos de rodilla; letra = grado de la recomendación, tal como la da la guía: A evidencia fuerte, C débil, F opinión de expertos)',
    pronostico: {
      horizonte: 'RM o artroscopia como patrón de referencia. El tratamiento no quirúrgico obtiene buenos resultados, pero casi el 75 % opta por la reconstrucción.',
      derivacion: 'Riesgo alto de nueva lesión los dos primeros años tras la reconstrucción, y mayor en quienes vuelven al deporte con déficits.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 206–207'
    },
    tests: [
      { name: 'Test de Lachman', sn: '81%', sp: '85%', lr_pos: '5.72', lr_neg: '0.24', criterio: 'Rodilla en 30° de flexión, traslación anterior de tibia con estabilización distal del fémur. Positivo: traslación anterior aumentada o sin punto firme. S IC 95 %: 73–87 %; E IC 73–92 %; LR+ IC 2,82–10,80; LR− IC 0,15–0,35. Rinde peor pasadas 3 semanas de la lesión (S 70 %, E 77 %) y en roturas completas (S 68 %, E 79 %). Los metaanálisis univariantes dan cifras más altas, que esta revisión considera sobrestimadas.', fuente: 'Sokal 2022 (Knee Surg Sports Traumatol Arthrosc 30:3287–303; revisión sistemática con metaanálisis bivariante, tabla 4: 12 estudios con S y E; LCA sin otras lesiones ligamentosas; referencia: artroscopia o RM)' },
      { name: 'Test de Cajón Anterior', sn: '83%', sp: '85%', lr_pos: '6.34', lr_neg: '0.20', criterio: 'Rodilla a 90° de flexión. Traslación anterior de tibia. S IC 95 %: 77–88 %; E IC 64–95 %; LR+ IC 2,32–15,30; LR− IC 0,14–0,30. En esta revisión rinde igual que el Lachman.', fuente: 'Sokal 2022 (Knee Surg Sports Traumatol Arthrosc 30:3287–303; revisión sistemática con metaanálisis bivariante, tabla 4: 12 estudios con S y E; LCA sin otras lesiones ligamentosas; referencia: artroscopia o RM)' },
      { name: 'Test de Pivot Shift', sn: '55%', sp: '94%', lr_pos: '10.70', lr_neg: '0.48', criterio: 'Roto-subluxación de la tibia con extensión + valgo + rotación interna. El más específico y el que más sube la probabilidad si es positivo (LR+ IC 95 %: 5,43–19,30), pero el menos sensible: negativo, apenas la baja (LR− IC 0,40–0,56). S IC 47–62 %; E IC 88–97 %.', fuente: 'Sokal 2022 (Knee Surg Sports Traumatol Arthrosc 30:3287–303; revisión sistemática con metaanálisis bivariante, tabla 4: 12 estudios con S y E; LCA sin otras lesiones ligamentosas; referencia: artroscopia o RM)' },
      { name: 'Lever Sign Test', sn: '83%', sp: '91%', lr_pos: '9.66', lr_neg: '0.18', criterio: 'Puño debajo de la rodilla — si el LCA está roto, el talón no se eleva. S IC 95 %: 68–92 %; E IC 83–95 %; LR+ IC 5,01–17,30; LR− IC 0,09–0,34. El que mejor descarta de los cuatro; en lesiones de menos de 3 semanas fue el más exacto.', fuente: 'Sokal 2022 (Knee Surg Sports Traumatol Arthrosc 30:3287–303; revisión sistemática con metaanálisis bivariante, tabla 4: 12 estudios con S y E; LCA sin otras lesiones ligamentosas; referencia: artroscopia o RM)' },
      { name: 'Confirmar: mecanismo de pivote + derrame inmediato + Lachman positivo', sn: null, sp: null, lr_pos: '17.5', lr_neg: null, absorbe: [0], criterio: 'Mecanismo de pivote + derrame inmediato tras el traumatismo + Lachman positivo → rotura COMPLETA: S 0,82 · E 0,95 · LR+ 17,5 (IC 9,8–31,5; bootstrap 12,4). No publica LR−: sirve para confirmar. Si puntúa, el Lachman no suma aparte.', fuente: 'Décary 2018 (PLoS One; n = 279, 22 roturas completas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Descartar: sin mecanismo de pivote ni chasquido + Lachman o pivot shift negativos (si se cumple, marcar «Negativo»)', sn: null, sp: null, lr_pos: null, lr_neg: '0.08', absorbe: [0, 2], criterio: 'Historia negativa de pivote o de chasquido en el traumatismo Y Lachman o pivot shift negativos → descarta rotura parcial o completa: S 0,93 · E 0,87 · LR− 0,08 (IC 0,03–0,24; bootstrap 0,11). No publica LR+: un resultado positivo es solo un hallazgo. Si puntúa, el Lachman y el pivot shift no suman aparte.', fuente: 'Décary 2018 (PLoS One; n = 279, 43 roturas parciales o completas; referencia: diagnóstico compuesto de médico experto con RM)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Apoyo monopodal o bajada de un escalón → EVA. Si predomina la inestabilidad, anotar episodios de fallo por semana. ② Déficit de extensión activa frente al lado sano, en supino con el talón sobre una toalla (grados).', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro5: {
    id: 'ro5', region: 'rodilla', num: '⑤',
    name: 'Tendinopatía Rotuliana',
    prom: 'VISA-P / KOOS',
    dosis: 'Plan en cuatro fases. 1) Control del dolor: educación y consejos de carga. 2) Progresión de fuerza: ejercicio de resistencia progresivo de cuádriceps durante al menos 12 semanas, ajustando la intensidad a cada paciente; de preferencia, resistencia pesada y lenta, aunque pueden usarse otras formas (por ejemplo, isométricos) para reducir la respuesta dolorosa del tendón. 3) Almacenamiento de energía: según el deporte, empezar con pliometría. 4) Mantenimiento de la fuerza. Si a las 12 semanas no hay un cambio clínicamente relevante, valorar una cinta infrarrotuliana. Sin infiltraciones y con prudencia con los analgésicos. Certeza muy baja en la guía; una revisión Cochrane posterior no puede asegurar que el ejercicio de fuerza alivie el dolor frente a no tratar (certeza muy baja; solo deportistas). Ninguna de las dos fija series ni repeticiones: el volumen queda a criterio del clínico.',
    dosisFuente: 'Ophey 2025, Knee Surg Sports Traumatol Arthrosc 33:457–469 (guía multidisciplinar holandesa, módulos 5–7; certeza GRADE muy baja) · Lopes 2025, Cochrane Database Syst Rev 5:CD013078 (revisión sistemática, 7 ensayos, 211 deportistas)',
    pronostico: {
      horizonte: 'Ecografía o RM. La alteración del tendón en imagen NO se correlaciona de forma constante con el dolor ni con la pérdida de función.',
      derivacion: 'Si los síntomas aparecen antes y tardan más en irse, ser más prudente al progresar. VISA-P como cuestionario, aparte de los tres números.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 192–193'
    },
    tests: [
      { name: 'Dolor localizado en polo inferior de rótula + palpación del tendón', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Diagnóstico clínico: dolor en el polo inferior de la rótula que depende de la carga Y, además, palpación dolorosa del polo inferior, test de Royal London positivo o dolor en el polo inferior en la sentadilla monopodal declinada. La precisión diagnóstica de la historia y la exploración no se conoce. En tendones con síntomas, la palpación es moderadamente sensible pero poco específica frente a la ecografía; en deportistas sin síntomas, un dolor leve a la palpación es normal.', fuente: 'Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Cook 2001 (Br J Sports Med 35:65–9; 326 tendones de jóvenes jugadores de baloncesto; referencia: ecografía)' },
      { name: 'Dolor durante sentadilla en tabla inclinada (decline squat)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentadilla monopodal sobre plano declinado: dolor en el polo inferior de la rótula. Es uno de los criterios diagnósticos de la guía holandesa. En 43 deportistas con dolor en el tendón, positiva tuvo LR+ 4,2 (IC 95 %: 2,3–7,1), pero para alteraciones del tendón en la ecografía, no para el diagnóstico de tendinopatía: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 192–193; Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Mendonça 2016 (J Orthop Sports Phys Ther 46:673–80; 43 deportistas con dolor en el tendón rotuliano; referencia: ecografía)' },
      { name: 'Ecografía o RM (si se dispone de informe)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Imagen confirmatoria si no hay respuesta al tratamiento. Engrosamientos y cambios de señal en el tendón. Estudio: ecografía S 87 %, E 82 %; RM S 57 %, E 82 %, pero frente a controles asintomáticos (confirma un diagnóstico clínico ya hecho): cuenta como hallazgo.', fuente: 'Warden 2007 (Am J Sports Med 35:427–36; 30 con tendinopatía rotuliana clínica frente a 33 asintomáticos)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Sentadilla monopodal sobre plano inclinado (o el escalón que tolere) → EVA. ② Repeticiones de sentadilla monopodal, mismo plano y cadencia, hasta el umbral de dolor; o grados de flexión antes del dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro6: {
    id: 'ro6', region: 'rodilla', num: '⑥',
    name: 'Síndrome de la Banda Iliotibial',
    prom: 'KOOS / LEFS (MCID: 8.4–22.5 pts)',
    dosis: 'El fortalecimiento de los abductores de cadera es el elemento común de los tratamientos que funcionan, mejor junto a terapia manual u ondas de choque; en un ensayo pequeño, el fortalecimiento multiplanar superó al convencional y a los estiramientos. La revisión sugiere 4 a 8 semanas de progresión gradual. Los estiramientos tienen poco respaldo, y la reeducación de la carrera es prometedora pero sin ensayos sólidos. Evidencia baja (13 estudios pequeños, solo corredores, sin metaanálisis) y sin guía de práctica clínica. No fija series ni repeticiones: el volumen queda a criterio del clínico.',
    dosisFuente: 'Sanchez-Alvarado 2024, Front Sports Act Living 6:1386456 (revisión sistemática; 13 estudios, 5 de ellos ensayos aleatorizados, 201 corredores)',
    pronostico: {
      horizonte: 'Diagnóstico clínico: la entrevista y la exploración completas suelen bastar. Las pruebas complementarias sirven para confirmar o descartar otras condiciones.',
      derivacion: 'La explicación clásica (fricción de la cintilla sobre el epicóndilo lateral) ha sido cuestionada: los estudios anatómicos apuntan a compresión contra el cuerpo graso muy inervado que hay debajo.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215–216'
    },
    tests: [
      { name: 'Test de Ober', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Decúbito lateral, cadera en abducción-extensión, rodilla 90°. Positivo si la rodilla no alcanza la camilla o hay dolor. Valora la flexibilidad de la cintilla y del tensor de la fascia lata; su sensibilidad y especificidad son desconocidas: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215 y 220' },
      { name: 'Test de Compresión de Noble', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Compresión de la BIT sobre el cóndilo femoral lateral a 30° de flexión. Positivo si reproduce el dolor característico. Su sensibilidad y especificidad son desconocidas: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215 y 220' },
      { name: 'Palpación a lo largo de la cintilla', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor localizado a la palpación a lo largo de la cintilla, sobre todo cerca del epicóndilo lateral y sobre el tubérculo de Gerdy.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215 y 220' },
      { name: 'Step-down lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dificultad o Trendelenburg.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 215' },
      { name: 'Test de Thomas', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Junto con el Noble y el Ober, provoca el dolor o valora la flexibilidad de la cintilla y del tensor de la fascia lata; su sensibilidad y especificidad son desconocidas: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215 y 220' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Step-down lateral, o la carrera o pedaleo reproducidos en consulta → EVA. ② Repeticiones de step-down lateral con altura fija hasta el umbral de dolor; o minutos de carrera hasta el dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro7: {
    id: 'ro7', region: 'rodilla', num: '⑦',
    name: 'Bursitis de la Pata de Ganso',
    prom: 'KOOS / EVA (MCID: 22.6 pts en escala 0-100)',
    dosis: '',
    tests: [
      { name: 'Dolor y tumefacción en cara medial de rodilla (inserción pata de ganso)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en la cara medial de la tibia proximal, sobre la inserción de la pata de ganso. Diagnóstico clínico; no se ha encontrado ningún estudio de precisión diagnóstica. Puede imitar una rotura del menisco medial: en una serie de RM de rodillas con dolor, la presentación más frecuente fue dolor a lo largo de la interlínea medial (prevalencia de la bursitis: 2,5 %).', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 211–212; Rennie y Saifuddin 2005 (Skeletal Radiol 34:395–8; revisión retrospectiva de 509 RM de rodillas con dolor)', noData: true },
      { name: 'Ecografía o RMN confirmatoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La imagen confirma la bursitis. En la ecografía de pacientes con artrosis sintomática de rodilla aparece en el 20 % de las rodillas, más en mujeres y a más edad, y mayor cuanto más avanzada la artrosis.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 211–212; Uysal 2015 (Clin Rheumatol 34:529–33; ecografía de 170 rodillas de 85 pacientes con artrosis sintomática)', noData: true },
      { name: 'Flexión de rodilla en carga y palpación de la pata de ganso', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor reproducido con la flexión de rodilla EN CARGA y con la palpación de la pata de ganso (cara medial superior de la tibia).', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 212' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Flexión de rodilla en carga (bajar un escalón) o palpación de la pata de ganso → EVA. ② Repeticiones de subida y bajada de un escalón de altura fija hasta el umbral de dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  // ─── Tarjeta de consulta rodilla (guía de consulta): SINDROMES sin hipótesis
  // (ro8–ro16) y entidades de la ORIENTATIVA (ro17–ro20). Sin dosis en la guía: las que hay
  // salen de las guías JOSPT (ro8–ro10) y del consenso ESSKA (ro12).
  ro8: {
    id: 'ro8', region: 'rodilla', num: '⑧',
    name: 'Lesión del Ligamento Colateral Medial (LCM)',
    prom: 'IKDC subjetivo',
    dosis: 'Reeducación neuromuscular junto con el fortalecimiento (A). En la lesión grave del LCM puede usarse una ortesis adecuada (F). La guía no fija volumen: queda a criterio del clínico.',
    dosisFuente: 'Logerstedt 2017, J Orthop Sports Phys Ther 47(11):A1–A47 (guía de práctica clínica APTA, esguince de ligamentos de rodilla; letra = grado de la recomendación, tal como la da la guía: A evidencia fuerte, C débil, F opinión de expertos)',
    pronostico: {
      horizonte: 'RM como patrón de referencia.',
      derivacion: 'La lesión aislada se maneja sin cirugía, con vuelta a la actividad en 2–5 semanas.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 208'
    },
    tests: [
      { name: 'Valgo forzado a 30° de flexión + mecanismo de la entrevista', sn: '56%', sp: '91%', lr_pos: '6.4', lr_neg: '0.5', criterio: 'Valgo forzado a 30° de flexión. Combinar el mecanismo de la entrevista (al menos uno de: traumatismo por fuerza externa sobre la pierna, traumatismo en rotación) con dolor Y laxitud en el test → S 0,56 · E 0,91 · LR+ 6,4 (IC 2,7–15,2) · LR− 0,5 (IC 0,3–0,8). Atención primaria, 18–65 años, dentro de las 5 semanas del traumatismo.', fuente: 'Kastelein 2008 (Am J Med; n = 134, 35 con lesión del LCM; referencia: RM)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Valgo forzado a 30°, o el gesto de apoyo o giro que reproduce el dolor → EVA. ② Arco de flexión activa indoloro, con goniómetro en supino con la cadera a 0°.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro9: {
    id: 'ro9', region: 'rodilla', num: '⑨',
    name: 'Lesión del Ligamento Cruzado Posterior (LCP)',
    prom: 'IKDC subjetivo',
    dosis: 'Reeducación neuromuscular junto con el fortalecimiento (A). En la lesión aguda del LCP puede usarse una ortesis adecuada (F). La guía no fija volumen: queda a criterio del clínico.',
    dosisFuente: 'Logerstedt 2017, J Orthop Sports Phys Ther 47(11):A1–A47 (guía de práctica clínica APTA, esguince de ligamentos de rodilla; letra = grado de la recomendación, tal como la da la guía: A evidencia fuerte, C débil, F opinión de expertos)',
    pronostico: {
      horizonte: 'RM de elección. En urgencias, el 95 % de las lesiones del LCP son combinadas.',
      derivacion: 'Las lesiones de LCP grado III se asocian a lesión de la EPL. Siempre que se sospeche LLE, explorar la EPL.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 216 y 221–222'
    },
    tests: [
      { name: 'Cajón posterior a 90° de flexión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Carga tibial posterior comparando con la rodilla sana. Grados: I <5 mm · II 5–10 mm · III >10 mm.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 222' },
      { name: 'Signo del sag posterior', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino, rodillas a 90° y pies apoyados; hundimiento de la tibia proximal visto de lado.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 222' },
      { name: 'Test activo del cuádriceps', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supino, rodilla a 90° y pie fijo contra la camilla; contracción del cuádriceps. Positivo: la tibia, subluxada hacia atrás, se desplaza 2 mm o más hacia delante. El cajón posterior es la prueba con mejor sensibilidad y especificidad, sin cifras en el capítulo.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 222' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Arrodillarse o bajar un escalón → EVA. ② Grados de flexión activa tolerados sin dolor, en sedestación al borde de la camilla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro10: {
    id: 'ro10', region: 'rodilla', num: '⑩',
    name: 'Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL)',
    prom: 'IKDC subjetivo',
    dosis: 'Reeducación neuromuscular junto con el fortalecimiento (A). En la lesión de la esquina posterolateral puede usarse una ortesis adecuada (F). La guía no trata cuándo operar las lesiones de grado III o combinadas, ni fija volumen: el volumen queda a criterio del clínico.',
    dosisFuente: 'Logerstedt 2017, J Orthop Sports Phys Ther 47(11):A1–A47 (guía de práctica clínica APTA, esguince de ligamentos de rodilla; letra = grado de la recomendación, tal como la da la guía: A evidencia fuerte, C débil, F opinión de expertos)',
    pronostico: {
      horizonte: 'RM de elección. En urgencias, el 95 % de las lesiones del LCP son combinadas.',
      derivacion: 'Las lesiones de LCP grado III se asocian a lesión de la EPL. Siempre que se sospeche LLE, explorar la EPL. NO usar el varo forzado como prueba de descarte: S 25 %, sin E publicada. Un test negativo no descarta la lesión de LLE/EPL.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 216 y 221–222'
    },
    tests: [
      { name: 'Hinchazón y equimosis laterales; palpación dolorosa del ligamento', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchazón y equimosis laterales en fase aguda; palpación dolorosa del ligamento.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 216' },
      { name: 'Varo forzado a unos 30° de flexión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Laxitud y pérdida del tope firme; repetir a 0° para valorar el LCA. NO usar como prueba de descarte: S 25 %, sin E publicada; un test negativo no descarta la lesión de LLE/EPL.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 216' },
      { name: 'Marcha con empuje en varo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observación de la marcha.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 219–220' },
      { name: 'Test del dial (esquina posterolateral)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Prono, comparar la rotación externa de las dos rodillas: más de 10° de diferencia con la rodilla a 30° de flexión indica lesión de la esquina posterolateral.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 219' },
      { name: 'Cajón posterolateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Fuerza posterior y torsión en rotación externa con el pie a 15° de rotación externa. Positivo: más rotación externa que en el otro lado.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 219' },
      { name: 'Test de recurvatum', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rodilla en extensión, se estabiliza el muslo y se levanta el primer dedo del pie: positivo si el talón sube más (hiperextensión) que en el otro lado.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 219' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Varo forzado a 30° o el gesto en carga que provoca el fallo → EVA. ② Tiempo de apoyo monopodal tolerado sin dolor ni fallo, descalzo y sin apoyo de manos.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro11: {
    id: 'ro11', region: 'rodilla', num: '⑪',
    name: 'Fracturas (Rótula o Meseta Tibial)',
    prom: 'KOOS-12',
    dosis: DOSIS_DERIVAR,
    pronostico: {
      horizonte: 'Rótula: radiografía AP y lateral; TC en conminutas. Meseta: radiografía primero, TC para clasificar, RM si se sospecha lesión meniscal o ligamentosa.',
      derivacion: 'Valorar siempre la función neurovascular (pulsos, índice tobillo-brazo y cribado neurológico), sobre todo si refiere cambios de temperatura, adormecimiento, parestesias o debilidad.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 197–198'
    },
    tests: [
      { name: 'Regla de Ottawa antes de nada', sn: '98%', sp: '43%', lr_pos: null, lr_neg: '0.12', criterio: 'Radiografía si hay ALGUNO de los cinco: ≥55 años · dolor a la palpación de la cabeza del peroné · dolor aislado a la palpación de la rótula · no flexiona hasta 90° · no carga cuatro pasos. Positiva = algún criterio; negativa = ninguno. Revisión sistemática más reciente (18 estudios, 6702 adultos): S 98 % (IC 95 %: 96–99 %), E 43 % (IC 42–45 %), LR− 0,12 (IC 0,05–0,26): una regla negativa descarta la fractura y baja esta hipótesis; una positiva (LR+ 1,56) no la confirma y cuenta como hallazgo, pero obliga a la radiografía (paso 1b del árbol). Las dos revisiones anteriores dan cifras parecidas (LR− 0,05 y 0,07). Solo en lesión aguda y en adultos (las revisiones no incluyen niños). Detecta fracturas, no roturas del aparato extensor: la elevación de la pierna extendida se explora aparte.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197; Kazemi 2023 (Arch Acad Emerg Med 11:e30; revisión sistemática con metaanálisis, 18 estudios, 6702 adultos); Sims 2020 (Eur Radiol 30:4438–46; 8 estudios, 7385 adultos: S 99 %, E 49 %, LR− 0,07); Bachmann 2004 (Ann Intern Med 140:121–4; 6 estudios, 4249 adultos: S 98,5 %, E 48,6 %, LR− 0,05)' },
      { name: 'Rótula: dolor localizado, escalón, dolor con extensión resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor localizado, posible escalón, dolor con extensión resistida, marcha con rodilla rígida.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197' },
      { name: 'Meseta: dolor exquisito sobre el foco y función neurovascular', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hinchada y enrojecida, dolor exquisito sobre el foco, rango limitado, cojera marcada; valorar SIEMPRE la función neurovascular.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 198' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① No procede en fase aguda: derivar. Tras el alta traumatológica, el gesto que reproduce el dolor → EVA. ② Tras el alta: déficit de extensión activa frente al lado sano (grados), o tiempo de apoyo monopodal.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro12: {
    id: 'ro12', region: 'rodilla', num: '⑫',
    name: 'Inestabilidad Rotuliana',
    prom: 'KOOS-12',
    dosis: 'Primera luxación: tratamiento conservador solo si el riesgo de recidiva es bajo y no hay lesión condral u osteocondral (C); con el esqueleto inmaduro, hablar siempre de la cirugía con el paciente y la familia (C). Ninguna ortesis ha demostrado ser mejor que no llevarla; como mucho, una sin limitar el rango y muy poco tiempo en la fase aguda (B). Ejercicio guiado por fisioterapia como complemento necesario, con o sin cirugía (C): fuerza de cuádriceps y glúteos, movilidad, reeducación de la marcha, control neuromuscular funcional y entrenamiento específico del deporte. Tras el tratamiento conservador, al menos un 25 % vuelve a luxarse (hasta un 70 % en niños y adolescentes) (B). El consenso no fija volumen: queda a criterio del clínico.',
    dosisFuente: 'Balcarek 2025, Knee Surg Sports Traumatol Arthrosc 33(12):4197–4206 (consenso formal de la ESSKA, publicado en 2025, sobre la primera luxación de rótula, parte 2; letra = grado: B presunción científica, C bajo nivel científico)',
    pronostico: {
      horizonte: 'La entrevista y la exploración completas bastan para el diagnóstico. La imagen sirve para identificar factores predisponentes (ángulo Q aumentado, rótula alta, tróclea displásica) o para descartar fracturas y lesiones osteocondrales; el ligamento femororrotuliano medial se ve en RM.',
      derivacion: 'La displasia troclear dificulta la contención de la rótula; laxitud ligamentosa y desequilibrio de tejidos blandos alteran la línea de tracción. Con el ligamento femororrotuliano medial dañado, la cintilla iliotibial tiende a llevar la rótula hacia lateral en la flexión.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 195–196'
    },
    tests: [
      { name: 'Tests de estrés tibiofemoral normales', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si hay traumatismo, diferenciar de la inestabilidad tibiofemoral: los test de estrés tibiofemoral deben ser normales.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 195' },
      { name: 'Movilidad rotuliana excesiva', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La movilidad rotuliana estará aumentada en al menos una dirección. Movilidad excesiva: el borde medial de la rótula llega al borde lateral del surco troclear.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 195–196' },
      { name: 'Test de aprensión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aprensión al trasladar la rótula lateralmente.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 196' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El gesto que provoca la aprensión o el fallo → EVA; si no hay dolor, episodios de fallo por semana. ② Fuerza de extensión frente al lado sano, en sedestación a 60° de flexión, siempre con la misma prueba.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro13: {
    id: 'ro13', region: 'rodilla', num: '⑬',
    name: 'Síndrome de la Grasa de Hoffa',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'RM: edema, sangrado y fibrosis en el cuerpo graso en fases iniciales; en casos avanzados, metaplasia osteocondral en radiografía o TC.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 202–203'
    },
    tests: [
      { name: 'Observación: genu recurvatum', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Suelen estar de pie en hiperextensión (genu recurvatum).', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 202' },
      { name: 'Test de Hoffa', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Rodilla pasiva entre 30 y 60°, presión firme sobre el cuerpo graso bajo la rótula, medial o lateral al tendón, y llevar pasivamente a extensión final. Positivo si reproduce el dolor familiar. Repetir al otro lado del tendón.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 202' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Contracción isométrica del cuádriceps en extensión completa, o el test de Hoffa → EVA. ② Grados de extensión pasiva tolerados sin dolor, en supino con el talón elevado sobre una toalla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro14: {
    id: 'ro14', region: 'rodilla', num: '⑭',
    name: 'Bursitis Pre e Infrarrotuliana',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'El diagnóstico clínico suele bastar. Para diferenciar séptica de aséptica o descartar otras condiciones: la analítica y la aspiración del líquido muestran leucocitos, PCR y VSG elevados en la séptica; la ecografía permite ver la bursa y los tejidos blandos de alrededor.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 203–205'
    },
    tests: [
      { name: 'Fiebre >37,7 °C (séptica → urgencia)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PRIMERO diferenciar séptica de aséptica: la fiebre >37,7 °C solo se ha descrito en la séptica → urgencia (fase 2).', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 203' },
      { name: 'Hinchazón en la propia bursa y arrodillarse intolerable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Aséptica: dolor localizado, hinchazón EN LA PROPIA BURSA (no difusa), dolor con flexión activa y pasiva, arrodillarse intolerable. Integridad articular normal.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 203–204' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Apoyar la rodilla en el suelo, o la flexión activa máxima → EVA. ② Grados de flexión activa hasta la aparición del dolor, en sedestación al borde de la camilla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro15: {
    id: 'ro15', region: 'rodilla', num: '⑮',
    name: 'Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson)',
    prom: 'KOOS-12',
    dosis: 'Solo Osgood-Schlatter: el estudio excluyó el Sinding-Larsen-Johansson. Semanas 0–4: dejar el deporte y las actividades que reproducen el dolor; isométrico de cuádriceps contra la pared 10 × 30 s al día con cada pierna, y puente con los dos pies 3 × 10 cada 2 días. Desde la semana 5, cada 2 días: (1) sentadilla apoyado en la pared, 5 repeticiones manteniendo hasta 20 s, y una repetición más por sesión hasta 10; (2) sentadilla de 3 s bajando, 10 s mantenida y 3 s subiendo, añadiendo series hasta 4 × 10; (3) añadir zancadas. En paralelo, escalera de 11 escalones de actividad (caminar o bici suave → caminar rápido o bici media → carrera lenta → escaleras → carrera media → skipping → saltos → carrera rápida, giros y saltos → calentamiento + media sesión → calentamiento + sesión → partido): subir un escalón solo con dolor ≤2/10 durante la actividad y a la mañana siguiente, y bajar uno si empeora; la sentadilla (nivel 2) sin pasar de 2/10 antes del escalón 3; vuelta completa tras 2 semanas de entrenamiento completo sin dolor. 4 visitas en 12 semanas, con los padres. Resultados: 80 % con éxito a las 12 semanas y 90 % al año; vuelta al deporte del 16 % a las 12 semanas y del 69 % al año.',
    dosisFuente: 'Rathleff 2020, Orthop J Sports Med 8(4):2325967120911106 (serie de casos, n = 51, 10–14 años, sin grupo control: nivel de evidencia 4; pauta de su apéndice 1)',
    pronostico: {
      horizonte: 'La exploración suele bastar; radiografía si hace falta, y ayuda a descartar fractura aguda y tumor.',
      derivacion: 'El Sinding-Larsen-Johansson es generalmente autolimitado. Entrenar en otras modalidades o en piscina reduce intensidad y duración.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 200–201'
    },
    tests: [
      { name: 'Cadera primero', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'PRIMERO la cadera (epifisiólisis, Perthes: paso 2b).', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 201' },
      { name: 'Palpación de la tuberosidad tibial o del polo inferior de la rótula', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tuberosidad tibial dolorosa y visiblemente aumentada (Osgood-Schlatter), o polo inferior de la rótula doloroso sin dolor a lo largo del tendón (Sinding-Larsen).', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 200–201' },
      { name: 'Sentadillas, escaleras, step-down, saltos y extensión resistida', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentadillas, escaleras, step-down y saltos dolorosos. Extensión resistida dolorosa y débil.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 200–201' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Bajada de escalón o sentadilla monopodal → EVA. ② Fuerza de extensión resistida en sedestación a 60° frente al lado sano, o repeticiones de step-down con altura fija.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro16: {
    id: 'ro16', region: 'rodilla', num: '⑯',
    name: 'Lesión Osteocondral',
    prom: 'IKDC subjetivo',
    dosis: '',
    tests: [
      { name: 'Palpación de la zona afectada', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Depende de la estabilidad. Dolor a la palpación de la articulación en la zona afectada.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 199' },
      { name: 'Marcha antiálgica', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Marcha antiálgica con menos flexión en la respuesta de carga.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 199' },
      { name: 'Signos de inestabilidad: derrame y bloqueo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si es inestable: derrame y signos mecánicos de bloqueo con rango disminuido → imagen (radiografía de elección) y derivación: las lesiones inestables y los cuerpos libres son indicación quirúrgica.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 199; Mohr 2024 (StatPearls, NBK538194)' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Cuclilla o el gesto de impacto que reproduce el dolor → EVA. ② Grados de flexión activa en supino hasta el dolor o el tope mecánico.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro17: {
    id: 'ro17', region: 'rodilla', num: '⑰',
    name: 'Plica Sinovial Medial',
    prom: 'KOOS-12',
    dosis: '',
    tests: [
      { name: 'Test de provocación de la plica rotuliana medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Es la mejor forma de diagnosticarlo en consulta. Técnica (test MPP): supino, rodilla extendida; presión con el pulgar sobre la porción inferomedial de la femororrotuliana y, manteniéndola, flexionar a 90°. Positivo: dolor en extensión que desaparece o disminuye mucho a 90°; comparar con el otro lado. Kim 2007 da S 89,5 % · E 88,7 % frente a artroscopia (la tarjeta redondea a S 0,90 · E 0,89 · LR+ 8,18 · LR− 0,11), pero no puntúa: toda la especificidad sale de los controles con dolor en la interlínea lateral. En el grupo con dolor anteromedial, las 13 rodillas sin plica patológica (7 pinzamientos de franjas sinoviales de la grasa de Hoffa, 5 sinovitis localizadas, 1 lesión de cartílago) dieron el test positivo: E 0 de 13 en el diagnóstico diferencial real. Además, nivel III, no consecutivos y test hecho por su autor sin cegamiento. Cuenta como hallazgo compatible.', fuente: 'Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① El test de provocación de la plica, o la flexión repetida que reproduce el chasquido → EVA. ② Grados de flexión activa hasta el dolor o el enganche, en sedestación al borde de la camilla.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro18: {
    id: 'ro18', region: 'rodilla', num: '⑱',
    name: 'Disfunción de la Articulación Tibioperonea Proximal',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'Radiografía de rodilla en AP y lateral para valorar la patología articular. TC si la radiografía no aclara el diagnóstico.',
      derivacion: 'La articulación puede ser continua con la tibiofemoral: una presión elevada afecta a las dos. Entre sus causas, además de artrosis e inestabilidad, hay otras condiciones patológicas graves.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 216–217'
    },
    tests: [
      { name: 'Presión directa sobre la cabeza del peroné y movilidad accesoria', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor lateral que aumenta con la presión directa sobre la cabeza del peroné o con la movilidad accesoria.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 217' },
      { name: 'Movimiento de rodilla con isquiotibiales en tensión y movimiento de tobillo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Movimiento de rodilla doloroso sobre todo con los isquiotibiales en tensión, y movimiento de tobillo doloroso.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 217' },
      { name: 'Cabeza del peroné prominente, hipermovilidad o luxación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Cabeza del peroné prominente; hipermovilidad o luxación franca.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 217 y 220' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Presión directa sobre la cabeza del peroné, o el gesto en carga que reproduce el dolor → EVA. ② Grados de flexión activa en prono hasta el dolor, y flexión dorsal de tobillo frente al lado sano.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro19: {
    id: 'ro19', region: 'rodilla', num: '⑲',
    name: 'Neuropatía del Nervio Peroneo Común',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'Conducción nerviosa y EMG confirman el diagnóstico y ayudan a establecer el pronóstico. Ecografía útil por lo superficial del nervio.',
      derivacion: 'Neurapraxia: pronóstico excelente. Axonotmesis: recuperación parcial o completa. Neurotmesis: mínima. A partir de 4 semanas de compresión aparecen inflamación y cicatriz que enlentecen más la conducción.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 218'
    },
    tests: [
      { name: 'Marcha en steppage', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Observación de la marcha.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 218' },
      { name: 'Sensibilidad en la cara lateral inferior de la pierna y el dorso del pie', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sensibilidad alterada en la cara lateral inferior de la pierna y el dorso del pie.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 218' },
      { name: 'Fuerza de eversión y de flexión dorsal de tobillo y dedos', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Debilidad de eversión y de flexión dorsal de tobillo y dedos.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 218' },
      { name: 'Tinel cerca de la cabeza del peroné', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Tinel o dolor a la palpación cerca de la cabeza del peroné.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 218' },
      { name: 'Prueba neurodinámica con sesgo peroneo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Slump o elevación de la pierna recta con sesgo hacia el nervio peroneo: probablemente positiva, reproduce quemazón, dolor lancinante o disestesia distal.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 218 y 220' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Si hay dolor, la posición o prueba que lo reproduce (cruzar las piernas, cuclillas, neurodinámica) → EVA. ② Fuerza de flexión dorsal frente al lado sano, misma posición; o repeticiones de elevación del antepié en bipedestación.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
  ro20: {
    id: 'ro20', region: 'rodilla', num: '⑳',
    name: 'Quiste Poplíteo (Baker)',
    prom: 'KOOS-12',
    dosis: '',
    pronostico: {
      horizonte: 'RM de referencia; ecografía como primera opción, sobre todo para diferenciarlo de una TVP. Se encuentra en el 38 % de las RM de rodillas sintomáticas.',
      derivacion: 'El 94 % en adultos se asocia a un trastorno intraarticular: no es un diagnóstico de exclusión. Ante duda con tromboflebitis, derivar.',
      fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 223–224'
    },
    tests: [
      { name: 'Signos de patología meniscal o condral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La exploración suele mostrar signos de patología meniscal o condral. Descartada siempre la TVP.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 223' },
      { name: 'Signo de Foucher', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Si es palpable: firme en extensión completa y blando con la rodilla flexionada.', fuente: 'Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 223' },
      { name: 'Gesto testigo (①) y medida objetiva (②)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: '① Extensión final de rodilla o flexión máxima → EVA. ② Grados de flexión activa en prono hasta el tope o el dolor.', fuente: 'Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)' }
    ]
  },
};
