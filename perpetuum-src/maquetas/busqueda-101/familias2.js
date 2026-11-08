// Más familias, mezclando de todo: rampas con imanes que suben bolas de acero, circuitos de rampas, electroimanes que
// enciende una rueda que mueve la propia bola, levas con imanes, agua con imanes, y mezclas al azar de módulos.
// Todo sin aire ni rozamiento (vacío y modo ideal).
const U = (r, a, b) => a + (b - a) * r(), pick = (r, a) => a[Math.floor(r() * a.length)], sg = r => (r() < 0.5 ? -1 : 1);
const SH = ['bar', 'disc', 'horseshoe'], RR = 0.012;
function base(P) { const d = P.emptyDesign(); d.air = false; d.ideal = true; d.iters = 40; return d; }
function iman(P, d, r, x, y, host, o) { o = o || {}; const m = P.makeMagnet(d, x, y, host, o.shape || pick(r, SH)); m.ang = o.ang != null ? o.ang : U(r, 0, 360); m.grade = pick(r, ['n35', 'n52', 'ferrita']); m.size = o.size || U(r, 0.012, 0.04); m.mu = P.magnetModel(m).mu; if (o.solid === false) m.solid = false; d.parts.push(m); return m; }
function rampa(P, d, x1, y1, x2, y2, mat) { const p = P.makeRamp(d, x1, y1, x2, y2); p.mat = mat || 'madera'; d.parts.push(p); return p; }
function bola(P, d, r, x, y, o) { o = o || {}; const b = P.makeBall(d, x, y); b.r = o.r || U(r, 0.008, 0.025); b.m = o.m || (7800 * 4 / 3 * Math.PI * b.r ** 3); b.mat = o.mat || 'acero'; d.parts.push(b); return b; }
function suelo(P, d) { rampa(P, d, -0.8, -RR, 1.4, -RR, 'madera'); }

// 1. Rampa magnética: una bola de acero sube por una rampa hacia unos imanes, cae por un hueco y vuelve por otra rampa
function rampaMagnetica(P, r) {
  const d = base(P); suelo(P, d);
  const L = U(r, 0.25, 0.6), ang = U(r, 3, 25) * Math.PI / 180, x0 = 0, y0 = U(r, 0.05, 0.15);
  const x1 = x0 + L * Math.cos(ang), y1 = y0 + L * Math.sin(ang);
  rampa(P, d, x0, y0 - RR, x1, y1 - RR, pick(r, ['madera', 'acero']));
  const nm = 1 + Math.floor(r() * 5);                                            // imanes a lo largo y por encima del final
  for (let k = 0; k < nm; k++) { const f = U(r, 0.5, 1.15), h = U(r, 0.025, 0.08); iman(P, d, r, x0 + f * L * Math.cos(ang) - h * Math.sin(ang), y0 + f * L * Math.sin(ang) + h * Math.cos(ang), null, { ang: U(r, 0, 360) }); }
  const gx = x1 + U(r, 0.0, 0.05);                                               // la vuelta: rampa que baja por debajo hasta el principio
  rampa(P, d, gx, y1 - U(r, 0.08, 0.25) - RR, x0 - 0.03, y0 - 0.04 - RR, 'madera');
  rampa(P, d, x0 - 0.06, y0 + 0.05, x0 - 0.06, y0 - 0.06, 'madera');            // tope al principio
  const nb = 1 + Math.floor(r() * 3);
  for (let k = 0; k < nb; k++) { const R = U(r, 0.008, 0.02), f = U(r, 0.05, 0.4); bola(P, d, r, x0 + f * L * Math.cos(ang) - (R + 0.0005) * Math.sin(ang), y0 + f * L * Math.sin(ang) + (R + 0.0005) * Math.cos(ang), { r: R }); }
  return d;
}
// 2. Circuito: varias rampas en lazo, bolas de acero, imanes fijos y un electroimán que enciende una rueda de paletas
//    que mueve la propia bola
function circuito(P, r) {
  const d = base(P); suelo(P, d);
  const n = 3 + Math.floor(r() * 3), cx = 0.3, cy = 0.35, R = U(r, 0.15, 0.3), pts = [];
  for (let k = 0; k < n; k++) { const a = k / n * 2 * Math.PI + U(r, -0.3, 0.3); pts.push([cx + R * Math.cos(a) * U(r, 0.8, 1.2), cy + R * Math.sin(a) * U(r, 0.6, 1)]); }
  for (let k = 0; k < n; k++) { const a = pts[k], b = pts[(k + 1) % n]; rampa(P, d, a[0], a[1] - RR, b[0] + U(r, -0.03, 0.03), b[1] - RR - U(r, 0, 0.04), pick(r, ['madera', 'acero', 'goma'])); }
  const wh = P.makeWheel(d, cx + U(r, -0.1, 0.1), cy + U(r, -0.1, 0.1), U(r, 0.04, 0.09)); wh.m = U(r, 0.05, 0.4); wh.style = 'ring'; wh.cells = 4 + Math.floor(r() * 5); wh.rpm = Math.round(sg(r) * U(r, 0, 40)); wh.plane = 1;
  if (r() < 0.6) { wh.gen = U(r, 0.001, 0.02); wh.gdest = 'bus'; } d.parts.push(wh);
  const nm = Math.floor(r() * 4); for (let k = 0; k < nm; k++) iman(P, d, r, cx + U(r, -0.35, 0.35), cy + U(r, -0.3, 0.3), null);
  if (r() < 0.7) { const e = P.makeMagnet(d, cx + U(r, -0.3, 0.3), cy + U(r, -0.25, 0.25), null, 'electro'); e.ang = U(r, 0, 360); e.mu = U(r, 1, 10); e.emode = 'window'; e.ewheel = wh.id; e.efrom = U(r, 0, 360); e.eto = e.efrom + U(r, 5, 90); e.eevery = 360 / wh.cells; e.esrc = r() < 0.5 ? 'bus' : undefined; d.parts.push(e); }
  const nb = 1 + Math.floor(r() * 4); for (let k = 0; k < nb; k++) { const a = pts[k % n], b = pts[(k + 1) % n], f = U(r, 0.2, 0.8), Rb = U(r, 0.008, 0.02); bola(P, d, r, a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1]) + Rb + 0.003, { r: Rb }); }
  return d;
}
// 3. Leva con imán: una rueda con leva levanta una palanca con imán; un imán fijo y un muelle; generador y motor con acumulador
function levaIman(P, r) {
  const d = base(P);
  const wh = P.makeWheel(d, 0, 0.4, U(r, 0.08, 0.2)); wh.m = U(r, 0.3, 3); wh.rpm = Math.round(sg(r) * U(r, 10, 90)); if (r() < 0.6) { wh.gen = U(r, 0.003, 0.05); wh.gdest = 'bus'; } if (r() < 0.3) { wh.motor = true; wh.mrpm = wh.rpm; wh.mtorque = U(r, 0.02, 0.3); wh.msrc = 'bus'; } d.parts.push(wh);
  const cam = P.makeCam(d, 0, 0.4, wh.r * U(r, 0.4, 0.8)); cam.lobes = 1 + Math.floor(r() * 3); cam.prof = r() < 0.5 ? 'rampa' : undefined; d.parts.push(cam);
  const wcam = P.makePin(d, 0, 0.4, wh.id, cam.id); wcam.mode = 'rigid'; d.parts.push(wcam);
  const px = U(r, -0.25, 0.25), py = 0.4 + cam.r + U(r, 0.08, 0.2), tx = U(r, -0.05, 0.05), ty = 0.4 + cam.r + 0.015;
  const lev = P.makeBar(d, px, py, tx, ty); lev.m = U(r, 0.03, 0.2); lev.plane = 1; d.parts.push(lev);
  const pin = P.makePin(d, px, py, null, lev.id); pin.mode = 'limits'; pin.lo = -U(r, 5, 40); pin.hi = U(r, 5, 40); d.parts.push(pin);
  const ro = P.makeBall(d, tx, ty); ro.r = 0.01; ro.m = 0.01; ro.mat = 'madera'; ro.plane = 1; d.parts.push(ro); const wr = P.makePin(d, tx, ty, lev.id, ro.id); d.parts.push(wr);
  const mx = (px + tx) / 2, my = (py + ty) / 2; iman(P, d, r, mx, my, lev.id, { solid: false });
  const nf = 1 + Math.floor(r() * 3); for (let k = 0; k < nf; k++) iman(P, d, r, mx + U(r, -0.12, 0.12), my + U(r, 0.04, 0.12) * sg(r), null);
  if (r() < 0.6) { const sp = P.makeSpring(d, mx, my, mx, my + 0.12, lev.id, null); sp.k = U(r, 5, 150); sp.damp = 0; d.parts.push(sp); }
  return d;
}
// 4. Agua e imanes: rueda con flotadores que llevan imanes, imanes fijos junto al tanque, bolas de acero que flotan o se hunden
function aguaImanes(P, r) {
  const d = base(P); d.iters = 60;
  d.parts.push(P.makeTank(d, 0, 0.05, 0.6, U(r, 0.5, 1.0)));
  rampa(P, d, -0.6, 0.038, 0.7, 0.038, 'madera'); rampa(P, d, 0.612, 0.05, 0.612, 1.2);
  const CX = U(r, 0.0, 0.3), CY = U(r, 0.4, 0.9), RRw = U(r, 0.15, 0.3), R = U(r, 0.03, 0.05);
  const wh = P.makeWheel(d, CX, CY, 0.05); wh.m = 0.5; wh.rpm = Math.round(sg(r) * U(r, 5, 50)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.03); wh.gdest = 'bus'; } d.parts.push(wh);
  const na = 3 + Math.floor(r() * 6);
  for (let k = 0; k < na; k++) {
    const a = k / na * 2 * Math.PI;
    const arm = P.makeBar(d, CX + 0.05 * Math.cos(a), CY + 0.05 * Math.sin(a), CX + (RRw - R) * Math.cos(a), CY + (RRw - R) * Math.sin(a)); arm.m = 0.02; arm.th = 0.005; arm.plane = 1; d.parts.push(arm);
    const aw = P.makePin(d, CX + 0.05 * Math.cos(a), CY + 0.05 * Math.sin(a), wh.id, arm.id); aw.mode = 'rigid'; d.parts.push(aw);
    const b = P.makeBall(d, CX + RRw * Math.cos(a), CY + RRw * Math.sin(a)); b.r = R; b.m = 1000 * 4 / 3 * Math.PI * R ** 3 * U(r, 0.2, 1.5); b.mat = 'madera'; b.plane = 1; d.parts.push(b);
    const bw = P.makePin(d, b.x, b.y, arm.id, b.id); bw.mode = 'rigid'; d.parts.push(bw);
    if (r() < 0.6) iman(P, d, r, b.x, b.y, b.id, { solid: false, size: U(r, 0.012, 0.03) });
  }
  const nf = 1 + Math.floor(r() * 4); for (let k = 0; k < nf; k++) iman(P, d, r, U(r, -0.2, 0.75), U(r, 0.1, 1.1), null, { solid: false });
  return d;
}
// 5. Mezcla: de 2 a 5 módulos al azar en el mismo sitio
const MOD = {
  rueda(P, d, r, ox, oy, c) { const R = U(r, 0.08, 0.25), wh = P.makeWheel(d, ox, oy, R); wh.m = U(r, 0.2, 3); wh.rpm = Math.round(sg(r) * U(r, 0, 60)); if (r() < 0.5) { wh.gen = U(r, 0.002, 0.05); wh.gdest = 'bus'; } if (r() < 0.25) { wh.motor = true; wh.mrpm = wh.rpm || 30; wh.mtorque = U(r, 0.02, 0.3); wh.msrc = 'bus'; } d.parts.push(wh); c.ruedas.push(wh);
    const nm = Math.floor(r() * 6); for (let k = 0; k < nm; k++) { const a = U(r, 0, 2 * Math.PI), q = R * U(r, 0.6, 0.9); iman(P, d, r, ox + q * Math.cos(a), oy + q * Math.sin(a), wh.id); }
    if (r() < 0.4) { const na = 2 + Math.floor(r() * 4); for (let k = 0; k < na; k++) { const a = k / na * 2 * Math.PI, hx = ox + R * 0.85 * Math.cos(a), hy = oy + R * 0.85 * Math.sin(a), L = U(r, 0.05, 0.15), ta = a + U(r, -1, 1);
      const bar = P.makeBar(d, hx, hy, hx + L * Math.cos(ta), hy + L * Math.sin(ta)); bar.m = 0.02; bar.plane = 1; d.parts.push(bar); const pin = P.makePin(d, hx, hy, wh.id, bar.id); pin.mode = 'limits'; pin.lo = -U(r, 10, 80); pin.hi = U(r, 10, 80); d.parts.push(pin);
      const b = P.makeBall(d, bar.x2, bar.y2); b.r = 0.015; b.m = U(r, 0.02, 0.3); b.plane = 1; d.parts.push(b); const pw = P.makePin(d, b.x, b.y, bar.id, b.id); pw.mode = 'rigid'; d.parts.push(pw); } } },
  palanca(P, d, r, ox, oy) { const L = U(r, 0.1, 0.35), a = U(r, -0.6, 0.6), bar = P.makeBar(d, ox - L / 2 * Math.cos(a), oy - L / 2 * Math.sin(a), ox + L / 2 * Math.cos(a), oy + L / 2 * Math.sin(a)); bar.m = U(r, 0.02, 0.2); d.parts.push(bar);
    const pin = P.makePin(d, ox + U(r, -0.3, 0.3) * L, oy, null, bar.id); pin.mode = 'limits'; pin.lo = -U(r, 5, 45); pin.hi = U(r, 5, 45); pin.x = ox; pin.y = oy; d.parts.push(pin);
    if (r() < 0.6) iman(P, d, r, bar.x2, bar.y2, bar.id, { solid: false }); if (r() < 0.5) { const b = bola(P, d, r, bar.x1, bar.y1 + 0.03, { mat: pick(r, ['acero', 'plomo', 'goma']) }); }
    if (r() < 0.4) { const sp = P.makeSpring(d, bar.x1, bar.y1, bar.x1, bar.y1 - 0.12, bar.id, null); sp.k = U(r, 5, 100); sp.damp = 0; d.parts.push(sp); } },
  pendulo(P, d, r, ox, oy) { const L = U(r, 0.08, 0.3), a = -Math.PI / 2 + U(r, -1.3, 1.3), ex = ox + L * Math.cos(a), ey = oy + L * Math.sin(a), bar = P.makeBar(d, ox, oy, ex, ey); bar.m = U(r, 0.01, 0.1); bar.plane = 2; d.parts.push(bar);
    const pin = P.makePin(d, ox, oy, null, bar.id); d.parts.push(pin); const b = P.makeBall(d, ex, ey); b.r = 0.02; b.m = U(r, 0.05, 0.6); b.plane = 2; d.parts.push(b); const w = P.makePin(d, ex, ey, bar.id, b.id); w.mode = 'rigid'; d.parts.push(w);
    if (r() < 0.7) iman(P, d, r, ex, ey, bar.id, { solid: false }); },
  rampaBolas(P, d, r, ox, oy) { const L = U(r, 0.15, 0.45), a = U(r, -0.5, 0.5); rampa(P, d, ox - L / 2 * Math.cos(a), oy - L / 2 * Math.sin(a) - RR, ox + L / 2 * Math.cos(a), oy + L / 2 * Math.sin(a) - RR, pick(r, ['madera', 'acero', 'goma']));
    const nb = 1 + Math.floor(r() * 3); for (let k = 0; k < nb; k++) { const f = U(r, -0.4, 0.4), Rb = U(r, 0.008, 0.025); bola(P, d, r, ox + f * L * Math.cos(a) - (Rb + 0.001) * Math.sin(a), oy + f * L * Math.sin(a) + (Rb + 0.001) * Math.cos(a), { r: Rb, mat: pick(r, ['acero', 'acero', 'plomo', 'goma']) }); } },
  imanes(P, d, r, ox, oy) { const n = 1 + Math.floor(r() * 4); for (let k = 0; k < n; k++) iman(P, d, r, ox + U(r, -0.12, 0.12), oy + U(r, -0.12, 0.12), null); },
  electro(P, d, r, ox, oy, c) { const e = P.makeMagnet(d, ox, oy, null, 'electro'); e.ang = U(r, 0, 360); e.mu = U(r, 1, 12); const wh = c.ruedas.length ? pick(r, c.ruedas) : null;
    if (wh) { e.emode = 'window'; e.ewheel = wh.id; e.efrom = U(r, 0, 360); e.eto = e.efrom + U(r, 5, 120); e.eevery = pick(r, [360, 180, 120, 90, 60]); } e.esrc = r() < 0.5 ? 'bus' : undefined; d.parts.push(e); },
  muelle(P, d, r, ox, oy) { const b = bola(P, d, r, ox, oy, { r: U(r, 0.015, 0.03), mat: pick(r, ['acero', 'plomo']) }); const sp = P.makeSpring(d, ox, oy, ox + U(r, -0.1, 0.1), oy + U(r, 0.08, 0.2), b.id, null); sp.k = U(r, 5, 200); sp.damp = 0; d.parts.push(sp); },
  agua(P, d, r, ox, oy) { if (d.parts.some(p => p.kind === 'tank')) return; d.parts.push(P.makeTank(d, ox - 0.15, -0.0, ox + 0.15, U(r, 0.15, 0.4))); const nb = 1 + Math.floor(r() * 3); for (let k = 0; k < nb; k++) { const Rb = U(r, 0.02, 0.04); bola(P, d, r, ox + U(r, -0.1, 0.1), U(r, 0.05, 0.3), { r: Rb, m: 1000 * 4 / 3 * Math.PI * Rb ** 3 * U(r, 0.2, 1.6), mat: pick(r, ['acero', 'madera']) }); } },
};
function mezcla(P, r) {
  const d = base(P); suelo(P, d); d.iters = 40;
  const c = { ruedas: [] }, keys = Object.keys(MOD), n = 2 + Math.floor(r() * 4), elegidos = [];
  for (let k = 0; k < n; k++) elegidos.push(pick(r, keys));
  elegidos.sort((a, b) => (a === 'rueda' ? -1 : 0) - (b === 'rueda' ? -1 : 0));        // las ruedas primero, para los electroimanes
  elegidos.forEach(k => MOD[k](P, d, r, U(r, 0, 0.8), U(r, 0.12, 0.8), c));
  d._mods = elegidos.join('+');
  return d;
}
module.exports = { rampaMagnetica, circuito, levaIman, aguaImanes, mezcla };
