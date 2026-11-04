/* FG footage-first · arm A (visual-first). Fly Geyser, Fly Ranch, Nevada: a 1964 geothermal test well whose seal reportedly failed, and
   the minerals and heat-loving microbes that built and coloured the cones. Facts: assets/src/flygeyser/facts.json. Whether the well
   was uncapped or badly capped is reported both ways. Diagram "well": hot water up a failed well, spray above, a mound growing. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    well(c, t, vp, p) {
      const g = SY(1000), X = 540, grow = E.out(clamp(p * 1.2));
      c.fillStyle = "#5a4a36"; c.fillRect(0, g, 1080, SY(1560) - g); c.fillStyle = "#3f3426"; c.fillRect(0, g + 240, 1080, SY(1560) - g - 240); c.fillStyle = "#8fb6c9"; c.fillRect(0, SY(640), 1080, g - SY(640));
      c.fillStyle = "#b5533c"; c.beginPath(); c.moveTo(X - 230, g); c.quadraticCurveTo(X, g - 260 * grow, X + 230, g); c.fill();
      c.fillStyle = "#17344d"; c.fillRect(X - 26, g - 10, 52, 520); c.fillStyle = "#ff6b4a"; const u = (t * 2) % 1; for (let i = 0; i < 9; i++) circ(c, X, g + 500 - ((i / 9 + u / 9) * 520), 16, "#ff8a5c");
      for (let i = 0; i < 26; i++) { const a = K.hash(i) * 1.2 - 0.6, s = (t * 1.1 + K.hash(i + 40)) % 1; circ(c, X + a * 240 * s, g - 260 * grow - 260 * s + 170 * s * s, 9 * (1 - s) + 3, "rgba(255,255,255,.85)"); }
      c.strokeStyle = "#ffc83d"; c.lineWidth = 10; c.beginPath(); c.moveTo(X - 60, g + 34); c.lineTo(X - 20, g + 10); c.lineTo(X + 16, g + 40); c.lineTo(X + 60, g + 12); c.stroke();
      txt(c, "SEAL FAILED", X + 240, g + 50, `800 44px ${K.DISP}`, "#ffc83d"); txt(c, "1964 TEST WELL", X - 250, g + 190, `800 40px ${K.DISP}`, "#ffffff"); txt(c, "HOT WATER", X + 210, g + 300, `800 40px ${K.DISP}`, "#ff8a5c");
    },
  });
})();
window.SPEC = {
  credit: "Jeremy C. Munns · public domain",
  beats: [
    { kind: "photo", src: "geyser", fit: "cover", fx: 0.34, fy: 0.46, z0: 1.05, z1: 1.16, label: "REAL PHOTO · FLY GEYSER, NEVADA", credit: "Jeremy C. Munns · public domain" },
    { kind: "photo", src: "wide", at: /^A$/, pw: 1000, iz: 1.2, fx: 0.55, z0: 1.0, z1: 1.06, label: "FLY RANCH · BLACK ROCK DESERT", credit: "RuggyBearLA · CC BY 2.0" },
    { kind: "diagram", diagram: "well", at: /^hot$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "close", at: /^Minerals$/, pw: 1000, iz: 1.2, fx: 0.48, z0: 1.0, z1: 1.07, label: "MINERALS + MICROBES", credit: "Ken Lund · CC BY-SA 2.0" },
    { kind: "photo", src: "geyser", at: /^nobody$/, pw: 1000, iz: 1.3, fx: 0.38, z0: 1.0, z1: 1.05, credit: "Jeremy C. Munns · public domain" },
  ],
  nums: [["nineteen sixty-four", "1964"]],
  stamps: [{ text: "NOBODY MEANT IT", at: /^nobody$/, y: 1570, size: 66 }],
};
