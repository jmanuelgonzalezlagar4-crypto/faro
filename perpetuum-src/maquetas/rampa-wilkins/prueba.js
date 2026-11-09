// Corre la rampa de Wilkins y cuenta vueltas: la bola sube por la rampa recta, cae por el agujero, baja por la curva,
// el gancho la deja al pie y vuelve a subir. Dice si se queda pegada al imán, si no sube o cuántas vueltas da.
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
function prueba(o, T) {
  const d = require('./wilkins-foto.js')(P, o); d.dt = 1 / (480 * (o.div || 4)); const info = P.build(d), w = info.world, k = d._k;
  const b = info.bodyOf[d._ids.bola]; const px = () => b.x / k, py = () => 1000 - b.y / k;
  // el empujón de salida (como si viniera del gancho): se cuenta como energía que la máquina tiene al empezar
  if (o.v0) { const p = d.parts.find(q => q.id === d._ids.bola); b.vx = p.vx0; b.vy = p.vy0; b.w = o.v0 / p.r; w.ledger.E0 = w.energy().E; }
  let minErr = 0, escala = 0.01, chk = 0;
  let estado = 'rampa', caidas = 0, vueltas = 0, maxSube = 9999, pegada = false, quieta = 0;
  const huecoX = d._o.agujero;
  while (w.t < T) {
    w.step();
    const x = px(), y = py();
    if (++chk % 48 === 0) { const bl = w.balance(); minErr = Math.min(minErr, bl.error); escala = Math.max(escala, bl.e.K, bl.inflow, bl.outflow); }
    if (estado === 'rampa') { maxSube = Math.min(maxSube, x); if (x < huecoX + 10 && y > 900 - (1850 - x) * (523 / 890) + 20) { estado = 'cae'; caidas++; } }
    else if (estado === 'cae' && x > 1700 && y < 900) { estado = 'gancho'; }
    else if (estado === 'gancho' && x < d._o.pie && y < 900 - (1850 - x) * (523 / 890) + 5) { estado = 'rampa'; vueltas++; }
    const v = Math.hypot(b.vx, b.vy); quieta = v < 0.005 ? quieta + w.dt : 0;
    if (quieta > 1) { pegada = x < huecoX + 80 && y < 400; break; }
    if (b.y < -0.3) break;
  }
  const bl = w.balance();
  const valido = minErr > -Math.max(0.005, 0.05 * escala);
  return { valido, minErr_mJ: +(minErr * 1000).toFixed(1), caidas, vueltas, lo_mas_arriba_px: Math.round(maxSube), quieta: quieta > 1, pegada_al_iman: pegada, t: +w.t.toFixed(1), donde: [Math.round(px()), Math.round(py())], err_mJ: +(bl.error * 1000).toFixed(2) };
}
module.exports = prueba;
if (require.main === module) { const o = JSON.parse(process.argv[2] || '{}'); console.log(JSON.stringify(prueba(o, +(process.argv[3] || 20)))); }
