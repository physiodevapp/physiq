// ============================================================
// Formulario previo a la primera visita · CARA 2 · LUMBAR
// Texto literal de guia-de-consulta/data/formulario_lumbar.js.
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF lumbar (data.js): se muestran como recordatorio en ese
// paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// ============================================================
const NS = 'No sabría decir';
const SNN = ['Sí', 'No', 'No sé'];

export default {
  id: 'lumbar',
  titulo: 'Sobre su espalda en concreto',
  intro: 'Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».',
  secciones: [
    {
      titulo: 'Dónde nota los síntomas',
      items: [
        { id: 'pierna_hasta', tipo: 'unica', informe: 'Dolor irradiado a la pierna', texto: 'Además de la espalda, ¿le baja el dolor por la pierna?',
          opciones: ['No, se queda en la espalda', 'Hasta la nalga', 'Hasta la rodilla', 'Por debajo de la rodilla', 'Hasta el pie', NS] },
        { id: 'pierna_lado', tipo: 'unica', informe: 'Pierna afectada', texto: 'Pierna', opciones: ['Derecha', 'Izquierda', 'Las dos'],
          mostrarSi: { id: 'pierna_hasta', valores: ['Hasta la nalga', 'Hasta la rodilla', 'Por debajo de la rodilla', 'Hasta el pie'] } },
        { id: 'cambia_lado', tipo: 'unica', texto: '¿El dolor le cambia de lado de unos días a otros?', opciones: ['Sí', 'No', NS] },
        { id: 'pierna_tipo', tipo: 'multi', texto: '¿Cómo es ese dolor de pierna, si lo tiene? (puede marcar varias)',
          opciones: ['Quemazón', 'Como calambres o descargas', 'Hormigueo', 'Zona dormida', 'Distinto a cualquier dolor que haya tenido antes', 'No tengo dolor de pierna', NS] },
        { id: 'debilidad', tipo: 'unica', informe: 'Pérdida de fuerza en la pierna', texto: '¿Ha notado pérdida de fuerza en la pierna, que se le doble o que tropiece?', opciones: ['Sí', 'No', NS] }
      ]
    },
    {
      titulo: 'Qué lo empeora y qué lo alivia',
      items: [
        { id: 'empeora', tipo: 'matriz', texto: '¿Qué le empeora?', ayuda: 'En cada línea, Sí o No. Si duda, «No sé».', opciones: SNN,
          filas: [
            { id: 'toser', texto: 'Al toser, estornudar o hacer fuerza en el baño' },
            { id: 'sentado', texto: 'Estando sentado un rato' },
            { id: 'levantarse', texto: 'Al levantarse de la silla' },
            { id: 'agacharse', texto: 'Al agacharse hacia delante' },
            { id: 'atras', texto: 'Al echarse hacia atrás' },
            { id: 'de_pie', texto: 'Estando de pie parado un rato' },
            { id: 'caminando', texto: 'Caminando' }
          ] },
        { id: 'que_alivia', tipo: 'unica', texto: 'Si le empeora caminando o de pie, ¿qué hace que se le pase?',
          opciones: ['Sentarme', 'Inclinarme hacia delante o apoyarme en el carro de la compra', 'Basta con pararme quieto de pie', 'No se me pasa', 'No me pasa esto', NS] },
        { id: 'bici_carro', tipo: 'unica', texto: '¿Aguanta más rato en bicicleta o empujando un carro que caminando normal?', opciones: ['Sí', 'No', 'No lo he probado'] },
        { id: 'postura_alivio', tipo: 'unica', texto: '¿Hay alguna postura o movimiento que se lo alivie de verdad?',
          opciones: ['Sí', 'No, nada se lo quita', NS], detalle: { opcion: 'Sí', etiqueta: '¿Cuál?' } }
      ]
    },
    {
      titulo: 'Otras cosas',
      items: [
        { id: 'cadera', tipo: 'unica', texto: '¿Tiene también dolor en la ingle o en la cadera, o le cuesta cruzar las piernas o ponerse los calcetines?', opciones: ['Sí', 'No', NS] },
        { id: 'embarazo', tipo: 'unica', texto: '¿Está embarazada, o ha dado a luz en el último año?', opciones: ['Sí', 'No', 'No procede'] },
        { id: 'traumatismo', tipo: 'unica', texto: '¿Ha tenido alguna vez un golpe fuerte en la pelvis, la espalda o el coxis — una caída, un accidente — o le han operado de la columna?',
          opciones: ['Sí', 'No', NS], detalle: { opcion: 'Sí', etiqueta: '¿Qué pasó?' } },
        { id: 'deporte', tipo: 'texto', texto: '¿Hace algún deporte o actividad repetitiva?', ayuda: 'Cuál, cuántos días por semana, y si ha cambiado algo últimamente', lineas: 1,
          chips: ['Correr', 'Caminar', 'Gimnasio', 'Pádel', 'Natación', 'Ciclismo'] },
        { id: 'algo_mas', tipo: 'texto', texto: '¿Hay algo más que quiera contarme, o algo que le preocupe de este problema?', lineas: 2 }
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
