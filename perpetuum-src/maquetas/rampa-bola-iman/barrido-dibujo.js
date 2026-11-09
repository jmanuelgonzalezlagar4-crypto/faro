// Variantes de la rampa como la dibujó el usuario (dibujo-usuario.js): la rampa de arriba se acaba sin más, la de vuelta
// es recta y empieza más allá del final, y la C grande sube por la izquierda y deja la bola encima del principio.
// Se sortean inclinación, largo, caída, cuánto sigue la rampa de vuelta, tamaño de la C, imán, bola, salida y empujón.
// Uso: SEMILLA=… DESDE=… node barrido-dibujo.js N > trozo.jsonl
const { prueba, monta } = require('./rampa.js');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(+(process.env.SEMILLA || 1) * 999983 + 5), U = (a, b) => a + (b - a) * rnd(), pick = a => a[Math.floor(rnd() * a.length)];
const N = +(process.argv[2] || 100), desde = +(process.env.DESDE || 0);
for (let i = desde; i < desde + N; i++) {
  let o;
  for (let intento = 0; intento < 50; intento++) {
    const rb = U(0.004, 0.0125), L = U(0.15, 0.45), ang = U(2, 12), g = U(0.005, 0.012), ybot = 0.005;
    // la C: lo alto, una bola y g por encima del principio de la rampa; el principio, de 4 a 12 cm por encima de la mesa
    const hA = U(0.04, 0.12), rh = (hA - ybot + 2 * rb + g) / 2, sube = L * Math.sin(ang * Math.PI / 180);
    const caida = 2 * rb + U(0.003, Math.max(0.004, Math.min(0.06, hA + sube - ybot - 2 * rb - 0.01)));
    o = { ang, L, rb, tam: U(0.01, 0.06), grado: pick(['n35', 'n52', 'ferrita']), forma: pick(['bar', 'disc']), angIman: U(0, 360), angBola: U(0, 360),
      dm: U(0.005, 0.2), hm: U(-0.05, 0.05), caida, mas: U(0.03, 0.15), ybot, rh, g, dx: U(0, 0.4), salida: 88, recogida: 'recta', tramo: 0, hueco: 0.001,
      v0: rnd() < 0.4 ? 0 : U(0.05, 1.5), ideal: rnd() < 0.5 };
    for (let t = 88; t >= 60; t -= 2) { o.salida = t; if (monta(o).libreArriba < 0.001) { o.salida = t + 2; break; } }
    const S = monta(o), x0min = S.C[0] + rh * Math.cos(o.salida * Math.PI / 180) + rb + 0.01, x0max = L - rb - 0.01;
    o.x0 = U(x0min, Math.max(x0min + 0.001, x0max));
    if (S.libreArriba >= 0.001 && S.libreAbajo >= 0.002 && S.R1[1] > S.R2[1] + 0.005 && x0max > x0min) break;
  }
  for (const k of Object.keys(o)) if (typeof o[k] === 'number') o[k] = +o[k].toFixed(4);
  let r; try { r = prueba(o, 30); } catch (e) { r = { error: String(e.message).slice(0, 60) }; }
  console.log(JSON.stringify(Object.assign({ n: i, o }, r)));
}
