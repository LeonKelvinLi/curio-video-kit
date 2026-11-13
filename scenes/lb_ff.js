/* LB footage-first · arm A (visual-first). The Library of Alexandria and the "books from the ships", as the physician Galen reports it
   centuries later: books found on ships were taken, copied, and the copies handed back; Ptolemy III kept Athens' official texts of the
   tragedians and forfeited his deposit. Facts: assets/src/alexandria/facts.json. Everything rests on Galen, which the last line says.
   The 1813 painting and the 19th-century engraving are imagined scenes and are labelled so. The papyrus is a later copy of Sophocles,
   not the Athenian original. Diagram "swap": ship -> ORIGINAL to the library -> COPY comes back. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  function scroll(c, x, y, text, col, a) { // a small rolled book with a label above it
    c.save(); c.globalAlpha = a; c.fillStyle = "#e8dcb8"; rr(c, x - 62, y - 30, 124, 60, 6); c.fill(); c.fillStyle = "#b99a5b"; rr(c, x - 78, y - 38, 24, 76, 10); c.fill(); rr(c, x + 54, y - 38, 24, 76, 10); c.fill();
    c.strokeStyle = "rgba(60,45,20,.55)"; c.lineWidth = 4; [-12, 2, 16].forEach(d => { c.beginPath(); c.moveTo(x - 42, y + d); c.lineTo(x + 42, y + d); c.stroke(); });
    txt(c, text, x, y - 70, `800 44px ${K.DISP}`, col); c.restore();
  }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    swap(c, t, vp, p) {
      const g = SY(1300), ink = "#e9eef3", gold = "#ffc83d", sx = 250, lx = 815, a = E.io(clamp(p / 0.36)), b = E.io(clamp((p - 0.42) / 0.36));
      c.strokeStyle = "#3d6f96"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); for (let i = 0; i <= 12; i++) { const x = 40 + i * 34; c.moveTo(x, g + 8); c.quadraticCurveTo(x + 9, g - 8, x + 18, g + 8); } c.stroke();
      const bob = 5 * Math.sin(t * 3); c.fillStyle = "#8a5a33"; c.beginPath(); c.moveTo(sx - 160, g - 92 + bob); c.lineTo(sx + 160, g - 92 + bob); c.lineTo(sx + 112, g + bob); c.lineTo(sx - 112, g + bob); c.closePath(); c.fill();
      c.strokeStyle = ink; c.lineWidth = 10; c.beginPath(); c.moveTo(sx, g - 92 + bob); c.lineTo(sx, g - 330 + bob); c.stroke(); c.fillStyle = ink; c.beginPath(); c.moveTo(sx + 14, g - 318 + bob); c.quadraticCurveTo(sx + 150, g - 230 + bob, sx + 14, g - 130 + bob); c.closePath(); c.fill();
      c.fillStyle = "#d9d2c0"; c.beginPath(); c.moveTo(lx - 175, g - 250); c.lineTo(lx, g - 340); c.lineTo(lx + 175, g - 250); c.closePath(); c.fill(); c.fillRect(lx - 165, g - 250, 330, 26); c.fillRect(lx - 175, g - 22, 350, 22);
      [-130, -65, 0, 65, 130].forEach(d => c.fillRect(lx + d - 15, g - 224, 30, 202));
      txt(c, "SHIP", sx, g + 62, `800 40px ${K.DISP}`, ink); txt(c, "LIBRARY", lx, g + 62, `800 40px ${K.DISP}`, ink);
      const oy = g - 470, cy = g + 200; c.setLineDash([18, 16]); c.lineWidth = 6;
      c.strokeStyle = "rgba(255,200,61,.6)"; c.beginPath(); c.moveTo(sx, oy); c.lineTo(lerp(sx, lx, a), oy); c.stroke();
      if (b > 0) { c.strokeStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.moveTo(lx, cy); c.lineTo(lerp(lx, sx, b), cy); c.stroke(); } c.setLineDash([]);
      scroll(c, lerp(sx, lx, a), oy, "ORIGINAL", gold, 1);
      if (b > 0) scroll(c, lerp(lx, sx, b), cy, "COPY", "#ffffff", clamp(b * 6));
    },
  });
})();
window.SPEC = {
  credit: "Vincenzo Camuccini, 1813 · public domain",
  beats: [
    { kind: "photo", src: "hook", fit: "cover", fx: 0.5, fy: 0.42, z0: 1.04, z1: 1.16, label: "PAINTED 1813 · IMAGINED SCENE" },
    { kind: "diagram", diagram: "swap", at: /^It$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "ship", at: /^Ships$/, pw: 900, maxH: 990, z0: 1.0, z1: 1.06, label: "ROMAN MOSAIC · PORT OF ALEXANDRIA", credit: "Mosaic photo: Chappsnet · CC BY-SA 4.0" },
    { kind: "photo", src: "papyrus", at: /^Athens$/, pw: 820, maxH: 980, z0: 1.0, z1: 1.07, label: "SOPHOCLES ON PAPYRUS · LATER COPY", credit: "P.Oxy. 1369 · Bridwell Library · public domain" },
    { kind: "photo", src: "engraving", at: /^The$/, pw: 900, maxH: 920, z0: 1.0, z1: 1.06, label: "ENGRAVING, 19TH C. · IMAGINED", credit: "O. von Corven, 19th c. · public domain" },
    { kind: "photo", src: "galen", at: /^physician$/, pw: 860, maxH: 900, iz: 1.35, fx: 0.52, fy: 0.3, z0: 1.0, z1: 1.05, label: "GALEN · MANUSCRIPT, C. 512", credit: "Vienna Dioscurides, c. 512 · public domain" },
  ],
  marks: [{ at: /^Galen$/, ix: 0.52, iy: 0.23, r: 150 }],
  tags: [{ text: "BY ROYAL ORDER, GALEN SAYS", at: /^searched$/, to: /^Athens$/, y: 1570, color: "#ffc83d" }],
  stamps: [{ text: "DEPOSIT FORFEITED", at: [/^kept$/, 1], to: /^physician$/, y: 1540, size: 68 }],
};
