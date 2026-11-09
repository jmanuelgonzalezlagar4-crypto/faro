// Los balancines que pasaban del 100,1 %: los mismos, con los escalones y el suelo 4 mm más abajo para que ninguna
// pieza empiece metida en ellos. Si lo que sobraba venía de separarlas, tiene que desaparecer.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
function corre(d) { const info = P.build(d), w = info.world, L = w.ledger; let mx = 0, esc = 0.01; const steps = Math.round(10 / w.dt);
  for (let i = 1; i <= steps; i++) { w.step(); if (i % 12 === 0) { const b = w.balance(), exc = -b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn; esc = Math.max(esc, b.e.K, b.inflow, b.outflow); mx = Math.max(mx, exc); } }
  const sep0 = Math.min(0, ...P.build(d).world.findContacts().filter(c => !(c.A.isStatic && c.B.isStatic)).map(c => c.sep));
  return { rend: (100 * (1 + mx / esc)).toFixed(3), sobra: (mx * 1000).toFixed(2), metido: (-sep0 * 1000).toFixed(1) }; }
for (const n of [1975, 284, 485, 1175, 156]) {
  const a = corre(diseno('balancin', 1, n)), d = diseno('balancin', 1, n); d.parts.filter(p => p.kind === 'ramp').forEach(p => { p.y1 -= 0.004; p.y2 -= 0.004; }); const b = corre(d);
  console.log(`balancín ${n}: tal cual ${a.rend} % (sobra ${a.sobra} mJ, empieza metido ${a.metido} mm) · con los escalones 4 mm más abajo ${b.rend} % (sobra ${b.sobra} mJ, metido ${b.metido} mm)`);
}
