// La palanca de metacrilato de la captura que mandó el usuario («...return the platform back to origin whilst
// progressing underneath the curve as the other sphere falls gently on a tier perfectly timed ready for the next cycle»).
// Medidas sacadas de la foto (2000 px de ancho): la canica mide 90 px; con una canica de 25 mm sale 0,278 mm por px.
// Origen: la mesa, justo debajo del eje. Todo en mm aquí y en metros en el banco.
//  - Eje P a 67,5 mm de la mesa.
//  - Brazo recto (canal) de la punta T (-134, 186) al extremo corto S (70, 28) cuando está arriba (como en la foto).
//  - Aleta curva debajo del brazo largo: es «la curva». Abajo (posición D) se apoya en los raíles.
//  - Raíles fijos: del tope de la izquierda (-163,5; 53,7) a (40,9; 25), bajando 8° hacia la derecha, por debajo de la aleta.
//  - Contrapeso blanco en S y una cazoleta que recoge la bola al final de los raíles.
// En 2D el banco no puede poner una pieza al lado de otra: el brazo y el pie de la aleta junto al eje van en otro plano
// (no chocan con la bola), como en el aparato, donde la bola pasa por el lado.
module.exports = function (P, o) {
  o = Object.assign({ a0: 0, mw: 0.030, mbar: 0.035, mfin: 0.018, rb: 0.0125, mb: null, rc: null, ideal: false,
    bola: 'raíl', x0: -150, v0: 0, cazo: [60, 37.5] }, o || {});
  const d = P.emptyDesign(); d.example = 'palanca-dos-bolas'; d.iters = 40; d.air = false; if (o.ideal) d.ideal = true;
  const mm = v => v / 1000, RR = 0.012, rad = Math.PI / 180;
  const PX = 0, PY = 67.5;
  const rot = (p, a) => { const dx = p[0] - PX, dy = p[1] - PY, c = Math.cos(a), s = Math.sin(a); return [PX + dx * c - dy * s, PY + dx * s + dy * c]; };
  const R = p => rot(p, o.a0 * rad);
  const M = p => [mm(p[0]), mm(p[1])];
  // piezas fijas: mesa, raíles (cara de arriba por los puntos dados) y el tope de la izquierda
  const cara = (a, b, mat) => { const [x1, y1] = M(a), [x2, y2] = M(b), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, s = ny >= 0 ? 1 : -1;
    const r = P.makeRamp(d, x1 - s * RR * nx, y1 - s * RR * ny, x2 - s * RR * nx, y2 - s * RR * ny); r.mat = mat || 'acero'; d.parts.push(r); return r; };
  cara([-200, 0], [140, 0], 'madera');
  const rail0 = [-163.5, 53.7], rail1 = [40.9, 25];
  // los raíles: una tira fina fija (2 mm de medio grueso) con la cara de arriba en la recta de la foto
  { const [x1, y1] = M(rail0), [x2, y2] = M(rail1), L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L, h = 0.002;
    const rl = P.makeBar(d, x1 - h * nx, y1 - h * ny, x2 - h * nx, y2 - h * ny); rl.th = h; rl.m = 0.02; d.parts.push(rl);
    const rw = P.makePin(d, (x1 + x2) / 2, (y1 + y2) / 2, null, rl.id); rw.mode = 'rigid'; d.parts.push(rw); }
  const tope = P.makeBar(d, mm(-172), mm(2), mm(-172), mm(69.5)); tope.th = 0.004; tope.m = 0.01; d.parts.push(tope);
  const tw = P.makePin(d, mm(-172), mm(30), null, tope.id); tw.mode = 'rigid'; d.parts.push(tw);
  // la palanca: brazo recto (en otro plano), aleta (su borde curvo choca con la bola), contrapeso y cazoleta
  const bar = (a, b, m, th, plane) => { const [x1, y1] = M(R(a)), [x2, y2] = M(R(b)); const q = P.makeBar(d, x1, y1, x2, y2); q.m = m; q.th = th; q.plane = plane; d.parts.push(q); return q; };
  const T = [-134.3, 186.3], S = [70, 27.8];
  const brazo = bar(T, S, o.mbar, 0.003, 1);
  const weld = (p, a, b) => { const [x, y] = M(R(p)); const w = P.makePin(d, x, y, a.id, b.id); w.mode = 'rigid'; d.parts.push(w); };
  const aleta = [[-104, 168], [-100.9, 158.5], [-94, 130.7], [-82.8, 108.4], [-66.2, 86.2], [-43.9, 66.7], [-21.7, 54.2], [-2.2, 50], [8.9, 61.2]];
  const nCurva = 5;                           // los 5 primeros tramos son el borde curvo que la bola empuja; el pie, junto al eje, va en otro plano
                                              // (la bola pasa por su lado, como en el aparato)
  const tramos = [];
  for (let i = 0; i + 1 < aleta.length; i++) { const t = bar(aleta[i], aleta[i + 1], o.mfin / (aleta.length - 1), 0.0015, i < nCurva ? 0 : 1); tramos.push(t); weld(aleta[i], brazo, t); }
  const cw = P.makeBall(d, ...M(R([64.5, 16.7]))); cw.r = 0.009; cw.m = o.mw; cw.mat = 'plomo'; cw.plane = 1; d.parts.push(cw); weld([64.5, 16.7], brazo, cw);
  // la cazoleta: suelo y labio, con la bola dentro (centro en o.cazo cuando la palanca está arriba)
  const cz = o.cazo, rbm = o.rb * 1000;
  const suelo = bar([cz[0] - 9, cz[1] - rbm - 1.6], [cz[0] + 9, cz[1] - rbm - 1.6], 0.002, 0.0015, 0); weld([cz[0], cz[1] - rbm - 1.6], brazo, suelo);
  const labio = bar([cz[0] + rbm + 1.6, cz[1] - rbm - 1.6], [cz[0] + rbm + 1.6, cz[1] + 2], 0.001, 0.0015, 0); weld([cz[0] + rbm + 1.6, cz[1] - rbm - 1.6], brazo, labio);
  // labio de la izquierda: bajo (6 mm), para que la bola no se salga mientras la palanca gira
  const lab2 = bar([cz[0] - rbm - 1.6, cz[1] - rbm - 1.6], [cz[0] - rbm - 1.6, cz[1] - rbm + 4.4], 0.001, 0.0015, 0); weld([cz[0] - rbm - 1.6, cz[1] - rbm - 1.6], brazo, lab2);
  // el eje: de arriba (0°) a abajo (o.thD, la aleta casi tocando los raíles)
  const piv = P.makePin(d, mm(PX), mm(PY), null, brazo.id); piv.mode = 'limits'; piv.lo = -o.a0; piv.hi = o.thD - o.a0; piv.bearing = 'bolas'; d.parts.push(piv);
  // la bola de vidrio: en la cazoleta (o.bola = 'cazo') o en los raíles en x0 con velocidad v0 hacia la derecha
  const r = o.rb, m = o.mb || 2500 * 4 / 3 * Math.PI * r ** 3;
  let bp; const ang = Math.atan2(rail0[1] - rail1[1], rail1[0] - rail0[0]);
  if (o.bola === 'cazo') bp = M(R(cz));
  else { const yR = rail0[1] + (o.x0 - rail0[0]) * (rail1[1] - rail0[1]) / (rail1[0] - rail0[0]); bp = [mm(o.x0) + (r + 0.0003) * Math.sin(ang), mm(yR) + (r + 0.0003) * Math.cos(ang)]; }
  const b = P.makeBall(d, bp[0], bp[1]); b.r = r; b.m = m; b.mat = 'acero'; d.parts.push(b);
  if (o.bola === 'cazo' && o.pegada) weld(cz, brazo, b);
  if (o.v0) { b.vx0 = o.v0 * Math.cos(ang); b.vy0 = -o.v0 * Math.sin(ang); }
  d._ids = { brazo: brazo.id, bola: b.id, piv: piv.id }; d._o = o; d._rail = [rail0, rail1]; d._ang = ang;
  return d;
};
