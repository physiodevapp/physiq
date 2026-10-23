// ============================================================
// PhysiQ-Assessment · data/ejercicio.js
// Contenido de la guía «Efectos del ejercicio» de la cabecera
// (docs/efectos-ejercicio.md). Un bloque por tema, no por molécula. Solo lleva
// `apartados` un bloque escrito con fuentes leídas en la sesión y revisado por
// el usuario; los demás se listan como pendientes.
//
// Límites (docs/efectos-ejercicio.md): solo lectura; nunca una regla de
// dosificación automática; nunca sustituye a un tratamiento médico; nada de
// esto llega al payload, los resúmenes ni el prompt del informe con IA.
//
// Esquema de un bloque con contenido:
//   { id, titulo, resumen,
//     apartados: {
//       que:       [{ t, nivel }],   // qué ocurre
//       evidencia: [{ t, nivel }],   // hasta dónde llega lo demostrado
//       consulta:  [{ t, nivel }],   // qué cambia en la dosis o la decisión (solo si una fuente leída lo dice)
//       paciente:  [{ t, apoya: [i, …] }],   // para explicárselo; `apoya` = índices de `evidencia`
//       detalle?:  string | string[] },      // «Ampliar ▾»
//     fuentes: ['<clave de data/referencias.js>', …] }
// `nivel` es una clave de NIVELES_EJERCICIO. Una frase de `paciente` solo se
// apoya en afirmaciones de `evidencia` con nivel 'clinico' (decisión 4);
// `problemasBloque()` (lib/ejercicio.js) lo comprueba y un test lo exige.
// Las citas dentro de la frase («(Naugle 2012)») se pintan como botones.
// ============================================================

// Tres niveles (decisión 3 de docs/efectos-ejercicio.md). Lo visto solo en
// animales o in vitro es 'mecanismo' y la frase lo dice.
export const NIVELES_EJERCICIO = {
  clinico: {
    corto: 'Clínico',
    explicacion: 'Efecto medido en personas sobre un resultado que importa (dolor, función).',
  },
  mecanismo: {
    corto: 'Mecanismo',
    explicacion: 'Solo el mecanismo (una molécula en sangre, un cambio en el tejido), sin efecto clínico demostrado. Si solo se ha visto en animales o in vitro, la frase lo dice.',
  },
  discutido: {
    corto: 'Discutido',
    explicacion: 'Fuentes leídas que se contradicen: se dicen las dos.',
  },
};

export const APARTADOS_EJERCICIO = [
  { id: 'que', titulo: 'Qué ocurre' },
  { id: 'evidencia', titulo: 'Hasta dónde llega lo demostrado' },
  { id: 'consulta', titulo: 'Qué cambia en la consulta' },
  { id: 'paciente', titulo: 'Para explicárselo al paciente' },
];

// Los cinco bloques, en orden de trabajo. `resumen` es solo la pista de qué
// cubrirá; no es contenido (cada frase saldrá de una fuente leída).
export const BLOQUES_EJERCICIO = [
  // Hipoalgesia (2026-10): cuatro fuentes leídas enteras en PMC y dos PDF del
  // usuario (Rice 2019, Wewege y Jones 2021); niveles en docs/efectos-ejercicio.md.
  { id: 'hipoalgesia', titulo: 'Hipoalgesia inducida por el ejercicio',
    resumen: 'Ejercicio local y a distancia, qué pasa en el dolor crónico y con la sensibilización central, y qué implica para la dosis y los brotes',
    apartados: {
      que: [
        { t: 'Una sola sesión de ejercicio reduce durante un rato la sensibilidad al dolor: en el laboratorio, el umbral de dolor a la presión sube un 15–20 % frente al reposo, y el efecto dura de 5 a 30 minutos (Vaegter y Jones 2020). Se mide sobre dolor provocado en el laboratorio, no sobre el dolor del paciente.', nivel: 'mecanismo' },
        { t: 'En personas sanas, una revisión con estudios sin grupo control dio efectos de moderados a grandes con el ejercicio aeróbico, el isométrico y el de fuerza dinámica (Naugle 2012). Al quedarse solo con ensayos aleatorizados con reposo como control, el aeróbico mantiene un efecto grande, la fuerza dinámica uno pequeño y el isométrico no tiene efecto, con evidencia de calidad muy baja (Wewege y Jones 2021).', nivel: 'discutido' },
        { t: 'Se atribuye sobre todo a la inhibición descendente del dolor. Con los opioides, los resultados en humanos son equívocos: los antagonistas la aumentan, la reducen o no la cambian, y el apoyo más constante viene de animales (Naugle 2012; Vaegter y Jones 2020). Con los endocannabinoides hay más acuerdo: suben en sangre tras el ejercicio en humanos y, en animales, bloquearlos impide la hipoalgesia (Rice 2019).', nivel: 'discutido' },
      ],
      evidencia: [
        { t: 'Ejercicio regular en dolor crónico: mejora algo la intensidad del dolor y la función física, con efectos de pequeños a moderados que no se repiten en todas las revisiones; la calidad de la evidencia es baja (Geneen 2017, 21 revisiones Cochrane, 381 estudios).', nivel: 'clinico' },
        { t: 'En esas revisiones el ejercicio no empeoró el dolor. Los efectos adversos más comunes fueron agujetas o dolor muscular, que cedieron en unas semanas; solo una cuarta parte de los estudios los registró, así que pueden estar infravalorados (Geneen 2017).', nivel: 'clinico' },
        { t: 'En dolor crónico, la respuesta a una sesión es variable: hipoalgesia, ninguna o incluso hiperalgesia, más en el dolor generalizado (fibromialgia, latigazo cervical) (Vaegter y Jones 2020; Rice 2019). Con solo ensayos aleatorizados, el isométrico no redujo el dolor experimental en dolor musculoesquelético crónico, y no hay ensayos con ejercicio aeróbico (Wewege y Jones 2021).', nivel: 'mecanismo' },
        { t: 'La hipoalgesia falla más en quien tiene mucha sensibilidad al dolor en todo el cuerpo o una modulación condicionada del dolor deficiente, lo que apunta a un procesamiento central del dolor aumentado; los autores lo dan como preliminar (Rice 2019; Vaegter y Jones 2020).', nivel: 'mecanismo' },
        { t: 'Ejercitar una zona que no duele puede dar hipoalgesia donde la zona dolorosa no la da: en la mialgia de hombro, el ejercicio con la pierna la produjo y con el hombro doloroso no; en la artrosis de rodilla, la fuerza del tren superior subió el umbral de dolor y la del inferior no (Vaegter y Jones 2020; Rice 2019).', nivel: 'mecanismo' },
      ],
      consulta: [
        { t: 'Si ejercitar la zona dolorosa aumenta el dolor, se puede empezar por zonas que no duelen y por ejercicio de baja intensidad, como caminar. Los autores lo proponen como algo que «puede merecer la pena considerar», no como resultado de ensayos (Vaegter y Jones 2020; Rice 2019).', nivel: 'mecanismo' },
        { t: 'Intensidad elegida por el paciente o prescrita: en un estudio de fibromialgia, la elegida dio más hipoalgesia que la prescrita al 60–75 % de la frecuencia cardiaca máxima (Vaegter y Jones 2020; Naugle 2012), pero los estudios que comparan ambas casi no encuentran diferencia, aunque la elegida sea bastante más suave (Rice 2019).', nivel: 'discutido' },
        { t: 'No hay una dosis óptima demostrada: un reanálisis de 75 ensayos no encontró una relación clara entre la dosis de ejercicio y el alivio del dolor (Polaski 2019), y la revisión Cochrane no puede orientar el contenido del programa (Geneen 2017).', nivel: 'clinico' },
        { t: 'Un aumento del dolor tras el ejercicio puede frenar la adherencia. Los autores proponen explicar, dentro de la educación en neurociencia del dolor, que al principio puede doler más y que eso pasa; en dolor crónico no está demostrado que esa explicación cambie la hipoalgesia (Rice 2019).', nivel: 'mecanismo' },
        { t: 'Muchos pacientes con dolor crónico esperan más dolor tras el ejercicio (Vaegter y Jones 2020). En sanos, las expectativas negativas, el catastrofismo y el miedo al dolor se asociaron a menos hipoalgesia; en dolor crónico, la ansiedad, la depresión, el catastrofismo y la kinesiofobia no se asociaron (Rice 2019).', nivel: 'mecanismo' },
      ],
      paciente: [
        { t: 'Hacer ejercicio con regularidad suele ayudar algo con el dolor y a moverse mejor. No es un efecto grande ni igual para todo el mundo.', apoya: [0] },
        { t: 'Al empezar es normal notar agujetas o algo más de dolor muscular. Suele pasar en unas semanas, y en los estudios el ejercicio no empeoró el dolor.', apoya: [1] },
      ],
      detalle: [
        'Casi todos los estudios de la hipoalgesia son pequeños (50 personas o menos) y muchos no tienen grupo control, así que probablemente sobrestiman el efecto (Vaegter y Jones 2020). Los diseños antes y después sin control no descartan la regresión a la media, la habituación al estímulo doloroso ni las expectativas; por eso los efectos grandes de revisiones previas, sobre todo con el isométrico, se reducen al exigir un control (Wewege y Jones 2021).',
        'La respuesta de una misma persona cambia de un día a otro: la fiabilidad entre sesiones de la hipoalgesia medida con el umbral de dolor a la presión fue solo regular (CCI 0,45), aunque el umbral por sí solo es muy fiable (Rice 2019).',
        'Muchos protocolos no se parecen al ejercicio que se prescribe: aeróbico de menos de 15 minutos, o una sola contracción isométrica al 10–30 % de la máxima mantenida varios minutos (Rice 2019).',
        'No está claro si la hipoalgesia tras una sesión predice cómo le irá al paciente con el ejercicio regular; hay datos preliminares (Rice 2019), y no se sabe cómo reduce el dolor el entrenamiento (Vaegter y Jones 2020).',
        'Un modelo estadístico predice más alivio con más sesiones por semana, pero los propios autores lo presentan como una predicción para diseñar ensayos, no como un resultado (Polaski 2019).',
      ],
    },
    fuentes: ['Naugle 2012', 'Wewege y Jones 2021', 'Vaegter y Jones 2020', 'Rice 2019', 'Geneen 2017', 'Polaski 2019'] },
  // Mecanotransducción (2026-10): fuentes leídas enteras en PMC y tres PDF del
  // usuario (Magnusson y Kjaer 2019, Howe 2011 en dos partes); niveles y
  // fuentes descartadas en docs/efectos-ejercicio.md. La densidad ósea es un
  // resultado del tejido (`mecanismo`); fracturas, fuerza y función, `clinico`.
  { id: 'mecanotransduccion', titulo: 'Carga y adaptación del tejido (mecanotransducción)',
    resumen: 'Tendón, hueso, cartílago y músculo: cómo la carga se convierte en adaptación y qué pasa cuando se deja de cargar',
    apartados: {
      que: [
        { t: 'Las células del tendón, el hueso, el músculo y el cartílago detectan la deformación mecánica y la convierten en señales que regulan la síntesis y la degradación del tejido (mecanotransducción); en el hueso, los sensores principales son los osteocitos (Khan y Scott 2009; Hart 2020). Los pasos están bastante resueltos en el hueso, pero en el músculo, el tendón y el cartílago quedan elementos desconocidos (Khan y Scott 2009).', nivel: 'mecanismo' },
        { t: 'Tendón: en adultos sanos, los programas de fuerza aumentan sobre todo la rigidez y el módulo del tendón, y poco su grosor (Lazarczuk 2022, 61 estudios). El núcleo del tendón de Aquiles apenas renueva su colágeno después de los 17 años, según la datación con carbono 14; la adaptación ocurriría sobre todo en la periferia, idea que se apoya en estudios en animales (Magnusson y Kjaer 2019).', nivel: 'mecanismo' },
        { t: 'Músculo: la tensión mecánica se considera el estímulo principal de la hipertrofia (Franchi 2017). En humanos, ni los cambios hormonales tras el ejercicio, ni los metabolitos, ni el daño muscular explican el crecimiento del músculo (Lim 2022).', nivel: 'mecanismo' },
        { t: 'Hueso: responde a cargas dinámicas, rápidas, variadas y mayores que las habituales, con pocos ciclos y pausas entre ellos; estos parámetros salen sobre todo de modelos animales (Harding y Beck 2017).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'Diez días de reposo estricto en cama en personas mayores sanas redujeron la fuerza de extensión de rodilla un 13 % y la potencia al subir escaleras un 14 %; la función cae antes y más que la masa muscular (Reyes 2026).', nivel: 'clinico' },
        { t: 'Hacer ejercicio de fuerza durante un reposo en cama prolongado mantuvo el volumen y la fuerza muscular, con evidencia de calidad alta, aunque en voluntarios sanos y jóvenes, casi todos varones (Chen 2025, 18 estudios).', nivel: 'clinico' },
        { t: 'Tendinopatía: el tratamiento con carga es eficaz clínicamente, y el excéntrico aislado no ha demostrado ser mejor que otras pautas, como la fuerza pesada y lenta o el trabajo concéntrico (Magnusson y Kjaer 2019).', nivel: 'clinico' },
        { t: 'Las personas mayores ganan fuerza con el entrenamiento de fuerza casi siempre, aunque su músculo crece menos que el de los jóvenes (Lim 2022).', nivel: 'clinico' },
        { t: 'En mujeres posmenopáusicas, no está demostrado que el ejercicio reduzca las fracturas: hubo 17 fracturas con ejercicio frente a 24 sin él en 4 ensayos, una diferencia no significativa. Con ejercicio combinado hubo menos fracturas, pero ese dato depende casi entero de un solo ensayo (Howe 2011).', nivel: 'clinico' },
        { t: 'En esas mujeres, el ejercicio frena algo la pérdida de densidad ósea en la columna (0,85 %, 24 ensayos) y el trocánter (1,03 %), pero no en el cuello femoral ni en la cadera total en conjunto; es un efecto pequeño sobre la densidad, no sobre las fracturas (Howe 2011).', nivel: 'mecanismo' },
        { t: 'Tendón sano: una revisión encontró más adaptación con intensidades altas, por encima del 70 % de la contracción máxima (Bohm 2015), y otra posterior no encontró diferencias entre intensidades, sino con una deformación alta del tendón, dato que sale de solo tres estudios (Lazarczuk 2022).', nivel: 'discutido' },
        { t: 'Desuso: dos o tres semanas de inmovilizar la pierna reducen un 80 % la síntesis de colágeno del tendón, en jóvenes y mayores, y una o dos semanas sin cargar parecen bastar para que pierda rigidez sin cambiar de grosor (Magnusson y Kjaer 2019). El hueso pierde en torno a un 2 % de densidad al mes inmovilizado, y se recupera más despacio de lo que se pierde (Hart 2020).', nivel: 'mecanismo' },
        { t: 'Cartílago: caminar, saltar o hacer flexiones de rodilla reducen su grosor o volumen entre un 0 y un 5 % de forma pasajera, y se recupera en 15 a 90 minutos; la certeza es muy baja y no se mide la adaptación a largo plazo (Coburn 2023).', nivel: 'mecanismo' },
      ],
      consulta: [
        { t: 'En la tendinopatía, la carga es la base del tratamiento y se puede elegir entre varias pautas que han funcionado; no hace falta que sea solo excéntrica (Magnusson y Kjaer 2019).', nivel: 'clinico' },
        { t: 'Para que un tendón sano se adapte hacen falta cargas altas durante 8 a 12 semanas o más: la fuerza es lo que más cambia sus propiedades, los saltos menos y el ejercicio aeróbico solo, nada. Son datos de tendón sano; no se sabe si valen igual para uno con tendinopatía (Bohm 2015; Lazarczuk 2022).', nivel: 'mecanismo' },
        { t: 'Hueso: la fuerza progresiva fue el ejercicio que frenó la pérdida en el cuello femoral (1,03 %); la fuerza con poca carga y muchas repeticiones no cambió ninguna medida, y caminar solo ayudó algo en la columna (Howe 2011). Un cambio de densidad necesita al menos 6 a 12 meses para verse en una densitometría (Hart 2020).', nivel: 'mecanismo' },
        { t: 'Cuando un tejido tiene que descargarse, la pérdida empieza en días: mantener cargado lo que se pueda y empezar pronto con carga progresiva es la propuesta de los autores, con movilización temprana de baja intensidad, no un resultado de ensayos en pacientes (Reyes 2026).', nivel: 'mecanismo' },
      ],
      paciente: [
        { t: 'Si se deja de usar una pierna unos días, la fuerza se pierde muy rápido, incluso antes de que se note en el músculo. Moverse y cargar lo que se pueda ayuda a no perderla.', apoya: [0, 1] },
        { t: 'En un tendón que duele, el ejercicio con carga es el tratamiento principal, y hay varias formas de hacerlo que funcionan.', apoya: [2] },
        { t: 'El entrenamiento de fuerza sigue funcionando con la edad: se gana fuerza aunque el músculo crezca menos.', apoya: [3] },
      ],
      detalle: [
        'Casi todo lo que se sabe del tendón viene de adultos sanos, sobre todo varones, con muestras pequeñas (de 6 a 15 personas por grupo) y midiendo rigidez, módulo y grosor, no dolor ni función (Bohm 2015; Lazarczuk 2022). La adaptación es menor en las personas mayores (Lazarczuk 2022).',
        'Tras una rotura del tendón de Aquiles, la respuesta del tendón a la carga es lenta y no se normaliza hasta los 6 a 12 meses (Magnusson y Kjaer 2019).',
        'Con la misma carga o el mismo trabajo, el ejercicio excéntrico y el concéntrico producen una hipertrofia muy parecida (Franchi 2017).',
        'En el hueso, la densidad no lo explica todo: una densidad más baja se asocia a más riesgo de fractura, pero no lo predice en cada persona, y la densitometría no mide la forma ni la estructura del hueso (Hart 2020; Harding y Beck 2017).',
        'Tras 56 días de reposo en cama, el hueso siguió perdiéndose después de volver a cargar, y a los 12 meses aún no se había recuperado del todo (Reyes 2026).',
        'En el cartílago se ha propuesto una respuesta «en U», en la que tanto el exceso de carga como su falta lo perjudican, pero se apoya sobre todo en estudios en animales e in vitro (Gardashli 2024).',
        'En los ensayos de Howe 2011, los efectos adversos fueron sobre todo dolor muscular o articular, registrados casi solo en los grupos de ejercicio; las caídas se contaron mal, como número de caídas y no de personas que se caen (Howe 2011).',
      ],
    },
    fuentes: ['Khan y Scott 2009', 'Hart 2020', 'Lazarczuk 2022', 'Magnusson y Kjaer 2019', 'Franchi 2017', 'Lim 2022', 'Harding y Beck 2017', 'Reyes 2026', 'Chen 2025', 'Howe 2011', 'Bohm 2015', 'Coburn 2023', 'Gardashli 2024'] },
  // Antiinflamatorio (2026-10): cinco fuentes leídas enteras en PMC y cinco PDF
  // del usuario (Petersen y Pedersen 2005, Pedersen y Febbraio 2012, Gleeson
  // 2011, Benatti y Pedersen 2015, Ho 2013); niveles en docs/efectos-ejercicio.md.
  // Ninguna fuente mide el efecto antiinflamatorio en el dolor musculoesquelético
  // común: la frase para el paciente se limita a las enfermedades reumáticas.
  { id: 'antiinflamatorio', titulo: 'Efecto antiinflamatorio sistémico',
    resumen: 'La IL-6 que libera el músculo al contraerse, su diferencia con la de la inflamación, y qué se sabe en dolor musculoesquelético',
    apartados: {
      que: [
        { t: 'Al contraerse, el músculo libera interleucina 6 (IL-6) a la sangre. Sube de forma exponencial con la duración del ejercicio, su intensidad y la masa muscular que trabaja, hasta 100 veces con ejercicio prolongado, aunque lo habitual son subidas menores; sube más con poco glucógeno en el músculo y vuelve al nivel de reposo en torno a una hora después (Petersen y Pedersen 2005; Pedersen y Febbraio 2012; Gleeson 2011). Con ejercicio corto de intensidad baja o moderada apenas sube (Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Esa IL-6 aparece sin daño muscular y sin que suba antes el TNF-α, y le siguen en sangre dos citocinas antiinflamatorias, la IL-1ra y la IL-10 (Pedersen y Febbraio 2012; Petersen y Pedersen 2005). En voluntarios sanos, tanto infundir IL-6 como 3 horas de bicicleta impidieron la subida de TNF-α que provoca una dosis baja de endotoxina; otra parte del mecanismo se ha visto solo en células y en ratones (Benatti y Pedersen 2015; Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Es la misma molécula que en otros contextos inflama: en la artritis reumatoide, una IL-6 alta de forma crónica contribuye a la enfermedad, y bloquearla mejora los síntomas (Benatti y Pedersen 2015). Por qué la IL-6 del músculo actúa de otra forma no está aclarado; se especula que depende de su vía de señalización (Nara y Watanabe 2021).', nivel: 'mecanismo' },
        { t: 'Para el ejercicio regular se proponen dos vías: menos grasa visceral, y por tanto menos citocinas del tejido adiposo, y un efecto antiinflamatorio en cada sesión. No se sabe cuánto pesa cada una; con ejercicio suave, como caminar rápido, lo más probable es que pese sobre todo el control de la grasa corporal (Gleeson 2011).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'Marcadores en reposo con el ejercicio regular: las revisiones narrativas dicen que el entrenamiento de resistencia aeróbica baja la IL-6 basal (Pedersen y Febbraio 2012). En los ensayos leídos no baja: en adultos sedentarios sin diabetes, el entrenamiento combinado redujo el TNF-α y la proteína C reactiva, pero no la IL-6, con pocos estudios (Silva 2024, 24 ensayos); en sobrepeso, 12 semanas de ejercicio moderado no cambiaron la IL-6 y solo el combinado bajó el TNF-α frente al control (Ho 2013). Son marcadores en sangre, no síntomas.', nivel: 'discutido' },
        { t: 'Que el efecto de cada sesión sea lo que protege a largo plazo es una hipótesis: los mismos autores que la proponen dicen que ese vínculo no está demostrado (Petersen y Pedersen 2005), y no se sabe cuánto pesa cada mecanismo (Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Artrosis de rodilla con sobrepeso: a los 18 meses, la IL-6 bajó más con la pérdida de peso (dieta sola o con ejercicio) que con el ejercicio solo, y el dolor mejoró más con dieta y ejercicio que con cada uno por separado, una diferencia de importancia clínica incierta según los autores. No había grupo sin intervención (Messier 2013). No permite atribuir el alivio del dolor a una menor inflamación.', nivel: 'mecanismo' },
        { t: 'Enfermedades reumáticas inflamatorias (artritis reumatoide, lupus, espondilitis anquilosante, esclerosis sistémica): los programas de ejercicio aeróbico y de fuerza mejoran la capacidad aeróbica, la fuerza y la función referida, sin brotes ni subida de la proteína C reactiva o de la velocidad de sedimentación. Los autores llaman a estos datos todavía preliminares (Benatti y Pedersen 2015).', nivel: 'clinico' },
        { t: 'En la artritis reumatoide, una sesión de ejercicio aeróbico, de fuerza o combinado no pareció empeorar el dolor; la IL-6 sube justo después y vuelve a su nivel a las 24 horas. Son 11 estudios pequeños y distintos entre sí, y los autores no sacan una conclusión firme (Balchin 2022).', nivel: 'clinico' },
        { t: 'Dolor musculoesquelético común (lumbalgia, tendinopatía, hombro doloroso): ninguna fuente leída mide si el ejercicio reduce la inflamación ni si eso explica su efecto sobre el dolor. Aquí solo hay mecanismo.', nivel: 'mecanismo' },
      ],
      consulta: [
        { t: 'En un paciente con una enfermedad reumática inflamatoria, el miedo a que el ejercicio aeróbico o de fuerza agrave la inflamación no se sostiene. La excepción que señalan los autores: con daño articular extenso al empezar, un programa de fuerza de alta intensidad puede aumentar el daño articular (Benatti y Pedersen 2015).', nivel: 'clinico' },
        { t: 'La subida de IL-6 tras una sesión es la respuesta normal del músculo que trabaja, no un signo de inflamación ni de lesión: aparece sin daño muscular y se normaliza pronto (Pedersen y Febbraio 2012; Gleeson 2011). En la artritis reumatoide, los autores de la revisión creen que tampoco debe leerse como una respuesta inflamatoria desfavorable (Balchin 2022).', nivel: 'mecanismo' },
        { t: 'Explicar el alivio del dolor musculoesquelético con «el ejercicio es antiinflamatorio» va más allá de lo medido: no hay estudios que lo muestren en esos pacientes, y con ejercicio suave el efecto antiinflamatorio vendría sobre todo de la grasa corporal (Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'En deportistas de élite, cargas de entrenamiento muy altas se asocian a más infecciones respiratorias leves, que los autores atribuyen en parte a ese estado antiinflamatorio, junto al estrés, el mal sueño y el balance energético negativo; el ejercicio moderado regular se asocia a menos infecciones que el sedentarismo (Gleeson 2011).', nivel: 'mecanismo' },
      ],
      paciente: [
        { t: 'Si tiene una enfermedad reumática inflamatoria, como artritis reumatoide o lupus, el ejercicio pautado no empeora la inflamación y le ayuda a ganar fuerza y a moverse mejor. Aún hay pocos estudios.', apoya: [3] },
        { t: 'En la artritis reumatoide, una sesión de ejercicio no empeoró el dolor en los estudios.', apoya: [4] },
      ],
      detalle: [
        'No hay frase para el paciente con dolor musculoesquelético común: ninguna afirmación de este bloque sobre él llega al nivel clínico, y decirle que el ejercicio «desinflama» prometería más de lo demostrado.',
        'Un ejemplo en humanos: 3 horas de extensión de rodilla al 50 % multiplicaron por 20 la IL-6 en plasma, y en personas mayores no entrenadas el músculo liberó aún más (Petersen y Pedersen 2005). Con el entrenamiento aeróbico, la subida de IL-6 en cada sesión se hace menor (Pedersen y Febbraio 2012).',
        'Buena parte del mecanismo de la IL-6 muscular viene de ratones y de células musculares en cultivo, y su papel principal parece metabólico (movilizar grasa y glucosa) más que inflamatorio (Nara y Watanabe 2021; Pedersen y Febbraio 2012).',
        'En el metaanálisis de Silva 2024 la IL-6 tuvo una heterogeneidad muy alta (I² 87 %); de 24 ensayos, 3 tenían riesgo de sesgo bajo, 18 algunas dudas y 3 alto, y pocos dijeron cuánto tiempo pasó entre la última sesión y la extracción de sangre, algo que cambia las citocinas (Silva 2024).',
        'En el ensayo de Ho 2013 casi todos tenían marcadores normales al empezar, lo que deja poco margen de mejora; 64 de 97 terminaron (Ho 2013).',
        'En el ensayo IDEA, a los 18 meses solo el 54 % del grupo de ejercicio seguía haciéndolo, y el estudio no tenía potencia para las diferencias que encontró en la IL-6 (Messier 2013).',
      ],
    },
    fuentes: ['Petersen y Pedersen 2005', 'Pedersen y Febbraio 2012', 'Gleeson 2011', 'Nara y Watanabe 2021', 'Silva 2024', 'Ho 2013', 'Messier 2013', 'Benatti y Pedersen 2015', 'Balchin 2022'] },
  { id: 'mioquinas', titulo: 'El músculo como órgano endocrino: otras mioquinas',
    resumen: 'Concepto y estado real de cada mioquina; puede quedar como párrafo del bloque anterior si sus fuentes dan casi solo mecanismo' },
  { id: 'centrales', titulo: 'Efectos centrales',
    resumen: 'Sueño, estado de ánimo y autoeficacia' },
];

export const TEXTOS_EJERCICIO = {
  intro: 'Qué hace el ejercicio en el cuerpo y hasta dónde llega lo que se sabe. Sirve para decidir la dosis y para explicárselo al paciente sin prometer más de lo demostrado.',
  limites: 'Es una guía de lectura: no dosifica por ti, no cambia el plan y no sustituye a un tratamiento médico. Cada afirmación lleva su nivel de evidencia.',
  nivelesTitulo: 'Nivel de cada afirmación',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Se escriben de uno en uno, solo con fuentes leídas por completo.',
  pie: 'Contenido de apoyo para el fisioterapeuta. No se guarda ni se comparte con el informe.',
  // Enlace del bloque «Educación» de la fase 6 (docs/efectos-ejercicio.md, decisión 5)
  enlaceEducacion: 'Para explicárselo al paciente →',
  enlaceEducacionOtro: 'También: «{titulo}» →',
  enlaceEducacionAyuda: 'Abre «{titulo}», el bloque que corresponde a la irritabilidad elegida.',
};
