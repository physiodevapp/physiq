// ============================================================
// Formulario previo a la primera visita · CARA 2 · HOMBRO
// Texto literal de guia-de-consulta/data/formulario_hombro.js.
// Mismo esquema que formularios/comun.js. `pistas` enlaza respuestas con
// pasos del árbol CIF hombro (data/hombro.js): se muestran como recordatorio
// en ese paso, nunca lo responden solas. Referencias: 'c:<id>' (cara 1),
// 'r:<id>' (esta cara), 'r:<id>.<fila>' (una fila de una matriz).
// Las instrucciones de salto del papel («si ha contestado No, salte…») son
// aquí `mostrarSi` o la `intro` del apartado.
// ============================================================
const NS = 'No sabría decir';
const SNN = ['Sí', 'No', 'No sé'];

export default {
  id: 'hombro',
  titulo: 'Sobre su hombro en concreto',
  intro: 'Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».',
  secciones: [
    {
      titulo: 'Qué le provoca el dolor',
      items: [
        { id: 'provoca', tipo: 'matriz', ia: 'actividades', texto: '¿Le aparece o le aumenta el dolor al…?', opciones: SNN,
          filas: [
            { id: 'elevar', texto: 'Levantar el brazo, por delante o por un lado' },
            { id: 'encima', texto: 'Hacer cosas con el brazo por encima de la cabeza' },
            { id: 'peinarse', texto: 'Peinarse' },
            { id: 'espalda', texto: 'Llevar la mano a la espalda (sujetador, bolsillo)', iaTexto: 'Llevar la mano a la espalda' },
            { id: 'cruzar', texto: 'Cruzar el brazo por delante (lavarse la otra axila)' },
            { id: 'empujar', texto: 'Empujar o cargar peso con el brazo por delante' },
            { id: 'brusco', texto: 'Hacer un movimiento rápido o brusco sin esperarlo' }
          ] }
      ]
    },
    {
      titulo: 'Lo que nota en el hombro',
      items: [
        { id: 'limita', tipo: 'unica', ia: 'sintomas', texto: '¿Qué le limita más?',
          opciones: ['Sobre todo el dolor', 'Sobre todo que el brazo no llega, está rígido', 'Las dos cosas por igual',
            'Empezó con dolor y cada vez está más rígido', NS] },
        { id: 'nota', tipo: 'matriz', ia: 'sintomas', texto: '¿Nota alguna de estas cosas?', opciones: SNN,
          filas: [
            { id: 'fuerza', texto: 'Que le falta fuerza en ese brazo' },
            { id: 'crujidos', texto: 'Crujidos o roce al moverlo' },
            { id: 'engancha', texto: 'Que se engancha, se bloquea o da un chasquido' },
            { id: 'muerto', texto: 'Que de golpe el brazo se queda «muerto», sin fuerza' },
            { id: 'hormigueo', texto: 'Hormigueo en el brazo o la mano que va y viene' }
          ] }
      ]
    },
    {
      titulo: 'El hombro y el cuello',
      items: [
        { id: 'cuello', tipo: 'unica', ia: 'sintomas', texto: '¿El dolor del hombro cambia cuando mueve el cuello?',
          ayuda: 'Aunque le duela también el cuello, fíjese solo en el hombro',
          opciones: ['No cambia', 'Sí, aumenta', 'Sí, disminuye', NS] }
      ]
    },
    {
      titulo: 'Sensación de que el hombro se sale',
      items: [
        { id: 'miedo', tipo: 'unica', ia: 'sintomas', texto: '¿Le da inseguridad o miedo poner el brazo arriba y hacia atrás, como al lanzar?', opciones: ['No', 'Sí', NS] },
        { id: 'salido', tipo: 'unica', ia: 'historia', informe: 'Luxación o subluxación previa', texto: '¿Alguna vez se le ha salido el hombro de su sitio, o ha notado que «algo se iba»?',
          opciones: ['No', 'Sí, y me lo tuvieron que volver a colocar', 'Sí, y volvió solo a su sitio', NS] },
        { id: 'veces', tipo: 'unica', ia: 'historia', informe: 'Número de veces', texto: 'Si se le ha salido: ¿cuántas veces?', opciones: ['Una', 'Varias', NS],
          mostrarSi: { id: 'salido', valores: ['Sí, y me lo tuvieron que volver a colocar', 'Sí, y volvió solo a su sitio'] } },
        { id: 'ultima', tipo: 'texto', ia: 'historia', informe: 'Última vez', texto: '¿Cuándo fue la última?', lineas: 1,
          mostrarSi: { id: 'salido', valores: ['Sí, y me lo tuvieron que volver a colocar', 'Sí, y volvió solo a su sitio'] } }
      ]
    },
    {
      titulo: 'Otras cosas que nos ayudan',
      items: [
        { id: 'antecedentes', tipo: 'matriz', ia: 'contexto', texto: '¿Le han dicho alguna vez que tiene…?', opciones: SNN,
          filas: [
            { id: 'diabetes', texto: 'Diabetes o el azúcar alto' },
            { id: 'tiroides', texto: 'Problemas de tiroides' },
            { id: 'dupuytren', texto: 'Dedos que se le quedan doblados hacia la palma', iaTexto: 'Contractura de Dupuytren (dedos que se quedan doblados hacia la palma)' },
            { id: 'laxitud', texto: 'Articulaciones más flexibles de lo normal' }
          ] }
      ]
    },
    {
      titulo: 'Trabajo, deporte y ejercicio',
      items: [
        { id: 'actividades', tipo: 'multi', ia: 'contexto', texto: 'En el trabajo o en su tiempo libre, ¿hace a menudo alguna de estas cosas? (puede marcar varias)',
          opciones: ['Trabajar con los brazos por encima de la cabeza', 'Levantar pesas', 'Nadar', 'Lanzar', 'Gimnasia', 'Ninguna', NS] },
        { id: 'deporte', tipo: 'texto', ia: 'contexto', texto: '¿Qué deporte o ejercicio hace?',
          ayuda: 'Si NO hace deporte ni ejercicio de forma habitual, deje en blanco esta pregunta y las dos siguientes', lineas: 1,
          chips: ['Natación', 'Gimnasio', 'Pádel', 'Tenis', 'Balonmano', 'Voleibol'] },
        { id: 'cambios', tipo: 'multi', ia: 'contexto', texto: 'En los últimos meses, ¿ha cambiado algo? (puede marcar varias)',
          opciones: ['Entreno más días u horas', 'Entreno más fuerte o con más peso', 'Empecé o volví hace poco', 'No ha cambiado nada', NS] },
        { id: 'lanza', tipo: 'unica', ia: 'actividades', texto: 'Si lanza: desde que le duele, ¿ha perdido velocidad o puntería?', opciones: ['No', 'Sí', NS] }
      ]
    }
  ],
  pistas: {
    h_step1:  ['r:cuello', 'r:nota.hormigueo'],
    h_step2:  ['r:limita', 'r:provoca.peinarse', 'r:provoca.espalda', 'r:antecedentes.diabetes', 'r:antecedentes.tiroides', 'r:antecedentes.dupuytren'],
    h_step2b: ['c:desencadenante', 'r:nota.crujidos'],
    h_step3:  ['r:provoca.cruzar', 'r:miedo', 'r:salido', 'r:veces', 'r:ultima', 'r:antecedentes.laxitud', 'r:provoca.empujar', 'r:provoca.brusco',
               'r:nota.engancha', 'r:nota.muerto', 'r:lanza'],
    h_step4:  ['r:provoca.elevar', 'r:provoca.encima', 'r:nota.fuerza', 'r:actividades', 'r:cambios']
  }
};
