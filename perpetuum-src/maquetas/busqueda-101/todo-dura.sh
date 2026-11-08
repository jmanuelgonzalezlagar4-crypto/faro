#!/bin/sh
# Cuánto dura cada aparato de las tres tandas en condiciones reales (hasta 60 s).
cd "$(dirname "$0")"
( for k in 0 1 2 3; do echo "resultados.jsonl 1 $k"; echo "resultados2.jsonl 2 $k"; echo "resultados3.jsonl 3 $k"; done ) |
  xargs -P 4 -L 1 sh -c 'node dura.js $0 $1 60 $2 4 > trozo-dura-$1-$2.jsonl'
cat trozo-dura-*.jsonl > duracion.jsonl && rm -f trozo-dura-*.jsonl
wc -l duracion.jsonl
