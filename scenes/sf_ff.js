/* SF footage-first · arm B (escalating mystery). USS San Francisco (SSN-711) struck an uncharted seamount at flank speed, 8 Jan 2005,
   525 ft down, about 364 nm SE of Guam. Facts: assets/src/sanfrancisco/facts.json. The Navy blamed voyage planning, so a tag says so.
   Diagram "chart": a blank patch on the crew's chart, "discolored water" on another. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    chart(c, t, vp, p) {
      const a = E.out(clamp(p * 2.2)), b = E.out(clamp((p - 0.3) * 2.5)), X = 90, Y = SY(760), W = 900, H = 660;
      c.fillStyle = "#e6dfc8"; rr(c, X, Y, W, H, 8); c.fill(); c.font = `600 28px ${K.DISP}`; c.fillStyle = "#6f7f8c";
      for (let i = 0; i < 42; i++) { const px = X + 50 + 800 * K.hash(i * 2 + 1), py = Y + 110 + 520 * K.hash(i * 3 + 2); if (Math.hypot(px - 600, py - (Y + 330)) > 170) c.fillText(String(1500 + Math.floor(3000 * K.hash(i))), px, py); }
      c.strokeStyle = "#b5533c"; c.lineWidth = 8; c.setLineDash([24, 16]); c.beginPath(); c.moveTo(X + 60, Y + 600); c.lineTo(X + 60 + (510 - 60) * a, Y + 600 + (Y + 330 - Y - 600) * a); c.stroke(); c.setLineDash([]);
      if (a >= 1) { c.strokeStyle = "#d32f2f"; c.lineWidth = 14; c.beginPath(); c.moveTo(570, Y + 300); c.lineTo(630, Y + 360); c.moveTo(630, Y + 300); c.lineTo(570, Y + 360); c.stroke(); }
      txt(c, "CREW'S CHART: NOTHING HERE", X + W / 2, Y + 46, `800 40px ${K.DISP}`, "#1b2733");
      if (b > 0) { c.save(); c.globalAlpha = b; c.fillStyle = "#17344d"; rr(c, 170, Y + 470, 740, 130, 12); c.fill(); txt(c, "OTHER CHARTS: \"DISCOLORED WATER\"", 540, Y + 535, `800 38px ${K.DISP}`, "#ffc83d"); c.restore(); }
    },
  });
})();
window.SPEC = {
  credit: "US Navy · public domain",
  beats: [
    { kind: "photo", src: "bow", pw: 1000, z0: 1.0, z1: 1.07, label: "REAL NAVY PHOTO · GUAM, 2005" },
    { kind: "photo", src: "side", at: /^The$/, pw: 1000, iz: 1.2, z0: 1.0, z1: 1.06, label: "THE SAME BOW · USS SAN FRANCISCO" },
    { kind: "diagram", diagram: "chart", at: /^Other$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "repair", at: /^One$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REPAIRS · GUAM, MAY 2005" },
  ],
  nums: [["five hundred twenty-five feet", "525 feet"]],
  tags: [{ text: "NAVY: VOYAGE PLANNING FAILED", at: /^discolored/, to: /^One$/, y: 1570, color: "#ffc83d" }, { text: "98 INJURED · HULL HELD", at: /^hull/, y: 1570, color: "#ffc83d" }],
};
