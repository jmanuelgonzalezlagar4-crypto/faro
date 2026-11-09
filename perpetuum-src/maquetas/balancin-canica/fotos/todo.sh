#!/bin/sh
# Rehace la búsqueda entera: 2.000 diseños al azar y 4 rondas afinando los 30 mejores (unos 3 minutos con 4 núcleos).
cd "$(dirname "$0")"
node azar.js 2000 7 lote.txt && split -n l/4 -d --additional-suffix=.txt lote.txt parte
for k in 00 01 02 03; do node corre.js parte$k.txt 30 > res$k.jsonl & done; wait
cat res0*.jsonl > resultados.jsonl
for R in 1 2 3 4; do
  node afina.js $R && split -n l/4 -d --additional-suffix=.txt afina$R.txt af${R}_
  for k in 00 01 02 03; do node corre.js af${R}_$k.txt 30 > ar${R}_$k.jsonl & done; wait
  cat ar${R}_*.jsonl >> resultados.jsonl
done
rm -f lote.txt parte*.txt res0*.jsonl afina?.txt af?_*.txt ar?_*.jsonl
wc -l resultados.jsonl
