// El ciclo tal como lo explica el usuario: el brazo derecho baja recto desde el eje hasta una bisagra; de ella
// cuelga la rampa, que puede quedar recta (en línea con el brazo) o doblarse hacia arriba formando una V.
// 1. Bola en la punta: pesa más su lado, baja; la punta de la rampa se apoya en el escalón y se forma la V.
// 2. La bola rueda al fondo de la V: está más cerca del eje, gana la bobina y levanta el palo.
// 3. Al levantarse, la V se pone recta, la bola rueda otra vez hasta la punta, y vuelta a empezar.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'ciclo'; d.iters = 60;
  const PY = 0.30, XL = -0.26, al = (o.al || 25) * Math.PI / 180, La = o.La || 0.30, L = o.L || 0.22;
  const A = [0.02, PY], u = [Math.cos(al), -Math.sin(al)];
  const B = [A[0] + La * u[0], A[1] + La * u[1]], E = [B[0] + L * u[0], B[1] + L * u[1]];
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th || 0.006; d.parts.push(b); return b; };
  const weld = (x, y, a, b) => { const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const left = bar([XL, PY], A, 0.08);
  const piv = P.makePin(d, 0, PY, null, left.id); piv.mode = 'free'; piv.bearing = 'bolas'; d.parts.push(piv);
  const arm = bar(A, B, 0.06); weld(A[0], A[1], left, arm);
  const coil = P.makeBall(d, XL + 0.01, PY - 0.03); coil.r = 0.02; coil.m = o.mc || 0.06; coil.mat = 'acero'; d.parts.push(coil); weld(XL + 0.01, PY, left, coil);
  const ramp = bar(B, E, o.mr || 0.03);
  const n = [Math.sin(al), Math.cos(al)];   // perpendicular hacia arriba de la rampa
  const stop = bar(E, [E[0] + 0.03 * n[0], E[1] + 0.03 * n[1]], 0.003); weld(E[0], E[1], ramp, stop);
  // bisagra: la rampa no cuelga más que en línea con el brazo (0) y se puede doblar hacia arriba (V)
  const h = P.makePin(d, B[0], B[1], arm.id, ramp.id); h.mode = 'limits'; h.lo = 0; h.hi = o.hi || 80; h.bearing = 'bolas'; d.parts.push(h);
  const R = 0.01, f = 0.88, bx = B[0] + f * L * u[0], by = B[1] + f * L * u[1];
  const ball = P.makeBall(d, bx + (0.006 + R + 0.0005) * n[0], by + (0.006 + R + 0.0005) * n[1]); ball.r = R; ball.m = o.mb || 0.02; ball.mat = 'acero'; d.parts.push(ball);
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'goma'; d.parts.push(r); };
  pad(-0.40, -0.05, 1.0, -0.05, 'madera');                                         // la mesa
  const ys = E[1] - 0.006 - 0.012 - (o.hueco != null ? o.hueco : 0.005);           // el escalón, justo debajo de la punta
  pad(E[0] - 0.06, ys, E[0] + 0.04, ys);
  const yf = B[1] - (o.vfondo || 0.08);                                           // el suelo de la V
  pad(B[0] - 0.05, yf, B[0] + 0.05, yf);
  pad(-0.31, PY - 0.03 - 0.02 - 0.012 - (o.sube || 0.04), -0.19, PY - 0.03 - 0.02 - 0.012 - (o.sube || 0.04));   // el tope de la bobina
  if (o.ideal) d.ideal = true;
  d._ids = { lever: left.id, ramp: ramp.id, ball: ball.id }; d._B = B; d._E = E;
  return d;
};
