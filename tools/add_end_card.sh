#!/usr/bin/env bash
# add_end_card.sh <reel.mp4> <out.mp4> [end_clip.mp4]
# Joins Curio's end card onto a finished reel with a 0.2 s dissolve (picture and sound). The reel itself is not changed:
# out = reel + about 2.2 s. Used for non-test reels from 2026-11-28 and for the "named-end" side of the end-cta test.
# Build or rebuild the card with: .venv/bin/python tools/make_end_card.py
set -euo pipefail
IN="$1"; OUT="$2"; HERE="$(cd "$(dirname "$0")/.." && pwd)"; END="${3:-$HERE/assets/endcard/curio-endcard-v1.mp4}"; X=0.2
[ -f "$END" ] || { echo "no end clip at $END (run tools/make_end_card.py)"; exit 1; }
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN"); OFF=$(python3 -I -c "import sys;print(round(float(sys.argv[1])-float(sys.argv[2]),3))" "$D" "$X")
ffmpeg -hide_banner -loglevel error -y -i "$IN" -i "$END" -filter_complex \
 "[0:v]fps=60,format=yuv420p,settb=AVTB[v0];[1:v]fps=60,format=yuv420p,settb=AVTB[v1];[v0][v1]xfade=transition=fade:duration=$X:offset=$OFF,format=yuv420p[v];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[1:a]aresample=48000,aformat=channel_layouts=stereo[a1];[a0][a1]acrossfade=d=$X:c1=tri:c2=tri[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 14 -tune animation -profile:v high -level 4.2 -g 120 \
 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"
D2=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
echo "end card added: $OUT ($D s -> $D2 s)"
