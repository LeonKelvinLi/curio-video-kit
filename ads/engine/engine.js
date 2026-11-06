// Curio 3D ad engine: three.js on the GPU in headless Chromium, pure in time.
// Each output frame averages N sub-renders (Halton-jittered shutter time, lens aperture, pixel offset and
// area-light position), which gives real motion blur, depth of field, anti-aliasing and soft shadows.
// Then: bloom -> Khronos neutral tone map (keeps the app UI and brand colours faithful) -> grain/vignette/CA,
// and finally the 2D overlay (captions, chips, stamps) is drawn crisp on top.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { TexturePass } from "three/addons/postprocessing/TexturePass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import * as M from "./motion.js";

export const W = 1080, H = 1920;

function halton(i, b) { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }

const AccumShader = {
  uniforms: { tex: { value: null }, w: { value: 1 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D tex; uniform float w; varying vec2 vUv;
    void main(){ vec4 c=texture2D(tex,vUv); gl_FragColor=vec4(c.rgb*w, w); }`,
};

const FinishShader = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, grain: { value: 0.035 }, vig: { value: 0.32 }, ca: { value: 0.0016 },
              lift: { value: new THREE.Vector3(0, 0, 0) }, tint: { value: new THREE.Vector3(1, 1, 1) }, res: { value: new THREE.Vector2(W, H) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float time, grain, vig, ca; uniform vec3 lift, tint; uniform vec2 res; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + time*17.13) * 43758.5453); }
    void main(){
      vec2 d = vUv - 0.5; float r2 = dot(d*vec2(0.5625,1.0), d*vec2(0.5625,1.0))*3.2;
      vec3 c;
      c.r = texture2D(tDiffuse, vUv - d*ca*r2*4.0).r;
      c.g = texture2D(tDiffuse, vUv).g;
      c.b = texture2D(tDiffuse, vUv + d*ca*r2*4.0).b;
      c = c*tint + lift*(1.0-c);
      c *= 1.0 - vig*smoothstep(0.15, 1.25, r2);
      float n = h(floor(vUv*res)) + h(floor(vUv*res)+0.37) - 1.0;
      c += n*grain*(0.35 + 0.65*(1.0-c));
      gl_FragColor = vec4(clamp(c,0.,1.), 1.0);
    }`,
};

export async function boot(adName, opts) {
  const scale = opts.scale || 1;
  const w = Math.round(W * scale), h = Math.round(H * scale);
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1); renderer.setSize(w, h);
  renderer.domElement.id = "gl"; document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.autoClear = false; // clears are explicit; auto-clear would wipe the accumulation buffer on every sub-frame
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const out = document.createElement("canvas"); out.width = w; out.height = h; document.body.appendChild(out);
  const g = out.getContext("2d");

  const rtOpts = { type: THREE.HalfFloatType, colorSpace: THREE.LinearSRGBColorSpace, depthBuffer: true };
  const rtScene = new THREE.WebGLRenderTarget(w, h, { ...rtOpts, samples: 4 });
  const rtAcc = new THREE.WebGLRenderTarget(w, h, { ...rtOpts, depthBuffer: false });
  const accMat = new THREE.ShaderMaterial({ ...AccumShader, uniforms: THREE.UniformsUtils.clone(AccumShader.uniforms),
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, depthTest: false, depthWrite: false, transparent: true });
  const quadScene = new THREE.Scene(); const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), accMat));

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType }));
  const texPass = new TexturePass(rtAcc.texture);
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.55, 0.55, 0.92);
  const outPass = new OutputPass();
  const finish = new ShaderPass(FinishShader);
  finish.uniforms.res.value.set(w, h);
  composer.addPass(texPass); composer.addPass(bloom); composer.addPass(outPass); composer.addPass(finish);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, w / h, 0.03, 400);

  // ---------- engine context handed to the ad scene ----------
  const imgCache = new Map();
  const E = {
    THREE, M, W, H, scale, w, h, renderer, scene, camera, g, bloom, finish,
    // camera state the scene sets every sub-frame
    cam: { pos: new THREE.Vector3(0, 1, 3), target: new THREE.Vector3(0, 1, 0), fov: 35, focus: null, aperture: 0.0, roll: 0 },
    softLights: [], // {light, base: Vector3, radius}
    img(url) {
      if (imgCache.has(url)) return imgCache.get(url);
      const p = new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error("img " + url)); im.src = url; });
      imgCache.set(url, p);
      if (imgCache.size > 400) imgCache.delete(imgCache.keys().next().value);
      return p;
    },
    tex(url, opts = {}) {
      const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
      E.img(url).then(im => { t.image = im; t.needsUpdate = true; });
      Object.assign(t, opts); return t;
    },
    async texReady(url) { const t = new THREE.Texture(await E.img(url)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; },
    canvasTex(cw, ch) {
      const c = document.createElement("canvas"); c.width = cw; c.height = ch;
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
      return { canvas: c, ctx: c.getContext("2d"), tex: t };
    },
    project(v) { // world -> output pixels (unjittered camera)
      const p = v.clone().project(camera); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z, behind: p.z > 1 };
    },
  };

  const mod = await import(`/scenes/${adName}.js?v=${Date.now()}`);
  const AD = mod.default;
  E.AD = AD; window.E = E;
  await document.fonts.ready;
  for (const f of AD.fonts || []) { try { await document.fonts.load(f); } catch (e) {} }
  await AD.setup(E);

  function applyCamera(sub, nSub) {
    const c = E.cam;
    camera.fov = c.fov; camera.near = c.near || 0.03; camera.far = c.far || 400;
    // lens aperture offset (DoF): move the eye on a disk, keep looking at the focus point
    const focus = c.focus ?? c.pos.distanceTo(c.target);
    const dir = new THREE.Vector3().subVectors(c.target, c.pos).normalize();
    const focusPt = c.pos.clone().addScaledVector(dir, focus);
    let ox = 0, oy = 0;
    if (c.aperture > 0 && nSub > 1) { const a = 2 * Math.PI * halton(sub + 1, 5), r = Math.sqrt(halton(sub + 1, 7)) * c.aperture; ox = Math.cos(a) * r; oy = Math.sin(a) * r; }
    camera.position.copy(c.pos); camera.up.set(0, 1, 0); camera.lookAt(c.target);
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    camera.position.addScaledVector(right, ox).addScaledVector(up, oy);
    camera.lookAt(focusPt);
    if (c.roll) camera.rotateZ(c.roll);
    // sub-pixel jitter
    const jx = nSub > 1 ? halton(sub + 1, 2) - 0.5 : 0, jy = nSub > 1 ? halton(sub + 1, 3) - 0.5 : 0;
    camera.setViewOffset(w, h, jx, jy, w, h);
    camera.updateProjectionMatrix();
  }

  async function renderAt(t, nSub) {
    if (AD.prepare) await AD.prepare(t, E);
    const fps = AD.fps || 30, shutter = (AD.shutter ?? 0.5) / fps;
    renderer.setRenderTarget(rtAcc); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true);
    for (let s = 0; s < nSub; s++) {
      const ts = nSub > 1 ? t + (halton(s + 1, 2) - 0.5) * shutter : t;
      AD.update(ts, E, t);
      for (const sl of E.softLights) {
        if (nSub > 1) { const a = 2 * Math.PI * halton(s + 1, 11), r = Math.sqrt(halton(s + 1, 13)) * sl.radius;
          sl.light.position.set(sl.base.x + Math.cos(a) * r, sl.base.y + Math.sin(a) * r * 0.7, sl.base.z + Math.sin(a) * r * 0.7); }
        else sl.light.position.copy(sl.base);
      }
      applyCamera(s, nSub);
      renderer.setRenderTarget(rtScene); renderer.setClearColor(E.clear ?? 0x05040a, 1); renderer.clear(true, true, true);
      renderer.render(scene, camera);
      if (nSub > 1) renderer.getContext().flush();
      accMat.uniforms.tex.value = rtScene.texture; accMat.uniforms.w.value = 1 / nSub;
      renderer.setRenderTarget(rtAcc); renderer.render(quadScene, quadCam);
    }
    // the scene's state at the frame's centre time drives the overlay and post settings
    AD.update(t, E, t); applyCamera(0, 1);
    finish.uniforms.time.value = t;
    if (AD.post) AD.post(t, E);
    renderer.setRenderTarget(null);
    composer.render();
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h);
    g.drawImage(renderer.domElement, 0, 0);
    g.setTransform(scale, 0, 0, scale, 0, 0);
    if (AD.overlay) await AD.overlay(g, t, E);
    g.setTransform(1, 0, 0, 1, 0, 0);
  }

  window.AD_INFO = { T: AD.T, fps: AD.fps || 30, plan: AD.audioPlan ? AD.audioPlan(E) : null };
  window.renderFrame = async (t, n) => { await renderAt(t, n || opts.samples); return true; };
  window.frameDataURL = async (t, n, type) => { await renderAt(t, n || opts.samples); return out.toDataURL(type || "image/png", 0.95); };
  window.engineReady = true;
  if (opts.preview) { const t0 = performance.now(); const loop = async () => { await renderAt(((performance.now() - t0) / 1000) % AD.T, 1); requestAnimationFrame(loop); }; loop(); }
}
