// Shared pieces for the ads: the phone-screen compositor (generic doomscroll feed vs real Curio clips),
// timeline helpers, poses, and the audio plan format the mixer reads.
import * as THREE from "three";
import * as M from "./motion.js";

export const pad = n => String(n).padStart(4, "0");
export const CLIPS = { "card-read": 270, "explain-deeper": 735, "discover-rabbit-hole": 640, "profile-progress": 143, "daily-mix": 676 };
export function clipURL(name, sec) { const n = Math.max(1, Math.min(CLIPS[name], Math.floor(sec * 30) + 1)); return `/build/clips/${name}/${pad(n)}.jpg`; }

// ---------------------------------------------------------------- generic doomscroll feed (no real brands)
const FEED = [
  ["#ff6b6b", "#ffd166"], ["#06d6a0", "#118ab2"], ["#8338ec", "#ff006e"], ["#fb5607", "#ffbe0b"], ["#3a86ff", "#8ecae6"],
  ["#f72585", "#4cc9f0"], ["#2ec4b6", "#cbf3f0"], ["#e76f51", "#264653"], ["#9b5de5", "#00f5d4"], ["#ef476f", "#073b4c"],
];
function rngf(seed) { let s = (seed * 9301 + 49297) % 233280; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
export function drawFeedPost(x, w, h, i, y0, t) {
  const [a, b] = FEED[((i % FEED.length) + FEED.length) % FEED.length], r = rngf(i * 7 + 3);
  const gr = x.createLinearGradient(0, y0, w, y0 + h); gr.addColorStop(0, a); gr.addColorStop(1, b); x.fillStyle = gr; x.fillRect(0, y0, w, h);
  for (let k = 0; k < 5; k++) { x.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.18})`; x.beginPath(); x.arc(r() * w, y0 + r() * h, 60 + r() * 220 + Math.sin(t * 2 + k) * 20, 0, 7); x.fill(); }
  x.fillStyle = "rgba(0,0,0,0.18)"; x.fillRect(0, y0 + h * 0.62, w, h * 0.38);
  x.fillStyle = "rgba(255,255,255,0.95)"; x.beginPath(); x.arc(70, y0 + h - 250, 30, 0, 7); x.fill();
  x.fillStyle = "rgba(255,255,255,0.9)"; x.fillRect(116, y0 + h - 266, 160 + r() * 80, 20); x.fillStyle = "rgba(255,255,255,0.7)"; x.fillRect(40, y0 + h - 205, 430 + r() * 120, 16); x.fillRect(40, y0 + h - 175, 300 + r() * 120, 16);
  for (let k = 0; k < 4; k++) { x.fillStyle = "rgba(255,255,255,0.92)"; x.beginPath(); x.arc(w - 60, y0 + h * 0.45 + k * 110, 30, 0, 7); x.fill(); x.fillStyle = "rgba(255,255,255,0.75)"; x.fillRect(w - 80, y0 + h * 0.45 + k * 110 + 40, 40, 10); }
  x.fillStyle = "rgba(255,255,255,0.35)"; x.fillRect(0, y0 + h - 8, w, 8); x.fillStyle = "#fff"; x.fillRect(0, y0 + h - 8, w * ((t * 0.7 + r()) % 1), 8);
}
// endless feed: a flick every `every` seconds starting at t0; returns nothing, draws into ctx
export function drawFeed(x, w, h, t, t0, every = 0.55, flick = 0.22) {
  const n = Math.max(0, (t - t0) / every), i = Math.floor(n), k = M.outExpo(M.clamp((n - i) * every / flick));
  const off = (i + k) * h; x.fillStyle = "#000"; x.fillRect(0, 0, w, h);
  const top = Math.floor(off / h); for (let j = top; j <= top + 1; j++) drawFeedPost(x, w, h, j, j * h - off, t);
  // status bar
  x.fillStyle = "rgba(255,255,255,0.9)"; x.font = "600 26px 'Hanken Grotesk'"; x.fillText("2:07", 52, 52);
}
export function feedColor(t, t0, every = 0.55) { const i = Math.floor(Math.max(0, (t - t0) / every)); return FEED[i % FEED.length][0]; }

// screen glitch-out overlay
export function glitch(x, w, h, k, seed = 1) {
  if (k <= 0) return; const r = rngf(seed + Math.floor(k * 30));
  for (let i = 0; i < 18; i++) { const y = r() * h, hh = 4 + r() * 40; x.drawImage(x.canvas, 0, y, w, hh, (r() - 0.5) * 80 * k, y, w, hh); }
  x.fillStyle = `rgba(0,0,0,${k})`; x.fillRect(0, 0, w, h);
}

// ---------------------------------------------------------------- poses
export const POSE = {
  bedPhone: { spine: [-12, 0, 0], neck: [6, 0, 0], head: [14, 0, 0], shL: [-38, 0, -16], elL: [-92, 8, 0], shR: [-38, 0, -16], elR: [-92, 8, 0], handL: [10, 0, 0], handR: [10, 0, 0], hipL: [-88, 0, 3], hipR: [-88, 0, 3] },
  bedSing: { spine: [-10, 0, 0], neck: [0, 0, 0], head: [-6, 0, 0], shL: [-10, 0, 20], elL: [-50, 0, 0], shR: [-30, 0, 6], elR: [-110, 0, 0], hipL: [-88, 0, 3], hipR: [-88, 0, 3] },
  bedBlank: { spine: [-8, 0, 0], neck: [-2, 0, 0], head: [-4, 0, 0], shL: [-22, 0, -8], elL: [-70, 6, 0], shR: [-22, 0, -8], elR: [-70, 6, 0], hipL: [-88, 0, 3], hipR: [-88, 0, 3] },
  sit: { spine: [2, 0, 0], neck: [0, 0, 0], head: [0, 0, 0], shL: [-30, 0, 6], elL: [-50, 0, 0], shR: [-30, 0, 6], elR: [-50, 0, 0], hipL: [-88, 0, 4], hipR: [-88, 0, 4], knL: [88, 0, 0], knR: [88, 0, 0] },
  sitTalk: { spine: [6, 0, 0], neck: [0, 0, 0], head: [-4, 0, 0], shL: [-60, 0, 28], elL: [-70, -20, 0], shR: [-40, 0, 10], elR: [-60, 0, 0], hipL: [-88, 0, 4], hipR: [-88, 0, 4], knL: [88, 0, 0], knR: [88, 0, 0] },
  sitLean: { spine: [22, 0, 0], neck: [6, 0, 0], head: [-10, 0, 0], shL: [-55, 0, 2], elL: [-40, 0, 0], shR: [-55, 0, 2], elR: [-40, 0, 0], hipL: [-88, 0, 4], hipR: [-88, 0, 4], knL: [88, 0, 0], knR: [88, 0, 0] },
  sitShrug: { spine: [-2, 0, 0], neck: [0, 0, 0], head: [0, 0, 8], shL: [-20, 0, 48], elL: [-95, 40, 0], shR: [-20, 0, 48], elR: [-95, 40, 0], hipL: [-88, 0, 4], hipR: [-88, 0, 4], knL: [88, 0, 0], knR: [88, 0, 0] },
  sitPhone: { spine: [8, 0, 0], neck: [6, 0, 0], head: [16, 0, 0], shL: [-40, 0, -14], elL: [-88, 8, 0], shR: [-40, 0, -14], elR: [-88, 8, 0], hipL: [-88, 0, 4], hipR: [-88, 0, 4], knL: [88, 0, 0], knR: [88, 0, 0] },
};

// gesture loop for a talking arm: adds small swings to a pose
export function talk(p, t, amt = 1, seed = 0) {
  const o = JSON.parse(JSON.stringify(p));
  o.shL = [o.shL[0] + M.fbm(t * 1.6, seed) * 18 * amt, o.shL[1], o.shL[2] + M.fbm(t * 1.3, seed + 3) * 10 * amt];
  o.elL = [o.elL[0] + M.fbm(t * 2.1, seed + 5) * 25 * amt, o.elL[1], o.elL[2]];
  o.head = [o.head[0] + M.fbm(t * 1.2, seed + 7) * 5 * amt, (o.head[1] || 0) + M.fbm(t * 0.9, seed + 9) * 8 * amt, o.head[2] || 0];
  return o;
}

// ---------------------------------------------------------------- audio plan
// vo: [{src, from, to, at, gain}], sfx: [{name, at, gain, dur?, fade?}], music: {name, gain}
export function plan(T, vo, music, sfx) { return { T, vo, music, sfx }; }

// smoothly damped follow-cam helper: camera rig from track functions
export function camFrom(E, pos, target, fov = 32, focus = null, aperture = 0) {
  E.cam.pos.set(...pos); E.cam.target.set(...target); E.cam.fov = fov; E.cam.focus = focus; E.cam.aperture = aperture; E.cam.roll = 0;
}
export function handheld(E, t, amt = 1, seed = 0) {
  E.cam.pos.x += M.fbm(t * 0.6, seed) * 0.012 * amt; E.cam.pos.y += M.fbm(t * 0.5, seed + 4) * 0.01 * amt;
  E.cam.target.x += M.fbm(t * 0.45, seed + 8) * 0.008 * amt; E.cam.target.y += M.fbm(t * 0.4, seed + 12) * 0.008 * amt;
}

// sparkle burst (instanced octahedra) for pop moments
export function burst(n, color) {
  const im = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.014, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(3.2) }), n);
  im.frustumCulled = false; const dirs = [];
  for (let i = 0; i < n; i++) { const a = i * 2.39996, z = 1 - 2 * ((i + 0.5) / n); const r = Math.sqrt(1 - z * z); dirs.push(new THREE.Vector3(Math.cos(a) * r, z * 0.8 + 0.35, Math.sin(a) * r).multiplyScalar(0.25 + ((i * 37) % 11) / 18)); }
  return { im, dirs, set(t, t0, o) {
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(); const x = t - t0;
    for (let i = 0; i < n; i++) { const k = x < 0 ? 0 : 1 - Math.exp(-x * 4); const sc = x < 0 ? 0 : Math.max(0, 1 - x / 1.1) * (0.6 + (i % 3) * 0.4);
      p.copy(o).addScaledVector(dirs[i], k); p.y -= x > 0 ? 0.25 * x * x : 0; q.setFromEuler(new THREE.Euler(x * 6 + i, x * 4, 0)); m4.compose(p, q, s.set(sc, sc, sc)); im.setMatrixAt(i, m4); }
    im.instanceMatrix.needsUpdate = true; } };
}
