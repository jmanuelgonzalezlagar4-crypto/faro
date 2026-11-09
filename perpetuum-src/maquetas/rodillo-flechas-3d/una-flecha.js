// Una sola flecha por vuelta que acaba y empieza en el mismo punto: 19 pares cada 20°, y el último (el más abierto)
// en el mismo ángulo que el primero (el cerrado). La leva tiene una sola punta, con la caída en ese punto.
// Se compara con las dos flechas que se imprimen, con una flecha que no se cierra y con el rodillo sin imanes.
// Uso: node una-flecha.js <caso> (cada caso guarda una-flecha-<caso>.json)   ·   node una-flecha.js tabla
const J = require('./juntos.js'), Q = require('./quietos.js'), { perfil } = require('./perfil.js');
const fs = require('fs');
const BV = { t: 0.003, w: 0.010, z: 0.006 };
const CASOS = [
  ['Dos flechas de 9 pares (el que se imprime)', { fl: 2, pasos: 9, bloque: BV, grade: 'n35' }],
  ['Una flecha de 19 pares que acaba y empieza en el mismo punto', { fl: 1, pasos: 19, cierra: true, bloque: BV, grade: 'n35' }],
  ['Una flecha de 18 pares, sin cerrar (acaba 20° antes)', { fl: 1, pasos: 18, bloque: BV, grade: 'n35' }],
  ['Sin imanes, leva de una punta', { fl: 1, sin: true, bloque: BV }],
  ['Sin imanes, leva de dos puntas', { fl: 2, sin: true, bloque: BV }],
];
module.exports = { CASOS };
if (require.main === module) {
  const arg = process.argv[2];
  if (arg === 'tabla') {
    for (let i = 0; i < CASOS.length; i++) {
      const f = `una-flecha-${i}.json`; if (!fs.existsSync(f)) { console.log(CASOS[i][0], '— falta'); continue; }
      const r = JSON.parse(fs.readFileSync(f));
      console.log(`${r.nombre.padEnd(62)} con leva: ${r.real.vueltas} vueltas, mínimo ${r.minimo_rpm} rpm, sin roce sobra ${r.ideal.gana_mJ} mJ · ` +
        `palos quietos: ${r.quietos.real.vueltas} vueltas, sin roce rpm ${Math.min(...r.quietos.ideal.rpm_cada_vuelta)}–${Math.max(...r.quietos.ideal.rpm_cada_vuelta)}, ` +
        `sobra ${r.quietos.ideal.gana_mJ} mJ, error ${r.quietos.ideal.err_mJ} mJ` + (r.perfil ? ` · cuesta ${r.perfil.cuesta_mJ} mJ, frena hasta ${r.perfil.frena_mNm} mN·m` : ''));
    }
    return;
  }
  const [nombre, o] = CASOS[+arg], t0 = Date.now();
  const real = J.corre(o, 600), ideal = J.corre(Object.assign({}, o, { ideal: true }), 10);
  delete real.serie; delete ideal.serie;
  const minimo_rpm = J.minimo(o);
  const quietos = { ideal: Q.corre(Object.assign({}, o, { ideal: true }), 100, 20), real: Q.corre(o, 300, 600) };
  const pf = o.sin ? null : perfil(o);
  fs.writeFileSync(`una-flecha-${arg}.json`, JSON.stringify({ nombre, o, real, ideal, minimo_rpm, quietos, perfil: pf, segundos: (Date.now() - t0) / 1000 }));
  console.log(nombre, 'listo en', (Date.now() - t0) / 1000, 's');
}
