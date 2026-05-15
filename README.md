# PhysiQ — Informes CIF-AFTA

Herramienta clínica para fisioterapeutas que genera informes de sesión estructurados a partir de audio. Transcribe la grabación con Whisper y redacta el informe en español siguiendo el marco CIF-AFTA mediante Claude.

## Demo

Abre `index.html` directamente en el navegador. No requiere instalación, servidor ni build.

## Flujo de trabajo

1. Configura los datos del centro (nombre, logotipo, colores) — se guardan en localStorage.
2. Introduce los datos del paciente (nombre, fecha, diagnóstico, nº sesión).
3. Sube el audio de la sesión (drag & drop o selector de archivo).
4. Elige la plantilla:
   - **Ficha breve** — nota de sesión concisa.
   - **Narrativo institucional** — informe completo con estructura biopsicosocial CIF.
5. Genera el informe → previsualiza en pantalla → descarga como `.docx` con cabecera clínica personalizada.

## Requisitos externos

La aplicación necesita dos **Cloudflare Workers** activos:

| Worker | Función |
|---|---|
| `physiq-whisper` | Proxy hacia la API de Whisper (transcripción de audio) |
| `physiq-claude` | Proxy hacia la API de Anthropic (generación del informe, modelo `claude-sonnet-4-5`) |

Las URLs de los workers están definidas directamente en el bloque `<script>` de `index.html`. Cámbiala si despliegas tus propios workers.

## Despliegue propio

1. Crea los dos workers en [Cloudflare](https://workers.cloudflare.com/) con acceso a las APIs de Whisper y Anthropic.
2. Actualiza las URLs de los workers en `index.html`.
3. Sirve `index.html` desde cualquier hosting estático (Cloudflare Pages, GitHub Pages, etc.) o úsalo localmente.

## Personalización del informe

Desde el panel de configuración (colapsable en la app) puedes ajustar:

- Logotipo del centro (PNG/JPG, se incrusta en el `.docx`)
- Colores, tipografía y estilo de cabecera del documento Word
- Texto de introducción con sustitución automática del nombre del paciente
- Cláusula RGPD

Toda la configuración persiste en `localStorage` del navegador.

## Tecnologías

- HTML/CSS/JS puro — sin frameworks ni bundler
- [`docx`](https://github.com/dolanmiu/docx) v8.5.0 (cargado desde CDN en tiempo de ejecución)
- Cloudflare Workers (Whisper + Anthropic Claude)
