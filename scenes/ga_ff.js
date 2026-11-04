/* GA footage-first · arm B (escalating mystery). The Ghost Army's inflatable Sherman and the two French cyclists, as veteran
   artist Arthur Shilstone told it. Facts: assets/src/ghostarmy/facts.json. Diagram "lift": four men carry a tank overhead while
   two cyclists watch. No rights-clear period photo of the unit's dummies has a NARA ID, so the object is the Spy Museum replica. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    lift(c, t, vp, p) {
      const g = SY(1340), bob = 8 * Math.sin(t * 5), ink = "#e9eef3";
      c.strokeStyle = "rgba(233,238,243,.5)"; c.lineWidth = 6; c.beginPath(); c.moveTo(50, g); c.lineTo(1030, g); c.stroke();
      c.fillStyle = "#6a7a55"; rr(c, 360, g - 340 + bob, 560, 110, 44); c.fill(); rr(c, 520, g - 420 + bob, 240, 90, 24); c.fill(); c.fillRect(730, g - 392 + bob, 250, 20);
      [430, 570, 710, 850].forEach(x => { c.strokeStyle = ink; c.lineWidth = 12; c.lineCap = "round"; c.beginPath();
        c.moveTo(x - 36, g); c.lineTo(x, g - 90); c.lineTo(x + 36, g); c.moveTo(x, g - 90); c.lineTo(x, g - 160); c.moveTo(x - 34, g - 228 + bob); c.lineTo(x, g - 160); c.lineTo(x + 34, g - 228 + bob); c.stroke(); circ(c, x, g - 186, 24, ink); });
      [120, 250].forEach(x => { c.strokeStyle = "#ffc83d"; c.lineWidth = 7; c.beginPath(); c.arc(x - 42, g - 34, 30, 0, 6.3); c.moveTo(x + 72, g - 34); c.arc(x + 42, g - 34, 30, 0, 6.3); c.moveTo(x - 42, g - 34); c.lineTo(x, g - 74); c.lineTo(x + 42, g - 34); c.moveTo(x, g - 74); c.lineTo(x + 6, g - 130); c.stroke(); circ(c, x + 8, g - 152, 20, "#ffc83d"); });
      txt(c, "TWO FRENCHMEN", 185, g + 60, `800 36px ${K.DISP}`, "#ffc83d"); txt(c, "FOUR GIs", 640, g + 60, `800 36px ${K.DISP}`, ink);
      txt(c, "40 TONS?", 540, SY(800), `800 110px ${K.DISP}`, "#ffffff");
    },
  });
})();
window.SPEC = {
  credit: "ArtemisiaGentileschiFan · CC0",
  beats: [
    { kind: "photo", src: "tank", pw: 1000, z0: 1.0, z1: 1.07, credit: "ArtemisiaGentileschiFan · CC0" },
    { kind: "diagram", diagram: "lift", at: /^A$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "tank", at: /^The$/, pw: 1000, iz: 1.25, fx: 0.55, fy: 0.6, z0: 1.0, z1: 1.08, label: "REPLICA · INTERNATIONAL SPY MUSEUM", credit: "ArtemisiaGentileschiFan · CC0" },
    { kind: "photo", src: "medal", at: /^artists/, pw: 1000, iz: 1.5, fx: 0.34, fy: 0.42, z0: 1.0, z1: 1.06, label: "GHOST ARMY GOLD MEDAL · 2024", credit: "Bedelstein / US Mint · public domain" },
  ],
  nums: [["forty-ton", "40-ton"], ["nineteen ninety-six", "1996"]],
  tags: [{ text: "AS VETERAN ARTHUR SHILSTONE TOLD IT", at: /^A$/, to: /^The$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "RUBBER", at: /^rubber/, to: /^artists/, y: 1500, size: 84 }, { text: "SECRET UNTIL 1996", at: /^secret/, y: 1560, size: 64 }],
};
