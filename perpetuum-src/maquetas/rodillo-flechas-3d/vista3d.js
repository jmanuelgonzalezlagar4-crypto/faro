// Vista 3D del rodillo con three.js (la misma librería que la app): vista3d.png. Uso: node vista3d.js rodillo-flechas
const fs = require('fs'), path = require('path');
// Varias piezas: node vista3d.js "rodillo-una-flecha,leva@e0a040@130,volante@9a9893@-8@vuelta" montaje.png
// (cada pieza: nombre[@color][@mm que sube][@vuelta: dada la vuelta, con la cara de abajo arriba])
const nombre = process.argv[2] || 'rodillo-flechas', salida = process.argv[3] || 'vista3d.png';
// STL binario: cabecera de 80 bytes, número de triángulos y 50 bytes por triángulo
const piezas = nombre.split(',').map(s => {
  const [f, col, dz, vuelta] = s.split('@');
  const buf = fs.readFileSync(path.resolve(__dirname, f + '.stl')), n = buf.readUInt32LE(80), pos = new Array(n * 9);
  for (let i = 0; i < n; i++) for (let j = 0; j < 9; j++) {
    let v = buf.readFloatLE(84 + i * 50 + 12 + j * 4);
    if (vuelta && j % 3 !== 0) v = -v;          // media vuelta alrededor de x: y → −y, z → −z (es un giro: las caras siguen bien)
    if (j % 3 === 2) v += +(dz || 0);
    pos[i * 9 + j] = v;
  }
  return { pos, color: parseInt(col || '6f9fc2', 16) };
});
const three = fs.readFileSync(path.join(__dirname, '../../../perpetuum/lib/three.min.js'), 'utf8');
(async () => {
  const { chromium } = require('playwright'); const br = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const pg = await br.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 2 });
  await pg.setContent(`<body style="margin:0;background:#f6f5f1"><script>${three}</script></body>`);
  await pg.evaluate(piezas => {
    const W = 900, H = 900, r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setSize(W, H); r.setClearColor(0xf6f5f1); document.body.appendChild(r.domElement);
    const sc = new THREE.Scene(), bb = new THREE.Box3();
    for (const p of piezas) {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p.pos, 3)); g.computeVertexNormals();
      sc.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.55, metalness: 0.05, flatShading: true })));
      g.computeBoundingBox(); bb.union(g.boundingBox);
    }
    const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
    const tam = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z), dist = tam * 2.6;   // la cámara, según el tamaño de la pieza
    sc.add(new THREE.AmbientLight(0xffffff, 0.45)); const l1 = new THREE.DirectionalLight(0xffffff, 0.75); l1.position.set(1.5, -2, 2.6); sc.add(l1);
    const l2 = new THREE.DirectionalLight(0xffffff, 0.3); l2.position.set(-2, 1, 0.5); sc.add(l2);
    const cam = new THREE.PerspectiveCamera(30, W / H, 1, 5000); cam.up.set(0, 0, 1);
    cam.position.set(cx + dist * 0.55, cy - dist * 0.65, cz + dist * 0.4); cam.lookAt(cx, cy, cz - tam * 0.03);
    r.render(sc, cam);
  }, piezas);
  await pg.screenshot({ path: path.resolve(__dirname, salida) }); await br.close();
})();
