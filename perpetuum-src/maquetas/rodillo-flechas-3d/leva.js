// La leva más eficiente para la flecha única con borde (el último par acaba justo en la línea donde empieza el primero),
// con el rodillo impreso en PLA (unos 400 g con los imanes). Se barre la forma de la leva, cuánto sube, dónde cae o
// dónde está su punta, el tamaño de los rodillos y lo que aprietan los muelles. Se mide cuántas vueltas da con un
// empujón de 300 rpm y se comprueba que los rodillos no se despeguen de la leva (si se despegan, el palo ya no lo
// lleva la leva y la prueba no vale).
// Uso: node leva.js barrido <trozo> <de> (escribe leva-<trozo>.jsonl)   ·   node leva.js mejores
const E = require('../../app/engine.js'); global.PerpetuumEngine = E;
const P = require('../../app/build.js'), J = require('./juntos.js');
const fs = require('fs');
const BV = { t: 0.003, w: 0.010, z: 0.006 };
const BASE = { fl: 1, pasos: 19, borde: true, bloque: BV, grade: 'n35', m: 0.4 };

function corre(o, T) {
  const d = J.rodillo(o), info = P.build(d), w = info.world;
  const whp = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam'), hb = info.bodyOf[whp.id];
  const rols = d.parts.filter(p => p.kind === 'ball' && p.plane === 1).map(p => info.bodyOf[p.id]);
  const vueltas = () => -(hb.a - hb.a0) / 2 / Math.PI;
  let pasos = 0, sueltos = 0, t1 = null;
  while (w.t < T && !w.isStopped()) {
    w.step();
    if (w.t > 0.05 && Math.abs(hb.w) > 0.5) {   // mientras gira: ¿toca cada rodillo la leva?
      pasos++;
      for (const r of rols) if (!w.contacts.some(c => (c.A === r && c.B === hb) || (c.B === r && c.A === hb))) { sueltos++; break; }
    }
    if (t1 == null && vueltas() >= 1) t1 = w.t;
  }
  const b = w.balance();
  return { t: +w.t.toFixed(2), vueltas: +vueltas().toFixed(3), suelto: +(sueltos / Math.max(1, pasos)).toFixed(4),
    gastado_mJ: +(b.reserve * 1000).toFixed(1), golpes_mJ: +(b.hits * 1000).toFixed(1), ejes_mJ: +(b.axle * 1000).toFixed(1),
    roce_mJ: +(b.rub * 1000).toFixed(1), aire_mJ: +(b.air * 1000).toFixed(1), muelle_mJ: +(b.springs * 1000).toFixed(1),
    err_mJ: +(b.error * 1000).toFixed(2), solapes: info.overlaps.length };
}

function casos() {
  const out = [];
  // con los rodillos pequeños se probó también el muelle de 0,03: casi siempre se despegan (los imanes empujan el palo
  // hacia fuera más que el muelle hacia dentro); con los grandes se prueba en su lugar el de 0,10
  for (const rr of [0.002, 0.008, 0.011]) for (const pre of rr === 0.002 ? [0.15, 0.07, 0.03] : [0.15, 0.10, 0.07]) {
    out.push({ prof: 'lisa', lift: 0, thPeak: 0, rr, pre });   // una leva redonda: los palos no se mueven
    for (const lift of [0.002, 0.004, 0.008, 0.012, 0.0165]) {
      for (const thPeak of [-20, 0, 20]) out.push({ prof: 'lisa', lift, thPeak, rr, pre });
      for (const thDrop of [0, 6, 12]) out.push({ prof: 'rampa', lift, thDrop, rr, pre });
    }
  }
  return out;
}
function resultados() {
  const R = [];
  for (const f of fs.readdirSync(__dirname).filter(f => /^leva-\d+\.jsonl$/.test(f)))
    fs.readFileSync(require('path').join(__dirname, f), 'utf8').trim().split('\n').filter(Boolean).forEach(l => R.push(JSON.parse(l)));
  return R;
}
// la mejor: la que más vueltas da sin que los rodillos se despeguen (menos del 1 % del tiempo, o lo que dura la caída en la rampa)
const vale = r => r.solapes === 0 && r.suelto < (r.leva.prof === 'rampa' ? 0.1 : 0.01);
const mejor = () => resultados().filter(vale).sort((a, b) => b.vueltas - a.vueltas)[0];
// la elegida: lisa, sube 12 mm, lo más alto 20° después de la línea, rodillos de 22 mm (rodamientos 608) y muelles que
// tiran 1 N entre los dos. Da lo mismo que la mejor del barrido (16,5 mm: 5,75 vueltas frente a 5,72) y casi no golpea
// (1,3 mJ frente a 6,6).
const ELEGIDA = { prof: 'lisa', lift: 0.012, thPeak: 20, rr: 0.011, pre: 0.1 };
module.exports = { corre, BASE, BV, casos, resultados, vale, mejor, ELEGIDA };

if (require.main === module) {
  const modo = process.argv[2];
  if (modo === 'barrido') {
    const trozo = +process.argv[3], de = +process.argv[4], todos = casos(), f = `leva-${trozo}.jsonl`;
    const hechos = new Set(resultados().map(r => JSON.stringify(r.leva)));
    todos.forEach((leva, i) => {
      if (i % de !== trozo || hechos.has(JSON.stringify(leva))) return;
      const r = corre(Object.assign({}, BASE, { leva }), 120);
      fs.appendFileSync(f, JSON.stringify(Object.assign({ leva }, r)) + '\n');
    });
    console.log('trozo', trozo, 'hecho');
  } else if (modo === 'mejores') {
    const R = resultados();
    const ok = R.filter(vale).sort((a, b) => b.vueltas - a.vueltas);
    console.log(R.length, 'levas,', ok.length, 'sin despegar');
    const txt = r => `${JSON.stringify(r.leva).padEnd(70)} ${r.vueltas} vueltas en ${r.t} s · golpes ${r.golpes_mJ}, ejes ${r.ejes_mJ}, roce ${r.roce_mJ}, muelles ${r.muelle_mJ} mJ · suelto ${(r.suelto * 100).toFixed(1)} %`;
    ok.slice(0, 15).forEach(r => console.log(txt(r)));
    console.log('— con los rodillos que se despegan, las mejores (no valen):');
    R.filter(r => !vale(r)).sort((a, b) => b.vueltas - a.vueltas).slice(0, 5).forEach(r => console.log(txt(r)));
    console.log('— la leva de la app (rampa, 16,5 mm, rodillos de 2 mm, muelle 0,15):');
    R.filter(r => r.leva.prof === 'rampa' && r.leva.lift === 0.0165 && r.leva.rr === 0.002 && r.leva.pre === 0.15).forEach(r => console.log(txt(r)));
  }
}
