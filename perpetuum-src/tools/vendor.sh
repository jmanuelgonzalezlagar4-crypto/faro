#!/usr/bin/env bash
# Descarga three.js r128 y las fuentes (Barlow, Barlow Condensed, IBM Plex Mono) que la app lleva dentro.
# Se ejecuta una vez desde perpetuum-src/:  bash tools/vendor.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p fonts lib3
( cd lib3 && [ -d package ] || { npm pack three@0.128.0 --silent && tar xzf three-0.128.0.tgz; } )
for p in barlow barlow-condensed ibm-plex-mono; do
  d="fonts/fontsource-$p-5.1.0"
  [ -d "$d/package" ] && continue
  mkdir -p "$d"
  ( cd fonts && npm pack "@fontsource/$p@5.1.0" --silent >/dev/null && tar xzf "fontsource-$p-5.1.0.tgz" -C "fontsource-$p-5.1.0" )
done
( cd tools && npm install --silent )
echo "Listo: fonts/, lib3/ y tools/node_modules/"
