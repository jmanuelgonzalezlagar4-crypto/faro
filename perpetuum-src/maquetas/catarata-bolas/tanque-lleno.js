// Tanque lleno hasta la boca: las bolas salen por el borde, al nivel del agua (1 m sobre el hueco), así que la
// fila de fuera puede ser como mucho de 1 m. Fila perfecta y golpe entero: ¿llega?
const prueba = require('./fila-perfecta.js');
for (const m of [0.247, 0.35]) {
  const mg = m * 9.81, NMAX = 10;
  for (let n = NMAX; n >= 0; n -= 2) {
    const F = n * mg, kick = (NMAX - n) * 0.1 * mg;
    let lo = 0, hi = 12; for (let i = 0; i < 12; i++) { const k = (lo + hi) / 2; if (prueba(F, k, { m }).entra) hi = k; else lo = k; }
    console.log(JSON.stringify({ bola_g: Math.round(m * 1000), fila: n, cae_m: +((NMAX - n) * 0.1).toFixed(1), empuje_N: +F.toFixed(1), golpe_que_trae_J: +kick.toFixed(2), golpe_que_hace_falta_J: +hi.toFixed(2), entra: prueba(F, kick, { m }).entra }));
  }
}
