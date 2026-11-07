const { chromium } = require('./pw.js');
const fs = require('fs');
const THREE = fs.readFileSync('../lib3/package/build/three.min.js');
const SPANISH = /[áéíóúñ¿¡]|\b(de|la|el|los|las|que|una|con|para|por|del|rueda|pesa|pieza|prueba|pulsa|toca)\b/i;
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'en-GB' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', r => r.fulfill({ body: THREE, contentType: 'application/javascript' }));
  await page.goto('file://' + process.cwd() + '/debug.html'); await page.waitForTimeout(800);
  const found = new Map();
  async function scan(where) {
    const lines = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('body *').forEach(el => {
        if (el.closest('[hidden]') || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;
        for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) out.push(n.nodeValue.trim());
        ['aria-label', 'placeholder', 'title'].forEach(a => { if (el.getAttribute(a)) out.push('[' + a + '] ' + el.getAttribute(a)); });
      });
      return out;
    });
    lines.forEach(l => { if (SPANISH.test(l) && !found.has(l)) found.set(l, where); });
  }
  await scan('bienvenida'); await page.screenshot({ path: 'en-welcome.png' });
  await page.click('#welExample'); await page.waitForTimeout(400); await scan('ejemplo mazos');
  for (const t of ['pieza', 'cuentas', 'prueba', 'ayuda']) { await page.click('.tab[data-tab="' + t + '"]').catch(() => {}); await page.waitForTimeout(150); await scan('pestaña ' + t); }
  await page.screenshot({ path: 'en-design.png' });
  // inspector de cada tipo de pieza
  const kinds = await page.evaluate(() => [...new Set(window.__T.design.parts.map(p => p.kind))]);
  for (const ex of ['mazos', 'bolas', 'wilkins', 'motor', 'pendulo', 'bucle', 'electro', 'leva']) {
    await page.click('#examplesBtn'); await page.click('[data-ex="' + ex + '"]'); await page.waitForTimeout(300);
    await page.click('.tab[data-tab="ayuda"]').catch(() => {}); await scan('ayuda ' + ex);
    const ids = await page.evaluate(() => { const seen = {}; return window.__T.design.parts.filter(p => { const k = p.kind + (p.mode || '') + (p.shape || ''); if (seen[k]) return false; seen[k] = 1; return true; }).map(p => p.id); });
    for (const id of ids) { await page.evaluate(id => { window.__T.sel = id; }, id); await page.evaluate(() => document.querySelector('.tab[data-tab="pieza"]').click()); await page.waitForTimeout(80);
      await page.evaluate(() => { const S = window.__T; }); await scan('inspector ' + ex + ' ' + id); }
    await page.click('#playBtn'); await page.waitForTimeout(2500); await page.click('.tab[data-tab="cuentas"]').catch(() => {}); await scan('prueba ' + ex);
    await page.click('#resetBtn').catch(() => {});
  }
  await page.screenshot({ path: 'en-run.png' });
  for (const tab of ['exTabEx', 'exTabRe', 'exTabRc', 'exTabCo']) { await page.click('#examplesBtn'); await page.click('#' + tab); await page.waitForTimeout(150); await scan('ventana ' + tab); await page.click('#examplesModal [data-close]'); }
  await page.click('#libraryBtn'); await page.waitForTimeout(150); await scan('biblioteca'); await page.click('#libraryModal [data-close]');
  await page.click('#menuBtn'); await page.waitForTimeout(150); await scan('menú'); await page.screenshot({ path: 'en-menu.png' }); await page.click('#menuModal [data-close]');
  await page.click('.tool[data-tool="add"]'); await page.waitForTimeout(150); await scan('paleta'); await page.screenshot({ path: 'en-palette.png' });
  await page.click('[data-kind="scan"]'); await page.waitForSelector('label[for="scanFile"]'); const fc = page.waitForEvent('filechooser'); await page.click('label[for="scanFile"]'); await (await fc).setFiles('maqueta-prueba2.jpg');
  await page.waitForFunction(() => document.getElementById('scanBusy').hidden && !document.getElementById('scanView').hidden, null, { timeout: 15000 });
  await scan('asistente 1'); await page.click('#sc_next'); await page.waitForTimeout(100); await scan('asistente 2'); await page.click('#sc_next'); await page.waitForTimeout(100); await scan('asistente 3');
  await page.screenshot({ path: 'en-scan.png' });
  await page.click('#sc_make'); await page.waitForTimeout(400); await scan('tras crear');
  await page.click('.tool[data-tool="clone"]'); await page.mouse.click(640, 400); await page.waitForTimeout(200); await scan('clonar');
  console.log('título:', await page.title(), '· lang:', await page.evaluate(() => document.documentElement.lang + ' ' + window.PerpetuumI18n.lang));
  for (const [l, w] of found) console.log(w.padEnd(26), '|', l.slice(0, 160));
  console.log('errores:', errors);
  await browser.close();
})();
