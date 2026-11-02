/* MC footage-first · children sent by US Parcel Post, 1913-14. Facts: assets/src/mailedkids/facts.json (USPS, Chronicling
   America pages of 29 Jan 1913, 19 Feb 1914 and 27 Feb 1914, Smithsonian NPM). The famous mailbag photo is a posed joke
   from about 1900 and is labelled as such. Diagram "route", simplified: May Pierstorff's mail-train trip, the 53 cents of
   stamps and the 49 lb "package" under the 50 lb limit. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    route(c, t, vp, p, b) {
      const go = E.io(clamp(p / 0.7)), w = clamp((p - 0.15) / 0.5);
      const X0 = 180, X1 = 900, Y = SY(1000);
      c.strokeStyle = "#8a96a3"; c.lineWidth = 10; c.beginPath(); c.moveTo(X0, Y); c.lineTo(X1, Y); c.stroke();
      c.strokeStyle = "#5a6673"; c.lineWidth = 4; for (let x = X0; x <= X1; x += 36) { c.beginPath(); c.moveTo(x, Y - 16); c.lineTo(x, Y + 16); c.stroke(); }
      circ(c, X0, Y, 16, "#ffc83d"); circ(c, X1, Y, 16, "#ffc83d");
      txt(c, "GRANGEVILLE", X0, Y + 60, `800 32px ${K.DISP}`, "#ffffff"); txt(c, "LEWISTON", X1, Y + 60, `800 32px ${K.DISP}`, "#ffffff");
      const tx = lerp(X0, X1, go); c.save(); c.translate(tx, Y - 40); rr(c, -70, -50, 140, 70, 10); c.fillStyle = "#e9eef3"; c.fill(); c.fillStyle = "#1c1c1c"; c.fillRect(-56, -36, 34, 26); c.fillRect(-10, -36, 34, 26); c.fillRect(36, -36, 22, 26);
      circ(c, -40, 26, 14, "#8a96a3"); circ(c, 40, 26, 14, "#8a96a3"); c.restore();
      txt(c, "MAIL TRAIN · 19 FEB 1914", 540, Y - 130, `800 34px ${K.DISP}`, "#ffc83d");
      // postage and weight
      rr(c, 140, SY(1180), 380, 170, 16); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, "POSTAGE", 330, SY(1220), `700 28px ${K.DISP}`, "#8a96a3"); txt(c, "53 CENTS", 330, SY(1290), `800 56px ${K.DISP}`, "#ffffff");
      rr(c, 560, SY(1180), 380, 170, 16); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, "'PACKAGE' WEIGHT", 750, SY(1220), `700 28px ${K.DISP}`, "#8a96a3"); txt(c, Math.round(49 * w) + " LB", 750, SY(1290), `800 56px ${K.DISP}`, "#ffffff");
      rr(c, 140, SY(1400), 800, 40, 12); c.fillStyle = "#2a3038"; c.fill(); rr(c, 140, SY(1400), 800 * 0.98 * w, 40, 12); c.fillStyle = "#ffc83d"; c.fill();
      txt(c, "PARCEL LIMIT · 50 LB", 940, SY(1480), `800 30px ${K.DISP}`, "#e9eef3", "right"); txt(c, "0", 140, SY(1480), `800 30px ${K.DISP}`, "#8a96a3", "left");
      txt(c, w > 0.9 ? "ONE POUND UNDER THE LIMIT" : "STAMPS ON HER SUITCASE, RIDING WITH THE MAIL", 540, SY(700), `800 44px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Library of Congress · public domain",
  beats: [
    { kind: "photo", src: "bag", pw: 820, maxH: 1060, z0: 1.0, z1: 1.08, fy: 0.45, label: "REAL PHOTO · A MAIL CARRIER'S JOKE, c.1900", credit: "Smithsonian National Postal Museum · CC0" },
    { kind: "photo", src: "puck", at: /^When$/, pw: 1000, z0: 1.0, z1: 1.08, label: "1913 MAGAZINE ART · THE NEW PARCEL POST", credit: "Puck, 1 Jan 1913 / Library of Congress · public domain" },
    { kind: "photo", src: "beagle", at: [/^a$/, 1], pw: 1000, maxH: 1060, fy: 0.0, z0: 1.0, z1: 1.07, label: "REAL NEWSPAPER · OHIO, JANUARY 1913", credit: "Chronicling America / Library of Congress · public domain" },
    { kind: "photo", src: "grangeville", at: /^May$/, pw: 1000, fy: 0.4, z0: 1.0, z1: 1.07, label: "REAL NEWSPAPER · GRANGEVILLE, 19 FEB 1914", credit: "Chronicling America / Library of Congress · public domain" },
    { kind: "diagram", diagram: "route", at: /^rode$/, credit: "Curio diagram · figures from the 19 Feb 1914 Grangeville paper" },
    { kind: "photo", src: "ruling", at: /^Then$/, pw: 1000, maxH: 1060, fy: 0.35, z0: 1.0, z1: 1.07, label: "REAL NEWSPAPER · 27 FEB 1914", credit: "Chronicling America / Library of Congress · public domain" },
  ],
  nums: [["nineteen thirteen", "1913"], ["fifty-three cents", "53 cents"]],
  marks: [
    { at: 0.5, to: /^When$/, ix: 0.6, iy: 0.55, r: 120, text: "IN THE MAILBAG", side: "left" },
    { at: /^parents$/, to: /^May$/, ix: 0.5, iy: 0.07, r: 130, text: "15 CENTS", side: "right" },
    { at: /^Pierstorff,$/, to: /^rode$/, ix: 0.55, iy: 0.17, r: 170 },
    { at: /^Office$/, to: /^Queen$/, ix: 0.4, iy: 0.08, r: 120, text: "THE RULING", side: "right" },
  ],
  tags: [
    { text: "300 MILLION PARCELS IN 6 MONTHS", at: /^began$/, to: [/^a$/, 1], y: 1520, color: "#ffc83d" },
    { text: "BABY BEAGLE · 15 CENTS · INSURED FOR $50", at: /^kids$/, to: /^May$/, y: 1520, color: "#ffc83d" },
    { text: "ALL HUMANS AND LIVE ANIMALS BARRED", at: /^humans$/, to: /^Queen$/, y: 1520, color: "#ffc83d" },
  ],
  stamps: [{ text: "EXCEPT QUEEN BEES", at: /^Queen$/, y: 1560, size: 60 }],
};
