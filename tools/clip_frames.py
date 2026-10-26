"""clip_frames.py <source video> <start_s> <dur_s> <out_dir> [width=1080] [fps=30] [crop=w:h:x:y]
Cut a real-footage segment into JPEG frames for scenes/footage.js (a folder asset in videos.json = one clip)."""
import os, shutil, subprocess, sys
src, ss, dur, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
opt = dict(a.split("=", 1) for a in sys.argv[5:])
vf = ([f"crop={opt['crop']}"] if "crop" in opt else []) + [f"fps={opt.get('fps', '30')}", f"scale={opt.get('width', '1080')}:-2:flags=lanczos"]
shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", ss, "-t", dur, "-i", src, "-vf", ",".join(vf), "-q:v", "4", os.path.join(out, "%04d.jpg")], check=True)
print(out, len(os.listdir(out)), "frames")
