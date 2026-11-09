// Adónde va la energía en una vuelta de la mejor variante del dibujo del usuario (nº 655, con roce): la energía de la
// bola (movimiento + altura + la de los imanes) en cada momento, y lo que se pierde entre uno y otro. Uso: node adonde-va.js
const fs = require('fs'), path = require('path'), { monta } = require('./rampa.js');
const r = fs.readFileSync(path.join(__dirname, 'barrido-dibujo.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).find(q => q.n === 655);
const S = monta(r.o), w = S.w, b = S.b, L = w.ledger, a = r.o.ang * Math.PI / 180;
const snap = et => { const e = w.energy(); return { et, E: e.K + e.Pg + e.Pm, K: e.K, Pg: e.Pg, Pm: e.Pm, t: w.t }; };
const P = [snap('Sale, con el empujón')]; let st = 0, PgFinal = null;
while (w.t < 3) { w.step(); const h = b.y - (S.Ap[1] + b.x * Math.tan(a));
  if (st === 0 && b.x > S.Ep[0] - r.o.rb && h < -r.o.rb * 0.5) { P.push(snap('Deja la rampa, junto al imán')); PgFinal = w.energy().Pg; st = 1; }
  else if (st === 1 && b.vx < 0 && b.y < S.R1[1] + 0.02) { P.push(snap('Ya rueda de vuelta')); st = 2; }
  else if (st === 2 && b.x < S.C[0]) { P.push(snap('En el fondo de la C')); st = 3; }
  else if (st === 3 && b.x > S.C[0] && h > 0 && h < 2.5 * r.o.rb) { P.push(snap('Otra vez en la rampa')); st = 4; }
  else if (st === 4 && b.vx < 0) { P.push(snap('Lo más alto que sube')); st = 5; } }
const perd = [[], ['roces'], ['al caer y', 'dar la vuelta'], ['rebotes en la', 'rampa de vuelta'], ['dentro', 'de la C'], ['rodando', 'rampa arriba']];
const W = 1180, H = 640, L0 = 70, base = 430, top = 120, Emax = Math.max(...P.map(p => p.E)) * 1.1, Y = e => base - e / Emax * (base - top), bw = 90, gap = (W - L0 - 40 - P.length * bw) / (P.length - 1);
const c = v => v.toFixed(2).replace('.', ',');
let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter,Helvetica,Arial,sans-serif"><rect width="${W}" height="${H}" fill="#fcfcfb"/>`;
g += `<text x="24" y="38" font-size="24" font-weight="700" fill="#0b0b0b">Adónde va la energía en una vuelta (la mejor variante de su dibujo)</text>`;
g += `<text x="24" y="64" font-size="15.5" fill="#52514e">Energía de la bola en mJ: movimiento, más altura sobre la mesa, más la de los imanes. Variante nº 655, con roce y un empujón de 0,8 m/s.</text>`;
for (let e = 0; e <= Emax; e += 1) g += `<line x1="${L0 - 6}" x2="${W - 30}" y1="${Y(e).toFixed(1)}" y2="${Y(e).toFixed(1)}" stroke="#e8e7e2"/><text x="${L0 - 12}" y="${(Y(e) + 4).toFixed(1)}" font-size="12.5" fill="#52514e" text-anchor="end">${e}</text>`;
const need = PgFinal;
g += `<line x1="${L0}" x2="${W - 30}" y1="${Y(need).toFixed(1)}" y2="${Y(need).toFixed(1)}" stroke="#b3361b" stroke-width="1.5" stroke-dasharray="6 4"/><text x="${W - 32}" y="${(Y(need) - 8).toFixed(1)}" font-size="13.5" fill="#b3361b" text-anchor="end" font-weight="600">lo mínimo para volver a llegar al final: ${c(need * 1000)} mJ</text>`;
P.forEach((p, i) => { const x = L0 + i * (bw + gap), e = p.E * 1000;
  g += `<rect x="${x.toFixed(1)}" y="${Y(p.E).toFixed(1)}" width="${bw}" height="${(base - Y(p.E)).toFixed(1)}" rx="4" fill="#2a78d6"/>`;
  g += `<text x="${(x + bw / 2).toFixed(1)}" y="${(Y(p.E) - 8).toFixed(1)}" font-size="15" font-weight="600" fill="#0b0b0b" text-anchor="middle">${c(e)}</text>`;
  const words = p.et.split(' '), l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
  g += `<text x="${(x + bw / 2).toFixed(1)}" y="${base + 20}" font-size="13" fill="#0b0b0b" text-anchor="middle">${l1}</text><text x="${(x + bw / 2).toFixed(1)}" y="${base + 37}" font-size="13" fill="#0b0b0b" text-anchor="middle">${l2}</text>`;
  if (i > 0) { const d = (P[i - 1].E - p.E) * 1000, xm = (x - gap / 2).toFixed(1);
    g += `<text x="${xm}" y="${base + 70}" font-size="14" font-weight="600" fill="#b3361b" text-anchor="middle">−${c(d)}</text>`;
    perd[i].forEach((t, j) => g += `<text x="${xm}" y="${base + 87 + 15 * j}" font-size="12" fill="#52514e" text-anchor="middle">${t}</text>`); } });
g += `<text x="${L0 - 50}" y="${base + 70}" font-size="13" fill="#b3361b" font-weight="600">se pierde:</text>`;
const pm1 = P[1].Pm * 1000, pm2 = P[2].Pm * 1000;
g += `<text x="24" y="${H - 50}" font-size="15.5" fill="#0b0b0b">El imán le da ${c(-pm1)} mJ al acercarse y se los quita al alejarse (en el fondo de la C vale 0). Solo al caer y dar la vuelta se pierden ${c((P[1].E - P[2].E) * 1000)} mJ,</text>`;
g += `<text x="24" y="${H - 26}" font-size="15.5" fill="#0b0b0b">unas ${Math.round((P[1].E - P[2].E) / -P[1].Pm)} veces lo que el imán le dio. Vuelve a la rampa con ${c(P[P.length - 1].E * 1000)} mJ y le harían falta al menos ${c(need * 1000)} para volver a caer.</text>`;
g += '</svg>';
(async () => { const { chromium } = require('playwright'); const br = await chromium.launch(), p = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0">${g}</body>`); await p.screenshot({ path: path.join(__dirname, 'adonde-va.png') }); await br.close();
  console.log(JSON.stringify(P.map(p => ({ et: p.et, E_mJ: +(p.E * 1000).toFixed(2), Pm_mJ: +(p.Pm * 1000).toFixed(2) })))); })();
