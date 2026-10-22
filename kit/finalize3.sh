#!/usr/bin/env bash
# finalize3.sh <render_dir> <out_dir> <name> <vo_wav> <T> <cover_t>
#   ENC=x264 (default, final master) | nvenc (fast draft, NVIDIA/Windows) | videotoolbox (fast draft, Mac)
# Works in a local dir and copies to <out_dir> at the end: writing straight into a OneDrive folder hung once (sync lock).
# trycurio.app audio style: voice + constant ambient bed/diegetic foley sitting ~20 dB under the voice; 2-pass loudnorm -14 LUFS / -1.5 dBTP.
set -euo pipefail
R="$1"; FINAL="$2"; NAME="$3"; VO="$4"; T="$5"; COVER="$6"; ENC="${ENC:-x264}"
PY="${PYTHON:-$(command -v python || command -v python3)}"   # Windows Git Bash: python (python3 can be the Store stub); macOS: python3
python(){ "$PY" "$@"; }
OUT="$R/_finalize"; rm -rf "$OUT"; mkdir -p "$OUT" "$FINAL"
case "$ENC" in
  nvenc) VENC="-c:v h264_nvenc -preset p7 -tune hq -rc vbr -cq 16 -b:v 0 -multipass fullres -spatial-aq 1 -temporal-aq 1 -bf 3 -b_ref_mode middle -profile:v high -g 120" ;;
  videotoolbox) VENC="-c:v h264_videotoolbox -b:v 14M -maxrate 20M -bufsize 28M -profile:v high -g 120" ;;
  *) VENC="-c:v libx264 -preset slow -crf 14 -tune animation -profile:v high -level 4.2 -g 120" ;;
esac
lufs(){ ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | sed -n '/Summary/,$p' | grep -m1 " I:" | awk '{print $2}'; }
IV=$(lufs "$VO"); IB=$(lufs "$R/sfx.wav"); G=$(python -I -c "import sys;print(round(float(sys.argv[1])-20-float(sys.argv[2]),2))" "$IV" "$IB")
echo "voice $IV LUFS, bed $IB LUFS -> bed gain $G dB" > "$OUT/.mixnote"
F="[0]aresample=48000,aformat=channel_layouts=stereo,highpass=f=70[vo];[1]aresample=48000,volume=${G}dB[bed];[vo][bed]amix=inputs=2:duration=longest:normalize=0,apad,atrim=0:$T"
J="$OUT/.ln.json"
ffmpeg -hide_banner -nostats -i "$VO" -i "$R/sfx.wav" -filter_complex "$F,loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/{/,/}/p' > "$J"
g(){ python -I -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]])" "$J" "$1"; }
ffmpeg -hide_banner -loglevel error -y -i "$VO" -i "$R/sfx.wav" -filter_complex "$F,loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s24le "$OUT/$NAME-mix.wav"
ffmpeg -hide_banner -loglevel error -y -framerate 60 -i "$R/frames/f_%05d.png" -i "$OUT/$NAME-mix.wav" \
  -vf "scale=1080:1920:out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  $VENC \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$OUT/$NAME.mp4"
{
  echo "== probe"; ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt,color_space,sample_rate,channels -show_entries format=duration,size,bit_rate -of compact "$OUT/$NAME.mp4"
  echo "== loudness (EBU R128, final file)"; ffmpeg -hide_banner -nostats -i "$OUT/$NAME.mp4" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E "I:|LRA:|Peak:"
  echo "== bed level"; cat "$OUT/.mixnote"
} > "$OUT/$NAME-qa-measurements.txt" 2>&1
ffmpeg -hide_banner -loglevel error -y -i "$OUT/$NAME.mp4" -vf "fps=2,scale=216:384,tile=8x5:padding=4:color=black" -frames:v 1 "$OUT/$NAME-contact-2fps.jpg"
ffmpeg -hide_banner -loglevel error -y -ss "$COVER" -i "$OUT/$NAME.mp4" -frames:v 1 -q:v 1 "$OUT/$NAME-cover.jpg"
rm -f "$J" "$OUT/.mixnote"; cp -f "$OUT"/"$NAME"* "$FINAL"/; rm -rf "$OUT"; echo "finalized $FINAL/$NAME.mp4 ($ENC)"
