// Quinta tanda: más ideas de los vídeos, con sus medidas al azar. Todo sin aire ni rozamiento (vacío y modo ideal).
//  1. pistonIman: motor de imanes «de pistón»: un imán en un pistón que va y viene por una guía, unido con una biela a un
//     volante; delante, un imán fijo que lo atrae o lo empuja
//  2. deslizantes: rueda con pesas que se deslizan por guías (hacia fuera o torcidas), sujetas al centro con muelles
//  3. palancaAgua: palanca con un flotador dentro de un tanque en un lado y un contrapeso en el otro, y bolas sueltas
//  4. rebote: bolas que botan sobre una plataforma con muelle, entre dos paredes, con imanes arriba
//  5. trampolin: una bola baja por una rampa, bota en un trampolín con muelle y salta a una repisa con imanes
//  6. ruedaLoca: rueda suelta (sin eje) con una pesa descentrada, un péndulo o bolas dentro, sobre una vía que sube y baja
const U = (r, a, b) => a + (b - a) * r(), pick = (r, a) => a[Math.floor(r() * a.length)], sg = r => (r() < 0.5 ? -1 : 1);
const RR = 0.012, DEG = Math.PI / 180;
function base(P) { const d = P.emptyDesign(); d.air = false; d.ideal = true; d.iters = 40; return d; }
// rampa fija con la cara de arriba en la recta dada; pared vertical con la cara en x (lado: +1 la cara mira a la derecha)
function rampa(P, d, x1, y1, x2, y2, mat) { const p = P.makeRamp(d, x1, y1 - RR, x2, y2 - RR); p.mat = mat || 'madera'; d.parts.push(p); return p; }
function pared(P, d, x, y1, y2, lado) { const p = P.makeRamp(d, x - lado * RR, y1, x - lado * RR, y2); p.mat = 'madera'; d.parts.push(p); return p; }
function suelo(P, d) { rampa(P, d, -1, 0, 1.5, 0); }
function bola(P, d, x, y, R, m, mat, plane) { const b = P.makeBall(d, x, y); b.r = R; b.m = m; b.mat = mat || 'acero'; if (plane) b.plane = plane; d.parts.push(b); return b; }
function iman(P, d, r, x, y, host, o) { o = o || {}; const m = P.makeMagnet(d, x, y, host, o.shape || pick(r, ['bar', 'disc'])); m.ang = o.ang != null ? o.ang : U(r, 0, 360);
  m.grade = o.grade || pick(r, ['n35', 'n52']); m.size = o.size || U(r, 0.01, 0.03); if (o.z) m.z = o.z; if (o.solid === false) m.solid = false; m.mu = P.magnetModel(m).mu; d.parts.push(m); return m; }
function barra(P, d, x1, y1, x2, y2, m, th, plane) { const b = P.makeBar(d, x1, y1, x2, y2); b.m = m; if (th) b.th = th; if (plane) b.plane = plane; d.parts.push(b); return b; }
function suelda(P, d, x, y, a, b) { const w = P.makePin(d, x, y, a, b); w.mode = 'rigid'; d.parts.push(w); return w; }
function eje(P, d, x, y, a, b, lo, hi) { const w = P.makePin(d, x, y, a, b); if (lo != null) { w.mode = 'limits'; w.lo = lo; w.hi = hi; } d.parts.push(w); return w; }
function guia(P, d, x, y, a, b, ang) { const w = P.makePin(d, x, y, a, b); w.mode = 'guia'; w.sang = ang; d.parts.push(w); return w; }
function muelle(P, d, r, x1, y1, x2, y2, a, b, k0, k1) { const s = P.makeSpring(d, x1, y1, x2, y2, a, b); s.k = U(r, k0, k1); s.rest = Math.hypot(x2 - x1, y2 - y1) * U(r, 0.6, 1.4); s.damp = U(r, 0, 0.3); d.parts.push(s); return s; }

// 1. Motor de imanes de pistón
function pistonIman(P, r) {
  const d = base(P), cy = 0.3, R = U(r, 0.06, 0.15);
  const wh = P.makeWheel(d, 0, cy, R); wh.m = U(r, 0.3, 3); wh.rpm = Math.round(sg(r) * U(r, 30, 300)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
  const rc = U(r, 0.015, 0.045), Lc = U(r, 0.08, 0.2) + R, th0 = U(r, 0, 2 * Math.PI), ax = (pick(r, [0, 90, 180, 270]) + U(r, -10, 10)) * DEG, ux = Math.cos(ax), uy = Math.sin(ax);
  const C = [rc * Math.cos(th0), cy + rc * Math.sin(th0)], ph = th0 - ax, s = rc * Math.cos(ph) + Math.sqrt(Lc * Lc - (rc * Math.sin(ph)) ** 2), Pp = [s * ux, cy + s * uy];
  const biela = barra(P, d, C[0], C[1], Pp[0], Pp[1], U(r, 0.005, 0.03), 0.003, 1); eje(P, d, C[0], C[1], wh.id, biela.id);
  const piston = barra(P, d, Pp[0] - 0.01 * ux, Pp[1] - 0.01 * uy, Pp[0] + 0.01 * ux, Pp[1] + 0.01 * uy, U(r, 0.01, 0.1), 0.005, 2);
  eje(P, d, Pp[0], Pp[1], biela.id, piston.id); guia(P, d, Pp[0], Pp[1], null, piston.id, ax / DEG);
  const sp = U(r, 0.01, 0.025), sf = U(r, 0.01, 0.03), gap = U(r, 0.004, 0.03);
  const mp = iman(P, d, r, Pp[0] + (0.01 + sp / 2) * ux, Pp[1] + (0.01 + sp / 2) * uy, piston.id, { ang: ax / DEG + pick(r, [0, 180]), size: sp, solid: false, shape: 'disc' });
  const far = rc + Lc + 0.01 + sp + gap + sf / 2;                                     // más allá de donde llega el pistón
  iman(P, d, r, far * ux, cy + far * uy, null, { ang: ax / DEG + pick(r, [0, 180, 90]), size: sf, solid: false });
  if (r() < 0.4) { const near = -rc + Lc - 0.01 - gap - sf / 2; if (near > R + sf) iman(P, d, r, near * ux, cy + near * uy, null, { ang: ax / DEG + pick(r, [0, 180]), size: sf * 0.8, solid: false, z: 0.03 }); }
  return d;
}

// 2. Rueda con pesas que se deslizan por guías, sujetas al centro con muelles
function deslizantes(P, r) {
  const d = base(P), cy = 0.6, R = U(r, 0.2, 0.4);
  const wh = P.makeWheel(d, 0, cy, R * 0.2); wh.m = U(r, 0.3, 3); wh.rpm = Math.round(sg(r) * U(r, 0, 40)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
  const n = 4 + Math.floor(r() * 5), tilt = U(r, -35, 35) * DEG, mw = U(r, 0.05, 0.5);
  for (let k = 0; k < n; k++) {
    const a = k / n * 2 * Math.PI, g = a + tilt, r0 = U(r, 0.35, 0.9) * R, P0 = [r0 * Math.cos(a), cy + r0 * Math.sin(a)], pl = 1 + (k % 2);
    const sl = barra(P, d, P0[0] - 0.01 * Math.cos(g), P0[1] - 0.01 * Math.sin(g), P0[0] + 0.01 * Math.cos(g), P0[1] + 0.01 * Math.sin(g), 0.005, 0.003, pl);
    const wgt = bola(P, d, P0[0], P0[1], 0.015, mw, 'plomo', pl); suelda(P, d, P0[0], P0[1], sl.id, wgt.id);
    guia(P, d, P0[0], P0[1], wh.id, sl.id, g / DEG);
    const H = [0.1 * R * Math.cos(a), cy + 0.1 * R * Math.sin(a)]; muelle(P, d, r, H[0], H[1], P0[0], P0[1], wh.id, sl.id, 5, 300);
  }
  return d;
}

// 3. Palanca con flotador en un tanque y contrapeso fuera
function palancaAgua(P, r) {
  const d = base(P); d.iters = 60;
  const Wt = U(r, 0.3, 0.6), yb = 0.05, ys = U(r, 0.25, 0.5);
  d.parts.push(P.makeTank(d, 0, yb, Wt, ys)); rampa(P, d, -0.6, yb, Wt + 0.1, yb); pared(P, d, 0, yb, ys + 0.3, 1); pared(P, d, Wt, yb, ys + 0.3, -1);
  const rf = U(r, 0.03, 0.07), mf = 1000 * 4 / 3 * Math.PI * rf ** 3 * U(r, 0.2, 0.9);
  const xp = U(r, -0.05, 0.08), L1 = U(r, 0.15, Wt - 0.02 - xp - rf), L2 = U(r, 0.05, 0.2), a = U(r, -20, 20) * DEG;
  const Fy = ys + U(r, -0.5, 0.5) * rf, E1x = xp + L1 * Math.cos(a), hang = U(r, 0.05, 0.2), yp = Fy + hang - L1 * Math.sin(a);
  const E1 = [E1x, yp + L1 * Math.sin(a)], E2 = [xp - L2 * Math.cos(a), yp - L2 * Math.sin(a)];
  const lev = barra(P, d, E2[0], E2[1], E1[0], E1[1], U(r, 0.02, 0.1), 0.004, 1);
  eje(P, d, xp, yp, null, lev.id, -U(r, 10, 35), U(r, 10, 35));
  const hg = barra(P, d, E1[0], E1[1], E1[0], Fy + rf * 0.5, 0.005, 0.002, 1); suelda(P, d, E1[0], E1[1], lev.id, hg.id);
  const fl = bola(P, d, E1[0], Fy, rf, mf, 'madera'); suelda(P, d, E1[0], Fy, hg.id, fl.id);
  const cw = bola(P, d, E2[0], E2[1] - 0.02, 0.015, U(r, 0.02, 0.5), 'plomo', 1); suelda(P, d, E2[0], E2[1] - 0.02, lev.id, cw.id);
  const nb = Math.floor(r() * 4);
  for (let k = 0; k < nb; k++) { const R2 = U(r, 0.015, 0.035), x = U(r, R2 + 0.01, Wt - R2 - 0.01); if (Math.abs(x - E1[0]) < rf + R2 + 0.01) continue;
    bola(P, d, x, U(r, yb + R2 + 0.002, ys + 0.1), R2, 1000 * 4 / 3 * Math.PI * R2 ** 3 * U(r, 0.3, 3), pick(r, ['madera', 'plomo', 'goma'])); }
  return d;
}

// 4. Bolas que botan sobre una plataforma con muelle, entre dos paredes, con imanes arriba
function rebote(P, r) {
  const d = base(P); suelo(P, d);
  const w = U(r, 0.1, 0.25), yp = U(r, 0.05, 0.15), mp = U(r, 0.02, 0.3);
  const pl = barra(P, d, -w / 2, yp, w / 2, yp, mp, 0.004); guia(P, d, 0, yp, null, pl.id, 90);
  const sp = P.makeSpring(d, 0, 0.004, 0, yp, null, pl.id); sp.k = U(r, 20, 600); sp.rest = yp * U(r, 0.9, 1.6); sp.damp = U(r, 0, 0.3); d.parts.push(sp);
  const H = yp + U(r, 0.2, 0.5); pared(P, d, -w / 2 - 0.015, 0, H, 1); pared(P, d, w / 2 + 0.015, 0, H, -1);
  const nb = 1 + Math.floor(r() * 3), mat = pick(r, ['acero', 'goma', 'plomo']); let y = yp + 0.004;
  for (let k = 0; k < nb; k++) { const R = U(r, 0.008, 0.02); y += R + U(r, 0.01, 0.12); if (y + R > H - 0.01) break; bola(P, d, U(r, -w / 2 + R + 0.004, w / 2 - R - 0.004), y, R, (mat === 'acero' ? 7800 : mat === 'plomo' ? 11300 : 1200) * 4 / 3 * Math.PI * R ** 3, mat); y += R; }
  const nm = Math.floor(r() * 3); for (let k = 0; k < nm; k++) iman(P, d, r, U(r, -w / 2, w / 2), H + U(r, 0.01, 0.04), null, {});
  return d;
}

// 5. Trampolín: rampa, tabla con muelle, repisa con imanes y vuelta
function trampolin(P, r) {
  const d = base(P); suelo(P, d);
  const x0 = 0, y0 = U(r, 0.05, 0.12), Lb = U(r, 0.1, 0.25), a0 = U(r, -10, 10) * DEG, B = [x0 + Lb * Math.cos(a0), y0 + Lb * Math.sin(a0)];
  const tabla = barra(P, d, x0, y0, B[0], B[1], U(r, 0.01, 0.1), 0.004); eje(P, d, x0, y0, null, tabla.id, -U(r, 5, 25), U(r, 5, 25));
  const f = U(r, 0.5, 0.95), S = [x0 + f * Lb * Math.cos(a0), y0 + f * Lb * Math.sin(a0) - 0.004];
  const sp = P.makeSpring(d, S[0], 0.004, S[0], S[1], null, tabla.id); sp.k = U(r, 20, 800); sp.rest = (S[1] - 0.004) * U(r, 0.8, 1.3); sp.damp = U(r, 0, 0.3); d.parts.push(sp);
  const xs = x0 - U(r, 0.1, 0.3), ys = y0 + U(r, 0.1, 0.3); rampa(P, d, xs, ys, x0 + U(r, 0.02, 0.06), y0 + U(r, 0.03, 0.08), pick(r, ['madera', 'acero']));
  const xr = B[0] + U(r, -0.05, 0.15), yr = y0 + U(r, 0.1, 0.35), lr = U(r, 0.1, 0.25);
  rampa(P, d, xr, yr, xr + lr, yr + U(r, -0.02, 0.05), pick(r, ['madera', 'acero', 'goma']));
  if (r() < 0.6) rampa(P, d, xr - 0.005, yr - 0.004, xs + 0.02, ys + U(r, 0.01, 0.06), 'madera');
  const nm = Math.floor(r() * 4); for (let k = 0; k < nm; k++) iman(P, d, r, xr + U(r, 0, lr), yr + U(r, 0.03, 0.08), null, {});
  const R = U(r, 0.008, 0.02), mat = pick(r, ['acero', 'goma']);
  const ang = Math.atan2(y0 + 0.05 - ys, x0 + 0.04 - xs), t = U(r, 0.05, 0.3), bx = xs + t * (x0 + 0.04 - xs), by = ys + t * (y0 + 0.05 - ys);
  bola(P, d, bx - (R + 0.001) * Math.sin(ang), by + (R + 0.001) * Math.cos(ang) + 0.002, R, (mat === 'acero' ? 7800 : 1200) * 4 / 3 * Math.PI * R ** 3, mat);
  return d;
}

// 6. Rueda suelta con peso dentro, sobre una vía que sube y baja
function ruedaLoca(P, r) {
  const d = base(P); suelo(P, d);
  const n = 4 + Math.floor(r() * 4), pts = [[-0.3, U(r, 0.08, 0.2)]];
  for (let k = 1; k <= n; k++) pts.push([-0.3 + k * U(r, 0.15, 0.3), U(r, 0.02, 0.2)]);
  for (let k = 0; k < n; k++) rampa(P, d, pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], pick(r, ['madera', 'goma', 'acero']));
  pared(P, d, pts[0][0], 0, 0.6, 1); pared(P, d, pts[n][0], 0, 0.6, -1);
  const rim = r() < 0.4, R = rim ? U(r, 0.08, 0.15) : U(r, 0.04, 0.12), k0 = Math.floor(r() * n), a = pts[k0], b = pts[k0 + 1], t = U(r, 0.2, 0.8);
  const x = a[0] + t * (b[0] - a[0]), sl = Math.atan2(b[1] - a[1], b[0] - a[0]), y = a[1] + t * (b[1] - a[1]) + (R + 0.003) / Math.cos(sl);
  const wh = P.makeWheel(d, x, y, R); wh.axle = 'free'; wh.m = U(r, 0.05, 1); wh.style = rim ? 'rim' : 'disc'; d.parts.push(wh);
  const tipo = pick(r, ['pesa', 'pendulo', rim ? 'bolas' : 'pesa']);
  if (tipo === 'pesa') { const q = U(r, 0.3, 0.8) * R, g = U(r, 0, 2 * Math.PI), w = bola(P, d, x + q * Math.cos(g), y + q * Math.sin(g), Math.min(0.012, R * 0.2), U(r, 0.02, 0.5), 'plomo', 1); suelda(P, d, w.x, w.y, wh.id, w.id); }
  else if (tipo === 'pendulo') { const L = U(r, 0.3, 0.75) * R, g = U(r, 0, 2 * Math.PI), ex = x + L * Math.cos(g), ey = y + L * Math.sin(g);
    const br = barra(P, d, x, y, ex, ey, 0.005, 0.002, 1); eje(P, d, x, y, wh.id, br.id); const w = bola(P, d, ex, ey, Math.min(0.012, R * 0.2), U(r, 0.02, 0.5), 'plomo', 1); suelda(P, d, ex, ey, br.id, w.id); }
  else { const nb = 1 + Math.floor(r() * 3), Rb = U(r, 0.008, 0.02); for (let k = 0; k < nb; k++) bola(P, d, x + (k - (nb - 1) / 2) * 2.2 * Rb, y - R + 0.016 + Rb + 0.004 + (k === Math.floor(nb / 2) ? 0 : 0.004), Rb, U(r, 0.02, 0.3), 'acero'); }
  return d;
}
module.exports = { pistonIman, deslizantes, palancaAgua, rebote, trampolin, ruedaLoca };
