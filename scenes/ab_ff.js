/* AB footage-first · arm A (visual-first). The wood ants of the Templewo bunker, Poland (Rutkowski et al. 2019, J. Hymenoptera Research
   72, CC BY 4.0, photos Wojciech Stephan). Facts: assets/src/antbunker/facts.json. "Close to a million" and cannibalism are the
   authors' estimate and inference. No diagram: the paper's own photos carry the story beat by beat. */
window.SPEC = {
  credit: "W. Stephan · Rutkowski et al. 2019 · CC BY 4.0",
  beats: [
    { kind: "photo", src: "mound", fit: "cover", fx: 0.5, fy: 0.55, z0: 1.05, z1: 1.2, label: "REAL PHOTO · THE BUNKER, 2016" },
    { kind: "photo", src: "wall", at: /^With$/, pw: 800, maxH: 1060, z0: 1.0, z1: 1.06, label: "INSIDE · SOVIET BUNKER, POLAND" },
    { kind: "photo", src: "mound", at: /^they$/, pw: 1000, iz: 1.3, z0: 1.0, z1: 1.08, label: "2 MILLION DEAD, 93% BITTEN" },
    { kind: "photo", src: "walk", at: /^So$/, pw: 800, maxH: 1060, z0: 1.0, z1: 1.06, label: "THE WALKWAY, SEPT 2016" },
    { kind: "photo", src: "empty", at: /^the$/, pw: 1000, z0: 1.0, z1: 1.06, label: "THE SAME FLOOR, WINTER" },
  ],
  marks: [{ at: /^wooden/, to: [/^and$/, 1], ix: 0.52, iy: 0.45, r: 120, text: "WAY OUT", side: "right" }],
  stamps: [{ text: "ALMOST EMPTY", at: /^almost/, y: 1570, size: 72 }],
};
