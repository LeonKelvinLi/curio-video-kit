/* LW footage-first · Victor Lustig and the Eiffel Tower "sale". Facts: assets/src/lustig/facts.json. The 1925 sale traces to
   a 1961 memoir, so the scheme is drawn as legend (dashed boxes) and only the 1935 arrest, escape and Alcatraz are shown as
   documented. Diagram "con", simplified: fake government letters -> secret bids at a Paris hotel -> scrap dealer pays plus a
   bribe. Engine: scenes/footage.js. */
(function () {
  const { clamp, E, rr, txt, poly } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  function box(c, y, text, a) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.setLineDash([18, 12]); c.strokeStyle = "#ffc83d"; c.lineWidth = 5;
    rr(c, 140, y - 70, 800, 140, 18); c.fillStyle = "rgba(6,10,14,.75)"; c.fill(); c.stroke(); c.setLineDash([]); txt(c, text, 540, y + 2, `800 50px ${K.DISP}`, "#ffffff"); c.restore(); }
  function down(c, y, a) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); poly(c, [[510, y - 24], [570, y - 24], [540, y + 20]], "#ffc83d"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    con(c, t, vp, p, b) {
      const a1 = (t - tw(/^posed$/)) * 4, a2 = (t - tw(/^official$/)) * 4, a3 = (t - tw(/^bribe\.$/)) * 4;
      txt(c, "THE STORY, AS IT'S TOLD", 540, SY(720), `800 50px ${K.DISP}`, "#ffc83d");
      txt(c, "(dashed = never confirmed by records)", 540, SY(780), `600 34px ${K.DISP}`, "rgba(233,238,243,.7)");
      box(c, SY(930), "FAKE GOVERNMENT LETTERS", a1); down(c, SY(1045), a2);
      box(c, SY(1160), "SECRET BIDS AT A PARIS HOTEL", a2); down(c, SY(1275), a3);
      box(c, SY(1390), "SCRAP DEALER PAYS, PLUS A BRIBE", a3);
    },
  });
})();
window.SPEC = {
  credit: "Public domain",
  beats: [
    { kind: "photo", src: "eiffel", pw: 640, cy: 1080, z0: 1.0, z1: 1.07, label: "REAL PHOTO · EIFFEL TOWER, 1925", credit: "Agence Rol, 1925 · Bibliotheque nationale de France · public domain" },
    { kind: "diagram", diagram: "con", at: /^The$/, credit: "Curio diagram · after Smithsonian Magazine's retelling" },
    { kind: "photo", src: "crillon", at: [/^The$/, 1], pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · HOTEL DE CRILLON, PARIS", credit: "Bain News Service · Library of Congress · public domain" },
    { kind: "photo", src: "wanted", at: /^He$/, pw: 1000, z0: 1.0, z1: 1.08, label: "REAL FBI WANTED NOTICE, 1935", credit: "FBI Identification Order 1301, 1935 · public domain" },
    { kind: "photo", src: "alcatraz", at: /^landed$/, pw: 1000, z0: 1.0, z1: 1.05, label: "REAL PHOTO · ALCATRAZ, 1930s", credit: "U.S. Navy · public domain" },
  ],
  nums: [["nineteen thirty-five", "1935"]],
  marks: [{ at: /^fled,$/, to: /^landed$/, ix: 0.6, iy: 0.6, r: 80, text: "LUSTIG", side: "left" }],
  tags: [
    { text: "PARIS, 1925", at: 0.5, to: /^The$/, y: 1600, color: "#ffc83d" },
    { text: "WHERE THE 'BIDS' WERE REPORTEDLY TAKEN", at: /^embarrassed$/, to: /^He$/, y: 1460, color: "#ffc83d" },
  ],
  stamps: [{ text: "ALCATRAZ INMATE #300", at: /^Alcatraz\.$/, y: 1480, size: 60 }],
};
