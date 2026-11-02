/* PK footage-first · Pushinka, Strelka's puppy, Khrushchev's 1961 gift to the Kennedys. Facts: assets/src/pushinka/facts.json
   (JFK Library, FRUS 1961, NASA, Moscow Glavarchiv). The bug check is secondary (VO says "reportedly"). Diagram "tree",
   simplified: the family tree from the orbiting mother to the four "pupniks". Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  function dog(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.ellipse(0, 10, 44, 26, 0, 0, 6.3); c.fill(); circ(c, 40, -14, 20, col); c.beginPath(); c.ellipse(52, -30, 7, 14, 0.4, 0, 6.3); c.fill(); c.fillRect(-34, 24, 10, 22); c.fillRect(20, 24, 10, 22); c.restore(); }
  function node(c, x, y, name, sub, a, col) { if (a <= 0) return; c.save(); c.globalAlpha = a; const sc = lerp(1.2, 1, E.back(a)); c.translate(x, y); c.scale(sc, sc); dog(c, 0, -40, 1, col); txt(c, name, 0, 40, `800 34px ${K.DISP}`, "#ffffff"); if (sub) txt(c, sub, 0, 78, `700 26px ${K.DISP}`, "#ffc83d"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    tree(c, t, vp, p, b) {
      const a1 = clamp(p / 0.2), a2 = clamp((p - 0.2) / 0.2), a3 = clamp((p - 0.45) / 0.3);
      c.strokeStyle = "rgba(233,238,243,.35)"; c.lineWidth = 6;
      c.save(); c.globalAlpha = a2; c.beginPath(); c.moveTo(340, SY(950)); c.lineTo(340, SY(1120)); c.stroke(); c.restore();
      c.save(); c.globalAlpha = a3; c.beginPath(); c.moveTo(540, SY(1180)); c.lineTo(540, SY(1330)); c.moveTo(180, SY(1330)); c.lineTo(900, SY(1330)); for (const x of [180, 420, 660, 900]) { c.moveTo(x, SY(1330)); c.lineTo(x, SY(1380)); } c.stroke(); c.restore();
      node(c, 340, SY(880), "STRELKA", "ORBITED EARTH, 1960", a1, "#e9eef3"); node(c, 740, SY(880), "PUSHOK", "STAYED ON THE GROUND", a1, "#cfc4ae");
      c.save(); c.globalAlpha = a1; txt(c, "+", 540, SY(850), `800 50px ${K.DISP}`, "#ffc83d"); c.restore();
      node(c, 340, SY(1150), "PUSHINKA", "GIFT TO THE WHITE HOUSE, 1961", a2, "#f2efe6"); node(c, 740, SY(1150), "CHARLIE", "THE KENNEDYS' WELSH TERRIER", a2, "#b8894f");
      c.save(); c.globalAlpha = a2; txt(c, "+", 540, SY(1120), `800 50px ${K.DISP}`, "#ffc83d"); c.restore();
      [["BUTTERFLY", 180], ["WHITE TIPS", 420], ["BLACKIE", 660], ["STREAKER", 900]].forEach(([n, x], i) => node(c, x, SY(1460), n, null, clamp(a3 * 1.5 - i * 0.15), i === 2 ? "#3a3a3a" : "#dcd3c2"));
      txt(c, a3 > 0.3 ? "FOUR 'PUPNIKS', BORN 1963" : "FROM ORBIT TO THE WHITE HOUSE LAWN", 540, SY(700), `800 44px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "JFK Library · public domain",
  beats: [
    { kind: "photo", src: "pupniks", pw: 1000, z0: 1.0, z1: 1.08, fy: 0.55, label: "REAL PHOTO · WHITE HOUSE LAWN, 1963", credit: "Cecil Stoughton / JFK Library · public domain" },
    { kind: "photo", src: "strelka", at: /^Her$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · STRELKA AND HER LITTER, 1961", credit: "Moscow Glavarchiv · CC BY 4.0" },
    { kind: "photo", src: "vienna", at: /^Khrushchev$/, pw: 900, maxH: 1060, z0: 1.0, z1: 1.06, label: "REAL PHOTO · VIENNA SUMMIT DINNER, 1961", credit: "USIS / JFK Library · public domain" },
    { kind: "photo", src: "passport", at: /^Pushinka,$/, pw: 1000, iz: 1.15, fx: 0.4, z0: 1.0, z1: 1.06, label: "REAL DOCUMENT · HER SOVIET DOG PASSPORT", credit: "JFK Library · public domain" },
    { kind: "diagram", diagram: "tree", at: /^She$/, credit: "Curio diagram · names per the JFK Library" },
    { kind: "photo", src: "family", at: /^JFK$/, pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · HYANNIS PORT, 1963", credit: "Cecil Stoughton / NARA · public domain" },
  ],
  nums: [["nineteen sixty", "1960"]],
  marks: [
    { at: 0.5, to: /^Her$/, ix: 0.42, iy: 0.66, r: 80, text: "PUSHINKA", side: "right" },
    { at: /^Strelka,$/, to: /^Khrushchev$/, ix: 0.2, iy: 0.42, r: 90, text: "STRELKA", side: "right" },
    { at: /^Jackie$/, to: /^reportedly$/, ix: 0.21, iy: 0.42, r: 80, text: "PUSHINKA", side: "right" },
  ],
  tags: [
    { text: "SPUTNIK 5 · 19 AUG 1960 · 1 DAY IN ORBIT", at: /^orbited$/, to: /^Khrushchev$/, y: 1520, color: "#ffc83d" },
    { text: "'A DIRECT DESCENDANT OF STRELKA' · KHRUSHCHEV", at: /^reportedly$/, to: /^She$/, y: 1520, color: "#ffc83d" },
  ],
  stamps: [{ text: "PUPNIKS", at: /^pupniks\.$/, y: 1560, size: 72 }],
};
