// La imagen de la segunda versión: las fotos (si se pasa su carpeta), el banco puesto igual y lo que hace al soltarlo.
const fs = require('fs'), path = require('path'), escena = require('./escena2.js');
const dirF = process.argv[2];
const fig = (src, cap, wdt) => `<figure style="margin:0;width:${wdt}px"><div style="border-radius:6px;overflow:hidden;line-height:0">${src}</div><figcaption>${cap}</figcaption></figure>`;
const foto = (f, cap) => dirF ? fig(`<img src="data:image/jpeg;base64,${fs.readFileSync(path.join(dirF, f)).toString('base64')}" style="width:520px;display:block">`, cap, 520) : '';
const grados = a => a.toFixed(0).replace('-', '−') + '°';
const recta = escena({}, [0, 3], 560), uve = escena({ uve: true }, [0, 0.15, 0.3, 0.5, 3], 560);
// tabla por peso del contrapeso (resultados2.jsonl)
const R = fs.readFileSync(path.join(__dirname, 'resultados2.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(r => !r.por && r.recta.valido && r.V.valido && !r.recta.cae && !r.V.cae);
const bins = [[0, 10], [10, 20], [20, 30], [30, 50], [50, 80], [80, 150]];
const filas = bins.map(([a, b]) => { const s = R.filter(r => r.o.mc * 1000 >= a && r.o.mc * 1000 < b); return [`${a} a ${b} g`, s.length, s.filter(r => r.recta.aV >= 1).length, s.filter(r => r.V.aArriba >= 1).length]; });
const pct = (k, n) => n ? Math.round(100 * k / n) : 0;
const barra = (k, n, c) => `<div style="display:flex;align-items:center;gap:8px"><div style="width:${Math.max(2, 2.2 * pct(k, n))}px;height:12px;border-radius:0 4px 4px 0;background:${c}"></div><span>${k} de ${n}</span></div>`;
const tabla = `<table><tr><th>Contrapeso</th><th>De la foto recta llegan a la V</th><th>De la V vuelven a la foto recta</th></tr>${filas.map(f => `<tr><td>${f[0]}</td><td>${barra(f[2], f[1], '#2a78d6')}</td><td>${barra(f[3], f[1], '#eb6834')}</td></tr>`).join('')}</table>`;
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;width:1160px;padding:28px 30px;box-sizing:border-box}
h1{font-size:24px;margin:0 0 6px}h2{font-size:18px;margin:28px 0 10px}p{margin:0 0 14px;color:#52514e;font-size:14px;line-height:1.4}figcaption{font-size:13px;color:#52514e;margin-top:6px;line-height:1.35}.row{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:14px}
table{border-collapse:collapse;font-size:13px;width:100%}th{text-align:left;color:#52514e;font-weight:600;padding:6px 8px;border-bottom:1px solid #ddd}td{padding:6px 8px;border-bottom:1px solid #eee;vertical-align:middle}</style>
<h1>El balancín de sus fotos, medido otra vez</h1>
<p>Medido sobre las fotos ampliadas, con la canica y la rueda negra (miden lo mismo) como regla: palo de dos pletinas de 21 mm, contrapeso de arandelas colgado de una anilla, rueda negra en la cara del palo, bisagra, rampa de 9,8 cm con su tubo negro al final, tira negra en la bandeja y bloque con goma al fondo. Contrapeso de 50 g y canica de 14 g.</p>
<div class="row">${foto('foto-recto.jpg', 'Su foto del palo recto.')}${fig(recta[0].svg, 'El banco puesto igual: palo recto, rampa colgando, canica contra el tubo negro y el contrapeso abajo.', 560)}</div>
<div class="row">${foto('foto-V.jpg', 'Su foto de la V.')}${fig(uve[0].svg, 'El banco puesto igual: la rueda en la tira negra, la rampa subiendo hasta el bloque, la canica en el fondo de la V y el contrapeso arriba.', 560)}</div>
<h2>Soltado desde la V: hace lo que usted explica</h2>
<div class="row">${fig(uve[1].svg, `0,15 s · palo a ${grados(uve[1].ang)}: el contrapeso gana y sube el palo.`, 540)}${fig(uve[2].svg, `0,3 s · palo a ${grados(uve[2].ang)}: la V se pone recta y la canica corre hacia la punta. Casi como la foto del palo recto.`, 540)}</div>
<div class="row">${fig(uve[3].svg, `0,5 s · palo a ${grados(uve[3].ang)}: la canica en la punta hace bajar el palo, pero la punta de la rampa cae en el bloque.`, 540)}${fig(uve[4].svg, `3 s · palo a ${grados(uve[4].ang)}: quieto. El bloque aguanta la rampa y la canica, y la V ya no se vuelve a formar.`, 540)}</div>
<h2>Soltado desde el palo recto: no llega a la V</h2>
<div class="row">${fig(recta[1].svg, `3 s · palo a ${grados(recta[1].ang)}: quieto en el mismo sitio. La punta de la rampa cae en el bloque enseguida.`, 540)}<p style="width:520px;margin-top:8px">Las dos fotos acaban en la misma postura, a medio camino: la punta de la rampa apoyada en el bloque y la canica en la punta. De la V a la foto recta va solo; de la foto recta a la V, no.</p></div>
<h2>1.000 variantes: contrapeso, taco negro, canica, escalón, rampa y altura del eje</h2>
<p>Cada una se suelta desde las dos fotos. Ninguna hace las dos cosas, y ninguna sigue moviéndose a los 20 s.</p>${tabla}`;
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1160, height: 800 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: path.join(__dirname, dirF ? 'medido-otra-vez-con-fotos.png' : 'medido-otra-vez.png'), fullPage: true }); await b.close(); })();
