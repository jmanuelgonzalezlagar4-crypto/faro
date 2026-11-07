// utilidades comunes para las pruebas en navegador
const { chromium } = require('playwright');
const fs = require('fs');
const THREE = fs.readFileSync('../lib3/package/build/three.min.js');
async function open(browser, file, viewport, scheme, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: opts.dsf || 1, colorScheme: scheme, hasTouch: !!opts.touch, isMobile: !!opts.touch, locale: opts.locale || 'es-ES' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|fonts/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', r => r.fulfill({ body: THREE, contentType: 'application/javascript' }));
  await page.goto('file://' + process.cwd() + '/' + file);
  await page.waitForTimeout(700);
  return { ctx, page, errors };
}
module.exports = { chromium, open };
