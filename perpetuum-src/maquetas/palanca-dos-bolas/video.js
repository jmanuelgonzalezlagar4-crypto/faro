// Vídeo de la palanca de la captura en el banco: las dos mitades de la vuelta, con un contrapeso ligero y con uno
// pesado. Uso: node video.js [salida.mp4]
const path = require('path'), fs = require('fs'), { execSync } = require('child_process'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { monta, enCazo } = require('./prueba.js'), { thD } = require('./geo.js'), { dibuja } = require('./dibujo.js');
const out = process.argv[2] || path.join(__dirname, 'palanca.mp4'), FPS = 30, th = thD(), G = 9.81;
const win = [-190, 100, -8, 200], PW = 600;
const coma = (v, n = 1) => v.toFixed(n).replace('.', ',');
// A: arriba, con la bola en la cazoleta. B: abajo, con la bola llegando por los raíles con toda la velocidad que puede traer.
function montaA(mw) { const o = { mw, a0: 0, bola: 'cazo', pegada: true, thD: th, cazo: [60, 37.5] }; const m = monta(o); return Object.assign(m, { bola: () => enCazo(o, m.giro()) }); }
function montaB(mw) {
  const base = { mw, a0: th, bola: 'raíl', x0: -158, thD: th, cazo: [60, 37.5] };
  const d0 = require('./palanca.js')(P, Object.assign({}, base, { v0: 0 })), p0 = d0.parts.find(q => q.id === d0._ids.bola);
  const v0 = Math.sqrt(10 / 7 * G * Math.max(0, enCazo(base, th)[1] - p0.y * 1000) / 1000);
  const m = monta(Object.assign({}, base, { v0 })); return Object.assign(m, { bola: () => [m.b.x * 1000, m.b.y * 1000] });
}
const ESC = [
  { mw: 0.008, tit: 'Con un contrapeso ligero, de 8 g',
    txA: 'La palanca baja sola y sube la bola 41 mm.', txB: 'La bola levanta la curva solo un poco y se queda atascada debajo.',
    fin: 'La palanca necesita 10,5 mJ para volver arriba vacía; la bola, bajando desde donde la dejó la cazoleta, trae como mucho 8,2 mJ, y casi todo se le va en el golpe contra la curva.' },
  { mw: 0.030, tit: 'Con un contrapeso pesado, de 30 g',
    txA: 'Ahora la palanca no se mueve: pesa más el lado del contrapeso con la bola.', txB: 'La bola sí devuelve la palanca arriba: solo le hacen falta 0,5 mJ.',
    fin: 'Para que la palanca suba la bola, tiene que necesitar al volver arriba más de lo que cuesta subir la bola (el 107 % o más). Para que la bola la devuelva, mucho menos (el 14 % o menos).' }];
(async () => {
  const dir = out.replace(/\.mp4$/, '-f'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, f)).toString('base64');
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:14px;font-size:24px;font-weight:700}#t{position:absolute;right:28px;top:18px;font-size:17px;color:#b3361b;font-weight:600}
    #pan{position:absolute;left:28px;top:58px;display:flex;gap:24px}.p{width:${PW}px}.et{font-size:16px;font-weight:600;height:24px}.p svg{border-radius:6px;display:block}.cnt{font-size:15px;margin-top:5px;color:#52514e;height:40px}
    #img{position:absolute;left:28px;top:58px;width:1224px}
    #tx{position:absolute;left:28px;right:28px;bottom:14px;font-size:18px;line-height:1.38;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:10px 16px}</style>
    <div id="tit"></div><div id="t"></div><div id="pan"></div><img id="img"><div id="tx"></div>`);
  let n = 0;
  const foto = async (tit, t, pan, im, tx) => {
    await page.evaluate(([a, b, c, d, e]) => { document.getElementById('tit').textContent = a; document.getElementById('t').textContent = b; document.getElementById('pan').innerHTML = c;
      const i = document.getElementById('img'); if (d) { i.src = d; i.style.display = 'block'; } else i.style.display = 'none'; document.getElementById('tx').textContent = e; }, [tit, t, pan, im, tx]);
    await page.screenshot({ path: path.join(dir, `f${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
  };
  // 1. cómo entiendo la captura
  const fig = img('como-lo-entiendo.png');
  for (let i = 0; i < 7 * FPS; i++) await foto('La palanca de su captura, en el banco', '', '', fig,
    'Así lo entiendo: con la bola en la cazoleta, el brazo largo baja y la sube; la bola vuelve por encima del brazo, cae junto al tope y, al bajar por los raíles, empuja la curva hacia arriba y devuelve la palanca a su sitio. Pruebo cada mitad por separado, con la mejor ayuda posible.');
  // 2 y 3. contrapeso ligero y pesado
  for (const e of ESC) {
    const a = montaA(e.mw), b = montaB(e.mw);
    const tramos = [{ dur: 7, t: f => 1.6 * f, vel: 'cámara lenta ×4' }, { dur: 2, t: f => 1.6 + 1.4 * f, vel: 'velocidad normal' }, { dur: 5, t: f => 3, vel: '' }];
    for (const tr of tramos) for (let i = 0; i < tr.dur * FPS; i++) {
      const ts = tr.t(i / (tr.dur * FPS)), fin = tr.vel === '';
      const pan = [[a, 'La palanca baja y sube la bola', e.txA], [b, 'La bola pasa por debajo de la curva', e.txB]].map(([m, et, tx]) => {
        while (m.w.t < ts - 1e-9) m.w.step();
        const g = m.giro(), svg = dibuja(win, PW, g, [m.bola()]).svg;
        return `<div class="p"><div class="et">${et}</div>${svg}<div class="cnt">Giro de la palanca: <b>${coma(Math.max(0, g), 0)}°</b> (0° arriba, ${coma(th, 0)}° abajo)${fin ? '<br><b style="color:#0b0b0b">' + tx + '</b>' : ''}</div></div>`; }).join('');
      await foto(e.tit, (tr.vel ? tr.vel + ' · ' : '') + `t = ${coma(ts, 2)} s`, pan, null, fin ? e.fin : (e.mw < 0.02
        ? 'Izquierda: arriba, como en la foto, con la bola en la cazoleta. Derecha: abajo, con la bola llegando por los raíles con toda la velocidad que gana desde donde la dejó la cazoleta, sin perder nada por el camino.'
        : 'Lo mismo, con más peso en el contrapeso blanco.'));
    }
  }
  // 4. las 2.000 variantes
  const graf = img('barrido.png');
  for (let i = 0; i < 9 * FPS; i++) await foto('2.000 variantes', '', '', graf,
    'Las dos cosas a la vez no pueden pasar: la bola tendría que devolver a la palanca más energía de la que costó subirla. En el banco devuelve como mucho el 14 %; el resto se va en el golpe contra la curva, en roces y en la velocidad con la que llega a la cazoleta.');
  await br.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${out}`);
  fs.rmSync(dir, { recursive: true, force: true }); console.log(n, 'fotogramas →', out);
})();
