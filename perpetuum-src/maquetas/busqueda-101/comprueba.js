// Vuelve a probar los que pasan del 101 % (y los 5 mejores de cada familia) con un paso de cálculo 4 y 8 veces más
// fino y el doble de vueltas de cálculo en los choques. Si lo que sobra era de verdad, tiene que seguir ahí.
const fs = require('fs'), path = require('path'), { prueba } = require('./corre.js');
const R = fs.readFileSync(path.join(__dirname, 'resultados.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.rend != null);
const fams = [...new Set(R.map(r => r.fam))], elegidos = new Map();
R.filter(r => r.rend >= 101).forEach(r => elegidos.set(r.fam + r.n, r));
fams.forEach(f => R.filter(r => r.fam === f).sort((a, b) => b.rend - a.rend).slice(0, 5).forEach(r => elegidos.set(r.fam + r.n, r)));
const parte = +(process.argv[2] || 0), partes = +(process.argv[3] || 1);
[...elegidos.values()].sort((a, b) => b.rend - a.rend).filter((_, i) => i % partes === parte).forEach(r => {
  const fino4 = prueba(r.fam, 1, r.n, 10, 4, 120), fino8 = prueba(r.fam, 1, r.n, 10, 8, 120);
  console.log(JSON.stringify({ fam: r.fam, n: r.n, ej: r.ej, rend: r.rend, sobra_mJ: r.sobra_mJ, rend4: fino4.rend, sobra4_mJ: fino4.sobra_mJ, rend8: fino8.rend, sobra8_mJ: fino8.sobra_mJ, por: fino4.por || fino8.por }));
});
