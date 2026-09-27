// ============================================================
// Formulario previo a la primera visita · CARA 2 · RODILLA
// Texto literal de guia-de-consulta/data/formulario_rodilla.js.
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF rodilla (data/rodilla.js): se muestran como recordatorio
// en ese paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// ============================================================
const NS = 'No sabría decir';
const SNNS = ['Sí', 'No', NS];
const SNN = ['Sí', 'No', 'No sé'];
const MATRIZ_AYUDA = 'En cada línea, marque Sí o No. Si duda, marque «No sé».';

export default {
  id: 'rodilla',
  titulo: 'Sobre su rodilla en concreto',
  intro: 'Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».',
  secciones: [
    {
      titulo: 'Si empezó con un golpe, una caída o un mal gesto',
      intro: 'Si en la hoja 1 contestó que NO hubo nada concreto que lo desencadenara, salte este apartado.',
      items: [
        { id: 'que_paso', tipo: 'multi', texto: '¿Qué pasó? (puede marcar varias)',
          opciones: ['Giré o cambié de dirección con el pie apoyado', 'Frené en seco', 'Caí mal de un salto',
            'Me caí de rodillas', 'Un golpe por fuera de la rodilla que la metió hacia dentro',
            'Un golpe justo debajo de la rodilla, por delante, con ella doblada (como contra el salpicadero)',
            'Un golpe por dentro, o la rodilla se me fue hacia fuera, con la pierna estirada',
            'Noté que la rótula se salía de su sitio', 'Ninguna de estas', NS] },
        { id: 'chasquido', tipo: 'unica', texto: '¿Oyó o notó un chasquido en ese momento?', opciones: SNNS },
        { id: 'pudo_seguir', tipo: 'unica', texto: '¿Pudo seguir con lo que estaba haciendo?', opciones: ['Sí', 'No, tuve que parar', NS] },
        { id: 'hinchazon', tipo: 'unica', texto: '¿Se le hinchó la rodilla?',
          opciones: ['Sí, enseguida, al poco de pasar', 'Sí, horas después: esa noche o a la mañana siguiente', 'No se hinchó', NS] }
      ]
    },
    {
      titulo: 'Qué le provoca el dolor',
      items: [
        { id: 'provoca', tipo: 'matriz', texto: '¿Le aparece o le aumenta el dolor al…?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'cuclillas', texto: 'Ponerse en cuclillas' },
            { id: 'escaleras', texto: 'Subir o bajar escaleras' },
            { id: 'arrodillarse', texto: 'Arrodillarse' },
            { id: 'sentado', texto: 'Estar mucho rato sentado' },
            { id: 'caminar', texto: 'Caminar' },
            { id: 'correr', texto: 'Correr' },
            { id: 'saltar', texto: 'Saltar' },
            { id: 'pivotar', texto: 'Girar o pivotar sobre esa pierna' },
            { id: 'de_pie', texto: 'Estar de pie con la rodilla estirada del todo' }
          ] },
        { id: 'reposo', tipo: 'unica', texto: '¿Le duele también estando quieto, sin hacer nada?', opciones: SNNS }
      ]
    },
    {
      titulo: 'Lo que nota en la rodilla',
      items: [
        { id: 'nota', tipo: 'matriz', texto: '¿Nota alguna de estas cosas?', ayuda: MATRIZ_AYUDA, opciones: SNN,
          filas: [
            { id: 'trabada', texto: 'Se queda trabada y no la puede estirar o doblar' },
            { id: 'engancha', texto: 'Se engancha un momento al moverla y luego sigue' },
            { id: 'falla', texto: 'Le falla o cede, como si se doblara sola' },
            { id: 'rotula', texto: 'La rótula se le sale de su sitio' },
            { id: 'miedo_girar', texto: 'Evita girar sobre esa pierna por miedo a que falle' },
            { id: 'crujidos', texto: 'Crujidos, chasquidos o resaltes al moverla' },
            { id: 'detras', texto: 'Hinchazón o tirantez por detrás de la rodilla' },
            { id: 'hormigueo', texto: 'Hormigueo, quemazón o piel dormida en la pierna' }
          ] },
        { id: 'rigidez', tipo: 'unica', texto: 'Por la mañana, ¿está rígido al levantarse?',
          opciones: ['No', 'Sí, menos de media hora', 'Sí, media hora o más', NS] }
      ]
    },
    {
      titulo: 'La rodilla y el tobillo',
      items: [
        { id: 'tobillo', tipo: 'unica', texto: '¿Le duele la rodilla al mover el tobillo? (fíjese solo en la rodilla)', opciones: SNNS }
      ]
    },
    {
      titulo: 'Trabajo, deporte y ejercicio',
      items: [
        { id: 'actividad', tipo: 'multi', texto: 'En el trabajo o en su tiempo libre, ¿hace a menudo alguna de estas cosas? (puede marcar varias)',
          opciones: ['Trabajar de rodillas o en cuclillas', 'Correr', 'Bicicleta', 'Deportes con saltos', 'Ninguna', NS] }
      ]
    },
    {
      titulo: 'Si hace deporte o ejercicio',
      intro: 'Si NO hace deporte ni ejercicio de forma habitual, salte el resto: ha terminado.',
      items: [
        { id: 'cambios', tipo: 'multi', texto: 'En los últimos meses, ¿ha cambiado algo? (puede marcar varias)',
          opciones: ['Entreno más días u horas', 'Entreno más fuerte', 'Empecé o volví hace poco', 'Cambié de calzado',
            'Cambié la posición en la bicicleta', 'No ha cambiado nada', NS] },
        { id: 'dolor_deporte', tipo: 'multi', texto: 'Cuando hace deporte, el dolor… (puede marcar varias)',
          opciones: ['Se me pasa al calentar', 'Acaba obligándome a bajar el ritmo o a parar', NS] }
      ]
    }
  ],
  // Enlaces según los comentarios de la fuente (guía clínica de rodilla, ap. 3,
  // 5 y 6): mecanismo (LCA, LCM, menisco, LCP, LLE/EPL, rótula), cronología del
  // derrame, rigidez <30 min (artrosis), provocadores por localización,
  // síntomas mecánicos, tobillo (tibioperonea) y carga deportiva.
  pistas: {
    ro_step1:  ['c:desencadenante', 'c:inicio', 'r:que_paso', 'r:chasquido', 'r:pudo_seguir', 'r:hinchazon'],
    ro_step1b: ['r:que_paso', 'r:pudo_seguir'],
    ro_step2:  ['r:rigidez', 'r:provoca.caminar', 'r:provoca.escaleras'],
    ro_step2b: ['c:desencadenante'],
    ro_step2c: ['r:nota.hormigueo'],
    ro_step3:  ['r:provoca.cuclillas', 'r:provoca.escaleras', 'r:provoca.sentado', 'r:provoca.saltar', 'r:provoca.correr',
      'r:reposo', 'r:actividad', 'r:cambios', 'r:dolor_deporte'],
    ro_step4:  ['r:provoca.arrodillarse', 'r:provoca.de_pie', 'r:provoca.saltar', 'r:nota.trabada', 'r:nota.rotula',
      'r:nota.miedo_girar', 'r:actividad'],
    ro_step5:  ['r:provoca.pivotar', 'r:provoca.sentado', 'r:nota.trabada', 'r:nota.engancha', 'r:nota.crujidos', 'r:rigidez'],
    ro_step6:  ['r:tobillo', 'r:nota.crujidos', 'r:nota.hormigueo', 'r:nota.engancha'],
    ro_step7:  ['r:nota.detras', 'r:provoca.arrodillarse', 'r:nota.hormigueo']
  }
};
