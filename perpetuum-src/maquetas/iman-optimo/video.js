// Vídeo: el disco con imanes al lado del mismo disco sin imanes, visto desde arriba, hasta que se paran.
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const { monta } = require('./disco.js'), { dibuja } = require('../busqueda-101/dibujo.js');
const o = JSON.parse(process.argv[2]), out = process.argv[3], FPS = 30;
const M = [Object.assign({ et: `Con ${o.n} imanes` }, monta(o)), Object.assign({ et: 'El mismo disco, sin imanes' }, monta(Object.assign({}, o, { n: 0 })))];
M.forEach(m => { m.giro = 0; m.prev = Math.atan2(m.b.y, m.b.x); m.K0 = m.w.kinetic(); m.serie = []; m.fin = null; });
const Rv = o.R + o.sep + o.tam + 0.04, win = [-Rv, Rv, -Rv, Rv], W = 380;
// horario: 8 s a velocidad normal y luego ×4 hasta que se paren los dos
const sigue = () => M.some(m => !m.fin);
(async () => {
  const dir = out.replace(/\.mp4$/, '-f'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:14px;font-size:23px;font-weight:700}#t{position:absolute;right:28px;top:18px;font-size:18px;color:#b3361b;font-weight:600}
    #pan{position:absolute;left:28px;top:56px;display:flex;gap:22px}.p{width:${W}px}.et{font-size:16px;font-weight:700;margin-bottom:4px}.p svg{border-radius:8px}.c{font-size:16px;margin-top:6px;line-height:1.5}
    #g{position:absolute;left:${2 * W + 78}px;top:84px}#tx{position:absolute;left:28px;right:28px;bottom:16px;font-size:18px;line-height:1.4;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:10px 16px}</style>
    <div id="tit">Bola de acero en un disco horizontal con imanes, vista desde arriba</div><div id="t"></div><div id="pan"></div><div id="g"></div><div id="tx"></div>`);
  let k = 0, t = 0;
  let hold = 0;
  while (true) {
    const v = t < 8 ? 1 : 4; t += v / FPS;
    for (const m of M) { if (m.fin) continue;
      while (m.w.t < t - 1e-9) { m.w.step(); const a = Math.atan2(m.b.y, m.b.x); let da = a - m.prev; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; m.prev = a; m.giro += da;
        if (Math.hypot(m.b.vx, m.b.vy) < 0.003) { m.q = (m.q || 0) + m.w.dt; if (m.q > 1) { m.fin = m.w.t; break; } } else m.q = 0;
        if (m.w.isStopped()) { m.fin = m.w.t; break; } }
      m.serie.push([m.w.t, Math.hypot(m.b.vx, m.b.vy)]); }
    const html = M.map(m => { let svg = dibuja(m.w, m.info, m.d, win, W, []); const S = W / (2 * Rv), c = W / 2;
      svg = svg.replace(/(<rect width="[^"]*" height="[^"]*" fill="[^"]*"\/>)/, `$1<circle cx="${c}" cy="${c}" r="${((o.R + o.rb + 0.003) * S).toFixed(1)}" fill="none" stroke="#c9c4b8" stroke-width="3"/><circle cx="${c}" cy="${c}" r="${((o.R - o.rb - 0.003) * S).toFixed(1)}" fill="none" stroke="#c9c4b8" stroke-width="3"/>`);
      const q = Math.max(0, m.w.kinetic() / m.K0);
      return `<div class="p"><div class="et">${m.et}</div>${svg}<div class="c">Vueltas: <b>${(m.giro / 2 / Math.PI).toFixed(1).replace('.', ',')}</b> · velocidad <b>${Math.hypot(m.b.vx, m.b.vy).toFixed(2).replace('.', ',')} m/s</b><br>Energía que le queda: <b>${Math.round(100 * q)} %</b>${m.fin ? ` · <b style="color:#b3361b">parada a los ${m.fin.toFixed(0)} s</b>` : ''}</div></div>`; }).join('');
    const T = 100, gw = 1280 - 2 * W - 110, gh = 300, X = s => 40 + s / T * (gw - 50), Y = vv => 16 + (1 - vv / 1.3) * (gh - 50);
    const g = `<div style="font-size:15px;font-weight:600;margin-bottom:4px">Velocidad de la bola</div><svg width="${gw}" height="${gh}" font-family="Inter,Arial"><line x1="40" x2="${gw - 10}" y1="${Y(0)}" y2="${Y(0)}" stroke="#ccc"/><text x="34" y="${Y(1) + 4}" font-size="12" fill="#8a8984" text-anchor="end">1 m/s</text><text x="34" y="${Y(0) + 4}" font-size="12" fill="#8a8984" text-anchor="end">0</text><text x="${gw - 10}" y="${gh - 6}" font-size="12" fill="#8a8984" text-anchor="end">${T} s</text>
      ${M.map((m, i) => `<polyline fill="none" stroke="${i ? '#2f6fd0' : '#d94032'}" stroke-width="2" points="${m.serie.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/>`).join('')}</svg>
      <div style="font-size:13px;margin-top:4px"><span style="color:#d94032;font-weight:700">—</span> con imanes &nbsp; <span style="color:#2f6fd0;font-weight:700">—</span> sin imanes</div>`;
    const tx = t < 8 ? 'Las dos bolas salen a 1 m/s por un canal perfecto: solo rozan con el fondo y con el aire. A la izquierda, tres imanes de neodimio la atraen al pasar: se acelera al acercarse y se frena al alejarse.' :
      sigue() ? 'Cada imán le da al acercarse lo mismo que le quita al alejarse: por eso la línea roja se ondula, pero baja igual que la azul. Las dos pierden lo mismo por el roce del fondo.' : 'Al final, la bola con imanes se queda atrapada junto a un imán, yendo y viniendo, y da 1,3 vueltas menos. En 800 discos distintos, los imanes nunca añadieron ni una vuelta: el mejor diseño es el que menos roza.';
    await page.evaluate(([h, gg, tt, x]) => { document.getElementById('pan').innerHTML = h; document.getElementById('g').innerHTML = gg; document.getElementById('t').textContent = tt; document.getElementById('tx').textContent = x; }, [html, g, `${t < 8 ? 'velocidad normal' : 'cámara rápida ×4'} · t = ${Math.min(t, Math.max(...M.map(m => m.w.t))).toFixed(1).replace('.', ',')} s`, tx]);
    await page.screenshot({ path: path.join(dir, `f${String(k++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
    if (!sigue()) { hold++; if (hold > 3 * FPS) break; }
    if (t > 400) break;
  }
  await br.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${out}`);
  fs.rmSync(dir, { recursive: true, force: true }); console.log(k, 'fotogramas →', out);
})();
