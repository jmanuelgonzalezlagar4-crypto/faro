// Miles de rampas de Wilkins: imán (grado, tamaño, sitio, giro), agujero, bola, salida con o sin empujón, con y sin roce.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const prueba = require('./prueba.js');
const [N, seed, parte, partes] = [+process.argv[2], +process.argv[3], +(process.argv[4] || 0), +(process.argv[5] || 1)];
const r = mulberry32(seed), U = (a, b) => a + (b - a) * r();
for (let n = 0; n < N; n++) {
  const o = { n, grado: ['ferrita', 'n35', 'n52'][Math.floor(r() * 3)], tam: +U(0.08, 0.45).toFixed(3), ang: [0, 180, 90, 270][Math.floor(r() * 4)], magX: Math.round(U(600, 900)), magY: Math.round(U(120, 260)),
    agujero: Math.round(U(900, 1150)), rb: +U(0.008, 0.03).toFixed(4), salida: r() < 0.5 ? 'pie' : 'foto', v0: +U(0, 3).toFixed(2), ideal: r() < 0.5, mat: ['madera', 'acero'][Math.floor(r() * 2)] };
  if (o.salida === 'foto') o.v0 = 0;
  if (n % partes !== parte) continue;
  let res; try { res = prueba(o, 20); } catch (e) { res = { error: String(e.message).slice(0, 80) }; }
  console.log(JSON.stringify(Object.assign({ o }, res)));
}
