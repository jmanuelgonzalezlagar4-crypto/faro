// Junta las traducciones (i18n/tr*.tsv: id<TAB>inglés) con los textos actuales y genera i18n.js.
const fs = require('fs'), path = require('path');
const { all } = require('./keys.js');
const dir = process.argv[2] || '.', trDir = process.argv[3] || '../i18n';
const tr = new Map();
fs.readdirSync(trDir).filter(f => /^tr.*\.tsv$/.test(f)).sort().forEach(f => fs.readFileSync(path.join(trDir, f), 'utf8').split('\n').forEach(l => {
  if (!l.trim()) return; const i = l.indexOf('\t'); tr.set(l.slice(0, i), l.slice(i + 1));
}));
const SKIP = new Set(['Taller']);   // la marca se monta aparte
const keys = all(dir), EN = {}, missing = [];
keys.forEach(k => { if (SKIP.has(k.s)) return; if (tr.has(k.id)) EN[k.s] = tr.get(k.id); else missing.push(k); });
const used = new Set(keys.map(k => k.id)), unused = [...tr.keys()].filter(id => !used.has(id));
// las variables {x} tienen que coincidir
const bad = Object.keys(EN).filter(s => (s.match(/\{\w+\}/g) || []).sort().join() !== (EN[s].match(/\{\w+\}/g) || []).sort().join());
// las etiquetas HTML también
const tags = s => (s.match(/<\/?[a-z0-9]+|\b(id|class|for|data-[a-z]+)="[^"]*"/gi) || []).join(' ');
const badTags = Object.keys(EN).filter(s => tags(s) !== tags(EN[s]));
const runtime = fs.readFileSync(path.join(dir, 'i18n-runtime.js'), 'utf8');
fs.writeFileSync(path.join(dir, 'i18n.js'), '/* Traducción al inglés: generado por tools/mkdict.js a partir de i18n/tr*.tsv. No editar a mano. */\nwindow.PerpetuumEN = ' + JSON.stringify(EN, null, 0).replace(/","/g, '",\n"') + ';\n' + runtime);
console.log('traducidas', Object.keys(EN).length, 'faltan', missing.length, 'sobran', unused.length, 'variables mal', bad.length, 'etiquetas mal', badTags.length);
missing.forEach(k => console.log('FALTA\t' + k.id + '\t' + JSON.stringify(k.s)));
bad.forEach(s => console.log('VARIABLES\t' + JSON.stringify(s)));
badTags.forEach(s => console.log('ETIQUETAS\t' + JSON.stringify(s) + '\n\t' + JSON.stringify(EN[s])));
if (process.env.UNUSED) unused.forEach(id => console.log('SOBRA\t' + id));
