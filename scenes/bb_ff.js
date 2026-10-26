/* BB footage-first · the WWII "bat bomb" (Project X-Ray). Facts: assets/src/batbomb/facts.json. Diagrams, simplified:
   "release" = a bomb-shaped canister drops, a parachute opens, trays of bats spread out and roost under eaves of wooden houses;
   "backfire" = armed bats escape at the test base and the buildings catch fire. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function bat(c, x, y, s, flap) { c.save(); c.translate(x, y); c.scale(s, s); const f = Math.sin(flap) * 0.6;
    c.fillStyle = "#e9eef3"; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-18, -14 - 10 * f, -34, -4 + 8 * f); c.quadraticCurveTo(-18, -2, 0, 6); c.quadraticCurveTo(18, -2, 34, -4 + 8 * f); c.quadraticCurveTo(18, -14 - 10 * f, 0, 0); c.fill(); c.restore(); }
  function house(c, x, y, w, burn) { rr(c, x, y - 120, w, 120, 6); c.fillStyle = "#6b5640"; c.fill(); poly(c, [[x - 16, y - 120], [x + w / 2, y - 200], [x + w + 16, y - 120]], "#3f3328");
    rr(c, x + w * 0.38, y - 70, w * 0.24, 70, 4); c.fillStyle = "#2a221b"; c.fill();
    if (burn > 0) for (let i = 0; i < 6; i++) { const fx = x + w * (0.15 + 0.14 * i), h = (50 + 60 * K.hash(i + x)) * burn; poly(c, [[fx - 16, y - 150], [fx, y - 150 - h], [fx + 16, y - 150]], `rgba(255,${140 + 60 * K.hash(i)},40,${0.85 * burn})`); } }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    release(c, t, vp, p, b) {
      const drop = E.in(clamp(p / 0.35)), open = clamp((p - 0.35) / 0.15), spread = E.out(clamp((p - 0.45) / 0.45)), burn = clamp((p - 0.85) / 0.15);
      for (let i = 0; i < 4; i++) house(c, 70 + i * 250, SY(1560), 200, burn);
      const cx = 540, cy = SY(lerp(800, 1020, drop));
      if (open < 1) { c.save(); c.translate(cx, cy); rr(c, -40, -120, 80, 240, 40); c.fillStyle = "#8a96a3"; c.fill(); poly(c, [[-40, -100], [-80, -160], [-40, -60]], "#6f7a86"); poly(c, [[40, -100], [80, -160], [40, -60]], "#6f7a86"); c.restore(); }
      if (open > 0) { c.save(); c.globalAlpha = clamp(open * 2); c.fillStyle = "#e9eef3"; c.beginPath(); c.arc(cx, cy - 170, 130, Math.PI, 0); c.fill(); c.strokeStyle = "#e9eef3"; c.lineWidth = 3; for (const dx of [-120, -40, 40, 120]) { c.beginPath(); c.moveTo(cx + dx, cy - 170); c.lineTo(cx, cy - 40); c.stroke(); } c.restore(); }
      for (let i = 0; i < 40; i++) { if (spread <= 0) break; const tx = 90 + (i % 4) * 250 + 160 * K.hash(i), ty = SY(1420) + 30 * K.hash(i + 3), q = clamp(spread * (1.2 - 0.4 * K.hash(i + 5)));
        bat(c, lerp(cx, tx, q) + 40 * Math.sin(t * 3 + i) * (1 - q), lerp(cy, ty, q) - 120 * Math.sin(Math.PI * q), 0.9, t * 14 + i); }
      txt(c, burn > 0.3 ? "TIMED FIREBOMBS UNDER THE EAVES" : open > 0 ? "CANISTER OPENS · BATS SPREAD OUT" : "BOMB CASING FULL OF BATS", 540, SY(630), `800 46px ${K.DISP}`, "#ffc83d");
    },
    backfire(c, t, vp, p, b) {
      const burn = E.out(clamp((p - 0.25) / 0.5));
      rr(c, 80, SY(1560) - 260, 520, 260, 10); c.fillStyle = "#59616b"; c.fill(); c.beginPath(); c.ellipse(340, SY(1560) - 260, 260, 70, 0, Math.PI, 0); c.fillStyle = "#6b737d"; c.fill(); // hangar
      rr(c, 700, SY(1560) - 360, 90, 360, 6); c.fillStyle = "#6b5640"; c.fill(); rr(c, 670, SY(1560) - 420, 150, 70, 8); c.fillStyle = "#8a96a3"; c.fill(); // tower
      if (burn > 0) for (let i = 0; i < 14; i++) { const fx = 100 + 50 * i + 20 * K.hash(i), h = (80 + 120 * K.hash(i + 2)) * burn * (0.7 + 0.3 * Math.sin(t * 9 + i)); poly(c, [[fx - 26, SY(1560) - 230], [fx, SY(1560) - 230 - h], [fx + 26, SY(1560) - 230]], `rgba(255,${130 + 70 * K.hash(i)},40,${0.9 * burn})`); }
      for (let i = 0; i < 16; i++) { const q = clamp(p * 1.3 - 0.02 * i); bat(c, 540 + 420 * Math.cos(i * 0.9 + q * 3), SY(1000) - 200 * q + 120 * Math.sin(i * 1.7 + q * 4), 0.8, t * 14 + i); }
      txt(c, burn > 0.2 ? "THE TEST BASE CAUGHT FIRE" : "ARMED BATS ESCAPED", 540, SY(630), `800 50px ${K.DISP}`, burn > 0.2 ? "#ff6b4a" : "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "U.S. Army Air Forces · public domain",
  beats: [
    { kind: "photo", src: "canister", pw: 394, maxH: 1000, cy: 1150, z0: 1.0, z1: 1.05, label: "REAL US ARMY PHOTO · THE BAT BOMB", credit: "U.S. Army Air Forces, bat-bomb canister · public domain" },
    { kind: "photo", src: "bat", at: /^tiny$/, pw: 1000, iz: 1.35, fx: 0.43, fy: 0.55, z0: 1.0, z1: 1.06, label: "SAME SPECIES · FREE-TAILED BAT", credit: "USFWS / Ann Froschauer · public domain" },
    { kind: "photo", src: "cave", at: /^A$/, pw: 1000, z0: 1.0, z1: 1.07, label: "CARLSBAD CAVERNS BAT FLIGHT", credit: "NPS / Peter Jones, Carlsbad Caverns NP · public domain" },
    { kind: "diagram", diagram: "release", at: /^drop$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "fire", at: /^In$/, pw: 700, maxH: 1000, cy: 1150, z0: 1.0, z1: 1.06, label: "REAL PHOTO · CARLSBAD AIR BASE, 1943", credit: "U.S. Army Air Forces, Carlsbad Army Air Field fire, 1943 · public domain" },
    { kind: "photo", src: "swarm", at: [/^The$/, 1], fit: "cover", fx: 0.5, fy: 0.45, label: "REAL BATS · SAME SPECIES", credit: "USFWS / Ann Froschauer · public domain" },
  ],
  nums: [["nineteen forty-three", "1943"]],
  marks: [
    { at: 0.6, to: /^tiny$/, ix: 0.5, iy: 0.55, r: 80, text: "1,000 BATS" },
    { at: /^to$/, to: /^A$/, ix: 0.43, iy: 0.55, r: 150, text: "~10 GRAMS" },
    { at: /^escaped$/, to: [/^The$/, 1], ix: 0.17, iy: 0.84, r: 100, text: "BURNING" },
    { at: /^own$/, to: [/^The$/, 1], ix: 0.88, iy: 0.46, r: 80, text: "CONTROL TOWER", side: "left" },
  ],
  tags: [
    { text: "A DENTIST SAW THIS IN 1941", at: /^dentist's$/, to: /^drop$/, y: 1420, color: "#ffc83d" },
  ],
  stamps: [{ text: "CANCELLED 1944", at: /^cancelled,$/, y: 1210, size: 72 }],
};
