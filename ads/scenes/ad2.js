// AD2 "Screen time": every Sunday the phone reports four hours a day, and nothing to show for it. Curio fixes that.
import * as THREE from "three";
import * as M from "/engine/motion.js";
import { LI, makeFigure, setPose, setFace, mixPose, makeBunny, bunnyPose, makePhone, makeCard, mesh, roundedRectGeo } from "/engine/toys.js";
import { makeBedroom } from "/engine/sets.js";
import { caption, chip, stamp, endCard, loadEndArt, flash, placeWords, rr, COL, FONTS } from "/engine/ui.js";
import { clipURL, drawFeed, feedColor, POSE, camFrom, handheld, burst } from "/engine/common.js";

const D = Math.PI / 180;
const SEGS = [
  { from: 0, to: 2.72, at: 0.15 }, { from: 2.72, to: 4.1, at: 2.95 }, { from: 4.1, to: 6.0, at: 4.5 }, { from: 6.0, to: 7.15, at: 7.0 },
  { from: 7.15, to: 8.95, at: 8.25 }, { from: 8.95, to: 12.4, at: 10.15 }, { from: 12.4, to: 14.72, at: 13.85 }, { from: 14.72, to: 16.65, at: 16.55 }, { from: 16.65, to: 19.06, at: 18.85 },
];
const T = 22.7;
const S = { buzz: 0, four: 2.95, nothing: 4.5, fix: 7.0, thumb: 8.25, card: 10.15, holes: 13.85, next: 16.45, end: 18.85 };
const FLIP = 4.75, STAMP0 = 6.36, STAMP1 = 18.05, SWIPE = 9.49;
const TILES = ["todays-news", "horror-scroll", "random-facts", "weird-history", "science-bites", "psychology", "true-stories", "never-taught", "hidden-knowledge", "lines-that-hit"];
let W = [], L = {};

// ---------------------------------------------------------------- report card artwork (our own design)
function cardBase(x, w, h, accent) {
  x.clearRect(0, 0, w, h);
  const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#1d1830"); g.addColorStop(1, "#0d0b16");
  rr(x, 6, 6, w - 12, h - 12, 56); x.fillStyle = g; x.fill(); x.strokeStyle = "rgba(255,255,255,0.12)"; x.lineWidth = 4; x.stroke();
  const gl = x.createRadialGradient(w * 0.85, 0, 10, w * 0.85, 0, w * 0.9); gl.addColorStop(0, accent + "55"); gl.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gl; rr(x, 6, 6, w - 12, h - 12, 56); x.fill();
}
function label(x, s, X, Y, col = "rgba(255,255,255,0.55)") { x.font = "800 30px 'Hanken Grotesk'"; if (x.letterSpacing !== undefined) x.letterSpacing = "4px"; x.fillStyle = col; x.fillText(s, X, Y); if (x.letterSpacing !== undefined) x.letterSpacing = "0px"; }
function drawReportFront(x, w, h, k, mode) {
  const pink = mode === "curio", accent = pink ? "#ff8ad8" : "#8fa6ff";
  cardBase(x, w, h, accent); x.textBaseline = "alphabetic"; x.textAlign = "left";
  label(x, pink ? "WEEKLY REPORT · NEXT SUNDAY" : "WEEKLY REPORT · SUNDAY", 70, 110, pink ? "#ff8ad8" : "rgba(255,255,255,0.55)");
  x.font = "600 64px Fraunces"; x.fillStyle = "#fff"; x.fillText(pink ? "What you kept" : "Screen time", 70, 200);
  if (!pink) {
    const mins = Math.round(252 * M.outCubic(k.num)); x.font = "600 170px Fraunces"; x.fillStyle = "#fff";
    const txt = `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`; x.fillText(txt, 64, 400);
    x.font = "italic 500 54px Fraunces"; x.fillStyle = "rgba(255,255,255,0.7)"; x.fillText("a day", 70, 470);
    if (k.num > 0.6) { x.globalAlpha = M.seg(k.num, 0.6, 1); rr(x, w - 300, 330, 230, 76, 38); x.fillStyle = "rgba(255,84,104,0.18)"; x.fill(); x.font = "800 40px 'Hanken Grotesk'"; x.fillStyle = "#ff6b7d"; x.fillText("▲ 23%", w - 268, 383); x.globalAlpha = 1; }
    const hs = [0.62, 0.74, 0.58, 0.86, 1.0, 0.92, 0.8], days = "MTWTFSS"; const bw = 76, gap = (w - 140 - bw * 7) / 6, base = h - 130, H = 420;
    hs.forEach((v, i) => { const kk = M.outBack(M.clamp(k.bars * 1.6 - i * 0.09), 1.2); const bh = Math.max(8, H * v * kk); rr(x, 70 + i * (bw + gap), base - bh, bw, bh, 16); x.fillStyle = i === 4 ? "#ff6b7d" : "#8fa6ff"; x.globalAlpha = 0.35 + 0.65 * Math.min(1, kk); x.fill(); x.globalAlpha = 1;
      x.font = "700 32px 'Hanken Grotesk'"; x.fillStyle = "rgba(255,255,255,0.5)"; x.textAlign = "center"; x.fillText(days[i], 70 + i * (bw + gap) + bw / 2, base + 60); x.textAlign = "left"; });
  } else {
    const rows = [["Ideas explored", 59], ["Curio Sparks", 67], ["Saved to read again", 12]];
    rows.forEach(([n, v], i) => { const kk = M.clamp(k.num * 1.5 - i * 0.22); const y = 340 + i * 190; x.globalAlpha = Math.min(1, kk * 2);
      x.font = "500 46px Fraunces"; x.fillStyle = "rgba(255,255,255,0.8)"; x.fillText(n, 70, y); x.font = "600 120px Fraunces"; x.fillStyle = "#fff"; x.textAlign = "right"; x.fillText(String(Math.round(v * M.outCubic(kk))), w - 70, y + 20); x.textAlign = "left";
      rr(x, 70, y + 50, w - 140, 14, 7); x.fillStyle = "rgba(255,255,255,0.08)"; x.fill(); rr(x, 70, y + 50, (w - 140) * Math.min(1, v / 70) * M.outCubic(kk), 14, 7); x.fillStyle = "#ff8ad8"; x.fill(); x.globalAlpha = 1; });
  }
}
function drawReportBack(x, w, h, k) {
  cardBase(x, w, h, "#ff5468"); x.textAlign = "left"; x.textBaseline = "alphabetic";
  label(x, "FOR ALL THOSE HOURS", 70, 110); x.font = "600 64px Fraunces"; x.fillStyle = "#fff"; x.fillText("What you kept", 70, 200);
  [["Facts you learned", 0], ["Stories worth telling", 1], ["Things you'd remember", 2]].forEach(([n], i) => {
    const kk = M.outCubic(M.clamp(k * 1.6 - i * 0.25)); const y = 360 + i * 200; x.globalAlpha = kk;
    x.font = "500 48px Fraunces"; x.fillStyle = "rgba(255,255,255,0.8)"; x.fillText(n, 70, y); x.font = "600 120px Fraunces"; x.fillStyle = "rgba(255,255,255,0.35)"; x.textAlign = "right"; x.fillText("0", w - 70, y + 24); x.textAlign = "left";
    x.strokeStyle = "rgba(255,255,255,0.08)"; x.lineWidth = 3; x.beginPath(); x.moveTo(70, y + 70); x.lineTo(w - 70, y + 70); x.stroke(); x.globalAlpha = 1; });
}
function notif(x, w, k) { // drops in over the feed: a generic weekly-report notification
  if (k <= 0) return; const y = -200 + 250 * M.outBack(Math.min(1, k), 1.3);
  x.save(); x.shadowColor = "rgba(0,0,0,0.5)"; x.shadowBlur = 30; rr(x, 24, y, w - 48, 170, 40); x.fillStyle = "rgba(38,34,52,0.96)"; x.fill(); x.restore();
  rr(x, 50, y + 30, 64, 64, 16); x.fillStyle = "#6d55d8"; x.fill(); x.fillStyle = "#fff"; x.font = "700 40px 'Hanken Grotesk'"; x.textAlign = "center"; x.fillText("⏳", 82, y + 76); x.textAlign = "left";
  x.font = "800 30px 'Hanken Grotesk'"; x.fillStyle = "#fff"; x.fillText("Weekly report", 134, y + 58); x.font = "500 28px 'Hanken Grotesk'"; x.fillStyle = "rgba(255,255,255,0.75)"; x.fillText("You averaged 4h 12m a day,", 134, y + 100); x.fillText("up 23% from last week.", 134, y + 136);
  x.font = "500 24px 'Hanken Grotesk'"; x.fillStyle = "rgba(255,255,255,0.45)"; x.fillText("now", w - 100, y + 58);
}

function twoSided(front, back, w, h) {
  const g = new THREE.Group();
  const f = mesh(roundedRectGeo(w, h, 0.035), new THREE.MeshBasicMaterial({ map: front, transparent: true }), 0, 0, 0.002); g.add(f);
  const b = mesh(roundedRectGeo(w, h, 0.035), new THREE.MeshBasicMaterial({ map: back, transparent: true }), 0, 0, -0.002); b.rotation.y = Math.PI; g.add(b);
  return g;
}

export default {
  T, fps: 30, shutter: 0.5, fonts: FONTS,
  async setup(E) {
    const { scene } = E;
    W = placeWords((await (await fetch("/vo/ad2-words.json")).json()).words, SEGS);
    await loadEndArt(E);
    L.screen = E.canvasTex(660, 1434); L.front = E.canvasTex(900, 1200); L.back = E.canvasTex(900, 1200);
    L.bed = makeBedroom(E, { clock: "11:48" }); scene.add(L.bed.root);
    L.fig = makeFigure({ hoodie: "#2f9e8f", hoodie2: "#23857a", skin: "#e0a77a", hair: "#3b2416", brow: "#3b2416", hairStyle: "curly", pants: "#2c2f4a" }); L.bed.root.add(L.fig);
    L.phone = makePhone(L.screen.tex); L.bed.root.add(L.phone);
    L.report = twoSided(L.front.tex, L.back.tex, 0.36, 0.48); L.bed.root.add(L.report);
    L.card = makeCard(L.screen.tex, 0.25, 0.543, 0.022); L.bed.root.add(L.card);
    L.bunny = makeBunny(); L.bed.root.add(L.bunny);
    L.burst = burst(46, "#ffd6f5"); L.bed.root.add(L.burst.im);
    const tt = await Promise.all(TILES.map(n => E.texReady(`/assets/tiles/${n}.png`)));
    L.tiles = tt.map(tx => { const c = makeCard(tx, 0.31, 0.398, 0.024, { bright: 1.7 }); L.bed.root.add(c); c.visible = false; return c; });
    L.fog = new THREE.FogExp2("#141640", 0.05);
  },

  async prepare(t, E) {
    const { ctx: x, canvas } = L.screen, w = canvas.width, h = canvas.height;
    if (t < S.fix) { drawFeed(x, w, h, t, -1, 0.62, 0.22); notif(x, w, M.seg(t, 0.25, 0.75) * (1 - M.seg(t, 2.6, 2.9))); if (t > STAMP0) { x.fillStyle = `rgba(0,0,0,${M.seg(t, STAMP0, STAMP0 + 0.4) * 0.8})`; x.fillRect(0, 0, w, h); } }
    else if (t < S.holes) { const im = await E.img(clipURL("card-read", t - 4.86)); x.drawImage(im, 0, 0, w, h);
      const k = M.seg(t, S.fix, S.fix + 0.6); if (k < 1) { x.fillStyle = `rgba(123,92,255,${0.85 * (1 - M.outCubic(k))})`; x.fillRect(0, 0, w, h); } }
    else { const im = await E.img(clipURL("discover-rabbit-hole", 1.2 + Math.max(0, t - S.holes) * 0.6)); const sw = M.inOutQuint(M.seg(t, S.holes, S.holes + 0.3));
      if (sw < 1) { const prev = await E.img(clipURL("card-read", S.holes - 4.86)); x.drawImage(prev, 0, -sw * h, w, h); x.drawImage(im, 0, (1 - sw) * h, w, h); } else x.drawImage(im, 0, 0, w, h); }
    L.screen.tex.needsUpdate = true;
    const curio = t >= S.next;
    drawReportFront(L.front.ctx, 900, 1200, curio ? { num: M.seg(t, 16.75, 17.9) } : { num: M.seg(t, 3.0, 3.95), bars: M.seg(t, 1.9, 3.6) }, curio ? "curio" : "screen");
    drawReportBack(L.back.ctx, 900, 1200, M.seg(t, 5.0, 6.1));
    L.front.tex.needsUpdate = true; L.back.tex.needsUpdate = true;
  },

  update(t, E) {
    E.scene.fog = L.fog; E.clear = 0x141640; E.bloom.strength = 0.45; E.bloom.threshold = 0.92;
    const R = L.bed.R, fig = L.fig, ph = L.phone;
    // ---- figure
    const root = [0.1, 0.09, -1.05, 0]; let pose, face;
    const warm = M.smooth(M.seg(t, S.fix, S.fix + 1.0));
    if (t < S.fix) {
      const tired = M.seg(t, S.four, S.nothing); pose = JSON.parse(JSON.stringify(POSE.bedPhone));
      if (t > S.four) { pose.head = [pose.head[0] - 16, 0, 0]; }
      face = { mouth: t > STAMP0 - 0.1 ? "frown" : "flat", blink: M.blink(t, [1.2, 3.6, 5.6]) * (t > S.four ? 0.75 : 1), brows: 8 + 6 * tired, look: [0, t > S.four ? 6 : -6] };
    } else if (t < S.next) {
      pose = JSON.parse(JSON.stringify(POSE.bedPhone)); if (t > S.card && t < S.holes) pose.head = [pose.head[0] - 12, 0, 0];
      if (t >= S.holes) { const k = M.inOut(M.seg(t, S.holes, S.holes + 0.6)); pose.head = [pose.head[0] - 20 * k, Math.sin((t - S.holes) * 1.6) * 30 * k, 0]; }
      // thumb flick on "swipe"
      const fl = Math.max(0, Math.sin(Math.PI * M.seg(t, SWIPE - 0.2, SWIPE + 0.15))); pose.elR = [pose.elR[0] - 14 * fl, pose.elR[1], pose.elR[2]]; pose.handR = [10 - 25 * fl, 0, 0];
      face = t < S.fix + 0.55 ? { mouth: "o", eyeScale: 1.2, brows: -6, browY: 6, look: [0, 4] } : { mouth: t >= S.holes ? "grin" : "smile", blink: M.blink(t, [9.7, 12.2, 15.3]), brows: -4, browY: 3, look: [0, t > S.card ? 4 : -4] };
    } else { pose = JSON.parse(JSON.stringify(POSE.bedPhone)); pose.head = [pose.head[0] - 18, 0, 0]; face = { mouth: "grin", blink: M.blink(t, [17.4]), brows: -6, browY: 5, look: [0, 5] }; }
    pose.root = root; setPose(fig, pose); setFace(fig, face);
    // ---- phone in hands
    ph.position.set(0.1, 0.86 + (t < 0.7 ? M.shake(t, 0.25, 0.45, 26) * 0.006 : 0), -0.76); ph.rotation.set(50 * D, Math.PI, M.shake(t, 0.25, 0.45, 30) * 0.05); ph.updateMatrixWorld();
    const n = new THREE.Vector3(0, 0, 1).applyEuler(ph.rotation); R.phoneLight.position.copy(ph.position).addScaledVector(n, 0.24);
    R.phoneLight.color.set(t < S.fix ? feedColor(t, -1, 0.62) : "#b79cff").lerp(new THREE.Color("#ffffff"), 0.45);
    R.phoneLight.intensity = LI * (t < S.fix ? 0.06 * (t > STAMP0 ? 1 - 0.7 * M.seg(t, STAMP0, STAMP0 + 0.4) : 1) : 0.08 + 0.3 * Math.exp(-(t - S.fix) * 2.5));
    R.rim.color.set("#c49bff").lerp(new THREE.Color("#ff8ad8"), warm); R.rim.intensity = LI * (2.0 + 1.6 * warm); R.lampLight.intensity = LI * (0.9 + 0.4 * warm);
    // ---- report card: rises from the phone, flips, collapses into the phone; returns pink next Sunday
    const rp = L.report; const heroP = new THREE.Vector3(-0.08, 1.12, -0.36);
    let vis = false;
    if (t > 1.55 && t < S.fix + 0.5) {
      vis = true; const k = M.inOutQuint(M.seg(t, 1.6, 2.6)), out = M.inExpo(M.seg(t, S.fix - 0.05, S.fix + 0.35));
      const flip = M.spring(t, FLIP, 1.7, 0.55);
      const hq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05 + Math.sin(t * 0.8) * 0.02, Math.sin(t * 0.6) * 0.08 + flip * Math.PI + out * 6, Math.sin(t * 0.5) * 0.015));
      if (t < S.four) { // over-the-shoulder: rise straight out of the screen, still facing the viewer
        const n = new THREE.Vector3(0, 0, 1).applyQuaternion(ph.quaternion), up = new THREE.Vector3(0, 1, 0).applyQuaternion(ph.quaternion);
        rp.position.copy(ph.position).addScaledVector(n, 0.07 * k).addScaledVector(up, 0.27 * k); rp.quaternion.copy(ph.quaternion);
      } else { rp.position.copy(heroP.clone().lerp(ph.position, out)); rp.quaternion.copy(hq); }
      rp.scale.setScalar(Math.max(0.001, (t < S.four ? M.lerp(0.4, 0.75, k) : 1) * (1 - out)));
    } else if (t >= S.next - 0.1) {
      vis = true; const k = M.inOutQuint(M.seg(t, S.next - 0.1, S.next + 0.65));
      rp.position.copy(ph.position.clone().lerp(heroP, k)); rp.position.y += Math.sin(k * Math.PI) * 0.12;
      rp.quaternion.copy(ph.quaternion).slerp(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05, Math.sin(t * 0.6) * 0.08 + (1 - k) * 2 * Math.PI, 0)), k); rp.scale.setScalar(Math.max(0.001, M.lerp(0.25, 1, k)));
    }
    rp.visible = vis;
    // ---- bunny
    const bn = L.bunny, bt = t - S.fix - 0.08;
    if (bt < 0) bn.visible = false; else {
      bn.visible = true; const k = M.clamp(bt / 0.55); const p1 = new THREE.Vector3(0.36, 0.665, -0.47);
      const p = ph.position.clone().lerp(p1, M.outCubic(k)); p.y += Math.sin(k * Math.PI) * 0.28; bn.position.copy(p);
      bn.scale.setScalar(Math.max(0.001, 0.55 * Math.min(1, M.spring(t, S.fix + 0.08, 2.4, 0.45)))); bn.rotation.set(0, -0.5 + Math.sin(t * 1.3) * 0.15, 0);
      bunnyPose(bn, { hop: t > S.holes && t < 16.2 ? (t - S.holes) / 0.6 : 0.99, height: 0.07, earFlop: k < 1 ? 1 - k : 0.1, headTilt: t > S.card ? -22 : 0, look: t > S.holes ? Math.sin(t * 2) * 30 : -10 });
    }
    L.burst.set(t, S.fix + 0.04, ph.position.clone().add(new THREE.Vector3(0, 0.05, 0.05)));
    // ---- floating Curio card
    const cd = L.card; const ck = M.inOutQuint(M.seg(t, S.card - 0.05, S.card + 0.55)), cOut = M.inExpo(M.seg(t, 14.15, 14.45));
    cd.visible = t > S.card - 0.05 && t < 14.5;
    if (cd.visible) { const hero = new THREE.Vector3(0.03, 1.1, -0.36), hq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.04 + Math.sin(t * 0.8) * 0.02, Math.sin(t * 0.6) * 0.07, 0));
      cd.position.copy(ph.position).lerp(hero, ck); cd.position.y += Math.sin(ck * Math.PI) * 0.1; cd.quaternion.copy(ph.quaternion).slerp(hq, ck); cd.scale.setScalar(Math.max(0.001, M.lerp(0.37, 1.22, ck) * (1 - cOut))); }
    // ---- rabbit-hole tiles burst into an orbit around the character
    const ctr = new THREE.Vector3(0.1, 1.12, -0.6), tb = t - 14.2;
    L.tiles.forEach((c, i) => {
      c.visible = tb > 0 && t < S.next + 0.2; if (!c.visible) return;
      const k = M.outBack(M.clamp((tb - i * 0.035) / 0.7), 1.3), gone = M.inCubic(M.seg(t, 16.0, S.next + 0.15));
      const spin = tb * 0.55 + M.inOutSine(M.seg(t, 14.9, 15.9)) * 2.2;
      const a = i / L.tiles.length * Math.PI * 2 + spin, r = 0.9 * k * (1 - gone);
      const p = new THREE.Vector3(ctr.x + Math.sin(a) * r, ctr.y - Math.cos(a) * 0.3 * k + Math.sin(a * 2 + t) * 0.05 + (i % 2 ? 0.08 : -0.05) * k, ctr.z + Math.cos(a) * r * 0.85);
      const src = new THREE.Vector3(0.03, 1.1, -0.36); c.position.copy(src.lerp(p, Math.min(1, k)));
      c.lookAt(0.1 + Math.sin(a) * 1.2, 1.3, 3.2); c.rotateZ(Math.sin(t + i) * 0.1); c.rotateY(Math.sin(t * 1.3 + i) * 0.25);
      c.scale.setScalar(Math.max(0.001, Math.min(1, k) * (1 - gone)));
    });
    // ---- camera
    if (t < S.four) { // over the shoulder onto the phone, then tilt up with the rising report
      const k = M.inOutSine(M.seg(t, 1.6, 2.9));
      camFrom(E, [M.lerp(0.76, 0.8, k), M.lerp(1.55, 1.62, k), M.lerp(-1.1, -1.05, k)], [M.lerp(0.1, 0.06, k), M.lerp(0.86, 1.02, k), M.lerp(-0.76, -0.6, k)], M.lerp(22, 30, k), null, 0.012); E.cam.roll = 0.84; E.cam.focus = E.cam.pos.distanceTo(new THREE.Vector3(0.1, 0.86, -0.76)); handheld(E, t, 0.7, 1);
    } else if (t < S.fix) {
      const k = M.inOutSine(M.seg(t, S.four, S.fix)), sh = M.shake(t, STAMP0, 0.45, 14) * 0.03;
      camFrom(E, [M.lerp(0.36, 0.28, k) + sh, 1.18 + sh * 0.5, M.lerp(1.15, 0.95, k)], [-0.02, 1.08, -0.5], 34, null, 0.014); E.cam.focus = E.cam.pos.distanceTo(heroP); handheld(E, t, 0.6, 2);
    } else if (t < S.thumb) {
      const k = M.inOutSine(M.seg(t, S.fix, S.thumb)); camFrom(E, [M.lerp(1.4, 1.15, k), M.lerp(1.62, 1.5, k), M.lerp(1.8, 1.5, k)], [0.22, 0.86, -0.7], 34, null, 0.018); handheld(E, t, 0.8, 4);
    } else if (t < S.card) {
      const k = M.inOutSine(M.seg(t, S.thumb, S.card)); camFrom(E, [M.lerp(0.76, 0.72, k), M.lerp(1.55, 1.5, k), M.lerp(-1.1, -1.06, k)], [0.1, 0.86, -0.76], M.lerp(22, 19, k), null, 0.012); E.cam.roll = 0.84; E.cam.focus = E.cam.pos.distanceTo(new THREE.Vector3(0.1, 0.86, -0.76)); handheld(E, t, 0.6, 5);
    } else if (t < 14.2) {
      const k = M.inOutSine(M.seg(t, S.card, 14.2)); const cp = L.card.position;
      camFrom(E, [M.lerp(0.24, 0.18, k), M.lerp(1.14, 1.1, k), M.lerp(1.28, 1.12, k)], [cp.x, cp.y - 0.12, cp.z - 0.3], 34, null, 0.016); E.cam.focus = E.cam.pos.distanceTo(cp); handheld(E, t, 0.6, 6);
    } else if (t < S.next) {
      const k = M.inOutQuint(M.seg(t, 14.15, 15.2)), o = M.inOutSine(M.seg(t, 14.6, S.next)) * 0.9;
      const r = M.lerp(1.7, 3.1, k), a = 0.3 - o * 0.7; camFrom(E, [ctr.x + Math.sin(a) * r, M.lerp(1.2, 1.75, k), ctr.z + Math.cos(a) * r], [ctr.x, M.lerp(1.1, 1.0, k), ctr.z - 0.2], 36, null, 0.018); handheld(E, t, 0.5, 7);
    } else {
      const k = M.inOutSine(M.seg(t, S.next, S.end)); camFrom(E, [M.lerp(0.32, 0.26, k), 1.18, M.lerp(1.12, 0.98, k)], [-0.02, 1.08, -0.5], 34, null, 0.014); E.cam.focus = E.cam.pos.distanceTo(heroP); handheld(E, t, 0.6, 8);
    }
  },

  post(t, E) { const f = E.finish.uniforms; f.vig.value = 0.36; f.grain.value = 0.022; f.lift.value.set(0.015, 0.01, 0.035); },

  async overlay(g, t, E) {
    const ws = (a, b) => W.filter(w => w.i >= a && w.i <= b);
    caption(g, t, { words: ws(0, 8), y: 285, size: 66, hi: ["report"], out: 2.85, maxW: 900 });
    const low = (a, b, hi, y = 1500, out) => caption(g, t, { words: ws(a, b), y, size: 56, hi, out, scrim: true });
    low(9, 12, ["four"], 1560); low(13, 18, ["nothing"], 1560, 6.9);
    low(19, 21, ["curio"], 1420); low(22, 23, ["thumb"], 1500, 9.24); low(24, 25, ["swipe"], 1500, 10.1);
    low(26, 32, ["true"], 1560, 12.45); low(33, 36, ["minute"], 1560, 13.8);
    low(37, 40, ["rabbit", "hole"], 1500, 14.92); low(41, 43, ["any"], 1500, 16.3);
    low(44, 50, ["something"], 1560, 18.7);
    // pink ring on the thumb ("same thumb")
    if (t > 8.6 && t < 9.4) { const hp = E.project(L.fig.userData.J.handR.getWorldPosition(new THREE.Vector3())); const k = M.seg(t, 8.6, 9.4);
      g.save(); g.globalAlpha = Math.sin(k * Math.PI); g.strokeStyle = COL.pink; g.lineWidth = 7; g.shadowColor = COL.pink; g.shadowBlur = 24; g.beginPath(); g.arc(hp.x, hp.y, 70 + 30 * k, 0, 7); g.stroke(); g.restore(); }
    chip(g, t, { x: 64, y: 470, label: "Average card", value: "20–45 sec", t0: 12.55, t1: S.holes - 0.1, accent: COL.pink });
    stamp(g, t, { x: 540, y: 1180, t0: STAMP0, t1: S.fix - 0.1, text: "NOTHING TO SHOW", rot: -8, size: 86 });
    stamp(g, t, { x: 540, y: 1300, t0: STAMP1, t1: S.end - 0.05, text: "SOMETHING TO SHOW", color: COL.pink, rot: -7, size: 76 });
    flash(g, t, S.fix - 0.02, 0.35, "203,184,255", 0.55);
    endCard(g, t, { t0: S.end, headline: ["Turn scrolling", "into ", "learning."], sub: "Free on the App Store", wipeFrom: { x: 520, y: 760 } });
  },

  audioPlan() {
    const vo = SEGS.map(s => ({ src: "vo/ad2.wav", from: s.from, to: s.to, at: s.at, gain: 0 }));
    const sfx = [
      { name: "night", at: 0, gain: -27, dur: 18.9, loop: true, fade: 0.4 }, { name: "buzz", at: 0.2, gain: -9 }, { name: "notif", at: 0.3, gain: -14 },
      ...[0.9, 1.5].map(a => ({ name: "swipe", at: a, gain: -26 })), { name: "whoosh", at: 1.6, gain: -14 }, { name: "counter", at: 3.0, gain: -16 },
      { name: "paper", at: FLIP - 0.05, gain: -11 }, { name: "whoosh", at: FLIP, gain: -18 }, { name: "stamp", at: STAMP0, gain: -5 }, { name: "thud", at: STAMP0, gain: -9 },
      { name: "whoosh", at: S.fix - 0.1, gain: -14 }, { name: "sparkle", at: S.fix + 0.05, gain: -9 }, { name: "pop", at: S.fix + 0.15, gain: -10 },
      { name: "swipe", at: SWIPE - 0.12, gain: -11 }, { name: "tap", at: 8.62, gain: -16 }, { name: "whoosh", at: S.card - 0.05, gain: -14 }, { name: "swipe", at: 12.63, gain: -15 }, { name: "pop", at: 12.55, gain: -20 },
      { name: "swipe", at: S.holes, gain: -16 }, { name: "whoosh_big", at: 14.15, gain: -9 }, { name: "sparkle", at: 14.25, gain: -12 }, { name: "riser", at: 14.6, gain: -17 }, { name: "whoosh", at: 15.0, gain: -16 },
      { name: "whoosh", at: 16.05, gain: -15 }, { name: "pop", at: S.next + 0.3, gain: -14 }, { name: "counter", at: 16.8, gain: -15 },
      { name: "stamp", at: STAMP1, gain: -7 }, { name: "sparkle", at: STAMP1 + 0.05, gain: -14 },
      { name: "whoosh_big", at: S.end - 0.05, gain: -12 }, { name: "sparkle", at: S.end + 0.25, gain: -13 }, { name: "pop", at: S.end + 0.95, gain: -14 },
    ];
    return { T, vo, music: { name: "bed_ad2", gain: -21, at: 0 }, sfx };
  },
};
