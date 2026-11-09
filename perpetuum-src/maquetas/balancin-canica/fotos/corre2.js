// Corre el balancín de las fotos (segunda versión) desde las dos fotos y cuenta lo que hace.
//  - desde la foto recta: ¿llega el palo a la V (rueda en la tira)?
//  - desde la foto de la V: ¿vuelve el palo arriba (como en la foto recta)?
//  - en las dos: cuántas veces pasa de arriba a la V y de la V a arriba, y cuánto dura.
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
function una(o, T) {
  const d = require('./real2.js')(P, o), info = P.build(d), w = info.world;
  if (info.overlaps.length) return { por: 'solapes' };
  const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball], th0 = d._th0;
  const ang = () => th0 + (lev.a - lev.a0) * 180 / Math.PI;
  let estado = o.uve ? 'abajo' : 'arriba', aV = 0, aArriba = 0, min = 99, max = -99, minErr = 0, cae = false, tUlt = 0;
  while (w.t < T && !w.isStopped()) {
    w.step(); const a = ang(); min = Math.min(min, a); max = Math.max(max, a);
    if (estado === 'arriba' && a < -20) { estado = 'abajo'; aV++; tUlt = w.t; }
    else if (estado === 'abajo' && a > -3) { estado = 'arriba'; aArriba++; tUlt = w.t; }
    if ((w.t * 480 | 0) % 48 === 0) minErr = Math.min(minErr, w.balance().error);
    if (ball.y < -0.3) { cae = true; break; }
  }
  const b = w.balance(), malo = minErr < -Math.max(0.002, 0.05 * Math.max(b.reserve, b.outflow));
  return { valido: !malo, cae, aV, aArriba, min: +min.toFixed(1), max: +max.toFixed(1), final: +ang().toFixed(1), t: +w.t.toFixed(1), parada: w.isStopped(), err_mJ: +(b.error * 1000).toFixed(2) };
}
module.exports = una;
if (require.main === module) {
  const T = +(process.argv[3] || 20);
  for (const l of require('fs').readFileSync(process.argv[2], 'utf8').trim().split('\n')) {
    const o = JSON.parse(l); let r;
    try { r = { o, recta: una({ ...o, uve: false }, T), V: una({ ...o, uve: true }, T) }; } catch (e) { r = { o, por: String(e.message).slice(0, 80) }; }
    console.log(JSON.stringify(r));
  }
}
