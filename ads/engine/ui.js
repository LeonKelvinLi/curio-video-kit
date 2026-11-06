// 2D layer: kinetic captions keyed to the voice, HUD chips, ink stamps, speech bubbles, the Curio end card,
// and the canvases that become textures (report card, stats card). Fonts are Curio's own: Fraunces + Hanken Grotesk.
import * as M from "./motion.js";

export const FONTS = ["italic 500 60px Fraunces", "500 60px Fraunces", "600 60px Fraunces", "italic 700 60px Fraunces", "800 60px Fraunces", "600 40px 'Hanken Grotesk'", "800 40px 'Hanken Grotesk'"];
export const COL = { pink: "#ff8ad8", lilac: "#cbb8ff", white: "#ffffff", red: "#ff5468", ink: "#0b0910", gold: "#ffcf6e" };

export function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// Load a VO word list and shift words into the edit: segs = [{from: srcTime, to: srcTime, at: editTime}]
export function placeWords(words, segs) {
  const out = [];
  words.forEach((w0, i) => {
    const w = Array.isArray(w0) ? w0 : [w0.w, w0.s, w0.e];
    const s = segs.find(sg => w[1] >= sg.from - 0.02 && w[1] < sg.to);
    if (!s) return;
    const d = s.at - s.from; out.push({ i, w: w[0], s: w[1] + d, e: w[2] + d });
  });
  return out;
}

// ---------------------------------------------------------------- captions
// line = { words: [placed words], y, size, hi: [word strings, lowercase, no punctuation], out: time, style: "low"|"hook" }
export function caption(g, t, line) {
  const ws = line.words; if (!ws.length) return;
  const tIn = ws[0].s - 0.08, tOut = line.out ?? ws[ws.length - 1].e + 0.35;
  if (t < tIn || t > tOut + 0.25) return;
  const fade = 1 - M.smooth(M.seg(t, tOut, tOut + 0.22));
  const size = line.size || 54, maxW = line.maxW || 880, x0 = 540, lh = size * 1.18;
  const hiSet = new Set((line.hi || []).map(s => s.toLowerCase()));
  const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, "");
  // layout into lines
  const fontN = `italic ${line.weight || 500} ${size}px Fraunces`, fontH = `italic ${line.hiWeight || 700} ${size}px Fraunces`;
  g.font = fontN; const space = g.measureText(" ").width + size * 0.12;
  const items = ws.map(w => { const hi = hiSet.has(norm(w.w)); g.font = hi ? fontH : fontN; return { ...w, hi, wd: g.measureText(w.w).width }; });
  const rows = [[]]; let cw = 0;
  for (const it of items) { if (cw + it.wd > maxW && rows[rows.length - 1].length) { rows.push([]); cw = 0; } rows[rows.length - 1].push(it); cw += it.wd + space; }
  const y0 = line.y - (rows.length - 1) * lh / 2;
  g.save(); g.textBaseline = "middle"; g.textAlign = "left";
  if (line.scrim) { const sa = 0.42 * fade * M.smooth(M.seg(t, tIn, tIn + 0.25)); const rg = g.createRadialGradient(540, line.y, 10, 540, line.y, 520); rg.addColorStop(0, `rgba(8,5,18,${sa})`); rg.addColorStop(1, "rgba(8,5,18,0)"); g.save(); g.translate(540, line.y); g.scale(1, 0.32); g.translate(-540, -line.y); g.fillStyle = rg; g.fillRect(0, line.y - 520, 1080, 1040); g.restore(); }
  rows.forEach((row, ri) => {
    const rw = row.reduce((a, it) => a + it.wd, 0) + space * (row.length - 1); let x = x0 - rw / 2;
    for (const it of row) {
      const k = M.outCubic(M.seg(t, it.s - 0.07, it.s + 0.16));
      if (k > 0) {
        const pop = it.hi ? 1 + 0.12 * Math.max(0, M.spring(t, it.s, 3.2, 0.35) - 1 + 1) * (1 - M.seg(t, it.s + 0.25, it.s + 0.6)) : 1;
        g.globalAlpha = k * fade; g.font = it.hi ? fontH : fontN;
        const cx = x + it.wd / 2, cy = y0 + ri * lh + (1 - k) * 16;
        g.save(); g.translate(cx, cy); const sc = (0.94 + 0.06 * k) * (it.hi ? Math.min(pop, 1.06) : 1); g.scale(sc, sc);
        g.shadowColor = "rgba(5,3,12,0.75)"; g.shadowBlur = 22; g.shadowOffsetY = 3;
        g.fillStyle = it.hi ? (line.hiColor || COL.pink) : (line.color || "#fff");
        g.fillText(it.w, -it.wd / 2, 0); g.restore();
      }
      x += it.wd + space;
    }
  });
  g.restore(); g.globalAlpha = 1;
}

// ---------------------------------------------------------------- chips (HUD tags)
export function chip(g, t, { x, y, label, value, t0, t1, accent = COL.pink, align = "left", big = 64, icon }) {
  if (t < t0 - 0.01 || (t1 != null && t > t1 + 0.35)) return;
  const kin = M.outBack(M.seg(t, t0, t0 + 0.38), 1.4), kout = t1 != null ? M.inCubic(M.seg(t, t1, t1 + 0.3)) : 0, k = Math.max(0, kin) * (1 - kout);
  if (k <= 0) return;
  g.save(); g.font = "800 26px 'Hanken Grotesk'"; const lw = g.measureText(label.toUpperCase()).width + label.length * 2.2; g.font = `600 ${big}px Fraunces`; const vw = g.measureText(value).width;
  const w = Math.max(lw, vw) + 56, h = big + 72; const bx = align === "left" ? x : x - w;
  g.globalAlpha = Math.min(1, k * 1.4); g.translate(bx + (align === "left" ? 0 : w), y); g.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k); g.translate(-(align === "left" ? 0 : w), 0);
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 30; g.shadowOffsetY = 8;
  rr(g, 0, 0, w, h, 22); g.fillStyle = "rgba(14,11,24,0.78)"; g.fill(); g.shadowColor = "transparent";
  g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = accent; g.fillRect(0, 22, 5, h - 44);
  g.font = "800 26px 'Hanken Grotesk'"; g.fillStyle = accent; g.textBaseline = "top"; if (g.letterSpacing !== undefined) g.letterSpacing = "2.2px"; g.fillText(label.toUpperCase(), 28, 22);
  if (g.letterSpacing !== undefined) g.letterSpacing = "0px";
  g.font = `600 ${big}px Fraunces`; g.fillStyle = "#fff"; g.fillText(value, 28, 54);
  g.restore();
}

// ---------------------------------------------------------------- ink stamp
let inkMask = null;
function getInk() {
  if (inkMask) return inkMask; const c = document.createElement("canvas"); c.width = c.height = 512; const x = c.getContext("2d");
  let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(0,0,0,${r() * 0.55})`; x.beginPath(); x.arc(r() * 512, r() * 512, r() * 3.2, 0, 7); x.fill(); }
  for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.3})`; x.fillRect(r() * 512, r() * 512, 20 + r() * 80, 2 + r() * 3); }
  inkMask = c; return c;
}
export function stamp(g, t, { x, y, t0, t1, text, sub, color = COL.red, rot = -9, size = 92 }) {
  if (t < t0 || (t1 != null && t > t1 + 0.3)) return;
  const k = M.seg(t, t0, t0 + 0.16), sc = k < 1 ? 2.4 - 1.4 * M.inCubic(k) : 1 + 0.04 * Math.exp(-(t - t0 - 0.16) * 14) * Math.sin((t - t0 - 0.16) * 60);
  const a = (k < 1 ? 0.3 + 0.7 * k : 1) * (t1 != null ? 1 - M.seg(t, t1, t1 + 0.25) : 1);
  const c = document.createElement("canvas"); g.save(); g.font = `900 ${size}px 'Hanken Grotesk'`;
  const tw = g.measureText(text).width; g.font = `800 ${size * 0.36}px 'Hanken Grotesk'`; const sw = sub ? g.measureText(sub).width : 0;
  const w = Math.max(tw, sw) + 70, h = size * (sub ? 1.62 : 1.18) + 30; c.width = w + 20; c.height = h + 20; const s = c.getContext("2d");
  s.translate(10, 10); s.strokeStyle = color; s.lineWidth = 9; rr(s, 0, 0, w, h, 14); s.stroke(); s.lineWidth = 3; rr(s, 10, 10, w - 20, h - 20, 8); s.stroke();
  s.fillStyle = color; s.textAlign = "center"; s.textBaseline = "middle"; s.font = `900 ${size}px 'Hanken Grotesk'`; s.fillText(text, w / 2, sub ? h * 0.38 : h / 2 + 4);
  if (sub) { s.font = `800 ${size * 0.36}px 'Hanken Grotesk'`; s.fillText(sub, w / 2, h * 0.76); }
  s.globalCompositeOperation = "destination-out"; s.drawImage(getInk(), -10, -10, c.width, c.height);
  g.globalAlpha = a; g.translate(x, y); g.rotate(rot * Math.PI / 180); g.scale(sc, sc);
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 16; g.drawImage(c, -c.width / 2, -c.height / 2); g.restore();
}

// ---------------------------------------------------------------- speech bubble
export function bubble(g, t, { x, y, t0, t1, text, w = 520, tail = "down", size = 44, color = "#ffffff", ink = "#1a1326", italic = true }) {
  if (t < t0 || (t1 != null && t > t1 + 0.3)) return;
  const k = M.spring(t, t0, 2.6, 0.45), out = t1 != null ? M.inCubic(M.seg(t, t1, t1 + 0.25)) : 0, s = Math.max(0, k) * (1 - out);
  if (s <= 0.001) return;
  g.save(); g.font = `${italic ? "italic " : ""}600 ${size}px Fraunces`;
  const words = text.split(" "), rows = [""]; for (const wd of words) { const tr = (rows[rows.length - 1] + " " + wd).trim(); if (g.measureText(tr).width > w - 70 && rows[rows.length - 1]) rows.push(wd); else rows[rows.length - 1] = tr; }
  const bw = Math.min(w, Math.max(...rows.map(r => g.measureText(r).width)) + 70), bh = rows.length * size * 1.2 + 50;
  g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, s * 1.5);
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 30; g.shadowOffsetY = 10;
  g.fillStyle = color; rr(g, -bw / 2, -bh - 26, bw, bh, 34); g.fill();
  g.beginPath(); if (tail === "down") { g.moveTo(-18, -30); g.lineTo(6, 6); g.lineTo(26, -30); } else { g.moveTo(-bw / 2 + 60, -30); g.lineTo(-bw / 2 + 30, 10); g.lineTo(-bw / 2 + 100, -30); } g.fill();
  g.shadowColor = "transparent"; g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
  rows.forEach((r, i) => g.fillText(r, 0, -bh - 26 + 25 + size * 0.6 + i * size * 1.2));
  g.restore();
}

// ---------------------------------------------------------------- end card
let rabbitImg = null;
export async function loadEndArt(E) { rabbitImg = await E.img("/assets/curio-rabbit.png"); }
export function endCard(g, t, { t0, headline = ["Turn scrolling", "into ", "learning."], sub = "Free on the App Store", kicker, wipeFrom }) {
  if (t < t0) return;
  const k = M.seg(t, t0, t0 + 0.55), ke = M.inOutExpo(k);
  g.save();
  // iris wipe from a point (the phone screen, usually)
  const cx = wipeFrom ? wipeFrom.x : 540, cy = wipeFrom ? wipeFrom.y : 960, R = 2300 * ke;
  g.beginPath(); g.arc(cx, cy, Math.max(1, R), 0, 7); g.clip();
  const gr = g.createRadialGradient(540, 700, 50, 540, 960, 1300); gr.addColorStop(0, "#2a1650"); gr.addColorStop(0.55, "#120b22"); gr.addColorStop(1, "#07060b");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // aurora
  for (let i = 0; i < 3; i++) { const ag = g.createRadialGradient(540 + Math.sin(t * 0.6 + i * 2) * 260, 620 + i * 260, 10, 540, 760 + i * 200, 620); ag.addColorStop(0, ["rgba(255,138,216,0.28)", "rgba(123,92,255,0.30)", "rgba(47,183,165,0.16)"][i]); ag.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = ag; g.fillRect(0, 0, 1080, 1920); }
  const a = (d, dur = 0.5) => M.outCubic(M.seg(t, t0 + d, t0 + d + dur));
  // rabbit
  if (rabbitImg) { const ka = M.spring(t, t0 + 0.2, 2.2, 0.5), bob = Math.sin((t - t0) * 2.2) * 6; g.globalAlpha = Math.min(1, ka); const s = 0.62 * ka; g.drawImage(rabbitImg, 540 - 312 * s, 520 - 320 * s + bob, 624 * s, 640 * s); g.globalAlpha = 1; }
  // wordmark
  g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.globalAlpha = a(0.3); g.font = "600 96px Fraunces"; g.fillStyle = "#fff"; g.fillText("curio", 540, 820 + (1 - a(0.3)) * 20);
  if (kicker) { g.globalAlpha = a(0.45); g.font = "800 26px 'Hanken Grotesk'"; if (g.letterSpacing !== undefined) g.letterSpacing = "4px"; g.fillStyle = COL.lilac; g.fillText(kicker.toUpperCase(), 540, 880); if (g.letterSpacing !== undefined) g.letterSpacing = "0px"; }
  // headline: [line1, line2-prefix, pink-italic-word]
  g.globalAlpha = a(0.55); g.font = "500 92px Fraunces"; g.fillStyle = "#fff"; g.fillText(headline[0], 540, 1050 + (1 - a(0.55)) * 30);
  g.globalAlpha = a(0.7); g.font = "500 92px Fraunces"; const p1 = headline[1]; g.font = "500 92px Fraunces"; const w1 = g.measureText(p1).width; g.font = "italic 700 92px Fraunces"; const w2 = g.measureText(headline[2]).width;
  const sx = 540 - (w1 + w2) / 2; g.textAlign = "left"; g.font = "500 92px Fraunces"; g.fillStyle = "#fff"; g.fillText(p1, sx, 1160 + (1 - a(0.7)) * 30);
  g.font = "italic 700 92px Fraunces"; g.fillStyle = COL.pink; g.fillText(headline[2], sx + w1, 1160 + (1 - a(0.7)) * 30);
  // button
  const kb = M.spring(t, t0 + 0.95, 2.4, 0.5); if (kb > 0) { g.globalAlpha = Math.min(1, kb); g.save(); g.translate(540, 1320); g.scale(kb, kb);
    g.font = "800 38px 'Hanken Grotesk'"; const bw = g.measureText(sub).width + 110; rr(g, -bw / 2, -46, bw, 92, 46); g.fillStyle = "#fff"; g.shadowColor = "rgba(255,138,216,0.55)"; g.shadowBlur = 40; g.fill(); g.shadowBlur = 0;
    g.fillStyle = "#120b22"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(sub, 0, 2); g.restore(); }
  g.globalAlpha = a(1.2); g.font = "600 30px 'Hanken Grotesk'"; g.textAlign = "center"; g.fillStyle = "rgba(255,255,255,0.6)"; g.fillText("trycurio.app", 540, 1440);
  g.restore(); g.globalAlpha = 1;
}

// ---------------------------------------------------------------- flash / whip helpers
export function flash(g, t, t0, dur = 0.25, color = "255,255,255", peak = 0.85) {
  const x = (t - t0) / dur; if (x < 0 || x > 1) return; g.save(); g.globalAlpha = peak * (x < 0.25 ? x / 0.25 : 1 - (x - 0.25) / 0.75); g.fillStyle = `rgb(${color})`; g.fillRect(0, 0, 1080, 1920); g.restore(); g.globalAlpha = 1;
}
export function fadeBlack(g, t, t0, t1, a0 = 0, a1 = 1) { if (t < t0) return; const k = M.seg(t, t0, t1); g.save(); g.globalAlpha = a0 + (a1 - a0) * k; g.fillStyle = "#000"; g.fillRect(0, 0, 1080, 1920); g.restore(); g.globalAlpha = 1; }
