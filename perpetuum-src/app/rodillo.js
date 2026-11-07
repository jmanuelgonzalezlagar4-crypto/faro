// Rodillo apoyado en una leva redonda que gira: ¿cuánto pierde y por qué?
const path = process.argv[2] || '.';
const E = require(path + '/engine.js'); global.PerpetuumEngine = E;
const P = require(path + '/build.js');
function scene(o) {
  const d = P.EXAMPLES.espiral.make({ lift: 0.0005, stSize: 0.0005 });   // casi redonda y sin imanes que cuenten
  d.parts = d.parts.filter(p => !(p.kind === 'magnet' && p.host && d.parts.find(q => q.id === p.host && q.kind === 'wheel' && q.style !== 'cam')));
  const roller = d.parts.find(p => p.kind === 'ball');
  if (o.rmat) roller.mat = o.rmat;
  if (o.weld) d.parts.find(p => p.kind === 'pin' && p.b === roller.id).mode = 'rigid';
  if (o.lift) { const piv = d.parts.find(p => p.kind === 'pin' && !p.a); piv.hi = -3; }   // la barra no baja: el rodillo no toca
  return d;
}
for (const o of [{}, { lift: 1 }, { weld: 1 }, { rmat: 'goma' }]) {
  const d = scene(o), info = P.build(d), w = info.world, hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
  let impacts = 0;
  const T = 4;
  for (let i = 0; i < 480 * T; i++) { const h0 = w.ledger.hits; w.step(); if (w.ledger.hits - h0 > 1e-5) impacts++; }
  const b = w.balance();
  console.log(JSON.stringify(o).padEnd(18), 'giro', (-hb.w * 60 / 2 / Math.PI).toFixed(0), 'rpm · golpes', b.hits.toFixed(4), '(', impacts, 'pasos) · roce', b.rub.toFixed(4), '· ejes', b.axle.toFixed(4), '· err', b.error.toFixed(4));
}
