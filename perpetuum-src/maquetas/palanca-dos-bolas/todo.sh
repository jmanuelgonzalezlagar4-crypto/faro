#!/bin/sh
# 2.000 variantes en 4 trozos de 500, cada uno con su semilla
cd "$(dirname "$0")"
for s in 12345 777 4242 99991; do SEMILLA=$s node barrido.js 500 > trozo-$s.jsonl & done; wait
cat trozo-*.jsonl > barrido.jsonl && rm trozo-*.jsonl && wc -l barrido.jsonl
