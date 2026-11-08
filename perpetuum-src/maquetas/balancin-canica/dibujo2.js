// El balancín del cuarto dibujo del usuario: la bobina pegada a la punta izquierda del palo; el brazo derecho baja
// recto hasta el fondo de la V, que con el palo abajo se apoya en la almohadilla de abajo; desde ahí, con bisagra,
// la rampa sube empinada hasta un poste y sigue en un tramo plano por encima del escalón. La bola empieza junto al poste.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'dibujo2'; d.iters = 60;
  const PY = 0.22, XL = -0.26, A = [0.04, PY], B = [0.32, o.by != null ? o.by : 0.06], Pp = [0.56, o.py != null ? o.py : 0.14], T = [0.66, Pp[1]];
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th || 0.006; d.parts.push(b); return b; };
  const weld = (x, y, a, b) => { const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const lever = bar([XL, PY], A, 0.08);
  const piv = P.makePin(d, 0, PY, null, lever.id); piv.mode = 'free'; piv.bearing = 'bolas'; d.parts.push(piv);
  const down = bar(A, B, 0.05); weld(A[0], A[1], lever, down);
  const coil = P.makeBall(d, XL, PY - 0.03); coil.r = 0.02; coil.m = o.mc || 0.1; coil.mat = 'acero'; d.parts.push(coil); weld(XL, PY, lever, coil);
  const ramp = bar(B, Pp, o.mr || 0.03);
  const post = bar(Pp, [Pp[0], Pp[1] + 0.05], 0.003); weld(Pp[0], Pp[1], ramp, post);
  const tail = bar(Pp, T, 0.01); weld(Pp[0], Pp[1], ramp, tail);
  const h = P.makePin(d, B[0], B[1], down.id, ramp.id); h.mode = 'limits'; h.lo = o.lo != null ? o.lo : -30; h.hi = o.hi != null ? o.hi : 10; h.bearing = 'bolas'; d.parts.push(h);
  const R = 0.01, ang = Math.atan2(Pp[1] - B[1], Pp[0] - B[0]), f = 0.9, bx = B[0] + f * (Pp[0] - B[0]), by = B[1] + f * (Pp[1] - B[1]);
  const ball = P.makeBall(d, bx - (0.006 + R + 0.0005) * Math.sin(ang), by + (0.006 + R + 0.0005) * Math.cos(ang)); ball.r = R; ball.m = o.mb || 0.02; ball.mat = 'acero'; d.parts.push(ball);
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'goma'; d.parts.push(r); };
  pad(-0.40, -0.05, 1.0, -0.05, 'madera');                                                  // la mesa
  pad(B[0] - 0.05, o.suelo != null ? o.suelo : 0.02, B[0] + 0.05, o.suelo != null ? o.suelo : 0.02);  // la almohadilla de abajo (el suelo de la V)
  pad(T[0] - 0.06, o.esc != null ? o.esc : 0.09, T[0] + 0.04, o.esc != null ? o.esc : 0.09);           // el escalón, bajo el tramo plano
  pad(-0.31, 0.12, -0.19, 0.12);                                                             // el tope de la bobina
  if (o.ideal) d.ideal = true;
  d._ids = { lever: lever.id, ramp: ramp.id, ball: ball.id }; d._B = B;
  return d;
};
