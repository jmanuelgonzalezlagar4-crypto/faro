const { chromium } = require('playwright');
const EN = process.env.TIENDA_LANG === 'en', RAW = EN ? 'store-raw-en' : 'store-raw', LOCALE = EN ? 'en-US' : 'es-ES';
require('fs').mkdirSync(RAW, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  async function app(scheme) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, colorScheme: scheme, locale: LOCALE });
    await ctx.addInitScript(() => { try { localStorage.setItem('taller-perpetuum.bienvenida', '1'); } catch (e) {} });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log('ERR', e.message));
    await page.goto('http://localhost:8765/perpetuum/');
    await page.waitForTimeout(1200);
    return { ctx, page };
  }
  async function loadExample(page, k) {
    await page.click('#examplesBtn'); await page.waitForTimeout(200);
    await page.click(`[data-ex="${k}"]`); await page.waitForTimeout(500);
  }
  const shot = async (page, n) => { await page.evaluate(() => { const t = document.getElementById('toast'); if (t) t.hidden = true; }); await page.waitForTimeout(150); return page.screenshot({ path: `${RAW}/${n}.png` }); };
  // 1 diseño en 3D
  let { ctx, page } = await app('light');
  await loadExample(page, 'mazos');
  await page.waitForTimeout(2800);
  await shot(page, '1-diseno');
  // 2 en marcha
  await page.click('#playBtn'); await page.waitForTimeout(1600);
  await shot(page, '2-prueba');
  // 3 cuentas al pararse
  await page.click('#speedBtn'); await page.waitForTimeout(16000);
  if (!(await page.evaluate(() => /Parada|Stopped/.test(document.getElementById('chip').textContent)))) await page.waitForTimeout(8000);
  await page.evaluate(() => { const p = document.querySelector('.panes'); if (p) p.scrollTop = 0; });
  await shot(page, '3-cuentas');
  await ctx.close();
  // 4 paleta
  ({ ctx, page } = await app('light'));
  await loadExample(page, 'motor');
  await page.click('.tool[data-tool="add"]'); await page.waitForTimeout(400);
  await shot(page, '4-piezas');
  await ctx.close();
  // 5 clonar con medidas exactas (vista plana)
  ({ ctx, page } = await app('light'));
  await page.click('#menuBtn'); await page.click('#mNew'); await page.waitForTimeout(300);
  await page.click('#view2d'); await page.waitForTimeout(200);
  const box = await page.locator('#stage').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.touchscreen.tap(cx, cy); await page.waitForTimeout(300);
  if (await page.evaluate(() => document.getElementById('side').getAttribute('data-open') === 'true')) { await page.click('#sheetClose'); await page.waitForTimeout(300); }
  const s = await page.evaluate(() => { const st = document.getElementById('stage').getBoundingClientRect(); return st; });
  await page.click('.tool[data-tool="add"]'); await page.click('[data-kind="arm"]');
  // del borde derecho de la rueda hacia fuera: usa las coordenadas del propio banco
  const pt = await page.evaluate(() => {
    const cv = document.getElementById('cv'), r = cv.getBoundingClientRect();
    return { r };
  });
  const scale = await page.evaluate(() => 0);
  await page.mouse.move(cx + 66, cy); await page.mouse.down(); await page.mouse.move(cx + 95, cy - 2, { steps: 4 }); await page.mouse.move(cx + 115, cy, { steps: 4 }); await page.mouse.up();
  await page.waitForTimeout(300);
  // dejar la rueda arriba para que se vean las copias por encima de la ventana
  await page.click('.tool[data-tool="move"]');
  await page.click('#zoomOut'); await page.waitForTimeout(150);
  await page.mouse.move(cx - 130, cy + 110); await page.mouse.down(); await page.mouse.move(cx - 130, cy - 70, { steps: 8 }); await page.mouse.up();
  await page.waitForTimeout(200);
  await page.mouse.click(cx + 75, cy - 180); await page.waitForTimeout(300);
  if (await page.evaluate(() => document.getElementById('side').getAttribute('data-open') === 'true')) { await page.click('#sheetClose'); await page.waitForTimeout(300); }
  await page.click('.tool[data-tool="clone"]'); await page.waitForTimeout(300);
  if (await page.isVisible('#k_n')) { await page.fill('#k_n', '8'); await page.dispatchEvent('#k_n', 'change'); }
  await page.waitForTimeout(400);
  await shot(page, '5-clonar');
  await ctx.close();
  // 6 ejemplos y retos (oscuro)
  ({ ctx, page } = await app('dark'));
  await loadExample(page, 'bolas');
  await page.click('#examplesBtn'); await page.waitForTimeout(400);
  await shot(page, '6-ejemplos');
  await ctx.close();
  // 7 electroimán (oscuro)
  ({ ctx, page } = await app('dark'));
  await loadExample(page, 'electro');
  await page.click('#playBtn'); await page.waitForTimeout(4000);
  await page.click('#stripBtn'); await page.waitForTimeout(500);
  await shot(page, '7-electro');
  await ctx.close();
  // 8 tu maqueta convertida en piezas
  ({ ctx, page } = await app('light'));
  await page.click('.tool[data-tool="add"]'); await page.waitForTimeout(300);
  await page.click('[data-kind="scan"]'); await page.waitForSelector('label[for="scanFile"]'); const fc = page.waitForEvent('filechooser'); await page.click('label[for="scanFile"]'); await (await fc).setFiles('maqueta-prueba2.jpg');
  await page.waitForFunction(() => document.getElementById('scanBusy').hidden, null, { timeout: 20000 });
  await page.click('#sc_next'); await page.waitForTimeout(200); await page.click('#sc_next'); await page.waitForTimeout(400);
  await shot(page, '8-maqueta');
  await ctx.close();
  // imagen para el gráfico destacado: 3D grande en oscuro
  const c2 = await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2, colorScheme: 'dark', locale: LOCALE });
  await c2.addInitScript(() => { try { localStorage.setItem('taller-perpetuum.bienvenida', '1'); } catch (e) {} });
  const p2 = await c2.newPage();
  await p2.goto('http://localhost:8765/perpetuum/'); await p2.waitForTimeout(1200);
  await p2.click('#examplesBtn'); await p2.waitForTimeout(200); await p2.click('[data-ex="mazos"]'); await p2.waitForTimeout(800);
  await p2.click('#playBtn'); await p2.waitForTimeout(1300); await p2.click('#playBtn');
  await p2.evaluate(() => { const t = document.getElementById('toast'); if (t) t.hidden = true; }); await p2.waitForTimeout(150);
  const st = await p2.locator('#stage').boundingBox();
  await p2.screenshot({ path: RAW + '/hero.png', clip: { x: st.x + 60, y: st.y + 40, width: st.width - 160, height: st.height - 120 } });
  await browser.close();
})();
