// Lo que pierde la bola al dar la vuelta en el extremo del imán, sin imán: rueda hacia el final de la rampa, cae (o
// rebota) y vuelve rodando por la rampa de vuelta. Se compara su energía (movimiento + altura) al llegar al final con la
// que lleva cuando, ya de vuelta, pasa por la mitad de la rampa de vuelta. Para las tres formas de dar la vuelta, con
// y sin rozamiento, y varias velocidades.
// Uso: node vuelta.js > vuelta.jsonl
const { monta } = require('./rampa.js'), { BASE } = require('./dibujo-usuario.js');
const G = 9.81;
for (const recogida of ['recta', 'curva', 'pared']) for (const ideal of [true, false]) for (const v0 of [0.6, 0.9, 1.2, 1.5]) for (const mat of ['acero', 'goma']) {
  const o = Object.assign({}, BASE, { recogida, ideal, v0, mat, x0: 0.15, tam: 0.005, grado: 'ferrita', dm: 1, rc: 0.03 });
  const S = monta(o), w = S.w, b = S.b, m = b.m, Ex = S.Ep[0];
  const Emec = () => 0.5 * m * (b.vx * b.vx + b.vy * b.vy) + 0.5 * (b.iI > 0 ? 1 / b.iI : 0.4 * m * o.rb * o.rb) * b.w * b.w + m * G * b.y;
  let E1 = null, E2 = null, cayo = false;
  while (w.t < 10) { w.step();
    if (E1 == null && b.x >= Ex - o.rb) E1 = Emec();
    if (E1 != null && b.y < S.Ep[1] - 2 * o.rb) cayo = true;
    if (cayo && b.vx < 0 && b.x < (S.R1[0] + S.R2[0]) / 2) { E2 = Emec(); break; } }
  // energía de altura relativa: se resta la de la mitad de la vuelta en las dos para que sea lo que tiene «de sobra»
  console.log(JSON.stringify({ recogida, ideal, v0, mat, llega: E2 != null, queda_pct: E2 != null ? +(100 * E2 / E1).toFixed(1) : null,
    E_final_mJ: E1 ? +(E1 * 1000).toFixed(2) : null, E_vuelta_mJ: E2 ? +(E2 * 1000).toFixed(2) : null }));
}
