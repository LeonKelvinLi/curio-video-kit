"""Profile where render time goes, per browser mode.
usage: bench_render.py <page.html> [frames=60]
Modes: headless shell (current), full Chromium new-headless (software), full Chromium new-headless + GPU flags.
Per mode: GPU status, ms/frame for draw only, draw + PNG dataURL (current path), draw + raw RGBA readback."""
import json, os, pathlib, sys, time
from playwright.sync_api import sync_playwright

page = pathlib.Path(os.path.abspath(sys.argv[1])).as_uri()
N = int(sys.argv[2]) if len(sys.argv) > 2 else 60
GPU = ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--enable-accelerated-2d-canvas", "--disable-gpu-vsync", "--disable-frame-rate-limit"]
MODES = [("headless-shell (current)", {}, ["--disable-gpu-vsync"]),
         ("chromium new-headless, software", {"channel": "chromium"}, ["--disable-gpu-vsync", "--disable-gpu"]),
         ("chromium new-headless, GPU", {"channel": "chromium"}, GPU)]
DRAW = "t => { window.renderFrame(t); return 0; }"
PNG = "t => window.frameDataURL(t).length"
RAW = "t => { window.renderFrame(t); const c = document.getElementById('cv'); return c.getContext('2d').getImageData(0, 0, c.width, c.height).data.length; }"
with sync_playwright() as p:
    for name, kw, args in MODES:
        b = p.chromium.launch(headless=True, args=args, **kw)
        pg = b.new_page(viewport={"width": 400, "height": 700})
        pg.goto(page); pg.wait_for_function("window.frameDataURL && window.fontsReady"); pg.evaluate("window.fontsReady()")
        feat = pg.evaluate("() => { const c = document.createElement('canvas'); const gl = c.getContext('webgl'); if (!gl) return 'no webgl'; const e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); }")
        res = {}
        for label, js in (("draw", DRAW), ("draw+png", PNG), ("draw+raw", RAW)):
            pg.evaluate(js, 0.5)  # warm up
            t0 = time.time()
            for i in range(N): pg.evaluate(js, 1.0 + i / 60)
            res[label] = round((time.time() - t0) / N * 1000, 1)
        print(f"{name:34s} draw {res['draw']:6.1f} ms | draw+PNG {res['draw+png']:6.1f} ms | draw+raw {res['draw+raw']:6.1f} ms | {feat}", flush=True)
        b.close()
