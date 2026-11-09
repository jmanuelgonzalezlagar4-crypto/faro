// Uso: node corre.js '{"x0":0.06,"w":3}' 60   (x0: dónde empieza la canica; w: empujón inicial al palo, rad/s; ideal: sin roces)
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 30);
const d = require('./modelo.js')(P, o), info = P.build(d), w = info.world;
if (info.overlaps.length) console.log('SOLAPES', JSON.stringify(info.overlaps));
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball];
if (o.w) { lev.w = o.w; w.ledger.hand += 0.5 * lev.I * o.w * o.w; }   // empujón inicial al palo, apuntado como empujón de la mano
if (o.w) { const I = 1 / lev.iI; w.ledger.hand += 0.5 * I * o.w * o.w - 0.5 * lev.I * o.w * o.w; }
let next = 0, flips = 0, side = 0;
while (w.t < T && !w.isStopped()) {
  w.step();
  const ang = (lev.a - lev.a0) * 180 / Math.PI, s = ang < -1 ? 1 : (ang > 1 ? -1 : side);
  if (s !== side) { if (side !== 0) flips++; side = s; }
  if (w.t >= next) { const bl = w.balance(); if (o.log) console.log(w.t.toFixed(1) + ' s · palo ' + ang.toFixed(1) + '° · canica en x=' + ball.x.toFixed(3) + ' · err ' + bl.error.toFixed(4)); next += o.cada || 1; }
}
const bl = w.balance();
console.log(JSON.stringify({ o, parada: w.isStopped(), t: +w.t.toFixed(1), vaivenes: flips, palo_grados: +((lev.a - lev.a0) * 180 / Math.PI).toFixed(1), canica_x: +ball.x.toFixed(3), gastado_J: +bl.reserve.toFixed(4), golpes: +bl.hits.toFixed(4), roce: +(bl.rub + bl.axle).toFixed(4), err: +bl.error.toFixed(4) }));
