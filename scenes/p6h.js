/* P6 v4 · Ham, the chimp NASA flew before any American astronaut · trycurio.app style, Zack voice.
   Facts (Wikipedia "Ham (chimpanzee)", "Mercury-Redstone 2", accessed 2026-10-20): 31 Jan 1961; apogee 157 mi vs 115 planned; faster than the planned 4,400 mph;
   landed 422 mi downrange, 130 mi past the planned area; heat shield punched two holes, ~800 lb of seawater aboard; Ham in good condition.
   "Before any American astronaut": inference from dates (Shepard's Freedom 7 flew 5 May 1961). Photos: NASA, public domain. */
(function () {
  const { clamp, lerp, inv, E, hash, noise, rr, circ, txt, seg, poly } = K;
  const Wd = WORDS, T = window.T, w = (re, n) => Wd[K.ix(Wd, re, n)].s;
  const tNasa = w(/^astronaut/) + 0.15, // the real launch photo comes in right after the hook line
    tHigher = w(/^higher$/) - 0.05, tPlanned = w(/^planned/), tSplash = w(/^splashed$/), tHundred = w(/^hundred$/), tTarget = w(/^target/),
    tFill = w(/^and$/, 2) - 0.05, tOpened = w(/^opened$/) - 0.1;
  const imgHam = new Image(), imgLaunch = new Image(), imgAfter = new Image(); imgHam.src = ASSETS.ham; imgLaunch.src = ASSETS.launch; imgAfter.src = ASSETS.after;
  const ready = Promise.all([imgHam.decode(), imgLaunch.decode(), imgAfter.decode()]);
  function photoOpen(c, img, vp, u, fx0, fy0, fx1, fy1, z0, z1) { const p = E.out(clamp(u)), sc = Math.max(vp.w / img.width, vp.h / img.height) * lerp(z0, z1, p), dw = img.width * sc, dh = img.height * sc; c.drawImage(img, vp.x + vp.w / 2 - dw * lerp(fx0, fx1, p), vp.y + vp.h / 2 - dh * lerp(fy0, fy1, p), dw, dh); }
  // ---------- trajectory diagram (strip coordinates) ----------
  const SEA = 860, PAD = [110, SEA], TGT = [705, SEA], LAND = [971, SEA];
  const bez = (p0, cp, p1, u) => [lerp(lerp(p0[0], cp[0], u), lerp(cp[0], p1[0], u), u), lerp(lerp(p0[1], cp[1], u), lerp(cp[1], p1[1], u), u)];
  const CP_PLAN = [407, SEA - 2 * 437], CP_REAL = [540, SEA - 2 * 600]; // peaks: 115 mi -> 437 px, 157 mi -> 600 px (3.8 px/mi)
  const flightU = t => (t < tHigher ? 0 : t < tSplash ? lerp(0, 1, E.io(inv(tHigher, tSplash, t))) : 1);
  function capsuleIcon(c, x, y, s, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); poly(c, [[-14, 12], [14, 12], [6, -12], [-6, -12]], "#c9ced3"); rr(c, -5, -22, 10, 11, 2); c.fillStyle = "#9aa3ad"; c.fill(); rr(c, -15, 10, 30, 6, 3); c.fillStyle = "#3a3f45"; c.fill(); c.restore(); }
  function diagram(c, vp, t) {
    const g = c.createLinearGradient(0, 0, 0, SEA); g.addColorStop(0, "#030714"); g.addColorStop(0.6, "#0d2550"); g.addColorStop(1, "#5b8fc4"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    for (let i = 0; i < 80; i++) { const x = hash(i) * 1080, y = vp.y + hash(i + 4) * (520 - vp.y); c.fillStyle = `rgba(255,255,255,${(0.2 + 0.6 * hash(i + 8)) * (1 - y / 600)})`; c.fillRect(x, y, 2.5, 2.5); }
    // ocean + Florida coast with the pad
    const bot = vp.y + vp.h, og = c.createLinearGradient(0, SEA, 0, bot); og.addColorStop(0, "#1d5a8f"); og.addColorStop(1, "#0a2440"); c.fillStyle = og; c.fillRect(vp.x, SEA, vp.w, bot - SEA); // to the viewport bottom (full-screen layout)
    c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 2; for (let k = 0; k < 6; k++) { const y = SEA + 22 + k * 34; c.beginPath(); for (let x = 0; x <= 1080; x += 30) c.lineTo(x, y + Math.sin(x * 0.03 + t * 3 + k) * 4); c.stroke(); }
    poly(c, [[0, SEA - 8], [150, SEA - 8], [175, SEA + 16], [0, SEA + 16]], "#c2b280"); rr(c, PAD[0] - 6, SEA - 40, 12, 32, 3); c.fillStyle = "#e9edf1"; c.fill();
    txt(c, "CAPE CANAVERAL", 80, SEA + 60, `700 26px ${K.DISP}`, "rgba(233,238,243,.75)", "left");
    // planned arc (dashed) and target
    c.save(); c.setLineDash([14, 12]); c.strokeStyle = "rgba(233,238,243,.75)"; c.lineWidth = 4; c.beginPath(); c.moveTo(PAD[0], PAD[1]); c.quadraticCurveTo(CP_PLAN[0], CP_PLAN[1], TGT[0], TGT[1]); c.stroke(); c.restore();
    txt(c, "PLANNED", 407, SEA - 437 - 26, `800 30px ${K.DISP}`, "rgba(233,238,243,.85)");
    c.strokeStyle = "#ff6b5b"; c.lineWidth = 6; seg(c, TGT[0] - 18, SEA - 18, TGT[0] + 18, SEA + 18); seg(c, TGT[0] + 18, SEA - 18, TGT[0] - 18, SEA + 18); txt(c, "TARGET", TGT[0], SEA + 52, `800 26px ${K.DISP}`, "#ff8a7a");
    // the real flight: solid yellow trail + capsule
    const u = flightU(t); if (u > 0) { c.strokeStyle = "#ffc83d"; c.lineWidth = 6; c.beginPath(); c.moveTo(PAD[0], PAD[1]); for (let k = 1; k <= 60; k++) { const q = u * k / 60, [x, y] = bez(PAD, CP_REAL, LAND, q); c.lineTo(x, y); } c.stroke();
      const [x, y] = bez(PAD, CP_REAL, LAND, u), [x2, y2] = bez(PAD, CP_REAL, LAND, Math.min(1, u + 0.01)); if (t < tSplash) { circ(c, x, y, 26, "rgba(255,200,61,.25)"); capsuleIcon(c, x, y, 2.2, Math.atan2(y2 - y, x2 - x) + Math.PI / 2); } }
    // splash and the 130-mile miss
    const sp = t - tSplash; if (sp > 0) { for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (hash(i) - 0.5) * 2.2, d = (30 + hash(i + 1) * 120) * E.out(clamp(sp / 0.6)); circ(c, LAND[0] + Math.cos(a) * d, SEA - 10 + Math.sin(a) * d + 160 * sp * sp, 5 + hash(i + 2) * 9, `rgba(235,245,255,${0.85 * (1 - clamp(sp / 1.1))})`); }
      capsuleIcon(c, LAND[0], SEA - 6 + Math.sin(t * 4) * 3, 2.2, 0.15 * Math.sin(t * 2)); }
    const br = E.out(inv(tHundred - 0.1, tTarget, t)); if (br > 0) { const y = SEA + 80, x1 = lerp(TGT[0], LAND[0], br); c.strokeStyle = "#ffc83d"; c.lineWidth = 5; seg(c, TGT[0], y, x1, y); seg(c, TGT[0], y - 16, TGT[0], y + 16); if (br > 0.98) seg(c, LAND[0], y - 16, LAND[0], y + 16);
      if (br > 0.5) { c.save(); c.globalAlpha = inv(0.5, 0.8, br); rr(c, 600, y + 24, 400, 58, 10); c.fillStyle = "rgba(6,10,14,.85)"; c.fill(); txt(c, "130 MILES OFF TARGET", 800, y + 54, `800 34px ${K.DISP}`, "#ffc83d"); c.restore(); } }
  }
  // ---------- the capsule in the sea, x-ray: seawater coming in ----------
  function capsulePath(c) { c.beginPath(); c.moveTo(-150, 150); c.lineTo(150, 150); c.lineTo(62, -150); c.lineTo(46, -270); c.lineTo(-46, -270); c.lineTo(-62, -150); c.closePath(); }
  function sinking(c, vp, t) {
    const u = inv(tFill, tOpened, t), lvl = lerp(0.06, 0.55, E.io(u)), bob = Math.sin(t * 2.4) * 10, rot = 0.1 * Math.sin(t * 1.7);
    const g = c.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, "#5b8fc4"); g.addColorStop(0.5, "#9fc3e0"); g.addColorStop(0.5, "#1d5a8f"); g.addColorStop(1, "#061a30"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    c.save(); c.translate(540, 560 + bob); c.rotate(rot); c.scale(1.45, 1.45);
    capsulePath(c); c.fillStyle = "#3c434b"; c.fill(); c.strokeStyle = "#9aa3ad"; c.lineWidth = 3; c.stroke();
    c.save(); capsulePath(c); c.clip(); c.fillStyle = "rgba(10,20,30,.55)"; c.fillRect(-160, -280, 320, 440); // x-ray: see inside
    c.strokeStyle = "rgba(120,200,255,.2)"; c.lineWidth = 1; for (let k = -6; k <= 6; k++) { seg(c, k * 26, -280, k * 26, 160); seg(c, -160, k * 26, 160, k * 26); }
    rr(c, -70, -110, 140, 210, 40); c.fillStyle = "#6b5a48"; c.fill(); circ(c, 0, -60, 30, "#2a201a"); rr(c, -34, -30, 68, 96, 20); c.fillStyle = "#2a201a"; c.fill(); circ(c, -10, -64, 4, "#e9d9b0"); circ(c, 10, -64, 4, "#e9d9b0"); // Ham in his couch
    const wy = lerp(150, -270, lvl) + Math.sin(t * 5) * 3; c.fillStyle = "rgba(40,120,200,.72)"; c.beginPath(); c.moveTo(-170, 170); for (let x = -170; x <= 170; x += 20) c.lineTo(x, wy + Math.sin(x * 0.05 + t * 6) * 4); c.lineTo(170, 170); c.closePath(); c.fill();
    for (let i = 0; i < 14; i++) { const k = ((t * 0.9 + hash(i)) % 1), bx = -110 + hash(i + 3) * 220, by = lerp(150, wy, k); if (by > wy) circ(c, bx + Math.sin(t * 4 + i) * 6, by, 3 + hash(i + 5) * 5, "rgba(220,240,255,.7)"); }
    c.restore();
    // the two holes in the bulkhead: jets of seawater
    [-60, 50].forEach((hx, i) => { c.strokeStyle = "rgba(180,220,255,.85)"; c.lineWidth = 4; const j = 30 + 10 * Math.sin(t * 9 + i); c.beginPath(); c.moveTo(hx, 148); c.quadraticCurveTo(hx + 8, 148 - j, hx + 2, 148 - j * 1.6); c.stroke(); circ(c, hx, 150, 6, "#0b1a2a"); });
    c.restore();
    // sea surface in front of the capsule
    c.save(); c.fillStyle = "rgba(29,90,143,.55)"; c.beginPath(); c.moveTo(0, vp.y + vp.h); for (let x = 0; x <= 1080; x += 30) c.lineTo(x, 640 + Math.sin(x * 0.02 + t * 2.4) * 10); c.lineTo(1080, vp.y + vp.h); c.closePath(); c.fill(); c.restore();
  }
  function scene(c, t, vp) {
    if (t < tNasa) { photoOpen(c, imgHam, vp, t / tNasa, 0.5, 0.4, 0.5, 0.33, 1.0, 1.2); return; }
    if (t < tHigher) { photoOpen(c, imgLaunch, vp, (t - tNasa) / (tHigher - tNasa), 0.5, 0.62, 0.5, 0.42, 1.25, 1.45); return; }
    if (t < tFill) { diagram(c, vp, t); return; }
    if (t < tOpened) { sinking(c, vp, t); return; }
    photoOpen(c, imgAfter, vp, (t - tOpened) / (T - tOpened), 0.5, 0.36, 0.5, 0.3, 1.0, 1.15);
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 44px ${K.DISP}`; const tw = c.measureText(text).width + 36, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 28); c.scale(sc, sc); rr(c, -tw / 2, -28, tw, 56, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 44px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  // one data card: the height the capsule reached vs the plan, while it climbs
  function bandHud(c, t, vp) {
    const xr = vp.x + vp.w - 28, y = vp.y + 28;
    if (t > tHigher + 0.2 && t < tSplash) { const u = flightU(t), [, cy] = bez(PAD, CP_REAL, LAND, Math.min(u, 0.5)), mi = Math.min(157, Math.max(0, Math.round((SEA - cy) / 3.8))); tag(c, xr, y, "PEAK " + mi + " MI · PLANNED 115", inv(tHigher + 0.2, tHigher + 0.4, t) * (1 - inv(tSplash - 0.25, tSplash, t)), mi > 115 ? "#ffc83d" : "#ffffff", "right"); }
  }
  const lines = K.autoLines(Wd, T, [["a hundred and thirty", "130"]], [/^space$/, [/^Ham$/, 0]]);
  const S = K.Snd, foley = [[tNasa, x => { S.boom(x, 60, 30, 1.2, 0.5); S.nz(x, 1.0, "lowpass", 700, 200, 0.7, 0.35); }], [tSplash, x => { S.nz(x, 0.9, "lowpass", 1800, 300, 0.7, 0.4); S.boom(x, 90, 40, 0.4, 0.3); }],
    [tFill, x => S.nz(x, tOpened - tFill, "bandpass", 500, 900, 2, 0.16)], [tOpened, x => S.thump(x, 1.3)]];
  for (let i = 0; i < 8; i++) foley.push([tFill + 0.2 + i * 0.27, x => S.osc(x, "sine", 500 + hash(i) * 400, 900 + hash(i) * 500, 0.06, 0.03)]);
  const punch = [w(/^before$/), tNasa, w(/^higher$/), w(/^planned/), w(/^splashed$/), w(/^hundred$/), w(/^target/), w(/^filling$/), w(/^seawater/), w(/^opened$/), w(/^fine/)];
  K.mount({ T, mode: "style", ready, punch, foley, credit: t => (t < tNasa ? "NASA photo · 1961 · public domain" : t < tHigher ? "NASA photo · Ham's launch, Jan 31 1961" : t >= tOpened ? "NASA photo · Ham after the flight, Jan 31 1961" : "Curio animation"),
    lines, scene, bandHud, events: [], drone: { freqs: [55, 55.5, 82.4], level: 0.03 }, shake: t => Math.max(K.shakeAt(t, tNasa, 10), K.shakeAt(t, tSplash, 12)),
    flash: t => Math.max(K.flashAt(t, tNasa, 0.08, 0.5), K.flashAt(t, tHigher, 0.08, 0.4), K.flashAt(t, tOpened, 0.09, 0.5)) });
})();
