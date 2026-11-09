const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')), T = +(process.argv[3] || 5);
const d = require('./ciclo3.js')(P, o), info = P.build(d), w = info.world;
const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball], th0 = d._th0, hl = lev.toLocal(d._B[0], d._B[1]);
let next = 0;
while (w.t < T) { w.step(); if (w.t >= next) { const hp = lev.toWorld(hl.x, hl.y); console.log(w.t.toFixed(2), 's · palo', (th0 + (lev.a - lev.a0) * 180 / Math.PI).toFixed(1) + '°', '· bola a', (Math.hypot(ball.x - hp.x, ball.y - hp.y) / o.L * 100).toFixed(0) + '% de la rampa (0 = V, 100 = punta)'); next += 0.2; } }
