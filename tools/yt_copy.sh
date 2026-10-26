#!/usr/bin/env bash
# yt_copy.sh <master.mp4> <out.mp4> [target_MB=9.2] -> 2-pass x264 copy sized under the 10 MB Claude-in-Chrome upload limit
set -euo pipefail
IN="$1"; OUT="$2"; MB="${3:-9.2}"; D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
VB=$(python3 -c "import sys;print(int(float(sys.argv[1])*8e6/float(sys.argv[2])/1000-160))" "$MB" "$D")
TMP=$(mktemp -d); cd "$TMP"
ffmpeg -hide_banner -loglevel error -y -i "$IN" -c:v libx264 -preset slow -b:v ${VB}k -maxrate $((VB*3/2))k -bufsize $((VB*2))k -pass 1 -an -f mp4 /dev/null
ffmpeg -hide_banner -loglevel error -y -i "$IN" -c:v libx264 -preset slow -b:v ${VB}k -maxrate $((VB*3/2))k -bufsize $((VB*2))k -pass 2 -c:a aac -b:a 160k -movflags +faststart "$OUT"
cd - >/dev/null; rm -rf "$TMP"; ls -la "$OUT" | awk '{print $5, $9}'
