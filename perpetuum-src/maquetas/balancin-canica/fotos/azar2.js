// Variantes alrededor de las medidas de la segunda versión.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const N = +(process.argv[2] || 1000), seed = +(process.argv[3] || 11), r = mulberry32(seed), U = (a, b) => a + (b - a) * r();
const out = [];
for (let i = 0; i < N; i++) out.push({ id: seed * 100000 + i,
  mc: +U(0.0, 0.15).toFixed(4),    // el contrapeso
  mn: +U(0.0, 0.04).toFixed(4),    // el taco negro de la punta izquierda
  mb: +U(0.005, 0.030).toFixed(4), // la canica
  hs: +U(0.022, 0.040).toFixed(4), // el escalón
  caida: +U(4, 14).toFixed(1),     // cuánto cuelga la rampa
  mr: +U(0.015, 0.040).toFixed(4), mp: +U(0.008, 0.025).toFixed(4), ml: +U(0.07, 0.13).toFixed(4),
  hueco: +U(0, 0.015).toFixed(4),  // lo que le falta al contrapeso para tocar la tabla en la foto recta
  PY: +U(0.062, 0.074).toFixed(4) });
require('fs').writeFileSync(process.argv[4] || 'lote2.txt', out.map(o => JSON.stringify(o)).join('\n') + '\n');
