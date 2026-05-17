// node tests/unit.js
// No external dependencies.

const { decodePayload, buildClinicalContext } = require('../lib/payload.js');

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.error(`  ✗ ${description}`);
    failed++;
  }
}

function assertThrows(description, fn) {
  try {
    fn();
    console.error(`  ✗ ${description} (no lanzó excepción)`);
    failed++;
  } catch {
    console.log(`  ✓ ${description}`);
    passed++;
  }
}

// ---------------------------------------------------------------------------
// Fixture: payload canónico (misma estructura que buildPhysiQPayload() emite)
// ---------------------------------------------------------------------------
const FULL_PAYLOAD = {
  p:  'Ana García',
  r:  'Hombro derecho',
  d:  '17/05/2026',
  mo: 'Dolor al elevar el brazo',
  me: 'Insidioso',
  cr: 'Subagudo',
  rp: 'Bajo',
  nr: 6,
  ir: 'Moderada',
  na: 'Mecánica',
  si: false,
  br: [],
  sq: [],
  h:  [
    { id: 'imp_rotador', name: 'Síndrome de pinzamiento', sc: 'Alta', lr: 4.2, tr: {} },
    { id: 'tendinopatia', name: 'Tendinopatía del manguito', sc: 'Media', lr: 2.1, tr: {} }
  ],
  pn: {
    variableControl:     'Escala NRS al elevar',
    ventanaRecuperacion: '6-8 semanas',
    anclajeHabito:       'Ejercicio matutino'
  }
};

function encode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

// ---------------------------------------------------------------------------
// Suite 1: decodePayload — round-trip
// ---------------------------------------------------------------------------
console.log('\ndecodePayload()');

assert('round-trip payload completo', (() => {
  const decoded = decodePayload(encode(FULL_PAYLOAD));
  return decoded.p === 'Ana García' && decoded.r === 'Hombro derecho';
})());

assert('round-trip con caracteres especiales (tildes, ñ)', (() => {
  const obj = { p: 'Ángel Muñoz', r: 'Región lumbar' };
  const decoded = decodePayload(encode(obj));
  return decoded.p === 'Ángel Muñoz' && decoded.r === 'Región lumbar';
})());

assert('nr=0 se preserva (no confundido con falsy)', (() => {
  const obj = { ...FULL_PAYLOAD, nr: 0 };
  return decodePayload(encode(obj)).nr === 0;
})());

assert('si=true se preserva', (() => {
  const obj = { ...FULL_PAYLOAD, si: true };
  return decodePayload(encode(obj)).si === true;
})());

assertThrows('base64 inválido lanza excepción', () => decodePayload('!!!no-es-base64!!!'));
assertThrows('JSON malformado lanza excepción', () => decodePayload(btoa('no-es-json')));

// ---------------------------------------------------------------------------
// Suite 2: Contrato de campos — todos los campos del emisor están presentes
// ---------------------------------------------------------------------------
console.log('\nContrato de campos (p, r, d, mo, me, cr, rp, nr, ir, na, si, br, sq, h[], pn)');

const CONTRACT_FIELDS = ['p', 'r', 'd', 'mo', 'me', 'cr', 'rp', 'nr', 'ir', 'na', 'si', 'br', 'sq', 'h', 'pn'];

const decoded = decodePayload(encode(FULL_PAYLOAD));

CONTRACT_FIELDS.forEach(field => {
  assert(`campo '${field}' presente tras decode`, field in decoded);
});

assert("h[] es array", Array.isArray(decoded.h));
assert("br[] es array", Array.isArray(decoded.br));
assert("sq[] es array", Array.isArray(decoded.sq));
assert("pn es objeto con variableControl/ventanaRecuperacion/anclajeHabito", (
  decoded.pn &&
  'variableControl' in decoded.pn &&
  'ventanaRecuperacion' in decoded.pn &&
  'anclajeHabito' in decoded.pn
));

assert("h[].id, h[].name, h[].sc, h[].lr, h[].tr presentes", decoded.h.every(h =>
  'id' in h && 'name' in h && 'sc' in h && 'lr' in h && 'tr' in h
));

// ---------------------------------------------------------------------------
// Suite 3: buildClinicalContext — salida con payload completo
// ---------------------------------------------------------------------------
console.log('\nbuildClinicalContext() — payload completo');

const ctx = buildClinicalContext(FULL_PAYLOAD);

assert('contiene cabecera estructurada', ctx.includes('## DATOS DE VALORACIÓN ESTRUCTURADA'));
assert('contiene nombre del paciente', ctx.includes('Ana García'));
assert('contiene región', ctx.includes('Hombro derecho'));
assert('contiene fecha', ctx.includes('17/05/2026'));
assert('contiene NRS', ctx.includes('6/10'));
assert('contiene hipótesis', ctx.includes('Síndrome de pinzamiento'));
assert('contiene score hipótesis', ctx.includes('Alta'));
assert('contiene variable de control', ctx.includes('Escala NRS al elevar'));
assert('contiene ventana de recuperación', ctx.includes('6-8 semanas'));
assert('cribado sistémico negativo', ctx.includes('Cribado sistémico: Negativo'));
assert('banderas rojas negativas', ctx.includes('Negativas'));
assert('termina con ---', ctx.trimEnd().endsWith('---'));

// ---------------------------------------------------------------------------
// Suite 4: buildClinicalContext — degradación con campos ausentes / nulos
// ---------------------------------------------------------------------------
console.log('\nbuildClinicalContext() — degradación graceful');

assert('data=null devuelve string vacío', buildClinicalContext(null) === '');
assert('data=undefined devuelve string vacío', buildClinicalContext(undefined) === '');

const ctxMinimo = buildClinicalContext({ p: '', r: '', d: '', nr: 0 });
assert('payload mínimo no lanza excepción', typeof ctxMinimo === 'string');
assert('nr=0 se muestra como 0/10, no como —', ctxMinimo.includes('0/10'));

const ctxConBR = buildClinicalContext({
  ...FULL_PAYLOAD,
  br: ['Déficit neurológico', 'Pérdida de peso inexplicable'],
  si: true,
  sq: ['Dolor torácico', 'Disfagia']
});
assert('banderas rojas positivas incluyen ⚠️', ctxConBR.includes('⚠️ Déficit neurológico'));
assert('cribado sistémico positivo', ctxConBR.includes('⚠️ Positivo'));
assert('alertas sistémicas positivas listadas', ctxConBR.includes('Dolor torácico'));

const ctxSinHip = buildClinicalContext({ ...FULL_PAYLOAD, h: [] });
assert('sin hipótesis muestra mensaje vacío', ctxSinHip.includes('(sin hipótesis registradas)'));

const ctxSinPn = buildClinicalContext({ ...FULL_PAYLOAD, pn: null });
assert('pn=null muestra — en los tres campos', (
  ctxSinPn.includes('Variable de control: —') &&
  ctxSinPn.includes('Ventana de recuperación: —') &&
  ctxSinPn.includes('Anclaje de hábito: —')
));

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log(`\n${passed + failed} tests: ${passed} pasados, ${failed} fallidos`);
if (failed > 0) process.exit(1);
