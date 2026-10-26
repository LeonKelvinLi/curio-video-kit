"""test_frames.py <ID> <t1,t2,...> -> build/test-<ID>/sheet.jpg (full layout), for checking a scene without a full render."""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
vid, times = sys.argv[1].upper(), sys.argv[2]
v = json.load(open(os.path.join(ROOT, "videos.json"), encoding="utf-8"))[vid]
B = os.path.join(ROOT, "build", "test-" + vid); subprocess.run(["rm", "-rf", B]); os.makedirs(B)
open(os.path.join(B, "scene.js"), "w", encoding="utf-8").write("\n".join(open(os.path.join(ROOT, "scenes", s), encoding="utf-8").read() for s in v["scene"]))
vo = os.path.join(ROOT, "vo", v["vo"] + "-tight.wav")
T = round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vo]).decode()) + 0.2, 2)
subprocess.run([sys.executable, os.path.join(ROOT, "kit", "make_page.py"), os.path.join(B, "scene.js"), os.path.join(ROOT, "vo", v["vo"] + "-tight-words.json"), B, str(T)]
               + [f"{k}={os.path.join(ROOT, 'assets', f)}" for k, f in v["assets"].items()] + ["layout=full"], check=True, stdout=subprocess.DEVNULL)
subprocess.run([sys.executable, os.path.join(ROOT, "tools", "drive_render.py"), os.path.join(B, "page.html"), os.path.join(B, "frames"), "60", "--test", times], check=True, stdout=subprocess.DEVNULL)
n = len(times.split(","))
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-pattern_type", "glob", "-i", os.path.join(B, "frames", "test_*.png"), "-vf", f"scale=270:480,tile={n}x1", "-frames:v", "1", os.path.join(B, "sheet.jpg")], check=True)
print(os.path.join(B, "sheet.jpg"), "T =", T)
