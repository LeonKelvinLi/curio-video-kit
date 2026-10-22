# Curio layout A/B test plan — next 6 posts (2026-10-19)

Decision this answers: should every Curio Short/Reel move from the banded layout to full-screen + HUD? Evidence for running it: `../curio-breakout-analysis-2026-10-19/` (4 of 9 full-screen Shorts broke out; 0 of 8 banded). This plan is pre-registered: the rule below is fixed before any post goes up.

Nothing in this plan publishes anything by itself. Every upload is the account owner's action.

## 1. Schedule

All times 19:00 Pacific (02:00 UTC the next day), matching the upload hour of the September breakouts. The same file goes to YouTube Shorts, Instagram Reels and Facebook Reels in the same hour.

| Slot | Date (PT) | Topic | Arm | Script source |
|---|---|---|---|---|
| W1 | Tue Oct 20 | Jetpack mountain rescue drill (already on IG Oct 19) | banded, warm-up | existing file |
| W2 | Wed Oct 21 | Self-balancing cube (already on IG Oct 12) | banded, warm-up | existing file |
| **P1** | **Thu Oct 22** | **Okene's air pocket** | **FULL + HUD** | this plan, section 3 |
| P2 | Fri Oct 23 | Chilean miners' note (7/10) | BANDED | `../curio-ab-scripts-2026-10-19/` §4 |
| P3 | Sat Oct 24 | Boston molasses flood (7/10) | BANDED | §5 |
| P4 | Sun Oct 25 | Fastest plane boarding (6.5/10) | FULL + HUD | §6 |
| P5 | Mon Oct 26 | Seconds of useful consciousness (7/10) | FULL + HUD | §8 (arm swapped, see amendment) |
| P6 | Tue Oct 27 | NASA's spider in space (5/10) | BANDED | §7 (arm swapped, see amendment) |

- **Warm-ups (W1, W2):** YouTube has had no upload since Oct 9. Two existing banded reels go to YouTube only, to restart cadence before P1. They are not part of the test, but they do add two more banded data points. Do not re-upload them to Instagram.
- **Order A-B-B-A-A-B:** each arm gets an early, a middle and a late slot, so a channel warming up (or cooling down) over the week doesn't favour one arm.
- P2–P6 scripts come from the parallel session "Fact-check and script 6 topics for layout A/B test", now briefed for 5 topics in these fixed slots.

### Amendment A1 (2026-10-19, before any test post)

The seeded coin flips in the scripts package put the lower-scored scripts in the FULL arm in every pair (FULL 5.8 vs BANDED 7.0 mean script score), which would tilt the test against full screen. The you-vs-record pair is swapped: Seconds of useful consciousness moves to FULL (P5), NASA's spider moves to BANDED (P6). Result: FULL P4–P5 mean 6.75 (plus unscored Okene) vs BANDED P2, P3, P6 mean 6.33. Siffre stays the verified FULL spare. All six videos use the same narrator (ElevenLabs v3, voice "Mark"), the same art quality and the same sound design; the banded videos put the same animation into the current banded layout, so the frame is the main difference (the HUD travels with the full-screen arm as part of the bundle).

### Amendment A2 (2026-10-19, owner instruction, before any post): same style, only the animation changes

The owner asked for every video to keep the exact current @trycurio.app reel style, with only the animations improved, "to see what we learnt and what we didn't". Test A (layout) is deferred. All six posts (P1–P6, same topics and dates) now use the current template, measured from the Oct 19 jetpack reel: a square footage strip at 24–81% of frame height, blurred-footage bands, 2–4-word captions with one yellow key word swapping on speech, a per-segment credit line, one young American male narrator (ElevenLabs "Mark"), a quiet ambient bed about 20 dB under the voice with diegetic sound only, and a hard stop on the last syllable. What changes is the animation inside the strip: continuous camera moves, x-ray cutaways, burned-in data cards, kinetic counters, and the payoff beat. Videos: `../curio-ig-batch-2026-10-19-v2/`. The earlier full-screen/banded masters in `../curio-ig-batch-2026-10-19/` are kept for the deferred Test A.

**Baseline (public data, accessed 2026-10-19):** the last 12 @trycurio.app reels (Sep 29–Oct 19) had plays of 133–2,692, median 245, with 4 of 12 above 1,900; likes per 100 plays median 0.37; 1 comment in total. YouTube banded Shorts (Sep 21–Oct 9) had a median of 2,304 views.
**Read at 72 h per post:** Instagram plays, likes per 100 plays, comments; YouTube views.
**Pre-registered call:** the animation upgrade helped if at least 3 of the 6 posts pass 1,941 plays at 72 h (the baseline's 4th-best), or the 6-post median is at least double the baseline median (490+). Otherwise it did not move distribution, and the next lever is format (Test A).
**Known differences besides animation (stated, not hidden):** the strip is mostly animation where the baseline used mostly real footage (only rights-clear footage is used; P3 opens on a public-domain 1919 photo); topics differ; the scripts run 15–19 s against the baseline's 11–15 s.

### Amendment A3 (2026-10-19, owner feedback, before any post): v3 replaces v2 — trycurio voice and script formula

The owner found v2 hard to understand and asked for better, more interesting scripts in the same voice as the trycurio.app reels. The account's ElevenLabs history shows that voice is **"Zack"** (UBtJzywcDa3wB8w48g0v, eleven_v3, stability 0.5, about 980 generations Jul 9 – Oct 12), not "Mark". v3 changes three things, all toward the baseline reels: (1) the Zack voice; (2) scripts rewritten in the reels' formula ("This ___ did ___", one plain mechanism, a surprise at the end, 42–49 words, 13–16 s, the question moved to the caption); (3) at most one data tag on screen. Topics, dates, template and decision rule are unchanged. Videos: `../curio-ig-batch-2026-10-19-v3/` (v2 is kept, unposted). Effect on the test: the voice and script length now match the baseline (11–15 s), so the animation is a cleaner single variable than in v2. The footage-to-animation ratio is still the known difference.

## 2. Pre-registered decision rule

- **Primary metric:** YouTube public view count 72 hours after upload.
- **Adopt full screen + HUD** if at least 2 of the 3 FULL posts beat the best BANDED post at 72 h.
- **Adopt immediately** if any FULL post passes 10,000 views at 7 days while every BANDED post stays under 3,500.
- **Inconclusive** (neither condition met): run four more posts, two per arm, under the same rule.
- **Secondary (recorded, not deciding):** engaged-view share, average % viewed, YouTube Studio "viewed vs. swiped away", Instagram plays and likes per 100 plays, comments per 1,000 plays.
- **Read dates:** 72 h read for P6 is Fri Oct 30, 7-day read Tue Nov 3.


### Amendment A4 (2026-10-20, owner go-ahead, before any post): v4 replaces v3 — optimizations from the self-judgment

The 2026-10-20 self-judgment (`../curio-ig-batch-2026-10-19-v3/JUDGMENT-2026-10-20.md`) found that the levers behind your pushes were a premise with a body at risk, a frame 0 that already shows the event, and ~2 s of real footage before animation. The owner approved fixing all six while keeping the trycurio style. Changes:
- **Topics:** P4 boarding and P6 Skylab spider had no body at risk, so they are replaced by **Kittinger's 1960 jump from 102,800 ft** (P4) and **Ham, the chimp NASA launched before any American astronaut** (P6).
- **Real openers:** rights-clear photos open P2 (33 flags, CC BY 2.0), P4 (USAF, public domain), P5 (deployed masks, CC BY 4.0) and P6 (NASA, public domain). P3 keeps its 1919 photo. P1 has no rights-clear footage and now starts mid-capsize.
- **Motion and safe zone:** editor-style punch-ins on key words give a visible change every ~1.5–2 s. P5's timer moved inside the safe zone (above y≈1248).
- **Unchanged:** Zack voice, template, dates and decision rule.

Videos: `../curio-ig-batch-2026-10-19-v4/`; v3 is kept, unposted.

### Held constant across arms

1. The same script structure: 13–16 s, hook caption, answerable question at the end, 175–195 WPM.
2. The same voice and loudness: −14 LUFS integrated, each line within 1 LU of the next.
3. The same Instagram caption template, ending in a question (not the app plug).
4. Native 1080×1920 upload, no letterbox bars from the export itself, no re-uploads.
5. After every YouTube upload, check that `youtube.com/shorts/<id>` returns 200 (the Aug 29 upload went out as long-form).
6. No other YouTube upload between test posts.

### Quality risk

The FULL arm has to match the production quality of the September breakouts (Blender low-poly 3D). If it looks cheaper, the test measures art quality instead of layout. If the daily pipeline cannot reach that bar by Oct 21, move P1 back a day rather than ship a weaker FULL post.

## 3. P1 production brief — Okene, full screen + HUD

Facts are verified in `../curio-breakout-analysis-2026-10-19/breakout-metrics-ledger-2026-10-19.json` (`prototype_okene_facts`). Motion reference: the right-hand phone at https://claude.ai/artifact/Mya37hSstMB3DceuNAncDe.

**Runtime 16.0 s · 1080×1920 · 30 fps · H.264 · one narrator, 47 words (176 WPM)**

| Time | Voice / caption (top third, word by word) | Picture (full-frame 3D) | HUD | Sound |
|---|---|---|---|---|
| 0.0–2.3 | "This tugboat flipped and sank." | Night sea, tug riding a swell, lit wheelhouse; rolls over at 0.45–1.25 s and drops | context pill from 0.25 s "JASCON-4 · GULF OF GUINEA · 26 MAY 2013"; depth gauge from 0.55 s counting 0→30 m | swell whoosh, hull creak, impact boom at 1.0 s, bubbles |
| 2.4–4.3 | "The cook found a pocket of air." | Lands upside-down at 2.7 s (silt burst, short shake). Hull goes x-ray 2.85–3.35 s; camera pushes into the cabin | name tag "HARRISON OKENE · SHIP'S COOK" 2.95–4.4 s; callout "AIR POCKET ≈ 1.2 m" with bracket at 3.4 s | thud at 2.7 s; ping at 3.4 s |
| 4.4–7.0 | "He breathed it for 60 hours." | Slow drift on the cook in the air band; water light cycles night→day→night | "HOURS TRAPPED" odometer 0→60 from 4.6–6.9 s; date chip 26→27→28 MAY with sun/moon; counter locks amber at 7.0 s | a tick on every hour; chime at each day flip; lock tone |
| 7.1–9.0 | "Divers came to recover bodies." | Pull back; diver descends on an umbilical; scene darkens; lamp beam searches | depth gauge off | sonar ping |
| 9.1–11.4 | "One reached for a hand… and it grabbed back." | Lamp finds a hand coming out of the passage; the diver's glove reaches; at 10.3 s the hand closes on the glove | — | heartbeat ×2; at 10.3 s impact + sub drop, 2-frame flash, short shake, "back." slams in orange |
| 11.55–14.15 | "He still needed 2.5 days to decompress." | Bell rising on its cable, camera tracking | "DECOMPRESSION" bar 0→2.5 DAYS; depth gauge returns, counting up toward the surface | soft bell tone |
| 14.25–16.0 | "Would you have waited, or swum for it?" | Night surface, matched to frame zero | question card + WAIT / SWIM chips at 15.55 s | two-note chime; whoosh into the loop |

- **Footnote throughout (bottom left, above the platform UI):** "Illustration · not to scale · Wikipedia; ABC News, Dec 2013".
- **Real footage:** the 2013 diver helmet-cam shot of the hand would be the strongest 1-second proof insert at 10.3 s. Use it only with written permission from the rights holder. Without permission, ship with no real footage.
- **Instagram caption:** "He breathed a 1.2 m pocket of air, 30 m down, for 60 hours. Then a diver reached for what he thought was a body. Would you have waited, or swum for it? 👇" with sources in the first comment.
- **Before posting (Rule 187 self-check):** ffmpeg loudness per line, measured WPM, a 2 fps contact sheet, the text-collision check, and a blunt score with reasons in `P1-okene-qa.md`.

## 4. Capture protocol

| When | What | Who |
|---|---|---|
| T+24 h | YouTube public views (vidIQ `get_videos_by_ids`); Instagram public plays and likes | Claude can pull these |
| T+72 h | The same, plus YouTube Analytics engaged views, avg % viewed, likes, shares, subscribers (Analytics lags about 48 h) | Claude |
| T+72 h | Studio "viewed vs. swiped away" screenshot | account owner |
| T+7 d | Retention curve (audienceWatchRatio) and relative retention | Claude |
| any | Facebook views and Instagram reach/shares | blocked until the Meta token is refreshed |

Results go into `ab-test-plan.json` → `results`, with every number labeled by its evidence class.
