// La gráfica de las 3.000 rampas (barrido.png): qué le pasa a la bola y, de las que llegan al gancho, cuánto les falta
// para volver a la rampa. Uso: node figuras.js
const fs = require('fs'), path = require('path');
const R = fs.readFileSync(path.join(__dirname, 'barrido.jsonl'), 'utf8').trim().split('\n').map(JSON.parse), V = R.filter(r => r.valido);
const cat = r => r.vueltas > 0 ? 5 : r.caidas === 0 && r.pegada ? 1 : r.caidas === 0 ? 0 : r.falta_mm != null ? 4 : r.pegada ? 3 : 2;
const nombres = ['No llega al hueco (se queda o vuelve rodando abajo)', 'Salta el hueco y se pega al imán', 'Cae por el hueco y no llega al gancho', 'Cae por el hueco y el imán la atrae hasta pegarse', 'Llega al gancho, pero no sube hasta la rampa', 'Vuelve a la rampa por el gancho'];
const cnt = nombres.map((_, i) => V.filter(r => cat(r) === i).length), F = V.filter(r => r.falta_mm != null), f = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const W = 1180, H = 560, L = 430, xmax = Math.max(...cnt), bx = v => L + v / xmax * 330;
let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter,Helvetica,Arial,sans-serif"><rect width="${W}" height="${H}" fill="#fcfcfb"/>`;
g += `<text x="24" y="38" font-size="24" font-weight="700" fill="#0b0b0b">Ninguna de las ${f(R.length)} rampas devuelve la bola a la rampa</text>`;
g += `<text x="24" y="64" font-size="15.5" fill="#52514e">Inclinación de 1° a 12°, bola imantada de 8 a 25 mm, imán de 1 a 6 cm, hueco, gancho y empujón al azar; la mitad sin rozamiento. ${f(V.length)} con las cuentas bien.</text>`;
g += `<text x="24" y="108" font-size="17" font-weight="600" fill="#0b0b0b">Qué le pasa a la bola</text>`;
nombres.forEach((nm, i) => { const y = 132 + i * 44; g += `<text x="${L - 12}" y="${y + 17}" font-size="14.5" fill="#0b0b0b" text-anchor="end">${nm}</text>`;
  if (cnt[i]) g += `<rect x="${L}" y="${y + 4}" width="${(bx(cnt[i]) - L).toFixed(1)}" height="20" rx="4" fill="${i === 5 ? '#b3361b' : '#2a78d6'}"/>`;
  g += `<text x="${bx(cnt[i]) + 8}" y="${y + 19}" font-size="14.5" font-weight="600" fill="#0b0b0b">${f(cnt[i])}</text>`; });
// lo que les falta a las que llegan al gancho
const x0 = 870, x1 = 1150, fx = v => x0 + Math.min(80, v) / 80 * (x1 - x0);
g += `<text x="${x0 - 10}" y="108" font-size="17" font-weight="600" fill="#0b0b0b">Lo que les falta (mm)</text><text x="${x0 - 10}" y="128" font-size="13.5" fill="#52514e">las ${F.length} que llegan al gancho</text>`;
for (let v = 0; v <= 80; v += 20) g += `<line x1="${fx(v)}" x2="${fx(v)}" y1="150" y2="380" stroke="#e8e7e2"/><text x="${fx(v)}" y="398" font-size="13" fill="#52514e" text-anchor="middle">${v === 80 ? '80 o más' : v}</text>`;
let s = 7; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
F.forEach(r => g += `<circle cx="${fx(r.falta_mm).toFixed(1)}" cy="${(265 + (rnd() - 0.5) * 190).toFixed(1)}" r="3.5" fill="${r.o.v0 ? '#2a78d6' : '#b3361b'}" fill-opacity="0.85"/>`);
g += `<line x1="${fx(0)}" x2="${fx(0)}" y1="145" y2="382" stroke="#0b0b0b" stroke-width="1.5" stroke-dasharray="5 4"/>`;
g += `<text x="${x0 - 10}" y="425" font-size="13.5" fill="#52514e">0 mm: volvería a la rampa. Como mínimo les</text><text x="${x0 - 10}" y="443" font-size="13.5" fill="#52514e">faltan ${String(Math.min(...F.map(r => r.falta_mm))).replace('.', ',')} mm. En rojo, la única sin empujón.</text>`;
g += `<text x="24" y="${H - 66}" font-size="15.5" fill="#0b0b0b">La bola cae desde un poco más arriba de donde empieza la rampa, pero pierde al caer y al rodar, y el imán tira de ella hacia atrás mientras se aleja por abajo.</text>`;
g += `<text x="24" y="${H - 40}" font-size="15.5" fill="#0b0b0b">Lo que el imán le da al acercarse se lo quita al alejarse: en una vuelta completa, nada. Ninguna rampa gana energía (como mucho, el 100,012 %).</text>`;
g += '</svg>';
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0">${g}</body>`); await p.screenshot({ path: path.join(__dirname, 'barrido.png') }); await b.close(); console.log(JSON.stringify({ cnt, gancho: F.length })); })();
