// Motion toolkit: easing, springs, keyframe tracks, smooth noise. Everything is a pure function of time.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const smooth = k => k * k * (3 - 2 * k);
export const smoother = k => k * k * k * (k * (k * 6 - 15) + 10);
export const inOut = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const outCubic = k => 1 - Math.pow(1 - k, 3);
export const inCubic = k => k * k * k;
export const outExpo = k => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
export const inExpo = k => (k <= 0 ? 0 : Math.pow(2, 10 * k - 10));
export const inOutExpo = k => (k <= 0 ? 0 : k >= 1 ? 1 : k < 0.5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2);
export const outBack = (k, s = 1.70158) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
export const inOutSine = k => -(Math.cos(Math.PI * k) - 1) / 2;
export const outQuint = k => 1 - Math.pow(1 - k, 5);
export const inOutQuint = k => (k < 0.5 ? 16 * k ** 5 : 1 - Math.pow(-2 * k + 2, 5) / 2);

// Underdamped spring step response from 0 to 1, started at t0. freq in Hz, damping ratio z (<1 overshoots).
export function spring(t, t0, freq = 2.2, z = 0.42) {
  const x = t - t0; if (x <= 0) return 0;
  const w = 2 * Math.PI * freq, wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
}
// Decaying shake impulse (for stamps, impacts): returns a value in about [-1, 1].
export function shake(t, t0, dur = 0.45, freq = 18) {
  const x = t - t0; if (x < 0 || x > dur) return 0;
  return Math.sin(x * freq * 2 * Math.PI) * Math.pow(1 - x / dur, 2);
}

// Smooth 1D value noise (deterministic), roughly in [-1, 1].
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return s - Math.floor(s); }
export function noise(t, seed = 0) {
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return (hash(i + seed * 57.3) * (1 - u) + hash(i + 1 + seed * 57.3) * u) * 2 - 1;
}
export function fbm(t, seed = 0) { return noise(t, seed) * 0.6 + noise(t * 2.13, seed + 9) * 0.3 + noise(t * 4.7, seed + 21) * 0.1; }

// Keyframe track: keys = [[t, value, ease?], ...]; value may be a number or an array. ease applies to the span that ends at that key.
export function track(keys) {
  return t => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, e] = keys[i];
      if (t <= t1) {
        const [t0, v0] = keys[i - 1];
        const k = (e || inOut)(seg(t, t0, t1));
        return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], k)) : lerp(v0, v1, k);
      }
    }
    return keys[keys.length - 1][1];
  };
}
// Hold-and-cut list: [[t, value], ...] -> value of the last key at or before t.
export function cuts(keys) { return t => { let v = keys[0][1]; for (const [k, val] of keys) if (t >= k) v = val; return v; }; }

// Blink: returns eye-open scale 1 -> ~0.1 for ~0.12 s at the given times.
export function blink(t, times) {
  for (const b of times) { const x = (t - b) / 0.13; if (x >= 0 && x <= 1) return 1 - 0.9 * Math.sin(x * Math.PI); }
  return 1;
}
