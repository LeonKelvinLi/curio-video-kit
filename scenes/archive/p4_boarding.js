/* P4 · Fastest plane boarding · FULL + HUD. Facts: C-BRD-01..09 (Steffen & Hotchkiss 2012). Agent simulation is illustrative; on-screen times are the paper's official times. */
(function () {
  const { clamp, lerp, inv, E, hash, track, rr, circ, txt, seg, poly } = K;
  const Wd = WORDS, T = window.T, w = i => Wd[i].s;
  const tFive = w(2), tSec = w(6), t654 = w(9), tSecEnd = w(12), tRand = w(13), t444 = w(15), tRandEnd = w(18), tNow = w(19), tNeigh = w(20), tApart = w(26), t336 = w(27), tAlmost = w(31), tTwice = w(32), tBags = w(35), tOnce = w(40), tQ = w(41);
  const ROWS = 12, SEAT = 54, PITCH = 57, AISLE = 62, CX = 540, Y0 = 840; // row 1 at Y0
  const colX = c => (c < 3 ? CX - AISLE / 2 - (3 - c) * SEAT + SEAT / 2 : CX + AISLE / 2 + (c - 3) * SEAT + SEAT / 2);
  const rowY = r => Y0 + r * PITCH; // r: 0..11 (row 1..12)
  // ---------- deterministic boarding simulation ----------
  function sim(order, seed) {
    const P = order.map(([r, c], i) => ({ r, c, pos: -1 - i * 0.9, st: 0, timer: 0, bag: 3.5 + hash(seed + i) * 3.5, x: 0 })); // st 0 queue/walk,1 stow,2 shuffle,3 seated
    const snaps = []; let t = 0, entered = 0, lastEnter = -9;
    const seated = Array.from({ length: ROWS }, () => [0, 0, 0, 0, 0, 0]);
    while (t < 900) {
      // entry: next in queue steps into the aisle when the door is clear
      if (entered < P.length && t - lastEnter > 1.1) { const ahead = P.filter(p => p.st < 3 && p.pos >= -0.2); const minPos = ahead.length ? Math.min(...ahead.map(p => p.pos)) : 99; if (minPos > 0.8) { P[entered].pos = -0.2; lastEnter = t; entered++; } }
      const inAisle = P.filter((p, i) => i < entered && p.st < 3).sort((a, b) => b.pos - a.pos);
      inAisle.forEach((p, k) => {
        const front = k > 0 ? inAisle[k - 1].pos : 99;
        if (p.st === 0) { const target = p.r; const np = Math.min(p.pos + 1.7 * 0.1, target, front - 0.95); p.pos = Math.max(p.pos, np); if (Math.abs(p.pos - target) < 1e-6) { p.st = 1; p.timer = p.bag; } }
        else if (p.st === 1) { p.timer -= 0.1; if (p.timer <= 0) { const side = p.c < 3 ? [0, 1, 2] : [3, 4, 5], blockers = p.c < 3 ? side.filter(c => c > p.c && seated[p.r][c]) : side.filter(c => c < p.c && seated[p.r][c]); p.st = 2; p.timer = 1.2 + blockers.length * 2.6; p.shuf = p.timer; } }
        else if (p.st === 2) { p.timer -= 0.1; if (p.timer <= 0) { p.st = 3; seated[p.r][p.c] = 1; } }
      });
      // queue positions creep forward
      for (let i = entered; i < P.length; i++) P[i].pos = Math.min(P[i].pos + 0.17, -1 - (i - entered) * 0.9);
      snaps.push(P.map(p => [p.pos, p.st, p.st === 1 ? 1 - p.timer / p.bag : p.st === 2 ? 1 - p.timer / p.shuf : p.st === 3 ? 1 : 0]));
      if (entered === P.length && P.every(p => p.st === 3)) break; t += 0.1;
    }
    return { snaps, dur: t, P };
  }
  const seats = []; for (let r = 0; r < ROWS; r++) for (let c = 0; c < 6; c++) seats.push([r, c]);
  const shuffle = (arr, s) => arr.map((v, i) => [hash(s + i * 1.37), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const ordSections = [...shuffle(seats.filter(s => s[0] >= 8), 11), ...shuffle(seats.filter(s => s[0] >= 4 && s[0] < 8), 12), ...shuffle(seats.filter(s => s[0] < 4), 13)];
  const ordRandom = shuffle(seats, 21);
  const ordSteffen = []; [[5, 0], [4, 1], [3, 2]].forEach(([right, left]) => { [1, 0].forEach(par => { [right, left].forEach(c => { for (let r = ROWS - 1 - (1 - par); r >= 0; r -= 2) ordSteffen.push([r, c]); }); }); });
  const RUNS = [
    { name: "SECTIONS", time: "6:54", t0: tSec, t1: t654, sim: sim(ordSections, 1), col: "#ff8f6b" },
    { name: "RANDOM", time: "4:44", t0: tRand, t1: t444, sim: sim(ordRandom, 2), col: "#7fb1f0" },
    { name: "STEFFEN", time: "3:36", t0: tNeigh - 0.15, t1: t336, sim: sim(ordSteffen, 3), col: "#ffc83d" },
  ];
  const runAt = t => (t < tSec ? -1 : t < tRand - 0.6 ? 0 : t < tNow ? 1 : 2);
  const tagLabel = ([r, c]) => (r + 1) + "ABCDEF"[c];
  function people(c, t, z) {
    const ri = runAt(t);
    if (ri < 0) { // intro: passengers streaming in (preview of a random run)
      const R = RUNS[1], k = Math.min(R.sim.snaps.length - 1, Math.floor((t + 3) * 10)); drawSnap(c, R, k, t, 1); return;
    }
    const R = RUNS[ri], u = inv(R.t0, R.t1, t), rewind = ri < 2 ? inv(R.t1 + 0.9, (ri === 0 ? tRand : tNow) - 0.05, t) : 0;
    let k = Math.round(E.io(u) * (R.sim.snaps.length - 1)); if (rewind > 0) k = Math.round((1 - E.io(rewind)) * (R.sim.snaps.length - 1));
    if (ri === 2 && t < R.t0) k = 0; drawSnap(c, R, k, t, 1);
  }
  function drawSnap(c, R, k, t, a) {
    const snap = R.sim.snaps[k], ord = R.sim.P;
    snap.forEach(([pos, st, prog], i) => {
      const p = ord[i]; let x, y, bagUp = 0;
      if (pos < 0 && st === 0) { x = CX - 18 + pos * 40; y = Y0 - 120; if (x < -40) return; }
      else if (st <= 1) { x = CX; y = rowY(Math.max(0, pos)) - (pos < 0 ? 120 * (-pos) : 0); bagUp = st === 1 ? prog : 0; }
      else { const f = st === 3 ? 1 : E.io(prog); x = lerp(CX, colX(p.c), f); y = rowY(p.r); bagUp = 1; }
      const blocked = st === 1 && R.name === "SECTIONS" && t > tSec + 0.35 && t < t654;
      if (blocked) { c.save(); c.globalCompositeOperation = "lighter"; const g = c.createRadialGradient(x, y, 0, x, y, 90); g.addColorStop(0, "rgba(255,60,50,.55)"); g.addColorStop(1, "rgba(255,60,50,0)"); c.fillStyle = g; c.fillRect(x - 90, y - 90, 180, 180); c.restore(); }
      const col = st === 3 ? "#5b6d80" : R.col;
      c.save(); c.globalAlpha = a; c.beginPath(); c.ellipse(x, y + 4, 22, 13, 0, 0, 6.2832); c.fillStyle = "rgba(0,0,0,.35)"; c.fill(); circ(c, x, y, 15, col); circ(c, x - 4, y - 4, 5, "rgba(255,255,255,.35)");
      if (bagUp < 1 && st < 3) { const bx = lerp(x + 20, p.c < 3 ? CX - AISLE / 2 - 3 * SEAT + 6 : CX + AISLE / 2 + 3 * SEAT - 6, E.io(bagUp)); rr(c, bx - 9, y - 8, 18, 14, 3); c.fillStyle = "#e8e2d0"; c.fill(); }
      c.restore();
      if (R.name === "STEFFEN" && t > tNeigh - 0.1 && t < tApart + 0.4 && pos < 0 && pos > -7) { c.save(); c.globalAlpha = inv(tNeigh - 0.1, tNeigh + 0.15, t); rr(c, x - 26, y - 52, 52, 30, 8); c.fillStyle = "rgba(6,12,18,.85)"; c.fill(); txt(c, tagLabel([p.r, p.c]), x, y - 36, `700 24px ${K.DISP}`, "#ffc83d"); c.restore(); }
    });
  }
  function cabin(c, t) {
    const L = CX - AISLE / 2 - 3 * SEAT - 34, Rr = CX + AISLE / 2 + 3 * SEAT + 34, top = Y0 - 90, bot = rowY(ROWS - 1) + 70;
    c.save(); c.shadowColor = "rgba(0,0,0,.6)"; c.shadowBlur = 40; c.beginPath(); c.moveTo(L, bot); c.lineTo(L, top + 40); c.quadraticCurveTo(CX, top - 130, Rr, top + 40); c.lineTo(Rr, bot); c.quadraticCurveTo(CX, bot + 60, L, bot); c.closePath(); c.fillStyle = "#e9ecef"; c.fill(); c.restore();
    c.strokeStyle = "rgba(120,170,210,.35)"; c.lineWidth = 2; c.stroke();
    c.fillStyle = "#cfd5db"; c.fillRect(L + 6, top + 10, 18, bot - top - 20); c.fillRect(Rr - 24, top + 10, 18, bot - top - 20); // overhead bins
    c.fillStyle = "#dfe3e7"; c.fillRect(CX - AISLE / 2, top, AISLE, bot - top); // aisle
    for (let r = 0; r < ROWS; r++) for (let k = 0; k < 6; k++) { const x = colX(k), y = rowY(r); rr(c, x - SEAT / 2 + 4, y - 22, SEAT - 8, 46, 9); c.fillStyle = "#30465c"; c.fill(); rr(c, x - SEAT / 2 + 4, y + 16, SEAT - 8, 10, 4); c.fillStyle = "#24364a"; c.fill(); }
    c.font = `500 20px ${K.MONO}`; c.fillStyle = "rgba(40,60,80,.6)"; c.textAlign = "center"; for (let r = 0; r < ROWS; r++) c.fillText(String(r + 1), CX, rowY(r) + 2);
    rr(c, L - 30, Y0 - 150, 64, 60, 10); c.fillStyle = "#b9c3cc"; c.fill(); // door
  }
  const CAM = [[0, [0, 0, 1]], [tSec + 0.4, [0, 0, 1], "lin"], [tSec + 0.75, [0, -260, 1.5], "io"], [t654 - 0.2, [0, -260, 1.5], "lin"], [t654 + 0.15, [0, 0, 1], "io"], [tBags, [0, 0, 1], "lin"], [tBags + 0.4, [0, -150, 1.75], "io"], [tQ - 0.1, [0, -150, 1.75], "lin"], [tQ + 0.5, [0, 0, 1], "io"], [T, [0, 0, 1], "lin"]];
  function scene(c, t, vp) {
    const g = c.createLinearGradient(0, vp.y, 0, vp.y + vp.h); g.addColorStop(0, "#0b1a2a"); g.addColorStop(1, "#06101b"); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    c.strokeStyle = "rgba(120,170,210,.08)"; c.lineWidth = 1; for (let x = 0; x < 1080; x += 60) seg(c, x, vp.y, x, vp.y + vp.h); for (let y = 0; y < 1920; y += 60) seg(c, vp.x, y, vp.x + vp.w, y);
    const cam = track(CAM, t), z = cam[2]; c.save(); c.translate(540, 1100); c.scale(z, z); c.translate(-540 + cam[0], -1100 + cam[1]);
    cabin(c, t);
    if (t > tBags - 0.05 && t < tQ + 0.4) bagsMoment(c, t); else people(c, t, z);
    if (t > tNeigh - 0.15 && t < t336) { const a = inv(tNeigh - 0.15, tNeigh + 0.1, t) * (1 - inv(t336 - 0.3, t336, t)); ordSteffen.slice(0, 6).forEach(([r, k], i) => { const p = E.back(inv(tNeigh + i * 0.18, tNeigh + i * 0.18 + 0.3, t)); if (p <= 0) return; const x = colX(k), y = rowY(r); c.save(); c.globalAlpha = a; c.strokeStyle = "#ffc83d"; c.lineWidth = 5; rr(c, x - SEAT / 2 + 1, y - 26, SEAT - 2, 54, 10); c.stroke(); c.translate(x + 64, y); c.scale(p, p); rr(c, -30, -20, 60, 40, 9); c.fillStyle = "rgba(6,12,18,.9)"; c.fill(); txt(c, tagLabel([r, k]), 0, 2, `800 28px ${K.DISP}`, "#ffc83d"); c.restore(); });
      const a2 = inv(tNeigh + 0.6, tNeigh + 0.9, t) * a; if (a2 > 0) { const [r1, k1] = ordSteffen[0], [r2] = ordSteffen[1]; c.save(); c.globalAlpha = a2; c.strokeStyle = "#ffc83d"; c.lineWidth = 4; c.setLineDash([10, 8]); const x = colX(k1) + 110; seg(c, x, rowY(r1), x, rowY(r2)); c.setLineDash([]); txt(c, "2 ROWS", x + 52, (rowY(r1) + rowY(r2)) / 2, `800 30px ${K.DISP}`, "#ffc83d"); c.restore(); } }
    c.restore();
  }
  function bagsMoment(c, t) { // several passengers stow at once (Steffen spacing): rows 10, 8, 6, 4 window seats
    const u = inv(tBags + 0.05, tOnce + 0.2, t); [9, 7, 5, 3].forEach((r, i) => { const y = rowY(r), lift = E.out(clamp(u * 1.4 - i * 0.05)); circ(c, CX, y, 15, "#ffc83d"); const bx = lerp(CX + 22, CX + AISLE / 2 + 3 * SEAT - 6, lift), by = lerp(y - 2, y - 2, lift); rr(c, bx - 9, by - 8, 18, 14, 3); c.fillStyle = "#e8e2d0"; c.fill(); });
    for (let r = 0; r < 12; r++) if (![9, 7, 5, 3].includes(r)) for (let k = 0; k < 6; k++) if (hash(r * 6 + k) > 0.45) circ(c, colX(k), rowY(r), 15, "#5b6d80");
  }
  function hud(c, t, band) {
    if (t < tSec && !band) { const n = Math.round(72 * E.out(inv(0.05, tFive + 0.4, t))); K.readout(c, 1032, 300, "PASSENGERS", String(n), { pulse: n >= 72 ? 1 - inv(tFive + 0.4, tFive + 0.9, t) : 0 }); }
    if (t > tFive - 0.05 && t < tSec + 0.1 && !band) { ["SECTIONS", "BACK-TO-FRONT", "RANDOM", "WINDOW-MIDDLE-AISLE", "STEFFEN"].forEach((m, i) => { const p = inv(tFive + i * 0.1, tFive + i * 0.1 + 0.25, t) * (1 - inv(tSec - 0.1, tSec + 0.1, t)); if (p > 0) { c.save(); c.globalAlpha = p; K.pill(c, 48, 300 + i * 62, m, { size: 26 }); c.restore(); } }); }
    const ri = runAt(t);
    if (ri >= 0 && t < tAlmost - 0.4) { const R = RUNS[ri], [mm, ss] = R.time.split(":").map(Number), tot = mm * 60 + ss, f = t < R.t0 ? 0 : E.io(inv(R.t0, R.t1, t)), rew = ri < 2 ? inv(R.t1 + 0.9, (ri === 0 ? tRand : tNow) - 0.05, t) : 0, secs = Math.round(tot * f * (1 - rew)), lock = t >= R.t1 && rew === 0;
      if (!band) K.readout(c, 1032, 300, R.name, Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0"), { pulse: lock ? 1 - inv(R.t1 + 0.35, R.t1 + 0.9, t) * 0.6 : 0, punch: lock ? 1 - inv(R.t1, R.t1 + 0.25, t) : 0, color: lock ? R.col : "#ffffff" });
      if (rew > 0 && rew < 1) K.stamp(c, 540, 1000, "◀◀ REWIND", { p: 1, size: 56, color: "#9fd4ee" }); }
    if (t > tSec + 0.4 && t < t654 - 0.1) K.stamp(c, 540, 760, "AISLE BLOCKED", { p: inv(tSec + 0.4, tSec + 0.65, t), size: 56, color: "#ff6b5b" });
    if (t > t336 - 0.05 && t < tAlmost - 0.3) K.stamp(c, 540, 1000, "3:36", { p: inv(t336, t336 + 0.25, t), size: 150, color: "#ffc83d" });
    if (t > tAlmost - 0.45 && t < tBags - 0.05) board(c, t);
  }
  function board(c, t) {
    const a = inv(tAlmost - 0.45, tAlmost - 0.15, t) * (1 - inv(tBags - 0.3, tBags - 0.05, t)); c.save(); c.globalAlpha = a; rr(c, 70, 700, 940, 700, 28); c.fillStyle = "rgba(6,12,18,.97)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = 2; c.stroke();
    const rows = [["STEFFEN", 216, "3:36", "#ffc83d"], ["WINDOW-MIDDLE-AISLE", 253, "4:13", "#b7a4ff"], ["RANDOM", 284, "4:44", "#7fb1f0"], ["BACK-TO-FRONT", 371, "6:11", "#c9ced3"], ["SECTIONS", 414, "6:54", "#ff8f6b"]];
    rows.forEach(([n, s, lab, col], i) => { const y = 790 + i * 98, p = E.out(inv(tAlmost - 0.3 + i * 0.07, tAlmost + 0.15 + i * 0.07, t)), wmax = 520; txt(c, n, 110, y, `700 30px ${K.DISP}`, "#e9eef3", "left"); rr(c, 110, y + 18, wmax * (s / 414) * p, 34, 17); c.fillStyle = col; c.fill(); txt(c, lab, 110 + wmax * (s / 414) * p + 16, y + 36, `800 40px ${K.DISP}`, "#ffffff", "left"); });
    const tp = inv(tTwice, tTwice + 0.3, t); if (tp > 0) { c.globalAlpha = a * tp; txt(c, "ALMOST 2× FASTER THAN SECTIONS", 540, 1298, `800 44px ${K.DISP}`, "#ffc83d"); txt(c, "1 run per method · ~10% uncertainty (authors)", 540, 1356, `500 24px ${K.MONO}`, "rgba(233,238,243,.7)"); }
    c.restore();
  }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 40px ${K.DISP}`; const tw = c.measureText(text).width + 32, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 26); c.scale(sc, sc); rr(c, -tw / 2, -26, tw, 52, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 40px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  function bandHud(c, t, vp) {
    const x = vp.x + 28, y = vp.y + 24, xr = vp.x + vp.w - 28;
    tag(c, x, y, "72 PASSENGERS · 12 ROWS × 6 SEATS", clamp(t / 0.25 + 0.01), "#ffffff");
    if (t < tSec) { const n = Math.round(72 * E.out(inv(0.05, tFive + 0.4, t))); tag(c, xr, y, "PASSENGERS " + n, 1, n >= 72 ? "#ffc83d" : "#ffffff", "right"); }
    if (t > tFive - 0.05 && t < tSec + 0.1) ["SECTIONS", "BACK-TO-FRONT", "RANDOM", "WINDOW-MIDDLE-AISLE", "STEFFEN"].forEach((m, i) => tag(c, x, y + 70 + i * 62, m, inv(tFive + i * 0.1, tFive + i * 0.1 + 0.25, t) * (1 - inv(tSec - 0.1, tSec + 0.1, t)), "#e9eef3"));
    const ri = runAt(t);
    if (ri >= 0 && t < tAlmost - 0.4) { const R = RUNS[ri], [mm, ss] = R.time.split(":").map(Number), tot = mm * 60 + ss, f = t < R.t0 ? 0 : E.io(inv(R.t0, R.t1, t)), rew = ri < 2 ? inv(R.t1 + 0.9, (ri === 0 ? tRand : tNow) - 0.05, t) : 0, secs = Math.round(tot * f * (1 - rew)), lock = t >= R.t1 && rew === 0;
      tag(c, xr, y, R.name + " " + Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0"), 1, lock ? R.col : "#ffffff", "right"); }
  }
  const lines = K.linesFrom(Wd, [
    [["72", 0], ["people,", 1]], [["5", 2], ["ways", 3], ["to", 4], ["board.", 5]], [["Boarding", 6], ["in", 7], ["sections:", 8], ["6:54.", 9]],
    [["Random", 13], ["order:", 14], ["4:44.", 15]], [["Now:", 19], ["neighbors", 20], ["in", 21], ["line", 22], ["sit", 23], ["2", 24], ["rows", 25], ["apart.", 26]],
    Object.assign([["3:36.", 27]], { slam: 0 }), [["Almost", 31], ["twice", 32], ["as", 33], ["fast.", 34]], [["More", 35], ["bags", 36], ["go", 37], ["up", 38], ["at", 39], ["once.", 40]],
    Object.assign([["Which", 41], ["line", 42], ["are", 43], ["you", 44], ["in?", 45]], { q: true, chips: ["SECTIONS", "RANDOM", "STEFFEN"], chipAt: Wd[45].e + 0.1 }),
  ], T);
  const S = K.Snd, ev = [[0, x => { S.tone(x, 784, 0.5, 0.07); S.tone(x + 0.18, 659, 0.6, 0.07); S.nz(x, 2.5, "bandpass", 500, 600, 0.8, 0.06); }]];
  ["SECTIONS", "RANDOM", "STEFFEN"].forEach((_, i) => { const R = RUNS[i]; ev.push([R.t0, x => S.tick(x, 3200, 0.07)]); for (let k = 1; k < 12; k++) ev.push([R.t0 + (R.t1 - R.t0) * k / 12, x => S.tick(x, 1800, 0.03)]); ev.push([R.t1, x => i === 2 ? (S.hit(x), S.chime(x + 0.05, [659.25, 880, 1318.5], 0.08)) : S.boom(x, 80, 40, 0.5, 0.7)]); if (i < 2) ev.push([R.t1 + 0.9, x => S.nz(x, 0.6, "bandpass", 3000, 400, 2, 0.22)]); });
  for (let i = 0; i < 5; i++) ev.push([tFive + i * 0.1, x => S.tick(x, 1400 + i * 200, 0.04)]);
  ev.push([tSec + 0.4, x => { S.tone(x, 880, 0.5, 0.05); S.osc(x, "sawtooth", 110, 110, 0.6, 0.04); }]);
  for (let i = 0; i < 14; i++) ev.push([tNeigh + i * (t336 - tNeigh) / 14, x => S.osc(x, "triangle", [523, 587, 659, 784, 880][i % 5], [523, 587, 659, 784, 880][i % 5], 0.2, 0.05)]);
  ev.push([tAlmost - 0.3, x => S.whoosh(x, 0.6, true, 0.25)], [tBags + 0.1, x => { [0, 0.05, 0.1, 0.15].forEach(d => S.boom(x + d, 120, 60, 0.25, 0.4)); }], [tQ, x => { S.tone(x, 784, 0.5, 0.06); S.tone(x + 0.18, 659, 0.6, 0.06); }]);
  const foley = [[0, x => { S.tone(x, 784, 0.5, 0.05); S.tone(x + 0.18, 659, 0.6, 0.05); S.nz(x, T, "bandpass", 500, 600, 0.8, 0.05); }], [tBags + 0.1, x => { [0, 0.05, 0.1, 0.15].forEach(d => S.boom(x + d, 120, 60, 0.25, 0.35)); }]];
  K.mount({ T, mode: "style", foley, credit: () => "Curio animation · simulation", bandMap: () => ({ cx: 540, cy: 1110, s: 1 }), hudInScene: (c, t) => hud(c, t, true), bandHud, lines, scene, hud, events: ev, pill: "72 PASSENGERS · 12 ROWS × 6 SEATS", footnote: "Illustration · time-lapse · Steffen & Hotchkiss 2012 (one run per method)",
    drone: { freqs: [73.4, 73.9, 110], level: 0.03 }, shake: t => K.shakeAt(t, t336, 16), flash: t => K.flashAt(t, t336, 0.09, 0.6) });
})();
