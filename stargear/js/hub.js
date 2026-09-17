/* hub: the antikythera dial you turn to pick a world */
(function () {
  const { $, h, sfx } = SG;
  const NS = "http://www.w3.org/2000/svg";
  const s = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.append(el);
    return el;
  };

  SG.WORLDS = [
    { id: "about",     glyph: "☾", title: "STATUS",          jp: "ステータス",   planet: "MOON",    desc: "fun stats to share." },
    { id: "now",       glyph: "✎", title: "JOURNAL",         jp: "にっき",       planet: "MERCURY", desc: "what i'm up to lately." },
    { id: "research",  glyph: "♃", title: "RESEARCH WORLDS", jp: "けんきゅう",   planet: "JUPITER", desc: "explore my past projects." },
    { id: "phone",     glyph: "✆", title: "KEITAI",          jp: "ケータイ",     planet: "VENUS",   desc: "my flip phone ✆ contacts & tiny apps." },
    { id: "gacha",     glyph: "✿", title: "GACHAPON",        jp: "ガチャガチャ", planet: "SUN",     desc: "spin for capsule charms." },
    { id: "nagare",    glyph: "❋", title: "NAGARE",          jp: "ながれ",       planet: "SATURN",  desc: "art · flow · somatic meditation." },
    { id: "wishes",    glyph: "☆", title: "WISH TREE",       jp: "たなばた",     planet: "MARS",    desc: "leave a wish on the bamboo." },
    { id: "faves",     glyph: "⛩", title: "SHRINE",          jp: "せいち",       planet: "EARTH",   desc: "wind chimes, essays, and a spirit quiz." },
  ];
  const N = SG.WORLDS.length, STEP = 360 / N;

  /* ---------- gear geometry ---------- */
  SG.gearPath = function (r, teeth, depth = r * 0.12) {
    const pts = [], a = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const t = i * a;
      [[t, r - depth], [t + a * 0.12, r], [t + a * 0.45, r], [t + a * 0.57, r - depth]].forEach(([ang, rad]) =>
        pts.push((Math.sin(ang) * rad).toFixed(1) + "," + (-Math.cos(ang) * rad).toFixed(1)));
    }
    return "M" + pts.join("L") + "Z";
  };
  SG.makeGear = function (parent, { r, teeth, x = 0, y = 0, fill, stroke = "#2a1638", spokes = 5, ratio = 1, hole = 0.22 }) {
    const g = s("g", { transform: `translate(${x} ${y})` }, parent);
    const rot = s("g", {}, g);
    s("path", { d: SG.gearPath(r, teeth), fill, stroke, "stroke-width": 2, "stroke-linejoin": "round" }, rot);
    s("circle", { r: r * 0.72, fill: "none", stroke, "stroke-width": 1.5, opacity: 0.5 }, rot);
    for (let i = 0; i < spokes; i++) {
      const ang = (i / spokes) * Math.PI * 2;
      s("line", { x1: 0, y1: 0, x2: Math.sin(ang) * r * 0.7, y2: -Math.cos(ang) * r * 0.7, stroke, "stroke-width": r * 0.07, "stroke-linecap": "round", opacity: 0.35 }, rot);
    }
    s("circle", { r: r * hole, fill: "#fff6fb", stroke, "stroke-width": 2 }, rot);
    s("circle", { r: r * hole * 0.4, fill: stroke }, rot);
    return { el: rot, ratio };
  };

  /* ---------- build the dial ---------- */
  const svg = $("#dial");
  const defs = s("defs", {}, svg);
  defs.innerHTML = `
    <radialGradient id="plate" cx="40%" cy="35%" r="75%">
      <stop offset="0" stop-color="#f7d6a0"/><stop offset=".55" stop-color="#d8a85f"/><stop offset="1" stop-color="#8a5a2e"/>
    </radialGradient>
    <radialGradient id="patina" cx="70%" cy="75%" r="50%">
      <stop offset="0" stop-color="#5fb7a4" stop-opacity=".55"/><stop offset="1" stop-color="#5fb7a4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="face" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#3a2466"/><stop offset="1" stop-color="#1b1033"/>
    </radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

  const gears = [];
  const back = s("g", { class: "back-gears" }, svg);
  gears.push(SG.makeGear(back, { r: 118, teeth: 40, x: -205, y: -190, fill: "#e8b7d4", ratio: -0.5 }));
  gears.push(SG.makeGear(back, { r: 80, teeth: 28, x: 225, y: 205, fill: "#c9a7ff", ratio: 0.7 }));
  gears.push(SG.makeGear(back, { r: 62, teeth: 22, x: 240, y: -215, fill: "#9ff5d8", ratio: 0.9 }));

  // bronze plate + patina
  gears.push(SG.makeGear(svg, { r: 272, teeth: 96, fill: "url(#plate)", spokes: 0, ratio: 0.12, hole: 0 }));
  s("circle", { r: 250, fill: "url(#patina)" }, svg);

  // outer ring (bezel + inner face)
  const zod = s("g", {}, svg);
  s("circle", { r: 246, fill: "#fff0e0", stroke: "#2a1638", "stroke-width": 3 }, zod);
  s("circle", { r: 212, fill: "url(#face)", stroke: "#2a1638", "stroke-width": 3 }, zod);
  for (let i = 0; i < 72; i++) {
    const a = (i * 5) * Math.PI / 180, big = i % 6 === 0;
    s("line", { x1: Math.sin(a) * 212, y1: -Math.cos(a) * 212, x2: Math.sin(a) * (big ? 200 : 206), y2: -Math.cos(a) * (big ? 200 : 206), stroke: "#ffcfe6", "stroke-width": big ? 2 : 1 }, zod);
  }

  // inner spinning gear behind the worlds
  const inner = s("g", { opacity: 0.22 }, svg);
  gears.push(SG.makeGear(inner, { r: 150, teeth: 54, fill: "#ff8fc7", stroke: "#ffcfe6", spokes: 6, ratio: -0.3 }));
  // little orbiting stars
  const orbit = s("g", {}, svg);
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180;
    s("text", { x: Math.sin(a) * 88, y: -Math.cos(a) * 88, class: "tiny-star", "text-anchor": "middle", "dominant-baseline": "central" }, orbit).textContent = i % 3 ? "·" : "✦";
  }

  // pointer
  const pointer = s("g", { class: "pointer" }, svg);
  s("path", { d: "M-7 0 L0 -108 L7 0 Z", fill: "#ff4fa3", stroke: "#2a1638", "stroke-width": 3, "stroke-linejoin": "round" }, pointer);
  s("text", { y: -120, class: "pointer-star", "text-anchor": "middle", "dominant-baseline": "central", filter: "url(#glow)" }, pointer).textContent = "★";
  // center hub
  gears.push(SG.makeGear(svg, { r: 40, teeth: 14, fill: "#ffe27a", spokes: 4, ratio: 1.6, hole: 0.4 }));
  s("clipPath", { id: "moonClip" }, defs).append(s("circle", { r: 13 }));
  s("circle", { r: 13, fill: "#fff6fb" }, svg);
  const moonShade = s("circle", { r: 13, fill: "#3a2466", "clip-path": "url(#moonClip)" }, svg);
  s("circle", { r: 13, fill: "none", stroke: "#2a1638", "stroke-width": 2 }, svg);

  // world nodes
  const nodes = SG.WORLDS.map((w, i) => {
    const a = i * STEP * Math.PI / 180, R = 172;
    const g = s("g", { class: "node", transform: `translate(${(Math.sin(a) * R).toFixed(1)} ${(-Math.cos(a) * R).toFixed(1)})`, tabindex: -1, "data-i": i }, svg);
    const bob = s("g", { class: "bob", style: `animation-delay:${-i * 0.4}s` }, g);
    s("circle", { r: 31, class: "node-ring" }, bob);
    s("circle", { r: 25, class: "node-disc" }, bob);
    s("text", { class: "node-glyph", "text-anchor": "middle", "dominant-baseline": "central" }, bob).textContent = w.glyph;
    return g;
  });

  /* ---------- turning ---------- */
  let angle = 0, target = 0, selected = 0, crankSpeed = 0, lastTick = 0;
  const norm = i => ((i % N) + N) % N;

  function select(i, { quiet } = {}) {
    selected = norm(i);
    nodes.forEach((n, j) => n.classList.toggle("on", j === selected));
    const w = SG.WORLDS[selected];
    $("#wcPlanet").textContent = w.planet;
    $("#wcTitle").textContent = w.glyph + " " + w.title;
    $("#wcJp").textContent = w.jp;
    $("#wcDesc").textContent = w.desc;
    SG.$$("#quickNav button").forEach((b, j) => b.classList.toggle("on", j === selected));
    if (!quiet) sfx.move();
  }
  SG.turnTo = function (i) {
    // go the short way around
    let t = i * STEP;
    while (t - target > 180) t -= 360;
    while (target - t > 180) t += 360;
    target = t;
    select(i);
  };

  let drag = null;
  const center = () => { const r = svg.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const ptrAngle = e => { const [cx, cy] = center(); return Math.atan2(e.clientX - cx, -(e.clientY - cy)) * 180 / Math.PI; };

  svg.addEventListener("pointerdown", e => {
    drag = { start: ptrAngle(e), base: target, x: e.clientX, y: e.clientY, moved: false, node: e.target.closest(".node") };
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener("pointermove", e => {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true;
    if (!drag.moved) return;
    let d = ptrAngle(e) - drag.start;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    drag.start += d; // accumulate so you can spin many times
    target = drag.base = drag.base + d;
    crankSpeed = Math.min(12, crankSpeed + Math.abs(d) * 0.4);
    const i = norm(Math.round(target / STEP));
    if (i !== selected) select(i);
  });
  const end = () => {
    if (!drag) return;
    if (!drag.moved && drag.node) {
      const i = +drag.node.dataset.i;
      if (i === selected) SG.openWorld(SG.WORLDS[i].id); else SG.turnTo(i);
    } else if (drag.moved) {
      target = Math.round(target / STEP) * STEP;
    }
    drag = null;
  };
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);

  document.addEventListener("keydown", e => {
    if (!document.body.classList.contains("is-hub") || SG.openId) return;
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { SG.turnTo(selected + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { SG.turnTo(selected - 1); e.preventDefault(); }
    if (e.key === "Enter" && !e.target.matches("button")) SG.openWorld(SG.WORLDS[selected].id);
  });
  $("#warpBtn").addEventListener("click", () => SG.openWorld(SG.WORLDS[selected].id));

  const qn = $("#quickNav");
  SG.WORLDS.forEach((w, i) => qn.append(h("button", { class: "qn", onclick: () => { SG.turnTo(i); SG.openWorld(w.id); } }, h("span", { text: w.glyph }), " " + w.title)));

  /* ---------- the animation loop ---------- */
  let phase = 0, prev = performance.now();
  function frame(now) {
    const dt = Math.min(50, now - prev); prev = now;
    const calm = document.body.classList.contains("calm");
    const before = angle;
    angle += (target - angle) * Math.min(1, dt * 0.012);
    const moved = Math.abs(angle - before);
    crankSpeed *= 0.94;
    phase += dt * (calm ? 0.004 : 0.012) + moved * 1.5 + crankSpeed * 0.2;
    if (Math.abs(angle - lastTick) > 7.5) { lastTick = angle; sfx.tick(); }

    if (document.body.classList.contains("is-hub")) {
      pointer.setAttribute("transform", `rotate(${angle.toFixed(2)})`);
      gears.forEach(g => g.el.setAttribute("transform", `rotate(${(phase * g.ratio).toFixed(2)})`));
      orbit.setAttribute("transform", `rotate(${(phase * 0.08).toFixed(2)})`);
      // moon phase follows the pointer, like the real mechanism's lunar ball
      const p = ((angle % 360) + 360) % 360 / 360;
      moonShade.setAttribute("cx", (p < 0.5 ? p * 56 : -(1 - p) * 56).toFixed(2));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  select(0, { quiet: true });

  /* ---------- title-screen gear ---------- */
  const tg = document.createElementNS(NS, "svg");
  tg.setAttribute("viewBox", "-200 -200 400 400");
  $("#titleGear").append(tg);
  SG.makeGear(tg, { r: 190, teeth: 60, fill: "#ff8fc7", stroke: "#ffcfe6", spokes: 6 });
  SG.makeGear(tg, { r: 90, teeth: 30, fill: "#c9a7ff", stroke: "#ffcfe6", spokes: 5 });

  /* ---------- the shy moon (a hidden shard) ---------- */
  let pokes = 0;
  const moon = h("button", { class: "sky-moon", "aria-label": "the moon", title: "the moon" });
  moon.addEventListener("click", () => {
    pokes++;
    moon.classList.remove("wiggle"); void moon.offsetWidth; moon.classList.add("wiggle");
    SG.tone(600 + pokes * 150, 0.08);
    if (pokes === 1) SG.say("hey!! the moon is shy, don't poke it...");
    if (pokes >= 3) SG.shard("moon");
  });
  $("#hub").append(moon);
})();
