// Dibuja el balancín de las fotos (segunda versión) de lado, como se ve en las fotos. escena2(o, tiempos, ancho) → [{t, ang, svg}]
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
module.exports = function (o, times, W) {
  const d = require('./real2.js')(P, o), info = P.build(d), w = info.world, oo = d._o, tb = d._tabla;
  const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball], ramp = info.bodyOf[d._ids.ramp], cw = info.bodyOf[d._ids.cw];
  const x0 = -0.215, x1 = 0.27, y0 = tb - 0.012, y1 = oo.PY + 0.075, S = W / (x1 - x0), H = Math.round((y1 - y0) * S);
  const X = x => ((x - x0) * S).toFixed(1), Y = y => ((y1 - y) * S).toFixed(1), L = v => (v * S).toFixed(1);
  // puntos del palo y de la rampa, en sus cuerpos
  const lseg = lev.shapes.find(s2 => s2.t === 's'), lL = { x: lseg.ax, y: lseg.ay }, lR = { x: lseg.bx, y: lseg.by };
  const along = f => ({ x: lL.x + f * (lR.x - lL.x), y: lL.y + f * (lR.y - lL.y) });
  const B = d._B, rB = ramp.toLocal(B[0], B[1]), sh = ramp.shapes.find(s => s.t === 's'), shs = ramp.shapes.filter(s => s.t === 's');
  const cwc = cw.shapes.find(s => s.t === 'c'), hook = cw.shapes.find(s => s.t === 's');
  const out = [];
  times.forEach(tt => {
    while (w.t < tt - 1e-9) w.step();
    const g = (b, p) => b.toWorld(p.x, p.y);
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#f1efe9"/>`;
    s += `<rect x="0" y="${Y(tb)}" width="${W}" height="${L(tb - y0)}" fill="#e6d3b3"/>`;                                  // la tabla
    s += `<rect x="${X(0.012)}" y="${Y(0)}" width="${L(0.252)}" height="${L(0 - tb)}" fill="#c4c8cc"/>`;                  // la bandeja
    s += `<rect x="${X(0.012)}" y="${Y(0.004)}" width="${L(0.252)}" height="${L(0.004)}" fill="#d7dade"/>`;
    s += `<rect x="${X(0.095)}" y="${Y(0.002)}" width="${L(0.055)}" height="${L(0.002)}" fill="#151515"/>`;                // tira negra
    s += `<rect x="${X(0.185)}" y="${Y(oo.hs)}" width="${L(0.065)}" height="${L(oo.hs)}" fill="#b9bdc2"/><rect x="${X(0.185)}" y="${Y(oo.hs)}" width="${L(0.065)}" height="${L(0.003)}" fill="#151515"/>`;
    s += `<rect x="${X(-0.012)}" y="${Y(oo.PY + 0.02)}" width="${L(0.024)}" height="${L(oo.PY + 0.02 - tb)}" fill="#2a2522"/>`;   // poste
    // contrapeso: anilla y taco de arandelas
    const hc = g(cw, { x: cwc.x, y: cwc.y }), ha = g(cw, { x: hook.ax, y: hook.ay });
    s += `<line x1="${X(ha.x)}" y1="${Y(ha.y)}" x2="${X(hc.x)}" y2="${Y(hc.y + oo.rc)}" stroke="#8d8f91" stroke-width="2"/><ellipse cx="${X(hc.x)}" cy="${Y(hc.y + oo.rc + 0.004)}" rx="${L(0.022)}" ry="${L(0.008)}" fill="none" stroke="#8d8f91" stroke-width="2"/>`;
    s += `<rect x="${X(hc.x - 0.022)}" y="${Y(hc.y + oo.rc)}" width="${L(0.044)}" height="${L(2 * oo.rc)}" rx="${L(0.006)}" fill="#cfd4d8" stroke="#8c949b" stroke-width="1.5"/>`;
    for (let k = 1; k < 10; k++) s += `<line x1="${X(hc.x - 0.022 + k * 0.0044)}" y1="${Y(hc.y + oo.rc - 0.002)}" x2="${X(hc.x - 0.022 + k * 0.0044)}" y2="${Y(hc.y - oo.rc + 0.002)}" stroke="#9aa2a9" stroke-width="1"/>`;
    // el palo: pletina de 21 mm
    const a = g(lev, lL), b = g(lev, lR);
    s += `<line x1="${X(a.x)}" y1="${Y(a.y)}" x2="${X(b.x)}" y2="${Y(b.y)}" stroke="#b9bfc5" stroke-width="${L(0.021)}"/>`;
    s += `<line x1="${X(a.x)}" y1="${Y(a.y)}" x2="${X(b.x)}" y2="${Y(b.y)}" stroke="#d3d8dc" stroke-width="${L(0.006)}" transform="translate(0,${-L(0.0055)})"/>`;
    { const q = g(lev, along(0.013 / 0.298)); s += `<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="${L(0.0035)}" fill="#e9eaea" stroke="#777"/>`; }
    // la rueda negra
    const wh = info.bodyOf[d._ids.wheel], wsh = lev.shapes.filter(s2 => s2.t === 'c');
    wsh.forEach(c => { const q = g(lev, { x: c.x, y: c.y }); if (c.r > 0.008) s += `<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="${L(c.r)}" fill="#1a1a1a"/><circle cx="${X(q.x)}" cy="${Y(q.y)}" r="${L(0.003)}" fill="#444"/>`;
      else { const ux = b.x - a.x, uy = b.y - a.y, un = Math.hypot(ux, uy), e1 = { x: q.x - 0.012 * ux / un, y: q.y - 0.012 * uy / un }, e2 = { x: q.x + 0.012 * ux / un, y: q.y + 0.012 * uy / un };
        s += `<line x1="${X(e1.x)}" y1="${Y(e1.y)}" x2="${X(e2.x)}" y2="${Y(e2.y)}" stroke="#1a1a1a" stroke-width="${L(0.007)}"/>`; } });
    // la rampa y el tubo negro
    shs.forEach((c, k) => { const p1 = g(ramp, { x: c.ax, y: c.ay }), p2 = g(ramp, { x: c.bx, y: c.by });
      s += k === 0 ? `<line x1="${X(p1.x)}" y1="${Y(p1.y)}" x2="${X(p2.x)}" y2="${Y(p2.y)}" stroke="#b3b9bf" stroke-width="${L(2 * c.r + 0.004)}"/>`
                   : `<line x1="${X(p1.x)}" y1="${Y(p1.y)}" x2="${X(p2.x)}" y2="${Y(p2.y)}" stroke="#1d1d1d" stroke-width="${L(2 * c.r)}"/>`; });
    const hb = g(ramp, rB); s += `<circle cx="${X(hb.x - 0.003)}" cy="${Y(hb.y + 0.004)}" r="${L(0.0022)}" fill="#ddd" stroke="#666"/><circle cx="${X(hb.x + 0.004)}" cy="${Y(hb.y + 0.004)}" r="${L(0.0022)}" fill="#ddd" stroke="#666"/>`;
    s += `<circle cx="${X(0)}" cy="${Y(oo.PY)}" r="${L(0.0035)}" fill="#e9eaea" stroke="#555"/>`;
    // la canica
    s += `<circle cx="${X(ball.x)}" cy="${Y(ball.y)}" r="${L(oo.rb)}" fill="#5c8f52" stroke="#2c4a28" stroke-width="1.5"/><circle cx="${X(ball.x - 0.003)}" cy="${Y(ball.y + 0.004)}" r="${L(0.003)}" fill="#e7f1df"/>`;
    s += '</svg>';
    out.push({ t: tt, ang: d._th0 + (lev.a - lev.a0) * 180 / Math.PI, svg: s });
  });
  return out;
};
