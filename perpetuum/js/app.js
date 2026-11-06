(function () {
  'use strict';
  var P = window.PerpetuumBuild, GL = window.PerpetuumGL;
  var DEG = Math.PI / 180;
  var STORE = 'taller-perpetuum.diseno.v1';
  function $(id) { return document.getElementById(id); }

  // ---------- formato ----------
  var nfCache = {};
  function fmt(x, d) {
    d = d == null ? 2 : d;
    if (!isFinite(x)) x = 0;
    if (Math.abs(x) < 0.5 * Math.pow(10, -d)) x = 0;
    var k = 'f' + d;
    if (!nfCache[k]) nfCache[k] = new Intl.NumberFormat('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
    return nfCache[k].format(x);
  }
  function fmtJ(x) { var a = Math.abs(x); return fmt(x, a >= 100 ? 0 : (a >= 10 ? 1 : 2)) + ' J'; }
  function fmtCm(m) { return fmt(m * 100, Math.abs(m * 100) >= 100 ? 0 : 1) + ' cm'; }
  function pct(x) { return fmt(x * 100, 0) + ' %'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function r1(x) { return Math.round(x * 10) / 10; }

  // ---------- estado ----------
  var S = {
    design: null, info: null, mode: 'design',
    tool: 'move', addKind: null, sel: null, speed: 1, snap: true, forces: false,
    view: '3d', cam: { x: 0, y: 0, s: 220 }, vw: 300, vh: 300, dpr: 1,
    undo: [], hist: [], maxK: 0, acc: 0, lastTs: 0, lagging: false,
    drag: null, pointers: new Map(), pinch: null, preEdit: null, endReason: null,
    panelsAt: 0, lastPanelMode: null, tab: 'pieza', sheetOpen: false, glDirty: true,
    measure: null, pendingClone: false, clone: null, clonePreview: null, touch: false,
    redo: [], dirty: true, libId: null, libName: '', runChecked: 0,
    settings: { theme: 'system', quality: 'auto', haptics: true }
  };
  var APP_VERSION = '1.0.0';
  var KEYS = { settings: 'taller-perpetuum.ajustes', lib: 'taller-perpetuum.biblioteca', goals: 'taller-perpetuum.retos', welcome: 'taller-perpetuum.bienvenida', current: 'taller-perpetuum.actual' };
  var STANDALONE = (function () { try { return window.self === window.top; } catch (e) { return false; } })();
  function load(key, fb) { try { var v = JSON.parse(localStorage.getItem(key) || 'null'); return v == null ? fb : v; } catch (e) { return fb; } }
  function store(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function markDirty() { S.dirty = true; }
  function buzz(ms) { try { if (S.settings.haptics && navigator.vibrate) navigator.vibrate(ms || 10); } catch (e) { /* sin vibración */ } }
  var mqMobile = window.matchMedia ? window.matchMedia('(max-width: 979px)') : { matches: false };

  // ---------- iconos ----------
  var IC = {
    move: '<path d="M6 3.5l12 7.2-5.3 1.2 3 5.6-2.3 1.2-3-5.6L6.6 17z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    add: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5v9M7.5 12h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    pin: '<circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 11l-5 7h10z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 21l2-2M9 21l2-2M13 21l2-2M17 21l2-2" stroke="currentColor" stroke-width="1.2"/>',
    clone: '<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 15V5a1 1 0 0 1 1-1h10" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    measure: '<path d="M3 16L16 3l5 5L8 21z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2" stroke="currentColor" stroke-width="1.3"/>',
    erase: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    undo: '<path d="M9 5L4 10l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 10h10a6 6 0 0 1 0 12h-3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    wheel: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>',
    ring: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 9.8L9 4.5M14.2 12l5-3M12 14.2l3 5.3M9.8 12l-5 3" stroke="currentColor" stroke-width="1.3"/><circle cx="7.5" cy="8" r="1.6" fill="currentColor"/>',
    arm: '<path d="M4 20L15 9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="4" cy="20" r="2" fill="var(--panel)" stroke="currentColor" stroke-width="1.4"/><circle cx="16.5" cy="7.5" r="4" fill="currentColor"/>',
    bar: '<path d="M5 18L19 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="5" cy="18" r="2.4" fill="var(--panel)" stroke="currentColor" stroke-width="1.4"/><circle cx="19" cy="6" r="2.4" fill="var(--panel)" stroke="currentColor" stroke-width="1.4"/>',
    ball: '<circle cx="12" cy="13" r="6.5" fill="currentColor"/><path d="M9.5 6.5L12 4l2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    ramp: '<path d="M3 17L21 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M5 18.5l-1.5 2.5M9 16.5l-1.5 2.5M13 14.5l-1.5 2.5M17 12.5l-1.5 2.5" stroke="currentColor" stroke-width="1.2"/>',
    spring: '<path d="M3 12h3l1.5-5 3 10 3-10 3 10 1.5-5h3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    'mag-bar': '<rect x="3" y="8" width="9" height="8" fill="var(--south)"/><rect x="12" y="8" width="9" height="8" fill="var(--north)"/><rect x="3" y="8" width="18" height="8" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    'mag-disc': '<path d="M12 4a8 8 0 0 1 0 16z" fill="var(--north)"/><path d="M12 4a8 8 0 0 0 0 16z" fill="var(--south)"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    'mag-horseshoe': '<path d="M6 4v9a6 6 0 0 0 12 0V4h-4v9a2 2 0 0 1-4 0V4z" fill="#b8322f" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><rect x="6" y="3" width="4" height="4" fill="var(--north)" stroke="currentColor" stroke-width="1"/><rect x="14" y="3" width="4" height="4" fill="var(--south)" stroke="currentColor" stroke-width="1"/>',
    'mag-halbach': '<g stroke="currentColor" stroke-width="1"><rect x="2" y="9" width="4" height="6" fill="var(--north)"/><rect x="6" y="9" width="4" height="6" fill="var(--panel-2)"/><rect x="10" y="9" width="4" height="6" fill="var(--south)"/><rect x="14" y="9" width="4" height="6" fill="var(--panel-2)"/><rect x="18" y="9" width="4" height="6" fill="var(--north)"/></g><path d="M3 7h2M8 6v2M11 7h2M16 8V6M19 7h2" stroke="currentColor" stroke-width="1.2"/>',
    'mag-electro': '<rect x="3" y="10.5" width="18" height="3" fill="var(--steel)" stroke="currentColor" stroke-width="1"/><rect x="6" y="7" width="12" height="10" rx="2" fill="#b5652b" stroke="currentColor" stroke-width="1.2"/><path d="M8 7v10M10.5 7v10M13 7v10M15.5 7v10" stroke="#7a3f14" stroke-width="1"/>',
    motor: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 15.5V8.5l4 4 4-4v7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    gen: '<circle cx="12" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 16h4v3h-4z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 6l-2 4h4l-2 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'
  };

  var DOCK = [
    { id: 'move', label: 'Mover' }, { id: 'add', label: 'Añadir' }, { id: 'pin', label: 'Unir' },
    { id: 'clone', label: 'Clonar' }, { id: 'measure', label: 'Medir' }, { id: 'erase', label: 'Borrar' }, { id: 'undo', label: 'Deshacer' }
  ];

  var PALETTE = [
    { group: 'Estructura', items: [
      { id: 'wheel', name: 'Rueda', desc: 'Con eje fijo. Arrastra para el tamaño.' },
      { id: 'ring', name: 'Rueda de compartimentos', desc: 'Aro con separadores para bolas.' },
      { id: 'arm', name: 'Brazo con pesa', desc: 'Arrastra desde el borde de la rueda.' },
      { id: 'bar', name: 'Brazo', desc: 'Barra rígida. Arrastra de punta a punta.' },
      { id: 'ball', name: 'Pesa', desc: 'Bola de plomo, acero, madera o goma.' },
      { id: 'ramp', name: 'Rampa', desc: 'Suelo o rampa fija.' },
      { id: 'spring', name: 'Muelle', desc: 'Arrastra entre dos piezas.' }
    ] },
    { group: 'Imanes', items: [
      { id: 'mag-bar', name: 'Imán de barra', desc: 'El clásico, de neodimio o ferrita.' },
      { id: 'mag-disc', name: 'Imán de disco', desc: 'Redondo, imantado a lo ancho.' },
      { id: 'mag-horseshoe', name: 'Imán de herradura', desc: 'Los dos polos mirando hacia delante.' },
      { id: 'mag-halbach', name: 'Matriz de Halbach', desc: 'Cinco imanes que refuerzan un lado.' },
      { id: 'mag-electro', name: 'Electroimán', desc: 'Se enciende con batería, según el giro.' }
    ] },
    { group: 'Energía', items: [
      { id: 'motor', name: 'Motor', desc: 'Toca un eje o una bisagra.' },
      { id: 'gen', name: 'Generador', desc: 'Toca un eje o una bisagra para sacar energía.' }
    ] }
  ];
  var PAL_BY_ID = {};
  PALETTE.forEach(function (g) { g.items.forEach(function (it) { PAL_BY_ID[it.id] = it; }); });

  var HINTS = {
    move: 'Toca una pieza para ver sus medidas. Arrástrala para moverla. Arrastra el fondo para girar la vista.',
    move2d: 'Toca una pieza para ver sus medidas. Arrástrala para moverla. Arrastra el fondo para desplazar la vista.',
    pin: 'Toca encima de dos piezas para unirlas con una bisagra. Sobre una sola, la clavas a la pared.',
    measure: 'Arrastra para medir una distancia y un ángulo.',
    erase: 'Toca una pieza para quitarla.',
    clone: 'Toca la pieza que quieres clonar.',
    wheel: 'Toca donde irá el eje. Si arrastras, eliges el radio.',
    ring: 'Toca donde irá el eje. Si arrastras, eliges el radio.',
    arm: 'Arrastra desde el borde de una rueda hacia fuera: crea el brazo, la pesa y la bisagra.',
    bar: 'Arrastra de un punto a otro. Un extremo sobre otra pieza se une con una bisagra.',
    ball: 'Toca para poner una pesa.',
    ramp: 'Arrastra para dibujar una rampa o un suelo.',
    spring: 'Arrastra entre dos piezas, o entre una pieza y la pared.',
    'mag-bar': 'Toca para poner el imán. Encima de una pieza va pegado a ella.',
    'mag-disc': 'Toca para poner el imán. Encima de una pieza va pegado a ella.',
    'mag-horseshoe': 'Toca para poner el imán. Encima de una pieza va pegado a ella.',
    'mag-halbach': 'Toca para poner la matriz. Encima de una pieza va pegada a ella.',
    'mag-electro': 'Toca para poner el electroimán. Después elige cuándo se enciende.',
    motor: 'Toca una rueda o una bisagra para ponerle un motor.',
    gen: 'Toca una rueda o una bisagra para ponerle un generador.'
  };
  var HAND_HINT = 'Arrastra una pieza para empujarla: el banco apunta esa energía como tuya.';

  var STORIES = {
    mazos: {
      title: 'Rueda de mazos', era: 'Villard de Honnecourt la dibujó hacia 1235.',
      what: 'Siete mazos cuelgan de bisagras en el borde de la rueda. En el lado que baja se abren hacia fuera; en el lado que sube cuelgan pegados. La idea es que el lado abierto pese más y la rueda no se pare nunca.',
      why: 'Los mazos abiertos están más lejos del eje, pero en el lado que sube siempre hay más mazos. Los dos efectos se compensan y la rueda busca una posición de equilibrio. Además, cada vez que un mazo cae contra su tope pierde energía en el golpe: míralo en la línea «Golpes» del libro de cuentas.'
    },
    bolas: {
      title: 'Rueda de bolas', era: 'Variante con bolas que ruedan, repetida por inventores desde el siglo XVII.',
      what: 'Ocho compartimentos inclinados con una bola de acero en cada uno. En un lado las bolas ruedan hacia el borde y en el otro hacia el centro.',
      why: 'Pasa lo mismo que con los mazos: las bolas lejanas son menos que las cercanas, y la rueda se queda equilibrada. Cada vez que una bola rueda y choca con la pared de su compartimento pierde energía. Dale un empujón con el dedo durante la prueba y mira cuánto dura.'
    },
    wilkins: {
      title: 'Rampa de Wilkins', era: 'La describió el obispo John Wilkins en el siglo XVII.',
      what: 'Un imán en lo alto tira de una bola de acero rampa arriba. Antes de llegar, la bola cae por un agujero y vuelve abajo por otra rampa para empezar otra vez.',
      why: 'La fuerza de un imán cae muy deprisa con la distancia. Desde abajo apenas tira, y la bola rueda cuesta abajo. Durante la prueba, arrastra la bola con el dedo hacia el imán: si la sueltas lejos, vuelve a caer; si la sueltas a pocos centímetros, el imán la atrapa y ya no la suelta. Un imán con fuerza para subirla desde abajo tampoco la dejaría caer por el agujero.'
    },
    motor: {
      title: 'Motor de imanes', era: 'Idea muy repetida en vídeos de internet.',
      what: 'Una rueda con ocho imanes inclinados gira frente a tres imanes fijos. La idea es que los imanes se empujen siempre en el mismo sentido.',
      why: 'La fuerza entre imanes, como la gravedad, devuelve lo que da: lo que empuja al acercarse lo frena al alejarse. En el libro de cuentas verás que toda la energía que gasta sale del giro inicial: en una vuelta completa, los imanes no dan ni quitan nada. La rueda va frenando por el rozamiento y al final se queda clavada en un «punto pegajoso».'
    },
    pendulo: {
      title: 'Péndulo de control', era: 'Una prueba para comprobar el propio banco.',
      what: 'Un péndulo colgado de un rodamiento de bolas. Sirve para ver cuánto frenan el aire y el eje.',
      why: 'En la pestaña «Prueba», activa «Mundo ideal»: oscilará sin pararse y su energía se mantendrá igual. Después toca la bisagra y conecta el generador: la energía que saca es justo la que pierde el péndulo, y se para. Sin rozamiento algo puede moverse para siempre, pero no puede producir energía.'
    },
    bucle: {
      title: 'Motor que se alimenta solo', era: 'La idea de motor y generador en el mismo eje es de las más repetidas.',
      what: 'Un volante pesado con un generador y un motor en el mismo eje. El generador produce electricidad y el motor la usa para seguir empujando la rueda.',
      why: 'Ningún generador ni motor es perfecto: el generador convierte el 85 % de lo que frena en electricidad, y el motor convierte el 80 % de esa electricidad en empuje. En cada vuelta del circuito se pierde casi un tercio en calor. Mira la línea «Calor» del libro de cuentas: por eso el volante frena.'
    },
    electro: {
      title: 'Rueda con electroimán', era: 'Muchas máquinas «de imanes» esconden una pila.',
      what: 'Seis imanes en el borde de la rueda y un electroimán fijo que se enciende justo cuando un imán se acerca, para tirar de él, y se apaga cuando pasa.',
      why: 'Esta rueda sí gira sin parar, pero porque la batería le da energía cada vez que enciende el electroimán. En el libro de cuentas verás que la batería pone muchísimo más de lo que la rueda gana: casi todo se va en calor de la bobina. Quita la batería (borra el electroimán) y se para.'
    }
  };

  // ---------- colores ----------
  var C = {}, F = { mono: 'monospace', display: 'sans-serif', body: 'sans-serif' };
  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    F.mono = cs.getPropertyValue('--f-mono').trim() || 'monospace';
    F.display = cs.getPropertyValue('--f-display').trim() || 'sans-serif';
    F.body = cs.getPropertyValue('--f-body').trim() || 'sans-serif';
    ['paper', 'paper-deep', 'grid', 'grid-strong', 'ink', 'ink-2', 'ink-3', 'panel', 'panel-2', 'rule', 'accent', 'accent-soft', 'part',
      'north', 'south', 'lead', 'steel', 'wood', 'rubber', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 'good', 'bad', 'warn'].forEach(function (k) {
      C[k] = cs.getPropertyValue('--' + k).trim() || '#888';
    });
  }

  // ---------- coordenadas ----------
  function W2S(x, y) { return { x: S.vw / 2 + (x - S.cam.x) * S.cam.s, y: S.vh / 2 - (y - S.cam.y) * S.cam.s }; }
  function S2W(px, py) { return { x: S.cam.x + (px - S.vw / 2) / S.cam.s, y: S.cam.y - (py - S.vh / 2) / S.cam.s }; }
  function is3d() { return S.view === '3d' && GL && GL.ok(); }
  function ppm() { return is3d() ? GL.ppm() : S.cam.s; }
  function tolW() { return (S.touch ? 20 : 12) / ppm(); }
  function worldAt(pos) { return is3d() ? (GL.planePoint(pos.x, pos.y) || { x: 0, y: 0 }) : S2W(pos.x, pos.y); }
  function screenOf(x, y, z) { return is3d() ? GL.project(x, y, z || 0) : W2S(x, y); }

  // ---------- diseño ----------
  function parts() { return S.design.parts; }
  function find(id) { return id ? P.find(S.design, id) : null; }
  function snapshot() { return JSON.stringify(S.design); }
  function pushUndo(snap) { S.undo.push(snap || snapshot()); if (S.undo.length > 80) S.undo.shift(); S.redo = []; }
  function save() {
    try { localStorage.setItem(STORE, snapshot()); } catch (e) { /* sin almacenamiento */ }
    store(KEYS.current, { libId: S.libId, libName: S.libName });
  }

  var KINDS = { wheel: 1, ball: 1, bar: 1, ramp: 1, pin: 1, spring: 1, magnet: 1 };
  function sanitize(d) {
    if (!d || typeof d !== 'object' || !Array.isArray(d.parts)) return null;
    var out = P.emptyDesign();
    out.gravity = P.GRAVITY[d.gravity] ? d.gravity : 'tierra';
    out.ideal = !!d.ideal; out.air = d.air !== false; out.example = STORIES[d.example] ? d.example : null;
    var maxId = 0;
    d.parts.forEach(function (p) {
      if (!p || !KINDS[p.kind] || typeof p.id !== 'string') return;
      var ok = true;
      ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'r', 'm', 'size', 'mu'].forEach(function (k) { if (k in p && p[k] != null && !isFinite(p[k])) ok = false; });
      if (!ok) return;
      if (p.kind === 'magnet' && !p.shape) p.shape = 'bar';
      out.parts.push(p);
      var n = parseInt(String(p.id).replace(/\D/g, ''), 10);
      if (n > maxId) maxId = n;
    });
    out.next = Math.max(d.next || 1, maxId + 1);
    return out;
  }

  function rebuild() {
    S.dirty = true;
    S.info = P.build(S.design);
    S.hist = []; S.maxK = 0; S.acc = 0; S.endReason = null; S.lagging = false;
    recordHist(true);
    S.glDirty = true;
  }
  function commit(before) {
    if (before) pushUndo(before);
    rebuild(); save();
    renderInspector(); renderAbout(); renderConditions();
    S.panelsAt = 0;
  }
  function setDesign(d, keepView) {
    S.design = d; S.sel = null; S.measure = null;
    setMode('design');
    rebuild();
    if (!keepView) fitView();
    save();
    renderInspector(); renderAbout(); renderConditions();
  }

  // ---------- selección ----------
  function segDist(px, py, x1, y1, x2, y2) {
    var q = window.PerpetuumEngine.closestOnSeg(px, py, x1, y1, x2, y2);
    return Math.hypot(px - q.x, py - q.y);
  }
  var PRIORITY = { pin: 0, magnet: 1, spring: 2, ball: 3, bar: 4, wheel: 5, ramp: 6 };
  function hitPart(p, x, y, tol) {
    switch (p.kind) {
      case 'pin': return Math.hypot(x - p.x, y - p.y) <= tol * 0.9;
      case 'magnet':
        return P.magnetModel(p).shapes.some(function (sh) {
          return sh.t === 'c' ? Math.hypot(x - sh.x, y - sh.y) <= sh.r + tol : segDist(x, y, sh.ax, sh.ay, sh.bx, sh.by) <= sh.r + tol;
        });
      case 'spring': return segDist(x, y, p.x1, p.y1, p.x2, p.y2) <= tol;
      case 'ball': return Math.hypot(x - p.x, y - p.y) <= p.r + tol * 0.4;
      case 'bar': return segDist(x, y, p.x1, p.y1, p.x2, p.y2) <= P.BAR_R + tol;
      case 'wheel': return Math.hypot(x - p.x, y - p.y) <= p.r + tol * 0.3;
      case 'ramp': return segDist(x, y, p.x1, p.y1, p.x2, p.y2) <= P.RAMP_R + tol;
    }
    return false;
  }
  function partsAt(x, y, tol, filter) {
    var list = [];
    parts().forEach(function (p, i) { if ((!filter || filter(p)) && hitPart(p, x, y, tol)) list.push({ p: p, i: i }); });
    list.sort(function (a, b) { return (PRIORITY[a.p.kind] - PRIORITY[b.p.kind]) || (b.i - a.i); });
    return list.map(function (e) { return e.p; });
  }
  function bodyPartsAt(x, y, tol, excludeId) { return partsAt(x, y, tol, function (p) { return P.isBodyPart(p) && p.id !== excludeId; }); }
  // pieza bajo el dedo, con el punto del plano que le corresponde
  function pickAt(pos) {
    if (is3d()) {
      var h = GL.pick(pos.x, pos.y);
      if (h && find(h.id)) return { p: find(h.id), x: h.x, y: h.y };
      var w = GL.planePoint(pos.x, pos.y);
      if (!w) return null;
      var q = partsAt(w.x, w.y, tolW())[0];
      return q ? { p: q, x: w.x, y: w.y } : { p: null, x: w.x, y: w.y };
    }
    var w2 = S2W(pos.x, pos.y), q2 = partsAt(w2.x, w2.y, tolW())[0];
    return { p: q2 || null, x: w2.x, y: w2.y };
  }

  function snapPoint(x, y, rim) {
    var tol = 16 / ppm(), best = null, bd = tol;
    function cand(px, py) { var d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; best = { x: px, y: py }; } }
    parts().forEach(function (p) {
      if (p.kind === 'ball' || p.kind === 'wheel' || p.kind === 'pin') cand(p.x, p.y);
      if (p.kind === 'bar' || p.kind === 'ramp') { cand(p.x1, p.y1); cand(p.x2, p.y2); }
    });
    if (best) return best;
    if (rim) {
      for (var i = parts().length - 1; i >= 0; i--) {
        var w = parts()[i];
        if (w.kind !== 'wheel') continue;
        var dx = x - w.x, dy = y - w.y, d = Math.hypot(dx, dy);
        if (d > 1e-6 && Math.abs(d - w.r) < tol) return { x: w.x + dx / d * w.r, y: w.y + dy / d * w.r };
      }
    }
    if (S.snap) return { x: Math.round(x / 0.01) * 0.01, y: Math.round(y / 0.01) * 0.01 };
    return { x: x, y: y };
  }

  // ---------- grupos de piezas ----------
  function assembly(id) {
    var set = new Set([id]), changed = true;
    while (changed) {
      changed = false;
      parts().forEach(function (q) {
        if (q.kind !== 'pin' || !q.a || !q.b) return;
        if (set.has(q.a) !== set.has(q.b)) { set.add(q.a); set.add(q.b); changed = true; }
      });
    }
    return set;
  }
  function anchorBodyId(p) {
    if (P.isBodyPart(p)) return p.id;
    if (p.kind === 'pin') return p.b;
    if (p.kind === 'magnet') return p.host;
    if (p.kind === 'spring') return p.a || p.b;
    return null;
  }
  function translatePart(p, o, dx, dy, ends) {
    if ('x1' in p) {
      if (!ends || ends[0]) { p.x1 = o.x1 + dx; p.y1 = o.y1 + dy; }
      if (!ends || ends[1]) { p.x2 = o.x2 + dx; p.y2 = o.y2 + dy; }
    } else { p.x = o.x + dx; p.y = o.y + dy; }
  }
  function collectMove(p) {
    var bid = anchorBodyId(p), set = bid ? assembly(bid) : null, list = [];
    parts().forEach(function (q) {
      var orig = JSON.parse(JSON.stringify(q));
      if (q === p && !bid) { list.push({ p: q, o: orig }); return; }
      if (!set) return;
      if (P.isBodyPart(q) && set.has(q.id)) list.push({ p: q, o: orig });
      else if (q.kind === 'pin' && (set.has(q.b) || (q.a && set.has(q.a)))) list.push({ p: q, o: orig });
      else if (q.kind === 'magnet' && q.host && set.has(q.host)) list.push({ p: q, o: orig });
      else if (q.kind === 'spring' && ((q.a && set.has(q.a)) || (q.b && set.has(q.b)))) list.push({ p: q, o: orig, ends: [!!(q.a && set.has(q.a)), !!(q.b && set.has(q.b))] });
    });
    return list;
  }
  function moveBy(p, dx, dy) { collectMove(p).forEach(function (e) { translatePart(e.p, e.o, dx, dy, e.ends); }); }
  // mueve un extremo de un brazo, rampa o muelle; lo que está unido en ese punto va con él
  function moveEnd(p, end, nx, ny) {
    var kx = end === 0 ? 'x1' : 'x2', ky = end === 0 ? 'y1' : 'y2', ox = p[kx], oy = p[ky];
    p[kx] = nx; p[ky] = ny;
    if (p.kind !== 'bar') return;
    parts().forEach(function (q) {
      if (q.kind === 'pin' && (q.b === p.id || q.a === p.id) && Math.hypot(q.x - ox, q.y - oy) < 1e-6) {
        q.x = nx; q.y = ny;
        var other = find(q.a === p.id ? q.b : q.a);
        if (other && other.kind === 'ball' && Math.hypot(other.x - ox, other.y - oy) < 1e-6) { other.x = nx; other.y = ny; }
      }
    });
  }
  function removePart(id) {
    buzz(12);
    var drop = new Set([id]);
    parts().forEach(function (q) {
      if (q.kind === 'pin' && (q.a === id || q.b === id)) drop.add(q.id);
      if (q.kind === 'spring' && (q.a === id || q.b === id)) drop.add(q.id);
      if (q.kind === 'magnet' && q.host === id) drop.add(q.id);
      if (q.kind === 'magnet' && q.ewheel === id) { q.ewheel = null; q.emode = 'always'; }
    });
    S.design.parts = parts().filter(function (q) { return !drop.has(q.id); });
    if (S.sel && drop.has(S.sel)) S.sel = null;
  }

  // ---------- crear piezas ----------
  function createAt(kind, a, b) {
    var d = S.design, before = snapshot(), made = null, dragged = b && Math.hypot(b.x - a.x, b.y - a.y) >= 0.03;
    if (kind === 'wheel' || kind === 'ring') {
      var r = dragged ? Math.hypot(b.x - a.x, b.y - a.y) : 0.45;
      r = Math.min(1.5, Math.max(0.1, Math.round(r * 100) / 100));
      made = P.makeWheel(d, a.x, a.y, r);
      if (kind === 'ring') { made.style = 'ring'; made.cells = 8; made.tilt = 35; }
      d.parts.push(made);
    } else if (kind === 'ball') {
      made = P.makeBall(d, a.x, a.y); d.parts.push(made);
    } else if (kind === 'bar' || kind === 'ramp' || kind === 'spring' || kind === 'arm') {
      if (!dragged) { toast('Arrastra el dedo para dibujar la pieza.'); return; }
      if (kind === 'ramp') { made = P.makeRamp(d, a.x, a.y, b.x, b.y); d.parts.push(made); }
      else if (kind === 'bar' || kind === 'arm') {
        made = P.makeBar(d, a.x, a.y, b.x, b.y); d.parts.push(made);
        var ends = kind === 'arm' ? [a] : [a, b];
        ends.forEach(function (pt) {
          var t = bodyPartsAt(pt.x, pt.y, 0.004, made.id)[0];
          if (!t) return;
          var pin = P.makePin(d, pt.x, pt.y, t.id, made.id);
          if (t.kind === 'ball' && Math.hypot(t.x - pt.x, t.y - pt.y) < 0.002) pin.mode = 'rigid';
          d.parts.push(pin);
        });
        if (kind === 'arm') {
          var ball = P.makeBall(d, b.x, b.y); ball.r = 0.06; ball.m = 1;
          d.parts.push(ball);
          var weld = P.makePin(d, b.x, b.y, made.id, ball.id); weld.mode = 'rigid';
          d.parts.push(weld);
        }
      } else {
        var ta = bodyPartsAt(a.x, a.y, 0.004)[0], tb = bodyPartsAt(b.x, b.y, 0.004)[0];
        if (!ta && !tb) { toast('Engancha al menos un extremo del muelle a una pieza que se mueva.'); return; }
        if (ta && tb && ta.id === tb.id) { toast('Los dos extremos están en la misma pieza: el muelle no haría nada.'); return; }
        made = P.makeSpring(d, a.x, a.y, b.x, b.y, ta ? ta.id : null, tb ? tb.id : null); d.parts.push(made);
      }
    } else if (kind === 'pin') {
      var cands = bodyPartsAt(a.x, a.y, 0.006);
      if (!cands.length) { toast('Pon la bisagra encima de una pieza.'); return; }
      var top = cands[0], under = cands[1] || null;
      if (parts().some(function (q) { return q.kind === 'pin' && Math.hypot(q.x - a.x, q.y - a.y) < 0.003 && q.b === top.id; })) { toast('Ya hay una bisagra en ese punto.'); return; }
      made = P.makePin(d, a.x, a.y, under ? under.id : null, top.id);
      if (!under && top.kind === 'wheel') toast('Clavada a la pared. Las ruedas ya giran sobre su propio eje.');
      d.parts.push(made);
    } else if (kind.indexOf('mag-') === 0) {
      var host = bodyPartsAt(a.x, a.y, 0.004)[0];
      made = P.makeMagnet(d, a.x, a.y, host ? host.id : null, kind.slice(4));
      d.parts.push(made);
    } else if (kind === 'motor' || kind === 'gen') {
      var tgt = partsAt(a.x, a.y, tolW(), function (q) { return q.kind === 'pin' && q.mode !== 'rigid'; })[0] ||
        partsAt(a.x, a.y, tolW(), function (q) { return q.kind === 'wheel' && q.axle === 'fixed'; })[0];
      if (!tgt) { toast('Toca una rueda con eje fijo o una bisagra.'); return; }
      if (kind === 'motor') { tgt.motor = true; tgt.mrpm = tgt.mrpm || 30; tgt.mtorque = tgt.mtorque || 0.5; tgt.msrc = tgt.msrc || 'battery'; toast('Motor puesto. Funciona con batería: lo que gaste saldrá en las cuentas.'); }
      else { tgt.gen = tgt.gen || 0.1; toast('Generador puesto. La bombilla se enciende con lo que produzca.'); }
      made = tgt;
    }
    if (made) { S.sel = made.id; commit(before); openPiece(); buzz(8); }
  }

  // ---------- clonar ----------
  function cloneUnit(selId) {
    var sel = find(selId);
    if (!sel) return null;
    if (sel.kind === 'pin') sel = find(sel.b) || sel;
    var ids = new Set(), host = null;
    if (sel.kind === 'magnet' || sel.kind === 'spring' || sel.kind === 'ramp') {
      ids.add(sel.id);
      if (sel.kind === 'magnet' && sel.host) { var h = find(sel.host); if (h && h.kind === 'wheel') host = h; }
    } else if (sel.kind === 'wheel') {
      assembly(sel.id).forEach(function (id) { ids.add(id); });
    } else {
      ids.add(sel.id);
      var changed = true;
      while (changed) {
        changed = false;
        parts().forEach(function (q) {
          if (q.kind !== 'pin' || !q.a || !q.b) return;
          var A = find(q.a), B = find(q.b);
          if (!A || !B) return;
          if (ids.has(q.a) && !ids.has(q.b) && B.kind !== 'wheel') { ids.add(q.b); changed = true; }
          if (ids.has(q.b) && !ids.has(q.a) && A.kind !== 'wheel') { ids.add(q.a); changed = true; }
        });
      }
    }
    if (sel.kind !== 'magnet' && sel.kind !== 'spring' && sel.kind !== 'ramp') {
      parts().forEach(function (q) {
        if (q.kind === 'pin' && (ids.has(q.b) || (q.a && ids.has(q.a)))) {
          ids.add(q.id);
          var other = find(ids.has(q.b) ? q.a : q.b);
          if (other && other.kind === 'wheel' && !ids.has(other.id)) host = host || other;
        }
      });
      parts().forEach(function (q) {
        if (q.kind === 'magnet' && q.host && ids.has(q.host)) ids.add(q.id);
        if (q.kind === 'spring' && (q.a || q.b) && (!q.a || ids.has(q.a)) && (!q.b || ids.has(q.b))) ids.add(q.id);
      });
    }
    if (!host && sel.kind === 'ball') {
      parts().forEach(function (w) { if (!host && w.kind === 'wheel' && w.style === 'ring' && Math.hypot(sel.x - w.x, sel.y - w.y) < w.r) host = w; });
    }
    var list = parts().filter(function (q) { return ids.has(q.id); });
    var count = {};
    list.forEach(function (q) { var n = q.kind === 'magnet' ? 'imán' : { wheel: 'rueda', ball: 'pesa', bar: 'brazo', ramp: 'rampa', pin: 'bisagra', spring: 'muelle' }[q.kind]; count[n] = (count[n] || 0) + 1; });
    return { ids: ids, list: list, host: host, sel: sel, summary: count };
  }
  function cloneTransforms(c) {
    var out = [];
    if (c.mode === 'circle') {
      var n = Math.max(2, Math.min(36, Math.round(c.n))), span = Math.max(1, Math.min(360, c.span));
      var step = span >= 359.9 ? 360 / n : span / Math.max(1, n - 1);
      for (var k = 1; k < n; k++) out.push({ rot: -k * step * DEG, cx: c.cx, cy: c.cy, dx: 0, dy: 0 });
    } else {
      var m = Math.max(1, Math.min(36, Math.round(c.n)));
      for (var j = 1; j <= m; j++) out.push({ rot: 0, cx: 0, cy: 0, dx: c.dx * j, dy: c.dy * j });
    }
    return out;
  }
  function transformPoint(t, x, y) {
    if (t.rot) {
      var cs = Math.cos(t.rot), sn = Math.sin(t.rot), rx = x - t.cx, ry = y - t.cy;
      return { x: t.cx + cs * rx - sn * ry, y: t.cy + sn * rx + cs * ry };
    }
    return { x: x + t.dx, y: y + t.dy };
  }
  function cloneCopies(unit, transforms, makeIds) {
    var copies = [];
    transforms.forEach(function (t) {
      var map = {};
      if (makeIds) unit.list.forEach(function (q) { map[q.id] = 'p' + (S.design.next++); });
      unit.list.forEach(function (q) {
        var c = JSON.parse(JSON.stringify(q));
        if (makeIds) c.id = map[q.id];
        if ('x1' in c) {
          var a = transformPoint(t, q.x1, q.y1), b = transformPoint(t, q.x2, q.y2);
          c.x1 = a.x; c.y1 = a.y; c.x2 = b.x; c.y2 = b.y;
        } else { var p = transformPoint(t, q.x, q.y); c.x = p.x; c.y = p.y; }
        if (c.kind === 'magnet') c.ang = (q.ang || 0) + t.rot / DEG;
        if (makeIds) ['a', 'b', 'host'].forEach(function (k) { if (c[k] && map[c[k]]) c[k] = map[c[k]]; });
        copies.push(c);
      });
    });
    return copies;
  }

  // ---------- modos ----------
  function setMode(m) {
    S.mode = m; S.dirty = true;
    var play = $('playBtn'), chip = $('chip');
    play.textContent = m === 'run' ? 'Pausa' : (m === 'design' ? 'Probar' : 'Seguir');
    $('resetBtn').disabled = m === 'design';
    chip.className = 'chip' + (m === 'run' ? ' is-run' : (m === 'stopped' ? ' is-stop' : ''));
    chip.textContent = m === 'design' ? 'Diseño' : (m === 'run' ? 'Probando' : (m === 'pause' ? 'En pausa' : 'Parada'));
    $('clock').hidden = m === 'design';
    if (m !== 'design' && S.info) S.info.world.hand = null;
    S.drag = null;
    updateTools(); updateHint();
    renderInspector(); renderConditions();
    S.panelsAt = 0;
  }
  function play() {
    if (S.mode === 'design') {
      if (!parts().some(P.isBodyPart)) { toast('Añade alguna pieza que se mueva: una rueda, una pesa o un brazo.'); return; }
      rebuild();
      S.tool = 'move'; S.measure = null; S.pendingClone = false; closeClone();
      setMode('run');
      setTab('cuentas');
    } else if (S.mode === 'run') setMode('pause');
    else { S.info.world.stillTime = 0; S.endReason = null; setMode('run'); }
  }
  function broken(w) {
    for (var i = 0; i < w.bodies.length; i++) {
      var b = w.bodies[i];
      if (b.isStatic) continue;
      if (!isFinite(b.x) || !isFinite(b.vx) || !isFinite(b.w) || Math.hypot(b.vx, b.vy) > 60) return true;
    }
    var bl = w.balance(), scale = Math.max(Math.abs(bl.inflow), bl.outflow, 0.01);
    return bl.error < -Math.max(0.05, 0.05 * scale);
  }
  function backToDesign() { rebuild(); setMode('design'); }
  function stopTest(reason) { S.endReason = reason; setMode('stopped'); setTab('cuentas', true); buzz(25); checkGoals(true); }

  // ---------- historial ----------
  function recordHist(force) {
    var w = S.info.world, last = S.hist[S.hist.length - 1];
    if (!force && last && w.t - last.t < 0.05) return;
    var b = w.balance();
    var lost = b.axle + b.hits + b.rub + b.air + b.springs + b.heat;
    S.hist.push({ t: w.t, K: b.e.K, lost: lost, gen: b.gen, bat: b.battery, hand: b.hand });
    if (b.e.K > S.maxK) S.maxK = b.e.K;
    if (S.hist.length > 2400) S.hist = S.hist.filter(function (_, i) { return i % 2 === 0 || i === S.hist.length - 1; });
  }

  // ---------- bucle ----------
  function hasPower() { return parts().some(function (p) { return (p.motor && p.msrc !== 'bus') || (p.kind === 'magnet' && p.shape === 'electro'); }); }
  function frame(ts) {
    var dtR = S.lastTs ? Math.min(0.05, (ts - S.lastTs) / 1000) : 0;
    S.lastTs = ts;
    if (S.mode === 'run' && S.info) {
      var w = S.info.world;
      S.acc += dtR * S.speed;
      var t0 = performance.now(), n = 0;
      S.lagging = false;
      while (S.acc >= w.dt) {
        w.step(); S.acc -= w.dt; n++;
        recordHist(false);
        if (w.isStopped() && !w.hand && !hasPower()) { recordHist(true); stopTest('stopped'); break; }
        if ((n & 15) === 0 && broken(w)) { recordHist(true); stopTest('numeric'); break; }
        if (w.t >= 600) { recordHist(true); stopTest('time'); break; }
        if ((n & 7) === 0 && performance.now() - t0 > 11) { S.acc = 0; S.lagging = true; break; }
      }
      $('clock').textContent = fmt(w.t, 1) + ' s' + (S.lagging ? ' · más lento' : '');
    }
    if (S.mode === 'run' || S.dirty || S.drag || S.glDirty) {
      if (is3d()) {
        if (S.glDirty) { GL.rebuild(S.info, S.design); S.glDirty = false; }
        GL.update(S.info, { sel: S.mode === 'design' ? S.sel : null, measure: S.measure });
        GL.render();
      } else draw();
      placeDimLabel();
      S.dirty = false;
    }
    if (S.mode === 'run' && ts - S.runChecked > 1000) { S.runChecked = ts; checkGoals(false); }
    if (ts - S.panelsAt > (S.mode === 'run' ? 250 : 700) || S.lastPanelMode !== S.mode) {
      S.panelsAt = ts; S.lastPanelMode = S.mode;
      renderPanels();
    }
    requestAnimationFrame(frame);
  }

  // ---------- vista ----------
  var ctx;
  function resize() {
    S.dirty = true;
    var st = $('stage'), r = st.getBoundingClientRect(), cv = $('cv');
    S.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    S.vw = Math.max(50, r.width); S.vh = Math.max(50, r.height);
    cv.width = Math.round(S.vw * S.dpr); cv.height = Math.round(S.vh * S.dpr);
    if (GL && GL.ok()) GL.resize(S.vw, S.vh, Math.min(S.dpr, 2));
    S.panelsAt = 0;
  }
  function designBox() {
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    function add(x, y, r) { r = r || 0; minx = Math.min(minx, x - r); maxx = Math.max(maxx, x + r); miny = Math.min(miny, y - r); maxy = Math.max(maxy, y + r); }
    parts().forEach(function (p) { if ('x1' in p) { add(p.x1, p.y1); add(p.x2, p.y2); } else add(p.x, p.y, p.r || 0.05); });
    if (!isFinite(minx)) return null;
    return { minx: minx, miny: miny, maxx: maxx, maxy: maxy };
  }
  function fitView() {
    S.dirty = true;
    var b = designBox();
    if (!b) { S.cam.x = 0; S.cam.y = 0; S.cam.s = Math.min(S.vw, S.vh) / 3; if (GL && GL.ok()) GL.fit(-1, -1, 1, 1); return; }
    var bw = Math.max(0.4, b.maxx - b.minx), bh = Math.max(0.4, b.maxy - b.miny);
    S.cam.s = Math.max(40, Math.min(1200, Math.min(S.vw / (bw * 1.25), (S.vh - 90) / (bh * 1.3))));
    S.cam.x = (b.minx + b.maxx) / 2; S.cam.y = (b.miny + b.maxy) / 2 - 18 / S.cam.s;
    if (GL && GL.ok()) { GL.fit(b.minx, b.miny - 0.08, b.maxx, b.maxy); GL.cam.yaw = -0.5; GL.cam.pitch = 0.22; }
  }
  function setView(v) {
    S.dirty = true;
    if (v === '3d' && !(GL && GL.ok())) { toast('Este dispositivo no puede mostrar la vista 3D.'); v = '2d'; }
    S.view = v;
    $('cv').hidden = v === '3d';
    $('gl').hidden = v !== '3d';
    $('view2d').setAttribute('aria-pressed', String(v === '2d'));
    $('view3d').setAttribute('aria-pressed', String(v === '3d'));
    S.glDirty = true;
    updateHint();
  }

  // ---------- dibujo plano ----------
  function bodyOf(id) { return (id && S.info.bodyOf[id]) || S.info.world.ground; }
  function bodyAngle(b) { return b.a - (b.a0 || 0); }
  function tp(b, x, y) {
    var c = b._c, s = b._s, lx = x - (b.x0 || 0), ly = y - (b.y0 || 0);
    return { x: b.x + c * lx - s * ly, y: b.y + s * lx + c * ly };
  }
  function sp(b, x, y) { var w = tp(b, x, y); return W2S(w.x, w.y); }

  function draw() {
    if (!ctx || !S.info) return;
    var w = S.info.world;
    w.bodies.forEach(function (b) { b._c = Math.cos(bodyAngle(b)); b._s = Math.sin(bodyAngle(b)); });
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, S.vw, S.vh);
    drawGrid();
    var fns = { ramp: drawRamp, wheel: drawWheel, spring: drawSpring, bar: drawBar, ball: drawBall, magnet: drawMagnet, pin: drawPin };
    ['ramp', 'wheel', 'spring', 'bar', 'ball', 'magnet', 'pin'].forEach(function (k) {
      parts().forEach(function (p) { if (p.kind === k) fns[k](p); });
    });
    if (S.forces) drawForces();
    if (S.clonePreview) drawGhosts(S.clonePreview);
    var sel = find(S.sel);
    if (sel) drawSelection(sel);
    drawPreview(); drawMeasure(); drawHand(); drawScale();
  }
  function drawGrid() {
    var s = S.cam.s, tl = S2W(0, 0), br = S2W(S.vw, S.vh);
    function lines(step, color) {
      ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath();
      for (var x = Math.floor(tl.x / step) * step; x <= br.x; x += step) { var px = Math.round(W2S(x, 0).x) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, S.vh); }
      for (var y = Math.floor(br.y / step) * step; y <= tl.y; y += step) { var py = Math.round(W2S(0, y).y) + 0.5; ctx.moveTo(0, py); ctx.lineTo(S.vw, py); }
      ctx.stroke();
    }
    if (0.1 * s >= 9) lines(0.1, C.grid);
    lines(0.5, C['grid-strong']);
  }
  function hatch(x1, y1, x2, y2, side, len) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 1) return;
    var ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side;
    ctx.beginPath();
    for (var t = 4; t < L; t += 8) { var px = x1 + ux * t, py = y1 + uy * t; ctx.moveTo(px, py); ctx.lineTo(px + (nx - ux) * len * 0.7, py + (ny - uy) * len * 0.7); }
    ctx.stroke();
  }
  function groundSymbol(x, y) {
    ctx.fillStyle = C.part; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 13); ctx.lineTo(x + 8, y + 13); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 12, y + 13); ctx.lineTo(x + 12, y + 13); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = C['ink-2'];
    hatch(x - 12, y + 13, x + 12, y + 13, -1, 6);
  }
  function drawRamp(p) {
    var a = W2S(p.x1, p.y1), b = W2S(p.x2, p.y2);
    ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(3, 2 * P.RAMP_R * S.cam.s);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    var dx = b.x - a.x, dy = b.y - a.y, side = dx >= 0 ? 1 : -1;
    if (Math.abs(dx) < 0.3 * Math.abs(dy)) side = dy > 0 ? -1 : 1;
    var off = 1 + Math.max(1.5, P.RAMP_R * S.cam.s), L = Math.hypot(dx, dy) || 1, nx = -dy / L * side, ny = dx / L * side;
    ctx.lineWidth = 1; ctx.strokeStyle = C['ink-3'];
    hatch(a.x + nx * off, a.y + ny * off, b.x + nx * off, b.y + ny * off, side, 7);
  }
  function drawWheel(p) {
    var b = bodyOf(p.id), c = sp(b, p.x, p.y), R = p.r * S.cam.s, ang = bodyAngle(b);
    if (p.style === 'ring') {
      var g = P.ringGeometry(p);
      ctx.fillStyle = C.part; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, 2 * Math.PI); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(2, 2 * P.RIM_R * S.cam.s);
      ctx.beginPath(); ctx.arc(c.x, c.y, (p.r - P.RIM_R) * S.cam.s, 0, 2 * Math.PI); ctx.stroke();
      ctx.lineWidth = Math.max(1.5, 2 * P.DIV_R * S.cam.s); ctx.lineCap = 'round'; ctx.strokeStyle = C['ink-2'];
      ctx.beginPath();
      g.dividers.forEach(function (s) { var a1 = sp(b, p.x + s[0], p.y + s[1]), a2 = sp(b, p.x + s[2], p.y + s[3]); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); });
      ctx.stroke();
      ctx.fillStyle = C.part; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(c.x, c.y, g.hub * S.cam.s, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillStyle = C.part; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(c.x, c.y, R * 0.9, 0, 2 * Math.PI); ctx.stroke();
      var n = Math.max(3, p.spokes || 8);
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.4; ctx.beginPath();
      for (var k = 0; k < n; k++) {
        var t = ang + k * 2 * Math.PI / n, cs = Math.cos(t), sn = Math.sin(t);
        ctx.moveTo(c.x + cs * R * 0.12, c.y - sn * R * 0.12); ctx.lineTo(c.x + cs * R * 0.9, c.y - sn * R * 0.9);
      }
      ctx.stroke();
      ctx.fillStyle = C['panel-2']; ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(c.x, c.y, Math.max(6, R * 0.12), 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
    if (p.axle === 'fixed') {
      groundSymbol(c.x, c.y);
      ctx.fillStyle = C.part; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(c.x, c.y, 4.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      drawDevices(p, c.x, c.y, S.info.wheelJoint[p.id]);
    }
  }
  function drawBar(p) {
    var b = bodyOf(p.id), a1 = sp(b, p.x1, p.y1), a2 = sp(b, p.x2, p.y2);
    ctx.strokeStyle = C['ink-2']; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(3.5, 2 * P.BAR_R * S.cam.s);
    ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();
  }
  var MAT_COLOR = { plomo: 'lead', acero: 'steel', madera: 'wood', goma: 'rubber' };
  function drawBall(p) {
    var b = bodyOf(p.id), c = sp(b, p.x, p.y), R = Math.max(3, p.r * S.cam.s);
    ctx.fillStyle = C[MAT_COLOR[p.mat] || 'lead']; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    var t = bodyAngle(b);
    ctx.strokeStyle = C.panel; ctx.globalAlpha = 0.7; ctx.lineWidth = Math.max(1, R * 0.12);
    ctx.beginPath(); ctx.arc(c.x, c.y, R * 0.62, -t - 0.5, -t + 0.5); ctx.stroke(); ctx.globalAlpha = 1;
    if (S.mode === 'design' && R >= 6) {
      ctx.fillStyle = C['ink-2']; ctx.font = '500 11px ' + F.mono; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(fmt(p.m, p.m < 1 ? 2 : (p.m < 10 ? 1 : 0)) + ' kg', c.x + R + 4, c.y);
    }
  }
  function drawSpring(p) {
    var A = bodyOf(p.a), B = bodyOf(p.b), a = sp(A, p.x1, p.y1), b = sp(B, p.x2, p.y2);
    var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var n = 12, amp = 6, lead = Math.min(10, L * 0.15);
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + ux * lead, a.y + uy * lead);
    for (var k = 1; k < n; k++) { var t = lead + (L - 2 * lead) * k / n, s = (k % 2 ? 1 : -1) * amp; ctx.lineTo(a.x + ux * t + nx * s, a.y + uy * t + ny * s); }
    ctx.lineTo(b.x - ux * lead, b.y - uy * lead); ctx.lineTo(b.x, b.y); ctx.stroke();
    [[a, p.a], [b, p.b]].forEach(function (e) {
      if (!e[1]) groundSymbol(e[0].x, e[0].y);
      ctx.fillStyle = C.part; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(e[0].x, e[0].y, 3.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    });
  }
  function electroOn(p) { var e = S.info.electroOf && S.info.electroOf[p.id]; return e ? e.on : true; }
  function drawMagnet(p, ghost) {
    var host = ghost ? S.info.world.ground : bodyOf(p.host), c = ghost ? W2S(p.x, p.y) : sp(host, p.x, p.y);
    var ang = p.ang * DEG + (ghost ? 0 : bodyAngle(host)), model = P.magnetModel(p);
    var L = Math.max(22, model.size * S.cam.s);
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(-ang);
    if (ghost) ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.2; ctx.strokeStyle = C.ink;
    function split(x, y, w, h) {
      ctx.fillStyle = C.north; ctx.fillRect(x + w / 2, y, w / 2, h);
      ctx.fillStyle = C.south; ctx.fillRect(x, y, w / 2, h);
      ctx.strokeRect(x, y, w, h);
    }
    if (!p.host && !ghost) { ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1; ctx.strokeRect(-L / 2 - 4, -L / 2 - 4, L + 8, L + 8); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; }
    if (model.shape === 'disc') {
      ctx.fillStyle = C.north; ctx.beginPath(); ctx.arc(0, 0, L / 2, -Math.PI / 2, Math.PI / 2); ctx.fill();
      ctx.fillStyle = C.south; ctx.beginPath(); ctx.arc(0, 0, L / 2, Math.PI / 2, 3 * Math.PI / 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, L / 2, 0, 2 * Math.PI); ctx.stroke();
    } else if (model.shape === 'horseshoe') {
      var sep = 0.55 * L, w = 0.22 * L;
      ctx.fillStyle = '#b8322f';
      ctx.fillRect(-L / 2, -sep / 2 - w / 2, L - w, w); ctx.fillRect(-L / 2, sep / 2 - w / 2, L - w, w);
      ctx.fillRect(-L / 2, -sep / 2 - w / 2, w, sep + w);
      ctx.fillStyle = C.north; ctx.fillRect(L / 2 - w, -sep / 2 - w / 2, w, w);
      ctx.fillStyle = C.south; ctx.fillRect(L / 2 - w, sep / 2 - w / 2, w, w);
      ctx.beginPath();
      ctx.moveTo(L / 2, -sep / 2 - w / 2); ctx.lineTo(-L / 2, -sep / 2 - w / 2); ctx.lineTo(-L / 2, sep / 2 + w / 2); ctx.lineTo(L / 2, sep / 2 + w / 2);
      ctx.lineTo(L / 2, sep / 2 - w / 2); ctx.lineTo(-L / 2 + w, sep / 2 - w / 2); ctx.lineTo(-L / 2 + w, -sep / 2 + w / 2); ctx.lineTo(L / 2, -sep / 2 + w / 2); ctx.closePath(); ctx.stroke();
    } else if (model.shape === 'halbach') {
      var cu = L / 5;
      for (var i = 0; i < 5; i++) { ctx.save(); ctx.translate((i - 2) * cu, 0); ctx.rotate(-i * Math.PI / 2); split(-cu / 2, -cu / 2, cu, cu); ctx.restore(); }
    } else if (model.shape === 'electro') {
      var on = ghost || electroOn(p), wb = 0.45 * L;
      ctx.fillStyle = C.steel; ctx.fillRect(-L / 2, -wb * 0.15, L, wb * 0.3); ctx.strokeRect(-L / 2, -wb * 0.15, L, wb * 0.3);
      ctx.fillStyle = on ? '#c4702f' : '#8a6a52'; ctx.fillRect(-L * 0.36, -wb / 2, L * 0.72, wb);
      ctx.strokeStyle = '#6b3511'; ctx.beginPath();
      for (var x = -L * 0.36 + 4; x < L * 0.36; x += 4) { ctx.moveTo(x, -wb / 2); ctx.lineTo(x, wb / 2); }
      ctx.stroke(); ctx.strokeStyle = C.ink; ctx.strokeRect(-L * 0.36, -wb / 2, L * 0.72, wb);
      if (on) { ctx.fillStyle = C.north; ctx.fillRect(L / 2 - 4, -wb * 0.3, 4, wb * 0.6); }
    } else split(-L / 2, -L / 4, L, L / 2);
    if (model.shape === 'bar' || model.shape === 'disc') {
      ctx.fillStyle = '#ffffff'; ctx.font = '600 ' + Math.max(9, Math.round(L * 0.32)) + 'px ' + F.display;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.save(); ctx.translate(L / 4, 0); ctx.rotate(ang); ctx.fillText('N', 0, 1); ctx.restore();
      ctx.save(); ctx.translate(-L / 4, 0); ctx.rotate(ang); ctx.fillText('S', 0, 1); ctx.restore();
    }
    ctx.restore();
  }
  function drawPin(p) {
    var j = S.info.jointOf[p.id], c;
    if (j) { var wa = j.a.toWorld(j.lax, j.lay); c = W2S(wa.x, wa.y); } else c = sp(bodyOf(p.b), p.x, p.y);
    if (p.mode === 'rigid') { ctx.fillStyle = C.ink; ctx.fillRect(c.x - 3, c.y - 3, 6, 6); return; }
    if (!p.a) groundSymbol(c.x, c.y);
    if (p.mode === 'limits' && (S.mode === 'design' || S.sel === p.id)) drawLimitArc(p, c);
    ctx.fillStyle = C.part; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(c.x, c.y, 4.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    drawDevices(p, c.x, c.y, j);
  }
  function pinDirection(p) {
    var b = find(p.b);
    if (b && b.kind === 'bar') {
      var d1 = Math.hypot(b.x1 - p.x, b.y1 - p.y), d2 = Math.hypot(b.x2 - p.x, b.y2 - p.y);
      return d1 < d2 ? Math.atan2(b.y2 - p.y, b.x2 - p.x) : Math.atan2(b.y1 - p.y, b.x1 - p.x);
    }
    if (b && (b.kind === 'ball' || b.kind === 'wheel') && Math.hypot(b.x - p.x, b.y - p.y) > 1e-4) return Math.atan2(b.y - p.y, b.x - p.x);
    return -Math.PI / 2;
  }
  function drawLimitArc(p, c) {
    var base = pinDirection(p) + bodyAngle(bodyOf(p.a));
    var lo = Math.min(p.lo, 0) * DEG, hi = Math.max(p.hi, 0) * DEG;
    ctx.fillStyle = C['accent-soft']; ctx.strokeStyle = C.accent; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.arc(c.x, c.y, 20, -(base + hi), -(base + lo)); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  function drawDevices(p, x, y, j) {
    if (p.gen > 0) {
      var pw = j ? Math.max(0, j.power || 0) : 0, lit = Math.min(1, pw / 1.5), bx = x + 13, by = y - 15;
      if (lit > 0.01) {
        var g = ctx.createRadialGradient(bx, by, 2, bx, by, 26);
        g.addColorStop(0, 'rgba(255, 205, 70,' + (0.75 * lit) + ')'); g.addColorStop(1, 'rgba(255, 205, 70, 0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, 26, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.fillStyle = lit > 0.01 ? '#ffd34d' : C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.fillRect(bx - 2.5, by + 5, 5, 3);
      if (S.mode !== 'design' && pw > 0.005) {
        ctx.font = '500 11px ' + F.mono; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(fmt(pw, pw < 1 ? 2 : 1) + ' W', bx + 9, by);
      }
    }
    if (p.motor) {
      var mx = x - 15, my = y - 15, on = j && (j.mpower || 0) > 0.01;
      ctx.fillStyle = on ? C.accent : C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(mx, my, 7.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      ctx.fillStyle = on ? C.panel : C.ink; ctx.font = '700 10px ' + F.display; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('M', mx, my + 0.5);
    }
  }
  function drawSelection(p) {
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
    if (p.kind === 'wheel' || p.kind === 'ball') {
      var c = sp(bodyOf(p.id), p.x, p.y);
      ctx.beginPath(); ctx.arc(c.x, c.y, p.r * S.cam.s + 5, 0, 2 * Math.PI); ctx.stroke();
    } else if ('x1' in p) {
      var A = p.kind === 'spring' ? bodyOf(p.a) : bodyOf(p.id), B = p.kind === 'spring' ? bodyOf(p.b) : bodyOf(p.id);
      var a = sp(A, p.x1, p.y1), b = sp(B, p.x2, p.y2);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = C.accent;
      if (S.mode === 'design') [a, b].forEach(function (e) { ctx.beginPath(); ctx.arc(e.x, e.y, 6, 0, 2 * Math.PI); ctx.fill(); });
    } else {
      var host = p.kind === 'magnet' ? bodyOf(p.host) : bodyOf(p.b), q = sp(host, p.x, p.y);
      ctx.beginPath(); ctx.arc(q.x, q.y, p.kind === 'magnet' ? Math.max(18, P.magnetModel(p).size * S.cam.s * 0.7) : 10, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.restore();
  }
  function drawGhosts(list) {
    list.forEach(function (q) {
      if (q.kind === 'magnet') { drawMagnet(q, true); return; }
      ctx.save(); ctx.globalAlpha = 0.6; ctx.setLineDash([5, 4]); ctx.strokeStyle = C.accent; ctx.lineWidth = 1.8;
      if (q.kind === 'wheel' || q.kind === 'ball') { var c = W2S(q.x, q.y); ctx.beginPath(); ctx.arc(c.x, c.y, Math.max(3, q.r * S.cam.s), 0, 2 * Math.PI); ctx.stroke(); }
      else if ('x1' in q) { var a = W2S(q.x1, q.y1), b = W2S(q.x2, q.y2); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      else if (q.kind === 'pin') { var pp = W2S(q.x, q.y); ctx.beginPath(); ctx.arc(pp.x, pp.y, 4, 0, 2 * Math.PI); ctx.stroke(); }
      ctx.restore();
    });
  }
  function drawPreview() {
    var d = S.drag;
    if (!d || !d.preview) return;
    ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
    var a = W2S(d.a.x, d.a.y), b = d.b ? W2S(d.b.x, d.b.y) : a;
    if (d.kind2 === 'wheel' || d.kind2 === 'ring') {
      var r = d.b ? Math.hypot(d.b.x - d.a.x, d.b.y - d.a.y) : 0.45;
      if (r < 0.03) r = 0.45;
      ctx.beginPath(); ctx.arc(a.x, a.y, r * S.cam.s, 0, 2 * Math.PI); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (d.kind2 === 'arm' && d.b) { ctx.setLineDash([]); ctx.beginPath(); ctx.arc(b.x, b.y, 0.06 * S.cam.s, 0, 2 * Math.PI); ctx.stroke(); }
    }
    ctx.restore();
  }
  function drawMeasure() {
    var m = S.measure;
    if (!m || !m.b) return;
    var a = W2S(m.a.x, m.a.y), b = W2S(m.b.x, m.b.y);
    ctx.save(); ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.accent;
    [a, b].forEach(function (e) { ctx.beginPath(); ctx.arc(e.x, e.y, 4, 0, 2 * Math.PI); ctx.fill(); });
    ctx.restore();
  }
  function drawHand() {
    var H = S.info.world.hand;
    if (!H || !H.body) return;
    var p = H.body.toWorld(H.lx, H.ly), a = W2S(p.x, p.y), t = W2S(H.tx, H.ty);
    ctx.save(); ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(t.x, t.y); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = C['accent-soft']; ctx.beginPath(); ctx.arc(t.x, t.y, 14, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function drawScale() {
    var s = S.cam.s, options = [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5], len = options[0];
    for (var i = 0; i < options.length; i++) { len = options[i]; if (options[i] * s >= 60) break; }
    var px = len * s, x = 12, y = 50;
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + px, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.moveTo(x + px, y - 4); ctx.lineTo(x + px, y + 4); ctx.stroke();
    ctx.fillStyle = C['ink-2']; ctx.font = '500 11.5px ' + F.mono; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(len < 1 ? fmt(len * 100, 0) + ' cm' : fmt(len, 0) + ' m', x, y + 6);
  }

  // etiqueta de medidas: la regla o la pieza seleccionada
  function placeDimLabel() {
    var el = $('dimlabel'), m = S.measure, txt = null, at = null;
    if (m && m.b) {
      var L = Math.hypot(m.b.x - m.a.x, m.b.y - m.a.y), ang = Math.atan2(m.b.y - m.a.y, m.b.x - m.a.x) / DEG;
      txt = fmtCm(L) + ' · ' + fmt(ang, 0) + '°'; at = { x: (m.a.x + m.b.x) / 2, y: (m.a.y + m.b.y) / 2, z: 0.12 };
    } else if (S.mode === 'design' && S.sel && !(S.drag && S.drag.moved)) {
      var p = find(S.sel);
      if (p) {
        if ('x1' in p) { txt = fmtCm(Math.hypot(p.x2 - p.x1, p.y2 - p.y1)) + ' · ' + fmt(Math.atan2(p.y2 - p.y1, p.x2 - p.x1) / DEG, 0) + '°'; at = { x: (p.x1 + p.x2) / 2, y: (p.y1 + p.y2) / 2, z: 0.05 }; }
        else if (p.kind === 'wheel') { txt = 'radio ' + fmtCm(p.r); at = { x: p.x, y: p.y + p.r, z: 0.05 }; }
        else if (p.kind === 'ball') { txt = 'Ø ' + fmtCm(2 * p.r) + ' · ' + fmt(p.m, 2) + ' kg'; at = { x: p.x, y: p.y + p.r, z: 0.08 }; }
        else if (p.kind === 'magnet') { var md = P.magnetModel(p); txt = fmtCm(md.size) + ' · ' + fmt(md.mu, 1) + ' A·m²'; at = { x: p.x, y: p.y + md.size / 2, z: 0.05 }; }
      }
    }
    if (!txt) { el.hidden = true; return; }
    var s = screenOf(at.x, at.y, at.z);
    if (!isFinite(s.x) || s.x < 0 || s.y < 0 || s.x > S.vw || s.y > S.vh) { el.hidden = true; return; }
    el.hidden = false; el.textContent = txt;
    el.style.left = s.x + 'px'; el.style.top = s.y + 'px';
  }

  // ---------- balanza de pares ----------
  function mainWheel() {
    var sel = find(S.sel);
    if (sel && sel.kind === 'wheel' && sel.axle === 'fixed' && S.info.wheelJoint[sel.id]) return sel;
    return parts().filter(function (p) { return p.kind === 'wheel' && p.axle === 'fixed' && S.info.wheelJoint[p.id]; })[0] || null;
  }
  function torqueBalance() {
    var wp = mainWheel();
    if (!wp) return null;
    var j = S.info.wheelJoint[wp.id], w = S.info.world, wb = j.b, ax = j.a.toWorld(j.lax, j.lay);
    var set = new Set(S.info.assemblyOf(wb));
    (w.contacts || []).forEach(function (c) { if (set.has(c.A) && !c.B.isStatic) set.add(c.B); else if (set.has(c.B) && !c.A.isStatic) set.add(c.A); });
    var res = { L: 0, R: 0, nL: 0, nR: 0, armL: 0, armR: 0, mL: 0, mR: 0, ax: ax, bodies: [] };
    set.forEach(function (b) {
      var dx = b.x - ax.x, tq = b.m * w.g * Math.abs(dx);
      var isWeight = (S.info.partsOfBody.get(b) || []).some(function (q) { return q.kind === 'ball'; });
      if (dx < -1e-4) { res.L += tq; if (isWeight) { res.nL++; res.armL += b.m * -dx; res.mL += b.m; } }
      else if (dx > 1e-4) { res.R += tq; if (isWeight) { res.nR++; res.armR += b.m * dx; res.mR += b.m; } }
      if (isWeight) res.bodies.push(b);
    });
    res.armL = res.mL ? res.armL / res.mL : 0; res.armR = res.mR ? res.armR / res.mR : 0;
    return res;
  }
  function drawForces() {
    var tb = torqueBalance();
    if (!tb) return;
    var a = W2S(tb.ax.x, tb.ax.y);
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a.x, 0); ctx.lineTo(a.x, S.vh); ctx.stroke(); ctx.setLineDash([]);
    tb.bodies.forEach(function (b) {
      var p = W2S(b.x, b.y);
      ctx.strokeStyle = b.x > tb.ax.x ? C.s2 : C.s1; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(a.x, p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      var len = 16 + 10 * Math.cbrt(b.m);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + len); ctx.moveTo(p.x - 4, p.y + len - 6); ctx.lineTo(p.x, p.y + len); ctx.lineTo(p.x + 4, p.y + len - 6); ctx.stroke();
    });
    ctx.restore();
  }

  // ---------- paneles ----------
  function renderPanels() { if (!S.info) return; renderVerdict(); renderLedger(); renderChart(); renderBalance(); }
  function categories(b) {
    return [
      { k: 'axle', name: 'Rozamiento en ejes y bisagras', v: b.axle, c: 's1' },
      { k: 'hits', name: 'Golpes y choques', v: b.hits, c: 's2' },
      { k: 'rub', name: 'Roce y rodadura entre piezas', v: b.rub, c: 's3' },
      { k: 'air', name: 'Resistencia del aire', v: b.air, c: 's4' },
      { k: 'springs', name: 'Muelles (amortiguación)', v: b.springs, c: 's5' },
      { k: 'heat', name: 'Calor en motores, generadores y bobinas', v: b.heat, c: 's6' },
      { k: 'bus', name: 'Electricidad útil guardada', v: b.bus, c: 's7' }
    ];
  }
  function hasGen() { return parts().some(function (p) { return p.gen > 0; }); }
  function hasElectric() { return parts().some(function (p) { return p.gen > 0 || p.motor || (p.kind === 'magnet' && p.shape === 'electro'); }); }
  function joinEs(arr) { return arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1]; }
  var LOSS_NAMES = { axle: 'el rozamiento de los ejes', hits: 'los golpes', rub: 'el roce entre piezas', air: 'el aire', springs: 'los muelles', heat: 'el calor de motores y bobinas' };

  function verdictData() {
    var w = S.info.world, b = w.balance();
    var tone = 'design', state = 'Diseño', title = '', text = '', warn = '';
    var losses = b.axle + b.hits + b.rub + b.air + b.springs + b.heat, inflow = b.reserve + b.hand + b.battery;
    if (S.mode === 'design') {
      if (!parts().length) { title = 'El banco está vacío'; text = 'Pulsa «Añadir» para elegir una pieza, o carga uno de los ejemplos.'; }
      else { title = 'Lista para probar'; text = 'Pulsa «Probar». El banco simula la física real y apunta cada julio que entra y sale de tu máquina.'; }
      return { tone: tone, state: state, title: title, text: text, warn: '' };
    }
    var rate = 0, h = S.hist, last = h[h.length - 1];
    for (var i = h.length - 1; i >= 0; i--) {
      if (last.t - h[i].t >= 3 || i === 0) { var dt = last.t - h[i].t; if (dt > 0.2) rate = (last.lost - h[i].lost) / dt; break; }
    }
    var genW = w.genPower || 0;
    if (S.mode === 'stopped') {
      tone = 'stop'; state = 'Parada';
      if (S.endReason === 'numeric') {
        title = 'Prueba detenida: el cálculo se ha descontrolado';
        text = 'En esta máquina el simulador ha empezado a sumar energía que no existe (' + fmtJ(-b.error) + '). Es un fallo de cálculo, no un hallazgo. Suele pasar con muelles muy rígidos en piezas ligeras, piezas unidas que no encajan entre sí o imanes muy fuertes pegados a piezas ligeras. Ajusta esas piezas y vuelve a probar.';
      } else if (S.endReason === 'time') {
        title = 'Prueba de 10 minutos terminada';
        text = 'En este tiempo ha gastado ' + fmtJ(inflow) + (b.battery > 0.01 ? ', ' + fmtJ(b.battery) + ' de ellos de la batería' : '') + '. No ha producido nada por su cuenta.';
      } else if (S.maxK < 2e-4 && b.hand < 1e-3) {
        title = 'No se ha movido';
        text = 'Está en equilibrio: lo que tira hacia un lado se compensa con lo que tira hacia el otro. Si quieres, empújala con el dedo.';
      } else {
        title = 'Se ha parado a los ' + fmt(w.t, 1) + ' s';
        var cats = categories(b).filter(function (c) { return c.k !== 'bus' && c.v > 0.0005; }).sort(function (x, y) { return y.v - x.v; });
        var tot = cats.reduce(function (s, c) { return s + c.v; }, 0) || 1;
        var ps = cats.slice(0, 3).map(function (c) { return LOSS_NAMES[c.k] + ' (' + pct(c.v / tot) + ')'; });
        text = 'Tenía ' + fmtJ(inflow) + ' para gastar' + (b.hand > 0.001 ? ', contando tus empujones' : '') + '. ';
        if (ps.length) text += 'Se fue en ' + joinEs(ps) + '. ';
        if (b.gen > 0.0005) text += 'Antes de pararse sus generadores produjeron ' + fmtJ(b.gen) + ': una bombilla LED de 1 W lucería ' + fmt(b.gen, b.gen < 10 ? 1 : 0) + ' s. ';
        if (b.bus <= inflow + 0.01) text += 'No ha sacado ni un julio que no tuviera al empezar.';
      }
    } else {
      tone = S.mode === 'run' ? 'run' : 'design';
      state = S.mode === 'run' ? 'Probando' : 'En pausa';
      if (w.t < 0.6) { title = 'Arrancando…'; text = 'Mira cómo se mueve. Las cuentas se actualizan mientras tanto.'; }
      else if (b.battery > 0.05) {
        title = 'Funciona con batería';
        text = 'La batería lleva puestos ' + fmtJ(b.battery) + '. De eso, ' + fmtJ(b.heat) + ' se han ido en calor' + (b.bus > 0.01 ? ' y ' + fmtJ(b.bus) + ' han vuelto como electricidad útil' : '') + '. Sin batería se pararía.';
      } else if (S.maxK < 2e-4 && b.hand < 1e-3) { title = 'Quieta por ahora'; text = 'Si no arranca sola es que está equilibrada. Puedes empujarla con el dedo.'; }
      else if (genW > 0.0005) {
        title = 'Produce ' + fmt(genW, genW < 1 ? 2 : 1) + ' W';
        text = 'Sus generadores han producido ' + fmtJ(b.gen) + (b.busUsed > 0.01 ? ' y sus motores han gastado ' + fmtJ(b.busUsed) + ' de ellos' : '') + '. Todo sale de la energía que tenía al empezar o de tus empujones. Cada segundo pierde ' + fmt(rate, 2) + ' J.';
      } else if (S.design.ideal && rate < 0.002) {
        tone = 'ideal'; title = 'Ni pierde ni gana';
        text = 'En este mundo ideal no hay rozamiento ni aire, así que conserva su energía y sigue moviéndose. Pero no gana ni un julio. En cuanto saques energía con un generador, se parará.';
      } else {
        title = 'Pierde ' + fmt(rate, rate < 0.1 ? 3 : 2) + ' J cada segundo';
        var top = categories(b).filter(function (c) { return c.k !== 'bus' && c.v > 0.0005; }).sort(function (x, y) { return y.v - x.v; }).slice(0, 2).map(function (c) { return LOSS_NAMES[c.k]; });
        text = 'Se mueve con la energía que tenía al empezar' + (b.hand > 0.001 ? ' y la de tus empujones' : '') + ', y cada segundo le cuesta: ' + (top.length ? joinEs(top) : 'rozamiento y aire') + '. Ninguna pieza le devuelve energía.';
      }
    }
    var errAbs = Math.abs(b.error), scale = Math.max(Math.abs(inflow), losses + b.bus, 0.01);
    if (S.endReason !== 'numeric' && errAbs > Math.max(0.02, 0.01 * scale)) {
      warn = 'Error de cálculo del simulador en esta prueba: ' + fmtJ(b.error) + ' (' + pct(errAbs / scale) + ' del total). Aparece con muchos golpes a la vez y no es energía real. Te lo enseñamos para que las cuentas sean completas.';
    }
    return { tone: tone, state: state, title: title, text: text, warn: warn };
  }
  function renderVerdict() {
    var v = verdictData(), el = $('verdict');
    el.setAttribute('data-tone', v.tone);
    el.innerHTML = '<div class="state"><span class="dot"></span>' + esc(v.state) + '</div><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p>' + (v.warn ? '<div class="warnline">' + esc(v.warn) + '</div>' : '');
    if (S.mode !== 'design') $('hint').innerHTML = '<b>' + esc(v.title) + '.</b> ' + (S.mode === 'stopped' ? 'Mira las cuentas para ver a dónde fue la energía.' : esc(HAND_HINT));
  }
  function renderLedger() {
    var w = S.info.world, b = w.balance(), design = S.mode === 'design';
    var elec = hasElectric(), springs = parts().some(function (p) { return p.kind === 'spring'; });
    var rows = categories(b).filter(function (c) { return (c.k !== 'springs' || springs) && ((c.k !== 'heat' && c.k !== 'bus') || elec); });
    var inflow = b.reserve + b.hand + b.battery;
    function val(x) { return design ? '—' : fmtJ(x); }
    var h = '<tr><th colspan="2">Entradas · de dónde sale</th></tr>';
    h += '<tr><td>Gastada de su reserva<span class="sub">altura de las piezas, muelles, imanes y giro inicial' + (b.reserve < -0.0005 && !design ? '; en negativo, la ha acumulado' : '') + '</span></td><td class="v">' + val(b.reserve) + '</td></tr>';
    h += '<tr' + (b.hand > 0.0005 ? '' : ' class="dim"') + '><td>Tus empujones<span class="sub">con el dedo durante la prueba</span></td><td class="v">' + val(b.hand) + '</td></tr>';
    if (elec) h += '<tr' + (b.battery > 0.0005 ? '' : ' class="dim"') + '><td>Batería<span class="sub">motores y electroimanes conectados a la pila</span></td><td class="v">' + val(b.battery) + '</td></tr>';
    h += '<tr class="total"><td>Total que entra</td><td class="v">' + val(inflow) + '</td></tr>';
    h += '<tr><th colspan="2">Salidas · a dónde va</th></tr>';
    rows.forEach(function (c) { h += '<tr' + (c.v > 0.0005 || design ? '' : ' class="dim"') + '><td><span class="sw" style="background:var(--' + c.c + ')"></span>' + esc(c.name) + '</td><td class="v">' + val(c.v) + '</td></tr>'; });
    h += '<tr class="err"><td>Error de cálculo del simulador</td><td class="v">' + val(b.error) + '</td></tr>';
    h += '<tr class="total"><td>Total que sale</td><td class="v">' + val(inflow) + '</td></tr>';
    $('ledger').innerHTML = h;
    var tot = rows.reduce(function (s, c) { return s + Math.max(0, c.v); }, 0), sp_ = $('split');
    if (design || tot < 1e-4) { sp_.innerHTML = ''; return; }
    sp_.innerHTML = rows.filter(function (c) { return c.v > tot * 0.004; }).map(function (c) {
      return '<i style="flex:' + (c.v / tot).toFixed(4) + ' 1 0;background:var(--' + c.c + ')" title="' + esc(c.name) + '"></i>';
    }).join('');
  }

  var chartHover = null;
  function renderChart() {
    var cv = $('chart'), box = $('chartbox'), r = box.getBoundingClientRect();
    if (r.width < 10) return;
    var dpr = S.dpr, W = r.width, H = r.height;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    var g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var h = S.hist, gen = hasGen(), bat = hasPower();
    if (h.length < 2) {
      g.fillStyle = C['ink-3']; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '13px ' + F.body;
      g.fillText('Aquí verás la energía cuando pulses «Probar».', W / 2, H / 2);
      $('tip').hidden = true; $('legend').innerHTML = ''; return;
    }
    var tMax = Math.max(10, h[h.length - 1].t), yMax = 0;
    h.forEach(function (p) { yMax = Math.max(yMax, p.K, p.lost, gen ? p.gen : 0, bat ? p.bat : 0); });
    yMax = niceMax(Math.max(yMax, 0.01));
    var L = 44, Rp = 12, T = 8, B = 22, pw = W - L - Rp, ph = H - T - B;
    function X(t) { return L + t / tMax * pw; }
    function Y(v) { return T + ph - v / yMax * ph; }
    g.font = '11px ' + F.mono; g.fillStyle = C['ink-3']; g.strokeStyle = C.rule; g.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var v = yMax * i / 4, y = Math.round(Y(v)) + 0.5;
      g.beginPath(); g.moveTo(L, y); g.lineTo(W - Rp, y); g.stroke();
      g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(fmt(v, yMax < 0.1 ? 3 : (yMax < 2 ? 2 : (yMax < 20 ? 1 : 0))), L - 6, y);
    }
    var tStep = niceStep(tMax / 5);
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (var t = 0; t <= tMax + 1e-9; t += tStep) g.fillText(fmt(t, tStep < 1 ? 1 : 0) + ' s', X(t), T + ph + 6);
    g.beginPath(); g.moveTo(X(h[0].t), Y(0));
    h.forEach(function (p) { g.lineTo(X(p.t), Y(p.K)); });
    g.lineTo(X(h[h.length - 1].t), Y(0)); g.closePath(); g.fillStyle = C['accent-soft']; g.fill();
    var series = [['K', C.ink, []], ['lost', C['ink-3'], [5, 4]]];
    if (gen) series.push(['gen', C.s7, []]);
    if (bat) series.push(['bat', C.s6, [2, 3]]);
    series.forEach(function (s) { line(g, h, X, Y, s[0], s[1], s[2]); });
    var lastP = h[h.length - 1];
    series.forEach(function (s) { g.fillStyle = s[1]; g.beginPath(); g.arc(X(lastP.t), Y(lastP[s[0]]), 3.5, 0, 2 * Math.PI); g.fill(); });
    var tip = $('tip');
    if (chartHover != null) {
      var tt = (chartHover - L) / pw * tMax, best = h[0];
      h.forEach(function (p) { if (Math.abs(p.t - tt) < Math.abs(best.t - tt)) best = p; });
      var hx = X(best.t);
      g.strokeStyle = C['ink-3']; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(hx, T); g.lineTo(hx, T + ph); g.stroke(); g.setLineDash([]);
      tip.hidden = false;
      tip.textContent = fmt(best.t, 1) + ' s · movimiento ' + fmtJ(best.K) + ' · perdida ' + fmtJ(best.lost) + (gen ? ' · producida ' + fmtJ(best.gen) : '') + (bat ? ' · batería ' + fmtJ(best.bat) : '');
      var tw = tip.offsetWidth;
      tip.style.left = Math.min(W - tw - 2, Math.max(2, hx - tw / 2)) + 'px'; tip.style.top = (T + 2) + 'px';
    } else tip.hidden = true;
    $('legend').innerHTML = '<span><i style="background:var(--ink)"></i>Energía de movimiento</span><span><i class="dash"></i>Perdida en total</span>' +
      (gen ? '<span><i style="background:var(--s7)"></i>Electricidad producida</span>' : '') + (bat ? '<span><i style="background:var(--s6)"></i>Puesta por la batería</span>' : '');
  }
  function line(g, h, X, Y, key, color, dash) {
    g.strokeStyle = color; g.lineWidth = 2; g.setLineDash(dash); g.lineJoin = 'round';
    g.beginPath(); h.forEach(function (p, i) { var x = X(p.t), y = Y(p[key]); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke(); g.setLineDash([]);
  }
  function niceMax(v) { var e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e; }
  function niceStep(v) { var e = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1e-6)))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; }

  function renderBalance() {
    var card = $('balanceCard'), tb = torqueBalance();
    if (!tb || (tb.nL + tb.nR) === 0) { card.hidden = true; return; }
    card.hidden = false;
    var tot = tb.L + tb.R || 1, tilt = Math.max(-14, Math.min(14, (tb.R - tb.L) / tot * 30));
    function weights(side, n) { var o = ''; for (var k = 0; k < Math.min(n, 8); k++) o += '<circle cx="' + side * (40 + k * 11) + '" cy="-8" r="6" fill="var(--' + (side < 0 ? 's1' : 's2') + ')" stroke="var(--ink)" stroke-width="1"/>'; return o; }
    $('seesaw').innerHTML = '<g transform="translate(160 64)"><path d="M0 0 L-12 26 L12 26 Z" fill="var(--part)" stroke="var(--ink)" stroke-width="1.5"/><g transform="rotate(' + tilt.toFixed(2) + ')"><line x1="-130" y1="0" x2="130" y2="0" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>' + weights(-1, tb.nL) + weights(1, tb.nR) + '</g><circle r="4" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.5"/></g>';
    $('sides').innerHTML =
      '<div><span style="color:var(--s1)">■</span> Tira hacia la izquierda<b>' + fmt(tb.L, 1) + ' N·m</b>' + tb.nL + ' ' + (tb.nL === 1 ? 'pesa' : 'pesas') + ', a ' + fmt(tb.armL, 2) + ' m de media</div>' +
      '<div class="r"><span style="color:var(--s2)">■</span> Tira hacia la derecha<b>' + fmt(tb.R, 1) + ' N·m</b>' + tb.nR + ' ' + (tb.nR === 1 ? 'pesa' : 'pesas') + ', a ' + fmt(tb.armR, 2) + ' m de media</div>';
    var farR = tb.armR > tb.armL * 1.08, farL = tb.armL > tb.armR * 1.08, note;
    if (S.mode === 'stopped' && S.endReason === 'stopped') note = 'Parada con los dos lados igualados. La pequeña diferencia la sujeta el rozamiento del eje.';
    else if ((farR && tb.nL > tb.nR) || (farL && tb.nR > tb.nL)) note = 'Las pesas de la ' + (farR ? 'derecha' : 'izquierda') + ' están más lejos del eje, pero a la ' + (farR ? 'izquierda' : 'derecha') + ' hay más. Por eso, de media, los dos lados tiran lo mismo.';
    else note = 'Si un lado tirara siempre más que el otro, la rueda giraría sola para siempre. Fíjate en cómo se igualan.';
    $('balanceNote').textContent = note;
    $('balanceWho').textContent = 'rueda de ' + fmtCm(mainWheel().r) + ' de radio';
  }

  // ---------- inspector ----------
  function field(label, id, min, max, step, value, unit, help, digits) {
    return '<div class="field"><label for="' + id + '"><span>' + esc(label) + '</span><output id="' + id + '_o">' + fmt(value, digits == null ? 2 : digits) + (unit ? ' ' + unit : '') + '</output></label>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '">' + (help ? '<span class="help" id="' + id + '_h">' + esc(help) + '</span>' : '') + '</div>';
  }
  function numField(label, id, value, unit, step, wide) {
    return '<div class="field' + (wide ? ' wide' : '') + '"><span class="lab"><span id="' + id + '_l">' + esc(label) + '</span></span><div class="num">' +
      '<button type="button" data-num="' + id + '" data-dir="-1" aria-label="Restar">−</button>' +
      '<input id="' + id + '" type="number" inputmode="decimal" step="' + step + '" value="' + r1(value) + '" aria-labelledby="' + id + '_l">' +
      '<span class="unit">' + esc(unit) + '</span><button type="button" data-num="' + id + '" data-dir="1" aria-label="Sumar">+</button></div></div>';
  }
  function selectField(label, id, options, value, help) {
    return '<div class="field"><label for="' + id + '"><span>' + esc(label) + '</span></label><select id="' + id + '">' +
      options.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(value) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') +
      '</select>' + (help ? '<span class="help">' + esc(help) + '</span>' : '') + '</div>';
  }
  function segField(label, id, options, value, wide) {
    return '<div class="field' + (wide ? ' wide' : '') + '"><span class="lab"><span id="' + id + '_l">' + esc(label) + '</span></span><div class="seg" role="group" aria-labelledby="' + id + '_l">' +
      options.map(function (o) { return '<button type="button" data-seg="' + id + '" data-val="' + esc(o[0]) + '" aria-pressed="' + (String(o[0]) === String(value)) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
  }
  function toggleField(label, id, checked, help, disabled) {
    return '<div class="field wide"><label class="toggle" for="' + id + '"><span>' + esc(label) + (help ? '<span class="help" style="display:block">' + esc(help) + '</span>' : '') + '</span><input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '></label></div>';
  }
  var BEAR_OPTS = Object.keys(P.BEARINGS).map(function (k) { return [k, P.BEARINGS[k].name + ' · ' + P.BEARINGS[k].note]; });
  var MAT_OPTS = Object.keys(P.MATERIALS).map(function (k) { return [k, P.MATERIALS[k].name]; });
  var GRADE_OPTS = Object.keys(P.GRADES).map(function (k) { return [k, P.GRADES[k].name]; });
  var SHAPE_OPTS = Object.keys(P.MAG_SHAPES).map(function (k) { return [k, P.MAG_SHAPES[k]]; });
  var DENS = { plomo: 11340, acero: 7850, madera: 700, goma: 1100 };
  var NAMES = { wheel: 'Rueda', ball: 'Pesa', bar: 'Brazo', ramp: 'Rampa', pin: 'Bisagra', spring: 'Muelle', magnet: 'Imán' };
  function partName(p) { return p.kind === 'magnet' ? P.MAG_SHAPES[p.shape || 'bar'] : (p.kind === 'wheel' && p.style === 'ring' ? 'Rueda de compartimentos' : NAMES[p.kind]); }

  function renderInspector() {
    S.dirty = true;
    var el = $('inspector'), p = find(S.sel), design = S.mode === 'design';
    if (!p) {
      el.innerHTML = '<div class="empty"><h2>Pieza</h2><p>Toca una pieza en el banco para ver y cambiar sus medidas exactas.</p><ul>' +
        '<li>Con <b>Añadir</b> eliges qué pieza poner.</li><li>Con <b>Clonar</b> repites una pieza alrededor de una rueda o en fila, a la distancia exacta que quieras.</li>' +
        '<li>Con <b>Medir</b> compruebas distancias y ángulos.</li></ul></div>';
      return;
    }
    var h = '<div class="insp-head"><h3>' + esc(partName(p)) + '</h3>' + (design ? '<div class="insp-actions"><button class="btn" id="cloneBtn" type="button">Clonar</button><button class="btn danger" id="delBtn" type="button">Quitar</button></div>' : '') + '</div>';
    if (!design) h += '<p class="note">Pulsa «Diseñar» para cambiar esta pieza.</p>';
    h += '<div class="fields">';
    if (p.kind === 'wheel') {
      h += numField('Centro X', 'n_x', p.x * 100, 'cm', 1) + numField('Centro Y', 'n_y', p.y * 100, 'cm', 1);
      h += numField('Radio', 'n_r', p.r * 100, 'cm', 1);
      h += field('Masa de la rueda', 'f_m', 0.2, 20, 0.1, p.m, 'kg', null, 1);
      h += segField('Tipo', 'f_style', [['disc', 'Disco con radios'], ['ring', 'Con compartimentos']], p.style, true);
      if (p.style === 'ring') { h += field('Compartimentos', 'f_cells', 3, 16, 1, p.cells, '', null, 0); h += field('Inclinación de los separadores', 'f_tilt', 0, 70, 1, p.tilt, '°', null, 0); }
      else h += field('Radios (dibujo)', 'f_spokes', 3, 16, 1, p.spokes || 8, '', null, 0);
      h += segField('Eje', 'f_axle', [['fixed', 'Fijo a la pared'], ['free', 'Suelto']], p.axle, true);
      if (p.axle === 'fixed') {
        h += selectField('Calidad del eje', 'f_bearing', BEAR_OPTS, p.bearing);
        h += field('Giro inicial', 'f_rpm', -120, 120, 1, p.rpm, 'rpm', 'Positivo: sentido de las agujas del reloj. Cuenta como energía de partida.', 0);
        h += deviceFields(p);
      }
    } else if (p.kind === 'ball') {
      h += numField('Centro X', 'n_x', p.x * 100, 'cm', 1) + numField('Centro Y', 'n_y', p.y * 100, 'cm', 1);
      h += numField('Diámetro', 'n_d', p.r * 200, 'cm', 0.5);
      h += field('Masa', 'f_m', 0.02, 10, 0.01, p.m, 'kg', massHelp(p));
      h += selectField('Material', 'f_mat', MAT_OPTS, p.mat, 'Cambia cómo rebota y roza. El acero lo atraen los imanes.');
    } else if (p.kind === 'bar' || p.kind === 'ramp' || p.kind === 'spring') {
      h += numField('Inicio X', 'n_x', p.x1 * 100, 'cm', 1) + numField('Inicio Y', 'n_y', p.y1 * 100, 'cm', 1);
      h += numField('Longitud', 'n_len', Math.hypot(p.x2 - p.x1, p.y2 - p.y1) * 100, 'cm', 1);
      h += numField('Ángulo', 'n_ang', Math.atan2(p.y2 - p.y1, p.x2 - p.x1) / DEG, '°', 1);
      if (p.kind === 'bar') h += field('Masa', 'f_m', 0.05, 5, 0.01, p.m, 'kg');
      if (p.kind === 'ramp') h += selectField('Material', 'f_mat', MAT_OPTS.filter(function (o) { return o[0] !== 'plomo'; }), p.mat);
      if (p.kind === 'spring') {
        var L0 = Math.hypot(p.x2 - p.x1, p.y2 - p.y1);
        h += field('Rigidez', 'f_k', 5, 3000, 5, p.k, 'N/m', 'Fuerza por cada metro que se estira.', 0);
        h += field('Longitud sin estirar', 'f_rest', 0.02, 2, 0.01, p.rest == null ? L0 : p.rest, 'm');
        h += field('Amortiguación', 'f_damp', 0, 10, 0.1, p.damp, 'N·s/m', null, 1);
        var spr = S.info.springOf[p.id];
        if (spr && spr.limited) h += '<p class="note field wide">Para piezas tan ligeras, el banco solo puede simular este muelle con ' + fmt(spr.k, 0) + ' N/m y ' + fmt(spr.c, 1) + ' N·s/m. Más rígido vibraría más rápido de lo que el cálculo puede seguir.</p>';
      }
    } else if (p.kind === 'pin') {
      h += segField('Tipo', 'f_mode', [['free', 'Gira libre'], ['limits', 'Con topes'], ['rigid', 'Soldada']], p.mode, true);
      if (p.mode === 'limits') {
        h += numField('Tope en un sentido', 'n_lo', Math.min(0, p.lo), '°', 5);
        h += numField('Tope en el otro', 'n_hi', Math.max(0, p.hi), '°', 5);
      }
      if (p.mode !== 'rigid') { h += selectField('Calidad de la bisagra', 'f_bearing', BEAR_OPTS, p.bearing); h += deviceFields(p); }
      h += '<p class="note field wide">' + (p.a && find(p.a) ? 'Une ' + partName(find(p.a)).toLowerCase() + ' y ' + partName(find(p.b)).toLowerCase() + '.' : 'Clavada a la pared.') + (p.mode === 'limits' ? ' Los ángulos se miden desde la posición dibujada; la zona azul de la vista plana muestra hasta dónde puede girar.' : '') + '</p>';
    } else if (p.kind === 'magnet') {
      var model = P.magnetModel(p);
      h += selectField('Tipo de imán', 'f_shape', SHAPE_OPTS, p.shape || 'bar');
      h += numField('Centro X', 'n_x', p.x * 100, 'cm', 0.5) + numField('Centro Y', 'n_y', p.y * 100, 'cm', 0.5);
      h += numField('Dirección del polo norte', 'n_dir', ((p.ang % 360) + 360) % 360, '°', 5);
      if (p.shape === 'electro') {
        h += numField('Largo de la bobina', 'n_size', model.size * 100, 'cm', 0.5);
        h += field('Fuerza al encenderlo', 'f_mu', 0.5, 40, 0.5, p.mu, 'A·m²', 'Consume ' + fmt(P.electroPower(p.mu), 1) + ' W de la batería mientras está encendido.', 1);
        h += segField('Se enciende', 'f_emode', [['always', 'Siempre'], ['window', 'Según el giro de una rueda']], p.emode || 'always', true);
        if (p.emode === 'window') {
          var wheels = parts().filter(function (q) { return q.kind === 'wheel' && q.axle === 'fixed'; });
          h += selectField('Rueda que lo controla', 'f_ewheel', [['', 'Elige una rueda']].concat(wheels.map(function (q, i) { return [q.id, 'Rueda ' + (i + 1) + ' (radio ' + fmtCm(q.r) + ')']; })), p.ewheel || '');
          h += numField('Se enciende a los', 'n_efrom', p.efrom || 0, '°', 1) + numField('Se apaga a los', 'n_eto', p.eto || 0, '°', 1);
          h += numField('Repite cada', 'n_eevery', p.eevery || 360, '°', 5);
          h += '<p class="note field wide">Los grados son el giro de la rueda desde la posición dibujada, en el sentido de las agujas del reloj.</p>';
        }
      } else {
        h += selectField('Material', 'f_grade', GRADE_OPTS, p.grade || 'n52');
        h += numField(p.shape === 'disc' ? 'Diámetro' : 'Largo', 'n_size', model.size * 100, 'cm', 0.5);
        h += '<div class="field"><span class="lab"><span>Fuerza</span><output>' + fmt(model.mu, 1) + ' A·m²</output></span><span class="help">Calculada con el material y el tamaño.</span></div>';
      }
      h += '<p class="note field wide">' + (p.host && find(p.host) ? 'Va pegado a ' + partName(find(p.host)).toLowerCase() + '.' : 'Fijo a la pared.') + '</p>';
    }
    h += '</div>';
    el.innerHTML = h;
    if (!design) { el.querySelectorAll('input,select,button[data-seg],button[data-num]').forEach(function (c) { c.disabled = true; }); return; }
    $('delBtn').onclick = function () { var b = snapshot(); removePart(p.id); commit(b); };
    $('cloneBtn').onclick = function () { openClone(p.id); };
    bindInspector(el, p);
  }
  function deviceFields(p) {
    var h = field('Generador', 'f_gen', 0, 1, 0.01, p.gen || 0, 'N·m·s', 'Saca electricidad del giro. 0 = desconectado.');
    h += toggleField('Motor', 'f_motor', !!p.motor, 'Empuja el giro con electricidad.');
    if (p.motor) {
      h += field('Velocidad del motor', 'f_mrpm', -200, 200, 1, p.mrpm || 0, 'rpm', 'Positivo: sentido de las agujas del reloj.', 0);
      h += field('Fuerza máxima del motor', 'f_mtorque', 0.05, 5, 0.05, p.mtorque || 0.5, 'N·m');
      h += segField('Se alimenta de', 'f_msrc', [['battery', 'Una batería'], ['bus', 'Sus generadores']], p.msrc || 'battery', true);
    }
    return h;
  }
  function massHelp(p) {
    var V = 4 / 3 * Math.PI * p.r * p.r * p.r, m = V * (DENS[p.mat] || 7850);
    return 'Una bola maciza de ' + P.MATERIALS[p.mat].name.split(' ')[0].toLowerCase() + ' de este tamaño pesaría ' + fmt(m, m < 1 ? 2 : 1) + ' kg.';
  }
  function bindInspector(el, p) {
    function liveRange(id, key, unit, digits, after) {
      var c = $(id); if (!c) return;
      var start = function () { if (!S.preEdit) S.preEdit = snapshot(); };
      c.addEventListener('pointerdown', start); c.addEventListener('keydown', start); c.addEventListener('focus', start);
      c.addEventListener('input', function () {
        if (!S.preEdit) S.preEdit = snapshot();
        p[key] = parseFloat(c.value);
        $(id + '_o').textContent = fmt(p[key], digits) + (unit ? ' ' + unit : '');
        rebuild(); if (after) after();
      });
      c.addEventListener('change', function () { if (S.preEdit) { pushUndo(S.preEdit); S.preEdit = null; } save(); renderAbout(); });
    }
    liveRange('f_m', 'm', 'kg', p.kind === 'wheel' ? 1 : 2, function () { var hh = $('f_m_h'); if (hh && p.kind === 'ball') hh.textContent = massHelp(p); });
    liveRange('f_cells', 'cells', '', 0); liveRange('f_tilt', 'tilt', '°', 0); liveRange('f_spokes', 'spokes', '', 0);
    liveRange('f_rpm', 'rpm', 'rpm', 0); liveRange('f_gen', 'gen', 'N·m·s', 2);
    liveRange('f_mrpm', 'mrpm', 'rpm', 0); liveRange('f_mtorque', 'mtorque', 'N·m', 2);
    liveRange('f_k', 'k', 'N/m', 0); liveRange('f_rest', 'rest', 'm', 2); liveRange('f_damp', 'damp', 'N·s/m', 1);
    liveRange('f_mu', 'mu', 'A·m²', 1, function () { var hh = $('f_mu_h'); if (hh) hh.textContent = 'Consume ' + fmt(P.electroPower(p.mu), 1) + ' W de la batería mientras está encendido.'; });
    function sel(id, fn) { var c = $(id); if (c) c.addEventListener('change', function () { var b = snapshot(); fn(c.value); commit(b); }); }
    sel('f_bearing', function (v) { p.bearing = v; });
    sel('f_mat', function (v) { p.mat = v; });
    sel('f_grade', function (v) { p.grade = v; p.mu = P.magnetModel(p).mu; });
    sel('f_ewheel', function (v) { p.ewheel = v || null; });
    sel('f_shape', function (v) {
      var old = P.magnetModel(p).size; p.shape = v;
      if (v === 'electro') { p.grade = null; p.mu = p.mu && p.mu < 40 ? p.mu : 6; p.emode = p.emode || 'always'; p.size = Math.max(0.03, old); p.efrom = p.efrom || 0; p.eto = p.eto || 30; p.eevery = p.eevery || 360; }
      else { p.grade = p.grade || 'n52'; p.size = v === 'horseshoe' ? Math.max(old, 0.05) : (v === 'halbach' ? Math.max(old, 0.08) : old); p.mu = P.magnetModel(p).mu; }
    });
    function seg(id, fn) { el.querySelectorAll('[data-seg="' + id + '"]').forEach(function (b) { b.addEventListener('click', function () { var s0 = snapshot(); fn(b.getAttribute('data-val')); commit(s0); }); }); }
    seg('f_style', function (v) { p.style = v; });
    seg('f_axle', function (v) { p.axle = v; });
    seg('f_msrc', function (v) { p.msrc = v; });
    seg('f_emode', function (v) { p.emode = v; });
    seg('f_mode', function (v) { p.mode = v; if (v === 'limits' && !p.lo && !p.hi) { p.lo = -45; p.hi = 45; } });
    var mt = $('f_motor');
    if (mt) mt.addEventListener('change', function () { var b = snapshot(); p.motor = mt.checked; if (p.motor) { p.mrpm = p.mrpm || 30; p.mtorque = p.mtorque || 0.5; p.msrc = p.msrc || 'battery'; } commit(b); });
    var setters = {
      n_x: function (v) { moveBy(p, v / 100 - ('x1' in p ? p.x1 : p.x), 0); },
      n_y: function (v) { moveBy(p, 0, v / 100 - ('y1' in p ? p.y1 : p.y)); },
      n_r: function (v) { setWheelRadius(p, Math.max(0.05, Math.min(2, v / 100))); },
      n_d: function (v) { p.r = Math.max(0.005, Math.min(0.3, v / 200)); },
      n_len: function (v) { var a = Math.atan2(p.y2 - p.y1, p.x2 - p.x1), L = Math.max(0.01, v / 100); moveEnd(p, 1, p.x1 + L * Math.cos(a), p.y1 + L * Math.sin(a)); },
      n_ang: function (v) { var L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1); moveEnd(p, 1, p.x1 + L * Math.cos(v * DEG), p.y1 + L * Math.sin(v * DEG)); },
      n_lo: function (v) { p.lo = Math.max(-180, Math.min(0, v)); },
      n_hi: function (v) { p.hi = Math.max(0, Math.min(180, v)); },
      n_dir: function (v) { p.ang = ((v % 360) + 360) % 360; },
      n_size: function (v) { p.size = Math.max(0.005, Math.min(0.5, v / 100)); if (p.shape !== 'electro') p.mu = P.magnetModel(p).mu; },
      n_efrom: function (v) { p.efrom = v; }, n_eto: function (v) { p.eto = v; }, n_eevery: function (v) { p.eevery = Math.max(5, v); }
    };
    Object.keys(setters).forEach(function (id) {
      var inp = $(id);
      if (!inp) return;
      var apply = function (v) { if (!isFinite(v)) return; var b = snapshot(); setters[id](v); commit(b); };
      inp.addEventListener('change', function () { apply(parseFloat(String(inp.value).replace(',', '.'))); });
      el.querySelectorAll('[data-num="' + id + '"]').forEach(function (btn) {
        btn.addEventListener('click', function () { var st = parseFloat(inp.step) || 1; apply(r1(parseFloat(inp.value) + st * parseFloat(btn.getAttribute('data-dir')))); });
      });
    });
  }
  // cambiar el radio de una rueda: lo que cuelga del borde se desplaza con él
  function setWheelRadius(w, r) {
    var old = w.r;
    if (Math.abs(r - old) < 1e-9) return;
    var moved = new Set();
    parts().forEach(function (q) {
      if (q.kind === 'pin' && (q.a === w.id || q.b === w.id) && Math.abs(Math.hypot(q.x - w.x, q.y - w.y) - old) < 0.002) {
        var ang = Math.atan2(q.y - w.y, q.x - w.x), dx = Math.cos(ang) * (r - old), dy = Math.sin(ang) * (r - old);
        var other = q.a === w.id ? q.b : q.a, unit = other ? cloneUnit(other) : null;
        var list = unit ? unit.list : [q];
        list.forEach(function (u) {
          if (u.id === w.id || moved.has(u.id)) return;
          moved.add(u.id);
          if ('x1' in u) { u.x1 += dx; u.y1 += dy; u.x2 += dx; u.y2 += dy; } else { u.x += dx; u.y += dy; }
        });
      }
    });
    parts().forEach(function (q) { if (q.kind === 'magnet' && q.host === w.id && !moved.has(q.id)) { var k = r / old; q.x = w.x + (q.x - w.x) * k; q.y = w.y + (q.y - w.y) * k; } });
    w.r = r;
  }

  function renderConditions() {
    var el = $('conditions'), dz = S.design, design = S.mode === 'design';
    el.innerHTML = '<h2>Condiciones de la prueba</h2><div class="fields">' +
      segField('Gravedad', 'c_grav', [['tierra', 'Tierra'], ['luna', 'Luna'], ['marte', 'Marte']], dz.gravity, true) +
      toggleField('Mundo ideal', 'c_ideal', dz.ideal, 'Sin rozamiento en los ejes ni aire. No existe, pero sirve para ver que ni así se gana energía.', !design) +
      toggleField('Aire', 'c_air', dz.air && !dz.ideal, 'Frena lo que se mueve deprisa.', !design || dz.ideal) +
      toggleField('Ajustar a la cuadrícula', 'c_snap', S.snap, 'Coloca las piezas en centímetros exactos y engancha bordes y centros.') +
      toggleField('Ver lo que tira de cada lado', 'c_forces', S.forces, 'En la vista plana, dibuja la distancia de cada pesa al eje de la rueda.') +
      '</div>' + (design ? '' : '<p class="note">Para cambiar las condiciones, pulsa «Diseñar».</p>');
    el.querySelectorAll('[data-seg="c_grav"]').forEach(function (b) { b.disabled = !design; b.addEventListener('click', function () { var s0 = snapshot(); S.design.gravity = b.getAttribute('data-val'); commit(s0); }); });
    function chk(id, fn) { var c = $(id); if (c) c.addEventListener('change', function () { fn(c.checked); renderConditions(); }); }
    chk('c_ideal', function (v) { var b = snapshot(); S.design.ideal = v; commit(b); });
    chk('c_air', function (v) { var b = snapshot(); S.design.air = v; commit(b); });
    chk('c_snap', function (v) { S.snap = v; });
    chk('c_forces', function (v) { S.forces = v; });
  }

  function renderAbout() {
    var el = $('about'), st = S.design.example && STORIES[S.design.example];
    var howto = '<h4>Cómo se usa</h4><ol>' +
      '<li>Pulsa <b>Añadir</b>, elige una pieza y tócala o arrástrala en el banco. Las líneas finas de la cuadrícula están cada 10 cm.</li>' +
      '<li>Toca una pieza con <b>Mover</b> para ver sus medidas exactas en centímetros y grados, y cambiarlas con + y −.</li>' +
      '<li>Con <b>Clonar</b> repites una pieza: alrededor de una rueda (por ejemplo 8 brazos iguales) o en fila, a la distancia que digas.</li>' +
      '<li>Cambia entre <b>Plano</b> (para dibujar con precisión) y <b>3D</b> (para verla en perspectiva; arrastra el fondo para girarla).</li>' +
      '<li>Pulsa <b>Probar</b>. Durante la prueba puedes empujar piezas con el dedo. En <b>Cuentas</b> verás de dónde sale y a dónde va cada julio.</li></ol>' +
      '<p class="note">El banco calcula las máquinas en un plano, como una rueda o un péndulo de pared. La vista 3D les da grosor para que las veas como serían, pero las piezas no se mueven hacia delante ni hacia atrás.</p>';
    if (st) el.innerHTML = '<h3>' + esc(st.title) + '</h3><p class="era">' + esc(st.era) + '</p><p>' + esc(st.what) + '</p><h4>Qué demuestra</h4><p>' + esc(st.why) + '</p>' + howto;
    else el.innerHTML = '<h3>Tu máquina</h3><p>Dibuja tu idea a escala real: el banco usa centímetros, kilos y la gravedad de verdad. Lo que veas aquí es lo que harían esas piezas si las fabricaras.</p>' + howto;
  }

  // ---------- pestañas y hoja ----------
  function setTab(t, open) {
    S.tab = t;
    ['pieza', 'cuentas', 'prueba', 'ayuda'].forEach(function (k) {
      $('tab-' + k).setAttribute('aria-selected', String(k === t));
      $('pane-' + k).hidden = k !== t;
    });
    if (open === true) setSheet(true);
    S.panelsAt = 0;
  }
  function applySheet(open) {
    S.sheetOpen = open;
    $('side').setAttribute('data-open', String(open));
    $('stripBtn').textContent = open && mqMobile.matches ? 'Ocultar panel' : 'Cuentas';
    requestAnimationFrame(function () { resize(); markDirty(); });
  }
  function setSheet(open) {
    if (open) {
      if (!S.sheetOpen) { applySheet(true); if (mqMobile.matches) openOverlay('sheet', function () { applySheet(false); }); }
    } else if (S.sheetOpen) {
      if (OV.some(function (o) { return o.id === 'sheet'; })) requestClose('sheet'); else applySheet(false);
    }
  }
  // Pila de ventanas abiertas. En la app instalada, el botón «atrás» cierra la de encima.
  var OV = [];
  function openOverlay(id, onClose) {
    if (OV.some(function (o) { return o.id === id; })) return;
    OV.push({ id: id, onClose: onClose });
    if (STANDALONE) { try { history.pushState({ ov: id }, ''); } catch (e) { /* sin historial */ } }
  }
  function requestClose(id) {
    var i = -1;
    OV.forEach(function (o, k) { if (o.id === id) i = k; });
    if (i < 0) return;
    if (STANDALONE && i === OV.length - 1) { try { history.back(); return; } catch (e) { /* sigue */ } }
    var o = OV.splice(i, 1)[0];
    if (o.onClose) o.onClose();
  }
  window.addEventListener('popstate', function () {
    var o = OV.pop();
    if (o && o.onClose) o.onClose();
  });
  function showModal(id, onClose) {
    $(id).hidden = false;
    openOverlay(id, function () { $(id).hidden = true; if (onClose) onClose(); markDirty(); });
  }
  function closeModal(id) { if (!$(id).hidden) requestClose(id); }
  function openPiece() { setTab('pieza', mqMobile.matches ? true : undefined); }

  // ---------- herramientas ----------
  function renderTools() {
    $('tools').innerHTML = DOCK.map(function (t) {
      return '<button type="button" class="tool" data-tool="' + t.id + '" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[t.id] + '</svg><span class="lbl">' + t.label + '</span></button>';
    }).join('');
    $('tools').querySelectorAll('.tool').forEach(function (b) { b.addEventListener('click', function () { onTool(b.dataset.tool); }); });
  }
  function onTool(id) {
    if (id === 'undo') { doUndo(); return; }
    if (S.mode !== 'design' && id !== 'move') { toast('Pulsa «Diseñar» para cambiar la máquina.'); return; }
    if (id === 'add') { openPalette(); return; }
    if (id === 'clone') {
      if (S.sel && find(S.sel)) { openClone(S.sel); return; }
      S.tool = 'move'; S.pendingClone = true; updateTools(); updateHint(); toast('Toca la pieza que quieres clonar.'); return;
    }
    S.pendingClone = false;
    S.tool = id; S.addKind = null;
    if (id !== 'measure') S.measure = null;
    updateTools(); updateHint();
  }
  function updateTools() {
    $('tools').querySelectorAll('.tool').forEach(function (b) {
      var id = b.dataset.tool, on;
      if (id === 'clone') on = S.pendingClone;
      else if (id === 'move') on = S.tool === 'move' && !S.pendingClone;
      else on = S.tool === id;
      b.setAttribute('aria-pressed', String(!!on));
      b.setAttribute('aria-disabled', String(S.mode !== 'design' && id !== 'move'));
      if (id === 'add') {
        var it = S.tool === 'add' && S.addKind ? PAL_BY_ID[S.addKind] : null;
        b.querySelector('svg').innerHTML = it ? IC[S.addKind] : IC.add;
        b.querySelector('.lbl').textContent = it ? it.name.split(' ')[0] : 'Añadir';
      }
    });
  }
  function updateHint() {
    if (S.mode !== 'design') return;
    var t = S.pendingClone ? 'clone' : (S.tool === 'add' ? S.addKind : (S.tool === 'move' && !is3d() ? 'move2d' : S.tool));
    $('hint').textContent = HINTS[t] || '';
  }

  var toastTimer;
  function toast(msg, action, fn) {
    var el = $('toast');
    el.textContent = msg; el.hidden = false; el.style.opacity = '1';
    el.classList.toggle('has-action', !!action);
    if (action) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = action;
      b.addEventListener('click', function () { el.hidden = true; fn(); });
      el.appendChild(b);
    }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.opacity = '0'; setTimeout(function () { el.hidden = true; }, 220); }, action ? 4500 : 2600);
  }
  function doUndo() {
    if (S.mode !== 'design') backToDesign();
    if (!S.undo.length) { toast('No hay nada que deshacer.'); return; }
    S.redo.push(snapshot());
    var d = sanitize(JSON.parse(S.undo.pop()));
    if (d) { setDesign(d, true); toast('Deshecho.', 'Rehacer', doRedo); }
  }
  function doRedo() {
    if (!S.redo.length) { toast('No hay nada que rehacer.'); return; }
    S.undo.push(snapshot());
    var d = sanitize(JSON.parse(S.redo.pop()));
    if (d) { setDesign(d, true); toast('Rehecho.', 'Deshacer', doUndo); }
  }

  // ---------- paleta ----------
  function openPalette() {
    $('palBody').innerHTML = PALETTE.map(function (g) {
      return '<div class="pal-group"><h4>' + esc(g.group) + '</h4><div class="pal">' + g.items.map(function (it) {
        return '<button type="button" data-kind="' + it.id + '" aria-pressed="' + (S.tool === 'add' && S.addKind === it.id) + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[it.id] + '</svg><b>' + esc(it.name) + '</b><span>' + esc(it.desc) + '</span></button>';
      }).join('') + '</div></div>';
    }).join('');
    $('palBody').querySelectorAll('[data-kind]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.tool = 'add'; S.addKind = b.dataset.kind; S.pendingClone = false; S.measure = null;
        closeModal('palette'); updateTools(); updateHint();
      });
    });
    showModal('palette');
  }

  // ---------- ventana de clonar ----------
  function openClone(id) {
    var unit = cloneUnit(id);
    if (!unit) return;
    S.pendingClone = false; updateTools(); updateHint();
    var wheels = parts().filter(function (q) { return q.kind === 'wheel' && !unit.ids.has(q.id); });
    var host = unit.host || wheels[0] || null;
    var circleOk = unit.sel.kind !== 'wheel';
    var sx = unit.sel.x != null ? unit.sel.x : unit.sel.x1, sy = unit.sel.y != null ? unit.sel.y : unit.sel.y1;
    S.clone = { unit: unit, mode: circleOk && host ? 'circle' : 'line', center: host ? host.id : '', cx: host ? host.x : sx, cy: host ? host.y : sy - 0.3,
      n: unit.sel.kind === 'magnet' ? 8 : 6, span: 360, dx: 0.1, dy: 0 };
    renderClone();
    showModal('cloneModal', function () { S.clone = null; S.clonePreview = null; });
  }
  function closeClone() { S.clone = null; S.clonePreview = null; closeModal('cloneModal'); markDirty(); }
  function renderClone() {
    var c = S.clone, u = c.unit;
    var plural = { 'imán': 'imanes', rueda: 'ruedas', pesa: 'pesas', brazo: 'brazos', rampa: 'rampas', bisagra: 'bisagras', muelle: 'muelles' };
    var ps = Object.keys(u.summary).map(function (k) { var n = u.summary[k]; return n + ' ' + (n === 1 ? k : plural[k]); });
    var wheels = parts().filter(function (q) { return q.kind === 'wheel' && !u.ids.has(q.id); });
    var h = '<p class="note">Se copiará: ' + esc(joinEs(ps)) + '.</p><div class="fields">';
    h += segField('Cómo', 'k_mode', (u.sel.kind === 'wheel' ? [] : [['circle', 'En círculo']]).concat([['line', 'En fila']]), c.mode, true);
    if (c.mode === 'circle') {
      h += selectField('Alrededor de', 'k_center', wheels.map(function (q, i) { return [q.id, 'El eje de la rueda ' + (i + 1) + ' (radio ' + fmtCm(q.r) + ')']; }).concat([['', 'Otro punto']]), c.center);
      if (!c.center) h += numField('Centro X', 'k_cx', c.cx * 100, 'cm', 1) + numField('Centro Y', 'k_cy', c.cy * 100, 'cm', 1);
      h += numField('Piezas en total en el círculo', 'k_n', c.n, 'uds.', 1);
      h += numField('Repartidas en', 'k_span', c.span, '°', 15);
      var step = c.span >= 359.9 ? 360 / c.n : c.span / Math.max(1, c.n - 1);
      h += '<p class="note field wide">Una cada ' + fmt(step, 1) + '°. La original cuenta como la primera.</p>';
    } else {
      h += numField('Copias nuevas', 'k_n', c.n, 'uds.', 1, true);
      h += numField('Separación X', 'k_dx', c.dx * 100, 'cm', 1) + numField('Separación Y', 'k_dy', c.dy * 100, 'cm', 1);
    }
    h += '</div><div class="row"><button class="btn primary" id="k_go" type="button">Crear copias</button></div>';
    var body = $('cloneBody');
    body.innerHTML = h;
    body.querySelectorAll('[data-seg="k_mode"]').forEach(function (b) { b.addEventListener('click', function () { c.mode = b.getAttribute('data-val'); if (c.mode === 'line') c.n = Math.min(c.n, 4); renderClone(); }); });
    var cs = $('k_center');
    if (cs) cs.addEventListener('change', function () { c.center = cs.value; var w = find(c.center); if (w) { c.cx = w.x; c.cy = w.y; } renderClone(); });
    var nums = { k_cx: function (v) { c.cx = v / 100; }, k_cy: function (v) { c.cy = v / 100; }, k_n: function (v) { c.n = Math.max(c.mode === 'circle' ? 2 : 1, Math.min(36, Math.round(v))); }, k_span: function (v) { c.span = Math.max(5, Math.min(360, v)); }, k_dx: function (v) { c.dx = v / 100; }, k_dy: function (v) { c.dy = v / 100; } };
    Object.keys(nums).forEach(function (id) {
      var inp = $(id); if (!inp) return;
      var apply = function (v) { if (isFinite(v)) { nums[id](v); renderClone(); } };
      inp.addEventListener('change', function () { apply(parseFloat(String(inp.value).replace(',', '.'))); });
      body.querySelectorAll('[data-num="' + id + '"]').forEach(function (btn) { btn.addEventListener('click', function () { apply(parseFloat(inp.value) + (parseFloat(inp.step) || 1) * parseFloat(btn.getAttribute('data-dir'))); }); });
    });
    var w0 = find(c.center); if (c.mode === 'circle' && w0) { c.cx = w0.x; c.cy = w0.y; }
    S.clonePreview = cloneCopies(u, cloneTransforms(c), false);
    $('k_go').addEventListener('click', function () {
      var before = snapshot(), tr = cloneTransforms(c), copies = cloneCopies(u, tr, true);
      S.design.parts = S.design.parts.concat(copies);
      closeClone(); commit(before); buzz(15);
      if (c.mode === 'circle' && cloneTransforms(c).length + 1 >= 8 && u.list.some(function (q) { return q.kind === 'ball'; }) && u.host) completeGoal('fabrica');
      toast((tr.length === 1 ? 'Creada 1 copia' : 'Creadas ' + tr.length + ' copias') + '. «Deshacer» las quita.');
    });
  }

  // ---------- ajustes ----------
  function applySettings() {
    var st = S.settings, root = document.documentElement;
    if (STANDALONE) {
      if (st.theme === 'light' || st.theme === 'dark') root.setAttribute('data-theme', st.theme);
      else root.removeAttribute('data-theme');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) { readColors(); meta.setAttribute('content', C['paper-deep']); }
    }
    if (GL && GL.setQuality) GL.setQuality(st.quality);
    S.glDirty = true;
    resize();
  }
  function saveSettings() { store(KEYS.settings, S.settings); applySettings(); }

  // ---------- ejemplos y retos ----------
  var GOALS = [
    { id: 'giro', title: 'Que no se pare', desc: 'Haz una prueba en la que tu máquina siga moviéndose a los 20 segundos, sin batería ni empujones.' },
    { id: 'equilibrio', title: 'Equilibrio perfecto', desc: 'Construye una rueda con 6 pesas o más que no se mueva nada al probarla.' },
    { id: 'fabrica', title: 'Fábrica de brazos', desc: 'Usa «Clonar» para repetir un brazo con pesa 8 veces alrededor de una rueda.' },
    { id: 'bombilla', title: 'Enciende la bombilla', desc: 'Consigue que un generador produzca 10 julios en una sola prueba.' },
    { id: 'ideal', title: 'Mundo sin rozamiento', desc: 'Con «Mundo ideal» activado, mantén algo moviéndose durante un minuto.' },
    { id: 'iman', title: 'Atrapada', desc: 'Haz que un imán atrape una bola de acero y la deje pegada.' },
    { id: 'perpetuo', title: 'El movimiento perpetuo', desc: 'Consigue que tu máquina saque más energía de la que tenía. El banco lo vigila en cada prueba.', impossible: true }
  ];
  var EX_ICONS = { mazos: 'arm', bolas: 'ring', wilkins: 'ramp', motor: 'mag-bar', pendulo: 'bar', bucle: 'motor', electro: 'mag-electro' };
  function goalsDone() { return load(KEYS.goals, {}); }
  function completeGoal(id) {
    var g = goalsDone();
    if (g[id]) return;
    g[id] = Date.now(); store(KEYS.goals, g);
    var def = GOALS.filter(function (x) { return x.id === id; })[0];
    if (def) { buzz(40); toast('Reto conseguido: ' + def.title, 'Ver retos', function () { openExamples('retos'); }); }
  }
  function steelCaught(w) {
    for (var i = 0; i < w.steel.length; i++) {
      var s = w.steel[i], b = s.body;
      if (Math.hypot(b.vx, b.vy) > 0.03) continue;
      var B = w.fieldAt(s.wx, s.wy, -1, s.soft2, b), U = -s.alpha * (B.x * B.x + B.y * B.y);
      if (U < -0.02) return true;
    }
    return false;
  }
  function checkGoals(final) {
    if (!S.info) return;
    var w = S.info.world, b = w.balance(), moving = b.e.K > 1e-3;
    if (w.t >= 20 && moving && b.battery < 1e-3 && b.hand < 1e-3) completeGoal('giro');
    if (S.design.ideal && w.t >= 60 && moving) completeGoal('ideal');
    if (b.gen >= 10) completeGoal('bombilla');
    if (w.steel.length && w.magnets.length && steelCaught(w)) completeGoal('iman');
    if (final && S.endReason === 'stopped' && S.maxK < 2e-4 && b.hand < 1e-3) {
      var wheels = parts().filter(function (p) { return p.kind === 'wheel'; });
      var balls = parts().filter(function (p) { return p.kind === 'ball'; }).length;
      if (wheels.length && balls >= 6) completeGoal('equilibrio');
    }
  }
  function openExamples(tab) {
    var which = tab || 'ejemplos';
    function render() {
      $('exTabEx').setAttribute('aria-selected', String(which === 'ejemplos'));
      $('exTabRe').setAttribute('aria-selected', String(which === 'retos'));
      var h = '';
      if (which === 'ejemplos') {
        h = '<p class="note">Máquinas que se han propuesto durante siglos. Ábrelas, pruébalas y lee en las cuentas por qué se paran.</p><div class="cards">' +
          Object.keys(P.EXAMPLES).map(function (k) {
            var st = STORIES[k];
            return '<button class="cardbtn" type="button" data-ex="' + k + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[EX_ICONS[k] || 'wheel'] + '</svg><b>' + esc(st.title) + '</b><span class="era">' + esc(st.era) + '</span><span>' + esc(st.what.split('. ')[0]) + '.</span></button>';
          }).join('') + '</div>';
      } else {
        var done = goalsDone(), n = GOALS.filter(function (g) { return !g.impossible && done[g.id]; }).length;
        h = '<p class="progress">Llevas ' + n + ' de ' + (GOALS.length - 1) + ' retos.</p><div class="cards">' + GOALS.map(function (g) {
          var ok = !!done[g.id];
          return '<div class="cardbtn' + (ok ? ' done' : '') + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ok ? '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="var(--good)" stroke-width="2"/>' : (g.impossible ? '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 12c1.5-2.5 2.5-2.5 4 0s2.5 2.5 4 0" fill="none" stroke="currentColor" stroke-width="1.6"/>' : '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>')) +
            '</svg><b>' + esc(g.title) + '</b><span>' + esc(g.desc) + '</span><span class="badge">' + (ok ? 'Conseguido' : (g.impossible ? 'Nadie lo ha conseguido' : 'Pendiente')) + '</span></div>';
        }).join('') + '</div><p class="note">El último reto es el movimiento perpetuo. Si alguna vez el banco viera energía salida de la nada, sería un error de cálculo, y te lo diría en las cuentas.</p>';
      }
      $('exBody').innerHTML = h;
      $('exBody').querySelectorAll('[data-ex]').forEach(function (bt) {
        bt.addEventListener('click', function () {
          var k = bt.getAttribute('data-ex');
          closeModal('examplesModal');
          pushUndo(); S.libId = null; S.libName = '';
          setDesign(P.EXAMPLES[k].make()); setTab('ayuda');
          toast('Ejemplo cargado: ' + STORIES[k].title + '.', 'Deshacer', doUndo);
        });
      });
    }
    $('exTabEx').onclick = function () { which = 'ejemplos'; render(); };
    $('exTabRe').onclick = function () { which = 'retos'; render(); };
    render();
    if ($('examplesModal').hidden) showModal('examplesModal');
  }

  // ---------- mis diseños ----------
  function library() { var l = load(KEYS.lib, []); return Array.isArray(l) ? l : []; }
  function saveLibrary(l) { if (!store(KEYS.lib, l)) toast('No se ha podido guardar: el almacenamiento está lleno o bloqueado.'); }
  function suggestName() {
    if (S.libName) return S.libName;
    if (S.design.example && STORIES[S.design.example]) return STORIES[S.design.example].title + ' (mi versión)';
    return 'Mi máquina ' + (library().length + 1);
  }
  function saveToLibrary(asNew) {
    var name = ($('libName') && $('libName').value.trim()) || suggestName();
    var l = library(), now = Date.now(), entry;
    if (S.libId && !asNew) entry = l.filter(function (e) { return e.id === S.libId; })[0];
    if (!entry) { entry = { id: 'd' + now.toString(36), created: now }; l.unshift(entry); }
    entry.name = name.slice(0, 60); entry.updated = now; entry.design = JSON.parse(snapshot());
    saveLibrary(l);
    S.libId = entry.id; S.libName = entry.name; save();
    buzz(10); toast('Guardado en «Mis diseños».');
    renderLibrary();
  }
  function renderLibrary() {
    var l = library().sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
    var df = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    var h = '<p class="note">Tus máquinas se guardan en este dispositivo. Para pasarlas a otro, expórtalas a un archivo.</p>' +
      '<label class="sr" for="libName">Nombre del diseño</label><div class="saverow"><input id="libName" maxlength="60" value="' + esc(suggestName()) + '" placeholder="Nombre de tu máquina">' +
      '<button class="btn primary" id="libSave" type="button">' + (S.libId ? 'Guardar cambios' : 'Guardar') + '</button></div>' +
      (S.libId ? '<div class="row" style="margin:6px 0 0"><button class="btn" id="libSaveNew" type="button">Guardar como diseño nuevo</button></div>' : '');
    h += '<div class="lib">' + (l.length ? l.map(function (e) {
      var n = (e.design && e.design.parts ? e.design.parts.length : 0);
      return '<div class="libitem' + (e.id === S.libId ? ' current' : '') + '"><div class="meta"><b>' + esc(e.name || 'Sin nombre') + '</b><span>' + n + ' piezas · ' + esc(df.format(new Date(e.updated || e.created || Date.now()))) + (e.id === S.libId ? ' · abierto' : '') + '</span></div>' +
        '<div class="acts"><button class="btn" type="button" data-open="' + e.id + '">Abrir</button><button class="btn danger" type="button" data-del="' + e.id + '" aria-label="Borrar ' + esc(e.name || '') + '">Borrar</button></div></div>';
    }).join('') : '<p class="note">Todavía no has guardado ningún diseño.</p>') + '</div>';
    h += '<div class="row" style="margin-top:12px"><button class="btn" id="libExport" type="button">Exportar a un archivo</button><button class="btn" id="libImport" type="button">Abrir un archivo</button></div>';
    $('libBody').innerHTML = h;
    $('libSave').onclick = function () { saveToLibrary(false); };
    if ($('libSaveNew')) $('libSaveNew').onclick = function () { saveToLibrary(true); };
    $('libExport').onclick = exportFile;
    $('libImport').onclick = function () { $('importFile').click(); };
    $('libBody').querySelectorAll('[data-open]').forEach(function (bt) {
      bt.onclick = function () {
        var e = library().filter(function (x) { return x.id === bt.getAttribute('data-open'); })[0];
        var d = e && sanitize(e.design);
        if (!d) { toast('Ese diseño está dañado y no se puede abrir.'); return; }
        pushUndo(); S.libId = e.id; S.libName = e.name; setDesign(d); closeModal('libraryModal');
        toast('Abierto: ' + e.name + '.');
      };
    });
    $('libBody').querySelectorAll('[data-del]').forEach(function (bt) {
      bt.onclick = function () {
        if (bt.getAttribute('data-sure') !== '1') { bt.setAttribute('data-sure', '1'); bt.textContent = '¿Seguro?'; return; }
        var id = bt.getAttribute('data-del');
        saveLibrary(library().filter(function (x) { return x.id !== id; }));
        if (S.libId === id) { S.libId = null; S.libName = ''; save(); }
        buzz(12); renderLibrary();
      };
    });
  }
  function openLibrary() { renderLibrary(); if ($('libraryModal').hidden) showModal('libraryModal'); }

  // ---------- archivos e imagen ----------
  function fileName(ext) {
    var base = (S.libName || (S.design.example && STORIES[S.design.example] ? STORIES[S.design.example].title : 'mi-maquina'));
    base = base.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mi-maquina';
    return base + ext;
  }
  function download(blob, name) {
    // dentro de una vista previa incrustada el navegador bloquea las descargas: mejor decirlo que fingir
    if (!STANDALONE) { toast('Aquí no se pueden descargar archivos. En la app instalada, sí.'); return; }
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      toast('Guardado en tus descargas: ' + name);
    } catch (e) { toast('Este navegador no deja guardar archivos desde aquí.'); }
  }
  function exportFile() {
    var data = JSON.stringify({ app: 'taller-perpetuum', version: 1, name: S.libName || suggestName(), design: JSON.parse(snapshot()) }, null, 1);
    var blob = new Blob([data], { type: 'application/json' });
    var file;
    try { file = new File([blob], fileName('.perpetuum.json'), { type: 'application/json' }); } catch (e) { file = null; }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'Taller Perpetuum' }).catch(function () { download(blob, fileName('.perpetuum.json')); });
    } else download(blob, fileName('.perpetuum.json'));
  }
  function importText(txt) {
    var d = null, name = '';
    try { var o = JSON.parse(txt); if (o && o.design) { name = o.name || ''; o = o.design; } d = sanitize(o); } catch (e) { d = null; }
    if (!d) { toast('Ese archivo no es un diseño del taller.'); return; }
    pushUndo(); S.libId = null; S.libName = name; setDesign(d);
    closeModal('libraryModal'); closeModal('menuModal');
    toast('Diseño abierto' + (name ? ': ' + name : '') + '.', 'Deshacer', doUndo);
  }
  function machineTitle() {
    if (S.libName) return S.libName;
    if (S.design.example && STORIES[S.design.example]) return STORIES[S.design.example].title;
    return 'Mi máquina';
  }
  function shareImage() {
    var src;
    if (is3d()) { GL.update(S.info, { sel: null, measure: null }); src = GL.snapshot(); }
    else { var keep = S.sel; S.sel = null; draw(); S.sel = keep; src = $('cv'); markDirty(); }
    var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
    var g = c.getContext('2d');
    g.fillStyle = C['paper-deep']; g.fillRect(0, 0, W, H);
    var bx = 40, by = 40, bw = W - 80, bh = 1000;
    g.save(); g.beginPath(); if (g.roundRect) g.roundRect(bx, by, bw, bh, 28); else g.rect(bx, by, bw, bh); g.clip();
    g.fillStyle = C.paper; g.fillRect(bx, by, bw, bh);
    var sw = src.width, sh = src.height, k = Math.max(bw / sw, bh / sh), dw = sw * k, dh = sh * k;
    g.drawImage(src, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh);
    g.restore();
    var v = verdictData();
    g.fillStyle = C.ink; g.font = '700 64px ' + F.display; g.textBaseline = 'top';
    g.fillText(machineTitle().slice(0, 30), 56, 1080);
    g.fillStyle = C['ink-2']; g.font = '500 38px ' + F.body;
    g.fillText((S.mode === 'design' ? 'Diseñada en el Taller Perpetuum' : v.title).slice(0, 48), 56, 1160);
    g.fillStyle = C['ink-3']; g.font = '600 30px ' + F.display;
    g.fillText('TALLER PERPETUUM · construye tu máquina y ponla a prueba', 56, 1260);
    c.toBlob(function (blob) {
      if (!blob) { toast('No se ha podido crear la imagen.'); return; }
      var name = fileName('.png'), file = null;
      try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: machineTitle(), text: 'Mira mi máquina en el Taller Perpetuum.' }).catch(function () { /* cancelado */ });
      } else download(blob, name);
    }, 'image/png');
  }
  function shareText() {
    var txt = snapshot();
    if (navigator.share && STANDALONE) {
      navigator.share({ title: machineTitle(), text: txt }).catch(function () { /* cancelado */ });
    } else { $('shareOut').value = txt; $('shareIn').value = ''; showModal('shareModal'); }
  }

  // ---------- menú ----------
  function openMenu() {
    var st = S.settings, m = IC;
    var item = function (id, icon, label, sub) { return '<button type="button" id="' + id + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg><span>' + esc(label) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></button>'; };
    var h = '<div class="menu">' +
      item('mNew', m.add, 'Diseño nuevo', 'Empieza con el banco vacío') +
      item('mImg', '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 18l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" stroke-width="1.4"/>', 'Compartir una imagen', 'Una foto de tu máquina con su resultado') +
      item('mText', IC.clone, 'Compartir el diseño', 'Como texto, para que otra persona lo abra') +
      item('mExport', '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="1.6"/>', 'Exportar a un archivo', 'Copia de seguridad o para otro móvil') +
      item('mImport', '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="1.6"/>', 'Abrir un archivo', 'Un diseño exportado antes') +
      '<h4>Ajustes</h4><div class="fields">' +
      (STANDALONE ? segField('Tema', 'set_theme', [['system', 'Del sistema'], ['light', 'Claro'], ['dark', 'Oscuro']], st.theme, true) : '') +
      segField('Calidad del 3D', 'set_quality', [['auto', 'Automática'], ['high', 'Alta'], ['low', 'Ahorro de batería']], st.quality, true) +
      toggleField('Vibración', 'set_haptics', st.haptics, 'Una vibración corta al poner y quitar piezas.') +
      '</div>' +
      item('mIntro', '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', 'Ver la introducción', '') +
      '</div><p class="about-app">Taller Perpetuum ' + APP_VERSION + '. Física calculada en tu móvil, sin conexión y sin recoger ningún dato.' +
      (STANDALONE ? ' <a href="privacidad.html" target="_blank" rel="noopener">Política de privacidad</a>.' : '') +
      ' Usa three.js (licencia MIT) y las fuentes Barlow e IBM Plex Mono (licencia OFL).</p>';
    $('menuBody').innerHTML = h;
    $('mNew').onclick = function () { closeModal('menuModal'); newDesign(); };
    $('mImg').onclick = function () { closeModal('menuModal'); setTimeout(shareImage, 80); };
    $('mText').onclick = function () { closeModal('menuModal'); setTimeout(shareText, 80); };
    $('mExport').onclick = function () { exportFile(); };
    $('mImport').onclick = function () { $('importFile').click(); };
    $('mIntro').onclick = function () { closeModal('menuModal'); setTimeout(openWelcome, 80); };
    $('menuBody').querySelectorAll('[data-seg]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-seg') === 'set_theme' ? 'theme' : 'quality';
        S.settings[k] = b.getAttribute('data-val'); saveSettings(); openMenu();
      });
    });
    $('set_haptics').addEventListener('change', function () { S.settings.haptics = $('set_haptics').checked; saveSettings(); buzz(10); });
    if ($('menuModal').hidden) showModal('menuModal');
  }
  function newDesign() {
    pushUndo(); S.libId = null; S.libName = ''; setDesign(P.emptyDesign(), true);
    S.tool = 'add'; S.addKind = 'wheel'; updateTools(); updateHint();
    toast('Banco vacío. Toca para poner una rueda.', 'Deshacer', doUndo);
  }
  function openWelcome() { showModal('welcomeModal', function () { store(KEYS.welcome, Date.now()); }); }

  // ---------- entrada ----------
  function evPos(e) { var r = $('stage').getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function onDown(e) {
    S.touch = e.pointerType === 'touch';
    S.dirty = true;
    if (e.target.setPointerCapture) { try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* nada */ } }
    var pos = evPos(e);
    S.pointers.set(e.pointerId, pos);
    if (S.pointers.size === 2) {
      var pts = Array.from(S.pointers.values());
      if (S.drag && S.drag.kind === 'move' && S.drag.moved) { S.design = JSON.parse(S.drag.before); rebuild(); }
      if (S.info.world.hand) S.info.world.hand = null;
      S.drag = null;
      S.pinch = { d: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), s: S.cam.s, dist: GL && GL.ok() ? GL.cam.dist : 1, mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }, wmid: S2W((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2) };
      return;
    }
    if (S.pointers.size > 2) return;
    var nav = (e.button === 2 || e.shiftKey) ? 'pan' : (is3d() ? 'orbit' : 'pan');
    if (S.mode !== 'design') {
      var hit = pickAt(pos), world = S.info.world, body = null;
      if (hit && hit.p) {
        var b = hit.p.kind === 'magnet' ? bodyOf(hit.p.host) : (hit.p.kind === 'pin' ? bodyOf(hit.p.b) : (hit.p.kind === 'spring' ? null : bodyOf(hit.p.id)));
        if (b && !b.isStatic) body = b;
      }
      if (!body && hit) {
        for (var i = world.bodies.length - 1; i >= 0; i--) { var bb = world.bodies[i]; if (!bb.isStatic && bb.containsPoint(hit.x, hit.y, tolW())) { body = bb; break; } }
      }
      if (body) {
        var l = body.toLocal(hit.x, hit.y);
        if (S.mode === 'stopped') { S.endReason = null; setMode('run'); }
        world.hand = { body: body, lx: l.x, ly: l.y, tx: hit.x, ty: hit.y }; world.stillTime = 0;
        S.drag = { kind: 'hand' };
      } else S.drag = { kind: nav, last: pos, start: pos };
      return;
    }
    var tool = S.tool;
    if (tool === 'move') {
      var h = pickAt(pos);
      if (h && h.p) {
        if (S.pendingClone) { S.sel = h.p.id; renderInspector(); openClone(h.p.id); return; }
        S.sel = h.p.id; renderInspector(); setTimeout(openPiece, 60);
        var ends = null;
        if ('x1' in h.p) {
          var d1 = Math.hypot(h.x - h.p.x1, h.y - h.p.y1), d2 = Math.hypot(h.x - h.p.x2, h.y - h.p.y2), tl = tolW() * 1.2;
          if (d1 < tl || d2 < tl) ends = d1 < d2 ? 0 : 1;
        }
        S.drag = { kind: 'move', start: { x: h.x, y: h.y }, startPx: pos, part: h.p, end: ends, before: snapshot(), moved: false };
      } else S.drag = { kind: nav, last: pos, start: pos, deselect: true };
    } else if (tool === 'erase') {
      var he = pickAt(pos);
      if (he && he.p) { var bf = snapshot(); removePart(he.p.id); commit(bf); }
      else toast('Toca justo encima de una pieza para quitarla.');
    } else if (tool === 'measure') {
      var wm = worldAt(pos);
      S.measure = { a: snapPoint(wm.x, wm.y, true), b: null }; S.drag = { kind: 'measure', startPx: pos };
    } else if (tool === 'pin') {
      var hp = pickAt(pos);
      if (hp) S.drag = { kind: 'place', kind2: 'pin', a: snapPoint(hp.x, hp.y, true), startPx: pos };
    } else if (tool === 'add' && S.addKind) {
      var k = S.addKind, hw = pickAt(pos), pt = hw ? { x: hw.x, y: hw.y } : worldAt(pos);
      if (k === 'ball' || k === 'motor' || k === 'gen' || k.indexOf('mag-') === 0) S.drag = { kind: 'place', kind2: k, a: (k === 'motor' || k === 'gen') ? pt : snapPoint(pt.x, pt.y, k !== 'ball'), startPx: pos };
      else S.drag = { kind: 'draw', kind2: k, a: snapPoint(pt.x, pt.y, k === 'bar' || k === 'spring' || k === 'arm'), b: null, preview: true, startPx: pos };
    } else {
      S.drag = { kind: nav, last: pos, start: pos, deselect: true };
    }
  }
  function onMove(e) {
    if (!S.pointers.has(e.pointerId)) return;
    S.dirty = true;
    var pos = evPos(e);
    S.pointers.set(e.pointerId, pos);
    if (S.pinch && S.pointers.size >= 2) {
      var pts = Array.from(S.pointers.values());
      var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), f = d / (S.pinch.d || 1);
      var mx = (pts[0].x + pts[1].x) / 2, my = (pts[0].y + pts[1].y) / 2;
      if (is3d()) {
        GL.cam.dist = Math.max(0.3, Math.min(25, S.pinch.dist / f));
        GL.pan(mx - S.pinch.mid.x, my - S.pinch.mid.y); S.pinch.mid = { x: mx, y: my };
      } else {
        S.cam.s = Math.max(30, Math.min(2500, S.pinch.s * f));
        S.cam.x = S.pinch.wmid.x - (mx - S.vw / 2) / S.cam.s;
        S.cam.y = S.pinch.wmid.y + (my - S.vh / 2) / S.cam.s;
      }
      return;
    }
    var dr = S.drag;
    if (!dr) return;
    if (dr.kind === 'pan') {
      if (is3d()) GL.pan(pos.x - dr.last.x, pos.y - dr.last.y);
      else { S.cam.x -= (pos.x - dr.last.x) / S.cam.s; S.cam.y += (pos.y - dr.last.y) / S.cam.s; }
      dr.last = pos; return;
    }
    if (dr.kind === 'orbit') { GL.orbit(pos.x - dr.last.x, pos.y - dr.last.y); dr.last = pos; return; }
    var w = worldAt(pos);
    if (dr.kind === 'hand') { var H = S.info.world.hand; if (H) { H.tx = w.x; H.ty = w.y; } return; }
    if (dr.kind === 'measure') { S.measure.b = snapPoint(w.x, w.y, true); return; }
    if (dr.kind === 'draw') { dr.b = snapPoint(w.x, w.y, dr.kind2 === 'bar' || dr.kind2 === 'spring'); return; }
    if (dr.kind === 'move') {
      if (!dr.moved && Math.hypot(pos.x - dr.startPx.x, pos.y - dr.startPx.y) < 6) return;
      if (!dr.moved) { dr.moved = true; dr.list = dr.end != null ? null : collectMove(dr.part); dr.orig = JSON.parse(JSON.stringify(dr.part)); }
      var dx = w.x - dr.start.x, dy = w.y - dr.start.y;
      if (dr.end != null) {
        var key = dr.end === 0 ? ['x1', 'y1'] : ['x2', 'y2'];
        var t = snapPoint(dr.orig[key[0]] + dx, dr.orig[key[1]] + dy, dr.part.kind !== 'ramp');
        moveEnd(dr.part, dr.end, t.x, t.y);
      } else {
        if (S.snap) { dx = Math.round(dx / 0.01) * 0.01; dy = Math.round(dy / 0.01) * 0.01; }
        dr.list.forEach(function (e2) { translatePart(e2.p, e2.o, dx, dy, e2.ends); });
      }
      rebuild();
    }
  }
  function onUp(e) {
    if (!S.pointers.has(e.pointerId)) return;
    S.dirty = true;
    var pos = evPos(e);
    S.pointers.delete(e.pointerId);
    if (S.pinch) { if (S.pointers.size < 2) S.pinch = null; S.drag = null; return; }
    var dr = S.drag; S.drag = null;
    if (!dr) return;
    var tapped = dr.startPx ? Math.hypot(pos.x - dr.startPx.x, pos.y - dr.startPx.y) < 7 : false;
    if (dr.kind === 'hand') { S.info.world.hand = null; return; }
    if (dr.kind === 'pan' || dr.kind === 'orbit') {
      if (dr.deselect && Math.hypot(pos.x - dr.start.x, pos.y - dr.start.y) < 6) { S.sel = null; renderInspector(); }
      return;
    }
    if (dr.kind === 'move') { if (dr.moved) { pushUndo(dr.before); rebuild(); save(); renderInspector(); } return; }
    if (dr.kind === 'measure') { if (tapped) S.measure = null; return; }
    if (dr.kind === 'place') { createAt(dr.kind2, dr.a, null); return; }
    if (dr.kind === 'draw') createAt(dr.kind2, dr.a, tapped ? null : dr.b);
  }
  function onWheel(e) {
    e.preventDefault();
    S.dirty = true;
    var f = Math.pow(1.0015, -e.deltaY);
    if (is3d()) { GL.zoom(f); return; }
    var pos = evPos(e), before = S2W(pos.x, pos.y);
    S.cam.s = Math.max(30, Math.min(2500, S.cam.s * f));
    var after = S2W(pos.x, pos.y);
    S.cam.x += before.x - after.x; S.cam.y += before.y - after.y;
  }
  function zoomBy(f) {
    S.dirty = true; if (is3d()) GL.zoom(f); else S.cam.s = Math.max(30, Math.min(2500, S.cam.s * f)); }

  // ---------- arranque ----------
  function start(data) {
    ctx = $('cv').getContext('2d');
    readColors();
    if (GL && !GL.init($('gl'))) GL = null;
    if (GL) GL.setColors(C);
    var onTheme = function () { readColors(); if (GL) { GL.setTheme(C); S.glDirty = true; } S.panelsAt = 0; };
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (mq && mq.addEventListener) mq.addEventListener('change', onTheme);
    new MutationObserver(onTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    $('examplesBtn').addEventListener('click', function () { openExamples(); });
    $('libraryBtn').addEventListener('click', openLibrary);
    $('menuBtn').addEventListener('click', openMenu);
    $('welExample').addEventListener('click', function () {
      closeModal('welcomeModal'); S.libId = null; S.libName = '';
      setDesign(P.EXAMPLES.mazos.make()); setTab('ayuda');
      toast('Pulsa «Probar» para ver si esta rueda de 1235 gira para siempre.');
    });
    $('welEmpty').addEventListener('click', function () { closeModal('welcomeModal'); newDesign(); });
    $('importFile').addEventListener('change', function () {
      var f = $('importFile').files && $('importFile').files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () { importText(String(r.result || '')); $('importFile').value = ''; };
      r.onerror = function () { toast('No se ha podido leer ese archivo.'); };
      r.readAsText(f);
    });
    $('copyBtn').addEventListener('click', function () {
      var ta = $('shareOut');
      try { navigator.clipboard.writeText(ta.value).then(function () { toast('Diseño copiado.'); }, function () { ta.focus(); ta.select(); toast('Selecciona el texto y cópialo.'); }); }
      catch (err) { ta.focus(); ta.select(); toast('Selecciona el texto y cópialo.'); }
    });
    $('loadBtn').addEventListener('click', function () { closeModal('shareModal'); importText($('shareIn').value); });
    // cerrar ventanas: botón «Cerrar», tocar fuera o el botón «atrás»
    ['palette', 'cloneModal', 'shareModal', 'examplesModal', 'libraryModal', 'menuModal', 'welcomeModal'].forEach(function (id) {
      var m = $(id);
      m.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { if (id === 'cloneModal') closeClone(); else closeModal(id); }); });
      m.addEventListener('click', function (e) { if (e.target === m && id !== 'welcomeModal') { if (id === 'cloneModal') closeClone(); else closeModal(id); } });
    });
    $('playBtn').addEventListener('click', play);
    $('resetBtn').addEventListener('click', backToDesign);
    var speeds = [1, 4, 0.25], names = ['×1', '×4', '×¼'];
    $('speedBtn').addEventListener('click', function () {
      var i = (speeds.indexOf(S.speed) + 1) % speeds.length;
      S.speed = speeds[i]; $('speedBtn').innerHTML = '<span class="wide">Velocidad </span>' + names[i]; $('speedBtn').setAttribute('aria-label', 'Velocidad ' + names[i]);
    });
    $('zoomIn').addEventListener('click', function () { zoomBy(1.25); });
    $('zoomOut').addEventListener('click', function () { zoomBy(0.8); });
    $('zoomFit').addEventListener('click', fitView);
    $('view2d').addEventListener('click', function () { setView('2d'); });
    $('view3d').addEventListener('click', function () { setView('3d'); });
    $('tabs').querySelectorAll('.tab').forEach(function (b) { b.addEventListener('click', function () { setTab(b.dataset.tab, true); }); });
    $('sheetClose').addEventListener('click', function () { setSheet(false); });
    $('stripBtn').addEventListener('click', function () { if (mqMobile.matches && S.sheetOpen) setSheet(false); else setTab('cuentas', true); });

    ['cv', 'gl'].forEach(function (id) {
      var c = $(id);
      c.addEventListener('pointerdown', onDown); c.addEventListener('pointermove', onMove);
      c.addEventListener('pointerup', onUp); c.addEventListener('pointercancel', onUp);
      c.addEventListener('wheel', onWheel, { passive: false });
      c.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      // evita el «clic fantasma» del dedo sobre el panel que se acaba de abrir
      c.addEventListener('touchend', function (e) { if (e.cancelable) e.preventDefault(); }, { passive: false });
    });
    var chartBox = $('chartbox');
    chartBox.addEventListener('pointermove', function (e) { var r = chartBox.getBoundingClientRect(); chartHover = e.clientX - r.left; renderChart(); });
    chartBox.addEventListener('pointerleave', function () { chartHover = null; renderChart(); });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Escape') { if (OV.length) requestClose(OV[OV.length - 1].id); else { S.sel = null; S.measure = null; renderInspector(); } }
      else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { doRedo(); e.preventDefault(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && S.mode === 'design') { var b = snapshot(); removePart(S.sel); commit(b); e.preventDefault(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { doUndo(); e.preventDefault(); }
      else if (e.key === ' ' && e.target === document.body) { play(); e.preventDefault(); }
    });
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', function () { applySheet(S.sheetOpen); });
    var saved = load(KEYS.settings, null);
    if (saved) Object.keys(S.settings).forEach(function (k) { if (saved[k] != null) S.settings[k] = saved[k]; });
    var cur = load(KEYS.current, {});
    S.libId = cur.libId || null; S.libName = cur.libName || '';
    if (S.libId && !library().some(function (e) { return e.id === S.libId; })) { S.libId = null; S.libName = ''; }

    renderTools();
    if (window.ResizeObserver) new ResizeObserver(resize).observe($('stage'));
    window.addEventListener('resize', resize);
    resize();

    var d = data && data.design ? sanitize(data.design) : null;
    if (!d) { try { d = sanitize(JSON.parse(localStorage.getItem(STORE) || 'null')); } catch (err) { d = null; } }
    if (!d || !d.parts.length) d = P.EXAMPLES.mazos.make();
    S.design = d;
    rebuild();
    setView(GL ? '3d' : '2d');
    fitView();
    if (data && data.cam) S.cam = data.cam;
    setMode('design');
    setTab(mqMobile.matches ? 'ayuda' : 'cuentas');
    renderInspector(); renderAbout(); renderConditions();
    applySettings();
    var accion = '';
    try { accion = new URLSearchParams(location.search).get('accion') || ''; } catch (e) { accion = ''; }
    if (accion) { store(KEYS.welcome, Date.now()); try { history.replaceState(null, '', location.pathname); } catch (e) { /* nada */ } }
    if (accion === 'nuevo') setTimeout(newDesign, 200);
    else if (accion === 'ejemplos') setTimeout(function () { openExamples(); }, 200);
    else if (accion === 'disenos') setTimeout(openLibrary, 200);
    else if (!load(KEYS.welcome, 0) && !(data && data.design)) setTimeout(openWelcome, 300);
    requestAnimationFrame(frame);
  }

  var hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) hot.snapshot(function () { return { design: S.design, cam: S.cam }; });
  if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
})();
