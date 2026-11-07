// Barrido de la altura de la leva: vueltas y tiempo hasta pararse, desde el mismo empujón.
const path = process.argv[2] || '.';
const E = require(path + '/engine.js'); global.PerpetuumEngine = E;
const P = require(path + '/build.js');
const lifts = JSON.parse(process.argv[3]), phases = JSON.parse(process.argv[4] || '[270]'), extra = JSON.parse(process.argv[5] || '{}');
const res = [];
for (const ph of phases) for (const L of lifts) {
  const o = Object.assign(L === null ? { noCam: 1 } : { lift: L / 1000, phase: ph }, extra);
  const d = P.EXAMPLES.espiral.make(o);
  const info = P.build(d), w = info.world, hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
  for (let i = 0; i < 480 * 60; i++) { w.step(); if (w.isStopped()) break; }
  const b = w.balance();
  res.push({ lift: L, phase: ph, t: +w.t.toFixed(1), vueltas: +Math.abs((hb.a - hb.a0) / 2 / Math.PI).toFixed(1), perdida_leva: +(b.hits + b.rub).toFixed(3), err: +b.error.toFixed(4), se_para_a: Math.round(((((hb.a - hb.a0) * 180 / Math.PI) % 360) + 360) % 360) + '° (punto muerto ≈ 175°)' });
  console.log(JSON.stringify(res[res.length - 1]));
}
