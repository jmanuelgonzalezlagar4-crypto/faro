// El balancín del usuario con todo ajustable, para buscar la mejor combinación.
// Un solo escalón, a la derecha, bajo la punta de la rampa. Empieza con el palo arriba, brazo y rampa en línea
// recta cuesta abajo y la bola en la punta.
module.exports = function (P, o) {
  const d = P.emptyDesign(); d.example = 'ciclo3'; d.iters = 60;
  const PY = 0.30, XL = -(o.xl || 0.26), al = o.al * Math.PI / 180, La = o.La, L = o.L, TAB = -0.05;
  const th0 = Math.max(0, al - o.inc * Math.PI / 180);              // el palo arriba: la línea baja o.inc grados
  const rot = p => [p[0] * Math.cos(th0) - (p[1] - PY) * Math.sin(th0), PY + p[0] * Math.sin(th0) + (p[1] - PY) * Math.cos(th0)];
  const u = [Math.cos(al), -Math.sin(al)], n0 = [Math.sin(al), Math.cos(al)];
  const A0 = [0.02, PY], B0 = [A0[0] + La * u[0], A0[1] + La * u[1]], E0 = [B0[0] + L * u[0], B0[1] + L * u[1]];
  const [A, B, E] = [A0, B0, E0].map(rot), n = rot([n0[0], PY + n0[1]]); n[1] -= PY;
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th || 0.006; d.parts.push(b); return b; };
  const weld = (x, y, a, b) => { const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const left = bar(rot([XL, PY]), A, o.ml != null ? o.ml : 0.08);
  // el eje con topes, como en el aparato: desde donde empieza, el palo baja como mucho 50° por el lado de la bola y sube 3° más
  const piv = P.makePin(d, 0, PY, null, left.id); piv.mode = 'limits'; piv.lo = -(o.baja || 50); piv.hi = 3; piv.bearing = 'bolas'; d.parts.push(piv);
  const arm = bar(A, B, o.ma != null ? o.ma : 0.06); weld(A[0], A[1], left, arm);
  const cpos = rot([XL + 0.01, PY - 0.03]), ch = rot([XL + 0.01, PY]);
  const coil = P.makeBall(d, cpos[0], cpos[1]); coil.r = 0.02; coil.m = o.mc; coil.mat = 'acero'; d.parts.push(coil); weld(ch[0], ch[1], left, coil);
  const ramp = bar(B, E, o.mr);
  const stop = bar(E, [E[0] + 0.03 * n[0], E[1] + 0.03 * n[1]], 0.003); weld(E[0], E[1], ramp, stop);
  const h = P.makePin(d, B[0], B[1], arm.id, ramp.id); h.mode = 'limits'; h.lo = 0; h.hi = o.hi; h.bearing = 'bolas'; d.parts.push(h);
  const R = o.rb || 0.01, f = Math.max(0.5, 1 - (R + 0.02) / L), bx = B[0] + f * (E[0] - B[0]), by = B[1] + f * (E[1] - B[1]);
  const ball = P.makeBall(d, bx + (0.006 + R + 0.0005) * n[0], by + (0.006 + R + 0.0005) * n[1]); ball.r = R; ball.m = o.mb; ball.mat = 'acero'; d.parts.push(ball);
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'goma'; d.parts.push(r); };
  pad(-0.60, TAB, 1.4, TAB, 'madera');                                            // la mesa
  const yr = E[1] - 0.006 - 0.012 - o.hr;                                         // el escalón, bajo la punta
  pad(E[0] - 0.07, yr, E[0] + 0.05, yr);
  if (o.ideal) d.ideal = true;
  d._ids = { lever: left.id, ball: ball.id }; d._th0 = th0 * 180 / Math.PI; d._B = B; d._E = E;
  return d;
};
