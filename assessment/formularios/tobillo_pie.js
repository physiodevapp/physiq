// ============================================================
// Formulario previo a la primera visita · CARA 2 · TOBILLO Y PIE
// Transcrito de guia-de-consulta/data/formulario_tobillo_pie.js, con las preguntas en tú (decisión del usuario, 2026-10).
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF tobillo y pie (data/tobillo_pie.js): se muestran como
// recordatorio en ese paso, nunca lo responden solas. Referencias: 'c:<id>'
// (cara 1), 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// ============================================================
const NS = 'No sabría decir';
const SNNS = ['Sí', 'No', NS];
const SNN = ['Sí', 'No', 'No sé'];
const MATRIZ_AYUDA = 'En cada línea, Sí o No. Si no lo sabe, «No sé».';

export default {
  id: 'tobillo_pie',
  secciones: [
    {
      titulo: 'Si empezó con una torcedura, un golpe o una caída',
      items: [
        { id: 'que_paso', tipo: 'multi', ia: 'historia', informe: 'Cómo se lesionó', texto: '¿Qué pasó? (se pueden marcar varias)',
          opciones: ['Se me torció el tobillo hacia dentro, apoyando el borde de fuera del pie',
            'Me giraron el pie hacia fuera con el tobillo doblado hacia arriba (un placaje, una entrada)',
            'Me caí hacia delante con el pie de puntillas, o fallé un escalón al bajar',
            'Caí de pie desde una altura, sobre el talón', 'Se me dobló el dedo gordo hacia arriba o hacia abajo',
            'Al arrancar o impulsarme, noté como una patada o un golpe detrás de la pierna',
            'Ninguna de estas', NS] },
        { id: 'chasquido', tipo: 'unica', ia: 'historia', texto: '¿Oíste o notaste un chasquido en ese momento?', opciones: SNNS },
        { id: 'pudo_seguir', tipo: 'unica', ia: 'historia', texto: '¿Pudiste seguir con lo que estabas haciendo?', opciones: ['Sí', 'No, tuve que parar', NS] },
        { id: 'torceduras', tipo: 'unica', ia: 'historia', informe: 'Torceduras previas del mismo tobillo', texto: '¿Se te había torcido ese tobillo otras veces?', opciones: ['No', 'Una vez', 'Varias veces', NS] }
      ]
    },
    {
      titulo: 'Qué te provoca el dolor',
      items: [
        { id: 'provoca', tipo: 'matriz', ia: 'actividades', texto: '¿Te aparece o te aumenta el dolor al…?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'primeros_pasos', texto: 'Dar los primeros pasos al levantarse de la cama' },
            { id: 'sentado', texto: 'Echar a andar después de estar sentado un rato' },
            { id: 'descalzo', texto: 'Caminar descalzo o con calzado plano' },
            { id: 'puntillas', texto: 'Ponerse de puntillas' },
            { id: 'agacharse', texto: 'Agacharse doblando mucho el tobillo' },
            { id: 'correr', texto: 'Correr' },
            { id: 'saltar', texto: 'Saltar o caer de un salto' },
            { id: 'irregular', texto: 'Caminar por terreno irregular o arena' },
            { id: 'bici', texto: 'Montar en bici o nadar' },
            { id: 'zapatos', texto: 'Llevar ciertos zapatos (te rozan o te aprietan)' }
          ] },
        { id: 'dia_despues', tipo: 'unica', ia: 'sintomas', texto: 'El día después de hacer más de lo normal, ¿estás peor?', opciones: SNNS },
        { id: 'calentar', tipo: 'unica', ia: 'sintomas', texto: 'Cuando empiezas a moverte, el dolor…',
          opciones: ['Se me pasa al calentar', 'Va a más cuanto más hago', 'No cambia', NS] },
        { id: 'tacon', tipo: 'unica', ia: 'sintomas', texto: '¿Estás mejor con un zapato que tenga algo de tacón?', opciones: ['Sí', 'No', 'No lo he notado'] }
      ]
    },
    {
      titulo: 'Lo que notas en el tobillo o el pie',
      items: [
        { id: 'nota', tipo: 'matriz', ia: 'sintomas', texto: '¿Notas alguna de estas cosas?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'falla', texto: 'El tobillo te falla o «se te va», o tienes miedo a torcértelo' },
            { id: 'crujidos', texto: 'Crujidos o roces al mover el tobillo o el dedo gordo' },
            { id: 'hinchazon', texto: 'Hinchazón en el tobillo o el pie' },
            { id: 'trabado', texto: 'Se te queda trabado o no llegas a estirar la punta' },
            { id: 'hormigueo', texto: 'Hormigueo, quemazón o descargas en el pie' },
            { id: 'canica', texto: 'Al caminar, como si pisaras una canica bajo los dedos' },
            { id: 'bulto', texto: 'Un bulto detrás del talón que te roza con el zapato' }
          ] },
        { id: 'rigidez', tipo: 'unica', ia: 'sintomas', texto: 'Por la mañana, ¿notas rigidez o dolor al levantarte?',
          opciones: ['No', 'Sí, se me pasa en menos de una hora', 'Sí, me dura una hora o más', NS] }
      ]
    },
    {
      titulo: 'Trabajo, deporte y ejercicio',
      items: [
        { id: 'actividad', tipo: 'multi', ia: 'contexto', texto: 'En el trabajo o en tu tiempo libre, ¿haces a menudo alguna de estas cosas? (se pueden marcar varias)',
          opciones: ['Estar muchas horas de pie', 'Caminar mucho', 'Correr', 'Danza', 'Deportes con saltos o giros', 'Ninguna', NS] }
      ]
    },
    {
      titulo: 'Si haces deporte o ejercicio',
      items: [
        { id: 'cambios', tipo: 'multi', ia: 'contexto', texto: 'En los últimos meses, ¿ha cambiado algo? (se pueden marcar varias)',
          opciones: ['Entreno más días u horas', 'Entreno más fuerte', 'Empecé o volví hace poco', 'Cambié de calzado',
            'Cambié de terreno o superficie', 'No ha cambiado nada', NS] }
      ]
    }
  ],
  // Enlaces según los comentarios de la fuente (guía clínica de tobillo y pie,
  // ap. 3, 5 y 6): mecanismo (esguince, sindesmosis, Lisfranc, calcáneo,
  // Aquiles, 1.ª MTF), esguinces repetidos (inestabilidad crónica, coalición),
  // provocadores por localización, peor al día siguiente (Aquiles), efecto del
  // calentamiento, tacón (insercional, talón plantar), síntomas mecánicos y
  // neuropáticos, rigidez matutina y carga.
  pistas: {
    tp_step1:  ['c:desencadenante', 'c:inicio', 'r:que_paso', 'r:chasquido', 'r:pudo_seguir'],
    tp_step2:  ['r:que_paso', 'r:chasquido', 'r:pudo_seguir'],
    tp_step3:  ['r:que_paso', 'r:torceduras'],
    tp_step4:  ['c:desencadenante', 'r:nota.trabado'],
    tp_step5:  ['r:nota.hormigueo'],
    tp_step6:  ['r:provoca.primeros_pasos', 'r:provoca.sentado', 'r:provoca.descalzo', 'r:provoca.puntillas',
      'r:provoca.correr', 'r:provoca.saltar', 'r:provoca.bici', 'r:provoca.zapatos', 'r:dia_despues', 'r:calentar',
      'r:tacon', 'r:nota.crujidos', 'r:nota.trabado', 'r:nota.hormigueo', 'r:nota.bulto', 'r:actividad', 'r:cambios'],
    tp_step7:  ['r:provoca.puntillas', 'r:nota.crujidos', 'r:nota.hormigueo', 'r:actividad', 'r:cambios'],
    tp_step8:  ['r:provoca.irregular', 'r:nota.falla', 'r:nota.hinchazon', 'r:rigidez'],
    tp_step9:  ['r:provoca.agacharse', 'r:nota.hinchazon', 'r:rigidez'],
    tp_step10: ['r:provoca.primeros_pasos', 'r:provoca.sentado', 'r:provoca.descalzo', 'r:tacon', 'r:nota.hormigueo',
      'r:actividad', 'r:cambios'],
    tp_step11: ['r:provoca.irregular', 'r:provoca.puntillas', 'r:torceduras', 'r:actividad', 'r:cambios'],
    tp_step12: ['r:que_paso', 'r:provoca.puntillas', 'r:provoca.zapatos', 'r:nota.canica', 'r:rigidez', 'r:actividad'],
    tp_step13: ['r:torceduras', 'r:nota.falla', 'r:nota.hinchazon', 'r:nota.trabado', 'r:calentar', 'r:rigidez']
  }
};
