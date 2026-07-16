Voy a pasarte un capítulo de Goodman & Snyder "Differential Diagnosis for Physical Therapists" para convertirlo en archivos markdown del knowledge base de PhysiQ (RAG con Supabase pgvector + embeddings text-embedding-3-small de OpenAI).

## Decisiones ya tomadas — no las rediscutas

- **Idioma:** español (es). Las queries del copiloto llegarán en español; la similitud coseno mejora con idioma homogéneo.
- **Granularidad:** un H2 = una condición o tema. Chunks enfocados = vectores más precisos.
- **Excluir:** casos clínicos (Case Examples), referencias bibliográficas numeradas, figuras.
- **Tablas y cuadros clínicos:** convertir a listas descriptivas en prosa. Nunca dejar en formato tabla markdown.
- **Cuadros "Clinical Signs and Symptoms":** extraer TODOS los ítems, incluso los que parecen obvios. Son los que más se omiten y más valor tienen.
- **Preguntas de entrevista:** crear siempre un archivo `assessment/<region>-preguntas-entrevista.md` con las preguntas de "Client History and Interview" organizadas por sistema.

## Formato de cada archivo

```markdown
---
title: "Título descriptivo"
category: differential   # differential | redflags | assessment | protocol
region: <región>         # shoulder | lumbar | cervical | knee | hip | ankle | global
source: "Goodman & Snyder - Differential Diagnosis for Physical Therapists"
language: es
tags: [región, tag1, tag2]
---

## Nombre de la condición o tema

Contenido en prosa. Sin subcabeceras H3. Listas con - para síntomas/signos.
```

## Archivos a crear por capítulo (estructura tipo)

- `differential/<region>-mecanismos-dolor-referido.md` — mecanismos + tabla de localización por órgano + catálogo completo de condiciones de la tabla maestra (equivalente a Table 18.1)
- `differential/<region>-causas-<sistema>.md` — uno por sistema: cardiovascular, pulmonar, renal, GI, hepatobiliar, reumático, infeccioso, oncológico, ginecológico (los que apliquen)
- `differential/<region>-capsulitis-adhesiva-sistemica.md` — si el capítulo lo cubre
- `redflags/<region>-banderas-rojas-por-sistema.md` — banderas por sistema + criterios de derivación inmediata
- `assessment/<region>-preguntas-entrevista.md` — preguntas de entrevista por sistema, signos de cribado en exploración
- `protocols/<region>-protocolo-cribado.md` — proceso de decisión clínica, perlas, checklist

## Verificación de modelo antes de cada paso

Antes de ejecutar cada paso, indica en una línea el modelo activo y si es el adecuado. Si no es el correcto, avisa y espera a que el usuario cambie con `/model` antes de continuar. No ejecutes el paso hasta recibir confirmación explícita.

| Paso | Tarea | Modelo requerido | Esfuerzo |
|------|-------|-----------------|----------|
| 1 | Extraer texto del PDF y analizar estructura | Opus 4.8 | Alto |
| 2 | Proponer estructura de archivos | Opus 4.8 | Alto |
| 3 | Crear todos los archivos | Sonnet 4.6 | Medio |
| 4 | Revisión cruzada PDF vs archivos | Opus 4.8 | Alto |
| 5 | Aplicar gaps + PR + merge | Sonnet 4.6 | Medio |

Ejemplo de cabecera antes de cada paso:

> Modelo activo: claude-opus-4-8 ✓ — adecuado para este paso. Procediendo.

> Modelo activo: claude-sonnet-4-6 ✗ — este paso requiere Opus 4.8 + Alto. Cambia con `/model claude-opus-4-8` y confirma para continuar.

Si el modelo activo no está disponible en el contexto del sistema, no asumas cuál es. Muestra este mensaje y espera confirmación explícita antes de continuar con cualquier paso:

> No puedo determinar el modelo activo en esta sesión.
> Antes de continuar confirma que has ajustado:
> - Pasos 1, 2, 4: `/model claude-opus-4-8` + esfuerzo Alto
> - Pasos 3, 5: `/model claude-sonnet-4-6` + esfuerzo Medio
>
> Responde "listo" cuando hayas ajustado el modelo y el esfuerzo.

## Flujo de trabajo

1. **Extrae el texto del PDF** — usa el extractor Python con stdlib si poppler no está disponible:

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

2. **Analiza y propón la estructura de archivos** — sin crear nada todavía. Lista los archivos que crearás con una línea de descripción cada uno. Espera confirmación.

3. **Crea todos los archivos** de una vez tras la confirmación.

4. **Haz la revisión cruzada tú mismo** antes de reportar "hecho": cruza sección por sección del capítulo contra los archivos creados. Busca activamente:
   - Cuadros "Clinical Signs and Symptoms" con ítems no volcados
   - Condiciones de la tabla maestra sin chunk dedicado
   - Preguntas de entrevista no recogidas
   - Signos de cribado en exploración física no incluidos
   - Contenido añadido que no está en la fuente (indícalo explícitamente)

   Reporta los gaps ordenados por importancia (🔴 omisión real / 🟡 detalle clínico / ⚪ enriquecimiento opcional) antes de crear el PR.

5. **Aplica los gaps** y luego crea el PR y haz merge.

## Rama de trabajo

Crea siempre una rama nueva: `claude/knowledge-<region>-<slug>` sobre `main`.

---

El capítulo es: [adjuntar PDF]
