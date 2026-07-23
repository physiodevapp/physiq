const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, PageNumber, Header, Footer, LevelFormat
} = require('docx');
const fs = require('fs');

// ---------- palette ----------
const PURPLE = '6B21A8';
const PURPLE_D = '4C1D6B';
const GREY = '4B5563';
const GREY_L = '6B7280';
const CONFIRM = '9A3412';   // brownish/orange for confirmatorio
const SCREEN = '166534';    // green for cribado
const BOTH = '1D4ED8';      // blue for both
const CLUSTER = '6B21A8';   // purple for cluster

// ---------- data ----------
// role: 'confirm' | 'screen' | 'both' | 'cluster'
const regions = [
  {
    name: 'Columna cervical',
    groups: [
      {
        path: 'Radiculopatía cervical',
        tests: [
          { n: 'Test de Spurling (compresión foraminal)', role: 'confirm',
            d: 'Compresión axial con la cabeza en extensión y rotación hacia el lado sintomático; positivo si el dolor irradia al brazo.',
            p: 'Sens ~50 % · Esp ~86 % · LR+ ~3.5 · LR− ~0.58.' },
          { n: 'Test de distracción cervical', role: 'confirm',
            d: 'Tracción manual de la cabeza; positivo si ALIVIA los síntomas radiculares (descompresión de la raíz).',
            p: 'Sens ~44 % · Esp ~90 % · LR+ ~4.4 · LR− ~0.62.' },
          { n: 'ULTT / ULNT1 (sesgo del mediano)', role: 'screen',
            d: 'Tensión neurodinámica secuencial del miembro superior; positivo si reproduce los síntomas neurológicos.',
            p: 'Sens ~97 % · Esp ~22 % · LR− ~0.12 → un resultado negativo descarta.' },
          { n: 'Regla de predicción de Wainner (4/4)', role: 'cluster',
            d: 'ULTT mediano + rotación cervical activa <60° + distracción positiva + Spurling positivo.',
            p: '3/4: LR+ ~6.1 · 4/4: LR+ ~30.3 (prob. postest ~90 %). Máximo valor confirmatorio.' },
        ]
      },
      {
        path: 'Mielopatía cervical',
        tests: [
          { n: 'Clúster de Cook (≥3/5)', role: 'cluster',
            d: 'Marcha alterada + Hoffmann + supinador invertido + Babinski + edad >45 años.',
            p: '≥3/5: Esp ~0.99 · LR+ ~30. Obliga a derivación médica; contraindica manipulación.' },
        ]
      },
      {
        path: 'Cefalea cervicogénica (C1-C2)',
        tests: [
          { n: 'Test de flexión-rotación cervical', role: 'both',
            d: 'En supino con flexión cervical mantenida se rota la cabeza; restricción marcada (<~32°) hacia el lado sintomático es positiva.',
            p: 'Sens ~90-91 % · Esp ~88-90 %. Uno de los pocos tests con ambas altas.' },
        ]
      },
      {
        path: 'Inestabilidad craneovertebral',
        tests: [
          { n: 'Test de Sharp-Purser', role: 'confirm',
            d: 'Con extrema precaución: en flexión activa se empuja la frente atrás; el deslizamiento posterior reduce la subluxación atlantoaxial.',
            p: 'Sens ~69 % · Esp ~96 % · LR+ ~17.25. Bandera roja; contraindica técnicas de rango final.' },
        ]
      },
      {
        path: 'Dolor facetario cervical',
        tests: [
          { n: 'Examen manual segmentario (palpación)', role: 'confirm',
            d: 'Presiones posteroanteriores que reproducen dolor familiar con hipomovilidad del segmento.',
            p: 'C2-C3: Esp ~98 %, LR+ ~39 · C5-C6: Esp ~91 %, LR+ ~6.11.' },
        ]
      },
    ]
  },
  {
    name: 'Hombro',
    groups: [
      {
        path: 'Rotura del manguito rotador',
        tests: [
          { n: 'Clúster de Park (3 positivos)', role: 'cluster',
            d: 'Arco doloroso + drop-arm + debilidad en rotación lateral (infraespinoso).',
            p: 'LR+ ~15 para rotura transmural. Clúster confirmatorio de referencia.' },
          { n: 'Drop-arm test (Codman)', role: 'confirm',
            d: 'Descenso controlado del brazo desde 90° de abducción; caída brusca es positiva.',
            p: 'Sens ~24 % · Esp ~88 %. Confirmatorio de rotura transmural.' },
          { n: 'External rotation lag sign', role: 'confirm',
            d: 'Incapacidad de sostener la rotación lateral máxima (infraespinoso/supraespinoso).',
            p: 'Esp ~90 %; LR− próximo a 0 en roturas grandes.' },
          { n: 'Signo del trompetista (hornblower / Patte)', role: 'both',
            d: 'Incompetencia del redondo menor en rotación lateral resistida.',
            p: 'Sens ~100 % · Esp ~93 %.' },
          { n: 'Lift-off de Gerber (subescapular)', role: 'confirm',
            d: 'Despegue de la mano desde la región lumbar; incapacidad es positiva.',
            p: 'Esp alta; LR+ muy elevado (rotura transmural del subescapular).' },
          { n: 'Internal rotation lag sign (subescapular)', role: 'screen',
            d: 'La mano cae hacia la espalda al soltarla en rotación medial máxima.',
            p: 'Sens ~97 % para rotura completa del subescapular.' },
        ]
      },
      {
        path: 'Impingement subacromial',
        tests: [
          { n: 'Test de Neer', role: 'screen',
            d: 'Elevación pasiva en rotación medial; dolor al final del rango.',
            p: 'Sens ~72-89 % · Esp ~30-49 %. Negativo aleja el impingement.' },
          { n: 'Test de Hawkins-Kennedy', role: 'screen',
            d: 'Rotación medial forzada a 90° de flexión.',
            p: 'Sens ~74-92 % · Esp ~26-45 %. Un negativo reduce la probabilidad.' },
          { n: 'Hawkins + arco doloroso + debilidad infraespinoso', role: 'cluster',
            d: 'Combinación para impingement/bursitis subacromial.',
            p: 'LR+ ~10 con los tres positivos.' },
        ]
      },
      {
        path: 'Inestabilidad anterior',
        tests: [
          { n: 'Test de aprensión anterior', role: 'confirm',
            d: 'Abducción 90° + rotación lateral; válido solo con APRENSIÓN genuina (no dolor aislado).',
            p: 'Esp ~96-99 % · LR+ ~20 (criterio aprensión).' },
          { n: 'Test de recolocación (relocation)', role: 'confirm',
            d: 'Fuerza posterior sobre la cabeza humeral que alivia la aprensión.',
            p: 'Esp ~90-100 % · Sens ~68 %.' },
          { n: 'Test de liberación / sorpresa', role: 'both',
            d: 'Retirada brusca de la fuerza posterior; reaparición súbita de la aprensión.',
            p: 'Sens ~64 % · Esp ~99 % · LR+ ~8.3 · LR− bajo. Mejor test aislado de la tríada.' },
        ]
      },
      {
        path: 'Inestabilidad posterior / labral posteroinferior',
        tests: [
          { n: 'Test de aprensión posterior', role: 'confirm',
            d: 'Carga posterior axial en flexión y aducción horizontal.',
            p: 'Esp ~99 % · LR+ ~25 · Sens ~19 %.' },
          { n: 'Jerk test', role: 'confirm',
            d: 'Carga axial en aducción horizontal; "clunk" doloroso posterior.',
            p: 'Sens ~73 % · Esp ~98 %.' },
          { n: 'Test de Kim (+ jerk)', role: 'both',
            d: 'Carga axial + elevación diagonal con empuje posteroinferior.',
            p: 'Kim: Sens ~80 % · Esp ~94 %. Kim + jerk: sensibilidad ~97 %.' },
        ]
      },
      {
        path: 'Lesión labral SLAP',
        tests: [
          { n: 'Biceps load test I (Kim I)', role: 'both',
            d: 'Aprensión + flexión resistida del codo; SLAP con inestabilidad anterior.',
            p: 'Sens ~91 % · Esp ~97 %.' },
          { n: 'Biceps load test II (Kim II)', role: 'both',
            d: '120° de abducción, rotación lateral máxima, flexión resistida del codo.',
            p: 'Sens ~90 % · Esp ~97 %.' },
          { n: 'Supinación resistida en rotación lateral (RSERT)', role: 'both',
            d: 'Supinación resistida con el hombro en rotación lateral; SLAP tipo II.',
            p: 'Sens ~83 % · Esp ~82 % · LR+ ~4-5.' },
        ]
      },
      {
        path: 'Patología acromioclavicular',
        tests: [
          { n: 'Clúster de Chronopoulos (3 positivos)', role: 'cluster',
            d: 'Aducción horizontal cruzada + extensión resistida AC + O’Brien (dolor sobre la AC).',
            p: 'LR+ ~8.3 · LR− ~0.77.' },
        ]
      },
      {
        path: 'Lesión labral anterior (Bankart)',
        tests: [
          { n: 'Clúster de Bankart', role: 'cluster',
            d: 'Crank + aprensión anterior + recolocación de Jobe.',
            p: 'LR+ ~6.0 · LR− ~0.12 (confirma y descarta).' },
        ]
      },
    ]
  },
  {
    name: 'Codo',
    groups: [
      {
        path: 'Fractura de codo',
        tests: [
          { n: 'Elbow extension test', role: 'screen',
            d: 'Extensión completa bilateral comparada; la incompleta indica radiografía.',
            p: 'Esp ~0.91-0.97 · Sens ~0.69-0.70 · LR− ~0.04-0.13. Base de las reglas de decisión.' },
        ]
      },
      {
        path: 'Inestabilidad en valgo (ligamento colateral medial)',
        tests: [
          { n: 'Moving valgus stress test', role: 'screen',
            d: 'Estrés en valgo con extensión rápida; dolor entre 120° y 70° (zona de cizallamiento).',
            p: 'Sens ~100 % · Esp ~75 %. Negativo hace improbable el desgarro del MCL.' },
        ]
      },
      {
        path: 'Rotura del tendón distal del bíceps',
        tests: [
          { n: 'Clúster (Hook + pronación pasiva + BCI)', role: 'cluster',
            d: 'Combinación diagnóstica junto a la historia.',
            p: 'Sens ~1.00 · Esp ~1.00. Estrategia de mayor valor del capítulo.' },
          { n: 'Hook test (test del gancho)', role: 'both',
            d: 'Intento de enganchar el tendón bajo supinación resistida; imposibilidad es positiva.',
            p: 'Sens ~1.00 · Esp ~0.81-1.00.' },
          { n: 'Biceps squeeze test', role: 'both',
            d: 'Compresión del vientre del bíceps; ausencia de supinación es positiva.',
            p: 'Sens ~0.96 · Esp ~1.00 · LR− ~0.04.' },
          { n: 'Bicipital aponeurosis flex test', role: 'both',
            d: 'Palpación de la aponeurosis en tensión; hueco palpable indica rotura oculta.',
            p: 'Sens ~1.00 · Esp ~0.90 · LR+ ~10.' },
        ]
      },
      {
        path: 'Síndrome del túnel cubital',
        tests: [
          { n: 'Test combinado presión + flexión', role: 'both',
            d: 'Presión sobre el nervio cubital con el codo flexionado.',
            p: 'Sens ~0.98 · Esp ~0.95 · LR+ ~19.6 · LR− ~0.02. Clúster de mayor valor.' },
          { n: 'Elbow pressure test', role: 'both',
            d: 'Presión externa proximal al túnel cubital durante 60 s.',
            p: 'Sens ~0.89 · Esp ~0.98 · LR+ ~44.5 · LR− ~0.11.' },
          { n: 'Test de flexión del codo (Wadsworth)', role: 'confirm',
            d: 'Flexión máxima mantenida 3-5 min con extensión de muñeca.',
            p: 'Sens ~0.75-0.93 · Esp ~0.99 · LR+ ~75.' },
          { n: 'Signo de Tinel en el codo', role: 'confirm',
            d: 'Percusión del nervio cubital en el surco epitrocleo-olecraniano.',
            p: 'Sens ~0.70 · Esp ~0.98 · LR+ ~35.' },
        ]
      },
    ]
  },
  {
    name: 'Muñeca y mano',
    groups: [
      {
        path: 'Síndrome del túnel carpiano',
        tests: [
          { n: 'Test de compresión del mediano', role: 'confirm',
            d: 'Compresión directa sostenida sobre el mediano en el túnel.',
            p: 'Sens ~79 % · Esp ~100 % · LR+ ~79.' },
          { n: 'Hand elevation test', role: 'confirm',
            d: 'Ambas manos elevadas sobre la cabeza; síntomas en <2 min.',
            p: 'Sens ~76 % · Esp ~99 % · LR+ ~76.' },
          { n: 'Test de Durkan (compresión carpiana)', role: 'both',
            d: 'Presión sobre el túnel carpiano 30-60 s reproduciendo parestesias del mediano.',
            p: 'Sens ~87 % · Esp ~90 % · LR+ ~8.7 · LR− ~0.14.' },
          { n: 'Signo de Tinel en la muñeca', role: 'confirm',
            d: 'Percusión sobre el túnel carpiano; hormigueo distal en territorio del mediano.',
            p: 'Esp ~95-99 % · LR+ hasta ~11.' },
        ]
      },
      {
        path: 'Fractura de escafoides',
        tests: [
          { n: 'Supinación contra resistencia', role: 'both',
            d: 'Supinación resistida del antebrazo; dolor localizado es positivo.',
            p: 'Sens ~100 % · Esp ~98 % · LR+ ~50.' },
          { n: 'Compresión longitudinal del pulgar', role: 'both',
            d: 'Compresión axial del metacarpiano del pulgar hacia el escafoides.',
            p: 'Sens ~98 % · Esp ~98 % · LR+ ~49 · LR− ~0.02.' },
          { n: 'Sensibilidad de la tabaquera anatómica', role: 'screen',
            d: 'Palpación de la tabaquera; ausencia de dolor hace improbable la fractura.',
            p: 'Sens ~100 % (Esp baja aislada). Puerta de cribado.' },
        ]
      },
      {
        path: 'Artrosis carpometacarpiana del pulgar',
        tests: [
          { n: 'Traction-shift grind', role: 'confirm',
            d: 'Tracción del metacarpiano con presión dorsal en la base; crepitación y dolor.',
            p: 'Esp ~100 % · Sens ~66.7 % · VPP ~100 %.' },
          { n: 'Thumb grind test (molido del pulgar)', role: 'confirm',
            d: 'Compresión axial + rotación de la articulación CMC.',
            p: 'Sens ~30 % · Esp ~96.7 % · VPP ~90 %.' },
        ]
      },
      {
        path: 'Tenosinovitis de De Quervain',
        tests: [
          { n: 'Test WHAT (hiperflexión + abducción del pulgar)', role: 'screen',
            d: 'Abducción resistida del pulgar con la muñeca en flexión máxima.',
            p: 'Sens ~99 % · Esp ~29 % · VPN ~95 %. Mejor test para descartar.' },
        ]
      },
      {
        path: 'Patencia arterial de la mano',
        tests: [
          { n: 'Test de Allen', role: 'confirm',
            d: 'Compresión radial y cubital; se libera cada arteria y se cronometra el relleno (>6 s positivo).',
            p: 'Esp ~97 % · LR+ ~23 (cubital). Confirma compromiso de patencia.' },
        ]
      },
    ]
  },
  {
    name: 'Columna lumbar',
    groups: [
      {
        path: 'Radiculopatía / hernia discal',
        tests: [
          { n: 'Elevación de la pierna recta (SLR / Lasègue)', role: 'screen',
            d: 'Flexión pasiva de cadera con rodilla extendida; dolor irradiado en distribución ciática.',
            p: 'Sens ~91 % · Esp ~26 %. Negativo ayuda a descartar compresión radicular.' },
          { n: 'SLR cruzado (well leg raise)', role: 'confirm',
            d: 'Elevar la pierna sana reproduce dolor en la pierna sintomática; sugiere hernia central/medial grande.',
            p: 'Sens ~29 % · Esp ~88 %.' },
          { n: 'Test de Slump', role: 'both',
            d: 'Flexión progresiva de tronco, cuello y rodilla con dorsiflexión; reproducción de síntomas.',
            p: 'Sens ~84 % · Esp ~83 %. Mejor neurodinámico del capítulo.' },
        ]
      },
      {
        path: 'Estenosis / claudicación neurógena',
        tests: [
          { n: 'Test en cinta de dos fases (llano vs inclinado)', role: 'confirm',
            d: 'Marcha en llano (extensión, síntomas antes) vs inclinada (flexión, alivio).',
            p: 'Mayor tiempo inclinado: Esp ~92 %, LR+ ~6.49. Recuperación prolongada: LR− ~0.26.' },
        ]
      },
      {
        path: 'Inestabilidad segmentaria',
        tests: [
          { n: 'Passive Lumbar Extension test', role: 'both',
            d: 'En prono se elevan y extienden ambas piernas; dolor lumbar intenso que cede al bajarlas.',
            p: 'Sens ~84 % · Esp ~90 %. Test de mayor exactitud para inestabilidad segmentaria.' },
        ]
      },
    ]
  },
  {
    name: 'Cadera',
    groups: [
      {
        path: 'Patología intraarticular / labral',
        tests: [
          { n: 'Test THIRD (rotación interna con distracción)', role: 'screen',
            d: 'Rotación medial con compresión vs distracción; dolor mayor en compresión.',
            p: 'Sens 98 % · Esp 75 % · LR− 0.03. Excelente para descartar.' },
          { n: 'IROP / impingement anterior (FADDIR pasivo)', role: 'screen',
            d: 'Flexión 90° + rotación medial con sobrepresión; dolor y end-feel anómalo.',
            p: 'Sens alta (91-99 %) · Esp baja. Cribado de FAI/labral.' },
          { n: 'Test del ligamento redondo', role: 'both',
            d: 'Aducción 30° bajo la abducción máxima con rotaciones máximas; dolor positivo.',
            p: 'Sens 90 % · Esp 85 %.' },
          { n: 'Test de impingement isquiofemoral (IFI)', role: 'both',
            d: 'Extensión + aducción + rotación lateral; se alivia en abducción.',
            p: 'Sens 82 % · Esp 85 %.' },
        ]
      },
      {
        path: 'Abductores / síndrome del trocánter mayor (GTPS)',
        tests: [
          { n: 'External de-rotation test', role: 'both',
            d: 'Rotación lateral resistida; dolor lateral = GTPS, inguinal = artrosis.',
            p: 'Sens 88 % · Esp 97 % · LR+ 33.5 · LR− 0.12. De los más precisos del capítulo.' },
          { n: 'Hip lag sign', role: 'confirm',
            d: 'Incapacidad de sostener abducción/rotación medial pasiva (glúteo medio).',
            p: 'Sens 89 % · Esp 97 % · VPP 0.94.' },
        ]
      },
      {
        path: 'Síndrome glúteo profundo / piriforme',
        tests: [
          { n: 'Estiramiento del piriforme en sedestación', role: 'confirm',
            d: 'Extensión de rodilla + aducción y rotación medial de la cadera; dolor en el piriforme.',
            p: 'Sens 52 % · Esp 90 % · LR+ 5.22.' },
          { n: 'Estiramiento activo del piriforme', role: 'both',
            d: 'Abducción y rotación lateral resistidas en decúbito lateral.',
            p: 'Sens 78 % · Esp 80 % · LR+ 3.90.' },
        ]
      },
      {
        path: 'Tendinopatía isquiotibial proximal',
        tests: [
          { n: 'Active hamstring test (30°+90°)', role: 'confirm',
            d: 'Flexión resistida de rodilla a 30° y 90°; más débil/dolorosa a 30°.',
            p: 'Esp 97 % · Sens 84 % · LR+ 26.86.' },
          { n: 'Bent-knee stretch test', role: 'both',
            d: 'Extensión lenta de la rodilla desde flexión máxima de cadera y rodilla.',
            p: 'Sens 84 % · Esp 87 % · LR+ 6.5 · LR− 0.18.' },
          { n: 'Test de Puranen-Orava', role: 'both',
            d: 'Estiramiento activo de pie con el pie sobre una camilla.',
            p: 'Sens 76 % · Esp 82 % · LR+ 4.4.' },
        ]
      },
      {
        path: 'Fractura de cadera / estrés femoral',
        tests: [
          { n: 'Signo de percusión patelo-púbica', role: 'both',
            d: 'Estetoscopio en la sínfisis; percusión rotuliana comparada, sonido apagado en el lado fracturado.',
            p: 'Sens 0.94 · Esp 0.95 · LR+ 20.4 · LR− 0.06 (fracturas mixtas).' },
          { n: 'Fulcrum test (fémur proximal)', role: 'screen',
            d: 'Antebrazo como fulcro bajo el muslo; dolor agudo sobre el foco de fractura.',
            p: 'Sens 0.93 · Esp 0.75 · LR− 0.09 (proximal). Poco fiable en diáfisis media.' },
        ]
      },
    ]
  },
  {
    name: 'Rodilla',
    groups: [
      {
        path: 'Ligamento cruzado anterior (LCA)',
        tests: [
          { n: 'Test de Lachman', role: 'both',
            d: 'Traslación anterior de la tibia a 20-30° de flexión; end-feel blando.',
            p: 'Esp 90-100 % · Sens 74-99 %. Test aislado de mayor rendimiento para el LCA.' },
          { n: 'Pivot shift (MacIntosh)', role: 'confirm',
            d: 'Valgo + rotación medial de extensión a flexión; subluxación-reducción de la meseta lateral.',
            p: 'Esp 97-100 % · LR+ 8.2-27 (despierto sens baja; ~95 % bajo anestesia).' },
          { n: 'Cajón anterior (rodilla crónica)', role: 'confirm',
            d: 'Traslación anterior a 90° de flexión; tras descartar sag posterior.',
            p: 'Esp 87-100 %; sens alta en crónicos (LR+ crónico ~8.9).' },
        ]
      },
      {
        path: 'Ligamento cruzado posterior (LCP)',
        tests: [
          { n: 'Cajón posterior', role: 'both',
            d: 'Empuje posterior de la tibia a 90° de flexión.',
            p: 'Esp 98-100 % · LR+ ~50 · LR− ~0.11. Mejor test para el LCP.' },
          { n: 'Posterior sag sign', role: 'confirm',
            d: 'La tibia cae por gravedad a 90°; pérdida del escalón tibial (step-off).',
            p: 'Esp 100 % · LR+ ~88 (roturas crónicas).' },
          { n: 'Quadriceps active test', role: 'both',
            d: 'La contracción del cuádriceps reposiciona anteriormente la tibia retrasada.',
            p: 'Esp 96-100 % · LR+ hasta ~98 · LR− bajo.' },
        ]
      },
      {
        path: 'Ligamento colateral medial (LCM)',
        tests: [
          { n: 'Estrés en valgo (a 20-30°)', role: 'screen',
            d: 'Apertura medial con estrés en valgo; la fase flexionada es el verdadero test en un plano.',
            p: 'Sens 86-96 % para roturas del LCM.' },
        ]
      },
      {
        path: 'Lesión meniscal',
        tests: [
          { n: 'Clúster meniscal (≥2 de 6 tests)', role: 'cluster',
            d: 'Interlínea + Böhler + McMurray + Steinmann + Apley + Payr.',
            p: 'Sens 96.5 % · Esp 87 % · LR+ 7.42 · LR− 0.04. Muy superior a cualquier test aislado.' },
          { n: 'Test de McMurray', role: 'confirm',
            d: 'Rotación + extensión desde flexión completa; chasquido con dolor en interlínea.',
            p: 'Esp 77-98 % · LR+ ~8.86. Mejor dentro del clúster.' },
        ]
      },
      {
        path: 'Inestabilidad rotatoria / rincón posterolateral',
        tests: [
          { n: 'Supine internal rotation test (LCP/PMRI)', role: 'both',
            d: 'Torque de rotación medial a distintos ángulos; excursión aumentada del tubérculo.',
            p: 'Sens 95.5 % · Esp 97.1 %. Test rotatorio con mejor precisión del capítulo.' },
          { n: 'External rotation recurvatum test (PLRI)', role: 'confirm',
            d: 'Al elevar por los dedos, la tibia cae en varo, rotación lateral e hiperextensión.',
            p: 'Esp 100 % · Sens ~30 %.' },
        ]
      },
      {
        path: 'Inestabilidad rotuliana',
        tests: [
          { n: 'Moving Patellar Apprehension Test (MPAT)', role: 'both',
            d: 'Aprensión con traslación lateral y ausencia con traslación medial (deben darse ambos pasos).',
            p: 'Sens 100 % · Esp 88.4 %. Mejor test de inestabilidad rotuliana del capítulo.' },
          { n: 'Test de aprensión de Fairbank', role: 'confirm',
            d: 'Empuje lateral de la rótula a 30°; sensación de que "se va a salir".',
            p: 'Esp ~92 % · Sens 7-39 %.' },
        ]
      },
    ]
  },
];

// ---------- role badges ----------
const roleMeta = {
  confirm: { label: 'Confirmatorio', color: CONFIRM },
  screen:  { label: 'Cribado / descarte', color: SCREEN },
  both:    { label: 'Confirma y descarta', color: BOTH },
  cluster: { label: 'Clúster', color: CLUSTER },
};

// ---------- build paragraphs ----------
const children = [];

// cover / title block
children.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: 'Tests clínicos de alta evidencia', bold: true, size: 40, color: PURPLE_D, font: 'Calibri' })],
}));
children.push(new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text: 'Exploración ortopédica agrupada por región y patología', italics: true, size: 22, color: GREY, font: 'Calibri' })],
}));
children.push(new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PURPLE, space: 4 } },
  spacing: { after: 140 },
  children: [],
}));

// intro note
children.push(new Paragraph({
  spacing: { after: 80 },
  children: [
    new TextRun({ text: 'Criterio de selección. ', bold: true, size: 18, color: GREY, font: 'Calibri' }),
    new TextRun({ text: 'Se incluyen los tests con precisión diagnóstica documentada de alto valor: alta especificidad / LR+ elevado (confirmatorios), alta sensibilidad / LR− bajo (cribado), o ambas (confirma y descarta), además de los clústeres y reglas de predicción. Se han excluido los tests que la fuente marca como de baja validez, con LR próximos a 1 o sin cifras. Fuente: Magee, Orthopedic Physical Assessment.', size: 18, color: GREY, font: 'Calibri' }),
  ],
}));

// legend
const legendRuns = [ new TextRun({ text: 'Leyenda: ', bold: true, size: 16, color: GREY, font: 'Calibri' }) ];
['confirm','screen','both','cluster'].forEach((k, i) => {
  const m = roleMeta[k];
  legendRuns.push(new TextRun({ text: '■ ', size: 16, color: m.color, font: 'Calibri' }));
  legendRuns.push(new TextRun({ text: m.label + (i < 3 ? '   ' : ''), size: 16, color: GREY, font: 'Calibri' }));
});
children.push(new Paragraph({ spacing: { after: 160 }, children: legendRuns }));

// regions
regions.forEach((region) => {
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 80 },
    keepNext: true,
    shading: { type: 'clear', fill: 'F3E8FF' },
    children: [new TextRun({ text: '  ' + region.name, bold: true, size: 24, color: PURPLE_D, font: 'Calibri' })],
  }));

  region.groups.forEach((g) => {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 120, after: 50 },
      keepNext: true,
      children: [new TextRun({ text: g.path, bold: true, size: 19, color: PURPLE, font: 'Calibri' })],
    }));

    g.tests.forEach((t) => {
      const m = roleMeta[t.role];
      // name + badge
      children.push(new Paragraph({
        spacing: { before: 40, after: 10 },
        keepNext: true,
        children: [
          new TextRun({ text: t.n + '  ', bold: true, size: 18, color: '111827', font: 'Calibri' }),
          new TextRun({ text: '■ ' + m.label, size: 14, color: m.color, font: 'Calibri' }),
        ],
      }));
      // description
      children.push(new Paragraph({
        spacing: { after: 10 },
        children: [new TextRun({ text: t.d, size: 17, color: '374151', font: 'Calibri' })],
      }));
      // precision
      children.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'Precisión. ', bold: true, italics: true, size: 16, color: GREY_L, font: 'Calibri' }),
          new TextRun({ text: t.p, italics: true, size: 16, color: GREY_L, font: 'Calibri' }),
        ],
      }));
    });
  });
});

// ---------- document ----------
const doc = new Document({
  creator: 'PhysiQ',
  title: 'Tests clínicos de alta evidencia',
  styles: {
    default: { document: { run: { font: 'Calibri' } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4 in DXA
        margin: { top: 1000, bottom: 1000, left: 900, right: 900 },
      },
      column: { count: 2, space: 500, equalWidth: true },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB', space: 2 } },
          children: [new TextRun({ text: 'Tests clínicos de alta evidencia', size: 14, color: GREY_L, font: 'Calibri' })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'PhysiQ · ', size: 14, color: GREY_L, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 14, color: GREY_L, font: 'Calibri' }),
            new TextRun({ text: ' / ', size: 14, color: GREY_L, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: GREY_L, font: 'Calibri' }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('written', process.argv[2], buf.length, 'bytes');
});
