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
  sexo: '',               // 'Mujer' | 'Hombre' | '' — opcional (#sexo); solo lo lee el informe con IA
  signosVitales: { fc: null, fr: null, spo2: null, tas: null, tad: null },
  antropometria: { talla: null, peso: null },  // imc se calcula al vuelo, no se persiste (ver calcImc en app.js)
  mecanismo: '',
  // Tarjeta «Cirugía» (solo se usa con mecanismo Post-quirúrgico; ver
  // docs/posquirurgico.md y lib/posquirurgico.js). Las semanas desde `fecha`
  // se calculan al mostrarlas; `semanasAprox` solo cuando no hay fecha.
  cirugia: { intervencion: '', fecha: '', semanasAprox: null, protocolo: '', restricciones: '', complicaciones: [], complicacionOtra: '' },
  // Condición especial «Hipermovilidad / Ehlers-Danlos» (Fase P, docs/hipermovilidad.md,
  // lib/hipermovilidad.js). estado: '' (no consta) | 'diagnosticada' | 'sospecha';
  // subtipo: '' | 'hipermovil' | 'vascular' | 'otro' | 'ns'; beighton: null (sin hacer)
  // o { [maniobra_lado]: true }; cuestionario: { cq1…cq5: 'SI'|'NO' }.
  hipermovilidad: { estado: '', subtipo: '', beighton: null, cuestionario: {} },
  // Condición especial «Disautonomía / POTS» (Fase P, docs/pots.md, lib/disautonomia.js).
  // estado: '' (no consta) | 'diagnosticada' | 'sospecha'; tipo: '' | 'pots' | 'ho' | 'otra';
  // sospecha: { io1…io3: 'SI'|'NO' }; bipedestacion: null (sin hacer) o
  // { prep: { reposo, sala, vejiga }, tumbado: { fc, tas, tad }, m1…m10: { fc, tas, tad, sintomas } }.
  disautonomia: { estado: '', tipo: '', sospecha: {}, bipedestacion: null },
  // Condición especial «Lupus (LES)» (Fase P, docs/lupus.md, lib/lupus.js).
  // estado: '' (no consta) | 'diagnosticado' | 'sospecha'; con «Diagnosticado»:
  // corticoides '' | 'no' | 'b' (≤5 mg/día) | 'm' (>5–20) | 'a' (>20) | 'ns';
  // dosisAltas e inmunosupresores '' | 'SI' | 'NO' | 'NS'; antifosfolipidos
  // '' | 'no' | 'apl' | 'saf' | 'ns'; osteonecrosis y raynaud (casillas; el
  // anticoagulante o antiagregante, en la tarjeta propia); actividad '' | 'estable' | 'brote' | 'peor' | 'ns'; con
  // «Sospecha», rasgos: { lr1…lr6: 'SI'|'NO' }.
  lupus: { estado: '', corticoides: '', dosisAltas: '', inmunosupresores: '', antifosfolipidos: '',
    osteonecrosis: false, raynaud: false, actividad: '', rasgos: {} },
  // Condición especial «Trastorno mastocitario o anafilaxia» (Fase P,
  // docs/mastocitaria.md, lib/mastocitos.js). estado: '' (no consta) |
  // 'diagnosticado' (sin «Sospecha»); tipo '' | 'mastocitosis' | 'sama' | 'otro' |
  // 'soloAnafilaxia' | 'ns'; anafilaxia '' | 'SI' | 'NO' | 'NS'; autoinyector
  // '' | 'SI' | 'NO' | 'sinReceta'; desencadenantes { ejercicio, calor, … : true };
  // otro: texto libre.
  mastocitos: { estado: '', tipo: '', anafilaxia: '', autoinyector: '', desencadenantes: {}, otro: '' },
  // Condición especial «Osteoporosis o fragilidad ósea» (Fase P,
  // docs/osteoporosis.md, lib/osteoporosis.js). estado: '' (no consta) |
  // 'diagnosticada' | 'sospecha'; causa '' | 'edad' | 'corticoides' | 'plo' |
  // 'otra' | 'ns'; vertebrales '' | '0' | '1' | '2' | 'ns'; reciente y otras
  // (casillas); tratamiento '' | 'no' | 'antirresortivo' | 'otro' | 'ns';
  // corticoides '' | 'no' | 'b' (< 7,5 mg/día) | 'a' (≥ 7,5) | 'ns'; con
  // «Sospecha», factores { of1…of6: 'SI'|'NO' }; caidas { n: '' | '0' | '1' | '2',
  // lesion, suelo, conciencia, fragilidad } (los dos estados).
  osteoporosis: { estado: '', causa: '', vertebrales: '', reciente: false, otras: false, tratamiento: '', corticoides: '',
    factores: {}, caidas: { n: '', lesion: false, suelo: false, conciencia: false, fragilidad: false } },
  // Tarjeta «Embarazo o posparto» (Fase P, docs/embarazo-posparto.md): estado
  // '' | 'embarazada' | 'posparto'; con «Embarazada», semanas (de gestación) y
  // familiar '' | 'SI' | 'NO' | 'NS'; con «Posparto», fecha (AAAA-MM-DD) o
  // semanasAprox, parto '' | 'vaginal' | 'instrumental' | 'cesarea' | 'ns',
  // esfinter y occipitoposterior (casillas), lactancia '' | 'SI' | 'NO'; en los
  // dos, animo { w1, w2 } y suelo { sp1…sp3 }: 'SI'|'NO' (bloques de la fase 2).
  embarazo: { estado: '', semanas: null, familiar: '', fecha: '', semanasAprox: null, parto: '',
    esfinter: false, occipitoposterior: false, lactancia: '', animo: {}, suelo: {} },
  // Tarjeta «Paciente anticoagulado o antiagregado» (Fase P, docs/anticoagulado.md,
  // lib/anticoagulado.js): estado '' (no consta) | 'toma'; toma: subconjunto de
  // ['vk', 'do', 'hp', 'as', 'oa', 'ns'] (antivitamina K, anticoagulante directo,
  // heparina, aspirina, otro antiagregante, no lo sabe).
  anticoagulado: { estado: '', toma: [] },
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
  // Matriz sin preselección ('' = sin contestar; data/irritabilidad.js,
  // decisiones 99–101 de docs/plan-tratamiento.md). `discapacidad` es el
  // impacto en las actividades (gravedad): no cuenta para el nivel. Las sesiones
  // antiguas traen además `dolor` y no traen `calma`; nada lee `dolor`.
  irritabilidad: { reposo: '', movimiento: '', tolerancia: '', calma: '', discapacidad: '' },
  irritabilidadNivel: null,  // 'Baja'|'Moderada'|'Alta'|null (no registrada)
  irritabilidadDirecta: false,  // true si el nivel se eligió directamente (modo breve) y no con la matriz
  // Tarjeta «Síntomas» (sintomas.js, lib/sintomas.js; docs/sintomas-multiples.md).
  // P1: dónde y cómo es el dolor principal; su NRS e irritabilidad son los de
  // arriba. P2–P4: hasta 3 secundarios con su propio NRS, irritabilidad directa
  // y relación con P1. Misma forma en los dos: sintomaVacio().
  sintomaPrincipal: { zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' },
  sintomasSecundarios: [],
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
  // Fase 6 «Plan de tratamiento» (plan.js, opcional): lo que elige o escribe el
  // fisio; el esqueleto se recalcula del estado. Nunca entra en el payload.
  // { hipotesis: [id, id?], nivel: 'A'|'B'|'C', frecuencia: 'A'|'B',
  //   sesion: 'primera'|'siguiente', gravedad?: string, irritabilidad?: string,
  //   notas: { sesion, mes, domiciliario, parar },
  //   duraciones: { [bloqueId]: minutos },
  //   ia?: { texto, fecha, nivel, escalon, frecuencia, frecuenciaNombre, conTranscripcion,
  //          prompt, version, huella, revisados } | null — «✨ Detallar con IA»
  //          (plan-ia.js, solo standalone); tampoco va al .json exportado } | null
  planTratamiento: null,
  // Formulario previo (formulario.js): { comun: {id: valor}, regiones: { lumbar: {...} } }
  formularioPrevio: { comun: {}, regiones: {} },
  // Calculadora de cuestionarios (lib/cuestionarios.js): { [id]: { r: { [ítem]: valor } } }.
  // Va al payload (`cu`), a 📋 Notas y al informe con IA, no al 📄 Informe.
  cuestionarios: {},
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
