// Más pruebas con la rampa del dibujo del usuario: además del imán del final, una fila de 1 a 6 imanes junto a la rampa
// (a un lado, sin tocar la bola) que tiran de ella rampa arriba; y una pared al final para que la bola no salga volando.
// Uso: SEMILLA=… DESDE=… node barrido-fila.js N > trozo.jsonl
const { prueba, monta } = require('./rampa.js');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(+(process.env.SEMILLA || 1) * 7777777 + 3), U = (a, b) => a + (b - a) * rnd(), pick = a => a[Math.floor(rnd() * a.length)];
const N = +(process.argv[2] || 100), desde = +(process.env.DESDE || 0);
for (let i = desde; i < desde + N; i++) {
  let o;
  for (let intento = 0; intento < 50; intento++) {
    const rb = U(0.004, 0.0125), L = U(0.15, 0.45), ang = U(1, 10), g = U(0.005, 0.012), ybot = 0.005;
    const hA = U(0.04, 0.12), rh = (hA - ybot + 2 * rb + g) / 2, sube = L * Math.sin(ang * Math.PI / 180);
    const caida = 2 * rb + U(0.003, Math.max(0.004, Math.min(0.06, hA + sube - ybot - 2 * rb - 0.01)));
    const n = 1 + Math.floor(rnd() * 6), angF = U(0, 360), igual = rnd() < 0.5, f0 = U(0.2, 0.8), z = U(0.012, 0.03), tamF = U(0.01, 0.04);
    const fila = []; for (let k = 0; k < n; k++) fila.push({ f: +(f0 + (1 - f0) * (n > 1 ? k / (n - 1) : 1) * U(0.9, 1)).toFixed(3), ang: +(igual ? angF : U(0, 360)).toFixed(1), z: +z.toFixed(4), tam: +tamF.toFixed(4) });
    o = { ang, L, rb, tam: U(0.01, 0.06), grado: pick(['n35', 'n52']), forma: pick(['bar', 'disc']), angIman: U(0, 360), angBola: U(0, 360),
      dm: U(0.005, 0.2), hm: U(-0.05, 0.05), caida, mas: U(0.03, 0.12), ybot, rh, g, dx: U(0, 0.4), salida: 88, recogida: pick(['pared', 'pared', 'recta']), tramo: 0, hueco: 0.001,
      fila, v0: rnd() < 0.5 ? 0 : U(0.05, 1.2), ideal: rnd() < 0.5, mat: pick(['acero', 'goma']) };
    for (let t = 88; t >= 60; t -= 2) { o.salida = t; if (monta(o).libreArriba < 0.001) { o.salida = t + 2; break; } }
    const S = monta(o), x0min = S.C[0] + rh * Math.cos(o.salida * Math.PI / 180) + rb + 0.01, x0max = L - rb - 0.01;
    o.x0 = U(x0min, Math.max(x0min + 0.001, x0max));
    if (S.libreArriba >= 0.001 && S.libreAbajo >= 0.002 && S.R1[1] > S.R2[1] + 0.005 && x0max > x0min) break;
  }
  for (const k of Object.keys(o)) if (typeof o[k] === 'number') o[k] = +o[k].toFixed(4);
  let r; try { r = prueba(o, 30); } catch (e) { r = { error: String(e.message).slice(0, 60) }; }
  console.log(JSON.stringify(Object.assign({ n: i, o }, r)));
}
