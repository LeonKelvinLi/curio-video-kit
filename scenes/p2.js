/* P2 v4 · Chilean miners' note · trycurio.app style, Zack voice. Facts: C-MIN-01..08 in ../curio-ab-scripts-2026-10-19/facts-ledger.json */
(function () {
  const { clamp, lerp, inv, E, hash, noise, track, rr, circ, txt, poly, seg } = K;
  const Wd = WORDS, T = window.T, w = (re, n) => Wd[K.ix(Wd, re, n)].s;
  // beats keyed to the spoken words (tight timeline)
  const tLamps = w(/^miners$/), t688 = w(/^nearly$/), tDown = w(/^underground/), tFood = w(/^food$/), tUp = w(/^Drills$/), tDrills = w(/^punching$/), tDay = w(/^day$/), t17 = w(/^seventeen/),
    tHole8 = w(/^seventeen/) + 0.1, tThrough = w(/^through/), tDrill = w(/^When$/) - 0.05, tNote = w(/^drill$/), tWe = w(/^note$/), tThe33 = w(/^All$/), tQ = T;
  const flags = new Image(); flags.src = ASSETS.flags; const ready = flags.decode(), tPhoto = t688 - 0.05; // real opener: the 33 flags hillside
  // real opener: cover-fit photo with a fast push-in (frame 0 is already moving)
  function photoOpen(c, img, vp, t, t1, fx, fy, z0, z1) { const p = E.out(clamp(t / t1)), sc = Math.max(vp.w / img.width, vp.h / img.height) * lerp(z0, z1, p), dw = img.width * sc, dh = img.height * sc;
    c.drawImage(img, vp.x + vp.w / 2 - dw * fx, vp.y + vp.h / 2 - dh * fy, dw, dh); }
  const SH = 6880; // shelter depth in world px (10 px per metre, 688 m)
  const holes = [[-430, 0.86], [380, 0.9], [-260, 0.95], [520, 0.82], [-560, 0.97], [300, 0.99], [-150, 1.02]]; // x offset at depth, fraction of depth
  const holeT = i => tDrills + 0.05 + i * ((t17 - 0.1 - tDrills) / 7);

  const CAM = [
    [0, [0, SH, 1.5]], [t688 - 0.05, [0, SH, 1.45], "out"], [tDown + 0.05, [0, 320, 1.15], "io"], [tDown + 0.6, [0, 3500, 0.115], "io"],
    [tFood + 0.25, [150, SH + 10, 1.8], "io"], [tUp - 0.05, [150, SH + 10, 1.85], "lin"], [tUp + 0.4, [0, 3500, 0.115], "io"],
    [tHole8, [0, 3700, 0.12], "lin"], [tThrough - 0.05, [0, 6200, 0.32], "in"], [tThrough + 0.35, [0, SH - 40, 1.35], "out"],
    [tNote + 0.4, [0, SH - 60, 1.7], "io"], [tDrill + 0.15, [0, SH - 60, 1.7], "lin"], [tWe - 0.02, [0, 200, 1.25], "in"], [T, [0, 200, 1.25], "lin"],
  ];
  const strata = []; for (let i = 0; i < 26; i++) strata.push({ y: i * 290 - 40, c: K.mix([92, 64, 44], [150, 108, 70], hash(i * 3)) });

  function scene(c, t, vp) {
    const cam = track(CAM, t), z = cam[2], cx = vp.x + vp.w / 2, cy = vp.y + vp.h * 0.5;
    const S = (x, y) => [cx + (x - cam[0]) * z, cy + (y - cam[1]) * z];
    const xr = clamp(inv(tDown - 0.3, tDown + 0.3, t) - inv(tFood, tFood + 0.25, t) + inv(tUp, tUp + 0.3, t) - inv(tThrough, tThrough + 0.3, t)); // x-ray amount
    // sky + surface
    const [, sY] = S(0, 0);
    const sky = c.createLinearGradient(0, vp.y, 0, Math.max(vp.y + 1, sY)); sky.addColorStop(0, "#8fb8d8"); sky.addColorStop(1, "#e7d3b0"); c.fillStyle = sky; c.fillRect(vp.x, vp.y, vp.w, Math.max(0, sY - vp.y));
    // rock strata
    strata.forEach((s, i) => { const [, y0] = S(0, s.y), [, y1] = S(0, s.y + 300); if (y1 < vp.y || y0 > vp.y + vp.h) return; c.fillStyle = K.rgb(s.c, 1 - 0.55 * xr); c.fillRect(vp.x, y0, vp.w, y1 - y0 + 1); c.fillStyle = `rgba(0,0,0,${0.12 + 0.1 * hash(i)})`; for (let k = 0; k < 14; k++) { const [px, py] = S(-2600 + k * 400 + hash(i * 7 + k) * 200, s.y + hash(i + k) * 280); circ(c, px, py, (14 + hash(k + i) * 30) * z, c.fillStyle); } });
    const rise = inv(t688, t688 + 0.15, t) * (1 - inv(tDown - 0.1, tDown + 0.05, t)) + inv(tDrill + 0.1, tDrill + 0.25, t) * (1 - inv(tWe - 0.1, tWe, t));
    if (rise > 0) { c.save(); c.globalAlpha = rise; for (let k = 0; k < 26; k++) { const x = vp.x + hash(k + 70) * vp.w, len = 120 + hash(k + 71) * 260, y = vp.y + ((hash(k + 72) * vp.h + t * 2600) % (vp.h + len)) - len; const g = c.createLinearGradient(0, y, 0, y + len); g.addColorStop(0, "rgba(255,230,190,0)"); g.addColorStop(1, "rgba(255,230,190,.35)"); c.fillStyle = g; c.fillRect(x, y, 3 + hash(k + 73) * 4, len); } c.restore(); }
    if (xr > 0) { c.save(); c.globalAlpha = xr; c.strokeStyle = "rgba(160,220,255,.35)"; c.lineWidth = 1.5; for (let gy = 0; gy <= 7200; gy += 400) { const [, y] = S(0, gy); if (y > vp.y && y < vp.y + vp.h) seg(c, vp.x, y, vp.x + vp.w, y); } c.fillStyle = "rgba(20,40,60,.35)"; c.fillRect(vp.x, Math.max(vp.y, sY), vp.w, vp.h); c.restore(); }
    // surface line + rig
    if (sY > vp.y - 400 && sY < vp.y + vp.h + 10) { c.strokeStyle = "#5b4630"; c.lineWidth = Math.max(2, 6 * z); seg(c, vp.x, sY, vp.x + vp.w, sY); }
    const rigOn = t > tUp;
    if (rigOn) { const [rx, ry] = S(0, 0), h = Math.max(30, 380 * z), wdt = Math.max(14, 120 * z); c.strokeStyle = "#d9d2bf"; c.lineWidth = Math.max(1.5, 5 * z); seg(c, rx - wdt / 2, ry, rx, ry - h); seg(c, rx + wdt / 2, ry, rx, ry - h); for (let k = 1; k < 5; k++) { const yy = ry - h * k / 5, ww = wdt / 2 * (1 - k / 5); seg(c, rx - ww, yy, rx + ww, yy); } }
    // boreholes
    holes.forEach((hl, i) => { const ht = holeT(i), p = E.out(inv(ht, ht + 0.42, t)); if (p <= 0) return; const endY = SH * hl[1] * p, endX = hl[0] * p, [x0, y0] = S(0, 0), [x1, y1] = S(endX, endY);
      c.strokeStyle = t < tThrough ? "rgba(255,214,120,.85)" : "rgba(255,214,120,.35)"; c.lineWidth = Math.max(2, 10 * z); c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(lerp(x0, x1, 0.5) - hl[0] * 0.1 * z, lerp(y0, y1, 0.5), x1, y1); c.stroke();
      if (p >= 1) { const mk = inv(ht + 0.42, ht + 0.6, t) * (1 - inv(ht + 1.1, ht + 1.6, t)); if (mk > 0) { c.strokeStyle = `rgba(255,107,91,${mk})`; c.lineWidth = 4; const r = 26; seg(c, x1 - r, y1 - r, x1 + r, y1 + r); seg(c, x1 + r, y1 - r, x1 - r, y1 + r); } } });
    // hole 8: straight down, breaks through
    const p8 = E.in(inv(tHole8 + 0.1, tThrough, t)); if (p8 > 0) { const [x0, y0] = S(0, 0), [, y1] = S(0, (SH - 150) * p8); c.strokeStyle = "#ffe08a"; c.lineWidth = Math.max(3, 12 * z); seg(c, x0, y0, x0, y1); if (t < tThrough + 0.1) { circ(c, x0, y1, Math.max(5, 22 * z), "#fff4cf"); } }
    // shelter chamber
    const [shx, shy] = S(0, SH), cw = 640 * z, ch = 280 * z;
    const glow = c.createRadialGradient(shx, shy, 10, shx, shy, Math.max(cw, 60)); glow.addColorStop(0, `rgba(255,190,90,${0.35 + 0.25 * (t > tLamps - 0.6 ? 1 : 0)})`); glow.addColorStop(1, "rgba(255,190,90,0)"); c.fillStyle = glow; c.fillRect(shx - cw * 1.5, shy - ch * 2, cw * 3, ch * 4);
    rr(c, shx - cw / 2, shy - ch / 2, cw, ch, 40 * z); c.fillStyle = "#1a120c"; c.fill(); c.strokeStyle = "rgba(255,200,120,.55)"; c.lineWidth = Math.max(2, 4 * z); c.stroke();
    // 33 helmet lamps in a ring
    const lit = n => (t < 0.02 ? 3 : Math.min(33, 3 + Math.floor(30 * E.out(inv(0, tLamps + 0.45, t)))));
    const nLit = t > tWe ? 33 : lit();
    for (let i = 0; i < 33; i++) { const a = i / 33 * 6.283, lx = shx + Math.cos(a) * cw * 0.36, ly = shy + 18 * z + Math.sin(a) * ch * 0.26, on = i < nLit, swing = t > tThrough && t < tWe ? Math.atan2(-ch * 0.6, -Math.cos(a) * cw * 0.36) : -Math.PI / 2;
      circ(c, lx, ly + 12 * z, 9 * z, "#2b2f36"); circ(c, lx, ly, 8 * z, on ? "#fff3c4" : "#3a3a3a");
      if (on) { c.save(); c.globalCompositeOperation = "lighter"; const L = 70 * z, g = c.createRadialGradient(lx, ly, 0, lx, ly, L); g.addColorStop(0, "rgba(255,240,190,.55)"); g.addColorStop(1, "rgba(255,240,190,0)"); c.fillStyle = g; c.beginPath(); c.moveTo(lx, ly); c.arc(lx, ly, L, swing - 0.35, swing + 0.35); c.closePath(); c.fill(); c.restore(); } }
    // supply shelf
    if (z > 1.2) { const [bx, by] = S(255, SH + 95); c.fillStyle = "#4a3a2a"; c.fillRect(bx - 90 * z, by, 180 * z, 10 * z); for (let k = 0; k < 4; k++) { rr(c, bx - 70 * z + k * 40 * z, by - 36 * z, 26 * z, 36 * z, 4 * z); c.fillStyle = k % 2 ? "#b8bec4" : "#c9a34e"; c.fill(); } }
    // dust burst on breakthrough
    const du = t - tThrough; if (du > 0 && du < 1.6) for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + (hash(i) - 0.5) * 2.6, d = (40 + hash(i + 1) * 260) * E.out(clamp(du / 1.2)), [px, py] = S(Math.cos(a) * d, SH - 140 + Math.sin(a) * d * -0.6 + 60 * du * du); circ(c, px, py, (10 + hash(i + 2) * 22) * z, `rgba(200,170,130,${0.4 * (1 - du / 1.6)})`); }
    // drill bit with note
    if (t > tThrough - 0.05 && t < tWe) { const ride = E.in(inv(tDrill + 0.1, tWe, t)), by = lerp(SH - 160, 0, ride), [bx, byy] = S(0, by); c.fillStyle = "#c9ced3"; poly(c, [[bx - 16 * z, byy - 60 * z], [bx + 16 * z, byy - 60 * z], [bx + 10 * z, byy], [bx, byy + 18 * z], [bx - 10 * z, byy]], "#c9ced3");
      if (t > tNote - 0.1) { const np = E.back(inv(tNote - 0.1, tNote + 0.25, t)); c.save(); c.translate(bx + 22 * z, byy - 30 * z); c.scale(np, np); c.rotate(0.15); rr(c, 0, -22 * z, 46 * z, 44 * z, 3 * z); c.fillStyle = "#f6f1e3"; c.fill(); c.strokeStyle = "rgba(0,0,0,.3)"; c.lineWidth = 1; c.stroke(); c.restore(); }
      if (ride > 0) { c.save(); c.globalCompositeOperation = "lighter"; for (let k = 0; k < 8; k++) { const yy = vp.y + ((k * 137 + t * 2400) % vp.h); c.fillStyle = "rgba(255,230,190,.08)"; c.fillRect(vp.x, yy, vp.w, 6); } c.restore(); } }
    // the note, full strip
    if (t >= tWe - 0.02) noteView(c, t, vp);
    if (t < tPhoto) photoOpen(c, flags, vp, t, tPhoto, 0.36, 0.55, 1.0, 1.16);
  }
  function noteView(c, t, vp) {
    const u = t - tWe, open = E.out(clamp(u / 0.45)), push = 1 + 0.18 * E.sine(inv(tThe33, T, t));
    const dark = 0;
    c.save(); const g = c.createLinearGradient(0, vp.y, 0, vp.y + vp.h); g.addColorStop(0, "#fdf6e3"); g.addColorStop(1, "#e9d9b0"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    c.translate(vp.x + vp.w / 2, vp.y + vp.h / 2); c.scale(push, push); c.rotate(-0.03);
    const pw = lerp(120, 900, open), ph = lerp(120, 560, open); c.shadowColor = "rgba(0,0,0,.25)"; c.shadowBlur = 40; rr(c, -pw / 2, -ph / 2, pw, ph, 8); c.fillStyle = "#fbf8ef"; c.fill(); c.shadowBlur = 0;
    c.strokeStyle = "rgba(0,0,0,.07)"; c.lineWidth = 2; for (let k = 1; k < 3; k++) seg(c, -pw / 2, -ph / 2 + ph * k / 3, pw / 2, -ph / 2 + ph * k / 3);
    const ink = clamp((u - 0.25) / 0.5); c.save(); c.beginPath(); c.rect(-pw / 2, -ph / 2, pw * ink, ph); c.clip();
    txt(c, "Estamos bien en el", 0, -120, `700 92px ${K.HAND}`, "#b3261e"); txt(c, "refugio los 33", 0, 10, `700 104px ${K.HAND}`, "#b3261e"); c.restore();
    const sub = clamp((u - 0.8) / 0.3); c.globalAlpha = sub; txt(c, "We are well in the shelter, the 33", 0, 150, `600 40px ${K.DISP}`, "#3a2a20"); txt(c, "Day 17 · Aug 22, 2010", 0, 205, `500 30px ${K.MONO}`, "#6a5a48");
    c.restore(); if (dark > 0) { c.fillStyle = `rgba(0,0,0,${dark})`; c.fillRect(vp.x, vp.y, vp.w, vp.h); }
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.78)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function bandHud(c, t, vp) {
    const x = vp.x + 28, y = vp.y + 24, xr = vp.x + vp.w - 28;
    if (t > tUp && t < tDrill) { const day = t < t17 ? Math.max(1, Math.round(16 * E.io(inv(tUp, t17, t)))) : 17; tag(c, xr, y, "DAY " + day, inv(tUp, tUp + 0.2, t) * (1 - inv(tDrill - 0.25, tDrill, t)), day === 17 ? "#ffc83d" : "#ffffff", "right"); }
  }
  const lines = K.autoLines(Wd, T, [["thirty-three", "33"], ["two or three", "2–3"], ["seventeen", "17"]], [/^miners$/, /^trapped$/, /^mile$/]);
  const ev = [[0.0, w0 => { K.Snd.nz(w0, 0.5, "lowpass", 900, 200, 0.7, 0.4); K.Snd.boom(w0, 60, 30, 0.9, 0.4); }]];
  for (let i = 0; i < 11; i++) ev.push([0.05 + i * (tLamps + 0.4) / 11, x => K.Snd.tick(x, 1500 + i * 40, 0.035)]);
  ev.push([t688, x => K.Snd.whoosh(x, tDown - t688, true, 0.28)]); for (let i = 1; i <= 6; i++) ev.push([t688 + (tDown - t688) * i / 6.9, x => K.Snd.tick(x, 1900 + i * 80, 0.04)]);
  ev.push([tDown + 0.05, x => { K.Snd.boom(x, 70, 30, 0.6, 0.5); K.Snd.chime(x, [880, 1320], 0.05); }], [tFood + 0.3, x => K.Snd.tone(x, 2600, 0.12, 0.05, "triangle")], [tFood + 0.45, x => K.Snd.nz(x, 0.15, "highpass", 3000, 3000, 0.7, 0.15)]);
  ev.push([tTop = tUp + 0.1, x => K.Snd.nz(x, t17 - tUp, "bandpass", 700, 900, 4, 0.12)]);
  holes.forEach((_, i) => ev.push([holeT(i) + 0.42, x => K.Snd.tone(x, 2200 + i * 60, 0.18, 0.07, "triangle")]));
  for (let d = 1; d < 17; d += 2) ev.push([tDrills + (tDay - tDrills) * d / 17, x => K.Snd.tick(x, 1200, 0.03)]);
  ev.push([t17, x => { K.Snd.boom(x, 75, 35, 0.4, 0.6); K.Snd.nz(x, 0.12, "lowpass", 600, 300, 0.7, 0.3); }], [tHole8 + 0.1, x => K.Snd.nz(x, tThrough - tHole8, "bandpass", 300, 1200, 3, 0.2)], [tThrough, x => K.Snd.hit(x)]);
  ev.push([tNote - 0.05, x => K.Snd.nz(x, 0.25, "highpass", 2500, 4000, 0.8, 0.18)], [tDrill + 0.1, x => K.Snd.whoosh(x, tWe - tDrill, true, 0.35)], [tWe, x => { K.Snd.hit(x); K.Snd.chime(x + 0.05, [523.25, 659.25, 783.99, 1046.5], 0.07); K.Snd.nz(x, 0.2, "highpass", 3000, 3000, 0.7, 0.2); }]);
  ev.push([tQ, x => K.Snd.nz(x, 1.6, "lowpass", 300, 120, 0.7, 0.25)], [T - 0.05, x => K.Snd.nz(x, 0.3, "lowpass", 900, 200, 0.7, 0.3)]);
  var tTop;
  const foley = [[0, x => K.Snd.nz(x, 1.2, "lowpass", 300, 160, 0.7, 0.25)], [tUp + 0.1, x => K.Snd.nz(x, t17 - tUp, "bandpass", 700, 900, 4, 0.1)], [tHole8 + 0.1, x => K.Snd.nz(x, tThrough - tHole8, "bandpass", 300, 1200, 3, 0.14)], [tThrough, x => K.Snd.hit(x)], [tWe, x => K.Snd.nz(x, 0.2, "highpass", 3000, 3000, 0.7, 0.15)]];
  const punch = [/^nearly$/, /^underground/, /^food$/, /^Drills$/, /^day$/, /^seventeen/, /^through/, /^When$/, /^note$/, /^taped$/, /^All$/].map(re => w(re));
  K.mount({ T, mode: "style", ready, punch, foley, credit: t => (t < tPhoto ? "Gobierno de Chile · 2010 · CC BY 2.0" : "Curio animation"), lines, scene, bandHud, events: ev, drone: { freqs: [41.2, 41.6, 61.7], level: 0.04 },
    shake: t => Math.max(K.shakeAt(t, tThrough, 16), K.shakeAt(t, tWe, 14), K.shakeAt(t, tDown + 0.05, 6)),
    flash: t => Math.max(K.flashAt(t, tThrough, 0.08), K.flashAt(t, tWe, 0.1, 0.7)), footnote: "" });
})();
