/* DW footage-first · arm CTRL (test pair T7-2: current format, 16-18 s, framed prints exactly like pp_ff.js). The Draupner wave: on
   1 Jan 1995 a downward-pointing laser under the Draupner platform in the North Sea measured a 25.6 m (84 ft) wave; the rig was built for
   a 1-in-10,000-year wave of about 20 m (Wikipedia gives 64 ft). Facts: assets/src/draupner/facts.json. First frame: NOAA photo of a
   merchant ship facing a huge wave, Bay of Biscay, c. 1940 (public domain); it is NOT the Draupner wave and is not labelled as it.
   Second photo: a NOAA ship in heavy seas on Georges Bank (1968-2008, public domain). The record beat is Ingvald Straume's plot of the laser data (CC BY-SA 3.0). No rights-clear photo of the Draupner platform was
   found, so none is shown. "Myth" not "impossible": the sources support treated-as-myth. Diagram "design": 64 ft design wave vs 84 ft. */
(function () {
  const { clamp, lerp, E, rr, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    design(c, t, vp, p) {
      const base = SY(1440), k = 8.2, a = E.out(clamp(p * 2.2)), b = E.out(clamp((p - 0.12) * 2.2));
      c.strokeStyle = "#4d7ea8"; c.lineWidth = 6; c.beginPath(); c.moveTo(90, base); c.lineTo(990, base); c.stroke();
      const bar = (x, ft, q, col, top, sub) => { const h = ft * k * q; rr(c, x - 120, base - h, 240, h, 10); c.fillStyle = col; c.fill();
        if (q > 0.05) { txt(c, top, x, base - h - 92, `800 76px ${K.DISP}`, col); txt(c, sub, x, base - h - 34, `700 38px ${K.DISP}`, "#ffffff"); } };
      bar(330, 64, a, "#9fb3c4", "64 FT", "DESIGN WAVE");
      bar(750, 84, b, "#ffc83d", "84 FT", "MEASURED, 1995");
      txt(c, "SEA LEVEL", 540, base + 52, `700 36px ${K.DISP}`, "#9fb3c4");
    },
  });
})();
window.SPEC = {
  credit: "NOAA · public domain",
  beats: [
    { kind: "photo", src: "ship", pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO, c. 1940 · BAY OF BISCAY", credit: "NOAA · public domain" },
    { kind: "photo", src: "seas", at: /^and$/, pw: 1000, maxH: 880, cy: 1060, fy: 0.3, z0: 1.0, z1: 1.06, label: "NOAA PHOTO · GEORGES BANK, ATLANTIC", credit: "NOAA · public domain" },
    { kind: "photo", src: "record", at: /^On$/, pw: 1000, z0: 1.0, z1: 1.05, label: "THE LASER RECORD, 1 JAN 1995", credit: "Ingvald Straume · CC BY-SA 3.0" },
    { kind: "diagram", diagram: "design", at: /^The$/, credit: "Curio diagram · simplified" },
  ],
  nums: [["nineteen ninety-five", "1995"], ["eighty-four", "84"], ["sixty-four-foot", "64-foot"], ["ten thousand", "10,000"]],
  marks: [{ at: /^measured$/, to: /^The$/, ix: 0.46, iy: 0.24, r: 70, text: "THE WAVE", side: "right" }],
  stamps: [
    { text: "DRAUPNER PLATFORM · NORTH SEA", at: /^North$/, to: /^measured$/, y: 1570, size: 56 },
    { text: "25.6 M (84 FT) TROUGH TO CREST", at: /^eighty-four/, to: /^The$/, y: 1570, size: 54 },
    { text: "ONCE IN 10,000 YEARS", at: /^expected$/, y: 1570, size: 66 },
  ],
};
