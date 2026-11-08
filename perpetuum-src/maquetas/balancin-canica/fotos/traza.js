const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(require('fs').existsSync(process.argv[2]) ? require('fs').readFileSync(process.argv[2], 'utf8') : (process.argv[2] || '{}'));
const d = require('./real.js')(P, o), info = P.build(d), w = info.world;
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball], ramp = info.bodyOf[d._ids.ramp], th0 = d._o.th0;
const hl = lev.toLocal(d._B[0], d._B[1]);
let next = 0, out = [];
while (w.t < +(process.argv[3] || 5)) { w.step(); if (w.t + 1e-9 >= next) { next += +(process.argv[4] || 0.1); const hp = lev.toWorld(hl.x, hl.y);
  out.push([+w.t.toFixed(2), +(th0 + (lev.a - lev.a0) * 180 / Math.PI).toFixed(1), +((ramp.a - ramp.a0 - lev.a + lev.a0) * 180 / Math.PI).toFixed(0), +(Math.hypot(ball.x - hp.x, ball.y - hp.y) / d._o.Lr).toFixed(2)]); } }
console.log(out.map(r => r.join(' ')).join(' | '));
const b = w.balance(); console.log('error', (b.error*1000).toFixed(2), 'mJ; gastado', (b.reserve*1000).toFixed(1), 'golpes', (b.hits*1000).toFixed(1), 'roces', ((b.rub+b.axle+b.air)*1000).toFixed(1));
