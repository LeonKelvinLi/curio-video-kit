/* P11 footage-first · Apollo 13's improvised CO2 filter, April 1970. Facts: Wikipedia "Apollo 13"; NASA. The LM Aquarius was built
   for two men for two days; the command module's lithium hydroxide canisters were square and the LM's sockets round; the "mailbox"
   adapter was built from procedure-manual covers, plastic bags, hoses and duct tape; CO2 began dropping. Real photos:
   assets/src/p11/sources.json. Diagram: square canister vs round socket, simplified. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, seg } = K, Wd = WORDS, w = (re, n) => Wd[K.ix(Wd, re, n)].s, SY = y => y - 420;
  const tSpare = w(/^spare$/), tFit = w(/^fit/), tSo = w(/^So$/);
  window.DIAGRAMS = {
    fit(c, t, vp, p, b) {
      const slide = E.io(inv(tSpare - 0.1, tFit, t)), bump = t > tFit ? Math.exp(-6 * (t - tFit)) * Math.sin((t - tFit) * 40) * 18 : 0, nope = E.back(inv(tFit, tFit + 0.3, t));
      // the LM socket: a round opening in a panel
      const sx = 760, sy = SY(1020); rr(c, sx - 190, sy - 230, 380, 460, 30); c.fillStyle = "#59616b"; c.fill(); circ(c, sx, sy, 130, "#11161c"); c.strokeStyle = "#9aa4ae"; c.lineWidth = 10; c.beginPath(); c.arc(sx, sy, 130, 0, 6.29); c.stroke();
      txt(c, "LUNAR MODULE", sx, sy + 290, `800 44px ${K.DISP}`, "#e9eef3"); txt(c, "ROUND SOCKET", sx, sy + 340, `600 34px ${K.DISP}`, "rgba(233,238,243,.7)");
      // the command-module canister: a square box sliding in from the left and stopping at the rim
      const bx = lerp(150, sx - 300, slide) + bump, by = sy; rr(c, bx - 150, by - 150, 300, 300, 18); c.fillStyle = "#d8cfb8"; c.fill();
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) circ(c, bx + i * 50, by + j * 50, 12, "#b5ab92");
      txt(c, "COMMAND MODULE", 230, sy - 290, `800 44px ${K.DISP}`, "#e9eef3"); txt(c, "SQUARE FILTER", 230, sy - 240, `600 34px ${K.DISP}`, "rgba(233,238,243,.7)");
      if (nope > 0) { c.save(); c.globalAlpha = clamp(nope); c.strokeStyle = "#ff4d4d"; c.lineWidth = 22; c.lineCap = "round"; const r = 110 * nope; seg(c, sx - 300 - r, by - r, sx - 300 + r, by + r); seg(c, sx - 300 + r, by - r, sx - 300 - r, by + r); c.restore(); }
    },
  };
})();
window.SPEC = {
  credit: "NASA · public domain",
  nums: [["thirteen's", "13's"]],
  beats: [
    { kind: "photo", src: "filter", pw: 940, maxH: 940, z0: 1.0, z1: 1.06, label: "REAL NASA PHOTO · APRIL 1970", credit: "NASA photo AS13-62-8929 · public domain" },
    { kind: "photo", src: "sm", at: /^After$/, pw: 1000, z0: 1.0, z1: 1.08, label: "REAL NASA PHOTO · SERVICE MODULE", credit: "NASA photo AS13-59-8500 (crop) · public domain" },
    { kind: "photo", src: "crew", at: /^three$/, pw: 720, z0: 1.0, z1: 1.05, label: "THE CREW", credit: "NASA photo S70-36485 · Lovell, Swigert, Haise" },
    { kind: "photo", src: "lm", at: /^lunar$/, pw: 900, z0: 1.0, z1: 1.06, label: "REAL NASA PHOTO · LUNAR MODULE", credit: "NASA photo AS13-59-8562 · public domain" },
    { kind: "diagram", diagram: "fit", at: /^The$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "build", at: /^So$/, pw: 940, z0: 1.0, z1: 1.06, label: "REAL NASA PHOTO · ON BOARD", credit: "NASA photo AS13-62-9004 · public domain" },
    { kind: "photo", src: "filter", at: /^and$/, pw: 940, iz: 1.55, fx: 0.42, fy: 0.39, z0: 1.0, z1: 1.05, label: "THE REAL FILTER", credit: "NASA photo AS13-62-8929 · public domain" },
  ],
  marks: [
    { at: 0.5, to: /^After$/, ix: 0.42, iy: 0.39, r: 170, text: "THIS FILTER", side: "right" },
    { at: /^exploded/, to: /^three$/, ix: 0.64, iy: 0.27, r: 110, text: "BLOWN OPEN", side: "left" },
    { at: /^taped$/, to: /^and$/, ix: 0.69, iy: 0.40, r: 110, text: "SQUARE FILTER", side: "left" },
  ],
  stamps: [{ text: "BUILT FOR 2", at: [/^built$/, 1], to: /^The$/, y: 1570, size: 64 }, { text: "CO2 DROPPING", at: /^started$/, y: 1570, size: 70 }],
};
