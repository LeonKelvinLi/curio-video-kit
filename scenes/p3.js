/* P3 v4 · Boston molasses flood · trycurio.app style, Zack voice. Facts: C-MOL-01..08 (../curio-ab-scripts-2026-10-19/facts-ledger.json). No bodies or injuries are shown. */
(function () {
  const { clamp, lerp, inv, E, hash, noise, track, rr, circ, txt, poly, seg } = K;
  const Wd = WORDS, T = window.T, w = (re, n) => Wd[K.ix(Wd, re, n)].s;
  // story order: real 1919 photo -> tank bursts -> wave at 35 mph -> 21 died -> many got stuck (boot) -> cold day (thermometer) -> thick like glue (lens)
  const tTank = w(/^tank$/), tBurst = w(/^burst/), tWave = w(/^wave$/, 1), tHour = w(/^hour/), t21 = w(/^Twenty-one$/), tMany = w(/^Many$/), tCold = w(/^cold$/), tThick = w(/^thick/), tFour = w(/^glue/);
  const tTwo = T + 10, t41 = T + 10, tFall = T + 11; // beats not in this script (tank x-ray, nightfall) stay off
  const tA = w(/^A$/), photo = new Image(); photo.src = ASSETS.molasses; const ready = photo.decode();
  const TANK_X = 0, TANK_W = 520, TANK_H = 560, THERMO_X = 3450, BOOT_X = 3000;
  const CAM = [
    [0, [60, -330, 1.45]], [tA, [60, -330, 1.4], "lin"], [tTank, [60, -330, 1.36], "lin"], [tBurst + 0.35, [260, -300, 0.98], "out"], [tWave, [520, -280, 0.95], "io"],
    [tWave + 0.3, [1000, -260, 0.86], "in"], [tHour + 0.15, [3250, -260, 0.86], "lin"], [t21 + 0.5, [2100, -260, 0.55], "io"], [tMany - 0.05, [1950, -260, 0.58], "lin"],
    [tMany + 0.4, [BOOT_X, -60, 2.2], "io"], [tCold - 0.15, [BOOT_X, -60, 2.35], "lin"], [tCold + 0.3, [3330, -330, 0.98], "io"], [T, [3330, -330, 1.06], "lin"],
  ];
  const front = t => (t < tBurst ? 0 : t < tWave ? lerp(TANK_W / 2, 900, E.out(inv(tBurst, tWave, t))) : t < tHour ? lerp(900, 3400, inv(tWave, tHour, t)) : lerp(3400, 4200, E.out(inv(tHour, tCold, t)))); // wave front x
  const night = t => 0;
  function scene(c, t, vp) {
    const cam = track(CAM, t), z = cam[2], cx = vp.x + vp.w / 2, cy = vp.y + vp.h * 0.55, S = (x, y) => [cx + (x - cam[0]) * z, cy + (y - cam[1]) * z];
    const nt = night(t), mute = E.io(inv(t21 - 0.1, t21 + 0.4, t)) * (1 - inv(tMany - 0.1, tMany + 0.3, t));
    // sky
    const sky = c.createLinearGradient(0, vp.y, 0, vp.y + vp.h); sky.addColorStop(0, K.rgb(K.mix([168, 186, 199], [16, 22, 40], nt))); sky.addColorStop(1, K.rgb(K.mix([214, 220, 222], [40, 46, 66], nt))); c.fillStyle = sky; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    // buildings (parallax 0.6)
    for (let i = 0; i < 16; i++) { const bx = -1600 + i * 420, bw = 360 + hash(i) * 60, bh = 520 + hash(i + 9) * 380, px = cx + (bx - cam[0] * 0.6) * z * 0.85, py = cy + (0 - cam[1]) * z, sw = bw * z * 0.85, sh = bh * z * 0.85;
      c.fillStyle = K.rgb(K.mix([122, 74, 60], [44, 30, 30], nt * 0.8)); c.fillRect(px, py - sh, sw, sh);
      c.fillStyle = nt > 0.5 ? "rgba(255,210,140,.55)" : "rgba(40,30,30,.45)"; for (let r = 0; r < 6; r++) for (let k = 0; k < 4; k++) if (hash(i * 31 + r * 7 + k) > 0.35) c.fillRect(px + sw * (0.12 + k * 0.21), py - sh + sh * (0.08 + r * 0.14), sw * 0.11, sh * 0.07); }
    // elevated railway
    const [, elY] = S(0, -420); c.fillStyle = K.rgb(K.mix([58, 64, 70], [20, 24, 30], nt)); c.fillRect(vp.x, elY - 26 * z, vp.w, 26 * z); for (let px = -1500; px < 5200; px += 300) { const [x] = S(px, 0); c.fillRect(x, elY, 12 * z, 420 * z); }
    // street + snow
    const [, gY] = S(0, 0); c.fillStyle = K.rgb(K.mix([196, 200, 204], [70, 76, 92], nt)); c.fillRect(vp.x, gY, vp.w, vp.y + vp.h - gY);
    // tank
    const [tx, ty] = S(TANK_X, 0), tw = TANK_W * z, th = TANK_H * z, burst = t >= tBurst, xr = inv(tTwo - 0.1, tTwo + 0.25, t) * (1 - inv(tWave - 0.3, tWave, t));
    if (!burst) { const a = 1; c.save(); c.globalAlpha = a; tankDraw(c, tx, ty, tw, th, z, t, 1, 0); c.restore(); }
    if (burst) { c.save(); c.globalAlpha = 1; tankDraw(c, tx, ty, tw, th, z, t, 1 - xr * 0.75, E.out(inv(tBurst, tBurst + 0.4, t))); c.restore();
      if (xr > 0) { const lvl = lerp(0.95, 0.12, E.io(inv(tTwo, tWave - 0.2, t))); c.save(); c.globalAlpha = xr; c.fillStyle = "rgba(44,22,8,.92)"; c.fillRect(tx - tw / 2 + 6, ty - th * lvl, tw - 12, th * lvl); c.strokeStyle = "rgba(160,220,255,.6)"; c.lineWidth = 2; for (let k = 1; k < 8; k++) seg(c, tx - tw / 2, ty - th * k / 8, tx + tw / 2, ty - th * k / 8); c.restore(); } }
    // crack growing
    if (t > tTank - 0.1 && t < tBurst + 0.05) { const p = inv(tTank - 0.1, tBurst, t); c.strokeStyle = "#ffd28a"; c.lineWidth = 4 * z; c.beginPath(); c.moveTo(tx + tw * 0.18, ty); for (let k = 1; k <= 10; k++) { if (k / 10 > p) break; c.lineTo(tx + tw * 0.18 + (hash(k) - 0.5) * 30 * z, ty - th * k / 10); } c.stroke(); }
    // molasses body
    if (burst) { const fx = front(t), crest = 260 * (1 - inv(tHour, tCold, t) * 0.7), base = lerp(40, 70, inv(tBurst, tHour, t));
      c.beginPath(); const [x0, y0] = S(-TANK_W / 2 - 200, 0); c.moveTo(x0, y0); for (let x = -TANK_W / 2 - 200; x <= fx; x += 40) { const d = fx - x, h = base + crest * Math.exp(-d / 260) + 6 * Math.sin(x * 0.03 + t * 6) * (1 - nt); const [px, py] = S(x, -h); c.lineTo(px, py); } const [fx1, fy1] = S(fx + 40, 0); c.lineTo(fx1, fy1); c.closePath();
      const g = c.createLinearGradient(0, S(0, -320)[1], 0, gY); g.addColorStop(0, "#5a2e10"); g.addColorStop(1, "#1e0d04"); c.fillStyle = g; c.fill();
      c.strokeStyle = `rgba(255,200,140,${0.35 * (1 - nt * 0.6)})`; c.lineWidth = 3 * z; c.stroke();
      if (nt > 0.05) { c.save(); c.globalAlpha = nt; for (let k = 0; k < 60; k++) { const [px, py] = S(-200 + hash(k) * 4200, -base * hash(k + 3)); circ(c, px, py, 2.4 * z, "rgba(220,235,255,.8)"); } c.restore(); } }
    // runners ahead of the wave (never caught)
    if (false) for (let i = 0; i < 5; i++) { const rx = front(t) + 110 + i * 85, [px, py] = S(rx, 0), s = z * (0.9 + hash(i) * 0.2), ph = Math.sin(t * 16 + i * 2); c.fillStyle = "#23262c"; circ(c, px, py - 118 * s, 13 * s, "#23262c"); c.fillRect(px - 9 * s, py - 104 * s, 18 * s, 52 * s); c.strokeStyle = "#23262c"; c.lineWidth = 7 * s; seg(c, px, py - 52 * s, px + 18 * ph * s, py); seg(c, px, py - 52 * s, px - 18 * ph * s, py); }
    // storefront thermometer
    { const [px, py] = S(THERMO_X, -260), h = 300 * z; rr(c, px - 22 * z, py - h / 2, 44 * z, h, 22 * z); c.fillStyle = "rgba(240,240,236,.92)"; c.fill(); const temp = t < t41 ? 41 : lerp(41, 30, night(t)), fill = (temp - 0) / 60; c.fillStyle = "#d8322a"; rr(c, px - 9 * z, py + h / 2 - 30 * z - (h - 60 * z) * fill, 18 * z, (h - 60 * z) * fill + 10 * z, 9 * z); c.fill(); circ(c, px, py + h / 2 - 20 * z, 24 * z, "#d8322a"); }
    // boot stuck in the set molasses
    if (t > tMany - 0.2) { const surf = -72;
      const stuck = (x, sc, ph) => { const lift = Math.max(0, Math.sin((t - tMany) * 7 + ph)) * 12 * sc, [bx, by] = S(x, surf - lift), [, sy] = S(x, surf), k = z * sc;
        c.strokeStyle = "rgba(70,32,10,.95)"; c.lineWidth = 4 * k; for (let j = -1; j <= 1; j++) seg(c, bx + j * 14 * k, by, bx + j * 20 * k, sy);
        rr(c, bx - 26 * k, by - 120 * k, 52 * k, 120 * k, 8 * k); c.fillStyle = "#2a2622"; c.fill(); rr(c, bx - 31 * k, by - 130 * k, 62 * k, 16 * k, 6 * k); c.fillStyle = "#4a4038"; c.fill();
        c.beginPath(); c.ellipse(bx, sy, 46 * k, 12 * k, 0, 0, 6.2832); c.fillStyle = "#3a1a06"; c.fill(); };
      // people stuck waist-deep: they strain upward and sink back, arms reaching (dark silhouettes, nothing graphic)
      const person = (x, sc, ph) => { const k = z * sc, u = t - tMany, strain = Math.max(0, Math.sin(u * 5 + ph)), [bx, by] = S(x, surf - strain * 8 * sc), [, sy] = S(x, surf);
        c.fillStyle = "#23262c"; rr(c, bx - 21 * k, by - 66 * k, 42 * k, 66 * k + (sy - by), 12 * k); c.fill(); circ(c, bx, by - 86 * k, 17 * k, "#23262c");
        c.strokeStyle = "#23262c"; c.lineWidth = 11 * k; c.lineCap = "round"; const a1 = -2.25 + Math.sin(u * 4 + ph) * 0.35, a2 = -0.85 - Math.sin(u * 4 + ph + 1) * 0.3;
        seg(c, bx - 15 * k, by - 58 * k, bx - 15 * k + Math.cos(a1) * 58 * k, by - 58 * k + Math.sin(a1) * 58 * k); seg(c, bx + 15 * k, by - 58 * k, bx + 15 * k + Math.cos(a2) * 58 * k, by - 58 * k + Math.sin(a2) * 58 * k);
        c.strokeStyle = "rgba(70,32,10,.95)"; c.lineWidth = 4 * k; for (let j = -1; j <= 1; j += 2) seg(c, bx + j * 14 * k, by - 4 * k, bx + j * 20 * k, sy);
        c.beginPath(); c.ellipse(bx, sy, 42 * k, 11 * k, 0, 0, 6.2832); c.fillStyle = "#3a1a06"; c.fill(); };
      stuck(BOOT_X + 175, 0.7, 3.1); person(BOOT_X - 150, 0.85, 1.3); person(BOOT_X + 20, 1, 0); }
    // viscosity lens
    lens(c, t, vp);
    // rivet pop on frame 0 and at the loop point
    [0].forEach(t0 => { const u = t0 === 0 ? t : t - (T - 0.02); if (u < 0 || u > 0.45) return; const [rx, ry] = S(TANK_X + 130, -430); circ(c, rx + u * 900 * z, ry - u * 500 * z + u * u * 1600 * z, 7 * z, "#c9ced3"); for (let k = 0; k < 8; k++) circ(c, rx + Math.cos(k) * u * 300 * z, ry + Math.sin(k) * u * 300 * z, 3 * z, `rgba(255,220,150,${1 - u / 0.45})`); });
    if (mute > 0) { c.fillStyle = `rgba(30,32,38,${0.45 * mute})`; c.fillRect(vp.x, vp.y, vp.w, vp.h); }
    if (t < tA) { const p = t / tA, sc = Math.max(vp.w / photo.width, vp.h / photo.height) * lerp(1.0, 1.26, E.out(p)), dw = photo.width * sc, dh = photo.height * sc; c.drawImage(photo, vp.x + (vp.w - dw) * lerp(0.2, 0.7, E.out(p)), vp.y + (vp.h - dh) * 0.55, dw, dh); }
  }
  function tankDraw(c, tx, ty, tw, th, z, t, alpha, split) {
    c.save(); c.globalAlpha *= alpha; const g = c.createLinearGradient(tx - tw / 2, 0, tx + tw / 2, 0); g.addColorStop(0, "#3c4148"); g.addColorStop(0.45, "#6e757d"); g.addColorStop(1, "#2a2e33"); c.fillStyle = g;
    if (split <= 0) { c.fillRect(tx - tw / 2, ty - th, tw, th); c.beginPath(); c.ellipse(tx, ty - th, tw / 2, 22 * z, 0, Math.PI, 0); c.fill(); }
    else { const op = split * 90 * z; c.fillRect(tx - tw / 2 - op * 0.3, ty - th * (1 - split * 0.35), tw * 0.68, th * (1 - split * 0.35)); c.fillRect(tx + tw * 0.18 + op, ty - th * (1 - split * 0.6), tw * 0.32, th * (1 - split * 0.6)); }
    c.fillStyle = "rgba(20,22,25,.55)"; for (let r = 1; r < 9; r++) for (let k = 0; k < 9; k++) circ(c, tx - tw / 2 + tw * (k + 0.5) / 9, ty - th * r / 9, 3.2 * z, c.fillStyle);
    c.restore();
  }
  function lens(c, t, vp) {
    const a = inv(tThick - 0.3, tThick, t); if (a <= 0) return; const cx = vp.x + vp.w * 0.5, cy = vp.y + vp.h * 0.5, R = 340;
    c.save(); c.globalAlpha = a; c.beginPath(); c.arc(cx, cy, R * E.back(clamp(a)), 0, 6.2832); c.save(); c.clip(); c.fillStyle = "#2a1406"; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    const thick = E.io(inv(tThick - 0.3, tFour, t)), frozen = t > tFour ? 1 : 0, crowd = lerp(1, 0.62, thick);
    for (let i = 0; i < 70; i++) { const bx = (hash(i) - 0.5) * 2 * R * crowd, by = (hash(i + 99) - 0.5) * 2 * R * crowd, amp = lerp(26, 3, thick) * (1 - frozen * 0.85); circ(c, cx + bx + noise(t * 6 + i) * amp, cy + by + noise(t * 6 + i + 40) * amp, 13, i % 3 ? "#8a4a1c" : "#b06a2c"); }
    c.restore(); c.strokeStyle = "#f2c14e"; c.lineWidth = 6; c.stroke(); c.restore();
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  // one data card: the wave speed while the voice says it
  function bandHud(c, t, vp) {
    const xr = vp.x + vp.w - 28, y = vp.y + 28;
    if (t > tWave && t < t21) { const v = Math.round(35 * E.out(inv(tWave, tHour, t))); tag(c, xr, y, v + " MPH", inv(tWave, tWave + 0.2, t) * (1 - inv(t21 - 0.25, t21, t)), v >= 35 ? "#ffc83d" : "#ffffff", "right"); }
  }
  const lines = K.autoLines(Wd, T, [["thirty-five", "35"], ["miles an hour", "mph"], ["twenty-one", "21"]], [/^what$/]);
  const S = K.Snd, ev = []; // style mode plays diegetic foley only
  const foley = [[tTank - 0.1, x => S.nz(x, tBurst - tTank + 0.2, "bandpass", 2400, 900, 6, 0.15)], [tBurst, x => { S.boom(x, 60, 25, 1.4, 0.7); S.nz(x, 2.2, "lowpass", 900, 240, 0.7, 0.4); }], [tWave, x => S.nz(x, tHour - tWave, "lowpass", 500, 800, 0.8, 0.3)], [tCold, x => S.nz(x, 1.2, "bandpass", 1200, 400, 1.5, 0.1)], [tThick, x => S.nz(x, tFour - tThick + 0.3, "lowpass", 260, 90, 4, 0.2)], [tFour, x => S.nz(x, 0.18, "bandpass", 500, 300, 0.6, 0.45)]];
  const punch = [/^A$/, /^burst/, /^thirty-five$/, /^Twenty-one$/, /^Many$/, /^because$/, /^cold$/, /^thick/, /^glue/].map(re => w(re));
  K.mount({ T, mode: "style", ready, punch, foley, credit: t => (t < tA ? "Boston Public Library · Globe Newspaper Co. 1919 · public domain" : "Curio animation"), lines, scene, bandHud, events: ev, drone: { freqs: [55, 55.5, 82.4], level: 0.04, env: [[t21, 0.0001], [tMany + 0.3, 0.035]] },
    shake: t => Math.max(K.shakeAt(t, tBurst, 12), K.shakeAt(t, tFour, 16)), flash: t => K.flashAt(t, tFour, 0.09, 0.6), footnote: "" });
})();
