// ============================================================
// PhysiQ-Assessment · PHASE4.JS
// Algoritmo CIF — árbol de decisión clínica
// ============================================================
import { CIF_TREES, HYPOTHESES } from './data.js';
import { state } from './state.js';
import { saveSession, showConfirmBanner, paintNav } from './app.js';

// Derivaciones médicas que piden las respuestas del árbol (`derivacion` en una
// opción de CIF_TREES): mensajes de las opciones elegidas, en el orden de los
// pasos. Pura sobre state + CIF_TREES, así que la usan también app.js (fase 5,
// 📋 Notas, 📄 Informe, payload `dv`) y tests/unit.js.
// Una opción con `resoluble: true` (hoy codo co_step1 FRACTURA / LUXACIÓN)
// admite «Ya diagnosticada y tratada» (docs/posquirurgico.md, decisión 5):
// marcada (state.derivacionResuelta[stepId]), su derivación no sale en
// ningún sitio.
export function getDerivacionesArbol() {
  const tree = CIF_TREES[state.region];
  if (!tree) return [];
  return tree.steps.flatMap(step => {
    const opt = step.options.find(o => o.value === state.treeAnswers[step.id]);
    if (!opt?.derivacion) return [];
    return opt.resoluble && state.derivacionResuelta?.[step.id] ? [] : [opt.derivacion];
  });
}

// Pinta (o borra) el aviso de derivación bajo un paso según su respuesta actual.
function pintarDerivacionPaso(step) {
  const el = document.getElementById(`deriv_${step.id}`);
  if (!el) return;
  const opt = step.options.find(o => o.value === state.treeAnswers[step.id]);
  if (!opt?.derivacion) { el.innerHTML = ''; return; }
  const resuelta = opt.resoluble && !!state.derivacionResuelta?.[step.id];
  const casilla = opt.resoluble ? `<label class="dx-tratada" style="margin:8px 0 0;">
      <input type="checkbox" ${resuelta ? 'checked' : ''} onchange="toggleDerivacionArbolResuelta('${step.id}', this.checked)">
      <span>Ya diagnosticada y tratada<span class="dx-tratada-ayuda">El médico ya la ha diagnosticado y tratado (p. ej., operada): no se pide derivación.</span></span>
    </label>` : '';
  el.innerHTML = resuelta
    ? `<div class="alert alert-info" style="margin-top:10px;"><span class="alert-icon">🏥</span><div><strong>Ya diagnosticada y tratada:</strong> sin derivación por esta respuesta.</div></div>${casilla}`
    : `<div class="alert alert-danger" style="margin-top:10px;"><span class="alert-icon">🩺</span><div><strong>Derivación médica.</strong> ${opt.derivacion} El árbol continúa, pero la derivación es prioritaria.</div></div>${casilla}`;
}

export function toggleDerivacionArbolResuelta(stepId, valor) {
  const step = CIF_TREES[state.region]?.steps.find(s => s.id === stepId);
  if (!step) return;
  if (!state.derivacionResuelta) state.derivacionResuelta = {};
  if (valor) state.derivacionResuelta[stepId] = true;
  else delete state.derivacionResuelta[stepId];
  pintarDerivacionPaso(step);
  // El aviso de «Árbol completado» repite las derivaciones pendientes
  if (document.getElementById('treeComplete')) showTreeComplete({ sinScroll: true });
  saveSession();
}

const olvidarResueltaPaso = stepId => { if (state.derivacionResuelta) delete state.derivacionResuelta[stepId]; };

export function initCIFTree() {
  if (!state.region) {
    document.getElementById('cifTree').innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><span>Por favor, seleccione una región en la Fase 2 antes de continuar.</span></div>`;
    return;
  }
  const tree = CIF_TREES[state.region];
  document.getElementById('phase4Title').textContent = tree.title;

  // Si ya hay respuestas previas (retroceso desde 4b/5), restaurar el árbol
  const hasExistingAnswers = Object.keys(state.treeAnswers).length > 0;
  if (hasExistingAnswers) {
    restoreCIFTree(tree);
    return;
  }

  // Primera vez — inicializar limpio
  state.activeHypotheses = [];
  state.treeAnswers = {};
  state.stepsCompleted = [];
  document.getElementById('btnGoConfirm').disabled = true; document.getElementById('btnGoConfirm').style.opacity = '';
  document.getElementById('cifTree').innerHTML = '';
  renderStep(tree.steps[0]);
}

export function restoreCIFTree(tree) {
  // Re-renderiza el árbol con las respuestas guardadas en state.treeAnswers
  document.getElementById('cifTree').innerHTML = '';
  document.getElementById('btnGoConfirm').disabled = true; document.getElementById('btnGoConfirm').style.opacity = '';

  // Reconstruir hipótesis desde cero a partir de las respuestas guardadas
  state.activeHypotheses = [];

  let lastAnsweredStepIdx = -1;
  let lastAnsweredOpt = null;

  // Renderizar y restaurar cada paso que tenga respuesta guardada
  tree.steps.forEach((step, stepIdx) => {
    const savedValue = state.treeAnswers[step.id];
    // Solo renderizar si el paso fue visitado
    if (savedValue === undefined) return;

    renderStep(step);

    // Restaurar selección visualmente
    const optGroup = document.getElementById(`opts_${step.id}`);
    if (!optGroup) return;
    const savedOptIdx = step.options.findIndex(o => o.value === savedValue);
    if (savedOptIdx === -1) return;

    optGroup.querySelectorAll('.option-btn')[savedOptIdx].classList.add('selected');
    pintarDerivacionPaso(step);

    // Reconstruir hipótesis acumuladas
    step.options[savedOptIdx].hypothesis.forEach(h => {
      if (!state.activeHypotheses.includes(h)) state.activeHypotheses.push(h);
    });

    lastAnsweredStepIdx = stepIdx;
    lastAnsweredOpt = step.options[savedOptIdx];
  });

  // Renderizar el siguiente paso pendiente (igual que selectTreeOption) para que
  // el dispositivo receptor vea la pregunta en curso y no el mensaje de árbol completo
  if (lastAnsweredStepIdx !== -1 && lastAnsweredOpt) {
    const nextStepsToRender = resolveOptionTargets(tree, lastAnsweredStepIdx, lastAnsweredOpt)
      .filter(s => state.treeAnswers[s.id] === undefined);
    nextStepsToRender.forEach(s => renderStep(s));
  }

  checkTreeComplete(tree);
}

export function resetCIFTree() {
  showConfirmBanner(
    '↺ Reiniciar árbol de decisión',
    'Se perderán las respuestas del árbol y los tests de hipótesis. Los datos de triage, cribado y SINSS se mantienen.',
    'Reiniciar',
    () => {
      state.activeHypotheses = [];
      CIF_TREES[state.region]?.steps.forEach(st => olvidarResueltaPaso(st.id));
      state.treeAnswers = {};
      state.stepsCompleted = [];
      state.testResults = {};
      state.hypothesisScores = {};
      document.getElementById('cifTree').innerHTML = '';
      document.getElementById('btnGoConfirm').disabled = true; document.getElementById('btnGoConfirm').style.opacity = '';
      if (state.maxVisitedIdx >= 4) { state.treeModified = true; paintNav(3); }
      const tree = CIF_TREES[state.region];
      renderStep(tree.steps[0]);
      saveSession();
    }
  );
}

export function renderStep(step) {
  const container = document.getElementById('cifTree');
  const existing = document.getElementById(step.id);
  if (existing) return; // already rendered

  const div = document.createElement('div');
  div.id = step.id;
  div.className = 'tree-question';
  div.innerHTML = `
    <div class="tree-step-badge">${step.tag}</div>
    <div class="tree-question-text">${step.question}</div>
    ${window.fpPistasPasoHTML?.(step.id) || ''}
    <div class="option-group" id="opts_${step.id}">
      ${step.options.map((opt, i) => `
        <button class="option-btn" style="width:100%; text-align:left; justify-content:flex-start;"
          onclick="selectTreeOption('${step.id}', ${i}, '${opt.value}')">
          ${opt.label}
        </button>`).join('')}
    </div>
    <div id="deriv_${step.id}"></div>`;
  container.appendChild(div);
  // Scroll to new step with offset for fixed navbar (~95px mobile, ~60px desktop)
  setTimeout(() => {
    const navbarH = window.innerWidth <= 768 ? 95 : 60;
    const top = div.getBoundingClientRect().top + window.scrollY - navbarH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 50);
}

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

export function selectTreeOption(stepId, optIdx, value) {
  const tree = CIF_TREES[state.region];
  const stepIdx = tree.steps.findIndex(s => s.id === stepId);
  const step = tree.steps[stepIdx];
  const opt = step.options[optIdx];
  const optGroup = document.getElementById(`opts_${stepId}`);
  const prevValue = state.treeAnswers[stepId];

  // Clicking the already-selected option again un-answers this step instead
  // of re-selecting it — same downstream pruning as changing to a different
  // answer, but this step itself goes back to unanswered rather than staying
  // selected. Otherwise the only way to undo a step is "↺ Reiniciar árbol",
  // which throws away every other answer too.
  olvidarResueltaPaso(stepId);   // otra respuesta (o ninguna): la marca no se hereda
  if (prevValue === value) {
    delete state.treeAnswers[stepId];
    pruneTreeFrom(stepIdx + 1, tree);
    optGroup.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    pintarDerivacionPaso(step);
    rebuildHypotheses(tree);
    saveSession();
    return;
  }

  // Si ya había una respuesta distinta en este paso, limpiar pasos posteriores
  if (prevValue !== undefined) {
    pruneTreeFrom(stepIdx + 1, tree);
  }

  // Marcar seleccionado — mantener botones activos para permitir cambio
  optGroup.querySelectorAll('.option-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === optIdx);
    b.style.opacity = '1'; // Todos visibles y clicables
  });

  state.treeAnswers[stepId] = value;
  pintarDerivacionPaso(step);

  // Reconstruir hipótesis desde cero (por si cambió una respuesta anterior)
  rebuildHypotheses(tree);

  // Determinar pasos siguientes a renderizar (los ya renderizados no se
  // vuelven a encolar — renderStep() ya es idempotente, pero evitarlo aquí
  // deja la intención explícita)
  const nextStepsToRender = resolveOptionTargets(tree, stepIdx, opt)
    .filter(s => !document.getElementById(s.id));

  nextStepsToRender.forEach(s => renderStep(s));

  checkTreeComplete(tree);
  saveSession();
}

// Elimina del DOM y del state todos los pasos a partir de fromIdx
export function pruneTreeFrom(fromIdx, tree) {
  for (let i = fromIdx; i < tree.steps.length; i++) {
    const stepEl = document.getElementById(tree.steps[i].id);
    if (stepEl) stepEl.remove();
    delete state.treeAnswers[tree.steps[i].id];
    olvidarResueltaPaso(tree.steps[i].id);
  }
  // Marcar 4b y 5 como invalidados si ya habían sido visitados
  if (state.maxVisitedIdx >= 4) {
    state.treeModified = true;
    paintNav(3); // repintar desde fase 4 activa (idx=3)
  }
  document.getElementById('btnGoConfirm').disabled = true;

  const complete = document.getElementById('treeComplete');
  if (complete) complete.remove();
}

// Reconstruye activeHypotheses desde las respuestas actuales en state.treeAnswers
export function rebuildHypotheses(tree) {
  state.activeHypotheses = [];
  tree.steps.forEach(step => {
    const savedValue = state.treeAnswers[step.id];
    if (savedValue === undefined) return;
    const opt = step.options.find(o => o.value === savedValue);
    if (!opt) return;
    opt.hypothesis.forEach(h => {
      if (!state.activeHypotheses.includes(h)) state.activeHypotheses.push(h);
    });
  });
}

export function checkTreeComplete(tree) {
  const renderedSteps = tree.steps.filter(s => document.getElementById(s.id));
  const allAnswered = renderedSteps.every(s => state.treeAnswers[s.id] !== undefined);
  if (allAnswered && renderedSteps.length > 0) {
    showTreeComplete();
  }
}

export function showTreeComplete({ sinScroll = false } = {}) {
  const container = document.getElementById('cifTree');
  const existing = document.getElementById('treeComplete');
  if (existing) existing.remove();

  const hyps = state.activeHypotheses.map(h => HYPOTHESES[h]).filter(Boolean);
  // #treeComplete es un contenedor: la derivación (si la hay) va primero, como
  // alerta propia, y después el resultado del árbol.
  const div = document.createElement('div');
  div.id = 'treeComplete';
  div.style.marginTop = '1.5rem';
  const derivaciones = getDerivacionesArbol();
  const derivHtml = derivaciones.length
    ? `<div class="alert alert-danger"><span class="alert-icon">🩺</span><div><strong>Derivación médica pendiente.</strong>${derivaciones.map(m => `<div>· ${m}</div>`).join('')}</div></div>`
    : '';
  const resultado = hyps.length === 0
    ? `<div class="alert alert-warning"><span style="font-size:1.2rem; flex-shrink:0; line-height:1;">⚠️</span><span><strong>Árbol completado.</strong> No se ha identificado un patrón diagnóstico dominante. Proceda a Fase 4b para revisar las consideraciones clínicas o regrese al árbol para reconsiderar las respuestas.</span></div>`
    : `<div class="alert alert-success"><span style="font-size:1.2rem; flex-shrink:0; line-height:1;">✅</span><span><strong>Árbol completado.</strong> Hipótesis identificadas: <strong>${hyps.map(h => h.name).join(', ')}</strong>. Proceda a confirmar con los tests específicos.</span></div>`;
  div.innerHTML = derivHtml + resultado;
  container.appendChild(div);
  document.getElementById('btnGoConfirm').disabled = false;
  if (!sinScroll) div.scrollIntoView({ behavior: 'smooth' });
}

// Exposed for inline onclick attributes (index.html static markup + this
// file's own dynamically-generated HTML) — those resolve only against the
// global scope, never a module's private scope.
window.resetCIFTree = resetCIFTree;
window.selectTreeOption = selectTreeOption;
window.toggleDerivacionArbolResuelta = toggleDerivacionArbolResuelta;
