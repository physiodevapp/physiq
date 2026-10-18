// ============================================================
// PhysiQ-Assessment · data/farmacos.js
// Contenido de la guía de fármacos de la cabecera (docs/farmacologia.md,
// paso 2). Una fila por familia, no por fármaco suelto. Solo lleva
// `apartados` una familia escrita con fuentes leídas en la sesión y revisada
// por el usuario; las demás se listan como pendientes.
//
// Límites (docs/farmacologia.md): nunca proponer cambiar, suspender ni ajustar
// la medicación; sin interacciones entre fármacos; el tono es «vigila y
// consulta».
//
// Esquema de una familia con contenido:
//   { id, nombre, ejemplos,
//     apartados: { dolor, visceral, ejercicio, sueno, consultar }
//       // cada uno: { texto: string | string[], detalle?: string | string[] }
//       // las citas dentro de la frase («(Schug 2021)») se pintan como botones
//     fuentes: ['<clave de data/referencias.js>', …] }
// Nunca entra en el payload, los resúmenes ni el prompt del informe con IA.
// ============================================================

export const APARTADOS_FARMACO = [
  { id: 'dolor', titulo: 'Dolor, inflamación y curación' },
  { id: 'visceral', titulo: 'Síntomas viscerales o secundarios' },
  { id: 'ejercicio', titulo: 'Ejercicio' },
  { id: 'sueno', titulo: 'Sueño' },
  { id: 'consultar', titulo: 'Cuándo consultar con el médico o el farmacéutico' },
];

export const FAMILIAS_FARMACO = [
  // AINE (2026-10): cinco revisiones leídas enteras en PMC. Sin fuente leída
  // todavía para la presentación clínica de la úlcera (melena, dolor referido
  // a la espalda o al hombro) ni para el sueño: docs/farmacologia.md.
  {
    id: 'aine',
    nombre: 'AINE (antiinflamatorios no esteroideos)',
    ejemplos: 'Ibuprofeno, naproxeno, diclofenaco, dexketoprofeno, celecoxib, etoricoxib',
    apartados: {
      dolor: {
        texto: [
          'Alivian el dolor y, junto con el paracetamol, reducen la necesidad de opioides tras la cirugía (Schug 2021). Las fuentes leídas no estudian cuánto enmascaran la exploración; solo un caso describe que pudieron enmascarar los síntomas de una pericarditis en un corredor (Pannone y Abbott 2024). Anota si tomó una dosis antes de la sesión.',
          'Hueso: en humanos no hay pruebas sólidas de que retrasen la consolidación. Un metaanálisis asocia su uso con retraso o falta de consolidación (OR 2,07), pero con estudios de baja calidad y sin asociación con dosis bajas o tomas de menos de 2 semanas (Schug 2021).',
          'Tendón y ligamento: los datos en humanos son insuficientes y probablemente no perjudican, salvo quizá el celecoxib tras reparar el manguito rotador, con más roturas de nuevo en un ensayo de 180 pacientes (Schug 2021). En músculo y cartílago no hay estudios en humanos (Schug 2021).',
        ],
        detalle: [
          'En un ensayo pequeño (15 personas), los AINE atenuaron el aumento de síntesis de colágeno que produce el ejercicio en el tendón rotuliano (Pannone y Abbott 2024).',
          'Los coxibs (celecoxib, etoricoxib) protegen más las suturas intestinales, pero podrían ser peores para el hueso y las partes blandas; el propio autor lo considera especulativo por la calidad de los datos (Schug 2021).',
        ],
      },
      visceral: {
        texto: [
          'Estómago e intestino: la lesión de la mucosa es su principal limitación en el uso crónico. La gravedad depende sobre todo de la dosis y la duración, y el riesgo sube si ya hubo una complicación digestiva (Bindu 2020). Aumentan el riesgo de sangrado y perforación en el intestino en una medida similar a la del estómago (Papantoniou 2023). La lesión intestinal se manifiesta como anemia ferropénica, indigestión o dolor abdominal y, en lo grave, sangrado oculto o perforación (Bindu 2020).',
          'Riñón y tensión arterial: retienen sodio y agua, con edema a menudo sin síntomas, y pueden subir la tensión (Lucas 2019; Bindu 2020). La lesión renal es rara en personas sanas a dosis habituales; el riesgo se concentra en mayores, enfermedad renal, hepática o cardíaca, deshidratación y quien toma a la vez diuréticos o fármacos del sistema renina-angiotensina (Lucas 2019).',
        ],
        detalle: [
          'Corazón: su uso se asocia a peor salud cardiovascular, aunque se duda del riesgo coronario con dosis bajas durante pocos días. Las personas mayores tienen más riesgo de base de complicaciones cardiovasculares, digestivas, renales y hepáticas (Bindu 2020).',
          'Hígado: la lesión clínica es rara (1–10 casos por 100 000 prescripciones), más con diclofenaco y sulindaco; se presenta como hepatitis aguda con ictericia, náuseas y fiebre (Bindu 2020).',
          'Respiratorio: alrededor del 7 % de las personas con asma tiene broncoespasmo con la aspirina u otros AINE (Bindu 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Deshidratación y calor: el efecto de los AINE sobre el riñón empeora con deshidratación, poca perfusión renal o daño renal previo (Lucas 2019), y la deshidratación y el ejercicio intenso con calor reducen además el riego intestinal (Papantoniou 2023). Vigila la hidratación en sesiones largas o con calor.',
          'Resistencia: en maratón y ultrafondo las pruebas de daño son limitadas. Un ensayo con ibuprofeno 400 mg en una carrera por etapas vio más lesión renal aguda (22 de 42 frente a 16 de 47 con placebo), sin diferencia significativa, y la revisión aconseja precaución al tomarlos de forma preventiva, sin beneficio en el rendimiento (Pannone y Abbott 2024). Se desaconseja su uso habitual en deportistas, sobre todo antes de competir (Papantoniou 2023).',
          'Tensión arterial: pueden subir la tensión y restar efecto a los diuréticos, en torno a un 20 % (Lucas 2019; Bindu 2020).',
        ],
      },
      sueno: {
        texto: 'Las fuentes leídas no describen un efecto directo de los AINE sobre el sueño. Pendiente de una fuente que lo trate.',
      },
      consultar: {
        texto: [
          'Sangrado digestivo visible: parar toda actividad y buscar atención médica (Papantoniou 2023). El sangrado oculto con anemia necesita estudio (Papantoniou 2023).',
          'También edema, poca orina o proteinuria pocos días después de empezarlos (Lucas 2019); ictericia, náuseas y fiebre; subida de la tensión, sobre todo con enfermedad renal crónica; o broncoespasmo en una persona con asma (Bindu 2020).',
          'Las dudas sobre la dosis, la duración o la combinación con otros fármacos, al médico o al farmacéutico.',
        ],
      },
    },
    fuentes: ['Schug 2021', 'Bindu 2020', 'Lucas 2019', 'Papantoniou 2023', 'Pannone y Abbott 2024'],
  },
  { id: 'corticoides', nombre: 'Corticoides', ejemplos: 'Prednisona, metilprednisolona, dexametasona' },
  { id: 'antitromboticos', nombre: 'Anticoagulantes y antiagregantes', ejemplos: 'Acenocumarol, apixabán, rivaroxabán, ácido acetilsalicílico, clopidogrel' },
  { id: 'opioides', nombre: 'Opioides', ejemplos: 'Tramadol, tapentadol, codeína, morfina, oxicodona, fentanilo' },
  { id: 'gabapentinoides', nombre: 'Gabapentinoides', ejemplos: 'Gabapentina, pregabalina' },
  { id: 'antidepresivos', nombre: 'Antidepresivos (ISRS, IRSN, tricíclicos)', ejemplos: 'Sertralina, escitalopram, duloxetina, venlafaxina, amitriptilina' },
  { id: 'sedantes', nombre: 'Benzodiacepinas y relajantes musculares', ejemplos: 'Diazepam, lorazepam, alprazolam, ciclobenzaprina, metocarbamol' },
  { id: 'estatinas', nombre: 'Estatinas', ejemplos: 'Atorvastatina, simvastatina, rosuvastatina' },
  { id: 'fluoroquinolonas', nombre: 'Fluoroquinolonas', ejemplos: 'Ciprofloxacino, levofloxacino, moxifloxacino' },
  { id: 'betabloqueantes', nombre: 'Betabloqueantes', ejemplos: 'Bisoprolol, atenolol, metoprolol, propranolol' },
  { id: 'antihipertensivos', nombre: 'Diuréticos y otros antihipertensivos', ejemplos: 'Hidroclorotiazida, furosemida, enalapril, losartán, amlodipino' },
  { id: 'antidiabeticos', nombre: 'Insulina y antidiabéticos', ejemplos: 'Insulina, metformina, sulfonilureas, inhibidores de SGLT2' },
  { id: 'hueso', nombre: 'Fármacos que tocan el hueso', ejemplos: 'Alendronato, zoledronato, denosumab, inhibidores de la aromatasa' },
];

export const TEXTOS_FARMACOS = {
  intro: 'Qué vigilar en la valoración y el tratamiento cuando el paciente toma estos fármacos: cómo cambian el dolor y la inflamación, qué síntomas pueden confundirse con dolor musculoesquelético, qué precauciones pide el ejercicio y cómo afectan al sueño.',
  limites: 'No es una guía para cambiar la medicación: cualquier duda sobre dosis, suspensión o interacciones entre fármacos se consulta con el médico o el farmacéutico.',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Mientras tanto puedes preguntar a la IA con un guion para fisioterapeutas (sin datos del paciente; PhysiQ no revisa la respuesta).',
  preguntar: 'Preguntar a la IA sobre fármacos →',
  pie: 'Cada familia se escribe con fuentes leídas y revisadas antes de publicarse. Toca una cita para ver la referencia.',
};
