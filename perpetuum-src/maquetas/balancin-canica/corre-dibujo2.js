// Uso: node corre-dibujo2.js '{"mc":0.04,"lo":-30,"esc":0.09,"suelo":0.0}' 30   (mc: bobina en kg; lo: cuánto cuelga la rampa; esc: escalón; suelo: suelo de la V)
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 60);
const d = require('./dibujo2.js')(P, o), info = P.build(d), w = info.world;
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball];
const ang = b => (b.a - b.a0) * 180 / Math.PI;
let next = 0, viajes = 0, donde = 'punta', bajadas = 0, side = 0;
const B = d._B;
while (w.t < T && !w.isStopped()) {
  w.step();
  // la bola en el fondo de la V (cerca de la bisagra) o en la punta (lejos)
  const rb = Math.hypot(ball.x - lev.toWorld(0, 0).x * 0 - ball.x + ball.x - (B[0]), 0) ;
  const fx = ball.x;
  if (donde === 'punta' && fx < B[0] + 0.05) { donde = 'fondo'; } else if (donde === 'fondo' && fx > B[0] + 0.18) { donde = 'punta'; viajes++; }
  const a = ang(lev), s = a < -1 ? 1 : (a > 1 ? -1 : side); if (s !== side) { if (s === 1) bajadas++; side = s; }
  if (o.log && w.t >= next) { console.log(w.t.toFixed(2) + ' s · palo ' + a.toFixed(1) + '° · bola (' + ball.x.toFixed(3) + ', ' + ball.y.toFixed(3) + ') ' + donde); next += o.cada || 0.25; }
}
const bl = w.balance();
console.log(JSON.stringify({ o, parada: w.isStopped(), t: +w.t.toFixed(1), bajadas_del_palo: bajadas, vueltas_de_la_bola: viajes, palo: +ang(lev).toFixed(1), bola: [+ball.x.toFixed(3), +ball.y.toFixed(3)], gastado_mJ: +(bl.reserve * 1000).toFixed(1), golpes_mJ: +(bl.hits * 1000).toFixed(1), roce_mJ: +((bl.rub + bl.axle) * 1000).toFixed(1), err_mJ: +(bl.error * 1000).toFixed(2) }));
