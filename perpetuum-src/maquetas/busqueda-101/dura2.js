// Segunda fase: los que siguen moviéndose al minuto, hasta Tmax segundos (o hasta que se paren).
// Uso: node dura2.js duracion.jsonl Tmax cuantos [parte partes]
const fs = require('fs'), path = require('path');
const [file, Tmax, cuantos, parte, partes] = [process.argv[2], +process.argv[3], +process.argv[4], +(process.argv[5] || 0), +(process.argv[6] || 1)];
const A = path.join(__dirname, '../../app'); const E = require(A + '/engine.js'); global.PerpetuumEngine = E; const P = require(A + '/build.js'), { diseno } = require('./corre.js');
// fuera los que reciben energía de fuera: electroimanes (gastan pila) y motores que no tiran del acumulador
const conPila = r => { const d = diseno(r.fam, r.seed, r.n); return d.parts.some(p => (p.kind === 'magnet' && p.shape === 'electro') || (p.motor && p.msrc !== 'bus')); };
const R = fs.readFileSync(path.join(__dirname, file), 'utf8').trim().split('\n').map(JSON.parse)
  .filter(r => !r.parado && !r.sale && !r.trampa && r.K_mJ > 1 && !conPila(r)).sort((a, b) => b.K_mJ / b.Kmax_mJ - a.K_mJ / a.Kmax_mJ).slice(0, cuantos);
const tmp = path.join(require('os').tmpdir(), 'lista-dura2-' + process.pid + '.json');
fs.writeFileSync(tmp, JSON.stringify(R.filter((_, i) => i % partes === parte)));
require('child_process').execFileSync('node', [path.join(__dirname, 'dura.js'), 'x', '0', String(Tmax)], { env: Object.assign({}, process.env, { LISTA: tmp }), stdio: ['ignore', 'inherit', 'inherit'] });
