// Arreglo del fallo de las guías que van montadas en una pieza que se mueve (por ejemplo, pesas que se deslizan por
// una rueda). Solo se aplica desde los scripts de la búsqueda: la app no cambia.
//
// El fallo: en una guía, el banco aplica la fuerza de la guía sobre la pieza de la guía (a) en el punto donde estaba la
// pieza que se desliza (b) al empezar, y no donde está ahora. Si la guía está quieta (en el suelo) da igual. Si gira,
// la fuerza tuerce la rueda con un brazo equivocado: con gravedad, las pesas aprietan sus guías y la rueda se acelera
// sola. Además, la velocidad de la guía se mide en ese punto viejo.
// El arreglo: en las guías montadas en una pieza que se mueve, el punto de a es el de b en ese momento.
module.exports = function (E) {
  const W = E.World.prototype;
  if (W._guiasArregladas) return; W._guiasArregladas = true;
  const prep0 = W._prepJoints, corr0 = W.correctJoint;
  W._prepJoints = function (phaseA) {
    const r = prep0.call(this, phaseA);
    for (const j of this.joints) {
      if (!j.slide || j.a.isStatic) continue;
      const a = j.a, b = j.b;
      j.rax = b.x + j.rbx - a.x; j.ray = b.y + j.rby - a.y;
      const mA = a.im, mB = b.im, iA = a.iI, iB = b.iI;
      j.k11 = mA + mB + iA * j.ray * j.ray + iB * j.rby * j.rby;
      j.k12 = -iA * j.rax * j.ray - iB * j.rbx * j.rby;
      j.k22 = mA + mB + iA * j.rax * j.rax + iB * j.rbx * j.rbx;
      j.det = j.k11 * j.k22 - j.k12 * j.k12;
      j.kn = j.k11 * j.nx * j.nx + 2 * j.k12 * j.nx * j.ny + j.k22 * j.ny * j.ny;
      j.kt = j.k11 * j.tx * j.tx + 2 * j.k12 * j.tx * j.ty + j.k22 * j.ty * j.ty;
    }
    return r;
  };
  W.correctJoint = function (j) {
    if (!j.slide || j.a.isStatic || j.spin) return corr0.call(this, j);
    const a = j.a, b = j.b;
    let ca = Math.cos(a.a), sa = Math.sin(a.a), cb = Math.cos(b.a), sb = Math.sin(b.a);
    // en una guía la pieza no gira respecto de la otra: se corrige el giro del todo
    const ang = b.a - a.a - j.ref;
    if (Math.abs(ang) > 1e-9 && (a.iI + b.iI) > 0) {
      const C = Math.max(-0.1, Math.min(0.1, ang)), li = -C / (a.iI + b.iI);
      a.a -= a.iI * li; b.a += b.iI * li; ca = Math.cos(a.a); sa = Math.sin(a.a); cb = Math.cos(b.a); sb = Math.sin(b.a);
    }
    const rax0 = ca * j.lax - sa * j.lay, ray0 = sa * j.lax + ca * j.lay, rbx = cb * j.lbx - sb * j.lby, rby = sb * j.lbx + cb * j.lby;
    const px = b.x + rbx, py = b.y + rby, cx = px - (a.x + rax0), cy = py - (a.y + ray0);
    const gnx = -(sa * j.sax + ca * j.say), gny = ca * j.sax - sa * j.say, gn = gnx * cx + gny * cy;
    if (Math.abs(gn) < 1e-7) return;
    const rax = px - a.x, ray = py - a.y;                     // el punto de la guía bajo la pieza, no el de salida
    const rna = rax * gny - ray * gnx, rnb = rbx * gny - rby * gnx, kn = a.im + b.im + a.iI * rna * rna + b.iI * rnb * rnb;
    if (kn <= 0) return;
    const li2 = -this.jointBeta * gn / kn;
    a.x -= a.im * li2 * gnx; a.y -= a.im * li2 * gny; a.a -= a.iI * li2 * rna;
    b.x += b.im * li2 * gnx; b.y += b.im * li2 * gny; b.a += b.iI * li2 * rnb;
    a.updateWorld(); if (!b.isStatic) b.updateWorld();
  };
};
