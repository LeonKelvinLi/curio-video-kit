/* ZC footage-first · cows painted with zebra stripes to keep biting flies off (Kojima et al., PLOS ONE 2019, CC BY 4.0).
   Facts and numbers: assets/src/zebracows/facts.json. Diagram: flies coming in to land on a plain cow vs a striped cow,
   simplified; the landing counts on screen are the study's numbers (window.ZC). Engine: scenes/footage.js. */
(function () {
  const { clamp, lerp, inv, E, rr, circ, txt, poly } = K, SY = y => y - 420;
  function cow(c, x, y, s, striped) { // side view, matte: body, head, legs, tail
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = "#1f1a17"; for (const lx of [-120, -70, 70, 120]) { rr(c, lx - 14, 40, 28, 130, 10); c.fill(); }
    c.save(); rr(c, -180, -90, 360, 160, 70); c.clip(); c.fillStyle = "#1f1a17"; c.fillRect(-200, -100, 400, 200);
    if (striped) { c.fillStyle = "#f2efe6"; for (let i = -6; i < 8; i++) { c.save(); c.translate(i * 46, 0); c.rotate(0.18); c.fillRect(-11, -140, 22, 280); c.restore(); } }
    c.restore();
    rr(c, 150, -130, 110, 90, 36); c.fillStyle = "#1f1a17"; c.fill(); poly(c, [[170, -130], [150, -165], [190, -135]], "#cfc4ae"); // head + horn
    c.strokeStyle = "#1f1a17"; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.moveTo(-178, -40); c.quadraticCurveTo(-230, 20, -215, 90); c.stroke();
    c.restore();
  }
  function fly(c, x, y, a) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(1.6, 1.6); c.translate(-x, -y); circ(c, x, y, 7, "#e9eef3"); c.fillStyle = "rgba(233,238,243,.5)"; c.beginPath(); c.ellipse(x - 6, y - 7, 8, 4, -0.5, 0, 6.3); c.ellipse(x + 6, y - 7, 8, 4, 0.5, 0, 6.3); c.fill(); c.restore(); }
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    flies(c, t, vp, p, b) {
      const Z = window.ZC || { plain: 100, striped: 45, unit: "" }, rows = [{ y: 830, striped: false, n: Z.plain, label: "PLAIN" }, { y: 1290, striped: true, n: Z.striped, label: "ZEBRA STRIPES" }];
      rows.forEach((r, ri) => {
        cow(c, 500, SY(r.y) + 10, 1.3, r.striped);
        // 14 flies per cow come in from the right; on the plain cow most land, on the striped cow most veer away
        for (let i = 0; i < 14; i++) {
          const t0 = 0.05 + 0.6 * K.hash(i + ri * 31), u = clamp((p - t0) / 0.3), lands = r.striped ? i % 5 === 0 : i % 7 !== 0;
          const tx = 330 + 380 * K.hash(i + 7), ty = SY(r.y) - 80 + 120 * K.hash(i + 9), sx = 1100, sy = ty - 260 + 120 * K.hash(i + 11);
          if (u <= 0) continue;
          let x, y; if (lands || u < 0.7) { const q = lands ? E.out(u) : E.out(u / 0.7) * 0.85; x = lerp(sx, tx, q); y = lerp(sy, ty, q); }
          else { const q = (u - 0.7) / 0.3; x = lerp(tx + 0.15 * (sx - tx), sx + 80, E.in(q)); y = lerp(ty + 0.15 * (sy - ty), sy - 200, E.in(q)); }
          fly(c, x, y, lands ? 1 : 1 - clamp((u - 0.85) / 0.15));
        }
        const shown = Math.round(r.n * E.out(clamp((p - 0.3) / 0.5)));
        txt(c, r.label, 120, SY(r.y) - 190, `800 44px ${K.DISP}`, r.striped ? "#ffc83d" : "#e9eef3", "left");
        K.readout(c, 1010, SY(r.y) - 230, "FLIES LANDED", Z.fmt ? Z.fmt(shown) : String(shown), { size: 76, color: r.striped ? "#ffc83d" : "#ffffff" });
      });
    },
  });
})();
window.ZC = { plain: 129, striped: 56 }; // Table 1: legs + body, unpainted 128.8 vs zebra-striped 55.5 (mean biting flies counted)
window.SPEC = {
  credit: "Kojima et al., PLOS ONE 2019 · CC BY 4.0",
  beats: [
    { kind: "photo", src: "striped", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL STUDY PHOTO · JAPAN 2019", credit: "Kojima et al., PLOS ONE 2019 · CC BY 4.0" },
    { kind: "photo", src: "plain", at: /^On$/, pw: 1000, z0: 1.0, z1: 1.05, label: "SAME BREED, UNPAINTED", credit: "Kojima et al., PLOS ONE 2019 · CC BY 4.0" },
    { kind: "diagram", diagram: "flies", at: /^stripes$/, credit: "Curio diagram · counts from the study's Table 1" },
    { kind: "photo", src: "striped", at: /^And$/, pw: 1000, iz: 1.5, fx: 0.72, fy: 0.35, z0: 1.0, z1: 1.05, label: "REAL STUDY PHOTO", credit: "Kojima et al., PLOS ONE 2019 · CC BY 4.0" },
    { kind: "clip", src: "zebra", at: /^The$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL ZEBRAS · THE SAME TRICK", credit: "Zebra: Amada44 / Wikimedia Commons, CC BY-SA 4.0" },
  ],
  counter: { label: "HEAD TOSSES PER 30 MIN", at: /^And$/, to: /^The$/, y: 1480, values: [[/^And$/, "PLAIN 1.9"], [/^sixty$/, "ZEBRA 0.7"]] },
  stamps: [{ text: "IG NOBEL PRIZE 2025", at: /^land\.?$/, y: 1560, size: 64 }],
  tags: [{ text: "6 COWS · 3 PAINT JOBS", at: /^six$/, to: /^stripes$/, y: 1480, color: "#ffc83d" }],
};
