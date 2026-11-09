// Vídeos de los 3 que más parecían dar: cómo funcionan y de dónde sale la energía de más.
// Uso: node videos.js carpeta_de_salida   (necesita ffmpeg)
const path = require('path'), fs = require('fs'), { execSync } = require('child_process'), A = path.join(__dirname, '../../app');
const E = require(A + '/engine.js'); global.PerpetuumEngine = E;
const P = require(A + '/build.js'), { diseno } = require('./corre.js'), { dibuja } = require('./dibujo.js');
const OUT = process.argv[2] || path.join(__dirname, 'videos'); fs.mkdirSync(OUT, { recursive: true });
const FPS = 30;
function mundo(fam, seed, n, mod) { const d = diseno(fam, seed, n); if (mod) mod(d); const info = P.build(d), w = info.world; return { d, info, w, L: w.ledger }; }
const exc = m => { const b = m.w.balance(), L = m.L; return 1000 * (-b.reserve + L.bus + L.gridOut - L.battery - L.hand - L.gridIn); };
const avanza = (m, t) => { while (m.w.t < t - 1e-9) m.w.step(); };
const apretadas = w => (w.contacts.length ? w.contacts : w.findContacts()).filter(c => !(c.A.isStatic && c.B.isStatic) && c.sep < -0.0019).map(c => ({ x: c.px, y: c.py }));
const enPlanos = d => { let k = 0; d.parts.filter(p => p.kind === 'pin' && p.a == null).forEach(pin => { k++; const bar = d.parts.find(p => p.id === pin.b); bar.plane = k; d.parts.filter(p => p.kind === 'pin' && p.a === bar.id).forEach(w => { const b = d.parts.find(q => q.id === w.b); if (b) b.plane = k; }); }); };
const num = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',');
const seg = t => t.toFixed(t < 1 ? 3 : 2).replace('.', ',');
// guion: lista de tramos { hasta (s de vídeo), sim: f(tVideo)->tSim, texto, nota }
function guion(tramos) { const frames = []; let t0 = 0; tramos.forEach(tr => { const n = Math.round((tr.dur) * FPS); for (let i = 0; i < n; i++) frames.push({ tr, f: i / n, tv: t0 + i / FPS }); t0 += tr.dur; }); return frames; }
const VIDEOS = [
  { nombre: '1-pendulos', titulo: '1. Tres péndulos con imanes y un muelle (nº 1942): parecía dar el 735,6 %',
    paneles: [{ etiqueta: 'Tal cual', m: () => mundo('pendulos', 1, 1942), marcas: true }, { etiqueta: 'Los mismos, sin poder tocarse (uno detrás de otro)', m: () => mundo('pendulos', 1, 1942, enPlanos) }],
    win: [-0.25, 0.75, 0.15, 0.9], W: 600,
    tramos: [
      { dur: 4, sim: f => 0, vel: '', texto: 'Tres péndulos cuelgan de ejes fijos (en amarillo). En la punta llevan imanes (rojo y azul) y un muelle une dos de ellos. El sorteo los dejó apoyados uno en otro: el círculo rojo marca dónde una pieza está metida en otra.' },
      { dur: 6, sim: f => 0.3 * f, vel: 'cámara lenta ×20', texto: 'El banco no deja que dos piezas estén una dentro de otra, así que las separa a empujones. Al separarlas sube los péndulos, y aparecen 64 milésimas de julio que nadie ha puesto.' },
      { dur: 6, sim: f => 0.3 + 5.7 * f, vel: 'velocidad normal', texto: 'Después solo se mueven un poco. La energía de más no crece: fue un empujón del banco al empezar, no una máquina que produzca energía. A la derecha, los mismos péndulos sin poder tocarse: 0.' },
      { dur: 2, sim: f => 6, vel: '', texto: 'En un aparato de verdad dos piezas no pueden estar una dentro de otra. Este no se puede construir.' }] },
  { nombre: '2-leva', titulo: '2. Leva con imanes y muelle (nº 1209): parecía dar el 147,4 %',
    paneles: [{ etiqueta: 'Tal cual', m: () => mundo('levaIman', 2, 1209), zoom: { cx: 0, cy: 0.4, r: 0.015, W: 230 } }],
    win: [-0.35, 0.35, 0.18, 0.72], W: 560,
    tramos: [
      { dur: 4, sim: f => 0, vel: '', texto: 'Una rueda de 2,7 kg que gira. Lleva soldada una leva (la pieza beige) que sube y baja una palanca con un imán. Un muelle tira de la palanca y hay imanes fijos al lado.' },
      { dur: 4, sim: f => 0, vel: '', texto: 'A la derecha, el eje visto de cerca: la cruz roja es el eje y el punto amarillo, el centro de la rueda. La rueda y la leva tienen cada una su eje y no encajan, así que el banco deja la rueda 10 mm fuera de su eje.' },
      { dur: 6, sim: f => 0.0125 * f, vel: 'cámara lenta ×480', texto: 'En el primer paso de cálculo (1/480 s) el banco acerca la rueda de golpe a su eje, de 10 mm a 4 mm. Con ese salto la rueda sube 4,8 mm, y eso mete 125 milésimas de julio de una vez.' },
      { dur: 7, sim: f => 0.0125 + 4 * f, vel: 'velocidad normal', texto: 'Después gira y la palanca sube y baja. La energía de más no crece; al contrario, va bajando, porque los golpes de la palanca contra sus topes pierden energía.' }] },
  { nombre: '3-muelle', titulo: '3. Rueda con imanes, bola en un muelle y péndulo (nº 508): parecía dar el 101,6 %',
    paneles: [{ etiqueta: 'Tal cual', m: () => mundo('mezcla', 2, 508), sorteo: 'p5' }, { etiqueta: 'La misma bola, sin poder tocar la rueda (va por delante)', m: () => mundo('mezcla', 2, 508, d => { d.parts.find(p => p.id === 'p5').plane = 3; }) }],
    win: [-0.02, 0.72, 0.12, 0.72], W: 600,
    tramos: [
      { dur: 4, sim: f => -1, vel: '', texto: 'Una rueda con dos imanes que gira, una bola de plomo colgada de un muelle (marrón) y un péndulo al lado. Así salió del sorteo: la bola, dentro de la rueda (círculo rojo). Eso no se puede construir.' },
      { dur: 3, sim: f => 0, vel: '', texto: 'El banco saca la bola fuera de la rueda antes de empezar. Pero el muelle sigue tirando de ella hacia dentro, así que la aprieta contra el borde de la rueda.' },
      { dur: 10, sim: f => 10 * f, vel: 'velocidad normal', texto: 'La bola roza la rueda mientras sube y baja. En cada paso el banco la separa un poco de la rueda y estira el muelle sin apuntarlo: la energía de más sube mientras roza y se para cuando deja de rozar. A la derecha, sin tocar la rueda: 0.' }] },
];
(async () => {
  const { chromium } = require('playwright'); const br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1280px;height:720px;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;overflow:hidden}
    #tit{position:absolute;left:28px;top:16px;font-size:24px;font-weight:700}#vel{position:absolute;right:28px;top:20px;font-size:18px;color:#b3361b;font-weight:600}
    #pan{position:absolute;left:28px;top:62px;display:flex;gap:24px}.p{display:flex;flex-direction:column;gap:6px}.et{font-size:15px;color:#52514e;font-weight:600}.cnt{font-size:22px;font-weight:700}.cnt.rojo{color:#b3361b}.cnt.verde{color:#127a4f}
    .p svg{border-radius:6px}#tx{position:absolute;left:28px;right:28px;bottom:18px;font-size:19px;line-height:1.4;background:#fff;border:1px solid #e3e2dc;border-radius:8px;padding:12px 16px}#ts{font-size:14px;color:#52514e;font-weight:400}</style>
    <div id="tit"></div><div id="vel"></div><div id="pan"></div><div id="tx"></div>`);
  for (const V of VIDEOS) {
    const dir = path.join(OUT, V.nombre); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const M = V.paneles.map(p => ({ p, m: p.m() })); const frames = guion(V.tramos); let k = 0;
    for (const fr of frames) {
      const ts = fr.tr.sim(fr.f);
      const html = M.map(({ p, m }) => {
        let svg;
        if (ts < 0 && p.sorteo) { const b = m.info.bodyOf[p.sorteo], q = m.d.parts.find(x => x.id === p.sorteo), sx = b.x, sy = b.y; b.x = q.x; b.y = q.y; b.updateWorld(); svg = dibuja(m.w, m.info, m.d, V.win, V.W, [{ x: q.x, y: q.y, r: 26 }]); b.x = sx; b.y = sy; b.updateWorld(); }
        else { avanza(m, Math.max(0, ts)); svg = dibuja(m.w, m.info, m.d, V.win, V.W, p.marcas ? apretadas(m.w) : []); }
        const e = ts < 0 ? 0 : exc(m), cls = e > 1 ? 'rojo' : 'verde';
        let extra = '';
        if (p.zoom) { const z = p.zoom; let zs = dibuja(m.w, m.info, m.d, [z.cx - z.r, z.cx + z.r, z.cy - z.r, z.cy + z.r], z.W, []); const S = z.W / (2 * z.r);
          zs = zs.replace('</svg>', `<line x1="${z.W / 2 - 18}" y1="${z.W / 2}" x2="${z.W / 2 + 18}" y2="${z.W / 2}" stroke="#d94032" stroke-width="2"/><line x1="${z.W / 2}" y1="${z.W / 2 - 18}" x2="${z.W / 2}" y2="${z.W / 2 + 18}" stroke="#d94032" stroke-width="2"/><rect x="4" y="${z.W - 26}" width="150" height="20" rx="4" fill="#fff" opacity="0.9"/><text x="10" y="${z.W - 11}" font-size="13" fill="#b3361b" font-family="Inter,Arial">+ = donde está el eje</text></svg>`);
          extra = `<div class="p"><div class="et">El eje, 10 veces más grande</div>${zs}</div>`; }
        return `<div class="p"><div class="et">${p.etiqueta}</div>${svg}<div class="cnt ${cls}">Energía de más: ${num(e)} mJ</div></div>${extra}`;
      }).join('');
      const vel = fr.tr.vel ? `${fr.tr.vel} · t = ${seg(Math.max(0, ts))} s` : (ts < 0 ? 'antes de empezar' : `t = ${seg(Math.max(0, ts))} s`);
      await page.evaluate(([t, v, h, x]) => { document.getElementById('tit').textContent = t; document.getElementById('vel').textContent = v; document.getElementById('pan').innerHTML = h; document.getElementById('tx').innerHTML = x; }, [V.titulo, vel, html, fr.tr.texto]);
      await page.screenshot({ path: path.join(dir, `f${String(k++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 });
    }
    const mp4 = path.join(OUT, V.nombre + '.mp4');
    execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart ${mp4}`);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(V.nombre, frames.length, 'fotogramas →', mp4);
  }
  await br.close();
})();
