// Busca el disco con imanes que más vueltas da (y que más energía guarda por vuelta) desde un empujón de 1 m/s.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const { prueba } = require('./disco.js');
const [N, seed, parte, partes] = [+process.argv[2], +process.argv[3], +(process.argv[4] || 0), +(process.argv[5] || 1)];
const r = mulberry32(seed), U = (a, b) => a + (b - a) * r();
for (let k = 0; k < N; k++) {
  const o = { id: k, R: +U(0.06, 0.4).toFixed(3), rb: +U(0.005, 0.025).toFixed(4), n: 1 + Math.floor(r() * 8), tam: +U(0.008, 0.06).toFixed(4), grado: ['ferrita', 'n35', 'n52'][Math.floor(r() * 3)],
    sep: +U(0.002, 0.05).toFixed(4), forma: ['disc', 'bar', 'horseshoe'][Math.floor(r() * 3)], hueco: +U(0.0005, 0.004).toFixed(4), v0: 1, guia: 'brazo' };
  if (k % partes !== parte) continue;
  let a, b; try { a = prueba(o, 900); b = prueba(Object.assign({}, o, { n: 0 }), 900); } catch (e) { console.log(JSON.stringify({ o, error: String(e.message).slice(0, 60) })); continue; }
  console.log(JSON.stringify({ o, con: a, sin: b }));
}
