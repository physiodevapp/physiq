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
  // Codo
  art_codo:             { nombre: 'Articulación del codo', kenhub: 'elbow-joint', kenhubEs: 'articulacion-del-codo' },
  lcc_codo:             { nombre: 'Ligamento colateral cubital', kenhub: 'elbow-joint', kenhubEs: 'articulacion-del-codo', nota: 'Sin artículo propio: se trata en «Articulación del codo»' },
  colateral_lateral_codo: { nombre: 'Complejo colateral lateral', kenhub: 'elbow-joint', kenhubEs: 'articulacion-del-codo', nota: 'Sin artículo propio: se trata en «Articulación del codo»' },
  radio_cubito:         { nombre: 'Radio y cúbito', kenhub: 'the-radius-and-the-ulna', kenhubEs: 'radio-y-ulna-cubito' },
  cabeza_radio:         { nombre: 'Cabeza del radio', kenhub: 'head-of-radius', kenhubEs: 'cabeza-del-radio' },
  art_radiocubital_proximal: { nombre: 'Articulación radiocubital proximal', kenhub: 'proximal-radioulnar-joint' },
  extensor_radial_corto_carpo: { nombre: 'Extensor radial corto del carpo', kenhub: 'extensor-carpi-radialis-brevis-muscle' },
  pronador_redondo:     { nombre: 'Pronador redondo', kenhub: 'pronator-teres-muscle', kenhubEs: 'musculo-pronador-redondo-es' },
  flexor_radial_carpo:  { nombre: 'Flexor radial del carpo', kenhub: 'flexor-carpi-radialis-muscle' },
  supinador:            { nombre: 'Supinador', kenhub: 'supinator-muscle', kenhubEs: 'musculo-supinador-es' },
  triceps:              { nombre: 'Tríceps braquial', kenhub: 'triceps-brachii-muscle', kenhubEs: 'musculo-triceps-braquial' },
  nervio_cubital:       { nombre: 'Nervio cubital', kenhub: 'the-ulnar-nerve', kenhubEs: 'nervio-cubital-ulnar' },
  nervio_radial:        { nombre: 'Nervio radial', kenhub: 'radial-nerve', kenhubEs: 'nervio-radial' },
  nervio_mediano:       { nombre: 'Nervio mediano', kenhub: 'the-median-nerve', kenhubEs: 'nervio-mediano' },
  flexor_largo_pulgar:  { nombre: 'Flexor largo del pulgar', kenhub: 'flexor-pollicis-longus-muscle' },
  flexor_profundo_dedos: { nombre: 'Flexor profundo de los dedos', kenhub: 'flexor-digitorum-profundus-muscle' },
  // Codo, fase 2: vasos
  arteria_braquial:     { nombre: 'Arteria braquial', kenhub: 'brachial-artery', kenhubEs: 'arteria-braquial-humeral' },
  arteria_subclavia:    { nombre: 'Arteria subclavia', kenhub: 'the-subclavian-artery', kenhubEs: 'artieria-subclavia-anatomia' },
  // Cervical
  art_atlantoaxial:     { nombre: 'Articulación atlantoaxial (C1–C2)', kenhub: 'atlantoaxial-joint' },
  art_facetarias:       { nombre: 'Articulaciones cigapofisarias', kenhub: 'zygapophyseal-joints', kenhubEs: 'articulaciones-cigapofisarias' },
  largo_cuello:         { nombre: 'Largo del cuello', kenhub: 'longus-colli-muscle', kenhubEs: 'musculo-largo-del-cuello' },
  semiespinoso_cabeza:  { nombre: 'Semiespinoso de la cabeza', kenhub: 'semispinalis-capitis-muscle' },
  esplenio_cabeza:      { nombre: 'Esplenio de la cabeza', kenhub: 'splenius-capitis-muscle', kenhubEs: 'musculo-esplenio-de-la-cabeza' },
  suboccipitales:       { nombre: 'Músculos suboccipitales', kenhub: 'suboccipital-muscles' },
  esternocleidomastoideo: { nombre: 'Esternocleidomastoideo', kenhub: 'sternocleidomastoid-muscle', kenhubEs: 'musculo-esternocleidomastoideo-es' },
  nervios_espinales:    { nombre: 'Nervios espinales (raíces)', kenhub: 'spinal-nerves', kenhubEs: 'nervios-espinales' },
  medula_espinal:       { nombre: 'Médula espinal', kenhub: 'the-spinal-cord', kenhubEs: 'medula-espinal-es' },
  vertebras_toracicas:  { nombre: 'Vértebras torácicas', kenhub: 'thoracic-vertebrae', kenhubEs: 'vertebras-toracicas-es' },
  // Cervical, fase 2: arterias del cuello y esófago
  arteria_vertebral:    { nombre: 'Arteria vertebral', kenhub: 'vertebral-artery', kenhubEs: 'arteria-vertebral' },
  arteria_carotida:     { nombre: 'Arteria carótida común', kenhub: 'common-carotid-artery', kenhubEs: 'arteria-carotida-comun' },
  esofago:              { nombre: 'Esófago', kenhub: 'esophagus', kenhubEs: 'esofago-es' },
  // Cadera
  labrum_acetabular:    { nombre: 'Labrum acetabular', kenhub: 'acetabular-labrum' },
  trocanter_mayor:      { nombre: 'Trocánter mayor', kenhub: 'greater-trochanter-of-femur' },
  piriforme:            { nombre: 'Piriforme', kenhub: 'piriformis-muscle', kenhubEs: 'musculo-piriforme-piramidal-de-la-pelvis' },
  nervio_ciatico:       { nombre: 'Nervio ciático', kenhub: 'the-sciatic-nerve', kenhubEs: 'nervio-ciatico' },
  cuadrado_femoral:     { nombre: 'Cuadrado femoral', kenhub: 'quadratus-femoris-muscle' },
  isquiotibiales:       { nombre: 'Isquiotibiales', kenhub: 'posterior-thigh-muscles' },
  tuberosidad_isquiatica: { nombre: 'Tuberosidad isquiática', kenhub: 'ischial-tuberosity', kenhubEs: 'tuberosidad-isquiatica' },
  hueso_coxal:          { nombre: 'Hueso coxal (pelvis)', kenhub: 'hip-bone', kenhubEs: 'hueso-coxal' },
  art_sacroiliaca:      { nombre: 'Articulación sacroilíaca', kenhub: 'sacroiliac-joint', kenhubEs: 'articulacion-sacroiliaca' },
  aductores_cadera:     { nombre: 'Aductores de la cadera', kenhub: 'the-hip-adductors' },
  iliopsoas:            { nombre: 'Iliopsoas', kenhub: 'iliopsoas-muscle', kenhubEs: 'musculo-iliopsoas-es' },
  recto_abdominal:      { nombre: 'Recto del abdomen', kenhub: 'rectus-abdominis-muscle', kenhubEs: 'musculo-recto-del-abdomen' },
  canal_inguinal:       { nombre: 'Conducto inguinal', kenhub: 'inguinal-canal', kenhubEs: 'conducto-inguinal' },
  sinfisis_pubis:       { nombre: 'Sínfisis del pubis', kenhub: 'pubic-symphysis', kenhubEs: 'sinfisis-del-pubis' },
  nervio_femorocutaneo: { nombre: 'Nervio femorocutáneo lateral', kenhub: 'lateral-femoral-cutaneous-nerve' },
  nervio_ilioinguinal:  { nombre: 'Nervio ilioinguinal', kenhub: 'ilioinguinal-nerve' },
  nervio_iliohipogastrico: { nombre: 'Nervio iliohipogástrico', kenhub: 'iliohypogastric-nerve' },
  nervio_genitofemoral: { nombre: 'Nervio genitofemoral', kenhub: 'genitofemoral-nerve', kenhubEs: 'nervio-genitofemoral' },
  nervio_pudendo:       { nombre: 'Nervio pudendo', kenhub: 'pudendal-nerve', kenhubEs: 'nervio-pudendo' },
  // Cadera, fase 2: ganglios, vísceras pélvicas y abdominales
  ganglios_inguinales:  { nombre: 'Ganglios linfáticos inguinales', kenhub: 'inguinal-lymph-nodes', kenhubEs: 'ganglios-linfaticos-inguinales' },
  triangulo_femoral:    { nombre: 'Triángulo femoral', kenhub: 'femoral-triangle', kenhubEs: 'triangulo-femoral' },
  ureteres:             { nombre: 'Uréteres', kenhub: 'the-ureters', kenhubEs: 'ureteres-es' },
  prostata:             { nombre: 'Próstata', kenhub: 'the-prostate-gland', kenhubEs: 'prostata' },
  testiculos:           { nombre: 'Testículos', kenhub: 'the-testes', kenhubEs: 'testiculos-es' },
  organos_reproductores_femeninos: { nombre: 'Órganos reproductores femeninos', kenhub: 'female-reproductive-organs', kenhubEs: 'organos-del-aparato-reproductor-femenino' },
  intestino_grueso:     { nombre: 'Intestino grueso', kenhub: 'large-intestine', kenhubEs: 'intestino-grueso' },
  // Lumbar
  columna_lumbar:       { nombre: 'Columna lumbar', kenhub: 'lumbar-vertebrae', kenhubEs: 'columna-lumbar' },
  discos_intervertebrales: { nombre: 'Discos intervertebrales', kenhub: 'the-intervertebral-discs', kenhubEs: 'discos-intervertebrales' },
  canal_vertebral:      { nombre: 'Canal vertebral', kenhub: 'vertebral-canal' },
  cola_caballo:         { nombre: 'Cono medular y cola de caballo', kenhub: 'conus-medullaris-medullary-cone-and-cauda-equina' },
  plexo_lumbar:         { nombre: 'Plexo lumbar', kenhub: 'lumbar-plexus', kenhubEs: 'plexo-lumbar' },
  plexo_sacro:          { nombre: 'Plexo sacro', kenhub: 'sacral-plexus', kenhubEs: 'plexo-sacro' },
  multifido:            { nombre: 'Multífido', kenhub: 'multifidus-muscle' },
  sacro:                { nombre: 'Sacro', kenhub: 'sacrum', kenhubEs: 'sacro-es' },
  // Lumbar, fase 2: vejiga, duodeno y aorta
  vejiga:               { nombre: 'Vejiga urinaria', kenhub: 'urinary-bladder', kenhubEs: 'vejiga-urinaria' },
  duodeno:              { nombre: 'Duodeno', kenhub: 'the-duodenum', kenhubEs: 'duodeno-es' },
  aorta:                { nombre: 'Aorta', kenhub: 'aorta', kenhubEs: 'aorta-es' },
  // Tobillo y pie
  art_tobillo:          { nombre: 'Articulación del tobillo', kenhub: 'the-ankle-joint', kenhubEs: 'articulacion-talocrural' },
  lpaa:                 { nombre: 'Ligamento peroneoastragalino anterior', kenhub: 'anterior-talofibular-ligament' },
  lpc:                  { nombre: 'Ligamento peroneocalcáneo', kenhub: 'calcaneofibular-ligament', kenhubEs: 'ligamento-calcaneofibular' },
  art_subastragalina:   { nombre: 'Articulación subastragalina (seno del tarso)', kenhub: 'subtalar-joint' },
  art_mediotarsiana:    { nombre: 'Articulación mediotarsiana (calcaneocuboidea)', kenhub: 'transverse-tarsal-joint' },
  art_tarsometatarsianas: { nombre: 'Articulaciones tarsometatarsianas (Lisfranc)', kenhub: 'tarsometatarsal-joint' },
  art_mtf:              { nombre: 'Articulaciones metatarsofalángicas (sesamoideos)', kenhub: 'metatarsophalangeal-mtp-joints' },
  astragalo:            { nombre: 'Astrágalo', kenhub: 'talus', kenhubEs: 'talus-astragalo' },
  calcaneo:             { nombre: 'Calcáneo', kenhub: 'calcaneus', kenhubEs: 'calcaneo' },
  navicular:            { nombre: 'Navicular', kenhub: 'navicular-bone', kenhubEs: 'hueso-navicular' },
  cuboides:             { nombre: 'Cuboides', kenhub: 'cuboid' },
  cuneiformes:          { nombre: 'Cuñas', kenhub: 'cuneiform-bones' },
  huesos_tarso:         { nombre: 'Huesos del tarso', kenhub: 'tarsal-bones', kenhubEs: 'huesos-del-tarso' },
  metatarsianos:        { nombre: 'Metatarsianos', kenhub: 'metatarsal-bones' },
  arcos_pie:            { nombre: 'Arcos del pie', kenhub: 'arches-of-the-foot' },
  aquiles:              { nombre: 'Tendón de Aquiles', kenhub: 'achilles-tendon' },
  soleo:                { nombre: 'Sóleo', kenhub: 'soleus-muscle', kenhubEs: 'musculo-soleo-es' },
  plantar_delgado:      { nombre: 'Plantar delgado', kenhub: 'plantaris-muscle', kenhubEs: 'musculo-plantar' },
  tibial_posterior:     { nombre: 'Tibial posterior', kenhub: 'tibialis-posterior-muscle', kenhubEs: 'musculo-tibial-posterior-es' },
  flexor_largo_primer_dedo: { nombre: 'Flexor largo del primer dedo', kenhub: 'flexor-hallucis-longus-muscle' },
  peroneo_largo:        { nombre: 'Peroneo largo', kenhub: 'peroneus-longus-muscle' },
  peroneo_corto:        { nombre: 'Peroneo corto', kenhub: 'fibularis-brevis-muscle' },
  fascias_pierna_pie:   { nombre: 'Fascias de la pierna y el pie (fascia plantar, compartimentos)', kenhub: 'fascias-of-the-leg-and-foot' },
  nervio_tibial:        { nombre: 'Nervio tibial (túnel del tarso, ramos calcáneos)', kenhub: 'tibial-nerve', kenhubEs: 'nervio-tibial' },
  nervio_sural:         { nombre: 'Nervio sural', kenhub: 'sural-nerve', kenhubEs: 'nervio-sural' },
  arteria_pedia:        { nombre: 'Arteria dorsal del pie (pedia)', kenhub: 'dorsalis-pedis-artery' },
  arteria_tibial_posterior: { nombre: 'Arteria tibial posterior', kenhub: 'posterior-tibial-artery', kenhubEs: 'arteria-tibial-posterior' },
};
