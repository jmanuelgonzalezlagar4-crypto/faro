const R = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'compara.json'), 'utf8'));
const C = { s1: '#2a78d6', s2: '#eb6834', s3: '#1baf7a', coil: '#6250d6', bola: '#eda100', ink: '#0b0b0b', ink2: '#52514e', mute: '#8a8984', grid: '#e6e5e0', bg: '#fcfcfb' };
const W = 900, font = 'font-family="Inter, Helvetica, Arial, sans-serif"';
let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="1080" ${font}><rect width="${W}" height="1080" fill="${C.bg}"/>`;
const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 15}" fill="${o.c || C.ink}" ${o.a ? `text-anchor="${o.a}"` : ''} ${o.w ? `font-weight="${o.w}"` : ''}>${t}</text>`;
// ---- panel 1: el ángulo del palo
s += T(32, 44, '¿Qué levanta el palo? Probado en el banco', { fs: 24, w: 600 });
s += T(32, 72, 'Ángulo del palo en el mejor diseño (bola de 7 g, bobina de 19 g). Tres pruebas: la bola libre, pegada en la punta y sin bola.', { fs: 14, c: C.ink2 });
const px0 = 80, px1 = W - 40, py0 = 150, py1 = 470, t1 = 3.5, a0 = -15, a1 = 35;
const X = t => px0 + (t / t1) * (px1 - px0), Y = a => py1 - (a - a0) / (a1 - a0) * (py1 - py0);
for (let a = -10; a <= 30; a += 10) { s += `<line x1="${px0}" x2="${px1}" y1="${Y(a)}" y2="${Y(a)}" stroke="${a === 0 ? '#cfcec8' : C.grid}" stroke-width="1"/>` + T(px0 - 10, Y(a) + 5, a + '°', { a: 'end', fs: 13, c: C.mute }); }
for (let t = 0; t <= 3.5; t += 0.5) s += T(X(t), py1 + 22, String(t).replace('.', ',') + ' s', { a: 'middle', fs: 13, c: C.mute });
s += `<line x1="${px0}" x2="${px1}" y1="${Y(30.3)}" y2="${Y(30.3)}" stroke="${C.ink2}" stroke-width="1.5" stroke-dasharray="6 5"/>` + T(px1, Y(30.3) - 8, 'Donde empezó: 30°. Para repetir, tendría que volver aquí', { a: 'end', fs: 13, c: C.ink2 });
const cols = [C.s1, C.s2, C.s3], noms = ['Bola libre: va al fondo de la V', 'Bola pegada en la punta: nunca va a la V', 'Sin bola'];
R.forEach((r, i) => {
  const pts = r.serie.map((a, k) => [k * 0.01 + 0.01, a]).filter(p => p[0] <= t1);
  s += `<polyline fill="none" stroke="${cols[i]}" stroke-width="2.2" stroke-linejoin="round" points="${pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/>`;
  // el pico después de lo más bajo
  let kmin = 0; pts.forEach((p, k) => { if (p[1] < pts[kmin][1]) kmin = k; });
  let kmax = kmin; for (let k = kmin; k < pts.length; k++) if (pts[k][1] > pts[kmax][1]) kmax = k;
  s += `<circle cx="${X(pts[kmax][0])}" cy="${Y(pts[kmax][1])}" r="5" fill="${cols[i]}" stroke="${C.bg}" stroke-width="2"/>`;
});
// leyenda con los valores
const ly = 104;
R.forEach((r, i) => { const x = 32 + i * 290; s += `<rect x="${x}" y="${ly - 6}" width="18" height="4" rx="2" fill="${cols[i]}"/>` + T(x + 26, ly, noms[i], { fs: 13 }) + T(x + 26, ly + 18, `baja a ${String(r.baja_a).replace('.', ',').replace('-', '−')}° y sube a ${String(r.sube_luego_a).replace('.', ',')}°`, { fs: 13, c: C.ink2, w: 600 }); });
s += T(X(0.62), Y(-14) + 2, '↑ la punta se apoya en el escalón: se forma la V', { fs: 13, c: C.ink2 });
s += T(X(1.15), Y(22), 'Las tres suben casi igual: lo que levanta el palo no es la bola', { fs: 14, c: C.ink, w: 600 });
// ---- panel 2: cuánto tira cada lado
const by0 = 560;
s += T(32, by0, 'Cuánto tira cada lado del palo, con el palo abajo del todo (−11,5°)', { fs: 20, w: 600 });
s += T(32, by0 + 26, 'Peso × distancia al eje, en N·cm. Gana el lado que tira más.', { fs: 14, c: C.ink2 });
s += `<rect x="32" y="${by0 + 44}" width="14" height="14" rx="3" fill="${C.coil}"/>` + T(54, by0 + 56, 'Lado de la bobina', { fs: 13 }) + `<rect x="200" y="${by0 + 44}" width="14" height="14" rx="3" fill="${C.bola}"/>` + T(222, by0 + 56, 'Lado de la bola (brazo, rampa y bola)', { fs: 13 });
const casos = [
  ['Punta de la rampa en el escalón,', 'bola en la punta', 14.58, 10.98, 'gana la bobina'],
  ['Punta de la rampa en el escalón,', 'bola en el fondo de la V', 14.58, 12.25, 'gana la bobina, por menos'],
  ['Rampa sin apoyar en el escalón,', 'bola en el fondo de la V', 14.58, 18.28, 'gana el lado de la bola'],
  ['Rampa sin apoyar en el escalón,', 'bola en la punta', 14.58, 20.44, 'gana el lado de la bola'],
];
const bx0 = 300, bx1 = 760, vmax = 22, BX = v => bx0 + v / vmax * (bx1 - bx0), bh = 16;
casos.forEach((c, i) => {
  const y = by0 + 90 + i * 100;
  s += T(32, y + 14, c[0], { fs: 14, c: C.ink2 }) + T(32, y + 33, c[1], { fs: 14, w: 600 });
  s += `<rect x="${bx0}" y="${y}" width="${BX(c[2]) - bx0}" height="${bh}" rx="3" fill="${C.coil}"/>` + T(BX(c[2]) + 8, y + 13, c[2].toFixed(1).replace('.', ','), { fs: 13 });
  s += `<rect x="${bx0}" y="${y + bh + 2}" width="${BX(c[3]) - bx0}" height="${bh}" rx="3" fill="${C.bola}"/>` + T(BX(c[3]) + 8, y + bh + 15, c[3].toFixed(1).replace('.', ','), { fs: 13 });
  s += T(bx0, y + 2 * bh + 24, '→ ' + c[4], { fs: 13, c: C.ink, w: 600 });
});
s += `<line x1="${bx0}" x2="${bx0}" y1="${by0 + 80}" y2="${by0 + 470}" stroke="#cfcec8"/>`;
s += T(32, 1046, 'Con la punta en el escalón, el escalón aguanta parte de la rampa, y casi toda la bola si está en la punta.', { fs: 13.5, c: C.ink2 }) + T(32, 1066, 'Al bajar al fondo de la V, la bola pasa su peso del escalón al palo: el lado de la bola pesa más, no menos.', { fs: 13.5, c: C.ink2 });
s += '</svg>';
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W, height: 1080 }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0">${s}</body>`); await p.screenshot({ path: require('path').join(__dirname, 'que-sube-el-palo.png') }); await b.close(); })();
