"""ElevenLabs v3 voiceover with word timings, corrected by silence detection.
usage: tts_eleven.py <out_dir> <name> <text_file> [voice_id]
Writes <name>.mp3 (raw take), <name>.wav (trimmed voiceover, 24-bit) and <name>-words.json (word, start, end).

Last-word fix (2026-10-21): eleven_v3 sometimes ends the file while the final word is still sounding (measured on 4 of 6
takes: -21..-30 dB in the last 40 ms, where silence is ~-80 dB), which chops "back!", "glue.", "first.", "fine.".
So a throwaway sentence is appended; the script's real last word is then never the end of the generation, and the take
is cut in the pause before the throwaway word, after the real word has decayed. The cut is checked: if the voice is
still loud at the cut, the script stops with an error instead of shipping a clipped ending."""
import base64, json, os, re, subprocess, sys, urllib.request

out_dir, name, text_file = sys.argv[1], sys.argv[2], sys.argv[3]
voice = sys.argv[4] if len(sys.argv) > 4 else "UBtJzywcDa3wB8w48g0v"  # Zack, the trycurio.app reel voice
TAIL = "\n\n[calm] Okay."
def find_key():
    """ELEVENLABS_API_KEY from the environment, else from .env in the repo root (git-ignored), else the old Windows .env."""
    if os.environ.get("ELEVENLABS_API_KEY"): return os.environ["ELEVENLABS_API_KEY"].strip()
    here = os.path.dirname(os.path.abspath(__file__))
    for p in (os.path.join(here, "..", ".env"), r"D:/CurioLocalVideo/repos/Curio-Video-Automation/.env"):
        if os.path.exists(p):
            m = re.search(r"^ELEVENLABS_API_KEY=\"?([^\s\"]+)", open(p, encoding="utf-8").read(), re.M)
            if m: return m.group(1)
    raise SystemExit("Set ELEVENLABS_API_KEY in your environment or in .env at the repo root (see .env.example).")
key = find_key()
text = open(text_file, encoding="utf-8").read().strip()
n_real = len(re.sub(r"\[[^\]]*\]", "", text).split())
os.makedirs(out_dir, exist_ok=True)
body = json.dumps({"text": text + TAIL, "model_id": "eleven_v3",
                   "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.2, "use_speaker_boost": True}}).encode()
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
    data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
d = json.load(urllib.request.urlopen(req, timeout=180))
mp3 = os.path.join(out_dir, name + ".mp3"); wav = os.path.join(out_dir, name + ".wav")
open(mp3, "wb").write(base64.b64decode(d["audio_base64"]))
a = d.get("normalized_alignment") or d["alignment"]
words, cur, s, e, tag = [], "", None, None, False
for c, a0, a1 in zip(a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]):
    # v3 audio tags ("[curious]") are directions, not speech: drop them from the word list
    if c == "[": tag = True; continue
    if tag:
        if c == "]": tag = False
        continue
    if c.isspace():
        if cur: words.append([cur, s, e]); cur = ""
        continue
    if not cur: s = a0
    cur += c; e = a1
if cur: words.append([cur, s, e])

def silences(path, thr="-38dB", dmin=0.12):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", f"silencedetect=noise={thr}:d={dmin}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", log)
    return list(zip(st, en)), int(m.group(2)) * 60 + float(m.group(3))

# cut the throwaway tail: in the pause between the real last word and the first tail word
if len(words) <= n_real: raise SystemExit(f"{name}: alignment has {len(words)} words, expected more than {n_real} (tail missing)")
last_start, tail_start = words[n_real - 1][1], words[n_real][1]
gaps, _ = silences(mp3, "-45dB", 0.08)
pause = [g for g in gaps if last_start < g[0] < tail_start + 0.05]
cut = min(pause[0][0] + 0.12, pause[0][1]) if pause else (words[n_real - 1][2] + tail_start) / 2
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", mp3, "-af", f"atrim=0:{cut:.3f},afade=t=out:st={max(0, cut - 0.04):.3f}:d=0.04",
                "-c:a", "pcm_s24le", wav], check=True)
# guard: the voice must have decayed before the cut (mean level of the 40 ms before the fade)
chk = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-ss", f"{max(0, cut - 0.08):.3f}", "-t", "0.04", "-i", mp3, "-af", "volumedetect", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
lvl = float(re.search(r"mean_volume: ([-\d.]+) dB", chk).group(1))
if lvl > -38: raise SystemExit(f"{name}: voice still at {lvl} dB at the cut ({cut:.2f}s) - regenerate")
words = words[:n_real]; words[-1][2] = min(words[-1][2], cut)
gaps, dur = silences(wav)
for w in words:  # speech onsets: any word whose aligned start falls inside a silence gets the silence end
    for g0, g1 in gaps:
        if g0 - 0.05 <= w[1] < g1 and w[2] > g1:
            w[1] = round(g1, 3)
json.dump({"duration": round(dur, 3), "silences": gaps, "words": [{"w": w, "s": round(s, 3), "e": round(e, 3)} for w, s, e in words]},
          open(os.path.join(out_dir, name + "-words.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"{name} duration {dur:.2f} s, {len(words)} words, {round(len(words) / dur * 60)} WPM, tail cut at {cut:.2f}s (voice {lvl} dB at cut)")
