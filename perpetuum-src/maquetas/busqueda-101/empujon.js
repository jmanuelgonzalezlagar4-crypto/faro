// Para los que pasan del 101 %: mide cuánta energía mete el banco al separar piezas apretadas (cuando corrige las
// posiciones después de cada paso, sube o baja las piezas sin apuntarlo) y lo compara con lo que «sobra».
// También prueba los péndulos cada uno en su propio plano, como si estuvieran uno detrás de otro y no pudieran chocar.
const fs = require('fs'), path = require('path');
const A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
// contar lo que cambian la gravedad y los muelles cuando el banco corrige posiciones
const orig = E.World.prototype.correctContacts, origJ = E.World.prototype.correctJoint;
E.World.prototype.correctContacts = function (C, beta) { const u0 = this.gravityPE() + this.springPE(); const r = orig.call(this, C, beta); this._fix = (this._fix || 0) + (this.gravityPE() + this.springPE() - u0); return r; };
function corre(d, T) {
  const info = P.build(d), w = info.world; w._fix = 0; const L = w.ledger; let maxExc = 0, fixAt = 0, escala = 0.01;
  const steps = Math.round(T / w.dt);
  for (let i = 1; i <= steps; i++) { w.step(); if (i % 12 === 0) { const b = w.balance(), exc = -b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn;
    escala = Math.max(escala, b.e.K, b.inflow, b.outflow); if (exc > maxExc) { maxExc = exc; fixAt = w._fix; } } }
  return { rend: +(100 * (1 + maxExc / escala)).toFixed(3), sobra_mJ: +(maxExc * 1000).toFixed(2), empujon_mJ: +(fixAt * 1000).toFixed(2) };
}
function planos(d) { let k = 0; d.parts.filter(p => p.kind === 'pin' && p.a == null).forEach(pin => { k++; const bar = d.parts.find(p => p.id === pin.b); bar.plane = k;
  d.parts.filter(p => p.kind === 'pin' && p.a === bar.id).forEach(w => { const b = d.parts.find(q => q.id === w.b); if (b) b.plane = k; }); });
  d.parts.filter(p => p.kind === 'magnet' && !p.host).forEach(m => { m.plane = 99; }); return d; }
const R = fs.readFileSync(path.join(__dirname, 'resultados.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.rend >= 101).sort((a, b) => b.rend - a.rend);
R.forEach(r => {
  const a = corre(diseno(r.fam, 1, r.n), 10), out = { fam: r.fam, n: r.n, ej: r.ej, rend: a.rend, sobra_mJ: a.sobra_mJ, empujon_mJ: a.empujon_mJ };
  if (r.fam === 'pendulos') { const b = corre(planos(diseno(r.fam, 1, r.n)), 10); out.rend_planos = b.rend; out.sobra_planos_mJ = b.sobra_mJ; }
  console.log(JSON.stringify(out));
});
