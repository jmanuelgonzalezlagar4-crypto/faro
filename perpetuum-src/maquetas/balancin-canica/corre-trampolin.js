// Uso: node corre-trampolin.js '{"k":5}' 30   (k: muelle del trampolín, 0 = sin muelle; lo y hi: cuánto se dobla la rampa hacia abajo y hacia arriba, en grados;
//   mc: contrapeso en kg; final: el escalón al final de la rampa, con esc su altura y suelo la de la base bajo la bisagra)
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 30);
const d = require('./trampolin.js')(P, o), info = P.build(d), w = info.world;
if (info.overlaps.length) console.log('SOLAPES', JSON.stringify(info.overlaps));
const lev = info.bodyOf[d._ids.lever], ramp = info.bodyOf[d._ids.ramp], ball = info.bodyOf[d._ids.ball];
let next = 0, flips = 0, side = 0;
const ang = b => ((b.a - b.a0) * 180 / Math.PI), rel = () => ang(ramp) - ang(lev);
while (w.t < T && !w.isStopped()) {
  w.step();
  const a = ang(lev), s = a < -1 ? 1 : (a > 1 ? -1 : side); if (s !== side) { if (side !== 0) flips++; side = s; }
  if (o.log && w.t >= next) { console.log(w.t.toFixed(2) + ' s · palo ' + a.toFixed(1) + '° · rampa ' + ang(ramp).toFixed(1) + '° · bola (' + ball.x.toFixed(3) + ', ' + ball.y.toFixed(3) + ')'); next += o.cada || 0.25; }
}
const bl = w.balance();
console.log(JSON.stringify({ o, parada: w.isStopped(), t: +w.t.toFixed(1), vaivenes: flips, palo: +ang(lev).toFixed(1), rampa_doblada: +rel().toFixed(1), bola: [+ball.x.toFixed(3), +ball.y.toFixed(3)], gastado_mJ: +(bl.reserve * 1000).toFixed(1), golpes_mJ: +(bl.hits * 1000).toFixed(1), roce_mJ: +((bl.rub + bl.axle) * 1000).toFixed(1), err_mJ: +(bl.error * 1000).toFixed(2) }));
