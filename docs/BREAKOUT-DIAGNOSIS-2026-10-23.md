# Why Curio stopped breaking out, and what to change (2026-10-23)

Sources (pulled 2026-10-23):
- YouTube owner analytics for @trycurio via vidIQ: 33 Shorts, Jun 1 to Oct 22.
- Public plays for the 12 newest @trycurio.app reels.
- 16 niche outliers from the last 30 days (Instagram + TikTok, 0.5M–9.7M views).
- The baseline research in `GROWTH-PLAN.md` and `JUDGMENT-v3-2026-10-20.md`.

Instagram owner metrics (skip rate, sends) are still unavailable: the Meta token isn't set.

## What the numbers say

| # | Finding | Numbers | Evidence |
|---|---|---|---|
| 1 | **YouTube is where Curio breaks out.** | 4 Shorts reached 10.9K–30K views. Instagram's best is 2.7K. 94% of YouTube views (121.7K) come from the Shorts feed. | owner data |
| 2 | **All four YouTube breakouts were posted in one week.** | Sep 12–19. Since Sep 20, **0 of 11** broke out (1.3K–3.5K). **No uploads since Oct 10.** | owner data |
| 3 | **The format changed on Sep 20.** | Sep 12–19: full-frame 9:16, bright 3D scenes, one big person or animal (4 of 6 broke out). From Sep 22: banded strip, dark flat diagrams and archive clips (0 of 6). | thumbnails, n=12; confounded with time |
| 4 | **The breakouts held viewers past the swipe.** | Engaged/views was 0.43–0.55 for breakouts (mean 0.50) and 0.41–0.47 after Sep 20 (mean 0.44). | owner data, n=12 |
| 5 | **The niche breaks out on full-frame character scenes.** | 0 of 16 outliers are banded; 10 of 16 are 3D animation. Most open on a character in the event, with the **whole premise as text** from frame 0. Lengths run 14–43 s (median ~27 s). Several come from accounts with under 500 followers. | vidIQ outliers, n=16 |
| 6 | **Instagram stays pass/fail at a low ceiling.** | 4 of 12 reels passed ~1.9K plays. P2 (Oct 22) is at 264. P7 was posted Oct 23 with a pre-registered prediction. | public data, n=12 |

## What to change, ranked by evidence × effort

1. **Restart YouTube today, one a day.** Upload P2, P7H and the v4 full-screen P1, P3, P4, P5 and P6.
   It's the only platform where Curio has broken out, and it has been silent for 13 days. Effort: minutes.
2. **Bring back what the breakouts had: full-frame, with one big person or animal in danger, filling the frame at frame 0.**
   The kit's full-screen default already fixes the layout. What's still missing is subject size. P7's opener shows
   the sled at about 1/20 of the frame. The Sep 12–19 3D scenes put the character centre-frame and large.
   **Open question for Leon:** which tool made the Sep 12–19 3D shorts? It isn't in any repo on GitHub.
3. **Show the whole premise at frame 0.** This is the new `hookLine` option in `kit.js` (P7H uses it). The first sentence
   is on screen whole from the first frame, instead of a 3-word fragment like "This man went from".
   Basis: the niche pattern (finding 5) and Curio's own 3-second gate (JUDGMENT-v3: no reel over 41% skip got pushed, n=28).
4. **Test 25–35 s survival stories** (GROWTH-PLAN Test 3). The niche median is ~27 s; Curio sits at 13–16 s.
5. **Keep topics with a body at risk.** Every breakout has one; it's necessary, not sufficient
   (the plane-pickup Short has one and stalled at 2.5K).
6. **Reconnect Meta insights.** Without them, skip rate (the 3-second gate) can't be read on Instagram. This is an owner action.

Causation is not established. Findings 2–3 come from one natural experiment where format and time changed
together. The cleanest test is to post the next YouTube uploads full-frame and character-first, then compare
engaged/views and views at 72 h with the Sep 22+ median (2.4K).
