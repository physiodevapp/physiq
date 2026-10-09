// ============================================================
// PhysiQ-Assessment · lib/zip.js
// Zip mínimo sin compresión (método «stored»), sin dependencias: basta para
// unos pocos ficheros de texto (paquete de revisión del informe con IA).
// Nombres en UTF-8 (bit 11). Pura: devuelve los bytes; la descarga la hace
// quien la llama.
// ============================================================

let _tablaCRC = null;
function crc32(bytes) {
  if (!_tablaCRC) {
    _tablaCRC = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      _tablaCRC[n] = c >>> 0;
    }
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) crc = _tablaCRC[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Fecha y hora en formato DOS (la que muestran los descompresores)
function fechaDOS(d) {
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const dia = ((Math.max(d.getFullYear(), 1980) - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { hora, dia };
}

// [{ nombre, texto }] → Uint8Array con el .zip
export function crearZip(ficheros, ahora = new Date()) {
  const enc = new TextEncoder();
  const { hora, dia } = fechaDOS(ahora);
  const locales = [];
  const centrales = [];
  let offset = 0;
  for (const f of ficheros) {
    const nombre = enc.encode(f.nombre);
    const datos = enc.encode(f.texto ?? '');
    const crc = crc32(datos);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);          // versión necesaria
    local.setUint16(6, 0x0800, true);      // nombres en UTF-8
    local.setUint16(8, 0, true);           // sin compresión
    local.setUint16(10, hora, true);
    local.setUint16(12, dia, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, datos.length, true);
    local.setUint32(22, datos.length, true);
    local.setUint16(26, nombre.length, true);
    local.setUint16(28, 0, true);
    locales.push(new Uint8Array(local.buffer), nombre, datos);

    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, hora, true);
    central.setUint16(14, dia, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, datos.length, true);
    central.setUint32(24, datos.length, true);
    central.setUint16(28, nombre.length, true);
    central.setUint32(42, offset, true);   // el resto (extra, comentario, atributos) a cero
    centrales.push(new Uint8Array(central.buffer), nombre);
    offset += 30 + nombre.length + datos.length;
  }
  const tamCentral = centrales.reduce((s, b) => s + b.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, ficheros.length, true);
  fin.setUint16(10, ficheros.length, true);
  fin.setUint32(12, tamCentral, true);
  fin.setUint32(16, offset, true);
  const partes = [...locales, ...centrales, new Uint8Array(fin.buffer)];
  const out = new Uint8Array(partes.reduce((s, b) => s + b.length, 0));
  let p = 0;
  for (const b of partes) { out.set(b, p); p += b.length; }
  return out;
}

export { crc32 };
