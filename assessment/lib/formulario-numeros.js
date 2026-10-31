// Números de las preguntas del formulario del paciente en papel, para que la hoja del árbol (y su
// página de la guía) diga en cada paso qué preguntas mirar: lo que en la app hace el recuadro
// «📝 Refiere el paciente» con las `pistas` de formularios/<región>.js. «G» = hoja general
// (formularios/comun.js), «R» = hoja de la región; numeradas en el orden de la hoja.
// Puro: solo lee los esquemas que se le pasan.
export function numerosFormulario(esquema, prefijo) {
  const n = {};
  let k = 0;
  for (const sec of esquema.secciones) for (const it of sec.items) n[it.id] = `${prefijo}${++k}`;
  return n;
}

// Referencias del paso `stepId`: ['G2', 'G4', 'R1', …], sin repetir, en el orden de las hojas
export function refsPasoFormulario(comun, region, stepId) {
  const lista = region?.pistas?.[stepId] || [];
  const nG = numerosFormulario(comun, 'G'), nR = region ? numerosFormulario(region, 'R') : {};
  const refs = new Set();
  for (const p of lista) {
    const [tipo, resto] = p.split(':');
    const id = resto.split('.')[0];
    const r = tipo === 'c' ? nG[id] : nR[id];
    if (r) refs.add(r);
  }
  const orden = r => (r[0] === 'G' ? 0 : 1000) + Number(r.slice(1));
  return [...refs].sort((a, b) => orden(a) - orden(b));
}

// «G2, G4 · R1, R3»
export const textoRefs = refs => [refs.filter(r => r[0] === 'G'), refs.filter(r => r[0] === 'R')].filter(a => a.length).map(a => a.join(', ')).join(' · ');
