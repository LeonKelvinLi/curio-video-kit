/* RC footage-first · the raising of Chicago (1850s-60s). Facts: assets/src/raisingchicago/facts.json (Encyclopedia of
   Chicago; Chicago Press and Tribune 1860-61). Diagrams, simplified cross-sections: "grade" = a flat, swampy street that
   can't drain; sewers are laid on the street and buried, the street rises several feet, and the buildings now sit below it;
   "jack" = a hotel on rows of jackscrews, men giving each screw a quarter turn on a signal, the hotel rising six feet to the
   new street. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  const MUD = "#5a4632", FILL = "#8a7154", BRICK = "#9a5b43";
  function label(c, text, x, y, color, a) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.font = `800 38px ${K.DISP}`; const w = c.measureText(text).width + 28;
    rr(c, x - w / 2, y - 30, w, 60, 10); c.fillStyle = "rgba(6,10,14,.88)"; c.fill(); txt(c, text, x, y + 2, `800 38px ${K.DISP}`, color); c.restore(); }
  function building(c, x, base, w, h) { rr(c, x, base - h, w, h, 4); c.fillStyle = BRICK; c.fill();
    c.fillStyle = "#e9d8a6"; for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) c.fillRect(x + 30 + k * (w - 60) / 3.4, base - h + 30 + r * (h - 90) / 4, 34, 46);
    c.fillStyle = "#2a1d14"; c.fillRect(x + w / 2 - 30, base - 80, 60, 80); }
  function ruler(c, x, y0, y1, text, a) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.strokeStyle = "#ffc83d"; c.lineWidth = 6; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke();
    c.beginPath(); c.moveTo(x - 18, y0); c.lineTo(x + 18, y0); c.moveTo(x - 18, y1); c.lineTo(x + 18, y1); c.stroke(); txt(c, text, x - 26, (y0 + y1) / 2, `800 40px ${K.DISP}`, "#ffc83d", "right"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    grade(c, t, vp, p, b) {
      const G = SY(1330), raise = E.io(clamp((p - 0.45) / 0.3)), top = lerp(G, G - 150, raise), pipe = E.out(clamp((p - 0.3) / 0.15));
      c.fillStyle = MUD; c.fillRect(0, G, 1080, SY(1560) - G); // old ground
      building(c, 90, G, 420, 380);
      if (p < 0.45) for (let i = 0; i < 3; i++) { c.fillStyle = "rgba(120,170,220,.75)"; c.beginPath(); c.ellipse(640 + i * 150, G - 2, 56, 10, 0, 0, 6.3); c.fill(); } // standing water
      if (pipe > 0) { circ(c, 800, lerp(G - 400, G - 46, pipe), 46, "#9aa3ad"); circ(c, 800, lerp(G - 400, G - 46, pipe), 30, "#3a3f46"); }
      if (raise > 0) { c.fillStyle = FILL; c.fillRect(530, top, 550, G - top); c.fillStyle = "#6b6f75"; c.fillRect(530, top - 10, 550, 10); } // fill + new street surface
      ruler(c, 1050, G, top, "SEVERAL FEET", raise * 2);
      if (p > 0.82) { c.save(); c.strokeStyle = "#ff6b4a"; c.lineWidth = 6; c.setLineDash([16, 12]); c.beginPath(); c.moveTo(90, top - 10); c.lineTo(530, top - 10); c.stroke(); c.restore(); }
      txt(c, p > 0.82 ? "NOW THE HOTELS SAT BELOW THE STREET" : raise > 0 ? "THE STREETS WERE BUILT UP OVER THEM" : pipe > 0 ? "SEWERS WERE LAID ON THE STREETS" : "TOO FLAT TO DRAIN", 540, SY(720), `800 48px ${K.DISP}`, p > 0.82 ? "#ff6b4a" : "#ffc83d");
    },
    jack(c, t, vp, p, b) {
      const G = SY(1450), ST = G - 150, lift = E.io(clamp(p / 0.85)), base = lerp(G, ST, lift);
      c.fillStyle = MUD; c.fillRect(0, G, 1080, SY(1560) - G); c.fillStyle = FILL; c.fillRect(700, ST, 380, G - ST); c.fillStyle = "#6b6f75"; c.fillRect(700, ST - 10, 380, 10);
      building(c, 120, base - 20, 520, 430); c.fillStyle = "#4a3a2c"; c.fillRect(110, base - 20, 540, 20); // timber cribbing
      for (let i = 0; i < 6; i++) { const x = 150 + i * 92, h = base - G; c.fillStyle = "#cfd6dd"; c.fillRect(x - 9, G + h, 18, -h); c.fillStyle = "#8a96a3"; for (let y = G; y > base; y -= 12) c.fillRect(x - 12, y - 3, 24, 3); } // jackscrews
      const turn = (t * 2) % 1; for (let i = 0; i < 3; i++) { const x = 196 + i * 184; circ(c, x, G + 40, 14, "#e9eef3"); c.save(); c.strokeStyle = "#ffc83d"; c.lineWidth = 5; c.beginPath(); c.arc(x, G + 40, 34, -1.6, -1.6 + 1.57 * E.out(turn)); c.stroke(); c.restore(); }
      ruler(c, 680, G, base, "6 FT", lift * 3);
      txt(c, lift >= 1 ? "UP TO THE NEW STREET" : "A QUARTER TURN, ON A SIGNAL", 540, SY(720), `800 50px ${K.DISP}`, "#ffc83d");
      label(c, "EACH MAN: ABOUT 10 SCREWS", 540, SY(790), "#e9eef3", clamp(p * 4));
    },
  });
})();
window.SPEC = {
  credit: "Chicago History Museum · public domain",
  beats: [
    { kind: "photo", src: "briggs", pw: 1000, z0: 1.0, z1: 1.07, label: "REAL 1860s ENGRAVING · A HOTEL ON SCREWS", credit: "Raising the Briggs House, Chicago, c. 1866 · public domain" },
    { kind: "diagram", diagram: "grade", at: /^Too$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "lakest", at: /^Five$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PRINT · A WHOLE BLOCK ON SCREWS", credit: "Edward Mendel lithograph · Chicago History Museum · public domain" },
    { kind: "diagram", diagram: "jack", at: /^inching$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "tremont", at: /^One$/, pw: 760, cy: 1080, z0: 1.0, z1: 1.05, label: "REAL PHOTO · THE TREMONT HOUSE", credit: "John Carbutt, Tremont House, 1860s · Library of Congress · public domain" },
  ],
  nums: [["Five hundred", "500"], ["five thousand", "5,000"]],
  marks: [{ at: 0.6, to: /^Too$/, ix: 0.4, iy: 0.76, r: 80, text: "JACKSCREWS" }],
  tags: [{ text: "TREMONT HOUSE, 1861: 500 MEN, 5,000 SCREWS", at: /^Five$/, to: /^inching$/, y: 1480, color: "#ffc83d" }],
  stamps: [{ text: "IT STAYED OPEN", at: /^noticed$/, y: 1620, size: 64 }],
};
