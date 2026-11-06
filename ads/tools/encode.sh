#!/usr/bin/env bash
# encode.sh <ad> <name>  -> out/<name>.mp4 (1080x1920 30 fps H.264 + AAC), contact sheet and QA file
set -euo pipefail
cd "$(dirname "$0")/.."; AD="$1"; NAME="$2"; FF=~/.local/bin/ffmpeg; FP=~/.local/bin/ffprobe; mkdir -p out
$FF -hide_banner -loglevel error -y -framerate 30 -i "build/$AD/frames/f_%05d.png" -i "build/$AD/mix.wav" \
  -vf "scale=1080:1920:out_color_matrix=bt709:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 18 -tune animation -profile:v high -level 4.2 -g 60 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "out/$NAME.mp4"
$FF -hide_banner -loglevel error -y -i "out/$NAME.mp4" -vf "fps=2,scale=216:384,tile=8x6:padding=4:color=black" -frames:v 1 "out/$NAME-contact.jpg"
{ $FP -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -show_entries format=duration,size -of compact "out/$NAME.mp4";
  $FF -hide_banner -nostats -i "out/$NAME.mp4" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E "I:|Peak:"; } > "out/$NAME-qa.txt"
# upload copy under 10 MB (the browser posting flow's file limit): two-pass, bitrate from the duration
DUR=$($FP -v error -show_entries format=duration -of csv=p=0 "out/$NAME.mp4"); VB=$(python3 -c "print(int(9.3*8*1024/float('$DUR') - 140))")
$FF -hide_banner -loglevel error -y -i "out/$NAME.mp4" -c:v libx264 -preset slow -b:v ${VB}k -pass 1 -passlogfile "build/$AD/x264" -an -f null /dev/null
$FF -hide_banner -loglevel error -y -i "out/$NAME.mp4" -c:v libx264 -preset slow -b:v ${VB}k -maxrate $((VB*2))k -bufsize $((VB*3))k -pass 2 -passlogfile "build/$AD/x264" -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "out/$NAME-upload.mp4"
echo "encoded out/$NAME.mp4"; cat "out/$NAME-qa.txt"; ls -lh "out/$NAME.mp4" "out/$NAME-upload.mp4"
