// ============================================================
// PhysiQ-Assessment · lib/audio-store.js
// Audio del informe narrativo (solo standalone), guardado en IDB mientras se
// graba para no perderlo si la página se recarga.
// ============================================================
//
// Misma base que lib/session.js — DB 'physiq' v3, store 'audio' — con la misma
// actualización de esquema, para que abrirla desde aquí nunca deje la base en
// un estado que los otros satélites no esperan. Claves propias con prefijo
// 'assessment-': la clave 'pending' es la del grabador del hub (mismo origen),
// y pisarla borraría una grabación del hub o al revés.
//
// Cada trozo de MediaRecorder se guarda por separado ('assessment-chunk-<n>'),
// en lugar de reescribir el audio entero cada vez; 'assessment-meta' dice
// cuántos hay. Un archivo adjunto se guarda como un único trozo.

const META = 'assessment-meta';
const chunkKey = n => `assessment-chunk-${n}`;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('physiq', 3);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('audio'))   db.createObjectStore('audio');
      if (!db.objectStoreNames.contains('session')) db.createObjectStore('session');
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

function tx(mode, fn) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t = db.transaction('audio', mode);
    const store = t.objectStore('audio');
    let result;
    Promise.resolve(fn(store, r => { result = r; })).catch(reject);
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}

// meta: { origen: 'grabacion'|'archivo', mime, nombre?, duracionMs?, chunks, fecha }
export function guardarTrozo(n, blob, meta) {
  return tx('readwrite', store => {
    store.put(blob, chunkKey(n));
    store.put({ ...meta, chunks: n + 1 }, META);
  }).catch(() => {});
}

export function actualizarMeta(meta) {
  return tx('readwrite', store => { store.put(meta, META); }).catch(() => {});
}

// → { blob, meta } | null
export function leerAudio() {
  return tx('readonly', (store, done) => {
    const g = store.get(META);
    g.onsuccess = () => {
      const meta = g.result;
      if (!meta || !meta.chunks) return done(null);
      const partes = [];
      let pendientes = meta.chunks;
      for (let i = 0; i < meta.chunks; i++) {
        const r = store.get(chunkKey(i));
        r.onsuccess = () => {
          partes[i] = r.result;
          if (--pendientes === 0) {
            const validas = partes.filter(Boolean);
            done(validas.length ? { blob: new Blob(validas, { type: meta.mime || '' }), meta } : null);
          }
        };
      }
    };
  }).catch(() => null);
}

export function borrarAudio() {
  return tx('readwrite', (store, done) => {
    const g = store.get(META);
    g.onsuccess = () => {
      const n = g.result?.chunks || 0;
      for (let i = 0; i < n; i++) store.delete(chunkKey(i));
      store.delete(META);
      done(true);
    };
  }).catch(() => false);
}
