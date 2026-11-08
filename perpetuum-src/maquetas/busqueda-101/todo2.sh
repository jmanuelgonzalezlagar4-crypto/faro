#!/bin/sh
# Segunda búsqueda: aparatos mixtos. 2.000 de cada familia nueva y 4.000 mezclas al azar, 10 s cada uno.
cd "$(dirname "$0")"
rm -f trozo-*.jsonl
( for f in rampaMagnetica circuito levaIman aguaImanes; do for k in 0 1 2 3; do echo "$f 500 2 $((k*500))"; done; done
  for k in 0 1 2 3 4 5 6 7; do echo "mezcla 500 2 $((k*500))"; done ) |
  xargs -P 4 -L 1 sh -c 'DESDE=$3 node corre.js $0 $1 $2 10 > trozo-$0-$3.jsonl'
cat trozo-*.jsonl > resultados2.jsonl && rm -f trozo-*.jsonl
wc -l resultados2.jsonl
