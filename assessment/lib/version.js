// Versión desplegada de la app.
//
// En el repo valen 'dev' y ''. Al desplegar, deploy-to-hub.yml sustituye estas
// dos líneas en la copia del hub por el commit y la fecha del despliegue, y
// escribe version.json con lo mismo. La app compara su versión (la que se
// cargó) con version.json (la publicada, pedida sin caché): si difieren, avisa
// de que hay una versión nueva. Con 'dev' (local) no se comprueba nada.
export const VERSION_SHA = '8f2846f';
export const VERSION_FECHA = '2026-10-09T21:17:16Z';

// «a1b2c3d · 7 oct, 14:32» (hora local; el año solo si no es el actual, para
// que quepa en una línea del panel en el móvil), o «dev» fuera del despliegue.
export function textoVersion(sha = VERSION_SHA, fecha = VERSION_FECHA, ahora = new Date()) {
  if (!sha || sha === 'dev') return 'dev';
  const d = fecha ? new Date(fecha) : null;
  if (!d || isNaN(d)) return sha;
  const f = d.toLocaleString('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    ...(d.getFullYear() !== ahora.getFullYear() ? { year: 'numeric' } : {}),
  });
  return `${sha} · ${f}`;
}

// ¿La versión publicada (version.json) es otra que la cargada? Solo con una
// versión desplegada y una respuesta válida; cualquier otra cosa → false.
export function esVersionNueva(publicada, sha = VERSION_SHA) {
  if (!sha || sha === 'dev') return false;
  const otra = publicada && typeof publicada.sha === 'string' ? publicada.sha.trim() : '';
  return /^[0-9a-f]{7,40}$/i.test(otra) && otra !== sha;
}
