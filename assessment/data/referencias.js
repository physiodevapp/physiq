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
  'NICE NG226': { publicacion: 'Guía NICE (2022)', doi: '', revision: null },
  'Adib 2023': { publicacion: 'Am J Sports Med', doi: '', revision: null },
  'Altman 1986': {
    publicacion: 'Arthritis Rheum 29(8):1039–49', doi: '10.1002/art.1780290816',
    revision: { fecha: '2026-10', resultado: 'Sustituida por Peat 2006 en los criterios del ACR de rodilla (ro1): su S 95 % / E 69 % sale de la muestra de desarrollo, no del ámbito de un fisio. Solo queda citada como contexto en el texto del test.' },
    nota: 'Texto completo no consultado (Wiley, de pago): el resumen de PubMed no da S ni E.'
  },
  'Altman 1991': { publicacion: 'Arthritis Rheum', doi: '', revision: null },
  'Apelby-Albrecht 2013': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Thoomes 2026.' },
  'Appelboam 2008': { publicacion: 'BMJ 337:a2428', doi: '', revision: null },
  'Bachmann 2003': { publicacion: 'BMJ 326:417', doi: '', revision: null },
  'Blanpied 2017': { publicacion: 'J Orthop Sports Phys Ther 47(7):A1–A83', doi: '', revision: null },
  'Campbell 2020': { publicacion: 'Am J Sports Med 48:2819–2827', doi: '', revision: null, nota: 'Recoge los datos de Roedl (sin año en la cita).' },
  'Chimenti 2024': { publicacion: 'J Orthop Sports Phys Ther 54(12):CPG1–CPG32', doi: '', revision: null },
  'Chronopoulos 2004': { publicacion: 'Am J Sports Med', doi: '', revision: null },
  'Cook 2011': { publicacion: '', doi: '', revision: null },
  'Décary 2018': { publicacion: 'PLoS One · PM&R (dos artículos)', doi: '', revision: null, nota: 'Dos artículos distintos con la misma clave: la cita de cada uso dice la revista.' },
  'Demont 2022': { publicacion: 'Musculoskelet Sci Pract', doi: '', revision: null },
  'Devillé 2000': { publicacion: '', doi: '', revision: null },
  'Dobbs 2016': { publicacion: 'Manual Therapy', doi: '', revision: null },
  'Dorf 2007': { publicacion: 'J Hand Surg Am 32:882–886', doi: '', revision: null },
  'Flynn 2002': { publicacion: '', doi: '', revision: null },
  'Frey 2017': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Netterström-Wedin 2021.' },
  'Fritz 2005': { publicacion: '', doi: '', revision: null },
  'Genevay 2017': { publicacion: '', doi: '', revision: null },
  'Getsoian 2020': { publicacion: 'BMJ Open', doi: '', revision: null, nota: 'Citado a través de Demont 2022.' },
  'Gomes 2022': { publicacion: 'BMC Musculoskelet Disord 23:885', doi: '', revision: null },
  'Grimaldi 2017': { publicacion: 'Br J Sports Med', doi: '', revision: null },
  'Großterlinden 2016': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Netterström-Wedin 2021.' },
  'Halliwell 2026': { publicacion: 'Arthroscopy', doi: '', revision: null },
  'Han 2023': { publicacion: 'eClinicalMedicine', doi: '', revision: null },
  'Hancock 2007': { publicacion: '', doi: '', revision: null, nota: 'Cifra anterior, sustituida por Han 2023 (se menciona en la cita).' },
  'Hegedus 2012': { publicacion: 'Br J Sports Med 46:964–978', doi: '', revision: null },
  'Hermans 2013': { publicacion: 'JAMA 310:837–847', doi: '', revision: null },
  'Hölmich 1999': { publicacion: 'Lancet 353:439–443', doi: '', revision: null },
  'Hutchison 2013': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Reiman 2014.' },
  'Jonsson 2008': { publicacion: 'Br J Sports Med 42:746–749', doi: '', revision: null },
  'Jull 2007': { publicacion: 'Cephalalgia 27:793–802', doi: '', revision: null },
  'Karanasios 2022': { publicacion: 'J Hand Ther 35:541–551', doi: '', revision: null },
  'Kastelein 2008': { publicacion: 'Am J Med', doi: '', revision: null },
  'Katz 1995': { publicacion: '', doi: '', revision: null, nota: 'Citado a través de Dobbs 2016.' },
  'Kim 2001': { publicacion: 'Arthroscopy 17:160–164', doi: '', revision: null },
  'Kim 2004': { publicacion: '', doi: '', revision: null, nota: 'Solo para la técnica del test.' },
  'Kim 2007': { publicacion: 'Arthroscopy', doi: '', revision: null },
  'Koc 2023': { publicacion: 'J Orthop Sports Phys Ther 53(12):CPG1–CPG39', doi: '', revision: null },
  'Kuijper 2009': { publicacion: 'BMJ 339:b3883', doi: '', revision: null },
  'Kulig 2009': { publicacion: 'Phys Ther 89(1):26–37', doi: '', revision: null },
  'Laslett 2006': { publicacion: '', doi: '', revision: null },
  'Lequesne 2008': { publicacion: 'Arthritis Rheum', doi: '', revision: null },
  'Litaker 2000': { publicacion: 'J Am Geriatr Soc', doi: '', revision: null },
  'Liu 2025': { publicacion: 'BMC Sports Sci Med Rehabil 17:335', doi: '', revision: null },
  'Lucas 2009': { publicacion: '', doi: '', revision: null },
  'Maffulli 1998': { publicacion: 'Am J Sports Med 26:266–70', doi: '', revision: null },
  'Mahadevan 2015': { publicacion: 'J Foot Ankle Surg 54:549–53', doi: '', revision: null },
  'Majlesi 2008': { publicacion: '', doi: '', revision: null },
  'Martin 2021': { publicacion: 'J Orthop Sports Phys Ther 51(4):CPG1–CPG80', doi: '', revision: null },
  'Maxwell y Sterling 2013': { publicacion: 'Man Ther 18:172–174', doi: '', revision: null },
  'McCarthy y Busconi 1995': { publicacion: 'Can J Surg', doi: '', revision: null },
  'McKeon 2008': { publicacion: 'Med Sci Sports Exerc 40(10):1810–1819', doi: '', revision: null },
  'Metcalfe 2019': { publicacion: 'JAMA', doi: '', revision: null },
  'Molloy 2003': { publicacion: 'J Bone Joint Surg Br 85-B(3)', doi: '', revision: null },
  'Narvani 2003': { publicacion: 'Knee Surg Sports Traumatol Arthrosc', doi: '', revision: null },
  'Netterström-Wedin 2021': { publicacion: 'Phys Ther Sport 49:214–26', doi: '', revision: null },
  'Nunes 2013': { publicacion: 'Phys Ther Sport 14:54–9', doi: '', revision: null },
  'Pålsson 2020': { publicacion: 'Knee Surg Sports Traumatol Arthrosc', doi: '', revision: null },
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
  'Reiman 2014': { publicacion: 'J Athl Train 49:820–9', doi: '', revision: null },
  'Reiman 2015': { publicacion: 'Br J Sports Med', doi: '', revision: null },
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
  'Wong 2022': { publicacion: 'Curr Rev Musculoskelet Med', doi: '', revision: null, nota: 'Solo para la técnica del test.' },
  'Zaslav 2001': { publicacion: 'J Shoulder Elbow Surg 10:23–27', doi: '', revision: null },
  'Zhang 2010': { publicacion: 'Ann Rheum Dis 69:483–9', doi: '', revision: null },
};
