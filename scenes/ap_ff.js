/* AP footage-first · Apollo 12's lightning strikes, 14 Nov 1969. Facts: assets/src/apollo12/facts.json (Apollo 12 mission
   report, Apollo Flight Journal, NASA History). Diagram "telemetry", simplified: warning lights and garbled telemetry after
   the strikes; with b.fix, the SCE switch flips NORMAL -> AUX on "flipped" and the numbers settle. Engine: scenes/footage.js. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  const LIGHTS = ["FC 1", "FC 2", "FC 3", "MAIN BUS A", "MAIN BUS B", "AC BUS 1"], CLEAN = ["28.4", "1,046", "0.72", "31.9"];
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    telemetry(c, t, vp, p, b) {
      const flipped = b.fix && t >= tw(/^flipped$/), sw = b.fix ? E.out(clamp((t - tw(/^flipped$/)) / 0.3)) : 0, blink = Math.floor(t * 4) % 2;
      LIGHTS.forEach((l, i) => { const x = 210 + (i % 3) * 330, y = SY(840) + Math.floor(i / 3) * 110; rr(c, x - 140, y - 40, 280, 80, 10); c.fillStyle = blink ? "#c0392b" : "#7d241b"; c.fill(); txt(c, l, x, y + 2, `800 34px ${K.DISP}`, "#ffffff"); });
      for (let r = 0; r < 4; r++) { const y = SY(1110) + r * 70; rr(c, 180, y - 28, 720, 56, 8); c.fillStyle = "#0e1a12"; c.fill();
        const v = flipped ? CLEAN[r] : (K.hash(Math.floor(t * 14) + r * 7) * 9999).toFixed(K.hash(r + Math.floor(t * 9)) > 0.5 ? 1 : 0).padStart(6, "#");
        txt(c, `CH ${r + 1}`, 220, y + 2, `700 32px ${K.MONO}`, "#5fd38a", "left"); txt(c, v, 860, y + 2, `700 36px ${K.MONO}`, flipped ? "#5fd38a" : "#ff6b4a", "right"); }
      if (b.fix) { rr(c, 380, SY(1440), 320, 90, 14); c.fillStyle = "#2a3038"; c.fill(); txt(c, "SCE", 430, SY(1486), `800 34px ${K.DISP}`, "#e9eef3");
        txt(c, "NORMAL", 540, SY(1462), `700 26px ${K.DISP}`, sw < 0.5 ? "#ffc83d" : "#8a96a3"); txt(c, "AUX", 540, SY(1512), `700 26px ${K.DISP}`, sw >= 0.5 ? "#ffc83d" : "#8a96a3");
        rr(c, 620, SY(1452) + 44 * sw, 50, 30, 8); c.fillStyle = "#e9eef3"; c.fill(); }
      txt(c, flipped ? "DATA BACK" : b.fix ? "TRY SCE TO AUX" : "EVERYTHING WENT HAYWIRE", 540, SY(700), `800 54px ${K.DISP}`, flipped ? "#5fd38a" : "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "NASA · public domain",
  beats: [
    { kind: "clip", src: "bolt", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL NASA FILM · APOLLO 12 LAUNCH, 1969", credit: "NASA · public domain" },
    { kind: "diagram", diagram: "telemetry", at: /^Its$/, credit: "Curio diagram · simplified" },
    { kind: "clip", src: "mocr", at: /^Then$/, pw: 1000, z0: 1.0, z1: 1.05, label: "REAL NASA FILM · MISSION CONTROL, 1969", credit: "NASA · public domain" },
    { kind: "diagram", diagram: "telemetry", fix: true, at: /^S-C-E$/, credit: "Curio diagram · simplified" },
    { kind: "clip", src: "land", at: [/^and$/, 1], pw: 1000, z0: 1.0, z1: 1.04, label: "REAL NASA FILM · LANDING ON THE MOON", credit: "NASA · public domain" },
  ],
  tags: [{ text: "STRUCK AT 36.5 s AND 52 s", at: /^Twice\.$/, to: /^Its$/, y: 1460, color: "#ffc83d" }],
};
