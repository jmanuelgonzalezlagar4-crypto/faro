// Pista de aceleración con imanes, vista desde arriba: una bola de acero (o un imán en un carrito) da vueltas por una
// pista en anillo, soldada a un brazo sin peso que gira en un eje en el centro (la guía perfecta: no roza ni choca),
// y unos imanes fijos
// junto a la pista la aceleran al pasar. Tres formas de poner los imanes, como en los vídeos:
//  - «rampa»: una fila de imanes que se va acercando a la pista (el campo crece en el sentido de la marcha)
//  - «V»: dos filas, una por dentro y otra por fuera, que se van cerrando (puerta en V)
//  - «escalera»: imanes a la misma distancia pero torcidos, uno tras otro
// Visto desde arriba no hay gravedad en el dibujo. El roce de rodar sobre el fondo se añade a mano y se apunta en las
// cuentas (como en iman-optimo/disco.js). La bola rueda, así que se mueve con 1,4 veces su masa.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
if (!E.World.prototype._sueloPuesto) {
  const f0 = E.World.prototype._forces, w0 = E.World.prototype._work;
  E.World.prototype._forces = function () { f0.call(this); const s = this._suelo; if (!s) return; const b = s.b, v = Math.hypot(b.vx, b.vy), k = s.F / Math.max(v, 0.005); b.fx -= k * b.vx; b.fy -= k * b.vy; s.kx = k; };
  E.World.prototype._work = function (h) { w0.call(this, h); const s = this._suelo; if (!s || s.kx == null) return; const b = s.b; this.ledger.rub += s.kx * (b.vx * b.vx + b.vy * b.vy) * h; };
  E.World.prototype._sueloPuesto = true;
}
const DEG = Math.PI / 180;
function monta(o) {
  o = Object.assign({ R: 0.2, tipo: 'rampa', movil: 'bola', n: 8, arco: 120, d0: 0.05, d1: 0.012, tam: 0.02, grado: 'n52', giro: 0, polo: 0,
    rb: 0.0125, mc: 0.03, v0: 1, crr: 0.0015, ideal: false, sinImanes: false, div: 1 }, o || {});
  const d = P.emptyDesign(); d.air = false; d.iters = 30; d.dt = 1 / (480 * o.div); if (o.ideal) d.ideal = true;
  // el móvil empieza justo antes de los imanes, que van de 0° a «arco» (en el sentido de la marcha, contrario a las agujas)
  const a0 = -30 * DEG, R = o.R, x0 = R * Math.cos(a0), y0 = R * Math.sin(a0);
  const arm = P.makeBar(d, 0, 0, x0, y0); arm.m = 0.0005; arm.th = 0.002; arm.plane = 5; d.parts.push(arm);
  const p0 = P.makePin(d, 0, 0, null, arm.id); p0.bearing = 'ideal'; d.parts.push(p0);
  let mreal, b;
  if (o.movil === 'bola') {
    mreal = 7800 * 4 / 3 * Math.PI * o.rb ** 3; b = P.makeBall(d, x0, y0); b.r = o.rb; b.m = 1.4 * mreal; b.mat = 'acero'; d.parts.push(b);
    const p1 = P.makePin(d, x0, y0, arm.id, b.id); p1.mode = 'rigid'; d.parts.push(p1);    // soldada: brazo y bola giran juntos en un solo eje
  } else {
    // imán en un carrito: va soldado al brazo, así que siempre mira igual respecto de la pista (polo: 0 hacia fuera,
    // 90 hacia delante, 180 hacia dentro, 270 hacia atrás)
    mreal = o.mc; b = P.makeBall(d, x0, y0); b.r = 0.01; b.m = 1.1 * mreal; b.mat = 'plomo'; b.plane = 5; d.parts.push(b);
    const p1 = P.makePin(d, x0, y0, arm.id, b.id); p1.mode = 'rigid'; d.parts.push(p1);
    const mv = P.makeMagnet(d, x0, y0, arm.id, 'disc'); mv.ang = a0 / DEG + o.polo; mv.grade = o.grado; mv.size = o.tam; mv.solid = false; mv.mu = P.magnetModel(mv).mu; d.parts.push(mv);
  }
  // los imanes fijos (no chocan: van junto a la pista, a su lado)
  const fijos = [], pon = (r, a, ang) => { const m = P.makeMagnet(d, r * Math.cos(a), r * Math.sin(a), null, 'disc'); m.ang = ang; m.grade = o.grado; m.size = o.tam; m.solid = false; m.mu = P.magnetModel(m).mu; d.parts.push(m); fijos.push(m); };
  if (!o.sinImanes) for (let k = 0; k < o.n; k++) {
    const t = o.n > 1 ? k / (o.n - 1) : 0, a = t * o.arco * DEG, dist = o.d0 + (o.d1 - o.d0) * t, cara = o.movil === 'bola' ? o.rb : o.tam / 2;
    if (o.tipo === 'rampa') pon(R + cara + o.tam / 2 + dist, a, a / DEG + 180 + o.giro);
    else if (o.tipo === 'V') { pon(R + cara + o.tam / 2 + dist, a, a / DEG + 180 + o.giro); pon(R - cara - o.tam / 2 - dist, a, a / DEG + o.giro + (o.inv ? 180 : 0)); }
    else pon(R + cara + o.tam / 2 + o.d1, a, a / DEG + 180 + o.giro + (k % 2 ? 1 : -1) * o.torcido);
  }
  const info = P.build(d), w = info.world; w.g = 0;
  const bb = info.bodyOf[b.id], ab = info.bodyOf[arm.id], om = o.v0 / R;
  ab.w = om; ab.vx = -om * ab.y; ab.vy = om * ab.x; if (bb !== ab) { bb.vx = -om * bb.y; bb.vy = om * bb.x; }
  w._suelo = { b: bb, F: o.crr * mreal * 9.81 }; if (o.ideal) w._suelo.F = 0;
  w.ledger.E0 = w.energy().E;
  return { d, info, w, b: bb, o, mreal, fijos };
}
// corre hasta que se para o hasta Tmax: vueltas, y la energía de movimiento cada vez que pasa por el punto de salida
function prueba(o, Tmax) {
  const M = monta(o), w = M.w, b = M.b, L = w.ledger; let prev = Math.atan2(b.y, b.x), giro = 0, minErr = 0, escala = 0.01, chk = 0, quieta = 0, Kv = [w.kinetic()], atras = false, sobra = 0;
  while (w.t < (Tmax || 120)) {
    w.step(); const a = Math.atan2(b.y, b.x); let da = a - prev; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; prev = a;
    const antes = Math.floor(giro / (2 * Math.PI)); giro += da; if (Math.floor(giro / (2 * Math.PI)) > antes) Kv.push(w.kinetic());
    if (giro < -0.5) atras = true;
    // lo que sobra: la energía que tiene más la que ha perdido en roces, comparada con la del principio
    if (++chk % 12 === 0) { const bl = w.balance(); minErr = Math.min(minErr, bl.error); escala = Math.max(escala, bl.e.K, bl.inflow, bl.outflow); sobra = Math.max(sobra, -bl.reserve); }
    const v = Math.hypot(b.vx, b.vy); quieta = v < 0.003 ? quieta + w.dt : 0; if (quieta > 1) break;
  }
  const n = Kv.length, r = n > 2 ? Math.pow(Kv[n - 1] / Kv[1], 1 / (n - 2)) : null;
  return { valido: minErr > -Math.max(0.001, 0.02 * escala), vueltas: +(giro / (2 * Math.PI)).toFixed(2), dura_s: +w.t.toFixed(1), parada: quieta > 1, atras,
    por_vuelta: r ? +(100 * r).toFixed(4) : null, sobra_mJ: +(sobra * 1000).toFixed(4), rend: +(100 * (1 + sobra / escala)).toFixed(4), escala_mJ: +(escala * 1000).toFixed(2),
    Pm_final_mJ: +(w.energy().Pm * 1000).toFixed(3), K: Kv.slice(0, 6).map(k => +(k * 1000).toFixed(3)), K_ult: +(Kv[n - 1] * 1000).toFixed(3), minErr_mJ: +(minErr * 1000).toFixed(3) };
}
module.exports = { monta, prueba };
if (require.main === module) { const o = JSON.parse(process.argv[2] || '{}'); const t0 = Date.now(); console.log(JSON.stringify(prueba(o, +(process.argv[3] || 120))), ((Date.now() - t0) / 1000).toFixed(1) + ' s de cálculo'); }
