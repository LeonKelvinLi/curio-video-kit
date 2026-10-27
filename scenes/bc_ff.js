/* BC footage-first · SS Baychimo, the ghost ship of the Arctic (1931-1969). Facts: assets/src/baychimo/facts.json
   (1931-36 newspapers via Chronicling America, HBC Archives). Diagram "drift", simplified: a 1931-1969 timeline with the
   documented sightings (1932, 1933, 1934) and the reported 1969 one, plus a years-adrift counter. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  const X = y => lerp(120, 960, (y - 1931) / 38);
  const PINS = [[1931, "FROZEN IN", 0], [1932, "HUNTERS BOARD HER", 1], [1933, "CUTTER + BOTANIST", 2], [1934, "'PHANTOM SHIP'", 3], [1969, "LAST REPORTED", 0]];
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    drift(c, t, vp, p, b) {
      const yrs = Math.round(38 * E.out(clamp(p / 0.8))), Y = SY(1180);
      c.fillStyle = "rgba(233,238,243,.25)"; c.fillRect(120, Y - 4, 840, 8); c.fillStyle = "#ffc83d"; c.fillRect(120, Y - 4, 840 * yrs / 38, 8);
      PINS.forEach(([yr, text, row], i) => { const a = clamp((p - i * 0.15) * 5); if (a <= 0) return; c.save(); c.globalAlpha = a; const x = X(yr), dashed = yr === 1969;
        circ(c, x, Y, 14, dashed ? "#9fc7e8" : "#ffc83d"); const ly = yr === 1969 ? Y + 80 : Y - 70 - row * 62;
        txt(c, `${yr} ${text}`, yr === 1969 ? x : x - 6, ly, `800 34px ${K.DISP}`, dashed ? "#9fc7e8" : "#ffffff", yr === 1969 ? "right" : "left"); c.restore(); });
      txt(c, "YEARS ADRIFT", 540, SY(1380), `700 36px ${K.DISP}`, "rgba(233,238,243,.8)"); txt(c, String(yrs), 540, SY(1470), `800 120px ${K.DISP}`, "#ffc83d");
      txt(c, "SIGHTED AGAIN AND AGAIN", 540, SY(720), `800 50px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Public domain",
  beats: [
    { kind: "photo", src: "ship", pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · SS BAYCHIMO", credit: "1932 press photo · Bibliotheque nationale de France · public domain" },
    { kind: "photo", src: "trapped", at: /^Frozen$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · FROZEN IN, 1931", credit: "Hudson's Bay Company Archives · public domain" },
    { kind: "photo", src: "swallowed", at: /^vanished$/, pw: 560, maxH: 900, cy: 1080, fy: 0.3, z0: 1.0, z1: 1.05, label: "REAL 1931 NEWSPAPER", credit: "Seward Daily Gateway, Dec 1, 1931 · Library of Congress" },
    { kind: "photo", src: "bow", at: /^Inupiat$/, pw: 640, maxH: 900, cy: 1080, z0: 1.0, z1: 1.05, label: "REAL PHOTO · STILL AFLOAT, 1933", credit: "Hudson's Bay Company Archives · public domain" },
    { kind: "diagram", diagram: "drift", at: /^reportedly$/, credit: "Curio diagram · newspaper-documented sightings; 1969 reported" },
    { kind: "photo", src: "ghostly", at: /^Her$/, pw: 520, maxH: 900, cy: 1080, fy: 0.2, z0: 1.0, z1: 1.05, label: "REAL 1934 HEADLINE", credit: "Daily Alaska Empire, Mar 20, 1934 · Library of Congress" },
  ],
  nums: [["thirty-eight", "38"], ["nineteen thirty-one", "1931"], ["nineteen sixty-nine", "1969"]],
  tags: [{ text: "THE GHOST SHIP OF THE ARCTIC", at: 0.5, to: /^Frozen$/, y: 1460, color: "#ffc83d" }],
  stamps: [{ text: "WRECK NEVER FOUND", at: /^never$/, y: 1600, size: 60 }],
};
