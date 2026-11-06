// AD1 "Two hours": you remember every word of a 2009 song, but nothing from last night's scroll. Curio fixes that.
import * as THREE from "three";
import * as M from "/engine/motion.js";
import { LI, makeFigure, setPose, setFace, mixPose, makeBunny, bunnyPose, makePhone, makeCard, mesh, glow } from "/engine/toys.js";
import { makeBedroom, makeDining, makeTunnel } from "/engine/sets.js";
import { caption, chip, stamp, bubble, endCard, loadEndArt, flash, placeWords, rr, COL, FONTS } from "/engine/ui.js";
import { clipURL, drawFeed, feedColor, glitch, POSE, talk, camFrom, handheld } from "/engine/common.js";

const D = Math.PI / 180;
const SEGS = [
  { from: 0.0, to: 3.32, at: 0.0 }, { from: 3.32, to: 5.58, at: 3.46 }, { from: 5.58, to: 7.15, at: 5.89 }, { from: 7.15, to: 8.79, at: 8.12 },
  { from: 8.79, to: 12.5, at: 9.89 }, { from: 12.5, to: 16.5, at: 13.64 }, { from: 16.5, to: 18.6, at: 18.04 }, { from: 18.6, to: 21.17, at: 20.26 },
];
const T = 24.2;
const S = { sing: 0, clock: 3.42, blank: 5.85, fix: 8.15, card: 9.9, deeper: 13.6, dive: 16.3, morning: 17.9, end: 20.2 };
const STAMP0 = 7.32, STAMP1 = 19.35, TAP = 14.73;
const DINING_OFF = new THREE.Vector3(40, 0, 0), TUNNEL_OFF = new THREE.Vector3(-60, 0, 0);

let W = [], L = {}; // placed words, scene refs

function burst(n, color) {
  const im = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.014, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(3.2) }), n);
  im.frustumCulled = false; const dirs = [];
  for (let i = 0; i < n; i++) { const a = i * 2.39996, z = 1 - 2 * ((i + 0.5) / n); const r = Math.sqrt(1 - z * z); dirs.push(new THREE.Vector3(Math.cos(a) * r, z * 0.8 + 0.35, Math.sin(a) * r).multiplyScalar(0.25 + ((i * 37) % 11) / 18)); }
  return { im, dirs, set(t, t0, o) {
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(); const x = t - t0;
    for (let i = 0; i < n; i++) { const k = x < 0 ? 0 : 1 - Math.exp(-x * 4); const sc = x < 0 ? 0 : Math.max(0, 1 - x / 1.1) * (0.6 + (i % 3) * 0.4);
      p.copy(o).addScaledVector(dirs[i], k); p.y -= x > 0 ? 0.25 * x * x : 0; q.setFromEuler(new THREE.Euler(x * 6 + i, x * 4, 0)); m4.compose(p, q, s.set(sc, sc, sc)); im.setMatrixAt(i, m4); }
    im.instanceMatrix.needsUpdate = true; } };
}

export default {
  T, fps: 30, shutter: 0.5, fonts: FONTS,
  async setup(E) {
    const { scene } = E;
    const words = (await (await fetch("/vo/ad1-words.json")).json()).words;
    W = placeWords(words, SEGS);
    await loadEndArt(E);
    L.screen = E.canvasTex(660, 1434);
    // bedroom + figure + phone + bunny + floating card
    L.bed = makeBedroom(E, { clock: "2:07" }); scene.add(L.bed.root);
    L.fig = makeFigure({ hoodie: "#6d55d8", hoodie2: "#5a45bd" }); L.bed.root.add(L.fig);
    const J = L.fig.userData.J;
    for (const sx of [-1, 1]) { const bud = mesh(new THREE.CapsuleGeometry(0.018, 0.02, 4, 8), new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.25, clearcoat: 1 }), sx * 0.2, -0.01, 0.0); bud.rotation.z = Math.PI / 2; J.head.add(bud); (L.buds ||= []).push(bud); }
    L.phone = makePhone(L.screen.tex); L.bed.root.add(L.phone);
    L.bunny = makeBunny(); L.bed.root.add(L.bunny);
    L.card = makeCard(L.screen.tex, 0.25, 0.543, 0.022); L.bed.root.add(L.card);
    L.burst = burst(46, "#ffd6f5"); L.bed.root.add(L.burst.im);
    // morning dining
    L.din = makeDining(E, { mode: "morning", seats: [196, 148] }); L.din.root.position.copy(DINING_OFF); scene.add(L.din.root);
    L.figB = makeFigure({ hoodie: "#6d55d8", hoodie2: "#5a45bd" }); L.din.root.add(L.figB);
    L.friend = makeFigure({ skin: "#8a5a3c", hair: "#1b120e", brow: "#1b120e", hairStyle: "bun", top: "sweater", hoodie: "#ffb35c", hoodie2: "#ff9a3c", pants: "#3b4a7a", shoes: "#ffffff", sole: "#2fb7a5" });
    L.din.root.add(L.friend);
    L.bunnyD = makeBunny(); L.bunnyD.scale.setScalar(0.62); L.din.root.add(L.bunnyD);
    // tunnel of real Curio cards
    const plates = ["01_card_survival", "02_curio_ai", "04_card_science", "05_discover", "06_scenario", "07_card_horror", "08_originals", "09_eye_comfort"];
    const texs = await Promise.all(plates.map(p => E.texReady(`/assets/${p}.png`)));
    const extra = await Promise.all([[`card-read`, 1], [`card-read`, 6], [`card-read`, 9.5], [`explain-deeper`, 8], [`discover-rabbit-hole`, 2], [`discover-rabbit-hole`, 21]].map(([c, s]) => E.texReady(clipURL(c, s))));
    L.tun = makeTunnel(E, [...texs, ...extra]); L.tun.root.position.copy(TUNNEL_OFF); scene.add(L.tun.root);
    L.tunCard = makeCard(L.screen.tex, 0.25, 0.543, 0.022); L.tun.root.add(L.tunCard);
    L.bunnyT = makeBunny(); L.tun.root.add(L.bunnyT);
    L.fogNight = new THREE.FogExp2("#141640", 0.07); L.fogTun = new THREE.FogExp2("#2a0f45", 0.075);
  },

  // ---------------------------------------------------------------- phone screen content
  async prepare(t, E) {
    const { ctx: x, canvas } = L.screen, w = canvas.width, h = canvas.height;
    if (t < S.clock) { // idle phone face-down on the duvet: lock screen
      x.fillStyle = "#0a0a14"; x.fillRect(0, 0, w, h);
    } else if (t < S.fix) {
      drawFeed(x, w, h, t, 3.6, 0.5, 0.2);
      const gk = M.seg(t, STAMP0 - 0.05, STAMP0 + 0.5); if (gk > 0) glitch(x, w, h, gk, 3);
    } else if (t < S.deeper) {
      const im = await E.img(clipURL("card-read", t - 5.52)); x.drawImage(im, 0, 0, w, h);
      const k = M.seg(t, S.fix, S.fix + 0.6); if (k < 1) { x.fillStyle = `rgba(123,92,255,${0.85 * (1 - M.outCubic(k))})`; x.fillRect(0, 0, w, h); }
    } else {
      const cT = t - 11.88; const im = await E.img(clipURL("explain-deeper", Math.max(1.0, cT)));
      const sw = M.inOutQuint(M.seg(t, S.deeper, S.deeper + 0.32));
      if (sw < 1) { const prev = await E.img(clipURL("card-read", S.deeper - 5.52)); x.drawImage(prev, 0, -sw * h, w, h); x.drawImage(im, 0, (1 - sw) * h, w, h); }
      else x.drawImage(im, 0, 0, w, h);
      // tap ripple on "Explain deeper"
      const rk = M.seg(t, TAP - 0.05, TAP + 0.5); if (rk > 0 && rk < 1) { x.save(); x.globalAlpha = 1 - rk; x.fillStyle = "rgba(255,255,255,0.55)"; x.beginPath(); x.arc(w * 0.13, h * 0.826, 20 + rk * 90, 0, 7); x.fill(); x.restore(); }
    }
    L.screen.tex.needsUpdate = true;
  },

  update(t, E) {
    const { scene } = E;
    const inBed = t < S.dive, inTun = t >= S.dive && t < S.morning, inDin = t >= S.morning;
    L.bed.root.visible = inBed; L.tun.root.visible = inTun; L.din.root.visible = inDin;
    scene.fog = inBed ? L.fogNight : inTun ? L.fogTun : null;
    E.clear = inTun ? 0x2a0f45 : inBed ? 0x141640 : 0xf1c7a6;
    E.bloom.strength = inTun ? 0.9 : inBed ? 0.45 : 0.3; E.bloom.threshold = inDin ? 0.95 : inTun ? 0.85 : 0.92;
    if (inBed) bedroom(t, E); else if (inTun) tunnel(t, E); else morning(t, E);
  },

  post(t, E) {
    const f = E.finish.uniforms; f.vig.value = t < S.morning ? 0.38 : 0.22; f.grain.value = 0.022;
    f.lift.value.set(t < S.morning ? 0.015 : 0.02, t < S.morning ? 0.01 : 0.012, t < S.morning ? 0.035 : 0.0);
  },

  async overlay(g, t, E) {
    const ws = (a, b) => W.filter(w => w.i >= a && w.i <= b);
    // hook (top) with "two thousand nine." shown as 2009.
    const hook = ws(0, 11).map(w => ({ ...w })); const iTwo = hook.findIndex(w => /^two$/i.test(w.w));
    if (iTwo >= 0) { const merged = { ...hook[iTwo], w: "2009.", e: hook[iTwo + 2].e }; hook.splice(iTwo, 3, merged); }
    caption(g, t, { words: hook, y: 285, size: 66, hi: ["2009"], out: 3.36, maxW: 900 });
    const low = (a, b, hi, y = 1420, out) => caption(g, t, { words: ws(a, b), y, size: 54, hi, out, scrim: true });
    low(12, 18, ["hours"]); low(19, 23, ["one"], 1420, 8.05);
    low(24, 26, ["curio"], 1420); low(27, 28, [], 1560, 10.7); low(29, 37, ["keeping"], 1560);
    low(38, 38, [], 1560, 14.55); low(39, 41, ["explain", "deeper"], 1560, 16.1); low(42, 47, ["rabbit", "hole"], 1420, 17.75);
    low(48, 52, ["remember"], 1500, 20.1);
    // music notes from the earbuds in the opening
    if (t < S.clock + 0.2) {
      const hp = E.project(L.fig.userData.J.head.getWorldPosition(new THREE.Vector3()));
      for (let i = 0; i < 7; i++) { const t0 = i * 0.42, x = (t - t0) / 1.8; if (x < 0 || x > 1) continue;
        g.save(); g.globalAlpha = Math.sin(x * Math.PI) * 0.95; const nx = hp.x + (i % 2 ? 1 : -1) * (150 + x * 90) + Math.sin(x * 6 + i) * 22, ny = hp.y - 120 - x * 360;
        g.translate(nx, ny); g.rotate(Math.sin(x * 5 + i) * 0.3); g.fillStyle = i % 3 ? "#ffffff" : COL.pink; g.shadowColor = "rgba(255,138,216,0.8)"; g.shadowBlur = 20;
        g.beginPath(); g.ellipse(0, 0, 17, 12, -0.4, 0, 7); g.fill(); g.fillRect(13, -58, 6, 58); if (i % 2) { g.beginPath(); g.ellipse(46, -8, 17, 12, -0.4, 0, 7); g.fill(); g.fillRect(59, -66, 6, 58); g.fillRect(13, -64, 52, 10); } else { g.beginPath(); g.moveTo(19, -58); g.quadraticCurveTo(40, -40, 34, -20); g.lineTo(30, -24); g.quadraticCurveTo(32, -38, 19, -46); g.fill(); }
        g.restore(); }
    }
    chip(g, t, { x: 64, y: 470, label: "Lyrics remembered", value: "100%", t0: 1.15, t1: S.clock - 0.15, accent: COL.pink });
    const mins = Math.round(124 * M.outCubic(M.seg(t, 3.75, 5.05)));
    chip(g, t, { x: 64, y: 470, label: "Screen time tonight", value: `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`, t0: 3.7, t1: S.fix - 0.3, accent: "#8fa6ff" });
    // empty thought bubble
    if (t > 6.15 && t < STAMP0 + 0.1) {
      const hp = E.project(L.fig.userData.J.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.33, 0)));
      const k = M.spring(t, 6.15, 2.6, 0.5), out = M.seg(t, STAMP0 - 0.05, STAMP0 + 0.08); const s = Math.max(0, k) * (1 - out);
      g.save(); g.translate(Math.min(760, hp.x + 150), Math.max(330, hp.y - 60)); g.scale(s, s); g.fillStyle = "rgba(255,255,255,0.96)"; g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 30;
      g.beginPath(); g.ellipse(0, 0, 150, 98, 0, 0, 7); g.fill(); g.beginPath(); g.arc(-120, 100, 24, 0, 7); g.fill(); g.beginPath(); g.arc(-160, 140, 13, 0, 7); g.fill();
      g.shadowBlur = 0; g.fillStyle = "#2a2140"; for (let i = 0; i < 3; i++) { const a = M.seg(t, 6.35 + i * 0.22, 6.5 + i * 0.22); g.globalAlpha = a * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 9 - i))); g.beginPath(); g.arc(-50 + i * 50, 4, 13, 0, 7); g.fill(); }
      g.restore();
    }
    stamp(g, t, { x: 540, y: 1180, t0: STAMP0, t1: S.fix - 0.12, text: "0 REMEMBERED", sub: "2 HOURS · 0 THINGS", rot: -8, size: 98 });
    // morning: the story he kept
    if (t >= S.morning) {
      const hp = E.project(L.figB.userData.J.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.3, 0)));
      bubble(g, t, { x: Math.min(820, Math.max(300, hp.x + 60)), y: hp.y - 40, t0: 18.25, t1: S.end, text: "Did you know Australia once lost a war… to birds?", w: 600, size: 42 });
      stamp(g, t, { x: 560, y: 1290, t0: STAMP1, t1: S.end - 0.05, text: "REMEMBERED", color: COL.pink, rot: -7, size: 96 });
    }
    flash(g, t, S.morning - 0.18, 0.5, "255,236,250", 0.95);
    flash(g, t, S.fix - 0.02, 0.35, "203,184,255", 0.55);
    endCard(g, t, { t0: S.end, headline: ["Turn scrolling", "into ", "learning."], sub: "Free on the App Store", wipeFrom: { x: 540, y: 760 } });
  },

  audioPlan() {
    const vo = SEGS.map(s => ({ src: "vo/ad1.wav", from: s.from, to: s.to, at: s.at, gain: 0 }));
    const sfx = [
      { name: "night", at: 0, gain: -26, dur: 16.3, loop: true, fade: 0.4 }, { name: "earbuds", at: 0.0, gain: -15, dur: 3.42, fade: 0.08 },
      { name: "whoosh", at: 3.3, gain: -16 }, { name: "counter", at: 3.75, gain: -20 },
      ...[3.6, 4.1, 4.6, 5.1, 5.6, 6.1, 6.6].map(a => ({ name: "swipe", at: a, gain: -26 })),
      { name: "pop", at: 6.15, gain: -16 }, { name: "stamp", at: STAMP0, gain: -5 }, { name: "thud", at: STAMP0, gain: -9 }, { name: "glitch", at: STAMP0 + 0.05, gain: -16 },
      { name: "sparkle", at: S.fix + 0.05, gain: -9 }, { name: "pop", at: S.fix + 0.15, gain: -10 },
      { name: "whoosh", at: S.card - 0.05, gain: -14 }, { name: "swipe", at: 10.12, gain: -14 }, { name: "pop", at: 11.3, gain: -20 }, { name: "swipe", at: 13.37, gain: -15 },
      { name: "swipe", at: S.deeper, gain: -16 }, { name: "tap", at: TAP - 0.02, gain: -9 }, { name: "whoosh", at: 14.9, gain: -18 },
      { name: "riser", at: 15.3, gain: -16 }, { name: "dive", at: 16.0, gain: -6 }, { name: "whoosh_big", at: 17.55, gain: -10 }, { name: "sparkle", at: 17.8, gain: -14 },
      { name: "dinner", at: S.morning, gain: -27, dur: 2.4, fade: 0.4 }, { name: "pop", at: 18.25, gain: -14 },
      { name: "stamp", at: STAMP1, gain: -7 }, { name: "sparkle", at: STAMP1 + 0.05, gain: -14 },
      { name: "whoosh_big", at: S.end - 0.05, gain: -12 }, { name: "sparkle", at: S.end + 0.25, gain: -13 }, { name: "pop", at: S.end + 0.95, gain: -14 },
    ];
    return { T, vo, music: { name: "bed_ad1", gain: -21, at: 0 }, sfx };
  },
};

// ---------------------------------------------------------------- shots
function bedroom(t, E) {
  const R = L.bed.R, fig = L.fig, J = fig.userData.J;
  const root = [0.1, 0.09, -1.05, 0];
  // ---- figure pose + face
  let pose, face = {};
  const blinks = [1.9, 4.4, 9.2, 12.1, 14.9];
  if (t < S.clock) {
    const beat = t * 2.1; pose = JSON.parse(JSON.stringify(POSE.bedSing));
    pose.head = [-6 + Math.sin(beat * Math.PI) * 7, Math.sin(beat * Math.PI * 0.5) * 9, Math.sin(beat * Math.PI * 0.5) * 6]; pose.spine = [-10 + Math.sin(beat * Math.PI) * 2.5, 0, Math.sin(beat * Math.PI * 0.5) * 3];
    pose.shL = [-6, 0, 22 + Math.sin(beat * Math.PI) * 6]; pose.elL = [-40 - Math.sin(beat * Math.PI) * 18, 0, 0];
    pose.shR = [-52, 0, 30]; pose.elR = [-118, 30, 0];
    face = { mouth: Math.sin(beat * Math.PI * 2) > 0 ? "o" : "grin", blink: 0.14, brows: -8, browY: 3, mouthScale: 1.05 };
  } else if (t < S.blank) {
    pose = POSE.bedPhone; face = { mouth: "flat", blink: M.blink(t, blinks), look: [0, -8], brows: 4 };
  } else if (t < S.fix) {
    const k = M.inOut(M.seg(t, 5.95, 6.6)); pose = mixPose(POSE.bedPhone, POSE.bedBlank, k);
    face = { mouth: t > STAMP0 ? "frown" : "flat", blink: M.blink(t, [6.9]), look: [0, 6 * k], brows: 10 + 6 * k, browY: 2 * k, eyeScale: 1 + 0.12 * k };
    pose = JSON.parse(JSON.stringify(pose)); pose.head = [pose.head[0] - 10 * k, 4 * k, 3 * k];
  } else {
    const k = M.inOut(M.seg(t, S.fix, S.fix + 0.5)); pose = mixPose(POSE.bedBlank, POSE.bedPhone, k);
    pose = JSON.parse(JSON.stringify(pose)); pose.head = [pose.head[0] - 10 * (t < S.card + 0.4 ? 1 : 0.3), 0, 0];
    face = t < S.fix + 0.55 ? { mouth: "o", blink: 1, eyeScale: 1.2, brows: -6, browY: 6, look: [0, 4] } : { mouth: "smile", blink: M.blink(t, blinks), brows: -4, browY: 3, look: [0, t < S.card ? 0 : 4] };
  }
  pose.root = root; setPose(fig, pose); setFace(fig, face);
  L.buds.forEach(b => (b.visible = t < S.clock));
  // ---- phone: in hands from the clock shot on; face-down on the duvet in the opening
  const ph = L.phone;
  if (t < S.clock) { ph.position.set(0.42, 0.685, -0.55); ph.rotation.set(-Math.PI / 2, 0, 0.5); }
  else {
    const lower = t > S.blank ? M.inOut(M.seg(t, 5.95, 6.6)) * (1 - M.inOut(M.seg(t, S.fix, S.fix + 0.5))) : 0;
    ph.position.set(0.1, 0.86 - lower * 0.1, -0.76 + lower * 0.02 + M.noise(t * 3, 4) * 0.002); ph.rotation.set((50 + lower * 35) * D, Math.PI, M.noise(t * 2, 2) * 0.03);
  }
  // phone glow on the face
  const n = new THREE.Vector3(0, 0, 1).applyEuler(ph.rotation); R.phoneLight.position.copy(ph.position).addScaledVector(n, 0.24);
  const scrOn = t >= S.clock; const col = t < S.fix ? feedColor(t, 3.6, 0.5) : "#b79cff";
  R.phoneLight.color.set(col).lerp(new THREE.Color("#ffffff"), 0.45);
  const dead = t > STAMP0 && t < S.fix ? 1 - M.seg(t, STAMP0, STAMP0 + 0.4) : 1;
  R.phoneLight.intensity = LI * (scrOn ? (t < S.fix ? 0.06 : 0.08 + 0.3 * Math.exp(-(t - S.fix) * 2.5)) * dead : 0);
  ph.userData.screenMat.color.setScalar(scrOn ? 0.95 * Math.max(0.05, dead) : 0.15);
  // room mood: cold & blue until Curio, then warm lilac
  const warm = M.smooth(M.seg(t, S.fix, S.fix + 1.0));
  R.rim.color.set("#c49bff").lerp(new THREE.Color("#ff8ad8"), warm); R.rim.intensity = LI * (2.0 + 1.6 * warm);
  R.lampLight.intensity = LI * (t < S.clock ? 1.2 : 0.9 + 0.4 * warm);
  R.hemi.intensity = LI * (0.8 + 0.25 * warm);
  // ---- bunny pops out of the phone and lands on the duvet
  const bn = L.bunny; const bt = t - S.fix - 0.08;
  if (bt < 0) bn.visible = false;
  else {
    bn.visible = true; const k = M.clamp(bt / 0.55);
    const p0 = ph.position.clone(), p1 = new THREE.Vector3(0.36, 0.665, -0.47);
    const p = p0.clone().lerp(p1, M.outCubic(k)); p.y += Math.sin(k * Math.PI) * 0.28;
    bn.position.copy(p); const sc = 0.55 * Math.min(1, M.spring(t, S.fix + 0.08, 2.4, 0.45)); bn.scale.setScalar(Math.max(0.001, sc));
    bn.rotation.set(0, -0.5 + (t > S.card ? Math.sin(t * 1.3) * 0.15 : 0), 0);
    const hopT = t > S.fix + 0.65 ? ((t - S.fix - 0.65) / 0.9) : 0.99; bunnyPose(bn, { hop: t > 11.0 && t < 12.2 ? hopT : 0.99, height: 0.06, earFlop: k < 1 ? 1 - k : Math.max(0, Math.sin(t * 3) * 0.2), headTilt: t > S.card ? -22 : 0, look: t > S.card ? -10 : 0 });
  }
  L.burst.set(t, S.fix + 0.04, ph.position.clone().add(new THREE.Vector3(0, 0.05, 0.05)));
  // ---- floating card rises out of the phone
  const card = L.card; const ck = M.inOutQuint(M.seg(t, S.card - 0.05, S.card + 0.55));
  card.visible = t > S.card - 0.05;
  if (card.visible) {
    const from = { p: ph.position.clone(), q: ph.quaternion.clone(), s: 0.37 };
    const hero = new THREE.Vector3(0.03, 1.1, -0.36), heroQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.04 + Math.sin(t * 0.8) * 0.02, Math.sin(t * 0.6) * 0.07, Math.sin(t * 0.5) * 0.012));
    card.position.copy(from.p).lerp(hero, ck); card.position.y += Math.sin(ck * Math.PI) * 0.1 + Math.sin(t * 1.4) * 0.006;
    card.quaternion.copy(from.q).slerp(heroQ, ck); card.scale.setScalar(M.lerp(from.s, 1.22, ck));
  }
  // ---- camera
  if (t < S.clock) {
    const k = M.inOutSine(M.seg(t, 0, S.clock));
    camFrom(E, [M.lerp(0.98, 0.78, k), M.lerp(1.58, 1.48, k), M.lerp(1.6, 1.15, k)], [0.1, 0.98, -1.0], 35, null, 0.02); handheld(E, t, 1, 1);
  } else if (t < S.blank) {
    const k = M.inOutQuint(M.seg(t, 4.1, 4.95));
    const pos = [M.lerp(1.16, 0.98, k), M.lerp(0.74, 1.42, k), M.lerp(-0.5, 1.15, k)];
    const tgt = [M.lerp(0.95, 0.1, k), M.lerp(0.575, 1.0, k), M.lerp(-1.21, -1.05, k)];
    camFrom(E, pos, tgt, M.lerp(28, 34, k), null, M.lerp(0.008, 0.02, k));
    E.cam.focus = M.lerp(0.78, 2.45, M.inOut(M.seg(t, 4.25, 4.95))); handheld(E, t, 0.8, 2);
  } else if (t < S.fix) {
    const k = M.inOutSine(M.seg(t, S.blank, S.fix)), sh = M.shake(t, STAMP0, 0.45, 14) * 0.04;
    camFrom(E, [0.3 + sh, 1.3 + sh * 0.6, M.lerp(0.4, 0.15, k)], [0.1, 1.12, -1.12], 32, null, 0.012); handheld(E, t, 0.8, 3);
  } else if (t < S.card) {
    const k = M.inOutSine(M.seg(t, S.fix, S.card));
    camFrom(E, [M.lerp(1.4, 1.15, k), M.lerp(1.62, 1.5, k), M.lerp(1.8, 1.5, k)], [0.22, 0.86, -0.7], 34, null, 0.018); handheld(E, t, 0.8, 4);
  } else {
    const dive = M.inExpo(M.seg(t, 15.95, S.dive)), k = M.inOutSine(M.seg(t, S.card, 15.95));
    const cp = L.card.position;
    const pos = new THREE.Vector3(M.lerp(0.24, 0.16, k), M.lerp(1.14, 1.09, k), M.lerp(1.28, 1.08, k)).lerp(new THREE.Vector3(cp.x, cp.y, cp.z + 0.05), dive);
    camFrom(E, pos.toArray(), [cp.x, cp.y - 0.12 * (1 - dive) - 0.02 * dive, cp.z - 0.3], 34, pos.distanceTo(cp), 0.016 * (1 - dive)); handheld(E, t, 0.6 * (1 - dive), 5);
  }
}

function tunnel(t, E) {
  const R = L.tun.R, x = M.seg(t, S.dive, S.morning);
  const u = 0.004 + 0.42 * (0.55 * x + 0.45 * M.inOutSine(x)) * (1 + 0.2 * M.inExpo(x));
  const p = R.curve.getPointAt(u).add(TUNNEL_OFF), ahead = R.curve.getPointAt(Math.min(1, u + 0.02)).add(TUNNEL_OFF);
  camFrom(E, p.toArray(), ahead.toArray(), 52 + 18 * M.inExpo(x), null, 0); E.cam.roll = x * 1.6 + Math.sin(x * 5) * 0.1;
  // the card we dove into sits right in front of the lens at the start, then falls behind
  const p0 = R.curve.getPointAt(0.004), tan0 = R.curve.getTangentAt(0.004);
  L.tunCard.position.copy(p0).addScaledVector(tan0, 0.07); L.tunCard.lookAt(p0.clone().sub(tan0).add(new THREE.Vector3(0, -0.001, 0))); L.tunCard.rotateY(Math.PI);
  L.tunCard.position.y -= 0.0; L.tunCard.visible = x < 0.3;
  // bunny tumbling ahead
  const bu = Math.min(1, u + 0.035), bp = R.curve.getPointAt(bu); L.bunnyT.position.copy(bp).add(new THREE.Vector3(Math.sin(t * 3) * 0.06, -0.05 + Math.cos(t * 2.4) * 0.04, 0));
  L.bunnyT.rotation.set(t * 2.2, t * 1.1, t * 1.7); L.bunnyT.scale.setScalar(0.5); bunnyPose(L.bunnyT, { hop: 0.99, earFlop: 1 });
  R.cards.forEach(c => { const i = c.userData.i; c.quaternion.copy(c.userData.base); c.rotateZ(Math.sin(t * 0.9 + i) * 0.15); c.rotateY(Math.sin(t * 0.7 + i * 1.3) * 0.2); });
}

function morning(t, E) {
  const R = L.din.R; const seatA = R.seats[0], seatF = R.seats[1];
  const place = (fig, seat, pose) => { const a = seat.angle * D; pose.root = [Math.sin(a) * 0.98, -0.02, Math.cos(a) * 0.98, seat.angle + 180]; setPose(fig, pose); };
  const tk = talk(POSE.sitTalk, t, 1.1, 2); tk.head = [tk.head[0], tk.head[1] + 28, tk.head[2]];
  place(L.figB, seatA, tk); setFace(L.figB, { mouth: Math.sin(t * 13) > -0.2 ? "grin" : "o", brows: -6, browY: 4, blink: M.blink(t, [18.9]), look: [10, 0] });
  const lean = M.inOut(M.seg(t, 18.6, 19.2)); const fp = mixPose(POSE.sit, POSE.sitLean, lean); fp.head = [fp.head[0], -24, 0];
  place(L.friend, seatF, fp); setFace(L.friend, { mouth: lean > 0.5 ? "o" : "smile", eyeScale: 1 + 0.2 * lean, brows: -8 * lean, browY: 6 * lean, blink: M.blink(t, [18.4]), look: [-8, 0] });
  // bunny hopping on the table
  const bh = (t - 18.0) / 0.55; L.bunnyD.position.set(0.12 + Math.sin(t * 0.8) * 0.05, 0.65, 0.18); L.bunnyD.rotation.y = -0.6; bunnyPose(L.bunnyD, { hop: bh > 0 && bh < 3 ? bh : 0.99, height: 0.07, look: 20 });
  const k = M.inOutSine(M.seg(t, S.morning, S.end));
  const O = DINING_OFF;
  camFrom(E, [O.x + 0.05 + 0.1 * k, 1.62 - 0.06 * k, O.z + 3.2 - 0.35 * k], [O.x + 0.12, 0.86, O.z - 0.35], 37, null, 0.02); handheld(E, t, 0.6, 7);
}
