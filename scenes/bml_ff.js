/* BML footage-first · arm C (micro-story, 40 s), payoff unchanged. Barry Marshall drinks a Helicobacter pylori culture, Perth, 1984;
   Nobel Prize 2005 with Robin Warren. Same-story pair with BM: same first picture (the real jar, same framing) and the same four photos,
   so the caption and credits are identical. Facts: assets/src/marshall/facts.json. He got acute gastritis, not an ulcer (tag). The
   infection had cleared before the antibiotics, so nothing on screen says they cured him. A colleague mixed the broth, so Marshall is
   never shown mixing it. Portraits are from 2019 and 2021 and the biopsy is another patient's; labels say so.
   Diagram "blamed", simplified: the two causes the script names. */
(function () {
  const { clamp, E, rr, txt } = K, SY = y => y - 420, W = re => WORDS[K.ix(WORDS, re)].s;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    blamed(c, t) {
      const a = E.out(clamp((t - W(/^stress/) + 0.15) * 4)), b = E.out(clamp((t - W(/^acid/) + 0.15) * 4));
      txt(c, "1984", 540, SY(760), `800 120px ${K.DISP}`, "#ffffff");
      txt(c, "WHAT DOCTORS BLAMED FOR ULCERS", 540, SY(880), `800 44px ${K.DISP}`, "#ffc83d");
      const card = (x, al, s) => { if (al <= 0) return; c.save(); c.globalAlpha = al; rr(c, x - 215, SY(1040), 430, 300, 28); c.fillStyle = "#1d2733"; c.fill(); c.strokeStyle = "#e9eef3"; c.lineWidth = 6; c.stroke(); txt(c, s, x, SY(1215), `800 92px ${K.DISP}`, "#ffffff"); c.restore(); };
      card(290, a, "STRESS"); card(790, b, "ACID");
    },
  });
})();
window.SPEC = {
  credit: "Gaius Cornelius · CC BY 4.0",
  beats: [
    { kind: "photo", src: "jar", pw: 640, maxH: 960, cy: 1075, fy: 0.48, z0: 1.0, z1: 1.06, label: "THE REAL JAR · NOBEL MUSEUM" },
    { kind: "photo", src: "desk", at: [/^He$/, 0], pw: 1000, fy: 0.42, z0: 1.0, z1: 1.06, label: "DR BARRY MARSHALL · PHOTO 2021", credit: "WikiEdtingProfile2021 · CC BY-SA 4.0" },
    { kind: "diagram", diagram: "blamed", at: /^It$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "biopsy", at: /^Barry$/, pw: 1000, maxH: 1000, iz: 1.25, fx: 0.55, fy: 0.55, z0: 1.0, z1: 1.08, label: "REAL H. PYLORI · A PATIENT BIOPSY", credit: "Ed Uthman · CC BY 2.0" },
    { kind: "photo", src: "jar", at: /^So$/, fit: "cover", fx: 0.5, fy: 0.42, z0: 1.0, z1: 1.08, label: "THE JAR THAT HELD THE BROTH" },
    { kind: "photo", src: "face", at: /^Within$/, pw: 1000, fy: 0.45, z0: 1.0, z1: 1.06, label: "BARRY MARSHALL · PHOTO 2019", credit: "Binarysequence · CC BY-SA 4.0" },
    { kind: "photo", src: "biopsy", at: [/^A$/, 1], pw: 1000, maxH: 1000, iz: 1.7, fx: 0.4, fy: 0.42, z0: 1.0, z1: 1.1, label: "H. PYLORI IN A STOMACH BIOPSY · NOT HIS", credit: "Ed Uthman · CC BY 2.0" },
    { kind: "photo", src: "desk", at: [/^He$/, 1], pw: 1000, iz: 1.2, fy: 0.36, z0: 1.0, z1: 1.06, label: "DR BARRY MARSHALL · PHOTO 2021", credit: "WikiEdtingProfile2021 · CC BY-SA 4.0" },
    { kind: "photo", src: "face", at: /^In$/, pw: 1000, iz: 1.15, fy: 0.4, z0: 1.0, z1: 1.07, label: "BARRY MARSHALL · PHOTO 2019", credit: "Binarysequence · CC BY-SA 4.0" },
  ],
  nums: [["nineteen eighty-four", "1984"], ["two thousand five", "2005"]],
  tags: [
    { text: "HE TOLD HER THAT EVENING", at: /^wife/, to: /^It$/, y: 1570, color: "#ffc83d" },
    { text: "GASTRITIS, NOT AN ULCER", at: /^inflamed/, to: [/^He$/, 1], y: 1570, color: "#ffc83d" },
  ],
  stamps: [
    { text: "THE PIGLETS STAYED HEALTHY", at: /^piglets/, to: /^So$/, y: 1570, size: 54 },
    { text: "HE DRANK IT", at: [/^drank$/, 1], to: /^Within$/, y: 1570, size: 80 },
    { text: "THEN: VOMITING", at: /^vomiting/, to: [/^A$/, 1], y: 1570, size: 72 },
    { text: "2005 NOBEL · WITH ROBIN WARREN", at: /^Nobel/, y: 1570, size: 52 },
  ],
};
