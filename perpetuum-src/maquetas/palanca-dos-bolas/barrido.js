// 2.000 variantes de la palanca de la captura: contrapeso, pesos del brazo y de la curva, sitio de la cazoleta,
// tamaño y material de la bola, con y sin rozamiento. Cada una se prueba en las dos mitades de la vuelta (prueba.js) y
// se apunta lo que necesita la palanca para volver arriba sin bola y lo que cuesta subir la bola.
// Uso: SEMILLA=… node barrido.js [n] > barrido.jsonl  (todo.sh lo reparte en 4 trozos)
const path = require('path'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { sube, levanta } = require('./prueba.js'), { thD } = require('./geo.js');
const N = +(process.argv[2] || 2000), th = thD();
let s = +(process.env.SEMILLA || 12345); const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648, U = (a, b) => a + (b - a) * rnd();
// energía de posición (mJ) de la palanca sin bola, arriba y abajo
function Pg(o, a0) { const d = require('./palanca.js')(P, Object.assign({}, o, { a0, thD: th, bola: 'cazo' }));
  d.parts = d.parts.filter(p => p.id !== d._ids.bola); const info = P.build(d); return info.world.energy().Pg * 1000; }
for (let i = 0; i < N; i++) {
  const rb = U(0.010, 0.0145), acero = rnd() < 0.3;
  const o = { mw: 0, mbar: U(0.02, 0.05), mfin: U(0.01, 0.03), cazo: [U(58, 66), U(35, 40)], rb, mb: (acero ? 7800 : 2500) * 4 / 3 * Math.PI * rb ** 3,
    x0: U(-160, -150), ideal: rnd() < 0.5 };
  // el contrapeso se elige para repartir las pruebas alrededor de donde se decide todo: lo que necesita la palanca
  // para volver arriba sin bola (v) va de −1 mJ a 1,3 veces lo que cuesta subir la bola (es lineal en el contrapeso)
  const sb = o.mb * 9.81 * (require('./prueba.js').enCazo(o, th)[1] - o.cazo[1]);
  const v0 = Pg(o, 0) - Pg(o, th), v1 = Pg(Object.assign({}, o, { mw: 0.05 }), 0) - Pg(Object.assign({}, o, { mw: 0.05 }), th);
  o.mw = Math.max(0, (U(-1, 1.3 * sb) - v0) / ((v1 - v0) / 0.05));
  const a = sube(o), b = levanta(o), vuelve = Pg(o, 0) - Pg(o, th), subirBola = o.mb * 9.81 * a.sube_mm;
  console.log(JSON.stringify({ n: i, semilla: +(process.env.SEMILLA || 12345), o: Object.assign({}, o, { mb: +o.mb.toFixed(4), mw: +o.mw.toFixed(4), mbar: +o.mbar.toFixed(4), mfin: +o.mfin.toFixed(4), cazo: o.cazo.map(v => +v.toFixed(1)), rb: +rb.toFixed(4), x0: +o.x0.toFixed(1) }),
    acero, A: a.llega, B: b.vuelve_arriba, las_dos: a.llega && b.vuelve_arriba, palanca_vuelve_mJ: +vuelve.toFixed(2), subir_bola_mJ: +subirBola.toFixed(2),
    giro_min_B: b.giro_min, err_mJ: b.err_mJ }));
}
