/* Footage-first story: real public-domain clips and photos are the proof, simple code-drawn diagrams show the mechanism.
   Built 2026-10-26 after Leon judged the AI-plate P8 "no point to be watched": the Sep breakouts paired real footage/archive
   with matte mechanism diagrams. A video supplies window.SPEC (scenes/pN_ff.js) and optional window.DIAGRAMS; this file draws it.
   SPEC = { beats:[{kind:"clip"|"photo"|"diagram", src, at, fit:"print"|"cover", fx, fy, z0, z1, rate, from, freeze, loop,
                    diagram, label, credit}],
            fps (clip frame rate, default 30), marks:[{at, to, x, y, r, text, side}], tags:[{text, at, to, side, dy}],
            counter:{label, at, to, values, fmt}, stamps:[{text, at, to, y, size}], shakes:[[at, amp]], punch:[at], nums, breaks, drone }
   A clip asset is a folder of frames (tools/clip_frames.py); make_page embeds it as an array. "at" is a word regex, [regex, n]
   or seconds. Coordinates: scene/HUD y = screen y - 420 in the full 9:16 layout (captions sit above screen y ~640). */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt } = K;
  const S = window.SPEC, Wd = WORDS, T = window.T, D = window.DIAGRAMS || {}, FPS = S.fps || 30;
  const at = x => (x == null ? null : typeof x === "number" ? x : Array.isArray(x) ? Wd[K.ix(Wd, x[0], x[1])].s : Wd[K.ix(Wd, x)].s);
  const load = src => { const im = new Image(); im.src = src; return im; };
  const media = {}; Object.keys(ASSETS).forEach(k => { media[k] = Array.isArray(ASSETS[k]) ? ASSETS[k].map(load) : load(ASSETS[k]); });
  const ready = Promise.all([].concat(...Object.values(media).map(m => (Array.isArray(m) ? m : [m]))).map(im => im.decode()));
  const beats = S.beats.map((b, i) => ({ ...b, t0: i === 0 ? 0 : at(b.at) - 0.04 }));
  beats.forEach((b, i) => { b.t1 = i < beats.length - 1 ? beats[i + 1].t0 : T; });
  const beatAt = t => { let b = beats[0]; beats.forEach(x => { if (t >= x.t0) b = x; }); return b; };
  const SY = y => y - 420; // screen y -> scene y

  function frameOf(b, t) { // the image to show for this beat at time t (clips advance at FPS * rate, hold or loop at the end)
    const m = media[b.src]; if (!Array.isArray(m)) return m;
    let u = t - b.t0; if (b.freeze != null) u = Math.min(u, b.freeze);
    let i = (b.from || 0) + Math.floor(u * FPS * (b.rate || 1)); i = b.loop ? i % m.length : Math.min(i, m.length - 1); return m[Math.max(0, i)];
  }
  function cover(c, img, vp, fx, fy, z) { const sc = Math.max(vp.w / img.width, vp.h / img.height) * z, dw = img.width * sc, dh = img.height * sc, x = vp.x + vp.w / 2 - dw * fx, y = vp.y + vp.h / 2 - dh * fy; c.drawImage(img, x, y, dw, dh); return { x, y, w: dw, h: dh }; }
  function print(c, img, vp, b, p) { // archival look: a framed print over a blurred, darkened copy of itself
    c.save(); c.filter = "blur(22px)"; cover(c, img, vp, 0.5, 0.5, 1.25); c.restore(); c.fillStyle = "rgba(6,8,10,.66)"; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    const pw = b.pw || 1000, ph = Math.min(pw * img.height / img.width, b.maxH || 1060), cy = SY(b.cy || 1010), z = lerp(b.z0 == null ? 1.0 : b.z0, b.z1 == null ? 1.06 : b.z1, E.sine(p));
    c.save(); c.translate(540, cy); c.scale(z, z); c.shadowColor = "rgba(0,0,0,.7)"; c.shadowBlur = 44; rr(c, -pw / 2 - 10, -ph / 2 - 10, pw + 20, ph + 20, 8); c.fillStyle = "#ece6d8"; c.fill(); c.shadowBlur = 0;
    rr(c, -pw / 2, -ph / 2, pw, ph, 4); c.save(); c.clip(); const r = cover(c, img, { x: -pw / 2, y: -ph / 2, w: pw, h: ph }, fxAt(b, p), fyAt(b, p), b.iz || 1); c.restore(); c.restore();
    lastImg = { x: 540 + r.x * z, y: cy + r.y * z, w: r.w * z, h: r.h * z }; return { x: 540 - pw * z / 2, y: cy - ph * z / 2, w: pw * z, h: ph * z };
  }
  const fxAt = (b, p) => lerp(b.fx == null ? 0.5 : b.fx, b.fx1 == null ? (b.fx == null ? 0.5 : b.fx) : b.fx1, E.sine(p)), // optional pan: fx -> fx1, fy -> fy1
    fyAt = (b, p) => lerp(b.fy == null ? 0.5 : b.fy, b.fy1 == null ? (b.fy == null ? 0.5 : b.fy) : b.fy1, E.sine(p));
  let lastBox = null, lastImg = null; // print frame and the drawn image inside it (marks can pin to image fractions ix, iy)
  function scene(c, t, vp) {
    const b = beatAt(t), p = clamp((t - b.t0) / Math.max(0.01, b.t1 - b.t0));
    if (b.kind === "diagram") { const g = c.createRadialGradient(540, SY(1000), 80, 540, SY(1000), 1300); g.addColorStop(0, "#1b2733"); g.addColorStop(1, "#070b10"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h); if (D[b.diagram]) D[b.diagram](c, t, vp, p, b); lastBox = null; return; }
    const img = frameOf(b, t);
    if ((b.fit || "print") === "cover") { lastImg = cover(c, img, vp, fxAt(b, p), fyAt(b, p), lerp(b.z0 == null ? 1.04 : b.z0, b.z1 == null ? 1.14 : b.z1, E.sine(p))); lastBox = { x: 0, y: SY(640), w: 1080, h: 1000 }; }
    else lastBox = print(c, img, vp, b, p);
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.82)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function proof(c, box, text, p) { // "● REAL FOOTAGE · NASA 1966" pinned to the top-left corner of the print
    if (!box || p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 34px ${K.DISP}`; const tw = c.measureText(text).width + 64, x = box.x + 18, y = box.y + 18;
    rr(c, x, y, tw, 50, 8); c.fillStyle = "rgba(6,10,14,.85)"; c.fill(); circ(c, x + 24, y + 25, 9, "#ff4d4d"); txt(c, text, x + 42, y + 27, `700 34px ${K.DISP}`, "#ffffff", "left"); c.restore();
  }
  function mark(c, m, p) { // circle an object on screen and label it
    const pin = m.ix != null && lastImg, a = E.out(clamp(p * 2.5)), x = pin ? lastImg.x + m.ix * lastImg.w : m.x, y = pin ? lastImg.y + m.iy * lastImg.h : SY(m.y), r = m.r || 90; c.save(); c.globalAlpha = a; c.strokeStyle = "#ffc83d"; c.lineWidth = 8;
    c.beginPath(); c.arc(x, y, r * lerp(1.4, 1, a), -1.6, -1.6 + 6.3 * a); c.stroke();
    if (m.text) { const left = m.side === "left", lx = left ? x - r - 30 : x + r + 30; c.lineWidth = 5; c.beginPath(); c.moveTo(x + (left ? -r : r) * 0.9, y); c.lineTo(lx, y); c.stroke(); c.font = `800 44px ${K.DISP}`; const tw = c.measureText(m.text).width + 28;
      rr(c, left ? lx - tw : lx, y - 30, tw, 60, 10); c.fillStyle = "rgba(6,10,14,.85)"; c.fill(); txt(c, m.text, left ? lx - tw / 2 : lx + tw / 2, y + 2, `800 44px ${K.DISP}`, "#ffc83d"); }
    c.restore();
  }
  function bandHud(c, t, vp) {
    const b = beatAt(t); if (b.label && b.kind !== "diagram") proof(c, lastBox, b.label, inv(b.t0 + 0.05, b.t0 + 0.3, t));
    (S.marks || []).forEach(m => { const a0 = at(m.at), a1 = m.to == null ? T : at(m.to) - 0.04; if (t >= a0 && t < a1) mark(c, m, (t - a0) / 0.6); });
    (S.tags || []).forEach(g => { const a0 = at(g.at) || 0, a1 = g.to == null ? T : at(g.to); if (t >= a0 && t < a1) tag(c, g.side === "right" ? 1010 : 70, SY(g.y || 1560) + (g.dy || 0), g.text, inv(a0, a0 + 0.25, t), g.color, g.side === "right" ? "right" : "left"); });
    const C = S.counter; if (C) { const a0 = at(C.at), a1 = C.to == null ? T : at(C.to); if (t >= a0 && t < a1) {
      let v = C.values[0][1]; C.values.forEach(([w, val]) => { if (t >= at(w)) v = val; }); const done = v === C.values[C.values.length - 1][1], y = SY(C.y || 1430);
      c.save(); c.globalAlpha = inv(a0, a0 + 0.15, t); rr(c, 1010 - 444, y - 36, 464, 150, 16); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); c.restore();
      K.readout(c, 1010, y, C.label, C.fmt ? C.fmt(v, t) : String(v), { size: 92, color: done ? "#ffc83d" : "#ffffff" }); } }
    (S.stamps || []).forEach(s => { const a0 = at(s.at), a1 = s.to == null ? T : at(s.to); if (t >= a0 && t < a1) K.stamp(c, 540, SY(s.y || 1210), s.text, { p: inv(a0, a0 + 0.3, t), size: s.size || 64 }); });
  }
  const lines = K.autoLines(Wd, T, S.nums || [], S.breaks || []);
  const Sn = K.Snd, foley = [[0, x => Sn.nz(x, Math.min(T, 3), "lowpass", 600, 300, 0.7, 0.18)]];
  beats.slice(1).forEach(b => foley.push([b.t0, x => Sn.whoosh(x, 0.35, true, 0.22)]));
  (S.marks || []).forEach(m => foley.push([at(m.at), x => Sn.tick(x, 1500, 0.05)]));
  if (S.counter) S.counter.values.slice(1).forEach(([w]) => foley.push([at(w), x => Sn.tick(x, 1800, 0.05)]));
  (S.stamps || []).forEach(s => foley.push([at(s.at), x => Sn.chime(x, [523.25, 659.25, 783.99], 0.06)]));
  (S.foley || []).forEach(([w, fn]) => foley.push([at(w), fn]));
  const shakes = (S.shakes || []).map(([w, a]) => [at(w), a]), punch = beats.slice(1).map(b => b.t0 + 0.04).concat((S.punch || []).map(at));
  K.mount({ T, mode: "style", ready, punch, foley, lines, scene, bandHud, events: [], hookLine: S.hookLine !== false,
    credit: t => beatAt(t).credit || S.credit || "Curio", drone: S.drone || { freqs: [55, 55.4, 82.4], level: 0.03 },
    shake: t => Math.max(0, ...shakes.map(([s, a]) => K.shakeAt(t, s, a))), flash: t => 0 });
})();
