// ============================================================
// PhysiQ-Assessment · PHASE4.JS
// Algoritmo CIF — árbol de decisión clínica
// ============================================================

function initCIFTree() {
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

function restoreCIFTree(tree) {
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
    const nextStepsToRender = [];
    if (lastAnsweredOpt.next) {
      const explicitNext = tree.steps.find(s => s.id === lastAnsweredOpt.next);
      if (explicitNext && state.treeAnswers[explicitNext.id] === undefined) {
        nextStepsToRender.push(explicitNext);
      }
    }
    if (!lastAnsweredOpt.next && lastAnsweredStepIdx + 1 < tree.steps.length) {
      const sequentialNext = tree.steps[lastAnsweredStepIdx + 1];
      if (state.treeAnswers[sequentialNext.id] === undefined && !nextStepsToRender.some(s => s.id === sequentialNext.id)) {
        nextStepsToRender.push(sequentialNext);
      }
    }
    nextStepsToRender.forEach(s => renderStep(s));
  }

  checkTreeComplete(tree);
}

function resetCIFTree() {
  showConfirmBanner(
    '↺ Reiniciar árbol de decisión',
    'Se perderán las respuestas del árbol y los tests de hipótesis. Los datos de triage, cribado y SINSS se mantienen.',
    'Reiniciar',
    () => {
      state.activeHypotheses = [];
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

function renderStep(step) {
  const container = document.getElementById('cifTree');
  const existing = document.getElementById(step.id);
  if (existing) return; // already rendered

  const div = document.createElement('div');
  div.id = step.id;
  div.className = 'tree-question';
  div.innerHTML = `
    <div class="tree-step-badge">${step.tag}</div>
    <div class="tree-question-text">${step.question}</div>
    <div class="option-group" id="opts_${step.id}">
      ${step.options.map((opt, i) => `
        <button class="option-btn" style="width:100%; text-align:left; justify-content:flex-start;"
          onclick="selectTreeOption('${step.id}', ${i}, '${opt.value}')">
          ${opt.label}
        </button>`).join('')}
    </div>`;
  container.appendChild(div);
  // Scroll to new step with offset for fixed navbar (~95px mobile, ~60px desktop)
  setTimeout(() => {
    const navbarH = window.innerWidth <= 768 ? 95 : 60;
    const top = div.getBoundingClientRect().top + window.scrollY - navbarH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 50);
}

function selectTreeOption(stepId, optIdx, value) {
  const tree = CIF_TREES[state.region];
  const stepIdx = tree.steps.findIndex(s => s.id === stepId);
  const step = tree.steps[stepIdx];
  const opt = step.options[optIdx];

  // Si ya había una respuesta distinta en este paso, limpiar pasos posteriores
  const prevValue = state.treeAnswers[stepId];
  if (prevValue !== undefined && prevValue !== value) {
    pruneTreeFrom(stepIdx + 1, tree);
  }

  // Marcar seleccionado — mantener botones activos para permitir cambio
  const optGroup = document.getElementById(`opts_${stepId}`);
  optGroup.querySelectorAll('.option-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === optIdx);
    b.style.opacity = '1'; // Todos visibles y clicables
  });

  state.treeAnswers[stepId] = value;

  // Reconstruir hipótesis desde cero (por si cambió una respuesta anterior)
  rebuildHypotheses(tree);

  // Determinar pasos siguientes a renderizar
  const nextStepsToRender = [];

  if (opt.next) {
    const explicitNext = tree.steps.find(s => s.id === opt.next);
    if (explicitNext) nextStepsToRender.push(explicitNext);
  }

  if (!opt.next && stepIdx + 1 < tree.steps.length) {
    const sequentialNext = tree.steps[stepIdx + 1];
    const alreadyQueued = nextStepsToRender.some(s => s.id === sequentialNext.id);
    const alreadyRendered = document.getElementById(sequentialNext.id);
    if (!alreadyQueued && !alreadyRendered) {
      nextStepsToRender.push(sequentialNext);
    }
  }

  if (nextStepsToRender.length > 0) {
    nextStepsToRender.forEach(s => renderStep(s));
  }

  checkTreeComplete(tree);
  saveSession();
}

// Elimina del DOM y del state todos los pasos a partir de fromIdx
function pruneTreeFrom(fromIdx, tree) {
  for (let i = fromIdx; i < tree.steps.length; i++) {
    const stepEl = document.getElementById(tree.steps[i].id);
    if (stepEl) stepEl.remove();
    delete state.treeAnswers[tree.steps[i].id];
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
function rebuildHypotheses(tree) {
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

function checkTreeComplete(tree) {
  const renderedSteps = tree.steps.filter(s => document.getElementById(s.id));
  const allAnswered = renderedSteps.every(s => state.treeAnswers[s.id] !== undefined);
  if (allAnswered && renderedSteps.length > 0) {
    showTreeComplete();
  }
}

function showTreeComplete() {
  const container = document.getElementById('cifTree');
  const existing = document.getElementById('treeComplete');
  if (existing) existing.remove();

  const hyps = state.activeHypotheses.map(h => HYPOTHESES[h]).filter(Boolean);
  const div = document.createElement('div');
  div.id = 'treeComplete';
  div.style.marginTop = '1.5rem';
  if (hyps.length === 0) {
    div.className = 'alert alert-warning';
    div.innerHTML = `<span style="font-size:1.2rem; flex-shrink:0; line-height:1;">⚠️</span><span><strong>Árbol completado.</strong> No se ha identificado un patrón diagnóstico dominante. Proceda a Fase 4b para revisar las consideraciones clínicas o regrese al árbol para reconsiderar las respuestas.</span>`;
  } else {
    div.className = 'alert alert-success';
    div.innerHTML = `<span style="font-size:1.2rem; flex-shrink:0; line-height:1;">✅</span><span><strong>Árbol completado.</strong> Hipótesis identificadas: <strong>${hyps.map(h => h.name).join(', ')}</strong>. Proceda a confirmar con los tests específicos.</span>`;
  }
  container.appendChild(div);
  document.getElementById('btnGoConfirm').disabled = false;
  div.scrollIntoView({ behavior: 'smooth' });
}
