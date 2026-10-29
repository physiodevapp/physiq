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

// Los bloques, en orden de trabajo (las mioquinas, previstas como bloque 4, van
// dentro del antiinflamatorio: decisión 2 de docs/efectos-ejercicio.md). `resumen` es solo la pista de qué
// cubrirá; no es contenido (cada frase saldrá de una fuente leída).
export const BLOQUES_EJERCICIO = [
  // Hipoalgesia (2026-10): cuatro fuentes leídas enteras en PMC y dos PDF del
  // usuario (Rice 2019, Wewege y Jones 2021); niveles en docs/efectos-ejercicio.md.
  { id: 'hipoalgesia', titulo: 'Hipoalgesia inducida por el ejercicio',
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'El ejercicio y el dolor', hojaPaciente: 'general',
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
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'Moverse y cargar: músculos y tendones', hojaPaciente: 'general',
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
  // Mioquinas (2026-10): cinco fuentes más leídas enteras en PMC; todo es
  // mecanismo o discutido, así que van aquí y no como bloque propio (decisión 2).
  { id: 'antiinflamatorio', titulo: 'Efecto antiinflamatorio y mioquinas',
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'Si tiene una enfermedad reumática inflamatoria (artritis reumatoide, lupus…)', hojaPaciente: 'condicion',
    resumen: 'La IL-6 que libera el músculo al contraerse, la mioquina más estudiada; las demás mioquinas, con la irisina en discusión; y qué se sabe en dolor musculoesquelético',
    apartados: {
      que: [
        { t: 'Al contraerse, el músculo libera a la sangre sustancias que actúan sobre otros órganos, las mioquinas. Se han descrito más de 650, pero solo se conoce la función de un 5 % aproximadamente, y la más estudiada es con diferencia la interleucina 6 (IL-6): casi todo lo demostrado en humanos sobre mioquinas es de la IL-6 (Severinsen y Pedersen 2020; Pedersen y Febbraio 2012).', nivel: 'mecanismo' },
        { t: 'La IL-6 sube en sangre de forma exponencial con la duración del ejercicio, su intensidad y la masa muscular que trabaja, hasta 100 veces con ejercicio prolongado, aunque lo habitual son subidas menores; sube más con poco glucógeno en el músculo y vuelve al nivel de reposo en torno a una hora después (Petersen y Pedersen 2005; Pedersen y Febbraio 2012; Gleeson 2011). Con ejercicio corto de intensidad baja o moderada apenas sube (Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Esa IL-6 aparece sin daño muscular y sin que suba antes el TNF-α, y le siguen en sangre dos citocinas antiinflamatorias, la IL-1ra y la IL-10 (Pedersen y Febbraio 2012; Petersen y Pedersen 2005). En voluntarios sanos, tanto infundir IL-6 como 3 horas de bicicleta impidieron la subida de TNF-α que provoca una dosis baja de endotoxina; otra parte del mecanismo se ha visto solo en células y en ratones (Benatti y Pedersen 2015; Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Es la misma molécula que en otros contextos inflama: en la artritis reumatoide, una IL-6 alta de forma crónica contribuye a la enfermedad, y bloquearla mejora los síntomas (Benatti y Pedersen 2015). Por qué la IL-6 del músculo actúa de otra forma no está aclarado; se especula que depende de su vía de señalización (Nara y Watanabe 2021).', nivel: 'mecanismo' },
        { t: 'De las demás mioquinas, lo que se sabe viene sobre todo de animales o de células: la IL-15, la miostatina o el LIF en el crecimiento del músculo, y otras en el hueso, la grasa o el cerebro (Severinsen y Pedersen 2020).', nivel: 'mecanismo' },
        { t: 'Para el ejercicio regular se proponen dos vías: menos grasa visceral, y por tanto menos citocinas del tejido adiposo, y un efecto antiinflamatorio en cada sesión. No se sabe cuánto pesa cada una; con ejercicio suave, como caminar rápido, lo más probable es que pese sobre todo el control de la grasa corporal (Gleeson 2011).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'Marcadores en reposo con el ejercicio regular: las revisiones narrativas dicen que el entrenamiento de resistencia aeróbica baja la IL-6 basal (Pedersen y Febbraio 2012). En los ensayos leídos no baja: en adultos sedentarios sin diabetes, el entrenamiento combinado redujo el TNF-α y la proteína C reactiva, pero no la IL-6, con pocos estudios (Silva 2024, 24 ensayos); en sobrepeso, 12 semanas de ejercicio moderado no cambiaron la IL-6 y solo el combinado bajó el TNF-α frente al control (Ho 2013). Son marcadores en sangre, no síntomas.', nivel: 'discutido' },
        { t: 'Que el efecto de cada sesión sea lo que protege a largo plazo es una hipótesis: los mismos autores que la proponen dicen que ese vínculo no está demostrado (Petersen y Pedersen 2005), y no se sabe cuánto pesa cada mecanismo (Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Artrosis de rodilla con sobrepeso: a los 18 meses, la IL-6 bajó más con la pérdida de peso (dieta sola o con ejercicio) que con el ejercicio solo, y el dolor mejoró más con dieta y ejercicio que con cada uno por separado, una diferencia de importancia clínica incierta según los autores. No había grupo sin intervención (Messier 2013). No permite atribuir el alivio del dolor a una menor inflamación.', nivel: 'mecanismo' },
        { t: 'Enfermedades reumáticas inflamatorias (artritis reumatoide, lupus, espondilitis anquilosante, esclerosis sistémica): los programas de ejercicio aeróbico y de fuerza mejoran la capacidad aeróbica, la fuerza y la función referida, sin brotes ni subida de la proteína C reactiva o de la velocidad de sedimentación. Los autores llaman a estos datos todavía preliminares (Benatti y Pedersen 2015).', nivel: 'clinico' },
        { t: 'En la artritis reumatoide, una sesión de ejercicio aeróbico, de fuerza o combinado no pareció empeorar el dolor; la IL-6 sube justo después y vuelve a su nivel a las 24 horas. Son 11 estudios pequeños y distintos entre sí, y los autores no sacan una conclusión firme (Balchin 2022).', nivel: 'clinico' },
        { t: 'Dolor musculoesquelético común (lumbalgia, tendinopatía, hombro doloroso): ninguna fuente leída mide si el ejercicio reduce la inflamación ni si eso explica su efecto sobre el dolor. Aquí solo hay mecanismo.', nivel: 'mecanismo' },
        { t: 'Otras mioquinas tras una sesión, en adultos sanos: la irisina sube un poco a los 60 minutos y la SPARC justo después; la IL-15, la oncostatina M y la decorina no cambian de forma significativa, y todo vuelve a su nivel entre 3 y 24 horas. Por la variabilidad entre estudios, los autores no sacan conclusiones precisas (Bettariga 2024, 62 estudios).', nivel: 'mecanismo' },
        { t: 'Irisina: un estudio la mide en la sangre de personas con espectrometría de masas, a unos 3,6 ng/ml, algo más en quien entrena (Jedrychowski 2015); otro muestra que los anticuerpos de los kits comerciales reaccionan con otras proteínas, que dos kits dan cifras 18 veces distintas y sin relación entre sí, y la llama «un mito» (Albrecht 2015). Un metaanálisis del entrenamiento de fuerza no encontró un aumento significativo y pide leer con cautela todo lo medido con esos kits (Cosio 2021).', nivel: 'discutido' },
        { t: 'Ninguna fuente leída mide un efecto sobre el dolor, la función, la fuerza o la cognición atribuido a una mioquina concreta en personas (Severinsen y Pedersen 2020; Bettariga 2024).', nivel: 'mecanismo' },
      ],
      consulta: [
        { t: 'En un paciente con una enfermedad reumática inflamatoria, el miedo a que el ejercicio aeróbico o de fuerza agrave la inflamación no se sostiene. La excepción que señalan los autores: con daño articular extenso al empezar, un programa de fuerza de alta intensidad puede aumentar el daño articular (Benatti y Pedersen 2015).', nivel: 'clinico' },
        { t: 'La subida de IL-6 tras una sesión es la respuesta normal del músculo que trabaja, no un signo de inflamación ni de lesión: aparece sin daño muscular y se normaliza pronto (Pedersen y Febbraio 2012; Gleeson 2011). En la artritis reumatoide, los autores de la revisión creen que tampoco debe leerse como una respuesta inflamatoria desfavorable (Balchin 2022).', nivel: 'mecanismo' },
        { t: 'Explicar el alivio del dolor musculoesquelético con «el ejercicio es antiinflamatorio» va más allá de lo medido: no hay estudios que lo muestren en esos pacientes, y con ejercicio suave el efecto antiinflamatorio vendría sobre todo de la grasa corporal (Gleeson 2011).', nivel: 'mecanismo' },
        { t: 'Ninguna mioquina tiene hoy un efecto clínico medido que permita elegir un tipo de ejercicio por ella, y explicarle al paciente que el ejercicio «libera hormonas que…» va más allá de lo demostrado (Severinsen y Pedersen 2020; Bettariga 2024).', nivel: 'mecanismo' },
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
        'El BDNF que sube con el ejercicio sale del cerebro, no del músculo: el del músculo no se ha visto pasar a la sangre. La catepsina B sube en sangre en humanos tras meses de carrera, pero no se sabe si media algún efecto sobre la cognición (Severinsen y Pedersen 2020).',
        'En personas con obesidad abdominal, bloquear el receptor de la IL-6 con tocilizumab anuló la pérdida de grasa visceral que daba un entrenamiento de 12 semanas: es el dato en humanos más directo de que una mioquina media un efecto del ejercicio (Severinsen y Pedersen 2020).',
        'Las mioquinas medidas tras una sesión cambian con la hora del día y las horas de ayuno, y no hay acuerdo sobre cómo diseñar estos estudios (Bettariga 2024). La medida de la irisina por espectrometría de masas se hizo en 10 voluntarios (Jedrychowski 2015), y el metaanálisis de fuerza tuvo una heterogeneidad muy alta (I² 90 %) y sesgo de publicación (Cosio 2021).',
        'En el ensayo IDEA, a los 18 meses solo el 54 % del grupo de ejercicio seguía haciéndolo, y el estudio no tenía potencia para las diferencias que encontró en la IL-6 (Messier 2013).',
      ],
    },
    fuentes: ['Petersen y Pedersen 2005', 'Pedersen y Febbraio 2012', 'Gleeson 2011', 'Nara y Watanabe 2021', 'Silva 2024', 'Ho 2013', 'Messier 2013', 'Benatti y Pedersen 2015', 'Balchin 2022', 'Severinsen y Pedersen 2020', 'Bettariga 2024', 'Jedrychowski 2015', 'Albrecht 2015', 'Cosio 2021'] },
  // Bloque 5 (2026-10): ocho fuentes leídas enteras en PMC (Noetel 2024, Singh
  // 2023, Haller 2026, Pérez-Romero 2026, Xie 2021, Hudson 2025, Lima 2023 y las
  // partes psicológicas de Geneen 2017); niveles en docs/efectos-ejercicio.md.
  // Lo clínico es el ánimo y el sueño referido, sobre todo fuera del dolor
  // musculoesquelético; en él, discutido. La autoeficacia, solo mecanismo.
  { id: 'centrales', titulo: 'Efectos centrales',
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'Ánimo y sueño', hojaPaciente: 'general',
    resumen: 'Sueño, estado de ánimo y autoeficacia',
    apartados: {
      que: [
        { t: 'El ejercicio regular mejora los síntomas depresivos y de ansiedad y cómo dice dormir la persona, en población general, con depresión y con enfermedades crónicas (Singh 2023; Noetel 2024; Xie 2021). Por qué ocurre no está aclarado: se proponen factores neurotróficos, más serotonina y noradrenalina, cambios en el eje hipotálamo-hipófiso-suprarrenal, menos inflamación y efectos psicológicos y sociales, pero ninguna de las revisiones leídas los mide (Singh 2023; Noetel 2024).', nivel: 'mecanismo' },
        { t: 'La autoeficacia es la confianza en la propia capacidad para hacer algo, como subir escaleras o caminar un rato. Se propone que parte del efecto del ejercicio pase por ella, pero en la artrosis de rodilla solo dos ensayos lo han analizado, y midiendo a la vez la autoeficacia y el resultado, lo que no permite saber cuál cambia primero (Lima 2023).', nivel: 'mecanismo' },
        { t: 'Ánimo, sueño y dolor se influyen entre sí: en la lumbalgia crónica con síntomas depresivos, los autores no pueden separar si el ánimo mejora por el tratamiento o por tener menos dolor, ni al revés (Haller 2026).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'Depresión mayor: frente a un control activo (atención habitual, pastilla placebo, estiramientos), caminar o correr, el yoga, la fuerza, el aeróbico mixto y el tai chi redujeron los síntomas con un efecto moderado. La confianza en esos resultados es baja para caminar o correr y muy baja para el resto, porque casi ningún estudio cegó a participantes ni terapeutas (Noetel 2024, 218 estudios).', nivel: 'clinico' },
        { t: 'Síntomas depresivos y de ansiedad en adultos sanos, con trastornos mentales o con enfermedades crónicas: la actividad física los reduce con un efecto moderado, también en la artritis; la mayoría de las revisiones reunidas tienen una calidad metodológica críticamente baja (Singh 2023, 97 revisiones).', nivel: 'clinico' },
        { t: 'Intensidad: en la depresión, el efecto aumenta con la intensidad del ejercicio, pero la actividad ligera también tuvo un efecto relevante (Noetel 2024; Singh 2023). Programas más largos no dieron más efecto (Singh 2023).', nivel: 'clinico' },
        { t: 'Sueño en adultos sin enfermedad: con 2 meses o más de ejercicio regular, físico o de mente-cuerpo, mejoran la calidad del sueño referida, el insomnio y la somnolencia de día. Medido con actígrafo solo mejora un poco la eficiencia del sueño, no las horas ni lo que tarda en dormirse. Todos los ensayos tienen riesgo de sesgo alto por falta de cegamiento (Xie 2021, 22 ensayos).', nivel: 'clinico' },
        { t: 'Ánimo en el dolor musculoesquelético crónico: en las revisiones Cochrane de dolor crónico, solo 5 de 21 midieron la función psicológica y los resultados fueron variables, con efectos favorables o sin diferencias (Geneen 2017); en la fibromialgia, la mayoría de las revisiones encuentran menos depresión y ansiedad, en una síntesis descriptiva y de calidad desigual (Pérez-Romero 2026); en la lumbalgia crónica con síntomas depresivos hay 5 ensayos, con certeza baja o muy baja (Haller 2026).', nivel: 'discutido' },
        { t: 'Sueño en la fibromialgia: el ejercicio aeróbico en el agua y el aeróbico en tierra con flexibilidad mejoraron el sueño frente a placebo, con certeza baja; la fuerza, el aeróbico solo y el mente-cuerpo en tierra no fueron concluyentes, y casi todos los estudios tenían riesgo de sesgo alto (Hudson 2025). Las revisiones Cochrane de dolor crónico no dan datos de sueño (Geneen 2017).', nivel: 'discutido' },
        { t: 'Autoeficacia como mediador: en la artrosis de rodilla, la autoeficacia para caminar explicó parte del efecto de un programa de dieta y ejercicio sobre el dolor y la función, y en un ensayo de ejercicio solo el texto lo afirma para subir escaleras pero la tabla no lo confirma. Son estudios únicos y la autoeficacia se midió a la vez que el resultado (Lima 2023). En la depresión, en un estudio la autoeficacia no medió el efecto (Noetel 2024).', nivel: 'mecanismo' },
      ],
      consulta: [
        { t: 'Si el paciente tiene síntomas depresivos, el ejercicio tiene un efecto propio sobre ellos. En la depresión, los autores proponen considerarlo junto a la psicoterapia y los antidepresivos, no en su lugar, y piden leer la comparación con cautela, porque en parte es indirecta (Noetel 2024).', nivel: 'clinico' },
        { t: 'Con un paciente que tolera poco, la actividad ligera ya tuvo un efecto relevante sobre la depresión; no hace falta llegar a intensidades altas para empezar (Noetel 2024).', nivel: 'clinico' },
        { t: 'La fuerza y el yoga tuvieron menos abandonos que el control en los ensayos de depresión (Noetel 2024).', nivel: 'clinico' },
        { t: 'No le prometas dormir más horas: lo que mejora es cómo dice dormir, mientras que medido con actígrafo las horas de sueño no cambian (Xie 2021).', nivel: 'clinico' },
        { t: 'Explicar la mejoría del dolor con «ganará confianza y por eso le dolerá menos» como un hecho va más allá de lo medido: que el ejercicio actúe a través de la autoeficacia es una hipótesis con datos débiles (Lima 2023).', nivel: 'mecanismo' },
      ],
      paciente: [
        { t: 'Si además se siente bajo de ánimo, moverse con regularidad (caminar, fuerza, yoga) mejora esos síntomas en los estudios, incluso a intensidad suave. No sustituye al tratamiento que le indique su médico.', apoya: [0, 1, 2] },
        { t: 'El ejercicio regular suele mejorar cómo siente que duerme, aunque no necesariamente le hará dormir más horas.', apoya: [3] },
      ],
      detalle: [
        'No hay frase para el paciente sobre ánimo o sueño en su dolor musculoesquelético en concreto: ahí la evidencia está discutida, y las frases se apoyan en lo medido en depresión y en adultos sin enfermedad.',
        'En la red de la depresión, el propio control activo mejoró mucho (g −0,95), y el efecto del ejercicio se suma a esa mejora. La danza tuvo el efecto mayor, pero con 5 estudios, casi todo mujeres de unos 31 años. Los programas que dejaban más autonomía al participante tuvieron menos efecto, al contrario de lo esperado (Noetel 2024).',
        'Frente a la psicoterapia o los antidepresivos, los tamaños de efecto del ejercicio fueron parecidos o algo mayores, pero comparando revisiones distintas, y los autores piden confirmarlo (Singh 2023; Noetel 2024).',
        'Que los programas más cortos o con menos minutos semanales dieran más efecto lo llaman los autores contraintuitivo; proponen menor adherencia con el tiempo o expectativas que se diluyen sin cegamiento (Singh 2023).',
        'En la lumbalgia con síntomas depresivos, el mejor resultado (yoga con educación) viene de un solo estudio cuyo control era un folleto, lo que según los autores probablemente infla el efecto (Haller 2026).',
        'En el sueño de la fibromialgia, el mente-cuerpo en el agua salió peor que el placebo, y los tamaños de efecto mayores de 2 desviaciones estándar, con intervalos muy amplios, no son creíbles como magnitud; los autores no confían en la clasificación de tratamientos por sí sola (Hudson 2025).',
        'En los adultos sin enfermedad, la mejoría del sueño fue igual con ejercicio físico que con mente-cuerpo, y no hubo diferencias claras por edad o sexo; el «3 a 5 veces por semana» es una recomendación de los autores, no un resultado (Xie 2021).',
        'Además de la autoeficacia, en la artrosis de rodilla la fuerza del cuádriceps explicó parte del efecto del ejercicio sobre el dolor; en total, 18 de los mediadores estudiados no mediaron, y los autores dicen que los mecanismos del ejercicio siguen sin estar claros (Lima 2023).',
      ],
    },
    fuentes: ['Noetel 2024', 'Singh 2023', 'Xie 2021', 'Geneen 2017', 'Pérez-Romero 2026', 'Haller 2026', 'Hudson 2025', 'Lima 2023'] },
  // Bloque 6 (2026-10): cinco fuentes leídas enteras en PMC (Fu y Levine 2015,
  // Cortez 2025, Hogwood 2025, Ziaks 2024, Yanagimoto 2025), un PDF del usuario
  // (Kwok 2025) y George 2016, leída entera para la tarjeta de POTS; niveles en
  // docs/efectos-ejercicio.md. Lo clínico es poco y de certeza baja: algunos
  // síntomas y la calidad de vida física. Dejar de cumplir el criterio de
  // frecuencia cardiaca, discutido. La dosis no está aquí: es la del recuadro y
  // el aviso de la tarjeta.
  { id: 'ortostatica', titulo: 'Ejercicio en la intolerancia ortostática (POTS)',
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'Si se marea o se le acelera el corazón al estar de pie (POTS)', hojaPaciente: 'condicion',
    resumen: 'Qué cambia el entrenamiento en el corazón, el volumen de sangre y la frecuencia cardiaca al ponerse de pie, y hasta dónde llega lo demostrado',
    apartados: {
      que: [
        { t: 'La explicación más citada: en el POTS el corazón es algo pequeño y el volumen de sangre bajo, así que de pie cada latido expulsa menos sangre y la frecuencia cardiaca sube para compensar. El desacondicionamiento físico contribuiría a ello, y el reposo prolongado en cama produce cambios parecidos en el corazón (Fu y Levine 2015).', nivel: 'mecanismo' },
        { t: 'Esa explicación no está cerrada: en la mayoría de los estudios el gasto cardiaco durante el ejercicio está conservado, dar suero intravenoso no mejora la capacidad de ejercicio, y al comparar con controles igual de desentrenados la capacidad aeróbica solo era menor en 3 de 10 estudios. Se propone que la subida exagerada de la frecuencia cardiaca y de la respiración sea la que hace parar antes (Hogwood 2025).', nivel: 'discutido' },
        { t: 'Lo que cambia el entrenamiento: tras 3 meses, en los estudios de un mismo grupo, aumentaron la capacidad aeróbica (8 %), la masa del ventrículo izquierdo (12 %) y el volumen de sangre (6 %), y la frecuencia cardiaca fue más baja a cada nivel de esfuerzo, sin llegar a la de controles sanos sedentarios (Fu y Levine 2015). En el único ensayo aleatorizado mejoró la capacidad aeróbica sin cambiar el volumen que expulsa cada latido (Hogwood 2025).', nivel: 'mecanismo' },
        { t: 'Si el beneficio viene del corazón, del volumen de sangre, de más actividad del sistema parasimpático o de la extracción de oxígeno por el músculo está sin aclarar, y tampoco se sabe si el ejercicio actúa sobre las causas propias del POTS o solo como en cualquier persona desentrenada (Hogwood 2025; Cortez 2025).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'En el único ensayo aleatorizado con criterios actuales, 3 meses de ejercicio semisupervisado frente a la atención habitual mejoraron la intolerancia ortostática y los síntomas vasomotores del COMPASS-31 y el componente físico del SF-36, pero no la puntuación total de síntomas ni el componente mental. El ensayo tiene riesgo de sesgo alto por las pérdidas (Kwok 2025).', nivel: 'clinico' },
        { t: 'La calidad de vida mejoró en los 4 estudios que la midieron, comparando cada paciente antes y después; ninguno midió la función diaria ni la discapacidad. El riesgo de sesgo fue moderado o alto en todos los estudios menos uno, y los autores no pudieron graduar la certeza ni hacer recomendaciones de práctica (Cortez 2025).', nivel: 'clinico' },
        { t: 'Dejar de cumplir el criterio de frecuencia cardiaca: entre la mitad y algo más de dos tercios de quienes terminaron programas de 3 a 6 meses ya no lo cumplían (Fu y Levine 2015; Cortez 2025). Pero son estudios sin aleatorizar, con sal y agua añadidas, y en el mayor abandonó el 59 % (George 2016); en adolescentes, 4 semanas no cambiaron la prueba de bipedestación (Yanagimoto 2025).', nivel: 'discutido' },
        { t: 'Cuánto pesa todo esto: una revisión dice que el ejercicio mejora de forma eficaz la capacidad de ejercicio y los síntomas, con solo dos estudios de entrenamiento (Hogwood 2025); otra no pudo graduar la certeza por el riesgo de sesgo (Cortez 2025); la revisión de ensayos aleatorizados lo cita entre los tratamientos prometedores, todos con ensayos pequeños (Kwok 2025).', nivel: 'discutido' },
      ],
      consulta: [
        { t: 'Los programas de los estudios empiezan tumbado o semirreclinado y pasan a ejercicio de pie poco a poco, normalmente no antes del segundo o tercer mes. Ningún ensayo compara esa progresión con empezar de pie (Fu y Levine 2015; Cortez 2025).', nivel: 'mecanismo' },
        { t: 'Una propuesta de expertos: empezar por debajo del umbral que dispara los síntomas (15–20 latidos por encima de la frecuencia de reposo en esa postura, o un esfuerzo de 2 sobre 10) y progresar por cómo responde el paciente, no por calendario. Está pendiente de validar (Ziaks 2024).', nivel: 'mecanismo' },
        { t: 'Los abandonos van del 10 al 59 % según el estudio, y uno con supervisión parcial tuvo de los más bajos (16 %) (Cortez 2025). Si el paciente empeora mucho tras un esfuerzo pequeño (malestar postesfuerzo), los expertos proponen cribarlo y empezar con dosis muy bajas; ningún estudio de eficacia lo midió (Ziaks 2024; Cortez 2025).', nivel: 'mecanismo' },
        { t: 'En los estudios, el ejercicio iba casi siempre junto a más sal y agua, y a veces medicación: el efecto no se puede atribuir solo al ejercicio (Cortez 2025).', nivel: 'clinico' },
      ],
      paciente: [
        { t: 'Un programa de ejercicio que empieza tumbado o sentado y avanza poco a poco hacia ejercicio de pie suele mejorar cómo tolera estar de pie y la parte física de su calidad de vida. No mejora todos los síntomas, ni a todo el mundo por igual.', apoya: [0, 1] },
      ],
      detalle: [
        'Cuatro estudios pequeños parecen analizar a los mismos menos de 20 pacientes, así que ese grupo pesa de más en los resultados (Cortez 2025).',
        'El «53 % curados» de quienes completaron el programa de 3 meses (Fu y Levine 2015) es de estudios sin grupo control aleatorizado; los propios autores dicen que para muchos pacientes 3 meses pueden ser poco y que hay que seguir entrenando para mantener la mejoría.',
        'En el estudio comunitario con control, el «control» eran quienes rechazaron hacer ejercicio, y se excluyó a muchos cribados por tomar medicación (Cortez 2025).',
        'En el ensayo de adolescentes, con 4 semanas en ingreso, de pie aumentaron el volumen que expulsa cada latido y el gasto cardiaco, pero no cambiaron la prueba de bipedestación ni se midieron los síntomas, y los grupos no se repartieron al azar (Yanagimoto 2025).',
        'Los autores de una revisión cuentan, como experiencia propia y no como dato, que muchos pacientes empeoran en pocos días si dejan de entrenar, y que el exceso de ejercicio puede desencadenar un brote (Cortez 2025).',
        'La revisión de ensayos aleatorizados excluye por diseño los estudios sin aleatorizar, que son casi toda la evidencia del ejercicio en el POTS (Kwok 2025).',
      ],
    },
    fuentes: ['Fu y Levine 2015', 'Cortez 2025', 'Hogwood 2025', 'Ziaks 2024', 'Yanagimoto 2025', 'Kwok 2025', 'George 2016'] },
  // Hipermovilidad (2026-10): añadido para enlazar el recuadro de hipermovilidad
  // de la fase 5 (sin el subtipo vascular). Siete fuentes leídas enteras en PMC
  // y cinco en PDF del usuario (Liaghat 2025, Smith 2013, Reychler 2021,
  // Spanhove 2022, Brittain 2023); niveles en docs/efectos-ejercicio.md.
  { id: 'hipermovilidad', titulo: 'Ejercicio en la hipermovilidad (SEDh / TEH)',
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'Si tiene hipermovilidad articular', hojaPaciente: 'condicion',
    resumen: 'Si se puede cargar con fuerza a una persona hiperlaxa, cuánto dolor provoca el ejercicio y hasta dónde llega lo demostrado',
    apartados: {
      que: [
        { t: 'En el SEDh y el TEH la fuerza máxima y la resistencia muscular son más bajas que en controles de la misma edad, con la misma masa muscular. Los autores lo atribuyen, como hipótesis, a más grasa en el músculo, al dolor, a la propiocepción o a menos actividad física (Coussens 2022, estudio transversal solo en mujeres).', nivel: 'mecanismo' },
        { t: 'La propiocepción de la rodilla es peor que en personas sin hipermovilidad; en el hombro no se ha demostrado diferencia. Son estudios de casos y controles sin evaluador ciego, y no muestran que ese déficit cause los síntomas ni que el ejercicio lo corrija (Smith 2013).', nivel: 'mecanismo' },
        { t: 'La idea detrás de la fuerza con carga es que el músculo aporte la estabilidad que la articulación laxa no tiene. Es la justificación de los ensayos, no algo medido: en el de hombro, la fuerza no cambió de forma significativa entre grupos, y ganar fuerza explica poco de la mejoría (Liaghat 2022; Christensen 2026).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'Hombro con TEH, 16 semanas: la fuerza con carga alta, supervisada dos veces por semana, mejoró la función algo más que el ejercicio suave en casa (WOSI −174,5 puntos), pero por debajo de la diferencia mínima importante. Al año ya no había diferencia, y en los dos grupos la mayoría había mejorado de forma clínicamente importante (Liaghat 2022; Liaghat 2024).', nivel: 'clinico' },
        { t: 'En ese ensayo, el dolor que provocaba cada sesión fue bajo con carga alta y con carga baja, sin diferencia entre ellas (Liaghat 2025, con 64 de los 100 pacientes). La carga alta dio más agujetas y cefaleas pasajeras, y no hubo efectos adversos graves (Liaghat 2022).', nivel: 'clinico' },
        { t: 'Ningún tipo de ejercicio ha demostrado ser mejor que otro: dos programas de hombro en casa mejoraron igual (Spanhove 2022, 21 mujeres); en la muñeca, el ejercicio de estabilización dio lo mismo que la órtesis (Lindholm 2024); y en un ensayo en niños, ejercitar la rodilla dentro de su rango hipermóvil o solo hasta la extensión neutra dio el mismo dolor (Reychler 2021). La guía de fisioterapia llega a lo mismo: no hay evidencia convincente a favor de un tipo concreto (Engelbert 2017).', nivel: 'clinico' },
        { t: 'En niños con hipermovilidad sintomática, un programa multidisciplinar de 8 semanas no añadió nada a la atención habitual con educación y consejo: los dos grupos mejoraron el dolor al año (Bale 2019, 119 niños).', nivel: 'clinico' },
        { t: 'Los efectos adversos atribuibles al ejercicio fueron raros, menos del 1 % de los participantes, una estimación imprecisa por los pocos estudios (Buryk-Iggers 2022).', nivel: 'clinico' },
        { t: 'Cuánto pesa todo esto: una revisión habla de beneficio sobre el dolor y la propiocepción sea cual sea la intervención (Reychler 2021) y otra de evidencia que apoya el ejercicio terapéutico (Brittain 2023), pero sus propios datos son ensayos pequeños, de 4 a 16 semanas, sin diferencia cuando se comparan dos programas; la tercera concluye que no se puede afirmar nada definitivo sobre eficacia, dosis ni seguridad (Buryk-Iggers 2022).', nivel: 'discutido' },
      ],
      consulta: [
        { t: 'La carga alta no está contraindicada en el hombro con TEH: el ensayo progresó del 50 % de 10 RM a 4 series de 8 RM, con mancuernas que subían de 50 en 50 g y supervisión en 2 de las 3 sesiones semanales (Liaghat 2022; Liaghat 2025). Los autores no saben si vale sin esa supervisión, en el SEDh o con más dolor de partida (Liaghat 2025).', nivel: 'clinico' },
        { t: 'La regla de dolor de los dos ensayos de hombro: hasta 5 sobre 10 durante el ejercicio es aceptable; por encima, se bajan repeticiones, carga o recorrido, o se cambia el ejercicio. Ningún ensayo la compara con otra regla (Liaghat 2025; Spanhove 2022).', nivel: 'mecanismo' },
        { t: 'Para empezar en casa, los pacientes eligieron casi siempre ejercicios en cadena cerrada con poca carga (deslizar el brazo sobre una mesa o una pared), que dan sensación de estabilidad. Es lo que eligieron, no una comparación (Spanhove 2022).', nivel: 'mecanismo' },
        { t: 'Ninguno de estos ensayos incluye el subtipo vascular, y sus resultados no se pueden generalizar a otros subtipos (Buryk-Iggers 2022). En el vascular, la pauta es la del recuadro de la fase 5: cargas ligeras, sin isométricos y a una intensidad que permita conversar (Byers 2017).', nivel: 'clinico' },
      ],
      paciente: [
        { t: 'El ejercicio de fuerza, subiendo la carga poco a poco, no suele aumentar el dolor y suele ayudar a que la articulación funcione mejor. La mejoría suele ser moderada, y al principio puede dejar agujetas que pasan.', apoya: [0, 1] },
        { t: 'No hay un ejercicio «especial» para la hipermovilidad: los distintos programas que se han probado han dado resultados parecidos.', apoya: [2] },
      ],
      detalle: [
        'El ensayo de hombro no incluyó a ningún paciente con SEDh, solo TEH de atención primaria. Analizando solo a quienes cumplieron el programa, la carga alta sí llegó a la diferencia mínima importante a las 16 semanas (WOSI −250,7) (Liaghat 2022).',
        'La carga alta tenía 32 sesiones supervisadas y la baja 3: parte de la diferencia puede deberse a la atención, como dicen los propios autores (Liaghat 2024).',
        'Para llegar a la diferencia mínima importante en función habría hecho falta subir alrededor de un 80 % la fuerza de rotación externa; casi nadie lo consiguió (Christensen 2026).',
        'En el análisis del dolor se perdió un tercio de los cuadernos de registro, y el dolor de partida era bajo: puede no representar a pacientes con más dolor (Liaghat 2025).',
        'El resumen de una revisión dice que la calidad de vida mejoró «sistemáticamente»; en su texto, solo un estudio la compara entre grupos, y solo en el componente físico (Reychler 2021).',
        'La «evidencia fuerte» para el entrenamiento de la función motora de otra revisión es una etiqueta por niveles de estudio, no una certeza GRADE, y se apoya sobre todo en un ensayo en niños sin diferencia entre grupos (Brittain 2023).',
        'El programa de hombro en casa terminó antes por la COVID-19, no tenía grupo sin ejercicio y su Beighton medio (3,6–4,1) queda por debajo de los cortes de 2017 (Spanhove 2022). El de la muñeca usó un código diagnóstico que no distingue subtipos y no se devolvió el 40 % de los diarios (Lindholm 2024).',
      ],
    },
    fuentes: ['Coussens 2022', 'Smith 2013', 'Liaghat 2022', 'Liaghat 2024', 'Liaghat 2025', 'Christensen 2026', 'Spanhove 2022', 'Lindholm 2024', 'Reychler 2021', 'Engelbert 2017', 'Bale 2019', 'Buryk-Iggers 2022', 'Brittain 2023', 'Byers 2017'] },
  // Embarazo y posparto (2026-10): para la tarjeta «Embarazo o posparto». Nueve
  // fuentes en PMC y ocho PDF del usuario; niveles en docs/efectos-ejercicio.md.
  // La dosis, las contraindicaciones, los signos para parar, el supino y la
  // vuelta a correr no están aquí: son del recuadro de la fase 5 y de los avisos
  // de la fase 6. El dolor lumbopélvico del embarazo, discutido (dos revisiones
  // enfrentadas); la seguridad, clínico con certeza muy baja y sin frase para el
  // paciente; la diástasis, mecanismo.
  { id: 'embarazo', titulo: 'Ejercicio en el embarazo y el posparto',
    // Hoja para el paciente (docs/esquemas, «ejercicio-paciente»): título en lenguaje llano y si va
    // en la parte general o en «Si le han dicho que tiene…» (pendiente de revisión del usuario, 2026-10)
    tituloPaciente: 'Durante el embarazo y después del parto', hojaPaciente: 'condicion',
    resumen: 'Qué hace el ejercicio en el dolor lumbopélvico, el ánimo y los escapes de orina, qué pasa con la diástasis y el supino, y hasta dónde llega lo demostrado',
    apartados: {
      que: [
        { t: 'Boca arriba, desde la semana 20, el útero puede reducir el retorno de la sangre al corazón durante el ejercicio (ACOG 2020). En los pocos estudios que lo midieron, de una sola sesión y con 12 a 27 mujeres, el ejercicio en supino subió la tensión y la frecuencia cardiaca de la madre y, en uno de 14 mujeres, bajó algo el flujo del útero; los autores concluyen que no hay evidencia suficiente para decir si es seguro o si hay que evitarlo (Mottola 2019).', nivel: 'mecanismo' },
        { t: 'La separación de los rectos del abdomen es frecuente tras el parto, casi siempre leve, y se reduce sola durante el primer año: en un estudio de 300 primíparas, del 60 % a las 6 semanas al 33 % a los 12 meses (Sperstad 2016; Gluppe 2021).', nivel: 'mecanismo' },
      ],
      evidencia: [
        { t: 'Dolor lumbar y pélvico en el embarazo: una revisión Cochrane vio que 8 a 12 semanas de ejercicio reducen cuántas mujeres lo tienen (certeza moderada), aunque el dolor pélvico solo no mejoró con ejercicio en grupo (Liddle y Pennick 2015). Otra revisión no vio que redujera cuántas lo tienen, pero sí cuánto duele, con certeza muy baja y estudios muy distintos entre sí (Davenport 2019 (dolor lumbopélvico)).', nivel: 'discutido' },
        { t: 'Tras el parto, en mujeres que ya tienen dolor lumbar o pélvico, el ejercicio solo, sobre todo el fortalecimiento del tronco, bajó el dolor unos 2 puntos sobre 10 (4 ensayos, certeza moderada) y mejoró la discapacidad (certeza baja); contando también los ensayos con otros tratamientos añadidos, la mejoría del dolor fue menor (1,4 puntos, certeza baja). Los grupos control también mejoraron: el ejercicio acelera una mejoría que suele llegar sola (Ruchat 2025).', nivel: 'clinico' },
        { t: 'Ánimo en el embarazo: el ejercicio solo, en programas supervisados, redujo algo los síntomas depresivos y cuántas mujeres superaban el corte de depresión de los cuestionarios (certeza moderada); unido a dieta u otras intervenciones, no. No cambió el ánimo después del parto ni la ansiedad (Davenport 2018 (ánimo)).', nivel: 'clinico' },
        { t: 'Ánimo tras el parto: el ejercicio solo redujo de forma moderada los síntomas depresivos y la probabilidad de depresión (certeza moderada), y algo los de ansiedad (2 ensayos, certeza baja); el suelo pélvico solo no mejoró el ánimo. Ningún ensayo lo comparó con antidepresivos ni con psicoterapia (Deprato 2025).', nivel: 'clinico' },
        { t: 'Escapes de orina: entrenar el suelo pélvico durante el embarazo, en mujeres sin escapes, los hace menos probables al final del embarazo (certeza moderada) y a los 3–6 meses del parto (certeza alta) (Woodley 2020); otra revisión llega a lo mismo, en el embarazo (certeza baja) y después del parto (certeza moderada) (Davenport 2018 (incontinencia)). Como tratamiento de quien ya tiene escapes, el efecto es incierto: casi no hay ensayos (Woodley 2020; Davenport 2018 (incontinencia)).', nivel: 'clinico' },
        { t: 'Ofrecer el suelo pélvico a todas las mujeres después del parto: una revisión no vio un efecto claro sobre los escapes a los 6–12 meses (Woodley 2020, certeza moderada); otra, más reciente, vio menos incontinencia al terminar el programa (Beamish 2025, certeza moderada). La guía NICE lo ofrece supervisado solo a las que tienen factores de riesgo (NICE NG210).', nivel: 'discutido' },
        { t: 'Diástasis: el ejercicio abdominal tras el parto reduce la distancia entre los rectos alrededor de medio centímetro (certeza baja), y en una sola sesión el curl-up la reduce y la contracción del transverso la aumenta (Beamish 2025). Ninguna revisión ha medido si eso cambia el dolor o la función; en los pocos estudios que miraron el dolor lumbar y la disfunción del suelo pélvico, sin efecto (Beamish 2025; Gluppe 2021).', nivel: 'mecanismo' },
        { t: 'Que la diástasis cause dolor no está demostrado: en una cohorte de 178 mujeres, al año tenían dolor lumbopélvico el 46 % con diástasis y el 33 % sin ella, una diferencia que no llegó a ser significativa en un estudio pequeño (Sperstad 2016).', nivel: 'mecanismo' },
        { t: 'Seguridad: en los estudios, el ejercicio de mujeres sin contraindicaciones no aumentó el aborto ni la muerte perinatal, con certeza muy baja y con resultados que no descartan un aumento; todos los ensayos empezaron después de la semana 8 y casi todos eran de ejercicio aeróbico moderado (Davenport 2019 (mortalidad fetal)).', nivel: 'clinico' },
        { t: 'Cuánto pesa lo del posparto: las guías nacionales se apoyan en evidencia escasa (Evenson 2024); las revisiones posteriores con GRADE dan certeza moderada para el ánimo y el dolor, pero solo con el ejercicio sin otras intervenciones y con pocos ensayos (Deprato 2025; Ruchat 2025).', nivel: 'discutido' },
      ],
      consulta: [
        { t: 'Los ensayos solo incluyen embarazos sin contraindicaciones para el ejercicio; con una, manda el recuadro de la fase 5 y su equipo obstétrico (Davenport 2018 (ánimo); Davenport 2019 (mortalidad fetal)).', nivel: 'clinico' },
        { t: 'El efecto sobre el ánimo y el dolor sale del ejercicio en sí: cuando iba junto a dieta, educación u otros tratamientos, desaparecía o era menor (Davenport 2018 (ánimo); Deprato 2025; Ruchat 2025). Para el ánimo es un complemento: ningún ensayo lo compara con el tratamiento de una depresión (Deprato 2025).', nivel: 'clinico' },
        { t: 'El efecto sobre los escapes es del entrenamiento del suelo pélvico: ningún estudio mide el ejercicio general sin él (Davenport 2018 (incontinencia)).', nivel: 'clinico' },
        { t: 'La diástasis no es un motivo para no hacer ejercicio ni para dejar el suelo pélvico: los autores de una revisión lo recomiendan así, con certeza baja (Gluppe 2021), y el consenso de expertos no la cuenta como contraindicación (Davenport 2025).', nivel: 'mecanismo' },
        { t: 'Las reglas de vuelta a la actividad y a correr tras el parto del recuadro son consenso de expertos, no resultados de ensayos (Davenport 2025; Christopher 2024; Deering 2024).', nivel: 'mecanismo' },
        { t: 'Con el supino, cambiar de posición si se marea o se encuentra mal es una recomendación débil, y la revisión en que se apoya no permite prohibirlo ni darlo por seguro (Mottola 2018; Mottola 2019).', nivel: 'mecanismo' },
      ],
      paciente: [
        { t: 'Hacer ejercicio durante el embarazo o después del parto suele ayudar algo al estado de ánimo. Es un apoyo: si hay una depresión, no sustituye a su tratamiento.', apoya: [2, 3] },
        { t: 'Entrenar el suelo pélvico durante el embarazo, antes de tener escapes de orina, hace menos probable tenerlos al final del embarazo y después del parto.', apoya: [4] },
        { t: 'Si después del parto le duele la espalda o la pelvis, el ejercicio, sobre todo de fuerza del tronco, ayuda a que mejore antes. Suele mejorar también con el tiempo.', apoya: [1] },
      ],
      detalle: [
        'Dolor del embarazo: en la revisión de 2019, un estudio con un efecto enorme pesa mucho en la intensidad del dolor y no hay análisis sin él, y algunas mujeres cuentan dos veces en las figuras; sus autores lo llaman «effective treatment» con certeza muy baja (Davenport 2019 (dolor lumbopélvico)).',
        'Dolor tras el parto: la mejoría con el ejercicio solo (−2,2 puntos) tiene un intervalo que cruza el umbral de 2 puntos que los propios autores usan para la relevancia clínica, y algunos grupos control cuentan dos veces (Ruchat 2025).',
        'Ánimo tras el parto: el efecto parece mayor si el ejercicio empieza en las 12 primeras semanas, pero es una comparación entre estudios distintos, con más mujeres deprimidas al empezar en esos estudios. Los autores lo presentan además como alternativa a los tratamientos habituales sin haberlo comparado con ellos (Deprato 2025).',
        'Una cohorte de 10 098 mujeres vio más escapes después del parto con ejercicio casi diario que con ejercicio ocasional; es una asociación, de certeza muy baja, que el resumen de la revisión no recoge (Davenport 2018 (incontinencia)).',
        'Tras el parto, que el suelo pélvico reduzca los escapes al terminar el programa no se acompaña de un cambio en su gravedad (certeza muy baja) ni en la incontinencia anal o el prolapso (Beamish 2025).',
        'Parto: el ejercicio solo se asoció a menos partos instrumentales (certeza moderada); la menor tasa de cesáreas salió de los ensayos con dieta y otras intervenciones (certeza baja), aunque el resumen de la revisión dice que no cambia. De lesiones o caídas de la madre no da cifras en el texto principal (Davenport 2019 (daños maternos)).',
        'Siete de nueve guías nacionales desaconsejan el supino desde la semana 16, sobre todo por opinión de expertos; España y Francia, no (Mottola 2019).',
        'Abdominales tipo curl: en el embarazo, la guía canadiense aconseja evitarlos con diástasis, por opinión de expertos (Mottola 2018); tras el parto, los datos dicen que reducen la distancia entre los rectos (Beamish 2025). Son periodos distintos, no una contradicción.',
      ],
    },
    fuentes: ['Liddle y Pennick 2015', 'Davenport 2019 (dolor lumbopélvico)', 'Ruchat 2025', 'Davenport 2018 (ánimo)', 'Deprato 2025', 'Woodley 2020', 'Davenport 2018 (incontinencia)', 'Beamish 2025', 'NICE NG210', 'Gluppe 2021', 'Sperstad 2016', 'Davenport 2019 (mortalidad fetal)', 'Davenport 2019 (daños maternos)', 'ACOG 2020', 'Mottola 2019', 'Mottola 2018', 'Evenson 2024', 'Davenport 2025', 'Christopher 2024', 'Deering 2024'] },
];

// Bloque que enlaza la fase 6 por hipótesis (docs/efectos-ejercicio.md,
// «Enlace de la fase 6»): solo donde las frases para el paciente de ese bloque
// hablan justo de esa hipótesis. Escrita a mano, como HIP_PUNCION_SECA; una
// hipótesis que no está aquí sigue la regla de la irritabilidad.
//   · mecanotransduccion: las tendinopatías («en un tendón que duele, el
//     ejercicio con carga es el tratamiento principal»), y el pinzamiento
//     subacromial (h2): su guía (Desmeules 2025, la fuente de su pauta) lo
//     incluye en la tendinopatía del manguito y pone como tratamiento inicial
//     el ejercicio activo o de fuerza (A). No la rotura del manguito (h3): la
//     misma guía excluye la rotura completa, y h3 agrupa parcial y completa.
//   · hipoalgesia: el dolor crónico inespecífico, el latigazo y la
//     sensibilización central («el ejercicio regular ayuda algo con el dolor»;
//     la respuesta variable en el dolor generalizado y el latigazo), y lo que
//     cubren las revisiones Cochrane de Geneen 2017, la fuente de esa frase:
//     la artrosis de cadera y de rodilla, el dolor patelofemoral, y la
//     lumbalgia y la cervicalgia mecánicas, estas solo con cronología
//     «Crónico (>3 meses)», porque la frase habla de dolor crónico.
// Una entrada es la clave del bloque o { bloque, cronologia } (el texto exacto
// del botón de la fase 1). Fuera, a propósito: la artrosis de hombro y de
// tobillo o pie (Geneen no las cubre), las radiculares y la estenosis, las
// lesiones agudas (la frase del desuso viene del reposo en cama en sanos), las
// roturas, fracturas y luxaciones (se derivan) y el resto, sin frase propia.
const CRONICA = { bloque: 'hipoalgesia', cronologia: 'Crónico (>3 meses)' };
export const BLOQUE_POR_HIPOTESIS = {
  h2: 'mecanotransduccion', ca4: 'mecanotransduccion', ca9: 'mecanotransduccion', ro5: 'mecanotransduccion',
  co1: 'mecanotransduccion', co2: 'mecanotransduccion', co10: 'mecanotransduccion',
  tp8: 'mecanotransduccion', tp9: 'mecanotransduccion', tp11: 'mecanotransduccion',
  tp14: 'mecanotransduccion', tp15: 'mecanotransduccion', tp19: 'mecanotransduccion',
  ce5: 'hipoalgesia', ce7: 'hipoalgesia', ce14: 'hipoalgesia', ca15: 'hipoalgesia',
  ca1: 'hipoalgesia', ro1: 'hipoalgesia', ro3: 'hipoalgesia',
  lu1: CRONICA, lu2: CRONICA, lu6: CRONICA, lu7: CRONICA, lu9: CRONICA,
  ce1: CRONICA, ce2: CRONICA, ce6: CRONICA, ce9: CRONICA, ce11: CRONICA,
};

export const TEXTOS_EJERCICIO = {
  // Hoja impresa para el paciente (frases «Para explicárselo al paciente», literales); usted, como esas frases
  hojaPacienteTitulo: 'El ejercicio: lo que dicen los estudios',
  hojaPacienteIntro: 'En pocas palabras, lo que se sabe del ejercicio. Su fisioterapeuta le indicará qué ejercicios hacer, cuánto y cómo avanzar.',
  hojaPacienteCondiciones: 'Si le han dicho que tiene…',
  hojaPacienteMisEjercicios: 'Sus ejercicios',
  hojaPacientePie: 'Resumen de estudios revisados. No sustituye a lo que le indiquen su fisioterapeuta o su médico: ante cualquier duda, pregúnteles.',
  intro: 'Qué hace el ejercicio en el cuerpo y hasta dónde llega lo que se sabe. Sirve para decidir la dosis y para explicárselo al paciente sin prometer más de lo demostrado.',
  limites: 'Es una guía de lectura: no dosifica por ti, no cambia el plan y no sustituye a un tratamiento médico. Cada afirmación lleva su nivel de evidencia.',
  nivelesTitulo: 'Nivel de cada afirmación',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Se escriben de uno en uno, solo con fuentes leídas por completo.',
  pie: 'Contenido de apoyo para el fisioterapeuta. No se guarda ni se comparte con el informe.',
  // Enlace del bloque «Educación» de la fase 6 (docs/efectos-ejercicio.md, decisión 5)
  enlaceEducacion: 'Para explicárselo al paciente →',
  enlaceEducacionOtro: 'También: «{titulo}» →',
  enlaceMotivoAnimo: 'Por el riesgo psicosocial o un cuestionario de ánimo con síntomas.',
  enlaceMotivoReumatica: 'Por el lupus: sus frases para el paciente son para las enfermedades reumáticas inflamatorias.',
  enlaceMotivoOrtostatica: 'Por la disautonomía: su frase para el paciente habla de tolerar estar de pie, sin prometer que mejoren todos los síntomas; la dosis es la del aviso de este plan.',
  enlaceMotivoHipermovilidad: 'Por la hipermovilidad: sus frases para el paciente dicen que la fuerza graduada no suele aumentar el dolor y que no hay un ejercicio «especial»; vienen de ensayos sin el subtipo vascular.',
  enlaceMotivoEmbarazo: 'Por el embarazo o el posparto: sus frases para el paciente hablan del ánimo, de los escapes y del dolor de espalda o pelvis tras el parto, sin prometer más; la dosis es la del aviso de este plan.',
  enlaceEducacionAyuda: 'Abre «{titulo}», el bloque que corresponde a la irritabilidad elegida.',
  enlaceEducacionAyudaHip: 'Abre «{titulo}», el bloque que corresponde a {hipotesis}.',
  // Enlaces de los recuadros de la fase 5 (estados: CONDICION_EJERCICIO, lib/ejercicio.js)
  enlaceCondicion: 'Efectos del ejercicio: «{titulo}» →',
  enlaceCondicionLupus: 'Sus frases para el paciente son para las enfermedades reumáticas inflamatorias, lupus incluido.',
  enlaceCondicionHipermovilidad: 'Si se puede cargar con fuerza y cuánto dolor provoca, según los ensayos en SEDh y TEH; no vale para el subtipo vascular.',
  enlaceCondicionDisautonomia: 'Por qué los programas empiezan tumbado y hasta dónde llega lo demostrado; la dosis sigue siendo la de este recuadro.',
  enlaceCondicionEmbarazo: 'Por qué se recomienda moverse y hasta dónde llega lo demostrado en el dolor de espalda y pelvis, el ánimo y los escapes; la dosis sigue siendo la de este recuadro.',
  enlaceCondicionOsteoporosis: 'Lectura para ti: en el hueso el bloque solo llega a mecanismo (la densidad mejora algo); no está demostrado que el ejercicio reduzca las fracturas.',
};
