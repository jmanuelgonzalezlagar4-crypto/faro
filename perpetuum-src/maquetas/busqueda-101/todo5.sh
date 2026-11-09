#!/bin/sh
# Quinta búsqueda: motor de imanes de pistón, rueda con pesas deslizantes y muelles, palanca con flotador,
# bolas que botan en una plataforma con muelle, trampolín e imanes, rueda suelta con peso dentro. 2.000 de cada una.
cd "$(dirname "$0")"
rm -f trozo5-*.jsonl
( for f in pistonIman deslizantes palancaAgua rebote trampolin ruedaLoca; do for k in 0 1 2 3; do echo "$f 500 5 $((k*500))"; done; done ) |
  xargs -P 4 -L 1 sh -c 'DESDE=$3 node corre.js $0 $1 $2 10 > trozo5-$0-$3.jsonl'
cat trozo5-*.jsonl > resultados5.jsonl && rm -f trozo5-*.jsonl
wc -l resultados5.jsonl
