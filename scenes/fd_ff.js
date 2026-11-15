/* FD footage-first · arm A (visual-first, 13.5 s), payoff unchanged ("visited" at 5.04 s). Fordlandia: Henry Ford's rubber town in the
   Amazon, 1928-1945. Same-story pair with FDL: same first picture (the water tower and warehouse, colour, cover, fx 0.215). Facts:
   assets/src/fordlandia/facts.json. No rights-clear photo of the 1930 riot or the cafeteria exists, so none is implied: that beat shows
   the warehouse as it stands. The loss figure covers both Ford towns. No diagram. */
window.SPEC = {
  credit: "Amit Evron · CC BY-SA 3.0",
  beats: [
    { kind: "photo", src: "tower", fit: "cover", fx: 0.215, fy: 0.5, z0: 1.0, z1: 1.08, label: "REAL PHOTO · FORDLANDIA, BRAZIL" },
    { kind: "photo", src: "aerial", at: /^He$/, pw: 1000, z0: 1.0, z1: 1.06, label: "FORD COMPANY PHOTO · FORDLANDIA, 1934", credit: "Ford Motor Company, 1934 · public domain" },
    { kind: "photo", src: "warehouse", at: /^The$/, pw: 1000, z0: 1.0, z1: 1.06, label: "THE MAIN WAREHOUSE, FORDLANDIA", credit: "RodrigoCruzatti · CC BY 4.0" },
    { kind: "photo", src: "trees", at: /^blight/, pw: 1000, z0: 1.0, z1: 1.06, label: "FORDLANDIA, UNDER THE TREES", credit: "Méduse · CC BY-SA 3.0" },
    { kind: "photo", src: "watertower", at: /^It$/, fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.08, label: "THE WATER TOWER STILL STANDS" },
  ],
  nums: [["twenty million dollars", "$20 million"]],
  stamps: [
    { text: "FORD NEVER VISITED", at: /^never$/, to: /^The$/, y: 1570, size: 68 },
    { text: "1930: RIOT", at: /^rioted/, to: /^blight/, y: 1570, size: 80 },
    { text: "LOSS: OVER $20 MILLION", at: /^twenty$/, y: 1570, size: 60 },
  ],
};
