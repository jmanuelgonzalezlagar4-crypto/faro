/* Taller Perpetuum — visión: busca en una foto la rueda (un círculo grande) y las pesas (círculos pequeños).
   Todo se calcula en el dispositivo. Usa la transformada de Hough guiada por el gradiente: cada borde vota
   por los centros posibles en la dirección de su gradiente, y el radio sale de un histograma de distancias. */
(function (root) {
  'use strict';

  function grayFrom(data, w, h) {
    var g = new Float32Array(w * h);
    for (var i = 0, p = 0; i < g.length; i++, p += 4) g[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    return g;
  }
  function boxBlur(src, w, h) {
    var tmp = new Float32Array(w * h), out = new Float32Array(w * h), x, y;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var a = src[y * w + Math.max(0, x - 1)], b = src[y * w + x], c = src[y * w + Math.min(w - 1, x + 1)];
      tmp[y * w + x] = (a + b + c) / 3;
    }
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var d = tmp[Math.max(0, y - 1) * w + x], e = tmp[y * w + x], f = tmp[Math.min(h - 1, y + 1) * w + x];
      out[y * w + x] = (d + e + f) / 3;
    }
    return out;
  }
  function edges(g, w, h) {
    var pts = [], mags = [], x, y;
    var gx = new Float32Array(w * h), gy = new Float32Array(w * h), mg = new Float32Array(w * h);
    for (y = 1; y < h - 1; y++) for (x = 1; x < w - 1; x++) {
      var i = y * w + x;
      var sx = -g[i - w - 1] - 2 * g[i - 1] - g[i + w - 1] + g[i - w + 1] + 2 * g[i + 1] + g[i + w + 1];
      var sy = -g[i - w - 1] - 2 * g[i - w] - g[i - w + 1] + g[i + w - 1] + 2 * g[i + w] + g[i + w + 1];
      gx[i] = sx; gy[i] = sy; mg[i] = Math.sqrt(sx * sx + sy * sy);
      mags.push(mg[i]);
    }
    mags.sort(function (a, b) { return a - b; });
    var thr = Math.max(40, mags[Math.floor(mags.length * 0.86)] || 0);
    for (y = 2; y < h - 2; y++) for (x = 2; x < w - 2; x++) {
      var j = y * w + x, m = mg[j];
      if (m < thr) continue;
      // supresión de no máximos a lo largo del gradiente: bordes finos
      var ux = gx[j] / m, uy = gy[j] / m;
      var a1 = mg[Math.round(y + uy) * w + Math.round(x + ux)], a2 = mg[Math.round(y - uy) * w + Math.round(x - ux)];
      if (m < a1 || m < a2) continue;
      pts.push({ x: x, y: y, ux: ux, uy: uy });
    }
    return pts;
  }
  function vote(pts, w, h, rmin, rmax, keep) {
    var acc = new Float32Array(w * h);
    for (var k = 0; k < pts.length; k++) {
      var p = pts[k];
      for (var s = -1; s <= 1; s += 2) {
        for (var r = rmin; r <= rmax; r++) {
          var cx = Math.round(p.x + s * p.ux * r), cy = Math.round(p.y + s * p.uy * r);
          if (cx < 0 || cy < 0 || cx >= w || cy >= h) break;
          if (keep && !keep(cx, cy)) continue;
          acc[cy * w + cx] += 1;
        }
      }
    }
    return boxBlur(boxBlur(acc, w, h), w, h);
  }
  function radiusAt(pts, cx, cy, rmin, rmax) {
    var hist = new Float32Array(rmax + 2), best = -1, br = 0;
    for (var k = 0; k < pts.length; k++) {
      var p = pts[k], dx = p.x - cx, dy = p.y - cy, d = Math.sqrt(dx * dx + dy * dy);
      if (d < rmin || d > rmax) continue;
      var c = Math.abs((dx * p.ux + dy * p.uy) / d);
      if (c < 0.75) continue;
      var r = Math.round(d);
      hist[r] += 1; if (r > 0) hist[r - 1] += 0.5; if (r < rmax) hist[r + 1] += 0.5;
    }
    for (var r2 = rmin; r2 <= rmax; r2++) if (hist[r2] > best) { best = hist[r2]; br = r2; }
    return { r: br, support: best / (2 * Math.PI * Math.max(br, 1)) };
  }
  function peaks(acc, w, h, minVal, sep, max) {
    var list = [];
    for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
      var v = acc[y * w + x];
      if (v < minVal) continue;
      if (v < acc[y * w + x - 1] || v < acc[y * w + x + 1] || v < acc[(y - 1) * w + x] || v < acc[(y + 1) * w + x]) continue;
      list.push({ x: x, y: y, v: v });
    }
    list.sort(function (a, b) { return b.v - a.v; });
    var out = [];
    for (var i = 0; i < list.length && out.length < max; i++) {
      var ok = true;
      for (var j = 0; j < out.length; j++) if (Math.hypot(out[j].x - list[i].x, out[j].y - list[i].y) < sep) { ok = false; break; }
      if (ok) out.push(list[i]);
    }
    return out;
  }

  // Prepara la foto una sola vez: la reduce, la pasa a grises y saca sus bordes.
  function analyze(img) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var k = Math.min(1, 360 / Math.max(iw, ih)), w = Math.max(8, Math.round(iw * k)), h = Math.max(8, Math.round(ih * k));
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var cx2 = c.getContext('2d'); cx2.drawImage(img, 0, 0, w, h);
    var g = boxBlur(grayFrom(cx2.getImageData(0, 0, w, h).data, w, h), w, h);
    return { pts: edges(g, w, h), w: w, h: h, k: k, iw: iw, ih: ih };
  }
  // La rueda: el círculo grande con más bordes que apuntan a su centro. Coordenadas de la foto original.
  function findWheel(A) {
    if (A.pts.length < 30) return null;
    var w = A.w, h = A.h, k = A.k, mn = Math.min(w, h), rmin = Math.round(mn * 0.12), rmax = Math.round(mn * 0.49);
    var acc = vote(A.pts, w, h, rmin, rmax);
    var best = peaks(acc, w, h, 0, mn * 0.1, 1)[0];
    if (!best) return null;
    var rr = radiusAt(A.pts, best.x, best.y, rmin, rmax);
    if (!rr.r || rr.support < 0.12) return null;
    return { cx: best.x / k, cy: best.y / k, r: rr.r / k, confidence: Math.min(1, rr.support) };
  }
  // Las pesas: círculos pequeños alrededor del borde de la rueda (por fuera colgando o por dentro sueltas).
  function findWeights(A, wheel) {
    if (!wheel || A.pts.length < 30) return [];
    var w = A.w, h = A.h, k = A.k, bx = wheel.cx * k, by = wheel.cy * k, R = wheel.r * k;
    var smin = Math.max(3, Math.round(R * 0.05)), smax = Math.max(smin + 2, Math.round(R * 0.3));
    var inZone = function (x, y) { var d = Math.hypot(x - bx, y - by); return d > R * 0.45 && d < R * 1.95; };
    var acc2 = vote(A.pts, w, h, smin, smax, inZone), top = 0;
    for (var i = 0; i < acc2.length; i++) if (acc2[i] > top) top = acc2[i];
    if (!top) return [];
    var list = [];
    peaks(acc2, w, h, top * 0.38, smax * 1.4, 24).forEach(function (p) {
      var d = Math.hypot(p.x - bx, p.y - by);
      if (Math.abs(d - R) < smin * 0.5) return;          // el propio borde de la rueda
      var sr = radiusAt(A.pts, p.x, p.y, smin, smax);
      if (!sr.r || sr.support < 0.25) return;
      list.push({ x: p.x, y: p.y, r: sr.r, score: (p.v / top) * Math.min(1, sr.support) });
    });
    if (!list.length) return [];
    // las pesas de una maqueta suelen ser iguales: fuera los círculos que no se parecen a los más claros
    list.sort(function (a, b) { return b.score - a.score; });
    var ref = list.slice(0, Math.ceil(list.length / 2)).map(function (q) { return q.r; }).sort(function (a, b) { return a - b; });
    var rm = ref[Math.floor(ref.length / 2)], s0 = list[0].score, kept = [];
    list.forEach(function (q) {
      if (q.r > rm * 1.6 || q.r < rm * 0.55 || q.score < s0 * 0.3) return;
      if (kept.every(function (o) { return Math.hypot(o.x - q.x, o.y - q.y) > (o.r + q.r) * 0.8; })) kept.push(q);
    });
    return kept.map(function (q) { return { x: q.x / k, y: q.y / k, r: q.r / k, score: q.score }; });
  }
  function detect(img) {
    var A = analyze(img), wheel = findWheel(A);
    return { wheel: wheel, weights: findWeights(A, wheel), analysis: A };
  }

  // Reparto óptimo (método húngaro): a cada pesa, una bisagra distinta, con el menor coste total.
  function hungarian(cost, n) {
    var u = new Float64Array(n + 1), v = new Float64Array(n + 1), p = new Int32Array(n + 1), way = new Int32Array(n + 1), i, j;
    for (i = 1; i <= n; i++) {
      p[0] = i; var j0 = 0, minv = new Float64Array(n + 1).fill(Infinity), used = new Uint8Array(n + 1);
      do {
        used[j0] = 1; var i0 = p[j0], delta = Infinity, j1 = 0;
        for (j = 1; j <= n; j++) if (!used[j]) {
          var cur = cost[(i0 - 1) * n + j - 1] - u[i0] - v[j];
          if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
          if (minv[j] < delta) { delta = minv[j]; j1 = j; }
        }
        for (j = 0; j <= n; j++) { if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta; }
        j0 = j1;
      } while (p[j0] !== 0);
      do { var jw = way[j0]; p[j0] = p[jw]; j0 = jw; } while (j0);
    }
    var of = new Array(n);
    for (j = 1; j <= n; j++) if (p[j]) of[p[j] - 1] = j - 1;
    return of;
  }
  // Bisagras: tantas como pesas, repartidas por el borde. Busca el giro con el que todos los brazos miden
  // casi lo mismo y cuelgan hacia abajo o salen hacia fuera, como en una maqueta. phase en radianes.
  function hingeSet(wheel, n, phase, rf) {
    var hs = [];
    for (var j = 0; j < n; j++) { var a = phase + j * 2 * Math.PI / n; hs.push({ x: wheel.cx + rf * wheel.r * Math.cos(a), y: wheel.cy + rf * wheel.r * Math.sin(a), a: a }); }
    return hs;
  }
  function pairCost(wt, hh, L) {
    var dx = wt.x - hh.x, dy = wt.y - hh.y, d = Math.hypot(dx, dy);
    var c = (d - L) / L; c *= c;
    if (d > 1e-6) {
      // ángulo del brazo respecto de «hacia fuera» y de «hacia abajo» (en la foto, y crece hacia abajo)
      var out = Math.acos(Math.max(-1, Math.min(1, (dx * Math.cos(hh.a) + dy * Math.sin(hh.a)) / d)));
      var down = Math.acos(Math.max(-1, Math.min(1, dy / d)));
      var off = Math.min(out, down) / (Math.PI / 2);
      c += 0.5 * off * off;
    }
    return c;
  }
  function fitHinges(wheel, weights, phase, rf) {
    var n = weights.length;
    if (!wheel || !n) return { phase: phase || 0, rf: rf || 1, hinges: [] };
    var best = null, phases = [], rfs = rf ? [rf] : [1, 0.95, 0.9], a;
    if (phase != null) phases.push(phase); else for (a = 0; a < 2 * Math.PI / n; a += Math.PI / 180) phases.push(a);
    var cost = new Float64Array(n * n);
    phases.forEach(function (ph) {
      rfs.forEach(function (f) {
        var hs = hingeSet(wheel, n, ph, f), i, j, of = null, L;
        // largo de partida: la distancia típica de cada pesa a su bisagra más cercana
        var near = weights.map(function (wt) { return Math.min.apply(null, hs.map(function (hh) { return Math.hypot(wt.x - hh.x, wt.y - hh.y); })); }).sort(function (x, y) { return x - y; });
        L = Math.max(wheel.r * 0.03, near[Math.floor(n / 2)]);
        for (var it = 0; it < 3; it++) {
          for (i = 0; i < n; i++) for (j = 0; j < n; j++) cost[i * n + j] = pairCost(weights[i], hs[j], L);
          of = hungarian(cost, n);
          var sum = 0;
          for (i = 0; i < n; i++) sum += Math.hypot(weights[i].x - hs[of[i]].x, weights[i].y - hs[of[i]].y);
          L = Math.max(wheel.r * 0.03, sum / n);
        }
        var tot = 0.04 * n * (1 - f);
        for (i = 0; i < n; i++) tot += pairCost(weights[i], hs[of[i]], L);
        if (!best || tot < best.cost) best = { cost: tot, phase: ph, rf: f, L: L, hinges: of.map(function (j2) { return { x: hs[j2].x, y: hs[j2].y }; }) };
      });
    });
    return best;
  }

  root.PerpetuumVision = { analyze: analyze, findWheel: findWheel, findWeights: findWeights, detect: detect, fitHinges: fitHinges };
})(typeof window !== 'undefined' ? window : globalThis);
