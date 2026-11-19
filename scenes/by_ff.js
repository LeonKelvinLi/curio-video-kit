/* BY footage-first · arm FULL (test pair T7-2: control script and length, cover on every photo, like tg_ff.js). "Look Behind the Baby":
   hidden-mother photographs, c. 1870-1921. Facts: assets/src/hiddenmother/facts.json. First frame: a real c. 1900 portrait of a baby
   in a christening gown on the lap of an adult completely covered by a dark cloth (public domain). "Probably the mother" stays a
   "probably": the hidden adult is not named in any record (one picture here is described as a hidden father). Why they hid at all is
   only a collector's theory, so the reel does not say why. Cloaks beat: the Ewing family photo with a fully cloaked adult. Last beat: a 1921 glass negative where the mother was retouched out.
   No diagram. All six photos are public domain or CC0. */
window.SPEC = {
  credit: "Public domain",
  beats: [
    { kind: "photo", src: "infant", fit: "cover", fx: 0.55, fy: 0.42, z0: 1.0, z1: 1.1, label: "REAL PHOTO, c. 1900", credit: "Photographer unknown, c. 1900 · public domain" },
    { kind: "photo", src: "striped", at: /^holding$/, fit: "cover", fx: 0.5, fy: 0.45, z0: 1.04, z1: 1.12, label: "TINTYPE, 1880-1910 · USA", credit: "Rijksmuseum · public domain (CC0)" },
    { kind: "photo", src: "father", at: /^Early$/, fit: "cover", fx: 0.5, fy: 0.45, z0: 1.0, z1: 1.14, label: "PHOTO, c. 1880", credit: "Photographer unknown, c. 1880 · public domain" },
    { kind: "photo", src: "ewing", at: /^So$/, fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.1, label: "PHOTO, c. 1896-1912 · OHIO", credit: "Albert J. Ewing · public domain" },
    { kind: "photo", src: "curtain", at: [/^behind$/, 1], fit: "cover", fx: 0.5, fy: 0.42, z0: 1.02, z1: 1.1, label: "TINTYPE, c. 1870-1900 · USA", credit: "Rijksmuseum · public domain (CC0)" },
    { kind: "photo", src: "retouch", at: /^pretended$/, fit: "cover", fx: 0.5, fy: 0.5, z0: 1.02, z1: 1.08, label: "MOTHER RETOUCHED OUT, c. 1921", credit: "Vincent W. Kelly, c. 1921 · public domain" },
  ],
  marks: [{ at: /^person/, to: /^holding$/, ix: 0.82, iy: 0.5, r: 80, text: "A PERSON", side: "left" }],
  stamps: [{ text: "1840s TO 1920s", at: /^decades/, to: [/^behind$/, 1], y: 1570, size: 68 }],
};
