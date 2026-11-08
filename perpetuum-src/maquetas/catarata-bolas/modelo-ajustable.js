// Catarata de bolas con todo ajustable: H = alto del agua, m = masa de las bolas, sobre = cuánto sobresale
// la salida por encima del agua (0: el agua hasta arriba), nf = bolas en la fila de fuera (0: caída máxima)
module.exports = function (P, o) {
  const d = P.emptyDesign(), RR = P.RAMP_R;
  d.example = 'catarata'; d.iters = 60;
  const H = o.H || 1, M = o.m || 0.247, sobre = o.sobre != null ? o.sobre : 0.15, nf = o.nf || 0;
  const YB = 0.05, YS = YB + H, X0 = 0, X1 = 0.11, R = 0.05, TOP = YS + sobre;
  const tk = P.makeTank(d, X0, YB, X1, YS); tk.rho = o.rho || 1000; d.parts.push(tk);
  const wall = (x1, y1, x2, y2) => { const r = P.makeRamp(d, x1, y1, x2, y2); r.mat = 'madera'; d.parts.push(r); };
  const YC = YB + R, XH = X1 + R - 0.006, XT = XH + 2 * R;
  const c = XT - YC + Math.SQRT2 * (R + RR), xf = c + YB - RR, half = R + 0.006 + RR, HT = TOP - 0.14;
  wall(-0.05, YB - RR, xf, YB - RR);
  wall(xf, YB - RR, xf + 0.15, YB - RR + 0.15);
  wall(X0 - RR, YB - RR, X0 - RR, TOP + 0.25);
  wall(X1 + RR, YB + 2 * R + 0.02, X1 + RR, TOP - RR);
  const tx = 0.055 - 0.5 * (R + RR), ty = TOP + 0.02 + 0.866 * (R + RR), t30 = Math.tan(Math.PI / 6);
  wall(-0.03, ty + (-0.03 - tx) * t30, X1 + 0.07, ty + (X1 + 0.07 - tx) * t30);
  wall(X1 + 0.035, TOP - 0.03, XT - half, HT);
  wall(XT - half, YB + 2 * R + 0.02, XT - half, HT);
  wall(XT + half, XT + half - c, XT + half, TOP + 0.1);
  const spots = [], nt = o.nt || Math.max(4, Math.floor((TOP + 0.02 - 0.3) / 0.1005));
  for (let k = 0; k < nt; k++) spots.push([0.055, TOP + 0.02 - 2 * R * k - 0.0005 * k]);
  spots.push([XH, YC], [XT, YC]);
  for (let k = 1; k <= nf; k++) spots.push([XT, YC + 2 * R * k + 0.0005 * k]);
  spots.forEach(q => { const b = P.makeBall(d, q[0], q[1]); b.r = R; b.m = M; b.mat = 'acero'; d.parts.push(b); });
  if (o.ideal) d.ideal = true;
  d._nt = nt;
  return d;
};
