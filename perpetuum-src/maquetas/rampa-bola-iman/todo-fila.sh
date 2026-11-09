#!/bin/sh
# 2.000 variantes con fila de imanes y pared, en 4 trozos
cd "$(dirname "$0")"
k=0; for s in 1 2 3 4; do SEMILLA=$s DESDE=$((k*500)) node barrido-fila.js 500 > trozo-f$s.jsonl & k=$((k+1)); done; wait
cat trozo-f1.jsonl trozo-f2.jsonl trozo-f3.jsonl trozo-f4.jsonl > barrido-fila.jsonl && rm trozo-f*.jsonl && wc -l barrido-fila.jsonl
