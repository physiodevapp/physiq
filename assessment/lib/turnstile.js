// Turnstile de Cloudflare (el worker lo exige en modo real): un widget por
// tarjeta con IA — «🎙 Informe con IA» (informe-ia.js) y «✨ Detallar con IA»
// (plan-ia.js) — y un solo script para la página, que se carga solo cuando una
// tarjeta con licencia lo pide (?render=explicit). Cada token vale para una
// petición: consumir() lo devuelve y reinicia el widget.
import { TURNSTILE_SITEKEY } from './informe-narrativo.js';

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__iaTurnstileOnload';
let _script = null;   // Promise del script, compartida por todos los widgets

function cargarScript() {
  if (window.turnstile) return Promise.resolve();
  if (_script) return _script;
  _script = new Promise((resolve, reject) => {
    window.__iaTurnstileOnload = () => resolve();
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.onerror = () => { _script = null; reject(new Error('turnstile')); };
    document.head.appendChild(s);
  });
  return _script;
}

// caja: () => elemento donde se pinta; alCambiar: repintar el botón de la tarjeta
export function crearTurnstile({ caja, alCambiar = () => {} }) {
  let widget = null, token = null, fallo = false, cargando = false;

  function render() {
    const box = caja();
    if (!box || !window.turnstile || widget != null) return;
    try {
      widget = window.turnstile.render(box, {
        sitekey: TURNSTILE_SITEKEY,
        appearance: 'always',
        callback: t => { token = t; fallo = false; alCambiar(); },
        'expired-callback': () => { token = null; alCambiar(); },
        'error-callback': () => { token = null; alCambiar(); },
      });
    } catch {
      fallo = true;
    }
    alCambiar();
  }

  return {
    cargar() {
      if (widget != null || cargando) { alCambiar(); return; }
      cargando = true;
      cargarScript().then(render, () => { fallo = true; alCambiar(); });
      // Un bloqueador puede impedir que llegue a pintarse: sin este aviso solo
      // se vería un botón desactivado sin explicación.
      setTimeout(() => { if (widget == null) { fallo = true; alCambiar(); } }, 10000);
    },
    token: () => token,
    fallo: () => fallo,
    consumir() {
      const t = token;
      token = null;
      if (window.turnstile && widget != null) { try { window.turnstile.reset(widget); } catch {} }
      return t;
    },
  };
}
