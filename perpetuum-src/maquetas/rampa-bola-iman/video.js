// Vídeo de la rampa con imán y bola imantada: tres casos del barrido, lado a lado. Uso: node video.js [salida.mp4]
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const { monta } = require('./rampa.js'), { dibuja, ventana } = require('./dibujo.js');
const out = process.argv[2] || path.join(__dirname, 'rampa.mp4'), FPS = 30, coma = (v, n = 2) => v.toFixed(n).replace('.', ',');
const R = fs.readFileSync(path.join(__dirname, 'barrido.jsonl'), 'utf8').trim().split('\n').map(JSON.parse), o = n => R.find(r => r.n === n).o;
const CASOS = [
  { n: 2492, et: 'La mejor: con roce y un empujón al empezar' },
  { n: 1364, et: 'Sin empujón: la que más se acerca (sin rozamiento)' },
  { n: 723, et: 'Lo que pasa a menudo: se pega al imán' }];
const tramos = [
  { dur: 5, t: f => 0, tx: 'Con el gancho corregido: lo alto del gancho queda por encima del principio de la rampa, con sitio para la bola entre los dos, y debajo del hueco hay una recogida curva que la manda hacia el gancho sin golpe.' },
  { dur: 12, t: f => 2.4 * f, vel: 'cámara lenta ×5', tx: 'Arriba a la izquierda: con un empujón de 0,83 m/s, cae, da la vuelta por el gancho y vuelve a la rampa, pero sube solo 5 cm y se vuelve. Arriba a la derecha: sin empujón, le faltan 36 mm para pasar el gancho. Abajo: la bola salta el hueco y se pega al imán.' },
  { dur: 5, t: f => 2.4 + 4.6 * f, vel: 'velocidad normal', tx: 'Las dos de arriba se quedan yendo y viniendo por abajo. Ninguna vuelve a llegar al hueco.' },
  { dur: 7, t: f => 7, tx: 'En 3.000 rampas con el gancho bien hecho, 5 bolas vuelven a la rampa una vez, todas con un empujón al empezar, y ninguna cae otra vez por el hueco. Al caer, la bola tiene que cambiar el sentido en que gira y pierde mucho; y lo que el imán le da al acercarse se lo quita al alejarse.' }];
(async () => {
  const dir = out.replace(/\.mp4$/, '-f'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const M = CASOS.map(c => { const S = monta(o(c.n)); return Object.assign({ c, S, win: ventana(S) }); });
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:14px;font-size:24px;font-weight:700}#t{position:absolute;right:28px;top:18px;font-size:17px;color:#b3361b;font-weight:600}
    #pan{position:absolute;left:28px;top:58px;width:1230px;display:flex;flex-wrap:wrap;gap:10px 24px;align-items:flex-start}.p{width:600px}.et{font-size:15px;font-weight:600;height:22px}.p svg{border-radius:6px;display:block;width:600px;height:auto;max-height:250px;object-fit:contain}.cnt{font-size:14px;margin-top:4px;color:#52514e}
    #tx{position:absolute;left:28px;right:28px;bottom:14px;font-size:18px;line-height:1.38;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:10px 16px}</style>
    <div id="tit">Rampa con imán y bola imantada, en el banco</div><div id="t"></div><div id="pan"></div><div id="tx"></div>`);
  let n = 0;
  for (const tr of tramos) for (let i = 0; i < tr.dur * FPS; i++) {
    const ts = tr.t(i / (tr.dur * FPS));
    const html = M.map(m => { while (m.S.w.t < ts - 1e-9) m.S.w.step(); const v = Math.hypot(m.S.b.vx, m.S.b.vy);
      return `<div class="p"><div class="et">${m.c.et}</div>${dibuja(m.S, 600, m.win)}<div class="cnt">Pista nº ${m.c.n} · velocidad <b>${coma(v)} m/s</b></div></div>`; }).join('');
    await page.evaluate(([h, t, x]) => { document.getElementById('pan').innerHTML = h; document.getElementById('t').textContent = t; document.getElementById('tx').textContent = x; }, [html, (tr.vel ? tr.vel + ' · ' : '') + `t = ${coma(ts)} s`, tr.tx]);
    await page.screenshot({ path: path.join(dir, `f${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
  }
  await br.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${out}`);
  fs.rmSync(dir, { recursive: true, force: true }); console.log(n, 'fotogramas →', out);
})();
