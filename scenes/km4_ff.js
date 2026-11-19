/* KM4 footage-first · T8-3 paired test (by4), arm A (visual-first). Generated with its pair (KMU) from one design: same pictures,
   framing, labels, credits, tags and stamps; only the two middle sentences (and so their beats) swap. The Kentucky meat shower,
   3 March 1876, near Allen Crouch's house, Olympia (Olympian) Springs, Bath County. Vulture vomit is a guess (Kastenbine 1876;
   Scientific American 2014 "So maybe?"), never stated as fact: the screen stamps BEST GUESS, NOT PROVED and STILL NOT PROVED.
   Vulture line: Missouri Dept of Conservation. First frame: the real New York Times column of 10 Mar 1876 (US 1876 = public
   domain; NYT logo and copyright footer of the TimesMachine PDF cropped out). Facts: assets/src/meatshower/facts.json. No diagram. */
window.SPEC = {
  credit: "The New York Times, 10 Mar 1876 · public domain",
  beats: [
    { kind: "photo", src: "nyt", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.06, label: "REAL NEWSPAPER · NEW YORK TIMES, 10 MAR 1876" },
    { kind: "photo", src: "vulture", at: /^The$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · A TURKEY VULTURE", credit: "Debbie Koenigs / USFWS · public domain" },
    { kind: "photo", src: "taste", at: /^Two$/, pw: 1000, z0: 1.0, z1: 1.06, label: "SAME REPORT · NYT, 10 MAR 1876", credit: "The New York Times, 10 Mar 1876 · public domain" },
    { kind: "photo", src: "soar", at: /^Stressed$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL PHOTO · TURKEY VULTURE IN FLIGHT", credit: "Courtney Celley / USFWS · public domain" },
    { kind: "photo", src: "place", at: /^Nobody$/, pw: 1000, z0: 1.0, z1: 1.06, label: "REAL NEWSPAPER · BATH COUNTY, KY, 1876", credit: "The New York Times, 10 Mar 1876 · public domain" },
  ],
  tags: [
    { text: "\"EITHER MUTTON OR VENISON\"", at: /^guessed$/, y: 1560, color: "#ffc83d", to: /^Stressed$/ },
    { text: "SOURCE: MISSOURI DEPT. OF CONSERVATION", y: 1560, at: /^Stressed$/, to: /^Nobody$/ },
  ],
  stamps: [
    { text: "BEST GUESS, NOT PROVED", y: 1560, size: 62, at: /^The$/, to: /^Two$/ },
    { text: "STILL NOT PROVED", at: /^proved$/, y: 1580, size: 72 },
  ],
};
