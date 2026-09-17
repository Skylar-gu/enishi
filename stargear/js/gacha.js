/* gacha: spend stardust, get capsule phone charms */
(function () {
  const { $, h, sfx, save, persist } = SG;
  const CHARMS = [
    ["🍓", "strawberry", 1], ["🎀", "ribbon", 1], ["🌸", "sakura", 1], ["⭐", "star", 1], ["🍡", "dango", 1], ["🐚", "seashell", 1],
    ["🍒", "cherries", 1], ["🧸", "teddy", 1], ["🐰", "usagi", 2], ["🌙", "crescent", 2], ["💿", "mini disc", 2], ["📼", "tape", 2],
    ["🦢", "swan", 2], ["💎", "jewel", 3], ["⚙️", "golden gear", 3], ["🪐", "saturn", 3],
  ];
  const CAPS = ["#ff8fc7", "#c9a7ff", "#9ff5d8", "#ffe27a", "#ffb38f", "#8fd3ff"];
  const dome = $("#dome"), knob = $("#knob"), out = $("#capsuleOut"), reveal = $("#reveal");

  // capsules piled in the dome
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 5), col = i % 5;
    dome.append(h("span", { class: "cap", style: `--c:${CAPS[i % CAPS.length]}; left:${10 + col * 17 + (row % 2) * 8}%; bottom:${6 + row * 15}%; --r:${(i * 47) % 360}deg` }));
  }

  function book() {
    const b = $("#book"); b.innerHTML = "";
    CHARMS.forEach(([e, name, r]) => {
      const n = save.charms[name] || 0;
      const cell = h("button", { class: "charm" + (n ? " got" : ""), title: n ? `${name} ×${n} — click to wear on your phone` : "???" },
        h("span", { class: "ce", text: n ? e : "?" }), h("span", { class: "cr", text: "★".repeat(r) }));
      if (n) cell.addEventListener("click", () => { save.strap = e; persist(); SG.phone.setStrap(e); sfx.ok(); SG.toast(`${e} is now your phone strap!`); });
      b.append(cell);
    });
    const got = CHARMS.filter(c => save.charms[c[1]]).length;
    $("#bookCount").textContent = `${got}/${CHARMS.length}`;
    return got;
  }
  book();

  let busy = false, pending = null;
  function roll() {
    const pool = CHARMS.flatMap(c => Array(c[2] === 1 ? 10 : c[2] === 2 ? 4 : 1).fill(c));
    return pool[Math.floor(Math.random() * pool.length)];
  }

  knob.addEventListener("click", () => {
    if (busy || pending) { if (pending) SG.say("open your capsule first! it's in the chute ♡"); return; }
    if (save.coins < 1) {
      sfx.bad();
      SG.say("out of stardust! try snake on the phone, the gear puzzle, or a daily fortune ✦");
      return;
    }
    busy = true;
    SG.coins(-1);
    knob.classList.remove("turn"); void knob.offsetWidth; knob.classList.add("turn");
    dome.classList.add("shake");
    [0, 1, 2, 3, 4, 5].forEach(i => SG.tone(300 + (i % 2) * 80, 0.05, { when: i * 0.1, type: "triangle", vol: 0.08 }));
    setTimeout(() => {
      dome.classList.remove("shake");
      pending = roll();
      out.style.setProperty("--c", CAPS[Math.floor(Math.random() * CAPS.length)]);
      out.hidden = false;
      out.classList.remove("drop"); void out.offsetWidth; out.classList.add("drop");
      SG.tone(900, 0.08, { slide: 0.5 });
      reveal.innerHTML = ""; reveal.append(h("p", { class: "blink", text: "▼ a capsule! click it to open" }));
      busy = false;
    }, 900);
  });

  out.addEventListener("click", () => {
    if (!pending) return;
    const [e, name, r] = pending; pending = null;
    out.hidden = true;
    const isNew = !save.charms[name];
    save.charms[name] = (save.charms[name] || 0) + 1;
    save.strap = e; persist(); SG.phone.setStrap(e);
    reveal.innerHTML = "";
    reveal.append(h("div", { class: "pop-charm r" + r }, h("span", { class: "big-charm", text: e }),
      h("p", { class: "stars", text: "★".repeat(r) + "☆".repeat(3 - r) }),
      h("p", {}, h("b", { text: name.toUpperCase() }), isNew ? h("span", { class: "new", text: " NEW!" }) : ` (×${save.charms[name]})`),
      h("p", { class: "muted small", text: "now hanging from your phone ♡" })));
    r === 3 ? sfx.fanfare() : sfx.ok();
    const got = book();
    if (got >= 5) SG.shard("jupiter");
  });
})();
