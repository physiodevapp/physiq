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
// Las cifras genéricas de esa tabla (tendinopatía, DOMS, roturas musculares y
// esguinces de grado I–III, injerto, fractura) ya no se pintan (decisión del
// usuario, 2026-10): la fuente no se pudo leer y no hay un plazo general fiable.
// Las madres quedan sin barra y sus subtipos llevan cada uno su fuente; el DOMS
// sale de Wilke y Behringer 2021.
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
//               Sin `desde`, `hasta` ni `mide`: fila sin barra, solo madre de sus subtipos;
//               `fuentes: []`, `gravedad` (la heredan los subtipos) y una `nota` que empieza
//               por «Sin barra general: » y dice por qué
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
    biologia: { etiqueta: 'Biología de la reparación', relleno: 'punteado' },
    // Lo que dura la enfermedad hasta resolverse, sin una lesión que cicatrice (capsulitis
    // adhesiva; más adelante, lumbalgia): degradado hacia la derecha, se va apagando.
    evolucion: { etiqueta: 'Evolución natural (hasta que se resuelve)', relleno: 'degradado' },
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
          // Sin barra (decisión del usuario, 2026-10): el plazo genérico venía de la tabla del wiki
          // (Snyder-Mackler 2012), que nunca se pudo leer. Los subtipos llevan cada uno su fuente.
          id: 'tendinopatia', nombre: 'Tendinopatía', gravedad: 'moderada', fuentes: [],
          nota: 'Sin barra general: no hay un plazo de cicatrización, sino la duración del programa de carga, que depende del tendón. Ver los subtipos.',
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
      nota: 'Sin barra general por grados I–III: el plazo depende del músculo, de la zona de la lesión y del deporte. Ver las filas de cada músculo.',
      filas: [
        // DOMS: Wilke y Behringer 2021 (PMC8431437, leído entero, 2026-10), introducción: los
        // síntomas aparecen «hours following activity, reaching maximal levels after one to
        // three days»; apartado 3.3: «DOMS complaints can persist for several days». Máximo en
        // «1–3 d» (0) y se apaga en «4–14 d» (1): evolución natural, sin lesión que cicatrice.
        { id: 'doms', mide: 'evolucion', nombre: 'Dolor muscular tardío (DOMS)', desde: 0, hasta: 1, gravedad: 'minima', fuentes: ['Wilke y Behringer 2021'],
          nota: 'Aparece horas después de un ejercicio intenso o no habitual (sobre todo excéntrico), es máximo a los 1–3 días y puede durar varios días más.' },
        // Las roturas genéricas de grado I–III (tabla del wiki, Snyder-Mackler 2012, nunca leída)
        // se quitan (decisión del usuario, 2026-10): sin fuente leída y sin subtipos que colgar.
        // Lo que dice el grupo sobre ellas va en su `nota`.
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
        // Ampliación (2026-10), PDF del usuario leídos. Gemelo y sóleo: Prakash 2018 (100
        // deportistas, gradación por la lesión del tejido conectivo en la RM, tabla 2): grado 0
        // (edema sin rotura de fibras) 8 días de media, 1 (rotura de fibras sin lesión del tejido
        // conectivo) 17, 2 (con lesión del tendón, aponeurosis o epimisio, sin retracción) 25,
        // 3 (con retracción) 48. Pedret 2015 (sóleo, 61 deportistas de élite): 29 días de media;
        // aponeurosis central 44, lateral 19. Green 2020 (149 lesiones, fútbol australiano): 19
        // días sin lesión de la aponeurosis y 31 con lesión grave. Pedret 2026 (revisión): la
        // vuelta se decide por criterios, no por plazos fijos. Recto femoral: Knapik 2023
        // (revisión sistemática, 132 deportistas, rotura completa o avulsión proximal): 11,7
        // semanas sin cirugía (5,5–15,2) y 22,1 con cirugía (14–37,6). Aductores: Forsythe 2025
        // (1706 lesiones, liga de fútbol de EE. UU.): 14,4 días de media (2010–2015) y 19,7
        // (2016–2021); la osteítis de pubis suma unos 37 días. Días → columnas: 8 = «4–14d» (1);
        // 17–28 = «3–4s» (2); 31–56 = «5–8s» (3); 82 = «2–3m» (4); 155 = «3–6m» (5).
        { id: 'gemelo_soleo', mide: 'deporte', nombre: 'Gemelo y sóleo (por la lesión del tejido conectivo)', desde: 1, hasta: 3, gravedad: 'moderada', fuentes: ['Prakash 2018', 'Pedret 2015', 'Green 2020', 'Pedret 2026'],
          nota: 'Vuelta al deporte en deportistas, según lo que muestre la RM. En el sóleo, 29 días de media, más en la aponeurosis central (44) que en la lateral (19). La vuelta se decide por criterios clínicos y funcionales, no por el plazo.',
          subtipos: [
            { id: 'gemelo_g0', mide: 'deporte', nombre: 'Grado 0 (edema, sin rotura de fibras)', desde: 1, hasta: 1, fuentes: ['Prakash 2018'],
              nota: 'Vuelta al deporte a los 8 días de media.' },
            { id: 'gemelo_g1', mide: 'deporte', nombre: 'Grado 1 (rotura de fibras, tejido conectivo intacto)', desde: 2, hasta: 2, fuentes: ['Prakash 2018'],
              nota: 'Vuelta al deporte a los 17 días de media.' },
            { id: 'gemelo_g2', mide: 'deporte', nombre: 'Grado 2 (lesión del tendón o la aponeurosis, sin retracción)', desde: 2, hasta: 2, fuentes: ['Prakash 2018', 'Green 2020'],
              nota: 'Vuelta al deporte a los 25 días de media.' },
            { id: 'gemelo_g3', mide: 'deporte', nombre: 'Grado 3 (con retracción)', desde: 3, hasta: 3, fuentes: ['Prakash 2018', 'Green 2020'],
              nota: 'Vuelta al deporte a los 48 días de media; con lesión grave de la aponeurosis, 31 días en otra serie.' },
          ] },
        { id: 'recto_femoral_proximal', mide: 'deporte', nombre: 'Recto femoral, rotura completa o avulsión proximal', desde: 4, hasta: 5, gravedad: 'grave', fuentes: ['Knapik 2023'],
          nota: 'En deportistas, casi siempre por chutar o esprintar; se operó al 80 %. Vuelve el 93 % sin cirugía y el 100 % con cirugía.',
          subtipos: [
            { id: 'recto_femoral_conservador', mide: 'deporte', nombre: 'Sin cirugía', desde: 4, hasta: 4, fuentes: ['Knapik 2023'],
              nota: 'Vuelta al deporte a las 11,7 semanas de media (de 5,5 a 15).' },
            { id: 'recto_femoral_cirugia', mide: 'deporte', nombre: 'Operado', desde: 5, hasta: 5, fuentes: ['Knapik 2023'],
              nota: 'Vuelta al deporte a las 22 semanas de media (de 14 a 38). Manda el protocolo del cirujano.' },
          ] },
        { id: 'aductores', mide: 'deporte', nombre: 'Aductores (lesión aguda, futbolistas)', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Forsythe 2025'],
          nota: 'Vuelta al juego a los 14–20 días de media en futbolistas profesionales; la osteítis de pubis suma unas 5 semanas. Recaen 1 de cada 5.' },
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
        { id: 'ligamento_g1', nombre: 'Esguince grado I', gravedad: 'leve', fuentes: [],
          nota: 'Sin barra general: el plazo depende de la articulación. Ver los subtipos.',
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
        { id: 'ligamento_g2', nombre: 'Esguince grado II', gravedad: 'moderada', fuentes: [],
          nota: 'Sin barra general: el plazo depende de la articulación. Ver los subtipos.',
          subtipos: [
            { id: 'tobillo_lateral_g2', mide: 'deporte', nombre: 'Tobillo, ligamento lateral', desde: 2, hasta: 3, fuentes: ['Bergman 2025', 'Vuurberg 2018'],
              nota: '3–6 semanas (Bergman 2025). La guía de Vuurberg 2018 junta la rotura parcial y la total: vuelta completa al trabajo y al deporte a las 6–8 semanas, según la tarea.' },
          ] },
        { id: 'ligamento_g3', nombre: 'Esguince grado III', gravedad: 'grave', fuentes: [],
          nota: 'Sin barra general: el plazo depende de la articulación. Ver los subtipos.',
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
        { id: 'injerto', nombre: 'Injerto (reconstrucción)', gravedad: 'grave', fuentes: [],
          nota: 'Sin barra general: el plazo depende del ligamento reconstruido y del protocolo del cirujano. Ver los subtipos.',
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
        // Sindesmosis (bloque 6 de la ampliación, 2026-10), PDF del usuario leídos enteros.
        // Salameh 2022 (metaanálisis, 18 estudios, 1133 esguinces en deportistas): vuelta al
        // deporte del 99 %, a los 52 días de media; 39,3 días sin cirugía y 70,9 con cirugía
        // (más grado en los operados). Li y Sun 2026 (metaanálisis, 14 estudios, 901
        // deportistas de élite): vuelta del 96 %, ~58 días; igual con sutura dinámica que sin
        // cirugía (98 %). 39 días = «5–8s» (3); 71 días = «2–3m» (4).
        { id: 'sindesmosis', mide: 'deporte', nombre: 'Esguince de la sindesmosis (alto de tobillo)', desde: 3, hasta: 4, gravedad: 'moderada', fuentes: ['Salameh 2022', 'Li y Sun 2026'],
          nota: 'Vuelta al deporte en casi todos (96–99 %), a los 52–58 días de media en deportistas; mucho más lento que el esguince lateral.',
          subtipos: [
            { id: 'sindesmosis_conservador', mide: 'deporte', nombre: 'Sin cirugía', desde: 3, hasta: 3, fuentes: ['Salameh 2022'],
              nota: 'Vuelta al deporte a los 39 días de media.' },
            { id: 'sindesmosis_cirugia', mide: 'deporte', nombre: 'Operada (tornillo o sutura dinámica)', desde: 4, hasta: 4, fuentes: ['Salameh 2022', 'Li y Sun 2026'],
              nota: 'Vuelta al deporte a los 71 días de media, en lesiones de más grado; con sutura dinámica, la misma tasa de vuelta (98 %) que sin cirugía. Manda el protocolo del cirujano.' },
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
    // Articulación (ampliación, 2026-10): lo que afecta a la cápsula y a la articulación
    // entera, no a un ligamento aislado. PDF del usuario leídos enteros. Pak y Kim 2023 (luxación
    // anterior glenohumeral): «The described duration of immobilization also varies from one
    // to six weeks», sin ventaja de la rotación externa; recidiva «up to 92%» en menores de 25
    // con deporte de contacto; tras la cirugía, inmovilización también de 1 a 6 semanas.
    // Abdel Khalik 2025 (metaanálisis, primera luxación): vuelta al nivel previo del 79,2 %
    // con reparación artroscópica de Bankart frente al 48,5 % sin cirugía; cita a Buss 2004:
    // en temporada, el 90 % vuelve a los 10 días de media, con recidiva del 37 %. Li 2025
    // (capsulitis): fase dolorosa 2–9 meses, rígida 4–12, luego descongelación (sin plazo);
    // «from a few months to 2 to 3 years»; ~80 % recupera una función casi normal, 10–20 %
    // con secuelas; más larga con diabetes o tiroidopatía.
    // Prótesis (bloque 1 de la ampliación, 2026-10; los dos artículos de Pasqualini 2023 no
    // estaban disponibles). Magan 2021 (metaanálisis, 9 estudios, 1307 pacientes, prótesis
    // de rodilla): vuelta al deporte del 18,7 % a los 3 meses, 70 % a los 6, 84 % a los 12 y
    // 87,9 % al final del seguimiento (media de 14 meses); casi todos a deportes de bajo
    // impacto. Jette 2020 (guía APTA de la prótesis de rodilla): fisioterapia «within 24
    // hours of surgery» y fuerza de alta intensidad «within 7 days after surgery»; no da
    // plazos de recuperación. Telang 2024 (revisión sistemática, 28 estudios, prótesis de
    // cadera): «most patients resumed sporting activities within the first 6 months», la
    // mitad en los 3 primeros (51–67 %); de los cirujanos británicos, un 33 % permite el
    // deporte a las 6–12 semanas y un 44 % a los 3 meses; más actividad no empeoró la
    // supervivencia de la prótesis.
    {
      id: 'articulacion', tejido: 'Articulación',
      filas: [
        { id: 'hombro_luxacion_anterior', mide: 'proteccion', nombre: 'Luxación anterior de hombro', desde: 1, hasta: 3, gravedad: 'moderada', fuentes: ['Pak y Kim 2023', 'Abdel Khalik 2025'],
          nota: 'Cabestrillo de 1 a 6 semanas, sin pruebas de qué plazo o posición es mejor; lo mismo tras la estabilización quirúrgica. Recidiva muy alta en jóvenes (hasta el 92 % en menores de 25 con deporte de contacto). Tras una primera luxación, vuelve a su nivel el 79 % con reparación artroscópica y el 49 % sin cirugía; en plena temporada, la mayoría vuelve en unos 10 días, con más recidivas.' },
        { id: 'capsulitis_adhesiva', mide: 'evolucion', nombre: 'Capsulitis adhesiva (hombro congelado)', desde: 4, hasta: 7, gravedad: 'moderada', fuentes: ['Li 2025'],
          nota: 'De unos meses a 2–3 años: fase dolorosa (2–9 meses), rígida (4–12 meses) y de descongelación. Cerca del 80 % recupera una función normal o casi normal; un 10–20 % queda con rigidez o dolor. Más larga con diabetes o tiroidopatía.' },
        // Waymack y An 2023 (StatPearls, luxación posterior de codo): tras la reducción, «held
        // in 90 degrees of flexion for 5 to 10 days followed by an active range of motion»;
        // las inestables, «up to 3 weeks of splinting»; mejor resultado con movilidad precoz.
        { id: 'codo_luxacion_posterior', mide: 'proteccion', nombre: 'Luxación posterior de codo (simple)', desde: 1, hasta: 2, gravedad: 'moderada', fuentes: ['Waymack y An 2023'],
          nota: 'Férula a 90° de 5 a 10 días y luego movilidad activa; las inestables, hasta 3 semanas. La movilidad precoz da mejor resultado. Con fractura de cabeza de radio y coronoides (tríada terrible), a traumatología.' },
        { id: 'protesis_rodilla', mide: 'deporte', nombre: 'Prótesis total de rodilla', desde: 5, hasta: 6, gravedad: 'moderada', fuentes: ['Magan 2021', 'Jette 2020'],
          nota: 'Fisioterapia desde las primeras 24 horas y fuerza de alta intensidad desde la 1.ª semana (guía APTA). Vuelve al deporte el 19 % a los 3 meses, el 70 % a los 6 y el 84 % al año, casi siempre a deportes de bajo impacto. Manda el protocolo del cirujano.' },
        { id: 'protesis_cadera', mide: 'deporte', nombre: 'Prótesis total de cadera', desde: 4, hasta: 5, gravedad: 'moderada', fuentes: ['Telang 2024', 'Pan 2024'],
          nota: 'La mayoría vuelve a su deporte en los primeros 6 meses y la mitad en los 3 primeros, sobre todo a deportes de bajo impacto. Los cirujanos lo permiten a las 6–12 semanas o a los 3 meses, y no hay pruebas de que más actividad acorte la vida de la prótesis. Vuelta al trabajo, con pocos datos (vía anterior): 30–60 % a los 3 meses y 87 % al año. Manda el protocolo del cirujano.' },
      ],
    },
    // Columna (bloque 8 de la ampliación, 2026-10): no son plazos de cicatrización, sino lo que
    // tarda en resolverse el cuadro, así que todas las filas son `evolucion`. PDF del usuario
    // leídos enteros. Alexander 2024 (StatPearls, radiculopatía lumbosacra, archivado): de la
    // lumbalgia, «Roughly half of cases resolve within 1 to 2 weeks, with 90% resolving within
    // 6 to 12 weeks»; tras discectomía, 73 % sin dolor de pierna al año. Margetis y Singh 2025
    // (StatPearls, lumbalgia): aguda < 6 semanas, crónica > 12; «Most acute cases resolve
    // within several weeks». Davis 2024 (StatPearls, ciática): «Most cases of sciatica resolve
    // in less than 4 to 6 weeks», más lenta con déficit neurológico. Konstantinou 2018
    // (cohorte ATLAS, atención primaria, 609 pacientes): mejora de la discapacidad del 55 % al
    // año. Margetis y Magnus 2025 (StatPearls, radiculopatía cervical): «Over 85% of acute
    // cervical radiculopathy resolves without any specific treatments within 8 to 12 weeks».
    // Wong 2014 (revisión sistemática): mejoría importante en los primeros 4–6 meses y
    // recuperación completa a los 24–36 meses en ~83 %; recurrencias en el 22 % de una serie.
    {
      id: 'columna', tejido: 'Columna',
      filas: [
        { id: 'lumbalgia_aguda', mide: 'evolucion', nombre: 'Lumbalgia aguda inespecífica', desde: 0, hasta: 4, gravedad: 'leve', fuentes: ['Alexander 2024', 'Margetis y Singh 2025'],
          nota: 'La mitad se resuelve en 1–2 semanas y el 90 % en 6–12. Pasa a crónica a partir de las 12 semanas; más probable con episodios previos, dolor intenso, depresión, miedo al movimiento o síntomas en la pierna.' },
        { id: 'radiculopatia_lumbar', mide: 'evolucion', nombre: 'Radiculopatía lumbar (ciática)', desde: 2, hasta: 6, gravedad: 'moderada', fuentes: ['Davis 2024', 'Konstantinou 2018', 'Alexander 2024'],
          nota: 'La mayoría se resuelve en 4–6 semanas, más despacio con déficit neurológico. En atención primaria, solo el 55 % ha mejorado su discapacidad al año. Tras discectomía, el 73 % no tiene dolor de pierna al año.' },
        { id: 'radiculopatia_cervical', mide: 'evolucion', nombre: 'Radiculopatía cervical', desde: 3, hasta: 7, gravedad: 'moderada', fuentes: ['Margetis y Magnus 2025', 'Wong 2014'],
          nota: 'Más del 85 % de las agudas se resuelve en 8–12 semanas. La mejoría importante llega en los primeros 4–6 meses y la recuperación completa, a los 2–3 años en el 83 %; puede recidivar con menos intensidad.' },
        // Columna operada (bloque 2 de la ampliación, 2026-10), PDF del usuario leídos. Son
        // vuelta al trabajo (`deporte` = vuelta a la función), no consolidación. Wang 2017
        // (revisión sistemática, 36 estudios): TLIF mínimamente invasiva 7 semanas frente a 11
        // abierta (Parker 2013); según la técnica y la serie, de 3,6 a 10,9 meses; mediana de
        // 96 días tras ALIF abierta (Gornet). Cui 2026 (síntesis de la mejor evidencia):
        // movilización el mismo día de la cirugía y fisioterapia «from the second postoperative
        // day». Bogaert 2022 (metaanálisis, 18 ensayos): ejercicio, y mejor con terapia
        // cognitivo-conductual, mejora la discapacidad hasta 6 meses (evidencia baja). Khan 2026
        // (metaanálisis): la prótesis de disco lumbar vuelve antes al trabajo que la artrodesis
        // solo en el análisis de sensibilidad (se cita en la fila de la prótesis).
        // Health Quality Ontario 2019 (evaluación de tecnología, cervical, un nivel): mediana de
        // vuelta al trabajo de 48 días con prótesis (Bryan) frente a 61 con artrodesis; con
        // todas las prótesis, 13–20 días antes que la artrodesis. 48 días = «5–8s» (3);
        // 61 = «2–3m» (4).
        { id: 'artrodesis_lumbar', mide: 'deporte', nombre: 'Artrodesis lumbar', desde: 3, hasta: 6, gravedad: 'grave', fuentes: ['Wang 2017', 'Cui 2026', 'Bogaert 2022'],
          nota: 'Movilización el mismo día y fisioterapia desde el 2.º. Vuelta al trabajo a las 7 semanas con cirugía mínimamente invasiva y a las 11 con abierta en un mismo estudio; según la técnica y la serie, de 3 a 11 meses. El ejercicio, mejor con terapia cognitivo-conductual, mejora la discapacidad hasta los 6 meses (evidencia baja). Manda el protocolo del cirujano.' },
        // Prótesis de disco lumbar: Gornet 2011 (ensayo, 577 pacientes): mediana de vuelta al
        // trabajo de 75 días frente a 96 con artrodesis anterior. Siepe 2007 (39 deportistas):
        // vuelta al deporte el 38,5 % en 3 meses y el 30,7 % de 3 a 6, mejor rendimiento a los
        // 5,2. Tumialán 2010 (militares): servicio sin restricciones a las 22,6 semanas (32,4 con
        // artrodesis); cervical, 10,3 semanas con prótesis y 16,5 con artrodesis. Patel 2026
        // (metaanálisis de 13 ensayos): resultados que convergen con la artrodesis a los 5 años.
        // 75 días = «2–3m» (4); 22,6 semanas = «3–6m» (5).
        { id: 'protesis_disco_lumbar', mide: 'deporte', nombre: 'Prótesis de disco lumbar', desde: 4, hasta: 5, gravedad: 'moderada', fuentes: ['Gornet 2011', 'Siepe 2007', 'Tumialán 2010', 'Patel 2026', 'Khan 2026'],
          nota: 'Vuelta al trabajo a los 75 días de mediana, 3 semanas antes que con artrodesis anterior. Vuelve al deporte cerca del 70 % en los 6 primeros meses; a un trabajo físico exigente, hacia las 23 semanas. A los 5 años, resultados parecidos a la artrodesis. Manda el protocolo del cirujano.' },
        { id: 'protesis_disco_cervical', mide: 'deporte', nombre: 'Prótesis de disco cervical', desde: 3, hasta: 4, gravedad: 'moderada', fuentes: ['Health Quality Ontario 2019', 'Tumialán 2010'],
          nota: 'Vuelta al trabajo hacia las 7 semanas (mediana de 48 días con un modelo), 2–3 semanas antes que con la artrodesis cervical anterior. A un trabajo físico exigente (militares), a las 10 semanas. Manda el protocolo del cirujano.' },
        { id: 'artrodesis_cervical', mide: 'deporte', nombre: 'Artrodesis cervical anterior', desde: 4, hasta: 5, gravedad: 'moderada', fuentes: ['Health Quality Ontario 2019', 'Tumialán 2010'],
          nota: 'Vuelta al trabajo hacia los 2 meses (mediana de 61 días en el mismo ensayo). A un trabajo físico exigente (militares), a las 16,5 semanas. A los 2 años, la misma tasa de empleo que con prótesis. Manda el protocolo del cirujano.' },
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
        { id: 'fractura', nombre: 'Fractura', gravedad: 'moderada', fuentes: [],
          nota: 'Sin barra general: el plazo depende del hueso, del tipo de fractura y del tratamiento. Ver los subtipos.',
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
            // Miembro superior (2026-10), PDF del usuario leídos enteros. Malik 2024 (5.º
            // metacarpiano): «clinical and radiographic healing… typically between 4 to 6
            // weeks», «gentle resistance exercises about 4 weeks postinjury», «most… heal
            // uneventfully within 8 weeks. However, a complete resolution may take many
            // months». Small 2022 (diáfisis de radio y cúbito): en el adulto casi
            // siempre se operan; movilidad a los 5–7 días y «bone union… around 2 to 3 months
            // post-surgery. Once the bone union has been confirmed, the patient can resume
            // most activities». Radio distal del adulto (el capítulo de StatPearls no da plazo):
            // Mehta 2024 (guía APTA, leída entera): sin cirugía, «short arm cast for 4 to 6
            // weeks»; tras reducción cerrada, «6 weeks of immobilization is typically
            // sufficient to achieve bony union»; la movilidad de muñeca empieza al quitar el
            // yeso y el fortalecimiento «around 6 to 8 weeks». Operada: protección «a few days
            // to several weeks»; movilidad activa y actividad ligera en las 3 primeras semanas
            // (A) y fortalecimiento submáximo desde la 2.ª (B). Sayudo 2024 (metaanálisis, 3
            // ensayos, 252 pacientes, 61 años de media): 3–4 semanas de yeso frente a 5–6, mejor
            // QuickDASH a las 12 semanas, 6 meses y 1 año, sin más complicaciones ni SDRC.
            { id: 'fx_quinto_metacarpiano', mide: 'proteccion', nombre: '5.º metacarpiano (del boxeador), sin cirugía', desde: 2, hasta: 3, fuentes: ['Malik 2024'],
              nota: 'Férula con movilidad precoz; consolidación clínica y radiográfica a las 4–6 semanas, con ejercicios suaves contra resistencia hacia la 4.ª. La mayoría consolida en 8 semanas, aunque la resolución completa puede tardar meses. Abiertas, rotadas o muy anguladas: a cirugía.' },
            { id: 'fx_antebrazo_cirugia', mide: 'proteccion', nombre: 'Diáfisis de radio y cúbito, operada', desde: 4, hasta: 4, fuentes: ['Small 2022'],
              nota: 'En el adulto casi siempre se operan. Movilidad de codo y antebrazo desde los 5–7 días; la mayoría de las actividades, cuando la radiografía confirma la consolidación, hacia los 2–3 meses. Manda el protocolo del cirujano.' },
            { id: 'fx_radio_distal_yeso', mide: 'proteccion', nombre: 'Radio distal, sin cirugía (yeso)', desde: 2, hasta: 3, fuentes: ['Mehta 2024', 'Sayudo 2024'],
              nota: 'Yeso antebraquial 4–6 semanas (6 si hubo que reducirla). Un metaanálisis de 3 ensayos encontró mejor función con 3–4 semanas que con 5–6, sin más complicaciones. Dedos, codo y hombro se mueven desde el principio; la muñeca, al quitar el yeso, y el fortalecimiento hacia las 6–8 semanas.' },
            { id: 'fx_radio_distal_cirugia', mide: 'proteccion', nombre: 'Radio distal, operada', desde: 1, hasta: 3, fuentes: ['Mehta 2024'],
              nota: 'Férula de unos días a varias semanas, según la estabilidad y el cirujano. La guía APTA recomienda movilidad activa de mano, muñeca y hombro y actividad ligera en las 3 primeras semanas (A) y fortalecimiento submáximo desde la 2.ª (B); el enfoque clásico espera 4–6 semanas para la muñeca y 6 para la fuerza. Manda el protocolo del cirujano.' },
            // Patiño y Saenz 2023 (StatPearls, cabeza de radio): sin cirugía (no desplazadas,
            // escalón < 2 mm, < 30 % de superficie, angulación < 30°), yeso o cabestrillo «for
            // two or three weeks», radiografía a la semana; 2–3 semanas = «4–14d» a «3–4s».
            { id: 'fx_cabeza_radio', mide: 'proteccion', nombre: 'Cabeza de radio, sin cirugía', desde: 1, hasta: 2, fuentes: ['Patiño y Saenz 2023'],
              nota: 'Yeso o cabestrillo 2–3 semanas, con flexoextensión activa precoz; solo las no desplazadas o poco desplazadas. Si bloquean el movimiento, a cirugía.' },
            // Donnally 2025 (StatPearls, fracturas vertebrales por compresión): «Bracing for 4 to
            // 12 weeks is typical, discontinued when pain resolves and radiographic healing
            // occurs». Margetis y Patel 2025 (StatPearls, vertebroplastia y cifoplastia): con
            // tratamiento conservador, «Symptoms typically resolve within 4 to 6 weeks»; la
            // cementación es para el dolor que no cede; sin plazo de recuperación tras ella.
            // Yuan 2016 (metaanálisis de 10 ensayos, texto completo en PMC): mejor dolor y función
            // que el tratamiento conservador; cita a Gill 2007 (más de 5 puntos menos en la EVA en el
            // postoperatorio inmediato) y a Liu 2013 (igual que la inyección simulada de 2 semanas
            // a 6 meses). Sin plazo de recuperación: no se pinta una barra propia.
            { id: 'fx_vertebral_compresion', mide: 'proteccion', nombre: 'Vertebral por compresión, sin cirugía', desde: 2, hasta: 4, fuentes: ['Donnally 2025', 'Margetis y Patel 2025', 'Yuan 2016'],
              nota: 'Corsé de 4 a 12 semanas, hasta que cede el dolor y la radiografía muestra la consolidación; los síntomas suelen ceder en 4–6 semanas. Si el dolor no cede, vertebroplastia o cifoplastia: alivian el dolor en el postoperatorio inmediato y mejoran la función frente al tratamiento conservador, pero frente a una intervención simulada el dolor es igual (sin plazo de recuperación propio).' },
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

  fasesFuente: 'Fases de reparación: Wallace, Basehore y Zito, «Wound Healing Phases», StatPearls (act. 2023). Rotura de tendón: Wu, Nerlich y Docheva, «Tendon injuries: basic science and new repair proposals», EFORT Open Rev 2017.',
};
