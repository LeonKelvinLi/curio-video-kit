/* OM footage-first · the 1904 St. Louis Olympic marathon. Facts: assets/src/marathon1904/facts.json (checked against the 1905
   official report by Charles Lucas, Hicks's attendant). Diagram "race", simplified: two lanes, mile 0 to the finish (24.85 mi).
   The diagram joins at mile 6: Lorz runs to mile 9, rides a car to about mile 19.6, jogs in first; Hicks gets strychnine + egg white 7 miles out and more
   strychnine + brandy at mile 20, finishes second but wins when Lorz is disqualified. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, rr, circ, txt } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  const MI = 24.85, X0 = 110, X1 = 970, mx = m => X0 + (X1 - X0) * m / MI;
  const interp = (keys, t) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])); return keys[keys.length - 1][1]; };
  function runner(c, x, y, bib, color) { circ(c, x, y, 28, color); txt(c, bib, x, y + 2, `800 30px ${K.DISP}`, "#0b0f14"); }
  function car(c, x, y) { rr(c, x - 52, y - 30, 104, 44, 10); c.fillStyle = "#ffc83d"; c.fill(); rr(c, x - 20, y - 52, 50, 26, 8); c.fill(); circ(c, x - 30, y + 16, 13, "#0b0f14"); circ(c, x + 30, y + 16, 13, "#0b0f14"); txt(c, "31", x, y - 8, `800 26px ${K.DISP}`, "#0b0f14"); }
  function label(c, text, x, y, color, a, align) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.font = `800 38px ${K.DISP}`; const w = c.measureText(text).width + 26, x0 = align === "right" ? x - w : align === "left" ? x : x - w / 2;
    rr(c, x0, y - 28, w, 56, 10); c.fillStyle = "rgba(6,10,14,.9)"; c.fill(); txt(c, text, x0 + w / 2, y + 2, `800 38px ${K.DISP}`, color); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    race(c, t, vp, p, b) {
      const t0 = tw(/^The$/), tS = tw(/^strychnine$/), tB = tw(/^brandy$/), t1 = tw(/^Thomas$/) - 0.35;
      const hicks = interp([[t0, 6], [tS, 17.85], [tB, 20], [t1, MI]], t); // the diagram joins the race at mile 6
      const hit9 = t0 + 0.3, carEnd = tS - 0.1, lorzDone = tB + 0.45;
      const lorz = interp([[t0, 6], [hit9, 9], [carEnd, 19.6], [lorzDone, MI]], t), inCar = t > hit9 && t < carEnd;
      const LY = SY(930), HY = SY(1250);
      txt(c, t >= t1 ? "HICKS WON · 3:28:53" : "THE RACE, MILE BY MILE", 540, SY(720), `800 50px ${K.DISP}`, "#ffc83d");
      [[LY, "#31 LORZ"], [HY, "#20 HICKS"]].forEach(([y, name]) => { c.fillStyle = "rgba(233,238,243,.18)"; c.fillRect(X0, y - 4, X1 - X0, 8); txt(c, name, X0, y - 62, `800 40px ${K.DISP}`, "#e9eef3", "left"); });
      c.fillStyle = "#e9eef3"; c.fillRect(X1 - 3, LY - 40, 6, HY - LY + 80); txt(c, "FINISH", X1 - 10, LY - 62, `800 32px ${K.DISP}`, "#e9eef3", "right");
      for (const m of [0, 5, 10, 15, 20]) txt(c, m ? `MILE ${m}` : "START", mx(m), SY(1420), `700 30px ${K.DISP}`, "rgba(233,238,243,.7)");
      if (lorz > 9) { c.fillStyle = "#ffc83d"; c.fillRect(mx(9), LY - 6, mx(Math.min(lorz, 19.6)) - mx(9), 12); }
      c.fillStyle = "#e9eef3"; c.fillRect(X0, LY - 3, mx(Math.min(lorz, 9)) - X0, 6); if (lorz > 19.6) c.fillRect(mx(19.6), LY - 3, mx(lorz) - mx(19.6), 6);
      c.fillRect(X0, HY - 3, mx(hicks) - X0, 6);
      if (inCar) { car(c, mx(lorz), LY); label(c, "GOT IN A CAR", mx(lorz), LY + 80, "#ffc83d", 1); } else runner(c, mx(lorz), LY, "31", "#e9eef3");
      if (t >= lorzDone) label(c, t >= t1 ? "DISQUALIFIED" : "FINISHED FIRST", X1, LY + 80, t >= t1 ? "#ff6b4a" : "#ffc83d", (t - lorzDone) * 4, "right");
      if (t >= tS) { circ(c, mx(17.85), HY, 12, "#ff6b4a"); label(c, "STRYCHNINE + EGG WHITE", mx(17.85), HY - 80, "#ff6b4a", (t - tS) * 4); }
      if (t >= tB) { circ(c, mx(20), HY, 12, "#ff6b4a"); label(c, "MORE + BRANDY · MILE 20", mx(20) - 40, HY + 80, "#ff6b4a", (t - tB) * 4); }
      runner(c, mx(hicks), HY, "20", "#9fc7e8");
    },
  });
})();
window.SPEC = {
  credit: "Missouri History Museum · public domain",
  beats: [
    { kind: "photo", src: "start", pw: 900, cy: 1060, z0: 1.0, z1: 1.06, label: "REAL PHOTO · ST. LOUIS OLYMPICS, 1904", credit: "Nathan Lazarnick / Missouri History Museum · public domain" },
    { kind: "photo", src: "road", at: /^Ninety$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · THE 1904 COURSE", credit: "Jessie Tarbox Beals / Missouri History Museum · public domain" },
    { kind: "photo", src: "tau", at: [/^a$/, 1], pw: 620, cy: 1060, z0: 1.0, z1: 1.06, label: "LEN TAU AND JAN MASHIANI, 1904", credit: "Jessie Tarbox Beals / Missouri History Museum · public domain" },
    { kind: "photo", src: "carvajal", at: /^another$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · FELIX CARVAJAL, 1904", credit: "Missouri History Museum · public domain" },
    { kind: "diagram", diagram: "race", at: /^The$/, credit: "Curio diagram · from the 1905 official report" },
    { kind: "photo", src: "hicks", at: /^Thomas$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · HICKS AND HIS HANDLERS", credit: "Jessie Tarbox Beals / Missouri History Museum · public domain" },
  ],
  nums: [["fourteen", "14"]],
  marks: [
    { at: 0.5, to: /^Ninety$/, ix: 0.52, iy: 0.40, r: 85, text: "LORZ" },
    { at: /^Thomas$/, to: /^fourteen$/, ix: 0.445, iy: 0.5, r: 80, text: "HICKS" },
  ],
  tags: [
    { text: "HE GOT IN A CAR AT MILE 9", at: /^rode$/, to: /^Ninety$/, y: 1560, color: "#ffc83d" },
    { text: "OFFICIALS' CARS KICKED UP THE DUST", at: /^choking$/, to: [/^a$/, 1], y: 1480, color: "#ffc83d" },
    { text: "CHASED NEARLY A MILE OFF COURSE", at: /^chased$/, to: /^another$/, y: 1530, color: "#ffc83d" },
    { text: "HE STILL FINISHED FOURTH", at: /^snatching$/, to: /^The$/, y: 1480, color: "#ffc83d" },
  ],
  counter: { label: "FINISHED", at: /^fourteen$/, y: 1480, values: [[/^fourteen$/, "14"]] },
  stamps: [{ text: "GOLD · 3:28:53", at: /^won,$/, to: /^fourteen$/, y: 1500, size: 64 }],
};
