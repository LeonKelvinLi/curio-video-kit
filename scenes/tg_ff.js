/* TG footage-first · arm FULL (control script and length, cover on every photo). Rear-facing face masks against tiger attacks in the
   Sundarbans; 10,000 masks handed out in Saragur taluk, Karnataka, Nov 2025. Facts: assets/src/tigermask/facts.json. "Worked" and "tigers
   figured it out" are reports, not findings, so the script keeps "reportedly" and "seemed"; the popular 1986-87 zero-deaths figure
   could not be confirmed and is out. No rights-clear photo of a wearer exists. Diagram "mask": the back of a head wearing a face. */
(function () {
  const { clamp, E, rr, circ, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    mask(c, t, vp, p) {
      const X = 620, Y = SY(1010), a = E.out(clamp(p * 2.5));
      c.fillStyle = "#3b2a20"; c.beginPath(); c.ellipse(X, Y, 210, 260, 0, 0, 6.3); c.fill(); c.fillStyle = "#6e5a48"; c.fillRect(X - 110, Y + 230, 220, 130);
      c.save(); c.globalAlpha = a; c.fillStyle = "#e7c9a4"; c.beginPath(); c.ellipse(X, Y + 10, 150, 195, 0, 0, 6.3); c.fill(); [-62, 62].forEach(d => { c.fillStyle = "#ffffff"; c.beginPath(); c.ellipse(X + d, Y - 40, 38, 24, 0, 0, 6.3); c.fill(); circ(c, X + d, Y - 40, 15, "#14100c"); });
      c.strokeStyle = "#6a4a30"; c.lineWidth = 8; c.beginPath(); c.moveTo(X, Y - 20); c.lineTo(X - 16, Y + 50); c.lineTo(X + 14, Y + 54); c.stroke(); c.strokeStyle = "#8c3a2a"; c.lineWidth = 12; c.beginPath(); c.moveTo(X - 60, Y + 104); c.quadraticCurveTo(X, Y + 124, X + 60, Y + 104); c.stroke(); c.restore();
      const q = E.out(clamp((p - 0.25) * 2.5)); if (q > 0) { c.strokeStyle = "#ff8a2a"; c.lineWidth = 12; c.setLineDash([26, 18]); c.beginPath(); c.moveTo(60, Y + 300); c.lineTo(60 + 330 * q, Y + 300 - 280 * q); c.stroke(); c.setLineDash([]); txt(c, "TIGER'S VIEW", 200, Y + 350, `800 40px ${K.DISP}`, "#ff8a2a"); }
      txt(c, "THE BACK OF A HEAD", X - 80, SY(690), `800 52px ${K.DISP}`, "#ffffff");
    },
  });
})();
window.SPEC = {
  credit: "Kingshuk Mondal · CC BY 4.0",
  beats: [
    { kind: "photo", src: "tiger", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.14, label: "REAL TIGER · SUNDARBANS", credit: "Kingshuk Mondal · CC BY 4.0" },
    { kind: "photo", src: "honey", at: /^Tigers$/, fit: "cover", fx: 0.42, fy: 0.55, z0: 1.05, z1: 1.14, label: "HONEY COLLECTORS · SUNDARBANS", credit: "Mustmamun · CC BY-SA 4.0" },
    { kind: "diagram", diagram: "mask", at: /^It$/, credit: "Curio diagram · simplified" },
    { kind: "photo", src: "hunters", at: /^The$/, fit: "cover", fx: 0.35, fy: 0.5, z0: 1.05, z1: 1.14, label: "HONEY HUNTER · SUNDARBANS", credit: "Mustmamun · CC BY-SA 4.0" },
  ],
  nums: [["twenty twenty-five", "2025"], ["ten thousand", "10,000"]],
  marks: [{ at: /^India/, to: /^Tigers$/, ix: 0.5, iy: 0.5, r: 130, text: "TIGER", side: "right" }],
  stamps: [{ text: "NO DATA", at: /^stories/, to: /^ten$/, y: 1570, size: 72 }, { text: "10,000 MASKS, 2025", at: /^ten$/, y: 1570, size: 66 }],
};
