// La rampa de John Wilkins (1648) tal como sale en la captura del vídeo que mandó el usuario: un pilar con un imán
// encima, una rampa recta que sube hasta el imán con un agujero justo antes de llegar, una rampa curva de vuelta por
// debajo que acaba en un gancho y deja la bola otra vez al pie de la rampa recta.
// Medidas en píxeles de la foto (escala de 2000 px de ancho), pasadas a metros con k m/px. La bola de la foto mide
// 70 px; con k = 0,000715 sale de 5 cm, y el grueso de las rampas del banco (24 mm) coincide con el de la foto.
module.exports = function (P, o) {
  o = Object.assign({ k: 0.000715, tam: 0.286, grado: 'ferrita', ang: 0, polos: true, magX: 770, magY: 170,
    agujero: 960, pie: 1640, rb: 0.025, mb: null, mat: 'madera', salida: 'foto', v0: 0, ideal: false }, o || {});
  const d = P.emptyDesign(); d.example = 'wilkins-foto'; d.iters = 40; d.air = !o.ideal; if (o.ideal) d.ideal = true;
  const k = o.k, X = px => px * k, Y = py => (1000 - py) * k, RR = 0.012;
  // una rampa cuya cara de arriba pasa por los puntos (px) dados: el centro va RR por debajo, en perpendicular
  const cara = (pts, mat) => { for (let i = 0; i + 1 < pts.length; i++) { const [x1, y1] = [X(pts[i][0]), Y(pts[i][1])], [x2, y2] = [X(pts[i + 1][0]), Y(pts[i + 1][1])];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, s = nx * 0 + ny >= 0 ? 1 : -1;   // normal hacia arriba
    const r = P.makeRamp(d, x1 - s * RR * nx, y1 - s * RR * ny, x2 - s * RR * nx, y2 - s * RR * ny); r.mat = mat || o.mat; d.parts.push(r); } };
  // el suelo y el pilar (su cara derecha y su tejado)
  cara([[0, 1000], [2000, 1000]], 'madera');
  const pared = P.makeRamp(d, X(860) + RR, Y(250), X(860) + RR, Y(1000)); pared.mat = 'madera'; d.parts.push(pared);
  cara([[310, 250], [860, 250]], 'madera');
  // la rampa recta: del agujero hasta su pie. Como la dibujó el usuario, el pie queda antes del gancho (x = 1640)
  const yR = x => 900 - (1850 - x) * (523 / 890), pie = [o.pie, yR(o.pie)], arriba = [o.agujero, yR(o.agujero)];
  cara([arriba, pie]);
  // la rampa curva de vuelta: empieza bajo el agujero, pasa por debajo de la recta y acaba en un gancho más allá del
  // pie de la recta, que sube, se curva hacia la izquierda y deja la bola justo encima del pie (a una bola de altura)
  const curva = [[880, 450], [905, 520], [950, 600], [1020, 680], [1100, 750], [1200, 820], [1300, 870], [1420, 920], [1550, 958], [1650, 968], [1730, 950], [1790, 900], [1820, 840], [1815, 780], [1790, 735], [1745, 708]];
  const alto = pie[1] - 77;                                          // la cara de arriba del gancho, una bola por encima del pie
  curva.push([1700, alto], [o.pie + 25, alto + 2]);
  // por dentro del gancho la bola va por debajo de la rampa: sus trozos de arriba llevan la cara hacia abajo
  for (let i = 0; i + 1 < curva.length; i++) { const a = curva[i], b = curva[i + 1], dentro = a[0] > b[0] && i >= curva.length - 6;
    if (!dentro) { cara([a, b]); continue; }
    const [x1, y1] = [X(a[0]), Y(a[1])], [x2, y2] = [X(b[0]), Y(b[1])], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, sg = ny <= 0 ? 1 : -1;
    const r = P.makeRamp(d, x1 + sg * RR * nx * -1, y1 + sg * RR * ny * -1, x2 + sg * RR * nx * -1, y2 + sg * RR * ny * -1); r.mat = o.mat; d.parts.push(r); }
  // el imán, encima del pilar: imantado a lo largo, con el polo de la derecha junto a la punta de la rampa
  const mg = P.makeMagnet(d, X(o.magX), Y(o.magY), null, 'bar'); mg.ang = o.ang; mg.grade = o.grado; mg.size = o.tam; mg.poles = o.polos; mg.mu = P.magnetModel(mg).mu; d.parts.push(mg);
  // la bola de acero
  const R = o.rb, m = o.mb || 7800 * 4 / 3 * Math.PI * R ** 3;
  let bx, by; if (o.salida === 'pie') { bx = o.pie - 60; by = 900 - (1850 - bx) * (523 / 890); } else { bx = 1155; by = 900 - (1850 - 1155) * (523 / 890); }
  const ang = Math.atan2(523, 890), nx = -Math.sin(ang), ny = Math.cos(ang);   // normal de la rampa (hacia arriba)
  const b = P.makeBall(d, X(bx) + (R + 0.0005) * Math.sin(ang) * 0 + (R + 0.0005) * 0, Y(by) + R + 0.0005); b.r = R; b.m = m; b.mat = 'acero';
  // apoyada sobre la rampa, en perpendicular a ella
  b.x = X(bx) + (R + 0.0005) * (-Math.sin(-ang)) * 0; b.x = X(bx) + (R + 0.0005) * Math.sin(ang); b.y = Y(by) + (R + 0.0005) * Math.cos(ang);
  if (o.v0) { b.vx0 = -o.v0 * Math.cos(ang); b.vy0 = o.v0 * Math.sin(ang); }
  d.parts.push(b);
  d._ids = { bola: b.id, iman: mg.id }; d._o = o; d._k = k;
  return d;
};
