"""make_page.py <video.js> <words.json> <out_dir> <T> [name=image.jpg ...] [layout=full]  -> out_dir/page.html + timing.json
layout=full renders the style-mode video full-screen 9:16 (no blurred bands); default is the banded trycurio.app template."""
import base64, io, json, os, sys
vjs, words, out, T = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
here = os.path.dirname(os.path.abspath(__file__))
kit = io.open(os.path.join(here, "kit.js"), encoding="utf-8").read()
vid = io.open(vjs, encoding="utf-8").read()
w = json.load(io.open(words, encoding="utf-8"))["words"]
os.makedirs(out, exist_ok=True)
assets, layout = {}, "banded"
for a in sys.argv[5:]:
    k, f = a.split("=", 1)
    if k == "layout": layout = f; continue
    assets[k] = "data:image/jpeg;base64," + base64.b64encode(open(f, "rb").read()).decode()
html = f"""<!doctype html><html><head><meta charset="utf-8"><title>render</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Caveat:wght@700&display=swap">
<style>html,body{{margin:0;background:#000}}canvas{{width:270px;height:480px}}</style></head><body>
<canvas id="cv" width="1080" height="1920"></canvas>
<script>{kit}</script>
<script>window.WORDS={json.dumps(w)};window.T={T};window.ASSETS={json.dumps(assets)};window.LAYOUT={json.dumps(layout)};</script>
<script>{vid}</script>
</body></html>"""
io.open(os.path.join(out, "page.html"), "w", encoding="utf-8").write(html)
json.dump({"T": T}, open(os.path.join(out, "timing.json"), "w"))
print("page ->", os.path.join(out, "page.html"))
