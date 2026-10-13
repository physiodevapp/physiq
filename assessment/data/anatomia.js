// ============================================================
// PhysiQ-Assessment · DATA/ANATOMIA.JS
// Estructuras anatómicas que los tests de la fase 4b enlazan a Kenhub
// («Anatomía: Supraespinoso ↗» bajo la fuente del test). Diseño y
// procedimiento por región: docs/anatomia-kenhub.md (Fase K de
// MIGRATION_PLAN.md).
//
// Una entrada por estructura, con la clave que usan los tests en
// `anatomia: ['<clave>']`:
//   nombre — lo que se lee en el enlace (español).
//   kenhub — slug del artículo en inglés: KENHUB_BASE + kenhub. Existe
//            siempre y es el respaldo.
//   kenhubEs? — slug de la versión en español, cuando Kenhub la tiene:
//            KENHUB_BASE_ES + kenhubEs. Es la que se enlaza; sin ella, la
//            inglesa (el enlace lo dice). Se copia del
//            <link rel="alternate" hreflang="es"> del artículo inglés.
//            Cada URL, en los dos idiomas, se ha abierto y da 200 con el
//            título de la estructura (2026-10).
//   nota?  — cuando la estructura no tiene artículo propio y se enlaza
//            el que la trata (se ve en el `title` del enlace).
//
// Las usan los tests de la fase 4b y las preguntas de cribado de la fase 2
// (`anatomia` en la pregunta, junto a su `razonamiento`).
//
// Varias estructuras pueden compartir artículo (labrum → articulación
// glenohumeral), pero no dentro del mismo test (test unitario).
// ============================================================

export const KENHUB_BASE = 'https://www.kenhub.com/en/library/anatomy/';
export const KENHUB_BASE_ES = 'https://www.kenhub.com/es/library/anatomia-es/';

export const ESTRUCTURAS = {
  // Hombro
  manguito_rotador:     { nombre: 'Manguito rotador', kenhub: 'the-rotator-cuff', kenhubEs: 'manguito-rotador' },
  supraespinoso:        { nombre: 'Supraespinoso', kenhub: 'supraspinatus-muscle', kenhubEs: 'musculo-supraespinoso' },
  infraespinoso:        { nombre: 'Infraespinoso', kenhub: 'infraspinatus-muscle', kenhubEs: 'musculo-infraespinoso' },
  redondo_menor:        { nombre: 'Redondo menor', kenhub: 'teres-minor-muscle', kenhubEs: 'musculo-redondo-menor-es' },
  subescapular:         { nombre: 'Subescapular', kenhub: 'subscapularis-muscle', kenhubEs: 'musculo-subescapular-es' },
  bursa_subacromial:    { nombre: 'Bursa subacromial', kenhub: 'subacromial-bursa' },
  ligamento_coracoacromial: { nombre: 'Ligamento coracoacromial', kenhub: 'coracoacromial-ligament' },
  ligamento_coracohumeral:  { nombre: 'Ligamento coracohumeral', kenhub: 'coracohumeral-ligament' },
  art_glenohumeral:     { nombre: 'Articulación glenohumeral', kenhub: 'the-shoulder-joint', kenhubEs: 'articulacion-glenohumeral' },
  labrum_glenoideo:     { nombre: 'Labrum glenoideo', kenhub: 'the-shoulder-joint', kenhubEs: 'articulacion-glenohumeral', nota: 'Sin artículo propio: se trata en «Articulación glenohumeral»' },
  biceps_braquial:      { nombre: 'Bíceps braquial', kenhub: 'biceps-brachii-muscle', kenhubEs: 'musculo-biceps-braquial' },
  art_acromioclavicular: { nombre: 'Articulación acromioclavicular', kenhub: 'acromioclavicular-ac-joint', kenhubEs: 'articulacion-acromioclavicular' },
  escapula:             { nombre: 'Escápula', kenhub: 'scapula', kenhubEs: 'escapula-omoplato' },
  serrato_anterior:     { nombre: 'Serrato anterior', kenhub: 'serratus-anterior-muscle', kenhubEs: 'musculo-serrato-anterior' },
  trapecio:             { nombre: 'Trapecio', kenhub: 'trapezius-muscle', kenhubEs: 'musculo-trapecio' },
  humero:               { nombre: 'Húmero', kenhub: 'the-humerus', kenhubEs: 'humero' },
  costillas:            { nombre: 'Costillas (1.ª costilla)', kenhub: 'the-ribs', kenhubEs: 'costillas' },
  escalenos:            { nombre: 'Escalenos', kenhub: 'scalene-muscles', kenhubEs: 'musculos-escalenos-es' },
  columna_cervical:     { nombre: 'Columna cervical', kenhub: 'cervical-spine', kenhubEs: 'vertebras-cervicales' },
  // Hombro, fase 2: vísceras y nervios que refieren dolor al hombro
  plexo_braquial:       { nombre: 'Plexo braquial', kenhub: 'brachial-plexus', kenhubEs: 'plexo-braquial-es' },
  nervio_frenico:       { nombre: 'Nervio frénico', kenhub: 'phrenic-nerve', kenhubEs: 'nervio-frenico' },
  diafragma:            { nombre: 'Diafragma', kenhub: 'diaphragm', kenhubEs: 'diafragma-es' },
  corazon:              { nombre: 'Corazón', kenhub: 'heart', kenhubEs: 'corazon' },
  pulmones:             { nombre: 'Pulmones', kenhub: 'the-lung', kenhubEs: 'vision-general-de-la-anatomia-pulmonar' },
  pleura:               { nombre: 'Pleura', kenhub: 'pleura', kenhubEs: 'pleura-es' },
  rinon:                { nombre: 'Riñón', kenhub: 'kidneys', kenhubEs: 'anatomia-de-los-rinones' },
  higado:               { nombre: 'Hígado', kenhub: 'liver', kenhubEs: 'higado' },
  vesicula_biliar:      { nombre: 'Vesícula biliar', kenhub: 'gallbladder', kenhubEs: 'vesicula-biliar-es' },
  estomago:             { nombre: 'Estómago', kenhub: 'the-stomach', kenhubEs: 'estomago-es' },
  clavicula:            { nombre: 'Clavícula', kenhub: 'the-clavicle', kenhubEs: 'clavicula-anatomia' },
  // Rodilla
  art_rodilla:          { nombre: 'Articulación de la rodilla', kenhub: 'the-knee-joint', kenhubEs: 'articulacion-de-la-rodilla' },
  menisco_medial:       { nombre: 'Menisco medial', kenhub: 'medial-meniscus' },
  menisco_lateral:      { nombre: 'Menisco lateral', kenhub: 'lateral-meniscus' },
  lca:                  { nombre: 'Ligamento cruzado anterior', kenhub: 'anterior-cruciate-ligament' },
  lcp:                  { nombre: 'Ligamento cruzado posterior', kenhub: 'posterior-cruciate-ligament', kenhubEs: 'ligamento-cruzado-posterior' },
  lcm:                  { nombre: 'Ligamento colateral medial', kenhub: 'the-knee-joint', kenhubEs: 'articulacion-de-la-rodilla', nota: 'Sin artículo propio: se trata en «Articulación de la rodilla»' },
  lle:                  { nombre: 'Ligamento colateral lateral', kenhub: 'the-knee-joint', kenhubEs: 'articulacion-de-la-rodilla', nota: 'Sin artículo propio: se trata en «Articulación de la rodilla»' },
  bursa_prerrotuliana:  { nombre: 'Bursa prerrotuliana', kenhub: 'the-knee-joint', kenhubEs: 'articulacion-de-la-rodilla', nota: 'Sin artículo propio: se trata en «Articulación de la rodilla»' },
  grasa_hoffa:          { nombre: 'Grasa de Hoffa', kenhub: 'the-knee-joint', kenhubEs: 'articulacion-de-la-rodilla', nota: 'Sin artículo propio: se trata en «Articulación de la rodilla»' },
  rotula:               { nombre: 'Rótula', kenhub: 'patella', kenhubEs: 'rotula-patela' },
  art_patelofemoral:    { nombre: 'Articulación patelofemoral', kenhub: 'patellofemoral-joint' },
  tendon_rotuliano:     { nombre: 'Tendón rotuliano', kenhub: 'patellar-tendon', kenhubEs: 'tendon-rotuliano-patelar' },
  cuadriceps:           { nombre: 'Cuádriceps', kenhub: 'the-quadriceps-femoris-muscle', kenhubEs: 'musculo-cuadriceps-femoral' },
  banda_iliotibial:     { nombre: 'Cintilla iliotibial', kenhub: 'iliotibial-band', kenhubEs: 'tracto-iliotibial' },
  tensor_fascia_lata:   { nombre: 'Tensor de la fascia lata', kenhub: 'tensor-fasciae-latae-muscle', kenhubEs: 'tensor-de-la-fascia-lata' },
  gluteo_medio:         { nombre: 'Glúteo medio', kenhub: 'gluteus-medius-and-minimus-muscles', kenhubEs: 'musculo-gluteo-medio' },
  pata_ganso:           { nombre: 'Pata de ganso', kenhub: 'pes-anserinus' },
  popliteo:             { nombre: 'Poplíteo', kenhub: 'popliteus-muscle', kenhubEs: 'musculo-popliteo-es' },
  tibia:                { nombre: 'Tibia', kenhub: 'tibia', kenhubEs: 'tibia-es' },
  perone:               { nombre: 'Peroné', kenhub: 'fibula', kenhubEs: 'fibula-es' },
  femur:                { nombre: 'Fémur', kenhub: 'femur', kenhubEs: 'femur-anatomia' },
  art_tibioperonea:     { nombre: 'Articulación tibioperonea', kenhub: 'tibiofibular-joints' },
  biceps_femoral:       { nombre: 'Bíceps femoral', kenhub: 'biceps-femoris-muscle', kenhubEs: 'biceps-femoral' },
  nervio_peroneo_comun: { nombre: 'Nervio peroneo común', kenhub: 'common-fibular-nerve' },
  fosa_poplitea:        { nombre: 'Fosa poplítea', kenhub: 'popliteal-fossa', kenhubEs: 'fosa-poplitea' },
  semimembranoso:       { nombre: 'Semimembranoso', kenhub: 'semimembranosus-muscle', kenhubEs: 'musculo-semimembranoso-es' },
  gastrocnemio:         { nombre: 'Gastrocnemio', kenhub: 'gastrocnemius-muscle', kenhubEs: 'musculo-gastrocnemio-es' },
  // Rodilla, fase 2: vasos, nervios y cadera
  arteria_femoral:      { nombre: 'Arteria femoral', kenhub: 'femoral-artery', kenhubEs: 'arteria-femoral' },
  arteria_poplitea:     { nombre: 'Arteria poplítea', kenhub: 'popliteal-artery', kenhubEs: 'arteria-poplitea-es' },
  venas_miembro_inferior: { nombre: 'Venas del miembro inferior', kenhub: 'veins-of-the-lower-limb' },
  vena_poplitea:        { nombre: 'Vena poplítea', kenhub: 'popliteal-vein' },
  art_cadera:           { nombre: 'Articulación de la cadera', kenhub: 'hip-joint', kenhubEs: 'articulacion-coxofemoral' },
  nervio_obturador:     { nombre: 'Nervio obturador', kenhub: 'obturator-nerve', kenhubEs: 'nervio-obturador' },
};
