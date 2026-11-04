/* PP footage-first · control arm (current format, 16-18 s, framed prints). Julius Neubronner's pigeon camera: the patent office objected
   that a pigeon could not carry 75 g, he answered with photographs, patent granted 1908. Facts: assets/src/pigeoncam/facts.json. Not
   called the first aerial photo (balloons, 1858). The Bundesarchiv pigeon may be a later wartime camera, so it is left out. Diagram
   "loop": the delivery pigeon's four missing weeks. */
(function () {
  const { clamp, lerp, E, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    loop(c, t, vp, p) {
      const X = 540, Y = SY(1040), q = E.io(clamp(p * 1.05)), pt = u => { const a = u * 6.283 - 1.57; return [X + 340 * Math.sin(a * 2) * 0.9, Y - 40 + 320 * Math.sin(a + 1.57) - 0]; };
      c.strokeStyle = "#ffc83d"; c.lineWidth = 8; c.setLineDash([22, 18]); c.beginPath(); for (let i = 0; i <= 120 * q; i++) { const [x, y] = pt(i / 120); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
      const [hx, hy] = pt(0), [bx, by] = pt(q); c.fillStyle = "#e9eef3"; c.fillRect(hx - 44, hy - 40, 88, 60); c.beginPath(); c.moveTo(hx - 56, hy - 40); c.lineTo(hx, hy - 84); c.lineTo(hx + 56, hy - 40); c.fill(); circ(c, bx, by, 18, "#ffffff");
      txt(c, "HOME", hx + 120, hy - 20, `800 40px ${K.DISP}`, "#ffffff"); txt(c, "?", X, Y - 40, `800 170px ${K.DISP}`, "#ffffff"); txt(c, "4 WEEKS MISSING", X, SY(1500), `800 58px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Julius Neubronner · public domain",
  beats: [
    { kind: "photo", src: "three", pw: 1000, z0: 1.0, z1: 1.07, label: "REAL PHOTO · NEUBRONNER'S PIGEONS" },
    { kind: "photo", src: "neub", at: /^The$/, pw: 1000, z0: 1.0, z1: 1.06, label: "NEUBRONNER WITH A PIGEON, 1914", credit: "Agence Rol, 1914 · public domain" },
    { kind: "photo", src: "aerial", at: /^so$/, pw: 1000, maxH: 1000, z0: 1.0, z1: 1.06, label: "TAKEN BY A PIGEON · 1908" },
    { kind: "photo", src: "wings", at: /^It$/, pw: 1000, z0: 1.0, z1: 1.06, label: "YOU CAN SEE ITS WINGTIPS" },
    { kind: "diagram", diagram: "loop", at: /^vanished/, credit: "Curio diagram · simplified" },
  ],
  nums: [["nineteen oh eight", "1908"]],
  tags: [{ text: "PATENT OFFICE: 75 G IS TOO HEAVY", at: /^refused/, to: /^so$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "PATENT GRANTED · 1908", at: /^photos/, to: /^It$/, y: 1570, size: 60 }],
};
