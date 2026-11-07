const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true, isMobile: true, locale: 'en-US' });
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/perpetuum/'); await page.waitForTimeout(1500);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await ctx.setOffline(true); await page.reload(); await page.waitForTimeout(1200);
  console.log('offline EN título:', await page.title(), '|', (await page.locator('#welTitle').innerText()));
  await page.click('#welScan'); await page.waitForSelector('label[for="scanFile"]'); const fcp = page.waitForEvent('filechooser'); await page.click('label[for="scanFile"]'); const fc = await fcp; await fc.setFiles('maqueta-prueba2.jpg');
  await page.waitForFunction(() => document.getElementById('scanBusy').hidden && !document.getElementById('scanView').hidden, null, { timeout: 15000 });
  console.log('offline scan:', await page.locator('#scanCtl .scan-say').innerText());
  console.log('sponsor EN:', await page.evaluate(() => JSON.stringify((JSON.parse(localStorage.getItem('taller-perpetuum.temporada') || 'null') || {}).patrocinadores?.[0]?.nombre_en)));
  console.log('errores:', errors);
  await browser.close();
})();
