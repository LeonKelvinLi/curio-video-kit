/* CUU footage-first · T8-5 paired test (unchanged), arm A (visual-first). Generated with its pair (CU4) from one design: same pictures,
   framing, labels, credits, tags and stamps; only the two middle sentences (and so their beats) swap. Erno Rubik built his cube in
   1974 as a teaching model, scrambled it and needed over a month (his own recollection, G4G interview) to restore it; his doubt it
   could be solved is reported second-hand ("reportedly"). 20 moves = standard 3x3, half-turn metric (cube20.org).
   Facts: assets/src/rubikcube/facts.json. First frame: a generic scrambled 3x3 cube with no logo (Rubik's is a trademark; the photo
   is not his cube and the label does not say it is). No diagram. */
window.SPEC = {
  credit: "cubemeister.com · CC BY-SA 3.0",
  beats: [
    { kind: "photo", src: "cube", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.08, label: "PHOTO · A SCRAMBLED 3X3 CUBE" },
    { kind: "photo", src: "rubik", at: [/^He$/, 0], pw: 860, maxH: 900, z0: 1.0, z1: 1.06, label: "ERNO RUBIK · PHOTO, 2014", credit: "Babak Mansouri, 2014 · public domain" },
    { kind: "photo", src: "solved", at: /^It$/, pw: 1000, z0: 1.0, z1: 1.06, label: "PHOTO · A SOLVED 3X3 CUBE", credit: "Photo: 多多123 · CC BY 4.0" },
    { kind: "photo", src: "ponder", at: [/^He$/, 1], pw: 740, maxH: 1000, z0: 1.0, z1: 1.05, label: "ERNO RUBIK · PORTRAIT", credit: "Rózsavölgyi Gyöngyi · CC BY-SA 4.0" },
    { kind: "photo", src: "cube", at: /^Today$/, pw: 720, maxH: 830, z0: 1.0, z1: 1.06, label: "PHOTO · A SCRAMBLED 3X3 CUBE", credit: "cubemeister.com · CC BY-SA 3.0" },
  ],
  nums: [["nineteen seventy-four", "1974"], ["twenty", "20"]],
  tags: [
    { text: "1974 · A MODEL FOR HIS STUDENTS", at: /^built$/, y: 1580, color: "#ffc83d", to: /^It$/ },
    { text: "HALF TURN = 1 MOVE · CUBE20.ORG", y: 1485, at: /^Today$/ },
  ],
  stamps: [
    { text: "OVER A MONTH", at: /^month$/, y: 1560, size: 76, to: [/^He$/, 1] },
    { text: "20 MOVES OR FEWER", at: /^twenty$/, y: 1605, size: 64 },
  ],
};
