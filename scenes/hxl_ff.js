/* HXL footage-first · arm C (micro-story, 38.5 s: the kit's first long reel). The Hoxne Hoard, Suffolk, 16 Nov 1992. Line 1 is the whole
   act; every later beat is one true reveal with its own picture. Facts: assets/src/hoxne/facts.json. Same-story pair with HX (same first
   picture). No photo of the hammer is rights-clear, so none is implied. Diagram "field", simplified: a detector sweeping a field for a
   lost hammer (not a map, not to scale). */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    field(c, t, vp, p) {
      const G = SY(1180);
      c.fillStyle = "#33482c"; c.fillRect(0, G, 1080, SY(1640) - G); c.strokeStyle = "rgba(20,32,18,.55)"; c.lineWidth = 6;
      for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(-40 + i * 190, SY(1640)); c.lineTo(340 + i * 70, G); c.stroke(); }
      txt(c, "SUFFOLK, 1992", 540, SY(740), `800 72px ${K.DISP}`, "#ffffff");
      txt(c, "LOST: ONE HAMMER", 540, SY(840), `800 54px ${K.DISP}`, "#ffc83d");
      // the lost hammer, lying in the field
      c.save(); c.translate(250, G + 230); c.rotate(-0.35); c.scale(1.6, 1.6); rr(c, -90, -9, 180, 18, 6); c.fillStyle = "#b98a55"; c.fill(); rr(c, 60, -34, 44, 68, 6); c.fillStyle = "#9aa3ad"; c.fill(); c.restore();
      txt(c, "?", 250, G + 100, `800 72px ${K.DISP}`, "#ffc83d");
      // the detector: shaft, coil and a pulsing sweep, walking across the field
      const a = E.out(clamp((p - 0.3) * 4)); if (a <= 0) return;
      const x = lerp(900, 620, E.sine(clamp((p - 0.3) / 0.7))), sw = Math.sin(t * 3.2) * 60, cx = x + sw, cy = G + 210;
      c.save(); c.globalAlpha = a; c.strokeStyle = "#e9eef3"; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.moveTo(x + 130, G - 190); c.lineTo(cx, cy - 10); c.stroke();
      c.fillStyle = "#e9eef3"; c.beginPath(); c.ellipse(cx, cy, 78, 22, 0, 0, 6.3); c.fill(); c.fillStyle = "#33482c"; c.beginPath(); c.ellipse(cx, cy, 50, 11, 0, 0, 6.3); c.fill();
      const q = (t * 1.3) % 1; c.globalAlpha = a * (1 - q); c.strokeStyle = "#ffc83d"; c.lineWidth = 6; c.beginPath(); c.ellipse(cx, cy + 20, 78 + q * 120, 22 + q * 34, 0, 0, 6.3); c.stroke(); c.restore();
      txt(c, "METAL DETECTOR", x + 70, G - 240, `800 40px ${K.DISP}`, "#e9eef3");
    },
  });
})();
window.SPEC = {
  credit: "Mike Peel · CC BY-SA 4.0",
  beats: [
    { kind: "photo", src: "case", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL ROMAN TREASURE · HOXNE HOARD" },
    { kind: "photo", src: "coins", at: /^Fourteen$/, pw: 1000, z0: 1.0, z1: 1.08, label: "GOLD AND SILVER COINS" },
    { kind: "photo", src: "ladles", at: /^about$/, pw: 1000, z0: 1.0, z1: 1.06, label: "SILVER LADLES · HOXNE HOARD", credit: "TimeTravelRome · CC BY 2.0" },
    { kind: "diagram", diagram: "field", at: /^In$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "chain", at: [/^The$/, 0], pw: 900, maxH: 900, cy: 965, z0: 1.0, z1: 1.04, label: "GOLD BODY CHAIN · HOXNE HOARD", credit: "BabelStone · CC0" },
    { kind: "photo", src: "chest", at: /^Archaeologists$/, pw: 1000, z0: 1.0, z1: 1.06, label: "AS IT LAY IN THE CHEST · RECONSTRUCTION" },
    { kind: "photo", src: "case", at: /^from$/, pw: 1000, iz: 1.7, fx: 0.66, fy: 0.3, z0: 1.0, z1: 1.06, label: "GOLD BRACELETS · HOXNE HOARD" },
    { kind: "photo", src: "tools", at: [/^It$/, 0], pw: 900, maxH: 900, cy: 965, z0: 1.0, z1: 1.04, label: "SILVER TOOLS · HOXNE HOARD", credit: "Fæ · CC BY-SA 3.0" },
    { kind: "photo", src: "chest", at: /^And$/, pw: 1000, iz: 1.6, fx: 0.7, fy: 0.62, z0: 1.0, z1: 1.08, label: "SILVER VESSELS · HOXNE HOARD" },
    { kind: "photo", src: "case", at: [/^It$/, 1], pw: 1000, z0: 1.08, z1: 1.0, label: "NOW IN THE BRITISH MUSEUM" },
  ],
  nums: [["fourteen thousand eight hundred sixty-five", "14,865"], ["two hundred", "200"], ["nineteen ninety-two", "1992"], ["four oh seven", "407"], ["one point seven five million pounds", "£1.75 million"]],
  stamps: [
    { text: "14,865 COINS", at: /^coins/, to: /^about$/, y: 1570, size: 80 },
    { text: "REPORTED IT", at: /^reported/, to: /^Archaeologists$/, y: 1570, size: 76 },
    { text: "BURIED AFTER AD 407", at: /^four$/, to: [/^It$/, 0], y: 1570, size: 62 },
    { text: "£1.75 MILLION", at: /^million/, to: /^And$/, y: 1570, size: 84 },
    { text: "HAMMER: FOUND", at: /^found$/, to: [/^It$/, 1], y: 1570, size: 72 },
  ],
};
