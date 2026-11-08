// Misma máquina, tres bolas: libre (va a la V), pegada en la punta (nunca va a la V) y sin bola.
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const base = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
function corre(o, nombre) {
  const d = require('./ciclo3.js')(P, o), info = P.build(d), w = info.world;
  const lev = info.bodyOf[d._ids.lever], th0 = d._th0, ball = info.bodyOf[d._ids.ball];
  const hl = lev.toLocal(d._B[0], d._B[1]);
  let min = 99, tmin = 0, maxDesp = -99, sMin = 9, serie = [];
  let next = 0;
  while (w.t < 5) {
    w.step();
    const a = th0 + (lev.a - lev.a0) * 180 / Math.PI;
    if (a < min) { min = a; tmin = w.t; maxDesp = -99; }
    if (w.t > tmin) maxDesp = Math.max(maxDesp, a);
    const hp = lev.toWorld(hl.x, hl.y); sMin = Math.min(sMin, Math.hypot(ball.x - hp.x, ball.y - hp.y) / o.L);
    if (w.t + 1e-9 >= next) { serie.push(+a.toFixed(2)); next += 0.01; }
  }
  const b = w.balance();
  return { nombre, solapes: info.overlaps.length, baja_a: +min.toFixed(1), a_los_s: +tmin.toFixed(2), sube_luego_a: +maxDesp.toFixed(1), bola_mas_cerca_de_la_V: +sMin.toFixed(2), final: serie[serie.length - 1], err_mJ: +(b.error * 1000).toFixed(2), serie };
}
const R = [corre(base, 'libre'), corre({ ...base, pegada: true }, 'pegada'), corre({ ...base, mb: 0.0001 }, 'sin bola')];
require('fs').writeFileSync(require('path').join(__dirname, 'compara.json'), JSON.stringify(R));
R.forEach(r => { const { serie, ...x } = r; console.log(JSON.stringify(x)); });
