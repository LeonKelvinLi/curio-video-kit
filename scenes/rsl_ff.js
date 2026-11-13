/* RSL footage-first · arm C (micro-story, 40 s), same-story pair with RS and the same first picture. AD 193: the Praetorian Guard
   kills Pertinax and sells the throne at its camp wall; Didius Julianus wins at 25,000 sesterces per soldier and is dead in 66 days.
   Facts: assets/src/romesold/facts.json. The "market or auction room" line and the last words are Cassius Dio's (a hostile eyewitness)
   and are given as his. The rival bidder, Sulpicianus, is not named in the script. Engravings are Pogliaghi's 1886 imaginings and the
   labels say so. Diagram "bids": the price climbing to 20,000, then Julianus's jump of 5,000. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420, ink = "#e9eef3", gold = "#ffc83d";
  const fmt = n => String(n).replace(/\B(?=(\d{3})+$)/g, ",");
  let tw = null;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    bids(c, t, vp, p, b) {
      if (!tw) tw = { twenty: WORDS[K.ix(WORDS, /^twenty$/)].s, five: WORDS[K.ix(WORDS, /^five$/)].s };
      const jump = t >= tw.five, n = jump ? 25000 : 5000 + 1000 * Math.round(15 * clamp((t - b.t0) / (tw.twenty - b.t0)));
      const pop = jump ? lerp(1.25, 1, E.out(clamp((t - tw.five) / 0.3))) : 1;
      c.save(); c.translate(540, SY(830)); c.scale(pop, pop); txt(c, fmt(n), 0, 0, `800 190px ${K.DISP}`, jump ? gold : "#ffffff"); c.restore();
      txt(c, "SESTERCES PER SOLDIER", 540, SY(960), `700 44px ${K.DISP}`, "rgba(233,238,243,.8)");
      if (jump) txt(c, "+5,000 IN ONE BID", 540, SY(1030), `800 46px ${K.DISP}`, gold);
      const g = SY(1440); c.strokeStyle = "rgba(233,238,243,.5)"; c.lineWidth = 6; c.beginPath(); c.moveTo(60, g); c.lineTo(1020, g); c.stroke();
      c.fillStyle = "#8a5a3c"; c.fillRect(490, g - 300, 100, 300); for (let i = 0; i < 3; i++) c.fillRect(484 + i * 40, g - 330, 32, 34); // the camp wall, side on
      c.fillStyle = "rgba(0,0,0,.25)"; for (let i = 1; i < 8; i++) c.fillRect(490, g - 300 + i * 38, 100, 4);
      const man = (x, col, up) => { c.strokeStyle = col; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.moveTo(x - 34, g); c.lineTo(x, g - 90); c.lineTo(x + 34, g); c.moveTo(x, g - 90); c.lineTo(x, g - 170);
        c.moveTo(x - 40, g - 110); c.lineTo(x, g - 160); c.lineTo(x + 40, up ? g - 230 - 8 * Math.sin(t * 9) : g - 110); c.stroke(); circ(c, x, g - 198, 26, col); };
      man(270, ink, !jump); man(810, gold, jump);
      txt(c, "INSIDE THE CAMP", 270, g + 56, `800 38px ${K.DISP}`, ink); txt(c, "AT THE GATES", 810, g + 56, `800 38px ${K.DISP}`, gold);
      txt(c, "RIVAL BIDDER", 270, g - 280, `700 34px ${K.DISP}`, "rgba(233,238,243,.8)"); txt(c, "JULIANUS", 810, g - 280, `700 34px ${K.DISP}`, gold);
    },
  });
})();
window.SPEC = {
  credit: "Numismatica Ars Classica · CC BY-SA 3.0 DE",
  beats: [
    { kind: "photo", src: "coin", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.08, label: "REAL GOLD COIN · THE BUYER, AD 193" },
    { kind: "photo", src: "guard", at: /^Twenty-five/, pw: 1000, z0: 1.0, z1: 1.08, label: "THE PALACE GUARD · ROMAN RELIEF", credit: "Jean-Pol Grandmont · CC BY 4.0" },
    { kind: "photo", src: "pertcoin", at: /^It$/, pw: 860, maxH: 860, z0: 1.0, z1: 1.06, label: "AD 193 · EMPEROR PERTINAX", credit: "American Numismatic Society · CC0" },
    { kind: "photo", src: "pertinax", at: /^murdered/, pw: 1000, iz: 1.35, fx: 0.42, fy: 0.5, z0: 1.0, z1: 1.06, label: "ENGRAVING, 1886 · PERTINAX KILLED", credit: "Lodovico Pogliaghi, 1886 · public domain" },
    { kind: "photo", src: "wall", at: /^One$/, pw: 1000, z0: 1.0, z1: 1.06, label: "THE GUARD'S CAMP WALL · ROME TODAY", credit: "Joris van Rooden · CC BY-SA 3.0" },
    { kind: "photo", src: "auction", at: /^Didius/, pw: 1000, iz: 1.5, fx: 0.56, fy: 0.64, z0: 1.0, z1: 1.07, label: "ENGRAVING, 1886 · JULIANUS AT THE GATE", credit: "Lodovico Pogliaghi, 1886 · public domain" },
    { kind: "diagram", diagram: "bids", at: [/^The$/, 1], credit: "Curio diagram · simplified" },
    { kind: "photo", src: "coin2", at: [/^The$/, 2], pw: 1000, z0: 1.0, z1: 1.07, label: "HIS COINS: \"RULER OF THE WORLD\"" },
    { kind: "photo", src: "auction", at: /^Cassius/, pw: 1000, z0: 1.0, z1: 1.08, label: "THE SALE, AS DIO TOLD IT · DRAWN 1886", credit: "Lodovico Pogliaghi, 1886 · public domain" },
    { kind: "photo", src: "relief", at: /^Then$/, pw: 800, maxH: 860, iz: 1.24, z0: 1.0, z1: 1.07, label: "THE PALACE GUARD", credit: "Jean-Pol Grandmont · CC BY 4.0" },
    { kind: "photo", src: "bust", at: /^His$/, pw: 800, maxH: 860, iz: 1.2, fy: 0.42, z0: 1.0, z1: 1.08, label: "DIDIUS JULIANUS", credit: "Wilfredor · CC0" },
  ],
  nums: [["twenty-five thousand", "25,000"], ["sixty-six", "66"], ["one ninety-three", "193"], ["twenty thousand", "20,000"], ["five thousand", "5,000"]],
  tags: [{ text: "CASSIUS DIO, ROMAN HISTORY, BOOK 74", at: /^wrote$/, to: /^Then$/, y: 1590, color: "#ffc83d" }],
  stamps: [{ text: "DEAD IN 66 DAYS", at: /^dead$/, to: /^It$/, y: 1612, size: 68 }, { text: "EMPEROR FOR 66 DAYS", at: /^killed$/, to: /^His$/, y: 1612, size: 60 }],
};
