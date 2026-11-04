/* AN footage-first · arm B (escalating mystery). The Aneyoshi tsunami stone, Miyako, Japan: the 2011 wave stopped about 300 feet below
   it and the village's homes were spared. Facts: assets/src/aneyoshi/facts.json. The tablet's date is disputed (1896 or 1933), so
   nothing dates it. Diagram "slope": stone on a hillside, homes above, the 2011 water line below. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    slope(c, t, vp, p) {
      const y0 = SY(1500), y1 = SY(760), Xat = y => lerp(60, 1020, (y0 - y) / (y0 - y1)), wl = lerp(y0, SY(1310), E.out(clamp(p * 1.5)));
      c.fillStyle = "#245a7a"; c.fillRect(0, wl, 1080, y0 - wl + 120); c.fillStyle = "#4b5a3a"; c.beginPath(); c.moveTo(0, y0 + 40); c.lineTo(60, y0); c.lineTo(1020, y1); c.lineTo(1080, y1); c.lineTo(1080, y0 + 120); c.lineTo(0, y0 + 120); c.fill();
      const ys = SY(1130), xs = Xat(ys); c.fillStyle = "#c9c4b6"; rr(c, xs - 22, ys - 90, 44, 92, 8); c.fill(); txt(c, "THE STONE", xs - 170, ys - 50, `800 40px ${K.DISP}`, "#ffffff");
      [SY(990), SY(920), SY(850)].forEach(y => { const x = Xat(y) + 6; c.fillStyle = "#e9eef3"; c.fillRect(x - 28, y - 44, 56, 44); c.fillStyle = "#b5533c"; c.beginPath(); c.moveTo(x - 38, y - 44); c.lineTo(x, y - 76); c.lineTo(x + 38, y - 44); c.fill(); });
      txt(c, "THE HOMES", Xat(SY(920)) - 190, SY(900), `800 40px ${K.DISP}`, "#ffffff");
      if (p > 0.4) { const xw = Xat(wl); c.strokeStyle = "#ffc83d"; c.lineWidth = 7; c.beginPath(); c.moveTo(xs + 60, ys - 40); c.lineTo(xs + 60, wl); c.moveTo(xs + 40, ys - 40); c.lineTo(xs + 80, ys - 40); c.moveTo(xs + 40, wl); c.lineTo(xs + 80, wl); c.stroke(); txt(c, "ABOUT 300 FT", xs + 230, (ys + wl) / 2, `800 44px ${K.DISP}`, "#ffc83d"); txt(c, "2011 WAVE STOPS", xw - 80, wl + 60, `800 38px ${K.DISP}`, "#ffffff"); }
    },
  });
})();
window.SPEC = {
  credit: "T.KISHIMOTO · CC BY-SA 4.0",
  beats: [
    { kind: "photo", src: "stone", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL STONE · ANEYOSHI, JAPAN", credit: "T.KISHIMOTO · CC BY-SA 4.0" },
    { kind: "diagram", diagram: "slope", at: /^The$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "stone", at: /^Every$/, pw: 1000, iz: 1.5, fx: 0.34, fy: 0.5, z0: 1.0, z1: 1.06, label: "\"DO NOT BUILD BELOW THIS POINT\"", credit: "T.KISHIMOTO · CC BY-SA 4.0" },
    { kind: "photo", src: "stone", at: /^Survivors$/, pw: 1000, iz: 1.5, fx: 0.66, fy: 0.5, z0: 1.0, z1: 1.06, label: "\"HIGH HOMES, PEACE FOR DESCENDANTS\"", credit: "T.KISHIMOTO · CC BY-SA 4.0" },
  ],
  nums: [["twenty eleven", "2011"], ["three hundred feet", "300 feet"]],
  stamps: [{ text: "EVERY HOME SURVIVED", at: /^survived/, to: /^Survivors$/, y: 1570, size: 60 }],
};
