// ¿Mejor con los imanes más juntos? El rodillo de flechas de la app (mismo cilindro, palos, levas, muelles y empujón)
// con más pares por flecha, es decir, con los imanes más juntos a lo largo de la vuelta.
// Uso: node juntos.js [salida.json]
const E = require('../../app/engine.js'); global.PerpetuumEngine = E;
const P = require('../../app/build.js');
const DEG = Math.PI / 180;

// pasos: pares por flecha; min/max: media separación del par a lo largo del eje; ds: tamaño del imán (disco)
function rodillo(o) {
  o = Object.assign({ pasos: 9, min: 0.006, max: 0.05, ds: 0.011, grade: 'n52', rpm: 300, ideal: false, sin: false, solo: false }, o);
  // bloque: { t: grueso (de sur a norte, hacia fuera), w: lo que ocupa a lo largo de la vuelta, z: a lo largo del eje },
  // metido a ras del cilindro; los palos se ponen a la misma distancia de su cara que en la app (4 mm)
  const B = o.bloque;
  // fl: flechas por vuelta (la leva lleva una punta por flecha); cierra: el último par va en el mismo ángulo que el primero
  // m: masa del cilindro (kg); leva: opciones de la leva, los rodillos y los muelles (prof, lift, thPeak, thDrop, drop, rr, pre, k)
  const d = require('./flechas-n.js').flechas(Object.assign({}, o.leva || {}, { rpm: o.rpm, disc: B ? 1e-9 : o.ds, fl: o.fl || 2, m: o.m }));
  const wh = d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam');
  d.parts = d.parts.filter(p => !(p.kind === 'magnet' && p.host === wh.id));
  if (o.solo) {   // el cilindro con su leva, sin palos ni muelles
    const cam = d.parts.find(p => p.style === 'cam'), keep = new Set([wh.id, cam.id]);
    d.parts = d.parts.filter(p => keep.has(p.id) || (p.kind === 'pin' && p.b === cam.id) || p.kind === 'ramp');
  }
  if (!o.sin && !o.solo) {
    const FL = o.fl || 2, R = wh.r, rm = B ? R - B.t / 2 : R + o.ds / 4, TH0 = 40, alpha = th => (90 + th - TH0) * DEG;
    // borde: el primer par empieza justo en la línea de salida y el último acaba justo en ella, sin pasarla
    // (w: lo que ocupa el imán a lo largo de la vuelta, en grados, medido en la cara del cilindro)
    const w = B ? 2 * Math.asin(B.w / 2 / R) / DEG : 2 * Math.asin(o.ds / 2 / R) / DEG;
    const PASO = o.borde ? (360 / FL - w) / (o.pasos - 1) : 360 / FL / (o.cierra ? o.pasos - 1 : o.pasos), TH1 = o.borde ? w / 2 : 0;
    for (let f = 0; f < FL; f++) for (let k = 0; k < o.pasos; k++) {
      const a = alpha(f * 360 / FL + TH1 + k * PASO), abre = o.min + (o.max - o.min) * k / (o.pasos - 1);
      for (const sz of [-1, 1]) {
        if (B) {
          // el bloque, en trozos de 3 mm o menos a lo largo del eje: cada trozo es un imán plano de su ancho y grueso.
          // (Si fuera un imán largo, el banco contaría su choque con el palo, también largo, con 8 trozos de 16 mm del
          // palo: la cuenta de la energía no cuadra. Con trozos cortos contra el palo largo la cuenta es exacta.)
          const nz = Math.max(1, Math.ceil(B.z / 0.003 - 1e-9)), M = P.GRADES[o.grade].br / E.MU0;
          for (let iz = 0; iz < nz; iz++) {
            const mg = P.makeMagnet(d, +(wh.x + rm * Math.cos(a)).toFixed(5), +(wh.y + rm * Math.sin(a)).toFixed(5), wh.id, 'bar');
            mg.size = B.t; mg.wide = B.w; mg.grade = null; mg.mu = M * B.t * B.w * B.z / nz;   // el momento de su trozo
            mg.ang = +(a / DEG).toFixed(2); mg.z = +(sz * abre + (iz - (nz - 1) / 2) * B.z / nz).toFixed(5); mg.poles = true; mg.soft = 0.0015; mg.ndz = nz;
            d.parts.push(mg);
          }
          continue;
        }
        const mg = P.makeMagnet(d, +(wh.x + rm * Math.cos(a)).toFixed(5), +(wh.y + rm * Math.sin(a)).toFixed(5), wh.id, 'disc');
        mg.size = o.ds; mg.grade = o.grade; mg.ang = +(a / DEG).toFixed(2); mg.z = +(sz * abre).toFixed(4); mg.poles = true; mg.soft = o.ds / 4;
        mg.mu = P.magnetModel(mg).mu;
        d.parts.push(mg);
      }
    }
  }
  // volante de inercia: va pegado al cilindro, sin eje propio y en otro plano (no toca nada). En el banco es una bola con
  // la misma inercia (I = 0,4·m·r²): una rueda lisa del banco choca siempre en el plano de delante, aunque se le ponga otro.
  if (o.volante) {
    const fw = P.makeBall(d, wh.x, wh.y);
    fw.r = o.volante.r; fw.m = +(o.volante.I / (0.4 * o.volante.r * o.volante.r)).toFixed(4); fw.mat = 'madera'; fw.plane = 2;
    d.parts.push(fw);
    const pv = P.makePin(d, wh.x, wh.y, wh.id, fw.id); pv.mode = 'rigid'; d.parts.push(pv);
  }
  d.ideal = o.ideal;
  return d;
}

function corre(o, T) {
  const d = rodillo(o), info = P.build(d), w = info.world, hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel' && p.style !== 'cam').id];
  const vueltas = () => -(hb.a - hb.a0) / 2 / Math.PI, rpm = () => -hb.w * 60 / 2 / Math.PI;
  let rmin = Infinity, rmax = -Infinity, gana = -Infinity, serie = [];
  let next = 0;
  while (w.t < T && !w.isStopped()) {
    w.step();
    const r = rpm(); if (w.t > 0.2) { rmin = Math.min(rmin, r); rmax = Math.max(rmax, r); }
    const b = w.balance(); gana = Math.max(gana, -b.reserve);
    if (w.t >= next) { serie.push([+w.t.toFixed(3), +vueltas().toFixed(4), +r.toFixed(2)]); next += 0.01; }
  }
  const b = w.balance();
  return { t: +w.t.toFixed(2), vueltas: +vueltas().toFixed(2), rpmMin: +rmin.toFixed(1), rpmMax: +rmax.toFixed(1), gana_mJ: +(gana * 1000).toFixed(2),
    gastado_mJ: +(b.reserve * 1000).toFixed(1), golpes_mJ: +(b.hits * 1000).toFixed(1), ejes_mJ: +(b.axle * 1000).toFixed(1), roce_mJ: +(b.rub * 1000).toFixed(1), aire_mJ: +(b.air * 1000).toFixed(1), err_mJ: +(b.error * 1000).toFixed(2), solapes: info.overlaps.length, serie };
}

// el empujón más pequeño con el que da una vuelta entera (con roce)
function minimo(o) {
  let lo = 0, hi = 300;
  for (let i = 0; i < 9; i++) {
    const m = (lo + hi) / 2, r = corre(Object.assign({}, o, { rpm: m }), 20);
    if (r.vueltas >= 1) hi = m; else lo = m;
  }
  return +hi.toFixed(1);
}

// los bloques del usuario: 10 × 6 × 3 mm, N35, el norte hacia fuera; «vuelta»: los 10 mm a lo largo de la vuelta
const BV = { t: 0.003, w: 0.010, z: 0.006 }, BE = { t: 0.003, w: 0.006, z: 0.010 };
const BLOQUES = [
  ['Bloques: 9 pares por flecha, cada 20° (como el que imprimes)', { pasos: 9, bloque: BV, grade: 'n35' }],
  ['Bloques: 12 pares, cada 15°', { pasos: 12, bloque: BV, grade: 'n35' }],
  ['Bloques: 14 pares, cada 12,9° (lo más junto que cabe)', { pasos: 14, bloque: BV, grade: 'n35' }],
  ['Bloques girados (6 mm en la vuelta): 20 pares, cada 9°', { pasos: 20, bloque: BE, grade: 'n35' }],
  ['Sin imanes en el cilindro', { sin: true, bloque: BV }],
];
if (require.main === module) {
  const bloques = process.argv.includes('bloques');
  process.argv = process.argv.filter(a => a !== 'bloques');
  const casos = bloques ? BLOQUES : [
    ['9 pares por flecha (la app), cada 20°', { pasos: 9 }],
    ['12 pares, cada 15°', { pasos: 12 }],
    ['15 pares, cada 12°', { pasos: 15 }],
    ['18 pares, cada 10° (se tocan)', { pasos: 18 }],
    ['Sin imanes en el cilindro', { sin: true }],
  ];
  const out = [];
  for (const [nombre, o] of casos) {
    const t0 = Date.now();
    const real = corre(o, 600), ideal = corre(Object.assign({}, o, { ideal: true }), 10), mn = minimo(o);
    const r = { nombre, o, real, ideal, minimo_rpm: mn, segundos: (Date.now() - t0) / 1000 };
    out.push(r);
    console.log(`${nombre.padEnd(40)} con roce: ${real.vueltas} vueltas en ${real.t} s · sin roce 10 s: sobra como mucho ${ideal.gana_mJ} mJ, ` +
      `golpes ${ideal.golpes_mJ} mJ, error ${ideal.err_mJ} mJ · empujón mínimo ${mn} rpm · solapes ${real.solapes} · ${r.segundos} s`);
  }
  if (process.argv[2]) require('fs').writeFileSync(process.argv[2], JSON.stringify(out));
}
module.exports = { rodillo, corre, minimo, BLOQUES };
