// Comprueba lo que parece dar de más en barrido.jsonl:
//  - sin rozamiento, las que pasan del 100,5 %: otra vez con un paso 8 y 32 veces más fino;
//  - con roce, las que dan más vueltas que sin imanes: ¿las vueltas de más caben en lo que baja la energía de los imanes
//    del principio al final (al empezar ya dentro de su campo, o al quedarse al final junto a un imán)? Con la fuerza
//    del roce F, esa bajada paga (imanes al empezar − imanes al final) / (F · 2πR) vueltas, una sola vez.
// Uso: node comprueba.js > comprobadas.jsonl
const fs = require('fs'), path = require('path'), { prueba, monta } = require('./pista.js');
const R = fs.readFileSync(path.join(__dirname, 'barrido.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
for (const r of R.filter(r => r.ideal_rend > 100.5)) {
  const f8 = prueba(Object.assign({}, r.o, { ideal: true, div: 8 }), 30), f32 = prueba(Object.assign({}, r.o, { ideal: true, div: 32 }), 30);
  console.log(JSON.stringify({ que: 'sin rozamiento', n: r.n, movil: r.o.movil, tipo: r.o.tipo, rend: r.ideal_rend, rend8: f8.rend, rend32: f32.rend, atrapada: r.ideal_atras }));
}
let caben = 0, nocaben = [];
for (const r of R.filter(r => r.vueltas - r.vueltas_sin > 0.05)) {
  const o = r.o, m = o.movil === 'bola' ? 7800 * 4 / 3 * Math.PI * o.rb ** 3 : o.mc, F = 0.0015 * m * 9.81, Pm0 = monta(o).w.energy().Pm, bono = (Pm0 - r.pozo_mJ / 1000) / (F * 2 * Math.PI * o.R), extra = r.vueltas - r.vueltas_sin;
  if (extra <= bono + 0.02 || !r.parada) caben++; else nocaben.push({ n: r.n, extra: +extra.toFixed(3), bono: +bono.toFixed(3), parada: r.parada });
}
console.log(JSON.stringify({ que: 'con roce', mas_vueltas: R.filter(r => r.vueltas - r.vueltas_sin > 0.05).length, caben_en_la_bajada_o_no_paran: caben, no_caben: nocaben }));
