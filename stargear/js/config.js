/* ============================================================
   ✦ SKYLAR★GU CONFIG ✦
   Everything about YOU lives here. Edit freely — no build step.
   Anything marked ✎ is placeholder text waiting for the real you.
   ============================================================ */
window.SITE = {
  name: "SKYLAR",                         // ✎ shown on title + status screen
  handle: "skylargu",                     // ✎
  tagline: "clockwork dreamer ✦ collector of tiny wonders", // ✎
  jpTagline: "ようこそ、スカイラーの世界へ",     // "welcome to skylar's world"
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
      ["✎", "BUILDING",  "hardware cafe"],
      ["♫", "LISTENING", "indie meditation rave music"],
      ["❏", "READING",   "a book about better plant health"],
      ["✿", "LEARNING",  "category theory"],
      ["☕", "DRINKING",  "kava & kanna"],
      ["♡", "FEELING",   "flowing in a sea of stars"],
    ],
  },

  // ---- RESEARCH WORLDS (your projects, as explorable planets) ----
  // Each one shows up as a planet on the star map. Landing on it opens a
  // world page built from these fields. Want a fully custom world? Make a
  // folder in /worlds/<id>/ (copy /worlds/_template/) and set `page`.
  researchWorlds: [
    {
      id: "stargear", name: "SKYLAR★GU", jp: "この世界", color: "#ff8fc7", ring: true,
      status: "active",                   // "active" | "cleared" | "locked"
      summary: "this website! an antikythera mechanism with a flip phone inside.",
      sections: [                          // ✎ [heading, body text]
        ["THE QUESTION", "can a personal website feel like a place instead of a page?"],
        ["FIELD NOTES", "gears are drawn in svg, sprites are strings of letters, the music is square waves."],
      ],
      tags: ["html", "css", "js"], links: [["source", "https://github.com/skylargu"]], page: "",
    },
    {
      id: "causal-interp-climate", name: "CLIMATE ✧ CAUSAL", jp: "気候の因果", color: "#9ff5d8",
      status: "active",
      summary: "peeking inside climate models to find what's really pulling the strings.",
      sections: [
        ["THE QUESTION", "when a climate model makes a prediction, what causal story is it actually telling?"],
        ["FIELD NOTES", "interpretability meets causal inference. counterfactual worlds, tiny experiments, big planet."],
      ],
      tags: ["python", "interp", "climate"], links: [], page: "",
    },
    {
      id: "brain-agent-coupling", name: "BRAIN×AGENT", jp: "脳と機械", color: "#c9a7ff", ring: true,
      status: "active",
      summary: "wiring biological brains to artificial agents and seeing what rhymes.",
      sections: [
        ["THE QUESTION", "do neural signals and agent policies move together — and where do they diverge?"],
        ["FIELD NOTES", "neural recordings on one side, learned agents on the other, coupling metrics in the middle."],
      ],
      tags: ["neuro", "rl", "python"], links: [], page: "",
    },
    {
      id: "steeragents", name: "STEER ⇢ AGENTS", jp: "操舵", color: "#ffe27a",
      status: "active",
      summary: "small nudges to an agent's insides — big changes to its behavior.",
      sections: [
        ["THE QUESTION", "can we steer an agent from within, without retraining it?"],
        ["FIELD NOTES", "activation steering, control vectors, watching the same model be many selves."],
      ],
      tags: ["llm", "interp", "agents"], links: [], page: "",
    },
    {
      id: "nacc", name: "NACC ✦ MEMORY", jp: "記憶の地図", color: "#ffb0d8",
      status: "active",
      summary: "listening to a decades-long dataset for the quiet patterns of cognitive change.",
      sections: [
        ["THE QUESTION", "what does alzheimer's data whisper before the diagnosis is loud?"],
        ["FIELD NOTES", "longitudinal cohort work with the nacc dataset. survival, trajectories, biomarkers."],
      ],
      tags: ["health", "stats", "python"], links: [], page: "",
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
