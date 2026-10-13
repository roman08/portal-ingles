#!/usr/bin/env bash
# Genera la carpeta netlify/ (la app instalable) a partir de plataforma/ y pwa/.
# Uso: bash construir-netlify.sh
set -euo pipefail
cd "$(dirname "$0")"

version=$(date +%Y%m%d%H%M%S)
rm -rf netlify
mkdir -p netlify/icons

{
  cat pwa/cabecera.html
  cat plataforma/index.html
  printf '<script src="pwa.js"></script>\n</body>\n</html>\n'
} > netlify/index.html

cp plataforma/lecciones.js pwa/pwa.js pwa/manifest.webmanifest netlify/
cp pwa/icons/*.png netlify/icons/
sed "s/__VERSION__/$version/" pwa/sw.js > netlify/sw.js

echo "netlify/ listo (versión $version)"
