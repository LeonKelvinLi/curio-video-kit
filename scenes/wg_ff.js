/* WG footage-first · production row (Nov 28 9 AM), arm A (13-15 s) + end card. Lillian Boyer: a waitress who climbed out on a plane's
   wing on her second flight (1921), first woman to change from a speeding car to a plane; her papers (San Diego Air & Space Museum)
   count 352 shows in 41 states and Canada, 143 car-to-plane changes, last stunt 8 Sept 1928. Facts: assets/src/wingwaitress/facts.json.
   First frame: LoC photo cph.3b18663 (21 Jan 1922), Boyer standing on the top wing of a biplane in flight over a town ("No known
   restrictions on publication", LoC JSON). Stills only: the SDASM film clip's licence is not confirmed, so it is not used and nothing
   says the car changes are on film. Nothing says she was paid. The 41 states are for all 352 shows, so the tag says so.
   Diagram "carplane" (simplified, labelled as a diagram): a car under a low plane, a figure climbing up from the car. */
(function () {
  const { clamp, lerp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    carplane(c, t, vp, p) {
      const road = SY(1420), drift = lerp(30, -30, p), carX = 520 + drift, planeX = 560 + drift, planeY = SY(880) + 10 * Math.sin(t * 2.4);
      // road with moving dashes
      c.fillStyle = "#2a3540"; c.fillRect(0, road, 1080, 90); c.fillStyle = "#e9eef3"; for (let i = -1; i < 7; i++) { const x = ((i * 200 - t * 600) % 1400 + 1400) % 1400 - 160; c.fillRect(x, road + 40, 100, 10); }
      // car
      c.fillStyle = "#e9eef3"; rr(c, carX - 200, road - 120, 400, 90, 14); c.fill(); rr(c, carX - 110, road - 190, 210, 80, 14); c.fill();
      [-120, 120].forEach(d => { circ(c, carX + d, road - 28, 36, "#0b1117"); circ(c, carX + d, road - 28, 14, "#9aa6b2"); });
      // plane (side view biplane)
      c.fillStyle = "#cfd8e2"; rr(c, planeX - 240, planeY - 18, 480, 36, 16); c.fill(); rr(c, planeX - 300, planeY - 110, 600, 22, 8); c.fill(); rr(c, planeX - 300, planeY + 30, 600, 20, 8); c.fill();
      c.strokeStyle = "#cfd8e2"; c.lineWidth = 6; [-220, 220].forEach(d => { c.beginPath(); c.moveTo(planeX + d, planeY - 90); c.lineTo(planeX + d, planeY + 30); c.stroke(); });
      c.beginPath(); c.moveTo(planeX + 250, planeY - 50); c.lineTo(planeX + 250, planeY + 50); c.stroke();
      // ladder from the plane down toward the car roof
      const ladTop = planeY + 50, ladBot = road - 200; c.strokeStyle = "#ffc83d"; c.lineWidth = 5; [-18, 18].forEach(d => { c.beginPath(); c.moveTo(planeX - 40 + d, ladTop); c.lineTo(carX - 40 + d, ladBot); c.stroke(); });
      for (let k = 1; k < 8; k++) { const u = k / 8, y = lerp(ladTop, ladBot, u), x = lerp(planeX - 40, carX - 40, u); c.beginPath(); c.moveTo(x - 18, y); c.lineTo(x + 18, y); c.stroke(); }
      // the climber: from the car roof up the ladder
      const q = E.io(clamp((p - 0.15) / 0.75)), fy = lerp(ladBot - 40, ladTop + 50, q), fx = lerp(carX - 40, planeX - 40, q);
      circ(c, fx, fy - 46, 20, "#ffffff"); c.strokeStyle = "#ffffff"; c.lineWidth = 9; c.beginPath(); c.moveTo(fx, fy - 26); c.lineTo(fx, fy + 30); c.moveTo(fx, fy - 10); c.lineTo(fx - 22, fy - 50); c.moveTo(fx, fy - 10); c.lineTo(fx + 22, fy - 50); c.moveTo(fx, fy + 30); c.lineTo(fx - 16, fy + 70); c.moveTo(fx, fy + 30); c.lineTo(fx + 16, fy + 70); c.stroke();
      txt(c, "CAR TO PLANE, AT SPEED", 540, SY(700), `800 52px ${K.DISP}`, "#ffc83d");
    },
  });
})();
window.SPEC = {
  credit: "Library of Congress, 1922 · public domain",
  beats: [
    { kind: "photo", src: "wing", fit: "cover", fx: 0.42, fy: 0.45, z0: 1.0, z1: 1.1, label: "REAL PHOTO · 1922" },
    { kind: "photo", src: "brk", at: /^She$/, pw: 1000, z0: 1.0, z1: 1.06, label: "PHOTO, 1922 · HER \"BREAKAWAY\" STUNT" },
    { kind: "diagram", diagram: "carplane", at: /^change$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "portrait", at: /^Her$/, pw: 620, maxH: 880, cy: 960, fy: 0.42, z0: 1.0, z1: 1.06, label: "LILLIAN BOYER · 1922" },
    { kind: "photo", src: "wingfull", at: /^in$/, pw: 1000, z0: 1.0, z1: 1.06, label: "PHOTO, 1922 · ON THE TOP WING" },
  ],
  nums: [["a hundred and forty-three", "143"], ["forty-one", "41"], ["nineteen twenty-eight", "1928"]],
  tags: [{ text: "352 SHOWS IN 41 STATES + CANADA", at: /^forty-one/, y: 1460, color: "#ffc83d" }],
  stamps: [{ text: "143 CAR-TO-PLANE CHANGES", at: /^forty-three/, to: /^in$/, y: 1570, size: 58 }, { text: "LAST SHOW · SEPT 1928", at: /^nineteen/, y: 1570, size: 60 }],
};
