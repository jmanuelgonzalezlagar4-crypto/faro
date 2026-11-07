/* Taller Perpetuum — idioma. Los textos de la app están escritos en español; en inglés se buscan en
   PerpetuumEN (generado por tools/mkdict.js). El idioma se elige al arrancar: el de los ajustes o el del móvil. */
(function (root) {
  'use strict';
  var EN = root.PerpetuumEN || {}, has = Object.prototype.hasOwnProperty;
  function auto() {
    var l = '';
    try { l = (root.navigator && ((root.navigator.languages && root.navigator.languages[0]) || root.navigator.language)) || ''; } catch (e) { l = ''; }
    // español y las lenguas de España → español; cualquier otra → inglés
    return !l || /^(es|ca|gl|eu)\b/i.test(l) ? 'es' : 'en';
  }
  var lang = 'es';
  try {
    var st = JSON.parse(root.localStorage.getItem('taller-perpetuum.ajustes') || 'null');
    lang = st && (st.lang === 'es' || st.lang === 'en') ? st.lang : auto();
  } catch (e) { lang = auto(); }
  function t(s, vars) {
    var r = lang === 'en' && has.call(EN, s) ? EN[s] : s;
    if (vars) r = r.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? String(vars[k]) : m; });
    return r;
  }
  // texto fijo de la página (la plantilla): nodos de texto y etiquetas para lectores de pantalla
  function dom(el) {
    if (lang !== 'en' || !el) return;
    var doc = el.ownerDocument || document, w = doc.createTreeWalker(el, 4, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (node) {
      var p = node.parentNode && node.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE') return;
      var v = node.nodeValue, key = v.replace(/\s+/g, ' ').trim();
      if (key && has.call(EN, key)) node.nodeValue = v.replace(/^(\s*)[\s\S]*?(\s*)$/, function (m, a, b) { return a + EN[key] + b; });
    });
    ['aria-label', 'title', 'placeholder', 'alt'].forEach(function (a) {
      el.querySelectorAll('[' + a + ']').forEach(function (x) { var k = x.getAttribute(a).replace(/\s+/g, ' ').trim(); if (has.call(EN, k)) x.setAttribute(a, EN[k]); });
    });
    if (doc.title && has.call(EN, doc.title.trim())) doc.title = EN[doc.title.trim()];
    if (doc.documentElement) doc.documentElement.lang = 'en';
  }
  root.PerpetuumI18n = { lang: lang, locale: lang === 'en' ? 'en-GB' : 'es-ES', t: t, dom: dom };
})(typeof window !== 'undefined' ? window : globalThis);
