// Toy-world kit: vinyl figures with a joint rig and face, the Curio rabbit in 3D, a phone, floating app cards,
// and the props the sets are built from. Units are roughly metres; a figure stands about 1.28 tall.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const D = Math.PI / 180;
export const LI = Math.PI; // three.js lights are physical units: scale artist intensities by pi
export const C = {
  lilac: "#cbb8ff", purple: "#7b5cff", pink: "#ff8ad8", ink: "#13110f", night: "#1d2150", navy: "#23285c",
  amber: "#ffb35c", cream: "#f7f3ea", teal: "#2fb7a5",
};

export const put = (parent, m) => (parent.add(m), m);
export function sh(o, cast = true, recv = true) { o.traverse(m => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = recv; } }); return o; }
export function mat(color, o = {}) { return new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0, ...o }); }
export function vinyl(color, o = {}) { return new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.5, ...o }); }
export function cloth(color, o = {}) { return new THREE.MeshPhysicalMaterial({ color, roughness: 0.92, sheen: 0.6, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.7, ...o }); }
export function glow(color, k = 1) { const m = new THREE.MeshBasicMaterial({ color }); m.color.multiplyScalar(k); return m; }
export const rbox = (w, h, d, r = 0.02, s = 4) => new RoundedBoxGeometry(w, h, d, s, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));
export function mesh(geo, material, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); return m; }

export function roundedRectGeo(w, h, r, seg = 10) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, 1.5 * Math.PI, false);
  const g = new THREE.ShapeGeometry(s, seg), uv = g.attributes.uv, p = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) - x) / w, (p.getY(i) - y) / h);
  return g;
}

// ---------------------------------------------------------------- figure
function onSphere(m, r, yaw, pitch, sx = 1, sy = 1, sz = 1) {
  const n = new THREE.Vector3(Math.sin(yaw * D) * Math.cos(pitch * D), Math.sin(pitch * D), Math.cos(yaw * D) * Math.cos(pitch * D));
  m.position.set(n.x * r * sx, n.y * r * sy, n.z * r * sz);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  return m;
}

export function makeFigure(o = {}) {
  const P = { skin: "#c98d62", hoodie: "#6d55d8", hoodie2: "#5945b8", pants: "#2c2f4a", shoes: "#f2ede4", sole: "#ff8ad8", hair: "#2a1a14", brow: "#2a1a14",
              hairStyle: "cap", strings: "#f3eefc", cheeks: "#ff8f9f", top: "hoodie", ...o };
  const skin = vinyl(P.skin), top = cloth(P.hoodie), top2 = cloth(P.hoodie2), pants = cloth(P.pants), hairM = vinyl(P.hair, { roughness: 0.55 });
  const fig = new THREE.Group(); fig.name = "figure";
  const J = {}; // joints
  const HIP = 0.47;
  J.hips = new THREE.Group(); J.hips.position.y = HIP; fig.add(J.hips);
  J.hips.add(mesh(rbox(0.3, 0.13, 0.21, 0.06), pants, 0, 0.01, 0));
  J.spine = new THREE.Group(); J.hips.add(J.spine);
  const torso = mesh(rbox(0.36, 0.42, 0.24, 0.1), top, 0, 0.215, 0); J.spine.add(torso);
  if (P.top === "hoodie") {
    const hood = mesh(new THREE.TorusGeometry(0.105, 0.048, 12, 28), top2, 0, 0.41, -0.045); hood.rotation.x = -62 * D; hood.scale.set(1, 1, 0.8); J.spine.add(hood);
    J.spine.add(mesh(rbox(0.22, 0.09, 0.03, 0.03), top2, 0, 0.1, 0.115));
    for (const sx of [-1, 1]) { const s = mesh(new THREE.CapsuleGeometry(0.007, 0.07, 4, 8), vinyl(P.strings), sx * 0.03, 0.33, 0.125); s.rotation.z = sx * 6 * D; J.spine.add(s); }
  } else if (P.top === "apron") { // chef jacket: white with two button rows
    for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) J.spine.add(mesh(new THREE.SphereGeometry(0.012, 10, 8), vinyl("#d9d2c4"), sx * 0.05, 0.3 - k * 0.08, 0.12));
  } else if (P.top === "sweater") {
    put(J.spine, mesh(new THREE.TorusGeometry(0.075, 0.025, 10, 24), top2, 0, 0.415, 0)).rotation.x = Math.PI / 2;
  }
  J.neck = new THREE.Group(); J.neck.position.y = 0.42; J.spine.add(J.neck);
  J.neck.add(mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.06, 16), skin, 0, 0.02, 0));
  J.head = new THREE.Group(); J.head.position.y = 0.2; J.neck.add(J.head);
  const R = 0.2, HS = [1, 0.96, 0.93];
  const headM = mesh(new THREE.SphereGeometry(R, 48, 32), skin); headM.scale.set(...HS); J.head.add(headM);
  // face
  const eyeM = vinyl("#0f0b14", { roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
  const F = { eyes: [], brows: [], hl: [] };
  for (const sx of [-1, 1]) {
    const e = new THREE.Group(); const ball = mesh(new THREE.SphereGeometry(0.03, 20, 16), eyeM); ball.scale.set(0.82, 1.18, 0.5); e.add(ball);
    const hl = mesh(new THREE.SphereGeometry(0.0065, 10, 8), glow("#ffffff", 0.95), 0.008, 0.014, 0.013); e.add(hl); F.hl.push(hl);
    e.userData = { sx }; J.head.add(e); F.eyes.push(e);
    const b = mesh(rbox(0.06, 0.016, 0.018, 0.007), vinyl(P.brow, { roughness: 0.6 })); b.userData = { sx }; J.head.add(b); F.brows.push(b);
    const ck = mesh(new THREE.SphereGeometry(0.034, 16, 12), mat(P.cheeks, { roughness: 0.95 })); onSphere(ck, R * 0.965, sx * 40, -15, ...HS); ck.scale.set(1, 0.7, 0.35); J.head.add(ck);
    const ear = mesh(new THREE.SphereGeometry(0.045, 16, 12), skin); onSphere(ear, R * 0.97, sx * 90, -4, ...HS); ear.scale.set(0.8, 1, 0.45); J.head.add(ear);
  }
  const mouth = new THREE.Group(); onSphere(mouth, R * 0.985, 0, -23, ...HS); J.head.add(mouth);
  const mouthM = vinyl("#3a1620", { roughness: 0.4 });
  F.smile = mesh(new THREE.TorusGeometry(0.03, 0.0085, 8, 24, Math.PI), mouthM); F.smile.rotation.z = Math.PI; mouth.add(F.smile);
  F.flat = mesh(new THREE.CapsuleGeometry(0.008, 0.03, 4, 8), mouthM); F.flat.rotation.z = Math.PI / 2; mouth.add(F.flat);
  F.o = mesh(new THREE.SphereGeometry(0.022, 16, 12), mouthM); F.o.scale.set(0.85, 1.1, 0.4); mouth.add(F.o);
  F.frown = mesh(new THREE.TorusGeometry(0.026, 0.008, 8, 24, Math.PI), mouthM); F.frown.position.y = -0.016; mouth.add(F.frown);
  F.grin = mesh(new THREE.SphereGeometry(0.036, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mouthM); F.grin.scale.set(1, 0.85, 0.35); F.grin.rotation.x = 0; mouth.add(F.grin);
  F.mouth = mouth;
  const nose = mesh(new THREE.SphereGeometry(0.02, 14, 10), skin); onSphere(nose, R * 0.99, 0, -9, ...HS); nose.scale.set(1.1, 0.8, 0.7); J.head.add(nose);
  // hair / hats
  const hairG = new THREE.Group(); J.head.add(hairG);
  const capGeo = new THREE.SphereGeometry(R * 1.05, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.43);
  const cap = mesh(capGeo, hairM); cap.scale.set(...HS); cap.rotation.x = -0.32; cap.position.set(0, 0.01, -0.01);
  if (P.hairStyle !== "bald" && P.hairStyle !== "chef") hairG.add(cap);
  if (P.hairStyle === "cap" || P.hairStyle === "bun") { const t = mesh(rbox(0.2, 0.05, 0.09, 0.025), hairM, 0.03, 0.155, 0.13); t.rotation.set(-0.5, 0.25, -0.35); hairG.add(t); }
  if (P.hairStyle === "bun") hairG.add(mesh(new THREE.SphereGeometry(0.085, 24, 16), hairM, 0, 0.2, -0.1));
  if (P.hairStyle === "curly") { for (let i = 0; i < 22; i++) { const a = i * 2.39996, y = 0.6 + 0.4 * ((i * 0.618) % 1); const v = new THREE.Vector3(Math.cos(a) * Math.sqrt(1 - y * y), y, Math.sin(a) * Math.sqrt(1 - y * y)); if (v.z > 0.55 && v.y < 0.8) continue; hairG.add(mesh(new THREE.SphereGeometry(0.058, 14, 10), hairM, v.x * R * 0.98, v.y * R * 0.98, v.z * R * 0.98)); } }
  if (P.hairStyle === "long") { const b = mesh(rbox(0.36, 0.36, 0.1, 0.05), hairM, 0, -0.07, -0.12); hairG.add(b); for (const sx of [-1, 1]) hairG.add(mesh(rbox(0.07, 0.26, 0.1, 0.035), hairM, sx * 0.17, -0.06, -0.02)); }
  if (P.hairStyle === "chef") {
    const w = vinyl("#fbf8f2", { roughness: 0.85 });
    hairG.add(mesh(new THREE.CylinderGeometry(0.17, 0.16, 0.12, 32), w, 0, 0.17, -0.01));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; hairG.add(mesh(new THREE.SphereGeometry(0.085, 18, 12), w, Math.cos(a) * 0.1, 0.27, Math.sin(a) * 0.1 - 0.01)); }
    hairG.add(mesh(new THREE.SphereGeometry(0.1, 18, 12), w, 0, 0.3, -0.01));
  }
  if (P.hairStyle === "beanie") { const bn = mesh(new THREE.SphereGeometry(R * 1.07, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.45), cloth(P.hat || "#ff8ad8")); bn.scale.set(...HS); bn.rotation.x = -0.18; hairG.add(bn); put(hairG, mesh(new THREE.TorusGeometry(0.19, 0.03, 10, 32), cloth(P.hat2 || "#e070bf"), 0, 0.075, 0.0)).rotation.x = Math.PI / 2 - 0.18; hairG.add(mesh(new THREE.SphereGeometry(0.05, 12, 10), cloth(P.hat2 || "#e070bf"), 0, 0.22, -0.03)); }
  // arms
  for (const [k, sx] of [["L", 1], ["R", -1]]) {
    const sh_ = new THREE.Group(); sh_.position.set(sx * 0.205, 0.355, 0); J.spine.add(sh_); J["sh" + k] = sh_;
    sh_.add(mesh(new THREE.SphereGeometry(0.068, 16, 12), top));
    sh_.add(mesh(new THREE.CapsuleGeometry(0.062, 0.12, 6, 14), top, 0, -0.09, 0));
    const el = new THREE.Group(); el.position.y = -0.19; sh_.add(el); J["el" + k] = el;
    el.add(mesh(new THREE.CapsuleGeometry(0.056, 0.1, 6, 14), top, 0, -0.07, 0));
    put(el, mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 18), top2, 0, -0.145, 0)).rotation.x = Math.PI / 2;
    const hand = new THREE.Group(); hand.position.y = -0.18; el.add(hand); J["hand" + k] = hand;
    const hm = mesh(new THREE.SphereGeometry(0.06, 20, 14), skin); hm.scale.set(0.92, 1.05, 0.8); hand.add(hm);
    const th = mesh(new THREE.CapsuleGeometry(0.02, 0.03, 4, 8), skin, -sx * 0.045, 0.0, 0.03); th.rotation.z = sx * 0.6; hand.add(th);
  }
  // legs
  for (const [k, sx] of [["L", 1], ["R", -1]]) {
    const hp = new THREE.Group(); hp.position.set(sx * 0.085, -0.02, 0); J.hips.add(hp); J["hip" + k] = hp;
    hp.add(mesh(new THREE.CapsuleGeometry(0.072, 0.1, 6, 14), pants, 0, -0.1, 0));
    const kn = new THREE.Group(); kn.position.y = -0.2; hp.add(kn); J["kn" + k] = kn;
    kn.add(mesh(new THREE.CapsuleGeometry(0.066, 0.1, 6, 14), pants, 0, -0.08, 0));
    const ft = new THREE.Group(); ft.position.y = -0.19; kn.add(ft); J["ft" + k] = ft;
    const shoe = new THREE.Group(); shoe.position.set(0, -0.02, 0.035); ft.add(shoe);
    shoe.add(mesh(rbox(0.125, 0.075, 0.2, 0.035), vinyl(P.shoes, { roughness: 0.6 }), 0, 0.005, 0));
    shoe.add(mesh(rbox(0.13, 0.025, 0.205, 0.012), vinyl(P.sole, { roughness: 0.7 }), 0, -0.035, 0));
    J["shoe" + k] = shoe;
  }
  sh(fig);
  F.hl.forEach(m => { m.castShadow = false; });
  fig.userData = { J, F, P, R, HS, mouth: "smile" };
  setPose(fig, {}); setFace(fig, {});
  return fig;
}

// pose: degrees. Right-side joints mirror y/z of the given L/R values so the same numbers read as "outward".
export function setPose(fig, p) {
  const { J } = fig.userData;
  const r = (g, a = [0, 0, 0], mirror = 0) => { if (!g) return; g.rotation.set((a[0] || 0) * D, (a[1] || 0) * D * (mirror ? -1 : 1), (a[2] || 0) * D * (mirror ? -1 : 1)); };
  if (p.root) { const q = p.root; fig.position.set(q[0] ?? fig.position.x, q[1] ?? fig.position.y, q[2] ?? fig.position.z); if (q[3] != null) fig.rotation.y = q[3] * D; }
  r(J.hips, p.hips); r(J.spine, p.spine); r(J.neck, p.neck); r(J.head, p.head);
  r(J.shL, p.shL ?? [0, 0, 7]); r(J.shR, p.shR ?? [0, 0, 7], 1);
  r(J.elL, p.elL ?? [-8, 0, 0]); r(J.elR, p.elR ?? [-8, 0, 0], 1);
  r(J.handL, p.handL); r(J.handR, p.handR, 1);
  r(J.hipL, p.hipL ?? [0, 0, 2]); r(J.hipR, p.hipR ?? [0, 0, 2], 1);
  r(J.knL, p.knL); r(J.knR, p.knR); r(J.ftL, p.ftL); r(J.ftR, p.ftR);
}
// blend two pose objects
export function mixPose(a, b, k) {
  const o = {}; const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) { const x = a[key] ?? b[key], y = b[key] ?? a[key]; o[key] = x.map((v, i) => (v ?? 0) + ((y[i] ?? 0) - (v ?? 0)) * k); }
  return o;
}

// face: mouth smile|flat|o|frown|grin, brows (deg tilt, + = worried), browY (lift), blink (1 open), look [x,y] in degrees
export function setFace(fig, f) {
  const { F, R, HS } = fig.userData;
  const look = f.look || [0, 0], open = f.blink ?? 1, tilt = f.brows ?? 0, lift = f.browY ?? 0;
  for (const e of F.eyes) { const sx = e.userData.sx; onSphere(e, R * 0.975, sx * 21 + look[0], -1 + look[1], ...HS); e.scale.set(1, open * (f.eyeScale ?? 1), 1); }
  for (const b of F.brows) { const sx = b.userData.sx; onSphere(b, R * 0.99, sx * 22, 15 + lift, ...HS); b.rotateZ(sx * tilt * D); }
  const m = f.mouth || "smile";
  for (const k of ["smile", "flat", "o", "frown", "grin"]) F[k].visible = k === m;
  if (f.mouthScale) F.mouth.scale.setScalar(f.mouthScale); else F.mouth.scale.setScalar(1);
}

// ---------------------------------------------------------------- the Curio rabbit, in 3D
export function makeBunny() {
  const fur = new THREE.MeshPhysicalMaterial({ color: "#d4c6ff", roughness: 0.62, sheen: 1, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.5, clearcoat: 0.1 });
  const pinkM = mat("#ffb3d9", { roughness: 0.7 }), white = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.8, sheen: 1, sheenColor: new THREE.Color("#ffffff") });
  const b = new THREE.Group(); const body = new THREE.Group(); b.add(body);
  const torso = mesh(new THREE.SphereGeometry(0.13, 32, 24), fur, 0, 0.125, -0.01); torso.scale.set(1, 0.95, 1.12); body.add(torso);
  put(body, mesh(new THREE.SphereGeometry(0.07, 20, 14), white, 0, 0.1, 0.085)).scale.set(1, 1.1, 0.6); // belly
  const head = new THREE.Group(); head.position.set(0, 0.29, 0.07); body.add(head);
  const hm = mesh(new THREE.SphereGeometry(0.11, 32, 24), fur); hm.scale.set(1.04, 0.95, 0.98); head.add(hm);
  for (const sx of [-1, 1]) {
    head.add(mesh(new THREE.SphereGeometry(0.055, 18, 12), fur, sx * 0.045, -0.035, 0.06));
    const eg = new THREE.Group(); onSphere(eg, 0.106, sx * 34, 8, 1.04, 0.95, 0.98); head.add(eg);
    const eye = mesh(new THREE.SphereGeometry(0.03, 20, 16), vinyl("#2a1747", { roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 })); eye.scale.set(0.85, 1.05, 0.55); eg.add(eye);
    eg.add(mesh(new THREE.SphereGeometry(0.008, 10, 8), glow("#ffffff", 1.0), 0.008, 0.012, 0.014));
    const ep = new THREE.Group(); ep.position.set(sx * 0.045, 0.08, -0.01); head.add(ep);
    const ear = mesh(new THREE.CapsuleGeometry(0.034, 0.17, 8, 16), fur, 0, 0.115, 0); ear.scale.set(1, 1, 0.5); ep.add(ear);
    const inner = mesh(new THREE.CapsuleGeometry(0.02, 0.13, 6, 12), pinkM, 0, 0.115, 0.012); inner.scale.set(1, 1, 0.35); ep.add(inner);
    ep.userData.sx = sx; ep.name = "ear";
    put(body, mesh(new THREE.SphereGeometry(0.05, 16, 12), fur, sx * 0.065, 0.025, 0.07)).scale.set(0.9, 0.5, 1.5);
    body.add(mesh(new THREE.SphereGeometry(0.032, 14, 10), fur, sx * 0.045, 0.075, 0.13));
  }
  const nose = mesh(new THREE.SphereGeometry(0.013, 12, 10), pinkM); onSphere(nose, 0.11, 0, -6, 1.04, 0.95, 0.98); head.add(nose);
  body.add(mesh(new THREE.SphereGeometry(0.048, 16, 12), white, 0, 0.1, -0.15));
  sh(b);
  b.userData = { body, head, ears: head.children.filter(c => c.name === "ear") };
  return b;
}
// hop cycle: phase 0..1 per hop, returns {y, sq}
export function bunnyPose(b, { hop = 0, height = 0.12, earFlop = 0, headTilt = 0, look = 0 } = {}) {
  const { body, head, ears } = b.userData;
  const ph = hop % 1, air = Math.sin(Math.PI * Math.min(1, ph / 0.7));
  const y = ph < 0.7 ? air * height : 0;
  const land = ph >= 0.7 ? Math.sin(Math.PI * (ph - 0.7) / 0.3) : 0;
  const sq = 1 - land * 0.18 + (ph < 0.7 ? air * 0.08 : 0);
  body.position.y = y; body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
  head.rotation.set(headTilt * D, look * D, 0);
  ears.forEach(e => { e.rotation.set((-12 + earFlop * 30 - air * 18) * D, 0, e.userData.sx * (10 + earFlop * 25) * D); });
}

// ---------------------------------------------------------------- phone + floating app card
export function makePhone(screenTex) {
  const g = new THREE.Group();
  const bodyM = new THREE.MeshPhysicalMaterial({ color: "#2b2833", metalness: 0.55, roughness: 0.32, clearcoat: 0.6 });
  g.add(sh(mesh(rbox(0.1, 0.206, 0.011, 0.014, 6), bodyM)));
  const scr = new THREE.MeshBasicMaterial({ map: screenTex, color: new THREE.Color(0.95, 0.95, 0.95) });
  const s = mesh(roundedRectGeo(0.0935, 0.199, 0.011), scr, 0, 0, 0.00575); g.add(s);
  const back = mesh(rbox(0.032, 0.032, 0.004, 0.008), bodyM, 0.025, 0.07, -0.007); g.add(back);
  g.userData = { screen: s, screenMat: scr };
  return g;
}
export function makeCard(map, w = 0.6, h = 1.3, r = 0.05, opts = {}) {
  const g = new THREE.Group();
  const front = new THREE.MeshBasicMaterial({ map, transparent: !!opts.transparent, color: new THREE.Color(opts.bright ?? 1, opts.bright ?? 1, opts.bright ?? 1) });
  const f = mesh(roundedRectGeo(w, h, r), front, 0, 0, 0.0021); g.add(f);
  if (opts.bezel !== false) { const b = mesh(rbox(w + 0.024, h + 0.024, 0.004, r + 0.01, 4), new THREE.MeshPhysicalMaterial({ color: "#16131d", metalness: 0.4, roughness: 0.35, clearcoat: 0.8 })); b.castShadow = true; g.add(b); }
  g.userData = { front: f, mat: front };
  return g;
}

// ---------------------------------------------------------------- textures drawn in canvas
export function canvasTexture(cw, ch, draw, repeat) {
  const c = document.createElement("canvas"); c.width = cw; c.height = ch; const x = c.getContext("2d"); draw(x, cw, ch);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function woodTex(base = "#7a4a2c", seed = 3) {
  return canvasTexture(1024, 1024, (x, w, h) => {
    const r = rng(seed); x.fillStyle = base; x.fillRect(0, 0, w, h);
    const pw = 128;
    for (let i = 0; i < w / pw; i++) {
      const off = r() * h; for (let k = -1; k < 2; k++) {
        const y0 = off + k * h * 0.62; x.fillStyle = `rgba(${r() < 0.5 ? "255,220,180" : "40,20,10"},${0.04 + r() * 0.07})`; x.fillRect(i * pw, y0, pw, h * 0.62);
        x.fillStyle = "rgba(25,12,6,0.55)"; x.fillRect(i * pw, y0, pw, 3);
      }
      for (let g = 0; g < 26; g++) { x.strokeStyle = `rgba(30,15,8,${0.05 + r() * 0.08})`; x.lineWidth = 1 + r() * 2; x.beginPath(); const gx = i * pw + r() * pw; x.moveTo(gx, 0); x.bezierCurveTo(gx + 6, h * 0.3, gx - 6, h * 0.6, gx + 3, h); x.stroke(); }
      x.fillStyle = "rgba(20,10,5,0.7)"; x.fillRect(i * pw, 0, 3, h);
    }
  }, [3, 3]);
}
export function paintTex(base, seed = 7, amt = 0.035) {
  return canvasTexture(512, 512, (x, w, h) => { const r = rng(seed); x.fillStyle = base; x.fillRect(0, 0, w, h); for (let i = 0; i < 2200; i++) { x.fillStyle = `rgba(${r() < 0.5 ? 255 : 0},${r() < 0.5 ? 255 : 0},${r() < 0.5 ? 255 : 0},${r() * amt})`; x.fillRect(r() * w, r() * h, 2 + r() * 6, 2 + r() * 6); } }, [2, 2]);
}
export function quiltTex(cols, seed = 5) {
  return canvasTexture(1024, 1024, (x, w, h) => {
    const r = rng(seed), n = 6, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      x.fillStyle = cols[Math.floor(r() * cols.length)]; x.fillRect(i * s, j * s, s, s);
      if (r() < 0.35) { x.fillStyle = "rgba(255,255,255,0.18)"; for (let d = 0; d < 5; d++) { x.beginPath(); x.arc(i * s + s * (0.2 + 0.6 * r()), j * s + s * (0.2 + 0.6 * r()), 6 + r() * 6, 0, 7); x.fill(); } }
      else if (r() < 0.5) { x.strokeStyle = "rgba(255,255,255,0.14)"; x.lineWidth = 8; for (let d = 1; d < 4; d++) { x.beginPath(); x.moveTo(i * s, j * s + d * s / 4); x.lineTo(i * s + s, j * s + d * s / 4); x.stroke(); } }
      x.strokeStyle = "rgba(255,255,255,0.35)"; x.setLineDash([10, 8]); x.lineWidth = 3; x.strokeRect(i * s + 8, j * s + 8, s - 16, s - 16); x.setLineDash([]);
      x.strokeStyle = "rgba(0,0,0,0.25)"; x.lineWidth = 4; x.strokeRect(i * s, j * s, s, s);
    }
  });
}
export function skyTex(mode) {
  return canvasTexture(1024, 1024, (x, w, h) => {
    const r = rng(11);
    const gr = x.createLinearGradient(0, 0, 0, h);
    if (mode === "night") { gr.addColorStop(0, "#0b0d2e"); gr.addColorStop(0.6, "#1d1d5a"); gr.addColorStop(1, "#43307a"); }
    else if (mode === "dusk") { gr.addColorStop(0, "#1b2357"); gr.addColorStop(0.55, "#5b3f86"); gr.addColorStop(0.85, "#e07a8a"); gr.addColorStop(1, "#ffb37a"); }
    else { gr.addColorStop(0, "#8fc4ff"); gr.addColorStop(0.45, "#ffd6b0"); gr.addColorStop(0.8, "#ffb07a"); gr.addColorStop(1, "#ff9a6a"); }
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    if (mode === "night") {
      for (let i = 0; i < 260; i++) { const a = r(); x.fillStyle = `rgba(255,255,255,${0.25 + a * 0.75})`; const s = a > 0.94 ? 3.2 : 1.4; x.beginPath(); x.arc(r() * w, r() * h * 0.8, s, 0, 7); x.fill(); }
      x.fillStyle = "#fff6dc"; x.shadowColor = "#fff2c0"; x.shadowBlur = 60; x.beginPath(); x.arc(w * 0.7, h * 0.24, 70, 0, 7); x.fill(); x.shadowBlur = 0;
      x.fillStyle = "#11124a"; x.beginPath(); x.arc(w * 0.7 + 34, h * 0.24 - 16, 64, 0, 7); x.fill();
      x.fillStyle = "#0a0a26"; for (let i = 0; i < 18; i++) { const bw = 30 + r() * 70, bh = 80 + r() * 220, bx = i * 60 - 20; x.fillRect(bx, h - bh, bw, bh); x.fillStyle = "rgba(255,200,120,0.85)"; for (let k = 0; k < 10; k++) if (r() < 0.45) x.fillRect(bx + 6 + r() * (bw - 14), h - bh + 10 + r() * (bh - 20), 6, 8); x.fillStyle = "#0a0a26"; }
    } else if (mode === "dusk") {
      for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.5})`; x.beginPath(); x.arc(r() * w, r() * h * 0.4, 1.4, 0, 7); x.fill(); }
      x.fillStyle = "#24183f"; for (let i = 0; i < 16; i++) { const bw = 40 + r() * 80, bh = 120 + r() * 260, bx = i * 66 - 20; x.fillRect(bx, h - bh, bw, bh); x.fillStyle = "rgba(255,210,140,0.95)"; for (let k = 0; k < 14; k++) if (r() < 0.5) x.fillRect(bx + 6 + r() * (bw - 14), h - bh + 10 + r() * (bh - 20), 7, 9); x.fillStyle = "#24183f"; }
    } else {
      x.fillStyle = "rgba(255,250,225,0.95)"; x.shadowColor = "#fff0b0"; x.shadowBlur = 140; x.beginPath(); x.arc(w * 0.32, h * 0.62, 95, 0, 7); x.fill(); x.shadowBlur = 0;
      for (let i = 0; i < 7; i++) { x.fillStyle = "rgba(255,255,255,0.55)"; const cx = r() * w, cy = h * (0.15 + r() * 0.3); for (let k = 0; k < 5; k++) { x.beginPath(); x.arc(cx + k * 34, cy + Math.sin(k) * 8, 30 + r() * 20, 0, 7); x.fill(); } }
      x.fillStyle = "#e58a72"; for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(i * 130 + r() * 40, h + 40, 140 + r() * 60, 0, 7); x.fill(); }
    }
  });
}
