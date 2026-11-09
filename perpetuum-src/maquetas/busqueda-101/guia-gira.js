// Fallo del banco que sacó la quinta tanda: una guía (pieza que se desliza por una recta) montada en una pieza que gira.
// Caso de prueba: rueda con eje fijo, sin rozamiento, con 1 o 7 pesas de 300 g en guías hacia fuera (o torcidas 23°) y un
// muelle de cada pesa al centro. Es un sistema cerrado: su energía tiene que quedarse igual.
// Se mide lo más que sube y lo más que baja en 4 s, con el paso normal y uno 8 veces más fino, sin y con el arreglo
// (arreglo-guias.js). Uso: node guia-gira.js
const A = require('path').join(__dirname, '../../app'), { execFileSync } = require('child_process');
if (!process.env.CASO) {
  for (const arreglo of ['', '1']) for (const c of ['1,true,1,0', '7,false,1,0', '7,true,1,0', '7,true,8,0', '7,true,1,23', '7,true,8,23'])
    process.stdout.write(execFileSync('node', [__filename], { env: Object.assign({}, process.env, { CASO: c, ARREGLO_GUIAS: arreglo }) }));
  return;
}
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
if (process.env.ARREGLO_GUIAS) require('./arreglo-guias.js')(E);
const P = require(A + '/build.js');
const [n, grav, div, tiltG] = process.env.CASO.split(','), N = +n, D = +div, tilt = +tiltG * Math.PI / 180;
const d = P.emptyDesign(); d.air = false; d.ideal = true; d.iters = D > 1 ? 120 : 40; d.dt = 1 / (480 * D);
const wh = P.makeWheel(d, 0, 0.5, 0.05); wh.m = 1; wh.rpm = 10; d.parts.push(wh);
for (let k = 0; k < N; k++) {
  const a = k / N * 2 * Math.PI, g = a + tilt, r0 = 0.15, x = r0 * Math.cos(a), y = 0.5 + r0 * Math.sin(a);
  const sl = P.makeBar(d, x - 0.01 * Math.cos(g), y - 0.01 * Math.sin(g), x + 0.01 * Math.cos(g), y + 0.01 * Math.sin(g)); sl.m = 0.005; sl.th = 0.003; sl.plane = 1 + (k % 2); d.parts.push(sl);
  const wg = P.makeBall(d, x, y); wg.r = 0.015; wg.m = 0.3; wg.mat = 'plomo'; wg.plane = sl.plane; d.parts.push(wg);
  const wl = P.makePin(d, x, y, sl.id, wg.id); wl.mode = 'rigid'; d.parts.push(wl);
  const gp = P.makePin(d, x, y, wh.id, sl.id); gp.mode = 'guia'; gp.sang = g * 180 / Math.PI; d.parts.push(gp);
  const sp = P.makeSpring(d, 0.005 * Math.cos(a), 0.5 + 0.005 * Math.sin(a), x, y, wh.id, sl.id); sp.k = 50; sp.rest = 0.1; sp.damp = 0; d.parts.push(sp);
}
const info = P.build(d), w = info.world; if (grav === 'false') w.g = 0;
const E0 = w.energy().E; let mx = 0, mn = 0; while (w.t < 4) { w.step(); const e = w.energy().E - E0; mx = Math.max(mx, e); mn = Math.min(mn, e); }
console.log(JSON.stringify({ arreglo: !!process.env.ARREGLO_GUIAS, pesas: N, gravedad: grav === 'true', paso: '1/' + 480 * D + ' s', torcidas: +tiltG, energia_mJ: +(E0 * 1000).toFixed(0), sube_max_mJ: +(mx * 1000).toFixed(1), baja_max_mJ: +(mn * 1000).toFixed(1) }));
