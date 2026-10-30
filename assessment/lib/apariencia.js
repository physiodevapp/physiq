// Apariencia: tema (Sistema / Claro / Oscuro) y tamaño de letra (Normal / Grande).
// Compartido por la app (app.js) y la guía de consulta (guia.js): las dos guardan la
// misma preferencia del dispositivo en localStorage, así que lo que se elige en una
// vale para la otra. El script del <head> de cada página la aplica antes de pintar;
// esto la vuelve a aplicar, pinta los botones y la cambia.
// Elección del tema: 'system' | 'light' | 'dark'. Es una preferencia de pantalla, no un
// dato clínico, y se lee de forma síncrona antes de pintar (IDB es asíncrono y la sesión
// caduca a las 24 h). En el hub la app va siempre en oscuro (forzarOscuro).
export const THEME_KEY = 'physiq-assessment-theme';
export const LETRA_KEY = 'physiq-assessment-letra';
const _themeMQ = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

const _SVG = d => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const THEME_UI = {
  system: { next: 'light', label: 'Sistema', icon: _SVG('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>') },
  light:  { next: 'dark',  label: 'Claro',   icon: _SVG('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') },
  dark:   { next: 'system', label: 'Oscuro', icon: _SVG('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') },
};

export function getThemePref() {
  try { const p = localStorage.getItem(THEME_KEY); if (p === 'light' || p === 'dark') return p; } catch (e) {}
  return 'system';
}

// Aplica el tema resuelto y pinta el botón (#themeBtn) con la elección actual.
export function aplicarTema({ forzarOscuro = false } = {}) {
  const pref = getThemePref();
  const resolved = forzarOscuro ? 'dark' : pref === 'system' ? (_themeMQ?.matches ? 'light' : 'dark') : pref;
  document.documentElement?.setAttribute('data-theme', resolved);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'light' ? '#ffffff' : '#0a0d12');
  const btn = document.getElementById('themeBtn');
  if (btn) {
    const ui = THEME_UI[pref];
    btn.innerHTML = ui.icon;
    const txt = `Apariencia: ${ui.label}. Pulsa para cambiar a ${THEME_UI[ui.next].label}`;
    btn.title = txt; btn.setAttribute('aria-label', txt);
  }
}

export function guardarTema(pref) {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch (e) {}
}

// Con «Sistema», sigue en directo el cambio claro/oscuro del dispositivo
export function seguirSistema(fn) { _themeMQ?.addEventListener?.('change', fn); }

// Tamaño de letra: Normal o Grande (+12,5 %, html[data-letra="grande"] en styles.css)
export function getLetra() {
  try { return localStorage.getItem(LETRA_KEY) === 'grande' ? 'grande' : 'normal'; } catch (e) { return 'normal'; }
}
export function aplicarLetra() {
  const grande = getLetra() === 'grande';
  if (grande) document.documentElement?.setAttribute('data-letra', 'grande');
  else document.documentElement?.removeAttribute('data-letra');
  const btn = document.getElementById('letraBtn');
  if (btn) {
    const txt = grande ? 'Letra grande. Pulsa para volver al tamaño normal' : 'Letra normal. Pulsa para agrandarla';
    btn.title = txt; btn.setAttribute('aria-label', txt);
    btn.setAttribute('aria-pressed', String(grande));
  }
}
export function cambiarLetra() {
  try {
    if (getLetra() === 'grande') localStorage.removeItem(LETRA_KEY);
    else localStorage.setItem(LETRA_KEY, 'grande');
  } catch (e) {}
  aplicarLetra();
}
