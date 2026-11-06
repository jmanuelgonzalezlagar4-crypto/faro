// Envuelve en T(...) los textos de interfaz de un .js (una sola vez; si ya están envueltos, no los toca).
const acorn = require('acorn'), fs = require('fs');
const { isUi } = require('./strings.js');
const SKIP = new Set(['$', 'T', 'getElementById', 'querySelector', 'querySelectorAll', 'getAttribute', 'setAttribute', 'removeAttribute', 'addEventListener', 'matchMedia', 'getPropertyValue', 'getItem', 'setItem', 'removeItem', 'createElement', 'closest', 'toggle', 'add', 'remove', 'contains']);
function calleeName(c) { return c.type === 'Identifier' ? c.name : (c.type === 'MemberExpression' && !c.computed ? c.property.name : ''); }
for (const file of process.argv.slice(2)) {
  let src = fs.readFileSync(file, 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 2020 });
  const edits = [];
  (function walk(n, p) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'Literal' && typeof n.value === 'string' && isUi(n.value)) {
      let skip = false;
      if (p.type === 'Property' && p.key === n) skip = true;
      if (p.type === 'ExpressionStatement' || p.type === 'SwitchCase') skip = true;
      if (p.type === 'MemberExpression' && p.property === n) skip = true;
      if (p.type === 'BinaryExpression' && /^[!=]==?$/.test(p.operator)) skip = true;
      if (p.type === 'CallExpression' && SKIP.has(calleeName(p.callee)) && (p.arguments[0] === n || calleeName(p.callee) === 'T')) skip = true;
      if (!skip) edits.push([n.start, n.end]);
    }
    for (const k of Object.keys(n)) { const v = n[k]; if (Array.isArray(v)) v.forEach(c => walk(c, n)); else if (v && typeof v.type === 'string') walk(v, n); }
  })(ast, {});
  edits.sort((a, b) => b[0] - a[0]).forEach(([s, e]) => { src = src.slice(0, s) + 'T(' + src.slice(s, e) + ')' + src.slice(e); });
  fs.writeFileSync(file, src);
  console.log(file, 'envueltos:', edits.length);
}
