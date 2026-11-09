// Tercera tanda: ideas clásicas de máquinas «perpetuas», con sus medidas al azar. Todo sin aire ni rozamiento.
const U = (r, a, b) => a + (b - a) * r(), pick = (r, a) => a[Math.floor(r() * a.length)], sg = r => (r() < 0.5 ? -1 : 1);
const SH = ['bar', 'disc', 'horseshoe'], RR = 0.012;
function base(P) { const d = P.emptyDesign(); d.air = false; d.ideal = true; d.iters = 40; return d; }
function iman(P, d, r, x, y, host, o) { o = o || {}; const m = P.makeMagnet(d, x, y, host, o.shape || pick(r, SH)); m.ang = o.ang != null ? o.ang : U(r, 0, 360); m.grade = pick(r, ['n35', 'n52']); m.size = o.size || U(r, 0.012, 0.04); m.mu = P.magnetModel(m).mu; if (o.solid === false) m.solid = false; d.parts.push(m); return m; }
function rampa(P, d, x1, y1, x2, y2, mat) { const p = P.makeRamp(d, x1, y1 - RR, x2, y2 - RR); p.mat = mat || 'madera'; d.parts.push(p); return p; }
// 1. Rueda de Bhaskara / de mercurio: rueda con tubos curvos (brazos doblados) llenos de bolas que ruedan hacia fuera en un lado
function bhaskara(P, r) {
  const d = base(P), R = U(r, 0.25, 0.5), cy = 0.8, wh = P.makeWheel(d, 0, cy, R * 0.25); wh.m = U(r, 0.3, 2); wh.rpm = Math.round(sg(r) * U(r, 5, 40)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
  const n = 4 + Math.floor(r() * 6), curva = U(r, 0.3, 1.2) * sg(r);
  for (let k = 0; k < n; k++) {
    const a = k / n * 2 * Math.PI, p1 = [R * 0.3 * Math.cos(a), cy + R * 0.3 * Math.sin(a)], p2 = [R * 0.65 * Math.cos(a + curva * 0.3), cy + R * 0.65 * Math.sin(a + curva * 0.3)], p3 = [R * Math.cos(a + curva * 0.6), cy + R * Math.sin(a + curva * 0.6)];
    [[p1, p2], [p2, p3]].forEach(([q1, q2]) => { const b = P.makeBar(d, q1[0], q1[1], q2[0], q2[1]); b.m = 0.01; b.th = 0.004; d.parts.push(b); const w = P.makePin(d, q1[0], q1[1], wh.id, b.id); w.mode = 'rigid'; d.parts.push(w); });
    const f = U(r, 0.2, 0.8), bx = p1[0] + f * (p2[0] - p1[0]), by = p1[1] + f * (p2[1] - p1[1]), nx = -(p2[1] - p1[1]), ny = p2[0] - p1[0], nl = Math.hypot(nx, ny), Rb = U(r, 0.008, 0.02), side = sg(r);
    const ball = P.makeBall(d, bx + side * (0.004 + Rb + 0.001) * nx / nl, by + side * (0.004 + Rb + 0.001) * ny / nl); ball.r = Rb; ball.m = U(r, 0.02, 0.4); ball.mat = pick(r, ['plomo', 'acero']); d.parts.push(ball);
  }
  return d;
}
// 2. Rueda con imanes en espiral (estator en espiral, como los «motores de imanes» de los vídeos), con o sin escudo de acero
function espiral(P, r) {
  const d = base(P), R = U(r, 0.12, 0.3), cy = 0.5, wh = P.makeWheel(d, 0, cy, R); wh.m = U(r, 0.3, 3); wh.rpm = Math.round(sg(r) * U(r, 10, 120)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.04); wh.gdest = 'bus'; } d.parts.push(wh);
  const nm = 1 + Math.floor(r() * 4), da = U(r, -40, 40);
  for (let k = 0; k < nm; k++) { const a = k / nm * 2 * Math.PI, q = R * 0.85; iman(P, d, r, q * Math.cos(a), cy + q * Math.sin(a), wh.id, { ang: a * 180 / Math.PI + da }); }
  const ns = 4 + Math.floor(r() * 10), r0 = R + U(r, 0.03, 0.06), r1 = r0 + U(r, 0.02, 0.12), a0 = U(r, 0, 2 * Math.PI), span = U(r, 0.8, 1.9) * Math.PI;
  for (let k = 0; k < ns; k++) { const t = k / (ns - 1), a = a0 + t * span, q = r0 + (r1 - r0) * t; iman(P, d, r, q * Math.cos(a), cy + q * Math.sin(a), null, { ang: a * 180 / Math.PI + da + U(r, -15, 15), size: U(r, 0.01, 0.025) }); }
  return d;
}
// 3. Péndulo con imán que pasa sobre imanes fijos y una bola de acero que tira un electroimán con interruptor
function penduloElectro(P, r) {
  const d = base(P), px = 0, py = 0.6, L = U(r, 0.15, 0.4), a = -Math.PI / 2 + U(r, -1, 1), ex = px + L * Math.cos(a), ey = py + L * Math.sin(a);
  const bar = P.makeBar(d, px, py, ex, ey); bar.m = U(r, 0.01, 0.08); d.parts.push(bar); d.parts.push(P.makePin(d, px, py, null, bar.id));
  const b = P.makeBall(d, ex, ey); b.r = U(r, 0.01, 0.025); b.m = U(r, 0.03, 0.5); b.mat = 'acero'; d.parts.push(b); const w = P.makePin(d, ex, ey, bar.id, b.id); w.mode = 'rigid'; d.parts.push(w);
  const hub = P.makeWheel(d, px, py, 0.02); hub.m = 0.005; hub.plane = 3; d.parts.push(hub); const wh = P.makePin(d, px, py, hub.id, bar.id); wh.mode = 'rigid'; d.parts.push(wh);
  const nf = Math.floor(r() * 3); for (let k = 0; k < nf; k++) { const aa = -Math.PI / 2 + U(r, -0.8, 0.8), q = L + U(r, 0.04, 0.09); iman(P, d, r, px + q * Math.cos(aa), py + q * Math.sin(aa), null); }
  const e = P.makeMagnet(d, px + (L + U(r, 0.04, 0.08)) * Math.cos(-Math.PI / 2 + U(r, -0.6, 0.6)), py - L - U(r, 0.04, 0.08), null, 'electro'); e.ang = 90; e.mu = U(r, 1, 10); e.emode = 'window'; e.ewheel = hub.id; e.efrom = U(r, 0, 360); e.eto = e.efrom + U(r, 5, 90); e.eevery = 360; e.esrc = r() < 0.5 ? 'bus' : undefined; d.parts.push(e);
  if (r() < 0.5) { hub.gen = U(r, 0.0005, 0.01); hub.gdest = 'bus'; }
  return d;
}
// 4. Cinta de flotadores en agua (cadena de bolas alrededor de dos ruedas, medio dentro de un tanque)
function cadenaAgua(P, r) {
  const d = base(P); d.iters = 60; d.parts.push(P.makeTank(d, 0, 0.05, 0.6, U(r, 0.5, 0.9)));
  rampa(P, d, -0.6, 0.05, 0.7, 0.05); rampa(P, d, 0.612, 0.05, 0.612, 1.3);
  const x = U(r, 0.45, 0.75), y1 = U(r, 0.15, 0.3), y2 = U(r, 0.8, 1.1), Rw = U(r, 0.05, 0.1);
  [y1, y2].forEach(y => { const w = P.makeWheel(d, x, y, Rw); w.m = U(r, 0.1, 0.5); w.style = 'ring'; w.cells = 6 + Math.floor(r() * 6); w.plane = 1; w.rpm = 0; d.parts.push(w); });
  const nb = 6 + Math.floor(r() * 10), Rb = U(r, 0.025, 0.045);
  for (let k = 0; k < nb; k++) { const side = k % 2 ? -1 : 1, yy = y1 + (y2 - y1) * (Math.floor(k / 2) + 0.5) / Math.ceil(nb / 2); const b = P.makeBall(d, x + side * (Rw + Rb + 0.003), yy); b.r = Rb; b.m = 1000 * 4 / 3 * Math.PI * Rb ** 3 * (side > 0 ? U(r, 0.2, 0.7) : U(r, 0.8, 1.6)); b.mat = 'madera'; d.parts.push(b); }
  return d;
}
module.exports = { bhaskara, espiral, penduloElectro, cadenaAgua };
