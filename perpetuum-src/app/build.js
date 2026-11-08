/* Taller Perpetuum — del diseño (lo que dibuja la persona) al mundo simulable. */
(function (root) {
  'use strict';
  var E = root.PerpetuumEngine;
  var T = (root.PerpetuumI18n && root.PerpetuumI18n.t) || function (s) { return s; };
  var DEG = Math.PI / 180;

  var BAR_R = 0.012, RAMP_R = 0.012, MAG_R = 0.016, RIM_R = 0.014, DIV_R = 0.011, CAM_R = 0.006;

  // Calidad del eje. par de rozamiento = fc·carga + ft0  (fc = coeficiente × radio del eje)
  var BEARINGS = {
    // slide: rozamiento de una guía (fuerza = coeficiente × carga + fuerza fija)
    ideal:  { name: T('Sin rozamiento'), note: T('No existe en la realidad'), axle: [0, 0], pin: [0, 0], slide: [0, 0] },
    bolas:  { name: T('Rodamiento de bolas'), note: T('El mejor eje que puedes comprar'), axle: [0.0015 * 0.01, 0.002], pin: [0.0015 * 0.004, 0.0004], slide: [0.003, 0.002] },
    bronce: { name: T('Casquillo de bronce engrasado'), note: T('Típico de un taller'), axle: [0.08 * 0.01, 0], pin: [0.08 * 0.004, 0], slide: [0.08, 0.005] },
    madera: { name: T('Eje de madera'), note: T('Como en las ruedas antiguas'), axle: [0.3 * 0.015, 0], pin: [0.3 * 0.006, 0], slide: [0.3, 0.02] }
  };

  var MATERIALS = {
    plomo:  { name: T('Plomo'), e: 0.05, mu: 0.5, crr: 0.006, steel: false },
    acero:  { name: T('Acero (lo atraen los imanes)'), e: 0.55, mu: 0.3, crr: 0.0015, steel: true },
    madera: { name: T('Madera'), e: 0.35, mu: 0.45, crr: 0.004, steel: false },
    goma:   { name: T('Goma'), e: 0.75, mu: 0.9, crr: 0.012, steel: false }
  };

  var GRAVITY = { tierra: 9.81, luna: 1.62, marte: 3.71 };
  // rozamiento de la punta de aguja que aguanta a lo largo un eje que flota en imanes (N·m)
  var NEEDLE = 0.00002;

  function uid(d) { d.next = (d.next || 1); return 'p' + (d.next++); }

  function find(d, id) {
    for (var i = 0; i < d.parts.length; i++) if (d.parts[i].id === id) return d.parts[i];
    return null;
  }

  // grosor (radio) de una barra: el de siempre, o el suyo si es más fina o más gorda
  function barR(p) { return p.th > 0 ? p.th : BAR_R; }
  function isBodyPart(p) { return p.kind === 'wheel' || p.kind === 'ball' || p.kind === 'bar'; }

  // ---- partes con valores por defecto ----
  function makeWheel(d, x, y, r) {
    return { id: uid(d), kind: 'wheel', x: x, y: y, r: r || 0.5, m: 3, style: 'disc', cells: 8, tilt: 35, spokes: 8,
      axle: 'fixed', bearing: 'bronce', gen: 0, rpm: 0 };
  }
  // leva: una rueda con forma, con «puntas» que empujan lo que la toca. Va delante de la rueda (plano 1).
  function makeCam(d, x, y, r) {
    var p = makeWheel(d, x, y, r || 0.06);
    p.style = 'cam'; p.m = 0.1; p.lift = Math.round(p.r * 0.4 * 1000) / 1000; p.lobes = 1; p.phase = 90; p.plane = 1; p.spokes = 0;
    return p;
  }
  // Forma de la leva entre 0 (valle) y 1 (punta), con u = puntas·(ángulo − fase). La lisa sube y baja
  // suave; la «rampa» sube poco a poco y cae de golpe justo después de lo más alto (sg: hacia qué lado sube).
  // Es la misma fórmula que usa el motor.
  var CAM_DROP = 0.04;   // la caída de la rampa ocupa este trozo de cada punta
  function camShape(p, u) {
    if (p.prof !== 'rampa') return (1 + Math.cos(u)) / 2;
    var dr = camDrop(p), v = (((p.sg < 0 ? -1 : 1) * u) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), P1 = 2 * Math.PI * (1 - dr);
    return v <= P1 ? v / P1 : (1 + Math.cos((v - P1) / (2 * dr))) / 2;
  }
  // grueso del borde de la leva (lo que toca el rodillo está a esta distancia de la curva)
  function camRim(p) { return p.th > 0 ? p.th : CAM_R; }
  function camDrop(p) { return p.drop > 0 ? Math.min(0.5, p.drop) : CAM_DROP; }
  function camLift(p) { return Math.max(0, Math.min(p.r * 0.6, p.lift || 0)); }
  // contorno de la leva respecto de su centro: radio mayor p.r en cada punta, p.r - p.lift en los valles
  function camProfile(p, n) {
    n = n || 72;
    var out = [], L = Math.max(1, Math.round(p.lobes || 1)), lift = camLift(p), ph = (p.phase || 0) * DEG;
    if (p.prof === 'rampa') n = Math.max(n, 90 * L);   // el escalón se ve bien
    for (var i = 0; i < n; i++) {
      var t = i / n * 2 * Math.PI, rho = p.r - lift + lift * camShape(p, L * (t - ph));
      out.push([rho * Math.cos(t), rho * Math.sin(t)]);
    }
    return out;
  }
  function makeBall(d, x, y) {
    return { id: uid(d), kind: 'ball', x: x, y: y, r: 0.05, m: 1, mat: 'plomo' };
  }
  function makeBar(d, x1, y1, x2, y2) {
    return { id: uid(d), kind: 'bar', x1: x1, y1: y1, x2: x2, y2: y2, m: 0.15 };
  }
  function makeRamp(d, x1, y1, x2, y2) {
    return { id: uid(d), kind: 'ramp', x1: x1, y1: y1, x2: x2, y2: y2, mat: 'madera' };
  }
  function makePin(d, x, y, a, b) {
    return { id: uid(d), kind: 'pin', x: x, y: y, a: a, b: b, mode: 'free', lo: -45, hi: 45, bearing: 'bronce', gen: 0 };
  }
  // tanque de agua: rectángulo del fondo (x1, y1) a la superficie (x2, y2)
  function makeTank(d, x1, y1, x2, y2) {
    return { id: uid(d), kind: 'tank', x1: x1, y1: y1, x2: x2, y2: y2, rho: 1000 };
  }
  function makeSpring(d, x1, y1, x2, y2, a, b) {
    return { id: uid(d), kind: 'spring', x1: x1, y1: y1, x2: x2, y2: y2, a: a, b: b, k: 200, rest: null, damp: 0.5 };
  }
  function makeMagnet(d, x, y, host, shape) {
    var p = { id: uid(d), kind: 'magnet', shape: shape || 'bar', x: x, y: y, host: host, ang: 90, grade: 'n52', size: 0.02, mu: 8 };
    if (p.shape === 'horseshoe') p.size = 0.06;
    if (p.shape === 'halbach') p.size = 0.1;
    if (p.shape === 'electro') { p.grade = null; p.size = 0.05; p.mu = 6; p.emode = 'always'; p.ewheel = null; p.efrom = 0; p.eto = 30; p.eevery = 360; }
    if (p.shape !== 'electro') p.mu = magnetModel(p).mu;
    return p;
  }

  // tamaño de un imán de neodimio con ese momento magnético (8 A·m² ≈ 2 cm)
  function magSize(mu) { return Math.max(0.012, 0.02 * Math.cbrt(Math.max(mu, 0.1) / 8)); }

  // ---- imanes: forma, material y tamaño ----
  var GRADES = {
    ferrita: { name: T('Ferrita (los negros de nevera)'), br: 0.4 },
    n35: { name: T('Neodimio N35'), br: 1.2 },
    n52: { name: T('Neodimio N52 (el más fuerte)'), br: 1.45 }
  };
  var MAG_SHAPES = {
    bar: T('Imán de barra'), disc: T('Imán de disco'), horseshoe: T('Imán de herradura'),
    halbach: T('Matriz de Halbach'), electro: T('Electroimán')
  };
  // Devuelve los dipolos (en coordenadas del mundo), las formas que chocan y la fuerza total.
  function magnetModel(p) {
    var shape = p.shape || 'bar', a = (p.ang || 0) * DEG;
    var fx = Math.cos(a), fy = Math.sin(a), qx = -fy, qy = fx;
    var legacy = p.grade == null && shape !== 'electro';
    var L = p.size || magSize(p.mu || 8);
    var mPerV = (GRADES[p.grade] || GRADES.n52).br / E.MU0;
    var dip = [], shp = [], muTot = 0;
    function cap(x1, y1, x2, y2, r) { shp.push({ t: 's', ax: x1, ay: y1, bx: x2, by: y2, r: r }); }
    function add(x, y, ang, mu) { dip.push({ x: x, y: y, ang: ang, mu: mu }); muTot += Math.abs(mu); }
    if (shape === 'disc') {
      add(p.x, p.y, a, legacy ? p.mu : mPerV * Math.PI * L * L / 4 * L / 2);
      shp.push({ t: 'c', x: p.x, y: p.y, r: L / 2 });
    } else if (shape === 'horseshoe') {
      var sep = 0.55 * L, w = 0.22 * L, leg = 0.8 * L, mLeg = legacy ? p.mu / 2 : mPerV * leg * w * w;
      add(p.x + qx * sep / 2, p.y + qy * sep / 2, a, mLeg);
      add(p.x - qx * sep / 2, p.y - qy * sep / 2, a + Math.PI, mLeg);
      var h = L / 2 - w / 2;
      [1, -1].forEach(function (sg) {
        var cx = p.x + sg * qx * sep / 2, cy = p.y + sg * qy * sep / 2;
        cap(cx - fx * h, cy - fy * h, cx + fx * h, cy + fy * h, w / 2);
      });
      cap(p.x - fx * h + qx * sep / 2, p.y - fy * h + qy * sep / 2, p.x - fx * h - qx * sep / 2, p.y - fy * h - qy * sep / 2, w / 2);
    } else if (shape === 'halbach') {
      var n = 5, c = L / n, mCube = legacy ? p.mu / n : mPerV * c * c * c;
      for (var k = 0; k < n; k++) {
        var off = (k - (n - 1) / 2) * c;
        add(p.x + fx * off, p.y + fy * off, a + k * Math.PI / 2, mCube);
      }
      cap(p.x - fx * (L / 2 - c / 2), p.y - fy * (L / 2 - c / 2), p.x + fx * (L / 2 - c / 2), p.y + fy * (L / 2 - c / 2), c / 2);
    } else if (shape === 'bar' && p.wide > 0) {
      // imán plano: grueso L (de sur a norte) y ancho «wide» en el dibujo; de fondo, wz (o lo mismo que de ancho)
      var W = p.wide, depth = p.wz > 0 ? p.wz : W, nw = 3, mw = (legacy ? (p.mu || 8) : mPerV * L * W * depth) / nw;
      for (var kw = 0; kw < nw; kw++) { var ow = (kw - (nw - 1) / 2) * W / nw; add(p.x + qx * ow, p.y + qy * ow, a, mw); }
      var hw = Math.max(0, W / 2 - L / 2);
      cap(p.x - qx * hw, p.y - qy * hw, p.x + qx * hw, p.y + qy * hw, L / 2);
    } else {
      var wb = shape === 'electro' ? 0.45 * L : L / 2;
      add(p.x, p.y, a, (legacy || shape === 'electro') ? (p.mu || 8) : mPerV * L * wb * wb);
      cap(p.x - fx * (L / 2 - wb / 2), p.y - fy * (L / 2 - wb / 2), p.x + fx * (L / 2 - wb / 2), p.y + fy * (L / 2 - wb / 2), wb / 2);
    }
    // A lo largo del eje (fuera del dibujo): todos los dipolos van a la altura z del imán.
    // Con «poles» se cuentan sus dos caras (norte y sur), separadas por su grueso.
    var z0 = +p.z || 0, thick = p.poles ? (shape === 'disc' ? L / 2 : (shape === 'bar' ? L : 0)) : 0;
    // ax: imantado a lo largo del eje (un disco visto de frente: una cara es el norte y la otra el sur)
    dip.forEach(function (dp) { dp.z = z0; dp.soft = p.soft > 0 ? p.soft : 0; dp.poles = thick; dp.ax = thick && p.ax ? p.ax : 0; });
    if (shape === 'bar' && p.wz > 0) {
      // un imán de barra largo a lo largo del eje (wz): tiene más imán (si no es plano, su fondo era L/2)
      var more = p.wide > 0 ? 1 : p.wz / (L / 2);
      if (thick) dip.forEach(function (dp) { dp.mu *= more; dp.wz = p.wz; });   // con polos sus caras son líneas de ese largo
      else {
        // como dipolos: se reparte en trozos iguales a lo largo del eje
        var nz = Math.max(1, Math.min(9, Math.round(p.wz / 0.015))), old = dip;
        dip = [];
        old.forEach(function (d0) {
          for (var kz = 0; kz < nz; kz++) dip.push({ x: d0.x, y: d0.y, ang: d0.ang, mu: d0.mu * more / nz, z: z0 + (kz - (nz - 1) / 2) * p.wz / nz,
            soft: p.soft > 0 ? Math.max(p.soft, p.wz / nz / 2) : 0, poles: 0 });
        });
      }
      muTot = 0; dip.forEach(function (dp) { muTot += Math.abs(dp.mu); });
    }
    return { dipoles: dip, shapes: shp, mu: muTot, size: L, shape: shape };
  }
  // consumo de un electroimán según su fuerza (bobina de cobre típica)
  function electroPower(mu) { return 0.25 * mu * mu; }

  function emptyDesign() {
    return { v: 1, next: 1, gravity: 'tierra', ideal: false, air: true, parts: [], example: null };
  }

  // ---- geometría de una rueda de compartimentos ----
  function ringGeometry(p) {
    var R = p.r, segs = Math.max(20, Math.round(R * 60)), out = { rim: [], dividers: [], hub: R * 0.22 };
    var rr = R - RIM_R;
    for (var i = 0; i < segs; i++) {
      var a0 = i / segs * 2 * Math.PI, a1 = (i + 1) / segs * 2 * Math.PI;
      out.rim.push([rr * Math.cos(a0), rr * Math.sin(a0), rr * Math.cos(a1), rr * Math.sin(a1)]);
    }
    var n = Math.max(2, Math.round(p.cells));
    for (var k = 0; k < n; k++) {
      var th = k / n * 2 * Math.PI;
      var r0 = out.hub, r1 = R - RIM_R * 1.5, th1 = th - p.tilt * DEG;
      out.dividers.push([r0 * Math.cos(th), r0 * Math.sin(th), r1 * Math.cos(th1), r1 * Math.sin(th1)]);
    }
    return out;
  }

  // ---- construcción del mundo ----
  function build(d) {
    var ideal = !!d.ideal;
    // d.dt: paso de cálculo más fino para máquinas con imanes muy juntos (por defecto 1/480 s)
    // d.iters: más vueltas al calcular los contactos, para filas largas de bolas apretadas (por defecto 24)
    var w = new E.World({ g: GRAVITY[d.gravity] || 9.81, airRho: (d.air && !ideal) ? 1.2 : 0, dt: d.dt > 0 ? Math.max(1 / 3840, Math.min(1 / 240, d.dt)) : undefined,
      iters: d.iters > 0 ? Math.round(Math.max(8, Math.min(200, d.iters))) : undefined });
    var parts = d.parts;
    var info = { world: w, bodyOf: {}, partsOfBody: new Map(), jointOf: {}, springOf: {}, magnetOf: {}, wheelJoint: {}, warnings: [] };

    // 1. agrupar piezas soldadas (bisagra rígida)
    var parent = {};
    function root_(id) { while (parent[id] !== id) { parent[id] = parent[parent[id]]; id = parent[id]; } return id; }
    function unite(a, b) { a = root_(a); b = root_(b); if (a !== b) parent[b] = a; }
    parent.__ground = '__ground';
    parts.forEach(function (p) { if (isBodyPart(p)) parent[p.id] = p.id; });
    parts.forEach(function (p) {
      if (p.kind !== 'pin' || p.mode !== 'rigid') return;
      var A = p.a && parent[p.a] ? p.a : '__ground';
      if (!parent[p.b]) return;
      unite(A, p.b);
    });
    // una rueda con eje fijo y soldada al suelo queda fija

    // 2. propiedades de masa por grupo
    var groups = {};
    parts.forEach(function (p) {
      if (!isBodyPart(p)) return;
      var g = root_(p.id);
      (groups[g] = groups[g] || []).push(p);
    });
    var groundRoot = root_('__ground');

    Object.keys(groups).forEach(function (g) {
      var list = groups[g];
      var isGround = (g === groundRoot);
      var M = 0, cx = 0, cy = 0;
      var props = list.map(function (p) { return partMass(p); });
      props.forEach(function (q) { M += q.m; cx += q.m * q.cx; cy += q.m * q.cy; });
      var body;
      if (isGround) {
        body = w.ground;
      } else {
        cx /= M; cy /= M;
        var I = 0;
        props.forEach(function (q) { I += q.I + q.m * ((q.cx - cx) * (q.cx - cx) + (q.cy - cy) * (q.cy - cy)); });
        body = new E.Body();
        body.x = cx; body.y = cy; body.a = 0;
        body.setMass(M, I);
      }
      var dragK = 0, dragRot = 0;
      list.forEach(function (p) {
        addShapes(body, p, isGround ? 0 : body.x, isGround ? 0 : body.y);
        var dr = partDrag(p);
        dragK += dr.k; dragRot += dr.rot;
        info.bodyOf[p.id] = body;
      });
      body.dragK = dragK; body.dragRot = dragRot;
      if (ideal) { body.crr = 0; body.ws = []; body.shapes.forEach(function (s) { s.crr = 0; }); }
      if (!isGround) w.addBody(body);
      var arr = info.partsOfBody.get(body) || [];
      info.partsOfBody.set(body, arr.concat(list));
    });

    // tanques de agua (rectángulo hasta el nivel del agua; las paredes, si hacen falta, son rampas aparte)
    parts.forEach(function (p) {
      if (p.kind !== 'tank') return;
      w.addTank(p.x1, p.y1, p.x2, p.y2, p.rho || 1000);
      info.bodyOf[p.id] = w.ground;
    });

    // rampas al suelo
    parts.forEach(function (p) {
      if (p.kind !== 'ramp') return;
      var mat = MATERIALS[p.mat] || MATERIALS.madera;
      w.ground.shapes.push({ t: 's', ax: p.x1, ay: p.y1, bx: p.x2, by: p.y2, r: RAMP_R, mu: mat.mu, e: mat.e, crr: ideal ? 0 : mat.crr, part: p.id });
      info.bodyOf[p.id] = w.ground;
    });

    function bodyFor(id) { return (id && info.bodyOf[id]) || w.ground; }

    // 3. imanes
    var electroParts = [];
    parts.forEach(function (p) {
      if (p.kind !== 'magnet') return;
      var host = bodyFor(p.host), model = magnetModel(p);
      model.shapes.forEach(function (sh) {
        var o = { mu: 0.3, e: 0.3, crr: 0.002, part: p.id, massless: true, r: sh.r, t: sh.t, plane: p.plane || 0, solid: p.solid !== false };
        if (sh.t === 'c') { var l = host.toLocal(sh.x, sh.y); o.x = l.x; o.y = l.y; }
        else { var la = host.toLocal(sh.ax, sh.ay), lb = host.toLocal(sh.bx, sh.by); o.ax = la.x; o.ay = la.y; o.bx = lb.x; o.by = lb.y; }
        host.shapes.push(o);
      });
      info.magnetOf[p.id] = model.dipoles.map(function (dp) { return w.addMagnet(host, dp.x, dp.y, dp.ang, dp.mu, p.id, dp.z, dp.soft, dp.poles, dp.wz, dp.ax); });
      if (p.shape === 'electro') electroParts.push(p);
    });

    // 4. bolas de acero
    parts.forEach(function (p) {
      if (p.kind !== 'ball') return;
      var mat = MATERIALS[p.mat] || MATERIALS.plomo;
      var b = bodyFor(p.id);
      if (mat.steel && !b.isStatic) {
        var st = w.addSteel(b, p.r);
        var l = b.toLocal(p.x, p.y);
        st.lx = l.x; st.ly = l.y;
      }
    });

    // 4b. bolas en el agua: cada bola es una esfera que el agua empuja y frena
    if (w.tanks.length) parts.forEach(function (p) {
      if (p.kind !== 'ball') return;
      var b = bodyFor(p.id);
      if (!b.isStatic) w.addFloat(b, p.x, p.y, p.r, 0.47);
    });

    // 5. ejes de las ruedas
    parts.forEach(function (p) {
      if (p.kind !== 'wheel' || (p.axle !== 'fixed' && p.axle !== 'levitado')) return;
      var b = bodyFor(p.id);
      if (b.isStatic) return;
      var br = BEARINGS[ideal ? 'ideal' : p.bearing] || BEARINGS.bronce;
      var opt = { fc: br.axle[0], ft0: br.axle[1], gen: p.gen || 0, genDest: p.gdest, motor: motorOf(p, 1), tag: p.id };
      // flotando en imanes: lo sostienen los imanes; solo una punta de aguja en un extremo del eje lo aguanta a lo largo
      if (p.axle === 'levitado') { opt.spin = true; opt.fc = 0; opt.ft0 = ideal ? 0 : NEEDLE; }
      info.wheelJoint[p.id] = w.addJoint(w.ground, b, p.x, p.y, opt);
    });

    // 6. bisagras
    parts.forEach(function (p) {
      if (p.kind !== 'pin' || p.mode === 'rigid') return;
      var A = bodyFor(p.a), B = bodyFor(p.b);
      if (!find(d, p.b) || A === B) return;
      if (B.isStatic && !A.isStatic) { var t = A; A = B; B = t; }
      if (A.isStatic && B.isStatic) return;
      var br = BEARINGS[ideal ? 'ideal' : p.bearing] || BEARINGS.bronce;
      var flip = bodyFor(p.a) !== A ? -1 : 1;
      var opt = { fc: br.pin[0], ft0: br.pin[1], gen: p.gen || 0, genDest: p.gdest, motor: motorOf(p, flip), tag: p.id };
      if (p.mode === 'guia') {
        // guía: la pieza se desliza por una recta (ángulo sang, vertical si no se dice) sin girar
        opt.slide = (p.sang != null ? p.sang : 90) * DEG; opt.sfc = br.slide[0]; opt.sf0 = br.slide[1];
      }
      if (p.mode === 'limits') {
        opt.limit = true;
        var lo = Math.min(p.lo, 0), hi = Math.max(p.hi, 0);
        // el ángulo se mide como pieza b respecto de pieza a
        if (bodyFor(p.a) !== A) { var t2 = -lo; lo = -hi; hi = t2; }
        opt.lo = lo * DEG; opt.hi = hi * DEG; opt.le = 0.15;
      }
      info.jointOf[p.id] = w.addJoint(A, B, p.x, p.y, opt);
    });

    // electroimanes: siempre encendidos o con interruptor según el giro de una rueda
    info.electroOf = {};
    electroParts.forEach(function (p) {
      var wb = p.emode === 'window' && p.ewheel ? info.bodyOf[p.ewheel] : null;
      info.electroOf[p.id] = w.addElectro(info.magnetOf[p.id], {
        mode: wb ? 'window' : 'always', body: wb, from: p.efrom || 0, to: p.eto || 0, every: p.eevery || 360,
        power: ideal ? 0 : electroPower(p.mu || 8), tag: p.id, src: p.esrc
      });
    });

    // 7. muelles
    parts.forEach(function (p) {
      if (p.kind !== 'spring') return;
      var A = bodyFor(p.a), B = bodyFor(p.b);
      if (A === B) return;
      info.springOf[p.id] = w.addSpring(A, B, p.x1, p.y1, p.x2, p.y2, { k: p.k, rest: p.rest, c: ideal ? 0 : p.damp });
    });

    // 8. grupos de colisión: piezas unidas por bisagras no chocan entre sí
    var gp = new Map();
    w.bodies.forEach(function (b) { gp.set(b, b); });
    function gr(b) { while (gp.get(b) !== b) b = gp.get(b); return b; }
    w.joints.forEach(function (j) {
      if (j.a.isStatic || j.b.isStatic) return;
      var ra = gr(j.a), rb = gr(j.b);
      if (ra !== rb) gp.set(rb, ra);
    });
    var gid = new Map(), next = 1;
    w.bodies.forEach(function (b) {
      if (b.isStatic) { b.group = 0; return; }
      var r = gr(b);
      if (!gid.has(r)) gid.set(r, -(next++));
      b.group = gid.get(r);
    });
    var counts = new Map();
    w.bodies.forEach(function (b) { if (b.group) counts.set(b.group, (counts.get(b.group) || 0) + 1); });
    w.bodies.forEach(function (b) { if (b.group && counts.get(b.group) < 2) b.group = 0; });
    info.assemblyOf = function (b) { return b.group ? w.bodies.filter(function (o) { return o.group === b.group; }) : [b]; };

    // 9. giro inicial de las ruedas
    parts.forEach(function (p) {
      if (p.kind !== 'wheel' || !p.rpm || (p.axle !== 'fixed' && p.axle !== 'levitado')) return;
      var b = bodyFor(p.id);
      if (b.isStatic) return;
      var om = -p.rpm * 2 * Math.PI / 60;  // positivo = sentido horario
      info.assemblyOf(b).forEach(function (o) {
        o.w = om;
        o.vx = -om * (o.y - p.y);
        o.vy = om * (o.x - p.x);
      });
    });

    w.bodies.forEach(function (b) { b.ws = []; b.updateWorld(); b.x0 = b.x; b.y0 = b.y; b.a0 = b.a; });
    w.start();
    // piezas metidas una dentro de otra que el banco no ha podido separar (por ejemplo, dos brazos clavados a la
    // pared que se cruzan): así no se puede construir, y empujarse sin poder separarse mete energía que no existe
    info.overlaps = [];
    w.findContacts().forEach(function (c) {
      if (c.sep > -0.003) return;
      var pa = (info.partsOfBody.get(c.A) || [])[0], pb = (info.partsOfBody.get(c.B) || [])[0];
      info.overlaps.push({ a: pa ? pa.id : null, b: pb ? pb.id : null, depth: -c.sep });
    });
    return info;
  }

  // motor: gira hacia la velocidad pedida (positivo = horario) con un par máximo
  function motorOf(p, flip) {
    if (!p.motor) return null;
    return { w: -flip * (p.mrpm || 0) * 2 * Math.PI / 60, tmax: Math.max(0, p.mtorque || 0), src: p.msrc === 'bus' ? 'bus' : (p.msrc === 'grid' ? 'grid' : 'battery') };
  }

  function partMass(p) {
    if (p.kind === 'wheel' && p.style === 'cam') { var rc = p.r - (p.lift || 0) / 2; return { m: p.m, cx: p.x, cy: p.y, I: 0.5 * p.m * rc * rc }; }
    if (p.kind === 'wheel') {
      var I = p.style === 'rim' ? 0.92 * p.m * p.r * p.r : (p.style === 'ring' ? 0.85 * p.m * p.r * p.r : 0.5 * p.m * p.r * p.r);
      return { m: p.m, cx: p.x, cy: p.y, I: I };
    }
    if (p.kind === 'ball') return { m: p.m, cx: p.x, cy: p.y, I: 0.4 * p.m * p.r * p.r };
    var L2 = (p.x2 - p.x1) * (p.x2 - p.x1) + (p.y2 - p.y1) * (p.y2 - p.y1);
    return { m: p.m, cx: (p.x1 + p.x2) / 2, cy: (p.y1 + p.y2) / 2, I: p.m * L2 / 12 };
  }

  function partDrag(p) {
    if (p.kind === 'wheel') return { k: 0.5 * 1.0 * (2 * p.r * 0.03), rot: 0.01 * Math.pow(p.r, 4) * (p.style === 'ring' || p.style === 'rim' ? 1.5 : 1) };
    if (p.kind === 'ball') return { k: 0.5 * 0.47 * Math.PI * p.r * p.r, rot: 0 };
    var L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1);
    return { k: 0.5 * 1.0 * L * 0.02, rot: 0.5 * 1.0 * 0.02 * Math.pow(L, 4) / 32 };
  }

  function addShapes(body, p, ox, oy) {
    if (p.kind === 'wheel') {
      var mu = 0.45, e = 0.3;
      if (p.style === 'cam') {
        // la leva es una curva lisa (en el motor, forma 'k'), para que lo que se apoya en ella ruede sin tropezar
        var pl = p.plane == null ? 1 : p.plane, liftK = camLift(p);
        body.shapes.push({ t: 'k', x: p.x - ox, y: p.y - oy, r: camRim(p), R: p.r, lift: liftK, lobes: Math.max(1, Math.round(p.lobes || 1)), ph: (p.phase || 0) * DEG,
          prof: p.prof === 'rampa' ? 'rampa' : 'cos', sg: p.sg < 0 ? -1 : 1, dr: camDrop(p), mu: 0.3, e: 0.1, crr: 0.002, part: p.id, plane: pl });
        body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: Math.max(0.005, (p.r - liftK) * 0.6), mu: 0.3, e: 0.1, part: p.id, plane: pl });
      } else if (p.style === 'rim') {
        // aro o polea: solo el aro choca; el buje y los radios van detrás, donde no llega lo de dentro
        ringGeometry(p).rim.forEach(function (s) { body.shapes.push({ t: 's', ax: p.x + s[0] - ox, ay: p.y + s[1] - oy, bx: p.x + s[2] - ox, by: p.y + s[3] - oy, r: RIM_R, mu: 0.4, e: 0.2, crr: 0.002, part: p.id }); });
      } else if (p.style === 'ring') {
        var g = ringGeometry(p);
        g.rim.forEach(function (s) { body.shapes.push({ t: 's', ax: p.x + s[0] - ox, ay: p.y + s[1] - oy, bx: p.x + s[2] - ox, by: p.y + s[3] - oy, r: RIM_R, mu: mu, e: e, part: p.id }); });
        g.dividers.forEach(function (s) { body.shapes.push({ t: 's', ax: p.x + s[0] - ox, ay: p.y + s[1] - oy, bx: p.x + s[2] - ox, by: p.y + s[3] - oy, r: DIV_R, mu: mu, e: e, part: p.id }); });
        body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: g.hub, mu: mu, e: e, part: p.id });
      } else {
        body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: p.r, mu: mu, e: e, part: p.id });
      }
    } else if (p.kind === 'ball') {
      var mat = MATERIALS[p.mat] || MATERIALS.plomo;
      body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: p.r, mu: mat.mu, e: mat.e, crr: mat.crr, part: p.id, plane: p.plane || 0 });
    } else if (p.kind === 'bar') {
      body.shapes.push({ t: 's', ax: p.x1 - ox, ay: p.y1 - oy, bx: p.x2 - ox, by: p.y2 - oy, r: barR(p), mu: 0.45, e: 0.3, part: p.id, plane: p.plane || 0 });
    }
  }

  // sitio para una bola en cada compartimento de una rueda de compartimentos
  function ringSlots(wh, br) {
    var g = ringGeometry(wh), rr = wh.r - RIM_R * 2 - br - 0.012, out = [];
    function angleAt(dv) {
      // punto del separador que está a distancia rr del centro
      var ax = dv[0], ay = dv[1], bx = dv[2], by = dv[3], lo = 0, hi = 1;
      for (var i = 0; i < 40; i++) {
        var m = (lo + hi) / 2, x = ax + m * (bx - ax), y = ay + m * (by - ay);
        if (Math.hypot(x, y) < rr) lo = m; else hi = m;
      }
      return Math.atan2(ay + lo * (by - ay), ax + lo * (bx - ax));
    }
    var n = g.dividers.length;
    for (var k = 0; k < n; k++) {
      var a0 = angleAt(g.dividers[k]), a1 = angleAt(g.dividers[(k + 1) % n]);
      while (a1 < a0) a1 += 2 * Math.PI;
      var th = (a0 + a1) / 2;
      out.push({ x: wh.x + rr * Math.cos(th), y: wh.y + rr * Math.sin(th) });
    }
    return out;
  }

  // ---- ejemplos ----
  function exampleMallets() {
    var d = emptyDesign();
    d.example = 'mazos';
    var cx = 0, cy = 0.15, R = 0.5, n = 7, L = 0.32;
    var wh = makeWheel(d, cx, cy, R);
    wh.m = 2.5; wh.spokes = 7; wh.bearing = 'bronce'; wh.rpm = 24;
    d.parts.push(wh);
    for (var k = 0; k < n; k++) {
      var th = Math.PI / 2 - k * 2 * Math.PI / n;
      var hx = cx + R * Math.cos(th), hy = cy + R * Math.sin(th);
      var ex = hx + L * Math.cos(th), ey = hy + L * Math.sin(th);
      var bar = makeBar(d, hx, hy, ex, ey); bar.m = 0.12;
      var ball = makeBall(d, ex, ey); ball.r = 0.065; ball.m = 1; ball.mat = 'plomo';
      d.parts.push(bar, ball);
      var pin = makePin(d, hx, hy, wh.id, bar.id); pin.mode = 'limits'; pin.lo = 0; pin.hi = 100; pin.bearing = 'bronce';
      var weld = makePin(d, ex, ey, bar.id, ball.id); weld.mode = 'rigid';
      d.parts.push(pin, weld);
    }
    return d;
  }

  function exampleBalls() {
    var d = emptyDesign();
    d.example = 'bolas';
    var cx = 0, cy = 0.1, R = 0.6;
    var wh = makeWheel(d, cx, cy, R);
    wh.style = 'ring'; wh.cells = 8; wh.tilt = 40; wh.m = 3; wh.bearing = 'bolas'; wh.rpm = 0;
    d.parts.push(wh);
    ringSlots(wh, 0.05).forEach(function (q) {
      var b = makeBall(d, q.x, q.y);
      b.r = 0.05; b.m = 0.8; b.mat = 'acero';
      d.parts.push(b);
    });
    return d;
  }

  function exampleWilkins() {
    var d = emptyDesign();
    d.example = 'wilkins';
    // rampa de subida con un agujero justo antes del imán
    d.parts.push(makeRamp(d, -0.9, -0.35, 0.2, 0.16));
    d.parts.push(makeRamp(d, 0.3, 0.2064, 0.40, 0.2528));
    // rampa de vuelta, por debajo
    d.parts.push(makeRamp(d, 0.33, 0.06, -0.75, -0.50));
    d.parts.push(makeRamp(d, -0.75, -0.50, -1.0, -0.50));
    d.parts.push(makeRamp(d, -1.0, -0.50, -1.08, -0.40));
    var mg = makeMagnet(d, 0.44, 0.31, null); mg.size = 0.1; mg.ang = 210; mg.mu = magnetModel(mg).mu;
    d.parts.push(mg);
    var ball = makeBall(d, -0.3139, -0.042); ball.r = 0.02; ball.m = 0.26; ball.mat = 'acero';
    d.parts.push(ball);
    return d;
  }

  function exampleMagnetMotor() {
    var d = emptyDesign();
    d.example = 'motor';
    var cx = 0, cy = 0.1, R = 0.32;
    var wh = makeWheel(d, cx, cy, R);
    wh.m = 1.5; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = 40;
    d.parts.push(wh);
    var n = 8;
    for (var k = 0; k < n; k++) {
      var th = k / n * 2 * Math.PI;
      var rr = R - 0.04;
      var m = makeMagnet(d, cx + rr * Math.cos(th), cy + rr * Math.sin(th), wh.id);
      m.ang = (th / DEG) + 45; m.size = 0.03; m.mu = magnetModel(m).mu;
      d.parts.push(m);
    }
    for (var s = 0; s < 3; s++) {
      var ts = Math.PI / 2 + s * 2 * Math.PI / 3 + 0.2;
      var rs = R + 0.06;
      var ms = makeMagnet(d, cx + rs * Math.cos(ts), cy + rs * Math.sin(ts), null);
      ms.ang = (ts / DEG) + 180 - 30; ms.size = 0.032; ms.mu = magnetModel(ms).mu;
      d.parts.push(ms);
    }
    return d;
  }

  function examplePendulum() {
    var d = emptyDesign();
    d.example = 'pendulo';
    var px = 0, py = 0.6, L = 0.75, th = -90 * DEG + 60 * DEG;
    var ex = px + L * Math.cos(th), ey = py + L * Math.sin(th);
    var bar = makeBar(d, px, py, ex, ey); bar.m = 0.1;
    var ball = makeBall(d, ex, ey); ball.r = 0.07; ball.m = 1; ball.mat = 'plomo';
    d.parts.push(bar, ball);
    var pin = makePin(d, px, py, null, bar.id); pin.bearing = 'bolas';
    var weld = makePin(d, ex, ey, bar.id, ball.id); weld.mode = 'rigid';
    d.parts.push(pin, weld);
    return d;
  }

  function exampleLoop() {
    var d = emptyDesign();
    d.example = 'bucle';
    var wh = makeWheel(d, 0, 0.1, 0.4);
    wh.m = 10; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = 60;
    wh.gen = 0.06; wh.motor = true; wh.mrpm = 60; wh.mtorque = 0.6; wh.msrc = 'bus';
    d.parts.push(wh);
    return d;
  }

  function exampleElectro() {
    var d = emptyDesign();
    d.example = 'electro';
    var R = 0.3, wh = makeWheel(d, 0, 0.1, R);
    wh.m = 1.5; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = 20;
    d.parts.push(wh);
    for (var k = 0; k < 6; k++) {
      var th = k * Math.PI / 3, rr = R - 0.04;
      var m = makeMagnet(d, rr * Math.cos(th), 0.1 + rr * Math.sin(th), wh.id);
      m.ang = th / DEG; m.size = 0.03; m.mu = magnetModel(m).mu;
      d.parts.push(m);
    }
    var e = makeMagnet(d, R + 0.075, 0.1, null, 'electro');
    e.ang = 0; e.mu = 6; e.emode = 'window'; e.ewheel = wh.id; e.efrom = 35; e.eto = 58; e.eevery = 60;
    d.parts.push(e);
    return d;
  }

  // motor de imanes con leva: la leva aparta el imán fijo justo antes del «punto pegajoso»
  function exampleCamMotor() {
    var d = emptyDesign();
    d.example = 'leva';
    var cx = 0, cy = 0.12, R = 0.2;
    var wh = makeWheel(d, cx, cy, R);
    wh.m = 2; wh.spokes = 4; wh.bearing = 'bolas'; wh.rpm = 90;
    d.parts.push(wh);
    for (var k = 0; k < 4; k++) {
      var th = k * Math.PI / 2, mg = makeMagnet(d, cx + 0.182 * Math.cos(th), cy + 0.182 * Math.sin(th), wh.id, 'bar');
      mg.ang = th / DEG; d.parts.push(mg);
    }
    var cam = makeCam(d, cx, cy, 0.07);
    cam.lift = 0.018; cam.lobes = 4; cam.phase = 45; cam.bearing = 'bolas';
    d.parts.push(cam);
    var weld = makePin(d, cx, cy, wh.id, cam.id); weld.mode = 'rigid'; d.parts.push(weld);
    // brazo seguidor: bisagra en la pared a la izquierda, rodillo sobre la leva y el imán fijo en la punta
    var rr = 0.012, yb = cy + (cam.r - cam.lift) + rr + CAM_R + 0.002;
    var arm = makeBar(d, -0.12, yb, 0.25, yb); arm.m = 0.06; arm.plane = 1; d.parts.push(arm);
    var piv = makePin(d, -0.12, yb, null, arm.id); piv.bearing = 'bolas'; d.parts.push(piv);
    var roller = makeBall(d, cx, yb); roller.r = rr; roller.m = 0.03; roller.mat = 'plomo'; roller.plane = 1; d.parts.push(roller);
    var rw = makePin(d, cx, yb, arm.id, roller.id); rw.bearing = 'bolas'; d.parts.push(rw);   // el rodillo gira: rueda sobre la leva
    var st = makeMagnet(d, 0.232, yb, arm.id, 'bar');
    st.ang = Math.atan2(yb - cy, 0.232 - cx) / DEG; d.parts.push(st);
    return d;
  }

  // rueda de hámster con imán: una polea con una bola de hierro suelta dentro y un imán por fuera
  function exampleHamster() {
    var d = emptyDesign();
    d.example = 'hamster';
    var cx = 0, cy = 0.38, R = 0.25;
    d.parts.push((function () { var r = makeRamp(d, -0.36, 0.03, 0.36, 0.03); r.mat = 'madera'; return r; })());
    var wh = makeWheel(d, cx, cy, R);
    wh.style = 'rim'; wh.m = 0.6; wh.spokes = 2; wh.bearing = 'bolas'; wh.rpm = 0;
    d.parts.push(wh);
    // la bola, abajo, apoyada en el aro por dentro
    var br = 0.018, rr = R - RIM_R * 2 - br - 0.002;
    var ball = makeBall(d, cx, cy - rr); ball.r = br; ball.m = 0.19; ball.mat = 'acero';
    d.parts.push(ball);
    // el imán, por fuera, abajo a la izquierda, mirando al eje
    var th = -110 * DEG, rm = R + 0.003 + 0.05;
    var mg = makeMagnet(d, +(cx + rm * Math.cos(th)).toFixed(3), +(cy + rm * Math.sin(th)).toFixed(3), null, 'bar');
    mg.size = 0.1; mg.ang = 70; mg.mu = magnetModel(mg).mu;   // un bloque de imanes de neodimio, mirando al eje
    d.parts.push(mg);
    return d;
  }

  // cilindro con imanes en espiral (dos bandas en la maqueta) y una barra arriba con un imán, que gira
  // apoyada a la derecha. Una leva en el lateral del cilindro, siempre tocando la barra, la levanta en el
  // punto muerto (donde la espiral termina y vuelve a empezar) y la deja bajar después. Visto de frente al eje.
  function exampleSpiral(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'espiral';
    var cx = 0, cy = 0.17, R = 0.05;
    var base = makeRamp(d, -0.15, 0.03, 0.17, 0.03); base.mat = 'madera'; d.parts.push(base);
    var wh = makeWheel(d, cx, cy, R);
    wh.m = opts.m || 3; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = opts.rpm != null ? opts.rpm : -150;   // el empujón inicial, al revés que las agujas del reloj
    d.parts.push(wh);
    // 12 imanes en espiral: cada uno un poco más fuera (más cerca del imán de la barra) que el anterior.
    // El último pasa bajo el imán cuando el cilindro ha girado unos 175°, justo cuando la paleta levanta la barra.
    var n = 12;
    for (var k = 0; k < n; k++) {
      var th = ((opts.start != null ? opts.start : 245) - k * 360 / n) * DEG, rk = R - 0.004 + k * 0.0015;
      var mg = makeMagnet(d, +(cx + rk * Math.cos(th)).toFixed(4), +(cy + rk * Math.sin(th)).toFixed(4), wh.id, 'disc');
      mg.size = opts.rotSize || 0.02; mg.ang = Math.round(th / DEG); mg.grade = 'n52'; mg.mu = magnetModel(mg).mu;
      d.parts.push(mg);
    }
    // la leva, en el lateral del cilindro (delante, en el mismo eje): en forma de huevo, con la punta
    // hacia abajo al empezar. Llega arriba cuando la espiral está en su punto muerto.
    // radio de la base fijo (ahí descansa el rodillo); la punta sube «lift» por encima
    var lift = opts.lift != null ? opts.lift : 0.002;   // lo mínimo: cuanto más sube, más gasta
    var cam = makeCam(d, cx, cy, 0.082 + lift);
    cam.lift = lift; cam.lobes = 1; cam.phase = opts.phase != null ? opts.phase : 270; cam.m = 0.05; cam.bearing = 'bolas';
    if (!opts.noCam) { d.parts.push(cam); var cw = makePin(d, cx, cy, wh.id, cam.id); cw.mode = 'rigid'; d.parts.push(cw); }
    // la barra de arriba, con la bisagra a la derecha (en el agarre). De ella baja un vástago con un rodillo
    // que va siempre apoyado en la leva (como el seguidor de una leva) y cuelga el imán, encima del cilindro.
    var rr = opts.rr || 0.014, yr = cy + (cam.r - cam.lift) + CAM_R + rr + 0.001, yl = cy + 0.145;
    var lever = makeBar(d, 0.12, yl, -0.06, yl); lever.m = opts.lm || 0.1; lever.plane = 1; d.parts.push(lever);
    var piv = makePin(d, 0.12, yl, null, lever.id); piv.mode = 'limits'; piv.lo = -60; piv.hi = opts.hi != null ? opts.hi : 1; piv.bearing = 'bolas';
    d.parts.push(piv);
    var stem = makeBar(d, 0.015, yl, 0.015, yr + BAR_R); stem.m = 0.01; stem.plane = 1; d.parts.push(stem);
    var sw = makePin(d, 0.015, yl, lever.id, stem.id); sw.mode = 'rigid'; d.parts.push(sw);
    var roller = makeBall(d, 0.015, yr); roller.r = rr; roller.m = 0.02; roller.mat = opts.rmat || 'madera'; roller.plane = 1; d.parts.push(roller);   // rodillo de plástico o madera: no lo atraen los imanes
    var rp = makePin(d, 0.015, yr, stem.id, roller.id); rp.bearing = 'bolas'; d.parts.push(rp);
    if (opts.spring) {
      // muelle que tira de la barra hacia abajo, para que el rodillo no se despegue de la leva
      var sp = makeSpring(d, -0.05, yl, -0.05, cy - 0.04, lever.id, null); sp.k = opts.spring; sp.rest = (yl - cy + 0.04) - 0.01; sp.damp = 0.05;
      d.parts.push(sp);
    }
    var hy = cy + (opts.hy || 0.094);
    var hanger = makeBar(d, 0, yl, 0, hy + 0.01); hanger.m = 0.01; d.parts.push(hanger);   // en el plano del cilindro: la leva no la toca
    var hw = makePin(d, 0, yl, lever.id, hanger.id); hw.mode = 'rigid'; d.parts.push(hw);
    var st = makeMagnet(d, cx, hy, hanger.id, 'bar');
    st.size = opts.stSize || 0.03; st.ang = opts.stAng != null ? opts.stAng : 90; st.grade = 'n52'; st.mu = magnetModel(st).mu;
    d.parts.push(st);
    return d;
  }

  // la más eficiente: lo que queda del cilindro de imanes al quitar todo lo que gasta o no aporta.
  // Un volante en un rodamiento de bolas y un generador que convierte el giro en electricidad deprisa,
  // antes de que el roce se lo coma.
  function exampleEfficient(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'eficiente';
    var cx = 0, cy = 0.17, R = 0.05;
    var base = makeRamp(d, -0.15, 0.03, 0.17, 0.03); base.mat = 'madera'; d.parts.push(base);
    var wh = makeWheel(d, cx, cy, R);
    wh.m = 3; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = opts.rpm != null ? opts.rpm : -150;
    wh.gen = opts.gen != null ? opts.gen : 0.02; wh.gdest = 'bus';
    d.parts.push(wh);
    return d;
  }

  // Rodillo de flechas (la maqueta del usuario). Cilindro de latón con dos filas de imanes en forma de flecha:
  // 2 flechas por vuelta y en cada una 9 pares que se abren de menos a más (a lo largo del eje); donde acaba
  // abierta empieza cerrada la siguiente. Arriba un palo con un imán de todo el largo del cilindro (norte abajo)
  // y abajo otro igual (norte arriba). Los dos palos van en guías y apoyan un rodillo en la leva de cada lado
  // del cilindro: sube poco a poco y cae de golpe justo después de que el primer par cerrado pase por debajo.
  // Un muelle en cada punta une los dos palos y los aprieta contra las levas. Visto desde un lado, mirando al eje.
  function exampleArrows(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = opts.example || 'flechas';
    d.dt = opts.dt || 1 / 960;   // imanes a milímetros: paso de cálculo más fino
    var cx = 0, cy = 0.13, R = 0.05, LEN = 0.13;
    var FL = 2, PASOS = 9, PASO = 360 / FL / PASOS, MIN = 0.006, MAX = 0.05;
    var TH0 = opts.th0 != null ? opts.th0 : 40;   // ángulo del cilindro que está debajo del imán de arriba al empezar
    var alpha = function (th) { return (90 + th - TH0) * DEG; };   // ángulo del cilindro → ángulo en el dibujo
    var base = makeRamp(d, -0.11, 0.012, 0.11, 0.012); base.mat = 'madera'; d.parts.push(base);
    var wh = makeWheel(d, cx, cy, R);
    wh.m = opts.m || 1.5; wh.spokes = 6; wh.bearing = 'bolas'; wh.rpm = opts.rpm != null ? opts.rpm : 300; wh.len = LEN; wh.look = 'laton';
    d.parts.push(wh);
    // los imanes: disco de 11 mm, el norte hacia fuera; cada par a ±abre a lo largo del eje
    var DS = opts.disc || 0.011, rm = R + DS / 4;
    for (var f = 0; f < FL; f++) for (var k = 0; k < PASOS; k++) {
      var a = alpha(f * 180 + k * PASO), abre = MIN + (MAX - MIN) * k / (PASOS - 1);
      [-1, 1].forEach(function (sz) {
        var mg = makeMagnet(d, +(cx + rm * Math.cos(a)).toFixed(5), +(cy + rm * Math.sin(a)).toFixed(5), wh.id, 'disc');
        mg.size = DS; mg.grade = 'n52'; mg.ang = +(a / DEG).toFixed(2); mg.z = +(sz * abre).toFixed(4); mg.soft = DS / 4; mg.poles = true; mg.mu = magnetModel(mg).mu;
        d.parts.push(mg);
      });
    }
    // la leva (una a cada lado del cilindro, iguales y a la vez: en el dibujo se ven como una):
    // dos puntas, una por flecha; en la rampa la caída empieza justo después del primer par cerrado
    var lift = opts.lift != null ? opts.lift : 0.0165, rTip = opts.camR || 0.046;
    var cam = makeCam(d, cx, cy, rTip);
    cam.lift = lift; cam.lobes = FL; cam.m = 0.1; cam.bearing = 'bolas'; cam.len = LEN + 0.02;
    cam.prof = opts.prof || 'rampa'; cam.sg = 1;
    var thDrop = opts.thDrop != null ? opts.thDrop : 4;   // dónde empieza a caer (0 = el primer par cerrado, justo debajo)
    cam.drop = opts.drop || 0.13;   // la caída ocupa una décima de cada punta: cae de golpe pero sin esquina viva
    if (cam.prof === 'rampa') cam.phase = +(((90 + thDrop - TH0 - (1 - camDrop(cam)) * 360 / FL) % 360 + 360) % 360).toFixed(3);
    else cam.phase = +(((90 + (opts.thPeak != null ? opts.thPeak : 0) - TH0) % 360 + 360) % 360).toFixed(3);   // lisa: la punta donde se pida
    d.parts.push(cam);
    var cw = makePin(d, cx, cy, wh.id, cam.id); cw.mode = 'rigid'; d.parts.push(cw);
    // dónde está la superficie de la leva arriba y abajo al empezar
    var Lb = cam.lobes, liftK = camLift(cam);
    cam.th = 0.0015;   // borde fino: el escalón es un escalón de verdad
    var surf = function (t) { return cam.r - liftK + liftK * camShape(cam, Lb * (t - cam.phase * DEG)) + camRim(cam); };
    // los dos palos: s = +1 arriba, −1 abajo
    var ST = opts.stSize || 0.006, WIDE = opts.wide || 0.015, GAP = opts.gap || 0.004, RR = opts.rr || 0.002, WZ = opts.wz != null ? opts.wz : LEN;
    var top = R + DS / 2;   // cara de fuera de los imanes del cilindro
    var XE = 0.085;         // hasta dónde llega el palo por el lado del muelle, fuera del cilindro
    var sticks = [];
    [1, -1].forEach(function (s) {
      var rs = top + GAP + ST / 2, ys0 = top + GAP + ST + 0.0025;   // centro del imán y del palo, desde el eje
      var yRol = surf(s > 0 ? Math.PI / 2 : -Math.PI / 2) + RR;      // centro del rodillo, desde el eje
      var up = (yRol - (cam.r - liftK + camRim(cam) + RR));                // lo que ya está levantado al empezar
      var ys = cy + s * (ys0 + up);
      var bar = makeBar(d, -0.0075, ys, XE, ys); bar.m = opts.stickM || 0.05; bar.th = 0.0025; d.parts.push(bar);
      var g = makePin(d, 0, ys, null, bar.id); g.mode = 'guia'; g.sang = 90; g.bearing = 'bolas'; d.parts.push(g);
      var st = makeMagnet(d, 0, +(cy + s * (rs + up)).toFixed(5), bar.id, 'bar');
      st.size = ST; st.wide = WIDE; st.ang = s > 0 ? -90 : 90; st.grade = opts.stGrade || 'ferrita'; st.wz = WZ; st.z = 0; st.soft = ST / 4; st.poles = true; st.mu = magnetModel(st).mu;
      d.parts.push(st);
      var yr = cy + s * yRol;
      var stem = makeBar(d, 0, ys, 0, +(yr + s * 0.0015).toFixed(5)); stem.m = 0.003; stem.th = 0.0015; stem.plane = 1; d.parts.push(stem);
      var sw = makePin(d, 0, ys, bar.id, stem.id); sw.mode = 'rigid'; d.parts.push(sw);
      var rol = makeBall(d, 0, +yr.toFixed(5)); rol.r = RR; rol.m = opts.rolM || 0.01; rol.mat = 'madera'; rol.plane = 1; d.parts.push(rol);
      var rp = makePin(d, 0, +yr.toFixed(5), stem.id, rol.id); rp.bearing = 'bolas'; d.parts.push(rp);
      sticks.push(bar);
    });
    // los muelles de las puntas (uno a cada lado: en el dibujo, uno con la fuerza de los dos)
    var xs = XE - 0.016, y1 = sticks[0].y1, y2 = sticks[1].y1;
    var sp = makeSpring(d, xs, y1, xs, y2, sticks[0].id, sticks[1].id);
    // muelle largo y blando: tira casi lo mismo esté como esté (1,5 N), lo justo para que los rodillos no se despeguen
    sp.k = opts.k != null ? opts.k : 10; sp.rest = +((y1 - y2) - (opts.pre != null ? opts.pre : 0.15)).toFixed(4); sp.damp = 0.02;
    d.parts.push(sp);
    return d;
  }

  // El mismo rodillo con las mejoras que propone Claude para que pierda lo menos posible:
  // 1. leva lisa: sube y baja poco a poco (lo que cuesta subir el palo se devuelve al bajarlo; sin escalón no hay golpe),
  //    con lo más alto justo en el salto entre flechas;
  // 2. levanta solo 8 mm (a esa distancia el imán ya casi no tira);
  // 3. rodillos grandes (16 mm), que giran más despacio y gastan menos en su eje;
  // 4. muelles más suaves (lo justo para que el rodillo de abajo no se despegue).
  function exampleArrowsBetter(opts) {
    opts = opts || {};
    return exampleArrows({ example: 'flechas2', rpm: opts.rpm, prof: 'lisa', lift: 0.008, thPeak: -5, rr: 0.008, pre: 0.07 });
  }

  // Cojinetes magnéticos: un cojinete en cada punta del eje. En cada uno, un anillo de discos pegados al eje
  // dentro de otro anillo de discos fijos, todos imantados a lo largo del eje con el norte hacia el mismo lado:
  // se empujan, y el eje queda centrado en el plano (si se acerca a un lado, ese lado empuja más). A lo largo
  // del eje no se aguantan solos (nadie puede, con imanes fijos): ahí lo sujeta una punta de aguja.
  // En el dibujo se ven los dos cojinetes uno encima del otro: los imanes se alternan entre las dos puntas.
  // drop: lo que baja el eje por su peso; el anillo fijo se pone esa altura más arriba para que empiece quieto.
  var BEARING = { n1: 24, n2: 36, s1: 0.012, s2: 0.014, r1: 0.013, r2: 0.031 };
  function addMagBearing(d, wh, zEnd, drop, cfg) {
    var B = cfg || BEARING;
    function ring(n, r, size, host, off, dy) {
      for (var k = 0; k < n; k++) {
        var a = (k + off) / n * 2 * Math.PI;
        var m = makeMagnet(d, +(wh.x + r * Math.cos(a)).toFixed(5), +(wh.y + dy + r * Math.sin(a)).toFixed(5), host, 'disc');
        // los imanes de un cojinete no se tocan nunca (si lo hicieran, el cojinete ya no funcionaría): sin forma de choque
        m.size = size; m.ax = 1; m.ang = 0; m.grade = 'n52'; m.poles = true; m.soft = size / 4; m.plane = 2; m.solid = false;
        m.z = k % 2 ? zEnd : -zEnd; m.mu = magnetModel(m).mu;
        d.parts.push(m);
      }
    }
    ring(B.n1, B.r1, B.s1, wh.id, 0, 0);
    ring(B.n2, B.r2, B.s2, null, 0.5, drop || 0);
  }

  // Volante flotante (lo que propone Claude para sacar el máximo): el mismo cilindro de latón, sin imanes que
  // tiren de él ni leva, flotando en dos cojinetes magnéticos y sujeto a lo largo por una punta de aguja.
  // No toca nada más: lo único que lo frena es el aire y esa punta.
  function exampleFloating(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'flotante';
    var cx = 0, cy = 0.13, R = 0.05, LEN = 0.13;
    var base = makeRamp(d, -0.11, 0.012, 0.11, 0.012); base.mat = 'madera'; d.parts.push(base);
    var wh = makeWheel(d, cx, cy, R);
    wh.m = opts.m || 1.6; wh.spokes = 6; wh.axle = 'levitado'; wh.rpm = opts.rpm != null ? opts.rpm : 300; wh.len = LEN; wh.look = 'laton';
    wh.gen = opts.gen || 0; wh.gdest = 'bus';
    d.parts.push(wh);
    addMagBearing(d, wh, LEN / 2 + 0.02, opts.drop != null ? opts.drop : BEARING_DROP);
    if (opts.air === false) d.air = false;
    return d;
  }
  var BEARING_DROP = 0.00116;   // medido: con 1,6 kg el eje baja 1,16 mm

  // Volante de vacío: lo que más energía guarda de todo lo que se puede montar. Un disco de acero de 20 cm y
  // 12 kg dentro de una cámara de vacío (sin aire que frene), flotando en dos cojinetes magnéticos más fuertes
  // y sujeto a lo largo solo por una punta de aguja, empujado hasta 3.000 rpm. Cuanta más energía lleva, menos
  // se nota lo poco que roza la aguja: a los 10 minutos conserva más del 99,8 % y a la hora más del 99 %.
  var BEARING_BIG = { n1: 32, n2: 48, s1: 0.02, s2: 0.025, r1: 0.026, r2: 0.054 };
  var BEARING_BIG_DROP = 0.0023;   // medido: con 12,3 kg el eje baja 2,3 mm
  function exampleVacuum(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'vacio';
    d.air = false;   // cámara de vacío
    var cx = 0, cy = 0.16, R = 0.1, LEN = 0.05;
    var base = makeRamp(d, -0.16, 0.02, 0.16, 0.02); base.mat = 'madera'; d.parts.push(base);
    var wh = makeWheel(d, cx, cy, R);
    wh.m = opts.m || 12.3; wh.spokes = 8; wh.axle = 'levitado'; wh.rpm = opts.rpm != null ? opts.rpm : 3000; wh.len = LEN; wh.look = 'acero';
    wh.gen = opts.gen || 0; wh.gdest = 'bus';
    d.parts.push(wh);
    addMagBearing(d, wh, LEN / 2 + 0.03, opts.drop != null ? opts.drop : BEARING_BIG_DROP, BEARING_BIG);
    return d;
  }

  // El rodillo de flechas mejorado, flotando en los mismos cojinetes magnéticos en vez de en rodamientos de bolas
  function exampleArrowsFloating(opts) {
    opts = opts || {};
    var d = exampleArrows({ example: 'flechas3', rpm: opts.rpm, prof: 'lisa', lift: 0.008, thPeak: -5, rr: 0.008, pre: 0.07 });
    var wh = d.parts.find(function (p) { return p.kind === 'wheel' && p.style !== 'cam'; });
    wh.axle = 'levitado';
    addMagBearing(d, wh, wh.len / 2 + 0.02, opts.drop != null ? opts.drop : BEARING_DROP);
    return d;
  }

  // Noria de bolas flotantes (el prototipo del usuario): bolas de acero huecas que suben solas por una columna
  // de agua de 1 m, salen por arriba (un deflector las desvía a un canal), caen en una noria de paletas con
  // generador y vuelven rodando por otro canal hasta un hueco en el fondo de la columna, por donde tienen que
  // volver a entrar. El hueco deja pasar las bolas pero no el agua (el mejor cierre posible, sin roce).
  function exampleBuoyBalls(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'flotadores';
    var YB = 0.05, YS = 1.05, X0 = 0, X1 = 0.13, R = 0.05;
    d.parts.push(makeTank(d, X0, YB, X1, YS));
    function wall(x1, y1, x2, y2, mat) { var r = makeRamp(d, x1, y1, x2, y2); r.mat = mat || 'madera'; d.parts.push(r); return r; }
    wall(-0.05, YB - RAMP_R, X1 + 0.03, YB - RAMP_R);                 // fondo
    // la columna sigue por encima del agua: las bolas que van dentro empujan hacia arriba a las que ya han salido,
    // y un techo inclinado empuja la de arriba hacia una salida al lado, por encima del agua
    var TOP = opts.top || 1.20;
    wall(X0 - RAMP_R, YB - RAMP_R, X0 - RAMP_R, TOP + 0.2);                // pared izquierda
    wall(X1 + RAMP_R, YB + 2 * R + 0.02, X1 + RAMP_R, TOP - RAMP_R);       // pared derecha: hueco abajo y salida arriba
    wall(X0 - 0.02, TOP + 0.115, X1 + 0.05, TOP + 0.16);                    // techo inclinado
    wall(X1 + 0.035, TOP - 0.03, 0.40, 1.02);                               // canal hacia la noria
    wall(0.98, 0.42, X1 + 0.06, YB + R + 0.005);                            // canal de vuelta al hueco del fondo
    wall(1.0, 0.40, 1.0, 1.05);                                             // tope del canal de vuelta
    // la noria: un buje con 6 paletas finas, en un rodamiento de bolas y con generador
    var NX = 0.66, NY = 0.78, NR = 0.24;
    var hub = makeWheel(d, NX, NY, 0.035); hub.m = 0.4; hub.spokes = 6; hub.bearing = 'bolas'; hub.rpm = 0; hub.gen = opts.gen != null ? opts.gen : 0.01; hub.gdest = 'bus';
    d.parts.push(hub);
    for (var k = 0; k < 6; k++) {
      var a = k * Math.PI / 3 + 0.2, pb = makeBar(d, NX + 0.035 * Math.cos(a), NY + 0.035 * Math.sin(a), NX + NR * Math.cos(a), NY + NR * Math.sin(a));
      pb.m = 0.05; pb.th = 0.006; d.parts.push(pb);
      var pw = makePin(d, NX + 0.035 * Math.cos(a), NY + 0.035 * Math.sin(a), hub.id, pb.id); pw.mode = 'rigid'; d.parts.push(pw);
    }
    // las bolas: diez llenando la columna, una en cada canal y una esperando en el hueco de abajo
    var spots = [];
    for (var kb = 0; kb < 10; kb++) spots.push([kb % 2 ? 0.08 : 0.05, 0.11 + 0.095 * kb]);   // la columna llena, en zigzag
    spots.push([0.30, 1.12], [0.55, 0.32], [X1 + 0.12, 0.14]);
    spots.forEach(function (q) { var b = makeBall(d, q[0], q[1]); b.r = R; b.m = opts.m || 0.247; b.mat = 'acero'; d.parts.push(b); });
    return d;
  }

  // La rueda de flotadores (la idea clásica): una rueda con 8 bolas huecas en el borde; la mitad derecha va
  // dentro de un tanque de agua y la izquierda fuera, y las bolas cruzan la pared por unos cierres perfectos.
  // A la derecha el agua empuja las bolas hacia arriba; a la izquierda su peso tira hacia abajo: las dos cosas
  // hacen girar la rueda hacia el mismo lado. Pero abajo cada bola tiene que entrar en el agua por la pared.
  function exampleBuoyWheel(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'ruedaflot';
    var CX = 0, CY = 0.5, RR = 0.35, R = 0.05;
    d.parts.push(makeTank(d, 0, 0.05, 0.6, 1.0));
    var base = makeRamp(d, -0.5, 0.038, 0.62, 0.038); base.mat = 'madera'; d.parts.push(base);
    var wh = makeWheel(d, CX, CY, 0.06); wh.m = 0.5; wh.spokes = 8; wh.bearing = 'bolas'; wh.rpm = opts.rpm != null ? opts.rpm : -40; wh.gen = opts.gen || 0; wh.gdest = 'bus';
    d.parts.push(wh);
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4 + Math.PI / 8;
      var arm = makeBar(d, CX + 0.06 * Math.cos(a), CY + 0.06 * Math.sin(a), CX + (RR - R) * Math.cos(a), CY + (RR - R) * Math.sin(a)); arm.m = 0.03; arm.th = 0.006; arm.plane = 1; d.parts.push(arm);
      var aw = makePin(d, CX + 0.06 * Math.cos(a), CY + 0.06 * Math.sin(a), wh.id, arm.id); aw.mode = 'rigid'; d.parts.push(aw);
      var b = makeBall(d, CX + RR * Math.cos(a), CY + RR * Math.sin(a)); b.r = R; b.m = opts.m || 0.247; b.mat = 'acero'; b.plane = 1; d.parts.push(b);
      var bw = makePin(d, CX + RR * Math.cos(a), CY + RR * Math.sin(a), arm.id, b.id); bw.mode = 'rigid'; d.parts.push(bw);
    }
    return d;
  }

  // La catarata de bolas (idea de un usuario): fuera del tanque, una fila de bolas en un tubo baja hasta un
  // codo a 45° y empuja de lado la de abajo, que tapa el hueco del fondo. Las bolas de dentro suben flotando,
  // salen por arriba y caen como una catarata encima de la fila: ese golpe tendría que meter la del hueco.
  function exampleWaterfall(opts) {
    opts = opts || {};
    var d = emptyDesign();
    d.example = 'catarata';
    d.iters = 60;   // una fila larga de bolas apretadas: con menos vueltas se quedan girando en su sitio
    var YB = 0.05, YS = 1.05, X0 = 0, X1 = 0.11, R = 0.05, TOP = 1.20, M = opts.m || 0.247;
    d.parts.push(makeTank(d, X0, YB, X1, YS));
    function wall(x1, y1, x2, y2) { var r = makeRamp(d, x1, y1, x2, y2); r.mat = 'madera'; d.parts.push(r); return r; }
    var YC = YB + R, XH = X1 + R - 0.006, XT = XH + 2 * R;
    var c = XT - YC + Math.SQRT2 * (R + RAMP_R), xf = c + YB - RAMP_R, half = R + 0.006 + RAMP_R, HT = 1.06;
    wall(-0.05, YB - RAMP_R, xf, YB - RAMP_R);                          // fondo, hasta el codo
    wall(xf, YB - RAMP_R, xf + 0.15, YB - RAMP_R + 0.15);               // codo a 45°: la fila empuja de lado la bola del hueco
    wall(X0 - RAMP_R, YB - RAMP_R, X0 - RAMP_R, TOP + 0.25);            // pared izquierda del tanque
    wall(X1 + RAMP_R, YB + 2 * R + 0.02, X1 + RAMP_R, TOP - RAMP_R);    // pared derecha: hueco abajo y salida arriba
    var tx = 0.055 - 0.5 * (R + RAMP_R), ty = TOP + 0.02 + 0.866 * (R + RAMP_R), t30 = Math.tan(Math.PI / 6);
    wall(-0.03, ty + (-0.03 - tx) * t30, X1 + 0.07, ty + (X1 + 0.07 - tx) * t30);   // techo a 30°: echa la de arriba hacia la salida
    wall(X1 + 0.035, TOP - 0.03, XT - half, HT);                        // la catarata, hasta el borde del tubo
    wall(XT - half, YB + 2 * R + 0.02, XT - half, HT);                  // tubo de la fila
    wall(XT + half, XT + half - c, XT + half, TOP + 0.1);
    var spots = [], k;
    for (k = 0; k < 8; k++) spots.push([0.055, TOP + 0.02 - 2 * R * k - 0.0005 * k]);   // la columna del tanque, contra el techo
    spots.push([XH, YC], [XT, YC]);                                     // la que tapa el hueco y la del codo
    for (k = 1; k <= 5; k++) spots.push([XT, YC + 2 * R * k + 0.0005 * k]);             // la fila
    spots.forEach(function (q) { var b = makeBall(d, q[0], q[1]); b.r = R; b.m = M; b.mat = 'acero'; d.parts.push(b); });
    return d;
  }

  var EXAMPLES = {
    mazos: { title: T('Rueda de mazos'), make: exampleMallets },
    bolas: { title: T('Rueda de bolas'), make: exampleBalls },
    wilkins: { title: T('Rampa de Wilkins'), make: exampleWilkins },
    motor: { title: T('Motor de imanes'), make: exampleMagnetMotor },
    pendulo: { title: T('Péndulo de control'), make: examplePendulum },
    bucle: { title: T('Motor que se alimenta solo'), make: exampleLoop },
    electro: { title: T('Rueda con electroimán'), make: exampleElectro },
    leva: { title: T('Motor de imanes con leva'), make: exampleCamMotor },
    hamster: { title: T('Rueda de hámster con imán'), make: exampleHamster },
    espiral: { title: T('Cilindro de imanes con palanca'), make: exampleSpiral },
    eficiente: { title: T('La más eficiente'), make: exampleEfficient },
    flechas: { title: T('Rodillo de flechas'), make: exampleArrows },
    flechas2: { title: T('Rodillo de flechas mejorado'), make: exampleArrowsBetter },
    flechas3: { title: T('Rodillo de flechas flotante'), make: exampleArrowsFloating },
    flotante: { title: T('Volante flotante'), make: exampleFloating },
    vacio: { title: T('Volante de vacío'), make: exampleVacuum },
    flotadores: { title: T('Noria de bolas flotantes'), make: exampleBuoyBalls },
    ruedaflot: { title: T('Rueda de flotadores'), make: exampleBuoyWheel },
    catarata: { title: T('Catarata de bolas'), make: exampleWaterfall }
  };

  root.PerpetuumBuild = {
    build: build, emptyDesign: emptyDesign, find: find, isBodyPart: isBodyPart, ringGeometry: ringGeometry, ringSlots: ringSlots,
    makeWheel: makeWheel, makeCam: makeCam, camProfile: camProfile, makeBall: makeBall, makeBar: makeBar, makeRamp: makeRamp, makePin: makePin,
    makeSpring: makeSpring, makeTank: makeTank, makeMagnet: makeMagnet, partMass: partMass, magSize: magSize, barR: barR, camShape: camShape,
    magnetModel: magnetModel, electroPower: electroPower, GRADES: GRADES, MAG_SHAPES: MAG_SHAPES,
    BEARINGS: BEARINGS, MATERIALS: MATERIALS, GRAVITY: GRAVITY, EXAMPLES: EXAMPLES,
    CAM_DROP: CAM_DROP, exampleArrows: exampleArrows, BAR_R: BAR_R, RAMP_R: RAMP_R, MAG_R: MAG_R, RIM_R: RIM_R, DIV_R: DIV_R, CAM_R: CAM_R
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.PerpetuumBuild;
})(typeof window !== 'undefined' ? window : globalThis);
