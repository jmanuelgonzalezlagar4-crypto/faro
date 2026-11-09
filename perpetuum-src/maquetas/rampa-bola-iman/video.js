// Vídeo de la rampa con imán y bola imantada: tres casos del barrido, lado a lado. Uso: node video.js [salida.mp4]
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const { monta } = require('./rampa.js'), { dibuja, ventana } = require('./dibujo.js');
const out = process.argv[2] || path.join(__dirname, 'rampa.mp4'), FPS = 30, coma = (v, n = 2) => v.toFixed(n).replace('.', ',');
const R = fs.readFileSync(path.join(__dirname, 'barrido.jsonl'), 'utf8').trim().split('\n').map(JSON.parse), o = n => R.find(r => r.n === n).o;
const CASOS = [
  { n: 1453, et: 'Sin empujón: la única que llega al gancho' },
  { n: 1289, et: 'Con un empujón: la que más se acerca' },
  { n: 2594, et: 'Lo que pasa a menudo: se pega al imán' }];
const tramos = [
  { dur: 4, t: f => 0, tx: 'Como la pidió: el imán atrae la bola imantada por una rampa poco inclinada; antes de llegar hay un hueco, cae a una rampa de vuelta que baja hacia el principio y un gancho tendría que subirla otra vez al pie de la rampa.' },
  { dur: 10, t: f => 2 * f, vel: 'cámara lenta ×5', tx: 'Arriba a la izquierda: sin empujón (y sin rozamiento), la única de 3.000 que llega al gancho; sube hasta la mitad: le faltan 67 mm. Arriba a la derecha: con un empujón de 0,93 m/s, la que más se acerca: le faltan 11 mm. Abajo: el imán es tan fuerte que la bola salta el hueco y se pega.' },
  { dur: 4, t: f => 2 + 3 * f, vel: 'velocidad normal', tx: 'Las dos de arriba se quedan yendo y viniendo en el fondo del gancho. Ninguna vuelve a subir la rampa.' },
  { dur: 7, t: f => 5, tx: 'En 3.000 rampas al azar, 607 bolas caen por el hueco; 141 llegan al gancho (solo una sin empujón) y ninguna vuelve a la rampa: la que más se acerca se queda a 11 mm. Al alejarse del imán por abajo, el imán tira de ella hacia atrás: lo que le dio al acercarse se lo quita al alejarse.' }];
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
