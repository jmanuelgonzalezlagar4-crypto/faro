// Vídeo de la pista de aceleración con imanes, vista desde arriba. Uso: node video.js elegidas.json [salida.mp4]
//  1. Sin rozamiento: el móvil acelera al entrar en los imanes y frena al salir; la velocidad en cada punto de la
//     vuelta se dibuja vuelta tras vuelta y sale siempre la misma curva.
//  2. Con el roce de rodar: la misma pista con imanes y sin imanes, lado a lado, hasta que se paran.
//  3. Lo que sale en las 2.000 pistas.
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const { monta } = require('./pista.js'), { dibuja, ventana } = require('./dibujo.js');
const sel = JSON.parse(fs.readFileSync(process.argv[2] || path.join(__dirname, 'elegidas.json'), 'utf8'));
const out = process.argv[3] || path.join(__dirname, 'pista.mp4'), FPS = 30, coma = (v, n = 2) => v.toFixed(n).replace('.', ',');
// gráfica de velocidad contra el sitio de la vuelta (0° = justo antes de los imanes)
function grafica(vueltas, W, H, vmax, arco) {
  const L = 46, B = 34, X = a => (L + a / 360 * (W - L - 10)).toFixed(1), Yv = v => (H - B - v / vmax * (H - B - 10)).toFixed(1);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Inter,Helvetica,Arial,sans-serif"><rect width="${W}" height="${H}" fill="#fcfcfb"/>`;
  s += `<rect x="${X(30)}" y="10" width="${(+X(30 + arco) - +X(30)).toFixed(1)}" height="${H - B - 10}" fill="#f6e3dc"/>`;
  for (let v = 0; v <= vmax + 1e-9; v += vmax / 4) s += `<line x1="${L}" x2="${W - 10}" y1="${Yv(v)}" y2="${Yv(v)}" stroke="#e8e7e2"/><text x="${L - 6}" y="${+Yv(v) + 4}" font-size="12" fill="#52514e" text-anchor="end">${coma(v, 1)}</text>`;
  for (let a = 0; a <= 360; a += 90) s += `<text x="${X(a)}" y="${H - B + 16}" font-size="12" fill="#52514e" text-anchor="middle">${a}°</text>`;
  s += `<text x="${W / 2}" y="${H - 4}" font-size="12.5" fill="#52514e" text-anchor="middle">sitio de la vuelta (la zona rosa es donde están los imanes)</text>`;
  s += `<text x="12" y="${(H - B) / 2}" font-size="12.5" fill="#52514e" transform="rotate(-90 12 ${(H - B) / 2})" text-anchor="middle">m/s</text>`;
  vueltas.forEach((pts, i) => { if (pts.length < 2) return; s += `<polyline points="${pts.map(p => X(p[0]) + ',' + Yv(p[1])).join(' ')}" fill="none" stroke="${i === vueltas.length - 1 ? '#2a78d6' : '#9fbfe8'}" stroke-width="${i === vueltas.length - 1 ? 2.2 : 1.4}"/>`; });
  return s + '</svg>';
}
function sigue(M) { const b = M.b, a = Math.atan2(b.y, b.x); let da = a - M._prev; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; M._prev = a; M._giro += da; return M._giro; }
function nuevo(o) { const M = monta(o); M._prev = Math.atan2(M.b.y, M.b.x); M._giro = 0; return M; }
(async () => {
  const dir = out.replace(/\.mp4$/, '-f'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:14px;font-size:24px;font-weight:700}#t{position:absolute;right:28px;top:18px;font-size:17px;color:#b3361b;font-weight:600}
    #pan{position:absolute;left:28px;top:56px;display:flex;gap:24px;align-items:flex-start}.et{font-size:16px;font-weight:600;margin-bottom:4px}.cnt{font-size:15px;color:#52514e;margin-top:6px;line-height:1.4}
    #img{position:absolute;left:28px;top:58px;width:1224px}#tx{position:absolute;left:28px;right:28px;bottom:14px;font-size:18px;line-height:1.38;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:10px 16px}</style>
    <div id="tit"></div><div id="t"></div><div id="pan"></div><img id="img"><div id="tx"></div>`);
  let n = 0;
  const foto = async (tit, t, pan, im, tx) => { await page.evaluate(([a, b, c, d, e]) => { document.getElementById('tit').textContent = a; document.getElementById('t').textContent = b; document.getElementById('pan').innerHTML = c;
    const i = document.getElementById('img'); if (d) { i.src = d; i.style.display = 'block'; } else i.style.display = 'none'; document.getElementById('tx').textContent = e; }, [tit, t, pan, im, tx]);
    await page.screenshot({ path: path.join(dir, `f${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 }); };
  // 1. sin rozamiento
  for (const e of sel.ideal) {
    const M = nuevo(Object.assign({}, e.o, { ideal: true })), vueltas = [[]], arco = e.o.arco;
    const T = e.T || 8, dur = e.dur || 16;
    for (let i = 0; i < dur * FPS; i++) {
      const ts = T * (i + 1) / (dur * FPS);
      while (M.w.t < ts) { M.w.step(); const g = sigue(M), k = Math.floor(g / (2 * Math.PI)); while (vueltas.length <= k) vueltas.push([]);
        const deg = ((g / (2 * Math.PI) - k) * 360); vueltas[k].push([deg, Math.hypot(M.b.vx, M.b.vy)]); }
      const v = Math.hypot(M.b.vx, M.b.vy), nv = Math.max(0, Math.floor(M._giro / (2 * Math.PI)));
      const pan = `<div><div class="et">${e.et}</div>${dibuja(M, 470)}<div class="cnt">Velocidad: <b>${coma(v)} m/s</b> · vueltas: <b>${nv}</b></div></div>
        <div><div class="et">Velocidad en cada sitio de la vuelta (azul fuerte: la vuelta de ahora)</div>${grafica(vueltas.map(p => p.filter((_, j) => j % 4 === 0)), 730, 470, e.vmax || 2, arco)}</div>`;
      await foto('Pista de aceleración con imanes, sin rozamiento', `t = ${coma(ts, 1)} s`, pan, null, e.tx);
    }
  }
  // 2. con roce: con imanes y sin imanes
  const e = sel.real, A = nuevo(e.o), Bm = nuevo(Object.assign({}, e.o, { sinImanes: true })), T = e.T || 120, dur = e.dur || 20, LA = ventana(A);
  for (let i = 0; i < (dur + 4) * FPS; i++) {
    const ts = Math.min(T, T * (i + 1) / (dur * FPS));
    const pan = [[A, 'Con imanes'], [Bm, 'La misma pista sin imanes']].map(([M, et]) => { while (M.w.t < ts && !M._para) { M.w.step(); sigue(M); if (Math.hypot(M.b.vx, M.b.vy) < 0.003) { M._q = (M._q || 0) + M.w.dt; if (M._q > 1) M._para = M.w.t; } else M._q = 0; }
      const v = Math.hypot(M.b.vx, M.b.vy); return `<div><div class="et">${et}</div>${dibuja(M, 470, { L: LA })}<div class="cnt">Velocidad: <b>${coma(v)} m/s</b> · vueltas: <b>${coma(M._giro / (2 * Math.PI), 1)}</b>${M._para ? ' · <b style="color:#b3361b">parada a los ' + coma(M._para, 0) + ' s</b>' : ''}</div></div>`; }).join('');
    await foto('Con el roce de rodar', `t = ${coma(ts, 0)} s (×${coma(T / dur, 0)})`, pan, null, i < dur * FPS ? e.tx : e.fin);
  }
  // 3. resumen
  const img = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'barrido.png')).toString('base64');
  for (let i = 0; i < 9 * FPS; i++) await foto('1.597 pistas al azar', '', '', img, sel.resumen);
  await br.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${out}`);
  fs.rmSync(dir, { recursive: true, force: true }); console.log(n, 'fotogramas →', out);
})();
