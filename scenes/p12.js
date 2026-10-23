/* P12 · Gemini 8's stuck thruster (16 Mar 1966). Facts: Wikipedia "Gemini 8" (OAMS thruster No. 8 stuck on; tumble reached
   296 deg/s, ~0.82 rev/s; Armstrong shut down the OAMS and used the re-entry control (nose) thrusters; mission aborted early;
   crew recovered). The rotating beat spins at the real 296 deg/s. Plates: Curio illustration (gpt-image-2). Engine: scenes/plates.js. */
window.SPEC = {
  credit: "Curio illustration · story: NASA, Wikipedia \"Gemini 8\"",
  nums: [["nineteen sixty-six", "1966"], ["Gemini Eight", "Gemini 8"], ["two hundred ninety-six", "296"]],
  beats: [
    { img: "a", fy: 0.56, z0: 1.3, z1: 1.4, wobble: [7, 4.5] },
    { img: "b", at: /^In$/, fy: 0.45, z0: 1.04, z1: 1.16 },
    { img: "c", at: /^tumble$/, fy: 0.5, z0: 2.1, z1: 2.2, spin: 296 },
    { img: "a", at: [/^Armstrong$/, 1], fy: 0.56, z0: 1.3, z1: 1.36, wobble: [3, 2] },
    { img: "d", at: /^they$/, fy: 0.55, z0: 1.12, z1: 1.04 },
  ],
  streaks: [0, /^In$/],
  vapor: [{ at: /^thruster$/, x: 330, y: 300, dir: 3.1, dur: 1.4 }],
  tags: [{ text: "GEMINI 8 · MARCH 1966", at: /^In$/, to: /^tumble$/ }],
  counter: { label: "ROLL RATE", at: /^tumble$/, to: /^they$/, values: [[/^tumble$/, "90°/S"], [/^reached$/, "180°/S"], [/^two$/, "296°/S"], [/^stop$/, "0°/S"]] },
  stamps: [{ text: "CREW RECOVERED", at: /^they$/, y: 800, size: 72 }],
};
