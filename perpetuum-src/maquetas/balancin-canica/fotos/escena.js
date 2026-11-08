// Dibuja el balancín de las fotos en varios momentos (SVG). Uso desde otro script: escena(o, tiempos) → [svg, ...]
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
module.exports = function (o, times, W) {
  const d = require('./real.js')(P, o), info = P.build(d), w = info.world, oo = d._o;
  const ball = info.bodyOf[d._ids.ball], lev = info.bodyOf[d._ids.lever];
  const x0 = -0.20, x1 = 0.30, y0 = -0.03, y1 = 0.19, S = W / (x1 - x0), H = (y1 - y0) * S;
  const X = x => (x - x0) * S, Y = y => (y1 - y) * S, out = [];
  times.forEach(tt => {
    while (w.t < tt - 1e-9) w.step();
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H.toFixed(0)}" viewBox="0 0 ${W} ${H.toFixed(0)}"><rect width="${W}" height="${H}" fill="#f4f3ee"/>`;
    // tabla y bandeja
    s += `<rect x="${X(-0.30)}" y="${Y(oo.tabla)}" width="${(0.29) * S}" height="${(oo.tabla - y0) * S}" fill="#e3d3b4"/>`;
    s += `<rect x="${X(0.02)}" y="${Y(0)}" width="${0.26 * S}" height="${(0 - y0) * S}" fill="#c9cdd1"/>`;
    s += `<rect x="${X(0.08)}" y="${Y(0.001)}" width="${0.075 * S}" height="${0.004 * S}" fill="#1b1b1b"/>`;
    s += `<rect x="${X(0.175)}" y="${Y(oo.hs)}" width="${0.095 * S}" height="${oo.hs * S}" fill="#b9bec3"/><rect x="${X(0.175)}" y="${Y(oo.hs)}" width="${0.095 * S}" height="${0.004 * S}" fill="#1b1b1b"/>`;
    // poste
    s += `<rect x="${X(-0.012)}" y="${Y(oo.PY + 0.012)}" width="${0.024 * S}" height="${(oo.PY + 0.012 - oo.tabla) * S}" fill="#2b2b2b"/>`;
    w.bodies.forEach(b => { if (b.isStatic || b === ball) return; b.shapes.forEach(sh => {
      if (sh.t === 's') { const a = b.toWorld(sh.ax, sh.ay), c = b.toWorld(sh.bx, sh.by); s += `<line x1="${X(a.x)}" y1="${Y(a.y)}" x2="${X(c.x)}" y2="${Y(c.y)}" stroke="${sh.r < 0.003 ? '#b87333' : '#a9b1b9'}" stroke-width="${Math.max(2, 2 * sh.r * S)}" stroke-linecap="round"/>`; }
      if (sh.t === 'c') { const c = b.toWorld(sh.x, sh.y); s += `<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${sh.r * S}" fill="${sh.r < 0.012 ? '#1b1b1b' : '#c7ccd1'}" stroke="#7d858c" stroke-width="${sh.r < 0.012 ? 0 : 1.5}"/>`; } }); });
    s += `<circle cx="${X(0)}" cy="${Y(oo.PY)}" r="5" fill="#f2c94c" stroke="#333"/>`;
    s += `<circle cx="${X(ball.x)}" cy="${Y(ball.y)}" r="${ball.shapes[0].r * S}" fill="#3fa36b" stroke="#1d5a3a" stroke-width="1.5"/>`;
    const ang = oo.th0 + (lev.a - lev.a0) * 180 / Math.PI;
    s += '</svg>';
    out.push({ t: tt, ang, svg: s });
  });
  return out;
};
