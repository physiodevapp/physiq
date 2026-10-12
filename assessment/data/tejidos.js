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
//   grupos[]    { id, tejido, filas[] } — `id` lo usa el filtro del panel
//     fila      { id, nombre, desde, hasta, gravedad, fuentes[], nota?, pendiente?, subtipos? }
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
          id: 'tendinopatia', nombre: 'Tendinopatía', desde: 2, hasta: 5, gravedad: 'moderada',
          fuentes: ['Snyder-Mackler 2012'],
          nota: 'No es un plazo de cicatrización: orienta el tiempo de adaptación a la carga. En la fuente comparte fila con la rotura.',
        },
        {
          // Wu 2017, «Tendon healing»: «The remodelling stage … begins after six to eight
          // weeks after injury and takes around one to two years, depending on the age and
          // condition of the patient»; «The healed tendon does not usually regain the
          // mechanical properties of the uninjured tissue».
          id: 'tendon_rotura', nombre: 'Rotura / reparación de tendón', desde: 3, hasta: 7, gravedad: 'grave',
          fuentes: ['Wu 2017'],
          nota: 'Biología de la curación: la remodelación empieza a las 6–8 semanas y dura 1–2 años; el tendón no suele recuperar del todo su resistencia. La vuelta a la actividad la marca el protocolo.',
        },
      ],
    },
    {
      id: 'musculo', tejido: 'Músculo',
      filas: [
        { id: 'doms', nombre: 'Dolor muscular tardío (DOMS)', desde: 0, hasta: 0, gravedad: 'minima', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g1', nombre: 'Rotura grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g2', nombre: 'Rotura grado II', desde: 2, hasta: 3, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g3', nombre: 'Rotura grado III', desde: 2, hasta: 4, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
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
        { id: 'ligamento_g1', nombre: 'Esguince grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'tobillo_lateral_g1', nombre: 'Tobillo, ligamento lateral', desde: 1, hasta: 1, fuentes: ['Bergman 2025'],
              nota: '1–2 semanas con movilización precoz y rehabilitación funcional.' },
            // Fase J, 2 (rodilla): Naqvi y Sherman 2023, «Treatment / Management»: «Patients
            // with grade I injuries typically can return to play within ten to 14 days»; el
            // grado II «more variable timelines» (por criterios) y el grado III sin plazo:
            // no se pintan. 10–14 días = «4–14 d» (1).
            { id: 'rodilla_lcm_g1', nombre: 'Rodilla, ligamento colateral medial', desde: 1, hasta: 1, fuentes: ['Naqvi y Sherman 2023'],
              nota: 'Vuelta al deporte en 10–14 días con tratamiento conservador. Los grados II y III no tienen plazo en la fuente: se decide por criterios (fuerza igual en las dos piernas y sin dolor al valgo).' },
          ] },
        { id: 'ligamento_g2', nombre: 'Esguince grado II', desde: 2, hasta: 4, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'tobillo_lateral_g2', nombre: 'Tobillo, ligamento lateral', desde: 2, hasta: 3, fuentes: ['Bergman 2025', 'Vuurberg 2018'],
              nota: '3–6 semanas (Bergman 2025). La guía de Vuurberg 2018 junta la rotura parcial y la total: vuelta completa al trabajo y al deporte a las 6–8 semanas, según la tarea.' },
          ] },
        { id: 'ligamento_g3', nombre: 'Esguince grado III', desde: 3, hasta: 5, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            { id: 'tobillo_lateral_g3', nombre: 'Tobillo, ligamento lateral', desde: 3, hasta: 4, fuentes: ['Bergman 2025', 'Martin 2021'],
              nota: '6–12 semanas o más; a veces cirugía por inestabilidad persistente. Un 5–33 % sigue con dolor al año (Martin 2021).' },
            { id: 'tobillo_lateral_cirugia', nombre: 'Tobillo, reparación quirúrgica', desde: 4, hasta: 5, fuentes: ['Vuurberg 2018', 'Bergman 2025'],
              nota: 'Vuelta al trabajo físico y al deporte a las 12–16 semanas (Vuurberg 2018); unos 3–4 meses según Bergman 2025. Manda el protocolo del cirujano.' },
            // Evans 2023, «Non-operative management»: «an acute symptomatic treatment followed
            // by 12 weeks of supervised physiotherapy» (baja demanda, sin pivotes, roturas
            // parciales). Es la duración del programa, no un plazo de cicatrización: el
            // ligamento roto no cicatriza. Fase aguda + 12 semanas ≈ «3–4 s» a «2–3 m» (2–4).
            { id: 'rodilla_lca_conservador', nombre: 'Rodilla, LCA sin cirugía', desde: 2, hasta: 4, fuentes: ['Evans 2023'],
              nota: 'No es un plazo de cicatrización: tras la fase aguda, 12 semanas de fisioterapia supervisada. Indicado en baja demanda, deportes sin giros ni saltos y roturas parciales.' },
          ] },
        { id: 'injerto', nombre: 'Injerto (reconstrucción)', desde: 4, hasta: 6, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'],
          subtipos: [
            // Evans 2023, «Pearls and Other Issues»: «The average return to full activity
            // and/or sports participation is estimated to be between 6 to 12 months after
            // surgical reconstruction»; «the graft takes up to 18 months or more to become
            // fully functional and incorporated». Logerstedt 2017 (guía JOSPT) no da plazos:
            // al año, «no knee effusion, no knee instability, and … over 93% on the IKDC
            // 2000» → «more than 14 times more likely to return to sports» (PLR = 14.54).
            // 6–12 meses = «6m–1a» (6); hasta 18 meses o más = «2a» (7).
            { id: 'rodilla_lca_reconstruido', nombre: 'Rodilla, LCA reconstruido', desde: 6, hasta: 7, fuentes: ['Evans 2023', 'Logerstedt 2017'],
              nota: 'Vuelta a la actividad o al deporte a los 6–12 meses de media; el injerto puede tardar 18 meses o más en incorporarse del todo (Evans 2023). La guía JOSPT no fija plazos: al año, sin derrame, sin inestabilidad y con IKDC > 93 %, la vuelta al deporte es mucho más probable (Logerstedt 2017).' },
          ] },
      ],
    },
    {
      id: 'hueso', tejido: 'Hueso',
      filas: [
        { id: 'fractura', nombre: 'Fractura', desde: 2, hasta: 5, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
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
