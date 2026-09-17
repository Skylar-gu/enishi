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
    "..khhkkkkkkk",
    "..khhkkwkkkk",
    "..khhkkkkkkk",
    "..khhksrrsss",
    "..khhhkssssr",
    "..khhhhkssss",
    "..khhhhhkkkk",
    "...khhhkkkss",
    "....kkkkkkks",
    "....kkkkkkkk",
    "...kkkkkkkkk",
    "...kkkkkkkkk",
  ],
};
SG.SPRITES.unicornBlink = SG.SPRITES.unicorn.map((r, i) => i === 7 ? "kwwwkwwwwwwkwwwk" : r);

// no bow — went sleek. keep as empty overlay so drawPortrait stays happy.
SG.BOW = [];

SG.drawPortrait = c => SG.drawSprite(c, SG.SPRITES.girlHalf, { mirror: true, overlay: SG.BOW });
