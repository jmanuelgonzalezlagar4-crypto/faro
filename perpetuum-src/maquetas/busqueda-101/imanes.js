// Péndulos en planos separados (no se chocan): ¿lo que sobra viene de imanes que se atraviesan? Distancia mínima entre
// imanes y rendimiento con el paso normal y 8 y 32 veces más fino.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
function planos(d) { let k = 0; d.parts.filter(p => p.kind === 'pin' && p.a == null).forEach(pin => { k++; const bar = d.parts.find(p => p.id === pin.b); bar.plane = k;
  d.parts.filter(p => p.kind === 'pin' && p.a === bar.id).forEach(w => { const b = d.parts.find(q => q.id === w.b); if (b) b.plane = k; }); });
  d.parts.filter(p => p.kind === 'magnet' && !p.host).forEach(m => { m.plane = 99; }); return d; }
for (const n of process.argv.slice(2).map(Number)) for (const div of [1, 8, 32]) {
  const d = planos(diseno('pendulos', 1, n)); d.dt = 1 / (480 * div);
  const sizes = d.parts.filter(p => p.kind === 'magnet').map(m => m.size);
  const info = P.build(d), w = info.world, L = w.ledger; let maxExc = 0, escala = 0.01, dmin = 9;
  const steps = Math.round(10 / w.dt);
  for (let i = 1; i <= steps; i++) { w.step();
    for (let a = 0; a < w.magnets.length; a++) for (let b = a + 1; b < w.magnets.length; b++) { const m1 = w.magnets[a], m2 = w.magnets[b]; dmin = Math.min(dmin, Math.hypot(m1.wx - m2.wx, m1.wy - m2.wy)); }
    if (i % (12 * div) === 0) { const bl = w.balance(), exc = -bl.reserve; escala = Math.max(escala, bl.e.K, bl.inflow, bl.outflow); maxExc = Math.max(maxExc, exc); } }
  console.log(`nº ${n} · paso 1/${480 * div} s · rendimiento ${(100 * (1 + maxExc / escala)).toFixed(3)} % · sobra ${(maxExc * 1000).toFixed(2)} mJ · imanes de ${sizes.map(s => (s * 1000).toFixed(0)).join(', ')} mm · lo más cerca que pasan dos imanes: ${(dmin * 1000).toFixed(1)} mm`);
}
