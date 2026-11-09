// Corre N aparatos de una familia y busca energía de más: en cada momento, la energía que tiene la máquina más la que
// ha entregado (al acumulador o a la red) menos la que ha recibido (pila, mano, red), comparada con la del principio.
// No usa las cuentas de pérdidas (golpes, roces), así que un error al apuntarlas no puede parecer energía creada.
// Rendimiento = 100 % + lo que sobra / la energía que mueve la máquina. Por encima del 101 %, sobra al menos un 1 %.
// Uso: node corre.js familia N semilla [segundos] [división del paso] [vueltas de cálculo]
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
// ARREGLO_GUIAS=1: con el arreglo de las guías montadas en piezas que se mueven (arreglo-guias.js)
if (process.env.ARREGLO_GUIAS) require('./arreglo-guias.js')(E);
const P = require(A + '/build.js'), F = Object.assign({}, require('./familias.js'), require('./familias2.js'), require('./familias3.js'), require('./familias4.js'), require('./familias5.js'));
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function diseno(fam, seed, n) { return F[fam](P, mulberry32(seed * 1000003 + n * 7919 + 17)); }
function prueba(fam, seed, n, T, div, iters) {
  const d = diseno(fam, seed, n);
  if (div > 1) d.dt = 1 / (480 * div); if (iters) d.iters = iters;
  let info; try { info = P.build(d); } catch (e) { return { fam, n, por: 'no se monta: ' + String(e.message).slice(0, 60) }; }
  if (info.overlaps && info.overlaps.length) return { fam, n, por: 'piezas metidas una en otra' };
  const w = info.world, steps = Math.round(T / w.dt), chk = Math.max(1, Math.round(12 * div));
  let maxExc = 0, tExc = 0, escala = 0.01, hondo = 0, hondoTotal = 0, atascada = false, roto = false;
  for (let i = 1; i <= steps; i++) {
    w.step();
    // piezas metidas una en otra: más de 4 mm durante más de 1 s seguido o 0,25 s en total, o más de 1 cm alguna vez
    // (cuenta también contra las piezas fijas: una rueda metida en una rampa puede ir dando saltos y no estar siempre)
    const metidas = w.contacts.filter(c => c.sep < -0.004 && !(c.A.isStatic && c.B.isStatic));
    if (metidas.length) { hondo += w.dt; hondoTotal += w.dt; if (hondo > 1 || hondoTotal > 0.25 || metidas.some(c => c.sep < -0.01)) atascada = true; } else hondo = 0;
    if (i % chk === 0) {
      const b = w.balance(), L = w.ledger, exc = -b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn;
      if (!isFinite(exc)) { roto = true; break; }
      escala = Math.max(escala, b.e.K, b.inflow, b.outflow);
      if (exc > maxExc) { maxExc = exc; tExc = w.t; }
    }
  }
  if (atascada) return { fam, n, por: 'piezas que se quedan metidas una en otra' };
  const b = w.balance();
  return { fam, n, ej: d._ejemplo || d._mods, rend: +(100 * (1 + maxExc / escala)).toFixed(3), sobra_mJ: +(maxExc * 1000).toFixed(2), a_los_s: +tExc.toFixed(2), escala_mJ: +(escala * 1000).toFixed(1), roto, err_final_mJ: +(b.error * 1000).toFixed(2), dt: w.dt };
}
module.exports = { prueba, diseno };
if (require.main === module) {
  const [fam, N, seed, T, div, iters] = [process.argv[2], +process.argv[3], +process.argv[4], +(process.argv[5] || 10), +(process.argv[6] || 1), +(process.argv[7] || 0)];
  const desde = +(process.env.DESDE || 0);
  for (let n = desde; n < desde + N; n++) { let r; try { r = prueba(fam, seed, n, T, div, iters); } catch (e) { r = { fam, n, por: 'error: ' + String(e.message).slice(0, 60) }; } console.log(JSON.stringify(r)); }
}
