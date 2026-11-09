// Los imanes solos: los dos palos sujetos lo más cerca (sin leva ni muelles). Sin rozamiento, el cilindro tiene que pasar
// cada vuelta por el mismo sitio a la misma velocidad; con roce, se mira cuántas vueltas da comparado con sin imanes.
// Uso: node quietos.js [salida.json]
const J = require('./juntos.js'), P = require('../../app/build.js');
const DEG = Math.PI / 180;
function monta(o) {
  const d = J.rodillo(o), B = o.bloque, ds = B || o.sin ? 0 : (o.ds || 0.011);
  const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam'), cam = d.parts.find(p => p.style === 'cam');
  d.parts = d.parts.filter(p => p !== cam && !(p.kind === 'pin' && p.b === cam.id) && p.kind !== 'spring');
  // palos sujetos a la pared, con su imán a 4 mm de la cara de los imanes del cilindro (la leva abajo)
  const rs = wh.r + ds / 2 + 0.004 + 0.003;
  for (const st of d.parts.filter(p => p.kind === 'magnet' && p.host !== wh.id)) {
    const s = Math.sign(st.y - wh.y), dy = (wh.y + s * rs) - st.y, bar = d.parts.find(p => p.id === st.host);
    const mueve = new Set([bar.id]);
    d.parts.forEach(p => { if (p.kind === 'pin' && mueve.has(p.a) && p.b) mueve.add(p.b); });
    d.parts.forEach(p => {
      if (p.kind === 'magnet' && mueve.has(p.host)) p.y = +(p.y + dy).toFixed(6);
      else if (mueve.has(p.id) || (p.kind === 'pin' && (mueve.has(p.b)))) {
        if ('y1' in p) { p.y1 = +(p.y1 + dy).toFixed(6); p.y2 = +(p.y2 + dy).toFixed(6); }
        if ('y' in p) p.y = +(p.y + dy).toFixed(6);
      }
    });
    const g = d.parts.find(p => p.kind === 'pin' && p.b === bar.id && !p.a); g.mode = 'rigid';
  }
  return d;
}
function corre(o, rpm, T) {
  const d = monta(Object.assign({}, o, { rpm })), info = P.build(d), w = info.world;
  const hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam').id];
  const v = () => -(hb.a - hb.a0) / 2 / Math.PI, pasos = [];
  let n = 1, gana = -Infinity;
  // un cilindro liso que gira en su sitio cuenta para el banco como parado: aquí se para cuando ya no gira
  while (w.t < T && !(w.isStopped() && Math.abs(hb.w) < 0.05)) {
    w.step(); gana = Math.max(gana, -w.balance().reserve);
    if (v() >= n) { pasos.push(+(-hb.w * 60 / 2 / Math.PI).toFixed(3)); n++; }
  }
  const b = w.balance();
  return { t: +w.t.toFixed(2), vueltas: +v().toFixed(2), rpm_cada_vuelta: pasos, gana_mJ: +(gana * 1000).toFixed(3), err_mJ: +(b.error * 1000).toFixed(3), solapes: info.overlaps.length };
}
if (require.main === module) {
  let casos = [['Discos de la app: 9 pares', { pasos: 9 }], ['Discos: 18 pares', { pasos: 18 }]].concat(J.BLOQUES);
  const solo = process.argv.indexOf('--solo');   // --solo n: solo ese caso (y se cambia en el .json que ya hay)
  const prev = solo > 0 && process.argv[2] && require('fs').existsSync(process.argv[2]) ? JSON.parse(require('fs').readFileSync(process.argv[2])) : null;
  if (solo > 0) casos = [casos[+process.argv[solo + 1]]];
  const out = [];
  for (const [nombre, o] of casos) {
    const ideal = corre(Object.assign({}, o, { ideal: true }), 100, 20), real = corre(o, 300, 600);
    const r = ideal.rpm_cada_vuelta, lo = Math.min(...r), hi = Math.max(...r);
    out.push({ nombre, o, ideal, real });
    console.log(`${nombre.padEnd(58)} sin roce (100 rpm, 20 s): ${ideal.vueltas} vueltas, rpm al pasar por el mismo sitio ${lo}–${hi}, ` +
      `sobra como mucho ${ideal.gana_mJ} mJ, error ${ideal.err_mJ} mJ · con roce (300 rpm): ${real.vueltas} vueltas en ${real.t} s · solapes ${ideal.solapes}`);
  }
  if (prev) { const i = prev.findIndex(r => r.nombre === out[0].nombre); if (i >= 0) prev[i] = out[0]; else prev.push(out[0]); }
  if (process.argv[2]) require('fs').writeFileSync(process.argv[2], JSON.stringify(prev || out));
}
module.exports = { monta, corre };
