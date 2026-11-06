const E = require('./engine.js'); global.PerpetuumEngine = E;
const Bd = require('./build.js');
function guard(w) { const b = w.balance(); const scale = Math.max(Math.abs(b.inflow), b.outflow, 0.01); return b.error < -Math.max(0.05, 0.05 * scale); }
for (const k of Object.keys(Bd.EXAMPLES)) for (const ideal of [false, true]) {
  const d = Bd.EXAMPLES[k].make(); d.ideal = ideal;
  if (k === 'pendulo') { d.parts.find(p => p.kind === 'pin' && p.mode !== 'rigid').gen = ideal ? 0.05 : 0; }
  const w = Bd.build(d).world; let tripped = null, minErr = 0;
  for (let i = 0; i < 480 * 120; i++) { w.step(); if (i % 48 === 0) { const b = w.balance(); minErr = Math.min(minErr, b.error); if (!tripped && guard(w)) tripped = w.t.toFixed(1); } }
  console.log(k.padEnd(8), ideal ? 'ideal' : 'real ', 'tripped:', tripped, 'minErr', minErr.toFixed(4), 'final err', w.balance().error.toFixed(4), 'gen', w.balance().gen.toFixed(3));
}
