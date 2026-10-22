# curio-video-kit

Code-drawn, narrated 9:16 shorts for Curio (@trycurio.app). Everything that makes a video is in this repo: the canvas animation kit, one scene per video, the finished ElevenLabs voiceovers (voice "Zack"), the rights-clear photos, and the mixing and encoding steps. Rendering the six current videos needs **no API key**.

| ID | Video | Opens on |
|---|---|---|
| P1 | Okene air pocket | the tug mid-capsize |
| P2 | Chilean miners | real photo: the 33 flags (Gobierno de Chile, CC BY 2.0) |
| P3 | Boston molasses flood | real 1919 photo (public domain) |
| P4 | Kittinger's jump from 102,800 ft | real U.S. Air Force photo (public domain) |
| P5 | Oxygen at altitude | real deployed oxygen masks (CC BY 4.0) |
| P6 | Ham, the space chimp | real NASA photos (public domain) |

## Setup on a Mac (one time)

1. Install [Homebrew](https://brew.sh), then:
   ```bash
   brew install ffmpeg python git
   ```
2. Get the code:
   ```bash
   git clone https://github.com/Noctilucenty/curio-video-kit.git
   cd curio-video-kit
   ```
3. Create the Python environment:
   ```bash
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   python -m playwright install chromium
   ```

Each time you open a new terminal, run `source .venv/bin/activate` in the folder first.

## Render

```bash
python render.py P4                     # one video, full-screen 9:16, final quality
python render.py all                    # all six
python render.py P4 --layout banded     # the old square-strip trycurio.app template
python render.py P4 --enc videotoolbox  # fast draft using the Mac's hardware encoder
```

Output goes to `out/<ID>/`:
- the MP4 (1080×1920, 60 fps, H.264, AAC, −14 LUFS);
- the cover image and a 2 fps contact sheet;
- the 24-bit mix;
- a QA file with loudness and stream info.

`out/` and `build/` are git-ignored.

**If drawing fails on your Mac**, add `--cpu` to use software rendering. It's slower but works everywhere. You can also set `--workers N`; by default it uses about a third of your CPU cores, at most 6.

## Make a new voiceover (needs a key)

```bash
cp .env.example .env        # paste ELEVENLABS_API_KEY into .env (never committed)
python tools/tts_eleven.py vo p7 vo/p7.txt          # voice Zack, eleven_v3; writes vo/p7.wav + vo/p7-words.json
python tools/tighten_vo.py vo p7 0.45 0.10          # caps pauses at 0.45 s -> vo/p7-tight.wav
```

The script text supports v3 mood tags such as `[curious]` and `[surprised]`, which aren't spoken. Then:
1. write `scenes/p7.js` (copy a scene; beats are keyed to spoken words with `K.ix(WORDS, /^word$/)`);
2. add P7 to `videos.json`;
3. run `python render.py P7`.

## What's inside

| Path | What it is |
|---|---|
| `kit/kit.js` | Canvas engine:<br>• captions built from word timings (`K.autoLines`)<br>• punch-in zooms (`V.punch`)<br>• HUD tags<br>• sound design<br>• banded or full-screen compositor (`window.LAYOUT`) |
| `kit/make_page.py` | Builds one self-contained HTML page (kit + scene + words + photos). `layout=full` gives full-screen output. |
| `kit/finalize3.sh` | Mixes the voice with the bed 20 dB under it, two-pass loudnorm to −14 LUFS / −1.5 dBTP, encodes, and writes the QA file, contact sheet and cover. |
| `tools/drive_render.py` | Headless Chromium draws on the GPU (ANGLE: Metal on Mac, D3D11 on Windows), split across parallel workers. Outputs PNG frames and the sound-effects WAV. |
| `tools/tts_eleven.py` | ElevenLabs v3 with word timestamps. It appends a throwaway sentence and trims it, because v3 sometimes cuts off the final word; a guard refuses any clipped take. |
| `tools/tighten_vo.py` | Caps long pauses without stretching the speech, and shifts the word timings to match. |
| `scenes/` | One file per video (P1 = Okene engine + scene). `archive/` holds the retired boarding and spider scenes. |
| `vo/` | Script text, raw take, trimmed take and pause-capped take, with word timings, for each video. |
| `assets/` | Photos. Licenses and credits are in `docs/ledgers/asset-rights-ledger.json`. |
| `docs/` | Growth plan, self-judgment, layout-test how-to, A/B plan, captions and the Rule 187 evidence ledgers. |

## Notes

- **Speed** (measured on Windows; RTX 3080 Ti, 20 threads): about 35–60 s to draw a video with 6 GPU workers, plus about 20 s to master. A Mac will differ.
- **Quality rule:** final masters use x264 slow, CRF 14. `--enc videotoolbox` and `--enc nvenc` are for drafts.
- **Fonts** load from Google Fonts, so the first render needs internet.
- **Nothing in this repo posts anywhere.** Uploading to Instagram, YouTube or Facebook is done by hand.
