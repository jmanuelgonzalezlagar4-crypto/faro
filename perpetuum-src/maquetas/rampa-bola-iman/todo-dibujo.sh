#!/bin/sh
# 2.000 variantes del dibujo del usuario, en 4 trozos
cd "$(dirname "$0")"
k=0; for s in 1 2 3 4; do SEMILLA=$s DESDE=$((k*500)) node barrido-dibujo.js 500 > trozo-d$s.jsonl & k=$((k+1)); done; wait
cat trozo-d1.jsonl trozo-d2.jsonl trozo-d3.jsonl trozo-d4.jsonl > barrido-dibujo.jsonl && rm trozo-d*.jsonl && wc -l barrido-dibujo.jsonl
