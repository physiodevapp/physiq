'use strict';
// ─── DATA ─────────────────────────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    id: 'cervical',
    name: 'Columna Cervical',
    icon: '🔵',
    categories: [
      {
        name: 'Fuerza musculatura cervical profunda',
        tests: [
          { id: 'cx-001', name: 'Craniocervical flexion test', ev: 'green', link: 'https://www.youtube.com/watch?v=cAfcQIRm9Ew' },
          { id: 'cx-002', name: 'Deep neck flexor endurance test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Síntomas neurológicos',
        tests: [
          { id: 'cx-003', name: 'Brachial plexus tension test', ev: 'green', link: 'https://www.youtube.com/watch?v=rir6x6Iiqc4' },
          { id: 'cx-004', name: 'Brachial plexus provocation test', ev: 'green', link: 'https://www.youtube.com/watch?v=rir6x6Iiqc4' },
          { id: 'cx-005', name: 'Doorbell sign', ev: 'yellow', link: '' },
          { id: 'cx-006', name: 'Distraction test (if symptoms severe)', ev: 'green', link: 'https://www.youtube.com/watch?v=P5ib_KBlJug' },
          { id: 'cx-007', name: 'Foraminal compression test (three stages)', ev: 'green', link: 'https://www.youtube.com/watch?v=3ZSNdv0o0yk' },
          { id: 'cx-008', name: 'Upper limb neurodynamic tests', ev: 'green', link: 'https://www.youtube.com/watch?v=rir6x6Iiqc4' },
        ]
      },
      {
        name: 'Mielопатия',
        tests: [
          { id: 'cx-009', name: 'Romberg test', ev: 'green', link: '' },
          { id: 'cx-010', name: 'Babinski test', ev: 'green', link: '' },
          { id: 'cx-011', name: 'Clonus test', ev: 'yellow', link: '' },
          { id: 'cx-012', name: 'Hoffmann’s sign', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Inestabilidad',
        tests: [
          { id: 'cx-013', name: 'Sharp-Purser test', ev: 'yellow', link: '' },
          { id: 'cx-014', name: 'Tectorial membrane stress test', ev: 'red', link: '' },
          { id: 'cx-015', name: 'Alar ligament stress test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Articulaciones facetarias',
        tests: [
          { id: 'cx-016', name: 'Extension-rotation test', ev: 'yellow', link: '' },
          { id: 'cx-017', name: 'Joint play assessment (P-A glides)', ev: 'yellow', link: '' },
        ]
      },
    ]
  },
  {
    id: 'hombro',
    name: 'Hombro',
    icon: '🔶',
    categories: [
      {
        name: 'Pinzamiento anterior',
        tests: [
          { id: 'ho-001', name: 'Neer test and modification', ev: 'green', link: 'https://www.youtube.com/watch?v=hm_WrN1DQFA' },
          { id: 'ho-002', name: 'Hawkins-Kennedy test', ev: 'green', link: 'https://www.youtube.com/watch?v=UFCiQq9mDpQ' },
          { id: 'ho-029', name: 'Coracoid impingement sign', ev: 'green', link: '' },
          { id: 'ho-030', name: 'Supine impingement test', ev: 'green', link: '' },
          { id: 'ho-031', name: 'Yokum test', ev: 'green', link: '' },
          { id: 'ho-032', name: 'Zaslav test (IRRST)', ev: 'green', link: '' },
          { id: 'ho-005', name: 'Painful arc (60–120°)', ev: 'green', link: '' },
          { id: 'ho-004', name: 'Full Can test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Manguito rotador',
        tests: [
          { id: 'ho-003', name: 'Empty Can test (Jobe)', ev: 'green', link: 'https://www.youtube.com/watch?v=iT2Cj0fCH4w' },
          { id: 'ho-033', name: 'Champagne toast position', ev: 'green', link: '' },
          { id: 'ho-034', name: 'Rent test', ev: 'green', link: '' },
          { id: 'ho-006', name: 'External rotation lag sign (ERLS)', ev: 'green', link: '' },
          { id: 'ho-007', name: 'Lift-off test (Gerber’s)', ev: 'green', link: '' },
          { id: 'ho-035', name: 'Medial rotation lag or ‘spring back’ test', ev: 'green', link: '' },
          { id: 'ho-036', name: 'Infraspinatus test', ev: 'green', link: '' },
          { id: 'ho-037', name: 'Lateral rotation lag sign', ev: 'green', link: '' },
          { id: 'ho-038', name: 'Hornblower’s sign (Patte’s test)', ev: 'green', link: '' },
          { id: 'ho-009', name: 'Belly-press test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=Vp11X6DUJ3k' },
          { id: 'ho-010', name: 'Napoleon test', ev: 'yellow', link: '' },
          { id: 'ho-011', name: 'External rotation resistance test', ev: 'yellow', link: '' },
          { id: 'ho-039', name: 'Dropping sign', ev: 'yellow', link: '' },
          { id: 'ho-008', name: 'Bear-hug test', ev: 'red', link: 'https://www.youtube.com/watch?v=9BNJt_r7-i4' },
        ]
      },
      {
        name: 'SLAP / Lesiones labrales',
        tests: [
          { id: 'ho-014', name: 'Active compression test of O’Brien', ev: 'green', link: 'https://www.youtube.com/watch?v=iF7RfPuZJsA' },
          { id: 'ho-017', name: 'Kim test I (Biceps load test II)', ev: 'green', link: '' },
          { id: 'ho-040', name: 'Porcellini test', ev: 'green', link: '' },
          { id: 'ho-041', name: 'Whipple test', ev: 'green', link: '' },
          { id: 'ho-042', name: 'Crank test', ev: 'green', link: '' },
          { id: 'ho-012', name: 'Speed’s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=yvnnKVIJGNE' },
          { id: 'ho-013', name: 'Yergason’s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=HxTmxJSZfLM' },
          { id: 'ho-016', name: 'Compression-rotation test', ev: 'yellow', link: '' },
          { id: 'ho-015', name: 'Anterior slide test', ev: 'yellow', link: '' },
          { id: 'ho-018', name: 'SLAP prehension test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Inestabilidad anterior',
        tests: [
          { id: 'ho-019', name: 'Anterior apprehension test', ev: 'green', link: 'https://www.youtube.com/watch?v=3tSfKBrZjlU' },
          { id: 'ho-020', name: 'Relocation test (Jobe)', ev: 'green', link: 'https://www.youtube.com/watch?v=3tSfKBrZjlU' },
          { id: 'ho-021', name: 'Anterior release (surprise) test', ev: 'green', link: '' },
          { id: 'ho-023', name: 'Load and shift test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad posterior / multidireccional',
        tests: [
          { id: 'ho-043', name: 'Jerk (Jahnke) test', ev: 'green', link: '' },
          { id: 'ho-024', name: 'Sulcus sign', ev: 'green', link: '' },
          { id: 'ho-022', name: 'Posterior apprehension or stress test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'AC joint',
        tests: [
          { id: 'ho-025', name: 'Horizontal adduction (cross-body adduction) test', ev: 'green', link: 'https://www.youtube.com/watch?v=B1EB6p8aYcM' },
          { id: 'ho-027', name: 'Paxinos sign', ev: 'green', link: '' },
          { id: 'ho-028', name: 'Glenohumeral internal rotation deficit (GIRD)', ev: 'green', link: '' },
          { id: 'ho-026', name: 'Piano key sign (AC joint)', ev: 'yellow', link: '' },
          { id: 'ho-044', name: 'Acromioclavicular shear test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Neurológico',
        tests: [
          { id: 'ho-045', name: 'ULNT – Median nerve (ULNT I)', ev: 'green', link: '' },
          { id: 'ho-046', name: 'ULNT – Median nerve (ULNT II)', ev: 'green', link: '' },
          { id: 'ho-047', name: 'ULNT – Radial nerve (ULNT III)', ev: 'green', link: '' },
          { id: 'ho-048', name: 'ULNT – Ulnar nerve (ULNT IV)', ev: 'green', link: '' },
        ]
      },
    ]
  },
  {
    id: 'codo',
    name: 'Codo',
    icon: '🟡',
    categories: [
      {
        name: 'Tendinopatía lateral / medial',
        tests: [
          { id: 'co-001', name: 'Cozen’s test (lateral epicondyle)', ev: 'yellow', link: 'https://www.youtube.com/watch?v=_iGbnJrBBEE' },
          { id: 'co-002', name: 'Mill’s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=_iGbnJrBBEE' },
          { id: 'co-003', name: 'Chair test', ev: 'green', link: '' },
          { id: 'co-004', name: 'Maudsley’s test (middle finger)', ev: 'yellow', link: '' },
          { id: 'co-005', name: 'Golfer’s elbow test (medial)', ev: 'yellow', link: '' },
          { id: 'co-006', name: 'Valgus stress test', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Nervio cubital',
        tests: [
          { id: 'co-007', name: 'Elbow flexion test', ev: 'green', link: '' },
          { id: 'co-008', name: 'Tinel’s sign at elbow', ev: 'yellow', link: '' },
          { id: 'co-009', name: 'Cubital tunnel provocation test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad',
        tests: [
          { id: 'co-010', name: 'Posterolateral rotatory instability test (O’Driscoll)', ev: 'green', link: '' },
          { id: 'co-011', name: 'Lateral pivot shift test', ev: 'green', link: '' },
        ]
      },
    ]
  },
  {
    id: 'muneca',
    name: 'Muñeca',
    icon: '🟢',
    categories: [
      {
        name: 'TFCC / carpo',
        tests: [
          { id: 'mu-001', name: 'TFCC load test (Press test)', ev: 'green', link: '' },
          { id: 'mu-002', name: 'TFCC grind test', ev: 'yellow', link: '' },
          { id: 'mu-003', name: 'Distal radio-ulnar joint (DRUJ) stress test', ev: 'yellow', link: '' },
          { id: 'mu-004', name: 'Watson scaphoid shift test', ev: 'green', link: 'https://www.youtube.com/watch?v=rIiS-XEFlLg' },
          { id: 'mu-005', name: 'Scaphoid compression test', ev: 'yellow', link: '' },
          { id: 'mu-006', name: 'Lunotriquetral ballottement test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Nervio mediano / canal carpiano',
        tests: [
          { id: 'mu-007', name: 'Phalen’s test', ev: 'green', link: 'https://www.youtube.com/watch?v=F1sJpE4h7Lc' },
          { id: 'mu-008', name: 'Tinel’s sign at wrist', ev: 'yellow', link: 'https://www.youtube.com/watch?v=F1sJpE4h7Lc' },
          { id: 'mu-009', name: 'Carpal compression test', ev: 'green', link: '' },
          { id: 'mu-010', name: 'Hand elevation test', ev: 'green', link: '' },
          { id: 'mu-011', name: 'Flick sign', ev: 'green', link: '' },
        ]
      },
      {
        name: 'De Quervain / tendinosas',
        tests: [
          { id: 'mu-012', name: 'Finkelstein’s test', ev: 'green', link: 'https://www.youtube.com/watch?v=oTzKRhHFY9Q' },
          { id: 'mu-013', name: 'Eichhoff test (variant)', ev: 'yellow', link: '' },
        ]
      },
    ]
  },
  {
    id: 'cadera',
    name: 'Cadera',
    icon: '🟠',
    categories: [
      {
        name: 'FAI / labrum',
        tests: [
          { id: 'ca-001', name: 'FADIR test', ev: 'green', link: 'https://www.youtube.com/watch?v=G-bDl--eDMg' },
          { id: 'ca-002', name: 'FABER test (Patrick’s)', ev: 'green', link: 'https://www.youtube.com/watch?v=dAr5LzLRFiE' },
          { id: 'ca-003', name: 'Anterior impingement test', ev: 'yellow', link: '' },
          { id: 'ca-004', name: 'Posterior impingement test', ev: 'yellow', link: '' },
          { id: 'ca-005', name: 'Log roll test', ev: 'yellow', link: '' },
          { id: 'ca-006', name: 'Scour test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad',
        tests: [
          { id: 'ca-007', name: 'Hip distraction test', ev: 'yellow', link: '' },
          { id: 'ca-008', name: 'Prone hip distraction (PIVM)', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Tendones / bursas',
        tests: [
          { id: 'ca-009', name: 'Ober’s test (IT band)', ev: 'yellow', link: 'https://www.youtube.com/watch?v=sMJvbT4Kmh0' },
          { id: 'ca-010', name: 'Modified Ober’s test', ev: 'green', link: '' },
          { id: 'ca-011', name: 'Thomas test', ev: 'green', link: 'https://www.youtube.com/watch?v=JFTLXDfGsxM' },
          { id: 'ca-012', name: 'Rectus femoris contracture (Ely test)', ev: 'yellow', link: '' },
          { id: 'ca-013', name: 'Trendelenburg test', ev: 'green', link: 'https://www.youtube.com/watch?v=MCOQ41ohNpg' },
          { id: 'ca-014', name: 'Greater trochanteric provocation test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Nervio ciático / piriforme',
        tests: [
          { id: 'ca-015', name: 'FAIR test (piriform)', ev: 'yellow', link: '' },
          { id: 'ca-016', name: 'Seated piriformis test', ev: 'yellow', link: '' },
        ]
      },
    ]
  },
  {
    id: 'rodilla',
    name: 'Rodilla',
    icon: '🔴',
    categories: [
      {
        name: 'Ligamentos cruzados',
        tests: [
          { id: 'ro-001', name: 'Lachman test', ev: 'green', link: 'https://www.youtube.com/watch?v=8L9Z5S_WX_0' },
          { id: 'ro-002', name: 'Anterior drawer test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=DvF7vvk9BIo' },
          { id: 'ro-003', name: 'Pivot shift test', ev: 'green', link: 'https://www.youtube.com/watch?v=YEgJJaLjyZk' },
          { id: 'ro-004', name: 'Posterior drawer test', ev: 'green', link: '' },
          { id: 'ro-005', name: 'Quadriceps active test', ev: 'green', link: '' },
          { id: 'ro-006', name: 'Godfrey (posterior sag) test', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Ligamentos colaterales',
        tests: [
          { id: 'ro-007', name: 'Valgus stress test (MCL)', ev: 'green', link: 'https://www.youtube.com/watch?v=F_Kn76EFMDA' },
          { id: 'ro-008', name: 'Varus stress test (LCL)', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Meniscos',
        tests: [
          { id: 'ro-009', name: 'McMurray test', ev: 'green', link: 'https://www.youtube.com/watch?v=sNH7Og8VUeQ' },
          { id: 'ro-010', name: 'Apley’s test', ev: 'green', link: '' },
          { id: 'ro-014', name: '"Bounce home" test', ev: 'yellow', link: '' },
          { id: 'ro-013', name: 'Childress’ sign (squat and duck walk test)', ev: 'yellow', link: '' },
          { id: 'ro-024', name: 'Dynamic knee test', ev: 'yellow', link: '' },
          { id: 'ro-025', name: 'Ege’s test', ev: 'yellow', link: '' },
          { id: 'ro-027', name: 'O’Donohue’s test', ev: 'yellow', link: '' },
          { id: 'ro-011', name: 'Thessaly test', ev: 'yellow', link: '' },
          { id: 'ro-012', name: 'Joint line tenderness', ev: 'yellow', link: '' },
          { id: 'ro-026', name: 'Figure-of-four meniscal stress maneuver', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Plica sinovial',
        tests: [
          { id: 'ro-028', name: 'Hughston’s plica test', ev: 'yellow', link: '' },
          { id: 'ro-029', name: 'Mediopatellar plica test', ev: 'yellow', link: '' },
          { id: 'ro-030', name: 'Patellar bowstring test', ev: 'yellow', link: '' },
          { id: 'ro-031', name: 'Plica “stutter” test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Derrame articular',
        tests: [
          { id: 'ro-032', name: 'Brush, stroke or bulge test (minimal swelling)', ev: 'green', link: '' },
          { id: 'ro-035', name: 'Patellar tap test (moderate swelling)', ev: 'green', link: '' },
          { id: 'ro-033', name: 'Fluctuation test (moderate swelling)', ev: 'yellow', link: '' },
          { id: 'ro-034', name: 'Indentation test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Síndrome femoropatelar',
        tests: [
          { id: 'ro-018', name: 'Fairbank’s apprehension test', ev: 'green', link: '' },
          { id: 'ro-015', name: 'Clarke’s sign (patellar grind)', ev: 'yellow', link: '' },
          { id: 'ro-036', name: 'Eccentric step (lateral step down) test', ev: 'yellow', link: '' },
          { id: 'ro-037', name: 'McConnell test', ev: 'yellow', link: '' },
          { id: 'ro-038', name: 'Motion palpation test', ev: 'yellow', link: '' },
          { id: 'ro-039', name: 'Step up test', ev: 'yellow', link: '' },
          { id: 'ro-016', name: 'Patellar glide / tilt test', ev: 'yellow', link: '' },
          { id: 'ro-046', name: 'Moving patellar apprehension test', ev: 'yellow', link: '' },
          { id: 'ro-019', name: 'J-sign (lateral tracking)', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Cuádriceps / coactivación',
        tests: [
          { id: 'ro-017', name: 'Vastus medialis coordination test', ev: 'yellow', link: '' },
          { id: 'ro-040', name: 'Q-angle', ev: 'yellow', link: '' },
          { id: 'ro-041', name: 'Tubercle sulcus test', ev: 'yellow', link: '' },
          { id: 'ro-042', name: 'Single-limb dead-lift', ev: 'yellow', link: '' },
          { id: 'ro-043', name: 'Lateral hop', ev: 'yellow', link: '' },
          { id: 'ro-044', name: 'Transverse hop', ev: 'yellow', link: '' },
          { id: 'ro-045', name: 'Lateral band walks', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Banda iliotibial',
        tests: [
          { id: 'ro-047', name: 'Noble compression test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Tendones / bursas',
        tests: [
          { id: 'ro-020', name: 'Patellar tendon palpation', ev: 'green', link: '' },
          { id: 'ro-021', name: 'Royal London Hospital test', ev: 'green', link: '' },
          { id: 'ro-022', name: 'Arc test (patellar tendinopathy)', ev: 'green', link: '' },
          { id: 'ro-023', name: 'Pes anserine bursitis palpation', ev: 'yellow', link: '' },
        ]
      },
    ]
  },
  {
    id: 'tobillo',
    name: 'Tobillo / Pie',
    icon: '🞫',
    categories: [
      {
        name: 'Ligamentos / inestabilidad',
        tests: [
          { id: 'to-001', name: 'Anterior drawer test (ATFL)', ev: 'green', link: 'https://www.youtube.com/watch?v=4C4eqJjQFbc' },
          { id: 'to-002', name: 'Talar tilt test (CFL)', ev: 'yellow', link: '' },
          { id: 'to-003', name: 'External rotation stress test (syndesmosis)', ev: 'green', link: '' },
          { id: 'to-004', name: 'Squeeze test (syndesmosis)', ev: 'green', link: '' },
          { id: 'to-005', name: 'Cotton test (medial-lateral translation)', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Tendón de Aquiles',
        tests: [
          { id: 'to-006', name: 'Thompson test (Simmonds)', ev: 'green', link: 'https://www.youtube.com/watch?v=DqQ_OJJRdoM' },
          { id: 'to-007', name: 'Royal London Hospital test (Achilles)', ev: 'green', link: '' },
          { id: 'to-008', name: 'Matles test', ev: 'yellow', link: '' },
          { id: 'to-009', name: 'Single-leg heel rise test', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Pie plano / fascitis',
        tests: [
          { id: 'to-010', name: 'Windlass mechanism test', ev: 'green', link: '' },
          { id: 'to-011', name: 'Navicular drop test', ev: 'green', link: '' },
          { id: 'to-012', name: 'Too many toes sign', ev: 'yellow', link: '' },
          { id: 'to-013', name: 'Heel raise test (PTTD)', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Nervioso',
        tests: [
          { id: 'to-014', name: 'Tinel’s sign at tarsal tunnel', ev: 'yellow', link: '' },
          { id: 'to-015', name: 'Mulder’s click (Morton’s neuroma)', ev: 'green', link: '' },
        ]
      },
    ]
  },
  {
    id: 'lumbar',
    name: 'Lumbar / SIJ',
    icon: '🟣',
    categories: [
      {
        name: 'Lumbar — Disfunción neurológica',
        tests: [
          { id: 'lu-001', name: 'Straight leg raise (SLR)', ev: 'green', link: 'https://www.youtube.com/watch?v=RFJe0qeknQs' },
          { id: 'lu-003', name: 'Slump test', ev: 'green', link: 'https://www.youtube.com/watch?v=9A5YRzz6Jlk' },
          { id: 'lu-018', name: 'Centralization / peripheralization', ev: 'green', link: '' },
          { id: 'lu-002', name: 'Cross straight leg raise test', ev: 'yellow', link: '' },
          { id: 'lu-004', name: 'Femoral nerve traction test', ev: 'yellow', link: '' },
          { id: 'lu-019', name: 'Prone knee bending test', ev: 'yellow', link: '' },
          { id: 'lu-005', name: 'Well leg raise', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Lumbar — Inestabilidad',
        tests: [
          { id: 'lu-016', name: 'Passive lumbar extension test', ev: 'green', link: '' },
          { id: 'lu-017', name: 'Prone instability test', ev: 'green', link: '' },
          { id: 'lu-020', name: 'Prone hip extension test', ev: 'yellow', link: '' },
          { id: 'lu-021', name: 'Test for anterior lumbar spine instability', ev: 'yellow', link: '' },
          { id: 'lu-022', name: 'Test for posterior lumbar spine instability', ev: 'yellow', link: '' },
          { id: 'lu-023', name: 'H and I test', ev: 'red', link: '' },
          { id: 'lu-024', name: 'Posterior shear test', ev: 'red', link: '' },
          { id: 'lu-015', name: 'Prone segmental instability test', ev: 'red', link: '' },
          { id: 'lu-025', name: 'Specific lumbar torsion test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Lumbar — Disfunción articular',
        tests: [
          { id: 'lu-026', name: 'Clinical prediction rule for facet joint involvement', ev: 'yellow', link: '' },
          { id: 'lu-027', name: 'One-leg standing lumbar extension test (stork)', ev: 'yellow', link: '' },
          { id: 'lu-028', name: 'Quadrant test', ev: 'yellow', link: '' },
          { id: 'lu-029', name: 'Bilateral straight leg raise test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Lumbar — Acortamiento muscular',
        tests: [
          { id: 'lu-030', name: '90–90 straight leg raise test', ev: 'green', link: '' },
          { id: 'lu-031', name: 'Ober test', ev: 'yellow', link: '' },
          { id: 'lu-032', name: 'Rectus femoris test', ev: 'yellow', link: '' },
          { id: 'lu-033', name: 'Thomas test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Lumbar — Función muscular',
        tests: [
          { id: 'lu-034', name: 'Prone bridge test', ev: 'green', link: '' },
          { id: 'lu-014', name: 'Waddell’s signs (5 tests)', ev: 'green', link: '' },
          { id: 'lu-035', name: 'Supine bridge test', ev: 'yellow', link: '' },
          { id: 'lu-036', name: 'Gower’s sign', ev: 'yellow', link: '' },
          { id: 'lu-037', name: 'Heel-tap test', ev: 'red', link: '' },
          { id: 'lu-038', name: 'Sign of the buttock', ev: 'red', link: '' },
        ]
      },
      {
        name: 'SIJ — Afectación neurológica',
        tests: [
          { id: 'lu-013', name: 'Supine active straight leg raise (ASLR)', ev: 'green', link: '' },
          { id: 'lu-039', name: 'Prone active straight leg raise test', ev: 'green', link: '' },
        ]
      },
      {
        name: 'SIJ — Afectación articular',
        tests: [
          { id: 'lu-009', name: 'Gaenslen’s test', ev: 'green', link: 'https://www.youtube.com/watch?v=vkW2BdGX6bY' },
          { id: 'lu-012', name: 'Patrick test (FABER)', ev: 'green', link: '' },
          { id: 'lu-040', name: 'Yeoman’s test', ev: 'green', link: '' },
          { id: 'lu-041', name: 'Flamingo test', ev: 'green', link: '' },
          { id: 'lu-006', name: 'Distraction test', ev: 'green', link: '' },
          { id: 'lu-007', name: 'Compression test', ev: 'green', link: '' },
          { id: 'lu-010', name: 'Sacral thrust', ev: 'green', link: '' },
          { id: 'lu-011', name: 'Thigh thrust test', ev: 'green', link: '' },
          { id: 'lu-008', name: 'Posterior shear (POSH) test', ev: 'green', link: '' },
          { id: 'lu-042', name: 'Drop test', ev: 'yellow', link: '' },
          { id: 'lu-043', name: 'Gillet test', ev: 'yellow', link: '' },
          { id: 'lu-044', name: 'Piedallu’s sign', ev: 'yellow', link: '' },
          { id: 'lu-045', name: 'PSIS distraction test', ev: 'yellow', link: '' },
          { id: 'lu-046', name: 'Supine-to-sit test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'SIJ — Longitud y función muscular',
        tests: [
          { id: 'lu-047', name: 'Leg length measurement', ev: 'green', link: '' },
          { id: 'lu-048', name: 'Trendelenburg test', ev: 'green', link: '' },
        ]
      },
    ]
  },
];

// ─── STATE ────────────────────────────────────────────────────────────────────────────────────
let currentRegion = null;
let currentFilter = 'all';
const _linkOverrides = {};

// ─── RENDER: HOME ───────────────────────────────────────────────────────────────────────────
function renderHome() {
  document.getElementById('header-title').innerHTML = 'PhysiQ <span class="logo-accent">— Wiki</span>';
  document.getElementById('view-home').style.display = '';
  document.getElementById('view-region').style.display = 'none';

  const grid = document.getElementById('regions-grid');
  grid.innerHTML = REGIONS.map(r => {
    const total = r.categories.reduce((s, c) => s + c.tests.length, 0);
    const green = r.categories.reduce((s, c) => s + c.tests.filter(t => t.ev === 'green').length, 0);
    return `
      <div class="region-card" onclick="showRegion('${r.id}')">
        <div class="region-card-name">${r.name}</div>
        <div class="region-card-count">${total} tests</div>
        <div class="region-card-green">✓ ${green} verdes</div>
      </div>`;
  }).join('');
}

// ─── RENDER: REGION ───────────────────────────────────────────────────────────────────────
function renderRegion() {
  const content = document.getElementById('region-content');
  let html = '';
  let hasGreen = false;

  currentRegion.categories.forEach(cat => {
    const tests = cat.tests;
    if (currentFilter === 'green') {
      const visible = tests.filter(t => t.ev === 'green');
      if (visible.length === 0) return;
    }

    const items = tests.map(test => {
      const badgeClass = `ev-${test.ev}`;
      const badgeLabel = test.ev === 'green' ? '✓' : test.ev === 'yellow' ? '!' : '?';
      const rowClass   = test.ev === 'green' ? 'ev-green-row' : '';
      const hide       = currentFilter === 'green' && test.ev !== 'green' ? ' hidden' : '';

      const storedOverride = _linkOverrides[test.id];
      const effectiveLink  = storedOverride !== undefined ? storedOverride : test.link;

      const linkBtn = effectiveLink
        ? `<a class="test-link-btn has-link" href="${effectiveLink}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><svg viewBox="0 0 24 17" width="22" height="15" style="display:block"><rect width="24" height="17" rx="4" fill="#FF0000"/><path d="M10 5L16 8.5L10 12V5Z" fill="white"/></svg></a>`
        : `<span class="test-link-btn no-link">&ndash;</span>`;

      return `
        <div class="test-item ${rowClass}${hide}" data-test-id="${test.id}">
          <span class="evidence-badge ${badgeClass}">${badgeLabel}</span>
          <span class="test-name">${test.name}</span>
          ${linkBtn}
        </div>`;
    }).join('');

    const noGreenNotice = hasGreen ? '' : '<div class="no-green-notice">Sin tests de alta evidencia en esta categoría</div>';
    hasGreen = hasGreen || tests.some(t => t.ev === 'green');

    html += `
    <div class="category-section">
      <div class="category-title">${cat.name}</div>
      ${items}
    </div>`;
  });

  content.innerHTML = html;
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────────────────────────
function showRegion(id) {
  currentRegion = REGIONS.find(r => r.id === id);
  currentFilter = 'all';

  document.getElementById('view-home').style.display = 'none';
  document.getElementById('view-region').style.display = '';
  document.getElementById('region-sub-badge').textContent = currentRegion.name;

  // reset filter buttons
  document.querySelectorAll('.filter-btn').forEach((b, i) => {
    b.classList.toggle('active', i === 0);
  });

  document.getElementById('region-content').scrollTop = 0;
  renderRegion();

  history.pushState({ region: id }, '');
}

function showHome() {
  currentRegion = null;
  document.getElementById('view-home').style.display = '';
  document.getElementById('view-region').style.display = 'none';
}

window.addEventListener('popstate', () => {
  if (currentRegion) {
    showHome();
  } else if (document.body.classList.contains('in-hub')) {
    window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
  }
});

// ─── FILTER ───────────────────────────────────────────────────────────────────────────────────────
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRegion();
}

// ─── LINK OVERRIDE ──────────────────────────────────────────────────────────────────────────────
let _editingTestId = null;

function openLinkSheet(testId, testName) {
  _editingTestId = testId;
  document.getElementById('link-sheet-name').textContent = testName;

  const current = _linkOverrides[testId];
  const test    = currentRegion.categories.flatMap(c => c.tests).find(t => t.id === testId);
  document.getElementById('link-input').value = current !== undefined ? current : (test?.link ?? '');

  document.getElementById('link-sheet').style.display = 'block';
  document.getElementById('link-input').focus();
}

function closeLinkSheet() {
  document.getElementById('link-sheet').style.display = 'none';
  _editingTestId = null;
}

function saveLinkOverride() {
  if (!_editingTestId) return;
  const val = document.getElementById('link-input').value.trim();

  if (val === '') {
    delete _linkOverrides[_editingTestId];
  } else {
    _linkOverrides[_editingTestId] = val;
  }

  closeLinkSheet();
  renderRegion();
}

// ─── LONG-PRESS ────────────────────────────────────────────────────────────────────────────────────
let _longPressTimer = null;
let _longPressTarget = null;

document.addEventListener('touchstart', e => {
  const item = e.target.closest('.test-item');
  if (!item) return;
  const testId = item.dataset.testId;
  const test   = currentRegion?.categories.flatMap(c => c.tests).find(t => t.id === testId);
  if (!test) return;

  _longPressTarget = item;
  item.style.background = 'var(--surface2)';

  _longPressTimer = setTimeout(() => {
    openLinkSheet(test.id, test.name);
    item.style.background = '';
    _longPressTarget = null;
  }, 600);
}, { passive: true });

document.addEventListener('touchend', () => {
  clearTimeout(_longPressTimer);
  _longPressTimer = null;
  if (_longPressTarget) { _longPressTarget.style.background = ''; _longPressTarget = null; }
}, { passive: true });

document.addEventListener('touchmove', () => {
  clearTimeout(_longPressTimer);
  _longPressTimer = null;
  if (_longPressTarget) { _longPressTarget.style.background = ''; _longPressTarget = null; }
}, { passive: true });

document.getElementById('region-content').addEventListener('contextmenu', e => {
  if (e.target.closest('.test-item')) e.preventDefault();
});

// ─── INIT ───────────────────────────────────────────────────────────────────────────────────────────
renderHome();

function _rebuildHubHistory() {
  // Replaces current entry with hub-exit sentinel then pushes current view,
  // so swipe-back chain is always: view → home → hub (exactly 2 swipes).
  history.replaceState({ view: 'hub-exit' }, '');
  history.pushState({ view: currentRegion ? 'region' : 'home' }, '');
}

let _firstVisible = true;
window.addEventListener('message', e => {
  if (e.data?.type === 'PHYSIQ_SAT_VISIBLE' && document.body.classList.contains('in-hub')) {
    if (_firstVisible) { _firstVisible = false; return; }
    _rebuildHubHistory();
  }
});

try {
  if (window.self !== window.top) {
    document.body.classList.add('in-hub');
    document.querySelector('.logo-main').addEventListener('click', () => {
      window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
    });
    // First visit: push sentinels here; subsequent visits handled by PHYSIQ_SAT_VISIBLE above.
    history.replaceState({ view: 'hub-exit' }, '');
    history.pushState({ view: 'home' }, '');
  }
} catch (_) {
  document.body.classList.add('in-hub');
}
