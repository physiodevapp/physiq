// Reglas de la fase 4b que no dependen del estado ni del DOM: LR efectiva de
// un test, si puntúa, su «cuánto pesa», los enlaces de anatomía (Kenhub) y
// sus citas, la puntuación de una hipótesis (calcLRScore) y su etiqueta. Las usa phase4b.js (que las reexporta, así que nadie más cambia),
// la guía de consulta (guia.js) y los esquemas imprimibles (docs/esquemas).
import { ESTRUCTURAS, KENHUB_BASE, KENHUB_BASE_ES } from '../data/anatomia.js';
import { partirCitas } from './citas.js';

// ─── Puntuación LR ────────────────────────────────────────────
// Reglas (ver CLAUDE.md, "Puntuación de la fase 4b"):
// 1. LR publicada (`lr_pos`/`lr_neg`) si existe; si no, calculada a partir de
//    `sn`/`sp` cuando ambos son un número único (LR+ = S/(1−E), LR− = (1−S)/E).
//    Un rango de S/E («52–70%», «~40%», «>90%») no se calcula. Un rango de LR
//    («2.9–4.9») se toma por su extremo más cercano a 1 (conservador).
// 2. Cada dirección cuenta por separado: la LR+ solo multiplica si es ≥ 2 y la
//    LR− solo si es ≤ 0,5. Si no, el resultado es un «hallazgo clínico»:
//    no multiplica (LR = 1) y se cuenta aparte como compatible / no compatible.
// 3. Los tests con `cluster: id` no multiplican solos: multiplica la regla
//    `hyp.clusters[id]` (umbralPos/lr_pos, umbralNeg/lr_neg).
// 4. `tipo: 'pronostico'` no entra en la puntuación diagnóstica.
// 5. Sin ninguna LR aplicable, la etiqueta no habla de peso diagnóstico.
// 6. `absorbe: [idx]` — si este test aporta LR, los tests listados (que forman
//    parte de él, p. ej. el SLR dentro de RAPIDH) dejan de multiplicar.
export const LR_POS_MIN = 2;
export const LR_NEG_MAX = 0.5;

// '92%' → 0.92 · '0.91' → 0.91 · rango o texto → null
export function parseProporcion(v) {
  if (v == null) return null;
  const m = String(v).trim().match(/^(\d+(?:[.,]\d+)?)\s*%?$/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(',', '.'));
  const p = n > 1 ? n / 100 : n;
  return p >= 0 && p <= 1 ? p : null;
}

// '3.7' → 3.7 · '2.9–4.9' → 2.9 (pos) / 4.9 (neg) · texto que no es LR → null
export function parseLR(v, direccion) {
  if (v == null) return null;
  const m = String(v).trim().match(/^(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?(?:\s*\([^)]*\))?$/);
  if (!m) return null;
  const a = parseFloat(m[1].replace(',', '.'));
  const b = m[2] != null ? parseFloat(m[2].replace(',', '.')) : a;
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const n = direccion === 'pos' ? lo : hi;
  return n > 0 ? n : null;
}

// LR efectiva de un test (o de una regla de cluster) en ambas direcciones.
// origen: 'publicada' | 'calculada' | null
export function lrEfectiva(t) {
  const sn = parseProporcion(t.sn), sp = parseProporcion(t.sp);
  const calcPos = sn != null && sp != null && sp < 1 ? sn / (1 - sp) : null;
  const calcNeg = sn != null && sp != null && sp > 0 ? (1 - sn) / sp : null;
  const pubPos = parseLR(t.lr_pos, 'pos'), pubNeg = parseLR(t.lr_neg, 'neg');
  const pos = pubPos ?? calcPos, neg = pubNeg ?? calcNeg;
  return {
    pos, neg,
    origenPos: pubPos != null ? 'publicada' : calcPos != null ? 'calculada' : null,
    origenNeg: pubNeg != null ? 'publicada' : calcNeg != null ? 'calculada' : null,
    posUtil: pos != null && pos >= LR_POS_MIN,
    negUtil: neg != null && neg <= LR_NEG_MAX,
  };
}

// ¿Puede este test cambiar la puntuación? Mismas reglas que calcLRScore:
// LR+ ≥ 2 o LR− ≤ 0,5 propia, o pertenecer a un cluster cuya regla puntúa.
export function testPuntua(hyp, test) {
  if (test.tipo === 'pronostico') return false;
  if (test.cluster) {
    const regla = hyp.clusters?.[test.cluster];
    if (!regla) return false;
    const lr = lrEfectiva(regla);
    return lr.posUtil || lr.negUtil;
  }
  const lr = lrEfectiva(test);
  return lr.posUtil || lr.negUtil;
}

// «Cuánto pesa» de un test (docs/razonamiento-tests.md): frase generada con
// las mismas reglas que calcLRScore, así que no puede contradecir la
// puntuación. Siempre visible bajo los badges; el detalle de la evidencia
// está en el panel «Ampliar».
export const PESO_TEST = {
  ambos: 'Sirve para confirmar y para descartar.',
  pos: 'Sirve para confirmar; un negativo es solo un hallazgo.',
  neg: 'Sirve para descartar; un positivo es solo un hallazgo.',
  sinLR: 'Sin LR aplicable: es un hallazgo clínico y no cambia la puntuación.',
  debil: 'Su LR no llega al umbral (LR+ ≥ 2 o LR− ≤ 0,5): es un hallazgo clínico y no cambia la puntuación.',
  pronostico: 'Regla pronóstica: no cuenta para la puntuación diagnóstica.',
  cluster: 'Puntúa dentro del cluster, no por separado.',
  clusterSinLR: 'El cluster no tiene LR aplicable: es un hallazgo clínico.',
};

export function pesoTest(hyp, test, idx) {
  if (test.tipo === 'pronostico') return PESO_TEST.pronostico;
  if (test.cluster) return testPuntua(hyp, test) ? PESO_TEST.cluster : PESO_TEST.clusterSinLR;
  const lr = lrEfectiva(test);
  let txt = lr.posUtil && lr.negUtil ? PESO_TEST.ambos
    : lr.posUtil ? PESO_TEST.pos
    : lr.negUtil ? PESO_TEST.neg
    : lr.pos == null && lr.neg == null ? PESO_TEST.sinLR : PESO_TEST.debil;
  // `absorbe`: si puntúa el test compuesto que lo incluye, este no suma aparte
  if (lr.posUtil || lr.negUtil) {
    const comp = hyp.tests.find((t, k) => k !== idx && t.absorbe?.includes(idx) && testPuntua(hyp, t));
    if (comp) txt += ` No suma aparte si puntúa «${comp.name.split(':')[0]}».`;
  }
  return txt;
}

// «Anatomía» de un test de la 4b o de una pregunta de cribado de la fase 2
// (docs/anatomia-kenhub.md): las estructuras de su `anatomia`, enlazadas a su
// artículo de Kenhub en una pestaña nueva:
// en español si Kenhub lo tiene y, si no, en inglés (marcado «EN»).
// Solo el nombre de la estructura va en la URL, nunca nada del paciente; si
// hay cuenta de Kenhub con la sesión iniciada en el navegador, Kenhub
// enseña el contenido completo. Oculto en el hub (CSS, como «Ampliar con IA»).
export function enlacesAnatomia(item) {
  return (item.anatomia || []).map(id => ESTRUCTURAS[id]).filter(Boolean)
    .map(e => ({
      nombre: e.nombre, nota: e.nota || '',
      url: e.kenhubEs ? KENHUB_BASE_ES + e.kenhubEs : KENHUB_BASE + e.kenhub,
      ingles: !e.kenhubEs,
    }));
}
function enlaceAnatomiaHTML(e) {
  const title = `Abrir en Kenhub${e.ingles ? ' (sin versión en español)' : ''}${e.nota ? ` · ${e.nota}` : ''}`;
  const idioma = e.ingles ? ' <span class="anat-idioma">EN</span>' : '';
  return `<a class="anat-enlace" href="${e.url}" target="_blank" rel="noopener noreferrer" title="${title}">${e.nombre}${idioma} ↗</a>`;
}
// Línea «ANATOMÍA a ↗ · b ↗» (tarjeta del test; «¿Por qué?» de la fase 2)
export function anatomiaLineaHTML(item) {
  const enlaces = enlacesAnatomia(item);
  return enlaces.length
    ? `<div class="test-anat"><span class="test-anat-etq">Anatomía</span> ${enlaces.map(enlaceAnatomiaHTML).join('<span class="test-anat-sep"> · </span>')}</div>`
    : '';
}
// Sección «Anatomía (Kenhub)» del panel «Ampliar»
export function anatomiaPanelHTML(item) {
  const enlaces = enlacesAnatomia(item);
  return enlaces.length
    ? `<div class="razon-seccion razon-anatomia"><div class="razon-etq">Anatomía (Kenhub)</div>
      <ul>${enlaces.map(e => `<li>${enlaceAnatomiaHTML(e)}</li>`).join('')}</ul></div>`
    : '';
}

// Panel «Ampliar» de un test: el mismo de la fase 2 (abrirPanelRazon, app.js).
// Fuentes: la `fuente` del test partida en citas (partirCitas, las mismas que
// la tarjeta) y, después, las `citas` del
// «por qué» que no estén ya. Cada cita se enlaza («Abrir ↗») con la url del
// registro (data/referencias.js) o, sin ella, con su DOI: el registro se
// carga con import() la primera vez que se abre el panel, y si falla el
// panel se abre igual, sin enlaces.
export function citasTest(test) {
  const propias = partirCitas(test.fuente);
  const textos = new Set(propias);
  return [...propias, ...(test.razonamiento?.citas || []).filter(c => !textos.has(typeof c === 'string' ? c : c.texto))];
}

export function calcLRScore(hyp, results) {
  let totalLR = 1.0, evaluatedCount = 0, informativos = 0, posInformativos = 0, hasHighLR = false;
  let hallazgos = 0, hallazgosPos = 0;
  const aportes = {};   // idx → LR que ha multiplicado (para `absorbe`)

  const multiplicar = (lr, esPos) => {
    totalLR *= lr; informativos++;
    if (esPos) { posInformativos++; if (lr >= 5) hasHighLR = true; }
  };

  // Tests sueltos
  hyp.tests.forEach((test, i) => {
    const res = results[i];
    if (!res || res === 'nd') return;
    evaluatedCount++;
    if (test.tipo === 'pronostico' || test.cluster) return;
    const lr = lrEfectiva(test);
    if (res === 'pos' && lr.posUtil) aportes[i] = { lr: lr.pos, esPos: true };
    else if (res === 'neg' && lr.negUtil) aportes[i] = { lr: lr.neg, esPos: false };
    else { hallazgos++; if (res === 'pos') hallazgosPos++; }
  });

  // `absorbe`: un test compuesto que aporta LR anula la de sus componentes
  hyp.tests.forEach((test, i) => {
    if (!aportes[i] || !test.absorbe) return;
    test.absorbe.forEach(j => {
      if (!aportes[j]) return;
      delete aportes[j];
      hallazgos++; if (results[j] === 'pos') hallazgosPos++;
    });
  });
  Object.values(aportes).forEach(a => multiplicar(a.lr, a.esPos));

  // Clusters
  Object.entries(hyp.clusters || {}).forEach(([cid, regla]) => {
    const idxs = hyp.tests.map((t, i) => t.cluster === cid ? i : -1).filter(i => i >= 0);
    const pos = idxs.filter(i => results[i] === 'pos').length;
    const todos = idxs.every(i => results[i] === 'pos' || results[i] === 'neg');
    const lr = lrEfectiva(regla);
    if (pos >= regla.umbralPos && lr.posUtil) multiplicar(lr.pos, true);
    else if (todos && regla.umbralNeg != null && pos <= regla.umbralNeg && lr.negUtil) multiplicar(lr.neg, false);
  });

  const hallazgosTxt = hallazgos > 0 ? ` · ${hallazgosPos}/${hallazgos} hallazgos compatibles` : '';
  let label, colorClass;
  if (evaluatedCount === 0) {
    label = 'Sin evaluar'; colorClass = 'hyp-orange';
  } else if (informativos === 0) {
    label = `⚪ Sin LR aplicable${hallazgosTxt}`; colorClass = 'hyp-neutral';
  } else if (totalLR >= 5 || hasHighLR) {
    label = `🟢 Peso alto (LR× ${totalLR.toFixed(1)})${hallazgosTxt}`; colorClass = 'hyp-green';
  } else if (totalLR >= 2 || posInformativos > 0) {
    label = `🟠 Peso moderado (LR× ${totalLR.toFixed(1)})${hallazgosTxt}`; colorClass = 'hyp-orange';
  } else {
    label = `🔴 Peso bajo (LR× ${totalLR.toFixed(1)})${hallazgosTxt}`; colorClass = 'hyp-red';
  }
  return { totalLR, label, colorClass, evaluatedCount, informativos, hallazgos, hallazgosPos };
}

// Etiqueta de puntuación de una hipótesis (cabecera de la 4b y tarjeta de la
// fase 5): el emoji inicial va aparte para que, si la etiqueta parte en dos
// líneas, la segunda quede alineada con el texto (sangría colgante, como el
// punto del título), y cada parte separada por «·» no se parte por dentro, así
// que el salto cae tras el «·». La etiqueta guardada sigue siendo texto plano
// con emoji (📋 Notas, payload `sc`): esto solo cambia cómo se pinta.
const escEtq = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function etiquetaHipHTML(label) {
  const txt = String(label ?? '');
  const m = txt.match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.*)$/su);
  const partes = (m ? m[2] : txt).split(' · ');
  const texto = partes.map((p, i) => `<span class="hyp-etq-parte">${escEtq(p)}${i < partes.length - 1 ? ' ·' : ''}</span>`).join(' ');
  return `<span class="hyp-etq">${m ? `<span class="hyp-etq-icono">${m[1]}</span>` : ''}<span class="hyp-etq-texto">${texto}</span></span>`;
}
