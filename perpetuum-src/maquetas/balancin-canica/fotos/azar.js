// Diseños al azar alrededor de las medidas de las fotos: lo que no se puede medir bien en una foto se varía mucho.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const N = +(process.argv[2] || 2000), seed = +(process.argv[3] || 7), r = mulberry32(seed), U = (a, b) => a + (b - a) * r();
const out = [];
for (let i = 0; i < N; i++) out.push({ id: seed * 100000 + i,
  mc: +U(0.010, 0.090).toFixed(4),        // el contrapeso
  hueco: +U(0, 0.030).toFixed(4),         // lo que le falta para tocar la tabla al empezar
  hs: +U(0.000, 0.045).toFixed(4),        // la altura del escalón
  caida: +U(0, 25).toFixed(1),            // cuánto cuelga la rampa
  Lr: +U(0.07, 0.14).toFixed(3),          // el largo de la rampa
  mb: +U(0.003, 0.030).toFixed(4),        // la canica
  mr: +U(0.010, 0.040).toFixed(4), ml: +U(0.040, 0.100).toFixed(4),
  PY: +U(0.055, 0.090).toFixed(3),        // la altura del eje
  xc: +U(0.11, 0.15).toFixed(3), xr: +U(0.11, 0.145).toFixed(3),
  th0: +U(-2, 20).toFixed(1) });          // dónde se suelta: de la foto (0°) a 20° con el lado de la canica arriba
require('fs').writeFileSync(process.argv[4] || 'lote.txt', out.map(o => JSON.stringify(o)).join('\n') + '\n');
