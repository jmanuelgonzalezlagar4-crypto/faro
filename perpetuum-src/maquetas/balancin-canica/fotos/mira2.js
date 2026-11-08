const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 3);
const d = require('./real2.js')(P, o), info = P.build(d), w = info.world;
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball], ramp = info.bodyOf[d._ids.ramp];
const hl = lev.toLocal(d._B[0], d._B[1]);
console.log('solapes', JSON.stringify(info.overlaps), 'th0', d._th0.toFixed(1), 'tabla', d._tabla.toFixed(3));
let next = 0;
while (w.t < T) { w.step(); if (w.t + 1e-9 >= next) { next += 0.1; const hp = lev.toWorld(hl.x, hl.y);
  process.stdout.write(`${w.t.toFixed(1)}:${(d._th0 + (lev.a - lev.a0) * 180 / Math.PI).toFixed(1)}° b${(Math.hypot(ball.x - hp.x, ball.y - hp.y) / d._o.Lr).toFixed(2)}  `); } }
const b = w.balance(); console.log('\nerror mJ', (b.error * 1000).toFixed(2), 'gastado', (b.reserve * 1000).toFixed(1));
