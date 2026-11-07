const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const EN = process.env.TIENDA_LANG === 'en', RAW = EN ? 'store-raw-en' : 'store-raw', OUT = EN ? 'store-en' : 'store';
fs.mkdirSync(OUT, { recursive: true });
const fontData = (f) => 'data:font/woff2;base64,' + fs.readFileSync('dist/perpetuum/fonts/' + f).toString('base64');
const css = `
@font-face { font-family: "BC"; font-weight: 700; src: url("${fontData('barlow-condensed-latin-700-normal.woff2')}"); }
@font-face { font-family: "BC"; font-weight: 600; src: url("${fontData('barlow-condensed-latin-600-normal.woff2')}"); }
@font-face { font-family: "B"; font-weight: 500; src: url("${fontData('barlow-latin-500-normal.woff2')}"); }
@font-face { font-family: "B"; font-weight: 400; src: url("${fontData('barlow-latin-400-normal.woff2')}"); }
* { box-sizing: border-box; margin: 0; }
body { width: __W__; height: __H__; overflow: hidden; background: #17221f;
  background-image: linear-gradient(#22322d 2px, transparent 2px), linear-gradient(90deg, #22322d 2px, transparent 2px);
  background-size: 60px 60px; color: #edf2e8; font-family: "B", sans-serif; }`;
const caps = [
  ['1-diseno', 'Construye tu máquina en 3D', 'Ruedas, pesas, brazos, muelles, imanes y motores, a escala real.'],
  ['2-prueba', 'Pruébala con física real', 'Mírala moverse y empuja las piezas con el dedo.'],
  ['3-cuentas', 'Mira a dónde va cada julio', 'El libro de cuentas explica por qué se para.'],
  ['4-piezas', '14 tipos de piezas', 'Imanes de barra, disco, herradura, Halbach y electroimanes.'],
  ['5-clonar', 'Medidas exactas y clonado', 'Repite un brazo 8 veces alrededor de la rueda con un toque.'],
  ['6-ejemplos', 'Ejemplos históricos y retos', 'De la rueda de 1235 al motor de imanes de internet.'],
  ['7-electro', 'Descubre quién paga la energía', 'Si una rueda gira sin parar, el banco encuentra la pila.'],
  ['8-maqueta', 'Convierte tu maqueta en piezas', 'Hazle una foto: la app encuentra la rueda y las pesas.']
];
const capsEn = [
  ['1-diseno', 'Build your machine in 3D', 'Wheels, weights, arms, springs, magnets and motors, at real scale.'],
  ['2-prueba', 'Test it with real physics', 'Watch it move and push the parts with your finger.'],
  ['3-cuentas', 'See where every joule goes', 'The energy ledger explains why it stops.'],
  ['4-piezas', '14 kinds of parts', 'Bar, disc and horseshoe magnets, Halbach arrays and electromagnets.'],
  ['5-clonar', 'Exact measurements and cloning', 'Repeat an arm 8 times around the wheel with one tap.'],
  ['6-ejemplos', 'Historical examples and challenges', 'From the wheel of 1235 to the internet magnet motor.'],
  ['7-electro', 'Find out who pays for the energy', 'If a wheel never stops, the bench finds the battery.'],
  ['8-maqueta', 'Turn your model into parts', 'Take a photo: the app finds the wheel and the weights.']
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  let i = 1;
  for (const [f, t, sub] of (EN ? capsEn : caps)) {
    const img = 'data:image/png;base64,' + fs.readFileSync(RAW + '/' + f + '.png').toString('base64');
    await page.setContent(`<html><head><style>${css.replace('__W__', '1080px').replace('__H__', '1920px')}
      .cap { position: absolute; left: 80px; right: 80px; top: 70px; height: 330px; display: flex; flex-direction: column; justify-content: center; }
      h1 { font-family: "BC"; font-weight: 700; font-size: 96px; line-height: 0.98; letter-spacing: 0.01em; text-wrap: balance; }
      p { margin-top: 18px; font-size: 38px; line-height: 1.25; color: #a8b9b1; font-weight: 500; }
      .shot { position: absolute; left: 130px; top: 420px; width: 820px; border-radius: 44px; overflow: hidden; border: 6px solid #2c3f39; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
      .shot img { display: block; width: 100%; }
      </style></head><body><div class="cap"><h1>${t}</h1><p>${sub}</p></div><div class="shot"><img src="${img}"></div></body></html>`);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
    await page.screenshot({ path: (EN ? `${OUT}/screenshot-${i}-1080x1920.png` : `${OUT}/captura-${i}-1080x1920.png`), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    i++;
  }
  // gráfico destacado 1024×500
  await page.setViewportSize({ width: 1024, height: 500 });
  const hero = 'data:image/png;base64,' + fs.readFileSync(RAW + '/hero.png').toString('base64');
  const icon = 'data:image/png;base64,' + fs.readFileSync('pwa-src/icon-192.png').toString('base64');
  await page.setContent(`<html><head><style>${css.replace('__W__', '1024px').replace('__H__', '500px')}
    body { background-size: 40px 40px; }
    .txt { position: absolute; left: 56px; top: 0; bottom: 0; width: 470px; display: flex; flex-direction: column; justify-content: center; }
    .logo { display: flex; align-items: center; gap: 14px; }
    .logo img { width: 64px; height: 64px; border-radius: 14px; }
    h1 { font-family: "BC"; font-weight: 700; font-size: 68px; line-height: .95; letter-spacing: .03em; text-transform: uppercase; }
    p { margin-top: 20px; font-size: 25px; line-height: 1.3; color: #c9d6cf; font-weight: 500; }
    .hero { position: absolute; right: -10px; top: 0; width: 540px; height: 500px; border-radius: 0; overflow: hidden;
      -webkit-mask-image: radial-gradient(ellipse 60% 60% at 55% 50%, #000 60%, transparent 100%); }
    .hero img { width: 100%; height: 100%; object-fit: cover; }
    </style></head><body><div class="hero"><img src="${hero}"></div>
    <div class="txt"><div class="logo"><img src="${icon}"><h1>${EN ? 'Perpetuum<br>Workshop' : 'Taller<br>Perpetuum'}</h1></div>
    <p>${EN ? 'Would your perpetual motion machine work? Build it and find out with real physics.' : '¿Funcionaría tu máquina de movimiento perpetuo? Constrúyela y compruébalo con física real.'}</p></div></body></html>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.screenshot({ path: EN ? `${OUT}/feature-graphic-1024x500.png` : `${OUT}/grafico-destacado-1024x500.png`, clip: { x: 0, y: 0, width: 1024, height: 500 } });
  await browser.close();
})();
