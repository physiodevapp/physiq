// Navegación del árbol CIF sin estado ni DOM: la usa phase4.js (que la
// reexporta), la guía de consulta (guia.js) y los esquemas (docs/esquemas).

// Resuelve a qué step(s) apunta una opción: el step explícito (`next`) si lo
// tiene, o el siguiente step del array si no — el fallback posicional
// documentado en el esquema de CIF_TREES sobre data.js. Pura: no toca DOM ni
// state, así que es testeable por separado (tests/unit.js, "CIF tree
// navigation resolution") tanto con árboles reales como con el árbol ficticio
// del motor. Deliberadamente NO decide si ese step ya está renderizado/
// respondido — eso varía entre selectTreeOption (mira el DOM) y
// restoreCIFTree (mira state.treeAnswers), así que se queda en cada llamador.
export function resolveOptionTargets(tree, stepIdx, opt) {
  const targets = [];
  if (opt.next) {
    const explicitNext = tree.steps.find(s => s.id === opt.next);
    if (explicitNext) targets.push(explicitNext);
  }
  if (!opt.next && stepIdx + 1 < tree.steps.length) {
    const sequentialNext = tree.steps[stepIdx + 1];
    if (!targets.some(s => s.id === sequentialNext.id)) targets.push(sequentialNext);
  }
  return targets;
}

// ¿Está el árbol terminado? Recorre desde el primer paso siguiendo las
// respuestas guardadas: terminado si llega a una respuesta sin paso siguiente;
// no, si encuentra un paso sin responder. Lo usa la fase 6 para distinguir
// «sin hipótesis porque falta el árbol» de «el árbol terminó sin ninguna».
export function arbolCompleto(tree, answers = {}) {
  let idx = 0;
  for (let guarda = 0; guarda <= tree.steps.length && idx >= 0; guarda++) {
    const step = tree.steps[idx];
    const opt = step.options.find(o => o.value === answers[step.id]);
    if (!opt) return false;
    const sig = resolveOptionTargets(tree, idx, opt)[0];
    if (!sig) return true;
    idx = tree.steps.indexOf(sig);
  }
  return false;
}
