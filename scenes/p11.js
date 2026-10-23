/* P11 · Apollo 13's duct-tape air filter (April 1970). Facts: Wikipedia "Apollo 13" (oxygen tank exploded; LM built for two men
   for two days had to support three for four; CM canisters did not fit the LM; the "mailbox" adapter from procedure-manual
   covers and duct tape; CO2 began dropping immediately). Plates: Curio illustration (gpt-image-2). Engine: scenes/plates.js. */
window.SPEC = {
  credit: "Curio illustration · story: NASA, Wikipedia \"Apollo 13\"",
  nums: [["thirteen's", "13's"]],
  beats: [
    { img: "a", fy: 0.5, z0: 1.06, z1: 1.22 },
    { img: "b", at: /^After$/, fy: 0.5, z0: 1.04, z1: 1.16 },
    { img: "d", at: /^three$/, fy: 0.55, z0: 1.06, z1: 1.18 },
    { img: "a", at: /^The$/, fx: 0.62, fy: 0.5, z0: 1.4, z1: 1.55 },
    { img: "c", at: /^So$/, fy: 0.5, z0: 1.04, z1: 1.18 },
    { img: "d", at: /^carbon$/, fy: 0.5, z0: 1.2, z1: 1.08 },
  ],
  vapor: [{ at: /^exploded/, x: 380, y: 730, dir: 2.6, dur: 1.6 }],
  shakes: [[/^exploded/, 16]],
  tags: [{ text: "APOLLO 13 · APRIL 1970", at: /^After$/, to: /^three$/ }, { text: "BUILT FOR 2 · CARRYING 3", at: /^three$/, to: /^The$/, color: "#ffc83d" }, { text: "DIDN'T FIT", at: /^didn't$/, to: /^So$/, color: "#ff8a7a" }],
  stamps: [{ text: "CO₂ DROPPING", at: /^started$/, y: 800, size: 72 }],
};
