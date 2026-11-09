// Clasifica los que pasan del 100,5 %:
//  1. redondeo: con un paso de cálculo 8 veces más fino baja del 100,5 %
//  2. pieza metida al empezar: lo que sobra aparece en los primeros 0,3 s y alguna pieza empieza metida 1,5 mm o más
//  3. piezas apretadas: antes de que sobre, alguna pieza se mete en otra más de 2,5 mm (el banco deja 2 mm); al
//     separarlas el banco mete energía sin apuntarla, o la apunta como golpe negativo
//  4. imanes que se atraviesan: dos imanes (o un imán y una bola de acero) pasan más cerca que la suma de sus tamaños
//  5. sin explicar: hay que mirarlo a mano
// Uso: node clasifica.js resultados2.jsonl [parte partes]
const fs = require('fs'), path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { prueba, diseno } = require('./corre.js');
const file = process.argv[2], parte = +(process.argv[3] || 0), partes = +(process.argv[4] || 1);
const R = fs.readFileSync(path.join(__dirname, file), 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.rend >= 100.5).sort((a, b) => b.rend - a.rend);
const seed = +(process.env.SEMILLA || 2);
R.filter((_, i) => i % partes === parte).forEach(r => {
  const fino = prueba(r.fam, seed, r.n, 10, 8, 120);
  const out = { fam: r.fam, n: r.n, ej: r.ej, rend: r.rend, sobra_mJ: r.sobra_mJ, rend8: fino.rend, por8: fino.por };
  if (fino.rend != null && fino.rend < 100.5) { out.que = 'redondeo'; return console.log(JSON.stringify(out)); }
  const d = diseno(r.fam, seed, r.n), info = P.build(d), w = info.world, L = w.ledger;
  const metido0 = Math.max(0, ...w.findContacts().filter(c => !(c.A.isStatic && c.B.isStatic)).map(c => -c.sep));
  const tam = new Map(); d.parts.filter(p => p.kind === 'magnet').forEach(p => { const m = info.magnetOf[p.id]; if (m) tam.set(m, p.size || 0.02); });
  let maxExc = 0, tExc = 0, neg = 0, negAt = 0, hPrev = 0, cruce = 0, pen = 0, penAt = 0, steps = Math.round(10 / w.dt);
  for (let i = 1; i <= steps; i++) {
    w.step();
    if (L.hits < hPrev) neg += hPrev - L.hits; hPrev = L.hits;
    for (const c of w.contacts) if (!(c.A.isStatic && c.B.isStatic) && -c.sep > pen) pen = -c.sep;
    const M = w.magnets; for (let a = 0; a < M.length; a++) for (let b = a + 1; b < M.length; b++) { const s = ((tam.get(M[a]) || 0.02) + (tam.get(M[b]) || 0.02)) / 2, dd = Math.hypot(M[a].wx - M[b].wx, M[a].wy - M[b].wy); if (dd < 0.5 * s && !(M[a].body === M[b].body)) cruce = Math.max(cruce, 1 - dd / s); }
    const exc = -w.balance().reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn;
    if (exc > maxExc) { maxExc = exc; tExc = w.t; negAt = neg; penAt = pen; }
  }
  Object.assign(out, { metido_al_empezar_mm: +(metido0 * 1000).toFixed(1), sobra_a_los_s: +tExc.toFixed(2), golpes_negativos_mJ: +(negAt * 1000).toFixed(2), metido_max_mm: +(penAt * 1000).toFixed(1), imanes_cruzados: +cruce.toFixed(2) });
  out.que = tExc < 0.5 && metido0 >= 0.0015 && penAt < 0.0025 ? 'pieza metida al empezar' : (penAt >= 0.0025 || negAt >= 0.5 * maxExc) ? 'piezas apretadas' : cruce > 0 ? 'imanes que se atraviesan' : 'sin explicar';
  console.log(JSON.stringify(out));
});
