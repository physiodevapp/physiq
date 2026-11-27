# three.js 0.186.1 (MIT)

Copia sin cambios de `three@0.186.1` (npm), para el modo 3D de Entrena (`docs/entrena-3d.md`).
Se carga con `import()` solo al entrar en ese modo.

- `three.module.js`, `three.core.js`: `build/` del paquete.
- `addons/`: `examples/jsm/` del paquete, solo lo que usa el modo (`controls/OrbitControls.js`,
  `loaders/GLTFLoader.js` y lo que este importa, `utils/BufferGeometryUtils.js`,
  `utils/SkeletonUtils.js`). **Único cambio**: `from 'three'` → `from '../../three.module.js'`, para
  no necesitar un import map.
- `LICENSE`: la licencia MIT de three.js (se queda con los archivos).

Para actualizar: `npm pack three@<versión>`, copiar los mismos archivos, repetir el cambio de la
importación y probar la sección `entrena-3d` del smoke test.
