// Rodillo de flechas: la maqueta del usuario, la versión mejorada y el mismo cilindro solo (sin imanes ni leva),
// con el mismo empujón. Saca las vueltas, el tiempo, a dónde va la energía y la velocidad (para la gráfica).
// Uso: node flechas.js [rpm] [salida.json]
const E = require('./engine.js'); global.PerpetuumEngine = E;
const P = require('./build.js');
const rpm0 = +(process.argv[2] || 300);
function solo() {
  const d = P.EXAMPLES.flechas.make({ rpm: rpm0 });
  const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam'), cam = d.parts.find(p => p.style === 'cam');
  const keep = new Set([wh.id, cam.id]);
  d.parts = d.parts.filter(p => keep.has(p.id) || (p.kind === 'pin' && p.b === cam.id) || (p.kind === 'ramp'));
  return d;
}
const casos = [['Tu rodillo', P.EXAMPLES.flechas.make({ rpm: rpm0 })], ['Mejorado', P.EXAMPLES.flechas2.make({ rpm: rpm0 })], ['Cilindro solo', solo()]];
const out = [];
for (const [name, d] of casos) {
  const info = P.build(d), w = info.world, hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
  const serie = [[0, rpm0]];
  let next = 0.05;
  while (w.t < 600 && !w.isStopped()) { w.step(); if (w.t >= next) { serie.push([+w.t.toFixed(2), +(-hb.w * 60 / 2 / Math.PI).toFixed(1)]); next += 0.05; } }
  const b = w.balance();
  const r = { name, t: +w.t.toFixed(1), vueltas: +(-(hb.a - hb.a0) / 2 / Math.PI).toFixed(1), energia: +(b.reserve).toFixed(3),
    ejes: +b.axle.toFixed(3), golpes: +b.hits.toFixed(3), roce: +b.rub.toFixed(3), aire: +b.air.toFixed(3), err: +b.error.toFixed(4), serie };
  out.push(r);
  console.log(`${name.padEnd(14)} parada a ${r.t} s · ${r.vueltas} vueltas · gastó ${r.energia} J: ejes ${r.ejes}, golpes ${r.golpes}, roce ${r.roce}, aire ${r.aire} · error ${r.err}`);
}
if (process.argv[3]) require('fs').writeFileSync(process.argv[3], JSON.stringify(out));
