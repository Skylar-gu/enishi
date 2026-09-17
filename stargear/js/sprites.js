/* sprites: tiny pixel art drawn from strings onto canvases */
SG.PAL = {
  k: "#2a1638", w: "#fff6fb", p: "#ff9bd0", P: "#ff4fa3", b: "#d8a85f", B: "#8a5a2e",
  s: "#ffe0cc", S: "#f2b9a0", h: "#3b2344", H: "#7a5690", r: "#ff7aa8", e: "#2a1638",
  y: "#ffe27a", l: "#c9a7ff", m: "#9ff5d8",
  c: "#c8e6ff", C: "#8fbedb", // light blue ruffle top
};

SG.drawSprite = function (canvas, rows, { mirror = false, overlay = [] } = {}) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const full = mirror ? rows.map(r => r + [...r].reverse().join("")) : rows;
  const put = (x, y, c) => { const col = SG.PAL[c]; if (col) { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); } };
  full.forEach((row, y) => [...row].forEach((c, x) => put(x, y, c)));
  overlay.forEach(([x, y, c]) => put(x, y, c));
};

SG.SPRITES = {
  unicorn: [
    ".......y........",
    ".......y........",
    ".......y........",
    "......ywy.......",
    "....kwwwwwwk....",
    ".pkwwppwwppwwkp.",
    "kwwppwwwwwwppwwk",
    "kwwwewwwwwwewwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwrwwwwwwwwrwwk",
    ".kkwwwwwwwwwwkk.",
    "..pkwwwwwwwwkp..",
    "..pkkkkkkkkkkp..",
    "..kwwwwwwwwwwk..",
    "..kwwk....kwwk..",
    "..kkk......kkk..",
  ],
  unicornBlink: null, // filled below
  // left half of a 24×24 portrait; mirrored at draw time
  girlHalf: [
    "............",
    "........kkkk",
    "......kkhhhh",
    ".....khhhhhh",
    "....khhHHhhh",
    "...khhHhhhhh",
    "...khhHhhhhh",
    "..khhhhhhhhh",
    "..khhhhhhhhh",
    "..khhhhshhhs",
    "..khhhssssss",
    "..khhkssssss",
    "..khhkskksss",
    "..khhksewsss",
    "..khhkseesss",
    "..khhksrrsss",
    "..khhhkssssr",
    "..khhhhkssss",
    "..khhhhhkkkk",
    "...khhhkCwCw",
    "....kkcccccc",
    "....kccccccc",
    "...kcccccccc",
    "...kcccccccc",
  ],
};
SG.SPRITES.unicornBlink = SG.SPRITES.unicorn.map((r, i) => i === 7 ? "kwwwkwwwwwwkwwwk" : r);

// smile: corners lift at row 15, bottom of arc at row 16 (24-wide sprite coords, applied after mirror)
SG.SMILE = [
  [10, 15, "k"], [13, 15, "k"],
  [11, 16, "k"], [12, 16, "k"],
];

SG.drawPortrait = c => SG.drawSprite(c, SG.SPRITES.girlHalf, { mirror: true, overlay: SG.SMILE });
