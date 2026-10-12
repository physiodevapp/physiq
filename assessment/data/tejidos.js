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
//               pintan plegados bajo su fila. Solo con fuente leída para cada
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
        { id: 'ligamento_g1', nombre: 'Esguince grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'ligamento_g2', nombre: 'Esguince grado II', desde: 2, hasta: 4, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'ligamento_g3', nombre: 'Esguince grado III', desde: 3, hasta: 5, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'injerto', nombre: 'Injerto (reconstrucción)', desde: 4, hasta: 6, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
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
