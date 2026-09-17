/* core: save data, sound, toasts, the mascot, shards + stardust */
window.SG = (function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && el.append(c));
    return el;
  };

  /* ---------- save data (localStorage, but never required) ---------- */
  const KEY = "stargear-save-v1";
  const defaults = {
    coins: 3, shards: [], charms: {}, strap: "🍓", wishes: [],
    sound: true, music: false, calm: null, wallpaper: 0, snakeBest: 0, lastVisit: "",
  };
  let save = { ...defaults };
  try { save = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };

  /* ---------- sound: tiny square-wave chip synth ---------- */
  let ctx = null;
  const ac = () => {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  function tone(freq, dur = 0.08, { type = "square", vol = 0.05, when = 0, slide = 0, force = false } = {}) {
    if (!save.sound && !force) return;
    const a = ac(); if (!a || !freq) return;
    const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  const note = n => 440 * Math.pow(2, (n - 69) / 12); // midi -> Hz
  const sfx = {
    blip: () => tone(988, 0.04, { vol: 0.03 }),
    move: () => tone(660, 0.03, { vol: 0.025 }),
    ok: () => { tone(784, 0.06); tone(1175, 0.09, { when: 0.06 }); },
    back: () => { tone(523, 0.05); tone(392, 0.08, { when: 0.05 }); },
    coin: () => { tone(988, 0.05); tone(1319, 0.2, { when: 0.05 }); },
    warp: () => tone(220, 0.35, { type: "triangle", vol: 0.08, slide: 6 }),
    bad: () => tone(160, 0.2, { type: "sawtooth", vol: 0.04 }),
    tick: () => tone(2400, 0.015, { vol: 0.015, type: "triangle" }),
    fanfare: () => [72, 76, 79, 84, 79, 84].forEach((n, i) => tone(note(n), 0.14, { when: i * 0.11, vol: 0.05 })),
  };

  /* background music: a gentle city-pop-ish chip loop */
  let musicTimer = null;
  function startMusic() {
    const a = ac(); if (!a || musicTimer) return;
    const chords = [[65, 69, 72, 76], [62, 65, 69, 72], [67, 71, 74, 77], [64, 67, 71, 74]]; // Fmaj7 Dm7 G7 Em7
    const lead = [76, 74, 72, 74, 76, 79, 76, 0, 74, 72, 69, 72, 74, 0, 71, 72];
    let step = 0;
    const beat = 0.19;
    musicTimer = setInterval(() => {
      const c = chords[Math.floor(step / 16) % 4];
      const arp = c[step % 4] - 12;
      tone(note(arp), beat * 0.9, { type: "triangle", vol: 0.035, force: true });
      if (step % 8 === 0) tone(note(c[0] - 24), beat * 3, { type: "triangle", vol: 0.05, force: true });
      const l = lead[step % 16];
      if (l && step % 32 >= 16) tone(note(l), beat * 0.8, { vol: 0.018, force: true });
      step++;
    }, beat * 1000);
  }
  function stopMusic() { clearInterval(musicTimer); musicTimer = null; }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg, ms = 2600) {
    const t = $("#toast");
    t.innerHTML = msg; t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), ms);
  }

  /* ---------- mascot speech (typewriter) ---------- */
  let sayT, hideT;
  function say(text, ms = 5200) {
    const b = $("#bubble");
    clearInterval(sayT); clearTimeout(hideT);
    b.textContent = ""; b.classList.add("show");
    let i = 0;
    const calm = document.body.classList.contains("calm");
    if (calm) { b.textContent = text; }
    else sayT = setInterval(() => {
      b.textContent = text.slice(0, ++i);
      if (i % 2) tone(1400 + Math.random() * 300, 0.02, { vol: 0.012 });
      if (i >= text.length) clearInterval(sayT);
    }, 28);
    hideT = setTimeout(() => b.classList.remove("show"), ms + text.length * 28);
  }

  /* ---------- stardust ---------- */
  function coins(delta, why) {
    save.coins = Math.max(0, save.coins + delta); persist();
    $("#coinCount").textContent = save.coins;
    if (delta > 0) { sfx.coin(); toast(`+${delta} ✦ stardust${why ? " · " + why : ""}`); }
    const c = $(".coins"); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
  }

  /* ---------- star shards: the 7 classical planets on the mechanism ---------- */
  const SHARDS = [
    { id: "sun",     glyph: "☉", name: "SUN",     hint: "an old code, known to every gamer, wakes the sun." },
    { id: "moon",    glyph: "☾", name: "MOON",    hint: "the moon in the sky is shy. poke it a few times." },
    { id: "mercury", glyph: "☿", name: "MERCURY", hint: "the messenger loves music. compose on the phone." },
    { id: "venus",   glyph: "♀", name: "VENUS",   hint: "venus listens to wishes on bamboo." },
    { id: "mars",    glyph: "♂", name: "MARS",    hint: "mars wants a snake score of 10 or more." },
    { id: "jupiter", glyph: "♃", name: "JUPITER", hint: "lucky jupiter smiles on 5 different charms." },
    { id: "saturn",  glyph: "♄", name: "SATURN",  hint: "saturn, keeper of time, wants the gears aligned." },
  ];
  function renderShards() {
    const el = $("#shardDots"); el.innerHTML = "";
    SHARDS.forEach(s => {
      const got = save.shards.includes(s.id);
      el.append(h("span", { class: "shard" + (got ? " got" : ""), title: got ? s.name : "??? — " + s.hint, text: got ? s.glyph : "·" }));
    });
    document.dispatchEvent(new CustomEvent("shards"));
  }
  function shard(id) {
    if (save.shards.includes(id)) return false;
    const s = SHARDS.find(x => x.id === id);
    save.shards.push(id); persist();
    renderShards();
    sfx.fanfare();
    toast(`<span class="big">${s.glyph}</span> STAR SHARD: ${s.name}!<br><small>${save.shards.length} / 7 found</small>`, 4000);
    setTimeout(() => coins(2, "shard bonus"), 1200);
    if (save.shards.length === 7) setTimeout(() => SG.ending && SG.ending(), 3200);
    return true;
  }

  return { $, $$, h, save, persist, tone, note, sfx, startMusic, stopMusic, toast, say, coins, SHARDS, shard, renderShards };
})();
