// ============================================================
// PhysiQ-Assessment · data/tejidos.js
// Tiempos de recuperación de tejidos (consulta desde la cabecera, ⏱)
// ============================================================
//
// Contenido clínico, sin lógica: lo pinta lib/tejidos.js en el panel
// «Tiempos de recuperación» (abrirTiemposTejido(), app.js). Solo consulta: no
// lo lee ningún algoritmo, ni el payload, ni los resúmenes, ni el informe con
// IA. Diseño y decisiones: docs/tiempos-tejido.md.
//
// Punto de partida: la tabla «Tiempos de Tejido» de physiq-wiki (adaptada de
// Snyder-Mackler et al., «Developing Treatment Pathways», 2012), corregida:
//   - una sola gravedad (color) por fila: en el wiki la versión de escritorio
//     y la de móvil pintaban distinto las filas de grado III;
//   - «Tendinopatía / Ruptura» separada en dos filas;
//   - la franja de fases de reparación, nueva (Wallace 2023).
// La franja de fases sale de Wallace 2023 (StatPearls, PDF del usuario). Lo
// que no sale de ninguna fuente leída lleva `pendiente: true` (o `fuentes: []`
// en una fase) y la app lo marca «pendiente de fuente» hasta que se revise
// (docs/tiempos-tejido.md, «Pendiente»).
//
// physiq-wiki tiene una copia (TISSUE_TIMES en su data.js, misma tabla): si
// cambias una fila aquí, cámbiala también allí.
//
// Esquema:
//   columnas[]  { etiqueta, corta, hasta }  — eje NO lineal, como en el wiki;
//               `hasta` = último día que cubre la columna (bordes contiguos:
//               la primera empieza en el día 0 y cada una en el `hasta` de la
//               anterior). Sirve para colocar la franja de fases y la línea «hoy».
//   gravedades  { <id>: etiqueta }  — color de la barra (--tej-<id>, styles.css)
//   grupos[]    { id, tejido, filas[], nota?, notaFuentes? } — `id` lo usa el filtro del panel;
//               `nota`: texto bajo el título del grupo, para lo que no cabe en una barra
//               (la axonotmesis), con sus fuentes en `notaFuentes`
//     fila      { id, mide, nombre, desde, hasta, gravedad, fuentes[], nota?, pendiente?, subtipos? }
//               `mide`: clave de `medidas`, qué mide la barra (obligatorio, también en subtipos)
//               `desde`/`hasta` = índices de columna (inclusive)
//     subtipos  opcional: [{ id, nombre, desde, hasta, gravedad?, fuentes[], nota?, pendiente? }]
//               (misma forma que una fila; sin `gravedad`, la de la fila). Se
//               pintan plegados bajo su fila («Ver N subtipos»). Solo con fuente leída para cada
//               subtipo: la lista de candidatos y su estado, en MIGRATION_PLAN.md,
//               Fase J, y docs/tiempos-tejido.md
//   fases[]     { id, nombre, desdeDia, hastaDia, fuentes[], tejido? } — franja
//               general de reparación, en días sobre el mismo eje; contiguas.
//               `tejido`: la fase solo vale para ese tejido (se pinta más clara);
//               `fasesNota` y `fasesFuente`, su aviso y su cita bajo la leyenda
//   fuentes     claves de data/referencias.js (las cuenta tests/referencias.mjs)

export const TIEMPOS_TEJIDO = {
  columnas: [
    { etiqueta: '1–3 días', corta: '1–3d', hasta: 3 },
    { etiqueta: '4–14 días', corta: '4–14d', hasta: 14 },
    { etiqueta: '3–4 semanas', corta: '3–4s', hasta: 28 },
    { etiqueta: '5–8 semanas', corta: '5–8s', hasta: 56 },
    { etiqueta: '2–3 meses', corta: '2–3m', hasta: 91 },
    { etiqueta: '3–6 meses', corta: '3–6m', hasta: 182 },
    { etiqueta: '6 meses–1 año', corta: '6m–1a', hasta: 365 },
    { etiqueta: '2 años', corta: '2a', hasta: 730 },
  ],

  // Qué mide cada barra (campo `mide` de filas y subtipos; decisión del usuario, 2026-10):
  // las fuentes dan plazos de cosas distintas y sin esto se comparaban barras que no son
  // comparables. El color sigue siendo la gravedad; esto va en el relleno (`relleno`:
  // liso, rayado o contorno) y, si no tiene relleno propio (`marca`), en una etiqueta tras
  // el nombre.
  medidas: {
    deporte: { etiqueta: 'Vuelta al deporte o a la función', relleno: 'liso' },
    proteccion: { etiqueta: 'Protección (inmovilización o descarga)', relleno: 'rayado' },
    programa: { etiqueta: 'Duración del programa de tratamiento', relleno: 'contorno' },
    biologia: { etiqueta: 'Biología de la reparación', relleno: 'liso', marca: 'biología' },
    sinEspecificar: { etiqueta: 'Sin especificar en la fuente', relleno: 'liso', marca: 'sin especificar' },
  },

  gravedades: {
    minima: 'Mínima',
    leve: 'Leve',
    moderada: 'Moderada',
    grave: 'Grave / reconstrucción',
  },

  grupos: [
    {
      id: 'tendon', tejido: 'Tendón',
      filas: [
        {
          id: 'tendinopatia', mide: 'sinEspecificar', nombre: 'Tendinopatía', desde: 2, hasta: 5, gravedad: 'moderada',
          fuentes: ['Snyder-Mackler 2012'],
          nota: 'No es un plazo de cicatrización: orienta el tiempo de adaptación a la carga. En la fuente comparte fila con la rotura.',
          // Fase J, 8 (tendinopatías): no hay plazo de cicatrización, sino la duración de los
          // programas de carga de las pautas de cada hipótesis, de fuentes ya leídas enteras
          // para esas pautas (2026-10). Ophey 2025 (ro5): «ejercicio de resistencia progresivo
          // de cuádriceps durante al menos 12 semanas». Chimenti 2024 (tp8): duración de 6
          // semanas a 6 meses sin diferencias en el resultado; mejoría del VISA-A a las 12
          // semanas. Jonsson 2008 y Pringels 2025 (tp9): 12 semanas (el ensayo mide a las 12 y
          // a las 24). Rich 2025 (ca9): 6 sesiones en 12 semanas. Mellor 2018 (ca4, ensayo
          // LEAP): 14 sesiones en 8 semanas; éxito del 77 % a las 8 semanas y del 79 % a las
          // 52. Lucado 2022 (co1): 6–12 semanas. See 2026 (co2): los estudios, 12 semanas.
          // Semanas → columnas: 8 s = «5–8 s» (3); 6–12 s = 3–4; 12 s = «2–3 m» (4);
          // 6 s–6 meses = 3–5.
          subtipos: [
            { id: 'tendinopatia_rotuliana', mide: 'programa', nombre: 'Rotuliana', desde: 4, hasta: 4, fuentes: ['Ophey 2025'],
              nota: 'Ejercicio de resistencia progresivo de cuádriceps durante al menos 12 semanas (de preferencia, pesado y lento); si a las 12 semanas no hay cambio clínicamente relevante, valorar una cinta infrarrotuliana. Certeza GRADE muy baja.' },
            { id: 'tendinopatia_aquilea_media', mide: 'programa', nombre: 'Aquílea, porción media', desde: 3, hasta: 5, fuentes: ['Chimenti 2024'],
              nota: 'La duración del programa (de 6 semanas a 6 meses) no parece cambiar el resultado; mejoría esperable de 18–21 puntos en el VISA-A a las 12 semanas.' },
            { id: 'tendinopatia_aquilea_insercional', mide: 'programa', nombre: 'Aquílea, insercional', desde: 4, hasta: 4, fuentes: ['Jonsson 2008', 'Pringels 2025'],
              nota: 'Excéntrico sin dorsiflexión, 12 semanas (Jonsson 2008). Limitar la dorsiflexión mejoró más el VISA-A a las 12 y a las 24 semanas (Pringels 2025).' },
            { id: 'tendinopatia_isquios_proximal', mide: 'programa', nombre: 'Isquiotibiales, proximal', desde: 4, hasta: 4, fuentes: ['Rich 2025'],
              nota: 'Programa de fuerza progresivo por fases, 6 sesiones en 12 semanas en el ensayo; reintroducir poco a poco la compresión (flexión profunda de cadera, estar sentado).' },
            { id: 'tendinopatia_glutea', mide: 'programa', nombre: 'Glútea', desde: 3, hasta: 3, fuentes: ['Mellor 2018'],
              nota: 'Educación sobre la carga más ejercicio, 14 sesiones en 8 semanas; éxito en el 77 % a las 8 semanas y en el 79 % al año (ensayo LEAP).' },
            { id: 'epicondilalgia_lateral', mide: 'programa', nombre: 'Epicondilalgia lateral', desde: 3, hasta: 4, fuentes: ['Lucado 2022'],
              nota: 'Ejercicio resistido de los extensores de la muñeca, 3 × 15 durante 6–12 semanas (evidencia moderada y opinión de expertos).' },
            { id: 'epicondilalgia_medial', mide: 'programa', nombre: 'Epicondilalgia medial', desde: 4, hasta: 4, fuentes: ['See 2026'],
              nota: 'Los estudios usaron excéntrico de flexores y pronadores durante 12 semanas; la revisión no recomienda una pauta concreta. Certeza baja o muy baja.' },
          ],
        },
        {
          // Wu 2017, «Tendon healing»: «The remodelling stage … begins after six to eight
          // weeks after injury and takes around one to two years, depending on the age and
          // condition of the patient»; «The healed tendon does not usually regain the
          // mechanical properties of the uninjured tissue».
          id: 'tendon_rotura', mide: 'biologia', nombre: 'Rotura / reparación de tendón', desde: 3, hasta: 7, gravedad: 'grave',
          fuentes: ['Wu 2017'],
          nota: 'Biología de la curación: la remodelación empieza a las 6–8 semanas y dura 1–2 años; el tendón no suele recuperar del todo su resistencia. La vuelta a la actividad la marca el protocolo.',
          // Fase J, 6 (Aquiles): Shamrock 2023 (StatPearls «Achilles Tendon Rupture», PDF del
          // usuario, leído entero, 2026-10). Sin cirugía, programa funcional de Glazebrook y
          // Rubinger: 0–2 semanas sin carga, bota con alzas y carga progresiva, «8 to 12 weeks:
          // wean off the boot». Tras la reparación: «Exercise focus is typically low impact for
          // the first 6 months, with high-impact exercises incorporated after 6 months,
          // emphasizing a return to sport as appropriate»; deportistas profesionales, más del
          // 30 % no vuelve y los que vuelven rinden menos al año, igual que antes a los 2 años.
          // Rerrotura: 10–40 % sin cirugía frente a 1–2 % con ella en estudios antiguos; la
          // evidencia de nivel 1 más reciente no encuentra diferencia.
          // Semanas → columnas: 8–12 s = «5–8 s» a «2–3 m» (3–4); desde 6 meses = «6m–1a» (6).
          subtipos: [
            { id: 'aquiles_conservador', mide: 'proteccion', nombre: 'Aquiles, sin cirugía', desde: 3, hasta: 4, fuentes: ['Shamrock 2023'],
              nota: 'Bota con alzas y carga progresiva; se retira la bota entre las 8 y las 12 semanas (programa funcional de Glazebrook y Rubinger). Rerrotura del 10–40 % en estudios antiguos; la evidencia más reciente no encuentra diferencia con la cirugía.' },
            { id: 'aquiles_cirugia', mide: 'deporte', nombre: 'Aquiles, reparado', desde: 6, hasta: 6, fuentes: ['Shamrock 2023'],
              nota: 'Ejercicio de bajo impacto los primeros 6 meses y de alto impacto después, hacia la vuelta al deporte. En deportistas profesionales, más del 30 % no vuelve a jugar. Manda el protocolo del cirujano.' },
            // Manguito rotador (Fase J, 6): Thigpen 2016, consenso ASSET tras reparación
            // artroscópica (PDF del usuario, leído entero, 2026-10; nivel V, opinión de expertos):
            // «a 2-week period of strict immobilization and a staged introduction of protected,
            // passive range of motion during weeks 2-6 postoperatively, followed by restoration of
            // active range of motion, and then progressive strengthening beginning at postoperative
            // week 12»; fase 3, 12–20 semanas; fase 4, 20–26 semanas, solo para trabajo pesado o
            // deporte por encima de la cabeza; «Around 4-5 months postoperatively, work- and
            // sport-specific rehabilitation activities can commence»; el tendón reparado «does not
            // approach normal levels of elasticity or strength until at least 6 months»; la PROM
            // protegida en las 6 primeras semanas en roturas pequeñas o medianas, grado A (SORT).
            // Semanas → columnas: 0–6 s = hasta «5–8 s» (3); 20–26 s = «3–6 m» (5).
            { id: 'manguito_proteccion', mide: 'proteccion', nombre: 'Manguito rotador reparado, protección', desde: 3, hasta: 3, fuentes: ['Thigpen 2016'],
              nota: '2 semanas de inmovilización estricta y movilidad pasiva protegida hasta la 6.ª (grado A en roturas pequeñas o medianas); 6 semanas de inmovilización si preocupa la cicatrización. A las 6 semanas la reparación tiene solo un 19–30 % de la resistencia normal. Manda el protocolo del cirujano.' },
            { id: 'manguito_programa', mide: 'programa', nombre: 'Manguito rotador reparado, rehabilitación', desde: 5, hasta: 5, fuentes: ['Thigpen 2016'],
              nota: 'Movilidad activa desde la 6.ª semana, fuerza progresiva desde la 12.ª y fortalecimiento avanzado de la 20.ª a la 26.ª, solo para trabajo pesado o deporte por encima de la cabeza. El trabajo específico de deporte o trabajo puede empezar hacia los 4–5 meses; el tendón no se acerca a su resistencia normal hasta los 6 meses como pronto. Consenso de expertos (nivel V).' },
          ],
        },
      ],
    },
    {
      id: 'musculo', tejido: 'Músculo',
      filas: [
        { id: 'doms', mide: 'sinEspecificar', nombre: 'Dolor muscular tardío (DOMS)', desde: 0, hasta: 0, gravedad: 'minima', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g1', mide: 'sinEspecificar', nombre: 'Rotura grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g2', mide: 'sinEspecificar', nombre: 'Rotura grado II', desde: 2, hasta: 3, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g3', mide: 'sinEspecificar', nombre: 'Rotura grado III', desde: 2, hasta: 4, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
        // Isquiotibiales por la clasificación BAMIC (Fase J, 7), PDF del usuario leídos
        // enteros (2026-10). Pollock 2014: grados 0–4 por la RM, con sufijo «a»
        // miofascial, «b» unión miotendinosa o «c» intratendinosa. Pollock 2016, tabla 3
        // (atletismo de élite, 65 lesiones, días medios hasta el entrenamiento completo):
        // 0 = 10; 1a = 18; 1b = 18; 2a = 25; 2b = 21; 2c = 27; 3b = 41 (1 lesión);
        // 3c = 84 (40–128); recurrencia 63 % en 2c y 57 % en 3c. Hollabaugh 2023, tabla 1,
        // recoge Pollock 2022 (70 lesiones, con el programa de rehabilitación de British
        // Athletics): 0 = 9; 1a = 12; 1b = 17; 2a = 19; 2b = 19; 2c = 35; 3c = 51,5.
        // Macdonald 2019, tabla 3 (plazos aproximados del programa): 1a días 5–10, 2b días
        // 14–28, 3c semanas 6–9. Hollabaugh atribuye a Macdonald «hasta 3 semanas» en «a»,
        // «4 a 8» en «b» y «2 a 4 meses» en «c», que no está en el artículo: no se usa.
        // Sin barra: 3a y 3b (0 y 1 lesión en Pollock 2016) y grado 4 (ninguna).
        { id: 'isquios_bamic', mide: 'deporte', nombre: 'Isquiotibiales (clasificación BAMIC)', desde: 1, hasta: 4, gravedad: 'moderada', fuentes: ['Pollock 2014', 'Pollock 2016', 'Hollabaugh 2023', 'Macdonald 2019'],
          nota: 'Días hasta volver al entrenamiento completo según el grado de la RM (0–4) y la localización: «a» miofascial, «b» unión miotendinosa, «c» dentro del tendón. Medias de atletas de élite con RM en la primera semana: en otros deportes y niveles los plazos pueden ser distintos.',
          subtipos: [
            { id: 'isquios_g0', mide: 'deporte', nombre: 'Grado 0 (RM normal)', desde: 1, hasta: 1, gravedad: 'leve', fuentes: ['Pollock 2016', 'Hollabaugh 2023'],
              nota: 'Entrenamiento completo a los 9–10 días de media, con muy pocas recaídas.' },
            { id: 'isquios_g1', mide: 'deporte', nombre: 'Grado 1a/1b (pequeña)', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Pollock 2016', 'Hollabaugh 2023', 'Macdonald 2019'],
              nota: 'Entrenamiento completo a los 12–18 días de media (de 5 a 10 días en el programa de British Athletics para una 1a).' },
            { id: 'isquios_g2ab', mide: 'deporte', nombre: 'Grado 2a/2b (moderada, sin tendón)', desde: 2, hasta: 2, fuentes: ['Pollock 2016', 'Hollabaugh 2023', 'Macdonald 2019'],
              nota: 'Entrenamiento completo a los 19–25 días de media (de 14 a 28 días en el programa para una 2b).' },
            { id: 'isquios_g2c', mide: 'deporte', nombre: 'Grado 2c (moderada, dentro del tendón)', desde: 2, hasta: 3, fuentes: ['Pollock 2016', 'Hollabaugh 2023'],
              nota: 'Entrenamiento completo a los 27–35 días de media. Recayó el 63 % en la serie de 2016.' },
            { id: 'isquios_g3c', mide: 'deporte', nombre: 'Grado 3c (extensa, dentro del tendón)', desde: 3, hasta: 4, gravedad: 'grave', fuentes: ['Pollock 2016', 'Hollabaugh 2023', 'Macdonald 2019'],
              nota: 'Entrenamiento completo a los 52–84 días de media (6–9 semanas en el programa, que retrasa unas 3 semanas la carga excéntrica). Recayó el 57 % en la serie de 2016.' },
          ],
        },
      ],
    },
    {
      id: 'ligamento', tejido: 'Ligamento',
      filas: [
        // Subtipos de tobillo (Fase J, 1): esguince lateral, PDF del usuario leídos
        // enteros (2026-10). Bergman 2025, «Short-Term Prognosis» y «Return-to-Sport
        // Timeline»: grado I «1–2 weeks», grado II «3–6 weeks», grado III «6–12 weeks
        // or longer (with possible surgical consideration)»; tras la reparación, «return
        // to play within approximately 3 to 4 months». Vuurberg 2018, tabla 7 (la
        // misma que la figura 2 de Martin 2021): vuelta completa al trabajo y al deporte
        // a las 3–4 semanas en la «distorsión», a las 6–8 en la «rotura parcial o total»
        // y a las 12–16 tras la cirugía. Martin 2021, pronóstico: «5% to 33% of patients
        // continue to experience pain 1 year or more after the LAS».
        // Semanas → columnas: 1–2 s = «4–14 d» (1); 3–6 s = «3–4 s» y «5–8 s» (2–3);
        // 6–12 s = «5–8 s» y «2–3 m» (3–4); 12–16 s = «2–3 m» y «3–6 m» (4–5).
        { id: 'ligamento_g1', mide: 'sinEspecificar', nombre: 'Esguince grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'tobillo_lateral_g1', mide: 'deporte', nombre: 'Tobillo, ligamento lateral', desde: 1, hasta: 1, fuentes: ['Bergman 2025'],
              nota: '1–2 semanas con movilización precoz y rehabilitación funcional.' },
            // Fase J, 2 (rodilla): Naqvi y Sherman 2023, «Treatment / Management»: «Patients
            // with grade I injuries typically can return to play within ten to 14 days»; el
            // grado II «more variable timelines» (por criterios) y el grado III sin plazo:
            // no se pintan. 10–14 días = «4–14 d» (1).
            { id: 'rodilla_lcm_g1', mide: 'deporte', nombre: 'Rodilla, ligamento colateral medial', desde: 1, hasta: 1, fuentes: ['Naqvi y Sherman 2023'],
              nota: 'Vuelta al deporte en 10–14 días con tratamiento conservador. Los grados II y III no tienen plazo en la fuente: se decide por criterios (fuerza igual en las dos piernas y sin dolor al valgo).' },
          ] },
        { id: 'ligamento_g2', mide: 'sinEspecificar', nombre: 'Esguince grado II', desde: 2, hasta: 4, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'tobillo_lateral_g2', mide: 'deporte', nombre: 'Tobillo, ligamento lateral', desde: 2, hasta: 3, fuentes: ['Bergman 2025', 'Vuurberg 2018'],
              nota: '3–6 semanas (Bergman 2025). La guía de Vuurberg 2018 junta la rotura parcial y la total: vuelta completa al trabajo y al deporte a las 6–8 semanas, según la tarea.' },
          ] },
        { id: 'ligamento_g3', mide: 'sinEspecificar', nombre: 'Esguince grado III', desde: 3, hasta: 5, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'tobillo_lateral_g3', mide: 'deporte', nombre: 'Tobillo, ligamento lateral', desde: 3, hasta: 4, fuentes: ['Bergman 2025', 'Martin 2021'],
              nota: '6–12 semanas o más; a veces cirugía por inestabilidad persistente. Un 5–33 % sigue con dolor al año (Martin 2021).' },
            { id: 'tobillo_lateral_cirugia', mide: 'deporte', nombre: 'Tobillo, reparación quirúrgica', desde: 4, hasta: 5, fuentes: ['Vuurberg 2018', 'Bergman 2025'],
              nota: 'Vuelta al trabajo físico y al deporte a las 12–16 semanas (Vuurberg 2018); unos 3–4 meses según Bergman 2025. Manda el protocolo del cirujano.' },
            // Evans 2023, «Non-operative management»: «an acute symptomatic treatment followed
            // by 12 weeks of supervised physiotherapy» (baja demanda, sin pivotes, roturas
            // parciales). Es la duración del programa, no un plazo de cicatrización: el
            // ligamento roto no cicatriza. Fase aguda + 12 semanas ≈ «3–4 s» a «2–3 m» (2–4).
            { id: 'rodilla_lca_conservador', mide: 'programa', nombre: 'Rodilla, LCA sin cirugía', desde: 2, hasta: 4, fuentes: ['Evans 2023'],
              nota: 'No es un plazo de cicatrización: tras la fase aguda, 12 semanas de fisioterapia supervisada. Indicado en baja demanda, deportes sin giros ni saltos y roturas parciales.' },
          ] },
        { id: 'injerto', mide: 'sinEspecificar', nombre: 'Injerto (reconstrucción)', desde: 4, hasta: 6, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            // Evans 2023, «Pearls and Other Issues»: «The average return to full activity
            // and/or sports participation is estimated to be between 6 to 12 months after
            // surgical reconstruction»; «the graft takes up to 18 months or more to become
            // fully functional and incorporated». Logerstedt 2017 (guía JOSPT) no da plazos:
            // al año, «no knee effusion, no knee instability, and … over 93% on the IKDC
            // 2000» → «more than 14 times more likely to return to sports» (PLR = 14.54).
            // 6–12 meses = «6m–1a» (6); hasta 18 meses o más = «2a» (7).
            { id: 'rodilla_lca_reconstruido', mide: 'deporte', nombre: 'Rodilla, LCA reconstruido', desde: 6, hasta: 7, fuentes: ['Evans 2023', 'Logerstedt 2017'],
              nota: 'Vuelta a la actividad o al deporte a los 6–12 meses de media; el injerto puede tardar 18 meses o más en incorporarse del todo (Evans 2023). La guía JOSPT no fija plazos: al año, sin derrame, sin inestabilidad y con IKDC > 93 %, la vuelta al deporte es mucho más probable (Logerstedt 2017).' },
          ] },
      ],
    },
    {
      // Fase J, 3 (menisco, grupo propio; decisión del usuario, 2026-10): PDF del
      // usuario leídos (2026-10). Sin fila del wiki: cada fila es un tratamiento.
      // Prill 2025 (consenso EU-US, parte II): rotura TRAUMÁTICA, «A 12‐week supervised
      // neuromuscular exercise programme … similar outcomes to those that underwent
      // surgery» (grado B); DEGENERATIVA, «non‐operative treatment including physical
      // therapy should be the first approach» (grado A) y «3–6 months of non‐operative
      // treatment prior to surgical decision making»; vuelta al deporte «4–12 weeks for
      // partial meniscectomies, and 6–9 months for meniscal repair (GRADE C)»; tras la
      // sutura aislada, vuelta al juego en el 71,2–100 % «within a time frame of 3.3–10
      // months». Logerstedt 2018 (guía JOSPT), pronóstico: tras la meniscectomía, los
      // menores de 30 años y los de élite vuelven «less than 2 months», los mayores de
      // 30 «by 3 months» (Kim: 54 y 89 días; menisco medial 79 días, lateral 61); los
      // déficits de los primeros 6 meses «may resolve within 2 years»; tras la sutura,
      // «early progressive weight bearing» y «early progressive return to activity»
      // (grado C).
      // Semanas → columnas: 12 sem = «2–3 m» (4); 3–6 meses = «3–6 m» (5);
      // 4–12 sem = «3–4 s» a «2–3 m» (2–4); 6–9 meses = «6m–1a» (6).
      id: 'menisco', tejido: 'Menisco',
      filas: [
        { id: 'menisco_traumatica_conservador', mide: 'programa', nombre: 'Rotura traumática, sin cirugía', desde: 4, hasta: 4, gravedad: 'moderada', fuentes: ['Prill 2025'],
          nota: 'No es un plazo de cicatrización: 12 semanas de ejercicio neuromuscular supervisado, con resultados parecidos a la cirugía en rodilla estable (grado B). Las roturas de la raíz o radiales agudas pueden beneficiarse de cirugía precoz.' },
        { id: 'menisco_degenerativa_conservador', mide: 'programa', nombre: 'Lesión degenerativa, sin cirugía', desde: 5, hasta: 5, gravedad: 'moderada', fuentes: ['Prill 2025'],
          nota: 'La fisioterapia es el primer tratamiento (grado A): 3–6 meses antes de plantear la cirugía si persisten los síntomas.' },
        { id: 'menisco_meniscectomia', mide: 'deporte', nombre: 'Meniscectomía parcial', desde: 2, hasta: 4, gravedad: 'moderada', fuentes: ['Prill 2025', 'Logerstedt 2018'],
          nota: 'Vuelta al deporte a las 4–12 semanas (Prill 2025, grado C): antes de 2 meses en menores de 30 años o deportistas de élite, hacia los 3 meses en mayores de 30 (Logerstedt 2018). Los déficits de fuerza y función pueden tardar hasta 2 años en resolverse.' },
        { id: 'menisco_sutura', mide: 'deporte', nombre: 'Sutura (reparación)', desde: 6, hasta: 6, gravedad: 'grave', fuentes: ['Prill 2025', 'Logerstedt 2018'],
          nota: 'Vuelta al deporte a los 6–9 meses (Prill 2025, grado C; en los estudios, de 3,3 a 10 meses). Carga y vuelta a la actividad progresivas y precoces (Logerstedt 2018, grado C). Manda el protocolo del cirujano.' },
      ],
    },
    {
      id: 'hueso', tejido: 'Hueso',
      filas: [
        // Fase J, 4 (fracturas por localización): capítulos de StatPearls, PDF del usuario
        // releídos enteros (2026-10). Dan sobre todo plazos de inmovilización, descarga o
        // vuelta a la función, no de consolidación completa: lo dice cada nota.
        //   Hermena y Slane 2025, «Prognosis»: estables sin cirugía, «return to their
        //   baseline level of function within approximately 6 to 8 weeks»; con ORIF, «full
        //   weight-bearing around 6 to 8 weeks postsurgery… full recovery may take longer».
        //   Smidt y Massey 2023: zona 1, carga según tolerancia «over 3 to 6 weeks»; Jones,
        //   «6 to 8 weeks of non-weight bearing»; «most acute, nondisplaced fractures… heal…
        //   by 6 to 8 weeks»; zona 3, «up to 20 weeks».
        //   Agrawal y Tiwari 2023: no desplazadas, «short leg walking cast for 4 to 6 weeks».
        //   Seaman y Bergman 2026: extraarticulares, «10 to 12 weeks of immobilization»;
        //   intraarticulares desplazadas, «recovery extending 12 to 18 months» (descarga de
        //   8–12 semanas tras la cirugía, 6–8 sin ella).
        //   Gheewala 2023: estrés, «immobilization, and protected weight bearing for a period
        //   of six to eight weeks»; la traumática, sin plazo.
        //   Mabrouk y Pilson 2026: sin cirugía, inmovilización «approximately 6 to 8 weeks»;
        //   resistencia «until approximately 6 weeks… when early fracture healing is
        //   expected»; tras la cirugía, sin plazo (no se pinta).
        //   Malik y Herron 2023: sin cirugía, «radiographic healing… may take up to 12
        //   weeks», «may not regain full function until 16 to 20 weeks or longer»; tras la
        //   cirugía, 6 semanas sin carga y 6 de carga parcial.
        //   Pencle y Varacallo 2023 (húmero proximal): sin plazo de consolidación; no se pinta.
        // Semanas → columnas: 3–6 s = 2–3; 4–6 s = 2–3; 6–8 s = 3; 10–12 s = 4;
        // 12 s → 16–20 s = 4–5; hasta 20 s = 4–5; 12–18 meses = 7.
        { id: 'fractura', mide: 'sinEspecificar', nombre: 'Fractura', desde: 2, hasta: 5, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'fx_tobillo_estable', mide: 'deporte', nombre: 'Tobillo, estable sin cirugía', desde: 3, hasta: 3, fuentes: ['Hermena y Slane 2025'],
              nota: 'Vuelta a la función previa hacia las 6–8 semanas, con carga progresiva según tolerancia.' },
            { id: 'fx_tobillo_cirugia', mide: 'proteccion', nombre: 'Tobillo, operada (osteosíntesis)', desde: 3, hasta: 3, fuentes: ['Hermena y Slane 2025'],
              nota: 'Carga completa hacia las 6–8 semanas de la cirugía; la recuperación completa tarda más (sin plazo en la fuente). Manda el protocolo del cirujano.' },
            { id: 'fx_quinto_avulsion', mide: 'proteccion', nombre: '5.º metatarsiano, avulsión de la base (zona 1)', desde: 2, hasta: 3, fuentes: ['Smidt y Massey 2023'],
              nota: 'Carga protegida (zapato rígido, bota o yeso de marcha), y carga según tolerancia a medida que cede el dolor, en 3–6 semanas.' },
            { id: 'fx_quinto_jones', mide: 'proteccion', nombre: '5.º metatarsiano, Jones (zona 2) sin cirugía', desde: 3, hasta: 3, fuentes: ['Smidt y Massey 2023'],
              nota: '6–8 semanas sin carga con yeso corto; la carga avanza según la consolidación en la radiografía. Mala vascularización: riesgo de retraso de consolidación.' },
            { id: 'fx_quinto_estres', mide: 'proteccion', nombre: '5.º metatarsiano, diáfisis por estrés (zona 3)', desde: 4, hasta: 5, fuentes: ['Smidt y Massey 2023'],
              nota: 'Consolidación lenta: hasta 20 semanas de inmovilización antes de verla en la radiografía, y aun así la seudoartrosis no es rara.' },
            { id: 'fx_metatarsianos', mide: 'proteccion', nombre: 'Otros metatarsianos, no desplazadas', desde: 2, hasta: 3, fuentes: ['Agrawal y Tiwari 2023'],
              nota: '4–6 semanas de bota o yeso de marcha (o 3 sin carga y 3 con yeso de marcha). Las de base y las centrales consolidan bien.' },
            { id: 'fx_calcaneo_extra', mide: 'proteccion', nombre: 'Calcáneo, extraarticular', desde: 4, hasta: 4, fuentes: ['Seaman y Bergman 2026'],
              nota: '10–12 semanas de inmovilización con yeso o férula; buen pronóstico.' },
            { id: 'fx_calcaneo_intra', mide: 'deporte', nombre: 'Calcáneo, intraarticular desplazada', desde: 7, hasta: 7, gravedad: 'grave', fuentes: ['Seaman y Bergman 2026'],
              nota: 'Recuperación de 12–18 meses, con o sin cirugía; la mejoría se estanca hacia los 18 meses y a los 2 años la mayoría tiene secuelas. Descarga de 8–12 semanas tras la cirugía.' },
            { id: 'fx_navicular_estres', mide: 'proteccion', nombre: 'Navicular, por estrés', desde: 3, hasta: 3, fuentes: ['Gheewala 2023'],
              nota: '6–8 semanas de inmovilización y carga protegida. Riesgo de seudoartrosis y necrosis por su vascularización. La fractura traumática no tiene plazo en la fuente.' },
            { id: 'fx_rotula_conservador', mide: 'proteccion', nombre: 'Rótula, sin cirugía', desde: 3, hasta: 3, fuentes: ['Mabrouk y Pilson 2026'],
              nota: '6–8 semanas inmovilizada en extensión, con carga según tolerancia; movilidad activa desde la 1.ª–2.ª semana y fuerza contra resistencia hacia la 6.ª, cuando se espera la consolidación inicial. Tras la cirugía, sin plazo en la fuente.' },
            { id: 'fx_meseta_conservador', mide: 'deporte', nombre: 'Meseta tibial, sin cirugía', desde: 4, hasta: 5, fuentes: ['Malik y Herron 2023'],
              nota: '6–8 semanas sin carga y 6 más de carga parcial; consolidación radiográfica hasta las 12 semanas y función completa a las 16–20 semanas o más.' },
            { id: 'fx_meseta_cirugia', mide: 'proteccion', nombre: 'Meseta tibial, operada', desde: 4, hasta: 4, gravedad: 'grave', fuentes: ['Malik y Herron 2023'],
              nota: '6 semanas sin carga y 6 de carga parcial; después, carga según tolerancia. La vuelta al deporte puede tardar meses. Manda el protocolo del cirujano.' },
          ] },
        // Fase J, 5 (fractura de estrés): PDF del usuario leídos enteros (2026-10).
        // Hoenig 2023 (revisión sistemática y metaanálisis, 76 estudios): tiempo medio de
        // vuelta al deporte por localización (tablas 1A y 1B del suplemento): tibia
        // posteromedial 44 días (IC 27–61), peroné 56 (13–100), pubis 77 (41–112),
        // metatarsianos 1.º–4.º 78 (56–100), 5.º metatarsiano 82 (68–96), diáfisis femoral 86
        // (54–117), maléolo medial 106 (79–132), cuello femoral 107 (79–135), navicular 127
        // (103–151); vuelta al deporte del 55 % en el cuello femoral y del 75,5 % en la tibia
        // anterior (sin tiempo agrupado). Robertson y Wood 2017: tibia anterior incompleta,
        // «7 mo for conservative management and 7 mo for surgical management»; alto riesgo:
        // tibia anterior, base del 5.º metatarsiano, maléolo medial, cuello femoral lateral,
        // navicular y sesamoideos. May y Marappa-Ganeshan 2023: «relative rest/non-weight
        // bearing for a period of 2 to 6 weeks, and then gradual reintroduction of activity».
        // Días → columnas: 44 y 56 = «5–8 s» (3); 77–86 = «2–3 m» (4); 106–127 = «3–6 m» (5);
        // 7 meses = «6m–1a» (6).
        { id: 'fractura_estres', mide: 'deporte', nombre: 'Fractura de estrés', desde: 3, hasta: 6, gravedad: 'moderada', fuentes: ['Hoenig 2023', 'Robertson y Wood 2017', 'May y Marappa-Ganeshan 2023'],
          nota: 'Vuelta al deporte de media: de 6 semanas a 4 meses según la localización, y unos 7 meses en la tibia anterior. En las de bajo riesgo, 2–6 semanas de reposo relativo o descarga y vuelta gradual; las de alto riesgo, a traumatología.',
          subtipos: [
            { id: 'estres_tibia_posteromedial', mide: 'deporte', nombre: 'Tibia posteromedial (bajo riesgo)', desde: 3, hasta: 3, fuentes: ['Hoenig 2023'],
              nota: 'Vuelta al deporte a los 44 días de media; la más rápida y con menos complicaciones (2 %).' },
            { id: 'estres_perone', mide: 'deporte', nombre: 'Peroné (bajo riesgo)', desde: 3, hasta: 3, fuentes: ['Hoenig 2023'],
              nota: 'Vuelta al deporte a los 56 días de media (con mucha variación entre estudios).' },
            { id: 'estres_pubis', mide: 'deporte', nombre: 'Pubis (bajo riesgo)', desde: 4, hasta: 4, fuentes: ['Hoenig 2023'],
              nota: 'Vuelta al deporte a los 77 días de media.' },
            { id: 'estres_metatarsianos', mide: 'deporte', nombre: 'Metatarsianos 1.º–4.º (bajo riesgo)', desde: 4, hasta: 4, fuentes: ['Hoenig 2023'],
              nota: 'Vuelta al deporte a los 78 días de media; el 96 % vuelve.' },
            { id: 'estres_femur_diafisis', mide: 'deporte', nombre: 'Diáfisis femoral (bajo riesgo)', desde: 4, hasta: 4, fuentes: ['Hoenig 2023'],
              nota: 'Vuelta al deporte a los 86 días de media.' },
            { id: 'estres_quinto', mide: 'deporte', nombre: '5.º metatarsiano (alto riesgo)', desde: 4, hasta: 4, gravedad: 'grave', fuentes: ['Hoenig 2023', 'Robertson y Wood 2017'],
              nota: 'Vuelta al deporte a los 82 días de media; complicaciones en el 16,5 %. Alto riesgo por retraso de consolidación y seudoartrosis.' },
            { id: 'estres_maleolo_medial', mide: 'deporte', nombre: 'Maléolo medial (alto riesgo)', desde: 5, hasta: 5, gravedad: 'grave', fuentes: ['Hoenig 2023', 'Robertson y Wood 2017'],
              nota: 'Vuelta al deporte a los 106 días de media.' },
            { id: 'estres_cuello_femoral', mide: 'deporte', nombre: 'Cuello femoral (alto riesgo)', desde: 5, hasta: 5, gravedad: 'grave', fuentes: ['Hoenig 2023', 'Robertson y Wood 2017'],
              nota: 'Vuelta al deporte a los 107 días de media, pero solo vuelve el 55 %; complicaciones en el 43 %. Desplazada, riesgo de necrosis de la cabeza femoral: a traumatología sin demora.' },
            { id: 'estres_navicular', mide: 'deporte', nombre: 'Navicular (alto riesgo)', desde: 5, hasta: 5, gravedad: 'grave', fuentes: ['Hoenig 2023', 'Robertson y Wood 2017'],
              nota: 'Vuelta al deporte a los 127 días de media, la más lenta; vuelve el 83 %. (Inmovilización, 6–8 semanas: ver «Fractura».)' },
            { id: 'estres_tibia_anterior', mide: 'deporte', nombre: 'Tibia anterior (alto riesgo)', desde: 6, hasta: 6, gravedad: 'grave', fuentes: ['Robertson y Wood 2017', 'Hoenig 2023'],
              nota: 'Vuelta al deporte a los 7 meses, con o sin cirugía (Robertson y Wood 2017); vuelve el 75,5 % y hay complicaciones en el 41 % (Hoenig 2023).' },
          ] },
      ],
    },
    // Nervio periférico (Fase J, 9), PDF del usuario leídos enteros (2026-10).
    // Neuropraxia: Sharma y Munakomi 2026, «recovery within 2 to 3 months», «within
    // approximately 3 months», en deportistas «approximately half … less than 1 week of
    // lost participation time»; Nadi 2026, «complete spontaneous recovery within days to
    // weeks»; Robinson 2022, «should resolve within 3 months of injury». Axonotmesis
    // sin barra (decisión del usuario, 2026-10): depende de la distancia. Robinson 2022:
    // cruza la lesión en 8–15 días y luego «about 1 mm/day» («roughly 1 inch/month»),
    // más rápido en aplastamientos, jóvenes y segmentos proximales; el músculo admite
    // reinervación 18–24 meses; la recuperación motora se estanca a los 18–24 meses.
    // Nadi 2026: «1 mm (range 0.5–3 mm) per day»; sin reinervación a los 3–4 meses,
    // sospechar neurotmesis y explorar. Hall 2026: 1–3 mm/día (y 1–2 en el pronóstico),
    // placa motora viable hasta 1 año, «rule of 3s» (cerrada sin recuperación: cirugía a
    // los 3 meses). Menorca 2013: 2–3 mm/día en segmentos proximales y 1–2 en distales.
    {
      id: 'nervio', tejido: 'Nervio periférico',
      nota: 'Axonotmesis (Sunderland II–IV), sin barra: el plazo depende de la distancia que tiene que crecer el nervio. El axón cruza la lesión en 1–2 semanas y luego avanza unos 1 mm al día (unos 3 cm al mes; de 0,5 a 3 mm según la fuente, más rápido en segmentos proximales, en jóvenes y tras un aplastamiento). Días hasta la reinervación ≈ milímetros desde la lesión hasta el primer músculo. El músculo admite reinervación durante 1–2 años y la recuperación motora se estanca a los 18–24 meses. Sin signos de recuperación (Tinel que no avanza, fuerza que no mejora) a los 3 meses: derivar para valorar cirugía. Neurotmesis (Sunderland V): no se recupera sin cirugía.',
      notaFuentes: ['Robinson 2022', 'Nadi 2026', 'Hall 2026', 'Menorca 2013'],
      filas: [
        { id: 'nervio_neurapraxia', mide: 'deporte', nombre: 'Neuropraxia (Sunderland I)', desde: 0, hasta: 4, gravedad: 'leve', fuentes: ['Sharma y Munakomi 2026', 'Nadi 2026', 'Robinson 2022'],
          nota: 'Recuperación espontánea al remielinizarse: de días a semanas (la mitad de las de deporte, menos de 1 semana fuera) y casi siempre antes de los 3 meses. Si a los 3 meses no se ha recuperado, reevaluar y derivar.' },
      ],
    },
  ],

  // Franja general de reparación (orientativa; las fases se solapan: «the
  // proliferative or granulation phase does not occur at a discrete time»).
  // Wallace 2023 describe la cicatrización de heridas de la piel: es un modelo
  // general, no los tiempos de tendón, ligamento o hueso (lo dice `fasesNota`).
  // Inflamatoria: «usually lasts several days»; el colágeno nuevo aparece
  // «by days 5 through 7». Proliferativa: «can last several weeks».
  // Remodelación: «starts around week 3 and can last up to 12 months».
  fases: [
    { id: 'inflamatoria', nombre: 'Inflamatoria', desdeDia: 0, hastaDia: 5, fuentes: ['Wallace 2023'] },
    { id: 'proliferativa', nombre: 'Proliferativa', desdeDia: 5, hastaDia: 21, fuentes: ['Wallace 2023'] },
    { id: 'remodelacion', nombre: 'Remodelación', desdeDia: 21, hastaDia: 365, fuentes: ['Wallace 2023'] },
    // Más allá del año, solo el tendón: Wu 2017, la remodelación «takes around one
    // to two years». Sin ella la tira del eje se cortaba al año, donde la barra
    // de la rotura de tendón sigue (petición del usuario, 2026-10).
    { id: 'remodelacion_tendon', nombre: 'Remodelación (tendón)', desdeDia: 365, hastaDia: 730, fuentes: ['Wu 2017'], tejido: 'tendón' },
  ],
  fasesNota: 'Modelo general de la cicatrización de heridas cutáneas: en tendón, ligamento y hueso los tiempos varían (ver las barras). En una incisión, la resistencia máxima llega hacia las 11–14 semanas y la cicatriz se queda en torno al 80 % de la resistencia original.',

  notas: [
    'Rangos orientativos: dependen de la edad, de las enfermedades y fármacos del paciente (diabetes, tabaco, corticoides…) y de la carga que se aplique.',
    'El dolor y la función no siguen por fuerza el calendario del tejido: el paciente puede estar listo antes o seguir con síntomas después.',
    'Paciente posquirúrgico: manda el protocolo del cirujano.',
  ],

  fuente: 'Filas: adaptado de Snyder-Mackler et al., «Developing Treatment Pathways», 2012 (tabla de physiq-wiki).',
  fasesFuente: 'Fases de reparación: Wallace, Basehore y Zito, «Wound Healing Phases», StatPearls (act. 2023). Rotura de tendón: Wu, Nerlich y Docheva, «Tendon injuries: basic science and new repair proposals», EFORT Open Rev 2017.',
};
