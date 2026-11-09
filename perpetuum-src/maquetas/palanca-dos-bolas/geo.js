// Ángulo de la posición de abajo (D): lo que gira la palanca hasta que el borde curvo de la aleta queda a «holgura» mm
// de los raíles. Cuenta el grueso del borde (1,5 mm). El banco ya los da por tocándose a unos 2 mm, así que el tope del
// eje se pone a 2,6 mm: la aleta queda justo encima de los raíles sin apoyarse.
const ALETA = [[-104, 168], [-100.9, 158.5], [-94, 130.7], [-82.8, 108.4], [-66.2, 86.2], [-43.9, 66.7]];
const RAIL = [[-163.5, 53.7], [40.9, 25]];
function thD(holgura = 2.6) {
  const PY = 67.5, [a, b] = RAIL, sl = (b[1] - a[1]) / (b[0] - a[0]), cosr = Math.cos(Math.atan(sl));
  const alto = (x, y) => (y - (a[1] + (x - a[0]) * sl)) * cosr;      // distancia (en perpendicular) por encima de los raíles
  for (let g = 0; g < 80; g += 0.01) { const t = g * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    let min = 1e9; for (let i = 0; i + 1 < ALETA.length; i++) for (let k = 0; k <= 20; k++) { const p = ALETA[i].map((v, j) => v + (ALETA[i + 1][j] - v) * k / 20), dx = p[0], dy = p[1] - PY;
      const x = dx * c - dy * s, y = PY + dx * s + dy * c; if (x < a[0] || x > b[0]) continue; min = Math.min(min, alto(x, y) - 1.5); }
    if (min < holgura) return +(g - 0.01).toFixed(2); }
  return null;
}
module.exports = { thD, ALETA, RAIL };
if (require.main === module) console.log(thD(+(process.argv[2] || 2.6)));
