#!/bin/sh
# 2.000 pistas al azar en 4 trozos de 500, cada uno con su semilla
cd "$(dirname "$0")"
k=0; for s in 11 22 33 44; do SEMILLA=$s DESDE=$((k*500)) node barrido.js 500 > trozo-$s.jsonl & k=$((k+1)); done; wait
cat trozo-11.jsonl trozo-22.jsonl trozo-33.jsonl trozo-44.jsonl > barrido.jsonl && rm trozo-*.jsonl && wc -l barrido.jsonl
