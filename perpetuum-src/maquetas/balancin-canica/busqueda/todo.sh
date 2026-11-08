#!/bin/bash
for k in 0 1 2 3; do node prueba3.js lote$k.txt 30 > res$k.jsonl & done; wait
echo "azar hecho"
./rondas.sh
