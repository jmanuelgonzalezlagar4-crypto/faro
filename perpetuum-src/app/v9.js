// Leva: ejemplo, pieza nueva desde la paleta e imanes desde la foto.
const { chromium, open } = require('./pw.js');
(async () => {
  const browser = await chromium.launch();
  const { page, errors } = await open(browser, 'debug.html', { width: 1280, height: 820 }, 'light');
  await page.evaluate(() => localStorage.setItem('taller-perpetuum.bienvenida', '1'));
  await page.click('#welEmpty').catch(() => {});
  // 1) ejemplo
  await page.click('#examplesBtn'); await page.click('[data-ex="leva"]'); await page.waitForTimeout(600);
  await page.screenshot({ path: 'v9-1-ejemplo3d.png' });
  await page.click('#view2d'); await page.waitForTimeout(300); await page.screenshot({ path: 'v9-2-ejemplo2d.png' });
  await page.click('#playBtn'); await page.waitForTimeout(3500);
  await page.screenshot({ path: 'v9-3-prueba2d.png' });
  await page.click('#view3d'); await page.waitForTimeout(800); await page.screenshot({ path: 'v9-4-prueba3d.png' });
  await page.click('#speedBtn');
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(1000); if (await page.evaluate(() => window.__T.mode === 'stopped')) break; }
  console.log('veredicto:', (await page.locator('#verdict').innerText()).replace(/\n+/g, ' | ').slice(0, 300));
  await page.click('#resetBtn');
  // 2) leva desde la paleta sobre una rueda nueva
  await page.click('#menuBtn'); await page.click('#mNew'); await page.waitForTimeout(300);
  await page.click('#view2d'); await page.waitForTimeout(200);
  const box = await page.locator('#stage').boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.click(cx, cy); await page.waitForTimeout(300);
  await page.click('.tool[data-tool="add"]'); await page.click('[data-kind="cam"]'); await page.waitForTimeout(150);
  await page.mouse.click(cx + 3, cy + 2); await page.waitForTimeout(400);
  const made = await page.evaluate(() => { const d = window.__T.design; return d.parts.map(p => p.kind + (p.style === 'cam' ? '(leva)' : '') + (p.plane ? '·delante' : '') + (p.mode ? ':' + p.mode : '')).join(', '); });
  console.log('piezas:', made);
  console.log('toast:', await page.locator('#toast').innerText());
  console.log('inspector:', (await page.locator('#inspector').innerText()).replace(/\n+/g, ' | ').slice(0, 260));
  await page.screenshot({ path: 'v9-5-paleta2d.png' });
  // imán en la punta del brazo y prueba
  const tip = await page.evaluate(() => { const S = window.__T, arm = S.design.parts.find(p => p.kind === 'bar'); const r = document.getElementById('stage').getBoundingClientRect();
    return { x: r.left + S.vw / 2 + (arm.x2 - 0.02 - S.cam.x) * S.cam.s, y: r.top + S.vh / 2 - (arm.y2 - S.cam.y) * S.cam.s }; });
  await page.click('.tool[data-tool="add"]'); await page.click('[data-kind="mag-bar"]'); await page.mouse.click(tip.x, tip.y); await page.waitForTimeout(300);
  console.log('imán en:', await page.evaluate(() => { const d = window.__T.design, m = d.parts.find(p => p.kind === 'magnet'); return m ? (d.parts.find(p => p.id === m.host) || {}).kind : 'nada'; }));
  await page.click('#playBtn'); await page.waitForTimeout(3000);
  console.log('prueba:', await page.evaluate(() => { const b = window.__T.info.world.balance(); return 'err ' + b.error.toFixed(4) + ' rub ' + b.rub.toFixed(3); }));
  await page.click('#view3d'); await page.waitForTimeout(800); await page.screenshot({ path: 'v9-6-paleta3d.png' });
  await page.click('#resetBtn');
  // 3) foto con imanes
  await page.click('.tool[data-tool="add"]'); await page.click('[data-kind="scan"]'); await page.waitForSelector('label[for="scanFile"]');
  const fc = page.waitForEvent('filechooser'); await page.click('label[for="scanFile"]'); await (await fc).setFiles('maqueta-prueba2.jpg');
  await page.waitForFunction(() => document.getElementById('scanBusy').hidden && !document.getElementById('scanView').hidden, null, { timeout: 15000 });
  await page.click('#sc_next'); await page.waitForTimeout(150); console.log('paso 2:', await page.locator('.scan-say').innerText());
  await page.click('#sc_next'); await page.waitForTimeout(150);
  await page.click('[data-seg="sc_mount"][data-val="imanes"]'); await page.waitForTimeout(200);
  console.log('resumen:', await page.locator('.scan-sum').innerText());
  await page.screenshot({ path: 'v9-7-imanes.png' });
  await page.click('#sc_make'); await page.waitForTimeout(500);
  console.log('imanes creados:', await page.evaluate(() => { const d = window.__T.design; const m = d.parts.filter(p => p.kind === 'magnet'); return m.length + ' (' + m.filter(p => p.host).length + ' en la rueda)'; }));
  await page.screenshot({ path: 'v9-8-imanes-banco.png' });
  console.log('errores:', errors.filter(e => !/temporada/.test(e)));
  await browser.close();
})();
