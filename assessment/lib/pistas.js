// ============================================================
// PhysiQ-Assessment · lib/pistas.js
// Recuadro «📝 Refiere el paciente»: lo que el paciente contó (formulario
// previo, mapa corporal de la fase 3) junto al paso del árbol o la tarjeta de
// la fase 1 que le corresponde. Solo recuerda; nunca contesta nada. Puro.
// Cada pista: { q, a, cita? } — `cita` es el sufijo de `a` escrito con las
// palabras del paciente, que va entre comillas y en cursiva.
// ============================================================

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function pistasHTML(p) {
  if (!p?.length) return '';
  // «Refiere el paciente», como el «SEGÚN REFIERE EL PACIENTE» del 📄 Informe:
  // la voz del paciente, distinta de la clasificación del fisio de debajo.
  const resp = x => {
    if (!x.cita) return esc(x.a);
    const pre = x.a.slice(0, x.a.length - x.cita.length);
    return `${esc(pre)}<span class="fp-pista-cita">«${esc(x.cita)}»</span>`;
  };
  return `<div class="fp-pistas"><div class="fp-pistas-title">📝 Refiere el paciente</div>${
    p.map(x => `<div class="fp-pista"><span class="fp-pista-q">${esc(x.q)}</span> <span class="fp-pista-a">${resp(x)}</span></div>`).join('')}</div>`;
}
