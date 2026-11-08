// genera diseños al azar (semilla fija) y los reparte en 4 ficheros
let s = +(process.argv[3] || 7); const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const U = (a, b) => a + (b - a) * rnd(), LU = (a, b) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * rnd());
const N = +(process.argv[2] || 1500), out = [[], [], [], []];
for (let i = 0; i < N; i++) {
  const mb = +LU(0.005, 0.2).toFixed(4);
  const o = { id: i, mb, rb: +(mb > 0.05 ? 0.015 : 0.01).toFixed(3), mc: +(mb * LU(0.3, 6)).toFixed(4), xl: +U(0.15, 0.35).toFixed(3), al: +U(5, 35).toFixed(1), La: +U(0.15, 0.40).toFixed(3),
    L: +U(0.08, 0.30).toFixed(3), mr: +LU(0.005, 0.08).toFixed(4), hi: +U(30, 90).toFixed(0), inc: +U(2, 10).toFixed(1), hr: +U(0, 0.2).toFixed(3), ml: +LU(0.02, 0.12).toFixed(3), ma: +LU(0.02, 0.10).toFixed(3) };
  out[i % 4].push(JSON.stringify(o));
}
out.forEach((a, k) => require('fs').writeFileSync('lote' + k + '.txt', a.join('\n') + '\n'));
