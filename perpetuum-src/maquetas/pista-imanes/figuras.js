// La gráfica de las 2.000 pistas (barrido.png): sin rozamiento, la energía de más en una vuelta; con roce, las vueltas
// de más comparadas con lo que paga la energía de los imanes al bajar del principio al final. Uso: node figuras.js
const fs = require('fs'), path = require('path'), { monta } = require('./pista.js');
// las semillas de los cuatro trozos repitieron algunas pistas: cada pista distinta se cuenta una vez
const visto = new Set(), R = fs.readFileSync(path.join(__dirname, 'barrido.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(r => { const k = JSON.stringify(r.o); if (visto.has(k)) return false; visto.add(k); return true; });
const ns = new Set(R.map(r => r.n)), C = fs.readFileSync(path.join(__dirname, 'comprobadas.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(c => c.que === 'sin rozamiento' && ns.has(c.n));
const mas = R.filter(r => r.vueltas - r.vueltas_sin > 0.05).map(r => { const o = r.o, m = o.movil === 'bola' ? 7800 * 4 / 3 * Math.PI * o.rb ** 3 : o.mc, F = 0.0015 * m * 9.81;
  const bono = (monta(o).w.energy().Pm - r.pozo_mJ / 1000) / (F * 2 * Math.PI * o.R); return { r, extra: r.vueltas - r.vueltas_sin, bono, q: (r.vueltas - r.vueltas_sin) / bono }; });
const menos = R.filter(r => r.vueltas - r.vueltas_sin < -0.05).length, atrap = R.filter(r => r.vueltas < 1).length;
const W = 1180, H = 560, f = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), c = v => v.toFixed(2).replace('.', ',');
let s = 7; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter,Helvetica,Arial,sans-serif"><rect width="${W}" height="${H}" fill="#fcfcfb"/>`;
g += `<text x="24" y="38" font-size="24" font-weight="700" fill="#0b0b0b">Ninguna de las ${f(R.length)} pistas saca energía de los imanes</text>`;
g += `<text x="24" y="64" font-size="15.5" fill="#52514e">Bola de acero o imán en un carrito; imanes en rampa, en V o en escalera; de 3 a 16 imanes, de 30° a 300° de pista, de 0,3 a 2 m/s</text>`;
// panel A
const ax0 = 60, ax1 = 560, ay = 200, xa = v => ax0 + Math.min(1.4, Math.max(0, v)) / 1.4 * (ax1 - ax0);
g += `<text x="${ax0 - 36}" y="110" font-size="17" font-weight="600" fill="#0b0b0b">Sin rozamiento: energía de más</text>`;
g += `<text x="${ax0 - 36}" y="132" font-size="14" fill="#52514e">Lo más que llega a sobrar, en % de la que mueve la pista</text>`;
for (let v = 0; v <= 1.4001; v += 0.2) g += `<line x1="${xa(v)}" x2="${xa(v)}" y1="150" y2="260" stroke="#e8e7e2"/><text x="${xa(v)}" y="280" font-size="13" fill="#52514e" text-anchor="middle">${c(v).replace(/0$/, '')} %</text>`;
R.forEach(r => g += `<circle cx="${xa(r.ideal_rend - 100).toFixed(1)}" cy="${(ay + (rnd() - 0.5) * 70).toFixed(1)}" r="3" fill="#c9c7c0" fill-opacity="0.6"/>`);
C.forEach(cc => g += `<circle cx="${xa(cc.rend8 - 100).toFixed(1)}" cy="${(ay + (rnd() - 0.5) * 50).toFixed(1)}" r="4" fill="#2a78d6"/>`);
g += `<text x="${xa(0.05)}" y="320" font-size="14" fill="#1d5fae" font-weight="600">Las ${C.length} que pasaban del 0,5 %, con un paso 8 veces</text><text x="${xa(0.05)}" y="338" font-size="14" fill="#1d5fae" font-weight="600">más fino: entre el ${c(Math.min(...C.map(x => x.rend8)) - 100)} % y el ${c(Math.max(...C.map(x => x.rend8)) - 100)} %</text>`;
g += `<text x="${xa(0.05)}" y="370" font-size="14" fill="#52514e">En gris, todas con el paso normal: es redondeo,</text><text x="${xa(0.05)}" y="388" font-size="14" fill="#52514e">sobre todo cuando el imán se queda yendo y viniendo</text>`;
// panel B
const bx0 = 680, bx1 = 1150, xb = v => bx0 + Math.min(1.2, Math.max(0, v)) / 1.2 * (bx1 - bx0), by = 200;
g += `<text x="${bx0 - 30}" y="110" font-size="17" font-weight="600" fill="#0b0b0b">Con roce: las ${mas.length} que dan más vueltas que sin imanes</text>`;
g += `<text x="${bx0 - 30}" y="132" font-size="14" fill="#52514e">Vueltas de más, en parte de lo que paga la energía de los imanes</text>`;
for (let v = 0; v <= 1.2001; v += 0.2) g += `<line x1="${xb(v)}" x2="${xb(v)}" y1="150" y2="260" stroke="#e8e7e2"/><text x="${xb(v)}" y="280" font-size="13" fill="#52514e" text-anchor="middle">${Math.round(v * 100)} %</text>`;
g += `<line x1="${xb(1)}" x2="${xb(1)}" y1="145" y2="262" stroke="#0b0b0b" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${xb(1) - 6}" y="300" font-size="13" fill="#0b0b0b" text-anchor="end">100 %: lo más que puede dar</text>`;
mas.forEach(m => g += `<circle cx="${xb(m.q).toFixed(1)}" cy="${(by + (rnd() - 0.5) * 70).toFixed(1)}" r="4" fill="#2a78d6" fill-opacity="0.85"/>`);
const qmax = Math.max(...mas.map(m => m.q));
g += `<text x="${bx0 - 30}" y="338" font-size="14" fill="#52514e">Esa energía es la que bajan los imanes desde el principio (si la pista</text><text x="${bx0 - 30}" y="356" font-size="14" fill="#52514e">empieza dentro de su campo) hasta el final (si se queda junto a un imán).</text>`;
g += `<text x="${bx0 - 30}" y="380" font-size="14" fill="#1d5fae" font-weight="600">Como mucho, el ${c(qmax * 100).replace(/0$/, '')} %: 4 milésimas de vuelta de más, unos 3 mm,</text><text x="${bx0 - 30}" y="398" font-size="14" fill="#1d5fae" font-weight="600">del tamaño del error al medir dónde se para.</text>`;
g += `<text x="24" y="${H - 70}" font-size="15.5" fill="#0b0b0b">De las otras, ${f(menos)} dan menos vueltas que la misma pista sin imanes; ${f(atrap)} de ellas se quedan atrapadas entre los imanes antes de dar una vuelta.</text>`;
g += `<text x="24" y="${H - 44}" font-size="15.5" fill="#0b0b0b">Un imán fijo es como una cuesta: lo que da al entrar lo quita al salir. En una vuelta completa, cero.</text>`;
g += '</svg>';
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0">${g}</body>`); await p.screenshot({ path: path.join(__dirname, 'barrido.png') }); await b.close();
  console.log(JSON.stringify({ mas: mas.length, qmax, menos, atrap, distintas: new Set(R.map(r => JSON.stringify(r.o))).size })); })();
