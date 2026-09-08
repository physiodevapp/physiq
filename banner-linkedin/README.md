# Candidatas de banner de LinkedIn (1584 × 396)

Capturas de PhysiQ funcionando, recortadas a la franja del banner de LinkedIn.
**No es material de la app**: esta carpeta es un entregable puntual y no se
publica (vive solo en esta rama, no en `main`, que es lo que sirve GitHub Pages).

## Contenido

- `candidatas/` — los recortes finales, exactamente 1584 × 396 px.
- `previews/` — cada candidata con el círculo de la foto de perfil y el texto
  de ejemplo superpuestos, en dos posiciones (`a` = texto a la izquierda,
  `b` = texto arriba a la derecha), más `00-contact-sheet.png` con todas
  juntas y una columna «a tamaño móvil».
- Scripts: `final*.mjs` (captura con Playwright), `preview.py` y `sheet.py`
  (montaje con Pillow), `sway.js` / `ble.js` (sensores simulados).

## Cómo se generaron

Servidor estático sobre el repo (`npx http-server`), Chromium vía Playwright
con viewport de 792 px y `deviceScaleFactor: 2`, de modo que el recorte de
198 px de alto sale nativo a 1584 × 396 sin reescalar.

Ningún dato es de un paciente real:

- **Equilibrio**: test real de 30 s con un acelerómetro sintético
  (`sway.js` emite `devicemotion` con oscilación postural plausible). Las
  métricas y el estabilograma los calcula la app.
- **Fuerza**: Web Bluetooth simulado (`ble.js` finge un Tindeq Progressor y
  emite notificaciones de peso). La curva la dibuja la app.
- **ROM**: valores de rango sembrados en el estado de la app.
- **Wiki / hub**: contenido propio de la app, sin datos de sesión.

Las funciones de IA (copiloto, informes) no aparecen: el Worker no es
alcanzable desde el entorno de captura, así que el hub muestra el badge
«SIN VERIFICAR» — recortado fuera de todas las candidatas.
