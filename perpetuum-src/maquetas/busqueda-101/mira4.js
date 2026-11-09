// La palanca nº 1061 de la cuarta tanda (semilla 4), la única que seguía ganando algo después de los 0,1 s con el paso
// fino: una bola de acero empieza apretada entre la curva y los raíles. Se prueba tal cual, sin esa bola, con los
// raíles 4 mm más abajo y con la bola 3 mm más a la derecha, con un paso 8 veces más fino.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
function run(tag, f) {
  const d = diseno('palancaCurva', 4, 1061); f(d); d.dt = 1 / 3840; d.iters = 120; const info = P.build(d), w = info.world, L = w.ledger;
  const ex = () => { const q = w.balance(); return -q.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn; };
  let mx = 0, tmx = 0; while (w.t < 10) { w.step(); const e = ex(); if (e > mx) { mx = e; tmx = w.t; } }
  console.log(JSON.stringify({ caso: tag, sobra_mJ: +(mx * 1000).toFixed(3), a_los_s: +tmx.toFixed(2) }));
}
const acero = d => d.parts.find(p => p.kind === 'ball' && p.mat === 'acero');
run('tal cual', () => {});
run('sin la bola de acero', d => { const b = acero(d); d.parts = d.parts.filter(p => p !== b); });
run('raíles 4 mm más abajo', d => { const r = d.parts.filter(p => p.kind === 'ramp')[1]; r.y1 -= 0.004; r.y2 -= 0.004; acero(d).y -= 0.004; });
run('bola 3 mm a la derecha', d => { acero(d).x += 0.003; });
