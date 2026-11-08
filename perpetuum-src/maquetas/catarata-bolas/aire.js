// Uso: node aire.js '{"gen":30}' 120   (gen: lo que frena el generador; eta: rendimiento del compresor, 0,65; vb: litros de cada cangilón en m³)
// Noria de cangilones movida por aire comprimido, dentro de un tanque de 1 m de agua.
// Por abajo se mete aire en cada cangilón que sube; el aire empuja hacia arriba (ρ·g·volumen) y se expande al
// subir (gas a temperatura constante: p·V fijo). Arriba el cangilón se vuelca y suelta el aire.
// El banco apunta el trabajo del aire como entrada, el frenado del agua y la electricidad. Aparte se calcula lo
// que cuesta comprimir ese aire (compresor perfecto, isotermo, o uno de verdad).
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 60);
const RHO = 1000, G = 9.81, P0 = 101325, YB = 0.05, YS = 1.05, CX = 0, CY = 0.6, RR = 0.4, N = 8;
const VB = o.vb || 0.001;                 // capacidad de cada cangilón (m³): 1 litro
const ETA = o.eta || 0.65;                // compresor de verdad (isotermo equivalente)
const d = P.emptyDesign(); d.example = 'aire'; d.iters = 40;
d.parts.push(P.makeTank(d, -0.6, YB, 0.6, YS));
const wh = P.makeWheel(d, CX, CY, 0.06); wh.m = 0.5; wh.spokes = N; wh.bearing = 'bolas'; wh.rpm = 0; wh.gen = o.gen != null ? o.gen : 3; wh.gdest = 'bus';
d.parts.push(wh);
const cups = [];
for (let k = 0; k < N; k++) {
  const a = k * 2 * Math.PI / N;
  const arm = P.makeBar(d, CX + 0.06 * Math.cos(a), CY + 0.06 * Math.sin(a), CX + (RR - 0.05) * Math.cos(a), CY + (RR - 0.05) * Math.sin(a)); arm.m = 0.03; arm.th = 0.006; arm.plane = 1; d.parts.push(arm);
  const aw = P.makePin(d, CX + 0.06 * Math.cos(a), CY + 0.06 * Math.sin(a), wh.id, arm.id); aw.mode = 'rigid'; d.parts.push(aw);
  const b = P.makeBall(d, CX + RR * Math.cos(a), CY + RR * Math.sin(a)); b.r = 0.05; b.m = 0.1; b.mat = 'acero'; b.plane = 1; d.parts.push(b); cups.push(b);
  const bw = P.makePin(d, CX + RR * Math.cos(a), CY + RR * Math.sin(a), arm.id, b.id); bw.mode = 'rigid'; d.parts.push(bw);
}
if (o.ideal) d.ideal = true;
const info = P.build(d), w = info.world, L = w.ledger;
// la rueda, los brazos y los cangilones van soldados en una sola pieza: cada cangilón es un punto de esa pieza
const hub = info.bodyOf[wh.id];
const bodies = cups.map(c => { const B = info.bodyOf[c.id], l = B.toLocal(c.x, c.y); return { B, l, get x() { return B.toWorld(l.x, l.y).x; }, get y() { return B.toWorld(l.x, l.y).y; },
  vel() { const p = B.toWorld(l.x, l.y); return B.pointVel(p.x, p.y); } }; });
const solid = new Set(bodies.map(b => b.B));
w.floats = w.floats.filter(f => !solid.has(f.body));           // el cangilón vacío va lleno de agua: ni flota ni pesa en ella
w.ledger.E0 = w.energy().E;                                     // las cuentas empiezan ya sin el agua de los cangilones
const pres = y => P0 + RHO * G * (YS - y);
const air = bodies.map(() => 0);                                // aire en cada cangilón: p·V (constante mientras no se escape)
let compIdeal = 0, compReal = 0, inyecciones = 0, litrosLibres = 0, airWork = 0, drag = 0, escapado = 0;
const ang = b => Math.atan2(b.y - CY, b.x - CX);
const forces = bodies.map(() => [0, 0]);
const f0 = w._forces;
w._forces = function () {
  f0.call(this);
  bodies.forEach((b, i) => {
    let V = air[i] ? Math.min(VB, air[i] / pres(b.y)) : 0;
    const Fb = RHO * G * V;                                       // empuje del aire
    const v = b.vel(), sp = Math.hypot(v.x, v.y), k = 0.5 * RHO * (o.cd || 1.0) * Math.PI * 0.05 * 0.05 * sp;   // frenado del agua (cangilón lleno o vacío)
    forces[i] = [-k * v.x, Fb - k * v.y, Fb];
    const B = b.B, px = b.x, py = b.y, fx = forces[i][0], fy = forces[i][1];
    B.fx += fx; B.fy += fy; B.ft += (px - B.x) * fy - (py - B.y) * fx;
  });
};
// al empezar, los cangilones que van subiendo (lado derecho) ya llevan su aire, pagado como los demás
bodies.forEach((b, i) => { const a = ang(b); if (a > -Math.PI / 2 && a < Math.PI / 2) { const p1 = pres(CY - RR), V1 = o.v1 || VB * pres(CY + RR) / p1; air[i] = p1 * V1; const wi = p1 * V1 * Math.log(p1 / P0); compIdeal += wi; compReal += wi / ETA; inyecciones++; litrosLibres += p1 * V1 / P0 * 1000; } });
let next = 0, prev = bodies.map(b => [b.x, b.y]), angPrev = bodies.map(ang);
const t0 = Date.now();
while (w.t < T) {
  w.step();
  bodies.forEach((b, i) => {
    const dx = b.x - prev[i][0], dy = b.y - prev[i][1];
    const wa = forces[i][2] * dy, wd = forces[i][0] * dx + (forces[i][1] - forces[i][2]) * dy;
    airWork += wa; L.battery += wa;                               // lo que empuja el aire entra como energía de fuera
    drag -= wd; L.water -= wd;                                    // el frenado del agua, a su fila
    prev[i] = [b.x, b.y];
    const a = ang(b), ap = angPrev[i]; angPrev[i] = a;
    // abajo (pasa por -90° subiendo por la derecha): se le mete aire si está vacío
    if (!air[i] && ap < -Math.PI / 2 && a >= -Math.PI / 2 && a < 0) {
      const p1 = pres(b.y), V1 = o.v1 || VB * pres(CY + RR) / p1;   // lo justo para llenarlo arriba
      air[i] = p1 * V1;
      const wi = p1 * V1 * Math.log(p1 / P0);
      compIdeal += wi; compReal += wi / ETA; inyecciones++; litrosLibres += p1 * V1 / P0 * 1000;
    }
    // arriba (pasa por 90°): se vuelca y suelta el aire
    if (air[i] && ap < Math.PI / 2 && a >= Math.PI / 2) { escapado += air[i] * Math.log(pres(b.y) / P0); air[i] = 0; }
  });
  if (o.log && w.t >= next) { const bl = w.balance(); console.log(w.t.toFixed(0) + ' s · rpm ' + (hub.w * 60 / 2 / Math.PI).toFixed(1) + ' · aire ' + airWork.toFixed(1) + ' J · luz ' + bl.gen.toFixed(1) + ' J · err ' + bl.error.toFixed(3)); next += T / 6; }
}
const bl = w.balance();
console.log(JSON.stringify({ gen: wh.gen, cd: o.cd || 1, rpm: +(hub.w * 60 / 2 / Math.PI).toFixed(1), inyecciones, litros_de_aire: +litrosLibres.toFixed(1), compresor_perfecto_J: +compIdeal.toFixed(1), compresor_real_J: +compReal.toFixed(1), empuje_del_aire_J: +airWork.toFixed(1), aire_suelto_arriba_J: +escapado.toFixed(1), frenado_agua_J: +drag.toFixed(1), electricidad_J: +bl.gen.toFixed(1), rinde_perfecto: +(bl.gen / compIdeal * 100).toFixed(1), rinde_real: +(bl.gen / compReal * 100).toFixed(1), err: +bl.error.toFixed(3), ms: Date.now() - t0 }));
