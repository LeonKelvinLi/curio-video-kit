/* P9 · Jim LeBlanc's vacuum-chamber accident (14 Dec 1966, NASA Houston). Facts: Guinness World Records "Highest equivalent
   altitude exposure survived" (hose came loose, ~120,000 ft equivalent; remembered saliva boiling on his tongue; chamber
   repressurised in 87 s; no lasting effects). Plates: Curio illustration (gpt-image-2). Engine: scenes/plates.js. */
window.SPEC = {
  credit: "Curio illustration · story: Guinness World Records, NASA",
  nums: [["nineteen sixty-six", "1966"], ["eighty-seven", "87"]],
  beats: [
    { img: "a", fy: 0.42, z0: 1.08, z1: 1.26 },
    { img: "b", at: /^In$/, fy: 0.5, z0: 1.04, z1: 1.16 },
    { img: "a", at: /^hose$/, fy: 0.36, z0: 1.35, z1: 1.5 },
    { img: "c", at: /^Within$/, fy: 0.55, z0: 1.05, z1: 1.2 },
    { img: "d", at: /^They$/, fy: 0.52, z0: 1.14, z1: 1.04 },
  ],
  vapor: [{ at: 0.1, x: 640, y: 300, dir: -0.6, dur: 1.8 }, { at: /^hose$/, x: 600, y: 330, dir: -0.6, dur: 1.6 }],
  shakes: [[/^hose$/, 12], [/^passed$/, 6]],
  tags: [{ text: "NASA · HOUSTON · 1966", at: /^In$/, to: /^hose$/ }, { text: "LIKE 120,000 FT UP", at: /^loose/, to: /^They$/, color: "#ffc83d" }],
  counter: { label: "AIR BACK IN", at: /^They$/, to: null, values: [[/^They$/, "…"], [/^eighty-seven$/, "87 SEC"]] },
  stamps: [{ text: "WOKE UP FINE", at: /^woke$/, y: 800, size: 72 }],
};
