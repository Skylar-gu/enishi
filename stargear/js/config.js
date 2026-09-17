/* ============================================================
   ✦ STAR☆GEAR CONFIG ✦
   Everything about YOU lives here. Edit freely — no build step.
   Anything marked ✎ is placeholder text waiting for the real you.
   ============================================================ */
window.SITE = {
  name: "SKYLAR",                         // ✎ shown on title + status screen
  handle: "skylargu",                     // ✎
  tagline: "clockwork dreamer ✦ collector of tiny wonders", // ✎
  jpTagline: "星の歯車へようこそ",             // "welcome to the star gears"
  email: "skylarl.gu@gmail.com",          // ✎ used by the phone's Mail app
  location: "somewhere on earth, orbiting",   // ✎

  // ---- ABOUT / STATUS SCREEN ----
  about: {
    class: "Clockwork Dreamer",           // ✎ your RPG "class"
    level: 99,                            // ✎
    bio: [                                // ✎ each string = one dialog page
      "hi!! welcome to my little mechanism. i built this corner of the internet to keep the things i love.",
      "i like making stuff, taking things apart to see how they tick, and pretty much anything pink and sparkly.",
      "look around ~ there are 7 star shards hidden in this world. can you find all of them?"
    ],
    stats: [                              // ✎ value out of 100
      { label: "CURIOSITY", value: 96 },
      { label: "SPARKLE",   value: 88 },
      { label: "CODE",      value: 74 },
      { label: "SLEEP",     value: 23 },
    ],
    equipment: [                          // ✎
      ["WEAPON",    "mechanical pencil"],
      ["ARMOR",     "oversized cardigan"],
      ["ACCESSORY", "strawberry phone strap"],
      ["ITEM",      "iced matcha latte ×3"],
    ],
  },

  // ---- NOW (what you're up to lately) ----
  now: {
    updated: "2026-09-17",                // ✎
    entries: [                            // ✎ [icon, label, text]
      ["✎", "MAKING",    "this website!! (you're standing in it)"],
      ["♫", "LISTENING", "city pop playlists on repeat"],
      ["❏", "READING",   "a book about ancient greek astronomy"],
      ["✿", "LEARNING",  "pixel art + how gears actually mesh"],
      ["☕", "DRINKING",  "way too much matcha"],
      ["♡", "FEELING",   "sparkly, a little sleepy"],
    ],
  },

  // ---- RESEARCH WORLDS (your projects, as explorable planets) ----
  // Each one shows up as a planet on the star map. Landing on it opens a
  // world page built from these fields. Want a fully custom world? Make a
  // folder in /worlds/<id>/ (copy /worlds/_template/) and set `page`.
  researchWorlds: [
    {
      id: "stargear", name: "STAR☆GEAR", jp: "星の歯車", color: "#ff8fc7", ring: true,
      status: "active",                   // "active" | "cleared" | "locked"
      summary: "this website! an antikythera mechanism with a flip phone inside.",
      sections: [                          // ✎ [heading, body text]
        ["THE QUESTION", "can a personal website feel like a place instead of a page?"],
        ["FIELD NOTES", "gears are drawn in svg, sprites are strings of letters, the music is square waves."],
      ],
      tags: ["html", "css", "js"], links: [["source", "https://github.com/skylargu"]], page: "",
    },
    {
      id: "world2", name: "WORLD 02", jp: "研究", color: "#9ff5d8",
      status: "active",
      summary: "✎ a little research project. what are you exploring here?",
      sections: [["THE QUESTION", "✎ what made you curious?"], ["FIELD NOTES", "✎ what did you find?"]],
      tags: ["research"], links: [], page: "worlds/_template/",
    },
    {
      id: "world3", name: "WORLD 03", jp: "実験", color: "#c9a7ff", ring: true,
      status: "cleared",
      summary: "✎ a finished project. a whole planet of it.",
      sections: [["THE QUESTION", "✎"], ["WHAT I MADE", "✎"]],
      tags: ["python"], links: [], page: "",
    },
    {
      id: "world4", name: "WORLD 04", jp: "観測", color: "#ffe27a",
      status: "active",
      summary: "✎ room for another world.",
      sections: [], tags: [], links: [], page: "",
    },
    {
      id: "uncharted", name: "???", jp: "未知", color: "#6b5a8a",
      status: "locked",
      summary: "an uncharted world. coming soon.",
      sections: [], tags: [], links: [], page: "",
    },
  ],

  // ---- CONTACTS (shown in the phone's address book) ----
  contacts: [                             // ✎
    { name: "GitHub",   icon: "⌘", url: "https://github.com/skylargu" },
    { name: "Email",    icon: "✉", url: "mailto:skylarl.gu@gmail.com" },
    { name: "LinkedIn", icon: "in", url: "https://www.linkedin.com/" },
    { name: "Instagram",icon: "◎", url: "https://www.instagram.com/" },
  ],

  // ---- FAVORITES SHRINE ----
  faves: [                                // ✎ [category, thing]
    ["GAME",    "animal crossing: wild world"],
    ["COLOR",   "strawberry milk pink"],
    ["SNACK",   "melon pan"],
    ["OBJECT",  "the antikythera mechanism, obviously"],
    ["SOUND",   "a flip phone snapping shut"],
    ["PLANET",  "venus ♀"],
    ["ERA",     "2001 keitai culture"],
    ["WORD",    "kirakira (きらきら)"],
  ],
};
