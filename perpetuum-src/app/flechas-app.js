// Los dos rodillos de flechas en la app: plano, 3D, prueba y veredicto
const { chromium, open } = require('./pw.js');
(async () => {
  const browser = await chromium.launch();
  const out = process.argv[2] || '.';
  const { page, errors } = await open(browser, 'debug.html', { width: 1280, height: 820 }, 'light');
  await page.evaluate(() => localStorage.setItem('taller-perpetuum.bienvenida', '1'));
  await page.click('#welEmpty').catch(() => {});
  for (const ex of ['flechas', 'flechas2']) {
    await page.click('#examplesBtn'); await page.click(`[data-ex="${ex}"]`); await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${ex}-3d.png` });
    await page.click('#view2d'); await page.waitForTimeout(300); await page.screenshot({ path: `${out}/${ex}-2d.png` });
    await page.click('#playBtn'); await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${ex}-prueba2d.png` });
    await page.click('#view3d'); await page.waitForTimeout(900); await page.screenshot({ path: `${out}/${ex}-prueba3d.png` });
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if (await page.evaluate(() => window.__T.mode === 'stopped')) break; }
    const r = await page.evaluate(() => { const S = window.__T, w = S.info.world, b = w.balance(), hb = S.info.bodyOf[S.design.parts.find(p => p.kind === 'wheel').id];
      return { modo: S.mode, t: w.t.toFixed(1), vueltas: (-(hb.a - hb.a0) / 2 / Math.PI).toFixed(1), err: b.error.toFixed(4), fin: S.endReason }; });
    console.log(ex, JSON.stringify(r));
    console.log('veredicto:', (await page.locator('#verdict').innerText()).replace(/\n+/g, ' | ').slice(0, 260));
    await page.screenshot({ path: `${out}/${ex}-fin.png` });
    await page.click('#resetBtn');
  }
  console.log('errores:', errors.length ? errors : 'ninguno');
  await browser.close();
})();
