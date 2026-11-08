// La tabla de las tres tandas de la búsqueda del 101 %.
const T = [
  ['Primera tanda: un tipo de aparato cada vez', [
    ['Ruedas con imanes, electroimán, generador y motor con acumulador', '2.000', '100,03 %', 'Redondeo: con un paso 8 veces más fino, 100,00 %'],
    ['Palancas con imanes junto a una rueda', '1.991', '100,09 %', 'Redondeo: con un paso 8 veces más fino, 100,00 %'],
    ['Ruedas de gravedad (brazos con pesa, bolas en cajones)', '1.999', '100,00 %', 'Nada'],
    ['Balancines con canicas, rampa, escalones y contrapeso', '1.996', '101,34 %', 'Una pieza que empieza metida 2 mm en el escalón: el banco la separa de una vez y luego se para. Con el escalón 4 mm más abajo, 100,00 %'],
    ['Péndulos con imanes y muelles', '1.722', '735,6 %', 'Péndulos apretados uno contra otro. Sin poder chocar y con paso fino, 100,0 %'],
    ['Agua: ruedas con flotadores y bolas sueltas', '2.000', '100,00 %', 'Nada'],
    ['Los 18 ejemplos del banco, cambiados', '177', '104,86 %', 'Redondeo (el hámster): con paso fino, 100,00 %']]],
  ['Segunda tanda: aparatos mixtos', [
    ['Rampas magnéticas que suben bolas de acero', '2.000', '100,16 %', 'No llega al 100,5 %'],
    ['Circuitos de rampas con imanes y un electroimán que enciende la rueda que mueve la bola', '744', '100,42 %', 'No llega al 100,5 %'],
    ['Levas con imanes y muelle, generador y motor', '922', '147,4 %', 'Rueda y leva soldadas con dos ejes: el banco las encaja de golpe en el primer paso. Desde los 0,1 s, 100,0 %'],
    ['Agua con flotadores imantados', '2.000', '100,02 %', 'Nada'],
    ['Mezclas al azar de todo lo anterior', '3.403', '110,0 %', 'Redondeo, piezas apretadas y una bola que un muelle aprieta contra una rueda: sin muelle o sin tocar la rueda, 100,00 %']]],
  ['Tercera tanda: ideas clásicas', [
    ['Rueda de Bhaskara (tubos curvos con bolas)', '1.500', '100,00 %', 'Nada'],
    ['Rueda con imanes en espiral', '1.500', '100,01 %', 'Nada'],
    ['Péndulo de acero con electroimán que se enciende solo', '1.500', '100,04 %', 'Nada'],
    ['Cadena de flotadores en un tanque', '717', '100,00 %', 'Nada']]]];
const alto = v => parseFloat(v.replace('.', '').replace(',', '.')) >= 101;
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fcfcfb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0b0b0b;width:1100px;padding:28px 30px;box-sizing:border-box}
h1{font-size:24px;margin:0 0 6px}p{color:#52514e;font-size:14px;margin:0 0 14px;line-height:1.4}table{border-collapse:collapse;width:100%;font-size:13.5px}
th{text-align:left;color:#52514e;font-weight:600;padding:7px 8px;border-bottom:1px solid #d9d8d3}td{padding:7px 8px;border-bottom:1px solid #ecebe6;vertical-align:top}
td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}td.alto{color:#b3361b;font-weight:600}tr.g td{font-weight:600;padding-top:16px;border-bottom:1px solid #d9d8d3;color:#0b0b0b}.pie{margin-top:16px;font-size:15px;font-weight:600}</style>
<h1>Búsqueda del 101 %: 30.200 aparatos de 16 tipos</h1>
<p>Todo sin aire ni rozamiento, que es lo más favorable. Rendimiento: la energía que tiene la máquina más la que entrega, comparada con la que tenía más la que recibe. Se apartan los imposibles de construir (piezas metidas una dentro de otra): quedan 26.171. Lo que pasa del 100,5 % se vuelve a probar con un paso de cálculo 8 veces más fino y contando solo desde los 0,1 s.</p>
<table><tr><th>Tipo de aparato</th><th style="text-align:right">Probados</th><th style="text-align:right">Lo que parecía</th><th>Qué era, al comprobarlo</th></tr>
${T.map(([g, filas]) => `<tr class="g"><td colspan="4">${g}</td></tr>` + filas.map(f => `<tr><td>${f[0]}</td><td class="n">${f[1]}</td><td class="n ${alto(f[2]) ? 'alto' : ''}">${f[2]}</td><td>${f[3]}</td></tr>`).join('')).join('')}</table>
<div class="pie">Ninguno da más del 100 %. Los 52 que pasaban del 101 % eran fallos del banco, no energía de verdad.</div>`;
(async () => { const { chromium } = require('playwright'); const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1100, height: 600 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: require('path').join(__dirname, 'busqueda-101.png'), fullPage: true }); await b.close(); })();
