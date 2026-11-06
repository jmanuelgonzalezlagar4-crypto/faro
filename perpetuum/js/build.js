/* Taller Perpetuum — del diseño (lo que dibuja la persona) al mundo simulable. */
(function (root) {
  'use strict';
  var E = root.PerpetuumEngine;
  var DEG = Math.PI / 180;

  var BAR_R = 0.012, RAMP_R = 0.012, MAG_R = 0.016, RIM_R = 0.014, DIV_R = 0.011;

  // Calidad del eje. par de rozamiento = fc·carga + ft0  (fc = coeficiente × radio del eje)
  var BEARINGS = {
    ideal:  { name: 'Sin rozamiento', note: 'No existe en la realidad', axle: [0, 0], pin: [0, 0] },
    bolas:  { name: 'Rodamiento de bolas', note: 'El mejor eje que puedes comprar', axle: [0.0015 * 0.01, 0.002], pin: [0.0015 * 0.004, 0.0004] },
    bronce: { name: 'Casquillo de bronce engrasado', note: 'Típico de un taller', axle: [0.08 * 0.01, 0], pin: [0.08 * 0.004, 0] },
    madera: { name: 'Eje de madera', note: 'Como en las ruedas antiguas', axle: [0.3 * 0.015, 0], pin: [0.3 * 0.006, 0] }
  };

  var MATERIALS = {
    plomo:  { name: 'Plomo', e: 0.05, mu: 0.5, crr: 0.006, steel: false },
    acero:  { name: 'Acero (lo atraen los imanes)', e: 0.55, mu: 0.3, crr: 0.0015, steel: true },
    madera: { name: 'Madera', e: 0.35, mu: 0.45, crr: 0.004, steel: false },
    goma:   { name: 'Goma', e: 0.75, mu: 0.9, crr: 0.012, steel: false }
  };

  var GRAVITY = { tierra: 9.81, luna: 1.62, marte: 3.71 };

  function uid(d) { d.next = (d.next || 1); return 'p' + (d.next++); }

  function find(d, id) {
    for (var i = 0; i < d.parts.length; i++) if (d.parts[i].id === id) return d.parts[i];
    return null;
  }

  function isBodyPart(p) { return p.kind === 'wheel' || p.kind === 'ball' || p.kind === 'bar'; }

  // ---- partes con valores por defecto ----
  function makeWheel(d, x, y, r) {
    return { id: uid(d), kind: 'wheel', x: x, y: y, r: r || 0.5, m: 3, style: 'disc', cells: 8, tilt: 35, spokes: 8,
      axle: 'fixed', bearing: 'bronce', gen: 0, rpm: 0 };
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
    ferrita: { name: 'Ferrita (los negros de nevera)', br: 0.4 },
    n35: { name: 'Neodimio N35', br: 1.2 },
    n52: { name: 'Neodimio N52 (el más fuerte)', br: 1.45 }
  };
  var MAG_SHAPES = {
    bar: 'Imán de barra', disc: 'Imán de disco', horseshoe: 'Imán de herradura',
    halbach: 'Matriz de Halbach', electro: 'Electroimán'
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
    } else {
      var wb = shape === 'electro' ? 0.45 * L : L / 2;
      add(p.x, p.y, a, (legacy || shape === 'electro') ? (p.mu || 8) : mPerV * L * wb * wb);
      cap(p.x - fx * (L / 2 - wb / 2), p.y - fy * (L / 2 - wb / 2), p.x + fx * (L / 2 - wb / 2), p.y + fy * (L / 2 - wb / 2), wb / 2);
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
    var w = new E.World({ g: GRAVITY[d.gravity] || 9.81, airRho: (d.air && !ideal) ? 1.2 : 0 });
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
        var o = { mu: 0.3, e: 0.3, crr: 0.002, part: p.id, massless: true, r: sh.r, t: sh.t };
        if (sh.t === 'c') { var l = host.toLocal(sh.x, sh.y); o.x = l.x; o.y = l.y; }
        else { var la = host.toLocal(sh.ax, sh.ay), lb = host.toLocal(sh.bx, sh.by); o.ax = la.x; o.ay = la.y; o.bx = lb.x; o.by = lb.y; }
        host.shapes.push(o);
      });
      info.magnetOf[p.id] = model.dipoles.map(function (dp) { return w.addMagnet(host, dp.x, dp.y, dp.ang, dp.mu, p.id); });
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

    // 5. ejes de las ruedas
    parts.forEach(function (p) {
      if (p.kind !== 'wheel' || p.axle !== 'fixed') return;
      var b = bodyFor(p.id);
      if (b.isStatic) return;
      var br = BEARINGS[ideal ? 'ideal' : p.bearing] || BEARINGS.bronce;
      var j = w.addJoint(w.ground, b, p.x, p.y, { fc: br.axle[0], ft0: br.axle[1], gen: p.gen || 0, motor: motorOf(p, 1), tag: p.id });
      info.wheelJoint[p.id] = j;
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
      var opt = { fc: br.pin[0], ft0: br.pin[1], gen: p.gen || 0, motor: motorOf(p, flip), tag: p.id };
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
        power: ideal ? 0 : electroPower(p.mu || 8), tag: p.id
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
      if (p.kind !== 'wheel' || !p.rpm || p.axle !== 'fixed') return;
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
    return info;
  }

  // motor: gira hacia la velocidad pedida (positivo = horario) con un par máximo
  function motorOf(p, flip) {
    if (!p.motor) return null;
    return { w: -flip * (p.mrpm || 0) * 2 * Math.PI / 60, tmax: Math.max(0, p.mtorque || 0), src: p.msrc === 'bus' ? 'bus' : 'battery' };
  }

  function partMass(p) {
    if (p.kind === 'wheel') {
      var I = p.style === 'ring' ? 0.85 * p.m * p.r * p.r : 0.5 * p.m * p.r * p.r;
      return { m: p.m, cx: p.x, cy: p.y, I: I };
    }
    if (p.kind === 'ball') return { m: p.m, cx: p.x, cy: p.y, I: 0.4 * p.m * p.r * p.r };
    var L2 = (p.x2 - p.x1) * (p.x2 - p.x1) + (p.y2 - p.y1) * (p.y2 - p.y1);
    return { m: p.m, cx: (p.x1 + p.x2) / 2, cy: (p.y1 + p.y2) / 2, I: p.m * L2 / 12 };
  }

  function partDrag(p) {
    if (p.kind === 'wheel') return { k: 0.5 * 1.0 * (2 * p.r * 0.03), rot: 0.01 * Math.pow(p.r, 4) * (p.style === 'ring' ? 1.5 : 1) };
    if (p.kind === 'ball') return { k: 0.5 * 0.47 * Math.PI * p.r * p.r, rot: 0 };
    var L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1);
    return { k: 0.5 * 1.0 * L * 0.02, rot: 0.5 * 1.0 * 0.02 * Math.pow(L, 4) / 32 };
  }

  function addShapes(body, p, ox, oy) {
    if (p.kind === 'wheel') {
      var mu = 0.45, e = 0.3;
      if (p.style === 'ring') {
        var g = ringGeometry(p);
        g.rim.forEach(function (s) { body.shapes.push({ t: 's', ax: p.x + s[0] - ox, ay: p.y + s[1] - oy, bx: p.x + s[2] - ox, by: p.y + s[3] - oy, r: RIM_R, mu: mu, e: e, part: p.id }); });
        g.dividers.forEach(function (s) { body.shapes.push({ t: 's', ax: p.x + s[0] - ox, ay: p.y + s[1] - oy, bx: p.x + s[2] - ox, by: p.y + s[3] - oy, r: DIV_R, mu: mu, e: e, part: p.id }); });
        body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: g.hub, mu: mu, e: e, part: p.id });
      } else {
        body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: p.r, mu: mu, e: e, part: p.id });
      }
    } else if (p.kind === 'ball') {
      var mat = MATERIALS[p.mat] || MATERIALS.plomo;
      body.shapes.push({ t: 'c', x: p.x - ox, y: p.y - oy, r: p.r, mu: mat.mu, e: mat.e, crr: mat.crr, part: p.id });
    } else if (p.kind === 'bar') {
      body.shapes.push({ t: 's', ax: p.x1 - ox, ay: p.y1 - oy, bx: p.x2 - ox, by: p.y2 - oy, r: BAR_R, mu: 0.45, e: 0.3, part: p.id });
    }
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
    var g = ringGeometry(wh), br = 0.05, rr = R - RIM_R * 2 - br - 0.012;
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
      var b = makeBall(d, cx + rr * Math.cos(th), cy + rr * Math.sin(th));
      b.r = br; b.m = 0.8; b.mat = 'acero';
      d.parts.push(b);
    }
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

  var EXAMPLES = {
    mazos: { title: 'Rueda de mazos', make: exampleMallets },
    bolas: { title: 'Rueda de bolas', make: exampleBalls },
    wilkins: { title: 'Rampa de Wilkins', make: exampleWilkins },
    motor: { title: 'Motor de imanes', make: exampleMagnetMotor },
    pendulo: { title: 'Péndulo de control', make: examplePendulum },
    bucle: { title: 'Motor que se alimenta solo', make: exampleLoop },
    electro: { title: 'Rueda con electroimán', make: exampleElectro }
  };

  root.PerpetuumBuild = {
    build: build, emptyDesign: emptyDesign, find: find, isBodyPart: isBodyPart, ringGeometry: ringGeometry,
    makeWheel: makeWheel, makeBall: makeBall, makeBar: makeBar, makeRamp: makeRamp, makePin: makePin,
    makeSpring: makeSpring, makeMagnet: makeMagnet, partMass: partMass, magSize: magSize,
    magnetModel: magnetModel, electroPower: electroPower, GRADES: GRADES, MAG_SHAPES: MAG_SHAPES,
    BEARINGS: BEARINGS, MATERIALS: MATERIALS, GRAVITY: GRAVITY, EXAMPLES: EXAMPLES,
    BAR_R: BAR_R, RAMP_R: RAMP_R, MAG_R: MAG_R, RIM_R: RIM_R, DIV_R: DIV_R
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.PerpetuumBuild;
})(typeof window !== 'undefined' ? window : globalThis);
