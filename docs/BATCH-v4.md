# Curio batch v4: optimized from the research (2026-10-20)

Same @trycurio.app look and the same "Zack" voice as v3. This version fixes what the self-judgment (`../curio-ig-batch-2026-10-19-v3/JUDGMENT-2026-10-20.md`) found, as the owner approved. Nothing has been posted.

## What changed from v3

| | v3 | v4 |
|---|---|---|
| P1 Okene | opened on a calm tug | opens **mid-capsize**; punch-ins on key words |
| P2 Miners | animated lamp ring | opens on the **real photo of 33 flags** above the mine (Gobierno de Chile, CC BY 2.0) |
| P3 Molasses | slow push into the 1919 photo | **faster push**; punch-ins |
| P4 | Plane boarding (no body at risk) | **New: Joe Kittinger's jump from 102,800 ft**. Opens on the real US Air Force photo of him stepping off; the glove fails and his hand swells to 2×; a 4:36 free-fall clock |
| P5 Altitude | animated plane; timer under the Instagram caption | opens on **real deployed oxygen masks** (CC BY 4.0); the timer moved into the safe zone; the passenger breathes |
| P6 | Skylab spider (no body at risk) | **New: Ham, the chimp NASA flew before any American astronaut**. Real NASA photos open and close it; the flight path overshoots the plan; splashdown 130 miles off target; the capsule fills with seawater |

All six now:
- open on the event already moving;
- show a visible change at least every 1.5 s (editor-style punch-ins);
- keep key information inside the safe zone.

## Measured on the final files

| | Length | Loudness | Half-seconds with visible change (v3 → v4) | Longest still stretch (v3 → v4) |
|---|---:|---|---|---|
| P1 Okene | 13.0 s | −14.0 LUFS | 96% → 96% | 0.5 s → 0.5 s |
| P2 Miners | 14.9 s | −13.9 LUFS | 73% → 83% | 1.5 s → 1.5 s |
| P3 Molasses | 13.7 s | −13.9 LUFS | 96% → 96% | 0.5 s → 0.5 s |
| P4 Kittinger | 14.2 s | −13.9 LUFS | 47% → 79% (vs boarding) | 2.5 s → 1.0 s |
| P5 Altitude | 15.1 s | −13.9 LUFS | 27% → 53% | 3.0 s → 1.5 s |
| P6 Ham | 13.8 s | −13.8 LUFS | 78% → 93% (vs spider) | 1.5 s → 0.5 s |

"Visible change" means the strip changed by more than 5% (1 − SSIM) over half a second. The film-grain overlay inflates the score slightly in dark scenes, so P1 and P3 were already high in v3.

## The two new scripts (Zack voice)

- **P4:** This man jumped from the edge of space. In nineteen sixty, Joe Kittinger stepped off a balloon nineteen miles up. On the way up, his glove failed, and his right hand swelled to twice its size. He jumped anyway, and fell for over four and a half minutes.
- **P6:** This chimp flew to space before any American astronaut. NASA launched Ham higher and faster than planned. His capsule splashed down a hundred and thirty miles off target, and started filling with seawater. When they opened it, Ham was fine.

Every claim is sourced in `scripts-and-claims-v4.json`. "Before any American astronaut" is an inference from the dates: Ham flew 31 Jan 1961, Shepard on 5 May 1961. The six real photos and their licenses are in `asset-rights-ledger.json`, and you approved those downloads in chat.

## Honest scores

| | v3 | v4 | Why |
|---|---:|---:|---|
| P1 Okene | 7 | 7 | Now opens on the capsize, but there's still no real footage |
| P2 Miners | 6 | 6.5 | Real opener; the drilling middle is still dark |
| P3 Molasses | 7.5 | 7.5 | Already the closest to what worked |
| P4 Kittinger | 4.5 (boarding) | **7.5** | Body at risk, an iconic real photo, and a visual you can repeat (the hand at twice its size) |
| P5 Altitude | 6 | 7 | Real opener, motion throughout, safe-zone fix |
| P6 Ham | 5 (spider) | **7** | Body at risk, real photos at both ends; the middle is a diagram |

These scores are inference. The real test is still Instagram plays at 72 hours (amendment A2/A4 in `../curio-layout-ab-plan-2026-10-19/`).

## Still open (your call)

- **Layout:** the square strip is kept on your instruction. Your data suggests full-frame lifts strong premises.
- **AI label:** Instagram's Help Center lists a realistic AI voiceover as content to label "AI info".
