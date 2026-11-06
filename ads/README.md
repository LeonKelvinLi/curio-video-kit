# Curio 3D app ads

Toy-world 3D app ads for Curio, in the "relatable habit, then the app fixes it" format (reference: a Renno
reel, 2026-11-05). Everything is drawn in code: three.js runs on the Mac's GPU inside headless Chromium.
The phone screens show the real Curio app, from the screen recordings in
`curio/marketing/product-clips` and the App Store plates in `curio/media/appstore-1.0.15-2026-10-25`.

| ID | File | Hook | Length |
|---|---|---|---|
| ad1 | `out/curio-ad-two-hours.mp4` | You still know every word of a 2009 song; last night's two-hour scroll left nothing | 24.2 s |
| ad2 | `out/curio-ad-screen-time.mp4` | Every Sunday the phone reports 4 hours a day, and nothing to show for it | 22.7 s |
| ad3 | `out/curio-ad-dinner.mp4` | "Learn anything cool lately?" 300 videos this week, nothing to say | 24.8 s |

Each one also gets a `-upload.mp4` copy (about 6 Mbps, under 20 MB) and a 2 fps contact sheet.

## Make

```bash
npm install                      # three.js 0.169 (one time)
tools/make.sh ad1 curio-ad-two-hours        # render (resumes), mix, encode
.venv python tools/render.py ad2 --test 3.5,11 --samples 6 --scale 0.5   # quick stills in build/ad2/test
```

The Python is the kit's `.venv` (Playwright + Chromium). Rendering runs at about 6 to 12 frames/s with 3 workers.

## How it works

- `engine/engine.js`: every frame averages 8 sub-renders with Halton-jittered shutter time, lens position,
  pixel offset and area-light position. That gives real motion blur, depth of field, anti-aliasing and
  soft shadows. Then bloom, the Khronos neutral tone map (keeps the app UI's colours true), grain and
  vignette, then the 2D layer. Each frame is a pure function of time, so any frame can be rendered alone.
- `engine/toys.js`: vinyl figures with a joint rig and an expressive face, the Curio rabbit in 3D, the phone,
  and floating app cards. `engine/sets.js`: bedroom, dining room (night/morning), the rabbit-hole tunnel, the seabed.
- `engine/ui.js`: kinetic captions keyed to the voice's word timings (Fraunces, Curio's own font), chips,
  ink stamps, speech bubbles, the end card. `engine/common.js`: the generic doomscroll feed, poses and the sparkle burst.
- `scenes/adN.js`: one file per ad. It holds the edit (where each voice line sits), shots, camera, overlay and the sound cue sheet.
- `tools/gen_audio.py`: ElevenLabs music beds (composition plans, so the lift lands on "Curio fixes that")
  and sound effects. `tools/mix.py`: places the voice, ducks the music under it, adds the effects, then loudnorm to −14 LUFS / −1.5 dBTP.

## Gotchas found while building it

- three.js lights use physical units: artist intensities are multiplied by `LI` (π) in `toys.js`.
- `renderer.autoClear` must stay off, or every accumulation pass wipes the buffer and adds the clear colour as haze.
- `parent.add(mesh).rotation.x = …` rotates the parent (add returns the parent): use `put(parent, mesh)`.
- Several Chromium workers that start at once stall on macOS; `render.py` staggers them 6 s apart and re-renders any missing frames.
- The phone is held with `rotation.set(50°, 180°, 0)`, so the screen faces the face with its top away from the holder.
