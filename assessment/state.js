// ============================================================
// PhysiQ-Assessment · STATE.js
// Estado global de la sesión de valoración
// ============================================================

const state = {
  currentPhase: 1,
  // Tipo de consulta: 'completo' (por defecto) | 'breve' (aseguradora, 10 min).
  // Sobrevive a «Reiniciar» igual que el nombre del paciente. Ver docs/modo-breve.md.
  modo: 'completo',
  // Navegación
  maxVisitedIdx: 0,       // índice más alto visitado en la sesión
  regionChanged: false,   // región cambiada sin haber rehecho el árbol
  treeModified: false,    // árbol modificado sin haber rehecho 4b
  // Fase 1
  patient: '',
  motivoConsulta: '',
  edadPaciente: null,     // años; input #edadPaciente — usado por criterioCompuesto (fase 2)
  signosVitales: { fc: null, fr: null, spo2: null, tas: null, tad: null },
  antropometria: { talla: null, peso: null },  // imc se calcula al vuelo, no se persiste (ver calcImc en app.js)
  mecanismo: '',
  // Tarjeta «Cirugía» (solo se usa con mecanismo Post-quirúrgico; ver
  // docs/posquirurgico.md y lib/posquirurgico.js). Las semanas desde `fecha`
  // se calculan al mostrarlas; `semanasAprox` solo cuando no hay fecha.
  cirugia: { intervencion: '', fecha: '', semanasAprox: null, protocolo: '', restricciones: '', complicaciones: [], complicacionOtra: '' },
  cronologia: '',
  banderasRojas: { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' },
  riesgoPsico: '',
  psico_miedo: '', psico_autoef: '', psico_emocional: '',
  // Fase 2
  region: '',
  lado: '',               // 'Derecho' | 'Izquierdo' | 'Bilateral' | 'Central' (solo cervical/lumbar) | '' — opcional
  sistemicoAnswers: {},
  sistemicoAlerta: false,
  sistemicoBreve: {},     // solo modo breve: { [sisId]: 'SI'|'NO' } — respuesta del embudo por sistema
  // Fase 3
  severidad: null,
  irritabilidad: { dolor: 'Baja (≤3/10)', reposo: 'Ausente', movimiento: 'Al final del rango con SP', discapacidad: 'Mínima', tolerancia: 'Alta' },
  irritabilidadNivel: 'Baja',
  irritabilidadDirecta: false,  // true si el nivel se eligió directamente (modo breve) y no con la matriz
  naturaleza: '',
  estabilidad: '',
  signoComparable: '',
  // Fase 4
  activeHypotheses: [],
  treeAnswers: {},
  currentStep: null,
  stepsCompleted: [],
  // Fase 4b
  testResults: {},
  hypothesisScores: {},
  // «Ya diagnosticada y tratada»: { [hypId | stepId]: true } — hipótesis con
  // DOSIS_DERIVAR y derivaciones del árbol con `resoluble` que no se derivan.
  derivacionResuelta: {},
  // Fase 5
  resultsBuilt: false,
  // Notas del Plan
  planNotes: {
    variableControl: '',
    ventanaRecuperacion: '',
    anclajeHabito: ''
  },
  // Formulario previo (formulario.js): { comun: {id: valor}, regiones: { lumbar: {...} } }
  formularioPrevio: { comun: {}, regiones: {} },
  // Informe narrativo con IA (informe-ia.js, solo standalone):
  // { texto, transcripcion, fecha, conAudio, huella, datos: { p, d, r } } | null.
  // Nunca entra en buildPhysiQPayload() ni en 📋 Notas / 📄 Informe.
  informeIA: null,
  rom: null   // payload importado desde PhysiQ-Motion vía ?rom=
};

// Dozens of inline onclick/oninput attributes across index.html and
// dynamically-generated HTML reference `state` directly (e.g.
// oninput="state.motivoConsulta=this.value"). Those resolve only against the
// global scope, never a module's private scope, so `state` must also live on
// `window` — the same object instance every module imports.
window.state = state;

export { state };
