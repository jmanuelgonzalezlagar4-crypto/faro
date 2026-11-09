// El balancín de las fotos, segunda versión: medido otra vez sobre las fotos ampliadas con rejilla.
// Escala: la canica y la rueda negra miden lo mismo en la foto (90 px); con una canica de 22 mm sale 0,245 mm por px.
//  - Palo: dos pletinas de aluminio de 21 mm de alto, de 15,3 cm a la izquierda del eje a 14,7 cm a la derecha.
//  - Contrapeso: un taco de arandelas (40 mm) colgado de una anilla a 14 cm del eje. En la foto cuelga 7,3 cm por
//    debajo del palo; aquí 5,8 cm, para que la tabla no quede por debajo de la bandeja. Lo que pesa en el palo no cambia.
//  - Rueda negra de goma de 22 mm, en la cara del palo, a 13,1 cm del eje: cae sobre la tira negra de la bandeja.
//  - Bisagra al final del palo; rampa de 9,8 cm que cuelga 8,6° y acaba en un tubo negro de 23 x 32 mm.
//  - Escalón: el bloque del final de la bandeja, con goma encima, 30 mm por encima de la tira negra.
//  - La V de la otra foto: el palo baja unos 24° hasta que la rueda toca la tira; la rampa sube unos 15° hasta el bloque.
// Empieza como la foto del palo recto (o.uve = false) o como la foto de la V (o.uve = true).
module.exports = function (P, o) {
  o = Object.assign({ PY: 0.068, xh: 0.147, Lr: 0.098, caida: 8.6, hi: 70, mr: 0.025, mp: 0.015, mb: 0.014, rb: 0.011,
    ml: 0.10, mn: 0.02, xn: 0.134, xr: 0.131, rr: 0.011, mrr: 0.008, xc: 0.140, Lc: 0.058, rc: 0.020, mc: 0.05, hueco: 0.003,
    hs: 0.030, uve: false, th0: null, bola: null }, o || {});
  const d = P.emptyDesign(); d.example = 'balancin-fotos-2'; d.iters = 60;
  const PY = o.PY, RR = 0.012, thL = 0.0105, thR = 0.004;
  const rad = Math.PI / 180;
  // ángulo de salida: foto recta (−1,3°) o foto de la V (la rueda apoyada en la tira)
  let th0 = o.th0 != null ? o.th0 * rad : -1.3 * rad;
  if (o.uve && o.th0 == null) { // rueda tocando la tira: (xr·sen + yr·cos) baja hasta la tira (y = 0.002)
    for (let a = 0; a < 60; a += 0.01) { const t = -a * rad, yb = PY + o.xr * Math.sin(t) - 0.0015 * Math.cos(t) - o.rr; if (yb <= 0.0025) { th0 = t; break; } }
  }
  const R = (p, t) => [p[0] * Math.cos(t) - (p[1] - PY) * Math.sin(t), PY + p[0] * Math.sin(t) + (p[1] - PY) * Math.cos(t)];
  const rot = p => R(p, th0);
  const bar = (p, q, m, th) => { const b = P.makeBar(d, p[0], p[1], q[0], q[1]); b.m = m; b.th = th; d.parts.push(b); return b; };
  const weld = (p, a, b) => { const w = P.makePin(d, p[0], p[1], a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  // el palo, con el taco negro de la punta izquierda
  const lever = bar(rot([-0.153, PY]), rot([0.145, PY]), o.ml, thL);
  const piv = P.makePin(d, 0, PY, null, lever.id); piv.mode = 'limits'; piv.lo = -40 - th0 / rad; piv.hi = 30 - th0 / rad; piv.bearing = 'bolas'; d.parts.push(piv);
  const blk = P.makeBall(d, ...rot([-o.xn, PY + 0.004])); blk.r = 0.006; blk.m = o.mn; blk.mat = 'acero'; blk.plane = 1; d.parts.push(blk); weld(rot([-o.xn, PY + 0.004]), lever, blk);
  // la rueda negra, en la cara del palo
  const wpos = rot([o.xr, PY - 0.0015]);
  const wheel = P.makeBall(d, ...wpos); wheel.r = o.rr; wheel.m = o.mrr; wheel.mat = 'goma'; d.parts.push(wheel); weld(wpos, lever, wheel);
  // el contrapeso: anilla (no choca) y taco de arandelas
  const hk = rot([-o.xc, PY - thL]);
  const ring = bar(hk, [hk[0], hk[1] - o.Lc + o.rc], 0.002, 0.002); ring.plane = 1;
  const hp = P.makePin(d, hk[0], hk[1], lever.id, ring.id); hp.mode = 'free'; hp.bearing = 'bolas'; d.parts.push(hp);
  const cw = P.makeBall(d, hk[0], hk[1] - o.Lc); cw.r = o.rc; cw.m = o.mc; cw.mat = 'acero'; d.parts.push(cw); weld([hk[0], hk[1] - o.Lc], ring, cw);
  const hk2 = R([-o.xc, PY - thL], -1.3 * rad), tabla = hk2[1] - o.Lc - o.rc - o.hueco;   // la tabla: justo debajo del contrapeso en la foto del palo recto
  // la rampa: sale de la bisagra; colgando (foto recta) o subiendo hasta el bloque (foto de la V)
  const B = rot([o.xh, PY]);
  let phi = th0 - o.caida * rad;                          // ángulo de la rampa en el mundo
  if (o.uve) { const s = (o.hs + thR - B[1]) / o.Lr; phi = Math.asin(Math.max(-1, Math.min(1, s))) + 0.002; }
  const u = [Math.cos(phi), Math.sin(phi)], n = [-Math.sin(phi), Math.cos(phi)];
  const E = [B[0] + o.Lr * u[0], B[1] + o.Lr * u[1]];
  const ramp = bar(B, E, o.mr, thR);
  const pc = [E[0] - 0.0115 * u[0] + (thR + 0.016) * n[0], E[1] - 0.0115 * u[1] + (thR + 0.016) * n[1]];
  const post = bar([pc[0] - 0.012 * n[0], pc[1] - 0.012 * n[1]], [pc[0] + 0.012 * n[0], pc[1] + 0.012 * n[1]], o.mp, 0.0115); weld(E, ramp, post);
  const rel0 = (phi - th0) / rad;                         // doblez de la rampa respecto al palo al empezar
  const h = P.makePin(d, B[0], B[1], lever.id, ramp.id); h.mode = 'limits'; h.lo = -o.caida - rel0; h.hi = o.hi - rel0; h.bearing = 'bolas'; d.parts.push(h);
  // la canica: junto al tubo (foto recta) o en el fondo de la V (foto de la V)
  const f = o.bola != null ? o.bola : (o.uve ? (o.rb + 0.012) / o.Lr : 1 - (o.rb + 0.023 + 0.001) / o.Lr);
  const bp = [B[0] + f * o.Lr * u[0] + (thR + o.rb + 0.0005) * n[0], B[1] + f * o.Lr * u[1] + (thR + o.rb + 0.0005) * n[1]];
  const ball = P.makeBall(d, ...bp); ball.r = o.rb; ball.m = o.mb; ball.mat = 'acero'; d.parts.push(ball);
  // la tabla, la bandeja, la tira negra y el bloque (las piezas fijas tienen 12 mm de medio grosor)
  const pad = (x1, y, x2, mat) => { const r = P.makeRamp(d, x1, y - RR, x2, y - RR); r.mat = mat; d.parts.push(r); };
  pad(-0.30, tabla, -0.02, 'madera');
  pad(0.015, 0, 0.26, 'madera');
  pad(0.095, 0.002, 0.150, 'goma');
  pad(0.185, o.hs, 0.250, 'goma');
  if (o.ideal) d.ideal = true;
  d._ids = { lever: lever.id, ball: ball.id, ramp: ramp.id, cw: cw.id, wheel: wheel.id }; d._B = B; d._o = o; d._th0 = th0 / rad; d._tabla = tabla;
  return d;
};
