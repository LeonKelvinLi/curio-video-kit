/* PG footage-first · B. F. Skinner's Project Pigeon (WWII). Facts: assets/src/pigeon/facts.json (Skinner, "Pigeons in a
   Pelican", 1960). No rights-clear photo of the pigeon nose cone, so the steering is a diagram. Diagram "peck", simplified: a
   lens puts the target ship on a round screen; when the ship drifts off-center the pecks land off-center, the fins correct,
   and the ship slides back to the middle. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function ship(c, x, y) { poly(c, [[x - 110, y], [x + 110, y], [x + 80, y + 26], [x - 90, y + 26]], "#e9eef3"); rr(c, x - 40, y - 34, 60, 34, 4); c.fillStyle = "#e9eef3"; c.fill(); c.fillRect(x + 30, y - 60, 8, 60); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    peck(c, t, vp, p, b) {
      const CX = 540, CY = SY(1060), drift = p < 0.25 ? 0 : p < 0.5 ? E.io((p - 0.25) / 0.25) : 1 - E.io(clamp((p - 0.55) / 0.3)), sx = CX - 170 * drift;
      circ(c, CX, CY, 290, "#1d2a22"); c.save(); c.beginPath(); c.arc(CX, CY, 290, 0, 6.3); c.clip(); c.fillStyle = "#24364a"; c.fillRect(CX - 300, CY + 20, 600, 300); ship(c, sx, CY - 10); c.restore();
      c.strokeStyle = "rgba(255,200,61,.6)"; c.lineWidth = 3; c.beginPath(); c.moveTo(CX - 30, CY); c.lineTo(CX + 30, CY); c.moveTo(CX, CY - 30); c.lineTo(CX, CY + 30); c.stroke();
      for (let i = 0; i < 6; i++) { const k = Math.floor(t * 6) - i; if (k < 0) continue; const px = sx + 30 * Math.sin(k * 2.1), py = CY - 6 + 14 * Math.cos(k * 1.3), a = 1 - i / 6; c.save(); c.globalAlpha = a; circ(c, px, py, 9, "#ffc83d"); c.restore(); }
      const fin = clamp(drift * 1.2) * (p > 0.5 ? 1 : 0); c.save(); c.translate(CX, SY(1440)); c.rotate(-0.5 * fin); rr(c, -90, -10, 180, 20, 8); c.fillStyle = "#8a96a3"; c.fill(); c.restore(); txt(c, "FINS", CX, SY(1490), `800 32px ${K.DISP}`, "#8a96a3");
      txt(c, p > 0.5 ? "FINS STEER IT BACK TO CENTER" : drift > 0.2 ? "SHIP DRIFTS · PECKS GO OFF-CENTER" : "THE PIGEON PECKS AT THE SHIP", 540, SY(700), `800 46px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Public domain",
  beats: [
    { kind: "photo", src: "pelican", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · THE PELICAN MISSILE", credit: "National Bureau of Standards (NIST) · public domain" },
    { kind: "diagram", diagram: "peck", at: /^A$/, credit: "Curio diagram · after Skinner, 1960" },
    { kind: "photo", src: "pigeon", at: /^Each$/, pw: 1000, z0: 1.0, z1: 1.08, label: "A ROCK PIGEON", credit: "Public domain" },
    { kind: "photo", src: "pelican2", at: /^It$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · PELICAN GLIDE BOMB", credit: "National Bureau of Standards (NIST) · public domain" },
  ],
  marks: [{ at: 0.6, to: /^A$/, ix: 0.9, iy: 0.5, r: 70, text: "PIGEONS RODE HERE", side: "left" }],
  tags: [
    { text: "3 PIGEONS · MAJORITY VOTE", at: /^they$/, to: /^It$/, y: 1460, color: "#ffc83d" },
    { text: "'BETTER THAN RADAR!' (PER SKINNER)", at: /^expert$/, to: /^but$/, y: 1520, color: "#ffc83d" },
  ],
  stamps: [{ text: "CANCELLED", at: /^cancelled\.$/, y: 1520, size: 72 }],
};
