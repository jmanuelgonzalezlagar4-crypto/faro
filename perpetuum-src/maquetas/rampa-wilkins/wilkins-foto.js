// La rampa de John Wilkins (1648) tal como sale en la captura del vídeo que mandó el usuario: un pilar con un imán
// encima, una rampa recta que sube hasta el imán con un agujero justo antes de llegar, una rampa curva de vuelta por
// debajo que acaba en un gancho y deja la bola otra vez al pie de la rampa recta.
// Medidas en píxeles de la foto (escala de 2000 px de ancho), pasadas a metros con k m/px. La bola de la foto mide
// 70 px; con k = 0,000715 sale de 5 cm, y el grueso de las rampas del banco (24 mm) coincide con el de la foto.
module.exports = function (P, o) {
  o = Object.assign({ k: 0.000715, tam: 0.286, grado: 'ferrita', ang: 0, polos: true, magX: 770, magY: 170,
    agujero: 960, rb: 0.025, mb: null, mat: 'madera', salida: 'foto', v0: 0, ideal: false }, o || {});
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
  // la rampa recta: de su pie (1850, 900) hasta el agujero
  const pie = [1850, 900], arriba = [o.agujero, 900 - (1850 - o.agujero) * (523 / 890)];
  cara([arriba, pie]);
  // un tope pequeño al pie para que la bola no se salga por la derecha
  // la rampa curva de vuelta, que empieza bajo el agujero, y el gancho
  cara([[880, 450], [905, 520], [950, 600], [1020, 680], [1100, 750], [1200, 820], [1300, 870], [1420, 920], [1550, 958], [1650, 968], [1730, 948], [1790, 900], [1828, 840], [1834, 800], [1815, 778]]);
  // el imán, encima del pilar: imantado a lo largo, con el polo de la derecha junto a la punta de la rampa
  const mg = P.makeMagnet(d, X(o.magX), Y(o.magY), null, 'bar'); mg.ang = o.ang; mg.grade = o.grado; mg.size = o.tam; mg.poles = o.polos; mg.mu = P.magnetModel(mg).mu; d.parts.push(mg);
  // la bola de acero
  const R = o.rb, m = o.mb || 7800 * 4 / 3 * Math.PI * R ** 3;
  let bx, by; if (o.salida === 'pie') { bx = 1650; by = 900 - (1850 - 1780) * (523 / 890); } else { bx = 1155; by = 900 - (1850 - 1155) * (523 / 890); }
  const ang = Math.atan2(523, 890), nx = -Math.sin(ang), ny = Math.cos(ang);   // normal de la rampa (hacia arriba)
  const b = P.makeBall(d, X(bx) + (R + 0.0005) * Math.sin(ang) * 0 + (R + 0.0005) * 0, Y(by) + R + 0.0005); b.r = R; b.m = m; b.mat = 'acero';
  // apoyada sobre la rampa, en perpendicular a ella
  b.x = X(bx) + (R + 0.0005) * (-Math.sin(-ang)) * 0; b.x = X(bx) + (R + 0.0005) * Math.sin(ang); b.y = Y(by) + (R + 0.0005) * Math.cos(ang);
  if (o.v0) { b.vx0 = -o.v0 * Math.cos(ang); b.vy0 = o.v0 * Math.sin(ang); }
  d.parts.push(b);
  d._ids = { bola: b.id, iman: mg.id }; d._o = o; d._k = k;
  return d;
};
