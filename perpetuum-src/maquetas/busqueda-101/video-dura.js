// Vídeo a cámara rápida de un aparato en condiciones reales (con rozamiento): cuánto aguanta y cómo se le va la energía.
// Uso: node video-dura.js fam semilla n Tmax salida.mp4 "título" "explicación 1|explicación 2|explicación 3" [ventana x0,x1,y0,y1] [giro_lento]
const path = require('path'), fs = require('fs'), { execSync } = require('child_process'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js'), { dibuja } = require('./dibujo.js');
const [fam, seed, n, Tmax, out, titulo, textos, ventana, giroLento] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5], process.argv[6], process.argv[7], (process.argv[8] || '').split('|'), process.argv[9], +(process.argv[10] || 1)];
const FPS = 30;
function monta() { const d = diseno(fam, seed, n); d.ideal = false; d.parts.filter(p => p.kind === 'spring').forEach(p => { if (!(p.damp > 0)) p.damp = 0.5; }); const info = P.build(d); return { d, info, w: info.world }; }
// 1. pasada para saber cuánto dura y cuánta energía tiene al final (estado de reposo)
let m = monta(); const E0 = m.w.energy().E; let quieto = 0, Kmax = 0;
// SIGUE=1: ya se sabe que a los Tmax s sigue en marcha (un volante): no hace falta la primera pasada
if (process.env.SIGUE === '1') { Kmax = m.w.kinetic(); m.w.t = Tmax; }
else while (m.w.t < Tmax && !m.w.isStopped() && quieto < 2) { m.w.step(); const K = m.w.kinetic(); Kmax = Math.max(Kmax, K); quieto = K < Math.max(1e-4, 1e-3 * Kmax) ? quieto + m.w.dt : 0; }
const D = Math.min(m.w.t, Tmax), parado = process.env.SIGUE !== '1' && (m.w.isStopped() || quieto >= 2), Efin = parado ? m.w.energy().E : null;
console.log('dura', D.toFixed(1), 's', parado ? 'y se para' : 'y sigue');
// 2. horario del vídeo: 5 s a velocidad normal, hasta el minuto ×10, y el resto en unos 15 s
const tramos = [[0, Math.min(5, D), 1]]; if (D > 5) tramos.push([5, Math.min(60, D), 10]); if (D > 60) { const v = Math.max(20, Math.round((D - 60) / 15)); tramos.push([60, D, v]); }
const horario = []; tramos.forEach(([a, b, v]) => { for (let t = a; t < b; t += v / FPS) horario.push({ t, v }); }); horario.push({ t: D, v: 0 });
for (let i = 0; i < 2 * FPS; i++) horario.push({ t: D, v: 0, fin: true });
// ventana de dibujo
let win; if (ventana) win = ventana.split(',').map(Number); else { const xs = [], ys = []; m.w.bodies.forEach(b => b.shapes.forEach(s => { const pts = s.t === 's' ? [b.toWorld(s.ax, s.ay), b.toWorld(s.bx, s.by)] : [b.toWorld(s.x || 0, s.y || 0)]; pts.forEach(p => { xs.push(p.x - (s.r || 0)); xs.push(p.x + (s.r || 0)); ys.push(p.y - (s.r || 0)); ys.push(p.y + (s.r || 0)); }); }));
  const x0 = Math.min(...xs) - 0.05, x1 = Math.max(...xs) + 0.05, y0 = Math.min(...ys) - 0.05, y1 = Math.max(...ys) + 0.05; win = [x0, x1, y0, y1]; }
const W = Math.round(Math.min(700, 470 * (win[1] - win[0]) / (win[3] - win[2])));
// 3. vídeo
const queda = w => { const e = w.energy().E; return parado ? Math.max(0, (e - Efin) / (E0 - Efin)) : w.kinetic() / Math.max(1e-9, Kmax); };
const fmt = t => t < 60 ? `${t.toFixed(1).replace('.', ',')} s` : t < 3600 ? `${Math.floor(t / 60)} min ${String(Math.floor(t % 60)).padStart(2, '0')} s` : `${Math.floor(t / 3600)} h ${String(Math.floor(t % 3600 / 60)).padStart(2, '0')} min`;
(async () => {
  const dir = out.replace(/\.mp4$/, '-f'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:16px;font-size:24px;font-weight:700}#esc{position:absolute;left:28px;top:60px}#esc svg{border-radius:8px}
    #der{position:absolute;left:${W + 56}px;right:28px;top:60px}.reloj{font-size:40px;font-weight:700}.vel{font-size:17px;color:#b3361b;font-weight:600;margin:2px 0 18px}
    .bar{height:26px;border-radius:6px;background:#ecebe6;overflow:hidden;margin:6px 0 4px}.bar i{display:block;height:100%;background:#2f6fd0;border-radius:6px}.lb{font-size:16px;color:#52514e}.pc{font-size:30px;font-weight:700}
    #tx{position:absolute;left:28px;right:28px;bottom:18px;font-size:19px;line-height:1.4;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:12px 16px}</style>
    <div id="tit"></div><div id="esc"></div><div id="der"></div><div id="tx"></div>`);
  m = monta(); const serie = []; let k = 0;
  // GIRO_VISUAL: una rueda muy rápida se dibuja girando despacio (media vuelta por segundo de vídeo a la velocidad
  // del principio, y más despacio según se frena), para que se vea; el número de vueltas por minuto es el de verdad.
  const rueda = process.env.GIRO_VISUAL ? m.w.bodies.find(b => !b.isStatic && b.shapes.some(q => q.t === 'c' && q.r > 0.05)) : null, w0 = rueda ? Math.abs(rueda.w) : 0; let aVis = 0;
  for (const h of horario) {
    while (m.w.t < h.t - 1e-9) m.w.step();
    const q = Math.min(1, queda(m.w)); if (!serie.length || h.t - serie[serie.length - 1][0] > D / 400) serie.push([h.t, q]);
    let svg; if (rueda) { const aReal = rueda.a; aVis += 2 * Math.PI * 0.5 * Math.abs(rueda.w) / w0 / FPS; rueda.a = -aVis; rueda.updateWorld(); svg = dibuja(m.w, m.info, m.d, win, W, []); rueda.a = aReal; rueda.updateWorld(); }
    else svg = dibuja(m.w, m.info, m.d, win, W, []);
    const rpm = rueda ? `<div class="lb" style="margin-top:-6px">Vueltas por minuto (de verdad)</div><div class="pc" style="margin-bottom:14px">${Math.round(Math.abs(rueda.w) * 60 / 2 / Math.PI).toLocaleString('es-ES')}</div>` : '';
    const gw = 1280 - W - 84, gh = 170, X = t => 40 + t / D * (gw - 50), Y = v => 10 + (1 - v) * (gh - 40);
    let g = `<svg width="${gw}" height="${gh}" font-family="Inter,Arial"><line x1="40" x2="${gw - 10}" y1="${Y(0)}" y2="${Y(0)}" stroke="#ccc"/><line x1="40" x2="${gw - 10}" y1="${Y(1)}" y2="${Y(1)}" stroke="#eee"/>
      <text x="34" y="${Y(1) + 4}" font-size="12" fill="#8a8984" text-anchor="end">100 %</text><text x="34" y="${Y(0) + 4}" font-size="12" fill="#8a8984" text-anchor="end">0</text>
      <text x="40" y="${gh - 8}" font-size="12" fill="#8a8984">0</text><text x="${gw - 10}" y="${gh - 8}" font-size="12" fill="#8a8984" text-anchor="end">${fmt(D)}</text>
      <polyline fill="none" stroke="#2f6fd0" stroke-width="2.5" points="${serie.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/></svg>`;
    const fase = h.fin ? 2 : h.t < Math.min(5, D) ? 0 : 1, texto = textos[Math.min(fase, textos.length - 1)];
    const der = `<div class="lb">Lleva en marcha</div><div class="reloj">${fmt(h.t)}</div><div class="vel">${h.fin ? (parado ? 'parado' : 'sigue') : h.v === 1 ? 'velocidad normal' : 'cámara rápida ×' + h.v}</div>
      ${rpm}<div class="lb">Energía que le queda</div><div class="pc">${(100 * q).toFixed(q > 0.99 ? 2 : 0).replace('.', ',')} %</div><div class="bar"><i style="width:${(100 * q).toFixed(1)}%"></i></div><div class="lb" style="margin-top:14px">Cómo se le va la energía</div>${g}`;
    await page.evaluate(([t, s, dd, x]) => { document.getElementById('tit').textContent = t; document.getElementById('esc').innerHTML = s; document.getElementById('der').innerHTML = dd; document.getElementById('tx').innerHTML = x; }, [titulo, svg, der, texto]);
    await page.screenshot({ path: path.join(dir, `f${String(k++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
  }
  await br.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${out}`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(k, 'fotogramas →', out);
})();
