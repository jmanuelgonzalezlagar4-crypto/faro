// De la maqueta del usuario a la máquina más eficiente, paso a paso, con el mismo empujón (150 rpm).
const path = process.argv[2] || '.';
const E = require(path + '/engine.js'); global.PerpetuumEngine = E;
const P = require(path + '/build.js');
const DEG = Math.PI / 180;
function run(name, d) {
  const info = P.build(d), w = info.world, hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam').id];
  for (let i = 0; i < 480 * 300; i++) { w.step(); if (w.isStopped()) break; }
  const b = w.balance(), useful = b.bus + b.gridOut, spent = Math.max(0, b.reserve) + b.hand + b.battery + b.gridIn;
  console.log(name.padEnd(44), '| vueltas', Math.abs((hb.a - hb.a0) / 2 / Math.PI).toFixed(1).padStart(6), '| tiempo', w.t.toFixed(1).padStart(6), 's | energía', spent.toFixed(3), 'J | electricidad', useful.toFixed(3), 'J | eficiencia', (useful / spent * 100).toFixed(1), '% | err', b.error.toFixed(4));
}
const noRotor = d => { const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam'); d.parts = d.parts.filter(p => !(p.kind === 'magnet' && p.host === wh.id)); return d; };
const noLever = d => { const keep = new Set(); const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam');
  d.parts = d.parts.filter(p => p.kind === 'ramp' || p.id === wh.id || (p.kind === 'magnet' && p.host === wh.id)); return d; };
const uniform = d => { const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam');
  d.parts.filter(p => p.kind === 'magnet' && p.host === wh.id).forEach((m, k) => { const th = k * 30 * DEG, r = 0.054; m.x = wh.x + r * Math.cos(th); m.y = wh.y + r * Math.sin(th); m.ang = k * 30; }); return d; };
const gen = (d, g) => { const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam'); wh.gen = g; wh.gdest = 'bus'; return d; };
run('1. Tu cilindro (leva de 2 mm)', P.EXAMPLES.espiral.make());
run('2. Sin la leva', P.EXAMPLES.espiral.make({ noCam: 1 }));
run('3. Sin leva, imanes del cilindro en círculo', uniform(P.EXAMPLES.espiral.make({ noCam: 1 })));
run('4. Sin la barra ni su imán', noLever(P.EXAMPLES.espiral.make({ noCam: 1 })));
run('5. Solo el cilindro, sin imanes', noRotor(noLever(P.EXAMPLES.espiral.make({ noCam: 1 }))));
for (const g of [0.001, 0.005, 0.02, 0.1]) run('6. Cilindro con generador ' + g + ' N·m·s', gen(noRotor(noLever(P.EXAMPLES.espiral.make({ noCam: 1 }))), g));
