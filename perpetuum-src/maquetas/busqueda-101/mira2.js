// Mira por dentro un aparato de las familias nuevas: piezas, y cada tipo de energía alrededor del momento en que sobra.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
const [fam, seed, n, T, cada] = [process.argv[2], +process.argv[3], +process.argv[4], +(process.argv[5] || 2), +(process.argv[6] || 0.1)];
const d = diseno(fam, seed, n);
console.log(d.parts.map(p => p.kind + (p.shape ? ':' + p.shape + (p.emode ? ':' + p.emode : '') : '') + (p.style ? ':' + p.style : '') + (p.mode ? ':' + p.mode : '') + (p.gen ? ':gen' : '') + (p.motor ? ':motor' : '') + (p.solid === false ? ':nosólido' : '') + (p.k ? ':k' + p.k.toFixed(0) : '') + (p.rpm ? ':' + p.rpm + 'rpm' : '')).join(' '));
const info = P.build(d), w = info.world, e0 = w.energy(), L = w.ledger;
let next = 0;
while (w.t < T) { w.step(); if (w.t + 1e-9 >= next) { next += cada; const e = w.energy(), b = w.balance(), exc = -b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn;
  console.log(w.t.toFixed(3), 'de más', (exc * 1000).toFixed(2), '· K', (e.K * 1000).toFixed(1), 'grav', ((e.Pg - e0.Pg) * 1000).toFixed(1), 'muelles', ((e.Ps - e0.Ps) * 1000).toFixed(1), 'imanes', ((e.Pm - e0.Pm) * 1000).toFixed(1),
    '· acumulador', (L.bus * 1000).toFixed(1), 'pila', (L.battery * 1000).toFixed(1), 'gen', (L.gen * 1000).toFixed(1), 'calor', (L.heat * 1000).toFixed(1), 'golpes', (L.hits * 1000).toFixed(1), 'roce', (L.rub * 1000).toFixed(1), 'muelles(fren)', (L.springs * 1000).toFixed(1)); } }
