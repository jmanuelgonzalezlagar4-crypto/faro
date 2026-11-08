// Con la V formada (punta de la rampa apoyada en el escalón), cuánto tira cada lado del palo,
// con la bola en la punta y con la bola en el fondo de la V. En N·cm sobre el eje.
const A = require('path').join(__dirname, '../../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js');
const o = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')), T = +(process.argv[3] || 0.6);
const d = require('./ciclo3.js')(P, o), info = P.build(d), w = info.world, g = w.g;
const lev = info.bodyOf[d._ids.lever];
const bars = d.parts.filter(p => p.kind === 'bar'), coilP = d.parts.find(p => p.kind === 'ball' && p.id !== d._ids.ball);
const rampB = info.bodyOf[bars[2].id];
const L = (x, y) => lev.toLocal(x, y), Lr = (x, y) => rampB.toLocal(x, y);
const pIzq = L((bars[0].x1 + bars[0].x2) / 2, (bars[0].y1 + bars[0].y2) / 2), pCoil = L(coilP.x, coilP.y), pArm = L((bars[1].x1 + bars[1].x2) / 2, (bars[1].y1 + bars[1].y2) / 2);
const hL = L(d._B[0], d._B[1]), tipR = Lr(d._E[0], d._E[1]);
while (w.t < T) w.step();
const X = (b, p) => b.toWorld(p.x, p.y).x;
const xh = X(lev, hL), xs = X(rampB, tipR), xr = rampB.x;
const Wr = rampB.m * g, Wb = o.mb * g;
const bob = (bars[0].m * g * -X(lev, pIzq) + coilP.m * g * -X(lev, pCoil)) * 100, brazo = bars[1].m * g * X(lev, pArm) * 100;
// la rampa (y la bola) apoyada en la bisagra y en el escalón: lo que carga la bisagra pasa al palo
function lado(xb) { const N = (Wr * (xr - xh) + Wb * (xb - xh)) / (xs - xh); return brazo + (Wr + Wb - N) * xh * 100; }
const ang = d._th0 + (lev.a - lev.a0) * 180 / Math.PI;
console.log(JSON.stringify({ t: T, palo: +ang.toFixed(1), x_bisagra_cm: +(xh * 100).toFixed(1), x_punta_cm: +(xs * 100).toFixed(1),
  lado_bobina: +bob.toFixed(2), lado_bola_con_bola_en_punta: +lado(xs).toFixed(2), lado_bola_con_bola_en_V: +lado(xh).toFixed(2),
  sin_escalon_bola_en_punta: +(brazo + (Wr * xr + Wb * xs) * 100).toFixed(2), sin_escalon_bola_en_V: +(brazo + (Wr * xr + Wb * xh) * 100).toFixed(2) }));
