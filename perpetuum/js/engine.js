/* Taller Perpetuum — motor de física 2D (unidades SI, eje y hacia arriba).
   Cuerpos rígidos con círculos y cápsulas, bisagras con topes y rozamiento,
   muelles, imanes (dipolos con potencial conservativo) y contabilidad de energía. */
(function (root) {
  'use strict';

  var MU0 = 4 * Math.PI * 1e-7;
  var KMAG = 1e-7;           // μ0 / 4π
  var MAG_SOFT2 = 0.02 * 0.02;
  var SLOP = 0.002;          // penetración tolerada (m)
  var MARGIN = 0.001;        // distancia a la que se activa un contacto (m)
  var BOUNCE_V = 0.25;       // velocidad mínima para rebotar (m/s)
  var BOUNCE_W = 0.6;        // velocidad angular mínima para rebotar en un tope (rad/s)
  var ANG_SLOP = 0.004;
  var IMPACT_V = 0.03;       // por encima de esto un contacto cuenta como golpe
  var IMPACT_W = 0.1;

  function Body() {
    this.id = 0;
    this.x = 0; this.y = 0; this.a = 0;
    this.vx = 0; this.vy = 0; this.w = 0;
    this.m = 0; this.im = 0; this.I = 0; this.iI = 0;
    this.shapes = [];   // forma local
    this.ws = [];       // forma en el mundo
    this.isStatic = true;
    this.group = 0;
    this.mu = 0.4; this.e = 0.3; this.crr = 0.002;
    this.dragK = 0; this.dragRot = 0;
    this.minx = 0; this.miny = 0; this.maxx = 0; this.maxy = 0;
    this.fx = 0; this.fy = 0; this.ft = 0; // fuerzas explícitas del paso
  }

  Body.prototype.setMass = function (m, I) {
    this.m = m; this.I = I;
    this.im = m > 0 ? 1 / m : 0;
    this.iI = I > 0 ? 1 / I : 0;
    this.isStatic = !(m > 0);
  };

  Body.prototype.updateWorld = function () {
    var c = Math.cos(this.a), s = Math.sin(this.a);
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    for (var i = 0; i < this.shapes.length; i++) {
      var sh = this.shapes[i], w = this.ws[i];
      if (!w) { w = this.ws[i] = { t: sh.t, r: sh.r, x: 0, y: 0, ax: 0, ay: 0, bx: 0, by: 0,
          mu: sh.mu != null ? sh.mu : this.mu, e: sh.e != null ? sh.e : this.e, crr: sh.crr != null ? sh.crr : this.crr, solid: sh.solid !== false, pl: sh.plane || 0 }; }
      if (sh.t === 'c') {
        w.x = this.x + c * sh.x - s * sh.y;
        w.y = this.y + s * sh.x + c * sh.y;
        w.x0 = w.x - sh.r; w.x1 = w.x + sh.r; w.y0 = w.y - sh.r; w.y1 = w.y + sh.r;
        minx = Math.min(minx, w.x0); maxx = Math.max(maxx, w.x1);
        miny = Math.min(miny, w.y0); maxy = Math.max(maxy, w.y1);
      } else {
        w.ax = this.x + c * sh.ax - s * sh.ay;
        w.ay = this.y + s * sh.ax + c * sh.ay;
        w.bx = this.x + c * sh.bx - s * sh.by;
        w.by = this.y + s * sh.bx + c * sh.by;
        w.x0 = Math.min(w.ax, w.bx) - sh.r; w.x1 = Math.max(w.ax, w.bx) + sh.r;
        w.y0 = Math.min(w.ay, w.by) - sh.r; w.y1 = Math.max(w.ay, w.by) + sh.r;
        minx = Math.min(minx, w.x0); maxx = Math.max(maxx, w.x1);
        miny = Math.min(miny, w.y0); maxy = Math.max(maxy, w.y1);
      }
    }
    this.minx = minx; this.miny = miny; this.maxx = maxx; this.maxy = maxy;
  };

  Body.prototype.toWorld = function (lx, ly) {
    var c = Math.cos(this.a), s = Math.sin(this.a);
    return { x: this.x + c * lx - s * ly, y: this.y + s * lx + c * ly };
  };
  Body.prototype.toLocal = function (wx, wy) {
    var c = Math.cos(this.a), s = Math.sin(this.a), dx = wx - this.x, dy = wy - this.y;
    return { x: c * dx + s * dy, y: -s * dx + c * dy };
  };
  Body.prototype.pointVel = function (px, py) {
    return { x: this.vx - this.w * (py - this.y), y: this.vy + this.w * (px - this.x) };
  };
  Body.prototype.containsPoint = function (px, py, pad) {
    pad = pad || 0;
    for (var i = 0; i < this.ws.length; i++) {
      var w = this.ws[i];
      if (w.t === 'c') {
        var dx = px - w.x, dy = py - w.y;
        if (dx * dx + dy * dy <= (w.r + pad) * (w.r + pad)) return true;
      } else {
        var q = closestOnSeg(px, py, w.ax, w.ay, w.bx, w.by);
        var ex = px - q.x, ey = py - q.y;
        if (ex * ex + ey * ey <= (w.r + pad) * (w.r + pad)) return true;
      }
    }
    return false;
  };

  function closestOnSeg(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy, t = 0;
    if (L2 > 1e-12) { t = ((px - ax) * dx + (py - ay) * dy) / L2; t = t < 0 ? 0 : (t > 1 ? 1 : t); }
    return { x: ax + t * dx, y: ay + t * dy, t: t };
  }

  // --- Detección de contactos. La normal va de A hacia B. ---
  var curMargin = MARGIN;
  function pushPoint(out, pax, pay, pbx, pby, ra, rb, fbx, fby) {
    var dx = pbx - pax, dy = pby - pay, d = Math.sqrt(dx * dx + dy * dy);
    var sep = d - ra - rb;
    if (sep > curMargin) return;
    var nx, ny;
    if (d > 1e-9) { nx = dx / d; ny = dy / d; } else { nx = fbx; ny = fby; }
    out.push({ nx: nx, ny: ny, px: pax + nx * (ra + sep * 0.5), py: pay + ny * (ra + sep * 0.5), sep: sep, rc: 0 });
  }

  function collideShapes(A, B, out) {
    var start = out.length;
    if (A.t === 'c' && B.t === 'c') {
      pushPoint(out, A.x, A.y, B.x, B.y, A.r, B.r, 0, 1);
      if (out.length > start) out[start].rc = Math.min(A.r, B.r);
      return;
    }
    if (A.t === 'c' && B.t === 's') {
      var q = closestOnSeg(A.x, A.y, B.ax, B.ay, B.bx, B.by);
      var n = segNormal(B, A.x, A.y, -1);
      pushPoint(out, A.x, A.y, q.x, q.y, A.r, B.r, n.x, n.y);
      if (out.length > start) out[start].rc = A.r;
      return;
    }
    if (A.t === 's' && B.t === 'c') {
      var q2 = closestOnSeg(B.x, B.y, A.ax, A.ay, A.bx, A.by);
      var n2 = segNormal(A, B.x, B.y, 1);
      pushPoint(out, q2.x, q2.y, B.x, B.y, A.r, B.r, n2.x, n2.y);
      if (out.length > start) out[start].rc = B.r;
      return;
    }
    // cápsula contra cápsula: extremos contra segmentos (hasta dos puntos)
    var cand = [];
    var q3;
    q3 = closestOnSeg(A.ax, A.ay, B.ax, B.ay, B.bx, B.by); pushPoint(cand, A.ax, A.ay, q3.x, q3.y, A.r, B.r, 0, 1);
    q3 = closestOnSeg(A.bx, A.by, B.ax, B.ay, B.bx, B.by); pushPoint(cand, A.bx, A.by, q3.x, q3.y, A.r, B.r, 0, 1);
    q3 = closestOnSeg(B.ax, B.ay, A.ax, A.ay, A.bx, A.by); pushPoint(cand, q3.x, q3.y, B.ax, B.ay, A.r, B.r, 0, 1);
    q3 = closestOnSeg(B.bx, B.by, A.ax, A.ay, A.bx, A.by); pushPoint(cand, q3.x, q3.y, B.bx, B.by, A.r, B.r, 0, 1);
    var inter = segIntersect(A, B);
    if (inter) {
      var nb = segNormal(B, (A.ax + A.bx) / 2, (A.ay + A.by) / 2, -1);
      cand.push({ nx: nb.x, ny: nb.y, px: inter.x, py: inter.y, sep: -(A.r + B.r), rc: 0 });
    }
    if (!cand.length) return;
    cand.sort(function (u, v) { return u.sep - v.sep; });
    out.push(cand[0]);
    for (var k = 1; k < cand.length; k++) {
      var c2 = cand[k], dx = c2.px - cand[0].px, dy = c2.py - cand[0].py;
      if (dx * dx + dy * dy > 0.0004) { out.push(c2); break; }
    }
  }

  // normal unitaria del segmento orientada hacia (o desde) un punto
  function segNormal(S, px, py, sign) {
    var dx = S.bx - S.ax, dy = S.by - S.ay, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L, ny = dx / L;
    var side = (px - S.ax) * nx + (py - S.ay) * ny;
    if (side < 0) { nx = -nx; ny = -ny; }
    // n apunta del segmento hacia el punto; con sign < 0 se invierte (del punto al segmento)
    return sign < 0 ? { x: -nx, y: -ny } : { x: nx, y: ny };
  }

  function segIntersect(A, B) {
    var rx = A.bx - A.ax, ry = A.by - A.ay, sx = B.bx - B.ax, sy = B.by - B.ay;
    var den = rx * sy - ry * sx;
    if (Math.abs(den) < 1e-12) return null;
    var qx = B.ax - A.ax, qy = B.ay - A.ay;
    var t = (qx * sy - qy * sx) / den, u = (qx * ry - qy * rx) / den;
    if (t < 0 || t > 1 || u < 0 || u > 1) return null;
    return { x: A.ax + t * rx, y: A.ay + t * ry };
  }

  function collideBodies(A, B, out) {
    for (var i = 0; i < A.ws.length; i++) {
      var sa = A.ws[i];
      if (!sa.solid) continue;
      for (var j = 0; j < B.ws.length; j++) {
        var sb = B.ws[j];
        if (!sb.solid) continue;
        // piezas en planos distintos (por ejemplo una leva delante de la rueda) no chocan
        if (sa.pl !== sb.pl) continue;
        if (sa.x1 + curMargin < sb.x0 || sb.x1 + curMargin < sa.x0 || sa.y1 + curMargin < sb.y0 || sb.y1 + curMargin < sa.y0) continue;
        var n0 = out.length;
        collideShapes(sa, sb, out);
        for (var k = n0; k < out.length; k++) {
          out[k].mu = Math.sqrt(sa.mu * sb.mu);
          out[k].e = Math.max(sa.e, sb.e);
          out[k].crr = Math.max(sa.crr, sb.crr);
        }
      }
    }
  }

  // --- Mundo ---
  function World(opts) {
    opts = opts || {};
    this.g = opts.g != null ? opts.g : 9.81;
    this.dt = opts.dt || 1 / 480;
    this.iters = opts.iters || 24;
    this.posIters = opts.posIters || 3;
    this.jointBeta = opts.jointBeta || 1;
    this.airRho = opts.airRho != null ? opts.airRho : 1.2;
    this.bodies = [];
    this.ground = new Body();
    this.ground.setMass(0, 0);
    this.ground.id = 0;
    this.bodies.push(this.ground);
    this.joints = [];
    this.springs = [];
    this.magnets = [];
    this.steel = [];
    this.hand = null;
    this.t = 0;
    this.contacts = [];
    this.nextId = 1;
    this.ledger = {
      E0: 0, axle: 0, rub: 0, hits: 0, air: 0, springs: 0, gen: 0, hand: 0,
      battery: 0,   // energía que ponen las baterías (motores y electroimanes)
      heat: 0,      // calor en motores, generadores y bobinas
      bus: 0,       // energía eléctrica guardada (lo que producen los generadores y no se gasta)
      busUsed: 0,   // energía de los generadores que han gastado los motores
      gridIn: 0,    // energía tomada de la red eléctrica
      gridOut: 0    // energía vertida a la red eléctrica
    };
    this.genPower = 0;
    // contadores instantáneos (vatios)
    this.meter = { gridIn: 0, battery: 0, gridOut: 0, store: 0 };
    this.electros = [];
    this.GEN_EFF = 0.85;
    this.MOTOR_EFF = 0.8;
    this.stillTime = 0;
  }

  World.prototype.addBody = function (b) {
    b.id = this.nextId++;
    this.bodies.push(b);
    b.updateWorld();
    return b;
  };

  // Bisagra: ancla en coordenadas del mundo
  World.prototype.addJoint = function (a, b, wx, wy, opt) {
    opt = opt || {};
    var la = a.toLocal(wx, wy), lb = b.toLocal(wx, wy);
    var j = {
      a: a, b: b, lax: la.x, lay: la.y, lbx: lb.x, lby: lb.y,
      ref: b.a - a.a,
      limit: !!opt.limit, lo: opt.lo || 0, hi: opt.hi || 0, le: opt.le != null ? opt.le : 0.2,
      fc: opt.fc || 0, ft0: opt.ft0 || 0,        // rozamiento: par = fc·|carga| + ft0
      gen: opt.gen || 0,                          // generador: par = −gen·ω
      motor: opt.motor || null,                   // motor: {w, tmax, src}
      genDest: opt.genDest === 'grid' ? 'grid' : 'bus', // a dónde va lo que produce el generador
      px: 0, py: 0, pAx: 0, pAy: 0, pBx: 0, pBy: 0, jl: 0, jf: 0, lowA: false, upA: false, wr0: 0,
      rax: 0, ray: 0, rbx: 0, rby: 0, k11: 0, k12: 0, k22: 0,
      load: 0, power: 0, tag: opt.tag || null
    };
    this.joints.push(j);
    return j;
  };

  World.prototype.jointAngle = function (j) { return j.b.a - j.a.a - j.ref; };

  World.prototype.addSpring = function (a, b, ax, ay, bx, by, opt) {
    var la = a.toLocal(ax, ay), lb = b.toLocal(bx, by);
    var dx = bx - ax, dy = by - ay;
    // límite de estabilidad: un muelle muy rígido entre piezas muy ligeras vibra más rápido
    // de lo que el paso de simulación puede seguir; se simula con la rigidez máxima posible y se avisa.
    var L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
    var rax = ax - a.x, ray = ay - a.y, rbx = bx - b.x, rby = by - b.y;
    var ca = rax * uy - ray * ux, cb = rbx * uy - rby * ux;
    var inv = a.im + b.im + a.iI * ca * ca + b.iI * cb * cb;
    var meff = inv > 0 ? 1 / inv : 1e9, dt = this.dt;
    var kMax = 0.25 * meff / (dt * dt), cMax = 0.5 * meff / dt;
    var s = {
      a: a, b: b, lax: la.x, lay: la.y, lbx: lb.x, lby: lb.y,
      k: Math.min(opt.k, kMax), rest: opt.rest != null ? opt.rest : L, c: Math.min(opt.c || 0, cMax),
      kAsked: opt.k, cAsked: opt.c || 0, limited: opt.k > kMax || (opt.c || 0) > cMax,
      F: 0, tag: opt.tag || null
    };
    this.springs.push(s);
    return s;
  };

  World.prototype.addMagnet = function (body, wx, wy, ang, mu, tag) {
    var l = body.toLocal(wx, wy);
    var m = { body: body, lx: l.x, ly: l.y, la: ang - body.a, mu: mu, mu0: mu, on: true, wx: 0, wy: 0, dx: 0, dy: 0, fx: 0, fy: 0, tq: 0, tag: tag || null };
    this.magnets.push(m);
    return m;
  };

  // Electroimán: uno o varios dipolos que se encienden y apagan. Encenderlo cerca de otros imanes
  // cambia la energía magnética de golpe: esa diferencia la paga (o la recibe) la batería.
  World.prototype.addElectro = function (mags, opt) {
    var e = { mags: mags, mode: opt.mode || 'always', body: opt.body || null, from: opt.from || 0, to: opt.to || 0,
      every: opt.every || 360, power: opt.power || 0, on: true, tag: opt.tag || null, src: opt.src === 'grid' ? 'grid' : 'battery' };
    this.electros.push(e);
    return e;
  };
  World.prototype._electroWanted = function (e) {
    if (e.mode !== 'window' || !e.body) return true;
    var turn = -(e.body.a - (e.body.a0 || 0)) / Math.PI * 180;   // giro en sentido horario, en grados
    var span = e.to - e.from;
    if (span <= 0) return false;
    var every = Math.max(1, e.every);
    var ph = ((turn - e.from) % every + every) % every;
    return ph < span;
  };
  World.prototype._switchElectros = function (dt) {
    var L = this.ledger, changed = false, i, e;
    this._ePow = { grid: 0, battery: 0 };
    for (i = 0; i < this.electros.length; i++) {
      e = this.electros[i];
      var want = this._electroWanted(e);
      if (want !== e.on) {
        this.updateMagnetPoses();
        var U0 = this.magnetEnergy();
        e.on = want;
        e.mags.forEach(function (m) { m.on = want; m.mu = want ? m.mu0 : 0; });
        var U1 = this.magnetEnergy();
        if (e.src === 'grid') L.gridIn += U1 - U0; else L.battery += U1 - U0;
        changed = true;
      }
      if (e.on && e.power > 0) {
        if (e.src === 'grid') L.gridIn += e.power * dt; else L.battery += e.power * dt;
        L.heat += e.power * dt;
        this._ePow[e.src] += e.power;
      }
    }
    if (changed) { this.updateMagnetPoses(); this.computeMagnetForces(); }
  };

  World.prototype.addSteel = function (body, radius) {
    var V = 4 / 3 * Math.PI * radius * radius * radius;
    var s = { body: body, alpha: 3 * V / (2 * MU0), soft2: (radius + 0.02) * (radius + 0.02), wx: 0, wy: 0, fx: 0, fy: 0 };
    this.steel.push(s);
    return s;
  };

  // --- Imanes ---
  World.prototype.updateMagnetPoses = function () {
    var i, m, b, c, s;
    for (i = 0; i < this.magnets.length; i++) {
      m = this.magnets[i]; b = m.body;
      c = Math.cos(b.a); s = Math.sin(b.a);
      m.wx = b.x + c * m.lx - s * m.ly;
      m.wy = b.y + s * m.lx + c * m.ly;
      m.dx = Math.cos(b.a + m.la); m.dy = Math.sin(b.a + m.la);
    }
    for (i = 0; i < this.steel.length; i++) {
      m = this.steel[i];
      m.wx = m.body.x; m.wy = m.body.y;
    }
  };

  function Upair(ax, ay, adx, ady, amu, bx, by, bdx, bdy, bmu) {
    var rx = bx - ax, ry = by - ay;
    var R2 = rx * rx + ry * ry + MAG_SOFT2, R = Math.sqrt(R2), R5 = R2 * R2 * R;
    return KMAG * amu * bmu / R5 * (R2 * (adx * bdx + ady * bdy) - 3 * (adx * rx + ady * ry) * (bdx * rx + bdy * ry));
  }

  function Bdip(mx, my, mdx, mdy, mu, px, py, out, soft2) {
    var rx = px - mx, ry = py - my;
    var R2 = rx * rx + ry * ry + (soft2 || MAG_SOFT2), R = Math.sqrt(R2), R5 = R2 * R2 * R;
    var dot = mdx * rx + mdy * ry, f = KMAG * mu / R5;
    out.x += f * (3 * dot * rx - R2 * mdx);
    out.y += f * (3 * dot * ry - R2 * mdy);
  }

  World.prototype.fieldAt = function (px, py, skip, soft2, skipBody) {
    var B = { x: 0, y: 0 };
    for (var i = 0; i < this.magnets.length; i++) {
      if (i === skip) continue;
      var m = this.magnets[i];
      if (skipBody && m.body === skipBody) continue;
      Bdip(m.wx, m.wy, m.dx, m.dy, m.mu, px, py, B, soft2);
    }
    return B;
  };

  World.prototype.magnetEnergy = function () {
    var U = 0, i, j, a, b, M = this.magnets;
    for (i = 0; i < M.length; i++) {
      a = M[i];
      for (j = i + 1; j < M.length; j++) {
        b = M[j];
        if (a.body === b.body) continue;
        U += Upair(a.wx, a.wy, a.dx, a.dy, a.mu, b.wx, b.wy, b.dx, b.dy, b.mu);
      }
    }
    for (i = 0; i < this.steel.length; i++) {
      var s = this.steel[i], B = this.fieldAt(s.wx, s.wy, -1, s.soft2, s.body);
      U -= s.alpha * (B.x * B.x + B.y * B.y);
    }
    return U;
  };

  // energía local de un imán i en una pose dada (todo lo que depende de él)
  World.prototype._magLocalU = function (i, x, y, dx, dy) {
    var M = this.magnets, a = M[i], U = 0, j, b;
    for (j = 0; j < M.length; j++) {
      if (j === i) continue;
      b = M[j];
      if (b.body === a.body) continue;
      U += Upair(x, y, dx, dy, a.mu, b.wx, b.wy, b.dx, b.dy, b.mu);
    }
    for (j = 0; j < this.steel.length; j++) {
      var s = this.steel[j];
      if (s.body === a.body) continue;
      var B = this._steelB[j];
      var Bi = { x: B.x - this._steelBi[j][i].x, y: B.y - this._steelBi[j][i].y };
      Bdip(x, y, dx, dy, a.mu, s.wx, s.wy, Bi, s.soft2);
      U -= s.alpha * (Bi.x * Bi.x + Bi.y * Bi.y);
    }
    return U;
  };

  World.prototype.computeMagnetForces = function () {
    var M = this.magnets, S = this.steel;
    if (!M.length) return;
    var i, j, h = 1e-5;
    // campo en cada bola de acero, con la aportación de cada imán por separado
    this._steelB = []; this._steelBi = [];
    for (j = 0; j < S.length; j++) {
      var tot = { x: 0, y: 0 }, parts = [];
      for (i = 0; i < M.length; i++) {
        var p = { x: 0, y: 0 };
        if (M[i].body !== S[j].body) Bdip(M[i].wx, M[i].wy, M[i].dx, M[i].dy, M[i].mu, S[j].wx, S[j].wy, p, S[j].soft2);
        parts.push(p); tot.x += p.x; tot.y += p.y;
      }
      this._steelB.push(tot); this._steelBi.push(parts);
    }
    for (i = 0; i < M.length; i++) {
      var m = M[i];
      m.fx = 0; m.fy = 0; m.tq = 0;
      if (m.body.isStatic) continue;
      var Uxp = this._magLocalU(i, m.wx + h, m.wy, m.dx, m.dy);
      var Uxm = this._magLocalU(i, m.wx - h, m.wy, m.dx, m.dy);
      var Uyp = this._magLocalU(i, m.wx, m.wy + h, m.dx, m.dy);
      var Uym = this._magLocalU(i, m.wx, m.wy - h, m.dx, m.dy);
      var ca = Math.cos(h), sa = Math.sin(h);
      var Uap = this._magLocalU(i, m.wx, m.wy, m.dx * ca - m.dy * sa, m.dx * sa + m.dy * ca);
      var Uam = this._magLocalU(i, m.wx, m.wy, m.dx * ca + m.dy * sa, -m.dx * sa + m.dy * ca);
      m.fx = -(Uxp - Uxm) / (2 * h);
      m.fy = -(Uyp - Uym) / (2 * h);
      m.tq = -(Uap - Uam) / (2 * h);
    }
    for (j = 0; j < S.length; j++) {
      var s = S[j];
      s.fx = 0; s.fy = 0;
      if (s.body.isStatic) continue;
      var self = this;
      var Us = function (x, y) {
        var B = { x: 0, y: 0 };
        for (var k = 0; k < M.length; k++) {
          if (M[k].body === s.body) continue;
          Bdip(M[k].wx, M[k].wy, M[k].dx, M[k].dy, M[k].mu, x, y, B, s.soft2);
        }
        return -s.alpha * (B.x * B.x + B.y * B.y);
      };
      s.fx = -(Us(s.wx + h, s.wy) - Us(s.wx - h, s.wy)) / (2 * h);
      s.fy = -(Us(s.wx, s.wy + h) - Us(s.wx, s.wy - h)) / (2 * h);
    }
  };

  // --- Energía ---
  World.prototype.kinetic = function () {
    var K = 0;
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (b.isStatic) continue;
      K += 0.5 * b.m * (b.vx * b.vx + b.vy * b.vy) + 0.5 * b.I * b.w * b.w;
    }
    return K;
  };
  World.prototype.gravityPE = function () {
    var P = 0;
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (!b.isStatic) P += b.m * this.g * b.y;
    }
    return P;
  };
  World.prototype.springPE = function () {
    var P = 0;
    for (var i = 0; i < this.springs.length; i++) {
      var s = this.springs[i];
      var pa = s.a.toWorld(s.lax, s.lay), pb = s.b.toWorld(s.lbx, s.lby);
      var L = Math.hypot(pb.x - pa.x, pb.y - pa.y);
      P += 0.5 * s.k * (L - s.rest) * (L - s.rest);
    }
    return P;
  };
  World.prototype.energy = function () {
    this.updateMagnetPoses();
    var K = this.kinetic(), Pg = this.gravityPE(), Ps = this.springPE(), Pm = this.magnetEnergy();
    return { K: K, Pg: Pg, Ps: Ps, Pm: Pm, E: K + Pg + Ps + Pm };
  };

  // Antes de empezar: separar piezas que se solapan y cerrar bisagras abiertas.
  // Se hace antes de medir la energía inicial, para que no cuente como energía creada.
  World.prototype.settle = function () {
    for (var it = 0; it < 120; it++) {
      for (var k = 0; k < this.joints.length; k++) this.correctJoint(this.joints[k]);
      this.correctContacts(this.findContacts(), 1);
    }
  };

  World.prototype.start = function () {
    for (var i = 0; i < this.bodies.length; i++) this.bodies[i].updateWorld();
    this.settle();
    var e = this.energy();
    this.ledger.E0 = e.E;
    this.lastE = e;
    this._contacts = null;
  };

  // --- Paso de simulación: velocity Verlet con restricciones tipo RATTLE ---
  // medio impulso de fuerzas → resolver (choques, rozamiento, bisagras que mantienen la posición)
  // → mover → medio impulso de fuerzas → proyectar velocidades sobre las restricciones.

  World.prototype._forces = function () {
    var B = this.bodies, J = this.joints, i, k, b, j;
    for (i = 0; i < B.length; i++) { b = B[i]; b.fx = 0; b.fy = 0; b.ft = 0; }
    // imanes (dependen solo de las posiciones; se calculan una vez por paso)
    for (i = 0; i < this.magnets.length; i++) {
      var m = this.magnets[i];
      if (m.body.isStatic) continue;
      b = m.body;
      b.fx += m.fx; b.fy += m.fy;
      b.ft += (m.wx - b.x) * m.fy - (m.wy - b.y) * m.fx + m.tq;
    }
    for (i = 0; i < this.steel.length; i++) {
      var st = this.steel[i];
      if (st.body.isStatic) continue;
      st.body.fx += st.fx; st.body.fy += st.fy;
    }
    // muelles
    for (i = 0; i < this.springs.length; i++) {
      var s = this.springs[i];
      var pa = s.a.toWorld(s.lax, s.lay), pb = s.b.toWorld(s.lbx, s.lby);
      var dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.sqrt(dx * dx + dy * dy) || 1e-9;
      var ux = dx / len, uy = dy / len;
      var va = s.a.pointVel(pa.x, pa.y), vb = s.b.pointVel(pb.x, pb.y);
      var ldot = (vb.x - va.x) * ux + (vb.y - va.y) * uy;
      var F = s.k * (len - s.rest) + s.c * ldot;   // tracción positiva
      s.F = F; s.len = len; s.cur = { pax: pa.x, pay: pa.y, pbx: pb.x, pby: pb.y, ux: ux, uy: uy };
      applyForce(s.a, F * ux, F * uy, pa.x, pa.y);
      applyForce(s.b, -F * ux, -F * uy, pb.x, pb.y);
    }
    // aire
    var rho = this.airRho;
    for (i = 0; i < B.length; i++) {
      b = B[i];
      if (b.isStatic) continue;
      if (rho <= 0) { b._dfx = 0; b._dfy = 0; b._dft = 0; continue; }
      var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      b._dfx = -rho * b.dragK * sp * b.vx; b._dfy = -rho * b.dragK * sp * b.vy;
      b._dft = -rho * b.dragRot * Math.abs(b.w) * b.w;
      b.fx += b._dfx; b.fy += b._dfy; b.ft += b._dft;
    }
    // generadores y motores
    for (k = 0; k < J.length; k++) {
      j = J[k];
      j._gt = 0; j._mt = 0;
      var wrel = j.b.w - j.a.w;
      if (j.gen) j._gt = -j.gen * wrel;
      if (j.motor) {
        var M = j.motor;
        // control de velocidad: par máximo cuando va 1 rad/s por debajo de la velocidad pedida
        var tq = clamp((M.w - wrel) * M.tmax, -M.tmax, M.tmax);
        if (M.w * wrel > 0 && Math.abs(wrel) > Math.abs(M.w)) tq = 0;  // si va más rápido de lo pedido, gira suelto
        if (M.src === 'bus') {
          var pe = Math.max(0, tq * wrel) / this.MOTOR_EFF * this.dt * 0.5;
          if (pe > 0 && pe > this.ledger.bus) tq *= Math.max(0, this.ledger.bus) / pe;
          if (this.ledger.bus <= 1e-9 && Math.abs(wrel) <= 0.05) tq = 0;
        }
        j._mt = tq;
      }
      var t = j._gt + j._mt;
      if (t) { j.b.ft += t; j.a.ft -= t; }
    }
    // mano
    var H = this.hand;
    if (H && H.body && !H.body.isStatic) {
      var hp = H.body.toWorld(H.lx, H.ly), hv = H.body.pointVel(hp.x, hp.y);
      var meff = H.body.m;
      var om = 2 * Math.PI * 2.5, kk = meff * om * om, cc = 2 * meff * om * 0.8;
      var hfx = kk * (H.tx - hp.x) - cc * hv.x, hfy = kk * (H.ty - hp.y) - cc * hv.y;
      var fmax = 60 * meff + 20, fm = Math.hypot(hfx, hfy);
      if (fm > fmax) { hfx *= fmax / fm; hfy *= fmax / fm; }
      H.fx = hfx; H.fy = hfy; H.px = hp.x; H.py = hp.y;
      applyForce(H.body, hfx, hfy, hp.x, hp.y);
    } else if (H) { H.fx = null; }
  };

  World.prototype._kick = function (h) {
    var B = this.bodies, g = this.g;
    for (var i = 0; i < B.length; i++) {
      var b = B[i];
      // velocidad antes del impulso: sirve para distinguir un choque de verdad de una pieza apoyada
      b.pvx = b.vx; b.pvy = b.vy; b.pw = b.w;
      if (b.isStatic) continue;
      b.vx += b.fx * b.im * h;
      b.vy += (b.fy * b.im - g) * h;
      b.w += b.ft * b.iI * h;
    }
  };

  // trabajo de las fuerzas no conservativas durante medio paso, con la velocidad actual
  World.prototype._work = function (h) {
    var L = this.ledger, B = this.bodies, J = this.joints, i;
    for (i = 0; i < B.length; i++) {
      var b = B[i];
      if (b.isStatic || this.airRho <= 0) continue;
      L.air -= (b._dfx * b.vx + b._dfy * b.vy + b._dft * b.w) * h;
    }
    for (i = 0; i < this.springs.length; i++) {
      var s = this.springs[i];
      if (!s.c) continue;
      var cu = s.cur;
      var va = s.a.pointVel(cu.pax, cu.pay), vb = s.b.pointVel(cu.pbx, cu.pby);
      var ld = (vb.x - va.x) * cu.ux + (vb.y - va.y) * cu.uy;
      L.springs += s.c * ld * ld * h;
    }
    var pw = 0, mt = { gridIn: 0, battery: 0, gridOut: 0, store: 0 };
    if (this._ePow) { mt.gridIn += this._ePow.grid; mt.battery += this._ePow.battery; }
    for (i = 0; i < J.length; i++) {
      var j = J[i], wr = j.b.w - j.a.w;
      j.power = 0; j.mpower = 0;
      if (j._gt) {
        var pabs = -j._gt * wr;                        // potencia mecánica que absorbe el generador
        var pel = pabs * this.GEN_EFF;
        j.power = pel; pw += pel;
        L.gen += pel * h; L.heat += (pabs - pel) * h;
        if (j.genDest === 'grid') { L.gridOut += pel * h; mt.gridOut += pel; } else { L.bus += pel * h; mt.store += pel; }
      }
      if (j._mt) {
        // energía que entra al motor (de la batería o de lo producido) = trabajo mecánico + calor
        var pm = j._mt * wr, pin = pm > 0 ? pm / this.MOTOR_EFF : 0, ein;
        j.mpower = pin;
        if (j.motor.src === 'bus') { ein = Math.min(pin * h, Math.max(0, L.bus)); L.bus -= ein; L.busUsed += ein; }
        else if (j.motor.src === 'grid') { ein = pin * h; L.gridIn += ein; mt.gridIn += pin; }
        else { ein = pin * h; L.battery += ein; mt.battery += pin; }
        L.heat += pm > 0 ? ein - pm * h : -pm * h;
      }
    }
    this.genPower = pw;
    this.meter = mt;
    var H = this.hand;
    if (H && H.body && !H.body.isStatic && H.fx != null) {
      var hv = H.body.pointVel(H.px, H.py);
      L.hand += (H.fx * hv.x + H.fy * hv.y) * h;
    }
  };

  World.prototype._prepContacts = function (C, bounce) {
    var impact = false;
    for (var i = 0; i < C.length; i++) {
      var c = C[i], A = c.A, Bb = c.B;
      c.rax = c.px - A.x; c.ray = c.py - A.y; c.rbx = c.px - Bb.x; c.rby = c.py - Bb.y;
      var rna = c.rax * c.ny - c.ray * c.nx, rnb = c.rbx * c.ny - c.rby * c.nx;
      c.mn = 1 / (A.im + Bb.im + A.iI * rna * rna + Bb.iI * rnb * rnb);
      var tx = -c.ny, ty = c.nx;
      var rta = c.rax * ty - c.ray * tx, rtb = c.rbx * ty - c.rby * tx;
      c.mt = 1 / (A.im + Bb.im + A.iI * rta * rta + Bb.iI * rtb * rtb);
      // velocidad normal mínima permitida: puede acercarse justo hasta tocar
      var v = relVel(A, Bb, c), vn = v.x * c.nx + v.y * c.ny;
      c.bias = -Math.max(c.sep, 0) / this.dt;
      var hits = c.sep + vn * this.dt < 0;
      var vn0 = ((Bb.pvx - Bb.pw * c.rby) - (A.pvx - A.pw * c.ray)) * c.nx + ((Bb.pvy + Bb.pw * c.rbx) - (A.pvy + A.pw * c.rax)) * c.ny;
      if (hits && vn0 < -IMPACT_V) impact = true;
      if (bounce && hits && vn < -BOUNCE_V) c.bias = -c.e * vn;
      c.jn = 0; c.jt = 0; c.jr = 0;
      c.kr = A.iI + Bb.iI;
    }
    return impact;
  };

  World.prototype._prepJoints = function (phaseA) {
    var J = this.joints, dt = this.dt, impact = false;
    for (var k = 0; k < J.length; k++) {
      var j = J[k], a = j.a, bb = j.b;
      var ca = Math.cos(a.a), sa = Math.sin(a.a), cb = Math.cos(bb.a), sb = Math.sin(bb.a);
      j.rax = ca * j.lax - sa * j.lay; j.ray = sa * j.lax + ca * j.lay;
      j.rbx = cb * j.lbx - sb * j.lby; j.rby = sb * j.lbx + cb * j.lby;
      var mA = a.im, mB = bb.im, iA = a.iI, iB = bb.iI;
      j.k11 = mA + mB + iA * j.ray * j.ray + iB * j.rby * j.rby;
      j.k12 = -iA * j.rax * j.ray - iB * j.rbx * j.rby;
      j.k22 = mA + mB + iA * j.rax * j.rax + iB * j.rbx * j.rbx;
      j.det = j.k11 * j.k22 - j.k12 * j.k12;
      j.kAng = iA + iB;
      j.maxFric = (j.fc * j.load + j.ft0) * dt * 0.5;
      j.jf = 0; j.jl = 0;
      var ang = this.jointAngle(j), wr = bb.w - a.w, nxt = ang + wr * dt, wr0 = bb.pw - a.pw;
      j.lowA = j.limit && (ang <= j.lo + ANG_SLOP || nxt < j.lo);
      j.upA = j.limit && (ang >= j.hi - ANG_SLOP || nxt > j.hi);
      j.lowT = -Math.max(ang - j.lo, 0) / dt;   // puede acercarse hasta el tope
      j.upT = Math.max(j.hi - ang, 0) / dt;
      if (j.lowA && nxt < j.lo) {
        if (wr0 < -IMPACT_W) impact = true;
        if (wr < -BOUNCE_W) j.lowT = -j.le * wr;
      }
      if (j.upA && nxt > j.hi) {
        if (wr0 > IMPACT_W) impact = true;
        if (wr > BOUNCE_W) j.upT = -j.le * wr;
      }
      j.phaseA = phaseA;
      // arranque en caliente con el impulso de la misma fase del paso anterior
      var wpx = (phaseA ? j.pAx : j.pBx) * 0.9, wpy = (phaseA ? j.pAy : j.pBy) * 0.9;
      j.px = wpx; j.py = wpy;
      applyImpulse(a, -wpx, -wpy, j.rax, j.ray);
      applyImpulse(bb, wpx, wpy, j.rbx, j.rby);
    }
    return impact;
  };

  World.prototype._solve = function (C, phaseA) {
    var J = this.joints, dt = this.dt, i, k, j;
    for (var it = 0; it < this.iters; it++) {
      for (k = 0; k < J.length; k++) {
        j = J[k];
        var aa = j.a, b2 = j.b;
        if (j.kAng > 0) {
          if (j.maxFric > 0) {
            var lf = -(b2.w - aa.w) / j.kAng, old = j.jf;
            j.jf = clamp(old + lf, -j.maxFric, j.maxFric); lf = j.jf - old;
            aa.w -= aa.iI * lf; b2.w += b2.iI * lf;
          }
          if (j.lowA && !j.upA) {
            var ll = -((b2.w - aa.w) - j.lowT) / j.kAng, oldl = j.jl;
            j.jl = Math.max(oldl + ll, 0); ll = j.jl - oldl;
            aa.w -= aa.iI * ll; b2.w += b2.iI * ll;
          } else if (j.upA && !j.lowA) {
            var lu = -((b2.w - aa.w) - j.upT) / j.kAng, oldu = j.jl;
            j.jl = Math.min(oldu + lu, 0); lu = j.jl - oldu;
            aa.w -= aa.iI * lu; b2.w += b2.iI * lu;
          } else if (j.lowA && j.upA) {
            var lb = -(b2.w - aa.w) / j.kAng;
            j.jl += lb;
            aa.w -= aa.iI * lb; b2.w += b2.iI * lb;
          }
        }
        var vax = aa.vx - aa.w * j.ray, vay = aa.vy + aa.w * j.rax;
        var vbx = b2.vx - b2.w * j.rby, vby = b2.vy + b2.w * j.rbx;
        var cx = vbx - vax, cy = vby - vay;
        if (phaseA) {
          // que el punto común siga unido al final del paso (término centrípeto)
          var h = 0.5 * dt;
          cx -= h * (b2.w * b2.w * j.rbx - aa.w * aa.w * j.rax);
          cy -= h * (b2.w * b2.w * j.rby - aa.w * aa.w * j.ray);
        }
        if (j.det > 1e-14) {
          var ix = -(j.k22 * cx - j.k12 * cy) / j.det;
          var iy = -(-j.k12 * cx + j.k11 * cy) / j.det;
          j.px += ix; j.py += iy;
          applyImpulse(aa, -ix, -iy, j.rax, j.ray);
          applyImpulse(b2, ix, iy, j.rbx, j.rby);
        }
      }
      for (i = 0; i < C.length; i++) {
        var q = C[i], QA = q.A, QB = q.B;
        var v = relVel(QA, QB, q);
        var ttx = -q.ny, tty = q.nx;
        var vt = v.x * ttx + v.y * tty;
        var lt = -q.mt * vt, maxT = q.mu * q.jn, oldt = q.jt;
        q.jt = clamp(oldt + lt, -maxT, maxT); lt = q.jt - oldt;
        applyImpulse(QA, -lt * ttx, -lt * tty, q.rax, q.ray);
        applyImpulse(QB, lt * ttx, lt * tty, q.rbx, q.rby);
        if (q.rc > 0 && q.crr > 0 && q.kr > 0) {
          var lr = -(QB.w - QA.w) / q.kr, maxR = q.crr * q.rc * q.jn, oldr = q.jr;
          q.jr = clamp(oldr + lr, -maxR, maxR); lr = q.jr - oldr;
          QA.w -= QA.iI * lr; QB.w += QB.iI * lr;
        }
        v = relVel(QA, QB, q);
        var vn = v.x * q.nx + v.y * q.ny;
        var ln = -q.mn * (vn - q.bias), oldn = q.jn;
        q.jn = Math.max(oldn + ln, 0); ln = q.jn - oldn;
        applyImpulse(QA, -ln * q.nx, -ln * q.ny, q.rax, q.ray);
        applyImpulse(QB, ln * q.nx, ln * q.ny, q.rbx, q.rby);
      }
    }
    // guardar impulsos para el arranque en caliente
    for (k = 0; k < J.length; k++) {
      j = J[k];
      if (phaseA) { j.pAx = j.px; j.pAy = j.py; } else { j.pBx = j.px; j.pBy = j.py; }
    }
  };

  // energía disipada por rozamiento en la fase recién resuelta
  World.prototype._frictionLoss = function (C) {
    var J = this.joints, axle = 0, rub = 0, i;
    for (i = 0; i < J.length; i++) {
      var j = J[i];
      if (j.maxFric > 0) axle -= j.jf * (j.b.w - j.a.w);
    }
    for (i = 0; i < C.length; i++) {
      var q = C[i], v = relVel(q.A, q.B, q);
      rub -= q.jt * (v.x * -q.ny + v.y * q.nx);
      if (q.jr) rub -= q.jr * (q.B.w - q.A.w);
    }
    this.ledger.axle += axle; this.ledger.rub += rub;
    return axle + rub;
  };

  World.prototype.step = function () {
    var dt = this.dt, B = this.bodies, J = this.joints, L = this.ledger, i, b;
    if (!this._contacts) {
      for (i = 0; i < B.length; i++) B[i].updateWorld();
      this.updateMagnetPoses(); this.computeMagnetForces();
      this._contacts = this.findContacts();
    }
    for (i = 0; i < J.length; i++) {
      var jj = J[i];
      var px = (jj.pAx || 0) + (jj.pBx || 0), py = (jj.pAy || 0) + (jj.pBy || 0);
      jj.load = Math.sqrt(px * px + py * py) / dt;
    }
    var C = this._contacts;
    if (this.electros.length) this._switchElectros(dt);

    // fase A
    this._forces();
    this._kick(0.5 * dt);
    var KE1 = this.kinetic();
    var impact = this._prepContacts(C, true);
    if (this._prepJoints(true)) impact = true;
    this._solve(C, true);
    var fr = this._frictionLoss(C);
    var KE2 = this.kinetic();
    if (impact) L.hits += (KE1 - KE2) - fr;
    this._work(0.5 * dt);

    // mover
    for (i = 0; i < B.length; i++) {
      b = B[i];
      if (b.isStatic) continue;
      b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.w * dt;
      b.updateWorld();
    }
    for (var pi = 0; pi < this.posIters; pi++) {
      for (i = 0; i < J.length; i++) this.correctJoint(J[i]);
      this.correctContacts(C);
    }

    // fase B
    this.updateMagnetPoses(); this.computeMagnetForces();
    C = this._contacts = this.findContacts();
    this._forces();
    this._kick(0.5 * dt);
    var KE3 = this.kinetic();
    impact = this._prepContacts(C, true);
    if (this._prepJoints(false)) impact = true;
    this._solve(C, false);
    fr = this._frictionLoss(C);
    if (impact) L.hits += (KE3 - this.kinetic()) - fr;
    this._work(0.5 * dt);

    this.t += dt;
    var H = this.hand, moving = false;
    for (i = 0; i < B.length; i++) {
      b = B[i];
      if (b.isStatic) continue;
      // una pieza pequeña que solo se mece un poco (una bola en un hueco) cuenta como parada: se mide la velocidad del borde
      var ext = Math.min(Math.max(0.5 * Math.hypot(b.maxx - b.minx, b.maxy - b.miny), 0.05), 0.333);
      if (Math.abs(b.vx) > 0.004 || Math.abs(b.vy) > 0.004 || Math.abs(b.w) * ext > 0.004) { moving = true; break; }
    }
    if (moving || (H && H.body)) this.stillTime = 0; else this.stillTime += dt;
    this.contacts = C;
  };

  World.prototype.correctJoint = function (j) {
    var a = j.a, b = j.b;
    var ca = Math.cos(a.a), sa = Math.sin(a.a), cb = Math.cos(b.a), sb = Math.sin(b.a);
    var rax = ca * j.lax - sa * j.lay, ray = sa * j.lax + ca * j.lay;
    var rbx = cb * j.lbx - sb * j.lby, rby = sb * j.lbx + cb * j.lby;
    // topes
    if (j.limit && (a.iI + b.iI) > 0) {
      var ang = b.a - a.a - j.ref, Cang = 0;
      if (ang < j.lo - ANG_SLOP) Cang = ang - j.lo + ANG_SLOP;
      else if (ang > j.hi + ANG_SLOP) Cang = ang - j.hi - ANG_SLOP;
      if (Cang) {
        Cang = clamp(Cang * 0.5, -0.1, 0.1);
        var li = -Cang / (a.iI + b.iI);
        a.a -= a.iI * li; b.a += b.iI * li;
        ca = Math.cos(a.a); sa = Math.sin(a.a); cb = Math.cos(b.a); sb = Math.sin(b.a);
        rax = ca * j.lax - sa * j.lay; ray = sa * j.lax + ca * j.lay;
        rbx = cb * j.lbx - sb * j.lby; rby = sb * j.lbx + cb * j.lby;
      }
    }
    var cx = (b.x + rbx) - (a.x + rax), cy = (b.y + rby) - (a.y + ray);
    if (cx * cx + cy * cy < 1e-12) return;
    var mA = a.im, mB = b.im, iA = a.iI, iB = b.iI;
    var k11 = mA + mB + iA * ray * ray + iB * rby * rby;
    var k12 = -iA * rax * ray - iB * rbx * rby;
    var k22 = mA + mB + iA * rax * rax + iB * rbx * rbx;
    var det = k11 * k22 - k12 * k12;
    if (det < 1e-14) return;
    var beta = this.jointBeta;
    var ix = -beta * (k22 * cx - k12 * cy) / det, iy = -beta * (-k12 * cx + k11 * cy) / det;
    a.x -= mA * ix; a.y -= mA * iy; a.a -= iA * (rax * iy - ray * ix);
    b.x += mB * ix; b.y += mB * iy; b.a += iB * (rbx * iy - rby * ix);
    if (!a.isStatic) a.updateWorld();
    if (!b.isStatic) b.updateWorld();
  };

  World.prototype.correctContacts = function (C, beta) {
    var seen = [], i;
    for (i = 0; i < C.length; i++) {
      var A = C[i].A, B = C[i].B, key = A.id * 100000 + B.id;
      if (seen.indexOf(key) >= 0) continue;
      seen.push(key);
      var pts = [];
      collideBodies(A, B, pts);
      for (var k = 0; k < pts.length; k++) {
        var p = pts[k];
        var Cn = clamp((beta || 0.4) * (p.sep + SLOP), -0.03, 0);
        if (Cn >= 0) continue;
        var rax = p.px - A.x, ray = p.py - A.y, rbx = p.px - B.x, rby = p.py - B.y;
        var rna = rax * p.ny - ray * p.nx, rnb = rbx * p.ny - rby * p.nx;
        var K = A.im + B.im + A.iI * rna * rna + B.iI * rnb * rnb;
        if (K <= 0) continue;
        var imp = -Cn / K;
        A.x -= A.im * imp * p.nx; A.y -= A.im * imp * p.ny; A.a -= A.iI * imp * rna;
        B.x += B.im * imp * p.nx; B.y += B.im * imp * p.ny; B.a += B.iI * imp * rnb;
        if (!A.isStatic) A.updateWorld();
        if (!B.isStatic) B.updateWorld();
      }
    }
  };

  World.prototype.findContacts = function () {
    var B = this.bodies, out = [], i, k, dt = this.dt;
    for (i = 0; i < B.length; i++) {
      var b0 = B[i];
      if (b0.isStatic) { b0.spec = 0; continue; }
      var ext = 0.5 * Math.hypot(b0.maxx - b0.minx, b0.maxy - b0.miny);
      b0.spec = (Math.hypot(b0.vx, b0.vy) + Math.abs(b0.w) * ext) * dt * 1.2;
    }
    for (i = 0; i < B.length; i++) {
      var A = B[i];
      for (k = i + 1; k < B.length; k++) {
        var Bb = B[k];
        if (A.isStatic && Bb.isStatic) continue;
        if (A.group !== 0 && A.group === Bb.group) continue;
        var mg = MARGIN + A.spec + Bb.spec;
        if (A.maxx + mg < Bb.minx || Bb.maxx + mg < A.minx || A.maxy + mg < Bb.miny || Bb.maxy + mg < A.miny) continue;
        var pts = [];
        curMargin = mg;
        collideBodies(A, Bb, pts);
        curMargin = MARGIN;
        for (var p = 0; p < pts.length; p++) {
          var c = pts[p];
          c.A = A; c.B = Bb;
          out.push(c);
        }
      }
    }
    return out;
  };

  function relVel(A, B, c) {
    return {
      x: (B.vx - B.w * c.rby) - (A.vx - A.w * c.ray),
      y: (B.vy + B.w * c.rbx) - (A.vy + A.w * c.rax)
    };
  }
  function applyImpulse(b, ix, iy, rx, ry) {
    if (b.isStatic) return;
    b.vx += ix * b.im; b.vy += iy * b.im;
    b.w += b.iI * (rx * iy - ry * ix);
  }
  function applyForce(b, fx, fy, px, py) {
    if (b.isStatic) return;
    b.fx += fx; b.fy += fy;
    b.ft += (px - b.x) * fy - (py - b.y) * fx;
  }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  World.prototype.isStopped = function () { return this.stillTime > 1.5; };

  // La mano mueve un imán sujeto a la pared durante la prueba (como quien acerca un imán a una maqueta).
  // Lo que cambia la energía de los imanes al moverlo es el trabajo de la mano: se apunta en «hand».
  // No deja meter el imán dentro de otra pieza, porque eso empujaría sin pasar por la cuenta de la mano.
  World.prototype.moveFixedMagnet = function (tag, dx, dy) {
    var g = this.ground, ms = this.magnets.filter(function (m) { return m.tag === tag && m.body === g; });
    if (!ms.length) return false;
    var idx = [];
    g.shapes.forEach(function (s, i) { if (s.part === tag) idx.push(i); });
    function shift(k) {
      ms.forEach(function (m) { m.lx += k * dx; m.ly += k * dy; });
      idx.forEach(function (i) { var s = g.shapes[i]; if (s.t === 'c') { s.x += k * dx; s.y += k * dy; } else { s.ax += k * dx; s.ay += k * dy; s.bx += k * dx; s.by += k * dy; } });
      g.updateWorld();
    }
    this.updateMagnetPoses();
    var U0 = this.magnetEnergy();
    shift(1);
    var B = this.bodies, hit = false, out = [], saved = curMargin;
    curMargin = 0;
    for (var b = 0; b < B.length && !hit; b++) {
      if (B[b].isStatic) continue;
      for (var a = 0; a < idx.length && !hit; a++) {
        var sa = g.ws[idx[a]];
        if (!sa || !sa.solid) continue;
        for (var j = 0; j < B[b].ws.length && !hit; j++) {
          var sb = B[b].ws[j];
          if (!sb.solid || sa.pl !== sb.pl) continue;
          out.length = 0; collideShapes(sa, sb, out);
          if (out.length && out[0].sep < -0.0005) hit = true;
        }
      }
    }
    curMargin = saved;
    if (hit) { shift(-1); this.updateMagnetPoses(); return false; }
    this.updateMagnetPoses(); this.computeMagnetForces();
    this.ledger.hand += this.magnetEnergy() - U0;
    this.stillTime = 0;
    return true;
  };

  // Balance de la energía desde el inicio
  World.prototype.balance = function () {
    var e = this.energy(), L = this.ledger;
    var reserve = L.E0 - e.E;              // lo que la máquina ha gastado de lo que tenía
    var inflow = reserve + L.hand + L.battery + L.gridIn;          // entradas
    var out = L.axle + L.rub + L.hits + L.air + L.springs + L.heat + L.bus + L.gridOut;
    return {
      e: e, reserve: reserve, hand: L.hand, battery: L.battery, gridIn: L.gridIn, gridOut: L.gridOut,
      axle: L.axle, rub: L.rub, hits: L.hits, air: L.air, springs: L.springs,
      heat: L.heat, bus: L.bus, gen: L.gen, busUsed: L.busUsed,
      inflow: inflow, outflow: out, error: inflow - out
    };
  };

  root.PerpetuumEngine = { Body: Body, World: World, closestOnSeg: closestOnSeg, MU0: MU0 };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.PerpetuumEngine;
})(typeof window !== 'undefined' ? window : globalThis);
