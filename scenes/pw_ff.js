/* PW footage-first · the Pig War, San Juan Island, 1859-1872. Facts: assets/src/pigwar/facts.json (NPS San Juan Island NHP,
   Cutlar's 1859 affidavit at NARA, HistoryLink, FRUS 1872). Diagram "standoff", simplified: the island, the American camp at
   the south end with its guns, Royal Navy ships offshore, and the two claimed channels. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function ship(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); poly(c, [[-60, 0], [60, 0], [45, 22], [-45, 22]], "#e9eef3"); c.fillRect(-4, -70, 8, 70); poly(c, [[4, -66], [50, -30], [4, -30]], "#e9eef3"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    standoff(c, t, vp, p, b) {
      const us = E.out(clamp(p / 0.3)), uk = E.out(clamp((p - 0.3) / 0.3)), quiet = b.quiet ? 1 : 0;
      c.fillStyle = "#24364a"; c.fillRect(100, SY(760), 880, 880);
      poly(c, [[430, SY(800)], [560, SY(825)], [640, SY(945)], [700, SY(1120)], [660, SY(1345)], [560, SY(1425)], [460, SY(1375)], [420, SY(1200)], [380, SY(1000)]], "#2f4f3a");
      txt(c, "SAN JUAN", 540, SY(1090), `800 30px ${K.DISP}`, "#cfe3d2"); txt(c, "ISLAND", 540, SY(1130), `800 30px ${K.DISP}`, "#cfe3d2");
      // American camp at the south end
      c.save(); c.globalAlpha = us; circ(c, 560, SY(1360), 16, "#ff6b4a"); for (let i = 0; i < 6; i++) circ(c, 500 + i * 24, SY(1400), 6, "#ff6b4a");
      txt(c, "AMERICAN CAMP", 540, SY(1490), `800 32px ${K.DISP}`, "#ff6b4a"); txt(c, "461 SOLDIERS · 14 CANNON", 540, SY(1530), `700 28px ${K.DISP}`, "#ffffff"); c.restore();
      // Royal Navy offshore to the north-west
      c.save(); c.globalAlpha = uk; ship(c, 230, SY(900), 0.9); ship(c, 330, SY(1000), 0.9); ship(c, 250, SY(1110), 0.9);
      txt(c, "ROYAL NAVY", 260, SY(820), `800 32px ${K.DISP}`, "#8fd3ff"); txt(c, "WARSHIPS OFFSHORE", 260, SY(1190), `700 26px ${K.DISP}`, "#ffffff"); c.restore();
      if (quiet) { c.save(); c.globalAlpha = E.out(clamp(p * 2)); rr(c, 290, SY(1230), 500, 90, 16); c.fillStyle = "rgba(6,10,14,.85)"; c.fill(); txt(c, "NOT ONE SHOT", 540, SY(1277), `800 50px ${K.DISP}`, "#ffc83d"); c.restore(); }
      txt(c, quiet ? "BOTH SIDES DUG IN. NOBODY FIRED." : uk > 0.5 ? "THE NAVY ARRIVED WITH BIGGER GUNS" : "THE US ARMY LANDED FIRST", 540, SY(700), `800 44px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "National Park Service · public domain",
  beats: [
    { kind: "photo", src: "blockhouse", pw: 1000, z0: 1.0, z1: 1.08, label: "REAL PHOTO · ENGLISH CAMP, SAN JUAN ISLAND", credit: "Joe Mabel · CC BY-SA 4.0" },
    { kind: "photo", src: "farm", at: /^A$/, pw: 1000, z0: 1.0, z1: 1.1, label: "REAL PHOTO · THE BRITISH FARM, SEPT 1859", credit: "National Park Service · public domain" },
    { kind: "photo", src: "affidavit", at: /^rooting$/, pw: 820, maxH: 1060, iz: 1.6, fx: 0.5, fy: 0.3, z0: 1.0, z1: 1.05, label: "REAL DOCUMENT · CUTLAR'S SWORN STATEMENT", credit: "National Archives · public domain" },
    { kind: "diagram", diagram: "standoff", at: /^Four$/, credit: "Curio diagram · simplified" },
    { kind: "diagram", diagram: "standoff", quiet: true, at: /^Nobody$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "watercolour", at: /^Both$/, pw: 1000, z0: 1.0, z1: 1.07, label: "1868 WATERCOLOUR · ENGLISH CAMP", credit: "Porcher, 1868 / National Park Service · public domain" },
    { kind: "photo", src: "map", at: [/^a$/, 2], pw: 1000, z0: 1.0, z1: 1.06, label: "NPS MAP · THE TWO CLAIMED CHANNELS", credit: "National Park Service · public domain" },
  ],
  marks: [
    { at: /^rooting$/, to: /^Four$/, ix: 0.55, iy: 0.5, r: 120, text: "'HE SHOT A HOG'", side: "right" },
    { at: /^Kaiser$/, to: /^and$/, ix: 0.5, iy: 0.48, r: 90, text: "HARO STRAIT · US", side: "right" },
  ],
  tags: [
    { text: "15 JUNE 1859 · $100 OR 'NOT WORTH $10'", at: /^garden\.$/, to: /^Four$/, y: 1520, color: "#ffc83d" },
    { text: "1860 TO 1872 · TWO ARMIES, ONE ISLAND", at: /^twelve$/, to: [/^a$/, 2], y: 1520, color: "#ffc83d" },
  ],
  stamps: [{ text: "ONLY CASUALTY: THE PIG", at: /^only$/, y: 1560, size: 56 }],
};
