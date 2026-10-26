/* P8 footage-first · William Rankin's 40-minute fall through a thunderstorm, 26 Jul 1959. Facts: Wikipedia "William Rankin"
   (F8U Crusader engine failure at ~47,000 ft; ejected without a pressure suit at 6:00 pm, his watch read 6:40 pm on the ground;
   updrafts carried him up repeatedly through hail and lightning). His book: The Man Who Rode the Thunder. Diagram: storm
   cross-section with the updraft loop, simplified. Real footage/photos: assets/src/p8/sources.json. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, poly } = K, Wd = WORDS, w = (re, n) => Wd[K.ix(Wd, re, n)].s, SY = y => y - 420;
  const tUp = w(/^Updrafts$/), tHail = w(/^hail$/), tLight = w(/^lightning/), tWhen = w(/^When$/);
  function cloud(c) { // cumulonimbus cross-section: stem + anvil
    c.fillStyle = "#4a5666"; poly(c, [[150, SY(1560)], [260, SY(1040)], [210, SY(760)], [60, SY(700)], [1020, SY(700)], [870, SY(760)], [820, SY(1040)], [930, SY(1560)]]); c.fill();
    for (let i = 0; i < 26; i++) circ(c, 120 + K.hash(i) * 840, SY(720 + K.hash(i + 1) * 820), 70 + 60 * K.hash(i + 2), `rgba(${84 + 40 * K.hash(i + 3)},${96 + 40 * K.hash(i + 3)},${112 + 40 * K.hash(i + 3)},.6)`);
  }
  const loop = u => { const a = u * Math.PI * 2; return [540 + Math.sin(a) * 250, SY(1180) - Math.cos(a) * 300]; }; // one lap of the updraft loop
  window.DIAGRAMS = {
    storm(c, t, vp, p, b) {
      cloud(c);
      c.save(); c.strokeStyle = "rgba(255,200,61,.8)"; c.lineWidth = 12; c.setLineDash([30, 24]); c.lineDashOffset = -t * 160; c.beginPath(); c.ellipse(540, SY(1180), 250, 300, 0, 0, 6.29); c.stroke(); c.restore();
      txt(c, "UPDRAFT LOOP", 540, SY(1180), `800 50px ${K.DISP}`, "#ffc83d");
      if (t > tHail) for (let i = 0; i < 40; i++) { const y = SY(760) + ((K.hash(i + 40) * 800 + t * 500 * (0.6 + K.hash(i))) % 800); circ(c, 200 + K.hash(i + 41) * 680, y, 8 + 8 * K.hash(i + 42), "rgba(245,250,255,.9)"); }
      if (t > tLight && t - tLight < 0.25) { c.save(); c.globalAlpha = 1 - (t - tLight) / 0.25; c.strokeStyle = "#ffffff"; c.lineWidth = 10; c.beginPath(); c.moveTo(760, SY(760)); c.lineTo(690, SY(980)); c.lineTo(740, SY(1010)); c.lineTo(650, SY(1300)); c.stroke(); c.restore(); }
      const laps = 1.6 * inv(tUp, tWhen, t), [x, y] = loop(laps); // Rankin, carried round the loop
      c.save(); c.translate(x, y); c.scale(1.5, 1.5); c.fillStyle = "#f2efe6"; c.beginPath(); c.arc(0, -70, 60, Math.PI, 0); c.fill(); c.strokeStyle = "#f2efe6"; c.lineWidth = 3; c.beginPath(); c.moveTo(-58, -70); c.lineTo(0, 0); c.moveTo(58, -70); c.lineTo(0, 0); c.stroke();
      circ(c, 0, 6, 12, "#2f3a46"); rr(c, -10, 14, 20, 40, 8); c.fillStyle = "#2f3a46"; c.fill(); c.restore();
    },
  };
})();
window.SPEC = {
  credit: "US Navy / USAF / NASA · public domain",
  nums: [["nineteen fifty-nine", "1959"], ["forty-seven thousand", "47,000"], ["forty", "40"]],
  beats: [
    { kind: "clip", src: "cloud", pw: 1000, z0: 1.0, z1: 1.08, label: "REAL 1947 FILM · FLYING INTO A STORM", credit: "US Army Air Forces Thunderstorm Project film, 1947" },
    { kind: "clip", src: "iss", at: /^for$/, pw: 1000, z0: 1.02, z1: 1.08, label: "REAL NASA FOOTAGE · LIGHTNING IN STORMS", credit: "NASA, seen from the space station" },
    { kind: "photo", src: "crusader", at: /^In$/, pw: 1000, z0: 1.0, z1: 1.08, label: "HIS JET TYPE · MARINE F8U CRUSADER", credit: "US Navy photo, 1950s · public domain" },
    { kind: "photo", src: "ejection", at: /^ejected$/, pw: 1000, z0: 1.0, z1: 1.08, label: "A REAL CRUSADER EJECTION · 1963", credit: "US Navy photo, 1963 · a different pilot" },
    { kind: "diagram", diagram: "storm", at: /^Updrafts$/, credit: "Curio diagram · simplified" },
    { kind: "clip", src: "canopy", at: /^When$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL 1960 USAF PARACHUTE FILM", credit: "USAF Project Excelsior film, 1960 · public domain" },
    { kind: "clip", src: "land", at: [/^he$/, 2], pw: 1000, z0: 1.0, z1: 1.06, label: "REAL 1960 USAF PARACHUTE FILM", credit: "USAF Project Excelsior film, 1960 · public domain" },
  ],
  marks: [{ at: [/^ejected$/, 0], to: /^Updrafts$/, ix: 0.69, iy: 0.42, r: 90, text: "EJECTION SEAT", side: "left" }],
  counter: { label: "HIS WATCH", at: /^Updrafts$/, to: null, y: 1500, values: [[/^Updrafts$/, "6:00 PM"], [/^ground/, "6:40 PM"]] },
  stamps: [{ text: "ALIVE", at: /^alive/, y: 1330, size: 84 }],
};
