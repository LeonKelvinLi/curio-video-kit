/* TM footage-first · arm A (visual-first). Anne Goldgar's archive work on the 1637 tulip crash: she "wasn't able to find a single case" of
   an individual going bankrupt (History.com), and Mackay's 1841 book took satirical commentary as fact. Facts: assets/src/tulips/facts.json.
   Her finding is that she could not find one, not proof of none, and the script says so. Opener is the 1640s monkey satire of
   Jan Brueghel the Younger. Title page is the 1852 edition, labelled as such. Diagram "ledgers": a stack of archives, count 0. */
(function () {
  const { clamp, E, rr, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    ledgers(c, t, vp, p) {
      const base = SY(1340), n = 9, shown = Math.ceil(n * E.out(clamp(p * 1.5))); const cols = ["#7a4a2c", "#5e3a24", "#8a5a34", "#4f3320"];
      for (let i = 0; i < shown; i++) { const w = 560 + 90 * K.hash(i), x = 540 - w / 2 + 40 * (K.hash(i + 9) - 0.5), y = base - (i + 1) * 46; c.fillStyle = cols[i % 4]; rr(c, x, y, w, 42, 6); c.fill(); c.fillStyle = "#e6dfc8"; c.fillRect(x + w - 34, y + 6, 26, 30); }
      txt(c, "BANKRUPTCIES FOUND", 540, SY(740), `800 52px ${K.DISP}`, "#ffffff"); txt(c, "0", 540, SY(830), `800 110px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Brueghel the Younger, 1640s · public domain",
  beats: [
    { kind: "photo", src: "monkeys", fit: "cover", fx: 0.5, fy: 0.64, z0: 1.5, z1: 1.62, label: "PAINTED SATIRE · 1640s" },
    { kind: "photo", src: "monkeys", at: /^A$/, pw: 1000, z0: 1.0, z1: 1.06, label: "THE TULIP TRADERS, AS MONKEYS" },
    { kind: "diagram", diagram: "ledgers", at: /^could$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "book", at: [/^The$/, 1], pw: 760, maxH: 1060, fy: 0.2, z0: 1.0, z1: 1.05, label: "MACKAY'S BOOK · 1852 EDITION", credit: "Charles Mackay · public domain" },
    { kind: "photo", src: "monkeys", at: /^old$/, fit: "cover", fx: 0.62, fy: 0.64, z0: 1.5, z1: 1.6, label: "PAINTED SATIRE · 1640s" },
  ],
  nums: [["sixteen thirty-seven", "1637"], ["eighteen forty-one", "1841"]],
  tags: [{ text: "HISTORIAN ANNE GOLDGAR", at: /^historian/, to: /^could$/, y: 1540, color: "#ffc83d" }],
  stamps: [{ text: "SATIRE, TAKEN AS FACT", at: /^old$/, y: 1570, size: 60 }],
};
