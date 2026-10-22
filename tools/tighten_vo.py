"""Cap long pauses in a voiceover without touching the speech.
usage: tighten_vo.py <vo_dir> <name> [cap_seconds=0.30] [lead_in=0.10]
Reads <name>.mp3 + <name>-words.json, writes <name>-tight.wav (48 kHz) and <name>-tight-words.json
with every word time shifted onto the tightened timeline (plus lead_in)."""
import json, os, subprocess, sys

vo, name = sys.argv[1], sys.argv[2]
cap = float(sys.argv[3]) if len(sys.argv) > 3 else 0.30
lead = float(sys.argv[4]) if len(sys.argv) > 4 else 0.10
d = json.load(open(os.path.join(vo, name + "-words.json"), encoding="utf-8"))
dur = d["duration"]
# keep-segments: speech plus cap/2 of silence on each side of every long pause
cuts = []  # (cut_start, cut_end) removed intervals
for g0, g1 in d["silences"]:
    if g0 <= 0.02:  # leading silence: trim to lead-in handled by adelay
        cuts.append((0.0, max(0.0, g1 - 0.03)))
        continue
    if g1 >= dur - 0.02:  # trailing silence
        cuts.append((g0 + 0.15, dur))
        continue
    if g1 - g0 > cap:
        cuts.append((g0 + cap / 2, g1 - cap / 2))
keep, t = [], 0.0
for c0, c1 in cuts:
    if c0 > t: keep.append((t, c0))
    t = max(t, c1)
if t < dur: keep.append((t, dur))
def shift(x):
    removed = sum(min(c1, x) - c0 for c0, c1 in cuts if c0 < x)
    return x - removed + lead
fade = 0.01
parts, labels = [], []
for i, (a, b) in enumerate(keep):
    parts.append(f"[0:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={max(0,b-a-fade):.4f}:d={fade}[s{i}]")
    labels.append(f"[s{i}]")
fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(keep)}:v=0:a=1,aresample=48000,adelay={int(lead*1000)}:all=1[out]"
out = os.path.join(vo, name + "-tight.wav")
src = os.path.join(vo, name + ".wav") if os.path.exists(os.path.join(vo, name + ".wav")) else os.path.join(vo, name + ".mp3")  # trimmed take from tts_eleven.py
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src,
                "-filter_complex", fc, "-map", "[out]", "-c:a", "pcm_s24le", out], check=True)
words = [{"w": w["w"], "s": round(shift(w["s"]), 3), "e": round(shift(w["e"]), 3)} for w in d["words"]]
newdur = sum(b - a for a, b in keep) + lead
json.dump({"duration": round(newdur, 3), "words": words}, open(os.path.join(vo, name + "-tight-words.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"{name}: {dur:.2f}s -> {newdur:.2f}s ({len(words)} words, {len(words)/newdur*60:.0f} WPM)")
