/* main: title screen, sky, HUD, mascot, secrets */
(function () {
  const { $, h, sfx, save, persist } = SG;
  const C = window.SITE;
  const body = document.body;

  /* ---------- toggles ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (save.calm === null ? reduce : save.calm) body.classList.add("calm");
  const syncBtns = () => {
    $("#soundBtn").setAttribute("aria-pressed", save.sound);
    $("#musicBtn").setAttribute("aria-pressed", save.music);
    $("#motionBtn").setAttribute("aria-pressed", body.classList.contains("calm"));
  };
  $("#soundBtn").addEventListener("click", () => { save.sound = !save.sound; persist(); syncBtns(); sfx.blip(); });
  $("#musicBtn").addEventListener("click", () => { save.music = !save.music; persist(); syncBtns(); save.music ? SG.startMusic() : SG.stopMusic(); });
  $("#motionBtn").addEventListener("click", () => {
    body.classList.toggle("calm"); save.calm = body.classList.contains("calm"); persist(); syncBtns();
    SG.toast(save.calm ? "☾ calm mode: less motion" : "✦ sparkle mode: full motion");
  });
  syncBtns();

  $("#coinCount").textContent = save.coins;
  SG.renderShards();

  /* ---------- clocks ---------- */
  const tick = () => {
    const d = new Date(), t = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    ["#hudClock", "#phClock", "#miniClock"].forEach(s => ($(s).textContent = t));
  };
  tick(); setInterval(tick, 10000);

  /* ---------- starry sky ---------- */
  const sky = $("#sky"), sc = sky.getContext("2d");
  let stars = [], shooting = null;
  const resize = () => {
    sky.width = Math.ceil(innerWidth / 3); sky.height = Math.ceil(innerHeight / 3); // chunky pixels
    stars = Array.from({ length: Math.floor(sky.width * sky.height / 900) }, () => ({
      x: Math.random() * sky.width | 0, y: Math.random() * sky.height | 0, p: Math.random() * 6.28, s: Math.random() < 0.12 ? 2 : 1,
      c: ["#fff6fb", "#ffcfe6", "#c9a7ff", "#9ff5d8"][Math.random() * 4 | 0],
    }));
  };
  resize(); addEventListener("resize", resize);
  function drawSky(now) {
    const calm = body.classList.contains("calm");
    sc.clearRect(0, 0, sky.width, sky.height);
    stars.forEach(st => {
      const tw = calm ? 0.8 : 0.5 + 0.5 * Math.sin(now / 700 + st.p);
      sc.globalAlpha = tw; sc.fillStyle = st.c;
      if (st.s === 2) { sc.fillRect(st.x - 1, st.y, 3, 1); sc.fillRect(st.x, st.y - 1, 1, 3); }
      else sc.fillRect(st.x, st.y, 1, 1);
    });
    if (!calm) {
      if (!shooting && Math.random() < 0.002) shooting = { x: Math.random() * sky.width, y: Math.random() * sky.height * 0.4, l: 0 };
      if (shooting) {
        shooting.l += 1.6;
        for (let i = 0; i < 10; i++) { sc.globalAlpha = (1 - i / 10) * 0.9; sc.fillStyle = "#fff"; sc.fillRect(shooting.x + shooting.l - i * 1.6 | 0, shooting.y + (shooting.l - i * 1.6) * 0.5 | 0, 1, 1); }
        if (shooting.l > 70) shooting = null;
      }
    }
    sc.globalAlpha = 1;
    requestAnimationFrame(drawSky);
  }
  requestAnimationFrame(drawSky);

  /* ---------- sparkle trail (gentle) ---------- */
  let lastSpark = 0;
  addEventListener("pointermove", e => {
    if (body.classList.contains("calm") || e.pointerType !== "mouse") return;
    const now = performance.now(); if (now - lastSpark < 70) return; lastSpark = now;
    const sp = h("span", { class: "spark", text: ["✦", "·", "✧", "♡"][Math.random() * 4 | 0], style: `left:${e.clientX}px; top:${e.clientY}px; --dx:${(Math.random() - 0.5) * 30}px` });
    body.append(sp); setTimeout(() => sp.remove(), 800);
  });

  /* ---------- mascot ---------- */
  const bunny = $("#bunny");
  SG.drawSprite(bunny, SG.SPRITES.bunny);
  setInterval(() => { SG.drawSprite(bunny, SG.SPRITES.bunnyBlink); setTimeout(() => SG.drawSprite(bunny, SG.SPRITES.bunny), 140); }, 3800);

  const hour = new Date().getHours();
  const greet = hour < 5 ? "up late? the stars are extra sparkly right now" : hour < 12 ? "good morning!" : hour < 18 ? "good afternoon!" : "good evening ✦";
  const TIPS = {
    about: "that's " + C.name + "! click the dialog box to hear more.",
    now: "this diary gets updated whenever something new happens ♡",
    research: "each planet is a project. land on one to explore it!",
    phone: "tap the phone to flip it open. i love the snake game...",
    gacha: "one stardust per spin. there are 3 super rare charms!",
    calibrate: "each crank turns more than one ring. think like a gear!",
    wishes: "tie a wish to the bamboo ✦ you can click the strips to read them.",
    faves: "take the quiz! i'm definitely a jupiter.",
  };
  document.addEventListener("world:open", e => { if (e.detail.first) setTimeout(() => SG.say(TIPS[e.detail.id] || ""), 450); });

  let talk = 0;
  $("#mascotBtn").addEventListener("click", () => {
    sfx.blip();
    const missing = SG.SHARDS.filter(s => !save.shards.includes(s.id));
    const lines = [
      `i'm hoshi, the gear bunny! ${greet}`,
      missing.length ? `hint: ${missing[talk % missing.length].hint}` : "you found every shard!! you're amazing ♡",
      `you have ${save.coins} stardust. the gachapon is calling...`,
      "drag the big dial to spin the mechanism ✦",
    ];
    SG.say(lines[talk++ % lines.length]);
  });

  /* ---------- title → hub ---------- */
  let started = false;
  function start() {
    if (started) return; started = true;
    sfx.ok();
    body.classList.add("leaving-title");
    setTimeout(() => {
      body.classList.remove("is-title", "leaving-title");
      body.classList.add("is-hub");
      if (save.music) SG.startMusic();
      const today = new Date().toDateString();
      const back = save.lastVisit && save.lastVisit !== today;
      if (save.lastVisit !== today) { save.lastVisit = today; persist(); if (back) setTimeout(() => SG.coins(1, "welcome back"), 900); }
      setTimeout(() => SG.say(back ? `welcome back! ${greet}` : `${greet} i'm hoshi ✦ spin the dial and pick a world. 7 star shards are hidden around here...`), 600);
      const id = location.hash.slice(1);
      if (SG.WORLDS.some(w => w.id === id)) SG.openWorld(id);
    }, body.classList.contains("calm") ? 50 : 600);
  }
  $("#startBtn").addEventListener("click", start);
  $("#title").addEventListener("click", e => { if (e.target.id !== "startBtn") start(); });
  addEventListener("keydown", e => { if (!started && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); start(); } });
  if (location.hash.length > 1) start(); // deep links skip the title

  $("#homeBtn").addEventListener("click", () => { if (!started) start(); else SG.closeWorld(); });

  /* ---------- konami code → the sun ---------- */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  addEventListener("keydown", e => {
    kpos = e.key.toLowerCase() === KONAMI[kpos].toLowerCase() ? kpos + 1 : (e.key === "ArrowUp" ? (kpos === 2 ? 2 : 1) : 0);
    if (kpos === KONAMI.length) {
      kpos = 0;
      body.classList.add("konami"); setTimeout(() => body.classList.remove("konami"), 2500);
      if (!SG.shard("sun")) SG.toast("☉ the sun already shines for you");
    }
  });

  if (save.shards.length === 7) body.classList.add("complete");
})();
