// Un fotograma de la rampa (para comprobar el dibujo) en el instante t.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { dibuja } = require('../busqueda-101/dibujo.js');
const o = JSON.parse(process.argv[2] || '{}'), ts = (process.argv[3] || '0').split(',').map(Number), out = process.argv[4];
const d = require('./wilkins-foto.js')(P, o); d.dt = 1 / 1920; const info = P.build(d), w = info.world, b = info.bodyOf[d._ids.bola];
if (o.v0) { const p = d.parts.find(q => q.id === d._ids.bola); b.vx = p.vx0; b.vy = p.vy0; b.w = o.v0 / p.r; w.ledger.E0 = w.energy().E; }
const k = 0.000715, win = [280 * k, 1960 * k, -10 * k, 1000 * k], W = 600, S = W / (win[1] - win[0]), X = x => ((x * k - win[0]) * S).toFixed(1), Y = y => ((win[3] - (1000 - y) * k) * S).toFixed(1);
let html = '';
for (const t of ts) { while (w.t < t - 1e-9) w.step(); let svg = dibuja(w, info, d, win, W, []);
  svg = svg.replace(/(<rect width="[^"]*" height="[^"]*" fill="[^"]*"\/>)/, `$1<rect x="${X(310)}" y="${Y(250)}" width="${(550 * k * S).toFixed(1)}" height="${(750 * k * S).toFixed(1)}" fill="#dcd8cf" stroke="#b9b3a6"/>`).replace('</svg>', `<rect x="${X(570)}" y="${Y(95)}" width="${(400 * k * S).toFixed(1)}" height="${(150 * k * S).toFixed(1)}" rx="3" fill="#d94032"/></svg>`);
  html += `<div style="display:inline-block;margin:4px;font:13px sans-serif">${svg}<br>t=${t}</div>`; }
(async () => { const { chromium } = require('playwright'); const br = await chromium.launch(), p = await br.newPage({ viewport: { width: 1240, height: 400 } }); await p.setContent(`<body style="margin:0">${html}</body>`); await p.screenshot({ path: out, fullPage: true }); await br.close(); })();
