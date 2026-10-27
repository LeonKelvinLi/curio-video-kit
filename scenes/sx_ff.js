/* SX footage-first · shoe-fitting X-ray machines (fluoroscopes), 1920s-1950s. Facts: assets/src/shoexray/facts.json (ORAU
   Health Physics Museum, Duffin & Hayter 2000, Lapp 2004). Diagram "fluoro", simplified from Lowe's 1927 patent: the X-ray
   tube in the base under the foot slot, the beam up through foot and shoe onto a fluorescent screen, three viewing ports on
   top for the kid, the parent and the clerk, the toe bones on the screen wiggling. Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function label(c, text, x, y, color, align) { c.save(); c.font = `800 36px ${K.DISP}`; const w = c.measureText(text).width + 24, x0 = align === "right" ? x - w : x;
    rr(c, x0, y - 26, w, 52, 9); c.fillStyle = "rgba(6,10,14,.88)"; c.fill(); txt(c, text, x0 + w / 2, y + 2, `800 36px ${K.DISP}`, color); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    fluoro(c, t, vp, p, b) {
      const beam = E.out(clamp((p - 0.12) / 0.2)), bones = clamp((p - 0.3) / 0.15), wig = p > 0.45 ? Math.sin(t * 9) * 6 : 0;
      rr(c, 330, SY(820), 420, SY(1520) - SY(820), 16); c.fillStyle = "#7a5638"; c.fill(); // wooden cabinet
      for (const [x, who] of [[380, "KID"], [540, "PARENT"], [700, "CLERK"]]) { poly(c, [[x - 40, SY(820)], [x + 40, SY(820)], [x + 30, SY(740)], [x - 30, SY(740)]], "#c9a36a"); txt(c, who, x, SY(712), `800 30px ${K.DISP}`, "#ffc83d"); }
      rr(c, 380, SY(860), 320, 150, 10); c.fillStyle = "#16301e"; c.fill(); // fluorescent screen
      if (bones > 0) { c.save(); c.globalAlpha = bones; for (let i = 0; i < 5; i++) { const x = 420 + i * 60, w2 = i === 0 ? wig : wig * (0.4 + 0.15 * i); rr(c, x - 12 + w2, SY(880), 24, 70 - i * 6, 10); c.fillStyle = "#9cffb0"; c.fill(); rr(c, x - 10 + w2 * 0.6, SY(955) - i * 2, 20, 40, 8); c.fill(); } c.restore(); }
      rr(c, 330, SY(1300), 420, 120, 6); c.fillStyle = "#2a1d14"; c.fill(); // foot slot
      rr(c, 400, SY(1335), 280, 70, 30); c.fillStyle = "#5b3a24"; c.fill(); rr(c, 420, SY(1345), 200, 48, 22); c.fillStyle = "#d9b38c"; c.fill(); // shoe + foot
      circ(c, 540, SY(1470), 34, "#8a96a3"); circ(c, 540, SY(1470), 16, "#ffc83d"); // X-ray tube under the foot
      if (beam > 0) { c.save(); c.globalAlpha = 0.35 * beam; poly(c, [[540, SY(1450)], [390, SY(1010)], [690, SY(1010)]], "#ffe46b"); c.restore(); }
      label(c, "X-RAY TUBE", 790, SY(1470), "#ffc83d", "left"); label(c, "YOUR FEET", 790, SY(1365), "#e9eef3", "left"); label(c, "GLOWING SCREEN", 290, SY(935), "#9cffb0", "right");
      txt(c, bones > 0.5 ? "YOU WATCHED YOUR OWN TOE BONES" : "HOW THE MACHINE WORKED", 540, SY(660), `800 46px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Public domain",
  beats: [
    { kind: "photo", src: "adrian", pw: 640, cy: 1080, z0: 1.0, z1: 1.07, label: "REAL MACHINE · SHOE-STORE X-RAY, c.1938", credit: "National Museum of Health and Medicine · public domain" },
    { kind: "diagram", diagram: "fluoro", at: /^Kids$/, credit: "Curio diagram · after J. J. Lowe's 1927 patent" },
    { kind: "photo", src: "xray", at: /^But$/, pw: 600, cy: 1060, z0: 1.0, z1: 1.06, label: "REAL X-RAY · TOES IN A SHOE, 1912", credit: "E. L. Munson, The Soldier's Foot and the Military Shoe, 1912 · public domain" },
    { kind: "photo", src: "pedoscope", at: /^Pennsylvania$/, pw: 520, cy: 1040, z0: 1.0, z1: 1.05, label: "REAL MACHINE · PEDOSCOPE", credit: "Musee des Hospices Civils de Lyon · CC BY-SA 4.0" },
  ],
  nums: [["nineteen fifty-seven", "1957"], ["thirty-three", "33"], ["nineteen seventy", "1970"]],
  marks: [{ at: 0.5, to: /^Kids$/, ix: 0.5, iy: 0.12, r: 120, text: "3 VIEWING PORTS" }],
  tags: [{ text: "X-RAYS LEAKED ONTO THE CLERKS TOO", at: /^dose$/, to: /^Pennsylvania$/, y: 1560, color: "#ff6b4a" }],
  counter: { label: "STATES THAT BANNED THEM", at: /^Pennsylvania$/, y: 1500, values: [[/^Pennsylvania$/, "1"], [/^thirty-three$/, "33"]] },
};
