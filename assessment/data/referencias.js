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
  'Anastasopoulou y Gillespie 2026': { autores: 'Anastasopoulou y Gillespie', titulo: 'Paget Bone Disease', publicacion: 'StatPearls [Internet], NBK430805 (act. 2026-08-17)', doi: '', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Apelby-Albrecht 2013': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Thoomes 2026.' },
  'Appelboam 2008': { publicacion: 'BMJ 337:a2428', doi: '', revision: null },
  'Bachmann 2003': { publicacion: 'BMJ 326:417', doi: '', revision: null },
  'Bierma-Zeinstra 1999': {
    publicacion: 'J Rheumatol 26(5):1129–33', doi: '',
    revision: { fecha: '2026-10', resultado: 'Solo resumen leído (PubMed 10332979): el texto completo no es accesible. No da S ni E de los criterios clínicos.' }
  },
  'Blanpied 2017': { publicacion: 'J Orthop Sports Phys Ther 47(7):A1–A83', doi: '', revision: null },
  'Cabre 2022': { autores: 'Cabre, Moore, Smith-Ryan y Hackney', titulo: 'Relative Energy Deficiency in Sport (RED-S): Scientific, Clinical, and Practical Implications for the Female Athlete', publicacion: 'Dtsch Z Sportmed 73(7):225–234', doi: '10.5960/dzsm.2022.546', revision: null, nota: 'Texto completo en PMC9724109. Razonamiento del cribado lumbar (l_e6).' },
  'Campbell 2020': { publicacion: 'Am J Sports Med 48:2819–2827', doi: '', revision: null, nota: 'Recoge los datos de Roedl (sin año en la cita).' },
  'Chimenti 2024': { publicacion: 'J Orthop Sports Phys Ther 54(12):CPG1–CPG32', doi: '', revision: null },
  'Chronopoulos 2004': { publicacion: 'Am J Sports Med', doi: '', revision: null },
  'Cook 2011': { publicacion: '', doi: '', revision: null },
  'Downie 2013': { autores: 'Downie, Williams, Henschke, Hancock, Ostelo, de Vet, Macaskill, Irwig, van Tulder, Koes y Maher', titulo: 'Red flags to screen for malignancy and fracture in patients with low back pain: systematic review', publicacion: 'BMJ 347:f7095', doi: '10.1136/bmj.f7095', revision: null, nota: 'Texto completo en PMC3898572. Resume las dos revisiones Cochrane de banderas rojas (malignidad y fractura).' },
  'Décary 2018': { publicacion: 'PLoS One · PM&R (dos artículos)', doi: '', revision: null, nota: 'Dos artículos distintos con la misma clave: la cita de cada uso dice la revista.' },
  'Demont 2022': { publicacion: 'Musculoskelet Sci Pract', doi: '', revision: null },
  'Devillé 2000': { publicacion: '', doi: '', revision: null },
  'Dobbs 2016': { publicacion: 'Manual Therapy', doi: '', revision: null },
  'Dorf 2007': { publicacion: 'J Hand Surg Am 32:882–886', doi: '', revision: null },
  'Fairbank 2011': { autores: 'Fairbank, Hashimoto, Dailey, Patel y Dettori', titulo: 'Does patient history and physical examination predict MRI proven cauda equina syndrome?', publicacion: 'Evid Based Spine Care J 2(4):27–33', doi: '10.1055/s-0031-1274754', revision: null, nota: 'Texto completo en PMC3506147.' },
  'Finucane 2020': { autores: 'Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe', titulo: 'International Framework for Red Flags for Potential Serious Spinal Pathologies', publicacion: 'IFOMPT, marzo de 2020 (documento completo); artículo en J Orthop Sports Phys Ther 50(7):350–372', doi: '10.2519/jospt.2020.9971', revision: null, nota: 'Se leyó el documento completo del marco IFOMPT; las páginas citadas son las suyas, no las del artículo de JOSPT.' },
  'Flynn 2002': { publicacion: '', doi: '', revision: null },
  'Frey 2017': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Netterström-Wedin 2021.' },
  'Fritz 2005': { publicacion: '', doi: '', revision: null },
  'Genevay 2017': { publicacion: '', doi: '', revision: null },
  'Getsoian 2020': { publicacion: 'BMJ Open', doi: '', revision: null, nota: 'Citado a través de Demont 2022.' },
  'Gomes 2022': { publicacion: 'BMC Musculoskelet Disord 23:885', doi: '', revision: null },
  'Grimaldi 2017': {
    publicacion: 'Br J Sports Med 51(6):519–24', doi: '10.1136/bjsports-2016-096175',
    revision: { fecha: '2026-10', resultado: 'Cifras comprobadas en la tabla 2 de Kinsella 2024. La palpación y la abducción resistida pasan a las cifras agrupadas de Kinsella 2024; Grimaldi queda como dato del estudio de mayor calidad (y como fuente de la derotación, que pasa a hallazgo).' }
  },
  'Großterlinden 2016': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Netterström-Wedin 2021.' },
  'Halliwell 2026': {
    publicacion: 'Arthroscopy 42(4):745–52', doi: '10.1002/arj.70074',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: S 94 %, E 100 %, AUC 0,879 comprobadas en el resumen; sigue como hallazgo.' }
  },
  'Han 2023': { publicacion: 'eClinicalMedicine', doi: '', revision: null },
  'Hancock 2007': { publicacion: '', doi: '', revision: null, nota: 'Cifra anterior, sustituida por Han 2023 (se menciona en la cita).' },
  'Hegedus 2012': { publicacion: 'Br J Sports Med 46:964–978', doi: '', revision: null },
  'Henschke 2013': { autores: 'Henschke, Maher, Ostelo, de Vet, Macaskill e Irwig', titulo: 'Red flags to screen for malignancy in patients with low-back pain', publicacion: 'Cochrane Database Syst Rev (2):CD008686', doi: '10.1002/14651858.CD008686.pub2', revision: null, nota: 'Leído el resumen y las conclusiones de los autores (PMC10631455); las cifras de esta revisión se citan a través de Downie 2013.' },
  'Hermans 2013': { publicacion: 'JAMA 310:837–847', doi: '', revision: null },
  'Hölmich 1999': {
    publicacion: 'Lancet 353(9151):439–43', doi: '10.1016/S0140-6736(98)03340-6',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído: la pauta de ca16 coincide con el panel 1 y los métodos. Corregido el trote (pasadas las 6 primeras semanas) y añadida la población (varones de 18 a 50 años). No se encontró un ensayo posterior que lo sustituya.' }
  },
  'Hutchison 2013': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Reiman 2014.' },
  'Jonsson 2008': { publicacion: 'Br J Sports Med 42:746–749', doi: '', revision: null },
  'Jull 2007': { publicacion: 'Cephalalgia 27:793–802', doi: '', revision: null },
  'Karanasios 2022': { publicacion: 'J Hand Ther 35:541–551', doi: '', revision: null },
  'Kastelein 2008': { publicacion: 'Am J Med', doi: '', revision: null },
  'Katz 1995': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Dobbs 2016.' },
  'Kim 2001': { publicacion: 'Arthroscopy 17:160–164', doi: '', revision: null },
  'Kim 2004': { publicacion: '', doi: '', revision: null, nota: 'Solo para la técnica del test.' },
  'Kim 2007': { publicacion: 'Arthroscopy', doi: '', revision: null },
  'Kinsella 2024': {
    publicacion: 'J Orthop Sports Phys Ther 54(1):26–49', doi: '10.2519/jospt.2023.11890',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído (tablas 2 y 3). En el texto el LR+ de la abducción resistida aparece como 13,39, que en la tabla 3 es la DOR; se usa el LR+ de la tabla (6,09).' }
  },
  'Koc 2023': { publicacion: 'J Orthop Sports Phys Ther 53(12):CPG1–CPG39', doi: '', revision: null },
  'Kuijper 2009': { publicacion: 'BMJ 339:b3883', doi: '', revision: null },
  'Kulig 2009': { publicacion: 'Phys Ther 89(1):26–37', doi: '', revision: null },
  'Laslett 2006': { publicacion: '', doi: '', revision: null },
  'Lassiter 2024': { autores: 'Lassiter, Bhutta y Allam', titulo: 'Inflammatory Back Pain and Spondyloarthropathies', publicacion: 'StatPearls [Internet], NBK539753 (act. 2024-02-26)', doi: '', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Lequesne 2008': {
    publicacion: 'Arthritis Rheum 59(2):241–6', doi: '10.1002/art.23354',
    revision: { fecha: '2026-10', resultado: 'Cifras comprobadas en el resumen y en la tabla 2 de Kinsella 2024. La E se midió frente a controles sin dolor de cadera (casos y controles), lo que la infla: la derotación externa resistida pasa a hallazgo.' }
  },
  'Litaker 2000': { publicacion: 'J Am Geriatr Soc', doi: '', revision: null },
  'Liu 2025': { publicacion: 'BMC Sports Sci Med Rehabil 17:335', doi: '', revision: null },
  'Lucas 2009': { publicacion: '', doi: '', revision: null },
  'Maffulli 1998': { publicacion: 'Am J Sports Med 26:266–70', doi: '', revision: null },
  'Mahadevan 2015': { publicacion: 'J Foot Ankle Surg 54:549–53', doi: '', revision: null },
  'Majlesi 2008': { publicacion: '', doi: '', revision: null },
  'Margetis y Gillis 2025': { autores: 'Margetis y Gillis', titulo: 'Spondylolisthesis', publicacion: 'StatPearls [Internet], NBK430767 (act. 2025-03-28)', doi: '', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Martin 2021': { publicacion: 'J Orthop Sports Phys Ther 51(4):CPG1–CPG80', doi: '', revision: null },
  'Maxwell y Sterling 2013': { publicacion: 'Man Ther 18:172–174', doi: '', revision: null },
  'May y Marappa-Ganeshan 2023': { autores: 'May y Marappa-Ganeshan', titulo: 'Stress Fractures', publicacion: 'StatPearls [Internet], NBK554538 (act. 2023-07-10)', doi: '', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'McCarthy y Busconi 1995': {
    publicacion: 'Can J Surg 38 Supl 1:S13–7', doi: '',
    revision: { fecha: '2026-10', resultado: 'Texto completo no conseguido. Según Reiman 2015 (tabla 3), el estudio no publicó S ni E del test de Thomas («NA»): las calcularon los autores del metaanálisis. Serie de casos con riesgo de sesgo alto; Narvani 2003 no lo confirma. El Thomas pasa a hallazgo en labrum.' }
  },
  'McKeon 2008': { publicacion: 'Med Sci Sports Exerc 40(10):1810–1819', doi: '', revision: null },
  'Metcalfe 2019': {
    publicacion: 'JAMA 322(23):2323–33', doi: '10.1001/jama.2019.19413',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: texto completo leído (PMC7583647); S, E, LR+ y LR− con sus IC coinciden en los cinco usos. Es la revisión más reciente sobre exploración clínica de la artrosis de cadera.' }
  },
  'Molloy 2003': { publicacion: 'J Bone Joint Surg Br 85-B(3)', doi: '', revision: null },
  'Narvani 2003': {
    publicacion: 'Knee Surg Sports Traumatol Arthrosc 11(6):403–8', doi: '10.1007/s00167-003-0390-7',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen.' }
  },
  'Netterström-Wedin 2021': { publicacion: 'Phys Ther Sport 49:214–26', doi: '', revision: null },
  'Nunes 2013': { publicacion: 'Phys Ther Sport 14:54–9', doi: '', revision: null },
  'Pålsson 2020': {
    publicacion: 'Knee Surg Sports Traumatol Arthrosc 28(10):3382–92', doi: '10.1007/s00167-020-06005-5',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015).' }
  },
  'Paquin 2022': { publicacion: 'Arch Physiother 12:26', doi: '', revision: null },
  'Park 2005': { publicacion: 'J Bone Joint Surg Am', doi: '', revision: null },
  'Park 2008': { publicacion: 'Arch Phys Med Rehabil 89:738–742', doi: '', revision: null },
  'Park 2019': { publicacion: 'Medicine 98:e15497', doi: '', revision: null },
  'Peat 2006': {
    publicacion: 'Ann Rheum Dis 65(10):1363–7', doi: '10.1136/ard.2006.051482',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res).' }
  },
  'Pitcher 2024': { publicacion: 'Foot Ankle Orthop 9(4)', doi: '', revision: null },
  'Rathleff 2020': { publicacion: 'Orthop J Sports Med 8(4):2325967120911106', doi: '', revision: null },
  'Reid 2014': { publicacion: 'Phys Ther 94(4):466–476', doi: '', revision: null },
  'Reijman 2004': {
    publicacion: 'Ann Rheum Dis 63(3):226–32', doi: '10.1136/ard.2003.010348',
    revision: { fecha: '2026-10', resultado: 'Solo resumen leído: en PMC (PMC1754907) el cuerpo es un PDF escaneado que no se pudo descargar.' }
  },
  'Reiman 2014': { publicacion: 'J Athl Train 49:820–9', doi: '', revision: null },
  'Reiman 2015': {
    publicacion: 'Br J Sports Med 49(12):811', doi: '10.1136/bjsports-2014-094302',
    revision: { fecha: '2026-10', resultado: 'Texto completo leído (tablas 3 y 4): cifras correctas, pero el FADDIR agrupado sale de pacientes operados (probabilidad previa 90 %) y los propios autores concluyen que ningún test cambia de forma significativa la probabilidad. El FADDIR pasa a hallazgo en SIFA (con Pålsson 2020) y en labrum. Revisiones posteriores (Shanmugaraj 2020, Fernandes 2022, Dhillon 2025) no dan un valor agrupado mejor.' }
  },
  'Rider y Marra 2023': { autores: 'Rider y Marra', titulo: 'Cauda Equina and Conus Medullaris Syndromes', publicacion: 'StatPearls [Internet], NBK537200 (act. 2023-08-07)', doi: '', revision: null, nota: 'Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.' },
  'Saueressig 2021': { publicacion: 'J Orthop Sports Phys Ther', doi: '', revision: null },
  'Sman 2015': { publicacion: 'Br J Sports Med', doi: '', revision: null },
  'Smith 2015': { publicacion: 'Evid Based Med 20:88–97', doi: '', revision: null },
  'Solomon 2001': { publicacion: 'JAMA 286:1610–20', doi: '', revision: null },
  'Suri 2010': { publicacion: 'JAMA', doi: '', revision: null },
  'Tawa 2017': { publicacion: '', doi: '', revision: null },
  'Thoomes 2026': { publicacion: 'BMC Musculoskelet Disord', doi: '', revision: null },
  'van Dijk 1996': { publicacion: 'J Bone Joint Surg Br 78-B(6)', doi: '', revision: null },
  'Walton 2004': { publicacion: 'J Bone Joint Surg Am', doi: '', revision: null },
  'Warden 2007': { publicacion: 'Am J Sports Med 35:427–36', doi: '', revision: null },
  'Williams 2025': { publicacion: 'J Man Manip Ther', doi: '', revision: null },
  'Wong 2022': {
    publicacion: 'Curr Rev Musculoskelet Med 15:38–52', doi: '10.1007/s12178-022-09745-8', nota: 'Solo para la técnica del test.',
    revision: { fecha: '2026-10', resultado: 'Sin cambios: solo describe la técnica, no aporta cifras.' }
  },
  'Zaslav 2001': { publicacion: 'J Shoulder Elbow Surg 10:23–27', doi: '', revision: null },
  'Zhang 2010': { publicacion: 'Ann Rheum Dis 69:483–9', doi: '', revision: null },
};
