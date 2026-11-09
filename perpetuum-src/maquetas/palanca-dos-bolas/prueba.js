// Las dos mitades de la vuelta que dice el vídeo, cada una por separado y con la ayuda más generosa:
//  A) «sube»: la palanca está arriba (como en la foto) con la bola en la cazoleta; al soltarla, el brazo largo baja y
//     la cazoleta sube la bola hasta arriba. ¿Llega la palanca abajo?
//  B) «levanta»: la palanca está abajo, con la curva casi tocando los raíles; la bola llega por los raíles desde el
//     tope de la izquierda, con toda la velocidad que ganaría bajando desde donde la dejó la cazoleta (sin perder nada
//     al caer), y pasa por debajo de la curva empujándola hacia arriba. ¿Vuelve la palanca arriba, a su sitio?
// Para que la vuelta se repita tienen que salir bien las dos con el mismo aparato.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { thD } = require('./geo.js');
const G = 9.81, rad = Math.PI / 180;
function monta(o) {
  const d = require('./palanca.js')(P, o); d.dt = 1 / (480 * (o.div || 4)); const info = P.build(d), w = info.world;
  const lev = info.bodyOf[d._ids.brazo], b = info.bodyOf[d._ids.bola], j = info.jointOf[d._ids.piv];
  if (o.v0) { const p = d.parts.find(q => q.id === d._ids.bola); b.vx = p.vx0; b.vy = p.vy0; b.w = -o.v0 / p.r; w.ledger.E0 = w.energy().E; }
  return { d, info, w, lev, b, giro: () => o.a0 + w.jointAngle(j) / rad };
}
// centro de la bola en la cazoleta, con la palanca girada «g» grados desde arriba (mm)
function enCazo(o, g) { const [x, y] = o.cazo || [60, 37.5], t = g * rad, dx = x, dy = y - 67.5; return [dx * Math.cos(t) - dy * Math.sin(t), 67.5 + dx * Math.sin(t) + dy * Math.cos(t)]; }
function sube(o, T = 3) {
  const th = o.thD || thD(), q = Object.assign({ cazo: [60, 37.5] }, o, { thD: th, a0: 0, bola: 'cazo', pegada: true, v0: 0 });
  const { w, giro } = monta(q);
  let max = 0, t0 = null;
  while (w.t < T) { w.step(); const g = giro(); max = Math.max(max, g); if (g > th - 0.5 && t0 == null) { t0 = w.t; break; } }
  const subida = enCazo(q, th)[1] - q.cazo[1];
  return { llega: t0 != null, t: t0 == null ? null : +t0.toFixed(2), giro_max: +max.toFixed(1), sube_mm: +subida.toFixed(1), thD: th };
}
function levanta(o, T = 4) {
  const th = o.thD || thD(), base = Object.assign({ cazo: [60, 37.5], x0: -158 }, o, { thD: th, a0: th, bola: 'raíl' });
  // velocidad de la bola al llegar al tope: toda la energía de bajar desde la cazoleta (abajo) hasta ese punto, rodando
  const d0 = require('./palanca.js')(P, Object.assign({}, base, { v0: 0 })), p0 = d0.parts.find(q => q.id === d0._ids.bola);
  const hC = enCazo(base, th)[1], h0 = p0.y * 1000, v0 = o.v0 != null ? o.v0 : Math.sqrt(10 / 7 * G * Math.max(0, hC - h0) / 1000);
  const { w, giro, b, lev, d } = monta(Object.assign({}, base, { v0 }));
  let min = th, tU = null, xFin = null, quieta = 0;
  while (w.t < T) { w.step(); const g = giro(); min = Math.min(min, g); if (g < 0.5 && tU == null) tU = w.t;
    const v = Math.hypot(b.vx, b.vy) + Math.abs(lev.w) * 0.1; quieta = v < 0.004 ? quieta + w.dt : 0; if (quieta > 0.5) break; if (b.y < -0.05) break; }
  const bl = w.balance();
  return { vuelve_arriba: tU != null, t: tU == null ? null : +tU.toFixed(2), giro_min: +min.toFixed(1), v0: +v0.toFixed(3), cae_mm: +(hC - h0).toFixed(1),
    bola_x_mm: Math.round(b.x * 1000), bola_y_mm: Math.round(b.y * 1000), err_mJ: +(bl.error * 1000).toFixed(2), golpes_mJ: +(w.ledger.hits * 1000).toFixed(2), roce_mJ: +(w.ledger.rub * 1000).toFixed(2) };
}
module.exports = { sube, levanta, monta, enCazo };
if (require.main === module) { const o = JSON.parse(process.argv[2] || '{}'); console.log(JSON.stringify({ A: sube(o), B: levanta(o) })); }
