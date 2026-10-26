/* HB footage-first · Hubble's flawed mirror and the 1993 fix. Facts: assets/src/hubble/facts.json (NASA, 1990 Allen Report).
   Diagram "optics", simplified: parallel starlight hits the primary mirror; rays near the centre meet at one focus, rays off
   the too-flat edge meet farther out, so a star smears into a blur. With b.fix, a pair of small corrective mirrors (COSTAR)
   sends the edge rays to the same point and the star is sharp. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, txt } = K, SY = y => y - 420;
  const YC = SY(1060), MX = 930, F1 = [400, YC], F2 = [250, YC];
  const mirrorX = y => MX + 0.00055 * (y - YC) * (y - YC);
  const OFFS = [-330, -250, -150, -60, 60, 150, 250, 330], EDGE = o => Math.abs(o) >= 250;
  function label(c, text, x, y, color, size) { c.save(); c.font = `800 ${size || 38}px ${K.DISP}`; const w = c.measureText(text).width + 28, h = (size || 38) + 22;
    rr(c, x - w / 2, y - h / 2, w, h, 10); c.fillStyle = "rgba(6,10,14,.88)"; c.fill(); txt(c, text, x, y + 2, `800 ${size || 38}px ${K.DISP}`, color); c.restore(); }
  function glow(c, x, y, r, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,248,220,${a})`); g.addColorStop(0.35, `rgba(255,236,170,${a * 0.55})`); g.addColorStop(1, "rgba(255,236,170,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    optics(c, t, vp, p, b) {
      const draw = E.out(clamp(p / (b.fix ? 0.25 : 0.4))), fixed = b.fix ? E.io(clamp((p - 0.15) / 0.35)) : 0;
      c.save(); c.strokeStyle = "#cfd6dd"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); // the primary mirror, edge-on
      for (let y = YC - 380; y <= YC + 380; y += 10) { const x = mirrorX(y); y === YC - 380 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore();
      txt(c, "MAIN MIRROR", MX + 40, YC + 440, `800 36px ${K.DISP}`, "#cfd6dd", "right");
      OFFS.forEach((o, i) => {
        const y = YC + o, xm = mirrorX(y), edge = EDGE(o), f = edge ? [lerp(F2[0], F1[0], fixed), YC] : F1, q = clamp(draw * 1.3 - i * 0.04);
        if (q <= 0) return;
        c.save(); c.strokeStyle = edge ? (fixed > 0.5 ? "#5fd38a" : "#ff6b4a") : "#ffc83d"; c.lineWidth = 5; c.globalAlpha = 0.9;
        const inX = lerp(60, xm, clamp(q * 2)); c.globalAlpha = 0.35; c.beginPath(); c.moveTo(60, y); c.lineTo(inX, y); c.stroke(); c.globalAlpha = 0.95; // incoming starlight, dimmed
        if (q > 0.5) { const u = clamp((q - 0.5) * 2), dx = f[0] - xm, dy = f[1] - y, ext = 1.12; c.beginPath(); c.moveTo(xm, y); c.lineTo(xm + dx * ext * u, y + dy * ext * u); c.stroke(); }
        c.restore();
      });
      if (draw > 0.8) {
        const blur = 1 - fixed; glow(c, lerp(F1[0], (F1[0] + F2[0]) / 2, blur), YC, lerp(26, 120, blur), 0.95);
        if (!b.fix) { label(c, "CENTRE RAYS MEET HERE", F1[0] + 40, YC - 190, "#ffc83d"); label(c, "EDGE RAYS MEET HERE", F2[0] + 60, YC + 190, "#ff6b4a"); }
      }
      if (b.fix) { const a = clamp(p * 4); c.save(); c.globalAlpha = a; c.fillStyle = "#5fd38a"; rr(c, 560, YC - 250, 22, 70, 4); c.fill(); rr(c, 560, YC + 180, 22, 70, 4); c.fill(); c.restore();
        txt(c, "COSTAR: NICKEL-SIZED MIRRORS", 540, SY(720), `800 50px ${K.DISP}`, "#5fd38a"); if (fixed > 0.8) label(c, "ALL RAYS: ONE SHARP POINT", F1[0] + 20, YC + 190, "#5fd38a");
      } else {
        txt(c, "THE EDGE WAS 2.2 MICRONS TOO FLAT", 540, SY(720), `800 50px ${K.DISP}`, "#ffc83d");
        if (p > 0.55) label(c, "= A STAR SMEARS INTO A BLUR", 540, SY(1560), "#ff6b4a", 42);
      }
    },
  });
})();
window.SPEC = {
  credit: "NASA · public domain",
  beats: [
    { kind: "clip", src: "hubble", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL NASA FOOTAGE · HUBBLE, APRIL 1990", credit: "NASA · public domain" },
    { kind: "diagram", diagram: "optics", at: /^Its$/, credit: "Curio diagram · simplified, after the 1990 Allen Report" },
    { kind: "clip", src: "eva", at: /^In$/, pw: 1000, z0: 1.0, z1: 1.05, label: "REAL NASA FOOTAGE · REPAIR SPACEWALK, 1993", credit: "NASA Goddard · public domain" },
    { kind: "diagram", diagram: "optics", fix: true, at: /^some$/, credit: "Curio diagram · simplified" },
    { kind: "clip", src: "m100", at: /^The$/, pw: 860, cy: 1080, z0: 1.0, z1: 1.03, label: "REAL HUBBLE IMAGES · GALAXY M100", credit: "NASA Goddard · public domain" },
  ],
  nums: [["nineteen ninety-three", "1993"]],
  tags: [
    { text: "$1.5 BILLION · LAUNCHED APRIL 1990", at: 0.6, to: /^Its$/, y: 1480, color: "#ffc83d" },
    { text: "A RECORD 5 SPACEWALKS", at: /^spacewalkers$/, to: /^some$/, y: 1480, color: "#ffc83d" },
    { text: "BEFORE", at: /^The$/, to: /^vanished,$/, y: 1610, color: "#ff6b4a" },
    { text: "AFTER THE 1993 FIX", at: /^vanished,$/, y: 1610, color: "#5fd38a" },
  ],
};
