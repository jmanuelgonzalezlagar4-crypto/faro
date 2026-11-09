// El «Rodillo de flechas» de la app (exampleArrows en app/build.js), copiado tal cual pero con el número de flechas
// como opción (fl). Con fl = 2 sale exactamente el de la app. La leva lleva una punta por flecha, y su caída ocupa
// el mismo ángulo que en la app (23,4°), haya las flechas que haya. Los imanes del cilindro los pone juntos.js.
const E = require('../../app/engine.js'); global.PerpetuumEngine = E;
const P = require('../../app/build.js');
const DEG = Math.PI / 180, CAM_R = P.CAM_R;
const camRim = p => p.th > 0 ? p.th : CAM_R, camDrop = p => p.drop > 0 ? Math.min(0.5, p.drop) : P.CAM_DROP;
const camLift = p => Math.max(0, Math.min(p.r * 0.6, p.lift || 0));
function flechas(opts) {
  opts = opts || {};
  const d = P.emptyDesign();
  d.example = opts.example || 'flechas';
  d.dt = opts.dt || 1 / 960;
  const cx = 0, cy = 0.13, R = 0.05, LEN = 0.13;
  const FL = opts.fl || 2, PASOS = 9, PASO = 360 / FL / PASOS, MIN = 0.006, MAX = 0.05;
  const TH0 = opts.th0 != null ? opts.th0 : 40;
  const alpha = th => (90 + th - TH0) * DEG;
  const base = P.makeRamp(d, -0.11, 0.012, 0.11, 0.012); base.mat = 'madera'; d.parts.push(base);
  const wh = P.makeWheel(d, cx, cy, R);
  wh.m = opts.m || 1.5; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = opts.rpm != null ? opts.rpm : 300; wh.len = LEN; wh.look = 'laton';
  d.parts.push(wh);
  const DS = opts.disc || 0.011, rm = R + DS / 4;
  for (let f = 0; f < FL; f++) for (let k = 0; k < PASOS; k++) {
    const a = alpha(f * 360 / FL + k * PASO), abre = MIN + (MAX - MIN) * k / (PASOS - 1);
    [-1, 1].forEach(sz => {
      const mg = P.makeMagnet(d, +(cx + rm * Math.cos(a)).toFixed(5), +(cy + rm * Math.sin(a)).toFixed(5), wh.id, 'disc');
      mg.size = DS; mg.grade = 'n52'; mg.ang = +(a / DEG).toFixed(2); mg.z = +(sz * abre).toFixed(4); mg.soft = DS / 4; mg.poles = true; mg.mu = P.magnetModel(mg).mu;
      d.parts.push(mg);
    });
  }
  const lift = opts.lift != null ? opts.lift : 0.0165, rTip = opts.camR || 0.046;
  const cam = P.makeCam(d, cx, cy, rTip);
  cam.lift = lift; cam.lobes = FL; cam.m = 0.1; cam.bearing = 'bolas'; cam.len = LEN + 0.02;
  cam.prof = opts.prof || 'rampa'; cam.sg = 1;
  const thDrop = opts.thDrop != null ? opts.thDrop : 4;
  cam.drop = opts.drop || +(0.13 * FL / 2).toFixed(4);   // la caída: 0,13 de cada punta con 2 flechas (23,4°)
  if (cam.prof === 'rampa') cam.phase = +(((90 + thDrop - TH0 - (1 - camDrop(cam)) * 360 / FL) % 360 + 360) % 360).toFixed(3);
  else cam.phase = +(((90 + (opts.thPeak != null ? opts.thPeak : 0) - TH0) % 360 + 360) % 360).toFixed(3);
  d.parts.push(cam);
  const cw = P.makePin(d, cx, cy, wh.id, cam.id); cw.mode = 'rigid'; d.parts.push(cw);
  const Lb = cam.lobes, liftK = camLift(cam);
  cam.th = 0.0015;
  const surf = t => cam.r - liftK + liftK * P.camShape(cam, Lb * (t - cam.phase * DEG)) + camRim(cam);
  const ST = opts.stSize || 0.006, WIDE = opts.wide || 0.015, GAP = opts.gap || 0.004, RR = opts.rr || 0.002, WZ = opts.wz != null ? opts.wz : LEN;
  const top = R + DS / 2, XE = 0.085, sticks = [];
  [1, -1].forEach(s => {
    const rs = top + GAP + ST / 2, ys0 = top + GAP + ST + 0.0025;
    const yRol = surf(s > 0 ? Math.PI / 2 : -Math.PI / 2) + RR;
    const up = (yRol - (cam.r - liftK + camRim(cam) + RR));
    const ys = cy + s * (ys0 + up);
    const bar = P.makeBar(d, -0.0075, ys, XE, ys); bar.m = opts.stickM || 0.05; bar.th = 0.0025; d.parts.push(bar);
    const g = P.makePin(d, 0, ys, null, bar.id); g.mode = 'guia'; g.sang = 90; g.bearing = 'bolas'; d.parts.push(g);
    const st = P.makeMagnet(d, 0, +(cy + s * (rs + up)).toFixed(5), bar.id, 'bar');
    st.size = ST; st.wide = WIDE; st.ang = s > 0 ? -90 : 90; st.grade = opts.stGrade || 'ferrita'; st.wz = WZ; st.z = 0; st.soft = ST / 4; st.poles = true; st.mu = P.magnetModel(st).mu;
    d.parts.push(st);
    const yr = cy + s * yRol;
    const stem = P.makeBar(d, 0, ys, 0, +(yr + s * 0.0015).toFixed(5)); stem.m = 0.003; stem.th = 0.0015; stem.plane = 1; d.parts.push(stem);
    const sw = P.makePin(d, 0, ys, bar.id, stem.id); sw.mode = 'rigid'; d.parts.push(sw);
    const rol = P.makeBall(d, 0, +yr.toFixed(5)); rol.r = RR; rol.m = opts.rolM || 0.01; rol.mat = 'madera'; rol.plane = 1; d.parts.push(rol);
    const rp = P.makePin(d, 0, +yr.toFixed(5), stem.id, rol.id); rp.bearing = 'bolas'; d.parts.push(rp);
    sticks.push(bar);
  });
  const xs = XE - 0.016, y1 = sticks[0].y1, y2 = sticks[1].y1;
  const sp = P.makeSpring(d, xs, y1, xs, y2, sticks[0].id, sticks[1].id);
  sp.k = opts.k != null ? opts.k : 10; sp.rest = +((y1 - y2) - (opts.pre != null ? opts.pre : 0.15)).toFixed(4); sp.damp = 0.02;
  d.parts.push(sp);
  return d;
}
module.exports = { flechas };
if (require.main === module) {
  // comprobación: con 2 flechas sale igual que el de la app
  for (const o of [{}, { disc: 1e-9 }, { rpm: 120 }]) {
    const a = JSON.stringify(P.exampleArrows(o)), b = JSON.stringify(flechas(o));
    console.log(JSON.stringify(o), a === b ? 'igual que la app' : 'DISTINTO');
  }
}
