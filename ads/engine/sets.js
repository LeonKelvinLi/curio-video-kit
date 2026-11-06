// Sets: a bedroom at 2 AM, a dining room (dinner or breakfast light), the rabbit-hole tunnel, and the seabed diorama.
import * as THREE from "three";
import { LI, put, C, sh, mat, vinyl, cloth, glow, rbox, mesh, roundedRectGeo, woodTex, paintTex, quiltTex, skyTex, canvasTexture, makeCard } from "./toys.js";

const D = Math.PI / 180;

function digitTex(text, color = "#ff5a4e") {
  return canvasTexture(512, 256, (x, w, h) => {
    x.fillStyle = "#0b0608"; x.fillRect(0, 0, w, h);
    x.font = "700 170px 'Hanken Grotesk', sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillStyle = "rgba(255,90,78,0.08)"; x.fillText("8:88", w / 2, h / 2 + 8);
    x.shadowColor = color; x.shadowBlur = 24; x.fillStyle = color; x.fillText(text, w / 2, h / 2 + 8);
  });
}

function windowUnit(skyMode, w, h, frameColor) {
  const g = new THREE.Group();
  const sky = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: skyTex(skyMode), color: new THREE.Color(skyMode === "morning" ? 1.35 : 1.0, skyMode === "morning" ? 1.35 : 1.0, skyMode === "morning" ? 1.35 : 1.0) }), 0, 0, -0.03);
  g.add(sky);
  const fm = vinyl(frameColor, { roughness: 0.6 }); const t = 0.05;
  g.add(mesh(rbox(w + t * 2, t, 0.08, 0.02), fm, 0, h / 2 + t / 2, 0)); g.add(mesh(rbox(w + t * 2, t * 1.6, 0.16, 0.02), fm, 0, -h / 2 - t * 0.8, 0.04));
  g.add(mesh(rbox(t, h, 0.08, 0.02), fm, -w / 2 - t / 2, 0, 0)); g.add(mesh(rbox(t, h, 0.08, 0.02), fm, w / 2 + t / 2, 0, 0));
  g.add(mesh(rbox(0.025, h, 0.04, 0.01), fm, 0, 0, 0)); g.add(mesh(rbox(w, 0.025, 0.04, 0.01), fm, 0, h * 0.1, 0));
  sh(g); sky.castShadow = false; sky.receiveShadow = false;
  return g;
}
function curtains(color, h, xs) {
  const g = new THREE.Group(), m = cloth(color);
  for (const x0 of xs) for (let i = 0; i < 6; i++) { const c = mesh(new THREE.CylinderGeometry(0.045, 0.055, h, 14), m, x0 + i * 0.062 * Math.sign(x0 || 1), 0, (i % 2) * 0.02); g.add(c); }
  return sh(g);
}

// ---------------------------------------------------------------- bedroom
export function makeBedroom(E, o = {}) {
  const root = new THREE.Group(); const R = {};
  const wall = mat("#262a63", { map: paintTex("#ffffff", 3, 0.05), roughness: 0.95 });
  const floor = mesh(new THREE.PlaneGeometry(8, 8), mat("#8a5a3a", { map: woodTex("#7d4e31"), roughness: 0.62 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; root.add(floor);
  const back = mesh(new THREE.PlaneGeometry(8, 4.5), wall, 0, 2.25, -1.62); back.receiveShadow = true; root.add(back);
  const left = mesh(new THREE.PlaneGeometry(8, 4.5), wall, -1.7, 2.25, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true; root.add(left);
  const right = mesh(new THREE.PlaneGeometry(8, 4.5), wall, 2.2, 2.25, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true; root.add(right);
  root.add(sh(mesh(rbox(8, 0.12, 0.03, 0.01), mat("#1a1d48"), 0, 0.06, -1.6)));
  // bed
  const wood = vinyl("#6b4a7a", { roughness: 0.55 });
  const bed = new THREE.Group(); bed.position.set(0.1, 0, -0.85); root.add(bed); R.bed = bed;
  bed.add(mesh(rbox(1.26, 0.3, 1.62, 0.06), wood, 0, 0.17, 0));
  bed.add(mesh(rbox(1.16, 0.2, 1.52, 0.08), cloth("#f2eefb"), 0, 0.4, 0));
  const head = mesh(rbox(1.3, 0.95, 0.1, 0.05), cloth("#5b4c9a"), 0, 0.62, -0.77); bed.add(head);
  for (let i = -1; i <= 1; i++) bed.add(mesh(rbox(0.38, 0.62, 0.06, 0.08), cloth("#6a5aad"), i * 0.41, 0.78, -0.71));
  const duvet = mesh(rbox(1.24, 0.17, 1.02, 0.08, 6), cloth("#ffffff", { map: quiltTex(["#7b5cff", "#ff8ad8", "#2fb7a5", "#ffb35c", "#3b3f9e", "#cbb8ff", "#e9e4ff"]) }), 0, 0.585, 0.25); bed.add(duvet); R.duvet = duvet;
  bed.add(mesh(rbox(1.25, 0.06, 0.16, 0.03), cloth("#f7f3ff"), 0, 0.66, -0.2));
  const pl = mesh(rbox(0.46, 0.14, 0.3, 0.07), cloth("#efeaff"), -0.27, 0.6, -0.56); pl.rotation.x = -0.5; bed.add(pl);
  const pr = mesh(rbox(0.46, 0.14, 0.3, 0.07), cloth("#ffd6ef"), 0.27, 0.6, -0.56); pr.rotation.x = -0.45; bed.add(pr);
  sh(bed);
  // nightstand, lamp, clock
  const ns = new THREE.Group(); ns.position.set(1.08, 0, -1.3); root.add(ns); R.nightstand = ns;
  ns.add(mesh(rbox(0.5, 0.52, 0.42, 0.04), vinyl("#8a5ccf", { roughness: 0.5 }), 0, 0.26, 0));
  ns.add(mesh(rbox(0.44, 0.17, 0.02, 0.02), vinyl("#9a6fe0", { roughness: 0.5 }), 0, 0.33, 0.21));
  ns.add(mesh(new THREE.SphereGeometry(0.022, 12, 8), vinyl("#ffd28a"), 0, 0.33, 0.225));
  const lamp = new THREE.Group(); lamp.position.set(0.1, 0.52, -0.05); ns.add(lamp);
  lamp.add(mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.04, 24), vinyl("#f2c8a0"), 0, 0.02, 0));
  lamp.add(mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 10), vinyl("#f2c8a0"), 0, 0.15, 0));
  const shade = mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.18, 32, 1, true), new THREE.MeshStandardMaterial({ color: "#ffe2b8", emissive: "#ffb066", emissiveIntensity: 0.8, side: THREE.DoubleSide, roughness: 0.9 }), 0, 0.33, 0);
  lamp.add(shade); lamp.add(mesh(new THREE.SphereGeometry(0.035, 16, 12), glow("#fff1d6", 2.2), 0, 0.29, 0));
  sh(ns); shade.castShadow = false;
  const lampLight = new THREE.PointLight("#ffb46b", (1.1) * LI, 0, 2); lampLight.position.set(1.18, 0.82, -1.35); lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(1024, 1024); lampLight.shadow.bias = -0.002; lampLight.shadow.radius = 4; root.add(lampLight); R.lampLight = lampLight;
  E.softLights.push({ light: lampLight, base: lampLight.position.clone(), radius: 0.08 });
  const clock = new THREE.Group(); clock.position.set(-0.13, 0.565, 0.09); clock.rotation.y = -0.45; ns.add(clock);
  clock.add(sh(mesh(rbox(0.2, 0.1, 0.08, 0.025), vinyl("#2a2230", { roughness: 0.35 }))));
  R.clockTex = digitTex(o.clock || "2:07");
  clock.add(mesh(new THREE.PlaneGeometry(0.17, 0.075), new THREE.MeshBasicMaterial({ map: R.clockTex, color: new THREE.Color(1.6, 1.6, 1.6) }), 0, 0, 0.041));
  R.clock = clock;
  // window + curtains
  const win = windowUnit("night", 0.78, 1.0, "#3a3480"); win.position.set(-0.95, 1.45, -1.6); root.add(win); R.window = win;
  const cur = curtains("#4a2f86", 1.55, [-0.44, 0.44]); cur.position.set(-0.95, 1.42, -1.5); root.add(cur);
  put(root, sh(mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.3, 10), vinyl("#d9c7ff"), -0.95, 2.22, -1.5))).rotation.z = Math.PI / 2;
  // shelf with books and a plant
  const shelf = new THREE.Group(); shelf.position.set(1.05, 1.42, -1.5); root.add(shelf);
  shelf.add(mesh(rbox(0.7, 0.035, 0.2, 0.01), vinyl("#d9b48c", { roughness: 0.6 })));
  const bc = ["#ff8ad8", "#2fb7a5", "#ffb35c", "#7b5cff", "#f2eefb", "#ff6b6b"]; let bx = -0.3;
  bc.forEach((c, i) => { const bh = 0.17 + ((i * 37) % 7) / 70, bw = 0.04 + ((i * 13) % 3) / 100; const b = mesh(rbox(bw, bh, 0.15, 0.008), vinyl(c, { roughness: 0.65 }), bx + bw / 2, bh / 2 + 0.018, 0); if (i === 5) b.rotation.z = -0.25; shelf.add(b); bx += bw + 0.008; });
  shelf.add(mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 18), vinyl("#f2eefb"), 0.24, 0.058, 0));
  for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; shelf.add(mesh(new THREE.SphereGeometry(0.045, 12, 10), vinyl("#3fbf7f", { roughness: 0.7 }), 0.24 + Math.cos(a) * 0.035, 0.13 + (i % 2) * 0.03, Math.sin(a) * 0.035)); }
  sh(shelf);
  // rug + slippers
  const rug = mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.012, 64), cloth("#b49cff", { map: paintTex("#ffffff", 9, 0.08) }), 0.25, 0.006, 0.55); rug.receiveShadow = true; root.add(rug);
  put(root, mesh(new THREE.TorusGeometry(0.85, 0.02, 8, 64), cloth("#ff8ad8"), 0.25, 0.014, 0.55)).rotation.x = Math.PI / 2;
  for (const sx of [0, 1]) { const s = mesh(rbox(0.11, 0.06, 0.22, 0.04), cloth("#ff9ad8"), 0.78 + sx * 0.14, 0.03, 0.12 + sx * 0.03); s.rotation.y = 0.2 + sx * 0.1; root.add(sh(s)); }
  // lights
  const hemi = new THREE.HemisphereLight("#5a5fc0", "#2a1838", (0.85) * LI); root.add(hemi); R.hemi = hemi;
  const moon = new THREE.DirectionalLight("#9fb2ff", (1.35) * LI); moon.position.set(-1.5, 2.6, -3.2); moon.target.position.set(0.1, 0.5, -0.5);
  moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 0.5, far: 9 }); moon.shadow.bias = -0.0008; moon.shadow.normalBias = 0.02;
  root.add(moon); root.add(moon.target); R.moon = moon;
  E.softLights.push({ light: moon, base: moon.position.clone(), radius: 0.25 });
  const rim = new THREE.SpotLight("#c49bff", (3) * LI, 6, 32 * D, 0.7, 2); rim.position.set(-1.2, 2.4, -1.2); rim.target.position.set(0.1, 0.9, -1.0); root.add(rim); root.add(rim.target); R.rim = rim;
  const glowL = new THREE.PointLight("#dfe3ff", (0.0) * LI, 1.6, 2); root.add(glowL); R.phoneLight = glowL;
  return { root, R };
}

// ---------------------------------------------------------------- dining room (night dinner / morning breakfast)
export function makeDining(E, o = {}) {
  const mode = o.mode || "night", night = mode === "night";
  const root = new THREE.Group(); const R = {};
  const wallCol = night ? "#1f3f45" : "#f1c7a6";
  const wall = mat(wallCol, { map: paintTex("#ffffff", 5, 0.05), roughness: 0.95 });
  const floor = mesh(new THREE.PlaneGeometry(10, 10), mat("#a06a44", { map: woodTex(night ? "#7c4c2e" : "#b07a4c", 8), roughness: 0.6 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; root.add(floor);
  const back = mesh(new THREE.PlaneGeometry(10, 5), wall, 0, 2.5, -2.0); back.receiveShadow = true; root.add(back);
  const left = mesh(new THREE.PlaneGeometry(10, 5), wall, -2.4, 2.5, 0); left.rotation.y = Math.PI / 2; left.receiveShadow = true; root.add(left);
  const right = mesh(new THREE.PlaneGeometry(10, 5), wall, 2.6, 2.5, 0); right.rotation.y = -Math.PI / 2; right.receiveShadow = true; root.add(right);
  // wainscot
  root.add(sh(mesh(rbox(10, 0.9, 0.04, 0.01), mat(night ? "#173236" : "#e7b996", { roughness: 0.8 }), 0, 0.45, -1.98)));
  root.add(sh(mesh(rbox(10, 0.05, 0.07, 0.015), vinyl(night ? "#2c5a60" : "#fff1e2"), 0, 0.92, -1.96)));
  const win = windowUnit(night ? "dusk" : "morning", 1.4, 1.15, night ? "#2c5a60" : "#fff1e2"); win.position.set(-0.45, 1.65, -1.98); root.add(win); R.window = win;
  // a framed print
  const art = makeCard(canvasTexture(512, 640, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#ff8ad8"); gr.addColorStop(1, "#7b5cff"); x.fillStyle = gr; x.fillRect(0, 0, w, h); x.fillStyle = "rgba(255,255,255,0.85)"; x.beginPath(); x.arc(w * 0.5, h * 0.42, 120, 0, 7); x.fill(); x.fillStyle = "#2fb7a5"; x.fillRect(0, h * 0.72, w, h * 0.28); }), 0.42, 0.52, 0.01, { bright: 0.9 });
  art.position.set(1.25, 1.75, -1.97); root.add(art);
  // table
  const tw = vinyl(night ? "#7a4b2e" : "#c99467", { roughness: 0.45, clearcoat: 0.5 });
  const table = new THREE.Group(); root.add(table); R.table = table;
  table.add(mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.055, 72), tw, 0, 0.62, 0));
  table.add(mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.6, 24), tw, 0, 0.31, 0));
  table.add(mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.04, 40), tw, 0, 0.02, 0));
  const plateM = vinyl("#fbf7f0", { roughness: 0.3, clearcoat: 0.8 });
  R.seats = [];
  const seatAng = o.seats || [0, 90, 180, 270];
  seatAng.forEach((a, i) => {
    const ar = a * D, px = Math.sin(ar), pz = Math.cos(ar);
    const plate = mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.018, 40), plateM, px * 0.52, 0.656, pz * 0.52); table.add(plate);
    put(table, mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 40), plateM, px * 0.52, 0.667, pz * 0.52)).rotation.x = Math.PI / 2;
    if (night) {
      for (let k = 0; k < 7; k++) table.add(mesh(new THREE.SphereGeometry(0.03, 10, 8), vinyl(k % 3 ? "#f2c35a" : "#e8543f", { roughness: 0.5 }), px * 0.52 + Math.cos(k * 2.4) * 0.05, 0.69, pz * 0.52 + Math.sin(k * 2.4) * 0.05));
      const gl = mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 20, 1, true), new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 0, transparent: true, opacity: 0.35, side: THREE.DoubleSide, clearcoat: 1 }), px * 0.52 + pz * 0.2, 0.71, pz * 0.52 - px * 0.2); table.add(gl);
      table.add(mesh(new THREE.CylinderGeometry(0.03, 0.027, 0.06, 20), vinyl("#8e1f3a", { roughness: 0.2, transparent: true, opacity: 0.85 }), px * 0.52 + pz * 0.2, 0.685, pz * 0.52 - px * 0.2));
    } else {
      const mug = new THREE.Group(); mug.position.set(px * 0.52 + pz * 0.2, 0.65, pz * 0.52 - px * 0.2); table.add(mug);
      mug.add(mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 24), vinyl(["#ff8ad8", "#2fb7a5", "#ffb35c", "#7b5cff"][i % 4]), 0, 0.05, 0));
      put(mug, mesh(new THREE.TorusGeometry(0.028, 0.009, 8, 16), vinyl(["#ff8ad8", "#2fb7a5", "#ffb35c", "#7b5cff"][i % 4]), 0.05, 0.055, 0)).rotation.y = 0;
      mug.add(mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.004, 20), mat("#5a3420"), 0, 0.093, 0));
      for (let k = 0; k < 2; k++) table.add(mesh(rbox(0.09, 0.02, 0.09, 0.012), vinyl("#d99a52", { roughness: 0.8 }), px * 0.5 + k * 0.03, 0.675 + k * 0.02, pz * 0.5));
    }
    // chair
    const ch = new THREE.Group(); ch.position.set(px * 1.02, 0, pz * 1.02); ch.rotation.y = ar + Math.PI; root.add(ch);
    const cm = vinyl(night ? "#e8d9c4" : "#f6efe4", { roughness: 0.55 });
    ch.add(mesh(rbox(0.42, 0.05, 0.4, 0.02), cm, 0, 0.38, 0));
    ch.add(mesh(rbox(0.42, 0.42, 0.045, 0.02), cm, 0, 0.62, -0.19));
    for (const [lx, lz] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]]) ch.add(mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.37, 10), cm, lx, 0.18, lz));
    sh(ch);
    R.seats.push({ angle: a, x: px * 0.98, z: pz * 0.98, chair: ch });
  });
  if (night) {
    for (const [cx, cz, hh] of [[-0.08, 0.02, 0.2], [0.07, -0.05, 0.16]]) {
      table.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, hh, 14), vinyl("#fff4e0"), cx, 0.65 + hh / 2, cz));
      put(table, mesh(new THREE.SphereGeometry(0.016, 10, 8), glow("#ffb347", 5), cx, 0.66 + hh + 0.012, cz)).scale.set(0.7, 1.4, 0.7);
    }
    put(table, mesh(new THREE.SphereGeometry(0.16, 24, 16, 0, 6.29, 0, 1.6), vinyl("#f6efe4", { roughness: 0.3 }), 0.2, 0.68, 0.18)).rotation.x = Math.PI;
    for (let k = 0; k < 9; k++) table.add(mesh(new THREE.SphereGeometry(0.04, 10, 8), vinyl(k % 2 ? "#5bbf6a" : "#3f9a55"), 0.2 + Math.cos(k) * 0.07, 0.7, 0.18 + Math.sin(k) * 0.07));
    const bread = mesh(new THREE.CapsuleGeometry(0.05, 0.16, 6, 14), vinyl("#d99a52", { roughness: 0.75 }), -0.22, 0.69, -0.12); bread.rotation.z = Math.PI / 2; bread.rotation.y = 0.5; table.add(bread);
  } else {
    table.add(mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.16, 20), new THREE.MeshPhysicalMaterial({ color: "#ffa62b", roughness: 0.2, transparent: true, opacity: 0.9 }), 0.05, 0.73, 0.08));
    put(table, mesh(new THREE.SphereGeometry(0.15, 24, 12, 0, 6.29, 0, 1.4), vinyl("#fff3e3"), -0.12, 0.7, -0.08)).rotation.x = Math.PI;
    for (let k = 0; k < 5; k++) table.add(mesh(new THREE.SphereGeometry(0.05, 12, 10), vinyl(["#ff6b4a", "#ffd34a", "#7ccf5a"][k % 3]), -0.12 + Math.cos(k * 1.3) * 0.06, 0.72, -0.08 + Math.sin(k * 1.3) * 0.06));
  }
  sh(table);
  // pendant lamp
  const pend = new THREE.Group(); pend.position.set(0, 1.62, 0); root.add(pend); R.pendant = pend;
  pend.add(mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.6, 6), mat("#222"), 0, 0.85, 0));
  pend.add(mesh(new THREE.ConeGeometry(0.26, 0.2, 40, 1, true), new THREE.MeshStandardMaterial({ color: night ? "#2fb7a5" : "#ff8ad8", side: THREE.FrontSide, roughness: 0.5 }), 0, 0.05, 0));
  pend.add(mesh(new THREE.ConeGeometry(0.255, 0.195, 40, 1, true), new THREE.MeshStandardMaterial({ color: "#fff1d6", emissive: "#ffcf8a", emissiveIntensity: night ? 1.6 : 0.25, side: THREE.BackSide }), 0, 0.05, 0));
  pend.add(mesh(new THREE.SphereGeometry(0.05, 16, 12), glow("#fff3dc", night ? 5 : 1.5), 0, -0.04, 0));
  const pl = new THREE.SpotLight("#ffc98a", (night ? 4.2 : 1.0) * LI, 5, 58 * D, 0.65, 2); pl.position.set(0, 1.55, 0); pl.target.position.set(0, 0.6, 0);
  pl.castShadow = true; pl.shadow.mapSize.set(2048, 2048); pl.shadow.bias = -0.0015; root.add(pl); root.add(pl.target); R.pendLight = pl;
  E.softLights.push({ light: pl, base: pl.position.clone(), radius: 0.12 });
  const amb = new THREE.HemisphereLight(night ? "#6f86c9" : "#ffe9d6", night ? "#2a1a14" : "#b07a5c", (night ? 0.48 : 0.42) * LI); root.add(amb); R.hemi = amb;
  const key = new THREE.DirectionalLight(night ? "#8fa6ff" : "#ffd29a", (night ? 0.3 : 1.05) * LI);
  key.position.set(-1.0, 2.6, -3.8); key.target.position.set(0.2, 0.6, 0.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 10 }); key.shadow.bias = -0.0008; key.shadow.normalBias = 0.02;
  root.add(key); root.add(key.target); R.key = key;
  E.softLights.push({ light: key, base: key.position.clone(), radius: night ? 0.3 : 0.12 });
  if (!night) { // sunbeam: soft additive shaft through the window
    const beam = mesh(new THREE.CylinderGeometry(0.55, 0.9, 3.2, 32, 1, true), new THREE.MeshBasicMaterial({ color: "#ffcf8a", transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), -0.3, 1.2, -0.6);
    beam.rotation.x = 0.85; beam.rotation.z = -0.25; root.add(beam); R.beam = beam;
  }
  return { root, R };
}

// ---------------------------------------------------------------- the rabbit hole: a tunnel of real Curio cards
export function makeTunnel(E, cardTextures, o = {}) {
  const root = new THREE.Group(); const R = {};
  const pts = []; for (let i = 0; i <= 24; i++) { const z = -i * 3; pts.push(new THREE.Vector3(Math.sin(i * 0.55) * 0.9, Math.cos(i * 0.4) * 0.6, z)); }
  const curve = new THREE.CatmullRomCurve3(pts); R.curve = curve;
  const N = o.cards || 130; R.cards = [];
  for (let i = 0; i < N; i++) {
    const u = 0.02 + (i / N) * 0.9, p = curve.getPointAt(u), tan = curve.getTangentAt(u);
    const a = i * 2.39996, rad = 0.78 + ((i * 7) % 5) * 0.1;
    const n1 = new THREE.Vector3(0, 1, 0).cross(tan).normalize(), n2 = tan.clone().cross(n1).normalize();
    const pos = p.clone().addScaledVector(n1, Math.cos(a) * rad).addScaledVector(n2, Math.sin(a) * rad);
    const card = makeCard(cardTextures[i % cardTextures.length], 0.36, 0.78, 0.03, { bright: 1.3 });
    card.position.copy(pos); card.lookAt(p.clone().addScaledVector(tan, 1.2)); card.rotateY(Math.PI); card.rotateZ((((i * 31) % 17) / 17 - 0.5) * 0.6);
    card.userData.base = card.quaternion.clone(); card.userData.i = i; root.add(card); R.cards.push(card);
  }
  const ringM = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ff8ad8").multiplyScalar(2.2) }), ringM2 = new THREE.MeshBasicMaterial({ color: new THREE.Color("#9b7bff").multiplyScalar(2.2) });
  for (let i = 0; i < 22; i++) {
    const u = 0.03 + i * 0.043; const p = curve.getPointAt(u), tan = curve.getTangentAt(u);
    const ring = mesh(new THREE.TorusGeometry(2.1, 0.012, 8, 120), i % 2 ? ringM : ringM2); ring.position.copy(p); ring.lookAt(p.clone().add(tan)); root.add(ring);
  }
  // sparkles
  const sp = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.02, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff0fb").multiplyScalar(3) }), 500);
  const m4 = new THREE.Matrix4(); for (let i = 0; i < 500; i++) { const u = (i * 0.618) % 1 * 0.95, p = curve.getPointAt(u); const a = i * 1.7, rr = 0.3 + ((i * 13) % 11) / 6; m4.makeTranslation(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, p.z + ((i * 7) % 5) / 5); sp.setMatrixAt(i, m4); }
  root.add(sp);
  root.add(new THREE.HemisphereLight("#b89bff", "#2a0f3a", (1.2) * LI));
  return { root, R };
}

// ---------------------------------------------------------------- seabed diorama: the upturned tug and the air pocket
export function makeSea(E, figure) {
  const root = new THREE.Group(); const R = {};
  const sandG = new THREE.PlaneGeometry(14, 14, 120, 120); const p = sandG.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, Math.sin(x * 1.3) * 0.05 + Math.cos(y * 0.9 + x * 0.4) * 0.07 + Math.sin(x * 4 + y * 3) * 0.012); }
  sandG.computeVertexNormals();
  const sand = mesh(sandG, mat("#c9b48a", { roughness: 0.95, map: paintTex("#ffffff", 21, 0.1) })); sand.rotation.x = -Math.PI / 2; sand.receiveShadow = true; root.add(sand);
  // upturned hull, open at the front so we can see the air pocket inside
  const hull = new THREE.Group(); hull.position.set(0, 0.02, -0.6); hull.rotation.z = 0.06; root.add(hull); R.hull = hull;
  const hm = vinyl("#c4492f", { roughness: 0.55, side: THREE.DoubleSide }), dark = vinyl("#5a1a14", { roughness: 0.7 });
  const shell = mesh(new THREE.CylinderGeometry(0.82, 0.82, 2.4, 64, 1, true, Math.PI / 2, Math.PI), hm); shell.rotation.x = Math.PI / 2; hull.add(shell);
  hull.add(mesh(rbox(0.1, 0.1, 2.5, 0.03), dark, 0, 0.85, 0));
  const stripe = mesh(new THREE.CylinderGeometry(0.835, 0.835, 0.12, 64, 1, true, Math.PI / 2, Math.PI), vinyl("#f2eadc", { side: THREE.DoubleSide })); stripe.rotation.x = Math.PI / 2; stripe.position.z = 0.9; hull.add(stripe);
  for (const z of [-0.6, 0, 0.6]) for (const sx of [-1, 1]) { const ring = mesh(new THREE.TorusGeometry(0.07, 0.015, 8, 20), vinyl("#d9d2c4"), sx * 0.66, 0.46, z); ring.rotation.y = Math.PI / 2; ring.rotation.x = sx * 0.6; hull.add(ring);
    const glass = mesh(new THREE.CircleGeometry(0.065, 20), glow("#9fe6ff", 0.6), sx * 0.67, 0.46, z); glass.rotation.y = sx * Math.PI / 2; glass.rotation.x = sx * 0.6; hull.add(glass); }
  const prop = new THREE.Group(); prop.position.set(0, 0.55, -1.25); hull.add(prop); R.prop = prop;
  for (let k = 0; k < 3; k++) { const b = mesh(rbox(0.06, 0.24, 0.02, 0.01), vinyl("#c9a24a", { metalness: 0.6, roughness: 0.3 }), 0, 0.12, 0); const g = new THREE.Group(); g.rotation.z = k * 2.09; g.add(b); prop.add(g); }
  sh(hull);
  // the air pocket: a glowing bubble under the top of the hull, and the water line inside
  const pocket = mesh(new THREE.SphereGeometry(0.6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: "#e6fbff", roughness: 0.05, transparent: true, opacity: 0.12, clearcoat: 1, side: THREE.DoubleSide, emissive: "#7fe0ff", emissiveIntensity: 0.16, depthWrite: false }), 0, 0.42, -0.45);
  pocket.scale.set(1.05, 0.68, 1.5); root.add(pocket); R.pocket = pocket;
  const water = mesh(new THREE.CircleGeometry(0.62, 48), new THREE.MeshPhysicalMaterial({ color: "#7fe0ff", roughness: 0.1, transparent: true, opacity: 0.35, clearcoat: 1, emissive: "#3fb8d8", emissiveIntensity: 0.3, side: THREE.DoubleSide, depthWrite: false }), 0, 0.42, -0.45);
  water.rotation.x = -Math.PI / 2; water.scale.set(1.05, 1.5, 1); root.add(water); R.water = water;
  if (figure) { figure.scale.setScalar(0.52); root.add(figure); }
  const torch = new THREE.PointLight("#bff3ff", 0.3 * LI, 1.6, 2); torch.position.set(0.05, 0.62, -0.25); root.add(torch); R.torch = torch;
  // rocks + kelp
  const rockM = mat("#556070", { roughness: 0.95, flatShading: true });
  for (let i = 0; i < 14; i++) { const a = i * 2.1, r = 1.6 + (i % 5) * 0.5; const k = mesh(new THREE.DodecahedronGeometry(0.15 + (i % 4) * 0.08, 0), rockM, Math.cos(a) * r, 0.05, Math.sin(a) * r - 0.6); k.scale.y = 0.6; k.rotation.set(i, i * 2, 0); root.add(sh(k)); }
  R.kelp = [];
  for (let i = 0; i < 16; i++) { const a = i * 2.7 + 0.5, r = 1.4 + (i % 6) * 0.45; const g = new THREE.Group(); g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 0.6); root.add(g);
    const segs = []; let parent = g; for (let s = 0; s < 6; s++) { const j = new THREE.Group(); j.position.y = s ? 0.16 : 0; parent.add(j); j.add(mesh(new THREE.CapsuleGeometry(0.025, 0.12, 4, 8), vinyl(i % 3 ? "#2f9a6a" : "#4fbf7a", { roughness: 0.7 }), 0, 0.08, 0)); segs.push(j); parent = j; }
    sh(g); R.kelp.push({ g, segs, ph: i * 0.7 }); }
  // god rays and bubbles
  const rayM = new THREE.MeshBasicMaterial({ color: "#8fe9ff", transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  R.rays = []; for (let i = 0; i < 7; i++) { const r = mesh(new THREE.CylinderGeometry(0.08, 0.45, 6, 16, 1, true), rayM, -1.5 + i * 0.55, 3, -1.2 + (i % 3) * 0.4); r.rotation.z = 0.25; root.add(r); R.rays.push(r); }
  R.bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(0.02, 12, 8), new THREE.MeshPhysicalMaterial({ color: "#e8fbff", roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, emissive: "#6fd8ff", emissiveIntensity: 0.25 }), 120);
  root.add(R.bubbles);
  root.add(new THREE.HemisphereLight("#7fd6ff", "#0b2a3a", (0.55) * LI));
  const sun = new THREE.DirectionalLight("#b8f0ff", (0.8) * LI); sun.position.set(0.6, 6, 1.5); sun.target.position.set(0, 0, -0.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 12 }); root.add(sun); root.add(sun.target);
  E.softLights.push({ light: sun, base: sun.position.clone(), radius: 0.4 });
  return { root, R };
}
export function animateSea(R, t) {
  for (const k of R.kelp) k.segs.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.1 + k.ph + i * 0.5) * 0.12; s.rotation.x = Math.cos(t * 0.8 + k.ph + i * 0.4) * 0.08; });
  const m4 = new THREE.Matrix4(), s = new THREE.Vector3();
  for (let i = 0; i < 120; i++) { const sp = 0.25 + (i % 7) * 0.05, y = ((t * sp + i * 0.37) % 3.2), x = Math.cos(i * 2.3) * (0.3 + (i % 9) * 0.25) + Math.sin(t + i) * 0.03, z = Math.sin(i * 1.7) * 1.2 - 0.4; const sc = 0.5 + (i % 4) * 0.4; m4.compose(s.set(x, y + 0.1, z), new THREE.Quaternion(), new THREE.Vector3(sc, sc, sc)); R.bubbles.setMatrixAt(i, m4); }
  R.bubbles.instanceMatrix.needsUpdate = true;
  R.rays.forEach((r, i) => { r.material.opacity = 0.035 + 0.02 * Math.sin(t * 0.7 + i); });
}
