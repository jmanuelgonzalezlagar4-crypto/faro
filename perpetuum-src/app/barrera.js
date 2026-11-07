// Energía magnética entre el cilindro y el imán de la barra, en una vuelta, con el imán a distintas alturas.
// El «enganche» del punto muerto es la subida de energía que el cilindro tiene que pagar para salir de él.
const path = process.argv[2] || '.';
const E = require(path + '/engine.js'); global.PerpetuumEngine = E;
const P = require(path + '/build.js');
const extra = JSON.parse(process.argv[3] || '{}');
const d0 = P.EXAMPLES.espiral.make(Object.assign({ noCam: 1 }, extra));
for (const up of [0, 1, 2, 3, 5, 8, 12, 20]) {
  const d = JSON.parse(JSON.stringify(d0));
  const st = d.parts.find(p => p.kind === 'magnet' && p.shape === 'bar');
  st.y += up / 1000;
  const info = P.build(d), w = info.world, hb = info.bodyOf[d.parts.find(p => p.kind === 'wheel').id];
  const a0 = hb.a, U = [];
  for (let k = 0; k < 360; k++) { hb.a = a0 + k * Math.PI / 180; hb.updateWorld(); w.updateMagnetPoses(); U.push(w.magnetEnergy()); }
  hb.a = a0;
  // el mayor «escalón» que hay que subir girando en el sentido de la máquina (ángulo creciente)
  let worst = 0, run = 0;
  for (let i = 1; i < 720; i++) { const dU = U[i % 360] - U[(i - 1) % 360]; run = Math.max(0, run + dU); worst = Math.max(worst, run); }
  const mn = Math.min(...U), mx = Math.max(...U);
  console.log(`imán ${up} mm más alto · enganche del punto muerto ${(worst * 1000).toFixed(1)} mJ · energía entre ${(mn * 1000).toFixed(1)} y ${(mx * 1000).toFixed(1)} mJ`);
}
