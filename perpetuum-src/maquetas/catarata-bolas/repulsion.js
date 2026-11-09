// Uso: node repulsion.js '{"fijo":0.08,"fija":true,"dt":0.00052083}' 40   (fijo: imanes bajo el suelo; fija: las bolas no giran)
// Tanque y bolas con el mismo polo enfrentado: imanes bajo el suelo del tanque (norte arriba) y un imán en cada
// bola (norte abajo), para que el fondo empuje las bolas hacia arriba. «fija»: las bolas no pueden girar.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 40);
const d = P.EXAMPLES.flotadores.make({});
const X1 = 0.11, YB = 0.05, R = 0.05;
d.parts.filter(p => p.kind === 'ball').forEach(b => { const m = P.makeMagnet(d, b.x, b.y, b.id, 'disc'); m.size = o.iman || 0.02; m.grade = 'n52'; m.ang = -90; m.solid = false; m.mu = P.magnetModel(m).mu; d.parts.push(m); });
const F = o.fijo || 0.06;
[0.03, 0.08].forEach(x => { const m = P.makeMagnet(d, x, YB - 0.012 - F / 2, null, 'disc'); m.size = F; m.grade = 'n52'; m.ang = 90; m.solid = false; m.mu = P.magnetModel(m).mu; d.parts.push(m); });
if (o.dt) d.dt = o.dt;
const info = P.build(d), w = info.world;
const balls = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]);
if (o.fija) balls.forEach(b => { b.iI = 0; b.w = 0; });          // las bolas no pueden girar: el imán siempre con el norte abajo
const hub = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
const inside = new Set(balls.filter(b => b.x < X1).map(b => b.id));
let entradas = 0, salen = 0, fhole = null;
while (w.t < T && !w.isStopped()) {
  w.step();
  balls.forEach(b => { if (!inside.has(b.id) && b.x < X1 - R) { inside.add(b.id); entradas++; } else if (inside.has(b.id) && b.x > X1 + 0.06) { inside.delete(b.id); salen++; } });
}
const plug = balls.filter(b => !inside.has(b.id) && b.x > X1 && b.y < 0.2).sort((a, b) => a.x - b.x)[0];
if (plug) { const ms = w.magnets.filter(m => m.body === plug); fhole = { imanes_x: +ms.reduce((s, m) => s + m.fx, 0).toFixed(2), imanes_y: +ms.reduce((s, m) => s + m.fy, 0).toFixed(2), agua_x: +w.floats.find(q => q.body === plug).fx.toFixed(1) }; }
const bl = w.balance();
const pegadas = balls.filter(b => inside.has(b.id) && b.y < 0.25).length;
console.log(JSON.stringify({ fija: !!o.fija, iman_suelo_cm: F * 100, salen, entran: entradas, pegadas_abajo: pegadas, vueltas: +(-(hub.a - hub.a0) / 2 / Math.PI).toFixed(1), electricidad_J: +bl.gen.toFixed(2), parada_s: +w.t.toFixed(1), en_el_hueco_N: fhole, err: +bl.error.toFixed(3) }));
