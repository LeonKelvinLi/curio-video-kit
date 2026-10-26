/* MM footage-first · Operation Mincemeat (1943). Facts: assets/src/mincemeat/facts.json. Both diagrams draw on the NASA World
   Wind Mediterranean basemap (public domain; ASSETS.map, 2046x1496 px; map points from facts.json): "drop" = HMS Seraph's
   track to the drop point off Huelva and the body washing ashore; "plan" = the fake letters' targets (Greece, Sardinia), the
   German reinforcements there, then the real target, Sicily. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  const tw = (re, n) => WORDS[K.ix(WORDS, re, n)].s;
  const MAP = new Image(); MAP.src = ASSETS.map;
  const P = { huelva: [124, 764], drop: [96, 806], start: [0, 1010], sardinia: [732, 678], greece: [1300, 862], sicily: [940, 840], africa: [560, 1010] };
  const TOP = SY(650), H = 900; // map window on screen: y 650..1550, full width
  function cam(c, cx, cy, s) { // draw the map with point (cx, cy) mid-window at s screen px per map px; return a map -> screen projector
    const sw = 1080 / s, sh = H / s, sx = clamp(cx - sw / 2, 0, MAP.width - sw), sy = clamp(cy - sh / 2, 0, MAP.height - sh);
    c.save(); c.beginPath(); c.rect(0, TOP, 1080, H); c.clip(); c.drawImage(MAP, sx, sy, sw, sh, 0, TOP, 1080, H);
    c.fillStyle = "rgba(6,10,14,.28)"; c.fillRect(0, TOP, 1080, H); c.restore();
    return ([x, y]) => [(x - sx) * s, TOP + (y - sy) * s];
  }
  function arrow(c, a, b, q, color, dash, bend) { // curved arrow a -> b drawn up to fraction q, head at the end
    if (q <= 0) return; const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - (bend || 0);
    const pt = u => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1]];
    c.save(); c.strokeStyle = color; c.lineWidth = 10; c.lineCap = "round"; c.setLineDash(dash ? [26, 20] : []); c.beginPath();
    for (let i = 0; i <= 40; i++) { const [x, y] = pt(q * i / 40); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]);
    if (q > 0.97) { const [x1, y1] = pt(0.94), [x2, y2] = pt(1); c.translate(x2, y2); c.rotate(Math.atan2(y2 - y1, x2 - x1)); poly(c, [[12, 0], [-28, -22], [-28, 22]], color); }
    c.restore(); return pt(q);
  }
  function pin(c, [x, y], color, a, ring) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); circ(c, x, y, 15, color); c.strokeStyle = "#ffffff"; c.lineWidth = 4; c.beginPath(); c.arc(x, y, 15, 0, 6.3); c.stroke();
    if (ring) { c.strokeStyle = color; c.lineWidth = 5; c.globalAlpha = clamp(a) * (1 - ring); c.beginPath(); c.arc(x, y, 15 + 60 * ring, 0, 6.3); c.stroke(); } c.restore(); }
  function label(c, text, x, y, color, a, align) { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.font = `800 40px ${K.DISP}`; const w = c.measureText(text).width + 28, x0 = align === "right" ? x - w : align === "left" ? x : x - w / 2;
    rr(c, x0, y - 30, w, 60, 10); c.fillStyle = "rgba(6,10,14,.86)"; c.fill(); txt(c, text, x0 + w / 2, y + 2, `800 40px ${K.DISP}`, color); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    drop(c, t, vp, p, b) {
      const pr = cam(c, 260, 800, lerp(1.45, 1.6, E.sine(p))), go = E.sine(clamp(p / 0.45)), drift = E.out(clamp((p - 0.5) / 0.3));
      label(c, "SPAIN", pr([330, 640])[0], pr([330, 640])[1], "#e9eef3", 1); label(c, "ATLANTIC", 30, pr([20, 690])[1], "#9fc7e8", 1, "left");
      const at = arrow(c, pr(P.start), pr(P.drop), go, "#e9eef3", true, -40);
      if (go < 1) label(c, "HMS SERAPH", at[0] + 30, at[1] + 50, "#e9eef3", go * 4, "left");
      pin(c, pr(P.drop), "#ffc83d", go >= 1 ? 1 : 0, (t * 0.8) % 1);
      label(c, "BODY RELEASED · 4:15 AM", pr(P.drop)[0] + 40, pr(P.drop)[1] + 60, "#ffc83d", (p - 0.42) * 6, "left");
      if (drift > 0) { const d = pr(P.drop), h = pr(P.huelva), x = lerp(d[0], h[0], drift), y = lerp(d[1], h[1], drift); circ(c, x, y, 10, "#ffffff"); }
      label(c, "WASHED ASHORE · HUELVA, 30 APRIL 1943", 540, TOP + 70, "#ffc83d", (p - 0.6) * 5);
    },
    plan(c, t, vp, p, b) {
      const pr = cam(c, 760, 840, 0.78), tH = tw(/^Hitler$/, 1), tW = tw(/^while$/);
      const fake = E.out(clamp(p * 3)), ger = clamp((t - tH) / 0.4), real = E.out(clamp((t - tW) / 0.7));
      pin(c, pr(P.africa), "#9fc7e8", 1); label(c, "ALLIED BASES", pr(P.africa)[0], pr(P.africa)[1] + 64, "#9fc7e8", 1);
      arrow(c, pr(P.africa), pr(P.sardinia), fake, "#ff6b4a", true, 80);
      arrow(c, pr(P.africa), pr(P.greece), clamp(fake * 1.15 - 0.15), "#ff6b4a", true, 200);
      const sa = pr(P.sardinia), gr = pr(P.greece), si = pr(P.sicily);
      label(c, ger > 0.5 ? "SARDINIA: GARRISON DOUBLED" : "FAKE TARGET: SARDINIA", sa[0], sa[1] - 70, ger > 0.5 ? "#ffffff" : "#ff6b4a", fake * 2);
      label(c, ger > 0.5 ? "GREECE: PANZERS SENT" : "FAKE TARGET: GREECE", 1060, gr[1] + 70, ger > 0.5 ? "#ffffff" : "#ff6b4a", fake * 2 - 0.6, "right");
      if (ger > 0) { pin(c, sa, "#ff6b4a", 1, (t * 0.9) % 1); pin(c, gr, "#ff6b4a", 1, (t * 0.9 + 0.5) % 1); }
      arrow(c, pr(P.africa), si, real, "#5fd38a", false, 40);
      if (real > 0.9) pin(c, si, "#5fd38a", 1, (t * 0.9) % 1);
      label(c, "REAL TARGET: SICILY · 10 JULY 1943", si[0], si[1] - 74, "#5fd38a", (real - 0.6) * 4);
      txt(c, real > 0.3 ? "WHILE THE ALLIES WENT HERE" : ger > 0.3 ? "HITLER BELIEVED IT" : "WHAT THE FAKE LETTERS SAID", 540, TOP + 66, `800 50px ${K.DISP}`, real > 0.3 ? "#5fd38a" : "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "The National Archives (UK) / IWM · public domain",
  beats: [
    { kind: "photo", src: "card", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL WWII DOCUMENT · HIS FAKE ID", credit: "Naval ID card, 1943 · The National Archives (UK) · public domain" },
    { kind: "photo", src: "seraph", at: /^A$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · HMS SERAPH, 1943", credit: "Royal Navy official photograph · public domain" },
    { kind: "diagram", diagram: "drop", at: /^dressed$/, credit: "Map: NASA World Wind (public domain) · Curio diagram" },
    { kind: "photo", src: "pam", at: /^He$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · 'PAM', THE FAKE GIRLFRIEND", credit: "The National Archives (UK), WO 106/5921 · public domain" },
    { kind: "diagram", diagram: "plan", at: /^fake$/, credit: "Map: NASA World Wind (public domain) · Curio diagram" },
  ],
  marks: [
    { at: 0.4, to: 1.5, ix: 0.22, iy: 0.15, r: 70, text: "FAKE NAME" },
    { at: 1.5, to: /^A$/, ix: 0.78, iy: 0.44, r: 95, text: "AN MI5 MAN'S PHOTO", side: "left" },
  ],
  tags: [{ text: "SHE WORKED FOR MI5", at: /^love$/, to: /^fake$/, y: 1420, color: "#ffc83d" }],
};
