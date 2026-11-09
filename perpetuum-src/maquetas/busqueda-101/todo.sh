#!/bin/sh
# La búsqueda entera: 2.000 aparatos de cada familia al azar y 200 ejemplos del banco cambiados, 10 s cada uno.
cd "$(dirname "$0")"
rm -f trozo-*.jsonl
( for f in ruedaImanes palancasImanes gravedad balancin pendulos agua; do for k in 0 1 2 3; do echo "$f 500 1 $((k*500))"; done; done
  for k in 0 1 2 3; do echo "ejemplos 50 1 $((k*50))"; done ) |
  xargs -P 4 -L 1 sh -c 'DESDE=$3 node corre.js $0 $1 $2 10 > trozo-$0-$3.jsonl'
cat trozo-*.jsonl > resultados.jsonl && rm -f trozo-*.jsonl
wc -l resultados.jsonl
