/* sprites: tiny pixel art drawn from strings onto canvases */
SG.PAL = {
  k: "#2a1638", w: "#fff6fb", p: "#ff9bd0", P: "#ff4fa3", b: "#d8a85f", B: "#8a5a2e",
  s: "#ffe0cc", S: "#f2b9a0", h: "#3b2344", H: "#7a5690", r: "#ff7aa8", e: "#2a1638",
  y: "#ffe27a", l: "#c9a7ff", m: "#9ff5d8",
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
  bunny: [
    "...kk....kk.....",
    "..kwpk..kwpk....",
    "..kwpk..kwpk....",
    "..kwpk..kwpk....",
    "..kwwkkkkwwk....",
    ".kwwwwwwwwwwk...",
    "kwwwwwwwwwwwwk..",
    "kwwewwwwwwewwk..",
    "kwrwwwwkwwwrwk..",
    ".kwwwwwwwwwwk...",
    "..kkwwwwwwkk....",
    ".kwkbbbbbbkwk...",
    ".kwkbyBByBkwk...",
    "..kkbbbbbbkk....",
    "...kwwk.kwwk....",
    "...kkk...kkk....",
  ],
  bunnyBlink: null, // filled below
  // left half of a 24×24 portrait; mirrored at draw time
  girlHalf: [
    "............",
    "........kkkk",
    "......kkhhhh",
    ".....khhhhhh",
    "....khhHHhhh",
    "...khhHhhhhh",
    "...khhhhhhhh",
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
    "...khhhkpppp",
    "....kkkpPwpp",
    "....kppppwpp",
    "...kpppppwpp",
    "...kpppppppp",
  ],
};
SG.SPRITES.bunnyBlink = SG.SPRITES.bunny.map((r, i) => i === 7 ? "kwwkwwwwwwkwwk.." : r);

// a pink ribbon bow on the portrait's head
SG.BOW = [
  [15, 2, "k"], [16, 1, "k"], [17, 1, "k"], [18, 2, "k"], [19, 3, "k"], [16, 2, "P"], [17, 2, "p"], [17, 3, "P"], [18, 3, "p"],
  [16, 3, "P"], [15, 3, "P"], [15, 4, "k"], [14, 4, "P"], [14, 5, "k"], [16, 4, "p"], [17, 4, "P"], [18, 4, "k"], [17, 5, "k"],
];

SG.drawPortrait = c => SG.drawSprite(c, SG.SPRITES.girlHalf, { mirror: true, overlay: SG.BOW });
