#!/bin/sh
# Segunda fase: los volantes, 600 s; las 32 máquinas al azar que mejor aguantan, hasta 1.800 s o hasta que se paren.
cd "$(dirname "$0")"
S=/tmp/claude-0/-home-user-faro/a949a353-9331-56aa-9e7b-310131e981e1/scratchpad/b101
( for k in 0 1 2 3; do echo "vol 600 $k"; echo "azar 1800 $k"; done ) |
  xargs -P 4 -L 1 sh -c 'LISTA='$S'/fase2-$0.json node dura.js x 0 $1 $2 4 > trozo-dura-f2-$0-$2.jsonl'
cat trozo-dura-f2-vol-*.jsonl > duracion-fase2-volantes.jsonl; cat trozo-dura-f2-azar-*.jsonl > duracion-fase2-azar.jsonl; rm -f trozo-dura-f2-*.jsonl
wc -l duracion-fase2-*.jsonl
