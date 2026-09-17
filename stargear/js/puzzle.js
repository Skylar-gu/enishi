/* puzzle: three meshed rings — align ☉ ☾ ✦ under the pointer */
(function () {
  const { $, h, sfx } = SG;
  const NS = "http://www.w3.org/2000/svg";
  const s = (tag, attrs, parent) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); parent && parent.append(el); return el; };
  const svg = $("#puzzle");

  const RINGS = [
    { r: 140, tr: 124, glyphs: [..."☉✿♡♪❀☂♠♣◆●▲■"], fill: "#d8a85f", hi: "#ffe27a" },
    { r: 104, tr: 88,  glyphs: [..."☾♈♉♊♋♌♍♎♏♐♑♒"], fill: "#ff8fc7", hi: "#fff6fb" },
    { r: 68,  tr: 52,  glyphs: [..."✦·○·◇·✧·○·◇·"], fill: "#c9a7ff", hi: "#fff6fb" },
  ];
  // each crank turns several rings — like a real gear train
  const CRANKS = [
    { name: "SUN CRANK",  glyph: "☉", v: [1, 2, 0] },
    { name: "MOON CRANK", glyph: "☾", v: [0, 1, -1] },
    { name: "STAR CRANK", glyph: "✦", v: [1, 0, 1] },
  ];

  const state = [0, 0, 0], rot = [0, 0, 0];
  let moves = 0, solvedOnce = false;

  const groups = RINGS.map((ring, i) => {
    const g = s("g", { class: "pz-ring" }, svg);
    s("path", { d: SG.gearPath(ring.r, 36 - i * 8, 8), fill: ring.fill, stroke: "#2a1638", "stroke-width": 2.5 }, g);
    s("circle", { r: ring.r - 30, fill: i === 2 ? "#1b1033" : "none", stroke: "#2a1638", "stroke-width": 2 }, g);
    ring.glyphs.forEach((gl, j) => {
      const a = j * 30 * Math.PI / 180;
      s("text", { x: (Math.sin(a) * ring.tr).toFixed(1), y: (-Math.cos(a) * ring.tr).toFixed(1), class: "pz-glyph" + (j === 0 ? " target" : ""), "text-anchor": "middle", "dominant-baseline": "central", transform: `rotate(${j * 30} ${(Math.sin(a) * ring.tr).toFixed(1)} ${(-Math.cos(a) * ring.tr).toFixed(1)})` }, g).textContent = gl;
    });
    return g;
  });
  s("circle", { r: 16, fill: "#ffe27a", stroke: "#2a1638", "stroke-width": 3 }, svg);
  // fixed pointer at the top
  s("path", { d: "M-14 -166 L14 -166 L0 -146 Z", fill: "#ff4fa3", stroke: "#2a1638", "stroke-width": 3, "stroke-linejoin": "round" }, svg);
  const glow = s("rect", { x: -16, y: -150, width: 32, height: 120, rx: 14, class: "pz-slot" }, svg);

  function render() {
    groups.forEach((g, i) => (g.style.transform = `rotate(${rot[i]}deg)`));
    $("#moves").textContent = moves;
    const solved = state.every(v => v === 0);
    svg.classList.toggle("solved", solved);
    if (solved && moves > 0 && !solvedOnce) {
      solvedOnce = true;
      $("#puzzleMsg").textContent = `✦ CALIBRATED in ${moves} moves! ✦`;
      sfx.fanfare();
      setTimeout(() => { SG.coins(3, "calibrated"); SG.shard("saturn"); }, 700);
    }
  }
  function turn(c, dir, { silent } = {}) {
    CRANKS[c].v.forEach((d, i) => {
      if (!d) return;
      state[i] = (((state[i] + d * dir) % 12) + 12) % 12;
      rot[i] += d * dir * 30;
    });
    if (!silent) { moves++; SG.tone(500 + c * 120, 0.05, { type: "triangle", vol: 0.07 }); SG.tone(250, 0.04, { when: 0.05, type: "triangle", vol: 0.05 }); }
  }

  const box = $("#cranks");
  CRANKS.forEach((c, i) => {
    const parts = c.v.map((d, j) => d ? `${["outer", "middle", "inner"][j]} ${d > 0 ? "+" : "−"}${Math.abs(d)}` : null).filter(Boolean).join(" · ");
    box.append(h("div", { class: "crank" },
      h("button", { class: "btn ghost small", "aria-label": c.name + " backward", onclick: () => { turn(i, -1); render(); } }, "⟲"),
      h("div", { class: "crank-label" }, h("b", { text: c.glyph + " " + c.name }), h("small", { text: parts })),
      h("button", { class: "btn ghost small", "aria-label": c.name + " forward", onclick: () => { turn(i, 1); render(); } }, "⟳")));
  });

  function scramble() {
    do { for (let k = 0; k < 9; k++) turn(Math.floor(Math.random() * 3), Math.random() < 0.5 ? 1 : -1, { silent: true }); }
    while (state.every(v => v === 0));
    moves = 0; solvedOnce = false;
    $("#puzzleMsg").textContent = "";
    render();
  }
  $("#scramble").addEventListener("click", () => { sfx.blip(); scramble(); });
  scramble();
})();
