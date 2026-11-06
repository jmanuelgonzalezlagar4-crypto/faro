// Lista de textos a traducir: los T('...') de los .js y el texto fijo de la plantilla. Cada uno con un id estable.
const acorn = require('acorn'), fs = require('fs'), crypto = require('crypto');
const id = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 7);
function jsKeys(file) {
  const src = fs.readFileSync(file, 'utf8'), out = [];
  (function walk(n) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'T' && n.arguments[0]) {
      const a = n.arguments[0];
      if (a.type === 'Literal') out.push(a.value);
      else if (a.type === 'ConditionalExpression') [a.consequent, a.alternate].forEach(b => { if (b.type === 'Literal') out.push(b.value); });
    }
    for (const k of Object.keys(n)) { const v = n[k]; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === 'string') walk(v); }
  })(acorn.parse(src, { ecmaVersion: 2020 }));
  return out;
}
function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
function decode(s) { return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }
function tplKeys(file) {
  let t = fs.readFileSync(file, 'utf8'), out = [];
  const title = /<title>([^<]*)<\/title>/.exec(t); if (title) out.push(norm(title[1]));
  t = t.slice(t.indexOf('</style>')).replace(/<script[\s\S]*?<\/script>/g, '');
  t.replace(/>([^<]+)</g, (m, x) => { const v = norm(decode(x)); if (/[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}/.test(v)) out.push(v); });
  t.replace(/\s(?:aria-label|title|placeholder|alt)="([^"]+)"/g, (m, x) => { const v = norm(decode(x)); if (/[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}/.test(v)) out.push(v); });
  return out;
}
function all(dir) {
  const seen = new Map();
  [['app.js', jsKeys], ['build.js', jsKeys], ['template.html', tplKeys]].forEach(([f, fn]) => fn(dir + '/' + f).forEach(s => { if (!seen.has(s)) seen.set(s, { id: id(s), s, f }); }));
  return [...seen.values()];
}
module.exports = { all, id };
if (require.main === module) {
  const keys = all(process.argv[2] || '.');
  fs.writeFileSync(process.argv[3] || 'keys.tsv', keys.map(k => k.id + '\t' + k.f + '\t' + JSON.stringify(k.s)).join('\n') + '\n');
  console.log('claves:', keys.length, 'caracteres:', keys.reduce((a, k) => a + k.s.length, 0));
}
