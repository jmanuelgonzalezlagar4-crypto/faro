// Pistas de aceleración al azar. Cada una se corre:
//  - sin rozamiento (ideal), 30 s: lo que cambia la energía de movimiento de una vuelta a la siguiente, siempre en el
//    mismo punto (si los imanes dieran energía, crecería vuelta a vuelta);
//  - con el roce de rodar, hasta que se para (como mucho 300 s): vueltas, comparadas con la misma pista sin imanes.
// Cada línea guarda las medidas de la pista, así que cualquiera se puede volver a correr con pista.js.
// Uso: SEMILLA=… DESDE=… node barrido.js N > trozo.jsonl  (todo.sh lo reparte en 4; DESDE solo numera)
const { prueba } = require('./pista.js');
let s = +(process.env.SEMILLA || 1); const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648, U = (a, b) => a + (b - a) * rnd(), pick = a => a[Math.floor(rnd() * a.length)];
const N = +(process.argv[2] || 100), desde = +(process.env.DESDE || 0);
for (let i = desde; i < desde + N; i++) {
  const movil = rnd() < 0.5 ? 'bola' : 'iman', tipo = pick(['rampa', 'V', 'escalera']);
  const o = { tipo, movil, n: 3 + Math.floor(rnd() * 14), arco: U(30, 300), grado: pick(['n35', 'n52']), giro: U(-60, 60), torcido: U(10, 70), inv: rnd() < 0.5,
    tam: movil === 'bola' ? U(0.03, 0.06) : U(0.01, 0.03), polo: movil === 'iman' ? pick([0, 90, 180, 270, U(0, 360)]) : 0,
    d0: U(0.01, 0.08), d1: U(0.003, 0.03), rb: U(0.008, 0.015), mc: U(0.01, 0.1), v0: U(0.3, 2), R: U(0.12, 0.3) };
  for (const k of Object.keys(o)) if (typeof o[k] === 'number') o[k] = +o[k].toFixed(4);
  const id = prueba(Object.assign({}, o, { ideal: true }), 30), real = prueba(o, 300), sin = prueba(Object.assign({}, o, { sinImanes: true }), 300);
  console.log(JSON.stringify({ n: i, o, ideal_rend: id.rend, ideal_sobra_mJ: id.sobra_mJ, ideal_por_vuelta: id.por_vuelta, ideal_vueltas: id.vueltas, ideal_valido: id.valido, ideal_atras: id.atras, ideal_parada: id.parada,
    vueltas: real.vueltas, vueltas_sin: sin.vueltas, dura_s: real.dura_s, dura_sin_s: sin.dura_s, real_rend: real.rend, pozo_mJ: real.Pm_final_mJ, K0_mJ: real.K[0], valido: real.valido, parada: real.parada, minErr_mJ: Math.min(id.minErr_mJ, real.minErr_mJ) }));
}
