// La imagen para el usuario: sus fotos, el banco con esas medidas y el ángulo del palo.
const fs = require('fs'), path = require('path'), escena = require('./escena.js');
// las fotos del vídeo no se guardan en el repositorio: si se pasa su carpeta, se ponen al lado; si no, solo el banco
const dirF = process.argv[2], foto = f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dirF, f)).toString('base64');
const conFoto = (f, cap) => dirF ? fig(`<img src="${foto(f)}" style="width:520px;display:block">`, cap, 520) : '';
const mejor = JSON.parse(fs.readFileSync(path.join(__dirname, 'mejor.json'), 'utf8'));
const tf = escena({}, [0, 2], 540), tm = escena(mejor, [0, 0.5, 1.0, 1.5, 3.8], 350);
// series del ángulo
const A = path.join(__dirname, '../../../app'); const E = require(A + '/engine.js'); global.PerpetuumEngine = E; const P = require(A + '/build.js');
function serie(o, T) { const d = require('./real.js')(P, o), info = P.build(d), w = info.world, lev = info.bodyOf[d._ids.lever], out = []; let n = 0;
  while (w.t < T) { w.step(); if (w.t + 1e-9 >= n) { out.push([w.t, d._o.th0 + (lev.a - lev.a0) * 180 / Math.PI]); n += 0.01; } } return out; }
const sF = serie({}, 6), sM = serie(mejor, 6);
const cw = 1100, ch = 300, px0 = 60, px1 = cw - 30, py0 = 30, py1 = ch - 40, t1 = 6, a0 = -30, a1 = 20;
const X = t => px0 + t / t1 * (px1 - px0), Y = a => py1 - (a - a0) / (a1 - a0) * (py1 - py0);
let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" font-family="Inter, Helvetica, Arial, sans-serif">`;
for (let a = -30; a <= 20; a += 10) g += `<line x1="${px0}" x2="${px1}" y1="${Y(a)}" y2="${Y(a)}" stroke="${a === 0 ? '#cfcec8' : '#e6e5e0'}"/><text x="${px0 - 8}" y="${Y(a) + 4}" font-size="12" fill="#8a8984" text-anchor="end">${String(a).replace('-', '−')}°</text>`;
for (let t = 0; t <= 6; t++) g += `<text x="${X(t)}" y="${py1 + 20}" font-size="12" fill="#8a8984" text-anchor="middle">${t} s</text>`;
g += `<line x1="${px0}" x2="${px1}" y1="${Y(-24)}" y2="${Y(-24)}" stroke="#52514e" stroke-dasharray="5 4"/><text x="${px1}" y="${Y(-24) + 16}" font-size="12" fill="#52514e" text-anchor="end">V formada del todo: la rueda en la goma (unos −24°)</text>`;
const line = (s, c) => `<polyline fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round" points="${s.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/>`;
g += line(sM, '#eb6834') + line(sF, '#2a78d6');
g += `<text x="${X(2.2)}" y="${Y(-4) - 8}" font-size="13" fill="#0b0b0b">Como en la foto: baja 4° y se queda en el escalón</text>`;
g += `<text x="${X(1.75)}" y="${Y(10)}" font-size="13" fill="#0b0b0b">El mejor de 3.200, soltado a mano desde 17°: baja y sube dos veces</text></svg>`;
function fig(src, cap, wdt) { return `<figure style="margin:0;width:${wdt}px"><div style="border-radius:6px;overflow:hidden">${src}</div><figcaption>${cap}</figcaption></figure>`; }
const _fig = (src, cap, wdt) => `<figure style="margin:0;width:${wdt}px"><div style="border-radius:6px;overflow:hidden">${src}</div><figcaption>${cap}</figcaption></figure>`;
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;width:1160px;padding:28px 30px;box-sizing:border-box}
h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:26px 0 10px}p.s{margin:0 0 14px;color:#52514e;font-size:14px}figcaption{font-size:13px;color:#52514e;margin-top:6px;line-height:1.35}.row{display:flex;gap:20px;flex-wrap:wrap}.lg span{display:inline-block;width:18px;height:4px;border-radius:2px;margin:0 6px 3px 0;vertical-align:middle}.lg{font-size:13px;margin-bottom:4px}</style>
<h1>El balancín de sus fotos, en el banco</h1><p class="s">Medidas sacadas de la foto de frente, con la canica de 16 mm como regla: palo de 30 cm con el eje en medio, contrapeso colgado a 13,7 cm, rueda de goma bajo la punta, bisagra, rampa de 10 cm que cuelga 11° con su tope, y el escalón al final de la bandeja.</p>
<div class="row">${conFoto('foto-recto.jpg', 'Su foto: palo recto y canica en la punta.')}${fig(tf[0].svg, 'En el banco, igual que en la foto (0 s).', 540)}</div>
<div class="row" style="margin-top:14px">${conFoto('foto-V.jpg', 'Su otra foto: la V formada, con la rueda en la goma y la punta de la rampa en el escalón.')}${fig(tf[1].svg, 'En el banco, a los 2 s de soltarlo: el palo baja 4°, la punta de la rampa se apoya en el escalón y ahí se queda. El escalón aguanta la canica y la V no llega a formarse.', 540)}</div>
<h2>Ángulo del palo</h2><div class="lg"><span style="background:#2a78d6"></span>Como en la foto &nbsp;&nbsp; <span style="background:#eb6834"></span>El mejor de 3.200 variantes</div>${g}
<h2>El mejor de 3.200 variantes (contrapeso de 78 g, escalón de 35 mm, rampa de 7 cm sin caída, canica de 27 g)</h2>
<div class="row">${tm.map((f, i) => fig(f.svg, `${String(f.t).replace('.', ',')} s · palo a ${f.ang.toFixed(0).replace('-', '−')}°` + (i === 0 ? ' (soltado a mano)' : i === 4 ? ': parado' : ''), 350)).join('')}</div>`;

(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1160, height: 800 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: path.join(__dirname, dirF ? 'fotos-en-el-banco-con-fotos.png' : 'fotos-en-el-banco.png'), fullPage: true }); await b.close(); })();
