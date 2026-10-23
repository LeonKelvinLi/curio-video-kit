/* P7 · Stapp's rocket-sled stop, 10 Dec 1954 · trycurio.app style, Zack voice.
   Facts (Wikipedia "John Stapp" citing Aviation Week Jan 1955; Smithsonian NASM, accessed 2026-10-22): Sonic Wind No. 1, Holloman AFB,
   632 mph, slowed to a stop in 1.4 s, 46.2 g, no permanent injuries, "fastest man on Earth". Claims STP-1..6 in docs/ledgers/scripts-and-claims-p7.json.
   Photos (public domain, U.S. Air Force via National Archives / Wikimedia Commons): the Dec 10 1954 run (SSgt Lawrence A. Wise),
   the six face frames from an EARLIER 421 mph run (labelled as such on screen), and Stapp in the sled seat. Sled animation is simplified. */
(function () {
  const { clamp, lerp, inv, E, hash, track, rr, circ, txt, seg, poly } = K;
  const Wd = WORDS, T = window.T, w = (re, n) => Wd[K.ix(Wd, re, n)].s;
  const HOOK = !!window.P7_HOOK; // P7H (scenes/p7_hook.js): first sentence on screen whole from frame 0; the posted P7 master is unchanged
  const tSix = w(/^six$/), tHour = w(/^hour$/), tTo = w(/^to$/), tZero = w(/^zero$/), tSecond = w(/^second$/), tAir = w(/^Air$/) - 0.05, tStapp = w(/^Stapp$/),
    tDid = w(/^did$/), tPurpose = w(/^purpose/), tThe = w(/^The$/) - 0.05, t46 = w(/^forty-six$/), tWeight = w(/^weight/), tHe = w(/^He$/) - 0.05,
    tFastest = w(/^fastest$/), tEarth = w(/^Earth/);
  const STOP = 1.4, tStopped = tZero + STOP, tFace3 = tDid, tFace5 = lerp(tPurpose, tThe, 0.45);
  const load = src => { const im = new Image(); im.src = src; return im; };
  const run = load(ASSETS.run), f1 = load(ASSETS.face1), f3 = load(ASSETS.face3), f5 = load(ASSETS.face5), portrait = load(ASSETS.portrait);
  const ready = Promise.all([run, f1, f3, f5, portrait].map(im => im.decode()));
  // cover-fit a photo so (fx, fy) sits at the viewport centre, zoomed by z
  function photo(c, img, vp, fx, fy, z) { const sc = Math.max(vp.w / img.width, vp.h / img.height) * z, dw = img.width * sc, dh = img.height * sc; c.drawImage(img, vp.x + vp.w / 2 - dw * fx, vp.y + vp.h / 2 - dh * fy, dw, dh); }

  // ---------- the sled: side view, camera locked to the sled, the ground does the moving ----------
  const V0 = 9000; // ground px per second at full speed (drawn as motion blur, not to scale)
  const speedAt = t => (t < tZero ? 1 : 1 - inv(tZero, tStopped, t)); // linear deceleration over 1.4 s
  const posAt = t => (t < tZero ? V0 * t : V0 * tZero + V0 * STOP * (inv(tZero, tStopped, t) - inv(tZero, tStopped, t) ** 2 / 2));
  const GY = 560, RAIL = 770;
  function rider(c, x, y, lean) { // seated figure, pivots forward at the hips
    c.save(); c.translate(x, y); c.rotate(lean); rr(c, -26, -118, 52, 110, 18); c.fillStyle = "#2b3138"; c.fill();
    circ(c, 4, -140, 30, "#1d2228"); rr(c, 8, -152, 30, 18, 6); c.fillStyle = "#c9a34e"; c.fill(); // helmet + visor
    c.strokeStyle = "#2b3138"; c.lineCap = "round"; c.lineWidth = 18; seg(c, 6, -96, 64, -62); c.restore(); // arm braced forward
    c.strokeStyle = "#2b3138"; c.lineWidth = 20; c.lineCap = "round"; seg(c, x + 4, y - 6, x + 70, y - 4); seg(c, x + 70, y - 4, x + 92, y + 40); // legs
  }
  function sledScene(c, t, vp) {
    const v = speedAt(t), pos = posAt(t), decel = t > tZero && t < tStopped ? 1 : 0;
    const sky = c.createLinearGradient(0, vp.y, 0, GY); sky.addColorStop(0, "#b9c6cf"); sky.addColorStop(1, "#ebe3d2"); c.fillStyle = sky; c.fillRect(vp.x, vp.y, vp.w, GY - vp.y);
    // far mountains (slow parallax)
    const mo = -(pos * 0.015) % 900; c.fillStyle = "#98a1a6";
    for (let k = -1; k < 3; k++) { const x0 = mo + k * 900; poly(c, [[x0, GY], [x0 + 140, GY - 70], [x0 + 260, GY - 40], [x0 + 420, GY - 120], [x0 + 600, GY - 55], [x0 + 760, GY - 95], [x0 + 900, GY]], "#98a1a6"); }
    const gr = c.createLinearGradient(0, GY, 0, vp.y + vp.h); gr.addColorStop(0, "#dcccaa"); gr.addColorStop(1, "#a9916c"); c.fillStyle = gr; c.fillRect(vp.x, GY, vp.w, vp.y + vp.h - GY);
    // ground streaks: length grows with speed (motion blur)
    for (let i = 0; i < 70; i++) { const yy = GY + 20 + hash(i) * 900, len = 8 + v * 260 * (0.5 + hash(i + 1)), x = ((hash(i + 2) * 1400 - pos * (0.6 + 0.6 * (yy - GY) / 900)) % 1400 + 1400) % 1400 - 160;
      c.fillStyle = `rgba(110,88,60,${0.25 + 0.2 * hash(i + 3)})`; c.fillRect(x, yy, len, 3 + hash(i + 4) * 4); }
    // track: rail, water trough, checkered markers like the real track
    c.fillStyle = "#b3a58c"; c.fillRect(vp.x, RAIL + 10, vp.w, 70); c.fillStyle = "#6f8fa6"; c.fillRect(vp.x, RAIL + 22, vp.w, 12);
    const mk = 120, mo2 = -pos % (mk * 2); for (let x = mo2 - mk * 2; x < vp.x + vp.w + mk; x += mk) { const k = Math.round((x - mo2) / mk); c.fillStyle = k % 2 ? "#f2efe6" : "#1d2125"; c.fillRect(x, RAIL + 44, mk + (v > 0.15 ? v * 60 : 0), 26); }
    c.fillStyle = "#4a4f55"; c.fillRect(vp.x, RAIL, vp.w, 12);
    // sled (fixed on screen, small vibration while moving)
    const jx = v * Math.sin(t * 90) * 3, jy = v * Math.cos(t * 77) * 3; c.save(); c.translate(jx, jy); c.translate(520, 760); c.scale(1.5, 1.5); c.translate(-520, -760);
    c.strokeStyle = "#3d434a"; c.lineWidth = 8; seg(c, 250, 740, 800, 740); seg(c, 250, 700, 760, 700); for (let x = 260; x <= 760; x += 50) seg(c, x, 700, x + 25, 740); // truss
    for (const y of [688, 720]) { rr(c, 170, y - 14, 120, 28, 12); c.fillStyle = "#59606a"; c.fill(); } // rocket tubes
    if (t < tZero - 0.1) { const fl = 1 - inv(tZero - 0.5, tZero - 0.1, t); for (const y of [688, 720]) { const L = (110 + 40 * Math.sin(t * 60 + y)) * fl; const g = c.createLinearGradient(170, 0, 170 - L, 0); g.addColorStop(0, "rgba(255,240,190,.95)"); g.addColorStop(1, "rgba(255,140,40,0)"); c.fillStyle = g; poly(c, [[170, y - 12], [170 - L, y], [170, y + 12]]); c.fill(); } }
    poly(c, [[760, 744], [810, 744], [790, 770], [760, 770]], "#3d434a"); // water-brake scoop
    rr(c, 560, 610, 22, 100, 6); c.fillStyle = "#3d434a"; c.fill(); rr(c, 520, 690, 120, 20, 6); c.fill(); // seat back + pan
    const lean = 0.5 * E.out(inv(tZero, tZero + 0.18, t)) * (1 - E.io(inv(tStopped, tStopped + 0.4, t)));
    rider(c, 590, 696, lean);
    c.restore();
    // speed lines in the air while fast
    if (v > 0.05) { c.save(); c.globalAlpha = v * 0.5; c.strokeStyle = "#ffffff"; c.lineWidth = 3; for (let i = 0; i < 18; i++) { const y = vp.y + 300 + hash(i + 30) * 900, x = ((hash(i + 31) * 1400 - pos * 1.4) % 1400 + 1400) % 1400 - 200; seg(c, x, y, x + 120 + 240 * v, y); } c.restore(); }
    // water spray thrown ahead of the scoop while braking
    if (t > tZero) {
      const mist = (1 - inv(tZero, tStopped + 0.8, t)) * inv(tZero, tZero + 0.12, t); if (mist > 0) { const g = c.createRadialGradient(980, 700, 20, 980, 620, 600); g.addColorStop(0, `rgba(240,248,252,${0.85 * mist})`); g.addColorStop(1, "rgba(240,248,252,0)"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h); }
      for (let i = 0; i < 140; i++) { const te = tZero + E.in(hash(i)) * STOP, age = t - te; if (age < 0 || age > 0.9) continue; const sp = speedAt(te), vx = (500 + hash(i + 1) * 1400) * sp, vy = -(500 + hash(i + 2) * 900) * (0.4 + sp);
        const x = 950 + vx * age, y = 770 + vy * age + 900 * age * age; circ(c, x, y, (5 + hash(i + 3) * 16) * (1 + age), `rgba(225,238,246,${0.85 * (1 - age / 0.9)})`); }
    }
  }

  // ---------- the real face frames (earlier 421 mph run), as a print over a darkened copy ----------
  function faceScene(c, t, vp) {
    const img = t < tFace3 ? f1 : t < tFace5 ? f3 : f5, t0 = t < tFace3 ? tAir : t < tFace5 ? tFace3 : tFace5, u = t - t0;
    c.save(); c.filter = "blur(18px)"; photo(c, img, vp, 0.5, 0.45, 1.2); c.restore(); c.fillStyle = "rgba(6,8,10,.72)"; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    const pw = 820, ph = pw * img.height / img.width, z = 1 + 0.05 * E.out(clamp(u / 0.9)) + 0.06 * (1 - E.out(clamp(u / 0.18))), cx = 540, cy = 470;
    c.save(); c.translate(cx, cy); c.scale(z, z); c.rotate(-0.012); c.shadowColor = "rgba(0,0,0,.6)"; c.shadowBlur = 40; rr(c, -pw / 2 - 14, -ph / 2 - 14, pw + 28, ph + 28, 10); c.fillStyle = "#efe9dc"; c.fill(); c.shadowBlur = 0;
    c.drawImage(img, -pw / 2, -ph / 2, pw, ph); c.restore();
  }

  // ---------- 46 x his body weight ----------
  const COLS = 8, ROWS = 6, GX = 64, GYY = 100, GSX = 126, GSY = 140;
  function person(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); circ(c, 0, -34, 14, col); rr(c, -17, -18, 34, 50, 12); c.fillStyle = col; c.fill(); c.restore(); }
  function weightScene(c, t, vp) {
    const g = c.createRadialGradient(540, 480, 60, 540, 480, 1100); g.addColorStop(0, "#1a2638"); g.addColorStop(1, "#05080e"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    const n = t < t46 ? 1 : Math.min(46, 1 + Math.floor(45 * inv(t46, tWeight - 0.05, t))), hit = E.out(inv(tWeight, tWeight + 0.25, t)), shove = 14 * Math.sin(Math.PI * clamp((t - tWeight) / 0.3));
    // one figure = his body weight, big at first, then it becomes slot 0 of the grid
    const p0 = E.io(inv(t46 - 0.25, t46 + 0.1, t)), sx = GX + 60, sy = GYY + 60;
    for (let i = 1; i < n; i++) { const cx = GX + 60 + (i % COLS) * GSX, cy = GYY + 60 + Math.floor(i / COLS) * GSY + shove, pop = E.back(clamp((t - (t46 + (i - 1) * (tWeight - 0.05 - t46) / 45)) / 0.12));
      person(c, cx, cy, 1.35 * pop, hit > 0 ? K.rgb(K.mix([233, 238, 243], [255, 200, 61], hit)) : "#e9eef3"); }
    person(c, lerp(540, sx, p0), lerp(470, sy, p0) + shove * p0, lerp(4.2, 1.35, p0), "#ffc83d");
    if (p0 < 1) { c.save(); c.globalAlpha = 1 - p0; txt(c, "HIS BODY WEIGHT", 540, 720, `800 56px ${K.DISP}`, "#ffc83d"); c.restore(); }
  }

  function scene(c, t, vp) {
    if (t < tTo) { photo(c, run, vp, 0.62, 0.47, lerp(1.18, 1.6, E.out(clamp(t / tTo)))); return; }
    if (t < tAir) { sledScene(c, t, vp); return; }
    if (t < tThe) { faceScene(c, t, vp); return; }
    if (t < tHe) { weightScene(c, t, vp); return; }
    photo(c, portrait, vp, 0.45, 0.44, lerp(1.0, 1.12, E.out(inv(tHe, T, t))));
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function panel(c, x, y, w, h, alpha) { c.save(); c.globalAlpha = alpha; rr(c, x, y, w, h, 16); c.fillStyle = "rgba(6,10,14,.78)"; c.fill(); c.restore(); }
  function bandHud(c, t, vp) {
    const x = vp.x + 70, xr = vp.x + vp.w - 70, y = vp.y + 24;
    if (t < tTo) tag(c, x, HOOK ? y + 640 : y, "HOLLOMAN AFB · DEC 10, 1954", inv(0.05, 0.3, t), "#ffffff", "left");
    if (t >= tSix && t < tAir) { // the speed readout: climbs on "six hundred thirty-two", then falls to 0 in 1.4 s
      const mph = t < tZero ? Math.round(632 * E.out(inv(tSix, tHour, t))) : Math.round(632 * speedAt(t)), done = t >= tStopped;
      panel(c, xr - 400, y + 84, 424, 150, inv(tSix, tSix + 0.15, t)); K.readout(c, xr, y + 120, "SPEED", mph + " MPH", { size: 92, color: done ? "#ffc83d" : "#ffffff", pulse: done ? 1 - inv(tStopped + 0.4, tStopped + 0.9, t) : 0 });
    }
    if (t >= tZero && t < tAir) { const s = Math.min(STOP, t - tZero); panel(c, x - 24, y + 84, 330, 150, inv(tZero, tZero + 0.1, t)); K.readout(c, x, y + 120, "STOPPING TIME", s.toFixed(2) + " S", { size: 92, align: "left", color: s >= STOP ? "#ffc83d" : "#ffffff" }); }
    if (t >= tAir && t < tThe) tag(c, x, y, "EARLIER RUN · 421 MPH", inv(tAir, tAir + 0.25, t), "#ffffff", "left");
    if (t >= tWeight && t < tHe) K.stamp(c, 540, -30, "46.2 G", { p: inv(tWeight, tWeight + 0.3, t), size: 76 });
    if (t >= tFastest) K.stamp(c, 540, 790, "FASTEST MAN ON EARTH", { p: inv(tFastest, tFastest + 0.3, t), size: 64 });
  }
  const credit = t => (t < tTo ? "U.S. Air Force photo · Dec 10, 1954 · public domain" : t < tAir ? "Curio animation · sled simplified" : t < tThe ? "U.S. Air Force photos · earlier 421 mph run · public domain" : t < tHe ? "Curio animation" : "U.S. Air Force photo · public domain");
  const lines = K.autoLines(Wd, T, [["six hundred thirty-two", "632"], ["forty-six", "46"]], HOOK ? [] : [/^hour$/, /^zero$/]);
  const S = K.Snd, foley = [
    [0, x => { S.nz(x, tZero, "lowpass", 520, 380, 0.7, 0.32); S.boom(x, 60, 30, 0.9, 0.4); }],
    [tTo - 0.05, x => S.whoosh(x, 0.4, true, 0.3)],
    [tZero, x => { S.hit(x); S.nz(x, STOP, "highpass", 2200, 900, 0.7, 0.32); }],
    [tStopped, x => S.tone(x, 1760, 0.18, 0.08, "triangle")],
    [tAir, x => S.whoosh(x, 0.35, false, 0.25)], [tFace3, x => S.thump(x)], [tFace5, x => S.thump(x, 0.8)],
    [tThe, x => S.whoosh(x, 0.4, true, 0.22)], [tWeight, x => S.hit(x)],
    [tHe, x => S.nz(x, 0.6, "lowpass", 900, 200, 0.7, 0.25)], [tFastest, x => S.chime(x, [523.25, 659.25, 783.99], 0.07)],
  ];
  for (let i = 1; i < 46; i += 3) foley.push([t46 + (i - 1) * (tWeight - 0.05 - t46) / 45, x => S.tick(x, 1400 + i * 20, 0.04)]);
  const punch = [tSix, tTo, tZero, tSecond, tAir, tStapp, tFace3, tFace5, tThe, t46, tWeight, tHe, tFastest];
  K.mount({ T, mode: "style", ready, hookLine: HOOK, punch, foley, credit, lines, scene, bandHud, events: [], drone: { freqs: [55, 55.4, 82.4], level: 0.035 },
    shake: t => Math.max(K.shakeAt(t, tZero, 22), K.shakeAt(t, tWeight, 12), K.shakeAt(t, tFace3, 8)),
    flash: t => Math.max(K.flashAt(t, tZero, 0.1, 0.6), K.flashAt(t, tFace3, 0.06, 0.35), K.flashAt(t, tFastest, 0.08, 0.35)) });
})();
