"""Mix an ad's soundtrack from build/<ad>/plan.json: voice segments placed on the edit, music bed ducked under the voice,
sound effects, then two-pass loudnorm to -14 LUFS / -1.5 dBTP. Writes build/<ad>/mix.wav (48 kHz, 24-bit).
usage: mix.py <ad>"""
import json, os, subprocess, sys, numpy as np
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..")); FF = os.path.expanduser("~/.local/bin/ffmpeg"); SR = 48000
def load(path):
    raw = subprocess.run([FF, "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def db(x): return 10 ** (x / 20)
def fade(a, n_in, n_out):
    n_in, n_out = min(n_in, len(a) // 2), min(n_out, len(a) // 2)
    if n_in: a[:n_in] *= np.linspace(0, 1, n_in)[:, None]
    if n_out: a[-n_out:] *= np.linspace(1, 0, n_out)[:, None]
    return a
def place(bus, clip, at, gain=1.0):
    i = int(round(at * SR)); j = min(len(bus), i + len(clip))
    if j > i >= 0: bus[i:j] += clip[: j - i] * gain
def main():
    ad = sys.argv[1]; bdir = os.path.join(ROOT, "build", ad); plan = json.load(open(os.path.join(bdir, "plan.json")))["plan"]
    n = int(plan["T"] * SR) + SR // 10; vo = np.zeros((n, 2), np.float32); mus = np.zeros_like(vo); fx = np.zeros_like(vo)
    cache = {}
    def get(p):
        if p not in cache: cache[p] = load(p)
        return cache[p]
    for v in plan["vo"]:
        src = get(os.path.join(ROOT, v["src"])); a = src[int(v["from"] * SR): int(v["to"] * SR)].copy()
        place(vo, fade(a, int(0.006 * SR), int(0.02 * SR)), v["at"], db(v.get("gain", 0)))
    m = plan["music"]; mclip = get(os.path.join(ROOT, "audio", m["name"] + ".mp3")).copy()
    end = int((plan["T"] - m.get("at", 0)) * SR); mclip = fade(mclip[:end].copy(), int(0.05 * SR), int(0.9 * SR)); place(mus, mclip, m.get("at", 0), db(m.get("gain", -20)))
    for s in plan["sfx"]:
        c = get(os.path.join(ROOT, "audio", s["name"] + ".mp3")).copy()
        if s.get("loop") and s.get("dur"):
            reps = int(np.ceil(s["dur"] * SR / len(c))) + 1; c = np.concatenate([c] * reps)
        if s.get("dur"): c = c[: int(s["dur"] * SR)].copy()
        f = int(s.get("fade", 0.01) * SR); place(fx, fade(c, int(0.004 * SR), f), s["at"], db(s.get("gain", -12)))
    # duck the music under the voice: smoothed voice envelope, up to -6 dB
    env = np.abs(vo).max(1); k = int(0.03 * SR); env = np.convolve(env, np.ones(k) / k, "same")
    act = np.clip(env / 0.05, 0, 1); rel = int(0.25 * SR); sm = np.convolve(act, np.ones(rel) / rel, "same"); sm = np.maximum(sm, act * 0.0)
    duck = 1 - 0.5 * np.clip(sm * 1.4, 0, 1); mus *= duck[:, None]
    mix = vo + mus + fx; mix = mix[: int(plan["T"] * SR)]
    tmp = os.path.join(bdir, "mix_raw.wav")
    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ch_layout", "stereo", "-i", "-", "-c:a", "pcm_f32le", tmp], input=mix.astype(np.float32).tobytes(), check=True)
    r = subprocess.run([FF, "-hide_banner", "-nostats", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(r[r.rindex("{"): r.rindex("}") + 1])
    af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample={SR},aformat=channel_layouts=stereo"
    out = os.path.join(bdir, "mix.wav"); subprocess.run([FF, "-v", "error", "-y", "-i", tmp, "-af", af, "-c:a", "pcm_s24le", out], check=True); os.remove(tmp)
    print("mix ->", out, "input", j["input_i"], "LUFS")
if __name__ == "__main__": main()
