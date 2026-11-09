// Uso: node imanes.js '{"fijo":0.16,"dt":0.00026042}' 30   (fijo: tamaño del imán fijo en m; pos: "suelo" para ponerlo bajo el suelo, con x)
// Noria de bolas con las bolas imantadas (un disco N52 de 2 cm dentro de cada una) y un imán fijo dentro del
// tanque, al fondo, enfrente del hueco, que tira de las bolas hacia dentro.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 30);
const d = P.EXAMPLES.flotadores.make({});
const X1 = 0.11, YB = 0.05, R = 0.05;
d.parts.filter(p => p.kind === 'ball').forEach(b => {
  const mg = P.makeMagnet(d, b.x, b.y, b.id, 'disc'); mg.size = o.bola || 0.02; mg.grade = 'n52'; mg.ang = 90; mg.solid = false;
  mg.mu = P.magnetModel(mg).mu; d.parts.push(mg);
});
if (o.fijo) {
  const suelo = o.pos === 'suelo';
  const mf = suelo ? P.makeMagnet(d, o.x || 0.08, YB - 0.012 - o.fijo / 2, null, 'disc') : P.makeMagnet(d, -0.012 - o.fijo / 2, YB + R, null, 'disc');
  mf.size = o.fijo; mf.grade = 'n52'; mf.ang = suelo ? 90 : 0; mf.solid = false;
  mf.mu = P.magnetModel(mf).mu; d.parts.push(mf);
}
if (o.dt) d.dt = o.dt;
const info = P.build(d), w = info.world;
const balls = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]);
const hub = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
const inside = new Set(balls.filter(b => b.x < X1).map(b => b.id));
let entradas = 0, next = 0;
while (w.t < T && !w.isStopped()) {
  w.step();
  balls.forEach(b => { if (!inside.has(b.id) && b.x < X1 - R) { inside.add(b.id); entradas++; } else if (inside.has(b.id) && b.x > X1 + 0.06) inside.delete(b.id); });
}
const bl = w.balance();
const pegadas = balls.filter(b => b.x < X1 && b.y < 0.25).length;
console.log(JSON.stringify({ dt: o.dt, iman_fijo_cm: o.fijo ? o.fijo * 100 : 0, sitio: o.pos || 'pared', x: o.x, entran: entradas, pegadas_al_fondo: pegadas, vueltas: +(-(hub.a - hub.a0) / 2 / Math.PI).toFixed(2), electricidad_J: +bl.gen.toFixed(2), parada_s: +w.t.toFixed(1), gastado_J: +bl.reserve.toFixed(2), err: +bl.error.toFixed(3) }));
