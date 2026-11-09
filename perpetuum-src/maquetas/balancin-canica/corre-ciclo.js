// Uso: node corre-ciclo.js '{"al":12,"mc":0.05,"hueco":0.03,"sube":0.02,"vfondo":0.06}' 60
//   al: inclinación del brazo (grados); mc: bobina (kg); hueco: entre la punta y el escalón; sube: cuánto sube la bobina; vfondo: hondo del suelo de la V
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 60);
const d = require('./ciclo.js')(P, o), info = P.build(d), w = info.world;
if (info.overlaps.length) console.log('SOLAPES', JSON.stringify(info.overlaps));
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball];
const B = d._B, Ep = d._E, mid = (B[0] + Ep[0]) / 2;
const ang = b => (b.a - b.a0) * 180 / Math.PI;
let next = 0, donde = 'punta', ciclos = 0, last = 0;
while (w.t < T && !w.isStopped()) {
  w.step();
  // la bola: en la V (cerca de la bisagra) o en la punta; un ciclo = punta -> V -> punta
  const dB = Math.hypot(ball.x - lev.toWorld(0, 0).x, 0);
  if (donde === 'punta' && ball.x < B[0] + 0.05) donde = 'V';
  else if (donde === 'V' && ball.x > Ep[0] - 0.06) { donde = 'punta'; ciclos++; last = w.t; }
  if (o.log && w.t >= next) { console.log(w.t.toFixed(2) + ' s · palo ' + ang(lev).toFixed(1) + '° · bola (' + ball.x.toFixed(3) + ', ' + ball.y.toFixed(3) + ') ' + donde + ' · ciclos ' + ciclos); next += o.cada || 0.25; }
}
const bl = w.balance();
console.log(JSON.stringify({ o, parada: w.isStopped(), t: +w.t.toFixed(1), ciclos, ultimo_ciclo_s: +last.toFixed(1), palo: +ang(lev).toFixed(1), bola: [+ball.x.toFixed(3), +ball.y.toFixed(3)], gastado_mJ: +(bl.reserve * 1000).toFixed(1), golpes_mJ: +(bl.hits * 1000).toFixed(1), roce_mJ: +((bl.rub + bl.axle) * 1000).toFixed(1), err_mJ: +(bl.error * 1000).toFixed(2) }));
