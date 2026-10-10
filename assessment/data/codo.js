// ============================================================
// PhysiQ-Assessment · data/codo.js
// Contenido clínico de la región CODO: cribado sistémico (fase 2),
// árbol CIF (fase 4) e hipótesis con sus tests (fase 4b). data.js lo reúne
// con las demás regiones en SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES;
// los esquemas de cada objeto están documentados allí.
// ============================================================
import { SIS_POSQUIRURGICO, SIS_ENDOCRINO, SIS_HEMATOLOGICO, DOSIS_DERIVAR } from './comun.js';

// ── Fase 2 · SYSTEMIC_SCREENING.codo
export const screening = {
  label: 'Codo y Antebrazo',
  sistemas: [
    SIS_POSQUIRURGICO,   // solo con mecanismo Post-quirúrgico (docs/posquirurgico.md)
    {
      id: 'co_trauma', icon: '🦴', nombre: 'Traumático (Fractura o Luxación)',
      banderasRojas: [
        'Caída o golpe reciente y el codo no llega a estirarse del todo: casi un 50 % de fracturas (Appelboam 2008; Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94)',
        'Deformidad del codo tras una caída (luxación), o mano dormida, fría o pálida: compromiso neurovascular (Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 93)',
        'Niño pequeño que no mueve el brazo tras un tirón (pronación dolorosa): descartar una fractura o una infección (Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94)'
      ],
      banderasAmarillas: [],
      preguntas: [
        { id: 'co_t1', notaPosquirurgica: true, urgencia: 'Sospecha de fractura tras un traumatismo (el codo no llega a estirarse del todo: casi un 50 % de fracturas): derivación hoy para radiografía, sin forzar la extensión.', text: '¿Se ha caído o se ha dado un golpe en el codo en los últimos días y no consigue estirarlo del todo? (Prueba de extensión del codo: brazos al frente con las palmas hacia arriba, comparar con el otro lado.)', alerta: true, s1: true,
          razonamiento: {
            porque: 'Tras una caída o un golpe, una fractura del codo (en adultos, sobre todo de la cabeza del radio) llena de líquido la articulación, y un codo con derrame agudo se mantiene en flexión: no llega a estirarse del todo. La prueba de extensión del codo aprovecha ese signo para decidir quién necesita una radiografía.',
            peso: 'Pesa: en el estudio de validación de Appelboam (1740 pacientes de urgencias), quien no conseguía estirar del todo el codo tenía casi un 50 % de probabilidad de fractura, y debe derivarse para radiografía; Lluch indica que las fracturas agudas requieren atención médica. Si lo estira del todo, la fractura es muy improbable en el adulto (LR− 0,03) y algo menos segura en el niño (LR− 0,11); aun así, una fractura del olécranon puede permitir la extensión.',
            detalle: 'La prueba (Appelboam 2008): sentado, con los brazos descubiertos y en supinación, el paciente flexiona los hombros a 90° y estira y bloquea los dos codos; se comparan los dos lados a la vista. Se validó en lesiones de menos de 72 horas, excluyendo a quien ya tenía la extensión limitada, alteración del estado mental, varias lesiones o sospecha de lesión intencionada.\n\nResultados: de 1740 adultos y niños, 602 estiraban del todo el codo (17 fracturas) y 1138 no (521 fracturas). S 96,8 % y E 48,5 % (LR+ 1,9). Con extensión completa, un 1,6 % de los adultos (LR− 0,03, IC 0,01–0,08) y un 4,2 % de los niños (LR− 0,11, IC 0,06–0,19) tenían una fractura. Las más frecuentes fueron la de la cabeza del radio en el adulto (64 %) y la supracondílea en el niño (48 %).\n\nCautelas: con extensión completa, se puede diferir la radiografía si se está seguro de que no hay una fractura del olécranon (dos de los adultos con extensión completa la tenían y necesitaron cirugía), y el paciente debe volver si no ha mejorado en 7–10 días; en niños, más precaución por las fracturas supracondíleas ocultas (Appelboam 2008; Lluch 2020). Lluch describe la fractura de la cabeza del radio como la más frecuente del codo, típica de la caída sobre el brazo extendido con valgo. Goodman pide atención médica inmediata ante un traumatismo cuyos síntomas no se resuelven o con un dolor desproporcionado (fractura, síndrome compartimental).\n\nQué hacer con un SÍ: no forzar la extensión, explorar la sensibilidad, el color y la temperatura de la mano y derivar para radiografía.',
            fisiologia: {
              pasos: [
                'En una caída sobre el brazo extendido, el valgo comprime la cabeza del radio contra el húmero y puede romperla o romper su cuello; un golpe directo o el tirón de un ligamento o un tendón rompen otras zonas.',
                'Tras la lesión se acumula líquido dentro de la articulación (en el estudio de Appelboam, también derrames sin fractura): aumenta el volumen dentro de la cápsula.',
                'Para dar cabida a ese volumen, el codo se mantiene en flexión.',
                'Por eso, tras una fractura, el codo casi nunca llega a estirarse del todo: en el estudio de Appelboam, 521 de las 538 fracturas no lo conseguían.',
                'Una fractura del olécranon puede permitir la extensión completa; por eso, si se sospecha, la extensión normal no basta para descartarla.'
              ],
              nota: 'Las fuentes leídas describen que el codo con derrame agudo se mantiene en flexión, pero no explican con detalle por qué no puede extenderse.',
              metafora: 'Como una bolsa llena de agua metida en una bisagra: con tanto volumen dentro, la bisagra se queda doblada.'
            },
            fuentes: ['Appelboam 2008', 'Lluch 2020', 'Goodman 2018'],
            citas: [
                { texto: 'Appelboam 2008 — Appelboam, Reuben, Benger et al., «Elbow extension test to rule out elbow fracture: multicentre, prospective validation and observational study of diagnostic accuracy in adults and children», BMJ 337:a2428 (estudio prospectivo multicéntrico, 1740 pacientes).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2600962/' },
                'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 86, 89 y 93–94.',
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, p. 704.'
            ]
          } },
        { id: 'co_t2', notaPosquirurgica: true, urgencia: 'Sospecha de luxación o compromiso neurovascular tras un traumatismo: explorar sensibilidad, color y temperatura de la mano, no movilizar el codo y derivar hoy.', text: '¿Tras una caída o un golpe, el codo se ve deformado, o la mano está dormida, fría o pálida?', alerta: true, s1: true,
          razonamiento: {
            porque: 'El codo es la segunda articulación que más se luxa, después del hombro, casi siempre por una caída sobre la mano extendida. El hueso desplazado deforma el codo y puede atrapar los nervios y los vasos que lo cruzan: de ahí la mano dormida, fría o pálida.',
            peso: 'Alto: Lluch indica que las fracturas y luxaciones agudas requieren atención médica y que la exploración neurovascular es crítica justo después de una luxación. Goodman pide atención médica inmediata ante un traumatismo con dolor desproporcionado (fractura, síndrome compartimental). Derivación inmediata.',
            detalle: 'Luxación (Lluch 2020): del 10 al 25 % de las lesiones del codo, casi el doble en varones de 10 a 19 años; por una caída sobre la mano extendida o en el deporte. Aunque no haya fractura (luxación simple), puede asociar una lesión importante de las partes blandas y dejar inestabilidad recurrente, incluida la rotatoria posterolateral. Tras reducirla, los nervios y vasos se siguen vigilando, porque el edema y los cambios del hueso y las partes blandas al curar pueden comprometerlos.\n\nFracturas complejas (Lluch 2020): las supracondíleas e intercondíleas del húmero distal aparecen en traumatismos de alta energía (bicicleta de montaña, monopatín). En los niños, la supracondílea es la fractura del codo más frecuente (48 % en Appelboam 2008).\n\nNiños: la pronación dolorosa (subluxación de la cabeza del radio por un tirón del brazo extendido, frecuente antes de los 5 años) da un dolor brusco y rechazo a mover el brazo, a menudo sin hinchazón ni deformidad; hay que descartar una fractura o una infección (Lluch 2020).\n\nFalta de riego: Goodman describe la oclusión arterial aguda con dolor, palidez, ausencia de pulso, parestesias, frialdad y, en los casos graves, parálisis.\n\nQué hacer con un SÍ: no mover el codo, explorar la sensibilidad y la fuerza de los dedos y el color y la temperatura de la mano, y derivar de inmediato.',
            fisiologia: {
              pasos: [
                'Tres nervios (mediano, cubital y radial) cruzan el codo en distintas posiciones respecto a sus ejes y tienen que deslizarse mucho para acompañar su amplio movimiento.',
                'En una luxación o una fractura desplazada, el hueso se sale de su sitio y deforma el codo.',
                'Los nervios y los vasos pueden quedar atrapados por el hueso desplazado, o durante la maniobra para recolocarlo.',
                'Un nervio atrapado deja de conducir y la mano se nota dormida u hormigueante; si se corta el riego, la mano se vuelve pálida y fría.',
                'Por eso, tras un traumatismo del codo, los cambios de sensibilidad, color o temperatura de la mano obligan a pensar en un compromiso neurovascular.'
              ],
              metafora: 'Como un cable que pasa junto a una bisagra: si la bisagra se desencaja, puede pellizcarlo.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Appelboam 2008'],
            citas: [
                'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 81, 87 y 93–94.',
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 254; cap. 18, p. 704.',
                { texto: 'Appelboam 2008 — Appelboam, Reuben, Benger et al., «Elbow extension test to rule out elbow fracture: multicentre, prospective validation and observational study of diagnostic accuracy in adults and children», BMJ 337:a2428 (estudio prospectivo multicéntrico, 1740 pacientes).', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2600962/' }
            ]
          } }
      ],
      zonasDolor: [{ zona: 'Codo tras traumatismo', desc: 'Fractura (cabeza del radio en el adulto, supracondílea en el niño) o luxación' }],
      impactoDescanso: [],
      impactoEjercicio: ['Sin carga ni movilización del codo hasta descartar fractura o luxación']
    },
    {
      id: 'co_vascular', icon: '🩸', nombre: 'Vascular / Neurológica',
      banderasRojas: [
        'Cambios de color en mano/dedos (palidez, cianosis) con el frío (fenómeno de Raynaud)',
        'Debilidad progresiva en brazo/mano no relacionada con dolor local',
        'Síntomas vasculares en un codo postoperatorio'
      ],
      banderasAmarillas: ['Parestesias en 4º y 5º dedo sin dolor localizado en codo'],
      preguntas: [
        { id: 'co4a', text: '¿Se le ponen los dedos blancos o azules con el frío o con los nervios?', alerta: false,
          razonamiento: {
            porque: 'Es el fenómeno de Raynaud: con el frío o con una emoción fuerte, las arterias de los dedos se contraen de más. El dedo se pone blanco y después azul, frío, dormido o doloroso, y al pasar el ataque se vuelve rojo. Durante el ataque puede haber hormigueo, que se confunde con un problema de nervio, pero el cambio de color por episodios es lo que lo define.',
            peso: 'Un SÍ aislado no es bandera roja: el Raynaud es frecuente (hasta un 20–30 % de las mujeres jóvenes, según Deeb y Maher) y la forma primaria no daña el tejido. Lo que pesa son los rasgos de Raynaud secundario a otra enfermedad, que buscan las dos preguntas siguientes (una sola mano; inicio reciente o empeoramiento), además del pulgar afectado, las úlceras en las yemas y los síntomas de otros sistemas.',
            detalle: 'Primario (enfermedad de Raynaud): vasoespasmo reversible, sin enfermedad de base y sin lesión del tejido; se asocia a tabaco, sexo femenino, antecedente familiar y migraña. Goodman: el 80 % son mujeres de 20 a 49 años, y rara vez llega a necrosis. El ataque empieza en un dedo y se extiende de forma simétrica a las dos manos; el pulgar suele quedar libre, y si se afecta hay que pensar en un Raynaud secundario (Deeb y Maher).\n\nSecundario: enfermedades del tejido conectivo (esclerodermia, lupus, Sjögren, síndrome antifosfolípido; Goodman añade polimiositis, dermatomiositis y artritis reumatoide), fármacos (antimigrañosos, interferón, ciclosporina, betabloqueantes no selectivos), herramientas vibratorias, arteriopatía obstructiva (sobre todo a partir de los 60 años), algunas infecciones, policitemia, tumores y, según Goodman, el tratamiento del cáncer a largo plazo y el síndrome del desfiladero torácico. Los ataques son más graves y pueden dar úlceras en las yemas o gangrena.\n\nCon qué se confunde: neuropatía periférica, compresión externa de un vaso, síndrome de dolor regional complejo, sabañones y acrocianosis (Deeb y Maher). Lo que distingue al Raynaud es el cambio de color por episodios desencadenados por el frío o la emoción.\n\nQué hacer con un SÍ: preguntar las dos siguientes, si se afecta el pulgar, si ha tenido heridas en las yemas y si hay síntomas articulares, de piel o generales. El primario lo puede seguir el médico de familia; el secundario, reumatología (Deeb y Maher).',
            fisiologia: {
              pasos: [
                'El frío activa los receptores de frío de la piel (fibras Aδ y C, canal TRPM8), y el cuerpo responde contrayendo los vasos de la piel para no perder calor.',
                'El sistema nervioso simpático libera noradrenalina, que contrae el músculo liso de las arterias de los dedos a través de receptores alfa-2.',
                'En el Raynaud primario esos receptores alfa-2 de las arterias de los dedos son más sensibles, y la contracción es excesiva: el dedo se queda sin sangre y se pone blanco.',
                'La poca sangre que queda circula despacio y pierde oxígeno: el dedo se vuelve azul, frío, dormido o doloroso; el ataque suele durar unos 20 minutos.',
                'Al ceder el espasmo, la sangre vuelve de golpe (hiperemia reactiva) y el dedo se pone rojo, con hormigueo o latido.'
              ],
              metafora: 'Como un termostato demasiado sensible: al primer frío cierra del todo el grifo de sangre de los dedos y, cuando pasa, lo abre de golpe.'
            },
            fuentes: ['Goodman 2018', 'Deeb y Maher 2026 (Raynaud)'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 255.',
                { texto: 'Deeb y Maher 2026 (Raynaud) — Deeb y Maher, «Raynaud Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499833/' }
            ]
          } },
        { id: 'co4a_uni', text: 'Si se le ponen los dedos blancos o azules con el frío, ¿le pasa solo en una mano?', alerta: true,
          razonamiento: {
            porque: 'El Raynaud primario empieza en un dedo y se extiende de forma simétrica a las dos manos. Si solo le pasa en una mano, lo probable es que algo de ese brazo esté comprometiendo la arteria: compresión en el desfiladero torácico, arteriopatía obstructiva, traumatismo o herramientas vibratorias. Goodman añade que un Raynaud unilateral puede ser signo de una neoplasia oculta.',
            peso: 'Pesa más que el Raynaud de las dos manos, porque se sale del patrón del primario: es motivo de valoración médica, aunque no de urgencia. Ninguna fuente leída da una cifra de cuántos Raynaud unilaterales son secundarios.',
            detalle: 'Desfiladero torácico: el plexo braquial y la arteria y la vena subclavias pasan entre la primera costilla, los escalenos y la clavícula. La variante arterial da cambios de color en el brazo y pulsos más débiles, a veces solo en ciertas posiciones, porque la circulación colateral compensa en reposo; la venosa da hinchazón, venas marcadas y dolor de la mano al antebrazo, y puede acabar en una trombosis venosa. La causa puede ser una costilla cervical, una banda fibrosa, un tumor o un quiste, un traumatismo o una fractura de clavícula (Kaplan y Kanwal).\n\nOtras causas de un solo lado: arteriopatía obstructiva (aterosclerosis, tromboangeítis obliterante, microémbolos; sobre todo después de los 60 años), traumatismo y herramientas vibratorias (Deeb y Maher; Goodman). Goodman también señala el Raynaud unilateral como posible signo de una neoplasia oculta, y el desfiladero torácico entre los efectos tardíos del tratamiento del cáncer.\n\nQué hacer con un SÍ: comparar los pulsos radiales y la tensión arterial de los dos brazos (Goodman considera una diferencia de 10 mmHg o más un posible componente vascular del desfiladero torácico), buscar hinchazón o venas marcadas en ese brazo y derivar al médico. Kaplan y Kanwal describen las maniobras de Adson y de Roos, pero sin datos de precisión diagnóstica.',
            fisiologia: {
              pasos: [
                'En el desfiladero torácico pasan juntos el plexo braquial y la arteria y la vena subclavias, en un espacio limitado por la primera costilla, los escalenos y la clavícula.',
                'Una costilla cervical, una banda fibrosa, un tumor o un quiste reducen ese espacio y comprimen la arteria de ese lado.',
                'A la mano de ese lado le llega menos sangre, sobre todo en ciertas posiciones del brazo: cambia de color y el pulso se debilita.',
                'La otra mano, sin compresión, sigue normal: por eso el Raynaud aparece en un solo lado, mientras que el primario es simétrico.'
              ],
              nota: 'Las fuentes leídas no explican por qué mecanismo una neoplasia oculta produce un Raynaud unilateral; Goodman solo lo señala como signo.',
              metafora: 'Como una manguera pisada en un punto de su recorrido: el grifo funciona, pero a ese lado del jardín solo le llega un hilo de agua.'
            },
            fuentes: ['Goodman 2018', 'Deeb y Maher 2026 (Raynaud)', 'Kaplan y Kanwal 2023'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 255; cap. 13, p. 494; cap. 18, pp. 696–697 y 705.',
                { texto: 'Deeb y Maher 2026 (Raynaud) — Deeb y Maher, «Raynaud Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499833/' },
                { texto: 'Kaplan y Kanwal 2023 — Kaplan y Kanwal, «Thoracic Outlet Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557450/' }
            ]
          } },
        { id: 'co4a_prog', text: 'Si se le ponen los dedos blancos o azules con el frío, ¿empezó hace menos de 2 años o ha ido a peor?', alerta: true,
          razonamiento: {
            porque: 'Goodman distingue la enfermedad de Raynaud idiopática por llevar al menos 2 años de síntomas sin empeorar y sin causa subyacente. Un Raynaud que empezó hace menos de 2 años o que va a peor todavía no cumple ese criterio, y puede ser la primera señal de una enfermedad de base, sobre todo del tejido conectivo.',
            peso: 'No diagnostica nada por sí solo, pero impide dar el Raynaud por benigno. Deeb y Maher asocian el inicio más tardío (hacia los 30–40 años) a más riesgo de una enfermedad del tejido conectivo, y el Raynaud secundario a ataques más graves, úlceras y rara remisión. Con úlceras en las yemas, el pulgar afectado o síntomas de otros sistemas, valoración médica.',
            detalle: 'Criterio de Goodman para el Raynaud idiopático: síntomas durante al menos 2 años, sin progresión y sin causa subyacente demostrada.\n\nQué lo hace sospechoso (Deeb y Maher): edad de inicio más tardía, asimetría, pulgar afectado, úlceras en las yemas y síntomas de otros sistemas. Las causas de Raynaud secundario son las de la primera pregunta (tejido conectivo, fármacos, vibración, arteriopatía, infecciones, policitemia, tumores y tratamiento del cáncer).\n\nCómo se estudia: la capilaroscopia del lecho ungueal distingue el primario del secundario, y si es anormal aumenta la probabilidad de una enfermedad del tejido conectivo, sobre todo esclerodermia (Deeb y Maher). El primario puede remitir solo; el secundario rara vez lo hace.\n\nQué hacer con un SÍ: preguntar desde cuándo y cómo ha cambiado, buscar heridas en las yemas y derivar al médico; el secundario lo lleva reumatología.',
            fisiologia: {
              pasos: [
                'En el Raynaud primario el vaso es normal: solo responde de más al frío y a la emoción, y el espasmo se revierte sin dañar el tejido.',
                'En el secundario, la enfermedad de base daña el endotelio de los vasos de los dedos; en la esclerodermia, por fibrosis de la pared del vaso.',
                'El endotelio dañado libera endotelina-1, que contrae el vaso, y la respuesta al frío deja de ser normal.',
                'Los ataques son más graves y la falta de riego más prolongada: pueden aparecer úlceras en las yemas.',
                'Por eso un Raynaud reciente o que empeora no puede darse por primario hasta descartar una causa de base.'
              ],
              metafora: 'Es la diferencia entre una tubería sana que se cierra con el frío y vuelve a abrirse, y una que además se va estrechando por dentro.'
            },
            fuentes: ['Goodman 2018', 'Deeb y Maher 2026 (Raynaud)'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 255.',
                { texto: 'Deeb y Maher 2026 (Raynaud) — Deeb y Maher, «Raynaud Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499833/' }
            ]
          } },
        { id: 'co4b', text: '¿Tiene zonas del brazo o de la mano dormidas o con menos sensibilidad, aunque no le duelan?', alerta: false,
          razonamiento: {
            porque: 'Una zona dormida o con menos sensibilidad, sin dolor, indica que un nervio no conduce bien, no que un tendón o una articulación estén irritados. En el codo lo más frecuente es el nervio cubital: entumecimiento del quinto dedo y de la mitad del cuarto, que empeora con el codo doblado y por la noche, con poco dolor. También puede venir del cuello, del plexo braquial o de una neuropatía general como la diabética.',
            peso: 'Por sí solo no es bandera roja: la neuropatía cubital es la segunda neuropatía por atrapamiento del miembro superior, después del túnel carpiano. Pesa si el territorio no encaja con un nervio (todo el anular, o el antebrazo, apuntan a la raíz o al plexo), si hay debilidad o atrofia de la mano, torpeza de las dos manos o alteración de la marcha, o si va a más. Goodman: una debilidad indolora de comienzo insidioso es probablemente neurológica y requiere un diagnóstico médico.',
            detalle: 'Nervio cubital en el codo (Lleva et al.; Lluch 2020): se comprime en el surco retroepicondíleo y en el túnel cubital, al apoyar el codo, por la flexión mantenida, por el estiramiento en valgo o por un nervio que se subluxa. Son factores de riesgo el sexo masculino, la edad, el tabaco, el sobrepeso, la diabetes y las polineuropatías. Al principio da hormigueo intermitente y torpeza; si progresa, entumecimiento constante y debilidad de la mano, y al final atrofia de los interóseos y mano en garra.\n\nCuándo no es el codo (Lleva et al.): si la alteración sensitiva llega al antebrazo, o si afecta a todo el anular o lo respeta del todo, hay que pensar en una radiculopatía C8 o en una plexopatía braquial. En la mielopatía cervical, el entumecimiento de la mano aparece en el 82 % de los casos y las parestesias en el 79 %, a menudo con torpeza para abrochar botones y alteración de la marcha (Margetis y Donnally).\n\nCausas generales: la diabetes predispone a las neuropatías (Lluch 2020) y da una neuropatía en guante y calcetín (Bodman et al.). Goodman describe metástasis en los ganglios que afectan al plexo braquial (entumecimiento cubital con masas en la axila o en la fosa supraclavicular) y tumores del húmero cuyo primer síntoma es el hormigueo en la mano. En el desfiladero torácico neurógeno puede haber atrofia de la mano y déficit sensitivo (Kaplan y Kanwal).\n\nQué hacer con un SÍ: dibujar la zona dormida, explorar fuerza (flexor cubital del carpo, flexor profundo del cuarto y quinto dedo, interóseos; signo de Froment), reflejos y Hoffmann, y palpar la axila y la fosa supraclavicular.',
            fisiologia: {
              pasos: [
                'Las fibras sensitivas llevan el tacto de la piel a la médula como impulsos eléctricos; la mielina que las envuelve hace que el impulso salte de nodo en nodo y llegue rápido.',
                'En el codo, el nervio cubital pasa sin protección por detrás del epicóndilo medial; al doblar el codo, la presión en el túnel cubital pasa de menos de 19 a más de 200 mmHg.',
                'La compresión y el estiramiento repetidos alteran el flujo dentro del nervio y lo inflaman, y con el tiempo dañan la mielina y lo fibrosan.',
                'Las fibras dañadas conducen peor o dejan de conducir: la piel de su territorio (quinto dedo y mitad cubital del cuarto) se nota dormida.',
                'La falta de conducción no tiene por qué doler: en la neuropatía cubital el dolor no suele ser llamativo salvo tras una lesión aguda.',
                'Si el daño llega a las fibras motoras, aparecen torpeza, debilidad de la pinza y, al final, atrofia de los músculos de la mano.'
              ],
              metafora: 'Como un cable pisado por una puerta: no echa chispas, simplemente deja pasar menos corriente a la lámpara.'
            },
            fuentes: ['Lluch 2020', 'Goodman 2018', 'Lleva 2025', 'Ashley y Lui 2023', 'Margetis y Donnally 2025', 'Bodman 2024', 'Kaplan y Kanwal 2023'],
            citas: [
                'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 90–92 y 101.',
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 701 y 706.',
                { texto: 'Lleva 2025 — Lleva, Munakomi, Sun y Chang, «Ulnar Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534226/' },
                { texto: 'Ashley y Lui 2023 — Ashley y Lui, «Physiology, Nerve», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK551652/' },
                { texto: 'Margetis y Donnally 2025 — Margetis y Donnally, «Cervical Myelopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482312/' },
                { texto: 'Bodman 2024 — Bodman, Dreyer y Varacallo, «Diabetic Peripheral Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK442009/' },
                { texto: 'Kaplan y Kanwal 2023 — Kaplan y Kanwal, «Thoracic Outlet Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK557450/' }
            ]
          } },
        { id: 'co3', text: '¿Tiene debilidad progresiva en el brazo o la mano que no se relaciona con el dolor local del codo?', alerta: true,
          razonamiento: {
            porque: 'Si la fuerza se pierde poco a poco y no lo explica el dolor del codo (el dolor inhibe la fuerza), el problema está en el nervio, en la médula o en la motoneurona: un atrapamiento de larga evolución, una mielopatía cervical, una enfermedad de motoneurona como la ELA o un tumor que invade el plexo braquial.',
            peso: 'Pesa: Goodman considera probablemente neurológica la debilidad indolora de comienzo insidioso, y pide un diagnóstico médico también cuando es dolorosa (radiculopatía, tumor, artrosis). Según Lluch, la atrofia o el déficit motor indican un atrapamiento grave o de larga evolución que puede necesitar cirugía. Derivación médica preferente.',
            detalle: 'Atrapamientos con debilidad (Lluch 2020; Lleva et al.): cubital grave (flexor cubital del carpo, flexor profundo del cuarto y quinto dedo, interóseos; atrofia y garra); nervio interóseo posterior (debilidad para extender los dedos, sin síntomas sensitivos); interóseo anterior (flexor profundo del segundo y tercer dedo y flexor largo del pulgar, con una molestia vaga en el antebrazo).\n\nMielopatía cervical (Margetis y Donnally): torpeza de la mano, atrofia de la eminencia tenar, reflejos exaltados, signo de Hoffmann y alteración de la marcha; empieza de forma insidiosa y avanza a escalones.\n\nELA (Brotman et al.): la enfermedad de motoneurona más frecuente; edad media de 64 años. Suele empezar con debilidad asimétrica de la mano o de la cintura escapular, y su rasgo es la combinación de signos de motoneurona superior (reflejos vivos, espasticidad) e inferior (atrofia, fasciculaciones). Entre las enfermedades que la imitan están la radiculomielopatía cervical, la neuropatía motora multifocal y la amiotrofia monomélica.\n\nTumor (Goodman): el de Pancoast invade el plexo braquial (C8–T1) y da atrofia de los músculos del brazo; en el cáncer, la atrofia puede seguir un patrón extraño que no corresponde a un nervio ni a un músculo, y la debilidad muscular intensa con dolor al movimiento resistido es una pista de neoplasia.\n\nQué hacer con un SÍ: fuerza por nervios y por miotomas, comparar el volumen muscular de los dos lados, buscar fasciculaciones, explorar reflejos (atrofia con reflejos vivos), Hoffmann, sensibilidad y marcha, y derivar.',
            fisiologia: {
              pasos: [
                'Para contraer un músculo, la orden baja de la corteza a la médula, sale por la motoneurona del asta anterior y viaja por el nervio hasta la unión neuromuscular.',
                'Si la vía se daña en algún punto (médula comprimida, raíz, nervio atrapado o motoneuronas que degeneran, como en la ELA), llegan menos órdenes al músculo.',
                'Las fibras musculares que se quedan sin nervio se debilitan y se atrofian; si la lesión es de la motoneurona inferior aparecen además fasciculaciones.',
                'Como el daño avanza poco a poco, la fuerza se pierde de forma progresiva, sin la relación con la carga o el dolor que tiene una lesión de tendón.',
                'Si se daña la motoneurona superior (médula, ELA), los reflejos se exaltan; en la ELA conviven la atrofia y los reflejos vivos.'
              ],
              metafora: 'Como una centralita a la que se le van cortando líneas: el teléfono del músculo funciona, pero cada vez le llegan menos llamadas.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Lleva 2025', 'Margetis y Donnally 2025', 'Brotman 2024', 'Khalil 2025'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 701, 703 y 705–706.',
                'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 91–92 y 100–102.',
                { texto: 'Lleva 2025 — Lleva, Munakomi, Sun y Chang, «Ulnar Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534226/' },
                { texto: 'Margetis y Donnally 2025 — Margetis y Donnally, «Cervical Myelopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK482312/' },
                { texto: 'Brotman 2024 — Brotman, Moreno-Escobar, Joseph, Munakomi y Pawar, «Amyotrophic Lateral Sclerosis», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK556151/' },
                { texto: 'Khalil 2025 — Khalil, Marwaha y Bollu, «Physiology, Neuromuscular Junction», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de febrero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470413/' }
            ]
          } },
        { id: 'co_e2b', text: '¿Nota que los músculos se le cansan cada vez más mientras los usa y se recuperan al descansar, o que al final del día se le caen los párpados o ve doble?', alerta: true,
          razonamiento: {
            porque: 'Describe la miastenia gravis: unos anticuerpos atacan la unión entre el nervio y el músculo, y el músculo pierde fuerza al usarlo y la recupera al descansar. Los primeros en notarlo suelen ser los músculos de los ojos (párpado caído, visión doble), que empeoran al final del día; en los brazos, se afectan más los músculos proximales.',
            peso: 'Pesa: la fuerza que empeora con la repetición y mejora con el reposo es el rasgo característico, y la caída asimétrica y cambiante del párpado es de los primeros signos; Goodman indica derivar al médico. Si además le cuesta respirar o tragar, Beloor Suresh y Asuncion describen la crisis miasténica como una emergencia médica.',
            detalle: 'Quién y cuándo: dos picos de inicio, mujeres jóvenes y hombres de más de 50 años (Goodman; Beloor Suresh y Asuncion). Alrededor del 10 % tiene un timoma (Beloor Suresh y Asuncion), y es más frecuente con hipertiroidismo, que puede agravarla (Goodman).\n\nCómo se presenta: síntomas oculares en el 85 % al inicio, que se generalizan en la mitad de los casos en 2 años; bulbares (masticar, tragar, voz) en el 15 %; en los miembros, más proximal que distal y más en los brazos que en las piernas. Empeora al final del día, con el ejercicio prolongado, el calor, las infecciones, la cirugía, el estrés y algunos fármacos (aminoglucósidos, fluoroquinolonas, betabloqueantes). No da síntomas autonómicos.\n\nQué se encuentra: la fuerza puede ser normal en una sola prueba; las contracciones repetidas o mantenidas ponen de manifiesto la debilidad. Pupilas, reflejos y sensibilidad son normales, y no hay atrofia (Goodman). La ptosis mejora tras 2 minutos con una bolsa de hielo o en reposo sobre el párpado (Box 12.5 de Goodman).\n\nCon qué se confunde: la debilidad proximal de las miopatías endocrinas (pregunta co_e2a), la ELA (atrofia y fasciculaciones, pregunta co3) o un cansancio general. Lo que orienta a la miastenia es que la fuerza se agote con el uso y vuelva con el reposo, y la afectación de los ojos.',
            fisiologia: {
              pasos: [
                'El nervio libera acetilcolina en la unión neuromuscular; al unirse a sus receptores de la placa motora entra sodio y se genera el potencial que hace contraer la fibra muscular.',
                'En la miastenia, unos autoanticuerpos bloquean esos receptores, aceleran su destrucción o activan el complemento, que daña la placa: quedan menos receptores.',
                'Con menos receptores, la acetilcolina liberada genera un potencial más pequeño y algunas fibras no llegan al umbral para contraerse.',
                'Con cada contracción repetida se agota la reserva de acetilcolina del terminal: cada vez se contraen menos fibras y la fuerza cae.',
                'Al descansar, la reserva se repone y la fuerza vuelve: por eso la debilidad empeora con el uso y al final del día, y mejora con el reposo.'
              ],
              metafora: 'Como un timbre al que le faltan piezas: los primeros toques suenan, pero si se insiste deja de sonar hasta que se le da un respiro.'
            },
            fuentes: ['Goodman 2018', 'Beloor Suresh y Asuncion 2023', 'Khalil 2025'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, p. 395; cap. 12, pp. 454–455.',
                { texto: 'Beloor Suresh y Asuncion 2023 — Beloor Suresh y Asuncion, «Myasthenia Gravis», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK559331/' },
                { texto: 'Khalil 2025 — Khalil, Marwaha y Bollu, «Physiology, Neuromuscular Junction», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de febrero de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470413/' }
            ]
          } }
      ],
      zonasDolor: [{ zona: 'Mano / Dedos 4º-5º', desc: 'Neuropatía cubital o compresión vascular' }],
      impactoDescanso: ['Parestesias nocturnas en mano interrumpen el sueño (síndrome del túnel cubital)'],
      impactoEjercicio: ['Debilidad progresiva limita agarre y función del miembro superior']
    },
    {
      id: 'co_infecciosa', icon: '🦠', nombre: 'Infecciosa / Inflamatoria',
      banderasRojas: [
        'Fiebre, enrojecimiento intenso, calor marcado y tumefacción articular (artritis séptica)',
        'Inicio muy agudo con impotencia funcional severa'
      ],
      banderasAmarillas: ['Infección reciente en otra localización'],
      preguntas: [
        { id: 'co1', text: '¿Hay fiebre, enrojecimiento intenso y calor local en la articulación del codo?', alerta: true,
          razonamiento: {
            porque: 'La fiebre con enrojecimiento intenso y calor en el codo hace pensar en una infección: una artritis séptica de la articulación o una bursitis séptica del olécranon. La bursa del olécranon está justo bajo la piel, así que se infecta con facilidad por una herida o un roce.',
            peso: 'La artritis séptica es una emergencia ortopédica que destruye la articulación si se retrasa el tratamiento (Momodu y Savaliya); la fiebre solo aparece en el 40–60 %, así que su ausencia no la descarta. En la bursitis séptica del olécranon hay dolor a la palpación en el 88 %, enrojecimiento en el 83 %, calor en el 84 % y fiebre en el 38 %, frente al 36 %, 27 %, 56 % y 0 % de la no infecciosa (Pangia et al.). Lo que orienta a la articulación es el movimiento limitado y doloroso; en la bursitis suele conservarse. Ante la sospecha, derivación médica sin demora.',
            detalle: 'Artritis séptica (Momodu y Savaliya; Goodman): casi siempre bacteriana (Staphylococcus aureus), en una sola articulación, con dolor agudo, tumefacción, derrame, calor y rechazo a moverla. Factores de riesgo: más de 80 años, diabetes, artritis reumatoide, cirugía articular reciente, prótesis, infiltración previa, infecciones de la piel o úlceras, VIH, artrosis y drogas por vía intravenosa; también heridas punzantes, mordeduras e inmunosupresión. Puede no haber síntomas generales, y tras una cirugía la infección puede tardar semanas o meses en dar la cara, sobre todo con corticoides (Goodman).\n\nBursitis séptica del olécranon (Pangia et al.; Truong et al.): un tercio de las bursitis del olécranon son sépticas; aparece tras una herida o un roce de la piel o por extensión de una celulitis, y es más frecuente en hombres de 30 a 60 años, con trabajos que obligan a apoyar los codos, gota, artritis reumatoide o hemodiálisis. Clínicamente puede ser indistinguible de la no infecciosa: el diagnóstico lo da la punción de la bursa.\n\nCon qué se confunde: la gota o la pseudogota (inicio rápido, enrojecimiento y dolor; el diagnóstico es el análisis de cristales), la celulitis, un hematoma, un nódulo reumatoide y la osteomielitis del olécranon (Pangia et al.). Lluch advierte de que una miositis osificante en sus primeras fases puede dar enrojecimiento y calor y confundirse con una infección, y de que el dolor en reposo de un codo rígido sugiere infección.\n\nQué hacer con un SÍ: tomar la temperatura, mirar si hay herida, explorar si el codo se mueve (articulación) o si la tumefacción está limitada a la bursa, y derivar sin demora.',
            fisiologia: {
              pasos: [
                'La membrana sinovial de la articulación está muy vascularizada y no tiene una membrana basal que la delimite: las bacterias de la sangre, de una herida o de una infiltración llegan a ella con facilidad.',
                'Las bacterias invaden la sinovial y el espacio articular y desencadenan una inflamación intensa.',
                'Las citocinas y proteasas de esa inflamación, junto con las toxinas bacterianas, empiezan a destruir el cartílago.',
                'La inflamación da calor, enrojecimiento, derrame y un dolor que limita el movimiento, a menudo con fiebre.',
                'En la bursitis del olécranon la bursa está bajo la piel: las bacterias entran por una herida o un roce y, como la infección queda fuera de la articulación, el codo suele moverse bien.'
              ],
              metafora: 'Como un jardín sin valla junto a una carretera: lo que circula por la sangre entra en la articulación sin encontrar barrera.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Momodu y Savaliya 2023', 'Truong 2023', 'Pangia 2025'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 699–700 y 707.',
                'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 89–90.',
                { texto: 'Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538176/' },
                { texto: 'Truong 2023 — Truong, Mabrouk y Ashurst, «Septic Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470331/' },
                { texto: 'Pangia 2025 — Pangia, Taqi y Rizvi, «Olecranon Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470291/' }
            ]
          } },
        { id: 'co2', text: '¿El dolor es constante, nocturno, intenso y no cede con ninguna posición ni reposo?', alerta: true,
          razonamiento: {
            porque: 'El dolor mecánico del codo cambia con la carga, la postura y el reposo. Un dolor constante, nocturno e intenso que no cede con nada no depende de la mecánica: hace pensar en algo que destruye o inflama el tejido por sí mismo, como un tumor óseo o una metástasis, o una infección (artritis séptica u osteomielitis).',
            peso: 'Goodman considera bandera roja el dolor que no se alivia con el reposo ni al cambiar de postura, y el dolor nocturno constante e intenso (a menudo de 7 o más sobre 10) bandera roja de cáncer o de su recidiva; aun así, no todos los cánceres del aparato locomotor dan dolor nocturno, y el dolor rara vez es un signo precoz. Lluch: el codo rígido rara vez duele en reposo, y el dolor en reposo sugiere infección. Pero las neuropatías también dan dolor nocturno y en reposo con frecuencia: si va con hormigueo en el territorio de un nervio, pesa menos.',
            detalle: 'Tumor (Jayarangaiah et al.; Goodman): el húmero proximal está entre los huesos donde más asientan las metástasis; el dolor óseo empieza de forma gradual, es sordo y taladrante y empeora de noche, y se vuelve constante si hay una fractura patológica. Son banderas rojas el dolor nocturno, la pérdida de peso sin causa, el dolor al cargar y una masa que crece. En gente joven, un tumor primario de la diáfisis del húmero puede empezar con hormigueo en la mano y limitación del movimiento del codo (Goodman).\n\nInfección: artritis séptica (pregunta co1) y osteomielitis del olécranon, con dolor profundo, síntomas generales y a veces cambios en la piel (Pangia et al.). Goodman: la infección se reconoce mejor cuando hay a la vez síntomas locales y generales.\n\nNeuropatía: el dolor nocturno y en reposo es frecuente en las neuropatías periféricas, y la del nervio radial da un dolor profundo en los extensores que empeora de noche (Lluch 2020).\n\nQué preguntar (Goodman): si el dolor le despierta, si encuentra alguna forma de aliviarlo y volver a dormirse, si ha perdido peso, si ha tenido fiebre o sudores, y si tiene antecedentes de cáncer.',
            fisiologia: {
              pasos: [
                'En una metástasis ósea, las células del tumor interaccionan con las de la médula ósea (a través de moléculas como RANKL) y liberan citocinas y factores de crecimiento.',
                'Esas señales activan los osteoclastos, que destruyen hueso (osteólisis), y el tumor crece.',
                'La destrucción del hueso y la presión del tumor sobre los tejidos dan un dolor sordo y taladrante.',
                'Como el estímulo no depende de la carga ni de la postura, el dolor no cede con el reposo ni al cambiar de posición, y suele empeorar de noche.'
              ],
              nota: 'Las fuentes leídas no explican por qué el dolor óseo tumoral empeora de noche; lo describen como un rasgo clínico.',
              metafora: 'Como un ruido que viene de dentro de la pared: da igual cómo se muevan los muebles, sigue sonando.'
            },
            fuentes: ['Goodman 2018', 'Lluch 2020', 'Jayarangaiah 2023', 'Pangia 2025'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475–476; cap. 18, pp. 700–701, 704 y 707.',
                'Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 90–91 y 100.',
                { texto: 'Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/' },
                { texto: 'Pangia 2025 — Pangia, Taqi y Rizvi, «Olecranon Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470291/' }
            ]
          } }
      ],
      zonasDolor: [{ zona: 'Codo / Articulación', desc: 'Artritis séptica — signos flogóticos locales intensos' }],
      impactoDescanso: ['Dolor constante intenso impide el descanso'],
      impactoEjercicio: ['Contraindicación de carga hasta diagnóstico confirmado']
    },
    {
      id: 'co_endocrino', icon: '⚗️', nombre: 'Endocrino / Metabólico',
      banderasRojas: [
        'Síndrome del túnel carpiano BILATERAL (alerta endocrina/metabólica)',
        'Debilidad muscular proximal y fatiga sistémica inexplicada',
        'Xantomas en tendones extensores'
      ],
      banderasAmarillas: [
        'Tendinitis calcificante bilateral del hombro junto con síntomas en codo',
        'Cambios en el cabello, uñas, piel o tolerancia térmica'
      ],
      preguntas: [
        { id: 'co_e1', text: '¿Tiene síndrome del túnel carpiano en ambas manos a la vez, o síntomas similares también en el codo contralateral?', alerta: true,
          razonamiento: {
            porque: 'Una compresión mecánica del nervio suele empezar en un lado (en el túnel carpiano, en la mano dominante). Si los síntomas aparecen en las dos manos o en los dos codos, puede haber una causa general que hace más vulnerables a los nervios o estrecha los túneles a la vez: hipotiroidismo, diabetes, acromegalia, amiloidosis, artritis inflamatoria, embarazo o menopausia.',
            peso: 'Goodman considera bandera roja cualquier síntoma bilateral y pide mirar más a fondo el túnel carpiano bilateral; Sevy et al. señalan, en cambio, que es frecuente. Un SÍ aislado pesa poco; pesa si se acompaña de otros signos generales (cansancio, intolerancia al frío, cambios de peso, piel seca, sed y orina abundantes, manos o cara más grandes, hormigueo en los pies). El túnel carpiano puede aparecer antes que los demás signos de hipotiroidismo, entre el 5 y el 16 % de los túneles carpianos tienen una diabetes de base, y aparece hasta en la mitad de las acromegalias (Goodman).',
            detalle: 'Causas (Goodman, tabla 11.2; Sevy et al.): hipotiroidismo y mixedema, diabetes, acromegalia, amiloidosis, artritis reumatoide e inflamatoria, embarazo, menopausia, anticonceptivos, obesidad, insuficiencia renal o cardiaca, alcoholismo, déficit o exceso de vitaminas. Goodman añade la hepatopatía: el amoniaco que el hígado no depura puede dar asterixis y un hormigueo que se confunde con un túnel carpiano.\n\nHipotiroidismo (Goodman; Patil et al.): las parestesias son casi siempre bilaterales y responden al tratamiento tiroideo; los signos clásicos pueden faltar. Acromegalia (Adigun et al.): el dolor y entumecimiento de la muñeca puede ser la queja inicial; se sospecha cuando se juntan varias asociaciones (apnea del sueño, hipertensión, diabetes mal controlada, artropatía, túnel carpiano), no ante una sola.\n\nCuándo no es túnel carpiano (Sevy et al.): entumecimiento del quinto dedo, de la eminencia tenar, del dorso de la mano o del cuello. Si son los dos codos, pensar en una neuropatía cubital bilateral, más frecuente con diabetes o polineuropatía (Lleva et al.).\n\nQué preguntar (Goodman): síntomas parecidos en los pies, enfermedad del hígado, alcohol, estatinas y otros fármacos, y signos de tiroides o diabetes.',
            fisiologia: {
              pasos: [
                'El nervio mediano pasa por el túnel carpiano, un canal estrecho y rígido entre los huesos del carpo y el ligamento transverso, junto a nueve tendones flexores.',
                'Si aumenta la presión dentro del túnel, se dificulta la salida de la sangre venosa, se acumula edema y empeora la circulación dentro del propio nervio.',
                'El nervio mal irrigado pierde mielina en ese punto y fallan primero las fibras sensitivas: hormigueo y entumecimiento del pulgar al anular, sobre todo de noche.',
                'En el hipotiroidismo se deposita tejido mixedematoso en el túnel; en la acromegalia crecen las partes blandas y el hueso; en los dos casos el túnel se estrecha en las dos muñecas a la vez.',
                'En la diabetes, el daño de los vasos pequeños deja al nervio isquémico y sensible incluso a presiones mínimas.',
                'Como la causa es general, actúa en los dos lados: por eso el túnel carpiano bilateral obliga a pensar en ella.'
              ],
              metafora: 'Si se atascan a la vez los desagües de los dos lados de la casa, lo probable no es un tapón en cada uno, sino algo que afecta a toda la instalación.'
            },
            fuentes: ['Goodman 2018', 'Sevy 2023', 'Patil 2024', 'Adigun 2023', 'Lleva 2025'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387–390, 398 y 404; cap. 18, p. 699.',
                { texto: 'Sevy 2023 — Sevy, Sina y Varacallo, «Carpal Tunnel Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 29 de octubre de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK448179/' },
                { texto: 'Patil 2024 — Patil, Rehman, Anastasopoulou y Jialal, «Hypothyroidism», StatPearls [Internet], NCBI Bookshelf, última actualización 18 de febrero de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519536/' },
                { texto: 'Adigun 2023 — Adigun, Nguyen, Fox y Anastasopoulou, «Acromegaly», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de febrero de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK431086/' },
                { texto: 'Lleva 2025 — Lleva, Munakomi, Sun y Chang, «Ulnar Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534226/' }
            ]
          } },
        { id: 'co_e2a', text: '¿Le cuesta más que antes subir escaleras o levantarse de una silla?', alerta: true,
          razonamiento: {
            porque: 'Cuesta más subir escaleras o levantarse de una silla cuando fallan los músculos proximales de las caderas y los muslos. Las miopatías de origen hormonal (hipotiroidismo, hipertiroidismo, exceso de cortisol, acromegalia, hiperparatiroidismo, diabetes) debilitan sobre todo esos músculos y los de los hombros, de forma simétrica. En una consulta por el codo, la pregunta busca una enfermedad general que también debilite la cintura escapular.',
            peso: 'Pesa si la debilidad es nueva, simétrica y sin explicación mecánica: Goodman pide investigar siempre una causa endocrina, porque muchas de estas debilidades se recuperan del todo con el tratamiento específico. La miopatía aparece en el 30–80 % de los hipotiroideos (Fariduddin et al.) y en hasta el 70 % de los hipertiroideos (Goodman). Si la fuerza se agota con el uso y vuelve con el reposo, pensar en una miastenia (co_e2b); si es asimétrica, con atrofia o fasciculaciones, en una causa neurológica (co3).',
            detalle: 'Hipotiroidismo (Fariduddin et al.; Goodman): debilidad proximal lentamente progresiva y simétrica de las cinturas escapular y pélvica, con mialgias, calambres y rigidez que empeoran con el esfuerzo, y reflejos lentos. Suele ir con fatiga, aumento de peso, intolerancia al frío y piel seca; puede aparecer meses antes del diagnóstico, y no siempre guarda relación con la gravedad del déficit hormonal. Rara vez da rabdomiólisis o un síndrome compartimental.\n\nOtras causas endocrinas (Goodman): hipertiroidismo (debilidad proximal con atrofia, sobre todo de la cintura pélvica y los muslos; la fuerza se recupera en unos 2 meses de tratamiento), síndrome de Cushing o corticoides prolongados (atrofia y debilidad), acromegalia, hiperparatiroidismo y diabetes (amiotrofia diabética: debilidad proximal de los dos lados, pero asimétrica). Goodman también incluye la debilidad proximal entre los signos complementarios de cáncer.\n\nQué preguntar (Goodman): si tiene un cansancio que no se explica, qué actividades le resultan demasiado costosas, cambios de peso, de piel o de tolerancia al frío o al calor, y si tiene diagnóstico de tiroides, diabetes o toma corticoides.',
            fisiologia: {
              pasos: [
                'La hormona tiroidea entra en el núcleo de las células y activa los genes del metabolismo; en el músculo favorece las fibras tipo II, rápidas y potentes.',
                'La T3 regula las mitocondrias del músculo; si falta hormona, baja su capacidad oxidativa y la degradación del glucógeno funciona mal.',
                'Las fibras tipo II, que dependen de la glucólisis, se atrofian de forma selectiva, y muchas pasan a ser tipo I, lentas.',
                'Baja la actividad ATPasa de la miosina y el recambio de ATP: el músculo se contrae y se relaja más despacio y con menos fuerza.',
                'La pérdida afecta sobre todo a las cinturas escapular y pélvica, de forma simétrica y lenta: cuesta subir escaleras o levantarse de una silla.'
              ],
              metafora: 'Como un motor al que se le empobrece la mezcla de combustible: sigue en marcha, pero le faltan fuerzas en las cuestas.'
            },
            fuentes: ['Goodman 2018', 'Fariduddin 2024', 'Shahid 2023'],
            citas: [
                'Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387, 390, 392, 395, 398–399, 404 y 422–423; cap. 13, p. 475.',
                { texto: 'Fariduddin 2024 — Fariduddin, Haq y Bansal, «Hypothyroid Myopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de junio de 2024.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK519513/' },
                { texto: 'Shahid 2023 — Shahid, Ashraf y Sharma, «Physiology, Thyroid Hormone», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500006/' }
            ]
          } }
      ],
      zonasDolor: [
        { zona: 'Muñecas / Manos bilateral', desc: 'Síndrome del túnel carpiano bilateral — alerta tiroidea/metabólica' },
        { zona: 'Hombros / Codo', desc: 'Tendinitis calcificante, periartritis en hipotiroidismo, acromegalia' }
      ],
      impactoDescanso: ['Parestesias nocturnas bilaterales por túnel carpiano interrumpen el sueño repetidamente'],
      impactoEjercicio: ['Miopatía endocrina reduce drásticamente la capacidad funcional', 'En hipertiroidismo: intolerancia al calor contraindica ejercicio vigoroso']
    },
    SIS_HEMATOLOGICO
  ]
};

// ── Fase 4 · CIF_TREES.codo
export const tree = {
  title: 'Algoritmo CIF — Codo',
  steps: [
    {
      id: 'co_step1',
      tag: 'Paso 1 — Trauma, Integridad Muscular y Edad',
      question: '¿Hubo un evento traumático, hay deformidad muscular característica o es un niño o adolescente?',
      options: [
        { label: 'SÍ — Pérdida del contorno normal del brazo (a veces sutil), hinchazón y debilidad en flexión/supinación', value: 'biceps', next: null, hypothesis: ['co7'],
          // iaTexto: solo para el informe con IA (revisión de los árboles, 2026-10): la conclusión, sin los criterios del patrón
          iaTexto: 'SÍ — Deformidad del contorno del brazo (orienta a: rotura distal del bíceps)' },
        { label: 'FRACTURA / LUXACIÓN — Caída o golpe con deformidad del codo, o el codo no llega a estirarse del todo: sospecha de fractura o luxación → derivación médica', value: 'fractura', next: 'co_step2', hypothesis: [], resoluble: true,
          derivacion: 'Sospecha de fractura o luxación tras un traumatismo (deformidad, o el codo no llega a estirarse del todo: casi un 50 % de fracturas en Appelboam 2008): derivación médica para radiografía; antes, explorar la sensibilidad, el color y la temperatura de la mano.',
          iaTexto: 'FRACTURA / LUXACIÓN — Sospecha de fractura o luxación: derivación médica' },
        { label: 'NIÑO O ADOLESCENTE — Esqueleto inmaduro: tirón del brazo extendido en un menor de 5 años, lanzador joven con dolor medial, o dolor lateral insidioso entre los 7 y los 12 años', value: 'nino', next: 'co_step2', hypothesis: ['co14', 'co15', 'co16'] },
        { label: 'NO — Sin traumatismo significativo ni deformidad', value: 'no', next: 'co_step2', hypothesis: [] }
      ]
    },
    {
      id: 'co_step2',
      tag: 'Paso 2 — Movilidad Global',
      question: '¿Existe una restricción GLOBAL y dolorosa de todos los movimientos del codo (flexión, extensión, pronación, supinación)?',
      options: [
        { label: 'SÍ — Limitación activa y pasiva en todos los planos', value: 'si', next: null, hypothesis: ['co3'] },
        { label: 'NO — Movilidad mayormente preservada', value: 'no', next: 'co_step3', hypothesis: [] }
      ]
    },
    {
      id: 'co_step3',
      tag: 'Paso 3 — Evaluación Neuromuscular y Sensitiva',
      question: '¿Presenta parestesias, debilidad intrínseca de la mano o dolor quemante en el antebrazo?',
      options: [
        { label: 'SÍ — Zona medial: parestesias en 4º y 5º dedo, Tinel positivo en surco epitrócleo-olecraniano', value: 'cubital', next: null, hypothesis: ['co8'],
          // iaTexto: solo para el informe con IA (revisión de los árboles, 2026-10): la conclusión, sin los criterios del patrón
          iaTexto: 'SÍ — Síntomas neurales en la zona medial (orienta a: nervio cubital)' },
        { label: 'SÍ — Zona dorsal/lateral: dolor en el dorso del antebrazo proximal, distal al epicóndilo, o debilidad para extender los dedos', value: 'radial', next: null, hypothesis: ['co9'],
          iaTexto: 'SÍ — Síntomas neurales en la zona dorsal o lateral (orienta a: nervio radial)' },
        { label: 'SÍ — Zona anterior: dolor en el antebrazo anterior, parestesias del 1.º al 3.º dedo o debilidad de la flexión del pulgar y del índice', value: 'mediano', next: null, hypothesis: ['co13'],
          iaTexto: 'SÍ — Síntomas neurales en la zona anterior (orienta a: nervio mediano)' },
        { label: 'NO — Sin síntomas neurales', value: 'no', next: 'co_step4', hypothesis: [] }
      ]
    },
    {
      id: 'co_step4',
      tag: 'Paso 4 — Carga y Función Muscular (Epicondilalgias)',
      question: '¿El dolor es puntual al cargar peso o realizar agarres? ¿Dónde se localiza?',
      options: [
        { label: 'Epicóndilo lateral — Dolor con extensión resistida de muñeca (Test de Cozen) y dolor en cara lateral', value: 'lateral', next: null, hypothesis: ['co1'] },
        { label: 'Epicóndilo medial — Dolor con flexión resistida de muñeca y pronación, dolor en cara medial', value: 'medial', next: null, hypothesis: ['co2'] },
        { label: 'Cara posterior — Dolor en la extensión terminal o con la extensión resistida del codo', value: 'posterior', next: null, hypothesis: ['co10', 'co11', 'co12'] },
        { label: 'Sin localización epicondílea clara', value: 'no', next: 'co_step5', hypothesis: [] }
      ]
    },
    {
      id: 'co_step5',
      tag: 'Paso 5 — Estabilidad y Síntomas Mecánicos',
      question: '¿Siente que el codo "falla" o tiene bloqueos?',
      options: [
        { label: 'Inestabilidad medial — Dolor al estrés en valgo en deportistas de lanzamiento', value: 'lcc', next: null, hypothesis: ['co4'] },
        { label: 'Inestabilidad posterolateral — Sensación de fallo con carga en supinación/extensión', value: 'irpl', next: null, hypothesis: ['co5'] },
        { label: 'Bloqueo/Chasquido — Dolor posterolateral en extensión terminal', value: 'plica', next: null, hypothesis: ['co6'] },
        { label: 'Sin inestabilidad ni bloqueos', value: 'no', next: null, hypothesis: [] }
      ]
    }
  ]
};

// ── Fase 4b · HYPOTHESES de la región
export const hypotheses = {
  // ─── CODO ─────────────────────────────────────────────
  co1: {
    id: 'co1', region: 'codo', num: '①',
    name: 'Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista)',
    prom: 'PRTEE (MCID: 11 puntos o 37 %, Lluch 2020, cap. 3.2, p. 83; Lucado 2022: 7 puntos si el paciente se nota algo mejor y 11 si mucho mejor) o DASH (MCID: 10,2 puntos en trastornos del miembro superior; Lucado 2022)',
    dosis: 'Ejercicio resistido de los extensores de la muñeca (isométrico, concéntrico o excéntrico) en la epicondilalgia subaguda o crónica (B), combinado con otras intervenciones, como la terapia manual (B). La guía sugiere 3 series de 15 repeticiones durante 6–12 semanas (evidencia moderada y opinión de expertos), con cargas que no agraven los síntomas, progresando de isométrico a isotónico y de isotónico a excéntrico según la tolerancia; ningún estudio describe cómo fijar ni progresar la carga, y los estiramientos solos parecen menos eficaces a medio plazo que los estiramientos más fortalecimiento. Movilización o manipulación local del codo para el dolor y la fuerza de prensión sin dolor a corto plazo (B); de la columna cervical o torácica o de la muñeca como complemento si hay déficits en esas zonas (C). Fortalecimiento escapular si hay déficits (C). Punción seca tendinosa o de puntos gatillo (B). Movilización de partes blandas en la crónica (C). Vendaje rígido para el dolor inmediato en la epicondilalgia irritable (B); kinesiotape dentro de un programa multimodal (C). Ortesis de contrafuerza o de muñeca durante la actividad si esta agrava los síntomas (F); sin recomendación a medio y largo plazo (D). Láser (C). Sin fonoforesis con hidrocortisona, prednisolona o diclofenaco (C). Ultrasonido aislado y masaje transverso profundo: sin recomendación por evidencia contradictoria (D). Adaptaciones ergonómicas (E). En actividades de alta demanda (trabajo, deporte, música), vuelta por fases (F). Una revisión Cochrane posterior a la guía (Wallis 2024: 23 ensayos, búsqueda hasta enero de 2024) da menos respaldo al ejercicio y la terapia manual: frente a una intervención mínima reducen poco el dolor (0,5 puntos sobre 10) y la discapacidad (5 sobre 100) al final del tratamiento, probablemente sin relevancia clínica y sin que se mantenga; el ejercicio solo apenas cambia el dolor, y añadir terapia manual al ejercicio lo reduce más al final del tratamiento; certeza baja en todo.',
    dosisFuente: 'Lucado 2022, J Orthop Sports Phys Ther 52(12):CPG1–CPG111 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Wallis 2024, Cochrane Database Syst Rev (5):CD013042 (revisión Cochrane, 23 ensayos, certeza baja)',
    tests: [
      { name: 'Test de Cozen (extensión resistida de muñeca)', sn: '91%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor en epicóndilo lateral con extensión resistida de muñeca. Solo hay sensibilidad (sin especificidad publicada): un Cozen negativo hace menos probable la epicondilalgia, pero sin LR no puntúa.', fuente: 'Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83 y 100 (la precisión diagnóstica del test no se conoce)' },
      { name: 'Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)', sn: '78–83%', sp: '80–90%', lr_pos: null, lr_neg: null, criterio: 'Prensión máxima con el codo a 90° de flexión y en extensión completa: en la epicondilalgia, la fuerza cae en extensión (en el sano no cambia). Cuenta como hallazgo: los intervalos no se convierten en LR, y el estudio de origen comparaba el brazo afectado con el sano del mismo paciente, no con otras causas de dolor lateral. Cifras de Dorf 2007, calculadas solo con los 40 pacientes con medidas de los dos brazos (el afectado frente al sano), con LR calculadas por Zwerus 2018 (tabla 4): caída ≥5 %, S 83 %, E 80 % (LR+ 4,2, LR− 0,21); ≥8 %, S 80 %, E 85 % (LR+ 5,3, LR− 0,24); ≥10 %, S 78 %, E 90 % (LR+ 7,7, LR− 0,24). El patrón de referencia fue el diagnóstico clínico de los cirujanos, que probablemente ya veían la fuerza de prensión.', fuente: 'Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen: Dorf 2007 (J Hand Surg Am 32:882–886; revisión retrospectiva de 81 pacientes con medidas del brazo afectado, de los que 40 tenían también las del sano) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)' },
      { name: 'Test de Thomsen (= test de Cozen)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Otro nombre del test de Cozen: la guía de Lucado 2022 (apéndice E) lo cita como «Thomsen test (Cozen\'s)». No es una prueba distinta: marcar solo una de las dos para no contar dos veces el mismo hallazgo.', fuente: 'Lucado 2022 (J Orthop Sports Phys Ther 52(12):CPG1–CPG111, apéndice E)' },
      { name: 'Fuerza de prensión sin dolor (dinamómetro)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En decúbito supino con el antebrazo pronado, el paciente aprieta el dinamómetro despacio y para al primer dolor; se compara con el lado sano. El capítulo la prefiere a la prensión máxima (que en la epicondilalgia puede estar alterada o no) por su buena precisión diagnóstica, su sensibilidad al cambio y su relación con los cuestionarios del paciente, pero no da cifras: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 82 y 84' }
    ]
  },
  co2: {
    id: 'co2', region: 'codo', num: '②',
    name: 'Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista)',
    prom: 'PRTEE o QuickDASH',
    dosis: 'Ejercicio excéntrico de los flexores y pronadores de la muñeca, mejor dentro de un tratamiento conservador multimodal (estiramientos y otras medidas). Certeza de la evidencia baja o muy baja (GRADE): 5 estudios con 143 pacientes, y solo un ensayo mostró superioridad frente al grupo control. Los estudios usaron de 3 series de 5 repeticiones una vez al día durante 12 semanas a 3 series de 10 dos veces al día, con al menos un minuto de descanso entre series; la revisión no recomienda ninguna pauta concreta.',
    dosisFuente: 'See 2026, Complement Ther Med 98:103364 (revisión sistemática; certeza GRADE baja a muy baja)',
    tests: [
      { name: 'Dolor a la palpación del epicóndilo medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor reproducible a la palpación directa del epicóndilo medial o tendón común flexor-pronador.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84 y 101' },
      { name: 'Dolor con flexión resistida de antebrazo y pronación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor con resistencia a la flexión de muñeca y/o pronación del antebrazo.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 101' },
      { name: 'Ecografía (si se dispone de informe)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ecografía convencional (no sonoelastografía): foco hipo o anecoico, tendón no visible, calcificación o irregularidad cortical. Cuenta como hallazgo: S 95,2 %, E 92 %, pero el patrón de referencia fue el propio diagnóstico clínico de un fisiatra y se comparó con 25 codos sin síntomas (15 contralaterales de los propios pacientes y 10 de voluntarios), un diseño que infla la precisión y no mide si la ecografía añade algo al diagnóstico clínico. Los casos eran 21 codos de 18 pacientes, y el radiólogo no conocía los datos clínicos.' , fuente: 'Park 2008 (Arch Phys Med Rehabil 89:738–742; prospectivo, un solo radiólogo)' },
      { name: 'Test de Polk (medial)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentado, con el codo a unos 100° de flexión y el antebrazo en supinación, el paciente coge y levanta un objeto de unos 2,5 kg (p. ej., un libro); positivo si duele el epicóndilo medial. Sin estudios de precisión. Ojo: Lluch llama Polk a la flexión activa de la muñeca sin resistencia; la descripción de aquí es la de la tabla 5 de Zwerus, de donde la toma el capítulo (ref. 9).', fuente: 'Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 84' }
    ]
  },
  co3: {
    id: 'co3', region: 'codo', num: '③',
    name: 'Rigidez del Codo (Contractura Postraumática o Capsular)',
    prom: 'Oxford Elbow Score o QuickDASH',
    dosis: 'Rigidez postraumática por contractura de las partes blandas: tratamiento conservador de entrada (fisioterapia y férulas), con mejores resultados si empieza en los primeros 6 meses; si no mejora más tras 3–6 meses de tratamiento adecuado, valorar la cirugía. Si lo que limita es el hueso (consolidación viciosa, pinzamiento óseo, osificación heterotópica), el tratamiento conservador está contraindicado y se recomienda la cirugía precoz (Siemensma). Rigidez precoz: estiramientos de contracción-relajación (hold-relax), con mejoras clínicamente importantes de la flexión y la extensión y sin efectos adversos en tres ensayos pequeños; rigidez persistente: férula estática progresiva o dinámica, con evidencia más débil y más efectos adversos (Wistow). La intensidad óptima no se conoce: los ensayos de hold-relax usaron de 2 a 7 sesiones por semana durante 3 a 6 semanas. Para las férulas, Siemensma (por la literatura y su experiencia, sin ensayos) usa la estática progresiva 3 veces al día durante 30 minutos para el déficit de flexión y por la noche para el de extensión, durante al menos 6 meses, y la retira si aparecen síntomas del nervio cubital.',
    dosisFuente: 'Wistow 2025, JSES Int 9(6):2146–2155 (revisión sistemática, 9 estudios y 312 participantes, sin metaanálisis) · Siemensma 2023, EFORT Open Rev 8(5):351–360 (revisión narrativa)',
    tests: [
      { name: 'Test de ROM activo en 4 direcciones', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Extensión completa, flexión, pronación y supinación comparadas con el lado sano. Sin cifras para la rigidez: la «S 99 %» que tenía es del test de extensión del codo para descartar fractura tras traumatismo (Appelboam 2008: no extender del todo el codo → radiografía; S 96,8 %), otra condición.' , fuente: 'Appelboam 2008 (BMJ 337:a2428), solo como aclaración: su cifra es para fractura, no para rigidez' },
      { name: 'Limitación activa Y pasiva comparada con lado sano', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin datos de precisión. La sensación final orienta: un tope firme e indoloro sugiere un bloqueo óseo; uno blando, una contractura capsular y muscular; crepitación o dolor, fractura, sinovitis, cuerpos libres o degeneración.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 90 (medir la movilidad activa y pasiva del codo y el antebrazo y la sensación final; sin datos de precisión)', noData: true }
    ]
  },
  co4: {
    id: 'co4', region: 'codo', num: '④',
    name: 'Insuficiencia del Ligamento Colateral Cubital (LCC)',
    prom: 'QuickDASH',
    dosis: 'Tratamiento conservador de entrada: un periodo de rehabilitación de al menos 3 meses ayuda a distinguir a quién hay que operar, y si la inestabilidad persiste se indica la cirugía; no se han demostrado diferencias entre el tratamiento conservador y el quirúrgico (Biz). En deportistas de brazo por encima de la cabeza con rotura parcial, los programas incluían un periodo de reposo, estiramientos, fortalecimiento de la cadena cinética y un programa de lanzamiento por intervalos adaptado al deporte, y duraban de 6 a 12–14 semanas, con una vuelta al juego del 42 al 100 % (Cascia); en 5 de las 7 series se añadía una infiltración de plasma rico en plaquetas, así que la vuelta al juego no se puede atribuir solo a la rehabilitación. Ninguna fuente fija series ni repeticiones.',
    dosisFuente: 'Biz 2019, Orthop Surg 11(6):974–984 (revisión sistemática de 15 estudios, casi todos de nivel IV) · Cascia 2019, Sports Health 11(4):367–374 (revisión sistemática de 7 series retrospectivas, nivel 4)',
    tests: [
      { name: 'Ecografía dinámica con estrés en valgo', sn: '96%', sp: '81%', lr_pos: null, lr_neg: null, criterio: 'Diferencia de apertura de la articulación cubitotroclear entre reposo y valgo manual (codo a unos 30°) mayor de 1,0 mm frente al codo sano. En Roedl 2016, S 96 %, E 81 % (LR calculadas ≈5,1 y ≈0,05), en lanzadores con la apertura del brazo dominante ya algo aumentada (0,5 mm de media sin rotura).' , fuente: 'Roedl 2016 (Radiology 279(3):827–837; retrospectivo, 144 jugadores de béisbol con dolor medial del codo, todos con cirugía o artroscopia como referencia; tabla 2: 51 de 53 roturas y 74 de 91 sin rotura; positivo con apertura >1,0 mm frente al lado sano, umbral fijado de antemano por un estudio en cadáver; para rotura completa, umbral de 2,5 mm sacado de la curva ROC: S 95 %, E 89 %), recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática sin metaanálisis: es el único estudio de la ecografía de estrés)' },
      { name: 'RM con artrograma', sn: '81%', sp: '91%', lr_pos: null, lr_neg: null, criterio: 'Lectura de la artro-RM con una rotura parcial o completa del ligamento. En la cohorte de Roedl 2016, S 81 %, E 91 % (LR calculadas ≈9,0 y ≈0,21); la RM detectó mejor las roturas del tercio medio y distal y la ecografía convencional, las proximales.' , fuente: 'Roedl 2016 (Radiology 279(3):827–837; retrospectivo, 144 jugadores de béisbol, todos con cirugía o artroscopia; tabla 2: 43 de 53 roturas y 83 de 91 sin rotura, la misma precisión que la ecografía convencional en esa cohorte), recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática sin metaanálisis; otros estudios de la revisión, S 81–100 %, E 91–100 %)' },
      { name: 'Test de valgo móvil (moving valgus stress test)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproducción del dolor medial con estrés en valgo dinámico. En el único estudio (O\'Driscoll 2005; Zwerus 2018, tabla 4) fue más sensible que el valgo estático con dolor (100 % frente a 64,7 %). Test de valgo móvil (O\'Driscoll 2005): hombro en abducción y rotación externa, valgo mantenido con el codo en flexión completa y extensión rápida; positivo si reproduce el dolor medial, máximo entre 120° y 70°. En 21 pacientes operados (retrospectivo, con los 16 últimos recogidos de forma prospectiva): S 100 % (17/17), E 75 % (3 de 4 pacientes con el ligamento íntegro en la cirugía). O\'Driscoll no publica LR. Lluch 2020 (p. 86) da las cifras invertidas (S 75 %, E 100 %). Zwerus 2018 (tabla 4) da las mismas cifras que el original, con LR+ 4 (IC 0,7–21,8, que cruza el 1); es el texto de la revisión el que las invierte, y de ahí las copia Lluch. Cuenta como hallazgo: la especificidad sale de solo 4 pacientes sin lesión y el IC de la LR+ incluye el 1. La maniobra de ordeño es otra prueba (Zwerus 2018, tabla 5), sin estudios de precisión.', fuente: 'O\'Driscoll 2005 (Am J Sports Med 33:231–239) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86' },
      { name: 'Test de valgo estático (dolor)', sn: '64.7%', sp: '50%', lr_pos: '1.29', lr_neg: '0.71', criterio: 'Sentado, codo a 70° de flexión y antebrazo en supinación máxima; estrés en valgo comparado con el otro codo; positivo si reproduce el dolor medial. Tradicionalmente se hace a 20–30°, pero el codo es más inestable a 70°. El dolor es más sensible y la laxitud, más específica (Lluch). En O\'Driscoll 2005, que lo exploró a 30°, 60°, 70° o 90° sin un ángulo único: S 64,7 % (11 de 17), E 50 % (2 de 4 sin lesión); LR+ 1,29 (IC 0,46–3,66) y LR− 0,71 calculadas por Zwerus (tabla 4): no cambia la probabilidad, cuenta como hallazgo.', fuente: 'O\'Driscoll 2005 (Am J Sports Med 33:231–239) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tablas 4 y 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86' },
      { name: 'Test de valgo estático (laxitud)', sn: '18.8%', sp: null, lr_pos: null, lr_neg: '0.81', criterio: 'La misma maniobra, valorando la apertura medial o la falta de tope firme frente al otro codo. En O\'Driscoll 2005: S 18,8 % (3 de 16), E 100 % (4 de 4 sin lesión; la LR+ no se puede calcular), LR− 0,81 (Zwerus, tabla 4): cuenta como hallazgo.', fuente: 'O\'Driscoll 2005 (Am J Sports Med 33:231–239) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tablas 4 y 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86' },
      { name: 'Dolor a la palpación justo distal al epicóndilo medial', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Palpación del ligamento colateral medial justo distal al epicóndilo medial. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 86 y 101' }
    ]
  },
  co5: {
    id: 'co5', region: 'codo', num: '⑤',
    name: 'Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL)',
    prom: 'QuickDASH',
    dosis: 'Sin ensayos que guíen el tratamiento conservador: una revisión sistemática solo encontró dos ensayos sobre la inestabilidad del codo, uno que comparaba la cirugía con 3 semanas de yeso (sin diferencias al año) y otro de movilización precoz tras la cirugía, los dos con alto riesgo de sesgo (Rinkel). Una revisión narrativa (opinión, no evidencia de eficacia) propone una prueba de tratamiento conservador de 4–6 semanas cuando la inestabilidad es leve o dudosa, cuando los síntomas mejoran tras una lesión reciente o cuando el paciente prefiere evitar la cirugía: evitar la carga axial en extensión y supinación; fortalecer la musculatura extensora y supinadora, la cocontracción de bíceps y tríceps y el control escapular, con reeducación propioceptiva; y una ortesis articulada con el antebrazo en pronación como complemento. Si persisten la aprensión o los fallos, o la inestabilidad es crónica, valoración quirúrgica (Quzli).',
    dosisFuente: 'Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Quzli 2025, Cureus 17(11):e96151 (revisión narrativa, sin protocolo: opinión de los autores)',
    tests: [
      { name: 'Test de cajón posterolateral / Test de pivote lateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pivot shift: en supino, brazo por encima de la cabeza, hombro en rotación externa completa y antebrazo en supinación; carga axial y valgo mientras se lleva el codo de extensión a flexión; positivo si la radiohumeral se reduce con un resalte palpable. Sensibilidad del 38 % en el paciente despierto (100 % bajo anestesia), por la aprensión y la defensa muscular; sin especificidad publicada en el capítulo. El dato es de Regan y Lapner, recogido en Zwerus 2018: 8 pacientes, todos con la lesión y sin controles, así que no hay especificidad posible.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)', noData: true },
      { name: 'Dolor lateral a la palpación (complejo colateral lateral)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor a la palpación de la cara lateral del codo. El capítulo de Lluch no describe la palpación del complejo colateral lateral (su tabla 1 da el estrés en varo, el push-up y la recolocación en la mesa) y avisa de que su lesión puede confundirse con la epicondilalgia lateral, en la que la palpación lateral también duele y no es específica. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83, 85 y 100', noData: true },
      { name: 'Test de flexión en suelo (push-up) con el antebrazo en supinación', sn: '87.5%', sp: null, lr_pos: null, lr_neg: null, criterio: 'El paciente hace una flexión de brazos con el antebrazo en supinación máxima y otra en pronación máxima; positivo si la aprensión o la subluxación aparecen al extender el codo en supinación. En Zwerus 2018 (tabla 4; Regan y Lapner): S 87,5 % (IC 47,4–99,7) en 8 pacientes, todos con la lesión y sin controles; sin especificidad: cuenta como hallazgo. Lluch da el 88–100 % para este test y el de recolocación juntos.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)' },
      { name: 'Test de recolocación en la mesa (table-top relocation)', sn: '100%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Con el brazo apoyado en el borde de la mesa, el codo hacia fuera y el antebrazo en supinación, el paciente flexiona el codo cargando peso: aparecen aprensión y dolor hacia los 40° de flexión. Se repite con el examinador presionando la cabeza del radio para evitar la subluxación posterior; positivo si los síntomas se alivian. En Zwerus 2018 (tabla 4; Arvind y Hargreaves): S 100 % (IC 63,1–100) en 8 pacientes, todos con la lesión y sin controles, con el pivot shift como referencia y diseño poco claro (tabla 3); sin especificidad: cuenta como hallazgo.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87–88 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)' },
      { name: 'Dolor y laxitud con estrés en varo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Estrés en varo comparado con el otro codo; en la lesión del complejo colateral lateral reproduce dolor y laxitud. Tras una luxación, la estabilidad se explora con estrés en varo y valgo a 30° de flexión y con el pivot shift. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 93 y 100' }
    ]
  },
  co6: {
    id: 'co6', region: 'codo', num: '⑥',
    name: 'Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar',
    prom: 'DASH (MCID: 10,2 puntos en trastornos del miembro superior; Lucado 2022) o Mayo Elbow Performance Score',
    dosis: 'Hay consenso en empezar por el tratamiento conservador, pero no hay datos sobre cuál aplicar ni sobre su eficacia. Los autores aconsejan reducir la actividad, recuperar el rango de movimiento con fisioterapia guiada y antiinflamatorios no esteroideos; en algunos casos, una infiltración, que además sirve de prueba diagnóstica. Si fracasa (los estudios esperaron de 3 a 6 meses), resección, artroscópica en 280 de los 288 pacientes de 19 estudios de calidad variable, con buen resultado en el 81 %, aunque los criterios de eficacia eran poco claros.',
    dosisFuente: 'Lubiatowski 2020, EFORT Open Rev 5(9):549–557 (revisión narrativa)',
    tests: [
      { name: 'Dolor posterolateral en línea articular radiocapitelar a la palpación', sn: '83.3%', sp: null, lr_pos: null, lr_neg: null, criterio: 'Presente en el 83.3% de los casos confirmados artroscópicamente.' , fuente: 'Park 2019 (Medicine 98:e15497): punto de máximo dolor en la línea radiocapitelar en 20 de 24 · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83–84 y 100 (dolor localizado en la línea radiohumeral posterolateral: sospechar un problema intraarticular)' },
      { name: 'Test de plica radiocapitelar posterolateral', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pulgar en la cara posterolateral de la radiocapitelar y antebrazo en pronación; empezar con el codo extendido y flexionar manteniendo la presión. Positivo si el dolor a baja flexión desaparece claramente por encima de 90°. Cuenta como hallazgo. En el único estudio, de los creadores del test, dio S 83,3 % (20 de 24; IC 95 % 62,6–95,3) y E 87,5 % (49 de 56; IC 75,9–94,8), de las que saldrían LR+ ≈6,7 y LR− ≈0,19 (no publicadas), pero es retrospectivo de casos y controles: 24 plicas confirmadas en la artroscopia (sin epicondilalgia) frente a 56 epicondilalgias laterales operadas (sin plica), un diseño que infla la precisión, y no hay validación posterior. La RM identificó la plica en el 70,8 % de los casos.' , fuente: 'Park 2019 (Medicine 98(18):e15497; retrospectivo de casos y controles, n = 24 frente a 56; texto)' },
      { name: 'PEPPER (palpación-extensión de la radiocapitelar)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Posterior Elbow Pain by Palpation-Extension of the Radiocapitellar joint: compresión de la cara posterior de la cabeza del radio mientras se extiende el codo; positivo si reproduce el dolor posterolateral. Solo fue preciso para la condropatía de la cabeza del radio; el capítulo no da cifras y no se ha estudiado en una población más amplia con dolor de codo.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 89 y 100' },
      { name: 'SALT (supinación y dolor anterolateral)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Supination and Antero-Lateral pain Test: compresión de la cara anterior de la cabeza del radio, deslizando el dedo sobre ella, mientras se supina el codo; positivo si reproduce el dolor anterolateral. Sensibilidad alta pero especificidad baja para la laxitud del ligamento colateral lateral y los hallazgos intraarticulares; sin cifras en el capítulo.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 89 y 100' },
      { name: 'Test de flexión-pronación', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Pronación del antebrazo mientras se flexiona y extiende el codo; positivo si aparece un chasquido doloroso. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 89' },
      { name: 'Deslizamientos accesorios de la cabeza del radio', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor e hipomovilidad con los deslizamientos accesorios de la cabeza del radio; también movimientos combinados (flexión-pronación-abducción, extensión-abducción) para buscar hipomovilidad, hipermovilidad o dolor. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 89 y 100' }
    ]
  },
  co7: {
    id: 'co7', region: 'codo', num: '⑦',
    name: 'Rotura Distal del Bíceps',
    prom: 'QuickDASH',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Test del Gancho (Hook Test)', sn: '71.4%', sp: '95.5%', lr_pos: '15.71', lr_neg: '0.30', absorbe: [2], criterio: 'Con el codo en 90° de flexión y el antebrazo supinado, se intenta "enganchar" el tendón del bíceps con el dedo índice desde el lado lateral. Positivo (rotura completa) si no hay una estructura en cordón que enganchar; si engancha pero duele, orienta a rotura parcial. Cifras de Zwerus 2022 (tabla 2): 86 pacientes consecutivos con molestias anteriores del codo o sospecha de lesión del bíceps distal, 42 con rotura completa, confirmada con cirugía en el 79 % y con RM o ecografía en el resto; S 71,4 %, E 95,5 %, LR+ 15,71, LR− 0,30 (publicadas). En las roturas de menos de un mes, S 86 %; en las crónicas, 57 %: la cicatriz o una aponeurosis bicipital íntegra pueden dar un cordón que engancha. Si se hacen el Hook test y la pronación pasiva, solo cuenta el Hook test (absorbe): son los mismos pacientes y no se cuentan dos veces. Contraste: Devereaux y ElMaraghy 2013 (48 pacientes, solo 6 sin rotura completa, y el método de confirmación dependía del resultado de los propios tests) dio S 81 %, E 100 %, LR− 0,19; O\'Driscoll 2007, revisión retrospectiva del registro quirúrgico del creador del test (33 roturas completas frente a 12 parciales operadas; el brazo sano, control aparte), S y E del 100 %; Baylor 2023 (prospectivo, 28 operados; solo el resumen), S 96 %, E 67 %.', fuente: 'Zwerus 2022 (Am J Sports Med 50(14):3956–3962; cohorte prospectiva, tabla 2) · Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; tabla 3), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · O\'Driscoll 2007 (Am J Sports Med 35:1865–1869; tabla 1) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 102' },
      { name: 'Pérdida del contorno normal del brazo y tendón distal no palpable', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En la rotura puede verse hinchazón y una pérdida sutil del contorno normal del brazo, y el tendón distal no se palpa. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84 y 102' },
      { name: 'Pronación pasiva del antebrazo (PFP) / test de pronosupinación pasiva', sn: '73.8%', sp: '77.3%', lr_pos: '3.25', lr_neg: '0.34', criterio: 'Codo apoyado a 90° de flexión; se palpa el vientre del bíceps mientras se prona y supina pasivamente el antebrazo: si el músculo sube con la supinación y baja con la pronación, el tendón distal está íntegro; si no se mueve, rotura completa. Cifras de Zwerus 2022 (tabla 2; los mismos 86 pacientes): S 73,8 %, E 77,3 %, LR+ 3,25, LR− 0,34 (publicadas); menos sensible en las roturas de menos de un mes (S 67 %). Si también se hace el Hook test, solo cuenta el Hook test. Contraste: en Devereaux y ElMaraghy 2013 (solo 6 sin rotura completa, verificación según el resultado de los tests) dio S 95,2 %, E 100 %, LR− 0,05.', fuente: 'Zwerus 2022 (Am J Sports Med 50(14):3956–3962; cohorte prospectiva, tabla 2) · Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; tabla 3), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 85 y 102' }
    ]
  },
  co8: {
    id: 'co8', region: 'codo', num: '⑧',
    name: 'Neuropatía Cubital (Síndrome del Túnel Cubital)',
    prom: 'QuickDASH',
    dosis: 'Neuropatía leve o moderada: informar sobre la neuropatía y sobre los movimientos y posturas que hay que evitar. Las tres revisiones se apoyan en el mismo y único ensayo (51 pacientes analizados de 70): con información sola, información más férula nocturna 3 meses o información más deslizamiento neural, los tres grupos mejoraron a los 6 meses sin diferencias entre ellos, y no hubo grupo sin información (Caliandro, Rinkel). Rinkel le dio bajo riesgo de sesgo; Bateman, con RoB 2, alto (pocos pacientes y muchas pérdidas), y concluye que la evidencia sobre la férula nocturna es insuficiente (certeza muy baja). Ninguna fuente fija una pauta de ejercicio.',
    dosisFuente: 'Caliandro 2025, Cochrane Database Syst Rev (4):CD006839 (revisión Cochrane, 15 ensayos) · Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Bateman 2025, Hand Ther 30(3):105–112 (revisión sistemática con RoB 2 y GRADE)',
    tests: [
      { name: 'Test de Tinel en túnel cubital', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Lluch lo incluye entre las pruebas de provocación «muy útiles» para la neuropatía cubital, pero sin cifras propias (las LR+ 27–41 que da para ese grupo no se han podido comprobar; ver el test de flexión del codo). Percusión sobre el nervio cubital en el surco epitrócleo-olecraniano. Positivo: parestesias en 4º y 5º dedo.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101' },
      { name: 'Evaluación de subluxación del nervio cubital', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Con flexo-extensión de codo — el nervio cubital puede subluxarse sobre el epicóndilo medial.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 92 (la subluxación no es diagnóstica de neuropatía cubital)' },
      { name: 'Electrodiagnóstico (velocidad de conducción nerviosa)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Ayuda a confirmar las neuropatías de fibra gruesa, como la cubital, pero puede no detectar una neuropatía de fibra fina (fibras Aδ y C); las pruebas sensitivas cuantitativas valoran las dos. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 92' },
      { name: 'Test de flexión del codo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Flexión máxima del codo con el antebrazo en supinación completa y la muñeca en extensión, mantenida; positivo si reproduce las parestesias en el territorio cubital. En Ochi 2012 (55 nervios de 52 pacientes con túnel cubital frente a 123 nervios de 64 voluntarios sin síntomas, de un solo cirujano), a los 5 segundos: S 25 %, E 100 %; en Ochi 2011, a los 10 segundos, S 36 %. Según los estudios que recoge Ochi, la S es del 75 % al minuto y del 86–93 % a los 3 minutos (el rango que da Lluch). Las «LR+ 27–41» que atribuye Lluch a los tests de provocación no aparecen en Ochi 2012. Cuenta como hallazgo: con controles sin síntomas la especificidad se sobrestima.', fuente: 'Ochi 2012 (J Shoulder Elbow Surg 21:777–781; casos y controles, tabla 1) · Ochi 2011 (J Hand Surg Am 36:782–787) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101' },
      { name: 'Test de rotación interna del hombro con flexión del codo (SIRT)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Hombro en 90° de abducción, rotación interna máxima y 10° de flexión, codo a 90°, antebrazo y muñeca en posición neutra y dedos extendidos; positivo si reproduce los síntomas en 10 segundos. Ochi 2011 (25 codos de 25 pacientes; como controles, 104 nervios de 54 voluntarios sin síntomas y 14 nervios de 14 pacientes con otras neuropatías): a los 10 segundos, S 80 % y ningún control positivo. Ochi 2012, a los 5 segundos: S 58 %, E 100 %. Cuenta como hallazgo: estudios de casos y controles del autor del test.', fuente: 'Ochi 2011 (J Hand Surg Am 36:782–787) · Ochi 2012 (J Shoulder Elbow Surg 21:777–781) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101' },
      { name: 'Test de rotación interna del hombro con flexión máxima del codo (SIREFT)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Como el SIRT (hombro en 90° de abducción, 10° de flexión y rotación interna máxima), pero con el codo en flexión máxima, el antebrazo en supinación máxima y la muñeca y los dedos en extensión máxima; positivo si reproduce o agrava los síntomas en el territorio cubital en menos de 5 segundos. Ochi 2012 (nervios, no pacientes): S 87 % (48 de 55), E 98 % (121 de 123), LR+ 42,5 publicada en el texto, aunque con los datos de su tabla sale ≈54; más sensible que el test de flexión y el SIRT de 5 segundos. Cuenta como hallazgo: casos y controles, con voluntarios sin síntomas como controles, de un solo cirujano, y el propio estudio advierte de que el desfiladero torácico y otros diagnósticos podrían dar positivo.', fuente: 'Ochi 2012 (J Shoulder Elbow Surg 21:777–781; casos y controles, tabla 1)' }
    ]
  },
  co9: {
    id: 'co9', region: 'codo', num: '⑨',
    name: 'Neuropatía Radial en el Codo (Síndrome del Túnel Radial / del Nervio Interóseo Posterior)',
    prom: 'QuickDASH',
    dosis: '',
    tests: [
      { name: 'Dolor en antebrazo proximal (NO en epicóndilo lateral)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Localización más distal que la epicondilalgia lateral. Puede coexistir con ella.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 90–91 y 100' },
      { name: 'Dolor con extensión resistida del 3er dedo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin datos de precisión para la neuropatía radial. Ojo: el capítulo de codo de Lluch recoge la extensión resistida del tercer dedo (test de Maudsley) como prueba de la epicondilalgia lateral, no de la neuropatía radial, así que no distingue entre las dos.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83 y 100' },
      { name: 'Dolor con supinación resistida con el codo extendido', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce el dolor en el dorso del antebrazo proximal. Precisión diagnóstica no estudiada.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 100' },
      { name: 'Neurodinámica del nervio radial (ULNT radial)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Depresión de la cintura escapular, extensión del codo, rotación interna del hombro, pronación, flexión de la muñeca y abducción del hombro; positivo si reproduce los síntomas (al menos en parte) y cambian con la diferenciación estructural (soltar la depresión escapular o inclinar el cuello).', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 100' },
      { name: 'Debilidad de la extensión de los dedos (síndrome del nervio interóseo posterior)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Síndrome motor puro: debilidad para extender los dedos y, en menor grado, la muñeca, típicamente sin síntomas sensitivos. Lo distingue del túnel radial, que da dolor sin debilidad.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 91 y 100' }
    ]
  },
  co10: {
    id: 'co10', region: 'codo', num: '⑩',
    name: 'Tendinopatía o Rotura del Tríceps',
    prom: 'QuickDASH',
    dosis: '',
    tests: [
      { name: 'Dolor con la extensión activa o resistida del codo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Reproduce el dolor posterior. Más frecuente en varones, lanzadores, culturistas y ciclistas de montaña; los síntomas suelen seguir a un aumento brusco de la actividad. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84 y 103' },
      { name: 'Dolor a la palpación de la inserción del tríceps', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 103' },
      { name: 'Defecto palpable e hinchazón (rotura)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'En la rotura: defecto palpable e hinchazón, tras una lesión aguda o un golpe directo; preguntar por anabolizantes. No hay pruebas diagnósticas específicas descritas: el diagnóstico concluyente puede requerir ecografía o RM.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 103' },
      { name: 'Test de compresión del tríceps (triceps squeeze test)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sentado, con el antebrazo colgando sobre el respaldo de una silla y el codo a 90°; el examinador aprieta con firmeza el vientre del tríceps; si el codo no se extiende, sugiere una rotura completa. Descrito en libros de texto, sin estudios de precisión.', fuente: 'Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5)' }
    ]
  },
  co11: {
    id: 'co11', region: 'codo', num: '⑪',
    name: 'Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo)',
    prom: 'QuickDASH',
    dosis: '',
    tests: [
      { name: 'Dolor en la extensión terminal del codo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor provocado por la extensión del codo, en el deportista joven (en lanzadores, sobre todo en la fase de seguimiento o desaceleración) o en el mayor. Puede asociar laxitud del ligamento colateral medial en el estrés en valgo. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 85–86, 88 y 103' },
      { name: 'Déficit fijo de extensión', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede haber un flexo fijo; un tope duro a la extensión sugiere un cuerpo libre o un osteofito posterior. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 86 y 103' },
      { name: 'Arm bar test', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'De pie, con el hombro en 90° de flexión y rotación interna completa y el índice apoyado en el hombro del examinador, que presiona sobre el húmero distal para extender del todo el codo; positivo si reproduce dolor posteromedial. Sin estudios de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 89 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5)' },
      { name: 'Test de sobrecarga en valgo (valgus overload)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Desde 20–30° de flexión, el examinador extiende con fuerza el codo mientras aplica valgo; positivo si reproduce dolor posteromedial. Sin estudios de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 89 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5)' }
    ]
  },
  co12: {
    id: 'co12', region: 'codo', num: '⑫',
    name: 'Fractura de Estrés del Olécranon',
    prom: 'QuickDASH',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Dolor con la extensión del codo, sin traumatismo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en la extensión terminal del codo en lanzadores, típicamente sin antecedente de traumatismo. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 81 y 103' },
      { name: 'Pérdida de la extensión terminal', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Puede faltar la extensión terminal. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 103' },
      { name: 'TC (si la radiografía no es concluyente)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La radiografía simple puede no ser concluyente: se necesita una TC. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 103' }
    ]
  },
  co13: {
    id: 'co13', region: 'codo', num: '⑬',
    name: 'Neuropatía del Mediano en el Codo (Síndrome del Pronador / del Nervio Interóseo Anterior)',
    prom: 'QuickDASH',
    dosis: '',
    tests: [
      { name: 'Dolor a la palpación del pronador redondo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor en la cara anterior del codo y el antebrazo, con parestesias sobre todo del 1.º al 3.º dedo. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 102' },
      { name: 'Síntomas con la pronación resistida con el codo extendido', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 102' },
      { name: 'Debilidad del flexor largo del pulgar, del flexor profundo del 2.º y 3.º dedo, del flexor superficial y del pronador redondo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 102' },
      { name: 'Neurodinámica del nervio mediano (ULNT mediano)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Depresión de la cintura escapular, abducción del hombro, supinación, extensión de la muñeca y extensión del codo; positivo si reproduce los síntomas (al menos en parte) y cambian con la diferenciación estructural (soltar la depresión escapular o inclinar el cuello).', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 102' },
      { name: 'Debilidad aislada del flexor profundo del 2.º y 3.º dedo y del flexor largo del pulgar (interóseo anterior)', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Síndrome motor puro, con solo una molestia vaga en el antebrazo. Las lesiones del interóseo anterior pueden ser idiopáticas y en general no son compresivas.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 91 y 102' }
    ]
  },
  co14: {
    id: 'co14', region: 'codo', num: '⑭',
    name: 'Pronación Dolorosa (Subluxación de la Cabeza del Radio en el Niño)',
    prom: 'QuickDASH',
    dosis: DOSIS_DERIVAR,
    tests: [
      { name: 'Tirón del brazo extendido en un menor de 5 años, sin caída', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Dolor brusco, pérdida de movimiento y angustia al intentar moverlo, sin antecedente de caída; a menudo sin hinchazón, deformidad ni hematoma. Hay que descartar una fractura o una infección.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 94 y 100' },
      { name: 'Dolor y limitación de la pronación y de la extensión del codo', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 100' }
    ]
  },
  co15: {
    id: 'co15', region: 'codo', num: '⑮',
    name: 'Codo de la Liga Infantil (Apofisitis o Avulsión del Epicóndilo Medial en el Lanzador Joven)',
    prom: 'QuickDASH',
    dosis: 'Identificar y tratar pronto la lesión del cartílago de crecimiento: si no, aumenta el riesgo de dolor crónico e inestabilidad, que a menudo acaban con la carrera deportiva. Ajustar con cuidado las cargas de entrenamiento para asegurar periodos adecuados de descanso y recuperación. La fuente no da una pauta de ejercicio.',
    dosisFuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94 (capítulo de libro: opinión de los autores, sin ensayos)',
    tests: [
      { name: 'Dolor medial con el lanzamiento en un deportista con el esqueleto inmaduro', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Inestabilidad crónica en valgo por lanzamientos repetidos: apofisitis o fractura por avulsión del epicóndilo medial; puede asociar osteocondritis disecante de la cabeza del radio o del capítulo. Preguntar por cambios de entrenamiento y de material. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94' },
      { name: 'Dolor y laxitud con el estrés en valgo o el valgo móvil', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Mismos hallazgos que la lesión del ligamento colateral medial del adulto. Sin datos de precisión en el niño.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 94 y 101' }
    ]
  },
  co16: {
    id: 'co16', region: 'codo', num: '⑯',
    name: 'Enfermedad de Panner / Osteocondritis Disecante del Capítulo',
    prom: 'QuickDASH',
    dosis: '',
    tests: [
      { name: 'Dolor lateral sordo e hinchazón de inicio insidioso entre los 7 y los 12 años', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'Empeora con la actividad y cede con el reposo (Panner). La osteocondritis disecante se presenta como un dolor lateral insidioso con antecedente de traumatismos repetidos. Sin datos de precisión.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 94–95' },
      { name: 'Imagen: radiografía o RM', sn: null, sp: null, lr_pos: null, lr_neg: null, criterio: 'La radiografía puede mostrar desmineralización, esclerosis o fragmentación; la RM es más sensible para el diagnóstico precoz.', fuente: 'Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 95' }
    ]
  }
};
