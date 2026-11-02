/* NF footage-first · the American Falls at Niagara "turned off", 12 Jun - 25 Nov 1969. Facts: assets/src/niagara/facts.json
   (US Army Corps of Engineers Buffalo District, IJC, NY State Parks, AP 13 Jun 1969). Diagram "divert", simplified top-down
   map: the river splits around Goat Island; a rock cofferdam closes the American channel and the flow goes to the Horseshoe.
   Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    divert(c, t, vp, p, b) {
      const dam = E.out(clamp((p - 0.25) / 0.3)), dry = clamp((p - 0.5) / 0.35); // dam builds, then the left channel empties
      // river: bottom (upstream) to top (downstream); Goat Island in the middle
      c.fillStyle = "#24364a"; c.fillRect(140, SY(760), 800, 840);
      c.fillStyle = "#2f4f3a"; rr(c, 430, SY(900), 240, 520, 60); c.fill(); txt(c, "GOAT", 550, SY(1140), `800 34px ${K.DISP}`, "#cfe3d2"); txt(c, "ISLAND", 550, SY(1180), `800 34px ${K.DISP}`, "#cfe3d2");
      // dry left channel
      c.save(); c.globalAlpha = dry; c.fillStyle = "#6b5a3e"; c.fillRect(140, SY(760), 290, 660); c.restore();
      // falls edges
      c.fillStyle = "#e9eef3"; c.fillRect(140, SY(880), 290, 14); c.fillRect(670, SY(880), 270, 14);
      txt(c, "AMERICAN FALLS", 285, SY(840), `800 30px ${K.DISP}`, dry > 0.5 ? "#ffc83d" : "#e9eef3"); txt(c, "HORSESHOE", 805, SY(840), `800 30px ${K.DISP}`, "#e9eef3");
      // flow arrows (moving dashes) in each channel
      const flow = (x0, x1, a, speed) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.strokeStyle = "#8fd3ff"; c.lineWidth = 6; c.setLineDash([26, 30]); c.lineDashOffset = -t * speed;
        for (let x = x0; x <= x1; x += 48) { c.beginPath(); c.moveTo(x, SY(1600)); c.lineTo(x, SY(900)); c.stroke(); } c.restore(); };
      flow(180, 400, 1 - dry, 300); flow(700, 910, 1, 300 + 260 * dam);
      // the cofferdam: a bar of rock closing the left channel below the island
      c.save(); c.globalAlpha = dam; for (let i = 0; i < 9; i++) { const x = 150 + i * 36 + 10 * K.hash(i), y = SY(1420) + 26 * K.hash(i + 5); circ(c, x, y, 20 + 10 * K.hash(i + 9), "#9a8a6a"); } c.restore();
      if (dam > 0.5) { txt(c, "ROCK DAM", 285, SY(1500), `800 34px ${K.DISP}`, "#ffc83d"); }
      txt(c, dry > 0.5 ? "ALL THE WATER GOES TO THE HORSESHOE" : dam > 0.3 ? "A ROCK DAM CLOSES ONE CHANNEL" : "THE RIVER SPLITS AROUND AN ISLAND", 540, SY(700), `800 44px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "US Army Corps of Engineers · public domain",
  beats: [
    { kind: "photo", src: "prospect", pw: 1000, z0: 1.0, z1: 1.08, fx: 0.55, label: "REAL PHOTO · AMERICAN FALLS, DRY, 1969", credit: "US Army Corps of Engineers, Buffalo District · public domain" },
    { kind: "diagram", diagram: "divert", at: /^In$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "talus", at: /^went$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · THE DRY FACE, 1969", credit: "US Army Corps of Engineers · public domain" },
    { kind: "photo", src: "aerial", at: [/^They$/, 1], pw: 1000, z0: 1.0, z1: 1.07, fy: 0.6, label: "REAL PHOTO · THE EMPTY RIVERBED", credit: "US Army Corps of Engineers · public domain" },
    { kind: "photo", src: "wet", at: /^left$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · WATER BACK, 1973", credit: "EPA Documerica / National Archives · public domain" },
  ],
  nums: [["nineteen sixty-nine", "1969"]],
  marks: [
    { at: 0.5, to: /^In$/, ix: 0.68, iy: 0.42, r: 70, text: "A TRICKLE", side: "left" },
    { at: /^rock$/, to: [/^They$/, 1], ix: 0.3, iy: 0.62, r: 110, text: "THE ROCK PILE", side: "right" },
  ],
  tags: [
    { text: "COUNTLESS COINS", at: /^coins$/, to: /^left$/, y: 1460, color: "#ffc83d" },
    { text: "2 BODIES", at: /^bodies,$/, to: /^left$/, y: 1520, color: "#ffc83d" },
  ],
  stamps: [{ text: "BACK ON · 25 NOV 1969", at: /^back$/, y: 1560, size: 60 }],
};
