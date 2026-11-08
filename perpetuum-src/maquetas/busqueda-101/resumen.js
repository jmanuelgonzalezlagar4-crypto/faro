// Resumen por familia de resultados.jsonl
const fs = require('fs'), path = require('path');
const R = fs.readFileSync(path.join(__dirname, 'resultados.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const fams = [...new Set(R.map(r => r.fam))];
console.log('familia | probados | apartados | rend. máximo | ≥100,1 % | ≥101 %');
fams.forEach(f => { const s = R.filter(r => r.fam === f), ok = s.filter(r => r.rend != null && !r.roto);
  console.log(`${f} | ${ok.length} | ${s.length - ok.length} | ${Math.max(...ok.map(r => r.rend)).toFixed(3)} % | ${ok.filter(r => r.rend >= 100.1).length} | ${ok.filter(r => r.rend >= 101).length}`); });
const ok = R.filter(r => r.rend != null && !r.roto);
console.log(`TOTAL | ${ok.length} | ${R.length - ok.length} | ${Math.max(...ok.map(r => r.rend)).toFixed(3)} % | ${ok.filter(r => r.rend >= 100.1).length} | ${ok.filter(r => r.rend >= 101).length}`);
const por = {}; R.filter(r => r.por).forEach(r => { const k = r.por.replace(/:.*/, ''); por[k] = (por[k] || 0) + 1; }); console.log('apartados:', JSON.stringify(por));
const ej = {}; R.filter(r => r.fam === 'ejemplos' && r.ej).forEach(r => { ej[r.ej] = Math.max(ej[r.ej] || 0, r.rend); }); console.log('ejemplos (rend. máximo):', JSON.stringify(ej));
