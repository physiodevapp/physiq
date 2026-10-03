// ============================================================
// Registro central de referencias bibliográficas.
//
// Una entrada por referencia que cita data/. La clave es la forma corta con
// la que aparece en las citas («Autor Año», «Autor y Autor Año», «NICE NG226»):
// tests/referencias.mjs la busca en todos los textos de data/ y tests/unit.js
// falla si una cita nombra una referencia que no está aquí, o si aquí hay una
// que ya no se cita en ningún sitio.
//
// Las citas siguen escritas enteras en cada `fuente` (con su tabla, n, IC...):
// es lo que ve el clínico, y este registro no la cambia. El registro guarda lo
// que es de la referencia, no de cada uso:
//   publicacion  revista y volumen:páginas, tal como vienen en las citas de
//                data/ (no se ha añadido nada que no estuviera ya en ellas)
//   doi          vacío hasta que alguien lo compruebe en el artículo
//   revision     null = nunca revisada. Si no, { fecha: 'AAAA-MM', resultado }:
//                la última vez que se buscó literatura más reciente y qué se
//                concluyó («Sin cambios: …», «Sustituida por …», «Cifras
//                actualizadas en …»)
//   url          opcional: enlace al texto (PMC, DOI, NCBI Bookshelf). Las citas del
//                razonamiento de fase 2 que llevan enlace tienen que usar este mismo
//                (lo comprueba tests/unit.js)
//   autores, titulo, nota  opcionales
//   citadaComo   opcional: textos con los que data/ la cita cuando no lleva
//                «Autor Año» (p. ej. 'Criterio de Goodman'); cuentan como usos
//   tarjetas     true solo en la referencia en la que se basan las tarjetas de
//                consulta (en data/ se citan como «Tarjeta de consulta <región>»)
//
// Este archivo no lo importa la app: solo lo usan las pruebas y el generador
// de docs/referencias.md. Cómo revisar una referencia: ver el principio de
// docs/referencias.md.
// ============================================================

export const REFERENCIAS = {
  'Lluch 2020': {
    autores: 'Lluch, López-Cubas, Jones, Jull, Hall y Lewis',
    titulo: 'Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders',
    publicacion: 'ZERAPI', doi: '', revision: null, tarjetas: true,
    nota: 'Base de las guías clínicas de cada región, de las que son extracto las tarjetas de consulta (repo guia-de-consulta). Los capítulos que citan los pies de las tarjetas (Struyf y Powell y Lewis, cap. 3, en hombro; Fondevila Suárez, cap. 5, en lumbar) son de este libro.'
  },
  'Goodman 2018': {
    autores: 'Goodman, Heick y Lazaro',
    titulo: 'Differential Diagnosis for Physical Therapists: Screening for Referral',
    publicacion: 'Elsevier, 6.ª edición', doi: '', revision: null,
    citadaComo: ['Criterio de Goodman'],
    nota: 'El cribado de fase 2 lo cita sin año («Criterio de Goodman (cap. 14)»).'
  },
  'NICE NG226': {
    publicacion: 'Guía NICE (2022)', doi: '',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: solo respalda el diagnóstico clínico (edad ≥45, dolor con la actividad, rigidez matutina ausente o ≤30 min), sin S ni E; no puntúa. No se pudo abrir nice.org.uk (bloqueado por la red) para comprobar si hay actualización.' }
  },
  'Adib 2023': {
    publicacion: 'Am J Sports Med 51(4):1007–14', doi: '10.1177/03635465221149748',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: S y E del Arlington y del twist comprobadas en el resumen; siguen como hallazgo. El mismo estudio da para el FADIR S 43 %, E 56 % (ver Reiman 2015).' }
  },
  'Altman 1986': {
    publicacion: 'Arthritis Rheum 29(8):1039–49', doi: '10.1002/art.1780290816',
    revision: { fecha: '2026-10', resultado: 'Sustituida por Peat 2006 en los criterios del ACR de rodilla (ro1): su S 95 % / E 69 % sale de la muestra de desarrollo, no del ámbito de un fisio. Solo queda citada como contexto en el texto del test.' },
    nota: 'Texto completo no consultado (Wiley, de pago): el resumen de PubMed no da S ni E.'
  },
  'Altman 1991': {
    publicacion: 'Arthritis Rheum 34(5):505–14', doi: '10.1002/art.1780340502',
    revision: { fecha: '2026-10', resultado: 'S 86 % / E 75 % del árbol clínico comprobadas en el resumen, pero son de la muestra de desarrollo; en atención primaria los criterios no se sostienen (Bierma-Zeinstra 1999, Reijman 2004) y no hay S/E de ese ámbito. Los criterios ACR de cadera (ca1) pasan a hallazgo, sin puntuar.' },
    nota: 'Texto completo no consultado (Wiley, de pago): la «validación cruzada S 83 %, E 68 %» que citaba la app no está en el resumen y se ha quitado.'
  },
  'Anastasopoulou y Gillespie 2026': { autores: 'Anastasopoulou y Gillespie', titulo: 'Paget Bone Disease', publicacion: 'StatPearls [Internet], NBK430805 (act. 2026-08-17)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430805/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Antunes 2024': { autores: 'Antunes, Tian y Copelin', titulo: 'Upper Gastrointestinal Bleeding', publicacion: 'StatPearls [Internet], NBK470300 (act. 2024-08-17)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470300/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Apelby-Albrecht 2013': { publicacion: '', doi: '10.1016/j.jmpt.2013.07.007', revision: null, nota: 'Citado a través de Thoomes 2026.' },
  'Appelboam 2008': { publicacion: 'BMJ 337:a2428', doi: '10.1136/bmj.a2428', revision: null },
  'Bachmann 2003': { publicacion: 'BMJ 326:417', doi: '10.1136/bmj.326.7386.417', revision: null },
  'Bierma-Zeinstra 1999': {
    publicacion: 'J Rheumatol 26(5):1129–33', doi: '',
    revision: { fecha: '2026-10', resultado: 'Solo resumen leído (PubMed 10332979): el texto completo no es accesible. No da S ni E de los criterios clínicos.' }
  },
  'Blanpied 2017': { publicacion: 'J Orthop Sports Phys Ther 47(7):A1–A83', doi: '10.2519/jospt.2017.0302', revision: null },
  'Cabre 2022': { autores: 'Cabre, Moore, Smith-Ryan y Hackney', titulo: 'Relative Energy Deficiency in Sport (RED-S): Scientific, Clinical, and Practical Implications for the Female Athlete', publicacion: 'Dtsch Z Sportmed 73(7):225–234', doi: '10.5960/dzsm.2022.546', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9724109/', revision: null, nota: 'Texto completo en PMC9724109. Razonamiento del cribado lumbar (l_e6).' },
  'Campbell 2020': { publicacion: 'Am J Sports Med 48:2819–2827', doi: '10.1177/0363546520937302', revision: null, nota: 'Recoge los datos de Roedl (sin año en la cita).' },
  'Chen 2023': { autores: 'Chen, Sabir y Al Khalili', titulo: 'Physiology, Osmoregulation and Excretion', publicacion: 'StatPearls [Internet], NBK541108 (act. 2023-05-01)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK541108/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Chimenti 2024': { publicacion: 'J Orthop Sports Phys Ther 54(12):CPG1–CPG32', doi: '10.2519/jospt.2024.0302', revision: null },
  'Chronopoulos 2004': { publicacion: 'Am J Sports Med', doi: '10.1177/0363546503261723', revision: null },
  'Consoli y Carlson 2026': { autores: 'Consoli y Carlson', titulo: 'Endometriosis', publicacion: 'StatPearls [Internet], NBK567777 (act. 2026-06-17)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK567777/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Cook 2011': { publicacion: '', doi: '10.1002/pri.500', revision: null },
  'Denault y Launico 2026': { autores: 'Denault y Launico', titulo: 'Physiology, Platelet', publicacion: 'StatPearls [Internet], NBK470328 (act. 2026-09-14)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470328/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Downie 2013': { autores: 'Downie, Williams, Henschke, Hancock, Ostelo, de Vet, Macaskill, Irwig, van Tulder, Koes y Maher', titulo: 'Red flags to screen for malignancy and fracture in patients with low back pain: systematic review', publicacion: 'BMJ 347:f7095', doi: '10.1136/bmj.f7095', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3898572/', revision: null, nota: 'Texto completo en PMC3898572. Resume las dos revisiones Cochrane de banderas rojas (malignidad y fractura).' },
  'Décary 2018': { publicacion: 'PLoS One · PM&R (dos artículos)', doi: '', revision: null, nota: 'Dos artículos distintos con la misma clave: la cita de cada uso dice la revista.' },
  'Demont 2022': { publicacion: 'Musculoskelet Sci Pract', doi: '10.1016/j.msksp.2022.102640', revision: null },
  'Devillé 2000': { publicacion: '', doi: '10.1097/00007632-200005010-00016', revision: null },
  'Dobbs 2016': { publicacion: 'Manual Therapy', doi: '10.1016/j.math.2016.05.332', revision: null },
  'Dorf 2007': { publicacion: 'J Hand Surg Am 32:882–886', doi: '10.1016/j.jhsa.2007.04.010', revision: null },
  'Fairbank 2011': { autores: 'Fairbank, Hashimoto, Dailey, Patel y Dettori', titulo: 'Does patient history and physical examination predict MRI proven cauda equina syndrome?', publicacion: 'Evid Based Spine Care J 2(4):27–33', doi: '10.1055/s-0031-1274754', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3506147/', revision: null, nota: 'Texto completo en PMC3506147.' },
  'Finucane 2020': { autores: 'Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe', titulo: 'International Framework for Red Flags for Potential Serious Spinal Pathologies', publicacion: 'IFOMPT, marzo de 2020 (documento completo); artículo en J Orthop Sports Phys Ther 50(7):350–372', doi: '10.2519/jospt.2020.9971', url: 'https://doi.org/10.2519/jospt.2020.9971', revision: null, nota: 'Se leyó el documento completo del marco IFOMPT; las páginas citadas son las suyas, no las del artículo de JOSPT.' },
  'Flynn 2002': { publicacion: '', doi: '10.1097/00007632-200212150-00021', revision: null },
  'Frey 2017': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Netterström-Wedin 2021.' },
  'Fritz 2005': { publicacion: '', doi: '10.1007/s00586-004-0803-4', revision: null },
  'Genevay 2017': { publicacion: '', doi: '10.1016/j.spinee.2017.05.005', revision: null },
  'Getsoian 2020': { publicacion: 'BMJ Open', doi: '10.1136/bmjopen-2019-035245', revision: null, nota: 'Citado a través de Demont 2022.' },
  'Gill 2025': { autores: 'Gill, Leslie y Minter', titulo: 'Acute Cystitis', publicacion: 'StatPearls [Internet], NBK459322 (act. 2025-11-28)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK459322/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Gomes 2022': { publicacion: 'BMC Musculoskelet Disord 23:885', doi: '10.1186/s12891-022-05831-7', revision: null },
  'Grimaldi 2017': {
    publicacion: 'Br J Sports Med 51(6):519–24', doi: '10.1136/bjsports-2016-096175',
    revision: { fecha: '2026-10', resultado: 'Cifras comprobadas en la tabla 2 de Kinsella 2024. La palpación y la abducción resistida pasan a las cifras agrupadas de Kinsella 2024; Grimaldi queda como dato del estudio de mayor calidad (y como fuente de la derotación, que pasa a hallazgo).' }
  },
  'Großterlinden 2016': { publicacion: '', doi: '10.1007/s00167-015-3604-x', revision: null, nota: 'Citado a través de Netterström-Wedin 2021.' },
  'Halliwell 2026': {
    publicacion: 'Arthroscopy 42(4):745–52', doi: '10.1002/arj.70074',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: S 94 %, E 100 %, AUC 0,879 comprobadas en el resumen; sigue como hallazgo.' }
  },
  'Han 2023': { publicacion: 'eClinicalMedicine', doi: '10.1016/j.eclinm.2023.101960', revision: null },
  'Hancock 2007': { publicacion: '', doi: '10.1007/s00586-007-0391-1', revision: null, nota: 'Cifra anterior, sustituida por Han 2023 (se menciona en la cita).' },
  'Hantzidiamantis 2024': { autores: 'Hantzidiamantis, Awosika y Lappin', titulo: 'Physiology, Glucose', publicacion: 'StatPearls [Internet], NBK545201 (2024)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545201/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF en modo lectura aportado por el usuario, sin fecha visible: el año sale del índice de Europe PMC.' },
  'Hegedus 2012': { publicacion: 'Br J Sports Med 46:964–978', doi: '10.1136/bjsports-2012-091066', revision: null },
  'Henschke 2013': { autores: 'Henschke, Maher, Ostelo, de Vet, Macaskill e Irwig', titulo: 'Red flags to screen for malignancy in patients with low-back pain', publicacion: 'Cochrane Database Syst Rev (2):CD008686', doi: '10.1002/14651858.CD008686.pub2', url: 'https://doi.org/10.1002/14651858.CD008686.pub2', revision: null, nota: 'Leído el resumen y las conclusiones de los autores (PMC10631455); las cifras de esta revisión se citan a través de Downie 2013.' },
  'Hermans 2013': { publicacion: 'JAMA 310:837–847', doi: '10.1001/jama.2013.276187', revision: null },
  'Hölmich 1999': {
    publicacion: 'Lancet 353(9151):439–43', doi: '10.1016/S0140-6736(98)03340-6',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído: la pauta de ca16 coincide con el panel 1 y los métodos. Corregido el trote (pasadas las 6 primeras semanas) y añadida la población (varones de 18 a 50 años). No se encontró un ensayo posterior que lo sustituya.' }
  },
  'Hutchison 2013': { publicacion: '', doi: '10.1016/j.fas.2012.12.006', revision: null, nota: 'Citado a través de Reiman 2014.' },
  'Jayarangaiah 2023': { autores: 'Jayarangaiah, Kemp y Theetha Kariyanna', titulo: 'Bone Metastasis', publicacion: 'StatPearls [Internet], NBK507911 (act. 2023-07-31)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507911/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Jonsson 2008': { publicacion: 'Br J Sports Med 42:746–749', doi: '10.1136/bjsm.2007.039545', revision: null },
  'Jull 2007': { publicacion: 'Cephalalgia 27:793–802', doi: '10.1111/j.1468-2982.2007.01345.x', revision: null },
  'Karanasios 2022': { publicacion: 'J Hand Ther 35:541–551', doi: '10.1016/j.jht.2021.02.002', revision: null },
  'Kastelein 2008': { publicacion: 'Am J Med', doi: '10.1016/j.amjmed.2008.05.041', revision: null },
  'Katz 1995': { publicacion: '', doi: '10.1002/art.1780380910', revision: null, nota: 'Citado a través de Dobbs 2016.' },
  'Kaur 2025': { autores: 'Kaur, Gandhi y Sharma', titulo: 'Physiology, Cortisol', publicacion: 'StatPearls [Internet], NBK538239 (act. 2025-12-01)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538239/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Kim 2001': { publicacion: 'Arthroscopy 17:160–164', doi: '10.1053/jars.2001.20665', revision: null },
  'Kim 2004': { publicacion: '', doi: '10.1016/j.arthro.2004.08.003', revision: null, nota: 'Solo para la técnica del test.' },
  'Kim 2007': { publicacion: 'Arthroscopy', doi: '10.1016/j.arthro.2007.06.016', revision: null },
  'King y Lowery 2023': { autores: 'King y Lowery', titulo: 'Physiology, Cardiac Output', publicacion: 'StatPearls [Internet], NBK470455 (act. 2023-07-17)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470455/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Kinsella 2024': {
    publicacion: 'J Orthop Sports Phys Ther 54(1):26–49', doi: '10.2519/jospt.2023.11890',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído (tablas 2 y 3). En el texto el LR+ de la abducción resistida aparece como 13,39, que en la tabla 3 es la DOR; se usa el LR+ de la tabla (6,09).' }
  },
  'Koc 2023': { publicacion: 'J Orthop Sports Phys Ther 53(12):CPG1–CPG39', doi: '10.2519/jospt.2023.0303', revision: null },
  'Kuijper 2009': { publicacion: 'BMJ 339:b3883', doi: '10.1136/bmj.b3883', revision: null },
  'Kulig 2009': { publicacion: 'Phys Ther 89(1):26–37', doi: '10.2522/ptj.20080052', revision: null },
  'LaPelusa y Dave 2023': { autores: 'LaPelusa y Dave', titulo: 'Physiology, Hemostasis', publicacion: 'StatPearls [Internet], NBK545263 (act. 2023-05-01)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545263/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Laslett 2006': { publicacion: '', doi: '10.1016/j.spinee.2006.01.004', revision: null },
  'Lassiter 2024': { autores: 'Lassiter, Bhutta y Allam', titulo: 'Inflammatory Back Pain and Spondyloarthropathies', publicacion: 'StatPearls [Internet], NBK539753 (act. 2024-02-26)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK539753/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Lequesne 2008': {
    publicacion: 'Arthritis Rheum 59(2):241–6', doi: '10.1002/art.23354',
    revision: { fecha: '2026-10', resultado: 'Cifras comprobadas en el resumen y en la tabla 2 de Kinsella 2024. La E se midió frente a controles sin dolor de cadera (casos y controles), lo que la infla: la derotación externa resistida pasa a hallazgo.' }
  },
  'Leslie 2024': { autores: 'Leslie, Sajjad y Singh', titulo: 'Nocturia', publicacion: 'StatPearls [Internet], NBK518987 (act. 2024-02-17)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK518987/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Litaker 2000': { publicacion: 'J Am Geriatr Soc', doi: '10.1111/j.1532-5415.2000.tb03875.x', revision: null },
  'Liu 2025': { publicacion: 'BMC Sports Sci Med Rehabil 17:335', doi: '10.1186/s13102-025-01404-y', revision: null },
  'Lucas 2009': { publicacion: '', doi: '10.1097/ajp.0b013e31817e13b6', revision: null },
  'Maffulli 1998': { publicacion: 'Am J Sports Med 26:266–70', doi: '10.1177/03635465980260021801', revision: null },
  'Mahadevan 2015': { publicacion: 'J Foot Ankle Surg 54:549–53', doi: '10.1053/j.jfas.2014.09.021', revision: null },
  'Majlesi 2008': { publicacion: '', doi: '10.1097/rhu.0b013e31816b2f99', revision: null },
  'Malik 2023': { autores: 'Malik, Gnanapandithan y Singh', titulo: 'Peptic Ulcer Disease', publicacion: 'StatPearls [Internet], NBK534792 (act. 2023-06-05)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK534792/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Margetis y Gillis 2025': { autores: 'Margetis y Gillis', titulo: 'Spondylolisthesis', publicacion: 'StatPearls [Internet], NBK430767 (act. 2025-03-28)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430767/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Martin 2021': { publicacion: 'J Orthop Sports Phys Ther 51(4):CPG1–CPG80', doi: '10.2519/jospt.2021.0302', revision: null },
  'Maxwell y Sterling 2013': { publicacion: 'Man Ther 18:172–174', doi: '10.1016/j.math.2012.07.004', revision: null },
  'May y Marappa-Ganeshan 2023': { autores: 'May y Marappa-Ganeshan', titulo: 'Stress Fractures', publicacion: 'StatPearls [Internet], NBK554538 (act. 2023-07-10)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK554538/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'McCarthy y Busconi 1995': {
    publicacion: 'Can J Surg 38 Supl 1:S13–7', doi: '',
    revision: { fecha: '2026-10', resultado: 'Texto completo no conseguido. Según Reiman 2015 (tabla 3), el estudio no publicó S ni E del test de Thomas («NA»): las calcularon los autores del metaanálisis. Serie de casos con riesgo de sesgo alto; Narvani 2003 no lo confirma. El Thomas pasa a hallazgo en labrum.' }
  },
  'McKeon 2008': { publicacion: 'Med Sci Sports Exerc 40(10):1810–1819', doi: '10.1249/mss.0b013e31817e0f92', revision: null },
  'Metcalfe 2019': {
    publicacion: 'JAMA 322(23):2323–33', doi: '10.1001/jama.2019.19413',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: texto completo leído (PMC7583647); S, E, LR+ y LR− con sus IC coinciden en los cinco usos. Es la revisión más reciente sobre exploración clínica de la artrosis de cadera.' }
  },
  'Molloy 2003': { publicacion: 'J Bone Joint Surg Br 85-B(3)', doi: '10.1302/0301-620x.85b3.12873', revision: null },
  'Munakomi 2023': { autores: 'Munakomi, Foris y Varacallo', titulo: 'Spinal Stenosis and Neurogenic Claudication', publicacion: 'StatPearls [Internet], NBK430872 (act. 2023-08-13)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430872/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Narvani 2003': {
    publicacion: 'Knee Surg Sports Traumatol Arthrosc 11(6):403–8', doi: '10.1007/s00167-003-0390-7',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen.' }
  },
  'Netterström-Wedin 2021': { publicacion: 'Phys Ther Sport 49:214–26', doi: '10.1016/j.ptsp.2021.03.005', revision: null },
  'Nunes 2013': { publicacion: 'Phys Ther Sport 14:54–9', doi: '10.1016/j.ptsp.2012.11.003', revision: null },
  'Pålsson 2020': {
    publicacion: 'Knee Surg Sports Traumatol Arthrosc 28(10):3382–92', doi: '10.1007/s00167-020-06005-5',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015).' }
  },
  'Paquin 2022': { publicacion: 'Arch Physiother 12:26', doi: '10.1186/s40945-022-00153-2', revision: null },
  'Park 2005': { publicacion: 'J Bone Joint Surg Am', doi: '10.2106/jbjs.d.02335', revision: null },
  'Park 2008': { publicacion: 'Arch Phys Med Rehabil 89:738–742', doi: '10.1016/j.apmr.2007.09.048', revision: null },
  'Park 2019': { publicacion: 'Medicine 98:e15497', doi: '10.1097/md.0000000000015497', revision: null },
  'Peat 2006': {
    publicacion: 'Ann Rheum Dis 65(10):1363–7', doi: '10.1136/ard.2006.051482',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res).' }
  },
  'Pitcher 2024': { publicacion: 'Foot Ankle Orthop 9(4)', doi: '10.1177/24730114241291055', revision: null },
  'Rathleff 2020': { publicacion: 'Orthop J Sports Med 8(4):2325967120911106', doi: '10.1177/2325967120911106', revision: null },
  'Reid 2014': { publicacion: 'Phys Ther 94(4):466–476', doi: '10.2522/ptj.20120483', revision: null },
  'Reijman 2004': {
    publicacion: 'Ann Rheum Dis 63(3):226–32', doi: '10.1136/ard.2003.010348',
    revision: { fecha: '2026-10', resultado: 'Solo resumen leído: en PMC (PMC1754907) el cuerpo es un PDF escaneado que no se pudo descargar.' }
  },
  'Reiman 2014': { publicacion: 'J Athl Train 49:820–9', doi: '10.4085/1062-6050-49.3.36', revision: null },
  'Reiman 2015': {
    publicacion: 'Br J Sports Med 49(12):811', doi: '10.1136/bjsports-2014-094302',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído (tablas 3 y 4): cifras correctas, pero el FADDIR agrupado sale de pacientes operados (probabilidad previa 90 %) y los propios autores concluyen que ningún test cambia de forma significativa la probabilidad. El FADDIR pasa a hallazgo en SIFA (con Pålsson 2020) y en labrum. Revisiones posteriores (Shanmugaraj 2020, Fernandes 2022, Dhillon 2025) no dan un valor agrupado mejor.' }
  },
  'Rhodes 2022': { autores: 'Rhodes, Denault y Varacallo', titulo: 'Physiology, Oxygen Transport', publicacion: 'StatPearls [Internet], NBK538336 (act. 2022-11-14)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK538336/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Rider y Marra 2023': { autores: 'Rider y Marra', titulo: 'Cauda Equina and Conus Medullaris Syndromes', publicacion: 'StatPearls [Internet], NBK537200 (act. 2023-08-07)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK537200/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Rout 2024': { autores: 'Rout, Reynolds y Zito', titulo: 'Neutropenia', publicacion: 'StatPearls [Internet], NBK507702 (act. 2024-06-07)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK507702/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Rowe 2023': { autores: 'Rowe, Koller y Sharma', titulo: 'Physiology, Bone Remodeling', publicacion: 'StatPearls [Internet], NBK499863 (act. 2023-03-17)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK499863/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Sanvictores 2023': { autores: 'Sanvictores, Jozsa y Tadi', titulo: 'Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain', publicacion: 'StatPearls [Internet], NBK560843 (act. 2023-07-30)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK560843/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Saueressig 2021': { publicacion: 'J Orthop Sports Phys Ther', doi: '10.2519/jospt.2021.10469', revision: null },
  'Shahid 2023': { autores: 'Shahid, Ashraf y Sharma', titulo: 'Physiology, Thyroid Hormone', publicacion: 'StatPearls [Internet], NBK500006 (act. 2023-06-05)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500006/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Shaw 2025': { autores: 'Shaw, Loree y Oropallo', titulo: 'Abdominal Aortic Aneurysm', publicacion: 'StatPearls [Internet], NBK470237 (act. 2025-01-19)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK470237/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Sman 2015': { publicacion: 'Br J Sports Med', doi: '10.1136/bjsports-2013-092787', revision: null },
  'Smith 2015': { publicacion: 'Evid Based Med 20:88–97', doi: '10.1136/ebmed-2014-110160', revision: null },
  'Solomon 2001': { publicacion: 'JAMA 286:1610–20', doi: '10.1001/jama.286.13.1610', revision: null },
  'Suri 2010': { publicacion: 'JAMA', doi: '10.1001/jama.2010.1833', revision: null },
  'Tawa 2017': { publicacion: '', doi: '10.1186/s12891-016-1383-2', revision: null },
  'Thoomes 2026': { publicacion: 'BMC Musculoskelet Disord', doi: '10.1186/s12891-026-09551-0', revision: null },
  'van Dijk 1996': { publicacion: 'J Bone Joint Surg Br 78-B(6)', doi: '10.1302/0301-620x78b6.1283', revision: null },
  'Walton 2004': { publicacion: 'J Bone Joint Surg Am', doi: '10.2106/00004623-200404000-00021', revision: null },
  'Warden 2007': { publicacion: 'Am J Sports Med 35:427–36', doi: '10.1177/0363546506294858', revision: null },
  'Williams 2025': { publicacion: 'J Man Manip Ther', doi: '10.1080/10669817.2024.2436403', revision: null },
  'Wong 2022': {
    publicacion: 'Curr Rev Musculoskelet Med 15:38–52', doi: '10.1007/s12178-022-09745-8', nota: 'Solo para la técnica del test.',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: solo describe la técnica, no aporta cifras.' }
  },
  'Zaslav 2001': { publicacion: 'J Shoulder Elbow Surg 10:23–27', doi: '10.1067/mse.2001.111960', revision: null },
  'Zemaitis 2026': { autores: 'Zemaitis, Boll, Kato y Golla', titulo: 'Peripheral Arterial Disease', publicacion: 'StatPearls [Internet], NBK430745 (act. 2026-01-31)', doi: '', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430745/', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Zhang 2010': { publicacion: 'Ann Rheum Dis 69:483–9', doi: '10.1136/ard.2009.113100', revision: null },
};
