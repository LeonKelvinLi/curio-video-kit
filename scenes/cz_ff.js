/* CZ footage-first · arm B (escalating mystery). "Bioastronautics Research" (USAF, NARA ARC 68700, public domain): cats and pigeons released
   in a C-131 flying weightless arcs. The film's own narration: the cats' reflex "is almost completely lost under weightlessness"; the
   birds "have lost their feeling for what is up or down... some even flying upside down". Facts: assets/src/zerogcats/facts.json.
   The film is not dated on screen (NARA's 1947 is the start of a range). Only moments with no sign of harm are used. Diagram "arc". */
(function () {
  const { clamp, lerp, E, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    arc(c, t, vp, p) {
      const X0 = 90, X1 = 990, Yb = SY(1330), H = 480, Y = u => Yb - H * 4 * u * (1 - u), q = E.io(clamp(p * 1.1));
      c.lineWidth = 12; c.lineCap = "round"; c.strokeStyle = "rgba(233,238,243,.3)"; c.beginPath(); for (let i = 0; i <= 80; i++) { const u = i / 80; c.lineTo(lerp(X0, X1, u), Y(u)); } c.stroke();
      c.strokeStyle = "#ffc83d"; c.beginPath(); for (let i = 22; i <= 58; i++) { const u = i / 80; c.lineTo(lerp(X0, X1, u), Y(u)); } c.stroke();
      const x = lerp(X0, X1, q), y = Y(q), a = Math.atan(-(H * 4 * (1 - 2 * q)) / (X1 - X0)); c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = "#e9eef3"; c.fillRect(-70, -12, 140, 24); c.fillRect(-24, -44, 30, 88); c.fillRect(-70, -32, 18, 26); c.restore();
      txt(c, "WEIGHTLESS", 540, Yb - H - 70, `800 62px ${K.DISP}`, "#ffc83d"); txt(c, "AIR FORCE C-131", 540, Yb + 70, `800 44px ${K.DISP}`, "#ffffff");
    },
  });
})();
window.SPEC = {
  credit: "US Air Force film · NARA · public domain",
  beats: [
    { kind: "clip", src: "cats", pw: 1000, z0: 1.0, z1: 1.05, label: "REAL AIR FORCE FILM" },
    { kind: "clip", src: "cats", at: [/^The$/, 1], from: 150, pw: 1000, z0: 1.05, z1: 1.1, label: "REAL AIR FORCE FILM" },
    { kind: "clip", src: "pigeons", at: [/^The$/, 2], from: 45, pw: 1000, z0: 1.0, z1: 1.05, label: "SAME FLIGHT · PIGEONS" },
    { kind: "diagram", diagram: "arc", at: /^They$/, credit: "Curio diagram · simplified" },
  ],
  tags: [{ text: "NARRATOR: \"ALMOST COMPLETELY LOST\"", at: /^reflex/, to: [/^The$/, 2], y: 1540, color: "#ffc83d" }, { text: "NARRATOR: \"SOME EVEN UPSIDE DOWN\"", at: /^some$/, to: /^They$/, y: 1540, color: "#ffc83d" }],
};
