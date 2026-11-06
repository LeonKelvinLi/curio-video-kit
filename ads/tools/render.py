"""Render a Curio 3D ad: headless Chromium on the GPU (ANGLE/Metal), frames split across parallel browser workers.
usage:
  render.py <ad> --test t1,t2,... [--samples N] [--scale S]     -> build/<ad>/test/t_XX.XX.png
  render.py <ad> [--samples N] [--workers K] [--from F --to F]  -> build/<ad>/frames/f_00000.png + build/<ad>/plan.json
Serves the ads/ folder over a local HTTP server so ES modules and textures load without file:// restrictions."""
import base64, functools, http.server, json, multiprocessing as mp, os, sys, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
GPU = ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--disable-gpu-vsync",
       "--disable-frame-rate-limit", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--force-color-profile=srgb"]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def end_headers(self): self.send_header("Cache-Control", "no-store"); super().end_headers()

def serve():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start(); return srv

def arg(name, default=None, cast=str):
    return cast(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default

def open_page(p, port, ad, samples, scale):
    br = p.chromium.launch(headless=True, channel="chromium", args=GPU)
    pg = br.new_page(viewport={"width": 540, "height": 960}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
    pg.goto(f"http://127.0.0.1:{port}/engine/index.html?ad={ad}&samples={samples}&scale={scale}")
    try: pg.wait_for_function("window.engineReady === true", timeout=150000)
    except Exception: print("PAGE ERRORS:", errs[:8], flush=True); raise
    return br, pg, errs

def save(path, url):
    with open(path, "wb") as f: f.write(base64.b64decode(url.split(",", 1)[1]))

def worker(k, port, ad, samples, scale, frames, fps, out, q):
    time.sleep(k * 6)  # stagger start-up: simultaneous page setups stall the GPU on macOS
    try:
        with sync_playwright() as p:
            br, pg, errs = open_page(p, port, ad, samples, scale)
            for i in frames:
                fp = os.path.join(out, f"f_{i:05d}.png")
                if os.path.exists(fp) and os.path.getsize(fp) > 1000: continue
                save(fp + ".tmp", pg.evaluate("([t]) => window.frameDataURL(t)", [i / fps])); os.replace(fp + ".tmp", fp)
                q.put(("f", k))
            if errs: q.put(("err", k, errs[:5]))
            br.close()
    except Exception as e:
        q.put(("err", k, [repr(e)[:300]]))
    finally:
        q.put(("done", k))

def main():
    ad = sys.argv[1]; samples = arg("--samples", 8, int); scale = arg("--scale", 1.0, float)
    srv = serve(); port = srv.server_address[1]
    bdir = os.path.join(ROOT, "build", ad); os.makedirs(bdir, exist_ok=True)
    test = arg("--test")
    if test:
        tdir = os.path.join(bdir, "test"); os.makedirs(tdir, exist_ok=True)
        with sync_playwright() as p:
            br, pg, errs = open_page(p, port, ad, samples, scale)
            for t in [float(x) for x in test.split(",")]:
                t0 = time.time(); save(os.path.join(tdir, f"t_{t:05.2f}.png"), pg.evaluate("([t]) => window.frameDataURL(t)", [t]))
                print(f"t={t:.2f} {time.time() - t0:.2f}s", flush=True)
            if errs: print("PAGE ERRORS:", errs[:8], flush=True)
            br.close()
        return
    with sync_playwright() as p:
        br, pg, errs = open_page(p, port, ad, 1, 0.25); info = pg.evaluate("window.AD_INFO"); br.close()
    json.dump(info, open(os.path.join(bdir, "plan.json"), "w"), indent=1)
    fps = info["fps"]; n = round(info["T"] * fps); f0 = arg("--from", 0, int); f1 = arg("--to", n, int)
    out = os.path.join(bdir, "frames"); os.makedirs(out, exist_ok=True)
    nw = arg("--workers", 6, int); frames = list(range(f0, f1)); chunks = [frames[k::nw] for k in range(nw)]
    q = mp.Queue(); procs = [mp.Process(target=worker, args=(k, port, ad, samples, scale, chunks[k], fps, out, q)) for k in range(nw)]
    t0 = time.time(); [pr.start() for pr in procs]; done, cnt = 0, 0
    while done < nw:
        m = q.get()
        if m[0] == "f":
            cnt += 1
            if cnt % 30 == 0: el = time.time() - t0; print(f"{cnt}/{len(frames)} frames, {cnt / el:.2f} fps, eta {(len(frames) - cnt) / (cnt / el):.0f}s", flush=True)
        elif m[0] == "err": print("worker", m[1], "errors:", m[2], flush=True)
        else: done += 1
    [pr.join() for pr in procs]
    missing = [i for i in frames if not (os.path.exists(os.path.join(out, f"f_{i:05d}.png")) and os.path.getsize(os.path.join(out, f"f_{i:05d}.png")) > 1000)]
    if missing:
        print(f"{len(missing)} frames missing, rendering them in one worker", flush=True)
        q2 = mp.Queue(); pr = mp.Process(target=worker, args=(0, port, ad, samples, scale, missing, fps, out, q2)); pr.start(); pr.join()
    left = [i for i in frames if not os.path.exists(os.path.join(out, f"f_{i:05d}.png"))]
    print(f"rendered in {time.time() - t0:.0f}s -> {out}; missing {len(left)}", flush=True)
    if left: sys.exit(1)

if __name__ == "__main__":
    main()
