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
    "........k.......",
    ".......kyk......",
    ".......kBk......",
    ".......kyk......",
    "......kyByk.....",
    ".....kwwwwwk....",
    "....kwwwwwwwk...",
    "...kwwwwwwwwwk..",
    "..kwppwwwwwppwk.",
    "..kwwwewwwewwwk.",
    "..kwwwwwwwwwwwk.",
    "..kwrwwwwwwwrwk.",
    "..kkkwwwwwwkkk..",
    "..pkkkkkkkkkkp..",
    "..pkwwwwwwwwkp..",
    "..kwwk....kwwk..",
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
    "..khhhksssss",
    "..khhhhkssss",
    "..khhhhhkkkk",
    "...khhhkccss",
    "....kccccccs",
    "....kccccccc",
    "...kcccccccc",
    "...kcccccccc",
  ],
};
SG.SPRITES.unicornBlink = SG.SPRITES.unicorn.map((r, i) => i === 9 ? "..kwwwkwwwkwwwk." : r);

// face: tiny nose + asymmetric smirk (right corner curls up)
SG.FACE = [
  [11, 15, "S"],                                                  // subtle nose
  [10, 16, "k"], [11, 16, "k"], [12, 16, "k"], [13, 16, "k"],     // mouth line, 4 wide
  [13, 15, "k"],                                                  // right corner curls up (smirk)
];

SG.drawPortrait = c => SG.drawSprite(c, SG.SPRITES.girlHalf, { mirror: true, overlay: SG.FACE });
