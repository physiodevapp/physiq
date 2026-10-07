// ============================================================
// PhysiQ-Assessment · lib/posquirurgico.js
// Paciente posquirúrgico: funciones puras (docs/posquirurgico.md)
// ============================================================
//
// La tarjeta «Cirugía» de la fase 1 guarda state.cirugia; aquí se calcula lo
// que leen la fase 5, 📋 Notas, 📄 Informe, el payload (`cq`) y el informe
// con IA. Sin DOM ni estado global: todo recibe sus datos por parámetro.

export const MECANISMO_POSQUIRURGICO = 'Post-quirúrgico';

export const PROTOCOLOS = ['Escrito', 'Verbal', 'No hay'];

// Lista cerrada de complicaciones (decisión 1); «otra» va en texto aparte.
export const COMPLICACIONES = [
  { id: 'ninguna', label: 'Ninguna' },
  { id: 'infeccion', label: 'Infección' },
  { id: 'tvp', label: 'TVP / TEP' },
  { id: 'nervio', label: 'Lesión nerviosa' },
  { id: 'sdrc', label: 'SDRC' },
  { id: 'reintervencion', label: 'Reintervención' },
];

export const cirugiaVacia = () => ({
  intervencion: '', fecha: '', semanasAprox: null, protocolo: '',
  restricciones: '', complicaciones: [], complicacionOtra: '',
});

export const esPosquirurgico = mecanismo => mecanismo === MECANISMO_POSQUIRURGICO;

// Semanas completas desde la cirugía. Con fecha ('AAAA-MM-DD') se calculan
// siempre al vuelo (nunca se guardan); sin fecha, las aproximadas que dio el
// paciente. null si no hay ninguna de las dos.
export function semanasCirugia(cir, hoy = new Date()) {
  if (!cir) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cir.fecha || '');
  if (m) {
    const fecha = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    const dia = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return Math.max(0, Math.floor((dia - fecha) / (7 * 86400000)));
  }
  const s = cir.semanasAprox;
  return s !== null && s !== '' && Number.isFinite(+s) && +s >= 0 ? Math.floor(+s) : null;
}

// 'AAAA-MM-DD' → 'DD/MM/AAAA' (como la fecha del payload, es-ES)
export const fechaLegible = f => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};

export function complicacionesTexto(cir) {
  const ids = cir?.complicaciones || [];
  const lista = COMPLICACIONES.filter(c => ids.includes(c.id)).map(c => c.label);
  const otra = (cir?.complicacionOtra || '').trim();
  if (otra) lista.push(otra);
  return lista;
}

// ¿Hay protocolo del cirujano? Solo «Escrito» o «Verbal»: «No hay» y sin
// rellenar piden confirmar las restricciones con el cirujano (decisión 7).
export const conProtocolo = cir => cir?.protocolo === 'Escrito' || cir?.protocolo === 'Verbal';

// Campo `cq` del payload: solo con mecanismo Post-quirúrgico.
//   { iv, fe, se, pr, re, co }  — intervención, fecha legible, semanas,
//   protocolo ('' si no se indicó), restricciones, complicaciones (textos)
export function cirugiaPayload(mecanismo, cir, hoy = new Date()) {
  if (!esPosquirurgico(mecanismo) || !cir) return null;
  return {
    iv: (cir.intervencion || '').trim(),
    fe: fechaLegible(cir.fecha),
    se: semanasCirugia(cir, hoy),
    pr: PROTOCOLOS.includes(cir.protocolo) ? cir.protocolo : '',
    re: (cir.restricciones || '').trim(),
    co: complicacionesTexto(cir),
  };
}

// Las mismas comprobaciones que conProtocolo, sobre el payload.
export const cqConProtocolo = cq => cq?.pr === 'Escrito' || cq?.pr === 'Verbal';

export const semanasTexto = se => se == null ? '' : `${se} semana${se === 1 ? '' : 's'}`;

// «12/03/2026 (6 semanas)» · «hace unas 6 semanas» · ''
export function fechaSemanasTexto(cq) {
  if (!cq) return '';
  if (cq.fe) return `${cq.fe}${cq.se != null ? ` (${semanasTexto(cq.se)})` : ''}`;
  return cq.se != null ? `hace unas ${semanasTexto(cq.se)}` : '';
}

export const TEXTO_SIN_PROTOCOLO = 'Restricciones pendientes de confirmar con el cirujano';
export const TEXTO_PAUTA_COMPATIBLE = 'Solo si es compatible con el protocolo del cirujano; donde difieran, prevalece el protocolo.';
export const TEXTO_NOTA_TRAUMA = 'En el operado, lo que cuenta es el cambio respecto a lo esperable según el protocolo, no el déficit que ya deja la cirugía.';
export const ETIQUETA_TRATADA = '🏥 Diagnosticada y tratada';

// ── Hipótesis posquirúrgica genérica (`pq1`, docs/posquirurgico.md) ─────────
// No sale del árbol: con mecanismo Post-quirúrgico va la primera de la lista
// de hipótesis, delante de las del árbol (state.activeHypotheses no la guarda).
export const ID_HIP_POSQ = 'pq1';
export const NOMBRE_HIP_POSQ = 'Rehabilitación posquirúrgica';
export const ETIQUETA_HIP_POSQ = '🏥 Condición conocida: no se puntúa';
export const TEXTO_PAUTA_POSQ = 'Seguir el protocolo del cirujano';

export function hipotesisConPosq(mecanismo, ids = []) {
  const arbol = ids.filter(id => id !== ID_HIP_POSQ);
  return esPosquirurgico(mecanismo) ? [ID_HIP_POSQ, ...arbol] : arbol;
}

// «Postoperatorio: PTC derecha»; sin intervención, el nombre fijo.
export function nombreHipPosq(cir) {
  const iv = (cir?.intervencion || '').trim();
  return iv ? `Postoperatorio: ${iv}` : NOMBRE_HIP_POSQ;
}

// Pauta de `pq1`: el protocolo y sus restricciones, o el aviso sin protocolo.
export function pautaHipPosq(cq) {
  if (!cqConProtocolo(cq)) return `${TEXTO_SIN_PROTOCOLO}.${cq?.re ? ` Restricciones referidas: ${cq.re}` : ''}`;
  return `${TEXTO_PAUTA_POSQ}${cq.re ? `: ${cq.re}` : '.'}`;
}
