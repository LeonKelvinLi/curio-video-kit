/* TN footage-first · "Galloping Gertie", the Tacoma Narrows Bridge collapse, 7 Nov 1940. Facts: assets/src/topic8/facts.json
   (WSDOT, Wikipedia's citations). Real film: Barney Elliott & Harbine Monroe, 1940, public domain (published, not renewed).
   Diagram "flutter", simplified: the deck seen end-on, twisting in a steady 42 mph wind with each swing bigger than the last,
   up to about 45 degrees. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, txt, poly } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    flutter(c, t, vp, p, b) {
      const amp = lerp(0.08, 0.78, E.in(clamp(p / 0.9))), ang = amp * Math.sin(t * 2 * Math.PI * 0.7), CX = 600, CY = SY(1130);
      for (let i = 0; i < 4; i++) { const y = SY(980) + i * 90, x = 60 + ((t * 260 + i * 80) % 220); c.save(); c.strokeStyle = "rgba(159,199,232,.8)"; c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 120, y); c.stroke(); poly(c, [[x + 140, y], [x + 116, y - 12], [x + 116, y + 12]], "rgba(159,199,232,.8)"); c.restore(); }
      txt(c, "42 MPH WIND", 180, SY(900), `800 38px ${K.DISP}`, "#9fc7e8");
      c.save(); c.translate(CX, CY); c.rotate(ang); rr(c, -300, -22, 600, 44, 6); c.fillStyle = "#8a96a3"; c.fill(); c.fillStyle = "#e9eef3"; c.fillRect(-300, -26, 600, 6); c.restore();
      c.strokeStyle = "#e9eef3"; c.lineWidth = 4; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(CX + s * 290 * Math.cos(ang), CY + s * 290 * Math.sin(ang)); c.lineTo(CX + s * 290, SY(820)); c.stroke(); }
      txt(c, `TWIST: ${Math.round(Math.abs(amp) * 180 / Math.PI)}°`, 540, SY(1450), `800 64px ${K.DISP}`, amp > 0.6 ? "#ff6b4a" : "#ffffff");
      txt(c, "EACH TWIST FED THE NEXT", 540, SY(720), `800 50px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Barney Elliott & Harbine Monroe, 1940 · Prelinger Archives · public domain",
  beats: [
    { kind: "clip", src: "twist", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL FILM · TACOMA NARROWS BRIDGE, 1940" },
    { kind: "clip", src: "deck", at: /^Its$/, pw: 1000, z0: 1.0, z1: 1.05, label: "REAL FILM · THE DECK, TILTING" },
    { kind: "diagram", diagram: "flutter", at: /^wind$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "opening", at: /^Workers$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · OPENING DAY, JULY 1, 1940", credit: "University of Washington Special Collections · no known restrictions" },
    { kind: "clip", src: "fall", at: [/^Its$/, 1], pw: 1000, z0: 1.0, z1: 1.05, label: "REAL FILM · NOVEMBER 7, 1940" },
  ],
  nums: [["forty-two", "42"]],
  stamps: [{ text: "OPEN FOR JUST 4 MONTHS", at: /^the$/, y: 1560, size: 60 }],
};
