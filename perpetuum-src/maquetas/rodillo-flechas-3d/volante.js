// El volante de inercia en el banco: un disco pegado al rodillo de PLA, con la inercia del de volante.py (Ø170 mm,
// 16 tuercas M12: 1,6 g·m²). Con la leva de la app y con la más eficiente (leva.js). Se mide con el mismo empujón
// (300 rpm) y con la misma energía que el rodillo sin volante a 300 rpm, porque con el mismo empujón el volante
// guarda más energía y daría más vueltas solo por eso.
// Uso: node volante.js <caso> (guarda volante-<caso>.json)   ·   node volante.js tabla
const L = require('./leva.js'), J = require('./juntos.js'), P = require('../../app/build.js');
const fs = require('fs');
const VOL = { r: 0.085, I: 0.00161 };   // 1,61 g·m², la inercia de volante.py
const APP = { prof: 'rampa', lift: 0.0165, thDrop: 4, rr: 0.002, pre: 0.15 };
const inercia = o => { const d = J.rodillo(o), info = P.build(d), b = info.bodyOf[d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam').id]; return 1 / b.iI; };
function casos() {
  const M = L.ELEGIDA;
  const I0 = inercia(Object.assign({}, L.BASE, { leva: M })), I1 = inercia(Object.assign({}, L.BASE, { leva: M, volante: VOL }));
  const rpmIgual = +(300 * Math.sqrt(I0 / I1)).toFixed(1);   // la misma energía que sin volante a 300 rpm
  return [
    ['Leva de la app, sin volante', { leva: APP }],
    ['Leva de la app, con volante', { leva: APP, volante: VOL }],
    ['Leva eficiente, sin volante', { leva: M }],
    ['Leva eficiente, con volante', { leva: M, volante: VOL }],
    [`Leva eficiente, con volante y la misma energía (${String(rpmIgual).replace('.', ',')} rpm)`, { leva: M, volante: VOL, rpm: rpmIgual }],
    ['Sin imanes, leva eficiente, con volante', { leva: M, volante: VOL, sin: true }],
  ].map(([n, o]) => [n, Object.assign({}, L.BASE, o)]);
}
module.exports = { VOL, APP, casos };
if (require.main === module) {
  const arg = process.argv[2];
  if (arg === 'tabla') {
    casos().forEach((c, i) => {
      const f = `volante-${i}.json`; if (!fs.existsSync(f)) return console.log(c[0], '— falta');
      const r = JSON.parse(fs.readFileSync(f));
      console.log(`${r.nombre.padEnd(70)} ${r.real.vueltas} vueltas en ${r.real.t} s, gastó ${r.real.gastado_mJ} mJ (${(r.real.gastado_mJ / r.real.vueltas).toFixed(1)} por vuelta), ` +
        `suelto ${(r.real.suelto * 100).toFixed(1)} % · mínimo ${r.minimo_rpm} rpm · sin roce 10 s: sobra ${r.ideal.gana_mJ} mJ`);
    });
    return;
  }
  const [nombre, o] = casos()[+arg], t0 = Date.now();
  const real = L.corre(o, 600), ideal = J.corre(Object.assign({}, o, { ideal: true }), 10); delete ideal.serie;
  const minimo_rpm = J.minimo(o);
  fs.writeFileSync(`volante-${arg}.json`, JSON.stringify({ nombre, o, real, ideal, minimo_rpm, segundos: (Date.now() - t0) / 1000 }));
  console.log(nombre, 'listo en', (Date.now() - t0) / 1000, 's');
}
