// Cuánto dura cada aparato en condiciones reales (con rozamiento y aire): hasta que el banco lo da por parado.
// También vigila que no aparezca energía de más (si aparece, el aparato se marca y no cuenta).
// Uso: node dura.js resultadosX.jsonl semilla Tmax [parte partes]
const fs = require('fs'), path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
const [file, seed, Tmax, parte, partes] = [process.argv[2], +process.argv[3], +(process.argv[4] || 60), +(process.argv[5] || 0), +(process.argv[6] || 1)];
const lista = process.env.LISTA ? JSON.parse(fs.readFileSync(process.env.LISTA, 'utf8')) : null;
const R = lista || fs.readFileSync(path.join(__dirname, file), 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.rend != null);
R.filter((_, i) => i % partes === parte).forEach(r => {
  let d; try { d = diseno(r.fam, r.seed || seed, r.n); } catch (e) { return; }
  d.ideal = false; d.air = true;
  let info; try { info = P.build(d); } catch (e) { return; }
  const w = info.world, L = w.ledger, E0 = w.energy().E; let ref = null, exc = 0, Kmax = 0, sale = false, quieto = 0, escala = 0.01;
  // parado: lo dice el banco, o se mueve con menos de 0,1 mJ durante 2 s. Se sale: alguna pieza cae fuera de la mesa.
  while (w.t < Tmax && !w.isStopped() && quieto < 2) {
    w.step();
    if (((w.t * 480) | 0) % 24 === 0) { const b = w.balance(), x = -b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn; if (ref == null && w.t >= 0.1) ref = x; if (ref != null) exc = Math.max(exc, x - ref); Kmax = Math.max(Kmax, b.e.K); escala = Math.max(escala, b.e.K, b.inflow, b.outflow);
      quieto = b.e.K < Math.max(0.0001, 0.001 * Kmax) ? quieto + 24 * w.dt : 0;
      if (w.bodies.some(q => !q.isStatic && q.y < -0.6)) { sale = true; break; } }
  }
  const b = w.balance();
  console.log(JSON.stringify({ fam: r.fam, seed: r.seed || seed, n: r.n, ej: r.ej, dura: +w.t.toFixed(1), parado: w.isStopped() || quieto >= 2, sale, trampa: exc > 0.01 * escala, sobra_mJ: +(exc * 1000).toFixed(2), K_mJ: +(b.e.K * 1000).toFixed(1), Kmax_mJ: +(Kmax * 1000).toFixed(1), E0_J: +E0.toFixed(3) }));
});
