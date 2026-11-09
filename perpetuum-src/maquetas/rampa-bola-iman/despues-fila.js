// Las rampas con fila de imanes que pasaban del 100,5 %: lo que sobra contando solo desde los 0,1 s (lo que aparece al
// arrancar, con la bola lanzada dentro del campo de los imanes, no cuenta), con el paso normal y uno 16 veces más fino.
// Uso: node despues-fila.js > despues-fila.jsonl
const fs = require('fs'), path = require('path'), { monta } = require('./rampa.js');
const R = fs.readFileSync(path.join(__dirname, 'barrido-fila.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.valido && r.rend > 100.5);
for (const r of R) {
  const out = { n: r.n, rend: r.rend };
  for (const div of [4, 64]) {
    const S = monta(Object.assign({}, r.o, { div })), w = S.w; let ref = null, mx = 0, esc = 0.01, mx0 = 0;
    while (w.t < 30) { w.step(); const b = w.balance(), ex = -b.reserve; esc = Math.max(esc, b.e.K, b.inflow, b.outflow); mx0 = Math.max(mx0, ex);
      if (ref == null && w.t >= 0.1) ref = ex; if (ref != null) mx = Math.max(mx, ex - ref); }
    out['sobra_arranque_mJ_' + div] = +(mx0 * 1000).toFixed(3); out['sobra_tras01_mJ_' + div] = +(mx * 1000).toFixed(4); out['tras01_' + div] = +(100 * (1 + mx / esc)).toFixed(4);
  }
  console.log(JSON.stringify(out));
}
