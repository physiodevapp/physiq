// ============================================================
// PhysiQ-Assessment · DATA.js
// Datos clínicos extraídos del documento-guía Fisio_4MVP
//
// El contenido de cada región vive en data/<region>.js (cribado, árbol CIF e
// hipótesis de esa región) y los sistemas compartidos en data/comun.js. Este
// archivo los reúne y exporta la MISMA forma de siempre, así que ningún
// consumidor (app.js, phase4.js, phase4b.js, tests) cambia.
// Para añadir una región: crear data/<region>.js y añadirla a REGIONES.
// ============================================================
import * as hombro from './data/hombro.js';
import * as cadera from './data/cadera.js';
import * as cervical from './data/cervical.js';
import * as lumbar from './data/lumbar.js';
import * as rodilla from './data/rodilla.js';
import * as codo from './data/codo.js';
import * as tobillo_pie from './data/tobillo_pie.js';

// Orden = orden de las claves de SYSTEMIC_SCREENING / CIF_TREES / HYPOTHESES
const REGIONES = { hombro, cadera, cervical, lumbar, rodilla, codo, tobillo_pie };

// Fase 2 — cribado sistémico por región (esquema: ver CLAUDE.md, "Clinical Data Structure")
export const SYSTEMIC_SCREENING = Object.fromEntries(
  Object.entries(REGIONES).map(([r, m]) => [r, m.screening])
);

// ============================================================
// CIF TREES — Algoritmos de decisión por región
// ============================================================
//
// Esquema (motor: initCIFTree/renderStep/selectTreeOption/pruneTreeFrom/
// rebuildHypotheses en phase4.js — validado en tests/unit.js, sección
// "CIF_TREES data integrity"):
//
// CIF_TREES = {
//   [region]: {                     // clave = una de las 7 regiones válidas
//                                    // (hombro|cadera|cervical|lumbar|rodilla|codo|tobillo_pie)
//     title: string,                // título mostrado en #phase4Title
//     steps: [                      // orden = orden secuencial por defecto
//       {
//         id: string,                // único dentro del árbol (id del <div> renderizado)
//         tag: string,                // etiqueta corta ("Paso N — ...")
//         question: string,           // texto de la pregunta
//         options: [
//           {
//             label: string,          // texto del botón
//             value: string,          // valor persistido en state.treeAnswers[step.id]
//             next: string | null,    // id de otro step del MISMO árbol a renderizar
//                                      // a continuación; si es null/omitido, el motor
//                                      // renderiza steps[idx+1] (siguiente en el array)
//                                      // cuando existe — la mayoría de opciones lo dejan
//                                      // así y avanzan siempre de forma secuencial, no
//                                      // solo la rama "no". `next` explícito solo hace
//                                      // falta para SALTAR a un step que no es el
//                                      // siguiente del array.
//             hypothesis: string[]    // ids de HYPOTHESES que esta opción activa
//                                      // (deben existir y pertenecer a esta misma región)
//           }, ...
//         ]
//       }, ...
//     ]
//   }
// }
//
export const CIF_TREES = Object.fromEntries(
  Object.entries(REGIONES).map(([r, m]) => [r, m.tree])
);

// ============================================================
// HYPOTHESES — Cuadros clínicos con tests y datos diagnósticos
// ============================================================
//
// Esquema (motor: buildHypothesisCards/calcLRScore/recalcHypScore en
// phase4b.js — validado en tests/unit.js, sección "HYPOTHESES data integrity"):
//
// HYPOTHESES = {
//   [id]: {                    // clave = HYPOTHESES[id].id (deben coincidir)
//     id: string,               // debe ser igual a la clave del objeto
//     region: string,           // una de las 6 regiones válidas — debe coincidir
//                                // con la región de todo CIF_TREES[region] que
//                                // referencie este id en un option.hypothesis
//     num: string,               // numeral visual ('①', '②', ...), solo decorativo
//     name: string,               // nombre del cuadro clínico
//     prom: string,               // PROM recomendado (texto libre)
//     dosis: string,              // pauta de tratamiento (texto libre); '' = a criterio del clínico
//     dosisFuente?: string,       // cita de la pauta (guía o ensayo), se muestra bajo la dosis en fase 5; solo con dosis
//     pronostico?: { horizonte, derivacion, fuente },   // se muestra en fase 5
//     clusters?: { [id]: { nombre, umbralPos, lr_pos, umbralNeg, lr_neg, sn?, sp?, fuente } },
//     tests: [
//       {
//         name: string,           // nombre del test ortopédico
//         sn: string | null,      // sensibilidad (texto, p.ej. '76%'), null si no hay dato
//         sp: string | null,      // especificidad, null si no hay dato
//         lr_pos: string | null,  // LR+ publicada ('3.7' o rango '2.9–4.9'), o null.
//                                  // SIN valores por defecto: si falta, se calcula de
//                                  // sn/sp numéricos o el test es hallazgo clínico
//                                  // (reglas en CLAUDE.md, "Phase 4b scoring")
//         lr_neg: string | null,  // LR− — igual que lr_pos
//         criterio: string,       // criterio de positividad (texto libre)
//         fuente?: string,        // cita corta del estudio de las cifras
//         tipo?: 'pronostico',    // regla pronóstica: nunca puntúa
//         cluster?: string,       // id en hyp.clusters: puntúa solo la regla
//         absorbe?: number[],     // índices de tests que este test compuesto contiene
//         noData?: boolean        // opcional, solo decorativo (aviso "datos limitados")
//       }, ...
//     ]                          // no puede estar vacío. Tests nuevos, SIEMPRE al
//                                // final: state.testResults guarda resultados por índice
//   }
// }
//
// Los ids son globales: tests/unit.js comprueba que ninguna región repite uno
// de otra (aquí una clave repetida se sobrescribiría sin aviso).
// Texto fijo de las hipótesis de derivación (fracturas, roturas, gota…): la fase 5 lo reconoce.
export { DOSIS_DERIVAR } from './data/comun.js';

export const HYPOTHESES = Object.assign({}, ...Object.values(REGIONES).map(m => m.hypotheses));


export const NRS_LABELS = ['Sin dolor','Dolor muy leve','Dolor leve','Dolor leve-moderado','Dolor moderado','Dolor moderado','Dolor moderado-intenso','Dolor intenso','Dolor intenso','Dolor muy intenso','Dolor máximo'];
export const NRS_CLASSES = ['nrs-0','nrs-1','nrs-2','nrs-3','nrs-4','nrs-5','nrs-6','nrs-7','nrs-8','nrs-9','nrs-10'];

export const PHASE_DEFS = [
  { n: 1,    label: 'Triage y Cabecera',       short: 'Fase 1' },
  { n: 2,    label: 'Cribado Sistémico',        short: 'Fase 2' },
  { n: 3,    label: 'SINSS',                    short: 'Fase 3' },
  { n: 4,    label: 'Algoritmo CIF',            short: 'Fase 4' },
  { n: '4b', label: 'Confirmación de Hipótesis',short: 'Fase 4b' },
  { n: 5,    label: 'Resultados',               short: 'Fase 5' },
];

// Frases clínicas predefinidas para los chips de entrada rápida en campos de texto libre.
// Clave = id del campo (#id del textarea). Tocar un chip añade la frase al campo; sigue siendo editable.
export const QUICK_PHRASES = {
  motivoConsulta: [
    'Dolor de inicio traumático tras caída',
    'Dolor de inicio insidioso y progresivo',
    'Dolor post-quirúrgico',
    'Limitación funcional para actividades cotidianas',
    'Dolor nocturno que interrumpe el sueño',
    'Episodio recurrente, ya tratado previamente'
  ],
  signoComparable: [
    'Reproduce dolor en flexión activa',
    'Reproduce dolor en rotación externa resistida',
    'Reproduce dolor al cargar peso',
    'Reproduce dolor en el rango final del movimiento',
    'Reproduce dolor con la palpación local'
  ],
  planVariableControl: [
    'Parar si el dolor supera 4/10 durante el ejercicio',
    'Parar si aparece hormigueo o entumecimiento',
    'Parar si aumenta la rigidez tras el ejercicio',
    'Parar ante fatiga excesiva o pérdida de forma'
  ],
  planVentana: [
    'El dolor basal debe volver a su nivel en 24h',
    'Si el dolor aumenta más allá de 24h, reducir dosis',
    'Sin aumento de dolor a las 24h: progresar dosis',
    'Registrar dolor a las 24h antes de la siguiente sesión'
  ],
  planAnclaje: [
    'Vincular a la rutina matutina (café, ducha)',
    'Vincular a un descanso durante la jornada laboral',
    'Vincular a la rutina antes de dormir',
    'Vincular a un desplazamiento habitual (coche, transporte)'
  ]
};
export const PHASE_NAV_IDS = { 1:'nav1', 2:'nav2', 3:'nav3', 4:'nav4', '4b':'nav4b', 5:'nav5' };
