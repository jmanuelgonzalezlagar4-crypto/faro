// Familias de aparatos al azar para buscar un rendimiento de más del 100 %. Cada función recibe el banco (P) y un
// generador de números al azar (r) y devuelve un diseño. Todas van sin rozamiento ni aire (modo ideal): es lo más
// favorable para que sobre energía.
const U = (r, a, b) => a + (b - a) * r(), pick = (r, a) => a[Math.floor(r() * a.length)], sg = r => (r() < 0.5 ? -1 : 1);
const SH = ['bar', 'disc', 'horseshoe'];
function iman(P, d, r, x, y, host, shape) { const m = P.makeMagnet(d, x, y, host, shape || pick(r, SH)); m.ang = U(r, 0, 360); m.grade = 'n52'; m.size = U(r, 0.012, 0.04); m.mu = P.magnetModel(m).mu; d.parts.push(m); return m; }
function base(P) { const d = P.emptyDesign(); d.air = false; d.ideal = true; return d; }

// 1. Rueda con imanes, imanes fijos, a veces un electroimán con interruptor, generador y motor que se alimentan del acumulador
function ruedaImanes(P, r) {
  const d = base(P), R = U(r, 0.15, 0.4), cy = 0.6;
  const wh = P.makeWheel(d, 0, cy, R); wh.m = U(r, 0.5, 4); wh.rpm = Math.round(sg(r) * U(r, 10, 80)); d.parts.push(wh);
  const nm = 2 + Math.floor(r() * 9);
  for (let k = 0; k < nm; k++) { const a = k / nm * 2 * Math.PI + U(r, 0, 0.4), rr = R * U(r, 0.7, 0.92); iman(P, d, r, rr * Math.cos(a), cy + rr * Math.sin(a), wh.id); }
  const nf = 1 + Math.floor(r() * 4);
  for (let k = 0; k < nf; k++) { const a = U(r, 0, 2 * Math.PI), rr = R + U(r, 0.05, 0.12); iman(P, d, r, rr * Math.cos(a), cy + rr * Math.sin(a), null); }
  if (r() < 0.5) { const a = U(r, 0, 2 * Math.PI), rr = R + U(r, 0.06, 0.1); const e = P.makeMagnet(d, rr * Math.cos(a), cy + rr * Math.sin(a), null, 'electro');
    e.ang = U(r, 0, 360); e.mu = U(r, 2, 12); e.emode = 'window'; e.ewheel = wh.id; e.efrom = U(r, 0, 360); e.eto = e.efrom + U(r, 5, 60); e.eevery = 360 / (1 + Math.floor(r() * nm)); e.esrc = r() < 0.6 ? 'bus' : undefined; d.parts.push(e); }
  if (r() < 0.6) { wh.gen = U(r, 0.003, 0.08); wh.gdest = 'bus'; }
  if (r() < 0.3) { wh.motor = true; wh.mrpm = wh.rpm; wh.mtorque = U(r, 0.02, 0.4); wh.msrc = 'bus'; }
  return d;
}
// 2. Rueda con imanes y una o dos palancas con topes, imán en la punta, a veces pesa y muelle
function palancasImanes(P, r) {
  const d = base(P), R = U(r, 0.2, 0.45), cy = 0.6;
  const wh = P.makeWheel(d, 0, cy, R); wh.m = U(r, 1, 5); wh.rpm = Math.round(sg(r) * U(r, 10, 70)); d.parts.push(wh);
  const nm = 2 + Math.floor(r() * 7);
  for (let k = 0; k < nm; k++) { const a = k / nm * 2 * Math.PI + r() * 0.5, rr = R * U(r, 0.75, 0.95); iman(P, d, r, rr * Math.cos(a), cy + rr * Math.sin(a), wh.id); }
  const nl = 1 + Math.floor(r() * 2);
  for (let l = 0; l < nl; l++) {
    const a = U(r, 0, 2 * Math.PI), gap = U(r, 0.05, 0.11), rp = R + gap + U(r, 0.15, 0.25);
    const px = rp * Math.cos(a), py = cy + rp * Math.sin(a), tx = (R + gap) * Math.cos(a + 0.4), ty = cy + (R + gap) * Math.sin(a + 0.4);
    const bar = P.makeBar(d, px, py, tx, ty); bar.m = U(r, 0.05, 0.35); d.parts.push(bar);
    const pin = P.makePin(d, px, py, null, bar.id); pin.mode = 'limits'; pin.lo = -U(r, 5, 45); pin.hi = U(r, 5, 45); d.parts.push(pin);
    iman(P, d, r, tx, ty, bar.id);
    if (r() < 0.5) { const b = P.makeBall(d, (px + tx) / 2, (py + ty) / 2); b.r = 0.02; b.m = U(r, 0.1, 0.6); d.parts.push(b); const pw = P.makePin(d, b.x, b.y, bar.id, b.id); pw.mode = 'rigid'; d.parts.push(pw); }
    if (r() < 0.4) { const sx = px + (tx - px) * 0.6, sy = py + (ty - py) * 0.6, sp = P.makeSpring(d, sx, sy, sx, sy + 0.15, bar.id, null); sp.k = U(r, 20, 220); sp.damp = 0; d.parts.push(sp); }
  }
  return d;
}
// 3. Ruedas de gravedad: brazos con bisagra y pesa, o bolas sueltas en cajones
function gravedad(P, r) {
  const d = base(P), R = U(r, 0.3, 0.7), cy = 1.2;
  const wh = P.makeWheel(d, 0, cy, R); wh.m = U(r, 1, 5); wh.rpm = Math.round(sg(r) * U(r, 5, 45)); d.parts.push(wh);
  if (r() < 0.5) {
    const na = 3 + Math.floor(r() * 8), L = R * U(r, 0.4, 1);
    for (let k = 0; k < na; k++) {
      const a = k / na * 2 * Math.PI, hx = R * 0.9 * Math.cos(a), hy = cy + R * 0.9 * Math.sin(a), ta = a + U(r, -1, 1);
      const bar = P.makeBar(d, hx, hy, hx + L * Math.cos(ta), hy + L * Math.sin(ta)); bar.m = 0.05; d.parts.push(bar);
      const pin = P.makePin(d, hx, hy, wh.id, bar.id); pin.mode = 'limits'; pin.lo = -U(r, 10, 90); pin.hi = U(r, 10, 90); d.parts.push(pin);
      const b = P.makeBall(d, bar.x2, bar.y2); b.r = 0.04; b.m = U(r, 0.3, 2.3); d.parts.push(b);
      const pw = P.makePin(d, b.x, b.y, bar.id, b.id); pw.mode = 'rigid'; d.parts.push(pw);
    }
  } else {
    wh.style = 'ring'; wh.cells = 4 + Math.floor(r() * 9); wh.tilt = Math.round(U(r, 0, 60));
    P.ringSlots(wh, U(r, 0.04, 0.07)).forEach(q => { if (r() < 0.7) { const b = P.makeBall(d, q.x, q.y); b.r = q.r || 0.05; b.m = U(r, 0.3, 1.8); d.parts.push(b); } });
  }
  return d;
}
// 4. Balancines: palo con topes, canicas, rampa con bisagra en la punta, escalones, contrapeso colgado o fijo, muelle
function balancin(P, r) {
  const d = base(P); d.iters = 60;
  const PY = 0.3, a = U(r, 0.1, 0.35), b = U(r, 0.15, 0.4), th = U(r, -25, 25) * Math.PI / 180;
  const rot = p => [p[0] * Math.cos(th) - (p[1] - PY) * Math.sin(th), PY + p[0] * Math.sin(th) + (p[1] - PY) * Math.cos(th)];
  const lev = P.makeBar(d, ...rot([-a, PY]), ...rot([b, PY])); lev.m = U(r, 0.04, 0.3); lev.th = 0.006; d.parts.push(lev);
  const piv = P.makePin(d, 0, PY, null, lev.id); piv.mode = 'limits'; piv.lo = -U(r, 5, 45); piv.hi = U(r, 5, 45); d.parts.push(piv);
  let tipBody = lev, tip = rot([b, PY]), top = [rot([0.02, PY]), tip];
  if (r() < 0.6) {
    const Lr = U(r, 0.05, 0.2), dr = U(r, -30, 10) * Math.PI / 180, E = [tip[0] + Lr * Math.cos(th + dr), tip[1] + Lr * Math.sin(th + dr)];
    const ramp = P.makeBar(d, tip[0], tip[1], E[0], E[1]); ramp.m = U(r, 0.01, 0.06); ramp.th = 0.004; d.parts.push(ramp);
    const h = P.makePin(d, tip[0], tip[1], lev.id, ramp.id); h.mode = 'limits'; h.lo = -U(r, 0, 30); h.hi = U(r, 0, 70); d.parts.push(h);
    const st = P.makeBar(d, E[0], E[1], E[0], E[1] + 0.03); st.m = 0.003; st.th = 0.003; d.parts.push(st); const w2 = P.makePin(d, E[0], E[1], ramp.id, st.id); w2.mode = 'rigid'; d.parts.push(w2);
    top = [tip, E]; tipBody = ramp;
  }
  const nb = 1 + Math.floor(r() * 2);
  for (let k = 0; k < nb; k++) { const f = U(r, 0.3, 0.9), R = U(r, 0.008, 0.02), px = top[0][0] + f * (top[1][0] - top[0][0]), py = top[0][1] + f * (top[1][1] - top[0][1]);
    const dx = top[1][0] - top[0][0], dy = top[1][1] - top[0][1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, off = 0.0065 + R + 0.001 + k * 0.0;
    const bl = P.makeBall(d, px + off * nx + k * 2.2 * R * dx / L, py + off * ny + k * 2.2 * R * dy / L); bl.r = R; bl.m = U(r, 0.005, 0.1); bl.mat = 'acero'; d.parts.push(bl); }
  const hp = rot([-a * U(r, 0.6, 1), PY]);
  if (r() < 0.5) { const Lc = U(r, 0.04, 0.2), rod = P.makeBar(d, hp[0], hp[1], hp[0], hp[1] - Lc + 0.02); rod.m = 0.002; rod.th = 0.002; rod.plane = 1; d.parts.push(rod);
    const hk = P.makePin(d, hp[0], hp[1], lev.id, rod.id); d.parts.push(hk); const cw = P.makeBall(d, hp[0], hp[1] - Lc); cw.r = 0.02; cw.m = U(r, 0.01, 0.3); d.parts.push(cw);
    const wc = P.makePin(d, hp[0], hp[1] - Lc, rod.id, cw.id); wc.mode = 'rigid'; d.parts.push(wc); }
  else { const cw = P.makeBall(d, hp[0], hp[1]); cw.r = 0.02; cw.m = U(r, 0.01, 0.3); cw.plane = 1; d.parts.push(cw); const wc = P.makePin(d, hp[0], hp[1], lev.id, cw.id); wc.mode = 'rigid'; d.parts.push(wc); }
  const ns = 1 + Math.floor(r() * 2);
  for (let k = 0; k < ns; k++) { const x = U(r, 0.05, 0.6), y = U(r, 0.0, 0.25); const s = P.makeRamp(d, x - 0.04, y - 0.012, x + 0.04, y - 0.012); s.mat = pick(r, ['goma', 'madera']); d.parts.push(s); }
  const fl = P.makeRamp(d, -0.6, -0.1, 0.9, -0.1); d.parts.push(fl);
  if (r() < 0.3) { const sx = rot([b * 0.5, PY]), sp = P.makeSpring(d, sx[0], sx[1], sx[0], sx[1] - 0.15, lev.id, null); sp.k = U(r, 5, 100); sp.damp = 0; d.parts.push(sp); }
  return d;
}
// 5. Péndulos con imanes en la punta, imanes fijos cerca y muelles entre ellos
function pendulos(P, r) {
  const d = base(P), np = 1 + Math.floor(r() * 3), tips = [];
  for (let k = 0; k < np; k++) {
    const px = k * U(r, 0.12, 0.3), py = 0.8, L = U(r, 0.1, 0.4), a = -Math.PI / 2 + U(r, -1.2, 1.2), ex = px + L * Math.cos(a), ey = py + L * Math.sin(a);
    const bar = P.makeBar(d, px, py, ex, ey); bar.m = U(r, 0.02, 0.15); d.parts.push(bar);
    const pin = P.makePin(d, px, py, null, bar.id); d.parts.push(pin);
    const b = P.makeBall(d, ex, ey); b.r = 0.025; b.m = U(r, 0.05, 1); d.parts.push(b); const w = P.makePin(d, ex, ey, bar.id, b.id); w.mode = 'rigid'; d.parts.push(w);
    if (r() < 0.8) { const ma = iman(P, d, r, ex, ey, bar.id); ma.solid = false; }
    tips.push({ bar, ex, ey });
  }
  const nf = Math.floor(r() * 4);
  for (let k = 0; k < nf; k++) { const t = pick(r, tips); iman(P, d, r, t.ex + U(r, -0.15, 0.15), t.ey + U(r, -0.12, -0.05), null); }
  if (np > 1 && r() < 0.6) { const s = P.makeSpring(d, tips[0].ex, tips[0].ey, tips[1].ex, tips[1].ey, tips[0].bar.id, tips[1].bar.id); s.k = U(r, 2, 60); s.damp = 0; d.parts.push(s); }
  return d;
}
// 6. Agua: rueda con flotadores (más ligeros o más pesados que el agua), a medio meter en un tanque, o bolas sueltas
function agua(P, r) {
  const d = base(P); d.iters = 60;
  d.parts.push(P.makeTank(d, 0, 0.05, 0.6, U(r, 0.5, 1.0)));
  const fl = P.makeRamp(d, -0.6, 0.038, 0.7, 0.038); fl.mat = 'madera'; d.parts.push(fl);
  const wl = P.makeRamp(d, 0.612, 0.05, 0.612, 1.2); d.parts.push(wl);
  if (r() < 0.75) {
    const CX = U(r, -0.1, 0.25), CY = U(r, 0.4, 0.9), RR = U(r, 0.15, 0.35), R = U(r, 0.03, 0.06);
    const wh = P.makeWheel(d, CX, CY, 0.05); wh.m = 0.5; wh.rpm = Math.round(sg(r) * U(r, 5, 60)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
    const na = 3 + Math.floor(r() * 8);
    for (let k = 0; k < na; k++) {
      const a = k / na * 2 * Math.PI + U(r, 0, 0.3);
      const arm = P.makeBar(d, CX + 0.05 * Math.cos(a), CY + 0.05 * Math.sin(a), CX + (RR - R) * Math.cos(a), CY + (RR - R) * Math.sin(a)); arm.m = 0.02; arm.th = 0.005; arm.plane = 1; d.parts.push(arm);
      const aw = P.makePin(d, CX + 0.05 * Math.cos(a), CY + 0.05 * Math.sin(a), wh.id, arm.id); aw.mode = r() < 0.7 ? 'rigid' : 'limits'; aw.lo = -U(r, 5, 60); aw.hi = U(r, 5, 60); d.parts.push(aw);
      const b = P.makeBall(d, CX + RR * Math.cos(a), CY + RR * Math.sin(a)); b.r = R; b.m = 1000 * 4 / 3 * Math.PI * R * R * R * U(r, 0.2, 1.6); b.mat = 'acero'; b.plane = 1; d.parts.push(b);
      const bw = P.makePin(d, b.x, b.y, arm.id, b.id); bw.mode = 'rigid'; d.parts.push(bw);
    }
  } else {
    const nb = 2 + Math.floor(r() * 8);
    for (let k = 0; k < nb; k++) { const R = U(r, 0.02, 0.05), b = P.makeBall(d, 0.05 + (k % 5) * 0.11, 0.1 + Math.floor(k / 5) * 0.2 + U(r, 0, 0.3)); b.r = R; b.m = 1000 * 4 / 3 * Math.PI * R * R * R * U(r, 0.2, 1.6); d.parts.push(b); }
  }
  return d;
}
// 7. Todos los ejemplos del banco, con sus medidas cambiadas un poco al azar
function ejemplos(P, r) {
  const keys = Object.keys(P.EXAMPLES), k = pick(r, keys), d = P.EXAMPLES[k].make({});
  d.parts.forEach(p => { ['m', 'r', 'size', 'mu', 'k', 'gen', 'lift'].forEach(f => { if (typeof p[f] === 'number' && p[f] > 0 && r() < 0.5) p[f] *= U(r, 0.7, 1.3); });
    if (typeof p.rpm === 'number' && r() < 0.5) p.rpm = Math.round((p.rpm || 20) * U(r, 0.5, 1.5)); if (typeof p.ang === 'number' && r() < 0.3) p.ang += U(r, -20, 20);
    if (p.kind === 'magnet' && p.shape !== 'electro' && p.size) p.mu = P.magnetModel(p).mu; });
  d.air = false; d.ideal = true; d._ejemplo = k;
  return d;
}
module.exports = { ruedaImanes, palancasImanes, gravedad, balancin, pendulos, agua, ejemplos };
