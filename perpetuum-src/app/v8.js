// La pantalla para elegir de dónde sale la foto: cámara, galería y aviso si el móvil no abre nada.
const { chromium, open } = require('./pw.js');
(async () => {
  const browser = await chromium.launch();
  const { page, errors } = await open(browser, 'debug.html', { width: 390, height: 844 }, 'light', { touch: true });
  await page.click('#welScan'); await page.waitForSelector('label[for="scanCam"]');
  await page.screenshot({ path: 'v8-1-elegir.png' });
  console.log('pantalla:', (await page.locator('#scanCtl').innerText()).replace(/\n+/g, ' | '));
  console.log('pasos y foto ocultos:', await page.evaluate(() => document.getElementById('scanSteps').hidden && document.getElementById('scanView').hidden));
  // «Hacer una foto»: abre el selector del campo con capture=environment
  const fc1 = page.waitForEvent('filechooser'); await page.tap('label[for="scanCam"]'); const ch1 = await fc1;
  console.log('cámara:', await ch1.element().evaluate(e => e.id + ' capture=' + e.getAttribute('capture') + ' accept=' + e.accept));
  // nadie elige nada y la ventana no pierde el foco, como en una app que no abre la cámara: debe salir el aviso
  await page.waitForTimeout(2900);
  console.log('aviso:', await page.locator('.scan-warn').count() ? (await page.locator('.scan-warn').innerText()).slice(0, 60) + '…' : 'NO');
  await page.screenshot({ path: 'v8-2-aviso.png' });
  // «Elegir una foto»: sigue al asistente
  const fc2 = page.waitForEvent('filechooser'); await page.tap('label[for="scanFile"]'); await (await fc2).setFiles('maqueta-prueba2.jpg');
  await page.waitForFunction(() => window.__T && document.getElementById('scanBusy').hidden && !document.getElementById('scanView').hidden, null, { timeout: 15000 });
  console.log('paso 1:', await page.locator('.scan-say').innerText());
  // con teclado: Intro sobre la etiqueta también abre el selector
  await page.click('#scanModal [data-close]'); await page.waitForTimeout(200);
  await page.click('.tool[data-tool="add"]'); await page.click('[data-kind="scan"]'); await page.waitForSelector('label[for="scanFile"]');
  await page.focus('label[for="scanFile"]'); const fc3 = page.waitForEvent('filechooser', { timeout: 3000 }).then(() => 'sí', () => 'no'); await page.keyboard.press('Enter');
  console.log('teclado abre el selector:', await fc3);
  await page.click('#scanModal [data-close]'); await page.waitForTimeout(200);
  // la foto de fondo para calcar, desde la paleta
  await page.click('.tool[data-tool="add"]'); const fc4 = page.waitForEvent('filechooser', { timeout: 3000 }).then(c => c.element().evaluate(e => e.id), () => 'no');
  await page.click('[data-kind="photo"]'); console.log('calcar abre:', await fc4);
  console.log('errores:', errors.filter(e => !/temporada/.test(e)));
  await browser.close();
})();
