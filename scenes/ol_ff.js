/* OL footage-first · arm A (visual-first, 14.2 s, LEADER slot). "The Rats Who Wouldn't Stop Pressing": Olds and Milner (McGill, 1954)
   found rats would press a lever to stimulate their own brains; later work recorded several thousand presses an hour for days (Olds
   1958) and rats that skipped food to the point of starvation when food and stimulation were offered for a limited time each day
   (Routtenberg and Lindy 1965, via Wise 2002); today many researchers read the circuit as "wanting" rather than "liking" (Berridge).
   Facts: assets/src/oldsrats/facts.json. First frame: a real colour photo of a lab rat with a brain implant (a 2015 recording implant,
   not one of Olds's rats; labelled as a lab rat, no wound visible). No photo of the 1954 set-up is rights-clear, so beat 2 is a CC BY-SA
   illustration of it, labelled ILLUSTRATION. Beat 3 is the one diagram (lever vs food, simplified). Last beat: real 2015 film of a rat
   whose reward pathway (medial forebrain bundle) is being stimulated, showing "seeking" behaviour; labelled with what it is.
   Caveat kept off screen and in the caption: "pressed until they died" is a legend; starvation comes from limited-access food tests. */
(function () {
  const { clamp, lerp, E, rr, txt } = K, SY = y => y - 420;
  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, {
    choice(c, t, vp, p) {
      const ink = "#e9eef3", gold = "#ffc83d", g = SY(1330), lx = 290, fx = 790;
      // lever side: a box, a lever that keeps going down, and a press tally that climbs
      const press = Math.max(0, Math.sin(t * 22)) ** 2;
      c.fillStyle = "#26323d"; rr(c, lx - 170, g - 60, 340, 60, 10); c.fill();
      c.save(); c.translate(lx - 40, g - 60); c.rotate(-0.42 + 0.3 * press); c.fillStyle = gold; rr(c, 0, -14, 190, 28, 10); c.fill(); c.restore();
      c.fillStyle = "#3b4b5a"; rr(c, lx - 60, g - 92, 44, 44, 8); c.fill();
      txt(c, "LEVER", lx, g + 56, `800 46px ${K.DISP}`, ink);
      const n = Math.floor(lerp(0, 2400, E.in(clamp(p / 0.95))));
      txt(c, "PRESSES", lx, g - 420, `700 36px ${K.DISP}`, "rgba(233,238,243,.75)");
      txt(c, n.toLocaleString("en-US"), lx, g - 340, `800 110px ${K.DISP}`, gold);
      // food side: a bowl of pellets that stays full
      const a = 1 - 0.55 * clamp((p - 0.35) / 0.2);
      c.save(); c.globalAlpha = a;
      c.fillStyle = "#8a6a43"; [[-70, -48], [-30, -62], [10, -50], [50, -60], [-50, -78], [-6, -84], [34, -80], [72, -46]].forEach(([dx, dy]) => { c.beginPath(); c.ellipse(fx + dx, g + dy, 26, 17, 0.3, 0, 6.3); c.fill(); });
      c.fillStyle = "#c9d3dc"; c.beginPath(); c.moveTo(fx - 150, g - 50); c.lineTo(fx + 150, g - 50); c.lineTo(fx + 110, g); c.lineTo(fx - 110, g); c.closePath(); c.fill();
      c.restore();
      txt(c, "FOOD", fx, g + 56, `800 46px ${K.DISP}`, ink);
      txt(c, "OR", 540, g - 60, `800 52px ${K.DISP}`, "rgba(233,238,243,.55)");
      if (p > 0.38) K.stamp(c, fx, g - 230, "SKIPPED", { p: clamp((p - 0.38) / 0.25), size: 60, rot: -0.08 });
    },
  });
})();
window.SPEC = {
  credit: "Anna Marchenkova · CC BY 4.0",
  beats: [
    { kind: "photo", src: "rat", fit: "cover", fx: 0.5, fy: 0.45, z0: 1.02, z1: 1.1, label: "REAL PHOTO · LAB RAT, BRAIN IMPLANT" },
    { kind: "photo", src: "setup", at: /^Each$/, pw: 1000, maxH: 900, z0: 1.0, z1: 1.05, label: "ILLUSTRATION · OLDS AND MILNER, 1954", credit: "Illustration: Pauline Neveu · CC BY-SA 4.0" },
    { kind: "diagram", diagram: "choice", at: /^Offered$/, credit: "Curio diagram · simplified" },
    { kind: "clip", src: "seek", at: /^Now$/, pw: 1000, maxH: 1000, z0: 1.0, z1: 1.05, label: "REAL FILM · REWARD-CIRCUIT ZAP, 2015", credit: "Furlanetti et al., 2015 · CC BY 3.0" },
  ],
  fps: 30,
  marks: [{ at: /^lever$/, to: /^pressed$/, ix: 0.2, iy: 0.79, r: 95, text: "LEVER", side: "right" }],
  tags: [{ text: "McGILL UNIVERSITY, 1954", at: /^pressed$/, to: /^Offered$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "WANTING, NOT PLEASURE", at: /^wanting/, y: 1615, size: 64 }],
};
