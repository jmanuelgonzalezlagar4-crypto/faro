// Corre un diseño y cuenta las vueltas completas de verdad: el palo arriba (donde empezó), abajo y otra vez arriba.
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
function prueba(o, T) {
  const d = require('./ciclo3.js')(P, o), info = P.build(d), w = info.world;
  if (info.overlaps.length) return { o, valido: false, por: 'solapes' };
  const lev = info.bodyOf[d._ids.lever], ball = info.bodyOf[d._ids.ball];
  const th0 = d._th0, ang = () => th0 + (lev.a - lev.a0) * 180 / Math.PI;
  // la bola respecto a la bisagra (punto del palo): cerca de la bisagra = en la V; lejos = en la punta
  const hl = lev.toLocal(d._B[0], d._B[1]), Lr = o.L;
  let bEstado = 'punta', viajes = 0, enV = 0, minAtV = null, minAfter = 999, maxAfter = -999, recMax = 0;
  let estado = 'arriba', vueltas = 0, bajadas = 0, minErr = 0, t0 = 0, maxAbajo = th0;
  while (w.t < T && !w.isStopped()) {
    w.step();
    const a = ang(); maxAbajo = Math.min(maxAbajo, a);
    if (estado === 'arriba' && a < th0 - 8) { estado = 'abajo'; bajadas++; }
    else if (estado === 'abajo' && a > th0 - 1.5) { estado = 'arriba'; vueltas++; }
    const hp = lev.toWorld(hl.x, hl.y), db = Math.hypot(ball.x - hp.x, ball.y - hp.y) / Lr;
    if (bEstado === 'punta' && db < 0.3) { bEstado = 'V'; enV++; }
    else if (bEstado === 'V' && db > 0.75) { bEstado = 'punta'; viajes++; }
    // después de que la bola llegue a la V: lo más bajo que llega el palo, y cuánto sube luego desde ahí
    if (enV >= 1) { minAfter = Math.min(minAfter, a); if (th0 - minAfter > 3) recMax = Math.max(recMax, (a - minAfter) / (th0 - minAfter)); }
    if ((w.t * 480 | 0) % 48 === 0) minErr = Math.min(minErr, w.balance().error);
    if (ball.y < -0.5) break;
  }
  const lowest = minAfter, recupera = Math.min(1.5, recMax);
  const b = w.balance();
  const malo = minErr < -Math.max(0.002, 0.05 * Math.max(b.reserve, b.outflow));
  return { o, valido: !malo, recupera: +recupera.toFixed(3), th0: +th0.toFixed(1), mas_bajo: +lowest.toFixed(1),  viajes, enV, vueltas, bajadas, t: +w.t.toFixed(1), parada: w.isStopped(), bajo_hasta: +maxAbajo.toFixed(1), gastado_mJ: +(b.reserve * 1000).toFixed(1), err_mJ: +(b.error * 1000).toFixed(2), minErr_mJ: +(minErr * 1000).toFixed(2) };
}
module.exports = prueba;
if (require.main === module) {
  // lee diseños (JSON por línea) de un fichero y escribe resultados
  const lines = require('fs').readFileSync(process.argv[2], 'utf8').trim().split('\n');
  const T = +(process.argv[3] || 30);
  for (const l of lines) { try { console.log(JSON.stringify(prueba(JSON.parse(l), T))); } catch (e) { console.log(JSON.stringify({ o: JSON.parse(l), valido: false, por: String(e.message).slice(0, 80) })); } }
}
