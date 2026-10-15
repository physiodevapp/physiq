// Irritabilidad de la fase 3: ítems de la matriz, textos por nivel y fuentes.
// Diseño y decisiones: docs/plan-tratamiento.md, decisiones 99–104 (Fase L,
// L3, 2026-10). La regla del nivel está en lib/irritabilidad.js; la usan la
// fase 3 (app.js) y la fase 6 (lib/plan-tratamiento.js), así que dan el mismo
// nivel.
//
// Sin preselección: una fila sin contestar queda vacía ('') y la
// irritabilidad sin ninguna fila es «no registrada» (decisión 101). Quedarse
// corto es el error peligroso (decisión 25).

// Ítems que miden la irritabilidad, en el orden de la matriz. `opciones` va de
// menos a más irritable (índice 0, 1, 2). `valor` es lo que se guarda en
// state.irritabilidad[clave] y lo que lee el prompt de la IA; `corto`, la
// etiqueta de los botones (tabla en escritorio, tarjetas en móvil; caben a 320 px).
export const ITEMS_IRRITABILIDAD = [
  { clave: 'reposo', nombre: 'Dolor en reposo', opciones: [
    { valor: 'Ausente', corto: 'Ausente' },
    { valor: 'Intermitente', corto: 'Intermitente' },
    { valor: 'Presente', corto: 'Presente' },
  ] },
  { clave: 'movimiento', nombre: 'Dolor con movimiento', opciones: [
    { valor: 'Al final del rango con SP', corto: 'FR + SP' },
    { valor: 'Al final del rango', corto: 'Final rango' },
    { valor: 'Antes del final del rango', corto: 'Antes FR' },
  ] },
  { clave: 'tolerancia', nombre: 'Tolerancia al estrés físico', opciones: [
    { valor: 'Alta', corto: 'Alta' },
    { valor: 'Moderada', corto: 'Moderada' },
    { valor: 'Baja', corto: 'Baja' },
  ] },
  // Decisión 99: el dato central de Maitland y de Petersen. Los extremos son
  // los de Maitland (la plancha: cede en ½ h, o en unos 10 min en Peripheral, y
  // se puede seguir / no cede hasta tras una noche de sueño); el intermedio
  // («horas») es el nivel moderado de Petersen (razón 1:1 entre la actividad
  // que agrava y lo que tarda en aliviarse), no está en Maitland.
  { clave: 'calma', nombre: 'Tiempo en calmarse',
    ayuda: 'Tras la actividad que lo provoca, hasta volver a su nivel previo. Si le despierta: vuelve a dormirse en menos de 30 min → horas; más de 30 min o con medicación → día siguiente (Petersen 2021).',
    opciones: [
      { valor: 'Cede en minutos', corto: 'Minutos' },
      { valor: 'Tarda horas', corto: 'Horas' },
      { valor: 'No cede hasta tras una noche', corto: 'Día siguiente' },
    ] },
];

// Decisión 100: el impacto en las actividades es gravedad (Petersen 2021: la
// gravedad incluye el impacto en las AVD), no irritabilidad. Se pregunta en la
// tarjeta de severidad, se guarda en state.irritabilidad.discapacidad (la
// clave de siempre, para las sesiones antiguas) y no cuenta para el nivel.
export const ITEM_IMPACTO = { clave: 'discapacidad', nombre: 'Impacto en las actividades', opciones: [
  { valor: 'Mínima', corto: 'Mínimo' },
  { valor: 'Moderada', corto: 'Moderado' },
  { valor: 'Alta', corto: 'Alto' },
] };

// Cortes de reposo + movimiento + tolerancia (0–2 cada uno, 0–6): los de la
// decisión 25, asimétricos hacia lo prudente.
export const CORTES_OTROS = { bajaHasta: 1, moderadaHasta: 4 };

// Textos del resumen de la fase 3 (decisión 102). Maitland es binario
// (irritable o no): baja → «hasta el límite»; moderada y alta → «hasta el
// dolor», la correspondencia prudente.
export const TEXTOS_IRRITABILIDAD = {
  hastaLimite: 'Puede explorarse «hasta el límite», con sobrepresión, si el dolor no es severo (no obliga a interrumpir la actividad) y la naturaleza del cuadro no pide prudencia (Maitland 2005, cap. 6, pp. 101 y 127–128; Hengeveld y Banks 2005, cap. 6, p. 148).',
  hastaDolor: 'Explorar «hasta el dolor»: solo hasta donde empieza o aumenta, y quizá un poco más para ver cómo se comporta (Maitland 2005, cap. 6, pp. 101 y 127–128; Hengeveld y Banks 2005, cap. 6, p. 148).',
  alta: 'Exploración y tratamiento adaptados para no exacerbarlo; la irritabilidad se confirma en la 2.ª visita, por la reacción a la primera (Maitland 2005, cap. 6, p. 117; Hengeveld y Banks 2005, cap. 8, pp. 191–192).',
  margen: 'Es un juicio con margen entre fisioterapeutas (acuerdo del 71 %, kappa 0,39–0,44; Barakatt 2009).',
  sinCalma: 'Falta el tiempo en calmarse, el dato central: el nivel puede quedarse corto.',
  incompleta: 'Matriz incompleta: el nivel puede quedarse corto.',
  noRegistrada: 'Irritabilidad no registrada. El dato clave es cuánto tarda el dolor en calmarse tras la actividad que lo provoca.',
  pistaBreve: 'Pregunta clave: cuánto tarda en calmarse tras la actividad que lo provoca (minutos → baja; horas → moderada; hasta el día siguiente → alta).',
};

// Claves de data/referencias.js que citan estos textos (tests/referencias.mjs
// las busca en el módulo entero, como FUENTES_PLAN).
export const FUENTES_IRRITABILIDAD = ['Maitland 2005', 'Hengeveld y Banks 2005', 'Petersen 2021', 'Barakatt 2009'];
