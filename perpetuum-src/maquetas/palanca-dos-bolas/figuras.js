// Dos figuras: cómo entiendo el aparato de la captura (como-lo-entiendo.png) y lo que sale en las 2.000 variantes
// (barrido.png). Uso: node figuras.js
const path = require('path'), fs = require('fs');
const { dibuja, rot } = require('./dibujo.js'), { thD } = require('./geo.js');
const th = thD(), cz = [60, 37.5], czD = rot(cz, th), win = [-190, 100, -8, 200], W = 585;
const et = (X, Y, x, y, t, a = 'start', c = '#0b0b0b') => `<text x="${X(x)}" y="${Y(y)}" font-size="15" fill="${c}" text-anchor="${a}" font-family="Inter,Helvetica,Arial,sans-serif">${t}</text>`;
const fl = (X, Y, a, b, c = '#52514e') => `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" stroke="${c}" stroke-width="1.2"/>`;
const arriba = dibuja(win, W, 0, [cz], { extra: ({ X, Y }) =>
  et(X, Y, -150, 194, 'brazo largo') + fl(X, Y, [-120, 190], [-112, 172]) +
  et(X, Y, -185, 120, 'la curva') + fl(X, Y, [-150, 122], [-96, 135]) +
  et(X, Y, 14, 100, 'eje') + fl(X, Y, [14, 96], [3, 70]) +
  et(X, Y, 22, 78, 'cazoleta') + fl(X, Y, [44, 74], [58, 54]) +
  et(X, Y, 14, 9, 'contrapeso', 'end') + fl(X, Y, [16, 12], [55, 16]) +
  et(X, Y, -120, 30, 'raíles') + fl(X, Y, [-100, 34], [-90, 40]) +
  et(X, Y, -186, 84, 'tope') });
const ruta = ({ X, Y }) => {
  // la bola sale de la cazoleta, rueda por encima del brazo hasta la punta, cae junto al tope y baja por los raíles
  const Td = rot([-134.3, 186.3], th), Sd = rot([70, 27.8], th), sobre = t => [Sd[0] + (Td[0] - Sd[0]) * t, Sd[1] + (Td[1] - Sd[1]) * t + 16];
  const p = [czD, sobre(0.12), sobre(0.97), [-160, 70], [-158, 65.6], [40, 37.5]];
  return `<polyline points="${p.map(q => `${X(q[0])},${Y(q[1])}`).join(' ')}" fill="none" stroke="#eb6834" stroke-width="2.2" stroke-dasharray="7 5"/>` +
    et(X, Y, -50, 112, 'por encima del brazo hasta la punta: baja 13 mm', 'middle', '#b4461c') +
    et(X, Y, -80, 18, 'por debajo de la curva, empujándola: baja 28 mm', 'middle', '#b4461c') +
    et(X, Y, 98, czD[1] + 24, 'sube 41 mm', 'end', '#b4461c');
};
const abajo = dibuja(win, W, th, [czD], { extra: ruta });
// gráfica del barrido
const R = fs.readFileSync(path.join(__dirname, 'barrido.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const GW = 1180, GH = 470, L = 330, Rr = 40, xmin = -20, xmax = 140, gx = v => L + (Math.max(xmin, Math.min(xmax, v)) - xmin) / (xmax - xmin) * (GW - L - Rr);
const filas = [{ k: 'A', t: 'La palanca baja y sube la bola', t2: 'en la cazoleta', y: 150 }, { k: 'B', t: 'La bola pasa por debajo de la curva', t2: 'y devuelve la palanca arriba', y: 300 }];
let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${GW}" height="${GH}" viewBox="0 0 ${GW} ${GH}" font-family="Inter,Helvetica,Arial,sans-serif"><rect width="${GW}" height="${GH}" fill="#fcfcfb"/>`;
g += `<text x="24" y="38" font-size="24" font-weight="700" fill="#0b0b0b">Ninguna de las 2.000 variantes hace las dos mitades de la vuelta</text>`;
g += `<text x="24" y="66" font-size="16" fill="#52514e">Cada punto es una variante (contrapeso, pesos del brazo y de la curva, cazoleta, bola de vidrio o acero, con y sin rozamiento)</text>`;
// rejilla y eje
for (let v = 0; v <= 140; v += 20) { const x = gx(v); g += `<line x1="${x}" y1="100" x2="${x}" y2="${GH - 70}" stroke="#e8e7e2" stroke-width="1"/><text x="${x}" y="${GH - 50}" font-size="14" fill="#52514e" text-anchor="middle">${v} %</text>`; }
g += `<text x="${(L + GW - Rr) / 2}" y="${GH - 22}" font-size="15" fill="#52514e" text-anchor="middle">Lo que necesita la palanca vacía para volver arriba, en % de lo que cuesta subir la bola</text>`;
g += `<line x1="${gx(100)}" y1="92" x2="${gx(100)}" y2="${GH - 70}" stroke="#0b0b0b" stroke-width="1.5" stroke-dasharray="5 4"/>`;
g += `<text x="${gx(100) - 6}" y="${GH - 78}" font-size="13.5" fill="#0b0b0b" text-anchor="end">100 %: lo más que puede devolver la bola</text>`;
let s = 7; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
filas.forEach(f => {
  g += `<text x="24" y="${f.y - 4}" font-size="16" font-weight="600" fill="#0b0b0b">${f.t}</text><text x="24" y="${f.y + 18}" font-size="16" font-weight="600" fill="#0b0b0b">${f.t2}</text>`;
  const ok = R.filter(r => r[f.k]), no = R.filter(r => !r[f.k]);
  g += `<text x="24" y="${f.y + 42}" font-size="14" fill="#52514e">sale bien en ${ok.length} de ${String(R.length).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</text>`;
  [[no, '#c9c7c0', 0.55], [ok, '#2a78d6', 0.9]].forEach(([lst, c, op]) => lst.forEach(r => { const v = 100 * r.palanca_vuelve_mJ / r.subir_bola_mJ, yy = f.y + (rnd() - 0.5) * 70;
    g += `<circle cx="${gx(v).toFixed(1)}" cy="${yy.toFixed(1)}" r="3.2" fill="${c}" fill-opacity="${op}"/>`; }));
  const vs = ok.map(r => 100 * r.palanca_vuelve_mJ / r.subir_bola_mJ), lo = Math.min(...vs), hi = Math.max(...vs);
  const tx = f.k === 'A' ? `solo desde el ${lo.toFixed(0)} %` : `solo hasta el ${hi.toFixed(0)} %`;  // donde empiezan o acaban los azules
  g += `<text x="${f.k === 'A' ? gx(lo) - 15 : gx(hi) + 8}" y="${f.y - 44}" font-size="14" font-weight="600" fill="#1d5fae" text-anchor="start">${tx}</text>`;
});
g += `<circle cx="${GW - 250}" cy="34" r="5" fill="#2a78d6"/><text x="${GW - 240}" y="39" font-size="14" fill="#0b0b0b">sale bien</text><circle cx="${GW - 160}" cy="34" r="5" fill="#c9c7c0"/><text x="${GW - 150}" y="39" font-size="14" fill="#0b0b0b">no sale</text>`;
g += '</svg>';
(async () => {
  const { chromium } = require('playwright'); const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1240, height: 560 }, deviceScaleFactor: 2 });
  const tit = t => `<div style="font:600 17px Inter,Helvetica,Arial,sans-serif;margin:6px 0 8px;color:#0b0b0b">${t}</div>`;
  await pg.setContent(`<body style="margin:0;padding:18px 20px;background:#fcfcfb;width:1240px;box-sizing:border-box">
    <div style="font:700 24px Inter,Helvetica,Arial,sans-serif;color:#0b0b0b">Cómo entiendo el aparato de su captura</div>
    <div style="font:16px Inter,Helvetica,Arial,sans-serif;color:#52514e;margin:4px 0 6px">Medido sobre la foto con una canica de 25 mm. Es mi lectura de un solo fotograma: con más capturas de la vuelta entera lo ajusto.</div>
    <div style="display:flex;gap:20px"><div>${tit('Arriba, como en la foto: la bola acaba de caer en la cazoleta')}${arriba.svg}</div><div>${tit('Abajo: la curva se apoya en los raíles')}${abajo.svg}</div></div>
    <div style="font:15px Inter,Helvetica,Arial,sans-serif;color:#52514e;margin-top:10px">La bandeja de arriba, donde espera la otra bola, no está dibujada: solo la guarda hasta su turno; no sube ni baja nada. La bola pasa por el lado del eje y del brazo corto.</div></body>`);
  await pg.screenshot({ path: path.join(__dirname, 'como-lo-entiendo.png'), fullPage: true });
  await pg.setViewportSize({ width: GW, height: GH }); await pg.setContent(`<body style="margin:0">${g}</body>`);
  await pg.screenshot({ path: path.join(__dirname, 'barrido.png') });
  await br.close();
})();
