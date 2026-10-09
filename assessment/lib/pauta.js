// ── Pauta por situación clínica ──────────────────────────────────────────────
// Una hipótesis puede partir su pauta (`dosis`) en ramas (`dosisRamas`), cada
// una con la condición que la elige: el mecanismo de la fase 1 o una respuesta
// del árbol CIF. La primera rama que encaja es la de este caso; la fase 5 la
// pone delante (las demás, plegadas) y el informe con IA recibe solo esa. Sin
// rama que encaje, todo como antes: `dosis` entera.
// Motivo: la pauta de ro2 (lesión meniscal) junta degenerativa, traumática y
// tras meniscectomía en un texto, y en una rotura traumática de 38 años el
// informe copió la rama degenerativa (terapia manual, electroestimulación).
//
// hyp.dosisRamas: [{ si: { mecanismo?: string, arbol?: { [stepId]: value } },
//                    titulo: string, texto: string }]
//   `arbol` encaja si cualquiera de sus pasos tiene ese valor.
// hyp.dosisComun?: string — lo que vale para todas las ramas («el volumen
//   queda a criterio del clínico»); va detrás de la rama elegida.
// `dosis` sigue siendo el texto entero (📋 Notas, payload, physiq-report y
// sesiones antiguas no cambian); un test comprueba que las ramas solo reparten
// sus frases.

export function encajaRama(rama, { mecanismo = '', treeAnswers = {} } = {}) {
  const si = rama?.si || {};
  if (si.mecanismo && si.mecanismo === mecanismo) return true;
  if (si.arbol && Object.entries(si.arbol).some(([paso, valor]) => treeAnswers?.[paso] === valor)) return true;
  return false;
}

// → { rama, otras, texto } | null. `texto` = rama + parte común.
export function ramaPauta(hyp, contexto = {}) {
  const ramas = hyp?.dosisRamas || [];
  const rama = ramas.find(r => encajaRama(r, contexto));
  if (!rama) return null;
  return {
    rama,
    otras: ramas.filter(r => r !== rama),
    texto: [rama.texto, hyp.dosisComun].filter(Boolean).join(' '),
  };
}

// Frases de un texto de pauta (para el test de que las ramas no inventan nada)
export function frasesPauta(texto) {
  return String(texto || '').split(/(?<=[.])\s+(?=[A-ZÁÉÍÓÚÑ¿«(])/).map(f => f.trim()).filter(Boolean);
}
