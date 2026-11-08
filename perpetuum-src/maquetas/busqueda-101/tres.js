// Imagen de los 3 que más parecían dar: el aparato en varios momentos, la energía de más y la prueba que la quita.
const path = require('path'), fs = require('fs'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js');
const C = { fondo: '#f3f2ed', fijo: '#b9b3a6', barra: '#9aa3ab', bola: '#7b8692', plomo: '#5d6670', acero: '#8f9aa5', rueda: '#d9dde1', borde: '#7d858c', muelle: '#b07a2a', eje: '#f2c94c', rojo: '#d94032', azul: '#2f6fd0' };
// dibuja el mundo tal como está, en la ventana (x0..x1, y0..y1)
function dibuja(w, info, d, win, W, marcas) {
  const [x0, x1, y0, y1] = win, S = W / (x1 - x0), H = Math.round((y1 - y0) * S), X = x => ((x - x0) * S).toFixed(1), Y = y => ((y1 - y) * S).toFixed(1), L = v => (v * S).toFixed(1);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.fondo}"/>`;
  const tam = new Map(), partOfMag = new Map(); d.parts.filter(p => p.kind === 'magnet').forEach(p => { const m = info.magnetOf[p.id]; if (m) { tam.set(m, p.size || 0.02); partOfMag.set(m, p); } });
  const esIman = new Set(d.parts.filter(p => p.kind === 'magnet').map(p => p.id));
  w.tanks.forEach(t => { s += `<rect x="${X(t.x1)}" y="${Y(t.y2)}" width="${L(t.x2 - t.x1)}" height="${L(t.y2 - t.y1)}" fill="#cfe3f5"/>`; });
  // primero las ruedas grandes (fondo), luego lo demás
  const cuerpos = [...w.bodies].sort((a, b) => (b.shapes.some(q => q.t === 'c' && q.r > 0.08) ? 1 : 0) - (a.shapes.some(q => q.t === 'c' && q.r > 0.08) ? 1 : 0));
  cuerpos.forEach(b => b.shapes.forEach(sh => {
    if (sh.part && esIman.has(sh.part)) return;                       // los imanes se dibujan aparte
    if (sh.t === 's') { const a = b.toWorld(sh.ax, sh.ay), c = b.toWorld(sh.bx, sh.by); s += `<line x1="${X(a.x)}" y1="${Y(a.y)}" x2="${X(c.x)}" y2="${Y(c.y)}" stroke="${b.isStatic ? C.fijo : C.barra}" stroke-width="${Math.max(2, 2 * sh.r * S)}" stroke-linecap="round"/>`; }
    if (sh.t === 'c' || sh.t === 'k') { const c = b.toWorld(sh.x || 0, sh.y || 0), p = d.parts.find(q => q.id === sh.part) || {};
      if (sh.r > 0.08) { s += `<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${L(sh.r)}" fill="${C.rueda}" stroke="${C.borde}" stroke-width="2"/>`; for (let k = 0; k < 6; k++) { const a = b.a + k * Math.PI / 3; s += `<line x1="${X(c.x)}" y1="${Y(c.y)}" x2="${X(c.x + sh.r * Math.cos(a))}" y2="${Y(c.y + sh.r * Math.sin(a))}" stroke="${C.borde}" stroke-width="1.5"/>`; } }
      else if (sh.t === 'k') { const pr = p.r || 0.05; s += `<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${L(pr)}" fill="#e8d9b5" stroke="#a88a4a" stroke-width="2"/><line x1="${X(c.x)}" y1="${Y(c.y)}" x2="${X(c.x + pr * Math.cos(b.a))}" y2="${Y(c.y + pr * Math.sin(b.a))}" stroke="#a88a4a" stroke-width="2"/>`; }
      else s += `<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${L(sh.r)}" fill="${p.mat === 'plomo' ? C.plomo : p.mat === 'goma' ? '#3a3a3a' : p.mat === 'madera' ? '#c9a46a' : C.acero}" stroke="#4a525a" stroke-width="1.2"/>`; }
  }));
  w.springs.forEach(sp => { const a = sp.a.toWorld(sp.lax, sp.lay), b = sp.b.toWorld(sp.lbx, sp.lby), n = 12, dx = b.x - a.x, dy = b.y - a.y, Ln = Math.hypot(dx, dy) || 1, nx = -dy / Ln, ny = dx / Ln; let pts = `${X(a.x)},${Y(a.y)}`;
    for (let k = 1; k < n; k++) { const f = k / n, o = (k % 2 ? 1 : -1) * 0.008; pts += ` ${X(a.x + f * dx + o * nx)},${Y(a.y + f * dy + o * ny)}`; } pts += ` ${X(b.x)},${Y(b.y)}`; s += `<polyline points="${pts}" fill="none" stroke="${C.muelle}" stroke-width="2"/>`; });
  w.magnets.forEach(m => { const sz = tam.get(m) || 0.02, p = partOfMag.get(m) || {}, ang = (m.body ? m.body.a : 0) + (m.la || 0), c = Math.cos(ang), sn = Math.sin(ang), hl = sz / 2, hw = sz / 4;
    if (p.shape === 'electro') { s += `<rect x="${X(m.wx - hl)}" y="${Y(m.wy + hl)}" width="${L(sz)}" height="${L(sz)}" rx="3" fill="#c98a3a" stroke="#7a4d12" stroke-width="1.5"/>`; return; }
    const pa = [m.wx + hl * c, m.wy + hl * sn], pb = [m.wx - hl * c, m.wy - hl * sn];
    s += `<line x1="${X(m.wx)}" y1="${Y(m.wy)}" x2="${X(pa[0])}" y2="${Y(pa[1])}" stroke="${C.rojo}" stroke-width="${L(2 * hw)}"/><line x1="${X(m.wx)}" y1="${Y(m.wy)}" x2="${X(pb[0])}" y2="${Y(pb[1])}" stroke="${C.azul}" stroke-width="${L(2 * hw)}"/>`; });
  w.joints.forEach(j => { if (!j.a.isStatic && !j.b.isStatic) return; const q = (j.a.isStatic ? j.b : j.a), loc = j.a.isStatic ? { x: j.lbx, y: j.lby } : { x: j.lax, y: j.lay }; if (loc.x == null) return; const p = q.toWorld(loc.x, loc.y); s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="${C.eje}" stroke="#333"/>`; });
  (marcas || []).forEach(mk => { s += `<circle cx="${X(mk.x)}" cy="${Y(mk.y)}" r="${mk.r || 16}" fill="none" stroke="${C.rojo}" stroke-width="3"/>`; });
  return s + '</svg>';
}
// serie de la energía de más (mJ) con una modificación opcional del diseño
function serie(fam, seed, n, T, mod, div) {
  const d = diseno(fam, seed, n); if (mod) mod(d); if (div > 1) { d.dt = 1 / (480 * div); d.iters = 120; }
  const info = P.build(d), w = info.world, L = w.ledger, out = []; let next = 0;
  while (w.t < T) { w.step(); if (w.t + 1e-9 >= next) { next += T / 300; const b = w.balance(); out.push([w.t, 1000 * (-b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn)]); } }
  return out;
}
function grafica(series, T, W, H, ymax) {
  const px0 = 52, px1 = W - 14, py0 = 12, py1 = H - 30, ymin = Math.min(0, ...series.flatMap(s => s.d.map(p => p[1]))), yM = ymax || Math.max(1, ...series.flatMap(s => s.d.map(p => p[1])));
  const X = t => px0 + t / T * (px1 - px0), Y = v => py1 - (v - ymin) / (yM - ymin) * (py1 - py0);
  let g = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Inter, Helvetica, Arial, sans-serif">`;
  const paso = Math.pow(10, Math.floor(Math.log10(yM - ymin))) * ((yM - ymin) / Math.pow(10, Math.floor(Math.log10(yM - ymin))) > 4 ? 2 : 1) / 2;
  for (let v = Math.ceil(ymin / paso) * paso; v <= yM + 1e-9; v += paso) g += `<line x1="${px0}" x2="${px1}" y1="${Y(v)}" y2="${Y(v)}" stroke="${Math.abs(v) < 1e-9 ? '#bdbcb5' : '#e6e5e0'}"/><text x="${px0 - 6}" y="${Y(v) + 4}" font-size="11" fill="#8a8984" text-anchor="end">${(+v.toFixed(2)).toString().replace('.', ',').replace('-', '−')}</text>`;
  for (let k = 0; k <= 4; k++) { const t = T * k / 4; g += `<text x="${X(t)}" y="${py1 + 16}" font-size="11" fill="#8a8984" text-anchor="middle">${(+t.toFixed(2)).toString().replace('.', ',')} s</text>`; }
  g += `<text x="6" y="${py0 + 2}" font-size="11" fill="#52514e" transform="rotate(-90 10 ${(py0 + py1) / 2}) translate(-40,0)"></text>`;
  series.forEach(s => { g += `<polyline fill="none" stroke="${s.c}" stroke-width="2.2" ${s.dash ? 'stroke-dasharray="6 4"' : ''} points="${s.d.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/>`; });
  return g + '</svg>';
}
function fotos(fam, seed, n, tiempos, win, W, extra) {
  const d = diseno(fam, seed, n), info = P.build(d), w = info.world, out = [];
  if (extra && extra.antes) out.push({ t: 'diseño', svg: extra.antes(d, info, w, win, W) });
  tiempos.forEach(t => { while (w.t < t - 1e-9) w.step(); const mk = extra && extra.marcas ? extra.marcas(w) : []; out.push({ t, svg: dibuja(w, info, d, win, W, mk) }); });
  return out;
}
const apretadas = w => w.contacts.filter(c => !(c.A.isStatic && c.B.isStatic) && c.sep < -0.0025).map(c => ({ x: c.px, y: c.py }));
// --- 1. péndulos 1942
const pW = [-0.25, 0.75, 0.2, 0.9];
const f1 = fotos('pendulos', 1, 1942, [0, 0.1, 1.0], pW, 330, { marcas: apretadas });
const g1 = grafica([{ d: serie('pendulos', 1, 1942, 2), c: '#d94032' }, { d: serie('pendulos', 1, 1942, 2, null, 8), c: '#e8a33a', dash: true },
  { d: serie('pendulos', 1, 1942, 2, d => { let k = 0; d.parts.filter(p => p.kind === 'pin' && p.a == null).forEach(pin => { k++; const bar = d.parts.find(p => p.id === pin.b); bar.plane = k; d.parts.filter(p => p.kind === 'pin' && p.a === bar.id).forEach(w => { const b = d.parts.find(q => q.id === w.b); if (b) b.plane = k; }); }); }), c: '#2f6fd0' }], 2, 520, 200);
// --- 2. leva 1209
const lW = [-0.35, 0.35, 0.15, 0.75];
const f2 = fotos('levaIman', 2, 1209, [0, 0.0021, 1.0], lW, 330);
const s2 = serie('levaIman', 2, 1209, 1), r2 = s2.find(p => p[0] >= 0.1)[1];
const g2 = grafica([{ d: s2, c: '#d94032' }, { d: s2.filter(p => p[0] >= 0.1).map(p => [p[0], p[1] - r2]), c: '#2f6fd0' }], 1, 520, 200);
// --- 3. mezcla 508
const mW = [-0.05, 0.75, 0.1, 0.75];
const f3 = fotos('mezcla', 2, 508, [0, 0.5, 1.0], mW, 245, { marcas: w => [], antes: (d, info, w, win, W) => {
  const b = info.bodyOf['p5'], sx = b.x, sy = b.y, p = d.parts.find(q => q.id === 'p5'); b.x = p.x; b.y = p.y; b.updateWorld(); const svg = dibuja(w, info, d, win, W, [{ x: p.x, y: p.y, r: 22 }]); b.x = sx; b.y = sy; b.updateWorld(); return svg; } });
const g3 = grafica([{ d: serie('mezcla', 2, 508, 10), c: '#d94032' }, { d: serie('mezcla', 2, 508, 10, null, 8), c: '#e8a33a', dash: true },
  { d: serie('mezcla', 2, 508, 10, d => { d.parts.find(p => p.id === 'p5').plane = 3; }), c: '#2f6fd0' }], 10, 520, 200);
const fig = (svg, cap, w) => `<figure style="margin:0;width:${w}px"><div style="border-radius:6px;overflow:hidden;line-height:0">${svg}</div><figcaption>${cap}</figcaption></figure>`;
const ley = items => `<div class="ley">${items.map(([c, t, dash]) => `<span><i style="background:${dash ? 'repeating-linear-gradient(90deg,' + c + ' 0 6px,transparent 6px 10px)' : c}"></i>${t}</span>`).join('')}</div>`;
const sec = (tit, sub, fs, g, leyenda, nota, fw) => `<section><h2>${tit}</h2><p>${sub}</p><div class="row">${fs.map(f => fig(f.svg, f.cap, fw || 330)).join('')}</div>
  <div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div style="width:520px;flex:none"><div class="gt">Energía de más (mJ)</div>${g}${ley(leyenda)}</div><div class="nota">${nota}</div></div></section>`;
f1[0].cap = '0 s: los péndulos empiezan apoyados uno en otro. En rojo, donde se meten más de 2,5 mm.'; f1[1].cap = '0,1 s: el banco los separa a empujones y los sube.'; f1[2].cap = '1 s: se quedan más altos que al empezar.';
f2[0].cap = '0 s: la rueda (con la leva soldada) y la palanca con su imán.'; f2[1].cap = 'Tras el primer paso, 1/480 s: la rueda, de 2,7 kg, sube 4,8 mm de golpe.'; f2[2].cap = '1 s: gira, y a partir de ahí todo cuadra.';
f3[0].cap = 'Como salió del sorteo: la bola de plomo del muelle, dentro de la rueda (círculo rojo). Imposible de construir.'; f3[1].cap = '0 s: el banco la ha sacado fuera, pero el muelle la sigue apretando contra la rueda.'; f3[2].cap = '0,5 s: la bola roza la rueda mientras sube y baja.'; f3[3].cap = '1 s';
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;width:1100px;padding:26px 30px;box-sizing:border-box}
h1{font-size:24px;margin:0 0 6px}h2{font-size:19px;margin:26px 0 4px}p{color:#52514e;font-size:14px;margin:0 0 10px;line-height:1.4}figcaption{font-size:12.5px;color:#52514e;margin-top:5px;line-height:1.35}.row{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px}
.gt{font-size:12.5px;color:#52514e;margin:2px 0 2px 4px}.ley{display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;margin:2px 0 0 52px}.ley i{display:inline-block;width:18px;height:4px;border-radius:2px;margin:0 6px 3px 0;vertical-align:middle}
.nota{width:470px;font-size:14px;line-height:1.45;padding-top:18px}section{border-top:1px solid #e3e2dc;padding-top:4px}</style>
<h1>Los 3 que más parecían dar, y por qué no</h1><p>Sin aire ni rozamiento. Imanes: rojo y azul son sus dos polos. Ejes fijos en amarillo, muelles en marrón.</p>
${sec('1. Tres péndulos con imanes y un muelle (nº 1942): 735,6 %', 'El más alto de los 30.200. Tres péndulos de 0,5 a 0,7 kg con imanes en la punta, y un muelle entre dos de ellos.', f1, g1,
  [['#d94032', 'Tal cual'], ['#e8a33a', 'Paso 8 veces más fino', true], ['#2f6fd0', 'Cada péndulo en su plano, sin poder tocarse']],
  'Los péndulos empiezan apoyados uno en otro, y la bola de uno se mete 5,6 mm en el palo del otro. El banco los separa a empujones y, al hacerlo, los sube: unos 64 mJ que nadie ha puesto. <b>Con un paso más fino pasa lo mismo</b>, así que no es redondeo. <b>Si no pueden tocarse</b>, uno delante de otro como en un aparato de verdad, no sobra nada.')}
${sec('2. Leva con imanes y muelle (nº 1209): 147,4 %', 'El más alto de los aparatos mixtos. Una rueda de 2,7 kg con una leva soldada, una palanca con imán que sube y baja, imanes fijos y un muelle.', f2, g2,
  [['#d94032', 'Tal cual'], ['#2f6fd0', 'Contando desde los 0,1 s']],
  'La rueda y la leva van soldadas, y cada una tiene su propio eje. En el primer paso de cálculo el banco las encaja de golpe: la rueda sube 4,8 mm y eso mete 125 mJ de una sola vez. <b>A partir de ahí no sobra nada</b>: contando desde los 0,1 s se queda en 0. Un aparato de más del 100 % tendría que ganar en cada vuelta.')}
${sec('3. Rueda con imanes, bola en un muelle y péndulo (nº 508): 101,6 %', 'El que más aguantó las comprobaciones: con un paso 8 veces más fino y desde los 0,1 s, todavía un 103 %.', f3, g3,
  [['#d94032', 'Tal cual'], ['#e8a33a', 'Paso 8 veces más fino', true], ['#2f6fd0', 'La bola sin tocar la rueda']],
  'El sorteo puso la bola del muelle dentro de la rueda. El banco la sacó al empezar, pero el muelle la sigue apretando contra el borde. En cada paso el banco la separa un poco y estira el muelle sin apuntarlo, así que la energía va subiendo mientras la bola roza la rueda, y deja de subir en cuanto deja de rozarla: no se repite vuelta tras vuelta. <b>Si la bola no toca la rueda, o sin muelle, no sobra nada.</b>', 245)}`;
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: path.join(__dirname, 'tres-mejores.png'), fullPage: true }); await b.close(); })();
