// ============================================================
// Formulario previo a la primera visita · CARA 2 · LUMBAR
// Transcrito de guia-de-consulta/data/formulario_lumbar.js, con las preguntas en tú (decisión del usuario, 2026-10).
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF lumbar (data.js): se muestran como recordatorio en ese
// paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// ============================================================
const NS = 'No sabría decir';
const SNN = ['Sí', 'No', 'No sé'];

export default {
  id: 'lumbar',
  secciones: [
    {
      titulo: 'Dónde notas los síntomas',
      items: [
        { id: 'pierna_hasta', tipo: 'unica', ia: 'sintomas', informe: 'Dolor irradiado a la pierna', texto: 'Además de la espalda, ¿te baja el dolor por la pierna?',
          opciones: ['No, se queda en la espalda', 'Hasta la nalga', 'Hasta la rodilla', 'Por debajo de la rodilla', 'Hasta el pie', NS] },
        { id: 'pierna_lado', tipo: 'unica', ia: 'sintomas', informe: 'Pierna afectada', texto: 'Pierna', opciones: ['Derecha', 'Izquierda', 'Las dos'],
          mostrarSi: { id: 'pierna_hasta', valores: ['Hasta la nalga', 'Hasta la rodilla', 'Por debajo de la rodilla', 'Hasta el pie'] } },
        { id: 'cambia_lado', tipo: 'unica', ia: 'sintomas', texto: '¿El dolor te cambia de lado de unos días a otros?', opciones: ['Sí', 'No', NS] },
        { id: 'pierna_tipo', tipo: 'multi', ia: 'sintomas', texto: '¿Cómo es ese dolor de pierna, si lo tienes? (se pueden marcar varias)',
          opciones: ['Quemazón', 'Como calambres o descargas', 'Hormigueo', 'Zona dormida', 'Distinto a cualquier dolor que haya tenido antes', 'No tengo dolor de pierna', NS] },
        { id: 'debilidad', tipo: 'unica', ia: 'sintomas', informe: 'Pérdida de fuerza en la pierna', texto: '¿Has notado pérdida de fuerza en la pierna, que se te doble o que tropieces?', opciones: ['Sí', 'No', NS] }
      ]
    },
    {
      titulo: 'Qué lo empeora y qué lo alivia',
      items: [
        { id: 'empeora', tipo: 'matriz', ia: 'actividades', texto: '¿Qué te empeora?', ayuda: 'En cada línea, Sí o No. Si no lo sabe, «No sé».', opciones: SNN,
          filas: [
            { id: 'toser', texto: 'Al toser, estornudar o hacer fuerza en el baño' },
            { id: 'sentado', texto: 'Estando sentado un rato' },
            { id: 'levantarse', texto: 'Al levantarse de la silla' },
            { id: 'agacharse', texto: 'Al agacharse hacia delante' },
            { id: 'atras', texto: 'Al echarse hacia atrás' },
            { id: 'de_pie', texto: 'Estando de pie parado un rato' },
            { id: 'caminando', texto: 'Caminando' }
          ] },
        { id: 'que_alivia', tipo: 'unica', ia: 'sintomas', texto: 'Si te empeora caminando o de pie, ¿qué hace que se te pase?',
          opciones: ['Sentarme', 'Inclinarme hacia delante o apoyarme en el carro de la compra', 'Basta con pararme quieto de pie', 'No se me pasa', 'No me pasa esto', NS] },
        { id: 'bici_carro', tipo: 'unica', ia: 'sintomas', texto: '¿Aguanta más rato en bicicleta o empujando un carro que caminando normal?', opciones: ['Sí', 'No', 'No lo he probado'] },
        { id: 'postura_alivio', tipo: 'unica', ia: 'sintomas', texto: '¿Hay alguna postura o movimiento que te lo alivie de verdad?',
          opciones: ['Sí', 'No, nada se lo quita', NS], detalle: { opcion: 'Sí', etiqueta: '¿Cuál?', verbal: '¿Qué postura o movimiento te lo alivia?' } }
      ]
    },
    {
      titulo: 'Otras cosas',
      items: [
        { id: 'cadera', tipo: 'unica', ia: 'sintomas', texto: '¿Tienes también dolor en la ingle o en la cadera, o te cuesta cruzar las piernas o ponerte los calcetines?', opciones: ['Sí', 'No', NS] },
        { id: 'embarazo', tipo: 'unica', ia: 'contexto', texto: '¿Estás embarazada, o has dado a luz en el último año?', opciones: ['Sí', 'No', 'No procede'] },
        { id: 'traumatismo', tipo: 'unica', ia: 'historia', texto: '¿Has tenido alguna vez un golpe fuerte en la pelvis, la espalda o el coxis — una caída, un accidente — o te han operado de la columna?',
          opciones: ['Sí', 'No', NS], detalle: { opcion: 'Sí', etiqueta: '¿Qué pasó?', verbal: '¿Qué golpe, caída u operación de columna tuviste?' } },
        { id: 'deporte', tipo: 'texto', ia: 'contexto', texto: '¿Haces algún deporte o actividad repetitiva? ¿Cuál y cuántos días?', ayuda: 'Cuál, cuántos días por semana, y si ha cambiado algo últimamente', lineas: 1,
          chips: ['Correr', 'Caminar', 'Gimnasio', 'Pádel', 'Natación', 'Ciclismo'] },
        { id: 'algo_mas', tipo: 'texto', ia: 'contexto', texto: '¿Hay algo más que quieras contarme, o algo que te preocupe de este problema?', verbal: '¿Algo más que quieras contarme o que te preocupe?', lineas: 2 }
      ]
    }
  ],
  pistas: {
    lu_step1:  ['r:pierna_hasta', 'r:pierna_lado', 'r:pierna_tipo', 'r:empeora.toser'],
    lu_step1b: ['r:postura_alivio'],
    lu_step1c: ['r:debilidad'],
    lu_step2:  ['r:empeora.caminando', 'r:empeora.de_pie', 'r:que_alivia', 'r:bici_carro'],
    lu_step3:  ['c:desde_cuando', 'c:inicio', 'c:primera_vez'],
    lu_step4:  ['r:cambia_lado', 'r:empeora.sentado', 'r:empeora.levantarse', 'r:empeora.agacharse', 'r:empeora.atras', 'r:postura_alivio', 'r:cadera', 'r:embarazo', 'r:traumatismo']
  }
};
