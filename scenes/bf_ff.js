/* BF footage-first · Blood Falls, Taylor Glacier, Antarctica. Facts: assets/src/bloodfalls/facts.json (Mikucki et al. 2009,
   Badgeley et al. 2017, Sklute et al. 2022, NSF/USAP). Diagram "brine", simplified cross-section: a pocket of salty,
   iron-rich, oxygen-free brine under the glacier seeps up a crack, comes out clear and turns red where it meets air.
   Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function label(c, text, x, y, color) { c.save(); c.font = `800 38px ${K.DISP}`; const w = c.measureText(text).width + 26; rr(c, x - w / 2, y - 28, w, 56, 10); c.fillStyle = "rgba(6,10,14,.88)"; c.fill(); txt(c, text, x, y + 2, `800 38px ${K.DISP}`, color); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    brine(c, t, vp, p, b) {
      const seep = E.out(clamp((p - 0.15) / 0.35)), red = clamp((p - 0.55) / 0.3);
      c.fillStyle = "#4a3b31"; c.fillRect(0, SY(1430), 1080, SY(1560) - SY(1430)); // bedrock
      poly(c, [[0, SY(820)], [760, SY(820)], [820, SY(1100)], [840, SY(1430)], [0, SY(1430)]], "#e6eef4"); // glacier
      c.strokeStyle = "rgba(160,190,210,.6)"; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(60 + i * 120, SY(840)); c.lineTo(90 + i * 120, SY(1400)); c.stroke(); }
      c.beginPath(); c.ellipse(380, SY(1380), 280, 50, 0, 0, 6.3); c.fillStyle = "#3c4a5c"; c.fill(); // brine pocket
      label(c, "SALTY, IRON-RICH BRINE · NO OXYGEN", 380, SY(1470), "#9fc7e8");
      if (seep > 0) { c.save(); c.strokeStyle = "#7fa6c4"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(600, SY(1360)); c.quadraticCurveTo(760, SY(1300), 800 + 40 * seep, lerp(SY(1360), SY(1180), seep)); c.stroke(); c.restore(); }
      if (seep >= 1) { const g = c.createLinearGradient(820, SY(1160), 1080, SY(1420)); g.addColorStop(0, `rgba(170,190,205,${1 - red})`); g.addColorStop(0, `rgba(196,62,30,${red})`); poly(c, [[830, SY(1160)], [900, SY(1170)], [1080, SY(1400)], [1080, SY(1430)], [850, SY(1430)]], red > 0 ? `rgba(${lerp(170, 196, red)},${lerp(190, 62, red)},${lerp(205, 30, red)},1)` : "#aabecd"); }
      label(c, red > 0.4 ? "RUSTS RED IN AIR" : "COMES OUT CLEAR", 860, SY(1090), red > 0.4 ? "#ff6b4a" : "#e9eef3");
      txt(c, "WHY IT LOOKS LIKE BLOOD", 540, SY(700), `800 50px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Peter Rejcek / U.S. National Science Foundation · public domain",
  beats: [
    { kind: "photo", src: "falls", pw: 1000, z0: 1.0, z1: 1.08, label: "REAL PHOTO · BLOOD FALLS, ANTARCTICA", credit: "Peter Rejcek / U.S. National Science Foundation · public domain" },
    { kind: "diagram", diagram: "brine", at: /^The$/, credit: "Curio diagram · simplified, after NSF" },
    { kind: "photo", src: "aerial", at: /^Inside$/, pw: 1000, iz: 1.3, fx: 0.45, fy: 0.45, z0: 1.0, z1: 1.08, label: "REAL PHOTO · THE RED FAN FROM ABOVE", credit: "Peter Rejcek / U.S. National Science Foundation · public domain" },
    { kind: "photo", src: "ground", at: /^So$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · TAYLOR GLACIER", credit: "Peter Rejcek / U.S. National Science Foundation · public domain" },
  ],
  marks: [
    { at: 0.6, to: /^The$/, ix: 0.055, iy: 0.84, r: 50, text: "A TENT, FOR SCALE" },
    { at: /^So$/, ix: 0.68, iy: 0.74, r: 70, text: "PEOPLE", side: "left" },
  ],
  tags: [
    { text: "NO LIGHT · NO OXYGEN", at: /^dark,$/, to: /^microbes$/, y: 1460, color: "#9fc7e8" },
    { text: "MICROBES USE IRON THE WAY WE USE OXYGEN", at: /^microbes$/, to: /^So$/, y: 1460, color: "#ffc83d" },
  ],
  stamps: [{ text: "NOT BLOOD. RUST.", at: /^bleeding;$/, y: 1480, size: 64 }],
};
