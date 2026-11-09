#!/bin/sh
# Cuarta búsqueda: la palanca de la captura, acelerador de Gauss, puerta en V, catapulta, elevador con generador y
# motor, rueda de Bessler con muelles. 2.000 de cada una, 10 s cada uno.
cd "$(dirname "$0")"
rm -f trozo4-*.jsonl
( for f in palancaCurva gauss puertaV catapulta elevador bessler; do for k in 0 1 2 3; do echo "$f 500 4 $((k*500))"; done; done ) |
  xargs -P 4 -L 1 sh -c 'DESDE=$3 node corre.js $0 $1 $2 10 > trozo4-$0-$3.jsonl'
cat trozo4-*.jsonl > resultados4.jsonl && rm -f trozo4-*.jsonl
wc -l resultados4.jsonl
