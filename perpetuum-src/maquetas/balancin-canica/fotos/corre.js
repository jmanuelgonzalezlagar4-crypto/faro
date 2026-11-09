// Corre el balancín de las fotos y cuenta vueltas de verdad: el palo arriba, abajo con la rueda en la goma, y otra vez arriba.
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
function prueba(o, T) {
  const d = require('./real.js')(P, o), info = P.build(d), w = info.world;
  if (info.overlaps.length) return { o, valido: false, por: 'solapes ' + info.overlaps.length };
  const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball], th0 = d._o.th0;
  const ang = () => th0 + (lev.a - lev.a0) * 180 / Math.PI;
  const hl = lev.toLocal(d._B[0], d._B[1]), Lr = d._o.Lr;
  let cae = false, estado = 'arriba', vueltas = 0, bajadas = 0, bEstado = 'punta', viajes = 0, enV = 0, min = 99, max = -99, minErr = 0, tUlt = 0;
  while (w.t < T && !w.isStopped()) {
    w.step();
    const a = ang(); min = Math.min(min, a); max = Math.max(max, a);
    if (estado === 'arriba' && a < -18) { estado = 'abajo'; bajadas++; tUlt = w.t; }
    else if (estado === 'abajo' && a > -6) { estado = 'arriba'; vueltas++; tUlt = w.t; }
    const hp = lev.toWorld(hl.x, hl.y), db = Math.hypot(ball.x - hp.x, ball.y - hp.y) / Lr;
    if (bEstado === 'punta' && db < 0.35) { bEstado = 'V'; enV++; }
    else if (bEstado === 'V' && db > 0.75) { bEstado = 'punta'; viajes++; }
    if ((w.t * 480 | 0) % 48 === 0) minErr = Math.min(minErr, w.balance().error);
    if (ball.y < -0.3) { cae = true; break; }
  }
  const b = w.balance(), malo = minErr < -Math.max(0.002, 0.05 * Math.max(b.reserve, b.outflow));
  return { o, valido: !malo, cae, bajadas, vueltas, viajes, enV, min: +min.toFixed(1), max: +max.toFixed(1), final: +ang().toFixed(1), t: +w.t.toFixed(1), parada: w.isStopped(), ultimo_cambio_s: +tUlt.toFixed(1),
    gastado_mJ: +(b.reserve * 1000).toFixed(1), golpes_mJ: +(b.hits * 1000).toFixed(1), roces_mJ: +((b.rub + b.axle + b.air) * 1000).toFixed(1), err_mJ: +(b.error * 1000).toFixed(2), minErr_mJ: +(minErr * 1000).toFixed(2) };
}
module.exports = prueba;
if (require.main === module) {
  const arg = process.argv[2] || '{}', T = +(process.argv[3] || 30);
  if (require('fs').existsSync(arg)) { for (const l of require('fs').readFileSync(arg, 'utf8').trim().split('\n')) { let r; try { r = prueba(JSON.parse(l), T); } catch (e) { r = { o: JSON.parse(l), valido: false, por: String(e.message).slice(0, 80) }; } console.log(JSON.stringify(r)); } }
  else { const { o, ...r } = prueba(JSON.parse(arg), T); console.log(JSON.stringify(r)); }
}
