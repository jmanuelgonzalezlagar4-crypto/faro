const { chromium, open } = require('./pw.js');
(async () => {
  const browser = await chromium.launch();
  for (const [vp, name, touch] of [[{ width: 390, height: 844 }, 'm', true], [{ width: 1280, height: 800 }, 'd', false]]) {
    const { page, errors } = await open(browser, 'debug.html', vp, 'dark', { touch });
    await page.evaluate(() => localStorage.setItem('taller-perpetuum.bienvenida', '1'));
    await page.click('#welScan');
    const fc = await page.waitForEvent('filechooser'); await fc.setFiles('maqueta-prueba.jpg');
    await page.waitForFunction(() => document.getElementById('scanBusy').hidden, null, { timeout: 15000 });
    await page.click('#sc_next'); await page.waitForTimeout(150);
    // añadir la pesa de arriba, que se sale de la foto: está en (450, 10) de 900×700
    const pt = await page.evaluate(() => { const r = document.getElementById('scanCv').getBoundingClientRect(); const S = window.__T; return null; });
    const box = await page.locator('#scanCv').boundingBox();
    const v = await page.evaluate(() => { const c = document.getElementById('scanCv'); const r = c.getBoundingClientRect(); const iw = 900, ih = 700, f = Math.min(r.width / iw, r.height / ih); return { f, ox: (r.width - iw * f) / 2, oy: (r.height - ih * f) / 2 }; });
    await page.mouse.click(box.x + v.ox + 450 * v.f, box.y + v.oy + 14 * v.f);
    await page.waitForTimeout(150);
    console.log(name, 'pesas:', await page.locator('#scanCtl .scan-say').innerText());
    await page.click('#sc_next'); await page.waitForTimeout(200);
    await page.screenshot({ path: 'v7b-' + name + '-montaje.png' });
    await page.click('#sc_make'); await page.waitForTimeout(700);
    const info = await page.evaluate(() => { const d = window.__T.design; return d.parts.filter(p => p.kind === 'pin' && p.mode === 'limits').map(p => [Math.round(p.x * 100), Math.round(p.y * 100), p.lo, p.hi].join(' ')); });
    console.log(name, 'bisagras (cm) y topes:', info.join(' | '));
    await page.screenshot({ path: 'v7b-' + name + '-plano.png' });
    console.log(name, 'errores:', errors.filter(e => !/temporada/.test(e)));
  }
  await browser.close();
})();
