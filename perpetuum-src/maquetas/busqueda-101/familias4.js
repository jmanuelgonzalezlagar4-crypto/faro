// Cuarta tanda: más ideas de los vídeos, con sus medidas al azar. Todo sin aire ni rozamiento (vacío y modo ideal).
//  1. palancaCurva: la palanca de metacrilato de la captura (brazo con curva, cazoleta, contrapeso, raíles y bolas)
//  2. gauss: acelerador de Gauss (imanes junto a la vía con filas de bolas de acero) y una cuesta al final
//  3. puertaV: rueda con imanes que pasa entre dos filas de imanes que se van cerrando en V
//  4. catapulta: balancín; una bola cae en un lado y lanza la otra a una repisa que la devuelve
//  5. elevador: las bolas caen en una noria con generador; un motor con esa energía sube las bolas con otra noria
//  6. bessler: rueda con palancas con pesa en el borde, unidas en cruz con muelles
const U = (r, a, b) => a + (b - a) * r(), pick = (r, a) => a[Math.floor(r() * a.length)], sg = r => (r() < 0.5 ? -1 : 1);
const RR = 0.012, DEG = Math.PI / 180;
function base(P) { const d = P.emptyDesign(); d.air = false; d.ideal = true; d.iters = 40; return d; }
// rampa fija con la cara de arriba en la recta dada
function rampa(P, d, x1, y1, x2, y2, mat) { const p = P.makeRamp(d, x1, y1 - RR, x2, y2 - RR); p.mat = mat || 'madera'; d.parts.push(p); return p; }
function suelo(P, d) { rampa(P, d, -1, 0, 1.5, 0); }
function bola(P, d, x, y, R, m, mat) { const b = P.makeBall(d, x, y); b.r = R; b.m = m; b.mat = mat || 'acero'; d.parts.push(b); return b; }
function iman(P, d, r, x, y, host, o) { o = o || {}; const m = P.makeMagnet(d, x, y, host, o.shape || pick(r, ['bar', 'disc'])); m.ang = o.ang != null ? o.ang : U(r, 0, 360);
  m.grade = o.grade || pick(r, ['n35', 'n52']); m.size = o.size || U(r, 0.01, 0.03); if (o.z) m.z = o.z; if (o.solid === false) m.solid = false; m.mu = P.magnetModel(m).mu; d.parts.push(m); return m; }
function barra(P, d, x1, y1, x2, y2, m, th, plane) { const b = P.makeBar(d, x1, y1, x2, y2); b.m = m; if (th) b.th = th; if (plane) b.plane = plane; d.parts.push(b); return b; }
function suelda(P, d, x, y, a, b) { const w = P.makePin(d, x, y, a, b); w.mode = 'rigid'; d.parts.push(w); return w; }

// 1. La palanca de la captura, con todo al azar
function palancaCurva(P, r) {
  const d = base(P); suelo(P, d);
  const h = U(r, 0.06, 0.15), L1 = U(r, 0.12, 0.3), L2 = U(r, 0.05, 0.12), a = U(r, 15, 50) * DEG, c = Math.cos(a), s = Math.sin(a);
  const T = [-L1 * c, h + L1 * s], S = [L2 * c, h - L2 * s];
  const brazo = barra(P, d, T[0], T[1], S[0], S[1], U(r, 0.02, 0.06), 0.003, 1);
  // la curva: debajo del brazo largo, de la punta casi hasta el eje
  const hondo = U(r, 0.2, 0.6) * L1, nf = 6, pf = [];
  for (let k = 0; k <= nf; k++) { const t = 0.05 + 0.9 * k / nf, x = T[0] * (1 - t), y = h + (T[1] - h) * (1 - t), q = hondo * Math.sin(Math.PI * t) * U(r, 0.85, 1.15); pf.push([x - q * s, y - q * c]); }
  for (let k = 0; k < nf; k++) { const b = barra(P, d, pf[k][0], pf[k][1], pf[k + 1][0], pf[k + 1][1], U(r, 0.002, 0.005), 0.0015); suelda(P, d, pf[k][0], pf[k][1], brazo.id, b.id); }
  // la cazoleta y el contrapeso, en el extremo corto
  const Rb = U(r, 0.008, 0.014), fl = [S[0], S[1] - Rb - 0.004];
  const suelo1 = barra(P, d, fl[0] - Rb - 0.004, fl[1], fl[0] + Rb + 0.004, fl[1], 0.002, 0.0015); suelda(P, d, fl[0], fl[1], brazo.id, suelo1.id);
  const lab = barra(P, d, fl[0] + Rb + 0.004, fl[1], fl[0] + Rb + 0.004, fl[1] + Rb, 0.001, 0.0015); suelda(P, d, lab.x1, lab.y1, brazo.id, lab.id);
  const cw = bola(P, d, S[0], S[1] - 0.01, 0.009, U(r, 0, 0.08), 'plomo'); cw.plane = 1; suelda(P, d, S[0], S[1] - 0.01, brazo.id, cw.id);
  const piv = P.makePin(d, 0, h, null, brazo.id); piv.mode = 'limits'; piv.lo = -U(r, 0, 10); piv.hi = U(r, 20, 45); d.parts.push(piv);
  // los raíles, por debajo de la curva
  const yA = Math.min(...pf.map(p => p[1])) - U(r, 0.002, 0.03), yB = U(r, 0.01, 0.05);
  rampa(P, d, T[0] - 0.02, yA, S[0] - 0.01, Math.min(yA - 0.005, yB), pick(r, ['madera', 'acero']));
  const mat = pick(r, ['acero', 'plomo']), m = (mat === 'acero' ? 7800 : 2500) * 4 / 3 * Math.PI * Rb ** 3;
  const nb = 1 + Math.floor(r() * 2);
  for (let k = 0; k < nb; k++) {
    if (k === 0 && r() < 0.5) bola(P, d, fl[0], fl[1] + Rb + 0.0025, Rb, m, mat);
    else { const x = T[0] + U(r, 0, 0.3) * (S[0] - T[0]), yr = yA + (x - T[0] + 0.02) / (S[0] - 0.01 - T[0] + 0.02) * (Math.min(yA - 0.005, yB) - yA); bola(P, d, x, yr + Rb + 0.001, Rb, m, mat); }
  }
  return d;
}

// 2. Acelerador de Gauss: vía casi plana, imanes junto a la vía (a un lado, fuera del plano) con filas de bolas de acero
function gauss(P, r) {
  const d = base(P); suelo(P, d);
  const y0 = 0.1, Lt = U(r, 0.3, 0.7), sl = U(r, -2, 4) * DEG, yv = x => y0 - x * Math.tan(sl);
  rampa(P, d, -0.05, yv(-0.05), Lt, yv(Lt), 'acero');
  const up = U(r, 10, 40) * DEG, Lu = U(r, 0.1, 0.35); rampa(P, d, Lt, yv(Lt), Lt + Lu * Math.cos(up), yv(Lt) + Lu * Math.sin(up), 'acero');
  rampa(P, d, -0.06, yv(-0.06) + 0.08, -0.06, yv(-0.06) - 0.01, 'acero');             // tope al principio
  const R = U(r, 0.006, 0.0125), m = 7800 * 4 / 3 * Math.PI * R ** 3, ns = 1 + Math.floor(r() * 4);
  let x = U(r, 0.04, 0.1);
  bola(P, d, x - U(r, 0.03, 0.06), yv(x) + R + 0.0005, R, m);                       // la bola que entra
  for (let k = 0; k < ns && x < Lt - 0.05; k++) {
    iman(P, d, r, x, yv(x) + R, null, { z: U(r, 0.012, 0.03) * sg(r), solid: false, ang: pick(r, [0, 180, 90]), size: U(r, 0.01, 0.025) });
    const nc = 1 + Math.floor(r() * 3);
    for (let j = 0; j < nc; j++) bola(P, d, x + (2 * j + 1) * (R + 0.0003), yv(x + (2 * j + 1) * R) + R + 0.0005, R, m);
    x += 2 * nc * R + U(r, 0.05, 0.15);
  }
  return d;
}

// 3. Puerta en V: los imanes de la rueda pasan entre dos filas de imanes fijos (al lado de la rueda) que se cierran
function puertaV(P, r) {
  const d = base(P), R = U(r, 0.1, 0.25), cy = 0.5;
  const wh = P.makeWheel(d, 0, cy, R); wh.m = U(r, 0.3, 2); wh.rpm = Math.round(sg(r) * U(r, 10, 120)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
  const nm = 1 + Math.floor(r() * 3), da = U(r, -40, 40), q = R * 0.9;
  for (let k = 0; k < nm; k++) { const a = k / nm * 2 * Math.PI; iman(P, d, r, q * Math.cos(a), cy + q * Math.sin(a), wh.id, { ang: a / DEG + da, size: U(r, 0.012, 0.03) }); }
  const ns = 3 + Math.floor(r() * 8), a0 = U(r, 0, 2 * Math.PI), span = U(r, 0.4, 1.6) * Math.PI, g0 = U(r, 0.04, 0.09), g1 = U(r, 0.008, 0.03), z = U(r, 0.015, 0.035);
  for (let k = 0; k < ns; k++) { const t = k / (ns - 1), a = a0 + t * span, g = g0 + (g1 - g0) * t;
    [q + g, q - g].forEach((rr, j) => iman(P, d, r, rr * Math.cos(a), cy + rr * Math.sin(a), null, { z: j ? z : -z, solid: false, ang: a / DEG + da + U(r, -20, 20) + (j ? 180 : 0), size: U(r, 0.01, 0.025) })); }
  return d;
}

// 4. Catapulta: una bola cae sobre un lado del balancín y lanza la otra a una repisa, que la devuelve por una rampa
function catapulta(P, r) {
  const d = base(P); suelo(P, d);
  const hp = U(r, 0.08, 0.2), L = U(r, 0.2, 0.5), ang = U(r, -15, 15) * DEG, c = Math.cos(ang), s = Math.sin(ang);
  const A = [-L / 2 * c, hp - L / 2 * s], B = [L / 2 * c, hp + L / 2 * s];
  const bal = barra(P, d, A[0], A[1], B[0], B[1], U(r, 0.02, 0.15), 0.004);
  const piv = P.makePin(d, 0, hp, null, bal.id); piv.mode = 'limits'; piv.lo = -U(r, 10, 30); piv.hi = U(r, 10, 30); d.parts.push(piv);
  const Rb = U(r, 0.01, 0.025), mat = pick(r, ['acero', 'plomo', 'goma']);
  // topes en los dos extremos para que no se salgan las bolas
  [A, B].forEach((p, j) => { const t = barra(P, d, p[0], p[1], p[0] - s * 0.025, p[1] + c * 0.025, 0.002, 0.003); suelda(P, d, p[0], p[1], bal.id, t.id); });
  const mA = U(r, 0.02, 0.6), mB = U(r, 0.01, 0.3);
  bola(P, d, A[0] * U(r, 0.6, 0.95), hp + U(r, 0.1, 0.45), Rb, mA, mat);                         // la que cae
  const fB = U(r, 0.6, 0.9); bola(P, d, B[0] * fB - s * (Rb + 0.006), hp + B[1] * 0 + (B[1] - hp) * fB + c * (Rb + 0.0045), Rb, mB, mat);   // la que sale
  // repisa arriba a la derecha y rampa de vuelta hasta encima del lado que cae
  const xr = B[0] + U(r, -0.05, 0.2), yr = hp + U(r, 0.12, 0.4), lr = U(r, 0.1, 0.25);
  rampa(P, d, xr, yr, xr + lr, yr + U(r, -0.02, 0.04), pick(r, ['madera', 'goma']));
  rampa(P, d, xr - 0.005, yr - 0.005, A[0] * U(r, 0.5, 1), yr - U(r, 0.03, 0.1), 'madera');
  rampa(P, d, A[0] - 0.08, 0.002, B[0] + 0.05, 0.02 + U(r, 0, 0.03), 'madera');                  // fondo, por si caen
  return d;
}

// 5. Elevador: las bolas caen sobre una noria con generador; el motor (con lo que guarda el generador) sube las bolas
//    con otra noria hasta la rampa de arriba
function elevador(P, r) {
  const d = base(P); suelo(P, d);
  const Ra = U(r, 0.06, 0.12), ya = U(r, 0.18, 0.3), xa = 0;
  const Rl = Math.max(U(r, 0.12, 0.22), (ya + Ra + 0.04) / 2), yl = Rl + 0.03, xl = Ra + Rl + U(r, 0.08, 0.25);
  const na = P.makeWheel(d, xa, ya, Ra); na.m = U(r, 0.1, 0.6); na.style = 'ring'; na.cells = 4 + Math.floor(r() * 6); na.rpm = 0; na.gen = U(r, 0.005, 0.05); na.gdest = 'bus'; d.parts.push(na);
  const nl = P.makeWheel(d, xl, yl, Rl); nl.m = U(r, 0.1, 0.6); nl.style = 'ring'; nl.cells = 4 + Math.floor(r() * 6); nl.rpm = 0; nl.motor = true; nl.mrpm = Math.round(U(r, 5, 60)); nl.mtorque = U(r, 0.01, 0.3); nl.msrc = 'bus'; d.parts.push(nl);
  // rampa de arriba: del borde de arriba del elevador baja hasta encima de la noria; rampa de abajo: de debajo de la
  // noria baja hasta el pie del elevador (el elevador gira en el sentido de las agujas: sube por la izquierda)
  const ytop = yl + Rl + U(r, 0.005, 0.02), yaT = ya + Ra + U(r, 0.01, 0.03), xr0 = xl - Rl * U(r, 0.1, 0.5), xr1 = xa + Ra * U(r, -0.3, 0.6);
  rampa(P, d, xr0, ytop, xr1, Math.min(yaT, ytop - 0.02), pick(r, ['madera', 'acero']));
  rampa(P, d, xa + Ra * U(r, -0.5, 0.5), Math.max(0.03, ya - Ra - U(r, 0.02, 0.06)), xl - Rl * U(r, 0.6, 0.95), U(r, 0.01, 0.03), pick(r, ['madera', 'acero']));
  const nb = 2 + Math.floor(r() * 6), Rb = U(r, 0.01, 0.02), mat = pick(r, ['acero', 'plomo']), y2 = Math.min(yaT, ytop - 0.02);
  for (let k = 0; k < nb; k++) { const t = (k + 0.5) / nb, x = xr0 + t * (xr1 - xr0) * 0.8; bola(P, d, x, ytop + (y2 - ytop) * t * 0.8 + Rb + 0.003, Rb, U(r, 0.02, 0.2), mat); }
  return d;
}

// 6. Rueda de Bessler: palancas con pesa en el borde, con topes, unidas en cruz con muelles
function bessler(P, r) {
  const d = base(P), R = U(r, 0.2, 0.45), cy = 0.7;
  const wh = P.makeWheel(d, 0, cy, R * 0.3); wh.m = U(r, 0.3, 3); wh.rpm = Math.round(sg(r) * U(r, 0, 30)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
  const n = 4 + Math.floor(r() * 5), La = U(r, 0.25, 0.6) * R, mw = U(r, 0.05, 0.8), ends = [];
  for (let k = 0; k < n; k++) {
    const a = k / n * 2 * Math.PI, hx = R * Math.cos(a), hy = cy + R * Math.sin(a), b = a + U(r, 60, 150) * DEG * sg(r), ex = hx + La * Math.cos(b), ey = hy + La * Math.sin(b);
    const spoke = barra(P, d, 0, cy, hx, hy, 0.01, 0.004, 2); suelda(P, d, 0, cy, wh.id, spoke.id);
    const arm = barra(P, d, hx, hy, ex, ey, 0.01, 0.003, 1 + (k % 2) * 2);
    const pin = P.makePin(d, hx, hy, spoke.id, arm.id); pin.mode = 'limits'; pin.lo = -U(r, 10, 60); pin.hi = U(r, 10, 60); d.parts.push(pin);
    const wgt = bola(P, d, ex, ey, 0.015, mw, 'plomo'); wgt.plane = arm.plane; suelda(P, d, ex, ey, arm.id, wgt.id);
    ends.push({ arm, ex, ey, hx, hy });
  }
  const salto = 1 + Math.floor(r() * Math.max(1, n / 2));
  for (let k = 0; k < n; k++) { if (r() < 0.3) continue; const a = ends[k], b = ends[(k + salto) % n];
    const sp = P.makeSpring(d, a.ex, a.ey, b.hx, b.hy, a.arm.id, b.arm.id); sp.k = U(r, 5, 200); sp.rest = Math.hypot(a.ex - b.hx, a.ey - b.hy) * U(r, 0.8, 1.2); sp.damp = U(r, 0, 0.3); d.parts.push(sp); }
  return d;
}
module.exports = { palancaCurva, gauss, puertaV, catapulta, elevador, bessler };
