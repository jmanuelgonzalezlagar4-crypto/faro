// Prueba 2: la mano lleva el imán alrededor del aro, como en el vídeo. ¿Gira el aro? ¿Cuadran las cuentas?
const path = process.argv[2] || '.';
const E = require(path + '/engine.js'); global.PerpetuumEngine = E;
const P = require(path + '/build.js');
const d = P.EXAMPLES.hamster.make();
const info = P.build(d), w = info.world;
const wh = d.parts.find(p => p.kind === 'wheel'), mg = d.parts.find(p => p.kind === 'magnet');
const hb = info.bodyOf[wh.id];
const cx = wh.x, cy = wh.y, rm = Math.hypot(mg.x - cx, mg.y - cy);
let fails = 0, okm = 0;
let th = Math.atan2(mg.y - cy, mg.x - cx), mx = mg.x, my = mg.y;
const speed = +(process.argv[3] || 30) * Math.PI / 180;   // grados por segundo que la mano gira el imán
const rows = [];
for (let i = 1; i <= 480 * 30; i++) {
  if (w.t > 2 && w.t < 22) {
    // la mano sube el imán por fuera del aro, despacio, en el sentido de las agujas del reloj (hacia la izquierda y arriba)
    const nth = th - speed * w.dt, nx = cx + rm * Math.cos(nth), ny = cy + rm * Math.sin(nth);
    if (w.moveFixedMagnet(mg.id, nx - mx, ny - my)) { th = nth; mx = nx; my = ny; okm++; } else fails++;
  }
  w.step();
  if (i % 960 === 0) {
    const b = w.balance();
    rows.push(`t=${w.t.toFixed(0).padStart(2)} s · aro ${((hb.a - hb.a0) * 180 / Math.PI).toFixed(0).padStart(5)}° · ${(-hb.w * 60 / 2 / Math.PI).toFixed(1).padStart(5)} rpm · mano ${b.hand.toFixed(3)} J · roce+golpes ${(b.rub + b.hits + b.axle + b.air).toFixed(3)} J · err ${b.error.toFixed(4)}`);
  }
}
rows.forEach(r => console.log(r));
console.log('movimientos', okm, 'bloqueados', fails, 'imán giró', ((Math.atan2(mg.y - cy, mg.x - cx) - th) * 180 / Math.PI).toFixed(0), '°');
