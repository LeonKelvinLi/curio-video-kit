/* CS footage-first · arm B (escalating mystery). The Cadaver Synod, January 897: Stephen VI tries the corpse of Formosus. Facts:
   assets/src/formosus/facts.json. Paintings are Jean-Paul Laurens' 19th-century imaginings, and the label says so. Later embellishments
   (stones crying out) are left out. No diagram. */
window.SPEC = {
  credit: "Jean-Paul Laurens, 1870 · public domain",
  beats: [
    { kind: "photo", src: "trial", pw: 1000, iz: 1.3, fx: 0.62, fy: 0.45, z0: 1.0, z1: 1.06, label: "PAINTED 1870 · TRIAL OF 897" },
    { kind: "photo", src: "crop", at: [/^A$/, 1], pw: 1000, maxH: 1000, z0: 1.0, z1: 1.08, label: "THE DEFENDANT, MONTHS DEAD" },
    { kind: "photo", src: "second", at: /^They$/, pw: 1000, iz: 1.9, fx: 0.55, fy: 0.5, z0: 1.0, z1: 1.08, label: "LAURENS, SECOND VERSION", credit: "Jean-Paul Laurens · public domain" },
    { kind: "photo", src: "trial", at: /^Months$/, pw: 1000, iz: 1.5, fx: 0.34, fy: 0.42, z0: 1.0, z1: 1.06, label: "THE ACCUSER: POPE STEPHEN VI" },
  ],
  stamps: [{ text: "GUILTY", at: /^lost/, to: /^They$/, y: 1500, size: 96 }, { text: "STRANGLED, 897", at: /^strangled/, y: 1570, size: 64 }],
};
