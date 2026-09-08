// Injected: fake Tindeq Progressor over Web Bluetooth, driven by window.__kgAt(t)
(function(){
  const T0 = performance.now();
  window.__kgAt = t => 0; window.__bleT = () => (performance.now()-T0)/1000;
  class Char extends EventTarget {
    constructor(){ super(); this.value = null; }
    async startNotifications(){ return this; }
    async stopNotifications(){ return this; }
    async writeValue(){ return; }
  }
  const dataChar = new Char(), ctrlChar = new Char();
  const svc = { getCharacteristic: async uuid => uuid.endsWith('02-1ea6-40c9-9dcc-13d34ffead57') ? dataChar : ctrlChar };
  const gatt = { connected:false, connect: async function(){ this.connected = true; return { getPrimaryService: async () => svc }; }, disconnect(){ this.connected = false; } };
  const device = Object.assign(new EventTarget(), { name:'Progressor_DEMO', id:'demo', gatt });
  navigator.bluetooth = {
    getAvailability: async () => true,
    requestDevice: async () => device,
  };
  // 80 Hz notification feed
  setInterval(() => {
    if (!gatt.connected) return;
    const t = (performance.now() - T0) / 1000;
    const kg = Math.max(0, window.__kgAt(t));
    const buf = new ArrayBuffer(10);
    const dv  = new DataView(buf);
    dv.setUint8(0, 1);           // RES.WEIGHT_MEAS
    dv.setUint8(1, 8);           // payload length
    dv.setFloat32(2, kg, true);  // kg
    dv.setUint32(6, Math.round(t*1e6) >>> 0, true); // µs timestamp
    dataChar.value = dv;
    dataChar.dispatchEvent(new Event('characteristicvaluechanged'));
  }, 12);
})();
