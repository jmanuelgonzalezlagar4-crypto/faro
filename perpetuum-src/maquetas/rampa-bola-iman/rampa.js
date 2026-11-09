// Rampa con un imán que atrae una bola imantada, como la pidió el usuario: la rampa sube un poco hacia el imán; antes
// de llegar tiene un hueco y la bola cae a una rampa de vuelta que baja por debajo hacia el principio; allí un gancho
// la sube por dentro, pasa por encima del principio de la rampa (con sitio para la bola entre los dos) y la deja otra
// vez sobre la rampa, para que vuelva a rodar hacia el imán.
// Vista de lado, con gravedad. Las rampas son tiras finas fijas (2 mm de medio grueso) para que la vuelta quepa
// por debajo. La bola es un imán (un dipolo que gira con ella al rodar); para chocar es como el acero, pero el banco no
// la cuenta además como acero que se imanta.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const DEG = Math.PI / 180, TH = 0.002;
function monta(o) {
  o = Object.assign({ ang: 5, L: 0.35, rb: 0.009, tam: 0.04, grado: 'n52', forma: 'bar', angIman: 180, angBola: 180, dm: 0.02, hm: 0, caida: 0.04,
    rh: 0.035, g: 0.006, salida: 78, dx: 0.2, recogida: 'recta', rc: 0.03, ybot: 0.02, mas: 0.03, v0: 0, x0: 0.08, ideal: false, mat: 'acero', div: 4, hueco: 0.03, tramo: 0.02 }, o || {});
  const d = P.emptyDesign(); d.air = !o.ideal; d.iters = 40; d.dt = 1 / (480 * o.div); if (o.ideal) d.ideal = true;
  const a = o.ang * DEG, u = [Math.cos(a), Math.sin(a)], rb = o.rb;
  // el gancho: su cara de dentro, arriba, queda una bola y «g» por encima del principio de la rampa, para que la bola
  // quepa entre los dos; su fondo, o.ybot por encima de la mesa. Centro un poco a la derecha del principio de la rampa.
  const ybot = o.ybot, hA = ybot + 2 * o.rh - 2 * rb - o.g, Ap = [0, hA], Ep = [o.L * u[0], hA + o.L * u[1]], C = [o.dx * o.rh, ybot + o.rh];
  // tira fija con la cara en la recta p→q; lado: +1 la cara mira a la izquierda del sentido p→q (arriba si va a la derecha)
  const tira = (p, q, lado = 1) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), nx = -dy / l * lado, ny = dx / l * lado;
    const b = P.makeBar(d, p[0] - TH * nx, p[1] - TH * ny, q[0] - TH * nx, q[1] - TH * ny); b.th = TH; b.m = 0.01; d.parts.push(b);
    const w = P.makePin(d, (p[0] + q[0]) / 2 - TH * nx, (p[1] + q[1]) / 2 - TH * ny, null, b.id); w.mode = 'rigid'; d.parts.push(w); return b; };
  // mesa
  const mesa = P.makeRamp(d, -0.3, -0.012, Ep[0] + 0.4, -0.012); mesa.mat = 'madera'; d.parts.push(mesa);
  // la rampa que sube hacia el imán, con un hueco (o.hueco de ancho) antes de un último tramo (o.tramo) junto al imán;
  // con tramo 0 la rampa simplemente se acaba
  const H1 = [(o.L - o.tramo - o.hueco) * u[0], hA + (o.L - o.tramo - o.hueco) * u[1]], H2 = [(o.L - o.tramo) * u[0], hA + (o.L - o.tramo) * u[1]];
  tira(Ap, H1); if (o.tramo > 0.001) tira(H2, Ep);
  // la rampa de vuelta, hasta el fondo del gancho. «recta»: empieza más allá del final de la rampa, debajo, con un tope
  // para que la bola no se salga. «curva»: una recogida en cuarto de círculo bajo el hueco, que recoge la bola por su lado
  // de dentro mientras cae (sin golpe) y la manda hacia el gancho.
  const R2 = [C[0], ybot];
  let R1;
  if (o.recogida === 'curva') {
    const Cr = [H2[0] - o.rc, H1[1] - o.caida], M8 = 24, q = t => [Cr[0] + o.rc * Math.cos(t * DEG), Cr[1] + o.rc * Math.sin(t * DEG)];
    for (let k = 0; k < M8; k++) { const t1 = 270 + 90 * k / M8, t2 = 270 + 90 * (k + 1) / M8; tira(q(t1), q(t2), 1); }
    tira([H2[0], Cr[1]], [H2[0], H2[1] - 2 * TH - 0.002], 1);              // la pared de fuera sigue hacia arriba hasta la rampa
    R1 = q(270);
  } else {
    R1 = [Ep[0] + o.mas, H1[1] - o.caida];
    tira([R1[0], R1[1] + 2 * rb + 0.004], R1, 1);                        // tope al final
  }
  tira(R2, R1, 1);
  // el gancho, por dentro: del fondo (270°) sube por la izquierda, pasa por lo alto (90°) y sigue hasta «salida» grados,
  // ya encima de la rampa, para dejar la bola sobre ella
  const N = 60, pt = t => [C[0] + o.rh * Math.cos(t * DEG), C[1] + o.rh * Math.sin(t * DEG)];
  for (let k = 0; k < N; k++) { const t1 = 270 - (270 - o.salida) * k / N, t2 = 270 - (270 - o.salida) * (k + 1) / N; tira(pt(t2), pt(t1), 1); }
  // lo que queda libre: entre el gancho y la rampa (por encima) y entre la rampa y la vuelta (por debajo), menos la bola
  let libreArriba = 1; for (let t = 90; t >= o.salida; t -= 1) { const p = pt(t); if (p[0] >= 0) libreArriba = Math.min(libreArriba, p[1] - (hA + p[0] * Math.tan(a)) - 2 * rb); }
  const yVuelta = x => R2[1] + (x - R2[0]) * (R1[1] - R2[1]) / (R1[0] - R2[0]);
  let libreAbajo = 1; for (let x = 0; x <= H1[0]; x += 0.005) libreAbajo = Math.min(libreAbajo, hA + x * Math.tan(a) - 2 * TH - yVuelta(x) - 2 * rb);
  // el imán fijo, más allá del final de la rampa
  const M = [Ep[0] + o.dm + o.tam / 2, Ep[1] + rb + o.hm];
  const mg = P.makeMagnet(d, M[0], M[1], null, o.forma); mg.ang = o.angIman; mg.grade = o.grado; mg.size = o.tam; mg.mu = P.magnetModel(mg).mu; d.parts.push(mg);
  // la bola imantada, en la rampa
  const bx = o.x0 * u[0] - (rb + 0.0004) * u[1], by = hA + o.x0 * u[1] + (rb + 0.0004) * u[0];
  const b = P.makeBall(d, bx, by); b.r = rb; b.m = 7500 * 4 / 3 * Math.PI * rb ** 3; b.mat = o.mat; d.parts.push(b);
  const mb = P.makeMagnet(d, bx, by, b.id, 'disc'); mb.ang = o.angBola; mb.grade = o.grado === 'ferrita' ? 'n35' : o.grado; mb.size = 2 * rb; mb.solid = false; mb.mu = P.magnetModel(mb).mu; d.parts.push(mb);
  const info = P.build(d), w = info.world, bb = info.bodyOf[b.id];
  w.steel = w.steel.filter(s => s.body !== bb);                        // es un imán, no acero que se imanta
  if (o.v0) { bb.vx = o.v0 * u[0]; bb.vy = o.v0 * u[1]; bb.w = -o.v0 / rb; }
  w.ledger.E0 = w.energy().E;
  return { d, info, w, b: bb, o, Ap, Ep, H1, H2, R1, R2, C, M, u, libreArriba, libreAbajo, techo: C[1] + o.rh - rb };
}
// corre y cuenta: caídas por el final, vueltas completas (vuelve a la rampa por el gancho) y si se pega al imán
function prueba(o, T = 30) {
  const S = monta(o), { w, b, Ep, u, M } = S, rb = S.o.rb, hA = S.Ap[1], sobre = (x, y) => y - (hA + x * Math.tan(S.o.ang * DEG));
  let estado = 'sube', caidas = 0, atras = 0, vueltas = 0, quieta = 0, maxX = b.x, minErr = 0, escala = 0.01, chk = 0, sobra = 0, maxGancho = -1, sale = false;
  while (w.t < T) {
    w.step();
    const x = b.x, y = b.y, h = sobre(x, y);
    if (estado === 'sube') { maxX = Math.max(maxX, x);
      if (h < -rb * 0.5) { if (x > S.H1[0] - rb && (S.o.tramo < 0.001 || x < S.H2[0] + rb)) { estado = 'cae'; caidas++; } else if (x < 0.01) { estado = 'atras'; atras++; } else estado = 'fuera'; } }
    // tras caer por el hueco: rampa de vuelta hacia la izquierda, gancho (media vuelta por arriba) y otra vez a la rampa
    else if (estado === 'cae' && x < S.C[0] && y > S.C[1]) estado = 'gancho';
    else if (estado === 'gancho' && x > S.C[0] && x < S.C[0] + 0.15 && b.vx > 0 && h > 0 && h < 2.5 * rb) { estado = 'sube'; vueltas++; }
    else if (estado === 'atras' && x > 0.005 && h > 0 && h < 2.5 * rb) estado = 'sube';
    if (estado === 'cae' || estado === 'gancho') if (x < S.C[0] + S.o.rh) maxGancho = Math.max(maxGancho, y);      // lo más alto que sube por el gancho
    if (++chk % 24 === 0) { const bl = w.balance(); minErr = Math.min(minErr, bl.error); escala = Math.max(escala, bl.e.K, bl.inflow, bl.outflow); sobra = Math.max(sobra, -bl.reserve); }
    const v = Math.hypot(b.vx, b.vy); quieta = v < 0.003 ? quieta + w.dt : 0; if (quieta > 1) break;
    if (y < -0.1 || Math.abs(x) > 2) { sale = true; break; }
  }
  const dM = Math.hypot(b.x - M[0], b.y - M[1]), pegada = quieta > 1 && dM < S.o.tam / 2 + rb + 0.02;
  // lo que le falta para volver a la rampa: subir por dentro del gancho hasta lo alto (solo si llega al gancho después
  // de caer por el hueco)
  const falta = caidas && maxGancho > -1 ? +((S.techo - maxGancho) * 1000).toFixed(1) : null;
  return { valido: minErr > -Math.max(0.0005, 0.02 * escala), libreArriba_mm: +(S.libreArriba * 1000).toFixed(1), libreAbajo_mm: +(S.libreAbajo * 1000).toFixed(1), caidas, atras, vueltas, pegada, quieta: quieta > 1, sale, donde: estado, falta_mm: vueltas ? 0 : falta, llega_x_mm: Math.round(maxX * 1000), final_x_mm: Math.round(Ep[0] * 1000),
    t: +w.t.toFixed(2), rend: +(100 * (1 + sobra / escala)).toFixed(3), minErr_mJ: +(minErr * 1000).toFixed(3) };
}
module.exports = { monta, prueba };
if (require.main === module) { const o = JSON.parse(process.argv[2] || '{}'); const t0 = Date.now(); console.log(JSON.stringify(prueba(o, +(process.argv[3] || 30))), ((Date.now() - t0) / 1000).toFixed(1) + ' s'); }
