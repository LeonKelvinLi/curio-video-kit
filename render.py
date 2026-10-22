"""Render Curio shorts with one command (macOS, Windows, Linux).

usage:
  python render.py P4                        # one video, full-screen 9:16, final quality (x264)
  python render.py all                       # all videos in videos.json
  python render.py P4 --layout banded        # the old trycurio.app square-strip template
  python render.py P4 --enc videotoolbox     # fast draft on a Mac (nvenc on an NVIDIA PC)
  python render.py P4 --workers 4 --cpu      # pick worker count / force software drawing

Each video: build the page (kit + scene + words + photos) -> draw 60 fps frames in headless Chromium (GPU, parallel
workers) -> mix the voice with the sound bed at -14 LUFS -> encode -> QA file, 2 fps contact sheet, cover.
Output: out/<ID>/<name>[-FULL].mp4 (+ -cover.jpg, -contact-2fps.jpg, -mix.wav, -qa-measurements.txt).
The video ends 0.2 s after the voiceover file ends, so the last word always finishes."""
import argparse, json, os, shutil, subprocess, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
fwd = lambda p: p.replace("\\", "/")  # bash on Windows (Git Bash) prefers forward slashes

def find_bash():
    """macOS/Linux: the system bash. Windows: Git Bash next to git.exe (plain "bash" there is often WSL's)."""
    if sys.platform == "win32":
        git = shutil.which("git")
        cands = ([os.path.join(os.path.dirname(os.path.dirname(git)), "bin", "bash.exe")] if git else []) + [r"C:\Program Files\Git\bin\bash.exe"]
        for c in cands:
            if os.path.exists(c): return c
    return shutil.which("bash")

def ffdur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True, check=True).stdout)

def main():
    ap = argparse.ArgumentParser(description="Render Curio shorts")
    ap.add_argument("video", help="P1..P6 or all (see videos.json)")
    ap.add_argument("--layout", default="full", choices=["full", "banded"])
    ap.add_argument("--enc", default="x264", choices=["x264", "nvenc", "videotoolbox"])
    ap.add_argument("--workers", type=int)
    ap.add_argument("--cpu", action="store_true", help="software drawing (if the GPU path fails on this machine)")
    ap.add_argument("--out", default=os.path.join(ROOT, "out"))
    ap.add_argument("--keep-frames", action="store_true")
    a = ap.parse_args()
    BASH = find_bash()
    missing = [t for t in ("ffmpeg", "ffprobe") if shutil.which(t) is None] + ([] if BASH else ["bash"])
    if missing: sys.exit("missing on PATH: " + ", ".join(missing) + " (macOS: brew install ffmpeg)")
    V = json.load(open(os.path.join(ROOT, "videos.json"), encoding="utf-8"))
    ids = list(V) if a.video.lower() == "all" else [a.video.upper()]
    for vid in ids:
        if vid not in V: sys.exit(f"unknown video {vid}; choose from {', '.join(V)}")
        v, t0 = V[vid], time.time()
        build = os.path.join(ROOT, "build", f"{vid}-{a.layout}"); shutil.rmtree(build, ignore_errors=True); os.makedirs(build)
        scene = os.path.join(build, "scene.js")
        with open(scene, "w", encoding="utf-8") as f: f.write("\n".join(open(os.path.join(ROOT, "scenes", s), encoding="utf-8").read() for s in v["scene"]))
        vo = os.path.join(ROOT, "vo", v["vo"] + "-tight.wav"); T = round(ffdur(vo) + 0.2, 2)
        page = [sys.executable, os.path.join(ROOT, "kit", "make_page.py"), scene, os.path.join(ROOT, "vo", v["vo"] + "-tight-words.json"), build, str(T)]
        page += [f"{k}={os.path.join(ROOT, 'assets', f)}" for k, f in v["assets"].items()] + (["layout=full"] if a.layout == "full" else [])
        subprocess.run(page, check=True, stdout=subprocess.DEVNULL)
        draw = [sys.executable, os.path.join(ROOT, "tools", "drive_render.py"), os.path.join(build, "page.html"), os.path.join(build, "frames"), "60", "--sfx"]
        draw += (["--workers", str(a.workers)] if a.workers else []) + (["--cpu"] if a.cpu else [])
        subprocess.run(draw, check=True)
        name = v["name"] + ("-FULL" if a.layout == "full" else "")
        env = dict(os.environ, ENC=a.enc, PYTHON=fwd(sys.executable))
        subprocess.run([BASH, fwd(os.path.join(ROOT, "kit", "finalize3.sh")), fwd(build), fwd(os.path.join(a.out, vid)), name, fwd(vo), str(T), str(v["cover"])], check=True, env=env)
        if not a.keep_frames: shutil.rmtree(os.path.join(build, "frames"), ignore_errors=True)
        qa = open(os.path.join(a.out, vid, name + "-qa-measurements.txt"), encoding="utf-8").read()
        print(f"\n{vid} {v['title']} ({a.layout}, {a.enc}) done in {time.time() - t0:.0f}s -> {os.path.join(a.out, vid, name + '.mp4')}\n{qa}")

if __name__ == "__main__":
    main()
