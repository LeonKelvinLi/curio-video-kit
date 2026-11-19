/* EL4 footage-first · T8-6 by4 (rescue, then bomber), arm A (13-15 s). Betty Lou Oliver, elevator operator, Empire State Building, 28 July 1945: a B-25
   hit the 78th-80th floors in fog; she was thrown from her car on the 80th floor, first-aid workers put her in another car, its damaged
   cables snapped and it fell 75 stories to the basement. Guinness: longest elevator fall survived. Facts: assets/src/empirefall/facts.json.
   Pair with ELU: built from one design (gen script), identical except the two middle sentences swap, so the hole photo and the
   burning-floor photo swap places with them. First frame: INP press photo of the tower in smoke, the morning of the crash (no injury
   shown). "Probably" stays (Guinness: "likely" air pressure + coiled cable). 14 people died: no casualty photos, sober tone.
   Diagram "shaft" (simplified): the second car, cables cut, air cushion and coiled cable at the bottom. */
(function () {
  const { clamp, lerp, E, rr, txt } = K, SY = y => y - 420, W = re => WORDS[K.ix(WORDS, re)].s;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    shaft(c, t) {
      const tA = W(/^Air$/), tC = W(/^coiled$/), X = 600, top = SY(700), bot = SY(1500), w = 250, ch = 160;
      const a = E.out(clamp((t - tA + 0.05) * 1.6)), fall = E.in(clamp((t - tA) / 1.4)), carY = lerp(top + 40, bot - ch - 46, fall);
      c.fillStyle = "#1a232d"; c.fillRect(X - w / 2, top, w, bot - top); c.strokeStyle = "#e9eef3"; c.lineWidth = 6; c.strokeRect(X - w / 2, top, w, bot - top);
      // cables: whole before "Air", cut stubs after
      c.strokeStyle = "#9aa6b2"; c.lineWidth = 4; [-30, 0, 30].forEach(d => { c.beginPath(); c.moveTo(X + d, top); c.lineTo(X + d, a > 0 ? top + 70 : carY); c.stroke(); });
      // coiled cable at the bottom (appears with "coiled")
      const q = E.out(clamp((t - tC + 0.1) * 3));
      if (q > 0) { c.save(); c.globalAlpha = q; c.strokeStyle = "#ffc83d"; c.lineWidth = 6; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(X, bot - 12 - i * 9, 90 - i * 6, 12, 0, 0, 6.3); c.stroke(); } c.restore();
        c.save(); c.globalAlpha = q; txt(c, "COILED CABLE", X + w / 2 + 24, bot - 30, `800 40px ${K.DISP}`, "#ffc83d", "left"); c.restore(); }
      // air pushed up under the falling car
      if (a > 0 && fall < 1) { c.save(); c.globalAlpha = a; c.fillStyle = "#ffc83d"; [-60, 0, 60].forEach(d => { const y = carY + ch + 40 + 30 * ((t * 2 + d / 60) % 1); c.beginPath(); c.moveTo(X + d, y - 24); c.lineTo(X + d - 18, y + 4); c.lineTo(X + d + 18, y + 4); c.fill(); }); c.restore(); }
      if (a > 0) { c.save(); c.globalAlpha = a; txt(c, "AIR PRESSURE", X + w / 2 + 24, Math.min(carY + ch + 60, bot - 110), `800 40px ${K.DISP}`, "#ffc83d", "left"); c.restore(); }
      // the car
      rr(c, X - w / 2 + 16, carY, w - 32, ch, 8); c.fillStyle = "#e9eef3"; c.fill();
      c.save(); c.globalAlpha = 1 - a; txt(c, "SECOND CAR", X + w / 2 + 24, carY + ch / 2, `800 40px ${K.DISP}`, "#ffffff", "left"); c.restore();
      // height: arrow down the left side of the shaft
      const hx = X - w / 2 - 50; c.strokeStyle = "rgba(233,238,243,.6)"; c.fillStyle = "rgba(233,238,243,.6)"; c.lineWidth = 4; c.beginPath(); c.moveTo(hx, top + 6); c.lineTo(hx, bot - 20); c.stroke();
      c.beginPath(); c.moveTo(hx, bot - 2); c.lineTo(hx - 14, bot - 26); c.lineTo(hx + 14, bot - 26); c.fill();
      txt(c, "75", hx - 24, (top + bot) / 2 - 26, `800 64px ${K.DISP}`, "#ffffff", "right"); txt(c, "STORIES", hx - 24, (top + bot) / 2 + 26, `800 36px ${K.DISP}`, "rgba(233,238,243,.85)", "right");
    },
  });
})();
window.SPEC = {
  credit: "International News Photos, 1945 · public domain",
  beats: [
    { kind: "photo", src: "tower", fit: "cover", fx: 0.46, fy: 0.5, z0: 1.0, z1: 1.08, label: "REAL PHOTO · 28 JULY 1945", credit: "International News Photos, 1945 · public domain" },
    { kind: "photo", src: "floor", at: /^She$/, pw: 1000, z0: 1.0, z1: 1.07, label: "PHOTO, 1945 · A BURNING FLOOR", credit: "International News Photos, 1945 · public domain" },
    { kind: "photo", src: "hole", at: /^A$/, pw: 780, maxH: 960, fy: 0.5, z0: 1.0, z1: 1.07, label: "PHOTO, 1945 · THE HOLE IT MADE", credit: "Acme Newspictures, 1945 · public domain" },
    { kind: "diagram", diagram: "shaft", at: /^Rescuers$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "smoke", at: /^It/, pw: 1000, z0: 1.0, z1: 1.06, label: "PHOTO, 1945 · THE TOWER THAT MORNING", credit: "International News Photos, 1945 · public domain" },
  ],
  nums: [["seventy-five", "75"]],
  tags: [{ text: "B-25 BOMBER IN FOG", at: /^bomber/, to: /^Rescuers$/, y: 1560, color: "#ffc83d" },
         { text: "ALL SIX CABLES SNAPPED", at: /^snapped/, to: /^A$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "LONGEST ELEVATOR FALL SURVIVED", at: /^It/, y: 1570, size: 52 }],
};
