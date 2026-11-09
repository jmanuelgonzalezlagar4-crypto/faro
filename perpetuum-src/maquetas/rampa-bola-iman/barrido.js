// Rampas al azar con imán y bola imantada: inclinación, largo, bola, imán (tamaño, fuerza, forma, giro, sitio), hueco,
// tramo final, caída hasta la rampa de vuelta, gancho, sitio de salida y empujón; con y sin rozamiento.
// Uso: SEMILLA=… DESDE=… node barrido.js N > trozo.jsonl
const { prueba } = require('./rampa.js');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(+(process.env.SEMILLA || 1) * 1000003 + 17), U = (a, b) => a + (b - a) * rnd(), pick = a => a[Math.floor(rnd() * a.length)];
const N = +(process.argv[2] || 100), desde = +(process.env.DESDE || 0);
for (let i = desde; i < desde + N; i++) {
  // la rampa de vuelta tiene que bajar hacia el gancho: el gancho (2·rh de alto) se elige para que su fondo quede por
  // debajo de donde cae la bola (al menos 5 mm), y para que la bola quepa por debajo de la rampa
  const rb = U(0.004, 0.0125), L = U(0.15, 0.5), tramo = rnd() < 0.3 ? 0 : U(0.005, 0.06), hueco = 2 * rb + U(0.003, 0.03), ang = U(1, 12);
  const caida = 2 * rb + U(0.008, 0.04), sube = (L - tramo - hueco) * Math.sin(ang * Math.PI / 180), rh = Math.max(rb + 0.004, (caida - sube + 0.005) / 2) + U(0, 0.03);
  const o = { ang, L, rb, tam: U(0.01, 0.06), grado: pick(['n35', 'n52', 'ferrita']), forma: pick(['bar', 'disc']), angIman: U(0, 360), angBola: U(0, 360),
    dm: U(0.003, 0.05), hm: U(-0.05, 0.04), caida, rh, c: U(0.005, 0.03), tramo, hueco,
    x0: U(0.02, Math.max(0.03, L - tramo - hueco - rb - 0.005)), v0: rnd() < 0.5 ? 0 : U(0.05, 1), ideal: rnd() < 0.5 };
  for (const k of Object.keys(o)) if (typeof o[k] === 'number') o[k] = +o[k].toFixed(4);
  let r; try { r = prueba(o, 30); } catch (e) { r = { error: String(e.message).slice(0, 60) }; }
  console.log(JSON.stringify(Object.assign({ n: i, o }, r)));
}
