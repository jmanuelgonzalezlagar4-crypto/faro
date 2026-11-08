// Uso: node barrido.js '{"m":0.45,"H":3,"sobre":0,"nf":0}' 90   (m: masa de las bolas, H: alto del agua, sobre: salida por encima del agua, nf: bolas en la fila)
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2]), T = +(process.argv[3] || 60);
const d = require('./modelo-ajustable.js')(P, o), info = P.build(d), w = info.world;
const balls = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]);
const X1 = 0.11, st = balls.map(b => b.x < X1 ? 'in' : 'out');
let entra = 0, salen = 0, golpes = [], vmax = balls.map(() => 0), minxPlug = balls[d._nt].x, mine = 0;
const t0 = Date.now();
while (w.t < T && !w.isStopped()) {
  w.step();
  balls.forEach((b, i) => {
    if (st[i] === 'out' && b.x < X1 - 0.05 && b.y < 0.3) { st[i] = 'in'; entra++; }
    else if (st[i] === 'in' && b.x > X1 + 0.06 && b.y > 0.4) { st[i] = 'out'; salen++; vmax[i] = 0; }
    if (st[i] === 'out' && b.x > 0.19 && b.vy < 0) vmax[i] = Math.max(vmax[i], -b.vy);
    if (st[i] === 'out' && b.x > 0.19 && b.vy > -0.05 && vmax[i] > 1) { golpes.push(0.5 * b.m * vmax[i] ** 2); vmax[i] = 0; }
  });
  minxPlug = Math.min(minxPlug, balls[d._nt].x);
  if (w.t % 1 < w.dt) mine = Math.min(mine, w.balance().error);
}
const b = w.balance();
const flota = (1 - o.m / (1000 * 4 / 3 * Math.PI * 0.05 ** 3)) * 100;
console.log(JSON.stringify({ m: o.m, H: o.H, sobre: o.sobre, nf: o.nf || 0, nt: d._nt, sobresale: +flota.toFixed(0), salen, entra, golpe_max: +(Math.max(0, ...golpes)).toFixed(2), caidas: golpes.length, hueco_mm: +((X1 + 0.05 - minxPlug) * 1000).toFixed(1), t: +w.t.toFixed(1), parada: w.isStopped(), gastado: +b.reserve.toFixed(2), agua: +b.water.toFixed(2), err: +b.error.toFixed(3), errmin: +mine.toFixed(3), ms: Date.now() - t0 }));
