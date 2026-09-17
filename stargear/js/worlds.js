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

  /* ---------- SHRINE ---------- */
  C.faves.forEach(([k, v], i) => $("#faveGrid").append(
    h("div", { class: "fave", style: `--r:${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }, h("p", { class: "eyebrow", text: k }), h("p", { text: v }))));

  const QUIZ = [
    ["pick a snack for the long voyage:", [["melon pan", "venus"], ["spicy ramen", "mars"], ["star candy", "jupiter"], ["plain tea, thanks", "saturn"]]],
    ["your flip phone ringtone is:", [["a love song", "venus"], ["a boss battle theme", "mars"], ["random every day", "jupiter"], ["silent. always.", "saturn"]]],
    ["a free saturday. you:", [["make a gift for a friend", "venus"], ["enter a tournament", "mars"], ["take a train somewhere new", "jupiter"], ["fix an old clock", "saturn"]]],
    ["choose a charm:", [["🎀 ribbon", "venus"], ["🔥 flame", "mars"], ["🍀 clover", "jupiter"], ["⏳ hourglass", "saturn"]]],
  ];
  const RESULT = {
    venus: ["♀ VENUS", "soft, sparkly and full of love. you probably have the cutest stickers on your phone."],
    mars: ["♂ MARS", "brave, bold and a little chaotic. you'd absolutely beat me at snake."],
    jupiter: ["♃ JUPITER", "lucky and endlessly curious. every gacha pull goes your way."],
    saturn: ["♄ SATURN", "patient keeper of time. you'd be the one to rebuild the antikythera mechanism."],
  };
  function quiz(step = 0, tally = {}) {
    const q = $("#quiz"); q.innerHTML = "";
    if (step === QUIZ.length) {
      const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
      sfx.fanfare();
      q.append(h("p", { class: "eyebrow", text: "YOUR PLANET GEAR IS..." }), h("h3", { class: "quiz-result", text: RESULT[best][0] }), h("p", { text: RESULT[best][1] }),
        h("button", { class: "btn ghost small", onclick: () => quiz() }, "↻ AGAIN"));
      return;
    }
    const [question, opts] = QUIZ[step];
    q.append(h("p", { class: "eyebrow", text: `QUIZ · WHICH PLANET ARE YOU? ${step + 1}/${QUIZ.length}` }), h("p", { text: question }),
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
