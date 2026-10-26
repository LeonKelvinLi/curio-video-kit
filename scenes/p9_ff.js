/* P9 footage-first · Jim LeBlanc's vacuum-chamber accident (14 Dec 1966, NASA Manned Spacecraft Center, Houston).
   Facts: Guinness World Records "Highest equivalent altitude exposure survived"; NASA. Suit ~3.8 psi -> ~0.1 psi in seconds;
   remembered saliva boiling; chamber repressurised in 87 s; no lasting effects. Real footage/photos: assets/src/p9/sources.json.
   Diagram: boiling point of water vs pressure (Antoine equation, water 1-100 C), drawn simplified. Engine: scenes/footage.js.
   VO says "NASA technician" (re-recorded 2026-10-26; the newsletter calls him a suit technician). */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, seg } = K, Wd = WORDS, w = re => Wd[K.ix(Wd, re)].s, SY = y => y - 420;
  const tHose = w(/^hose$/), tLoose = w(/^loose/), tWithin = w(/^Within$/), tPassed = w(/^passed$/), tThey = w(/^They$/);
  const boilC = psi => 1730.63 / (8.07131 - Math.log10(psi * 51.715)) - 233.426; // psi -> mmHg -> boiling point (C)
  function suit(c, x, y, s, hoseOff, dim) { // front view: helmet, torso, chest hose port
    c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -120, -20, 240, 300, 70); c.fillStyle = "#e6e0d2"; c.fill(); rr(c, -150, 20, 40, 220, 20); c.fill(); rr(c, 110, 20, 40, 220, 20); c.fill();
    circ(c, 0, -110, 105, "#e6e0d2"); rr(c, -70, -160, 140, 96, 40); c.fillStyle = `rgb(${Math.round(201 * dim)},${Math.round(163 * dim)},${Math.round(78 * dim)})`; c.fill();
    circ(c, 40, 80, 22, "#7d8894"); // hose port
    const hx = lerp(40, 260, hoseOff), hy = lerp(80, -40, hoseOff); c.strokeStyle = "#8a96a3"; c.lineWidth = 26; c.lineCap = "round";
    c.beginPath(); c.moveTo(hx, hy); c.bezierCurveTo(hx + 60, hy + 160, 360, 300, 380, 440); c.stroke(); c.restore();
  }
  window.DIAGRAMS = {
    boil(c, t, vp, p, b) {
      const off = E.out(inv(tHose, tLoose + 0.15, t)), fall = E.io(inv(tLoose, tWithin + 0.6, t)), out = inv(tPassed, tThey - 0.1, t);
      const psi = lerp(3.8, 0.1, fall), bp = boilC(psi), boiling = bp < 37;
      suit(c, 300, SY(1080), 1.05, off, 1 - 0.6 * out);
      if (off > 0 && off < 1) for (let i = 0; i < 26; i++) { const a = K.hash(i) * 6.28, r = 40 + 260 * off * K.hash(i + 5); circ(c, 300 + 44 + Math.cos(a) * r, SY(1164) + Math.sin(a) * r, 10 + 18 * K.hash(i + 9), `rgba(240,246,252,${0.6 * (1 - off)})`); }
      // readouts: suit pressure and the temperature water boils at
      K.readout(c, 1010, SY(680), "SUIT PRESSURE", psi.toFixed(1) + " PSI", { size: 84, color: fall >= 1 ? "#ffc83d" : "#ffffff" });
      K.readout(c, 1010, SY(850), "WATER BOILS AT", Math.round(bp) + "°C", { size: 84, color: boiling ? "#ff6b4a" : "#ffffff" });
      // body-temperature line on a thermometer bar
      const x0 = 640, x1 = 1010, yb = SY(1010), xp = v => lerp(x0, x1, clamp(v / 100)); rr(c, x0, yb, x1 - x0, 26, 13); c.fillStyle = "rgba(6,12,18,.7)"; c.fill();
      rr(c, x0, yb, Math.max(26, xp(bp) - x0), 26, 13); c.fillStyle = boiling ? "#ff6b4a" : "#7fb3d5"; c.fill();
      c.strokeStyle = "#ffc83d"; c.lineWidth = 5; seg(c, xp(37), yb - 18, xp(37), yb + 44); txt(c, "BODY 37°C", xp(37), yb + 74, `700 32px ${K.DISP}`, "#ffc83d");
      // saliva: a droplet that starts to bubble once the boiling point drops below body temperature
      const dx = 300, dy = SY(1490), bub = inv(0, 0.4, (37 - bp) / 37);
      c.save(); c.beginPath(); c.moveTo(dx, dy - 70); c.bezierCurveTo(dx + 70, dy, dx + 60, dy + 60, dx, dy + 60); c.bezierCurveTo(dx - 60, dy + 60, dx - 70, dy, dx, dy - 70); c.fillStyle = "#9fd3f0"; c.fill(); c.restore();
      for (let i = 0; i < 12; i++) { const ph = (t * (1.2 + K.hash(i)) + K.hash(i + 3)) % 1; if (bub > 0) circ(c, dx - 34 + 68 * K.hash(i + 7), dy + 40 - 90 * ph, (5 + 9 * K.hash(i + 2)) * bub, `rgba(255,255,255,${0.85 * (1 - ph)})`); }
      txt(c, boiling ? "SALIVA BOILS" : "SALIVA", dx, dy + 110, `800 40px ${K.DISP}`, boiling ? "#ff6b4a" : "#e9eef3");
      if (out > 0) { c.fillStyle = `rgba(0,0,0,${0.55 * E.in(out)})`; c.fillRect(vp.x, vp.y, vp.w, vp.h); }
    },
  };
})();
window.SPEC = {
  fps: 24, credit: "NASA · public domain",
  nums: [["nineteen sixty-six", "1966"], ["eighty-seven", "87"]],
  beats: [
    { kind: "clip", src: "suit", pw: 1000, z0: 1.0, z1: 1.07, label: "REAL NASA FILM · HOUSTON, 1966", credit: "NASA film, Houston 1966 · National Archives 255-FR-5588" },
    { kind: "clip", src: "hookup", at: /^In$/, pw: 1000, z0: 1.02, z1: 1.08, label: "REAL NASA FILM · SUIT TEST, 1966", credit: "NASA film, Houston 1966 · National Archives 255-FR-5588" },
    { kind: "photo", src: "leblanc", at: /^Jim$/, pw: 440, z0: 1.0, z1: 1.06, label: "JIM LEBLANC", credit: "NASA Space News Roundup, Jan 6 1967 · public domain" },
    { kind: "photo", src: "chamber", at: /^spacesuit$/, pw: 620, z0: 1.0, z1: 1.06, label: "REAL NASA PHOTO · THE 8-FT CHAMBER", credit: "NASA photo S68-38051 · the chamber he was in (1968)" },
    { kind: "diagram", diagram: "boil", at: /^when$/, credit: "Curio diagram · boiling point vs pressure, simplified" },
    { kind: "photo", src: "page", at: /^They$/, pw: 1000, maxH: 1150, fy: 0.30, fy1: 0.40, z0: 1.0, z1: 1.04, label: "REAL NASA NEWSLETTER · JAN 1967", credit: "NASA Space News Roundup, Jan 6 1967 · public domain" },
    { kind: "photo", src: "frame4", at: /^and$/, pw: 960, z0: 1.0, z1: 1.06, label: "FROM NASA'S TEST FILM", credit: "Frame from the test film, printed by NASA Jan 6 1967" },
  ],
  counter: { label: "AIR BACK IN", at: /^They$/, to: /^and$/, y: 1500, values: [[/^They$/, "…"], [/^eighty-seven$/, "87 SEC"]] },
  stamps: [{ text: "WOKE UP FINE", at: /^woke$/, y: 1570, size: 72 }],
};
