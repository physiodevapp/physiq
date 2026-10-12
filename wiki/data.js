'use strict';
// ─── DATA ─────────────────────────────────────────────────────────────────────────────────────
//
// `pos` es la posición del paciente, una sola por test, y alimenta los filtros de posición y el
// modo Progresión. Valores: 'pie' | 'sentado' | 'supino' | 'lateral' | 'prono'.
//
// Un test sin `pos` no aparece bajo ningún filtro de posición (sí en el listado normal). De momento
// solo lo están los de evidencia alta. Tres se han dejado deliberadamente sin asignar:
//   co-023  Triceps squeeze test            — posición sin confirmar; pendiente de comprobar en Magee
//   lu-014  Waddell's signs (5 tests)       — son cinco signos repartidos en varias posiciones
//   lu-018  Centralization/peripheralization — no es una maniobra, es un fenómeno a lo largo de varias
//
const REGIONS = [
  {
    id: 'cervical',
    name: 'Cervical',
    icon: '🔵',
    categories: [
      {
        name: 'Fuerza musculatura cervical profunda',
        tests: [
          { id: 'cx-001', name: 'Craniocervical flexion test', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=cAfcQIRm9Ew' },
          { id: 'cx-002', name: 'Deep neck flexor endurance test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Síntomas neurológicos',
        tests: [
          { id: 'cx-003', name: 'Brachial plexus tension test', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=rir6x6Iiqc4' },
          { id: 'cx-004', name: 'Brachial plexus provocation test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=rir6x6Iiqc4' },
          { id: 'cx-005', name: 'Doorbell sign', ev: 'yellow', link: '' },
          { id: 'cx-006', name: 'Distraction test (if symptoms are severe)', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=P5ib_KBlJug' },
          { id: 'cx-007', name: 'Foraminal compression test (three stages) (if symptoms are absent or mild)', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=3ZSNdv0o0yk' },
          { id: 'cx-008', name: 'Upper limb neurodynamic (tension) tests (specific to particular nerve/nerve root symptoms)', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=rir6x6Iiqc4' },
        ]
      },
      {
        name: 'Mielopatía',
        tests: [
          { id: 'cx-009', name: 'Romberg test', ev: 'green', pos: ['pie'], link: '' },
        ]
      },
      {
        name: 'Signos vasculares',
        tests: [
          { id: 'cx-010', name: 'Hold planned mobilization/manipulation position for at least 30 seconds watching for vertebral-basilar artery signs', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Inestabilidad cervical',
        tests: [
          { id: 'cx-011', name: 'Anterior shear stress test', ev: 'red', link: '' },
          { id: 'cx-012', name: 'Lateral flexion alar ligament stress test', ev: 'red', link: '' },
          { id: 'cx-013', name: 'Lateral shear test', ev: 'yellow', link: '' },
          { id: 'cx-014', name: 'Posterior atlanto-occipital membrane test', ev: 'yellow', link: '' },
          { id: 'cx-015', name: 'Rotational alar ligament stress test', ev: 'red', link: '' },
          { id: 'cx-016', name: 'Transverse ligament stress test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Movilidad cervical',
        tests: [
          { id: 'cx-017', name: 'Cervical flexion rotation test', ev: 'green', pos: ['supino'], link: '' },
        ]
      },
      {
        name: 'Movilidad primera costilla',
        tests: [
          { id: 'cx-018', name: 'First rib mobility', ev: 'green', pos: ['supino'], link: '' },
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
          { id: 'ho-001', name: 'Neer test and modification', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=hm_WrN1DQFA' },
          { id: 'ho-002', name: 'Hawkins-Kennedy test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=UFCiQq9mDpQ' },
          { id: 'ho-029', name: 'Coracoid impingement sign', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-030', name: 'Supine impingement test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-031', name: 'Yocum test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-032', name: 'Zaslav test (IRRST)', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-005', name: 'Painful arc (60–120°)', ev: 'green', pos: ['pie'], link: '' },
          { id: 'ho-004', name: 'Full Can test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Manguito rotador',
        tests: [
          { id: 'ho-003', name: 'Empty Can test (Jobe)', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=iT2Cj0fCH4w' },
          { id: 'ho-033', name: 'Champagne toast position', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-034', name: 'Rent test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-006', name: 'External rotation lag sign (ERLS)', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-007', name: 'Lift-off test (Gerber\'s)', ev: 'green', pos: ['pie'], link: '' },
          { id: 'ho-035', name: 'Medial rotation lag or \'spring back\' test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-036', name: 'Infraspinatus test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-037', name: 'Lateral rotation lag sign', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-038', name: 'Hornblower\'s sign (Patte\'s test)', ev: 'green', pos: ['sentado'], link: '' },
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
          { id: 'ho-014', name: 'Active compression test of O\'Brien', ev: 'green', pos: ['pie'], link: 'https://www.youtube.com/watch?v=iF7RfPuZJsA' },
          { id: 'ho-017', name: 'Kim test I (Biceps load test II)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-040', name: 'Porcellini test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-041', name: 'Whipple test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-042', name: 'Crank test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-012', name: 'Speed\'s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=yvnnKVIJGNE' },
          { id: 'ho-013', name: 'Yergason\'s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=HxTmxJSZfLM' },
          { id: 'ho-016', name: 'Compression-rotation test', ev: 'yellow', link: '' },
          { id: 'ho-015', name: 'Anterior slide test', ev: 'yellow', link: '' },
          { id: 'ho-018', name: 'SLAP prehension test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Inestabilidad anterior',
        tests: [
          { id: 'ho-019', name: 'Anterior apprehension test', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=3tSfKBrZjlU' },
          { id: 'ho-020', name: 'Relocation test (Jobe)', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=3tSfKBrZjlU' },
          { id: 'ho-021', name: 'Anterior release (surprise) test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-023', name: 'Load and shift test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad posterior / multidireccional',
        tests: [
          { id: 'ho-043', name: 'Jerk (Jahnke) test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-024', name: 'Sulcus sign', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-022', name: 'Posterior apprehension or stress test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'AC joint',
        tests: [
          { id: 'ho-025', name: 'Horizontal adduction (cross-body adduction) test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=B1EB6p8aYcM' },
          { id: 'ho-027', name: 'Paxinos sign', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'ho-028', name: 'Glenohumeral internal rotation deficit (GIRD)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-026', name: 'Piano key sign (AC joint)', ev: 'yellow', link: '' },
          { id: 'ho-044', name: 'Acromioclavicular shear test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Neurológico',
        tests: [
          { id: 'ho-045', name: 'ULNT – Median nerve (ULNT I)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-046', name: 'ULNT – Median nerve (ULNT II)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-047', name: 'ULNT – Radial nerve (ULNT III)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ho-048', name: 'ULNT – Ulnar nerve (ULNT IV)', ev: 'green', pos: ['supino'], link: '' },
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
        name: 'Inestabilidad ligamentosa',
        tests: [
          { id: 'co-001', name: 'Capitellar shear test', ev: 'red', link: '' },
          { id: 'co-002', name: 'Chair push-up test', ev: 'yellow', link: '' },
          { id: 'co-003', name: 'Gravity-assisted varus stress test', ev: 'yellow', link: '' },
          { id: 'co-004', name: 'Lateral pivot shift test of the elbow', ev: 'green', pos: ['supino'], link: '' },
          { id: 'co-005', name: 'Ligamentous valgus instability test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'co-006', name: 'Ligamentous varus instability test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'co-007', name: 'Milking maneuver', ev: 'yellow', link: '' },
          { id: 'co-008', name: 'Moving valgus stress test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'co-009', name: 'Posterolateral rotary apprehension test', ev: 'red', link: '' },
          { id: 'co-010', name: 'Posterolateral rotary drawer test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'co-011', name: 'Prone push-up test', ev: 'yellow', link: '' },
          { id: 'co-012', name: 'Tabletop relocation test', ev: 'yellow', link: '' },
          { id: 'co-013', name: 'Trochlear shear test', ev: 'yellow', link: '' },
          { id: 'co-014', name: 'Valgus extension overload test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Lesión muscular (rotura de grado III)',
        tests: [
          { id: 'co-015', name: 'Biceps crease interval', ev: 'yellow', link: '' },
          { id: 'co-016', name: 'Biceps squeeze test', ev: 'yellow', link: '' },
          { id: 'co-017', name: 'Bicipital aponeurosis flex test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'co-018', name: 'Flexion initiation test', ev: 'yellow', link: '' },
          { id: 'co-019', name: 'Hook (distal biceps) test', ev: 'yellow', link: '' },
          { id: 'co-020', name: 'Popeye sign (distal biceps tendon)', ev: 'green', pos: ['pie'], link: '' },
          { id: 'co-021', name: 'Supination-pronation test', ev: 'yellow', link: '' },
          { id: 'co-022', name: 'TILT sign', ev: 'yellow', link: '' },
          { id: 'co-023', name: 'Triceps squeeze test', ev: 'green', link: '' },
        ]
      },
      {
        name: 'Epicondilitis (epicondilalgia)',
        tests: [
          { id: 'co-024', name: 'Cozen\'s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=_iGbnJrBBEE' },
          { id: 'co-025', name: 'Golfer\'s elbow test', ev: 'red', link: '' },
          { id: 'co-026', name: 'Kaplan\'s test', ev: 'yellow', link: '' },
          { id: 'co-027', name: 'Maudsley\'s (middle finger) test', ev: 'red', link: '' },
          { id: 'co-028', name: 'Mill\'s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=_iGbnJrBBEE' },
          { id: 'co-029', name: 'Polk\'s test', ev: 'red', link: '' },
          { id: 'co-030', name: 'Tennis elbow shear test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Plica',
        tests: [
          { id: 'co-031', name: 'Extension-supination plica test', ev: 'red', link: '' },
          { id: 'co-032', name: 'Flexion-pronation plica test', ev: 'red', link: '' },
          { id: 'co-033', name: 'Plica impingement test', ev: 'red', link: '' },
          { id: 'co-034', name: 'Radiohumeral joint plica compression test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Pinzamiento posterior',
        tests: [
          { id: 'co-035', name: 'Arm bar (posteromedial impingement) test', ev: 'yellow', link: '' },
          { id: 'co-036', name: 'Extension impingement test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Disfunción articular',
        tests: [
          { id: 'co-037', name: 'Active radiocapitellar compression test', ev: 'red', link: '' },
          { id: 'co-038', name: 'Radiohumeral joint distraction test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Fracturas',
        tests: [
          { id: 'co-039', name: 'East Riding Elbow Rule (ER2)', ev: 'yellow', link: '' },
          { id: 'co-040', name: 'Montreal children\'s elbow test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Disfunción neurológica',
        tests: [
          { id: 'co-041', name: 'Elbow pressure test', ev: 'red', link: '' },
          { id: 'co-042', name: 'Maudsley\'s (middle finger) test', ev: 'red', link: '' },
          { id: 'co-043', name: 'Pinch grip test (anterior interosseous branch of median nerve)', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'co-044', name: 'Rule-of-nine (RON) test', ev: 'yellow', link: '' },
          { id: 'co-045', name: 'Scratch collapse test for ulnar, median and/or radial nerve', ev: 'yellow', link: '' },
          { id: 'co-046', name: 'Test for pronator teres syndrome', ev: 'red', link: '' },
          { id: 'co-047', name: 'Tinel sign at elbow (ulnar nerve)', ev: 'yellow', link: '' },
          { id: 'co-048', name: 'Wadsworth elbow flexion test (ulnar nerve)', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'co-049', name: 'Wartenberg sign', ev: 'red', link: '' },
        ]
      },
    ]
  },
  {
    id: 'muneca',
    name: 'Muñeca / Mano',
    icon: '🟢',
    categories: [
      {
        name: 'Dolor de muñeca: pruebas generales',
        tests: [
          { id: 'mu-001', name: 'Carpal shake test', ev: 'red', link: '' },
          { id: 'mu-002', name: 'Sitting hands (press) test', ev: 'yellow', link: '' },
          { id: 'mu-003', name: 'Windmill test', ev: 'yellow', link: '' },
          { id: 'mu-004', name: 'Watson (scaphoid shift) test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=rIiS-XEFlLg' },
          { id: 'mu-005', name: 'Wrist hanging test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Hueso, ligamentos e inestabilidad articular',
        tests: [
          { id: 'mu-006', name: 'Anterior-posterior drawer test (Fisk\'s forward shift test—modified)', ev: 'red', link: '' },
          { id: 'mu-007', name: 'Axial load test', ev: 'red', link: '' },
          { id: 'mu-008', name: 'Catch-up clunk test', ev: 'red', link: '' },
          { id: 'mu-009', name: 'Derby relocation test', ev: 'yellow', link: '' },
          { id: 'mu-010', name: 'Distal radioulnar joint stability (ballottement) test', ev: 'yellow', link: '' },
          { id: 'mu-011', name: 'Dorsal capitate displacement apprehension test', ev: 'red', link: '' },
          { id: 'mu-012', name: 'Finger extension (shuck) test', ev: 'red', link: '' },
          { id: 'mu-013', name: 'Gripping rotary impaction test (GRIT)', ev: 'red', link: '' },
          { id: 'mu-014', name: 'Kleinman\'s shear test', ev: 'yellow', link: '' },
          { id: 'mu-015', name: 'Ligamentous instability test (fingers)', ev: 'yellow', link: '' },
          { id: 'mu-016', name: 'Linscheid squeeze test', ev: 'red', link: '' },
          { id: 'mu-017', name: 'Lunotriquetral ballottement (Reagan\'s) test', ev: 'yellow', link: '' },
          { id: 'mu-018', name: 'Lunotriquetral compression test', ev: 'yellow', link: '' },
          { id: 'mu-019', name: 'Murphy\'s sign', ev: 'yellow', link: '' },
          { id: 'mu-020', name: 'Piano keys (DRUJ) test', ev: 'red', link: '' },
          { id: 'mu-021', name: 'Pisiform boost test', ev: 'yellow', link: '' },
          { id: 'mu-022', name: 'Pisotriquetral grind test', ev: 'yellow', link: '' },
          { id: 'mu-023', name: 'Pivot shift test of midcarpal joint', ev: 'red', link: '' },
          { id: 'mu-024', name: 'Prosser\'s relocation test', ev: 'red', link: '' },
          { id: 'mu-025', name: 'Radioulnar shift test', ev: 'yellow', link: '' },
          { id: 'mu-026', name: 'Scaphoid compression test', ev: 'yellow', link: '' },
          { id: 'mu-027', name: 'Scapulolunate ligament test', ev: 'yellow', link: '' },
          { id: 'mu-028', name: 'Steinberg sign', ev: 'yellow', link: '' },
          { id: 'mu-029', name: 'Supination lift test', ev: 'red', link: '' },
          { id: 'mu-030', name: 'Test for tight retinacular ligament', ev: 'red', link: '' },
          { id: 'mu-031', name: 'Testing ligaments of the TFCC', ev: 'red', link: '' },
          { id: 'mu-032', name: 'Thumb grind test', ev: 'red', link: '' },
          { id: 'mu-033', name: 'Thumb ulnar collateral ligament laxity or instability test', ev: 'yellow', link: '' },
          { id: 'mu-034', name: 'Traction-shift (grind) test of thumb', ev: 'red', link: '' },
          { id: 'mu-035', name: 'Triangular fibrocartilage complex load test (Sharpey\'s test)', ev: 'red', link: '' },
          { id: 'mu-036', name: 'Triquetral lift maneuver', ev: 'red', link: '' },
          { id: 'mu-037', name: 'Ulnar fovea sign (ulnar snuff box) test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-038', name: 'Ulnar impaction (grind) test', ev: 'red', link: '' },
          { id: 'mu-039', name: 'Ulnar styloid triquetral impaction (USTI) provocation test', ev: 'yellow', link: '' },
          { id: 'mu-040', name: 'Ulnocarpal stress test', ev: 'yellow', link: '' },
          { id: 'mu-041', name: 'Ulnomeniscotriquetral dorsal glide test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-042', name: 'Walker-Murdoch sign', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Tendones y músculos',
        tests: [
          { id: 'mu-043', name: 'Boyes test', ev: 'red', link: '' },
          { id: 'mu-044', name: 'Bunnel-Littler test', ev: 'red', link: '' },
          { id: 'mu-045', name: 'Extensor carpi ulnaris synergy test', ev: 'yellow', link: '' },
          { id: 'mu-046', name: 'Finkelstein (Eichhoff) test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=oTzKRhHFY9Q' },
          { id: 'mu-047', name: 'Lindburg\'s sign', ev: 'red', link: '' },
          { id: 'mu-048', name: 'Sweater finger sign', ev: 'yellow', link: '' },
          { id: 'mu-049', name: 'Test for extensor hood rupture', ev: 'red', link: '' },
          { id: 'mu-050', name: 'Wrist hyperflexion and abduction of thumb (WHAT) test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Disfunción neurológica',
        tests: [
          { id: 'mu-051', name: 'Abductor pollicis brevis weakness', ev: 'yellow', link: '' },
          { id: 'mu-052', name: 'André-Thomas sign', ev: 'red', link: '' },
          { id: 'mu-053', name: 'Carpal compression test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-054', name: 'Closed fist sign', ev: 'red', link: '' },
          { id: 'mu-055', name: 'Crossed finger test', ev: 'yellow', link: '' },
          { id: 'mu-056', name: 'Dellon\'s moving two-point discrimination test', ev: 'red', link: '' },
          { id: 'mu-057', name: 'Egawa\'s sign', ev: 'red', link: '' },
          { id: 'mu-058', name: 'Finger flexion sign', ev: 'yellow', link: '' },
          { id: 'mu-059', name: 'First dorsal interossei screening test', ev: 'yellow', link: '' },
          { id: 'mu-060', name: 'Flick maneuver', ev: 'yellow', link: '' },
          { id: 'mu-061', name: 'Froment\'s "paper" sign', ev: 'yellow', link: '' },
          { id: 'mu-062', name: 'Hand elevation test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-063', name: 'Nail file sign', ev: 'red', link: '' },
          { id: 'mu-064', name: 'Ninhydrin sweat test', ev: 'red', link: '' },
          { id: 'mu-065', name: 'Okutsu test', ev: 'yellow', link: '' },
          { id: 'mu-066', name: 'Phalen\'s (wrist flexion) test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=F1sJpE4h7Lc' },
          { id: 'mu-067', name: 'Pollock sign', ev: 'yellow', link: '' },
          { id: 'mu-068', name: 'Reverse Phalen\'s (prayer) test', ev: 'yellow', link: '' },
          { id: 'mu-069', name: 'Scratch collapse test', ev: 'yellow', link: '' },
          { id: 'mu-070', name: 'Square wrist sign', ev: 'yellow', link: '' },
          { id: 'mu-071', name: 'Tethered median nerve stress test', ev: 'yellow', link: '' },
          { id: 'mu-072', name: 'Tinel sign at wrist', ev: 'yellow', link: 'https://www.youtube.com/watch?v=F1sJpE4h7Lc' },
          { id: 'mu-073', name: 'Tourniquet test', ev: 'red', link: '' },
          { id: 'mu-074', name: 'Weber\'s (Moberg\'s) two-point discrimination test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-075', name: 'Wrinkle (shrivel) test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Circulación y edema',
        tests: [
          { id: 'mu-076', name: 'Allen test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-077', name: 'Digital blood flow', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-078', name: 'Figure-of-eight measurement for swelling', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'mu-079', name: 'Hand volume test', ev: 'green', pos: ['sentado'], link: '' },
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
        name: 'Patología de cadera',
        tests: [
          { id: 'ca-001', name: 'Abduction, extension, and lateral rotation test', ev: 'yellow', link: '' },
          { id: 'ca-002', name: 'Anterior apprehension test', ev: 'yellow', link: '' },
          { id: 'ca-003', name: 'Drehmann sign', ev: 'yellow', link: '' },
          { id: 'ca-004', name: 'Flexion-addution test', ev: 'yellow', link: '' },
          { id: 'ca-005', name: 'Hip scour test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ca-006', name: 'Internal rotation overpressure test', ev: 'yellow', link: '' },
          { id: 'ca-007', name: 'Lateral FABER test', ev: 'yellow', link: '' },
          { id: 'ca-008', name: 'Ligamentum teres test', ev: 'yellow', link: '' },
          { id: 'ca-009', name: 'Log roll test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ca-010', name: 'McCarthy hip extension sign', ev: 'yellow', link: '' },
          { id: 'ca-011', name: 'Patrick\'s test', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=dAr5LzLRFiE' },
          { id: 'ca-012', name: 'Posterior apprehension test', ev: 'yellow', link: '' },
          { id: 'ca-013', name: 'Prone external rotation test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Pinzamiento (FAI)',
        tests: [
          { id: 'ca-014', name: 'Anteroposterior impingement test', ev: 'yellow', link: '' },
          { id: 'ca-015', name: '\'Gear stick\' sign', ev: 'yellow', link: '' },
          { id: 'ca-016', name: 'Impingement provocation test', ev: 'yellow', link: '' },
          { id: 'ca-017', name: 'Ischiofemoral impingement test', ev: 'yellow', link: '' },
          { id: 'ca-018', name: 'Lateral FADDIR test', ev: 'yellow', link: '' },
          { id: 'ca-019', name: 'Lateral rim impingement test', ev: 'yellow', link: '' },
          { id: 'ca-020', name: 'Posteroinferior impingement test', ev: 'yellow', link: '' },
          { id: 'ca-021', name: 'Squat test', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Lesión del labrum',
        tests: [
          { id: 'ca-022', name: 'Anterior labral tear test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ca-023', name: 'External rotation test', ev: 'yellow', link: '' },
          { id: 'ca-024', name: 'Flexion-internal rotation test', ev: 'yellow', link: '' },
          { id: 'ca-025', name: 'Posterior labral tear test', ev: 'yellow', link: '' },
          { id: 'ca-026', name: 'THIRD test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Fractura de estrés del cuello femoral',
        tests: [
          { id: 'ca-027', name: 'Heel-strike test', ev: 'yellow', link: '' },
          { id: 'ca-028', name: 'Patellar-pubic percussion sign', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Patología pediátrica de cadera',
        tests: [
          { id: 'ca-029', name: 'Abduction test', ev: 'yellow', link: '' },
          { id: 'ca-030', name: 'Barlow\'s test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ca-031', name: 'Galleazzi sign', ev: 'yellow', link: '' },
          { id: 'ca-032', name: 'Ortolani\'s sign', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ca-033', name: 'Telescoping sign', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Tensión y patología muscular',
        tests: [
          { id: 'ca-034', name: 'Abduction contracture test', ev: 'yellow', link: '' },
          { id: 'ca-035', name: 'Active piriformis stretch test', ev: 'yellow', link: '' },
          { id: 'ca-036', name: 'Adduction contracture test', ev: 'yellow', link: '' },
          { id: 'ca-037', name: 'Adductor squeeze (fist) test', ev: 'yellow', link: '' },
          { id: 'ca-038', name: 'Beatty\'s test', ev: 'yellow', link: '' },
          { id: 'ca-039', name: 'Bent-knee stretch test for proximal hamstrings', ev: 'yellow', link: '' },
          { id: 'ca-040', name: 'Eccentric hip flexion', ev: 'red', link: '' },
          { id: 'ca-041', name: 'Ely\'s test', ev: 'yellow', link: '' },
          { id: 'ca-042', name: 'External de-rotation test', ev: 'yellow', link: '' },
          { id: 'ca-043', name: 'Freiberg\'s maneuver', ev: 'yellow', link: '' },
          { id: 'ca-044', name: 'Hamstring syndrome test', ev: 'yellow', link: '' },
          { id: 'ca-045', name: 'Heel contralateral knee maneuver', ev: 'yellow', link: '' },
          { id: 'ca-046', name: 'Hip lag sign', ev: 'green', pos: ['lateral'], link: '' },
          { id: 'ca-047', name: 'Hip rotator tightness', ev: 'yellow', link: '' },
          { id: 'ca-048', name: 'Long stride heel-strike test', ev: 'yellow', link: '' },
          { id: 'ca-049', name: '90-90 straight leg raising test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ca-050', name: 'Noble compression test', ev: 'yellow', link: '' },
          { id: 'ca-051', name: 'Ober\'s test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=sMJvbT4Kmh0' },
          { id: 'ca-052', name: 'Pace\'s maneuver', ev: 'yellow', link: '' },
          { id: 'ca-053', name: 'Puranen-Orava test', ev: 'yellow', link: '' },
          { id: 'ca-054', name: 'Rectus femoris contracture test', ev: 'yellow', link: '' },
          { id: 'ca-055', name: 'Seated piriformis stretch test', ev: 'yellow', link: '' },
          { id: 'ca-056', name: 'Thomas test', ev: 'yellow', link: 'https://www.youtube.com/watch?v=JFTLXDfGsxM' },
          { id: 'ca-057', name: 'Trendelenburg sign', ev: 'green', pos: ['pie'], link: 'https://www.youtube.com/watch?v=MCOQ41ohNpg' },
        ]
      },
      {
        name: 'Otras pruebas',
        tests: [
          { id: 'ca-058', name: 'Femoral nerve tension (prone knee bending) test', ev: 'yellow', link: '' },
          { id: 'ca-059', name: 'Timed "up and go" test', ev: 'yellow', link: '' },
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
        name: 'Meniscos',
        tests: [
          { id: 'ro-009', name: 'McMurray test', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=sNH7Og8VUeQ' },
          { id: 'ro-010', name: 'Apley\'s test', ev: 'green', pos: ['prono'], link: '' },
          { id: 'ro-014', name: '"Bounce home" test', ev: 'yellow', link: '' },
          { id: 'ro-013', name: 'Childress\' sign (squat and duck walk test)', ev: 'yellow', link: '' },
          { id: 'ro-024', name: 'Dynamic knee test', ev: 'yellow', link: '' },
          { id: 'ro-025', name: 'Ege\'s test', ev: 'yellow', link: '' },
          { id: 'ro-027', name: 'O\'Donohue\'s test', ev: 'yellow', link: '' },
          { id: 'ro-011', name: 'Thessaly test', ev: 'yellow', link: '' },
          { id: 'ro-026', name: 'Figure-of-four meniscal stress maneuver', ev: 'red', link: '' },
        ]
      },
      {
        name: 'Plica sinovial',
        tests: [
          { id: 'ro-028', name: 'Hughston\'s plica test', ev: 'yellow', link: '' },
          { id: 'ro-029', name: 'Mediopatellar plica test', ev: 'yellow', link: '' },
          { id: 'ro-030', name: 'Patellar bowstring test', ev: 'yellow', link: '' },
          { id: 'ro-031', name: 'Plica "stutter" test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Derrame articular',
        tests: [
          { id: 'ro-032', name: 'Brush, stroke or bulge test (minimal swelling)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ro-035', name: 'Patellar tap test (moderate swelling)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ro-033', name: 'Fluctuation test (moderate swelling)', ev: 'yellow', link: '' },
          { id: 'ro-034', name: 'Indentation test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Síndrome femoropatelar',
        tests: [
          { id: 'ro-015', name: 'Clarke\'s sign', ev: 'yellow', link: '' },
          { id: 'ro-036', name: 'Eccentric step (lateral step down) test', ev: 'yellow', link: '' },
          { id: 'ro-037', name: 'McConnell test', ev: 'yellow', link: '' },
          { id: 'ro-038', name: 'Motion palpation test', ev: 'yellow', link: '' },
          { id: 'ro-039', name: 'Step up test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Cuádriceps',
        tests: [
          { id: 'ro-040', name: 'Q-angle', ev: 'yellow', link: '' },
          { id: 'ro-041', name: 'Tubercle sulcus test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Coactivación cuádriceps / isquios',
        tests: [
          { id: 'ro-042', name: 'Single-limb dead-lift', ev: 'yellow', link: '' },
          { id: 'ro-043', name: 'Lateral hop', ev: 'yellow', link: '' },
          { id: 'ro-044', name: 'Transverse hop', ev: 'yellow', link: '' },
          { id: 'ro-045', name: 'Lateral band walks', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad patelar',
        tests: [
          { id: 'ro-018', name: 'Fairbank\'s apprehension test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'ro-046', name: 'Moving patellar apprehension test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Banda iliotibial',
        tests: [
          { id: 'ro-047', name: 'Noble compression test', ev: 'yellow', link: '' },
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
        name: 'Posición del astrágalo',
        tests: [
          { id: 'to-001', name: 'Navicular drop test', ev: 'red', link: '' },
          { id: 'to-002', name: 'Talar neutral position (non-weight-bearing) (supine and prone)', ev: 'yellow', link: '' },
          { id: 'to-003', name: 'Talar neutral position (weight-bearing)', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Alineación',
        tests: [
          { id: 'to-004', name: 'Forefoot-heel alignment', ev: 'yellow', link: '' },
          { id: 'to-005', name: 'Leg-heel alignment', ev: 'yellow', link: '' },
          { id: 'to-006', name: 'Tibial torsion (prone)', ev: 'yellow', link: '' },
          { id: 'to-007', name: 'Tibial torsion (sitting)', ev: 'yellow', link: '' },
          { id: 'to-008', name: 'Tibial torsion (supine)', ev: 'yellow', link: '' },
          { id: 'to-009', name: '"Too many toes" sign', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad ligamentosa',
        tests: [
          { id: 'to-010', name: 'Anterior drawer test (supine and prone)', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=4C4eqJjQFbc' },
          { id: 'to-011', name: 'Talar tilt', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Inestabilidad articular (sindesmosis)',
        tests: [
          { id: 'to-012', name: 'Cotton test', ev: 'yellow', link: '' },
          { id: 'to-013', name: 'External rotation stress test', ev: 'green', pos: ['sentado'], link: '' },
          { id: 'to-014', name: 'Fibular translation test', ev: 'yellow', link: '' },
          { id: 'to-015', name: 'Medial subtalar glide test', ev: 'green', pos: ['supino'], link: '' },
        ]
      },
      {
        name: 'Síndrome de estrés tibial medial',
        tests: [
          { id: 'to-016', name: 'Shin oedema test (SOT)', ev: 'yellow', link: '' },
          { id: 'to-017', name: 'Shin palpation test (SPT)', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Rotura de grado III',
        tests: [
          { id: 'to-018', name: 'Matles (knee flexion) test', ev: 'yellow', link: '' },
          { id: 'to-019', name: "Thompson's (Simmonds') test", ev: 'yellow', link: 'https://www.youtube.com/watch?v=DqQ_OJJRdoM' },
        ]
      },
      {
        name: 'Edema',
        tests: [
          { id: 'to-020', name: 'Figure-eight measurement', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Otras pruebas',
        tests: [
          { id: 'to-021', name: 'Dorsiflexion-eversion test for tarsal tunnel syndrome', ev: 'yellow', link: '' },
          { id: 'to-022', name: 'Functional hallux limitus test', ev: 'yellow', link: '' },
          { id: 'to-023', name: 'Leg length discrepancy/functional leg length', ev: 'yellow', link: '' },
          { id: 'to-024', name: 'Morton\'s (squeeze) test', ev: 'yellow', link: '' },
          { id: 'to-025', name: 'Synovial impingement test', ev: 'yellow', link: '' },
          { id: 'to-026', name: 'Tests for peroneal tendon dislocation', ev: 'yellow', link: '' },
          { id: 'to-027', name: 'Tinel\'s sign (3 positions)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'to-028', name: 'Triple compression test', ev: 'yellow', link: '' },
          { id: 'to-029', name: 'Windlass test (great toe extension)', ev: 'yellow', link: '' },
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
          { id: 'lu-001', name: 'Straight leg raise (SLR)', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=RFJe0qeknQs' },
          { id: 'lu-003', name: 'Slump test', ev: 'green', pos: ['sentado'], link: 'https://www.youtube.com/watch?v=9A5YRzz6Jlk' },
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
          { id: 'lu-016', name: 'Passive lumbar extension test', ev: 'green', pos: ['prono'], link: '' },
          { id: 'lu-017', name: 'Prone instability test', ev: 'green', pos: ['prono'], link: '' },
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
          { id: 'lu-030', name: '90–90 straight leg raise test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-031', name: 'Ober test', ev: 'yellow', link: '' },
          { id: 'lu-032', name: 'Rectus femoris test', ev: 'yellow', link: '' },
          { id: 'lu-033', name: 'Thomas test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'Lumbar — Función muscular',
        tests: [
          { id: 'lu-034', name: 'Prone bridge test', ev: 'green', pos: ['prono'], link: '' },
          { id: 'lu-014', name: 'Waddell\'s signs (5 tests)', ev: 'green', link: '' },
          { id: 'lu-035', name: 'Supine bridge test', ev: 'yellow', link: '' },
          { id: 'lu-036', name: 'Gower\'s sign', ev: 'yellow', link: '' },
          { id: 'lu-037', name: 'Heel-tap test', ev: 'red', link: '' },
          { id: 'lu-038', name: 'Sign of the buttock', ev: 'red', link: '' },
        ]
      },
      {
        name: 'SIJ — Afectación neurológica',
        tests: [
          { id: 'lu-013', name: 'Supine active straight leg raise (ASLR)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-039', name: 'Prone active straight leg raise test', ev: 'green', pos: ['prono'], link: '' },
        ]
      },
      {
        name: 'SIJ — Afectación articular',
        tests: [
          { id: 'lu-009', name: 'Gaenslen\'s test', ev: 'green', pos: ['supino'], link: 'https://www.youtube.com/watch?v=vkW2BdGX6bY' },
          { id: 'lu-012', name: 'Patrick test (FABER)', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-040', name: 'Yeoman\'s test', ev: 'green', pos: ['prono'], link: '' },
          { id: 'lu-041', name: 'Flamingo test', ev: 'green', pos: ['pie'], link: '' },
          { id: 'lu-006', name: 'Distraction test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-007', name: 'Compression test', ev: 'green', pos: ['lateral'], link: '' },
          { id: 'lu-010', name: 'Sacral thrust', ev: 'green', pos: ['prono'], link: '' },
          { id: 'lu-011', name: 'Thigh thrust test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-008', name: 'Posterior shear (POSH) test', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-042', name: 'Drop test', ev: 'yellow', link: '' },
          { id: 'lu-043', name: 'Gillet test', ev: 'yellow', link: '' },
          { id: 'lu-044', name: 'Piedallu\'s sign', ev: 'yellow', link: '' },
          { id: 'lu-045', name: 'PSIS distraction test', ev: 'yellow', link: '' },
          { id: 'lu-046', name: 'Supine-to-sit test', ev: 'yellow', link: '' },
        ]
      },
      {
        name: 'SIJ — Longitud y función muscular',
        tests: [
          { id: 'lu-047', name: 'Leg length measurement', ev: 'green', pos: ['supino'], link: '' },
          { id: 'lu-048', name: 'Trendelenburg test', ev: 'green', pos: ['pie'], link: '' },
        ]
      },
    ]
  },
];

// ─── ENLACES DE TÉCNICA ────────────────────────────────────────────────────────────────────────
// Los tests con `link` propio abren ese vídeo. El resto, si su evidencia está en
// SEARCH_LINK_EV, abre una BÚSQUEDA en YouTube derivada del nombre del test.
// No son vídeos verificados: la interfaz los marca con un icono distinto.

// Niveles de evidencia que reciben enlace de búsqueda.
// Ampliar a ['green', 'yellow'] abre los enlaces a evidencia moderada.
const SEARCH_LINK_EV = ['green'];

// Sufijo en inglés que acota la búsqueda, por región.
const SEARCH_REGION_TERM = {
  cervical: 'neck',
  hombro:   'shoulder',
  codo:     'elbow',
  muneca:   'wrist',
  cadera:   'hip',
  rodilla:  'knee',
  tobillo:  'ankle',
  lumbar:   'lumbar spine',
};

// El sufijo de región no siempre basta. En Lumbar / SIJ conviven pruebas lumbares y
// sacroilíacas, y "compression test lumbar spine" no devuelve la maniobra correcta.
// Clave: `<id de región>|<nombre de categoría>`. Tiene prioridad sobre la región.
const SEARCH_CATEGORY_TERM = {
  'lumbar|SIJ — Afectación articular':        'sacroiliac joint',
  'lumbar|SIJ — Afectación neurológica':      'sacroiliac joint',
  'lumbar|SIJ — Longitud y función muscular': 'pelvis',
  'muneca|Circulación y edema':               'hand',
};

// Excepciones: tests cuyo nombre no funciona como búsqueda. Sustituyen a la consulta
// derivada por completo (el sufijo de región/categoría NO se añade a estas).
const SEARCH_QUERY_OVERRIDES = {
  'cx-009': 'romberg test neurological examination',       // no es una prueba cervical
  'ho-031': 'yocum test shoulder impingement',             // acota: "yocum test" solo devuelve poco
  'ho-032': 'internal rotation resistance strength test shoulder',
  'ho-035': 'internal rotation lag sign spring back subscapularis',
  'ho-038': 'hornblower sign patte test shoulder',
  'ho-017': 'biceps load test II shoulder',                // "kim test i" no discrimina
  'ho-045': 'upper limb neurodynamic test 1 median nerve',
  'ho-046': 'upper limb neurodynamic test 2 median nerve',
  'ho-047': 'upper limb neurodynamic test 3 radial nerve',
  'ho-048': 'upper limb neurodynamic test 4 ulnar nerve',
  'co-020': 'popeye sign distal biceps rupture',
  'co-043': 'pinch grip test anterior interosseous nerve',
  'mu-062': 'hand elevation test carpal tunnel',
  'mu-074': 'two point discrimination test hand sensation',
  'mu-077': 'capillary refill digital blood flow hand',
  'mu-079': 'hand volumeter test edema measurement',
  'ro-032': 'brush stroke bulge test knee effusion',
  'to-027': 'tinel sign tarsal tunnel ankle',
  'lu-018': 'centralization peripheralization mckenzie lumbar',
  'lu-014': 'waddell signs nonorganic low back pain',
  'lu-047': 'leg length discrepancy measurement supine',
  'lu-048': 'trendelenburg test hip abductor weakness',
};

// ─── TIEMPOS DE TEJIDO ────────────────────────────────────────────────────────────────────────
// Copia de physiq-assessment/data/tejidos.js (panel ⏱ «Tiempos de recuperación»): si cambias una
// fila aquí, cámbiala también allí (y al revés). `desde`/`hasta` son índices de columna
// (inclusive) de `cols`; `g` = gravedad (color, .tg-<g>); `corto` = nombre dentro de la barra en
// móvil; `pendiente` = el rango no sale de ninguna fuente leída; `subtipos` = filas
// hijas (misma forma, sin `g`: la de la fila madre), pintadas debajo con sangría.
const TISSUE_TIMES = {
  cols: ['1–3<br>días', '4–14<br>días', '3–4<br>sem.', '5–8<br>sem.', '2–3<br>meses', '3–6<br>meses', '6m–<br>1 año', '2<br>años'],
  gravedades: { minima: 'Mínima', leve: 'Leve', moderada: 'Moderada', grave: 'Grave / reconstrucción' },
  grupos: [
    { tejido: 'Tendón', filas: [
      { nombre: 'Tendinopatía', corto: 'Tendinopatía', desde: 2, hasta: 5, g: 'moderada',
        nota: 'No es un plazo de cicatrización: orienta el tiempo de adaptación a la carga.' },
      { nombre: 'Rotura / reparación de tendón', corto: 'Rotura tendón', desde: 3, hasta: 7, g: 'grave',
        nota: 'Biología de la curación: la remodelación empieza a las 6–8 semanas y dura 1–2 años; el tendón no suele recuperar del todo su resistencia. La vuelta a la actividad la marca el protocolo.' },
    ] },
    { tejido: 'Músculo', filas: [
      { nombre: 'Dolor muscular tardío (DOMS)', corto: 'DOMS', desde: 0, hasta: 0, g: 'minima' },
      { nombre: 'Rotura G. I', corto: 'Rotura G. I', desde: 1, hasta: 2, g: 'leve' },
      { nombre: 'Rotura G. II', corto: 'Rotura G. II', desde: 2, hasta: 3, g: 'moderada' },
      { nombre: 'Rotura G. III', corto: 'Rotura G. III', desde: 2, hasta: 4, g: 'grave' },
    ] },
    { tejido: 'Ligamento', filas: [
      { nombre: 'Esguince G. I', corto: 'Esguince G. I', desde: 1, hasta: 2, g: 'leve',
        subtipos: [
          { nombre: 'Tobillo, ligamento lateral', corto: 'Tobillo', desde: 1, hasta: 1,
            nota: '1–2 semanas con movilización precoz y rehabilitación funcional (Bergman 2025).' },
          { nombre: 'Rodilla, ligamento colateral medial', corto: 'Rodilla LCM', desde: 1, hasta: 1,
            nota: 'Vuelta al deporte en 10–14 días con tratamiento conservador (Naqvi y Sherman 2023). Los grados II y III no tienen plazo en la fuente: se decide por criterios.' },
        ] },
      { nombre: 'Esguince G. II', corto: 'Esguince G. II', desde: 2, hasta: 4, g: 'moderada',
        subtipos: [
          { nombre: 'Tobillo, ligamento lateral', corto: 'Tobillo', desde: 2, hasta: 3,
            nota: '3–6 semanas (Bergman 2025). Vuurberg 2018 junta la rotura parcial y la total: vuelta completa al trabajo y al deporte a las 6–8 semanas, según la tarea.' },
        ] },
      { nombre: 'Esguince G. III', corto: 'Esguince G. III', desde: 3, hasta: 5, g: 'grave',
        subtipos: [
          { nombre: 'Tobillo, ligamento lateral', corto: 'Tobillo', desde: 3, hasta: 4,
            nota: '6–12 semanas o más; a veces cirugía por inestabilidad persistente (Bergman 2025). Un 5–33 % sigue con dolor al año (Martin 2021).' },
          { nombre: 'Tobillo, reparación quirúrgica', corto: 'Tobillo, cirugía', desde: 4, hasta: 5,
            nota: 'Vuelta al trabajo físico y al deporte a las 12–16 semanas (Vuurberg 2018); unos 3–4 meses según Bergman 2025. Manda el protocolo del cirujano.' },
          { nombre: 'Rodilla, LCA sin cirugía', corto: 'LCA sin cirugía', desde: 2, hasta: 4,
            nota: 'No es un plazo de cicatrización: tras la fase aguda, 12 semanas de fisioterapia supervisada (Evans 2023). Baja demanda, sin giros ni saltos, roturas parciales.' },
        ] },
      { nombre: 'Injerto (reconstrucción)', corto: 'Injerto', desde: 4, hasta: 6, g: 'grave',
        subtipos: [
          { nombre: 'Rodilla, LCA reconstruido', corto: 'LCA reconstruido', desde: 6, hasta: 7,
            nota: 'Vuelta a la actividad o al deporte a los 6–12 meses de media; el injerto puede tardar 18 meses o más en incorporarse (Evans 2023). La guía JOSPT no fija plazos: decide por criterios (Logerstedt 2017).' },
        ] },
    ] },
    { tejido: 'Menisco', filas: [
      { nombre: 'Rotura traumática, sin cirugía', corto: 'Traumática', desde: 4, hasta: 4, g: 'moderada',
        nota: 'No es un plazo de cicatrización: 12 semanas de ejercicio neuromuscular supervisado, con resultados parecidos a la cirugía en rodilla estable (Prill 2025, grado B). Las roturas de la raíz o radiales agudas pueden beneficiarse de cirugía precoz.' },
      { nombre: 'Lesión degenerativa, sin cirugía', corto: 'Degenerativa', desde: 5, hasta: 5, g: 'moderada',
        nota: 'La fisioterapia es el primer tratamiento (Prill 2025, grado A): 3–6 meses antes de plantear la cirugía si persisten los síntomas.' },
      { nombre: 'Meniscectomía parcial', corto: 'Meniscectomía', desde: 2, hasta: 4, g: 'moderada',
        nota: 'Vuelta al deporte a las 4–12 semanas (Prill 2025, grado C): antes de 2 meses en menores de 30 años o deportistas de élite, hacia los 3 meses en mayores de 30 (Logerstedt 2018). Los déficits de fuerza y función pueden tardar hasta 2 años en resolverse.' },
      { nombre: 'Sutura (reparación)', corto: 'Sutura', desde: 6, hasta: 6, g: 'grave',
        nota: 'Vuelta al deporte a los 6–9 meses (Prill 2025, grado C; en los estudios, de 3,3 a 10 meses). Carga y vuelta a la actividad progresivas y precoces (Logerstedt 2018, grado C). Manda el protocolo del cirujano.' },
    ] },
    { tejido: 'Hueso', filas: [
      { nombre: 'Fractura', corto: 'Fractura', desde: 2, hasta: 5, g: 'moderada',
        subtipos: [
          { nombre: 'Tobillo, estable sin cirugía', corto: 'Tobillo', desde: 3, hasta: 3,
            nota: 'Vuelta a la función previa hacia las 6–8 semanas, con carga progresiva según tolerancia. (Hermena y Slane 2025)' },
          { nombre: 'Tobillo, operada (osteosíntesis)', corto: 'Tobillo, cirugía', desde: 3, hasta: 3,
            nota: 'Carga completa hacia las 6–8 semanas de la cirugía; la recuperación completa tarda más (sin plazo en la fuente). Manda el protocolo del cirujano. (Hermena y Slane 2025)' },
          { nombre: '5.º metatarsiano, avulsión de la base (zona 1)', corto: '5.º MT zona 1', desde: 2, hasta: 3,
            nota: 'Carga protegida (zapato rígido, bota o yeso de marcha), y carga según tolerancia a medida que cede el dolor, en 3–6 semanas. (Smidt y Massey 2023)' },
          { nombre: '5.º metatarsiano, Jones (zona 2) sin cirugía', corto: 'Jones', desde: 3, hasta: 3,
            nota: '6–8 semanas sin carga con yeso corto; la carga avanza según la consolidación en la radiografía. Mala vascularización: riesgo de retraso de consolidación. (Smidt y Massey 2023)' },
          { nombre: '5.º metatarsiano, diáfisis por estrés (zona 3)', corto: '5.º MT estrés', desde: 4, hasta: 5,
            nota: 'Consolidación lenta: hasta 20 semanas de inmovilización antes de verla en la radiografía, y aun así la seudoartrosis no es rara. (Smidt y Massey 2023)' },
          { nombre: 'Otros metatarsianos, no desplazadas', corto: 'Metatarsianos', desde: 2, hasta: 3,
            nota: '4–6 semanas de bota o yeso de marcha (o 3 sin carga y 3 con yeso de marcha). Las de base y las centrales consolidan bien. (Agrawal y Tiwari 2023)' },
          { nombre: 'Calcáneo, extraarticular', corto: 'Calcáneo extra', desde: 4, hasta: 4,
            nota: '10–12 semanas de inmovilización con yeso o férula; buen pronóstico. (Seaman y Bergman 2026)' },
          { nombre: 'Calcáneo, intraarticular desplazada', corto: 'Calcáneo intra', desde: 7, hasta: 7, g: 'grave',
            nota: 'Recuperación de 12–18 meses, con o sin cirugía; la mejoría se estanca hacia los 18 meses y a los 2 años la mayoría tiene secuelas. Descarga de 8–12 semanas tras la cirugía. (Seaman y Bergman 2026)' },
          { nombre: 'Navicular, por estrés', corto: 'Navicular estrés', desde: 3, hasta: 3,
            nota: '6–8 semanas de inmovilización y carga protegida. Riesgo de seudoartrosis y necrosis por su vascularización. La fractura traumática no tiene plazo en la fuente. (Gheewala 2023)' },
          { nombre: 'Rótula, sin cirugía', corto: 'Rótula', desde: 3, hasta: 3,
            nota: '6–8 semanas inmovilizada en extensión, con carga según tolerancia; movilidad activa desde la 1.ª–2.ª semana y fuerza contra resistencia hacia la 6.ª, cuando se espera la consolidación inicial. Tras la cirugía, sin plazo en la fuente. (Mabrouk y Pilson 2026)' },
          { nombre: 'Meseta tibial, sin cirugía', corto: 'Meseta tibial', desde: 4, hasta: 5,
            nota: '6–8 semanas sin carga y 6 más de carga parcial; consolidación radiográfica hasta las 12 semanas y función completa a las 16–20 semanas o más. (Malik y Herron 2023)' },
          { nombre: 'Meseta tibial, operada', corto: 'Meseta, cirugía', desde: 4, hasta: 4, g: 'grave',
            nota: '6 semanas sin carga y 6 de carga parcial; después, carga según tolerancia. La vuelta al deporte puede tardar meses. Manda el protocolo del cirujano. (Malik y Herron 2023)' },
        ] },
      { nombre: 'Fractura de estrés', corto: 'F. de estrés', desde: 3, hasta: 6, g: 'moderada',
        nota: 'Vuelta al deporte de media: de 6 semanas a 4 meses según la localización, y unos 7 meses en la tibia anterior. En las de bajo riesgo, 2–6 semanas de reposo relativo o descarga y vuelta gradual; las de alto riesgo, a traumatología.',
        subtipos: [
          { nombre: 'Tibia posteromedial (bajo riesgo)', corto: 'Tibia post.', desde: 3, hasta: 3,
            nota: 'Vuelta al deporte a los 44 días de media; la más rápida y con menos complicaciones (2 %). (Hoenig 2023)' },
          { nombre: 'Peroné (bajo riesgo)', corto: 'Peroné', desde: 3, hasta: 3,
            nota: 'Vuelta al deporte a los 56 días de media (con mucha variación entre estudios). (Hoenig 2023)' },
          { nombre: 'Pubis (bajo riesgo)', corto: 'Pubis', desde: 4, hasta: 4,
            nota: 'Vuelta al deporte a los 77 días de media. (Hoenig 2023)' },
          { nombre: 'Metatarsianos 1.º–4.º (bajo riesgo)', corto: 'MT 1.º–4.º', desde: 4, hasta: 4,
            nota: 'Vuelta al deporte a los 78 días de media; el 96 % vuelve. (Hoenig 2023)' },
          { nombre: 'Diáfisis femoral (bajo riesgo)', corto: 'Fémur diáf.', desde: 4, hasta: 4,
            nota: 'Vuelta al deporte a los 86 días de media. (Hoenig 2023)' },
          { nombre: '5.º metatarsiano (alto riesgo)', corto: '5.º MT', desde: 4, hasta: 4, g: 'grave',
            nota: 'Vuelta al deporte a los 82 días de media; complicaciones en el 16,5 %. Alto riesgo por retraso de consolidación y seudoartrosis. (Hoenig 2023 · Robertson y Wood 2017)' },
          { nombre: 'Maléolo medial (alto riesgo)', corto: 'Maléolo med.', desde: 5, hasta: 5, g: 'grave',
            nota: 'Vuelta al deporte a los 106 días de media. (Hoenig 2023 · Robertson y Wood 2017)' },
          { nombre: 'Cuello femoral (alto riesgo)', corto: 'Cuello fem.', desde: 5, hasta: 5, g: 'grave',
            nota: 'Vuelta al deporte a los 107 días de media, pero solo vuelve el 55 %; complicaciones en el 43 %. Desplazada, riesgo de necrosis de la cabeza femoral: a traumatología sin demora. (Hoenig 2023 · Robertson y Wood 2017)' },
          { nombre: 'Navicular (alto riesgo)', corto: 'Navicular', desde: 5, hasta: 5, g: 'grave',
            nota: 'Vuelta al deporte a los 127 días de media, la más lenta; vuelve el 83 %. (Inmovilización, 6–8 semanas: ver «Fractura».) (Hoenig 2023 · Robertson y Wood 2017)' },
          { nombre: 'Tibia anterior (alto riesgo)', corto: 'Tibia ant.', desde: 6, hasta: 6, g: 'grave',
            nota: 'Vuelta al deporte a los 7 meses, con o sin cirugía (Robertson y Wood 2017); vuelve el 75,5 % y hay complicaciones en el 41 % (Hoenig 2023).' },
        ] },
    ] },
  ],
  // Leyenda de fases (misma que el panel ⏱ de physiq-assessment): nombre y rango
  // corto; `parcial` = solo vale para un tejido (se pinta más clara).
  fases: [
    { id: 'inflamatoria', nombre: 'Inflamatoria', rango: 'días 0–5' },
    { id: 'proliferativa', nombre: 'Proliferativa', rango: 'día 5–sem. 3' },
    { id: 'remodelacion', nombre: 'Remodelación', rango: 'sem. 3–1 año' },
    { id: 'remodelacion', nombre: 'Remodelación (tendón)', rango: '1–2 años', parcial: true },
  ],
  fasesNota: 'Las fases de reparación son orientativas y se solapan. Modelo general de la cicatrización de heridas cutáneas: en tendón, ligamento y hueso los tiempos varían. En una incisión, la resistencia máxima llega hacia las 11–14 semanas y la cicatriz se queda en torno al 80 % de la resistencia original.',
  notas: [
    'Rangos orientativos: dependen de la edad, de las enfermedades y fármacos del paciente (diabetes, tabaco, corticoides…) y de la carga que se aplique.',
    'El dolor y la función no siguen por fuerza el calendario del tejido: el paciente puede estar listo antes o seguir con síntomas después.',
    'Paciente posquirúrgico: manda el protocolo del cirujano.',
  ],
  fuentes: [
    'Filas: adaptado de Snyder-Mackler et al., «Developing Treatment Pathways», 2012 (probablemente cap. 3 de Andrews, Harrelson y Wilk, Physical Rehabilitation of the Injured Athlete, 4.ª ed., Elsevier, 2012; sin verificar).',
    'Fases de reparación: Wallace, Basehore y Zito, «Wound Healing Phases», StatPearls (act. 2023).',
    'Rotura de tendón: Wu, Nerlich y Docheva, «Tendon injuries: basic science and new repair proposals», EFORT Open Rev 2017;2(7):332.',
    'Esguince lateral de tobillo: Bergman, Li y Shuman, «Acute Ankle Sprain», StatPearls (act. 2025); Vuurberg et al., Br J Sports Med 2018;52:956 (guía); Martin et al., J Orthop Sports Phys Ther 2021;51(4):CPG1–CPG80 (guía JOSPT).',
    'Ligamentos de rodilla: Naqvi y Sherman, «Medial Collateral Ligament Knee Injury», StatPearls (act. 2023); Evans, Mabrouk y Nielson, «Anterior Cruciate Ligament Knee Injury», StatPearls (act. 2023); Logerstedt et al., J Orthop Sports Phys Ther 2017;47(11):A1–A47 (guía JOSPT).',
    'Menisco: Prill et al., «The formal EU-US Meniscus Rehabilitation 2024 Consensus… Part II», Knee Surg Sports Traumatol Arthrosc 2025;33(8):3014–3024; Logerstedt et al., J Orthop Sports Phys Ther 2018;48(2):A1–A50 (guía JOSPT de menisco y cartílago).',
    'Fracturas por localización (StatPearls): Hermena y Slane, «Ankle Fracture» (act. 2025); Smidt y Massey, «5th Metatarsal Fracture» (2023); Agrawal y Tiwari, «Metatarsal Fractures» (2023); Seaman y Bergman, «Calcaneus Fractures» (2026); Gheewala et al., «Tarsal Navicular Fractures» (2023); Mabrouk y Pilson, «Patellar Fractures» (2026); Malik et al., «Tibial Plateau Fractures» (2023). Plazos de inmovilización, descarga o vuelta a la función, no de consolidación completa.',
    'Fractura de estrés: Hoenig et al., Br J Sports Med 2023;57:427–432 (revisión sistemática y metaanálisis); Robertson y Wood, World J Orthop 2017;8(3):242–255; May y Marappa-Ganeshan, «Stress Fractures», StatPearls (act. 2023). Vuelta al deporte media, no consolidación.',
  ],
};
