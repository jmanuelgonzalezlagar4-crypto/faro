// ¿Cuándo aparece la energía de más y qué se está tocando en ese momento?
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
const [fam, n, T, planos] = [process.argv[2], +process.argv[3], +(process.argv[4] || 1.5), process.argv[5] === 'planos'];
const d = diseno(fam, 1, n);
if (planos) { // cada péndulo en su propio plano: no se pueden chocar entre ellos (como si estuvieran uno detrás de otro)
  let k = 0; const pins = d.parts.filter(p => p.kind === 'pin' && p.a == null);
  pins.forEach(pin => { k++; const bar = d.parts.find(p => p.id === pin.b); bar.plane = k; d.parts.filter(p => p.kind === 'pin' && p.a === bar.id).forEach(w => { const b = d.parts.find(q => q.id === w.b); if (b) b.plane = k; }); });
}
const info = P.build(d), w = info.world, E0 = w.energy().E, nm = id => { const p = d.parts.find(q => info.bodyOf[q.id] === id); return p ? p.kind : '?'; };
let next = 0, prev = 0;
while (w.t < T) {
  w.step();
  const hondo = w.contacts.filter(c => !(c.A.isStatic && c.B.isStatic)).reduce((m, c) => Math.max(m, -c.sep), 0);
  if (w.t + 1e-9 >= next) { next += 0.05; const g = (w.energy().E - E0) * 1000;
    console.log(w.t.toFixed(2), 's · energía de más', g.toFixed(1), 'mJ (', (g - prev >= 0 ? '+' : '') + (g - prev).toFixed(1), ') · lo más metido', (hondo * 1000).toFixed(1), 'mm · contactos', w.contacts.filter(c => !(c.A.isStatic && c.B.isStatic)).length); prev = g; }
}
