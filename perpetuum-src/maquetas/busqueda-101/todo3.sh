#!/bin/sh
# Tercera búsqueda: ideas clásicas (rueda de Bhaskara, imanes en espiral, péndulo con electroimán, cadena de flotadores).
cd "$(dirname "$0")"
rm -f trozo3-*.jsonl
( for f in bhaskara espiral penduloElectro cadenaAgua; do for k in 0 1 2; do echo "$f 500 3 $((k*500))"; done; done ) |
  xargs -P 4 -L 1 sh -c 'DESDE=$3 node corre.js $0 $1 $2 10 > trozo3-$0-$3.jsonl'
cat trozo3-*.jsonl > resultados3.jsonl && rm -f trozo3-*.jsonl
wc -l resultados3.jsonl
