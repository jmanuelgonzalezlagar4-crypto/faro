const E = require('./engine.js');
global.PerpetuumEngine = E;
const Bd = require('./build.js');
function run(name, d, secs, opts={}) {
  const info = Bd.build(d);
  const w = info.world;
  const t0 = Date.now();
  const steps = Math.round(secs / w.dt);
  let report = [];
  for (let i = 1; i <= steps; i++) {
    w.step();
    if (i % Math.round((opts.every||5) / w.dt) === 0) {
      const b = w.balance();
      report.push(`t=${w.t.toFixed(1)} E=${(b.e.E - w.ledger.E0).toFixed(3)} K=${b.e.K.toFixed(3)} res=${b.reserve.toFixed(3)} axle=${b.axle.toFixed(3)} rub=${b.rub.toFixed(3)} hits=${b.hits.toFixed(3)} air=${b.air.toFixed(3)} gen=${b.gen.toFixed(3)} err=${b.error.toFixed(4)} stop=${w.isStopped()}`);
    }
    if (w.isStopped() && opts.untilStop) { break; }
  }
  const b = w.balance();
  console.log(`== ${name}: ${(Date.now()-t0)}ms for ${w.t.toFixed(1)}s, bodies=${w.bodies.length} joints=${w.joints.length}`);
  report.forEach(r => console.log('  ' + r));
  console.log(`  final t=${w.t.toFixed(2)} stopped=${w.isStopped()} err=${b.error.toFixed(4)} reserve=${b.reserve.toFixed(3)}`);
  return info;
}
const which = process.argv[2] || 'all';
for (const k of Object.keys(Bd.EXAMPLES)) {
  if (which !== 'all' && which !== k) continue;
  run(k, Bd.EXAMPLES[k].make(), +(process.argv[3]||30), {every: 5});
}
