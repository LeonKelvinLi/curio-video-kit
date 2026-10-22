/* P1 v4 · Okene's air pocket · trycurio.app style, Zack voice. Facts: prototype_okene_facts in curio-breakout-analysis-2026-10-19 ledger. */
(function () {
  const O = window.OKENE, { clamp, lerp, inv, E, rr, txt } = K, Wd = WORDS, T = window.T, w = re => Wd[K.ix(Wd, re)].s;
  // design timeline (engine seconds) pinned to spoken words: flip on "flipped", x-ray reveals the cook on "cook still inside",
  // air pocket on "pocket", hours run on "breathed it for sixty hours", diver light on "Then divers", the grab on "grabbed".
  /* v4: starts mid-roll, frame 0 is the capsize */ const D = [0.8, 2.40, 3.40, 4.40, 7.10, 9.10, 10.30, 11.25], R = [0, w(/^with$/), w(/^pocket$/), w(/^breathed$/), w(/^Then$/), w(/^One$/), w(/^grabbed$/), T];
  const toD = t => { for (let i = 1; i < R.length; i++) if (t <= R[i]) return D[i - 1] + (t - R[i - 1]) / (R[i] - R[i - 1]) * (D[i] - D[i - 1]); return D[D.length - 1]; };
  const toR = d => { for (let i = 1; i < D.length; i++) if (d <= D[i]) return R[i - 1] + (d - D[i - 1]) / (D[i] - D[i - 1]) * (R[i] - R[i - 1]); return T; };
  function scene(c, t, vp) { const d = toD(t), S = O.state(d); c.save(); c.translate(S.shake[0] * 0.6, S.shake[1] * 0.6); O.drawScene(c, S, { x: vp.x - 20, y: vp.y - 20, w: vp.w + 40, h: vp.h + 40, fy: 0.52 }); c.restore(); }
  function tag(c, x, y, text, p, color, align) { if (p <= 0) return; c.save(); c.globalAlpha = clamp(p * 3); c.font = `700 44px ${K.DISP}`; const tw = c.measureText(text).width + 36, x0 = align === "right" ? x - tw : x; const sc = lerp(1.25, 1, E.back(clamp(p))); c.translate(x0 + tw / 2, y + 28); c.scale(sc, sc); rr(c, -tw / 2, -28, tw, 56, 10); c.fillStyle = "rgba(6,10,14,.8)"; c.fill(); txt(c, text, 0, 2, `700 44px ${K.DISP}`, color || "#ffffff"); c.restore(); }
  // one data card only, and only while the voice is saying it: the hours counter
  function bandHud(c, t, vp) {
    const d = toD(t), S = O.state(d), xr = vp.x + vp.w - 28, y = vp.y + 28, end = w(/^Then$/) - 0.1;
    const t0 = w(/^breathed$/) - 0.15; if (t > t0 && t < end) { const h = Math.round(S.h); tag(c, xr, y, h + " HOURS", inv(t0, t0 + 0.2, t) * (1 - inv(end - 0.2, end, t)), h >= 60 ? "#ffc83d" : "#ffffff", "right"); }
  }
  const lines = K.autoLines(Wd, T, [["sixty", "60"]], [/^found$/, /^down$/]);
  const S = K.Snd, foley = [[0, x => S.nz(x, toR(1.0), "lowpass", 420, 300, 0.7, 0.18)], [toR(0.5), x => S.boom(x, 70, 48, 0.7, 0.2)], [toR(1.02), x => { S.boom(x, 85, 28, 1.2, 0.6); S.nz(x, 0.6, "highpass", 2400, 2400, 0.5, 0.2); }], [toR(2.72), x => { S.boom(x, 58, 24, 0.9, 0.65); S.nz(x, 0.7, "lowpass", 300, 300, 0.8, 0.25); }], [toR(10.3), x => S.boom(x, 70, 30, 0.6, 0.45)]];
  for (let i = 0; i < 12; i++) foley.push([toR(1.3 + i * 0.1), x => S.osc(x, "sine", 300 + i * 25, 700 + i * 40, 0.08, 0.05)]);
  const punch = [/^sank/, /^cook$/, /^found$/, /^breathed$/, /^sixty$/, /^Then$/, /^bodies/, /^One$/, /^hand…/, /^grabbed$/].map(re => w(re));
  K.mount({ T, mode: "style", punch, foley, credit: () => "Curio animation", lines, scene, bandHud, events: [], drone: { freqs: [55, 55.7, 82.4], level: 0.04 },
    flash: t => K.flashAt(toD(t), 10.3, 0.09, 0.6) });
})();
