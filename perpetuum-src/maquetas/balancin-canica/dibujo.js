// El balancín como lo pinta el usuario (tercer dibujo): la bobina cuelga de la punta izquierda y llega casi a la
// mesa; el brazo derecho baja recto desde el eje hasta el fondo de la V; en el fondo de la V, una bisagra con la
// rampa que sube hasta la punta, que acaba en gancho. La bola empieza junto al gancho.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'uve3'; d.iters = 60;
  const PY = 0.22, XL = -0.26, A = [0.04, 0.215], B = [0.32, 0.05], Ex = 0.58, Ey = o.ey != null ? o.ey : 0.10, TAB = -0.05;
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th || 0.006; d.parts.push(b); return b; };
  const weld = (x, y, a, b) => { const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const lever = bar([XL, PY], [A[0], PY], 0.08);
  const piv = P.makePin(d, 0, PY, null, lever.id); piv.mode = 'free'; piv.bearing = 'bolas'; d.parts.push(piv);
  const down = bar([A[0], PY], B, 0.05); weld(A[0], PY, lever, down);
  // la bobina colgada: una varilla con bisagra en la punta izquierda; casi toca la mesa
  const Lc = o.Lc || (PY - (TAB + 0.012) - 0.02 - (o.hueco != null ? o.hueco : 0.01));
  const rod = bar([XL, PY], [XL, PY - Lc + 0.02], 0.005, 0.002); rod.plane = 1;
  const hk = P.makePin(d, XL, PY, lever.id, rod.id); hk.mode = 'free'; hk.bearing = 'bolas'; d.parts.push(hk);
  const coil = P.makeBall(d, XL, PY - Lc); coil.r = 0.02; coil.m = o.mc || 0.08; coil.mat = 'acero'; d.parts.push(coil); weld(XL, PY - Lc, rod, coil);
  // la rampa, con bisagra en el fondo de la V, y el gancho al final
  const ramp = bar(B, [Ex, Ey], o.mr || 0.04);
  const ang = Math.atan2(Ey - B[1], Ex - B[0]);
  const hook = bar([Ex, Ey], [Ex - 0.03 * Math.sin(ang), Ey + 0.03 * Math.cos(ang)], 0.003); weld(Ex, Ey, ramp, hook);
  const h = P.makePin(d, B[0], B[1], down.id, ramp.id); h.mode = 'limits'; h.lo = o.lo != null ? o.lo : -20; h.hi = o.hi != null ? o.hi : 20; h.bearing = 'bolas'; d.parts.push(h);
  // la bola, junto al gancho
  const R = 0.01, f = 0.9, bx = B[0] + f * (Ex - B[0]), by = B[1] + f * (Ey - B[1]);
  const ball = P.makeBall(d, bx - (0.006 + R + 0.0005) * Math.sin(ang), by + (0.006 + R + 0.0005) * Math.cos(ang)); ball.r = R; ball.m = o.mb || 0.02; ball.mat = 'acero'; d.parts.push(ball);
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'goma'; d.parts.push(r); };
  pad(-0.40, TAB, 1.0, TAB, 'madera');                                                   // la mesa
  pad(B[0] - 0.06, o.suelo != null ? o.suelo : 0.0, B[0] + 0.06, o.suelo != null ? o.suelo : 0.0);   // el suelo de la V
  pad(Ex - 0.06, o.esc != null ? o.esc : 0.05, Ex + 0.06, o.esc != null ? o.esc : 0.05);           // el escalón, bajo la punta
  if (o.ideal) d.ideal = true;
  d._ids = { lever: lever.id, ramp: ramp.id, ball: ball.id, coil: coil.id }; d._B = B;
  return d;
};
