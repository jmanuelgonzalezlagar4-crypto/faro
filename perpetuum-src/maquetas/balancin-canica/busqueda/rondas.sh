#!/bin/bash
# rondas de afinado: cada una prueba variaciones de los 30 mejores de todo lo probado hasta ahora
set -e
for r in 1 2 3 4 5 6; do
  node afina.js $r 30 10 res*.jsonl ar*.jsonl 2>/dev/null || node afina.js $r 30 10 res*.jsonl
  for k in 0 1 2 3; do node prueba3.js afina${r}_$k.txt 30 > ar${r}_$k.jsonl & done; wait
  node -e "
const fs=require('fs'); const R=fs.readdirSync('.').filter(f=>/^ar${r}_\d\.jsonl$/.test(f)).flatMap(f=>fs.readFileSync(f,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse)).filter(r=>r.valido);
const all=fs.readdirSync('.').filter(f=>/^(res\d|ar\d+_\d)\.jsonl$/.test(f)).flatMap(f=>fs.readFileSync(f,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse)).filter(r=>r.valido);
const best=all.reduce((a,b)=>(b.recupera>a.recupera?b:a));
console.log('ronda $r: probados', R.length, '· mejor de la ronda', Math.max(...R.map(r=>r.recupera)), '· mejor de todo', best.recupera, '· ciclos completos', all.filter(r=>r.vueltas>=1&&r.viajes>=1).length);"
done
