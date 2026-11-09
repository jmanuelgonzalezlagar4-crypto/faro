// Dibuja la pista vista desde arriba (SVG): el canal, los imanes (rojo el norte, azul el sur) y la bola o el carrito.
// la ventana (medio ancho, en m): que quepan la pista y todos los imanes
function ventana(M) { const tam = new Map(); M.d.parts.filter(p => p.kind === 'magnet').forEach(p => (M.info.magnetOf[p.id] || []).forEach(m => tam.set(m, p.size)));
  return Math.max(M.o.R + 0.05, ...M.w.magnets.map(m => Math.hypot(m.wx, m.wy) + (tam.get(m) || 0.02) / 2 + 0.01)); }
function dibuja(M, W, o) {
  o = o || {}; const w = M.w, R = M.o.R;
  const L = o.L || ventana(M), S = W / (2 * L), X = x => ((x + L) * S).toFixed(1), Y = y => ((L - y) * S).toFixed(1), K = v => (v * S).toFixed(1);
  const cara = M.o.movil === 'bola' ? M.o.rb : 0.012;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><rect width="${W}" height="${W}" fill="#f6f5f1"/>`;
  s += `<circle cx="${X(0)}" cy="${Y(0)}" r="${K(R)}" fill="none" stroke="#d9d6cc" stroke-width="${K(2 * cara + 0.006)}"/>`;
  s += `<circle cx="${X(0)}" cy="${Y(0)}" r="${K(R + cara + 0.003)}" fill="none" stroke="#b9b3a6" stroke-width="1.5"/><circle cx="${X(0)}" cy="${Y(0)}" r="${K(R - cara - 0.003)}" fill="none" stroke="#b9b3a6" stroke-width="1.5"/>`;
  const tam = new Map(); M.d.parts.filter(p => p.kind === 'magnet').forEach(p => (M.info.magnetOf[p.id] || []).forEach(m => tam.set(m, p.size)));
  w.magnets.forEach(m => { const sz = tam.get(m) || 0.02, a = (m.body ? m.body.a : 0) + (m.la || 0), c = Math.cos(a), sn = Math.sin(a), h = sz / 2;
    s += `<g transform="translate(${X(m.wx)},${Y(m.wy)}) rotate(${(-a * 180 / Math.PI).toFixed(1)})"><rect x="${K(-h)}" y="${K(-h * 0.45)}" width="${K(h)}" height="${K(h * 0.9)}" fill="#2f6fd0"/><rect x="0" y="${K(-h * 0.45)}" width="${K(h)}" height="${K(h * 0.9)}" fill="#d94032"/></g>`; });
  const b = M.b;
  if (M.o.movil === 'bola') s += `<circle cx="${X(b.x)}" cy="${Y(b.y)}" r="${K(M.o.rb)}" fill="#8f9aa5" stroke="#4a525a" stroke-width="1.2"/>`;
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(b.x)}" y2="${Y(b.y)}" stroke="#c9c7c0" stroke-width="1" stroke-dasharray="3 3"/><circle cx="${X(0)}" cy="${Y(0)}" r="4" fill="#f2c94c" stroke="#555"/>`;
  return s + (o.extra || '') + '</svg>';
}
module.exports = { dibuja, ventana };
