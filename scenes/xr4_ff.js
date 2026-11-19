/* XR4 footage-first · T8-1 by4 · arm A (visual-first, 14.8 s). "The Exploding Rats": in WWII the Special Operations Executive filled about a
   hundred skinned rats with plastic explosive, to be left among the coal beside a boiler so a stoker would throw one on the fire. The Germans
   intercepted the container first, showed the rats at their military schools and hunted for more; SOE concluded "The trouble caused to them
   was a much greater success to us than if the rats had actually been used." Main source: Richard Norton-Taylor, The Guardian, 27 Oct 1999,
   quoting the SOE files released that week at the Public Record Office (original files not opened). The "nine Belgian boilers" claim is a
   myth and is left out. Facts: assets/src/soerats/facts.json. First frame: the SOE file drawing of the explosive rat (TNA HS 7/49 p. 90,
   OGL v3.0 per Commons), enlarged across the full width on its own paper tone (the scan is 696 px wide and landscape). Twin of XRU: same
   pictures, framing, labels, credits, tags and stamps; only the order of the two middle sentences (and so of their two beats) differs.
   No diagram. */
const XR_PICS = {
  rat: { kind: "photo", src: "rat", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.04, label: "SOE FILE DRAWING · EXPLOSIVE RAT" },
  page: { kind: "photo", src: "page", pw: 1000, maxH: 900, z0: 1.0, z1: 1.05, label: "SOE FILE HS 7/49 · PAGE 90" },
  stoker: { kind: "photo", src: "stoker", pw: 1000, maxH: 900, z0: 1.0, z1: 1.06, label: "PHOTO · STOKING A COAL BOILER", credit: "Clem Rutter · CC BY 3.0" },
  archive: { kind: "photo", src: "archive", pw: 1000, maxH: 900, z0: 1.0, z1: 1.06, label: "PUBLIC RECORD OFFICE, KEW", credit: "GrindtXX · CC0" },
};
window.SPEC = {
  credit: "The National Archives, HS 7/49 · OGL v3.0",
  beats: [
    XR_PICS.rat,
    { ...XR_PICS.page, at: /^The$/ },
    { ...XR_PICS.stoker, at: [/^The$/, 1] },
    { ...XR_PICS.archive, at: /^Germany$/ },
  ],
  tags: [
    { text: "THE PLAN", at: /^idea/, to: /^Germany$/, y: 1570, color: "#ffc83d" },
    { text: "SOE FILES RELEASED, OCT 1999", at: /^files$/, to: /^beat$/, y: 1570, color: "#ffc83d" },
  ],
  stamps: [{ text: "INTERCEPTED", at: /^caught$/, to: [/^The$/, 1], y: 1570, size: 72 },
    { text: "\"A MUCH GREATER SUCCESS\"", at: /^beat$/, y: 1580, size: 62 }],
};
