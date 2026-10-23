/* P10 · Roy Sullivan, struck by lightning seven times (1942-1977, Shenandoah National Park). Facts: Wikipedia "Roy Sullivan"
   (park ranger; 7 strikes 1942-1977: leg, shoulder, chest burns, hair set on fire several times; Guinness record). The STRIKES
   counter is a tally, not a strike-by-strike timeline. Plates: Curio illustration (gpt-image-2). Engine: scenes/plates.js. */
window.SPEC = {
  credit: "Curio illustration · story: Wikipedia, Guinness World Records",
  nums: [["seven", "7"], ["nineteen forty-two", "1942"], ["nineteen seventy-seven", "1977"]],
  beats: [
    { img: "a", fy: 0.44, z0: 1.06, z1: 1.22 },
    { img: "c", at: /^Roy$/, fy: 0.45, z0: 1.05, z1: 1.16 },
    { img: "b", at: /^Between$/, fy: 0.42, z0: 1.04, z1: 1.14 },
    { img: "a", at: /^set$/, fy: 0.3, z0: 1.5, z1: 1.65 },
    { img: "d", at: /^He$/, fy: 0.45, z0: 1.12, z1: 1.04 },
  ],
  lightning: [0.2, /^struck$/, /^leg/, /^shoulder$/, /^chest/],
  rain: [0, /^Roy$/],
  tags: [{ text: "SHENANDOAH NATIONAL PARK", at: /^Roy$/, to: /^Between$/ }, { text: "1942–1977", at: /^Between$/, to: /^bolts$/, color: "#ffc83d" }],
  counter: { label: "STRIKES", at: /^forty-two$/, to: /^He$/, values: [[/^forty-two$/, "1"], [/^seventy-seven/, "2"], [/^bolts$/, "3"], [/^leg/, "4"], [/^shoulder$/, "5"], [/^chest/, "6"], [/^fire$/, "7"]] },
  stamps: [{ text: "GUINNESS RECORD", at: /^survived/, y: 800, size: 72 }],
};
