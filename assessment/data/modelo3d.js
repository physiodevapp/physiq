// ============================================================
// PhysiQ-Assessment · DATA/MODELO3D.JS
// Modelo 3D del modo «Anatomía 3D» de Entrena (docs/entrena-3d.md).
// Datos técnicos, no clínicos: qué pieza del .glb es cada estructura, con
// su nombre en español, su capa y su sistema, las vistas de cámara y los
// puntos de referencia. El dónde de cada hipótesis (dato clínico) irá en
// cada hipótesis de data/<región>.js, cuando el usuario haya revisado el
// modelo (paso 3 del documento).
//
// El .glb lo genera tools/modelo-3d/exportar.py desde Z-Anatomy
// (CC BY-SA 4.0, derivado de BodyParts3D, CC BY-SA 2.1 Japón); su licencia
// y lo que se cambió, en modelos/LICENCIA.txt. Cada `id` es el nombre de una
// malla del .glb (test unitario).
//
// Pieza: { id, nombre, tipo, capa, sistema, anatomia? }
//   tipo     — de qué color se pinta (TIPOS_PIEZA).
//   capa     — 1 (la de fuera) a 7 (huesos): «Quitar capa» quita la de
//              fuera de las que quedan. Orden revisado en la revisión
//              anatómica (docs/entrena-3d.md, 2026-11).
//   sistema  — uno de SISTEMAS_3D: interruptores que se combinan con la capa.
//   anatomia — clave de ESTRUCTURAS (data/anatomia.js) para el enlace a
//              Kenhub, cuando la hay.
// ============================================================

export const SISTEMAS_3D = [
  { id: 'hueso', nombre: 'Huesos' },
  { id: 'articular', nombre: 'Ligamentos y cápsula' },
  { id: 'musculo', nombre: 'Músculos y tendones' },
  { id: 'neurovascular', nombre: 'Nervios y vasos' },
];

export const CAPAS_3D = [
  { n: 1, nombre: 'Fascia, cintilla iliotibial, retináculos, bursas subcutáneas y venas y nervio superficiales' },
  { n: 2, nombre: 'Músculos' },
  { n: 3, nombre: 'Ligamento rotuliano y bursas bajo los tendones' },
  { n: 4, nombre: 'Nervios y vasos' },
  { n: 5, nombre: 'Cápsula, colaterales, ligamentos posteriores y bursas profundas' },
  { n: 6, nombre: 'Interior de la articulación: cruzados, meniscos y grasa de Hoffa' },
  { n: 7, nombre: 'Huesos' },
];

// Opacidad de los tejidos translúcidos en el visor (los demás, opacos): se ve a través de ellos y
// un toque los atraviesa hasta la primera pieza opaca (entrena-3d.js y el test de alcance).
export const OPACIDAD_3D = { capsula: 0.55, fascia: 0.5, bursa: 0.85 };
// Colores de los lugares en «Recorre el árbol» (uno por hipótesis del paso, en su orden): ninguno es el
// de un tejido (ni el rojo de las arterias, ni el azul de las venas, ni el amarillo de los nervios).
export const COLORES_LUGARES = ['#ff2bd6', '#22c55e', '#f59e0b', '#06b6d4', '#8b5cf6', '#a3e635', '#c2410c'];
export const TIPOS_PIEZA = ['hueso', 'ligamento', 'menisco', 'capsula', 'sinovial', 'grasa', 'bursa', 'fascia', 'musculo', 'tendon', 'nervio', 'arteria', 'vena'];

const P = (id, nombre, tipo, capa, sistema, anatomia) => ({ id, nombre, tipo, capa, sistema, ...(anatomia ? { anatomia } : {}) });

const PIEZAS_RODILLA = [
  // Huesos
  P('femur', 'Fémur', 'hueso', 7, 'hueso', 'femur'),
  P('tibia', 'Tibia', 'hueso', 7, 'hueso', 'tibia'),
  P('perone', 'Peroné', 'hueso', 7, 'hueso', 'perone'),
  P('rotula', 'Rótula', 'hueso', 7, 'hueso', 'rotula'),
  // Interior de la articulación
  P('lca', 'Ligamento cruzado anterior', 'ligamento', 6, 'articular', 'lca'),
  P('lcp', 'Ligamento cruzado posterior', 'ligamento', 6, 'articular', 'lcp'),
  P('menisco_medial', 'Menisco medial', 'menisco', 6, 'articular', 'menisco_medial'),
  P('menisco_lateral', 'Menisco lateral', 'menisco', 6, 'articular', 'menisco_lateral'),
  P('lig_transverso', 'Ligamento transverso de la rodilla', 'ligamento', 6, 'articular'),
  P('meniscotibial_ant_med', 'Ligamento meniscotibial anterior (menisco medial)', 'ligamento', 6, 'articular'),
  P('meniscotibial_ant_lat', 'Ligamento meniscotibial anterior (menisco lateral)', 'ligamento', 6, 'articular'),
  P('meniscotibial_post_med', 'Ligamento meniscotibial posterior (menisco medial)', 'ligamento', 6, 'articular'),
  P('meniscotibial_post_lat', 'Ligamento meniscotibial posterior (menisco lateral)', 'ligamento', 6, 'articular'),
  P('meniscopatelar', 'Ligamento meniscorrotuliano', 'ligamento', 6, 'articular'),
  P('grasa_hoffa', 'Grasa de Hoffa (cuerpo adiposo infrarrotuliano)', 'grasa', 6, 'articular', 'grasa_hoffa'),
  // Cápsula, colaterales, ligamentos posteriores y bursas profundas
  P('capsula', 'Cápsula articular de la rodilla', 'capsula', 5, 'articular', 'art_rodilla'),
  P('lcm_superficial', 'Ligamento colateral medial (porción superficial)', 'ligamento', 5, 'articular', 'lcm'),
  P('lcm_profundo', 'Ligamento colateral medial (porción profunda)', 'ligamento', 5, 'articular', 'lcm'),
  P('lle', 'Ligamento colateral lateral', 'ligamento', 5, 'articular', 'lle'),
  P('popliteo_oblicuo', 'Ligamento poplíteo oblicuo', 'ligamento', 5, 'articular'),
  P('popliteo_arqueado', 'Ligamento poplíteo arqueado', 'ligamento', 5, 'articular'),
  P('popliteofibular', 'Ligamento popliteoperoneo', 'ligamento', 5, 'articular'),
  P('capsula_tibioperonea', 'Cápsula de la articulación tibioperonea proximal', 'capsula', 5, 'articular', 'art_tibioperonea'),
  P('lig_cabeza_perone_ant', 'Ligamento anterior de la cabeza del peroné', 'ligamento', 5, 'articular', 'art_tibioperonea'),
  P('lig_cabeza_perone_post', 'Ligamento posterior de la cabeza del peroné', 'ligamento', 5, 'articular', 'art_tibioperonea'),
  P('bursa_suprarrotuliana', 'Bursa suprarrotuliana', 'bursa', 5, 'articular'),
  // La única pieza que no viene de Z-Anatomy: dibujada por PhysiQ, esquemática (tools/modelo-3d/exportar.py, 5d;
  // decisión del usuario, 2026-11). Su nombre lo dice, para no confundirla con anatomía de la fuente.
  P('plica_medial', 'Plica medial (esquemática, dibujada por PhysiQ)', 'sinovial', 5, 'articular'),
  P('bursa_infrarrotuliana_profunda', 'Bursa infrarrotuliana profunda', 'bursa', 5, 'articular'),
  P('bursa_semimembranoso', 'Bursa del semimembranoso', 'bursa', 5, 'articular'),
  P('bursa_gemelo_medial', 'Bursa subtendinosa medial del gastrocnemio', 'bursa', 5, 'articular'),
  P('bursa_gemelo_lateral', 'Bursa subtendinosa lateral del gastrocnemio', 'bursa', 5, 'articular'),
  P('bursa_biceps', 'Bursa subtendinosa inferior del bíceps femoral', 'bursa', 5, 'articular'),
  // Nervios y vasos
  P('nervio_ciatico', 'Nervio ciático', 'nervio', 4, 'neurovascular'),
  P('nervio_tibial', 'Nervio tibial', 'nervio', 4, 'neurovascular'),
  P('nervio_peroneo_comun', 'Nervio peroneo común', 'nervio', 4, 'neurovascular', 'nervio_peroneo_comun'),
  P('nervio_safeno', 'Nervio safeno', 'nervio', 4, 'neurovascular'),
  P('nervio_peroneo_superficial', 'Nervio peroneo superficial', 'nervio', 4, 'neurovascular'),
  P('nervio_peroneo_profundo', 'Nervio peroneo profundo', 'nervio', 4, 'neurovascular'),
  P('arteria_femoral', 'Arteria femoral', 'arteria', 4, 'neurovascular', 'arteria_femoral'),
  P('arteria_poplitea', 'Arteria poplítea', 'arteria', 4, 'neurovascular', 'arteria_poplitea'),
  P('vena_femoral', 'Vena femoral', 'vena', 4, 'neurovascular', 'venas_miembro_inferior'),
  P('vena_poplitea', 'Vena poplítea', 'vena', 4, 'neurovascular', 'vena_poplitea'),
  P('arteria_tibial_anterior', 'Arteria tibial anterior', 'arteria', 4, 'neurovascular'),
  P('arteria_tibial_posterior', 'Arteria tibial posterior', 'arteria', 4, 'neurovascular', 'arteria_tibial_posterior'),
  P('arteria_peronea', 'Arteria peronea', 'arteria', 4, 'neurovascular'),
  P('geniculada_sup_med', 'Arteria geniculada superior medial', 'arteria', 4, 'neurovascular'),
  P('geniculada_sup_lat', 'Arteria geniculada superior lateral', 'arteria', 4, 'neurovascular'),
  P('geniculada_inf_med', 'Arteria geniculada inferior medial', 'arteria', 4, 'neurovascular'),
  P('geniculada_inf_lat', 'Arteria geniculada inferior lateral', 'arteria', 4, 'neurovascular'),
  P('geniculada_media', 'Arteria geniculada media', 'arteria', 4, 'neurovascular'),
  // Ligamento rotuliano y bursas bajo los tendones
  P('ligamento_rotuliano', 'Ligamento (tendón) rotuliano', 'tendon', 3, 'musculo', 'tendon_rotuliano'),
  P('bursa_anserina', 'Bursa anserina', 'bursa', 3, 'articular', 'pata_ganso'),
  P('bursa_sartorio', 'Bursa subtendinosa del sartorio', 'bursa', 3, 'articular'),
  P('bursa_prerrotuliana_subfascial', 'Bursa prerrotuliana subfascial', 'bursa', 3, 'articular', 'bursa_prerrotuliana'),
  P('bursa_prerrotuliana_subtendinosa', 'Bursa prerrotuliana subtendinosa', 'bursa', 3, 'articular', 'bursa_prerrotuliana'),
  // Músculos
  P('recto_femoral', 'Recto femoral', 'musculo', 2, 'musculo', 'cuadriceps'),
  P('vasto_lateral', 'Vasto lateral', 'musculo', 2, 'musculo', 'cuadriceps'),
  P('vasto_medial', 'Vasto medial', 'musculo', 2, 'musculo', 'cuadriceps'),
  P('vasto_intermedio', 'Vasto intermedio', 'musculo', 2, 'musculo', 'cuadriceps'),
  P('sartorio', 'Sartorio', 'musculo', 2, 'musculo'),
  P('gracil', 'Grácil', 'musculo', 2, 'musculo'),
  P('semitendinoso', 'Semitendinoso', 'musculo', 2, 'musculo'),
  P('semimembranoso', 'Semimembranoso', 'musculo', 2, 'musculo', 'semimembranoso'),
  P('biceps_largo', 'Bíceps femoral (cabeza larga)', 'musculo', 2, 'musculo', 'biceps_femoral'),
  P('biceps_corto', 'Bíceps femoral (cabeza corta)', 'musculo', 2, 'musculo', 'biceps_femoral'),
  P('gemelo_medial', 'Gastrocnemio (cabeza medial)', 'musculo', 2, 'musculo', 'gastrocnemio'),
  P('gemelo_lateral', 'Gastrocnemio (cabeza lateral)', 'musculo', 2, 'musculo', 'gastrocnemio'),
  P('plantar', 'Plantar', 'musculo', 2, 'musculo'),
  P('popliteo', 'Poplíteo', 'musculo', 2, 'musculo', 'popliteo'),
  P('soleo', 'Sóleo', 'musculo', 2, 'musculo'),
  P('tibial_anterior', 'Tibial anterior', 'musculo', 2, 'musculo'),
  P('peroneo_largo', 'Peroneo largo', 'musculo', 2, 'musculo'),
  P('extensor_largo_dedos', 'Extensor largo de los dedos', 'musculo', 2, 'musculo'),
  P('aductor_mayor', 'Aductor mayor', 'musculo', 2, 'musculo', 'aductores_cadera'),
  // Fascia, cintilla, retináculos y bursas subcutáneas
  P('fascia_lata', 'Fascia lata', 'fascia', 1, 'musculo'),
  P('fascia_crural', 'Fascia crural', 'fascia', 1, 'musculo'),
  P('fascia_poplitea', 'Fascia poplítea', 'fascia', 1, 'musculo'),
  P('cintilla_iliotibial', 'Cintilla iliotibial', 'fascia', 1, 'musculo', 'banda_iliotibial'),
  P('retinaculo_medial', 'Retináculo rotuliano medial', 'fascia', 1, 'articular'),
  P('retinaculo_lateral', 'Retináculo rotuliano lateral', 'fascia', 1, 'articular'),
  P('bursa_prerrotuliana_subcutanea', 'Bursa prerrotuliana subcutánea', 'bursa', 1, 'articular', 'bursa_prerrotuliana'),
  P('bursa_infrarrotuliana_subcutanea', 'Bursa infrarrotuliana subcutánea', 'bursa', 1, 'articular'),
  P('bursa_tuberosidad', 'Bursa subcutánea de la tuberosidad tibial', 'bursa', 1, 'articular'),
  // Venas y nervio subcutáneos: se quitan con la capa de fuera (revisión anatómica, 2026-11)
  P('vena_safena_mayor', 'Vena safena mayor', 'vena', 1, 'neurovascular', 'venas_miembro_inferior'),
  P('vena_safena_menor', 'Vena safena menor', 'vena', 1, 'neurovascular', 'venas_miembro_inferior'),
  P('rama_infrarrotuliana', 'Rama infrarrotuliana del nervio safeno', 'nervio', 1, 'neurovascular'),
];

// Puntos de referencia: posición en modelos/rodilla-puntos.json (la escribe
// el script, de las etiquetas de Z-Anatomy). Para lo que no es una pieza
// entera («tuberosidad tibial»).
const ZONAS_RODILLA = [
  { id: 'tuberosidad_tibial', nombre: 'Tuberosidad tibial' },
  { id: 'polo_inferior_rotula', nombre: 'Polo inferior de la rótula' },
  { id: 'epicondilo_femoral_lateral', nombre: 'Epicóndilo femoral lateral' },
  { id: 'epicondilo_femoral_medial', nombre: 'Epicóndilo femoral medial' },
  { id: 'condilo_femoral_lateral', nombre: 'Cóndilo femoral lateral' },
  { id: 'condilo_femoral_medial', nombre: 'Cóndilo femoral medial' },
  { id: 'condilo_tibial_lateral', nombre: 'Cóndilo tibial lateral' },
  { id: 'condilo_tibial_medial', nombre: 'Cóndilo tibial medial' },
  { id: 'meseta_tibial', nombre: 'Meseta tibial' },
  { id: 'cabeza_perone', nombre: 'Cabeza del peroné' },
  { id: 'cuello_perone', nombre: 'Cuello del peroné' },
  { id: 'tuberculo_iliotibial', nombre: 'Tubérculo de Gerdy' },
  { id: 'tuberculo_aductor', nombre: 'Tubérculo del aductor' },
  { id: 'fosa_intercondilea', nombre: 'Fosa intercondílea' },
  { id: 'superficie_rotuliana_femur', nombre: 'Tróclea femoral' },
];

// Vistas: dirección desde la que mira la cámara, en el sistema del .glb
// (Y arriba, Z hacia delante; rodilla derecha, así que medial es +X).
const VISTAS_RODILLA = [
  { id: 'anterior', nombre: 'Anterior', dir: [0, 0, 1] },
  { id: 'medial', nombre: 'Medial', dir: [1, 0, 0] },
  { id: 'lateral', nombre: 'Lateral', dir: [-1, 0, 0] },
  { id: 'posterior', nombre: 'Posterior', dir: [0, 0, -1] },
];

export const MODELOS_3D = {
  rodilla: {
    lado: 'derecha',
    archivo: 'modelos/rodilla.glb',
    puntos: 'modelos/rodilla-puntos.json',
    piezas: PIEZAS_RODILLA,
    zonas: ZONAS_RODILLA,
    vistas: VISTAS_RODILLA,
    credito: 'Modelo: Z-Anatomy (CC BY-SA 4.0), derivado de BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japón); recortado y simplificado por PhysiQ, que dibujó la plica medial (esquemática). Visor: three.js (MIT).',
  },
};
