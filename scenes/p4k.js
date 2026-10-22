/* P4 v4 · Kittinger's jump from the edge of space · trycurio.app style, Zack voice.
   Facts (Wikipedia "Joseph Kittinger", accessed 2026-10-20): Excelsior III, 16 Aug 1960, 102,800 ft (31,300 m) = 19.5 mi;
   right glove pressurization failed on the ascent, right hand swelled to twice its normal size; free fall 4 min 36 s.
   Opener: U.S. Air Force photo "Kittinger-jump.jpg" (public domain). Airliner line at 35,000 ft is an illustration reference. */
(function () {
  const { clamp, lerp, inv, E, hash, noise, track, rr, circ, txt, seg, poly } = K;
  const Wd = WORDS, T = window.T, w = (re, n) => Wd[K.ix(Wd, re, n)].s;
  const tIn = w(/^In$/) - 0.05, tMiles = w(/^nineteen$/, 1), tOn = w(/^On$/), tFailed = w(/^failed/), tSwell = w(/^swelled$/), tTwice = w(/^twice$/),
    tHe = w(/^He$/), tJump = w(/^jumped$/, 1), tFell = w(/^fell$/), tMin = w(/^minutes/);
  const photo = new Image(); photo.src = ASSETS.jump; const ready = photo.decode();
  const FT = 0.0098; // world px per foot: 102,800 ft -> ~1007 px
  const yOf = ft => -ft * FT, GOND = yOf(102800);
  function photoOpen(c, img, vp, t, t1, fx, fy, z0, z1) { const p = E.out(clamp(t / t1)), sc = Math.max(vp.w / img.width, vp.h / img.height) * lerp(z0, z1, p), dw = img.width * sc, dh = img.height * sc; c.drawImage(img, vp.x + vp.w / 2 - dw * fx, vp.y + vp.h / 2 - dh * fy, dw, dh); }
  // ---------- world (side view of the ascent column) ----------
  function sky(c, vp, cam, S) {
    const [, yTop] = S(0, -1200), [, yGround] = S(0, 0), g = c.createLinearGradient(0, yTop, 0, yGround);
    g.addColorStop(0, "#02030a"); g.addColorStop(0.55, "#0a1a3e"); g.addColorStop(0.85, "#2c6db4"); g.addColorStop(1, "#8fc3ee"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    for (let i = 0; i < 110; i++) { const [x, y] = S(-900 + hash(i) * 1800, -1300 + hash(i + 7) * 700); const a = clamp((-(y - yGround) / (yGround - yTop + 1)) * 1.6 - 0.6); if (a > 0) { c.fillStyle = `rgba(255,255,255,${a * (0.3 + 0.6 * hash(i + 3))})`; c.fillRect(x, y, 2.4, 2.4); } }
  }
  function earth(c, vp, S, z) { // curved horizon at ground level, clouds, thin atmosphere glow
    const [cx, gy] = S(0, 0), R = 5200 * z, oy = gy + R - 40 * z;
    c.save(); c.beginPath(); c.arc(cx, oy, R, 0, 6.2832); c.clip();
    const g = c.createLinearGradient(0, gy - 40 * z, 0, gy + 500 * z); g.addColorStop(0, "#3d7fc4"); g.addColorStop(1, "#0e2c55"); c.fillStyle = g; c.fillRect(vp.x - 10, gy - 60 * z, vp.w + 20, vp.h + 600 * z);
    c.fillStyle = "rgba(255,255,255,.55)"; for (let i = 0; i < 26; i++) { const [x, y] = S(-1400 + hash(i + 40) * 2800, 10 + hash(i + 41) * 220); c.beginPath(); c.ellipse(x, y, (60 + hash(i + 42) * 140) * z, (8 + hash(i + 43) * 14) * z, 0, 0, 6.2832); c.fill(); }
    c.restore();
    c.save(); c.strokeStyle = "rgba(140,200,255,.55)"; c.lineWidth = Math.max(2, 18 * z); c.beginPath(); c.arc(cx, oy, R + 6 * z, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); c.restore();
  }
  function balloon(c, x, y, s) { // y = gondola top
    c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = "rgba(220,226,235,.7)"; c.lineWidth = 2; for (const dx of [-40, -14, 14, 40]) seg(c, dx * 0.4, 0, dx, -150);
    c.beginPath(); c.moveTo(0, -150); c.bezierCurveTo(-170, -230, -210, -520, 0, -560); c.bezierCurveTo(210, -520, 170, -230, 0, -150); c.closePath();
    const g = c.createLinearGradient(-200, 0, 200, 0); g.addColorStop(0, "rgba(200,208,220,.75)"); g.addColorStop(0.5, "rgba(250,252,255,.92)"); g.addColorStop(1, "rgba(170,180,195,.75)"); c.fillStyle = g; c.fill();
    c.strokeStyle = "rgba(150,160,175,.6)"; c.lineWidth = 1.5; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(0, -150); c.quadraticCurveTo(k * 55, -380, 0, -560); c.stroke(); } c.restore();
  }
  function gondola(c, x, y, s, open) {
    c.save(); c.translate(x, y); c.scale(s, s); rr(c, -46, 0, 92, 74, 6); c.fillStyle = "#c9cdd2"; c.fill(); rr(c, -46, 0, 92, 74, 6); c.strokeStyle = "#7d858e"; c.lineWidth = 3; c.stroke();
    if (open) { rr(c, 8, 10, 30, 56, 4); c.fillStyle = "#1a1e24"; c.fill(); } rr(c, -40, 66, 80, 10, 3); c.fillStyle = "#8a9099"; c.fill(); c.restore();
  }
  function man(c, x, y, s, pose, t) { // white pressure suit; pose 0 = standing, 1 = spread-eagle fall
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(pose * (0.35 + 0.08 * Math.sin(t * 3)));
    c.strokeStyle = "#e9edf1"; c.lineCap = "round"; c.lineWidth = 9; const a = lerp(0.25, 1.15, pose), l = lerp(0.12, 0.7, pose);
    seg(c, -8, -30, -8 - Math.sin(a) * 30, -30 + Math.cos(a) * 30); seg(c, 8, -30, 8 + Math.sin(a) * 30, -30 + Math.cos(a) * 30); // arms
    seg(c, -6, 0, -6 - Math.sin(l) * 32, Math.cos(l) * 32); seg(c, 6, 0, 6 + Math.sin(l) * 32, Math.cos(l) * 32); // legs
    rr(c, -13, -42, 26, 44, 9); c.fillStyle = "#dfe4ea"; c.fill(); rr(c, -11, -30, 22, 16, 4); c.fillStyle = "#c8682c"; c.fill(); // chest pack
    circ(c, 0, -54, 13, "#eef1f4"); circ(c, 3, -54, 7, "#2a3442"); c.restore();
  }
  // ---------- the glove ----------
  function hand(c, cx, cy, sz, swell, t) { // sz = base size, swell 0..1 -> 1x..2x
    const s = sz * (1 + swell), red = swell;
    c.save(); c.translate(cx, cy); c.scale(s, s);
    const fill = K.rgb(K.mix([238, 241, 245], [236, 120, 110], red * 0.75)); c.fillStyle = fill; c.strokeStyle = "#2a3442"; c.lineWidth = 3 / s * sz;
    const fat = 1 + swell * 0.35;
    [[-36, -70, 0.12], [-12, -82, 0.03], [12, -80, -0.04], [34, -66, -0.12]].forEach(([fx, fy, r]) => { c.save(); c.translate(fx, -18); c.rotate(r); rr(c, -10 * fat, fy + 18, 20 * fat, -fy - 10, 10 * fat); c.fill(); c.stroke(); c.restore(); });
    c.save(); c.translate(-48, 10); c.rotate(-0.9); rr(c, -11 * fat, -46, 22 * fat, 48, 11 * fat); c.fill(); c.stroke(); c.restore();
    rr(c, -50 * fat, -24, 100 * fat, 80, 30 * fat); c.fill(); c.stroke(); rr(c, -44, 52, 88, 46, 10); c.fillStyle = "#9aa3ad"; c.fill(); c.stroke();
    c.restore();
  }
  function handScene(c, vp, t) {
    const g = c.createRadialGradient(540, 540, 60, 540, 540, 700); g.addColorStop(0, "#14233d"); g.addColorStop(1, "#050a14"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    c.strokeStyle = "rgba(120,200,255,.12)"; c.lineWidth = 1.5; for (let k = 0; k <= 18; k++) { seg(c, k * 60, 0, k * 60, 1080); seg(c, 0, k * 60, 1080, k * 60); }
    const swell = E.io(inv(tSwell - 0.1, tTwice + 0.35, t)), wob = Math.sin(t * 7) * 3 * swell;
    // the normal size, dashed, for comparison
    c.save(); c.setLineDash([10, 9]); c.globalAlpha = inv(tSwell, tSwell + 0.3, t) * 0.9; c.translate(540, 600); c.scale(2.2, 2.2); c.strokeStyle = "#9fd4ee"; c.lineWidth = 2;
    [[-36, -70, 0.12], [-12, -82, 0.03], [12, -80, -0.04], [34, -66, -0.12]].forEach(([fx, fy, r]) => { c.save(); c.translate(fx, -18); c.rotate(r); rr(c, -10, fy + 18, 20, -fy - 10, 10); c.stroke(); c.restore(); }); rr(c, -50, -24, 100, 80, 30); c.stroke(); c.restore();
    hand(c, 540 + wob, 600, 2.2, swell, t);
    if (t > tFailed - 0.1) { const u = t - tFailed; for (let i = 0; i < 9; i++) { const k = ((u * 1.6 + i / 9) % 1), x = 470 + i * 16 + k * (i % 2 ? 60 : -60), y = 780 + k * 120; circ(c, x, y, 6 + k * 16, `rgba(200,230,255,${0.4 * (1 - k)})`); } }
    if (t > tFailed - 0.1) { const p = E.back(inv(tFailed - 0.1, tFailed + 0.2, t)); c.save(); c.translate(860, 240); c.scale(p, p); circ(c, 0, 0, 74, "rgba(6,10,14,.85)"); c.strokeStyle = "#ff6b5b"; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 60, Math.PI * 0.8, Math.PI * 2.2); c.stroke();
      const needle = lerp(Math.PI * 2.0, Math.PI * 0.9, E.io(inv(tFailed, tFailed + 0.6, t))); c.strokeStyle = "#ffffff"; c.lineWidth = 5; seg(c, 0, 0, Math.cos(needle) * 50, Math.sin(needle) * 50); txt(c, "GLOVE", 0, 36, `800 20px ${K.DISP}`, "#ff8a7a"); c.restore(); }
  }
  // ---------- camera ----------
  const fallY = t => GOND + 60 + (t < tJump ? 0 : (yOf(18000) - GOND) * E.io(inv(tJump + 0.2, T, t)));
  const CAM = [[tIn, [0, GOND + 30, 1.9]], [tMiles - 0.6, [0, GOND + 80, 1.15], "io"], [tMiles + 0.25, [60, -560, 0.82], "io"], [tOn, [60, -540, 0.8], "lin"]];
  function world(c, vp, t, cam, fall) {
    const z = cam[2], cx = vp.x + vp.w / 2, cy = vp.y + vp.h / 2, S = (x, y) => [cx + (x - cam[0]) * z, cy + (y - cam[1]) * z];
    sky(c, vp, cam, S); earth(c, vp, S, z);
    // airliner reference line (illustration): cruising altitude ~35,000 ft
    const [, ya] = S(0, yOf(35000)); const la = inv(tMiles - 0.3, tMiles + 0.2, t) * (fall ? 0 : 1); if (la > 0) { c.save(); c.globalAlpha = la; c.strokeStyle = "rgba(255,255,255,.55)"; c.setLineDash([14, 10]); c.lineWidth = 3; seg(c, vp.x, ya, vp.x + vp.w, ya); c.setLineDash([]); txt(c, "AIRLINERS ~35,000 FT", vp.x + 90, ya - 22, `700 30px ${K.DISP}`, "rgba(255,255,255,.85)", "left");
      const [px] = S(-260 + (t - tMiles) * 60, 0); c.fillStyle = "#e9edf1"; rr(c, px - 30, ya - 7, 60, 14, 7); c.fill(); poly(c, [[px - 6, ya], [px + 10, ya + 22], [px + 18, ya + 22], [px + 8, ya]], "#c9ced3"); c.restore(); }
    const [gx, gy] = S(0, GOND); balloon(c, gx, gy, z * 0.6); gondola(c, gx, gy, z, true);
    if (!fall) man(c, gx + 22 * z, gy + 44 * z, z * 0.8, 0, t);
    else { const fy = fallY(t), p = inv(tJump - 0.05, tJump + 0.35, t), [mx, my] = S(lerp(22, 60, p) + Math.sin(t * 2) * 6, lerp(GOND + 44, fy, p)); man(c, mx, my, z * 0.8, p, t);
      if (p >= 1) { c.save(); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 3; for (let k = 0; k < 16; k++) { const x = vp.x + hash(k) * vp.w, y = vp.y + ((hash(k + 5) * vp.h - t * 1600) % vp.h + vp.h) % vp.h; seg(c, x, y, x, y + 70 + hash(k + 9) * 90); } c.restore(); } }
  }
  function scene(c, t, vp) {
    if (t < tIn) { photoOpen(c, photo, vp, t, tIn, 0.5, 0.42, 1.0, 1.18); return; }
    if (t < tOn) { world(c, vp, t, track(CAM, t), false); return; }
    if (t < tHe - 0.05) { handScene(c, vp, t); return; }
    const u = inv(tHe - 0.05, T, t), fy = fallY(t), cam = [lerp(0, 60, inv(tJump, tJump + 0.5, t)), lerp(GOND + 40, fy, E.io(inv(tJump, tJump + 0.6, t))), lerp(1.5, 1.25, u)];
    world(c, vp, t, cam, true);
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 44px ${K.DISP}`; const tw = c.measureText(text).width + 36, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 28); c.scale(sc, sc); rr(c, -tw / 2, -28, tw, 56, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 44px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  // one data card at a time: the height while it is spoken, then the free-fall clock
  function bandHud(c, t, vp) {
    const xr = vp.x + vp.w - 28, y = vp.y + 28;
    if (t > tMiles - 0.1 && t < tOn) tag(c, xr, y, "19 MILES · 102,800 FT", inv(tMiles - 0.1, tMiles + 0.15, t) * (1 - inv(tOn - 0.2, tOn, t)), "#ffc83d", "right");
    if (t > tJump + 0.3) { const secs = Math.min(276, Math.round(276 * E.io(inv(tJump + 0.3, tMin + 0.35, t)))); tag(c, xr, y, "FREE FALL " + Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0"), inv(tJump + 0.3, tJump + 0.5, t), secs >= 276 ? "#ffc83d" : "#ffffff", "right"); }
  }
  const lines = K.autoLines(Wd, T, [["nineteen sixty", "1960"], ["nineteen miles", "19 miles"], ["four and a half", "4½"]], [/^hand$/, /^twice$/]);
  const S = K.Snd, foley = [[0, x => S.nz(x, tIn, "lowpass", 600, 300, 0.7, 0.12)], [tIn, x => S.nz(x, tOn - tIn, "lowpass", 260, 200, 0.7, 0.1)], [tFailed - 0.05, x => S.nz(x, 1.4, "highpass", 3500, 2500, 0.7, 0.22)], [tJump, x => S.nz(x, T - tJump, "bandpass", 400, 1400, 0.8, 0.3)]];
  const punch = [w(/^edge$/), w(/^Kittinger$/), w(/^balloon$/), w(/^glove$/), w(/^swelled$/), w(/^twice$/), tJump, w(/^fell$/), w(/^four$/)];
  K.mount({ T, mode: "style", ready, punch, foley, credit: t => (t < tIn ? "U.S. Air Force photo · 1960 · public domain" : "Curio animation"), lines, scene, bandHud, events: [], drone: { freqs: [49, 49.6, 73.4], level: 0.035 },
    shake: t => Math.max(K.shakeAt(t, tFailed, 8), K.shakeAt(t, tJump, 10)), flash: t => Math.max(K.flashAt(t, tIn, 0.08, 0.4), K.flashAt(t, tMin + 0.35, 0.09, 0.5)) });
})();
