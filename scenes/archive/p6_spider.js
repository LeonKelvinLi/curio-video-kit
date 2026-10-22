/* P6 · NASA's spider in space · BANDED. Facts: C-ARA-01..08. The answer (later webs Earth-like, finer silk) is withheld for the pinned comment. */
(function () {
  const { clamp, lerp, inv, E, hash, noise, track, rr, circ, txt, seg, poly } = K;
  const Wd = WORDS, T = window.T, w = i => Wd[i].s;
  const tNasa = w(2), tSky = w(7), tIdea = w(8), t17 = w(13), tCan = w(15), tWeb = w(20), tArab = w(23), tMess = w(29), tInc = w(30), tMission = w(31), t59 = w(35), tSo = w(37), tAgain2 = w(41), tQ = w(43);
  function spider(c, x, y, s, t, paddle) {
    c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = "#5a3a22"; c.lineWidth = 5; c.lineCap = "round";
    for (let sd = -1; sd <= 1; sd += 2) for (let i = 0; i < 4; i++) { const base = (-0.9 + i * 0.6) , wob = paddle * Math.sin(t * 9 + i * 1.3 + sd), a1 = base + wob * 0.25, kx = sd * Math.cos(a1) * 46, ky = Math.sin(a1) * 46 - 10, a2 = a1 + sd * 0.9 + wob * 0.3; c.beginPath(); c.moveTo(0, -18); c.lineTo(kx, ky); c.lineTo(kx + sd * Math.cos(a2 * sd) * 44, ky + 40 + Math.sin(i + t * 9 * paddle) * 6 * paddle); c.stroke(); }
    c.beginPath(); c.ellipse(0, -22, 18, 16, 0, 0, 6.2832); c.fillStyle = "#6b4528"; c.fill();
    c.beginPath(); c.ellipse(0, 22, 32, 40, 0, 0, 6.2832); c.fillStyle = "#7a5030"; c.fill(); c.strokeStyle = "#f3ead8"; c.lineWidth = 4; seg(c, 0, 4, 0, 44); seg(c, -14, 20, 14, 20); c.restore();
  }
  function enclosure(c, cx, cy, wd, ht, a) { c.save(); c.globalAlpha = a; rr(c, cx - wd / 2, cy - ht / 2, wd, ht, 18); c.fillStyle = "rgba(10,18,28,.55)"; c.fill(); c.strokeStyle = "#c9ced3"; c.lineWidth = 10; c.stroke(); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => circ(c, cx + sx * wd / 2, cy + sy * ht / 2, 14, "#e8ecef")); c.restore(); }
  const messy = []; for (let i = 0; i < 46; i++) messy.push([hash(i) * 2 - 1, hash(i + 50) * 2 - 1, hash(i + 100) * 2 - 1, hash(i + 150) * 2 - 1, hash(i + 200) * 2 - 1]);
  function messyWeb(c, cx, cy, R, p, t, blur) { c.save(); c.strokeStyle = `rgba(240,245,255,${0.75 - blur * 0.45})`; c.lineWidth = 2 + blur * 4; const n = Math.floor(messy.length * p);
    for (let i = 0; i < n; i++) { const m = messy[i], drift = Math.sin(t * 1.4 + i) * 8 * (1 - blur); c.beginPath(); c.moveTo(cx + m[0] * R, cy + m[1] * R); c.quadraticCurveTo(cx + m[4] * R * 0.6 + drift, cy + m[2] * R * 0.6 - drift, cx + m[2] * R, cy + m[3] * R); c.stroke(); } c.restore(); }
  function orbGhost(c, cx, cy, R, a) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.strokeStyle = "rgba(159,212,238,.75)"; c.lineWidth = 2; c.setLineDash([8, 7]); for (let k = 0; k < 24; k++) { const an = k / 24 * 6.2832; seg(c, cx, cy, cx + Math.cos(an) * R, cy + Math.sin(an) * R); } c.beginPath(); for (let th = 0; th < 6.2832 * 7; th += 0.08) { const r = 18 + th * (R - 30) / (6.2832 * 7); c.lineTo(cx + Math.cos(th) * r, cy + Math.sin(th) * r); } c.stroke(); c.setLineDash([]); c.restore(); }
  function skylab(c, x, y, s, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = "#cfd3d6"; rr(c, -60, -170, 120, 300, 20); c.fill(); c.fillStyle = "#b39a4a"; c.fillRect(-62, -60, 124, 46); // workshop + sunshade
    c.fillStyle = "#2a3a64"; c.fillRect(60, -40, 230, 90); c.strokeStyle = "rgba(255,255,255,.25)"; for (let k = 1; k < 6; k++) seg(c, 60 + k * 38, -40, 60 + k * 38, 50);
    c.fillStyle = "#d9dde0"; rr(c, -30, -250, 60, 90, 10); c.fill(); [0, 1, 2, 3].forEach(k => { c.save(); c.translate(0, -205); c.rotate(k * Math.PI / 2 + Math.PI / 4); c.fillStyle = "#2a3a64"; c.fillRect(20, -16, 150, 32); c.restore(); }); c.restore(); }
  const CAM = [[0, [0, 0, 1.6]], [tNasa - 0.05, [0, 0, 1.6], "lin"], [tNasa + 0.35, [0, -900, 1.0], "in"], [tSky + 0.2, [0, -1400, 0.9], "out"], [tIdea + 0.3, [0, -1500, 0.95], "io"], [tCan + 0.1, [0, -1500, 0.95], "lin"], [tCan + 0.5, [0, 0, 1.25], "io"], [tQ, [0, 0, 1.3], "lin"], [T, [0, 0, 1.6], "io"]];
  function scene(c, t, vp) {
    const cx = vp.x + vp.w / 2, cy = vp.y + vp.h / 2, cam = track(CAM, t);
    const space = clamp(inv(tNasa - 0.05, tNasa + 0.3, t)) * (1 - inv(T - 0.5, T - 0.1, t));
    // launch macro (frame 0 and loop)
    c.fillStyle = "#05070d"; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    for (let i = 0; i < 90; i++) { const x = vp.x + hash(i) * vp.w, y = vp.y + ((hash(i + 3) * vp.h + (cam[1] * 0.05)) % vp.h + vp.h) % vp.h; c.fillStyle = `rgba(255,255,255,${0.2 + 0.6 * hash(i + 6)})`; c.fillRect(x, y, 2.5, 2.5); }
    const inside = 1 - space; if (inside > 0) { c.save(); c.globalAlpha = inside; const g = c.createRadialGradient(cx, cy, 50, cx, cy, 600); g.addColorStop(0, "#3a2c22"); g.addColorStop(1, "#120d0a"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
      const shake = (t < tNasa ? 6 : 0) + (t > T - 0.5 ? 6 : 0); c.translate(noise(t * 40) * shake, noise(t * 40 + 9) * shake); c.strokeStyle = "#9aa1a8"; c.lineWidth = 22; seg(c, vp.x, cy + 120, vp.x + vp.w, cy + 120); spider(c, cx, cy + 40, 2.2, t, 0.15); c.restore(); }
    if (space > 0) { c.save(); c.globalAlpha = space;
      const sx = cx + 120 + Math.sin(t * 0.3) * 30, sy = cy + (cam[1] + 1400) * 0.25, show = inv(tNasa + 0.3, tSky, t) * (1 - inv(tCan, tCan + 0.4, t)); if (show > 0) { c.save(); c.globalAlpha = space * show; skylab(c, sx, sy, 0.95, -0.3 + t * 0.05); c.restore(); }
      if (t > tIdea - 0.2 && t < tCan + 0.3) { const p = inv(tIdea - 0.2, tCan + 0.3, t), px = lerp(vp.x - 300, vp.x + vp.w + 300, p), py = cy + 60 + Math.sin(t * 2) * 30; c.save(); c.translate(px, py); c.rotate(-0.25 + p * 0.5); rr(c, -150, -190, 300, 380, 6); c.fillStyle = "#f6f1e3"; c.fill(); c.strokeStyle = "rgba(60,80,140,.35)"; c.lineWidth = 2; for (let k = 0; k < 11; k++) seg(c, -120, -120 + k * 28, 120, -120 + k * 28); txt(c, "Web formation in zero gravity", 0, -150, `700 30px ${K.HAND}`, "#1d3a8a"); for (let k = 0; k < 9; k++) { c.strokeStyle = "rgba(29,58,138,.7)"; seg(c, -110, -96 + k * 28, -110 + 200 * hash(k + 4), -96 + k * 28); } c.restore(); }
      // enclosure x-ray with Arabella
      const ea = inv(tCan, tCan + 0.4, t); if (ea > 0) { const ecx = cx, ecy = cy - 30, R = 300; enclosure(c, ecx, ecy, 640, 500, ea);
        const p = E.out(inv(tWeb, tMess, t)), blur = inv(tSo, tSo + 0.4, t) * (1 - inv(T - 0.6, T - 0.2, t)), redo = t > tSo ? (Math.floor((t - tSo) / 0.55) % 2 === 0 ? 1 : 0.55) : 1;
        if (t < tSo) messyWeb(c, ecx, ecy, 250, p, t, 0); else { c.save(); c.globalAlpha = 0.55; messyWeb(c, ecx, ecy, 250, redo, t, 1); c.restore(); }
        orbGhost(c, ecx, ecy, 250, inv(tMess, tMess + 0.3, t) * (1 - inv(tMission, tMission + 0.4, t)) * 0.9);
        const fl = t > tArab ? 0 : 1, sx2 = ecx - 60 + Math.sin(t * 0.9) * 90 * fl + lerp(0, 60, inv(tArab, tMess, t)), sy2 = ecy - 40 + Math.cos(t * 0.7) * 60 * fl; spider(c, sx2, sy2, 1.35, t, fl ? 1 : 0.2); }
      c.restore(); }
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function bandHud(c, t, vp) {
    const x = vp.x + 28, y = vp.y + 24, xr = vp.x + vp.w - 28, s = Math.floor(Math.max(0, t - 0.4));
    if (t < tSky) tag(c, x, y, "SKYLAB 3 · JUL 28 1973", 1, "#ffffff");
    if (t > 0.4 && t < tCan) tag(c, xr, y, "MISSION CLOCK T+00:00:" + String(s).padStart(2, "0"), 1, "#9fd4ee", "right");
    if (t > t17 - 0.1 && t < tCan + 0.2) tag(c, x, y, "EXPERIMENT ED52 · STUDENT, AGE 17", inv(t17 - 0.1, t17 + 0.15, t), "#ffc83d");
    if (t > tCan && t < tArab) tag(c, x, y, "ENCLOSURE · ZERO-G", inv(tCan, tCan + 0.2, t), "#9fd4ee");
    if (t > tArab && t < tMission) tag(c, x, y, t < tMess ? "EARLY DAYS" : "FIRST WEBS: MESSY", 1, t < tMess ? "#ffffff" : "#ffc83d");
    if (t > tMess - 0.02 && t < tMission) { tag(c, xr, y, "DASHED: A NORMAL EARTH WEB", inv(tMess + 0.1, tMess + 0.35, t), "#9fd4ee", "right"); if (t > tInc - 0.05) K.stamp(c, vp.x + vp.w / 2, vp.y + vp.h - 120, "INCOMPLETE", { p: inv(tInc, tInc + 0.25, t), size: 64, color: "#ff6b5b" }); }
    if (t > tMission - 0.1 && t < tQ + 0.3) { const a = inv(tMission - 0.1, tMission + 0.2, t) * (1 - inv(tQ, tQ + 0.3, t)), bx = vp.x + 120, bw = vp.w - 240, by = vp.y + vp.h - 110; c.save(); c.globalAlpha = a; rr(c, bx - 30, by - 70, bw + 60, 140, 16); c.fillStyle = "rgba(6,10,14,.82)"; c.fill(); rr(c, bx, by - 8, bw, 16, 8); c.fillStyle = "rgba(255,255,255,.18)"; c.fill();
      const ph = t < tSo ? 0.1 : lerp(0.1, 0.72, E.io(inv(tSo, tAgain2 + 0.3, t))); rr(c, bx, by - 8, bw * ph, 16, 8); c.fillStyle = "#ffc83d"; c.fill(); circ(c, bx + bw * ph, by, 14, "#ffffff");
      txt(c, "JUL 28", bx, by - 40, `600 28px ${K.MONO}`, "#e9eef3", "left"); txt(c, "SEP 25 1973", bx + bw, by - 40, `600 28px ${K.MONO}`, "#e9eef3", "right"); txt(c, t < tSo ? "59 DAYS · EARLY DAYS" : "59 DAYS · LATER", bx + bw / 2, by - 40, `800 34px ${K.DISP}`, t >= t59 ? "#ffc83d" : "#ffffff"); c.restore(); }
  }
  const lines = K.linesFrom(Wd, [
    [["1973:", 0]], [["NASA", 2], ["flies", 3], ["2", 4], ["spiders", 5], ["to", 6], ["Skylab.", 7]], [["The", 8], ["idea", 9], ["came", 10], ["from", 11], ["a", 12], ["17-year-old", 13], ["student.", 14]],
    [["Can", 15], ["a", 16], ["spider", 17], ["spin", 18], ["a", 19], ["web", 20], ["without", 21], ["gravity?", 22]], Object.assign([["Arabella's", 23], ["first", 24], ["webs", 25], ["come", 26], ["out", 27], ["a", 28], ["mess.", 29]], { slam: 6 }),
    [["Incomplete.", 30]], [["And", 31], ["the", 32], ["mission", 33], ["runs", 34], ["59", 35], ["days.", 36]], [["So", 37], ["she", 38], ["tries", 39], ["again.", 40]], [["And", 41], ["again.", 42]],
    Object.assign([["Better", 43], ["webs,", 44], ["or", 45], ["worse?", 46]], { q: true, chips: ["BETTER", "WORSE"], chipAt: Wd[46].e + 0.1 }),
  ], T);
  const S = K.Snd, ev = [[0, x => { S.nz(x, tNasa, "lowpass", 180, 120, 0.7, 0.35); for (let k = 0; k < 6; k++) S.tick(x + k * 0.21, 3400, 0.03); }]];
  for (let s = 1; s < tCan; s++) ev.push([s + 0.4, x => S.tick(x, 2000, 0.035)]);
  ev.push([tNasa, x => S.whoosh(x, 0.9, true, 0.3)], [tIdea, x => S.nz(x, 0.5, "highpass", 2500, 4000, 0.8, 0.15)], [tCan, x => { S.tone(x, 880, 0.7, 0.05); S.tone(x + 0.05, 1320, 0.6, 0.04); }], [tWeb - 0.2, x => S.osc(x, "sine", 220, 160, 1.0, 0.04)]);
  for (let i = 0; i < 9; i++) ev.push([tArab + i * (tMess - tArab) / 9, x => S.osc(x, "triangle", 900 + i * 60, 880 + i * 60, 0.18, 0.05)]);
  ev.push([tMess, x => { S.hit(x); S.osc(x, "triangle", 196, 180, 0.9, 0.08); }], [tInc, x => S.boom(x, 75, 35, 0.4, 0.55)], [tMission, x => { for (let k = 0; k < 8; k++) S.tick(x + k * 0.06, 2400, 0.03); }], [t59, x => S.chime(x, [659.25, 987.77], 0.07)]);
  for (let i = 0; i < 10; i++) ev.push([tSo + i * 0.3, x => S.osc(x, "triangle", [523, 659, 784][i % 3], [523, 659, 784][i % 3], 0.16, 0.045)]);
  ev.push([T - 0.15, x => { for (let k = 0; k < 4; k++) S.tick(x + k * 0.04, 3400, 0.03); }]);
  const foley = [[0, x => S.nz(x, tNasa, "lowpass", 180, 120, 0.7, 0.35)]];
  K.mount({ T, mode: "style", foley, credit: () => "Curio animation", lines, scene, bandHud, events: ev, drone: { freqs: [65.4, 65.9, 98], level: 0.03 }, shake: t => K.shakeAt(t, tMess, 14), flash: t => K.flashAt(t, tMess, 0.09, 0.6), footnote: "" });
})();
