"""Render a kit page frame by frame to PNGs, GPU-drawn and split across parallel browser workers.
usage: drive_render.py <page.html> <out_dir> <fps> [--test t1,t2,...] [--sfx] [--workers N] [--cpu]
Writes <out_dir>/f_00000.png ... (same contract as before, so finalize3.sh is unchanged) and, with --sfx, <out_dir>/../sfx.wav.
Tuned 2026-10-20 for the owner's laptop (i9-12900H, 20 threads, RTX 3080 Ti):
  - full Chromium in new-headless mode with ANGLE/D3D11 draws a frame in ~3 ms on the GPU (vs ~36 ms in SwiftShader);
  - the remaining cost is PNG encoding + the DevTools transfer, which is CPU-bound per renderer, so frames are split
    across N worker processes (default 6) that each own a browser;
  - raw RGBA streaming over HTTP/WebSocket was tested and is ~10x slower here (Chromium's outbound data path), so PNG stays.
--cpu falls back to the old software (SwiftShader) headless shell.
Cross-platform: ANGLE uses D3D11 on Windows and Metal on macOS; the default worker count follows the CPU (about a third of the cores, 2-6)."""
import base64, json, multiprocessing as mp, os, pathlib, sys, time
from playwright.sync_api import sync_playwright

ANGLE = {"win32": ["--use-angle=d3d11"], "darwin": ["--use-angle=metal"]}.get(sys.platform, [])
GPU_ARGS = ANGLE + ["--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--enable-accelerated-2d-canvas",
                    "--disable-gpu-vsync", "--disable-frame-rate-limit", "--disable-renderer-backgrounding", "--disable-background-timer-throttling"]
DEFAULT_WORKERS = max(2, min(6, (os.cpu_count() or 6) // 3))

def launch(p, cpu):
    return p.chromium.launch(headless=True, args=["--disable-gpu-vsync"]) if cpu else p.chromium.launch(headless=True, channel="chromium", args=GPU_ARGS)

def open_page(br, page_path):
    pg = br.new_page(viewport={"width": 400, "height": 700}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(pathlib.Path(os.path.abspath(page_path)).as_uri()); pg.wait_for_function("window.frameDataURL && window.fontsReady")
    ok = pg.evaluate("window.fontsReady()")
    return pg, ok, errs

def save_png(path, data_url):
    with open(path, "wb") as f: f.write(base64.b64decode(data_url.split(",", 1)[1]))

def worker(k, page_path, out_dir, fps, frames, cpu, q):
    with sync_playwright() as p:
        br = launch(p, cpu); pg, ok, errs = open_page(br, page_path)
        for i in frames:
            save_png(os.path.join(out_dir, f"f_{i:05d}.png"), pg.evaluate("t => window.frameDataURL(t)", i / fps))
            if k == 0 and i % 60 == 0: q.put(("progress", i))
        br.close()
    q.put(("done", k, ok, errs[:3]))

def main():
    page_path, out_dir, fps = sys.argv[1], sys.argv[2], int(sys.argv[3])
    test = [float(x) for x in sys.argv[sys.argv.index("--test") + 1].split(",")] if "--test" in sys.argv else None
    nw = int(sys.argv[sys.argv.index("--workers") + 1]) if "--workers" in sys.argv else DEFAULT_WORKERS
    cpu, want_sfx = "--cpu" in sys.argv, "--sfx" in sys.argv
    os.makedirs(out_dir, exist_ok=True)
    T = json.load(open(os.path.join(os.path.dirname(os.path.abspath(page_path)), "timing.json")))["T"]
    if test or want_sfx:
        with sync_playwright() as p:
            br = launch(p, cpu); pg, ok, errs = open_page(br, page_path); print("fonts loaded:", ok, flush=True)
            if test:
                for t in test: save_png(os.path.join(out_dir, f"test_{t:05.2f}.png"), pg.evaluate("t => window.frameDataURL(t)", t))
                print("test frames saved", flush=True)
            if want_sfx and not test:
                open(os.path.join(out_dir, "..", "sfx.wav"), "wb").write(base64.b64decode(pg.evaluate("window.renderSfx(48000)")))
            if errs: print("PAGE ERRORS:", errs[:5], flush=True)
            br.close()
        if test: return
    n = round(T * fps); t0 = time.time(); q = mp.Queue()
    chunks = [list(range(k, n, nw)) for k in range(nw)]  # interleaved, so every worker gets a fair mix of heavy and light shots
    procs = [mp.Process(target=worker, args=(k, page_path, out_dir, fps, chunks[k], cpu, q)) for k in range(nw)]
    [p.start() for p in procs]; done = 0; errs = []
    while done < nw:
        m = q.get()
        if m[0] == "progress": print(f"frame {m[1]}/{n}  {time.time() - t0:.0f}s", flush=True)
        else: done += 1; errs += m[3]
    [p.join() for p in procs]
    missing = [i for i in range(n) if not os.path.exists(os.path.join(out_dir, f"f_{i:05d}.png"))]
    if missing: raise SystemExit(f"missing frames: {missing[:10]} ...")
    print(f"frames done: {n} in {time.time() - t0:.0f}s ({n / (time.time() - t0):.1f} fps, {nw} {'CPU' if cpu else 'GPU'} workers)", flush=True)
    if want_sfx: print("sfx.wav written", flush=True)
    if errs: print("PAGE ERRORS:", errs[:5], flush=True)

if __name__ == "__main__":
    main()
