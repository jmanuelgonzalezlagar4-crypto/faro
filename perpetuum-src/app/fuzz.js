const E = require('./engine.js'); global.PerpetuumEngine = E;
const Bd = require('./build.js');
let seed = +(process.argv[2] || 1);
function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }
let worst = [];
for (let trial = 0; trial < 60; trial++) {
  const d = Bd.emptyDesign();
  d.ideal = rnd() < 0.3;
  const bodies = [];
  const nW = Math.floor(rnd() * 2);
  for (let i = 0; i < nW; i++) { const w = Bd.makeWheel(d, rnd() - 0.5, rnd() - 0.5, 0.2 + rnd() * 0.6); w.style = pick(['disc', 'ring']); w.m = 0.2 + rnd() * 10; w.rpm = Math.round((rnd() - 0.5) * 120); w.bearing = pick(['ideal', 'bolas', 'bronce', 'madera']); w.gen = rnd() < 0.3 ? rnd() : 0; d.parts.push(w); bodies.push(w); }
  const nB = 1 + Math.floor(rnd() * 5);
  for (let i = 0; i < nB; i++) {
    const x1 = (rnd() - 0.5) * 1.5, y1 = (rnd() - 0.5) * 1.5, ang = rnd() * 6.28, L = 0.1 + rnd() * 0.6;
    const bar = Bd.makeBar(d, x1, y1, x1 + L * Math.cos(ang), y1 + L * Math.sin(ang)); bar.m = 0.05 + rnd() * 2; d.parts.push(bar);
    const host = bodies.length && rnd() < 0.7 ? pick(bodies) : null;
    const pin = Bd.makePin(d, x1, y1, host ? host.id : null, bar.id); pin.mode = pick(['free', 'limits', 'limits', 'rigid']); pin.lo = -rnd() * 120; pin.hi = rnd() * 120; pin.bearing = pick(['ideal', 'bolas', 'bronce']); pin.gen = rnd() < 0.2 ? rnd() : 0; d.parts.push(pin);
    if (rnd() < 0.7) { const ball = Bd.makeBall(d, bar.x2, bar.y2); ball.r = 0.02 + rnd() * 0.1; ball.m = 0.02 + rnd() * 5; ball.mat = pick(['plomo', 'acero', 'madera', 'goma']); d.parts.push(ball); const w2 = Bd.makePin(d, bar.x2, bar.y2, bar.id, ball.id); w2.mode = pick(['rigid', 'free']); d.parts.push(w2); bodies.push(ball); }
    bodies.push(bar);
  }
  const nFree = Math.floor(rnd() * 4);
  for (let i = 0; i < nFree; i++) { const b = Bd.makeBall(d, (rnd() - 0.5) * 1.5, rnd() * 1); b.r = 0.02 + rnd() * 0.08; b.m = 0.02 + rnd() * 3; b.mat = pick(['plomo', 'acero', 'madera', 'goma']); d.parts.push(b); }
  d.parts.push(Bd.makeRamp(d, -1.5, -1.0 + rnd() * 0.3, 1.5, -1.0 - rnd() * 0.3));
  if (rnd() < 0.5) d.parts.push(Bd.makeRamp(d, -1.5, -1, -1.5, 1)), d.parts.push(Bd.makeRamp(d, 1.5, -1, 1.5, 1));
  if (rnd() < 0.4 && bodies.length) { const a = pick(bodies), b = rnd() < 0.5 ? pick(bodies) : null; if (!b || b.id !== a.id) { const ax = a.x != null ? a.x : a.x1, ay = a.y != null ? a.y : a.y1; const sp = Bd.makeSpring(d, ax, ay, ax + 0.3, ay + 0.2, a.id, b ? b.id : null); sp.k = 5 + rnd() * 3000; sp.damp = rnd() * 10; d.parts.push(sp); } }
  const nM = rnd() < 0.5 ? Math.floor(rnd() * 5) : 0;
  for (let i = 0; i < nM; i++) { const host = rnd() < 0.6 && bodies.length ? pick(bodies) : null; const hx = host ? (host.x != null ? host.x : host.x1) : (rnd() - 0.5); const hy = host ? (host.y != null ? host.y : host.y1) : (rnd() - 0.5); const m = Bd.makeMagnet(d, hx + (rnd() - 0.5) * 0.1, hy + (rnd() - 0.5) * 0.1, host ? host.id : null); m.mu = 0.5 + rnd() * 300; m.ang = rnd() * 360; d.parts.push(m); }
  let info;
  try { info = Bd.build(d); } catch (e) { console.log('build error', trial, e.message); continue; }
  const w = info.world; if (process.env.JB) w.jointBeta = +process.env.JB; if (process.env.PI) w.posIters = +process.env.PI;
  let bad = null, maxV = 0;
  for (let i = 0; i < 480 * 10; i++) {
    w.step();
    if (i % 48 === 0) {
      for (const b of w.bodies) { if (b.isStatic) continue; const v = Math.hypot(b.vx, b.vy); maxV = Math.max(maxV, v); if (!isFinite(v) || !isFinite(b.w)) { bad = 'NaN'; break; } }
      if (bad) break;
    }
  }
  const bl = w.balance();
  const scale = Math.max(Math.abs(bl.inflow), bl.outflow, 0.01);
  const rel = Math.abs(bl.error) / scale;
  worst.push({ trial, err: bl.error, rel, scale, maxV, bad, mags: nM, springs: d.parts.filter(p => p.kind === 'spring').length });
}
worst.sort((a, b) => b.rel - a.rel);
console.log(worst.slice(0, 8).map(r => `trial ${r.trial}: err=${r.err.toFixed(4)} J rel=${(r.rel*100).toFixed(2)}% scale=${r.scale.toFixed(2)} maxV=${r.maxV.toFixed(1)} ${r.bad||''} mags=${r.mags} springs=${r.springs}`).join('\n'));
console.log('NaN count', worst.filter(r => r.bad).length, ' >5% count', worst.filter(r => r.rel > 0.05).length, ' >1%', worst.filter(r => r.rel > 0.01).length);
