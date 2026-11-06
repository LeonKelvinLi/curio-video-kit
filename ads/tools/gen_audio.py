"""Generate the music beds and sound effects for the Curio 3D ads with ElevenLabs.
usage: gen_audio.py sfx|music [name ...]   (writes ads/audio/<name>.mp3; skips files that exist)"""
import json, os, re, sys, urllib.request, concurrent.futures as cf
HERE = os.path.dirname(os.path.abspath(__file__)); AUD = os.path.join(HERE, "..", "audio")
def key():
    if os.environ.get("ELEVENLABS_API_KEY"): return os.environ["ELEVENLABS_API_KEY"].strip()
    m = re.search(r"^ELEVENLABS_API_KEY=\"?([^\s\"]+)", open(os.path.join(HERE, "..", "..", ".env")).read(), re.M); return m.group(1)
K = key()
SFX = {
 "whoosh": ("soft airy whoosh transition, short and smooth", 0.8),
 "whoosh_big": ("big cinematic whoosh swoosh past the camera, deep and airy", 1.2),
 "stamp": ("heavy rubber stamp slammed once on paper on a wooden desk, single punchy thud", 0.6),
 "buzz": ("smartphone vibrating on a wooden nightstand, two short buzzes", 1.2),
 "notif": ("soft modern smartphone notification chime, gentle two-note", 0.9),
 "tap": ("crisp soft click of a fingertip tapping a phone glass screen", 0.5),
 "swipe": ("quick soft swipe swoosh, phone UI card swiped away", 0.5),
 "sparkle": ("magical twinkle sparkle chime, whimsical and bright, fairy dust", 1.3),
 "pop": ("cute soft bubble pop, cartoon, single", 0.5),
 "crickets": ("awkward silence with crickets chirping, comedic pause", 2.5),
 "dinner": ("quiet cozy dinner table ambience indoors, soft cutlery on plates, gentle murmur of a few friends talking", 8.0),
 "night": ("quiet bedroom at night room tone, very soft distant city hum, calm", 8.0),
 "dive": ("deep magical whoosh of falling down into a swirling tunnel, rising wind then a soft landing shimmer", 2.6),
 "counter": ("digital counter numbers rolling up quickly with tiny ticks, ending on a soft bright ding", 1.4),
 "ooh": ("small group of three friends at a dinner table go ooh in amazement, soft and natural", 1.6),
 "riser": ("short soft cinematic riser swell, airy shimmer building up", 1.6),
 "earbuds": ("muffled upbeat pop song leaking quietly from someone else's earbuds, tinny, no clear words", 3.0),
 "glitch": ("short soft digital glitch blip, phone screen flicker", 0.5),
 "thud": ("soft deep low boom impact, cinematic hit, short", 0.9),
 "paper": ("thin paper card flipping and fluttering past quickly", 0.6),
}
MUSIC = {
 # lift lands on "Curio fixes that."
 "bed_ad1": [("night", 8200, ["intimate late-night lo-fi", "soft felt piano", "warm tape hiss", "muted sub pad", "sparse, a little wistful"], ["drums", "vocals"]),
             ("lift", 10300, ["warm lift", "gentle brushed lo-fi drum groove 84 BPM", "plucked synth arpeggio", "glockenspiel sparkles", "sense of wonder and curiosity"], ["vocals", "aggressive"]),
             ("resolve", 5500, ["soft resolve", "drums drop out", "sustained warm major chord with piano", "gentle ending"], ["vocals"])],
 "bed_ad2": [("night", 6900, ["intimate late-night lo-fi", "soft felt piano", "warm tape hiss", "muted sub pad", "a little flat and tired"], ["drums", "vocals"]),
             ("lift", 11400, ["warm lift", "gentle brushed lo-fi drum groove 84 BPM", "plucked synth arpeggio", "glockenspiel sparkles", "curious and bright"], ["vocals", "aggressive"]),
             ("resolve", 4000, ["soft resolve", "drums drop out", "sustained warm major chord with piano", "gentle ending"], ["vocals"])],
 "bed_ad3": [("dinner", 7800, ["cozy dinner jazz trio, very quiet", "soft upright bass", "brushed snare", "warm Rhodes", "slightly awkward pause feel"], ["vocals"]),
             ("lift", 12400, ["warm lift", "playful brushed groove 90 BPM", "plucked guitar and glockenspiel", "storytelling wonder"], ["vocals", "aggressive"]),
             ("resolve", 4400, ["warm resolve", "sustained major chord", "gentle Rhodes ending"], ["vocals"])],
}
def post(url, body):
    import time
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"xi-api-key": K, "Content-Type": "application/json"})
            r = urllib.request.urlopen(req, timeout=300); data = r.read()
            if data[:1] == b"{" or len(data) < 2000: raise RuntimeError("not audio: " + data[:200].decode("utf-8", "replace"))
            return data
        except Exception as e:
            msg = getattr(e, "read", lambda: b"")() or str(e).encode()
            if attempt == 5 or b"invalid" in msg: raise RuntimeError(msg[:300])
            time.sleep(8 * (attempt + 1))
def sfx(name):
    out = os.path.join(AUD, name + ".mp3")
    if os.path.exists(out): return name + " exists"
    text, dur = SFX[name]
    open(out, "wb").write(post("https://api.elevenlabs.io/v1/sound-generation", {"text": text, "duration_seconds": dur, "prompt_influence": 0.55}))
    return name + " ok"
def music(name):
    out = os.path.join(AUD, name + ".mp3")
    if os.path.exists(out): return name + " exists"
    plan = {"positive_global_styles": ["instrumental", "lo-fi", "warm", "cinematic app ad underscore"], "negative_global_styles": ["vocals", "singing", "lyrics"],
            "sections": [{"section_name": n, "positive_local_styles": p, "negative_local_styles": neg, "duration_ms": d, "lines": []} for n, d, p, neg in MUSIC[name]]}
    open(out, "wb").write(post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {"composition_plan": plan, "model_id": "music_v1"}))
    return name + " ok"
if __name__ == "__main__":
    kind = sys.argv[1]; names = sys.argv[2:] or list((SFX if kind == "sfx" else MUSIC).keys())
    fn = sfx if kind == "sfx" else music
    with cf.ThreadPoolExecutor(3) as ex:
        for f in cf.as_completed([ex.submit(fn, n) for n in names]):
            try: print(f.result(), flush=True)
            except Exception as e: print("ERR", getattr(e, "read", lambda: b"")()[:300] or e, flush=True)
