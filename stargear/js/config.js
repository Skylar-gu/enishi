/* ============================================================
   ✦ SKYLAR★GU CONFIG ✦
   Everything about YOU lives here. Edit freely — no build step.
   Anything marked ✎ is placeholder text waiting for the real you.
   ============================================================ */
window.SITE = {
  name: "SKYLAR",                         // ✎ shown on title + status screen
  handle: "skylargu",                     // ✎
  tagline: "collector of many wonders", // ✎
  jpTagline: "ようこそ、スカイラーの世界へ",     // "welcome to skylar's world"
  email: "skylarl.gu@gmail.com",          // ✎ used by the phone's Mail app
  location: "somewhere on earth, orbiting",   // ✎

  // ---- ABOUT / STATUS SCREEN ----
  about: {
    class: "Clockwork Dreamer",           // ✎ your RPG "class"
    level: 99,                            // ✎
    bio: [                                // ✎ each string = one dialog page
      "hi! welcome to my corner of the internet. you are exactly where you're meant to be.",
      "i like building stuff, taking things apart to see how they tick, and making the world a more abundant, glamorous place.",
      "look around ~ there are 7 star shards hidden in this world. can you find all of them?"
    ],
    stats: [                              // ✎ value out of 100
      { label: "CURIOSITY", value: 96 },
      { label: "MAGIC",     value: 88 },
      { label: "FLOW",      value: 74 },
      { label: "SLEEP",     value: 23 },
    ],
    equipment: [                          // ✎
      ["WEAPON",    "silver pen, red ink"],
      ["ARMOR",     "tailored silk blazer"],
      ["ACCESSORY", "gold hoops + red lip"],
      ["ITEM",      "espresso martini, no negotiations"],
    ],
  },

  // ---- NOW (what you're up to lately) ----
  now: {
    updated: "2026-09-17",                // ✎
    entries: [                            // ✎ [icon, label, text]
      ["✎", "BUILDING",  "hardware cafe"],
      ["♫", "LISTENING", "indie meditation rave music"],
      ["❏", "READING",   "Antikythera journal"],
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
      id: "enishi", name: "ENISHI ✦ 縁", jp: "えにし", color: "#ff8fc7", ring: true,
      status: "active",                   // "active" | "cleared" | "locked"
      summary: "building intuitive human-AI collaboration.",
      sections: [                          // ✎ [heading, body text]
        ["THE QUESTION", "what would it feel like to work with AI as a good collaborator — not a prompt into the void?"],
        ["FIELD NOTES", "arrival experiences, feedback loops, and the small rituals of trust between human and machine."],
      ],
      tags: ["hci", "ai", "design"], links: [["source", "https://github.com/Skylar-gu/enishi"]], page: "",
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
      id: "nacc", name: "NACC ♪ MUSIC×PAIN", jp: "音と痛み", color: "#ffb0d8",
      status: "active",
      summary: "how does music move through the brain — and where does it become pain, pleasure, or memory?",
      sections: [
        ["THE QUESTION", "when we listen to music, what does the brain actually do with it — and can we predict it, voxel by voxel?"],
        ["FIELD NOTES", "fitting DNN audio embeddings (CLaMP3, CLAP-MusicGen, Qwen3-Omni, MuQ) to per-voxel fMRI BOLD responses on 30s music clips."],
      ],
      tags: ["neuro", "audio", "fmri"], links: [], page: "",
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
    ["GAME",  "blood on the clock tower"],
    ["COLOR", "dawn through a plane window"],
    ["SNACK", "eel onigiri"],
    ["DANCE", "ecstatic dance + contact improv"],
    ["SOUND", "ocean waves"],
    ["WORD",  "forelsket (feeling of falling in love)"],
  ],
};
