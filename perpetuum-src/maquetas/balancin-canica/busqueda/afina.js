// Afinado: coge los mejores diseños de los resultados y genera variaciones pequeñas de todas sus medidas.
// Uso: node afina.js <ronda> <cuántos mejores> <variaciones por diseño> resultados...
const fs = require('fs');
const [ronda, K, V] = process.argv.slice(2, 5).map(Number), files = process.argv.slice(5);
const R = files.flatMap(f => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse)).filter(r => r.valido);
const score = r => (r.vueltas >= 1 && r.viajes >= 1 ? 10 : 0) + (r.recupera || 0);
R.sort((a, b) => score(b) - score(a));
let s = 1000 + ronda; const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const lim = { mb: [0.003, 0.3], mc: [0.001, 1], xl: [0.1, 0.4], al: [2, 45], La: [0.1, 0.45], L: [0.05, 0.35], mr: [0.003, 0.12], hi: [20, 95], inc: [0.5, 15], hr: [0, 0.25], ml: [0.01, 0.15], ma: [0.01, 0.12] };
const out = [[], [], [], []]; let id = ronda * 100000;
R.slice(0, K).forEach(r => {
  for (let v = 0; v < V; v++) {
    const o = Object.assign({}, r.o, { id: id++ });
    for (const k in lim) if (rnd() < 0.5) { const f = 1 + (rnd() - 0.5) * 0.4; o[k] = +Math.min(lim[k][1], Math.max(lim[k][0], o[k] * f)).toFixed(4); }
    o.rb = o.mb > 0.05 ? 0.015 : 0.01;
    out[id % 4].push(JSON.stringify(o));
  }
});
out.forEach((a, k) => fs.writeFileSync('afina' + ronda + '_' + k + '.txt', a.join('\n') + '\n'));
console.log('mejores', R.slice(0, 5).map(r => `recupera ${r.recupera} vueltas ${r.vueltas} viajes ${r.viajes} mb ${r.o.mb} mc ${r.o.mc}`).join(' | '));
