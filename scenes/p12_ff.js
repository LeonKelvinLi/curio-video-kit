/* P12 footage-first · Gemini 8 stuck thruster, 16 Mar 1966. Facts: Wikipedia "Gemini 8"; NASA. OAMS thruster No. 8 stuck on;
   the roll reached ~296 deg/s; Armstrong shut OAMS down and used the re-entry control (nose) thrusters to stop it; mission aborted,
   crew recovered in the Pacific. Real footage/photos: assets/src/p12/sources.json. Diagram: top view, simplified, roll drawn at
   the real rate. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, poly } = K, Wd = WORDS, w = (re, n) => Wd[K.ix(Wd, re, n)].s, SY = y => y - 420;
  const tStuck = w(/^stuck$/), t296 = w(/^ninety-six$/), tDown = w(/^down/), tFired = w(/^fired$/), tIt = w(/^it,?$/);
  const omega = t => (t < tStuck ? 0 : t < tFired ? 296 * E.in(inv(tStuck, t296 + 0.3, t)) : 296 * (1 - E.out(inv(tFired, tIt, t)))); // deg/s
  const angle = t => { let a = 0; const n = 600, dt = t / n; for (let i = 0; i < n; i++) a += omega((i + 0.5) * dt) * dt; return a; };
  function jet(c, x, y, dir, len, a) { // thruster plume pointing along dir (radians)
    if (a <= 0) return; c.save(); c.translate(x, y); c.rotate(dir); const L = len;
    const g = c.createLinearGradient(0, 0, L, 0); g.addColorStop(0, `rgba(255,236,180,${a})`); g.addColorStop(1, "rgba(255,120,40,0)"); c.fillStyle = g; poly(c, [[0, -16], [L, -46], [L, 46], [0, 16]]); c.fill(); c.restore();
  }
  window.DIAGRAMS = {
    spin(c, t, vp, p, b) {
      const cx = 540, cy = SY(1040), th = angle(t) * Math.PI / 180, stuckOn = t >= tStuck && t < tDown, nose = t >= tFired && t < tIt;
      for (let i = 0; i < 70; i++) circ(c, K.hash(i) * 1080, SY(640) + K.hash(i + 1) * 980, 2 + 2 * K.hash(i + 2), `rgba(255,255,255,${0.25 + 0.5 * K.hash(i + 3)})`);
      // rotation arrow around the craft, brighter as the spin speeds up
      const sp = omega(t) / 296; if (sp > 0.02) { c.save(); c.strokeStyle = `rgba(255,200,61,${0.25 + 0.6 * sp})`; c.lineWidth = 10; c.beginPath(); c.arc(cx, cy, 380, -0.4 + th, 1.9 + th); c.stroke(); const ex = cx + Math.cos(1.9 + th) * 380, ey = cy + Math.sin(1.9 + th) * 380; c.translate(ex, ey); c.rotate(1.9 + th + Math.PI / 2); poly(c, [[0, -26], [30, 8], [-30, 8]], `rgba(255,200,61,${0.25 + 0.6 * sp})`); c.restore(); }
      c.save(); c.translate(cx, cy); c.rotate(th);
      jet(c, 150, 120, Math.PI / 2, 240, stuckOn ? 1 : 0); // OAMS thruster stuck on, near the base
      jet(c, -250, -60, -Math.PI / 2, 200, nose ? 1 : 0); jet(c, -250, 60, Math.PI / 2, 200, 0);
      poly(c, [[-300, -55], [40, -120], [260, -130], [260, 130], [40, 120], [-300, 55]], "#2d343c"); // re-entry module + adapter (top view)
      poly(c, [[40, -120], [260, -130], [260, 130], [40, 120]], "#e6e0d2"); rr(c, -330, -45, 60, 90, 20); c.fillStyle = "#3d454e"; c.fill();
      rr(c, -190, -40, 70, 26, 8); c.fillStyle = "#8fb8d8"; c.fill(); rr(c, -190, 14, 70, 26, 8); c.fill(); // windows
      c.restore();
      K.readout(c, 1010, SY(700), "ROLL RATE", Math.round(omega(t)) + "°/S", { size: 96, color: omega(t) > 290 ? "#ff6b4a" : "#ffffff" });
      const state = t < tStuck ? "" : t < tDown ? "ONE THRUSTER STUCK ON" : t < tFired ? "THAT SYSTEM: OFF" : t < tIt + 0.3 ? "NOSE THRUSTERS FIRE" : "STOPPED";
      if (state) { c.font = `800 52px ${K.DISP}`; const tw = c.measureText(state).width + 40; rr(c, 540 - tw / 2, SY(1470), tw, 76, 14); c.fillStyle = "rgba(6,10,14,.85)"; c.fill(); txt(c, state, 540, SY(1510), `800 52px ${K.DISP}`, state === "STOPPED" ? "#ffc83d" : "#ffffff"); }
    },
  };
})();
window.SPEC = {
  credit: "NASA film, Gemini 8 (1966) · public domain",
  nums: [["nineteen sixty-six", "1966"], ["two hundred ninety-six", "296"]],
  beats: [
    { kind: "clip", src: "window", pw: 1000, z0: 1.0, z1: 1.08, label: "REAL ONBOARD FILM · GEMINI 8", credit: "NASA film 'Gemini 8: This Is Houston Flight' (1966)" },
    { kind: "clip", src: "armstrong", at: /^with$/, pw: 1000, z0: 1.02, z1: 1.08, label: "NEIL ARMSTRONG · 1966", credit: "NASA film 'Gemini 8: This Is Houston Flight' (1966)" },
    { kind: "clip", src: "launch", at: /^In$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL NASA FILM · MARCH 16, 1966", credit: "NASA film 'Gemini 8: This Is Houston Flight' (1966)" },
    { kind: "diagram", diagram: "spin", at: /^a$/, credit: "Curio diagram · roll drawn at the real 296°/s" },
    { kind: "clip", src: "armstrong2", at: [/^Armstrong$/, 1], pw: 1000, z0: 1.0, z1: 1.06, label: "NEIL ARMSTRONG", credit: "NASA film 'Gemini 8: This Is Houston Flight' (1966)" },
    { kind: "diagram", diagram: "spin", at: /^fired$/, credit: "Curio diagram · roll drawn at the real 296°/s" },
    { kind: "clip", src: "deck", at: [/^and$/, 1], pw: 1000, z0: 1.0, z1: 1.05, label: "REAL NASA FILM · BACK ON A NAVY SHIP", credit: "NASA film · USS Leonard F. Mason, March 1966" },
  ],
  stamps: [{ text: "CREW SAFE", at: /^early/, y: 1570, size: 72 }],
};
