// Uso: node sujeta.js '{"tau":0.08,"x0":0.06}' 300   (tau: par del empujón escondido, N·m)
// El balancín con un empujón escondido que sujeta el palo: cuando la canica está junto al eje, empuja hacia abajo
// la punta derecha hasta que la canica pasa del punto de equilibrio; cuando está en la punta, empuja hacia abajo
// el contrapeso hasta que la canica vuelve a pasarlo. Cada julio del empujón se apunta como gastado de una pila.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 300);
const TAU = o.tau || 0.05;
const d = require('./modelo.js')(P, o), info = P.build(d), w = info.world, L = w.ledger;
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball];
let tq = 0, fase = '', pila = 0, viajes = 0, donde = 'eje', next = 0, tiempoOn = 0;
const f0 = w._forces; w._forces = function () { f0.call(this); if (tq) lev.ft += tq; };
while (w.t < T) {
  const a0 = lev.a;
  w.step();
  if (tq) { const work = tq * (lev.a - a0); L.battery += work; pila += work; tiempoOn += w.dt; }
  const sp = Math.hypot(ball.vx, ball.vy);
  if (donde === 'eje' && ball.x > 0.34) { donde = 'punta'; viajes++; } else if (donde === 'punta' && ball.x < 0.10) donde = 'eje';
  if (fase === '' && ball.x < 0.10 && sp < 0.05) fase = 'derecha';
  if (fase === '' && ball.x > 0.34 && sp < 0.05) fase = 'izquierda';
  if (fase === 'derecha') { tq = -TAU; if (ball.x > 0.26) { fase = ''; tq = 0; } }
  if (fase === 'izquierda') { tq = TAU; if (ball.x < 0.18) { fase = ''; tq = 0; } }
  if (o.log && w.t >= next) { const bl = w.balance(); console.log(w.t.toFixed(0) + ' s · viajes ' + viajes + ' · pila ' + (pila * 1000).toFixed(1) + ' mJ · err ' + bl.error.toFixed(4)); next += T / 6; }
}
const bl = w.balance();
console.log(JSON.stringify({ tau: TAU, ideal: !!o.ideal, t: +w.t.toFixed(0), viajes, por_minuto: +(viajes / w.t * 60).toFixed(1), pila_mJ: +(pila * 1000).toFixed(1), mJ_por_viaje: viajes ? +(pila / viajes * 1000).toFixed(2) : null, empujando_s: +tiempoOn.toFixed(0), golpes_mJ: +(bl.hits * 1000).toFixed(1), roce_mJ: +((bl.rub + bl.axle) * 1000).toFixed(1), aire_mJ: +(bl.air * 1000).toFixed(2), err_mJ: +(bl.error * 1000).toFixed(2) }));
