/* LP footage-first · Lake Peigneur, Louisiana, 20 Nov 1980: a Texaco rig drilled into the Diamond Crystal salt mine and the
   lake drained into it. Facts: assets/src/peigneur/facts.json (Washington Post, UPI, Louisiana Geological Survey 1982, EPA
   2002). No rights-clear photo of the whirlpool exists, so the event is a diagram "drain", simplified cross-section: shallow
   lake, salt dome with mine rooms, the drill pipe breaks in, the lake pours down, the canal reverses. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    drain(c, t, vp, p, b) {
      const hit = E.out(clamp(p / 0.2)), drainp = clamp((p - 0.2) / 0.55), canal = clamp((p - 0.7) / 0.3);
      const GY = SY(940), lakeH = lerp(90, 8, drainp);
      c.fillStyle = "#5a4a34"; c.fillRect(100, GY, 880, 640);                      // ground
      poly(c, [[300, SY(1580)], [360, SY(1120)], [700, SY(1120)], [780, SY(1580)]], "#c9c0ae"); // salt dome
      txt(c, "SALT", 540, SY(1180), `800 30px ${K.DISP}`, "#5a4a34");
      for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) { const x = 380 + i * 80, y = SY(1270) + r * 100; c.fillStyle = "#2a2420"; c.fillRect(x, y, 56, 70);
        const wl = clamp(drainp * 1.6 - (1 - r) * 0.4); c.fillStyle = "#3f7fb0"; c.fillRect(x, y + 70 - 70 * wl, 56, 70 * wl); }  // mine rooms fill
      txt(c, "MINE ROOMS · 1,300 FT DOWN", 540, SY(1510), `800 30px ${K.DISP}`, "#e9eef3");
      c.fillStyle = "#3f7fb0"; c.fillRect(100, GY - lakeH, 880, lakeH);               // lake
      txt(c, "LAKE · A FEW FEET DEEP", 120, GY - 125, `800 28px ${K.DISP}`, "#8fd3ff", "left");
      const DX = 520; c.strokeStyle = "#e9eef3"; c.lineWidth = 6; c.beginPath(); c.moveTo(DX, GY - 160); c.lineTo(DX, lerp(GY - 160, SY(1290), hit)); c.stroke(); // drill pipe
      poly(c, [[DX - 40, GY - 150], [DX + 40, GY - 150], [DX + 10, GY - 215], [DX - 10, GY - 215]], "#e9eef3"); txt(c, "RIG", DX + 60, GY - 190, `800 30px ${K.DISP}`, "#e9eef3", "left");
      if (hit >= 1 && drainp < 1) { c.save(); c.strokeStyle = "#8fd3ff"; c.lineWidth = 5; c.setLineDash([14, 12]); c.lineDashOffset = -t * 400; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(DX + i * 14, GY - lakeH); c.lineTo(DX + i * 14, SY(1270)); c.stroke(); } c.restore();
        for (let k = 0; k < 3; k++) { c.save(); c.strokeStyle = "#8fd3ff"; c.lineWidth = 4; c.beginPath(); c.ellipse(DX, GY - lakeH, 40 + k * 50, 12 + k * 14, 0, 0, 6.3); c.stroke(); c.restore(); } }
      for (let i = 0; i < 4; i++) { const bx = 160 + i * 110 + (drainp > 0 ? (DX - 160 - i * 110) * E.in(clamp(drainp * 1.4 - i * 0.15)) : 0), s = clamp(drainp * 1.4 - i * 0.15), by = GY - lakeH - 12 + 60 * s; c.save(); c.translate(bx, by); c.rotate(0.6 * s); c.fillStyle = "#b8894f"; c.fillRect(-36, -12, 72, 24); c.restore(); }
      if (canal > 0) { c.save(); c.globalAlpha = canal; c.strokeStyle = "#8fd3ff"; c.lineWidth = 8; c.beginPath(); c.moveTo(1000, GY - 40); c.lineTo(760, GY - 40); c.stroke(); poly(c, [[760, GY - 40], [800, GY - 62], [800, GY - 18]], "#8fd3ff"); txt(c, "FROM THE GULF", 1000, GY - 80, `800 28px ${K.DISP}`, "#8fd3ff", "right"); c.restore(); }
      txt(c, canal > 0.3 ? "THEN THE CANAL RAN BACKWARDS" : drainp > 0.1 ? "THE LAKE POURED INTO THE MINE" : "THE DRILL BROKE INTO A MINE ROOM", 540, SY(700), `800 44px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "USGS · public domain",
  beats: [
    { kind: "photo", src: "aerial", pw: 1000, maxH: 1060, z0: 1.0, z1: 1.08, label: "REAL AERIAL · LAKE PEIGNEUR, LOUISIANA", credit: "USGS National Map · public domain" },
    { kind: "photo", src: "map63", at: /^In$/, pw: 1000, maxH: 1060, iz: 1.3, fx: 0.45, fy: 0.4, z0: 1.0, z1: 1.06, label: "USGS MAP · 1963, BEFORE", credit: "USGS topographic map, Delcambre quad · public domain" },
    { kind: "diagram", diagram: "drain", at: [/^A$/, 1], credit: "Curio diagram · simplified" },
    { kind: "photo", src: "map94", at: /^Every$/, pw: 1000, maxH: 1060, iz: 1.3, fx: 0.55, fy: 0.45, z0: 1.0, z1: 1.06, label: "USGS MAP · 1994, AFTER", credit: "USGS topographic map, Delcambre quad · public domain" },
    { kind: "photo", src: "wide", at: /^most$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL AERIAL · THE LAKE TODAY", credit: "USGS National Map · public domain" },
  ],
  nums: [["nineteen eighty", "1980"]],
  marks: [
    { at: 0.5, to: /^In$/, ix: 0.5, iy: 0.5, r: 150, text: "THE LAKE", side: "right" },
    { at: /^Peigneur,$/, to: [/^A$/, 1], ix: 0.62, iy: 0.46, r: 70, text: "JEFFERSON ISLAND", side: "left" },
    { at: /^worker$/, to: /^most$/, ix: 0.66, iy: 0.5, r: 90, text: "68 ACRES GONE", side: "left" },
  ],
  tags: [{ text: "RIG + 10 BARGES + TUG, GONE IN 3 HOURS", at: /^barges,$/, to: /^Every$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "NOBODY DIED", at: /^died,$/, y: 1560, size: 64 }],
};
