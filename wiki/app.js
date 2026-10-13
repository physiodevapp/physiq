'use strict';
// ─── STATE ────────────────────────────────────────────────────────────────────────────────────
let currentRegion = null;
let currentView = 'landing'; // 'landing' | 'home' | 'tissue' | 'region' | 'ejercicio' | 'recursos'
let currentFilter = 'all';   // 'all' | 'green'
let currentPosFilter = 'all'; // 'all' | 'progression' | 'pie' | 'sentado' | 'supino' | 'lateral' | 'prono'
const _linkOverrides = JSON.parse(localStorage.getItem('physiq_link_overrides') || '{}');

const POS_ORDER  = ['pie', 'sentado', 'supino', 'lateral', 'prono'];
const POS_LABELS = { pie: 'De pie', sentado: 'Sentado', supino: 'Supino', lateral: 'Dec. lateral', prono: 'Prono' };

// ─── RENDER: HOME ───────────────────────────────────────────────────────────────────────────────────
function renderHome() {
  document.getElementById('header-title').innerHTML = '<span class="logo-physiq">Physi<span class="logo-q">Q</span></span> <span class="logo-accent">— Wiki</span>';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = '';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';
  document.getElementById('view-recursos').style.display = 'none';

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

// ─── ENLACES DE TÉCNICA ──────────────────────────────────────────────────────────────────────────
// Convierte el nombre del test en términos de búsqueda: fuera paréntesis (casi siempre son
// matices condicionales, no parte del nombre), fuera puntuación que YouTube ignora.
function _searchTerms(name) {
  return name
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[–—/,]/g, ' ')
    .replace(/['\u2019]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Consulta derivada para un test, o '' si su evidencia no recibe enlace de búsqueda.
function _searchQuery(test, regionId, categoryName) {
  if (!SEARCH_LINK_EV.includes(test.ev)) return '';

  const override = SEARCH_QUERY_OVERRIDES[test.id];
  if (override) return override;

  const term  = SEARCH_CATEGORY_TERM[`${regionId}|${categoryName}`] || SEARCH_REGION_TERM[regionId] || '';
  const terms = _searchTerms(test.name);
  return term && !terms.includes(term) ? `${terms} ${term}` : terms;
}

function _searchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

// ─── RENDER HELPERS ──────────────────────────────────────────────────────────────────────────────
const _ICON_VIDEO  = `<span class="test-link-btn has-link" title="Vídeo de la técnica"><svg viewBox="0 0 24 17" width="22" height="15" style="display:block"><rect width="24" height="17" rx="4" fill="#FF0000"/><path d="M10 5L16 8.5L10 12V5Z" fill="white"/></svg></span>`;
const _ICON_SEARCH = `<span class="test-link-btn is-search" title="Búsqueda en YouTube — no es un vídeo verificado"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="display:block"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg></span>`;

function _buildTestItem(test, regionId, categoryName) {
  const badgeClass = `ev-${test.ev}`;
  const badgeLabel = test.ev === 'green' ? '✓' : test.ev === 'yellow' ? '!' : '?';
  const rowClass   = test.ev === 'green' ? 'ev-green-row' : '';

  // Prioridad: enlace guardado por el usuario > vídeo curado > búsqueda derivada.
  const storedOverride = _linkOverrides[test.id];
  const curatedLink    = storedOverride !== undefined ? storedOverride : test.link;

  let link = curatedLink;
  let icon = _ICON_VIDEO;
  if (!link) {
    const query = _searchQuery(test, regionId, categoryName);
    if (query) { link = _searchUrl(query); icon = _ICON_SEARCH; }
  }

  if (link) {
    return `
    <a class="test-item ${rowClass} has-link-row" href="${link}" target="_blank" rel="noopener" data-test-id="${test.id}">
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
          ${tests.map(t => _buildTestItem(t, currentRegion.id, cat.name)).join('')}
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
            ${cat.tests.map(t => _buildTestItem(t, currentRegion.id, cat.name)).join('')}
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
          ${tests.map(t => _buildTestItem(t, currentRegion.id, cat.name)).join('')}
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
  document.getElementById('view-recursos').style.display = 'none';
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
  document.getElementById('view-recursos').style.display = 'none';
  colocarCabeceraTissue();
  history.pushState({ view: 'tissue' }, '');
}

function showEjercicio() {
  currentView = 'ejercicio';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = '';
  document.getElementById('view-recursos').style.display = 'none';
  history.pushState({ view: 'ejercicio' }, '');
}

function showRecursos() {
  currentView = 'recursos';
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = 'none';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';
  document.getElementById('view-recursos').style.display = '';
  history.pushState({ view: 'recursos' }, '');
}

function showRegion(id) {
  currentRegion = REGIONS.find(r => r.id === id);
  currentView = 'region';

  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = '';
  document.getElementById('view-tissue').style.display = 'none';
  document.getElementById('view-ejercicio').style.display = 'none';
  document.getElementById('view-recursos').style.display = 'none';
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
  document.getElementById('view-recursos').style.display = 'none';
}

// ─── POPSTATE ───────────────────────────────────────────────────────────────────────────────────
window.addEventListener('popstate', e => {
  if (currentRegion) {
    showHome();
  } else if (currentView === 'home' || currentView === 'tissue' || currentView === 'ejercicio' || currentView === 'recursos') {
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

function _startLongPress(item, testId) {
  const test = currentRegion?.categories.flatMap(c => c.tests).find(t => t.id === testId);
  if (!test) return;
  _longPressTarget = item;
  item.style.background = 'var(--surface2)';
  _longPressTimer = setTimeout(() => {
    _longPressHappened = true;
    openLinkSheet(test.id, test.name);
    item.style.background = '';
    _longPressTarget = null;
  }, 600);
}

function _cancelLongPress() {
  clearTimeout(_longPressTimer);
  _longPressTimer = null;
  if (_longPressTarget) { _longPressTarget.style.background = ''; _longPressTarget = null; }
}

document.addEventListener('touchstart', e => {
  _longPressHappened = false;
  const item = e.target.closest('.test-item');
  if (!item) return;
  _startLongPress(item, item.dataset.testId);
}, { passive: true });

document.addEventListener('touchend',  _cancelLongPress, { passive: true });
document.addEventListener('touchmove', _cancelLongPress, { passive: true });

document.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  _longPressHappened = false;
  const item = e.target.closest('.test-item');
  if (!item) return;
  _startLongPress(item, item.dataset.testId);
});

document.addEventListener('mouseup',   _cancelLongPress);
document.addEventListener('mouseleave', _cancelLongPress);
document.addEventListener('mousemove', e => {
  if (_longPressTarget && (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5)) _cancelLongPress();
});

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
  } else if (currentView === 'recursos') {
    history.pushState({ view: 'recursos' }, '');
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

// When the browser restores this page from bfcache (e.g. after navigating to
// metronome/ and pressing back), the hub-exit sentinel must be re-established
// because the forward navigation consumed a history slot and the sentinel is
// no longer guaranteed to be the entry immediately before wiki-landing.
window.addEventListener('pageshow', e => {
  if (e.persisted && document.body.classList.contains('in-hub')) {
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

// ─── TIEMPOS DE TEJIDO ────────────────────────────────────────────────────────────────────────
// Las dos tablas (escritorio: nombre en columna; móvil: nombre dentro de la barra) salen de
// TISSUE_TIMES (data.js). Antes estaban escritas a mano por separado y ya no coincidían.
function renderTissue() {
  const T = TISSUE_TIMES;
  const n = T.cols.length;
  const head = cols => `<thead><tr>${cols}${T.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
  const pend = f => (f.pendiente ? ' <span class="ts-pendiente">pendiente de fuente</span>' : '');
  const vacias = k => (k > 0 ? `<td class="tc-e"${k > 1 ? ` colspan="${k}"` : ''}></td>` : '');

  let desk = head('<th class="tissue-th-label"></th>') + '<tbody>';
  let mob = head('') + '<tbody>';
  for (const g of T.grupos) {
    desk += `<tr class="ts-section"><td colspan="${n + 1}">${g.tejido}</td></tr>`;
    mob += `<tr class="ts-section"><td colspan="${n}">${g.tejido}</td></tr>`;
    // Lo que no cabe en una barra (la axonotmesis, que depende de la distancia)
    if (g.nota) {
      desk += `<tr class="ts-grupo-nota"><td colspan="${n + 1}">${g.nota}</td></tr>`;
      mob += `<tr class="ts-grupo-nota"><td colspan="${n}">${g.nota}</td></tr>`;
    }
    // Cada fila y, debajo, sus subtipos (con sangría y la gravedad de la madre)
    for (const madre of g.filas) {
      for (const f of [madre, ...(madre.subtipos || []).map(st => ({ ...st, g: st.g || madre.g, sub: true }))]) {
        // Qué mide la barra: relleno (tm-liso / -rayado / -contorno / -punteado / -tenue) y, si la medida lleva
        // `marca`, una etiqueta tras el nombre (ver «Qué mide la barra» en la leyenda)
        const m = T.medidas[f.mide] || {};
        const rel = m.relleno ? ` tm-${m.relleno}` : '';
        const marca = m.marca ? ` <span class="ts-marca">${m.marca}</span>` : '';
        const celdas = Array.from({ length: n }, (_, i) => `<td${i >= f.desde && i <= f.hasta ? ` class="tg-${f.g}${rel}${i === f.desde ? ' tm-ini' : ''}${i === f.hasta ? ' tm-fin' : ''}"` : ''}></td>`).join('');
        desk += `<tr${f.sub ? ' class="ts-sub"' : ''}><td class="ts-label">${f.nombre}${marca}${pend(f)}${f.nota ? `<span class="ts-nota">${f.nota}</span>` : ''}</td>${celdas}</tr>`;
        const ancho = f.hasta - f.desde + 1;
        mob += `<tr${f.sub ? ' class="ts-sub"' : ''}>${vacias(f.desde)}<td class="tg-${f.g}${rel} tm-ini tm-fin tc-label"${ancho > 1 ? ` colspan="${ancho}"` : ''}>${f.corto}${f.pendiente ? '*' : ''}</td>${vacias(n - 1 - f.hasta)}</tr>`;
      }
    }
  }
  document.getElementById('tissue-desktop').innerHTML = desk + '</tbody>';
  document.getElementById('tissue-mobile').innerHTML = mob + '</tbody>';

  const leyenda = Object.entries(T.gravedades).map(([k, v]) => `<span class="ts-ley"><span class="ts-ley-muestra tg-${k}"></span>${v}</span>`).join('');
  const hayPend = T.grupos.some(g => g.filas.some(f => f.pendiente));
  document.getElementById('tissue-extra').innerHTML =
    `<div class="ts-leyenda"><span class="ts-ley-titulo">Color = gravedad:</span>${leyenda}</div>`
    + '<div class="ts-leyenda ts-leyenda-mide"><span class="ts-ley-titulo">Relleno = qué mide la barra (en el color de su gravedad):</span>'
    + Object.values(T.medidas).filter(m => !m.marca).map(m => `<span class="ts-ley"><span class="ts-ley-muestra ts-ley-mide tm-${m.relleno} tm-ini tm-fin"></span>${m.etiqueta}</span>`).join('')
    + Object.values(T.medidas).filter(m => m.marca).map(m => `<span class="ts-ley"><span class="ts-marca">${m.marca}</span>${m.etiqueta}</span>`).join('')
    + '</div>'
    + (hayPend ? '<p class="ts-texto ts-pend-movil">* Pendiente de fuente: el rango no sale de ninguna fuente leída.</p>' : '')
    + '<div class="ts-fases-titulo">Fases de reparación</div><ul class="ts-fases">'
    + T.fases.map(f => `<li class="ts-fase ts-fase-${f.id}${f.parcial ? ' ts-fase-parcial' : ''}"><span class="ts-fase-muestra"></span><span>${f.nombre}</span><span class="ts-fase-rango">${f.rango}</span></li>`).join('')
    + `</ul><p class="ts-texto">${T.fasesNota}</p>`
    + `<ul class="ts-notas">${T.notas.map(t => `<li>${t}</li>`).join('')}</ul>`
    + T.fuentes.map(t => `<p class="tissue-source">${t}</p>`).join('');
}
renderTissue();

// La fila de tiempos se queda fija justo debajo de la cabecera de la app y de la barra
// «← Wiki» (que es sticky también y cambia de alto según el ancho).
function colocarCabeceraTissue() {
  const barra = document.querySelector('#view-tissue .region-sticky-header');
  if (!barra || !barra.offsetHeight) return;
  const header = document.querySelector('.app-header');
  document.documentElement.style.setProperty('--tissue-top', `${(header ? header.offsetHeight : 0) + barra.offsetHeight}px`);
}
window.addEventListener('resize', colocarCabeceraTissue);
