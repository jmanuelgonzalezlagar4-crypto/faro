// Sigue una variante que da una vuelta: energía de la bola (movimiento + altura + imán) cada vez que pasa por el pie de la rampa.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2]);
const d = require('./wilkins-foto.js')(P, o); d.dt = 1 / 1920; const info = P.build(d), w = info.world, k = d._k, b = info.bodyOf[d._ids.bola];
if (o.v0) { const p = d.parts.find(q => q.id === d._ids.bola); b.vx = p.vx0; b.vy = p.vy0; b.w = o.v0 / p.r; w.ledger.E0 = w.energy().E; }
const E0 = w.energy(); let prev = null, marcas = [];
const x = () => b.x / k;
while (w.t < 20) { w.step(); const xx = x();
  if (prev != null && ((prev > 1500 && xx <= 1500) || (prev < 1000 && xx >= 1000) )) { const e = w.energy(); marcas.push(`${w.t.toFixed(2)} s ${xx <= 1500 && prev > 1500 ? "pasa por x=1500 hacia arriba" : "pasa por x=1000 hacia abajo"} · energía ${((e.E - E0.E) * 1000).toFixed(0)} mJ respecto al principio (movimiento ${(e.K * 1000).toFixed(0)} mJ)`); }
  prev = xx; }
console.log(marcas.slice(0, 12).join("\n")); const b2 = w.balance(); console.log("golpes", (b2.hits*1000).toFixed(0), "mJ · roces", ((b2.rub+b2.axle+b2.air)*1000).toFixed(0), "mJ · error", (b2.error*1000).toFixed(1), "mJ");
