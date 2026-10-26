/* P10 footage-first · Roy Sullivan, Shenandoah National Park ranger, struck by lightning 7 times (1942-1977). Facts: Wikipedia
   "Roy Sullivan"; Guinness World Records (most lightning strikes survived). Strikes: 1942 leg (lost a toenail), 1969 eyebrows,
   1970 left shoulder, 1972 hair set on fire, 1973 hair again + legs, 1976 ankle, 1977 chest and stomach. Diagram: body map,
   simplified; the five marks follow the voiceover, not the full timeline. Real footage/photos: assets/src/p10/sources.json. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, poly } = K, Wd = WORDS, w = (re, n) => Wd[K.ix(Wd, re, n)].s, SY = y => y - 420;
  const hits = [
    { at: w(/^leg/), x: 470, y: 1390, label: "LEG · 1942", side: "left" },
    { at: w(/^shoulder$/), x: 625, y: 860, label: "SHOULDER · 1970", side: "right" },
    { at: w(/^chest/), x: 540, y: 960, label: "CHEST · 1977", side: "left" },
    { at: w(/^hair$/), x: 560, y: 690, label: "HAIR · 1972", side: "right" },
    { at: w(/^again/, 1), x: 520, y: 690, label: "HAIR · 1973", side: "left", dy: 90 },
  ];
  function ranger(c) { // front view figure with a campaign hat, centred at x 540
    const sk = "#c9b8a0", un = "#56604a"; rr(c, 470, SY(1170), 54, 330, 24); c.fillStyle = un; c.fill(); rr(c, 556, SY(1170), 54, 330, 24); c.fill(); // legs
    rr(c, 430, SY(820), 220, 380, 60); c.fill(); rr(c, 380, SY(840), 50, 300, 24); c.fill(); rr(c, 650, SY(840), 50, 300, 24); c.fill(); // torso, arms
    circ(c, 540, SY(720), 72, sk); poly(c, [[540, SY(590)], [470, SY(665)], [610, SY(665)]], "#8a6f45"); rr(c, 420, SY(660), 240, 20, 10); c.fillStyle = "#8a6f45"; c.fill(); // head + hat
  }
  function bolt(c, x, y, a) { c.save(); c.globalAlpha = a; c.strokeStyle = "#fff6c8"; c.lineWidth = 9; c.lineJoin = "round"; c.beginPath(); c.moveTo(x + 60, y - 260); c.lineTo(x - 10, y - 150); c.lineTo(x + 40, y - 120); c.lineTo(x, y); c.stroke(); c.restore(); }
  window.DIAGRAMS = {
    body(c, t, vp, p, b) {
      ranger(c);
      hits.forEach(h => { const u = t - h.at; if (u < 0) return; const flash = u < 0.25 ? 1 - u / 0.25 : 0, y = SY(h.y);
        bolt(c, h.x, y, flash); circ(c, h.x, y, 30 + 30 * flash, `rgba(255,107,74,${0.35 + 0.4 * flash})`); circ(c, h.x, y, 16, "#ff6b4a");
        const left = h.side === "left", lx = left ? 330 : 750, ly = y + (h.dy || 0); c.strokeStyle = "rgba(255,200,61,.9)"; c.lineWidth = 4; c.beginPath(); c.moveTo(h.x, y); c.lineTo(lx, ly); c.stroke();
        c.save(); c.globalAlpha = clamp(u * 4); c.font = `800 42px ${K.DISP}`; const tw = c.measureText(h.label).width + 28; rr(c, left ? lx - tw : lx, ly - 30, tw, 60, 10); c.fillStyle = "rgba(6,10,14,.88)"; c.fill();
        txt(c, h.label, left ? lx - tw / 2 : lx + tw / 2, ly + 2, `800 42px ${K.DISP}`, "#ffc83d"); c.restore(); });
    },
  };
})();
window.SPEC = {
  credit: "Photo: National Park Service · public domain",
  nums: [["nineteen forty-two", "1942"], ["nineteen seventy-seven", "1977"]],
  beats: [
    { kind: "photo", src: "sullivan", pw: 760, maxH: 1100, z0: 1.0, z1: 1.05, label: "REAL NPS PHOTO · ROY SULLIVAN", credit: "Photo: National Park Service · public domain" },
    { kind: "clip", src: "bolt", at: /^lightning$/, pw: 1000, z0: 1.0, z1: 1.04, label: "REAL LIGHTNING", credit: "Real lightning footage: KoS · public domain" },
    { kind: "photo", src: "sullivan", at: /^seven$/, pw: 760, maxH: 1100, z0: 1.04, z1: 1.08, label: "HIS HAT", credit: "Photo: National Park Service · public domain" },
    { kind: "clip", src: "sign", at: /^Roy$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL NPS FILM · SHENANDOAH", credit: "Footage: National Park Service, Shenandoah" },
    { kind: "photo", src: "skyline", at: /^Between$/, pw: 1000, z0: 1.0, z1: 1.08, label: "SKYLINE DRIVE · 1942", credit: "Arthur Rothstein, 1942 · Library of Congress" },
    { kind: "diagram", diagram: "body", at: /^bolts$/, credit: "Curio diagram · strike years: Wikipedia, Guinness" },
    { kind: "photo", src: "sullivan", at: /^He$/, pw: 760, maxH: 1100, iz: 1.7, fx: 0.32, fy: 0.27, z0: 1.0, z1: 1.06, label: "ROY SULLIVAN", credit: "Photo: National Park Service · public domain" },
  ],
  marks: [{ at: [/^seven$/, 0], to: /^Roy$/, ix: 0.727, iy: 0.619, r: 120, text: "BURNED BY LIGHTNING", side: "left" }],
  tags: [{ text: "1942 – 1977", at: /^Between$/, to: /^bolts$/, y: 1500, color: "#ffc83d" }],
  stamps: [{ text: "SURVIVED ALL 7", at: [/^seven\.?$/, 1], y: 1570, size: 72 }],
};
