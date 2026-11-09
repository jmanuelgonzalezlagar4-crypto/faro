// La rampa como la dibujó el usuario encima del vídeo (sobre la rampa nº 2492): una C grande a la izquierda, que da la
// vuelta y acaba encima del principio de la rampa; una rampa de vuelta empinada que empieza más allá del final de la
// rampa, debajo del imán, y baja hasta el fondo de la C; y la rampa de arriba, más corta.
// Medidas sacadas del dibujo (1,34 mm por píxel, con la ventana de la nº 2492):
//  - rampa de arriba: de (129, 89) a (356, 103) mm: 227 mm, sube 3,5°
//  - rampa de vuelta: de (75, 0) a (476, 66) mm: empieza 120 mm más allá del final y 37 mm por debajo; baja unos 10°
//  - C: de la mesa hasta lo alto, a la izquierda. En el dibujo lo alto queda unos 8 cm por encima del principio de la
//    rampa, más alto que donde cae la bola: no podría llegar nunca. Aquí lo alto queda justo una bola y 6 mm por encima
//    del principio de la rampa, lo más bajo que puede ir.
// El imán y la bola, los de la nº 2492; el imán, donde está en el dibujo: 154 mm más allá del final de la rampa y 19 mm
// por encima.
const BASE = { ang: 3.5, L: 0.227, rb: 0.0064, tam: 0.0426, grado: 'ferrita', forma: 'bar', angIman: 338.8879, angBola: 212.7678, dm: 0.133, hm: 0.0126,
  tramo: 0, hueco: 0.001, caida: 0.037, mas: 0.12, ybot: 0.005, g: 0.006, dx: 0.2, salida: 70, recogida: 'recta' };
// el radio de la C: lo alto, por dentro, una bola y g por encima del principio de la rampa, que está a 89 mm de la mesa
BASE.rh = (0.089 - BASE.ybot + 2 * BASE.rb + BASE.g) / 2;
module.exports = { BASE };
if (require.main === module) {
  const { prueba, monta } = require('./rampa.js');
  const S = monta(BASE); console.log('libre arriba', (S.libreArriba * 1000).toFixed(1), 'mm, abajo', (S.libreAbajo * 1000).toFixed(1), 'mm; C de', (BASE.rh * 1000).toFixed(1), 'mm de radio; vuelta baja', (Math.atan2(S.R1[1] - S.R2[1], S.R1[0] - S.R2[0]) * 180 / Math.PI).toFixed(1), '°');
  for (const ideal of [false, true]) for (const v0 of [0, 0.3, 0.6, 0.9, 1.2]) for (const x0 of [0.05, 0.15, 0.2]) {
    const r = prueba(Object.assign({}, BASE, { ideal, v0, x0 }), 30);
    console.log(JSON.stringify({ ideal, v0, x0, caidas: r.caidas, vueltas: r.vueltas, falta_mm: r.falta_mm, pegada: r.pegada, valido: r.valido, donde: r.donde }));
  }
}
