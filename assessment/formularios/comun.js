// ============================================================
// Formulario previo a la primera visita · CARA 1 (común a todas las regiones)
// Texto literal de guia-de-consulta/tools/plantilla_formularios.js (cara 1).
// Solo datos: lo pinta formulario.js. Los campos de cabecera del papel
// (nombre, fecha, edad) no se repiten: ya están en la fase 1.
//
// Tipos de pregunta:
//   unica  { opciones, detalle? }   una sola opción; `detalle: { opcion, etiqueta }`
//                                   abre un texto libre al marcar esa opción
//   multi  { opciones, detalle? }   varias opciones
//   escala { min, max, extremos, estiloSeveridad? }   0–10 + «No sabría decir»;
//                                   `estiloSeveridad: true` la pinta como la escala
//                                   de dolor coloreada (verde→rojo) de fase 3, en vez
//                                   de la fila plana de botones — solo para escalas
//                                   que sí son de intensidad de dolor/severidad
//   matriz { filas: [{id, texto}], opciones }   una respuesta por fila
//   texto  { lineas?, chips? }      texto libre (teclado o micro)
//   mostrarSi: { id, valores }      solo se muestra si la pregunta `id`
//                                   (de este mismo formulario) tiene uno de esos valores
// ============================================================
const NS = 'No sabría decir';

export default {
  id: 'comun',
  titulo: 'Antes de su primera visita',
  intro: 'Si algo no lo sabe, marque «No sabría decir»: esa respuesta también sirve.',
  secciones: [
    {
      titulo: '1 · Cómo empezó',
      items: [
        { id: 'desde_cuando', tipo: 'texto', texto: '¿Desde cuándo le pasa?', ayuda: 'Fecha aproximada, o «hace X semanas»', lineas: 1 },
        { id: 'desencadenante', tipo: 'unica', texto: '¿Hubo algo concreto que lo desencadenara? — un golpe, una caída, un esfuerzo, un gesto',
          opciones: ['Sí', 'No, empezó poco a poco sin causa clara', NS], detalle: { opcion: 'Sí', etiqueta: 'Y fue…' } },
        { id: 'inicio', tipo: 'unica', texto: '¿Apareció de golpe o poco a poco?', opciones: ['De golpe', 'Poco a poco', NS] },
        { id: 'primera_vez', tipo: 'unica', texto: '¿Es la primera vez que le pasa?', opciones: ['Sí', 'No, ya me había pasado antes', NS] },
        { id: 'episodio_previo', tipo: 'texto', texto: 'Si ya le había pasado: ¿cuándo fue la última vez y cuánto le duró?', lineas: 1,
          mostrarSi: { id: 'primera_vez', valores: ['No, ya me había pasado antes'] } }
      ]
    },
    {
      titulo: '2 · Desde entonces',
      items: [
        { id: 'evolucion', tipo: 'unica', texto: 'Desde que empezó, el dolor va…', opciones: ['A mejor', 'Igual', 'A peor', 'Va y viene', NS] }
      ]
    },
    {
      titulo: '3 · A lo largo del día',
      items: [
        { id: 'peor_momento_dia', tipo: 'multi', texto: '¿Cuándo está peor? (puede marcar varias)',
          opciones: ['Al levantarme', 'Durante el día, según lo que haga', 'Al final del día', 'Por la noche', NS] },
        { id: 'despierta', tipo: 'unica', texto: '¿Le despierta por la noche?', opciones: ['No', 'Sí', NS] },
        { id: 'despierta_postura', tipo: 'unica', texto: 'Si le despierta: al cambiar de postura, ¿se le calma?',
          opciones: ['Sí, cambiando de postura mejora', 'No, sigue igual haga lo que haga', NS],
          mostrarSi: { id: 'despierta', valores: ['Sí'] } },
        { id: 'dolor_max_semana', tipo: 'escala', texto: 'Pensando en la última semana, ¿cuánto le ha dolido en el peor momento?',
          min: 0, max: 10, extremos: ['Nada', 'El peor que pueda imaginar'], estiloSeveridad: true },
        { id: 'tiempo_calmarse', tipo: 'unica', texto: 'Cuando algo le empeora el dolor, ¿cuánto tarda en volver a como estaba antes?',
          opciones: ['Se pasa enseguida', 'Unos minutos', 'Unas horas', 'Me dura el resto del día o más', NS] }
      ]
    },
    {
      titulo: '4 · Qué le cuesta hacer',
      intro: 'Su trabajo, un deporte, dormir, conducir, jugar con sus hijos: lo que sea importante para usted. Serán las tres cosas que mediremos en cada revisión.',
      items: [
        { id: 'actividad_1', tipo: 'texto', texto: '¿Qué ha dejado de hacer, o hace peor, por este problema? — 1ª cosa', lineas: 1,
          chips: ['Dormir', 'Trabajar', 'Conducir', 'Caminar', 'Estar sentado', 'Hacer deporte'] },
        { id: 'actividad_2', tipo: 'texto', texto: '¿Qué ha dejado de hacer, o hace peor, por este problema? — 2ª cosa', lineas: 1 },
        { id: 'actividad_3', tipo: 'texto', texto: '¿Qué ha dejado de hacer, o hace peor, por este problema? — 3ª cosa', lineas: 1 }
      ]
    },
    {
      titulo: '5 · Qué ha probado ya',
      items: [
        { id: 'probado', tipo: 'multi', texto: '¿Qué ha probado ya?',
          opciones: ['Nada todavía', 'Reposo', 'Calor o frío', 'Medicación', 'Fisioterapia', 'Ejercicio', 'Otros'] },
        { id: 'probado_sirvio', tipo: 'texto', texto: '¿Le sirvió de algo?', lineas: 1 }
      ]
    },
    {
      titulo: '6 · Su salud en general',
      items: [
        { id: 'enfermedades', tipo: 'texto', texto: 'Enfermedades importantes que tenga o haya tenido', ayuda: 'Todas, aunque le parezca que no tienen relación con esto', lineas: 2 },
        { id: 'operaciones', tipo: 'texto', texto: 'Operaciones', ayuda: 'Y aproximadamente cuándo', lineas: 1 },
        { id: 'medicacion', tipo: 'texto', texto: 'Medicación que toma ahora', ayuda: 'Incluidos parches, inyecciones y lo que compra sin receta', lineas: 2 },
        { id: 'en_persona', tipo: 'multi', texto: '', opciones: ['Hay algo relacionado con esta molestia que prefiero comentarle en persona.'] }
      ]
    }
  ]
};
