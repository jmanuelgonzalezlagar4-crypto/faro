#!/bin/sh
# 3.000 rampas al azar en 4 trozos
cd "$(dirname "$0")"
k=0; for s in 1 2 3 4; do SEMILLA=$s DESDE=$((k*750)) node barrido.js 750 > trozo-$s.jsonl & k=$((k+1)); done; wait
cat trozo-1.jsonl trozo-2.jsonl trozo-3.jsonl trozo-4.jsonl > barrido.jsonl && rm trozo-*.jsonl && wc -l barrido.jsonl
