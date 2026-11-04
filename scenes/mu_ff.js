/* MU footage-first · arm A (visual-first). Bruce McCandless, first untethered spacewalk, 7 Feb 1984, up to 320 ft from Challenger on the
   nitrogen Manned Maneuvering Unit. Facts: assets/src/mccandless/facts.json. NASA scans only, never the CC BY-SA retouch. Other sources
   give 300-330 ft; 320 is the usual figure. No diagram: the camera on his own backpack shows the distance. */
window.SPEC = {
  credit: "NASA · public domain",
  beats: [
    { kind: "photo", src: "float", fit: "cover", fx: 0.47, fy: 0.46, z0: 1.0, z1: 1.1, label: "REAL NASA PHOTO · FEB 1984" },
    { kind: "photo", src: "view", at: /^In$/, pw: 1000, iz: 1.15, z0: 1.0, z1: 1.06, label: "HIS BACKPACK CAMERA, LOOKING BACK" },
    { kind: "photo", src: "other", at: /^As$/, pw: 1000, maxH: 1000, iz: 1.1, z0: 1.0, z1: 1.07, label: "McCANDLESS, ALONE" },
  ],
  nums: [["nineteen eighty-four", "1984"], ["three hundred twenty feet", "320 feet"]],
  tags: [{ text: "320 FT · NO TETHER", at: /^three$/, to: /^As$/, y: 1560, color: "#ffc83d" }],
  stamps: [{ text: "\"A HECK OF A BIG LEAP\"", at: /^heck/, y: 1570, size: 60 }],
};
