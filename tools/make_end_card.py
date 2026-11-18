"""Build Curio's end card: one still (assets/endcard/curio-endcard-v1.png) and one clip (assets/endcard/curio-endcard-v1.mp4).
usage: .venv/bin/python tools/make_end_card.py
The clip is 1080x1920, 60 fps, h264 + AAC, the same shape as a finished reel, so tools/add_end_card.sh can join it on.
Voice: vo/endline2-tight.wav ("More stories like this, in Curio."), with 0.22 s of silence in front so the join's 0.2 s
dissolve never touches the first word. Nothing here plays any sound."""
import base64, json, os, subprocess, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "endcard")
VO, WORDS = os.path.join(ROOT, "vo", "endline2-tight.wav"), os.path.join(ROOT, "vo", "endline2-tight-words.json")
LEAD, TAIL, VOICE_LUFS, TEMPO = 0.22, 0.15, -14.5, 1.08
icon = "data:image/png;base64," + base64.b64encode(open(os.path.join(OUT, "curio-icon.png"), "rb").read()).decode()
HTML = f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&display=swap">
<style>
html,body{{margin:0;width:1080px;height:1920px;background:#07060d;overflow:hidden;font-family:"Barlow Condensed","Arial Narrow",Arial,sans-serif;color:#fff}}
.glow{{position:absolute;left:0;top:0;width:1080px;height:1920px;background:radial-gradient(620px 620px at 540px 720px,rgba(132,92,255,.34),rgba(132,92,255,.10) 55%,rgba(7,6,13,0) 78%)}}
.icon{{position:absolute;left:380px;top:560px;width:320px;height:320px;border-radius:74px;overflow:hidden;box-shadow:0 30px 90px rgba(120,80,255,.45),0 0 0 2px rgba(255,255,255,.14)}}
.icon img{{width:100%;height:100%;transform:scale(1.13);display:block}}
.name{{position:absolute;left:0;top:925px;width:1080px;text-align:center;font-weight:800;font-size:168px;letter-spacing:1px;line-height:1}}
.line{{position:absolute;left:0;top:1112px;width:1080px;text-align:center;font-weight:600;font-size:60px;color:rgba(233,238,243,.88)}}
.pill{{position:absolute;left:190px;top:1250px;width:700px;height:112px;border-radius:56px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.24);box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:22px;font-weight:700;font-size:60px}}
.pill b{{color:#ffd23f;font-weight:800}}
.where{{position:absolute;left:0;top:1392px;width:1080px;text-align:center;font-weight:600;font-size:44px;color:rgba(233,238,243,.66);letter-spacing:.5px}}
</style></head><body>
<div class="glow"></div>
<div class="icon"><img src="{icon}"></div>
<div class="name">Curio</div>
<div class="line">More true stories like this, every day.</div>
<div class="pill"><svg width="50" height="50" viewBox="0 0 50 50"><circle cx="21" cy="21" r="14" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="5"/><line x1="32" y1="32" x2="45" y2="45" stroke="rgba(255,255,255,.85)" stroke-width="5" stroke-linecap="round"/></svg><span>Search <b>Curio</b></span></div>
<div class="where">Free on the App Store and Google Play</div>
</body></html>"""
os.makedirs(OUT, exist_ok=True)
page_path = os.path.join(OUT, "curio-endcard-v1.html")
open(page_path, "w", encoding="utf-8").write(HTML)
png = os.path.join(OUT, "curio-endcard-v1.png")
with sync_playwright() as p:
    br = p.chromium.launch(headless=True)
    pg = br.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto("file://" + page_path)
    pg.wait_for_load_state("networkidle")
    pg.evaluate("document.fonts.ready")
    ok = pg.evaluate("document.fonts.check('800 168px \"Barlow Condensed\"')")
    pg.screenshot(path=png)
    br.close()
if not ok:
    sys.exit("Barlow Condensed did not load: the card would use a fallback font. Check the network and run again.")
w = json.load(open(WORDS, encoding="utf-8"))
words = w["words"] if isinstance(w, dict) else w
g = lambda x, *ks: next(x[k] for k in ks if k in x)
t0, t1 = g(words[0], "start", "s", "t0"), g(words[-1], "end", "e", "t1")
a0, a1 = max(0.0, t0 - 0.06), t1 + 0.16
spoken = (a1 - a0) / TEMPO
dur = round(LEAD + spoken + TAIL, 3)
def lufs(path, flt):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", flt + ",ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float([l for l in r.splitlines() if " I:" in l][-1].split()[1])
trim = f"atrim={a0}:{a1},asetpts=PTS-STARTPTS"
gain = round(VOICE_LUFS - lufs(VO, trim), 2)
af = f"[1:a]{trim},aresample=48000,aformat=channel_layouts=stereo,highpass=f=70,atempo={TEMPO},volume={gain}dB,afade=t=out:st={spoken - 0.05}:d=0.05,adelay={int(LEAD * 1000)}:all=1,apad,atrim=0:{dur}[a]"
mp4 = os.path.join(OUT, "curio-endcard-v1.mp4")
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "60", "-t", str(dur), "-i", png, "-i", VO,
                "-filter_complex", f"[0:v]scale=1080:1920:out_color_matrix=bt709:out_range=tv,format=yuv420p[v];{af}", "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "animation", "-profile:v", "high", "-level", "4.2", "-g", "120", "-r", "60",
                "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
                "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", "-t", str(dur), mp4], check=True)
print(f"end card: {png}\nclip: {mp4} ({dur} s; voice {round(LEAD, 2)}-{round(LEAD + spoken, 2)} s at {TEMPO}x; gain {gain} dB)")
