// La fila más alta que pueden alcanzar las bolas (20 de 247 g) y filas más bajas con una caída más larga:
// ¿llega el golpe de la bola que cae? (el mejor caso: fila perfecta y golpe entero)
const prueba = require('./fila-perfecta.js');
const mg = 0.247 * 9.81;
for (let k = 0; k <= 10; k += 2) {
  const F = (20 - k) * mg, kick = k * 0.1 * mg;
  const r = prueba(F, kick, {});
  // golpe mínimo con ese empuje
  let lo = 0, hi = 12; for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; if (prueba(F, m, {}).entra) hi = m; else lo = m; }
  console.log(JSON.stringify({ fila: 20 - k, cae_m: +(k * 0.1).toFixed(1), empuje_N: +F.toFixed(1), golpe_que_trae_J: +kick.toFixed(2), entra: r.entra, golpe_que_hace_falta_J: +hi.toFixed(2) }));
}
