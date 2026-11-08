// Disco horizontal visto desde arriba: una bola de acero rueda por un canal en anillo y unos imanes fijos alrededor
// la atraen al pasar. Visto desde arriba no hay gravedad en el dibujo; el roce de la bola con el fondo del canal se
// añade a mano (rodadura de acero sobre acero) y se apunta en las cuentas como roce. La bola rueda sobre el fondo,
// así que tiene 1,4 veces más inercia que si resbalara: se le pone 1,4 veces la masa para moverse (no para el roce
// ni para los imanes, que dependen de su tamaño).
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
// el roce del fondo: una fuerza contra la velocidad, crr·m·g, que se apunta como roce
if (!E.World.prototype._sueloPuesto) {
  const f0 = E.World.prototype._forces, w0 = E.World.prototype._work;
  E.World.prototype._forces = function () { f0.call(this); const s = this._suelo; if (!s) return; const b = s.b, v = Math.hypot(b.vx, b.vy), k = s.F / Math.max(v, 0.005); b.fx -= k * b.vx; b.fy -= k * b.vy; s.kx = k; };
  E.World.prototype._work = function (h) { w0.call(this, h); const s = this._suelo; if (!s || s.kx == null) return; const b = s.b; this.ledger.rub += s.kx * (b.vx * b.vx + b.vy * b.vy) * h; };
  E.World.prototype._sueloPuesto = true;
}
function monta(o) {
  o = Object.assign({ R: 0.2, rb: 0.012, hueco: 0.0015, n: 2, tam: 0.03, grado: 'n52', sep: 0.02, forma: 'disc', v0: 1, crr: 0.0015, lados: 120, aire: true, desfase: 0 }, o || {});
  const d = P.emptyDesign(); d.air = o.aire; d.iters = 30;
  const RR = 0.012, rf = o.R + o.rb + o.hueco + RR, ri = o.R - o.rb - o.hueco - RR, N = o.lados;
  // guía: «canal» (paredes de tramos rectos) o «brazo» (un brazo sin peso sujeto en el centro: el canal perfecto)
  if (o.guia !== 'brazo') for (let i = 0; i < N; i++) { const a1 = i / N * 2 * Math.PI, a2 = (i + 1) / N * 2 * Math.PI;
    [rf, ri].forEach(r => { const p = P.makeRamp(d, r * Math.cos(a1), r * Math.sin(a1), r * Math.cos(a2), r * Math.sin(a2)); p.mat = 'acero'; d.parts.push(p); }); }
  for (let k = 0; k < o.n; k++) { const a = k / o.n * 2 * Math.PI + o.desfase, r = rf + RR + o.sep + o.tam / 2;
    const m = P.makeMagnet(d, r * Math.cos(a), r * Math.sin(a), null, o.forma); m.ang = a * 180 / Math.PI + 180; m.grade = o.grado; m.size = o.tam; m.mu = P.magnetModel(m).mu; d.parts.push(m); }
  const mreal = 7800 * 4 / 3 * Math.PI * o.rb ** 3, a0 = -Math.PI / 2 + Math.PI / Math.max(1, o.n);   // empieza entre dos imanes
  const b = P.makeBall(d, o.R * Math.cos(a0), o.R * Math.sin(a0)); b.r = o.rb; b.m = 1.4 * mreal; b.mat = 'acero'; d.parts.push(b);
  if (o.guia === 'brazo') { const arm = P.makeBar(d, 0, 0, b.x, b.y); arm.m = 0.0005; arm.th = 0.002; arm.plane = 5; d.parts.push(arm);
    const p0 = P.makePin(d, 0, 0, null, arm.id); p0.bearing = 'ideal'; d.parts.push(p0); const p1 = P.makePin(d, b.x, b.y, arm.id, b.id); p1.bearing = 'ideal'; d.parts.push(p1); }
  const info = P.build(d), w = info.world; w.g = 0;
  // pared lisa: la bola rueda por el fondo (su roce lo pone _suelo) y solo resbala contra la pared, sin roce
  if (o.paredLisa !== false) { w.ground.shapes.forEach(s => { s.mu = 0; s.crr = 0; }); w.ground.ws = []; w.ground.updateWorld(); }
  const bb = info.bodyOf[b.id]; bb.vx = -o.v0 * Math.sin(a0); bb.vy = o.v0 * Math.cos(a0);
  if (o.guia === 'brazo') { const ab = info.bodyOf[d.parts.find(p => p.kind === 'bar').id]; ab.w = o.v0 / o.R; ab.vx = -ab.w * ab.y; ab.vy = ab.w * ab.x; }
  w._suelo = { b: bb, F: o.crr * mreal * 9.81 }; w.ledger.E0 = w.energy().E;
  return { d, info, w, b: bb, o, mreal };
}
// corre hasta que se para (o Tmax): vueltas, energía de movimiento cada vez que pasa por el punto de salida
function prueba(o, Tmax) {
  const M = monta(o), w = M.w, b = M.b; let ang0 = Math.atan2(b.y, b.x), giro = 0, prev = ang0, minErr = 0, escala = 0.01, chk = 0, quieta = 0, Kv = [w.kinetic()];
  while (w.t < (Tmax || 600)) {
    w.step(); const a = Math.atan2(b.y, b.x); let da = a - prev; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; prev = a;
    const antes = Math.floor(giro / (2 * Math.PI)); giro += da; if (Math.floor(giro / (2 * Math.PI)) > antes) Kv.push(w.kinetic());
    if (++chk % 96 === 0) { const bl = w.balance(); minErr = Math.min(minErr, bl.error); escala = Math.max(escala, bl.e.K, bl.inflow, bl.outflow); }
    const v = Math.hypot(b.vx, b.vy); quieta = v < 0.003 ? quieta + w.dt : 0; if (quieta > 1) break;
  }
  const vueltas = giro / (2 * Math.PI), r = Kv.length > 2 ? Math.pow(Kv[Kv.length - 1] / Kv[1], 1 / (Kv.length - 2)) : null;
  return { valido: minErr > -Math.max(0.001, 0.02 * escala), vueltas: +vueltas.toFixed(2), dura_s: +w.t.toFixed(1), parada: quieta > 1, por_vuelta: r ? +(100 * r).toFixed(2) : null, K0_mJ: +(Kv[0] * 1000).toFixed(1), minErr_mJ: +(minErr * 1000).toFixed(2) };
}
module.exports = { monta, prueba };
if (require.main === module) { const o = JSON.parse(process.argv[2] || '{}'); const t0 = Date.now(); console.log(JSON.stringify(prueba(o, +(process.argv[3] || 600))), ((Date.now() - t0) / 1000).toFixed(1) + ' s de cálculo'); }
