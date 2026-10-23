/* P8 · Rankin's 40-minute fall through a thunderstorm (26 Jul 1959). Facts: Wikipedia "William Rankin" (engine failed at
   47,000 ft; ejected without a pressure suit; still aloft after 10 min, carried by updrafts, hail, lightning; ejected 6:00 pm,
   watch read 6:40 pm in the forest). Plates: Curio illustration (gpt-image-2). Engine: scenes/plates.js. */
window.SPEC = {
  credit: "Curio illustration · story: Wikipedia, \"William Rankin\"",
  nums: [["forty", "40"], ["nineteen fifty-nine", "1959"], ["forty-seven thousand", "47,000"]],
  beats: [
    { img: "a", fy: 0.46, z0: 1.06, z1: 1.24 },
    { img: "b", at: /^In$/, fy: 0.5, z0: 1.05, z1: 1.18 },
    { img: "a", at: /^ejected$/, fy: 0.4, z0: 1.3, z1: 1.45 },
    { img: "c", at: /^Updrafts$/, fy: 0.45, fy1: 0.55, z0: 1.08, z1: 1.2 },
    { img: "d", at: /^When$/, fy: 0.55, z0: 1.12, z1: 1.04 },
  ],
  lightning: [0.2, /^thunderstorm$/, /^lightning/],
  rain: [0, /^In$/], hail: [/^Updrafts$/, /^When$/],
  vapor: [{ at: /^died$/, x: 800, y: 600, dir: -0.4, dur: 1.4 }],
  shakes: [[/^died$/, 10], [/^ejected$/, 16]],
  tags: [{ text: "F-8 CRUSADER · 1959", at: /^In$/, to: /^ejected$/ }, { text: "NO PRESSURE SUIT", at: /^ejected$/, to: /^Updrafts$/, color: "#ffc83d" }],
  counter: { label: "TIME FALLING", at: /^ejected$/, to: null, values: [[/^ejected$/, "0 MIN"], [/^Updrafts$/, "10 MIN"], [/^When$/, "40 MIN"]] },
  stamps: [{ text: "ALIVE", at: /^alive/, y: 800, size: 80 }],
};
