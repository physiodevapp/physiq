// ============================================================
// Formulario previo a la primera visita · CARA 1 (común a todas las regiones)
// Texto literal de guia-de-consulta/tools/plantilla_formularios.js (cara 1).
// Solo datos: lo pinta formulario.js. Los campos de cabecera del papel
// (nombre, fecha, edad) no se repiten: ya están en la fase 1. Tampoco la
// casilla final del papel «Hay algo relacionado con esta molestia que prefiero
// comentarle en persona»: aquí el fisio rellena el formulario siempre con el
// paciente delante, así que esa conversación ya está ocurriendo (y marcada
// acababa en las notas y en physiq-report como una confidencia sin contenido).
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
//   matriz { filas: [{id, texto, iaTexto?}], opciones }   una respuesta por fila;
//                                   `iaTexto`: nombre clínico de la fila solo para el
//                                   informe con IA, cuando el texto del papel es ambiguo
//   texto  { lineas?, chips? }      texto libre (teclado o micro)
//   mostrarSi: { id, valores }      solo se muestra si la pregunta `id`
//                                   (de este mismo formulario) tiene uno de esos valores
//   informe: 'Etiqueta'             la respuesta sale en el 📄 Informe (paciente/médico)
//                                   como «Etiqueta: respuesta»; items seguidos con la
//                                   misma etiqueta se unen en una línea. `antecedente: true`
//                                   la manda al bloque de antecedentes. Nunca en matriz,
//                                   ni en nada que el paciente quiera reservarse
//   ia: 'historia' | 'sintomas' | 'actividades' | 'contexto'   obligatorio en
//                                   todo item: el grupo con el que llega al informe
//                                   con IA (cada grupo va a su sección: historia,
//                                   Dolor, Limitaciones, Factores personales)
//   pistas: { <campo fase 1>: ['c:<id>'] }   respuestas que se recuerdan encima
//                                   de esa tarjeta de la fase 1 (mecanismo,
//                                   cronologia). Solo recuerdan; nunca la rellenan
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
        { id: 'desde_cuando', tipo: 'texto', ia: 'historia', informe: 'Inicio de los síntomas', texto: '¿Desde cuándo le pasa?', ayuda: 'Fecha aproximada, o «hace X semanas»', lineas: 1 },
        { id: 'desencadenante', tipo: 'unica', ia: 'historia', texto: '¿Hubo algo concreto que lo desencadenara? — un golpe, una caída, un esfuerzo, un gesto',
          opciones: ['Sí', 'No, empezó poco a poco sin causa clara', NS], detalle: { opcion: 'Sí', etiqueta: 'Y fue…' } },
        { id: 'inicio', tipo: 'unica', ia: 'historia', texto: '¿Apareció de golpe o poco a poco?', opciones: ['De golpe', 'Poco a poco', NS] },
        { id: 'primera_vez', tipo: 'unica', ia: 'historia', informe: 'Primer episodio', texto: '¿Es la primera vez que le pasa?', opciones: ['Sí', 'No, ya me había pasado antes', NS] },
        { id: 'episodio_previo', tipo: 'texto', ia: 'historia', informe: 'Episodio previo', texto: 'Si ya le había pasado: ¿cuándo fue la última vez y cuánto le duró?', lineas: 1,
          mostrarSi: { id: 'primera_vez', valores: ['No, ya me había pasado antes'] } }
      ]
    },
    {
      titulo: '2 · Desde entonces',
      items: [
        { id: 'evolucion', tipo: 'unica', ia: 'historia', informe: 'Evolución desde el inicio', texto: 'Desde que empezó, el dolor va…', opciones: ['A mejor', 'Igual', 'A peor', 'Va y viene', NS] }
      ]
    },
    {
      titulo: '3 · A lo largo del día',
      items: [
        { id: 'peor_momento_dia', tipo: 'multi', ia: 'sintomas', texto: '¿Cuándo está peor? (puede marcar varias)',
          opciones: ['Al levantarme', 'Durante el día, según lo que haga', 'Al final del día', 'Por la noche', NS] },
        { id: 'despierta', tipo: 'unica', ia: 'sintomas', informe: 'Le despierta el dolor por la noche', texto: '¿Le despierta por la noche?', opciones: ['No', 'Sí', NS] },
        { id: 'despierta_postura', tipo: 'unica', ia: 'sintomas', informe: 'Al cambiar de postura por la noche', texto: 'Si le despierta: al cambiar de postura, ¿se le calma?',
          opciones: ['Sí, cambiando de postura mejora', 'No, sigue igual haga lo que haga', NS],
          mostrarSi: { id: 'despierta', valores: ['Sí'] } },
        { id: 'dolor_max_semana', tipo: 'escala', ia: 'sintomas', texto: 'Pensando en la última semana, ¿cuánto le ha dolido en el peor momento?',
          min: 0, max: 10, extremos: ['Nada', 'El peor que pueda imaginar'], estiloSeveridad: true },
        { id: 'tiempo_calmarse', tipo: 'unica', ia: 'sintomas', texto: 'Cuando algo le empeora el dolor, ¿cuánto tarda en volver a como estaba antes?',
          opciones: ['Se pasa enseguida', 'Unos minutos', 'Unas horas', 'Me dura el resto del día o más', NS] }
      ]
    },
    {
      titulo: '4 · Qué le cuesta hacer',
      intro: 'Su trabajo, un deporte, dormir, conducir, jugar con sus hijos: lo que sea importante para usted. Serán las tres cosas que mediremos en cada revisión.',
      items: [
        { id: 'actividad_1', tipo: 'texto', ia: 'actividades', informe: 'Actividades limitadas', texto: '¿Qué ha dejado de hacer, o hace peor, por este problema? — 1ª cosa', lineas: 1,
          chips: ['Dormir', 'Trabajar', 'Conducir', 'Caminar', 'Estar sentado', 'Hacer deporte'] },
        { id: 'actividad_2', tipo: 'texto', ia: 'actividades', informe: 'Actividades limitadas', texto: '¿Qué ha dejado de hacer, o hace peor, por este problema? — 2ª cosa', lineas: 1 },
        { id: 'actividad_3', tipo: 'texto', ia: 'actividades', informe: 'Actividades limitadas', texto: '¿Qué ha dejado de hacer, o hace peor, por este problema? — 3ª cosa', lineas: 1 }
      ]
    },
    {
      titulo: '5 · Qué ha probado ya',
      items: [
        { id: 'probado', tipo: 'multi', ia: 'historia', informe: 'Tratamientos ya probados', texto: '¿Qué ha probado ya?',
          opciones: ['Nada todavía', 'Reposo', 'Calor o frío', 'Medicación', 'Fisioterapia', 'Ejercicio', 'Otros'] },
        { id: 'probado_sirvio', tipo: 'texto', ia: 'historia', informe: 'Resultado de lo probado', texto: '¿Le sirvió de algo?', lineas: 1 }
      ]
    },
    {
      titulo: '6 · Su salud en general',
      items: [
        { id: 'enfermedades', tipo: 'texto', ia: 'contexto', informe: 'Enfermedades', antecedente: true, texto: 'Enfermedades importantes que tenga o haya tenido', ayuda: 'Todas, aunque le parezca que no tienen relación con esto', lineas: 2 },
        { id: 'operaciones', tipo: 'texto', ia: 'contexto', informe: 'Operaciones', antecedente: true, texto: 'Operaciones', ayuda: 'Y aproximadamente cuándo', lineas: 1 },
        { id: 'medicacion', tipo: 'texto', ia: 'contexto', informe: 'Medicación actual', antecedente: true, texto: 'Medicación que toma ahora', ayuda: 'Incluidos parches, inyecciones y lo que compra sin receta', lineas: 2 }
      ]
    }
  ],
  pistas: {
    mecanismo: ['c:desencadenante', 'c:inicio', 'c:operaciones'],
    cronologia: ['c:desde_cuando', 'c:evolucion']
  }
};
