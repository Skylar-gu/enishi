/* worlds: open/close windows + the content-driven worlds (about, now, research, shrine) */
(function () {
  const { $, $$, h, sfx } = SG;
  const C = window.SITE;

  /* ---------- window management ---------- */
  SG.openId = null;
  const opened = new Set();
  SG.openWorld = function (id) {
    const win = $(`.window[data-world="${id}"]`);
    if (!win) return;
    if (SG.openId) SG.closeWorld(true);
    sfx.warp();
    SG.openId = id;
    document.body.classList.add("has-window");
    win.hidden = false;
    win.classList.remove("enter"); void win.offsetWidth; win.classList.add("enter");
    win.querySelector(".win-x").focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    const first = !opened.has(id); opened.add(id);
    document.dispatchEvent(new CustomEvent("world:open", { detail: { id, first } }));
    const i = SG.WORLDS.findIndex(w => w.id === id);
    if (i >= 0 && SG.turnTo) SG.turnTo(i);
  };
  SG.closeWorld = function (quiet) {
    if (!SG.openId) return;
    const id = SG.openId;
    $(`.window[data-world="${id}"]`).hidden = true;
    SG.openId = null;
    document.body.classList.remove("has-window");
    if (!quiet) { sfx.back(); if (history.replaceState) history.replaceState(null, "", location.pathname); }
    document.dispatchEvent(new CustomEvent("world:close", { detail: { id } }));
  };
  $$(".win-x").forEach(b => b.addEventListener("click", () => SG.closeWorld()));
  $("#windows").addEventListener("click", e => { if (e.target.id === "windows") SG.closeWorld(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && SG.openId) SG.closeWorld(); });

  /* fill simple text bindings */
  $$("[data-site]").forEach(el => (el.textContent = C[el.dataset.site] || ""));

  /* ---------- ABOUT / STATUS ---------- */
  SG.drawPortrait($("#portrait"));
  SG.drawPortrait($("#helloPortrait"));
  $("#aboutClass").textContent = C.about.class;
  $("#aboutLevel").textContent = C.about.level;
  C.about.stats.forEach(st => $("#aboutStats").append(
    h("div", { class: "stat" }, h("span", { text: st.label }), h("i", { style: `--v:${st.value}%` }), h("b", { text: st.value }))));
  C.about.equipment.forEach(([k, v]) => $("#aboutEquip").append(h("dt", { text: k }), h("dd", { text: v })));

  let bioPage = 0, bioTimer;
  function typeBio() {
    const text = C.about.bio[bioPage], el = $("#bioText");
    clearInterval(bioTimer);
    if (document.body.classList.contains("calm")) { el.textContent = text; return; }
    let i = 0; el.textContent = "";
    bioTimer = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i % 3 === 0) SG.tone(1100, 0.015, { vol: 0.012 });
      if (i >= text.length) clearInterval(bioTimer);
    }, 22);
  }
  const nextBio = () => {
    const el = $("#bioText"), full = C.about.bio[bioPage];
    if (el.textContent.length < full.length) { clearInterval(bioTimer); el.textContent = full; return; }
    bioPage = (bioPage + 1) % C.about.bio.length; sfx.blip(); typeBio();
  };
  $("#bioDialog").addEventListener("click", nextBio);
  $("#bioDialog").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nextBio(); } });
  document.addEventListener("world:open", e => { if (e.detail.id === "about") { bioPage = 0; typeBio(); } });

  /* ---------- NOW ---------- */
  $("#nowUpdated").textContent = C.now.updated;
  C.now.entries.forEach(([icon, label, text], i) => $("#nowList").append(
    h("li", { style: `--d:${i * 70}ms` }, h("span", { class: "now-ic", text: icon }), h("div", {}, h("p", { class: "eyebrow", text: label }), h("p", { text })))));

  /* ---------- RESEARCH WORLDS ---------- */
  const orbits = $("#orbits"), view = $("#planetView"), map = $("#starmap");
  const STATUS = { active: "▶ EXPLORING", cleared: "✓ CHARTED", locked: "🔒 UNCHARTED" };
  C.researchWorlds.forEach((w, i) => {
    const size = 70 + ((i * 37) % 3) * 16;
    const btn = h("button", { class: `planet-btn ${w.status}`, style: `--c:${w.color}; --size:${size}px; --d:${-i * 1.3}s`, "aria-label": `${w.name} — ${STATUS[w.status]}` },
      h("span", { class: "planet" + (w.ring ? " ringed" : "") }, h("span", { class: "planet-shine" })),
      h("span", { class: "planet-name", text: w.name }),
      h("span", { class: "planet-status", text: STATUS[w.status] }));
    btn.addEventListener("click", () => {
      if (w.status === "locked") { sfx.bad(); SG.say("that world is still uncharted... check back later!"); return; }
      land(w);
    });
    orbits.append(btn);
  });

  function land(w) {
    sfx.warp();
    map.classList.add("leaving");
    setTimeout(() => {
      map.hidden = true; map.classList.remove("leaving");
      view.innerHTML = "";
      view.style.setProperty("--c", w.color);
      const sections = w.sections.length ? w.sections : [["UNDER CONSTRUCTION", "this world is still being terraformed ✎"]];
      view.append(
        h("button", { class: "btn ghost small back", onclick: () => { sfx.back(); view.hidden = true; map.hidden = false; } }, "← STAR MAP"),
        h("header", { class: "pv-head" },
          h("span", { class: "planet big" + (w.ring ? " ringed" : "") }, h("span", { class: "planet-shine" })),
          h("div", {},
            h("p", { class: "eyebrow", text: "NOW LANDING ON" }),
            h("h2", { text: w.name }),
            h("p", { class: "jp small", text: w.jp }),
            h("p", { class: "planet-status", text: STATUS[w.status] }))),
        h("p", { class: "pv-summary", text: w.summary }),
        h("div", { class: "pv-sections" }, sections.map(([t, b]) => h("section", { class: "panel" }, h("p", { class: "eyebrow", text: t }), h("p", { text: b })))),
        w.tags.length ? h("p", { class: "tags" }, w.tags.map(t => h("span", { class: "tag", text: t }))) : null,
        h("div", { class: "pv-links" },
          w.page ? h("a", { class: "btn", href: w.page, text: "ENTER FULL WORLD ▶" }) : null,
          w.links.map(([label, url]) => h("a", { class: "btn ghost", href: url, target: "_blank", rel: "noopener", text: label + " ↗" }))));
      view.hidden = false;
      view.classList.remove("enter"); void view.offsetWidth; view.classList.add("enter");
    }, document.body.classList.contains("calm") ? 0 : 380);
  }
  document.addEventListener("world:open", e => { if (e.detail.id === "research") { view.hidden = true; map.hidden = false; } });

  /* ---------- SHRINE: sacred things + spirit-quadrant quiz ---------- */
  const faveGrid = $("#faveGrid");
  if (faveGrid) C.faves.forEach(([k, v]) => faveGrid.append(
    h("div", { class: "fave" }, h("p", { class: "eyebrow", text: k }), h("p", { text: v }))));

  /* ---------- FURIN: wind chimes with key selector ---------- */
  const NS = "http://www.w3.org/2000/svg";
  const sn = (t, a, p) => { const el = document.createElementNS(NS, t); for (const k in a) el.setAttribute(k, a[k]); p && p.append(el); return el; };
  const chimes = $("#chimes");
  if (chimes) {
    const SCALES = {
      sunrise:  { name: "SUNRISE",  jp: "朝焼け",   midi: [72, 74, 76, 79, 81, 84, 86, 88] }, // C major pentatonic (C D E G A ...)
      sakura:   { name: "SAKURA",   jp: "桜",       midi: [74, 75, 79, 81, 82, 86, 87, 91] }, // D hirajōshi
      ocean:    { name: "OCEAN",    jp: "海",       midi: [71, 74, 76, 79, 83, 86, 88, 91] }, // spread minor
      midnight: { name: "MIDNIGHT", jp: "夜",       midi: [69, 72, 74, 76, 79, 81, 84, 88] }, // A minor pentatonic
      lullaby:  { name: "LULLABY",  jp: "子守唄",   midi: [77, 79, 81, 84, 86, 89, 91, 93] }, // F major-ish
    };
    const POS    = [40, 88, 136, 184, 232, 280, 328, 376];
    const LENS   = [130, 150, 168, 180, 175, 158, 138, 120];
    const COLORS = ["#ffcfe6", "#c9a7ff", "#9ff5d8", "#ffe27a", "#ff8fc7", "#ffcfe6", "#c9a7ff", "#9ff5d8"];

    let currentScale = "sunrise";
    let rods = [];

    function buildRods() {
      // top bar + hook
      while (chimes.firstChild) chimes.removeChild(chimes.firstChild);
      sn("rect", { x: 20, y: 28, width: 380, height: 6, rx: 3, fill: "#2a1638" }, chimes);
      sn("circle", { cx: 210, cy: 22, r: 5, fill: "#ffe27a", stroke: "#2a1638", "stroke-width": 1.5 }, chimes);
      sn("line", { x1: 210, y1: 26, x2: 210, y2: 12, stroke: "#2a1638", "stroke-width": 1.5 }, chimes);
      const midis = SCALES[currentScale].midi;
      rods = POS.map((x, i) => {
        const midi = midis[i], len = LENS[i], hue = COLORS[i];
        const g = sn("g", { class: "chime", "data-i": i, style: `transform-origin:${x}px 34px` }, chimes);
        sn("line", { x1: x, y1: 34, x2: x, y2: 44, stroke: "#2a1638", "stroke-width": 1.2 }, g);
        sn("rect", { x: x - 4, y: 44, width: 8, height: len, rx: 4, fill: hue, stroke: "#2a1638", "stroke-width": 2 }, g);
        sn("circle", { cx: x, cy: 44 + len + 4, r: 3.5, fill: "#2a1638" }, g);
        g.style.animationDelay = `${-i * 0.7}s`;
        const strike = () => {
          SG.tone(SG.note(midi), 1.6, { type: "sine", vol: 0.11 });
          SG.tone(SG.note(midi + 12), 1.1, { type: "sine", vol: 0.035, when: 0.005 });
          g.classList.remove("struck"); void g.getBBox(); g.classList.add("struck");
        };
        // slide-to-play: any pointerenter rings the chime (100%)
        g.addEventListener("pointerenter", strike);
        g.addEventListener("click", strike);
        return { g, strike };
      });
    }

    buildRods();

    // key picker
    const picker = $("#keyPicker");
    if (picker) {
      picker.innerHTML = "";
      Object.entries(SCALES).forEach(([id, s]) => {
        const btn = h("button", {
          class: "key-btn" + (id === currentScale ? " on" : ""),
          onclick: () => {
            if (id === currentScale) return;
            currentScale = id;
            picker.querySelectorAll(".key-btn").forEach(b => b.classList.remove("on"));
            btn.classList.add("on");
            buildRods();
            sfx.blip();
            // preview scale as a soft glissando
            rods.forEach((r, i) => setTimeout(r.strike, 120 + i * 110));
          },
        }, h("span", { class: "key-name", text: s.name }), h("span", { class: "key-jp", text: s.jp }));
        picker.append(btn);
      });
    }

    // occasional wind while the world is open
    setInterval(() => {
      if (document.hidden || SG.openId !== "furin") return;
      if (Math.random() < 0.3) rods[Math.floor(Math.random() * rods.length)].strike();
    }, 4200);
  }

  const QUIZ = [
    ["when you don't know what to do, you first:",
      [["think it through", "mind"], ["feel it out", "heart"], ["just start moving", "body"], ["wait for a sign", "spirit"]]],
    ["your favorite kind of quiet is:",
      [["a good book", "mind"], ["a soft conversation", "heart"], ["a long walk", "body"], ["stargazing", "spirit"]]],
    ["what draws you closer to the sacred?",
      [["understanding something deeply", "mind"], ["loving someone well", "heart"], ["moving your body", "body"], ["stillness", "spirit"]]],
    ["a gift from the universe would be:",
      [["a book that changes how you see", "mind"], ["a person who really sees you", "heart"], ["a place that feels like home", "body"], ["a dream that means something", "spirit"]]],
    ["the thing you protect most is:",
      [["your curiosity", "mind"], ["your softness", "heart"], ["your energy", "body"], ["your inner quiet", "spirit"]]],
  ];
  const RESULT = {
    mind:   ["🦉 MIND · 思", "you meet the world with clear seeing. the shrine keeps a lamp for you."],
    heart:  ["🦌 HEART · 心", "you meet the world with tender attention. the shrine keeps a bowl of water for you."],
    body:   ["🐯 BODY · 体", "you meet the world through your own two hands. the shrine keeps a warm stone for you."],
    spirit: ["🦢 SPIRIT · 魂", "you meet the world listening for what's underneath. the shrine keeps a bell for you."],
  };
  function quiz(step = 0, tally = {}) {
    const q = $("#quiz"); if (!q) return; q.innerHTML = "";
    if (step === QUIZ.length) {
      const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
      sfx.fanfare();
      q.append(h("p", { class: "eyebrow", text: "YOUR QUADRANT ✦ SPIRIT ANIMAL" }),
        h("h3", { class: "quiz-result", text: RESULT[best][0] }),
        h("p", { text: RESULT[best][1] }),
        h("button", { class: "btn ghost small", onclick: () => quiz() }, "↻ AGAIN"));
      return;
    }
    const [question, opts] = QUIZ[step];
    q.append(h("p", { class: "eyebrow", text: `QUIZ · QUADRANTS OF BEING ${step + 1}/${QUIZ.length}` }),
      h("p", { text: question }),
      h("div", { class: "quiz-opts" }, opts.map(([label, p]) => h("button", {
        class: "btn ghost small", onclick: () => { sfx.blip(); quiz(step + 1, { ...tally, [p]: (tally[p] || 0) + 1 }); },
      }, label))));
  }
  quiz();

  /* ---------- ENDING ---------- */
  SG.ending = function () {
    const cr = $("#credits"); cr.innerHTML = "";
    SG.SHARDS.forEach(s => cr.append(h("p", {}, h("b", { text: s.glyph + " " + s.name }), " ✓")));
    cr.append(h("p", { class: "muted", text: `thank you for playing ♡ — ${C.name}` }));
    $("#ending").hidden = false;
    document.body.classList.add("complete");
    SG.coins(10, "you found everything!");
  };
  $("#endingClose").addEventListener("click", () => { $("#ending").hidden = true; sfx.ok(); });
})();
