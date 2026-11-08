// Uso: node umbral.js '{"m":0.45,"H":3,"sobre":0}'
// golpe mínimo, entero a la bola del hueco, para meterla, según el alto del agua y el peso de las bolas
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2]);
function prueba(J) {
  const d = require('./modelo-ajustable.js')(P, Object.assign({ nf: 0 }, o));
  d.parts = d.parts.filter(p => !(p.kind === 'ball' && p.x < 0.11));
  const info = P.build(d), w = info.world;
  const plug = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]).sort((a, b) => a.x - b.x)[0];
  for (let i = 0; i < 480; i++) w.step();
  plug.vx = -Math.sqrt(2 * J / plug.m);
  while (w.t < 5) { w.step(); if (plug.x < 0.06) return true; }
  return false;
}
let lo = 0.1, hi = 10; while (!prueba(hi)) hi *= 2;
for (let k = 0; k < 12; k++) { const m = (lo + hi) / 2; if (prueba(m)) hi = m; else lo = m; }
console.log(JSON.stringify({ m: o.m, H: o.H, golpe: +hi.toFixed(2), despacio: +(1000 * 9.81 * 4 / 3 * Math.PI * 0.05 ** 3 * (o.H - 0.05)).toFixed(2) }));
