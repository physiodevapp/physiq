// ============================================================
// Formulario previo a la primera visita · CARA 2 · CADERA
// Transcrito de guia-de-consulta/data/formulario_cadera.js, con las preguntas en tú (decisión del usuario, 2026-10).
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF cadera (data/cadera.js): se muestran como recordatorio
// en ese paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// ============================================================
const NS = 'No sabría decir';
const SNN = ['Sí', 'No', 'No sé'];

export default {
  id: 'cadera',
  secciones: [
    {
      titulo: 'Qué te provoca el dolor',
      items: [
        { id: 'provoca', tipo: 'matriz', ia: 'actividades', texto: '¿Te aparece o te aumenta el dolor al…?', ayuda: 'En cada línea, Sí o No. Si no lo sabe, «No sé».', opciones: SNN,
          filas: [
            { id: 'agacharse', texto: 'Agacharse o sentarse en una silla baja' },
            { id: 'coche', texto: 'Entrar o salir del coche' },
            { id: 'calzarse', texto: 'Ponerse los zapatos o los calcetines' },
            { id: 'levantarse', texto: 'Levantarse de una silla' },
            { id: 'caminar', texto: 'Caminar' },
            { id: 'escaleras', texto: 'Subir o bajar escaleras' },
            { id: 'lado', texto: 'Tumbarse sobre ese lado' },
            { id: 'cruzar', texto: 'Cruzar las piernas' },
            { id: 'una_pierna', texto: 'Apoyarse en esa pierna sola (al vestirse)' },
            { id: 'separar', texto: 'Separar mucho la pierna hacia un lado' },
            { id: 'toser', texto: 'Toser, estornudar o hacer abdominales' }
          ] }
      ]
    },
    {
      titulo: 'Lo que notas en la cadera',
      items: [
        { id: 'nota', tipo: 'matriz', ia: 'sintomas', texto: '¿Notas alguna de estas cosas?', ayuda: 'En cada línea, Sí o No. Si no lo sabe, «No sé».', opciones: SNN,
          filas: [
            { id: 'chasquido', texto: 'Un chasquido o un clic que te duele' },
            { id: 'bloqueo', texto: 'Que la cadera se engancha o se bloquea' },
            { id: 'falla', texto: 'Que la cadera te falla, como si cediera' },
            { id: 'quemazon', texto: 'Quemazón, hormigueo o piel dormida en el muslo' },
            { id: 'rigidez', texto: 'Rigidez por la mañana que se te pasa en menos de una hora' }
          ] }
      ]
    },
    {
      titulo: 'De pequeño',
      items: [
        { id: 'infancia', tipo: 'unica', ia: 'contexto', texto: 'De niño o adolescente, ¿tuviste algún problema en las caderas? (te trataron, llevaste férula o arnés, cojeabas, te operaron)',
          opciones: ['No', NS, 'Sí'], detalle: { opcion: 'Sí', etiqueta: '¿Cuál?', verbal: '¿Qué problema de cadera tuviste de pequeño?' } }
      ]
    },
    {
      titulo: 'Si haces deporte o ejercicio',
      items: [
        { id: 'deporte', tipo: 'texto', ia: 'contexto', texto: '¿Qué deporte o ejercicio haces?', verbal: '¿Qué deporte o ejercicio haces? ¿Cuántos días a la semana?', lineas: 1,
          chips: ['Correr', 'Fútbol', 'Gimnasio', 'Pádel', 'Ciclismo', 'Baile'] },
        { id: 'dias', tipo: 'unica', ia: 'contexto', texto: '¿Cuántos días a la semana?', opciones: ['1 o 2', '3 o 4', '5 o más', NS] },
        { id: 'cambios', tipo: 'multi', ia: 'contexto', texto: 'En los últimos meses, ¿ha cambiado algo? (se pueden marcar varias)',
          opciones: ['Entreno más días u horas', 'Entreno más fuerte', 'Empecé o volví hace poco', 'Cambié de superficie o de calzado', 'No ha cambiado nada', NS] },
        { id: 'gesto', tipo: 'unica', ia: 'historia', texto: '¿Empezó de golpe haciendo alguno de estos gestos?',
          opciones: ['Chutar', 'Esprintar', 'Cambiar de dirección', 'Estirarme', 'No', NS] },
        { id: 'cuando_duele', tipo: 'multi', ia: 'sintomas', texto: 'Con el deporte, ¿cuándo te duele? (se pueden marcar varias)',
          opciones: ['Mientras lo hago', 'Al acabar', 'Al día siguiente, sobre todo por la mañana', 'Se me pasa al calentar', 'Con descanso mejora, pero vuelve al retomar', NS] }
      ]
    }
  ],
  // Enlaces según los comentarios de la fuente (guía clínica de cadera, ap. 3):
  // intraarticular (agacharse, silla baja, coche, calzarse), artrosis (calzarse,
  // levantarse, caminar, rigidez matutina), psoas (levantarse), SDTM (lado,
  // piernas cruzadas, una pierna, escaleras), ligamento redondo (abrir la
  // pierna, fallo), inguinal (tos, estornudo, abdominales), meralgia (quemazón),
  // lesión aguda (gesto), perfil de fractura de estrés (cambios de carga).
  pistas: {
    ca_step1b: ['c:desencadenante', 'c:inicio', 'r:gesto'],
    ca_step2:  ['r:provoca.calzarse', 'r:provoca.levantarse', 'r:provoca.caminar', 'r:nota.rigidez'],
    ca_step3:  ['r:provoca.agacharse', 'r:provoca.coche', 'r:provoca.calzarse', 'r:nota.chasquido', 'r:nota.bloqueo'],
    ca_step3b: ['r:nota.falla', 'r:provoca.separar', 'r:infancia', 'c:despierta'],
    ca_step4:  ['r:provoca.lado', 'r:provoca.cruzar', 'r:provoca.una_pierna', 'r:provoca.escaleras'],
    ca_step6:  ['r:provoca.toser', 'r:provoca.levantarse', 'r:deporte', 'r:dias', 'r:cambios', 'r:cuando_duele'],
    ca_step7:  ['r:nota.quemazon']
  }
};
