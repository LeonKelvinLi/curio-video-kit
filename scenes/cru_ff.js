/* CRU footage-first · arm A (visual-first, 13.3 s), T8-4 unchanged ("kept" at 7.33 s). The White House Thanksgiving raccoon: in
   November 1926 a Mississippi supporter sent the Coolidges a live raccoon for Thanksgiving dinner; they kept her and named her Rebecca,
   and Grace Coolidge held her at the Easter Egg Roll on 18 April 1927. Facts: assets/src/coolidgeraccoon/facts.json. Paired with CR4:
   same four sentences, the two middle ones swapped; same pictures, framing, labels, credit, stamps and mark, each picture on its own
   sentence. First frame: Grace Coolidge holding Rebecca (National Photo Company print, LoC 90714615, cover). LoC dates that print
   "between 1921 and 1923", which cannot be right (Rebecca arrived Nov 1926); the same sitting is in LoC 2016842988, dated 18 Apr 1927,
   so the label says 1927. Caveat (pairs.json verify): never say why she was spared or when she went to the zoo. No diagram. */
window.SPEC = {
  credit: "National Photo Co., 1927 · Library of Congress",
  beats: [
    { kind: "photo", src: "hook", fit: "cover", fx: 0.52, fy: 0.5, z0: 1.0, z1: 1.08, label: "REAL PHOTO, 1927 · THE WHITE HOUSE RACCOON" },
    { kind: "photo", src: "close", at: /^It$/, pw: 700, maxH: 830, z0: 1.0, z1: 1.06, label: "PHOTO, 1927 · REBECCA, CLOSE UP" },
    { kind: "photo", src: "leash", at: /^The$/, pw: 1000, z0: 1.0, z1: 1.06, label: "PHOTO, 1927 · ON A LEASH, WHITE HOUSE LAWN" },
    { kind: "photo", src: "eggroll", at: [/^The$/, 1], pw: 1000, z0: 1.0, z1: 1.06, label: "EASTER EGG ROLL · 18 APRIL 1927" },
  ],
  nums: [["nineteen twenty-six", "1926"]],
  marks: [{ at: /^pet$/, to: [/^The$/, 1], ix: 0.389, iy: 0.843, r: 80 }],
  stamps: [
    { text: "KEPT AS A PET", at: /^kept$/, to: [/^The$/, 1], y: 1570, size: 68 },
    { text: "MEANT FOR THANKSGIVING DINNER", at: /^Thanksgiving$/, to: /^The$/, y: 1570, size: 60 },
  ],
};
