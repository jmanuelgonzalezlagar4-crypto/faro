// Uso: node fila-perfecta.js            (empuje mínimo para que entre sola)
//      node fila-perfecta.js '{"F":48.5,"kick":1}'   (un empuje de F newtons y un golpe de kick julios)
// La fila perfecta: la bola del hueco recibe un empuje fijo igual al peso de la fila (sin curva ni roces que se
// coman nada) y, si se pide, un golpe entero de la bola que cae. El trabajo del empuje se apunta como entrada.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
function prueba(F, kick, o) {
  const d = require('./modelo-ajustable.js')(P, Object.assign({ nt: 0, H: 1, sobre: 0, m: 0.247 }, o));
  d.parts = d.parts.filter(p => !(p.kind === 'ball' && p.x > 0.2));          // solo la bola del hueco
  const info = P.build(d), w = info.world, L = w.ledger;
  const plug = info.bodyOf[d.parts.find(p => p.kind === 'ball').id];
  const f0 = w._forces;
  w._forces = function () { f0.call(this); plug.fx -= F; };                 // el empuje de la fila, hacia dentro
  let xp = plug.x, minx = plug.x, entra = false;
  const paso = () => { w.step(); L.battery += F * (xp - plug.x); xp = plug.x; minx = Math.min(minx, plug.x); };
  while (w.t < 1.5) paso();                                                  // se queda donde el empuje y el agua se igualan
  const xeq = plug.x;
  if (kick) { plug.vx = -Math.sqrt(2 * kick / plug.m + plug.vx * plug.vx); L.battery += kick; }   // el golpe, apuntado como entrada
  while (w.t < 5) { paso(); if (plug.x < 0.06) { entra = true; break; } }
  return { eq_mm: +((0.16 - xeq) * 1000).toFixed(1), max_mm: +((0.16 - minx) * 1000).toFixed(1), entra, err: +w.balance().error.toFixed(3) };
}
module.exports = prueba;
if (require.main === module) {
  const o = JSON.parse(process.argv[2] || '{}');
  if (o.F != null) console.log(JSON.stringify(Object.assign({ F: o.F, kick: o.kick || 0 }, prueba(o.F, o.kick || 0, o))));
  else {
    // empuje mínimo para que entre sola
    let lo = 10, hi = 120; for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (prueba(m, 0, o).entra) hi = m; else lo = m; }
    console.log('empuje mínimo para que entre sola, sin golpe:', hi.toFixed(1), 'N');
  }
}
