// Rampas al azar con imán y bola imantada: inclinación, largo, bola, imán (tamaño, fuerza, forma, giro, sitio), hueco,
// tramo final, caída hasta la rampa de vuelta, gancho, sitio de salida y empujón; con y sin rozamiento.
// Uso: SEMILLA=… DESDE=… node barrido.js N > trozo.jsonl
const { prueba, monta } = require('./rampa.js');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(+(process.env.SEMILLA || 1) * 1000003 + 17), U = (a, b) => a + (b - a) * rnd(), pick = a => a[Math.floor(rnd() * a.length)];
const N = +(process.argv[2] || 100), desde = +(process.env.DESDE || 0);
for (let i = desde; i < desde + N; i++) {
  // cada rampa tiene que tener sitio para la bola entre el gancho y el principio de la rampa (por encima) y entre la
  // rampa y la vuelta (por debajo), y la vuelta tiene que bajar hacia el gancho: si no, se sortea otra vez
  let o;
  for (let intento = 0; intento < 50; intento++) {
    const rb = U(0.004, 0.0125), L = U(0.15, 0.5), tramo = rnd() < 0.3 ? 0 : U(0.005, 0.06), hueco = 2 * rb + U(0.003, 0.03), ang = U(1, 12), g = U(0.005, 0.015);
    const rh = 2 * rb + (g + 0.012) / 2 + U(0, 0.03), dx = U(0, 0.4), recogida = rnd() < 0.5 ? 'curva' : 'recta', rc = U(2.2 * rb, 0.06);
    const sube = (L - tramo - hueco) * Math.sin(ang * Math.PI / 180), alto = 2 * rh - 2 * rb - g + sube;   // altura del hueco sobre el fondo del gancho
    const caida = 2 * rb + U(0.008, Math.max(0.0085, Math.min(0.05, alto - 2 * rb - 0.006 - (recogida === 'curva' ? rc : 0))));
    o = { ang, L, rb, tam: U(0.01, 0.06), grado: pick(['n35', 'n52', 'ferrita']), forma: pick(['bar', 'disc']), angIman: U(0, 360), angBola: U(0, 360),
      dm: U(0.003, 0.05), hm: U(-0.05, 0.04), caida, rh, g, dx, salida: 88, recogida, rc, tramo, hueco, v0: rnd() < 0.5 ? 0 : U(0.05, 1), ideal: rnd() < 0.5 };
    // la salida del gancho: lo más lejos que se pueda (hasta 60°) sin quitarle sitio a la bola
    for (let t = 88; t >= 60; t -= 2) { o.salida = t; if (monta(o).libreArriba < 0.001) { o.salida = t + 2; break; } }
    const S = monta(o);
    const x0min = S.C[0] + rh * Math.cos(o.salida * Math.PI / 180) + rb + 0.01, x0max = L - tramo - hueco - rb - 0.005;
    o.x0 = U(x0min, Math.max(x0min + 0.001, x0max));
    if (S.libreArriba >= 0.001 && S.libreAbajo >= 0.002 && S.R1[1] > S.R2[1] + 0.005 && x0max > x0min) break;
  }
  for (const k of Object.keys(o)) if (typeof o[k] === 'number') o[k] = +o[k].toFixed(4);
  let r; try { r = prueba(o, 30); } catch (e) { r = { error: String(e.message).slice(0, 60) }; }
  console.log(JSON.stringify(Object.assign({ n: i, o }, r)));
}
