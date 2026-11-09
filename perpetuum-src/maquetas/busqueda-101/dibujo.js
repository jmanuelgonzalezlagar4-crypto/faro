// Dibuja un aparato del banco (SVG): piezas fijas, barras, bolas, ruedas, levas, imanes, muelles y ejes.
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
module.exports = { dibuja, C };
