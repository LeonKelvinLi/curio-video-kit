/* WW footage-first · "Wrong Way" Corrigan (17-18 July 1938). Facts: assets/src/topic5/facts.json (1938 AP reports via
   Chronicling America). Diagram "route" on the NASA Visible Earth world map (public domain; ASSETS.map is the crop lon -135..5,
   lat 70..15, 1493x640 px): the filed flight plan New York -> California, then the flight he actually made, New York ->
   Dublin in 28 h 13 min, and the compass he blamed. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  const MAP = new Image(); MAP.src = ASSETS.map;
  const S = 1080 / 1493, TOP = SY(820), P = { ny: [653, 313], la: [177, 385], dublin: [1373, 177] };
  const pr = ([x, y]) => [x * S, TOP + y * S];
  function label(c, text, x, y, color, a, align) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.font = `800 38px ${K.DISP}`; const w = c.measureText(text).width + 26, x0 = align === "right" ? x - w : align === "left" ? x : x - w / 2;
    rr(c, x0, y - 28, w, 56, 10); c.fillStyle = "rgba(6,10,14,.88)"; c.fill(); txt(c, text, x0 + w / 2, y + 2, `800 38px ${K.DISP}`, color); c.restore(); }
  function path(c, a, b, bend, q, color, dash) { // quadratic arc a -> b drawn to fraction q; returns the tip
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - bend], pt = u => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * m[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * m[1] + u * u * b[1]];
    if (q <= 0) return a; c.save(); c.strokeStyle = color; c.lineWidth = 9; c.lineCap = "round"; c.setLineDash(dash ? [24, 18] : []); c.beginPath();
    for (let i = 0; i <= 40; i++) { const [x, y] = pt(q * i / 40); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore(); return pt(q);
  }
  function plane(c, [x, y], ang) { c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = "#ffffff"; rr(c, -26, -6, 52, 12, 6); c.fill(); poly(c, [[-4, -30], [8, -30], [4, 30], [-8, 30]], "#ffffff"); poly(c, [[-26, -12], [-20, -12], [-20, 12], [-26, 12]], "#ffffff"); c.restore(); }
  function compass(c, x, y, ang, a) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); circ(c, x, y, 70, "rgba(6,10,14,.9)"); c.strokeStyle = "#e9eef3"; c.lineWidth = 5; c.beginPath(); c.arc(x, y, 70, 0, 6.3); c.stroke();
    txt(c, "N", x, y - 48, `800 28px ${K.DISP}`, "#e9eef3"); c.translate(x, y); c.rotate(ang); poly(c, [[0, -54], [12, 0], [-12, 0]], "#ff6b4a"); poly(c, [[0, 54], [12, 0], [-12, 0]], "#e9eef3"); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    route(c, t, vp, p, b) {
      const tC = tw(/^compass\.$/), plan = E.out(clamp(p / 0.25)), fly = E.io(clamp((p - 0.25) / 0.45)), flip = E.io(clamp((t - tC + 0.2) / 0.5));
      c.drawImage(MAP, 0, TOP, 1080, 640 * S); c.fillStyle = "rgba(6,10,14,.2)"; c.fillRect(0, TOP, 1080, 640 * S);
      const ny = pr(P.ny), la = pr(P.la), du = pr(P.dublin);
      path(c, ny, la, 60, plan, "#ffc83d", true); label(c, "FILED: CALIFORNIA", la[0] + 10, la[1] + 70, "#ffc83d", plan * 2, "left");
      const tip = path(c, ny, du, 150, fly, "#ff6b4a", false);
      if (fly > 0 && fly < 1) plane(c, tip, -0.35);
      circ(c, ny[0], ny[1], 13, "#ffffff"); label(c, "NEW YORK", ny[0], ny[1] + 64, "#e9eef3", 1);
      if (fly >= 1) { circ(c, du[0], du[1], 13, "#ff6b4a"); label(c, "DUBLIN", du[0], du[1] + 64, "#ff6b4a", 1, "right"); }
      const mins = Math.round(fly * (28 * 60 + 13));
      txt(c, `${Math.floor(mins / 60)} H ${String(mins % 60).padStart(2, "0")} MIN`, 540, SY(1430), `800 92px ${K.DISP}`, fly >= 1 ? "#ff6b4a" : "#ffffff");
      txt(c, "IN THE AIR", 540, SY(1500), `700 36px ${K.DISP}`, "rgba(233,238,243,.75)");
      compass(c, 950, SY(1440), Math.PI * flip, clamp((t - tC + 0.3) * 4));
      txt(c, flip > 0.3 ? "HE BLAMED HIS COMPASS" : fly > 0 ? "WHERE HE ACTUALLY WENT" : "WHAT HE FILED", 540, SY(720), `800 50px ${K.DISP}`, flip > 0.3 ? "#ff6b4a" : "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Library of Congress · public domain",
  beats: [
    { kind: "photo", src: "headline", pw: 1000, z0: 1.0, z1: 1.1, label: "REAL FRONT PAGE · JULY 18, 1938", credit: "Evening Star, 18 July 1938 · Library of Congress, Chronicling America" },
    { kind: "photo", src: "mulligan", at: /^Officials$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · CORRIGAN, AUGUST 1938", credit: "Harris & Ewing · Library of Congress · public domain" },
    { kind: "diagram", diagram: "route", at: /^After$/, credit: "Map: NASA Visible Earth (public domain) · Curio diagram" },
    { kind: "photo", src: "plane", at: /^His$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · HIS PLANE, SHIPPED HOME", credit: "Acme Newspictures, 1938 · public domain (not renewed)" },
    { kind: "photo", src: "wave", at: /^New$/, pw: 720, cy: 1075, z0: 1.0, z1: 1.06, label: "REAL PHOTO · CORRIGAN, 1938", credit: "Harris & Ewing · Library of Congress · public domain" },
  ],
  nums: [["twenty-eight", "28"]],
  marks: [
    { at: /^Officials$/, to: /^Douglas$/, ix: 0.36, iy: 0.2, r: 80, text: "AIR COMMERCE CHIEF" },
    { at: /^Douglas$/, to: /^After$/, ix: 0.72, iy: 0.28, r: 85, text: "CORRIGAN", side: "left" },
  ],
  tags: [
    { text: "HIS PLANE WAS NINE YEARS OLD", at: 0.8, to: /^Officials$/, y: 1400, color: "#ffc83d" },
    { text: "SUSPENDED UNTIL AUG 4 · SHIP DOCKED AUG 4", at: /^suspension$/, to: /^New$/, y: 1480, color: "#ffc83d" },
  ],
  stamps: [{ text: "'WRONG WAY' CORRIGAN", at: /^threw$/, y: 1595, size: 56 }],
};
