const filas = [
  ['Ruedas con imanes, electroimán, generador y motor con acumulador', '2.000', '100,03 %', 'Redondeo: con un paso 8 veces más fino, 100,00 %'],
  ['Palancas con imanes junto a una rueda', '1.991', '100,09 %', 'Redondeo: con un paso 8 veces más fino, 100,00 %'],
  ['Ruedas de gravedad (brazos con pesa, bolas en cajones)', '1.999', '100,00 %', 'Nada'],
  ['Balancines con canicas, rampa, escalones y contrapeso', '1.996', '101,34 %', 'Un empujón de una sola vez al empezar (0,8 mJ), al separar la rampa del escalón donde empieza metida 2 mm. Luego pierde 51 mJ y se para. Con el escalón 4 mm más abajo, 100,00 %'],
  ['Péndulos con imanes y muelles', '1.722', '735,6 %', 'Péndulos apretados uno contra otro: ahí el banco mete energía. Sin poder chocar entre ellos y con paso fino, 100,0 %'],
  ['Agua: ruedas con flotadores y bolas sueltas', '2.000', '100,00 %', 'Nada'],
  ['Los 18 ejemplos del banco, cambiados', '177', '104,86 %', 'Redondeo (el hámster): con un paso 4 veces más fino, 100,00 %'],
];
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;width:1100px;padding:28px 30px;box-sizing:border-box}
h1{font-size:24px;margin:0 0 6px}p{color:#52514e;font-size:14px;margin:0 0 16px;line-height:1.4}table{border-collapse:collapse;width:100%;font-size:14px}
th{text-align:left;color:#52514e;font-weight:600;padding:8px;border-bottom:1px solid #d9d8d3}td{padding:9px 8px;border-bottom:1px solid #ecebe6;vertical-align:top}
td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}td.alto{color:#b3361b;font-weight:600}td.ok{font-weight:600}.pie{margin-top:18px;font-size:15px;color:#0b0b0b;font-weight:600}</style>
<h1>Búsqueda del 101 %: 12.200 aparatos de 7 tipos</h1>
<p>Sin rozamiento ni aire, lo más favorable. Rendimiento = la energía que tiene la máquina más la que entrega, comparada con la que tenía más la que recibe. Cada uno que pasó del 101 % se volvió a probar con un paso de cálculo 4 y 8 veces más fino y, los péndulos, sin poder chocar entre ellos.</p>
<table><tr><th>Tipo de aparato</th><th style="text-align:right">Probados</th><th style="text-align:right">Lo que parecía</th><th>Qué era, al comprobarlo</th></tr>
${filas.map(f => `<tr><td>${f[0]}</td><td class="n">${f[1]}</td><td class="n ${parseFloat(f[2].replace('.', '').replace(',', '.')) >= 101 ? 'alto' : ''}">${f[2]}</td><td>${f[3]}</td></tr>`).join('')}</table>
<div class="pie">Ninguno da más del 100 %. Los 22 que pasaban del 101 % eran fallos del banco, no energía de verdad.</div>`;
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1100, height: 600 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: require('path').join(__dirname, 'busqueda-101.png'), fullPage: true }); await b.close(); })();
