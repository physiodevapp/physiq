// ============================================================
// Formulario previo a la primera visita · CARA 2 · CERVICAL
// Transcrito de guia-de-consulta/data/formulario_cervical.js, con las preguntas en tú (decisión del usuario, 2026-10).
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF cervical (data/cervical.js): se muestran como recordatorio
// en ese paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// ============================================================
const NS = 'No sabría decir';
const SNNS = ['Sí', 'No', NS];
const SNN = ['Sí', 'No', 'No sé'];

export default {
  id: 'cervical',
  secciones: [
    {
      titulo: 'Cómo empezó en tu caso',
      items: [
        { id: 'desencadenante', tipo: 'multi', ia: 'historia', texto: 'Si hubo algo que lo desencadenara, ¿qué fue? (se pueden marcar varias)',
          opciones: ['Un accidente de tráfico', 'Un golpe haciendo deporte o en tu tiempo libre',
            'Estar mucho rato en una postura, en el trabajo o en casa', 'Un giro brusco de la cabeza',
            'Una actividad poco habitual (por ejemplo, pintar un techo)', 'Nada concreto', NS] }
      ]
    },
    {
      titulo: 'Dolor en el brazo',
      items: [
        { id: 'brazo_mover', tipo: 'unica', ia: 'sintomas', informe: 'Dolor irradiado al brazo al mover el cuello', texto: '¿Te baja el dolor por el brazo al mover el cuello?', opciones: SNNS },
        { id: 'brazo_como', tipo: 'multi', ia: 'sintomas', texto: '¿Cómo es ese dolor del brazo, si lo tienes? (se pueden marcar varias)',
          opciones: ['Quemazón', 'Como descargas', 'Como pinchazos', 'Zona dormida', 'No tengo dolor en el brazo', NS] },
        { id: 'brazo_atras', tipo: 'unica', ia: 'sintomas', texto: '¿Te duele el cuello o el brazo al llevar el brazo hacia atrás?', opciones: SNNS },
        { id: 'fuerza', tipo: 'unica', ia: 'sintomas', informe: 'Pérdida de fuerza en el brazo', texto: '¿Has notado menos fuerza en el brazo?', opciones: SNNS }
      ]
    },
    {
      titulo: 'Dolor de cabeza',
      items: [
        { id: 'cefalea', tipo: 'unica', ia: 'sintomas', informe: 'Dolores de cabeza', texto: '¿Tienes también dolores de cabeza?', opciones: SNNS },
        { id: 'cef_lado', tipo: 'unica', ia: 'sintomas', texto: '¿Te dan siempre en el mismo lado de la cabeza?',
          opciones: ['Sí, siempre en el mismo lado', 'No, cambian de lado o son en los dos', NS],
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } },
        { id: 'cef_cuello', tipo: 'unica', ia: 'sintomas', texto: '¿Te empieza el dolor de cabeza en el cuello?', opciones: SNNS,
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } },
        { id: 'cef_desencadena', tipo: 'unica', ia: 'sintomas', texto: '¿Te lo desencadenan ciertos movimientos o posturas del cuello?', opciones: SNNS,
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } },
        { id: 'cef_como', tipo: 'unica', ia: 'sintomas', texto: '¿Cómo es?',
          opciones: ['Late, como el pulso', 'Aprieta, como una cinta', 'Ni una cosa ni otra', NS],
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } },
        { id: 'cef_actividad', tipo: 'unica', ia: 'sintomas', texto: '¿Te empeora al caminar o al subir escaleras?', opciones: SNNS,
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } },
        { id: 'cef_aura', tipo: 'unica', ia: 'sintomas', texto: 'Un rato antes de que empiece, ¿notas hormigueo en el brazo, la lengua o el cuello, o menos fuerza en el brazo?', opciones: SNNS,
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } },
        { id: 'cef_atm', tipo: 'unica', ia: 'sintomas', texto: '¿Te cuesta abrir la boca, se te desvía la mandíbula al abrirla o te hace ruido?', opciones: SNNS,
          mostrarSi: { id: 'cefalea', valores: ['Sí', NS] } }
      ]
    },
    {
      titulo: 'Mareo',
      items: [
        { id: 'mareo', tipo: 'unica', ia: 'sintomas', informe: 'Mareo o inestabilidad', texto: '¿Notas mareo o sensación de inestabilidad?', opciones: SNNS },
        { id: 'mareo_como', tipo: 'unica', ia: 'sintomas', texto: '¿Cómo es?', opciones: ['Me siento aturdido o inestable', 'Todo me da vueltas', NS],
          mostrarSi: { id: 'mareo', valores: ['Sí', NS] } },
        { id: 'mareo_cuello', tipo: 'unica', ia: 'sintomas', texto: '¿Te aumenta cuando te duele más el cuello o al moverlo?', opciones: SNNS,
          mostrarSi: { id: 'mareo', valores: ['Sí', NS] } },
        { id: 'mareo_vista', tipo: 'unica', ia: 'sintomas', texto: '¿Te cuesta concentrarte para leer, o se te cansa la vista?', opciones: SNNS,
          mostrarSi: { id: 'mareo', valores: ['Sí', NS] } }
      ]
    },
    {
      titulo: 'Qué lo empeora y qué lo alivia',
      items: [
        { id: 'empeora', tipo: 'matriz', ia: 'actividades', texto: '¿Te empeora…?', ayuda: 'En cada línea, Sí o No. Si no lo sabe, «No sé».', opciones: SNN,
          filas: [
            { id: 'postura', texto: 'Estando mucho rato en la misma postura' },
            { id: 'mover', texto: 'Al mover el cuello' }
          ] },
        { id: 'alivia', tipo: 'unica', ia: 'sintomas', texto: '¿Se te alivia al cambiar de postura o al moverte?', opciones: ['Sí', 'No, nada lo cambia', NS] },
        { id: 'rapidos', tipo: 'unica', ia: 'actividades', texto: '¿Te cuesta hacer movimientos rápidos con la cabeza, o mover la cabeza sin mover el cuerpo?', opciones: SNNS }
      ]
    }
  ],
  // Enlaces según los comentarios de la fuente (guía clínica cervical, ap. 3):
  // inicio (idiopático frente a latigazo), radicular/radiculopatía (brazo),
  // cefalea (cervicogénica, migraña, tensional, aura, ATM), mareo cervicogénico
  // frente a vestibular, y patrón mecánico (postura y movimiento).
  pistas: {
    ce_step2:  ['r:desencadenante', 'c:desencadenante', 'c:inicio'],
    ce_step3:  ['r:brazo_mover', 'r:brazo_como', 'r:brazo_atras', 'r:fuerza'],
    ce_step3b: ['r:brazo_como', 'r:fuerza', 'r:cef_aura'],
    ce_step4:  ['r:cefalea', 'r:cef_lado', 'r:cef_cuello', 'r:cef_desencadena', 'r:cef_como', 'r:cef_actividad', 'r:cef_aura', 'r:cef_atm'],
    ce_step4b: ['r:mareo', 'r:mareo_como', 'r:mareo_cuello', 'r:mareo_vista', 'r:rapidos'],
    ce_step6:  ['r:empeora.postura', 'r:empeora.mover', 'r:alivia', 'r:desencadenante']
  }
};
