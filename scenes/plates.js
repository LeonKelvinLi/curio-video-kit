/* Plate story: full-frame illustrated plates cut on spoken words, plus motion events drawn on top (lightning, rain,
   hail, vapour, spin, speed lines), a counter readout and tags. Built for the Sep 12-19 breakout look: one big character,
   bright 3D-style plate, full screen, hook line on. A video supplies window.SPEC (scenes/p8.js etc.) and this file draws it.
   SPEC = { beats:[{img, at, fx, fy, z0, z1, fx1, fy1, spin, wobble, credit}], lightning:[at], rain:[from,to], hail:[from,to],
            vapor:[{at, x, y, dur}], streaks:[from,to], counter:{label, at, to, values, fmt}, tags:[{text, at, to, side}],
            stamps:[{text, at, to, y}], shakes:[[at, amp]], credit, drone, punch:[at] }
   "at" is a word regex, [regex, n] for the nth match, or seconds. */
(function () {
  const { clamp, lerp, inv, E, hash, rr, circ, txt, seg } = K;
  const S = window.SPEC, Wd = WORDS, T = window.T;
  const at = x => (x == null ? null : typeof x === "number" ? x : Array.isArray(x) ? Wd[K.ix(Wd, x[0], x[1])].s : Wd[K.ix(Wd, x)].s);
  const imgs = {}; Object.keys(ASSETS).forEach(k => { const im = new Image(); im.src = ASSETS[k]; imgs[k] = im; });
  const ready = Promise.all(Object.values(imgs).map(im => im.decode()));
  const beats = S.beats.map((b, i) => ({ ...b, t0: i === 0 ? 0 : at(b.at) - 0.04 }));
  beats.forEach((b, i) => { b.t1 = i < beats.length - 1 ? beats[i + 1].t0 : T; });
  const beatAt = t => { let b = beats[0]; beats.forEach(x => { if (t >= x.t0) b = x; }); return b; };
  const bolts = (S.lightning || []).map(at), range = r => (r ? [at(r[0]), at(r[1])] : null);
  const rain = range(S.rain), hail = range(S.hail), streaks = range(S.streaks);
  const vapor = (S.vapor || []).map(v => ({ ...v, t: at(v.at) }));

  function plate(c, img, vp, fx, fy, z, rot) {
    const sc = Math.max(vp.w / img.width, vp.h / img.height) * z, dw = img.width * sc, dh = img.height * sc;
    c.save(); c.translate(vp.x + vp.w / 2, vp.y + vp.h / 2); if (rot) c.rotate(rot); c.drawImage(img, -dw * fx, -dh * fy, dw, dh); c.restore();
  }
  function bolt(c, vp, seed, a) { // jagged branching bolt, glow then core
    const pts = []; let x = vp.x + vp.w * (0.2 + 0.6 * hash(seed)), y = vp.y + 80;
    while (y < vp.y + vp.h * 0.75) { pts.push([x, y]); x += (hash(seed + pts.length) - 0.5) * 140; y += 60 + hash(seed + pts.length + 9) * 90; }
    const path = () => { c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); };
    c.save(); c.globalAlpha = a; c.lineJoin = "round"; c.strokeStyle = "rgba(170,210,255,.55)"; c.lineWidth = 26; path(); c.stroke();
    c.strokeStyle = "#ffffff"; c.lineWidth = 7; path(); c.stroke(); c.restore();
  }
  function scene(c, t, vp) {
    const b = beatAt(t), p = clamp((t - b.t0) / Math.max(0.01, b.t1 - b.t0)), img = imgs[b.img];
    let z = lerp(b.z0 == null ? 1.04 : b.z0, b.z1 == null ? 1.16 : b.z1, E.sine(p)), rot = 0;
    if (b.spin) { rot = (t - b.t0) * b.spin * Math.PI / 180; z = Math.max(z, 2.08); }
    if (b.wobble) rot = Math.sin((t - b.t0) * b.wobble[1]) * b.wobble[0] * Math.PI / 180;
    plate(c, img, vp, lerp(b.fx == null ? 0.5 : b.fx, b.fx1 == null ? (b.fx == null ? 0.5 : b.fx) : b.fx1, E.sine(p)),
      lerp(b.fy == null ? 0.5 : b.fy, b.fy1 == null ? (b.fy == null ? 0.5 : b.fy) : b.fy1, E.sine(p)), z, rot);
    if (rain && t > rain[0] && t < rain[1]) { const a = Math.min(inv(rain[0], rain[0] + 0.2, t), 1 - inv(rain[1] - 0.2, rain[1], t)); c.save(); c.globalAlpha = 0.55 * a; c.strokeStyle = "#dbe8ff"; c.lineWidth = 3;
      for (let i = 0; i < 90; i++) { const x = vp.x + hash(i) * vp.w, y = vp.y + ((hash(i + 3) * vp.h + t * 2600) % vp.h); seg(c, x, y, x - 22, y + 70); } c.restore(); }
    if (hail && t > hail[0] && t < hail[1]) { const a = Math.min(inv(hail[0], hail[0] + 0.2, t), 1 - inv(hail[1] - 0.2, hail[1], t));
      for (let i = 0; i < 46; i++) { const x = vp.x + hash(i + 50) * vp.w, y = vp.y + vp.h - ((hash(i + 51) * vp.h + t * (900 + 700 * hash(i + 52))) % vp.h); circ(c, x, y, 8 + 14 * hash(i + 53), `rgba(240,248,255,${0.85 * a})`); } }
    if (streaks && t > streaks[0] && t < streaks[1]) { c.save(); c.globalAlpha = 0.45; c.strokeStyle = "#ffffff"; c.lineWidth = 4; const cx = vp.x + vp.w / 2, cy = vp.y + vp.h / 2;
      for (let i = 0; i < 26; i++) { const a0 = hash(i + 70) * 6.283 + t * 9, r = 300 + hash(i + 71) * 700; c.beginPath(); c.arc(cx, cy, r, a0, a0 + 0.5); c.stroke(); } c.restore(); }
    vapor.forEach(v => { const u = t - v.t; if (u < 0 || u > (v.dur || 1.6)) return; for (let i = 0; i < 28; i++) { const a = (hash(i + 90) - 0.5) * 1.4 + (v.dir || 0), d = (40 + hash(i + 91) * 360) * E.out(clamp(u / (v.dur || 1.6)));
      circ(c, v.x + Math.cos(a) * d, v.y + Math.sin(a) * d, (18 + 40 * hash(i + 92)) * (0.6 + u), `rgba(245,250,255,${0.5 * (1 - u / (v.dur || 1.6))})`); } });
    bolts.forEach((tb, i) => { const u = t - tb; if (u >= 0 && u < 0.3) bolt(c, vp, i * 17 + 3, 1 - u / 0.3); });
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function panel(c, x, y, w, h, a) { c.save(); c.globalAlpha = a; rr(c, x, y, w, h, 16); c.fillStyle = "rgba(6,10,14,.78)"; c.fill(); c.restore(); }
  function bandHud(c, t, vp) {
    const x = vp.x + 70, xr = vp.x + vp.w - 70, y = vp.y + 24;
    (S.tags || []).forEach(g => { const a0 = at(g.at) || 0, a1 = g.to == null ? T : at(g.to); if (t >= a0 && t < a1) tag(c, g.side === "right" ? xr : x, y + (g.dy || 0), g.text, inv(a0, a0 + 0.25, t), g.color, g.side === "right" ? "right" : "left"); });
    const C = S.counter; if (C) { const a0 = at(C.at), a1 = C.to == null ? T : at(C.to); if (t >= a0 && t < a1) {
      let v = C.values[0][1]; C.values.forEach(([w, val]) => { if (t >= at(w)) v = val; }); const done = v === C.values[C.values.length - 1][1];
      panel(c, xr - 420, y + 84, 444, 150, inv(a0, a0 + 0.15, t)); K.readout(c, xr, y + 120, C.label, C.fmt ? C.fmt(v, t) : String(v), { size: 92, color: done ? "#ffc83d" : "#ffffff" }); } }
    (S.stamps || []).forEach(s => { const a0 = at(s.at), a1 = s.to == null ? T : at(s.to); if (t >= a0 && t < a1) K.stamp(c, 540, s.y == null ? 790 : s.y, s.text, { p: inv(a0, a0 + 0.3, t), size: s.size || 64 }); });
  }
  const lines = K.autoLines(Wd, T, S.nums || [], S.breaks || []);
  const Sn = K.Snd, foley = [[0, x => Sn.nz(x, Math.min(T, 3), "lowpass", 600, 300, 0.7, 0.18)]];
  beats.slice(1).forEach(b => foley.push([b.t0, x => Sn.whoosh(x, 0.35, true, 0.22)]));
  bolts.forEach(tb => foley.push([tb, x => { Sn.hit(x); Sn.nz(x, 0.4, "highpass", 3000, 1500, 0.7, 0.25); }]));
  if (rain) foley.push([rain[0], x => Sn.nz(x, rain[1] - rain[0], "bandpass", 2500, 2000, 0.6, 0.12)]);
  if (hail) foley.push([hail[0], x => Sn.nz(x, hail[1] - hail[0], "highpass", 4000, 3000, 0.8, 0.14)]);
  vapor.forEach(v => foley.push([v.t, x => Sn.nz(x, 1.2, "highpass", 5000, 2500, 0.7, 0.3)]));
  if (S.counter) S.counter.values.slice(1).forEach(([w]) => foley.push([at(w), x => Sn.tick(x, 1800, 0.05)]));
  (S.stamps || []).forEach(s => foley.push([at(s.at), x => Sn.chime(x, [523.25, 659.25, 783.99], 0.06)]));
  const shakes = (S.shakes || []).map(([w, a]) => [at(w), a]).concat(bolts.map(tb => [tb, 14]));
  const punch = beats.slice(1).map(b => b.t0 + 0.04).concat((S.punch || []).map(at));
  K.mount({ T, mode: "style", ready, punch, foley, lines, scene, bandHud, events: [], hookLine: S.hookLine !== false,
    credit: t => beatAt(t).credit || S.credit || "Curio illustration", drone: S.drone || { freqs: [55, 55.4, 82.4], level: 0.03 },
    shake: t => Math.max(0, ...shakes.map(([s, a]) => K.shakeAt(t, s, a))), flash: t => Math.max(0, ...bolts.map(tb => K.flashAt(t, tb, 0.1, 0.55))) });
})();
