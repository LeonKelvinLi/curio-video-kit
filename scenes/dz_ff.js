/* DZ footage-first · arm A (visual-first). Dazzle camouflage, 1917-18: painted to confuse a U-boat captain's estimate of course, not
   to hide. Facts: assets/src/dazzle/facts.json. Opener is Arthur Lismer's 1919 painting of HMT Olympic in dazzle, full frame.
   Diagram "periscope": the ship in a periscope, with the real course against the captain's guess. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    periscope(c, t, vp, p) {
      const X = 540, Y = SY(1010), R = 420, a = E.out(clamp(p * 2.5));
      c.save(); c.beginPath(); c.arc(X, Y, R, 0, 6.3); c.clip(); c.fillStyle = "#8fb6c9"; c.fillRect(X - R, Y - R, 2 * R, R); c.fillStyle = "#274a5e"; c.fillRect(X - R, Y, 2 * R, R);
      c.beginPath(); c.moveTo(X - 300, Y - 40); c.lineTo(X + 340, Y - 40); c.lineTo(X + 290, Y + 40); c.lineTo(X - 260, Y + 40); c.closePath(); c.save(); c.clip();
      for (let i = -8; i < 10; i++) { c.fillStyle = i % 2 ? "#10161c" : "#e9eef3"; c.beginPath(); c.moveTo(X + i * 70, Y - 60); c.lineTo(X + i * 70 + 70, Y - 60); c.lineTo(X + i * 70 + (i % 3 ? 10 : 130), Y + 60); c.lineTo(X + i * 70 - (i % 3 ? 60 : -60), Y + 60); c.fill(); } c.restore();
      c.fillStyle = "#10161c"; c.fillRect(X - 40, Y - 110, 110, 70); c.fillRect(X + 10, Y - 170, 26, 60); c.restore();
      c.strokeStyle = "#e9eef3"; c.lineWidth = 10; c.beginPath(); c.arc(X, Y, R, 0, 6.3); c.stroke(); c.lineWidth = 3; c.beginPath(); c.moveTo(X - R, Y); c.lineTo(X + R, Y); c.moveTo(X, Y - R); c.lineTo(X, Y + R); c.stroke();
      c.save(); c.globalAlpha = a; c.strokeStyle = "#ffffff"; c.lineWidth = 12; c.beginPath(); c.moveTo(X - 40, Y + 130); c.lineTo(X + 300, Y + 130); c.lineTo(X + 268, Y + 106); c.moveTo(X + 300, Y + 130); c.lineTo(X + 268, Y + 154); c.stroke();
      c.strokeStyle = "#ffc83d"; c.setLineDash([26, 18]); c.beginPath(); c.moveTo(X - 40, Y + 130); c.lineTo(X - 280, Y + 250); c.stroke(); c.setLineDash([]); c.restore();
      txt(c, "REAL COURSE", X + 140, Y + 190, `800 38px ${K.DISP}`, "#ffffff"); txt(c, "CAPTAIN'S GUESS", X - 120, Y + 310, `800 38px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Arthur Lismer, 1919 · public domain",
  beats: [
    { kind: "photo", src: "olympic", fit: "cover", fx: 0.31, fy: 0.52, fx1: 0.36, z0: 1.05, z1: 1.16, label: "PAINTING · HMT OLYMPIC, 1919", credit: "Arthur Lismer, 1919 · public domain" },
    { kind: "photo", src: "mahomet", at: /^Not$/, pw: 860, maxH: 1040, z0: 1.0, z1: 1.06, label: "REAL SHIP · 1918", credit: "Photographer unknown, 1918 · public domain" },
    { kind: "photo", src: "gotomska", at: /^A$/, pw: 1000, iz: 1.5, fy: 0.4, z0: 1.0, z1: 1.06, label: "REAL SHIP · TRIALS, 1918", credit: "US Naval History & Heritage · public domain" },
    { kind: "diagram", diagram: "periscope", at: /^thousands/, credit: "Curio diagram · simplified" },
  ],
  nums: [["nineteen seventeen", "1917"]],
  tags: [{ text: "WHICH WAY IS IT HEADING?", at: /^fool/, to: /^A$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "STILL DISPUTED", at: /^nobody/, y: 1570, size: 64 }],
};
