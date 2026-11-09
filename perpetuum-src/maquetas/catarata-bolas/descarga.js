// Uso: node descarga.js '{"kick":6.5,"vacio":true,"b0":100}' 120   (kick: julios de cada empujón; b0: carga inicial del acumulador)
// Noria de bolas en una cámara de vacío, con un acumulador: el generador de la noria lo carga, y cuando una
// bola se queda quieta delante del hueco, una descarga (un solenoide, 80 %) le da un empujón para meterla.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 120);
const KICK = o.kick || 1, ETA = 0.8, B0 = o.b0 != null ? o.b0 : 100;
const d = P.EXAMPLES.flotadores.make({});
d.air = !o.vacio;                                    // cámara de vacío: sin aire
const info = P.build(d), w = info.world, L = w.ledger;
L.battery += B0; L.bus += B0;                        // el acumulador empieza cargado (entra como batería)
const balls = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]);
const hub = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
const X1 = 0.11, R = 0.05;
const inside = new Set(balls.filter(b => b.x < X1).map(b => b.id));
let descargas = 0, entradas = 0, gastado = 0, last = -1, next = 0, minBus = B0;
while (w.t < T) {
  w.step();
  balls.forEach(b => {
    if (!inside.has(b.id) && b.x < X1 - R && b.y < 0.3) {
      inside.add(b.id); entradas++;
      // trampilla de una sola dirección: la bola que ya está dentro no puede volver a salir; se frena (y se apunta como golpe)
      if (b.vx < 0) { L.hits += 0.5 * b.m * b.vx * b.vx; b.vx = 0; }
    } else if (inside.has(b.id) && b.x > X1 + 0.06) inside.delete(b.id);
  });
  balls.forEach(b => { if (inside.has(b.id) && b.y < 0.3 && b.x > X1 - R && b.vx > 0) { L.hits += 0.5 * b.m * b.vx * b.vx; b.vx = 0; } });   // la trampilla no la deja volver
  const b = balls.find(q => !inside.has(q.id) && q.x > X1 && q.x < X1 + R + 0.02 && q.y < 0.2 && Math.hypot(q.vx, q.vy) < 0.05);
  const need = KICK / ETA;
  if (b && w.t - last > 0.5 && L.bus >= need) {
    const v = Math.sqrt(2 * KICK / b.m);
    b.vx = -v; b.vy = 0;
    L.bus -= need; L.busUsed += need; L.heat += need - KICK; gastado += need; descargas++; last = w.t;
  }
  minBus = Math.min(minBus, L.bus);
  if (w.t >= next) { const bl = w.balance(); console.log(w.t.toFixed(0) + ' s · descargas ' + descargas + ' · entran ' + entradas + ' · noria ' + (-(hub.a - hub.a0) / 2 / Math.PI).toFixed(1) + ' vueltas · acumulador ' + L.bus.toFixed(2) + ' J · generador ha dado ' + bl.gen.toFixed(2) + ' J · err ' + bl.error.toFixed(3)); next += T / 6; }
}
const bl = w.balance();
console.log(JSON.stringify({ kick: KICK, sale: balls.filter(q => inside.has(q.id) && q.x > X1).length, vacio: !!o.vacio, b0: B0, descargas, entradas, sacado_acum: +gastado.toFixed(2), generado: +bl.gen.toFixed(2), acum_final: +L.bus.toFixed(2), vueltas: +(-(hub.a - hub.a0) / 2 / Math.PI).toFixed(1), aire: +bl.air.toFixed(3), agua: +bl.water.toFixed(2), golpes: +bl.hits.toFixed(2), err: +bl.error.toFixed(3) }));
