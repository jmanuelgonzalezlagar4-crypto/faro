// Uso: node esclusa.js '{"rho":1000}' 120   (rho: densidad del líquido; m: masa de las bolas)
// Noria de bolas con una esclusa perfecta en el hueco del fondo: la bola pasa sin empujar nada,
// pero cada vez se va por abajo el agua que ocupa (su volumen, a la presión del fondo).
// Esa agua perdida se apunta como energía que entra: es lo que hay que reponer para que el tanque no baje.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 120);
const d = P.EXAMPLES.flotadores.make({ gen: o.gen });
const tank = d.parts.find(p => p.kind === 'tank'); tank.rho = o.rho || 1000;
if (o.m) d.parts.filter(p => p.kind === 'ball').forEach(b => b.m = o.m);
if (o.ideal) d.ideal = true;
const info = P.build(d), w = info.world;
const balls = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]);
const hub = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
const X1 = 0.11, YB = 0.05, R = 0.05, V = 4 / 3 * Math.PI * R ** 3, IN = [X1 - R - 0.004, YB + R + 0.004];
let entradas = 0, agua = 0, litros = 0, next = 0;
const t0 = Date.now();
while (w.t < T) {
  w.step();
  // ¿hay una bola en la boca del hueco, por fuera, y sitio dentro?
  const b = balls.find(q => q.x > X1 && q.x < X1 + R + 0.02 && q.y < 0.2);
  if (b && balls.every(q => q === b || Math.hypot(q.x - IN[0], q.y - IN[1]) > 2 * R + 0.003)) {
    const e0 = w.energy().E;
    b.x = IN[0]; b.y = IN[1]; b.vx = 0; b.vy = 0; b.w = 0; b.updateWorld();
    w._contacts = null;                         // que vuelva a mirar los contactos y las fuerzas del agua
    const dE = w.energy().E - e0;
    w.ledger.battery += dE; agua += dE; litros += V * 1000; entradas++;
  }
  if (w.t >= next) { const bl = w.balance(); console.log(w.t.toFixed(0) + ' s', 'entradas', entradas, 'noria', (-(hub.a - hub.a0) / 2 / Math.PI).toFixed(1), 'vueltas', 'electricidad', bl.gen.toFixed(2), 'J', 'agua perdida', agua.toFixed(2), 'J', 'err', bl.error.toFixed(3)); next += T / 6; }
}
const bl = w.balance();
console.log(JSON.stringify({ rho: tank.rho, m: o.m || 0.247, entradas, litros: +litros.toFixed(2), agua_J: +agua.toFixed(2), elec_J: +bl.gen.toFixed(2), rinde: +(bl.gen / agua * 100).toFixed(1), vueltas: +(-(hub.a - hub.a0) / 2 / Math.PI).toFixed(1), golpes: +bl.hits.toFixed(2), roce: +(bl.rub + bl.axle).toFixed(2), frenado_agua: +bl.water.toFixed(2), err: +bl.error.toFixed(3), t: w.t, ms: Date.now() - t0 }));
