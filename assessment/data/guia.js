// ============================================================
// Modo guía con grabadora externa (docs/modo-guia.md): textos.
// Solo datos. Lo pinta app.js; la lógica pura está en lib/modo-guia.js.
// ============================================================

// Campos de texto de la fase 1 y 3 que en modo guía no se teclean: en su lugar
// va la frase para decir en voz alta (decisión 4). `id` = el <textarea>; la
// respuesta sale solo del audio. `ancla`: además se sugiere decir el resultado
// en voz alta (decisión 5). Las frases las revisa el fisio (paso 3 del plan) y se dicen de «tú» al paciente (decisión del fisio, 2026-10).
export const VERBALES = {
  motivoConsulta: { frase: '¿Qué te trae por aquí? ¿Qué te pasa y desde cuándo?' },
  signoComparable: {
    frase: 'Dilo en voz alta cuando lo encuentres: el movimiento que reproduce sus síntomas.',
    ancla: 'Ej.: «Flexión de hombro a 100º con dolor 6 sobre 10»'
  },
  cirIntervencion: { frase: '¿Qué operación te hicieron y cuándo?' },
  cirRestricciones: { frase: '¿Qué restricciones o protocolo te ha dado el cirujano?' }
};

export const TEXTOS_GUIA = {
  registroTitulo: 'Cómo se registra',
  registroNota: 'Con «Guía», grabas la consulta con una grabadora externa y la app solo recoge lo que mueve la lógica: sin teclado y sin cajas de texto. Lo que no marques cuenta como «no preguntado», nunca como «NO».',
  teclado: 'Teclado',
  guia: 'Guía (grabadora)',
  preguntado: 'Preguntado',
  anclaTest: 'Dilo en voz alta al marcarlo',
  cambioAGuia: 'Las respuestas «NO» que no marcaste a propósito se quedan sin responder: no se sabe si se preguntaron. Las respuestas «SÍ» se mantienen.',
  cambioATeclado: 'Las preguntas sin responder pasarán a «NO», como en el modo con teclado.'
};
