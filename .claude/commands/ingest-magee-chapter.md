Voy a pasarte un capítulo de Magee "Orthopedic Physical Assessment" para convertirlo en archivos markdown del knowledge base de PhysiQ (RAG con Supabase pgvector + embeddings text-embedding-3-small de OpenAI).

Este comando es para capítulos **ortopédicos regionales** (columna cervical, hombro, codo, muñeca/mano, cadera, rodilla, tobillo/pie, ATM, torácica, lumbar, pelvis…). Es distinto de `/ingest-goodman-chapter`, que es para el cribado de enfermedad sistémica de Goodman & Snyder. Aquí el eje NO es el diferencial por sistema, sino la **exploración ortopédica**: tests especiales, ROM, exploración neurológica, banderas rojas regionales.

## Decisiones ya tomadas — no las rediscutas

- **Idioma:** español (es). Las queries del copiloto llegan en español; la similitud coseno mejora con idioma homogéneo.
- **Granularidad:** un H2 = un test, condición o tema. Chunks enfocados = vectores más precisos.
- **Excluir:** casos clínicos, referencias bibliográficas numeradas, figuras, tablas de músculos/inervación exhaustivas y escalas de discapacidad (NDI, WAD, etc.) salvo que se pidan explícitamente.
- **Tablas y cuadros clínicos:** convertir a listas descriptivas en prosa. Nunca dejar en formato tabla markdown.
- **Cuadros "Signs and Symptoms" / "Red Flags":** extraer TODOS los ítems, incluso los que parecen obvios. Son los que más se omiten y más valor tienen.
- **Filtro de tests especiales (POR DEFECTO):** incluye SOLO los tests especiales ortopédicos que la fuente indique con **sensibilidad o especificidad media-alta, o buen LR+ / LR−**. Los tests sin precisión documentada o explícitamente no validados (p. ej., muchos tests de arteria vertebral / vértigo) NO se incluyen como tests diagnósticos; recógelos solo como **cribado de seguridad** (p. ej., pre-manipulación), dejando claro que carecen de validez. Si el usuario pide "incluye todos los tests", desactiva este filtro para ese capítulo.
- **Clasifica cada test incluido** por su uso clínico: **confirmatorio** (alta especificidad / buen LR+, "descartar hacia dentro") vs **de cribado/descarte** (alta sensibilidad / bajo LR−, "descartar hacia fuera"). Es lo más accionable para el copiloto.
- **Prioriza clústeres y reglas de predicción clínica** (p. ej., Wainner para radiculopatía cervical, Cook para mielopatía) sobre tests aislados: casi siempre tienen mejor LR que cualquier test suelto. Indica el rendimiento por número de ítems positivos.
- **Preguntas de entrevista:** crea siempre `assessment/<region>-preguntas-entrevista.md` con las preguntas de "Patient History" organizadas por tema/sistema, más los signos de cribado en exploración.

## El eAppendix de precisión diagnóstica — cuidado

Magee cierra cada capítulo con un eAppendix "Reliability, Validity, Specificity, and Sensitivity of Special/Diagnostic Tests". **En la extracción de PDF esta tabla sale desordenada**: las celdas se mezclan y los superíndices de referencias (números sueltos como 225, 240) se confunden con valores. Reglas:

- No transcribas cifras a ciegas de la tabla desordenada. Empareja cada valor con su test cruzándolo con las **fuentes primarias citadas** en la lista de referencias del capítulo (Wainner, Uitvlugt, Hall/Ogince, Jull, Gumina, Cook, etc.).
- **Marca con transparencia** en la revisión cruzada qué cifras se reconstruyeron desde las fuentes primarias frente a las legibles directamente en la tabla. Nunca inventes un par sens/esp/LR: si no puedes verificar una cifra, exprésala en términos cualitativos ("alta especificidad", "buen LR−") en lugar de un número dudoso.

## Formato de cada archivo

```markdown
---
title: "Título descriptivo"
category: assessment     # assessment | protocol | redflags | differential
region: <región>         # cervical | shoulder | lumbar | knee | hip | ankle | global
source: "Magee - Orthopedic Physical Assessment (<Región>)"
language: es
tags: [región, tag1, tag2]
---

## Nombre del test, condición o tema

Contenido en prosa. Sin subcabeceras H3. Listas con - para signos/síntomas/pasos.
Para cada test incluido: propósito, técnica breve, criterio de positividad,
precisión diagnóstica (sens/esp/LR con su fuente) e interpretación clínica
(confirmatorio vs descarte).
```

## Archivos a crear por capítulo (estructura tipo)

Predominan `category: assessment` y `region: <región específica>`. Ajusta a lo que cubra el capítulo:

- `assessment/<region>-tests-<objetivo>.md` — uno por objetivo clínico, con los tests que pasan el filtro. Ejemplos típicos: `-tests-radiculopatia`, `-tests-inestabilidad`, `-tests-mielopatia`, `-test-<nombre>` cuando un test merece archivo propio.
- `assessment/<region>-palpacion-<estructura>.md` — si hay examen manual/palpación con precisión documentada (p. ej., facetario).
- `assessment/<region>-preguntas-entrevista.md` — preguntas de "Patient History" por tema + signos de cribado en exploración.
- `redflags/<region>-banderas-rojas.md` — banderas por causa (fractura, neoplasia, infección), signos neurológicos/mielopatía, inestabilidad, disfunción vascular, reglas de decisión (p. ej., Canadian C-Spine Rule).
- `differential/<region>-diferencial-<tema>.md` — diagnósticos diferenciales clave del capítulo (p. ej., radiculopatía vs mielopatía vs plexopatía; espondilosis vs estenosis vs hernia).
- `protocols/<region>-protocolo-examen.md` — proceso de decisión del examen (scanning, orden de movimientos, selección de tests por sospecha, perlas).
- `protocols/<region>-cribado-<seguridad>.md` — si el capítulo cubre cribado de seguridad relevante (p. ej., disfunción arterial cervical pre-manipulación).

## Región en el frontmatter

El filtro por región ya está activo en el Worker y en `match_chunks`.

- Usa la **región específica** (`cervical`, `shoulder`, `knee`, `hip`, `ankle`, `lumbar`) por defecto: en un capítulo ortopédico casi todo el contenido es exclusivo de esa región y debe aparecer solo cuando la sesión tiene esa región activa.
- Usa `region: global` solo para contenido genuinamente transversal (cribado sistémico general que aplica a cualquier región). En capítulos de Magee esto es raro.

## Modelo requerido por paso

| Paso | Tarea | Modelo | Esfuerzo |
|------|-------|--------|----------|
| 1 | Extraer texto del PDF y analizar estructura | Opus 4.8 | Alto |
| 2 | Proponer estructura de archivos | Opus 4.8 | Alto |
| 3 | Crear todos los archivos | Opus 4.8 | Alto |
| 4 | Revisión cruzada PDF vs archivos | Opus 4.8 | Alto |
| 5 | Aplicar gaps + PR + merge | Sonnet 4.6 | Medio |

Nota: el paso 3 va en Opus (no Sonnet) porque la carga de cifras diagnósticas y el eAppendix desordenado exigen criterio clínico fino; un LR mal asignado o una cifra fabricada es un error caro. Si el capítulo fuera de volcado narrativo puro, Sonnet bastaría.

## Confirmación de modelo — obligatoria antes de cada paso

No intentes detectar el modelo activo. Antes de ejecutar cada paso, muestra siempre este bloque y espera respuesta explícita del usuario:

> **Antes de continuar con el paso N — [nombre del paso]**
> El modelo requerido es **[modelo]** con esfuerzo **[esfuerzo]**.
> Ajústalo con `/model [modelo]` si es necesario y responde "listo" para continuar.

No ejecutes el paso hasta recibir "listo" u otra confirmación explícita. No asumas que el modelo ya es el correcto.

## Flujo de trabajo

1. **Extrae el texto del PDF** — usa el extractor Python con stdlib si poppler no está disponible. Como sale desordenado (columnas mezcladas, típico de Magee), reflúyelo con word-wrap y divídelo en partes para inspeccionarlo, y usa Grep para localizar secciones (tests especiales, "sensitivity/specificity/likelihood", nombres de tests):

```python
import re, zlib

data = open('archivo.pdf', 'rb').read()
streams = []
for m in re.finditer(rb'stream\r?\n', data):
    start = m.end()
    e = data.find(b'endstream', start)
    if e == -1: continue
    try:
        streams.append(zlib.decompress(data[start:e]))
    except Exception:
        pass

def unescape(s):
    return s.replace(b'\\(', b'(').replace(b'\\)', b')').replace(b'\\\\', b'\\')

out = []
for dec in streams:
    txt = []
    for tm in re.finditer(rb'\((?:[^()\\]|\\.)*\)\s*Tj', dec):
        inner = re.match(rb'\((.*)\)\s*Tj', tm.group(), re.S)
        if inner: txt.append(unescape(inner.group(1)))
    for tm in re.finditer(rb'\[(.*?)\]\s*TJ', dec, re.S):
        parts = re.findall(rb'\((?:[^()\\]|\\.)*\)', tm.group(1))
        line = b''.join(unescape(re.match(rb'\((.*)\)', p, re.S).group(1)) for p in parts)
        txt.append(line)
    if txt:
        try:
            out.append(b' '.join(txt).decode('latin-1'))
        except Exception:
            pass

open('chapter.txt', 'w').write('\n'.join(out))
```

2. **Analiza y propón la estructura de archivos** — sin crear nada todavía. En el análisis, lista explícitamente qué tests especiales **pasan el filtro** de precisión (con su sens/esp/LR y fuente) y cuáles se excluyen y por qué. Lista los archivos que crearás con una línea cada uno. Espera confirmación.

3. **Crea todos los archivos** de una vez tras la confirmación.

4. **Haz la revisión cruzada tú mismo** antes de reportar "hecho": cruza sección por sección el capítulo contra los archivos. Busca activamente:
   - Tests que pasan el filtro pero no tienen chunk (o al revés: tests incluidos que NO cumplen el filtro).
   - Cifras sens/esp/LR mal emparejadas por el desorden del eAppendix; marca cuáles reconstruiste desde fuentes primarias.
   - Cuadros "Signs and Symptoms" / banderas rojas con ítems no volcados.
   - Preguntas de entrevista y signos de cribado en exploración no recogidos.
   - Contenido añadido que no está en la fuente (indícalo explícitamente).

   Reporta los gaps ordenados por importancia (🔴 omisión/error real / 🟡 detalle clínico / ⚪ enriquecimiento opcional) antes de crear el PR.

5. **Aplica los gaps** y luego crea el PR y haz merge (el merge a `main` dispara la Action `ingest-knowledge`, que embebe y hace upsert a Supabase; es solo knowledge base, no requiere redesplegar el Worker).

## Rama de trabajo

Crea una rama nueva: `claude/knowledge-<region>-magee` sobre `main` (o usa la rama designada por el entorno si existe).

---

El capítulo es: [adjuntar PDF]
