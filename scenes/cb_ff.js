/* CB footage-first · arm C (micro-story, 37 s). Charles Byrne, the "Irish Giant" (1761-1783): he arranged a lead coffin and a burial at
   sea to keep anatomists away; John Hunter got the body anyway, and the skeleton was on show in London until 2023.
   Idea: curio-learning/research/2026-11-02/ideas.json rank 26. Facts: assets/src/byrne/facts.json. Sources: assets/src/byrne/sources.json.
   First frame: John Kay's etching of Byrne towering over George Cranstoun and three other men (the man himself, at full height; not the
   skeleton). Caveats kept on screen: the bribe is only "said" to have happened (tag says it is a claim); the Kay etching's date differs
   between catalogues (1784 / 1794), so its label carries no year; the 1782 advert claimed 8 ft 2 in, the skeleton says about 7 ft 7 in,
   so only the top lines of the advert are shown. The 2007 gallery photo shows the room before the 2023 removal (label says so).
   Diagram "coast", simplified: the plan (a lead coffin carried to the coast for a burial at sea), not a map, not to scale. */
(function () {
  const { clamp, lerp, E, rr, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    coast(c, t, vp, p) {
      const G = SY(1250), shore = 700;
      txt(c, "1783", 540, SY(760), `800 120px ${K.DISP}`, "#ffffff");
      txt(c, "THE PLAN: BURIAL AT SEA", 540, SY(880), `800 50px ${K.DISP}`, "#ffc83d");
      // land (left) and sea (right)
      c.fillStyle = "#3a3f2c"; c.fillRect(0, G, shore, SY(1640) - G);
      c.fillStyle = "#1d3b55"; c.fillRect(shore, G + 30, 1080 - shore, SY(1640) - G - 30);
      c.strokeStyle = "rgba(200,225,245,.55)"; c.lineWidth = 5;
      for (let r = 0; r < 4; r++) { c.beginPath(); for (let x = shore + 20; x <= 1080; x += 8) { const y = G + 70 + r * 70 + Math.sin(x / 26 + t * 2 + r) * 8; x === shore + 20 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
      // a ship waiting off the coast
      const bob = Math.sin(t * 1.6) * 6; c.save(); c.translate(900, G + 10 + bob);
      c.fillStyle = "#5b3b22"; c.beginPath(); c.moveTo(-90, 0); c.lineTo(90, 0); c.lineTo(62, 40); c.lineTo(-62, 40); c.closePath(); c.fill();
      c.fillStyle = "#e9e2cf"; c.fillRect(-4, -150, 8, 150); c.beginPath(); c.moveTo(8, -140); c.lineTo(70, -30); c.lineTo(8, -30); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-8, -130); c.lineTo(-64, -30); c.lineTo(-8, -30); c.closePath(); c.fill(); c.restore();
      txt(c, "SHIP", 900, G + 110, `800 38px ${K.DISP}`, "#e9eef3");
      // the lead coffin, carried toward the coast
      const a = E.out(clamp(p * 4)), x = lerp(170, 520, E.sine(clamp(p / 0.9)));
      c.save(); c.globalAlpha = a; c.translate(x, G - 70);
      c.fillStyle = "#8d949b"; c.beginPath(); c.moveTo(-150, -34); c.lineTo(120, -44); c.lineTo(165, 0); c.lineTo(120, 44); c.lineTo(-150, 34); c.closePath(); c.fill();
      c.strokeStyle = "#c9d0d6"; c.lineWidth = 5; c.stroke();
      txt(c, "LEAD COFFIN", 0, -90, `800 44px ${K.DISP}`, "#ffffff");
      c.fillStyle = "#2a2018"; c.beginPath(); c.arc(-100, 52, 20, 0, 6.3); c.arc(90, 52, 20, 0, 6.3); c.fill(); c.restore();
      txt(c, "TO THE COAST", 330, G + 120, `800 46px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Wellcome Collection · CC BY 4.0",
  beats: [
    { kind: "photo", src: "kay", pw: 800, maxH: 1010, cy: 1075, fy: 0.5, z0: 1.0, z1: 1.06, label: "ETCHING BY JOHN KAY · BYRNE, CENTRE" },
    { kind: "photo", src: "ad", at: [/^He$/, 0], pw: 940, maxH: 700, z0: 1.0, z1: 1.04, label: "NEWSPAPER ADVERT, 1782", credit: "Bodleian Libraries · public domain" },
    { kind: "diagram", diagram: "coast", at: /^When$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "hunter", at: /^But$/, pw: 1000, fy: 0.45, z0: 1.0, z1: 1.06, label: "SURGEON JOHN HUNTER · PAINTING", credit: "John Jackson after Reynolds · public domain" },
    { kind: "photo", src: "skel", at: [/^Hunter$/, 1], pw: 600, maxH: 1000, cy: 1060, z0: 1.0, z1: 1.05, label: "HIS SKELETON · PHOTO 2017", credit: "Emőke Dénes · CC BY-SA 4.0" },
    { kind: "photo", src: "rcs", at: /^It$/, pw: 640, maxH: 1000, cy: 1060, z0: 1.0, z1: 1.05, label: "ON SHOW · OLD PRINT" },
    { kind: "photo", src: "skull", at: /^In$/, pw: 900, maxH: 1000, cy: 1070, z0: 1.0, z1: 1.07, label: "HIS SKULL · PHOTO 2012", credit: "Maggie Jones · public domain" },
    { kind: "photo", src: "gallery", at: /^Only$/, pw: 1000, iz: 1.35, fx: 0.62, fy: 0.5, z0: 1.0, z1: 1.06, label: "HUNTERIAN MUSEUM · PHOTO 2007", credit: "Paul Dean · CC BY-SA 3.0" },
  ],
  nums: [["seven foot seven", "7 ft 7"], ["seventeen eighty-three", "1783"], ["twenty-two", "22"], ["two hundred", "200"], ["twenty eleven", "2011"], ["twenty twenty-three", "2023"]],
  tags: [
    { text: "THE BRIBE IS A CLAIM", at: /^said$/, to: /^swapped$/, y: 1570, color: "#ffc83d" },
  ],
  stamps: [
    { text: "7 FT 7 IN", at: /^seven$/, to: /^When$/, y: 1570, size: 84 },
    { text: "DIED AGED 22", at: /^aged$/, to: /^But$/, y: 1570, size: 72 },
    { text: "SWAPPED FOR WEIGHTS", at: /^swapped$/, to: [/^Hunter$/, 1], y: 1570, size: 64 },
    { text: "ON SHOW ~200 YEARS", at: /^nearly$/, to: /^In$/, y: 1570, size: 70 },
    { text: "2011: A RARE GENE MUTATION", at: /^mutation/, to: /^Only$/, y: 1570, size: 54 },
    { text: "OFF DISPLAY · 2023", at: /^twenty-three$/, y: 1570, size: 76 },
  ],
};
