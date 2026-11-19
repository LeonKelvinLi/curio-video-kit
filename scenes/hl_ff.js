/* HL footage-first · production row, Format A (visual-first, 13.9 s), breakout idea harold-lloyds-clock-hang-minus-two-fingers.
   Harold Lloyd lost the thumb and forefinger of his right hand in August 1919 to a bomb he thought was a prop; a special glove hid
   the loss on screen; in Safety Last! (1923) he hung from the clock hands himself (Jeffrey Vance). Facts: assets/src/haroldlloyd/facts.json.
   First frame: the real film, Lloyd already hanging from the tilted clock face over the street (Safety Last!, 1923, public domain,
   moving clip cut from the Commons film at 3826.3 s, 9:16 crop). Beats: June 1919 trade ad (his hands whole, two months before the
   bomb), a close-up of his hands on the rope in the film, and a second clock-hang shot. No picture of the injury or the glove itself
   exists free, so none is shown or implied. Caveats: doubles did parts of the climb, so nothing says "the whole climb"; a safety platform
   existed, so nothing says "no net". No diagram. Film audio never used. */
window.SPEC = {
  credit: "Safety Last! (1923) · public domain",
  beats: [
    { kind: "clip", src: "clock", fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.06, label: "REAL FILM · SAFETY LAST!, 1923" },
    { kind: "photo", src: "ad", at: /^bomb$/, pw: 860, maxH: 1060, z0: 1.0, z1: 1.06, label: "TRADE AD, JUNE 1919 · BEFORE THE BOMB", credit: "Moving Picture World, June 1919 · public domain" },
    { kind: "clip", src: "hands", at: /^special$/, rate: 0.78, fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.05, label: "REAL FILM · HIS HANDS ON SCREEN" },
    { kind: "clip", src: "dangle", at: /^Four$/, fit: "cover", fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.06, label: "REAL FILM · THE CLOCK HANG, 1923" },
  ],
  nums: [["nineteen nineteen", "1919"]],
  stamps: [
    { text: "AUGUST 1919", at: /^took$/, to: /^special$/, y: 1600, size: 72 },
    { text: "A GLOVE HID IT", at: /^glove$/, to: /^Four$/, y: 1560, size: 72 },
  ],
};
