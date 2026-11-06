// Saca los textos de interfaz (en español) de los .js y de la plantilla.
const acorn = require('acorn'), fs = require('fs');
const LET = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/;
function isUi(v) {
  const text = v.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ');
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}/.test(text)) return false;
  if (/^[a-z0-9_\-\.#\[\]="':,\s\/\*\(\)]+$/.test(v) && !/[a-z]{2,} [a-z]{2,}/.test(text)) return false; // identificadores, selectores
  if (/^(https?:|mailto:|data:|#|\.\/|[a-z\-]+\/)/.test(v)) return false;
  if (/[áéíóúñ¿¡ÁÉÍÓÚÑ]/.test(text)) return true;
  if (/[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(text)) return true;
  if (/^\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/.test(text)) return true;
  if (/^\s+[a-z]{2,}/.test(text) || /[a-z]{2,}\s+$/.test(text)) return true;
  return false;
}
function walk(node, parent, cb) {
  if (!node || typeof node.type !== 'string') return;
  cb(node, parent);
  for (const k of Object.keys(node)) {
    if (k === 'parent') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => walk(c, node, cb)); else if (v && typeof v.type === 'string') walk(v, node, cb);
  }
}
function fromJs(file) {
  const src = fs.readFileSync(file, 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 2020, locations: true });
  const out = [];
  walk(ast, null, (n, p) => {
    if (n.type !== 'Literal' || typeof n.value !== 'string') return;
    if (p && p.type === 'Property' && p.key === n) return;
    if (p && p.type === 'ExpressionStatement') return;
    if (p && p.type === 'MemberExpression' && p.property === n) return;
    if (!isUi(n.value)) return;
    out.push({ file, line: n.loc.start.line, start: n.start, end: n.end, v: n.value });
  });
  return out;
}
module.exports = { fromJs, isUi };
if (require.main === module) {
  const all = process.argv.slice(2).flatMap(fromJs);
  const uniq = new Map(); all.forEach(s => { if (!uniq.has(s.v)) uniq.set(s.v, s); });
  console.log('literales:', all.length, 'distintos:', uniq.size, 'caracteres:', [...uniq.keys()].join('').length);
  if (process.env.SHOW) [...uniq.values()].forEach(s => console.log(s.file.split('/').pop() + ':' + s.line + '\t' + JSON.stringify(s.v)));
}
