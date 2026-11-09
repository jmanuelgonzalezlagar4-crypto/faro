// El balancín del segundo dibujo del usuario: el palo sale plano del eje y baja en V hasta el suelo; en el fondo
// de la V hay una bisagra con una rampa recta que sube hacia la derecha hasta la punta (con un tope).
// Palo arriba: la rampa cuelga y la bola rueda hasta la punta. Palo abajo: el fondo de la V se apoya en el suelo,
// la punta de la rampa en el escalón, la rampa sube hacia la punta y la bola baja rodando hasta el fondo de la V.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'uve2'; d.iters = 60;
  const PY = 0.22, XL = -0.26, A = [0.23, PY], B = [0.32, 0.045], L = o.L || 0.25, a0 = (o.a0 != null ? o.a0 : 10) * Math.PI / 180;
  const E = [B[0] + L * Math.cos(a0), B[1] + L * Math.sin(a0)];
  const bar = (p, q, m) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = 0.006; d.parts.push(b); return b; };
  const weld = (x, y, a, b) => { const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const lever = bar([XL, PY], A, 0.12);
  const piv = P.makePin(d, 0, PY, null, lever.id); piv.mode = 'free'; piv.bearing = 'bolas'; d.parts.push(piv);
  const s0 = bar([0.035, PY], [0.035, PY + 0.03], 0.004); weld(0.035, PY, lever, s0);
  const cw = P.makeBall(d, XL + 0.01, PY - 0.03); cw.r = 0.02; cw.m = o.mc || 0.06; cw.mat = 'acero'; d.parts.push(cw); weld(XL + 0.01, PY, lever, cw);
  const down = bar(A, B, 0.02); weld(A[0], A[1], lever, down);
  const ramp = bar(B, E, o.mr || 0.04);
  const stop = bar(E, [E[0] - 0.03 * Math.sin(a0), E[1] + 0.03 * Math.cos(a0)], 0.003); weld(E[0], E[1], ramp, stop);
  const h = P.makePin(d, B[0], B[1], down.id, ramp.id); h.mode = 'limits'; h.lo = o.lo != null ? o.lo : -25; h.hi = o.hi != null ? o.hi : 15; h.bearing = 'bolas'; d.parts.push(h);
  // la bola, al final de la rampa
  const R = 0.01, f = o.f != null ? o.f : 0.85, bx = B[0] + f * L * Math.cos(a0), by = B[1] + f * L * Math.sin(a0);
  const ball = P.makeBall(d, bx - (0.006 + R + 0.0005) * Math.sin(a0), by + (0.006 + R + 0.0005) * Math.cos(a0)); ball.r = R; ball.m = o.mb || 0.02; ball.mat = 'acero'; d.parts.push(ball);
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'goma'; d.parts.push(r); };
  pad(-0.35, -0.05, 1.0, -0.05, 'madera');                                   // la tabla
  pad(0.27, o.suelo != null ? o.suelo : 0.015, 0.37, o.suelo != null ? o.suelo : 0.015);   // el suelo de la V
  pad(E[0] - 0.06, o.esc != null ? o.esc : 0.04, E[0] + 0.06, o.esc != null ? o.esc : 0.04);  // el escalón, bajo la punta
  pad(-0.31, 0.12, -0.19, 0.12);                                             // el tope del contrapeso
  if (o.ideal) d.ideal = true;
  d._ids = { lever: lever.id, ramp: ramp.id, ball: ball.id };
  d._B = B; d._L = L;
  return d;
};
