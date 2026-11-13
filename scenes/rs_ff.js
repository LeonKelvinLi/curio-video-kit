/* RS footage-first · arm A (visual-first), same-story pair with RSL. AD 193: the Praetorian Guard sells the throne to Didius Julianus for
   25,000 sesterces per soldier; he is dead 66 days later. Facts: assets/src/romesold/facts.json. The "market" image is Cassius Dio's,
   a hostile eyewitness, and is given as his. First frame is the buyer's own gold coin (354 px original, upscaled, white background keyed to dark). The auction picture
   is an 1886 engraving and the label says so. No diagram. */
window.SPEC = {
  credit: "Numismatica Ars Classica · CC BY-SA 3.0 DE",
  beats: [
    { kind: "photo", src: "coin", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.08, label: "REAL GOLD COIN · THE BUYER, AD 193" },
    { kind: "photo", src: "guard", at: /^Twenty-five/, pw: 1000, z0: 1.0, z1: 1.07, label: "THE PALACE GUARD · ROMAN RELIEF", credit: "Jean-Pol Grandmont · CC BY 4.0" },
    { kind: "photo", src: "auction", at: /^A$/, pw: 1000, z0: 1.0, z1: 1.07, label: "ENGRAVING, 1886 · THE BID AT THE GATE", credit: "Lodovico Pogliaghi, 1886 · public domain" },
    { kind: "photo", src: "bust", at: /^Sixty-six/, pw: 800, maxH: 860, iz: 1.2, fy: 0.42, z0: 1.0, z1: 1.07, label: "THE BUYER: DIDIUS JULIANUS", credit: "Wilfredor · CC0" },
  ],
  nums: [["twenty-five thousand", "25,000"], ["sixty-six", "66"]],
  tags: [{ text: "CASSIUS DIO: \"AS IF IN SOME MARKET\"", at: /^sold$/, to: /^Sixty-six/, y: 1590, color: "#ffc83d" }],
  stamps: [{ text: "DEAD IN 66 DAYS", at: /^dead/, y: 1612, size: 68 }],
};
