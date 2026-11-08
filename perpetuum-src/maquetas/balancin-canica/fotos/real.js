// El balancín tal como sale en las dos fotos del aparato que mandó el usuario (medidas sacadas de la foto de frente,
// con la canica de 16 mm como regla). Todo en metros; el suelo de la bandeja es y = 0.
//  - Palo recto de aluminio de 30 cm con el eje en el centro, a 68 mm sobre la bandeja.
//  - Contrapeso (la «bobina») colgado de un gancho a 13,7 cm a la izquierda del eje; puede columpiarse y, abajo,
//    apoyarse en la tabla.
//  - Rueda de goma bajo la punta derecha del palo: es el tope de abajo, sobre una tira de goma en la bandeja.
//  - Bisagra al final del palo y una rampa de 10 cm que cuelga unos 11° y acaba en un tope donde se para la canica.
//  - El escalón: el bloque alto del final de la bandeja, con goma encima, bajo la punta de la rampa.
module.exports = function (P, o) {
  o = Object.assign({ PY: 0.068, xc: 0.137, mc: 0.04, rc: 0.017, hueco: 0.002, tabla: -0.006, ml: 0.065, xr: 0.132, rr: 0.009, br: 0.013,
    xh: 0.148, Lr: 0.100, caida: 11, hi: 60, mr: 0.020, mp: 0.008, mb: 0.0055, rb: 0.008, hs: 0.025, th0: 0 }, o || {});
  const d = P.emptyDesign(); d.example = 'balancin-fotos'; d.iters = 60;
  const PY = o.PY, th0 = o.th0 * Math.PI / 180;
  const rot = p => [p[0] * Math.cos(th0) - (p[1] - PY) * Math.sin(th0), PY + p[0] * Math.sin(th0) + (p[1] - PY) * Math.cos(th0)];
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th || 0.006; d.parts.push(b); return b; };
  const weld = (p, a, b) => { const w = P.makePin(d, p[0], p[1], a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  // el palo
  const lever = bar(rot([-0.150, PY]), rot([0.150, PY]), o.ml);
  const piv = P.makePin(d, 0, PY, null, lever.id); piv.mode = 'limits'; piv.lo = -40 - o.th0; piv.hi = 30 - o.th0; piv.bearing = 'bolas'; d.parts.push(piv);
  // la rueda de goma bajo la punta derecha
  const wheel = P.makeBall(d, ...rot([o.xr, PY - o.br])); wheel.r = o.rr; wheel.m = 0.005; wheel.mat = 'goma'; d.parts.push(wheel); weld(rot([o.xr, PY - o.br]), lever, wheel);
  // el contrapeso colgado del gancho (la varilla no choca con nada)
  const hk = rot([-o.xc, PY]), Lh = (hk[1] - o.tabla) - o.rc - o.hueco;
  const rod = bar(hk, [hk[0], hk[1] - Lh + o.rc], 0.002, 0.002); rod.plane = 1;
  const hp = P.makePin(d, hk[0], hk[1], lever.id, rod.id); hp.mode = 'free'; hp.bearing = 'bolas'; d.parts.push(hp);
  const cw = P.makeBall(d, hk[0], hk[1] - Lh); cw.r = o.rc; cw.m = o.mc; cw.mat = 'acero'; d.parts.push(cw); weld([hk[0], hk[1] - Lh], rod, cw);
  // la rampa con bisagra, colgando o.caida grados, y el tope del final
  const c = Math.cos(-o.caida * Math.PI / 180), s = Math.sin(-o.caida * Math.PI / 180);
  const B0 = [o.xh, PY], E0 = [o.xh + o.Lr * c, PY + o.Lr * s], n0 = [-s, c];
  const B = rot(B0), E = rot(E0), n = [n0[0] * Math.cos(th0) - n0[1] * Math.sin(th0), n0[0] * Math.sin(th0) + n0[1] * Math.cos(th0)];
  const ramp = bar(B, E, o.mr);
  const post = bar(E, [E[0] + 0.03 * n[0], E[1] + 0.03 * n[1]], o.mp, 0.004); weld(E, ramp, post);
  const h = P.makePin(d, B[0], B[1], lever.id, ramp.id); h.mode = 'limits'; h.lo = 0; h.hi = o.hi; h.bearing = 'bolas'; d.parts.push(h);
  // la canica, junto al tope
  const R = o.rb, f = 1 - (R + 0.006) / o.Lr, bx = B[0] + f * (E[0] - B[0]), by = B[1] + f * (E[1] - B[1]);
  const ball = P.makeBall(d, bx + (0.006 + R + 0.0005) * n[0], by + (0.006 + R + 0.0005) * n[1]); ball.r = R; ball.m = o.mb; ball.mat = 'acero'; d.parts.push(ball);
  // la tabla, la bandeja con su tira de goma y el escalón
  // las piezas fijas tienen 12 mm de medio grosor: se ponen 12 mm por debajo para que su cara de arriba quede donde toca
  const RR = 0.012, pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1 - RR, x2, y2 - RR); r.mat = mat; d.parts.push(r); };
  pad(-0.30, o.tabla, -0.02, o.tabla, 'madera');
  pad(0.02, 0, 0.30, 0, 'madera');
  pad(0.08, 0.001, 0.155, 0.001, 'goma');
  pad(0.175, o.hs, 0.27, o.hs, 'goma');
  if (o.ideal) d.ideal = true;
  d._ids = { lever: lever.id, ball: ball.id, ramp: ramp.id, cw: cw.id }; d._B = B; d._o = o;
  return d;
};
