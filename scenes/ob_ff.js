/* OB footage-first · arm A (visual-first). The Oxford Electric Bell, Clarendon Laboratory, set up in 1840: two dry piles of unknown
   make drive a metal ball between two bells, about 10 billion rings so far. Facts: assets/src/oxfordbell/facts.json. Only one
   rights-clear photo exists (480x640, CC BY-SA 3.0), so it is upscaled. Diagram "piles": the ball shuttling between the bells. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    piles(c, t, vp, p) {
      const Y = SY(800), x1 = 340, x2 = 740, u = (Math.sin(t * 9) + 1) / 2, bx = x1 + 70 + (x2 - x1 - 140) * u, hit = u < 0.08 || u > 0.92;
      [x1, x2].forEach(x => { c.fillStyle = "#e6dfc8"; rr(c, x - 44, Y, 88, 340, 16); c.fill(); for (let i = 1; i < 12; i++) { c.fillStyle = "rgba(90,70,40,.35)"; c.fillRect(x - 44, Y + i * 28, 88, 4); }
        c.fillStyle = "#c8a24a"; c.beginPath(); c.moveTo(x - 66, Y + 450); c.quadraticCurveTo(x, Y + 310, x + 66, Y + 450); c.fill(); });
      circ(c, bx, Y + 410, 26, "#e9eef3"); if (hit) { c.strokeStyle = "#ffc83d"; c.lineWidth = 6; const hx = u < 0.5 ? x1 + 66 : x2 - 66; [40, 70].forEach(r => { c.beginPath(); c.arc(hx, Y + 410, r, 0, 6.3); c.stroke(); }); }
      txt(c, "WHAT'S INSIDE?", x1, Y - 40, `800 36px ${K.DISP}`, "#ffc83d"); txt(c, "WHAT'S INSIDE?", x2, Y - 40, `800 36px ${K.DISP}`, "#ffc83d");
      txt(c, "10,000,000,000 RINGS", 540, Y + 540, `800 66px ${K.DISP}`, "#ffffff");
    },
  });
})();
window.SPEC = {
  credit: "DavidCWG · CC BY-SA 3.0",
  beats: [
    { kind: "photo", src: "bell", fit: "cover", fx: 0.46, fy: 0.42, z0: 1.05, z1: 1.14, label: "REAL BELL · OXFORD, SINCE 1840" },
    { kind: "photo", src: "bell", at: /^On$/, pw: 800, maxH: 1060, iz: 1.5, fx: 0.42, fy: 0.34, z0: 1.0, z1: 1.08, label: "THE BATTERY: TWO DRY PILES" },
    { kind: "diagram", diagram: "piles", at: /^It$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "bell", at: /^sealed$/, pw: 800, maxH: 1060, z0: 1.0, z1: 1.06, label: "CLARENDON LABORATORY" },
  ],
  nums: [["eighteen forty", "1840"], ["ten billion", "10 billion"]],
  stamps: [{ text: "TOO QUIET TO HEAR", at: /^too$/, y: 1570, size: 64 }],
};
