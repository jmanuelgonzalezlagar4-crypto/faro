// Catarata de bolas: el mejor caso posible para el golpe.
// Se quitan las bolas del tanque y se le da a la bola del hueco, de una vez, toda la energía del golpe,
// como si la fila de bolas la transmitiera entera sin perder nada. Se mira cuánto entra y qué golpe hace falta.
// Uso: node golpe.js            (desde esta carpeta)
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');

function prueba(J) {
  const d = P.EXAMPLES.catarata.make({});
  d.parts = d.parts.filter(p => !(p.kind === 'ball' && p.x < 0.11));   // fuera las bolas de dentro del tanque
  const info = P.build(d), w = info.world;
  const plug = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]).sort((a, b) => a.x - b.x)[0];
  for (let i = 0; i < 480; i++) w.step();          // un segundo para que se asiente la fila
  plug.vx = -Math.sqrt(2 * J / plug.m);
  let minx = plug.x, entra = false;
  while (w.t < 4) { w.step(); minx = Math.min(minx, plug.x); if (plug.x < 0.11 - 0.05) { entra = true; break; } }
  return { mm: (0.16 - minx) * 1000, entra };
}

[0.47, 0.61, 0.84, 1.5].forEach(J => {
  const r = prueba(J);
  console.log(`golpe de ${J.toFixed(2)} J → la bola del hueco entra ${r.mm.toFixed(1)} mm de 100${r.entra ? ' · ENTRA' : ' · el agua la echa'}`);
});
let lo = 0.84, hi = 8;
for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (prueba(m).entra) hi = m; else lo = m; }
console.log('golpe mínimo para meterla:', hi.toFixed(2), 'J');
