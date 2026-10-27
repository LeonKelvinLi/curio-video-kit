/* NO footage-first · Sir Nils Olav, the king penguin of Norway's King's Guard. Facts: assets/src/nilsolav/facts.json
   (Edinburgh Zoo releases, Forsvarets forum, BBC). Diagram "ranks", simplified: the rank ladder 1972-2023 with a penguin
   climbing it; 2008 knighthood highlighted. Three birds have held the title, so it's one title, three penguins.
   Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  const R = [["1972", "LANCE CORPORAL"], ["1982", "CORPORAL"], ["1987", "SERGEANT"], ["1993", "REGIMENTAL SGT MAJOR"], ["2001", "HON. REGIMENTAL SGT MAJOR"], ["2005", "COLONEL-IN-CHIEF"], ["2008", "KNIGHTED"], ["2016", "BRIGADIER"], ["2023", "MAJOR GENERAL"]];
  function penguin(c, x, y) { c.save(); c.translate(x, y); c.scale(1.5, 1.5); c.beginPath(); c.ellipse(0, 0, 30, 44, 0, 0, 6.3); c.fillStyle = "#e9eef3"; c.fill(); c.beginPath(); c.ellipse(0, 0, 26, 40, 0, 0, 6.3); c.fillStyle = "#1c1c1c"; c.fill(); c.beginPath(); c.ellipse(4, 6, 16, 30, 0, 0, 6.3); c.fillStyle = "#f2efe6"; c.fill(); circ(c, 6, -26, 5, "#ffc83d"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    ranks(c, t, vp, p, b) {
      const tK = tw(/^knighted$/), toK = clamp((t - b.t0) / Math.max(0.5, tK - b.t0)), after = clamp((t - tK - 0.3) / 1.6), lvl = toK < 1 ? 6 * E.io(toK) : 6 + 2 * E.io(after);
      const y = i => SY(1490) - i * 84;
      c.fillStyle = "rgba(233,238,243,.25)"; c.fillRect(150, y(8) - 20, 8, y(0) - y(8) + 40);
      R.forEach(([yr, name], i) => { const on = lvl >= i - 0.01, knight = i === 6; c.fillStyle = on ? (knight ? "#ffc83d" : "#e9eef3") : "rgba(233,238,243,.25)"; c.fillRect(130, y(i) - 4, 50, 8);
        txt(c, yr, 200, y(i) + 2, `800 34px ${K.DISP}`, on ? (knight ? "#ffc83d" : "#e9eef3") : "rgba(233,238,243,.35)", "left"); txt(c, name, 300, y(i) + 2, `800 34px ${K.DISP}`, on ? (knight ? "#ffc83d" : "#ffffff") : "rgba(233,238,243,.35)", "left"); });
      penguin(c, 80, lerp(y(0), y(8), lvl / 8) - 10);
      txt(c, "HIS RANKS, 1972 TO 2023", 540, SY(700), `800 50px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Public domain",
  beats: [
    { kind: "photo", src: "inspect", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · INSPECTING THE KING'S GUARD, 2008", credit: "UK Ministry of Defence · Open Government Licence" },
    { kind: "photo", src: "guard", at: /^In$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · NORWAY'S KING'S GUARD", credit: "Mobilus In Mobili · CC BY-SA 2.0" },
    { kind: "diagram", diagram: "ranks", at: /^Promotion$/, credit: "Curio diagram · ranks per Edinburgh Zoo" },
    { kind: "photo", src: "portrait", at: /^Meet$/, pw: 600, cy: 1080, z0: 1.0, z1: 1.06, label: "REAL PHOTO · SIR NILS OLAV, 2019", credit: "Grendelkhan · CC BY-SA 4.0" },
  ],
  nums: [["nineteen seventy-two", "1972"], ["two thousand eight", "2008"]],
  marks: [{ at: 0.5, to: /^In$/, ix: 0.65, iy: 0.62, r: 95, text: "THE GENERAL", side: "left" }],
  stamps: [{ text: "MAJOR GENERAL · 2023", at: /^Olav,$/, y: 1600, size: 60 }],
};
