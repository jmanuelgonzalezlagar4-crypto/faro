// Dibuja la rampa de lado (SVG): las tiras fijas, el imán fijo y la bola imantada con sus polos (rojo el norte, azul el
// sur), que giran con ella al rodar.
function ventana(S) { const xs = [S.C[0] - S.o.rh - 0.01, S.M[0] + S.o.tam / 2 + 0.015, S.R1[0] + 0.01], ys = [0, S.M[1] + S.o.tam / 2 + 0.01, S.Ep[1] + 0.03];
  return [Math.min(...xs) - 0.01, Math.max(...xs) + 0.01, -0.008, Math.max(...ys)]; }
function dibuja(S, W, win) {
  const w = S.w, [x0, x1, y0, y1] = win || ventana(S), k = W / (x1 - x0), H = Math.round((y1 - y0) * k), X = x => ((x - x0) * k).toFixed(1), Y = y => ((y1 - y) * k).toFixed(1), K = v => (v * k).toFixed(1);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#f6f5f1"/>`;
  s += `<rect x="0" y="${Y(0)}" width="${W}" height="${K(0.01)}" fill="#c9b49a"/>`;
  w.ground.ws.forEach(sh => { if (sh.t !== 's' || sh.r > 0.005) return; s += `<line x1="${X(sh.ax)}" y1="${Y(sh.ay)}" x2="${X(sh.bx)}" y2="${Y(sh.by)}" stroke="#6f97ab" stroke-width="${Math.max(1.5, 2 * sh.r * k)}" stroke-linecap="round"/>`; });
  const tam = new Map(); S.d.parts.filter(p => p.kind === 'magnet').forEach(p => (S.info.magnetOf[p.id] || []).forEach(m => tam.set(m, p.size)));
  w.magnets.forEach(m => { const sz = tam.get(m) || 0.02, a = (m.body ? m.body.a : 0) + (m.la || 0), h = sz / 2, deg = (-a * 180 / Math.PI).toFixed(1);
    if (m.body && !m.body.isStatic) { const r = S.o.rb; s += `<g transform="translate(${X(m.wx)},${Y(m.wy)}) rotate(${deg})"><path d="M0,${K(-r)} A${K(r)},${K(r)} 0 0,1 0,${K(r)} Z" fill="#d94032"/><path d="M0,${K(r)} A${K(r)},${K(r)} 0 0,1 0,${K(-r)} Z" fill="#2f6fd0"/><circle r="${K(r)}" fill="none" stroke="#333" stroke-width="1"/></g>`; }
    else s += `<g transform="translate(${X(m.wx)},${Y(m.wy)}) rotate(${deg})"><rect x="${K(-h)}" y="${K(-h * 0.5)}" width="${K(h)}" height="${K(h)}" fill="#2f6fd0"/><rect x="0" y="${K(-h * 0.5)}" width="${K(h)}" height="${K(h)}" fill="#d94032"/></g>`; });
  return s + '</svg>';
}
module.exports = { dibuja, ventana };
