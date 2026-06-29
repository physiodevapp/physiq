'use strict';
// ─── STATE ────────────────────────────────────────────────────────────────────────────────────
let currentRegion = null;
let currentView = 'landing'; // 'landing' | 'home' | 'tissue' | 'region' | 'ejercicio'
let currentFilter = 'all';   // 'all' | 'green'
let currentPosFilter = 'all'; // 'all' | 'progression' | 'pie' | 'sentado' | 'supino' | 'lateral' | 'prono'
const _linkOverrides = JSON.parse(localStorage.getItem('physiq_link_overrides') || '{}');

const POS_ORDER  = ['pie', 'sentado', 'supino', 'lateral', 'prono'];
const POS_LABELS = { pie: 'De pie', sentado: 'Sentado', supino: 'Supino', lateral: 'Dec. lateral', prono: 'Prono' };

// ─── RENDER: HOME ───────────────────────────────────────────────────────────────────────────────────
function renderHome() {
  document.getElementById('header-title').innerHTML = 'Physi<span class="logo-q">Q</span> <span class="logo-accent">— Wiki</span>';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = '';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';

  const grid = document.getElementById('regions-grid');
  grid.innerHTML = REGIONS.map((r, i) => {
    const total = r.categories.reduce((s, c) => s + c.tests.length, 0);
    const green = r.categories.reduce((s, c) => s + c.tests.filter(t => t.ev === 'green').length, 0);
    return `
      <div class="region-card" style="animation-delay:${i * 0.05}s" onclick="showRegion('${r.id}')">
        <div class="region-card-name">${r.name}</div>
        <div class="region-card-count">${total} tests</div>
        <div class="region-card-green">✓ ${green} alta evidencia</div>
      </div>`;
  }).join('');
}

// ─── RENDER HELPERS ──────────────────────────────────────────────────────────────────────────────
function _buildTestItem(test) {
  const badgeClass = `ev-${test.ev}`;
  const badgeLabel = test.ev === 'green' ? '✓' : test.ev === 'yellow' ? '!' : '?';
  const rowClass   = test.ev === 'green' ? 'ev-green-row' : '';

  const storedOverride = _linkOverrides[test.id];
  const effectiveLink  = storedOverride !== undefined ? storedOverride : test.link;

  const icon = `<span class="test-link-btn has-link"><svg viewBox="0 0 24 17" width="22" height="15" style="display:block"><rect width="24" height="17" rx="4" fill="#FF0000"/><path d="M10 5L16 8.5L10 12V5Z" fill="white"/></svg></span>`;

  if (effectiveLink) {
    return `
    <a class="test-item ${rowClass} has-link-row" href="${effectiveLink}" target="_blank" rel="noopener" data-test-id="${test.id}">
      <span class="evidence-badge ${badgeClass}">${badgeLabel}</span>
      <span class="test-name">${test.name}</span>
      ${icon}
    </a>`;
  }
  return `
    <div class="test-item ${rowClass}" data-test-id="${test.id}">
      <span class="evidence-badge ${badgeClass}">${badgeLabel}</span>
      <span class="test-name">${test.name}</span>
      <span class="test-link-btn no-link">&ndash;</span>
    </div>`;
}

function _evPass(t) { return currentFilter === 'all' || t.ev === 'green'; }
function _posPass(t, pos) { return Array.isArray(t.pos) && t.pos.includes(pos); }

// ─── RENDER: REGION ────────────────────────────────────────────────────────────────────────────────
function renderRegion() {
  const content = document.getElementById('region-content');
  let html = '';

  if (currentPosFilter === 'all') {
    currentRegion.categories.forEach(cat => {
      const tests = cat.tests.filter(_evPass);
      if (!tests.length) return;
      html += `
        <div class="category-section">
          <div class="category-title">${cat.name}</div>
          ${tests.map(_buildTestItem).join('')}
        </div>`;
    });
  } else if (currentPosFilter === 'progression') {
    POS_ORDER.forEach(pos => {
      const posCats = currentRegion.categories
        .map(cat => ({ name: cat.name, tests: cat.tests.filter(t => _evPass(t) && _posPass(t, pos)) }))
        .filter(cat => cat.tests.length);
      if (!posCats.length) return;
      html += `<div class="pos-section-label">${POS_LABELS[pos]}</div>`;
      posCats.forEach(cat => {
        html += `
          <div class="category-section">
            <div class="category-title">${cat.name}</div>
            ${cat.tests.map(_buildTestItem).join('')}
          </div>`;
      });
    });
  } else {
    currentRegion.categories.forEach(cat => {
      const tests = cat.tests.filter(t => _evPass(t) && _posPass(t, currentPosFilter));
      if (!tests.length) return;
      html += `
        <div class="category-section">
          <div class="category-title">${cat.name}</div>
          ${cat.tests.map(_buildTestItem).join('')}
        </div>`;
    });
  }

  if (!html) html = '<div class="no-green-notice">Sin tests para este filtro</div>';
  content.innerHTML = html;
}

// ─── FILTER UI SYNC ────────────────────────────────────────────────────────────────────────────
function _syncFilterUI() {
  const evToggle = document.getElementById('ev-toggle');
  if (evToggle) evToggle.classList.toggle('on', currentFilter === 'green');

  document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('on-prog', 'on-pos'));
  if (currentPosFilter !== 'all') {
    const chip = document.getElementById('pos-chip-' + currentPosFilter);
    if (chip) chip.classList.add(currentPosFilter === 'progression' ? 'on-prog' : 'on-pos');
  }
}

// ─── NAVIGATION ────────────────────────────────────────────────────────────────────────────────
function showLanding() {
  currentView = 'landing';
  currentRegion = null;
  document.getElementById('view-landing').style.display = '';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';
}

function showSpecialTests() {
  currentView = 'home';
  renderHome();
  history.pushState({ view: 'home' }, '');
}

function showTissue() {
  currentView = 'tissue';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = '';
  document.getElementById('view-ejercicio').style.display = 'none';
  history.pushState({ view: 'tissue' }, '');
}

function showEjercicio() {
  currentView = 'ejercicio';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = '';
  history.pushState({ view: 'ejercicio' }, '');
}

function showRegion(id) {
  currentRegion = REGIONS.find(r => r.id === id);
  currentView = 'region';

  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = '';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';
  document.getElementById('region-sub-badge').textContent = currentRegion.name;

  _syncFilterUI();
  document.getElementById('region-content').scrollTop = 0;
  renderRegion();

  history.pushState({ view: 'region', region: id }, '');
}

function showHome() {
  currentRegion = null;
  currentView = 'home';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = '';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';
}

// ─── POPSTATE ───────────────────────────────────────────────────────────────────────────────────
window.addEventListener('popstate', e => {
  if (currentRegion) {
    showHome();
  } else if (currentView === 'home' || currentView === 'tissue' || currentView === 'ejercicio') {
    showLanding();
  } else if (e.state?.view === 'hub-exit' && document.body.classList.contains('in-hub')) {
    // Only navigate to hub when we actually reach the hub-exit sentinel entry
    window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
  }
  // currentView === 'landing' but not at hub-exit: already on landing, do nothing
});

// ─── FILTER ─────────────────────────────────────────────────────────────────────────────────────
function toggleEvFilter(btn) {
  currentFilter = currentFilter === 'green' ? 'all' : 'green';
  btn.classList.toggle('on', currentFilter === 'green');
  renderRegion();
}

function setPosFilter(pos, btn) {
  currentPosFilter = currentPosFilter === pos ? 'all' : pos;
  _syncFilterUI();
  renderRegion();
}

// ─── LINK OVERRIDE ─────────────────────────────────────────────────────────────────────────────────────
let _editingTestId = null;

function openLinkSheet(testId, testName) {
  _editingTestId = testId;
  document.getElementById('link-sheet-name').textContent = testName;

  const current = _linkOverrides[testId];
  const test    = currentRegion.categories.flatMap(c => c.tests).find(t => t.id === testId);
  document.getElementById('link-input').value = current !== undefined ? current : (test?.link ?? '');

  document.getElementById('link-sheet').style.display = 'block';
  document.getElementById('link-input').focus();
}

function closeLinkSheet() {
  document.getElementById('link-sheet').style.display = 'none';
  _editingTestId = null;
}

function saveLinkOverride() {
  if (!_editingTestId) return;
  const val = document.getElementById('link-input').value.trim();

  if (val === '') {
    delete _linkOverrides[_editingTestId];
  } else {
    _linkOverrides[_editingTestId] = val;
  }

  localStorage.setItem('physiq_link_overrides', JSON.stringify(_linkOverrides));
  closeLinkSheet();
  renderRegion();
}

// ─── LONG-PRESS ────────────────────────────────────────────────────────────────────────────────────────
let _longPressTimer  = null;
let _longPressTarget = null;
let _longPressHappened = false;

document.addEventListener('touchstart', e => {
  _longPressHappened = false;
  const item = e.target.closest('.test-item');
  if (!item) return;
  const testId = item.dataset.testId;
  const test   = currentRegion?.categories.flatMap(c => c.tests).find(t => t.id === testId);
  if (!test) return;

  _longPressTarget = item;
  item.style.background = 'var(--surface2)';

  _longPressTimer = setTimeout(() => {
    _longPressHappened = true;
    openLinkSheet(test.id, test.name);
    item.style.background = '';
    _longPressTarget = null;
  }, 600);
}, { passive: true });

document.addEventListener('touchend', () => {
  clearTimeout(_longPressTimer);
  _longPressTimer = null;
  if (_longPressTarget) { _longPressTarget.style.background = ''; _longPressTarget = null; }
}, { passive: true });

document.addEventListener('touchmove', () => {
  clearTimeout(_longPressTimer);
  _longPressTimer = null;
  if (_longPressTarget) { _longPressTarget.style.background = ''; _longPressTarget = null; }
}, { passive: true });

// Prevent link navigation after long-press (capture phase, before <a> fires)
document.addEventListener('click', e => {
  if (_longPressHappened) {
    e.preventDefault();
    e.stopPropagation();
    _longPressHappened = false;
  }
}, true);

document.getElementById('region-content').addEventListener('contextmenu', e => {
  if (e.target.closest('.test-item')) e.preventDefault();
});

// ─── INIT ───────────────────────────────────────────────────────────────────────────────────────────
showLanding();

function _rebuildHubHistory() {
  history.replaceState({ view: 'hub-exit' }, '');
  history.pushState({ view: 'landing' }, '');
  if (currentView === 'home' || currentRegion) {
    history.pushState({ view: 'home' }, '');
  } else if (currentView === 'tissue') {
    history.pushState({ view: 'tissue' }, '');
  } else if (currentView === 'ejercicio') {
    history.pushState({ view: 'ejercicio' }, '');
  }
  if (currentRegion) {
    history.pushState({ view: 'region', region: currentRegion.id }, '');
  }
}

let _firstVisible = true;
window.addEventListener('message', e => {
  if (e.data?.type === 'PHYSIQ_SAT_VISIBLE' && document.body.classList.contains('in-hub')) {
    if (_firstVisible) { _firstVisible = false; return; }
    _rebuildHubHistory();
  }
});

try {
  if (window.self !== window.top) {
    document.body.classList.add('in-hub');
    document.querySelector('.logo-main').addEventListener('click', () => {
      window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
    });
    history.replaceState({ view: 'hub-exit' }, '');
    history.pushState({ view: 'landing' }, '');
  }
} catch (_) {
  document.body.classList.add('in-hub');
}
