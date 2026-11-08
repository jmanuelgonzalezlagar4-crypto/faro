// Balancín de la canica (como en el vídeo «The infinite oscillations»): un palo con eje en el poste, un
// contrapeso a la izquierda y una canica que rueda por el brazo derecho entre dos topes. Topes abajo a cada lado.
module.exports = function (P, o) {
  o = o || {};
  const d = P.emptyDesign(); d.example = 'balancin'; d.iters = 60;
  const PY = 0.22, XL = -0.26, XR = 0.42;
  const lever = P.makeBar(d, XL, PY, XR, PY); lever.m = o.ml || 0.12; lever.th = 0.006; d.parts.push(lever);
  const pin = P.makePin(d, 0, PY, null, lever.id); pin.mode = 'free'; pin.bearing = o.eje || 'bolas'; d.parts.push(pin);
  // topes de la canica, soldados al palo
  [[0.035, 'izq'], [XR - 0.01, 'der']].forEach(([x]) => { const s = P.makeBar(d, x, PY, x, PY + 0.03); s.m = 0.005; s.th = 0.004; d.parts.push(s);
    const sp = P.makePin(d, x, PY, lever.id, s.id); sp.mode = 'rigid'; d.parts.push(sp); });
  // contrapeso (arandelas) soldado a la punta izquierda
  const cw = P.makeBall(d, XL + 0.01, PY - 0.03); cw.r = 0.02; cw.m = o.mc || 0.056; cw.mat = 'acero'; cw.plane = 0; d.parts.push(cw);
  const cp = P.makePin(d, XL + 0.01, PY, lever.id, cw.id); cp.mode = 'rigid'; d.parts.push(cp);
  // la canica
  const R = 0.01, x0 = o.x0 != null ? o.x0 : 0.06;
  const ball = P.makeBall(d, x0, PY + 0.006 + R + 0.0005); ball.r = R; ball.m = o.mb || 0.02; ball.mat = o.mat || 'acero'; d.parts.push(ball);
  // la base: topes del palo a cada lado (las almohadillas negras)
  const pad = (x1, x2, y) => { const r = P.makeRamp(d, x1, y, x2, y); r.mat = 'goma'; d.parts.push(r); };
  pad(0.34, 0.46, 0.14);                  // a la derecha: el palo baja hasta aquí
  pad(-0.31, -0.19, 0.12);                // a la izquierda: el contrapeso baja hasta aquí
  if (o.truco) {
    // el truco: una pieza de acero bajo la punta derecha (el rodillo negro) y dos electroimanes en la base
    const st = P.makeBall(d, XR - 0.03, PY - 0.02); st.r = 0.012; st.m = 0.01; st.mat = 'acero'; st.plane = 1; d.parts.push(st);
    const sp = P.makePin(d, XR - 0.03, PY, lever.id, st.id); sp.mode = 'rigid'; d.parts.push(sp);
    const eR = P.makeMagnet(d, XR - 0.03, 0.10, null, 'electro'); eR.mu = o.mu || 4; eR.ang = 90; eR.size = 0.03; eR.solid = false; eR.emode = 'always'; d.parts.push(eR);
    const eL = P.makeMagnet(d, XL + 0.01, 0.09, null, 'electro'); eL.mu = o.mu || 4; eL.ang = 90; eL.size = 0.03; eL.solid = false; eL.emode = 'always'; d.parts.push(eL);
    d._eR = eR.id; d._eL = eL.id;
  }
  if (o.ideal) d.ideal = true;
  if (o.ang) { /* inclinación inicial del palo, en grados (positivo: baja la derecha) */ }
  d._ids = { lever: lever.id, ball: ball.id, cw: cw.id };
  return d;
};
