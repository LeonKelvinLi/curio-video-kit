/* DK footage-first · arm B (escalating mystery). Charlie Duke's family photo on the Moon, Apollo 16, April 1972, frame AS16-117-18841.
   Facts: assets/src/dukephoto/facts.json. Sources quote the note on the back two ways; only the shared opening is used. No diagram:
   NASA's two scans of the one frame carry it. */
window.SPEC = {
  credit: "NASA · public domain",
  beats: [
    { kind: "photo", src: "close", pw: 1000, z0: 1.0, z1: 1.08, label: "REAL NASA PHOTO · APOLLO 16" },
    { kind: "photo", src: "wide", at: /^It's$/, pw: 1000, maxH: 1000, z0: 1.0, z1: 1.05, label: "SAME FRAME · FULL SCAN" },
    { kind: "photo", src: "close", at: /^The$/, pw: 1000, iz: 1.6, fx: 0.56, fy: 0.5, z0: 1.0, z1: 1.08, label: "NOTE ON THE BACK" },
    { kind: "photo", src: "wide", at: /^Charlie$/, pw: 1000, maxH: 1000, z0: 1.12, z1: 1.0, label: "DESCARTES HIGHLANDS · APRIL 1972" },
  ],
  nums: [["nineteen seventy-two", "1972"]],
  marks: [{ at: /^still/, to: /^The$/, ix: 0.47, iy: 0.53, r: 90, text: "STILL THERE", side: "right" }],
  tags: [{ text: "\"FROM PLANET EARTH\"", at: /^Planet/, to: /^Charlie$/, y: 1570, color: "#ffc83d" }],
};
