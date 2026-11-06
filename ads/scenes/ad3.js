// AD3 "Dinner": "Learn anything cool lately?" Three hundred videos, nothing to say. Curio: be the one with the story.
import * as THREE from "three";
import * as M from "/engine/motion.js";
import { LI, makeFigure, setPose, setFace, mixPose, makeBunny, bunnyPose, makePhone, makeCard, mesh } from "/engine/toys.js";
import { makeDining, makeSea, animateSea } from "/engine/sets.js";
import { caption, chip, stamp, bubble, endCard, loadEndArt, flash, placeWords, COL, FONTS } from "/engine/ui.js";
import { clipURL, drawFeedPost, POSE, talk, camFrom, handheld, burst } from "/engine/common.js";

const D = Math.PI / 180;
const Q = [{ from: 0.35, to: 3.1, at: 0.05 }], R_ = [{ from: 0.1, to: 2.45, at: 18.6 }];
const SEGS = [
  { from: 0, to: 2.6, at: 2.95 }, { from: 2.6, to: 4.2, at: 5.75 }, { from: 4.2, to: 6.0, at: 7.95 }, { from: 6.0, to: 8.6, at: 9.85 },
  { from: 8.6, to: 12.2, at: 12.4 }, { from: 12.2, to: 14.62, at: 16.2 }, { from: 14.62, to: 17.06, at: 21.0 },
];
const T = 24.8;
const S = { ask: 0, videos: 2.85, nothing: 5.75, fix: 7.95, swipe: 9.85, sea: 13.0, back: 16.05, end: 21.0 };
const STAMP0 = 7.05, STAMP1 = 20.15, SEA_OFF = new THREE.Vector3(0, 0, -80);
let W = [], WQ = [], WR = [], L = {};

export default {
  T, fps: 30, shutter: 0.5, fonts: FONTS,
  async setup(E) {
    const { scene } = E;
    const get = async n => (await (await fetch(`/vo/${n}-words.json`)).json()).words;
    W = placeWords(await get("ad3"), SEGS); WQ = placeWords(await get("ad3q"), Q); WR = placeWords(await get("ad3r"), R_);
    await loadEndArt(E);
    L.screen = E.canvasTex(660, 1434);
    L.din = makeDining(E, { mode: "night", seats: [190, 120, 250, 330] }); scene.add(L.din.root);
    L.hero = makeFigure({ skin: "#f0c09a", hairStyle: "beanie", hat: "#ff8ad8", hat2: "#e070bf", top: "sweater", hoodie: "#ffb35c", hoodie2: "#f09a3c", pants: "#2c2f4a", sole: "#7b5cff" });
    L.ask = makeFigure({ skin: "#8a5a3c", hair: "#1b120e", brow: "#1b120e", hairStyle: "long", top: "sweater", hoodie: "#2fb7a5", hoodie2: "#23978a", pants: "#3b3f6e", shoes: "#ffffff", sole: "#ff8ad8" });
    L.f2 = makeFigure({ skin: "#c98d62", hair: "#2a1a14", hairStyle: "curly", hoodie: "#ff6b8a", hoodie2: "#e2557a", pants: "#2c2f4a" });
    L.f3 = makeFigure({ skin: "#e8b48c", hair: "#5a3a1e", brow: "#5a3a1e", hairStyle: "bun", top: "sweater", hoodie: "#7b5cff", hoodie2: "#6648e0", pants: "#2c2f4a" });
    [L.hero, L.ask, L.f2, L.f3].forEach(f => L.din.root.add(f));
    L.phone = makePhone(L.screen.tex); L.din.root.add(L.phone);
    L.bunny = makeBunny(); L.din.root.add(L.bunny);
    L.burst = burst(46, "#ffd6f5"); L.din.root.add(L.burst.im);
    L.card = makeCard(L.screen.tex, 0.25, 0.543, 0.022); L.din.root.add(L.card);
    // ghost thumbnails of the week's videos
    L.thumbs = [];
    for (let i = 0; i < 14; i++) { const c = document.createElement("canvas"); c.width = 660; c.height = 1170; drawFeedPost(c.getContext("2d"), 660, 1170, i + 3, 0, i);
      const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
      const card = makeCard(tx, 0.09, 0.16, 0.012, { bright: 1.1 }); L.din.root.add(card); L.thumbs.push(card); }
    L.plate = await E.img("/assets/01_card_survival.png");
    // the seabed
    L.cook = makeFigure({ skin: "#7a4a30", hair: "#1b120e", brow: "#1b120e", hairStyle: "chef", top: "apron", hoodie: "#f6f1e8", hoodie2: "#e5ddd0", pants: "#3b4a7a" });
    L.sea = makeSea(E, L.cook); L.sea.root.position.copy(SEA_OFF); scene.add(L.sea.root);
    L.fogSea = new THREE.FogExp2("#0d4a5c", 0.16); L.fogDin = new THREE.FogExp2("#1a2a2c", 0.035);
  },

  async prepare(t, E) {
    const { ctx: x, canvas } = L.screen, w = canvas.width, h = canvas.height;
    if (t < S.fix) { x.fillStyle = "#07060c"; x.fillRect(0, 0, w, h); }
    else if (t < 12.05) { const im = await E.img(clipURL("card-read", t - 7.06)); x.drawImage(im, 0, 0, w, h);
      const k = M.seg(t, S.fix, S.fix + 0.6); if (k < 1) { x.fillStyle = `rgba(123,92,255,${0.85 * (1 - M.outCubic(k))})`; x.fillRect(0, 0, w, h); } }
    else { const sw = M.inOutQuint(M.seg(t, 12.05, 12.38)); const prev = await E.img(clipURL("card-read", 12.05 - 7.06));
      const z = 1 + 0.05 * M.seg(t, 12.4, 13.0);
      if (sw < 1) x.drawImage(prev, 0, -sw * h, w, h);
      x.save(); x.translate(w / 2, h * 0.4 + (1 - sw) * h); x.scale(z, z); x.drawImage(L.plate, -w / 2, -h * 0.4, w, h); x.restore(); }
    L.screen.tex.needsUpdate = true;
  },

  update(t, E) {
    const inSea = t >= S.sea && t < S.back;
    L.din.root.visible = !inSea; L.sea.root.visible = inSea;
    E.scene.fog = inSea ? L.fogSea : L.fogDin; E.clear = inSea ? 0x0d4a5c : 0x1a2a2c;
    E.bloom.strength = inSea ? 0.55 : 0.4; E.bloom.threshold = 0.9;
    if (inSea) sea(t, E); else dinner(t, E);
  },

  post(t, E) { const f = E.finish.uniforms; const s = t >= S.sea && t < S.back; f.vig.value = s ? 0.45 : 0.32; f.grain.value = 0.022; f.lift.value.set(s ? 0 : 0.02, s ? 0.02 : 0.01, s ? 0.03 : 0.0); },

  async overlay(g, t, E) {
    const ws = (a, b, arr = W) => arr.filter(w => w.i >= a && w.i <= b);
    // hook: the friend's question, as a quote
    const q = ws(0, 4, WQ).map((w, i) => ({ ...w, w: i === 0 ? "“So…" : i === 4 ? "lately?”" : w.w }));
    caption(g, t, { words: q, y: 285, size: 68, hi: ["cool"], out: 2.8, maxW: 900 });
    const low = (a, b, hi, y = 1500, out) => caption(g, t, { words: ws(a, b), y, size: 56, hi, out, scrim: true });
    low(0, 6, ["hundred"], 1520, 5.6); low(7, 10, ["nothing"], 1520, 7.85);
    low(11, 13, ["curio"], 1500); low(14, 19, ["true"], 1580, 12.3);
    low(20, 26, ["sixty"], 1520, 14.3); low(27, 32, ["sea"], 1520, 15.95);
    low(33, 37, ["leans"], 1560, 18.6);
    caption(g, t, { words: ws(0, 2, WR), y: 1560, size: 56, hi: ["sixty"], out: 20.9, scrim: true, color: "#bff3ec" });
    const mid = E.project(L.hero.userData.J.head.getWorldPosition(new THREE.Vector3()));
    const vids = Math.round(300 * M.outCubic(M.seg(t, 3.5, 5.0)));
    chip(g, t, { x: 64, y: 470, label: "Videos this week", value: String(vids), t0: 3.4, t1: S.fix - 0.3, accent: "#8fa6ff" });
    stamp(g, t, { x: 540, y: 1200, t0: STAMP0, t1: S.fix - 0.1, text: "NOTHING", sub: "300 VIDEOS · 0 STORIES", rot: -8, size: 110 });
    chip(g, t, { x: 64, y: 470, label: "Survived underwater", value: "60 hours", t0: 13.75, t1: S.back - 0.25, accent: "#7fe0ff" });
    if (t >= S.back) {
      const hh = E.project(L.hero.userData.J.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.32, 0)));
      bubble(g, t, { x: Math.min(800, Math.max(300, hh.x)), y: hh.y, t0: 16.45, t1: 18.55, text: "…sixty hours, in an air pocket, at the bottom of the sea!", w: 640, size: 40 });
      const ha = E.project(L.ask.userData.J.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.32, 0)));
      bubble(g, t, { x: Math.min(820, Math.max(260, ha.x)), y: ha.y, t0: 18.7, t1: S.end, text: "Wait. Sixty hours?!", w: 520, size: 44, color: "#bff3ec" });
      stamp(g, t, { x: 540, y: 520, t0: STAMP1, t1: S.end - 0.05, text: "STORY OF THE NIGHT", color: COL.pink, rot: -7, size: 72 });
    }
    flash(g, t, S.fix - 0.02, 0.35, "203,184,255", 0.5);
    flash(g, t, S.sea - 0.12, 0.4, "190,240,255", 0.85); flash(g, t, S.back - 0.12, 0.4, "255,236,220", 0.8);
    endCard(g, t, { t0: S.end, headline: ["Be the one", "with the ", "story."], kicker: "Turn scrolling into learning", sub: "Free on the App Store", wipeFrom: mid });
  },

  audioPlan() {
    const vo = [...Q.map(s => ({ src: "vo/ad3q.wav", ...s, gain: -1 })), ...SEGS.map(s => ({ src: "vo/ad3.wav", ...s, gain: 0 })), ...R_.map(s => ({ src: "vo/ad3r.wav", ...s, gain: -1 }))];
    const sfx = [
      { name: "dinner", at: 0, gain: -22, dur: 6.9, loop: true, fade: 0.5 }, { name: "whoosh", at: 2.65, gain: -14 },
      ...[3.3, 3.55, 3.8, 4.05, 4.3, 4.55, 4.8].map((a, i) => ({ name: "pop", at: a, gain: -24 + i })), { name: "counter", at: 3.5, gain: -17 },
      ...[6.2, 6.35, 6.5, 6.65, 6.8].map(a => ({ name: "pop", at: a, gain: -18 })), { name: "crickets", at: 6.9, gain: -11, dur: 1.15, fade: 0.25 },
      { name: "stamp", at: STAMP0, gain: -5 }, { name: "thud", at: STAMP0, gain: -9 },
      { name: "sparkle", at: S.fix + 0.05, gain: -9 }, { name: "pop", at: S.fix + 0.15, gain: -10 }, { name: "whoosh", at: S.swipe - 0.05, gain: -14 },
      { name: "swipe", at: 11.7, gain: -13 }, { name: "swipe", at: 12.05, gain: -15 }, { name: "riser", at: 12.3, gain: -16 },
      { name: "dive", at: S.sea - 0.45, gain: -6 }, { name: "pop", at: 13.75, gain: -18 }, { name: "whoosh_big", at: S.back - 0.25, gain: -10 },
      { name: "dinner", at: S.back, gain: -24, dur: 4.9, loop: true, fade: 0.5 }, { name: "ooh", at: 18.1, gain: -10 }, { name: "pop", at: 18.7, gain: -15 },
      { name: "stamp", at: STAMP1, gain: -7 }, { name: "sparkle", at: STAMP1 + 0.05, gain: -14 },
      { name: "whoosh_big", at: S.end - 0.05, gain: -12 }, { name: "sparkle", at: S.end + 0.25, gain: -13 }, { name: "pop", at: S.end + 0.95, gain: -14 },
    ];
    return { T, vo, music: { name: "bed_ad3", gain: -22, at: 0 }, sfx };
  },
};

// ---------------------------------------------------------------- dinner table
function seatPose(fig, seat, pose) { const a = seat.angle * D; pose.root = [Math.sin(a) * 0.98, -0.02, Math.cos(a) * 0.98, seat.angle + 180]; setPose(fig, pose); }
function lookAt(seat, target) { // head yaw (deg) for a seated figure to look at a world point (table-local)
  const a = seat.angle * D, px = Math.sin(a) * 0.98, pz = Math.cos(a) * 0.98; const fwd = Math.atan2(-px, -pz), to = Math.atan2(target.x - px, target.z - pz);
  let d = (to - fwd) / D; while (d > 180) d -= 360; while (d < -180) d += 360; return M.clamp(d, -60, 60);
}
function dinner(t, E) {
  const R = L.din.R, [sH, sA, s2, s3] = R.seats; const back = t >= S.back;
  const hp = new THREE.Vector3(Math.sin(sH.angle * D) * 0.98, 1.1, Math.cos(sH.angle * D) * 0.98);
  const ap = new THREE.Vector3(Math.sin(sA.angle * D) * 0.98, 1.1, Math.cos(sA.angle * D) * 0.98);
  // hero
  let hpose, hface;
  if (!back) {
    if (t < S.videos) { hpose = JSON.parse(JSON.stringify(POSE.sit)); hpose.head = [0, lookAt(sH, ap), 0]; hface = { mouth: "smile", blink: M.blink(t, [1.1]), look: [8, 0] }; }
    else if (t < S.fix) { const sh = M.inOut(M.seg(t, 6.3, 6.8)); hpose = mixPose(POSE.sit, POSE.sitShrug, sh); hpose.head = [-14 * (1 - sh) - 4, 8 * Math.sin(t * 0.7), sh * 8];
      hface = { mouth: t > 6.5 ? "flat" : "o", blink: M.blink(t, [4.6]), brows: 10, browY: 4 * sh, look: [0, 14 * (1 - sh)], eyeScale: 1 + 0.1 * sh }; }
    else { hpose = JSON.parse(JSON.stringify(POSE.sitPhone)); hface = t < S.fix + 0.5 ? { mouth: "o", eyeScale: 1.2, brows: -6, browY: 6 } : { mouth: "smile", blink: M.blink(t, [10.6]), brows: -4, browY: 3, look: [0, 6] }; }
  } else { hpose = talk(POSE.sitTalk, t, 1.3, 3); hpose.head = [hpose.head[0], hpose.head[1] + lookAt(sH, ap) * 0.5, 0]; hface = { mouth: Math.sin(t * 12) > -0.2 ? "grin" : "o", brows: -6, browY: 5, blink: M.blink(t, [17.9, 19.7]) }; }
  seatPose(L.hero, sH, hpose); setFace(L.hero, hface);
  // the friends
  const lean = back ? M.inOut(M.seg(t, 17.3, 18.1)) : M.inOut(M.seg(t, 0.0, 0.4)) * (1 - M.inOut(M.seg(t, 2.6, 3.2)));
  const others = [[L.ask, sA, 0], [L.f2, s2, 1], [L.f3, s3, 2]];
  for (const [f, s, i] of others) {
    const lk = i === 0 && !back ? lean : back ? lean : 0; const p = mixPose(i === 0 && !back ? POSE.sitTalk : POSE.sit, POSE.sitLean, back ? lk : lk * 0.6);
    const stare = t > 6.2 && t < S.fix ? 1 : 0; p.head = [p.head[0] + (stare ? 4 : 0), lookAt(s, hp) * (back || stare || i === 0 ? 1 : 0.4) + (back || stare ? 0 : M.fbm(t * 0.5, i) * 20), 0];
    seatPose(f, s, p);
    setFace(f, back ? { mouth: lk > 0.4 ? "o" : "smile", eyeScale: 1 + 0.25 * lk, brows: -8 * lk, browY: 6 * lk, blink: M.blink(t, [16.9 + i * 0.6]) }
                    : stare ? { mouth: "flat", brows: 6, blink: 1, eyeScale: 1.05 } : { mouth: i === 0 && t < 2.8 ? (Math.sin(t * 13) > 0 ? "o" : "grin") : "smile", blink: M.blink(t, [0.8 + i, 3.9 + i * 0.4]) });
  }
  // ghost thumbnails orbit the hero's head, then pop
  const hc = L.hero.userData.J.head.getWorldPosition(new THREE.Vector3()).sub(L.din.root.position);
  L.thumbs.forEach((c, i) => { const tin = 3.25 + i * 0.12, tout = 6.15 + i * 0.05; c.visible = t > tin && t < tout + 0.2 && !back;
    if (!c.visible) return; const k = M.outBack(M.seg(t, tin, tin + 0.35), 1.5) * (1 - M.smooth(M.seg(t, tout, tout + 0.15)));
    const a = i / L.thumbs.length * Math.PI * 2 + t * 0.9, r = 0.36 + (i % 3) * 0.05;
    c.position.set(hc.x + Math.sin(a) * r, hc.y + 0.06 + Math.sin(a * 2 + i) * 0.1, hc.z + Math.cos(a) * r); c.lookAt(hc.x + Math.sin(a) * 2, c.position.y, hc.z + Math.cos(a) * 2); c.scale.setScalar(Math.max(0.001, k)); });
  // phone on the table, bunny, floating card
  const ph = L.phone; ph.position.set(-0.04, 0.663, -0.5); ph.rotation.set(-Math.PI / 2, 0, 0.4);
  ph.userData.screenMat.color.setScalar(t > S.fix ? 0.95 : 0.12);
  const bn = L.bunny, bt = t - S.fix - 0.08;
  if (bt < 0) bn.visible = false; else { bn.visible = true; const k = M.clamp(bt / 0.55), p1 = new THREE.Vector3(0.12, 0.66, -0.3);
    const p = ph.position.clone().lerp(p1, M.outCubic(k)); p.y += Math.sin(k * Math.PI) * 0.25; bn.position.copy(p); bn.scale.setScalar(Math.max(0.001, 0.5 * Math.min(1, M.spring(t, S.fix + 0.08, 2.4, 0.45))));
    bn.rotation.set(0, back ? 2.4 : 0.8 + Math.sin(t) * 0.2, 0); bunnyPose(bn, { hop: back && t > 17 && t < 19 ? (t - 17) / 0.5 : 0.99, height: 0.06, earFlop: k < 1 ? 1 - k : 0.1, headTilt: !back && t > S.swipe ? -20 : 0 }); }
  L.burst.set(t, S.fix + 0.04, ph.position.clone().add(new THREE.Vector3(0, 0.05, 0)));
  const cd = L.card, ck = M.inOutQuint(M.seg(t, S.swipe - 0.05, S.swipe + 0.55)); cd.visible = t > S.swipe - 0.05 && !back;
  const heroC = new THREE.Vector3(-0.1, 1.08, -0.2);
  if (cd.visible) { const hq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05 + Math.sin(t * 0.8) * 0.02, 0.15 + Math.sin(t * 0.6) * 0.06, 0));
    cd.position.copy(ph.position).lerp(heroC, ck); cd.position.y += Math.sin(ck * Math.PI) * 0.1; cd.quaternion.copy(ph.quaternion).slerp(hq, ck); cd.scale.setScalar(M.lerp(0.37, 1.25, ck)); }
  // candle flicker on the pendant spot
  R.pendLight.intensity = LI * (back ? 5.0 : 4.4) * (1 + M.noise(t * 7, 3) * 0.04);
  // ---- camera
  const c3 = (p, tg, fov = 34, ap = 0.016) => camFrom(E, p, tg, fov, null, ap);
  if (t < S.videos) { const k = M.inOutSine(M.seg(t, 0, 2.55)), wh = M.inExpo(M.seg(t, 2.55, S.videos));
    c3([M.lerp(1.15, 0.98, k) - 1.0 * wh, 1.5, M.lerp(2.35, 2.1, k)], [M.lerp(0.42, 0.36, k) - 0.7 * wh, 0.98, -0.55], 36); handheld(E, t, 0.8, 1); }
  else if (t < S.fix) { const k = M.inOutSine(M.seg(t, S.videos, S.fix)), sh = M.shake(t, STAMP0, 0.45, 14) * 0.03;
    c3([0.12 + sh, M.lerp(1.32, 1.27, k), M.lerp(0.72, 0.48, k)], [hp.x, 1.12, hp.z], 32, 0.014); handheld(E, t, 0.7, 2); }
  else if (t < S.swipe) { const k = M.inOutSine(M.seg(t, S.fix, S.swipe)); c3([M.lerp(0.55, 0.45, k), M.lerp(1.5, 1.42, k), M.lerp(1.55, 1.35, k)], [-0.08, 0.78, -0.42], 34, 0.018); handheld(E, t, 0.7, 3); }
  else if (!back) { const k = M.inOutSine(M.seg(t, S.swipe, 12.6)), dive = M.inExpo(M.seg(t, 12.55, S.sea)); const cp = cd.position;
    const pos = new THREE.Vector3(M.lerp(0.2, 0.08, k), M.lerp(1.16, 1.12, k), M.lerp(1.15, 1.0, k)).lerp(new THREE.Vector3(cp.x, cp.y, cp.z + 0.06), dive);
    camFrom(E, pos.toArray(), [cp.x, cp.y - 0.12 * (1 - dive), cp.z - 0.3], 34, pos.distanceTo(cp), 0.014 * (1 - dive)); handheld(E, t, 0.6 * (1 - dive), 4); }
  else { const k = M.inOutSine(M.seg(t, S.back, S.end)); c3([M.lerp(0.25, 0.12, k), M.lerp(1.72, 1.62, k), M.lerp(2.75, 2.45, k)], [0.0, 0.88, -0.2], 38, 0.02); handheld(E, t, 0.7, 5); }
}

// ---------------------------------------------------------------- seabed
function sea(t, E) {
  const R = L.sea.R, O = SEA_OFF; animateSea(R, t);
  const p = { ...POSE.sit }; const cp = JSON.parse(JSON.stringify(POSE.bedBlank)); cp.hipL = [0, 0, 3]; cp.hipR = [0, 0, 3]; cp.knL = [0, 0, 0]; cp.knR = [0, 0, 0];
  cp.shL = [-20 + Math.sin(t * 1.3) * 10, 0, 40]; cp.shR = [-20 + Math.cos(t * 1.2) * 10, 0, 40]; cp.elL = [-40, 0, 0]; cp.elR = [-40, 0, 0]; cp.head = [-18 + Math.sin(t) * 4, Math.sin(t * 0.6) * 20, 0];
  cp.root = [0.02, 0.03 + Math.sin(t * 1.4) * 0.006, -0.32, 8]; setPose(L.cook, cp); setFace(L.cook, { mouth: "o", eyeScale: 1.15, brows: 8, browY: 4, blink: M.blink(t, [14.2]), look: [0, 10] });
  R.torch.intensity = LI * (0.17 + 0.03 * Math.sin(t * 3)); R.water.rotation.z = t * 0.2; R.prop.rotation.z = t * 0.4;
  const k = M.inOutSine(M.seg(t, S.sea, S.back));
  camFrom(E, [O.x + M.lerp(1.6, 0.2, k), M.lerp(1.9, 0.56, k), O.z + M.lerp(2.4, 1.65, k)], [O.x + M.lerp(0, 0.02, k), M.lerp(0.35, 0.47, k), O.z - M.lerp(0.6, 0.4, k)], M.lerp(40, 30, k), null, 0.012);
  E.cam.roll = Math.sin(t * 0.7) * 0.03; handheld(E, t, 1.2, 9);
}
