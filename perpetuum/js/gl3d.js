/* Taller Perpetuum — vista en perspectiva (three.js). La física es plana; aquí solo se dibuja con profundidad. */
(function (root) {
  'use strict';
  var THREE = root.THREE;
  if (!THREE) { root.PerpetuumGL = null; return; }
  var P = root.PerpetuumBuild;
  var DEG = Math.PI / 180;
  var WALL_Z = -0.26;

  var renderer, scene, camera, ray = new THREE.Raycaster(), ok = false;
  var hemi, sun, wall, wallTex, machine;
  var bodyGroups = new Map(), pickables = [], partObjs = {}, springObjs = [], bulbs = [], motors = [], electros = [];
  var handLine = null, measureLine = null;
  var vw = 300, vh = 300;
  var cam = { yaw: -0.5, pitch: 0.22, dist: 3, tx: 0, ty: 0, tz: 0, fov: 36 };
  var colors = {};
  var lastSel = null, selSaved = new Map();

  function init(canvas) {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    } catch (e) { return false; }
    if (!renderer.getContext()) return false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(cam.fov, 1, 0.02, 60);
    hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.75);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.01;
    scene.add(sun); scene.add(sun.target);
    var fill = new THREE.DirectionalLight(0xffffff, 0.25);
    fill.position.set(2, -1, 3); scene.add(fill);
    machine = new THREE.Group();
    scene.add(machine);
    ok = true;
    return true;
  }

  // calidad: limita la resolución y las sombras en móviles modestos
  var qCap = 2, lastDpr = 1;
  function setQuality(q) {
    if (!ok) return;
    var mobile = (root.matchMedia && root.matchMedia('(max-width: 979px)').matches) || /Android|iPhone|iPad/i.test(navigator.userAgent || '');
    var cores = navigator.hardwareConcurrency || 4, shadows = true, map = 1536;
    if (q === 'low') { qCap = 1; shadows = false; }
    else if (q === 'high') { qCap = 2; map = 2048; }
    else { qCap = mobile ? (cores <= 4 ? 1.25 : 1.75) : 2; shadows = !(mobile && cores <= 4); map = mobile ? 1024 : 1536; }
    renderer.shadowMap.enabled = shadows; sun.castShadow = shadows;
    if (sun.shadow.mapSize.x !== map) { sun.shadow.mapSize.set(map, map); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
    renderer.setPixelRatio(Math.min(lastDpr, qCap));
    renderer.setSize(vw, vh, false);
  }
  function snapshot() { render(); return renderer.domElement; }
  function resize(w, h, dpr) {
    if (!ok) return;
    vw = w; vh = h; lastDpr = dpr;
    dpr = Math.min(dpr, qCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function setColors(c) { colors = c; }

  function col(v, fb) {
    var c;
    try { c = new THREE.Color(v || fb || '#888888'); } catch (e) { c = new THREE.Color(fb || '#888888'); }
    return c.convertSRGBToLinear();
  }
  function mat(color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial({ color: col(color), roughness: rough == null ? 0.6 : rough, metalness: metal || 0 });
    if (extra) Object.keys(extra).forEach(function (k) { m[k] = extra[k]; });
    return m;
  }

  function gridTexture() {
    var c = document.createElement('canvas'), n = 512;
    c.width = c.height = n;
    var g = c.getContext('2d');
    g.fillStyle = colors.paper || '#edf2e8'; g.fillRect(0, 0, n, n);
    g.strokeStyle = colors.grid || '#d3dfcc'; g.lineWidth = 2;
    for (var i = 0; i <= 10; i++) { var p = i * n / 10; g.beginPath(); g.moveTo(p, 0); g.lineTo(p, n); g.moveTo(0, p); g.lineTo(n, p); g.stroke(); }
    g.strokeStyle = colors['grid-strong'] || '#b9cdb0'; g.lineWidth = 4;
    [0, n / 2, n].forEach(function (p) { g.beginPath(); g.moveTo(p, 0); g.lineTo(p, n); g.moveTo(0, p); g.lineTo(n, p); g.stroke(); });
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  var wallParts = {};
  function offsetPart(id, dx, dy) {
    (wallParts[id] || []).forEach(function (o) { o.position.x = o.userData.bx + dx; o.position.y = o.userData.by + dy; });
  }
  function clearMachine() {
    wallParts = {};
    machine.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map && m.map !== wallTex) m.map.dispose(); m.dispose(); }); }
    });
    scene.remove(machine);
    machine = new THREE.Group();
    scene.add(machine);
    bodyGroups = new Map(); pickables = []; partObjs = {}; springObjs = []; bulbs = []; motors = []; electros = [];
    handLine = null; measureLine = null; lastSel = null; selSaved = new Map();
  }

  function addPick(mesh, partId) {
    mesh.userData.partId = partId;
    mesh.castShadow = true; mesh.receiveShadow = true;
    pickables.push(mesh);
    (partObjs[partId] = partObjs[partId] || []).push(mesh);
    return mesh;
  }

  // cilindro alineado con el eje z
  function zCyl(r, len, material, seg) {
    var g = new THREE.CylinderGeometry(r, r, len, seg || 24);
    g.rotateX(Math.PI / 2);
    return new THREE.Mesh(g, material);
  }
  // cilindro entre dos puntos
  function segCyl(x1, y1, x2, y2, r, material, z) {
    var L = Math.hypot(x2 - x1, y2 - y1) || 1e-4;
    var g = new THREE.CylinderGeometry(r, r, L, 14);
    var m = new THREE.Mesh(g, material);
    m.position.set((x1 + x2) / 2, (y1 + y2) / 2, z || 0);
    m.rotation.z = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
    return m;
  }
  function box(w, h, d, material) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material); }

  function groupFor(b) {
    var g = bodyGroups.get(b);
    if (!g) {
      g = new THREE.Group();
      g.userData.body = b;
      bodyGroups.set(b, g);
      machine.add(g);
    }
    return g;
  }

  // profundidad de cada cuerpo: lo que va colgado de una rueda se pone delante de ella
  var FRONT = 0.06;   // distancia entre el plano de la rueda y el de delante (levas)
  function depthMap(info, design) {
    var w = info.world, z = new Map(), wheelBodies = new Set();
    Object.keys(info.wheelJoint).forEach(function (id) { wheelBodies.add(info.wheelJoint[id].b); });
    var ballR = new Map();
    w.bodies.forEach(function (b) {
      var r = 0.012;
      (info.partsOfBody.get(b) || []).forEach(function (p) { if (p.kind === 'ball') r = Math.max(r, p.r); });
      ballR.set(b, r);
    });
    w.bodies.forEach(function (b) {
      if (b.isStatic || wheelBodies.has(b) || !b.group) { z.set(b, 0); return; }
      var asm = info.assemblyOf(b), hasWheel = asm.some(function (o) { return wheelBodies.has(o); });
      if (!hasWheel) { z.set(b, 0); return; }
      var mr = 0.012;
      asm.forEach(function (o) { if (!wheelBodies.has(o)) mr = Math.max(mr, ballR.get(o)); });
      z.set(b, 0.03 + mr);
    });
    // lo que va delante de la rueda (el brazo de una leva) se dibuja delante
    w.bodies.forEach(function (b) {
      var ps = info.partsOfBody.get(b) || [];
      if (!b.isStatic && ps.length && ps.every(function (p) { return p.plane === 1; })) z.set(b, (z.get(b) || 0) + FRONT);
    });
    return z;
  }

  var MAT_LOOK = {
    plomo: ['lead', 0.55, 0.35], acero: ['steel', 0.22, 0.9], madera: ['wood', 0.8, 0], goma: ['rubber', 0.9, 0]
  };

  function rebuild(info, design, extra) {
    if (!ok) return;
    clearMachine();
    if (!wallTex) wallTex = gridTexture();
    // pared del taller
    if (!wall) {
      wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 }));
      wall.receiveShadow = true;
      scene.add(wall);
    }
    wall.position.set(0, 0, WALL_Z);
    wallTex.repeat.set(40, 40);
    wallTex.offset.set(0.5, 0.5);
    wallTex.needsUpdate = true;

    // un cilindro largo (con «len») empuja hacia delante lo que va en el plano de delante (levas, rodillos)
    var maxLen = 0;
    design.parts.forEach(function (p) { if (p.kind === 'wheel' && p.len > 0) maxLen = Math.max(maxLen, p.len); });
    FRONT = Math.max(0.06, maxLen / 2 + 0.016);
    var w = info.world, Z = depthMap(info, design);
    var inkM = mat(colors.ink, 0.45, 0.6), ink2M = mat(colors['ink-2'], 0.5, 0.5);
    function zb(b) { return Z.get(b) || 0; }
    function local(b, x, y) { return { x: x - (b.x0 || 0), y: y - (b.y0 || 0) }; }
    var maxFreeR = 0.03;
    design.parts.forEach(function (p) { if (p.kind === 'ball') maxFreeR = Math.max(maxFreeR, p.r); });

    design.parts.forEach(function (p) {
      var b, g, l, m;
      if (p.kind === 'wheel') {
        b = info.bodyOf[p.id]; g = groupFor(b); l = local(b, p.x, p.y);
        var z0 = zb(b);
        if (p.style === 'cam') {
          // leva: el contorno extruido, delante de la rueda en la que va soldada
          var zc = (p.plane === 0 || b.isStatic) ? z0 : (info.partsOfBody.get(b) || []).every(function (q) { return q.plane === 1; }) ? z0 : z0 + FRONT;
          var shp = new THREE.Shape();
          P.camProfile(p, 72).forEach(function (q, i) { if (i) shp.lineTo(l.x + q[0], l.y + q[1]); else shp.moveTo(l.x + q[0], l.y + q[1]); });
          shp.closePath();
          var cg = new THREE.ExtrudeGeometry(shp, { depth: 0.02, bevelEnabled: false, curveSegments: 4 });
          cg.translate(0, 0, zc - 0.01);
          var cm = new THREE.Mesh(cg, mat(colors.steel, 0.35, 0.85));
          g.add(addPick(cm, p.id));
          if (maxLen > 0 && zc !== z0) {
            // en un cilindro largo hay una leva igual en cada lado
            var cm2 = cm.clone(); cm2.position.z = -2 * (zc - z0); g.add(addPick(cm2, p.id));
          }
          var hc = zCyl(Math.max(0.008, (p.r - (p.lift || 0)) * 0.3), zc - z0 + 0.03, ink2M.clone(), 20);
          hc.position.set(l.x, l.y, (zc + z0) / 2); g.add(addPick(hc, p.id));
        } else if (p.style === 'rim') {
          // aro o polea: la banda del aro con sus dos bordes; el buje y los radios, detrás
          var Dr = Math.max(0.06, 2 * maxFreeR + 0.02);
          var bandR = new THREE.Mesh((function () { var c = new THREE.CylinderGeometry(p.r, p.r, Dr, 72, 1, true); c.rotateX(Math.PI / 2); return c; })(),
            mat(colors.steel, 0.35, 0.85, { side: THREE.DoubleSide }));
          bandR.position.set(l.x, l.y, z0); g.add(addPick(bandR, p.id));
          [-1, 1].forEach(function (sd) {
            var lipR = new THREE.Mesh(new THREE.TorusGeometry(p.r - 0.006, 0.01, 8, 72), mat(colors.steel, 0.3, 0.9));
            lipR.position.set(l.x, l.y, z0 + sd * Dr / 2); g.add(addPick(lipR, p.id));
          });
          var nr = Math.max(1, p.spokes || 2), zs = z0 - Dr / 2 - 0.01;
          for (var kr = 0; kr < nr; kr++) {
            var tr = kr * 2 * Math.PI / nr, spr = box(p.r * 0.96, 0.02, 0.01, ink2M.clone());
            spr.position.set(l.x + Math.cos(tr) * p.r * 0.48, l.y + Math.sin(tr) * p.r * 0.48, zs); spr.rotation.z = tr; g.add(addPick(spr, p.id));
          }
          var hbr = zCyl(Math.max(0.02, p.r * 0.07), 0.03, ink2M.clone(), 24);
          hbr.position.set(l.x, l.y, zs); g.add(addPick(hbr, p.id));
        } else if (p.style === 'ring') {
          var D = Math.max(0.1, 2 * maxFreeR + 0.03), geo = P.ringGeometry(p);
          var back = zCyl(p.r, 0.012, mat(colors.part, 0.8, 0, { transparent: true, opacity: 0.92 }), 64);
          back.position.set(l.x, l.y, z0 - D / 2); g.add(addPick(back, p.id));
          var band = new THREE.Mesh((function () { var c = new THREE.CylinderGeometry(p.r, p.r, D, 64, 1, true); c.rotateX(Math.PI / 2); return c; })(),
            mat(colors.wood, 0.7, 0, { side: THREE.DoubleSide }));
          band.position.set(l.x, l.y, z0); g.add(addPick(band, p.id));
          var lip = new THREE.Mesh(new THREE.TorusGeometry(p.r - 0.004, 0.008, 8, 64), inkM.clone());
          lip.position.set(l.x, l.y, z0 + D / 2); g.add(addPick(lip, p.id));
          geo.dividers.forEach(function (s) {
            var len = Math.hypot(s[2] - s[0], s[3] - s[1]);
            var dv = box(len, 2 * P.DIV_R, D, mat(colors.wood, 0.75, 0));
            dv.position.set(l.x + (s[0] + s[2]) / 2, l.y + (s[1] + s[3]) / 2, z0);
            dv.rotation.z = Math.atan2(s[3] - s[1], s[2] - s[0]);
            g.add(addPick(dv, p.id));
          });
          var hub = zCyl(geo.hub, D, mat(colors.wood, 0.7, 0), 32);
          hub.position.set(l.x, l.y, z0); g.add(addPick(hub, p.id));
        } else if (p.len > 0) {
          // un cilindro largo (como el rodillo de latón de las flechas), con sus dos tapas
          var brass = p.look === 'laton' ? mat('#cfa043', 0.35, 0.55) : (p.look === 'acero' ? mat(colors.steel, 0.3, 0.85) : mat(colors.wood, 0.8, 0));
          var tube = zCyl(p.r, p.len, brass, 72);
          tube.position.set(l.x, l.y, z0); g.add(addPick(tube, p.id));
          [-1, 1].forEach(function (sd) {
            var lid = new THREE.Mesh(new THREE.TorusGeometry(p.r - 0.002, 0.0025, 8, 72), p.look === 'laton' ? mat('#a8812f', 0.4, 0.6) : inkM.clone());
            lid.position.set(l.x, l.y, z0 + sd * p.len / 2); g.add(addPick(lid, p.id));
          });
          var hbl = zCyl(Math.max(0.008, p.r * 0.15), p.len + 0.01, ink2M.clone(), 24);
          hbl.position.set(l.x, l.y, z0); g.add(addPick(hbl, p.id));
        } else {
          var disc = zCyl(p.r, 0.024, mat(colors.wood, 0.8, 0), 72);
          disc.position.set(l.x, l.y, z0); g.add(addPick(disc, p.id));
          var rim = new THREE.Mesh(new THREE.TorusGeometry(p.r - 0.006, 0.013, 10, 72), inkM.clone());
          rim.position.set(l.x, l.y, z0 + 0.012); g.add(addPick(rim, p.id));
          var n = Math.max(3, p.spokes || 8);
          for (var k = 0; k < n; k++) {
            var t = k * 2 * Math.PI / n, sp = box(p.r * 0.84, 0.014, 0.008, ink2M.clone());
            sp.position.set(l.x + Math.cos(t) * p.r * 0.48, l.y + Math.sin(t) * p.r * 0.48, z0 + 0.015);
            sp.rotation.z = t; g.add(addPick(sp, p.id));
          }
          var hb = zCyl(Math.max(0.025, p.r * 0.09), 0.05, ink2M.clone(), 24);
          hb.position.set(l.x, l.y, z0); g.add(addPick(hb, p.id));
        }
        if (p.axle === 'levitado') {
          var hl = (p.len || 0.024) / 2 + 0.03;
          var shaft = zCyl(0.006, 2 * hl, inkM.clone(), 16); shaft.position.set(l.x, l.y, z0); g.add(addPick(shaft, p.id));
          var needle = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.03, 12), mat(colors.steel, 0.3, 0.9));
          needle.rotation.x = -Math.PI / 2; needle.position.set(p.x, p.y, z0 + hl + 0.015); machine.add(needle);
          var jw = info.wheelJoint[p.id];
          if (jw) addDevices(p, jw, machine, p.x, p.y, z0 - hl - 0.04);
        }
        if (p.axle === 'fixed') {
          var ax = zCyl(0.012, z0 - WALL_Z, inkM.clone(), 16);
          ax.position.set(p.x, p.y, (z0 + WALL_Z) / 2); machine.add(ax); ax.castShadow = true;
          var plate = box(0.09, 0.09, 0.012, inkM.clone());
          plate.position.set(p.x, p.y, WALL_Z + 0.006); machine.add(plate);
          var j = info.wheelJoint[p.id];
          if (j) addDevices(p, j, machine, p.x, p.y, z0 - 0.07);
        }
      } else if (p.kind === 'ball') {
        b = info.bodyOf[p.id]; g = groupFor(b); l = local(b, p.x, p.y);
        var lk = MAT_LOOK[p.mat] || MAT_LOOK.plomo;
        m = new THREE.Mesh(new THREE.SphereGeometry(p.r, 28, 18), mat(colors[lk[0]], lk[1], lk[2]));
        m.position.set(l.x, l.y, zb(b)); g.add(addPick(m, p.id));
        var dot = new THREE.Mesh(new THREE.SphereGeometry(p.r * 0.22, 10, 8), mat(colors.ink, 0.5, 0.2));
        dot.position.set(l.x + p.r * 0.62, l.y + p.r * 0.2, zb(b) + p.r * 0.72); g.add(addPick(dot, p.id));
      } else if (p.kind === 'bar') {
        b = info.bodyOf[p.id]; g = groupFor(b);
        var a1 = local(b, p.x1, p.y1), a2 = local(b, p.x2, p.y2);
        if (p.len > 0) {
          // un palo largo que cruza a lo largo del eje: una tabla con ese fondo
          var bl = Math.hypot(a2.x - a1.x, a2.y - a1.y) + 2 * P.barR(p);
          m = box(bl, 2 * P.barR(p), p.len, mat(p.look === 'madera' ? colors.wood : colors['ink-2'], 0.6, p.look === 'madera' ? 0 : 0.6));
          m.position.set((a1.x + a2.x) / 2, (a1.y + a2.y) / 2, zb(b)); m.rotation.z = Math.atan2(a2.y - a1.y, a2.x - a1.x);
        } else m = segCyl(a1.x, a1.y, a2.x, a2.y, P.barR(p), mat(colors['ink-2'], 0.35, 0.75), zb(b));
        g.add(addPick(m, p.id));
      } else if (p.kind === 'ramp') {
        var L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1);
        m = box(L + 2 * P.RAMP_R, 2 * P.RAMP_R, 0.2, mat(p.mat === 'acero' ? colors.steel : (p.mat === 'goma' ? colors.rubber : colors.wood), 0.75, p.mat === 'acero' ? 0.8 : 0));
        m.position.set((p.x1 + p.x2) / 2, (p.y1 + p.y2) / 2, -0.03);
        m.rotation.z = Math.atan2(p.y2 - p.y1, p.x2 - p.x1);
        machine.add(addPick(m, p.id));
      } else if (p.kind === 'magnet') {
        var host = (p.host && info.bodyOf[p.host]) || w.ground;
        g = host.isStatic ? machine : groupFor(host);
        var o = host.isStatic ? { x: 0, y: 0 } : { x: host.x0 || 0, y: host.y0 || 0 };
        // los imanes pegados a una pieza van en su cara delantera, para que se vean
        var zm = p.z != null ? zb(host) + (+p.z || 0) : (host.isStatic ? 0 : zb(host) + 0.014 + P.magnetModel(p).size / 4);
        var mgrp = buildMagnet(p, g, o, zm);
        if (host.isStatic) {
          var mount = zCyl(0.008, zm - WALL_Z, inkM.clone(), 10);
          mount.position.set(p.x, p.y, (zm + WALL_Z) / 2); machine.add(mount);
          // se puede mover con el dedo durante la prueba
          [mgrp, mount].forEach(function (o) { o.userData.bx = o.position.x; o.userData.by = o.position.y; });
          wallParts[p.id] = [mgrp, mount];
        }
      } else if (p.kind === 'pin') {
        var jp = info.jointOf[p.id];
        if (p.mode === 'guia' && jp) {
          // la guía: un carril fijo por el que corre la pieza, y un patín en la pieza
          var ga = (p.sang != null ? p.sang : 90) * DEG, zg = zb(jp.b) - 0.016;
          var rail = box(0.09, 0.008, 0.008, mat(colors.steel, 0.3, 0.85));
          rail.position.set(p.x, p.y, zg); rail.rotation.z = ga;
          (jp.a.isStatic ? machine : groupFor(jp.a)).add(addPick(rail, p.id));
          var shoe = box(0.016, 0.012, 0.012, inkM.clone());
          shoe.position.set(jp.lbx, jp.lby, zg); shoe.rotation.z = ga; groupFor(jp.b).add(addPick(shoe, p.id));
          return;
        }
        if (p.mode === 'rigid' || !jp) {
          b = info.bodyOf[p.b] || w.ground; g = b.isStatic ? machine : groupFor(b); l = b.isStatic ? { x: p.x, y: p.y } : local(b, p.x, p.y);
          m = box(0.022, 0.022, 0.03, inkM.clone());
          m.position.set(l.x, l.y, b.isStatic ? 0 : zb(b)); g.add(addPick(m, p.id));
          return;
        }
        var za = jp.a.isStatic ? WALL_Z : zb(jp.a), zbb = zb(jp.b);
        var zmin = Math.min(za, zbb) - 0.02, zmax = Math.max(za, zbb) + 0.02;
        var pinM = zCyl(0.011, zmax - zmin, mat(colors.panel, 0.4, 0.7), 14);
        g = groupFor(jp.b);
        pinM.position.set(jp.lbx, jp.lby, (zmin + zmax) / 2);
        g.add(addPick(pinM, p.id));
        var cap = zCyl(0.018, 0.008, inkM.clone(), 16);
        cap.position.set(jp.lbx, jp.lby, zmax); g.add(addPick(cap, p.id));
        if (jp.a.isStatic) {
          var pl = box(0.07, 0.07, 0.012, inkM.clone());
          pl.position.set(p.x, p.y, WALL_Z + 0.006); machine.add(pl);
        }
        var host2 = jp.a.isStatic ? machine : groupFor(jp.a);
        addDevices(p, jp, host2, jp.a.isStatic ? p.x : jp.lax, jp.a.isStatic ? p.y : jp.lay, Math.min(za, zbb) - 0.05);
      } else if (p.kind === 'spring') {
        var sObj = { p: p, s: info.springOf[p.id], mesh: null, za: zb((p.a && info.bodyOf[p.a]) || w.ground), zb2: zb((p.b && info.bodyOf[p.b]) || w.ground) };
        springObjs.push(sObj);
      }
    });
    // foto de la maqueta, pegada a la pared como una plantilla
    var ph = extra && extra.photo, img = extra && extra.img;
    if (ph && img) {
      var tex = new THREE.Texture(img); tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true;
      var hgt = ph.w * img.height / img.width;
      var pm = new THREE.Mesh(new THREE.PlaneGeometry(ph.w, hgt), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: Math.max(0.1, Math.min(1, ph.op)), depthWrite: false }));
      pm.position.set(ph.x, ph.y, WALL_Z + 0.003); pm.rotation.z = (ph.rot || 0) * DEG;
      machine.add(pm);
    }
    // el sol apunta a la máquina
    fitShadow();
  }

  function addDevices(p, j, parent, x, y, z) {
    if (p.gen > 0) {
      var gm = zCyl(0.045, 0.07, mat(colors['ink-2'], 0.4, 0.6), 24);
      gm.position.set(x, y, z); parent.add(addPick(gm, p.id));
      var bulbMat = new THREE.MeshStandardMaterial({ color: col('#fff3c4'), emissive: col('#ffcc33'), emissiveIntensity: 0, roughness: 0.3 });
      var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.028, 18, 12), bulbMat);
      bulb.position.set(x + 0.075, y + 0.075, z + 0.02); parent.add(bulb);
      var light = new THREE.PointLight(0xffcc55, 0, 0.8);
      light.position.copy(bulb.position); parent.add(light);
      bulbs.push({ j: j, mat: bulbMat, light: light });
    }
    if (p.motor) {
      var mm = zCyl(0.05, 0.08, mat(colors.accent, 0.45, 0.5), 24);
      mm.position.set(x, y, z - (p.gen > 0 ? 0.08 : 0)); parent.add(addPick(mm, p.id));
      motors.push({ j: j, mat: mm.material, base: mm.material.color.clone() });
    }
  }

  function buildMagnet(p, g, o, z) {
    var model = P.magnetModel(p), a = p.ang * DEG, L = model.size;
    var nM = mat(colors.north, 0.45, 0.2), sM = mat(colors.south, 0.45, 0.2), grey = mat(colors.steel, 0.35, 0.8);
    var grp = new THREE.Group();
    grp.position.set(p.x - o.x, p.y - o.y, z);
    grp.rotation.z = a;
    function half(len, wdt, dep, material, cx) { var m = box(len, wdt, dep, material); m.position.x = cx; grp.add(addPick(m, p.id)); return m; }
    if (model.shape === 'disc' && p.ax) {
      // imantado a lo largo del eje: un disco de cara a nosotros, con el norte delante o detrás
      [[p.ax > 0 ? nM : sM, 1], [p.ax > 0 ? sM : nM, -1]].forEach(function (e) {
        var cm = zCyl(L / 2, L / 4, e[0], 24); cm.position.z = e[1] * L / 8; grp.add(addPick(cm, p.id));
      });
    } else if (model.shape === 'disc' && p.z != null) {
      // un disco tumbado sobre la superficie (el norte hacia fuera): su eje va en la dirección del imán
      [[nM, 1], [sM, -1]].forEach(function (e) {
        var cg = new THREE.CylinderGeometry(L / 2, L / 2, L / 4, 24); cg.rotateZ(-Math.PI / 2);
        var cm = new THREE.Mesh(cg, e[0]); cm.position.x = e[1] * L / 8; grp.add(addPick(cm, p.id));
      });
    } else if (model.shape === 'disc') {
      [[nM, -Math.PI / 2], [sM, Math.PI / 2]].forEach(function (e) {
        var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.absarc(0, 0, L / 2, e[1], e[1] + Math.PI, false);
        var geo = new THREE.ExtrudeGeometry(sh, { depth: L / 2, bevelEnabled: false, curveSegments: 20 });
        geo.translate(0, 0, -L / 4);
        grp.add(addPick(new THREE.Mesh(geo, e[0]), p.id));
      });
    } else if (model.shape === 'horseshoe') {
      var sep = 0.55 * L, w = 0.22 * L, body = mat('#b8322f', 0.5, 0.2);
      [1, -1].forEach(function (sg) {
        var leg = box(L - w, w, w, body); leg.position.set(-w / 2, sg * sep / 2, 0); grp.add(addPick(leg, p.id));
        var tip = box(w, w * 1.02, w * 1.02, sg > 0 ? nM : sM); tip.position.set(L / 2 - w / 2, sg * sep / 2, 0); grp.add(addPick(tip, p.id));
      });
      var bridge = box(w, sep + w, w, body); bridge.position.set(-L / 2 + w / 2, 0, 0); grp.add(addPick(bridge, p.id));
    } else if (model.shape === 'halbach') {
      var n = 5, c = L / n;
      for (var k = 0; k < n; k++) {
        var cube = new THREE.Group(); cube.position.x = (k - 2) * c; cube.rotation.z = k * Math.PI / 2;
        var h1 = box(c / 2, c * 0.96, c * 0.96, nM); h1.position.x = c / 4; cube.add(addPick(h1, p.id));
        var h2 = box(c / 2, c * 0.96, c * 0.96, sM); h2.position.x = -c / 4; cube.add(addPick(h2, p.id));
        grp.add(cube);
      }
    } else if (model.shape === 'electro') {
      var wb = 0.45 * L;
      var core = new THREE.CylinderGeometry(wb * 0.3, wb * 0.3, L, 16); core.rotateZ(Math.PI / 2);
      grp.add(addPick(new THREE.Mesh(core, grey), p.id));
      var coilMat = new THREE.MeshStandardMaterial({ color: col('#b5652b'), roughness: 0.45, metalness: 0.6, emissive: col('#ff7a2a'), emissiveIntensity: 0 });
      var coil = new THREE.CylinderGeometry(wb / 2, wb / 2, L * 0.72, 24); coil.rotateZ(Math.PI / 2);
      grp.add(addPick(new THREE.Mesh(coil, coilMat), p.id));
      var tipN = box(L * 0.06, wb * 0.62, wb * 0.62, nM); tipN.position.x = L / 2 - L * 0.03; grp.add(addPick(tipN, p.id));
      electros.push({ id: p.id, mat: coilMat, tip: nM });
    } else {
      // de barra: con «wide» es plano y ancho, con «wz» largo a lo largo del eje
      var wb2 = L / 2, Wd = p.wide > 0 ? p.wide : wb2, Dz = p.wz > 0 ? p.wz : Wd;
      half(L / 2, Wd, Dz, nM, L / 4);
      half(L / 2, Wd, Dz, sM, -L / 4);
    }
    g.add(grp);
    return grp;
  }

  function fitShadow() {
    var b = new THREE.Box3().setFromObject(machine);
    if (b.isEmpty()) b.set(new THREE.Vector3(-1, -1, -0.3), new THREE.Vector3(1, 1, 0.3));
    var c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
    var r = Math.max(s.x, s.y, 0.5) * 0.9 + 0.3;
    sun.position.set(c.x - r * 0.8, c.y + r * 1.4, c.z + r * 1.6);
    sun.target.position.set(c.x, c.y, WALL_Z);
    var sc = sun.shadow.camera;
    sc.left = -r * 1.4; sc.right = r * 1.4; sc.top = r * 1.4; sc.bottom = -r * 1.4; sc.near = 0.1; sc.far = r * 6;
    sc.updateProjectionMatrix();
  }

  function helixGeometry(ax, ay, az, bx, by, bz) {
    var dx = bx - ax, dy = by - ay, dz = bz - az, L = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-4;
    var u = new THREE.Vector3(dx / L, dy / L, dz / L);
    var nrm = Math.abs(u.z) < 0.9 ? new THREE.Vector3(0, 0, 1).cross(u).normalize() : new THREE.Vector3(1, 0, 0).cross(u).normalize();
    var bin = u.clone().cross(nrm).normalize();
    var pts = [], turns = 10, steps = 160, rad = 0.02, lead = Math.min(0.03, L * 0.1);
    for (var i = 0; i <= steps; i++) {
      var t = i / steps, s = lead + t * (L - 2 * lead), th = t * turns * 2 * Math.PI;
      var r = (i < 4 || i > steps - 4) ? 0 : rad;
      pts.push(new THREE.Vector3(ax + u.x * s + (nrm.x * Math.cos(th) + bin.x * Math.sin(th)) * r,
        ay + u.y * s + (nrm.y * Math.cos(th) + bin.y * Math.sin(th)) * r,
        az + u.z * s + (nrm.z * Math.cos(th) + bin.z * Math.sin(th)) * r));
    }
    pts.unshift(new THREE.Vector3(ax, ay, az)); pts.push(new THREE.Vector3(bx, by, bz));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.0035, 5, false);
  }

  function update(info, state) {
    if (!ok) return;
    // cada grupo tiene sus piezas en coordenadas relativas al centro de masas de diseño (x0, y0)
    bodyGroups.forEach(function (g, b) {
      g.position.set(b.x, b.y, 0);
      g.rotation.z = b.a - (b.a0 || 0);
    });
    springObjs.forEach(function (o) {
      if (!o.s) return;
      var pa = o.s.a.toWorld(o.s.lax, o.s.lay), pb = o.s.b.toWorld(o.s.lbx, o.s.lby);
      if (o.mesh) { o.mesh.geometry.dispose(); }
      else { o.mesh = new THREE.Mesh(undefined, mat(colors['ink-2'], 0.35, 0.8)); o.mesh.castShadow = true; machine.add(addPick(o.mesh, o.p.id)); }
      o.mesh.geometry = helixGeometry(pa.x, pa.y, o.za, pb.x, pb.y, o.zb2);
    });
    bulbs.forEach(function (bl) {
      var lit = Math.min(1, Math.max(0, (bl.j.power || 0) / 1.5));
      bl.mat.emissiveIntensity = 0.1 + 2.2 * lit;
      bl.light.intensity = 1.6 * lit;
    });
    motors.forEach(function (m) {
      var on = (m.j.mpower || 0) > 0.01;
      m.mat.emissive = on ? col(colors.accent) : col('#000000');
      m.mat.emissiveIntensity = on ? 0.35 : 0;
    });
    var eo = info.electroOf || {};
    electros.forEach(function (e) {
      var sw = eo[e.id], on = sw ? sw.on : true;
      e.mat.emissiveIntensity = on ? 0.65 : 0;
    });
    // selección: se ilumina cada material una sola vez y se guarda cómo estaba
    if (state.sel !== lastSel) {
      selSaved.forEach(function (v, m) { m.emissive.copy(v.em); m.emissiveIntensity = v.ei; });
      selSaved = new Map();
      if (state.sel && partObjs[state.sel]) partObjs[state.sel].forEach(function (m) {
        var mt = m.material;
        if (!mt || !mt.emissive || selSaved.has(mt)) return;
        selSaved.set(mt, { em: mt.emissive.clone(), ei: mt.emissiveIntensity });
        mt.emissive.copy(col(colors.accent)); mt.emissiveIntensity = 0.3;
      });
      lastSel = state.sel;
    }
    // mano
    var H = info.world.hand;
    if (H && H.body) {
      var hp = H.body.toWorld(H.lx, H.ly);
      var zz = 0.05;
      if (!handLine) { handLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: col(colors.accent) })); machine.add(handLine); }
      handLine.geometry.setFromPoints([new THREE.Vector3(hp.x, hp.y, zz), new THREE.Vector3(H.tx, H.ty, zz)]);
      handLine.visible = true;
    } else if (handLine) handLine.visible = false;
    // regla
    var me = state.measure;
    if (me && me.b) {
      if (!measureLine) { measureLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: col(colors.accent), dashSize: 0.02, gapSize: 0.012 })); machine.add(measureLine); }
      measureLine.geometry.setFromPoints([new THREE.Vector3(me.a.x, me.a.y, 0.12), new THREE.Vector3(me.b.x, me.b.y, 0.12)]);
      measureLine.computeLineDistances();
      measureLine.visible = true;
    } else if (measureLine) measureLine.visible = false;
  }

  function placeCamera() {
    var cp = Math.cos(cam.pitch);
    camera.position.set(cam.tx + cam.dist * cp * Math.sin(cam.yaw), cam.ty + cam.dist * Math.sin(cam.pitch), cam.tz + cam.dist * cp * Math.cos(cam.yaw));
    camera.lookAt(cam.tx, cam.ty, cam.tz);
    camera.updateMatrixWorld();
  }

  function render() {
    if (!ok) return;
    scene.background = col(colors['paper-deep'] || '#e2eadb');
    placeCamera();
    renderer.render(scene, camera);
  }

  function ndc(px, py) { return new THREE.Vector2(px / vw * 2 - 1, -(py / vh) * 2 + 1); }
  function planePoint(px, py) {
    placeCamera();
    ray.setFromCamera(ndc(px, py), camera);
    var o = ray.ray.origin, d = ray.ray.direction;
    if (Math.abs(d.z) < 1e-6) return null;
    var t = -o.z / d.z;
    if (t < 0) return null;
    return { x: o.x + d.x * t, y: o.y + d.y * t };
  }
  function pick(px, py) {
    placeCamera();
    ray.setFromCamera(ndc(px, py), camera);
    var hits = ray.intersectObjects(pickables, false);
    for (var i = 0; i < hits.length; i++) {
      var id = hits[i].object.userData.partId;
      if (id) return { id: id, x: hits[i].point.x, y: hits[i].point.y, z: hits[i].point.z };
    }
    return null;
  }
  function project(x, y, z) {
    placeCamera();
    var v = new THREE.Vector3(x, y, z || 0).project(camera);
    return { x: (v.x + 1) / 2 * vw, y: (1 - v.y) / 2 * vh };
  }
  function ppm() { return vh / (2 * cam.dist * Math.tan(cam.fov * DEG / 2)); }

  function fit(minx, miny, maxx, maxy) {
    var bw = Math.max(0.4, maxx - minx), bh = Math.max(0.4, maxy - miny);
    cam.tx = (minx + maxx) / 2; cam.ty = (miny + maxy) / 2; cam.tz = 0;
    var aspect = vw / Math.max(1, vh), t = Math.tan(cam.fov * DEG / 2);
    var dH = (bh * 0.65) / t, dW = (bw * 0.62) / (t * aspect);
    cam.dist = Math.max(0.6, Math.max(dH, dW) + 0.3);
  }
  function orbit(dx, dy) {
    cam.yaw = Math.max(-1.35, Math.min(1.35, cam.yaw - dx * 0.006));
    cam.pitch = Math.max(-0.5, Math.min(1.25, cam.pitch + dy * 0.005));
  }
  function zoom(f) { cam.dist = Math.max(0.3, Math.min(25, cam.dist / f)); }
  function pan(dx, dy) {
    var k = 1 / ppm();
    var cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    cam.tx -= dx * k * cy; cam.tz += dx * k * sy;
    cam.ty += dy * k;
    cam.tz = Math.max(-0.2, Math.min(0.2, cam.tz));
  }
  function front() { cam.yaw = 0; cam.pitch = 0; }
  function setTheme(c) { colors = c; if (wallTex) { wallTex.dispose(); wallTex = null; } if (wall) { scene.remove(wall); wall.geometry.dispose(); wall.material.dispose(); wall = null; } }

  root.PerpetuumGL = {
    init: init, resize: resize, setQuality: setQuality, snapshot: snapshot, setColors: setColors, setTheme: setTheme, rebuild: rebuild, update: update, render: render,
    planePoint: planePoint, pick: pick, offsetPart: offsetPart, project: project, ppm: ppm, fit: fit, orbit: orbit, zoom: zoom, pan: pan, front: front,
    cam: cam, ok: function () { return ok; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
