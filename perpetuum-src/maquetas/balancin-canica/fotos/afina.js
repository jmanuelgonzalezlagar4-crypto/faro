// Coge los 30 mejores de todo lo probado y prueba 10 variaciones pequeñas de cada uno.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const fs = require('fs'), ronda = +process.argv[2], r = mulberry32(1000 + ronda);
const nota = x => (x.valido === false || x.cae || x.por) ? -1 : x.vueltas * 10 + x.bajadas * 3 + x.viajes + Math.min(x.t, 30) / 10;
const todos = fs.readFileSync('resultados.jsonl', 'utf8').trim().split('\n').map(JSON.parse).sort((a, b) => nota(b) - nota(a));
const L = { mc: [0.01, 0.12], hueco: [0, 0.04], hs: [0, 0.05], caida: [0, 30], Lr: [0.06, 0.16], mb: [0.002, 0.04], mr: [0.008, 0.05], ml: [0.03, 0.12], PY: [0.05, 0.10], xc: [0.10, 0.16], xr: [0.10, 0.146], th0: [-2, 22] };
const out = [];
todos.slice(0, 30).forEach((x, i) => { for (let k = 0; k < 10; k++) {
  const o = { ...x.o, id: ronda * 1000000 + i * 100 + k };
  for (const p in L) if (r() < 0.5) { const [a, b] = L[p]; o[p] = +Math.min(b, Math.max(a, o[p] + (r() - 0.5) * 0.2 * (b - a))).toFixed(4); }
  out.push(o); } });
fs.writeFileSync(`afina${ronda}.txt`, out.map(o => JSON.stringify(o)).join('\n') + '\n');
