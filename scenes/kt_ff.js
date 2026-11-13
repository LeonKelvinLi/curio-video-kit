/* KT footage-first · arm C (micro-story, 38 s). Homan Walsh's kite and the first Niagara bridge, 1848; the railway suspension bridge
   of 1855; Harriet Tubman and Joe Bailey, 1856. Facts: assets/src/niagarakite/facts.json. Much of the kite story is Walsh's own
   retelling; the prize is left out. No portrait of Walsh is rights-clear, so he is never shown. Every picture is labelled with its
   own year. Diagram "pull", simplified side view of the gorge: string, then cord, then rope, then wire cable. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  const W = re => WORDS[K.ix(WORDS, re)].s, STEPS = [["STRING", W(/^string$/), 3, "#e9eef3"], ["CORD", W(/^cord$/), 7, "#e9eef3"], ["ROPE", W(/^rope,$/), 13, "#d9b98a"], ["WIRE CABLE", W(/^cable/), 20, "#ffc83d"]];
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    pull(c, t) {
      const LX = 250, RX = 830, TOP = SY(1080), BOT = SY(1640);
      // river and the two cliffs
      c.fillStyle = "#24445c"; c.fillRect(LX, SY(1740), RX - LX, 300);
      c.strokeStyle = "#8fd3ff"; c.lineWidth = 5; c.setLineDash([30, 34]); c.lineDashOffset = -t * 90; [1780, 1830].forEach(y => { c.beginPath(); c.moveTo(LX, SY(y)); c.lineTo(RX, SY(y)); c.stroke(); }); c.setLineDash([]);
      c.fillStyle = "#4a4138"; c.fillRect(0, TOP, LX, BOT - TOP + 300); c.fillRect(RX, TOP, 1080 - RX, BOT - TOP + 300);
      c.fillStyle = "#5d5246"; for (let i = 0; i < 7; i++) { c.fillRect(LX - 26, TOP + 40 + i * 78, 26, 30); c.fillRect(RX, TOP + 70 + i * 78, 26, 30); }
      c.fillStyle = "#3f6a45"; c.fillRect(0, TOP - 14, LX, 14); c.fillRect(RX, TOP - 14, 1080 - RX, 14);
      txt(c, "CANADA", LX / 2, TOP + 70, `800 38px ${K.DISP}`, "#e9eef3"); txt(c, "USA", (RX + 1080) / 2, TOP + 70, `800 38px ${K.DISP}`, "#e9eef3");
      // the line across: each step sweeps over from the left, thicker than the last
      let k = 0; STEPS.forEach((s, i) => { if (t >= s[1]) k = i; });
      const line = (i, q) => { const s = STEPS[i], sag = 80; c.strokeStyle = s[3]; c.lineWidth = s[2]; c.lineCap = "round"; c.beginPath(); let x, y;
        for (let j = 0; j <= 60 * q; j++) { const u = j / 60; x = lerp(LX, RX, u); y = TOP - 14 + sag * 4 * u * (1 - u); if (j === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); return [x, y]; };
      const q = E.out(clamp((t - STEPS[k][1]) / 0.75)); if (k > 0) line(k - 1, 1); const [hx, hy] = line(k, q);
      if (k === 0) { // the kite on the end of the string
        const kx = hx + 60, ky = hy - 150 - 20 * Math.sin(t * 5); c.strokeStyle = "#e9eef3"; c.lineWidth = 3; c.beginPath(); c.moveTo(hx, hy); c.lineTo(kx, ky + 50); c.stroke();
        c.fillStyle = "#ff5a4d"; c.beginPath(); c.moveTo(kx, ky - 62); c.lineTo(kx + 44, ky); c.lineTo(kx, ky + 62); c.lineTo(kx - 44, ky); c.closePath(); c.fill(); c.strokeStyle = "#ffffff"; c.lineWidth = 3; c.beginPath(); c.moveTo(kx, ky - 62); c.lineTo(kx, ky + 62); c.moveTo(kx - 44, ky); c.lineTo(kx + 44, ky); c.stroke();
      } else if (q < 1) circ(c, hx, hy, 12, "#ffffff");
      // the four steps, lit one by one
      STEPS.forEach((s, i) => { const on = i <= k, y = SY(700) + i * 78, a = on ? E.back(clamp((t - s[1]) / 0.3)) : 1; c.save(); c.translate(540, y); c.scale(lerp(1.2, 1, a), lerp(1.2, 1, a)); c.globalAlpha = on ? 1 : 0.28;
        txt(c, (i + 1) + ". " + s[0], 0, 0, `800 ${i === k ? 66 : 50}px ${K.DISP}`, i === k ? "#ffc83d" : "#ffffff"); c.restore(); });
    },
  });
})();
window.SPEC = {
  credit: "Charles Parsons, Currier & Ives, 1856 · public domain",
  beats: [
    { kind: "photo", src: "litho", pw: 1000, z0: 1.0, z1: 1.08, label: "THE BRIDGE · PRINT FROM 1856" },
    { kind: "diagram", diagram: "pull", at: /^His$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "foot", at: /^It$/, pw: 1000, iz: 1.8, fx: 0.55, fy: 0.72, z0: 1.0, z1: 1.07, label: "NIAGARA GORGE · PRINT FROM 1849", credit: "Charles Parsons, 1849 · public domain" },
    { kind: "photo", src: "ellet", at: /^engineer$/, pw: 820, maxH: 900, cy: 1030, z0: 1.0, z1: 1.07, label: "THE ENGINEER: CHARLES ELLET JR.", credit: "H. B. Hall, engraving, 1871 · public domain" },
    { kind: "photo", src: "foot", at: /^Sixteen/, pw: 1000, iz: 2.0, fx: 0.74, fy: 0.73, z0: 1.0, z1: 1.05, label: "THE CANADIAN SIDE", credit: "Charles Parsons, 1849 · public domain" },
    { kind: "photo", src: "foot", at: [/^The$/, 1], pw: 1000, iz: 2.3, fx: 0.52, fy: 0.78, z0: 1.0, z1: 1.05, label: "THE RIVER BELOW", credit: "Charles Parsons, 1849 · public domain" },
    { kind: "photo", src: "ice", at: /^ice$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · NIAGARA ICE, 1883", credit: "George Barker, 1883 · public domain" },
    { kind: "photo", src: "car", at: /^Then$/, pw: 1000, z0: 1.0, z1: 1.05, label: "ELLET'S BASKET RODE THE CABLE", credit: "Buffalo Historical Society, 1921 · public domain" },
    { kind: "photo", src: "foot", at: /^footbridge$/, pw: 1000, z0: 1.0, z1: 1.07, label: "THE 1848 FOOTBRIDGE · PRINT, 1849", credit: "Charles Parsons, 1849 · public domain" },
    { kind: "photo", src: "train", at: /^By$/, pw: 820, maxH: 940, cy: 1030, z0: 1.0, z1: 1.07, label: "REAL PHOTO · ABOUT 1860", credit: "Unknown photographer, about 1860 · public domain" },
    { kind: "photo", src: "tubman", at: /^Harriet$/, pw: 780, maxH: 880, cy: 1000, fy: 0.4, z0: 1.0, z1: 1.06, label: "HARRIET TUBMAN · REAL PHOTO", credit: "Harvey B. Lindsley, Library of Congress · public domain" },
  ],
  nums: [["eighteen forty-eight", "1848"], ["eight hundred", "800"], ["eighteen fifty-five", "1855"], ["eighteen fifty-six", "1856"]],
  tags: [{ text: "800 FEET ACROSS", at: /^eight$/, to: /^engineer$/, y: 1560, color: "#ffc83d" }],
  stamps: [
    { text: "STRING SNAPPED", at: /^snapped$/, to: /^ice$/, y: 1570, size: 64 },
    { text: "STRANDED 8 DAYS", at: /^stranded$/, to: /^Then$/, y: 1570, size: 64 },
    { text: "IT HELD", at: /^held\.$/, to: /^footbridge$/, y: 1570, size: 80 },
    { text: "TO FREEDOM · 1856", at: /^across$/, y: 1590, size: 62 },
  ],
};
