// La «cuesta» que notan los imanes del cilindro al dar una vuelta, con los dos palos quietos lo más cerca (la leva abajo).
// Para cada vuelta del cilindro (de medio grado en medio grado) se mira la energía de los imanes: donde sube, el cilindro
// tiene que empujar; donde baja, los imanes le empujan a él. Uso: node perfil.js [salida.json]
const J = require('./juntos.js');
const E = require('../../app/engine.js'), P = require('../../app/build.js');
const DEG = Math.PI / 180;
function perfil(o) {
  const d = J.rodillo(Object.assign({ ideal: true }, o)), info = P.build(d), w = info.world;
  const whp = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam'), hb = info.bodyOf[whp.id];
  // los palos: lleva cada uno a la altura con la leva abajo (imán a GAP = 4 mm de la cara de los imanes)
  const ds = o.bloque ? 0 : (o.ds || 0.011), rs = whp.r + ds / 2 + 0.004 + 0.003;
  w.updateMagnetPoses();
  const palos = new Set(w.magnets.filter(m => m.body !== hb && m.body !== w.ground).map(m => m.body));
  for (const b of palos) {
    const m = w.magnets.find(q => q.body === b), s = Math.sign(m.wy - hb.y);
    b.y += (hb.y + s * rs) - m.wy; b.updateWorld();
  }
  const U = [];
  for (let th = 0; th < 360; th += 0.5) {
    hb.a = hb.a0 - th * DEG; hb.updateWorld(); w.updateMagnetPoses();
    U.push([th, w.magnetEnergy() * 1000]);
  }
  const u = U.map(p => p[1]), lo = Math.min(...u), hi = Math.max(...u);
  // par (lo que frena o empuja): −dU/dθ, en mN·m
  let pmax = 0, pmin = 0;
  for (let i = 0; i < U.length; i++) { const a = U[(i + U.length - 1) % U.length][1], b = U[(i + 1) % U.length][1], t = -(b - a) / (1 * DEG); pmax = Math.max(pmax, t); pmin = Math.min(pmin, t); }
  return { o, cuesta_mJ: +(hi - lo).toFixed(2), frena_mNm: +(-pmin).toFixed(1), empuja_mNm: +pmax.toFixed(1), U: U.map(p => [p[0], +(p[1] - lo).toFixed(3)]) };
}
if (require.main === module) {
  const out = [];
  const casos = process.argv.includes('bloques') ? J.BLOQUES.filter(c => !c[1].sin).map(c => c[1]) : [9, 12, 15, 18].map(pasos => ({ pasos }));
  process.argv = process.argv.filter(a => a !== 'bloques');
  for (const o of casos) {
    const r = perfil(o), U = r.U.map(p => p[1]), n = U.length, w = Math.round(180 / o.pasos / 0.5);
    // la cuesta de la flecha (la media de cada paso) y los baches de imán a imán
    const lento = U.map((_, i) => { let s = 0; for (let j = 0; j < w; j++) s += U[(i + j - (w >> 1) + n) % n]; return s / w; });
    r.flecha_mJ = +(Math.max(...lento) - Math.min(...lento)).toFixed(2);
    let b = 0; for (let i = 0; i + w <= n; i++) { const t = U.slice(i, i + w); b = Math.max(b, Math.max(...t) - Math.min(...t)); }
    r.baches_mJ = +b.toFixed(2); out.push(r);
    console.log(`${o.pasos} pares${o.bloque ? ' (bloques ' + o.bloque.w * 1000 + ' mm en la vuelta)' : ''}: cuesta ${r.cuesta_mJ} mJ (flecha ${r.flecha_mJ}, baches ${r.baches_mJ}), ` +
      `frena como mucho ${r.frena_mNm} mN·m, empuja como mucho ${r.empuja_mNm} mN·m`);
  }
  if (process.argv[2]) require('fs').writeFileSync(process.argv[2], JSON.stringify(out));
}
module.exports = { perfil };
