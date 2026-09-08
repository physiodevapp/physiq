// injected: synthetic postural-sway accelerometer feed
window.__swayLevel = 1;
(function(){
  const t0 = performance.now();
  let ph = [0,1.3,2.6,3.9,5.2,0.7].map(x=>x);
  function n(){ return (Math.random()-0.5)*2; }
  setInterval(()=>{
    const t = (performance.now()-t0)/1000;
    const k = window.__swayLevel;
    // low-frequency postural sway (m/s^2), AP slightly larger than ML
    const ap = k*(0.22*Math.sin(2*Math.PI*0.21*t+ph[0]) + 0.11*Math.sin(2*Math.PI*0.63*t+ph[1]) + 0.05*Math.sin(2*Math.PI*1.4*t+ph[2]) + 0.035*n());
    const ml = k*(0.16*Math.sin(2*Math.PI*0.17*t+ph[3]) + 0.09*Math.sin(2*Math.PI*0.55*t+ph[4]) + 0.04*Math.sin(2*Math.PI*1.1*t+ph[5]) + 0.03*n());
    const ud = k*(0.06*Math.sin(2*Math.PI*0.9*t) + 0.02*n());
    const ev = new DeviceMotionEvent('devicemotion', {
      accelerationIncludingGravity: { x: ml, y: -9.80665+ud, z: ap },
      acceleration: { x: ml, y: ud, z: ap },
      rotationRate: { alpha:0, beta:0, gamma:0 },
      interval: 20
    });
    window.dispatchEvent(ev);
  }, 20);
})();
