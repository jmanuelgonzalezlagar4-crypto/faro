// Lo que sobra contando solo desde los 0,1 s: un aparato de más del 100 % tiene que seguir ganando energía después
// del arranque. Lo que aparece de golpe al empezar (piezas que el banco encaja o separa en el primer paso) no cuenta.
// Uso: node despues.js resultados2.jsonl semilla [rend mínimo] [parte partes]
const fs = require('fs'), path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
const [file, seed, min, parte, partes] = [process.argv[2], +process.argv[3], +(process.argv[4] || 100.5), +(process.argv[5] || 0), +(process.argv[6] || 1)];
const R = fs.readFileSync(path.join(__dirname, file), 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.rend >= min).sort((a, b) => b.rend - a.rend);
R.filter((_, i) => i % partes === parte).forEach(r => {
  const out = { fam: r.fam, n: r.n, ej: r.ej, rend: r.rend };
  for (const div of [1, 8]) {
    const d = diseno(r.fam, seed, r.n); if (div > 1) { d.dt = 1 / (480 * div); d.iters = 120; }
    const info = P.build(d), w = info.world, L = w.ledger; let ref = null, mx = 0, tmx = 0, esc = 0.01; const steps = Math.round(10 / w.dt);
    for (let i = 1; i <= steps; i++) { w.step(); const b = w.balance(), exc = -b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn; esc = Math.max(esc, b.e.K, b.inflow, b.outflow);
      if (ref == null && w.t >= 0.1) ref = exc; if (ref != null && exc - ref > mx) { mx = exc - ref; tmx = w.t; } }
    out['tras01_' + div] = +(100 * (1 + mx / esc)).toFixed(3); out['sobra_tras01_mJ_' + div] = +(mx * 1000).toFixed(2); out['a_los_s_' + div] = +tmx.toFixed(2);
  }
  console.log(JSON.stringify(out));
});
