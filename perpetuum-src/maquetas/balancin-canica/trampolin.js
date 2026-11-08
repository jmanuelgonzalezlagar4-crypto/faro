// El balancín como lo describe el usuario: un trampolín. El lado de la bola pesa más y baja; al bajar se apoya en
// un escalón y la bola rueda hacia delante hasta una bisagra; la rampa que cuelga de la bisagra se dobla hasta el
// suelo; la bola ya no carga sobre el palo y el lado de la bobina vuelve a pesar más y levanta la rampa.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'trampolin'; d.iters = 60;
  const PY = 0.22, XL = -0.26, XH = 0.28, XE = 0.46;
  const lever = P.makeBar(d, XL, PY, XH, PY); lever.m = 0.12; lever.th = 0.006; d.parts.push(lever);
  const piv = P.makePin(d, 0, PY, null, lever.id); piv.mode = 'free'; piv.bearing = o.eje || 'bolas'; d.parts.push(piv);
  const stop0 = P.makeBar(d, 0.035, PY, 0.035, PY + 0.03); stop0.m = 0.005; stop0.th = 0.004; d.parts.push(stop0);
  const s0 = P.makePin(d, 0.035, PY, lever.id, stop0.id); s0.mode = 'rigid'; d.parts.push(s0);
  // la bobina colgada (contrapeso) en la punta izquierda
  const cw = P.makeBall(d, XL + 0.01, PY - 0.03); cw.r = 0.02; cw.m = o.mc || 0.044; cw.mat = 'acero'; d.parts.push(cw);
  const cp = P.makePin(d, XL + 0.01, PY, lever.id, cw.id); cp.mode = 'rigid'; d.parts.push(cp);
  // la rampa, colgada de una bisagra en la punta derecha: se dobla hacia abajo, no hacia arriba de la recta
  const ramp = P.makeBar(d, XH, PY, XE, PY); ramp.m = o.mr || 0.02; ramp.th = 0.006; d.parts.push(ramp);
  const hin = P.makePin(d, XH, PY, lever.id, ramp.id); hin.mode = 'limits'; hin.lo = o.lo != null ? o.lo : -80; hin.hi = o.hi != null ? o.hi : 0; hin.bearing = o.eje || 'bolas'; d.parts.push(hin);
  // el muelle del trampolín: un mástil en la punta del palo tira de la rampa hacia arriba (la bisagra no deja pasar de la recta)
  if (o.k !== 0) {
  const mast = P.makeBar(d, XH, PY, XH, PY + 0.08); mast.m = 0.005; mast.th = 0.004; mast.plane = 1; d.parts.push(mast);
  const mp = P.makePin(d, XH, PY, lever.id, mast.id); mp.mode = 'rigid'; d.parts.push(mp);
  const spr = P.makeSpring(d, XH, PY + 0.08, XH + 0.12, PY, mast.id, ramp.id); spr.k = o.k || 5; spr.rest = o.rest || 0.074; spr.damp = 0.01; d.parts.push(spr);
  }
  const stopE = P.makeBar(d, XE - 0.01, PY, XE - 0.01, PY + 0.03); stopE.m = 0.003; stopE.th = 0.004; d.parts.push(stopE);
  const sE = P.makePin(d, XE - 0.01, PY, ramp.id, stopE.id); sE.mode = 'rigid'; d.parts.push(sE);
  // la bola
  const R = 0.01, ball = P.makeBall(d, o.x0 || 0.15, PY + 0.006 + R + 0.0005); ball.r = R; ball.m = o.mb || 0.02; ball.mat = 'acero'; d.parts.push(ball);
  // la base: el suelo, el escalón bajo el palo y el tope del contrapeso
  const pad = (x1, y1, x2, y2, mat) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'madera'; d.parts.push(r); };
  pad(-0.35, 0.0, 1.0, 0.0);                          // la tabla
  pad(1.0, 0.0, 1.0, 0.1);                            // una pared al final de la tabla
  if (o.final) {
    // el escalón al final de la rampa, y el suelo (la base) debajo de la bisagra
    pad(XE - 0.05, o.esc || 0.178, XE + 0.05, o.esc || 0.178, 'goma');
    pad(0.20, o.suelo || 0.10, 0.36, o.suelo || 0.10, 'goma');
  } else pad(0.16, o.esc || 0.15, 0.27, o.esc || 0.15, 'goma');   // el escalón
  pad(-0.31, 0.12, -0.19, 0.12, 'goma');              // el tope del contrapeso
  if (o.ideal) d.ideal = true;
  d._ids = { lever: lever.id, ramp: ramp.id, ball: ball.id };
  return d;
};
