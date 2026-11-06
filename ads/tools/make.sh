#!/usr/bin/env bash
# make.sh <ad> <name> [workers]: render (resumes), mix, encode
set -euo pipefail
cd "$(dirname "$0")/.."; PY=~/Desktop/dev/curio-video-kit/.venv/bin/python
caffeinate -dims "$PY" tools/render.py "$1" --samples 8 --workers "${3:-2}" > "build/$1/render.log" 2>&1
"$PY" tools/mix.py "$1" >> "build/$1/render.log" 2>&1
tools/encode.sh "$1" "$2" >> "build/$1/render.log" 2>&1
echo "== $1"; grep -E "missing|mix ->|encoded|I:|Peak|M " "build/$1/render.log" | tail -7
