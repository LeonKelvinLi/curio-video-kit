/* BM footage-first · arm B (escalating mystery). Barry Marshall drinks a Helicobacter pylori culture, Perth, 1984; Nobel Prize 2005
   with Robin Warren. Facts: assets/src/marshall/facts.json. He got acute gastritis, not an ulcer, and a tag says so. The portraits are
   from 2019 and 2021 and the biopsy is another patient's, so the labels say that too. The long cut BML opens on the same jar. No diagram. */
window.SPEC = {
  credit: "Gaius Cornelius · CC BY 4.0",
  beats: [
    { kind: "photo", src: "jar", pw: 640, maxH: 960, cy: 1075, fy: 0.48, z0: 1.0, z1: 1.06, label: "THE REAL JAR · NOBEL MUSEUM" },
    { kind: "photo", src: "desk", at: [/^He$/, 0], pw: 1000, fy: 0.42, z0: 1.0, z1: 1.06, label: "DR BARRY MARSHALL · PHOTO 2021", credit: "WikiEdtingProfile2021 · CC BY-SA 4.0" },
    { kind: "photo", src: "biopsy", at: /^Within$/, pw: 1000, maxH: 1000, iz: 1.25, fx: 0.55, fy: 0.55, z0: 1.0, z1: 1.08, label: "REAL H. PYLORI · A PATIENT BIOPSY", credit: "Ed Uthman · CC BY 2.0" },
    { kind: "photo", src: "face", at: [/^He$/, 1], pw: 1000, fy: 0.45, z0: 1.0, z1: 1.06, label: "BARRY MARSHALL · PHOTO 2019", credit: "Binarysequence · CC BY-SA 4.0" },
  ],
  tags: [{ text: "HE TOLD HER THAT EVENING", at: /^wife/, to: /^Within$/, y: 1570, color: "#ffc83d" }, { text: "GASTRITIS, NOT AN ULCER", at: /^inflamed/, to: [/^He$/, 1], y: 1570, color: "#ffc83d" }],
  stamps: [{ text: "2005 NOBEL · WITH ROBIN WARREN", at: /^Nobel/, y: 1570, size: 52 }],
};
