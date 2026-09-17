/* phone: a working flip phone (keitai) with little apps */
(function () {
  const { $, h, sfx, save, persist, tone, note } = SG;
  const C = window.SITE;
  const phone = $("#phone"), body = $("#sbody"), skL = $("#skL"), skR = $("#skR"), screen = $("#screen");
  const WALLS = ["wall-pink", "wall-stars", "wall-gears", "wall-hearts"];
  let app = null;

  function setWall() { WALLS.forEach(w => screen.classList.remove(w)); screen.classList.add(WALLS[save.wallpaper % WALLS.length]); }
  setWall();
  $("#strapCharm").textContent = save.strap;

  /* ---------- open / close ---------- */
  function openPhone() {
    if (!phone.classList.contains("closed")) return;
    phone.classList.remove("closed");
    tone(1200, 0.03); tone(1800, 0.05, { when: 0.05 });
    setTimeout(() => launch(menu), 250);
  }
  function closePhone() {
    stopAll();
    phone.classList.add("closed");
    tone(300, 0.05, { type: "triangle", vol: 0.1 });
  }
  $("#lidOut").addEventListener("click", openPhone);
  document.addEventListener("world:close", e => { if (e.detail.id === "phone") { stopAll(); phone.classList.add("closed"); } });

  function stopAll() { if (app && app.stop) app.stop(); }
  function launch(a, ...args) {
    stopAll();
    app = a;
    body.innerHTML = "";
    body.className = "sbody";
    skL.textContent = a.left || ""; skR.textContent = a.right || "BACK";
    a.start(...args);
  }

  /* ---------- key routing ---------- */
  function press(k) {
    if (phone.classList.contains("closed")) { if (k === "ok" || k === "call") openPhone(); return; }
    if (k === "close") { closePhone(); return; }
    if (/^[0-9*#]$/.test(k)) tone([941, 697, 697, 697, 770, 770, 770, 852, 852, 852][+k] || 941, 0.05, { type: "sine", vol: 0.04 });
    else sfx.blip();
    if (k === "sr" && app === menu) { closePhone(); return; }
    if (k === "sr" && app !== menu && !(app.key && app.key("sr") === true)) { launch(menu); return; }
    if (app && app.key) app.key(k);
  }
  skL.addEventListener("click", () => press("sl"));
  skR.addEventListener("click", () => press("sr"));
  $("#keys").addEventListener("click", e => {
    const b = e.target.closest("[data-k]"); if (!b) return;
    b.classList.remove("press"); void b.offsetWidth; b.classList.add("press");
    press(b.dataset.k);
  });
  const KEYMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "ok", Backspace: "sr", " ": "ok" };
  document.addEventListener("keydown", e => {
    if (SG.openId !== "phone" || e.target.matches("input, textarea")) return;
    const k = KEYMAP[e.key] || (/^[0-9*#]$/.test(e.key) ? e.key : null);
    if (!k) return;
    if (e.target.matches("button") && !e.target.closest("#phone") && (e.key === "Enter" || e.key === " ")) return;
    e.preventDefault();
    const btn = $(`#keys [data-k="${CSS.escape(k)}"]`);
    if (btn) { btn.classList.remove("press"); void btn.offsetWidth; btn.classList.add("press"); }
    press(k);
  });

  // swipe on the screen for snake
  let touch = null;
  screen.addEventListener("touchstart", e => { touch = [e.touches[0].clientX, e.touches[0].clientY]; }, { passive: true });
  screen.addEventListener("touchend", e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch[0], dy = e.changedTouches[0].clientY - touch[1];
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) press(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    touch = null;
  });

  /* ---------- a scrolling list helper ---------- */
  function list(items, onPick, sel = 0) {
    const ul = h("ul", { class: "ph-list" });
    const draw = () => { ul.innerHTML = ""; items.forEach((it, i) => ul.append(h("li", { class: i === sel ? "sel" : "", onclick: () => { sel = i; draw(); onPick(i); } }, it))); ul.children[sel]?.scrollIntoView({ block: "nearest" }); };
    draw();
    return { el: ul, key(k) { if (k === "up") sel = (sel + items.length - 1) % items.length; if (k === "down") sel = (sel + 1) % items.length; if (k === "up" || k === "down") draw(); if (k === "ok" || k === "sl") onPick(sel); } };
  }

  /* ---------- MENU ---------- */
  const APPS = () => [
    ["☎", "CONTACTS", contacts], ["▦", "WALLPAPER", wallpaper],
  ];
  let menuSel = 0;
  const menu = {
    left: "SELECT", right: "CLOSE",
    start() {
      body.classList.add("menu");
      body.append(h("p", { class: "ph-title", text: "✦ MENU ✦" }));
      const grid = h("div", { class: "ph-grid two" });
      APPS().forEach(([ic, name, a], i) => grid.append(h("button", { class: "ph-app" + (i === menuSel ? " sel" : ""), tabindex: -1, onclick: () => { menuSel = i; launch(a); } },
        h("span", { class: "ic", text: ic }), h("span", { text: `${i + 1} ${name}` }))));
      body.append(grid,
        h("p", { class: "ph-foot", text: APPS()[menuSel][1] }),
        h("button", { class: "ph-send-btn", onclick: () => launch(mail) }, "✉ SEND A MESSAGE"));
      this.grid = grid;
    },
    key(k) {
      const n = APPS().length;
      if (k === "left")  menuSel = (menuSel + n - 1) % n;
      if (k === "right") menuSel = (menuSel + 1) % n;
      if (k === "up")    menuSel = (menuSel + n - 1) % n;
      if (k === "down")  menuSel = (menuSel + 1) % n;
      if (/^[1-2]$/.test(k)) { menuSel = +k - 1; launch(APPS()[menuSel][2]); return; }
      if (k === "3") { launch(mail); return; }
      if (k === "ok" || k === "sl" || k === "call") { launch(APPS()[menuSel][2]); return; }
      [...this.grid.children].forEach((b, i) => b.classList.toggle("sel", i === menuSel));
      body.querySelector(".ph-foot").textContent = APPS()[menuSel][1];
    },
  };

  /* ---------- MAIL ---------- */
  const mail = {
    left: "SEND",
    start() {
      body.append(h("p", { class: "ph-title", text: "✉ NEW MAIL" }), h("p", { class: "ph-small", text: "TO: " + C.name }));
      this.ta = h("textarea", { class: "ph-input", rows: 5, maxlength: 280, placeholder: "type a message ♡\n(opens your email app)" });
      body.append(this.ta, h("p", { class: "ph-small dim", text: "● or SEND to send" }));
      setTimeout(() => this.ta.focus({ preventScroll: true }), 50);
      this.ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.key("ok"); } if (e.key === "Escape") { this.ta.blur(); } });
    },
    key(k) {
      if (k === "ok" || k === "sl" || k === "call") {
        const msg = this.ta.value.trim();
        if (!msg) { sfx.bad(); this.ta.focus(); return; }
        location.href = `mailto:${C.email}?subject=${encodeURIComponent("hello from SKYLAR★GU ✦")}&body=${encodeURIComponent(msg)}`;
        body.innerHTML = ""; body.append(h("p", { class: "ph-center blink", text: "✉ SENDING..." }), h("p", { class: "ph-center ph-small", text: "your mail app should open ♡" }));
        sfx.ok();
      }
    },
  };

  /* ---------- CONTACTS ---------- */
  const contacts = {
    left: "CALL",
    start() {
      body.append(h("p", { class: "ph-title", text: "☎ ADDRESS BOOK" }));
      this.l = list(C.contacts.map(c => [h("span", { class: "ic", text: c.icon }), " " + c.name]), i => window.open(C.contacts[i].url, "_blank", "noopener"));
      body.append(this.l.el);
    },
    key(k) { this.l.key(k === "call" ? "ok" : k); },
  };

  /* ---------- SNAKE ---------- */
  const snake = {
    left: "", right: "BACK",
    start() {
      const W = 16, H = 13, S = 10;
      const cv = h("canvas", { class: "snake", width: W * S, height: H * S });
      const hud = h("p", { class: "ph-small snake-hud" });
      body.append(hud, cv);
      const ctx = cv.getContext("2d");
      let sn, dir, next, food, score, dead, started;
      const reset = () => { sn = [[5, 6], [4, 6], [3, 6]]; dir = [1, 0]; next = [1, 0]; score = 0; dead = false; started = false; place(); draw(); };
      const place = () => { do { food = [Math.floor(Math.random() * W), Math.floor(Math.random() * H)]; } while (sn.some(p => p[0] === food[0] && p[1] === food[1])); };
      const draw = () => {
        ctx.fillStyle = "#1e3a2c"; ctx.fillRect(0, 0, W * S, H * S);
        ctx.fillStyle = "#274a38"; for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if ((x + y) % 2) ctx.fillRect(x * S, y * S, S, S);
        // a tiny pixel strawberry
        const fx = food[0] * S, fy = food[1] * S;
        ctx.fillStyle = "#ff3b6b"; ctx.fillRect(fx + 2, fy + 3, 6, 5); ctx.fillRect(fx + 3, fy + 8, 4, 1);
        ctx.fillStyle = "#7dff9a"; ctx.fillRect(fx + 3, fy + 1, 4, 2);
        ctx.fillStyle = "#ffe27a"; ctx.fillRect(fx + 4, fy + 5, 1, 1);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        sn.forEach(([x, y], i) => { ctx.fillStyle = i ? "#ffb3da" : "#ff4fa3"; ctx.fillRect(x * S + 1, y * S + 1, S - 2, S - 2); });
        hud.textContent = `SCORE ${score}  ·  BEST ${save.snakeBest}`;
        if (!started || dead) {
          ctx.fillStyle = "rgba(30,16,50,.75)"; ctx.fillRect(0, H * S / 2 - 16, W * S, 32);
          ctx.fillStyle = "#fff"; ctx.font = "10px 'DotGothic16', monospace";
          ctx.fillText(dead ? "GAME OVER · ● retry" : "● to start · 2468/arrows", W * S / 2, H * S / 2);
        }
      };
      const step = () => {
        if (!started || dead) return;
        dir = next;
        const head = [(sn[0][0] + dir[0] + W) % W, (sn[0][1] + dir[1] + H) % H];
        if (sn.some(p => p[0] === head[0] && p[1] === head[1])) {
          dead = true; sfx.bad();
          if (score > save.snakeBest) { save.snakeBest = score; persist(); }
          if (score >= 5) SG.coins(Math.floor(score / 5), "snake");
          if (score >= 10) SG.shard("mars");
          draw(); return;
        }
        sn.unshift(head);
        if (head[0] === food[0] && head[1] === food[1]) { score++; tone(note(72 + (score % 12)), 0.06); place(); }
        else sn.pop();
        draw();
      };
      reset();
      this.timer = setInterval(step, 150);
      const D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], 2: [0, -1], 8: [0, 1], 4: [-1, 0], 6: [1, 0] };
      this.onkey = k => {
        if (k === "ok" || k === "5") { if (dead) reset(); started = true; draw(); return; }
        const d = D[k]; if (!d) return;
        if (!started) { started = true; }
        if (d[0] !== -dir[0] || d[1] !== -dir[1]) next = d;
      };
    },
    key(k) { this.onkey(k); },
    stop() { clearInterval(this.timer); },
  };

  /* ---------- MELODY ---------- */
  const NAMES = ["", "do", "re", "mi", "fa", "so", "la", "ti", "DO"];
  const MIDI = [0, 72, 74, 76, 77, 79, 81, 83, 84];
  const melody = {
    left: "PLAY",
    start() {
      this.notes = [];
      body.append(h("p", { class: "ph-title", text: "♫ CHAKUMERO" }), h("p", { class: "ph-small", text: "1-8 notes · 0 rest · # play · * clear" }));
      this.staff = h("div", { class: "staff" });
      body.append(this.staff);
      this.draw();
    },
    draw(playing = -1) {
      this.staff.innerHTML = "";
      if (!this.notes.length) this.staff.append(h("span", { class: "dim", text: "compose a ringtone ♪" }));
      this.notes.forEach((n, i) => this.staff.append(h("span", { class: "nt" + (i === playing ? " on" : ""), style: `--y:${n ? (8 - n) * 3 : 12}px`, text: n ? NAMES[n] : "·" })));
    },
    key(k) {
      if (/^[0-8]$/.test(k) && this.notes.length < 24) {
        this.notes.push(+k); if (+k) tone(note(MIDI[+k]), 0.18, { vol: 0.06, force: true });
        this.draw();
      }
      if (k === "9") tone(note(86), 0.18, { vol: 0.06 });
      if (k === "*") { this.notes = []; this.draw(); }
      if (k === "#" || k === "sl" || k === "ok") this.play();
    },
    play() {
      clearTimeout(this.t);
      const ns = this.notes; if (!ns.length) return;
      ns.forEach((n, i) => n && tone(note(MIDI[n]), 0.2, { when: i * 0.2, vol: 0.06, force: true }));
      ns.forEach((_, i) => setTimeout(() => app === this && this.draw(i), i * 200));
      this.t = setTimeout(() => app === this && this.draw(), ns.length * 200);
      if (ns.filter(Boolean).length >= 8) setTimeout(() => SG.shard("mercury"), ns.length * 200 + 200);
    },
    stop() { clearTimeout(this.t); },
  };

  /* ---------- FORTUNE ---------- */
  const LUCK = [["大吉", "GREAT LUCK"], ["中吉", "GOOD LUCK"], ["小吉", "SMALL LUCK"], ["吉", "LUCK"], ["末吉", "LUCK... LATER"]];
  const COLORS = ["strawberry pink", "moon silver", "melon green", "lavender", "sunshine yellow", "bronze", "sky blue"];
  const ITEMS = ["a flip phone strap", "a gear", "melon pan", "a purikura sticker", "a lost button", "a tiny star", "bubble tea"];
  const fortune = {
    left: "DRAW",
    start() {
      body.append(h("p", { class: "ph-title", text: "✧ TODAY'S FORTUNE" }));
      this.out = h("div", { class: "fortune" }, h("p", { class: "ph-center", text: "shake the gears..." }), h("p", { class: "ph-center ph-small blink", text: "press ●" }));
      body.append(this.out);
    },
    key(k) {
      if (k !== "ok" && k !== "sl") return;
      this.out.innerHTML = ""; this.out.append(h("p", { class: "ph-center spin-txt", text: "⚙" }));
      [0, 1, 2, 3].forEach(i => tone(600 + i * 200, 0.05, { when: i * 0.08 }));
      setTimeout(() => {
        const r = n => Math.floor(Math.random() * n);
        const [jp, en] = LUCK[r(LUCK.length)];
        const planet = SG.SHARDS[r(7)];
        this.out.innerHTML = "";
        this.out.append(h("p", { class: "luck", text: jp }), h("p", { class: "ph-center", text: en }),
          h("p", { class: "ph-small", text: "♡ color: " + COLORS[r(COLORS.length)] }),
          h("p", { class: "ph-small", text: "✦ item: " + ITEMS[r(ITEMS.length)] }),
          h("p", { class: "ph-small", text: `${planet.glyph} ruling planet: ${planet.name.toLowerCase()}` }));
        sfx.ok();
        const today = new Date().toDateString();
        if (save.lastFortune !== today) { save.lastFortune = today; persist(); SG.coins(1, "daily fortune"); }
      }, document.body.classList.contains("calm") ? 100 : 700);
    },
  };

  /* ---------- WALLPAPER ---------- */
  const wallpaper = {
    left: "SET",
    start() {
      body.append(h("p", { class: "ph-title", text: "▦ WALLPAPER" }), h("p", { class: "ph-center wall-name" }), h("p", { class: "ph-small ph-center", text: "◀ ▶ to change" }));
      this.draw();
    },
    draw() { body.querySelector(".wall-name").textContent = `◀ ${["pink", "stars", "gears", "hearts"][save.wallpaper % 4]} ▶`; },
    key(k) {
      if (k === "left") save.wallpaper = (save.wallpaper + 3) % 4;
      if (k === "right") save.wallpaper = (save.wallpaper + 1) % 4;
      if (k === "ok" || k === "sl") { sfx.ok(); launch(menu); }
      persist(); setWall(); if (app === this) this.draw();
    },
  };

  SG.phone = { press, setStrap: c => { $("#strapCharm").textContent = c; } };
})();
