/* Curio motion kit — shared engine for 1080x1920 Shorts/Reels.
   Every frame is a pure function of t (seconds), so frames can be exported exactly.
   A video file defines V = {T, mode:'full'|'band', lines, scene(ctx,t,vp), hud?(ctx,t), bandHud?(ctx,t,vp),
   events:[[t,fn(w)]], shake?(t)->amp, flash?(t)->alpha, pill?, footnote, kinetic?{word:fn}} and calls K.mount(V). */
(function () {
  const K = (window.K = {});
  const W = 1080, H = 1920;
  K.W = W; K.H = H;
  const clamp = (K.clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x));
  const lerp = (K.lerp = (a, b, p) => a + (b - a) * p);
  const inv = (K.inv = (a, b, x) => clamp((x - a) / (b - a)));
  const E = (K.E = {
    lin: p => p, io: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2), out: p => 1 - Math.pow(1 - p, 3), in: p => p * p * p,
    sine: p => -(Math.cos(Math.PI * p) - 1) / 2,
    back: p => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
    elastic: p => (p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * (2 * Math.PI / 3)) + 1),
  });
  const hash = (K.hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); });
  K.noise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
  K.track = (keys, t) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) { if (t <= keys[i][0]) { const k0 = keys[i - 1], k1 = keys[i], p = (E[k1[2]] || E.io)(inv(k0[0], k1[0], t)); return Array.isArray(k0[1]) ? k0[1].map((a, j) => lerp(a, k1[1][j], p)) : lerp(k0[1], k1[1], p); } } return keys[keys.length - 1][1]; };
  K.C = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  K.mix = (a, b, p) => a.map((v, i) => Math.round(lerp(v, b[i], p)));
  K.rgb = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a == null ? 1 : a})`;
  K.poly = (c, pts, fill) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } };
  K.seg = (c, a, b, d, e) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); };
  K.rr = (c, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  K.circ = (c, x, y, r, f) => { c.beginPath(); c.arc(x, y, Math.max(0, r), 0, 6.2832); c.fillStyle = f; c.fill(); };
  K.txt = (c, s, x, y, font, fill, align, base) => { c.font = font; c.fillStyle = fill; c.textAlign = align || "center"; c.textBaseline = base || "middle"; c.fillText(s, x, y); };
  const DISP = (K.DISP = '"Barlow Condensed","Arial Narrow",Arial,sans-serif'), MONO = (K.MONO = '"IBM Plex Mono",Consolas,monospace'), HAND = (K.HAND = '"Caveat","Segoe Print",cursive');
  const ACC = (K.ACC = "#ffc83d");

  /* ---------------- HUD widgets ---------------- */
  K.pill = (c, x, y, text, o = {}) => {
    const font = `600 ${o.size || 28}px ${DISP}`; c.font = font; const w = c.measureText(text).width + 36, x0 = o.align === "right" ? x - w : o.align === "center" ? x - w / 2 : x;
    c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; K.rr(c, x0, y, w, 52, 26); c.fillStyle = o.bg || "rgba(6,12,18,.62)"; c.fill(); c.strokeStyle = o.stroke || "rgba(255,255,255,.16)"; c.lineWidth = 2; c.stroke();
    K.txt(c, text, x0 + 18, y + 27, font, o.color || "#e9eef3", "left"); c.restore(); return w;
  };
  // label + big value, right-aligned at x; value is a string; pulse = 0..1 lock highlight
  K.readout = (c, x, y, label, value, o = {}) => {
    c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha;
    c.font = `600 26px ${DISP}`; c.textAlign = o.align || "right"; c.textBaseline = "alphabetic"; c.fillStyle = "rgba(233,238,243,.78)"; if ("letterSpacing" in c) c.letterSpacing = "2px"; c.fillText(label, x, y); if ("letterSpacing" in c) c.letterSpacing = "0px";
    const sz = o.size || 96, p = o.pulse || 0; c.font = `800 ${sz}px ${DISP}`; c.textBaseline = "top";
    c.fillStyle = p > 0 ? `rgb(255,${Math.round(200 + 55 * (1 - p))},${Math.round(61 + 194 * (1 - p))})` : o.color || "#ffffff";
    c.save(); c.translate(x, y + 8); const sc = 1 + 0.08 * (o.punch || 0); c.scale(sc, sc); c.fillText(value, 0, 0); c.restore();
    if (p > 0) { const w = c.measureText(value).width; c.strokeStyle = `rgba(255,200,61,${p})`; c.lineWidth = 4; const x0 = o.align === "left" ? x - 14 : x - w - 14; K.rr(c, x0, y + 2, w + 28, sz + 10, 14); c.stroke(); }
    c.restore();
  };
  K.gauge = (c, o) => { // vertical gauge {x,y0,y1,min,max,step,major,value,unitFmt,label,alpha}
    c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; const yy = v => lerp(o.y0, o.y1, (v - o.min) / (o.max - o.min));
    c.strokeStyle = "rgba(233,238,243,.55)"; c.lineWidth = 3; K.seg(c, o.x, o.y0, o.x, o.y1);
    c.font = `500 24px ${MONO}`; c.fillStyle = "rgba(233,238,243,.75)"; c.textAlign = "left"; c.textBaseline = "middle";
    for (let v = o.min; v <= o.max + 1e-6; v += o.step) { const maj = Math.abs((v - o.min) % o.major) < 1e-6; c.lineWidth = maj ? 3 : 2; K.seg(c, o.x, yy(v), o.x + (maj ? 26 : 14), yy(v)); if (maj) c.fillText(o.unitFmt(v), o.x + 34, yy(v)); }
    const my = yy(clamp(o.value, o.min, o.max)); c.fillStyle = ACC; c.beginPath(); c.moveTo(o.x - 4, my); c.lineTo(o.x - 26, my - 14); c.lineTo(o.x - 26, my + 14); c.closePath(); c.fill();
    c.font = `700 46px ${DISP}`; const dv = o.valueFmt(o.value), dw = c.measureText(dv).width; K.rr(c, o.x + 30, my - 30, dw + 28, 60, 12); c.fillStyle = "rgba(6,12,18,.78)"; c.fill(); c.fillStyle = ACC; c.fillText(dv, o.x + 44, my + 2);
    c.font = `600 24px ${DISP}`; c.fillStyle = "rgba(233,238,243,.7)"; c.fillText(o.label, o.x - 8, o.y0 - 34); c.restore();
  };
  K.bar = (c, o) => { // horizontal bar {x,y,w,h,p,label,value,color,alpha,marks:[[p,label]]}
    c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; const h = o.h || 26;
    if (o.label) { c.font = `600 26px ${DISP}`; c.textAlign = "left"; c.textBaseline = "alphabetic"; c.fillStyle = "rgba(233,238,243,.78)"; c.fillText(o.label, o.x, o.y - 14); }
    K.rr(c, o.x, o.y, o.w, h, h / 2); c.fillStyle = "rgba(6,12,18,.65)"; c.fill(); c.strokeStyle = "rgba(255,255,255,.14)"; c.lineWidth = 2; c.stroke();
    if (o.p > 0) { K.rr(c, o.x, o.y, Math.max(h, o.w * clamp(o.p)), h, h / 2); c.fillStyle = o.color || ACC; c.fill(); }
    (o.marks || []).forEach(([p, l]) => { const x = o.x + o.w * p; c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 3; K.seg(c, x, o.y - 6, x, o.y + h + 6); K.txt(c, l, x, o.y + h + 26, `500 22px ${MONO}`, "rgba(233,238,243,.8)"); });
    if (o.value) K.txt(c, o.value, o.x + o.w, o.y - 30, `800 52px ${DISP}`, "#ffffff", "right", "alphabetic");
    c.restore();
  };
  K.stamp = (c, x, y, text, o = {}) => { // badge that pops: o.p 0..1, color, size
    const p = o.p == null ? 1 : o.p; if (p <= 0) return; const sz = o.size || 54; c.save(); c.globalAlpha = (o.alpha == null ? 1 : o.alpha) * clamp(p * 4); c.translate(x, y); c.rotate(o.rot || 0); const sc = lerp(1.7, 1, E.back(clamp(p))); c.scale(sc, sc);
    c.font = `800 ${sz}px ${DISP}`; const w = c.measureText(text).width + 40; K.rr(c, -w / 2, -sz * 0.62, w, sz * 1.24, 12); c.fillStyle = o.bg || "rgba(6,12,18,.82)"; c.fill(); c.strokeStyle = o.color || ACC; c.lineWidth = 4; c.stroke();
    K.txt(c, text, 0, 3, `800 ${sz}px ${DISP}`, o.color || ACC); c.restore();
  };
  K.footnote = (c, text) => { c.save(); c.font = `500 24px ${DISP}`; const fw = c.measureText(text).width; K.rr(c, 36, 1424, Math.max(fw, 60) + 24, 82, 12); c.fillStyle = "rgba(6,12,18,.55)"; c.fill(); c.globalAlpha = 0.72; K.txt(c, text, 48, 1450, `500 24px ${DISP}`, "#e9eef3", "left", "alphabetic"); c.globalAlpha = 0.78; K.txt(c, "curio", 48, 1492, `700 30px ${DISP}`, "#e9eef3", "left", "alphabetic"); c.restore(); };

  /* ---------------- captions ---------------- */
  const cache = {};
  function layout(c, key, words, font, maxW) {
    const ck = key + "|" + font; if (cache[ck]) return cache[ck];
    c.font = font; const sp = c.measureText(" ").width, ws = words.map(w => c.measureText(w).width), rows = [[]]; let cw = 0;
    ws.forEach((w, i) => { if (cw > 0 && cw + sp + w > maxW) { rows.push([]); cw = 0; } rows[rows.length - 1].push(i); cw += (cw > 0 ? sp : 0) + w; });
    const pos = []; rows.forEach((r, ri) => { const tot = r.reduce((s, i) => s + ws[i], 0) + sp * (r.length - 1); let x = -tot / 2; r.forEach(i => { pos[i] = { x: x + ws[i] / 2, row: ri }; x += ws[i] + sp; }); });
    return (cache[ck] = { pos, rows: rows.length });
  }
  K.captions = (c, t, V) => {
    V.lines.forEach((L, li) => {
      if (t < L.t0 || t > L.t1) return; const q = !!L.q, size = q ? 92 : 76, font = `700 ${size}px ${DISP}`, lay = layout(c, "L" + li, L.words, font, q ? 860 : 900), lh = size * 1.12;
      const baseY = q ? 1010 - ((lay.rows - 1) * lh) / 2 : 548, exit = q ? 0 : inv(L.t1 - 0.16, L.t1, t);
      c.save(); c.font = font; c.textAlign = "center"; c.textBaseline = "middle"; c.lineJoin = "round";
      if (q) { const pa = E.out(inv(L.t0 - 0.05, L.t0 + 0.25, t)); c.globalAlpha = pa; K.rr(c, 90, baseY - lh / 2 - 30, 900, lay.rows * lh + 60, 26); c.fillStyle = "rgba(6,12,18,.72)"; c.fill(); c.globalAlpha = 1; }
      let active = -1; L.at.forEach((a, i) => { if (t >= a) active = i; });
      L.words.forEach((w, i) => {
        if (t < L.at[i]) return; const p = inv(L.at[i], L.at[i] + 0.16, t); let sc = lerp(0.72, 1, E.back(p)), col = i === active ? ACC : "#ffffff", ky = 0, kr = 0, kx = 1;
        if (L.slam === i) { sc = lerp(1.9, 1, E.back(inv(L.at[i], L.at[i] + 0.24, t))); col = L.slamColor || "#ff9b4a"; }
        const k = V.kinetic && V.kinetic[w.toLowerCase().replace(/[^a-z0-9×]/g, "")]; if (k) { const r = k(t - L.at[i], i === active); ky = r.y || 0; kr = r.r || 0; kx = r.sx || 1; sc *= r.s || 1; if (r.col) col = r.col; }
        const x = 540 + lay.pos[i].x, y = baseY + lay.pos[i].row * lh - exit * 24 + ky;
        c.save(); c.globalAlpha = clamp((t - L.at[i]) / 0.06) * (1 - exit); c.translate(x, y); c.rotate(kr); c.scale(sc * kx, sc);
        c.lineWidth = 12; c.strokeStyle = "rgba(4,9,14,.55)"; c.strokeText(w, 0, 0); c.fillStyle = col; c.fillText(w, 0, 0); c.restore();
      });
      if (q && L.chips) { L.chips.forEach((ch, i) => { const ct = (L.chipAt || L.t0 + 1.2) + i * 0.14, p = E.back(inv(ct, ct + 0.3, t)); if (p <= 0) return; const n = L.chips.length, cw = n > 2 ? 270 : 300, cx = 540 + (i - (n - 1) / 2) * (cw + 16), cy = baseY + lay.rows * lh + 50;
        c.save(); c.translate(cx, cy); c.scale(p, p); K.rr(c, -cw / 2, -40, cw, 80, 40); c.fillStyle = ["rgba(255,200,61,.95)", "rgba(57,135,229,.92)", "rgba(139,108,255,.92)"][i % 3]; c.fill(); K.txt(c, ch, 0, 3, `800 ${n > 2 ? 38 : 44}px ${DISP}`, i ? "#ffffff" : "#1b1404"); c.restore(); }); }
      c.restore();
    });
  };
  // banded template: 3-word chunks in the top band, one highlighted word, instant swaps
  const STOP = new Set(["a","an","the","to","of","in","on","at","for","and","or","it","is","its","it's","as","up","by","with","from","that","this","you","he","she","they","we","are","was","were","be","so","now","out","but","too","more","still","can","how","long"]);
  function chunkLine(n) { if (n <= 4) return [n]; const k = Math.ceil(n / 4), base = Math.floor(n / k), extra = n % k; return Array.from({ length: k }, (_, i) => base + (i < extra ? 1 : 0)); }
  // V.hookLine: the first sentence is on screen whole from frame 0 (wrapped, up to 3 rows) instead of in 3-4 word chunks,
  // so the full premise is readable in the ~1.7 s a stranger takes to decide. Off by default; every existing video is unchanged.
  function hookCaption(c, L) {
    let fs = 78; const rowsOf = () => { c.font = `800 ${fs}px ${DISP}`; const sp = c.measureText(" ").width, rows = [[]]; let cw = 0;
      L.words.forEach(w => { const ww = c.measureText(w).width; if (cw > 0 && cw + sp + ww > 960) { rows.push([]); cw = 0; } rows[rows.length - 1].push(w); cw += (cw > 0 ? sp : 0) + ww; }); return { rows, sp }; };
    let r = rowsOf(); while (r.rows.length > 3 && fs > 56) { fs -= 4; r = rowsOf(); }
    let hi = -1, best = -1; L.words.forEach((w, i) => { const b = w.toLowerCase().replace(/[^a-z0-9'×–.:,]/g, "").replace(/[.,:]$/, ""); const sc = /\d/.test(b) ? 100 : STOP.has(b) ? 0 : b.length; if (sc > best) { best = sc; hi = i; } });
    c.save(); c.textBaseline = "middle"; c.textAlign = "left"; c.shadowColor = "rgba(0,0,0,.5)"; c.shadowBlur = 14; c.shadowOffsetY = 3; let k = 0;
    r.rows.forEach((row, ri) => { const wd = row.map(w => c.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + r.sp * (row.length - 1); let x = 540 - tot / 2;
      row.forEach((w, i) => { c.fillStyle = k === hi ? "#ffd23f" : "#ffffff"; c.fillText(w, x, 272 + ri * fs * 1.08); x += wd[i] + r.sp; k++; }); });
    c.restore();
  }
  K.styleCaptions = (c, t, V) => {
    V.lines.forEach((L, li) => {
      if (t < L.t0 || t >= L.t1) return; if (V.hookLine && li === 0) { hookCaption(c, L); return; } const sizes = L.words.join(" ").length <= 24 ? [L.words.length] : chunkLine(L.words.length); let s = 0, cur = null; // short lines stay whole
      sizes.forEach(n => { if (t >= L.at[s]) cur = [s, n]; s += n; }); if (!cur) cur = [0, sizes[0]]; const ws = L.words.slice(cur[0], cur[0] + cur[1]);
      let hi = -1, best = -1; ws.forEach((w, i) => { const b = w.toLowerCase().replace(/[^a-z0-9'×–.:,]/g, "").replace(/[.,:]$/, ""); const sc = /\d/.test(b) ? 100 : STOP.has(b) ? 0 : b.length; if (sc > best) { best = sc; hi = i; } });
      c.save(); let fs = 92; c.font = `800 ${fs}px ${DISP}`; let sp = c.measureText(" ").width, wd = ws.map(w => c.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
      if (tot > 1000) { fs = Math.floor(fs * 1000 / tot); c.font = `800 ${fs}px ${DISP}`; sp = c.measureText(" ").width; wd = ws.map(w => c.measureText(w).width); tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1); }
      let x = 540 - tot / 2; c.textBaseline = "middle"; c.textAlign = "left"; c.shadowColor = "rgba(0,0,0,.45)"; c.shadowBlur = 12; c.shadowOffsetY = 3;
      ws.forEach((w, i) => { c.fillStyle = i === hi ? "#ffd23f" : "#ffffff"; c.fillText(w, x, 272); x += wd[i] + sp; }); c.restore();
    });
  };
  K.bandCaptions = (c, t, V) => {
    V.lines.forEach(L => {
      if (t < L.t0 || t > L.t1) return; const groups = []; for (let i = 0; i < L.words.length; i += 3) groups.push(i);
      let gi = 0; groups.forEach((s, k) => { if (t >= L.at[s]) gi = k; }); const s = groups[gi], ws = L.words.slice(s, s + 3); if (t < L.at[s]) return;
      let hi = 0; ws.forEach((w, i) => { if (w.replace(/[^\w]/g, "").length > ws[hi].replace(/[^\w]/g, "").length) hi = i; });
      c.save(); c.font = `700 66px ${DISP}`; c.textBaseline = "middle"; const sp = c.measureText(" ").width, wd = ws.map(w => c.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1); let x = 540 - tot / 2;
      ws.forEach((w, i) => { c.fillStyle = i === hi ? "#f2c14e" : "#ffffff"; c.textAlign = "left"; c.fillText(w, x, 265); x += wd[i] + sp; }); c.restore();
    });
  };

  /* ---------------- fx ---------------- */
  let grain = null;
  K.fx = (c, t, vp, o = {}) => {
    const g = c.createRadialGradient(vp.x + vp.w / 2, vp.y + vp.h / 2, vp.h * 0.25, vp.x + vp.w / 2, vp.y + vp.h / 2, Math.max(vp.w, vp.h) * 0.72); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${o.vig == null ? 0.42 : o.vig})`); c.fillStyle = g; c.fillRect(vp.x, vp.y, vp.w, vp.h);
    if (!grain) { grain = document.createElement("canvas"); grain.width = grain.height = 180; const gc = grain.getContext("2d"), d = gc.createImageData(180, 180); let s = 11; for (let i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = s % 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } gc.putImageData(d, 0, 0); }
    c.save(); c.beginPath(); c.rect(vp.x, vp.y, vp.w, vp.h); c.clip(); c.globalAlpha = 0.045; c.globalCompositeOperation = "overlay"; const f = Math.floor(t * 24), ox = (f * 53) % 180, oy = (f * 97) % 180;
    for (let x = vp.x - ox; x < vp.x + vp.w; x += 180) for (let y = vp.y - oy; y < vp.y + vp.h; y += 180) c.drawImage(grain, x, y); c.restore();
    if (o.flash > 0) { c.fillStyle = o.flashColor ? o.flashColor.replace("A", o.flash) : `rgba(235,245,255,${o.flash})`; c.fillRect(vp.x, vp.y, vp.w, vp.h); }
  };
  // editor-style punch-ins: the strip zoom steps in/out by 7% on each key time (alternating), over a slow 3% drift,
  // so the frame never sits still and something visibly changes at least every ~2 s
  K.punchZoom = (t, keys, T) => { let z = 1 + 0.03 * clamp(t / (T || 15)); keys.forEach((k, i) => { z += (i % 2 ? -1 : 1) * 0.07 * E.out(inv(k, k + 0.22, t)); }); return z; };
  K.flashAt = (t, t0, dur = 0.09, peak = 0.65) => (t >= t0 && t < t0 + dur ? peak * (1 - (t - t0) / dur) : 0);
  K.shakeAt = (t, t0, amp = 18, k = 7) => (t > t0 && t < t0 + 0.6 ? amp * Math.exp(-k * (t - t0)) : 0);

  /* ---------------- sound ---------------- */
  const S = (K.Snd = {
    ac: null, out: null, noise: null,
    env(g, w, a, pk, dur) { g.gain.setValueAtTime(0.0001, w); g.gain.exponentialRampToValueAtTime(pk, w + a); g.gain.exponentialRampToValueAtTime(0.0001, w + dur); },
    osc(w, type, f0, f1, dur, pk, a) { const o = this.ac.createOscillator(), g = this.ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, w); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, w + dur); this.env(g, w, a || 0.006, pk, dur); o.connect(g); g.connect(this.out); o.start(w); o.stop(w + dur + 0.05); },
    nz(w, dur, type, f0, f1, q, pk) { const s = this.ac.createBufferSource(); s.buffer = this.noise; const f = this.ac.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, w); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, w + dur); const g = this.ac.createGain(); this.env(g, w, Math.min(0.1, dur * 0.4), pk, dur); s.connect(f); f.connect(g); g.connect(this.out); s.start(w, (w * 7.31) % 0.5); s.stop(w + dur + 0.05); },
    boom(w, f0 = 80, f1 = 28, dur = 1.1, pk = 0.7) { this.osc(w, "sine", f0, f1, dur, pk); },
    thump(w, k = 1) { this.osc(w, "sine", 68 * k, 32, 0.42, 0.85); this.nz(w, 0.18, "lowpass", 420, 180, 0.7, 0.3); },
    tick(w, f = 2200, pk = 0.045) { this.osc(w, "square", f, f, 0.025, pk); },
    tone(w, f, dur = 0.5, pk = 0.08, type = "sine") { this.osc(w, type, f, f, dur, pk); },
    chime(w, fs, pk = 0.08) { fs.forEach((f, i) => { this.osc(w + i * 0.012, "sine", f, f, 1.4, pk); this.osc(w + i * 0.012, "triangle", f * 2, f * 2, 0.5, pk * 0.3); }); },
    whoosh(w, dur = 0.8, up = true, pk = 0.3) { this.nz(w, dur, "bandpass", up ? 250 : 3000, up ? 3000 : 250, 1, pk); },
    hit(w) { this.boom(w, 90, 22, 1.3, 0.9); this.nz(w, 0.35, "bandpass", 1800, 600, 0.6, 0.4); },
    drone(freqs, level) { const ac = this.ac, g = ac.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(level, 0, 0.6); const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 260; freqs.forEach(fr => { const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = fr; o.connect(f); o.start(0); }); f.connect(g); g.connect(this.out); return g; },
  });

  /* ---------------- compositors + mount ---------------- */
  let stripC = null, stripX = null, blurC = null, blurX = null;
  K.mount = V => {
    const cv = document.getElementById("cv"), ctx = cv.getContext("2d");
    function frame(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
      const sh = V.shake ? V.shake(t) : 0, sx = K.noise(t * 42) * sh, sy = K.noise(t * 42 + 50) * sh, fl = V.flash ? V.flash(t) : 0;
      if (V.mode === "full") {
        ctx.save(); ctx.translate(sx, sy); const vp = { x: -24, y: -24, w: W + 48, h: H + 48 }; ctx.save(); ctx.beginPath(); ctx.rect(vp.x, vp.y, vp.w, vp.h); ctx.clip(); V.scene(ctx, t, vp); ctx.restore(); ctx.restore();
        if (V.pill) K.pill(ctx, 48, 205, V.pill, { alpha: clamp(E.back(inv(0.1, 0.45, t))) });
        if (V.hud) V.hud(ctx, t); K.captions(ctx, t, V); K.footnote(ctx, V.footnote); K.fx(ctx, t, { x: 0, y: 0, w: W, h: H }, { flash: fl, flashColor: V.flashColor });
      } else if (V.mode === "style") {
        // LAYOUT=full (set by make_page "layout=full"): the same scene fills the whole 9:16 frame, no blurred bands.
        // Scene coordinates are unchanged: the square region stays at y 0..1080 and the viewport grows 420 px above and below it,
        // so scenes that fill/centre on their viewport extend naturally; fixed-coordinate content stays centred on screen.
        const FULL = window.LAYOUT === "full", SY = FULL ? 0 : 468, SH = FULL ? H : 1080, OY = FULL ? (H - 1080) / 2 : 0;
        if (!stripC) { stripC = document.createElement("canvas"); stripC.width = W; stripC.height = SH; stripX = stripC.getContext("2d"); blurC = document.createElement("canvas"); blurC.width = 27; blurC.height = 48; blurX = blurC.getContext("2d"); }
        stripX.setTransform(1, 0, 0, 1, 0, 0); stripX.clearRect(0, 0, W, SH); stripX.save(); stripX.translate(sx * 0.6, sy * 0.6 + OY); const vp = { x: 0, y: -OY, w: W, h: SH }, sq = { x: 0, y: 0, w: W, h: 1080 };
        if (V.punch) { const pz = K.punchZoom(t, V.punch, V.T); stripX.translate(W / 2, 540); stripX.scale(pz, pz); stripX.translate(-W / 2, -540); }
        if (V.bandMap) { const m = V.bandMap(t), s = m.s || 1; stripX.translate(W / 2, 540); stripX.scale(s, s); stripX.translate(-m.cx, -m.cy); const svp = { x: m.cx - W / 2 / s, y: m.cy - SH / 2 / s, w: W / s, h: SH / s }; V.scene(stripX, t, svp); if (V.hudInScene) V.hudInScene(stripX, t); }
        else V.scene(stripX, t, vp);
        stripX.restore(); if (V.bandHud) { stripX.save(); stripX.translate(0, OY); V.bandHud(stripX, t, sq); stripX.restore(); } K.fx(stripX, t, { x: 0, y: 0, w: W, h: SH }, { flash: fl, flashColor: V.flashColor, vig: 0.3 });
        if (!FULL) {
          blurX.imageSmoothingQuality = "high"; blurX.drawImage(stripC, 0, 0, W, SH, -6, -6, 39, 60); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(blurC, 0, 0, 27, 48, -40, -40, W + 80, H + 80);
          ctx.fillStyle = "rgba(0,0,0,.58)"; ctx.fillRect(0, 0, W, H);
          ctx.drawImage(stripC, 0, SY); const g1 = ctx.createLinearGradient(0, SY, 0, SY + 46); g1.addColorStop(0, "rgba(0,0,0,.45)"); g1.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g1; ctx.fillRect(0, SY, W, 46); const g2 = ctx.createLinearGradient(0, SY + SH - 46, 0, SY + SH); g2.addColorStop(0, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(0,0,0,.45)"); ctx.fillStyle = g2; ctx.fillRect(0, SY + SH - 46, W, 46);
        } else { // full frame + soft scrims so the captions (top) and credit (bottom) stay readable over any picture
          ctx.drawImage(stripC, 0, 0); const g1 = ctx.createLinearGradient(0, 0, 0, 560); g1.addColorStop(0, "rgba(0,0,0,.62)"); g1.addColorStop(0.55, "rgba(0,0,0,.3)"); g1.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g1; ctx.fillRect(0, 0, W, 560);
          const g2 = ctx.createLinearGradient(0, H - 420, 0, H); g2.addColorStop(0, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(0,0,0,.55)"); ctx.fillStyle = g2; ctx.fillRect(0, H - 420, W, 420);
        }
        K.styleCaptions(ctx, t, V); ctx.save(); if ("letterSpacing" in ctx) ctx.letterSpacing = "1px"; K.txt(ctx, V.credit ? V.credit(t) : "Curio animation", 540, 1690, `600 34px ${DISP}`, "rgba(208,208,208,.78)"); ctx.restore();
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1c242d"); g.addColorStop(0.5, "#11171e"); g.addColorStop(1, "#0a0f14"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const vp = { x: 0, y: 450, w: W, h: 880 }; ctx.save(); ctx.beginPath(); ctx.rect(vp.x, vp.y, vp.w, vp.h); ctx.clip(); ctx.translate(sx * 0.6, sy * 0.6); V.scene(ctx, t, vp); if (V.bandHud) V.bandHud(ctx, t, vp); ctx.restore();
        K.fx(ctx, t, vp, { flash: fl, flashColor: V.flashColor }); K.bandCaptions(ctx, t, V);
        K.txt(ctx, "Illustration · sources in caption · @trycurio", 540, 1400, `500 30px ${DISP}`, "rgba(220,226,232,.75)", "center", "alphabetic");
        K.txt(ctx, "curio", 1010, 1560, `600 32px ${DISP}`, "rgba(220,226,232,.6)", "right", "alphabetic");
      }
    }
    window.renderFrame = frame;
    window.frameDataURL = t => { frame(t); return cv.toDataURL("image/png"); };
    window.fontsReady = async () => { if (V.ready) await V.ready; await Promise.all([`700 76px ${DISP}`, `800 104px ${DISP}`, `600 28px ${DISP}`, `500 24px ${DISP}`, `700 66px ${DISP}`, `800 54px ${DISP}`, `500 24px ${MONO}`, `700 60px ${HAND}`].map(f => document.fonts.load(f))); return document.fonts.check(`700 76px ${DISP}`); };
    window.renderSfx = async sr => {
      const ac = new OfflineAudioContext(2, Math.ceil(sr * V.T), sr); S.ac = ac; const comp = ac.createDynamicsCompressor(); S.out = ac.createGain(); S.out.gain.value = 0.55; S.out.connect(comp); comp.connect(ac.destination);
      const b = ac.createBuffer(1, sr, sr), d = b.getChannelData(0); let s = 7; for (let i = 0; i < sr; i++) { s = (s * 16807) % 2147483647; d[i] = s / 2147483647 * 2 - 1; } S.noise = b;
      if (V.drone) { const g = S.drone(V.drone.freqs, V.drone.level); (V.drone.env || []).forEach(([tt, lv]) => g.gain.setTargetAtTime(Math.max(0.0001, lv), tt, 0.25)); }
      for (const [et, fn] of (V.mode === "style" ? V.foley || [] : V.events)) if (et >= 0 && et < V.T) fn(et + 0.0005);
      const buf = await ac.startRendering(), ch = [buf.getChannelData(0), buf.getChannelData(1)], N = buf.length, ab = new ArrayBuffer(44 + N * 4), v = new DataView(ab);
      const ws = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
      ws(0, "RIFF"); v.setUint32(4, 36 + N * 4, true); ws(8, "WAVE"); ws(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); ws(36, "data"); v.setUint32(40, N * 4, true);
      let o = 44; for (let i = 0; i < N; i++) for (let k = 0; k < 2; k++) { const x = Math.max(-1, Math.min(1, ch[k][i])); v.setInt16(o, x < 0 ? x * 32768 : x * 32767, true); o += 2; }
      let bin = ""; const u8 = new Uint8Array(ab); for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return btoa(bin);
    };
  };
  // word lookup by text: K.ix(WORDS, /^cook/, n) -> index of the nth match (throws if the script changed)
  K.ix = (words, re, n = 0) => { let k = -1; for (let i = 0; i < words.length; i++) if (re.test(words[i].w) && ++k === n) return i; throw new Error("word not found: " + re + " #" + n); };
  // captions straight from the narration: one line per phrase (split at , . ? ! …), spoken numbers shown as digits.
  // nums = [["thirty-five thousand", "35,000"], ...]; trailing commas dropped, sentence punctuation kept.
  // breaks = extra line ends so phrases stay whole: /^mile$/ (every match) or [/^you$/, 1] (the 2nd "you" only).
  K.autoLines = (words, T, nums = [], breaks = []) => {
    const norm = s => s.toLowerCase().replace(/[^a-z0-9'’-]/g, ""), spec = []; let cur = [];
    const brk = new Set(); breaks.forEach(b => { if (Array.isArray(b)) brk.add(K.ix(words, b[0], b[1])); else words.forEach((x, i) => { if (b.test(x.w)) brk.add(i); }); });
    for (let i = 0; i < words.length; i++) {
      let disp = words[i].w, last = i;
      for (const [phrase, d] of nums) { const p = phrase.split(" "); if (p.every((x, k) => words[i + k] && norm(words[i + k].w) === x)) { last = i + p.length - 1; disp = d + (words[last].w.match(/[.,?!…]+$/) || [""])[0]; break; } }
      const end = /[.,?!…]$/.test(disp) || brk.has(last); cur.push([disp.replace(/,$/, ""), i]); i = last;
      if (end) { spec.push(cur); cur = []; }
    }
    if (cur.length) spec.push(cur);
    return K.linesFrom(words, spec, T);
  };
  // build caption lines from spoken word times: spec = [[["33",0],["miners.",1]], ...] (display word, spoken-word index)
  K.linesFrom = (words, spec, T, opts = {}) => {
    const lines = spec.map(l => ({ words: l.map(x => x[0]), at: l.map(x => words[x[1]].s), slam: l.slam, q: l.q, chips: l.chips, chipAt: l.chipAt }));
    // each line holds until the next one starts: hard swaps, never a blank frame between lines
    lines.forEach((L, i) => { L.t0 = L.at[0] - 0.04; L.t1 = i < lines.length - 1 ? lines[i + 1].at[0] - 0.04 : T; });
    if (lines.length) lines[0].t0 = 0; // the first caption is on screen from frame 0: the opening frame is what people decide on
    return lines;
  };
})();
