// Vídeo de la rampa de Wilkins en el banco: tres casos lado a lado.
// Uso: node video.js salida.mp4
const path = require('path'), fs = require('fs'), { execSync } = require('child_process'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { dibuja } = require('../busqueda-101/dibujo.js');
const out = process.argv[2] || path.join(__dirname, 'wilkins.mp4'), FPS = 30;
const CASOS = [
  { et: 'Como en la foto: imán de ferrita, bola soltada donde está en la foto', o: { grado: 'ferrita', tam: 0.286 } },
  { et: 'Con un empujón de 2 m/s al pie, como si viniera del gancho', o: { salida: 'pie', v0: 2, grado: 'ferrita', tam: 0.286 } },
  { et: 'Con el agujero más abajo, un imán mayor y sin rozamiento', o: { grado: 'ferrita', tam: 0.333, ang: 90, magX: 720, magY: 214, agujero: 1056, rb: 0.0193, salida: 'pie', v0: 2.05, ideal: true, mat: 'acero' } }];
function monta(o) { const d = require('./wilkins-foto.js')(P, o); d.dt = 1 / 1920; const info = P.build(d), w = info.world, b = info.bodyOf[d._ids.bola];
  if (o.v0) { const p = d.parts.find(q => q.id === d._ids.bola); b.vx = p.vx0; b.vy = p.vy0; b.w = o.v0 / p.r; w.ledger.E0 = w.energy().E; } return { d, info, w, b }; }
const k = 0.000715, win = [280 * k, 1960 * k, -10 * k, 1000 * k], W = 400;
const pilar = (svg) => { const S = W / (win[1] - win[0]), X = x => ((x * k - win[0]) * S).toFixed(1), Y = y => ((win[3] - (1000 - y) * k) * S).toFixed(1);
  // el pilar detrás, y el imán rojo encima con su placa de acero a la derecha (el banco lo dibuja muy pequeño)
  const iman = `<rect x="${X(570)}" y="${Y(95)}" width="${(400 * k * S).toFixed(1)}" height="${(150 * k * S).toFixed(1)}" rx="3" fill="#d94032"/><rect x="${X(920)}" y="${Y(95)}" width="${(50 * k * S).toFixed(1)}" height="${(150 * k * S).toFixed(1)}" fill="#3a3f45"/>`;
  return svg.replace(/(<rect width="[^"]*" height="[^"]*" fill="[^"]*"\/>)/, `$1<rect x="${X(310)}" y="${Y(250)}" width="${(550 * k * S).toFixed(1)}" height="${(750 * k * S).toFixed(1)}" fill="#dcd8cf" stroke="#b9b3a6"/>`).replace('</svg>', iman + '</svg>'); };
const tramos = [{ dur: 3, t: f => 0, tx: 'La rampa de John Wilkins (1648), tal como sale en su captura. El imán de arriba atrae la bola de acero rampa arriba; antes de llegar, la bola cae por el agujero, baja por la curva y el gancho la tendría que dejar otra vez al pie.' },
  { dur: 9, t: f => 1.5 * f, vel: 'cámara lenta ×6', tx: 'A la izquierda, el imán está demasiado lejos: la bola rueda cuesta abajo y cae por el pie de la rampa. En el centro, con un empujón, llega arriba, pero el imán la atrae y se queda pegada. A la derecha, con el agujero más abajo, cae por él y baja por la curva, pero no le queda fuerza para subir el gancho.' },
  { dur: 5, t: f => 1.5 + 4.5 * f, vel: 'velocidad normal', tx: 'Después, las bolas que han caído se quedan en el fondo de la curva, yendo y viniendo cada vez menos, y la del centro sigue pegada al imán. Ninguna vuelve a subir por la rampa.' },
  { dur: 4, t: f => 6, tx: 'De 2.000 variantes con la forma de su dibujo (imán, agujero, bola, empujón, con y sin roce), ninguna sube la rampa dos veces. La que más se acerca, una bola pequeña sin rozamiento, vuelve al pie una vez y ahí se queda: lo que el imán ayuda al subir lo quita al bajar.' }];
(async () => {
  const dir = out.replace(/\.mp4$/, '-f'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const M = CASOS.map(c => Object.assign({ c }, monta(c.o)));
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:16px;font-size:24px;font-weight:700}#t{position:absolute;right:28px;top:20px;font-size:18px;color:#b3361b;font-weight:600}
    #pan{position:absolute;left:28px;top:90px;display:flex;gap:16px}.p{width:400px}.et{font-size:14px;color:#52514e;font-weight:600;height:38px}.p svg{border-radius:6px}.cnt{font-size:16px;margin-top:6px}
    #tx{position:absolute;left:28px;right:28px;bottom:18px;font-size:19px;line-height:1.4;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:12px 16px}</style>
    <div id="tit">La rampa de Wilkins de su captura, en el banco</div><div id="t"></div><div id="pan"></div><div id="tx"></div>`);
  let n = 0;
  for (const tr of tramos) for (let i = 0; i < tr.dur * FPS; i++) {
    const ts = tr.t(i / (tr.dur * FPS));
    const html = M.map(m => { while (m.w.t < ts - 1e-9) m.w.step(); const svg = pilar(dibuja(m.w, m.info, m.d, win, W, []));
      const v = Math.hypot(m.b.vx, m.b.vy); return `<div class="p"><div class="et">${m.c.et}</div>${svg}<div class="cnt">Velocidad de la bola: <b>${v.toFixed(2).replace('.', ',')} m/s</b></div></div>`; }).join('');
    await page.evaluate(([h, t, x]) => { document.getElementById('pan').innerHTML = h; document.getElementById('t').textContent = t; document.getElementById('tx').textContent = x; }, [html, (tr.vel ? tr.vel + ' · ' : '') + `t = ${ts.toFixed(2).replace('.', ',')} s`, tr.tx]);
    await page.screenshot({ path: path.join(dir, `f${String(n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
  }
  await br.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${out}`);
  fs.rmSync(dir, { recursive: true, force: true }); console.log(n, 'fotogramas →', out);
})();
