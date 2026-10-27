/* HT footage-first · moving the Cape Hatteras Lighthouse, 1999. Facts: assets/src/hatteras/facts.json (NPS, ASCE). No
   rights-clear photo of the move itself exists (NPS move photos are a volunteer's copyright), so the move is a diagram.
   Diagrams, simplified: "shore" = top-down, the beach shrinking from 1,500 ft (1870) to 120 ft (1970) in front of the tower;
   "move" = side view, the tower on roller dollies along track beams, a push jack shoving it 5 ft per stroke.
   Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function tower(c, x, base, h) { c.save(); c.translate(x, base); poly(c, [[-38, 0], [38, 0], [24, -h], [-24, -h]], "#f2efe6"); c.save(); c.beginPath(); c.moveTo(-38, 0); c.lineTo(38, 0); c.lineTo(24, -h); c.lineTo(-24, -h); c.closePath(); c.clip();
    c.fillStyle = "#1c1c1c"; for (let i = -6; i < 10; i++) { c.save(); c.translate(0, -i * 70); c.rotate(-0.5); c.fillRect(-120, -14, 240, 28); c.restore(); } c.restore();
    rr(c, -30, -h - 40, 60, 40, 6); c.fillStyle = "#1c1c1c"; c.fill(); circ(c, 0, -h - 20, 10, "#ffc83d"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    shore(c, t, vp, p, b) {
      const q = E.io(clamp((p - 0.1) / 0.7)), dist = lerp(1500, 120, q), year = Math.round(lerp(1870, 1970, q)), X = 300, sx = X + dist * 0.42;
      c.fillStyle = "#c9b48a"; c.fillRect(0, SY(820), 1080, SY(1460) - SY(820)); // land
      c.fillStyle = "#2f6f9f"; c.fillRect(sx, SY(820), 1080 - sx, SY(1460) - SY(820)); // sea
      c.strokeStyle = "#e9eef3"; c.lineWidth = 6; c.beginPath(); for (let y = SY(820); y <= SY(1460); y += 20) { const x = sx + 8 * Math.sin(y / 25 + t * 3); y === SY(820) ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
      circ(c, X, SY(1140), 26, "#1c1c1c"); circ(c, X, SY(1140), 14, "#f2efe6"); txt(c, "LIGHTHOUSE", X, SY(1200), `800 34px ${K.DISP}`, "#1c1c1c");
      c.save(); c.strokeStyle = "#ffc83d"; c.lineWidth = 5; c.setLineDash([14, 10]); c.beginPath(); c.moveTo(X + 30, SY(1140)); c.lineTo(sx - 6, SY(1140)); c.stroke(); c.restore();
      txt(c, `${year}`, 540, SY(720), `800 64px ${K.DISP}`, "#ffc83d");
      txt(c, `${Math.round(dist / 10) * 10 > 1490 ? "1,500" : Math.round(dist).toLocaleString("en-US")} FT TO THE SEA`, 540, SY(1540), `800 56px ${K.DISP}`, q > 0.9 ? "#ff6b4a" : "#ffffff");
    },
    move(c, t, vp, p, b) {
      const G = SY(1400), strokes = Math.min(6, Math.floor(p * 7)), frac = E.out(clamp(p * 7 - strokes)), x = 260 + 70 * (strokes + (strokes < 6 ? frac : 0));
      c.fillStyle = "#c9b48a"; c.fillRect(0, G + 40, 1080, SY(1560) - G - 40);
      c.fillStyle = "#6b6f75"; c.fillRect(60, G + 22, 960, 18); // track beams
      rr(c, x - 120, G - 10, 240, 32, 6); c.fillStyle = "#8a96a3"; c.fill(); // support frame
      for (let i = 0; i < 5; i++) circ(c, x - 100 + i * 50, G + 22, 12, "#3a3f46"); // roller dollies
      tower(c, x, G - 10, 560);
      const jx = x - 150, ext = 40 * (1 - frac); rr(c, jx - 90, G - 5, 70, 34, 6); c.fillStyle = "#ffc83d"; c.fill(); c.fillStyle = "#e9eef3"; c.fillRect(jx - 20, G + 5, 30 + ext, 14); // push jack
      txt(c, "PUSH JACK", jx - 55, G + 70, `800 32px ${K.DISP}`, "#ffc83d"); txt(c, "ROLLERS ON STEEL TRACK", 760, G + 80, `800 32px ${K.DISP}`, "#e9eef3");
      txt(c, "5 FEET PER PUSH", 540, SY(720), `800 56px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "National Park Service · public domain",
  beats: [
    { kind: "photo", src: "aerial", pw: 720, cy: 1080, z0: 1.0, z1: 1.07, label: "REAL PHOTO · CAPE HATTERAS, JAN 1999", credit: "U.S. Air Force · public domain" },
    { kind: "diagram", diagram: "shore", at: /^The$/, credit: "Curio diagram · NPS distances" },
    { kind: "photo", src: "habs", at: /^Crews$/, pw: 650, cy: 1080, z0: 1.0, z1: 1.06, label: "REAL PHOTO · 4,830 TONS OF BRICK", credit: "Jack E. Boucher, HABS / National Park Service · public domain" },
    { kind: "diagram", diagram: "move", at: /^and$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "newsite", at: /^Twenty-three$/, pw: 600, cy: 1080, z0: 1.0, z1: 1.06, label: "REAL PHOTO · ITS NEW SITE, INLAND", credit: "National Park Service · public domain" },
  ],
  nums: [["fifteen hundred", "1,500"], ["five thousand", "5,000"], ["Twenty-three", "23"]],
  marks: [{ at: 0.5, to: /^The$/, ix: 0.5, iy: 0.79, r: 60, text: "ON THE BEACH" }],
  stamps: [{ text: "2,900 FEET IN 23 DAYS", at: /^safe,$/, y: 1600, size: 60 }],
};
