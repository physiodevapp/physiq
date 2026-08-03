# Destacados de LinkedIn — PhysiQ

Referencia para los destacados del perfil. Esquema: título corto + párrafo de 2-3 frases con tecnología clave y nota de uso real.

---

## PhysiQ Hub

**Título:** PhysiQ — Suite clínica de fisioterapia con copiloto IA

PWA que agrupa herramientas de valoración funcional (ROM, fuerza, equilibrio, salto, cinemática) e incorpora un copiloto clínico que transcribe la sesión y sugiere hipótesis fundamentadas en una base de conocimiento propia. Cloudflare Workers, RAG con pgvector, Claude, Deepgram. La uso con pacientes en consulta.

---

## physiq-assessment

**Título:** physiq-assessment — Valoración clínica guiada por región anatómica

App de exploración física estructurada en cinco fases: observación, movimiento activo, tests especiales, exploración neurológica y diagnóstico diferencial. El protocolo se adapta a la región seleccionada y las hipótesis generadas llegan como contexto al copiloto. Sin papel, sin cambiar de pantalla entre fases.

---

## physiq-motion

**Título:** physiq-motion — Goniómetro digital con el acelerómetro del móvil

Reemplaza al goniómetro manual usando el acelerómetro del teléfono como inclinómetro. Mide rangos de movimiento articular (cadera, rodilla, tobillo, hombro, columna) y envía los datos directamente al informe clínico de la sesión. Funciona emparejado con el hub vía WebRTC: el fisio mide con el móvil mientras la tablet muestra la valoración.

---

## physiq-report

**Título:** physiq-report — Informe clínico SOAP con transcripción e IA

Genera notas clínicas a partir de la transcripción en tiempo real de la consulta. Deepgram transcribe y diariza, Claude redacta el SOAP con los datos de la sesión como contexto (ROM, fuerza, cuestionarios, equilibrio). Sin teclear entre paciente y paciente.

---

## physiq-force

**Título:** physiq-force — Dinamómetro Bluetooth para valoración de fuerza

Convierte un dinamómetro con Bluetooth en una herramienta de medición objetiva integrada en la historia clínica. Registra series de contracciones, calcula el pico y la curva fuerza-tiempo por grupo muscular. Los datos entran automáticamente en el informe de la sesión.

---

## physiq-balance

**Título:** physiq-balance — Posturografía con el acelerómetro del móvil

Mide el control postural usando el teléfono como plataforma de fuerza simplificada. Calcula desplazamiento del centro de presión, velocidad media y área de la elipse de confianza. Tests en bipedestación, apoyo unipodal y distintas condiciones sensoriales; resultados integrados en el informe clínico.

---

## physiq-questionnaire

**Título:** physiq-questionnaire — Cuestionarios clínicos validados en tablet

Colección de escalas de medición validadas (dolor, funcionalidad, calidad de vida) administradas directamente en pantalla durante la consulta. La puntuación entra en la historia de la sesión y el copiloto la usa como contexto para las sugerencias clínicas.

---

## physiq-wiki

**Título:** physiq-wiki — Wiki de fisioterapia in situ

Base de referencia rápida de tests ortopédicos, diagnóstico diferencial y protocolos de valoración, accesible sin salir de la suite. El mismo contenido alimenta el copiloto a través del pipeline RAG (Supabase pgvector) para fundamentar sus sugerencias en fuentes validadas.

---

## physiq-jump

**Título:** physiq-jump — Test de salto vertical para fisioterapia deportiva

Mide altura de salto (CMJ, SJ, drop jump) y tiempo de vuelo con la cámara lenta del móvil. Registra asimetría bilateral, potencia relativa y fatiga en series. Los resultados entran en el contexto del informe clínico y en el copiloto.

---

## physiq-kinematics

**Título:** physiq-kinematics — Análisis cinemático 2D desde vídeo

Analiza movimiento articular a partir de vídeo en cámara lenta. Detecta articulaciones con pose estimation y calcula ángulos dinámicos en el tiempo (ROM dinámico por articulación). Complementa la valoración de movimiento de la sesión sin hardware adicional.
