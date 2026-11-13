/* HX footage-first · arm B (escalating mystery). The Hoxne Hoard, Suffolk, 16 Nov 1992: Eric Lawes went looking for a farmer's lost
   hammer and found a late Roman treasure. Facts: assets/src/hoxne/facts.json. Same-story pair with HXL (same first picture). No photo
   of the hammer is rights-clear, so none is implied. No diagram. */
window.SPEC = {
  credit: "Mike Peel · CC BY-SA 4.0",
  beats: [
    { kind: "photo", src: "case", pw: 1000, z0: 1.0, z1: 1.06, label: "REAL ROMAN TREASURE · HOXNE HOARD" },
    { kind: "photo", src: "coins", at: /^Nearly$/, pw: 1000, z0: 1.0, z1: 1.08, label: "GOLD AND SILVER COINS" },
    { kind: "photo", src: "chain", at: /^It$/, pw: 900, maxH: 900, cy: 965, z0: 1.0, z1: 1.04, label: "GOLD BODY CHAIN · HOXNE HOARD", credit: "BabelStone · CC0" },
    { kind: "photo", src: "chest", at: /^And$/, pw: 1000, z0: 1.0, z1: 1.08, label: "AS IT LAY IN THE CHEST · RECONSTRUCTION" },
  ],
  nums: [["fifteen thousand", "15,000"], ["one point seven five million pounds", "£1.75 million"]],
  stamps: [{ text: "£1.75 MILLION", at: /^million/, to: /^And$/, y: 1570, size: 84 }, { text: "HAMMER: FOUND", at: [/^hammer/, 1], y: 1570, size: 72 }],
};
