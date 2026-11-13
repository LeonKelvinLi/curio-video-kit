/* FDL footage-first · arm C (micro-story, 42.1 s). Fordlandia: Henry Ford's rubber town in the Amazon, 1928-1945. Line 1 is the whole
   act; every later beat is one true reveal with its own picture. Facts: assets/src/fordlandia/facts.json (all spoken claims match).
   Same-story pair with FD (same first picture: the water tower and warehouse, colour, cover). No rights-clear photo of the 1930 riot
   or of the cafeteria exists, so none is implied: those beats show the town's buildings as they stand. The brochure's house is at
   Belterra, Ford's second plantation, so the label names only the brochure. Diagram "menu", simplified: the two foods the script names. */
(function () {
  const { clamp, E, rr, txt } = K, SY = y => y - 420, W = re => WORDS[K.ix(WORDS, re)].s;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    menu(c, t) {
      const a = E.out(clamp((t - W(/^oatmeal/) + 0.15) * 4)), b = E.out(clamp((t - W(/^canned/) + 0.15) * 4)), Y = SY(1200);
      txt(c, "CAFETERIA MENU", 540, SY(740), `800 76px ${K.DISP}`, "#ffffff");
      txt(c, "AMERICAN FOOD, IN THE AMAZON", 540, SY(840), `800 44px ${K.DISP}`, "#ffc83d");
      c.save(); c.globalAlpha = a; c.translate(290, Y); // a bowl of oatmeal
      c.fillStyle = "#e9eef3"; c.beginPath(); c.moveTo(-190, -30); c.quadraticCurveTo(-170, 150, -70, 160); c.lineTo(70, 160); c.quadraticCurveTo(170, 150, 190, -30); c.closePath(); c.fill();
      c.fillStyle = "#d9c49a"; c.beginPath(); c.ellipse(0, -30, 190, 46, 0, 0, 6.3); c.fill(); c.fillStyle = "#c9b183"; c.beginPath(); c.ellipse(-20, -32, 120, 22, 0, 0, 6.3); c.fill();
      c.restore(); if (a > 0) { c.save(); c.globalAlpha = a; txt(c, "OATMEAL", 290, Y + 250, `800 58px ${K.DISP}`, "#ffffff"); c.restore(); }
      c.save(); c.globalAlpha = b; c.translate(790, Y + 10); // a can of peaches
      rr(c, -120, -150, 240, 310, 14); c.fillStyle = "#aab4be"; c.fill(); c.fillStyle = "#f2a23a"; c.fillRect(-120, -90, 240, 190);
      c.fillStyle = "#ffd9a0"; c.beginPath(); c.arc(0, 5, 62, 0, 6.3); c.fill(); c.strokeStyle = "#c9742a"; c.lineWidth = 7; c.beginPath(); c.arc(-14, 5, 62, -0.9, 0.9); c.stroke();
      c.fillStyle = "#d5dce3"; c.beginPath(); c.ellipse(0, -150, 120, 22, 0, 0, 6.3); c.fill();
      c.restore(); if (b > 0) { c.save(); c.globalAlpha = b; txt(c, "CANNED PEACHES", 790, Y + 250, `800 58px ${K.DISP}`, "#ffffff"); c.restore(); }
    },
  });
})();
window.SPEC = {
  credit: "Amit Evron · CC BY-SA 3.0",
  beats: [
    { kind: "photo", src: "tower", fit: "cover", fx: 0.215, fy: 0.5, z0: 1.0, z1: 1.08, label: "REAL PHOTO · FORDLANDIA, BRAZIL" },
    { kind: "photo", src: "aerial", at: /^It$/, pw: 1000, z0: 1.0, z1: 1.06, label: "FORD COMPANY PHOTO · FORDLANDIA, 1934", credit: "Ford Motor Company, 1934 · public domain" },
    { kind: "photo", src: "factory", at: /^He$/, pw: 1000, z0: 1.0, z1: 1.05, label: "THE FACTORY, ON THE TAPAJOS RIVER", credit: "Méduse · CC BY-SA 3.0" },
    { kind: "photo", src: "brochure", at: /^His$/, pw: 1000, z0: 1.0, z1: 1.06, label: "FORD COMPANY BROCHURE · 1937", credit: "Ford Motor Company, 1937 · public domain" },
    { kind: "diagram", diagram: "menu", at: /^served$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "warehouse", at: [/^In$/, 0], pw: 1000, z0: 1.0, z1: 1.06, label: "THE MAIN WAREHOUSE, FORDLANDIA", credit: "RodrigoCruzatti · CC BY 4.0" },
    { kind: "photo", src: "trees", at: /^cut$/, pw: 1000, z0: 1.0, z1: 1.06, label: "FORDLANDIA, UNDER THE TREES", credit: "Méduse · CC BY-SA 3.0" },
    { kind: "photo", src: "map", at: /^The$/, pw: 880, maxH: 940, cy: 985, fy: 0.5, z0: 1.0, z1: 1.04, label: "FORDLANDIA ESTATE MAP · 1942", credit: "J. A. Russell, 1942 · public domain" },
    { kind: "photo", src: "hospital", at: [/^In$/, 1], pw: 1000, z0: 1.0, z1: 1.06, label: "THE HOSPITAL, FORDLANDIA, 2016", credit: "RodrigoCruzatti · CC BY 4.0" },
    { kind: "photo", src: "watertower", at: /^Not$/, fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.08, label: "THE WATER TOWER STILL STANDS" },
  ],
  nums: [["nineteen twenty-eight", "1928"], ["nineteen thirty", "1930"], ["nineteen forty-five", "1945"], ["twenty million dollars", "$20 million"]],
  marks: [{ at: /^Planted$/, to: [/^In$/, 1], ix: 0.21, iy: 0.645, r: 78, text: "CONDEMNED LAND", side: "right" }],
  stamps: [
    { text: "FORD NEVER VISITED", at: /^never$/, to: /^His$/, y: 1570, size: 68 },
    { text: "NO ALCOHOL · NO TOBACCO", at: /^alcohol/, to: /^served$/, y: 1570, size: 56 },
    { text: "1930: RIOT", at: /^rioted/, to: /^cut$/, y: 1570, size: 80 },
    { text: "TELEGRAPH WIRES CUT", at: /^telegraph/, to: /^until$/, y: 1570, size: 62 },
    { text: "LOSS: OVER $20 MILLION", at: /^twenty$/, to: /^Not$/, y: 1570, size: 60 },
    { text: "NOT ONE DROP", at: /^drop$/, y: 1570, size: 76 },
  ],
};
