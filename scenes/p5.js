/* P5 v4 · Seconds of useful consciousness · trycurio.app style, Zack voice. Facts: C-TUC-01..07 (FAA averages, no supplemental oxygen; via AOPA/FAA PHAK and Wikipedia/AC 61-107A). */
(function () {
  const { clamp, lerp, inv, E, hash, noise, track, rr, circ, txt, seg, poly } = K;
  const Wd = WORDS, T = window.T, w = (re, n) => Wd[K.ix(Wd, re, n)].s;
  // story: up here (climb) -> no extra oxygen (into the cabin) -> under a minute (bar) -> thin air (lungs) -> 30-60 s -> can't think straight (brain)
  //        -> at 40,000 (red, bar snaps to 15-20 s) -> about as long as this video (video-time marker) -> your mask goes on first (mask drops)
  const tFeet = w(/^with$/), tNo = w(/^no$/), tLess = w(/^you'd$/), tFAA = w(/^thin$/) - 0.1, t3060 = w(/^thirty$/), tThats = w(/^before$/), tFunc = w(/^straight/),
    t40 = w(/^forty$/), t25 = t40, t35 = t40, t1520 = w(/^thousand\?/), tAbout = w(/^About$/), tVideo = w(/^video/), tMaskLine = w(/^That's$/), tYou = w(/^your$/), tOr = T + 5, tQ = T + 5;
  // TUC windows in seconds
  const masks = new Image(); masks.src = ASSETS.masks; const ready = masks.decode(), tPhoto = tLess - 0.05; // real opener: deployed masks in a 737 cabin
  // real opener: cover-fit photo with a fast push-in (frame 0 is already moving)
  function photoOpen(c, img, vp, t, t1, fx, fy, z0, z1) { const p = E.out(clamp(t / t1)), sc = Math.max(vp.w / img.width, vp.h / img.height) * lerp(z0, z1, p), dw = img.width * sc, dh = img.height * sc;
    c.drawImage(img, vp.x + vp.w / 2 - dw * fx, vp.y + vp.h / 2 - dh * fy, dw, dh); }
  const WIN = t => (t < t3060 ? [0, 60] : t < t1520 ? [30, 60] : [15, 20]);
  const ALT = t => { if (t < 0) return 0; if (t < t40) return 35000; return lerp(35000, 40000, E.io(inv(t40, t1520, t))); };
  const IN = t => 1; // v4: the real-photo opener replaces the exterior shot
  function sky(c, t, vp, alt) {
    const g = c.createLinearGradient(0, vp.y, 0, vp.y + vp.h); g.addColorStop(0, "#0b1430"); g.addColorStop(0.45, "#3a3f78"); g.addColorStop(0.75, "#d9776b"); g.addColorStop(1, "#f2b56b"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    for (let i = 0; i < 60; i++) { const x = hash(i) * 1080, y = hash(i + 7) * 700; c.fillStyle = `rgba(255,255,255,${0.15 + 0.5 * hash(i + 3)})`; c.fillRect(x, y, 2.5, 2.5); }
    const climb = alt / 35000; for (let L = 0; L < 3; L++) { const base = 1350 + L * 160 + (1 - climb) * -700 + (alt > 35000 ? (alt - 35000) / 5000 * 140 : 0), sp = 30 + L * 26;
      for (let i = 0; i < 9; i++) { const x = ((i * 190 + hash(L * 9 + i) * 120 - t * sp) % 1500 + 1500) % 1500 - 210, r = 110 + hash(L * 9 + i + 3) * 90; const cg = c.createRadialGradient(x, base, 10, x, base, r); cg.addColorStop(0, L === 2 ? "rgba(255,226,200,.95)" : "rgba(250,205,180,.85)"); cg.addColorStop(1, "rgba(250,205,180,0)"); c.fillStyle = cg; c.beginPath(); c.arc(x, base, r, 0, 6.2832); c.fill(); } }
  }
  function jet(c, t, x, y, s) {
    c.save(); c.translate(x, y); c.rotate(-0.1 + 0.02 * Math.sin(t * 1.3)); c.scale(s, s);
    poly(c, [[-160, 10], [60, 10], [150, 110], [100, 110]], "#b9c2cc"); // wing
    rr(c, -380, -58, 760, 116, 58); c.fillStyle = "#eef1f4"; c.fill(); poly(c, [[-370, -40], [-430, -170], [-360, -170], [-300, -50]], "#d7dde3"); // fin
    c.fillStyle = "#8b6cff"; c.fillRect(-380, 18, 760, 12); poly(c, [[300, -40], [400, -10], [380, 40], [300, 50]], "#eef1f4");
    for (let i = 0; i < 14; i++) { rr(c, -260 + i * 36, -22, 18, 24, 7); c.fillStyle = "#1f2b3a"; c.fill(); }
    rr(c, -120, 50, 120, 46, 23); c.fillStyle = "#c3cad2"; c.fill(); c.restore();
  }
  function cabin(c, t, vp, alt) {
    const flick = t > t40 && t < t1520 + 0.2 ? (Math.sin(t * 40) > 0.3 ? 1 : 0.55) : 1, red = t > t40 && t < t1520 + 0.6 ? 0.35 : 0;
    const g = c.createLinearGradient(0, vp.y, 0, vp.y + vp.h); g.addColorStop(0, K.rgb(K.mix([40, 46, 60], [90, 20, 24], red), 1)); g.addColorStop(1, K.rgb(K.mix([18, 22, 30], [40, 8, 10], red), 1)); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    c.save(); c.globalAlpha = flick;
    // window with sky beyond
    c.save(); rr(c, 640, 640, 300, 380, 140); c.clip(); sky(c, t, { x: 640, y: 640, w: 300, h: 380 }, alt); c.restore(); rr(c, 640, 640, 300, 380, 140); c.strokeStyle = "#c9ced3"; c.lineWidth = 18; c.stroke();
    // seat + passenger (side view)
    rr(c, 230, 900, 240, 420, 40); c.fillStyle = "#2c3e57"; c.fill(); rr(c, 280, 1180, 330, 100, 30); c.fillStyle = "#2c3e57"; c.fill();
    circ(c, 470, 860, 70, "#c08f6e"); c.fillStyle = "#3a2a22"; c.beginPath(); c.arc(470, 845, 72, Math.PI * 1.05, Math.PI * 1.95); c.fill();
    c.save(); c.translate(0, Math.sin(t * 2.6) * 4); rr(c, 400, 930, 170, 300, 60); c.fillStyle = "#6c86a3"; c.fill(); c.restore(); c.restore();
  }
  function lens(c, t, kind, a) { // x-ray of chest (lungs + O2) or head (brain)
    if (a <= 0) return; const cx = kind === "lungs" ? 485 : 470, cy = kind === "lungs" ? 1005 : 850, R = (kind === "lungs" ? 212 : 230) * E.back(clamp(a));
    c.save(); c.globalAlpha = clamp(a); c.beginPath(); c.arc(cx, cy, R, 0, 6.2832); c.save(); c.clip(); c.fillStyle = "#081624"; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    c.strokeStyle = "rgba(120,200,255,.18)"; c.lineWidth = 1.5; for (let k = -6; k <= 6; k++) { seg(c, cx + k * 40, cy - R, cx + k * 40, cy + R); seg(c, cx - R, cy + k * 40, cx + R, cy + k * 40); }
    if (kind === "lungs") { [[-1, 0], [1, 0]].forEach(([sd]) => { c.beginPath(); c.ellipse(cx + sd * 80, cy + 10, 70, 140, sd * 0.15, 0, 6.2832); c.fillStyle = "rgba(255,120,140,.28)"; c.fill(); c.strokeStyle = "rgba(255,160,180,.8)"; c.lineWidth = 4; c.stroke(); });
      for (let i = 0; i < 26; i++) { const x = cx + (hash(i) - 0.5) * 300 + noise(t * 2 + i) * 14, y = cy + (hash(i + 5) - 0.5) * 300 + noise(t * 2 + i + 9) * 14; c.beginPath(); c.ellipse(x, y, 13, 9, 0, 0, 6.2832); c.fillStyle = "#c2303c"; c.fill(); if (hash(i + 11) > 0.72) circ(c, x, y, 4.5, "#e8f6ff"); }
      txt(c, "O₂ PER BREATH: LOW", cx, cy - R + 40, `700 28px ${K.DISP}`, "#9fd4ee"); }
    else { c.beginPath(); for (let k = 0; k < 14; k++) { const a1 = k / 14 * 6.283, r1 = 150 + 18 * Math.sin(k * 3); c.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1 * 0.75); } c.closePath(); c.fillStyle = "rgba(255,170,190,.22)"; c.fill(); c.strokeStyle = "rgba(255,190,210,.8)"; c.lineWidth = 4; c.stroke();
      for (let i = 0; i < 22; i++) { const on = Math.sin(t * 11 + i * 2.1) > 0.2 - 0.6 * inv(tThats, tFunc + 0.5, t); if (on) circ(c, cx + (hash(i) - 0.5) * 240, cy + (hash(i + 4) - 0.5) * 170, 7, "rgba(255,240,150,.95)"); } }
    c.restore(); c.strokeStyle = "#9fd4ee"; c.lineWidth = 6; c.stroke(); c.restore();
  }
  function mask(c, t) { const u = t - tYou + 0.05; if (u < 0) return; const tOn = w(/^goes$/), on = E.io(inv(tOn - 0.05, tOn + 0.35, t)), drop = E.out(clamp(u / 0.35)), sw = Math.sin(u * 6) * 0.35 * Math.exp(-u * 1.2) * (1 - on);
    const hx = 560 - Math.sin(sw) * 380 * drop, hy = 560 + Math.cos(sw) * 380 * drop, px = lerp(hx, 530, on), py = lerp(hy, 885, on), rot = lerp(sw, -Math.PI / 2, on);
    c.save(); c.strokeStyle = "#e8e2d0"; c.lineWidth = 4; seg(c, 560, 560, px, py);
    if (on > 0.6) { c.save(); c.globalAlpha *= (on - 0.6) / 0.4; c.strokeStyle = "#d8a935"; c.lineWidth = 5; c.beginPath(); c.ellipse(470, 860, 74, 30, -0.1, Math.PI * 0.9, Math.PI * 2.05); c.stroke(); c.restore(); }
    c.translate(px, py); c.rotate(rot); c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(0, 90, 50, 0); c.closePath(); c.fillStyle = "#f2c14e"; c.fill(); rr(c, -60, -14, 120, 20, 10); c.fillStyle = "#d8a935"; c.fill(); c.restore(); }
  function scene(c, t, vp) {
    const alt = ALT(t), inn = IN(t), sh = 1 + inn * 5;
    if (inn < 1) { c.save(); c.translate(540, 980); c.scale(sh, sh); c.translate(-540, -980); sky(c, t, vp, alt); jet(c, t, 520, 980, 1); c.restore(); }
    if (inn > 0) { c.save(); c.globalAlpha = clamp((inn - 0.35) / 0.4); cabin(c, t, vp, alt); lens(c, t, "lungs", inv(tFAA, tFAA + 0.3, t) * (1 - inv(tThats - 0.25, tThats, t))); lens(c, t, "brain", inv(tThats, tThats + 0.3, t) * (1 - inv(t25 - 0.25, t25, t))); mask(c, t); c.restore(); }
    if (t < tPhoto) photoOpen(c, masks, vp, t, tPhoto, 0.5, 0.5, 1.0, 1.15);
  }
  function hud(c, t, band) {
    const alt = ALT(t), locked = t >= tFeet && t < t25;
    if (!band) K.readout(c, 1032, 300, "ALTITUDE", (Math.round(alt / 100) * 100).toLocaleString("en-US") + " FT", { size: 86, pulse: locked ? 1 - inv(tFeet + 0.3, tFeet + 0.8, t) : 0, color: t > t40 && t < t1520 + 0.5 ? "#ff8a7a" : "#ffffff" });
    if (t > tLess - 0.2) { const a = inv(tLess - 0.2, tLess + 0.1, t), [lo, hi] = WIN(t), x = 90, y = 1290, wd = 900, maxS = t < t40 ? 120 : lerp(120, 60, E.io(inv(t40, t1520, t))), sc = s => x + wd * Math.min(s, maxS) / maxS;
      c.save(); c.globalAlpha = a * (1 - inv(tAbout - 0.25, tAbout - 0.05, t)); c.font = `600 26px ${K.DISP}`; c.textAlign = "left"; c.textBaseline = "alphabetic"; c.fillStyle = "rgba(233,238,243,.82)"; c.fillText("TIME OF USEFUL CONSCIOUSNESS · FAA AVERAGE", x, y - 18); c.globalAlpha = a;
      rr(c, x, y, wd, 30, 15); c.fillStyle = "rgba(6,12,18,.7)"; c.fill(); (maxS > 90 ? [0, 30, 60, 90, 120] : [0, 10, 20, 30, 40, 50, 60]).filter(s => s <= maxS + 0.1).forEach(s => { c.fillStyle = "rgba(233,238,243,.5)"; c.fillRect(sc(s) - 1, y + 34, 2, 10); K.txt(c, s === 0 ? "0" : s % 60 === 0 ? s / 60 + " min" : s + "s", sc(s), y + 60, `500 20px ${K.MONO}`, "rgba(233,238,243,.65)"); });
      const snap = t > t1520 ? E.back(inv(t1520, t1520 + 0.25, t)) : 1; K.rr(c, sc(lo), y - 4, Math.max(14, (sc(hi) - sc(lo)) * snap), 38, 12); c.fillStyle = t > t40 ? "#ff6b5b" : "#ffc83d"; c.fill();
      const lab = lo === 0 ? "UNDER 1 MIN" : hi >= 180 ? lo / 60 + "–" + hi / 60 + " MIN" : hi >= 60 && lo >= 60 ? lo / 60 + "–" + hi / 60 + " MIN" : lo + "–" + hi + " S"; const lx = sc(hi) + 16 + c.measureText(lab).width > 1030 ? sc(hi) : sc(hi) + 16, la = lx === sc(hi) ? "right" : "left"; K.txt(c, lab, lx, la === "right" ? y - 40 : y + 17, `800 40px ${K.DISP}`, t > t40 ? "#ff8a7a" : "#ffc83d", la);
      if (t > t3060 && t < t40) { const sw = Math.min(60, (t - t3060) * 40); circ(c, sc(sw), y + 15, 13, "#ffffff"); }
      if (t > tAbout - 0.1) { const v = Math.min(t, maxS), p = inv(tAbout - 0.1, tAbout + 0.2, t); c.globalAlpha = a * p; K.rr(c, sc(v) - 3, y - 30, 6, 72, 3); c.fillStyle = "#9fd4ee"; c.fill(); K.txt(c, "THIS VIDEO 0:" + String(Math.floor(t)).padStart(2, "0") + " ▼", Math.min(sc(v) + 40, 860), y - 50, `800 36px ${K.DISP}`, "#9fd4ee"); }
      c.restore(); }
    if (t > t1520 - 0.02 && t < tMaskLine - 0.1) K.stamp(c, 540, 760, "40,000 FT · 15–20 S", { p: inv(t1520, t1520 + 0.25, t), size: 70, color: "#ff6b5b" });
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function bandHud(c, t, vp) {
    const x = vp.x + 28, y = vp.y + 24, xr = vp.x + vp.w - 28, alt = ALT(t);
    if (t > tPhoto) tag(c, xr, y, "ALTITUDE " + (Math.round(alt / 100) * 100).toLocaleString("en-US") + " FT", 1, t > t40 && t < t1520 + 0.5 ? "#ff8a7a" : t >= tFeet && t < t25 ? "#ffc83d" : "#ffffff", "right");
  }
  const lines = K.autoLines(Wd, T, [["thirty-five thousand", "35,000"], ["thirty to sixty", "30–60"], ["forty thousand", "40,000"]], [/^have$/, /^air$/, /^about$/, /^seconds$/, [/^you$/, 1]]);
  const S = K.Snd, ev = [[0, x => { S.tone(x, 880, 0.6, 0.06); S.tone(x + 0.22, 698, 0.7, 0.06); S.nz(x, T, "lowpass", 380, 380, 0.7, 0.07); }]];
  for (let i = 1; i <= 7; i++) ev.push([0.05 + (tFeet - 0.05) * i / 7, x => S.tick(x, 1200 + i * 160, 0.04)]);
  ev.push([tFeet, x => S.boom(x, 90, 50, 0.3, 0.5)], [tNo, x => S.nz(x, 0.8, "highpass", 3000, 1500, 0.7, 0.18)]);
  for (let i = 0; i < 4; i++) ev.push([tFAA + 0.1 + i * 0.42, x => { S.boom(x, 62, 40, 0.2, 0.45); S.boom(x + 0.16, 56, 38, 0.2, 0.3); }]);
  ev.push([t3060, x => S.tick(x, 3200, 0.07)]); for (let i = 1; i < 8; i++) ev.push([t3060 + i * 0.16, x => S.tick(x, 1700, 0.03)]);
  ev.push([t25, x => S.whoosh(x, 0.6, false, 0.25)], [t35, x => S.nz(x, 0.4, "bandpass", 600, 1800, 3, 0.15)], [t35 + 0.9, x => S.tick(x, 1500, 0.05)], [t40, x => S.whoosh(x, 1.0, true, 0.3)]);
  for (let i = 0; i < 6; i++) ev.push([t40 + 0.15 + i * 0.18, x => S.osc(x, "square", 1250, 1250, 0.09, 0.05)]);
  ev.push([t1520, x => { S.hit(x); S.chime(x + 0.04, [440, 554, 659], 0.06); }]); for (let s = 14; s <= 15; s++) ev.push([s, x => S.tick(x, 2600, 0.06)]);
  ev.push([tYou, x => { S.tone(x, 340, 0.15, 0.12, "triangle"); S.nz(x, 0.6, "highpass", 2500, 2500, 0.7, 0.15); }], [T - 0.3, x => { S.tone(x, 880, 0.5, 0.05); S.tone(x + 0.2, 698, 0.6, 0.05); }]);
  const foley = [[0, x => { S.tone(x, 880, 0.6, 0.05); S.tone(x + 0.22, 698, 0.7, 0.05); S.nz(x, T, "lowpass", 380, 380, 0.7, 0.07); }], [tNo, x => S.nz(x, 0.8, "highpass", 3000, 1500, 0.7, 0.12)]];
  for (let i = 0; i < 6; i++) foley.push([t40 + 0.15 + i * 0.18, x => S.osc(x, "square", 1250, 1250, 0.09, 0.035)]);
  foley.push([tYou, x => { S.tone(x, 340, 0.15, 0.1, "triangle"); S.nz(x, 0.6, "highpass", 2500, 2500, 0.7, 0.12); }]);
  const punch = [/^you'd$/, /^minute/, /^thirty-five$/, /^thin$/, /^thirty$/, /^before$/, /^forty$/, /^About$/, /^That's$/, /^goes$/].map(re => w(re));
  K.mount({ T, mode: "style", ready, punch, foley, credit: t => (t < tPhoto ? "Real 737 oxygen masks · DemonDays64 · CC BY 4.0" : "Curio animation"), bandMap: () => ({ cx: 540, cy: 1110, s: 1 }), hudInScene: (c, t) => hud(c, t, true), bandHud, lines, scene, hud, events: ev, pill: "FAA AVERAGES · NO SUPPLEMENTAL O₂", footnote: "Illustration · not to scale · time-lapse · FAA averages via AOPA (FAA PHAK) and Wikipedia",
    drone: { freqs: [55, 55.4, 82.4], level: 0.03 }, shake: t => K.shakeAt(t, t1520, 18), flash: t => K.flashAt(t, t1520, 0.1, 0.55), flashColor: "rgba(255,70,60,A)" });
})();
