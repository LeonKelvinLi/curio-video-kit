/* SK footage-first · Skylab's 1979 re-entry over Western Australia and the Shire of Esperance's A$400 littering fine, paid in
   2009 by a US radio host. Facts: assets/src/skylab/facts.json (NASA, ABC, Guinness, Perth Observatory). Diagram "fall",
   simplified: the orbit decays in a spiral until the station hits the atmosphere over the Indian Ocean and sheds a strip of
   pieces across Western Australia. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    fall(c, t, vp, p, b) {
      const CX = 540, CY = SY(1720), R = 400, q = E.io(clamp(p / 0.7)), land = clamp((p - 0.72) / 0.25);
      c.fillStyle = "#17344d"; circ(c, CX, CY, R, "#17344d"); c.strokeStyle = "rgba(143,211,255,.35)"; c.lineWidth = 3; c.beginPath(); c.arc(CX, CY, R, 0, 6.3); c.stroke();
      // a rough land mass (Western Australia) on the right of the disk
      c.fillStyle = "#6b5a3e"; c.beginPath(); c.moveTo(CX + 110, CY - 380); c.quadraticCurveTo(CX + 320, CY - 330, CX + 370, CY - 160); c.quadraticCurveTo(CX + 230, CY - 90, CX + 90, CY - 180); c.quadraticCurveTo(CX + 40, CY - 300, CX + 110, CY - 380); c.fill();
      txt(c, "AUSTRALIA", CX + 230, CY - 250, `800 30px ${K.DISP}`, "#e9eef3");
      // decaying orbit: a spiral from 1.3R down to the atmosphere
      c.strokeStyle = "#ffc83d"; c.lineWidth = 6; c.setLineDash([18, 14]); c.beginPath();
      const turns = 3.2, N = 220; for (let i = 0; i <= N * q; i++) { const u = i / N, a = -1.5708 + u * turns * 6.2832, r = lerp(R * 1.5, R * 1.03, u); const x = CX + r * Math.cos(a) * 0.8, y = CY + r * Math.sin(a) * 0.6; if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
      c.stroke(); c.setLineDash([]);
      const ue = q, ae = -1.5708 + ue * turns * 6.2832, re = lerp(R * 1.5, R * 1.03, ue), sx = CX + re * Math.cos(ae) * 0.8, sy = CY + re * Math.sin(ae) * 0.6;
      if (land < 1) { circ(c, sx, sy, 14, "#ffffff"); c.fillStyle = "#e9eef3"; c.fillRect(sx - 40, sy - 4, 80, 8); }
      if (land > 0) { c.save(); c.globalAlpha = land; c.strokeStyle = "#ff6b4a"; c.lineWidth = 10; c.beginPath(); c.moveTo(CX + 110, CY - 170); c.lineTo(CX + 310, CY - 230); c.stroke();
        for (let i = 0; i < 12; i++) circ(c, CX + 110 + i * 18 + 12 * K.hash(i), CY - 170 - i * 5 - 36 * K.hash(i + 3), 5 + 5 * K.hash(i + 7), "#ff6b4a"); c.restore(); }
      txt(c, land > 0.3 ? "PIECES ALONG A 150 KM STRIP" : "34,981 ORBITS, THEN THE AIR DRAGGED IT DOWN", 540, SY(700), `800 44px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "NASA · public domain",
  beats: [
    { kind: "photo", src: "orbit", pw: 1000, z0: 1.0, z1: 1.08, label: "REAL NASA PHOTO · SKYLAB, 1974", credit: "NASA · public domain" },
    { kind: "photo", src: "close", at: /^the$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL NASA PHOTO · SKYLAB, 1973", credit: "NASA · public domain" },
    { kind: "diagram", diagram: "fall", at: /^fell$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "monument", at: /^The$/, pw: 760, maxH: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · ESPERANCE MUSEUM", credit: "Orderinchaos · CC BY-SA 4.0" },
    { kind: "photo", src: "tank", at: /^Nobody$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL SKYLAB TANK · FOUND NEAR ESPERANCE", credit: "Craigboy · CC BY-SA 4.0" },
  ],
  nums: [["nineteen seventy-nine", "1979"], ["four hundred dollars", "$400"]],
  marks: [{ at: 0.5, to: /^the$/, ix: 0.5, iy: 0.5, r: 150, text: "77 TONS", side: "right" }],
  tags: [
    { text: "LITTERING · A$400", at: /^fined$/, to: /^Nobody$/, y: 1520, color: "#ffc83d" },
    { text: "UNPAID 1979 TO 2009", at: /^thirty$/, to: /^until$/, y: 1520, color: "#ffc83d" },
  ],
  stamps: [{ text: "PAID · 2009", at: /^settled$/, y: 1560, size: 64 }],
};
