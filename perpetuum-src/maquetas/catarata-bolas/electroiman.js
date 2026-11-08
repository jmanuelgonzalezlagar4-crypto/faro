// Uso: node electroiman.js '{"mu":300,"pulso":0.3,"sitio":"tunel","c0":100000,"iman":0.04,"ideal":true,"dt":0.00026042}' 30
//   mu: fuerza del electroimán (A·m²); pulso: segundos encendido; sitio: pared, suelo o tunel; c0: carga inicial (J);
//   iman: tamaño del imán dentro de cada bola (0 = bolas de acero sin imantar); ideal: bobina sin calor
// Noria de bolas de acero con un condensador: lo carga el generador de la noria, y cuando una bola espera en el
// hueco, la descarga enciende un electroimán dentro del tanque que tira de ella hacia dentro.
// Lo que gasta el electroimán (encenderlo, apagarlo y el calor de la bobina) sale del condensador.
const A = require('path').join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(process.argv[2] || '{}'), T = +(process.argv[3] || 60);
const MU = o.mu || 40, PULSE = o.pulso || 1, B0 = o.c0 != null ? o.c0 : 100;
const d = P.EXAMPLES.flotadores.make({});
const X1 = 0.11, YB = 0.05, R = 0.05;
const ex = o.sitio === 'suelo' ? 0.055 : (o.sitio === 'tunel' ? X1 - R : -0.012 - 0.03), ey = o.sitio === 'suelo' ? YB - 0.012 - 0.03 : YB + R;
// bolas imantadas: un disco N52 dentro de cada una
if (o.iman) d.parts.filter(p => p.kind === 'ball').forEach(b => { const m = P.makeMagnet(d, b.x, b.y, b.id, 'disc'); m.size = o.iman; m.grade = 'n52'; m.ang = 90; m.solid = false; m.mu = P.magnetModel(m).mu; d.parts.push(m); });
const em = P.makeMagnet(d, ex, ey, null, 'electro'); em.mu = MU; em.ang = o.sitio === 'suelo' ? 90 : 0; em.size = 0.06; em.solid = false; em.emode = 'always';
d.parts.push(em);
if (o.ideal) d.ideal = true;
if (o.dt) d.dt = o.dt;
const info = P.build(d), w = info.world, L = w.ledger;
const el = info.electroOf[em.id];
el.mode = 'script'; el.want = false;
const ew = w._electroWanted; w._electroWanted = function (e) { return e.mode === 'script' ? !!e.want : ew.call(this, e); };
L.battery += B0; L.bus += B0;                                   // el condensador empieza cargado
const balls = d.parts.filter(p => p.kind === 'ball').map(p => info.bodyOf[p.id]);
const hub = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
const inside = new Set(balls.filter(b => b.x < X1).map(b => b.id));
let entradas = 0, descargas = 0, offAt = -1, gasto = 0, next = 0, vacio = false;
while (w.t < T) {
  const bat0 = L.battery;
  w.step();
  const cost = L.battery - bat0;                                 // lo que ha pedido el electroimán en este paso
  if (cost) { L.battery -= cost; L.bus -= cost; gasto += cost; }  // sale del condensador, no de una batería
  if (L.bus < 0 && el.want) { el.want = false; vacio = true; }   // condensador vacío: se apaga
  balls.forEach(b => { if (!inside.has(b.id) && b.x < X1 - R && b.y < 0.3) { inside.add(b.id); entradas++; } else if (inside.has(b.id) && b.x > X1 + 0.06) inside.delete(b.id); });
  if (el.want && w.t >= offAt) el.want = false;
  const b = balls.find(q => !inside.has(q.id) && q.x > X1 && q.x < X1 + R + 0.02 && q.y < 0.2 && Math.hypot(q.vx, q.vy) < 0.05);
  if (!el.want && b && L.bus > 0 && w.t - offAt > 0.5) { el.want = true; offAt = w.t + PULSE; descargas++; }
  if (w.t >= next && o.log) { console.log(w.t.toFixed(0) + ' s · descargas ' + descargas + ' · entran ' + entradas + ' · condensador ' + L.bus.toFixed(1) + ' J · noria ' + w.balance().gen.toFixed(2) + ' J'); next += T / 6; }
}
const bl = w.balance();
const pegadas = balls.filter(b => b.x < X1 && b.y < 0.25).length;
console.log(JSON.stringify({ iman_bola: o.iman || 0, mu: MU, pulso_s: PULSE, sitio: o.sitio || 'pared', ideal: !!o.ideal, descargas, entran: entradas, gasto_electroiman_J: +gasto.toFixed(2), noria_devuelve_J: +bl.gen.toFixed(2), condensador_final_J: +L.bus.toFixed(2), vueltas: +(-(hub.a - hub.a0) / 2 / Math.PI).toFixed(1), pegadas_abajo: pegadas, err: +bl.error.toFixed(3) }));
