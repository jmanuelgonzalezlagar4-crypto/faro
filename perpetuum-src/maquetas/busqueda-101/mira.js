// Mira por dentro un aparato: sus piezas y cómo cambia cada tipo de energía.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
const [fam, n, T, div] = [process.argv[2], +process.argv[3], +(process.argv[4] || 10), +(process.argv[5] || 1)];
const d = diseno(fam, 1, n); if (div > 1) d.dt = 1 / (480 * div);
console.log(d.parts.map(p => p.kind + (p.shape ? ':' + p.shape : '') + (p.mode ? ':' + p.mode : '') + (p.solid === false ? ':nosólido' : '') + (p.k ? ':k' + p.k.toFixed(0) : '') + (p.size ? ':' + (p.size * 1000).toFixed(0) + 'mm' : '')).join(' '));
const info = P.build(d), w = info.world, e0 = w.energy();
let next = 0;
while (w.t < T) { w.step(); if (w.t + 1e-9 >= next) { next += T / 10; const e = w.energy(), b = w.balance();
  console.log(w.t.toFixed(1), 's · K', (e.K * 1000).toFixed(1), '· grav', ((e.Pg - e0.Pg) * 1000).toFixed(1), '· muelles', ((e.Ps - e0.Ps) * 1000).toFixed(1), '· imanes', ((e.Pm - e0.Pm) * 1000).toFixed(1), '· total', ((e.E - e0.E) * 1000).toFixed(1), 'mJ · golpes', (b.hits * 1000).toFixed(1), 'roces', (b.rub * 1000).toFixed(1), 'muelles(fren)', (b.springs * 1000).toFixed(1), 'pila', (b.battery * 1000).toFixed(1)); } }
