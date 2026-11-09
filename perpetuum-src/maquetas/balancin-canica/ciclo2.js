// El ciclo del usuario con sus tres escalones: el de la bobina (izquierda) y el de la V (centro) bajos, y el de
// la punta de la rampa (derecha) el más alto. Empieza con el palo arriba (la bobina en su escalón), el brazo y
// la rampa en línea recta cuesta abajo y la bola en la punta.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'ciclo2'; d.iters = 60;
  const PY = 0.30, XL = -0.26, al = (o.al || 20) * Math.PI / 180, La = o.La || 0.30, L = o.L || 0.22, TAB = -0.05;
  const yl = o.yl != null ? o.yl : 0.0;                // escalón de la bobina (bajo)
  // el palo arriba: la bobina apoyada en su escalón
  const rc = Math.hypot(XL + 0.01, 0.03), dropMax = (PY - 0.03 - 0.02 - 0.012) - yl;
  const th0 = o.unEscalon ? al - (o.inc != null ? o.inc : 3) * Math.PI / 180 : Math.min(Math.asin(Math.min(0.99, dropMax / Math.abs(XL + 0.01))), al - 3 * Math.PI / 180);
  const rot = p => [p[0] * Math.cos(th0) - (p[1] - PY) * Math.sin(th0), PY + p[0] * Math.sin(th0) + (p[1] - PY) * Math.cos(th0)];
  const u = [Math.cos(al), -Math.sin(al)], n0 = [Math.sin(al), Math.cos(al)];
  const A0 = [0.02, PY], B0 = [A0[0] + La * u[0], A0[1] + La * u[1]], E0 = [B0[0] + L * u[0], B0[1] + L * u[1]];
  const [A, B, E] = [A0, B0, E0].map(rot), n = rot([n0[0], PY + n0[1]]); n[1] -= PY;
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th || 0.006; d.parts.push(b); return b; };
  const weld = (x, y, a, b) => { const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const left = bar(rot([XL, PY]), A, 0.08);
  const piv = P.makePin(d, 0, PY, null, left.id); piv.mode = 'free'; piv.bearing = 'bolas'; d.parts.push(piv);
  const arm = bar(A, B, 0.06); weld(A[0], A[1], left, arm);
  const cpos = rot([XL + 0.01, PY - 0.03]);
  const coil = P.makeBall(d, cpos[0], cpos[1]); coil.r = 0.02; coil.m = o.mc || 0.05; coil.mat = 'acero'; d.parts.push(coil);
  const ch = rot([XL + 0.01, PY]); weld(ch[0], ch[1], left, coil);
  const ramp = bar(B, E, o.mr || 0.03);
  const stop = bar(E, [E[0] + 0.03 * n[0], E[1] + 0.03 * n[1]], 0.003); weld(E[0], E[1], ramp, stop);
  const h = P.makePin(d, B[0], B[1], arm.id, ramp.id); h.mode = 'limits'; h.lo = 0; h.hi = 80; h.bearing = 'bolas'; d.parts.push(h);
  const R = 0.01, f = 0.88, bx = B[0] + f * (E[0] - B[0]), by = B[1] + f * (E[1] - B[1]);
  const ball = P.makeBall(d, bx + (0.006 + R + 0.0005) * n[0], by + (0.006 + R + 0.0005) * n[1]); ball.r = R; ball.m = o.mb || 0.02; ball.mat = 'acero'; d.parts.push(ball);
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'goma'; d.parts.push(r); };
  pad(-0.40, TAB, 1.0, TAB, 'madera');                                    // la mesa
  if (!o.unEscalon) pad(cpos[0] - 0.06, yl, cpos[0] + 0.06, yl);          // escalón de la bobina (bajo)
  // escalón de la V (bajo) y escalón de la punta (el más alto), por debajo de la punta al empezar
  const ym = o.ym != null ? o.ym : 0.0, yr = E[1] - 0.006 - 0.012 - (o.hr != null ? o.hr : 0.03);
  if (!o.unEscalon) pad(B0[0] - 0.05, ym, B0[0] + 0.05, ym);
  pad(E0[0] - 0.07, yr, E0[0] + 0.05, yr);
  if (o.ideal) d.ideal = true;
  d._ids = { lever: left.id, ramp: ramp.id, ball: ball.id }; d._B = B0; d._E = E0; d._th0 = th0 * 180 / Math.PI; d._yr = yr; d._ym = ym;
  return d;
};
