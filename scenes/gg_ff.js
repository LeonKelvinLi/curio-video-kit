/* GG footage-first · the Gimli Glider (Air Canada 143, 767 C-GAUN, 23 July 1983). Facts: assets/src/topic3/facts.json
   (numbers from the 1985 Board of Inquiry report). Diagrams, simplified: "fuel" = fuel needed vs fuel on board, where the
   22,300 on board turns out to be pounds (about 10,100 kg); "slip" = top-down view of the jet slipping sideways down to the
   runway and stopping short of the drag strip at the far end. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  function bar(c, y, label, frac, color, value, valueColor) {
    txt(c, label, 120, SY(y) - 40, `800 40px ${K.DISP}`, "#e9eef3", "left");
    rr(c, 120, SY(y), 840, 96, 14); c.fillStyle = "rgba(233,238,243,.12)"; c.fill();
    if (frac > 0) { rr(c, 120, SY(y), 840 * frac, 96, 14); c.fillStyle = color; c.fill(); }
    txt(c, value, 960, SY(y) - 40, `800 52px ${K.DISP}`, valueColor || "#ffffff", "right");
  }
  function jet(c, x, y, s, yaw) { // top-down 767, nose pointing down the screen
    c.save(); c.translate(x, y); c.rotate(yaw); c.scale(s, s); c.fillStyle = "#e9eef3";
    rr(c, -16, -150, 32, 300, 16); c.fill();
    poly(c, [[-12, -20], [-150, -60], [-150, -40], [-12, 30]], "#e9eef3"); poly(c, [[12, -20], [150, -60], [150, -40], [12, 30]], "#e9eef3");
    poly(c, [[-8, -130], [-60, -150], [-60, -138], [-8, -110]], "#cfd6dd"); poly(c, [[8, -130], [60, -150], [60, -138], [8, -110]], "#cfd6dd");
    circ(c, -70, -25, 12, "#8a96a3"); circ(c, 70, -25, 12, "#8a96a3"); c.restore();
  }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    fuel(c, t, vp, p, b) {
      const lb = clamp((t - tw(/^pounds$/)) / 0.35), half = E.out(clamp((t - tw(/^half$/)) / 0.8));
      txt(c, "THE 767 MEASURED FUEL IN KG", 540, SY(720), `800 46px ${K.DISP}`, "#ffc83d");
      bar(c, 900, "FUEL NEEDED", E.out(clamp(p * 4)), "#ffc83d", "22,300 KG");
      const red = half > 0 ? "#ff6b4a" : "#ffc83d";
      bar(c, 1180, "FUEL ON BOARD", E.out(clamp(p * 4 - 0.3)) * lerp(1, 0.453, half), red, half > 0.5 ? "≈ 10,100 KG" : lb > 0 ? "22,300 LB" : "22,300 KG?", lb > 0 ? "#ff6b4a" : "#ffffff");
      if (lb > 0) { c.save(); c.globalAlpha = lb;
        txt(c, "THEY USED 1.77 (LITRES → POUNDS)", 540, SY(1400), `700 40px ${K.DISP}`, "#ff6b4a");
        txt(c, "INSTEAD OF ~0.8 (LITRES → KG)", 540, SY(1460), `700 40px ${K.DISP}`, "#e9eef3"); c.restore(); }
      if (half > 0.5) { c.save(); c.globalAlpha = clamp((half - 0.5) * 3); txt(c, "LESS THAN HALF", 120 + 840 * 0.453 + 24, SY(1180) + 50, `800 40px ${K.DISP}`, "#ff6b4a", "left"); c.restore(); }
    },
    slip(c, t, vp, p, b) {
      const top = SY(1000), end = SY(1620);
      rr(c, 430, top, 220, end - top, 6); c.fillStyle = "#3a3f46"; c.fill();
      c.fillStyle = "#e9eef3"; for (let y = top + 30; y < end - 120; y += 70) c.fillRect(536, y, 8, 36);
      for (let i = 0; i < 5; i++) { rr(c, 448 + i * 40, end - 70, 28, 46, 6); c.fillStyle = ["#d94a3a", "#3a7bd9", "#e8c547", "#5aa05a", "#d97a3a"][i]; c.fill(); } // cars on the drag strip
      for (let i = 0; i < 3; i++) poly(c, [[690 + i * 70, end - 20], [720 + i * 70, end - 80], [750 + i * 70, end - 20]], "#c9b48a"); // campers' tents
      txt(c, "DRAG STRIP", 820, end - 110, `800 36px ${K.DISP}`, "#e9eef3");
      const land = E.sine(clamp(p / 0.6)), roll = E.out(clamp((p - 0.6) / 0.4));
      const y = p < 0.6 ? lerp(SY(880), top + 40, land) : lerp(top + 40, end - 240, roll), s = p < 0.6 ? lerp(1.1, 0.8, land) : 0.8;
      const yaw = p < 0.6 ? 0.45 * Math.sin(Math.PI * Math.min(1, land * 1.15)) : 0;
      jet(c, 540, y, s, yaw);
      txt(c, roll > 0.6 ? "STOPPED SHORT OF THE CROWD" : "SLIPPING SIDEWAYS ADDS DRAG", 540, SY(680), `800 46px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Curio",
  beats: [
    { kind: "photo", src: "landed", pw: 1000, iz: 1.6, fx: 0.49, fy: 0.42, z0: 1.0, z1: 1.06, label: "REAL PHOTO · GIMLI, CANADA, 1983", credit: "Photo via Wikimedia Commons (VRT 2012070510009901) · CC BY-SA 3.0" },
    { kind: "diagram", diagram: "fuel", at: /^The$/, credit: "Curio diagram · numbers from the 1985 Board of Inquiry" },
    { kind: "photo", src: "jet", at: [/^The$/, 1], pw: 1000, iz: 1.3, fx: 0.6, fy: 0.65, z0: 1.0, z1: 1.06, label: "THE ACTUAL JET · C-GAUN, 1984", credit: "Andrew Thomas via Wikimedia Commons · CC BY-SA 2.0" },
    { kind: "photo", src: "strip", at: /^old$/, pw: 1000, iz: 1.7, fx: 0.56, fy: 0.5, z0: 1.0, z1: 1.07, label: "GIMLI'S OLD RUNWAY · DRAG STRIP", credit: "NESR via Wikimedia Commons · CC BY-SA 2.0" },
    { kind: "diagram", diagram: "slip", at: /^He$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "landed", at: /^all$/, pw: 1000, z0: 1.0, z1: 1.05, label: "REAL PHOTO · AFTER THE LANDING", credit: "Photo via Wikimedia Commons (VRT 2012070510009901) · CC BY-SA 3.0" },
  ],
  nums: [["sixty-nine", "69"]],
  marks: [
    { at: 0.6, to: /^The$/, ix: 0.49, iy: 0.40, r: 80, text: "NOSE DOWN" },
    { at: /^glider$/, to: /^old$/, ix: 0.66, iy: 0.79, r: 70, text: "BOTH QUIT", side: "left" },
    { at: /^drag$/, to: /^He$/, ix: 0.56, iy: 0.5, r: 60, text: "RACER", side: "left" },
  ],
  tags: [{ text: "ENGINES OUT AT 35,000 FT", at: [/^The$/, 1], to: /^old$/, y: 1420, color: "#ffc83d" }],
  stamps: [{ text: "69 OF 69 SURVIVED", at: /^sixty-nine$/, y: 1500, size: 68 }],
};
